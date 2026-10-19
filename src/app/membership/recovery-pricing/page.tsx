import type { Metadata } from "next";
import { PriceBlock, PricingNotes } from "@/components/membership/PriceTable";
import { fromChip, groupsFor, toBlocks } from "@/components/membership/pricing";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { getSiteContent } from "@/content/get";

const PATH = "/membership/recovery-pricing";

// Static: only the cached getSiteContent() is awaited (stage-2 §0.17).
export async function generateMetadata(): Promise<Metadata> {
  const { pricing } = await getSiteContent();
  const recoveryFrom = fromChip(pricing.groups.filter((g) => g.anchor === "recovery-pricing").flatMap((g) => g.items));
  return {
    title: "Recovery Pricing",
    description: `Prices for recovery sessions${recoveryFrom ? ` (${recoveryFrom})` : ""}, advanced recovery modalities and yoga at BaseCamp CamSur, each labeled with its availability.`,
  };
}

export default async function RecoveryPricingPage() {
  const { settings, pricing, recovery } = await getSiteContent();
  const groups = groupsFor(pricing.groups, "recovery");
  const blocks = toBlocks(groups);
  const items = (anchor: string) => groups.filter((g) => g.anchor === anchor).flatMap((g) => g.items);
  // A tier feature that bundles recovery credits (e.g. Premium), quoted from content rather than restated.
  const creditTier = (pricing.groups.find((g) => g.id === "memberships")?.items ?? [])
    .filter((i) => i.visible)
    .flatMap((i) => i.features.filter((f) => /recovery credit/i.test(f)).map((feature) => ({ name: i.name, feature })))[0];
  const intro = creditTier
    ? `${creditTier.name} membership includes ${creditTier.feature.charAt(0).toLowerCase()}${creditTier.feature.slice(1)}. Everyone else pays per session, pack or bundle.`
    : "Pay per session, pack or bundle.";

  return (
    <DetailTemplate
      path={PATH}
      hero={<PageHero eyebrow="Membership · Recovery pricing" title="Recover like you train." intro="Prices for every recovery session, add-on and yoga class, with USD approximations." image="/images/programs/generated/recovery-mobility.png" imageAlt="Mobility and recovery session at BaseCamp CamSur" />}
      glance={{
        summary: "Recovery sessions, advanced modalities and yoga, each labeled with when it becomes available.",
        facts: [
          { label: "Recovery sessions", value: fromChip(items("recovery-pricing")) },
          { label: "Advanced recovery", value: fromChip(items("advanced-recovery")) },
          { label: "Yoga", value: fromChip(items("yoga")) },
        ],
      }}
      related={["/facilities/recovery", "/programs/recovery-mobility", "/programs/personal-coaching", "/membership#tiers"]}
      cta={<>
        <CtaBand eyebrow="Recovery" title="Make recovery part of the plan." label="Register interest" href="/contact?interest=recovery" />
      </>}
    >
      {blocks.length > 0 && (
        <section className="section">
          <div className="shell">
            <div className="section-heading split-heading light-split" data-reveal>
              <div><p className="eyebrow">Recovery pricing</p><h2>Every session, priced.</h2></div>
              <p>{intro}</p>
            </div>
            <div className="mb-panel">
              {blocks.map((block) => <PriceBlock key={block.key} block={block} exchangeRate={settings.exchangeRate} disclaimer={recovery.disclaimer} />)}
            </div>
            <PricingNotes notes={pricing.notes} />
          </div>
        </section>
      )}
    </DetailTemplate>
  );
}
