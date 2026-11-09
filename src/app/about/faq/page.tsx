import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { getSiteContent } from "@/content/get";

const PATH = "/about/faq";

/** What the member platform will add (shown as tiles). */
const PLATFORM = [
  { title: "Online sign-up", body: "Join, pay, and manage your membership without visiting the desk." },
  { title: "Class waitlists", body: "Book classes and join a waitlist when a session is full." },
  { title: "Guest-pass tracking", body: "See and share the guest passes included with your plan." },
  { title: "Priority booking", body: "Premium members book ahead of everyone else." },
  { title: "Automated billing", body: "Monthly payments and receipts handled for you." },
];

export const metadata: Metadata = {
  title: "Membership FAQ",
  description: "Answers on BaseCamp CamSur class-pack validity, guest passes, freezes, cancellations, and the early member offer, plus what the member platform will add.",
};

const pad = (i: number) => String(i + 1).padStart(2, "0");

// Detail template: hero → statement → Common questions (numbered accordion rows) → Member platform (Ink board of
// tiles) → CTA. Same heading / row / board language as the other pages. Anchors kept: #faq, #platform.
export default async function MembershipFaqPage() {
  const { settings, pricing } = await getSiteContent();
  const { faq } = pricing;

  return (
    <DetailTemplate
      path={PATH}
      hero={<PageHero title="Before you join." intro="How packs, passes, and memberships work, and what the member platform will add." image="/images/programs/stations/row.jpg" imageAlt="Athlete on a rowing machine at BaseCamp CamSur" />}
      glance={{ summary: "Packs and passes.\nThe founding offer.\nThe member platform.", statement: true }}
      cta={<CtaBand eyebrow="Still unsure?" title="Ask us anything." body="Send a question and the BaseCamp CamSur team will reply." label="Contact us" href="/contact" />}
    >
      {faq.length > 0 && (
        <section id="faq" className="section sd-ev">
          <div className="shell">
            <div className="sd-tt-head sd-tt-head-light" data-reveal>
              <div><p className="sd-tt-eyebrow">Common questions</p><h2>Answers before you join.</h2></div>
              <p>Tap a question to open the answer. Can&apos;t find yours? <Link href="/contact" className="fq-inline">Contact the team</Link>.</p>
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
            <div><p className="sd-tt-eyebrow">Member platform · Coming soon</p><h2>Your membership, online.</h2></div>
            <p>Everything below arrives with the BaseCamp member platform. Until then, the team handles it for you.</p>
          </div>
          <div className="sd-ev-board">
            <ol className="sd-ev-tiles" data-reveal="stagger">
              {PLATFORM.map((p, n) => (
                <li key={p.title}><span className="sd-ev-num">{pad(n)}</span><h3>{p.title}</h3><p>{p.body}</p></li>
              ))}
            </ol>
            {settings.bookingWidgetUrl && <p className="fq-manage"><a href={settings.bookingWidgetUrl} target="_blank" rel="noopener noreferrer" className="vt-who-cta">Manage membership</a></p>}
          </div>
        </div>
      </section>
    </DetailTemplate>
  );
}
