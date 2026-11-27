import type { Metadata } from "next";
import type { CSSProperties } from "react";
import ScheduleExplore from "@/components/schedule/ScheduleExplore";
import PageHero from "@/components/sections/PageHero";
import { alternatesFor } from "@/i18n/paths";
import { localHref, t } from "@/i18n/server";

/** "Inside BaseCamp" links: the About sub-pages, each with a photo. */
const ABOUT_LINKS = [
  { href: "/about/design", label: "Design & place", summary: "How the building is laid out.", image: "/images/facilities/facility-render-a1-3.jpg", imageAlt: "Architectural render of the BaseCamp CamSur facility" },
  { href: "/about/the-build", label: "The build", summary: "Construction progress to opening.", image: "/images/programs/stations/sled-push-man.jpg", imageAlt: "Athlete driving a loaded sled" },
  { href: "/about/faq", label: "FAQ", summary: "Common questions, answered.", image: "/images/programs/stations/row.jpg", imageAlt: "Athlete on a rowing machine" },
];

/** The BaseCamp offer, kept intentionally short. */
const WHO_CHIPS = ["Train", "Recover", "Compete", "Belong"];

const COMPARISON = [
  { topic: "Place", gym: "Indoor floor", basecamp: "Open air. Lake. Jungle." },
  { topic: "Recovery", gym: "Optional add-on", basecamp: "Heat. Ice. Therapy." },
  { topic: "Progress", gym: "One-size workouts", basecamp: "Coached. Tested. Tracked." },
];

export const metadata: Metadata = {
  title: "About",
  description: "BaseCamp CamSur brings performance training, recovery, and community together in one purpose-built destination.",
  alternates: alternatesFor("/about"),
};

// Module-level lists hold the English text; it is translated here, in the request locale (/fil/about reuses this page).
export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="BaseCamp CamSur" title={t("Built for more.")} intro={t("Train. Recover. Thrive. In CamSur.")} image="/images/facilities/facility-aerial-render.jpg" imageAlt={t("Aerial view of the BaseCamp CamSur building, lawns, and parking")} imagePosition="center 45%" />

      <section id="founders" className="section sd-ev lx-split-section">
        <div className="shell">
          <div className="lx-split-copy" data-reveal>
            <p className="sd-tt-eyebrow">{t("The BaseCamp way")}</p>
            <h2>{t("Train. Recover. Thrive.")}</h2>
            <p className="lx-split-body">{t("One performance destination in Pili.")}</p>
            <ul className="lx-chips">{WHO_CHIPS.map((chip) => <li key={chip}>{t(chip)}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="section sd-ev sd-ev-dark" id="different">
        <div className="shell">
          <div className="sd-tt-head" data-reveal>
            <div><p className="sd-tt-eyebrow">{t("Why BaseCamp")}</p><h2>{t("The difference is built in.")}</h2></div>
          </div>
          <div className="sd-ev-board ab3-compare">
            <div className="ab3-compare-head" aria-hidden="true"><span /><span>{t("Typical gym")}</span><span>BaseCamp</span></div>
            <ul data-reveal="stagger">
              {COMPARISON.map((row, i) => (
                <li key={row.topic} style={{ "--i": i } as CSSProperties}>
                  <span className="ab3-topic">{t(row.topic)}</span>
                  <span className="ab3-gym"><span className="sr-only">{t("Typical gym")}: </span>{t(row.gym)}</span>
                  <span className="ab3-bc"><i aria-hidden="true" /><span className="sr-only">BaseCamp: </span>{t(row.basecamp)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ScheduleExplore
        eyebrow={t("Explore")}
        title={t("Inside BaseCamp.")}
        intro={t("Design. Build. Answers.")}
        items={ABOUT_LINKS.map((l) => ({ ...l, href: localHref(l.href), label: t(l.label), summary: t(l.summary), imageAlt: t(l.imageAlt) }))}
      />

    </>
  );
}
