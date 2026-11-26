"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { preload } from "react-dom";

export type HeroVideoSource = {
  /** Desktop file (≈1920px wide). */
  src: string;
  /** Smallest file for phone screens up to 600px wide. */
  mobileSrc?: string;
  /** Mid-sized file for tablet screens up to 1040px wide. */
  tabletSrc?: string;
  /** Still frame shown until the video starts (and instead of it on reduced motion / slow connections). */
  poster?: string;
};

type NetworkInformationLike = { saveData?: boolean; effectiveType?: string };
const SLOW_CONNECTIONS = new Set(["slow-2g", "2g", "3g"]);

/** True when the visitor asked to save data or is on a slow link. `navigator.connection` is Chromium-only;
 *  where it is missing we assume a normal connection and play the video as before. */
function prefersLightMedia() {
  const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  return !!connection && (connection.saveData === true || SLOW_CONNECTIONS.has(connection.effectiveType ?? ""));
}

/** Calls `callback` once the page has fired `load` and the main thread is idle, so a multi-MB video never competes
 *  with the first paint for bandwidth. Safari has no requestIdleCallback, hence the short timeout fallback. */
function afterLoadAndIdle(callback: () => void) {
  let idleId: number | undefined;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const schedule = () => {
    if (typeof window.requestIdleCallback === "function") idleId = window.requestIdleCallback(callback, { timeout: 2000 });
    else timeoutId = setTimeout(callback, 200);
  };
  if (document.readyState === "complete") schedule(); // client-side navigation: the page is already loaded
  else window.addEventListener("load", schedule, { once: true });
  return () => {
    window.removeEventListener("load", schedule);
    if (idleId !== undefined) window.cancelIdleCallback(idleId);
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  };
}

/**
 * Shared by the page and homepage hero videos. The server HTML holds a source-less <video> showing its poster
 * (frame 0 of the video, preloaded at high priority so it is the LCP); returns true once the <source>s should be
 * attached: after load + idle, and never with prefers-reduced-motion, Save-Data or a 2G/3G connection (poster stays).
 * Once attached, the video plays muted and pauses again if reduced motion is switched on.
 */
export function useDeferredHeroVideo(ref: RefObject<HTMLVideoElement | null>) {
  const [attached, setAttached] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cancel: (() => void) | undefined;
    const maybeAttach = () => {
      if (reducedMotion.matches || prefersLightMedia()) return;
      cancel ??= afterLoadAndIdle(() => {
        if (!reducedMotion.matches) setAttached(true);
      });
    };

    maybeAttach();
    // Turning reduced motion off later still starts the video; turning it on pauses it (effect below).
    reducedMotion.addEventListener("change", maybeAttach);
    return () => {
      reducedMotion.removeEventListener("change", maybeAttach);
      cancel?.();
    };
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!attached || !video) return;
    video.muted = true; // autoplay needs muted; set the property too in case the attribute was dropped
    video.load(); // the <source>s were just inserted: run source selection now so the right tier is fetched
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (reducedMotion.matches) video.pause();
      else void video.play().catch(() => {});
    };

    sync();
    reducedMotion.addEventListener("change", sync);
    return () => reducedMotion.removeEventListener("change", sync);
  }, [attached, ref]);

  return attached;
}

/**
 * Background video for <PageHero>. The poster (the video's own first frame) paints first in the same <video> box,
 * so there is no layout shift and no visual jump when playback starts; the video files load only after the page
 * has loaded (see useDeferredHeroVideo).
 */
export default function HeroVideo({ src, mobileSrc, tabletSrc, poster }: HeroVideoSource) {
  const ref = useRef<HTMLVideoElement>(null);
  const attached = useDeferredHeroVideo(ref);
  // <link rel="preload"> in the server HTML: a poster attribute alone is discovered late and fetched at low priority.
  if (poster) preload(poster, { as: "image", fetchPriority: "high" });

  return (
    <video ref={ref} className="page-hero-video" autoPlay muted loop playsInline preload="auto" poster={poster} aria-hidden="true" tabIndex={-1}>
      {attached && mobileSrc && <source src={mobileSrc} media="(max-width: 600px)" type="video/mp4" />}
      {attached && tabletSrc && <source src={tabletSrc} media="(max-width: 1040px)" type="video/mp4" />}
      {attached && <source src={src} type="video/mp4" />}
    </video>
  );
}
