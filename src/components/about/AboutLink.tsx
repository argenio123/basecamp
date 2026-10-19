import Link from "next/link";
import type { ReactNode } from "react";
import { currentHrefFor } from "@/content/sitemap";

/**
 * Where an editable content link points now. Stage-2 "/page#anchor" links stored in content are mapped to
 * their stage-3 page (e.g. /facilities#recovery → /facilities/recovery) via the site map, so the page links
 * straight to the new URL instead of relying on the client-side HashForwarder.
 */
export function siteHref(href: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const hashAt = href.indexOf("#");
  if (hashAt < 0) return href;
  const before = href.slice(0, hashAt);
  if (before.includes("?")) return href;
  return currentHrefFor(before || "/", href.slice(hashAt + 1));
}

/** Internal hrefs use next/link (legacy anchors rewritten); absolute http(s) hrefs open in a new tab. */
export default function AboutLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  if (/^https?:\/\//i.test(href)) {
    return <a href={href} className={className} target="_blank" rel="noreferrer">{children}</a>;
  }
  return <Link href={siteHref(href)} className={className}>{children}</Link>;
}
