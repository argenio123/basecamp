"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

/**
 * Replays the log-in / sign-up entrance animation on every arrival. A fresh page load animates through CSS alone
 * (`.mb-auth[data-anim]`); this restarts it when the URL changes without remounting (a new `?next=`), and when a
 * Login / Sign up button pointing at the page already open is clicked (Next.js does nothing visible then).
 */
export default function AuthReplay() {
  const pathname = usePathname();
  const search = useSearchParams().toString();

  useEffect(() => {
    const replay = () => {
      const el = document.querySelector<HTMLElement>(".mb-auth");
      if (!el) return;
      el.removeAttribute("data-anim");
      void el.offsetWidth; // flush styles so the animation starts again
      el.setAttribute("data-anim", "");
    };
    replay();

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement)) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin === window.location.origin && url.pathname === window.location.pathname && url.search === window.location.search) {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        replay();
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname, search]);

  return null;
}
