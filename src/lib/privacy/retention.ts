// Retention clean-up (RA 10173 Sec. 11(e): keep personal data only as long as needed). Server-only.
//
// What it does (and nothing else):
//  - Leads (booking requests, enquiries, early-access and newsletter sign-ups) created before the cut-off are
//    anonymised with anonymiseLead(): name, email, phone, message, booking item and staff notes are replaced, while
//    kind, dates, status and non-identifying choices stay, so lead counts and demand statistics still add up.
//  - Payment records that never got paid (expired, cancelled, failed, or still "pending" long after checkout links
//    expire) and are older than the unpaid cut-off lose their contact details. Paid records are never touched: they
//    are kept for tax and accounting.
//  - Class bookings for sessions held before the lead cut-off are anonymised with anonymiseBooking(): name, email
//    and member id are replaced, while session, date, status and amount stay for attendance statistics.
//  - Unpaid holds that ran out (status "expired") more than EXPIRED_HOLD_RETENTION_DAYS ago, for sessions that have
//    already taken place, are deleted outright: they never became a booking. A hold whose payment went through is
//    kept (staff may still need to confirm or refund it).
// Bookings for sessions that haven't started are never touched. Apart from those expired holds nothing is deleted,
// and already-anonymised records are skipped, so running it twice is harmless.
//
// It never runs on its own. Ways to run it:
//  - Admin → Privacy (/admin/privacy): preview the counts, then press "Run clean-up now".
//  - Scheduled: GET /api/privacy/retention with "Authorization: Bearer <CRON_SECRET>". On Vercel, set the
//    CRON_SECRET env var (Vercel Cron sends it automatically) and add to vercel.json:
//      { "crons": [{ "path": "/api/privacy/retention", "schedule": "0 19 * * 0" }] }   (weekly, Mondays 03:00 Manila)
//    Add ?dryRun=1 to only report what would change.
import { listBookings, rewriteBookings } from "@/lib/bookings/store";
import { effectiveStatus, type Booking } from "@/lib/bookings/types";
import { listLeads, rewriteLeads } from "@/lib/leads/store";
import type { Lead } from "@/lib/leads/types";
import { listPayments, rewritePayments } from "@/lib/payments/store";
import type { Payment } from "@/lib/payments/types";
import { anonymiseBooking, anonymiseLead, DELETED, isAnonymisedBooking, isAnonymisedLead, isStrippedPayment, stripPaymentContact } from "./anonymise";

// TODO(lawyer): confirm the retention period for leads (proposal: 24 months after the request was sent). Keep the
// privacy policy (/privacy#retention) in step when this changes.
export const LEAD_RETENTION_MONTHS = 24;
// TODO(lawyer/accountant): confirm how long unpaid checkout records are kept (proposal: 90 days). Paid records
// follow the tax and accounting retention rules and are never cleaned up here.
export const UNPAID_PAYMENT_RETENTION_DAYS = 90;
/** Unpaid class-booking holds that ran out are deleted this many days after the hold expired (session over). */
export const EXPIRED_HOLD_RETENTION_DAYS = 7;

const UNPAID: ReadonlySet<Payment["status"]> = new Set(["pending", "expired", "cancelled", "failed"]);

export type RetentionOptions = { now?: Date; dryRun?: boolean; leadMonths?: number; unpaidDays?: number; expiredHoldDays?: number };
export type RetentionReport = {
  dryRun: boolean;
  ranAt: string;
  leadCutoff: string;
  unpaidPaymentCutoff: string;
  expiredHoldCutoff: string;
  leadsAnonymised: number;
  paymentsStripped: number;
  bookingsAnonymised: number;
  expiredHoldsDeleted: number;
};

/** `now` minus whole calendar months (UTC), e.g. 2026-11-27 minus 24 months = 2024-11-27. */
export function monthsBefore(now: Date, months: number): Date {
  const d = new Date(now.getTime());
  d.setUTCMonth(d.getUTCMonth() - months);
  return d;
}

export function leadExpired(lead: Lead, cutoff: Date): boolean {
  return !isAnonymisedLead(lead) && Date.parse(lead.createdAt) < cutoff.getTime();
}

