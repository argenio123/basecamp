import type { Metadata } from "next";
import FacilityShowcase, { type ShowcaseSlide } from "@/components/facilities/FacilityShowcase";
import { statFact } from "@/components/facilities/facts";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { getSiteContent } from "@/content/get";
import { getData } from "@/i18n/data";
import { alternatesFor } from "@/i18n/paths";
import { t } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Recovery level",
  description: "Inside the BaseCamp CamSur recovery level: hot and cold plunge pools, a hyperbaric chamber, therapy rooms, a recovery lounge, and showers.",
  alternates: alternatesFor("/facilities/recovery"),
};

// Hero stats come from content (home.stats); getSiteContent() is cached, so the page still prerenders.
// Copy comes from getData("facilities") and t() in the page's language (/fil/facilities/recovery reuses this page).
export default async function FacilitiesRecoveryPage() {
  const stats = (await getSiteContent()).home.stats.items;
  const { FACILITIES_CTA, RECOVERY_HERO, ROOMS } = getData("facilities");
  // Interior only (second-floor renders).
  const slides: ShowcaseSlide[] = [
    { ...ROOMS.plunge, eyebrow: t("Recovery"), anchor: "recovery-level" },
    { ...ROOMS.hyperbaric, eyebrow: t("Recovery") },
    { ...ROOMS.therapy, eyebrow: t("Recovery") },
    { ...ROOMS.recoveryLounge, eyebrow: t("Amenities"), anchor: "amenities" },
    { ...ROOMS.recoveryShowers, eyebrow: t("Amenities") },
  ];
  return (
    <DetailTemplate
      path="/facilities/recovery"
      hero={<PageHero {...RECOVERY_HERO} variant="stat" facts={["floor", "modalities"].map((id) => statFact(stats, id))} />}
      glance={{
        summary: t("Cold. Heat. Contrast.\nA full recovery level.\nBuilt for camp volume."),
        statement: true,
      }}
      cta={<CtaBand {...FACILITIES_CTA} />}
    >
      <FacilityShowcase slides={slides} label={t("Recovery level")} />
    </DetailTemplate>
  );
}
