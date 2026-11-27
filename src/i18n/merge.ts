// Overlaying a translation on English values (design: src/i18n/README.md). Pure, client-safe, no "@/" imports.
//
// Rules (same for SiteContent and src/data/* modules):
// - The English value is the shape: only keys that exist in English are read from the translation; extra keys are ignored.
// - Only text is taken from the translation: a translated leaf is used when the English leaf is a string and the
//   translation is a non-empty string. Numbers, booleans, functions, and the "fixed" keys below (ids, links, images,
//   prices' metadata…) always come from English, so admin edits to prices, links, images and switches show in every locale.
// - Arrays of objects are matched by `id`, then `slug`, then by index for items without either; arrays of strings by index.
//   English items with no translation stay English (fallback), translated items with no English match are dropped.

type Dict = Record<string, unknown>;

/** Keys whose values are identifiers, URLs or settings, never translated. */
export const FIXED_KEYS: ReadonlySet<string> = new Set([
  "id", "slug", "href", "image", "images", "src", "url", "video", "videoPoster", "poster", "anchor",
  "availability", "interest", "goals", "audiences", "group", "category", "platform", "icon",
  "phoneE164", "email", "mapsQuery", "bookingWidgetUrl", "launchPhase", "openingDate", "expiresOn",
  "modalityIds", "itemIds",
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

function localizeArray(base: unknown[], over: unknown[]): unknown[] {
  const byKey = new Map<string, unknown>();
  for (const o of over) {
    const k = keyOf(o);
    if (k) byKey.set(k, o);
  }
  return base.map((item, i) => {
    const k = keyOf(item);
    const match = k ? (byKey.get(k) ?? (keyOf(over[i]) === null ? over[i] : undefined)) : over[i];
    return localizeValue(item, match);
  });
}

/** `base` with the translated text from `over` (see the rules above). Never mutates its inputs. */
export function localizeValue<T>(base: T, over: unknown): T {
  if (over === undefined || over === null) return base;
  if (typeof base === "string") return (typeof over === "string" && over.trim() !== "" ? over : base) as T;
  if (Array.isArray(base)) return (Array.isArray(over) ? localizeArray(base, over) : base) as T;
  if (isRecord(base)) {
    if (!isRecord(over)) return base;
    const out: Dict = { ...base };
    for (const key of Object.keys(base)) {
      if (FIXED_KEYS.has(key) || !(key in over)) continue;
      out[key] = localizeValue(base[key], over[key]);
    }
    return out as T;
  }
  return base;
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
