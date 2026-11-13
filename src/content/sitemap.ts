// Site map: the single source of truth for site structure (stage-3 spec §1, §4, §5, §8, §9).
// Header mega menu, mobile menu, footer site map, section tabs, breadcrumbs, related links, prev/next,
// legacy #anchor forwarding, AdminQuickEdit tab mapping, admin "View on site" links and app/sitemap.ts
// all read from here. Pure data + pure functions: client-safe (no server-only imports).
//
// Class detail pages (/classes/[slug]) are derived from programme content: pass `programmes`
// (getSiteContent().programmes.programmes, or any { slug, title, summary, image }[]) to the functions below.
import { facilitiesVideo, facilitiesVideoFrame } from "@/data/brand";
import { WORKOUT_TYPES } from "@/data/workout-types";
import type { FeaturedProgramme, SectionKey } from "./types";

export type SectionId = "programs" | "facilities" | "membership" | "schedule" | "visit" | "about";

/** One public page. `label` is the page name (breadcrumbs, cards, footer); `tabLabel` overrides it in section tabs. */
export type SitePage = {
  href: string;
  label: string;
  tabLabel?: string;
  /** One line (≤ ~14 words) used on cards, related links and the footer. */
  summary: string;
  image: string;
  imageAlt: string;
  /** Admin tab ("Edit this page" pill). */
  adminTab: SectionKey;
};

export type MenuHighlight = { href: string; label: string };

export type SiteSection = {
  id: SectionId;
  /** Top-level nav label. */
  label: string;
  /** Overview URL. */
  href: string;
  overview: SitePage;
  /** Sub-pages in section order (excludes the overview). */
  pages: SitePage[];
  /** Mega-menu panel (spec §4). */
  /** `video` (optional) replaces `image` in the mega-menu card; `videoPoster` is the video's own first frame, shown
   *  until playback starts. `image` is still used wherever the menu has no video. */
  menu: { text: string; image: string; imageAlt: string; video?: string; videoPoster?: string; highlights: MenuHighlight[] };
};

/** What the site map needs from a content programme. */
export type ProgrammeRef = Pick<FeaturedProgramme, "slug" | "title" | "description" | "image">;

export const LOGIN_PATH = "/login";
export const ADMIN_PATH = "/admin";
export const FOUNDING_HREF = "/membership/founding";
export const SECTION_IDS: readonly SectionId[] = ["programs", "facilities", "membership", "schedule", "visit", "about"];

export const CONTACT_PAGE: SitePage = {
  href: "/contact",
  label: "Contact",
  summary: "Ways to reach BaseCamp CamSur, the inquiry form, and directions.",
  image: "/images/facilities/facility-front.jpg",
  imageAlt: "The front of the BaseCamp CamSur facility",
  adminTab: "settings",
};

export const HOME_PAGE: SitePage = {
  href: "/",
  label: "Home",
  summary: "Southeast Asia's Performance Playground in Camarines Sur.",
  image: "/images/hero/hero-training.png",
  imageAlt: "Athlete training at BaseCamp CamSur",
  adminTab: "home",
};

export const programmeHref = (slug: string) => `/classes/${slug}`;

/** Programme slugs reserved for former static pages (Coaching, Corporate), so old links keep redirecting. */
export const RESERVED_PROGRAMME_SLUGS: ReadonlySet<string> = new Set(["coaching", "corporate"]);

const NUMBER_WORDS = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];

const page = (p: SitePage): SitePage => p;

