import Link from "next/link";
import { benefitFromText } from "@/components/features/BenefitCards";
import GainList, { type Gain } from "@/components/programs/GainList";
import FoundingCounter from "@/components/ui/FoundingCounter";
import { formatDateLabel } from "@/content/format";
import type { FoundingOffer } from "@/content/types";
import { MEMBERSHIP_GAINS } from "@/data/membership-gains";
import Money from "./Money";

const peso = (n: number) => n.toLocaleString("en-US");

/** "Example: Athlete founding rate Php 3,200/month (standard Php 4,500)." → tier, founding and standard rates. */
function parseExample(example: string) {
  const amounts = [...example.matchAll(/(?:₱|Php)\s?([\d,]+)/g)].map((m) => Number(m[1].replace(/,/g, "")));
  if (amounts.length < 2 || !amounts[0] || !amounts[1] || amounts[0] >= amounts[1]) return null;
  const tier = example.match(/^Example:\s*([A-Za-z]+)/)?.[1] ?? "";
  return { tier, founding: amounts[0], standard: amounts[1] };
}

/**
 * Founding members as one full-width membership card, styled like the featured tier card (Athlete): Ink panel,
 * Signal chip, display-face name, Signal price with a rule, a "+" checklist of benefits and a full-width Signal
 * button. Renders nothing while the offer is disabled. Section id stays #founding for existing links.
 */
export default function FoundingPass({ founding, exchangeRate }: { founding: FoundingOffer; exchangeRate: number }) {
  if (!founding.enabled) return null;
  const rate = parseExample(founding.example);
  const expires = founding.expiresOn ? formatDateLabel(founding.expiresOn) : "";
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
              <span className="mb-label mb-label-signal">Early membership · Limited</span>
              <span className="mb-label mb-label-ghost">Proposed rate</span>
            </div>
            <h2 id="mb-fp-title" className="mb-fp-name">{founding.title}</h2>
            {rate ? (
              <>
                <p className="mb-fp-price"><strong><Money value={`Php ${peso(rate.founding)}`} /></strong><span>/month</span></p>
                <p className="mb-fp-meta">
                  {rate.tier && <span>{rate.tier} tier</span>}
                  <span>Standard Php {peso(rate.standard)}</span>
                  <span className="mb-fp-save">Save Php {peso(rate.standard - rate.founding)}/month</span>
                  {exchangeRate > 0 && <span>≈ US${Math.round(rate.founding / exchangeRate)}</span>}
                </p>
              </>
            ) : founding.example && <p className="mb-fp-meta"><span>{founding.example}</span></p>}
            {founding.summary && <p className="mb-fp-desc">{founding.summary}</p>}
          </div>

          <div className="mb-fp-side">
            {gains.length > 0 && (
              <div className="mb-fp-gains">
                <p className="mb-fp-gains-label">What you gain</p>
                <GainList gains={gains} />
              </div>
            )}
            <div className="mb-fp-actions">
              <Link href="/contact?interest=membership-local" className="button mb-button-signal mb-fp-cta">{founding.ctaLabel || "Become an early member"}</Link>
              <FoundingCounter founding={founding} showBar className="mb-fp-counter" />
              {expires && expires !== "To be announced" && <p className="mb-fp-expiry">Offer ends {expires}</p>}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
