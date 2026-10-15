import type { Metadata } from "next";
import Image from "next/image";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { programs } from "@/data/site";

export const metadata: Metadata = { title: "Programs", description: "Explore training, coaching, endurance, and recovery at Basecamp CamSur." };

export default function ProgramsPage() {
  return <>
    <PageHero eyebrow="Programs" title="Train with intention." intro="Choose the path that fits your goals. Every Basecamp experience is built around purposeful movement, considered coaching, and progress you can feel." image="/images/programs/program-functional.png" imageAlt="Athlete training inside a modern fitness facility" />
    <section className="section shell"><div className="section-heading split-heading light-split"><div><p className="eyebrow">Find your way in</p><h2>Built for every stage.</h2></div><p>Come to build strength, move better, improve your conditioning, or make space for recovery. Programs are structured to work on their own and together.</p></div>
      <div className="program-list">{programs.map((program, index) => <article className="program-row" key={program.title}><div className="program-number">{program.number}</div><div className="program-row-image"><Image src={program.image} alt="" fill sizes="(max-width: 800px) 100vw, 35vw" className="cover-image" /></div><div className="program-row-copy"><p className="eyebrow">{index < 2 ? 'Performance' : index === 4 ? 'Restore' : 'Build'}</p><h2>{program.title}</h2><p>{program.description}</p><p className="fine-print">Detailed formats and opening schedules will be shared as the program calendar is confirmed.</p></div></article>)}</div>
    </section>
    <CtaBand eyebrow="Program updates" title="Be first on the floor." body="Register for opening program previews and early schedule announcements." />
  </>;
}
