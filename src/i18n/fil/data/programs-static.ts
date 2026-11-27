// Filipino draft of the user-facing exports in src/data/programs-static.ts. Same export names and types.
// Not included (ids / slugs only, no text, use the English module): FEATURED_PROGRAMME_LINKS, PROGRAMME_LINKS,
// INTEREST_PRICE_ITEMS, WEEKDAYS. Class names (Sunrise Strength, Engine Room, …) and programme titles stay English.
import type * as EN from "@/data/programs-static";
import type { ClassFilter, ClassPreview } from "@/data/programs-static";
import type { Availability, CalendarEvent, Modality, TimetableSlot, Weekday } from "@/content/types";
import type { Localized } from "../localized";

export const OUTCOMES_NOTE: Localized<typeof EN.OUTCOMES_NOTE> = "Ito ang mga marker na sinusubaybayan namin, hindi pangako: nakadepende ang progreso sa pinagsimulan mo, sa consistency, at sa recovery.";
export const SCHEDULE_SOON: Localized<typeof EN.SCHEDULE_SOON> = "Ilalabas na ang schedule";

export const FEATURED_PROGRAMME_OUTCOMES: Readonly<Record<string, string>> = {
  "strength-conditioning": "Bumuo ng matibay na lakas ng buong katawan",
  "functional-training": "Gumalaw nang mas maayos at bumuo ng all-around fitness",
  "personal-coaching": "Sundin ang planong hinubog para sa iyo",
  endurance: "Paunlarin ang pace, tibay, at aerobic capacity",
  "recovery-mobility": "Ibalik ang range of motion at mag-recover nang maayos",
};

export const TRAINING_PATHWAYS: Localized<typeof EN.TRAINING_PATHWAYS> = [
  { id: "start", label: "Simula", text: "Aralin ang mga galaw at bumuo ng training rhythm na kaya mong ulitin.", href: "/classes" },
  { id: "build", label: "Buo", text: "Paunlarin ang lakas, kalidad ng galaw at work capacity.", href: "/classes" },
  { id: "perform", label: "Perform", text: "Mag-train nang may layunin para sa isang goal, sport o personal na benchmark.", href: "/classes" },
  { id: "compete", label: "Compete", text: "Maghanda para sa endurance events at fitness racing kahit pagod na.", href: "/classes" },
  { id: "recover", label: "Recover", text: "Ibalik ang range, i-regulate ang load at dumating nang handa sa susunod na session.", href: "/classes" },
];

export const FIRST_WEEK: Localized<typeof EN.FIRST_WEEK> = [
  { day: "Araw 01", title: "Assessment + foundations", text: "Magtakda ng baseline, kilalanin ang training floor, at pumili ng tamang panimulang load." },
  { day: "Araw 02", title: "Strength at conditioning", text: "Buuin ang mga pangunahing pattern kasama ang coach at tapusin sa kontroladong work." },
  { day: "Araw 03", title: "Recovery reset", text: "Mobility, breathwork, at low-intensity na galaw sa pagitan ng mabibigat na araw." },
  { day: "Araw 04", title: "Functional training", text: "Gamitin ang kalidad ng galaw sa isang iba-iba at naii-scale na group session." },
  { day: "Weekend", title: "Endurance base", text: "Magaan na aerobic work paikot sa running loop, ayon sa pace ng level mo." },
];

