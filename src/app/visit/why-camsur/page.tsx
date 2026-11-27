import type { Metadata } from "next";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import { Stats, Tiles } from "@/components/sections/Layouts";
import PageHero from "@/components/sections/PageHero";
import { getData } from "@/i18n/data";
import { alternatesFor } from "@/i18n/paths";
import { t } from "@/i18n/server";

// Metadata from the static visit copy in the page's language (getData; /fil/visit/why-camsur reuses this page, src/i18n/README.md).
export async function generateMetadata(): Promise<Metadata> {
  return { ...getData("visit").WHY_META, alternates: alternatesFor("/visit/why-camsur") };
}

// Two focused sections: CamSur at a glance and detailed destination advantages.
export default function WhyCamsurPage() {
  const { VISIT_CTA, WHY_CONTRAST, WHY_GLANCE, WHY_HERO, WHY_STATS, WHY_STATS_INTRO } = getData("visit");
  return (
    <DetailTemplate
      path="/visit/why-camsur"
      hero={<PageHero {...WHY_HERO} variant="editorial" frame="band" />}
      glance={{ summary: WHY_GLANCE.summary, statement: true }}
      related={["/visit/camps", "/facilities/training", "/schedule/events"]}
      cta={<CtaBand eyebrow={VISIT_CTA.eyebrow} />}
    >
      <Stats id="why-camsur" look="light" eyebrow={WHY_GLANCE.eyebrow} title={t("Why CamSur.")} intro={WHY_STATS_INTRO} items={WHY_STATS} />

      <Tiles id="why-training" eyebrow={WHY_CONTRAST.eyebrow} title={WHY_CONTRAST.title} intro={WHY_CONTRAST.intro} items={WHY_CONTRAST.items} />
    </DetailTemplate>
  );
}
