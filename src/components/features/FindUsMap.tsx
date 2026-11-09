"use client";

import { useState } from "react";

/**
 * The map side of Find us: a Google Maps embed (no API key) with a Map / Satellite toggle and a
 * "Click to explore the map" guard, so scrolling the page over the map never zooms it by accident.
 * The guard comes back when the pointer leaves the map.
 */
export default function FindUsMap({ query }: { query: string }) {
  const [view, setView] = useState<"k" | "m">("k");
  const [active, setActive] = useState(false);
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&t=${view}&z=17&output=embed`;

  return (
    <div className="fu-map" data-active={active ? "" : undefined} onMouseLeave={() => setActive(false)}>
      <iframe key={view} title="Map: BaseCamp CamSur" src={src} loading="lazy" referrerPolicy="no-referrer-when-downgrade" tabIndex={active ? 0 : -1} />
      <div className="fu-map-toggle" role="group" aria-label="Map view">
        <button type="button" aria-pressed={view === "k"} onClick={() => setView("k")}>Satellite</button>
        <button type="button" aria-pressed={view === "m"} onClick={() => setView("m")}>Map</button>
      </div>
      {!active && (
        <button type="button" className="fu-map-guard" onClick={() => setActive(true)}>
          <span>Click to explore the map</span>
        </button>
      )}
    </div>
  );
}
