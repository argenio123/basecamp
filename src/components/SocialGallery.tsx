"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import SocialIcon from "@/components/ui/SocialIcon";
import type { GalleryPost, SocialLink, SocialPlatform } from "@/content/types";
import { trapFocus } from "@/lib/focusTrap";
import { lockPageScroll } from "@/lib/scrollLock";

type SocialGalleryProps = {
  /** Kept for callers; the rail layout shows the title only. */
  eyebrow?: string;
  title: string;
  intro?: string;
  posts: GalleryPost[];
  /** Kept for callers; the rail layout has no Follow button. */
  followHref?: string;
  /** Handle shown in the modal header. */
  handle?: string;
  /** Profile links; Facebook, Instagram and X (with a url) show as round icons under the title. */
  socials?: SocialLink[];
  /** Extra class for the section title (e.g. the homepage display font). */
  titleClassName?: string;
};

const PROFILE_ORDER: SocialPlatform[] = ["Facebook", "Instagram", "X"];

const MIN_LOOP_CARDS = 8;
const SECONDS_PER_CARD = 5;
/** px a pointer must travel before a press becomes a drag (below it, it is a click). */
const DRAG_THRESHOLD = 6;
/** px/s cap on the release fling. */
const MAX_FLING = 3000;

const PILLAR_LABEL: Record<GalleryPost["pillar"], string> = {
  training: "Training",
  nature: "Nature",
  community: "Community",
  build: "Build",
  coaches: "Coaches",
  recovery: "Recovery",
};

