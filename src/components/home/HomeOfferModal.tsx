"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import EarlyAccessLink from "@/components/members/EarlyAccessLink";
import AiImageLabel, { aiImageAlt, isAiGeneratedImage } from "@/components/ui/AiImageLabel";
import type { FoundingOffer } from "@/content/types";
import { useLocale } from "@/i18n/client";
import { UI } from "@/i18n/ui";
import { trapFocus } from "@/lib/focusTrap";
import { markOfferSeen, takeOfferVisit } from "@/lib/home-offer-visit";
import { LOGGED_OUT_KEY } from "@/lib/members/types";
import "./HomeOfferModal.css";

// Decided once per full page load (see src/lib/home-offer-visit.ts): null until the homepage first mounts in this
// document, true while the modal is due to open, false once it opened or isn't due. Client-side navigation back to the
// homepage reuses the decision, so the modal never re-opens without a reload (but a due offer that hasn't opened yet
// stays armed).
let offerDue: boolean | null = null;

const OFFER_PHOTO = "/images/membership/generated/offer-hyrox-skierg-canva.jpg";

// The offer waits until the visitor has engaged, so it never covers the hero on arrival. Whichever comes first:
const SCROLL_SHARE = 0.9; // scrolled past ~the first screen (the hero),
const VISIBLE_MS = 15_000; // 15 s with the tab visible (hidden time doesn't count),
const EXIT_INTENT_AFTER_MS = 3_000; // desktop only: pointer leaves through the top, once past the first few seconds.
// Retry delay when a trigger fires while the visitor is busy (menu open, typing, another overlay).
const RETRY_MS = 2_000;

/** Icon strip along the bottom of the ad (labels: src/i18n/ui.ts offer.strip, same order). */
const STRIP_ICONS = [
  { icon: "M13 4a2 2 0 1 1 0 .1M9 21l2-6 3 2v4M7 12l3-4 4 1 3 3M6 21l3-6" },
  { icon: "M3 10v4M6 8v8M18 8v8M21 10v4M6 12h12" },
  { icon: "M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" },
  { icon: "M12 4a3 3 0 1 1 0 6a3 3 0 1 1 0-6M5 9a2 2 0 1 1 0 4a2 2 0 1 1 0-4M19 9a2 2 0 1 1 0 4a2 2 0 1 1 0-4M7 20v-2a5 5 0 0 1 10 0v2M2 19v-1a3 3 0 0 1 3.5-3M22 19v-1a3 3 0 0 0-3.5-3" },
];

const NON_TEXT_INPUTS = new Set(["button", "submit", "reset", "checkbox", "radio", "range", "color", "file", "image"]);

/** True while opening the modal would interrupt the visitor. Read from the DOM so the nav components stay untouched. */
function visitorIsBusy() {
  if (document.visibilityState !== "visible") return true;
  // Mobile nav (<details open>) or a desktop mega-menu panel.
  if (document.querySelector("details.mobile-menu[open], .nv-panel[data-open='true']")) return true;
  // Another overlay (e.g. the social gallery, via lockPageScroll) already owns the page.
  if (document.documentElement.style.overflow === "hidden") return true;
  const active = document.activeElement;
  if (active instanceof HTMLTextAreaElement || active instanceof HTMLSelectElement) return true;
  if (active instanceof HTMLInputElement && !NON_TEXT_INPUTS.has(active.type)) return true;
  return active instanceof HTMLElement && active.isContentEditable;
}

