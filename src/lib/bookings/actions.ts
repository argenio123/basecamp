"use server";

// Instant class booking. Docs: 01-app/02-guides/server-actions.md, 03-api-reference/04-functions/redirect.md
// (redirect is called outside try/catch). Prices come from the pricing content and capacity from the timetable,
// never from the form.
import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSiteContent } from "@/content/get";
import { audit } from "@/lib/auth/audit";
import { requireAdmin } from "@/lib/auth/session";
import { currentMember } from "@/lib/members/session";
import { loginHref } from "@/lib/members/types";
import { createCheckoutSession, paymongoConfigured, paymongoTestMode } from "@/lib/payments/paymongo";
import { createPaypalOrder, paypalConfigured, paypalTestMode } from "@/lib/payments/paypal";
import { getPayment, addPayment, updatePayment } from "@/lib/payments/store";
import type { Payment } from "@/lib/payments/types";
import { createSharedLimiter } from "@/lib/sharedLimiter";
import { longDate, resolveOccurrence, sessionPayable } from "./schedule";
import { bookingPaymentsOn, cancelBooking, classEntitlement } from "./service";
import { getBooking, createHold, releaseBooking, updateBooking } from "./store";
import { bookedHref, bookHref, canMemberCancel, CANCEL_CUTOFF_HOURS, HOLD_MINUTES, isActive, PAYMENTS_OFF_MESSAGE, requestHref, type Booking } from "./types";

export type BookResult = { status: "idle" | "error"; message: string; /** Fallback link (request flow or waitlist). */ href?: string; hrefLabel?: string };
export type CancelResult = { status: "idle" | "error" | "done"; message: string };

const limiter = createSharedLimiter({ name: "booking", windowMs: 10 * 60_000, perKey: 20, global: 600 });
const str = (v: FormDataEntryValue | null, max: number) => String(v ?? "").slice(0, max).trim();

