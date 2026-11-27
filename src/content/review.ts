// Content review for the admin (pure, server or client). After a deploy that changes default content, sections that
// staff saved earlier keep their stored values (merge.ts fills only keys they lack). This lists the stored values that
// now differ from the current defaults in the places where a stale value affects prices or offers — the founding offer,
// the founding tier's membership item, the day-pass items and the pricing FAQ — so staff can re-save or reset them.
// It never changes anything; it only reports.
import { DEFAULT_CONTENT } from "./defaults";
import { sectionFields, type Field } from "./editor-schema";
import { foundingTerms } from "./founding";
import { isPlainObject } from "./merge";
import type { FaqItem, PriceItem, SectionKey, SiteContent } from "./types";

export type ReviewItem = {
  section: SectionKey;
  /** "warning": the live site is affected now; "info": a stored value differs from the current default. */
  level: "warning" | "info";
  label: string;
  note?: string;
  stored?: string;
  current?: string;
};

type Dict = Record<string, unknown>;
const MAX_TEXT = 160;
const DAY_PASS_GROUP = "day-passes";

const clip = (s: string) => (s.length > MAX_TEXT ? `${s.slice(0, MAX_TEXT - 1)}…` : s);
const peso = (n: number) => `Php ${n.toLocaleString("en-US")}`;
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** A short, readable rendering of a stored or default value. */
function show(value: unknown): string {
  if (value === null || value === undefined) return "(not set / On request)";
  if (typeof value === "string") return value.trim() ? clip(value) : "(empty)";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return value.toLocaleString("en-US");
  if (Array.isArray(value)) return value.length ? clip(value.map((v) => (typeof v === "string" ? v : JSON.stringify(v))).join(" · ")) : "(none)";
  if (isPlainObject(value) && typeof value.min === "number") {
    return typeof value.max === "number" ? `${peso(value.min)}–${value.max.toLocaleString("en-US")}` : peso(value.min);
  }
  return clip(JSON.stringify(value));
}

const fieldsOf = (field: Field | undefined): Record<string, Field> => (field?.kind === "object" || field?.kind === "list" ? field.fields : {});
const labelOf = (fields: Record<string, Field>, key: string) => fields[key]?.label || key;

/** One "info" entry per default key whose stored value differs (keys the stored copy lacks use the default). */
function diffKeys(section: SectionKey, prefix: string, def: Dict, stored: Dict, fields: Record<string, Field>, include: (key: string) => boolean = () => true): ReviewItem[] {
  return Object.keys(def)
    .filter((key) => include(key) && key in stored && !same(stored[key], def[key]))
    .map((key) => ({ section, level: "info" as const, label: `${prefix} › ${labelOf(fields, key)}`, stored: show(stored[key]), current: show(def[key]) }));
}

function storedItemById(list: unknown, id: string): Dict | null | undefined {
  if (!Array.isArray(list)) return undefined; // section stored without this list: defaults apply
  return (list.find((i) => isPlainObject(i) && i.id === id) as Dict | undefined) ?? null;
}

function reviewFounding(stored: Dict | undefined, content: SiteContent): ReviewItem[] {
  const out: ReviewItem[] = [];
  const offer = content.settings.founding;
  if (offer.enabled) {
    const terms = foundingTerms(offer, content.pricing.groups);
    if (!terms.ok) {
      out.push({
        section: "settings", level: "warning", label: "The early member (founding) offer is switched off on the site",
        note: `It is switched on in Site settings, but its numbers can't be used: ${terms.reason} Fix the founding tier or price (or the tier's price in Pricing) and save.`,
      });
    }
  }
  const founding = stored && isPlainObject(stored.founding) ? stored.founding : null;
  if (!founding) return out;
  const def = DEFAULT_CONTENT.settings.founding;
  const defaultTierName = DEFAULT_CONTENT.pricing.groups.flatMap((g) => g.items).find((i) => i.id === def.tierId)?.name ?? def.tierId;
  if (!("tierId" in founding) || !("price" in founding)) {
    out.push({
      section: "settings", level: "warning", label: "Founding tier and price not saved yet",
      note: `Site settings were saved before the founding tier and price fields existed, so the site uses the defaults (${defaultTierName}, ${peso(def.price)} a month). Prices in the old example sentence are ignored. Check Site settings › Early member offer and save it.`,
    });
  }
  if (typeof founding.example === "string" && founding.example.trim()) {
    out.push({
      section: "settings", level: "info", label: "Early member offer › Old example sentence (no longer used)", stored: show(founding.example),
      note: "The price line is now generated from the founding tier and price. Saving Site settings removes the old sentence.",
    });
  }
  const fields = fieldsOf(sectionFields("settings").founding);
  out.push(...diffKeys("settings", "Early member offer", def as unknown as Dict, founding, fields));
  return out;
}

