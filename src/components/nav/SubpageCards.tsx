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
  /** Override a card's label, summary or image by href (e.g. several cards pointing into one page). */
  overrides?: Readonly<Record<string, Partial<Pick<SitePage, "label" | "summary" | "image" | "imageAlt">>>>;
  id?: string;
  dark?: boolean;
  /** "feature": two large photo cards per row with the text over the image (Membership). */
  variant?: "default" | "feature";
};

/** Sub-page cards (stage-3 §6/§7): image + title + one line + "Read more →", data from the site map. */
export default async function SubpageCards({ section, hrefs, exclude, eyebrow, title, intro, images = true, summaries, overrides, id, dark = false, variant = "default" }: SubpageCardsProps) {
  const programmes = await getProgrammeRefs();
  let pages: SitePage[] = hrefs?.length
    ? hrefs.flatMap((href) => {
      const pg = findAnyPage(href, programmes);
      return pg ? [{ ...pg, href }] : [];
    })
    : findPage(section, programmes)?.section.pages ?? [];
  if (exclude?.length) pages = pages.filter((pg) => !exclude.includes(pg.href));
  if (overrides) pages = pages.map((pg) => ({ ...pg, ...overrides[pg.href] }));
  if (pages.length === 0) return null;

  if (variant === "feature") {
    return (
      <section id={id} className="section nv-cards-section nv-feature-section">
        <div className="shell">
          <div className="nv-feature-head" data-reveal>
            <div>
              {eyebrow && <p className="eyebrow">{eyebrow}</p>}
              {title && <h2>{title}</h2>}
            </div>
            <div className="nv-feature-meta">
              {intro && <p>{intro}</p>}
            </div>
          </div>
          <ul className="nv-feature-grid" data-reveal="stagger">
            {pages.map((pg) => (
              <li key={pg.href}>
                <Link href={pg.href} className="nv-fcard">
                  {pg.image && <Image src={pg.image} alt="" fill sizes="(max-width: 680px) 100vw, 50vw" className="cover-image nv-fcard-image" />}
                  <span className="nv-fcard-shade" aria-hidden="true" />
                  <span className="nv-fcard-body">
                    <span className="nv-fcard-title">{pg.label}</span>
                    <span className="nv-fcard-summary">{summaries?.[pg.href] ?? pg.summary}</span>
                    <span className="nv-fcard-cta">Explore</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

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
                  <span className="nv-card-more">Read more</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
