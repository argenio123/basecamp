// Docs: 03-api-reference/03-file-conventions/01-metadata/sitemap.md (no lastModified: keeps output deterministic)
// Every public page from the site map (src/content/sitemap.ts), including one page per content programme.
// getSiteContent() is 'use cache', so this route stays static.
import type { MetadataRoute } from "next";
import { getSiteContent } from "@/content/get";
import { getPublicPaths } from "@/content/sitemap";
import { siteUrl } from "@/data/brand";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const { programmes } = await getSiteContent();
  return getPublicPaths(programmes.featured).map((route) => ({ url: route === "/" ? base : `${base}${route}` }));
}
