import type { Metadata } from "next";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import CampCards from "@/components/visit/CampCards";
import { getSiteContent } from "@/content/get";
import { CAMPS } from "@/data/visit";

const PATH = "/membership/camps";

export const metadata: Metadata = {
  title: "Camp Pricing",
  description: "BaseCamp CamSur camp pricing: day workshops Php 3,500–6,000, weekend training camps Php 7,500–12,000, all-inclusive weekends Php 18,000–35,000 and five-day immersives Php 60,000–120,000. 20% off when booked 60+ days ahead.",
};

export default async function CampPricingPage() {
  const { settings, pricing } = await getSiteContent();
  const campGroup = pricing.groups.find((g) => g.id === "camps");
  const campItems = (campGroup?.items ?? []).filter((i) => i.visible);

  return (
    <DetailTemplate
      path={PATH}
      hero={<PageHero title="Train away. Come back stronger." intro="Clinics, weekend camps and immersive weeks, priced per person." image="/images/destination/transform.png" imageAlt="Athletes training with kettlebells at BaseCamp CamSur" />}
      glance={{ summary: "One-day clinics.\nWeekend camps.\nFive-day immersives.", statement: true }}
      related={["/visit/camps", "/membership/launch-promotions", "/membership/price-guide"]}
      cta={<>
        <CtaBand eyebrow="Camps" title="Plan your camp." label="Ask about camps" href="/contact?interest=training-camp" />
      </>}
    >
      {campItems.length > 0 && (
        <section className="section">
          <div className="shell">
            <div className="section-heading split-heading light-split" data-reveal>
              <div><p className="eyebrow">{CAMPS.pricesTitle}</p><h2>{campGroup?.title}</h2></div>
              {campGroup?.intro && <p>{campGroup.intro}</p>}
            </div>
            <CampCards items={campItems} exchangeRate={settings.exchangeRate} enquiryLabel={CAMPS.enquiryLabel} requestLabel={CAMPS.requestLabel} />
          </div>
        </section>
      )}
    </DetailTemplate>
  );
}