/** Static sections. Programme detail pages are inserted by getSections(). */
const STATIC_SECTIONS: Record<SectionId, SiteSection> = {
  programs: {
    id: "programs",
    label: "Classes",
    href: "/classes",
    overview: page({
      href: "/classes", label: "Classes", tabLabel: "Overview",
      summary: "Coach-led classes for strength, fitness, endurance, and recovery.",
      image: "/images/programs/program-functional.png", imageAlt: "Athlete training inside a modern functional fitness space", adminTab: "programmes",
    }),
    // Class sub-pages are the station classes (/classes/styles/*); Coaching, Corporate and the programme detail pages were removed.
    pages: [],
    // text and highlights are filled from content programmes by getSections()
    menu: { text: "", image: "/images/programs/classes-hero.jpg", imageAlt: "Athlete doing dumbbell lunges while a coach sets up a barbell in a brick-and-concrete gym", highlights: [] },
  },
  facilities: {
    id: "facilities",
    label: "Facilities",
    href: "/facilities",
    overview: page({
      href: "/facilities", label: "Facilities", tabLabel: "Overview",
      summary: "Training rooms, a recovery level, and spaces to stay longer.",
      image: "/images/facilities/facility-aerial.jpg", imageAlt: "Aerial view of the BaseCamp CamSur site", adminTab: "recovery",
    }),
    pages: [
      page({
        href: "/facilities/training", label: "Training zones", tabLabel: "Training",
        summary: "CrossFit-style area, gym and yoga studio.",
        image: "/images/facilities/1st floor- crossfit area-v2.png", imageAlt: "Render of the BaseCamp CrossFit-style training area", adminTab: "home",
      }),
      page({
        href: "/facilities/recovery", label: "Recovery",
        summary: "Plunge pools, hyperbaric and therapy rooms.",
        image: "/images/facilities/2F Plunge.png", imageAlt: "Render of the BaseCamp plunge pools", adminTab: "recovery",
      }),
      page({
        href: "/facilities/lifestyle", label: "Lounge, café & lockers", tabLabel: "Lifestyle",
        summary: "Lobby, café, work area and lockers.",
        image: "/images/facilities/1st floor- cafeteria-v2.png", imageAlt: "Render of the BaseCamp café", adminTab: "recovery",
      }),
    ],
    menu: {
      text: "Training rooms, a recovery level, and spaces to stay longer.",
      image: "/images/facilities/facility-aerial-render.jpg", imageAlt: "Aerial render of the BaseCamp CamSur building and grounds",
      video: facilitiesVideo(960, 540), videoPoster: facilitiesVideoFrame(960, 540),
      highlights: [
        { href: "/facilities/training", label: "Training zones" },
        { href: "/facilities/recovery", label: "Recovery" },
        { href: "/facilities/lifestyle", label: "Social lounge" },
        { href: "/facilities/lifestyle", label: "Lockers & showers" },
      ],
    },
  },
  membership: {
    id: "membership",
    label: "Membership",
    href: "/membership",
    overview: page({
      href: "/membership", label: "Membership", tabLabel: "Overview",
      summary: "Early rates, membership tiers, and what each one includes.",
      image: "/images/programs/generated/functional-training.png", imageAlt: "Athlete driving a weighted sled in the open-air gym", adminTab: "pricing",
    }),
    pages: [
      page({
        href: "/membership/founding", label: "Founding members", tabLabel: "Founding",
        summary: "A proposed 30% off your first six months or a locked lifetime rate, plus founding perks.",
        image: "/images/programs/program-endurance.png", imageAlt: "Coach guiding a barbell squat", adminTab: "pricing",
      }),
      page({
        href: "/membership/launch-promotions", label: "Launch promotions", tabLabel: "Promotions",
        summary: "Launch rates on test: introductory membership, weekend day pass, and early-booking camps.",
        image: "/images/programs/generated/strength-conditioning.png", imageAlt: "Athlete squatting a loaded barbell", adminTab: "pricing",
      }),
      page({
        href: "/membership/price-guide", label: "Passes, recovery & more", tabLabel: "Price guide",
        summary: "Starting prices for packs, passes, yoga, recovery, camps, and corporate bookings.",
        image: "/images/programs/program-functional.png", imageAlt: "Functional training session", adminTab: "pricing",
      }),
      page({
        href: "/membership/join", label: "Join membership", tabLabel: "Join",
        summary: "Apply for a membership: choose a plan and share your goals.",
        image: "/images/membership/generated/launch-promotions-hero-basecamp-interior.png", imageAlt: "Members training inside the BaseCamp training hall", adminTab: "pricing",
      }),
    ],
    menu: {
      text: "Early rates, membership tiers, passes, and recovery pricing.",
      image: "/images/programs/generated/functional-training.png", imageAlt: "Athlete driving a weighted sled in the open-air gym",
      highlights: [
        { href: "/membership/founding", label: "Founding members" },
        { href: "/membership/launch-promotions", label: "Launch promotions" },
        { href: "/membership/price-guide", label: "Passes, recovery & more" },
        { href: "/membership/join", label: "Join membership" },
      ],
    },
  },
  schedule: {
    id: "schedule",
    label: "Schedule",
    href: "/schedule",
    overview: page({
      href: "/schedule", label: "Schedule", tabLabel: "Overview",
      summary: "The weekly rhythm and the timetable.",
      image: "/images/programs/generated/personal-coaching.png", imageAlt: "Coach supporting an athlete during a training session", adminTab: "schedule",
    }),
    pages: [
      page({
        href: "/schedule/timetable", label: "Weekly timetable", tabLabel: "Timetable",
        summary: "Pick your day, filter your session, and request a place.",
        image: "/images/programs/stations/row.jpg", imageAlt: "Athlete on a rowing machine", adminTab: "schedule",
      }),
      page({
        href: "/schedule/events", label: "Events & night training", tabLabel: "Events",
        summary: "Night training, competitions, and the events calendar.",
        image: "/images/programs/generated/endurance.png", imageAlt: "Endurance training session", adminTab: "schedule",
      }),
      page({
        href: "/schedule/book", label: "Book a session", tabLabel: "Book",
        summary: "Request a class, appointment, or camp place.",
        image: "/images/programs/generated/functional-training.png", imageAlt: "Functional training session", adminTab: "schedule",
      }),
    ],
    menu: {
      text: "The weekly rhythm, events, and booking.",
      image: "/images/programs/generated/personal-coaching.png", imageAlt: "Coach supporting an athlete during a training session",
      highlights: [
        { href: "/schedule/timetable", label: "Weekly timetable" },
        { href: "/schedule/events", label: "Competitions & events" },
        { href: "/schedule/book", label: "Book a session" },
        { href: "/schedule/book?service=appointment", label: "Recovery appointments" },
      ],
    },
  },
  visit: {
    id: "visit",
    label: "Visit",
    href: "/visit",
    overview: page({
      href: "/visit", label: "Visit", tabLabel: "Overview",
      summary: "Getting to BaseCamp CamSur, with a map and directions.",
      image: "/images/facilities/facility-landscape.jpg", imageAlt: "The CamSur landscape around BaseCamp", adminTab: "whyCamsur",
    }),
    pages: [
      page({
        href: "/visit/camps", label: "Camps & trips", tabLabel: "Camps",
        summary: "Training camps, travel packages, and extended stays for traveling athletes.",
        image: "/images/destination/thrive.png", imageAlt: "Athlete training on gymnastic rings", adminTab: "pricing",
      }),
      page({
        href: "/visit/why-camsur", label: "Why CamSur",
        summary: "Why athletes train in Camarines Sur, plus Lago del Rey.",
        image: "/images/facilities/facility-aerial.jpg", imageAlt: "Aerial view of the BaseCamp CamSur site", adminTab: "whyCamsur",
      }),
    ],
    menu: {
      text: "Getting to BaseCamp, and camps & trips for travelers.",
      image: "/images/facilities/facility-landscape.jpg", imageAlt: "The CamSur landscape around BaseCamp",
      highlights: [
        { href: "/visit/camps", label: "Camps & trips" },
        { href: "/visit/camps#long-stays", label: "Extended stays" },
        { href: "/visit/why-camsur", label: "Why CamSur" },
        { href: "/visit/why-camsur#lago-del-rey", label: "Lago del Rey" },
      ],
    },
  },
  about: {
    id: "about",
    label: "About",
    href: "/about",
    overview: page({
      href: "/about", label: "About", tabLabel: "Overview",
      summary: "The vision, brand pillars, and what makes BaseCamp CamSur different.",
      image: "/images/facilities/facility-exterior.jpg", imageAlt: "BaseCamp CamSur facility exterior set against the CamSur landscape", adminTab: "story",
    }),
    pages: [
      page({
        href: "/about/design", label: "Design & place",
        summary: "How the site is designed around performance, nature, and place.",
        image: "/images/facilities/facility-background-a1-5-b.jpg", imageAlt: "Render of the BaseCamp CamSur site design", adminTab: "story",
      }),
      page({
        href: "/about/the-build", label: "The build",
        summary: "Construction progress, build updates, and what comes next.",
        image: "/images/facilities/facility-render-a1-3.jpg", imageAlt: "Render of the BaseCamp CamSur facility", adminTab: "story",
      }),
      page({
        href: "/about/faq", label: "FAQ",
        summary: "Answers on membership and booking, and the member platform.",
        image: "/images/facilities/facility-detail.jpg", imageAlt: "Architectural detail at BaseCamp CamSur", adminTab: "pricing",
      }),
    ],
    menu: {
      text: "Southeast Asia's Performance Playground: the story and the build.",
      image: "/images/facilities/facility-exterior.jpg", imageAlt: "BaseCamp CamSur facility exterior set against the CamSur landscape",
      highlights: [
        { href: "/about/design", label: "Design & place" },
        { href: "/about/the-build", label: "The build" },
        { href: "/about#different", label: "What makes us different" },
        { href: "/about/faq", label: "FAQ" },
        { href: "/contact", label: "Contact" },
      ],
    },
  },
};

