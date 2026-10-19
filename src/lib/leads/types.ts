// Lead (form submission) types (spec §B.17). Client-safe.

export type LeadKind = "early-access" | "enquiry" | "booking" | "newsletter";
export type LeadStatus = "new" | "contacted" | "closed";
export type LeadBooking = { service: "class" | "appointment" | "camp" | "corporate"; item: string; preferredDate: string; preferredTime: string; addOns: string[]; partySize: number; waitlist: boolean };
export type Lead = {
  id: string; kind: LeadKind; createdAt: string; status: LeadStatus; notes: string;
  firstName: string; lastName: string; email: string; phone: string;
  persona: "" | "local" | "domestic" | "international"; tier: "" | "local-basic" | "athlete" | "premium" | "unsure";
  interests: string[]; enquiryType: "" | "general" | "corporate" | "partnership" | "camp-group" | "media";
  message: string; source: string;
  booking: null | LeadBooking;
};
export type LeadResult = { status: "idle" | "success" | "error"; message: string; fieldErrors?: Record<string, string> };

export const LEAD_KINDS: readonly LeadKind[] = ["early-access", "enquiry", "booking", "newsletter"];
export const LEAD_STATUSES: readonly LeadStatus[] = ["new", "contacted", "closed"];
export const INITIAL_LEAD_RESULT: LeadResult = { status: "idle", message: "" };
