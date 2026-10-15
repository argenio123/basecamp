"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
        <Link href="/" className="brand header-brand" aria-label="Basecamp CamSur home">
          <Image
            src="/images/brand/basecamp-white-logo.png"
            alt=""
            width={1118}
            height={982}
            priority
            className="header-brand-logo"
          />
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <div className="desktop-nav-group desktop-nav-group--left">
            {links.slice(0, 3).map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
          </div>
          <span className="desktop-nav-logo-slot" aria-hidden="true" />
          <div className="desktop-nav-group desktop-nav-group--right">
            {links.slice(3).map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
          </div>
        </nav>
        <Link className="button button-small header-cta" href="/contact">
          <span className="header-cta-label">Join early access</span>
          <span className="header-cta-arrow" aria-hidden="true">↗</span>
        </Link>
        <details className="mobile-menu">
          <summary aria-label="Open navigation"><span /><span /></summary>
          <div className="mobile-panel">
            {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
            <Link href="/contact">Join early access</Link>
          </div>
        </details>
      </div>
    </header>
  );
}
