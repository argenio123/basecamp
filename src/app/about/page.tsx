import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ScheduleExplore from "@/components/schedule/ScheduleExplore";
import PageHero from "@/components/sections/PageHero";
import CtaBand from "@/components/sections/CtaBand";
import AtAGlance from "@/components/ui/AtAGlance";
import { getSiteContent } from "@/content/get";
import { PARTNERS } from "@/data/about";


/** "Inside BaseCamp" links (About sub-pages + contact), each with a gym photo. */
const ABOUT_LINKS = [
  { href: "/about/design", label: "Design & place", summary: "How the facility grows from the landscape, with nature as a training partner.", image: "/images/programs/classes-hero.jpg", imageAlt: "Athletes training in a brick-and-concrete gym" },
  { href: "/about/the-build", label: "The build", summary: "Construction progress, build updates and the countdown to opening.", image: "/images/programs/stations/sled-push-man.jpg", imageAlt: "Athlete driving a loaded sled" },
  { href: "/about/faq", label: "FAQ", summary: "Answers on membership, booking and the member platform.", image: "/images/programs/stations/row.jpg", imageAlt: "Athlete on a rowing machine" },
  { href: "/contact", label: "Contact", summary: "Questions, partnerships and corporate inquiries, straight to the team.", image: "/images/programs/generated/personal-coaching.png", imageAlt: "Coach reviewing a session with an athlete" },
];

/** Philosophy in three statements: the Train → Transform → Thrive journey. */
const PHILOSOPHY = [
  { label: "Train", phase: "Effort", line: "Effort builds you." },
  { label: "Transform", phase: "Adaptation", line: "Recovery makes it stick." },
  { label: "Thrive", phase: "Lifestyle", line: "Community makes it last." },
];

const COMPARISON = [
  { topic: "Setting", gym: "Indoor, crowded floor", basecamp: "Open-air, lakes and jungle" },
  { topic: "Recovery", gym: "An add-on, if any", basecamp: "Built in: heat, ice, therapy" },
  { topic: "Programming", gym: "The same workout, repeated", basecamp: "Coached pathways, start to compete" },
  { topic: "Progress", gym: "How you feel", basecamp: "Tested and tracked" },
  { topic: "Community", gym: "Sign in, leave", basecamp: "Camps, events, a crew" },
];

/** One real example per editable brand pillar (story.brandPillars ids). Pillars without one show no example. */
const PILLAR_EXAMPLES: Record<string, string> = {
  adventure: "Trail intervals and lakeside race courses.",
  recovery: "Heat, ice, and therapy zones on site.",
  community: "Group classes, camps, and events.",
  nature: "Open-air zones built around the landscape.",
  performance: "Baseline testing and tracked progress.",
};

export const metadata: Metadata = {
  title: "About",
  description: "BaseCamp CamSur brings performance training, recovery and community together in one purpose-built destination.",
};

