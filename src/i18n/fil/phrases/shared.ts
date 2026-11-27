// Draft translations — to be reviewed by a native speaker.
// Filipino t() phrases for the shared pages/components (same rules as ../phrases.ts). One file per section so
// sections can be localised in parallel without merge conflicts. Client components keep their strings in ../../ui.ts.
export const PHRASES_SHARED: Readonly<Record<string, string>> = {
  // ---------- components/ui/FoundingCounter ----------
  "Founding spots are full": "Puno na ang founding spots",
  // {taken} is filled in by the component (shown in bold).
  "{taken} of {cap} founding spots taken": "{taken} sa {cap} founding spots ang kuha na",
  "Be one of the first {cap}": "Maging isa sa unang {cap}",
  "founding members.": "na founding members.",
  "Only {left} left": "{left} na lang ang natitira",
  "Founding spots taken": "Mga founding spot na kuha na",

  // ---------- components/home ----------
  "Limited founding spots": "Limitado ang founding spots",
  "Founding rates end {date}": "Hanggang {date} na lang ang founding rates",
  "Early rates end {date}": "Hanggang {date} na lang ang early rates",
  "Read our Google reviews": "Basahin ang aming Google reviews",
  "Learn more about {title}": "Alamin pa ang tungkol sa {title}",

  // ---------- components/features, components/sections ----------
  "The team": "Ang team",
  "Photos": "Mga larawan",
  "Brand pillars": "Mga brand pillar",
  "Floor plan zones": "Mga zone sa floor plan",
  "Floor plan zone details": "Detalye ng mga zone sa floor plan",
};
