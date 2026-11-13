import type { Metadata } from "next";
import { OverviewTemplate } from "@/components/nav/PageTemplates";
import ScheduleExplore from "@/components/schedule/ScheduleExplore";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { getSiteContent } from "@/content/get";
import { findPage } from "@/content/sitemap";
import { facilitiesVideo } from "@/data/brand";
import { FACILITIES_CTA, FACILITIES_HERO } from "@/data/facilities";

// Static metadata object (node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md).
export const metadata: Metadata = {
  title: "Facilities",
  description: "The planned BaseCamp CamSur facility in Camarines Sur: modern tropical design, 673 square meters of outdoor training, a recovery level, and spaces to stay longer.",
};

// The overview uses the latest interior renders as one visual family. The hero remains the
// architectural walkthrough; these cards let visitors see the spaces they can actually use.
const FACILITY_PREVIEWS: Record<string, { description: string; image: string; imageAlt: string }> = {
  "/facilities/training": {
    description: "CrossFit-style area, gym and yoga studio.",
    image: "/images/facilities/1st floor- gym area-v2.png",
    imageAlt: "Rendered interior of the BaseCamp gym with cardio and strength equipment",
  },
  "/facilities/recovery": {
    description: "Plunge pools, hyperbaric and therapy rooms.",
    image: "/images/facilities/2F Plunge.png",
    imageAlt: "Rendered BaseCamp recovery level with hot and cold plunge pools",
  },
  "/facilities/lifestyle": {
    description: "Lobby, café, work area and lockers.",
    image: "/images/facilities/1st floor- cafeteria-v2.png",
    imageAlt: "Rendered BaseCamp cafeteria with communal tables and warm timber finishes",
  },
};

// Facilities overview: hero, at-a-glance statement, facility categories, and CTA.
// Static rule (spec §0.17): only awaits the cached getSiteContent() ('use cache' + cacheTag, see
// node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache.md), so the page prerenders.
// Legacy #anchors (e.g. /facilities#recovery) are forwarded by the root layout's <HashForwarder />.
// Compressed H.264 copies of the 86 MB, 1920×1080 source (see facilitiesVideo): ~5.6 MB desktop, ~3.3 MB mobile.
// The hero box (fitVideo) is 16:9 like the video, so nothing is cropped.
const FACILITIES_HERO_VIDEO = {
  src: facilitiesVideo(1920, 1080),
  mobileSrc: facilitiesVideo(1280, 720),
};

export default async function FacilitiesPage() {
  const c = await getSiteContent();
  const facilityPages = findPage("/facilities", c.programmes.featured)?.section.pages ?? [];

  return (
    <OverviewTemplate
      path="/facilities"
      hero={<PageHero {...FACILITIES_HERO} video={FACILITIES_HERO_VIDEO} fitVideo />}
      glance={{
        summary: "Training zones.\nA recovery level.\nSpaces to stay longer.",
        statement: true,
      }}
      cards={false}
      quote={false}
      marquee={false}
      cta={<CtaBand {...FACILITIES_CTA} />}
    >
      <ScheduleExplore
        eyebrow="Explore the facility"
        title="Train. Recover. Stay."
        intro="Two floors. One connected space."
        items={facilityPages.flatMap((page) => {
          const preview = FACILITY_PREVIEWS[page.href];
          return preview ? [{ href: page.href, label: page.label, summary: preview.description, image: preview.image, imageAlt: preview.imageAlt }] : [];
        })}
      />

    </OverviewTemplate>
  );
}
