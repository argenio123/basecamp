// Translations that no longer apply: content paths whose English (defaults + admin edits) differs from the default
// a Filipino translation was written from. /fil shows the admin's English there until fil/content.ts is updated.
// Pure; used by the admin dashboard ("needs re-translation").
import { DEFAULT_CONTENT } from "@/content/defaults";
import type { SiteContent } from "@/content/types";
import { filContent } from "./fil/content";
import { localizeValue } from "./merge";

/** Paths such as "pricing.faq[founding].answer" or "schedule.timetable[mon-1].time", in content order. */
export function staleTranslations(content: SiteContent): string[] {
  const paths: string[] = [];
  localizeValue(content, filContent, { source: DEFAULT_CONTENT, onStale: (path) => paths.push(path) });
  return paths;
}
