import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import StatusBadge from "@/components/ui/StatusBadge";
import CampCards from "@/components/visit/CampCards";
import { getSiteContent } from "@/content/get";
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


  return (
    <DetailTemplate
      path="/visit/camps"
      hero={<PageHero {...CAMPS_HERO} />}
      glance={{ summary: CAMPS_GLANCE.summary, statement: true }}
      related={["/visit/why-camsur", "/membership/price-guide"]}
      cta={<CtaBand eyebrow={CAMPS_CTA.eyebrow} />}
    >
      <section id="camps" className="section sd-ev">
        <div className="shell">
          <div className="sd-tt-head sd-tt-head-light" data-reveal>
            <div><p className="sd-tt-eyebrow">{CAMPS.eyebrow}</p><h2>{CAMPS.title}</h2></div>
            <p>{CAMPS.intro} {CAMPS.assessment.text}.</p>
          </div>
          <h3 className="sd-ev-subhead" data-reveal>{CAMPS.typesTitle}</h3>
          <ul className="sd-ev-rows" aria-label={CAMPS.typesTitle} data-reveal="stagger">
            {CAMPS.types.map((t, i) => (
              <li className="sd-ev-row sd-ev-row-static vt-type" key={t.title} style={{ "--i": i } as CSSProperties}>
                <div>
                  <span className="sd-ev-when"><strong>{String(i + 1).padStart(2, "0")}</strong></span>
                  <span className="sd-ev-body">
                    <span className="sd-ev-title">{t.title}</span>
                    {t.body && <span className="sd-ev-desc">{t.body}</span>}
                  </span>
                  <span className="vt-pk-tags"><StatusBadge availability={t.availability} /><span className="vt-pk-note">{CAMPS.enquiryLabel}</span></span>
                </div>
              </li>
            ))}
          </ul>
          <div className="vt-who-board" data-reveal>
            <div>
              <p className="sd-tt-eyebrow">{CAMPS.whoTitle}</p>
              <ul aria-label={CAMPS.whoTitle}>{CAMPS.who.map((w) => <li key={w}>{w}</li>)}</ul>
            </div>
            <Link href={CAMPS.cta.href} className="vt-who-cta">{CAMPS.cta.label}</Link>
          </div>
        </div>
      </section>

      {campItems.length > 0 && (
        <section id="camps-pricing" className="section sd-ev sd-ev-band">
          <div className="shell">
            <div className="sd-tt-head sd-tt-head-light" data-reveal>
              <div><p className="sd-tt-eyebrow">{CAMPS.pricesTitle}</p><h2>{campGroup?.title}</h2></div>
              {campGroup?.intro && <p>{campGroup.intro}</p>}
            </div>
            <CampCards items={campItems} exchangeRate={c.settings.exchangeRate} enquiryLabel={CAMPS.enquiryLabel} requestLabel={CAMPS.requestLabel} />
            <p className="vt-pricing-link" data-reveal><Link href={CAMPS.pricingEnquiry.href} className="text-link">{CAMPS.pricingEnquiry.label}</Link></p>
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
            <Link href={LONG_STAYS.cta.href} className="button button-dark">{LONG_STAYS.cta.label}</Link>
          </div>
        </div>
      </section>
    </DetailTemplate>
  );
}
