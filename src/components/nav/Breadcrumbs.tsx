import Link from "next/link";
import { getBreadcrumbs, HOME_PAGE } from "@/content/sitemap";
import { siteUrl } from "@/data/brand";
import { getProgrammeRefs } from "./programmes";

/**
 * Visible "Section / Page" trail plus BreadcrumbList JSON-LD (Home › Section › Page), stage-3 §5.
 * `current` is the page path; `label` overrides the last crumb (e.g. a shorter programme name).
 */
export default async function Breadcrumbs({ current, label }: { current: string; label?: string }) {
  const crumbs = getBreadcrumbs(current, await getProgrammeRefs());
  if (crumbs.length === 0) return null;
  if (label) crumbs[crumbs.length - 1] = { ...crumbs[crumbs.length - 1], label };
  const base = siteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ href: HOME_PAGE.href, label: HOME_PAGE.label }, ...crumbs].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: c.href === "/" ? base : `${base}${c.href}`,
    })),
  };

  return (
    <nav className="nv-breadcrumbs" aria-label="Breadcrumb">
      <ol className="shell">
        {crumbs.map((c, i) => (
          <li key={c.href}>
            {i === crumbs.length - 1 ? <span aria-current="page">{c.label}</span> : <Link href={c.href}>{c.label}</Link>}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </nav>
  );
}
