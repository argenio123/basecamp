import type { Metadata } from "next";
import Link from "next/link";
import ItemList from "@/components/facilities/ItemList";
import RecoveryGrid from "@/components/facilities/RecoveryGrid";
import { modalityFacts, statFact } from "@/components/facilities/facts";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import StatusBadge from "@/components/ui/StatusBadge";
import { MODALITY_PRICE_ID } from "@/content/constants";
import { priceItemMap } from "@/content/format";
import { getSiteContent } from "@/content/get";
import type { PriceItem } from "@/content/types";
import { FACILITIES_CTA, RECOVERY, RECOVERY_HERO } from "@/data/facilities";

export const metadata: Metadata = {
  title: "Recovery level",
  description: "The BaseCamp CamSur recovery level: cold and hot plunge pools, saunas, contrast therapy and treatment rooms, with the launch status of every modality.",
};

const DISCLAIMER_ID = "recovery-disclaimer";

// Stage-3 §1: /facilities/recovery holds [recovery]: modalities with availability labels + the medical
// disclaimer (spec §0.11, shown because hyperbaric therapy appears on this page).
export default async function FacilitiesRecoveryPage() {
  const c = await getSiteContent();
  const prices = priceItemMap(c.pricing.groups);
  const recoveryPrices = Object.values(MODALITY_PRICE_ID).flatMap((id): PriceItem[] => { const p = prices.get(id); return p ? [p] : []; });
  const [total, launch, later] = modalityFacts(c.recovery.modalities);
  const hasModalities = c.recovery.modalities.length > 0;

  return (
    <DetailTemplate
      path="/facilities/recovery"
      hero={<PageHero {...RECOVERY_HERO} />}
      glance={{
        summary: "An entire wellness level for cold, heat and contrast therapy, designed for training camps, with the launch status of every modality.",
        facts: [statFact(c.home.stats.items, "floor"), total, launch, later],
      }}
      related={["/membership/recovery-pricing", "/classes/recovery-mobility", "/facilities/lifestyle"]}
      cta={<CtaBand {...FACILITIES_CTA} />}
    >
      <section id="infrastructure" className="section">
        <div className="shell">
          <div className="split-heading light-split" data-reveal><div><p className="eyebrow">Zone 04 · {RECOVERY.eyebrow}</p><h2>Recovery infrastructure.</h2></div></div>
          <div className="fc-recovery-infra">
            <div><h3 className="fc-subhead" data-reveal>{RECOVERY.core.title}</h3><ItemList items={RECOVERY.core.items} cols={2} /></div>
            <div><h3 className="fc-subhead" data-reveal>{RECOVERY.volume.title}</h3><ItemList items={RECOVERY.volume.items} cols={2} /></div>
          </div>
          <blockquote className="fc-pull fc-pull-wide" data-reveal>{RECOVERY.quote}</blockquote>
        </div>
      </section>

      <section id="modalities" className="section section-dark">
        <div className="shell">
          {hasModalities && (
            <>
              <div className="split-heading" data-reveal><div><p className="eyebrow eyebrow-light">Modalities</p><h2>{RECOVERY.gridTitle}</h2></div>{c.recovery.intro && <p>{c.recovery.intro}</p>}</div>
              <RecoveryGrid modalities={c.recovery.modalities} priceItems={recoveryPrices} exchangeRate={c.settings.exchangeRate} disclaimerId={DISCLAIMER_ID} />
            </>
          )}
          {c.recovery.disclaimer && <p id={DISCLAIMER_ID} className="fc-disclaimer" data-reveal>{c.recovery.disclaimer}</p>}
          <div data-reveal><Link href={RECOVERY.pricingLink.href} className="text-link light">{RECOVERY.pricingLink.label} <span>↗</span></Link></div>
        </div>
      </section>

      <section id="rituals" className="section fc-zone-deep">
        <div className="shell">
          <div className="split-heading light-split" data-reveal><div><p className="eyebrow">Protocols</p><h2>Rituals & equipment.</h2></div></div>
          <div className="fc-recovery-extras" data-reveal="stagger">
            <article><h3>{RECOVERY.rituals.title}</h3><p>{RECOVERY.rituals.body}</p></article>
            <article><div className="fc-badges"><h3>{RECOVERY.launchEquipment.title}</h3><StatusBadge availability="at-launch" /></div><ul>{RECOVERY.launchEquipment.items.map((item) => <li key={item}>{item}</li>)}</ul></article>
          </div>
        </div>
      </section>
    </DetailTemplate>
  );
}
