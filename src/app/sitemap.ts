// Docs: 03-api-reference/03-file-conventions/01-metadata/sitemap.md (no lastModified: keeps output deterministic)
// Every public page from the site map (src/content/sitemap.ts), including one page per content programme, plus the
// /fil version of every localized page; localized pages list each other as hreflang alternates (src/i18n/paths.ts).
// getSiteContent() is 'use cache', so this route stays static.
import type { MetadataRoute } from "next";
import { getSiteContent } from "@/content/get";
import { getPublicPaths } from "@/content/sitemap";
import { siteUrl } from "@/data/brand";
import { LOCALES } from "@/i18n/config";
import { isLocalizedPath, languageAlternates, localizedHref } from "@/i18n/paths";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const abs = (route: string) => (route === "/" ? base : `${base}${route}`);
  const { programmes } = await getSiteContent("en");
  // The legal pages sit outside the navigation site map, so they're added here explicitly.
  return [...getPublicPaths(programmes.featured), "/privacy", "/terms"].flatMap((route) => {
    const languages = languageAlternates(route);
    if (!languages || !isLocalizedPath(route)) return [{ url: abs(route) }];
    const alternates = { languages: Object.fromEntries(Object.entries(languages).map(([lang, href]) => [lang, abs(href)])) };
    return LOCALES.map((l) => ({ url: abs(localizedHref(route, l)), alternates }));
  });
}
