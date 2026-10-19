import type { Metadata } from "next";
import FoundingBand from "@/components/membership/FoundingBand";
import FromPrices from "@/components/membership/FromPrices";
import { PricingNotes, TierCards } from "@/components/membership/PriceTable";
import { fromChip, groupsFor } from "@/components/membership/pricing";
import { OverviewTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { formatPhp } from "@/content/format";
import { getSiteContent } from "@/content/get";

// Moved here from the stage-2 audience tabs: the audience framing now introduces the "from" prices.
const AUDIENCE_INTRO = "Local and regional regulars find value in monthly memberships and class packs. Travelers, weekenders and camp participants choose day passes, retreat bundles and immersive experiences.";

// Static rule (spec §0.17): only the cached getSiteContent() is awaited, so the page and its metadata prerender.
// generateMetadata with cached data stays prerenderable under Cache Components
// (03-api-reference/04-functions/generate-metadata.md, "With Cache Components").
export async function generateMetadata(): Promise<Metadata> {
  const { pricing } = await getSiteContent();
  const tiers = (pricing.groups.find((g) => g.id === "memberships")?.items ?? []).filter((i) => i.visible && i.price);
  const tierLine = tiers.map((i) => `${i.name} ${formatPhp(i.price)}${i.unit}`).join(", ");
  return {
    title: "Membership & Pricing",
    description: `BaseCamp CamSur membership and pricing${tierLine ? `: ${tierLine}` : ""}. Early-member rates, plus class packs, day passes, recovery and corporate pricing.`,
  };
}

export default async function MembershipPage() {
  const { settings, pricing } = await getSiteContent();
  const { founding } = settings;
  const tierGroups = groupsFor(pricing.groups, "overview");
  const otherGroups = pricing.groups.filter((g) => !tierGroups.includes(g));
  const tiers = tierGroups.flatMap((g) => g.items.filter((i) => i.visible));
  const tierGroup = tierGroups[0];
  const itemsAt = (anchor: string) => pricing.groups.filter((g) => g.anchor === anchor).flatMap((g) => g.items);


  return (
    <OverviewTemplate
      path="/membership"
      hero={<PageHero eyebrow="Membership & pricing" title="Choose access that fits how you train." intro={pricing.intro} image="/images/hero/hero-training.png" imageAlt="Athlete training at BaseCamp CamSur" />}
      glance={{
        summary: "Compare recurring memberships, flexible passes and recovery access before choosing the right way to join.",
        facts: [
          { label: "Memberships", value: fromChip(tiers) },
          { label: "Class packs", value: fromChip(itemsAt("packs")) },
          { label: "Day passes", value: fromChip(itemsAt("day-passes")) },
          { label: "Recovery", value: fromChip(itemsAt("recovery-pricing")) },
        ],
      }}
      cta={<>
        <CtaBand eyebrow="Membership guidance" title="Need help choosing?" body="Tell us how often you plan to train and what you want to work on. We will point you to the most suitable option." label="Talk to us" href="/contact?interest=membership-local" />
      </>}
    >
      <FoundingBand founding={founding} />
      {tiers.length > 0 && (
        <section id="tiers" className="section mb-tiers-section">
          <div className="shell">
            <div className="section-heading split-heading light-split" data-reveal>
              <div><p className="eyebrow">Membership tiers</p><h2>{tierGroup?.title || "Choose your tier."}</h2></div>
              {tierGroup?.intro && <p>{tierGroup.intro}</p>}
            </div>
            <TierCards items={tiers} exchangeRate={settings.exchangeRate} />
          </div>
        </section>
      )}
      <FromPrices id="from-prices" groups={otherGroups} eyebrow="Everything else" title="Passes, recovery and more." intro={AUDIENCE_INTRO}>
        <PricingNotes notes={pricing.notes} />
      </FromPrices>
    </OverviewTemplate>
  );
}
