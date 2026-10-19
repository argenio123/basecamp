import Link from "next/link";
import { getPrevNext, getRelated, normalisePath } from "@/content/sitemap";
import { getProgrammeRefs } from "./programmes";

/**
 * "Related" cards at the bottom of every sub-page (stage-3 §5): 2–3 links. Pass `hrefs` to choose them
 * (any public path, #hash allowed); otherwise the next sibling sub-pages in the section are used.
 */
export default async function RelatedLinks({ current, hrefs, title = "Related", limit = 3 }: { current: string; hrefs?: readonly string[]; title?: string; limit?: number }) {
  const programmes = await getProgrammeRefs();
  const { prev, next } = getPrevNext(current, programmes);
  const sequential = new Set([prev?.href, next?.href].filter((href): href is string => Boolean(href)).map(normalisePath));
  const items = getRelated(current, programmes, hrefs, limit + 2)
    .filter((item) => !sequential.has(normalisePath(item.href)))
    .slice(0, limit);
  if (items.length === 0) return null;

  return (
    <section className="nv-related" aria-labelledby="nv-related-title">
      <div className="shell">
        <h2 id="nv-related-title" className="nv-related-title" data-reveal>{title}</h2>
        <ul className="nv-related-list" data-reveal="stagger">
          {items.map((pg) => (
            <li key={pg.href}>
              <Link href={pg.href} className="nv-related-card">
                <span className="nv-card-title">{pg.label}</span>
                <span className="nv-card-summary">{pg.summary}</span>
                <span className="nv-card-more">Read more <span aria-hidden="true">→</span></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
