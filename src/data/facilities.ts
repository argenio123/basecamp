// Static facilities copy (spec §C.4, deck pp.20–40). Editable recovery data lives in content `recovery`;
// stats come from `home.stats`. Zone 6 (storage & staff) is never public (spec §0.9).
// Stage 3 (§1): /facilities = design + arrival; /facilities/training = training zones, running loop,
// all-weather; /facilities/recovery = recovery; /facilities/lifestyle = social lounge, fuel, signature
// spaces; /facilities/gallery = gallery.
import type { Availability } from "@/content/types";
import { FACILITY_ANCHORS, FACILITY_ANCHOR_LABEL, type FacilityAnchor } from "@/content/constants";

export type FacilityItem = { title: string; body?: string; availability?: Availability };
export type FacilityHero = { eyebrow: string; title: string; intro: string; image: string; imageAlt: string };

export const FACILITIES_HERO: FacilityHero = {
  eyebrow: "Transform",
  title: "Every promise is infrastructure.",
  intro: "Every brand claim is architectural reality. Train. Transform. Thrive. isn't marketing language: it's the physical environment we're building.",
  image: "/images/facilities/facility-aerial.jpg",
  imageAlt: "Aerial architectural rendering of BaseCamp CamSur",
};

export const DESIGN = {
  eyebrow: "Design",
  title: "Built into the ground. Not just the brand.",
  pillars: [
    { title: "Modern Tropical", body: "Architecture that responds to climate, while maintaining contemporary aesthetic and professional presence" },
    { title: "Glass-Forward Design", body: "Breathable spaces with natural light and sightlines that create energy and openness" },
    { title: "Material Contrast", body: "Steel structure with warm wood accents balancing industrial performance with natural comfort" },
    { title: "Integrated Landscape", body: "Palm trees and native planting woven into the architecture rather than added around it" },
  ] satisfies FacilityItem[],
  chips: ["Tropical brutalist: raw concrete, natural timber, local stone", "Shade-first", "Open-air", "No “mall gym” feel"],
  quote: "Looks premium. Feels athletic. Films beautifully.",
};

/** Zone journey 01–05, in order (hrefs resolve to the zone's stage-3 page via currentHrefFor). */
export const ZONES: { anchor: FacilityAnchor; label: string }[] = [
  FACILITY_ANCHORS.arrival, FACILITY_ANCHORS.training, FACILITY_ANCHORS.running, FACILITY_ANCHORS.recovery, FACILITY_ANCHORS.social,
].map((anchor) => ({ anchor, label: FACILITY_ANCHOR_LABEL[anchor] }));

export const ARRIVAL = {
  title: "Arrival & welcome.",
  intro: "Parking, reception and initial views.",
  items: [
    { title: "Central lobby", body: "Professional reception and information desk creating strong first impressions" },
    { title: "Seamless zones", body: "Intuitive circulation between training, recovery and social spaces" },
  ] satisfies FacilityItem[],
};

export const TRAINING = {
  title: "Training zones.",
  zones: [
    { title: "Dedicated CrossFit-style area", body: "Full-spec functional training zone with rigs, platforms, and equipment for high-intensity programming. Competition-grade setup supporting everything from daily classes to training camps.", image: "/images/programs/generated/functional-training.png", imageAlt: "Athletes training in a functional fitness zone" },
    { title: "Complete fitness gym", body: "Traditional strength training equipment, cardio machines, and accessory work zones for supplemental training and individual programming.", image: "/images/programs/program-strength.png", imageAlt: "Strength training equipment in the gym" },
    { title: "Expansive outdoor space", body: "673 square meters of outdoor training facility enabling sprint work, sled pushes, carries, and large-group programming under tropical conditions.", image: "/images/programs/program-endurance.png", imageAlt: "Outdoor conditioning session under tropical skies" },
  ],
  planned: [
    { title: "HYROX-style Experience Lanes", body: "A permanent course layout with all 8 HYROX-style stations properly spaced and marked, a sled push track of 25m minimum, and feature walls behind the sled and rowing stations.", availability: "planned" },
    { title: "Open-air training decks", body: "Elevated platforms with lake and mountain views.", availability: "planned" },
  ] satisfies FacilityItem[],
  statsQuote: "Training spaces are deliberately open and visible… effort is celebrated, and community is built through shared work.",
  equipmentTitle: "Planned equipment fit-out",
  equipment: [
    { title: "Strength", items: ["Competition-grade rigs and pull-up structures", "4 commercial power racks", "12 Olympic barbells", "Bumper plate sets", "Dumbbells 5–50kg", "Kettlebells 8–48kg", "6 adjustable benches"] },
    { title: "Cardio", items: ["8 Concept2 RowErgs", "6 Assault AirBikes or BikeErgs", "4 SkiErgs", "4 treadmills"] },
    { title: "Functional", items: ["4 competition sleds", "4 sets of 15m battle ropes", "12 plyo boxes (20/24/30\")", "20 wall balls (6–14kg)", "Medicine balls (3–15kg)"] },
    { title: "HYROX-style", items: ["8 sandbags (10/20/30kg)", "4 pairs of farmers-carry handles", "A custom 25m sled push track"] },
  ],
};

