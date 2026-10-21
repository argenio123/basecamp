"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type ReactNode } from "react";
import ScrollTopLink from "@/components/ui/ScrollTopLink";
import type { SectionId, SiteSection } from "@/content/sitemap";

/**
 * Desktop mega menu (stage-3 §4). W3C disclosure-navigation pattern: each top item is a <button>
 * with aria-expanded + aria-controls; its panel is a sibling region holding plain links.
 * Opens on click only (Enter/Space from the keyboard); clicking the open item again closes it.
 * Closes on Esc (focus returns to the trigger), on outside click, when focus leaves the nav and on navigation.
 * ArrowLeft/ArrowRight move between top items; ArrowDown opens and focuses the first link.
 * Each panel follows its trigger inside .desktop-nav-group (Tab order); nav.css neutralises the group's link styles.
 */
type MenuState = { id: SectionId; path: string };

// Hash links use plain Link so the browser lands on the anchor (ScrollTopLink forces top).
function NavLink({ href, className, children, onClick, isCurrent }: { href: string; className?: string; children: ReactNode; onClick?: () => void; isCurrent?: boolean }) {
  return href.includes("#")
    ? <Link href={href} className={className} onClick={onClick} aria-current={isCurrent ? "page" : undefined}>{children}</Link>
    : <ScrollTopLink href={href} className={className} onClick={onClick} aria-current={isCurrent ? "page" : undefined}>{children}</ScrollTopLink>;
}

/**
 * Menu card media: a still image, or, when the menu has a `video`, the video alone. The video's poster is its own
 * first frame, so the card never shows a different picture before playback: it simply starts moving. The file is
 * preload="none" (pages never download it unprompted); loading starts on intent (hover/focus of the trigger, `warm`)
 * and it plays only while the panel is open. With prefers-reduced-motion it stays on its first frame.
 */
function PanelMedia({ menu, isOpen, warm }: { menu: SiteSection["menu"]; isOpen: boolean; warm: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const loadStarted = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video || (!warm && !isOpen)) return;
    if (!loadStarted.current) {
      loadStarted.current = true;
      video.preload = "auto";
      video.load();
    }
  }, [warm, isOpen]);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (isOpen && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.muted = true;
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isOpen]);

  if (!menu.video) {
    return (
      <div className="nv-panel-image">
        <Image src={menu.image} alt={menu.imageAlt} fill sizes="(max-width: 1440px) 30vw, 420px" className="cover-image" />
      </div>
    );
  }
  return (
    <div className="nv-panel-image" role="img" aria-label={menu.imageAlt}>
      <video ref={ref} className="nv-panel-video" poster={menu.videoPoster} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1}>
        <source src={menu.video} type="video/mp4" />
      </video>
    </div>
  );
}

type MegaMenuProps ={ sections: SiteSection[]; pathname: string; onOpenChange?: (isOpen: boolean) => void };

