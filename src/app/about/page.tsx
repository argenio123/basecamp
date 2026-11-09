import type { Metadata } from "next";
import type { CSSProperties } from "react";
import ScheduleExplore from "@/components/schedule/ScheduleExplore";
import PageHero from "@/components/sections/PageHero";
import AtAGlance from "@/components/ui/AtAGlance";
import { getSiteContent } from "@/content/get";


/** "Inside BaseCamp" links (About sub-pages + contact), each with a gym photo. */
const ABOUT_LINKS = [
  { href: "/about/design", label: "Design & place", summary: "How the facility grows from the landscape, with nature as a training partner.", image: "/images/programs/classes-hero.jpg", imageAlt: "Athletes training in a brick-and-concrete gym" },
  { href: "/about/the-build", label: "The build", summary: "Construction progress, build updates, and the countdown to opening.", image: "/images/programs/stations/sled-push-man.jpg", imageAlt: "Athlete driving a loaded sled" },
  { href: "/about/faq", label: "FAQ", summary: "Answers on membership, booking, and the member platform.", image: "/images/programs/stations/row.jpg", imageAlt: "Athlete on a rowing machine" },
  { href: "/contact?enquiry=partnership", label: "Partner with us", summary: "Lodging, transport, wellness, and athlete partners who share our standards.", image: "/images/facilities/facility-aerial-render.jpg", imageAlt: "Aerial render of the BaseCamp CamSur site" },
  { href: "/contact", label: "Contact", summary: "Questions, partnerships, and corporate inquiries, straight to the team.", image: "/images/programs/generated/personal-coaching.png", imageAlt: "Coach reviewing a session with an athlete" },
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
  description: "BaseCamp CamSur brings performance training, recovery, and community together in one purpose-built destination.",
};

export default async function AboutPage() {
  const c = await getSiteContent();
  const { brandPillars } = c.story;

  return (
    <>
      <PageHero title="More than a gym." intro="Training, recovery, and community in one destination in Camarines Sur." image="/images/hero/hero-training.png" imageAlt="Coach pushing an athlete through a battle-rope set" />

      {/* id="founders" keeps the homepage "Read our story" link (/about#founders) landing on the story summary. */}
      <AtAGlance
        id="founders"
        ghost="About"
        summary={"Train hard.\nRecover well.\nBelong here."}
        statement
      />

      <section className="section sd-ev sd-ev-dark" id="different">
        <div className="shell">
          <div className="sd-tt-head" data-reveal>
            <div><p className="sd-tt-eyebrow">The difference</p><h2>Not another gym.</h2></div>
            <p>How a day at BaseCamp compares with a typical gym, point by point.</p>
          </div>
          <div className="sd-ev-board ab3-compare">
            <div className="ab3-compare-head" aria-hidden="true"><span /><span>Typical gym</span><span>BaseCamp</span></div>
            <ul data-reveal="stagger">
              {COMPARISON.map((row, i) => (
                <li key={row.topic} style={{ "--i": i } as CSSProperties}>
                  <span className="ab3-topic">{row.topic}</span>
                  <span className="ab3-gym"><span className="sr-only">Typical gym: </span>{row.gym}</span>
                  <span className="ab3-bc"><i aria-hidden="true" /><span className="sr-only">BaseCamp: </span>{row.basecamp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section sd-ev sd-ev-band" id="vision">
        <span id="pillars" aria-hidden="true" />
        <div className="shell">
          <div className="sd-tt-head sd-tt-head-light" data-reveal>
            <div><p className="sd-tt-eyebrow">Train · Transform · Thrive</p><h2>Five rules we build by.</h2></div>
            <p>Effort builds you, recovery makes it stick, and community makes it last. Every space, class, and event at BaseCamp has to pass these five tests.</p>
          </div>
          <ol className="sd-ev-rows" data-reveal="stagger">
            {brandPillars.map((pillar, i) => (
              <li key={pillar.id} className="sd-ev-row sd-ev-row-static ab3-row" style={{ "--i": i } as CSSProperties}>
                <div>
                  <span className="sd-ev-when"><strong>{String(i + 1).padStart(2, "0")}</strong></span>
                  <span className="sd-ev-body">
                    <span className="sd-ev-title">{pillar.title}</span>
                    <span className="sd-ev-desc">{pillar.body}</span>
                  </span>
                  {PILLAR_EXAMPLES[pillar.id] && <span className="ab3-practice"><small>In practice</small>{PILLAR_EXAMPLES[pillar.id]}</span>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ScheduleExplore
        eyebrow="Keep exploring"
        title="Inside BaseCamp."
        intro="The design, the build, the questions members ask, partnerships, and how to reach the team."
        items={ABOUT_LINKS}
      />

    </>
  );
}
