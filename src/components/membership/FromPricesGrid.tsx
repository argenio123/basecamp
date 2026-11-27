"use client";

import Link from "next/link";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import type { Availability } from "@/content/types";
import Money from "./Money";

export type FromPriceItem = {
  id: string;
  name: string;
  badge: string;
  description: string;
  featured: boolean;
  availability: Availability;
  price: string;
  unit: string;
  /** This item's checkout link, or null when it can't be paid online yet (e.g. planned). */
  href: string | null;
};

export type FromPriceCard = {
  key: string;
  anchor: string;
  /** Contact destination for categories with nothing payable. When null, the action opens the item chooser. */
  href: string | null;
  /** Category-specific action wording; never the generic "Purchase" label. */
  ctaLabel: string;
  title: string;
  /** "locals" | "travellers" | "both" (who the price is mainly for). */
  audience: "locals" | "travellers" | "both";
  audienceText: string;
  availability: Availability | null;
  price: string;
  unit: string;
  /** Medical disclaimer, when the category needs one. */
  note: string;
  items: FromPriceItem[];
};

export type FromPriceGroup = { id: string; label: string; cards: FromPriceCard[] };

const CYCLE_MS = 7000;

/**
 * Price guide in the "Events & booking" pattern: heading and a list of categories on the left (name + from price),
 * a dark price panel on the right that cross-fades to the active category's full item list. The list cycles on its
 * own (Signal bar under the active card) and pauses while the visitor hovers, focuses or taps; hovering, focusing or
 * tapping a card makes it active. A category's #anchor (e.g. #packs) opens on that category.
 */
type ChooserLabels = { choose: string; soon: string; close: string };
const DEFAULT_LABELS: ChooserLabels = { choose: "Choose what to book", soon: "Coming soon", close: "Close" };

