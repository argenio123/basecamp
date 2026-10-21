import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import ClassesEditorialHero from "@/components/programs/ClassesEditorialHero";
import ProgrammeActions from "@/components/programs/ProgrammeActions";
import CtaBand from "@/components/sections/CtaBand";
import StatusBadge from "@/components/ui/StatusBadge";
import { getSiteContent } from "@/content/get";
import { PHASE_COPY } from "@/content/labels";
import { programmeHref, RESERVED_PROGRAMME_SLUGS } from "@/content/sitemap";
import type { Availability, FeaturedProgramme, LaunchPhase } from "@/content/types";
import { CLASS_PREVIEW, FEATURED_PROGRAMME_LINKS, HYROX_SOURCE_LINKS, HYROX_STATIONS, OUTCOMES_NOTE, PARTNER_TERMS, WELLNESS_PARTNERS } from "@/data/programs-static";

type Params = { slug: string };

const PROGRAMME_STATUS: Record<LaunchPhase, string> = {
  "pre-launch": "At launch",
  "soft-opening": "Early access",
  live: "Available now",
};

/** Unknown slugs wait for the route result so notFound() can return a real 404 before streaming. */
export const ensureStatic = "navigation";
/**
 * The whole page depends on `params` and every program is prerendered (generateStaticParams + ensureStatic above),
 * so navigating here waits only for that static page. Opt out of the dev-only "URL data outside of Suspense" check
 * rather than showing an empty placeholder shell first (docs: route-segment-config/instant#disabling-instant).
 */
export const instant = false;

export async function generateStaticParams(): Promise<Params[]> {
  const c = await getSiteContent();
  return c.programmes.featured.filter((programme) => !RESERVED_PROGRAMME_SLUGS.has(programme.slug)).map((programme) => ({ slug: programme.slug }));
}

async function findProgramme(slug: string) {
  const c = await getSiteContent();
  const programme = RESERVED_PROGRAMME_SLUGS.has(slug) ? undefined : c.programmes.featured.find((item) => item.slug === slug);
  return { c, programme };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const { programme } = await findProgramme(slug);
  if (!programme) return { title: "Program not found" };
  return { title: programme.title, description: programme.description };
}

const pick = <T extends { id: string }>(list: readonly T[], ids: readonly string[] = []) =>
  ids.flatMap((id) => list.filter((item) => item.id === id));
const pickBySlug = <T extends { slug: string }>(list: readonly T[], slugs: readonly string[] = []) =>
  slugs.flatMap((slug) => list.filter((item) => item.slug === slug));

