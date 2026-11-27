import type { Metadata } from "next";
import { MEMBERSHIP_PLANS_PATH } from "@/content/constants";
import { getFoundingAvailability } from "@/lib/payments/founding";
import { payHref } from "@/lib/payments/types";
import FoundingPass from "@/components/membership/FoundingPass";
import { foundingSaving } from "@/components/membership/pricing";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import "./founding.css";
import PageHero from "@/components/sections/PageHero";
import { getSiteContent } from "@/content/get";
import { percentText } from "@/components/membership/localize";
import { alternatesFor } from "@/i18n/paths";
import { t } from "@/i18n/server";

const PATH = "/membership/founding";

// The saving is worked out from the actual founding and standard prices (Php 3,150 vs Php 4,500 → "30%"),
// so the description never overstates it. Only the cached getSiteContent() is awaited, so it stays prerenderable.
export async function generateMetadata(): Promise<Metadata> {
  const { settings, pricing } = await getSiteContent();
  const saving = foundingSaving(settings.founding, pricing.groups);
  const offer = saving?.percent ? t("{percent} off for your first six months", { percent: percentText(saving.percent) }) : t("a founding rate for your first six months");
  return {
    title: t("Founding Members"),
    description: t("Become a BaseCamp CamSur founding member: {offer} or a locked lifetime alumni rate, priority access to camps and events, and an exclusive launch event.", { offer }),
    alternates: alternatesFor(PATH),
  };
}

export default async function FoundingPage() {
  const { settings, pricing } = await getSiteContent();
  const { founding } = settings;
  const rate = foundingSaving(founding, pricing.groups);
  // Cap reached: the closing band points to the standard plans instead of the founding checkout.
  const full = founding.enabled && (await getFoundingAvailability(founding)).state === "full";
  const foundingHref = rate ? payHref(rate.tierId, "founding") : MEMBERSHIP_PLANS_PATH;

  return (
    <DetailTemplate
      path={PATH}
      hero={<PageHero title={t("Be one of the first.")} intro={t("Join before opening and keep the founding rate, priority access and a place at the launch event.")} image="/images/membership/generated/founding-members-community.webp" imageAlt={t("Founding gym members gathering together after their first workout")} />}
      glance={{ summary: t("Founding rates.\nPriority access.\nA seat at launch."), statement: true }}
      related={["/membership#tiers", "/membership/launch-promotions", "/about/faq"]}
      cta={<>
        {full
          ? <CtaBand className="ft-cta--display" eyebrow={t("Founding members")} title={t("Founding spots are full.")} body={t("All founding spots have been taken. Our standard memberships are open.")} label={t("See membership plans")} href={MEMBERSHIP_PLANS_PATH} />
          : <CtaBand className="ft-cta--display" eyebrow={t("Founding members")} title={t("Claim your founding spot.")} label={founding.ctaLabel || t("Become an early member")} href={foundingHref} />}
      </>}
    >
      <FoundingPass founding={founding} exchangeRate={settings.exchangeRate} />
    </DetailTemplate>
  );
}
