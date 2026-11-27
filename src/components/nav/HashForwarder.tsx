"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { resolveLegacyHash } from "@/content/sitemap";
import { localizedHref, stripLocale } from "@/i18n/paths";

/**
 * Forwards legacy stage-2 anchors to their new pages (stage-3 §9), e.g. /facilities#recovery → /facilities/recovery.
 * Hashes never reach the server, so this runs client-side with router.replace (no extra history entry).
 * Mounted once in the root layout, so it covers home and every overview; `from` overrides the current path.
 * The query string is kept when the target has none (e.g. /schedule?item=x#book → /schedule/book?item=x).
 * On /fil pages the legacy hash is resolved against the English path and the target stays in Filipino when it exists.
 * Docs: node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-router.md
 */
export default function HashForwarder({ from }: { from?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, path: current } = stripLocale(pathname || "/");
  const path = from ? stripLocale(from).path : current;

  useEffect(() => {
    const forward = () => {
      const moved = resolveLegacyHash(path, window.location.hash);
      if (!moved || !moved.startsWith("/") || moved.startsWith("//")) return;
      const target = localizedHref(moved, locale);
      const search = window.location.search;
      const [targetPath, targetHash] = target.split("#");
      const href = targetPath.includes("?") || !search ? target : `${targetPath}${search}${targetHash ? `#${targetHash}` : ""}`;
      router.replace(href);
    };
    forward();
    window.addEventListener("hashchange", forward);
    return () => window.removeEventListener("hashchange", forward);
  }, [locale, path, router]);

  return null;
}
