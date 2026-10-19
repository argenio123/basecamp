import Link from "next/link";
import type { ReactNode } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import type { PriceGroup } from "@/content/types";
import { audienceLabel, blockAvailability, blockItems, fromPrice, groupHref, toBlocks } from "./pricing";

type FromPricesProps = {
  /** Every group except the tiers; each row links to the page that now holds its full prices. */
  groups: readonly PriceGroup[];
  id?: string;
  eyebrow?: string;
  title?: string;
  /** ≤2 sentences. */
  intro?: string;
  /** Rendered under the list (e.g. pricing notes). */
  children?: ReactNode;
};

/** /membership overview: one "from" price per price block (stage-3 §1), linking to its sub-page. */
export default function FromPrices({ groups, id, eyebrow, title, intro, children }: FromPricesProps) {
  const rows = toBlocks(groups).flatMap((block) => {
    const price = fromPrice(blockItems(block));
    return price ? [{ block, price, href: groupHref(block.groups[0]), availability: blockAvailability(block) }] : [];
  });
  if (!rows.length) return null;

  return (
    <section id={id} className="section mb-from-section" aria-labelledby={id ? `${id}-title` : undefined}>
      <div className="shell mb-from-grid">
        <div className="mb-from-head" data-reveal>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {title && <h2 id={id ? `${id}-title` : undefined}>{title}</h2>}
          {intro && <p className="nv-block-intro">{intro}</p>}
        </div>
        <ul className="mb-from" data-reveal="stagger">
          {rows.map(({ block, price, href, availability }) => (
            <li key={block.key}>
              <Link href={href} className="mb-from-row">
                <span className="mb-from-name">
                  <span className="mb-from-title">{block.groups[0].title}</span>
                  <span className="mb-from-tags">
                    <span className="mb-from-audience">{audienceLabel(block)}</span>
                    {availability && availability !== "at-launch" && <StatusBadge availability={availability} />}
                  </span>
                </span>
                <span className="mb-from-price"><strong>{price.label}</strong>{price.unit && <span>{price.unit}</span>}</span>
                <span className="mb-from-arrow" aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {children && <div className="shell">{children}</div>}
    </section>
  );
}
