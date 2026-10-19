import type { Metadata } from "next";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import StatusBadge from "@/components/ui/StatusBadge";
import VisitItems from "@/components/visit/VisitItems";
import { getSiteContent } from "@/content/get";
import { LAGO, VISIT_CTA, WHY_GLANCE, WHY_HERO, WHY_META } from "@/data/visit";

// Static metadata object (01-app/03-api-reference/04-functions/generate-metadata.md#the-metadata-object).
export const metadata: Metadata = WHY_META;

// Detail (stage-3 §1/§7): why CamSur (content `whyCamsur`) + Lago Del Rey. Anchors kept: #why-camsur, #lago-del-rey.
// Static rule (spec §0.17): only awaits the cached getSiteContent(), so the page prerenders.
export default async function WhyCamsurPage() {
  const c = await getSiteContent();
  const why = c.whyCamsur;

  return (
    <DetailTemplate
      path="/visit/why-camsur"
      hero={<PageHero {...WHY_HERO} />}
      glance={{
        summary: WHY_GLANCE.summary,
        facts: [...why.reasons.slice(0, 3).map((r) => r.title), { label: "On the water", value: LAGO.eyebrow }],
      }}
      related={["/visit/camps", "/facilities/training", "/schedule/events"]}
      cta={<CtaBand eyebrow={VISIT_CTA.eyebrow} />}
    >
      <section id="why-camsur" className="section shell">
        <div className="split-heading light-split" data-reveal>
          <div><p className="eyebrow">{WHY_GLANCE.eyebrow}</p><h2>{why.title}</h2></div>
          {why.intro && <p>{why.intro}</p>}
        </div>
        {why.reasons.length > 0 && (
          <ol className="vt-reasons" data-reveal="stagger">
            {why.reasons.map((r, i) => <li key={r.id}><span className="vt-index">{String(i + 1).padStart(2, "0")}</span><h3>{r.title}</h3><p>{r.body}</p></li>)}
          </ol>
        )}
        {why.story && <p className="lead vt-story" data-reveal>{why.story}</p>}
      </section>

      <section id="lago-del-rey" className="section section-dark">
        <div className="shell">
          <div className="split-heading" data-reveal>
            <div><p className="eyebrow eyebrow-light">{LAGO.eyebrow}</p><h2>{LAGO.title}</h2></div>
            <div><StatusBadge availability="planned" label={LAGO.note} /></div>
          </div>
          <VisitItems items={LAGO.items} cols={5} label={LAGO.eyebrow} />
          <p className="lead vt-story" data-reveal>{LAGO.closing}</p>
        </div>
      </section>
    </DetailTemplate>
  );
}
