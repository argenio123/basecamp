"use client";

import Link from "next/link";
import { type CSSProperties, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type RefObject, useEffect, useReducer, useRef, useState } from "react";
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

const DAY_MS = 86_400_000;
const atMidnight = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const weekdayOf = (d: Date): Weekday => WEEKDAYS[(d.getDay() + 6) % 7];
/** Monday of the week that contains `d`. */
const mondayOf = (d: Date) => addDays(d, -((d.getDay() + 6) % 7));
/** Monday-first month grid: whole weeks covering the month that contains `d`. */
function monthGrid(d: Date) {
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  const start = mondayOf(first);
  const weeks = Math.ceil((Math.round((last.getTime() - start.getTime()) / DAY_MS) + 1) / 7);
  return Array.from({ length: weeks * 7 }, (_, i) => addDays(start, i));
}
/** Same day-of-month `n` months away, clamped to the month's last day (Jan 31 + 1 month = Feb 28). */
function addMonths(d: Date, n: number) {
  const lastDay = new Date(d.getFullYear(), d.getMonth() + n + 1, 0).getDate();
  return new Date(d.getFullYear(), d.getMonth() + n, Math.min(d.getDate(), lastDay));
}

/** "November 2026" (or "October – November 2026" when the week crosses a month) and "Nov 2 – 8" for the week. */
function weekLabels(week: Date[]) {
  const first = week[0], last = week[6];
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

function Slot({ slot, date, index, ended }: { slot: TimetableEntry; date?: Date; index: number; ended?: boolean }) {
  const t = readTime(slot.time);
  const status = ended ? { label: "Ended", tone: "ended" as const } : statusOf(slot);
  const duration = t.start && t.end ? minutes(t.start, t.end) : null;
  const calendar = ended ? null : calendarHref(slot, date);
  const meta = [slot.coach ? `Coach ${slot.coach}` : "Coach TBA", slot.zone, slot.level].filter(Boolean);

  const content = (
    <>
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
      <span className="sd-app-go" aria-hidden="true">{ended ? "Ended" : "Request"}</span>
    </>
  );

  return (
    <li className="sd-app-slot" data-category={slot.category} data-ended={ended ? "" : undefined} style={{ "--i": index } as CSSProperties}>
      {ended ? (
        <div className="sd-app-slot-card">{content}</div>
      ) : (
        <Link href={`/schedule/book?service=class&item=${encodeURIComponent(slot.id)}`} aria-label={`${WEEKDAY_LABEL[slot.day]}, ${slot.time}: ${slot.title}. ${status.label}. Request this session`}>{content}</Link>
      )}
      {calendar && <a className="sd-app-cal" href={calendar} target="_blank" rel="noopener noreferrer">Add to calendar</a>}
    </li>
  );
}

/** Month-cell count: "1 event", "3 events", "No events"; a negative count can only be a data error. */
function eventLabel(n: number) {
  if (n < 0) return "Error";
  if (n === 0) return "No events";
  return n === 1 ? "1 event" : `${n} events`;
}

/** True when the session already finished: any session on a past day, or a timed session that ended earlier today. */
function hasEnded(slot: TimetableSlot, date: Date, now: Date) {
  const day = atMidnight(now);
  if (date < day) return true;
  if (date > day) return false;
  const t = readTime(slot.time);
  const end = t.end ?? t.start;
  return !!end && now.getHours() * 60 + now.getMinutes() >= end.h * 60 + end.m;
}

/**
 * Horizontal drag-to-scroll for the calendar. With a mouse, hold and move left / right: the row follows the pointer
 * 1:1; on release it carries on briefly with the throw's speed and eases onto the nearest whole item (a day in the
 * week strip, a month in the month view). Touch keeps native scrolling. `page(n, per)` glides by `per` items.
 */
function useDragScroll(ref: RefObject<HTMLDivElement | null>, onSettle: (el: HTMLDivElement, unit: number) => void) {
  const [grabbing, setGrabbing] = useState(false);
  const s = useRef<{ drag: { x: number; left: number; id: number; moved: boolean; lastX: number; lastT: number; v: number } | null; raf: number; target: number | null; suppress: boolean }>({ drag: null, raf: 0, target: null, suppress: false });
  const settleRef = useRef(onSettle);
  useEffect(() => { settleRef.current = onSettle; });
  useEffect(() => () => cancelAnimationFrame(s.current.raf), []);

  /** Distance between two neighbouring items (item width + gap). */
  const unit = () => {
    const el = ref.current;
    if (!el) return 0;
    const [a, b] = [el.children[0], el.children[1]];
    // Measured with getBoundingClientRect: offsetLeft rounds to whole pixels, and that error adds up across hundreds of days.
    return a && b ? b.getBoundingClientRect().left - a.getBoundingClientRect().left : el.clientWidth;
  };
  const stop = () => { cancelAnimationFrame(s.current.raf); s.current.target = null; };
  const jump = (px: number) => { stop(); if (ref.current) ref.current.scrollLeft = px; };
  const glideTo = (to: number) => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(s.current.raf);
    const target = Math.max(0, Math.min(el.scrollWidth - el.clientWidth, to));
    s.current.target = target;
    const done = () => { el.scrollLeft = target; s.current.target = null; settleRef.current(el, unit()); };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { done(); return; }
    const tick = () => {
      const diff = target - el.scrollLeft;
      if (Math.abs(diff) < 1) { done(); return; }
      el.scrollLeft += Math.abs(diff) < 6 ? Math.sign(diff) * Math.max(1, Math.abs(diff) / 2) : diff * 0.18;
      s.current.raf = requestAnimationFrame(tick);
    };
    s.current.raf = requestAnimationFrame(tick);
  };
  const page = (n: number, per: number) => {
    const el = ref.current, u = unit();
    if (!el || !u) return;
    const base = s.current.target ?? Math.round(el.scrollLeft / u) * u;
    glideTo(base + n * per * u);
  };

  const handlers = {
    onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (e.pointerType !== "mouse" || e.button !== 0 || !el) return;
      stop();
      s.current.drag = { x: e.clientX, left: el.scrollLeft, id: e.pointerId, moved: false, lastX: e.clientX, lastT: e.timeStamp, v: 0 };
    },
    onPointerMove: (e: ReactPointerEvent<HTMLDivElement>) => {
      const d = s.current.drag, el = ref.current;
      if (!d || !el || d.id !== e.pointerId) return;
      const dx = e.clientX - d.x;
      if (!d.moved && Math.abs(dx) < 4) return;
      if (!d.moved) { d.moved = true; el.setPointerCapture(e.pointerId); setGrabbing(true); }
      el.scrollLeft = d.left - dx;
      const dt = e.timeStamp - d.lastT;
      if (dt > 0) d.v = d.v * 0.6 + ((e.clientX - d.lastX) / dt) * 0.4;
      d.lastX = e.clientX;
      d.lastT = e.timeStamp;
    },
    onPointerUp: (e: ReactPointerEvent<HTMLDivElement>) => {
      const d = s.current.drag, el = ref.current;
      if (!d || !el || d.id !== e.pointerId) return;
      s.current.drag = null;
      setGrabbing(false);
      if (!d.moved) return;
      s.current.suppress = true;
      // The click that follows this mouseup (if any) fires before this timeout, so only that one click is swallowed.
      setTimeout(() => { s.current.suppress = false; }, 0);
      const v = e.timeStamp - d.lastT > 80 ? 0 : d.v; // paused before letting go: no throw
      const u = unit() || 1;
      glideTo(Math.round((el.scrollLeft - v * 220) / u) * u);
    },
    onPointerCancel: (e: ReactPointerEvent<HTMLDivElement>) => {
      if (s.current.drag?.id !== e.pointerId) return;
      s.current.drag = null;
      setGrabbing(false);
    },
    onClickCapture: (e: ReactMouseEvent) => { if (s.current.suppress) { s.current.suppress = false; e.stopPropagation(); e.preventDefault(); } },
    onDragStart: (e: ReactMouseEvent) => e.preventDefault(),
  };

  return { grabbing, unit, jump, glideTo, page, handlers };
}

const firstOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const RANGE_WEEKS = 52;
const RANGE_MONTHS = 24;

/**
 * Timetable calendar styled like the BaseCamp app "Find your rhythm" screen (brand book 2026, Screens · Book).
 * The weekly timetable repeats every week, so any date shows that weekday's sessions. Week view is a long strip of
 * days and month view a row of months; both drag left / right with the mouse (or swipe), and the arrows glide by a
 * week or a month. Past sessions are marked "Ended". Dates and "today" are set after mount so the server HTML never
 * depends on the visitor's clock.
 */
export default function Timetable({ slots, status, statusHref, statusLabel }: { slots: TimetableEntry[]; status?: string; statusHref?: string; statusLabel?: string }) {
  const [now, setNow] = useState<Date | null>(null);
  const [selected, setSelected] = useState<Date | null>(null);
  const [view, setView] = useState<"week" | "month">("week");
  // Set once the visitor switches Week / Month, so the flip-in plays on a switch and not on the first page load.
  const [flipped, setFlipped] = useState(false);
  const [filter, setFilter] = useState<Category | "all">("all");
  const [part, setPart] = useState<Part | "all">("all");
  const [, bump] = useReducer((x: number) => x + 1, 0);
  const categories = [...new Set(slots.map((s) => s.category))];
  const parts = PARTS.filter((p) => slots.some((s) => partOf(s) === p));
  // When every session type sits in a single time of day, a second "time of day" row would repeat the first.
  const partsRepeat = categories.length > 1 && categories.every((c) => new Set(slots.filter((s) => s.category === c).map(partOf)).size === 1);

  const matches = (s: TimetableEntry) => (filter === "all" || s.category === filter) && (part === "all" || partOf(s) === part);
  const daySlots = (d: Weekday) => slots.filter((s) => s.day === d && matches(s));
  const today = now ? atMidnight(now) : null;
  const isToday = (d: Date) => !!today && sameDay(d, today);
  const isPast = (d: Date) => !!today && d < today;
  const longDate = (d: Date) => d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  // Week view: days from a year before to a year after `weekAnchor` (a Monday). Month view: two years either side of `monthAnchor`.
  const [weekAnchor, setWeekAnchor] = useState<Date | null>(null);
  const [monthAnchor, setMonthAnchor] = useState<Date | null>(null);
  const [firstVisible, setFirstVisible] = useState<Date | null>(null);
  const [visibleMonth, setVisibleMonth] = useState<Date | null>(null);
  const rangeStart = weekAnchor ? addDays(weekAnchor, -RANGE_WEEKS * 7) : null;
  const days = rangeStart ? Array.from({ length: (RANGE_WEEKS * 2 + 1) * 7 }, (_, i) => addDays(rangeStart, i)) : null;
  const months = monthAnchor ? Array.from({ length: RANGE_MONTHS * 2 + 1 }, (_, i) => addMonths(monthAnchor, i - RANGE_MONTHS)) : null;
  const dayIndex = (d: Date) => (rangeStart ? Math.round((atMidnight(d).getTime() - rangeStart.getTime()) / DAY_MS) : -1);
  const monthIndex = (d: Date) => (monthAnchor ? (d.getFullYear() - monthAnchor.getFullYear()) * 12 + d.getMonth() - monthAnchor.getMonth() + RANGE_MONTHS : -1);
  const pendingWeek = useRef<Date | null>(null);
  const pendingMonth = useRef<Date | null>(null);

  // After a drag or glide settles near either end of the range, re-centre the range on what is in view (no visible jump).
  const weekRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const weekScroll = useDragScroll(weekRef, (el, u) => {
    if (!u || !rangeStart) return;
    const i = Math.round(el.scrollLeft / u);
    if (Math.abs(i - RANGE_WEEKS * 7) < (RANGE_WEEKS - 6) * 7) return;
    const first = addDays(rangeStart, i);
    pendingWeek.current = first;
    setWeekAnchor(mondayOf(first));
  });
  const monthScroll = useDragScroll(monthRef, (el, u) => {
    if (!u || !monthAnchor) return;
    const i = Math.round(el.scrollLeft / u);
    if (Math.abs(i - RANGE_MONTHS) < RANGE_MONTHS - 3) return;
    const month = addMonths(monthAnchor, i - RANGE_MONTHS);
    pendingMonth.current = month;
    setMonthAnchor(month);
  });

  /** Bring the week of `d` into view: glide when it is already in the strip, otherwise re-centre and place it. */
  const showWeek = (d: Date, smooth: boolean) => {
    const monday = mondayOf(d), i = dayIndex(monday);
    if (smooth && view === "week" && i >= 0 && Math.abs(i - RANGE_WEEKS * 7) < (RANGE_WEEKS - 2) * 7) { weekScroll.glideTo(i * weekScroll.unit()); return; }
    pendingWeek.current = monday;
    if (i < 0 || Math.abs(i - RANGE_WEEKS * 7) >= (RANGE_WEEKS - 2) * 7) setWeekAnchor(monday);
    else bump();
  };
  const showMonth = (d: Date, smooth: boolean) => {
    const month = firstOfMonth(d), i = monthIndex(month);
    if (smooth && view === "month" && i >= 0 && Math.abs(i - RANGE_MONTHS) < RANGE_MONTHS - 1) { monthScroll.glideTo(i * monthScroll.unit()); return; }
    pendingMonth.current = month;
    if (i < 0 || Math.abs(i - RANGE_MONTHS) >= RANGE_MONTHS - 1) setMonthAnchor(month);
    else bump();
  };

  const onWeekScroll = () => {
    const el = weekRef.current, u = weekScroll.unit();
    if (!el || !u || !rangeStart) return;
    const first = addDays(rangeStart, Math.round(el.scrollLeft / u));
    setFirstVisible((v) => (v && sameDay(v, first) ? v : first));
  };
  const onMonthScroll = () => {
    const el = monthRef.current, u = monthScroll.unit();
    if (!el || !u || !monthAnchor) return;
    const month = addMonths(monthAnchor, Math.round(el.scrollLeft / u) - RANGE_MONTHS);
    setVisibleMonth((v) => (v && sameDay(v, month) ? v : month));
  };

  // Arrows glide by one week / one month. Holding an arrow keeps going.
  const step = (n: number) => (view === "week" ? weekScroll.page(n, 7) : monthScroll.page(n, 1));
  const hold = useRef<{ delay?: ReturnType<typeof setTimeout>; repeat?: ReturnType<typeof setInterval> }>({});
  const stopHold = () => { clearTimeout(hold.current.delay); clearInterval(hold.current.repeat); hold.current = {}; };
  const startHold = (e: ReactPointerEvent<HTMLButtonElement>, n: number) => {
    if (e.button !== 0) return;
    stopHold();
    step(n);
    hold.current.delay = setTimeout(() => { hold.current.repeat = setInterval(() => step(n), 220); }, 450);
  };
  // Pointer presses step in onPointerDown; the arrows' onClick only steps for keyboard activation (detail 0).

  const switchView = (next: "week" | "month") => {
    if (next === view) return;
    setView(next);
    setFlipped(true);
    const focus = selected ?? today;
    if (!focus) return;
    if (next === "week") { pendingWeek.current = mondayOf(focus); bump(); } else { pendingMonth.current = firstOfMonth(focus); bump(); }
  };
  const goToday = () => {
    if (!today) return;
    setSelected(today);
    if (view === "week") showWeek(today, true); else showMonth(today, true);
  };
  const onToday = !!selected && !!today && sameDay(selected, today) && (view === "week"
    ? !!firstVisible && sameDay(firstVisible, mondayOf(today))
    : !!visibleMonth && sameDay(visibleMonth, firstOfMonth(today)));

  useEffect(() => stopHold, []);
  useEffect(() => {
    const current = new Date();
    // Reading the clock is only possible in the browser; set once after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(current);
    setSelected(atMidnight(current));
    pendingWeek.current = mondayOf(current);
    pendingMonth.current = firstOfMonth(current);
    setWeekAnchor(mondayOf(current));
    setMonthAnchor(firstOfMonth(current));
  }, []);
  // Place a requested week / month instantly once its view and range are rendered.
  useEffect(() => {
    if (view === "week" && pendingWeek.current && days && weekRef.current) {
      const i = dayIndex(pendingWeek.current);
      pendingWeek.current = null;
      weekScroll.jump(i * weekScroll.unit());
      onWeekScroll();
    }
    if (view === "month" && pendingMonth.current && months && monthRef.current) {
      const i = monthIndex(pendingMonth.current);
      pendingMonth.current = null;
      monthScroll.jump(i * monthScroll.unit());
      onMonthScroll();
    }
  });

  const visibleWeek = firstVisible ? Array.from({ length: 7 }, (_, i) => addDays(firstVisible, i)) : null;
  const labels = visibleWeek ? weekLabels(visibleWeek) : null;
  const monthTitle = visibleMonth?.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const selectedDay: Weekday = selected ? weekdayOf(selected) : "Mon";
  const list = daySlots(selectedDay);
  const dayPast = selected ? isPast(selected) : false;

  return (
    <div className="sd-timetable sd-app" data-flip={flipped ? "" : undefined}>
      {status && (
        <p className="sd-app-status-line" data-reveal>
          <span className="sd-app-status" data-tone="preview"><i aria-hidden="true" />Preview</span>
          <span>{status}</span>
          {statusHref && statusLabel && <Link href={statusHref}>{statusLabel}</Link>}
        </p>
      )}

      <div className="sd-app-month" data-reveal data-reveal-delay="short">
        <div className="sd-app-month-title" aria-live="polite">
          <h3 key={view}>{(view === "week" ? labels?.title : monthTitle) ?? " "}</h3>
          {view === "week" && labels && <span>Week of {labels.range}</span>}
        </div>
        <div className="sd-cal-controls">
          <div className="sd-cal-view" role="group" aria-label="Calendar view">
            <button type="button" aria-pressed={view === "week"} onClick={() => switchView("week")}>Week</button>
            <button type="button" aria-pressed={view === "month"} onClick={() => switchView("month")}>Month</button>
          </div>
          <div className="sd-cal-nav">
            <button type="button" className="sd-cal-arrow" onPointerDown={(e) => startHold(e, -1)} onPointerUp={stopHold} onPointerLeave={stopHold} onPointerCancel={stopHold}
              onClick={(e) => { if (e.detail === 0) step(-1); }} onContextMenu={(e) => e.preventDefault()} disabled={!selected} aria-label={view === "week" ? "Previous week" : "Previous month"}>‹</button>
            <button type="button" className="sd-cal-today" onClick={goToday} disabled={!today || onToday}>Today</button>
            <button type="button" className="sd-cal-arrow" onPointerDown={(e) => startHold(e, 1)} onPointerUp={stopHold} onPointerLeave={stopHold} onPointerCancel={stopHold}
              onClick={(e) => { if (e.detail === 0) step(1); }} onContextMenu={(e) => e.preventDefault()} disabled={!selected} aria-label={view === "week" ? "Next week" : "Next month"}>›</button>
          </div>
        </div>
      </div>

      <div className="sd-cal-reveal" data-reveal data-reveal-delay="medium">
      {view === "week" ? (
        <div ref={weekRef} className={`sd-app-days sd-cal-strip${weekScroll.grabbing ? " is-grabbing" : ""}`} role="tablist" aria-label="Days"
          onScroll={onWeekScroll} {...weekScroll.handlers}>
          {days
            ? days.map((date, i) => {
              const d = weekdayOf(date);
              return (
                <button key={date.toDateString()} type="button" role="tab" style={{ "--col": i % 7 } as CSSProperties} aria-selected={!!selected && sameDay(selected, date)} aria-controls="sd-day-panel"
                  aria-label={`${longDate(date)}${isPast(date) ? ", past" : ""}`}
                  data-today={isToday(date) ? "" : undefined} data-past={isPast(date) ? "" : undefined}
                  onClick={() => setSelected(date)}>
                  <small>{isToday(date) ? "Today" : d}</small>
                  <strong>{date.getDate()}</strong>
                  <em data-empty={daySlots(d).length === 0 ? "" : undefined}>{eventLabel(daySlots(d).length)}</em>
                </button>
              );
            })
            : WEEKDAYS.map((d) => (
              <button key={d} type="button" role="tab" aria-selected={d === "Mon"} aria-controls="sd-day-panel">
                <small>{d}</small>
                <strong>{d.slice(0, 1)}</strong>
                <em data-empty={daySlots(d).length === 0 ? "" : undefined}>{eventLabel(daySlots(d).length)}</em>
              </button>
            ))}
        </div>
      ) : (
        <div ref={monthRef} className={`sd-cal-months${monthScroll.grabbing ? " is-grabbing" : ""}`} onScroll={onMonthScroll} {...monthScroll.handlers}>
          {months?.map((month) => {
            const grid = monthGrid(month);
            const title = month.toLocaleDateString("en-US", { month: "long", year: "numeric" });
            return (
              <div key={title} className="sd-cal-month" role="grid" aria-label={title}>
                <div className="sd-cal-row sd-cal-head" role="row">
                  {WEEKDAYS.map((d) => <span key={d} role="columnheader">{d}</span>)}
                </div>
                {Array.from({ length: grid.length / 7 }, (_, w) => (
                  <div className="sd-cal-row" role="row" key={w} style={{ "--row": w + 1 } as CSSProperties}>
                    {grid.slice(w * 7, w * 7 + 7).map((date) => {
                      const count = daySlots(weekdayOf(date)).length;
                      return (
                        <button key={date.toDateString()} type="button" role="gridcell" aria-selected={!!selected && sameDay(date, selected)}
                          aria-label={`${longDate(date)}: ${eventLabel(count)}${isPast(date) ? ", past" : ""}`}
                          data-today={isToday(date) ? "" : undefined} data-past={isPast(date) ? "" : undefined}
                          data-outside={date.getMonth() !== month.getMonth() ? "" : undefined}
                          onClick={() => setSelected(date)}>
                          <strong>{date.getDate()}</strong>
                          {isToday(date) && <small>Today</small>}
                          <em className="sd-cal-count" data-empty={count === 0 ? "" : undefined} aria-hidden="true">{eventLabel(count)}</em>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
      </div>

      <div className="sd-app-filterset" data-reveal>
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

      <div key={selected?.toDateString() ?? "initial"} className="sd-app-list" role="tabpanel" id="sd-day-panel" data-past={dayPast ? "" : undefined}>
        <p className="sd-app-dayname">
          {WEEKDAY_LABEL[selectedDay]}
          {selected && <span> · {selected.toLocaleDateString("en-PH", { day: "numeric", month: "long", year: today && selected.getFullYear() !== today.getFullYear() ? "numeric" : undefined })}</span>}
          {dayPast && <em className="sd-app-past-tag">Past</em>}
        </p>
        {list.length
          ? <ul data-reveal="stagger">{list.map((slot, i) => <Slot slot={slot} date={selected ?? undefined} index={i} key={slot.id} ended={!!selected && !!now && hasEnded(slot, selected, now)} />)}</ul>
          : <p className="sd-slot-empty">No sessions match these filters</p>}
      </div>
      <p className="sd-caption" data-reveal>{TIMETABLE_CAPTION}</p>
    </div>
  );
}