export const HYROX_STATIONS: Localized<typeof EN.HYROX_STATIONS> = [
  { id: "skierg", name: "SkiErg", volume: "1,000 m", focus: "Full-body cardio na nakatuon sa lats, core at binti.", standard: "Resistance ng makina" },
  { id: "sled-push", name: "Sled Push", volume: "50 m", focus: "Pasabog na lakas ng binti at lower-body power sa apat na tig-12.5 metrong length.", standard: "102–202 kg · depende sa division" },
  { id: "sled-pull", name: "Sled Pull", volume: "50 m", focus: "Pagsubok sa posterior chain at grip, hinihila ang sled nang salitan ang kamay sa apat na length.", standard: "78–153 kg · depende sa division" },
  { id: "burpee-broad-jumps", name: "Burpee Broad Jumps", volume: "80 m", focus: "Tuloy-tuloy na chest-to-floor burpees na may kasunod na broad jump pasulong.", standard: "Bodyweight" },
  { id: "row", name: "Rowing", volume: "1,000 m", focus: "Full-body cardiovascular endurance sa isang standard na indoor rower.", standard: "Resistance ng makina" },
  { id: "farmers-carry", name: "Farmer’s Carry", volume: "200 m", focus: "Mabibigat na bitbit sa bawat kamay para sa grip, postura at lakas ng core.", standard: "16–32 kg bawat kamay · depende sa division" },
  { id: "sandbag-lunges", name: "Sandbag Lunges", volume: "100 m", focus: "Walking lunges na may sandbag na nakapatong sa itaas na likod at balikat.", standard: "10–30 kg · depende sa division" },
  { id: "wall-balls", name: "Wall Balls", volume: "100 reps", focus: "Malalalim na squat papunta sa pasabog na overhead throw sa isang nakapirming target sa pader.", standard: "4–9 kg na bola · 9–10 ft na target" },
];

export const HYROX_SOURCE_LINKS: Localized<typeof EN.HYROX_SOURCE_LINKS> = [
  { label: "HYROX station guide ng Red Bull (Ingles)", href: "https://www.redbull.com/int-en/hyrox-exercise-stations-guide" },
];

export const CLASS_FILTERS: readonly { value: "all" | ClassFilter; label: string }[] = [
  { value: "all", label: "Lahat ng class" },
  { value: "beginner", label: "Swak sa baguhan" },
  { value: "strength", label: "Strength" },
  { value: "conditioning", label: "Conditioning" },
  { value: "endurance", label: "Endurance" },
  { value: "recovery", label: "Recovery" },
  { value: "one-to-one", label: "1:1 coaching" },
];

const COACH_TBA = "Iaanunsyo pa ang lineup ng mga coach";
const CLASS_ACCESS = "Athlete membership o class pass";

export const CLASS_PREVIEW: readonly ClassPreview[] = [
  {
    id: "sunrise-strength",
    title: "Sunrise Strength",
    programmeSlug: "strength-conditioning",
    programme: "Strength & Conditioning",
    goal: "I-progress ang mga pangunahing lift at bumuo ng lakas na magagamit mo.",
    intensity: "4 / 5",
    level: "Lahat ng level",
    duration: "60 min",
    coach: COACH_TBA,
    area: "Strength area",
    equipment: "Racks, barbells, at free weights",
    access: CLASS_ACCESS,
    availability: "at-launch",
    filters: ["strength", "beginner"],
  },
  {
    id: "basecamp-conditioning",
    title: "BaseCamp Conditioning",
    programmeSlug: "functional-training",
    programme: "Functional Training",
    goal: "Palakihin ang work capacity sa iba-iba at naii-scale na galaw.",
    intensity: "3 / 5",
    level: "Lahat ng level",
    duration: "50 min",
    coach: COACH_TBA,
    area: "Main training floor",
    equipment: "Rigs, cardio, at functional kit",
    access: CLASS_ACCESS,
    availability: "at-launch",
    filters: ["conditioning", "beginner"],
  },
  {
    id: "engine-room",
    title: "Engine Room",
    programmeSlug: "endurance",
    programme: "Endurance",
    goal: "Pagandahin ang pacing at ang aerobic output na kaya mong ulitin.",
    intensity: "4 / 5",
    level: "Intermediate pataas",
    duration: "45 min",
    coach: COACH_TBA,
    area: "Running loop at training floor",
    equipment: "Running loop, sleds, at cardio stations",
    access: CLASS_ACCESS,
    availability: "at-launch",
    filters: ["conditioning", "endurance"],
  },
  {
    id: "hyrox-race-lab",
    title: "HYROX Race Lab",
    programmeSlug: "endurance",
    programme: "Endurance",
    goal: "I-practice ang running transitions at lahat ng walong race station nang kontrolado ang pacing.",
    intensity: "4 / 5",
    level: "Intermediate pataas",
    duration: "60 min",
    coach: COACH_TBA,
    area: "Running loop at training floor",
    equipment: "SkiErg, sleds, rower, kettlebells, sandbags, at wall balls",
    access: CLASS_ACCESS,
    availability: "at-launch",
    filters: ["conditioning", "endurance"],
  },
  {
    id: "mobility-reset",
    title: "Mobility Reset",
    programmeSlug: "recovery-mobility",
    programme: "Recovery & Mobility",
    goal: "Ibalik ang kalidad ng galaw sa pagitan ng mabibigat na session.",
    intensity: "1 / 5",
    level: "Swak sa baguhan",
    duration: "45 min",
    coach: COACH_TBA,
    area: "Recovery level",
    equipment: "Mats, bands, at mobility tools",
    access: "Membership, recovery credit, o class pass",
    availability: "at-launch",
    filters: ["recovery", "beginner"],
  },
  {
    id: "personal-assessment",
    title: "Personal Assessment",
    programmeSlug: "personal-coaching",
    programme: "Personal Coaching",
    goal: "Magtakda ng baseline at bumuo ng sariling training plan.",
    intensity: "Indibidwal",
    level: "Lahat ng level",
    duration: "60 min",
    coach: "Kukumpirmahin pa ang itatalagang coach",
    area: "Coaching at assessment area",
    equipment: "Movement at performance assessment tools",
    access: "Naka-book na coaching appointment",
    availability: "at-launch",
    filters: ["one-to-one", "beginner"],
  },
];

