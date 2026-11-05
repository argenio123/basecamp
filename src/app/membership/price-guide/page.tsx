import type { Metadata } from "next";
import FromPrices from "@/components/membership/FromPrices";
import { groupsFor } from "@/components/membership/pricing";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { getSiteContent } from "@/content/get";

const PATH = "/membership/price-guide";
const AUDIENCE_INTRO = "Local and regional regulars find value in monthly memberships and class packs. Travelers, weekenders and camp participants choose day passes, retreat bundles and immersive experiences.";

export const metadata: Metadata = {
  title: "Passes, Recovery & More",
  description: "Every BaseCamp CamSur price beyond the monthly tiers: class packs, day passes, open gym, yoga, recovery, camps and corporate bookings, with starting prices in PHP.",
};

export default async function PriceGuidePage() {
  const { pricing } = await getSiteContent();
  const tierGroups = groupsFor(pricing.groups, "overview");
  const otherGroups = pricing.groups.filter((g) => !tierGroups.includes(g));

  return (
    <DetailTemplate
      path={PATH}
      hero={<PageHero title="Passes, recovery and more." intro="Starting prices for everything beyond the monthly tiers, in one place." image="/images/programs/program-functional.png" imageAlt="Functional training at BaseCamp CamSur" />}
      glance={{ summary: "Packs and day passes.\nYoga and recovery.\nCamps and teams.", statement: true }}
      related={["/membership/passes", "/membership/recovery-pricing", "/membership/corporate"]}
      cta={<>
        <CtaBand eyebrow="Price guide" title="Need help choosing?" label="Talk to us" href="/contact?interest=membership-local" />
      </>}
    >
      <FromPrices id="from-prices" groups={otherGroups} eyebrow="Everything else" title="Passes, recovery and more." intro={AUDIENCE_INTRO} />
    </DetailTemplate>
  );
}
