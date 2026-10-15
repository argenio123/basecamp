import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";

export const metadata: Metadata = { title: "Visit", description: "Plan a future visit to Basecamp CamSur in Camarines Sur." };

export default function VisitPage() {
  return <>
    <PageHero eyebrow="Visit Basecamp" title="Your destination for better movement." intro="Basecamp is coming to Camarines Sur. Join the early-access list for the confirmed address, opening hours, tours, and arrival information." image="/images/facilities/facility-landscape.jpg" imageAlt="Landscape view of the planned Basecamp CamSur facility" />
    <section className="section shell visit-grid"><div><p className="eyebrow">Location</p><h2>Camarines Sur,<br />Philippines</h2><p className="lead">Created for a region that already knows how to move—with nature, sport, and community at its heart.</p><Link href="/contact" className="button button-dark">Get location updates <span>↗</span></Link></div><div className="visit-details"><article><span>01</span><div><h3>Address</h3><p>The full site address will be announced with opening information.</p></div></article><article><span>02</span><div><h3>Opening hours</h3><p>Operating hours will be published before bookings go live.</p></div></article><article><span>03</span><div><h3>Facility tours</h3><p>Preview and tour invitations will be shared with early-access members.</p></div></article><article><span>04</span><div><h3>Getting here</h3><p>Parking and arrival guidance will accompany the confirmed address.</p></div></article></div></section>
    <section className="visit-image shell"><Image src="/images/facilities/facility-aerial.jpg" alt="Aerial view of the planned Basecamp CamSur facility" fill sizes="100vw" className="cover-image" /></section>
    <CtaBand eyebrow="Stay close" title="We’ll show you the way." body="Register for confirmed location details, facility previews, and opening announcements." />
  </>;
}
