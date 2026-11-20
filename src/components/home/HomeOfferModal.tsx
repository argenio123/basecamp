"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import EarlyAccessLink from "@/components/members/EarlyAccessLink";
import type { FoundingOffer } from "@/content/types";
import { takeOfferVisit } from "@/lib/home-offer-visit";
import { LOGGED_OUT_KEY } from "@/lib/members/types";
import "./HomeOfferModal.css";

// Decided once per full page load (see src/lib/home-offer-visit.ts): null until the homepage first mounts in this
// document, true while the modal is due to open, false once it opened or isn't due. Client-side navigation back to the
// homepage reuses the decision, so the modal never re-opens without a reload.
let offerDue: boolean | null = null;

const OFFER_PHOTO = "/images/membership/generated/offer-hyrox-skierg-canva.jpg";

/** Icon strip along the bottom of the ad. */
const STRIP = [
  { label: "Build endurance", icon: "M13 4a2 2 0 1 1 0 .1M9 21l2-6 3 2v4M7 12l3-4 4 1 3 3M6 21l3-6" },
  { label: "Increase strength", icon: "M3 10v4M6 8v8M18 8v8M21 10v4M6 12h12" },
  { label: "Recover better", icon: "M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" },
  { label: "Join the community", icon: "M12 4a3 3 0 1 1 0 6a3 3 0 1 1 0-6M5 9a2 2 0 1 1 0 4a2 2 0 1 1 0-4M19 9a2 2 0 1 1 0 4a2 2 0 1 1 0-4M7 20v-2a5 5 0 0 1 10 0v2M2 19v-1a3 3 0 0 1 3.5-3M22 19v-1a3 3 0 0 0-3.5-3" },
];

function offerPrices(example: string) {
  const prices = [...example.matchAll(/Php\s*([\d,]+)/gi)].map((match) => match[1]);
  return { founding: prices[0] || "3,200", standard: prices[1] || "4,500" };
}

export default function HomeOfferModal({ offer, fromPrice = null }: { offer: FoundingOffer; fromPrice?: number | null }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const prices = offerPrices(offer.example);
  // Headline: the cheapest membership (amount first, then the currency); falls back to the founding price.
  const lowest = fromPrice ? fromPrice.toLocaleString("en-PH") : prices.founding;
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
    const frame = window.requestAnimationFrame(() => {
      offerDue = false;
      setOpen(true);
      closeRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [offer.enabled]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = root.style.overflow;
    const previousOverscrollBehavior = document.body.style.overscrollBehavior;
    const previousRootOverscrollBehavior = root.style.overscrollBehavior;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    root.style.overflow = "hidden";
    root.style.overscrollBehavior = "none";
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      root.style.overflow = previousRootOverflow;
      root.style.overscrollBehavior = previousRootOverscrollBehavior;
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscrollBehavior;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [closeModal, open]);

  if (!offer.enabled) return null;

  return (
    <div className="home-offer-modal" data-open={open ? "true" : "false"} aria-hidden={!open} inert={!open}>
      <button className="home-offer-backdrop" type="button" aria-label="Close founding offer" onClick={closeModal} />
      <section className="home-offer-dialog home-offer-dialog--flyer" role="dialog" aria-modal="true" aria-labelledby="home-offer-title">
        <button ref={closeRef} className="home-offer-close" type="button" aria-label="Close founding offer" onClick={closeModal}>&times;</button>

        {/* Flyer-style ad: the photo fills the whole card; slanted headline, perk blocks, and an icon strip on top. */}
        <figure className="home-offer-bg">
          <Image
            src={OFFER_PHOTO}
            alt="An athlete pulling SkiErg-style cable handles in the glass-walled BaseCamp CamSur training hall"
            fill
            sizes="(max-width: 860px) 100vw, 1120px"
            className="home-offer-bg-image"
          />
        </figure>

        <div className="home-offer-flyer">
          <Image src="/images/brand/basecamp-camsur-logo-white.png" alt="BaseCamp CamSur" width={150} height={150} className="home-offer-logo" />
          <p className="home-offer-kicker">Monthly memberships</p>
          <h2 id="home-offer-title">As low as<span className="home-offer-amount">{lowest} <small>PHP</small></span></h2>
          <p className="home-offer-ribbon">Unlimited open gym. Then step up:</p>
          <ul className="home-offer-perks">
            <li>Coached classes</li>
            <li>Recovery credits</li>
            <li>Priority booking</li>
          </ul>
          <div className="home-offer-actions home-offer-cta">
          <div className="home-offer-buttons" onClick={completeOffer}>
            <EarlyAccessLink className="home-offer-primary">
              <span className="home-offer-primary-text"><b>Get it now</b></span>
              <span className="home-offer-primary-arrow" aria-hidden="true">→</span>
            </EarlyAccessLink>
          </div>
          </div>
        </div>

        <ul className="home-offer-strip">
          {STRIP.map((item) => <li key={item.label}><svg viewBox="0 0 24 24" aria-hidden="true"><path d={item.icon} /></svg>{item.label}</li>)}
        </ul>
      </section>
    </div>
  );
}
