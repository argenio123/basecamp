"use client";

import { useLayoutEffect } from "react";

/**
 * Opens the page at the top. Member pages are often reached through a redirect (e.g. a "Get early access" button
 * at the bottom of a page → /contact → /account/login); a redirect during client navigation keeps the previous
 * scroll position, which would land the visitor on the footer.
 */
export default function ScrollToTop() {
  useLayoutEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);
  return null;
}
