import { currentHrefFor, normalisePath } from "@/content/sitemap";

/**
 * Editable content links may still use stage-2 anchors (e.g. "/visit#camps", "/classes#corporate").
 * Resolve them to their stage-3 page with the site map (LEGACY_HASH_REDIRECTS), keeping any query string,
 * so rendered links never depend on the client-side HashForwarder. External and plain links pass through.
 */
export function currentHref(href: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const hashAt = href.indexOf("#");
  if (hashAt < 0) return href;
  const hash = href.slice(hashAt + 1);
  const beforeHash = href.slice(0, hashAt);
  const queryAt = beforeHash.indexOf("?");
  const path = queryAt < 0 ? beforeHash : beforeHash.slice(0, queryAt);
  const query = queryAt < 0 ? "" : beforeHash.slice(queryAt);
  if (!hash) return href;
  const target = currentHrefFor(normalisePath(path), hash);
  if (!query) return target;
  const [targetPath, targetHash] = target.split("#");
  return `${targetPath}${query}${targetHash ? `#${targetHash}` : ""}`;
}
