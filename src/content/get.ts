// Reading content (spec §B.4).
// Docs: node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache.md,
//       04-functions/cacheTag.md, 04-functions/cacheLife.md, 01-getting-started/08-caching.md.
// Editable content is read via fs/promises or fetch inside 'use cache' (never readFileSync or a JSON import),
// so it is prerendered into static shells and refreshed by updateTag(CONTENT_TAG) from admin actions.
import { cacheLife, cacheTag } from "next/cache";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { filContent } from "@/i18n/fil/content";
import { localizeValue, mapHrefs } from "@/i18n/merge";
import { localizedHref } from "@/i18n/paths";
import { getLocale } from "@/i18n/server";
import { CONTENT_TAG } from "./constants";
import { DEFAULT_CONTENT } from "./defaults";
import { withCheckedFounding } from "./founding";
import { mergeContent } from "./merge";
import { contentReview, type ReviewItem } from "./review";
import { readStoredContent, type StoredContent } from "./store";
import type { ContentMeta, SiteContent } from "./types";

/**
 * Site content in `locale` for public pages and the root layout. Without an argument: the request locale
 * (src/i18n/server.ts), i.e. "fil" inside a /fil route and "en" everywhere else. Root-layout code passes it explicitly.
 * Filipino = the English content (with admin edits) overlaid with src/i18n/fil/content.ts: translated text only,
 * English for anything untranslated, internal links pointed at /fil pages (design: src/i18n/README.md).
 */
export async function getSiteContent(locale: Locale = getLocale()): Promise<SiteContent> {
  return getLocalizedContent(locale);
}

// The locale is an argument (part of the cache key): React.cache values are not visible inside 'use cache'.
// One cache scope per locale (no nested 'use cache', so the cacheLife below applies as written).
async function getLocalizedContent(locale: Locale): Promise<SiteContent> {
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
  const content = withCheckedFounding(mergeContent(DEFAULT_CONTENT, stored?.sections ?? {}));
  if (locale === DEFAULT_LOCALE) return content;
  return mapHrefs(localizeValue(content, filContent), (href) => localizedHref(href, locale));
}

/**
 * Uncached read for the admin (call only inside a Suspense boundary after requireAdmin()). The content is the stored
 * values merged over the defaults, without the public founding check (the editor shows what is stored); `review` lists
 * stored values that differ from the current defaults for prices and offers (src/content/review.ts).
 */
export async function readContentFresh(): Promise<{ content: SiteContent; meta: ContentMeta; review: ReviewItem[] }> {
  const stored = await readStoredContent();
  const content = mergeContent(DEFAULT_CONTENT, stored.sections);
  return { content, meta: stored.meta, review: contentReview(stored.sections, content) };
}
