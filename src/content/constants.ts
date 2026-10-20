// Shared constants and option lists (spec §A.5, §B.14). Client-safe.
import type { SectionKey } from "./types";

export const CONTENT_TAG = "site-content";

/** Same order as the SiteContent type. */
export const SECTION_KEYS = ["settings", "home", "programmes", "recovery", "pricing", "schedule", "story", "people", "gallery", "whyCamsur"] as const satisfies readonly SectionKey[];

export const FACILITY_ANCHORS = { arrival: "arrival", training: "training-zones", running: "running-loop", recovery: "recovery", social: "social-lounge" } as const;
export type FacilityAnchor = (typeof FACILITY_ANCHORS)[keyof typeof FACILITY_ANCHORS];
export const FACILITY_ANCHOR_LABEL: Record<FacilityAnchor, string> = {
  arrival: "Arrival & welcome", "training-zones": "Training zones", "running-loop": "Running loop", recovery: "Recovery", "social-lounge": "Social & lounge",
};

/** Recovery modality id → pricing item id */
export const MODALITY_PRICE_ID: Record<string, string> = {
  "cold-plunge": "cold-plunge", "contrast-therapy": "contrast", compression: "compression", infrared: "infrared",
  "red-light": "red-light", hyperbaric: "hyperbaric", cryotherapy: "cryo", mobility: "mobility",
  breathwork: "breathwork", "sleep-lab": "sleep", "nad-music": "nad", sauna: "sauna-ice",
};

export const ANCHORS = {
  home: ["ways-to-move", "complete-system", "training-ground", "differentiators", "after-dark", "recovery-teaser", "day-at-basecamp", "programmes-pricing", "who-its-for", "why-camsur", "founders-vision", "build", "whats-on", "socials", "testimonials", "early-access"],
  programs: ["disciplines", "finder", "schedule-preview", "class-system", "class-faq", "modalities", "formats", "signature", "fusion", "assessment", "mindset", "coaches", "wellness-partners", "corporate"],
  facilities: ["design", "arrival", "training-zones", "running-loop", "recovery", "social-lounge", "fuel", "signature-spaces", "all-weather", "gallery"],
  membership: ["founding", "tiers", "packs", "day-passes", "open-gym", "yoga", "recovery-pricing", "advanced-recovery", "camps-pricing", "corporate", "faq", "platform"],
  schedule: ["rhythm", "timetable", "night", "competition", "events", "book", "platform"],
  visit: ["why-camsur", "getting-there", "lago-del-rey", "camps", "long-stays"],
  about: ["vision", "problem", "positioning", "pillars", "identity", "edge", "performance-nature", "place", "design", "founders", "build", "different", "vision-ahead", "partners"],
} as const;
/** Plus any home section with enabled=false */
export const CONDITIONAL_ANCHORS = ["home#testimonials", "about#partners", "membership#founding"] as const;

export const INTEREST_OPTIONS = [
  { value: "membership-local", label: "Membership (local)" }, { value: "drop-in", label: "Drop-in / day pass / open gym" },
  { value: "schedule", label: "Class schedule and launch timetable" },
  { value: "yoga", label: "Yoga" }, { value: "recovery", label: "Recovery services" }, { value: "performance-testing", label: "Performance testing" },
  { value: "day-clinic", label: "Day workshop / clinic" }, { value: "training-camp", label: "Training camp / retreat" },
  { value: "hyrox", label: "HYROX-style program" }, { value: "competition-prep", label: "Competition prep" },
  { value: "corporate", label: "Corporate off-site / wellness" }, { value: "extended-stay", label: "Extended stay / digital nomad" },
  { value: "events", label: "Events & community comps" }, { value: "coach-group", label: "Coach bringing a group" },
] as const;
export const PERSONA_OPTIONS = [{ value: "local", label: "Local athlete (CamSur / Bicol)" }, { value: "domestic", label: "Manila / domestic traveler" }, { value: "international", label: "International visitor" }] as const;
export const TIER_OPTIONS = [{ value: "local-basic", label: "Local Basic" }, { value: "athlete", label: "Athlete" }, { value: "premium", label: "Premium" }, { value: "unsure", label: "Not sure yet" }] as const;
export const ENQUIRY_TYPES = [{ value: "general", label: "General inquiry" }, { value: "corporate", label: "Corporate / team booking" }, { value: "partnership", label: "Partnership / ambassador" }, { value: "camp-group", label: "Camp or group booking" }, { value: "media", label: "Media" }] as const;
export const BOOKING_SERVICES = [{ value: "class", label: "Class or open gym" }, { value: "appointment", label: "Recovery or 1:1 appointment" }, { value: "camp", label: "Camp or package" }, { value: "corporate", label: "Corporate / group session" }] as const;
export const BOOKING_ADDONS = ["Sauna / ice bath session", "Sports massage & physio", "Performance testing", "Recovery bundle"] as const;
/** Booking form "preferred time" values (stored verbatim). */
export const PREFERRED_TIMES = ["Early morning", "Midday", "Evening", "Flexible"] as const;
