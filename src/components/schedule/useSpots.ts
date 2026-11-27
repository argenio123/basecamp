"use client";

import { useEffect, useState } from "react";
import type { SpotsResponse } from "@/lib/bookings/types";

/** "YYYY-MM-DD" from a Manila wall-clock Date (see manilaNow). */
export const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const FRESH_MS = 20_000;
const cache = new Map<string, { at: number; data: SpotsResponse }>();

/**
 * Live spots for the selected day from GET /api/bookings/spots, so the prerendered timetable stays static. Refetched
 * when the day changes and when the tab comes back into view. Null until loaded (or when it fails): sessions then
 * keep their request links.
 */
export function useSpots(date: Date | null): SpotsResponse | null {
  const key = date ? ymd(date) : "";
  const [data, setData] = useState<SpotsResponse | null>(null);
  useEffect(() => {
    if (!key) return;
    let ctrl: AbortController | null = null;
    const load = (force = false) => {
      const hit = cache.get(key);
      if (hit && !force && Date.now() - hit.at < FRESH_MS) { setData(hit.data); return; }
      ctrl?.abort();
      ctrl = new AbortController();
      fetch(`/api/bookings/spots?date=${key}`, { signal: ctrl.signal, cache: "no-store" })
        .then((r) => (r.ok ? (r.json() as Promise<SpotsResponse>) : null))
        .then((d) => { if (d && d.date === key) { cache.set(key, { at: Date.now(), data: d }); setData(d); } })
        .catch(() => { /* aborted or offline: keep what's shown */ });
    };
    const hit = cache.get(key);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- show the cached day straight away, then refresh
    setData(hit?.data.date === key ? hit.data : null);
    load();
    const onVisible = () => { if (document.visibilityState === "visible") load(true); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { ctrl?.abort(); document.removeEventListener("visibilitychange", onVisible); };
  }, [key]);
  return data && data.date === key ? data : null;
}
