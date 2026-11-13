"use client";

import Image from "next/image";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";

export type ShowcaseSlide = {
  /** Small label above the title (e.g. the floor or group: "Zones", "Recovery"). */
  eyebrow: string;
  title: string;
  body?: string;
  /** Short bullet points under the line (e.g. equipment). */
  points?: string[];
  image: string;
  imageAlt: string;
  /** Deep-link hash that opens this slide (e.g. "equipment"). */
  anchor?: string;
};

/** Keeps hyphenated words ("CrossFit-style") on one line so a title never breaks after the hyphen. */
function keepHyphens(title: string) {
  return title.split(" ").map((word, i) => (
    <Fragment key={i}>{i > 0 && " "}{word.includes("-") ? <span className="fc-nowrap">{word}</span> : word}</Fragment>
  ));
}

/**
 * Full-bleed room showcase: one interior render per slide filling the frame, copy overlaid bottom-left,
 * a vertical dot rail on the right and previous/next arrows. Slides cross-fade with a slow zoom and the copy
 * rises in. Rooms change only when the visitor clicks an arrow or a dot (or uses the arrow keys); there is no
 * auto-advance. Deep links (#equipment …) open their slide.
 */
export default function FacilityShowcase({ slides, label }: { slides: ShowcaseSlide[]; label: string }) {
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const count = slides.length;
  const anchors = slides.map((s) => s.anchor ?? "").join("|");

  const go = useCallback((i: number) => setActive(((i % count) + count) % count), [count]);

  useEffect(() => {
    const openFromHash = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      const i = hash ? anchors.split("|").indexOf(hash) : -1;
      if (i < 0) return;
      setActive(i);
      requestAnimationFrame(() => rootRef.current?.scrollIntoView({ block: "start" }));
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [anchors]);

  const step = (i: number) => go(i);

  return (
    <section
      ref={rootRef}
      className="fc-show"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); step(active + 1); }
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); step(active - 1); }
      }}
    >
      {slides.map((s, i) => (
        <div
          key={`${s.eyebrow}-${s.title}`}
          id={s.anchor}
          className={`fc-show-slide${i === active ? " is-active" : ""}`}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${count}: ${s.title}`}
          aria-hidden={i !== active}
          inert={i !== active}
        >
          <Image src={s.image} alt={s.imageAlt} fill sizes="100vw" className="fc-show-image" priority={i === 0} />
          <div className="fc-show-shade" aria-hidden="true" />
          {/* Room name and its short description over the photo. */}
          <div className="fc-show-copy">
            <h3>{keepHyphens(s.title)}</h3>
            {s.body && <p className="fc-show-body">{s.body}</p>}
          </div>
        </div>
      ))}

      {count > 1 && (
        <>
          <nav className="fc-show-rail" aria-label={`${label}: choose a room`}>
            {slides.map((s, i) => (
              <button key={`${s.eyebrow}-${s.title}`} type="button" className="fc-show-dot" aria-label={s.title} aria-current={i === active ? "true" : undefined} onClick={() => step(i)}>
                <span className="fc-show-dot-label" aria-hidden="true">{s.title}</span>
              </button>
            ))}
          </nav>
          <div className="fc-show-arrows">
            <button type="button" className="fc-show-arrow" aria-label="Previous room" onClick={() => step(active - 1)}><span aria-hidden="true">‹</span></button>
            <button type="button" className="fc-show-arrow" aria-label="Next room" onClick={() => step(active + 1)}><span aria-hidden="true">›</span></button>
          </div>
          <p className="fc-show-count" aria-hidden="true"><strong>{String(active + 1).padStart(2, "0")}</strong> / {String(count).padStart(2, "0")}</p>
        </>
      )}
    </section>
  );
}
