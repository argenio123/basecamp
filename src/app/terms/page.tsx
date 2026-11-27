import type { Metadata } from "next";
import Link from "next/link";
import LegalShell, { LegalSectionBlock, Tbc, type LegalSection } from "@/app/privacy/_legal/LegalShell";
import { POSTAL_ADDRESS, PRIVACY_EMAIL, SITE_NAME } from "@/data/brand";
import { PRIVACY_PATH } from "@/data/legal";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms for using the BaseCamp CamSur website: booking requests, online payments, proposed pricing, illustrative images, intellectual property and liability.",
};

const SECTIONS = [
  { id: "about", label: "About these terms" },
  { id: "use-of-site", label: "Using this website" },
  { id: "accounts", label: "Member accounts" },
  { id: "bookings", label: "Bookings and requests" },
  { id: "payments", label: "Online payments" },
  { id: "pricing", label: "Prices and offers" },
  { id: "refunds", label: "Cancellations and refunds" },
  { id: "health", label: "Health and safety" },
  { id: "images", label: "Images, renders and AI illustrations" },
  { id: "ip", label: "Intellectual property" },
  { id: "liability", label: "Liability" },
  { id: "governing-law", label: "Governing law and disputes" },
  { id: "changes", label: "Changes to these terms" },
  { id: "contact", label: "Contact us" },
] as const satisfies readonly LegalSection[];

const section = (id: (typeof SECTIONS)[number]["id"]) => {
  const i = SECTIONS.findIndex((s) => s.id === id);
  return { section: SECTIONS[i], n: i + 1 };
};

const ADDRESS = `${POSTAL_ADDRESS.streetAddress}, ${POSTAL_ADDRESS.addressLocality}, ${POSTAL_ADDRESS.postalCode} ${POSTAL_ADDRESS.addressRegion}, Philippines`;
const Mail = () => <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>;

