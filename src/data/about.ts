// Static About + Contact copy (spec §C.7/§C.8; stage-3 §1), taken from the deck. Editable copy (positioning,
// brand pillars, founders, build journal, partners, and the home keys completeSystem / differentiators /
// founders / build now rendered on About) comes from getSiteContent() instead.
// Pages: /about (overview), /about/design, /about/the-build, /contact.

type Item = { title: string; body: string };

export const ABOUT_HERO = {
  eyebrow: "About",
  title: "A purpose-built destination where performance meets lifestyle.",
  image: "/images/facilities/facility-exterior.jpg",
  imageAlt: "BaseCamp CamSur facility exterior set against the CamSur landscape",
};

/** "At a glance" summaries (≤25 words each, stage-3 §6). */
export const ABOUT_GLANCE = {
  overview: "BaseCamp CamSur is a purpose-built destination in Camarines Sur where performance training, recovery and lifestyle come together in one place.",
  design: "A facility designed to grow from the landscape: modern tropical architecture, lakes and jungle on the doorstep, and nature as a training partner.",
  build: "Follow BaseCamp CamSur from construction to opening: build updates, the countdown to launch and the vision for what comes next.",
  contact: "Join the early access list, send an inquiry about camps, corporate or partnerships, or find directions to BaseCamp CamSur.",
};

export const DESIGN_HERO = {
  eyebrow: "About",
  title: "Design & place.",
  intro: "A facility shaped by performance, nature and place: open-air training, lakes and jungle, and architecture that belongs to the landscape.",
  image: "/images/facilities/facility-detail.jpg",
  imageAlt: "Architectural detail at BaseCamp CamSur",
};

export const BUILD_HERO = {
  eyebrow: "About",
  title: "The build.",
  intro: "Built from the ground up in Camarines Sur. Follow the construction, the countdown to opening and the vision ahead.",
  image: "/images/facilities/facility-render-a1-3.jpg",
  imageAlt: "Render of the BaseCamp CamSur facility",
};

export const VISION = {
  eyebrow: "The vision",
  title: "A new category.",
  columns: [
    { label: "Not a gym", body: "Beyond repetitive indoor workouts and crowded urban facilities", highlight: false },
    { label: "Not a resort", body: "More than passive relaxation and standard hospitality", highlight: false },
    { label: "A new category", body: "Active Wellness + Sports Tourism", highlight: true },
  ],
  lead: "BaseCamp CamSur pioneers an entirely new category where performance training, recovery science, and lifestyle programming converge.",
  body: "This isn't about adding wellness amenities to a gym or fitness classes to a resort: it's a purpose-built environment where every element serves the athlete's complete journey from effort to adaptation to thriving.",
};

export const PROBLEM = {
  eyebrow: "Why BaseCamp",
  title: "The problem we're solving.",
  lead: "Today's athletes want more than workouts; they want transformation, community, and an environment purpose-built for their complete journey.",
  body: "The modern athlete trains across multiple disciplines, values recovery as much as performance, and seeks authentic community. Yet no destination in Southeast Asia delivers all three elements in an integrated, professionally operated environment.",
  /** Overview summary of `body` (stage-3 §1: [problem] + [edge] merged as short copy; intros ≤2 sentences). */
  short: "Athletes train across disciplines, value recovery as much as performance and seek real community. No destination in Southeast Asia yet delivers all three in one place.",
  gaps: [
    { title: "Urban gyms fall short", body: "Crowded, indoor environments offering repetitive programming without the space, natural elements, or infrastructure serious athletes need." },
    { title: "Wellness retreats miss the mark", body: "Passive experiences focused on relaxation rather than performance, lacking the training intensity and programming hybrid athletes demand." },
    { title: "Sports tourism is fragmented", body: "Disconnected experiences requiring athletes to patch together training facilities, recovery options, and accommodation across multiple locations." },
  ] satisfies Item[],
};

