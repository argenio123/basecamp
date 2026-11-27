// Analytics consent (client-side only, so pages stay static). The choice lives in a first-party cookie the server
// never reads. Google Analytics loads only after "Accept" (see src/components/privacy/AnalyticsConsent.tsx).

export type AnalyticsChoice = "granted" | "denied";

export const CONSENT_COOKIE = "bc_analytics_consent";
/** How long the choice is remembered before we ask again (6 months). */
export const CONSENT_MAX_AGE_DAYS = 180;
/** Fired on window after the choice changes. */
export const CONSENT_EVENT = "bc:analytics-consent";
/** Fired on window by the footer "Cookie settings" link to reopen the banner. */
export const OPEN_COOKIE_SETTINGS_EVENT = "bc:cookie-settings";

/** Analytics is only set up when a GA id is configured (inlined at build time). */
export const analyticsConfigured = () => Boolean(process.env.NEXT_PUBLIC_GA_ID);

export function readAnalyticsConsent(): AnalyticsChoice | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie.split("; ").find((c) => c.startsWith(`${CONSENT_COOKIE}=`))?.slice(CONSENT_COOKIE.length + 1);
  return raw === "granted" || raw === "denied" ? raw : null;
}

export const hasAnalyticsConsent = () => readAnalyticsConsent() === "granted";

export function writeAnalyticsConsent(choice: AnalyticsChoice): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${choice}; Max-Age=${CONSENT_MAX_AGE_DAYS * 24 * 3600}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/** Removes Google Analytics cookies (_ga, _ga_*) after a visitor declines, on this host and its parent domains. */
export function clearAnalyticsCookies(): void {
  const names = document.cookie.split("; ").map((c) => c.split("=")[0]).filter((n) => n === "_ga" || n.startsWith("_ga_") || n === "_gid");
  const parts = window.location.hostname.split(".");
  const domains = [""];
  for (let i = 0; i < parts.length - 1; i++) domains.push(`; Domain=.${parts.slice(i).join(".")}`);
  for (const name of names) for (const domain of domains) document.cookie = `${name}=; Max-Age=0; Path=/${domain}`;
}
