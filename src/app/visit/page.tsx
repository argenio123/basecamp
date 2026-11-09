import type { Metadata } from "next";
import FindUs from "@/components/features/FindUs";
import { OverviewTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import ScheduleExplore from "@/components/schedule/ScheduleExplore";
import { getSiteContent } from "@/content/get";
import { findPage } from "@/content/sitemap";
import { GETTING_THERE, VISIT_CTA, VISIT_GLANCE, VISIT_HERO, VISIT_META } from "@/data/visit";

// Static metadata object (01-app/03-api-reference/04-functions/generate-metadata.md#the-metadata-object).
export const metadata: Metadata = VISIT_META;

/** Summary + image for each Visit menu highlight, so this list mirrors the navbar / footer highlights. */
const HIGHLIGHT_DETAILS: Record<string, { summary: string; image: string; imageAlt: string }> = {
  "/visit/camps": { summary: "Training camps, travel packages, and group trips for traveling athletes.", image: "/images/destination/thrive.png", imageAlt: "Athlete training on gymnastic rings" },
  "/visit/camps#long-stays": { summary: "Stay for weeks or months: training, co-working, and recovery in one place.", image: "/images/destination/train.png", imageAlt: "Coach guiding a stretching session with residences outside" },
  "/visit/why-camsur": { summary: "Why athletes choose Camarines Sur: cooler lakes, forest, and room to train.", image: "/images/facilities/facility-aerial.jpg", imageAlt: "Aerial view of the BaseCamp CamSur site" },
  "/visit/why-camsur#lago-del-rey": { summary: "Paddle training, open-water swimming, and conditioning on a protected lake.", image: "/images/facilities/facility-landscape.jpg", imageAlt: "The CamSur landscape around BaseCamp" },
};

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
      glance={{ summary: VISIT_GLANCE.summary, statement: true }}
      cards={false}
      quote={false}
      cta={<CtaBand eyebrow={VISIT_CTA.eyebrow} />}
    >
      <ScheduleExplore
        eyebrow="Plan your visit"
        title="Camps & CamSur."
        intro="Training camps, group trips, and extended stays, plus why Camarines Sur is the place to train."
        items={(findPage("/visit", [])?.section.menu?.highlights ?? []).flatMap((h) => {
          const d = HIGHLIGHT_DETAILS[h.href];
          return d ? [{ href: h.href, label: h.label, ...d }] : [];
        })}
      />
      <FindUs contact={contact} title={GETTING_THERE.title} id="find-us" />
    </OverviewTemplate>
  );
}
