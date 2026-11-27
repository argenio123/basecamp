// Draft translations — to be reviewed by a native speaker.
// Filipino t() phrases for the facilities pages/components (same rules as ../phrases.ts). One file per section so
// sections can be localised in parallel without merge conflicts.
// Room names, "gym", "sauna", "cold plunge", "hyperbaric", "locker", "recovery level" and HYROX stay English
// (GLOSSARY.md). Phrases left out on purpose fall back to English: the slide eyebrows "Recovery", "Social" and
// "Amenities" (not shown on screen) and the showcase labels "Training floor" / "Recovery level".
export const PHRASES_FACILITIES: Readonly<Record<string, string>> = {
  // ---------- /facilities ----------
  "Facilities": "Mga Pasilidad",
  "The planned BaseCamp CamSur facility in Camarines Sur: modern tropical design, 673 square meters of outdoor training, a recovery level, and spaces to stay longer.":
    "Ang planong pasilidad ng BaseCamp CamSur sa Camarines Sur: modern tropical na disenyo, 673 square meters ng outdoor training, isang recovery level, at mga lugar para magtagal.",
  "Training zones.\nA recovery level.\nSpaces to stay longer.": "Mga training zone.\nIsang buong recovery level.\nMga lugar para magtagal.",
  "Explore the facility": "Libutin ang pasilidad",
  "Train. Recover. Stay.": "Mag-train. Mag-recover. Magtagal.",
  "Two floors. One connected space.": "Dalawang palapag. Iisang konektadong espasyo.",
  "CrossFit-style area, gym and yoga studio.": "CrossFit-style na area, gym at yoga studio.",
  "Plunge pools, hyperbaric and therapy rooms.": "Plunge pools, hyperbaric at mga therapy room.",
  "Lobby, café, work area and lockers.": "Lobby, café, work area at lockers.",
  "Rendered interior of the BaseCamp gym with cardio and strength equipment": "Render ng loob ng BaseCamp gym na may cardio at strength equipment",
  "Rendered BaseCamp recovery level with hot and cold plunge pools": "Render ng recovery level ng BaseCamp na may mainit at malamig na plunge pools",
  "Rendered BaseCamp cafeteria with communal tables and warm timber finishes": "Render ng cafeteria ng BaseCamp na may mahahabang mesa at mainit na kulay ng kahoy",

  // ---------- /facilities/training ----------
  "Training zones": "Mga training zone",
  "Inside the BaseCamp CamSur training floor: a CrossFit-style area, a complete fitness gym, a yoga studio, and the planned equipment.":
    "Silipin ang training floor ng BaseCamp CamSur: CrossFit-style na area, kumpletong fitness gym, yoga studio, at ang mga nakaplanong equipment.",
  "Lift. Move. Sweat.\nThree rooms to train.\nAll under one roof.": "Buhat. Galaw. Pawis.\nTatlong kuwarto para mag-train.\nLahat sa iisang bubong.",
  "Zones": "Mga zone",
  "Strength & cardio": "Strength at cardio",
  "Racks, barbells, bikes and rowers. Open access.": "Racks, barbells, bikes at rowers. Open access.",
  "Functional & HYROX": "Functional at HYROX",
  "Sleds, ropes, wall balls and sandbags.": "Sleds, ropes, wall balls at sandbags.",

  // ---------- /facilities/recovery ----------
  "Inside the BaseCamp CamSur recovery level: hot and cold plunge pools, a hyperbaric chamber, therapy rooms, a recovery lounge, and showers.":
    "Silipin ang recovery level ng BaseCamp CamSur: mainit at malamig na plunge pools, hyperbaric chamber, mga therapy room, recovery lounge, at mga shower.",
  "Cold. Heat. Contrast.\nA full recovery level.\nBuilt for camp volume.": "Lamig. Init. Contrast.\nIsang buong recovery level.\nKayang-kaya ang dami ng camp.",

  // ---------- /facilities/lifestyle ----------
  "Lounge, café & lockers": "Lounge, café at lockers",
  "Inside BaseCamp CamSur beyond the workout: the lobby, café, work area, locker rooms, and showers.":
    "Ang BaseCamp CamSur lampas sa workout: ang lobby, café, work area, mga locker room, at mga shower.",
  "Lobby. Café. Lockers.\nEverything in one place.\nMade to stay longer.": "Lobby. Café. Lockers.\nLahat nasa iisang lugar.\nGinawa para magtagal ka.",
  "Changing": "Bihisan",
  "Shared spaces": "Mga shared space",

  // ---------- components/facilities (FacilityCardFacts, facts.ts) ----------
  "Best for": "Bagay para sa",
  "Member access": "Access ng member",
  "Booking": "Booking",
  "Related programs": "Kaugnay na programs",
  "Technical detail": "Teknikal na detalye",
  "Recovery modalities": "Recovery modalities",
  "At launch": "Sa pagbukas",
  "Phase 2 or planned": "Phase 2 o nakaplano",
};
