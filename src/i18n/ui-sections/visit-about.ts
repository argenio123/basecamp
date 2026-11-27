// Draft translations — to be reviewed by a native speaker.
// Interface text for the Client Components of the visit-about section (src/components/about/*). Client-safe: pure
// data, read with UI_VISIT_ABOUT[useLocale()] from "@/i18n/client". Server Components use t() and
// fil/phrases/visit-about.ts instead. Fill {placeholders} with fmt() from "@/i18n/ui".
import type { Locale } from "../config";

export type UiVisitAbout = {
  countdown: { tba: string; days: string; hours: string; minutes: string; opening: string };
  explorer: { show: string; detail: string; controls: string };
  comparison: { compare: string; caption: string };
};

const en: UiVisitAbout = {
  countdown: { tba: "Opening date to be announced", days: "Days", hours: "Hours", minutes: "Minutes", opening: "Opening {date}" },
  explorer: { show: "Show {title}", detail: "Detail", controls: "Architectural details" },
  comparison: { compare: "Compare {first} and {second}", caption: "Drag to compare two architectural viewpoints from the current render study." },
};

const fil: UiVisitAbout = {
  countdown: { tba: "Iaanunsyo pa ang petsa ng pagbubukas", days: "Araw", hours: "Oras", minutes: "Minuto", opening: "Magbubukas sa {date}" },
  explorer: { show: "Ipakita ang {title}", detail: "Detalye", controls: "Mga detalye ng arkitektura" },
  comparison: { compare: "Ikumpara ang {first} at {second}", caption: "I-drag para ikumpara ang dalawang anggulo ng arkitektura mula sa kasalukuyang render study." },
};

export const UI_VISIT_ABOUT: Record<Locale, UiVisitAbout> = { en, fil };