async function siteOrigin(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
  if (configured) return configured;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/**
 * Books one session: members whose membership includes classes are confirmed straight away; everyone else gets a
 * 15-minute hold and goes to PayMongo / PayPal, and the booking is confirmed when the payment is (markPaid).
 */
export async function bookSession(_prev: BookResult, form: FormData): Promise<BookResult> {
  const slotId = str(form.get("slot"), 80);
  const date = str(form.get("date"), 10);
  const member = await currentMember();
  if (!member) redirect(loginHref(bookHref(slotId, date)));
  if (await limiter.take(member.id)) return { status: "error", message: "Too many booking attempts. Please wait a few minutes and try again." };

  const content = await getSiteContent();
  const now = new Date();
  const occ = resolveOccurrence(content, slotId, date, now);
  if (!occ.ok) {
    if (occ.code === "full") return { status: "error", message: occ.message, href: requestHref(slotId, date, true), hrefLabel: "Join the waitlist" };
    return { status: "error", message: occ.message, ...(occ.slot ? { href: requestHref(slotId, date), hrefLabel: "Request this session" } : {}) };
  }

  const entitlement = await classEntitlement(content, member.id, now);
  const payable = entitlement ? null : sessionPayable(content);
  const provider = form.get("provider") === "paypal" ? "paypal" : "paymongo";
  if (!entitlement) {
    if (!payable || !bookingPaymentsOn() || !(provider === "paypal" ? paypalConfigured() : paymongoConfigured())) {
      return { status: "error", message: PAYMENTS_OFF_MESSAGE, href: requestHref(slotId, date), hrefLabel: "Request this session" };
    }
  }

  const name = [member.firstName, member.lastName].filter(Boolean).join(" ") || member.email;
  const id = randomUUID();
  const booking: Booking = {
    id, slotId, date, title: occ.slot.title, time: occ.slot.time, startAt: occ.startAt.toISOString(),
    memberId: member.id, name, email: member.email,
    status: entitlement ? "confirmed" : "held",
    via: entitlement ? "membership" : "payment",
    ...(entitlement ? { membership: entitlement.itemName, confirmedAt: now.toISOString() } : { holdExpiresAt: new Date(now.getTime() + HOLD_MINUTES * 60_000).toISOString() }),
    amount: entitlement ? 0 : payable!.amount,
    createdAt: now.toISOString(),
  };

  let hold;
  try {
    hold = await createHold(booking, occ.capacity, now.getTime());
  } catch (error) {
    console.error("[bookings] hold failed:", error instanceof Error ? error.message : error);
    return { status: "error", message: "We couldn't save your booking just now. Please try again in a moment." };
  }
  if (!hold.ok && hold.reason === "full") {
    return { status: "error", message: "That session just filled up. Join the waitlist and we'll tell you if a spot opens.", href: requestHref(slotId, date, true), hrefLabel: "Join the waitlist" };
  }
  if (!hold.ok) {
    // Already booked (or paying) for this session: show that booking, or send them back to finish paying.
    const existing = hold.existing;
    const pending = existing.status === "held" && existing.paymentId ? await getPayment(existing.paymentId) : null;
    redirect(pending?.status === "pending" && pending.checkoutUrl ? pending.checkoutUrl : bookedHref(existing.id));
  }
  if (entitlement) redirect(bookedHref(id));

  // Paid path: the same checkout as /pay, for the drop-in price.
  const item = payable!;
  const label = `${occ.slot.title} · ${longDate(date)}`;
  const paymentId = randomUUID();
  const payment: Payment = {
    id: paymentId, memberId: member.id, email: member.email, name,
    itemId: item.item.id, itemName: `Class booking: ${occ.slot.title}`, groupTitle: `${longDate(date)} · ${occ.slot.time}`, kind: item.kind,
    amount: item.amount, listAmount: item.amount, currency: "PHP", deposit: item.deposit, status: "pending", provider,
    test: provider === "paypal" ? paypalTestMode() : paymongoTestMode(), createdAt: now.toISOString(),
  };
  let checkoutUrl = "";
  try {
    await addPayment(payment);
    await updateBooking(id, (b) => ({ ...b, paymentId }));
    const origin = await siteOrigin();
    const back = `${origin}${bookedHref(id)}`;
    if (provider === "paypal") {
      const order = await createPaypalOrder({ name: `BaseCamp CamSur: ${label}`, amount: item.amount, reference: paymentId.slice(0, 8).toUpperCase(), returnUrl: back, cancelUrl: `${back}&cancelled=1`, requestId: paymentId });
      await updatePayment(paymentId, (p) => ({ ...p, checkoutId: order.id, checkoutUrl: order.approveUrl }));
      checkoutUrl = order.approveUrl;
    } else {
      const session = await createCheckoutSession({
        name: `Class: ${occ.slot.title}`, description: `BaseCamp CamSur: ${label} (${occ.slot.time})`, amount: item.amount,
        reference: paymentId.slice(0, 8).toUpperCase(), successUrl: back, cancelUrl: `${back}&cancelled=1`,
        billing: { name, email: member.email, phone: member.phone || undefined },
        metadata: { paymentId, memberId: member.id, itemId: item.item.id, bookingId: id },
      });
      await updatePayment(paymentId, (p) => ({ ...p, checkoutId: session.id, checkoutUrl: session.checkoutUrl }));
      checkoutUrl = session.checkoutUrl;
    }
  } catch (error) {
    console.error("[bookings] checkout failed:", error instanceof Error ? error.message : error);
    await updatePayment(paymentId, (p) => ({ ...p, status: "failed" })).catch(() => null);
    await releaseBooking(id, (b) => ({ ...b, status: "expired", note: "Checkout could not be opened." })).catch(() => null);
    return { status: "error", message: "We couldn't open the payment page. Your spot wasn't taken; please try again in a moment." };
  }
  redirect(checkoutUrl);
}

/** Member cancels their own booking (held, or confirmed up to CANCEL_CUTOFF_HOURS before the start). */
export async function cancelMyBooking(_prev: CancelResult, form: FormData): Promise<CancelResult> {
  const id = str(form.get("booking"), 60);
  const member = await currentMember();
  if (!member) redirect(loginHref(bookedHref(id)));
  const booking = await getBooking(id);
  if (!booking || booking.memberId !== member.id) return { status: "error", message: "Booking not found." };
  if (!isActive(booking)) return { status: "done", message: "This booking is no longer active." };
  if (!canMemberCancel(booking)) return { status: "error", message: `Bookings can be cancelled online up to ${CANCEL_CUTOFF_HOURS} hours before the session. Please contact the team.` };
  try {
    await cancelBooking(id, "member");
  } catch {
    return { status: "error", message: "We couldn't cancel just now. Please try again." };
  }
  return { status: "done", message: booking.via === "payment" && booking.status === "confirmed"
    ? "Cancelled: your spot is free for someone else. Our team will contact you about your refund."
    : "Cancelled: your spot is free for someone else." };
}

/** Staff cancel any booking from /admin/bookings (refunds are handled outside the site). */
export async function staffCancelBooking(form: FormData): Promise<void> {
  const session = await requireAdmin();
  const id = str(form.get("booking"), 60);
  const booking = await getBooking(id);
  if (!booking || !isActive(booking)) return;
  await cancelBooking(id, "staff");
  audit(session, "booking.cancel", { booking: id, slot: booking.slotId, date: booking.date });
  redirect("/admin/bookings");
}