export default function HomeOfferModal({ offer, fromPrice = null }: { offer: FoundingOffer; fromPrice?: number | null }) {
  const locale = useLocale();
  const ui = UI[locale].offer;
  const [open, setOpen] = useState(false);
  // The photo only mounts once the offer is due and the page has loaded: the closed modal sits in the viewport
  // (fixed, just invisible), so even a lazy image would otherwise download alongside the hero.
  const [primed, setPrimed] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  // Headline: the cheapest membership (amount first, then the currency). No price published yet: no headline (the
  // founding rate is a promotion, not a membership price, so it must not stand in under "Monthly memberships").
  const lowest = fromPrice ? fromPrice.toLocaleString("en-PH") : "";
  const closeModal = useCallback(() => {
    setOpen(false);
    window.dispatchEvent(new Event("basecamp:offer-modal-closed"));
  }, []);
  const completeOffer = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!offer.enabled) return;
    // Just logged out: skip the full modal and go straight to the small "Ready for BaseCamp?" prompt
    // (Header shows it on this event). Deferred a frame so Header's listener is attached.
    if (window.sessionStorage.getItem(LOGGED_OUT_KEY) === "true") {
      const frame = window.requestAnimationFrame(() => window.dispatchEvent(new Event("basecamp:offer-modal-closed")));
      return () => window.cancelAnimationFrame(frame);
    }
    if (offerDue === null) offerDue = takeOfferVisit();
    // Modal not due (already seen in this tab, or back on the homepage from another page): go straight to the
    // small prompt, which Header shows 3 seconds after this event.
    if (!offerDue) {
      const frame = window.requestAnimationFrame(() => window.dispatchEvent(new Event("basecamp:offer-modal-closed")));
      return () => window.cancelAnimationFrame(frame);
    }

    // Due: arm the engagement triggers. Everything below is torn down on open or unmount.
    const armedAt = performance.now();
    let done = false;
    let retryTimer: number | undefined;
    let visibleTimer: number | undefined;
    let visibleLeft = VISIBLE_MS;
    let visibleSince = 0;
    let primeTimer: number | undefined;
    let primeIdle: number | undefined;

    const tryOpen = () => {
      if (done) return;
      if (visitorIsBusy()) {
        // Not now: check again shortly rather than dropping the offer.
        if (retryTimer === undefined) retryTimer = window.setTimeout(() => { retryTimer = undefined; tryOpen(); }, RETRY_MS);
        return;
      }
      done = true;
      teardown();
      offerDue = false;
      markOfferSeen();
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setPrimed(true);
      setOpen(true);
    };

    const onScroll = () => { if (window.scrollY >= window.innerHeight * SCROLL_SHARE) tryOpen(); };

    // Only visible time counts towards the 15 s, so a background tab doesn't greet the visitor with a pop-up.
    const startVisibleClock = () => {
      if (visibleTimer !== undefined || document.visibilityState !== "visible") return;
      visibleSince = performance.now();
      visibleTimer = window.setTimeout(tryOpen, visibleLeft);
    };
    const stopVisibleClock = () => {
      if (visibleTimer === undefined) return;
      window.clearTimeout(visibleTimer);
      visibleTimer = undefined;
      visibleLeft = Math.max(0, visibleLeft - (performance.now() - visibleSince));
    };
    const onVisibility = () => (document.visibilityState === "visible" ? startVisibleClock() : stopVisibleClock());

    // Exit intent: the pointer leaves the document through the top edge (towards the tabs / address bar).
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onMouseOut = (event: MouseEvent) => {
      if (event.relatedTarget || event.clientY > 0) return;
      if (performance.now() - armedAt < EXIT_INTENT_AFTER_MS) return;
      tryOpen();
    };

    // Fetch the photo in the background once the hero has had the bandwidth, so the card is ready when it opens.
    const prime = () => {
      // Safari has no requestIdleCallback.
      if (typeof window.requestIdleCallback === "function") primeIdle = window.requestIdleCallback(() => setPrimed(true), { timeout: 3000 });
      else primeTimer = window.setTimeout(() => setPrimed(true), 1000);
    };
    if (document.readyState === "complete") prime();
    else window.addEventListener("load", prime, { once: true });

    function teardown() {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("load", prime);
      window.clearTimeout(retryTimer);
      window.clearTimeout(visibleTimer);
      window.clearTimeout(primeTimer);
      if (primeIdle !== undefined) window.cancelIdleCallback(primeIdle);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    if (finePointer) document.addEventListener("mouseout", onMouseOut);
    startVisibleClock();
    return () => { done = true; teardown(); };
  }, [offer.enabled]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = root.style.overflow;
    const previousOverscrollBehavior = document.body.style.overscrollBehavior;
    const previousRootOverscrollBehavior = root.style.overscrollBehavior;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
      trapFocus(event, dialogRef.current);
    };
    root.style.overflow = "hidden";
    root.style.overscrollBehavior = "none";
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.addEventListener("keydown", onKeyDown);
    // Runs after commit, so `inert` is already off and the close button can take focus.
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      root.style.overflow = previousRootOverflow;
      root.style.overscrollBehavior = previousRootOverscrollBehavior;
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscrollBehavior;
      document.removeEventListener("keydown", onKeyDown);
      // Hand focus back to wherever the visitor was when the offer interrupted them.
      const previous = returnFocusRef.current;
      returnFocusRef.current = null;
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, [closeModal, open]);

  if (!offer.enabled) return null;

  return (
    <div className="home-offer-modal" data-open={open ? "true" : "false"} aria-hidden={!open} inert={!open}>
      <button className="home-offer-backdrop" type="button" aria-label={ui.close} onClick={closeModal} />
      <section ref={dialogRef} className="home-offer-dialog home-offer-dialog--flyer" role="dialog" aria-modal="true" aria-labelledby={lowest ? "home-offer-title" : undefined} aria-label={lowest ? undefined : ui.dialog}>
        <button ref={closeRef} className="home-offer-close" type="button" aria-label={ui.close} onClick={closeModal}>&times;</button>

        {/* Flyer-style ad: the photo fills the whole card; slanted headline, perk blocks, and an icon strip on top. */}
        <figure className="home-offer-bg">
          {primed && (
            <Image
              src={OFFER_PHOTO}
              alt={aiImageAlt(ui.photoAlt, locale)}
              fill
              sizes="(max-width: 860px) 100vw, 1120px"
              className="home-offer-bg-image"
            />
          )}
        </figure>
        {isAiGeneratedImage(OFFER_PHOTO) && <AiImageLabel className="ai-label--offer" hidden />}

        <div className="home-offer-flyer">
          <Image src="/images/brand/basecamp-camsur-logo-white.png" alt="BaseCamp CamSur" width={150} height={150} className="home-offer-logo" />
          {lowest && (
            <>
              <p className="home-offer-kicker">{ui.kicker}</p>
              <h2 id="home-offer-title">{ui.asLowAs}<span className="home-offer-amount">{lowest} <small>PHP</small></span></h2>
            </>
          )}
          <p className="home-offer-ribbon">{ui.ribbon}</p>
          <ul className="home-offer-perks">
            {ui.perks.map((perk) => <li key={perk}>{perk}</li>)}
          </ul>
          <div className="home-offer-actions home-offer-cta">
          <div className="home-offer-buttons" onClick={completeOffer}>
            <EarlyAccessLink className="home-offer-primary">
              <span className="home-offer-primary-text"><b>{ui.cta}</b></span>
              <span className="home-offer-primary-arrow" aria-hidden="true">→</span>
            </EarlyAccessLink>
          </div>
          </div>
        </div>

        <ul className="home-offer-strip">
          {STRIP_ICONS.map((item, i) => <li key={item.icon}><svg viewBox="0 0 24 24" aria-hidden="true"><path d={item.icon} /></svg>{ui.strip[i]}</li>)}
        </ul>
      </section>
    </div>
  );
}
