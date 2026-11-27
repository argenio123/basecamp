// Booking state changes and lookups shared by the server actions, the payment flow (markPaid), the spots route and
// the account / admin pages. Server-only.
import type { SiteContent } from "@/content/types";
import { isAnonymisedBooking } from "@/lib/privacy/anonymise";
import { paymongoConfigured, paymongoTestMode } from "@/lib/payments/paymongo";
import { paypalConfigured, paypalTestMode } from "@/lib/payments/paypal";
import { listMemberPayments } from "@/lib/payments/store";
import type { Payment, PaymentProvider } from "@/lib/payments/types";
import { capacityOf, membershipIncludesClasses, resolveOccurrence, sessionPayable } from "./schedule";
import { confirmBooking, countUsed, findBookingByPaymentId, releaseBooking, updateBooking } from "./store";
import { DEFAULT_CAPACITY, effectiveStatus, FULL_BEFORE_PAYMENT_NOTE, pesoLabel, type Booking, type SpotsResponse } from "./types";

/**
 * BOOKING_TEST_PAYMENTS=1 (staging, before go-live): test / sandbox payments may open, confirm and entitle class
 * bookings. Otherwise only real money does.
 */
export const bookingTestPayments = () => process.env.BOOKING_TEST_PAYMENTS === "1";

/**
 * Whether `provider` can take payment for a class booking: configured with live keys (test / sandbox keys only with
 * BOOKING_TEST_PAYMENTS=1), so the site never confirms a booking on money that didn't move.
 */
export function bookingProviderOn(provider: PaymentProvider): boolean {
  const configured = provider === "paypal" ? paypalConfigured() : paymongoConfigured();
  const test = provider === "paypal" ? paypalTestMode() : paymongoTestMode();
  return configured && (!test || bookingTestPayments());
}

/** Whether the paid booking path is on (at least one provider passes bookingProviderOn). */
export const bookingPaymentsOn = () => bookingProviderOn("paymongo") || bookingProviderOn("paypal");

/**
 * The paid membership month that covers a session starting at `sessionStart`, when its plan includes coached classes
 * (the member then books without paying), else null. Test / sandbox payments never count (unless
 * BOOKING_TEST_PAYMENTS=1), and a membership that ends before the session doesn't cover it.
 */
export async function classEntitlement(content: SiteContent, memberId: string, sessionStart: Date): Promise<{ itemName: string } | null> {
  const at = sessionStart.getTime();
  const allowTest = bookingTestPayments();
  const covering = (await listMemberPayments(memberId)).find((p) =>
    p.kind === "membership" && p.status === "paid" && (allowTest || !p.test) && !!p.periodEnd
    && Date.parse(p.periodEnd) > at && !(Date.parse(p.periodStart ?? "") > at)
    && membershipIncludesClasses(content, p.itemId));
  return covering ? { itemName: covering.itemName } : null;
}

const appendNote = (b: Booking, note: string) => (b.note?.includes(note) ? b : { ...b, note: b.note ? `${b.note} ${note}` : note });

/** Staff note on a booking whose payment arrived but which can't be confirmed (cancelled, released or anonymised). */
function refundNote(b: Booking): Booking {
  if (b.note?.includes("refund")) return b;
  const why = isAnonymisedBooking(b) ? "after the account was deleted" : b.status === "cancelled" ? "after the booking was cancelled" : "after the booking was released";
  return appendNote(b, `Paid ${why}: refund due.`);
}

/**
 * Called by markPaid once a payment is paid (webhook, success-page sync or staff): confirms the booking it pays for.
 * Idempotent. A booking that was cancelled, released or anonymised before the payment landed is never confirmed (or
 * restored); it gets a refund note for staff instead. A test / sandbox payment confirms nothing (unless
 * BOOKING_TEST_PAYMENTS=1).
 */
