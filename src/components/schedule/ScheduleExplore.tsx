"use client";

import Image from "next/image";
import Link from "next/link";
import { type CSSProperties, useEffect, useRef, useState } from "react";

export type ExploreItem = { href: string; label: string; summary: string; image: string; imageAlt: string };

const CYCLE_MS = 4500;

/**
 * "More schedule" as one layout: heading and a list of links on the left, one large photo on the right that
 * follows the active link. The list cycles on its own (a Signal bar fills under the active row) and pauses while
 * the visitor hovers, focuses or taps; hovering or focusing a row makes it active. The photo cross-fades (fade in /
 * fade out). Reduced motion: no auto-cycle, instant switch. On phones each row shows its own photo.
 */
export default function ScheduleExplore({ eyebrow, title, intro, items }: { eyebrow: string; title: string; intro: string; items: ExploreItem[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycleKey, setCycleKey] = useState(0);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (paused || reduced.current || items.length < 2) return;
    const id = window.setTimeout(() => setActive((i) => (i + 1) % items.length), CYCLE_MS);
    return () => window.clearTimeout(id);
  }, [active, paused, cycleKey, items.length]);

  const pick = (i: number) => { setActive(i); setCycleKey((k) => k + 1); };

  return (
    <section className="section sd-explore" aria-labelledby="sd-explore-title">
      <div className="shell sd-explore-grid" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
        <div className="sd-explore-copy">
          <div className="sd-explore-head" data-reveal>
            <p className="sd-explore-eyebrow">{eyebrow}</p>
            <h2 id="sd-explore-title">{title}</h2>
            <p className="sd-explore-intro">{intro}</p>
          </div>
          <ul className="sd-explore-list" data-reveal="stagger">
            {items.map((item, i) => (
              <li key={item.href} className={i === active ? "is-active" : undefined} style={{ "--sd-cycle": `${CYCLE_MS}ms` } as CSSProperties}>
                <Link href={item.href} onMouseEnter={() => pick(i)} onFocus={() => pick(i)}>
                  <span className="sd-explore-inline" aria-hidden="true">
                    <Image src={item.image} alt="" fill sizes="100vw" className="cover-image" />
                  </span>
                  <span className="sd-explore-label">{item.label}</span>
                  <span className="sd-explore-summary">{item.summary}</span>
                  <span className="sd-explore-cta">Explore</span>
                </Link>
                <span className="sd-explore-bar" aria-hidden="true">
                  <span key={i === active ? `${cycleKey}-${active}` : "idle"} data-run={i === active && !paused ? "" : undefined} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* The photo opens the active link. Keyboard and screen-reader users reach the same pages through the list. */}
        <Link href={items[active]?.href ?? "#"} className="sd-explore-media" aria-hidden="true" tabIndex={-1} data-reveal data-reveal-delay="short">
          {items.map((item, i) => (
            <figure key={item.href} className={i === active ? "is-active" : undefined}>
              <Image src={item.image} alt="" fill sizes="(max-width: 900px) 100vw, 50vw" className="cover-image" />
            </figure>
          ))}
        </Link>
      </div>
    </section>
  );
}
