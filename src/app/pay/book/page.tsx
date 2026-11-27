import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import BookButton from "@/components/bookings/BookButton";
import "@/components/bookings/bookings.css";
import "@/components/payments/payments.css";
import { getSiteContent } from "@/content/get";
import { longDate, nextBookableDate, resolveOccurrence, sessionPayable } from "@/lib/bookings/schedule";
import { bookingPaymentsOn, classEntitlement, spotsLeft } from "@/lib/bookings/service";
import { listMemberBookings } from "@/lib/bookings/store";
import { bookedHref, bookHref, CANCEL_CUTOFF_HOURS, HOLD_MINUTES, isActive, PAYMENTS_OFF_MESSAGE, pesoLabel, requestHref } from "@/lib/bookings/types";
import { currentMember } from "@/lib/members/session";
import { loginHref } from "@/lib/members/types";
import { paymongoConfigured, paymongoTestMode } from "@/lib/payments/paymongo";
import { paypalConfigured, paypalTestMode } from "@/lib/payments/paypal";

export const metadata: Metadata = { title: "Book a session", robots: { index: false, follow: false } };
export const instant = false;

// The one confirm screen of instant booking: session, date, price and spots left, then one button (free with a
// membership that includes classes, else the PayMongo / PayPal checkout). Members only (proxy + the check below).
export default async function BookSessionPage({ searchParams }: { searchParams: Promise<{ slot?: string; date?: string }> }) {
  const { slot: slotId = "", date: dateParam = "" } = await searchParams;
  const member = await currentMember();
  if (!member) redirect(loginHref(bookHref(slotId, dateParam)));
  const content = await getSiteContent();
  const now = new Date();
  const date = dateParam || nextBookableDate(content, slotId, now);
  if (date && !dateParam) redirect(bookHref(slotId, date));
  const resolved = resolveOccurrence(content, slotId, date, now);
  // No date asked for and none bookable in the window: say so rather than "that date doesn't match".
  const occ = !resolved.ok && resolved.code === "date" && !dateParam ? { ...resolved, message: "No upcoming dates for this session can be booked online yet." } : resolved;

  if (!occ.ok) {
    const full = occ.code === "full";
    return (
      <section className="py-page">
        <div className="shell py-card">
          <p className="py-eyebrow">Book a session</p>
          <h1>{occ.slot?.title ?? "Session not available"}</h1>
          <p className="py-lead">{occ.message}</p>
          <div className="py-actions">
            {occ.slot && <Link className="py-button py-button--link" href={requestHref(slotId, date, full)}>{full ? "Join the waitlist" : "Request this session"} <span aria-hidden="true">→</span></Link>}
            <Link className="py-link" href="/schedule/timetable">Back to the timetable</Link>
          </div>
        </div>
      </section>
    );
  }

  const [entitlement, left, mine] = await Promise.all([
    classEntitlement(content, member.id, now),
    spotsLeft(slotId, date, occ.capacity, now.getTime()),
    listMemberBookings(member.id, now.getTime()),
  ]);
  const existing = mine.find((b) => b.slotId === slotId && b.date === date && isActive(b, now.getTime()));
  if (existing) redirect(bookedHref(existing.id));

  const payable = entitlement ? null : sessionPayable(content);
  const payOn = bookingPaymentsOn();
  const canPaymongo = !!payable && payOn && paymongoConfigured();
  const canPaypal = !!payable && payOn && paypalConfigured();
  const testMode = (canPaymongo && paymongoTestMode()) || (canPaypal && paypalTestMode());
  const full = left <= 0;
  const price = entitlement ? "Included" : payable ? pesoLabel(payable.amount) : "";

  const lines: { label: string; value: string }[] = [
    { label: "Session", value: occ.slot.title },
    { label: "Date", value: longDate(date) },
    { label: "Time", value: occ.slot.time },
    { label: "Spots left", value: full ? "Full" : `${left} of ${occ.capacity}` },
    { label: "Booking as", value: [member.firstName, member.lastName].filter(Boolean).join(" ") || member.email },
    { label: "Price", value: entitlement ? `Included in your ${entitlement.itemName} membership` : payable ? `${price}${payable.item.unit ? ` ${payable.item.unit}` : ""}` : "On request" },
  ];

  return (
    <section className="py-page">
      <div className="shell py-card bk-confirm">
        <p className="py-eyebrow">Book a session · Confirm</p>
        <h1>{occ.slot.title}</h1>
        <dl className="bk-lines">
          {lines.map((l) => <div key={l.label}><dt>{l.label}</dt><dd>{l.value}</dd></div>)}
        </dl>

        {full ? (
          <>
            <p className="py-error" role="status">This session just filled up. Join the waitlist and we&apos;ll tell you if a spot opens.</p>
            <Link className="py-button py-button--link" href={requestHref(slotId, date, true)}>Join the waitlist <span aria-hidden="true">→</span></Link>
          </>
        ) : entitlement ? (
          <BookButton slotId={slotId} date={date} label="Confirm booking · Free" />
        ) : canPaymongo || canPaypal ? (
          <>
            {canPaymongo && <BookButton slotId={slotId} date={date} label={`Confirm & pay ${price}`} />}
            {canPaypal && <BookButton slotId={slotId} date={date} provider="paypal" label={canPaymongo ? "Pay with PayPal" : `Confirm & pay ${price} with PayPal`} />}
            <p className="py-fine">Your spot is held for {HOLD_MINUTES} minutes while you pay, and confirmed the moment payment goes through.
              {payable?.deposit ? ` Listed from ${price}; any weekend or peak-rate difference is settled with our team.` : ""}</p>
            {testMode && <p className="py-test">Test mode: no real money is charged.</p>}
          </>
        ) : (
          <>
            <p className="py-error" role="status">{PAYMENTS_OFF_MESSAGE}</p>
            <Link className="py-button py-button--link" href={requestHref(slotId, date)}>Request this session <span aria-hidden="true">→</span></Link>
            <p className="py-fine">Members on a plan that includes classes book free here. <Link className="py-link" href="/membership#tiers">See memberships</Link></p>
          </>
        )}

        <p className="py-fine">Free cancellation from your account up to {CANCEL_CUTOFF_HOURS} hours before the session. Refunds for paid bookings are handled by our team.</p>
        <Link className="py-link" href="/schedule/timetable">Back to the timetable</Link>
      </div>
    </section>
  );
}