export const RUNNING = {
  title: "Running loop.",
  intro: "Continuous path integrated with nature, varying terrain.",
  items: [
    { title: "Signature outdoor trails", body: "Marked, measured running and hiking circuits, multiple distances and difficulty levels, maps and signage, guided trail running clinics", availability: "planned" },
    { title: "Lakeside training loops", body: "Around Lago Del Rey with distance markers and elevation profiles", availability: "planned" },
    { title: "Open water swim courses", body: "Open water swim courses with safety boats", availability: "planned" },
    { title: "Wellness trails", body: "Sunrise and sunset healing hikes", availability: "planned" },
  ] satisfies FacilityItem[],
};

export const RECOVERY = {
  eyebrow: "Recovery",
  title: "Recovery-forward, not workout-forward.",
  sub: "Adaptation happens during recovery, not during training. Recovery is integrated as core programming, not an optional extra.",
  core: {
    title: "Core infrastructure",
    items: [
      { title: "Cold plunge pools", body: "Dedicated cold immersion for faster recovery between sessions" },
      { title: "Hot plunge pools", body: "Heat therapy supporting circulation, relaxation, and contrast therapy protocols" },
      { title: "Dedicated saunas", body: "Heat exposure and cardiovascular conditioning; men's and women's facilities planned" },
      { title: "Mobility & breathwork", body: "Dedicated spaces for movement practice, stretching, and recovery protocols" },
    ] satisfies FacilityItem[],
  },
  volume: {
    title: "Built for volume",
    items: [
      { title: "Entire second floor", body: "Dedicated wellness level with proper space allocation and circulation flow" },
      { title: "Multiple treatment rooms", body: "Massage, bodywork, and recovery treatments" },
      { title: "Hyperbaric chamber", availability: "planned" },
      { title: "Gradual cooling rooms", body: "Contrast therapy protocols and temperature transitions" },
    ] satisfies FacilityItem[],
  },
  quote: "This isn't a hotel spa: it's built for high-volume training camps where dozens of athletes need simultaneous access.",
  gridTitle: "Recovery modalities",
  rituals: { title: "Recovery rituals", body: "Contrast therapy path: cold plunge → hot tub → rest. Guided breathwork sessions and structured recovery protocols. Make recovery systematic, not ad hoc." },
  launchEquipment: {
    title: "Launch recovery equipment",
    items: ["Commercial ice bath (4–6 people)", "Outdoor-rated infrared sauna (6–8 people)", "Massage guns, foam rollers, resistance bands, stretching mats and yoga props"],
  },
  pricingLink: { label: "See recovery pricing", href: "/membership/recovery-pricing" },
};

export const SOCIAL = {
  title: "Social & lounge.",
  items: [
    { title: "Café & social hub", body: "Proper food and beverage supporting performance nutrition, with spaces designed for connection and community." },
    { title: "Yoga & movement studio", body: "Dedicated space for yoga, mobility work, and mind-body practices that complement high-intensity training.", availability: "phase-2" },
    { title: "Events & workshops", body: "Skill clinics, nutrition seminars, and community gatherings that build belonging" },
    { title: "Outdoor integration", body: "Landscaped areas connecting indoor and outdoor environments" },
    { title: "Extended stays", body: "Environment designed for long dwell times and repeat visits" },
  ] satisfies FacilityItem[],
};

export const FUEL = {
  eyebrow: "Fuel",
  title: "Performance food culture, not detox food culture.",
  line: "Filipino food isn't just delicious: it's performance fuel.",
  label: "Planned café menu concepts",
  columns: [
    { title: "Performance Filipino cuisine", items: ["Adobo with lean protein and anti-inflammatory spices", "Sinigang with nutrient-dense vegetables"] },
    { title: "Native crops for athletes", items: ["Ube as a pre-workout carb", "Malunggay as a superfood green", "Calamansi as a natural electrolyte"] },
    { title: "Bicolano dishes", items: ["Laing with minimal oil", "Coconut-based dishes", "Chilli peppers"] },
  ],
  chips: ["Natural electrolytes", "Fermented foods (burong mustasa)", "Protein desserts (ube protein smoothies, halo-halo reimagined)", "Hydration & salt bars"],
};