export const PILLARS = {
  eyebrow: "Brand promise",
  phases: [
    { label: "Train", phase: "Effort", body: "The effort phase: structured performance work that challenges and builds" },
    { label: "Transform", phase: "Adaptation", body: "The adaptation phase: recovery and restoration where growth actually happens" },
    { label: "Thrive", phase: "Lifestyle", body: "The lifestyle phase: sustainable practices, authentic community, and lasting change" },
  ],
  promise: "Our brand promise isn't marketing language: it's architectural and operational reality. Every space, every program, every design choice serves this complete journey.",
  pillarsTitle: "Five pillars guide every decision.",
};

export const IDENTITY = {
  eyebrow: "Who we are",
  title: "Sports first. Recovery as essential. A destination worth the trip.",
  items: [
    { title: "Sports & performance", body: "CrossFit-style, HYROX-style and outdoor training at the core" },
    { title: "Wellness & recovery", body: "Recovery built in as essential infrastructure" },
    { title: "Destination", body: "Train somewhere worth traveling to" },
  ] satisfies Item[],
};

export const EDGE = {
  eyebrow: "Our edge",
  title: "Our edge: performance science meets natural beauty.",
  contrastLabel: "Three destinations, three promises",
  intro: "BaseCamp CamSur brings together what no one else in Southeast Asia offers in one place: performance, technology, outdoor athleticism and recovery.",
  chips: ["Functional fitness", "HYROX-style preparation", "Outdoor performance conditioning", "Advanced recovery technology", "Lake-based multi-sport training", "Data-driven transformation"],
  contrast: [
    { place: "Bali", promise: "Feel good", body: "Leave feeling relaxed, spiritually connected and emotionally refreshed.", highlight: false },
    { place: "Phuket", promise: "Train hard", body: "Leave exhausted from intensive training.", highlight: false },
    { place: "CamSur", promise: "Prove results", body: "Leave with data showing you're fitter, stronger, and healthier.", highlight: true },
  ],
  closing: "This is wellness 2.0, where feeling good is backed by objective data and genuine performance improvement.",
};

export const PERFORMANCE_NATURE = {
  eyebrow: "Performance nature",
  title: "The Outdoor Performance Lab.",
  sub: "Where nature isn't scenery, it's your training partner.",
  image: "/images/programs/program-endurance.png",
  imageAlt: "Athlete running outdoors on an endurance session",
  items: [
    { title: "Trail-based conditioning", body: "Purpose-built trails for interval training, hill repeats and technical running. Varying terrain develops agility, strength and mental toughness together." },
    { title: "Lake running + water circuits", body: "Shallow-water resistance work along the lake edge, deep-water running for low-impact conditioning, and swimming built into cross-training circuits." },
    { title: "Obstacle + terrain integration", body: "Logs, rocks and hills built into workout design: climbing, jumping and crawling through real landscape rather than artificial gym obstacles." },
    { title: "HYROX-style lakeside events", body: "Racing through nature, rather than inside warehouses. Race-style courses set against lake and mountain scenery." },
    { title: "Multi-element workouts", body: "Sessions that combine mud, forest, mountain and water, for a unique training stimulus and mental challenge." },
  ] satisfies Item[],
};

export const PLACE = {
  eyebrow: "The place",
  title: "Lakes and jungle.",
  lead: "While others do beaches, CamSur offers the freshwater and forest alternative. Cooler temperatures, calmer waters, mountain backdrops: a different kind of paradise.",
  image: "/images/facilities/facility-background-a1-5-b.jpg",
  imageAlt: "Architectural render of BaseCamp CamSur's open-air training areas",
  items: [
    { title: "Lago Del Rey", body: "A protected lake for paddle training, open water swimming and water-based conditioning, all year round and without ocean hazards." },
    { title: "CamSur Watersports Complex", body: "The region's established wakeboarding and water-sports hub, close to BaseCamp." },
    { title: "Villa Del Rey lodging", body: "Nearby lodging for camps, weekends and longer training blocks." },
    { title: "Mountains, lakes, forests", body: "CamSur's natural assets are the raw materials for nature-first training." },
    { title: "Philippine warmth and accessibility", body: "A fresh alternative to Bali, accessible from Manila, with an established hospitality ecosystem." },
    { title: "Nature immersion", body: "The natural environment treated as a core wellness modality, alongside structured training." },
  ] satisfies Item[],
  link: { label: "Plan your visit", href: "/visit" },
};

