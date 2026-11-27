// Filipino (Taglish) draft of src/content/defaults.ts: human-readable text only.
// Ids, slugs, hrefs, images, prices, enum values, dates and booleans are never changed; items carry their `id`
// (or `slug`, plus array position, for programmes) so the merge can match them. See ./GLOSSARY.md for term choices.
import type { SiteContent } from "@/content/types";
import { DEFAULT_CONTENT } from "@/content/defaults";
import { FEATURED_PROGRAMMES } from "./data/featured-programmes";

export type DeepPartial<T> = T extends (infer U)[] ? DeepPartial<U>[] : T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

// ---------- timetable (generated from a seeded pool in defaults.ts, so translated by English title/time) ----------
const SLOT_TITLE: Record<string, string> = {
  "Sunrise session: coached group class": "Madaling-araw na session: group class na may coach",
  "Sunrise HYROX-style stations": "HYROX-style stations sa madaling-araw",
  "Sunrise run club: outdoor loop": "Run club sa madaling-araw: outdoor loop",
  "Foundations on-ramp": "Foundations on-ramp para sa baguhan",
  "Open gym: athlete hours": "Open gym: oras ng mga atleta",
  "Stretch & mobility deck": "Stretch at mobility deck",
  "Ice bath + sauna circuit": "Ice bath + sauna circuit",
  "Evening session: coached group class": "Panggabing session: group class na may coach",
  "HYROX-style evening stations": "HYROX-style stations sa gabi",
  "Strength & conditioning": "Strength at conditioning",
  "Friday Night Lights (CrossFit-style)": "Friday Night Lights (CrossFit-style)",
};
const SLOT_TIME: Record<string, string> = {
  "Early morning (time TBA)": "Madaling-araw (oras: TBA)",
  "Midday (time TBA)": "Tanghali (oras: TBA)",
  "Afternoon (time TBA)": "Hapon (oras: TBA)",
  "Evening (time TBA)": "Gabi (oras: TBA)",
};
const timetable = DEFAULT_CONTENT.schedule.timetable.map(({ id, title, time }) => ({
  id, title: SLOT_TITLE[title] ?? title, time: SLOT_TIME[time] ?? time,
}));

// Shared rows (same ids in home.rhythm.dayRhythm and schedule.rhythm).
const dayRhythm = [
  { id: "morning", title: "Mga class sa umaga", body: "Mga session sa madaling-araw, bago uminit." },
  { id: "open-gym", title: "Mga oras ng open gym", body: "Istrukturadong kalayaan para sa mga seryosong atleta." },
  { id: "private", title: "Mga private session", body: "1:1 coaching at mga recovery appointment." },
  { id: "evening", title: "Panggabing programming", body: "Mga class at night training sa ilalim ng ilaw." },
];

// Programme "spaces" labels (matched by position within each programme).
const sp = {
  arrival: { label: "Pagdating at pagsalubong" },
  training: { label: "Mga training zone" },
  running: { label: "Running loop" },
  recovery: { label: "Recovery" },
  social: { label: "Social at lounge" },
};

// Outcome / assessment-category labels: one wording everywhere so lists stay consistent.
const O = {
  strength: "Dagdag na lakas",
  hyrox: "Mas mabilis na HYROX time",
  vo2: "Mas mataas na VO2",
  body: "Body composition",
  hrv: "Stress + HRV",
  sleep: "Kalidad ng tulog",
  baseline: "Mobility + strength baseline",
};

