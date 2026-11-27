"use client";

import { useState, useSyncExternalStore } from "react";
import { directionsUrl } from "@/data/brand";
import "@/styles/find-us.css";

const subscribeNoop = () => () => {};

/**
 * The map side of Find us: a Google Maps embed (no API key) with a Map / Satellite toggle and a
 * "Click to explore the map" guard, so scrolling the page over the map never zooms it by accident.
 * The guard comes back when the pointer leaves the map.
 *
 * A static placeholder (pin + "Open in Google Maps" link) sits behind the iframe and stays visible until
 * the embed has loaded, so the panel is never a blank box: before hydration, while the lazy iframe is
 * still fetching (fast scrolling, full-page screenshots), with JS off, or if the embed is blocked.
 * The iframe mounts on the client only, so its onLoad can never fire before React is listening.
 */
export default function FindUsMap({ query }: { query: string }) {
  const [view, setView] = useState<"k" | "m">("k");
  const [active, setActive] = useState(false);
  const [loadedView, setLoadedView] = useState<"k" | "m" | null>(null);
  const isClient = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&t=${view}&z=17&output=embed`;
  const loaded = loadedView === view;

  return (
    <div className="fu-map" data-active={active ? "" : undefined} data-loaded={loaded ? "" : undefined} onMouseLeave={() => setActive(false)}>
      <div className="fu-map-fallback" aria-hidden={loaded ? true : undefined}>
        <svg viewBox="0 0 24 24" aria-hidden="true" className="fu-map-fallback-pin"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" /></svg>
        <a href={directionsUrl(query)} target="_blank" rel="noreferrer" tabIndex={loaded ? -1 : undefined}>
          Open in Google Maps<span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
      {isClient && (
        <iframe key={view} title="Map: BaseCamp CamSur" src={src} loading="lazy" referrerPolicy="no-referrer-when-downgrade" tabIndex={active ? 0 : -1} onLoad={() => setLoadedView(view)} />
      )}
      <div className="fu-map-toggle" role="group" aria-label="Map view">
        <button type="button" aria-pressed={view === "k"} onClick={() => setView("k")}>Satellite</button>
        <button type="button" aria-pressed={view === "m"} onClick={() => setView("m")}>Map</button>
      </div>
      {!active && loaded && (
        <button type="button" className="fu-map-guard" onClick={() => setActive(true)}>
          <span>Click to explore the map</span>
        </button>
      )}
    </div>
  );
}
