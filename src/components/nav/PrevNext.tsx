import Link from "next/link";
import { findPage, getPrevNext } from "@/content/sitemap";
import { fmt } from "@/i18n/ui";
import { getLocale, getUi } from "@/i18n/server";
import { localizePage, localizeSections } from "@/i18n/sitemap";
import { getProgrammeRefs } from "./programmes";

/**
 * Previous / next pager between a section's sub-pages (not shown on overviews).
 * The first sub-page's left card and the last sub-page's right card are "Back to" cards for the section overview.
 * Labels and links follow the page's language.
 */
export default async function PrevNext({ current }: { current: string }) {
  const locale = getLocale();
  const ui = getUi(locale);
  const programmes = await getProgrammeRefs();
  const match = findPage(current, programmes);
  if (!match || match.isOverview) return null;
  const { section } = match;
  const result = getPrevNext(current, programmes);
  // The overview is reached through the "up" card, never as a plain "Previous".
  const prev = result.prev && result.prev.href !== section.href ? localizePage(result.prev, locale) : null;
  const next = result.next ? localizePage(result.next, locale) : null;
  const localSection = localizeSections([section], locale)[0];
  const up = { href: localSection.href, label: fmt(ui.nav.allOf, { label: localSection.label }) };

  // Every section: the same pager as the Classes training-style pages (dark outlined cards, lime
  // "‹ Back to / Previous" and "Next ›" labels, large display-font page name).
  const left = prev ? { href: prev.href, label: prev.label, dir: ui.nav.previous, rel: "prev" as const } : { href: up.href, label: up.label, dir: ui.nav.backTo, rel: undefined };
  const right = next ? { href: next.href, label: next.label, dir: ui.nav.next, rel: "next" as const } : { href: up.href, label: up.label, dir: ui.nav.backTo, rel: undefined };
  return (
    <section className="nv-pn-band">
      <div className="shell">
        <nav className="pr-style-pager pr-style-pager--dark" data-reveal="stagger" aria-label={fmt(ui.nav.sectionPages, { label: localSection.label })}>
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
