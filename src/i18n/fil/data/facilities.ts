// Filipino draft of src/data/facilities.ts. Same export names and types; images, hrefs, availability values and the
// zone order are identical to the English file. SIGNATURE_PREVIEW is a number: use the English module.
// Programme names inside `details.programs` (Functional Training, Strength & Conditioning, …) stay English because
// they are the programme titles used across the site.
import type * as EN from "@/data/facilities";
import type { FacilityHero, FacilityItem, FacilityZone, Room } from "@/data/facilities";
import { FACILITY_ANCHORS, type FacilityAnchor } from "@/content/constants";
import type { Localized } from "../localized";

export const FACILITIES_HERO: FacilityHero = {
  eyebrow: "",
  title: "Bawat pangako ay imprastraktura.",
  intro: "Bawat pangako ng brand ay totoong arkitektura. Ang Train. Transform. Thrive. ay hindi marketing language: ito ang pisikal na kapaligirang itinatayo namin.",
  image: "/images/facilities/facility-aerial.jpg",
  imageAlt: "Aerial na architectural rendering ng BaseCamp CamSur",
};

export const DESIGN: Localized<typeof EN.DESIGN> = {
  eyebrow: "Disenyo",
  title: "Nakabaon sa lupa. Hindi lang sa brand.",
  pillars: [
    { title: "Modern Tropical", body: "Arkitekturang tumutugon sa klima, habang nananatiling kontemporaryo at propesyonal ang dating" },
    { title: "Glass-Forward na Disenyo", body: "Maaliwalas na espasyo na may natural na liwanag at tanawing nagbibigay ng enerhiya at pagkabukas" },
    { title: "Kontrast ng Materyales", body: "Bakal na istruktura na may mainit na accent ng kahoy, binabalanse ang industrial na performance at natural na ginhawa" },
    { title: "Integrated na Tanawin", body: "Mga puno ng palma at katutubong halaman na hinabi sa mismong arkitektura, hindi lang idinagdag sa paligid" },
  ] satisfies FacilityItem[],
  chips: ["Tropical brutalist: hilaw na konkreto, natural na kahoy, lokal na bato", "Inuuna ang lilim", "Open-air", "Walang “gym sa mall” na dating"],
  quote: "Mukhang premium. Ramdam na athletic. Maganda sa camera.",
};

const ANCHOR_LABEL_FIL: Record<FacilityAnchor, string> = {
  arrival: "Pagdating at pagsalubong", "training-zones": "Mga training zone", "running-loop": "Running loop", recovery: "Recovery", "social-lounge": "Social at lounge",
};

/** Zone journey 01–05, in the same order as the English list. */
export const ZONES: { anchor: FacilityAnchor; label: string }[] = [
  FACILITY_ANCHORS.arrival, FACILITY_ANCHORS.training, FACILITY_ANCHORS.running, FACILITY_ANCHORS.recovery, FACILITY_ANCHORS.social,
].map((anchor) => ({ anchor, label: ANCHOR_LABEL_FIL[anchor] }));

export const ARRIVAL: Localized<typeof EN.ARRIVAL> = {
  title: "Pagdating at pagsalubong.",
  intro: "Paradahan, reception, at ang unang tanaw.",
  items: [
    {
      title: "Central lobby",
      body: "Mag-check in, alamin ang takbo ng pagbisita mo, at humingi ng tulong bago mag-train o mag-recover.",
      availability: "at-launch",
      details: { audience: "Mga member, day guest, at camp group", access: "Kasama sa bawat pagbisita", booking: "Hindi kailangang mag-book", programs: ["Lahat ng BaseCamp experience"], technical: "Propesyonal na reception at information desk sa pangunahing pasukan." },
    },
    {
      title: "Tuloy-tuloy na mga zone",
      body: "Madaling lumipat-lipat sa training, recovery, at social spaces buong araw.",
      availability: "at-launch",
      details: { audience: "Lahat ng bisita", access: "Kasama sa bawat pagbisita", booking: "Hindi kailangang mag-book", programs: ["Training", "Recovery", "Camps"], technical: "Madaling daanan na nagdudugtong sa mga pangunahing public zone." },
    },
  ] satisfies FacilityItem[],
};

