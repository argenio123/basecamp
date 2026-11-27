// Draft translations — to be reviewed by a native speaker.
// Interface text for the classes section's Client Components (ProgramCoverflow), per locale. Client-safe. Kept out of
// ../ui.ts so sections can be localised in parallel; pick with CLASSES_UI[useLocale()] (@/i18n/client), fill
// {placeholders} with fmt() from ../ui.
import type { Locale } from "../config";

type ClassesUi = {
  coverflow: { carousel: string; previous: string; next: string; choose: string; show: string; showing: string };
};

export const CLASSES_UI: Record<Locale, ClassesUi> = {
  en: {
    coverflow: {
      carousel: "Training programs",
      previous: "Previous program",
      next: "Next program",
      choose: "Choose a program",
      show: "Show {title}",
      showing: "Showing {title}: {description}",
    },
  },
  fil: {
    coverflow: {
      carousel: "Mga training program",
      previous: "Nakaraang program",
      next: "Susunod na program",
      choose: "Pumili ng program",
      show: "Ipakita ang {title}",
      showing: "Ipinapakita ang {title}: {description}",
    },
  },
};