export async function confirmBookingForPayment(payment: Payment, capacity?: number, now = Date.now()): Promise<Booking | null> {
  if (payment.status !== "paid") return null;
  const booking = await findBookingByPaymentId(payment.id);
  if (!booking) return null;
  if (booking.status === "confirmed") return booking;
  if (payment.test && !bookingTestPayments()) {
    return updateBooking(booking.id, (b) => appendNote(b, "Test / sandbox payment: not confirmed (no real money moved)."));
  }
  const cap = capacity ?? (await capacityFor(booking.slotId));
  return confirmBooking(booking.id, {
    confirm: (b) => ({ ...b, confirmedAt: new Date(now).toISOString(), amount: payment.amount }),
    refuse: refundNote,
  }, cap, now);
}

/**
 * Whether an approved PayPal order may be captured (PayPal takes the money only at capture). Refused when the order
 * pays for a booking that was cancelled, released or anonymised, or whose hold ran out while the session filled up:
 * the member is then not charged at all, instead of paying for a spot that is gone. Payments that aren't for a
 * booking are always captured.
 */
export async function bookingCaptureAllowed(payment: Payment, now = Date.now()): Promise<boolean> {
  const booking = await findBookingByPaymentId(payment.id);
  if (!booking || booking.status === "confirmed") return true;
  if (booking.status !== "held" || isAnonymisedBooking(booking)) return false;
  if (effectiveStatus(booking, now) === "held") return true;
  return (await spotsLeft(booking.slotId, booking.date, await capacityFor(booking.slotId), now)) > 0;
}

/** After a refused capture: releases the booking's run-out hold, with a note the result page and staff can read. */
export async function releaseUncapturedBooking(payment: Payment): Promise<Booking | null> {
  const booking = await findBookingByPaymentId(payment.id);
  if (!booking || booking.status !== "held" || isAnonymisedBooking(booking)) return booking;
  return releaseBooking(booking.id, (b) => (b.status === "held" && !isAnonymisedBooking(b) ? { ...b, status: "expired", note: FULL_BEFORE_PAYMENT_NOTE } : b));
}

/** The slot's capacity from the current content (the default when the slot was since removed). */
async function capacityFor(slotId: string): Promise<number> {
  try {
    const { getSiteContent } = await import("@/content/get");
    const slot = (await getSiteContent()).schedule.timetable.find((s) => s.id === slotId);
    return slot ? capacityOf(slot) : DEFAULT_CAPACITY;
  } catch {
    return DEFAULT_CAPACITY;
  }
}

/** Cancels a booking and frees its spot. */
export function cancelBooking(id: string, by: "member" | "staff", now = Date.now()): Promise<Booking | null> {
  return releaseBooking(id, (b) => ({ ...b, status: "cancelled", cancelledAt: new Date(now).toISOString(), cancelledBy: by,
    ...(b.via === "payment" && b.status === "confirmed" ? { note: "Paid online: refund handled by staff." } : {}) }));
}

/** Live spots for every instantly bookable (or full) session on `date`, for the timetable. */
export async function spotsForDate(content: SiteContent, date: string, now = new Date()): Promise<SpotsResponse> {
  const payable = sessionPayable(content);
  const price = payable && bookingPaymentsOn() ? pesoLabel(payable.amount) : null;
  const slots: SpotsResponse["slots"] = {};
  const open: { slotId: string; date: string; capacity: number }[] = [];
  for (const slot of content.schedule.timetable) {
    const occ = resolveOccurrence(content, slot.id, date, now);
    if (occ.ok) open.push({ slotId: slot.id, date, capacity: occ.capacity });
    else if (occ.code === "full") slots[slot.id] = { state: "full", left: 0, capacity: capacityOf(slot) };
  }
  const used = await countUsed(open, now.getTime());
  for (const o of open) {
    const left = Math.max(0, o.capacity - (used[`${o.slotId}:${o.date}`] ?? 0));
    slots[o.slotId] = { state: left > 0 ? "bookable" : "full", left, capacity: o.capacity };
  }
  return { date, price, slots };
}

/** Spots left for one occurrence. */
export async function spotsLeft(slotId: string, date: string, capacity: number, now = Date.now()): Promise<number> {
  const used = await countUsed([{ slotId, date }], now);
  return Math.max(0, capacity - (used[`${slotId}:${date}`] ?? 0));
}
