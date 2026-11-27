import Link from "next/link";
import type { CSSProperties } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatPhp, formatUsd } from "@/content/format";
import type { PriceItem } from "@/content/types";
import Money from "@/components/membership/Money";
import { t } from "@/i18n/server";
import { payHref } from "@/lib/payments/types";
import "@/components/payments/payments.css";

/**
 * Camp packages from pricing group `camps` (spec §C.5.5), as rows in the timetable / events style:
 * length on the left, name + description + status, the price on the right, and a Request pill to /schedule/book;
 * under each row, a link to pay online (the starting price as a deposit when the price is a range).
 * The featured package sits on Ink. Server-safe.
 */
export default function CampCards({ items, exchangeRate, enquiryLabel, requestLabel }: { items: PriceItem[]; exchangeRate: number; enquiryLabel: string; requestLabel: string }) {
  if (items.length === 0) return null;
  return (
    <ul className="sd-ev-rows" data-reveal="stagger">
      {items.map((item, i) => {
        const usd = formatUsd(item, exchangeRate);
        return (
          <li key={item.id} className={`sd-ev-row vt-pk${item.featured ? " vt-pk-featured" : ""}`} style={{ "--i": i } as CSSProperties}>
            <Link href={`/schedule/book?service=camp&item=${encodeURIComponent(item.id)}`} aria-label={`${item.name}, ${formatPhp(item.price)} ${item.unit ?? ""}. ${requestLabel}`}>
              <span className="sd-ev-when"><small>{item.badge || t("Camp")}</small></span>
              <span className="sd-ev-body">
                <span className="sd-ev-title">{item.name}</span>
                {item.description && <span className="sd-ev-desc">{item.description}</span>}
                <span className="vt-pk-tags"><StatusBadge availability={item.availability} /><span className="vt-pk-note">{enquiryLabel}</span></span>
              </span>
              <span className="vt-pk-price">
                <strong><Money value={formatPhp(item.price)} /></strong>
                <small>{[item.unit, usd].filter(Boolean).join(" · ")}</small>
              </span>
              <span className="sd-ev-go" aria-hidden="true">{requestLabel}</span>
            </Link>
            {item.price && <Link href={payHref(item.id)} className="py-buy vt-pk-pay">{item.price.max != null ? t("Pay deposit online") : t("Pay online")}</Link>}
          </li>
        );
      })}
    </ul>
  );
}
