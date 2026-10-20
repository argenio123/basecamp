import type { Metadata } from "next";
import Link from "next/link";
import ProgramExplorer from "@/components/ProgramExplorer";
import { OverviewTemplate } from "@/components/nav/PageTemplates";
import SubpageCards from "@/components/nav/SubpageCards";
import ClassPreview from "@/components/programs/ClassPreview";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { getSiteContent } from "@/content/get";
import { PHASE_COPY } from "@/content/labels";
import { CLASS_FAQ } from "@/data/programs-static";

export const metadata: Metadata = {
  title: "Classes",
  description: "Explore coach-led strength, functional fitness, endurance, recovery and mobility classes at BaseCamp CamSur.",
};

export default async function ProgramsPage() {
  const c = await getSiteContent();
  const { programmes: p } = c;

  return (
    <OverviewTemplate
      path="/classes"
      hero={<PageHero eyebrow="Classes" title="Built to perform." intro="Coach-led strength, conditioning, endurance and recovery classes designed for measurable progress." image="/images/programs/program-functional.png" imageAlt="Athlete training inside a modern functional fitness space" />}
      glance={{
        summary: "Five training disciplines lead into classes for strength, fitness, endurance, individual coaching and recovery.",
        facts: [
          { label: "Class length", value: "45–60 minutes" },
          { label: "Levels", value: "Beginner to intermediate+" },
          { label: "Schedule", value: c.settings.launchPhase === "live" ? "Live" : "Launch preview" },
        ],
      }}
      cards={false}
      quote={false}
      cta={<CtaBand eyebrow="Early members" label={PHASE_COPY[c.settings.launchPhase].ctaLabel} className="pr-cta-expanded" />}
    >
      <section className="section shell pr-core" id="disciplines">
        <ProgramExplorer programmes={p.featured} launchPhase={c.settings.launchPhase} />
      </section>

      <ClassPreview launchPhase={c.settings.launchPhase} />

      <section className="section pr-system" id="class-system" aria-labelledby="pr-system-title">
        <div className="shell">
          <div className="section-heading split-heading light-split" data-reveal>
            <div>
              <p className="eyebrow">The complete path</p>
              <h2 id="pr-system-title">Every class connects to a complete training system.</h2>
            </div>
            <p>Choose your class, then connect it to the right space, recovery plan, access option and weekly rhythm.</p>
          </div>
          <ul className="pr-system-grid" data-reveal="stagger">
            <li><Link href="/facilities/training"><span className="pr-index">01</span><h3>Training spaces</h3><p>See the zones, equipment and environments used by each class.</p><span className="pr-system-link">Explore facilities →</span></Link></li>
            <li><Link href="/facilities/recovery"><span className="pr-index">02</span><h3>Recovery support</h3><p>Pair training load with mobility, heat, cold and guided recovery.</p><span className="pr-system-link">Explore recovery →</span></Link></li>
            <li><Link href="/membership"><span className="pr-index">03</span><h3>Access options</h3><p>Compare memberships and passes by the training access you need.</p><span className="pr-system-link">Compare access →</span></Link></li>
            <li><Link href="/schedule"><span className="pr-index">04</span><h3>Weekly schedule</h3><p>Check the launch preview now and the live timetable when bookings open.</p><span className="pr-system-link">View schedule →</span></Link></li>
          </ul>
        </div>
      </section>

      <section className="section pr-class-faq" id="class-faq" aria-labelledby="pr-class-faq-title">
        <div className="shell pr-class-faq-layout">
          <div data-reveal>
            <p className="eyebrow">Before you book</p>
            <h2 id="pr-class-faq-title">Questions? Answers.</h2>
            <p>Practical information about experience, equipment, access and booking.</p>
          </div>
          <div className="pr-class-faq-list" data-reveal="stagger">
            {CLASS_FAQ.map((item) => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}
          </div>
        </div>
      </section>

      <SubpageCards
        section="/classes"
        hrefs={["/classes/coaching", "/classes/corporate"]}
        eyebrow="Beyond group classes"
        title="Private coaching and teams."
        intro="Individual assessment and coaching, plus customised training for organisations."
        dark
      />
    </OverviewTemplate>
  );
}
