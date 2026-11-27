import type { Metadata } from "next";
import { OverviewTemplate } from "@/components/nav/PageTemplates";
import ClassesEditorialHero from "@/components/programs/ClassesEditorialHero";
import ScheduleExplore from "@/components/schedule/ScheduleExplore";
import CtaBand from "@/components/sections/CtaBand";
import { getSiteContent } from "@/content/get";
import type { WorkoutType } from "@/data/workout-types";
import { getData } from "@/i18n/data";
import { alternatesFor } from "@/i18n/paths";
import { getUi, localHref, t } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Classes",
  description: "Eight coach-led HYROX-style station classes at BaseCamp CamSur: SkiErg, sled push, sled pull, burpee broad jumps, row, farmers carry, sandbag lunges, and wall balls.",
  alternates: alternatesFor("/classes"),
};

export default async function ProgramsPage() {
  const c = await getSiteContent();
  const { WORKOUT_GROUPS, WORKOUT_TYPES } = getData("workout-types");
  // Station classes in the same list-plus-photo layout as Membership categories and Schedule "Events & booking".
  const group = WORKOUT_GROUPS[0];
  const stations = group.slugs
    .map((slug) => WORKOUT_TYPES.find((item) => item.slug === slug))
    .filter((item): item is WorkoutType => item !== undefined)
    .map(({ slug, title, description, image, imageAlt }) => ({ href: localHref(`/classes/styles/${slug}`), label: title, summary: description, image, imageAlt }));

  return (
    <OverviewTemplate
      path="/classes"
      hero={<ClassesEditorialHero chapter="00" eyebrow={t("Classes")} title={t("Built to perform.")} intro={t("Eight stations. Every session coach-led. Every result tracked.")} image="/images/programs/classes-hero.jpg" imageAlt={t("Athlete doing dumbbell lunges while a coach sets up a barbell in a brick-and-concrete gym")} variant="overview" minimalMeta fullImage />}
      glance={{
        summary: t("Eight HYROX-style stations.\nA weekly coached class each,\nscaled to your level."),
        statement: true,
      }}
      cards={false}
      quote={false}
      marquee={false}
      cta={<CtaBand eyebrow={t("Early members")} label={getUi().labels.phase[c.settings.launchPhase].ctaLabel} className="pr-cta-expanded" />}
    >
      <div id="workout-types">
        <ScheduleExplore eyebrow={t("Classes")} title={group.title} intro={group.description} items={stations} />
      </div>
    </OverviewTemplate>
  );
}
