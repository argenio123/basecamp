import type { Metadata } from "next";
import FacilityShowcase, { type ShowcaseSlide } from "@/components/facilities/FacilityShowcase";
import { statFact } from "@/components/facilities/facts";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { FACILITY_ANCHORS } from "@/content/constants";
import { getSiteContent } from "@/content/get";
import { getData } from "@/i18n/data";
import { alternatesFor } from "@/i18n/paths";
import { t } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Training zones",
  description: "Inside the BaseCamp CamSur training floor: a CrossFit-style area, a complete fitness gym, a yoga studio, and the planned equipment.",
  alternates: alternatesFor("/facilities/training"),
};

// Hero stats come from content (home.stats); getSiteContent() is cached, so the page still prerenders.
// Copy comes from getData("facilities") and t() in the page's language (/fil/facilities/training reuses this page).
export default async function FacilitiesTrainingPage() {
  const stats = (await getSiteContent()).home.stats.items;
  const { FACILITIES_CTA, ROOMS, TRAINING_HERO } = getData("facilities");
  // Interior only (first-floor v2 renders), as a full-bleed room showcase. Anchors keep #training-zones and #equipment working.
  const slides: ShowcaseSlide[] = [
    // Fitness gym + its strength & cardio kit, as one slide on the gym render.
    { ...ROOMS.gym, eyebrow: t("Zones"), title: t("Strength & cardio"), body: t("Racks, barbells, bikes and rowers. Open access."), anchor: FACILITY_ANCHORS.training },
    { ...ROOMS.crossfit, eyebrow: t("Zones"), title: t("Functional & HYROX"), body: t("Sleds, ropes, wall balls and sandbags."), anchor: "equipment" },
    { ...ROOMS.yoga, eyebrow: t("Zones") },
  ];
  return (
    <DetailTemplate
      path="/facilities/training"
      hero={<PageHero {...TRAINING_HERO} variant="stat" facts={["sqm", "zones"].map((id) => statFact(stats, id))} />}
      glance={{
        summary: t("Lift. Move. Sweat.\nThree rooms to train.\nAll under one roof."),
        statement: true,
      }}
      cta={<CtaBand {...FACILITIES_CTA} />}
    >
      <FacilityShowcase slides={slides} label={t("Training floor")} />
    </DetailTemplate>
  );
}
