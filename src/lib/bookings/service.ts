// Booking state changes and lookups shared by the server actions, the payment flow (markPaid), the spots route and
// the account / admin pages. Server-only.
import type { SiteContent } from "@/content/types";
import { paymongoConfigured } from "@/lib/payments/paymongo";
import { paypalConfigured } from "@/lib/payments/paypal";
import { membershipStatus } from "@/lib/payments/service";
import { paymentsLive } from "@/lib/payments/status";
import type { Payment } from "@/lib/payments/types";
import { capacityOf, membershipIncludesClasses, resolveOccurrence, sessionPayable } from "./schedule";
import { confirmBooking, countUsed, findBookingByPaymentId, releaseBooking, updateBooking } from "./store";
import { DEFAULT_CAPACITY, effectiveStatus, pesoLabel, type Booking, type SpotsResponse } from "./types";

/**
 * Whether the paid booking path is on. Live keys only, so the site never sends members to a checkout that can't take
 * real money; BOOKING_TEST_PAYMENTS=1 also allows test / sandbox keys (staging, before go-live).
 */
export function bookingPaymentsOn(): boolean {
  if (paymentsLive()) return true;
  return process.env.BOOKING_TEST_PAYMENTS === "1" && (paymongoConfigured() || paypalConfigured());
}

/** The member's active membership when it includes coached classes (they book without paying), else null. */
export async function classEntitlement(content: SiteContent, memberId: string, now = new Date()): Promise<{ itemName: string } | null> {
  const status = await membershipStatus(memberId, now);
  if (!status?.active || !membershipIncludesClasses(content, status.itemId)) return null;
  return { itemName: status.itemName };
}

/**
 * Called by markPaid once a payment is paid (webhook, success-page sync or staff): confirms the booking it pays for.
 * Idempotent. A booking the member cancelled before the payment landed stays cancelled, with a refund note for staff.
 */
export async function confirmBookingForPayment(payment: Payment, capacity?: number, now = Date.now()): Promise<Booking | null> {
  if (payment.status !== "paid") return null;
  const booking = await findBookingByPaymentId(payment.id);
  if (!booking) return null;
  const status = effectiveStatus(booking, now);
  if (status === "confirmed") return booking;
  if (status === "cancelled") {
    return updateBooking(booking.id, (b) => (b.note ? b : { ...b, note: "Paid after the booking was cancelled: refund due." }));
  }
  const cap = capacity ?? (await capacityFor(booking.slotId));
  return confirmBooking(booking.id, (b) => ({ ...b, confirmedAt: new Date(now).toISOString(), amount: payment.amount }), cap, now);
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
