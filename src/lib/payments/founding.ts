// Founding-member rate at checkout (server-only). The offer comes from the editable settings: settings.founding.tierId
// (the membership it discounts) and settings.founding.price (whole pesos a month), checked by the same rule the admin
// save enforces (src/content/founding.ts: at least half the standard price and below it). No price is read from text.
// The standard price is the tier's price in the pricing content.
import { cacheLife, cacheTag } from "next/cache";
import { activeFoundingTerms } from "@/content/founding";
import type { FoundingOffer, SiteContent } from "@/content/types";
import { findPayable } from "./catalog";
import { FOUNDING_COUNT_TAG } from "./founding-cache";
import { countFoundingMembers, foundingAvailability, type FoundingAvailability } from "./founding-status";
import { listMemberPayments, listPayments } from "./store";

export type FoundingRate = { itemId: string; itemName: string; amount: number; standard: number };

/**
 * The founding rate (amounts in centavos) while the offer is on and its price passes the sanity rule against the
 * tier's listed price; otherwise null, so checkout charges the standard price.
 */
export function foundingRate(content: SiteContent): FoundingRate | null {
  const terms = activeFoundingTerms(content.settings.founding, content.pricing.groups);
  if (!terms) return null;
  const payable = findPayable(content, terms.tierId);
  if (!payable || payable.kind !== "membership") return null;
  const amount = Math.round(terms.founding * 100);
  if (amount <= 0 || amount >= payable.amount) return null;
  return { itemId: payable.item.id, itemName: payable.item.name, amount, standard: payable.amount };
}

const expired = (expiresOn: string, now: Date) => /^\d{4}-\d{2}-\d{2}$/.test(expiresOn) && now > new Date(`${expiresOn}T23:59:59+08:00`);

/**
 * Paid founding members (countFoundingMembers), cached for the public counter on static pages. The payment store
 * refreshes the tag when a founding payment is marked paid or refunded (founding-cache.ts); "hours" is a safety net.
 * Checkout never uses this cached number: it reads the payments fresh (foundingSpots).
 * Docs: 01-app/03-api-reference/01-directives/use-cache.md, 04-functions/cacheTag.md, cacheLife.md.
 */
export async function getFoundingCount(): Promise<number> {
  "use cache";
  cacheTag(FOUNDING_COUNT_TAG);
  try {
    const count = countFoundingMembers(await listPayments());
    cacheLife("hours");
    return count;
  } catch {
    cacheLife("minutes"); // storage outage: retry soon
    return 0;
  }
}

/** The public counter's numbers (cached count; for display only). */
export const getFoundingAvailability = async (offer: FoundingOffer): Promise<FoundingAvailability> => foundingAvailability(offer, await getFoundingCount());

/** Founding spots for checkout, from a fresh read of the payments (not the cached counter). */
export async function foundingSpots(content: SiteContent): Promise<FoundingAvailability> {
  return foundingAvailability(content.settings.founding, countFoundingMembers(await listPayments()));
}

export type FoundingCheck = { ok: true; rate: FoundingRate; returning: boolean } | { ok: false; message: string };

/**
 * Whether this member can pay this item at the founding rate. Someone who already paid at the founding rate keeps it
 * (the rate stays locked in); new founding members need the offer on, not expired, and a spot left.
 */
export async function foundingFor(content: SiteContent, memberId: string, itemId: string, now = new Date()): Promise<FoundingCheck> {
  const rate = foundingRate(content);
  if (!rate || rate.itemId !== itemId) return { ok: false, message: "The founding rate isn't available for this plan." };
  const returning = (await listMemberPayments(memberId)).some((p) => p.offer === "founding" && p.status === "paid" && p.itemId === itemId);
  if (returning) return { ok: true, rate, returning };
  if (expired(content.settings.founding.expiresOn, now)) return { ok: false, message: "The founding offer has ended." };
  // Cap reached (paid founding members, or the admin's "Spots taken" number): no new founding members.
  if ((await foundingSpots(content)).state === "full") return { ok: false, message: "Founding spots are full." };
  return { ok: true, rate, returning };
}