export const TRAINING: Localized<typeof EN.TRAINING> = {
  title: "Mga training zone.",
  zones: [
    {
      title: "Nakalaang CrossFit-style area",
      body: "Bumuo ng lakas, skill at conditioning sa isang performance environment na pinangungunahan ng coach.",
      availability: "at-launch",
      details: { audience: "Mga group-training athlete at camp", access: "Kwalipikadong class o gym membership", booking: "Mag-book ng coached session", programs: ["Functional Training", "Strength & Conditioning"], technical: "Full-spec na rigs, platforms at competition-grade na equipment para sa high-intensity programming." },
      image: "/images/facilities/1st floor- crossfit area-v2.webp",
      imageAlt: "Architectural render ng nakalaang CrossFit-style training area",
    },
    {
      title: "Kumpletong fitness gym",
      body: "Sundin ang sarili mong strength plan o magdagdag ng accessory work bukod sa mga coached session.",
      availability: "at-launch",
      details: { audience: "Mga independent athlete at coaching client", access: "Kwalipikadong gym membership o pass", booking: "Open access sa member hours", programs: ["Strength & Conditioning", "Personal Coaching"], technical: "Strength equipment, cardio machines, at mga nakalaang accessory-work zone." },
      image: "/images/facilities/1st floor- gym area-v2.webp",
      imageAlt: "Architectural render ng fitness gym at strength equipment",
    },
    {
      title: "Malawak na outdoor space",
      body: "I-train ang bilis, carries at conditioning nang buong laki sa kapaligiran ng CamSur.",
      availability: "at-launch",
      details: { audience: "Mga endurance athlete, team, at malalaking grupo", access: "Kwalipikadong membership, pass, o camp", booking: "Kailangang mag-book para sa class at group blocks", programs: ["Endurance", "Functional Training"], technical: "673 m² para sa sprint work, sled push, carries at large-group programming." },
      image: "/images/programs/program-endurance.webp",
      imageAlt: "Outdoor conditioning session sa ilalim ng tropikal na langit",
    },
  ] satisfies FacilityZone[],
  planned: [
    {
      title: "HYROX-style Experience Lanes",
      body: "I-practice ang kumpletong race stations at transitions sa isang permanenteng performance setup.",
      availability: "planned",
      details: { audience: "Mga hybrid racer at competition camp", access: "Kukumpirmahin pa ang detalye ng access", booking: "Kailangang mag-book para sa program sessions", programs: ["Endurance", "Strength & Conditioning"], technical: "Lahat ng walong station, sled track na hindi bababa sa 25 m, at feature walls sa sled at rowing stations." },
    },
    {
      title: "Open-air training decks",
      body: "Mag-train sa labas na tanaw ang lawa at bundok mula sa itaas.",
      availability: "planned",
      details: { audience: "Maliliit na grupo at independent athlete", access: "Kukumpirmahin pa ang detalye ng access", booking: "Kukumpirmahin pa ang booking policy", programs: ["Functional Training", "Recovery & Mobility"], technical: "Mga nakaangat na open-air platform na kaisa ng tanawin." },
    },
  ] satisfies FacilityItem[],
  statsQuote: "Sadyang bukas at kita ang mga training space… ipinagdiriwang ang effort, at nabubuo ang komunidad sa sama-samang pagsisikap.",
  equipmentTitle: "Planong equipment fit-out",
  equipment: [
    { title: "Strength", items: ["Competition-grade na rigs at pull-up structures", "4 na commercial power rack", "12 Olympic barbell", "Mga set ng bumper plate", "Dumbbells 5–50kg", "Kettlebells 8–48kg", "6 na adjustable bench"] },
    { title: "Cardio", items: ["8 Concept2 RowErg", "6 Assault AirBike o BikeErg", "4 SkiErg", "4 treadmill"] },
    { title: "Functional", items: ["4 competition sled", "4 set ng 15m battle ropes", "12 plyo box (20/24/30\")", "20 wall ball (6–14kg)", "Medicine balls (3–15kg)"] },
    { title: "HYROX-style", items: ["8 sandbag (10/20/30kg)", "4 pares ng farmers-carry handles", "Isang custom na 25m sled push track"] },
  ],
};

