// Merge stored (admin-edited) sections over defaults (spec §B.4).
// Per section: a stored plain object is merged over the default to depth 2; arrays replace wholesale;
// anything else (or a value whose shape doesn't match the default) falls back to the default.
import { SECTION_KEYS } from "./constants";
import type { SectionKey, SiteContent } from "./types";

type Dict = Record<string, unknown>;

export function isPlainObject(value: unknown): value is Dict {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function sameShape(def: unknown, value: unknown): boolean {
  if (def === null || def === undefined) return true;
  if (Array.isArray(def)) return Array.isArray(value);
  if (isPlainObject(def)) return isPlainObject(value);
  return typeof def === typeof value;
}

function mergeLevel(def: Dict, stored: Dict, depth: number): Dict {
  const out: Dict = { ...def };
  for (const key of Object.keys(def)) {
    if (!(key in stored)) continue;
    const d = def[key];
    const s = stored[key];
    if (!sameShape(d, s)) continue;
    out[key] = depth > 1 && isPlainObject(d) && isPlainObject(s) ? mergeLevel(d, s, depth - 1) : s;
  }
  return out;
}

export function mergeContent(defaults: SiteContent, stored: Partial<Record<SectionKey, unknown>>): SiteContent {
  const out = { ...defaults } as Record<SectionKey, unknown>;
  for (const key of SECTION_KEYS) {
    const value = stored[key];
    if (isPlainObject(value)) out[key] = mergeLevel(defaults[key] as Dict, value, 2);
  }
  return out as SiteContent;
}
