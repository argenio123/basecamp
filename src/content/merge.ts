// Merge stored (admin-edited) sections over defaults (spec §B.4).
//
// Stored values win wherever they exist; anything the stored copy lacks is filled from the current defaults, at every
// depth. A section saved before a key existed (e.g. settings.founding.price, settings.founding.showCounter) therefore
// gets the new default instead of losing the key. Rules, applied recursively:
//   - plain objects: every default key is kept; a stored key replaces it (merged recursively). Keys that exist only in
//     the stored copy (fields since removed from the content model) are dropped, as the editor's validator does.
//   - arrays of strings (benefits, features, lines…): the stored array wins wholesale, so deleted lines stay deleted.
//   - arrays of objects (FAQ items, price items, socials…): the stored list wins as a list, so the admin's order,
//     removals and additions are kept and default items the admin deleted are NOT re-added (the admin's content
//     review lists them instead). Inside each stored item, keys the item lacks are filled in:
//       · from the default item with the same `id` (or `slug`), when there is one: it is the same item, so its value
//         for a newly added field is the best one available;
//       · otherwise (admin-added items) with blank values shaped like the default items ("" / 0 / false / [] / null),
//         never with another item's text, so no default copy ends up on an item it wasn't written for.
//   - null: kept where the editor schema allows it (price "On request", nullable numbers) or the default is null.
//   - a stored value whose type doesn't match the default (corrupt or from an incompatible model) → the default.
// Pure and synchronous: getSiteContent() stays a cached, prerenderable 'use cache' function.
import { SECTION_KEYS } from "./constants";
import { sectionFields, type Field } from "./editor-schema";
import type { SectionKey, SiteContent } from "./types";

type Dict = Record<string, unknown>;

export function isPlainObject(value: unknown): value is Dict {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

const nullable = (field: Field | undefined) => field?.kind === "price" || (field?.kind === "number" && field.nullable === true);
const childFields = (field: Field | undefined): Record<string, Field> | undefined =>
  field?.kind === "object" || field?.kind === "list" ? field.fields : undefined;

/** An empty value shaped like `value`, for keys an admin-added list item lacks. */
function blank(value: unknown): unknown {
  if (typeof value === "string") return "";
  if (typeof value === "number") return 0;
  if (typeof value === "boolean") return false;
  if (Array.isArray(value)) return [];
  if (isPlainObject(value)) return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, blank(v)]));
  return null;
}

function mergeValue(def: unknown, stored: unknown, field: Field | undefined): unknown {
  if (stored === undefined) return def;
  if (stored === null) return def === null || def === undefined || nullable(field) ? null : def;
  if (def === null || def === undefined) return stored;
  if (Array.isArray(def)) return Array.isArray(stored) ? mergeArray(def, stored, field) : def;
  if (isPlainObject(def)) return isPlainObject(stored) ? mergeObject(def, stored, childFields(field)) : def;
  return typeof def === typeof stored ? stored : def;
}

function mergeObject(def: Dict, stored: Dict, fields: Record<string, Field> | undefined): Dict {
  const out: Dict = {};
  for (const key of Object.keys(def)) out[key] = key in stored ? mergeValue(def[key], stored[key], fields?.[key]) : def[key];
  return out;
}

function mergeArray(def: unknown[], stored: unknown[], field: Field | undefined): unknown[] {
  const objectItems = def.length > 0 ? def.every(isPlainObject) : field?.kind === "list";
  if (!objectItems) return stored;
  const items = def as Dict[];
  const fields = childFields(field);
  const keyName = items.length && "id" in items[0] ? "id" : items.length && "slug" in items[0] ? "slug" : null;
  const byKey = new Map<unknown, Dict>(keyName ? items.map((item) => [item[keyName], item]) : []);
  const template = items.length ? (blank(items[0]) as Dict) : null;
  const out: unknown[] = [];
  for (const item of stored) {
    if (!isPlainObject(item)) continue; // corrupt entry: the item can't render
    const base = (keyName ? byKey.get(item[keyName]) : undefined) ?? template;
    out.push(base ? mergeObject(base, item, fields) : item);
  }
  return out;
}

export function mergeContent(defaults: SiteContent, stored: Partial<Record<SectionKey, unknown>>): SiteContent {
  const out = { ...defaults } as Record<SectionKey, unknown>;
  for (const key of SECTION_KEYS) {
    const value = stored[key];
    if (isPlainObject(value)) out[key] = mergeObject(defaults[key] as Dict, value, sectionFields(key));
  }
  return out as SiteContent;
}
