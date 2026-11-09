import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import BuildCountdown from "@/components/about/BuildCountdown";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatDateLabel } from "@/content/format";
import { getSiteContent } from "@/content/get";
import { PHASE_COPY } from "@/content/labels";
import { ABOUT_CTA, ABOUT_GLANCE, BUILD, BUILD_HERO, VISION_AHEAD } from "@/data/about";

export const metadata: Metadata = {
  title: "The Build",
  description: "Follow the build of BaseCamp CamSur in Camarines Sur: construction updates, the road to opening, and what comes next for the training destination.",
};

const pad = (i: number) => String(i + 1).padStart(2, "0");
const i = (n: number) => ({ "--i": n }) as CSSProperties;

// Detail template: hero → statement → Build journal (countdown + dated update rows) → Road to opening (Ink board:
// phase tiles + readiness checklist) → What comes next (rows) → CTA. The countdown reads the clock on the client only,
// so the page stays static. Anchors kept for older links: #build, #progress, #vision-ahead.
export default async function AboutBuildPage() {
  const c = await getSiteContent();
  const b = c.home.build;
  const phase = c.settings.launchPhase;
  const live = phase === "live";
  const updates = c.story.buildUpdates;
  const opening = c.settings.openingDate ? formatDateLabel(c.settings.openingDate) : "";
  const headTitle = live ? b.liveTitle || BUILD.title : b.title || BUILD.title;
  const headIntro = live ? b.liveBody : b.intro;

  const phases = [
    { label: "Vision & planning", state: "complete" },
    { label: "Construction", state: phase === "pre-launch" ? "current" : "complete" },
    { label: "Soft opening", state: phase === "soft-opening" ? "current" : live ? "complete" : "upcoming" },
    { label: "Open doors", state: live ? "current" : "upcoming" },
  ] as const;
  const STATE_LABEL = { complete: "Done", current: "Now", upcoming: "Next" } as const;
  const readiness = [
    { label: "Design direction", note: "Published", ready: true },
    { label: "Facility renders", note: "Published", ready: true },
    { label: "Opening date", note: opening || "To be announced", ready: Boolean(opening) },
    { label: "Coach line-up", note: c.people.coaches.length > 0 ? `${c.people.coaches.length} announced` : "In preparation", ready: c.people.coaches.length > 0 },
    { label: "Bookable timetable", note: c.schedule.timetable.length > 0 ? `${c.schedule.timetable.length} sessions listed` : "In preparation", ready: c.schedule.timetable.length > 0 },
  ];

  return (
    <DetailTemplate
      path="/about/the-build"
      hero={<PageHero title={BUILD_HERO.title} intro={BUILD_HERO.intro} image={BUILD_HERO.image} imageAlt={BUILD_HERO.imageAlt} />}
      glance={{ summary: ABOUT_GLANCE.build, statement: true }}
      cta={<CtaBand title={ABOUT_CTA.title} body={ABOUT_CTA.body} label={c.settings.founding.enabled ? c.settings.founding.ctaLabel || undefined : undefined} href="/contact" />}
    >
      <section id="build" className="section sd-ev">
        <div className="shell">
          <div className="sd-tt-head sd-tt-head-light" data-reveal>
            <div><p className="sd-tt-eyebrow">Build journal</p><h2>{headTitle}</h2></div>
            <div className="bd-head-side">
              <p>{headIntro ? `${headIntro} ` : ""}{BUILD.line}</p>
              {b.enabled && (live
                ? <Link href="/schedule/book" className="vt-who-cta">{PHASE_COPY.live.ctaLabel}</Link>
                : <div className="bd-countdown"><BuildCountdown openingDate={c.settings.openingDate} /></div>)}
            </div>
          </div>
          {b.enabled && b.launchVideoUrl && <video className="ab-build-video" controls preload="none" poster="/images/hero/hero-training.png" src={b.launchVideoUrl} data-reveal />}
          {updates.length > 0 && (
            <ol className="sd-ev-rows" data-reveal="stagger">
              {updates.map((u, n) => (
                <li key={u.id} className="sd-ev-row sd-ev-row-static ab3-row" style={i(n)}>
                  <div>
                    <span className="sd-ev-when"><strong>{pad(n)}</strong><small>{u.date ? formatDateLabel(u.date) : u.tag}</small></span>
                    <span className="sd-ev-body">
                      <span className="sd-ev-title">{u.title}</span>
                      <span className="sd-ev-desc">{u.body}</span>
                    </span>
                    {u.tag && <span className="bd-tag">{u.tag}</span>}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <section id="progress" className="section sd-ev sd-ev-dark">
        <div className="shell">
          <div className="sd-tt-head" data-reveal>
            <div><p className="sd-tt-eyebrow">Road to opening</p><h2>What&apos;s done. What&apos;s next.</h2></div>
            <p>Progress is shown as real milestones, not an invented percentage. This board updates as dates, coaches, and sessions are published.</p>
          </div>
          <div className="sd-ev-board bd-board">
            <ol className="sd-ev-tiles bd-phases" aria-label="Build phases" data-reveal="stagger">
              {phases.map((p, n) => (
                <li key={p.label} data-state={p.state}>
                  <span className="sd-ev-num">{pad(n)}</span>
                  <h3>{p.label}</h3>
                  <span className="bd-state">{STATE_LABEL[p.state]}</span>
                </li>
              ))}
            </ol>
            <ul className="bd-checks" aria-label="Opening readiness" data-reveal="stagger">
              {readiness.map((r) => (
                <li key={r.label} data-ready={r.ready ? "true" : "false"}>
                  <i aria-hidden="true" />
                  <strong>{r.label}</strong>
                  <span>{r.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="vision-ahead" className="section sd-ev sd-ev-band">
        <div className="shell">
          <div className="sd-tt-head sd-tt-head-light" data-reveal>
            <div><p className="sd-tt-eyebrow">What comes next</p><h2>{VISION_AHEAD.title}</h2></div>
            <p>{VISION_AHEAD.closing}</p>
          </div>
          <ol className="sd-ev-rows" data-reveal="stagger">
            {VISION_AHEAD.aspirations.map((a, n) => (
              <li key={a.title} className="sd-ev-row sd-ev-row-static ab3-row" style={i(n)}>
                <div>
                  <span className="sd-ev-when"><strong>{pad(n)}</strong><small>Goal</small></span>
                  <span className="sd-ev-body"><span className="sd-ev-title">{a.title}</span><span className="sd-ev-desc">{a.body}.</span></span>
                </div>
              </li>
            ))}
            {VISION_AHEAD.beyond.map((a, n) => (
              <li key={a.title} className="sd-ev-row sd-ev-row-static ab3-row" style={i(n + VISION_AHEAD.aspirations.length)}>
                <div>
                  <span className="sd-ev-when"><strong>{pad(n + VISION_AHEAD.aspirations.length)}</strong><small>{VISION_AHEAD.beyondTitle}</small></span>
                  <span className="sd-ev-body"><span className="sd-ev-title">{a.title}</span><span className="sd-ev-desc">{a.body}</span></span>
                  <StatusBadge availability="planned" />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </DetailTemplate>
  );
}
