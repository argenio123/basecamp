"use client";

// The pill itself, a Client Component so its text follows the page's language (useUi) wherever it is rendered,
// in Server and Client Components alike. Import it through ./AiImageLabel.
import { useUi } from "@/i18n/client";
import { imageKind, type ImageKind } from "./ai-image";
import "@/styles/ai-label.css";

/**
 * Small pill laid over the image: "AI-generated image" (default) or, with kind="render", "Concept render", in the
 * same style as the facilities showcase tag. Real text. Pass `hidden` when the image's alt text already says what it
 * is (see labelledImageAlt), so screen readers don't hear it twice. Place it with a modifier class from ai-label.css
 * (e.g. "ai-label--hero", "ai-label--corner", plus "ai-label--small" on small cards).
 */
export default function AiImageLabel({ className, hidden = false, kind = "ai" }: { className?: string; hidden?: boolean; kind?: ImageKind }) {
  const ui = useUi();
  return (
    <span className={`ai-label${className ? ` ${className}` : ""}`} aria-hidden={hidden || undefined}>
      {ui.imageLabel[kind]}
    </span>
  );
}

/** The right pill for `src` ("AI-generated image" or "Concept render"), or nothing for a real photo. */
export function ImageLabel({ src, className, hidden = false }: { src: string | null | undefined; className?: string; hidden?: boolean }) {
  const kind = imageKind(src);
  return kind ? <AiImageLabel kind={kind} className={className} hidden={hidden} /> : null;
}
