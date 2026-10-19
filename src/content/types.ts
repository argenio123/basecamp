// Content model for every editable section of the site (spec §B.2).
// Single source of truth for SocialPlatform; client-safe (no runtime imports).
import type { FacilityAnchor, INTEREST_OPTIONS } from "./constants";

export type SectionKey = "settings" | "home" | "programmes" | "recovery" | "pricing" | "schedule" | "story" | "people" | "gallery" | "whyCamsur";
export type LaunchPhase = "pre-launch" | "soft-opening" | "live";
export type Availability = "available" | "at-launch" | "phase-2" | "planned";
/** "/x#y" (starts with "/" but not "//") or "https://…" */
export type Href = string;
/** A path listed in IMAGE_LIBRARY */
export type ImageSrc = string;
export type LinkRef = { label: string; href: Href };
export type SocialPlatform = "Instagram" | "Facebook" | "TikTok" | "YouTube" | "X";
export type Audience = "beginner" | "local" | "traveller" | "competitor" | "corporate" | "recovery";
export type InterestValue = (typeof INTEREST_OPTIONS)[number]["value"];

export type FoundingOffer = { enabled: boolean; title: string; summary: string; example: string; benefits: string[]; cap: number; claimed: number; showCounter: boolean; expiresOn: string; ctaLabel: string };
export type SocialLink = { platform: SocialPlatform; url: string; handle: string };

export type SiteSettings = {
  launchPhase: LaunchPhase;
  /** "YYYY-MM-DD" (Asia/Manila) or "" */
  openingDate: string;
  contact: { addressLines: string[]; phoneDisplay: string; phoneE164: string; email: string; hours: string; mapsQuery: string; googleReviewsUrl: string };
  /** url "" = hidden */
  socials: SocialLink[];
  founding: FoundingOffer;
  exchangeRate: number;
  bookingWidgetUrl: string;
};

export type RhythmPath = { id: string; title: string; who: string; cadence: string; offer: string; body: string; link: LinkRef };
export type Stat = { id: string; value: string; label: string; detail: string };
export type CardLink = { id: string; title: string; body: string; link: LinkRef; availability: Availability };
export type Persona = { id: string; title: string; body: string; link: LinkRef };

export type HomeContent = {
  rhythm: { eyebrow: string; title: string; intro: string; paths: RhythmPath[]; dayRhythm: { id: string; title: string; body: string }[]; linkLabel: string };
  completeSystem: { enabled: boolean; eyebrow: string; title: string; intro: string; pillars: { id: string; name: string; theme: string; subtitle: string; bullets: string[]; link: LinkRef }[]; closing: string };
  stats: { enabled: boolean; title: string; intro: string; image: ImageSrc; items: Stat[]; cta: LinkRef };
  differentiators: { enabled: boolean; eyebrow: string; title: string; intro: string; items: CardLink[] };
  afterDark: { enabled: boolean; eyebrow: string; title: string; body: string; highlights: string[]; image: ImageSrc; cta: LinkRef };
  recoveryTeaser: { enabled: boolean; eyebrow: string; title: string; body: string; modalityIds: string[]; image: ImageSrc; cta: LinkRef };
  dayFlow: { enabled: boolean; title: string; steps: { id: string; title: string; body: string }[]; quote: string };
  pricingTeaser: { enabled: boolean; eyebrow: string; title: string; intro: string; itemIds: string[]; cta: LinkRef };
  personas: { enabled: boolean; eyebrow: string; title: string; items: Persona[] };
  whyCamsur: { enabled: boolean; eyebrow: string; cta: LinkRef };
  founders: { enabled: boolean; eyebrow: string; cta: LinkRef };
  build: { enabled: boolean; eyebrow: string; title: string; intro: string; launchVideoUrl: string; liveTitle: string; liveBody: string; updatesShown: number };
  events: { enabled: boolean; eyebrow: string; title: string; intro: string; count: number; cta: LinkRef };
  social: { enabled: boolean };
  testimonials: { enabled: boolean; title: string };
  earlyAccess: { eyebrow: string; title: string; body: string; benefits: string[]; image: ImageSrc };
};

