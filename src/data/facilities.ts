// Static facilities copy (spec §C.4, deck pp.20–40). Editable recovery data lives in content `recovery`;
// stats come from `home.stats`. Zone 6 (storage & staff) is never public (spec §0.9).
// Stage 3 (§1): /facilities = design + arrival; /facilities/training = training zones, running loop,
// all-weather; /facilities/recovery = recovery; /facilities/lifestyle = social lounge, fuel, signature
// spaces; /facilities/gallery = gallery.
import type { Availability } from "@/content/types";
import { FACILITY_ANCHORS, FACILITY_ANCHOR_LABEL, type FacilityAnchor } from "@/content/constants";

export type FacilityDetails = {
  audience: string;
  access: string;
  booking: string;
  programs: string[];
  technical?: string;
};
export type FacilityItem = { title: string; body?: string; availability?: Availability; details?: FacilityDetails };
export type FacilityZone = FacilityItem & { image: string; imageAlt: string };
export type FacilityHero = { eyebrow: string; title: string; intro: string; image: string; imageAlt: string };

export const FACILITIES_HERO: FacilityHero = {
  eyebrow: "",
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
    {
      title: "Central lobby",
      body: "Check in, orient your visit and get support before training or recovery.",
      availability: "at-launch",
      details: { audience: "Members, day guests and camp groups", access: "Included with every visit", booking: "No booking required", programs: ["All BaseCamp experiences"], technical: "Professional reception and information desk at the main arrival point." },
    },
    {
      title: "Seamless zones",
      body: "Move easily between training, recovery and social spaces throughout the day.",
      availability: "at-launch",
      details: { audience: "All visitors", access: "Included with every visit", booking: "No booking required", programs: ["Training", "Recovery", "Camps"], technical: "Intuitive circulation connects the primary public zones." },
    },
  ] satisfies FacilityItem[],
};

export const TRAINING = {
  title: "Training zones.",
  zones: [
    {
      title: "Dedicated CrossFit-style area",
      body: "Build strength, skill and conditioning in a coach-led performance environment.",
      availability: "at-launch",
      details: { audience: "Group-training athletes and camps", access: "Eligible class or gym membership", booking: "Book coached sessions", programs: ["Functional Training", "Strength & Conditioning"], technical: "Full-spec rigs, platforms and competition-grade equipment for high-intensity programming." },
      image: "/images/programs/generated/functional-training.png",
      imageAlt: "Athletes training in a functional fitness zone",
    },
    {
      title: "Complete fitness gym",
      body: "Follow an independent strength plan or add focused accessory work around coached sessions.",
      availability: "at-launch",
      details: { audience: "Independent athletes and coaching clients", access: "Eligible gym membership or pass", booking: "Open access during member hours", programs: ["Strength & Conditioning", "Personal Coaching"], technical: "Strength equipment, cardio machines and dedicated accessory-work zones." },
      image: "/images/programs/program-strength.png",
      imageAlt: "Strength training equipment in the gym",
    },
    {
      title: "Expansive outdoor space",
      body: "Train speed, carries and conditioning at full scale in the CamSur environment.",
      availability: "at-launch",
      details: { audience: "Endurance athletes, teams and large groups", access: "Eligible membership, pass or camp", booking: "Classes and group blocks require booking", programs: ["Endurance", "Functional Training"], technical: "673 m² for sprint work, sled pushes, carries and large-group programming." },
      image: "/images/programs/program-endurance.png",
      imageAlt: "Outdoor conditioning session under tropical skies",
    },
  ] satisfies FacilityZone[],
  planned: [
    {
      title: "HYROX-style Experience Lanes",
      body: "Practice complete race stations and transitions in a permanent performance setup.",
      availability: "planned",
      details: { audience: "Hybrid racers and competition camps", access: "Access details to be confirmed", booking: "Program sessions will require booking", programs: ["Endurance", "Strength & Conditioning"], technical: "All eight stations, a minimum 25 m sled track and feature walls at the sled and rowing stations." },
    },
    {
      title: "Open-air training decks",
      body: "Train outdoors with elevated lake and mountain views.",
      availability: "planned",
      details: { audience: "Small groups and independent athletes", access: "Access details to be confirmed", booking: "Booking policy to be confirmed", programs: ["Functional Training", "Recovery & Mobility"], technical: "Elevated open-air platforms integrated with the landscape." },
    },
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
    { title: "Signature outdoor trails", body: "Run or hike measured routes at a distance and difficulty that suit your session.", availability: "planned", details: { audience: "Runners, hikers and camp groups", access: "Access details to be confirmed", booking: "Guided clinics require booking", programs: ["Endurance", "Camps"], technical: "Marked circuits with multiple distances, maps, signage and varied terrain." } },
    { title: "Lakeside training loops", body: "Build pace and aerobic capacity around Lago Del Rey.", availability: "planned", details: { audience: "Endurance athletes and run clubs", access: "Access details to be confirmed", booking: "Club sessions require booking", programs: ["Endurance", "Run Club"], technical: "Measured loops with distance markers and elevation profiles." } },
    { title: "Open water swim courses", body: "Train distance and confidence in a managed open-water setting.", availability: "planned", details: { audience: "Competent swimmers and endurance athletes", access: "Special-session access", booking: "Supervised sessions require booking", programs: ["Endurance", "Training Camps"], technical: "Designated swim courses supported by safety boats." } },
    { title: "Wellness trails", body: "Use gentle sunrise and sunset movement to recover between harder sessions.", availability: "planned", details: { audience: "All levels and recovery guests", access: "Access details to be confirmed", booking: "Guided hikes require booking", programs: ["Recovery & Mobility", "Camps"], technical: "Low-intensity nature routes planned for sunrise and sunset use." } },
  ] satisfies FacilityItem[],
};

