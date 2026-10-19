import StatusBadge from "@/components/ui/StatusBadge";
import type { Availability } from "@/content/types";

type Item = { title: string; body?: string; availability?: Availability };

/**
 * Bordered item list used across the /facilities pages. Server-safe. `note` is printed beside each badge (e.g. "Enquiry only").
 * Items rise in turn with the site-wide reveal (`data-reveal="stagger"`, stage-3 §7); pass `reveal={false}` inside an already-revealed block.
 */
export default function ItemList({ items, cols = 4, numbered = false, note, className, reveal = true }: { items: Item[]; cols?: 2 | 3 | 4 | 5; numbered?: boolean; note?: string; className?: string; reveal?: boolean }) {
  return (
    <ul className={`fc-items fc-items-${cols}${className ? ` ${className}` : ""}`} data-reveal={reveal ? "stagger" : undefined}>
      {items.map((item, i) => (
        <li key={item.title}>
          {numbered && <span className="fc-index">{String(i + 1).padStart(2, "0")}</span>}
          <h3>{item.title}</h3>
          {item.body && <p>{item.body}</p>}
          {(item.availability || note) && <div className="fc-badges">{item.availability && <StatusBadge availability={item.availability} />}{note && <span className="fc-note">{note}</span>}</div>}
        </li>
      ))}
    </ul>
  );
}
