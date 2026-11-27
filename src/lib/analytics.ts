// Client-side conversion tracking. No-op unless the visitor accepted analytics and gtag was loaded (NEXT_PUBLIC_GA_ID).
import { hasAnalyticsConsent } from "@/lib/consent";
import type { LeadKind } from "@/lib/leads/types";

declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}

export function trackLead(kind: LeadKind): void {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return;
  window.gtag?.("event", "generate_lead", { lead_kind: kind });
}
