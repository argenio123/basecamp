// Account deletion (RA 10173 Sec. 16(e), right to erasure or blocking). Server-only: goes through the stores.
import { randomUUID } from "node:crypto";
import { rewriteLeads } from "@/lib/leads/store";
import { deleteMemberProfile } from "@/lib/members/profile";
import { deleteMember, type Member } from "@/lib/members/store";
import { rewritePayments } from "@/lib/payments/store";
import { anonymiseLead, isAnonymisedLead, isStrippedPayment, stripPaymentContact } from "./anonymise";

export type EraseReport = { leadsAnonymised: number; paymentsStripped: number; memberDeleted: boolean };

/** True when a lead belongs to this member: sent while logged in, or sent with the account's email. */
export const leadBelongsTo = (member: Pick<Member, "id" | "email">) => {
  const email = member.email.trim().toLowerCase();
  return (lead: { memberId?: string; email: string }) => lead.memberId === member.id || lead.email.trim().toLowerCase() === email;
};

/**
 * Deletes the member record and profile, anonymises their requests (leads) and strips contact details from their
 * payment records, which are kept for tax and accounting. Each step is idempotent, so a failed run can be retried;
 * the member record goes last so the member can still log in and retry if an earlier step fails.
 */
export async function eraseMember(member: Member): Promise<EraseReport> {
  const mine = leadBelongsTo(member);
  const leadsAnonymised = await rewriteLeads((lead) => (mine(lead) && !isAnonymisedLead(lead) ? anonymiseLead(lead) : null));
  const memberRef = `deleted-${randomUUID()}`;
  const paymentsStripped = await rewritePayments((p) => (p.memberId === member.id && !isStrippedPayment(p) ? stripPaymentContact(p, memberRef) : null));
  await deleteMemberProfile(member.id);
  const memberDeleted = await deleteMember(member);
  // Counts only: no names, emails or ids in the logs.
  console.info(`[privacy] ${JSON.stringify({ action: "account.deleted", at: new Date().toISOString(), leadsAnonymised, paymentsStripped })}`);
  return { leadsAnonymised, paymentsStripped, memberDeleted };
}
