import type { Metadata } from "next";
import Link from "next/link";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import { Cards, Split, Stats } from "@/components/sections/Layouts";
import PageHero from "@/components/sections/PageHero";
import StatusBadge from "@/components/ui/StatusBadge";
import CampCards from "@/components/visit/CampCards";
import { getSiteContent } from "@/content/get";
import { CAMPS, CAMPS_CTA, CAMPS_GLANCE, CAMPS_HERO, CAMPS_META, LONG_STAYS } from "@/data/visit";

// Static metadata object (01-app/03-api-reference/04-functions/generate-metadata.md#the-metadata-object).
export const metadata: Metadata = CAMPS_META;

// Four sections, four looks: camp types (photo cards) → the camp experience (big-word strip) → camp packages
// (rows, from pricing group `camps`) → groups + long stays (photo + text, dark). Anchors kept: #camps,
// #camps-pricing, #long-stays. Static rule (spec §0.17): only awaits the cached getSiteContent().
export default async function CampsPage() {
  const c = await getSiteContent();
  const campGroup = c.pricing.groups.find((g) => g.id === "camps");
  const campItems = (campGroup?.items ?? []).filter((i) => i.visible);

  return (
    <DetailTemplate
      path="/visit/camps"
      hero={<PageHero {...CAMPS_HERO} />}
      glance={{ summary: CAMPS_GLANCE.summary, statement: true }}
      related={["/visit/why-camsur", "/membership/price-guide"]}
      cta={<CtaBand eyebrow={CAMPS_CTA.eyebrow} />}
    >
      <Cards id="camps" eyebrow={CAMPS.eyebrow} title={CAMPS.title} intro={CAMPS.intro}
        items={CAMPS.types.map((t) => ({ ...t, tag: CAMPS.tag }))} />

      <Stats eyebrow={CAMPS.flowEyebrow} title={CAMPS.flowTitle} items={CAMPS.flow} />

      {campItems.length > 0 && (
        <section id="camps-pricing" className="section sd-ev sd-ev-band">
          <div className="shell">
            <div className="sd-tt-head sd-tt-head-light" data-reveal>
              <div><p className="sd-tt-eyebrow">{CAMPS.pricesTitle}</p><h2>{campGroup?.title}</h2></div>
              <p><Link href={CAMPS.pricingEnquiry.href} className="text-link">{CAMPS.pricingEnquiry.label}</Link></p>
            </div>
            <CampCards items={campItems} exchangeRate={c.settings.exchangeRate} enquiryLabel={CAMPS.enquiryLabel} requestLabel={CAMPS.requestLabel} />
          </div>
        </section>
      )}

      <Split id="long-stays" look="dark" reverse eyebrow={LONG_STAYS.eyebrow} title={LONG_STAYS.title} body={LONG_STAYS.body}
        badge={<StatusBadge availability={LONG_STAYS.availability} />} chips={LONG_STAYS.who} cta={LONG_STAYS.cta}
        image={LONG_STAYS.image} imageAlt={LONG_STAYS.imageAlt} />
    </DetailTemplate>
  );
}
