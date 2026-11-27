import type { Metadata } from "next";
import FromPrices from "@/components/membership/FromPrices";
import { groupsFor } from "@/components/membership/pricing";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { getSiteContent } from "@/content/get";
import { alternatesFor } from "@/i18n/paths";
import { t } from "@/i18n/server";

const PATH = "/membership/price-guide";
const AUDIENCE_INTRO = "Every price beyond the monthly tiers in one place: class packs, day passes and open gym, yoga, recovery, camps, and team bookings, each with its full details.";

export const metadata: Metadata = {
  title: "Passes, Recovery & More",
  description: "Every BaseCamp CamSur price beyond the monthly tiers: class packs, day passes, open gym, yoga, recovery, camps, and corporate bookings, with starting prices in PHP.",
  alternates: alternatesFor(PATH),
};

export default async function PriceGuidePage() {
  const { pricing } = await getSiteContent();
  const tierGroups = groupsFor(pricing.groups, "overview");
  const otherGroups = pricing.groups.filter((g) => !tierGroups.includes(g));

  return (
    <DetailTemplate
      path={PATH}
      hero={<PageHero variant="split" title={t("Passes, recovery, and more.")} intro={t("Starting prices for everything beyond the monthly tiers, in one place.")} image="/images/membership/generated/price-guide-gym-reception-v2.webp" imageAlt={t("Gym reception staff helping a visitor beside accreditation displays")} />}
      glance={{ summary: t("Packs and day passes.\nYoga and recovery.\nCamps and teams."), statement: true }}
      related={["/membership#tiers", "/membership/launch-promotions"]}
      cta={<>
        <CtaBand eyebrow={t("Price guide")} title={t("Need help choosing?")} label={t("Talk to us")} href="/membership#tiers" />
      </>}
    >
      <FromPrices id="from-prices" groups={otherGroups} eyebrow={t("Price guide")} title={t("Passes, recovery and more.")} intro={t(AUDIENCE_INTRO)} />
    </DetailTemplate>
  );
}
