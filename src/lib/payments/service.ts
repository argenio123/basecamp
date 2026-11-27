// Payment state changes (server-only), shared by the success page, the webhook, and the account page.
import { getCheckoutState, paymongoConfigured } from "./paymongo";
import { getPaypalState, paypalConfigured } from "./paypal";
import { listMemberPayments, updatePayment } from "./store";
import type { Payment } from "./types";

const addMonth = (d: Date) => { const n = new Date(d); n.setMonth(n.getMonth() + 1); return n; };

/**
 * Marks a payment paid (idempotent). A membership payment covers one month, starting when the member's current paid
 * month ends (or today if none is running), so paying early extends the membership instead of overlapping it.
 */
export async function markPaid(payment: Payment, info: { method?: string; reference?: string }, now = new Date()): Promise<Payment | null> {
  let period: { periodStart?: string; periodEnd?: string } = {};
  if (payment.kind === "membership" && payment.status !== "paid") {
    const others = (await listMemberPayments(payment.memberId)).filter((p) => p.id !== payment.id && p.kind === "membership" && p.status === "paid" && p.periodEnd);
    const lastEnd = others.reduce<Date | null>((max, p) => { const e = new Date(p.periodEnd!); return !max || e > max ? e : max; }, null);
    const start = lastEnd && lastEnd > now ? lastEnd : now;
    period = { periodStart: start.toISOString(), periodEnd: addMonth(start).toISOString() };
  }
  // A refunded payment stays refunded if the provider re-sends its "paid" event.
  return updatePayment(payment.id, (p) => (p.status === "paid" || p.status === "refunded" ? p : {
    ...p, ...period, status: "paid", paidAt: now.toISOString(),
    method: info.method ?? p.method, reference: info.reference ?? p.reference,
  }));
}

/**
 * Asks the provider (PayMongo or PayPal) for the latest state of a pending payment and records it. For PayPal this
 * also captures an approved order. Returns the up-to-date payment.
 */
export async function syncPayment(payment: Payment): Promise<Payment> {
  if (payment.status !== "pending" || !payment.checkoutId) return payment;
  const paypal = payment.provider === "paypal";
  if (paypal ? !paypalConfigured() : !paymongoConfigured()) return payment;
  try {
    const state = paypal ? { ...(await getPaypalState(payment.checkoutId)), method: "paypal" } : await getCheckoutState(payment.checkoutId);
    if (state.paid) return (await markPaid(payment, state)) ?? payment;
    if (state.expired) return (await updatePayment(payment.id, (p) => (p.status === "pending" ? { ...p, status: "expired" } : p))) ?? payment;
  } catch { /* Provider unreachable: keep the stored status; the next page view or the webhook catches up */ }
  return payment;
}

export type MembershipStatus = { itemId: string; itemName: string; paidThrough: string; active: boolean; daysLeft: number } | null;

/** The member's latest paid membership month, or null if they've never paid one. */
export async function membershipStatus(memberId: string, now = new Date()): Promise<MembershipStatus> {
  const paid = (await listMemberPayments(memberId)).filter((p) => p.kind === "membership" && p.status === "paid" && p.periodEnd);
  if (!paid.length) return null;
  const latest = paid.reduce((a, b) => (new Date(a.periodEnd!) > new Date(b.periodEnd!) ? a : b));
  const end = new Date(latest.periodEnd!);
  const daysLeft = Math.ceil((end.getTime() - now.getTime()) / 86_400_000);
  return { itemId: latest.itemId, itemName: latest.itemName, paidThrough: latest.periodEnd!, active: daysLeft > 0, daysLeft };
}