export default function SocialGallery({ title, posts, handle = "@basecampcamsur", socials = [], titleClassName }: SocialGalleryProps) {
  const profiles = PROFILE_ORDER.flatMap((platform) => socials.filter((s) => s.platform === platform && s.url));
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [transitionId, setTransitionId] = useState(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Enough cards per loop to cover a wide screen, so the seamless second copy never shows a gap.
  const loopPosts = Array.from({ length: Math.max(1, Math.ceil(MIN_LOOP_CARDS / Math.max(posts.length, 1))) }, () => posts).flat();
  const loopCards = loopPosts.length;

  // Rail motion lives in a ref (updated every frame) rather than state, so dragging never re-renders.
  const beltRef = useRef<HTMLDivElement | null>(null);
  const groupRef = useRef<HTMLDivElement | null>(null);
  const motion = useRef({ offset: 0, fling: 0, hover: false, focus: false, modal: false });
  const drag = useRef<{ pointerId: number; startX: number; startOffset: number; lastX: number; lastTime: number; velocity: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  useEffect(() => {
    motion.current.modal = activeIndex !== null;
  }, [activeIndex]);

  // Auto-scroll + fling inertia. The belt holds two identical groups, so wrapping the offset by one group width is seamless.
  useEffect(() => {
    const belt = beltRef.current;
    const group = groupRef.current;
    if (!belt || !group) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let last = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      const width = group.offsetWidth;
      const m = motion.current;
      if (!drag.current && width > 0) {
        const paused = m.hover || m.focus || m.modal || reducedMotion.matches;
        const autoSpeed = paused ? 0 : width / (loopCards * SECONDS_PER_CARD);
        m.offset += (autoSpeed + m.fling) * dt;
        m.fling *= Math.pow(0.05, dt); // fling fades out over ~1s
        if (Math.abs(m.fling) < 2) m.fling = 0;
      }
      if (width > 0) m.offset = ((m.offset % width) + width) % width;
      belt.style.transform = `translate3d(${-m.offset}px, 0, 0)`;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [loopCards]);

  // Swipe / drag: horizontal moves drag the belt (touch-action: pan-y keeps vertical page scroll); release flings it.
  const onRailPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    suppressClick.current = false;
    drag.current = { pointerId: event.pointerId, startX: event.clientX, startOffset: motion.current.offset, lastX: event.clientX, lastTime: event.timeStamp, velocity: 0, moved: false };
    motion.current.fling = 0;
  };

  const onRailPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.pointerId !== event.pointerId) return;
    const dx = event.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > DRAG_THRESHOLD) {
      d.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (!d.moved) return;
    const elapsed = event.timeStamp - d.lastTime;
    if (elapsed > 0) d.velocity = ((event.clientX - d.lastX) / elapsed) * 1000;
    d.lastX = event.clientX;
    d.lastTime = event.timeStamp;
    motion.current.offset = d.startOffset - dx;
  };

  const endRailDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.pointerId !== event.pointerId) return;
    drag.current = null;
    if (!d.moved) return;
    suppressClick.current = true;
    // A stale velocity (finger held still before release) should not fling.
    const isFresh = event.timeStamp - d.lastTime < 80;
    motion.current.fling = isFresh ? Math.max(-MAX_FLING, Math.min(MAX_FLING, -d.velocity)) : 0;
  };

  const openModal = (index: number) => {
    setDirection("forward");
    setTransitionId(0);
    setIsClosing(false);
    setActiveIndex(index);
  };

  const closeModal = useCallback(() => {
    if (activeIndex === null || isClosing) return;
    const returnIndex = activeIndex;

    setIsClosing(true);
    closeTimer.current = setTimeout(() => {
      setActiveIndex(null);
      setIsClosing(false);
      cardRefs.current[returnIndex]?.focus();
    }, 340);
  }, [activeIndex, isClosing]);

  const moveModal = useCallback((step: -1 | 1) => {
    if (activeIndex === null || isClosing) return;
    setDirection(step > 0 ? "forward" : "backward");
    setTransitionId((value) => value + 1);
    setActiveIndex((activeIndex + step + posts.length) % posts.length);
  }, [activeIndex, isClosing, posts.length]);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;
    const unlockScroll = lockPageScroll();
    requestAnimationFrame(() => dialogRef.current?.focus());

    return unlockScroll;
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
      if (event.key === "ArrowLeft") moveModal(-1);
      if (event.key === "ArrowRight") moveModal(1);
      trapFocus(event, dialogRef.current);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, closeModal, moveModal]);

  const [shareLabel, setShareLabel] = useState("Share");

  const sharePost = async (post: GalleryPost) => {
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, text: post.caption, url: post.href });
        return;
      }
      await navigator.clipboard.writeText(post.href);
      setShareLabel("Link copied");
      setTimeout(() => setShareLabel("Share"), 1800);
    } catch {
      // Share sheet dismissed or clipboard unavailable
    }
  };

  const activePost = activeIndex === null ? null : posts[activeIndex] ?? null;

  if (posts.length === 0) return null;

  return (
    <section id="socials" className="home-socials section hm-section social-rail-section" data-home-reveal>
      <div className="shell">
        <h2 className={`social-rail-title${titleClassName ? ` ${titleClassName}` : ""}`} data-home-reveal>{title}</h2>
        {profiles.length > 0 && (
          <ul className="social-rail-profiles" data-home-reveal data-home-reveal-delay="short">
            {profiles.map(({ platform, url, handle: profileHandle }) => (
              <li key={platform}>
                <a href={url} target="_blank" rel="noreferrer" className="social-rail-profile" aria-label={`BaseCamp CamSur on ${platform === "X" ? "X (Twitter)" : platform}${profileHandle ? ` (${profileHandle})` : ""}`}>
                  <SocialIcon platform={platform} />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Full-bleed, endlessly looping row of square posts (Fitness First "Follow us on social" format).
          It drifts on its own and can be swiped or dragged; hover, keyboard focus or an open post pauses it. */}
      <div className="social-rail" data-home-reveal data-home-reveal-delay="short">
        <div
          className="social-rail-track"
          onPointerDown={onRailPointerDown}
          onPointerMove={onRailPointerMove}
          onPointerUp={endRailDrag}
          onPointerCancel={endRailDrag}
          onPointerEnter={(event) => { if (event.pointerType === "mouse") motion.current.hover = true; }}
          onPointerLeave={(event) => { if (event.pointerType === "mouse") motion.current.hover = false; }}
          onFocus={() => { motion.current.focus = true; }}
          onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) motion.current.focus = false; }}
          onClickCapture={(event) => {
            // The click that ends a drag must not open a post.
            if (!suppressClick.current) return;
            suppressClick.current = false;
            event.preventDefault();
            event.stopPropagation();
          }}
          onDragStart={(event) => event.preventDefault()}
        >
          <div className="social-rail-belt" ref={beltRef}>
            {[0, 1].map((copy) => (
              <div className="social-rail-group" aria-hidden={copy === 1 ? true : undefined} ref={copy === 0 ? groupRef : undefined} key={copy}>
                {loopPosts.map(({ id, platform, type, pillar, title: postTitle, caption, image, imagePosition }, loopIndex) => {
                  const index = loopIndex % posts.length;
                  // Only the first set of the first copy is reachable by keyboard and screen readers.
                  const isPrimary = copy === 0 && loopIndex < posts.length;
                  return (
                    <button
                      type="button"
                      className="social-rail-card"
                      onClick={() => openModal(index)}
                      ref={isPrimary ? (node) => { cardRefs.current[index] = node; } : undefined}
                      aria-label={isPrimary ? `Open ${platform} ${type} post: ${caption}` : undefined}
                      aria-hidden={isPrimary ? undefined : true}
                      tabIndex={isPrimary ? undefined : -1}
                      key={`${copy}-${loopIndex}-${id}`}
                    >
                      <Image src={image} alt="" fill sizes="(max-width: 760px) 80vw, 340px" className="social-rail-image" draggable={false} style={{ objectPosition: imagePosition }} />
                      <span className="social-rail-overlay" aria-hidden="true">
                        <span className="social-rail-icon"><SocialIcon platform={platform} /></span>
                        <span className="social-rail-copy">
                          <span className="social-rail-pillar">{PILLAR_LABEL[pillar] ?? pillar}</span>
                          <strong>{postTitle}</strong>
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {activePost && createPortal(
        <div
          className={`social-modal${isClosing ? " is-closing" : ""}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <button type="button" className="social-modal-arrow social-modal-arrow--previous" onClick={() => moveModal(-1)} aria-label="Previous social post">←</button>
          <div
            className={`social-modal-card ${transitionId === 0 ? "is-opening" : `is-${direction}`}`}
            key={`${activeIndex}-${transitionId}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="social-modal-title"
            tabIndex={-1}
            ref={dialogRef}
            onTouchStart={(event) => {
              const touch = event.changedTouches[0];
              touchStart.current = { x: touch.clientX, y: touch.clientY };
            }}
            onTouchEnd={(event) => {
              const start = touchStart.current;
              const touch = event.changedTouches[0];
              touchStart.current = null;
              if (!start) return;

              const deltaX = touch.clientX - start.x;
              const deltaY = touch.clientY - start.y;
              if (Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY)) {
                moveModal(deltaX < 0 ? 1 : -1);
              }
            }}
          >
            <div className="social-modal-media">
              <Image
                src={activePost.image}
                alt={`${activePost.type} at BaseCamp CamSur`}
                fill
                sizes="(max-width: 760px) 100vw, 70vw"
                style={{ objectPosition: activePost.imagePosition }}
              />
            </div>
            <div className="social-modal-info">
              <button type="button" className="social-modal-close" onClick={closeModal} aria-label="Close social post">✕</button>
              <div className="social-modal-header">
                <span className="social-modal-profile" aria-hidden="true"><SocialIcon platform={activePost.platform} /></span>
                <a href={activePost.href} target="_blank" rel="noreferrer">{handle}</a>
              </div>
              <p className="social-modal-copy" id="social-modal-title">
                <strong>{activePost.caption}</strong> {activePost.detail}
              </p>
              <div className="social-modal-footer">
                <span aria-live="polite">{(activeIndex ?? 0) + 1} / {posts.length}</span>
                <button type="button" onClick={() => sharePost(activePost)}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4l8 7-8 7v-4.2c-5.6 0-9.3 1.7-12 5.7 1-5.7 4.3-11.2 12-12.3V4z" /></svg>
                  {shareLabel}
                </button>
                <a href={activePost.href} target="_blank" rel="noreferrer">
                  <SocialIcon platform={activePost.platform} />
                  {activePost.platform}
                </a>
              </div>
            </div>
          </div>
          <button type="button" className="social-modal-arrow social-modal-arrow--next" onClick={() => moveModal(1)} aria-label="Next social post">→</button>
        </div>,
        document.body,
      )}
    </section>
  );
}
