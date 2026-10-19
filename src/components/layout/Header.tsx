"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import MegaMenu from "@/components/nav/MegaMenu";
import MobileNav from "@/components/nav/MobileNav";
import ScrollTopLink from "@/components/ui/ScrollTopLink";
import { LOGIN_PATH, type SiteSection } from "@/content/sitemap";

/** `sections` comes from getSections(content programmes) in the root layout (src/content/sitemap.ts). */
type HeaderProps = { ctaLabel: string; sections: SiteSection[] };

export default function Header({ ctaLabel, sections }: HeaderProps) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  // Pages that open with a full-bleed image hero (every section overview and sub-route) get the transparent overlay header
  const hasHeroOverlay = isLandingPage || sections.some((section) => pathname === section.href || pathname.startsWith(`${section.href}/`));
  const [hasScrolled, setHasScrolled] = useState(false);

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

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // An open mega-menu panel always gets the solid bar, even over the hero.
  const isSolid = !hasHeroOverlay || hasScrolled || isMenuOpen;

  // After all hooks: the admin and the sign-in page have their own chrome.
  if (pathname.startsWith("/admin") || pathname === LOGIN_PATH) return null;

  return (
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
            src="/images/brand/basecamp-white-logo.png"
            alt=""
            width={1118}
            height={982}
            priority
            className="header-brand-logo"
          />
        </ScrollTopLink>
        <MegaMenu sections={sections} pathname={pathname} onOpenChange={setIsMenuOpen} />
        <div className="header-actions">
          <ScrollTopLink className="button button-small header-cta" href="/contact">
            <span className="header-cta-label">{ctaLabel}</span>
          </ScrollTopLink>
          <ScrollTopLink className="button button-small header-login" href={LOGIN_PATH} aria-label="Staff login">
            Login
          </ScrollTopLink>
        </div>
        <MobileNav sections={sections} />
      </div>
    </header>
  );
}
