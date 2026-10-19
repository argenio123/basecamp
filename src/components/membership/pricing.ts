// Pricing helpers for the Membership section (stage-3 §1). Pure and client-safe (no hooks, no server imports).
// Every content price group is rendered on exactly one page, chosen by its anchor:
//   /membership                   [tiers]
//   /membership/passes            [packs] [day-passes] [open-gym] (+ any admin-added group with an unknown anchor)
//   /membership/recovery-pricing  [recovery-pricing] [advanced-recovery] [yoga]
//   /membership/corporate         [corporate]
//   /visit/camps                  [camps-pricing] (rendered by the Visit section)
import { formatPhp } from "@/content/format";
import type { Availability, Price, PriceGroup, PriceItem } from "@/content/types";

export type PricingPage = "overview" | "passes" | "recovery" | "corporate" | "camps";

export const PRICING_PATHS: Readonly<Record<PricingPage, string>> = {
  overview: "/membership",
  passes: "/membership/passes",
  recovery: "/membership/recovery-pricing",
  corporate: "/membership/corporate",
  camps: "/visit/camps",
};

const PAGE_BY_ANCHOR: Readonly<Record<string, PricingPage>> = {
  tiers: "overview",
  packs: "passes",
  "day-passes": "passes",
  "open-gym": "passes",
  "recovery-pricing": "recovery",
  "advanced-recovery": "recovery",
  yoga: "recovery",
  corporate: "corporate",
  "camps-pricing": "camps",
};

/** Item ids whose rows need the recovery disclaimer (spec §0.11: hyperbaric, cryotherapy, NAD+). */
const MEDICAL_ITEM_IDS = ["hyperbaric", "cryo", "nad"];

/** Which page renders a group. Unknown anchors land on Passes, so admin-added groups are never dropped. */
export function pricingPageFor(group: Pick<PriceGroup, "id" | "anchor">): PricingPage {
  if (group.id === "memberships") return "overview";
  if (group.id === "corporate") return "corporate";
  if (group.id === "camps") return "camps";
  return PAGE_BY_ANCHOR[group.anchor] ?? "passes";
}

/** Groups rendered on a page, in content order. */
export const groupsFor = (groups: readonly PriceGroup[], pageId: PricingPage) => groups.filter((g) => pricingPageFor(g) === pageId);

/** Where a group's prices live now (page, plus #anchor unless the anchor is the page itself). */
export function groupHref(group: Pick<PriceGroup, "id" | "anchor">): string {
  const pageId = pricingPageFor(group);
  const path = PRICING_PATHS[pageId];
  if (pageId === "corporate" || !group.anchor || group.anchor === "recovery-pricing") return path;
  return `${path}#${group.anchor}`;
}

export type PriceBlockData = { key: string; anchor: string; groups: PriceGroup[] };

/** Visible items only; groups sharing an anchor render together and the id goes on the shared wrapper. */
export function toBlocks(groups: readonly PriceGroup[]): PriceBlockData[] {
  const blocks: PriceBlockData[] = [];
  for (const group of groups) {
    const items = group.items.filter((item) => item.visible);
    if (!items.length) continue;
    const g = { ...group, items };
    const existing = g.anchor ? blocks.find((b) => b.anchor === g.anchor) : undefined;
    if (existing) existing.groups.push(g);
    else blocks.push({ key: g.anchor || g.id, anchor: g.anchor, groups: [g] });
  }
  return blocks;
}

export const blockItems = (block: PriceBlockData) => block.groups.flatMap((g) => g.items);

export const isMedicalBlock = (block: PriceBlockData) =>
  block.anchor === "advanced-recovery" || blockItems(block).some((i) => MEDICAL_ITEM_IDS.includes(i.id));

export type FromPrice = { label: string; unit: string };

/**
 * "From" price for a set of items: the lowest visible price, prefixed "From" when prices vary.
 * Null when nothing is visible; "On request" when no visible item has a price.
 */
export function fromPrice(items: readonly PriceItem[]): FromPrice | null {
  const visible = items.filter((i) => i.visible);
  if (!visible.length) return null;
  const priced = visible.filter((i): i is PriceItem & { price: Price } => i.price != null);
  if (!priced.length) return { label: formatPhp(null), unit: "" };
  const cheapest = priced.reduce((a, b) => (b.price.min < a.price.min ? b : a));
  const varies = priced.length > 1 || cheapest.price.max != null;
  const amount = formatPhp({ min: cheapest.price.min, max: null });
  return { label: varies ? `From ${amount}` : amount, unit: cheapest.unit };
}

/** "from ₱1,900" style chip value for At a glance ("" when there is no price, so the chip is dropped). */
export function fromChip(items: readonly PriceItem[]): string {
  const p = fromPrice(items);
  if (!p || !items.some((i) => i.visible && i.price)) return "";
  const label = p.label.replace(/^From /, "from ");
  return !p.unit ? label : p.unit.startsWith("/") ? `${label}${p.unit}` : `${label} ${p.unit}`;
}

/** Shared availability of a block's items, or null when they differ. */
export function blockAvailability(block: PriceBlockData): Availability | null {
  const values = [...new Set(blockItems(block).map((i) => i.availability))];
  return values.length === 1 ? values[0] : null;
}

export function audienceLabel(block: PriceBlockData): string {
  const set = new Set(block.groups.map((g) => g.audience));
  if (set.has("both") || (set.has("locals") && set.has("travellers"))) return "Locals & travelers";
  return set.has("locals") ? "Locals" : "Travelers";
}