export const SIGNATURE = {
  eyebrow: "Signature spaces",
  title: "Make it impossible to post a boring photo.",
  items: [
    { title: "HYROX-style feature walls" },
    { title: "Finish gates", body: "LED time and name displays" },
    { title: "Ice bath pits", body: "Sculptural concrete, lake backdrop" },
    { title: "Scenic open gym decks", body: "360° views" },
    { title: "Rope climbs over water" },
    { title: "Floating training platforms" },
    { title: "Hill sprint frame" },
    { title: "Sauna glass walls", body: "Sunset sauna" },
  ].map((i) => ({ ...i, availability: "planned" as const })) satisfies FacilityItem[],
  av: {
    title: "Audio-visual",
    body: "Large-format displays, programmable LEDs and stadium-quality audio.",
    quote: "Design the sound, light and atmosphere to feel like a stadium, not a gym.",
  },
};

export const ALL_WEATHER = {
  eyebrow: "All-weather",
  title: "All-weather by design.",
  items: [
    { title: "Outdoor and semi-covered zones", body: "For all weather conditions" },
    { title: "Shade-first design", body: "Deep overhangs and planting" },
    { title: "Night training capability", body: "Task lighting for training zones and ambient lighting for paths and social areas" },
    { title: "Drinking stations", body: "Throughout" },
    { title: "First aid", body: "Multiple first aid stations" },
  ] satisfies FacilityItem[],
};

export const GALLERY = {
  eyebrow: "Gallery",
  title: "Built to be filmed",
  body: "Every angle works for photography and video, making BaseCamp inherently shareable.",
  images: [
    { src: "/images/facilities/facility-exterior.jpg", alt: "Exterior rendering of BaseCamp CamSur", wide: true },
    { src: "/images/facilities/facility-front.jpg", alt: "Front approach to the BaseCamp CamSur facility" },
    { src: "/images/facilities/facility-detail.jpg", alt: "Architectural detail of the BaseCamp CamSur facility" },
    { src: "/images/facilities/facility-render-a1-2.jpg", alt: "Architectural rendering of the BaseCamp CamSur training building" },
    { src: "/images/facilities/facility-render-a1-3.jpg", alt: "Architectural rendering of BaseCamp CamSur in its landscape" },
  ],
  quote: "Designed as a destination, not a stopover.",
};

/* ---------- Stage-3 sub-page heroes (copy shortened from the sections each page holds) ---------- */
export const TRAINING_HERO: FacilityHero = {
  eyebrow: "Facilities · Train",
  title: "Training zones.",
  intro: "Functional, strength and outdoor zones, a running loop through nature, and spaces designed for every kind of weather.",
  image: "/images/facilities/facility-front.jpg",
  imageAlt: "Outdoor training area at BaseCamp CamSur",
};

export const RECOVERY_HERO: FacilityHero = {
  eyebrow: "Facilities · Recover",
  title: RECOVERY.title,
  intro: RECOVERY.sub,
  image: "/images/programs/program-recovery.png",
  imageAlt: "Recovery session at BaseCamp CamSur",
};

export const LIFESTYLE_HERO: FacilityHero = {
  eyebrow: "Facilities · Thrive",
  title: "Spaces to stay longer.",
  intro: "The social lounge, a performance food culture and signature spaces that make it impossible to post a boring photo.",
  image: "/images/facilities/facility-render-a1-2.jpg",
  imageAlt: "Render of the BaseCamp CamSur lounge spaces",
};

export const GALLERY_HERO: FacilityHero = {
  eyebrow: "Facilities · Gallery",
  title: `${GALLERY.title}.`,
  intro: GALLERY.body,
  image: "/images/facilities/facility-exterior.jpg",
  imageAlt: "Exterior rendering of BaseCamp CamSur",
};

/** How many signature spaces show before "See all" (stage-3 §6: long lists show the first 3–6). */
export const SIGNATURE_PREVIEW = 6;

export const FACILITIES_CTA = { eyebrow: "Come and see", title: "Experience the space.", body: "Join early access to receive preview and tour announcements when they become available.", label: "Register for previews" };
