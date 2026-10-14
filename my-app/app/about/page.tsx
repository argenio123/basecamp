import type { Metadata } from "next";
import Image from "next/image";
import CtaBand from "../components/CtaBand";
import PageHero from "../components/PageHero";

export const metadata: Metadata = { title: "About", description: "The idea and purpose behind Basecamp CamSur." };

export default function AboutPage() {
  return <>
    <PageHero eyebrow="About Basecamp" title="Built around a bigger idea of wellbeing." intro="Basecamp is being created as a place where performance and wellbeing support each other—and where movement brings people together." image="/basecamp/facility-exterior.jpg" imageAlt="Basecamp CamSur facility set against the landscape" />
    <section className="section shell"><div className="story-grid"><div><p className="eyebrow">Our purpose</p><h2>A stronger everyday.</h2></div><div><p className="lead">We believe the best fitness experiences reach beyond equipment and workouts. They help people build confidence, find consistency, recover with intention, and feel part of something.</p><p>Basecamp brings those elements into one considered destination for Camarines Sur: premium in experience, grounded in place, and open to many ways of moving.</p></div></div></section>
    <section className="about-image-split"><div className="image-frame"><Image src="/basecamp/program-endurance.png" alt="Athlete in focused endurance training" fill sizes="50vw" className="cover-image" /></div><div><p className="eyebrow eyebrow-light">Our philosophy</p><h2>Train.<br />Transform.<br />Thrive.</h2><p>Three simple ideas shape the experience: do the work with purpose, let progress carry into life, and make room for the recovery and relationships that help it last.</p></div></section>
    <section className="section shell values"><p className="eyebrow">What guides us</p><div>{[["01","Purposeful movement"],["02","Whole-person progress"],["03","Considered hospitality"],["04","Local community"]].map(([n,t]) => <article key={n}><span>{n}</span><h3>{t}</h3></article>)}</div></section>
    <CtaBand title="Come build with us." body="Join the early-access community and follow Basecamp CamSur from the beginning." />
  </>;
}
