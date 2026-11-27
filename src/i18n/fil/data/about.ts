// Filipino draft of src/data/about.ts. Same export names; `Localized<typeof EN.X>` proves the shape matches.
// Images, coordinates, sizes, highlight flags and the partner type order are identical to the English file.
import type * as EN from "@/data/about";
import type { Localized } from "../localized";

export const ABOUT_HERO: Localized<typeof EN.ABOUT_HERO> = {
  eyebrow: "Tungkol sa Amin",
  title: "Isang destinasyong sadyang itinayo kung saan nagtatagpo ang performance at lifestyle.",
  image: "/images/facilities/facility-exterior.jpg",
  imageAlt: "Ang labas ng pasilidad ng BaseCamp CamSur, kasama ang tanawin ng CamSur",
};

export const ABOUT_GLANCE: Localized<typeof EN.ABOUT_GLANCE> = {
  overview: "Ang BaseCamp CamSur ay isang destinasyong sadyang itinayo sa Camarines Sur kung saan pinagsama sa iisang lugar ang performance training, recovery, at lifestyle.",
  design: "Nakabaon sa tanawin.\nLawa at gubat sa labas.\nKalikasan ang training partner.",
  build: "Nasimulan na ang paghuhukay.\nTumataas na ang mga pader.\nMagbubukas na ang pinto.",
  contact: "Sumali sa early access list, magpadala ng inquiry tungkol sa camps, corporate, o partnership, o alamin kung paano pumunta sa BaseCamp CamSur.",
};

export const DESIGN_HERO: Localized<typeof EN.DESIGN_HERO> = {
  eyebrow: "",
  title: "Itinayo para sa performance.",
  intro: "Arkitekturang hinubog ng training at ng tanawin.",
  image: "/images/programs/classes-hero.jpg",
  imageAlt: "Mga atletang nagte-train sa gym na yari sa brick at konkreto",
};

export const BUILD_HERO: Localized<typeof EN.BUILD_HERO> = {
  eyebrow: "",
  title: "Itinatayo mula sa simula.",
  intro: "Itinatayo mula sa simula sa Camarines Sur. Subaybayan ang konstruksyon, ang countdown sa pagbubukas, at ang bisyon sa hinaharap.",
  image: "/images/programs/stations/sled-push-man.jpg",
  imageAlt: "Atletang nagtutulak ng may kargang sled sa sahig ng gym",
};

export const VISION: Localized<typeof EN.VISION> = {
  eyebrow: "Ang bisyon",
  title: "Bagong kategorya.",
  columns: [
    { label: "Hindi gym", body: "Higit pa sa paulit-ulit na indoor workout at siksikang pasilidad sa siyudad", highlight: false },
    { label: "Hindi resort", body: "Higit pa sa basta pagpapahinga at karaniwang hospitality", highlight: false },
    { label: "Bagong kategorya", body: "Active Wellness + Sports Tourism", highlight: true },
  ],
  lead: "Pinapasimulan ng BaseCamp CamSur ang isang bagong kategorya kung saan nagsasama ang performance training, recovery science, at lifestyle programming.",
  body: "Hindi ito pagdadagdag ng wellness amenities sa gym o ng fitness class sa resort: isa itong kapaligirang sadyang itinayo kung saan bawat bahagi ay para sa buong paglalakbay ng atleta, mula sa effort, sa adaptation, hanggang sa pag-unlad.",
};

export const PROBLEM: Localized<typeof EN.PROBLEM> = {
  eyebrow: "Bakit BaseCamp",
  title: "Ang problemang nilulutas namin.",
  lead: "Ang mga atleta ngayon ay naghahanap ng higit pa sa workout; gusto nila ng transformation, komunidad, at kapaligirang sadyang itinayo para sa buong paglalakbay nila.",
  body: "Ang modernong atleta ay nagte-train sa iba't ibang disiplina, pinahahalagahan ang recovery kasinghalaga ng performance, at naghahanap ng tunay na komunidad. Pero wala pang destinasyon sa Timog-Silangang Asya na nagbibigay ng tatlong ito sa iisang propesyonal na pinapatakbong lugar.",
  short: "Nagte-train ang mga atleta sa iba't ibang disiplina, pinahahalagahan ang recovery kasinghalaga ng performance, at naghahanap ng totoong komunidad. Wala pang destinasyon sa Timog-Silangang Asya na nagbibigay ng tatlong ito sa iisang lugar.",
  gaps: [
    { title: "Kulang ang mga gym sa siyudad", body: "Siksikan at indoor, paulit-ulit ang programming, at walang espasyo, kalikasan, o imprastrakturang kailangan ng mga seryosong atleta." },
    { title: "Sablay ang mga wellness resort", body: "Mga karanasang nakatuon sa pagpapahinga imbes na performance, kulang sa training intensity at programming na hinahanap ng mga hybrid athlete." },
    { title: "Watak-watak ang sports tourism", body: "Hiwa-hiwalay na karanasan kung saan kailangang pagtagpi-tagpiin ng atleta ang training facility, recovery, at tutuluyan sa iba't ibang lugar." },
  ],
};

