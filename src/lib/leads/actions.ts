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
import { leadMessages, validateLead } from "./validate";

// Messages: src/i18n/ui.ts `leads`, in the language of the form's hidden `locale` field (validate.ts leadMessages).

// Rate limit shared across instances via Redis (per-instance when Redis is absent or down): 8 submissions per
// 10 minutes per client IP (spoofable when self-hosted without a proxy), plus a global cap that does not depend on the IP.
const WINDOW_MS = 10 * 60 * 1000;
const limiter = createSharedLimiter({ name: "leads", windowMs: WINDOW_MS, perKey: 8, global: 300 });

export async function submitLead(_prev: LeadResult, formData: FormData): Promise<LeadResult> {
  // Public: requests, inquiries, bookings and sign-ups need no account (only checkout does). Spam is held back by
  // the honeypot field and the rate limit below.
  const m = leadMessages(formData);
  const result = validateLead(formData);
  if (result.ok && result.honeypot) return { status: "success", message: m.success[kindOf(formData)] };

  const ip = clientIp(await headers());
  if (await limiter.take(ip)) return { status: "error", message: m.tooMany };

  if (!result.ok) {
    const { form, ...fieldErrors } = result.fieldErrors;
    return { status: "error", message: form ?? m.checkFields, fieldErrors };
  }

  try {
    // Requests are public, but a logged-in sender is recorded so their account history can trust the free text.
    const memberId = await currentMemberId();
    await addLead({ ...result.lead, ...(memberId ? { memberId } : {}), id: randomUUID(), createdAt: new Date().toISOString(), status: "new", notes: "" });
  } catch {
    return { status: "error", message: m.storeError };
  }
  return { status: "success", message: m.success[result.lead.kind] };
}

function kindOf(formData: FormData): LeadKind {
  const kind = formData.get("kind");
  return kind === "early-access" || kind === "enquiry" || kind === "booking" ? kind : "newsletter";
}