export function unpaidPaymentExpired(payment: Payment, cutoff: Date): boolean {
  return UNPAID.has(payment.status) && !isStrippedPayment(payment) && Date.parse(payment.createdAt) < cutoff.getTime();
}

const sessionOver = (b: Booking, now: Date) => Date.parse(b.startAt) <= now.getTime();

/** A booking for a session held before the lead cut-off (so never a future one), not yet anonymised. */
export function bookingExpired(b: Booking, cutoff: Date, now: Date): boolean {
  return !isAnonymisedBooking(b) && sessionOver(b, now) && Date.parse(b.startAt) < cutoff.getTime();
}

/**
 * An unpaid hold that ran out before `cutoff`, for a session that is over, and whose payment (if any) never went
 * through (`paidPaymentIds`: ids of payments with status "paid" or "refunded").
 */
export function expiredHoldStale(b: Booking, cutoff: Date, now: Date, paidPaymentIds: ReadonlySet<string>): boolean {
  if (effectiveStatus(b, now.getTime()) !== "expired" || !sessionOver(b, now)) return false;
  if (b.paymentId && paidPaymentIds.has(b.paymentId)) return false;
  const expiredAt = Date.parse(b.holdExpiresAt ?? "") || Date.parse(b.createdAt);
  return expiredAt < cutoff.getTime();
}

/** Runs the clean-up, or with `dryRun` (the default) only counts what would change. */
export async function runRetention({ now = new Date(), dryRun = true, leadMonths = LEAD_RETENTION_MONTHS, unpaidDays = UNPAID_PAYMENT_RETENTION_DAYS, expiredHoldDays = EXPIRED_HOLD_RETENTION_DAYS }: RetentionOptions = {}): Promise<RetentionReport> {
  if (!(leadMonths >= 1) || !(unpaidDays >= 1) || !(expiredHoldDays >= 1)) throw new Error("Retention periods must be at least 1.");
  const leadCutoff = monthsBefore(now, leadMonths);
  const paymentCutoff = new Date(now.getTime() - unpaidDays * 24 * 3600 * 1000);
  const holdCutoff = new Date(now.getTime() - expiredHoldDays * 24 * 3600 * 1000);
  // Expired holds are deleted (not anonymised) even when also past the lead cut-off.
  const decideBooking = (b: Booking, paid: ReadonlySet<string>) =>
    expiredHoldStale(b, holdCutoff, now, paid) ? "delete" as const : bookingExpired(b, leadCutoff, now) ? anonymiseBooking(b, DELETED) : null;

  let leadsAnonymised: number;
  let paymentsStripped: number;
  let bookingsAnonymised = 0;
  let expiredHoldsDeleted = 0;
  // Read before any payment is stripped (stripping keeps the status, so the set stays valid either way).
  const payments = await listPayments();
  const paid = new Set(payments.filter((p) => p.status === "paid" || p.status === "refunded").map((p) => p.id));
  if (dryRun) {
    const [leads, bookings] = await Promise.all([listLeads(), listBookings(now.getTime())]);
    leadsAnonymised = leads.filter((l) => leadExpired(l, leadCutoff)).length;
    paymentsStripped = payments.filter((p) => unpaidPaymentExpired(p, paymentCutoff)).length;
    for (const b of bookings) {
      const d = decideBooking(b, paid);
      if (d === "delete") expiredHoldsDeleted++;
      else if (d) bookingsAnonymised++;
    }
  } else {
    leadsAnonymised = await rewriteLeads((l) => (leadExpired(l, leadCutoff) ? anonymiseLead(l) : null));
    // The member id goes too: unpaid records aren't needed to recognise a returning founding member.
    paymentsStripped = await rewritePayments((p) => (unpaidPaymentExpired(p, paymentCutoff) ? stripPaymentContact(p, DELETED) : null));
    const result = await rewriteBookings((b) => decideBooking(b, paid), now.getTime());
    bookingsAnonymised = result.rewritten;
    expiredHoldsDeleted = result.deleted;
  }
  return {
    dryRun, ranAt: now.toISOString(), leadCutoff: leadCutoff.toISOString(), unpaidPaymentCutoff: paymentCutoff.toISOString(),
    expiredHoldCutoff: holdCutoff.toISOString(), leadsAnonymised, paymentsStripped, bookingsAnonymised, expiredHoldsDeleted,
  };
}
