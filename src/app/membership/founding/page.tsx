import type { Metadata } from "next";
import { foundingItemId } from "@/lib/payments/founding-link";
import { payHref } from "@/lib/payments/types";
import FoundingPass from "@/components/membership/FoundingPass";
import { foundingSaving } from "@/components/membership/pricing";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import "./founding.css";
import PageHero from "@/components/sections/PageHero";
import { getSiteContent } from "@/content/get";

const PATH = "/membership/founding";

// The saving is worked out from the actual founding and standard prices (Php 3,200 vs Php 4,500 → "about 29%"),
// so the description never overstates it. Only the cached getSiteContent() is awaited, so it stays prerenderable.
export async function generateMetadata(): Promise<Metadata> {
  const { settings, pricing } = await getSiteContent();
  const saving = foundingSaving(settings.founding.example, pricing.groups);
  const offer = saving?.percent ? `a proposed saving of ${saving.percent} for your first six months` : "a proposed founding rate for your first six months";
  return {
    title: "Founding Members",
    description: `Become a BaseCamp CamSur founding member: ${offer} or a locked lifetime alumni rate, priority access to camps and events, and an exclusive launch event.`,
  };
}

export default async function FoundingPage() {
  const { settings } = await getSiteContent();
  const { founding } = settings;

  return (
    <DetailTemplate
      path={PATH}
      hero={<PageHero title="Be one of the first." intro="Join before opening and keep the founding rate, priority access and a place at the launch event." image="/images/membership/generated/founding-members-community.webp" imageAlt="Founding gym members gathering together after their first workout" />}
      glance={{ summary: "Founding rates.\nPriority access.\nA seat at launch.", statement: true }}
      related={["/membership#tiers", "/membership/launch-promotions", "/about/faq"]}
      cta={<>
        <CtaBand className="ft-cta--display" eyebrow="Founding members" title="Claim your founding spot." label={founding.ctaLabel || "Become an early member"} href={foundingItemId(founding.example) ? payHref(foundingItemId(founding.example), "founding") : "/membership#tiers"} />
      </>}
    >
      <FoundingPass founding={founding} exchangeRate={settings.exchangeRate} />
    </DetailTemplate>
  );
}
