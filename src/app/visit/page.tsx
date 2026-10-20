import type { Metadata } from "next";
import FindUs from "@/components/features/FindUs";
import { OverviewTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import VisitItems from "@/components/visit/VisitItems";
import { getSiteContent } from "@/content/get";
import { GETTING_THERE, VISIT_CTA, VISIT_GLANCE, VISIT_HERO, VISIT_META } from "@/data/visit";

// Static metadata object (01-app/03-api-reference/04-functions/generate-metadata.md#the-metadata-object).
export const metadata: Metadata = VISIT_META;

// Overview (stage-3 §1/§7): hero → section tabs → at a glance → sub-page cards (Camps, Why CamSur) → getting there + map → CTA.
// Legacy /visit#camps, #long-stays, #why-camsur, #lago-del-rey are forwarded by the root layout's <HashForwarder />.
// Static rule (spec §0.17): only awaits the cached getSiteContent(), so the page prerenders.
// Docs: node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache.md
export default async function VisitPage() {
  const c = await getSiteContent();
  const { contact } = c.settings;

  return (
    <OverviewTemplate
      path="/visit"
      hero={<PageHero {...VISIT_HERO} />}
      glance={{
        summary: VISIT_GLANCE.summary,
        facts: [
          { label: "Region", value: "Camarines Sur" },
          { label: "Access", value: GETTING_THERE.line.replace(/\.$/, "") },
          { label: "Airports", value: GETTING_THERE.airports },
        ],
      }}
      cta={<CtaBand eyebrow={VISIT_CTA.eyebrow} />}
    >
      <FindUs contact={contact} title={GETTING_THERE.title} id="find-us" />
      <section id="getting-there" className="section vt-deep">
        <div className="shell">
          <VisitItems items={GETTING_THERE.options} label={GETTING_THERE.eyebrow} />
          <p className="vt-line" data-reveal>{GETTING_THERE.line}</p>
        </div>
      </section>
    </OverviewTemplate>
  );
}
