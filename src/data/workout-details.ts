// Long-form copy and per-step photos for the class pages (/classes/styles/[slug]), laid out like a development
// page: "What it is" lead + fact card, then "How a session runs" (sticky photo + step list). Step photos live in
// /public/images/programs/steps/<slug>-<n>.jpg (n = 1–4, generated to the brand book photography brief).

export type WorkoutDetail = {
  /** Three-line statement shown at the headline size (≤27 characters per line). */
  statement: readonly [string, string, string];
  /** "What it is" lead paragraph. */
  lead: string;
  /** One short detail per outcome (same order as WorkoutType.outcomes), shown when its row is opened. */
  gains: readonly [string, string, string];
  /** One sentence per session step, in the same order as WorkoutType.session. */
  steps: readonly string[];
  /** Facility zone where the class runs (the "Continue into" band). */
  zone: { title: string; href: string; image: string; imageAlt: string; width: number; height: number };
};

const TRAINING_ZONE = { title: "Training zones", href: "/facilities/training", image: "/images/facilities/facility-render-a1-2.jpg", imageAlt: "Render of the BaseCamp CamSur training building", width: 1807, height: 802 };
const OUTDOOR_ZONE = { title: "Outdoor training facility", href: "/facilities/training", image: "/images/facilities/facility-landscape.jpg", imageAlt: "The open-air training field beside BaseCamp CamSur", width: 1920, height: 1080 };

