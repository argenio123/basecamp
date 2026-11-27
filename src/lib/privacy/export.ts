// "Download my data" (RA 10173 Sec. 16(c) right of access, Sec. 18 data portability). Server-only.
import { SITE_NAME, PRIVACY_EMAIL } from "@/data/brand";
import { listMemberBookings } from "@/lib/bookings/store";
import type { Booking } from "@/lib/bookings/types";
import { listLeads } from "@/lib/leads/store";
import type { Lead } from "@/lib/leads/types";
import { getMemberProfile } from "@/lib/members/profile";
import { toPublic, type Member } from "@/lib/members/store";
import { listMemberPayments } from "@/lib/payments/store";
import { leadBelongsTo } from "./erase";

/**
 * A request in the export. Staff notes are left out (they are available on request by email). As in the account
 * history, free text is only included for requests the member sent while logged in: anyone can type any email
 * into a public form, so a stranger's message isn't handed to the account holder.
 */
function exportLead(lead: Lead, memberId: string) {
  const own = lead.memberId === memberId;
  const copy: Partial<Lead> = { ...lead };
  delete copy.notes;
  delete copy.memberId;
  return {
    ...copy,
    sentWhileLoggedIn: own,
    message: own ? lead.message : lead.message ? "(not included: sent without logging in)" : "",
    booking: lead.booking ? { ...lead.booking, item: own ? lead.booking.item : "" } : null,
  };
}

/** A class booking in the export: the member's own record, without the staff-only note and capacity flag. */
function exportBooking(b: Booking) {
  return {
    id: b.id, session: b.title, time: b.time, date: b.date, startAt: b.startAt, status: b.status, via: b.via,
    ...(b.membership ? { membership: b.membership } : {}), amountCentavos: b.amount, ...(b.paymentId ? { paymentId: b.paymentId } : {}),
    name: b.name, email: b.email, createdAt: b.createdAt,
    ...(b.holdExpiresAt ? { holdExpiresAt: b.holdExpiresAt } : {}), ...(b.confirmedAt ? { confirmedAt: b.confirmedAt } : {}),
    ...(b.cancelledAt ? { cancelledAt: b.cancelledAt, cancelledBy: b.cancelledBy } : {}),
  };
}

export async function collectMemberData(member: Member) {
  const account = toPublic(member);
  const [profile, leads, payments, bookings] = await Promise.all([getMemberProfile(account), listLeads(), listMemberPayments(member.id), listMemberBookings(member.id)]);
  const mine = leadBelongsTo(member);
  return {
    exportedAt: new Date().toISOString(),
    controller: SITE_NAME,
    about: `A copy of the personal data ${SITE_NAME} holds in your member account. For anything else (for example staff notes on your requests), email ${PRIVACY_EMAIL}.`,
    account,
    profile,
    requests: leads.filter(mine).map((lead) => exportLead(lead, member.id)),
    payments,
    // Status as it stands now: an unpaid hold that ran out reads "expired".
    classBookings: bookings.map(exportBooking),
  };
}
