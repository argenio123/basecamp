import type { Metadata } from "next";
import Link from "next/link";
import localFont from "next/font/local";
import HomeScrollReveal from "@/components/HomeScrollReveal";
import ProgramCoverflow from "@/components/ProgramCoverflow";
import SocialGallery from "@/components/SocialGallery";
import HomeHeroMedia from "@/components/home/HomeHeroMedia";
import HomeOfferModal from "@/components/home/HomeOfferModal";
import DestinationPillars from "@/components/home/DestinationPillars";
import Marquee from "@/components/features/Marquee";
import EarlyAccessLink from "@/components/members/EarlyAccessLink";
import { SECTION_FEATURES } from "@/data/features";
import { TrainAndRecover } from "@/components/home/HomeSections";
import { getSiteContent } from "@/content/get";
import { POSITIONING_LINE } from "@/data/brand";
import { WORKOUT_TYPES } from "@/data/workout-types";

export const metadata: Metadata = {
  title: { absolute: "BaseCamp CamSur | Train. Transform. Thrive." },
  description: POSITIONING_LINE,
};

const gretaros = localFont({
  src: "./fonts/Gretaros-Regular.otf",
  display: "swap",
  weight: "400",
  style: "normal",
});

const destinationPillars = [
  {
    title: "TRAIN",
    description: "Purpose-built performance training zones combining CrossFit, functional fitness, and endurance programming in a world-class outdoor environment.",
    href: "/facilities/training",
    image: "/images/facilities/1st floor- crossfit area-v2.webp",
    imagePosition: "center",
  },
  {
    title: "TRANSFORM",
    description: "Comprehensive recovery infrastructure featuring contrast therapy, cold plunge pools, saunas, and dedicated wellness facilities.",
    href: "/facilities/recovery",
    image: "/images/facilities/2F Plunge.webp",
    imagePosition: "center",
  },
  {
    title: "THRIVE",
    description: "A thriving community ecosystem where athletes connect, grow, and belong. Designed for long stays and lasting impact.",
    href: "/facilities/lifestyle",
    image: "/images/facilities/1st floor- cafeteria-v2.webp",
    imagePosition: "center",
  },
];

const showHomeHeroActions = false;

// Static: only awaits the cached getSiteContent() (spec §0.17; docs 01-directives/use-cache.md).
export default async function Home() {
  const c = await getSiteContent();
  const instagram = c.settings.socials.find((s) => s.platform === "Instagram" && s.url);
  // Cheapest visible monthly membership, for the offer modal's "As low as" headline.
  const memberPrices = (c.pricing.groups.find((g) => g.id === "memberships")?.items ?? []).filter((i) => i.visible && i.price).map((i) => i.price!.min);
  const lowestMembership = memberPrices.length ? Math.min(...memberPrices) : null;

  return (
    <>
      <HomeScrollReveal />
      <HomeOfferModal offer={c.settings.founding} fromPrice={lowestMembership} />
      <div className="sticky-hero-curtain">
        <section className="home-hero">
          <HomeHeroMedia />
          <div className="home-hero-shade" />
          {showHomeHeroActions && (
            <div className="home-hero-content">
              <div className="button-row home-hero-actions">
                <EarlyAccessLink className={`button home-hero-cta home-hero-cta--primary ${gretaros.className}`}>Join early access</EarlyAccessLink>
                <Link href="/membership" className={`button home-hero-cta home-hero-cta--secondary ${gretaros.className}`}>Explore memberships</Link>
              </div>
            </div>
          )}
          <div className={`hero-index shell ${gretaros.className}`}><span>TRAIN</span><span>TRANSFORM</span><span>THRIVE</span></div>
        </section>

        <section className="destination-intro section">
          <div className="shell">
            <h1 className={gretaros.className} data-home-reveal>
              The Philippines&apos; first<br />
              integrated sports, fitness<br />
              &amp; wellness destination
            </h1>
            <p className="destination-summary" data-home-reveal data-home-reveal-delay="short">Basecamp CamSur represents a bold new category in sports tourism: an integrated destination where elite performance training, evidence-based recovery, and authentic lifestyle converge to create transformative experiences.</p>
            <DestinationPillars destinations={destinationPillars} titleClassName={gretaros.className} />
          </div>
        </section>
      </div>

      <Marquee text={SECTION_FEATURES.home.marquee} tone="dark" className={`${gretaros.className} ft-marquee--brand`} gymMarks />

      <section id="ways-to-move" className="section section-dark hm-section" data-home-reveal>
        <ProgramCoverflow titleClassName={gretaros.className} programs={WORKOUT_TYPES.map((w) => ({ title: w.title, description: w.description, image: w.image, href: `/classes/styles/${w.slug}` }))} />
        <div className="shell section-link" data-home-reveal><Link href="/classes" className="text-link light">Explore all classes</Link></div>
      </section>

      {/* Stage 4 removes the duplicate site-directory, persona tabs and daily-rhythm strip. Their canonical
          destinations remain available through the navigation, programme pages and Schedule. */}
      <TrainAndRecover c={c} titleClassName={gretaros.className} />
      {c.home.social.enabled && <SocialGallery socials={c.settings.socials} titleClassName={gretaros.className} eyebrow={c.gallery.eyebrow} title={c.gallery.title} intro={c.gallery.intro} posts={c.gallery.posts} followHref={instagram?.url ?? ""} handle={instagram?.handle || undefined} />}
    </>
  );
}
