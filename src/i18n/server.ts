// Locale in Server Components (design: src/i18n/README.md). Server-only: imports React.cache, never import from a
// Client Component (client code uses ./client.ts).
//
// The locale is not read from cookies or headers (that would make pages dynamic). A /fil route file renders the
// English page through localizedRoute() (./route.tsx), which first calls setRequestLocale("fil"). The value lives in a
// React.cache() store that is scoped to one server render, so the English page and every Server Component below it
// read it with getLocale() while the page is statically prerendered. Nothing sets it on English routes: "en".
//
// Limits (docs 01-app/03-api-reference/01-directives/use-cache.md, "React.cache isolation"):
// - Inside a 'use cache' function the store is empty: pass the locale in as an argument (getSiteContent does).
// - Root-layout components render beside the page, not below it: they must not rely on getLocale(); the layout
//   renders the locale-specific parts explicitly (Footer locale prop) or on the client (useLocale()).
import { cache } from "react";
import { DEFAULT_LOCALE, type Locale } from "./config";
import { FIL_PHRASES } from "./fil/phrases";
import { localizedHref } from "./paths";
import { fmt, UI, type UiDict } from "./ui";

const store = cache((): { locale: Locale } => ({ locale: DEFAULT_LOCALE }));

/** Called by localizedRoute() before rendering a page / its metadata in `locale`. */
export function setRequestLocale(locale: Locale): void {
  store().locale = locale;
}

/** The locale of the page being rendered ("en" outside a localized route). */
export function getLocale(): Locale {
  return store().locale;
}

const PHRASES: Record<Locale, Readonly<Record<string, string>>> = { en: {}, fil: FIL_PHRASES };

/** Translates one English phrase into `locale`, or returns it unchanged (English fallback). */
export function translate(english: string, locale: Locale, vars?: Record<string, string | number>): string {
  const phrase = PHRASES[locale][english];
  return fmt(phrase && phrase.trim() ? phrase : english, vars);
}

/**
 * Page copy written inline in a page or Server Component: t("Choose your tier.") or t("Opening {date}", { date }).
 * The English text is the key (fil/phrases.ts maps it to Filipino), so an untranslated or since-edited phrase simply
 * shows in English. Uses the request locale; call it inside the component body, not at module level.
 */
export function t(english: string, vars?: Record<string, string | number>): string {
  return translate(english, getLocale(), vars);
}

/** A t() bound to an explicit locale (root-layout components such as the Footer). */
export function translator(locale: Locale): (english: string, vars?: Record<string, string | number>) => string {
  return (english, vars) => translate(english, locale, vars);
}

/** Shared interface strings (ui.ts) for the request locale, or for an explicit one. */
export function getUi(locale: Locale = getLocale()): UiDict {
  return UI[locale];
}

/** An internal link in the request locale: localHref("/membership#tiers") → "/fil/membership#tiers" on Filipino pages
 *  (when that page exists), unchanged on English pages. */
export function localHref(href: string): string {
  return localizedHref(href, getLocale());
}
