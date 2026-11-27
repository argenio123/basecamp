import Link from "next/link";
import { MEMBERSHIP_PLANS_PATH } from "@/content/constants";
import { getFoundingAvailability } from "@/lib/payments/founding";
import { payHref } from "@/lib/payments/types";
import FoundingCounter from "@/components/ui/FoundingCounter";
import { formatPhp } from "@/content/format";
import { getSiteContent } from "@/content/get";
import type { FoundingOffer } from "@/content/types";
import { localHref, t } from "@/i18n/server";
import { offerEndsText, percentText } from "./localize";
import { foundingSaving } from "./pricing";

const php = (n: number) => formatPhp({ min: n, max: null });

/**
 * /membership#founding (spec §C.6.2). Renders nothing while the offer is disabled or its price fails the sanity rule.
 * The price line is generated from settings.founding.tierId/price and the tier's listed price (as checkout charges).
 * `showBenefits={false}` when the page shows the benefits as cards (<BenefitCards>) instead.
 */
export default async function FoundingBand({ founding, showBenefits = true }: { founding: FoundingOffer; showBenefits?: boolean }) {
  if (!founding.enabled) return null;
  const { pricing } = await getSiteContent();
  const rate = foundingSaving(founding, pricing.groups);
  if (!rate) return null;
  const full = (await getFoundingAvailability(founding)).state === "full";
  const offerEnds = offerEndsText(founding.expiresOn);
  return (
    <section id="founding" className="section section-dark mb-founding">
      <div className="shell mb-founding-grid">
        <div data-reveal>
          <p className="eyebrow eyebrow-light">{t("Early membership")}</p>
          <h2>{founding.title}</h2>
          {founding.summary && <p className="lead mb-founding-summary">{founding.summary}</p>}
          <p className="mb-founding-example">{t("{tier} membership {standard} vs {founding} founding rate ({percent} off)", { tier: rate.tier, standard: php(rate.standard), founding: php(rate.founding), percent: percentText(rate.percent) })}</p>
        </div>
        <div className="mb-founding-side" data-reveal data-reveal-delay="short">
          {showBenefits && founding.benefits.length > 0 && <ul className="mb-founding-benefits">{founding.benefits.map((b) => <li key={b}>{b}</li>)}</ul>}
          <FoundingCounter founding={founding} showBar className="mb-founding-counter" />
          {offerEnds && <p className="mb-founding-expiry">{offerEnds}</p>}
          {full
            ? <Link href={localHref(MEMBERSHIP_PLANS_PATH)} className="button button-light mb-founding-cta">{t("See membership plans")}</Link>
            : <Link href={payHref(rate.tierId, "founding")} className="button button-light mb-founding-cta">{founding.ctaLabel}</Link>}
        </div>
      </div>
    </section>
  );
}
