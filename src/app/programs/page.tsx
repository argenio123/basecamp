import type { Metadata } from "next";
import { OverviewTemplate } from "@/components/nav/PageTemplates";
import ClassesEditorialHero from "@/components/programs/ClassesEditorialHero";
import ClassFilterGrid, { type ClassGroup } from "@/components/programs/ClassFilterGrid";
import CtaBand from "@/components/sections/CtaBand";
import { getSiteContent } from "@/content/get";
import { PHASE_COPY } from "@/content/labels";
import { WORKOUT_GROUPS, type WorkoutType, workoutTypeBySlug } from "@/data/workout-types";

export const metadata: Metadata = {
  title: "Classes",
  description: "Explore coach-led strength, functional fitness, endurance, recovery and mobility classes at BaseCamp CamSur.",
};

export default async function ProgramsPage() {
  const c = await getSiteContent();
  let number = 0;
  const groups: ClassGroup[] = WORKOUT_GROUPS.map(({ id, title, description, slugs }) => ({
    id,
    title,
    description,
    items: slugs
      .map(workoutTypeBySlug)
      .filter((item): item is WorkoutType => item !== undefined)
      .map(({ slug, title, image, imageAlt, focus, intensity, session }) => ({
        slug, title, image, imageAlt, focus, intensity, session, number: String(++number).padStart(2, "0"),
      })),
  }));

  return (
    <OverviewTemplate
      path="/classes"
      hero={<ClassesEditorialHero chapter="00" eyebrow="Classes" title="Built to perform." intro="Five ways to train. Every session coach-led. Every result tracked." image="/images/programs/program-functional.png" imageAlt="Athlete training inside a modern functional fitness space" variant="overview" minimalMeta />}
      glance={{
        summary: "Strength, conditioning, combat, mind-body and race training. Every class is coach-led and scaled to your level.",
      }}
      cards={false}
      quote={false}
      marquee={false}
      cta={<CtaBand eyebrow="Early members" label={PHASE_COPY[c.settings.launchPhase].ctaLabel} className="pr-cta-expanded" />}
    >
      <section className="section pr-workout-types" id="workout-types" aria-labelledby="pr-workout-types-title">
        <div className="shell">
          <div className="pr-workout-types-head" data-reveal>
            <p className="eyebrow">Workout classes</p>
            <h2 id="pr-workout-types-title">Pick what you want to get better at.</h2>
          </div>
          <ClassFilterGrid groups={groups} />
        </div>
      </section>
    </OverviewTemplate>
  );
}
