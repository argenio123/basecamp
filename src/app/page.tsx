import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import HomeScrollReveal from "@/components/HomeScrollReveal";
import ProgramCoverflow from "@/components/ProgramCoverflow";
import SocialGallery from "@/components/SocialGallery";
import CtaBand from "@/components/sections/CtaBand";
import { programs } from "@/data/site";

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
    image: "/images/destination/train.png",
    imagePosition: "center",
  },
  {
    title: "TRANSFORM",
    description: "Comprehensive recovery infrastructure featuring contrast therapy, cold plunge pools, saunas, and dedicated wellness facilities.",
    image: "/images/destination/transform.png",
    imagePosition: "center",
  },
  {
    title: "THRIVE",
    description: "A thriving community ecosystem where athletes connect, grow, and belong. Designed for long stays and lasting impact.",
    image: "/images/destination/thrive.png",
    imagePosition: "right center",
  },
];

export default function Home() {
  return (
    <>
      <HomeScrollReveal />
      <div className="sticky-hero-curtain">
        <section className="home-hero">
          <video
            className="home-hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/hero/hero-training.png"
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src="https://res.cloudinary.com/nkk9rbc7/video/upload/basecamp-hero.mp4" type="video/mp4" />
          </video>
          <div className="home-hero-shade" />
          <div className="home-hero-content">
            <div className="button-row"><Link href="/contact" className="button button-light">Start your journey <span>↗</span></Link><Link href="/programs" className="button button-ghost">Discover training</Link></div>
          </div>
          <div className="hero-index shell"><span>TRAIN</span><span>TRANSFORM</span><span>THRIVE</span></div>
        </section>

        <section className="destination-intro section">
          <div className="shell">
            <h2 className={gretaros.className} data-home-reveal>
              The Philippines&apos; first<br />
              integrated sports, fitness<br />
              &amp; wellness destination
            </h2>
            <p className="destination-summary" data-home-reveal data-home-reveal-delay="short">Basecamp CamSur represents a bold new category in sports tourism: an integrated destination where elite performance training, evidence-based recovery, and authentic lifestyle converge to create transformative experiences.</p>
            <div className="destination-pillars">
              {destinationPillars.map(({ title, description, image, imagePosition }, index) => (
                <button
                  type="button"
                  className="destination-pillar"
                  aria-label={`${title}: ${description}`}
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
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section id="ways-to-move" className="section section-dark">
        <div className="shell section-heading split-heading" data-home-reveal><div><h2>Find your<br />training rhythm.</h2></div><p>From focused coaching to high-energy sessions and recovery-led movement, Basecamp is designed to meet you where you are.</p></div>
        <ProgramCoverflow programs={programs} />
        <div className="shell section-link" data-home-reveal><Link href="/programs" className="text-link light">Explore all programs <span>↗</span></Link></div>
      </section>

      <section className="facility-feature section">
        <Image src="/images/facilities/facility-background-a1-5-b.jpg" alt="" fill sizes="100vw" className="facility-feature-background" />
        <div className="facility-feature-shade" aria-hidden="true" />
        <div className="facility-feature-inner shell" data-home-reveal>
          <div className="facility-copy"><h2>Designed around how you live.</h2><p className="lead">Training spaces, recovery areas, and places to connect—brought together as one considered experience.</p><Link href="/facilities" className="button button-light">Explore the facility <span>↗</span></Link></div>
        </div>
      </section>

      <SocialGallery />
      <CtaBand revealOnScroll />
    </>
  );
}
