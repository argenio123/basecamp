// Account deletion (RA 10173 Sec. 16(e), right to erasure or blocking). Server-only: goes through the stores.
import { randomUUID } from "node:crypto";
import { cancelBooking } from "@/lib/bookings/service";
import { listMemberBookings, rewriteBookings } from "@/lib/bookings/store";
import { isActive } from "@/lib/bookings/types";
import { rewriteLeads } from "@/lib/leads/store";
import { deleteMemberProfile } from "@/lib/members/profile";
import { deleteMember, type Member } from "@/lib/members/store";
import { rewritePayments } from "@/lib/payments/store";
import { anonymiseBooking, anonymiseLead, isAnonymisedLead, isStrippedPayment, stripPaymentContact } from "./anonymise";

export type EraseReport = { leadsAnonymised: number; paymentsStripped: number; bookingsCancelled: number; bookingsAnonymised: number; memberDeleted: boolean };

/** True when a lead belongs to this member: sent while logged in, or sent with the account's email. */
export const leadBelongsTo = (member: Pick<Member, "id" | "email">) => {
  const email = member.email.trim().toLowerCase();
  return (lead: { memberId?: string; email: string }) => lead.memberId === member.id || lead.email.trim().toLowerCase() === email;
};

/**
 * Class bookings: upcoming ones (held or confirmed, session not started) are cancelled the same way as a member
 * cancellation, which frees the spot (paid ones get the staff refund note); then every booking of the member, past
 * and just cancelled, is anonymised with `memberRef`, keeping session, date and status for attendance statistics.
 * Throws when a booking became live again meanwhile (e.g. a late payment), so the member record isn't deleted and
 * the member can retry.
 */
async function eraseBookings(memberId: string, memberRef: string): Promise<{ bookingsCancelled: number; bookingsAnonymised: number }> {
  const now = Date.now();
  let bookingsCancelled = 0;
  for (const b of await listMemberBookings(memberId, now)) {
    if (!isActive(b, now) || Date.parse(b.startAt) <= now) continue;
    if (await cancelBooking(b.id, "member", now)) bookingsCancelled++;
  }
  const { rewritten: bookingsAnonymised } = await rewriteBookings((b) => (b.memberId === memberId ? anonymiseBooking(b, memberRef) : null), Date.now());
  if ((await listMemberBookings(memberId)).length) throw new Error("A booking changed during account deletion; retry.");
  return { bookingsCancelled, bookingsAnonymised };
}

/**
 * Deletes the member record and profile, anonymises their requests (leads) and class bookings (upcoming bookings
 * are cancelled first, freeing the spots) and strips contact details from their payment records, which are kept for
 * tax and accounting. Each step is idempotent, so a failed run can be retried; the member record goes last so the
 * member can still log in and retry if an earlier step fails.
 */
export async function eraseMember(member: Member): Promise<EraseReport> {
  const mine = leadBelongsTo(member);
  const leadsAnonymised = await rewriteLeads((lead) => (mine(lead) && !isAnonymisedLead(lead) ? anonymiseLead(lead) : null));
  // One random value per deleted account, shared by the kept payment records and bookings.
  const memberRef = `deleted-${randomUUID()}`;
  const { bookingsCancelled, bookingsAnonymised } = await eraseBookings(member.id, memberRef);
  const paymentsStripped = await rewritePayments((p) => (p.memberId === member.id && !isStrippedPayment(p) ? stripPaymentContact(p, memberRef) : null));
  await deleteMemberProfile(member.id);
  const memberDeleted = await deleteMember(member);
  // Counts only: no names, emails or ids in the logs.
  console.info(`[privacy] ${JSON.stringify({ action: "account.deleted", at: new Date().toISOString(), leadsAnonymised, bookingsCancelled, bookingsAnonymised, paymentsStripped })}`);
  return { leadsAnonymised, paymentsStripped, bookingsCancelled, bookingsAnonymised, memberDeleted };
}
