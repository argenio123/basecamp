"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export type GalleryPhoto = { src: string; alt: string; label: string; title: string; description: string };

/**
 * "See the class" on class pages: a large photo plus two stacked. Clicking a photo opens a viewer with the image,
 * a label, title and short description; ← / → (or the arrows) move between photos, Esc / × / backdrop closes.
 */
export default function ClassGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => { setOpen(null); opener.current?.focus(); }, []);
  const move = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + photos.length) % photos.length)), [photos.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    dialog.current?.focus();
    return () => { document.removeEventListener("keydown", onKey); document.documentElement.style.overflow = ""; };
  }, [open, close, move]);

  const photo = open === null ? null : photos[open];

  return (
    <>
      <div className="pr-dev-gallery-grid">
        {photos.map((p, i) => (
          <figure key={p.src} className={i === 0 ? "pr-dev-gallery-main" : undefined}>
            <button type="button" className="pr-dev-gallery-open" aria-label={`Open photo: ${p.title}`} onClick={(e) => { opener.current = e.currentTarget; setOpen(i); }}>
              <Image src={p.src} alt={p.alt} fill sizes={i === 0 ? "(max-width: 900px) 100vw, 62vw" : "(max-width: 900px) 50vw, 36vw"} className="cover-image" />
              <span className="pr-dev-gallery-hint" aria-hidden="true">{p.label} · View</span>
            </button>
          </figure>
        ))}
      </div>

      {photo && (
        <div className="pr-viewer" role="dialog" aria-modal="true" aria-label={photo.title} ref={dialog} tabIndex={-1} onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div className="pr-viewer-panel">
            <div className="pr-viewer-media">
              <Image key={photo.src} src={photo.src} alt={photo.alt} fill sizes="(max-width: 900px) 100vw, 66vw" className="pr-viewer-img" />
            </div>
            <div className="pr-viewer-copy">
              <h3>{photo.title}</h3>
              <p>{photo.description}</p>
              <div className="pr-viewer-nav">
                <button type="button" onClick={() => move(-1)} aria-label="Previous photo">←</button>
                <button type="button" onClick={() => move(1)} aria-label="Next photo">→</button>
              </div>
            </div>
            <button type="button" className="pr-viewer-close" onClick={close} aria-label="Close photo">×</button>
          </div>
        </div>
      )}
    </>
  );
}
