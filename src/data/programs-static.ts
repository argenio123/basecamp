// Static (non-editable) copy for /programs and /schedule (P-PROG). Deck-based; spec §C.2, §C.3, stage-3 §1/§3.
// Editable content lives in getSiteContent().programmes / .schedule / .people.
import type { Availability, CalendarEvent, InterestValue, Modality, TimetableSlot, Weekday } from "@/content/types";

type StaticItem = { id: string; title: string; description: string };

/** Stage-2 programme content distributed across the five Stage-3 flagship pages. */
export type FeaturedProgrammeLinks = {
  offerings?: readonly string[];
  disciplines?: readonly string[];
  modalities?: readonly string[];
  formats?: readonly string[];
  signature?: readonly string[];
  fusion?: readonly string[];
  priceItems?: readonly string[];
  partners?: boolean;
};

export const FEATURED_PROGRAMME_LINKS: Readonly<Record<string, FeaturedProgrammeLinks>> = {
  "strength-conditioning": {
    offerings: ["open-gym", "commercial-gym"],
    disciplines: ["commercial", "zones"],
    modalities: ["strength"],
    formats: ["competition-prep"],
    signature: ["sunrise-strength"],
    priceItems: ["athlete", "local-basic", "gym-month"],
  },
  "functional-training": {
    offerings: ["crossfit-group", "foundations"],
    disciplines: ["functional", "coaching"],
    modalities: ["crossfit", "outdoor"],
    formats: ["daily-classes", "community-comps"],
    signature: ["camsur-crucible"],
    priceItems: ["athlete", "intro-5", "pack-10"],
  },
  "personal-coaching": {
    offerings: ["massage-physio", "wellness-consults"],
    disciplines: ["coaching"],
    priceItems: ["premium", "massage-physio"],
    partners: true,
  },
  endurance: {
    offerings: ["hyrox", "outdoor-running", "weekend-camps"],
    disciplines: ["hyrox", "zones"],
    modalities: ["hyrox", "running", "trail-running", "paddle", "swimming", "outdoor"],
    formats: ["competition-prep", "hyrox-programmes", "training-camps"],
    signature: ["lake-loop", "night-games"],
    fusion: ["pilates-trail-running", "dance-hyrox", "barefoot-trail-nature"],
    priceItems: ["athlete", "day-pass-standard", "camp-day-workshop"],
  },
  "recovery-mobility": {
    offerings: ["ice-sauna", "mobility-deck", "therapy-zones", "yoga-breathwork"],
    modalities: ["recovery", "yoga", "pilates"],
    fusion: ["ice-breathwork-mobility", "sauna-meditation-journaling", "yoga-weightlifting"],
    priceItems: ["mobility", "sauna-ice", "yoga-single"],
  },
};

/* ---------- /programs/[slug]: what belongs to each programme ---------- */

/**
 * Shared /programs content distributed to programme pages (stage-3 §1). Ids refer to content
 * (programmes.disciplines / modalities / signatureWorkouts / fusion, pricing item ids); unknown ids are skipped,
 * so admin edits never break a page. Programmes not listed here fall back to INTEREST_PRICE_ITEMS.
 */
export type ProgrammeLinks = {
  discipline?: string;
  modalities?: readonly string[];
  signature?: readonly string[];
  fusion?: readonly string[];
  /** Pricing item ids, most relevant first (max 3 shown). */
  priceItems?: readonly string[];
  /** Show the wellness-partner specialists link. */
  partners?: boolean;
};
export const PROGRAMME_LINKS: Readonly<Record<string, ProgrammeLinks>> = {
  "crossfit-group": { discipline: "functional", modalities: ["crossfit"], signature: ["camsur-crucible", "sunrise-strength"], priceItems: ["athlete", "intro-5", "drop-in-standard"] },
  hyrox: { discipline: "hyrox", modalities: ["hyrox", "running"], signature: ["night-games"], fusion: ["dance-hyrox"], priceItems: ["athlete", "day-pass-standard", "camp-day-workshop"] },
  "open-gym": { modalities: ["strength"], priceItems: ["gym-day", "gym-week", "gym-month"] },
  "commercial-gym": { discipline: "commercial", modalities: ["strength"], priceItems: ["local-basic", "gym-day", "gym-month"] },
  "outdoor-running": { discipline: "zones", modalities: ["outdoor", "running", "trail-running"], signature: ["lake-loop"], fusion: ["pilates-trail-running", "barefoot-trail-nature"], priceItems: ["athlete", "day-pass-standard"] },
  foundations: { discipline: "coaching", priceItems: ["intro-5", "pack-10"] },
  "ice-sauna": { modalities: ["recovery"], fusion: ["ice-breathwork-mobility", "sauna-meditation-journaling"], priceItems: ["sauna-ice", "recovery-bundle"] },
  "mobility-deck": { modalities: ["recovery"], fusion: ["ice-breathwork-mobility"], priceItems: ["mobility", "premium"] },
  "massage-physio": { priceItems: ["massage-physio"], partners: true },
  "therapy-zones": { modalities: ["recovery"], priceItems: ["premium", "sauna-ice", "recovery-bundle"] },
  "wellness-consults": { priceItems: [], partners: true },
  "yoga-breathwork": { modalities: ["yoga"], fusion: ["yoga-weightlifting"], priceItems: ["yoga-single", "yoga-5", "yoga-addon"] },
  "weekend-camps": { priceItems: ["camp-weekend-training", "camp-weekend-all-inclusive", "camp-week-immersive"] },
};

