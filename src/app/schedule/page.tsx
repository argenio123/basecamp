import type { Metadata } from "next";
import Link from "next/link";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";

export const metadata: Metadata = { title: "Schedule & Book", description: "Preview the Basecamp CamSur program schedule and register for updates." };

export default function SchedulePage() {
  const preview = [["Build","Strength & Conditioning","Structured sessions for strong foundations and progressive performance."],["Move","Functional Training","Dynamic coaching focused on movement quality, agility, and capacity."],["Perform","Endurance","Conditioning sessions designed to build pace, power, and resilience."],["Restore","Recovery & Mobility","Lower-intensity movement and recovery-led sessions to help you reset."]];
  return <>
    <PageHero eyebrow="Schedule & Book" title="Make movement part of your week." intro="The opening timetable is in development. Explore the planned session families now, then register to receive confirmed dates and booking access." image="/images/programs/program-coaching.png" imageAlt="Coach supporting an athlete during training" />
    <section className="section shell"><div className="notice-bar"><strong>Opening schedule</strong><span>Live bookings are not available yet. Early-access members will receive the first schedule release.</span><Link href="/contact">Get updates ↗</Link></div><div className="section-heading"><p className="eyebrow">Program preview</p><h2>Choose how you want to move.</h2></div><div className="schedule-grid">{preview.map(([tag,title,body],i) => <article key={title}><span className="schedule-day">0{i+1}</span><p className="eyebrow">{tag}</p><h3>{title}</h3><p>{body}</p><Link href="/programs" className="text-link">View program <span>↗</span></Link></article>)}</div></section>
    <CtaBand eyebrow="Booking access" title="Know when the doors open." body="Register now and receive the confirmed timetable and booking information when released." />
  </>;
}
