// Static visit copy (spec §C.5, deck pp.53–58, 66). Editable data: `whyCamsur`, `settings.contact`, pricing group `camps`.
// Stage 3 (§1): /visit = getting there + map; /visit/camps = camps + camps pricing + long stays; /visit/why-camsur = why CamSur + Lago Del Rey.
import type { Availability } from "@/content/types";

export type VisitItem = { title: string; body?: string; availability?: Availability };

// ---------- /visit (overview) ----------
export const VISIT_META = {
  title: "Visit",
  description: "Plan your visit to BaseCamp CamSur in Pili, Camarines Sur: address, map, and directions, with flights to Naga or Legazpi, car rental, and van transfers. Accessible from Manila.",
};

export const VISIT_HERO = {
  title: "Come train with us.",
  intro: "BaseCamp CamSur is in Pili, Camarines Sur, accessible from Manila. Here's how to find us.",
  image: "/images/programs/generated/endurance.png",
  imageAlt: "Athlete running on a curved treadmill in the open-air gym with mountains behind",
};

export const VISIT_GLANCE = {
  summary: "Fly into Naga or Legazpi.\nDrive to Pili.\nTrain at BaseCamp.",
};

export const GETTING_THERE = {
  eyebrow: "Getting there",
  title: "Find BaseCamp.",
  directionsLabel: "Get directions",
  line: "Accessible from Manila.",
  airports: "Naga or Legazpi",
  options: [
    { title: "Flights to Naga or Legazpi", body: "Airlines fly to both airports." },
    { title: "Car rental", body: "Car rental services." },
    { title: "Van transfers", body: "Van transfer operators." },
    { title: "Villa Del Rey shuttle", body: "Shuttle coordination: details to be announced." },
  ] satisfies VisitItem[],
};

export const VISIT_CTA = { eyebrow: "Plan your visit" };

// ---------- /visit/why-camsur ----------
export const WHY_META = {
  title: "Why CamSur",
  description: "Why train in Camarines Sur: the freshwater and forest alternative to Bali and Phuket, with a year-round tropical climate and water training on Lago Del Rey.",
};

export const WHY_HERO = {
  title: "Train where nature pushes back.",
  intro: "Lakes, forest, and mountains, not beaches.",
  image: "/images/programs/generated/recovery-mobility.png",
  imageAlt: "Coach guiding a mobility session in the open-air gym with tropical hills behind",
};

export const WHY_GLANCE = {
  summary: "Freshwater, not beach.\nTraining all year.\nConditioning on the lake.",
  eyebrow: "Why CamSur",
};

/** Four reasons as big words + one line (short versions of the deck's why-CamSur reasons). */
export const WHY_STATS = [
  { value: "365", label: "Days of outdoor training a year." },
  { value: "Lakes", label: "Freshwater and forest, not beach." },
  { value: "Cooler", label: "Calmer water, mountain backdrops." },
  { value: "Manila", label: "A short flight to Naga or Legazpi." },
];

export const LAGO = {
  eyebrow: "Lago Del Rey",
  title: "Train on the water.",
  body: "A protected lake for year-round water training.",
  note: "Partner experiences",
  chips: ["Paddle training", "Open-water swims", "Wakeboarding at CWC", "Trails", "Triathlon courses", "Sunrise hikes"],
  image: "/images/programs/generated/functional-training.png",
  imageAlt: "Athlete driving a sled in the open-air gym with the lake and mountains behind",
};

/** Bali vs Phuket vs CamSur, as three dark tiles. */
export const WHY_CONTRAST = {
  eyebrow: "The difference",
  title: "Feel good. Train hard. Prove it.",
  items: [
    { title: "Bali", body: "Feel good: leave relaxed." },
    { title: "Phuket", body: "Train hard: leave exhausted." },
    { title: "CamSur", body: "Prove results: leave with the data." },
  ],
};

// ---------- /visit/camps ----------
export const CAMPS_META = {
  title: "Camps & Trips",
  description: "Training camps, group trips, and long stays at BaseCamp CamSur: day clinics, weekend and week-long immersive camps with lodging at Villa Del Rey, and long stays for remote workers. Inquiry only.",
};

export const CAMPS_HERO = {
  title: "Train hard. Stay longer.",
  intro: "Train, recover, and stay together.",
  image: "/images/membership/generated/launch-promotions-hero-basecamp-interior.png",
  imageAlt: "A group of athletes training together around a sled at BaseCamp CamSur",
};

export const CAMPS_GLANCE = {
  summary: "One-day clinics.\nWeek-long camps.\nStays that last months.",
};

/** Camp types (phase 2, inquiry only) as photo cards; each line says what the camper gets. */
export const CAMPS = {
  eyebrow: "Camps",
  title: "Pick your camp.",
  intro: "Phase 2 · inquiry only.",
  tag: "Phase 2 · Inquiry",
  types: [
    { title: "Weekend all-inclusive", body: "Train, eat, and sleep at Villa Del Rey. Nothing to plan.", image: "/images/programs/generated/functional-training.png", imageAlt: "Athlete driving a weighted sled in the open-air gym" },
    { title: "Multi-sport camps", body: "Race-ready prep for HYROX-style, CrossFit-style, triathlon, and OCR.", image: "/images/programs/generated/strength-conditioning.png", imageAlt: "Athlete squatting a loaded barbell in the open-air gym" },
    { title: "30-day transformation", body: "A month of coaching with before-and-after testing.", image: "/images/destination/transform.png", imageAlt: "Athletes training together with kettlebells" },
    { title: "Trail + mindfulness trips", body: "Run the trails, then reset your head.", image: "/images/programs/generated/endurance.png", imageAlt: "Athlete running in the open-air gym with mountains behind" },
  ],
  flowEyebrow: "The camp experience",
  flowTitle: "Test. Train. Retest.",
  flow: [
    { value: "Test", label: "Baseline testing on day one." },
    { value: "Train", label: "Coached blocks built for your goal." },
    { value: "Recover", label: "Heat, ice, and therapy zones." },
    { value: "Retest", label: "Leave with your results." },
  ],
  pricesTitle: "Camp packages",
  enquiryLabel: "Inquiry only",
  requestLabel: "Request this camp",
  pricingEnquiry: { label: "Inquire about camps", href: "/contact?interest=training-camp" },
};

/** Groups + long stays, as one photo + text section (#long-stays). */
export const LONG_STAYS = {
  eyebrow: "Groups & long stays",
  title: "Bring your crew. Stay for months.",
  body: "Coaches bring their communities. Remote workers base themselves here.",
  who: ["Coaches & their crews", "International groups", "Weekenders", "Digital nomads"],
  availability: "planned" as Availability,
  image: "/images/destination/train.png",
  imageAlt: "Coach guiding a stretching session in a studio with residences outside",
  cta: { label: "Inquire about a group camp", href: "/contact?enquiry=camp-group" },
};

export const CAMPS_CTA = { eyebrow: "Camps & trips" };
