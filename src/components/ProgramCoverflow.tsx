"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import type { Availability } from "@/content/types";

type Program = {
  title: string;
  description: string;
  image: string;
  /** The active card's title links here (programme pages: /programs/[slug]). */
  href?: string;
  /** Shown as the availability label on the card (spec §0.7). */
  availability?: Availability;
};

type ProgramCoverflowProps = {
  programs: Program[];
};

const swipeThreshold = 56;
/** Above this many cards, mobile shows the "03 / 13" count instead of the dots (the dots would overflow at 390px). */
const maxDots = 7;

export default function ProgramCoverflow({ programs }: ProgramCoverflowProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<number | null>(null);
  const dragDelta = useRef(0);
  const didDrag = useRef(false);
  const pointerDownIndex = useRef<number | null>(null);
  const needsFreshHoverMovement = useRef(false);

  const hideDescriptionDuringNavigation = () => {
    setHoveredIndex(null);
    needsFreshHoverMovement.current = true;
  };

  const moveTo = (index: number) => {
    hideDescriptionDuringNavigation();
    setActiveIndex((index + programs.length) % programs.length);
  };

  const movePrevious = () => {
    hideDescriptionDuringNavigation();
    setActiveIndex((current) => (current - 1 + programs.length) % programs.length);
  };

  const moveNext = () => {
    hideDescriptionDuringNavigation();
    setActiveIndex((current) => (current + 1) % programs.length);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    // Let the active card's title link receive its own click (pointer capture would retarget it).
    if ((event.target as HTMLElement).closest(".hm-coverflow-link")) return;
    hideDescriptionDuringNavigation();
    const card = (event.target as HTMLElement).closest<HTMLElement>(
      ".program-coverflow-card",
    );

    pointerDownIndex.current = card ? Number(card.dataset.index) : null;
    dragStart.current = event.clientX;
    dragDelta.current = 0;
    didDrag.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) {
      if (event.pointerType === "mouse" && needsFreshHoverMovement.current) {
        needsFreshHoverMovement.current = false;
        const card = (event.target as HTMLElement).closest<HTMLElement>(
          ".program-coverflow-card.is-active",
        );

        if (card) setHoveredIndex(Number(card.dataset.index));
      }

      return;
    }

    const nextOffset = event.clientX - dragStart.current;
    dragDelta.current = nextOffset;

    if (!didDrag.current && Math.abs(nextOffset) > 6) {
      didDrag.current = true;
      setIsDragging(true);
    }

    if (didDrag.current) setDragOffset(nextOffset);
  };

  const finishPointerGesture = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return;

    const selectedIndex = pointerDownIndex.current;
    const wasDrag = didDrag.current;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (dragDelta.current <= -swipeThreshold) moveNext();
    if (dragDelta.current >= swipeThreshold) movePrevious();
    if (!wasDrag && selectedIndex !== null) moveTo(selectedIndex);

    pointerDownIndex.current = null;
    dragStart.current = null;
    dragDelta.current = 0;
    setDragOffset(0);
    setIsDragging(false);
  };

  const cancelPointerGesture = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragStart.current = null;
    dragDelta.current = 0;
    didDrag.current = false;
    pointerDownIndex.current = null;
    setDragOffset(0);
    setIsDragging(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      movePrevious();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveNext();
    }
  };

  if (programs.length === 0) return null;

  return (
    <div
      className={`program-coverflow${programs.length > maxDots ? " hm-coverflow-many" : ""}`}
      aria-label="Training programs"
      aria-roledescription="carousel"
      data-home-reveal
      data-home-reveal-delay="short"
      onKeyDown={handleKeyDown}
    >
      <div
        className={`program-coverflow-stage${isDragging ? " is-dragging" : ""}`}
        style={{ "--drag-offset": `${dragOffset}px` } as CSSProperties}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointerGesture}
        onPointerCancel={cancelPointerGesture}
      >
        {programs.map((program, index) => {
          let offset = index - activeIndex;
          const halfwayPoint = programs.length / 2;

          if (offset > halfwayPoint) offset -= programs.length;
          if (offset < -halfwayPoint) offset += programs.length;

          const isActive = offset === 0;
          const isDescriptionVisible = isActive && hoveredIndex === index;

          return (
            <div
              className={`program-coverflow-card${isActive ? " is-active" : ""}${isDescriptionVisible ? " is-description-visible" : ""}`}
              data-offset={offset}
              data-index={index}
              key={program.title}
              onPointerEnter={(event) => {
                if (
                  event.pointerType === "mouse" &&
                  isActive &&
                  !needsFreshHoverMovement.current
                ) {
                  setHoveredIndex(index);
                }
              }}
              onPointerLeave={() => {
                if (hoveredIndex === index) setHoveredIndex(null);
              }}
            >
              <button
                type="button"
                className="hm-coverflow-hit"
                aria-label={`${program.title}. ${program.description}`}
                aria-current={isActive ? "true" : undefined}
                tabIndex={isActive ? 0 : -1}
                onClick={(event) => {
                  if (didDrag.current) {
                    didDrag.current = false;
                    return;
                  }

                  if (event.detail > 0) return;
                  moveTo(index);
                }}
              />
              <span className="program-coverflow-media" aria-hidden="true">
                <Image
                  src={program.image}
                  alt=""
                  fill
                  sizes="(max-width: 760px) 88vw, min(76vw, 1020px)"
                  className="program-coverflow-image"
                  draggable={false}
                />
                <span className="program-coverflow-scrim" />
              </span>
              <span className="program-coverflow-copy">
                <span className="program-coverflow-kicker">
                  {String(index + 1).padStart(2, "0")} / {String(programs.length).padStart(2, "0")}
                </span>
                {program.availability && <StatusBadge availability={program.availability} className="hm-coverflow-badge" />}
                {isActive && program.href
                  ? <Link href={program.href} className="program-coverflow-title hm-coverflow-link" draggable={false}>{program.title}</Link>
                  : <span className="program-coverflow-title" aria-hidden="true">{program.title}</span>}
                <span className="program-coverflow-description" aria-hidden="true">{program.description}</span>
              </span>
            </div>
          );
        })}
      </div>

      <div className="program-coverflow-controls shell">
        <button type="button" className="program-coverflow-arrow" onClick={movePrevious} aria-label="Previous program">
          <span aria-hidden="true">←</span>
        </button>
        <p className="program-coverflow-count" aria-hidden="true">
          {String(activeIndex + 1).padStart(2, "0")} / {String(programs.length).padStart(2, "0")}
        </p>
        <div className="program-coverflow-dots hm-coverflow-dots" aria-label="Choose a program">
          {programs.map((program, index) => (
            <button
              type="button"
              className={index === activeIndex ? "is-active" : ""}
              aria-label={`Show ${program.title}`}
              aria-current={index === activeIndex ? "true" : undefined}
              key={program.title}
              onClick={() => moveTo(index)}
            />
          ))}
        </div>
        <button type="button" className="program-coverflow-arrow" onClick={moveNext} aria-label="Next program">
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {programs[activeIndex].title}: {programs[activeIndex].description}
      </p>
    </div>
  );
}
