// Static visit copy (spec §C.5, deck pp.53–58, 66). Editable data: `whyCamsur`, `settings.contact`, pricing group `camps`.
// Stage 3 (§1): /visit = getting there + map; /visit/camps = camps + pricing; /visit/why-camsur = destination reasons + lake training.
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
  image: "/images/programs/generated/endurance.webp",
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
  description: "Train year-round in Camarines Sur, with freshwater lakes, forest trails, and mountain terrain.",
};

export const WHY_HERO = {
  title: "Train where nature pushes back.",
  intro: "Lakes, forest, and mountains, not beaches.",
  image: "/images/visit/generated/why-camsur-basecamp-community.webp",
  imageAlt: "Athletes and visitors gathering inside the BaseCamp CamSur cafeteria and lounge",
};

export const WHY_GLANCE = {
  summary: "Freshwater, not beach.\nTraining all year.\nConditioning on the lake.",
  eyebrow: "Why CamSur",
};

export const WHY_STATS_INTRO = "CamSur combines reliable outdoor conditions, freshwater training, mountain terrain, and practical access through nearby regional airports.";

/** Four reasons as big words with a concise explanation of the training benefit. */
export const WHY_STATS = [
  { value: "365", label: "Train outdoors throughout the year, with warm weather and long usable training days." },
  { value: "Lakes", label: "Freshwater supports open-water swimming, paddling, wakeboarding, and low-impact conditioning." },
  { value: "Cooler", label: "Calmer mornings and mountain air make longer endurance sessions more comfortable." },
  { value: "Nearby", label: "Fly through Naga or Legazpi, then continue by road to BaseCamp in Pili." },
];

/** Three concise reasons to choose CamSur. */
export const WHY_CONTRAST = {
  eyebrow: "Why it works",
  title: "Built for training.",
  intro: "The landscape adds useful training variety without pulling athletes far away from BaseCamp.",
  items: [
    { title: "Freshwater", body: "Calm inland water creates a controlled setting for open-water swims, paddle sessions, and recovery days." },
    { title: "Mountains", body: "Nearby trails and sustained climbs add elevation, technical terrain, and aerobic variety to every camp." },
    { title: "Year-round", body: "CamSur's tropical climate keeps outdoor sessions practical across the seasons, from sunrise conditioning to evening runs." },
  ],
};

// ---------- /visit/camps ----------
export const CAMPS_META = {
  title: "Camps & Trips",
  description: "Weekend camps, week-long training trips, and CamSur field trips at BaseCamp CamSur.",
};

export const CAMPS_HERO = {
  title: "Train hard. Stay longer.",
  intro: "Train, recover, and stay together.",
  image: "/images/visit/generated/camps-and-trips-arrival.webp",
  imageAlt: "Training camp guests arriving with travel bags and meeting their coach",
};

export const CAMPS_GLANCE = {
  summary: "Weekend camps.\nWeek-long trips.\nCamSur field trips.",
};

/** Why camp at BaseCamp (phase 2, inquiry only): the class-page step layout, one photo per benefit. */
export const CAMPS = {
  eyebrow: "Why camp at BaseCamp · 4 benefits",
  title: "More than a training trip.",
  caption: "BaseCamp camps & trips · Phase 2 inquiry",
  benefits: [
    { title: "Coached from day one", body: "Every training block is planned and led by a BaseCamp coach.", image: "/images/visit/generated/basecamp-camp-group.webp" },
    { title: "Recovery on site", body: "Sauna, ice bath, massage, and physio between sessions.", image: "/images/facilities/2F Plunge.webp" },
    { title: "CamSur on your doorstep", body: "Trails, mountains, and fresh water close to camp.", image: "/images/visit/generated/why-camsur-lake-training.webp" },
    { title: "Train as one crew", body: "Train, eat, and stay together with your group.", image: "/images/membership/generated/founding-members-community.webp" },
  ],
  flowEyebrow: "The camp experience",
  flowTitle: "Train. Explore. Recover.",
  flowNote: "Every camp follows the same rhythm, from the day you arrive to your last recovery session.",
  flow: [
    { value: "Arrive", label: "Meet your coach and settle in." },
    { value: "Train", label: "Coached sessions at BaseCamp." },
    { value: "Explore", label: "Run trails and swim fresh water." },
    { value: "Recover", label: "Unwind with heat, ice, and therapy." },
  ],
};

export const CAMPS_CTA = { eyebrow: "Camps & trips" };