/** Pricing items by the programme's interest value, for programmes not in PROGRAMME_LINKS. */
export const INTEREST_PRICE_ITEMS: Partial<Record<InterestValue, readonly string[]>> = {
  "membership-local": ["local-basic", "athlete", "premium"],
  "drop-in": ["drop-in-standard", "day-pass-standard", "gym-day"],
  yoga: ["yoga-single", "yoga-5", "yoga-addon"],
  recovery: ["sauna-ice", "massage-physio", "recovery-bundle"],
  "day-clinic": ["camp-day-workshop"],
  "training-camp": ["camp-weekend-training", "camp-weekend-all-inclusive", "camp-week-immersive"],
  hyrox: ["athlete", "camp-day-workshop"],
  corporate: ["corporate-groups"],
};

export const OUTCOMES_NOTE = "These are the markers we track, not a promise: progress depends on your starting point, consistency and recovery.";
export const SCHEDULE_SOON = "Schedule releasing soon";

/** Clear, outcome-led labels used on the flagship program overview. */
export const FEATURED_PROGRAMME_OUTCOMES: Readonly<Record<string, string>> = {
  "strength-conditioning": "Build durable, whole-body strength",
  "functional-training": "Move better and build all-round fitness",
  "personal-coaching": "Follow a plan shaped around you",
  endurance: "Develop pace, resilience and aerobic capacity",
  "recovery-mobility": "Restore range of motion and recover well",
};

export type ClassPreview = {
  id: string;
  title: string;
  programmeSlug: string;
  programme: string;
  goal: string;
  intensity: string;
  level: string;
  duration: string;
  coach: string;
  area: string;
  equipment: string;
  access: string;
  availability: Availability;
  filters: readonly ClassFilter[];
};

export type ClassFilter = "beginner" | "strength" | "conditioning" | "endurance" | "recovery" | "one-to-one";

export const CLASS_FILTERS: readonly { value: "all" | ClassFilter; label: string }[] = [
  { value: "all", label: "All classes" },
  { value: "beginner", label: "Beginner friendly" },
  { value: "strength", label: "Strength" },
  { value: "conditioning", label: "Conditioning" },
  { value: "endurance", label: "Endurance" },
  { value: "recovery", label: "Recovery" },
  { value: "one-to-one", label: "1:1 coaching" },
];

/**
 * Launch catalogue: programs describe the training outcome; these are the sessions members will book.
 * Exact coaches and times remain deliberately uncommitted until the operating timetable is confirmed.
 */
export const CLASS_PREVIEW: readonly ClassPreview[] = [
  {
    id: "sunrise-strength",
    title: "Sunrise Strength",
    programmeSlug: "strength-conditioning",
    programme: "Strength & Conditioning",
    goal: "Progress the major lifts and build usable strength.",
    intensity: "4 / 5",
    level: "All levels",
    duration: "60 min",
    coach: "Coach line-up to be announced",
    area: "Strength area",
    equipment: "Racks, barbells and free weights",
    access: "Athlete membership or class pass",
    availability: "at-launch",
    filters: ["strength", "beginner"],
  },
  {
    id: "basecamp-conditioning",
    title: "BaseCamp Conditioning",
    programmeSlug: "functional-training",
    programme: "Functional Training",
    goal: "Build work capacity through scalable, varied movement.",
    intensity: "3 / 5",
    level: "All levels",
    duration: "50 min",
    coach: "Coach line-up to be announced",
    area: "Main training floor",
    equipment: "Rigs, cardio and functional kit",
    access: "Athlete membership or class pass",
    availability: "at-launch",
    filters: ["conditioning", "beginner"],
  },
  {
    id: "engine-room",
    title: "Engine Room",
    programmeSlug: "endurance",
    programme: "Endurance",
    goal: "Improve pacing and repeatable aerobic output.",
    intensity: "4 / 5",
    level: "Intermediate+",
    duration: "45 min",
    coach: "Coach line-up to be announced",
    area: "Running loop and training floor",
    equipment: "Running loop, sleds and cardio stations",
    access: "Athlete membership or class pass",
    availability: "at-launch",
    filters: ["conditioning", "endurance"],
  },
  {
    id: "mobility-reset",
    title: "Mobility Reset",
    programmeSlug: "recovery-mobility",
    programme: "Recovery & Mobility",
    goal: "Restore movement quality between harder sessions.",
    intensity: "1 / 5",
    level: "Beginner friendly",
    duration: "45 min",
    coach: "Coach line-up to be announced",
    area: "Recovery level",
    equipment: "Mats, bands and mobility tools",
    access: "Membership, recovery credit or class pass",
    availability: "at-launch",
    filters: ["recovery", "beginner"],
  },
  {
    id: "personal-assessment",
    title: "Personal Assessment",
    programmeSlug: "personal-coaching",
    programme: "Personal Coaching",
    goal: "Set a baseline and define an individual training plan.",
    intensity: "Individual",
    level: "All levels",
    duration: "60 min",
    coach: "Assigned coach to be confirmed",
    area: "Coaching and assessment area",
    equipment: "Movement and performance assessment tools",
    access: "Booked coaching appointment",
    availability: "at-launch",
    filters: ["one-to-one", "beginner"],
  },
];

