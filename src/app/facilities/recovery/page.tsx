import type { Metadata } from "next";
import FacilityShowcase, { type ShowcaseSlide } from "@/components/facilities/FacilityShowcase";
import { statFact } from "@/components/facilities/facts";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { getSiteContent } from "@/content/get";
import { FACILITIES_CTA, RECOVERY_HERO, ROOMS } from "@/data/facilities";

export const metadata: Metadata = {
  title: "Recovery level",
  description: "Inside the BaseCamp CamSur recovery level: hot and cold plunge pools, a hyperbaric chamber, therapy rooms, a recovery lounge, and showers.",
};

// Interior only (second-floor renders).
const SLIDES: ShowcaseSlide[] = [
  { ...ROOMS.plunge, eyebrow: "Recovery", anchor: "recovery-level" },
  { ...ROOMS.hyperbaric, eyebrow: "Recovery" },
  { ...ROOMS.therapy, eyebrow: "Recovery" },
  { ...ROOMS.recoveryLounge, eyebrow: "Amenities", anchor: "amenities" },
  { ...ROOMS.recoveryShowers, eyebrow: "Amenities" },
];

// Hero stats come from content (home.stats); getSiteContent() is cached, so the page still prerenders.
export default async function FacilitiesRecoveryPage() {
  const stats = (await getSiteContent()).home.stats.items;
  return (
    <DetailTemplate
      path="/facilities/recovery"
      hero={<PageHero {...RECOVERY_HERO} variant="stat" facts={["floor", "modalities"].map((id) => statFact(stats, id))} />}
      glance={{
        summary: "Cold. Heat. Contrast.\nA full recovery level.\nBuilt for camp volume.",
        statement: true,
      }}
      cta={<CtaBand {...FACILITIES_CTA} />}
    >
      <FacilityShowcase slides={SLIDES} label="Recovery level" />
    </DetailTemplate>
  );
}