export default function MegaMenu({ sections, pathname, onOpenChange }: MegaMenuProps) {
  const [menu, setMenu] = useState<MenuState | null>(null);
  // True while moving from one open panel to another: the card stays in place and only its content animates
  // (nav.css [data-switching]). Opening from closed and closing keep the card's own fade/slide.
  const [switching, setSwitching] = useState(false);
  // Last trigger the pointer or focus reached: its panel media starts loading before the click (PanelMedia `warm`).
  const [warmId, setWarmId] = useState<SectionId | null>(null);
  // Derived: a menu opened on another route is closed (no setState in an effect).
  const openId = menu && menu.path === pathname ? menu.id : null;
  const hasOpenPanel = openId !== null;
  const navRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Partial<Record<SectionId, HTMLButtonElement | null>>>({});
  const pendingPanelFocus = useRef<SectionId | null>(null);

  const open = useCallback((id: SectionId) => {
    setSwitching(openId !== null);
    setMenu({ id, path: pathname });
  }, [pathname, openId]);

  const close = useCallback((returnFocusTo?: SectionId) => {
    setSwitching(false);
    setMenu(null);
    if (returnFocusTo) triggerRefs.current[returnFocusTo]?.focus();
  }, []);

  // Outside click closes.
  useEffect(() => {
    if (!openId) return;
    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openId, close]);
  // Lets the header switch to its solid bar while a panel is open, so bar and panel read as one card.
  useEffect(() => {
    onOpenChange?.(hasOpenPanel);
  }, [hasOpenPanel, onOpenChange]);
  useEffect(() => {
    if (!openId || pendingPanelFocus.current !== openId) return;
    pendingPanelFocus.current = null;
    document.getElementById(`nv-panel-${openId}`)?.querySelector<HTMLElement>("a")?.focus();
  }, [openId]);

  const focusTrigger = (index: number) => {
    const id = sections[(index + sections.length) % sections.length].id;
    triggerRefs.current[id]?.focus();
  };

  const onTriggerKeyDown = (id: SectionId, index: number) => (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowRight") { event.preventDefault(); focusTrigger(index + 1); }
    else if (event.key === "ArrowLeft") { event.preventDefault(); focusTrigger(index - 1); }
    else if (event.key === "Escape" && openId) { event.preventDefault(); close(id); }
    else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (openId === id) {
        document.getElementById(`nv-panel-${id}`)?.querySelector<HTMLElement>("a")?.focus();
      } else {
        pendingPanelFocus.current = id;
        open(id);
      }
    }
  };

  const onTriggerClick = (id: SectionId) => {
    if (openId === id) close();
    else open(id);
  };

  const onNavBlur = (event: FocusEvent<HTMLElement>) => {
    if (openId && !event.currentTarget.contains(event.relatedTarget as Node | null)) close();
  };

  const onPanelKeyDown = (id: SectionId) => (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") { event.preventDefault(); close(id); return; }
    const links = Array.from(event.currentTarget.querySelectorAll<HTMLAnchorElement>("a"));
    const active = links.indexOf(document.activeElement as HTMLAnchorElement);
    if ((event.key === "ArrowDown" || event.key === "ArrowUp") && active >= 0) {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      links[(active + step + links.length) % links.length]?.focus();
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      const index = sections.findIndex((section) => section.id === id);
      close();
      focusTrigger(index + (event.key === "ArrowRight" ? 1 : -1));
    }
  };

  // Each trigger is followed by its panel in DOM order, so Tab moves from a trigger into its open panel.
  const item = (section: SiteSection, index: number) => {
    const isOpen = openId === section.id;
    return (
      <Fragment key={section.id}>
        <button
          type="button"
          className="nv-trigger"
          ref={(node) => { triggerRefs.current[section.id] = node; }}
          aria-expanded={isOpen}
          aria-controls={`nv-panel-${section.id}`}
          onClick={() => onTriggerClick(section.id)}
          onPointerEnter={() => setWarmId(section.id)}
          onFocus={() => setWarmId(section.id)}
          onKeyDown={onTriggerKeyDown(section.id, index)}
        >
          {section.label}
        </button>
        <div
          id={`nv-panel-${section.id}`}
          className="nv-panel"
          data-open={isOpen ? "true" : undefined}
          role="region"
          aria-label={`${section.label} menu`}
          onKeyDown={onPanelKeyDown(section.id)}
        >
          <div className="nv-panel-inner">
            <div className="nv-panel-feature">
              <PanelMedia menu={section.menu} isOpen={isOpen} warm={warmId === section.id} />
              <p className="nv-panel-text">{section.menu.text}</p>
              <NavLink href={section.href} className="button button-light button-small nv-panel-explore" onClick={() => close()} isCurrent={pathname === section.href}>
                Explore {section.label}
              </NavLink>
            </div>
            <div className="nv-panel-highlights">
              <p className="eyebrow eyebrow-light">Highlights</p>
              <ul className="nv-panel-list">
                {section.menu.highlights.map((h) => (
                  <li key={h.href}><NavLink href={h.href} onClick={() => close()} isCurrent={!h.href.includes("#") && pathname === h.href}><span className="nv-panel-label">{h.label}</span></NavLink></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Fragment>
    );
  };

  return (
    <nav className="desktop-nav nv-desktop-nav" aria-label="Primary navigation" ref={navRef} onBlur={onNavBlur} data-switching={switching && hasOpenPanel ? "true" : undefined}>
      <div className="desktop-nav-group desktop-nav-group--left">
        {sections.slice(0, 3).map((s, i) => item(s, i))}
      </div>
      <span className="desktop-nav-logo-slot" aria-hidden="true" />
      <div className="desktop-nav-group desktop-nav-group--right">
        {sections.slice(3).map((s, i) => item(s, i + 3))}
      </div>
    </nav>
  );
}
