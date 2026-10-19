import Link from "next/link";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatPhp, formatUsd } from "@/content/format";
import type { PriceItem } from "@/content/types";

/** Camp price cards from pricing group `camps` (spec §C.5.5). Server-safe. Each card requests a booking on /schedule/book. */
export default function CampCards({ items, exchangeRate, enquiryLabel, requestLabel }: { items: PriceItem[]; exchangeRate: number; enquiryLabel: string; requestLabel: string }) {
  if (items.length === 0) return null;
  return (
    <ul className="vt-camps" data-reveal="stagger">
      {items.map((item) => {
        const usd = formatUsd(item, exchangeRate);
        return (
          <li key={item.id} className={item.featured ? "vt-camp-featured" : undefined}>
            <div className="vt-badges"><StatusBadge availability={item.availability} /><span className="vt-note">{enquiryLabel}</span>{item.badge && <span className="vt-note">{item.badge}</span>}</div>
            <h3>{item.name}</h3>
            <p className="vt-camp-price"><strong>{formatPhp(item.price)}</strong>{item.unit && <span>{item.unit}</span>}</p>
            {usd && <p className="vt-camp-usd">{usd}</p>}
            {item.description && <p className="vt-camp-desc">{item.description}</p>}
            <Link href={`/schedule/book?service=camp&item=${encodeURIComponent(item.id)}`} className="button button-dark">{requestLabel} <span>↗</span></Link>
          </li>
        );
      })}
    </ul>
  );
}
