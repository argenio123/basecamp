// Sanitized member activity derived from the existing lead store. Internal admin notes are never exposed.
import { listLeads } from "@/lib/leads/store";
import type { Lead } from "@/lib/leads/types";

export type MemberActivity = {
  id: string;
  category: "booking" | "membership" | "early-access" | "enquiry" | "updates";
  eyebrow: string;
  title: string;
  detail: string;
  status: "received" | "in-review" | "completed";
  statusLabel: string;
  createdAt: string;
  dateLabel: string;
};

const DATE = new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" });
const words = (value: string) => value.replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

function publicStatus(lead: Lead): Pick<MemberActivity, "status" | "statusLabel"> {
  if (lead.status === "closed") return { status: "completed", statusLabel: "Completed" };
  if (lead.status === "contacted") return { status: "in-review", statusLabel: "In review" };
  return { status: "received", statusLabel: "Received" };
}

// `own`: the member sent it while logged in. Anyone can send a request with any email, so free text (booking item,
// enquiry message) is only shown back for the member's own requests: a stranger can't plant a message in their history.
function describe(lead: Lead, own: boolean): Pick<MemberActivity, "category" | "eyebrow" | "title" | "detail"> {
  if (lead.kind === "booking") {
    const service = lead.booking?.service ? words(lead.booking.service) : "Session";
    const item = own && lead.booking?.item ? words(lead.booking.item) : "BaseCamp session";
    return { category: "booking", eyebrow: "Booking", title: `${service} request`, detail: item };
  }
  if (lead.kind === "enquiry") {
    const subject = lead.enquiryType ? words(lead.enquiryType) : "General";
    return { category: "enquiry", eyebrow: "Enquiry", title: `${subject} enquiry`, detail: (own && lead.message) || "Your request was sent to the BaseCamp team." };
  }
  if (lead.kind === "newsletter") {
    return { category: "updates", eyebrow: "Updates", title: "BaseCamp updates", detail: "Signed up for BaseCamp news and opening updates." };
  }
  const membership = Boolean(lead.tier) || lead.interests.some((interest) => interest.includes("membership") || interest.includes("pass") || interest.includes("drop-in"));
  if (membership) {
    const choice = lead.tier ? words(lead.tier) : lead.interests[0] ? words(lead.interests[0]) : "Membership";
    return { category: "membership", eyebrow: "Membership", title: "Membership / purchase request", detail: choice };
  }
  return { category: "early-access", eyebrow: "Early access", title: "Early access signup", detail: "Joined the priority list for rates, releases, and opening updates." };
}

export async function getMemberActivity(email: string, memberId: string): Promise<MemberActivity[]> {
  const key = email.trim().toLowerCase();
  const leads = (await listLeads()).filter((lead) => lead.email.trim().toLowerCase() === key);
  return leads.slice(0, 12).map((lead) => ({
    id: lead.id,
    ...describe(lead, lead.memberId === memberId),
    ...publicStatus(lead),
    createdAt: lead.createdAt,
    dateLabel: DATE.format(new Date(lead.createdAt)),
  }));
}