export const RUNNING: Localized<typeof EN.RUNNING> = {
  title: "Running loop.",
  intro: "Tuloy-tuloy na daanan na kaisa ng kalikasan, iba-iba ang terrain.",
  items: [
    { title: "Signature outdoor trails", body: "Tumakbo o mag-hike sa mga sinukat na ruta sa distansya at hirap na bagay sa session mo.", availability: "planned", details: { audience: "Mga runner, hiker at camp group", access: "Kukumpirmahin pa ang detalye ng access", booking: "Kailangang mag-book para sa guided clinics", programs: ["Endurance", "Camps"], technical: "May markang circuits na may iba't ibang distansya, mapa, signage at iba-ibang terrain." } },
    { title: "Lakeside training loops", body: "Palakasin ang pace at aerobic capacity paikot sa Lago Del Rey.", availability: "planned", details: { audience: "Mga endurance athlete at run club", access: "Kukumpirmahin pa ang detalye ng access", booking: "Kailangang mag-book para sa club sessions", programs: ["Endurance", "Run Club"], technical: "Mga sinukat na loop na may distance markers at elevation profiles." } },
    { title: "Open water swim courses", body: "I-train ang distansya at kumpiyansa sa isang managed na open-water setting.", availability: "planned", details: { audience: "Mga bihasang swimmer at endurance athlete", access: "Access sa special sessions", booking: "Kailangang mag-book para sa supervised sessions", programs: ["Endurance", "Training Camps"], technical: "Mga nakatalagang swim course na may safety boats." } },
    { title: "Wellness trails", body: "Gamitin ang banayad na paggalaw sa pagsikat at paglubog ng araw para maka-recover sa pagitan ng mabibigat na session.", availability: "planned", details: { audience: "Lahat ng level at mga recovery guest", access: "Kukumpirmahin pa ang detalye ng access", booking: "Kailangang mag-book para sa guided hikes", programs: ["Recovery & Mobility", "Camps"], technical: "Mga low-intensity na nature route na planong gamitin sa pagsikat at paglubog ng araw." } },
  ] satisfies FacilityItem[],
};

const RECOVERY_TITLE = "Recovery-forward, hindi workout-forward.";
const RECOVERY_SUB = "Sa recovery nangyayari ang adaptation, hindi habang nagte-train. Bahagi ng core programming ang recovery, hindi opsyonal na dagdag.";

