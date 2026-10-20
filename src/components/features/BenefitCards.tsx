import Image from "next/image";
import Link from "next/link";

export type BenefitCard = { title: string; body: string; image: string };

/**
 * Member-benefit cards (ritebali.com "KITAS · Referral · Built in Duos · Return to Routine"): square photo with the
 * benefit name over it, then the name and a line of detail. Swipeable row on phones, four across on desktop.
 */
export default function BenefitCards({ items, eyebrow, title, cta, dark = true }: {
  items: readonly BenefitCard[];
  eyebrow?: string;
  title?: string;
  cta?: { label: string; href: string };
  dark?: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <section className={`section ft-benefits${dark ? " section-dark" : ""}`}>
      <div className="shell">
        {(eyebrow || title) && (
          <div className="nv-block-head" data-reveal>
            {eyebrow && <p className={`eyebrow${dark ? " eyebrow-light" : ""}`}>{eyebrow}</p>}
            {title && <h2>{title}</h2>}
          </div>
        )}
        <ul className="ft-benefits-row" data-reveal="stagger">
          {items.map((item) => (
            <li key={item.title} className="ft-benefit">
              <span className="ft-benefit-media">
                <Image src={item.image} alt="" fill sizes="(max-width: 760px) 78vw, 25vw" className="cover-image" />
                <span className="ft-benefit-overlay" aria-hidden="true">{item.title}</span>
              </span>
              <h3>{item.title}</h3>
              {item.body && <p>{item.body}</p>}
            </li>
          ))}
        </ul>
        {cta && <div className="ft-center-action" data-reveal><Link href={cta.href} className="button button-light ft-pill">{cta.label}</Link></div>}
      </div>
    </section>
  );
}

/** "Early rates locked in: about 30% off…" → { title: "Early rates locked in", body: "About 30% off…" }. */
export function benefitFromText(text: string, image: string): BenefitCard {
  const i = text.indexOf(":");
  if (i < 0) return { title: text, body: "", image };
  const body = text.slice(i + 1).trim();
  return { title: text.slice(0, i).trim(), body: body.charAt(0).toUpperCase() + body.slice(1), image };
}
