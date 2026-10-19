import { getSiteContent } from "@/content/get";
import { POSITIONING_LINE, POSTAL_ADDRESS, SITE_NAME, siteUrl, TAGLINE } from "@/data/brand";

/** Organisation JSON-LD. The only dangerouslySetInnerHTML on the site; "<" is escaped. */
export default async function JsonLd() {
  const { settings } = await getSiteContent();
  const url = siteUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": ["SportsActivityLocation", "HealthClub"],
    name: SITE_NAME,
    slogan: TAGLINE,
    description: POSITIONING_LINE,
    url,
    image: `${url}/images/facilities/facility-aerial.jpg`,
    telephone: settings.contact.phoneE164 || undefined,
    email: settings.contact.email || undefined,
    address: { "@type": "PostalAddress", ...POSTAL_ADDRESS },
    sameAs: settings.socials.map((s) => s.url).filter(Boolean),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
