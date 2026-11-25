"use client";

import { useEffect, useRef } from "react";

export type HeroVideoSource = {
  /** Desktop file (≈1920px wide). */
  src: string;
  /** Smallest file for phone screens up to 600px wide. */
  mobileSrc?: string;
  /** Mid-sized file for tablet screens up to 1040px wide. */
  tabletSrc?: string;
  /** Still frame shown while the selected video buffers. */
  poster?: string;
};

/**
 * Background video for <PageHero>. It is in the server HTML with autoplay, so the browser starts it straight away:
 * a refresh shows only the video (over the dark hero background), never a still picture first.
 * With prefers-reduced-motion the video is paused on its first frame once the page is interactive.
 */
export default function HeroVideo({ src, mobileSrc, tabletSrc, poster }: HeroVideoSource) {
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
    <video ref={ref} className="page-hero-video" autoPlay muted loop playsInline preload="auto" poster={poster} aria-hidden="true" tabIndex={-1}>
      {mobileSrc && <source src={mobileSrc} media="(max-width: 600px)" type="video/mp4" />}
      {tabletSrc && <source src={tabletSrc} media="(max-width: 1040px)" type="video/mp4" />}
      <source src={src} type="video/mp4" />
    </video>
  );
}
