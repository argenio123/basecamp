import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ClassesEditorialHero from "@/components/programs/ClassesEditorialHero";
import CtaBand from "@/components/sections/CtaBand";
import AtAGlance from "@/components/ui/AtAGlance";
import { getSiteContent } from "@/content/get";
import { getSections } from "@/content/sitemap";
import { PARTNERS } from "@/data/about";

const ABOUT_CATEGORIES = getSections([]).find((section) => section.id === "about")?.menu.highlights ?? [];

const ABOUT_CATEGORY_CARDS: Record<string, { image: string; tag: string }> = {
  "/about#vision": { image: "/images/facilities/facility-exterior.jpg", tag: "Why we exist" },
  "/about#pillars": { image: "/images/destination/train.png", tag: "What guides us" },
  "/about/design": { image: "/images/facilities/facility-background-a1-5-b.jpg", tag: "Architecture" },
  "/about/the-build": { image: "/images/facilities/facility-render-a1-3.jpg", tag: "Progress" },
  "/about#different": { image: "/images/destination/transform.png", tag: "The difference" },
  "/contact": { image: "/images/facilities/facility-front.jpg", tag: "Get in touch" },
};

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
  recovery: "Heat, ice and therapy zones on site.",
  community: "Group classes, camps and events.",
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
      <ClassesEditorialHero
        chapter="00"
        eyebrow="About"
        title="Shaped by place."
        intro="Training, recovery and community. One destination in CamSur."
        image="/images/facilities/facility-exterior.jpg"
        imageAlt="BaseCamp CamSur facility surrounded by tropical landscape"
        variant="overview"
        minimalMeta
      />

      {/* id="founders" keeps the homepage "Read our story" link (/about#founders) landing on the story summary. */}
      <AtAGlance
        id="founders"
        ghost="About"
        summary="BaseCamp CamSur is a purpose-built destination where performance training, recovery and community come together, surrounded by the lakes and forests of CamSur."
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
                    {partner.url ? <a href={partner.url} target="_blank" rel="noreferrer">{partner.name} <span aria-hidden="true">↗</span></a> : <strong>{partner.name}</strong>}
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
                <p>We&apos;re looking for partners in accommodation, transport, wellness and athlete ambassadorship who share our standards. Help shape how athletes train, recover and stay in CamSur, from opening day onward.</p>
                <div className="ab2-partner-actions">
                  <Link className="button ab2-partner-primary" href="/contact?enquiry=partnership#enquire">Partner with us <span aria-hidden="true">↗</span></Link>
                  {c.settings.contact.email && <a className="button ab2-partner-secondary" href={`mailto:${c.settings.contact.email}?subject=${encodeURIComponent("Partnership with BaseCamp CamSur")}`}>Email the team <span aria-hidden="true">↗</span></a>}
                </div>
              </div>
          </div>
        </section>
      )}

      <section className="ab-about-categories" aria-labelledby="about-categories-title">
        <div className="shell">
          <p className="eyebrow eyebrow-light" id="about-categories-title">Keep exploring</p>
          <nav aria-label="About categories">
            <ul className="ab-about-category-list" data-reveal="stagger">
              {ABOUT_CATEGORIES.map((category, i) => {
                const card = ABOUT_CATEGORY_CARDS[category.href];
                return (
                  <li key={category.href}>
                    <Link href={category.href}>
                      <span className="ab-about-category-media" aria-hidden="true">
                        {card && <Image src={card.image} alt="" fill sizes="(max-width: 760px) 100vw, (max-width: 1040px) 50vw, 34vw" className="ab-about-category-image" />}
                        <span className="ab-about-category-shade" />
                      </span>
                      <span className="ab-about-category-number" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                      <span className="ab-about-category-copy">
                        {card && <span className="ab-about-category-tag">{card.tag}</span>}
                        <strong>{category.label} <span aria-hidden="true">→</span></strong>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </section>

      <CtaBand eyebrow="Early members" className="ab-cta-expanded" />
    </>
  );
}