export const CLASS_RHYTHM_PREVIEW = [
  { id: "sunrise", window: "Early morning", title: "Sunrise strength & conditioning", note: "Before the heat" },
  { id: "open", window: "Midday", title: "Open gym & 1:1 coaching", note: "Independent and private training" },
  { id: "recovery", window: "By appointment", title: "Recovery & mobility", note: "Book a guided reset" },
  { id: "evening", window: "Evening", title: "Team conditioning", note: "Coach-led group sessions" },
  { id: "weekend", window: "Weekend", title: "Endurance sessions", note: "Longer outdoor work" },
] as const;

export const CLASS_FAQ = [
  { question: "Do I need experience?", answer: "No. Beginner-friendly sessions are clearly labelled and coaches scale movements, loads and pace to the athlete in front of them." },
  { question: "How long are classes?", answer: "Most launch classes are planned for 45 to 60 minutes. The final duration is shown on each class before booking opens." },
  { question: "What should I bring?", answer: "Wear comfortable training clothes and suitable shoes. Class-specific equipment is provided; hydration and any personal supports are your responsibility." },
  { question: "Do I need to book in advance?", answer: "Coached classes, appointments and recovery sessions will require advance booking. Open-gym access will follow the access rules of your membership or pass." },
  { question: "Which membership includes classes?", answer: "Access depends on the class. Each listing identifies whether it is included in a membership, uses a class pass or requires a separate appointment." },
  { question: "What happens when a class is full?", answer: "When live booking launches, full classes will offer a waitlist. Members will be notified if a place becomes available." },
] as const;

/* ---------- /programs: shared sections ---------- */

export const MODALITY_FILTERS: { value: "all" | Modality["category"]; label: string }[] = [
  { value: "all", label: "All" },
  { value: "train", label: "Train" },
  { value: "outdoor", label: "Outdoor & water" },
  { value: "mind-body", label: "Mind-body" },
  { value: "recovery", label: "Recovery" },
];

export const MODALITY_REASONS: StaticItem[] = [
  { id: "appeal", title: "Broader market appeal", description: "Couples and groups with different interests all find programming they love." },
  { id: "stays", title: "Longer stays", description: "Variety prevents staleness: stay for weeks without repeating." },
  { id: "cross-training", title: "Cross-training benefits", description: "CrossFitters benefit from yoga; runners improve with strength work." },
  { id: "positioning", title: "Unique positioning", description: "Phuket is known for fight sports. Bali for yoga and surf. CamSur is building for multi-sport athleticism." },
];

export const FUSION_CHIPS = ["Hard / soft", "Hot / cold", "Fast / slow", "Social / solo"] as const;

export const TESTING_LAB = {
  title: "Performance Testing Lab",
  availability: "planned" as Availability,
  description: "VO2 testing, InBody scanning, grip dynamometer, mobility assessment tools and data tracking create baseline data for every guest.",
  cta: { label: "Register interest in testing", href: "/contact?interest=performance-testing" },
};

export const PERSONALISATION: StaticItem[] = [
  { id: "hrv", title: "HRV tracking", description: "Daily morning readiness: hard sessions when fresh, recovery when depleted." },
  { id: "sleep", title: "Sleep cycle analysis", description: "Wearable sleep tracking, with training load adjusted when sleep is poor." },
  { id: "stress", title: "Stress mapping", description: "Check-ins combined with HRV, resting heart rate and sleep quality, with breathwork when stress runs high." },
  { id: "form", title: "Form analytics cameras", description: "AI movement analysis to spot form breakdown under fatigue and track technique across sessions." },
  { id: "load", title: "Intelligent load progression", description: "Weight and volume progressions guided by your performance data and recovery capacity." },
  { id: "wearables", title: "Wearable integration", description: "Apple Watch, Garmin, Whoop in a single dashboard. Guests own their data and can export it." },
];
export const PERSONALISATION_CLOSING = "Every guest leaves smarter, not just happier.";

