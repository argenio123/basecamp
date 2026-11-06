"use client";

import Link from "next/link";
import { type CSSProperties, useEffect, useState } from "react";
import type { TimetableSlot } from "@/content/types";
import { SLOT_CATEGORY_LABEL, TIMETABLE_CAPTION, WEEKDAY_LABEL, WEEKDAYS } from "@/data/programs-static";

type Weekday = (typeof WEEKDAYS)[number];
type Category = TimetableSlot["category"];
type Part = "morning" | "midday" | "evening" | "night";

/** A timetable slot plus details from its programme (resolved on the server). */
export type TimetableEntry = TimetableSlot & { zone?: string; level?: string; coach?: string };

const PART_LABEL: Record<Part, string> = { morning: "Morning", midday: "Midday", evening: "Evening", night: "Night" };
const PARTS: readonly Part[] = ["morning", "midday", "evening", "night"];

/** Chip text without the ☀/☾ glyphs used elsewhere. */
const chipLabel = (category: Category) => SLOT_CATEGORY_LABEL[category].replace(/^[^A-Za-z]+/, "");

type Clock = { h: number; m: number };
const toClock = (t: string, ap?: string): Clock | null => {
  const m = t.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2]);
  const mer = ap?.toUpperCase();
  if (mer === "PM" && h < 12) h += 12;
  if (mer === "AM" && h === 12) h = 0;
  return { h, m: min };
};

/**
 * Reads the content time string. Supports "Early morning (time TBA)", "7:00 AM" and ranges such as
 * "6:00–6:45 AM" or "6:00 AM – 7:00 AM". Returns display parts plus parsed clocks when the time is concrete.
 */
function readTime(time: string) {
  const tba = time.match(/^(.*?)\s*\(time TBA\)$/i);
  if (tba) return { label: "TBA", part: tba[1], start: null as Clock | null, end: null as Clock | null };
  const range = time.match(/^(\d{1,2}:\d{2})\s*(AM|PM)?\s*[–-]\s*(\d{1,2}:\d{2})\s*(AM|PM)?$/i);
  if (range) {
    const endAp = range[4] ?? range[2];
    const start = toClock(range[1], range[2] ?? endAp);
    const end = toClock(range[3], endAp);
    return { label: range[1], part: (range[2] ?? endAp ?? "").toUpperCase(), start, end };
  }
  const single = time.match(/^(\d{1,2}:\d{2})\s*(AM|PM)?$/i);
  if (single) return { label: single[1], part: (single[2] ?? "").toUpperCase(), start: toClock(single[1], single[2]), end: null };
  return { label: time, part: "", start: null, end: null };
}

const fmt = (c: Clock) => `${((c.h + 11) % 12) + 1}:${String(c.m).padStart(2, "0")} ${c.h < 12 ? "AM" : "PM"}`;
const minutes = (a: Clock, b: Clock) => (b.h * 60 + b.m) - (a.h * 60 + a.m);

/** Time of day: from the clock when known, else from the category or the "Early morning / Evening" wording. */
function partOf(slot: TimetableSlot): Part {
  const t = readTime(slot.time);
  if (t.start) return t.start.h < 11 ? "morning" : t.start.h < 16 ? "midday" : t.start.h < 19 ? "evening" : "night";
  if (slot.category === "sunrise" || /morning/i.test(slot.time)) return "morning";
  if (slot.category === "night" || /night/i.test(slot.time)) return "night";
  if (slot.category === "evening" || /evening/i.test(slot.time)) return "evening";
  return "midday";
}

function statusOf(slot: TimetableSlot): { label: string; tone: "preview" | "open" | "full" | "invite" } {
  if (slot.status === "open") return { label: "Open", tone: "open" };
  if (slot.status === "full") return { label: "Full · Waitlist", tone: "full" };
  if (slot.status === "invite-only") return { label: "Invite only", tone: "invite" };
  return { label: "Preview", tone: "preview" };
}

/** Monday of the current week (local time) and the date for each weekday. */
function weekDates(now: Date): Record<Weekday, Date> {
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
  return Object.fromEntries(WEEKDAYS.map((d, i) => [d, new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i)])) as Record<Weekday, Date>;
}