export const WORKOUT_DETAILS: Record<string, WorkoutDetail> = {
  "skierg-conditioning": {
    statement: ["Pull from the hips.", "Breathe through the burn.", "Build an engine."],
    lead: "Station 01 of the HYROX-style format: a 1,000 m SkiErg effort that builds full-body cardio through powerful, repeatable pulls. Coaches teach the hinge-and-pull pattern first, then build the engine to hold it under fatigue.",
    gains: ["More power from every stroke: hips and lats drive the pull, so the arms do less and the pace holds longer.", "Learn a stroke rate you can sustain, so 1,000 m feels controlled from the first pull to the last.", "Legs, core, back and lungs work together, building the engine every other station relies on."],
    steps: [
      "Learn the hinge, the pull and the reset with a coach beside the machine, at an easy pace.",
      "Find a stroke rate you can hold: steady pulls, smooth breathing, one number on the monitor.",
      "Short, hard efforts and 1,000 m pieces that build the engine for race day.",
      "Stretch the lats and shoulders, bring the heart rate down and log the session.",
    ],
    zone: TRAINING_ZONE,
  },
  "sled-push": {
    statement: ["Drop low. Drive hard.", "Own every step.", "Move the immovable."],
    lead: "Station 02: a 50 m sled push that develops explosive leg drive. Every session starts with body angle, because a low, braced position moves more weight with less effort.",
    gains: ["Quads, glutes and calves get stronger under heavy, short efforts that carry over to running and squats.", "A low, straight-line position moves more weight with less effort and keeps the lower back safe.", "Explosive starts and steady 50 m pushes at race weight, so the sled never stalls on race day."],
    steps: [
      "Set the body angle: hands on the poles, hips low, a straight line from head to heel.",
      "Short, punchy pushes that teach the legs to drive the floor away with every step.",
      "Loaded 50 m pushes at race weight, scaled to your level by the coach.",
      "Walk it off, breathe and reset before the next set or the next station.",
    ],
    zone: OUTDOOR_ZONE,
  },
  "sled-pull": {
    statement: ["Grip it. Rip it.", "Hand over hand.", "Never let it stall."],
    lead: "Station 03: a 50 m sled pull that trains grip, back and posterior chain under load. You learn to brace, find a hand rhythm and keep the rope moving without losing position.",
    gains: ["Hand-over-hand rope work builds a grip that lasts through the carries and pulls later in a race.", "Pull with the whole back and hips, not just the arms, for faster lengths with less fatigue.", "A braced, still trunk keeps the sled moving in a straight line and protects the spine under load."],
    steps: [
      "Brace in a low athletic stance: core tight, feet planted, rope in hand.",
      "Find a smooth hand-over-hand rhythm so the sled never stops moving.",
      "Heavy pulls over the full distance, keeping the trunk still and the hips low.",
      "Shake out the grip, rehydrate and recover before the next round.",
    ],
    zone: OUTDOOR_ZONE,
  },
  "burpee-broad-jumps": {
    statement: ["Hit the floor.", "Fly forward.", "Never stop moving."],
    lead: "Station 04: 80 m of burpee broad jumps, combining floor strength and forward power. Coaches build a soft landing and a steady rhythm first, so the distance comes without the burnout.",
    gains: ["Stronger hips and legs for longer, more controlled forward jumps over the full 80 m.", "Burpee, jump, repeat: a breathing pattern that keeps you moving without stopping to recover.", "Repeated full-body efforts raise the work you can do before your heart rate and legs give out."],
    steps: [
      "Practise a soft, controlled landing and a chest-to-floor burpee at your own pace.",
      "Link burpees into a rhythm you can repeat, breath by breath.",
      "Distance sets: burpee, jump forward, repeat, until the lane is done.",
      "Lie down, slow the breathing and let the legs recover.",
    ],
    zone: TRAINING_ZONE,
  },
  rowing: {
    statement: ["Legs. Body. Arms.", "Find your rhythm.", "Make every stroke count."],
    lead: "Station 05: a 1,000 m row that builds aerobic power with efficient strokes. The focus is a clean setup and a controlled stroke rate, so power comes from the legs, not the arms.",
    gains: ["Legs, body, then arms: a clean sequence that turns each stroke into distance, not wasted effort.", "Hold a target split across 1,000 m instead of starting fast and fading in the second half.", "A bigger aerobic base that helps you recover between stations and finish strong."],
    steps: [
      "Set the foot straps and learn the catch, drive and recovery with a coach.",
      "Hold a steady stroke rate: legs first, then body, then arms.",
      "Working rows and 1,000 m pieces at race effort, side by side with the group.",
      "An easy, relaxed finish to flush the legs and cool down.",
    ],
    zone: TRAINING_ZONE,
  },
  "farmers-carry": {
    statement: ["Grip like iron.", "Stand tall.", "Walk the weight."],
    lead: "Station 06: a 200 m farmers carry that builds grip, core and posture under heavy load. You learn to brace, lift safely and walk tall the whole distance.",
    gains: ["Forearms and hands that hold heavy weights over 200 m without stopping to shake out.", "Tall, braced posture under load that protects the back and carries into daily lifting.", "Keep walking steadily while heavy weights pull on the shoulders, core and legs."],
    steps: [
      "Brace the core and set the shoulders before every lift.",
      "Pick up the weights with a flat back, driving through the legs.",
      "Loaded carries over distance: tall posture, short quick steps, no rushing.",
      "Set the weights down with control and shake out the grip.",
    ],
    zone: OUTDOOR_ZONE,
  },
  "sandbag-lunges": {
    statement: ["One leg at a time.", "Steady under load.", "Stronger every step."],
    lead: "Station 07: 100 m of sandbag lunges for single-leg strength and control under a shifting load. Coaches set the bag and the posture first, then build the distance.",
    gains: ["Each leg works on its own, fixing imbalances and building stronger knees and hips.", "Control a shifting sandbag through every step, training the small stabilising muscles.", "Hold good lunge form over 100 m while the bag tries to pull you out of position."],
    steps: [
      "Position the sandbag across the shoulders and set an upright posture.",
      "Controlled steps: knee just above the floor, drive back up through the front foot.",
      "Distance sets down the lane, keeping the bag steady and the torso tall.",
      "Drop the bag and stretch the hips, quads and glutes.",
    ],
    zone: TRAINING_ZONE,
  },
  "wall-balls": {
    statement: ["Squat deep.", "Throw high.", "Finish strong."],
    lead: "Station 08, the finisher: wall balls that link a deep squat and an accurate throw into one sustained effort. Coaches set the target, build the squat and teach a rhythm that lasts.",
    gains: ["Hit the target rep after rep, so no throws are wasted when your legs are tired.", "Squat to full depth again and again without losing pace, building leg and lung endurance.", "A strong final station: the reps that decide your race time when everything else is done."],
    steps: [
      "Set the target height and your stance with a coach before the first rep.",
      "Find a squat rhythm: down to depth, drive up, catch and go again.",
      "Rep sets to the target, building towards the race-standard 100 reps.",
      "Recover against the wall, slow the breathing and celebrate the finish.",
    ],
    zone: TRAINING_ZONE,
  },
};

export const stepImage = (slug: string, index: number) => `/images/programs/steps/${slug}-${index + 1}.jpg`;
