import type { Metadata } from "next";
import Image from "next/image";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { facilityFeatures, toAnchor } from "@/data/site";

export const metadata: Metadata = { title: "Facilities", description: "Discover the spaces planned for Basecamp CamSur." };

export default function FacilitiesPage() {
  return <>
    <PageHero eyebrow="Facilities" title="Space to perform. Room to thrive." intro="An integrated destination designed to make training, recovery, and time well spent feel like one seamless experience." image="/images/facilities/facility-aerial.jpg" imageAlt="Aerial architectural rendering of Basecamp CamSur" />
    <section className="section shell"><div className="intro-grid"><h2>Every detail has a purpose.</h2><div><p className="lead">The facility is being shaped around flow: how you arrive, how you train, how you recover, and how you reconnect after the work is done.</p><p>Final amenities and operating details will be published as the opening program is confirmed.</p></div></div>
      <div className="feature-grid">{facilityFeatures.map(([title,body], i) => <article key={title} id={toAnchor(title)}><span>0{i+1}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
    </section>
    <section className="gallery-grid shell"><div className="image-frame gallery-wide"><Image src="/images/facilities/facility-exterior.jpg" alt="Exterior rendering of Basecamp CamSur" fill sizes="70vw" className="cover-image" /></div><div className="image-frame"><Image src="/images/facilities/facility-front.jpg" alt="Front approach to the Basecamp CamSur facility" fill sizes="30vw" className="cover-image" /></div><div className="image-frame"><Image src="/images/facilities/facility-detail.jpg" alt="Architectural detail of the Basecamp CamSur facility" fill sizes="40vw" className="cover-image" /></div><div className="gallery-quote"><p>Designed as a destination, not a stopover.</p><span>BASECAMP CAMSUR</span></div></section>
    <CtaBand eyebrow="Come and see" title="Experience the space." body="Join early access to receive preview and tour announcements when they become available." label="Register for previews" />
  </>;
}