export const CLASS_RHYTHM_PREVIEW: Localized<typeof EN.CLASS_RHYTHM_PREVIEW> = [
  { id: "sunrise", window: "Madaling-araw", title: "Sunrise strength at conditioning", note: "Bago uminit" },
  { id: "open", window: "Tanghali", title: "Open gym at 1:1 coaching", note: "Sariling training at private training" },
  { id: "recovery", window: "Sa appointment", title: "Recovery at mobility", note: "Mag-book ng guided reset" },
  { id: "evening", window: "Gabi", title: "Team conditioning", note: "Group sessions na pinangungunahan ng coach" },
  { id: "weekend", window: "Weekend", title: "Endurance sessions", note: "Mas mahabang outdoor work" },
];

export const CLASS_FAQ: Localized<typeof EN.CLASS_FAQ> = [
  { question: "Kailangan ko ba ng karanasan?", answer: "Hindi. Malinaw na naka-label ang mga session na swak sa baguhan, at ini-scale ng mga coach ang galaw, load, at pace ayon sa atletang nasa harap nila." },
  { question: "Gaano katagal ang mga class?", answer: "Karamihan ng launch classes ay planong 45 hanggang 60 minuto. Makikita ang final na tagal sa bawat class bago magbukas ang booking." },
  { question: "Ano ang dapat kong dalhin?", answer: "Magsuot ng komportableng training clothes at angkop na sapatos. May ibibigay na equipment para sa bawat class; ikaw ang bahala sa tubig at anumang personal supports." },
  { question: "Kailangan ko bang mag-book nang maaga?", answer: "Kailangang mag-book nang maaga para sa coached classes, appointments, at recovery sessions. Ang open-gym access ay susunod sa access rules ng membership o pass mo." },
  { question: "Aling membership ang may kasamang class?", answer: "Depende sa class. Nakasaad sa bawat listing kung kasama ito sa membership, gumagamit ng class pass, o kailangan ng hiwalay na appointment." },
  { question: "Paano kung puno na ang class?", answer: "Kapag live na ang booking, may waitlist ang mga punong class. Aabisuhan ang mga member kapag may nabakanteng slot." },
];

/* ---------- /programs: shared sections ---------- */

export const MODALITY_FILTERS: { value: "all" | Modality["category"]; label: string }[] = [
  { value: "all", label: "Lahat" },
  { value: "train", label: "Train" },
  { value: "outdoor", label: "Outdoor at tubig" },
  { value: "mind-body", label: "Mind-body" },
  { value: "recovery", label: "Recovery" },
];

export const MODALITY_REASONS: Localized<typeof EN.MODALITY_REASONS> = [
  { id: "appeal", title: "Mas malawak na appeal", description: "Ang magkasintahan at mga grupong may iba't ibang hilig ay may kanya-kanyang programming na magugustuhan." },
  { id: "stays", title: "Mas mahabang pananatili", description: "Dahil sa variety, hindi nakakasawa: puwedeng manatili nang ilang linggo nang hindi umuulit." },
  { id: "cross-training", title: "Benepisyo ng cross-training", description: "Nakikinabang ang mga CrossFitter sa yoga; gumagaling ang mga runner sa strength work." },
  { id: "positioning", title: "Kakaibang posisyon", description: "Kilala ang Phuket sa fight sports. Ang Bali sa yoga at surf. Ang CamSur ay bumubuo para sa multi-sport athleticism." },
];

