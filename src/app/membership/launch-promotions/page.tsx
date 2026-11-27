import type { Metadata } from "next";
import LaunchPromos, { CAMP_EARLY_DISCOUNT, launchFoundingRate, launchPromoPrices } from "@/components/membership/LaunchPromos";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { formatPhp } from "@/content/format";
import { getSiteContent } from "@/content/get";

const PATH = "/membership/launch-promotions";

// Prices come from the pricing content (the same values LaunchPromos and the price guide show), so the description
// never disagrees with the page. Only the cached getSiteContent() is awaited, so it stays prerenderable.
export async function generateMetadata(): Promise<Metadata> {
  const { pricing, settings } = await getSiteContent();
  const p = launchPromoPrices(pricing.groups);
  const f = launchFoundingRate(settings.founding, pricing.groups);
  const php = (n: number) => formatPhp({ min: n, max: null });
  const parts = [
    f ? `${f.tier} membership ${php(f.standard)} vs ${php(f.founding)} founding rate (${f.percent} off)` : "",
    p.dayStandard != null && p.dayWeekend != null ? `day pass ${php(p.dayStandard)} standard vs ${php(p.dayWeekend)} weekend` : "",
    `${CAMP_EARLY_DISCOUNT} off camps booked 60+ days ahead`,
  ].filter(Boolean);
  return { title: "Launch Promotions", description: `BaseCamp CamSur launch promotions: ${parts.join(", ")}.` };
}

export default function LaunchPromotionsPage() {

  return (
    <DetailTemplate
      path={PATH}
      hero={<PageHero title="Launch rates." intro="Launch offers for the community, reviewed after the first 90 days." image="/images/membership/generated/launch-promotions-hero-basecamp-interior.webp" imageAlt="BaseCamp CamSur members cheering on an athlete during a launch-day sled workout inside the glass-fronted training hall" />}
      glance={{ summary: "Founding rates.\nWeekend passes.\nEarly-bird camps.", statement: true }}
      related={["/membership/founding", "/membership#tiers", "/membership/price-guide"]}
      cta={<>
        <CtaBand eyebrow="Launch promotions" title="Lock in a launch rate." label="Register interest" href="/membership#tiers" />
      </>}
    >
      <LaunchPromos />
    </DetailTemplate>
  );
}
