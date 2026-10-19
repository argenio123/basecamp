"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { LOGIN_PATH } from "@/content/sitemap";

/**
 * Disables copy and paste on public pages, and nothing else: the right-click menu and other shortcuts keep
 * working, but its Copy / Cut / Paste (and Ctrl/Cmd+C, X, V) do nothing. Text outside form fields also can't be
 * highlighted, so the menu has nothing to copy. Mounted once in the root layout.
 *
 * The staff area (/admin, /login) is left alone so content can be edited normally. The `copy-guard` class on
 * <html> turns on the matching CSS in src/styles/shared.css.
 *
 * This is a deterrent only: page source, developer tools and screenshots can't be blocked by a website.
 */
const BLOCKED_EVENTS = ["copy", "cut", "paste"] as const;

export default function CopyGuard() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname === LOGIN_PATH) return;

    const root = document.documentElement;
    root.classList.add("copy-guard");

    const block = (event: Event) => event.preventDefault();
    BLOCKED_EVENTS.forEach((type) => document.addEventListener(type, block));

    return () => {
      root.classList.remove("copy-guard");
      BLOCKED_EVENTS.forEach((type) => document.removeEventListener(type, block));
    };
  }, [pathname]);

  return null;
}
