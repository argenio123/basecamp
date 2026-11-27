// Draft translations — to be reviewed by a native speaker.
// Interface strings for the facilities Client Components (FacilityShowcase, FacilityTabs, RecoveryGrid). They cannot
// call t() (server-only), so they pick a dictionary with useLocale() from @/i18n/client: FACILITIES_UI[useLocale()].
// Kept out of ui.ts so sections can be localised in parallel. Placeholders ({n}, {title} …) are filled with fmt().
import type { Locale } from "../config";
import type { RecoveryModality } from "@/content/types";

type FacilitiesUi = {
  showcase: {
    /** Tag over every room render (the building is under construction). */
    conceptRender: string;
    slide: string; // "{n} of {count}: {title}"
    rail: string; // "{label}: choose a room"
    previous: string;
    next: string;
  };
  tabs: { label: string; equipment: string /* "{title} equipment" */ };
  recovery: {
    filters: { all: string; launch: string; planned: string };
    filterLabel: string;
    showing: string; // "Showing {shown} of {total} recovery modalities"
    audience: Record<RecoveryModality["category"], string>;
    facts: { bestFor: string; access: string; booking: string; programs: string };
    sessionAddOn: string;
    accessTbc: string;
    screeningBooking: string;
    reserveSlot: string;
    programs: string;
    pricing: string;
    screening: string;
  };
};

const en: FacilitiesUi = {
  showcase: {
    conceptRender: "Concept render",
    slide: "{n} of {count}: {title}",
    rail: "{label}: choose a room",
    previous: "Previous room",
    next: "Next room",
  },
  tabs: { label: "Spaces", equipment: "{title} equipment" },
  recovery: {
    filters: { all: "All", launch: "At launch", planned: "Planned" },
    filterLabel: "Filter recovery modalities by availability",
    showing: "Showing {shown} of {total} recovery modalities",
    audience: {
      cold: "Post-training recovery",
      heat: "Recovery and relaxation",
      contrast: "High-volume training weeks",
      compression: "Endurance and leg recovery",
      light: "Athletes following a recovery plan",
      oxygen: "Screened recovery clients",
      "mind-body": "All experience levels",
      sleep: "Athletes improving sleep quality",
    },
    facts: { bestFor: "Best for", access: "Member access", booking: "Booking", programs: "Related programs" },
    sessionAddOn: "Session add-on",
    accessTbc: "Plan access to be confirmed",
    screeningBooking: "Screening and booking required",
    reserveSlot: "Reserve a recovery slot",
    programs: "Recovery & Mobility",
    pricing: "Pricing:",
    screening: "Health screening required",
  },
};

const fil: FacilitiesUi = {
  showcase: {
    conceptRender: "Render ng disenyo",
    slide: "{n} sa {count}: {title}",
    rail: "{label}: pumili ng kuwarto",
    previous: "Nakaraang kuwarto",
    next: "Susunod na kuwarto",
  },
  tabs: { label: "Mga espasyo", equipment: "Equipment sa {title}" },
  recovery: {
    filters: { all: "Lahat", launch: "Sa pagbukas", planned: "Nakaplano" },
    filterLabel: "I-filter ang recovery modalities ayon sa availability",
    showing: "Ipinapakita ang {shown} sa {total} recovery modalities",
    audience: {
      cold: "Recovery pagkatapos mag-train",
      heat: "Recovery at relaxation",
      contrast: "Mga linggong mabigat ang training",
      compression: "Endurance at recovery ng binti",
      light: "Mga atletang may sinusunod na recovery plan",
      oxygen: "Mga recovery client na dumaan sa screening",
      "mind-body": "Lahat ng level",
      sleep: "Mga atletang gustong gumanda ang tulog",
    },
    facts: { bestFor: "Bagay para sa", access: "Access ng member", booking: "Booking", programs: "Kaugnay na programs" },
    sessionAddOn: "Add-on bawat session",
    accessTbc: "Kukumpirmahin pa ang access sa plan",
    screeningBooking: "Kailangan ng screening at booking",
    reserveSlot: "Mag-reserve ng recovery slot",
    programs: "Recovery & Mobility",
    pricing: "Presyo:",
    screening: "Kailangan ng health screening",
  },
};

export const FACILITIES_UI: Record<Locale, FacilitiesUi> = { en, fil };