export const DESIGN = {
  eyebrow: "Design",
  title: "Grown from the landscape.",
  intro: "A facility that feels as though it grew organically from the landscape, rather than being imposed upon it.",
  pillars: [
    { title: "Modern Tropical", body: "Architecture that responds to climate, while maintaining contemporary aesthetic and professional presence" },
    { title: "Glass-Forward Design", body: "Breathable spaces with natural light and sightlines that create energy and openness" },
    { title: "Material Contrast", body: "Steel structure with warm wood accents balancing industrial performance with natural comfort" },
    { title: "Integrated Landscape", body: "Palm trees and native planting woven into the architecture rather than added around it" },
  ] satisfies Item[],
  chips: ["Tropical brutalist (raw concrete, natural timber, local stone)", "Shade-first", "Open-air", "No “mall gym” feel"],
  quote: "Looks premium. Feels athletic. Films beautifully.",
  image: "/images/facilities/facility-render-a1-3.jpg",
  imageAlt: "Architectural render of the BaseCamp CamSur facility",
};

export const BUILD = {
  eyebrow: "Build journal",
  title: "Built from the ground up.",
  line: "Every construction photo becomes content. Every design decision becomes a story.",
  followLabel: "Follow the build",
};

export const DIFFERENT = {
  eyebrow: "Why we're different",
  title: "What makes us different.",
  items: [
    { title: "First-mover", body: "The Philippines' first integrated performance and wellness destination" },
    { title: "Recovery infrastructure at scale", body: "Proper facilities built for volume, not retrofitted amenities. The second floor's dedicated wellness spaces and multiple recovery modalities." },
    { title: "Purpose-built, not adapted", body: "Every space designed specifically for its function, not a converted warehouse or repurposed building." },
  ] satisfies Item[],
};

export const VISION_AHEAD = {
  eyebrow: "Looking ahead",
  title: "The vision ahead.",
  aspirations: [
    { title: "A training destination", body: "The place athletes choose for camps, competitions, and focused training blocks" },
    { title: "A wellness authority", body: "Trusted voice in performance, recovery, and athletic longevity" },
    { title: "A sports tourism icon", body: "The definitive model for integrated performance destinations in Asia" },
  ] satisfies Item[],
  movement: "BaseCamp CamSur becomes more than a facility: it becomes a movement. Athletes plan their year around training camps here. Coaches bring their communities for immersive experiences. Corporate groups choose it for transformative off-sites. Digital nomads base themselves here for months at a time.",
  closing: "The vision isn't about building a gym. It's about creating the destination where Southeast Asia's fitness community gathers, trains, and grows together.",
  beyondTitle: "Beyond the flagship",
  beyond: [
    { title: "Flagship events", body: "Annual competitions and training camps that become calendar fixtures, drawing international participants." },
    { title: "Regional competitions", body: "Hosting qualifying events for major competitions." },
  ] satisfies Item[],
};

export const PARTNERS = {
  eyebrow: "Partners",
  title: "Built with partners.",
  typeLabel: { accommodation: "Accommodation", transport: "Transport", wellness: "Wellness", ambassador: "Ambassadors" },
  typeOrder: ["accommodation", "transport", "wellness", "ambassador"],
} as const;

/** /contact (spec §C.8 + stage-3 §1: At a glance · enquiry form · address + map link). */
export const CONTACT = {
  eyebrow: "Early access",
  title: "Become an early member.",
  lead: "Join the early access list: early-member rates, exclusive updates and priority access.",
  formEyebrow: "Get in touch",
  formTitle: "Two ways to reach us.",
  formIntro: "Early access puts you on the early access list. Inquiry is for corporate off-sites, camps and group bookings, partnerships and media.",
  foundingLink: "About early membership",
  findEyebrow: "Find us",
  findTitle: "Address & directions.",
  findIntro: "BaseCamp CamSur is in Camarines Sur, Philippines. Getting there, transfers and the map are on the Visit page.",
  visitLink: "Getting there",
};

export const ABOUT_CTA = {
  title: "Come build with us.",
  body: "Join the early access list for early-member rates, exclusive updates and priority access.",
};
