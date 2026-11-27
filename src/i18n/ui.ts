// Draft translations — to be reviewed by a native speaker.
//
// Shared interface text (header, menus, footer, buttons, form labels/errors, privacy note, 404) in every locale.
// Client-safe: imported by client components (Header, MobileNav, FooterSignup…) and server components alike, so keep it
// to short interface strings. Page copy goes through t() (src/i18n/server.ts + fil/phrases.ts), editable content through
// getSiteContent(locale) (fil/content.ts), static copy in src/data/* through getData() (fil/data/*).
//
// Filipino style: everyday Philippine Filipino / Taglish as used in local gym marketing. Keep English for the words
// Filipinos use in English anyway (membership, class, coach, recovery, booking, email), Filipino for the actions
// (Sumali, Mag-book, Mag-login). `{name}` placeholders are filled by fmt().
import type { LaunchPhase } from "@/content/types";
import { PRIVACY_EMAIL, PRIVACY_NOTE } from "@/data/brand";
import type { Locale } from "./config";

/** Fills {placeholders}: fmt("Explore {label}", { label: "Visit" }). Unknown placeholders are left as-is. */
export function fmt(template: string, vars: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}

/** Site-map overlay per English href (page label, section-tab label, one-line summary). */
export type PageStrings = { label?: string; tabLabel?: string; summary?: string };
/** Site-map overlay per section id (top-level nav label and mega-menu text). */
export type SectionStrings = { label?: string; menuText?: string };

const en = {
  lang: {
    /** Accessible name of the switcher group. */
    label: "Language",
    /** Accessible name of each option, e.g. "Filipino" → "Switch to Filipino". */
    switchTo: "Switch to {language}",
  },
  common: {
    join: "Join",
    login: "Login",
    book: "Book",
    request: "Request",
    explore: "Explore",
    readMore: "Read more",
    sending: "Sending…",
    opensNewTab: "(opens in a new tab)",
    getDirections: "Get directions",
    skipToContent: "Skip to content",
    copyAddress: "Copy address",
    addressCopied: "Address copied",
  },
  header: {
    homeLabel: "BaseCamp CamSur home",
    primaryNav: "Primary navigation",
    menuLabel: "{label} menu",
    exploreSection: "Explore {label}",
    highlights: "Highlights",
    openNav: "Open navigation",
    closeNav: "Close navigation",
    sectionOverview: "{label} overview",
    becomeEarlyMember: "Become an early member",
    promptLabel: "BaseCamp member access",
    promptDismiss: "Dismiss access prompt",
    promptTitle: "Ready for BaseCamp?",
    promptBody: "Get priority access or continue to your member account.",
  },
  account: {
    memberLogin: "Member login",
    myAccount: "My account",
    loading: "Loading account…",
    shortcuts: "Member shortcuts",
    accountSettings: "Account settings",
    systemSettings: "System settings",
    logOut: "Log out",
    loggingOut: "Logging out…",
  },
  /** Header prompt button per launch phase (content/labels.ts PHASE_COPY.ctaLabel). */
  phaseCta: {
    "pre-launch": "Get early access",
    "soft-opening": "Become an early member",
    live: "Book a session",
  } as Record<LaunchPhase, string>,
  footer: {
    nav: "Footer navigation",
    bookingLine: "Booking line",
    email: "Email",
    hours: "Hours",
    followUs: "Follow us",
    socialLink: "{platform} (opens in a new tab)",
    rights: "BaseCamp CamSur. All rights reserved.",
    aiNote: "Some images are AI-generated illustrations or architectural renders of the building under construction.",
    legal: "Legal",
    privacy: "Privacy",
    terms: "Terms",
  },
  signup: {
    label: "Get early access",
    success: "You're on the list.",
    emailPlaceholder: "Email address",
    submit: "Join",
    consent: "I agree to receive BaseCamp CamSur early-member news and opening updates.",
  },
  /** Shared form labels and client-side messages (server messages: src/lib/leads/validate.ts, see MERGE-PLAN.md). */
  form: {
    name: "Full name",
    email: "Email",
    phone: "Mobile number",
    message: "Message",
    optional: "optional",
    submit: "Send",
    sending: "Sending…",
    success: "Thanks! We'll get back to you within one business day.",
    required: "This field is required.",
    invalidEmail: "Enter a valid email address.",
    invalidPhone: "Enter a valid mobile number.",
    consentRequired: "Please tick the box to continue.",
    genericError: "Something went wrong. Please try again.",
  },
  privacy: {
    /** {email} is replaced by the privacy email link. English follows PRIVACY_NOTE in src/data/brand.ts. */
    note: PRIVACY_NOTE.replace(PRIVACY_EMAIL, "{email}"),
    readOur: "Read our",
    policy: "privacy policy",
  },
  glance: {
    eyebrow: "At a glance",
    keyFacts: "Key facts",
  },
  findUs: {
    title: "Find BaseCamp.",
    address: "Address",
    landmark: "Landmark",
    landmarkText: "Beside the Provincial Capitol, near the Magic Park",
    email: "Email",
    phone: "Phone",
    hours: "Hours",
  },
  cta: {
    title: "Move with purpose.",
    body: "Join the early access list for early-member rates, exclusive updates and priority access.",
    label: "Get early access",
  },
  notFound: {
    eyebrow: "404",
    title: "This path hasn't been built yet.",
    body: "Return to Basecamp and keep exploring.",
    back: "Back to home",
  },
  /** English labels come from src/content/sitemap.ts itself, so these stay empty for en. */
  sections: {} as Partial<Record<string, SectionStrings>>,
  pages: {} as Partial<Record<string, PageStrings>>,
  /** Mega-menu highlight labels by full href (with #hash / ?query); falls back to pages[path].label. */
  highlights: {} as Partial<Record<string, string>>,
  /** Classes menu text; {count} = number of station classes. */
  classesMenuText: "",
};

