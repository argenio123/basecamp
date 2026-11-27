// Founding spots (pure, safe anywhere): how many of the capped founding spots are taken, and how to describe that.
import type { FoundingOffer } from "@/content/types";
import type { Payment } from "./types";

/** Share of the cap from which the counter adds "Only N left". */
export const FOUNDING_LOW_SHARE = 0.8;

/**
 * "unstarted": nothing taken yet ("Be one of the first 100"); "open": spots taken, plenty left; "low": 80%+ taken
 * ("Only N left"); "full": the cap is reached (the founding rate is no longer sold).
 */
export type FoundingState = "unstarted" | "open" | "low" | "full";
export type FoundingAvailability = { cap: number; taken: number; left: number; state: FoundingState };

/**
 * Founding members counted from payments: distinct members with a paid, real-money payment at the founding rate.
 * Pending, cancelled, expired, failed and refunded payments don't count, and a member's renewals count once.
 */
export function countFoundingMembers(payments: readonly Payment[]): number {
  return new Set(payments.filter((p) => p.offer === "founding" && p.status === "paid" && !p.test).map((p) => p.memberId)).size;
}

/**
 * Spots taken = the larger of the paid founding members and the admin's "Spots taken" number (settings.founding.claimed,
 * for members who joined offline), never more than the cap.
 */
export function foundingAvailability(offer: Pick<FoundingOffer, "cap" | "claimed">, paidMembers: number): FoundingAvailability {
  const cap = Math.max(0, Math.floor(offer.cap) || 0);
  const taken = Math.min(cap, Math.max(0, Math.floor(offer.claimed) || 0, Math.floor(paidMembers) || 0));
  const left = cap - taken;
  const state: FoundingState = left <= 0 ? "full" : taken === 0 ? "unstarted" : taken >= cap * FOUNDING_LOW_SHARE ? "low" : "open";
  return { cap, taken, left, state };
}
