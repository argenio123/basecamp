"use client";

// Category chips + grouped class cards for /classes. Every card is in the server HTML; filtering only toggles
// `hidden`, so the page still works without JS. Each card is its own data-reveal (sports-style entrance in
// programs.css, replayed in reverse when scrolling up); re-keying a group's grid remounts its cards so
// SiteReveal's MutationObserver replays the entrance after a filter change.
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type ClassCard = {
  slug: string;
  title: string;
  image: string;
  imageAlt: string;
  focus: string;
  session: readonly string[];
};

export type ClassGroup = { id: string; title: string; description: string; items: ClassCard[] };

export default function ClassFilterGrid({ groups }: { groups: ClassGroup[] }) {
  const [active, setActive] = useState("all");
  const [round, setRound] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const total = groups.reduce((sum, group) => sum + group.items.length, 0);

  // Scroll back to the top of the list after the filtered layout has rendered (measuring before would aim at
  // the old, taller layout and leave the group heading under the sticky chips).
  useEffect(() => {
    const list = listRef.current;
    if (round === 0 || !list) return;
    if (list.getBoundingClientRect().top < parseFloat(getComputedStyle(list).scrollMarginTop)) list.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [round]);

  const choose = (id: string) => {
    if (id === active) return;
    setActive(id);
    setRound((n) => n + 1);
  };

  const chips = [{ id: "all", title: "All", count: total }, ...groups.map((g) => ({ id: g.id, title: g.title, count: g.items.length }))];

  return (
    <>
      <div className="pr-class-filter" role="toolbar" aria-label="Filter classes by category">
        {chips.map((chip) => (
          <button key={chip.id} type="button" aria-pressed={active === chip.id} onClick={() => choose(chip.id)}>
            {chip.title}<span>{chip.count}</span>
          </button>
        ))}
      </div>
      <div className="pr-workout-groups" ref={listRef}>
        {groups.map((group, groupIndex) => (
          <div className="pr-workout-group" key={group.id} hidden={active !== "all" && active !== group.id} aria-labelledby={`pr-workout-group-${group.id}`}>
            <div className="pr-workout-group-head" data-reveal>
              <p>{String(groupIndex + 1).padStart(2, "0")}</p>
              <div><h3 id={`pr-workout-group-${group.id}`}>{group.title}</h3><span>{group.description}</span></div>
            </div>
            <ol className="pr-workout-card-grid" key={round}>
              {group.items.map((item) => (
                <li key={item.slug} data-reveal>
                  <Link href={`/classes/styles/${item.slug}`}>
                    {/* Full-photo card: focus label + title laid over the photo. */}
                    <div className="pr-workout-card-image">
                      <Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 760px) 100vw, 50vw" className="cover-image" />
                    </div>
                    <div className="pr-workout-card-copy">
                      <ol className="pr-workout-card-flow" aria-label="Session flow">
                        {item.session.map((step, i) => <li key={step} style={{ transitionDelay: `${i * 45}ms` }}>{step}</li>)}
                      </ol>
                      <span className="pr-workout-chip">{item.focus}</span>
                      <h3>{item.title}</h3>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </>
  );
}
