import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { POSTAL_ADDRESS, PRIVACY_EMAIL, SITE_NAME } from "@/data/brand";
import { DPO_NAME, TERMS_PATH } from "@/data/legal";
import { CONSENT_MAX_AGE_DAYS } from "@/lib/consent";
import { LEAD_RETENTION_MONTHS, UNPAID_PAYMENT_RETENTION_DAYS } from "@/lib/privacy/retention";
import LegalShell, { LegalSectionBlock, Tbc, type LegalSection } from "./_legal/LegalShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How BaseCamp CamSur collects, uses, shares and protects your personal data, and how to exercise your rights under the Philippine Data Privacy Act of 2012 (RA 10173).",
};

// Written from the code (forms, member accounts, payments, cookies, storage) as of the "last updated" date.
// When a form field, cookie or service provider changes, update this page too.
const SECTIONS = [
  { id: "who-we-are", label: "Who we are" },
  { id: "what-we-collect", label: "What we collect and why" },
  { id: "sharing", label: "Who we share it with" },
  { id: "transfers", label: "Transfers outside the Philippines" },
  { id: "cookies", label: "Cookies and browser storage" },
  { id: "security", label: "How we protect your data" },
  { id: "retention", label: "How long we keep it" },
  { id: "your-rights", label: "Your rights" },
  { id: "exercise-rights", label: "How to exercise your rights" },
  { id: "dpo", label: "Data Protection Officer" },
  { id: "children", label: "Children" },
  { id: "other-sites", label: "Other websites" },
  { id: "changes", label: "Changes to this policy" },
  { id: "contact", label: "Contact us" },
] as const satisfies readonly LegalSection[];

const section = (id: (typeof SECTIONS)[number]["id"]) => {
  const i = SECTIONS.findIndex((s) => s.id === id);
  return { section: SECTIONS[i], n: i + 1 };
};

const ADDRESS = `${POSTAL_ADDRESS.streetAddress}, ${POSTAL_ADDRESS.addressLocality}, ${POSTAL_ADDRESS.postalCode} ${POSTAL_ADDRESS.addressRegion}, Philippines`;
const Mail = () => <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>;

type Row = { data: string; detail: ReactNode; purpose: ReactNode; basis: ReactNode; retention: ReactNode };

