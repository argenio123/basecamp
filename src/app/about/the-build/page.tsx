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
import { getData } from "@/i18n/data";
import { alternatesFor } from "@/i18n/paths";
import { localHref, t } from "@/i18n/server";

export const metadata: Metadata = {
  title: "The Build",
  description: "Follow the build of BaseCamp CamSur in Camarines Sur: construction updates, the road to opening, and what comes next for the training destination.",
  alternates: alternatesFor("/about/the-build"),
};

const pad = (i: number) => String(i + 1).padStart(2, "0");
const i = (n: number) => ({ "--i": n }) as CSSProperties;

// Detail template: hero → statement → Build journal (countdown + dated update rows) → Road to opening (Ink board:
// phase tiles + readiness checklist) → What comes next (rows) → CTA. The countdown reads the clock on the client only,
// so the page stays static. Anchors kept for older links: #build, #progress, #vision-ahead.
export default async function AboutBuildPage() {
  const c = await getSiteContent();
  const { ABOUT_CTA, ABOUT_GLANCE, BUILD, BUILD_HERO, VISION_AHEAD } = getData("about");
  const b = c.home.build;
  const phase = c.settings.launchPhase;
  const live = phase === "live";
  const updates = c.story.buildUpdates;
  const opening = c.settings.openingDate ? formatDateLabel(c.settings.openingDate) : "";
  const headTitle = live ? b.liveTitle || BUILD.title : b.title || BUILD.title;
  const headIntro = live ? b.liveBody : b.intro;

  const phases = [
    { label: t("Vision & planning"), state: "complete" },
    { label: t("Construction"), state: phase === "pre-launch" ? "current" : "complete" },
    { label: t("Soft opening"), state: phase === "soft-opening" ? "current" : live ? "complete" : "upcoming" },
    { label: t("Open doors"), state: live ? "current" : "upcoming" },
  ] as const;
  const STATE_LABEL = { complete: t("Done"), current: t("Now"), upcoming: t("Next") };
  const readiness = [
    { label: t("Design direction"), note: t("Published"), ready: true },
    { label: t("Facility renders"), note: t("Published"), ready: true },
    { label: t("Opening date"), note: opening || t("To be announced"), ready: Boolean(opening) },
    { label: t("Coach line-up"), note: c.people.coaches.length > 0 ? t("{count} announced", { count: c.people.coaches.length }) : t("In preparation"), ready: c.people.coaches.length > 0 },
    { label: t("Bookable timetable"), note: c.schedule.timetable.length > 0 ? t("{count} sessions listed", { count: c.schedule.timetable.length }) : t("In preparation"), ready: c.schedule.timetable.length > 0 },
  ];

  return (
    <DetailTemplate
      path="/about/the-build"
      hero={<PageHero variant="editorial" caption={t("The build · Camarines Sur")} title={BUILD_HERO.title} intro={BUILD_HERO.intro} image={BUILD_HERO.image} imageAlt={BUILD_HERO.imageAlt} />}
      glance={{ summary: ABOUT_GLANCE.build, statement: true }}
      cta={<CtaBand title={ABOUT_CTA.title} body={ABOUT_CTA.body} label={c.settings.founding.enabled ? c.settings.founding.ctaLabel || undefined : undefined} href="/contact" />}
    >
      <section id="build" className="section sd-ev">
        <div className="shell">
          <div className="sd-tt-head sd-tt-head-light" data-reveal>
            <div><p className="sd-tt-eyebrow">{t("Build journal")}</p><h2>{headTitle}</h2></div>
            <div className="bd-head-side">
              <p>{headIntro ? `${headIntro} ` : ""}{BUILD.line}</p>
              {b.enabled && (live
                ? <Link href={localHref("/schedule/book")} className="vt-who-cta">{t(PHASE_COPY.live.ctaLabel)}</Link>
                : <div className="bd-countdown"><BuildCountdown openingDate={c.settings.openingDate} /></div>)}
            </div>
          </div>
          {b.enabled && b.launchVideoUrl && <video className="ab-build-video" controls preload="none" poster="/images/hero/hero-training.webp" src={b.launchVideoUrl} data-reveal />}
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
            <div><p className="sd-tt-eyebrow">{t("Road to opening")}</p><h2>{t("What's done. What's next.")}</h2></div>
            <p>{t("Progress is shown as real milestones, not an invented percentage. This board updates as dates, coaches, and sessions are published.")}</p>
          </div>
          <div className="sd-ev-board bd-board">
            <ol className="sd-ev-tiles bd-phases" aria-label={t("Build phases")} data-reveal="stagger">
              {phases.map((p, n) => (
                <li key={p.label} data-state={p.state}>
                  <span className="sd-ev-num">{pad(n)}</span>
                  <h3>{p.label}</h3>
                  <span className="bd-state">{STATE_LABEL[p.state]}</span>
                </li>
              ))}
            </ol>
            <ul className="bd-checks" aria-label={t("Opening readiness")} data-reveal="stagger">
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
            <div><p className="sd-tt-eyebrow">{t("What comes next")}</p><h2>{VISION_AHEAD.title}</h2></div>
            <p>{VISION_AHEAD.closing}</p>
          </div>
          <ol className="sd-ev-rows" data-reveal="stagger">
            {VISION_AHEAD.aspirations.map((a, n) => (
              <li key={a.title} className="sd-ev-row sd-ev-row-static ab3-row" style={i(n)}>
                <div>
                  <span className="sd-ev-when"><strong>{pad(n)}</strong><small>{t("Goal")}</small></span>
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
