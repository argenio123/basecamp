"use client";

import { useId, useState } from "react";

export type Gain = { title: string; detail?: string };

/**
 * "What you gain" on class pages: each row opens to a short detail. The plus turns into a cross and the panel
 * grows smoothly (grid-template-rows 0fr → 1fr), then reverses on close. Several rows can be open at once.
 */
export default function GainList({ gains }: { gains: Gain[] }) {
  const [open, setOpen] = useState<number[]>([]);
  const base = useId();
  const toggle = (i: number) => setOpen((o) => (o.includes(i) ? o.filter((n) => n !== i) : [...o, i]));

  return (
    <ul className="pr-dev-outcomes" data-reveal="stagger">
      {gains.map((g, i) => {
        const isOpen = open.includes(i);
        const panel = `${base}-gain-${i}`;
        return (
          <li key={g.title} className={isOpen ? "is-open" : undefined}>
            {g.detail ? (
              <>
                <button type="button" aria-expanded={isOpen} aria-controls={panel} onClick={() => toggle(i)}>
                  <span className="pr-dev-gain-icon" aria-hidden="true" />
                  <span>{g.title}</span>
                </button>
                <div className="pr-dev-gain-panel" id={panel} role="region" aria-label={g.title}>
                  <div><p>{g.detail}</p></div>
                </div>
              </>
            ) : (
              <span className="pr-dev-gain-static"><span className="pr-dev-gain-icon" aria-hidden="true" /><span>{g.title}</span></span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
