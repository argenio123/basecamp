import type { ReactNode } from "react";
import { formatPhp } from "@/content/format";
import type { PriceGroup } from "@/content/types";
import FromPricesGrid, { type FromPriceCard, type FromPriceGroup } from "./FromPricesGrid";
import { audienceLabel, blockAvailability, blockItems, fromPrice, isMedicalBlock, toBlocks, type PriceBlockData } from "./pricing";

type FromPricesProps = {
  /** Every group except the tiers. */
  groups: readonly PriceGroup[];
  /** recovery.disclaimer, shown under categories with hyperbaric, cryotherapy or NAD+ (spec §0.11). */
  disclaimer?: string;
  id?: string;
  eyebrow?: string;
  title?: string;
  /** ≤2 sentences. */
  intro?: string;
  children?: ReactNode;
};

/** Which group a price block sits in (by its anchor). Unknown anchors go to Train. */
const GROUP_OF: Readonly<Record<string, string>> = {
  packs: "train", "day-passes": "train", "open-gym": "train", yoga: "train",
  "recovery-pricing": "recover", "advanced-recovery": "recover",
  "camps-pricing": "camps", corporate: "camps",
};
/** Contact-form interest each category's "Purchase" button pre-selects (values from INTEREST_OPTIONS). */
const PURCHASE_INTEREST: Readonly<Record<string, string>> = {
  packs: "membership-local", "day-passes": "drop-in", "open-gym": "drop-in", yoga: "yoga",
  "recovery-pricing": "recovery", "advanced-recovery": "recovery", "camps-pricing": "training-camp", corporate: "corporate",
};
const GROUPS = [
  { id: "train", label: "Train" },
  { id: "recover", label: "Recover" },
  { id: "camps", label: "Camps & teams" },
] as const;

function audienceKey(block: PriceBlockData): FromPriceCard["audience"] {
  const set = new Set(block.groups.map((g) => g.audience));
  if (set.has("both") || (set.has("locals") && set.has("travellers"))) return "both";
  return set.has("locals") ? "locals" : "travellers";
}

/**
 * Price guide: one board with every category (from price + Explore when it has its own page) and, under each,
 * every item with its full details. Server part: builds plain data for the animated client board.
 */
export default function FromPrices({ groups, disclaimer, id, eyebrow, title, intro, children }: FromPricesProps) {
  const cards = toBlocks(groups).flatMap((block): (FromPriceCard & { group: string })[] => {
    const price = fromPrice(blockItems(block));
    if (!price) return [];
    return [{
      key: block.key, anchor: block.anchor, title: block.groups[0].title,
      href: `/contact?interest=${PURCHASE_INTEREST[block.anchor] ?? "membership-local"}`,
      audience: audienceKey(block), audienceText: audienceLabel(block), availability: blockAvailability(block),
      price: price.label, unit: price.unit, group: GROUP_OF[block.anchor] ?? "train",
      note: isMedicalBlock(block) && disclaimer ? disclaimer : "",
      items: blockItems(block).map((item) => ({
        id: item.id, name: item.name, badge: item.badge, description: item.description, featured: item.featured,
        availability: item.availability, price: formatPhp(item.price), unit: item.unit,
      })),
    }];
  });
  if (!cards.length) return null;
  const grouped: FromPriceGroup[] = GROUPS.map((g) => ({ id: g.id, label: g.label, cards: cards.filter((c) => c.group === g.id) })).filter((g) => g.cards.length);

  return (
    <section id={id} className="section mb-from-section" aria-label={title}>
      <div className="shell">
        <FromPricesGrid groups={grouped} eyebrow={eyebrow} title={title} intro={intro} pinFirst={["advanced-recovery"]} />
      </div>
      {children && <div className="shell">{children}</div>}
    </section>
  );
}
