import type { Metadata } from "next";
import ProgramExplorer from "@/components/ProgramExplorer";
import { OverviewTemplate } from "@/components/nav/PageTemplates";
import SubpageCards from "@/components/nav/SubpageCards";
import DayAtBaseCamp from "@/components/programs/DayAtBaseCamp";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { getSiteContent } from "@/content/get";
import { PHASE_COPY } from "@/content/labels";

export const metadata: Metadata = {
  title: "Programs",
  description: "Explore five coach-led programs for strength, functional fitness, personal coaching, endurance, recovery and mobility in Camarines Sur.",
};

export default async function ProgramsPage() {
  const c = await getSiteContent();
  const { programmes: p, home } = c;

  return (
    <OverviewTemplate
      path="/programs"
      hero={<PageHero title="Built to perform." intro={p.intro} image="/images/programs/program-functional.png" imageAlt="Athlete training inside a modern functional fitness space" />}
      glance={{
        summary: "Five coach-led programs help you build strength, fitness, endurance and recovery with a clear path forward.",
      }}
      cards={false}
      cta={<CtaBand eyebrow="Early members" label={PHASE_COPY[c.settings.launchPhase].ctaLabel} />}
    >
      <section className="section shell pr-core" id="core">
        <div className="nv-block-head" data-reveal>
          <p className="eyebrow">Programs</p>
          <h2>Find your program.</h2>
          <p className="nv-block-intro">Open a program for its session, spaces and pricing.</p>
        </div>
        <ProgramExplorer programmes={p.featured} />
      </section>

      <DayAtBaseCamp dayFlow={home.dayFlow} />

      <SubpageCards
        section="/programs"
        hrefs={["/programs/coaching", "/programs/corporate"]}
        eyebrow="Beyond the programs"
        title="Coaching and corporate."
        intro="How coaching and assessment work, and programs built for teams."
      />
    </OverviewTemplate>
  );
}
