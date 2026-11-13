import type { Metadata } from "next";
import FacilityShowcase, { type ShowcaseSlide } from "@/components/facilities/FacilityShowcase";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { FACILITY_ANCHORS } from "@/content/constants";
import { FACILITIES_CTA, LIFESTYLE_HERO, ROOMS } from "@/data/facilities";

export const metadata: Metadata = {
  title: "Lounge, café & lockers",
  description: "Inside BaseCamp CamSur beyond the workout: the lobby, café, work area, locker rooms, and showers.",
};

// Interior only (first-floor v2 renders). Anchors keep #social-lounge deep links working.
const SLIDES: ShowcaseSlide[] = [
  { ...ROOMS.lobby, eyebrow: "Social", anchor: FACILITY_ANCHORS.social },
  { ...ROOMS.cafe, eyebrow: "Social" },
  { ...ROOMS.work, eyebrow: "Social" },
  { ...ROOMS.lockersW, eyebrow: "Changing", anchor: "changing" },
  { ...ROOMS.lockersM, eyebrow: "Changing" },
  { ...ROOMS.showers, eyebrow: "Changing" },
];

export default function FacilitiesLifestylePage() {
  return (
    <DetailTemplate
      path="/facilities/lifestyle"
      hero={<PageHero {...LIFESTYLE_HERO} />}
      glance={{
        summary: "Lobby. Café. Lockers.\nEverything in one place.\nMade to stay longer.",
        statement: true,
      }}
      cta={<CtaBand {...FACILITIES_CTA} />}
    >
      <FacilityShowcase slides={SLIDES} label="Shared spaces" />
    </DetailTemplate>
  );
}
