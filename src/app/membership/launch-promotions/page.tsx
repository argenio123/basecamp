import type { Metadata } from "next";
import LaunchPromos from "@/components/membership/LaunchPromos";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";

const PATH = "/membership/launch-promotions";

export const metadata: Metadata = {
  title: "Launch Promotions",
  description: "BaseCamp CamSur launch promotions on test: Athlete membership Php 4,500 vs Php 3,200 introductory, day pass Php 650 vs Php 850 weekend, and 20% off camps booked 60+ days ahead.",
};

export default function LaunchPromotionsPage() {

  return (
    <DetailTemplate
      path={PATH}
      hero={<PageHero title="Rates on test." intro="Launch offers we are testing with the community, reviewed after the first 90 days." image="/images/membership/generated/launch-promotions-hero-basecamp-interior.png" imageAlt="BaseCamp CamSur members cheering on an athlete during a launch-day sled workout inside the glass-fronted training hall" />}
      glance={{ summary: "Introductory rates.\nWeekend passes.\nEarly-bird camps.", statement: true }}
      related={["/membership/founding", "/membership#tiers", "/membership/price-guide"]}
      cta={<>
        <CtaBand eyebrow="Launch promotions" title="Lock in a launch rate." label="Register interest" href="/membership/join" />
      </>}
    >
      <LaunchPromos />
    </DetailTemplate>
  );
}
