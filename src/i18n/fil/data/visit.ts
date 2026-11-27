// Filipino draft of src/data/visit.ts. Same export names; images are identical to the English file.
import type * as EN from "@/data/visit";
import type { VisitItem } from "@/data/visit";
import type { Localized } from "../localized";

// ---------- /visit (overview) ----------
export const VISIT_META: Localized<typeof EN.VISIT_META> = {
  title: "Bumisita",
  description: "Planuhin ang pagbisita mo sa BaseCamp CamSur sa Pili, Camarines Sur: address, mapa, at direksyon, may flights papuntang Naga o Legazpi, car rental, at van transfers. Madaling puntahan mula Manila.",
};

export const VISIT_HERO: Localized<typeof EN.VISIT_HERO> = {
  title: "Tara, mag-train tayo.",
  intro: "Nasa Pili, Camarines Sur ang BaseCamp CamSur, madaling puntahan mula Manila. Ganito kami mahahanap.",
  image: "/images/programs/generated/endurance.webp",
  imageAlt: "Atletang tumatakbo sa curved treadmill sa open-air gym na may mga bundok sa likod",
};

export const VISIT_GLANCE: Localized<typeof EN.VISIT_GLANCE> = {
  summary: "Lumipad papuntang Naga o Legazpi.\nMagbiyahe papuntang Pili.\nMag-train sa BaseCamp.",
};

export const GETTING_THERE: Localized<typeof EN.GETTING_THERE> = {
  eyebrow: "Paano pumunta",
  title: "Hanapin ang BaseCamp.",
  directionsLabel: "Kunin ang direksyon",
  line: "Madaling puntahan mula Manila.",
  airports: "Naga o Legazpi",
  options: [
    { title: "Flights papuntang Naga o Legazpi", body: "May mga airline na lumilipad sa parehong airport." },
    { title: "Car rental", body: "Mga serbisyo ng car rental." },
    { title: "Van transfers", body: "Mga operator ng van transfer." },
    { title: "Villa Del Rey shuttle", body: "Koordinasyon ng shuttle: iaanunsyo pa ang detalye." },
  ] satisfies VisitItem[],
};

export const VISIT_CTA: Localized<typeof EN.VISIT_CTA> = { eyebrow: "Planuhin ang pagbisita mo" };

// ---------- /visit/why-camsur ----------
export const WHY_META: Localized<typeof EN.WHY_META> = {
  title: "Bakit CamSur",
  description: "Mag-train buong taon sa Camarines Sur, kasama ang mga freshwater lake, forest trail, at bulubunduking terrain.",
};

export const WHY_HERO: Localized<typeof EN.WHY_HERO> = {
  title: "Mag-train kung saan lumalaban ang kalikasan.",
  intro: "Lawa, gubat, at bundok, hindi beach.",
  image: "/images/visit/generated/why-camsur-basecamp-community.webp",
  imageAlt: "Mga atleta at bisitang nagtitipon sa cafeteria at lounge ng BaseCamp CamSur",
};

export const WHY_GLANCE: Localized<typeof EN.WHY_GLANCE> = {
  summary: "Freshwater, hindi beach.\nTraining buong taon.\nConditioning sa lawa.",
  eyebrow: "Bakit CamSur",
};

export const WHY_STATS_INTRO: Localized<typeof EN.WHY_STATS_INTRO> = "Pinagsasama ng CamSur ang maaasahang kondisyon sa labas, freshwater training, bulubunduking terrain, at praktikal na access sa pamamagitan ng mga kalapit na regional airport.";

export const WHY_STATS: Localized<typeof EN.WHY_STATS> = [
  { value: "365", label: "Mag-train sa labas buong taon, may mainit na panahon at mahahabang araw na puwedeng pag-training-an." },
  { value: "Lawa", label: "Swak ang freshwater sa open-water swimming, paddling, wakeboarding, at low-impact conditioning." },
  { value: "Presko", label: "Mas kalmadong umaga at hangin ng bundok ang nagpapagaan sa mas mahahabang endurance session." },
  { value: "Malapit", label: "Lumipad via Naga o Legazpi, tapos magbiyahe sa kalsada papuntang BaseCamp sa Pili." },
];

