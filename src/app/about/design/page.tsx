import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import StatusBadge from "@/components/ui/StatusBadge";
import { getSiteContent } from "@/content/get";
import { ABOUT_CTA, ABOUT_GLANCE, DESIGN, DESIGN_HERO, IDENTITY, PERFORMANCE_NATURE, PLACE } from "@/data/about";

export const metadata: Metadata = {
  title: "Design & Place",
  description: "How BaseCamp CamSur is designed: modern tropical architecture grown from the landscape, the lakes and jungle of Camarines Sur, and an outdoor performance lab where nature is your training partner.",
};

const pad = (i: number) => String(i + 1).padStart(2, "0");

// Detail template (stage-3 §7): hero → breadcrumbs → section tabs → at a glance → content → related → prev/next → CTA.
// Content (stage-3 §1): [design] [place] [performance-nature] [identity], moved from the stage-2 /about page.
export default async function AboutDesignPage() {
  const c = await getSiteContent();

  return (
    <DetailTemplate
      path="/about/design"
      hero={<PageHero {...DESIGN_HERO} />}
      glance={{
        summary: ABOUT_GLANCE.design,
        facts: [
          { label: "Design", value: DESIGN.pillars[0]?.title ?? "" },
          { label: "Setting", value: PLACE.title.replace(/\.$/, "") },
          { label: "Outdoor lab", value: `${PERFORMANCE_NATURE.items.length} planned training elements` },
        ],
      }}
      related={["/facilities", "/visit/why-camsur", "/facilities/gallery"]}
      cta={<CtaBand title={ABOUT_CTA.title} body={ABOUT_CTA.body} label={c.settings.founding.enabled ? c.settings.founding.ctaLabel || undefined : undefined} href="/contact" />}
    >
      <section id="design" className="section ab-design"><div className="shell">
        <div className="ab-split" data-reveal><div><p className="eyebrow">{DESIGN.eyebrow}</p><h2>{DESIGN.title}</h2></div><div><p className="lead">{DESIGN.intro}</p></div></div>
        <div className="ab-design-grid">
          <div className="image-frame ab-design-image" data-reveal><Image src={DESIGN.image} alt={DESIGN.imageAlt} fill sizes="(max-width: 1040px) 100vw, 50vw" className="cover-image" /></div>
          <div>
            <ol className="ab-design-pillars" data-reveal="stagger">{DESIGN.pillars.map((p, i) => <li key={p.title}><span className="ab-index">{pad(i)}</span><h3>{p.title}</h3><p>{p.body}</p></li>)}</ol>
            <ul className="ab-chips" aria-label="Architectural principles" data-reveal="stagger">{DESIGN.chips.map((chip) => <li key={chip}>{chip}</li>)}</ul>
          </div>
        </div>
        <blockquote className="ab-quote" data-reveal><p>{DESIGN.quote}</p></blockquote>
      </div></section>

      <section id="place" className="section ab-place"><div className="shell">
        <div className="ab-place-grid">
          <div className="ab-place-intro" data-reveal><p className="eyebrow">{PLACE.eyebrow}</p><h2>{PLACE.title}</h2><p className="lead">{PLACE.lead}</p><Link href={PLACE.link.href} className="text-link">{PLACE.link.label} <span>↗</span></Link></div>
          <div className="image-frame ab-place-image" data-reveal data-reveal-delay="short"><Image src={PLACE.image} alt={PLACE.imageAlt} fill sizes="(max-width: 1040px) 100vw, 50vw" className="cover-image" /></div>
        </div>
        <ul className="ab-place-list" data-reveal="stagger">{PLACE.items.map((item) => <li key={item.title}><h3>{item.title}</h3><p>{item.body}</p></li>)}</ul>
      </div></section>

      <section id="performance-nature" className="ab-nature">
        <div className="ab-nature-media"><Image src={PERFORMANCE_NATURE.image} alt={PERFORMANCE_NATURE.imageAlt} fill sizes="(max-width: 1040px) 100vw, 45vw" className="cover-image" /></div>
        <div className="ab-nature-copy">
          <div data-reveal><p className="eyebrow eyebrow-light">{PERFORMANCE_NATURE.eyebrow}</p><h2>{PERFORMANCE_NATURE.title}</h2><p className="ab-nature-sub">{PERFORMANCE_NATURE.sub}</p></div>
          <ol className="ab-nature-list" data-reveal="stagger">{PERFORMANCE_NATURE.items.map((item, i) => <li key={item.title}><span className="ab-index">{pad(i)}</span><div><h3>{item.title}</h3><p>{item.body}</p></div><StatusBadge availability="planned" /></li>)}</ol>
        </div>
      </section>

      <section id="identity" className="section ab-identity"><div className="shell">
        <div data-reveal><p className="eyebrow">{IDENTITY.eyebrow}</p><h2 className="ab-title ab-title-wide">{IDENTITY.title}</h2></div>
        <ol className="ab-cards ab-cards-3 ab-cards-flat" data-reveal="stagger">{IDENTITY.items.map((item, i) => <li key={item.title} className="ab-card"><span className="ab-index">{pad(i)}</span><h3>{item.title}</h3><p>{item.body}</p></li>)}</ol>
      </div></section>
    </DetailTemplate>
  );
}
