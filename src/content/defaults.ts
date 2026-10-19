// Default site content (spec §B.5–§B.13b). Copy is taken verbatim from the spec/deck.
// Admin edits are stored per section and merged over these defaults (see merge.ts).
import type {
  Availability, PriceGroup, PriceItem, Programme, ProgrammeSpace, SiteContent, TimetableSlot, Weekday,
} from "./types";
import { FEATURED_PROGRAMMES } from "@/data/featured-programmes";

const P = "/images/programs";
const G = "/images/programs/generated";
const F = "/images/facilities";

// ---------- helpers ----------
type ItemInput = Partial<Omit<PriceItem, "id" | "name" | "price">> & { availability?: Availability };
function item(id: string, name: string, min: number | null, max: number | null, rest: ItemInput, fallback: Availability): PriceItem {
  return {
    id, name, price: min == null ? null : { min, max },
    unit: "", usd: "", perUnit: "", validity: "", description: "", features: [], featured: false, badge: "", visible: true,
    ...rest,
    availability: rest.availability ?? fallback,
  };
}
function group(id: string, anchor: string, title: string, audience: PriceGroup["audience"], availability: Availability, items: [string, string, number | null, number | null, ItemInput][], intro = ""): PriceGroup {
  return { id, anchor, title, intro, audience, items: items.map(([i, n, min, max, rest]) => item(i, n, min, max, rest, availability)) };
}

const space = {
  arrival: { label: "Arrival & welcome", anchor: "arrival" },
  training: { label: "Training zones", anchor: "training-zones" },
  running: { label: "Running loop", anchor: "running-loop" },
  recovery: { label: "Recovery", anchor: "recovery" },
  social: { label: "Social & lounge", anchor: "social-lounge" },
} satisfies Record<string, ProgrammeSpace>;

