"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Background slideshow for the member log-in / sign-up hero. Every photo keeps its athlete on the left half,
 * clear of the form card on the right: photos whose subject sits right of center are mirrored (`flip`).
 *
 * Smooth change: the new photo fades in on top of the previous one, which stays fully visible underneath
 * (no dark dip mid-fade) and keeps its slow zoom running until it is covered (no jump).
 */
const SLIDES = [
  { src: "/images/programs/stations/sled-pull.jpg", flip: false },
  { src: "/images/programs/generated/endurance.png", flip: true },
  { src: "/images/programs/stations/farmers-carry.jpg", flip: false },
  { src: "/images/programs/stations/sled-push-man.jpg", flip: true },
  { src: "/images/programs/generated/strength-conditioning.png", flip: true },
] as const;

/** Time each photo stays on screen. */
const INTERVAL_MS = 5000;

export default function AuthSlides() {
  const [{ active, leaving }, setSlides] = useState<{ active: number; leaving: number | null }>({ active: 0, leaving: null });

  useEffect(() => {
    // Pause while the tab is hidden, so returning to the page doesn't skip ahead.
    let timer = 0;
    const next = () => setSlides(({ active: a }) => ({ active: (a + 1) % SLIDES.length, leaving: a }));
    const start = () => { timer = window.setInterval(next, INTERVAL_MS); };
    const stop = () => window.clearInterval(timer);
    const onVisibility = () => { stop(); if (!document.hidden) start(); };
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => { stop(); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);

  return (
    <div className="mb-auth-slides" aria-hidden="true">
      {SLIDES.map((slide, i) => (
        <div key={slide.src} className={`mb-auth-slide${i === active ? " is-active" : ""}${i === leaving ? " is-leaving" : ""}${slide.flip ? " is-flipped" : ""}`}>
          <Image src={slide.src} alt="" fill priority={i === 0} sizes="100vw" className="mb-auth-bg" />
        </div>
      ))}
    </div>
  );
}
