import type { Metadata } from "next";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import { Stats, Tiles } from "@/components/sections/Layouts";
import PageHero from "@/components/sections/PageHero";
import { VISIT_CTA, WHY_CONTRAST, WHY_GLANCE, WHY_HERO, WHY_META, WHY_STATS, WHY_STATS_INTRO } from "@/data/visit";

// Static metadata object (01-app/03-api-reference/04-functions/generate-metadata.md#the-metadata-object).
export const metadata: Metadata = WHY_META;

// Two focused sections: CamSur at a glance and detailed destination advantages.
export default function WhyCamsurPage() {
  return (
    <DetailTemplate
      path="/visit/why-camsur"
      hero={<PageHero {...WHY_HERO} />}
      glance={{ summary: WHY_GLANCE.summary, statement: true }}
      related={["/visit/camps", "/facilities/training", "/schedule/events"]}
      cta={<CtaBand eyebrow={VISIT_CTA.eyebrow} />}
    >
      <Stats id="why-camsur" look="light" eyebrow={WHY_GLANCE.eyebrow} title="Why CamSur." intro={WHY_STATS_INTRO} items={WHY_STATS} />

      <Tiles id="why-training" eyebrow={WHY_CONTRAST.eyebrow} title={WHY_CONTRAST.title} intro={WHY_CONTRAST.intro} items={WHY_CONTRAST.items} />
    </DetailTemplate>
  );
}
