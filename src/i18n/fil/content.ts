// Draft translations — to be reviewed by a native speaker.
//
// STUB: the Filipino content override is written on another branch (i18n-content) and replaces this file at merge.
// Contract (read by getSiteContent("fil") in src/content/get.ts through localizeValue() in src/i18n/merge.ts):
// - `filContent` is a deep-partial SiteContent: only the text that has been translated.
// - Arrays are matched by item `id` (then `slug`), or by index when items have neither.
// - Only string leaves are used; ids, links, images, prices and switches always come from the English/admin content.
import type { SiteContent } from "@/content/types";

/** Every property optional, recursively; arrays hold deep-partial items. */
export type DeepPartial<T> = T extends readonly (infer U)[]
  ? DeepPartial<U>[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

export const filContent: DeepPartial<SiteContent> = {};