function reviewItems(prefix: string, defaults: readonly PriceItem[], storedList: unknown, fields: Record<string, Field>, include: (key: string) => boolean = (key) => key !== "id"): ReviewItem[] {
  const out: ReviewItem[] = [];
  for (const def of defaults) {
    const item = storedItemById(storedList, def.id);
    if (item === undefined) continue;
    if (item === null) {
      out.push({ section: "pricing", level: "info", label: `${prefix} › ${def.name}`, note: `This default item (id “${def.id}”) isn't in your saved pricing, so it isn't shown. Add it back or reset Pricing if it should be.` });
      continue;
    }
    out.push(...diffKeys("pricing", `${prefix} › ${def.name}`, def as unknown as Dict, item, fields, include));
  }
  return out;
}

function reviewPricing(stored: Dict | undefined, content: SiteContent): ReviewItem[] {
  if (!stored) return [];
  const out: ReviewItem[] = [];
  const schema = sectionFields("pricing");
  const groupFields = fieldsOf(schema.groups);
  const itemFields = fieldsOf(groupFields.items);
  const storedGroups = Array.isArray(stored.groups) ? stored.groups.filter(isPlainObject) : undefined;
  const storedGroup = (id: string) => (storedGroups ? storedGroups.find((g) => g.id === id) ?? null : undefined);

  // The founding tier's own item: its price is the "standard" the founding saving is measured against.
  const tierId = content.settings.founding.tierId;
  const memberships = DEFAULT_CONTENT.pricing.groups.find((g) => g.id === "memberships");
  const tierDefault = memberships?.items.find((i) => i.id === tierId);
  const membershipGroup = storedGroup("memberships");
  if (tierDefault && membershipGroup !== undefined) {
    const tierKeys = ["name", "price", "visible", "availability"];
    out.push(...reviewItems("Founding tier", [tierDefault], membershipGroup ? membershipGroup.items : [], itemFields, (key) => tierKeys.includes(key)));
  }

  const dayDefaults = DEFAULT_CONTENT.pricing.groups.find((g) => g.id === DAY_PASS_GROUP);
  const dayGroup = storedGroup(DAY_PASS_GROUP);
  if (dayDefaults && dayGroup === null) {
    out.push({ section: "pricing", level: "info", label: `Price groups › ${dayDefaults.title}`, note: "The default day-pass group isn't in your saved pricing, so day passes aren't shown." });
  } else if (dayDefaults && dayGroup) {
    out.push(...diffKeys("pricing", `Price groups › ${dayDefaults.title}`, dayDefaults as unknown as Dict, dayGroup, groupFields, (key) => key !== "id" && key !== "items"));
    out.push(...reviewItems(dayDefaults.title, dayDefaults.items, dayGroup.items, itemFields));
  }

  const faqFields = fieldsOf(schema.faq);
  if (Array.isArray(stored.faq)) {
    for (const def of DEFAULT_CONTENT.pricing.faq as FaqItem[]) {
      const item = storedItemById(stored.faq, def.id);
      if (item === null) out.push({ section: "pricing", level: "info", label: `FAQ › ${def.question}`, note: `This default question (id “${def.id}”) isn't in your saved FAQ, so it isn't shown.` });
      else if (item) out.push(...diffKeys("pricing", `FAQ › ${def.question}`, def as unknown as Dict, item, faqFields, (key) => key !== "id"));
    }
  }
  return out;
}

/**
 * Review items for the admin: `stored` is the raw stored sections (before merging), `content` the merged content
 * (before the public founding check), as readContentFresh() reads them.
 */
export function contentReview(stored: Partial<Record<SectionKey, unknown>>, content: SiteContent): ReviewItem[] {
  const asDict = (v: unknown) => (isPlainObject(v) ? v : undefined);
  return [...reviewFounding(asDict(stored.settings), content), ...reviewPricing(asDict(stored.pricing), content)];
}