/** All six sections in nav order. The Classes menu lists the station classes; programme detail pages were removed, so `programmes` is kept only for callers. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- signature kept for existing callers
export function getSections(_programmes: readonly ProgrammeRef[]): SiteSection[] {
  return SECTION_IDS.map((id) => {
    const s = STATIC_SECTIONS[id];
    if (id !== "programs") return { ...s, pages: [...s.pages], menu: { ...s.menu, highlights: [...s.menu.highlights] } };
    return {
      ...s,
      pages: [...s.pages],
      menu: {
        ...s.menu,
        text: `${NUMBER_WORDS[WORKOUT_TYPES.length] ?? WORKOUT_TYPES.length} HYROX-style stations, each with a weekly coached class.`,
        // Highlights are the station classes (brand book 2026, "Eight stations. One engine."), in station order.
        highlights: WORKOUT_TYPES.map((w) => ({ href: `/classes/styles/${w.slug}`, label: w.title })),
      },
    };
  });
}

/** Strips query, hash and trailing slash. */
export function normalisePath(href: string): string {
  const path = href.split(/[?#]/)[0] || "/";
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

export type PageMatch = { section: SiteSection; page: SitePage; isOverview: boolean };

/** The section page for a path, or null for home, contact, login and unknown paths. */
export function findPage(path: string, programmes: readonly ProgrammeRef[]): PageMatch | null {
  const p = normalisePath(path);
  for (const section of getSections(programmes)) {
    if (section.overview.href === p) return { section, page: section.overview, isOverview: true };
    const hit = section.pages.find((pg) => pg.href === p);
    if (hit) return { section, page: hit, isOverview: false };
  }
  return null;
}

/** Any public page (section pages, home, contact) by path. */
export function findAnyPage(path: string, programmes: readonly ProgrammeRef[]): SitePage | null {
  const p = normalisePath(path);
  if (p === HOME_PAGE.href) return HOME_PAGE;
  if (p === CONTACT_PAGE.href) return CONTACT_PAGE;
  return findPage(p, programmes)?.page ?? null;
}

export type Crumb = { href: string; label: string };

/** Visible trail "Section / Page" (overview → [Section]). JSON-LD adds Home in front. */
export function getBreadcrumbs(path: string, programmes: readonly ProgrammeRef[]): Crumb[] {
  const match = findPage(path, programmes);
  if (match) {
    const sectionCrumb = { href: match.section.href, label: match.section.label };
    return match.isOverview ? [sectionCrumb] : [sectionCrumb, { href: match.page.href, label: match.page.label }];
  }
  const p = normalisePath(path);
  return p === CONTACT_PAGE.href ? [{ href: CONTACT_PAGE.href, label: CONTACT_PAGE.label }] : [];
}

/** Every public page in reading order: home, each section (overview then sub-pages), contact. */
export function getPageOrder(programmes: readonly ProgrammeRef[]): SitePage[] {
  return [HOME_PAGE, ...getSections(programmes).flatMap((s) => [s.overview, ...s.pages]), CONTACT_PAGE];
}

/** Previous / next page within the current section, including its overview as the first stop. */
export function getPrevNext(path: string, programmes: readonly ProgrammeRef[]): { prev: SitePage | null; next: SitePage | null } {
  const match = findPage(path, programmes);
  if (!match) return { prev: null, next: null };
  const order = [match.section.overview, ...match.section.pages];
  const i = order.findIndex((pg) => pg.href === normalisePath(path));
  if (i < 0) return { prev: null, next: null };
  return { prev: order[i - 1] ?? null, next: order[i + 1] ?? null };
}

/**
 * Related pages for the bottom of a sub-page. With `hrefs`, resolves those (any public path, hash allowed;
 * unknown paths are dropped). Without, picks up to `limit` sibling sub-pages following the current one.
 */
export function getRelated(path: string, programmes: readonly ProgrammeRef[], hrefs?: readonly string[], limit = 3): SitePage[] {
  if (hrefs?.length) {
    return hrefs.flatMap((href) => {
      const pg = findAnyPage(href, programmes);
      return pg ? [{ ...pg, href }] : [];
    }).slice(0, limit);
  }
  const match = findPage(path, programmes);
  if (!match) return [];
  const siblings = match.section.pages;
  const i = siblings.findIndex((pg) => pg.href === match.page.href);
  const rotated = i < 0 ? siblings : [...siblings.slice(i + 1), ...siblings.slice(0, i)];
  return rotated.filter((pg) => pg.href !== match.page.href).slice(0, limit);
}

/** Every public URL path (home, 6 overviews, all sub-pages incl. one per content programme, contact). */
export function getPublicPaths(programmes: readonly ProgrammeRef[]): string[] {
  return getPageOrder(programmes).map((pg) => pg.href);
}

/** Admin tab for the "Edit this page" pill. Class pages need no list: every /classes/* maps to programmes. */
export function adminTabForPath(path: string): SectionKey | null {
  const p = normalisePath(path);
  if (p === HOME_PAGE.href) return HOME_PAGE.adminTab;
  if (p === CONTACT_PAGE.href) return CONTACT_PAGE.adminTab;
  for (const id of SECTION_IDS) {
    const s = STATIC_SECTIONS[id];
    if (s.overview.href === p) return s.overview.adminTab;
    const hit = s.pages.find((pg) => pg.href === p);
    if (hit) return hit.adminTab;
  }
  if (p.startsWith("/classes/")) return "programmes";
  return null;
}

/**
 * Legacy in-page anchors (stage-2 section ids) → their new home (spec §9). Keyed by the old page path.
 * Anchors not listed stay on that page. Targets with a #hash must render that id on the new page.
 */
export const LEGACY_HASH_REDIRECTS: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  "/": {
    "complete-system": "/about#complete-system",
    differentiators: "/about#differentiators",
    "founders-vision": "/about#founders",
    build: "/about/the-build",
    "day-at-basecamp": "/classes",
    "who-its-for": "/classes",
  },
  "/classes": {
    disciplines: "/classes#disciplines",
    modalities: "/classes",
    formats: "/classes",
    signature: "/classes",
    fusion: "/classes",
    assessment: "/classes",
    mindset: "/classes",
    coaches: "/classes",
    "wellness-partners": "/classes",
    corporate: "/membership/price-guide#corporate",
  },
  "/facilities": {
    "training-zones": "/facilities/training#training-zones",
    "running-loop": "/facilities/training",
    "all-weather": "/facilities/training",
    recovery: "/facilities/recovery",
    "social-lounge": "/facilities/lifestyle#social-lounge",
    fuel: "/facilities/lifestyle",
    "signature-spaces": "/facilities/lifestyle",
    gallery: "/facilities",
  },
  "/membership": {
    packs: "/membership/price-guide#packs",
    "day-passes": "/membership/price-guide#day-passes",
    "open-gym": "/membership/price-guide#open-gym",
    "recovery-pricing": "/membership/price-guide#recovery-pricing",
    "advanced-recovery": "/membership/price-guide#advanced-recovery",
    yoga: "/membership/price-guide#yoga",
    corporate: "/membership/price-guide#corporate",
    faq: "/about/faq",
    platform: "/about/faq#platform",
    "camps-pricing": "/visit/camps#camps-pricing",
  },
  "/schedule": {
    timetable: "/schedule/timetable",
    night: "/schedule/events#night",
    competition: "/schedule/events#competition",
    events: "/schedule/events#events",
    book: "/schedule/book",
    platform: "/schedule/book#platform",
  },
  "/visit": {
    camps: "/visit/camps",
    "long-stays": "/visit/camps#long-stays",
    "why-camsur": "/visit/why-camsur",
    "lago-del-rey": "/visit/why-camsur#lago-del-rey",
  },
  "/about": {
    design: "/about/design",
    place: "/about/design#place",
    "performance-nature": "/about/design#performance-nature",
    identity: "/about/design#identity",
    build: "/about/the-build",
    "vision-ahead": "/about/the-build#vision-ahead",
  },
};

/** New URL for a legacy "/page#anchor", or null when the anchor still lives on that page. */
export function resolveLegacyHash(path: string, hash: string): string | null {
  const anchor = decodeURIComponent(hash.replace(/^#/, ""));
  if (!anchor) return null;
  return LEGACY_HASH_REDIRECTS[normalisePath(path)]?.[anchor] ?? null;
}

/** Where a stage-2 "page#anchor" reference now lives (forwarded target, or the same page#anchor). */
export function currentHrefFor(path: string, anchor: string): string {
  const moved = resolveLegacyHash(path, anchor);
  if (moved) return moved;
  const p = normalisePath(path);
  return p === "/" ? `/#${anchor}` : `${p}#${anchor}`;
}

/**
 * Ids each page must render so menu highlights and forwarded legacy links land (packages: keep these ids).
 * Conditional sections (e.g. #founding, #coaches, #founders) may be absent while hidden.
 */
export function requiredAnchors(path: string, programmes: readonly ProgrammeRef[] = []): string[] {
  const p = normalisePath(path);
  const targets = [
    ...getSections(programmes).flatMap((s) => s.menu.highlights.map((h) => h.href)),
    ...Object.values(LEGACY_HASH_REDIRECTS).flatMap((m) => Object.values(m)),
  ];
  const ids = targets.filter((href) => normalisePath(href) === p && href.includes("#")).map((href) => href.split("#")[1]);
  return [...new Set(ids)];
}
