import type { Metadata } from "next";
import FoundingPass from "@/components/membership/FoundingPass";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { getSiteContent } from "@/content/get";

const PATH = "/membership/founding";

export const metadata: Metadata = {
  title: "Founding Members",
  description: "Become a BaseCamp CamSur founding member: a proposed 30% off your first six months or a locked lifetime alumni rate, priority access to camps and events, and an exclusive launch event.",
};

export default async function FoundingPage() {
  const { settings } = await getSiteContent();
  const { founding } = settings;

  return (
    <DetailTemplate
      path={PATH}
      hero={<PageHero title="Be one of the first." intro="Join before opening and keep the founding rate, priority access and a place at the launch event." image="/images/programs/program-endurance.png" imageAlt="Coach guiding a barbell squat at BaseCamp CamSur" />}
      glance={{ summary: "Founding rates.\nPriority access.\nA seat at launch.", statement: true }}
      related={["/membership#tiers", "/membership/launch-promotions", "/about/faq"]}
      cta={<>
        <CtaBand eyebrow="Founding members" title="Claim your founding spot." label={founding.ctaLabel || "Become an early member"} href="/membership/join" />
      </>}
    >
      <FoundingPass founding={founding} exchangeRate={settings.exchangeRate} />
    </DetailTemplate>
  );
}
