export type WorkoutType = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  image: string;
  imageAlt: string;
  theme: "race" | "industrial" | "documentary" | "restore" | "team";
  focus: string;
  format: string;
  intensity: string;
  session: readonly string[];
  outcomes: readonly string[];
};

export type WorkoutGroup = {
  id: string;
  title: string;
  description: string;
  slugs: readonly string[];
};

export const WORKOUT_TYPES: readonly WorkoutType[] = [
  {
    slug: "skierg-conditioning",
    title: "SkiErg",
    shortTitle: "SkiErg",
    description: "Build full-body cardio through powerful, repeatable pulls.",
    image: "/images/programs/stations/skierg-machine.jpg",
    imageAlt: "Athlete pulling the SkiErg handles in a concrete training space",
    theme: "race",
    focus: "Lats + core + cardio",
    format: "1,000 m efforts and intervals",
    intensity: "Moderate–high",
    session: ["Technique", "Cadence", "Intervals", "Reset"],
    outcomes: ["Efficient pulls", "Better pacing", "Full-body endurance"],
  },
  {
    slug: "sled-push",
    title: "Sled Push",
    shortTitle: "Sled Push",
    description: "Develop explosive leg drive through heavy, controlled pushes.",
    image: "/images/programs/stations/sled-push-man.jpg",
    imageAlt: "Athlete driving a plate-loaded sled forward",
    theme: "industrial",
    focus: "Leg power + drive",
    format: "50 m push intervals",
    intensity: "High",
    session: ["Position", "Drive", "Heavy pushes", "Recover"],
    outcomes: ["Stronger legs", "Better body angle", "Race-ready power"],
  },
  {
    slug: "sled-pull",
    title: "Sled Pull",
    shortTitle: "Sled Pull",
    description: "Train grip, back, and posterior-chain strength under load.",
    image: "/images/programs/stations/sled-pull.jpg",
    imageAlt: "Athlete pulling a loaded sled with a strap across a concrete floor",
    theme: "industrial",
    focus: "Grip + posterior chain",
    format: "50 m rope-pull intervals",
    intensity: "High",
    session: ["Brace", "Hand rhythm", "Heavy pulls", "Recover"],
    outcomes: ["Stronger grip", "Powerful pulls", "Better trunk control"],
  },
  {
    slug: "burpee-broad-jumps",
    title: "Burpee Broad Jumps",
    shortTitle: "Burpee Jumps",
    description: "Combine floor strength and forward power across fast intervals.",
    image: "/images/programs/stations/burpee-broad-jump.jpg",
    imageAlt: "Athlete mid broad jump across a concrete training floor",
    theme: "race",
    focus: "Full-body power",
    format: "80 m movement intervals",
    intensity: "High",
    session: ["Landing prep", "Burpee rhythm", "Distance sets", "Reset"],
    outcomes: ["Stronger jumps", "Smoother rhythm", "Work capacity"],
  },
  {
    slug: "rowing",
    title: "Rowing",
    shortTitle: "Rowing",
    description: "Build aerobic power with efficient strokes and controlled pacing.",
    image: "/images/programs/stations/row.jpg",
    imageAlt: "Athlete on a seated cable row in a concrete training space",
    theme: "race",
    focus: "Cardio + posterior chain",
    format: "1,000 m rows and intervals",
    intensity: "Moderate–high",
    session: ["Stroke setup", "Rate control", "Working rows", "Easy finish"],
    outcomes: ["Efficient strokes", "Stronger pacing", "Aerobic power"],
  },
  {
    slug: "farmers-carry",
    title: "Farmer’s Carry",
    shortTitle: "Carry",
    description: "Build grip, core, and posture while moving heavy loads.",
    image: "/images/programs/stations/farmers-carry.jpg",
    imageAlt: "Athlete carrying two kettlebells across a concrete floor",
    theme: "industrial",
    focus: "Grip + core",
    format: "200 m loaded carries",
    intensity: "Moderate–high",
    session: ["Brace", "Pick up", "Carry sets", "Unload"],
    outcomes: ["Stronger grip", "Stable posture", "Loaded endurance"],
  },
  {
    slug: "sandbag-lunges",
    title: "Sandbag Lunges",
    shortTitle: "Lunges",
    description: "Build single-leg strength and control under a shifting load.",
    image: "/images/programs/stations/sandbag-lunge.jpg",
    imageAlt: "Athlete lunging with a sandbag across the shoulders on a lined floor",
    theme: "industrial",
    focus: "Legs + stability",
    format: "100 m loaded lunges",
    intensity: "Moderate–high",
    session: ["Position", "Step control", "Distance sets", "Release"],
    outcomes: ["Single-leg strength", "Better balance", "Load control"],
  },
  {
    slug: "wall-balls",
    title: "Wall Balls",
    shortTitle: "Wall Balls",
    description: "Link deep squats and accurate throws into one sustained effort.",
    image: "/images/programs/stations/wall-ball-squat.jpg",
    imageAlt: "Athlete squatting with a wall ball beside a concrete wall",
    theme: "race",
    focus: "Legs + overhead power",
    format: "Technique and rep sets",
    intensity: "High",
    session: ["Target setup", "Squat rhythm", "Rep sets", "Recover"],
    outcomes: ["Better accuracy", "Squat endurance", "Finishing strength"],
  },
] as const;

export const WORKOUT_GROUPS: readonly WorkoutGroup[] = [
  {
    id: "stations",
    title: "Eight stations. One engine.",
    description: "Each station follows a 1 km run. Every station has a weekly coached class.",
    slugs: ["skierg-conditioning", "sled-push", "sled-pull", "burpee-broad-jumps", "rowing", "farmers-carry", "sandbag-lunges", "wall-balls"],
  },
] as const;

export function workoutTypeBySlug(slug: string) {
  return WORKOUT_TYPES.find((item) => item.slug === slug);
}
