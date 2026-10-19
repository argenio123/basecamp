import type { Metadata } from "next";
import Link from "next/link";
import { groupsFor } from "@/components/membership/pricing";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatPhp } from "@/content/format";
import { getSiteContent } from "@/content/get";

const PATH = "/membership/corporate";
const ENQUIRE_HREF = "/contact?enquiry=corporate";

export const metadata: Metadata = {
  title: "Corporate Pricing",
  description: "Corporate and team bookings at BaseCamp CamSur: team-building experiences, group training rates and wellness off-sites, quoted on request.",
};

export default async function CorporatePricingPage() {
  const { pricing } = await getSiteContent();
  const groups = groupsFor(pricing.groups, "corporate");
  const group = groups[0];
  const items = groups.flatMap((g) => g.items.filter((i) => i.visible));

  return (
    <DetailTemplate
      path={PATH}
      hero={<PageHero eyebrow="Membership · Corporate" title="Bring your team." intro={items[0]?.description || "Team-building experiences, group training rates and wellness off-sites for organizations."} image="/images/facilities/facility-exterior.jpg" imageAlt="BaseCamp CamSur facility exterior" />}
      glance={{
        summary: "Group training rates, team-building and wellness off-sites for companies, quoted on request for your group and dates.",
        facts: items.slice(0, 3).map((i) => ({ label: i.name, value: formatPhp(i.price) })),
      }}
      related={["/programs/corporate", "/visit/camps", "/contact"]}
      cta={<>
        <CtaBand eyebrow="Corporate" title="Plan your team off-site." body="Tell us about your team, your dates and what you want from the day." label="Inquire about corporate" href={ENQUIRE_HREF} />
      </>}
    >
      <section id="corporate" className="mb-corporate">
        <div className="shell mb-corporate-inner">
          <div data-reveal>
            <p className="eyebrow">{group?.title || "Corporate bookings"}</p>
            <h2>Rates for teams.</h2>
            {group?.intro && <p className="mb-corporate-intro">{group.intro}</p>}
            <Link href="/programs/corporate" className="text-link">See corporate programs <span>→</span></Link>
          </div>
          <div className="mb-corporate-cards" data-reveal="stagger">
            {items.map((item) => (
              <article key={item.id} className="mb-corporate-card">
                {item.availability !== "at-launch" && <StatusBadge availability={item.availability} />}
                <h3>{item.name}</h3>
                <p className="mb-corporate-price">{formatPhp(item.price)}{item.unit && <span> {item.unit}</span>}</p>
                {item.description && <p>{item.description}</p>}
                {item.features.length > 0 && <ul className="mb-checks">{item.features.map((f) => <li key={f}>{f}</li>)}</ul>}
              </article>
            ))}
            <Link href={ENQUIRE_HREF} className="button button-dark mb-corporate-cta">Inquire about corporate <span>↗</span></Link>
          </div>
        </div>
      </section>
    </DetailTemplate>
  );
}
