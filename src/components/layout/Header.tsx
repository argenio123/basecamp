"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import MegaMenu from "@/components/nav/MegaMenu";
import MobileNav from "@/components/nav/MobileNav";
import EarlyAccessLink from "@/components/members/EarlyAccessLink";
import MemberNavLink from "@/components/members/MemberNavLink";
import { useMemberHint } from "@/components/members/useMemberHint";
import ScrollTopLink from "@/components/ui/ScrollTopLink";
import { LOGIN_PATH, type SiteSection } from "@/content/sitemap";

/** `sections` comes from getSections(content programmes) in the root layout (src/content/sitemap.ts). */
type HeaderProps = { ctaLabel: string; sections: SiteSection[] };

export default function Header({ ctaLabel, sections }: HeaderProps) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const member = useMemberHint();
  // Pages that open with a full-bleed image hero (every section overview and sub-route, and the member log-in /
  // sign-up pages with their gym photo) get the transparent overlay header
  const hasHeroOverlay = isLandingPage || pathname === "/contact" || pathname === "/account/login" || pathname === "/account/signup" || sections.some((section) => pathname === section.href || pathname.startsWith(`${section.href}/`));
  const [hasScrolled, setHasScrolled] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [offerPromptReady, setOfferPromptReady] = useState(false);
  const [promptDismissed, setPromptDismissed] = useState(false);

  useEffect(() => {
    if (!hasHeroOverlay) return;

    const updateHeader = () => setHasScrolled(window.scrollY > 12);
    const frame = window.requestAnimationFrame(updateHeader);

    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateHeader);
    };
  }, [hasHeroOverlay, pathname]);

  useEffect(() => {
    if (!isLandingPage) return;
    let timer: number | undefined;
    const resetFrame = window.requestAnimationFrame(() => {
      setOfferPromptReady(false);
      setPromptDismissed(false);
    });
    const preparePrompt = () => {
      window.clearTimeout(timer);
      setOfferPromptReady(false);
      setPromptDismissed(false);
      // The small "Ready for BaseCamp?" prompt: 3 seconds after the offer modal closes or is skipped (HomeOfferModal).
      timer = window.setTimeout(() => setOfferPromptReady(true), 3000);
    };
    window.addEventListener("basecamp:offer-modal-closed", preparePrompt);
    return () => {
      window.cancelAnimationFrame(resetFrame);
      window.clearTimeout(timer);
      window.removeEventListener("basecamp:offer-modal-closed", preparePrompt);
    };
  }, [isLandingPage, pathname]);

  useEffect(() => {
    if (!isLandingPage) return;
    const footer = document.querySelector<HTMLElement>(".site-footer");
    if (!footer) return;

    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting), { threshold: 0.01 });
    observer.observe(footer);
    return () => observer.disconnect();
  }, [isLandingPage, pathname]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // An open mega-menu panel always gets the solid bar, even over the hero.
  const isSolid = !hasHeroOverlay || hasScrolled || isMenuOpen;

  // After all hooks: the admin and the sign-in page have their own chrome.
  if (pathname.startsWith("/admin") || pathname === LOGIN_PATH) return null;

  return (
    <>
      <header
        className={`site-header${hasHeroOverlay ? " site-header--home" : ""} ${isSolid ? "site-header--solid" : "site-header--transparent"}`}
      >
        <div className="header-shell">
        <ScrollTopLink
          href="/"
          className="brand header-brand"
          aria-label="BaseCamp CamSur home"
          onClick={(event) => {
            if (
              !isLandingPage ||
              event.button !== 0 ||
              event.metaKey ||
              event.ctrlKey ||
              event.shiftKey ||
              event.altKey
            ) {
              return;
            }

            event.preventDefault();
            window.scrollTo({ top: 0, left: 0, behavior: "auto" });
            window.requestAnimationFrame(() => {
              window.dispatchEvent(new Event("basecamp:reset-home-animations"));
            });
          }}
        >
          <Image
            src="/images/brand/basecamp-camsur-logo-white.png"
            alt=""
            width={1118}
            height={982}
            priority
            className="header-brand-logo"
          />
        </ScrollTopLink>
        <MegaMenu key={pathname} sections={sections} pathname={pathname} onOpenChange={setIsMenuOpen} />
        {(!isLandingPage || member) && (
          <div className="header-actions">
            {/* Same header on every page: navigation, logo and the account icon only (no "Get early access" button). */}
            <MemberNavLink className="button button-small header-login" />
          </div>
        )}
          <MobileNav sections={sections} />
        </div>
      </header>
      {isLandingPage && !member && offerPromptReady && !promptDismissed && (
        <aside className="home-scroll-prompt" data-visible={footerVisible ? "false" : "true"} aria-hidden={footerVisible} inert={footerVisible} aria-label="BaseCamp member access">
          <button className="home-scroll-prompt-close" type="button" aria-label="Dismiss access prompt" onClick={() => setPromptDismissed(true)}>&times;</button>
          <p>Ready for BaseCamp?</p>
          <strong>Get priority access or continue to your member account.</strong>
          <div>
            <EarlyAccessLink className="home-scroll-prompt-primary">{ctaLabel}</EarlyAccessLink>
            <MemberNavLink className="home-scroll-prompt-login" />
          </div>
        </aside>
      )}
    </>
  );
}
