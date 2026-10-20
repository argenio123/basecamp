"use client";

import { useMemo, useState } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import { MODALITY_PRICE_ID } from "@/content/constants";
import { formatPhp, formatUsd } from "@/content/format";
import type { Availability, PriceItem, RecoveryModality } from "@/content/types";

type Filter = "all" | "launch" | "planned";
const FILTERS: { value: Filter; label: string }[] = [{ value: "all", label: "All" }, { value: "launch", label: "At launch" }, { value: "planned", label: "Planned" }];
// "At launch" covers anything available now or at launch; "Planned" covers phase 2 and later.
const bucket = (a: Availability): Filter => (a === "available" || a === "at-launch" ? "launch" : "planned");
const RECOVERY_AUDIENCE: Record<RecoveryModality["category"], string> = {
  cold: "Post-training recovery",
  heat: "Recovery and relaxation",
  contrast: "High-volume training weeks",
  compression: "Endurance and leg recovery",
  light: "Athletes following a recovery plan",
  oxygen: "Screened recovery clients",
  "mind-body": "All experience levels",
  sleep: "Athletes improving sleep quality",
};

/**
 * Recovery modalities with availability filter and pricing (spec §C.4.7).
 * Props are serialisable: content modalities plus the price items referenced by MODALITY_PRICE_ID.
 * Filtered cards stay in the HTML (`hidden`) so the full list is prerendered. Cards rise in turn with the
 * site-wide reveal (stage-3 §7).
 */
export default function RecoveryGrid({ modalities, priceItems, exchangeRate, disclaimerId }: { modalities: RecoveryModality[]; priceItems: PriceItem[]; exchangeRate: number; disclaimerId?: string }) {
  const [filter, setFilter] = useState<Filter>("all");
  const prices = useMemo(() => new Map(priceItems.map((p) => [p.id, p] as const)), [priceItems]);
  const counts = useMemo(() => ({ all: modalities.length, launch: modalities.filter((m) => bucket(m.availability) === "launch").length, planned: modalities.filter((m) => bucket(m.availability) === "planned").length }), [modalities]);
  const shown = filter === "all" ? counts.all : counts[filter];

  if (modalities.length === 0) return null;
  return (
    <div className="fc-recovery-grid-wrap">
      <div className="fc-filter" role="group" aria-label="Filter recovery modalities by availability" data-reveal>
        {FILTERS.map((f) => <button key={f.value} type="button" className="fc-filter-chip" aria-pressed={filter === f.value} onClick={() => setFilter(f.value)}>{f.label} <span>{counts[f.value]}</span></button>)}
      </div>
      <p className="sr-only" aria-live="polite">{`Showing ${shown} of ${counts.all} recovery modalities`}</p>
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
                <div><dt>Best for</dt><dd>{RECOVERY_AUDIENCE[m.category]}</dd></div>
                <div><dt>Member access</dt><dd>{price?.visible ? "Session add-on" : "Plan access to be confirmed"}</dd></div>
                <div><dt>Booking</dt><dd>{m.medicalNote ? "Screening and booking required" : "Reserve a recovery slot"}</dd></div>
                <div><dt>Related programs</dt><dd>Recovery &amp; Mobility</dd></div>
              </dl>
              {m.detail && <p className="fc-recovery-detail">{m.detail}</p>}
              {price && price.visible && (
                <div className="fc-recovery-price">
                  <p><strong>{formatPhp(price.price)}</strong> {price.unit}{usd && <small>{usd}</small>}</p>
                  {price.availability !== m.availability && <span className="fc-recovery-price-status"><span className="fc-recovery-price-label">Pricing:</span> <StatusBadge availability={price.availability} /></span>}
                </div>
              )}
              {m.medicalNote && (disclaimerId ? <a className="fc-recovery-medical" href={`#${disclaimerId}`}>Health screening required</a> : <p className="fc-recovery-medical">Health screening required</p>)}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
