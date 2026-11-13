"use client";

import Image from "next/image";
import { useEffect, useId, useState, type CSSProperties } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import type { Availability } from "@/content/types";

export type FacilityTabCard = {
  title: string;
  body?: string;
  availability?: Availability;
  image?: string;
  imageAlt?: string;
  /** Short labels shown as pills instead of a body line (e.g. equipment). */
  pills?: string[];
};

export type FacilityTabPanel = {
  /** Also the deep-link hash (e.g. "equipment" → /facilities/training#equipment opens that tab). */
  id: string;
  label: string;
  cards: FacilityTabCard[];
};

/**
 * One section, several topics: a tab bar over a single card grid. Every panel uses the same card, so the
 * whole training floor reads as one layout. Cards slide in like drawers when the tab changes.
 */
export default function FacilityTabs({ panels, label = "Spaces" }: { panels: FacilityTabPanel[]; /** Accessible name of the tab bar. */ label?: string }) {
  const baseId = useId();
  const [active, setActive] = useState(panels[0]?.id);
  const [switched, setSwitched] = useState(false);

  // Deep links (#equipment, #social-lounge …) open their tab and scroll the tabs into view.
  useEffect(() => {
    const openFromHash = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (!panels.some((p) => p.id === hash)) return;
      setActive(hash);
      requestAnimationFrame(() => document.getElementById(`${baseId}-tabs`)?.scrollIntoView({ block: "start" }));
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [panels, baseId]);

  const select = (id: string) => {
    setActive(id);
    setSwitched(true);
  };

  return (
    <div className="fc-tabs" data-reveal>
      <div id={`${baseId}-tabs`} className="fc-tabs-bar" role="tablist" aria-label={label} hidden={panels.length < 2}>
        {panels.map((p, n) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            id={`${baseId}-tab-${p.id}`}
            aria-selected={active === p.id}
            aria-controls={p.id}
            tabIndex={active === p.id ? 0 : -1}
            className="fc-tab"
            onClick={() => select(p.id)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              const next = panels[(n + (e.key === "ArrowRight" ? 1 : panels.length - 1)) % panels.length];
              select(next.id);
              document.getElementById(`${baseId}-tab-${next.id}`)?.focus();
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* All panels share one grid cell, so the section keeps the tallest panel's height and never jumps
          when the tab changes; inactive panels are invisible and inert. */}
      <div className="fc-tabs-panels">
      {panels.map((p) => (
        <div key={p.id} id={p.id} role="tabpanel" aria-labelledby={`${baseId}-tab-${p.id}`} aria-hidden={active !== p.id} inert={active !== p.id} data-active={active === p.id} className="fc-tabs-panel">
          <ul className={`fc-tabgrid fc-tabgrid--${p.cards.length}${p.cards.some((c) => c.image) && p.cards.some((c) => !c.image) ? " fc-tabgrid--media" : ""}${switched ? " fc-tabgrid--animate" : ""}`} key={`${p.id}-${active === p.id}`}>
            {p.cards.map((c, i) => (
              <li key={c.title} className={`fc-card${c.image ? " fc-card--media" : ""}`} style={{ "--i": i } as CSSProperties}>
                {c.image && <div className="image-frame fc-card-media"><Image src={c.image} alt={c.imageAlt ?? ""} fill sizes="(max-width: 760px) 100vw, (max-width: 1040px) 50vw, 33vw" className="cover-image" /></div>}
                <div className="fc-card-body">
                  {c.availability && <StatusBadge availability={c.availability} />}
                  <h3>{c.title}</h3>
                  {c.body && <p>{c.body}</p>}
                  {c.pills && <ul className="fc-pills" aria-label={`${c.title} equipment`}>{c.pills.map((pill) => <li key={pill}>{pill}</li>)}</ul>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
      </div>
    </div>
  );
}
