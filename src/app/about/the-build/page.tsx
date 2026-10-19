import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BuildCountdown from "@/components/about/BuildCountdown";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
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

  return (
    <DetailTemplate
      path="/about/the-build"
      hero={<PageHero {...BUILD_HERO} />}
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
