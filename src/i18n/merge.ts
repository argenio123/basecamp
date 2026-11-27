// Overlaying a translation on English values (design: src/i18n/README.md). Pure, client-safe, no "@/" imports.
//
// Rules (same for SiteContent and src/data/* modules):
// - The English value is the shape: only keys that exist in English are read from the translation; extra keys are ignored.
// - Only text is taken from the translation: a translated leaf is used when the English leaf is a string and the
//   translation is a non-empty string. Numbers, booleans, functions, and the "fixed" keys below (ids, links, images,
//   prices' metadata…) always come from English, so admin edits to prices, links, images and switches show in every locale.
// - Arrays of objects are matched by `id`, then `slug`, then by index for items without either; arrays of strings by index.
//   English items with no translation stay English (fallback), translated items with no English match are dropped.
// - Content (admin-editable) passes its English source (the defaults): a translation is used only while the current
//   English still equals the English it was translated from, so admin edits show (in English) instead of stale text.

type Dict = Record<string, unknown>;

/** Keys whose values are identifiers, URLs or settings, never translated. */
export const FIXED_KEYS: ReadonlySet<string> = new Set([
  "id", "slug", "href", "image", "images", "src", "url", "video", "videoPoster", "poster", "anchor",
  "availability", "interest", "goals", "audiences", "group", "category", "platform", "icon",
  "phoneE164", "email", "mapsQuery", "bookingWidgetUrl", "launchPhase", "openingDate", "expiresOn",
  "modalityIds", "itemIds", "date", "ctaHref", "launchVideoUrl", "googleReviewsUrl", "imagePosition", "usd",
]);

function isPlainObject(value: unknown): value is Dict {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/** Module namespace objects (import * as m) have a null prototype in some bundlers and Object in others. */
function isRecord(value: unknown): value is Dict {
  return isPlainObject(value) || (value !== null && typeof value === "object" && !Array.isArray(value) && Object.prototype.toString.call(value) === "[object Module]");
}

function keyOf(item: unknown): string | null {
  if (!isPlainObject(item)) return null;
  if (typeof item.id === "string" || typeof item.id === "number") return `id:${item.id}`;
  if (typeof item.slug === "string") return `slug:${item.slug}`;
  return null;
}

/** Marks an overlay without a source (static src/data/* text, which cannot drift from its translation at runtime). */
const NO_SOURCE: unique symbol = Symbol("no-source");
type Source = unknown | typeof NO_SOURCE;

/** Whitespace-insensitive equality, so a default saved back unchanged by the admin still counts as unchanged. */
const sameText = (a: string, b: string) => a.replace(/\s+/g, " ").trim() === b.replace(/\s+/g, " ").trim();

type Walk = { source: Source; path: string; onStale?: (path: string) => void };

/** The item of `list` that corresponds to `item` at index `i`: same id/slug, else same index for items without either. */
function counterpart(list: unknown, item: unknown, i: number, byKey: Map<string, unknown> | null): unknown {
  if (!Array.isArray(list)) return undefined;
  const k = keyOf(item);
  if (k) return byKey?.get(k) ?? (keyOf(list[i]) === null ? list[i] : undefined);
  return list[i];
}

function indexByKey(list: unknown): Map<string, unknown> | null {
  if (!Array.isArray(list)) return null;
  const byKey = new Map<string, unknown>();
  for (const o of list) {
    const k = keyOf(o);
    if (k) byKey.set(k, o);
  }
  return byKey;
}

function itemPath(path: string, item: unknown, i: number) {
  const k = keyOf(item);
  return `${path}[${k ? k.slice(k.indexOf(":") + 1) : i}]`;
}

function localizeArray(base: unknown[], over: unknown[], walk: Walk): unknown[] {
  const overByKey = indexByKey(over);
  const guarded = walk.source !== NO_SOURCE;
  const sourceByKey = guarded ? indexByKey(walk.source) : null;
  const sourceList = guarded && Array.isArray(walk.source) ? walk.source : [];
  return base.map((item, i) => {
    const path = itemPath(walk.path, item, i);
    // Strings in a content array are matched by their English source text (edits, inserts and deletions shift indexes).
    if (guarded && typeof item === "string") {
      const j = sourceList.findIndex((s) => typeof s === "string" && sameText(s, item));
      return overlay(item, j >= 0 ? over[j] : over[i], { ...walk, source: j >= 0 ? sourceList[j] : undefined, path });
    }
    const match = counterpart(over, item, i, overByKey);
    const source = guarded ? counterpart(walk.source, item, i, sourceByKey) : NO_SOURCE;
    return overlay(item, match, { ...walk, source, path });
  });
}

function overlay(base: unknown, over: unknown, walk: Walk): unknown {
  if (over === undefined || over === null) return base;
  if (typeof base === "string") {
    if (typeof over !== "string" || over.trim() === "") return base;
    if (walk.source === NO_SOURCE) return over;
    // Content: the translation was made from the English default. If the English was edited since (or there is no
    // default at this path), the translation is stale, so show the current English instead.
    if (typeof walk.source === "string" && sameText(walk.source, base)) return over;
    if (base.trim() !== "") walk.onStale?.(walk.path);
    return base;
  }
  if (Array.isArray(base)) return Array.isArray(over) ? localizeArray(base, over, walk) : base;
  if (isRecord(base)) {
    if (!isRecord(over)) return base;
    const out: Dict = { ...base };
    for (const key of Object.keys(base)) {
      if (FIXED_KEYS.has(key) || !(key in over)) continue;
      const source = walk.source === NO_SOURCE ? NO_SOURCE : isRecord(walk.source) ? walk.source[key] : undefined;
      out[key] = overlay(base[key], over[key], { ...walk, source, path: walk.path ? `${walk.path}.${key}` : key });
    }
    return out;
  }
  return base;
}

/**
 * `base` with the translated text from `over` (see the rules above). Never mutates its inputs.
 * With `source` (the English the translation was written from, e.g. DEFAULT_CONTENT), a translated string is used
 * only while the English at the same path/id still equals the source; otherwise the current (admin-edited) English
 * shows. `onStale` receives the path of each such string ("schedule.timetable[mon-1].time").
 */
export function localizeValue<T>(base: T, over: unknown, options?: { source: unknown; onStale?: (path: string) => void }): T {
  return overlay(base, over, { source: options ? options.source : NO_SOURCE, path: "", onStale: options?.onStale }) as T;
}

/** Rewrites every `href` string in `value` with `rewrite` (used to point content links at /fil pages). */
export function mapHrefs<T>(value: T, rewrite: (href: string) => string): T {
  if (Array.isArray(value)) return value.map((v) => mapHrefs(v, rewrite)) as T;
  if (isRecord(value)) {
    const out: Dict = {};
    for (const [key, v] of Object.entries(value)) out[key] = key === "href" && typeof v === "string" ? rewrite(v) : mapHrefs(v, rewrite);
    return out as T;
  }
  return value;
}
