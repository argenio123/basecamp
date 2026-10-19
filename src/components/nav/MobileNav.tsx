"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import ScrollTopLink from "@/components/ui/ScrollTopLink";
import { FOUNDING_HREF, LOGIN_PATH, type SiteSection } from "@/content/sitemap";

// Hash links use plain Link so the browser lands on the anchor (ScrollTopLink forces top).
function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return href.includes("#") ? <Link href={href}>{children}</Link> : <ScrollTopLink href={href}>{children}</ScrollTopLink>;
}

/**
 * Mobile menu (stage-3 §4, shown wherever the desktop nav is hidden): one expandable row (+/−) per section
 * with its overview and highlights, no images; Contact and "Become a founding member" at the bottom.
 * Keeps the existing <details class="mobile-menu"> shell; closes itself when a link is followed.
 */
export default function MobileNav({ sections }: { sections: SiteSection[] }) {
  const menuRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      summaryRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const closeOnLink = (event: MouseEvent<HTMLElement>) => {
    if ((event.target as Element).closest("a")) setOpen(false);
  };

  return (
    <details className="mobile-menu" ref={menuRef} open={open} onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary ref={summaryRef} aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open}><span /><span /></summary>
      <div className="mobile-panel nv-mobile-panel" onClick={closeOnLink}>
        {sections.map((section) => (
          <details className="nv-mobile-row" key={section.id}>
            <summary>
              <span>{section.label}</span>
              <span className="nv-mobile-sign" aria-hidden="true" />
            </summary>
            <ul className="nv-mobile-links">
              <li><NavLink href={section.href}>{section.label} overview</NavLink></li>
              {section.menu.highlights.map((h) => <li key={h.href}><NavLink href={h.href}>{h.label}</NavLink></li>)}
            </ul>
          </details>
        ))}
        <div className="nv-mobile-extras">
          <ScrollTopLink href={LOGIN_PATH} className="nv-mobile-login" aria-label="Staff login">Login</ScrollTopLink>
          <ScrollTopLink href="/contact">Contact</ScrollTopLink>
          <Link href={FOUNDING_HREF}>Become a founding member</Link>
        </div>
      </div>
    </details>
  );
}
