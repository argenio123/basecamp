import type { Metadata } from "next";
import Image from "next/image";
import { OverviewTemplate } from "@/components/nav/PageTemplates";
import ScheduleExplore from "@/components/schedule/ScheduleExplore";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { getSiteContent } from "@/content/get";
import { findPage } from "@/content/sitemap";
import { facilitiesVideo } from "@/data/brand";
import { DESIGN, FACILITIES_CTA, FACILITIES_HERO } from "@/data/facilities";

// Static metadata object (node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md).
export const metadata: Metadata = {
  title: "Facilities",
  description: "The planned BaseCamp CamSur facility in Camarines Sur: modern tropical design, 673 square meters of outdoor training, a recovery level, and spaces to stay longer.",
};

// The overview uses the latest interior renders as one visual family. The hero remains the
// architectural walkthrough; these cards let visitors see the spaces they can actually use.
const FACILITY_PREVIEWS: Record<string, { description: string; image: string; imageAlt: string }> = {
  "/facilities/training": {
    description: "A complete fitness gym and dedicated functional training floor.",
    image: "/images/facilities/1st floor- gym area-v2.png",
    imageAlt: "Rendered interior of the BaseCamp gym with cardio and strength equipment",
  },
  "/facilities/recovery": {
    description: "Contrast therapy, treatment rooms, and a recovery level built for volume.",
    image: "/images/facilities/2F Plunge.png",
    imageAlt: "Rendered BaseCamp recovery level with hot and cold plunge pools",
  },
  "/facilities/lifestyle": {
    description: "Food, movement, and social spaces designed for a full day at BaseCamp.",
    image: "/images/facilities/1st floor- cafeteria-v2.png",
    imageAlt: "Rendered BaseCamp cafeteria with communal tables and warm timber finishes",
  },
  "/facilities/gallery": {
    description: "Walk through the training, recovery, and shared spaces in detail.",
    image: "/images/facilities/1st floor- crossfit area-v2.png",
    imageAlt: "Rendered BaseCamp functional training area with rigs and open floor space",
  },
};

// Facilities overview: hero, at-a-glance statement, facility categories, design, and CTA.
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
  const stats = c.home.stats.items;
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
        intro="One connected environment for focused work, deliberate recovery, and the time between sessions."
        items={facilityPages.flatMap((page) => {
          const preview = FACILITY_PREVIEWS[page.href];
          return preview ? [{ href: page.href, label: page.label, summary: preview.description, image: preview.image, imageAlt: preview.imageAlt }] : [];
        })}
      />
      {/* Design: the facility render becomes the section canvas; the headline and homepage facility stats sit
          above a dark wash for the same image-led treatment used across the brand. */}
      <section id="design" className="section fc-design-section">
        <Image
          src="/images/facilities/facility-front.jpg"
          alt=""
          fill
          sizes="100vw"
          className="cover-image fc-design-background"
        />
        <div className="fc-design-shade" aria-hidden="true" />
        <div className="shell fc-design">
          <div className="fc-design-copy" data-reveal>
            <p className="eyebrow eyebrow-light">Train &amp; recover</p>
            <h2>{DESIGN.title}</h2>
            <p className="fc-design-summary">Training spaces are deliberately open and visible: a training ecosystem where effort is celebrated and community is built through shared work.</p>
          </div>
          {stats.length > 0 && (
            <dl className="fc-design-stats" data-reveal data-reveal-delay="short">
              {stats.map((stat) => (
                <div key={stat.id}>
                  <dt>{stat.label}</dt>
                  <dd className="fc-design-stat-value">{stat.value}</dd>
                  {stat.detail && <dd className="fc-design-stat-detail">{stat.detail}</dd>}
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

    </OverviewTemplate>
  );
}
