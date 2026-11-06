import type { Metadata } from "next";
import { TierCards } from "@/components/membership/PriceTable";
import { groupsFor } from "@/components/membership/pricing";
import { OverviewTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { formatPhp } from "@/content/format";
import { getSiteContent } from "@/content/get";
import { findPage } from "@/content/sitemap";
import ScheduleExplore from "@/components/schedule/ScheduleExplore";



// Static rule (spec §0.17): only the cached getSiteContent() is awaited, so the page and its metadata prerender.
// generateMetadata with cached data stays prerenderable under Cache Components
// (03-api-reference/04-functions/generate-metadata.md, "With Cache Components").
export async function generateMetadata(): Promise<Metadata> {
  const { pricing } = await getSiteContent();
  const tiers = (pricing.groups.find((g) => g.id === "memberships")?.items ?? []).filter((i) => i.visible && i.price);
  const tierLine = tiers.map((i) => `${i.name} ${formatPhp(i.price)}${i.unit}`).join(", ");
  return {
    title: "Membership & Pricing",
    description: `BaseCamp CamSur membership and pricing${tierLine ? `: ${tierLine}` : ""}. Early-member rates, plus class packs, day passes, recovery, and corporate pricing.`,
  };
}

export default async function MembershipPage() {
  const { settings, pricing } = await getSiteContent();
  const tierGroups = groupsFor(pricing.groups, "overview");
  const tiers = tierGroups.flatMap((g) => g.items.filter((i) => i.visible));
  const tierGroup = tierGroups[0];


  return (
    <OverviewTemplate
      path="/membership"
      quote={false}
      cards={false}
      hero={<PageHero title="Choose access that fits how you train." intro={pricing.intro} image="/images/programs/generated/functional-training.png" imageAlt="Athlete driving a weighted sled in the BaseCamp CamSur open-air gym" />}
      glance={{
        summary: "Monthly memberships.\nFlexible passes.\nRecovery on demand.",
        statement: true,
      }}
      cta={<>
        <CtaBand eyebrow="Membership guidance" title="Need help choosing?" body="Tell us how often you plan to train and what you want to work on. We will point you to the most suitable option." label="Talk to us" href="/contact?interest=membership-local" className="mb-cta-expanded" />
      </>}
    >
      {tiers.length > 0 && (
        <section id="tiers" className="section mb-tiers-section">
          <div className="shell">
            <div className="section-heading split-heading light-split" data-reveal>
              <div><p className="eyebrow">Membership tiers</p><h2>Choose your tier.</h2></div>
              {tierGroup?.intro && <p>{tierGroup.intro}</p>}
            </div>
            <TierCards items={tiers} exchangeRate={settings.exchangeRate} />
          </div>
        </section>
      )}
      <ScheduleExplore
        eyebrow="Membership categories"
        title="More membership."
        intro="Founding rates, promotions, passes, recovery, yoga, camps, and team pricing. Pick a category to see every price."
        items={(findPage("/membership", [])?.section.pages ?? []).map((pg) => ({ href: pg.href, label: pg.label, summary: pg.summary, image: pg.image, imageAlt: pg.imageAlt }))}
      />
    </OverviewTemplate>
  );
}
