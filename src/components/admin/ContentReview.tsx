"use client";

import { foundingTerms, FOUNDING_MIN_SHARE } from "@/content/founding";
import type { ReviewItem } from "@/content/review";
import type { PriceGroup } from "@/content/types";
import { savingLabel } from "@/components/membership/pricing";

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const peso = (n: number) => `Php ${n.toLocaleString("en-US")}`;

/**
 * "Content review" for one section (src/content/review.ts): stored values that differ from the current defaults for the
 * founding offer, its tier, the day passes and the pricing FAQ, plus anything that switches the offer off on the site.
 * Nothing is overwritten: staff re-save the section (or reset it) once they have checked.
 */
export function ContentReviewNotice({ items }: { items: readonly ReviewItem[] }) {
  if (!items.length) return null;
  const warnings = items.filter((i) => i.level === "warning").length;
  return (
    <div className="adm-alert adm-review" role={warnings ? "alert" : "note"}>
      <p><strong>Content review</strong>: {items.length === 1 ? "1 item" : `${items.length} items`} to check after the latest site update.</p>
      <p className="adm-help">
        These saved values differ from the site&apos;s current defaults (or affect the live offer). Your edits are kept and were not changed.
        If a value should follow the new default, update it here and save, or use “Reset to defaults”.
      </p>
      <ul className="adm-error-list">
        {items.map((item, i) => (
          <li key={i}>
            <strong>{item.level === "warning" ? "Action needed: " : ""}{item.label}</strong>
            {item.stored !== undefined && <> · saved: <q>{item.stored}</q></>}
            {item.current !== undefined && <> · current default: <q>{item.current}</q></>}
            {item.note && <span className="adm-review-note"> {item.note}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Live preview next to the founding fields in the editor: the tier, its standard price and the saving that checkout
 * would apply ("30% off Php 4,500"), or why the numbers would be refused on save (same rule as validate.ts).
 */
export function FoundingPreview({ draft, groups }: { draft: unknown; groups: readonly PriceGroup[] }) {
  const founding = isRecord(draft) && isRecord(draft.founding) ? draft.founding : null;
  if (!founding) return null;
  const tierId = typeof founding.tierId === "string" ? founding.tierId.trim() : "";
  const price = typeof founding.price === "number" ? founding.price : NaN;
  const terms = foundingTerms({ tierId, price }, groups);
  const enabled = founding.enabled === true;
  return (
    <div className="adm-alert adm-founding-preview" role="status" aria-live="polite">
      {terms.ok ? (
        <p>
          <strong>Checkout charges {peso(terms.founding)} a month</strong> for {terms.tier}: {savingLabel(terms.standard, terms.founding)} off {peso(terms.standard)} standard
          {" "}(saving {peso(terms.standard - terms.founding)} a month).{enabled ? "" : " The offer is switched off, so nothing is sold at this rate."}
        </p>
      ) : (
        <p>
          <strong>{enabled ? "This offer can't be saved as it is:" : "These numbers would not work once the offer is switched on:"}</strong> {terms.reason}
        </p>
      )}
      <p className="adm-help">The founding price must be at least {Math.round(FOUNDING_MIN_SHARE * 100)}% of the tier&apos;s standard price and lower than it. Standard prices come from Pricing › Memberships.</p>
    </div>
  );
}
