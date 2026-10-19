"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { resolveLegacyHash } from "@/content/sitemap";

/**
 * Forwards legacy stage-2 anchors to their new pages (stage-3 §9), e.g. /facilities#recovery → /facilities/recovery.
 * Hashes never reach the server, so this runs client-side with router.replace (no extra history entry).
 * Mounted once in the root layout, so it covers home and every overview; `from` overrides the current path.
 * The query string is kept when the target has none (e.g. /schedule?item=x#book → /schedule/book?item=x).
 * Docs: node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-router.md
 */
export default function HashForwarder({ from }: { from?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const path = from ?? pathname;

  useEffect(() => {
    const forward = () => {
      const target = resolveLegacyHash(path, window.location.hash);
      if (!target || !target.startsWith("/") || target.startsWith("//")) return;
      const search = window.location.search;
      const [targetPath, targetHash] = target.split("#");
      const href = targetPath.includes("?") || !search ? target : `${targetPath}${search}${targetHash ? `#${targetHash}` : ""}`;
      router.replace(href);
    };
    forward();
    window.addEventListener("hashchange", forward);
    return () => window.removeEventListener("hashchange", forward);
  }, [path, router]);

  return null;
}