export default function TermsPage() {
  return (
    <LegalShell
      docName="terms of use"
      eyebrow="Legal"
      title="Terms of Use"
      sections={SECTIONS}
      intro={
        <p>
          These terms apply when you use this website, send us a request, create a member account or pay online. Please
          read them with our <Link href={PRIVACY_PATH}>Privacy Policy</Link>, which explains how we handle your personal data.
        </p>
      }
    >
      <LegalSectionBlock {...section("about")}>
        <p>
          This website is run by {SITE_NAME}, {ADDRESS} <Tbc>legal name of the operating entity or office, to be confirmed</Tbc>.
          By using the site you agree to these terms. If you don&apos;t agree, please don&apos;t use it.
        </p>
        <p>You must be 18 or older to send a booking request, create an account or pay online.</p>
      </LegalSectionBlock>

      <LegalSectionBlock {...section("use-of-site")}>
        <p>You may use this site to learn about BaseCamp CamSur and to contact, book with or buy from us. Please don&apos;t:</p>
        <ul className="lg-list">
          <li>send false information, or submit someone else&apos;s details without their permission;</li>
          <li>try to get around the site&apos;s security, log-in or rate limits, or access accounts or areas that aren&apos;t yours;</li>
          <li>send spam, run automated scripts that overload the site, or upload anything harmful;</li>
          <li>use the site in a way that breaks Philippine law.</li>
        </ul>
        <p>We may block access or remove submissions that break these rules.</p>
      </LegalSectionBlock>

      <LegalSectionBlock {...section("accounts")}>
        <p>
          Keep your password private and your details accurate. You are responsible for what happens under your account,
          so tell us straight away at <Mail /> if you think someone else has used it. We may suspend or close an account
          that breaks these terms. You can ask us to close your account at any time.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock {...section("bookings")}>
        <p>
          <strong>A booking, early-access or enquiry form is a request, not a confirmed reservation.</strong> A booking is
          confirmed only when our team confirms it to you by email or phone. Joining a waitlist does not guarantee a place.
        </p>
        <p>
          BaseCamp CamSur is still under construction. Opening dates, class schedules, programmes, coaches and facilities
          shown on the site are planned and may change. We will tell you if a change affects a booking we have confirmed.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock {...section("payments")}>
        <p>
          Online payments are processed by <strong>PayMongo</strong> (GCash, Maya, cards and other local methods) and
          {" "}<strong>PayPal</strong> on their own secure checkout pages. Their terms also apply to your payment. We never
          see or store your card or e-wallet details.
        </p>
        <ul className="lg-list">
          <li>Prices are charged in Philippine pesos (PHP). Amounts shown in US dollars are approximate and for guidance only.</li>
          <li>Where an item has a price range, only the starting price may be charged online; our team confirms any balance with you before it is due.</li>
          <li>Receipts are emailed by the payment provider, and your payments appear in your account.</li>
          <li>While online payments are being tested, some checkouts run in test mode, where no real money moves. These are labelled as tests.</li>
          <li>Promo codes and the founding-member rate apply only on the terms shown with them and can&apos;t be exchanged for cash.</li>
        </ul>
      </LegalSectionBlock>

      <LegalSectionBlock {...section("pricing")}>
        <p>
          <strong>Prices on this site marked &quot;proposed&quot; or &quot;testing&quot; are not final.</strong> They are
          the rates we plan to charge and may change after market testing. The same applies to proposed discounts, such
          as founding-member and early-booking offers. The price shown at checkout is the price for that purchase.
        </p>
        <p>
          If a price is clearly wrong because of an error, we may cancel the purchase and refund what you paid
          {" "}<Tbc>wording to be confirmed in legal review</Tbc>.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock {...section("refunds")}>
        <div className="lg-placeholder">
          <p><strong>To be provided by BaseCamp CamSur.</strong></p>
          <p>
            <Tbc>Cancellation, refund, membership freeze and no-show policy for memberships, passes, class packs, camps
            and recovery sessions, including how to ask for a refund and how long it takes</Tbc>
          </p>
        </div>
        <p>
          Until this policy is published, contact us at <Mail /> about any cancellation or refund. Nothing in these
          terms affects your rights under the Consumer Act of the Philippines (Republic Act No. 7394).
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock {...section("health")}>
        <p>
          Training and recovery activities such as high-intensity sessions, sauna, cold plunge and contrast therapy carry
          physical risk. Check with a doctor before starting if you have a health condition, injury or pregnancy, and tell
          our coaches about anything that may affect your safety. You may be asked to complete a health declaration and
          participation waiver before your first session <Tbc>waiver and health declaration to be provided separately</Tbc>.
          Information on this site is general and is not medical advice.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock {...section("images")}>
        <p>
          The building is still under construction. <strong>Some images on this site are architectural renders of the
          planned building, and some are AI-generated illustrations.</strong> They show what we are building and the
          experience we intend to offer, and are for illustration only. The finished facilities, equipment, layout,
          finishes and surroundings may differ, and the images are not part of any contract with you.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock {...section("ip")}>
        <p>
          The content of this site, including its text, design, photos, renders, videos and the BaseCamp CamSur name and
          logo, belongs to {SITE_NAME} or the people who licensed it to us. You may view and share pages for personal,
          non-commercial use. Please ask us before copying, republishing or using our content or brand in any other way.
        </p>
        <p>
          Other names mentioned on the site, such as training formats and brands, belong to their owners. Mentioning them
          does not mean those owners endorse or are affiliated with BaseCamp CamSur <Tbc>any official affiliations to be confirmed</Tbc>.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock {...section("liability")}>
        <p className="lg-review">Marked for legal review.</p>
        <p>
          We work to keep this site accurate and available, but we provide it &quot;as is&quot; and can&apos;t promise it
          will always be error-free or uninterrupted. To the extent Philippine law allows, we are not liable for indirect
          or consequential loss arising from your use of the site, or for the content of other websites we link to
          {" "}<Tbc>any cap on liability to be confirmed</Tbc>.
        </p>
        <p>
          Nothing in these terms limits liability that cannot be limited under Philippine law, including liability for
          fraud, bad faith or gross negligence, or your rights as a consumer.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock {...section("governing-law")}>
        <p className="lg-review">Marked for legal review.</p>
        <p>
          These terms are governed by the laws of the Republic of the Philippines. We would rather solve any problem
          with you directly, so please contact us first. If a dispute can&apos;t be settled, it will be brought before the
          proper courts of the Province of Camarines Sur <Tbc>venue to be confirmed</Tbc>, without affecting any right
          you have to bring a consumer complaint before the proper government agency.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock {...section("changes")}>
        <p>
          We may update these terms as the facility opens and our services change. We will change the &quot;last
          updated&quot; date above, and the version on this page at the time of your booking or purchase applies to it.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock {...section("contact")}>
        <p>Questions about these terms: email <Mail />, or write to {SITE_NAME}, {ADDRESS}.</p>
      </LegalSectionBlock>
    </LegalShell>
  );
}
