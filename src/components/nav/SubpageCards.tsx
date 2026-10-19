import Image from "next/image";
import Link from "next/link";
import { findAnyPage, findPage, type SitePage } from "@/content/sitemap";
import { getProgrammeRefs } from "./programmes";

export type SubpageCardsProps = {
  /** Overview path; cards default to all of its sub-pages. */
  section: string;
  /** Pick and order specific pages (any public path; a #hash is kept on the link). */
  hrefs?: readonly string[];
  /** Leave out pages (e.g. programme pages when the overview renders its own programme cards). */
  exclude?: readonly string[];
  eyebrow?: string;
  title?: string;
  /** ≤2 sentences. */
  intro?: string;
  /** Show the page image on each card (default true). */
  images?: boolean;
  /** Override a card's one-line summary by href. */
  summaries?: Readonly<Record<string, string>>;
  id?: string;
  dark?: boolean;
};

/** Sub-page cards (stage-3 §6/§7): image + title + one line + "Read more →", data from the site map. */
export default async function SubpageCards({ section, hrefs, exclude, eyebrow, title, intro, images = true, summaries, id, dark = false }: SubpageCardsProps) {
  const programmes = await getProgrammeRefs();
  let pages: SitePage[] = hrefs?.length
    ? hrefs.flatMap((href) => {
      const pg = findAnyPage(href, programmes);
      return pg ? [{ ...pg, href }] : [];
    })
    : findPage(section, programmes)?.section.pages ?? [];
  if (exclude?.length) pages = pages.filter((pg) => !exclude.includes(pg.href));
  if (pages.length === 0) return null;

  return (
    <section id={id} className={`section nv-cards-section${dark ? " section-dark" : ""}`}>
      <div className="shell">
        {(eyebrow || title || intro) && (
          <div className="nv-block-head" data-reveal>
            {eyebrow && <p className={`eyebrow${dark ? " eyebrow-light" : ""}`}>{eyebrow}</p>}
            {title && <h2>{title}</h2>}
            {intro && <p className="nv-block-intro">{intro}</p>}
          </div>
        )}
        <ul className="nv-cards" data-reveal="stagger">
          {pages.map((pg) => (
            <li key={pg.href}>
              <Link href={pg.href} className="nv-card">
                {images && pg.image && (
                  <span className="nv-card-image">
                    <Image src={pg.image} alt="" fill sizes="(max-width: 760px) 100vw, (max-width: 1040px) 50vw, 33vw" className="cover-image" />
                  </span>
                )}
                <span className="nv-card-body">
                  <span className="nv-card-title">{pg.label}</span>
                  <span className="nv-card-summary">{summaries?.[pg.href] ?? pg.summary}</span>
                  <span className="nv-card-more">Read more <span aria-hidden="true">→</span></span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