/** Draft Filipino translations — to be reviewed by a native speaker. Arrays of objects are matched by item `id` (or by index when items have no id). */
export const filContent: DeepPartial<SiteContent> = {
  // ---------- settings ----------
  settings: {
    contact: { hours: "Iaanunsyo pa ang oras ng operasyon" },
    founding: {
      title: "Founding members",
      summary: "Limitado lang para sa mga unang founding member: proposed na tipid na humigit-kumulang 29% sa unang anim na buwan mo, o lifetime alumni rate na naka-lock na habambuhay.",
      example: "Halimbawa: Athlete founding rate na Php 3,200/buwan (standard ay Php 4,500).",
      benefits: [
        "Founding rate: proposed na tipid na humigit-kumulang 29% sa unang anim na buwan mo, o naka-lock na lifetime alumni rate",
        "Priority access sa mga camp, workshop, at special event",
        "Pagkilala bilang bahagi ng founding community",
        "Isang eksklusibong launch event",
      ],
      ctaLabel: "Maging early member",
    },
  },

  // ---------- home ----------
  home: {
    rhythm: {
      eyebrow: "Paraan ng pag-train", title: "Hanapin ang\ntraining rhythm mo.",
      intro: "Mga class sa umaga, open gym, private session, at panggabing programming: piliin ang landas na bagay sa paraan mo ng pag-train.",
      paths: [
        { id: "local", title: "Lokal na atleta", who: "CamSur at Bicol", cadence: "4–6 na session kada linggo", offer: "Monthly membership at class pack", body: "Koneksyon sa komunidad at expert coaching, linggo-linggo.", link: { label: "Tingnan ang memberships" } },
        { id: "manila", title: "Biyahero mula Manila at iba pang lugar sa bansa", who: "Weekend escape", cadence: "Weekend, 3D/2N na camp o 1-linggong programa", offer: "Camp package, drop-in at weekly pass", body: "Takasan ang siyudad, mag-train nang todo, mag-recover nang tama.", link: { label: "Tingnan ang mga camp" } },
        { id: "international", title: "International sports tourist", who: "Timog-Silangang Asya at higit pa", cadence: "Ilang araw na pananatili", offer: "Multi-day package", body: "Adventure na sulit ikuwento, kasama ang seryosong training.", link: { label: "Planuhin ang biyahe mo" } },
      ],
      dayRhythm,
      linkLabel: "Tingnan ang lahat ng programa",
    },
    completeSystem: {
      eyebrow: "Ang kumpletong sistema", title: "Train. Transform. Thrive.",
      intro: "Hindi ito tatlong magkakahiwalay na alok: iisang sistema ito kung saan pinalalakas ng bawat bahagi ang iba.",
      pillars: [
        { id: "train", theme: "Performance", subtitle: "Lakas at Engine", bullets: ["Functional fitness programming", "HYROX-style na paghahanda", "Endurance conditioning", "Competition training"], link: { label: "Tingnan ang mga class" } },
        { id: "transform", theme: "Recovery", subtitle: "Wellness at Longevity", bullets: ["Contrast therapy protocols", "Masahe at bodywork", "Iba't ibang therapy zone", "Mobility work"], link: { label: "Tingnan ang recovery" } },
        { id: "thrive", theme: "Lifestyle", subtitle: "Komunidad at Pagkakabilang", bullets: ["Social spaces at café", "Mga workshop at event", "Yoga at movement", "Pangmatagalang samahan"], link: { label: "Ang aming kuwento" } },
      ],
      closing: "Ang training ay lumilikha ng pangangailangan sa recovery. Ang recovery ay nagbibigay-daan sa mas magandang training. Pareho silang nagbubukas ng pagkakataon para sa komunidad. At ang komunidad ang nagtutulak ng commitment at pangmatagalang pakikilahok.",
    },
    stats: {
      title: "Nakabaon sa lupa. Hindi lang sa brand.",
      intro: "Sadyang bukas at kita ang mga training space: isang training ecosystem kung saan ipinagdiriwang ang effort at nabubuo ang komunidad sa sama-samang pagsisikap.",
      items: [
        { id: "sqm", label: "Metro kuwadrado", detail: "Nakalaang outdoor training facility" },
        { id: "zones", label: "Magkakaibang zone", detail: "CrossFit-style, strength at cardio area" },
        { id: "floor", label: "Wellness level", detail: "Isang buong palapag para sa recovery" },
        { id: "modalities", label: "Recovery modalities", detail: "Kumpletong recovery ecosystem, unti-unting ilulunsad" },
      ],
      cta: { label: "Tingnan ang pasilidad" },
    },
    differentiators: {
      eyebrow: "Bakit BaseCamp", title: "Hindi gym. Hindi resort. Bagong kategorya.",
      intro: "Ang Performance Playground ng Timog-Silangang Asya: nakatuon sa resulta, pero masaya.",
      items: [
        { id: "prove-results", title: "Patunayan ang resulta", body: "Nakabatay sa resulta, hindi lang sa karanasan: baseline testing pagdating mo at reassessment bago ka umalis.", link: { label: "Alamin pa" } },
        { id: "recovery-forward", title: "Recovery-forward", body: "Kasinghalaga ng training ang recovery. Sa recovery nangyayari ang adaptation, hindi habang nagte-train.", link: { label: "Alamin pa" } },
        { id: "own-the-night", title: "Angkinin ang gabi", body: "Lingguhang training sa ilalim ng ilaw: Night Games, Friday Night Lights at night runs.", link: { label: "Alamin pa" } },
        { id: "competition", title: "Tuloy-tuloy na kompetisyon", body: "Laging may pinaghahandaan, laging may leaderboard na aakyatin, laging may hamong susubukan.", link: { label: "Alamin pa" } },
        { id: "food", title: "Performance food", body: "Hindi lang masarap ang pagkaing Pinoy: performance fuel din ito.", link: { label: "Alamin pa" } },
        { id: "multi-sport", title: "Multi-sport village", body: "Ang kauna-unahang Multi-Sport Training Village sa Timog-Silangang Asya: puwede kang manatili nang ilang linggo nang hindi umuulit ng session.", link: { label: "Alamin pa" } },
      ],
    },
    afterDark: {
      eyebrow: "Pagsapit ng dilim", title: "Angkinin ang gabi.",
      body: "Ilaw sa tabi ng lawa, musika, at enerhiyang parang concert, habang nagte-train ang mga atleta sa ilalim ng mga bituin. Mag-train nang todo nang walang init ng araw sa hapon.",
      highlights: ["Night Games (HYROX-style) · lingguhan", "Friday Night Lights (CrossFit-style) · lingguhan", "Night runs · lingguhan"],
      cta: { label: "Tingnan ang night programming" },
    },
    recoveryTeaser: {
      eyebrow: "Transform", title: "Ang recovery ay imprastraktura.",
      body: "Hindi dagdag na amenity lang ang recovery. Nagbibigay ang BaseCamp ng mga pasilidad at espasyo para maka-recover ang mga atleta sa parehong intensity ng pag-train nila: isang biohacking playground para sa mga atleta.",
      cta: { label: "Tingnan ang recovery" },
    },
    dayFlow: {
      title: "Isang araw sa BaseCamp.",
      steps: [
        { id: "arrive", title: "Dumating at kumonekta", body: "Dumating nang maaga, kilalanin ang mga kasama mo." },
        { id: "train", title: "Mag-train nang may layunin", body: "May coach, may programa, may direksyon." },
        { id: "recover", title: "Mag-recover nang tama", body: "Lamig, init, mobility, pahinga." },
        { id: "refuel", title: "Mag-refuel at makipagkuwentuhan", body: "Performance food at mahahabang kuwentuhan." },
      ],
      quote: "Ang pinagkaiba ng pasilidad at ng destinasyon ay ang tagal ng pananatili. Sa BaseCamp, hindi nagmamadali ang mga tao na mag-workout at umalis: maaga silang dumarating, late umuuwi, nakikipag-ugnayan sa iba, at bumubuo ng samahan.",
    },
    pricingTeaser: {
      eyebrow: "Membership", title: "Malinaw mula unang araw.",
      intro: "Walang itinatagong impormasyon. Naka-lock ang launch rates ng mga early member.",
      cta: { label: "Tingnan ang buong presyo" },
    },
    personas: {
      eyebrow: "Para kanino", title: "Para sa mga atleta, baguhan, at biyahero.",
      items: [
        { id: "local", title: "Lokal na fitness community", body: "Mga taga-CamSur na naghahanap ng world-class na training facility at propesyonal na coaching.", link: { label: "Memberships" } },
        { id: "domestic", title: "Mga fitness enthusiast mula sa ibang bahagi ng bansa", body: "Mga Pilipinong atleta mula Manila at iba pang siyudad na naghahanap ng training destination para sa weekend, training camp, at mas mahabang bisita.", link: { label: "Mga camp at weekend" } },
        { id: "international", title: "International camps", body: "Mga fitness community mula sa iba't ibang bansa na nag-oorganisa ng training camp at group trip.", link: { label: "Group camps" } },
        { id: "corporate", title: "Corporate wellness", body: "Mga kumpanyang naghahanap ng kakaibang venue para sa team off-site, leadership development, at wellness programming na talagang nakaka-engage sa mga kalahok.", link: { label: "Corporate off-sites" } },
        { id: "nomads", title: "Digital nomads", body: "Mga remote worker na naghahanap ng lugar na sumusuporta sa trabaho at fitness, at nananatili nang matagal.", link: { label: "Long stays" } },
      ],
    },
    whyCamsur: { eyebrow: "Bakit CamSur", cta: { label: "Planuhin ang pagbisita mo" } },
    founders: { eyebrow: "Bisyon ng mga founder", cta: { label: "Basahin ang aming kuwento" } },
    build: {
      eyebrow: "Itinatayo mula sa simula", title: "Magbubukas sa CamSur.", intro: "Malinaw ang bisyon. Tuloy-tuloy ang pagsasakatuparan.",
      liveTitle: "Bukas na ang BaseCamp.", liveBody: "Bukas na ang pinto. Mag-request na ng una mong session ngayon.",
    },
    events: { eyebrow: "Mga ganap", title: "Mga camp, workshop at event.", intro: "Mga dahilan para sumali ngayon, at mga dahilan para bumalik.", cta: { label: "Buong kalendaryo" } },
    testimonials: { title: "Mula sa komunidad." },
    earlyAccess: {
      eyebrow: "Early access", title: "Train. Transform. Thrive.",
      body: "Sumali sa early access list: early-member rates, eksklusibong updates, at priority access.",
      benefits: ["Early-member rates", "Eksklusibong updates sa pagtatayo at pagbubukas", "Priority access sa mga camp at event"],
    },
  },

  // ---------- programmes ----------
  programmes: {
    intro: "Ang training sa BaseCamp ay hindi lang tungkol sa access sa equipment: tungkol ito sa propesyonal na programming, expert coaching, at isang kapaligirang sadyang dinisenyo para itulak pa ang performance mo.",
    tagline: "Hindi niche: bagong kategorya.",
    featured: FEATURED_PROGRAMMES,
    disciplines: [
      { id: "functional", title: "Functional fitness programming", description: "CrossFit-style na training na may palaging nag-iibang functional movements na ginagawa nang high intensity, para palakihin ang work capacity sa iba't ibang haba ng oras at uri ng galaw." },
      { id: "hyrox", title: "HYROX-inspired na endurance", description: "Hybrid fitness programming na pinagsasama ang functional strength at endurance cardio, para ihanda ang mga atleta sa kompetisyon at bumuo ng matibay na conditioning." },
      { id: "zones", title: "Indoor + outdoor na training zones", description: "Mula sa mga climate-controlled na functional training area hanggang sa malalawak na outdoor zone sa ilalim ng tropikal na langit." },
      { id: "coaching", title: "Pinangungunahan ng coach, atleta ang inuuna", description: "Bawat programa ay pinapatakbo ng mga bihasang coach na nakakaintindi ng progressive overload, periodization, at indibidwal na pag-unlad ng atleta." },
      { id: "commercial", title: "Commercial gym area", description: "Nakalaang espasyo para sa aesthetics at physique training, para sa bodybuilding at mga tradisyonal na gym-goer, kasabay ng functional fitness programming." },
    ],
    // Matched by position (programmes have a slug, not an id); slugs are listed only as a matching aid.
    programmes: [
      {
        slug: "crossfit-group", title: "CrossFit-style na group training", level: "Lahat ng level: naii-scale ang bawat session", format: "Group class na may coach",
        summary: "Mga coached group session sa outdoor at semi-covered na zone, para sa kahit anong panahon.",
        whatToExpect: "Palaging nag-iibang functional movements sa high intensity. Ini-scale ng mga coach ang bawat galaw at load para mapili mo ang tamang session para sa level mo.",
        whoFor: ["Mga lokal na atletang nagte-train nang 4–6 na session kada linggo", "Mga bagong member pagkatapos ng Foundations on-ramp", "Mga bisitang gusto ng session na may coach"],
        outcomes: [O.strength, O.vo2, O.body],
        spaces: [sp.training, sp.running],
      },
      {
        slug: "hyrox", title: "HYROX-style na training zone", level: "Intermediate pataas (naii-scale)", format: "Coached group at open training",
        summary: "Nakalaang espasyo na may mga sled, running loop, at competition-standard na stations.",
        whatToExpect: "Istrukturadong preparation cycles para sa hybrid fitness competitions: functional strength stations na sinamahan ng running at endurance work.",
        whoFor: ["Mga atletang naghahanda para sa HYROX-style na karera", "Mga hybrid athlete na nagpapalaki ng engine"],
        outcomes: [O.hyrox, O.vo2],
        spaces: [sp.training, sp.running],
      },
      {
        slug: "open-gym", title: "Open gym / athlete hours", level: "Mga bihasang atleta", format: "Sariling diskarte",
        summary: "Para sa mga seryosong indibidwal na mas gusto ang istrukturadong kalayaan.",
        whatToExpect: "Open access sa rigs, platforms, cardio at strength equipment sa mga oras na may staff, para patakbuhin ang sarili mong programa.",
        whoFor: ["Mga atletang sumusunod sa sarili nilang programa", "Mga biyaherong gustong tuloy-tuloy ang training"],
        outcomes: [O.strength],
        spaces: [sp.training],
      },
      {
        slug: "commercial-gym", title: "Commercial gym", level: "Lahat ng level", format: "Sariling diskarte",
        summary: "Tradisyonal na strength equipment, cardio machines, at accessory zones para sa aesthetics, physique at sariling programming.",
        whatToExpect: "Bodybuilding at tradisyonal na gym training kasabay ng functional fitness.",
        whoFor: ["Mga bodybuilding at physique athlete", "Mga tradisyonal na gym-goer"],
        outcomes: [O.strength, O.body],
        spaces: [sp.training],
      },
      {
        slug: "outdoor-running", title: "Outdoor training at running loop", level: "Lahat ng level", format: "May coach at sariling diskarte",
        summary: "673 metro kuwadradong outdoor training space at tuloy-tuloy na running loop na kaisa ng kalikasan.",
        whatToExpect: "Sprint work, sled push, carries at large-group programming sa tropikal na kondisyon, sa iba't ibang uri ng terrain.",
        whoFor: ["Mga runner at endurance athlete", "Sinumang mas gustong mag-train sa labas kaysa sa gym sa mall"],
        outcomes: [O.vo2, O.hrv],
        spaces: [sp.training, sp.running],
      },
      {
        slug: "foundations", title: "Foundations on-ramp para sa baguhan", level: "Baguhan", format: "Small-group na foundation course",
        summary: "Isang foundation course para sa mga bagong member. Welcome ang lahat.",
        whatToExpect: "Ituturo namin ang mga pangunahing galaw, susubaybayan ang pagkumpleto mo, susuriin kung handa ka na, at ililipat ka sa regular na class kapag handa ka na. Iaanunsyo sa launch ang detalye ng trial class.",
        whoFor: ["Mga bago sa fitness", "Sinumang bumabalik sa training"],
        outcomes: [O.baseline],
        spaces: [sp.training, sp.arrival],
      },
      {
        slug: "ice-sauna", title: "Ice bath + sauna", level: "Lahat ng level", format: "Sariling recovery",
        summary: "Ice bath at sauna, hiwalay sa intensity ng training.",
        whatToExpect: "Contrast protocols mula cold plunge, papunta sa init, hanggang pahinga. Gawing sistematiko ang recovery, hindi basta-basta.",
        whoFor: ["Sinumang nagte-train nang matindi", "Mga bisita sa camp at may day pass"],
        outcomes: [O.hrv, O.sleep],
        spaces: [sp.recovery],
      },
      {
        slug: "mobility-deck", title: "Stretch at mobility deck", level: "Lahat ng level", format: "Open at may gabay",
        summary: "Isang nakalaang deck para sa stretching, mobility work, at recovery protocols.",
        whatToExpect: "Foam roller, massage gun, resistance band, mat, at yoga props.",
        whoFor: ["Bawat atleta, araw-araw"],
        outcomes: [O.baseline],
        spaces: [sp.recovery],
      },
      {
        slug: "massage-physio", title: "Masahe at physio", level: "Sa appointment", format: "1:1 (sa pamamagitan ng partner)",
        summary: "Mga lisensyadong physiotherapist at massage therapist, sa pamamagitan muna ng mga partner.",
        whatToExpect: "60-minutong session na nabu-book sa request.",
        whoFor: ["Mga atletang nagma-manage ng training load", "Mga kalahok sa camp"],
        outcomes: [],
        spaces: [sp.recovery],
      },
      {
        slug: "therapy-zones", title: "Mga therapy zone", level: "Lahat ng level", format: "Sariling diskarte",
        summary: "Iba't ibang therapy zone para sa recovery sa pagitan ng mga session.",
        whatToExpect: "Itinuturing na core programming ang recovery, hindi opsyonal na dagdag.",
        whoFor: ["Sinumang nagte-train nang matindi"],
        outcomes: [O.hrv],
        spaces: [sp.recovery],
      },
      {
        slug: "wellness-consults", title: "Nutrition at mental performance consults", level: "Lahat ng level", format: "1:1 sa request (sa pamamagitan ng partner)",
        summary: "Mga nutrition consultant at mental performance coach, sa request.",
        whatToExpect: "Mga appointment sa partner specialists na nabu-book sa request.",
        whoFor: ["Mga atletang naghahanda para sa kompetisyon", "Mga kalahok sa camp"],
        outcomes: [],
        spaces: [sp.social],
      },
      {
        slug: "yoga-breathwork", title: "Mga session ng yoga at breathwork", level: "Lahat ng level", format: "Group class",
        summary: "Yoga, mobility at mind-body practices na bumabagay sa high-intensity training.",
        whatToExpect: "Naka-schedule na yoga at breathwork class.",
        whoFor: ["Mga atletang gustong gumalaw nang mas maayos", "Sinumang bago sa training"],
        outcomes: [O.hrv, O.sleep],
        spaces: [sp.social],
      },
      {
        slug: "weekend-camps", title: "Weekend intensive training camps", level: "Intermediate pataas", format: "Ilang araw na camp",
        summary: "Immersive na karanasan nang ilang araw, may tutuluyan at kumpletong programming.",
        whatToExpect: "Takasan ang siyudad, mag-train nang todo, mag-recover nang tama.",
        whoFor: ["Mga taga-Manila na pang-weekend", "Mga coach na nagdadala ng kanilang komunidad"],
        outcomes: [O.strength, O.hyrox],
        spaces: [sp.training, sp.recovery],
      },
    ],
    formats: [
      { id: "daily-classes", title: "Daily Classes", description: "CrossFit-style na group session at open gym access para sa lokal na komunidad at mga member" },
      { id: "competition-prep", title: "Competition Prep", description: "Nakalaang training tracks para sa mga atletang naghahanda para sa CrossFit competitions" },
      { id: "hyrox-programmes", title: "HYROX-style Classes", description: "Istrukturadong preparation cycles para sa hybrid fitness competitions" },
      { id: "training-camps", title: "Training Camps", description: "Immersive na karanasan nang ilang araw, may tutuluyan at kumpletong programming" },
      { id: "corporate-groups", title: "Corporate Groups", description: "Team-building at wellness off-site na may customized na programming" },
      { id: "community-comps", title: "Community Comps", description: "Regular na kompetisyon at event na nagpapalakas ng lokal na pakikilahok" },
    ],
    modalities: [
      { id: "crossfit", description: "Olympic lifting, gymnastics, metabolic conditioning" },
      { id: "hyrox", description: "Hybrid endurance racing, functional fitness competition" },
      { id: "outdoor", description: "Trail conditioning, mga circuit sa iba't ibang terrain" },
      { id: "strength", description: "Powerlifting, bodybuilding, hypertrophy training" },
      { id: "running", title: "Pagtakbo", description: "Istrukturadong training, interval work, pagpapahaba ng distansya" },
      { id: "recovery", description: "Cold plunge, sauna, compression, mobility work" },
      { id: "yoga", description: "Mobility, flexibility, mindfulness practices" },
      { id: "pilates", description: "Core strength, reformer work, stability training" },
      { id: "dance", title: "Sayaw", description: "Conditioning sa pamamagitan ng choreography, rhythm training" },
      { id: "trail-running", description: "Teknikal na terrain, pagpapalakas ng endurance" },
      { id: "paddle", title: "Paddle + Lake Sports", description: "SUP, kayaking, open water swimming" },
      { id: "swimming", title: "Paglangoy", description: "Lap swimming, technique work, open water" },
    ],
    fusion: [
      { id: "yoga-weightlifting", description: "Mobility sa umaga bago ang strength sa hapon; Yin yoga sa pagitan ng mga araw ng heavy lifting." },
      { id: "pilates-trail-running", description: "Core stability para sa mga runner, may reformer work para sa balakang at bukung-bukong." },
      { id: "dance-hyrox", description: "Masayang paraan sa seryosong conditioning. Swak sa mga naiilang sa tradisyonal na CrossFit." },
      { id: "sauna-meditation-journaling", description: "Init, katahimikan at pagninilay sa iisang session." },
      { id: "ice-breathwork-mobility", description: "Breathing practice bago ang cold plunge, tapos mobility: isang episyenteng 45-minutong session." },
      { id: "barefoot-trail-nature", title: "Barefoot Trail Runs + Nature Therapy", description: "Grounding at forest-bathing principles sa natural na terrain." },
    ],
    signatureWorkouts: [
      { id: "lake-loop", description: "Ang signature loop run namin paikot sa lawa.", when: "Detalye sa launch" },
      { id: "camsur-crucible", description: "Ang signature benchmark challenge namin.", when: "Detalye sa launch" },
      { id: "sunrise-strength", description: "Strength work sa unang liwanag, bago uminit.", when: "Madaling-araw" },
      { id: "night-games", description: "HYROX-style na kompetisyon sa ilalim ng ilaw, may leaderboards.", when: "Lingguhan, pagsapit ng dilim" },
    ],
    assessment: {
      promise: "Mga biyaheng nakabatay sa resulta, hindi lang sa karanasan. Ang layunin namin: masusukat na pag-unlad sa fitness at health markers.",
      steps: [
        { id: "vo2-lactate", title: "VO2 Max + Lactate Testing", description: "Baseline ng aerobic capacity pagdating mo." },
        { id: "body-composition", title: "Body Composition Analysis", description: "InBody scanning, may lingguhang scan para sa mas mahabang pananatili." },
        { id: "mobility-strength", title: "Mobility + Strength Baseline", description: "Functional movement screening at grip strength." },
        { id: "sleep-diagnostics", title: "Sleep Diagnostics", description: "Alamin kung paano ka nagre-recover." },
        { id: "checkout", title: "Checkout Reassessment", description: "Lahat ng metrics ay muling susukatin bago ka umalis. Makakatanggap ang mga guest ng kumpletong report ng kanilang mga improvement." },
      ],
      categories: [O.strength, O.hyrox, O.vo2, O.body, O.hrv, O.sleep],
    },
  },

  // ---------- recovery ----------
  recovery: {
    intro: "Nag-aalok ang BaseCamp CamSur ng kumpletong hanay ng recovery technologies at modalities, dinisenyo para pabilisin ang physical adaptation, patalasin ang isip, at itaguyod ang holistic na kalusugan.",
    modalities: [
      { id: "cold-plunge", title: "Cold Plunge Circuits", description: "Cold immersion sa maraming station para sa recovery pagkatapos mag-train.", detail: "Cold pools na 8–15°C na may ginagabayang breathwork. Sa launch: isang commercial ice bath para sa 4–6 na tao." },
      { id: "contrast-therapy", title: "Contrast Therapy Lanes", description: "Salitang mainit at malamig na immersion para palakasin ang sirkulasyon.", detail: "Cold plunge → sauna o hot pool → pahinga." },
      { id: "compression", title: "Compression Boots Lounges", description: "Dynamic air compression para suportahan ang daloy ng dugo at bawasan ang pananakit ng kalamnan.", detail: "Boots at sleeves, 20–30 minutong session." },
      { id: "infrared", title: "Infrared Zones", description: "Malalim at tumatagos na init para sa relaxation at muscle recovery.", detail: "Outdoor-rated na infrared sauna para sa 6–8 na tao; may planong infrared mats." },
      { id: "red-light", title: "Red Light Therapy", description: "Mga session sa LED light bed para sa recovery." },
      { id: "hyperbaric", title: "Hyperbaric Oxygen Chamber", description: "Mas maraming oxygen na naihahatid para suportahan ang recovery.", detail: "Mga session sa HBOT chamber." },
      { id: "cryotherapy", title: "Cryotherapy Chambers", description: "Whole-body exposure sa sobrang lamig na temperatura.", detail: "2–3 minutong session." },
      { id: "sauna", title: "Mga Sauna", description: "Tradisyonal na init para sa cardiovascular conditioning at malalim na relaxation.", detail: "Finnish-style na dry sauna at outdoor-rated na infrared sauna; may planong hiwalay na pasilidad para sa lalaki at babae sa wellness level." },
      { id: "mobility", title: "Mobility Studios", description: "Nakalaang espasyo at ginagabayang session para sa flexibility, range of motion at pag-iwas sa injury.", detail: "Foam roller, massage gun, resistance band." },
      { id: "breathwork", title: "Breathwork Practices", description: "Istrukturadong paghinga para i-manage ang stress, palakihin ang lung capacity at patalasin ang focus.", detail: "Box breathing, coherence training at ginagabayang protocols." },
      { id: "sleep-lab", title: "Sleep Labs", description: "Mga optimized na kapaligiran at protocol para sa mas de-kalidad at mas mahabang tulog." },
      { id: "nad-music", title: "NAD+ Music Therapy", description: "IV NAD+ na sinamahan ng piling soundscapes para sa mental restoration.", detail: "Sound healing at vibroacoustic therapy beds." },
    ],
    disclaimer: "Ang mga advanced therapy gaya ng hyperbaric oxygen, cryotherapy at NAD+ IV therapy ay nakaplano pa lang, at nangangailangan ng health screening. Kumonsulta sa iyong doktor bago gumamit. Walang anuman sa site na ito ang medical advice.",
  },

  // ---------- pricing ----------
  pricing: {
    intro: "Malinaw na presyo para sa mga lokal at biyahero. Sulit, premium, at abot-kaya para sa mga core local athlete.",
    notes: [
      "Lahat ng presyo ay nasa Philippine Peso (PHP), may tinatayang halaga sa USD sa palitang Php 58 = US$1.",
      "Puwedeng mas mataas ang drop-in at day-pass rates tuwing weekend, long weekend at peak travel season.",
      "Proposed rates: puwedeng magbago ang lahat ng presyo pagkatapos ng market testing at susuriin muli pagkalipas ng unang 90 araw.",
    ],
    groups: [
      {
        id: "memberships", title: "Monthly memberships", intro: "Proposed rates; kukumpirmahin ang final na presyo pagkatapos ng market testing.",
        items: [
          { id: "local-basic", unit: "/buwan", badge: "Entry level", description: "Sariling training para sa mga member na nagtitipid.", features: ["Unlimited open-gym access sa mga oras na may staff", "Sariling training", "Entry-level na opsyon para sa mga member na nagtitipid", "Hindi kasama ang mga coached class"] },
          { id: "athlete", unit: "/buwan", badge: "Core tier · Pinakasikat", description: "Ang pangunahing membership namin para sa mga seryosong lokal na atleta.", features: ["Lahat ng coached group class", "Unlimited open-gym access", "Programming para sa mga seryosong lokal na atleta", "Training program na nakatuon sa komunidad"] },
          { id: "premium", unit: "/buwan", badge: "All access", description: "Bawat class, open gym at buwanang recovery credits.", features: ["Lahat ng class", "Unlimited open-gym access", "4 na buwanang recovery credit: sauna, ice bath, therapy zones", "2 guest pass kada buwan", "Priority booking", "Mga eksklusibong event"] },
        ],
      },
      {
        id: "class-packs", title: "Class packs",
        items: [
          { id: "intro-5", name: "5-Class Intro Pack", perUnit: "Php 380 bawat class", validity: "Valid nang 60 araw", badge: "Para sa trial members", description: "Para sa mga trial member: subukan muna ang mga class bago mag-commit." },
          { id: "pack-10", name: "10-Class Pack", perUnit: "Php 350 bawat class", validity: "Valid nang 90 araw", badge: "Pinakasulit", description: "Para sa mga semi-regular na lokal at panandaliang bisita." },
        ],
      },
      {
        id: "day-passes", title: "Drop-in at day pass",
        items: [
          { id: "drop-in-standard", name: "Standard Drop-In", unit: "bawat session", description: "Isang training session. Puwedeng mas mataas ang presyo tuwing weekend at peak tourist season." },
          { id: "day-pass-standard", name: "Standard Day Pass", unit: "bawat araw", description: "Gym access at isang coached class. Para sa mga hotel guest at day traveler.", badge: "Swak sa day travelers" },
          { id: "day-pass-weekend", name: "Weekend Premium Pass", unit: "bawat araw", badge: "Tine-test ang Php 850 rate", description: "Sabado, Linggo, at long weekend: Php 800 ang nakalistang presyo, habang tine-test ang Php 850 na weekend rate." },
        ],
      },
      {
        id: "open-gym", title: "Open-gym-only passes",
        items: [
          { id: "gym-day", name: "Day Pass", unit: "bawat araw", badge: "Walang class", description: "Basic na open-gym at equipment access." },
          { id: "gym-week", name: "Weekly Pass", unit: "bawat linggo", badge: "Walang class", description: "Unlimited open-gym access sa loob ng pitong magkakasunod na araw." },
          { id: "gym-month", name: "Monthly Pass", unit: "bawat buwan", badge: "Walang class", description: "Unlimited open-gym access sa lahat ng oras ng operasyon." },
        ],
      },
      {
        id: "yoga", title: "Yoga", intro: "Ang mga Local Basic member ay bibili ng yoga sa single-class o pack rates.",
        items: [
          { id: "yoga-single", name: "Single Yoga Class", unit: "bawat class", description: "Kahit anong naka-schedule na yoga class. Para sa mga turista at member na sumusubok ng yoga." },
          { id: "yoga-5", name: "5-Class Yoga Pack", perUnit: "Php 700 bawat class", validity: "Valid nang 90 araw", description: "Para sa mga semi-regular na practitioner." },
          { id: "yoga-10", name: "10-Class Yoga Pack", perUnit: "Php 600 bawat class", validity: "Valid nang 120 araw", badge: "Pinakasulit na yoga rate", description: "Ang pinakamababang nakalistang rate para sa mga regular na dumadalo." },
          { id: "yoga-addon", name: "Unlimited Yoga Add-On", unit: "/buwan", badge: "Athlete at Premium", description: "Nagdadagdag ng unlimited yoga class sa Athlete o Premium membership." },
        ],
      },
      {
        id: "recovery", title: "Recovery services",
        items: [
          { id: "sauna-ice", name: "Sauna o Ice Bath", unit: "bawat session", description: "Isang beses na access sa recovery facility, para sa recovery pagkatapos mag-train." },
          { id: "massage-physio", name: "Sports Massage o Physiotherapy", unit: "bawat 60-minutong treatment", description: "Depende ang presyo sa seniority at specialization ng practitioner." },
          { id: "recovery-bundle", name: "Sauna / Ice-Bath Bundle", unit: "para sa 5 session", perUnit: "Php 400 bawat session", badge: "Tipid na Php 250 · 11%", description: "Limang session na naghihikayat ng regular na recovery: Php 250 na mas mura kaysa limang single session (Php 2,250)." },
        ],
      },
      {
        id: "advanced-recovery", title: "Advanced recovery",
        items: [
          { id: "cold-plunge", name: "Cold-Plunge Circuit", unit: "bawat session", description: "Ginagabayang cold-plunge rotation para sa mas mabilis na recovery." },
          { id: "contrast", name: "Contrast-Therapy Lanes", unit: "bawat session", description: "Salitang mainit at malamig na immersion para sa sirkulasyon at recovery." },
          { id: "compression", name: "Compression Boots", unit: "bawat 30 minuto", description: "Sumusuporta sa lymphatic drainage at muscle recovery." },
          { id: "infrared", name: "Infrared Zones", unit: "bawat session", description: "Malalim na init para sa relaxation, ginhawa sa sakit at detoxification." },
          { id: "red-light", name: "Red-Light Therapy Bed", unit: "bawat session", description: "Full-body LED therapy para sa cellular regeneration at pamamaga." },
          { id: "hyperbaric", name: "Hyperbaric Oxygen", unit: "bawat session", description: "Pressurized oxygen therapy para sa paggaling at cellular recovery." },
          { id: "cryo", name: "Cryotherapy Chamber", unit: "bawat session", description: "Exposure sa sobrang lamig para sa systemic recovery at sigla." },
        ],
      },
      {
        id: "optimisation", title: "Mind-body at performance",
        items: [
          { id: "mobility", name: "Mobility Studio", unit: "bawat session", description: "Mobility work na may gabay o sariling diskarte, gamit ang specialist equipment." },
          { id: "breathwork", name: "Breathwork Workshop", unit: "bawat workshop", description: "Respiratory training at mental-clarity work." },
          { id: "sleep", name: "Sleep-Lab Consultation", unit: "bawat konsultasyon", description: "Personalized na sleep diagnostics at optimization plan." },
          { id: "nad", name: "NAD+ Music Therapy", unit: "bawat experience", description: "Proposed na NAD+ infusion na sinamahan ng therapeutic music." },
        ],
      },
      {
        id: "camps", title: "Training camps at premium experiences", intro: "Mag-book nang 60+ araw bago ang camp para sa proposed na 20% early-booking discount. Inquiry lang.",
        items: [
          { id: "camp-day-workshop", name: "Day Workshop o Clinic", unit: "bawat tao", badge: "Isang araw", description: "Isang araw na HYROX-style clinic, technique workshop, o testing day.", features: ["Istrukturadong coaching", "Naka-programang training", "Performance assessment"] },
          { id: "camp-weekend-training", name: "Weekend Camp · Training Lang", unit: "bawat tao", badge: "2 araw · 1 gabi", description: "Elite coaching at istrukturadong programming.", features: ["Elite coaching", "Istrukturadong programming", "Hindi kasama ang tutuluyan"] },
          { id: "camp-weekend-all-inclusive", name: "Weekend Camp · All-Inclusive", unit: "bawat tao", badge: "2 araw · 1 gabi", description: "Training, tutuluyan, at pagkain sa iisang package.", features: ["Training at programming", "Tutuluyan sa Villa Del Rey", "Kasama ang pagkain"] },
          { id: "camp-week-immersive", name: "Limang Araw na Immersive", unit: "bawat tao", badge: "5 araw", description: "Nag-iiba ang presyo depende sa tutuluyan at sa lineup ng mga coach.", features: ["Training", "Recovery", "Performance testing", "Gabay sa nutrisyon"] },
        ],
      },
      {
        id: "corporate", title: "Corporate bookings",
        items: [
          { id: "corporate-groups", name: "Corporate at Team Bookings", description: "Team-building experiences, group training rates at wellness off-sites na may customized na programming." },
        ],
      },
    ],
    faq: [
      { id: "validity", question: "Gaano katagal valid ang class packs?", answer: "5-Class Intro Pack: 60 araw. 10-Class Pack: 90 araw. 5-Class Yoga Pack: 90 araw. 10-Class Yoga Pack: 120 araw." },
      { id: "guest-passes", question: "Paano gumagana ang guest passes?", answer: "Ang mga Premium member ay may 2 guest pass kada buwan." },
      { id: "freeze", question: "Puwede ko bang i-freeze ang membership ko?", answer: "Ilalabas ang freeze policy bago ang pagbubukas." },
      { id: "cancel", question: "Paano ang pag-cancel?", answer: "Ilalabas ang proseso ng cancellation bago ang pagbubukas." },
      { id: "peak", question: "Bakit nag-iiba ang ilang rate para sa bisita?", answer: "Puwedeng mas mataas ang drop-in at day-pass rates tuwing weekend, long weekend at peak travel season." },
      { id: "founding", question: "Ano ang founding-member offer?", answer: "Isang proposed na founding rate para sa unang anim na buwan mo (halimbawa, Athlete sa Php 3,200 kada buwan imbes na Php 4,500, tipid na humigit-kumulang 29%) o naka-lock na lifetime alumni rate, kasama ang priority access at isang eksklusibong launch event. Limitado ang slots: tinatapos pa ang planong cap na nasa pagitan ng 50 at 150 member." },
      { id: "recovery-bundle", question: "Magkano ang matitipid sa recovery bundle?", answer: "Ang limang sauna o ice-bath session ay Php 2,000, kumpara sa Php 2,250 sa single-session rate: tipid na Php 250, humigit-kumulang 11%." },
      { id: "early-booking", question: "May early-booking discount ba para sa mga camp?", answer: "May proposed na 20% early-booking discount para sa mga camp na na-book nang hindi bababa sa 60 araw bago ito." },
    ],
  },

  // ---------- schedule ----------
  schedule: {
    intro: "Bukas ang pasilidad buong araw at buong linggo, may mga class sa umaga, open gym, private session, at panggabing programming, kaya laging may buhay ang lugar.",
    rhythm: dayRhythm.map(({ id, title, body }) => ({ id, title, description: body })),
    timetable,
    recurring: [
      { id: "leaderboards", title: "Daily Leaderboards", description: "Rankings para sa overall, age-group, weight-class, at improvement rate." },
      { id: "time-trials", title: "Weekly Time Trials", description: "HYROX-style stations na sinusubok linggo-linggo." },
      { id: "night-games", description: "Mga kompetisyon sa ilalim ng ilaw, team competitions na may mga manonood at leaderboards." },
      { id: "friday-night-lights", description: "Ang signature weekly event namin na may scaled divisions at salu-salo pagkatapos." },
      { id: "night-runs", description: "Headlamp trail runs sa ilalim ng mga bituin at mga lake loop na may ilaw." },
      { id: "partner-challenges", description: "Two-person team workouts kasama ang random o napiling partner." },
      { id: "obstacle-races", description: "Paikot sa lawa at sa kagubatan, sa iba't ibang distansya, may mga opsyong pampamilya." },
      { id: "team-challenges", title: "3-Hour Team Challenges", description: "Endurance relays ng running, rowing, lifting, at skills, para makalikom ng pondo para sa mga proyekto ng lokal na komunidad." },
    ],
    events: [
      { id: "founders-workout", dateLabel: "Opening day: iaanunsyo pa ang petsa", description: "Ang kauna-unahang workout sa BaseCamp, para sa mga early member." },
      { id: "community-dinner", title: "Community Dinner", dateLabel: "Opening day: iaanunsyo pa ang petsa", description: "Ipagdiwang ang pagbubukas kasama ang BaseCamp community." },
      { id: "skill-clinics", dateLabel: "Regular: iaanunsyo pa ang mga petsa", description: "Mga technique workshop at HYROX-style clinic." },
      { id: "nutrition-seminars", dateLabel: "Regular: iaanunsyo pa ang mga petsa", description: "Performance nutrition, sa istilong pagkaing Pinoy." },
      { id: "community-comps", dateLabel: "Regular: iaanunsyo pa ang mga petsa", description: "Regular na kompetisyon na nagpapalakas ng lokal na pakikilahok." },
      { id: "trail-festival", dateLabel: "Iaanunsyo pa ang petsa", description: "Trail running na bukas para sa lahat." },
      { id: "lake-endurance", dateLabel: "Iaanunsyo pa ang petsa", description: "Endurance racing paikot sa lawa." },
      { id: "mtb-classic", dateLabel: "Iaanunsyo pa ang petsa", description: "Mountain bike racing sa mga trail na ginawa para rito." },
    ],
    leaderboardCategories: ["Overall", "Ayon sa edad", "Ayon sa timbang", "Bilis ng pag-improve"],
  },

  // ---------- story ----------
  story: {
    positioning: {
      notLine: "Hindi gym. Hindi spa. Hindi camp. Hindi resort.",
      headline: "BaseCamp CamSur = Ang Performance Playground ng Timog-Silangang Asya.",
      sub: "Kung saan pumupunta ang mga atleta, baguhan, at biyahero para mag-train, mag-transform, at umunlad: pinapagana ng kalikasan, agham, at komunidad.",
      breakdown: [
        { id: "playground", title: "Performance Playground", body: "Ang \"playground\" ay nagpapahiwatig ng saya, paggalugad at posibilidad; ang \"performance\" ay nangangahulugang seryosong resulta at kredibilidad. Nakatuon sa resulta, pero masaya." },
        { id: "everyone", title: "Mga atleta, baguhan at biyahero", body: "Magkatabing nagte-train ang mga elite athlete at ang mga bago sa fitness. Welcome ang lahat." },
        { id: "pillars", title: "Train. Transform. Thrive.", body: "Transformation ang pinakamalaking pangako. Pantay ang halaga ng training at recovery, at bahagi ng sulit ang koneksyon sa kapwa." },
        { id: "sources", title: "Kalikasan, agham at komunidad", body: "Ang kalikasan ang nagbibigay ng setting at ng ilang training tools. Tinitiyak ng agham na epektibo ito. Ang komunidad ang lumilikha ng pagkakabilang at motibasyon." },
      ],
    },
    brandPillars: [
      { id: "adventure", title: "Adventure", body: "Dapat pakiramdam ng bawat session ay may bago kang ginagalugad." },
      { id: "recovery", title: "Recovery", body: "Nagbubunga lang ang matinding training kapag nag-recover ka nang tama." },
      { id: "community", title: "Komunidad", body: "Ang sama-samang pagsisikap ay bumubuo ng samahang tumatagal." },
      { id: "nature", title: "Kalikasan", body: "Hinuhubog ng tanawin ang bawat workout." },
      { id: "performance", title: "Performance", body: "Mahalaga ang resulta. Sinusukat ang progreso, hindi hinuhulaan." },
    ],
    founders: {
      eyebrow: "Bisyon ng mga founder", title: "Bakit dito. Bakit ganito.",
      paragraphs: [
        "Ang BaseCamp CamSur ang kinabukasan ng pinagsamang fitness at wellness sa CamSur. Pinagsasama ang CrossFit-style training, HYROX-style na paghahanda, outdoor training, commercial gym, at kumpletong recovery services, bumubuo kami ng destinasyon para sa mga atleta at wellness enthusiast mula sa buong mundo.",
        "Bakit dito? Habang beach ang alok ng iba, freshwater at kagubatan ang alternatibo ng CamSur. Mas presko ang temperatura, mas kalmado ang tubig, may mga bundok sa likuran: ibang klase ng paraiso.",
        "Bakit ganito? Pantay ang halaga ng training at recovery. Sa recovery nangyayari ang adaptation, hindi habang nagte-train, kaya bawat espasyo, bawat programa at bawat desisyon sa disenyo ay para sa buong paglalakbay ng atleta.",
        "Ang BaseCamp ay para sa mga atletang naghahanap ng performance na suportado ng agham, para sa mga biyaherong naghahanap ng adventure, at para sa komunidad na naghahanap ng koneksyon sa sama-samang hamon sa gitna ng kalikasan.",
      ],
      signature: "Ang founding team ng BaseCamp CamSur",
    },
    buildUpdates: [
      { id: "execution-underway", title: "Tuloy-tuloy ang pagsasakatuparan", body: "Malinaw ang bisyon at tuloy-tuloy ang konstruksyon. Subaybayan ang bawat yugto ng pagtatayo: mga zone reveal, pagdating ng equipment at mga detalye ng disenyo na nabubuhay." },
      { id: "design", title: "Dinisenyong umusbong mula sa tanawin", body: "Hilaw na konkreto, natural na kahoy at lokal na bato. Inuuna ang lilim, open-air, at hindi kailanman gym sa mall." },
    ],
  },

  // ---------- gallery ----------
  gallery: {
    eyebrow: "Komunidad", title: "Sundan ang kilusan.",
    intro: "Training intensity, kalikasan, komunidad, behind-the-scenes na updates sa pagtatayo, at coach spotlights.",
    posts: [
      {
        id: "build-destination", type: "Pasilidad", badge: "Itinatayo mula sa simula",
        title: "Ang destinasyon", caption: "Nabubuo na sa Camarines Sur ang bagong tahanan ng paggalaw.",
        detail: "Subaybayan ang mga espasyo, detalye, at progreso sa likod ng bagong destinasyon para sa performance, recovery, at komunidad sa Pili.",
      },
      {
        id: "training-purpose", type: "Strength", badge: "Training intensity",
        title: "Binuo nang may layunin", caption: "Lakas na dala mo sa training, sport, at araw-araw na buhay.",
        detail: "Ang mga session na may layunin ay bumubuo ng matibay na lakas, kumpiyansa, at kapasidad na patuloy na umusad—isang pinag-isipang repetition sa bawat pagkakataon.",
      },
      {
        id: "recovery-reset", type: "Recovery", badge: "Recovery rituals",
        title: "Mag-reset at mag-restore", caption: "Maglaan ng espasyo para sa susunod na laban.",
        detail: "Bahagi ng training rhythm ang recovery. Sundan ang mga practice, espasyo, at ginagabayang session na binuo para matulungan ang Basecamp community na bumalik nang handa.",
      },
      {
        id: "coach-progress", type: "Coaching", badge: "Coach spotlight",
        title: "Progreso, may gabay", caption: "Nakatutok na coaching na may puwang para umunlad.",
        detail: "Kilalanin ang coaching approach sa likod ng Basecamp: malinaw na direksyon, pinag-isipang progressions, at suportang hinubog ayon sa taong gumagawa ng trabaho.",
      },
      {
        id: "community-motion", type: "Training", badge: "Mga sandali ng komunidad",
        title: "Isang galaw sa bawat pagkakataon", caption: "Mga session na may layunin, ibinahagi ng komunidad.",
        detail: "Tingnan ang enerhiya, coaching cues, at araw-araw na trabaho sa likod ng Basecamp training—mula sa foundational movement hanggang sa mga high-output na session.",
      },
    ],
  },

  // ---------- whyCamsur ----------
  whyCamsur: {
    title: "Bakit CamSur.",
    intro: "Lakas ng CamSur ang lokasyon nito, hindi kompromiso: likas na ganda, madaling puntahan, at lokal na kultura.",
    reasons: [
      { id: "adventure", title: "Subok nang adventure destination", body: "Kilala na ang CamSur bilang pangunahing adventure tourism hub ng Pilipinas, sa wakeboarding, water sports, at outdoor activities na dinarayo buong taon." },
      { id: "climate", title: "Tropikal na klima buong taon", body: "Dahil sa tuloy-tuloy na panahon, puwedeng mag-outdoor training 365 araw sa isang taon: walang seasonal closure at walang limitasyon sa programming dahil sa panahon (maliban sa bagyo)." },
      { id: "alternative", title: "Alternatibong hindi pa natutuklasan", body: "Bagong alternatibo sa Bali at Phuket: freshwater at kagubatan imbes na beach, may mas preskong temperatura, mas kalmadong tubig at mga bundok sa likuran." },
      { id: "access", title: "Imprastraktura sa turismo", body: "Malakas ang hatak sa lokal at international na turismo, madaling puntahan mula Manila, at may matatag nang hospitality ecosystem." },
    ],
    story: "Pinagbubuklod ng BaseCamp ang rehiyon bilang performance lifestyle hub, dala ang init ng pagtanggap at pagiging bukas ng mga Pilipino.",
  },
};