/** "November 2026" (or "October – November 2026" when the week crosses a month) and "Nov 2 – 8" for the week. */
function monthLabels(dates: Record<Weekday, Date>) {
  const first = dates.Mon, last = dates.Sun;
  const month = (d: Date, year = true) => d.toLocaleDateString("en-US", year ? { month: "long", year: "numeric" } : { month: "long" });
  const sameMonth = first.getMonth() === last.getMonth();
  const sameYear = first.getFullYear() === last.getFullYear();
  const title = sameMonth ? month(first) : `${month(first, !sameYear)} – ${month(last)}`;
  const short = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const range = sameMonth ? `${short(first)} – ${last.getDate()}` : `${short(first)} – ${short(last)}`;
  return { title, range };
}

/** Google Calendar link for a slot with a concrete start time on a known date (none for TBA times). */
function calendarHref(slot: TimetableEntry, date: Date | undefined) {
  const t = readTime(slot.time);
  if (!date || !t.start) return null;
  const end = t.end ?? { h: t.start.h + 1, m: t.start.m };
  const stamp = (c: Clock) => `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}T${String(c.h).padStart(2, "0")}${String(c.m).padStart(2, "0")}00`;
  const q = new URLSearchParams({ action: "TEMPLATE", text: `${slot.title} · BaseCamp CamSur`, dates: `${stamp(t.start)}/${stamp(end)}`, ctz: "Asia/Manila", location: "BaseCamp CamSur, Pili, Camarines Sur" });
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}

function Slot({ slot, date, index }: { slot: TimetableEntry; date?: Date; index: number }) {
  const t = readTime(slot.time);
  const status = statusOf(slot);
  const duration = t.start && t.end ? minutes(t.start, t.end) : null;
  const calendar = calendarHref(slot, date);
  const meta = [slot.coach ? `Coach ${slot.coach}` : "Coach TBA", slot.zone, slot.level].filter(Boolean);

  return (
    <li className="sd-app-slot" data-category={slot.category} style={{ "--i": index } as CSSProperties}>
      <Link href={`/schedule/book?service=class&item=${encodeURIComponent(slot.id)}#book`} aria-label={`${WEEKDAY_LABEL[slot.day]}, ${slot.time}: ${slot.title}. ${status.label}. Request this session`}>
        <span className="sd-app-time">
          <strong>{t.label}</strong>
          {t.part && <small>{t.part}</small>}
          {t.end && <small className="sd-app-end">to {fmt(t.end)}</small>}
        </span>
        <span className="sd-app-body">
          <span className="sd-app-title">{slot.title}</span>
          <span className="sd-app-meta">{meta.join(" · ")}</span>
          <span className="sd-app-tags">
            <span className="sd-app-chip">{chipLabel(slot.category)}</span>
            <span className="sd-app-status" data-tone={status.tone}>{status.label}</span>
            <span className="sd-app-chip sd-app-chip-quiet">{duration ? `${duration} min` : "Duration TBA"}</span>
          </span>
        </span>
        <span className="sd-app-spots"><strong>{slot.capacity ?? "TBA"}</strong><small>Spots</small></span>
        <span className="sd-app-go" aria-hidden="true">Request</span>
      </Link>
      {calendar && <a className="sd-app-cal" href={calendar} target="_blank" rel="noopener noreferrer">Add to calendar</a>}
    </li>
  );
}

/**
 * Weekly timetable styled like the BaseCamp app "Find your rhythm" screen (brand book 2026, Screens · Book):
 * dated day strip that opens on today, discipline + time-of-day filters, and session cards with time, duration,
 * coach, zone, level and status. Every day is in the server HTML; only the selected one is shown. Dates and
 * "today" are set after mount so the server HTML never depends on the visitor's clock.
 */
