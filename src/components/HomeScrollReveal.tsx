"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function HomeScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const root = document.documentElement;
    const elements = new Set<HTMLElement>();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    root.classList.add("home-reveal-ready");

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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          const previousFrame = revealFrames.get(element);

          if (previousFrame) {
            window.cancelAnimationFrame(previousFrame);
            revealFrames.delete(element);
          }

          element.dataset.homeRevealDirection = scrollDirection;

          if (!entry.isIntersecting) {
            delete element.dataset.homeRevealVisible;
            return;
          }

          const revealFrame = window.requestAnimationFrame(() => {
            element.dataset.homeRevealVisible = "true";
            revealFrames.delete(element);
          });

          revealFrames.set(element, revealFrame);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );

    const registerElement = (element: HTMLElement) => {
      if (elements.has(element)) return;

      elements.add(element);
      observer.observe(element);
    };

    const registerRevealElements = (scope: ParentNode = document) => {
      if (scope instanceof HTMLElement && scope.matches("[data-home-reveal]")) {
        registerElement(scope);
      }

      scope
        .querySelectorAll<HTMLElement>("[data-home-reveal]")
        .forEach(registerElement);
    };

    const observeElements = () => {
      registerRevealElements();
      elements.forEach((element) => observer.observe(element));
    };

    const contentObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) registerRevealElements(node);
        });
      });
    });

    const resetAnimations = () => {
      observer.disconnect();
      revealFrames.forEach((frame) => window.cancelAnimationFrame(frame));
      revealFrames.clear();
      registerRevealElements();
      elements.forEach((element) => {
        delete element.dataset.homeRevealVisible;
        element.dataset.homeRevealDirection = "down";
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
      revealFrames.forEach((frame) => window.cancelAnimationFrame(frame));
      revealFrames.clear();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("basecamp:reset-home-animations", resetAnimations);
      contentObserver.disconnect();
      observer.disconnect();
      root.classList.remove("home-reveal-ready");
    };
  }, [pathname]);

  return null;
}
