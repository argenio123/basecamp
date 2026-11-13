"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import EarlyAccessLink from "@/components/members/EarlyAccessLink";
import MemberNavLink from "@/components/members/MemberNavLink";
import { formatDateLabel } from "@/content/format";
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
  const savingsAmount = Math.max(0, Number(prices.standard.replace(/,/g, "")) - Number(prices.founding.replace(/,/g, "")));
  const savings = savingsAmount.toLocaleString("en-PH");
  const annualSavings = (savingsAmount * 12).toLocaleString("en-PH");
  const standardAmount = Number(prices.standard.replace(/,/g, ""));
  const percentOff = standardAmount > 0 ? Math.round((savingsAmount / standardAmount) * 100) : 0;
  // Urgency only from real settings: the spots counter when it's switched on, the end date when one is set.
  const cap = Math.max(0, Math.floor(offer.cap));
  const remaining = cap - Math.min(cap, Math.max(0, Math.floor(offer.claimed)));
  const spotsLabel = offer.showCounter ? `${remaining} of ${cap} spots left` : `Only ${cap} founding spots`;
  const endsLabel = offer.expiresOn ? `Ends ${formatDateLabel(offer.expiresOn)}` : "";
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

        <header className="home-offer-hero">
          <div className="home-offer-head">
            <div className="home-offer-labels">
              <span className="home-offer-live"><i aria-hidden="true" />{spotsLabel}</span>
              {endsLabel && <span className="home-offer-ends">{endsLabel}</span>}
            </div>
            <p className="home-offer-kicker">Pre-opening price{percentOff > 0 && <> · {percentOff}% off</>}</p>
            <h2 id="home-offer-title">Pay PHP {prices.founding}.<span className="home-offer-not">Not <s>{prices.standard}</s>.</span></h2>
            <p className="home-offer-lead">Get in before the doors open and keep <strong>PHP {savings} in your pocket every month</strong>, plus first dibs on camps, workshops, and the launch event.</p>
            <div className="home-offer-hero-proof" aria-label={`Potential first-year savings: PHP ${annualSavings}`}>
              <strong>PHP {annualSavings}</strong>
              <span>back in your pocket in year one</span>
            </div>
          </div>
          <figure className="home-offer-media">
            <Image
              src="/images/membership/generated/founding-offer-ambassador-nano-banana-2-1.png"
              alt="A BaseCamp CamSur coach inviting visitors to become founding members"
              fill
              sizes="(max-width: 720px) 100vw, 42vw"
              className="home-offer-media-image"
            />
            {percentOff > 0 && <span className="home-offer-sticker" aria-hidden="true"><strong>-{percentOff}%</strong><small>Founding</small></span>}
            <figcaption><strong>Founding access</strong><span>Be one of the first {offer.cap}.</span></figcaption>
          </figure>
        </header>

        <div className="home-offer-body">
          <div className="home-offer-price">
            <div className="home-offer-price-head"><p>Your founding price</p>{percentOff > 0 && <em>Save {percentOff}%</em>}</div>
            <div><span>PHP</span><strong>{prices.founding}</strong><small>/month</small></div>
            <p className="home-offer-standard">Regular price <s>PHP {prices.standard}</s></p>
            {savings !== "0" && <p className="home-offer-saving">Keep PHP {savings} every month</p>}
          </div>

          <div className="home-offer-benefits">
            <p>What you unlock</p>
            <ul>
              {featuredBenefits.map((benefit) => <li key={benefit}><span aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m6 12 4 4 8-9" /></svg></span><strong>{benefit}</strong></li>)}
            </ul>
          </div>
        </div>

        <footer className="home-offer-actions">
          <div className="home-offer-buttons" onClick={completeOffer}>
            <EarlyAccessLink className="home-offer-primary">
              <span className="home-offer-primary-text"><b>Claim my founding spot</b><small>Lock PHP {prices.founding}/month before it&apos;s gone</small></span>
              <span className="home-offer-primary-arrow" aria-hidden="true">→</span>
            </EarlyAccessLink>
            <MemberNavLink className="home-offer-login" signedInHref="/membership" signedInLabel="View membership" />
          </div>
          <ul className="home-offer-trust">
            <li>No payment today</li>
            <li>1-minute application</li>
            <li>{spotsLabel}</li>
          </ul>
        </footer>
      </section>
    </div>
  );
}
