import type { Metadata } from "next";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { getSiteContent } from "@/content/get";

const PATH = "/membership/faq";
const PLATFORM_NOTE = "Coming soon: online sign-up, class bookings with waitlists, guest-pass tracking, priority booking for Premium members and automated billing.";

export const metadata: Metadata = {
  title: "Membership FAQ",
  description: "Answers on BaseCamp CamSur class-pack validity, guest passes, freezes, cancellations and the founding member offer, plus what the member platform will add.",
};

export default async function MembershipFaqPage() {
  const { settings, pricing } = await getSiteContent();
  const { faq } = pricing;
  const { contact } = settings;

  return (
    <DetailTemplate
      path={PATH}
      hero={<PageHero eyebrow="Membership · FAQ" title="Before you join." intro="How packs, passes and memberships work, and what the member platform will add." image="/images/facilities/facility-detail.jpg" imageAlt="Architectural detail at BaseCamp CamSur" />}
      glance={{
        summary: "Quick answers on memberships, passes and the founding offer, and what the member platform will add.",
        facts: [
          faq.length > 0 && { label: "Questions answered", value: String(faq.length) },
          { label: "Member platform", value: "Coming soon" },
          { label: "Email", value: contact.email },
          { label: "Phone", value: contact.phoneDisplay },
        ],
      }}
      related={["/membership#founding", "/membership/passes", "/contact"]}
      cta={<>
        <CtaBand eyebrow="Still unsure?" title="Ask us anything." body="Send a question and the BaseCamp CamSur team will reply." label="Contact us" href="/contact" />
      </>}
    >
      {faq.length > 0 && (
        <section id="faq" className="section shell mb-faq">
          <div data-reveal><p className="eyebrow">FAQ</p><h2>Questions, answered.</h2></div>
          <div className="mb-faq-list" data-reveal="stagger">
            {faq.map((f) => (
              <details key={f.id} className="mb-faq-item">
                <summary>{f.question}</summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}
      <section id="platform" className="mb-platform">
        <div className="shell mb-platform-inner" data-reveal>
          <p className="eyebrow">Member platform</p>
          <p className="mb-platform-text">{PLATFORM_NOTE}</p>
          {settings.bookingWidgetUrl && <a href={settings.bookingWidgetUrl} target="_blank" rel="noopener noreferrer" className="text-link">Manage membership <span>↗</span></a>}
        </div>
      </section>
    </DetailTemplate>
  );
}
