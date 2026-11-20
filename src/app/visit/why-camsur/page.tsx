import type { Metadata } from "next";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import { Split, Stats, Tiles } from "@/components/sections/Layouts";
import PageHero from "@/components/sections/PageHero";
import StatusBadge from "@/components/ui/StatusBadge";
import { LAGO, VISIT_CTA, WHY_CONTRAST, WHY_GLANCE, WHY_HERO, WHY_META, WHY_STATS } from "@/data/visit";

// Static metadata object (01-app/03-api-reference/04-functions/generate-metadata.md#the-metadata-object).
export const metadata: Metadata = WHY_META;

// Three sections, three looks: why CamSur (big-word strip) → Lago Del Rey (photo + activity chips) → Bali / Phuket /
// CamSur (dark tiles). Anchors kept: #why-camsur, #lago-del-rey. Fully static.
export default function WhyCamsurPage() {
  return (
    <DetailTemplate
      path="/visit/why-camsur"
      hero={<PageHero {...WHY_HERO} />}
      glance={{ summary: WHY_GLANCE.summary, statement: true }}
      related={["/visit/camps", "/facilities/training", "/schedule/events"]}
      cta={<CtaBand eyebrow={VISIT_CTA.eyebrow} />}
    >
      <Stats id="why-camsur" eyebrow={WHY_GLANCE.eyebrow} title="Why CamSur." items={WHY_STATS} />

      <Split id="lago-del-rey" eyebrow={LAGO.eyebrow} title={LAGO.title} body={LAGO.body} chips={LAGO.chips}
        badge={<StatusBadge availability="planned" label={LAGO.note} />} image={LAGO.image} imageAlt={LAGO.imageAlt} />

      <Tiles eyebrow={WHY_CONTRAST.eyebrow} title={WHY_CONTRAST.title} items={WHY_CONTRAST.items} />
    </DetailTemplate>
  );
}
