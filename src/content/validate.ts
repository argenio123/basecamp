// Server-side validation of an edited content section against EDITOR_SCHEMA (spec §D.6, §D.8.6).
// Pure (no Next imports). Strips unknown keys, trims strings, removes \u0000, and enforces required fields,
// lengths, list maximums, enums, href/url/image/video rules and number bounds. Error paths are dotted.
import { EDITOR_SCHEMA, sectionFields, type Field, type ListField, type RefSource } from "./editor-schema";
import { isLibraryImage } from "./images";
import { RESERVED_PROGRAMME_SLUGS } from "./sitemap";
import type { SectionKey, SiteContent } from "./types";

// ---------- compile-time coverage check: each section's groups cover every key of its type ----------
type GroupKeys<G> = G extends { fields: infer F } ? keyof F : never;
type Covered<K extends SectionKey> = GroupKeys<(typeof EDITOR_SCHEMA)[K]["groups"][number]>;
type Missing<K extends SectionKey> = Exclude<keyof SiteContent[K], Covered<K>>;
type CoverageCheck = { [K in SectionKey]: [Missing<K>] extends [never] ? true : { missingKeys: Missing<K> } };
const COVERAGE: CoverageCheck = {
  settings: true, home: true, programmes: true, recovery: true, pricing: true,
  schedule: true, story: true, people: true, gallery: true, whyCamsur: true,
};
void COVERAGE;

export type ValidationError = { path: string; message: string };
/** Ids that `refs` fields may point at (from the current stored content). Omit to skip existence checks. */
export type RefSets = Partial<Record<RefSource, ReadonlySet<string>>>;
export type SectionValidation<K extends SectionKey> = { ok: true; value: SiteContent[K] } | { ok: false; errors: ValidationError[] };

