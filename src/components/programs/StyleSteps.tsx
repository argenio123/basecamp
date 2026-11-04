"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type StyleStep = { title: string; body: string; image: string };

/**
 * "How a session runs" on class pages: the steps scroll naturally on the right while the photo stays (sticky) on
 * the left. The active step is the one whose centre is closest to the middle of the window, re-measured on every
 * scroll frame, so it advances and reverses smoothly in both directions without skipping. Hover also activates a
 * step. On phones each step shows its own photo inline instead.
 */
export default function StyleSteps({ steps, className }: { steps: StyleStep[]; className: string }) {
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      items.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - mid);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      setActive((current) => (current === best ? current : best));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="pr-steps">
      <div className="pr-steps-media" aria-hidden="true" data-reveal>
        {steps.map((step, i) => (
          <figure key={step.title} className={i === active ? "is-active" : undefined}>
            <Image src={step.image} alt="" fill sizes="(max-width: 900px) 100vw, 55vw" className="cover-image" />
            <figcaption>Illustrative session view · {className} · {step.title}</figcaption>
          </figure>
        ))}
      </div>
      <ol className="pr-steps-list" data-reveal data-reveal-delay="short">
        {steps.map((step, i) => (
          <li key={step.title} ref={(el) => { items.current[i] = el; }} className={i === active ? "is-active" : undefined} onMouseEnter={() => setActive(i)}>
            <div className="pr-steps-inline">
              <Image src={step.image} alt="" fill sizes="100vw" className="cover-image" />
            </div>
            <span className="pr-steps-mark" aria-hidden="true" />
            <div>
              <p className="pr-steps-num">{String(i + 1).padStart(2, "0")}</p>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
