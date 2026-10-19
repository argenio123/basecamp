"use client";

import { useEffect, useRef } from "react";

export type HeroVideoSource = {
  /** Desktop file (≈1920px wide). */
  src: string;
  /** Lighter file for screens up to 900px wide. */
  mobileSrc?: string;
};

/**
 * Background video for <PageHero>. It is in the server HTML with autoplay, so the browser starts it straight away:
 * a refresh shows only the video (over the dark hero background), never a still picture first.
 * With prefers-reduced-motion the video is paused on its first frame once the page is interactive.
 */
export default function HeroVideo({ src, mobileSrc }: HeroVideoSource) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true; // autoplay needs muted; set the property too in case the attribute was dropped
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (reducedMotion.matches) video.pause();
      else void video.play().catch(() => {});
    };

    sync();
    reducedMotion.addEventListener("change", sync);
    return () => reducedMotion.removeEventListener("change", sync);
  }, []);

  return (
    <video ref={ref} className="page-hero-video" autoPlay muted loop playsInline preload="auto" aria-hidden="true" tabIndex={-1}>
      {mobileSrc && <source src={mobileSrc} media="(max-width: 900px)" type="video/mp4" />}
      <source src={src} type="video/mp4" />
    </video>
  );
}
