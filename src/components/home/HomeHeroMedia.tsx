"use client";

import { useEffect, useRef } from "react";

/**
 * Homepage hero video. It is in the server HTML with autoplay, so a refresh shows only the video (over the dark
 * hero background), never a still photo first. With prefers-reduced-motion it is paused on its first frame.
 */
export default function HomeHeroMedia() {
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
    <video ref={ref} className="home-hero-video" autoPlay muted loop playsInline preload="auto" aria-hidden="true" tabIndex={-1}>
      <source src="https://res.cloudinary.com/nkk9rbc7/video/upload/basecamp-hero.mp4" type="video/mp4" />
    </video>
  );
}
