"use client";

import { useRef } from "react";
import { preload } from "react-dom";
import { useDeferredHeroVideo } from "@/components/sections/HeroVideo";
import { homeHeroVideo, homeHeroVideoFrame } from "@/data/brand";

/**
 * Homepage hero video. The first-frame poster paints first (preloaded at high priority: it is the LCP); each device
 * tier's video file is attached only after the page has loaded, and never with prefers-reduced-motion, Save-Data or
 * a slow connection, where the poster stays (see useDeferredHeroVideo).
 */
export default function HomeHeroMedia() {
  const ref = useRef<HTMLVideoElement>(null);
  const attached = useDeferredHeroVideo(ref);
  const poster = homeHeroVideoFrame(1280, 720);
  // <link rel="preload"> in the server HTML: a poster attribute alone is discovered late and fetched at low priority.
  preload(poster, { as: "image", fetchPriority: "high" });

  return (
    <video
      ref={ref}
      className="home-hero-video"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
      aria-hidden="true"
      tabIndex={-1}
    >
      {attached && (
        <>
          <source src={homeHeroVideo(960, 540)} type="video/mp4" media="(max-width: 600px)" />
          <source src={homeHeroVideo(1280, 720)} type="video/mp4" media="(max-width: 1040px)" />
          <source src={homeHeroVideo(1920, 1080)} type="video/mp4" />
        </>
      )}
    </video>
  );
}
