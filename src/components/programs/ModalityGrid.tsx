"use client";

import { useId, useState } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import type { Modality } from "@/content/types";
import { MODALITY_FILTERS } from "@/data/programs-static";

type Filter = (typeof MODALITY_FILTERS)[number]["value"];

/** First items shown under "All" before "See all" (stage-3 §6: long lists show 3–6 items + "See all"). */
const PREVIEW = 6;

/** 12-discipline grid with category chips. Non-matching cards are hidden, not removed, so all stay in the HTML. */
export default function ModalityGrid({ modalities }: { modalities: Modality[] }) {
  const listId = useId();
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState(false);
  const shown = filter === "all" ? modalities.length : modalities.filter((m) => m.category === filter).length;
  const canCollapse = filter === "all" && modalities.length > PREVIEW;
  const isHidden = (m: Modality, i: number) =>
    filter === "all" ? !expanded && i >= PREVIEW : m.category !== filter;

  return (
    <div className="pr-modalities">
      <div className="pr-chip-row" role="group" aria-label="Filter disciplines by category" data-reveal>
        {MODALITY_FILTERS.map((f) => (
          <button type="button" className="pr-chip" aria-pressed={filter === f.value} onClick={() => setFilter(f.value)} key={f.value}>{f.label}</button>
        ))}
      </div>
      <p className="pr-explorer-status" aria-live="polite">{shown} of {modalities.length} disciplines</p>
      <ul className="pr-modality-grid" id={listId} data-reveal="stagger">
        {modalities.map((m, i) => (
          <li className="pr-modality" hidden={isHidden(m, i)} key={m.id}>
            <span className="pr-index">{String(i + 1).padStart(2, "0")}</span>
            <h3>{m.title}</h3>
            <p>{m.description}</p>
            <StatusBadge availability={m.availability} />
          </li>
        ))}
      </ul>
      {canCollapse && (
        <button type="button" className="text-link light pr-see-all" aria-expanded={expanded} aria-controls={listId} onClick={() => setExpanded((v) => !v)}>
          {expanded ? "Show fewer" : `See all ${modalities.length} disciplines`} <span aria-hidden="true">{expanded ? "↑" : "↓"}</span>
        </button>
      )}
    </div>
  );
}