export const FUSION_CHIPS: Localized<typeof EN.FUSION_CHIPS> = ["Hard / soft", "Mainit / malamig", "Mabilis / mabagal", "Sama-sama / solo"];

export const TESTING_LAB: Localized<typeof EN.TESTING_LAB> = {
  title: "Performance Testing Lab",
  availability: "planned" as Availability,
  description: "VO2 testing, InBody scanning, grip dynamometer, mobility assessment tools at data tracking na lumilikha ng baseline data para sa bawat guest.",
  cta: { label: "Mag-register ng interes sa testing", href: "/contact?interest=performance-testing" },
};

export const PERSONALISATION: Localized<typeof EN.PERSONALISATION> = [
  { id: "hrv", title: "HRV tracking", description: "Araw-araw na morning readiness: mabibigat na session kapag fresh, recovery kapag ubos." },
  { id: "sleep", title: "Sleep cycle analysis", description: "Sleep tracking gamit ang wearable, at ina-adjust ang training load kapag kulang sa tulog." },
  { id: "stress", title: "Stress mapping", description: "Mga check-in na sinamahan ng HRV, resting heart rate at kalidad ng tulog, may breathwork kapag mataas ang stress." },
  { id: "form", title: "Form analytics cameras", description: "AI movement analysis para makita kapag nasisira ang form dahil sa pagod at para subaybayan ang technique sa bawat session." },
  { id: "load", title: "Matalinong load progression", description: "Progression ng bigat at volume na ginagabayan ng iyong performance data at kakayahang mag-recover." },
  { id: "wearables", title: "Wearable integration", description: "Apple Watch, Garmin, Whoop sa iisang dashboard. Sa mga guest ang kanilang data at puwede nila itong i-export." },
];
export const PERSONALISATION_CLOSING: Localized<typeof EN.PERSONALISATION_CLOSING> = "Bawat guest ay umuuwing mas matalino, hindi lang mas masaya.";

export const MINDSET_INTRO: Localized<typeof EN.MINDSET_INTRO> = "Kulang ang physical training kung walang mental training.";
export const MINDSET: Localized<typeof EN.MINDSET> = [
  { id: "focus", title: "Focus training", description: "Istrukturadong attention drills habang nagwo-workout at meditation practice na nagpapatalas ng konsentrasyon kahit maraming distraction." },
  { id: "decisions", title: "Pagdedesisyon kahit pagod", description: "Cognitive tasks at mabilisang pag-iisip na challenge sa mga rest interval, para sa focus sa mga mahahalagang sandali." },
  { id: "visualisation", title: "Visualization work", description: "Ginagabayang imagery bago ang mabibigat na workout at mental rehearsal ng mga sitwasyon sa kompetisyon." },
  { id: "sessions", title: "Ginagabayang mindset sessions", description: "Group workshops tungkol sa growth mindset, self-talk, stress reframing, goal-setting at kumpiyansa." },
];

export const COACHES_PLACEHOLDER: Localized<typeof EN.COACHES_PLACEHOLDER> = {
  title: "Kilalanin ang mga coach: iaanunsyo ang lineup bago ang pagbubukas.",
  body: "Coaching philosophy: progressive overload, periodization, at indibidwal na pag-unlad ng atleta.",
};

export const WELLNESS_PARTNERS: { id: string; title: string }[] = [
  { id: "physio", title: "Mga lisensyadong physiotherapist" },
  { id: "massage", title: "Mga massage therapist" },
  { id: "nutrition", title: "Mga nutrition consultant" },
  { id: "mental", title: "Mga mental performance coach" },
];
export const PARTNER_TERMS: Localized<typeof EN.PARTNER_TERMS> = "Sa request · sa pamamagitan ng partner";