export type UiDict = typeof en;

const fil: UiDict = {
  lang: {
    label: "Wika",
    switchTo: "Lumipat sa {language}",
  },
  common: {
    join: "Sumali",
    login: "Login",
    book: "Mag-book",
    request: "Mag-request",
    explore: "Tingnan",
    readMore: "Magbasa pa",
    sending: "Ipinapadala…",
    opensNewTab: "(magbubukas sa bagong tab)",
    getDirections: "Paano pumunta",
    skipToContent: "Lumaktaw sa nilalaman",
    copyAddress: "Kopyahin ang address",
    addressCopied: "Nakopya na ang address",
  },
  header: {
    homeLabel: "BaseCamp CamSur home",
    primaryNav: "Pangunahing navigation",
    menuLabel: "Menu ng {label}",
    exploreSection: "Tingnan ang {label}",
    highlights: "Highlights",
    openNav: "Buksan ang menu",
    closeNav: "Isara ang menu",
    sectionOverview: "{label}: overview",
    becomeEarlyMember: "Maging early member",
    promptLabel: "Member access ng BaseCamp",
    promptDismiss: "Isara ang paalala",
    promptTitle: "Ready ka na ba sa BaseCamp?",
    promptBody: "Kunin ang priority access o tumuloy sa iyong member account.",
  },
  account: {
    memberLogin: "Member login",
    myAccount: "Aking account",
    loading: "Nilo-load ang account…",
    shortcuts: "Mga shortcut ng member",
    accountSettings: "Account settings",
    systemSettings: "System settings",
    logOut: "Mag-log out",
    loggingOut: "Nagla-log out…",
  },
  phaseCta: {
    "pre-launch": "Kunin ang early access",
    "soft-opening": "Maging early member",
    live: "Mag-book ng session",
  },
  footer: {
    nav: "Footer navigation",
    bookingLine: "Booking line",
    email: "Email",
    hours: "Oras",
    followUs: "I-follow kami",
    socialLink: "{platform} (magbubukas sa bagong tab)",
    rights: "BaseCamp CamSur. Lahat ng karapatan ay nakalaan.",
    aiNote: "Ang ilang larawan ay AI-generated na ilustrasyon o architectural render ng gusaling ginagawa pa.",
    legal: "Legal",
    privacy: "Privacy",
    terms: "Mga Tuntunin",
  },
  signup: {
    label: "Kunin ang early access",
    success: "Nasa listahan ka na.",
    emailPlaceholder: "Email address",
    submit: "Sumali",
    consent: "Pumapayag akong makatanggap ng balita para sa early members at updates sa pagbubukas ng BaseCamp CamSur.",
  },
  form: {
    name: "Buong pangalan",
    email: "Email",
    phone: "Mobile number",
    message: "Mensahe",
    optional: "opsyonal",
    submit: "Ipadala",
    sending: "Ipinapadala…",
    success: "Salamat! Sasagot kami sa loob ng isang business day.",
    required: "Kailangang sagutan ito.",
    invalidEmail: "Maglagay ng tamang email address.",
    invalidPhone: "Maglagay ng tamang mobile number.",
    consentRequired: "I-check ang kahon para makapagpatuloy.",
    genericError: "May nagkaproblema. Pakisubukan ulit.",
  },
  privacy: {
    note: "Ginagamit namin ang iyong detalye para asikasuhin ang iyong request at, kung papayag ka, para magpadala ng updates mula sa BaseCamp CamSur. Para makita o ipabura ang iyong data, mag-email sa {email}.",
    readOur: "Basahin ang aming",
    policy: "privacy policy",
  },
  glance: {
    eyebrow: "Sa madaling salita",
    keyFacts: "Mahahalagang detalye",
  },
  findUs: {
    title: "Hanapin ang BaseCamp.",
    address: "Address",
    landmark: "Landmark",
    landmarkText: "Katabi ng Provincial Capitol, malapit sa Magic Park",
    email: "Email",
    phone: "Telepono",
    hours: "Oras",
  },
  cta: {
    title: "Kumilos nang may layunin.",
    body: "Sumali sa early access list para sa early-member rates, exclusive updates at priority access.",
    label: "Kunin ang early access",
  },
  notFound: {
    eyebrow: "404",
    title: "Hindi pa nagagawa ang pahinang ito.",
    body: "Bumalik sa BaseCamp at mag-explore pa.",
    back: "Bumalik sa home",
  },
  // Top-level nav labels are kept short: the desktop bar fits six labels around the logo (page labels can be longer).
  sections: {
    programs: { label: "Klase" },
    facilities: { label: "Pasilidad", menuText: "Mga training room, recovery level, at mga lugar para magtagal." },
    membership: { label: "Membership", menuText: "Early rates, membership tiers, passes, at presyo ng recovery." },
    schedule: { label: "Iskedyul", menuText: "Ang lingguhang ritmo, mga event, at booking." },
    visit: { label: "Bisita", menuText: "Paano pumunta sa BaseCamp, at camps & trips para sa mga biyahero." },
    about: { label: "Tungkol", menuText: "Ang Performance Playground ng Southeast Asia: ang kuwento at ang pagpapatayo." },
  },
  pages: {
    "/": { label: "Home", summary: "Ang Performance Playground ng Southeast Asia sa Camarines Sur." },
    "/contact": { label: "Makipag-ugnayan", summary: "Paano kami makokontak, ang inquiry form, at direksyon papunta sa amin." },
    "/classes": { label: "Klase", summary: "Mga coach-led na klase para sa lakas, fitness, endurance, at recovery." },
    "/facilities": { label: "Pasilidad", summary: "Mga training room, recovery level, at mga lugar para magtagal." },
    "/facilities/training": { label: "Training zones", tabLabel: "Training", summary: "CrossFit-style na area, gym at yoga studio." },
    "/facilities/recovery": { label: "Recovery", summary: "Plunge pools, hyperbaric at mga therapy room." },
    "/facilities/lifestyle": { label: "Lounge, café at lockers", tabLabel: "Lifestyle", summary: "Lobby, café, work area at lockers." },
    "/membership": { label: "Membership", summary: "Early rates, membership tiers, at kung ano ang kasama sa bawat isa." },
    "/membership/founding": { label: "Founding members", tabLabel: "Founding", summary: "Proposed na tipid na mga 29% sa unang anim na buwan o naka-lock na lifetime rate, plus founding perks." },
    "/membership/launch-promotions": { label: "Launch promos", tabLabel: "Promos", summary: "Mga launch rate na sinusubukan: introductory membership, weekend day pass, at early-booking camps." },
    "/membership/price-guide": { label: "Passes, recovery at iba pa", tabLabel: "Price guide", summary: "Panimulang presyo ng packs, passes, yoga, recovery, camps, at corporate bookings." },
    "/schedule": { label: "Iskedyul", summary: "Ang lingguhang ritmo at ang timetable." },
    "/schedule/timetable": { label: "Lingguhang timetable", tabLabel: "Timetable", summary: "Piliin ang araw, i-filter ang session, at mag-request ng slot." },
    "/schedule/events": { label: "Competitions at events", tabLabel: "Events", summary: "Lingguhang competitions at leaderboards." },
    "/schedule/book": { label: "Mag-book ng session", tabLabel: "Mag-book", summary: "Mag-request ng klase, appointment, o slot sa camp." },
    "/visit": { label: "Bumisita", summary: "Paano pumunta sa BaseCamp CamSur, may mapa at direksyon." },
    "/visit/camps": { label: "Camps at trips", tabLabel: "Camps", summary: "Training camps at group trips para sa mga atletang bumibiyahe." },
    "/visit/why-camsur": { label: "Bakit CamSur", summary: "Training sa freshwater, gubat, at bundok ng Camarines Sur." },
    "/about": { label: "Tungkol sa Amin", summary: "Ang vision, brand pillars, at kung bakit naiiba ang BaseCamp CamSur." },
    "/about/design": { label: "Disenyo at lugar", summary: "Paano dinisenyo ang site para sa performance, kalikasan, at lugar." },
    "/about/the-build": { label: "Ang pagpapatayo", summary: "Progreso ng construction, build updates, at ang mga susunod." },
    "/about/faq": { label: "FAQ", summary: "Mga sagot tungkol sa membership, booking, at member platform." },
  },
  highlights: {
    "/membership#tiers": "Pumili ng plan",
    "/schedule/book?service=appointment": "Recovery appointments",
    "/about#different": "Kung bakit kami naiiba",
  },
  classesMenuText: "{count} HYROX-style na station, bawat isa may coached class linggo-linggo.",
};

export const UI: Record<Locale, UiDict> = { en, fil };
