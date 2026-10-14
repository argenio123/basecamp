import type { Metadata } from "next";
import Link from "next/link";
import CtaBand from "../components/CtaBand";
import PageHero from "../components/PageHero";

export const metadata: Metadata = { title: "Membership", description: "Register interest in Basecamp CamSur membership." };

export default function MembershipPage() {
  const benefits = [["01","One connected experience","Move between training, coaching, recovery, and community spaces with a journey designed to feel joined up."],["02","Support that meets you","Start from your goals and build a rhythm that works for your experience, schedule, and ambitions."],["03","A place to belong","Make Basecamp part of your day—not only the hour you train."]];
  return <>
    <PageHero eyebrow="Membership" title="Your place to move forward." intro="Membership is being designed as an all-around Basecamp experience—bringing movement, recovery, and community into one destination." image="/basecamp/hero-training.png" imageAlt="Focused athlete training at Basecamp" />
    <section className="section shell"><div className="section-heading split-heading light-split"><div><p className="eyebrow">The Basecamp experience</p><h2>More than access.</h2></div><div><p>Membership details, inclusions, and rates are still being finalized. Register your interest and tell us what matters to you.</p><Link href="/contact" className="text-link">Join early access <span>↗</span></Link></div></div><div className="benefit-grid">{benefits.map(([n,t,b]) => <article key={n}><span>{n}</span><h3>{t}</h3><p>{b}</p></article>)}</div></section>
    <section className="membership-panel"><div className="shell membership-inner"><div><p className="eyebrow eyebrow-light">Coming into focus</p><h2>Membership designed around real life.</h2></div><ul><li>Integrated training and recovery journey</li><li>Coach-led and self-guided ways to move</li><li>Spaces to connect before and after training</li><li>Opening offers announced to early-access members first</li></ul></div></section>
    <CtaBand eyebrow="Early access" title="Help shape what comes next." body="Share your interest and be among the first to receive confirmed membership information." />
  </>;
}
