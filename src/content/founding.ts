// Founding offer terms (pure, client-safe): which membership the offer discounts and at what price.
// The offer is two explicit settings fields, settings.founding.tierId (a membership item id) and settings.founding.price
// (whole pesos a month). Nothing is ever read from display text. The standard price is the tier's listed price in the
// pricing content, as checkout charges it (src/lib/payments/catalog.ts). Used by checkout (src/lib/payments/founding.ts),
// every public founding/launch component, the admin editor preview and the server-side validator (validate.ts).
import type { FoundingOffer, PriceGroup, PriceItem, SiteContent } from "./types";

/** The price group whose items are monthly memberships (the only tiers the founding rate can apply to). */
export const MEMBERSHIP_GROUP_ID = "memberships";
/** Sanity floor: a founding price below half the standard price is treated as a typo (e.g. 3.15 or 315 for 3,150). */
export const FOUNDING_MIN_SHARE = 0.5;

const peso = (n: number) => n.toLocaleString("en-US");

/**
 * The membership the founding offer discounts: a visible, priced, purchasable item in the memberships group (the same
 * rules as checkout's findPayable), or null.
 */
export function foundingTierItem(groups: readonly PriceGroup[], tierId: string): (PriceItem & { price: { min: number } }) | null {
  if (!tierId) return null;
  const item = groups.find((g) => g.id === MEMBERSHIP_GROUP_ID)?.items.find((i) => i.id === tierId);
  if (!item || !item.visible || item.availability === "planned" || !item.price || !(item.price.min > 0)) return null;
  return item as PriceItem & { price: { min: number } };
}

/** Why `price` can't be the founding price against `standard` (both whole pesos), or null when it is fine. */
export function foundingPriceIssue(price: number, standard: number): string | null {
  if (!Number.isFinite(price) || !Number.isInteger(price) || price <= 0) return "Enter the founding price in whole pesos, e.g. 3150.";
  if (!(standard > 0)) return "The founding tier has no standard price.";
  if (price >= standard) return `The founding price must be lower than the standard price (Php ${peso(standard)}).`;
  const floor = Math.ceil(standard * FOUNDING_MIN_SHARE);
  if (price < floor) return `The founding price must be at least half the standard price: Php ${peso(floor)} or more (standard Php ${peso(standard)}).`;
  return null;
}

export type FoundingTerms = { tierId: string; tier: string; founding: number; standard: number };
/** On failure, `field` names the setting to fix (settings.founding.tierId or .price). */
export type FoundingTermsResult = ({ ok: true } & FoundingTerms) | { ok: false; field: "tierId" | "price"; reason: string };

/**
 * The founding offer's numbers from the explicit fields, or why they can't be used. Ignores `enabled`: callers decide
 * whether a switched-off offer matters (public pages and checkout treat it as no offer).
 */
export function foundingTerms(offer: Pick<FoundingOffer, "tierId" | "price">, groups: readonly PriceGroup[]): FoundingTermsResult {
  const item = foundingTierItem(groups, offer.tierId);
  if (!item) {
    return { ok: false, field: "tierId", reason: offer.tierId ? `“${offer.tierId}” isn't a visible, priced monthly membership in Pricing → Memberships.` : "Choose the membership tier the founding rate applies to." };
  }
  const issue = foundingPriceIssue(offer.price, item.price.min);
  if (issue) return { ok: false, field: "price", reason: issue };
  return { ok: true, tierId: item.id, tier: item.name, founding: offer.price, standard: item.price.min };
}

/** The founding terms while the offer is switched on and valid; otherwise null (no founding rate anywhere). */
export function activeFoundingTerms(offer: Pick<FoundingOffer, "enabled" | "tierId" | "price">, groups: readonly PriceGroup[]): FoundingTerms | null {
  if (!offer.enabled) return null;
  const terms = foundingTerms(offer, groups);
  return terms.ok ? { tierId: terms.tierId, tier: terms.tier, founding: terms.founding, standard: terms.standard } : null;
}

/**
 * Public content with the founding offer switched off when its terms are invalid (unknown or hidden tier, or a price
 * outside the sanity rule), so no page shows, counts down or links to an offer checkout would refuse. The admin reads
 * the stored values unchanged (readContentFresh) and sees why in its content review.
 */
export function withCheckedFounding(content: SiteContent): SiteContent {
  const offer = content.settings.founding;
  if (!offer.enabled || foundingTerms(offer, content.pricing.groups).ok) return content;
  return { ...content, settings: { ...content.settings, founding: { ...offer, enabled: false } } };
}
