import Link from "next/link";
import { MEMBERSHIP_PLANS_PATH } from "@/content/constants";
import { getFoundingAvailability } from "@/lib/payments/founding";
import { foundingItemId } from "@/lib/payments/founding-link";
import { payHref } from "@/lib/payments/types";
import { benefitFromText } from "@/components/features/BenefitCards";
import GainList, { type Gain } from "@/components/programs/GainList";
import FoundingCounter from "@/components/ui/FoundingCounter";
import { getSiteContent } from "@/content/get";
import type { FoundingOffer } from "@/content/types";
import { getData } from "@/i18n/data";
import { localHref, t } from "@/i18n/server";
import { offerEndsText, percentText } from "./localize";
import Money from "./Money";
import { foundingSaving } from "./pricing";

const peso = (n: number) => n.toLocaleString("en-US");

/**
 * Founding members as one full-width membership card, styled like the featured tier card (Athlete): Ink panel,
 * Signal chip, display-face name, Signal price with a rule, a "+" checklist of benefits and a full-width Signal
 * button. Renders nothing while the offer is disabled. Section id stays #founding for existing links.
 * The founding price comes from the offer's example line; the standard price and the saving (pesos and an honestly
 * rounded percent) come from the pricing content, the same figures checkout uses (src/lib/payments/founding.ts).
 */
export default async function FoundingPass({ founding, exchangeRate }: { founding: FoundingOffer; exchangeRate: number }) {
  if (!founding.enabled) return null;
  const { pricing } = await getSiteContent();
  const rate = foundingSaving(founding.example, pricing.groups);
  // Cap reached: the button stops selling the founding rate (checkout refuses it too, src/lib/payments/founding.ts).
  const full = (await getFoundingAvailability(founding)).state === "full";
  const offerEnds = offerEndsText(founding.expiresOn);
  const { MEMBERSHIP_GAINS } = getData("membership-gains");
  // "What you gain" rows for this page, falling back to the founding benefits from content.
  const gains: Gain[] = MEMBERSHIP_GAINS["/membership/founding"]?.length
    ? [...MEMBERSHIP_GAINS["/membership/founding"]]
    : founding.benefits.map((text) => { const b = benefitFromText(text, ""); return { title: b.title, detail: b.body || undefined }; });

  return (
    <section id="founding" className="section mb-fp" aria-labelledby="mb-fp-title">
      <div className="shell">
        <article className="mb-fp-card" data-reveal>
          <div className="mb-fp-main">
            <div className="mb-fp-tags">
              <span className="mb-label mb-label-signal">{t("Early membership · Limited")}</span>
              <span className="mb-label mb-label-ghost">{t("Proposed rate")}</span>
            </div>
            <h2 id="mb-fp-title" className="mb-fp-name">{founding.title}</h2>
            {rate ? (
              <>
                <p className="mb-fp-price"><strong><Money value={`Php ${peso(rate.founding)}`} /></strong><span>{t("/month")}</span></p>
                <p className="mb-fp-meta">
                  {rate.tier && <span>{t("{tier} tier", { tier: rate.tier })}</span>}
                  <span>{t("Standard Php {amount}", { amount: peso(rate.standard) })}</span>
                  <span className="mb-fp-save">{t("Save Php {amount}/month", { amount: peso(rate.saving) })}{rate.percent && ` (${percentText(rate.percent)})`}</span>
                  {exchangeRate > 0 && <span>≈ US${Math.round(rate.founding / exchangeRate)}</span>}
                </p>
              </>
            ) : founding.example && <p className="mb-fp-meta"><span>{founding.example}</span></p>}
            {founding.summary && <p className="mb-fp-desc">{founding.summary}</p>}
          </div>

          <div className="mb-fp-side">
            {gains.length > 0 && (
              <div className="mb-fp-gains">
                <p className="mb-fp-gains-label">{t("What you gain")}</p>
                <GainList gains={gains} />
              </div>
            )}
            <div className="mb-fp-actions">
              {full
                ? <Link href={localHref(MEMBERSHIP_PLANS_PATH)} className="button mb-button-signal mb-fp-cta">{t("See membership plans")}</Link>
                : <Link href={foundingItemId(founding.example) ? payHref(foundingItemId(founding.example), "founding") : localHref(MEMBERSHIP_PLANS_PATH)} className="button mb-button-signal mb-fp-cta">{founding.ctaLabel || t("Become an early member")}</Link>}
              <FoundingCounter founding={founding} showBar className="mb-fp-counter" />
              {offerEnds && <p className="mb-fp-expiry">{offerEnds}</p>}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
