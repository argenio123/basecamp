import type { Metadata } from "next";
import Link from "next/link";
import ItemList from "@/components/facilities/ItemList";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import StatusBadge from "@/components/ui/StatusBadge";
import { AVAILABILITY_LABEL } from "@/content/labels";
import { FACILITY_ANCHORS } from "@/content/constants";
import { FACILITIES_CTA, FUEL, LIFESTYLE_HERO, SIGNATURE, SIGNATURE_PREVIEW, SOCIAL } from "@/data/facilities";

export const metadata: Metadata = {
  title: "Lounge, food & signature spaces",
  description: "Life beyond the workout at BaseCamp CamSur: the café and social lounge, planned performance Filipino menu concepts and signature spaces built to be photographed.",
};

// Stage-3 §1: /facilities/lifestyle holds [social-lounge] [fuel] [signature-spaces] (ids kept for menu and legacy links).
// Static copy only, so no content read is needed; the page prerenders.
export default function FacilitiesLifestylePage() {
  const yoga = SOCIAL.items.find((i) => i.availability);
  const shown = SIGNATURE.items.slice(0, SIGNATURE_PREVIEW);
  const more = SIGNATURE.items.slice(SIGNATURE_PREVIEW);

  return (
    <DetailTemplate
      path="/facilities/lifestyle"
      hero={<PageHero {...LIFESTYLE_HERO} />}
      glance={{
        summary: "A café and social hub, a performance food culture built on Filipino ingredients and signature spaces designed for long stays and great photos.",
        facts: [
          yoga?.availability && { label: yoga.title, value: AVAILABILITY_LABEL[yoga.availability] },
          { label: "Café menu", value: "Concepts planned" },
          { label: SIGNATURE.eyebrow, value: `${SIGNATURE.items.length} planned` },
          { label: SIGNATURE.av.title, value: AVAILABILITY_LABEL.planned },
        ],
      }}
      related={["/facilities/gallery", "/visit/camps", "/schedule/events"]}
      cta={<CtaBand {...FACILITIES_CTA} />}
    >
      <section id={FACILITY_ANCHORS.social} className="section">
        <div className="shell">
          <div className="split-heading light-split" data-reveal><div><p className="eyebrow">Zone 05</p><h2>{SOCIAL.title}</h2></div></div>
          <ItemList items={SOCIAL.items} cols={3} />
          <div className="section-link" data-reveal><Link href="/visit/camps#long-stays" className="text-link">Explore camps &amp; long stays <span aria-hidden="true">→</span></Link></div>
        </div>
      </section>

      <section id="fuel" className="section fc-zone-deep">
        <div className="shell">
          <div className="split-heading light-split" data-reveal><div><p className="eyebrow">{FUEL.eyebrow}</p><h2>{FUEL.title}</h2></div><div><p>{FUEL.line}</p><StatusBadge availability="planned" label={FUEL.label} /></div></div>
          <div className="fc-fuel" data-reveal="stagger">{FUEL.columns.map((col) => <div key={col.title}><h3>{col.title}</h3><ul>{col.items.map((item) => <li key={item}>{item}</li>)}</ul></div>)}</div>
          <ul className="fc-chips" aria-label="Fuel concepts" data-reveal="stagger">{FUEL.chips.map((chip) => <li key={chip}>{chip}</li>)}</ul>
        </div>
      </section>

      <section id="signature-spaces" className="section section-dark">
        <div className="shell">
          <div className="split-heading" data-reveal><div><p className="eyebrow eyebrow-light">{SIGNATURE.eyebrow}</p><h2>{SIGNATURE.title}</h2></div></div>
          <ItemList items={shown} cols={3} />
          {more.length > 0 && (
            <details className="fc-more">
              <summary><span className="fc-more-closed">See all {SIGNATURE.items.length}</span><span className="fc-more-open">Show fewer</span></summary>
              <ItemList items={more} cols={3} reveal={false} className="fc-more-items" />
            </details>
          )}
          <article className="fc-av" data-reveal><div><h3>{SIGNATURE.av.title}</h3><p>{SIGNATURE.av.body}</p><StatusBadge availability="planned" /></div><blockquote className="fc-pull">{SIGNATURE.av.quote}</blockquote></article>
        </div>
      </section>
    </DetailTemplate>
  );
}
