"use client";

import { useLayoutEffect } from "react";

/**
 * Opens the page at the top. Member pages are often reached through a redirect (e.g. a "Request" button on the
 * timetable → /schedule/book#book → /account/login); a redirect during client navigation keeps the previous
 * scroll position, which would land the visitor on the footer. The browser also carries the original "#book"
 * fragment over to the login page, so a hash is only honored when it points at something on this page; a stray
 * one is dropped from the address bar.
 */
export default function ScrollToTop() {
  useLayoutEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id && document.getElementById(id)) return;
    if (id) window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
    const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    toTop();
    // The router may restore or adjust scroll after this effect; settle at the top once more on the next frames.
    let b = 0;
    const a = requestAnimationFrame(() => { toTop(); b = requestAnimationFrame(toTop); });
    return () => { cancelAnimationFrame(a); cancelAnimationFrame(b); };
  }, []);
  return null;
}
