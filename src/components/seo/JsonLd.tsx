import { getSiteContent } from "@/content/get";
import { POSITIONING_LINE, POSTAL_ADDRESS, SITE_NAME, siteUrl, TAGLINE } from "@/data/brand";

/** Renders one JSON-LD block. "<" is escaped so content can never close the script tag. */
export function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

const php = (n: number) => `₱${n.toLocaleString("en-PH")}`;

/** Site-wide business JSON-LD (in the root layout). */
export default async function JsonLd() {
  const { settings, pricing } = await getSiteContent();
  const url = siteUrl();
  // Price range across every visible, priced item that is actually offered (not "planned"), e.g. "₱350–₱45,000".
  const prices = pricing.groups.flatMap((g) => g.items).filter((i) => i.visible && i.availability !== "planned" && i.price && i.price.min > 0)
    .flatMap((i) => [i.price!.min, i.price!.max ?? i.price!.min]);
  const data = {
    "@context": "https://schema.org",
    "@type": ["SportsActivityLocation", "HealthClub"],
    "@id": `${url}/#basecamp`,
    name: SITE_NAME,
    slogan: TAGLINE,
    description: POSITIONING_LINE,
    url,
    logo: `${url}/images/brand/basecamp-green-logo.png`,
    image: [`${url}/images/facilities/facility-aerial.jpg`, `${url}/images/facilities/facility-front.jpg`],
    telephone: settings.contact.phoneE164 || undefined,
    email: settings.contact.email || undefined,
    address: { "@type": "PostalAddress", ...POSTAL_ADDRESS },
    priceRange: prices.length ? `${php(Math.min(...prices))}–${php(Math.max(...prices))}` : undefined,
    currenciesAccepted: "PHP",
    sameAs: settings.socials.map((s) => s.url).filter(Boolean),
  };
  return <JsonLdScript data={data} />;
}
