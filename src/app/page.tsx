import Image from "next/image";
import Link from "next/link";
import HomeScrollReveal from "@/components/HomeScrollReveal";
import CtaBand from "@/components/sections/CtaBand";
import { programs } from "@/data/site";

const programAudiences = [
  {
    title: "Strength & Conditioning",
    description: "Purposeful training that builds capacity, confidence, and durable strength.",
  },
  {
    title: "Functional Training",
    description: "Coach-led sessions designed around movement quality and real-world performance.",
  },
  {
    title: "Personal Coaching",
    description: "Focused guidance shaped around your goals, experience, and training rhythm.",
  },
  {
    title: "Endurance",
    description: "Conditioning that develops pace, resilience, and an engine built to go further.",
  },
];

const homepageUpdates = [
  {
    category: "Facility",
    title: "Facility progress",
    description: "Follow design, build, and amenity updates as Basecamp CamSur takes shape.",
    href: "/facilities",
    linkLabel: "Explore the facility",
  },
  {
    category: "Membership",
    title: "Membership releases",
    description: "Be first to receive confirmed membership options, inclusions, and preview access.",
    href: "/membership",
    linkLabel: "View membership",
  },
  {
    category: "Opening",
    title: "Opening announcements",
    description: "Get confirmed opening details, tour invitations, and the first schedule release.",
    href: "/contact",
    linkLabel: "Register for updates",
  },
];

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
            <h2 data-home-reveal>The Philippines&apos; first integrated sports,<br />fitness &amp; wellness destination</h2>
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
                    <span className="destination-pillar-title">{title}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section id="ways-to-move" className="section section-dark">
        <div className="shell section-heading split-heading" data-home-reveal><div><h2>Find your<br />training rhythm.</h2></div><p>From focused coaching to high-energy sessions and recovery-led movement, Basecamp is designed to meet you where you are.</p></div>
        <div className="program-scroll shell" data-home-reveal data-home-reveal-delay="short">
          {programs.slice(0,4).map((program, index) => {
            const audience = programAudiences[index];

            return (
              <Link href="/programs" className="program-card" key={program.title}>
                <div className="program-image">
                  <Image
                    src="/images/brand/basecamp-logo.png"
                    alt=""
                    fill
                    sizes="(max-width: 800px) 78vw, 25vw"
                    className="program-card-logo"
                  />
                  <span className="program-card-scrim" aria-hidden="true" />
                  <span className="program-card-overlay">
                    <span className="program-audience-label">{audience.title}</span>
                    <span className="program-audience-description">{audience.description}</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="shell section-link" data-home-reveal><Link href="/programs" className="text-link light">Explore all programs <span>↗</span></Link></div>
      </section>

      <section className="facility-feature section">
        <Image src="/images/facilities/facility-background-a1-5-b.jpg" alt="" fill sizes="100vw" className="facility-feature-background" />
        <div className="facility-feature-shade" aria-hidden="true" />
        <div className="facility-feature-inner shell" data-home-reveal>
          <div className="facility-copy"><h2>Designed around how you live.</h2><p className="lead">Training spaces, recovery areas, and places to connect—brought together as one considered experience.</p><Link href="/facilities" className="button button-light">Explore the facility <span>↗</span></Link></div>
        </div>
      </section>

      <section className="home-updates section">
        <div className="shell">
          <div className="section-heading split-heading light-split" data-home-reveal>
            <div><p className="eyebrow">Latest updates</p><h2>Follow the build.</h2></div>
            <p>Stay close to Basecamp CamSur as the destination, programs, and opening experience come together.</p>
          </div>
          <div className="feature-grid updates-grid" data-home-reveal data-home-reveal-delay="short">
            {homepageUpdates.map((update, index) => (
              <article key={update.title}>
                <span>0{index + 1} / {update.category}</span>
                <h3>{update.title}</h3>
                <p>{update.description}</p>
                <Link href={update.href} className="text-link">{update.linkLabel} <span>↗</span></Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CtaBand revealOnScroll />
    </>
  );
}
