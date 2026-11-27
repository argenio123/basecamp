// Retention clean-up (RA 10173 Sec. 11(e): keep personal data only as long as needed). Server-only.
//
// What it does (and nothing else):
//  - Leads (booking requests, enquiries, early-access and newsletter sign-ups) created before the cut-off are
//    anonymised with anonymiseLead(): name, email, phone, message, booking item and staff notes are replaced, while
//    kind, dates, status and non-identifying choices stay, so lead counts and demand statistics still add up.
//  - Payment records that never got paid (expired, cancelled, failed, or still "pending" long after checkout links
//    expire) and are older than the unpaid cut-off lose their contact details. Paid records are never touched: they
//    are kept for tax and accounting.
// Nothing is deleted outright, and already-anonymised records are skipped, so running it twice is harmless.
//
// It never runs on its own. Ways to run it:
//  - Admin → Privacy (/admin/privacy): preview the counts, then press "Run clean-up now".
//  - Scheduled: GET /api/privacy/retention with "Authorization: Bearer <CRON_SECRET>". On Vercel, set the
//    CRON_SECRET env var (Vercel Cron sends it automatically) and add to vercel.json:
//      { "crons": [{ "path": "/api/privacy/retention", "schedule": "0 19 * * 0" }] }   (weekly, Mondays 03:00 Manila)
//    Add ?dryRun=1 to only report what would change.
import { listLeads, rewriteLeads } from "@/lib/leads/store";
import type { Lead } from "@/lib/leads/types";
import { listPayments, rewritePayments } from "@/lib/payments/store";
import type { Payment } from "@/lib/payments/types";
import { anonymiseLead, DELETED, isAnonymisedLead, isStrippedPayment, stripPaymentContact } from "./anonymise";

// TODO(lawyer): confirm the retention period for leads (proposal: 24 months after the request was sent). Keep the
// privacy policy (/privacy#retention) in step when this changes.
export const LEAD_RETENTION_MONTHS = 24;
// TODO(lawyer/accountant): confirm how long unpaid checkout records are kept (proposal: 90 days). Paid records
// follow the tax and accounting retention rules and are never cleaned up here.
export const UNPAID_PAYMENT_RETENTION_DAYS = 90;

const UNPAID: ReadonlySet<Payment["status"]> = new Set(["pending", "expired", "cancelled", "failed"]);

export type RetentionOptions = { now?: Date; dryRun?: boolean; leadMonths?: number; unpaidDays?: number };
export type RetentionReport = {
  dryRun: boolean;
  ranAt: string;
  leadCutoff: string;
  unpaidPaymentCutoff: string;
  leadsAnonymised: number;
  paymentsStripped: number;
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

/** Runs the clean-up, or with `dryRun` (the default) only counts what would change. */
export async function runRetention({ now = new Date(), dryRun = true, leadMonths = LEAD_RETENTION_MONTHS, unpaidDays = UNPAID_PAYMENT_RETENTION_DAYS }: RetentionOptions = {}): Promise<RetentionReport> {
  if (!(leadMonths >= 1) || !(unpaidDays >= 1)) throw new Error("Retention periods must be at least 1.");
  const leadCutoff = monthsBefore(now, leadMonths);
  const paymentCutoff = new Date(now.getTime() - unpaidDays * 24 * 3600 * 1000);

  let leadsAnonymised: number;
  let paymentsStripped: number;
  if (dryRun) {
    const [leads, payments] = await Promise.all([listLeads(), listPayments()]);
    leadsAnonymised = leads.filter((l) => leadExpired(l, leadCutoff)).length;
    paymentsStripped = payments.filter((p) => unpaidPaymentExpired(p, paymentCutoff)).length;
  } else {
    leadsAnonymised = await rewriteLeads((l) => (leadExpired(l, leadCutoff) ? anonymiseLead(l) : null));
    // The member id goes too: unpaid records aren't needed to recognise a returning founding member.
    paymentsStripped = await rewritePayments((p) => (unpaidPaymentExpired(p, paymentCutoff) ? stripPaymentContact(p, DELETED) : null));
  }
  return { dryRun, ranAt: now.toISOString(), leadCutoff: leadCutoff.toISOString(), unpaidPaymentCutoff: paymentCutoff.toISOString(), leadsAnonymised, paymentsStripped };
}
