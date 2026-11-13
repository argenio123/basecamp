"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import EarlyAccessLink from "@/components/members/EarlyAccessLink";
import MemberNavLink from "@/components/members/MemberNavLink";
import type { FoundingOffer } from "@/content/types";
import { takeOfferVisit } from "@/lib/home-offer-visit";
import { LOGGED_OUT_KEY } from "@/lib/members/types";
import "./HomeOfferModal.css";

// Decided once per full page load (see src/lib/home-offer-visit.ts): null until the homepage first mounts in this
// document, true while the modal is due to open, false once it opened or isn't due. Client-side navigation back to the
// homepage reuses the decision, so the modal never re-opens without a reload.
let offerDue: boolean | null = null;

function offerPrices(example: string) {
  const prices = [...example.matchAll(/Php\s*([\d,]+)/gi)].map((match) => match[1]);
  return { founding: prices[0] || "3,200", standard: prices[1] || "4,500" };
}

export default function HomeOfferModal({ offer }: { offer: FoundingOffer }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const prices = offerPrices(offer.example);
  const savings = Math.max(0, Number(prices.standard.replace(/,/g, "")) - Number(prices.founding.replace(/,/g, ""))).toLocaleString("en-PH");
  const featuredBenefits = offer.benefits.length > 1 ? offer.benefits.slice(1, 4) : offer.benefits.slice(0, 3);
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
      <section className="home-offer-dialog" role="dialog" aria-modal="true" aria-labelledby="home-offer-title">
        <button ref={closeRef} className="home-offer-close" type="button" aria-label="Close founding offer" onClick={closeModal}>&times;</button>

        <header className="home-offer-head">
          <div className="home-offer-labels">
            <span>Founding membership · {offer.cap} spots</span>
          </div>
          <h2 id="home-offer-title">Ready for BaseCamp?</h2>
          <p>Join early, save PHP {savings} monthly, and get priority access before opening.</p>
        </header>

        <div className="home-offer-body">
          <div className="home-offer-price">
            <div className="home-offer-price-head"><p>Founding rate</p></div>
            <div><span>PHP</span><strong>{prices.founding}</strong><small>/month</small></div>
            <p className="home-offer-standard">Standard rate <s>PHP {prices.standard}</s></p>
            {savings !== "0" && <p className="home-offer-saving">You save PHP {savings}/month</p>}
          </div>

          <div className="home-offer-benefits">
            <p>Founding member benefits</p>
            <ul>
              {featuredBenefits.map((benefit) => <li key={benefit}><span aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m6 12 4 4 8-9" /></svg></span><strong>{benefit}</strong></li>)}
            </ul>
          </div>
        </div>

        <footer className="home-offer-actions">
          <div className="home-offer-buttons" onClick={completeOffer}><EarlyAccessLink className="home-offer-primary">Get early access</EarlyAccessLink><MemberNavLink className="home-offer-login" signedInHref="/membership" signedInLabel="Check out for more" /></div>
        </footer>
      </section>
    </div>
  );
}
