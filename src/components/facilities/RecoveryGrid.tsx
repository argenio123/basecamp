"use client";

import { useMemo, useState } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import { MODALITY_PRICE_ID } from "@/content/constants";
import { formatPhp, formatUsd } from "@/content/format";
import type { Availability, PriceItem, RecoveryModality } from "@/content/types";
import { useLocale } from "@/i18n/client";
import { FACILITIES_UI } from "@/i18n/ui-sections/facilities";
import { fmt } from "@/i18n/ui";

type Filter = "all" | "launch" | "planned";
const FILTERS: readonly Filter[] = ["all", "launch", "planned"];
// "At launch" covers anything available now or at launch; "Planned" covers phase 2 and later.
const bucket = (a: Availability): Filter => (a === "available" || a === "at-launch" ? "launch" : "planned");
// Labels, audiences ("Best for") and card facts per locale: src/i18n/ui-sections/facilities.ts.

/**
 * Recovery modalities with availability filter and pricing (spec §C.4.7).
 * Props are serialisable: content modalities plus the price items referenced by MODALITY_PRICE_ID.
 * Filtered cards stay in the HTML (`hidden`) so the full list is prerendered. Cards rise in turn with the
 * site-wide reveal (stage-3 §7).
 */
export default function RecoveryGrid({ modalities, priceItems, exchangeRate, disclaimerId }: { modalities: RecoveryModality[]; priceItems: PriceItem[]; exchangeRate: number; disclaimerId?: string }) {
  const ui = FACILITIES_UI[useLocale()].recovery;
  const [filter, setFilter] = useState<Filter>("all");
  const prices = useMemo(() => new Map(priceItems.map((p) => [p.id, p] as const)), [priceItems]);
  const counts = useMemo(() => ({ all: modalities.length, launch: modalities.filter((m) => bucket(m.availability) === "launch").length, planned: modalities.filter((m) => bucket(m.availability) === "planned").length }), [modalities]);
  const shown = filter === "all" ? counts.all : counts[filter];

  if (modalities.length === 0) return null;
  return (
    <div className="fc-recovery-grid-wrap">
      <div className="fc-filter" role="group" aria-label={ui.filterLabel} data-reveal>
        {FILTERS.map((f) => <button key={f} type="button" className="fc-filter-chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>{ui.filters[f]} <span>{counts[f]}</span></button>)}
      </div>
      <p className="sr-only" aria-live="polite">{fmt(ui.showing, { shown, total: counts.all })}</p>
      <ul className="fc-recovery-grid" data-reveal="stagger">
        {modalities.map((m) => {
          const price = prices.get(MODALITY_PRICE_ID[m.id] ?? "");
          const usd = price ? formatUsd(price, exchangeRate) : "";
          return (
            <li key={m.id} className="fc-recovery-card" data-category={m.category} hidden={filter !== "all" && bucket(m.availability) !== filter}>
              <StatusBadge availability={m.availability} />
              <h3>{m.title}</h3>
              <p>{m.description}</p>
              <dl className="fc-card-facts">
                <div><dt>{ui.facts.bestFor}</dt><dd>{ui.audience[m.category]}</dd></div>
                <div><dt>{ui.facts.access}</dt><dd>{price?.visible ? ui.sessionAddOn : ui.accessTbc}</dd></div>
                <div><dt>{ui.facts.booking}</dt><dd>{m.medicalNote ? ui.screeningBooking : ui.reserveSlot}</dd></div>
                <div><dt>{ui.facts.programs}</dt><dd>{ui.programs}</dd></div>
              </dl>
              {m.detail && <p className="fc-recovery-detail">{m.detail}</p>}
              {price && price.visible && (
                <div className="fc-recovery-price">
                  <p><strong>{formatPhp(price.price)}</strong> {price.unit}{usd && <small>{usd}</small>}</p>
                  {price.availability !== m.availability && <span className="fc-recovery-price-status"><span className="fc-recovery-price-label">{ui.pricing}</span> <StatusBadge availability={price.availability} /></span>}
                </div>
              )}
              {m.medicalNote && (disclaimerId ? <a className="fc-recovery-medical" href={`#${disclaimerId}`}>{ui.screening}</a> : <p className="fc-recovery-medical">{ui.screening}</p>)}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
