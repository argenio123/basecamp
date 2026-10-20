import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatDateLabel } from "@/content/format";
import type { CalendarEvent, RecurringEvent } from "@/content/types";

/** Recurring event (night training, time trials, leaderboards…) with its cadence badge. */
export function RecurringCard({ event }: { event: RecurringEvent }) {
  return (
    <li className="sd-card">
      <div className="sd-card-badges"><span className="sd-cadence">{event.cadence}</span><StatusBadge availability={event.availability} /></div>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
    </li>
  );
}

/** Calendar event: date (or "to be announced" label), description, status and its interest link. */
export function EventCard({ event }: { event: CalendarEvent }) {
  return (
    <li className="sd-card sd-event">
      <p className="sd-event-date">{event.date ? formatDateLabel(event.date) : event.dateLabel || "Date to be announced"}</p>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <div className="sd-event-footer">
        <StatusBadge availability={event.availability} />
      </div>
      {/* Paired actions (ritebali.com style): register (filled) and see the weekly schedule (outline). */}
      <div className="ft-pair">
        {event.ctaHref && <Link className="button button-dark button-small ft-pill" href={event.ctaHref}>Register interest</Link>}
        <Link className="button button-small ft-pill ft-pill-outline" href="/schedule/book">Book a session</Link>
      </div>
    </li>
  );
}
