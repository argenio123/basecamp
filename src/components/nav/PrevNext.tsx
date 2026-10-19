import Link from "next/link";
import { findPage, getPrevNext } from "@/content/sitemap";
import { getProgrammeRefs } from "./programmes";

type Direction = "previous" | "next" | "up";

function Chevron({ direction }: { direction: Direction }) {
  const d = direction === "previous" ? "M15 5l-7 7 7 7" : direction === "next" ? "M9 5l7 7-7 7" : "M5 15l7-7 7 7";
  return (
    <svg className="nv-prevnext-chevron" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={d} />
    </svg>
  );
}

/**
 * Previous / next cards between a section's sub-pages (not shown on overviews).
 * The first sub-page's left card and the last sub-page's right card are "up" cards back to the section overview.
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
  const upLeft = prev ? null : up;
  const upRight = next ? null : up;

  return (
    <nav className="nv-prevnext" aria-label={`${section.label} pages`}>
      <div className="shell nv-prevnext-inner">
        {prev ? (
          <Link href={prev.href} className="nv-prevnext-link" rel="prev">
            <span className="nv-prevnext-dir"><Chevron direction="previous" /> Previous</span>
            <span className="nv-prevnext-label">{prev.label}</span>
          </Link>
        ) : upLeft && (
          <Link href={upLeft.href} className="nv-prevnext-link nv-prevnext-link--up">
            <span className="nv-prevnext-label"><Chevron direction="up" /> {upLeft.label}</span>
          </Link>
        )}
        {next ? (
          <Link href={next.href} className="nv-prevnext-link nv-prevnext-link--next" rel="next">
            <span className="nv-prevnext-dir">Next <Chevron direction="next" /></span>
            <span className="nv-prevnext-label">{next.label}</span>
          </Link>
        ) : upRight && (
          <Link href={upRight.href} className="nv-prevnext-link nv-prevnext-link--up">
            <span className="nv-prevnext-label"><Chevron direction="up" /> {upRight.label}</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
