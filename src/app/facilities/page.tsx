import type { Metadata } from "next";
import Link from "next/link";
import ItemList from "@/components/facilities/ItemList";
import { statFact } from "@/components/facilities/facts";
import { OverviewTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { FACILITY_ANCHORS } from "@/content/constants";
import { getSiteContent } from "@/content/get";
import { currentHrefFor } from "@/content/sitemap";
import { ARRIVAL, DESIGN, FACILITIES_CTA, FACILITIES_HERO, ZONES } from "@/data/facilities";

// Static metadata object (node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md).
export const metadata: Metadata = {
  title: "Facilities",
  description: "The planned BaseCamp CamSur facility in Camarines Sur: modern tropical design, 673 square meters of outdoor training, a recovery level and spaces to stay longer.",
};

const zoneNo = (i: number) => String(i + 1).padStart(2, "0");

// Stage-3 §1 overview: At a glance · [design] · [arrival] · cards → 4 sub-pages · CTA.
// Static rule (spec §0.17): only awaits the cached getSiteContent() ('use cache' + cacheTag, see
// node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache.md), so the page prerenders.
// Legacy #anchors (e.g. /facilities#recovery) are forwarded by the root layout's <HashForwarder />.
export default async function FacilitiesPage() {
  const c = await getSiteContent();
  const stats = c.home.stats.items;

  return (
    <OverviewTemplate
      path="/facilities"
      hero={<PageHero {...FACILITIES_HERO} />}
      glance={{
        summary: "Training zones, a recovery-forward wellness level and spaces to stay longer, designed around climate, light and landscape in Camarines Sur.",
        facts: [statFact(stats, "sqm"), statFact(stats, "zones"), statFact(stats, "floor"), statFact(stats, "modalities")],
      }}
      cta={<CtaBand {...FACILITIES_CTA} />}
    >
      <section id="design" className="section shell">
        <div className="split-heading light-split" data-reveal><div><p className="eyebrow">{DESIGN.eyebrow}</p><h2>{DESIGN.title}</h2></div><blockquote className="fc-pull">{DESIGN.quote}</blockquote></div>
        <p className="fc-design-summary" data-reveal>See how tropical architecture, natural ventilation and landscape shape the complete BaseCamp experience.</p>
        <Link className="button button-dark" href="/about/design">Explore the design approach <span aria-hidden="true">↗</span></Link>
      </section>

      <section id="zones" className="section fc-zone-deep" aria-labelledby="fc-journey-title">
        <div className="shell">
          <div className="split-heading light-split" data-reveal><div><p className="eyebrow">Zone journey</p><h2 id="fc-journey-title">From arrival to the lounge.</h2></div><p>Five zones, in the order you move through them.</p></div>
          <ol className="fc-journey" data-reveal="stagger">
            {ZONES.map((z, i) => {
              const href = z.anchor === FACILITY_ANCHORS.arrival ? `#${z.anchor}` : currentHrefFor("/facilities", z.anchor);
              return <li key={z.anchor}><Link href={href}><span className="fc-index">{zoneNo(i)}</span><span className="fc-journey-label">{z.label}</span><span aria-hidden="true">{href.startsWith("#") ? "↓" : "→"}</span></Link></li>;
            })}
          </ol>
        </div>
      </section>

      <section id={FACILITY_ANCHORS.arrival} className="section">
        <div className="shell">
          <div className="split-heading light-split" data-reveal><div><p className="eyebrow">Zone 01</p><h2>{ARRIVAL.title}</h2></div><p>{ARRIVAL.intro}</p></div>
          <ItemList items={ARRIVAL.items} cols={2} />
        </div>
      </section>
    </OverviewTemplate>
  );
}
