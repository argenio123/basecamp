import type { Metadata } from "next";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import ProgramExplorer from "@/components/ProgramExplorer";

export const metadata: Metadata = { title: "Programs", description: "Explore training, coaching, endurance, and recovery at Basecamp CamSur." };

export default function ProgramsPage() {
  return <>
    <PageHero eyebrow="Programs" title="Train with intention." intro="Choose the path that fits your goals. Every Basecamp experience is built around purposeful movement, considered coaching, and progress you can feel." image="/images/programs/program-functional.png" imageAlt="Athlete training inside a modern fitness facility" />
    <section className="section shell"><div className="section-heading split-heading light-split"><div><p className="eyebrow">Find your way in</p><h2>Built for every stage.</h2></div><p>Come to build strength, move better, improve your conditioning, or make space for recovery. Programs are structured to work on their own and together.</p></div>
      <ProgramExplorer />
    </section>
    <CtaBand eyebrow="Program updates" title="Be first on the floor." body="Register for opening program previews and early schedule announcements." />
  </>;
}
