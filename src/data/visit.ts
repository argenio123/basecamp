// Static visit copy (spec §C.5, deck pp.53–58, 66). Editable data: `whyCamsur`, `settings.contact`, pricing group `camps`.
// Stage 3 (§1): /visit = getting there + map; /visit/camps = camps + camps pricing + long stays; /visit/why-camsur = why CamSur + Lago Del Rey.
import type { Availability } from "@/content/types";

export type VisitItem = { title: string; body?: string; availability?: Availability };

// ---------- /visit (overview) ----------
export const VISIT_META = {
  title: "Visit",
  description: "Plan your visit to BaseCamp CamSur in Pili, Camarines Sur: address, map and directions, with flights to Naga or Legazpi, car rental and van transfers. Accessible from Manila.",
};

export const VISIT_HERO = {
  eyebrow: "Visit",
  title: "Plan your visit.",
  intro: "BaseCamp CamSur is in Pili, Camarines Sur, accessible from Manila. Here's how to find us.",
  image: "/images/facilities/facility-landscape.jpg",
  imageAlt: "Landscape view of the planned BaseCamp CamSur facility",
};

export const VISIT_GLANCE = {
  summary: "Plan the journey to Camarines Sur, compare airport options and choose the most practical way to reach BaseCamp.",
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
  eyebrow: "Why CamSur",
  title: "The freshwater and forest alternative.",
  intro: "While others do beaches, CamSur offers cooler temperatures, calmer waters and mountain backdrops: a different kind of paradise.",
  image: "/images/facilities/facility-aerial.jpg",
  imageAlt: "Aerial view of the BaseCamp CamSur site",
};

export const WHY_GLANCE = {
  summary: "Why Camarines Sur: freshwater and forest instead of beach, outdoor training all year, and water-based conditioning on Lago Del Rey.",
  eyebrow: "Why CamSur",
};

export const LAGO = {
  eyebrow: "Lago Del Rey",
  title: "Train on the water.",
  note: "Partner experiences",
  items: [
    { title: "Lago Del Rey", body: "Paddle training, open water swimming and water-based conditioning: year-round water sports, without ocean hazards." },
    { title: "CamSur Watersports Complex (CWC)", body: "Wakeboarding and water sports." },
    { title: "Trails", body: "Trails for running and mountain biking." },
    { title: "Triathlon courses", body: "Triathlon courses and transition zones." },
    { title: "Healing hikes", body: "Sunrise and sunset healing hikes." },
  ].map((i) => ({ ...i, availability: "planned" as const })) satisfies VisitItem[],
  closing: "Nature isn't scenery, it's your training partner.",
};

// ---------- /visit/camps ----------
export const CAMPS_META = {
  title: "Camps & Retreats",
  description: "Training camps, retreats and long stays at BaseCamp CamSur: day clinics, weekend and week-long immersive camps with lodging at Villa Del Rey, and long stays for remote workers. Inquiry only.",
};

export const CAMPS_HERO = {
  eyebrow: "Camps & retreats",
  title: "Camps, retreats & long stays.",
  intro: "Training camps and retreats for athletes, coaches and their communities, plus long stays for remote workers and fitness nomads.",
  image: "/images/destination/thrive.png",
  imageAlt: "Athlete training on gymnastic rings",
};

export const CAMPS_GLANCE = {
  summary: "Training camps, retreats and long stays for athletes, coaches and travelers, from single-day clinics to week-long immersive camps.",
};

export const CAMPS = {
  eyebrow: "Camps",
  title: "Camps & retreats.",
  intro: "Athletes plan their year around training camps here. Coaches bring their communities for immersive experiences.",
  assessment: { text: "Every camp is designed to start with baseline testing and end with a checkout reassessment", label: "How assessment works", href: "/programs/coaching#assessment" },
  requestLabel: "Request this camp",
  pricesTitle: "Camp packages",
  typesTitle: "Camp types",
  enquiryLabel: "Inquiry only",
  pricingEnquiry: { label: "Inquire about camps", href: "/contact?interest=training-camp" },
  types: [
    { title: "30-day transformation programs" },
    { title: "Multi-sport camps", body: "CrossFit-style competition training, HYROX-style preparation, triathlon, OCR" },
    { title: "Mindfulness + trail running retreats" },
    { title: "Longevity Lite" },
    { title: "Weekend all-inclusive", body: "Lodging at Villa Del Rey with meals" },
  ].map((i) => ({ ...i, availability: "phase-2" as const })) satisfies VisitItem[],
  whoTitle: "Who comes",
  who: ["Domestic weekenders", "International groups", "Coaches bringing communities", "Digital nomads"],
  cta: { label: "Inquire about a group camp", href: "/contact?enquiry=camp-group" },
};

export const LONG_STAYS = {
  eyebrow: "Long stays",
  title: "Live here for a while.",
  body: "A wellness hub for remote workers and fitness nomads: co-working next to training, healthy dining and recovery, all walkable. Digital nomads base themselves here for months at a time.",
  availability: "planned" as Availability,
  image: "/images/facilities/facility-background-a1-5-b.jpg",
  imageAlt: "Open, planted spaces at BaseCamp CamSur",
  cta: { label: "Register interest", href: "/contact?interest=extended-stay" },
};

export const CAMPS_CTA = { eyebrow: "Camps & retreats" };
