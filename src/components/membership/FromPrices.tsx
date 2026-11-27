import type { ReactNode } from "react";
import { formatPhp } from "@/content/format";
import type { PriceGroup, PriceItem } from "@/content/types";
import { PAYABLE_GROUP_IDS } from "@/lib/payments/catalog";
import { payHref } from "@/lib/payments/types";
import { localHref, t } from "@/i18n/server";
import FromPricesGrid, { type FromPriceCard, type FromPriceGroup } from "./FromPricesGrid";
import { priceText } from "./localize";
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

// The English labels below are translated with t() where they are used (src/i18n/fil/phrases/membership.ts).

/** Which group a price block sits in (by its anchor). Unknown anchors go to Train. */
const GROUP_OF: Readonly<Record<string, string>> = {
  packs: "train", "day-passes": "train", "open-gym": "train", yoga: "train",
  "recovery-pricing": "recover", "advanced-recovery": "recover",
  "camps-pricing": "camps", corporate: "camps",
};
const ACTION_LABEL: Readonly<Record<string, string>> = {
  packs: "Get a Book",
  "day-passes": "Get a Book",
  "open-gym": "Get a Book",
  yoga: "Get a Book",
  "recovery-pricing": "Get a Book",
  "advanced-recovery": "Get a Book",
  "camps-pricing": "Get a Book",
  corporate: "Inquire",
};
const CONTACT_INTEREST: Readonly<Record<string, string>> = {
  yoga: "yoga",
  "recovery-pricing": "recovery",
  "advanced-recovery": "recovery",
  "camps-pricing": "training-camp",
  corporate: "corporate",
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
    const payableIds = new Set(block.groups.filter((group) => PAYABLE_GROUP_IDS.includes(group.id)).flatMap((group) => group.items.map((item) => item.id)));
    const canPay = (item: PriceItem) =>
      payableIds.has(item.id) && !!item.price && item.price.min > 0 && item.availability !== "planned";
    // Categories with something payable open a chooser of their items (each with its own checkout link);
    // the rest (e.g. corporate) go straight to the contact form.
    const href = blockItems(block).some(canPay) ? null : localHref(`/contact?interest=${CONTACT_INTEREST[block.anchor] ?? "membership-local"}`);
    return [{
      key: block.key, anchor: block.anchor, title: block.groups[0].title,
      href, ctaLabel: t(ACTION_LABEL[block.anchor] ?? "Get a Book"),
      audience: audienceKey(block), audienceText: t(audienceLabel(block)), availability: blockAvailability(block),
      price: priceText(price.label), unit: price.unit, group: GROUP_OF[block.anchor] ?? "train",
      note: isMedicalBlock(block) && disclaimer ? disclaimer : "",
      items: blockItems(block).map((item) => ({
        id: item.id, name: item.name, badge: item.badge, description: item.description, featured: item.featured,
        availability: item.availability, price: priceText(formatPhp(item.price)), unit: item.unit,
        href: canPay(item) ? payHref(item.id) : null,
      })),
    }];
  });
  if (!cards.length) return null;
  const grouped: FromPriceGroup[] = GROUPS.map((g) => ({ id: g.id, label: t(g.label), cards: cards.filter((c) => c.group === g.id) })).filter((g) => g.cards.length);

  return (
    <section id={id} className="section mb-from-section" aria-label={title}>
      <div className="shell">
        <FromPricesGrid groups={grouped} eyebrow={eyebrow} title={title} intro={intro} pinFirst={["advanced-recovery"]}
          labels={{ choose: t("Choose what to book"), soon: t("Coming soon"), close: t("Close") }} />
      </div>
      {children && <div className="shell">{children}</div>}
    </section>
  );
}