export const RECOVERY: Localized<typeof EN.RECOVERY> = {
  eyebrow: "Recovery",
  title: RECOVERY_TITLE,
  sub: RECOVERY_SUB,
  core: {
    title: "Core infrastructure",
    items: [
      { title: "Cold plunge pools", body: "Gamitin ang cold immersion para mag-reset sa pagitan ng mga session at suportahan ang recovery pagkatapos mag-train.", availability: "planned", details: { audience: "Mga atleta at camp group", access: "Recovery pass o kwalipikadong plan", booking: "Mag-reserve ng recovery slot", programs: ["Recovery & Mobility"], technical: "Nakalaang cold-immersion infrastructure para sa istrukturadong recovery protocols." } },
      { title: "Hot plunge pools", body: "Gamitin ang init para sa relaxation, sirkulasyon, at contrast-therapy routines.", availability: "planned", details: { audience: "Mga recovery guest at training camp", access: "Recovery pass o kwalipikadong plan", booking: "Mag-reserve ng recovery slot", programs: ["Recovery & Mobility"], technical: "Hot-water infrastructure na dinisenyong kapares ng cold immersion." } },
      { title: "Nakalaang sauna", body: "Magdagdag ng kontroladong heat exposure sa sinadyang recovery routine.", availability: "at-launch", details: { audience: "Mga member at recovery guest", access: "Recovery pass o kwalipikadong plan", booking: "Mag-reserve ng recovery slot", programs: ["Recovery & Mobility"], technical: "Nakalaang heat facilities, may planong hiwalay na area para sa lalaki at babae." } },
      { title: "Mobility at breathwork", body: "Ibalik ang range of motion, magpakalma, at maghanda para sa susunod na session.", availability: "at-launch", details: { audience: "Lahat ng level", access: "Kwalipikadong class o recovery access", booking: "Kailangang mag-book para sa guided sessions", programs: ["Recovery & Mobility"], technical: "Nakalaang espasyo at equipment para sa mobility, stretching at breathwork." } },
    ] satisfies FacilityItem[],
  },
  volume: {
    title: "Ginawa para sa maraming tao",
    items: [
      { title: "Buong ikalawang palapag", body: "Mag-recover nang malayo sa ingay at galaw ng training floor.", availability: "at-launch", details: { audience: "Mga member, bisita at camp group", access: "Recovery pass o kwalipikadong plan", booking: "Maaaring kailangang mag-book para sa bawat modality", programs: ["Recovery & Mobility", "Training Camps"], technical: "Isang nakalaang wellness level na may daanang planado para sa sabay-sabay na paggamit." } },
      { title: "Maraming treatment room", body: "Mag-book ng nakatutok na masahe, bodywork, at recovery treatments.", availability: "planned", details: { audience: "Mga atletang kailangan ng indibidwal na treatment", access: "Treatment add-on", booking: "Kailangang mag-book", programs: ["Personal Coaching", "Recovery & Mobility"], technical: "Hiwalay na kuwarto para sa pribadong hands-on na treatment." } },
      { title: "Hyperbaric chamber", body: "Gumamit ng specialist recovery modality pagkatapos ng tamang screening.", availability: "planned", details: { audience: "Mga na-screen na recovery client", access: "Specialist session add-on", booking: "Kailangan ng screening at booking", programs: ["Recovery & Mobility"], technical: "Ang hyperbaric oxygen equipment ay bahagi pa rin ng plano para sa pasilidad sa hinaharap." } },
      { title: "Gradual cooling rooms", body: "Lumipat nang ligtas sa pagitan ng init, lamig, at pahinga sa contrast protocols.", availability: "planned", details: { audience: "Mga gumagamit ng contrast therapy", access: "Recovery pass o kwalipikadong plan", booking: "Mag-reserve ng recovery slot", programs: ["Recovery & Mobility"], technical: "Mga espasyong pang-transition ng temperatura para sa ginagabayang contrast routines." } },
    ] satisfies FacilityItem[],
  },
  quote: "Hindi ito hotel spa: ginawa ito para sa malalaking training camp kung saan dose-dosenang atleta ang sabay-sabay na gagamit.",
  gridTitle: "Recovery modalities",
  rituals: { title: "Recovery rituals", body: "Contrast therapy path: cold plunge → hot tub → pahinga. Ginagabayang breathwork sessions at istrukturadong recovery protocols. Gawing sistematiko ang recovery, hindi basta-basta." },
  launchEquipment: {
    title: "Recovery equipment sa launch",
    items: ["Commercial ice bath (4–6 na tao)", "Outdoor-rated na infrared sauna (6–8 na tao)", "Massage guns, foam rollers, resistance bands, stretching mats, at yoga props"],
  },
  pricingLink: { label: "Tingnan ang presyo ng recovery", href: "/membership/price-guide#recovery-pricing" },
};

