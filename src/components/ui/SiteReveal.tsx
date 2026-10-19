"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Site-wide scroll reveal (stage-3 §7). Mounted once in the root layout; re-scans on every route change and
 * picks up streamed/added content through a MutationObserver on <main>. Does nothing under
 * prefers-reduced-motion (the hiding CSS only applies once the root classes are added).
 *
 * Attributes (see src/styles/nav.css):
 *   data-reveal                       element fades + rises 24px when it enters the viewport
 *   data-reveal-delay="short|medium|long|longer"   stagger (.1/.2/.3/.4s)
 *   data-reveal="stagger"             container stays put; its direct children rise in turn
 * Legacy homepage attributes (unchanged CSS in globals.css/home.css, 44px):
 *   data-home-reveal, data-home-reveal-delay
 * The JS writes data-(home-)reveal-visible="true" and data-(home-)reveal-direction="up|down".
 */
const SELECTOR = "[data-reveal], [data-home-reveal]";

type Keys = { visible: "revealVisible" | "homeRevealVisible"; direction: "revealDirection" | "homeRevealDirection" };
const HOME_KEYS: Keys = { visible: "homeRevealVisible", direction: "homeRevealDirection" };
const SITE_KEYS: Keys = { visible: "revealVisible", direction: "revealDirection" };
const keysFor = (element: HTMLElement): Keys => (element.hasAttribute("data-home-reveal") ? HOME_KEYS : SITE_KEYS);

/*
 * Streamed page segments can still be un-hydrated when this layout-level effect runs. Writing data-* attributes
 * onto that server HTML makes React report a hydration mismatch, so an element is only touched once React has
 * hydrated it (React tags each hydrated DOM node with a `__reactFiber$…` key). Give up waiting after a few seconds.
 */
const isHydrated = (element: HTMLElement) => Object.keys(element).some((key) => key.startsWith("__reactFiber$"));
const HYDRATION_WAIT_MS = 4000;

export default function SiteReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname === "/login") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    const elements = new Set<HTMLElement>();

    root.classList.add("home-reveal-ready", "reveal-ready");

    let resetFrame = 0;
    let lastScrollY = window.scrollY;
    let scrollDirection: "up" | "down" = "down";
    const revealFrames = new Map<HTMLElement, number>();

    const handleScroll = () => {
      const nextScrollY = window.scrollY;

      if (nextScrollY > lastScrollY) scrollDirection = "down";
      if (nextScrollY < lastScrollY) scrollDirection = "up";

      lastScrollY = nextScrollY;
    };

    const onEntries = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;
        const keys = keysFor(element);
        const previousFrame = revealFrames.get(element);

        if (previousFrame) {
          window.cancelAnimationFrame(previousFrame);
          revealFrames.delete(element);
        }

        element.dataset[keys.direction] = scrollDirection;

        if (!entry.isIntersecting) {
          delete element.dataset[keys.visible];
          return;
        }

        const revealFrame = window.requestAnimationFrame(() => {
          element.dataset[keys.visible] = "true";
          revealFrames.delete(element);
        });

        revealFrames.set(element, revealFrame);
      });
    };

    // Homepage settings are kept exactly as before; site-wide elements use threshold 0 so very tall
    // blocks (taller than the viewport / threshold) still reveal.
    const homeObserver = new IntersectionObserver(onEntries, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    const siteObserver = new IntersectionObserver(onEntries, { rootMargin: "0px 0px -8% 0px", threshold: 0 });
    const observerFor = (element: HTMLElement) => (element.hasAttribute("data-home-reveal") ? homeObserver : siteObserver);

    const pending = new Set<HTMLElement>();
    const waitStart = performance.now();
    let pendingFrame = 0;

    const flushPending = () => {
      pendingFrame = 0;
      const giveUp = performance.now() - waitStart > HYDRATION_WAIT_MS;
      pending.forEach((element) => {
        if (!giveUp && !isHydrated(element)) return;
        pending.delete(element);
        if (element.isConnected) registerElement(element);
      });
      if (pending.size > 0) pendingFrame = window.requestAnimationFrame(flushPending);
    };

    const registerElement = (element: HTMLElement) => {
      if (elements.has(element)) return;
      if (!isHydrated(element) && performance.now() - waitStart <= HYDRATION_WAIT_MS) {
        pending.add(element);
        if (!pendingFrame) pendingFrame = window.requestAnimationFrame(flushPending);
        return;
      }

      elements.add(element);
      observerFor(element).observe(element);
    };

    const registerRevealElements = (scope: ParentNode = document) => {
      if (scope instanceof HTMLElement && scope.matches(SELECTOR)) {
        registerElement(scope);
      }

      scope.querySelectorAll<HTMLElement>(SELECTOR).forEach(registerElement);
    };

    const observeElements = () => {
      registerRevealElements();
      elements.forEach((element) => observerFor(element).observe(element));
    };

    const contentObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) registerRevealElements(node);
        });
      });
    });

    // Fired by the header logo on "/" (scroll to top and replay the homepage animations).
    const resetAnimations = () => {
      homeObserver.disconnect();
      siteObserver.disconnect();
      revealFrames.forEach((frame) => window.cancelAnimationFrame(frame));
      revealFrames.clear();
      registerRevealElements();
      elements.forEach((element) => {
        const keys = keysFor(element);
        delete element.dataset[keys.visible];
        element.dataset[keys.direction] = "down";
      });
      lastScrollY = window.scrollY;
      scrollDirection = "down";

      const heroContent = document.querySelector<HTMLElement>(".home-hero-content");
      if (heroContent) {
        heroContent.classList.add("home-hero-content--animation-reset");
        void heroContent.offsetWidth;
        heroContent.classList.remove("home-hero-content--animation-reset");
      }

      window.cancelAnimationFrame(resetFrame);
      resetFrame = window.requestAnimationFrame(observeElements);
    };

    observeElements();
    const pageMain = document.querySelector("main");
    if (pageMain) contentObserver.observe(pageMain, { childList: true, subtree: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("basecamp:reset-home-animations", resetAnimations);

    return () => {
      window.cancelAnimationFrame(resetFrame);
      window.cancelAnimationFrame(pendingFrame);
      pending.clear();
      revealFrames.forEach((frame) => window.cancelAnimationFrame(frame));
      revealFrames.clear();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("basecamp:reset-home-animations", resetAnimations);
      contentObserver.disconnect();
      homeObserver.disconnect();
      siteObserver.disconnect();
      root.classList.remove("home-reveal-ready", "reveal-ready");
    };
  }, [pathname]);

  return null;
}