const DAYS: Weekday[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const timetable: TimetableSlot[] = DAYS.flatMap((day): TimetableSlot[] => {
  const d = day.toLowerCase();
  const isFri = day === "Fri";
  return [
    { id: `${d}-am`, day, time: "Early morning (time TBA)", title: "Sunrise session: coached group class", category: "sunrise", programmeSlug: "crossfit-group", capacity: null, status: "tba" },
    { id: `${d}-pm`, day, time: "Evening (time TBA)", title: isFri ? "Friday Night Lights (CrossFit-style)" : "Evening session: coached group class", category: isFri ? "night" : "evening", programmeSlug: "crossfit-group", capacity: null, status: "tba" },
  ];
});

const dayRhythm = [
  { id: "morning", title: "Morning classes", body: "Sunrise sessions before the heat." },
  { id: "open-gym", title: "Open gym periods", body: "Structured independence for serious athletes." },
  { id: "private", title: "Private sessions", body: "1:1 coaching and recovery appointments." },
  { id: "evening", title: "Evening programming", body: "Classes and night training under lights." },
];

const programmes: Programme[] = [
  {
    slug: "crossfit-group", title: "CrossFit-style group training", group: "core", availability: "at-launch", image: `${G}/functional-training.png`,
    audiences: ["local", "beginner", "traveller", "competitor"], level: "All levels: every session is scaled", format: "Coached group class", interest: "membership-local", bookable: true,
    summary: "Coached group sessions in outdoor and semi-covered zones for all weather conditions.",
    whatToExpect: "Constantly varied functional movements at high intensity. Coaches scale every movement and load so you can choose the right session for your level.",
    whoFor: ["Local athletes training 4–6 sessions a week", "New members after the Foundations on-ramp", "Visitors who want a coached session"],
    outcomes: ["Strength gain", "VO2 improvement", "Body composition"],
    spaces: [space.training, space.running],
  },
  {
    slug: "hyrox", title: "HYROX-style training zone", group: "core", availability: "at-launch", image: `${G}/endurance.png`,
    audiences: ["competitor", "local", "traveller"], level: "Intermediate+ (scalable)", format: "Coached group & open training", interest: "hyrox", bookable: true,
    summary: "Dedicated space with sleds, running loops, and competition-standard stations.",
    whatToExpect: "Structured preparation cycles for hybrid fitness competitions: functional strength stations combined with running and endurance work.",
    whoFor: ["Athletes preparing for HYROX-style races", "Hybrid athletes building an engine"],
    outcomes: ["HYROX time reduction", "VO2 improvement"],
    spaces: [space.training, space.running],
  },
  {
    slug: "open-gym", title: "Open gym / athlete hours", group: "core", availability: "at-launch", image: `${G}/strength-conditioning.png`,
    audiences: ["local", "competitor", "traveller"], level: "Experienced athletes", format: "Self-directed", interest: "drop-in", bookable: true,
    summary: "For serious individuals who prefer structured independence.",
    whatToExpect: "Open access to rigs, platforms, cardio and strength equipment during staffed hours to run your own program.",
    whoFor: ["Athletes following their own program", "Travelers keeping their training on track"],
    outcomes: ["Strength gain"],
    spaces: [space.training],
  },
  {
    slug: "commercial-gym", title: "Commercial gym", group: "core", availability: "at-launch", image: `${P}/program-strength.png`,
    audiences: ["local", "traveller"], level: "All levels", format: "Self-directed", interest: "drop-in", bookable: true,
    summary: "Traditional strength equipment, cardio machines and accessory zones for aesthetics, physique and individual programming.",
    whatToExpect: "Bodybuilding and traditional gym training alongside functional fitness.",
    whoFor: ["Bodybuilding and physique athletes", "Traditional gym-goers"],
    outcomes: ["Strength gain", "Body composition"],
    spaces: [space.training],
  },
  {
    slug: "outdoor-running", title: "Outdoor training & running loop", group: "core", availability: "at-launch", image: `${P}/program-endurance.png`,
    audiences: ["local", "traveller", "competitor"], level: "All levels", format: "Coached & self-directed", interest: "membership-local", bookable: true,
    summary: "673 square meters of outdoor training space plus a continuous running loop integrated with nature.",
    whatToExpect: "Sprint work, sled pushes, carries and large-group programming under tropical conditions, on varying terrain.",
    whoFor: ["Runners and endurance athletes", "Anyone who would rather train outdoors than in a mall gym"],
    outcomes: ["VO2 improvement", "Stress + HRV"],
    spaces: [space.training, space.running],
  },
  {
    slug: "foundations", title: "Foundations on-ramp", group: "core", availability: "at-launch", image: `${G}/personal-coaching.png`,
    audiences: ["beginner"], level: "Beginner", format: "Small-group foundation course", interest: "membership-local", bookable: true,
    summary: "A foundation course for new members. Everyone is welcome.",
    whatToExpect: "We teach the core movements, track your completion, assess readiness and move you into regular classes when you're ready. Trial class details are announced at launch.",
    whoFor: ["Fitness newcomers", "Anyone returning to training"],
    outcomes: ["Mobility + strength baseline"],
    spaces: [space.training, space.arrival],
  },
  {
    slug: "ice-sauna", title: "Ice bath + sauna", group: "wellness", availability: "at-launch", image: `${P}/program-recovery.png`,
    audiences: ["recovery", "local", "traveller"], level: "All levels", format: "Self-guided recovery", interest: "recovery", bookable: true,
    summary: "Ice bath and sauna infrastructure, separated from training intensity.",
    whatToExpect: "Contrast protocols moving from cold plunge to heat to rest. Make recovery systematic, not ad hoc.",
    whoFor: ["Anyone training hard", "Camp and day-pass visitors"],
    outcomes: ["Stress + HRV", "Sleep quality"],
    spaces: [space.recovery],
  },
  {
    slug: "mobility-deck", title: "Stretch & mobility deck", group: "wellness", availability: "at-launch", image: `${G}/recovery-mobility.png`,
    audiences: ["recovery", "beginner", "local"], level: "All levels", format: "Open & guided", interest: "recovery", bookable: true,
    summary: "A dedicated deck for stretching, mobility work and recovery protocols.",
    whatToExpect: "Foam rollers, massage guns, resistance bands, mats and yoga props.",
    whoFor: ["Every athlete, every day"],
    outcomes: ["Mobility + strength baseline"],
    spaces: [space.recovery],
  },
  {
    slug: "massage-physio", title: "Massage & physio", group: "wellness", availability: "at-launch", image: `${P}/program-coaching.png`,
    audiences: ["recovery", "competitor"], level: "By appointment", format: "1:1 (partner-based)", interest: "recovery", bookable: true,
    summary: "Licensed physiotherapists and massage therapists, partner-based initially.",
    whatToExpect: "60-minute sessions booked by request.",
    whoFor: ["Athletes managing training load", "Camp participants"],
    outcomes: [],
    spaces: [space.recovery],
  },
  {
    slug: "therapy-zones", title: "Therapy zones", group: "wellness", availability: "at-launch", image: `${F}/facility-detail.jpg`,
    audiences: ["recovery"], level: "All levels", format: "Self-guided", interest: "recovery", bookable: false,
    summary: "Diverse therapy zones for recovery between sessions.",
    whatToExpect: "Recovery treated as core programming, not an optional extra.",
    whoFor: ["Anyone training hard"],
    outcomes: ["Stress + HRV"],
    spaces: [space.recovery],
  },
  {
    slug: "wellness-consults", title: "Nutrition & mental performance consults", group: "wellness", availability: "planned", image: `${G}/personal-coaching.png`,
    audiences: ["competitor", "recovery"], level: "All levels", format: "1:1 by request (partner-based)", interest: "recovery", bookable: false,
    summary: "Nutrition consultants and mental performance coaches, by request.",
    whatToExpect: "Bookable-by-request appointments with partner specialists.",
    whoFor: ["Athletes preparing for competition", "Camp participants"],
    outcomes: [],
    spaces: [space.social],
  },
  {
    slug: "yoga-breathwork", title: "Yoga & breathwork sessions", group: "phase-2", availability: "phase-2", image: `${G}/recovery-mobility.png`,
    audiences: ["recovery", "beginner"], level: "All levels", format: "Group class", interest: "yoga", bookable: false,
    summary: "Yoga, mobility and mind-body practices that complement high-intensity training.",
    whatToExpect: "Scheduled yoga and breathwork classes.",
    whoFor: ["Athletes who want to move better", "Anyone new to training"],
    outcomes: ["Stress + HRV", "Sleep quality"],
    spaces: [space.social],
  },
  {
    slug: "weekend-camps", title: "Weekend intensive training camps", group: "phase-2", availability: "phase-2", image: `${F}/facility-aerial.jpg`,
    audiences: ["traveller", "competitor", "corporate"], level: "Intermediate+", format: "Multi-day camp", interest: "training-camp", bookable: false,
    summary: "Immersive multi-day experiences with accommodation and full programming.",
    whatToExpect: "Escape the city, train intensely, recover properly.",
    whoFor: ["Manila weekenders", "Coaches bringing their communities"],
    outcomes: ["Strength gain", "HYROX time reduction"],
    spaces: [space.training, space.recovery],
  },
];

const pricingGroups: PriceGroup[] = [
  group("memberships", "tiers", "Monthly memberships", "locals", "at-launch", [
    ["local-basic", "Local Basic", 2500, null, { unit: "/month", usd: "≈ US$43", description: "Self-directed training for independent athletes.", features: ["Unlimited open gym access during staffed hours", "Self-directed training", "Our entry-level membership"] }],
    ["athlete", "Athlete", 4500, null, { unit: "/month", usd: "≈ US$78", featured: true, badge: "Core tier · Most popular", description: "Our primary membership for serious local athletes.", features: ["All coached group classes included", "Unlimited open gym access", "Community-focused program"] }],
    ["premium", "Premium (All Access)", 7500, null, { unit: "/month", usd: "≈ US$129", description: "All access: every class, open gym and monthly recovery credits.", features: ["All classes plus open gym", "4 monthly recovery credits (sauna, ice bath, therapy zones)", "2 guest passes per month", "Priority booking and exclusive events"] }],
  ]),
  group("class-packs", "packs", "Class packs", "locals", "at-launch", [
    ["intro-5", "5-Class Intro Pack", 1900, null, { perUnit: "₱380 per class", validity: "60-day validity", description: "Your first step in: try classes before you commit." }],
    ["pack-10", "10-Class Pack", 3500, null, { perUnit: "₱350 per class", validity: "90-day validity", description: "For semi-regular locals and short-term visitors." }],
  ]),
  group("day-passes", "day-passes", "Drop-ins & day passes", "travellers", "at-launch", [
    ["drop-in-standard", "Standard Drop-In", 450, 600, { unit: "per session", usd: "≈ US$8–$10", description: "Single-session pricing for travelers and trial users. Higher during weekends and peak tourist periods." }],
    ["day-pass-standard", "Standard Day Pass", 650, null, { unit: "per day", usd: "≈ US$11", description: "Gym access plus 1 coached class.", featured: true, badge: "Best for day travelers" }],
    ["day-pass-weekend", "Weekend Premium Day Pass", 800, null, { unit: "per day", description: "Gym access plus 1 coached class on peak days: Saturdays, Sundays and long weekends." }],
  ]),
  group("open-gym", "open-gym", "Open gym passes", "both", "at-launch", [
    ["gym-day", "Day Pass", 300, null, { unit: "per day", usd: "≈ US$5", description: "Basic open gym access only, no classes included." }],
    ["gym-week", "Weekly Pass", 1200, null, { unit: "per week", usd: "≈ US$21", description: "Unlimited open gym access for 7 consecutive days." }],
    ["gym-month", "Monthly Pass", 3500, null, { unit: "per month", usd: "≈ US$60", description: "Unlimited open gym access during all operating hours, no classes included." }],
  ]),
  group("yoga", "yoga", "Yoga", "both", "phase-2", [
    ["yoga-single", "Single Yoga Drop-In", 800, null, { unit: "per class", usd: "≈ US$14", description: "Access to any scheduled yoga class." }],
    ["yoga-5", "5-Class Yoga Pack", 3500, null, { perUnit: "₱700 per class", validity: "90-day validity" }],
    ["yoga-10", "10-Class Yoga Pack", 6000, null, { perUnit: "₱600 per class", validity: "120-day validity", badge: "Best value" }],
    ["yoga-addon", "Unlimited Yoga Add-On", 1000, null, { unit: "/month", description: "Add unlimited yoga to an Athlete or Premium membership." }],
  ], "Local Basic members can buy yoga at pack or drop-in rates."),
  group("recovery", "recovery-pricing", "Recovery services & add-ons", "both", "at-launch", [
    ["sauna-ice", "Sauna / Ice Bath Session", 450, null, { unit: "per session", usd: "≈ US$8" }],
    ["massage-physio", "Sports Massage & Physio", 1200, 2500, { unit: "per 60-minute session", usd: "≈ US$21–$43", description: "Varies by practitioner seniority. Partner-based, by appointment." }],
    ["recovery-bundle", "Recovery Bundle (Sauna / Ice Bath)", 2000, null, { unit: "for 5 sessions", description: "Five sauna or ice bath sessions." }],
  ]),
  group("advanced-recovery", "advanced-recovery", "Advanced recovery modalities", "both", "planned", [
    ["cold-plunge", "Cold Plunge Circuits", 600, null, { unit: "per session", usd: "≈ US$10" }],
    ["contrast", "Contrast Therapy Lanes", 750, null, { unit: "per session", usd: "≈ US$13" }],
    ["compression", "Compression Boots Lounges", 400, null, { unit: "for 30 mins", usd: "≈ US$7" }],
    ["infrared", "Infrared Zones", 500, null, { unit: "per session", usd: "≈ US$9", availability: "at-launch" }],
    ["red-light", "Red Light Therapy Bed", 1200, null, { unit: "per session", usd: "≈ US$21" }],
    ["hyperbaric", "Hyperbaric Oxygen", 3500, null, { unit: "per session", usd: "≈ US$60" }],
    ["cryo", "Cryotherapy Chambers", 1500, null, { unit: "per session", usd: "≈ US$26" }],
  ]),
  group("optimisation", "advanced-recovery", "Mind-body & performance optimization", "both", "planned", [
    ["mobility", "Mobility Studios", 800, null, { unit: "per session", usd: "≈ US$14" }],
    ["breathwork", "Breathwork Workshops", 950, null, { unit: "per workshop", usd: "≈ US$16" }],
    ["sleep", "Sleep Lab Consults", 2000, null, { unit: "per consult", usd: "≈ US$34" }],
    ["nad", "NAD+ Music Therapy", 2800, null, { unit: "per experience", usd: "≈ US$48" }],
  ]),
  group("camps", "camps-pricing", "Camps, retreats & premium experiences", "travellers", "phase-2", [
    ["camp-day-workshop", "Day Workshop / Clinic", 3500, 6000, { unit: "per person", usd: "≈ US$60–$105", description: "Single-day HYROX-style clinics, technique workshops or testing days. Includes structured coaching, program and performance assessment." }],
    ["camp-weekend-training", "Weekend Camp (Training Only)", 7500, 12000, { unit: "per person", description: "2 days, 1 night of training. No accommodation: participants arrange their own lodging." }],
    ["camp-weekend-all-inclusive", "Weekend All-Inclusive Camp", 18000, 35000, { unit: "per person", usd: "≈ US$310–$600", description: "2 days, 1 night with lodging at Villa Del Rey and meals included.", featured: true }],
    ["camp-week-immersive", "Week-Long Immersive", 60000, 120000, { unit: "per person", usd: "≈ US$1,000–$2,000", description: "5-day program: training, recovery, testing and nutrition guidance. Varies by accommodation standard and coach line-up." }],
  ], "Inquiry only."),
  group("corporate", "corporate", "Corporate bookings", "both", "at-launch", [
    ["corporate-groups", "Corporate & Team Bookings", null, null, { description: "Team-building experiences, group training rates and wellness off-sites with customized programming." }],
  ]),
];

const planned = "planned" as const;

export const DEFAULT_CONTENT: SiteContent = {
  // ---------- settings (§B.5) ----------
  settings: {
    launchPhase: "pre-launch",
    openingDate: "",
    contact: {
      addressLines: ["Capitol Complex, Pili, 4418", "Camarines Sur"], phoneDisplay: "0918-905-1234", phoneE164: "+639189051234",
      email: "basecampcamsur@gmail.com", hours: "Opening hours to be announced", mapsQuery: "Capitol Complex, Pili, Camarines Sur", googleReviewsUrl: "",
    },
    socials: [
      { platform: "Instagram", url: "https://www.instagram.com/basecampcamsur/", handle: "@basecampcamsur" },
      { platform: "Facebook", url: "https://www.facebook.com/basecampcamsur", handle: "basecampcamsur" },
      { platform: "X", url: "https://x.com/basecampcamsur", handle: "@basecampcamsur" },
      { platform: "TikTok", url: "", handle: "@basecampcamsurph" },
      { platform: "YouTube", url: "", handle: "" },
    ],
    founding: {
      enabled: true, title: "Founding member offer",
      summary: "Limited to the first 100 members. Lock in about 30% off your first 6 months, or secure lifetime alumni rates.",
      example: "Example: Athlete tier at ₱3,200/month (regular ₱4,500).",
      benefits: [
        "Founding rates locked in: about 30% off your first 6 months, or lifetime alumni rates",
        "Priority booking: first access to camps, workshops and special events",
        "Community status: recognized as the original believers who made BaseCamp possible",
        "An exclusive founding-member launch event",
      ],
      cap: 100, claimed: 0, showCounter: false, expiresOn: "", ctaLabel: "Become a founding member",
    },
    exchangeRate: 58,
    bookingWidgetUrl: "",
  },

  // ---------- home (§B.13b) ----------
  home: {
    rhythm: {
      eyebrow: "Ways to train", title: "Find your\ntraining rhythm.",
      intro: "Morning classes, open gym periods, private sessions and evening programming: choose the path that fits how you train.",
      paths: [
        { id: "local", title: "Local athlete", who: "CamSur & Bicol", cadence: "4–6 sessions a week", offer: "Monthly memberships & class packs", body: "Community connection and expert coaching, every week.", link: { label: "See memberships", href: "/membership#tiers" } },
        { id: "manila", title: "Manila & domestic traveler", who: "Weekend escapes", cadence: "Weekends, 3D/2N camps or 1-week programs", offer: "Camp packages, drop-ins & weekly passes", body: "Escape the city, train intensely, recover properly.", link: { label: "Explore camps", href: "/visit/camps" } },
        { id: "international", title: "International sports tourist", who: "Southeast Asia & beyond", cadence: "Multi-day stays", offer: "Multi-day packages", body: "Story-worthy adventure combined with serious training.", link: { label: "Plan your trip", href: "/visit" } },
      ],
      dayRhythm,
      linkLabel: "Explore all programs",
    },
    completeSystem: {
      enabled: true, eyebrow: "The complete system", title: "Train. Transform. Thrive.",
      intro: "This isn't three separate offerings: it's one integrated system where each element strengthens the others.",
      pillars: [
        { id: "train", name: "TRAIN", theme: "Performance", subtitle: "Strength & Engine", bullets: ["Functional fitness programming", "HYROX-style preparation", "Endurance conditioning", "Competition training"], link: { label: "Explore programs", href: "/programs" } },
        { id: "transform", name: "TRANSFORM", theme: "Recovery", subtitle: "Wellness & Longevity", bullets: ["Contrast therapy protocols", "Massage & bodywork", "Diverse therapy zones", "Mobility work"], link: { label: "Explore recovery", href: "/facilities/recovery" } },
        { id: "thrive", name: "THRIVE", theme: "Lifestyle", subtitle: "Community & Belonging", bullets: ["Social spaces & café", "Workshops & events", "Yoga & movement", "Long-term relationships"], link: { label: "Our story", href: "/about" } },
      ],
      closing: "Training creates demand for recovery. Recovery enables better training. Both create opportunities for community. Community drives commitment and long-term engagement.",
    },
    stats: {
      enabled: true, title: "Built into the ground. Not just the brand.",
      intro: "Training spaces are deliberately open and visible: a training ecosystem where effort is celebrated and community is built through shared work.",
      image: `${F}/facility-background-a1-5-b.jpg`,
      items: [
        { id: "sqm", value: "673", label: "Square meters", detail: "Dedicated outdoor training facility" },
        { id: "zones", value: "3", label: "Distinct zones", detail: "CrossFit-style, strength and cardio areas" },
        { id: "floor", value: "2nd floor", label: "Wellness level", detail: "An entire floor dedicated to recovery" },
        { id: "modalities", value: "12", label: "Recovery modalities", detail: "A complete recovery ecosystem, phased in" },
      ],
      cta: { label: "Explore the facility", href: "/facilities" },
    },
    differentiators: {
      enabled: true, eyebrow: "Why BaseCamp", title: "Not a gym. Not a resort. A new category.",
      intro: "Southeast Asia's Performance Playground: results-driven, but joyful.",
      items: [
        { id: "prove-results", title: "Prove results", body: "Outcome-based, not experience-based: baseline testing on arrival and reassessment before you leave.", link: { label: "Learn more", href: "/programs/coaching#assessment" }, availability: "planned" },
        { id: "recovery-forward", title: "Recovery-forward", body: "Recovery is as important as training. Adaptation happens during recovery, not during training.", link: { label: "Learn more", href: "/facilities/recovery" }, availability: "at-launch" },
        { id: "own-the-night", title: "Own the night", body: "Weekly training under lights: Night Games, Friday Night Lights and night runs.", link: { label: "Learn more", href: "/schedule/events#night" }, availability: "planned" },
        { id: "competition", title: "Constant competition", body: "There's always something to train for, always a leaderboard to climb, always a challenge to attempt.", link: { label: "Learn more", href: "/schedule/events#competition" }, availability: "planned" },
        { id: "food", title: "Performance food", body: "Filipino food isn't just delicious: it's performance fuel.", link: { label: "Learn more", href: "/facilities/lifestyle#fuel" }, availability: "planned" },
        { id: "multi-sport", title: "Multi-sport village", body: "Southeast Asia's first Multi-Sport Training Village: stay for weeks without repeating a session.", link: { label: "Learn more", href: "/programs#modalities" }, availability: "at-launch" },
      ],
    },
    afterDark: {
      enabled: true, eyebrow: "After dark", title: "Own the night.",
      body: "Lakefront lighting, music and energy rivalling a concert, and athletes training under the stars. Train hard without the afternoon sun.",
      highlights: ["Night Games (HYROX-style) · weekly", "Friday Night Lights (CrossFit-style) · weekly", "Night runs · weekly"],
      image: `${P}/program-endurance.png`,
      cta: { label: "See night programming", href: "/schedule/events#night" },
    },
    recoveryTeaser: {
      enabled: true, eyebrow: "Transform", title: "Recovery is infrastructure.",
      body: "Recovery is not an add-on amenity. BaseCamp provides the facilities and space that enable athletes to recover at the same intensity they train: a biohacking playground for athletes.",
      modalityIds: ["sauna", "infrared", "cold-plunge", "hyperbaric"],
      image: `${P}/program-recovery.png`,
      cta: { label: "Explore recovery", href: "/facilities/recovery" },
    },
    dayFlow: {
      enabled: true, title: "A day at BaseCamp.",
      steps: [
        { id: "arrive", title: "Arrive & connect", body: "Arrive early, meet your people." },
        { id: "train", title: "Train with intention", body: "Coached, programmed, purposeful." },
        { id: "recover", title: "Recover properly", body: "Cold, heat, mobility, rest." },
        { id: "refuel", title: "Refuel & socialize", body: "Performance food and long conversations." },
      ],
      quote: "The difference between a facility and a destination is dwell time. At BaseCamp, people don't rush in for a workout and leave: they arrive early, stay late, connect with others, and build relationships.",
    },
    pricingTeaser: {
      enabled: true, eyebrow: "Membership", title: "Transparent from day one.",
      intro: "No hidden information. Founding members lock in launch rates.",
      itemIds: ["local-basic", "athlete", "premium", "day-pass-standard", "drop-in-standard", "camp-day-workshop", "camp-week-immersive"],
      cta: { label: "See full pricing", href: "/membership" },
    },
    personas: {
      enabled: true, eyebrow: "Who it's for", title: "Athletes, beginners and travelers.",
      items: [
        { id: "local", title: "Local fitness community", body: "CamSur residents seeking world-class training facilities and professional coaching.", link: { label: "Memberships", href: "/membership#tiers" } },
        { id: "domestic", title: "Domestic enthusiasts", body: "Filipino athletes from Manila and other cities seeking training destinations for weekends, training camps, and extended visits.", link: { label: "Camps & weekends", href: "/visit/camps" } },
        { id: "international", title: "International camps", body: "Global fitness communities organizing training camps and group trips.", link: { label: "Group camps", href: "/visit/camps" } },
        { id: "corporate", title: "Corporate wellness", body: "Companies seeking unique venues for team off-sites, leadership development, and wellness programming that actually engages participants.", link: { label: "Corporate off-sites", href: "/programs/corporate" } },
        { id: "nomads", title: "Digital nomads", body: "Remote workers seeking locations that support both productivity and fitness, staying for extended periods.", link: { label: "Long stays", href: "/visit/camps#long-stays" } },
      ],
    },
    whyCamsur: { enabled: true, eyebrow: "Why CamSur", cta: { label: "Plan your visit", href: "/visit" } },
    founders: { enabled: true, eyebrow: "Founders' vision", cta: { label: "Read our story", href: "/about#founders" } },
    build: {
      enabled: true, eyebrow: "Built from the ground up", title: "Opening in CamSur.", intro: "The vision is clear. The execution is underway.",
      launchVideoUrl: "", liveTitle: "BaseCamp is live.", liveBody: "Doors are open. Request your first session today.", updatesShown: 3,
    },
    events: { enabled: true, eyebrow: "What's on", title: "Camps, workshops & events.", intro: "Reasons to engage now, and reasons to return.", count: 3, cta: { label: "Full calendar", href: "/schedule/events#events" } },
    social: { enabled: true },
    testimonials: { enabled: true, title: "From the community." },
    earlyAccess: {
      eyebrow: "Early access", title: "Train. Transform. Thrive.",
      body: "Join the founding list: founding-member rates, exclusive updates and priority access.",
      benefits: ["Founding-member rates", "Exclusive build and opening updates", "Priority access to camps and events"],
      image: `${F}/facility-exterior.jpg`,
    },
  },

  // ---------- programmes (§B.8) ----------
  programmes: {
    intro: "Training at BaseCamp isn't about access to equipment: it's about professional programming, expert coaching, and an environment specifically designed to push performance forward.",
    tagline: "Not a niche: a new category.",
    featured: FEATURED_PROGRAMMES,
    disciplines: [
      { id: "functional", title: "Functional fitness programming", description: "CrossFit-style training with constantly varied functional movements performed at high intensity and building work capacity, across broad time and modal domains." },
      { id: "hyrox", title: "HYROX-inspired endurance", description: "Hybrid fitness programming combining functional strength with endurance cardio, preparing athletes for competition and building robust conditioning." },
      { id: "zones", title: "Indoor + outdoor training zones", description: "From climate-controlled functional training areas to expansive outdoor zones under tropical skies." },
      { id: "coaching", title: "Coaching-led, athlete-first design", description: "Every program run by experienced coaches who understand progressive overload, periodization, and individual athlete development." },
      { id: "commercial", title: "Commercial gym area", description: "Dedicated space for aesthetics and physique training, catering to bodybuilding and traditional gym-goers, alongside functional fitness programming." },
    ],
    programmes,
    formats: [
      { id: "daily-classes", title: "Daily Classes", description: "Group CrossFit-style sessions and open gym access for local community and members", image: `${G}/functional-training.png`, href: "/schedule#timetable" },
      { id: "competition-prep", title: "Competition Prep", description: "Dedicated training tracks for athletes preparing for CrossFit competitions", image: `${G}/strength-conditioning.png`, href: "/programs/functional-training" },
      { id: "hyrox-programmes", title: "HYROX-style Programs", description: "Structured preparation cycles for hybrid fitness competitions", image: `${G}/endurance.png`, href: "/programs/endurance" },
      { id: "training-camps", title: "Training Camps", description: "Immersive multi-day experiences with accommodation and full programming", image: `${F}/facility-aerial.jpg`, href: "/visit/camps" },
      { id: "corporate-groups", title: "Corporate Groups", description: "Team-building and wellness off-sites with customized programming", image: `${G}/personal-coaching.png`, href: "/programs/corporate" },
      { id: "community-comps", title: "Community Comps", description: "Regular competitions and events building local engagement", image: `${P}/program-coaching.png`, href: "/schedule/events#competition" },
    ],
    modalities: [
      { id: "crossfit", title: "CrossFit-style", description: "Olympic lifting, gymnastics, metabolic conditioning", category: "train", availability: "at-launch" },
      { id: "hyrox", title: "HYROX-style", description: "Hybrid endurance racing, functional fitness competition", category: "train", availability: "at-launch" },
      { id: "outdoor", title: "Outdoor Training", description: "Trail conditioning, terrain-based circuits", category: "outdoor", availability: "at-launch" },
      { id: "strength", title: "Strength", description: "Powerlifting, bodybuilding, hypertrophy training", category: "train", availability: "at-launch" },
      { id: "running", title: "Running", description: "Structured training, interval work, distance building", category: "outdoor", availability: "at-launch" },
      { id: "recovery", title: "Recovery", description: "Cold plunge, sauna, compression, mobility work", category: "recovery", availability: "at-launch" },
      { id: "yoga", title: "Yoga", description: "Mobility, flexibility, mindfulness practices", category: "mind-body", availability: "phase-2" },
      { id: "pilates", title: "Pilates", description: "Core strength, reformer work, stability training", category: "mind-body", availability: planned },
      { id: "dance", title: "Dance", description: "Conditioning through choreography, rhythm training", category: "mind-body", availability: planned },
      { id: "trail-running", title: "Trail Running", description: "Technical terrain, endurance building", category: "outdoor", availability: planned },
      { id: "paddle", title: "Paddle + Lake Sports", description: "SUP, kayaking, open water swimming", category: "outdoor", availability: planned },
      { id: "swimming", title: "Swimming", description: "Lap swimming, technique work, open water", category: "outdoor", availability: planned },
    ],
    fusion: [
      { id: "yoga-weightlifting", title: "Yoga + Weightlifting", description: "Morning mobility before afternoon strength; Yin yoga between heavy lifting days.", availability: planned },
      { id: "pilates-trail-running", title: "Pilates + Trail Running", description: "Core stability for runners, with reformer work for hips and ankles.", availability: planned },
      { id: "dance-hyrox", title: "Dance Conditioning + HYROX-style", description: "A fun approach to serious conditioning. Appeals to those intimidated by traditional CrossFit.", availability: planned },
      { id: "sauna-meditation-journaling", title: "Sauna + Meditation + Journaling", description: "Heat, stillness and reflection in one session.", availability: planned },
      { id: "ice-breathwork-mobility", title: "Ice Bath + Breathwork + Mobility", description: "Breathing practice before the cold plunge, then mobility: an efficient 45-minute session.", availability: planned },
      { id: "barefoot-trail-nature", title: "Barefoot Trail Runs + Nature Therapy", description: "Grounding and forest-bathing principles on natural terrain.", availability: planned },
    ],
    signatureWorkouts: [
      { id: "lake-loop", title: "The Lake Loop", description: "Our signature loop run around the lake.", when: "Details at launch", availability: planned },
      { id: "camsur-crucible", title: "CamSur Crucible", description: "Our signature benchmark challenge.", when: "Details at launch", availability: planned },
      { id: "sunrise-strength", title: "Sunrise Strength", description: "Strength work at first light, before the heat.", when: "Early mornings", availability: planned },
      { id: "night-games", title: "Night Games", description: "HYROX-style competition under lights, with leaderboards.", when: "Weekly, after dark", availability: planned },
    ],
    assessment: {
      availability: planned,
      promise: "Outcome-based retreats, not experience-based. Our aim: measurable improvement in fitness and health markers.",
      steps: [
        { id: "vo2-lactate", title: "VO2 Max + Lactate Testing", description: "Baseline aerobic capacity on arrival." },
        { id: "body-composition", title: "Body Composition Analysis", description: "InBody scanning, with weekly scans on longer stays." },
        { id: "mobility-strength", title: "Mobility + Strength Baseline", description: "Functional movement screening and grip strength." },
        { id: "sleep-diagnostics", title: "Sleep Diagnostics", description: "Understand how you recover." },
        { id: "checkout", title: "Checkout Reassessment", description: "All metrics retested before departure. Guests receive a comprehensive report documenting improvements." },
      ],
      categories: ["Strength gain", "HYROX time reduction", "VO2 improvement", "Body composition", "Stress + HRV", "Sleep quality"],
    },
  },

  // ---------- recovery (§B.9) ----------
  recovery: {
    intro: "BaseCamp CamSur offers a comprehensive suite of recovery technologies and modalities, designed to accelerate physical adaptation, enhance mental clarity, and promote holistic well-being.",
    modalities: [
      { id: "cold-plunge", title: "Cold Plunge Circuits", description: "Multi-station cold immersion for post-training recovery.", detail: "Cold pools at 8–15°C with guided breathwork. At launch: a commercial ice bath for 4–6 people.", category: "cold", availability: planned, medicalNote: false },
      { id: "contrast-therapy", title: "Contrast Therapy Lanes", description: "Alternating hot and cold immersion to boost circulation.", detail: "Cold plunge → sauna or hot pool → rest.", category: "contrast", availability: planned, medicalNote: false },
      { id: "compression", title: "Compression Boots Lounges", description: "Dynamic air compression to support blood flow and reduce muscle soreness.", detail: "Boots and sleeves, 20–30 minute sessions.", category: "compression", availability: planned, medicalNote: false },
      { id: "infrared", title: "Infrared Zones", description: "Deep, penetrating heat for relaxation and muscle recovery.", detail: "Outdoor-rated infrared sauna for 6–8 people; infrared mats planned.", category: "heat", availability: "at-launch", medicalNote: false },
      { id: "red-light", title: "Red Light Therapy", description: "LED light bed sessions for recovery.", detail: "", category: "light", availability: planned, medicalNote: false },
      { id: "hyperbaric", title: "Hyperbaric Oxygen Chamber", description: "Increased oxygen delivery to support recovery.", detail: "HBOT chamber sessions.", category: "oxygen", availability: planned, medicalNote: true },
      { id: "cryotherapy", title: "Cryotherapy Chambers", description: "Whole-body exposure to ultra-cold temperatures.", detail: "2–3 minute sessions.", category: "cold", availability: planned, medicalNote: true },
      { id: "sauna", title: "Sauna Facilities", description: "Traditional heat for cardiovascular conditioning and deep relaxation.", detail: "Finnish-style dry sauna and outdoor-rated infrared sauna; dedicated men's and women's facilities planned for the wellness level.", category: "heat", availability: "at-launch", medicalNote: false },
      { id: "mobility", title: "Mobility Studios", description: "Dedicated spaces and guided sessions for flexibility, range of motion and injury prevention.", detail: "Foam rollers, massage guns, resistance bands.", category: "mind-body", availability: "at-launch", medicalNote: false },
      { id: "breathwork", title: "Breathwork Practices", description: "Structured breathing to manage stress, build lung capacity and sharpen focus.", detail: "Box breathing, coherence training and guided protocols.", category: "mind-body", availability: "phase-2", medicalNote: false },
      { id: "sleep-lab", title: "Sleep Labs", description: "Optimized environments and protocols for better sleep quality and duration.", detail: "", category: "sleep", availability: planned, medicalNote: false },
      { id: "nad-music", title: "NAD+ Music Therapy", description: "IV NAD+ combined with curated soundscapes for mental restoration.", detail: "Sound healing and vibroacoustic therapy beds.", category: "mind-body", availability: planned, medicalNote: true },
    ],
    disclaimer: "Advanced therapies such as hyperbaric oxygen, cryotherapy and NAD+ IV therapy are planned and require health screening. Consult your doctor before use. Nothing on this site is medical advice.",
  },

  // ---------- pricing (§B.7) ----------
  pricing: {
    intro: "Transparent pricing for locals and travelers. Value-led, premium, and accessible to core local athletes.",
    notes: [
      "All prices in Philippine Peso (PHP) with USD approximations at ₱58 = US$1.",
      "Drop-in and day-pass rates may be higher on weekends, long weekends and peak travel periods.",
      "Launch pricing shown; final rates are confirmed at opening.",
    ],
    groups: pricingGroups,
    faq: [
      { id: "validity", question: "How long are class packs valid?", answer: "5-Class Intro Pack: 60 days. 10-Class Pack: 90 days. 5-Class Yoga Pack: 90 days. 10-Class Yoga Pack: 120 days." },
      { id: "guest-passes", question: "How do guest passes work?", answer: "Premium members receive 2 guest passes per month." },
      { id: "freeze", question: "Can I freeze my membership?", answer: "Freeze policies will be published before opening." },
      { id: "cancel", question: "How do cancellations work?", answer: "Cancellation procedures will be published before opening." },
      { id: "peak", question: "Why do some visitor rates vary?", answer: "Drop-in and day-pass rates can be higher on weekends, long weekends and peak travel periods." },
      { id: "founding", question: "What is the founding member offer?", answer: "Limited to the first 100 members: about 30% off your first 6 months, or lifetime alumni rates." },
    ],
  },

  // ---------- schedule (§B.10) ----------
  schedule: {
    intro: "The facility operates throughout the day and week, with morning classes, open gym periods, private sessions, and evening programming, creating continuous activation.",
    notice: "",
    rhythm: dayRhythm.map(({ id, title, body }) => ({ id, title, description: body })),
    timetable,
    recurring: [
      { id: "leaderboards", title: "Daily Leaderboards", cadence: "Daily", night: false, availability: planned, description: "Overall, age-group, weight-class and improvement-rate rankings." },
      { id: "time-trials", title: "Weekly Time Trials", cadence: "Weekly", night: false, availability: planned, description: "HYROX-style stations tested every week." },
      { id: "night-games", title: "Night Games (HYROX-style)", cadence: "Weekly", night: true, availability: planned, description: "Competitive events under lights, team competitions with spectators and leaderboards." },
      { id: "friday-night-lights", title: "Friday Night Lights (CrossFit-style)", cadence: "Weekly", night: true, availability: planned, description: "Our signature weekly event with scaled divisions and a social gathering afterwards." },
      { id: "night-runs", title: "Night Runs", cadence: "Weekly", night: true, availability: planned, description: "Headlamp trail runs under the stars and illuminated lake loops." },
      { id: "partner-challenges", title: "Partner Challenges", cadence: "Regular", night: false, availability: planned, description: "Two-person team workouts with a random or chosen partner." },
      { id: "obstacle-races", title: "Obstacle Races", cadence: "Monthly", night: false, availability: planned, description: "Around the lake and through forests, over different distances, with family-friendly options." },
      { id: "team-challenges", title: "3-Hour Team Challenges", cadence: "Quarterly", night: false, availability: planned, description: "Endurance relays of running, rowing, lifting and skills, fundraising for local community projects." },
    ],
    events: [
      { id: "founders-workout", title: "Founders Workout", kind: "launch", date: "", dateLabel: "Opening day: date to be announced", availability: planned, description: "The first workout at BaseCamp, for founding members.", ctaHref: "/membership#founding" },
      { id: "community-dinner", title: "Community Dinner", kind: "launch", date: "", dateLabel: "Opening day: date to be announced", availability: planned, description: "Celebrate opening with the BaseCamp community.", ctaHref: "/contact" },
      { id: "skill-clinics", title: "Skill Clinics", kind: "workshop", date: "", dateLabel: "Regular: dates to be announced", availability: "phase-2", description: "Technique workshops and HYROX-style clinics.", ctaHref: "/contact?interest=day-clinic" },
      { id: "nutrition-seminars", title: "Nutrition Seminars", kind: "workshop", date: "", dateLabel: "Regular: dates to be announced", availability: planned, description: "Performance nutrition, Filipino-food style.", ctaHref: "/contact?interest=events" },
      { id: "community-comps", title: "Community Comps", kind: "competition", date: "", dateLabel: "Regular: dates to be announced", availability: planned, description: "Regular competitions building local engagement.", ctaHref: "/contact?interest=events" },
      { id: "trail-festival", title: "CamSur Trail Festival", kind: "festival", date: "", dateLabel: "Date to be announced", availability: planned, description: "Mass-participation trail running.", ctaHref: "/contact?interest=events" },
      { id: "lake-endurance", title: "Lake Endurance Challenge", kind: "festival", date: "", dateLabel: "Date to be announced", availability: planned, description: "Endurance racing around the lake.", ctaHref: "/contact?interest=events" },
      { id: "mtb-classic", title: "Mountain Bike Classic", kind: "festival", date: "", dateLabel: "Date to be announced", availability: planned, description: "Mountain bike racing on purpose-built trails.", ctaHref: "/contact?interest=events" },
    ],
    leaderboardCategories: ["Overall", "Age-group", "Weight-class", "Improvement rate"],
  },

  // ---------- story (§B.11) ----------
  story: {
    positioning: {
      notLine: "Not a gym. Not a retreat. Not a camp. Not a resort.",
      headline: "BaseCamp CamSur = Southeast Asia's Performance Playground.",
      sub: "Where athletes, beginners, and travelers come to train, transform, and thrive: powered by nature, science, and community.",
      breakdown: [
        { id: "playground", title: "Performance Playground", body: "Playground suggests fun, exploration and possibility; performance signals serious outcomes and credibility. Results-driven, but joyful." },
        { id: "everyone", title: "Athletes, beginners and travelers", body: "Elite athletes train alongside fitness newcomers. Everyone is welcome." },
        { id: "pillars", title: "Train. Transform. Thrive.", body: "Transformation is the ultimate promise. Training and recovery are equal priorities, and social connection is part of the value." },
        { id: "sources", title: "Nature, science and community", body: "Nature provides the setting and some of the training tools. Science ensures effectiveness. Community creates belonging and motivation." },
      ],
    },
    brandPillars: [
      { id: "adventure", title: "Adventure", body: "Every experience should feel like exploration" },
      { id: "recovery", title: "Recovery", body: "Training hard demands recovering properly" },
      { id: "community", title: "Community", body: "Shared struggle creates unbreakable bonds" },
      { id: "nature", title: "Nature", body: "The environment shapes the experience" },
      { id: "performance", title: "Performance", body: "Results matter, progress is non-negotiable" },
    ],
    founders: {
      eyebrow: "Founders' vision", title: "Why this place. Why this approach.",
      paragraphs: [
        "BaseCamp CamSur represents the future of integrated fitness and wellness in CamSur. Combining CrossFit-style training, HYROX-style preparation, outdoor training, commercial gym facilities, and comprehensive recovery services, we're creating a destination for athletes and wellness enthusiasts worldwide.",
        "Why here? While others do beaches, CamSur offers the freshwater and forest alternative. Cooler temperatures, calmer waters, mountain backdrops: a different kind of paradise.",
        "Why this approach? Training and recovery are equal priorities. Adaptation happens during recovery, not during training, so every space, every program and every design choice serves the athlete's complete journey.",
        "BaseCamp is for athletes seeking performance backed by science, for travelers seeking adventure, and for a community seeking connection through shared challenge in nature.",
      ],
      signature: "The BaseCamp CamSur founding team",
      image: `${F}/facility-landscape.jpg`,
    },
    buildUpdates: [
      { id: "execution-underway", date: "", title: "The execution is underway", body: "The vision is clear and construction is underway. Follow every phase of the build: zone reveals, equipment arrivals and design details coming to life.", image: `${F}/facility-aerial.jpg`, tag: "Build" },
      { id: "design", date: "", title: "Designed to grow from the landscape", body: "Raw concrete, natural timber and local stone. Shade-first, open-air, and never a mall gym.", image: `${F}/facility-render-a1-2.jpg`, tag: "Design" },
    ],
  },

  // ---------- people (§B.12) ----------
  people: { coaches: [], partners: [], testimonials: [] },

  // ---------- gallery (§B.12b) ----------
  gallery: {
    eyebrow: "Community", title: "Follow the movement.",
    intro: "Training intensity, nature, community, behind-the-scenes build updates and coach spotlights.",
    posts: [
      {
        id: "build-destination", platform: "Facebook", type: "Facility", pillar: "build", format: "Update", badge: "Built from the ground up",
        title: "The destination", caption: "A new home for movement is taking shape in Camarines Sur.",
        detail: "Follow the spaces, details, and progress behind a new destination for performance, recovery, and community in Pili.",
        image: `${F}/facility-detail.jpg`, imagePosition: "center", href: "https://www.facebook.com/basecampcamsur",
      },
      {
        id: "training-purpose", platform: "Instagram", type: "Strength", pillar: "training", format: "Photo", badge: "Training intensity",
        title: "Built with purpose", caption: "Strength that carries into training, sport, and everyday life.",
        detail: "Purposeful sessions build durable strength, confidence, and the capacity to keep progressing—one considered repetition at a time.",
        image: `${P}/program-strength.png`, imagePosition: "center 42%", href: "https://www.instagram.com/basecampcamsur/",
      },
      {
        id: "recovery-reset", platform: "Instagram", type: "Recovery", pillar: "recovery", format: "Photo", badge: "Recovery rituals",
        title: "Reset and restore", caption: "Make space for the work ahead.",
        detail: "Recovery belongs inside the training rhythm. Follow the practices, spaces, and guided sessions built to help the Basecamp community return ready.",
        image: `${P}/program-recovery.png`, imagePosition: "center 42%", href: "https://www.instagram.com/basecampcamsur/",
      },
      {
        id: "coach-progress", platform: "Facebook", type: "Coaching", pillar: "coaches", format: "Photo", badge: "Coach spotlight",
        title: "Progress, guided", caption: "Focused coaching with room to grow.",
        detail: "Meet the coaching approach behind Basecamp: clear direction, thoughtful progressions, and support shaped around the person doing the work.",
        image: `${P}/program-coaching.png`, imagePosition: "center 38%", href: "https://www.facebook.com/basecampcamsur",
      },
      {
        id: "community-motion", platform: "X", type: "Training", pillar: "community", format: "Update", badge: "Community moments",
        title: "One movement at a time", caption: "Purpose-built sessions, shared by the community.",
        detail: "See the energy, coaching cues, and everyday work behind Basecamp training—from foundational movement to high-output sessions.",
        image: `${P}/program-functional.png`, imagePosition: "center 48%", href: "https://x.com/basecampcamsur",
      },
    ],
  },

  // ---------- whyCamsur (§B.13) ----------
  whyCamsur: {
    title: "Why CamSur.",
    intro: "CamSur is a feature, not a compromise: natural beauty, accessibility and local culture.",
    reasons: [
      { id: "adventure", title: "Proven adventure destination", body: "CamSur has established itself as the Philippines' premier adventure tourism hub, with wakeboarding, water sports, and outdoor activities drawing visitors year-round." },
      { id: "climate", title: "Year-round tropical climate", body: "Consistent weather enables outdoor training 365 days a year: no seasonal closures and no weather-dependent programming limits (typhoons aside)." },
      { id: "alternative", title: "An undiscovered alternative", body: "A fresh alternative to Bali and Phuket: freshwater and forest instead of beach, with cooler temperatures, calmer waters and mountain backdrops." },
      { id: "access", title: "Tourism infrastructure", body: "Strong domestic and international tourism pull, accessible from Manila, with an established hospitality ecosystem." },
    ],
    story: "BaseCamp brings the region together as a performance lifestyle hub, with Philippine warmth and accessibility.",
  },
};

