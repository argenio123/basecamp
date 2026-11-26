"use server";
// Public lead submission (spec §B.17).
// Docs: 03-api-reference/01-directives/use-server.md, 02-guides/forms.md, 04-functions/headers.md.
import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { currentMemberId } from "@/lib/members/session";
import { clientIp } from "@/lib/rateLimit";
import { createSharedLimiter } from "@/lib/sharedLimiter";
import { addLead } from "./store";
import type { LeadKind, LeadResult } from "./types";
import { validateLead } from "./validate";

const SUCCESS: Record<LeadKind, string> = {
  "early-access": "You're on the early access list. We'll be in touch with early-member rates and opening updates.",
  booking: "Request received. We'll confirm availability by email or phone.",
  enquiry: "Thanks, your inquiry is in. We'll reply by email.",
  newsletter: "You're on the list.",
};
const STORE_ERROR = "We couldn't save your details just now. Please email basecampcamsur@gmail.com.";

// Rate limit shared across instances via Redis (per-instance when Redis is absent or down): 8 submissions per
// 10 minutes per client IP (spoofable when self-hosted without a proxy), plus a global cap that does not depend on the IP.
const WINDOW_MS = 10 * 60 * 1000;
const limiter = createSharedLimiter({ name: "leads", windowMs: WINDOW_MS, perKey: 8, global: 300 });

export async function submitLead(_prev: LeadResult, formData: FormData): Promise<LeadResult> {
  // Public: requests, inquiries, bookings and sign-ups need no account (only checkout does). Spam is held back by
  // the honeypot field and the rate limit below.
  const result = validateLead(formData);
  if (result.ok && result.honeypot) return { status: "success", message: SUCCESS[kindOf(formData)] };

  const ip = clientIp(await headers());
  if (await limiter.take(ip)) return { status: "error", message: "Too many submissions. Please try again in a few minutes." };

  if (!result.ok) {
    const { form, ...fieldErrors } = result.fieldErrors;
    return { status: "error", message: form ?? "Please check the highlighted fields.", fieldErrors };
  }

  try {
    // Requests are public, but a logged-in sender is recorded so their account history can trust the free text.
    const memberId = await currentMemberId();
    await addLead({ ...result.lead, ...(memberId ? { memberId } : {}), id: randomUUID(), createdAt: new Date().toISOString(), status: "new", notes: "" });
  } catch {
    return { status: "error", message: STORE_ERROR };
  }
  return { status: "success", message: SUCCESS[result.lead.kind] };
}

function kindOf(formData: FormData): LeadKind {
  const kind = formData.get("kind");
  return kind === "early-access" || kind === "enquiry" || kind === "booking" ? kind : "newsletter";
}
