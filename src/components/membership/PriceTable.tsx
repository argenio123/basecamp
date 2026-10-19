import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatPhp, formatUsd } from "@/content/format";
import type { PriceItem } from "@/content/types";
import { isMedicalBlock, type PriceBlockData } from "./pricing";

// Shared price renderers (no hooks, no directive): used by the client AudienceTabs and by the server pages.
// Prices are shown verbatim from content (spec §B.7); the USD string uses the item's own figure when set (§B.6).

/** Monthly memberships as tier cards. The featured card carries the --olive-dark border and its badge. */
export function TierCards({ items, exchangeRate }: { items: PriceItem[]; exchangeRate: number }) {
  return (
    <ul className="mb-tiers" data-reveal="stagger">
      {items.map((item) => {
        const usd = formatUsd(item, exchangeRate);
        return (
          <li key={item.id} className="mb-tier" data-featured={item.featured ? "" : undefined}>
            <div className="mb-tier-tags">
              {item.badge && <span className="mb-pill mb-pill-strong">{item.badge}</span>}
              {item.availability !== "at-launch" && <StatusBadge availability={item.availability} />}
            </div>
            <h3 className="mb-tier-name">{item.name}</h3>
            <p className="mb-tier-price"><strong>{formatPhp(item.price)}</strong>{item.unit && <span>{item.unit}</span>}</p>
            {usd && <p className="mb-tier-usd">{usd}</p>}
            {(item.perUnit || item.validity) && <p className="mb-meta">{[item.perUnit, item.validity].filter(Boolean).join(" · ")}</p>}
            {item.description && <p className="mb-tier-desc">{item.description}</p>}
            {item.features.length > 0 && <ul className="mb-checks">{item.features.map((f) => <li key={f}>{f}</li>)}</ul>}
            <Link href="/contact?interest=membership-local" className={`button ${item.featured ? "button-dark" : "mb-button-outline"} mb-tier-cta`}>Register interest <span>↗</span></Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Every other group: responsive definition-list rows (stacked cards on mobile). */
export function PriceList({ items, exchangeRate }: { items: PriceItem[]; exchangeRate: number }) {
  return (
    <dl className="mb-list" data-reveal="stagger">
      {items.map((item) => {
        const usd = formatUsd(item, exchangeRate);
        return (
          <div key={item.id} className="mb-row" data-featured={item.featured ? "" : undefined}>
            <dt className="mb-row-name">
              <span className="mb-row-title">{item.name}</span>
              {(item.badge || item.availability !== "at-launch") && (
                <span className="mb-row-tags">
                  {item.badge && <span className="mb-pill">{item.badge}</span>}
                  {item.availability !== "at-launch" && <StatusBadge availability={item.availability} />}
                </span>
              )}
            </dt>
            <dd className="mb-row-price"><strong>{formatPhp(item.price)}</strong>{item.unit && <span>{item.unit}</span>}</dd>
            {usd && <dd className="mb-row-usd">{usd}</dd>}
            {(item.perUnit || item.validity) && (
              <dd className="mb-row-meta">
                {item.perUnit && <span>{item.perUnit}</span>}
                {item.validity && <span>{item.validity}</span>}
              </dd>
            )}
            {item.description && <dd className="mb-row-desc">{item.description}</dd>}
            {item.features.length > 0 && <dd className="mb-row-features"><ul className="mb-checks">{item.features.map((f) => <li key={f}>{f}</li>)}</ul></dd>}
          </div>
        );
      })}
    </dl>
  );
}

type PriceBlockProps = {
  block: PriceBlockData;
  exchangeRate: number;
  /** recovery.disclaimer, shown under blocks with hyperbaric, cryotherapy or NAD+ (spec §0.11). */
  disclaimer: string;
  hidden?: boolean;
  /** Group ids hidden by an audience filter. */
  hiddenGroups?: readonly string[];
};

/** One anchored price block (`<section id={anchor}>`); groups that share the anchor render inside it with sub-headings. */
export function PriceBlock({ block, exchangeRate, disclaimer, hidden, hiddenGroups = [] }: PriceBlockProps) {
  return (
    <section id={block.anchor || undefined} className="mb-block" hidden={hidden}>
      {block.groups.map((group) => (
        <div key={group.id} className="mb-group" hidden={hiddenGroups.includes(group.id)}>
          <div className="mb-group-head" data-reveal>
            <h3>{group.title}</h3>
            {group.intro && <p>{group.intro}</p>}
          </div>
          {group.id === "memberships"
            ? <TierCards items={group.items} exchangeRate={exchangeRate} />
            : <PriceList items={group.items} exchangeRate={exchangeRate} />}
        </div>
      ))}
      {isMedicalBlock(block) && disclaimer && <p className="mb-disclaimer" data-reveal>{disclaimer}</p>}
    </section>
  );
}

/** pricing.notes in small text (spec §C.6.5). */
export function PricingNotes({ notes }: { notes: readonly string[] }) {
  if (!notes.length) return null;
  return <ul className="mb-notes" aria-label="Pricing notes" data-reveal>{notes.map((n) => <li key={n}>{n}</li>)}</ul>;
}
