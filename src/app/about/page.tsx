import type { Metadata } from "next";
import type { CSSProperties } from "react";
import ScheduleExplore from "@/components/schedule/ScheduleExplore";
import { Split, Stats } from "@/components/sections/Layouts";
import PageHero from "@/components/sections/PageHero";
import AtAGlance from "@/components/ui/AtAGlance";

/** "Inside BaseCamp" links: the About sub-pages, each with a photo. */
const ABOUT_LINKS = [
  { href: "/about/design", label: "Design & place", summary: "How the building is laid out.", image: "/images/facilities/facility-render-a1-3.jpg", imageAlt: "Architectural render of the BaseCamp CamSur facility" },
  { href: "/about/the-build", label: "The build", summary: "Construction progress to opening.", image: "/images/programs/stations/sled-push-man.jpg", imageAlt: "Athlete driving a loaded sled" },
  { href: "/about/faq", label: "FAQ", summary: "Common questions, answered.", image: "/images/programs/stations/row.jpg", imageAlt: "Athlete on a rowing machine" },
];

/** Who BaseCamp is, in four tags. */
const WHO_CHIPS = ["CrossFit-style & HYROX-style", "Recovery on site", "Camps & events", "Open-air training"];

/** The brand promise (Train · Transform · Thrive), one line each. */
const PROMISE = [
  { value: "Train", label: "Structured effort that builds you." },
  { value: "Transform", label: "Recovery, where growth happens." },
  { value: "Thrive", label: "Community and lasting change." },
];

const COMPARISON = [
  { topic: "Setting", gym: "Indoor, crowded floor", basecamp: "Open-air, lakes and jungle" },
  { topic: "Recovery", gym: "An add-on, if any", basecamp: "Built in: heat, ice, therapy" },
  { topic: "Programming", gym: "The same workout, repeated", basecamp: "Coached pathways, start to compete" },
  { topic: "Progress", gym: "How you feel", basecamp: "Tested and tracked" },
  { topic: "Community", gym: "Sign in, leave", basecamp: "Camps, events, a crew" },
];

export const metadata: Metadata = {
  title: "About",
  description: "BaseCamp CamSur brings performance training, recovery, and community together in one purpose-built destination.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero title="More than a gym." intro="Training, recovery, and community in one destination in Camarines Sur." image="/images/facilities/facility-aerial-render.jpg" imageAlt="Aerial view of the BaseCamp CamSur building, lawns, and parking" imagePosition="center 45%" />

      {/* id="founders" keeps the homepage "Read our story" link (/about#founders) landing on the story summary. */}
      <AtAGlance
        id="founders"
        ghost="About"
        summary={"Train hard.\nRecover well.\nBelong here."}
        statement
      />

      <Split id="who" eyebrow="Who we are" title="Sports first. Recovery built in." body="A purpose-built performance destination in Pili, Camarines Sur."
        chips={WHO_CHIPS} image="/images/facilities/facility-exterior.jpg" imageAlt="BaseCamp CamSur facility exterior with the shield logo on the glass" />

      <Stats id="promise" look="band" eyebrow="Our promise" title="Train. Transform. Thrive." items={PROMISE} />

      <section className="section sd-ev sd-ev-dark" id="different">
        <div className="shell">
          <div className="sd-tt-head" data-reveal>
            <div><p className="sd-tt-eyebrow">The difference</p><h2>Not another gym.</h2></div>
            <p>BaseCamp vs a typical gym.</p>
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

      <ScheduleExplore
        eyebrow="Keep exploring"
        title="Inside BaseCamp."
        intro="The design, the build, and the FAQ."
        items={ABOUT_LINKS}
      />

    </>
  );
}