function relatedProgrammes(all: readonly FeaturedProgramme[], current: FeaturedProgramme): string[] {
  return all
    .filter((programme) => programme.slug !== current.slug && !RESERVED_PROGRAMME_SLUGS.has(programme.slug))
    .map((programme, index) => ({ programme, index, score: programme.goals.filter((goal) => current.goals.includes(goal)).length }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 2)
    .map(({ programme }) => programmeHref(programme.slug));
}

function spaceHref(space: string): string {
  const value = space.toLowerCase();
  if (value.includes("recovery")) return "/facilities/recovery";
  if (value.includes("running")) return "/facilities/training#running-loop";
  if (value.includes("studio")) return "/facilities/training#training-zones";
  return "/facilities/training";
}

const DETAIL_THEME = {
  "strength-conditioning": "industrial",
  "functional-training": "race",
  endurance: "race",
  "personal-coaching": "documentary",
  "recovery-mobility": "restore",
} as const;

function Row({ id, eyebrow, title, children }: { id: string; eyebrow?: string; title: string; children: ReactNode }) {
  return (
    <section className="pr-row" id={id} aria-labelledby={`${id}-title`}>
      <div className="shell pr-row-inner">
        <div className="pr-row-head" data-reveal>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 id={`${id}-title`}>{title}</h2>
        </div>
        <div className="pr-row-body">{children}</div>
      </div>
    </section>
  );
}

export default async function ProgrammePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const { c, programme } = await findProgramme(slug);
  if (!programme) notFound();

  const path = programmeHref(programme.slug);
  const p = c.programmes;
  const links = FEATURED_PROGRAMME_LINKS[programme.slug] ?? {};
  const offerings = pickBySlug(p.programmes, links.offerings);
  const disciplines = pick(p.disciplines, links.disciplines);
  const modalities = pick(p.modalities, links.modalities);
  const formats = pick(p.formats, links.formats);
  const signature = pick(p.signatureWorkouts, links.signature);
  const fusion = pick(p.fusion, links.fusion);
  const totalMinutes = programme.timeline.reduce((total, block) => total + block.minutes, 0);
  const mentionsMedical = /hyperbaric|cryotherapy|NAD\+/i.test(JSON.stringify([programme, offerings, modalities, fusion]));
  const classPreview = CLASS_PREVIEW.filter((item) => item.programmeSlug === programme.slug);
  const supportHref = programme.slug === "recovery-mobility" ? "/facilities/recovery" : "/classes/coaching";
  const supportTitle = programme.slug === "recovery-mobility" ? "Recovery facilities" : "Coaching support";
  const theme = DETAIL_THEME[programme.slug as keyof typeof DETAIL_THEME] ?? "overview";
  const chapter = String(p.featured.findIndex((item) => item.slug === programme.slug) + 1).padStart(2, "0");
  const preparation = [
    "Arrive 10 minutes early for your first coach check-in.",
    programme.slug === "recovery-mobility" ? "Wear layers that let you move and settle comfortably." : "Bring training shoes, water and clothes you can move freely in.",
    "Share relevant injuries, limitations and current training load before class.",
    "Choose control over speed until the coach confirms your working level.",
  ];

  type InsideItem = { key: string; type: string; title: string; description: string; availability?: Availability; note?: string };
  const inside: InsideItem[] = [
    ...offerings.map((item) => ({ key: `offering-${item.slug}`, type: "Offering", title: item.title, description: item.summary, availability: item.availability })),
    ...disciplines.map((item) => ({ key: `discipline-${item.id}`, type: "Discipline", title: item.title, description: item.description })),
    ...modalities.map((item) => ({ key: `modality-${item.id}`, type: "Modality", title: item.title, description: item.description, availability: item.availability })),
    ...formats.map((item) => ({ key: `format-${item.id}`, type: "Format", title: item.title, description: item.description })),
    ...signature.map((item) => ({ key: `signature-${item.id}`, type: "Signature workout", title: item.title, description: item.description, availability: item.availability, note: item.when })),
    ...fusion.map((item) => ({ key: `fusion-${item.id}`, type: "Fusion format", title: item.title, description: item.description, availability: item.availability })),
    ...(links.partners ? WELLNESS_PARTNERS.map((item) => ({ key: `partner-${item.id}`, type: "Specialist", title: item.title, description: PARTNER_TERMS })) : []),
  ];

  return (
    <DetailTemplate
      path={path}
      hero={<ClassesEditorialHero chapter={chapter} eyebrow="Classes" title={programme.title} intro={programme.description} image={programme.image} imageAlt={`${programme.title} at BaseCamp CamSur`} variant={theme} stat={`${programme.duration}`} statLabel="Minutes" />}
      glance={{
        summary: programme.description,
        facts: [
          { label: "Level", value: programme.level },
          { label: "Session", value: `${programme.duration} minutes` },
          { label: "Format", value: programme.format },
          { label: "Status", value: PROGRAMME_STATUS[c.settings.launchPhase] },
        ],
      }}
      related={relatedProgrammes(p.featured, programme)}
      relatedTitle="Related classes"
      afterRelated={(
        <section className="section shell pr-get-started" aria-labelledby="get-started-title">
          <div data-reveal>
            <p className="eyebrow">Next step</p>
            <h2 id="get-started-title">Get started.</h2>
            <ProgrammeActions programme={programme} launchPhase={c.settings.launchPhase} />
          </div>
        </section>
      )}
      cta={<CtaBand eyebrow="Early members" label={PHASE_COPY[c.settings.launchPhase].ctaLabel} />}
    >
      <div className={`pr-detail pr-detail-${theme}`}>
        <Row id="what-it-is" eyebrow="The discipline" title="What it is">
          <p className="pr-lead" data-reveal data-reveal-delay="short">{programme.about}</p>
        </Row>

        <Row id="who-its-for" eyebrow="Is it for you?" title="Who it's for">
          <ul className="program-who pr-who" data-reveal="stagger">
            {programme.whoFor.slice(0, 3).map((item) => <li key={item}>{item}</li>)}
          </ul>
        </Row>

        <Row id="session" eyebrow={`${programme.duration} minutes`} title="What a session looks like">
          <ol className="pr-timeline" data-reveal="stagger">
            {programme.timeline.map((block) => (
              <li key={`${block.label}-${block.minutes}`} style={{ flexGrow: Math.max(1, block.minutes) }}>
                <span className="pr-timeline-minutes">{block.minutes} min</span>
                <strong>{block.label}</strong>
              </li>
            ))}
          </ol>
          {totalMinutes !== programme.duration && <p className="pr-note">Session blocks total {totalMinutes} minutes; timing adapts to the group.</p>}
        </Row>

        <Row id="progress" eyebrow="4 / 8 / 12 weeks" title="What you'll notice">
          <ol className="pr-progress" data-reveal="stagger">
            {programme.progress.map((item) => <li key={`${item.weeks}-${item.text}`}><span>{item.weeks} weeks</span><p>{item.text}</p></li>)}
          </ol>
          <p className="pr-note" data-reveal data-reveal-delay="short">{OUTCOMES_NOTE}</p>
        </Row>

        {programme.slug === "endurance" && (
          <Row id="hyrox-stations" eyebrow="Race lab" title="Eight stations. One engine.">
            <p className="pr-lead">HYROX-style training alternates running with a fixed sequence of functional stations. BaseCamp sessions scale load and volume to the athlete in front of the coach.</p>
            <ol className="pr-station-grid" data-reveal="stagger">
              {HYROX_STATIONS.map((station, index) => (
                <li key={station.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="pr-meta">{station.volume}</p>
                    <h3>{station.name}</h3>
                    <p>{station.focus}</p>
                    <p className="pr-station-standard"><strong>Race standard</strong>{station.standard}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="pr-note">Distances and division loads referenced from {HYROX_SOURCE_LINKS.map((source) => <a key={source.href} href={source.href} target="_blank" rel="noreferrer">{source.label}</a>)}. Event standards may change.</p>
          </Row>
        )}

        {inside.length > 0 && (
          <Row id="inside" eyebrow="The wider BaseCamp system" title="Inside this class category">
            <ul className="pr-card-grid pr-card-grid-3" data-reveal="stagger">
              {inside.map((item) => (
                <li className="pr-tile" key={item.key}>
                  <p className="pr-meta">{item.type}</p>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  {item.availability && <StatusBadge availability={item.availability} />}
                  {item.note && <p className="pr-meta">{item.note}</p>}
                </li>
              ))}
            </ul>
          </Row>
        )}

        {classPreview.length > 0 && (
          <Row id="classes" eyebrow="What you book" title="Class preview">
            <ul className="pr-detail-classes" data-reveal="stagger">
              {classPreview.map((item) => (
                <li key={item.id}>
                  <div>
                    <p className="pr-meta">{item.duration} · Intensity {item.intensity}</p>
                    <h3>{item.title}</h3>
                    <p>{item.goal}</p>
                  </div>
                  <dl>
                    <div><dt>Level</dt><dd>{item.level}</dd></div>
                    <div><dt>Intensity</dt><dd>{item.intensity}</dd></div>
                    <div><dt>Area</dt><dd>{item.area}</dd></div>
                    <div><dt>Equipment</dt><dd>{item.equipment}</dd></div>
                    <div><dt>Access</dt><dd>{item.access}</dd></div>
                    <div><dt>Coach</dt><dd>{item.coach}</dd></div>
                  </dl>
                  <StatusBadge availability={item.availability} />
                </li>
              ))}
            </ul>
            <Link className="pr-inline-link" href="/classes#finder">Compare all launch classes <span aria-hidden="true">→</span></Link>
          </Row>
        )}

        <Row id="spaces" eyebrow="Where you'll train" title="Spaces you'll use">
          <ul className="pr-spaces" data-reveal="stagger">
            {programme.spaces.map((space) => <li key={space}><Link href={spaceHref(space)}><span className="pr-spaces-label">{space}</span><span className="pr-meta">Facilities</span><span className="pr-spaces-arrow" aria-hidden="true">→</span></Link></li>)}
          </ul>
        </Row>

        <Row id="prepare" eyebrow="Before your first session" title="Arrive ready">
          <ul className="pr-prep-list" data-reveal="stagger">{preparation.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>)}</ul>
          <aside className="pr-coach-announcement" data-reveal><p className="pr-meta">Your coach</p><h3>Coach line-up announcing soon.</h3><p>Every session will show the coach, specialty and required access before booking opens.</p><Link href="/classes/coaching">See the coaching approach →</Link></aside>
        </Row>

        <Row id="plan" eyebrow="Make it work for you" title="Plan your training">
          <ul className="pr-plan-grid" data-reveal="stagger">
            <li><Link href="/membership"><span className="pr-meta">Access</span><h3>Memberships &amp; passes</h3><p>Compare the access routes that include this kind of training.</p><span>Compare access →</span></Link></li>
            <li><Link href="/schedule#timetable"><span className="pr-meta">Sessions</span><h3>Schedule preview</h3><p>See how coached classes, independent training and appointments fit into the week.</p><span>View schedule →</span></Link></li>
            <li><Link href={supportHref}><span className="pr-meta">Support</span><h3>{supportTitle}</h3><p>Connect your classes to the specialist support that helps you progress.</p><span>Explore support →</span></Link></li>
          </ul>
        </Row>

        {mentionsMedical && <p className="shell pr-note pr-disclaimer">{c.recovery.disclaimer}</p>}
      </div>
    </DetailTemplate>
  );
}
