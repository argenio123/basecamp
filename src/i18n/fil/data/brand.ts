// Filipino draft of the user-facing strings in src/data/brand.ts. Same export names and types. Not included (no text
// to translate, use the English module): SITE_NAME, TAGLINE (brand tagline stays English, see GLOSSARY.md),
// PRIVACY_EMAIL, POSTAL_ADDRESS, siteUrl, directionsUrl and the video URL helpers.
import type * as EN from "@/data/brand";
import type { Localized } from "../localized";
import { PRIVACY_EMAIL } from "@/data/brand";

export const POSITIONING_LINE: Localized<typeof EN.POSITIONING_LINE> = "Ang BaseCamp CamSur ang Performance Playground ng Timog-Silangang Asya, kung saan pumupunta ang mga atleta, baguhan, at biyahero para mag-train, mag-transform, at umunlad: pinapagana ng kalikasan, agham, at komunidad.";
export const SHORT_LINE: Localized<typeof EN.SHORT_LINE> = "Mag-train nang todo. Mag-recover nang mas malalim. Mamuhay sa labas.";
export const PLAYGROUND: Localized<typeof EN.PLAYGROUND> = "Ang Performance Playground ng Timog-Silangang Asya.";
export const PROOF_ROW: Localized<typeof EN.PROOF_ROW> = ["Mga pasilidad na sadyang itinayo", "Propesyonal na operasyon", "Tunay na komunidad", "Kumpletong ecosystem"];
export const PRIVACY_NOTE: Localized<typeof EN.PRIVACY_NOTE> = `Ginagamit namin ang iyong detalye para asikasuhin ang request mo at, kung pumayag ka, para magpadala ng updates mula sa BaseCamp CamSur. Para makita o burahin ang iyong data, mag-email sa ${PRIVACY_EMAIL}.`;
/** SEO keywords: the English terms plus the Filipino searches locals actually type. */
export const KEYWORDS: Localized<typeof EN.KEYWORDS> = [
  "BaseCamp CamSur", "Camarines Sur", "CamSur Philippines", "sports tourism", "CrossFit", "HYROX training", "functional fitness",
  "hybrid athletes", "recovery", "cold plunge", "sauna", "contrast therapy", "training camps", "fitness holidays", "wellness retreat",
  "gym near me Naga", "Pili Camarines Sur gym", "Southeast Asia's Performance Playground",
  "gym sa Naga", "gym sa Pili Camarines Sur", "gym sa CamSur", "training camp sa Pilipinas",
];
