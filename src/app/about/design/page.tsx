import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import StatusBadge from "@/components/ui/StatusBadge";
import { getSiteContent } from "@/content/get";
import { ABOUT_CTA, ABOUT_GLANCE, DESIGN, DESIGN_HERO, PERFORMANCE_NATURE, PLACE } from "@/data/about";

export const metadata: Metadata = {
  title: "Design & Place",
  description: "How BaseCamp CamSur is designed: modern tropical architecture grown from the landscape, an outdoor training lab, and the lakes, jungle, and mountains of Camarines Sur around it.",
};

const pad = (i: number) => String(i + 1).padStart(2, "0");
const i = (n: number) => ({ "--i": n }) as CSSProperties;

/** Short labels for the places around BaseCamp (left column of each row). */
const PLACE_LABELS = ["Lake", "Water sports", "Lodging", "Landscape", "Access", "Wellness"];

// Detail template: hero → statement → How it's built (render + design rows) → Train outdoors (Ink board of tiles)
// → Around BaseCamp (rows) → CTA. Same heading / row / board language as Schedule, Events, Camps, About, and Contact.
// Anchors kept for older links: #design, #performance-nature, #place.
export default async function AboutDesignPage() {
  const c = await getSiteContent();

  return (
    <DetailTemplate
      path="/about/design"
      hero={<PageHero title={DESIGN_HERO.title} intro={DESIGN_HERO.intro} image={DESIGN_HERO.image} imageAlt={DESIGN_HERO.imageAlt} />}
      glance={{ summary: ABOUT_GLANCE.design, statement: true }}
      cta={<CtaBand title={ABOUT_CTA.title} body={ABOUT_CTA.body} label={c.settings.founding.enabled ? c.settings.founding.ctaLabel || undefined : undefined} href="/contact" />}
    >
      <section id="design" className="section sd-ev">
        <div className="shell">
          <div className="sd-tt-head sd-tt-head-light" data-reveal>
            <div><p className="sd-tt-eyebrow">How it&apos;s built</p><h2>{DESIGN.title}</h2></div>
            <p>{DESIGN.intro} {DESIGN.quote}</p>
          </div>
          <div className="ds-split">
            <div className="ds-media" data-reveal><Image src={DESIGN.image} alt={DESIGN.imageAlt} fill sizes="(max-width: 1000px) 100vw, 45vw" className="cover-image" /></div>
            <ol className="sd-ev-rows" data-reveal="stagger">
              {DESIGN.pillars.map((p, n) => (
                <li key={p.title} className="sd-ev-row sd-ev-row-static ab3-row ds-row" style={i(n)}>
                  <div>
                    <span className="sd-ev-when"><strong>{pad(n)}</strong></span>
                    <span className="sd-ev-body"><span className="sd-ev-title">{p.title}</span><span className="sd-ev-desc">{p.body}.</span></span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="performance-nature" className="section sd-ev sd-ev-dark">
        <div className="shell">
          <div className="sd-tt-head" data-reveal>
            <div><p className="sd-tt-eyebrow">Train outdoors</p><h2>{PERFORMANCE_NATURE.title}</h2></div>
            <p>{PERFORMANCE_NATURE.sub}</p>
          </div>
          <div className="sd-ev-board">
            <ol className="sd-ev-tiles" data-reveal="stagger">
              {PERFORMANCE_NATURE.items.map((item, n) => (
                <li key={item.title}>
                  <span className="sd-ev-num">{pad(n)}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                  <StatusBadge availability="planned" />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="place" className="section sd-ev sd-ev-band">
        <div className="shell">
          <div className="sd-tt-head sd-tt-head-light" data-reveal>
            <div><p className="sd-tt-eyebrow">Around BaseCamp</p><h2>Lakes, jungle, and mountains.</h2></div>
            <p>{PLACE.lead}</p>
          </div>
          <ol className="sd-ev-rows" data-reveal="stagger">
            {PLACE.items.map((item, n) => (
              <li key={item.title} className="sd-ev-row sd-ev-row-static ab3-row" style={i(n)}>
                <div>
                  <span className="sd-ev-when"><strong>{pad(n)}</strong><small>{PLACE_LABELS[n] ?? ""}</small></span>
                  <span className="sd-ev-body"><span className="sd-ev-title">{item.title}</span><span className="sd-ev-desc">{item.body}</span></span>
                </div>
              </li>
            ))}
          </ol>
          <p className="ds-more" data-reveal><Link href={PLACE.link.href} className="text-link">{PLACE.link.label}</Link></p>
        </div>
      </section>
    </DetailTemplate>
  );
}
