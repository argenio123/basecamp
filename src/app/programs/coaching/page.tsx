import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import StatusBadge from "@/components/ui/StatusBadge";
import { getSiteContent } from "@/content/get";
import { PHASE_COPY } from "@/content/labels";
import {
  COACHES_PLACEHOLDER, MINDSET, MINDSET_INTRO, PERSONALISATION, PERSONALISATION_CLOSING, TESTING_LAB,
} from "@/data/programs-static";

export const metadata: Metadata = {
  title: "Coaching & assessment",
  description: "Baseline testing and reassessment, mental performance training, the coaching team and partner specialists at BaseCamp CamSur.",
};

const pad = (n: number) => String(n).padStart(2, "0");

// Static under cacheComponents: reads only the cached getSiteContent() (spec §0.17).
// Content moved from /programs (stage-3 §1): #assessment, #mindset and #coaches (hidden until real).
export default async function CoachingPage() {
  const c = await getSiteContent();
  const { programmes: p, people } = c;
  const phase = c.settings.launchPhase;
  const coachingDiscipline = p.disciplines.find((d) => d.id === "coaching");
  const hasCoaches = people.coaches.length > 0;


  return (
    <DetailTemplate
      path="/classes/coaching"
      hero={<PageHero eyebrow="Coaching" title="Coaching & assessment." intro={p.assessment.promise} image="/images/programs/program-coaching.png" imageAlt="Coach working one-to-one with an athlete" />}
      glance={{
        summary: "Start with a baseline, train with coaches who plan for progress, and retest before you leave.",
      }}
      related={["/classes/personal-coaching", "/visit/camps", "/schedule/book"]}
      cta={<CtaBand eyebrow="Early members" label={PHASE_COPY[phase].ctaLabel} />}
    >
      <section className="section shell" id="philosophy">
        <div className="pr-philosophy">
          <div className="nv-block-head" data-reveal>
            <p className="eyebrow">Coaching philosophy</p>
            <h2>Coaching-led, athlete-first.</h2>
          </div>
          <div className="pr-prose" data-reveal data-reveal-delay="short">
            {/* The coaching discipline states the same philosophy as the stage-2 placeholder line; show one of them. */}
            {coachingDiscipline ? <p className="pr-lead">{coachingDiscipline.description}</p> : <p className="pr-lead">{COACHES_PLACEHOLDER.body}</p>}
            {!hasCoaches && <p className="pr-note">{COACHES_PLACEHOLDER.title}</p>}
          </div>
        </div>
      </section>

      <section className="section pr-band" id="assessment">
        <div className="shell">
          <div className="nv-block-head" data-reveal>
            <p className="eyebrow">Assessment</p>
            <h2>Outcome-based retreats (not experience-based)</h2>
            <p className="nv-block-intro">{p.assessment.promise}</p>
            <StatusBadge availability={p.assessment.availability} className="pr-heading-badge" />
          </div>
          {p.assessment.steps.length > 0 && (
            <ol className="pr-steps" data-reveal="stagger">
              {p.assessment.steps.map((s, i) => <li key={s.id}><span className="pr-index">{pad(i + 1)}</span><h3>{s.title}</h3><p>{s.description}</p></li>)}
            </ol>
          )}
          {p.assessment.categories.length > 0 && (
            <div className="pr-categories" data-reveal>
              <p className="eyebrow">What we measure</p>
              <ul className="pr-chip-list">{p.assessment.categories.map((cat, i) => <li key={i}>{cat}</li>)}</ul>
            </div>
          )}
          <div className="pr-assessment-grid" data-reveal="stagger">
            <article className="pr-lab">
              <StatusBadge availability={TESTING_LAB.availability} />
              <h3>{TESTING_LAB.title}</h3>
              <p>{TESTING_LAB.description}</p>
              <Link className="text-link" href={TESTING_LAB.cta.href}>{TESTING_LAB.cta.label} <span aria-hidden="true">↗</span></Link>
            </article>
            <div className="pr-personalisation">
              <div className="pr-personalisation-head"><p className="eyebrow">Data-driven personalization</p><StatusBadge availability="planned" /></div>
              <ul>
                {PERSONALISATION.map((item) => <li key={item.id}><h3>{item.title}</h3><p>{item.description}</p></li>)}
              </ul>
              <p className="pr-closing">{PERSONALISATION_CLOSING}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section shell" id="mindset">
        <div className="nv-block-head" data-reveal>
          <p className="eyebrow">Mindset</p>
          <h2>{MINDSET_INTRO}</h2>
          <p className="nv-block-intro">Mental skills built into training: focus, decisions under fatigue, visualization and guided sessions.</p>
          <StatusBadge availability="planned" className="pr-heading-badge" />
        </div>
        <ol className="pr-card-grid pr-card-grid-4" data-reveal="stagger">
          {MINDSET.map((m, i) => <li className="pr-tile" key={m.id}><span className="pr-index">{pad(i + 1)}</span><h3>{m.title}</h3><p>{m.description}</p></li>)}
        </ol>
      </section>

      {hasCoaches && (
        <section className="section pr-band" id="coaches">
          <div className="shell">
            <div className="nv-block-head" data-reveal>
              <p className="eyebrow">Coaches</p>
              <h2>Meet the coaches.</h2>
            </div>
            <ul className="pr-card-grid pr-card-grid-3" data-reveal="stagger">
              {people.coaches.map((coach) => (
                <li className="pr-coach" key={coach.id}>
                  <div className="pr-coach-media"><Image src={coach.image} alt={coach.name} fill sizes="(max-width: 760px) 100vw, 33vw" className="cover-image" /></div>
                  <h3>{coach.name}</h3>
                  <p className="pr-meta">{coach.role}</p>
                  <p>{coach.bio}</p>
                  {coach.credentials.length > 0 && <ul className="pr-chip-list">{coach.credentials.map((cr, i) => <li key={i}>{cr}</li>)}</ul>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </DetailTemplate>
  );
}
