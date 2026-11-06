import Link from "next/link";
import type { CSSProperties } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatDateLabel } from "@/content/format";
import type { CalendarEvent, RecurringEvent } from "@/content/types";

const delay = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * Recurring event (night training, time trials, leaderboards…) as a row in the timetable style:
 * cadence on the left, display title + description, status, and a Request pill.
 */
export function RecurringRow({ event, index = 0 }: { event: RecurringEvent; index?: number }) {
  return (
    <li className="sd-ev-row" style={delay(index)}>
      <Link href="/schedule/book" aria-label={`${event.title}, ${event.cadence}. Request a place`}>
        <span className="sd-ev-when"><strong>{event.cadence}</strong></span>
        <span className="sd-ev-body">
          <span className="sd-ev-title">{event.title}</span>
          <span className="sd-ev-desc">{event.description}</span>
          <StatusBadge availability={event.availability} />
        </span>
        <span className="sd-ev-go" aria-hidden="true">Request</span>
      </Link>
    </li>
  );
}

/** Calendar event as a row: date label, title, description, status, and its two actions. */
export function EventRow({ event, index = 0 }: { event: CalendarEvent; index?: number }) {
  const date = event.date ? formatDateLabel(event.date) : event.dateLabel || "Date to be announced";
  return (
    <li className="sd-ev-row sd-ev-row-static" style={delay(index)}>
      <div>
        <span className="sd-ev-when"><small>{date}</small></span>
        <span className="sd-ev-body">
          <span className="sd-ev-title">{event.title}</span>
          <span className="sd-ev-desc">{event.description}</span>
          <StatusBadge availability={event.availability} />
        </span>
        <span className="sd-ev-actions">
          {event.ctaHref && <Link className="sd-ev-go sd-ev-go-fill" href={event.ctaHref}>Register interest</Link>}
          <Link className="sd-ev-go" href="/schedule/book">Book a session</Link>
        </span>
      </div>
    </li>
  );
}
