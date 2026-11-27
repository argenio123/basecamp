import Link from "next/link";
import type { CSSProperties } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatDateLabel } from "@/content/format";
import type { CalendarEvent, RecurringEvent } from "@/content/types";
import { getLocale, getUi, localHref, t } from "@/i18n/server";

const delay = (i: number) => ({ "--i": i }) as CSSProperties;

// Server Components: text in the request locale (t(), src/i18n/fil/phrases/schedule.ts) and /fil links on /fil pages.
// Event titles and descriptions come from getSiteContent(), which already follows the locale.

/** "27 November 2026" (English) or "Nobyembre 27, 2026" (Filipino) for a YYYY-MM-DD event date. */
function eventDate(date: string): string {
  if (getLocale() !== "fil" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return t(formatDateLabel(date));
  const parsed = new Date(`${date}T00:00:00+08:00`);
  return Number.isNaN(parsed.getTime()) ? t("To be announced") : parsed.toLocaleDateString("fil-PH", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Manila" });
}

/**
 * Recurring event (night training, time trials, leaderboards…) as a row in the timetable style:
 * cadence on the left, display title + description, status, and a Request pill.
 */
export function RecurringRow({ event, index = 0 }: { event: RecurringEvent; index?: number }) {
  const cadence = t(event.cadence);
  return (
    <li className="sd-ev-row" style={delay(index)}>
      <Link href={localHref("/schedule/book")} aria-label={t("{title}, {cadence}. Request a place", { title: event.title, cadence })}>
        <span className="sd-ev-when"><strong>{cadence}</strong></span>
        <span className="sd-ev-body">
          <span className="sd-ev-title">{event.title}</span>
          <span className="sd-ev-desc">{event.description}</span>
          <StatusBadge availability={event.availability} label={getUi().labels.availability[event.availability]} />
        </span>
        <span className="sd-ev-go" aria-hidden="true">{t("Request")}</span>
      </Link>
    </li>
  );
}

/** Calendar event as a row: date label, title, description, status, and its two actions. */
export function EventRow({ event, index = 0 }: { event: CalendarEvent; index?: number }) {
  const date = event.date ? eventDate(event.date) : event.dateLabel || t("Date to be announced");
  return (
    <li className="sd-ev-row sd-ev-row-static" style={delay(index)}>
      <div>
        <span className="sd-ev-when"><small>{date}</small></span>
        <span className="sd-ev-body">
          <span className="sd-ev-title">{event.title}</span>
          <span className="sd-ev-desc">{event.description}</span>
          <StatusBadge availability={event.availability} label={getUi().labels.availability[event.availability]} />
        </span>
        <span className="sd-ev-actions">
          {event.ctaHref && <Link className="sd-ev-go sd-ev-go-fill" href={localHref(event.ctaHref)}>{t("Register interest")}</Link>}
          <Link className="sd-ev-go" href={localHref("/schedule/book")}>{t("Book a session")}</Link>
        </span>
      </div>
    </li>
  );
}
