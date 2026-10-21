import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AboutChapterNav from "@/components/about/AboutChapterNav";
import AboutEditorialHero from "@/components/about/AboutEditorialHero";
import BuildCountdown from "@/components/about/BuildCountdown";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import SocialIcon from "@/components/ui/SocialIcon";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatDateLabel } from "@/content/format";
import { getSiteContent } from "@/content/get";
import { PHASE_COPY } from "@/content/labels";
import type { LaunchPhase } from "@/content/types";
import { ABOUT_CTA, ABOUT_GLANCE, BUILD, BUILD_HERO, VISION_AHEAD } from "@/data/about";

export const metadata: Metadata = {
  title: "The Build",
  description: "Follow the build of BaseCamp CamSur in Camarines Sur: construction updates, the countdown to opening, and the vision for a training destination, wellness authority and sports tourism icon.",
};

const pad = (i: number) => String(i + 1).padStart(2, "0");
const PHASE_LABEL: Record<LaunchPhase, string> = { "pre-launch": "Under construction", "soft-opening": "Soft opening", live: "Open now" };

// Detail template (stage-3 §7). Content (stage-3 §1): [build] + countdown + build updates (moved from the
// homepage; home.build content keys) + [vision-ahead]. The countdown reads the clock on the client only
// (useSyncExternalStore), so the page stays static.
export default async function AboutBuildPage() {
  const c = await getSiteContent();
  const b = c.home.build;
  const live = c.settings.launchPhase === "live";
  const updates = c.story.buildUpdates;
  const socials = c.settings.socials.filter((s) => s.url);
  const opening = c.settings.openingDate ? formatDateLabel(c.settings.openingDate) : "";
  const headTitle = live ? b.liveTitle || BUILD.title : b.title || BUILD.title;
  const headIntro = live ? b.liveBody : b.intro;
  const readiness = [
    { label: "Design direction", note: "Published", ready: true },
    { label: "Facility render study", note: "Published", ready: true },
    { label: "Opening date", note: opening || "To be announced", ready: Boolean(opening) },
    { label: "Coach line-up", note: c.people.coaches.length > 0 ? `${c.people.coaches.length} announced` : "In preparation", ready: c.people.coaches.length > 0 },
    { label: "Bookable timetable", note: c.schedule.timetable.length > 0 ? `${c.schedule.timetable.length} sessions listed` : "In preparation", ready: c.schedule.timetable.length > 0 },
  ];

  return (
    <DetailTemplate
      path="/about/the-build"
      hero={<>
        <AboutEditorialHero chapter="03" eyebrow={BUILD_HERO.eyebrow} title={BUILD_HERO.title} intro={BUILD_HERO.intro} image={BUILD_HERO.image} imageAlt={BUILD_HERO.imageAlt} variant="build" />
        <AboutChapterNav label="Build chapters" items={[
          { id: "build", label: "Journal" },
          { id: "progress", label: "Progress" },
          { id: "vision-ahead", label: "Vision ahead" },
        ]} />
      </>}
      glance={{
        summary: ABOUT_GLANCE.build,
        facts: [
          { label: "Status", value: PHASE_LABEL[c.settings.launchPhase] },
          opening && { label: "Opening", value: opening },
          updates.length > 0 && { label: "Build updates", value: String(updates.length) },
          { label: "Looking ahead", value: `${VISION_AHEAD.aspirations.length} aspirations` },
        ],
      }}
      related={["/about/design", "/facilities/gallery", "/schedule/events"]}
      cta={<CtaBand title={ABOUT_CTA.title} body={ABOUT_CTA.body} label={c.settings.founding.enabled ? c.settings.founding.ctaLabel || undefined : undefined} href="/contact" />}
    >
      <section id="build" className="section ab-build"><div className="shell">
        <div className="ab-build-head">
          <div data-reveal>
            <p className="eyebrow">{b.eyebrow || BUILD.eyebrow}</p>
            <h2>{headTitle}</h2>
            {headIntro && <p className="lead">{headIntro}</p>}
            <p className="ab-body">{BUILD.line}</p>
          </div>
          {b.enabled && <div className="ab-launch" data-reveal data-reveal-delay="short">
            {live
              ? <Link href="/schedule/book" className="button button-light">{PHASE_COPY.live.ctaLabel} <span>↗</span></Link>
              : <BuildCountdown openingDate={c.settings.openingDate} />}
          </div>}
        </div>
        {b.enabled && b.launchVideoUrl && (
          <video className="ab-build-video" controls preload="none" poster="/images/hero/hero-training.png" src={b.launchVideoUrl} data-reveal />
        )}
        {updates.length > 0 && <div className="ab-build-grid" data-reveal="stagger">{updates.map((u) => <article key={u.id} className="ab-build-card">
          <div className="ab-build-media">{u.image && <Image src={u.image} alt="" fill sizes="(max-width: 760px) 100vw, (max-width: 1040px) 50vw, 33vw" className="cover-image" />}</div>
          <div className="ab-build-body"><p className="ab-build-meta"><span>{u.tag}</span>{u.date && <time dateTime={u.date}>{formatDateLabel(u.date)}</time>}</p><h3>{u.title}</h3><p>{u.body}</p></div>
        </article>)}</div>}
        {socials.length > 0 && <div className="ab-socials" data-reveal><p className="eyebrow">{BUILD.followLabel}</p><ul>{socials.map((s) => <li key={s.platform}><a href={s.url} target="_blank" rel="noreferrer" aria-label={`${s.platform}${s.handle ? ` ${s.handle}` : ""}`}><SocialIcon platform={s.platform} /><span>{s.handle || s.platform}</span></a></li>)}</ul></div>}
      </div></section>

      <section id="progress" className="section ab-progress"><div className="shell">
        <div className="ab-split" data-reveal>
          <div><p className="eyebrow">Opening readiness</p><h2>What is confirmed. What comes next.</h2></div>
          <p className="lead">Progress is shown through verifiable milestones rather than an invented percentage. This view updates as dates, people and sessions are published.</p>
        </div>
        <ol className="ab-milestones" aria-label="Build phases" data-reveal="stagger">
          <li data-state="complete"><span>01</span><div><p>Vision &amp; planning</p><strong>Complete</strong></div></li>
          <li data-state={c.settings.launchPhase === "pre-launch" ? "current" : "complete"}><span>02</span><div><p>Construction</p><strong>{c.settings.launchPhase === "pre-launch" ? "In progress" : "Complete"}</strong></div></li>
          <li data-state={c.settings.launchPhase === "soft-opening" ? "current" : live ? "complete" : "upcoming"}><span>03</span><div><p>Soft opening</p><strong>{c.settings.launchPhase === "soft-opening" ? "Current phase" : live ? "Complete" : "Ahead"}</strong></div></li>
          <li data-state={live ? "current" : "upcoming"}><span>04</span><div><p>Open doors</p><strong>{live ? "Open now" : "Ahead"}</strong></div></li>
        </ol>
        <div className="ab-readiness" data-reveal>
          <div><p className="eyebrow">Readiness board</p><h3>Signals we can stand behind.</h3><p>Each item is tied to content already published on the site, so this board becomes more complete without manual progress estimates.</p><Link href="/contact" className="text-link">Get build updates <span>↗</span></Link></div>
          <ul>{readiness.map((item) => <li key={item.label} data-ready={item.ready ? "true" : "false"}><span aria-hidden="true">{item.ready ? "✓" : "○"}</span><div><strong>{item.label}</strong><p>{item.note}</p></div></li>)}</ul>
        </div>
      </div></section>

      <section id="vision-ahead" className="section section-dark ab-ahead"><div className="shell">
        <div data-reveal><p className="eyebrow eyebrow-light">{VISION_AHEAD.eyebrow}</p><h2 className="ab-title">{VISION_AHEAD.title}</h2></div>
        <ol className="ab-phases" data-reveal="stagger">{VISION_AHEAD.aspirations.map((a, i) => <li key={a.title}><span className="ab-index">{pad(i)}</span><h3>{a.title}</h3><p>{a.body}</p></li>)}</ol>
        <div className="ab-pillars-copy" data-reveal><p className="ab-body">{VISION_AHEAD.movement}</p><p className="lead">{VISION_AHEAD.closing}</p></div>
        <h3 className="ab-subtitle" data-reveal>{VISION_AHEAD.beyondTitle}</h3>
        <ul className="ab-beyond" data-reveal="stagger">{VISION_AHEAD.beyond.map((item) => <li key={item.title}><div><h4>{item.title}</h4><p>{item.body}</p></div><StatusBadge availability="planned" /></li>)}</ul>
      </div></section>
    </DetailTemplate>
  );
}
