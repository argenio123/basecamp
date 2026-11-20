// What can be paid for online, priced from the pricing content on the server (never from the browser).
import type { PriceGroup, PriceItem, SiteContent } from "@/content/types";
import type { PaymentKind } from "./types";

/** Groups sold online, and what kind of purchase each is. Corporate bookings stay quote-only. */
const GROUP_KIND: Record<string, PaymentKind> = {
  memberships: "membership",
  "class-packs": "pass",
  "day-passes": "pass",
  "open-gym": "pass",
  yoga: "pass",
  recovery: "recovery",
  "advanced-recovery": "recovery",
  optimisation: "recovery",
  camps: "camp",
};

export type Payable = {
  item: PriceItem;
  group: PriceGroup;
  kind: PaymentKind;
  /** Amount in centavos. */
  amount: number;
  /** Price is a range: the starting price is charged as a deposit. */
  deposit: boolean;
};

/** The payable item for an id, or null when it doesn't exist, is hidden or planned, has no price, or isn't sold online. */
export function findPayable(content: SiteContent, itemId: string): Payable | null {
  for (const group of content.pricing.groups) {
    const kind = GROUP_KIND[group.id];
    if (!kind) continue;
    const item = group.items.find((i) => i.id === itemId);
    // "Planned" services aren't committed yet, so they can't be paid for (at-launch and phase-2 items can).
    if (!item || !item.visible || item.availability === "planned" || !item.price || !(item.price.min > 0)) continue;
    return { item, group, kind, amount: Math.round(item.price.min * 100), deposit: item.price.max != null };
  }
  return null;
}

/** Whether an item id can be paid online (used to show or hide "Buy" / "Pay" links). */
export const isPayable = (content: SiteContent, itemId: string) => findPayable(content, itemId) !== null;

/** Group ids whose rows get a "Buy" link (client-safe list for price tables). */
export const PAYABLE_GROUP_IDS = Object.keys(GROUP_KIND);
