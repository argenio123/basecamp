import { getSiteContent } from "@/content/get";
import type { ProgrammeRef } from "@/content/sitemap";

/** Content programmes for the site-map helpers. getSiteContent() is 'use cache', so pages stay static. */
export async function getProgrammeRefs(): Promise<ProgrammeRef[]> {
  const c = await getSiteContent();
  return c.programmes.featured.map(({ slug, title, description, image }) => ({ slug, title, description, image }));
}
