// Locales (design: src/i18n/README.md). Client-safe: pure data and pure functions, no server-only imports.
// English stays at "/…" (unchanged URLs); Filipino lives under the "/fil" prefix.

export const LOCALES = ["en", "fil"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/** Names shown in the language switcher's accessible labels (each in its own language would be "English" / "Filipino" too). */
export const LOCALE_LABELS: Record<Locale, string> = { en: "English", fil: "Filipino" };
/** Short switcher labels: EN | FIL. */
export const LOCALE_SHORT: Record<Locale, string> = { en: "EN", fil: "FIL" };
/** BCP 47 tags for <html lang> and hreflang. "fil" is the registered subtag for Filipino (ISO 639-2/3). */
export const LOCALE_TAG: Record<Locale, string> = { en: "en", fil: "fil" };
/** Open Graph locale. */
export const OG_LOCALE: Record<Locale, string> = { en: "en_PH", fil: "fil_PH" };
/** URL prefix per locale ("" = no prefix). */
export const LOCALE_PREFIX: Record<Locale, string> = { en: "", fil: "/fil" };

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}