export default function FromPricesGrid({ groups, eyebrow, title, intro, pinFirst = [], labels = DEFAULT_LABELS }: { groups: FromPriceGroup[]; eyebrow?: string; title?: string; intro?: string; /** Category anchors listed first, in this order (e.g. ["advanced-recovery"]). */ pinFirst?: readonly string[]; /** Translated wording for the item chooser. */ labels?: ChooserLabels }) {
  const all = groups.flatMap((g) => g.cards.map((c) => ({ ...c, groupLabel: g.label })));
  const rank = (anchor: string) => { const i = pinFirst.indexOf(anchor); return i < 0 ? pinFirst.length : i; };
  const cards = [...all].sort((a, b) => rank(a.anchor) - rank(b.anchor));
  const anchors = cards.map((c) => c.anchor).join("|");
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycleKey, setCycleKey] = useState(0);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Deep links (#packs, #day-passes, #open-gym …) open on their category.
    const hash = window.location.hash.slice(1);
    const i = hash ? anchors.split("|").indexOf(hash) : -1;
    if (i >= 0) {
      // Reading the URL hash is only possible in the browser; set once after mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActive(i);
      setPaused(true);
    }
  }, [anchors]);

  useEffect(() => {
    if (paused || reduced.current || cards.length < 2) return;
    const id = window.setTimeout(() => setActive((i) => (i + 1) % cards.length), CYCLE_MS);
    return () => window.clearTimeout(id);
  }, [active, paused, cycleKey, cards.length]);

  const pick = (i: number) => { setActive(i); setCycleKey((k) => k + 1); };

  // Item chooser: "Get a Book" lists every item in the category so the visitor picks the one to pay for.
  const dialog = useRef<HTMLDialogElement>(null);
  const [chooser, setChooser] = useState<number | null>(null);
  const openChooser = (i: number) => { setChooser(i); setPaused(true); dialog.current?.showModal(); };
  const chosen = chooser != null ? cards[chooser] : null;

  return (
    <div className="mb-px-grid" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="mb-px-copy">
        {(eyebrow || title || intro) && (
          <div className="mb-px-head" data-reveal>
            {eyebrow && <p className="mb-px-eyebrow">{eyebrow}</p>}
            {title && <h2>{title}</h2>}
            {intro && <p className="mb-px-intro">{intro}</p>}
          </div>
        )}
        <ul className="mb-px-list" data-reveal="stagger">
          {cards.map((c, i) => (
            <li key={c.key} id={c.anchor || undefined} className={i === active ? "is-active" : undefined} style={{ "--px-cycle": `${CYCLE_MS}ms` } as CSSProperties}>
              <button type="button" className="mb-px-row" aria-pressed={i === active} aria-controls="mb-px-panel" onMouseEnter={() => pick(i)} onFocus={() => pick(i)} onClick={() => { pick(i); setPaused(true); }}>
                <span className="mb-px-label">{c.title}</span>
                <span className="mb-px-from"><Money value={c.price} />{c.unit && <small>{c.unit}</small>}</span>
              </button>
              <span className="mb-px-bar" aria-hidden="true"><span key={i === active ? `${cycleKey}-${active}` : "idle"} data-run={i === active && !paused ? "" : undefined} /></span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-px-panel" id="mb-px-panel" aria-live="polite" data-reveal data-reveal-delay="short">
        {cards.map((c, i) => (
          <section key={c.key} className={i === active ? "is-active" : undefined} aria-hidden={i !== active} aria-labelledby={`mb-px-${c.key}`} style={{ "--item-count": c.items.length } as CSSProperties}>
            <p className="mb-px-group">{c.groupLabel}</p>
            <div className="mb-px-panel-head">
              <h3 id={`mb-px-${c.key}`}>{c.title}</h3>
              {c.availability && c.availability !== "at-launch" && <StatusBadge availability={c.availability} />}
            </div>
            <p className="mb-px-panel-from"><strong><Money value={c.price} /></strong>{c.unit && <span>{c.unit}</span>}</p>
            <ul className="mb-px-items">
              {c.items.map((item, n) => (
                <li key={item.id} data-featured={item.featured ? "" : undefined} style={{ "--n": n } as CSSProperties}>
                  <span className="mb-px-item-name">{item.name}{item.badge && <em>{item.badge}</em>}</span>
                  <span className="mb-px-dots" aria-hidden="true" />
                  <span className="mb-px-item-price"><strong><Money value={item.price} /></strong>{item.unit && <small>{item.unit}</small>}</span>
                </li>
              ))}
            </ul>
            {c.note && <p className="mb-px-note">{c.note}</p>}
            {c.href
              ? <Link href={c.href} className="mb-px-inquire" aria-label={`${c.ctaLabel} — ${c.title}`}>{c.ctaLabel} <span aria-hidden="true">→</span></Link>
              : <button type="button" className="mb-px-inquire" aria-haspopup="dialog" aria-label={`${c.ctaLabel} — ${c.title}`} tabIndex={i === active ? undefined : -1} onClick={() => openChooser(i)}>{c.ctaLabel} <span aria-hidden="true">→</span></button>}
          </section>
        ))}
      </div>

      <dialog ref={dialog} className="mb-px-chooser" aria-labelledby="mb-px-chooser-title" onClose={() => setChooser(null)}
        onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}>
        {chosen && (
          <div className="mb-px-chooser-inner">
            <div className="mb-px-chooser-head">
              <div>
                <p className="mb-px-group">{labels.choose}</p>
                <h3 id="mb-px-chooser-title">{chosen.title}</h3>
              </div>
              <button type="button" className="mb-px-chooser-close" aria-label={labels.close} onClick={() => dialog.current?.close()}>×</button>
            </div>
            <ul className="mb-px-chooser-list">
              {chosen.items.map((item) => {
                const body = (
                  <>
                    <span className="mb-px-chooser-name">
                      <strong>{item.name}{item.badge && <em>{item.badge}</em>}</strong>
                      {item.description && <small>{item.description}</small>}
                    </span>
                    <span className="mb-px-item-price"><strong><Money value={item.price} /></strong>{item.unit && <small>{item.unit}</small>}</span>
                    {item.href ? <span className="mb-px-chooser-go" aria-hidden="true">→</span> : <span className="mb-px-chooser-soon">{labels.soon}</span>}
                  </>
                );
                return (
                  <li key={item.id}>
                    {item.href
                      ? <Link href={item.href} className="mb-px-chooser-item">{body}</Link>
                      : <div className="mb-px-chooser-item" aria-disabled="true">{body}</div>}
                  </li>
                );
              })}
            </ul>
            {chosen.note && <p className="mb-px-note">{chosen.note}</p>}
          </div>
        )}
      </dialog>
    </div>
  );
}
