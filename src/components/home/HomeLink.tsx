import Link from "next/link";
import type { ReactNode } from "react";
import { resolveLegacyHash } from "@/content/sitemap";
import { localizedHref, stripLocale } from "@/i18n/paths";

/**
 * Current URL for a stage-2 internal href (stage-3 §9): a legacy "/page#anchor" whose section moved to a
 * sub-page (e.g. "/visit#camps") resolves to its new home ("/visit/camps"); the query string is kept.
 * Anything else (external, already current, no hash) is returned unchanged. A "/fil/…" href is resolved against its
 * English path and stays in Filipino where that page exists. Client-safe.
 */
export function resolveHomeHref(href: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const hashAt = href.indexOf("#");
  if (hashAt < 0) return href;
  const base = href.slice(0, hashAt);
  const queryAt = base.indexOf("?");
  const { locale, path } = stripLocale((queryAt < 0 ? base : base.slice(0, queryAt)) || "/");
  const query = queryAt < 0 ? "" : base.slice(queryAt);
  const moved = resolveLegacyHash(path, href.slice(hashAt + 1));
  if (!moved) return href;
  const [movedPath, movedHash] = moved.split("#");
  return localizedHref(`${movedPath}${query}${movedHash ? `#${movedHash}` : ""}`, locale);
}

/** Internal hrefs use next/link (legacy anchors resolved); absolute http(s) hrefs open in a new tab. Server- and client-safe. */
export default function HomeLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  if (/^https?:\/\//i.test(href)) {
    return <a href={href} className={className} target="_blank" rel="noreferrer">{children}</a>;
  }
  return <Link href={resolveHomeHref(href)} className={className}>{children}</Link>;
}
