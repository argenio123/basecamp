"use client";

import { useEffect, useRef } from "react";
import { homeHeroVideo, homeHeroVideoFrame } from "@/data/brand";

/**
 * Homepage hero video. Each device tier receives an appropriately sized file and a matching first-frame poster.
 * With prefers-reduced-motion it is paused on its first frame.
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
    <video
      ref={ref}
      className="home-hero-video"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={homeHeroVideoFrame(1280, 720)}
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src={homeHeroVideo(960, 540)} type="video/mp4" media="(max-width: 600px)" />
      <source src={homeHeroVideo(1280, 720)} type="video/mp4" media="(max-width: 1040px)" />
      <source src={homeHeroVideo(1920, 1080)} type="video/mp4" />
    </video>
  );
}
