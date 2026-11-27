import Link from "next/link";
import "@/components/payments/payments.css";
import { longDate } from "@/lib/bookings/schedule";
import { listMemberBookings } from "@/lib/bookings/store";
import { BOOKING_STATUS_LABEL, bookedHref, canMemberCancel, CANCEL_CUTOFF_HOURS, pesoLabel, type Booking } from "@/lib/bookings/types";
import CancelBookingButton from "./CancelBookingButton";
import "./bookings.css";

function Row({ b, now }: { b: Booking; now: number }) {
  return (
    <li data-status={b.status === "confirmed" ? "paid" : b.status}>
      <div>
        <strong>{b.title}</strong>
        <small>{longDate(b.date)} · {b.time}</small>
        <small>{b.via === "membership" ? `Included in ${b.membership ?? "membership"}` : b.amount ? `Paid online · ${pesoLabel(b.amount)}` : "Paid online"}</small>
      </div>
      <span className="py-status">{BOOKING_STATUS_LABEL[b.status]}</span>
      <Link className="py-link" href={bookedHref(b.id)}>Details</Link>
      {canMemberCancel(b, now) && <CancelBookingButton bookingId={b.id} label={b.status === "held" ? "Release spot" : "Cancel"} />}
    </li>
  );
}

/** The member's class bookings for the account history page: upcoming first, then the most recent past ones. */
export default async function MemberBookings({ memberId }: { memberId: string }) {
  const now = new Date().getTime(); // server component: rendered per request
  const all = await listMemberBookings(memberId, now).catch(() => []);
  const upcoming = all.filter((b) => Date.parse(b.startAt) > now && (b.status === "confirmed" || b.status === "held")).sort((a, b) => a.startAt.localeCompare(b.startAt));
  const past = all.filter((b) => !upcoming.includes(b)).slice(0, 8);

  return (
    <section className="bk-member" id="bookings" aria-labelledby="bk-member-title">
      <h2 id="bk-member-title">Class bookings</h2>
      {all.length === 0 ? (
        <p className="py-empty">No class bookings yet. <Link href="/schedule/timetable">Book from the timetable</Link>.</p>
      ) : (
        <>
          {upcoming.length > 0 ? <ul className="py-history bk-history">{upcoming.map((b) => <Row key={b.id} b={b} now={now} />)}</ul> : <p className="py-empty">No upcoming sessions. <Link href="/schedule/timetable">Book from the timetable</Link>.</p>}
          {past.length > 0 && (
            <details className="bk-past">
              <summary>Past and cancelled ({past.length})</summary>
              <ul className="py-history bk-history">{past.map((b) => <Row key={b.id} b={b} now={now} />)}</ul>
            </details>
          )}
        </>
      )}
      <p className="py-fine bk-fine">Cancel free up to {CANCEL_CUTOFF_HOURS} hours before a session. Refunds for paid bookings are handled by our team.</p>
    </section>
  );
}
