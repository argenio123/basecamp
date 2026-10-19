// Reading content (spec §B.4).
// Docs: node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache.md,
//       04-functions/cacheTag.md, 04-functions/cacheLife.md, 01-getting-started/08-caching.md.
// Editable content is read via fs/promises or fetch inside 'use cache' (never readFileSync or a JSON import),
// so it is prerendered into static shells and refreshed by updateTag(CONTENT_TAG) from admin actions.
import { cacheLife, cacheTag } from "next/cache";
import { CONTENT_TAG } from "./constants";
import { DEFAULT_CONTENT } from "./defaults";
import { mergeContent } from "./merge";
import { readStoredContent, type StoredContent } from "./store";
import type { ContentMeta, SiteContent } from "./types";

/** Cached, tagged site content for public pages and the root layout. No cookies/headers inside. */
export async function getSiteContent(): Promise<SiteContent> {
  "use cache";
  cacheTag(CONTENT_TAG);
  let stored: StoredContent | null = null;
  try {
    stored = await readStoredContent();
    cacheLife("max");
  } catch {
    // Storage outage → defaults, retried soon; 'minutes' expires in 1h so it stays prerenderable.
    cacheLife("minutes");
  }
  return mergeContent(DEFAULT_CONTENT, stored?.sections ?? {});
}

/** Uncached read for the admin (call only inside a Suspense boundary after requireAdmin()). */
export async function readContentFresh(): Promise<{ content: SiteContent; meta: ContentMeta }> {
  const stored = await readStoredContent();
  return { content: mergeContent(DEFAULT_CONTENT, stored.sections), meta: stored.meta };
}
