import "@/styles/ai-label.css";

/**
 * Honest labelling for pictures that aren't photographs. BaseCamp hasn't opened yet, so:
 * - "ai": AI-generated pictures of people and scenes are illustrations, not real members, staff or events. Anything
 *   under a `/generated/` folder, plus the class-page step photos (`/images/programs/steps/`, generated to the
 *   brand-book photography brief).
 * - "render": every file in `/images/facilities/` is an architectural render of the building under construction
 *   (interiors "1st floor- …" / "2F …", the floor-plan "top view", and the exterior, aerial, front, detail and
 *   landscape views). Real site photos, once there are any, go in `/images/facilities/photos/` and stay unlabelled.
 * The rule is path-based so editors don't have to remember. FacilityShowcase carries its own "Concept render" tag.
 */
export type ImageKind = "ai" | "render";

const AI_IMAGE_PATTERNS = [/\/generated\//i, /\/images\/programs\/steps\//i];
const RENDER_PATTERN = /\/images\/facilities\//i;
const REAL_PHOTO_PATTERN = /\/images\/facilities\/photos\//i;

export function isAiGeneratedImage(src: string | null | undefined): boolean {
  return !!src && AI_IMAGE_PATTERNS.some((pattern) => pattern.test(src));
}

export function isConceptRender(src: string | null | undefined): boolean {
  return !!src && RENDER_PATTERN.test(src) && !REAL_PHOTO_PATTERN.test(src);
}

/** What the picture is, or null for a real photo (no label). */
export function imageKind(src: string | null | undefined): ImageKind | null {
  if (isAiGeneratedImage(src)) return "ai";
  if (isConceptRender(src)) return "render";
  return null;
}

/** Alt text for an AI image that says it is an illustration (left alone if empty/decorative, or already says so). */
export function aiImageAlt(alt: string): string {
  if (!alt.trim() || /^\s*AI[\s-]/i.test(alt)) return alt;
  return `AI illustration: ${alt}`;
}

/** Alt text for a render that says so (left alone if empty/decorative, or it already mentions a render). */
export function renderImageAlt(alt: string): string {
  if (!alt.trim() || /\brender/i.test(alt)) return alt;
  return `Architectural render: ${alt}`;
}

/** Alt text for any image: says what it is when it's AI-generated or a render, otherwise unchanged. */
export function labelledImageAlt(alt: string, kind: ImageKind | null): string {
  if (kind === "ai") return aiImageAlt(alt);
  if (kind === "render") return renderImageAlt(alt);
  return alt;
}

const LABEL_TEXT: Record<ImageKind, string> = { ai: "AI-generated image", render: "Concept render" };

/**
 * Small pill laid over the image: "AI-generated image" (default) or, with kind="render", "Concept render", in the
 * same style as the facilities showcase tag. Real text. Pass `hidden` when the image's alt text already says what it
 * is (see labelledImageAlt), so screen readers don't hear it twice. Place it with a modifier class from ai-label.css
 * (e.g. "ai-label--hero", "ai-label--corner", plus "ai-label--small" on small cards).
 */
export default function AiImageLabel({ className, hidden = false, kind = "ai" }: { className?: string; hidden?: boolean; kind?: ImageKind }) {
  return (
    <span className={`ai-label${className ? ` ${className}` : ""}`} aria-hidden={hidden || undefined}>
      {LABEL_TEXT[kind]}
    </span>
  );
}

/** The right pill for `src` ("AI-generated image" or "Concept render"), or nothing for a real photo. */
export function ImageLabel({ src, className, hidden = false }: { src: string | null | undefined; className?: string; hidden?: boolean }) {
  const kind = imageKind(src);
  return kind ? <AiImageLabel kind={kind} className={className} hidden={hidden} /> : null;
}
