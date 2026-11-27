// Instant class bookings: shared types and rules. No server imports, safe for client components.

/** Stored statuses. A "held" booking whose hold has run out reads as "expired" (see effectiveStatus). */
export type BookingStatus = "held" | "confirmed" | "cancelled" | "expired";

/** One member's place in one session occurrence (a timetable slot on a date). */
export type Booking = {
  id: string;
  slotId: string;
  /** "YYYY-MM-DD" (Asia/Manila). */
  date: string;
  /** Session title and time as shown on the timetable when booked. */
  title: string;
  time: string;
  /** Session start (ISO). Estimated from the time of day when the timetable says "time TBA". */
  startAt: string;
  memberId: string;
  name: string;
  email: string;
  status: BookingStatus;
  /** Free with a membership that includes classes, or paid online. */
  via: "membership" | "payment";
  /** Membership plan name (via = membership). */
  membership?: string;
  /** Linked online payment (via = payment). */
  paymentId?: string;
  /** Amount charged, in centavos (0 when included in a membership). */
  amount: number;
  createdAt: string;
  /** Unpaid holds stop counting against capacity after this (ISO). */
  holdExpiresAt?: string;
  confirmedAt?: string;
  cancelledAt?: string;
  cancelledBy?: "member" | "staff";
  /** Paid after the hold ran out while the session had filled up: staff decide (squeeze in or refund). */
  overCapacity?: boolean;
  /** Staff-facing note, e.g. why a payment needs a refund. */
  note?: string;
};

/** Spots for a session when the timetable leaves capacity empty. */
export const DEFAULT_CAPACITY = 16;
/** How long an unpaid booking keeps its spot while the member pays. */
export const HOLD_MINUTES = 15;
/** Members can cancel up to this many hours before the session starts. */
export const CANCEL_CUTOFF_HOURS = 12;
/** How far ahead sessions can be booked, in days (today included). */
export const BOOKING_WINDOW_DAYS = 14;

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  held: "Awaiting payment",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  expired: "Expired",
};

/** Shown instead of a pay button while online payment is off. */
export const PAYMENTS_OFF_MESSAGE = "Online payment is being set up — request this session instead.";

/** Stored status, with unpaid holds past their expiry read as "expired". */
export function effectiveStatus(b: Pick<Booking, "status" | "holdExpiresAt">, now = Date.now()): BookingStatus {
  if (b.status === "held" && (!b.holdExpiresAt || Date.parse(b.holdExpiresAt) <= now)) return "expired";
  return b.status;
}

/** Counts against capacity: confirmed, or held and not yet expired. */
export const isActive = (b: Pick<Booking, "status" | "holdExpiresAt">, now = Date.now()) => {
  const s = effectiveStatus(b, now);
  return s === "confirmed" || s === "held";
};

/** Members may cancel a held or confirmed booking until CANCEL_CUTOFF_HOURS before the start. */
export function canMemberCancel(b: Booking, now = Date.now()): boolean {
  return isActive(b, now) && Date.parse(b.startAt) - now >= CANCEL_CUTOFF_HOURS * 3_600_000;
}

/** The confirm screen for one session occurrence (members only: under the /pay proxy matcher). */
export const bookHref = (slotId: string, date?: string) => `/pay/book?slot=${encodeURIComponent(slotId)}${date ? `&date=${encodeURIComponent(date)}` : ""}`;
/** The result screen after booking or paying. */
export const bookedHref = (bookingId: string) => `/pay/booked?booking=${encodeURIComponent(bookingId)}`;
/** The staff-confirmed request flow, preselected to this session (and marked as a waitlist request when full). */
export const requestHref = (slotId: string, date?: string, waitlist = false) =>
  `/schedule/book?service=class&item=${encodeURIComponent(slotId)}${date ? `&date=${encodeURIComponent(date)}` : ""}${waitlist ? "&waitlist=1" : ""}`;
export const MY_BOOKINGS_PATH = "/account/history#bookings";

/** Live spots for one day, from GET /api/bookings/spots?date=YYYY-MM-DD. */
export type SpotInfo = { state: "bookable" | "full"; left: number; capacity: number };
export type SpotsResponse = {
  date: string;
  /** Session price label (e.g. "₱450") when online payment is on; null otherwise (members with classes book free). */
  price: string | null;
  /** Instant-bookable or full sessions on that date, by slot id. Sessions not listed keep the request flow. */
  slots: Record<string, SpotInfo>;
};

/** "₱450" from centavos. */
export const pesoLabel = (centavos: number) => `₱${(centavos / 100).toLocaleString("en-PH", { maximumFractionDigits: 2 })}`;
