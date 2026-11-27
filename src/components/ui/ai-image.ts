// Image-kind rules and alt-text helpers for components/ui/AiImageLabel (see the notes there). Pure and client-safe.
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { fmt, UI } from "@/i18n/ui";

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

/** Alt text for an AI image that says it is an illustration (left alone if empty/decorative, or already says so).
 *  Pass the page's locale for the prefix in its language (server: getLocale(), client: useLocale()). */
export function aiImageAlt(alt: string, locale: Locale = DEFAULT_LOCALE): string {
  if (!alt.trim() || /^\s*AI[\s-]/i.test(alt)) return alt;
  return fmt(UI[locale].imageLabel.aiAlt, { alt });
}

/** Alt text for a render that says so (left alone if empty/decorative, or it already mentions a render). */
export function renderImageAlt(alt: string, locale: Locale = DEFAULT_LOCALE): string {
  if (!alt.trim() || /\brender/i.test(alt)) return alt;
  return fmt(UI[locale].imageLabel.renderAlt, { alt });
}

/** Alt text for any image: says what it is when it's AI-generated or a render, otherwise unchanged. */
export function labelledImageAlt(alt: string, kind: ImageKind | null, locale: Locale = DEFAULT_LOCALE): string {
  if (kind === "ai") return aiImageAlt(alt, locale);
  if (kind === "render") return renderImageAlt(alt, locale);
  return alt;
}
