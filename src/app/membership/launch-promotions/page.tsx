import type { Metadata } from "next";
import LaunchPromos, { CAMP_EARLY_DISCOUNT, launchFoundingRate, launchPromoPrices } from "@/components/membership/LaunchPromos";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { formatPhp } from "@/content/format";
import { getSiteContent } from "@/content/get";
import { percentText } from "@/components/membership/localize";
import { alternatesFor } from "@/i18n/paths";
import { t } from "@/i18n/server";

const PATH = "/membership/launch-promotions";

// Prices come from the pricing content (the same values LaunchPromos and the price guide show), so the description
// never disagrees with the page. Only the cached getSiteContent() is awaited, so it stays prerenderable.
export async function generateMetadata(): Promise<Metadata> {
  const { pricing, settings } = await getSiteContent();
  const p = launchPromoPrices(pricing.groups);
  const f = launchFoundingRate(settings.founding, pricing.groups);
  const php = (n: number) => formatPhp({ min: n, max: null });
  const parts = [
    f ? t("{tier} membership {standard} vs {founding} founding rate ({percent} off)", { tier: f.tier, standard: php(f.standard), founding: php(f.founding), percent: percentText(f.percent) }) : "",
    p.dayStandard != null && p.dayWeekend != null ? t("day pass {standard} standard vs {weekend} weekend", { standard: php(p.dayStandard), weekend: php(p.dayWeekend) }) : "",
    t("{discount} off camps booked 60+ days ahead", { discount: CAMP_EARLY_DISCOUNT }),
  ].filter(Boolean);
  return {
    title: t("Launch Promotions"),
    description: t("BaseCamp CamSur launch promotions: {offers}.", { offers: parts.join(", ") }),
    alternates: alternatesFor(PATH),
  };
}

export default function LaunchPromotionsPage() {

  return (
    <DetailTemplate
      path={PATH}
      hero={<PageHero variant="split" title={t("Launch rates.")} intro={t("Launch offers for the community, reviewed after the first 90 days.")} image="/images/membership/generated/launch-promotions-hero-basecamp-interior.webp" imageAlt={t("BaseCamp CamSur members cheering on an athlete during a launch-day sled workout inside the glass-fronted training hall")} />}
      glance={{ summary: t("Founding rates.\nWeekend passes.\nEarly-bird camps."), statement: true }}
      related={["/membership/founding", "/membership#tiers", "/membership/price-guide"]}
      cta={<>
        <CtaBand eyebrow={t("Launch promotions")} title={t("Lock in a launch rate.")} label={t("Register interest")} href="/membership#tiers" />
      </>}
    >
      <LaunchPromos />
    </DetailTemplate>
  );
}
