import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import CancelBookingButton from "@/components/bookings/CancelBookingButton";
import "@/components/bookings/bookings.css";
import "@/components/payments/payments.css";
import { longDate } from "@/lib/bookings/schedule";
import { getBooking } from "@/lib/bookings/store";
import { BOOKING_STATUS_LABEL, bookedHref, bookHref, canMemberCancel, CANCEL_CUTOFF_HOURS, effectiveStatus, MY_BOOKINGS_PATH, pesoLabel } from "@/lib/bookings/types";
import { currentMember } from "@/lib/members/session";
import { loginHref } from "@/lib/members/types";
import { syncPayment } from "@/lib/payments/service";
import { getPayment } from "@/lib/payments/store";

export const metadata: Metadata = { title: "Your booking", robots: { index: false, follow: false } };
export const instant = false;

const clock = (iso: string) => new Date(iso).toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Manila" });

// After booking (free) or paying (PayMongo / PayPal return here). A paid booking's payment is checked with the
// provider directly (local servers get no webhooks); markPaid then confirms the booking, so a reload shows the latest.
export default async function BookedPage({ searchParams }: { searchParams: Promise<{ booking?: string; cancelled?: string }> }) {
  const { booking: id = "", cancelled = "" } = await searchParams;
  const member = await currentMember();
  if (!member) redirect(loginHref(bookedHref(id)));
  let booking = id ? await getBooking(id) : null;
  if (!booking || booking.memberId !== member.id) redirect(MY_BOOKINGS_PATH);

  const stored = booking.paymentId ? await getPayment(booking.paymentId) : null;
  const payment = stored ? await syncPayment(stored) : null;
  if (payment?.status === "paid" && booking.status !== "confirmed") booking = (await getBooking(id)) ?? booking;
  const now = new Date().getTime(); // server component: rendered per request
  const status = effectiveStatus(booking, now);
  const confirmed = status === "confirmed";
  const held = status === "held";

  const heading = confirmed ? "You're booked." : held ? (cancelled ? "Payment not finished." : "Almost there.") : status === "expired" ? "Your hold ran out." : "Booking cancelled.";
  const lead = confirmed
    ? booking.via === "membership" ? `Included in your ${booking.membership ?? ""} membership. See you there!` : "Payment received and your spot is confirmed. A receipt is on its way to your email."
    : held
      ? cancelled ? `Your spot is held until ${clock(booking.holdExpiresAt!)}. Finish paying to confirm it, or release it for someone else.`
        : "We haven't had confirmation of your payment yet. This usually takes a few seconds; reload this page to check again."
      : status === "expired" ? "The 15-minute hold ended before payment came through, so the spot went back on the timetable. You can book again if there's room."
        : "This booking was cancelled and its spot released.";

  return (
    <section className="py-page">
      <div className="shell py-card bk-confirm">
        <span className={`py-mark${confirmed ? "" : " py-mark--wait"}`} aria-hidden="true">{confirmed ? "✓" : held ? "…" : "×"}</span>
        <p className="py-eyebrow">Booking · {BOOKING_STATUS_LABEL[status]}</p>
        <h1>{heading}</h1>
        <p className="py-lead">{lead}</p>
        <dl className="bk-lines">
          <div><dt>Session</dt><dd>{booking.title}</dd></div>
          <div><dt>Date</dt><dd>{longDate(booking.date)}</dd></div>
          <div><dt>Time</dt><dd>{booking.time}</dd></div>
          <div><dt>Paid</dt><dd>{booking.via === "membership" ? "Included in membership" : payment?.status === "paid" ? pesoLabel(payment.amount) : "Not yet"}</dd></div>
          <div><dt>Reference</dt><dd><code>{booking.id.slice(0, 8).toUpperCase()}</code></dd></div>
        </dl>
        {payment?.test && <p className="py-test">Test payment: no real money was charged.</p>}
        <div className="py-actions">
          {held && payment?.status === "pending" && payment.checkoutUrl && <a className="py-button py-button--link" href={payment.checkoutUrl}>Finish paying <span aria-hidden="true">→</span></a>}
          {(status === "expired" || status === "cancelled") && <Link className="py-button py-button--link" href={bookHref(booking.slotId, booking.date)}>Book again <span aria-hidden="true">→</span></Link>}
          <Link className="py-link" href={MY_BOOKINGS_PATH}>My bookings</Link>
          <Link className="py-link" href="/schedule/timetable">Back to the timetable</Link>
        </div>
        {canMemberCancel(booking, now) && (
          <div className="bk-cancel-row">
            <CancelBookingButton bookingId={booking.id} label={held ? "Release my spot" : "Cancel booking"} />
            <p className="py-fine">Cancel free up to {CANCEL_CUTOFF_HOURS} hours before the session.{booking.via === "payment" && confirmed ? " Refunds are handled by our team." : ""}</p>
          </div>
        )}
      </div>
    </section>
  );
}
