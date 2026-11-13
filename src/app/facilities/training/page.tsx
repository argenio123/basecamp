import type { Metadata } from "next";
import FacilityShowcase, { type ShowcaseSlide } from "@/components/facilities/FacilityShowcase";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { FACILITY_ANCHORS } from "@/content/constants";
import { FACILITIES_CTA, ROOMS, TRAINING_HERO } from "@/data/facilities";

export const metadata: Metadata = {
  title: "Training zones",
  description: "Inside the BaseCamp CamSur training floor: a CrossFit-style area, a complete fitness gym, a yoga studio, and the planned equipment.",
};

// Interior only (first-floor v2 renders), as a full-bleed room showcase. Anchors keep #training-zones and #equipment working.
const SLIDES: ShowcaseSlide[] = [
  // Fitness gym + its strength & cardio kit, as one slide on the gym render.
  { ...ROOMS.gym, eyebrow: "Zones", title: "Strength & cardio", body: "Racks, barbells, bikes and rowers. Open access.", anchor: FACILITY_ANCHORS.training },
  { ...ROOMS.crossfit, eyebrow: "Zones", title: "Functional & HYROX", body: "Sleds, ropes, wall balls and sandbags.", anchor: "equipment" },
  { ...ROOMS.yoga, eyebrow: "Zones" },
];

export default function FacilitiesTrainingPage() {
  return (
    <DetailTemplate
      path="/facilities/training"
      hero={<PageHero {...TRAINING_HERO} />}
      glance={{
        summary: "Lift. Move. Sweat.\nThree rooms to train.\nAll under one roof.",
        statement: true,
      }}
      cta={<CtaBand {...FACILITIES_CTA} />}
    >
      <FacilityShowcase slides={SLIDES} label="Training floor" />
    </DetailTemplate>
  );
}
