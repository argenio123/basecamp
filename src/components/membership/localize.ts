// Locale helpers for the membership Server Components (server-only: uses t() and the request locale). The figures
// themselves always come from content; only the words around them are translated (src/i18n/fil/phrases/membership.ts).
import { formatDateLabel } from "@/content/format";
import { getLocale, t } from "@/i18n/server";

/** savingLabel() text in the page's language: "30%" stays, "about 33%" → t("about {percent}"). */
export function percentText(label: string): string {
  return label.startsWith("about ") ? t("about {percent}", { percent: label.slice("about ".length) }) : label;
}

/** formatPhp()/fromPrice() labels in the page's language: "On request" and the "From " prefix; figures unchanged. */
export function priceText(label: string): string {
  if (label === "On request") return t("On request");
  return label.startsWith("From ") ? t("From {amount}", { amount: label.slice("From ".length) }) : label;
}

const FIL_DATE = new Intl.DateTimeFormat("fil-PH", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Manila" });

/** "Offer ends 12 March 2027" in the page's language, or "" when the date is not set or not valid. */
export function offerEndsText(expiresOn: string): string {
  const label = expiresOn ? formatDateLabel(expiresOn) : "";
  if (!label || label === "To be announced") return "";
  const date = getLocale() === "fil" ? FIL_DATE.format(new Date(`${expiresOn}T00:00:00+08:00`)) : label;
  return t("Offer ends {date}", { date });
}