export const WHY_CONTRAST: Localized<typeof EN.WHY_CONTRAST> = {
  eyebrow: "Bakit ito epektibo",
  title: "Swak para sa training.",
  intro: "Nagdadagdag ang tanawin ng kapaki-pakinabang na variety sa training nang hindi inilalayo ang mga atleta sa BaseCamp.",
  items: [
    { title: "Freshwater", body: "Ang kalmadong tubig sa loob ng lupain ay kontroladong setting para sa open-water swims, paddle session, at recovery days." },
    { title: "Kabundukan", body: "Ang mga kalapit na trail at mahahabang akyatin ay nagdadagdag ng elevation, teknikal na terrain, at aerobic variety sa bawat camp." },
    { title: "Buong taon", body: "Dahil sa tropikal na klima ng CamSur, praktikal ang outdoor session sa bawat season, mula sunrise conditioning hanggang evening runs." },
  ],
};

// ---------- /visit/camps ----------
export const CAMPS_META: Localized<typeof EN.CAMPS_META> = {
  title: "Camps at Trips",
  description: "Weekend camps, isang linggong training trips, at CamSur field trips sa BaseCamp CamSur.",
};

export const CAMPS_HERO: Localized<typeof EN.CAMPS_HERO> = {
  title: "Mag-train nang todo. Magtagal pa.",
  intro: "Mag-train, mag-recover, at manatili nang magkakasama.",
  image: "/images/visit/generated/camps-and-trips-arrival.webp",
  imageAlt: "Mga guest ng training camp na dumarating dala ang kanilang travel bags at sinasalubong ang kanilang coach",
};

export const CAMPS_GLANCE: Localized<typeof EN.CAMPS_GLANCE> = {
  summary: "Weekend camps.\nIsang linggong trips.\nCamSur field trips.",
};

export const CAMPS: Localized<typeof EN.CAMPS> = {
  eyebrow: "Bakit mag-camp sa BaseCamp · 4 na benepisyo",
  title: "Higit pa sa training trip.",
  caption: "BaseCamp camps at trips · Phase 2 inquiry",
  benefits: [
    { title: "May coach mula unang araw", body: "Bawat training block ay pinaplano at pinangungunahan ng isang BaseCamp coach.", image: "/images/visit/generated/basecamp-camp-group.webp" },
    { title: "Recovery sa mismong lugar", body: "Sauna, ice bath, masahe, at physio sa pagitan ng mga session.", image: "/images/facilities/2F Plunge.webp" },
    { title: "CamSur sa harap mo mismo", body: "Mga trail, bundok, at sariwang tubig malapit sa camp.", image: "/images/visit/generated/why-camsur-lake-training.webp" },
    { title: "Mag-train bilang iisang crew", body: "Mag-train, kumain, at manatili kasama ang grupo mo.", image: "/images/membership/generated/founding-members-community.webp" },
  ],
  flowEyebrow: "Ang camp experience",
  flowTitle: "Train. Explore. Recover.",
  flowNote: "Pareho ang rhythm ng bawat camp, mula sa araw ng pagdating mo hanggang sa huli mong recovery session.",
  flow: [
    { value: "Dumating", label: "Kilalanin ang coach mo at mag-settle in." },
    { value: "Mag-train", label: "Mga coached session sa BaseCamp." },
    { value: "Mag-explore", label: "Tumakbo sa trails at lumangoy sa sariwang tubig." },
    { value: "Mag-recover", label: "Mag-relax sa init, yelo, at therapy." },
  ],
};

export const CAMPS_CTA: Localized<typeof EN.CAMPS_CTA> = { eyebrow: "Camps at trips" };
