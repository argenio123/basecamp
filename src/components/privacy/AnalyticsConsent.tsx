"use client";

// Google Analytics behind an opt-in banner. Nothing from Google loads until the visitor presses "Accept"; the choice
// is kept for 6 months in the first-party bc_analytics_consent cookie (src/lib/consent.ts) and can be changed with
// the footer "Cookie settings" link. Everything happens in the browser, so pages stay static.
// Docs: 03-api-reference/02-components/script.md (afterInteractive scripts in Client Components).
import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { PRIVACY_PATH } from "@/data/legal";
import { clearAnalyticsCookies, CONSENT_EVENT, OPEN_COOKIE_SETTINGS_EVENT, readAnalyticsConsent, writeAnalyticsConsent, type AnalyticsChoice } from "@/lib/consent";
import "@/styles/consent.css";

type Snapshot = AnalyticsChoice | "unset" | "server";

const subscribe = (onChange: () => void) => {
  window.addEventListener(CONSENT_EVENT, onChange);
  return () => window.removeEventListener(CONSENT_EVENT, onChange);
};
const snapshot = (): Snapshot => readAnalyticsConsent() ?? "unset";
// During server rendering and hydration nothing is shown, so the static HTML is the same for every visitor.
const serverSnapshot = (): Snapshot => "server";

export default function AnalyticsConsent({ gaId }: { gaId: string }) {
  const choice = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const [reopened, setReopened] = useState(false);
  const titleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const open = () => setReopened(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, open);
  }, []);

  // gtag's documented opt-out flag: stops hits if GA was already loaded earlier in this visit and the visitor
  // then declines.
  useEffect(() => {
    if (choice === "server") return;
    (window as unknown as Record<string, unknown>)[`ga-disable-${gaId}`] = choice !== "granted";
  }, [choice, gaId]);

  // Opened from the footer: move focus to the banner so keyboard and screen-reader users land on it.
  useEffect(() => {
    if (reopened) titleRef.current?.focus();
  }, [reopened]);

  const decide = (next: AnalyticsChoice) => {
    writeAnalyticsConsent(next);
    if (next === "denied") clearAnalyticsCookies();
    setReopened(false);
  };

  const showBanner = choice === "unset" || (reopened && choice !== "server");

  return (
    <>
      {choice === "granted" && (
        <>
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(gaId)});`}
          </Script>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`} strategy="afterInteractive" />
        </>
      )}
      {showBanner && (
        <div className="cc-banner" role="region" aria-labelledby="cc-title" aria-describedby="cc-text">
          <p className="cc-title" id="cc-title" ref={titleRef} tabIndex={-1}>Analytics cookies</p>
          <p className="cc-text" id="cc-text">
            May we use Google Analytics cookies to count visits and see which pages help people? They stay off unless
            you accept. You can change this any time with &quot;Cookie settings&quot; in the footer.{" "}
            <Link href={`${PRIVACY_PATH}#cookies`}>Cookie details</Link>
          </p>
          {reopened && choice !== "unset" && (
            <p className="cc-current">Current choice: <strong>{choice === "granted" ? "accepted" : "declined"}</strong></p>
          )}
          <div className="cc-actions">
            <button type="button" className="cc-button" onClick={() => decide("denied")}>Decline</button>
            <button type="button" className="cc-button" onClick={() => decide("granted")}>Accept</button>
          </div>
        </div>
      )}
    </>
  );
}

/** Footer link that reopens the banner. Renders nothing when analytics isn't configured. */
export function CookieSettingsButton({ className }: { className?: string }) {
  if (!process.env.NEXT_PUBLIC_GA_ID) return null;
  return (
    <button type="button" className={className ?? "cc-settings-link"} onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}>
      Cookie settings
    </button>
  );
}
