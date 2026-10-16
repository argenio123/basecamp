"use client";

import Image, { type StaticImageData } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import SocialIcon, { type SocialPlatform } from "@/components/ui/SocialIcon";
import { lockPageScroll } from "@/lib/scrollLock";
import facilitySocialImage from "../../media/images/architecture/A1_7 - Photo.jpg";
import coachingSocialImage from "../../media/images/gallery/I3.png";
import trainingSocialImage from "../../media/images/gallery/I1.png";

type SocialPost = {
  platform: SocialPlatform;
  type: string;
  format: "Photo" | "Reel" | "Update";
  badge: string;
  title: string;
  caption: string;
  detail: string;
  image: string | StaticImageData;
  imagePosition?: string;
  href: string;
};

const socialPosts: SocialPost[] = [
  {
    platform: "Facebook",
    type: "Facility",
    format: "Update",
    badge: "Building Basecamp",
    title: "The destination",
    caption: "A new home for movement is taking shape in Camarines Sur.",
    detail: "Follow the spaces, details, and progress behind a new destination for performance, recovery, and community in Pili.",
    image: facilitySocialImage,
    imagePosition: "center",
    href: "https://www.facebook.com/basecampcamsur",
  },
  {
    platform: "Instagram",
    type: "Strength",
    format: "Photo",
    badge: "Training floor",
    title: "Built with purpose",
    caption: "Strength that carries into training, sport, and everyday life.",
    detail: "Purposeful sessions build durable strength, confidence, and the capacity to keep progressing—one considered repetition at a time.",
    image: coachingSocialImage,
    imagePosition: "center 42%",
    href: "https://www.instagram.com/basecampcamsur/",
  },
  {
    platform: "Instagram",
    type: "Recovery",
    format: "Photo",
    badge: "Coach pick",
    title: "Reset and restore",
    caption: "Make space for the work ahead.",
    detail: "Recovery belongs inside the training rhythm. Follow the practices, spaces, and guided sessions built to help the Basecamp community return ready.",
    image: "/images/programs/program-recovery.png",
    imagePosition: "center 42%",
    href: "https://www.instagram.com/basecampcamsur/",
  },
  {
    platform: "Facebook",
    type: "Coaching",
    format: "Photo",
    badge: "Community",
    title: "Progress, guided",
    caption: "Focused coaching with room to grow.",
    detail: "Meet the coaching approach behind Basecamp: clear direction, thoughtful progressions, and support shaped around the person doing the work.",
    image: "/images/programs/program-coaching.png",
    imagePosition: "center 38%",
    href: "https://www.facebook.com/basecampcamsur",
  },
  {
    platform: "X",
    type: "Training",
    format: "Update",
    badge: "In motion",
    title: "One movement at a time",
    caption: "Purpose-built sessions, shared by the community.",
    detail: "See the energy, coaching cues, and everyday work behind Basecamp training—from foundational movement to high-output sessions.",
    image: trainingSocialImage,
    imagePosition: "center 48%",
    href: "https://x.com/basecampcamsur",
  },
];

export default function SocialGallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [transitionId, setTransitionId] = useState(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

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
    setActiveIndex((activeIndex + step + socialPosts.length) % socialPosts.length);
  }, [activeIndex, isClosing]);

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
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, closeModal, moveModal]);

  const [shareLabel, setShareLabel] = useState("Share");

  const sharePost = async (post: SocialPost) => {
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

  const activePost = activeIndex === null ? null : socialPosts[activeIndex];

  return (
    <section id="socials" className="home-socials section">
      <div className="shell">
        <div className="socials-heading" data-home-reveal>
          <h2>Follow the movement.</h2>
          <div className="socials-intro">
            <p>Training, recovery, progress, and the community building Basecamp CamSur.</p>
            <a className="button button-dark socials-share-button" href="https://www.instagram.com/basecampcamsur/" target="_blank" rel="noreferrer">Follow Basecamp CamSur <span>↗</span></a>
          </div>
        </div>

        <div className="social-post-grid" data-home-reveal data-home-reveal-delay="short">
          {socialPosts.map(({ platform, type, format, badge, title, caption, image, imagePosition }, index) => (
            <button
              type="button"
              className="social-post-card"
              onClick={() => openModal(index)}
              ref={(node) => { cardRefs.current[index] = node; }}
              aria-label={`Open ${platform} ${type} post: ${caption}`}
              key={`${platform}-${type}`}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes={index === 0
                  ? "(max-width: 760px) 100vw, 58vw"
                  : "(max-width: 480px) 100vw, (max-width: 760px) 50vw, 25vw"}
                className="social-post-image"
                style={{ objectPosition: imagePosition }}
              />
              <span className="social-post-shade" aria-hidden="true" />
              {format === "Reel" && <span className="social-post-play" aria-hidden="true">▶</span>}
              <span className="social-post-overlay">
                <span className="social-post-meta">
                  <b aria-hidden="true"><SocialIcon platform={platform} /></b>
                  <span className="social-post-meta-copy"><strong>{platform}</strong><i>{type} · {format}</i></span>
                  <em>{badge}</em>
                </span>
                <span className="social-post-copy">
                  <strong className="social-post-title">{title}</strong>
                  <span className="social-post-caption">{caption}</span>
                </span>
                <span className="social-post-arrow" aria-hidden="true">↗</span>
              </span>
            </button>
          ))}
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
                alt={`${activePost.type} at Basecamp CamSur`}
                fill
                sizes="(max-width: 760px) 100vw, 70vw"
                style={{ objectPosition: activePost.imagePosition }}
              />            </div>
            <div className="social-modal-info">
              <button type="button" className="social-modal-close" onClick={closeModal} aria-label="Close social post">✕</button>
              <div className="social-modal-header">
                <span className="social-modal-profile" aria-hidden="true"><SocialIcon platform={activePost.platform} /></span>
                <a href={activePost.href} target="_blank" rel="noreferrer">@basecampcamsur</a>
              </div>
              <p className="social-modal-copy" id="social-modal-title">
                <strong>{activePost.caption}</strong> {activePost.detail}
              </p>
              <div className="social-modal-footer">
                <span aria-live="polite">{(activeIndex ?? 0) + 1} / {socialPosts.length}</span>
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