// RA 10173 Sec. 12: (a) consent, (b) contract or steps you ask for before one, (c) legal obligation, (f) legitimate
// interests. Sec. 13(a): consent for sensitive personal information (here: health details you choose to share).
const ROWS: Row[] = [
  {
    data: "Booking requests",
    detail: "First and last name, email, phone, what you want to book (class, appointment, camp or corporate session), preferred date and time, add-ons, group size, whether you'll join a waitlist, your message, and the page you sent it from.",
    purpose: "To check availability, reply to you and confirm or decline the booking.",
    basis: <>Your consent (Sec. 12(a)) and steps you ask us to take before a contract (Sec. 12(b)). Health details you choose to put in your message, such as an injury, are sensitive personal information: we use them only with your consent (Sec. 13(a)) and only to plan your session safely.</>,
    retention: <>{LEAD_RETENTION_MONTHS} months after you send it, then anonymised (see <a href="#retention">section 7</a>) <Tbc>period to be confirmed</Tbc>.</>,
  },
  {
    data: "Early access and membership interest",
    detail: "Name, email, phone, whether you're local, domestic or international, the membership tier and programmes you're interested in.",
    purpose: "To send you early-member news, rates and opening updates, and to understand demand before opening.",
    basis: "Your consent (Sec. 12(a)), given with the tick box on the form.",
    retention: <>Until you withdraw consent, and at most {LEAD_RETENTION_MONTHS} months after you sign up, then anonymised <Tbc>period to be confirmed</Tbc>.</>,
  },
  {
    data: "Enquiries (contact form)",
    detail: "Name, email, phone, the type of enquiry (general, corporate, partnership, camp group or media) and your message.",
    purpose: "To answer your question.",
    basis: "Your consent (Sec. 12(a)) and our legitimate interest in responding to people who contact us (Sec. 12(f)).",
    retention: <>{LEAD_RETENTION_MONTHS} months after you send it, then anonymised <Tbc>period to be confirmed</Tbc>.</>,
  },
  {
    data: "Newsletter sign-up (footer)",
    detail: "Email address and the page you signed up from.",
    purpose: "To send BaseCamp news and opening updates.",
    basis: "Your consent (Sec. 12(a)).",
    retention: <>Until you unsubscribe or ask us to remove you, and at most {LEAD_RETENTION_MONTHS} months, then anonymised.</>,
  },
  {
    data: "Member account",
    detail: "First and last name, email, phone (optional), your password (stored only as a one-way hash, never as readable text) and the date you joined.",
    purpose: "To let you log in, and to show your requests and payments in your account.",
    basis: "Our contract with you (Sec. 12(b)).",
    retention: "While your account is open. When you delete it in your account settings, the account record is deleted straight away.",
  },
  {
    data: "Member profile (optional)",
    detail: "Training goal, experience level, preferred training time, how you like to be contacted, notes you add, and your reminder, update and motion preferences.",
    purpose: "To tailor coaching and reminders to you.",
    basis: <>Our contract with you (Sec. 12(b)); for any health details in your notes, your consent (Sec. 13(a)).</>,
    retention: "As for your member account, and deleted with it. You can change these fields yourself in your account settings.",
  },
  {
    data: "Online payments",
    detail: "Name, email and phone (passed to the payment provider), what you bought, the amount, any promo code and discount, the payment method type (for example GCash, Maya or card), the provider's payment reference, the status and dates, and the period a monthly membership covers.",
    purpose: "To take payment, issue receipts, give you access to what you paid for and keep business records.",
    basis: "Our contract with you (Sec. 12(b)) and our legal obligations to keep tax and accounting records (Sec. 12(c)).",
    retention: <>Paid records: for the period required by Philippine tax and accounting rules <Tbc>period to be confirmed by the business&apos;s accountant</Tbc>, without your name and email once you delete your account. Unpaid checkouts: name and email removed after {UNPAID_PAYMENT_RETENTION_DAYS} days.</>,
  },
  {
    data: "Security data",
    detail: "Your IP address, used to count form submissions and log-in attempts so we can block spam and password guessing.",
    purpose: "To keep the site and your account secure.",
    basis: "Our legitimate interest in security and preventing abuse (Sec. 12(f)).",
    retention: "The counter expires after about 10 to 15 minutes. Our hosting provider keeps its own standard server logs for a short period set by that provider.",
  },
  {
    data: "Website analytics (only if switched on)",
    detail: "Only if you accept analytics cookies: pages viewed, browser and device type, approximate location based on IP, and the type of form sent (for example \"booking\"). Your name, email and message are never sent to analytics.",
    purpose: "To understand how the site is used and improve it.",
    basis: "Your consent (Sec. 12(a)), given with the cookie banner. Google Analytics doesn't load until you press Accept.",
    retention: <>Set in Google Analytics <Tbc>retention setting to be confirmed</Tbc>.</>,
  },
];

