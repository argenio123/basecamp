import type { Metadata } from "next";
import AudienceTabs from "@/components/membership/AudienceTabs";
import { PricingNotes } from "@/components/membership/PriceTable";
import { fromChip, groupsFor } from "@/components/membership/pricing";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { getSiteContent } from "@/content/get";

const PATH = "/membership/passes";

// Static: only the cached getSiteContent() is awaited (stage-2 §0.17).
export async function generateMetadata(): Promise<Metadata> {
  const { pricing } = await getSiteContent();
  const items = (anchor: string) => pricing.groups.filter((g) => g.anchor === anchor).flatMap((g) => g.items);
  const prices = [
    ["class packs", fromChip(items("packs"))],
    ["day passes", fromChip(items("day-passes"))],
    ["open gym", fromChip(items("open-gym"))],
  ].filter(([, v]) => v).map(([k, v]) => `${k} ${v}`).join(", ");
  return {
    title: "Class Packs & Day Passes",
    description: `BaseCamp CamSur class packs, drop-ins, day passes and open-gym passes${prices ? `: ${prices}` : ""}. Prices in PHP with USD approximations.`,
  };
}

export default async function PassesPage() {
  const { settings, pricing, recovery } = await getSiteContent();
  const groups = groupsFor(pricing.groups, "passes");
  const items = (anchor: string) => groups.filter((g) => g.anchor === anchor).flatMap((g) => g.items);

  return (
    <DetailTemplate
      path={PATH}
      hero={<PageHero eyebrow="Membership · Passes" title="Train on your terms." intro="Try classes with a pack, drop in for a day, or train on your own with an open-gym pass." image="/images/programs/program-strength.png" imageAlt="Strength training session at BaseCamp CamSur" />}
      glance={{
        summary: "Class packs for regulars who are not ready to commit, plus drop-ins, day passes and open-gym passes for visitors.",
        facts: [
          { label: "Class packs", value: fromChip(items("packs")) },
          { label: "Day passes", value: fromChip(items("day-passes")) },
          { label: "Open gym", value: fromChip(items("open-gym")) },
        ],
      }}
      related={["/membership#tiers", "/schedule/book", "/visit/camps", "/membership/recovery-pricing"]}
      cta={<>
        <CtaBand eyebrow="Passes" title="Try your first class." label="Register interest" href="/contact?interest=drop-in" />
      </>}
    >
      <section className="section">
        <div className="shell">
          <AudienceTabs groups={groups} exchangeRate={settings.exchangeRate} disclaimer={recovery.disclaimer}
            eyebrow="Passes" title="Pay as you train."
            intro="Locals start with a class pack; travelers and weekenders pick a drop-in or day pass. Open-gym passes suit everyone." />
          <PricingNotes notes={pricing.notes} />
        </div>
      </section>
    </DetailTemplate>
  );
}