export const MINDSET_INTRO = "Physical training without mental training is incomplete.";
export const MINDSET: StaticItem[] = [
  { id: "focus", title: "Focus training", description: "Structured attention drills during workouts and meditation practice that sharpen concentration under distraction." },
  { id: "decisions", title: "Decision-making under fatigue", description: "Cognitive tasks and quick-thinking challenges built into rest intervals, training focus for crucial moments." },
  { id: "visualisation", title: "Visualization work", description: "Guided imagery before challenging workouts and mental rehearsal of competition scenarios." },
  { id: "sessions", title: "Guided mindset sessions", description: "Group workshops on growth mindset, self-talk, stress reframing, goal-setting and confidence." },
];

export const COACHES_PLACEHOLDER = {
  title: "Meet the coaches: line-up announced before opening.",
  body: "Coaching philosophy: progressive overload, periodization and individual athlete development.",
};

// Deck p66 "Wellness providers": titles only (spec C.2.11), no invented descriptions.
export const WELLNESS_PARTNERS: { id: string; title: string }[] = [
  { id: "physio", title: "Licensed physiotherapists" },
  { id: "massage", title: "Massage therapists" },
  { id: "nutrition", title: "Nutrition consultants" },
  { id: "mental", title: "Mental performance coaches" },
];
export const PARTNER_TERMS = "By request · partner-based";

export const CORPORATE_BAND = {
  title: "Corporate groups & off-sites.",
  body: "Team-building and wellness off-sites with customized programming: for companies seeking unique venues for team off-sites, leadership development, and wellness programming that actually engages participants. Recovery infrastructure is designed for groups.",
  cta: { label: "Inquire about corporate groups", href: "/contact?enquiry=corporate" },
};

/* ---------- /schedule ---------- */

export const WEEKDAY_LABEL: Record<Weekday, string> = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" };
export const WEEKDAYS: readonly Weekday[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const SLOT_CATEGORY_LABEL: Record<TimetableSlot["category"], string> = {
  sunrise: "☀ Sunrise", class: "Class", "open-gym": "Open gym", private: "Private", evening: "Evening", night: "☾ Night", recovery: "Recovery",
};
export const SLOT_STATUS_LABEL: Record<TimetableSlot["status"], string> = { tba: "TBA", "invite-only": "Invite only", open: "Open", full: "Full · Join waitlist" };
export const TIMETABLE_CAPTION = "Times are refined as we open: sessions are added at high-demand times.";

export const NIGHT_ELEMENTS: (StaticItem & { availability: Availability })[] = [
  { id: "lighting", title: "Lakefront stadium lighting", description: "Sports lighting across the running loop, training zones and water's edge: bright enough for safety, dramatic enough for atmosphere.", availability: "planned" },
  { id: "night-games", title: "Night Games (HYROX-style)", description: "Weekly competitive events under lights, with team competitions, spectators and leaderboards.", availability: "planned" },
  { id: "fnl", title: "Friday Night Lights (CrossFit-style)", description: "A signature weekly event with scaled divisions and a social gathering afterwards.", availability: "planned" },
  { id: "heat", title: "Summer heat avoidance", description: "Train hard without the afternoon sun.", availability: "planned" },
  { id: "music", title: "Music + lights + crowds", description: "DJ sets, light shows synced to workouts, spectators welcome.", availability: "planned" },
];

export const EVENT_KIND_GROUPS: { kind: CalendarEvent["kind"]; label: string }[] = [
  { kind: "launch", label: "Opening" },
  { kind: "festival", label: "Festivals" },
  { kind: "competition", label: "Competitions" },
  { kind: "workshop", label: "Workshops" },
  { kind: "camp", label: "Camps" },
  { kind: "community", label: "Community" },
];

export const PLATFORM_CARDS: StaticItem[] = [
  { id: "booking", title: "Class & facility booking", description: "Reservations for daily classes, open gym slots and facility access." },
  { id: "membership", title: "Membership management", description: "Subscriptions, payments and member communications in one place." },
  { id: "camps", title: "Camp reservations", description: "Booking for multi-day training camps and retreat packages." },
  { id: "tracking", title: "Performance tracking", description: "Log workouts, track progress and see your improvement over time." },
];
export const PLATFORM_COMING_SOON = ["Member app", "Online payments (cards, digital wallets, multi-currency)", "SMS reminders", "Virtual classes", "Daily WOD preview"] as const;

export const BOOKING_NOTE = "Requests are confirmed by our team by email or phone. Online payment and instant confirmation are coming soon.";
