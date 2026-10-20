import Link from "next/link";
import FoundingCounter from "@/components/ui/FoundingCounter";
import { formatDateLabel } from "@/content/format";
import type { FoundingOffer } from "@/content/types";

/** /membership#founding (spec §C.6.2). Renders nothing while the offer is disabled. */
/** `showBenefits={false}` when the page shows the benefits as cards (<BenefitCards>) instead. */
export default function FoundingBand({ founding, showBenefits = true }: { founding: FoundingOffer; showBenefits?: boolean }) {
  if (!founding.enabled) return null;
  const expires = founding.expiresOn ? formatDateLabel(founding.expiresOn) : "";
  return (
    <section id="founding" className="section section-dark mb-founding">
      <div className="shell mb-founding-grid">
        <div data-reveal>
          <p className="eyebrow eyebrow-light">Early membership</p>
          <h2>{founding.title}</h2>
          {founding.summary && <p className="lead mb-founding-summary">{founding.summary}</p>}
          {founding.example && <p className="mb-founding-example">{founding.example}</p>}
        </div>
        <div className="mb-founding-side" data-reveal data-reveal-delay="short">
          {showBenefits && founding.benefits.length > 0 && <ul className="mb-founding-benefits">{founding.benefits.map((b) => <li key={b}>{b}</li>)}</ul>}
          <FoundingCounter founding={founding} showBar className="mb-founding-counter" />
          {expires && expires !== "To be announced" && <p className="mb-founding-expiry">Offer ends {expires}</p>}
          <Link href="/contact?interest=membership-local" className="button button-light mb-founding-cta">{founding.ctaLabel} <span>↗</span></Link>
        </div>
      </div>
    </section>
  );
}