export const PILLARS: Localized<typeof EN.PILLARS> = {
  eyebrow: "Pangako ng brand",
  phases: [
    { label: "Train", phase: "Effort", body: "Ang yugto ng effort: istrukturadong performance work na humahamon at nagpapalakas" },
    { label: "Transform", phase: "Adaptation", body: "Ang yugto ng adaptation: recovery at restoration kung saan talagang nangyayari ang pag-unlad" },
    { label: "Thrive", phase: "Lifestyle", body: "Ang yugto ng lifestyle: pangmatagalang gawi, tunay na komunidad, at pagbabagong tumatagal" },
  ],
  promise: "Hindi marketing language ang pangako ng aming brand: totoo ito sa arkitektura at sa operasyon. Bawat espasyo, bawat programa, bawat desisyon sa disenyo ay para sa buong paglalakbay na ito.",
  pillarsTitle: "Limang haligi ang gumagabay sa bawat desisyon.",
};

export const IDENTITY: Localized<typeof EN.IDENTITY> = {
  eyebrow: "Sino kami",
  title: "Sports muna. Mahalaga ang recovery. Destinasyong sulit puntahan.",
  items: [
    { title: "Sports at performance", body: "CrossFit-style, HYROX-style, at outdoor training ang puso nito" },
    { title: "Wellness at recovery", body: "Recovery na bahagi ng mahalagang imprastraktura" },
    { title: "Destinasyon", body: "Mag-train sa lugar na sulit puntahan" },
  ],
};

export const EDGE: Localized<typeof EN.EDGE> = {
  eyebrow: "Ang aming lamang",
  title: "Ang aming lamang: performance science at likas na ganda.",
  contrastLabel: "Tatlong destinasyon, tatlong pangako",
  intro: "Pinagsasama ng BaseCamp CamSur sa iisang lugar ang hindi pa naiaalok ng iba sa Timog-Silangang Asya: performance, teknolohiya, outdoor athleticism, at recovery.",
  chips: ["Functional fitness", "HYROX-style na paghahanda", "Outdoor performance conditioning", "Advanced recovery technology", "Multi-sport training sa lawa", "Transformation na batay sa data"],
  contrast: [
    { place: "Bali", promise: "Gumaan ang pakiramdam", body: "Uuwi kang relaxed, konektado sa espiritu, at presko ang damdamin.", highlight: false },
    { place: "Phuket", promise: "Mag-train nang todo", body: "Uuwi kang pagod na pagod mula sa matinding training.", highlight: false },
    { place: "CamSur", promise: "Patunayan ang resulta", body: "Uuwi kang may data na nagpapakitang mas fit, mas malakas, at mas malusog ka na.", highlight: true },
  ],
  closing: "Ito ang wellness 2.0, kung saan ang pakiramdam na maganda ay suportado ng obhetibong data at tunay na pag-angat ng performance.",
};

export const FLOOR_PLAN: Localized<typeof EN.FLOOR_PLAN> = {
  eyebrow: "Ang layout",
  title: "Isang palapag, lahat ng zone.",
  intro: "Ang ground floor mula sa itaas.",
  image: "/images/facilities/top view.webp",
  imageAlt: "Render mula sa itaas ng ground floor ng BaseCamp CamSur, kasama ang training, locker, at studio zones",
  width: 5504,
  height: 3072,
  zones: [
    { label: "Functional training area", description: "Bukas na turf at rigs para sa functional workouts.", x: 20, y: 34 },
    { label: "Locker rooms at shower", description: "Bihisan, shower, at mga pang-araw-araw na pangangailangan.", x: 41, y: 52 },
    { label: "Strength at cardio floor", description: "Free weights at cardio equipment sa iisang zone.", x: 62, y: 40 },
    { label: "Café bar", description: "Kape, shakes, at mabilisang refuel pagkatapos ng session.", x: 63, y: 78 },
    { label: "Lounge at reception", description: "Relaxed na pagsalubong at tagpuan ng komunidad.", x: 80, y: 55 },
    { label: "Yoga studio", description: "Kalmadong espasyo para sa yoga, mobility, at breathwork.", x: 77.5, y: 76 },
    { label: "Hagdan papunta sa recovery floor", description: "Direktang daan papunta sa mga nakalaang recovery space.", x: 81, y: 22 },
  ],
};