export const CORPORATE_BAND: Localized<typeof EN.CORPORATE_BAND> = {
  title: "Corporate groups at off-sites.",
  body: "Team-building at wellness off-sites na may customized na programming: para sa mga kumpanyang naghahanap ng kakaibang venue para sa team off-site, leadership development, at wellness programming na talagang nakaka-engage sa mga kalahok. Dinisenyo para sa mga grupo ang recovery infrastructure.",
  cta: { label: "Mag-inquire tungkol sa corporate groups", href: "/contact?enquiry=corporate" },
};

/* ---------- /schedule ---------- */

export const WEEKDAY_LABEL: Record<Weekday, string> = { Mon: "Lunes", Tue: "Martes", Wed: "Miyerkules", Thu: "Huwebes", Fri: "Biyernes", Sat: "Sabado", Sun: "Linggo" };

export const SLOT_CATEGORY_LABEL: Record<TimetableSlot["category"], string> = {
  sunrise: "☀ Madaling-araw", class: "Class", "open-gym": "Open gym", private: "Private", evening: "Gabi", night: "☾ Night", recovery: "Recovery",
};
export const SLOT_STATUS_LABEL: Record<TimetableSlot["status"], string> = { tba: "TBA", "invite-only": "Imbitasyon lang", open: "Bukas", full: "Puno · Sumali sa waitlist" };
export const TIMETABLE_CAPTION: Localized<typeof EN.TIMETABLE_CAPTION> = "Inaayos pa ang mga oras habang nagbubukas kami: nagdadagdag ng session sa mga oras na maraming gustong mag-train.";

export const NIGHT_ELEMENTS: Localized<typeof EN.NIGHT_ELEMENTS> = [
  { id: "lighting", title: "Stadium lighting sa tabi ng lawa", description: "Sports lighting sa buong running loop, training zones, at tabing-lawa: sapat ang liwanag para sa kaligtasan, sapat ang drama para sa atmospera.", availability: "planned" },
  { id: "night-games", title: "Night Games (HYROX-style)", description: "Lingguhang kompetisyon sa ilalim ng ilaw, may team competitions, manonood, at leaderboards.", availability: "planned" },
  { id: "fnl", title: "Friday Night Lights (CrossFit-style)", description: "Isang signature weekly event na may scaled divisions at salu-salo pagkatapos.", availability: "planned" },
  { id: "heat", title: "Iwas sa init ng tag-araw", description: "Mag-train nang todo nang walang init ng araw sa hapon.", availability: "planned" },
  { id: "music", title: "Musika + ilaw + crowd", description: "DJ sets, light shows na sabay sa workout, welcome ang mga manonood.", availability: "planned" },
];

export const EVENT_KIND_GROUPS: { kind: CalendarEvent["kind"]; label: string }[] = [
  { kind: "launch", label: "Pagbubukas" },
  { kind: "festival", label: "Mga festival" },
  { kind: "competition", label: "Mga kompetisyon" },
  { kind: "workshop", label: "Mga workshop" },
  { kind: "camp", label: "Mga camp" },
  { kind: "community", label: "Komunidad" },
];

export const PLATFORM_CARDS: Localized<typeof EN.PLATFORM_CARDS> = [
  { id: "booking", title: "Booking ng class at pasilidad", description: "Reservation para sa daily classes, open gym slots at access sa pasilidad." },
  { id: "membership", title: "Membership management", description: "Subscriptions, bayad at komunikasyon sa member sa iisang lugar." },
  { id: "camps", title: "Camp reservations", description: "Booking para sa multi-day training camps at travel packages." },
  { id: "tracking", title: "Performance tracking", description: "I-log ang workouts, subaybayan ang progreso at tingnan ang pag-improve mo sa paglipas ng panahon." },
];
export const PLATFORM_COMING_SOON: Localized<typeof EN.PLATFORM_COMING_SOON> = ["Member app", "Online payments (cards, digital wallets, multi-currency)", "SMS reminders", "Virtual classes", "Daily WOD preview"];

/** Booking cover note: same parameters as the English helper; returns the Filipino text. */
export const bookingNote: (...args: Parameters<typeof EN.bookingNote>) => string = (paymentsLive: boolean) => paymentsLive
  ? "Kinukumpirma ng aming team ang mga request sa email o telepono. Puwede nang bayaran online ang memberships, passes at camps mula sa price guide."
  : "Kinukumpirma ng aming team ang mga request sa email o telepono. Malapit na ang online payment at instant confirmation.";