export const SOCIAL: Localized<typeof EN.SOCIAL> = {
  title: "Social at lounge.",
  items: [
    { title: "Café at social hub", body: "Mag-refuel, makipagkita sa training partners, at manatiling konektado kahit tapos na ang workout.", availability: "planned", details: { audience: "Mga member, bisita at kasama nila", access: "Public areas; hiwalay ang bayad sa mga bibilhin", booking: "Hindi kailangang mag-book para sa pangkalahatang gamit", programs: ["Events", "Training Camps"], technical: "Pagkain, inumin at social seating na planado batay sa performance nutrition." } },
    { title: "Yoga at movement studio", body: "Mag-practice ng mobility at mind-body work malayo sa main training floor.", availability: "phase-2", details: { audience: "Lahat ng level", access: "Kwalipikadong class o recovery plan", booking: "Kailangang mag-book para sa mga class", programs: ["Recovery & Mobility"], technical: "Nakalaang studio space para sa yoga, mobility at complementary movement." } },
    { title: "Mga event at workshop", body: "Matuto ng bagong skills at makipag-ugnayan sa mga clinic, seminar, at pagtitipon.", availability: "planned", details: { audience: "Mga member, team at ang lokal na komunidad", access: "Depende sa event", booking: "Kailangang mag-register sa event", programs: ["Events", "Workshops"], technical: "Flexible na gathering areas para sa edukasyon at community programming." } },
    { title: "Outdoor integration", body: "Gumalaw, magpahinga, at makihalubilo sa mga malilim na landscaped area.", availability: "at-launch", details: { audience: "Lahat ng bisita", access: "Kasama sa site access", booking: "Hindi kailangang mag-book", programs: ["Lahat ng BaseCamp experience"], technical: "Pinagdudugtong ng tanawin ang indoor, semi-covered at outdoor na public spaces." } },
    { title: "Mas mahabang pananatili", body: "Sulitin ang buong training day imbes na umalis agad pagkatapos ng session.", availability: "at-launch", details: { audience: "Mga camp guest at long-stay na bisita", access: "Kasama sa kwalipikadong visit access", booking: "Kailangang mag-book nang maaga para sa camp stays", programs: ["Training Camps", "Visitor Experiences"], technical: "Mga espasyong pang-matagalang pananatili para sa paulit-ulit na session, recovery at oras kasama ang komunidad." } },
  ] satisfies FacilityItem[],
};

export const FUEL: Localized<typeof EN.FUEL> = {
  eyebrow: "Fuel",
  title: "Performance food culture, hindi detox food culture.",
  line: "Hindi lang masarap ang pagkaing Pinoy: performance fuel din ito.",
  label: "Planong konsepto ng café menu",
  columns: [
    { title: "Performance na lutong Pinoy", items: ["Adobo na may lean protein at anti-inflammatory na pampalasa", "Sinigang na may masustansyang gulay"] },
    { title: "Katutubong pananim para sa atleta", items: ["Ube bilang pre-workout carb", "Malunggay bilang superfood green", "Calamansi bilang natural na electrolyte"] },
    { title: "Mga lutuing Bicolano", items: ["Laing na kaunti ang mantika", "Mga lutong may gata", "Sili"] },
  ],
  chips: ["Natural na electrolytes", "Fermented na pagkain (burong mustasa)", "Protein desserts (ube protein smoothies, bagong bersyon ng halo-halo)", "Hydration at salt bars"],
};

export const SIGNATURE: Localized<typeof EN.SIGNATURE> = {
  eyebrow: "Signature spaces",
  title: "Imposibleng pumangit ang litrato mo.",
  items: [
    { title: "HYROX-style feature walls" },
    { title: "Finish gates", body: "LED display ng oras at pangalan" },
    { title: "Ice bath pits", body: "Sculptural na konkreto, lawa sa likuran" },
    { title: "Scenic open gym decks", body: "360° na tanawin" },
    { title: "Rope climb sa ibabaw ng tubig" },
    { title: "Floating training platforms" },
    { title: "Hill sprint frame" },
    { title: "Sauna na may glass walls", body: "Sunset sauna" },
  ].map((i) => ({ ...i, availability: "planned" as const })) satisfies FacilityItem[],
  av: {
    title: "Audio-visual",
    body: "Malalaking display, programmable LEDs, at stadium-quality na audio.",
    quote: "Idisenyo ang tunog, ilaw, at atmospera na parang stadium, hindi gym.",
  },
};

