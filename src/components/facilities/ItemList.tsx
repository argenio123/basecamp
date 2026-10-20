import StatusBadge from "@/components/ui/StatusBadge";
import FacilityCardFacts from "@/components/facilities/FacilityCardFacts";
import type { FacilityItem } from "@/data/facilities";

/**
 * Bordered item list used across the /facilities pages. Server-safe. `note` is printed beside each badge (e.g. "Enquiry only").
 * Items rise in turn with the site-wide reveal (`data-reveal="stagger"`, stage-3 §7); pass `reveal={false}` inside an already-revealed block.
 */
export default function ItemList({ items, cols = 4, numbered = false, note, className, reveal = true }: { items: FacilityItem[]; cols?: 2 | 3 | 4 | 5; numbered?: boolean; note?: string; className?: string; reveal?: boolean }) {
  return (
    <ul className={`fc-items fc-items-${cols}${className ? ` ${className}` : ""}`} data-reveal={reveal ? "stagger" : undefined}>
      {items.map((item, i) => (
        <li className={item.details ? "fc-facility-card" : undefined} key={item.title}>
          {numbered && <span className="fc-index">{String(i + 1).padStart(2, "0")}</span>}
          <h3>{item.title}</h3>
          {item.body && <p>{item.body}</p>}
          {item.details && <FacilityCardFacts details={item.details} />}
          {(item.availability || note) && <div className="fc-badges">{item.availability && <StatusBadge availability={item.availability} />}{note && <span className="fc-note">{note}</span>}</div>}
        </li>
      ))}
    </ul>
  );
}
