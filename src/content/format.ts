// Formatting helpers (spec §B.6). Pure and client-safe.
import { AVAILABILITY_LABEL } from "./labels";
import type { Availability, Price, PriceGroup, PriceItem } from "./types";

const num = (n: number) => n.toLocaleString("en-US");

/** null → "On request"; with max → "Php 450–600"; else "Php 2,500". */
export function formatPhp(p: Price | null): string {
  if (!p) return "On request";
  return p.max != null ? `Php ${num(p.min)}–${num(p.max)}` : `Php ${num(p.min)}`;
}

/** Uses the item's own USD string when set, else ≈ US$ at the given Php rate. */
export function formatUsd(item: Pick<PriceItem, "price" | "usd">, rate: number): string {
  if (item.usd) return item.usd;
  if (!item.price || !(rate > 0)) return "";
  const { min, max } = item.price;
  return `≈ US$${num(Math.round(min / rate))}${max != null ? `–$${num(Math.round(max / rate))}` : ""}`;
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Manila" });

/** "YYYY-MM-DD" (Asia/Manila) → "12 March 2027"; "" or invalid → "To be announced". */
export function formatDateLabel(date: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return "To be announced";
  const parsed = new Date(`${date}T00:00:00+08:00`);
  return Number.isNaN(parsed.getTime()) ? "To be announced" : dateFormatter.format(parsed);
}

const manilaClock = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Manila", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", hourCycle: "h23" });

/**
 * The Asia/Manila wall-clock time as a local Date: its getFullYear / getDate / getDay / getHours read Manila's
 * calendar and clock whatever the visitor's own time zone, so "today" and "ended" match the gym's day.
 */
export function manilaNow(now: Date = new Date()): Date {
  const p = Object.fromEntries(manilaClock.formatToParts(now).map((x) => [x.type, Number(x.value)]));
  return new Date(p.year, p.month - 1, p.day, p.hour % 24, p.minute, p.second);
}

export function availabilityLabel(a: Availability): string {
  return AVAILABILITY_LABEL[a] ?? "";
}

/** Every pricing item across groups, keyed by item id. */
export function priceItemMap(groups: PriceGroup[]): Map<string, PriceItem> {
  return new Map(groups.flatMap((g) => g.items.map((i) => [i.id, i] as const)));
}
