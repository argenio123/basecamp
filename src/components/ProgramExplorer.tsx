"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { programGoals, programs, scheduleReleased, toAnchor, type Program, type ProgramGoal } from "@/data/site";
import { lockPageScroll } from "@/lib/scrollLock";

function IntensityMeter({ value }: { value: number | null }) {
  if (value === null) return <span className="program-fact-value">Tailored to you</span>;

  return (
    <span className="program-intensity" aria-label={`Intensity ${value} of 5`}>
      {[1, 2, 3, 4, 5].map((step) => <i key={step} className={step <= value ? "is-on" : undefined} aria-hidden="true" />)}
    </span>
  );
}

function ProgramFacts({ program }: { program: Program }) {
  return (
    <dl className="program-facts">
      <div><dt>Intensity</dt><dd><IntensityMeter value={program.intensity} /></dd></div>
      <div><dt>Level</dt><dd>{program.level}</dd></div>
      <div><dt>Session</dt><dd>{program.duration} min</dd></div>
      <div><dt>Format</dt><dd>{program.format}</dd></div>
    </dl>
  );
}

function ProgramActions({ program }: { program: Program }) {
  return (
    <div className="program-actions">
      <Link className="button button-dark" href={`/contact?program=${program.slug}`}>Register interest <span>↗</span></Link>
      {scheduleReleased
        ? <Link className="button program-button-outline" href={`/schedule?program=${program.slug}`}>View schedule</Link>
        : <Link className="button program-button-outline is-pending" href="/schedule">Schedule releasing soon</Link>}
    </div>
  );
}

export default function ProgramExplorer() {
  const [goal, setGoal] = useState<ProgramGoal | null>(null);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const matchCount = goal ? programs.filter((program) => program.goals.includes(goal)).length : programs.length;
  const activeGoalLabel = programGoals.find((item) => item.id === goal)?.label;
  const openProgram = programs.find((program) => program.slug === openSlug) ?? null;

  const closePanel = useCallback(() => {
    if (!openSlug || isClosing) return;
    const returnSlug = openSlug;

    setIsClosing(true);
    closeTimer.current = setTimeout(() => {
      setOpenSlug(null);
      setIsClosing(false);
      triggerRefs.current[returnSlug]?.focus();
    }, 320);
  }, [openSlug, isClosing]);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    if (!openSlug) return;
    const unlockScroll = lockPageScroll();
    requestAnimationFrame(() => panelRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      unlockScroll();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [openSlug, closePanel]);

  return (
    <div className="program-explorer">
      <div className="program-goals">
        <p className="eyebrow">What&apos;s your goal?</p>
        <div className="program-goal-chips" role="group" aria-label="Filter programs by goal">
          <button type="button" className="program-goal-chip" aria-pressed={goal === null} onClick={() => setGoal(null)}>All programs</button>
          {programGoals.map((item) => (
            <button
              type="button"
              className="program-goal-chip"
              aria-pressed={goal === item.id}
              onClick={() => setGoal(goal === item.id ? null : item.id)}
              key={item.id}
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="program-goal-status" aria-live="polite">
          {goal ? `${matchCount} of ${programs.length} programs match “${activeGoalLabel}”` : `${programs.length} programs`}
        </p>
      </div>

      <div className="program-card-grid">
        {programs.map((program, index) => {
          const isMatch = !goal || program.goals.includes(goal);

          return (
            <article className={`program-card${isMatch ? "" : " is-dimmed"}${goal && isMatch ? " is-match" : ""}`} key={program.slug}>
              <div className="program-card-media">
                <Image
                  src={program.image}
                  alt=""
                  fill
                  sizes={index === 0 ? "(max-width: 900px) 100vw, 90vw" : "(max-width: 900px) 100vw, 45vw"}
                  className="cover-image"
                />
                <span className="program-card-number">{program.number}</span>
                {goal && isMatch && <span className="program-card-match">Matches your goal</span>}
              </div>
              <div className="program-card-body">
                <p className="eyebrow">{program.badge}</p>
                <h2>{program.title}</h2>
                <p className="program-card-description">{program.description}</p>
                <ProgramFacts program={program} />
                <div className="program-card-footer">
                  <button
                    type="button"
                    className="program-card-explore"
                    onClick={() => { setIsClosing(false); setOpenSlug(program.slug); }}
                    ref={(node) => { triggerRefs.current[program.slug] = node; }}
                    aria-haspopup="dialog"
                  >
                    Explore program <span aria-hidden="true">→</span>
                  </button>
                  <Link className="text-link" href={`/contact?program=${program.slug}`}>Register interest <span>↗</span></Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {openProgram && createPortal(
        <div
          className={`program-panel-backdrop${isClosing ? " is-closing" : ""}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closePanel();
          }}
        >
          <div className="program-panel" role="dialog" aria-modal="true" aria-labelledby="program-panel-title" tabIndex={-1} ref={panelRef}>
            <div className="program-panel-media">
              <Image src={openProgram.image} alt="" fill sizes="(max-width: 760px) 100vw, 640px" className="cover-image" />
              <button type="button" className="program-panel-close" onClick={closePanel} aria-label="Close program details">✕</button>
              <div className="program-panel-heading">
                <p className="eyebrow eyebrow-light">{openProgram.number} · {openProgram.badge}</p>
                <h2 id="program-panel-title">{openProgram.title}</h2>
              </div>
            </div>

            <div className="program-panel-body">
              <ProgramFacts program={openProgram} />

              <section>
                <h3>What it is</h3>
                <p>{openProgram.about}</p>
              </section>

              <section>
                <h3>Who it&apos;s for</h3>
                <ul className="program-who">
                  {openProgram.whoFor.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>

              <section>
                <h3>What a session looks like <span>{openProgram.duration} min</span></h3>
                <ol className="program-timeline">
                  {openProgram.timeline.map((step) => (
                    <li key={step.label} style={{ flexGrow: step.minutes }}>
                      <span className="program-timeline-bar" aria-hidden="true" />
                      <strong>{step.minutes}′</strong>
                      <span>{step.label}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <section>
                <h3>What you&apos;ll notice</h3>
                <ol className="program-outcomes">
                  {openProgram.outcomes.map((outcome) => (
                    <li key={outcome.weeks}><strong>{outcome.weeks} weeks</strong><span>{outcome.text}</span></li>
                  ))}
                </ol>
                <p className="program-outcomes-note">Typical progress with consistent training. Everyone&apos;s timeline is different.</p>
              </section>

              <section>
                <h3>Spaces you&apos;ll use</h3>
                <div className="program-spaces">
                  {openProgram.spaces.map((space) => (
                    <Link key={space} href={`/facilities#${toAnchor(space)}`}>{space} <span aria-hidden="true">↗</span></Link>
                  ))}
                </div>
              </section>
            </div>

            <div className="program-panel-footer">
              <ProgramActions program={openProgram} />
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
