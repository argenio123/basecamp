import Link from "next/link";
import type { MemberActivity } from "@/lib/members/activity";

function ActivityIcon({ category }: { category: MemberActivity["category"] }) {
  if (category === "booking") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13H4V6a1 1 0 0 1 1-1Z" /></svg>;
  if (category === "membership") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v11H4zM7 7V5h10v2M8 12h8" /></svg>;
  if (category === "enquiry") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v12H8l-4 3V5Zm4 4h8m-8 4h5" /></svg>;
  if (category === "updates") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 18h14M7 16V9a5 5 0 0 1 10 0v7l2 2H5l2-2Zm3 4h4" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13 2-7 12h6l-1 8 7-12h-6l1-8Z" /></svg>;
}

export default function MemberHistory({ items }: { items: MemberActivity[] }) {
  return (
    <section className="ma-history" id="activity-history" aria-labelledby="member-history-title">
      <header className="ma-history-head">
        <div><p>Activity history</p><h2 id="member-history-title">Recent activity</h2></div>
        <span>{items.length ? `${items.length} recent ${items.length === 1 ? "activity" : "activities"}` : "No activity yet"}</span>
      </header>

      {items.length ? (
        <ol className="ma-history-list">
          {items.map((item) => (
            <li key={item.id}>
              <article className="ma-history-item">
                <span className="ma-history-icon"><ActivityIcon category={item.category} /></span>
                <div className="ma-history-main"><span>{item.eyebrow}</span><h3>{item.title}</h3><p>{item.detail}</p></div>
                <div className="ma-history-meta"><time dateTime={item.createdAt}>{item.dateLabel}</time><span data-status={item.status}>{item.statusLabel}</span></div>
              </article>
            </li>
          ))}
        </ol>
      ) : (
        <div className="ma-history-empty">
          <div><span>Nothing here yet</span><h3>Your requests will collect here.</h3><p>Bookings, enquiries, membership requests, purchases, and Early Access signups will appear after you submit them.</p></div>
          <div><Link href="/schedule/book">Book a session</Link><Link href="/membership/join">Join membership</Link></div>
        </div>
      )}
    </section>
  );
}