export default function PrivacyPage() {
  const analyticsOn = Boolean(process.env.NEXT_PUBLIC_GA_ID);

  return (
    <LegalShell
      docName="privacy policy"
      eyebrow="Legal"
      title="Privacy Policy"
      sections={SECTIONS}
      intro={
        <p>
          This policy explains what personal data {SITE_NAME} collects through this website, why, who else handles it,
          how long we keep it and what your rights are. We follow the Data Privacy Act of 2012 (Republic Act No. 10173),
          its Implementing Rules and Regulations, and the issuances of the National Privacy Commission.
        </p>
      }
    >
      <LegalSectionBlock {...section("who-we-are")}>
        <p>
          {SITE_NAME} is a training, recovery and sports-tourism facility being built at {ADDRESS}. For the personal data
          described here we are the <strong>personal information controller</strong>: we decide why and how it is used.
        </p>
        <dl className="lg-facts">
          <div><dt>Operator</dt><dd><Tbc>legal name of the operating entity or office, to be confirmed</Tbc></dd></div>
          <div><dt>Address</dt><dd>{ADDRESS}</dd></div>
          <div><dt>Privacy contact</dt><dd><Mail /></dd></div>
          <div><dt>NPC registration</dt><dd><Tbc>registration number, if required, to be confirmed</Tbc></dd></div>
        </dl>
      </LegalSectionBlock>

      <LegalSectionBlock {...section("what-we-collect")}>
        <p>
          We only collect what you type into our forms, what you add to your account, what we need to take a payment,
          and a small amount of technical data. We do not sell your personal data, and we do not make decisions about
          you by automated means alone.
        </p>
        <div className="lg-table-wrap">
          <table className="lg-table">
            <caption className="sr-only">Personal data we collect, why, our legal basis under RA 10173 and how long we keep it</caption>
            <thead>
              <tr><th scope="col">Data</th><th scope="col">Purpose</th><th scope="col">Legal basis (RA 10173)</th><th scope="col">How long we keep it</th></tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.data}>
                  <th scope="row" data-label="Data"><strong>{r.data}</strong><span>{r.detail}</span></th>
                  <td data-label="Purpose">{r.purpose}</td>
                  <td data-label="Legal basis">{r.basis}</td>
                  <td data-label="How long we keep it">{r.retention}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Our staff may add a status (new, contacted or closed) and internal notes to your request so the team knows
          where it stands. Every form asks for your agreement before you send it, and the booking, enquiry, early-access and
          newsletter forms and the account sign-up also ask you to confirm you are 18 or older. Forms contain a hidden anti-spam field; if it is filled in, nothing is stored.
        </p>
        <p>
          <strong>Card and e-wallet details never reach this website.</strong> You enter them on the secure checkout
          page of PayMongo or PayPal, and we only receive the payment result, method type and reference.
        </p>
        <p className="lg-status">
          Google Analytics is currently <strong>{analyticsOn ? "switched on" : "switched off"}</strong> on this site.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock {...section("sharing")}>
        <p>
          We share personal data only with service providers that help us run the site (personal information
          processors), and only what they need. They may use it only on our instructions.
        </p>
        <ul className="lg-list">
          <li><strong>Vercel</strong> hosts the website and runs its server code; it handles every request, including the data you send through forms.</li>
          <li><strong>Upstash</strong> provides the database (Redis) where form submissions, member accounts, profiles and payment records are stored.</li>
          <li><strong>PayMongo</strong> processes payments by GCash, Maya, card and other local methods, and emails your receipt.</li>
          <li><strong>PayPal</strong> processes payments made with PayPal.</li>
          <li><strong>Google</strong>: Google Analytics (only when switched on), the Google Maps embed on our Visit page, the optional &quot;add to calendar&quot; links on the schedule, and Gmail, which we use to reply to you by email.</li>
          <li><strong>Cloudinary</strong> hosts our videos. Your browser loads them directly from Cloudinary, which receives your IP address and browser details.</li>
        </ul>
        <p>
          We have or will put in place written agreements with these providers as the Data Privacy Act requires <Tbc>status of data processing agreements to be confirmed</Tbc>.
          We may also disclose personal data when the law requires it, for example to a court or a government agency
          acting under its legal authority, or to our professional advisers under a duty of confidentiality.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock {...section("transfers")}>
        <p>
          Some of these providers store or process data outside the Philippines, for example in the United States,
          Singapore or the European Union <Tbc>exact hosting and database regions to be confirmed</Tbc>. Under the
          principle of accountability in Section 21 of RA 10173, we remain responsible for your personal data when a
          provider processes it abroad, and we rely on contracts and the providers&apos; own security commitments to
          keep it protected to a comparable standard.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock {...section("cookies")}>
        <p>
          We use a few cookies that the site needs to work and, only if you agree, Google Analytics cookies. We do not
          use advertising cookies.
        </p>
        <p>
          <strong>Analytics only with your consent.</strong> When analytics is switched on, a banner asks whether we may
          use analytics cookies. Google Analytics is not loaded at all, and nothing is sent to Google for analytics,
          until you press &quot;Accept&quot;. If you press &quot;Decline&quot;, it stays off. We remember your choice for
          {" "}{Math.round(CONSENT_MAX_AGE_DAYS / 30)} months, then ask again. You can change your mind at any time with
          {" "}&quot;Cookie settings&quot; at the bottom of every page; declining after accepting stops analytics and
          deletes the Google Analytics cookies on this site.
        </p>
        <div className="lg-table-wrap">
          <table className="lg-table lg-table-compact">
            <caption className="sr-only">Cookies and browser storage used by this site</caption>
            <thead><tr><th scope="col">Name</th><th scope="col">What it does</th><th scope="col">Lasts</th></tr></thead>
            <tbody>
              <tr><th scope="row" data-label="Name"><code>bc_member_session</code></th><td data-label="What it does">Keeps you logged in to your member account. Signed so it can&apos;t be forged, and hidden from page scripts (httpOnly).</td><td data-label="Lasts">30 days, or until you log out</td></tr>
              <tr><th scope="row" data-label="Name"><code>bc_member</code></th><td data-label="What it does">A simple &quot;1&quot; that lets the page show &quot;Log in&quot; or &quot;Log out&quot;. It contains no personal data and grants no access.</td><td data-label="Lasts">30 days, or until you log out</td></tr>
              <tr><th scope="row" data-label="Name"><code>bc_admin_session</code>, <code>bc_admin_hint</code></th><td data-label="What it does">Staff only: keeps an authorised staff member logged in to the admin area.</td><td data-label="Lasts">8 hours</td></tr>
              <tr><th scope="row" data-label="Name"><code>bc_analytics_consent</code></th><td data-label="What it does">Remembers whether you accepted or declined analytics cookies. Read only by your browser; it contains no personal data.</td><td data-label="Lasts">{Math.round(CONSENT_MAX_AGE_DAYS / 30)} months</td></tr>
              <tr><th scope="row" data-label="Name"><code>_ga</code>, <code>_ga_*</code></th><td data-label="What it does">Google Analytics, only after you accept analytics cookies: tells visits apart so we can count them.</td><td data-label="Lasts">Up to 2 years (Google&apos;s default)</td></tr>
              <tr><th scope="row" data-label="Name">Browser storage</th><td data-label="What it does">Remembers small display choices on your device: whether you&apos;ve seen the founding-offer pop-up, that you just logged out, and your motion preference. Nothing here is sent to us.</td><td data-label="Lasts">Until you close the tab; the motion preference until you clear it</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          The embedded Google Map may set Google&apos;s own cookies when it loads. You can block or delete cookies in your
          browser settings; if you block <code>bc_member_session</code> you won&apos;t be able to log in.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock {...section("security")}>
        <p>We use reasonable organisational, physical and technical measures, including:</p>
        <ul className="lg-list">
          <li>Passwords are stored only as salted one-way hashes (scrypt), never as readable text.</li>
          <li>Log-in sessions use signed cookies that page scripts can&apos;t read, sent only over secure connections in production.</li>
          <li>The site is served over encrypted HTTPS connections.</li>
          <li>Form submissions and log-in attempts are rate-limited to stop spam and password guessing.</li>
          <li>The staff admin area is password-protected and its sessions end after 8 hours.</li>
          <li>Payment card and e-wallet details are handled entirely by PayMongo and PayPal, never by this site.</li>
          <li>Only authorised staff can see submissions and member records <Tbc>staff access list, confidentiality and training measures to be confirmed</Tbc>.</li>
        </ul>
        <p>
          No system is completely secure. If a personal data breach is likely to put you at real risk of serious harm, we
          will notify the National Privacy Commission and the people affected within 72 hours of learning of it, as NPC
          rules require <Tbc>breach response procedure to be confirmed</Tbc>.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock {...section("retention")}>
        <p>
          We keep personal data only as long as we need it for the purposes above or as the law requires. The periods in
          the table in <a href="#what-we-collect">section 2</a> are proposals <Tbc>retention schedule to be confirmed</Tbc>.
        </p>
        <ul className="lg-list">
          <li>
            <strong>Requests and sign-ups</strong> (bookings, enquiries, early access, newsletter) older than
            {" "}{LEAD_RETENTION_MONTHS} months are anonymised: your name, email, phone and message are replaced with
            {" "}&quot;[deleted]&quot;, and only the date, type and status stay so we can count requests.
          </li>
          <li>
            <strong>Unpaid checkouts</strong> (expired, cancelled, failed or abandoned) lose their name and email after
            {" "}{UNPAID_PAYMENT_RETENTION_DAYS} days. Paid payment records are kept for tax and accounting.
          </li>
          <li>
            <strong>When you delete your account</strong>, this happens straight away for your data (see
            {" "}<a href="#exercise-rights">section 9</a>).
          </li>
        </ul>
        <p>
          Our team runs this clean-up from the admin area; it does not yet run on a fixed schedule <Tbc>how often it
          is run, to be confirmed</Tbc>. When data is no longer needed, we delete it or make it anonymous.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock {...section("your-rights")}>
        <p>Under Sections 16 to 18 of the Data Privacy Act, you have the right to:</p>
        <ul className="lg-list">
          <li><strong>Be informed</strong> that your personal data is being collected and processed, and why. This policy is part of that.</li>
          <li><strong>Access</strong> your personal data: get a copy of it, where it came from, who it was shared with, how it is processed and when it was last changed.</li>
          <li><strong>Object</strong> to processing, including direct marketing, and <strong>withdraw consent</strong> at any time. Withdrawing doesn&apos;t affect processing that already took place.</li>
          <li><strong>Correct</strong> (rectify) inaccurate or incomplete data. You can update your name, phone and preferences yourself in your account settings.</li>
          <li><strong>Erasure or blocking</strong>: ask us to suspend, withdraw, block, remove or destroy your data when it is incomplete, outdated, false, unlawfully obtained, no longer needed or processed without your consent.</li>
          <li><strong>Data portability</strong>: get your data in a commonly used electronic format you can reuse.</li>
          <li><strong>Damages</strong>: be compensated for harm caused by inaccurate, incomplete, outdated, false, unlawfully obtained or unauthorised use of your data.</li>
          <li><strong>File a complaint</strong> with the National Privacy Commission (<a href="https://privacy.gov.ph" target="_blank" rel="noopener noreferrer">privacy.gov.ph<span className="sr-only"> (opens in a new tab)</span></a>). We&apos;d welcome the chance to sort out your concern first.</li>
        </ul>
        <p>Your lawful heirs and assigns may exercise these rights on your behalf after your death or incapacity (Sec. 17).</p>
      </LegalSectionBlock>

      <LegalSectionBlock {...section("exercise-rights")}>
        <p>
          <strong>In your account.</strong> Members can do two things themselves under{" "}
          <Link href="/account/settings#your-data">System settings → Your data</Link>:
        </p>
        <ul className="lg-list">
          <li>
            <strong>Download my data</strong> (access and portability): a JSON file with your account details, profile
            and preferences, the requests you sent us and your payment records. Staff notes on your requests are not in
            the file; email us if you want them.
          </li>
          <li>
            <strong>Delete my account</strong> (erasure): you confirm by typing your email address or &quot;DELETE&quot;
            and your current password. We then delete your account, profile and preferences straight away, anonymise the
            requests you sent us (name, email, phone and message replaced with &quot;[deleted]&quot;; the date and type
            stay for our statistics) and log you out. Payment records are kept only because tax and accounting rules
            require it, with your name and email removed: the item, amount, payment reference and date stay.
          </li>
        </ul>
        <p><strong>By email</strong>, for any right, including if you don&apos;t have an account:</p>
        <ol className="lg-steps">
          <li>Email <Mail /> with the subject &quot;Privacy request&quot; and tell us which right you want to use.</li>
          <li>We may ask you to confirm your identity, for example by replying from the email address we hold for you, so we don&apos;t give your data to someone else.</li>
          <li>We will respond within <Tbc>30 days, to be confirmed</Tbc>. Requests are free of charge <Tbc>to be confirmed</Tbc>.</li>
        </ol>
        <p>
          To stop receiving updates, email us and we&apos;ll remove you. If you can&apos;t log in, email us and
          we&apos;ll delete your account in the same way.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock {...section("dpo")}>
        <dl className="lg-facts">
          <div><dt>Data Protection Officer</dt><dd>{DPO_NAME || "To be appointed"}</dd></div>
          <div><dt>Email</dt><dd><Mail /></dd></div>
          <div><dt>Postal address</dt><dd>Data Protection Officer, {SITE_NAME}, {ADDRESS}</dd></div>
        </dl>
      </LegalSectionBlock>

      <LegalSectionBlock {...section("children")}>
        <p>
          This website and our online services are for people aged 18 and over, and our booking, enquiry,
          early-access and newsletter forms and the account sign-up ask you to confirm you are 18 or older. If you are under 18, please ask a parent or guardian to contact us for you. If we learn that
          we have collected a minor&apos;s data without a parent&apos;s or guardian&apos;s consent, we will delete it.
          {" "}<Tbc>rules for minors joining classes or camps with a guardian, to be confirmed</Tbc>
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock {...section("other-sites")}>
        <p>
          Our pages link to Instagram, Facebook, X, WhatsApp, Google Maps and our payment providers. Those services have
          their own privacy policies, which apply once you leave this site. We don&apos;t embed social media trackers or
          advertising pixels.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock {...section("changes")}>
        <p>
          We will update this policy when our services or the law change, and change the &quot;last updated&quot; date
          above. If a change materially affects how we use your data, we will tell members by email before it takes
          effect <Tbc>notice method to be confirmed</Tbc>. See also our <Link href={TERMS_PATH}>Terms of Use</Link>.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock {...section("contact")}>
        <p>
          Questions about this policy or your data: email <Mail />, or write to the Data Protection Officer, {SITE_NAME},
          {" "}{ADDRESS}.
        </p>
      </LegalSectionBlock>
    </LegalShell>
  );
}
