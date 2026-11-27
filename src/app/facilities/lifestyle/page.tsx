import type { Metadata } from "next";
import FacilityShowcase, { type ShowcaseSlide } from "@/components/facilities/FacilityShowcase";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { FACILITY_ANCHORS } from "@/content/constants";
import { getData } from "@/i18n/data";
import { alternatesFor } from "@/i18n/paths";
import { t } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Lounge, café & lockers",
  description: "Inside BaseCamp CamSur beyond the workout: the lobby, café, work area, locker rooms, and showers.",
  alternates: alternatesFor("/facilities/lifestyle"),
};

// Copy comes from getData("facilities") and t() in the page's language (/fil/facilities/lifestyle reuses this page).
export default function FacilitiesLifestylePage() {
  const { FACILITIES_CTA, LIFESTYLE_HERO, ROOMS } = getData("facilities");
  // Interior only (first-floor v2 renders). Anchors keep #social-lounge deep links working.
  const slides: ShowcaseSlide[] = [
    { ...ROOMS.lobby, eyebrow: t("Social"), anchor: FACILITY_ANCHORS.social },
    { ...ROOMS.cafe, eyebrow: t("Social") },
    { ...ROOMS.work, eyebrow: t("Social") },
    { ...ROOMS.lockersW, eyebrow: t("Changing"), anchor: "changing" },
    { ...ROOMS.lockersM, eyebrow: t("Changing") },
    { ...ROOMS.showers, eyebrow: t("Changing") },
  ];
  return (
    <DetailTemplate
      path="/facilities/lifestyle"
      hero={<PageHero {...LIFESTYLE_HERO} variant="stat" facts={[ROOMS.lobby, ROOMS.cafe, ROOMS.work].map((r) => ({ value: r.title, label: r.body }))} />}
      glance={{
        summary: t("Lobby. Café. Lockers.\nEverything in one place.\nMade to stay longer."),
        statement: true,
      }}
      cta={<CtaBand {...FACILITIES_CTA} />}
    >
      <FacilityShowcase slides={slides} label={t("Shared spaces")} />
    </DetailTemplate>
  );
}
