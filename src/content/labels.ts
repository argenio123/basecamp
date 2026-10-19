// Display labels (spec §0.7, §B.14). Client-safe.
import type { Audience, Availability, Cadence, LaunchPhase } from "./types";

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  available: "Available now",
  "at-launch": "At launch",
  "phase-2": "Phase 2",
  planned: "Planned",
};

export const PHASE_COPY: Record<LaunchPhase, { scheduleNotice: string; bookingSubmit: string; ctaLabel: string }> = {
  "pre-launch": { scheduleNotice: "Timetable preview: sessions open at launch and exact times are still to be confirmed.", bookingSubmit: "Request early access", ctaLabel: "Get early access" },
  "soft-opening": { scheduleNotice: "Soft opening: invitation-only sessions for founding members.", bookingSubmit: "Request a session", ctaLabel: "Become a founding member" },
  live: { scheduleNotice: "BaseCamp is live. Request a session below.", bookingSubmit: "Request a booking", ctaLabel: "Book a session" },
};

/** Audience chip labels (programme explorer). */
export const AUDIENCE_LABEL: Record<Audience, string> = {
  beginner: "I'm new",
  local: "Local athlete",
  traveller: "Visiting",
  competitor: "Competing",
  corporate: "Corporate",
  recovery: "Recovery",
};

/** Sort order for recurring events by cadence. */
export const CADENCE_ORDER: readonly Cadence[] = ["Daily", "Weekly", "Regular", "Monthly", "Quarterly"];
