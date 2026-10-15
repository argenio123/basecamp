"use client";

import { useEffect } from "react";

export default function HomeScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-home-reveal]"),
    );

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    root.classList.add("home-reveal-ready");

    let resetFrame = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          (entry.target as HTMLElement).dataset.homeRevealVisible = "true";
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );

    const observeElements = () => {
      elements.forEach((element) => observer.observe(element));
    };

    const resetAnimations = () => {
      observer.disconnect();
      elements.forEach((element) => {
        delete element.dataset.homeRevealVisible;
      });

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
    window.addEventListener("basecamp:reset-home-animations", resetAnimations);

    return () => {
      window.cancelAnimationFrame(resetFrame);
      window.removeEventListener("basecamp:reset-home-animations", resetAnimations);
      observer.disconnect();
      root.classList.remove("home-reveal-ready");
    };
  }, []);

  return null;
}
