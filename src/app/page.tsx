import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import HomeScrollReveal from "@/components/HomeScrollReveal";
import ProgramCoverflow from "@/components/ProgramCoverflow";
import SocialGallery from "@/components/SocialGallery";
import HomeHeroMedia from "@/components/home/HomeHeroMedia";
import Marquee from "@/components/features/Marquee";
import { SECTION_FEATURES } from "@/data/features";
import { EarlyAccess, TrainAndRecover } from "@/components/home/HomeSections";
import { getSiteContent } from "@/content/get";
import { programmeHref } from "@/content/sitemap";
import { POSITIONING_LINE } from "@/data/brand";

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
    image: "/images/destination/train.png",
    imagePosition: "center",
  },
  {
    title: "TRANSFORM",
    description: "Comprehensive recovery infrastructure featuring contrast therapy, cold plunge pools, saunas, and dedicated wellness facilities.",
    href: "/facilities/recovery",
    image: "/images/destination/transform.png",
    imagePosition: "center",
  },
  {
    title: "THRIVE",
    description: "A thriving community ecosystem where athletes connect, grow, and belong. Designed for long stays and lasting impact.",
    href: "/facilities/lifestyle",
    image: "/images/destination/thrive.png",
    imagePosition: "right center",
  },
];

// Static: only awaits the cached getSiteContent() (spec §0.17; docs 01-directives/use-cache.md).
export default async function Home() {
  const c = await getSiteContent();
  const instagram = c.settings.socials.find((s) => s.platform === "Instagram" && s.url);

  return (
    <>
      <HomeScrollReveal />
      <div className="sticky-hero-curtain">
        <section className="home-hero">
          <HomeHeroMedia />
          <div className="home-hero-shade" />
          <div className="home-hero-content">
            <div className="button-row home-hero-actions">
              <Link href="#early-access" className={`button home-hero-cta home-hero-cta--primary ${gretaros.className}`}>Join early access</Link>
              <Link href="/membership" className={`button home-hero-cta home-hero-cta--secondary ${gretaros.className}`}>Explore memberships</Link>
            </div>
          </div>
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
            <div className="destination-pillars">
              {destinationPillars.map(({ title, description, href, image, imagePosition }, index) => (
                <Link
                  href={href}
                  className="destination-pillar"
                  aria-label={`Learn more about ${title.toLowerCase()}`}
                  data-home-reveal
                  data-home-reveal-delay={index === 0 ? "medium" : index === 1 ? "long" : "longer"}
                  key={title}
                >
                  <span className="destination-pillar-media" aria-hidden="true">
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="(max-width: 760px) calc(100vw - 36px), 33vw"
                      className={`destination-pillar-image${title === "THRIVE" ? " destination-pillar-image--thrive" : ""}`}
                      style={{ objectPosition: imagePosition }}
                    />
                  </span>
                  <span className="destination-pillar-content">
                    <span className="destination-pillar-copy">{description}</span>
                    <span className={`${gretaros.className} destination-pillar-title`}>{title}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Marquee text={SECTION_FEATURES.home.marquee} tone="dark" className={`${gretaros.className} ft-marquee--brand`} gymMarks />

      <section id="ways-to-move" className="section section-dark hm-section" data-home-reveal>
        <ProgramCoverflow titleClassName={gretaros.className} programs={c.programmes.featured.map((p) => ({ title: p.title, description: p.description, image: p.image, href: programmeHref(p.slug) }))} />
        <div className="shell section-link" data-home-reveal><Link href="/classes" className="text-link light">Explore all classes <span>↗</span></Link></div>
      </section>

      {/* Stage 4 removes the duplicate site-directory, persona tabs and daily-rhythm strip. Their canonical
          destinations remain available through the navigation, programme pages and Schedule. */}
      <TrainAndRecover c={c} titleClassName={gretaros.className} />
      {c.home.social.enabled && <SocialGallery socials={c.settings.socials} titleClassName={gretaros.className} eyebrow={c.gallery.eyebrow} title={c.gallery.title} intro={c.gallery.intro} posts={c.gallery.posts} followHref={instagram?.url ?? ""} handle={instagram?.handle || undefined} />}
      <EarlyAccess c={c} titleClassName={gretaros.className} />
    </>
  );
}
