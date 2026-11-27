import Link from "next/link";
import { Suspense } from "react";
import AdminSkeleton from "@/components/admin/AdminSkeleton";
import "@/components/bookings/bookings.css";
import "@/components/payments/payments.css";
import { getSiteContent } from "@/content/get";
import { requireAdmin } from "@/lib/auth/session";
import { staffCancelBooking } from "@/lib/bookings/actions";
import { addDays, capacityOf, longDate, manilaToday } from "@/lib/bookings/schedule";
import { listBookings } from "@/lib/bookings/store";
import { BOOKING_STATUS_LABEL, DEFAULT_CAPACITY, isActive, pesoLabel, type Booking } from "@/lib/bookings/types";

const when = (iso: string) => new Date(iso).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" });

// Staff view of instant class bookings: every session occurrence from a week ago onwards, with who is booked.
// Not async: the admin session (cookies) is read inside <Suspense>, like app/admin/payments/page.tsx.
export default function AdminBookingsPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <BookingsList />
    </Suspense>
  );
}

async function BookingsList() {
  await requireAdmin();
  const now = new Date().getTime(); // server component: rendered per request
  const [bookings, content] = await Promise.all([listBookings(now), getSiteContent()]);
  const from = addDays(manilaToday(new Date(now)), -7);
  const groups = new Map<string, Booking[]>();
  for (const b of bookings.filter((x) => x.date >= from)) {
    const key = `${b.date}|${b.slotId}`;
    groups.set(key, [...(groups.get(key) ?? []), b]);
  }
  const occurrences = [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
  const live = bookings.filter((b) => isActive(b, now));
  const flagged = bookings.filter((b) => b.overCapacity || b.note);

  return (
    <div className="adm-app py-admin">
      <div className="py-admin-head">
        <div><p className="py-eyebrow">Admin</p><h1>Class bookings</h1></div>
        <Link className="py-link" href="/admin">Back to admin</Link>
      </div>
      <div className="py-admin-stats">
        <div><span>Confirmed</span><strong>{live.filter((b) => b.status === "confirmed").length}</strong></div>
        <div><span>Awaiting payment</span><strong>{live.filter((b) => b.status === "held").length}</strong></div>
        <div><span>Sessions with bookings</span><strong>{occurrences.length}</strong></div>
        <div><span>Need staff attention</span><strong>{flagged.length}</strong></div>
      </div>
      <p className="py-fine" style={{ color: "var(--olive)" }}>
        Only timetable sessions set to <strong>Open</strong> can be booked online (capacity empty = {DEFAULT_CAPACITY}). Cancelling here frees the spot;
        refunds for paid bookings are made in the PayMongo / PayPal dashboard.
      </p>
      {occurrences.length === 0 ? <p className="py-empty">No bookings yet.</p> : occurrences.map(([key, list]) => {
        const first = list[0];
        const slot = content.schedule.timetable.find((s) => s.id === first.slotId);
        const capacity = slot ? capacityOf(slot) : DEFAULT_CAPACITY;
        const confirmed = list.filter((b) => b.status === "confirmed").length;
        const held = list.filter((b) => b.status === "held").length;
        return (
          <section className="bk-admin-occ" key={key}>
            <h2>{first.title} · {longDate(first.date)}</h2>
            <p>{first.time} · {confirmed} confirmed{held ? ` · ${held} awaiting payment` : ""} · {Math.max(0, capacity - confirmed - held)} of {capacity} spots left{slot ? "" : " · no longer on the timetable"}</p>
            <div className="py-table-wrap">
              <table className="py-table">
                <thead><tr><th>Member</th><th>Status</th><th>How</th><th>Booked</th><th>Notes</th><th></th></tr></thead>
                <tbody>
                  {list.sort((a, b) => a.createdAt.localeCompare(b.createdAt)).map((b) => (
                    <tr key={b.id} data-status={b.status === "confirmed" ? "paid" : b.status}>
                      <td><strong>{b.name}</strong><small>{b.email}</small></td>
                      <td><span className="py-status">{BOOKING_STATUS_LABEL[b.status]}</span></td>
                      <td>{b.via === "membership" ? `Membership (${b.membership ?? ""})` : `Online · ${pesoLabel(b.amount)}`}</td>
                      <td>{when(b.createdAt)}{b.cancelledAt ? <small>Cancelled {when(b.cancelledAt)} by {b.cancelledBy}</small> : null}</td>
                      <td>{b.overCapacity && <span className="bk-admin-flag">Over capacity (paid after hold ran out). </span>}{b.note}</td>
                      <td>{isActive(b, now) && (
                        <form action={staffCancelBooking}>
                          <input type="hidden" name="booking" value={b.id} />
                          <button type="submit" className="bk-cancel">Cancel</button>
                        </form>
                      )}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}
