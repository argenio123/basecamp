import StatusBadge from "@/components/ui/StatusBadge";
import type { VisitItem } from "@/data/visit";

/**
 * Bordered item list for the Visit pages (stage-2 ItemList, restyled under vt-). Server-safe.
 * The list staggers in with the site-wide reveal. `note` is printed beside each badge (e.g. "Enquiry only").
 */
export default function VisitItems({ items, cols = 4, numbered = false, note, label }: { items: readonly VisitItem[]; cols?: 3 | 4 | 5; numbered?: boolean; note?: string; label?: string }) {
  if (items.length === 0) return null;
  return (
    <ul className={`vt-items${cols === 4 ? "" : ` vt-items-${cols}`}`} aria-label={label} data-reveal="stagger">
      {items.map((item, i) => (
        <li key={item.title}>
          {numbered && <span className="vt-index">{String(i + 1).padStart(2, "0")}</span>}
          <h3>{item.title}</h3>
          {item.body && <p>{item.body}</p>}
          {(item.availability || note) && <div className="vt-badges">{item.availability && <StatusBadge availability={item.availability} />}{note && <span className="vt-note">{note}</span>}</div>}
        </li>
      ))}
    </ul>
  );
}
