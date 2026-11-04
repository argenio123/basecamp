"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const HERO = ".page-hero, .pr-editorial-hero, .ab-editorial-hero, .ab-simple-hero";

/** Restarts every CSS entrance animation inside the hero (title, intro, kicker, image). */
function replay(hero: HTMLElement) {
  const animated = [hero, ...hero.querySelectorAll<HTMLElement>("*")].filter((el) => getComputedStyle(el).animationName !== "none");
  animated.forEach((el) => { el.style.animation = "none"; });
  void hero.offsetWidth; // flush so the browser sees the animation removed before it is restored
  animated.forEach((el) => { el.style.animation = ""; });
}

/**
 * Navigation-page heroes play their entrance once on load. This replays it when the visitor scrolls back up to the
 * hero after it has left the screen (it re-enters from above). Skipped under prefers-reduced-motion, where the hero
 * CSS already removes the animations. The homepage hero has its own logo-triggered replay.
 */
export default function HeroReplay() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const hero = [...document.querySelectorAll<HTMLElement>(`main :is(${HERO})`)].find((el) => el.offsetParent !== null);
    if (!hero) return;

    let left = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) { left = true; return; }
      // The hero is the first block on the page, so coming back on screen after leaving means scrolling up.
      if (left) replay(hero);
      left = false;
    }, { threshold: 0 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
