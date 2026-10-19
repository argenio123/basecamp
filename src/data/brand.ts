// Static brand constants for metadata, JSON-LD and shared notes (spec §B.16).
// Editable positioning copy lives in content `story.positioning`.

export const SITE_NAME = "BaseCamp CamSur";
export const POSITIONING_LINE = "BaseCamp CamSur is Southeast Asia's Performance Playground, where athletes, beginners, and travelers come to train, transform, and thrive: powered by nature, science, and community.";
export const TAGLINE = "Train. Transform. Thrive.";
export const SHORT_LINE = "Train hard. Recover deeper. Live outdoors.";
export const PLAYGROUND = "Southeast Asia's Performance Playground.";
export const PROOF_ROW = ["Purpose-built facilities", "Professional operations", "Authentic community", "Complete ecosystem"] as const;
export const PRIVACY_EMAIL = "basecampcamsur@gmail.com";
export const PRIVACY_NOTE = `We use your details only to contact you about BaseCamp CamSur. To access or delete your data, email ${PRIVACY_EMAIL}.`;
export const KEYWORDS = [
  "BaseCamp CamSur", "Camarines Sur", "CamSur Philippines", "sports tourism", "CrossFit", "HYROX training", "functional fitness",
  "hybrid athletes", "recovery", "cold plunge", "sauna", "contrast therapy", "training camps", "fitness holidays", "wellness retreat",
  "gym near me Naga", "Pili Camarines Sur gym", "Southeast Asia's Performance Playground",
];
export const POSTAL_ADDRESS = { streetAddress: "Capitol Complex", addressLocality: "Pili", postalCode: "4418", addressRegion: "Camarines Sur", addressCountry: "PH" } as const;
// Public routes: see getPublicPaths() in src/content/sitemap.ts (single source of truth).

/** Absolute site origin, without a trailing slash. */
export function siteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL
    || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");
  return url.replace(/\/+$/, "");
}

export function directionsUrl(mapsQuery: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;
}
