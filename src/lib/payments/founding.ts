// Founding-member rate at checkout (server-only). The offer comes from the editable settings (settings.founding):
// its example line names the tier and both prices, e.g. "Athlete founding rate Php 3,150/month (standard Php 4,500)".
// The standard price is taken from the pricing content; only the founding price comes from the offer text.
import type { SiteContent } from "@/content/types";
import { findPayable } from "./catalog";
import { foundingItemId, parseFoundingExample } from "./founding-link";
import { listMemberPayments, listPayments } from "./store";

export type FoundingRate = { itemId: string; itemName: string; amount: number; standard: number };

/** The founding rate while the offer is on and cheaper than the tier's listed price; otherwise null. */
export function foundingRate(content: SiteContent): FoundingRate | null {
  const offer = content.settings.founding;
  if (!offer.enabled) return null;
  const parsed = parseFoundingExample(offer.example);
  if (!parsed) return null;
  const payable = findPayable(content, foundingItemId(offer.example));
  if (!payable || payable.kind !== "membership") return null;
  const amount = Math.round(parsed.founding * 100);
  if (amount <= 0 || amount >= payable.amount) return null;
  return { itemId: payable.item.id, itemName: payable.item.name, amount, standard: payable.amount };
}

const expired = (expiresOn: string, now: Date) => /^\d{4}-\d{2}-\d{2}$/.test(expiresOn) && now > new Date(`${expiresOn}T23:59:59+08:00`);

/** Founding spots: the cap from settings, minus the claimed count (or paid founding members, if more). */
export async function foundingSpots(content: SiteContent): Promise<{ cap: number; left: number }> {
  const cap = Math.max(0, Math.floor(content.settings.founding.cap));
  const paidMembers = new Set((await listPayments()).filter((p) => p.offer === "founding" && p.status === "paid" && !p.test).map((p) => p.memberId)).size;
  const taken = Math.max(Math.floor(content.settings.founding.claimed) || 0, paidMembers);
  return { cap, left: Math.max(0, cap - taken) };
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
  if ((await foundingSpots(content)).left <= 0) return { ok: false, message: "All founding spots have been taken." };
  return { ok: true, rate, returning };
}
