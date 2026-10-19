// Client-side conversion tracking. No-op unless gtag was loaded (NEXT_PUBLIC_GA_ID).
import type { LeadKind } from "@/lib/leads/types";

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

export function trackLead(kind: LeadKind): void {
  if (typeof window === "undefined") return;
  window.gtag?.("event", "generate_lead", { lead_kind: kind });
}
