import type { Metadata } from "next";
import LaunchPromos, { CAMP_EARLY_DISCOUNT, INTRO_ATHLETE_RATE, launchPromoPrices } from "@/components/membership/LaunchPromos";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { formatPhp } from "@/content/format";
import { getSiteContent } from "@/content/get";

const PATH = "/membership/launch-promotions";

// Prices come from the pricing content (the same values LaunchPromos and the price guide show), so the description
// never disagrees with the page. Only the cached getSiteContent() is awaited, so it stays prerenderable.
export async function generateMetadata(): Promise<Metadata> {
  const { pricing } = await getSiteContent();
  const p = launchPromoPrices(pricing.groups);
  const php = (n: number) => formatPhp({ min: n, max: null });
  const parts = [
    p.athlete != null && INTRO_ATHLETE_RATE < p.athlete ? `Athlete membership ${php(p.athlete)} vs ${php(INTRO_ATHLETE_RATE)} introductory` : "",
    p.dayStandard != null && p.dayWeekend != null ? `day pass ${php(p.dayStandard)} standard vs ${php(p.dayWeekend)} weekend` : "",
    `${CAMP_EARLY_DISCOUNT} off camps booked 60+ days ahead`,
  ].filter(Boolean);
  return { title: "Launch Promotions", description: `BaseCamp CamSur launch promotions on test: ${parts.join(", ")}.` };
}

export default function LaunchPromotionsPage() {

  return (
    <DetailTemplate
      path={PATH}
      hero={<PageHero variant="split" title="Rates on test." intro="Launch offers we are testing with the community, reviewed after the first 90 days." image="/images/membership/generated/launch-promotions-hero-basecamp-interior.webp" imageAlt="BaseCamp CamSur members cheering on an athlete during a launch-day sled workout inside the glass-fronted training hall" />}
      glance={{ summary: "Introductory rates.\nWeekend passes.\nEarly-bird camps.", statement: true }}
      related={["/membership/founding", "/membership#tiers", "/membership/price-guide"]}
      cta={<>
        <CtaBand eyebrow="Launch promotions" title="Lock in a launch rate." label="Register interest" href="/membership#tiers" />
      </>}
    >
      <LaunchPromos />
    </DetailTemplate>
  );
}
