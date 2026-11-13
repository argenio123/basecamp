"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { clearIdleMark, recordActivity } from "@/lib/home-offer-visit";

const EVENTS = ["pointerdown", "pointermove", "keydown", "wheel", "scroll", "touchstart"] as const;

/**
 * Site-wide: notes when the visitor last interacted, for the homepage offer's 15-minute idle rule
 * (src/lib/home-offer-visit.ts). Writes at most every 10 seconds. Renders nothing.
 */
export default function OfferActivityTracker() {
  const pathname = usePathname();
  const firstPath = useRef(true);

  useEffect(() => {
    // Mounted once per full page load. Away from the homepage, a pending idle mark is spent and the load counts as
    // activity; on the homepage the offer modal reads and updates the record itself.
    if (window.location.pathname !== "/") { clearIdleMark(); recordActivity(Date.now(), false); }
    let lastWrite = 0;
    const onActivity = () => {
      const now = Date.now();
      if (now - lastWrite < 10_000) return;
      lastWrite = now;
      recordActivity(now);
    };
    EVENTS.forEach((e) => window.addEventListener(e, onActivity, { passive: true, capture: true }));
    return () => EVENTS.forEach((e) => window.removeEventListener(e, onActivity, { capture: true }));
  }, []);

  // Moving between pages (client-side) counts as activity too. The first run is the full load, handled above.
  useEffect(() => {
    if (firstPath.current) { firstPath.current = false; return; }
    recordActivity();
  }, [pathname]);

  return null;
}
