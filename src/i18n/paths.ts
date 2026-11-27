// Locale-aware paths (design: src/i18n/README.md). Client-safe: pure functions only.
import { DEFAULT_LOCALE, LOCALE_PREFIX, LOCALE_TAG, LOCALES, type Locale } from "./config";

/**
 * English paths that have a Filipino page at "/fil<path>" (a route file under src/app/fil/). Links, the language
 * switcher, hreflang and the sitemap only point at /fil pages listed here; every other link stays on the English page.
 * Add a path here in the same commit that adds its route file (MERGE-PLAN.md). A trailing "/*" matches one dynamic
 * segment, e.g. "/classes/styles/*".
 */
import { PATHS_CLASSES } from "./localized/classes";
import { PATHS_FACILITIES } from "./localized/facilities";
import { PATHS_MEMBERSHIP } from "./localized/membership";
import { PATHS_SCHEDULE } from "./localized/schedule";
import { PATHS_VISIT_ABOUT } from "./localized/visit-about";
import { PATHS_SHARED } from "./localized/shared";

// Section lists live in src/i18n/localized/* so sections can be localised in parallel without merge conflicts.
export const LOCALIZED_PATHS: readonly string[] = ["/", "/membership", "/visit", "/contact", ...PATHS_CLASSES, ...PATHS_FACILITIES, ...PATHS_MEMBERSHIP, ...PATHS_SCHEDULE, ...PATHS_VISIT_ABOUT, ...PATHS_SHARED];

const PREFIX_RE = /^\/fil(?=\/|$)/;

/** "/fil/membership" → { locale: "fil", path: "/membership" }; "/membership" → { locale: "en", path: "/membership" }. */
export function stripLocale(pathname: string): { locale: Locale; path: string } {
  if (PREFIX_RE.test(pathname)) return { locale: "fil", path: pathname.replace(PREFIX_RE, "") || "/" };
  return { locale: DEFAULT_LOCALE, path: pathname || "/" };
}

export const localeFromPath = (pathname: string): Locale => stripLocale(pathname).locale;
/** The English (unprefixed) path for any pathname. Use it wherever code compares the pathname with site-map paths. */
export const basePath = (pathname: string): string => stripLocale(pathname).path;

function normalise(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

/** True when `path` (English, no query/hash) has a page in every locale. */
export function isLocalizedPath(path: string): boolean {
  const p = normalise(path);
  return LOCALIZED_PATHS.some((entry) => {
    if (!entry.endsWith("/*")) return entry === p;
    const stem = entry.slice(0, -1); // keeps the trailing "/"
    return p.startsWith(stem) && p.length > stem.length && !p.slice(stem.length).includes("/");
  });
}

/**
 * The link to `href` in `locale`. Internal links to a localized page get the locale prefix ("/membership#tiers" →
 * "/fil/membership#tiers"); links to pages without a translation, external links, mailto: etc. are returned as-is
 * (for locale "en" any /fil prefix is removed).
 */
export function localizedHref(href: string, locale: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const cut = href.search(/[?#]/);
  const rawPath = cut < 0 ? href : href.slice(0, cut);
  const suffix = cut < 0 ? "" : href.slice(cut);
  const path = basePath(rawPath);
  if (locale === DEFAULT_LOCALE || !isLocalizedPath(path)) return `${path}${suffix}`;
  return `${LOCALE_PREFIX[locale]}${path === "/" ? "" : path}${suffix}`;
}

/** Where the language switcher sends a visitor on `pathname`: the same page in `target`, or that locale's home. */
export function switchLocaleHref(pathname: string, target: Locale): string {
  const path = basePath(pathname);
  if (target === DEFAULT_LOCALE) return path;
  return isLocalizedPath(path) ? localizedHref(path, target) : localizedHref("/", target);
}

/** hreflang map for a localized English path: { en: "/membership", fil: "/fil/membership", "x-default": "/membership" }. */
export function languageAlternates(path: string): Record<string, string> | undefined {
  if (!isLocalizedPath(path)) return undefined;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[LOCALE_TAG[l]] = localizedHref(path, l);
  languages["x-default"] = path;
  return languages;
}

/**
 * Metadata `alternates` for the page at English `path` rendered in `locale`: a self-referencing canonical plus hreflang
 * links (01-app/03-api-reference/04-functions/generate-metadata.md#alternates). Relative URLs resolve against the root
 * layout's metadataBase.
 */
export function alternatesFor(path: string, locale: Locale = DEFAULT_LOCALE): { canonical: string; languages?: Record<string, string> } {
  const languages = languageAlternates(path);
  return languages ? { canonical: localizedHref(path, locale), languages } : { canonical: path };
}
