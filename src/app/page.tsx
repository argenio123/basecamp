import Image from "next/image";
import Link from "next/link";
import CtaBand from "@/components/sections/CtaBand";
import { programs } from "@/data/site";

export default function Home() {
  return (
    <>
      <section className="home-hero">
        <Image src="/images/hero/hero-training.png" alt="Athlete training with battle ropes" fill priority sizes="100vw" className="cover-image" />
        <div className="home-hero-shade" />
        <div className="shell home-hero-content">
          <h1>Move with purpose.<br />Live with strength.</h1>
          <div className="button-row"><Link href="/contact" className="button button-light">Start your journey <span>↗</span></Link><Link href="/programs" className="button button-ghost">Discover training</Link></div>
        </div>
        <div className="hero-index shell"><span>TRAIN</span><span>TRANSFORM</span><span>THRIVE</span></div>
      </section>

      <section className="destination-intro section">
        <div className="shell">
          <h2>The Philippines&apos; first integrated sports,<br />fitness &amp; wellness destination</h2>
          <p className="destination-summary">Basecamp CamSur represents a bold new category in sports tourism: an integrated destination where elite performance training, evidence-based recovery, and authentic lifestyle converge to create transformative experiences.</p>
          <div className="destination-pillars">
            {[
              ['TRAIN', 'Purpose-built performance training zones combining CrossFit, functional fitness, and endurance programming in a world-class outdoor environment.'],
              ['TRANSFORM', 'Comprehensive recovery infrastructure featuring contrast therapy, cold plunge pools, saunas, and dedicated wellness facilities.'],
              ['THRIVE', 'A thriving community ecosystem where athletes connect, grow, and belong. Designed for long stays and lasting impact.'],
            ].map(([title, body]) => (
              <article className="destination-pillar" key={title}><h3>{title}</h3><p>{body}</p></article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="shell section-heading split-heading"><div><p className="eyebrow eyebrow-light">Ways to move</p><h2>Find your<br />training rhythm.</h2></div><p>From focused coaching to high-energy sessions and recovery-led movement, Basecamp is designed to meet you where you are.</p></div>
        <div className="program-scroll shell">
          {programs.slice(0,4).map((program) => (
            <Link href="/programs" className="program-card" key={program.title}>
              <div className="program-image"><Image src={program.image} alt="" fill sizes="(max-width: 800px) 78vw, 25vw" className="cover-image" /></div>
              <span>{program.number}</span><h3>{program.title}</h3><p>{program.description}</p>
            </Link>
          ))}
        </div>
        <div className="shell section-link"><Link href="/programs" className="text-link light">Explore all programs <span>↗</span></Link></div>
      </section>

      <section className="facility-feature section shell">
        <div className="facility-copy"><p className="eyebrow">The facility</p><h2>Designed around how you live.</h2><p className="lead">Training spaces, recovery areas, and places to connect—brought together as one considered experience.</p><Link href="/facilities" className="button button-dark">Explore the facility <span>↗</span></Link></div>
        <div className="image-frame tall"><Image src="/images/facilities/facility-exterior.jpg" alt="Architectural rendering of the Basecamp CamSur facility" fill sizes="(max-width: 800px) 100vw, 55vw" className="cover-image" /></div>
      </section>

      <section className="landscape-callout">
        <Image src="/images/facilities/facility-landscape.jpg" alt="Landscape view of the planned Basecamp CamSur facility" fill sizes="100vw" className="cover-image" />
        <div className="hero-shade" /><div className="shell landscape-copy"><p className="eyebrow eyebrow-light">Rooted in CamSur</p><h2>Made for this place.<br />Built for its people.</h2><Link href="/visit" className="text-link light">Plan your visit <span>↗</span></Link></div>
      </section>
      <CtaBand />
    </>
  );
}
