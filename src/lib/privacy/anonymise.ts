// Pure anonymisation rules shared by account deletion and the retention clean-up. No storage, no Next imports.
// What is kept is only what the business needs for counts, dates and (for payments) tax and accounting records.
import type { Booking } from "@/lib/bookings/types";
import type { Lead } from "@/lib/leads/types";
import type { Payment } from "@/lib/payments/types";

/** Placeholder written over removed personal data. */
export const DELETED = "[deleted]";

const blank = (value: string) => (value ? DELETED : "");

export const isAnonymisedLead = (lead: Lead) => lead.email === DELETED;

/**
 * Removes the person from a lead: name, email, phone, message, the free-text booking item and staff notes.
 * Keeps the kind, dates, status and the non-identifying choices (tier, interests, service, party size) so lead
 * counts and demand statistics still add up.
 */
export function anonymiseLead(lead: Lead): Lead {
  const copy: Lead = {
    ...lead,
    firstName: DELETED,
    lastName: blank(lead.lastName),
    email: DELETED,
    phone: blank(lead.phone),
    message: blank(lead.message),
    notes: "",
    booking: lead.booking ? { ...lead.booking, item: blank(lead.booking.item) } : null,
  };
  delete copy.memberId;
  return copy;
}

export const isStrippedPayment = (payment: Payment) => payment.email === DELETED;

/**
 * Strips contact details from a payment record but keeps what tax and accounting rules need: item, amount,
 * discount, status, method, provider reference and dates. `memberRef` replaces the member id: one random value per
 * deleted account, so "paid founding members" still counts that person once but the record can't be linked back.
 */
export function stripPaymentContact(payment: Payment, memberRef: string): Payment {
  const copy: Payment = { ...payment, memberId: memberRef, email: DELETED, name: DELETED };
  delete copy.checkoutUrl;
  return copy;
}

export const isAnonymisedBooking = (booking: Booking) => booking.email === DELETED;

/**
 * Removes the member from a class booking: name and email are replaced and `memberRef` replaces the member id (the
 * same random value as their payment records on account deletion, "[deleted]" in the retention clean-up). The
 * session, date, times, status, amount and payment link stay, so attendance and capacity statistics still add up.
 */
export function anonymiseBooking(booking: Booking, memberRef: string): Booking {
  return { ...booking, memberId: memberRef, name: DELETED, email: DELETED };
}