export const ALL_WEATHER: Localized<typeof EN.ALL_WEATHER> = {
  eyebrow: "All-weather",
  title: "Handa sa kahit anong panahon.",
  items: [
    { title: "Outdoor at semi-covered na zones", body: "Para sa kahit anong panahon" },
    { title: "Disenyong inuuna ang lilim", body: "Malalalim na bubong at mga halaman" },
    { title: "Puwedeng mag-train sa gabi", body: "Task lighting para sa training zones at ambient lighting para sa daanan at social areas" },
    { title: "Mga inuman ng tubig", body: "Sa buong pasilidad" },
    { title: "First aid", body: "Maraming first aid station" },
  ] satisfies FacilityItem[],
};

export const GALLERY: Localized<typeof EN.GALLERY> = {
  eyebrow: "Gallery",
  title: "Ginawang maganda sa camera",
  body: "Silipin ang mga training, welcome, work, at changing space sa unang palapag na planado para sa BaseCamp CamSur.",
  images: [
    { src: "/images/facilities/1st floor- lobby-v2.webp", alt: "Architectural render ng lobby at reception ng BaseCamp", wide: true },
    { src: "/images/facilities/1st floor- gym area-v2.webp", alt: "Architectural render ng fitness gym ng BaseCamp" },
    { src: "/images/facilities/1st floor- crossfit area-v2.webp", alt: "Architectural render ng CrossFit-style training area ng BaseCamp" },
    { src: "/images/facilities/1st floor- cafeteria-v2.webp", alt: "Architectural render ng cafeteria at communal seating ng BaseCamp" },
    { src: "/images/facilities/1st floor- yoga-v2.webp", alt: "Architectural render ng yoga at movement studio ng BaseCamp" },
    { src: "/images/facilities/1st floor- office area-v2.webp", alt: "Architectural render ng office area ng BaseCamp" },
    { src: "/images/facilities/1st floor- cctv room.jpg", alt: "Architectural render ng CCTV operations room ng BaseCamp" },
    { src: "/images/facilities/1st floor- men's locker room-v2.webp", alt: "Architectural render ng locker room ng mga lalaki" },
    { src: "/images/facilities/1st floor- men's shower room-v2.webp", alt: "Architectural render ng shower room ng mga lalaki" },
    { src: "/images/facilities/1st floor- men's rest room-v2.webp", alt: "Architectural render ng CR ng mga lalaki" },
    { src: "/images/facilities/1st floor- women's locker room-v2.webp", alt: "Architectural render ng locker room ng mga babae" },
    { src: "/images/facilities/1st floor- women's rest room-v2.webp", alt: "Architectural render ng CR ng mga babae" },
    { src: "/images/facilities/1st floor- toilet room-v2.webp", alt: "Architectural render ng accessible na CR sa unang palapag" },
  ],
  quote: "Bawat kuwarto ay sumusuporta sa buong training day.",
};

/* ---------- Stage-3 sub-page heroes ---------- */
export const TRAINING_HERO: FacilityHero = {
  eyebrow: "",
  title: "Mga training zone.",
  intro: "Functional, strength, at outdoor zones, running loop sa gitna ng kalikasan, at mga espasyong dinisenyo para sa kahit anong panahon.",
  image: "/images/facilities/1st floor- crossfit area-v2.webp",
  imageAlt: "Architectural render ng CrossFit-style training area ng BaseCamp",
};

export const RECOVERY_HERO: FacilityHero = {
  eyebrow: "",
  title: RECOVERY_TITLE,
  intro: RECOVERY_SUB,
  image: "/images/facilities/2F Plunge.webp",
  imageAlt: "Architectural render ng recovery level at plunge pools ng BaseCamp",
};