export const ID_RE = /^[a-z0-9-]{1,60}$/;
const HREF_RE = /^(?:\/(?!\/)[^\s<>"'`\\]*|https:\/\/[^\s<>"'`\\]+)$/;
const HTTPS_RE = /^https:\/\/[^\s<>"'`\\]+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+()\-\s]*$/;
const E164_RE = /^(?:\+?[0-9]{6,16})?$/;
const POSITION_RE = /^[a-z0-9.%\s-]*$/i;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const DEFAULT_TEXT_MAX = 160;
const DEFAULT_AREA_MAX = 2000;
const DEFAULT_LINE_MAX = 300;
const HREF_MAX = 500;

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

function validDate(v: string): boolean {
  if (!DATE_RE.test(v)) return false;
  const d = new Date(`${v}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
}

class Walker {
  errors: ValidationError[] = [];
  private refs: RefSets;
  constructor(refs: RefSets) {
    this.refs = refs;
  }

  fail(path: string, message: string) {
    this.errors.push({ path, message });
  }

  /** Returns a cleaned string, or null (with an error) when the value is not text. */
  str(v: unknown, path: string, multiline: boolean): string | null {
    if (v === undefined || v === null) return "";
    if (typeof v !== "string") {
      this.fail(path, "Enter text.");
      return null;
    }
    const s = v.replace(/\u0000/g, "").replace(/\r\n?/g, "\n").trim();
    return multiline ? s : s.replace(/\s*\n\s*/g, " ");
  }

  field(field: Field, v: unknown, path: string): unknown {
    switch (field.kind) {
      case "text": {
        const s = this.str(v, path, false);
        if (s === null) return "";
        const max = field.max ?? DEFAULT_TEXT_MAX;
        if (field.required && !s) this.fail(path, `${field.label} is required.`);
        else if (s.length > max) this.fail(path, `Use ${max} characters or fewer.`);
        else if (s && field.format === "slug" && !ID_RE.test(s)) this.fail(path, "Use lowercase letters, numbers and hyphens only.");
        else if (s && field.format === "email" && !EMAIL_RE.test(s)) this.fail(path, "Enter a valid email address.");
        else if (field.format === "phone" && !PHONE_RE.test(s)) this.fail(path, "Use digits, spaces, + ( ) and - only.");
        else if (field.format === "e164" && !E164_RE.test(s.replace(/\s/g, ""))) this.fail(path, "Use international format, e.g. +639189051234.");
        else if (field.format === "position" && !POSITION_RE.test(s)) this.fail(path, "Use a CSS position such as center 42%.");
        return field.format === "e164" ? s.replace(/\s/g, "") : s;
      }
      case "id": {
        const s = this.str(v, path, false);
        if (s === null) return "";
        if (!ID_RE.test(s)) this.fail(path, "Use 1–60 lowercase letters, numbers or hyphens.");
        return s;
      }
      case "textarea": {
        const s = this.str(v, path, true);
        if (s === null) return "";
        const max = field.max ?? DEFAULT_AREA_MAX;
        if (field.required && !s) this.fail(path, `${field.label} is required.`);
        else if (s.length > max) this.fail(path, `Use ${max.toLocaleString("en-US")} characters or fewer.`);
        return s;
      }
      case "number": {
        if (field.nullable && (v === null || v === "" || v === undefined)) return null;
        const n = typeof v === "number" ? v : typeof v === "string" && v.trim() !== "" ? Number(v) : NaN;
        if (!Number.isFinite(n)) {
          this.fail(path, "Enter a number.");
          return field.nullable ? null : 0;
        }
        if (field.integer && !Number.isInteger(n)) this.fail(path, "Enter a whole number.");
        else if (field.min !== undefined && n < field.min) this.fail(path, `Enter ${field.min} or more.`);
        else if (field.max !== undefined && n > field.max) this.fail(path, `Enter ${field.max.toLocaleString("en-US")} or less.`);
        return n;
      }
      case "boolean":
        if (typeof v !== "boolean" && v !== undefined) this.fail(path, "Choose yes or no.");
        return v === true;
      case "select": {
        const s = typeof v === "string" ? v : "";
        if (!field.options.some((o) => o.value === s)) {
          this.fail(path, `Choose one of the ${field.label.toLowerCase()} options.`);
          return field.options[0]?.value ?? "";
        }
        return s;
      }
      case "multiSelect": {
        if (!Array.isArray(v)) {
          if (v !== undefined) this.fail(path, "Choose from the list.");
          return [];
        }
        const out: string[] = [];
        v.forEach((item, i) => {
          if (typeof item !== "string" || !field.options.some((o) => o.value === item)) this.fail(`${path}.${i}`, "Unknown option.");
          else if (!out.includes(item)) out.push(item);
        });
        return out;
      }
      case "date": {
        const s = this.str(v, path, false);
        if (s === null) return "";
        if (s && !validDate(s)) this.fail(path, "Enter a valid date (YYYY-MM-DD) or clear it.");
        return s;
      }
      case "image": {
        const s = this.str(v, path, false);
        if (s === null) return "";
        if (!isLibraryImage(s)) this.fail(path, "Choose an image from the library.");
        return s;
      }
      case "href": {
        const s = this.str(v, path, false);
        if (s === null) return "";
        if (!s) {
          if (!field.optional) this.fail(path, "Enter a link.");
        } else if (s.length > HREF_MAX || !HREF_RE.test(s)) {
          this.fail(path, "Use a site path starting with / (e.g. /membership#tiers) or a full https:// link.");
        }
        return s;
      }
      case "url":
      case "video": {
        const s = this.str(v, path, false);
        if (s === null) return "";
        if (s && (s.length > HREF_MAX || !HTTPS_RE.test(s))) this.fail(path, "Use a full https:// link, or leave it empty.");
        return s;
      }
      case "price": {
        if (v === null) return null;
        if (!isObject(v)) {
          this.fail(path, "Enter a price or tick “On request”.");
          return null;
        }
        const min = this.field({ kind: "number", label: "From", min: 0, max: 10_000_000, integer: true }, v.min, `${path}.min`) as number;
        const rawMax = v.max;
        if (rawMax === null || rawMax === undefined || rawMax === "") return { min, max: null };
        const max = this.field({ kind: "number", label: "To", min: 0, max: 10_000_000, integer: true }, rawMax, `${path}.max`) as number;
        if (Number.isFinite(max) && Number.isFinite(min) && max <= min) this.fail(`${path}.max`, "“To” must be higher than “From”, or leave it empty.");
        return { min, max };
      }
      case "stringList": {
        if (!Array.isArray(v)) {
          if (v !== undefined) this.fail(path, "Expected a list of lines.");
          return [];
        }
        const max = field.max ?? DEFAULT_LINE_MAX;
        const out: string[] = [];
        v.forEach((item, i) => {
          const s = this.str(item, `${path}.${i}`, false);
          if (s === null || !s) return; // empty lines are dropped
          if (s.length > max) this.fail(`${path}.${i}`, `Use ${max} characters or fewer.`);
          out.push(s);
        });
        if (out.length > field.maxItems) this.fail(path, `Use at most ${field.maxItems} lines.`);
        return out;
      }
      case "refs": {
        if (!Array.isArray(v)) {
          if (v !== undefined) this.fail(path, "Expected a list.");
          return [];
        }
        const known = this.refs[field.source];
        const out: string[] = [];
        v.forEach((item, i) => {
          if (typeof item !== "string" || !ID_RE.test(item)) this.fail(`${path}.${i}`, "Invalid id.");
          else if (known && !known.has(item)) this.fail(`${path}.${i}`, `“${item}” no longer exists. Remove it.`);
          else if (!out.includes(item)) out.push(item);
        });
        if (field.maxItems !== undefined && out.length > field.maxItems) this.fail(path, `Choose at most ${field.maxItems}.`);
        return out;
      }
      case "object":
        return this.object(field.fields, v, path);
      case "list":
        return this.list(field, v, path);
    }
  }

  object(fields: Record<string, Field>, v: unknown, path: string): Record<string, unknown> {
    const src = isObject(v) ? v : {};
    if (!isObject(v)) this.fail(path || "(section)", "Invalid value.");
    const out: Record<string, unknown> = {};
    for (const [key, field] of Object.entries(fields)) out[key] = this.field(field, src[key], path ? `${path}.${key}` : key);
    return out;
  }

  list(field: ListField, v: unknown, path: string): Record<string, unknown>[] {
    if (!Array.isArray(v)) {
      this.fail(path, "Expected a list.");
      return [];
    }
    if (v.length > field.maxItems) this.fail(path, `Use at most ${field.maxItems} items.`);
    const items = v.slice(0, field.maxItems).map((item, i) => this.object(field.fields, item, `${path}.${i}`));
    for (const [key, f] of Object.entries(field.fields)) {
      if (f.kind !== "id") continue;
      const seen = new Set<string>();
      items.forEach((item, i) => {
        const value = String(item[key] ?? "");
        if (value && seen.has(value)) this.fail(`${path}.${i}.${key}`, `Duplicate id “${value}”: ids must be unique in this list.`);
        seen.add(value);
      });
    }
    return items;
  }
}

/** Cross-field rules that the per-field schema can't express. */
function refine(section: SectionKey, value: Record<string, unknown>, w: Walker) {
  if (section === "settings") {
    const f = value.founding as { cap: number; claimed: number } | undefined;
    if (f && Number.isFinite(f.cap) && f.claimed > f.cap) w.fail("founding.claimed", "Claimed spots can't exceed the cap.");
    const socials = (value.socials as { platform: string }[] | undefined) ?? [];
    const seen = new Set<string>();
    socials.forEach((s, i) => {
      if (seen.has(s.platform)) w.fail(`socials.${i}.platform`, `${s.platform} is listed twice.`);
      seen.add(s.platform);
    });
  }
  if (section === "programmes") {
    // /programs/coaching and /programs/corporate are static pages, so a programme can't use those slugs.
    for (const key of ["featured", "programmes"] as const) {
      ((value[key] as { slug: string }[] | undefined) ?? []).forEach((p, i) => {
        if (RESERVED_PROGRAMME_SLUGS.has(p.slug)) w.fail(`${key}.${i}.slug`, `“${p.slug}” is used by another page. Choose a different slug.`);
      });
    }
  }
  if (section === "pricing") {
    // Item ids are looked up across all groups (teaser, recovery prices), so they must be unique site-wide.
    const seen = new Set<string>();
    ((value.groups as { items: { id: string }[] }[] | undefined) ?? []).forEach((g, gi) =>
      g.items.forEach((item, ii) => {
        if (item.id && seen.has(item.id)) w.fail(`groups.${gi}.items.${ii}.id`, `Duplicate item id “${item.id}”: item ids must be unique across all groups.`);
        seen.add(item.id);
      }),
    );
  }
}

/** Validates one section payload. On success the value is cleaned and cast to the section type. */
export function validateSection<K extends SectionKey>(section: K, input: unknown, refs: RefSets = {}): SectionValidation<K> {
  const w = new Walker(refs);
  const value = w.object(sectionFields(section), input, "");
  if (w.errors.length === 0) refine(section, value, w);
  if (w.errors.length > 0) return { ok: false, errors: w.errors.slice(0, 100) };
  return { ok: true, value: value as SiteContent[K] };
}

/** Ref sets from current content, for validating `refs` fields. */
export function refSetsFor(content: SiteContent): RefSets {
  return {
    pricingItems: new Set(content.pricing.groups.flatMap((g) => g.items.map((i) => i.id))),
    recoveryModalities: new Set(content.recovery.modalities.map((m) => m.id)),
  };
}
