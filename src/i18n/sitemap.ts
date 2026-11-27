// Site map in a locale (design: src/i18n/README.md). Client-safe: pure functions over src/content/sitemap.ts data.
// src/content/sitemap.ts stays English and unchanged; these overlay labels/summaries from ui.ts (pages, sections,
// highlights) and point links at /fil pages where they exist.
import type { SitePage, SiteSection } from "@/content/sitemap";
import { DEFAULT_LOCALE, type Locale } from "./config";
import { localizedHref } from "./paths";
import { fmt, UI } from "./ui";

const pathOf = (href: string) => {
  const p = href.split(/[?#]/)[0] || "/";
  return p.length > 1 ? p.replace(/\/+$/, "") : p;
};

/** A site-map page (or any { href, label, summary } item) with translated text and a localized link. */
export function localizePage<T extends Pick<SitePage, "href" | "label"> & Partial<Pick<SitePage, "summary" | "tabLabel">>>(page: T, locale: Locale): T {
  if (locale === DEFAULT_LOCALE) return page;
  const s = UI[locale].pages[pathOf(page.href)];
  return {
    ...page,
    href: localizedHref(page.href, locale),
    label: s?.label ?? page.label,
    ...(page.summary !== undefined ? { summary: s?.summary ?? page.summary } : {}),
    ...(page.tabLabel !== undefined || s?.tabLabel ? { tabLabel: s?.tabLabel ?? page.tabLabel } : {}),
  };
}

/** A menu highlight / link label: highlights[href], else the page label for its path, else English. */
export function localizeLink(link: { href: string; label: string }, locale: Locale): { href: string; label: string } {
  if (locale === DEFAULT_LOCALE) return link;
  const d = UI[locale];
  const page = d.pages[pathOf(link.href)];
  // Only borrow the page label when the English link label is that page's own name (not a custom phrase).
  return { href: localizedHref(link.href, locale), label: d.highlights[link.href] ?? (page?.label && !link.href.includes("#") ? page.label : link.label) };
}

/** getSections() output in `locale`: section labels, menu text, highlights, overview and sub-pages. */
export function localizeSections(sections: readonly SiteSection[], locale: Locale): SiteSection[] {
  if (locale === DEFAULT_LOCALE) return [...sections];
  const d = UI[locale];
  return sections.map((section) => {
    const s = d.sections[section.id];
    const menuText = section.id === "programs" && d.classesMenuText
      ? fmt(d.classesMenuText, { count: section.menu.highlights.length })
      : s?.menuText ?? section.menu.text;
    return {
      ...section,
      label: s?.label ?? section.label,
      href: localizedHref(section.href, locale),
      overview: localizePage(section.overview, locale),
      pages: section.pages.map((p) => localizePage(p, locale)),
      menu: { ...section.menu, text: menuText, highlights: section.menu.highlights.map((h) => localizeLink(h, locale)) },
    };
  });
}