export default async function AboutPage() {
  const c = await getSiteContent();
  const { brandPillars } = c.story;
  const partners = PARTNERS.typeOrder.flatMap((type) => c.people.partners.filter((partner) => partner.type === type));

  return (
    <>
      <PageHero title="More than a gym." intro="Training, recovery, and community. One destination in CamSur." image="/images/hero/hero-training.png" imageAlt="Coach pushing an athlete through a battle-rope set" />

      {/* id="founders" keeps the homepage "Read our story" link (/about#founders) landing on the story summary. */}
      <AtAGlance
        id="founders"
        ghost="About"
        summary={"Train hard.\nRecover well.\nBelong here."}
        statement
      />

      <section className="ab2-philosophy" id="vision" aria-labelledby="ab2-philosophy-title">
        <div className="shell">
          <p className="eyebrow" id="ab2-philosophy-title">Our philosophy</p>
          <ol className="ab2-statements">
            {PHILOSOPHY.map((item, i) => (
              <li key={item.label} data-reveal>
                <span className="ab2-statement-meta"><b>{String(i + 1).padStart(2, "0")}</b><em>{item.label} · {item.phase}</em></span>
                <span className="ab2-statement-line"><span>{item.line}</span></span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="ab2-compare" id="different" aria-labelledby="ab2-compare-title">
        <div className="shell">
          <div className="ab2-head" data-reveal>
            <p className="eyebrow eyebrow-light">The difference</p>
            <h2 id="ab2-compare-title">Not another gym.</h2>
          </div>
          <table className="ab2-compare-table">
            <thead>
              <tr><th scope="col"><span className="sr-only">Topic</span></th><th scope="col">Typical gym</th><th scope="col">BaseCamp</th></tr>
            </thead>
            <tbody data-reveal="stagger">
              {COMPARISON.map((row) => (
                <tr key={row.topic}>
                  <th scope="row">{row.topic}</th>
                  <td>{row.gym}</td>
                  <td><span aria-hidden="true">✓</span>{row.basecamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="ab2-pillars" id="pillars" aria-labelledby="ab2-pillars-title">
        <div className="shell ab2-pillars-grid">
          <div className="ab2-head" data-reveal>
            <p className="eyebrow">Brand principles</p>
            <h2 id="ab2-pillars-title">Five rules we build by.</h2>
          </div>
          <ol className="ab2-timeline">
            {brandPillars.map((pillar, i) => (
              <li key={pillar.id} data-reveal>
                <span className="ab2-timeline-dot" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.body}</p>
                  {PILLAR_EXAMPLES[pillar.id] && <p className="ab2-example"><span>In practice</span>{PILLAR_EXAMPLES[pillar.id]}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {partners.length > 0 ? (
        <section className="ab2-partners" id="partners" aria-labelledby="ab2-partners-title">
          <div className="shell">
              <div className="ab2-head" data-reveal>
                <p className="eyebrow">{PARTNERS.eyebrow}</p>
                <h2 id="ab2-partners-title">{PARTNERS.title}</h2>
              </div>
              <ul className="ab2-partner-list" data-reveal="stagger">
                {partners.map((partner) => (
                  <li key={partner.id}>
                    <span>{PARTNERS.typeLabel[partner.type]}</span>
                    {partner.url ? <a href={partner.url} target="_blank" rel="noreferrer">{partner.name}</a> : <strong>{partner.name}</strong>}
                    {partner.description && <p>{partner.description}</p>}
                  </li>
                ))}
              </ul>
          </div>
        </section>
      ) : (
        /* Full-bleed invite until partners are added in the admin. */
        <section className="ab2-partner-invite" aria-labelledby="ab2-partners-title">
          <Image src="/images/facilities/facility-aerial-render.jpg" alt="" fill sizes="100vw" className="ab2-partner-invite-image" />
          <div className="shell">
              <div className="ab2-partner-invite-copy" data-reveal>
                <p className="eyebrow eyebrow-light">Partners</p>
                <h2 id="ab2-partners-title">Build it with us.</h2>
                <p>We&apos;re looking for partners in accommodation, transport, wellness, and athlete ambassadorship who share our standards. Help shape how athletes train, recover, and stay in CamSur, from opening day onward.</p>
                <div className="ab2-partner-actions">
                  <Link className="button ab2-partner-primary" href="/contact?enquiry=partnership#enquire">Partner with us</Link>
                  {c.settings.contact.email && <a className="button ab2-partner-secondary" href={`mailto:${c.settings.contact.email}?subject=${encodeURIComponent("Partnership with BaseCamp CamSur")}`}>Email the team</a>}
                </div>
              </div>
          </div>
        </section>
      )}

      <ScheduleExplore
        eyebrow="Keep exploring"
        title="Inside BaseCamp."
        intro="The design, the build, the questions members ask, and how to reach the team."
        items={ABOUT_LINKS}
      />

      <CtaBand eyebrow="Early members" className="ab-cta-expanded" />
    </>
  );
}
