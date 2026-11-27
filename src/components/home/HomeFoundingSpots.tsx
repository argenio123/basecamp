import Link from "next/link";
import FoundingCounter from "@/components/ui/FoundingCounter";
import { MEMBERSHIP_PLANS_PATH } from "@/content/constants";
import { formatDateLabel } from "@/content/format";
import type { FoundingOffer } from "@/content/types";
import { getFoundingAvailability } from "@/lib/payments/founding";

const FOUNDING_PATH = "/membership/founding";

/**
 * Home: the founding offer with the live spots counter (styled like the former early-access band, home.css .hm-early).
 * Shown while the offer and its public counter are on. Once the cap is reached it stops selling and points to the
 * standard plans. Static: only cached data is awaited.
 */
export default async function HomeFoundingSpots({ founding, titleClassName }: { founding: FoundingOffer; titleClassName?: string }) {
  if (!founding.enabled || !founding.showCounter) return null;
  const full = (await getFoundingAvailability(founding)).state === "full";
  const expires = founding.expiresOn ? formatDateLabel(founding.expiresOn) : "";
  return (
    <section id="founding-spots" className="section hm-section hm-early" aria-labelledby="hm-founding-spots-title" data-home-reveal>
      <div className="shell hm-early-grid">
        <div className="hm-early-copy" data-home-reveal>
          <p className="eyebrow eyebrow-light">Limited founding spots</p>
          <h2 id="hm-founding-spots-title" className={titleClassName}>{founding.title || "Founding members"}</h2>
          {founding.summary && !full && <p className="hm-early-body">{founding.summary}</p>}
        </div>
        <div className="hm-early-founding" data-home-reveal data-home-reveal-delay="short">
          <FoundingCounter founding={founding} showBar />
          {!full && expires && expires !== "To be announced" && <p className="hm-early-expires">Founding rates end {expires}</p>}
          <div className="section-link">
            {full
              ? <Link href={MEMBERSHIP_PLANS_PATH} className="button button-light">See membership plans</Link>
              : <Link href={FOUNDING_PATH} className="button button-light">{founding.ctaLabel || "Become an early member"}</Link>}
          </div>
        </div>
      </div>
    </section>
  );
}