export const RECOVERY = {
  eyebrow: "Recovery",
  title: "Recovery-forward, not workout-forward.",
  sub: "Adaptation happens during recovery, not during training. Recovery is integrated as core programming, not an optional extra.",
  core: {
    title: "Core infrastructure",
    items: [
      { title: "Cold plunge pools", body: "Use cold immersion to reset between sessions and support post-training recovery.", availability: "planned", details: { audience: "Athletes and camp groups", access: "Recovery pass or eligible plan", booking: "Reserve a recovery slot", programs: ["Recovery & Mobility"], technical: "Dedicated cold-immersion infrastructure for structured recovery protocols." } },
      { title: "Hot plunge pools", body: "Use heat for relaxation, circulation and contrast-therapy routines.", availability: "planned", details: { audience: "Recovery guests and training camps", access: "Recovery pass or eligible plan", booking: "Reserve a recovery slot", programs: ["Recovery & Mobility"], technical: "Hot-water infrastructure designed to pair with cold immersion." } },
      { title: "Dedicated saunas", body: "Add controlled heat exposure to a deliberate recovery routine.", availability: "at-launch", details: { audience: "Members and recovery guests", access: "Recovery pass or eligible plan", booking: "Reserve a recovery slot", programs: ["Recovery & Mobility"], technical: "Dedicated heat facilities, with separate men's and women's areas planned." } },
      { title: "Mobility & breathwork", body: "Restore range of motion, downshift and prepare for the next session.", availability: "at-launch", details: { audience: "All levels", access: "Eligible class or recovery access", booking: "Guided sessions require booking", programs: ["Recovery & Mobility"], technical: "Dedicated floor space and equipment for mobility, stretching and breathwork." } },
    ] satisfies FacilityItem[],
  },
  volume: {
    title: "Built for volume",
    items: [
      { title: "Entire second floor", body: "Recover without competing with the noise and movement of the training floor.", availability: "at-launch", details: { audience: "Members, visitors and camp groups", access: "Recovery pass or eligible plan", booking: "Individual modalities may require booking", programs: ["Recovery & Mobility", "Training Camps"], technical: "A dedicated wellness level with circulation planned for simultaneous use." } },
      { title: "Multiple treatment rooms", body: "Book focused massage, bodywork and recovery treatments.", availability: "planned", details: { audience: "Athletes needing individual treatment", access: "Treatment add-on", booking: "Booking required", programs: ["Personal Coaching", "Recovery & Mobility"], technical: "Separate rooms for private hands-on treatment services." } },
      { title: "Hyperbaric chamber", body: "Access a specialist recovery modality following appropriate screening.", availability: "planned", details: { audience: "Screened recovery clients", access: "Specialist session add-on", booking: "Screening and booking required", programs: ["Recovery & Mobility"], technical: "Hyperbaric oxygen equipment remains part of the future facility plan." } },
      { title: "Gradual cooling rooms", body: "Transition safely between heat, cold and rest during contrast protocols.", availability: "planned", details: { audience: "Contrast-therapy users", access: "Recovery pass or eligible plan", booking: "Reserve a recovery slot", programs: ["Recovery & Mobility"], technical: "Temperature-transition spaces supporting guided contrast routines." } },
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
    { title: "Café & social hub", body: "Refuel, meet training partners and stay connected beyond the workout.", availability: "planned", details: { audience: "Members, visitors and companions", access: "Public areas; purchases separate", booking: "No booking for general use", programs: ["Events", "Training Camps"], technical: "Food, beverage and social seating planned around performance nutrition." } },
    { title: "Yoga & movement studio", body: "Practise mobility and mind-body work away from the main training floor.", availability: "phase-2", details: { audience: "All levels", access: "Eligible class or recovery plan", booking: "Classes require booking", programs: ["Recovery & Mobility"], technical: "Dedicated studio space for yoga, mobility and complementary movement." } },
    { title: "Events & workshops", body: "Learn new skills and connect through clinics, seminars and gatherings.", availability: "planned", details: { audience: "Members, teams and the local community", access: "Varies by event", booking: "Event registration required", programs: ["Events", "Workshops"], technical: "Flexible gathering areas support education and community programming." } },
    { title: "Outdoor integration", body: "Move, rest and socialise across shaded landscaped areas.", availability: "at-launch", details: { audience: "All visitors", access: "Included with site access", booking: "No booking required", programs: ["All BaseCamp experiences"], technical: "Landscape links indoor, semi-covered and outdoor public spaces." } },
    { title: "Extended stays", body: "Settle into a complete training day instead of leaving immediately after a session.", availability: "at-launch", details: { audience: "Camp guests and long-stay visitors", access: "Included with eligible visit access", booking: "Camp stays require advance booking", programs: ["Training Camps", "Visitor Experiences"], technical: "Long-dwell spaces support repeat sessions, recovery and community time." } },
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
