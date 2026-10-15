"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ScrollTopLink from "@/components/ui/ScrollTopLink";

const links = [
  { href: "/programs", label: "Programs" },
  { href: "/facilities", label: "Facilities" },
  { href: "/membership", label: "Membership" },
  { href: "/schedule", label: "Schedule" },
  { href: "/visit", label: "Visit" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (!isLandingPage) return;

    const updateHeader = () => setHasScrolled(window.scrollY > 12);
    const frame = window.requestAnimationFrame(updateHeader);

    window.addEventListener("scroll", updateHeader, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateHeader);
    };
  }, [isLandingPage]);

  const isSolid = !isLandingPage || hasScrolled;

  return (
    <header
      className={`site-header${isLandingPage ? " site-header--home" : ""} ${isSolid ? "site-header--solid" : "site-header--transparent"}`}
    >
      <div className="header-shell">
        <ScrollTopLink
          href="/"
          className="brand header-brand"
          aria-label="Basecamp CamSur home"
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
        <nav className="desktop-nav" aria-label="Primary navigation">
          <div className="desktop-nav-group desktop-nav-group--left">
            {links.slice(0, 3).map((link) => <ScrollTopLink key={link.href} href={link.href}>{link.label}</ScrollTopLink>)}
          </div>
          <span className="desktop-nav-logo-slot" aria-hidden="true" />
          <div className="desktop-nav-group desktop-nav-group--right">
            {links.slice(3).map((link) => <ScrollTopLink key={link.href} href={link.href}>{link.label}</ScrollTopLink>)}
          </div>
        </nav>
        <ScrollTopLink className="button button-small header-cta" href="/contact">
          <span className="header-cta-label">Join early access</span>
          <span className="header-cta-arrow" aria-hidden="true">↗</span>
        </ScrollTopLink>
        <details className="mobile-menu">
          <summary aria-label="Open navigation"><span /><span /></summary>
          <div className="mobile-panel">
            {links.map((link) => <ScrollTopLink key={link.href} href={link.href}>{link.label}</ScrollTopLink>)}
            <ScrollTopLink href="/contact">Join early access</ScrollTopLink>
          </div>
        </details>
      </div>
    </header>
  );
}
