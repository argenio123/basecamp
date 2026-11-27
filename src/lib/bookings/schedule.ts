// Which timetable sessions can be booked instantly, when they start, and what they cost. Pure (no storage, no
// request APIs), so the confirm page, the server action, the spots route and tests all apply the same rules.
import type { PriceItem, SiteContent, TimetableSlot, Weekday } from "@/content/types";
import { findPayable, type Payable } from "@/lib/payments/catalog";
import { BOOKING_WINDOW_DAYS, DEFAULT_CAPACITY } from "./types";

const WEEKDAYS: Weekday[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
/** Coached classes. Open gym, recovery and private sessions keep the request flow (they're priced differently). */
const CLASS_CATEGORIES: TimetableSlot["category"][] = ["sunrise", "class", "evening", "night"];

const manilaDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila", year: "numeric", month: "2-digit", day: "2-digit" });

/** Today's date in Asia/Manila, "YYYY-MM-DD". */
export const manilaToday = (now = new Date()) => manilaDate.format(now);

export function isDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const t = Date.parse(`${s}T00:00:00Z`);
  return !Number.isNaN(t) && new Date(t).toISOString().startsWith(s);
}

/** "YYYY-MM-DD" n days after `date`. */
export function addDays(date: string, n: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export const weekdayOf = (date: string): Weekday => WEEKDAYS[new Date(`${date}T00:00:00Z`).getUTCDay()];

/** "Tuesday, 1 December 2026" */
export const longDate = (date: string) => new Date(`${date}T12:00:00+08:00`).toLocaleDateString("en-PH", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Manila" });

/**
 * Start time of a session on a date. Reads "7:00 AM", "6:00–6:45 AM" or "18:30"; for "Early morning (time TBA)"
 * and the like it takes the earliest plausible hour for that part of the day, so the cancellation cut-off errs early.
 */
export function sessionStart(slot: Pick<TimetableSlot, "time" | "category">, date: string): { at: Date; known: boolean } {
  const clock = slot.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  let h = 0, m = 0, known = false;
  if (clock) {
    h = Number(clock[1]);
    m = Number(clock[2]);
    const mer = (clock[3] ?? slot.time.match(/\b(AM|PM)\b/i)?.[1] ?? "").toUpperCase();
    if (mer === "PM" && h < 12) h += 12;
    if (mer === "AM" && h === 12) h = 0;
    known = h < 24 && m < 60;
  }
  if (!known) {
    const t = slot.time.toLowerCase();
    h = /early|sunrise|dawn/.test(t) ? 5 : /morning/.test(t) ? 6 : /midday|noon|lunch/.test(t) ? 11 : /afternoon/.test(t) ? 13 : /evening/.test(t) ? 17 : /night/.test(t) ? 18
      : slot.category === "sunrise" ? 5 : slot.category === "evening" ? 17 : slot.category === "night" ? 18 : 5;
    m = 0;
  }
  const at = new Date(`${date}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00+08:00`);
  return { at, known };
}

export const capacityOf = (slot: Pick<TimetableSlot, "capacity">) => (slot.capacity && slot.capacity > 0 ? Math.floor(slot.capacity) : DEFAULT_CAPACITY);

export const isClassSlot = (slot: Pick<TimetableSlot, "category">) => CLASS_CATEGORIES.includes(slot.category);

export type Occurrence =
  | { ok: true; slot: TimetableSlot; date: string; startAt: Date; timeKnown: boolean; capacity: number }
  /** request: book through the staff-confirmed request flow; full: staff marked it full (waitlist). */
  | { ok: false; code: "missing" | "request" | "full" | "date" | "past" | "later"; message: string; slot?: TimetableSlot };

/**
 * Whether `slotId` on `date` can be booked instantly. Only coached classes that staff have set to "Open" in the
 * timetable editor qualify (TBA, invite-only and non-class sessions stay request-only), within the booking window,
 * from the opening date (when set) and before the session starts.
 */
export function resolveOccurrence(content: SiteContent, slotId: string, date: string, now = new Date()): Occurrence {
  const slot = content.schedule.timetable.find((s) => s.id === slotId);
  if (!slot) return { ok: false, code: "missing", message: "This session is no longer on the timetable." };
  if (slot.status === "full") return { ok: false, code: "full", message: "This session is full. Join the waitlist and we'll tell you if a spot opens.", slot };
  if (!isClassSlot(slot) || slot.status !== "open") return { ok: false, code: "request", message: "This session is booked by request: our team confirms it with you.", slot };
  if (!isDate(date) || weekdayOf(date) !== slot.day) return { ok: false, code: "date", message: "That date doesn't match this session. Pick it again from the timetable.", slot };
  const today = manilaToday(now);
  const opening = content.settings.openingDate;
  if (opening && isDate(opening) && date < opening) return { ok: false, code: "later", message: `Sessions start on ${longDate(opening)}.`, slot };
  if (date > addDays(today, BOOKING_WINDOW_DAYS - 1)) return { ok: false, code: "later", message: `Sessions can be booked up to ${BOOKING_WINDOW_DAYS} days ahead.`, slot };
  const start = sessionStart(slot, date);
  if (date < today || start.at.getTime() <= now.getTime()) return { ok: false, code: "past", message: "This session has already started.", slot };
  return { ok: true, slot, date, startAt: start.at, timeKnown: start.known, capacity: capacityOf(slot) };
}

/** The next date (within the window) this session can be booked, or "" when none. */
export function nextBookableDate(content: SiteContent, slotId: string, now = new Date()): string {
  const today = manilaToday(now);
  for (let i = 0; i < BOOKING_WINDOW_DAYS; i++) {
    const date = addDays(today, i);
    if (resolveOccurrence(content, slotId, date, now).ok) return date;
  }
  return "";
}

/**
 * The single-session price from the pricing content: the drop-in item ("drop-in-standard"), else the first payable
 * drop-in / single-session item. Null when none is payable (the confirm page then falls back to the request flow).
 */
export function sessionPayable(content: SiteContent): Payable | null {
  const preferred = findPayable(content, "drop-in-standard");
  if (preferred) return preferred;
  const looksSingle = (i: PriceItem) => /drop-?in|single (class|session)|per (class|session)/i.test(`${i.id} ${i.name} ${i.unit}`) && !/yoga|recovery|sauna|massage/i.test(`${i.id} ${i.name}`);
  for (const group of content.pricing.groups) {
    for (const item of group.items) {
      if (!looksSingle(item)) continue;
      const payable = findPayable(content, item.id);
      if (payable && payable.kind === "pass") return payable;
    }
  }
  return null;
}

/**
 * Membership plans (pricing item ids in the "memberships" group) whose members book coached classes free. An explicit
 * list, never read from the feature text: copy edits and translations (e.g. "Hindi kasama ang mga coached class")
 * can't change who pays. A new plan that includes classes is added here.
 */
export const CLASS_MEMBERSHIP_IDS: ReadonlySet<string> = new Set(["athlete", "premium"]);

/** True when a membership plan on the price list includes coached classes (see CLASS_MEMBERSHIP_IDS). */
export function membershipIncludesClasses(content: SiteContent, itemId: string): boolean {
  const item = content.pricing.groups.find((g) => g.id === "memberships")?.items.find((i) => i.id === itemId);
  return !!item && CLASS_MEMBERSHIP_IDS.has(item.id);
}