export default function Timetable({ slots, status, statusHref, statusLabel }: { slots: TimetableEntry[]; status?: string; statusHref?: string; statusLabel?: string }) {
  const [day, setDay] = useState<Weekday>("Mon");
  const [dates, setDates] = useState<Record<Weekday, Date> | null>(null);
  const [today, setToday] = useState<Weekday | null>(null);
  const [filter, setFilter] = useState<Category | "all">("all");
  const [part, setPart] = useState<Part | "all">("all");
  const categories = [...new Set(slots.map((s) => s.category))];
  const parts = PARTS.filter((p) => slots.some((s) => partOf(s) === p));
  // When every session type sits in a single time of day, a second "time of day" row would repeat the first.
  const partsRepeat = categories.length > 1 && categories.every((c) => new Set(slots.filter((s) => s.category === c).map(partOf)).size === 1);

  useEffect(() => {
    const now = new Date();
    const current = WEEKDAYS[(now.getDay() + 6) % 7];
    // Reading the clock is only possible in the browser; set once after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDates(weekDates(now));
    setToday(current);
    setDay(current);
  }, []);

  const matches = (s: TimetableEntry) => (filter === "all" || s.category === filter) && (part === "all" || partOf(s) === part);

  return (
    <div className="sd-timetable sd-app">
      {status && (
        <p className="sd-app-status-line">
          <span className="sd-app-status" data-tone="preview"><i aria-hidden="true" />Preview</span>
          <span>{status}</span>
          {statusHref && statusLabel && <Link href={statusHref}>{statusLabel}</Link>}
        </p>
      )}

      <div className="sd-app-month" aria-live="polite">
        <h3>{dates ? monthLabels(dates).title : " "}</h3>
        {dates && <span>Week of {monthLabels(dates).range}</span>}
      </div>

      <div className="sd-app-days" role="tablist" aria-label="Day of the week">
        {WEEKDAYS.map((d) => (
          <button key={d} type="button" role="tab" id={`sd-tab-${d}`} aria-controls={`sd-day-${d}`} aria-selected={day === d} data-today={today === d ? "" : undefined} onClick={() => setDay(d)}>
            <small>{today === d ? "Today" : d}</small>
            <strong>{dates ? dates[d].getDate() : d.slice(0, 1)}</strong>
            <em>{slots.filter((s) => s.day === d && matches(s)).length} sessions</em>
          </button>
        ))}
      </div>

      <div className="sd-app-filterset">
        {categories.length > 1 && (
          <div className="sd-app-filters" role="toolbar" aria-label={partsRepeat ? "Filter by session" : "Filter by discipline"}>
            <span className="sd-app-filter-label">{partsRepeat ? "Session" : "Discipline"}</span>
            {(["all", ...categories] as const).map((c) => (
              <button key={c} type="button" aria-pressed={filter === c} onClick={() => setFilter(c)}>{c === "all" ? "All" : chipLabel(c)}</button>
            ))}
          </div>
        )}
        {parts.length > 1 && !partsRepeat && (
          <div className="sd-app-filters" role="toolbar" aria-label="Filter by time of day">
            <span className="sd-app-filter-label">Time of day</span>
            {(["all", ...parts] as const).map((p) => (
              <button key={p} type="button" aria-pressed={part === p} onClick={() => setPart(p)}>{p === "all" ? "All day" : PART_LABEL[p]}</button>
            ))}
          </div>
        )}
      </div>

      {WEEKDAYS.map((d) => {
        const daySlots = slots.filter((s) => s.day === d && matches(s));
        const date = dates?.[d];
        return (
          <div key={d} className="sd-app-list" role="tabpanel" id={`sd-day-${d}`} aria-labelledby={`sd-tab-${d}`} hidden={day !== d}>
            <p className="sd-app-dayname">
              {WEEKDAY_LABEL[d]}
              {date && <span> · {date.toLocaleDateString("en-PH", { day: "numeric", month: "long" })}</span>}
            </p>
            {daySlots.length ? <ul>{daySlots.map((slot, i) => <Slot slot={slot} date={date} index={i} key={slot.id} />)}</ul> : <p className="sd-slot-empty">No sessions match these filters</p>}
          </div>
        );
      })}
      <p className="sd-caption">{TIMETABLE_CAPTION}</p>
    </div>
  );
}