export const BUILD: Localized<typeof EN.BUILD> = {
  eyebrow: "Build journal",
  title: "Itinatayo mula sa simula.",
  line: "Bawat litrato ng konstruksyon ay nagiging content. Bawat desisyon sa disenyo ay nagiging kuwento.",
  followLabel: "Subaybayan ang pagtatayo",
};

export const DIFFERENT: Localized<typeof EN.DIFFERENT> = {
  eyebrow: "Bakit kami kakaiba",
  title: "Ang nagpapaiba sa amin.",
  items: [
    { title: "Nauna sa lahat", body: "Ang kauna-unahang integrated performance at wellness destination sa Pilipinas" },
    { title: "Recovery infrastructure na malakihan", body: "Tamang pasilidad na ginawa para sa maraming tao, hindi amenities na idinagdag lang. Ang mga nakalaang wellness space sa ikalawang palapag at maraming recovery modality." },
    { title: "Sadyang itinayo, hindi inangkop", body: "Bawat espasyo ay dinisenyo para sa sarili nitong gamit, hindi bodegang ginawang gym o gusaling binago lang ang gamit." },
  ],
};

export const VISION_AHEAD: Localized<typeof EN.VISION_AHEAD> = {
  eyebrow: "Sa hinaharap",
  title: "Ang bisyon sa hinaharap.",
  aspirations: [
    { title: "Isang training destination", body: "Ang lugar na pinipili ng mga atleta para sa camps, kompetisyon, at nakatutok na training blocks" },
    { title: "Isang wellness authority", body: "Pinagkakatiwalaang boses sa performance, recovery, at athletic longevity" },
    { title: "Isang sports tourism icon", body: "Ang huwarang modelo ng integrated performance destination sa Asya" },
  ],
  movement: "Magiging higit pa sa pasilidad ang BaseCamp CamSur: magiging kilusan ito. Pinaplano ng mga atleta ang kanilang taon sa paligid ng mga training camp dito. Dinadala ng mga coach ang kanilang komunidad para sa immersive na karanasan. Pinipili ito ng mga corporate group para sa mga off-site na nakapagpapabago. Dito naglalagi nang ilang buwan ang mga digital nomad.",
  closing: "Hindi tungkol sa pagtatayo ng gym ang bisyon. Tungkol ito sa paglikha ng destinasyon kung saan nagtitipon, nagte-train, at sama-samang umuunlad ang fitness community ng Timog-Silangang Asya.",
  beyondTitle: "Higit pa sa flagship",
  beyond: [
    { title: "Flagship events", body: "Taunang kompetisyon at training camp na magiging regular sa kalendaryo at dadayuhin ng mga international na kalahok." },
    { title: "Mga regional na kompetisyon", body: "Pagho-host ng mga qualifying event para sa malalaking kompetisyon." },
  ],
};

export const PARTNERS: Localized<typeof EN.PARTNERS> = {
  eyebrow: "Mga partner",
  title: "Itinayo kasama ang mga partner.",
  typeLabel: { accommodation: "Tutuluyan", transport: "Transportasyon", wellness: "Wellness", ambassador: "Mga ambassador" },
  typeOrder: ["accommodation", "transport", "wellness", "ambassador"],
};

export const CONTACT: Localized<typeof EN.CONTACT> = {
  eyebrow: "Early access",
  title: "Maging early member.",
  lead: "Sumali sa early access list: early-member rates, eksklusibong updates, at priority access.",
  formEyebrow: "Makipag-ugnayan",
  formTitle: "Dalawang paraan para maabot kami.",
  formIntro: "Sa Early access, mapapasama ka sa early access list. Ang Inquiry ay para sa corporate off-site, camps, group booking, partnership, at media.",
  foundingLink: "Tungkol sa early membership",
  findEyebrow: "Hanapin kami",
  findTitle: "Address at direksyon.",
  findIntro: "Nasa Camarines Sur, Pilipinas ang BaseCamp CamSur. Nasa Visit page ang paraan ng pagpunta, transfers, at mapa.",
  visitLink: "Paano pumunta",
};

export const ABOUT_CTA: Localized<typeof EN.ABOUT_CTA> = {
  title: "Samahan mo kaming bumuo.",
  body: "Sumali sa early access list para sa early-member rates, eksklusibong updates at priority access.",
};
