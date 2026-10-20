import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import StatusBadge from "@/components/ui/StatusBadge";
import CampCards from "@/components/visit/CampCards";
import VisitItems from "@/components/visit/VisitItems";
import { formatPhp } from "@/content/format";
import { getSiteContent } from "@/content/get";
import { AVAILABILITY_LABEL } from "@/content/labels";
import { CAMPS, CAMPS_CTA, CAMPS_GLANCE, CAMPS_HERO, CAMPS_META, LONG_STAYS } from "@/data/visit";

// Static metadata object (01-app/03-api-reference/04-functions/generate-metadata.md#the-metadata-object).
export const metadata: Metadata = CAMPS_META;

// Detail (stage-3 §1/§7): camps + camps pricing (moved from /membership) + long stays.
// Anchors kept for menus and forwarded links: #camps, #camps-pricing, #long-stays.
// Static rule (spec §0.17): only awaits the cached getSiteContent(), so the page prerenders.
export default async function CampsPage() {
  const c = await getSiteContent();
  const campGroup = c.pricing.groups.find((g) => g.id === "camps");
  const campItems = (campGroup?.items ?? []).filter((i) => i.visible);
  const prices = campItems.flatMap((i) => (i.price ? [i.price.min] : []));
  const fromPrice = prices.length > 0 ? formatPhp({ min: Math.min(...prices), max: null }) : "";
  const statuses = [...new Set(campItems.map((i) => i.availability))];


  return (
    <DetailTemplate
      path="/visit/camps"
      hero={<PageHero {...CAMPS_HERO} />}
      glance={{
        summary: CAMPS_GLANCE.summary,
        facts: [
          campItems.length > 0 && { label: CAMPS.pricesTitle, value: String(campItems.length) },
          fromPrice && { label: "From", value: fromPrice },
          { label: "Booking", value: CAMPS.enquiryLabel },
          statuses.length === 1 && { label: "Status", value: AVAILABILITY_LABEL[statuses[0]] },
        ],
      }}
      related={["/visit/why-camsur", "/classes/coaching", "/membership/passes"]}
      cta={<CtaBand eyebrow={CAMPS_CTA.eyebrow} />}
    >
      <section id="camps" className="section shell">
        <div className="split-heading light-split" data-reveal>
          <div><p className="eyebrow">{CAMPS.eyebrow}</p><h2>{CAMPS.title}</h2></div>
          <div><p>{CAMPS.intro}</p><p>{CAMPS.assessment.text}. <Link href={CAMPS.assessment.href} className="vt-inline-link">{CAMPS.assessment.label} →</Link></p></div>
        </div>
        <div className="vt-row-head" data-reveal><h3 className="vt-subhead">{CAMPS.typesTitle}</h3></div>
        <VisitItems items={CAMPS.types} cols={5} note={CAMPS.enquiryLabel} label={CAMPS.typesTitle} />
        <div className="vt-who" data-reveal>
          <h3 className="vt-subhead">{CAMPS.whoTitle}</h3>
          <ul className="vt-chips" aria-label={CAMPS.whoTitle}>{CAMPS.who.map((w) => <li key={w}>{w}</li>)}</ul>
          <Link href={CAMPS.cta.href} className="button button-dark">{CAMPS.cta.label} <span>↗</span></Link>
        </div>
      </section>

      {campItems.length > 0 && (
        <section id="camps-pricing" className="section vt-deep">
          <div className="shell">
            <div className="nv-block-head" data-reveal>
              <p className="eyebrow">{CAMPS.pricesTitle}</p>
              <h2>{campGroup?.title}</h2>
              {campGroup?.intro && <p className="nv-block-intro">{campGroup.intro}</p>}
            </div>
            <CampCards items={campItems} exchangeRate={c.settings.exchangeRate} enquiryLabel={CAMPS.enquiryLabel} requestLabel={CAMPS.requestLabel} />
            <p className="vt-pricing-link" data-reveal><Link href={CAMPS.pricingEnquiry.href} className="text-link">{CAMPS.pricingEnquiry.label} <span>↗</span></Link></p>
          </div>
        </section>
      )}

      <section id="long-stays" className="section">
        <div className="shell vt-long">
          <div className="image-frame" data-reveal><Image src={LONG_STAYS.image} alt={LONG_STAYS.imageAlt} fill sizes="(max-width: 760px) 100vw, 50vw" className="cover-image" /></div>
          <div data-reveal data-reveal-delay="short">
            <p className="eyebrow">{LONG_STAYS.eyebrow}</p>
            <h2>{LONG_STAYS.title}</h2>
            <StatusBadge availability={LONG_STAYS.availability} />
            <p className="vt-long-body">{LONG_STAYS.body}</p>
            <Link href={LONG_STAYS.cta.href} className="button button-dark">{LONG_STAYS.cta.label} <span>↗</span></Link>
          </div>
        </div>
      </section>
    </DetailTemplate>
  );
}
