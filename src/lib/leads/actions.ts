"use server";
// Public lead submission (spec §B.17).
// Docs: 03-api-reference/01-directives/use-server.md, 02-guides/forms.md, 04-functions/headers.md.
import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { clientIp, createLimiter } from "@/lib/rateLimit";
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

// Best-effort, per-instance rate limit: 8 submissions per 10 minutes per client IP (spoofable when
// self-hosted without a proxy), plus a global cap per instance that does not depend on the IP.
const WINDOW_MS = 10 * 60 * 1000;
const limiter = createLimiter({ windowMs: WINDOW_MS, perKey: 8, global: 120 });

export async function submitLead(_prev: LeadResult, formData: FormData): Promise<LeadResult> {
  const result = validateLead(formData);
  if (result.ok && result.honeypot) return { status: "success", message: SUCCESS[kindOf(formData)] };

  const ip = clientIp(await headers());
  const now = Date.now();
  if (limiter.blocked(ip, now)) return { status: "error", message: "Too many submissions. Please try again in a few minutes." };
  limiter.hit(ip, now);

  if (!result.ok) {
    const { form, ...fieldErrors } = result.fieldErrors;
    return { status: "error", message: form ?? "Please check the highlighted fields.", fieldErrors };
  }

  try {
    await addLead({ ...result.lead, id: randomUUID(), createdAt: new Date().toISOString(), status: "new", notes: "" });
  } catch {
    return { status: "error", message: STORE_ERROR };
  }
  return { status: "success", message: SUCCESS[result.lead.kind] };
}

function kindOf(formData: FormData): LeadKind {
  const kind = formData.get("kind");
  return kind === "early-access" || kind === "enquiry" || kind === "booking" ? kind : "newsletter";
}
