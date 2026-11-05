import type { Metadata } from "next";
import { PriceBlock } from "@/components/membership/PriceTable";
import { fromChip, groupsFor, toBlocks } from "@/components/membership/pricing";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { getSiteContent } from "@/content/get";

const PATH = "/membership/yoga";

export async function generateMetadata(): Promise<Metadata> {
  const { pricing } = await getSiteContent();
  const from = fromChip(groupsFor(pricing.groups, "yoga").flatMap((g) => g.items));
  return {
    title: "Yoga Pricing",
    description: `BaseCamp CamSur yoga pricing${from ? ` (${from})` : ""}: single classes, 5- and 10-class packs, and the unlimited yoga add-on for Athlete and Premium members.`,
  };
}

export default async function YogaPricingPage() {
  const { settings, pricing, recovery } = await getSiteContent();
  const blocks = toBlocks(groupsFor(pricing.groups, "yoga"));
  const intro = blocks[0]?.groups[0]?.intro || "Drop in for one class, save with a pack, or add unlimited yoga to your membership.";

  return (
    <DetailTemplate
      path={PATH}
      hero={<PageHero title="Breathe. Stretch. Reset." intro="Yoga to balance hard training, priced per class, per pack or as a membership add-on." image="/images/destination/train.png" imageAlt="Coach adjusting a seated stretch in the BaseCamp CamSur studio" />}
      glance={{ summary: "Single classes.\nSave with packs.\nUnlimited add-on.", statement: true }}
      related={["/membership/recovery-pricing", "/membership#tiers", "/classes/recovery-mobility"]}
      cta={<>
        <CtaBand eyebrow="Yoga" title="Roll out your mat." label="Register interest" href="/contact?interest=yoga" />
      </>}
    >
      {blocks.length > 0 && (
        <section className="section">
          <div className="shell">
            <div className="section-heading split-heading light-split" data-reveal>
              <div><p className="eyebrow">Yoga pricing</p><h2>Every class, priced.</h2></div>
              <p>{intro}</p>
            </div>
            <div className="mb-panel">
              {blocks.map((block) => <PriceBlock key={block.key} block={block} exchangeRate={settings.exchangeRate} disclaimer={recovery.disclaimer} />)}
            </div>
          </div>
        </section>
      )}
    </DetailTemplate>
  );
}