export type ProgrammeSpace = { label: string; anchor: FacilityAnchor };
export type ProgrammeGoalId = "strength" | "movement" | "engine" | "fitness" | "recover" | "new";
export type FeaturedProgramme = {
  slug: string; title: string; description: string; image: ImageSrc;
  goals: ProgrammeGoalId[]; intensity: number | null; level: string; duration: number; format: string;
  about: string; whoFor: string[];
  timeline: { label: string; minutes: number }[];
  progress: { weeks: number; text: string }[];
  spaces: string[]; interest: InterestValue; bookable: boolean;
};
export type Programme = {
  slug: string; title: string; group: "core" | "wellness" | "phase-2"; availability: Availability;
  summary: string; image: ImageSrc; audiences: Audience[]; level: string; format: string;
  whatToExpect: string; whoFor: string[]; outcomes: string[]; bookable: boolean;
  spaces: ProgrammeSpace[]; interest: InterestValue;
};
export type ProgrammeFormat = { id: string; title: string; description: string; image: ImageSrc; href: Href };
export type Modality = { id: string; title: string; description: string; category: "train" | "outdoor" | "mind-body" | "recovery"; availability: Availability };
export type SimpleItem = { id: string; title: string; description: string; availability: Availability };
export type SignatureWorkout = SimpleItem & { when: string };
export type ProgrammesContent = {
  intro: string; tagline: string;
  featured: FeaturedProgramme[];
  disciplines: { id: string; title: string; description: string }[];
  programmes: Programme[]; formats: ProgrammeFormat[]; modalities: Modality[];
  fusion: SimpleItem[]; signatureWorkouts: SignatureWorkout[];
  assessment: { availability: Availability; promise: string; steps: { id: string; title: string; description: string }[]; categories: string[] };
};

export type RecoveryModality = { id: string; title: string; description: string; detail: string; category: "cold" | "heat" | "contrast" | "compression" | "light" | "oxygen" | "mind-body" | "sleep"; availability: Availability; medicalNote: boolean };
export type RecoveryContent = { intro: string; modalities: RecoveryModality[]; disclaimer: string };

export type Price = { min: number; max: number | null };
export type PriceItem = { id: string; name: string; price: Price | null; unit: string; usd: string; perUnit: string; validity: string; description: string; features: string[]; featured: boolean; badge: string; availability: Availability; visible: boolean };
export type PriceGroup = { id: string; anchor: string; title: string; intro: string; audience: "locals" | "travellers" | "both"; items: PriceItem[] };
export type FaqItem = { id: string; question: string; answer: string };
export type PricingContent = { intro: string; notes: string[]; groups: PriceGroup[]; faq: FaqItem[] };

export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
export type TimetableSlot = { id: string; day: Weekday; time: string; title: string; category: "sunrise" | "class" | "open-gym" | "private" | "evening" | "night" | "recovery"; programmeSlug: string; capacity: number | null; status: "tba" | "invite-only" | "open" | "full" };
export type Cadence = "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Regular";
export type RecurringEvent = { id: string; title: string; cadence: Cadence; description: string; night: boolean; availability: Availability };
export type CalendarEvent = { id: string; title: string; kind: "launch" | "festival" | "competition" | "workshop" | "camp" | "community"; date: string; dateLabel: string; description: string; availability: Availability; ctaHref: Href };
export type ScheduleContent = { intro: string; notice: string; rhythm: { id: string; title: string; description: string }[]; timetable: TimetableSlot[]; recurring: RecurringEvent[]; events: CalendarEvent[]; leaderboardCategories: string[] };

export type BuildUpdate = { id: string; date: string; title: string; body: string; image: ImageSrc; tag: "Build" | "Zone reveal" | "Equipment" | "Design" | "Milestone" };
export type StoryContent = {
  positioning: { notLine: string; headline: string; sub: string; breakdown: { id: string; title: string; body: string }[] };
  brandPillars: { id: string; title: string; body: string }[];
  founders: { eyebrow: string; title: string; paragraphs: string[]; signature: string; image: ImageSrc };
  buildUpdates: BuildUpdate[];
};
export type Coach = { id: string; name: string; role: string; bio: string; credentials: string[]; image: ImageSrc };
export type Partner = { id: string; name: string; type: "accommodation" | "transport" | "wellness" | "ambassador"; description: string; url: string };
export type Testimonial = { id: string; quote: string; name: string; context: string; source: "founding-member" | "soft-opening" | "ambassador" | "google" };
export type PeopleContent = { coaches: Coach[]; partners: Partner[]; testimonials: Testimonial[] };
export type GalleryPost = { id: string; platform: SocialPlatform; type: string; pillar: "training" | "nature" | "community" | "build" | "coaches" | "recovery"; format: "Photo" | "Reel" | "Update"; badge: string; title: string; caption: string; detail: string; image: ImageSrc; imagePosition: string; href: string };
export type GalleryContent = { eyebrow: string; title: string; intro: string; posts: GalleryPost[] };
export type WhyCamsurContent = { title: string; intro: string; reasons: { id: string; title: string; body: string }[]; story: string };

export type SiteContent = {
  settings: SiteSettings; home: HomeContent; programmes: ProgrammesContent; recovery: RecoveryContent;
  pricing: PricingContent; schedule: ScheduleContent; story: StoryContent; people: PeopleContent;
  gallery: GalleryContent; whyCamsur: WhyCamsurContent;
};
/** ISO updatedAt per stored section; absent = using defaults */
export type ContentMeta = Partial<Record<SectionKey, string>>;
