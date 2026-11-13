import Link from "next/link";
import { findPage, getPrevNext } from "@/content/sitemap";
import { getProgrammeRefs } from "./programmes";

/**
 * Previous / next pager between a section's sub-pages (not shown on overviews).
 * The first sub-page's left card and the last sub-page's right card are "Back to" cards for the section overview.
 */
export default async function PrevNext({ current }: { current: string }) {
  const programmes = await getProgrammeRefs();
  const match = findPage(current, programmes);
  if (!match || match.isOverview) return null;
  const { section } = match;
  const result = getPrevNext(current, programmes);
  // The overview is reached through the "up" card, never as a plain "Previous".
  const prev = result.prev && result.prev.href !== section.href ? result.prev : null;
  const next = result.next;
  const up = { href: section.href, label: `All of ${section.label}` };

  // Every section: the same pager as the Classes training-style pages (dark outlined cards, lime
  // "‹ Back to / Previous" and "Next ›" labels, large display-font page name).
  const left = prev ? { href: prev.href, label: prev.label, dir: "Previous", rel: "prev" as const } : { href: up.href, label: up.label, dir: "Back to", rel: undefined };
  const right = next ? { href: next.href, label: next.label, dir: "Next", rel: "next" as const } : { href: up.href, label: up.label, dir: "Back to", rel: undefined };
  return (
    <section className="nv-pn-band">
      <div className="shell">
        <nav className="pr-style-pager pr-style-pager--dark" aria-label={`${section.label} pages`}>
          <Link className="pr-style-pager-link pr-style-pager-prev" href={left.href} rel={left.rel}>
            <span><i aria-hidden="true">‹</i> {left.dir}</span>
            <strong>{left.label}</strong>
          </Link>
          <Link className="pr-style-pager-link pr-style-pager-next" href={right.href} rel={right.rel}>
            <span>{right.dir} <i aria-hidden="true">›</i></span>
            <strong>{right.label}</strong>
          </Link>
        </nav>
      </div>
    </section>
  );
}
