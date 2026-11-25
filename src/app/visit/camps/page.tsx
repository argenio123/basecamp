import type { Metadata } from "next";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import StyleSteps from "@/components/programs/StyleSteps";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import CampJourney from "@/components/visit/CampJourney";
import { CAMPS, CAMPS_CTA, CAMPS_GLANCE, CAMPS_HERO, CAMPS_META } from "@/data/visit";

// Static metadata object (01-app/03-api-reference/04-functions/generate-metadata.md#the-metadata-object).
export const metadata: Metadata = CAMPS_META;

// Two focused sections: the benefits of camping at BaseCamp and the camp experience.
export default function CampsPage() {
  return (
    <DetailTemplate
      path="/visit/camps"
      hero={<PageHero {...CAMPS_HERO} />}
      glance={{ summary: CAMPS_GLANCE.summary, statement: true }}
      related={["/visit/why-camsur", "/membership/price-guide"]}
      cta={<CtaBand eyebrow={CAMPS_CTA.eyebrow} />}
    >
      {/* Same layout as "How a session runs" on class pages: sticky photo left, benefits scroll right. */}
      <section className="section pr-dev-steps" id="camps" aria-labelledby="vc-camps-title">
        <div className="shell">
          <p className="pr-dev-label pr-dev-label-light" data-reveal>{CAMPS.eyebrow}</p>
          <h2 id="vc-camps-title" data-reveal data-reveal-delay="short">{CAMPS.title}</h2>
        </div>
        <StyleSteps className="Camps & trips" caption={CAMPS.caption} steps={CAMPS.benefits} />
      </section>

      <CampJourney eyebrow={CAMPS.flowEyebrow} title={CAMPS.flowTitle} note={CAMPS.flowNote} stages={CAMPS.flow} />
    </DetailTemplate>
  );
}