export const LIFESTYLE_HERO: FacilityHero = {
  eyebrow: "",
  title: "Mga espasyong gugustuhin mong tambayan.",
  intro: "Ang social lounge, performance food culture at mga signature space na imposibleng pumangit ang litrato mo.",
  image: "/images/facilities/1st floor- cafeteria-v2.webp",
  imageAlt: "Architectural render ng cafeteria at social space ng BaseCamp",
};

export const FACILITIES_CTA: Localized<typeof EN.FACILITIES_CTA> = { eyebrow: "Silipin mo", title: "Damhin ang espasyo.", body: "Sumali sa early access para makatanggap ng anunsyo ng preview at tour kapag available na.", label: "Mag-register para sa preview" };

/* ---------- Interior rooms ---------- */
const f1 = (name: string) => `/images/facilities/1st floor- ${name}-v2.webp`;
const f2 = (name: string) => `/images/facilities/2F ${name}.webp`;

export const ROOMS = {
  crossfit: { title: "CrossFit-style area", body: "Rigs, platforms, bukas na sahig.", image: f1("crossfit area"), imageAlt: "Render ng CrossFit-style training area ng BaseCamp" },
  gym: { title: "Fitness gym", body: "Strength at cardio, open access.", image: f1("gym area"), imageAlt: "Render ng fitness gym ng BaseCamp" },
  yoga: { title: "Yoga studio", body: "Mag-stretch, huminga, mag-reset.", image: f1("yoga"), imageAlt: "Render ng yoga at movement studio ng BaseCamp" },
  lobby: { title: "Lobby", body: "Mag-check in at makipagkita.", image: f1("lobby"), imageAlt: "Render ng lobby at reception ng BaseCamp" },
  cafe: { title: "Café", body: "Mag-refuel pagkatapos mag-train.", image: f1("cafeteria"), imageAlt: "Render ng cafeteria ng BaseCamp" },
  work: { title: "Work area", body: "Laptop time sa pagitan ng mga session.", image: f1("office area"), imageAlt: "Render ng work area ng BaseCamp" },
  lockersW: { title: "Lockers ng babae", body: "Mag-iwan ng gamit, magbihis, go.", image: f1("women's locker room"), imageAlt: "Render ng locker room ng mga babae" },
  lockersM: { title: "Lockers ng lalaki", body: "Mag-iwan ng gamit, magbihis, go.", image: f1("men's locker room"), imageAlt: "Render ng locker room ng mga lalaki" },
  showers: { title: "Showers", body: "Magbanlaw at mag-reset.", image: f1("men's shower room"), imageAlt: "Render ng shower room" },
  plunge: { title: "Plunge pools", body: "Mainit at malamig, magkatabi.", image: f2("Plunge"), imageAlt: "Render ng mainit at malamig na plunge pools" },
  hyperbaric: { title: "Hyperbaric chamber", body: "Oxygen therapy, may screening muna.", image: f2("New Hyperbaric"), imageAlt: "Render ng kuwarto ng hyperbaric chamber" },
  therapy: { title: "Therapy rooms", body: "Masahe at bodywork.", image: f2("Therapy"), imageAlt: "Render ng isang treatment room" },
  recoveryLounge: { title: "Recovery lounge", body: "Magpahinga sa pagitan ng mga session.", image: f2("New Lobby"), imageAlt: "Render ng lounge sa recovery level" },
  recoveryShowers: { title: "Recovery showers", body: "Nasa mismong recovery level.", image: f2("Shower"), imageAlt: "Render ng mga shower sa recovery level" },
} satisfies Record<keyof typeof EN.ROOMS, Room>;

/** Gallery order: first floor, then the recovery level (same order as the English list). */
export const INTERIOR_GALLERY: Room[] = [
  ROOMS.lobby, ROOMS.crossfit, ROOMS.gym, ROOMS.yoga, ROOMS.cafe, ROOMS.work, ROOMS.lockersW, ROOMS.lockersM, ROOMS.showers,
  ROOMS.recoveryLounge, ROOMS.plunge, ROOMS.hyperbaric, ROOMS.therapy, ROOMS.recoveryShowers,
];
