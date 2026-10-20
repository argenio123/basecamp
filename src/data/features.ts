// Reference-site features (ritebali.com, reload-fitness.com) applied across the site: per-section copy for the
// scrolling marquee headings, the faded "ghost" words behind section titles and the closing quote bands.
// Quotes reuse lines already on the site, so no new claims are introduced.

export type SectionKey = "home" | "programs" | "facilities" | "membership" | "schedule" | "visit" | "about" | "contact";

export type SectionFeature = {
  /** Scrolling marquee heading (Rite "Find Your Ritual"). */
  marquee: string;
  /** Faded word behind the section's "At a glance" title (Reload "WORKOUT"). */
  ghost: string;
  /** Closing quote band (Reload "Excuses are for people who don't…"). */
  quote: string;
};

export const SECTION_FEATURES: Record<SectionKey, SectionFeature> = {
  home: { marquee: "Find your rhythm", ghost: "BASECAMP", quote: "Training and recovery are equal priorities. Adaptation happens during recovery." },
  programs: { marquee: "Find your class", ghost: "CLASSES", quote: "Not a niche: a new category." },
  facilities: { marquee: "Built for performance", ghost: "FACILITIES", quote: "Every brand claim is architectural reality." },
  membership: { marquee: "Choose your access", ghost: "MEMBERSHIP", quote: "No hidden information. Early members lock in launch rates." },
  schedule: { marquee: "Plan your week", ghost: "SCHEDULE", quote: "Train. Transform. Thrive." },
  visit: { marquee: "Come to CamSur", ghost: "VISIT", quote: "While others do beaches, CamSur offers the freshwater and forest alternative." },
  about: { marquee: "Train · Transform · Thrive", ghost: "ABOUT", quote: "Southeast Asia's Performance Playground." },
  contact: { marquee: "Start your journey", ghost: "CONTACT", quote: "Train. Transform. Thrive." },
};

/** Section key for a page path ("/facilities/recovery" → "facilities"); falls back to home. */
export function sectionKeyFor(path: string): SectionKey {
  const first = path.split("/")[1] ?? "";
  if (first === "classes") return "programs";
  return (first in SECTION_FEATURES ? first : "home") as SectionKey;
}
