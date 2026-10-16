// Flip to true once the opening timetable is published
export const scheduleReleased = false;

export const programGoals = [
  { id: "strength", label: "Get stronger" },
  { id: "movement", label: "Move better" },
  { id: "engine", label: "Build my engine" },
  { id: "fitness", label: "Get fit" },
  { id: "recover", label: "Recover & reset" },
  { id: "new", label: "I'm new" },
] as const;

export type ProgramGoal = (typeof programGoals)[number]["id"];

export type Program = {
  slug: string;
  number: string;
  title: string;
  badge: string;
  description: string;
  image: string;
  goals: ProgramGoal[];
  /** 1–5, or null when the coach sets it per person */
  intensity: number | null;
  level: "Beginner" | "All levels" | "Intermediate+";
  duration: number;
  format: "Group" | "Small group" | "1:1";
  about: string;
  whoFor: string[];
  timeline: { label: string; minutes: number }[];
  outcomes: { weeks: number; text: string }[];
  spaces: string[];
};

export const programs: Program[] = [
  {
    slug: "strength-conditioning",
    number: "01",
    title: "Strength & Conditioning",
    badge: "Strength & Conditioning",
    description: "Purposeful training that builds capacity, confidence, and durable strength.",
    image: "/images/programs/generated/strength-conditioning.png",
    goals: ["strength", "fitness"],
    intensity: 4,
    level: "All levels",
    duration: 60,
    format: "Group",
    about: "Progressive strength work paired with focused conditioning. Each session builds on the last, and coaches track your loads so you keep moving forward without guessing.",
    whoFor: ["You want to get measurably stronger", "You like structure and a plan that progresses", "You train for sport, or want to feel capable day to day"],
    timeline: [
      { label: "Warm-up & prep", minutes: 10 },
      { label: "Strength block", minutes: 20 },
      { label: "Conditioning", minutes: 20 },
      { label: "Cool-down", minutes: 10 },
    ],
    outcomes: [
      { weeks: 4, text: "Core lifts feel familiar and your working loads start to climb." },
      { weeks: 8, text: "Noticeable strength gains and more capacity to finish strong." },
      { weeks: 12, text: "A stronger base that carries into sport and everyday life." },
    ],
    spaces: ["Training floor"],
  },
  {
    slug: "functional-training",
    number: "02",
    title: "Functional Training",
    badge: "Functional Fitness Programming",
    description: "Coach-led sessions designed around movement quality and real-world performance.",
    image: "/images/programs/generated/functional-training.png",
    goals: ["movement", "fitness", "engine", "new"],
    intensity: 3,
    level: "All levels",
    duration: 50,
    format: "Group",
    about: "Varied, coach-led sessions built on the movements you use every day: squatting, hinging, pushing, pulling, carrying. Every workout scales, so beginners and experienced athletes train side by side.",
    whoFor: ["You want all-round fitness, not just one thing", "You enjoy variety and training with others", "You're starting out and want expert coaching"],
    timeline: [
      { label: "Warm-up", minutes: 10 },
      { label: "Movement skill", minutes: 10 },
      { label: "Main workout", minutes: 20 },
      { label: "Cool-down", minutes: 10 },
    ],
    outcomes: [
      { weeks: 4, text: "Better movement patterns and more confidence on the floor." },
      { weeks: 8, text: "Everyday tasks feel easier and workouts feel more controlled." },
      { weeks: 12, text: "Balanced strength, stamina, and mobility you can rely on." },
    ],
    spaces: ["Training floor", "Coach-led studios"],
  },
  {
    slug: "personal-coaching",
    number: "03",
    title: "Personal Coaching",
    badge: "Personal Coaching",
    description: "Focused guidance shaped around your goals, experience, and training rhythm.",
    image: "/images/programs/generated/personal-coaching.png",
    goals: ["strength", "movement", "fitness", "new"],
    intensity: null,
    level: "All levels",
    duration: 60,
    format: "1:1",
    about: "One-to-one sessions with a dedicated coach, built around your goals, history, and schedule. Your plan adapts week to week based on how you move, recover, and progress.",
    whoFor: ["You have a specific goal or timeline", "You're returning from a break or working around an injury", "You want full attention and accountability"],
    timeline: [
      { label: "Check-in", minutes: 5 },
      { label: "Warm-up", minutes: 10 },
      { label: "Focused training", minutes: 35 },
      { label: "Review & plan", minutes: 10 },
    ],
    outcomes: [
      { weeks: 4, text: "A clear plan, a baseline, and habits that start to stick." },
      { weeks: 8, text: "Visible progress toward the goal you set together." },
      { weeks: 12, text: "Lasting results and the know-how to keep them going." },
    ],
    spaces: ["Training floor", "Coach-led studios"],
  },
  {
    slug: "endurance",
    number: "04",
    title: "Endurance",
    badge: "Endurance Training",
    description: "Conditioning that develops pace, resilience, and an engine built to go further.",
    image: "/images/programs/generated/endurance.png",
    goals: ["engine", "fitness"],
    intensity: 4,
    level: "Intermediate+",
    duration: 45,
    format: "Small group",
    about: "Structured interval and tempo work that builds your aerobic engine. Sessions are paced by heart-rate zones and effort, so you train hard on the right days and recover on the others.",
    whoFor: ["You run, ride, or play endurance sports", "You want to go further and recover faster", "You already train and want a new challenge"],
    timeline: [
      { label: "Warm-up", minutes: 10 },
      { label: "Intervals", minutes: 25 },
      { label: "Cool-down", minutes: 10 },
    ],
    outcomes: [
      { weeks: 4, text: "Better pacing and quicker recovery between efforts." },
      { weeks: 8, text: "Hold harder efforts for longer at the same heart rate." },
      { weeks: 12, text: "A bigger engine for race day, sport, or everyday energy." },
    ],
    spaces: ["Training floor"],
  },
  {
    slug: "recovery-mobility",
    number: "05",
    title: "Recovery & Mobility",
    badge: "Recovery & Mobility",
    description: "Space to restore, reset, and support the work you do in training and life.",
    image: "/images/programs/generated/recovery-mobility.png",
    goals: ["recover", "movement", "new"],
    intensity: 1,
    level: "Beginner",
    duration: 45,
    format: "Group",
    about: "Guided mobility, breathwork, and recovery practices that help your body absorb training. A calm, low-intensity session that pairs with every other program.",
    whoFor: ["You feel stiff, tight, or run-down", "You train hard and want to recover better", "You want a gentle way to start moving"],
    timeline: [
      { label: "Breathe & arrive", minutes: 5 },
      { label: "Mobility flow", minutes: 20 },
      { label: "Guided recovery", minutes: 15 },
      { label: "Reset", minutes: 5 },
    ],
    outcomes: [
      { weeks: 4, text: "Less stiffness and a calmer, more rested feeling." },
      { weeks: 8, text: "More range of motion and better-quality training days." },
      { weeks: 12, text: "Recovery that's part of your routine, not an afterthought." },
    ],
    spaces: ["Recovery areas"],
  },
];

export const facilityFeatures = [
  ["Training floor", "A versatile environment for strength, conditioning, and functional movement."],
  ["Coach-led studios", "Dedicated spaces for structured classes and focused small-group sessions."],
  ["Recovery areas", "A calmer setting designed to complement training and support restoration."],
  ["Community spaces", "Room to arrive, connect, refuel, and spend time beyond your workout."],
];

export const toAnchor = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
