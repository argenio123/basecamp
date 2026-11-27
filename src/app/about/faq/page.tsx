import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { JsonLdScript } from "@/components/seo/JsonLd";
import { getSiteContent } from "@/content/get";
import { alternatesFor } from "@/i18n/paths";
import { localHref, t } from "@/i18n/server";
import { paymentsLive } from "@/lib/payments/status";

const PATH = "/about/faq";

/** What the member platform will add (shown as tiles). `live`: already available once real online payment is on. */
const PLATFORM = [
  { live: true, title: "Online sign-up", body: "Join, pay, and manage your membership without visiting the desk." },
  { title: "Class waitlists", body: "Book classes and join a waitlist when a session is full." },
  { title: "Guest-pass tracking", body: "See and share the guest passes included with your plan." },
  { title: "Priority booking", body: "Premium members book ahead of everyone else." },
  { title: "Automated billing", body: "Monthly payments and receipts handled for you." },
];

export const metadata: Metadata = {
  title: "Membership FAQ",
  description: "Answers on BaseCamp CamSur class-pack validity, guest passes, freezes, cancellations, and the early member offer, plus what the member platform will add.",
  alternates: alternatesFor(PATH),
};

const pad = (i: number) => String(i + 1).padStart(2, "0");

// Detail template: hero → statement → Common questions (numbered accordion rows) → Member platform (Ink board of
// tiles) → CTA. Same heading / row / board language as the other pages. Anchors kept: #faq, #platform.
export default async function MembershipFaqPage() {
  const { settings, pricing } = await getSiteContent();
  // "{foundingCap}" in an answer shows the founding member cap from Settings, so the FAQ can't drift from it.
  const cap = String(Math.max(0, Math.floor(settings.founding.cap)));
  const faq = pricing.faq.map((f) => ({ ...f, answer: f.answer.replaceAll("{foundingCap}", cap) }));
  // Once real online payment is on, joining and paying online is live: drop it from the coming-soon list.
  const live = paymentsLive();
  const platform = (live ? PLATFORM.filter((p) => !("live" in p && p.live)) : PLATFORM).map((p) => ({ title: t(p.title), body: t(p.body) }));

  return (
    <DetailTemplate
      path={PATH}
      hero={<PageHero variant="editorial" caption={t("FAQ · Packs, passes and memberships")} title={t("Before you join.")} intro={t("How packs, passes, and memberships work, and what the member platform will add.")} image="/images/programs/stations/row.jpg" imageAlt={t("Athlete on a rowing machine at BaseCamp CamSur")} />}
      glance={{ summary: t("Packs and passes.\nThe founding offer.\nThe member platform."), statement: true }}
      cta={<CtaBand eyebrow={t("Still unsure?")} title={t("Ask us anything.")} body={t("Send a question and the BaseCamp CamSur team will reply.")} label={t("Contact us")} href="/contact" />}
    >
      {faq.length > 0 && <JsonLdScript data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }} />}
      {faq.length > 0 && (
        <section id="faq" className="section sd-ev">
          <div className="shell">
            <div className="sd-tt-head sd-tt-head-light" data-reveal>
              <div><p className="sd-tt-eyebrow">{t("Common questions")}</p><h2>{t("Answers before you join.")}</h2></div>
              <p>{t("Tap a question to open the answer. Can't find yours?")} <Link href={localHref("/contact")} className="fq-inline">{t("Contact the team")}</Link>.</p>
            </div>
            <ol className="fq-list" data-reveal="stagger">
              {faq.map((f, n) => (
                <li key={f.id} style={{ "--i": n } as CSSProperties}>
                  <details className="fq-item">
                    <summary><span className="fq-num">{pad(n)}</span><span className="fq-q">{f.question}</span><i aria-hidden="true" /></summary>
                    <p>{f.answer}</p>
                  </details>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section id="platform" className="section sd-ev sd-ev-dark">
        <div className="shell">
          <div className="sd-tt-head" data-reveal>
            <div><p className="sd-tt-eyebrow">{t("Member platform · Coming soon")}</p><h2>{t("Your membership, online.")}</h2></div>
            <p>{live ? t("You can already create an account and pay online. Everything below arrives next; until then, the team handles it for you.") : t("Everything below arrives with the BaseCamp member platform. Until then, the team handles it for you.")}</p>
          </div>
          <div className="sd-ev-board">
            <ol className="sd-ev-tiles" data-reveal="stagger">
              {platform.map((p, n) => (
                <li key={p.title}><span className="sd-ev-num">{pad(n)}</span><h3>{p.title}</h3><p>{p.body}</p></li>
              ))}
            </ol>
            {settings.bookingWidgetUrl && <p className="fq-manage"><a href={settings.bookingWidgetUrl} target="_blank" rel="noopener noreferrer" className="vt-who-cta">{t("Manage membership")}</a></p>}
          </div>
        </div>
      </section>
    </DetailTemplate>
  );
}
