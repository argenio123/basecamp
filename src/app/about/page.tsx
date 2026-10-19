import type { Metadata } from "next";
import Image from "next/image";
import AboutLink from "@/components/about/AboutLink";
import { OverviewTemplate } from "@/components/nav/PageTemplates";
import BrandPillars from "@/components/sections/BrandPillars";
import BrandStatement from "@/components/sections/BrandStatement";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatDateLabel } from "@/content/format";
import { getSiteContent } from "@/content/get";
import { POSITIONING_LINE, POSTAL_ADDRESS, PROOF_ROW, TAGLINE } from "@/data/brand";
import { ABOUT_CTA, ABOUT_GLANCE, ABOUT_HERO, DIFFERENT, EDGE, PARTNERS, PILLARS, PROBLEM, VISION } from "@/data/about";

export const metadata: Metadata = {
  title: "About",
  description: "BaseCamp CamSur is Southeast Asia's Performance Playground: a purpose-built destination in Camarines Sur where performance training, recovery and lifestyle converge. Our vision, brand pillars and what makes us different.",
};

const pad = (i: number) => String(i + 1).padStart(2, "0");
const norm = (s: string) => s.trim().toLowerCase();

// Overview template (stage-3 §7): hero → section tabs → at a glance → sub-page cards → highlights → CTA.
// Highlights: #vision · #positioning · #pillars (+ home "Complete system", #complete-system) · #different
// (+ home "Differentiators", #differentiators) · #problem + #edge as short copy · #founders · #partners.
// Static: only awaits the cached getSiteContent() (spec §0.17; 03-api-reference/01-directives/use-cache.md).
export default async function AboutPage() {
  const c = await getSiteContent();
  const system = c.home.completeSystem;
  const diff = c.home.differentiators;
  const founders = c.story.founders;
  const showFounders = c.home.founders.enabled
    && founders.paragraphs.some((p) => p.trim())
    && Boolean(founders.signature.trim())
    && !/founding team/i.test(founders.signature);
  const partnerGroups = PARTNERS.typeOrder.map((type) => ({ type, items: c.people.partners.filter((p) => p.type === type) })).filter((g) => g.items.length > 0);

  // One column per phase: the brand-promise phase (static) merged with the editable "Complete system" pillar.
  const systemPillars = system.enabled ? system.pillars : [];
  const used = new Set<string>();
  const columns = [
    ...systemPillars.map((pillar) => {
      const phase = PILLARS.phases.find((ph) => norm(ph.label) === norm(pillar.id) || norm(ph.label) === norm(pillar.name));
      if (phase) used.add(phase.label);
      return { key: pillar.id, name: phase?.label ?? pillar.name, phase, pillar };
    }),
    ...PILLARS.phases.filter((ph) => !used.has(ph.label)).map((phase) => ({ key: phase.label, name: phase.label, phase, pillar: undefined })),
  ];

  const opening = c.settings.openingDate ? formatDateLabel(c.settings.openingDate) : "";

  return (
    <OverviewTemplate
      path="/about"
      hero={<PageHero eyebrow={ABOUT_HERO.eyebrow} title={ABOUT_HERO.title} intro={POSITIONING_LINE} image={ABOUT_HERO.image} imageAlt={ABOUT_HERO.imageAlt} />}
      glance={{
        summary: ABOUT_GLANCE.overview,
        facts: [
          { label: "Category", value: VISION.columns.find((col) => col.highlight)?.body ?? "" },
          { label: "Promise", value: TAGLINE },
          { label: "Place", value: `${POSTAL_ADDRESS.addressLocality}, ${POSTAL_ADDRESS.addressRegion}` },
          opening && { label: "Opening", value: opening },
        ],
      }}
      cta={<CtaBand title={ABOUT_CTA.title} body={ABOUT_CTA.body} label={c.settings.founding.enabled ? c.settings.founding.ctaLabel || undefined : undefined} href="/contact" />}
    >
      <section id="vision" className="section ab-vision"><div className="shell">
        <div data-reveal><p className="eyebrow">{VISION.eyebrow}</p><h2 className="ab-title">{VISION.title}</h2></div>
        <div className="ab-vision-grid" data-reveal="stagger">{VISION.columns.map((col) => <article key={col.label} className="ab-vision-card" data-highlight={col.highlight ? "" : undefined}><h3>{col.label}</h3><p>{col.body}</p></article>)}</div>
        <div className="ab-vision-copy" data-reveal><p className="lead">{VISION.lead}</p><p>{VISION.body}</p></div>
      </div></section>

      <section id="positioning" className="section ab-positioning"><div className="shell" data-reveal><p className="eyebrow">Positioning</p><BrandStatement positioning={c.story.positioning} /></div></section>

      <section id="pillars" className="section section-dark ab-pillars"><div className="shell">
        <div className="ab-split" data-reveal>
          <div><p className="eyebrow eyebrow-light">{PILLARS.eyebrow}</p><h2>{TAGLINE}</h2></div>
          {system.enabled && system.intro && <div><p className="ab-system-eyebrow">{system.eyebrow}</p><p className="lead">{system.intro}</p></div>}
        </div>
        <ol id="complete-system" className="ab-system-grid" data-reveal="stagger">
          {columns.map((col, i) => (
            <li key={col.key} className="ab-system-col">
              <span className="ab-index">{pad(i)}{col.phase ? ` · ${col.phase.phase}` : ""}</span>
              <h3>{col.name}</h3>
              {col.phase && <p className="ab-system-phase">{col.phase.body}</p>}
              {col.pillar && <>
                <p className="ab-system-meta">{[col.pillar.theme, col.pillar.subtitle].filter(Boolean).join(" · ")}</p>
                {col.pillar.bullets.length > 0 && <ul className="ab-check-list">{col.pillar.bullets.map((b, j) => <li key={`${j}-${b}`}>{b}</li>)}</ul>}
                {col.pillar.link.href && <AboutLink href={col.pillar.link.href} className="text-link light">{col.pillar.link.label} <span>↗</span></AboutLink>}
              </>}
            </li>
          ))}
        </ol>
        <div className="ab-pillars-copy" data-reveal><p className="lead">{PILLARS.promise}</p>{system.closing && <p className="ab-body">{system.closing}</p>}</div>
        {c.story.brandPillars.length > 0 && <h3 className="ab-subtitle" data-reveal>{PILLARS.pillarsTitle}</h3>}
        <div data-reveal data-reveal-delay="short"><BrandPillars pillars={c.story.brandPillars} /></div>
      </div></section>

      <section id="different" className="section ab-different"><div className="shell">
        <div data-reveal><p className="eyebrow">{DIFFERENT.eyebrow}</p><h2 className="ab-title">{DIFFERENT.title}</h2></div>
        <ol className="ab-cards ab-cards-3" data-reveal="stagger">{DIFFERENT.items.map((item, i) => <li key={item.title} className="ab-card"><span className="ab-index">{pad(i)}</span><h3>{item.title}</h3><p>{item.body}</p></li>)}</ol>
        <ul className="ab-proof" aria-label="Our proof points" data-reveal="stagger">{PROOF_ROW.map((p) => <li key={p}>{p}</li>)}</ul>
        {diff.enabled && diff.items.length > 0 && <div id="differentiators" className="ab-diff">
          <div className="ab-split" data-reveal>
            <div>{diff.eyebrow && <p className="eyebrow">{diff.eyebrow}</p>}<h3 className="ab-diff-title">{diff.title}</h3></div>
            {diff.intro && <div><p className="lead">{diff.intro}</p></div>}
          </div>
          <ol className="ab-diff-grid" data-reveal="stagger">
            {diff.items.map((item, i) => (
              <li key={item.id} className="ab-diff-card">
                <span className="ab-index">{pad(i)}</span>
                <h4>{item.title}</h4>
                <p>{item.body}</p>
                <div className="ab-card-foot">
                  <StatusBadge availability={item.availability} />
                  {item.link.href && <AboutLink href={item.link.href} className="text-link">{item.link.label || "Learn more"} <span>↗</span></AboutLink>}
                </div>
              </li>
            ))}
          </ol>
        </div>}
      </div></section>

      <section id="problem" className="section ab-problem"><div className="shell">
        <div className="ab-split" data-reveal><div><p className="eyebrow">{PROBLEM.eyebrow}</p><h2>{PROBLEM.title}</h2></div><div><p className="lead">{PROBLEM.lead}</p><p className="ab-body">{PROBLEM.short}</p></div></div>
        <ol className="ab-cards ab-cards-3" data-reveal="stagger">{PROBLEM.gaps.map((gap, i) => <li key={gap.title} className="ab-card"><span className="ab-index">{pad(i)}</span><h3>{gap.title}</h3><p>{gap.body}</p></li>)}</ol>
        <div id="edge" className="ab-edge">
          <div className="ab-split" data-reveal><div><p className="eyebrow">{EDGE.eyebrow}</p><h3 className="ab-edge-title">{EDGE.title}</h3></div><div><p className="lead">{EDGE.intro}</p></div></div>
          <ul className="ab-chips" aria-label="What BaseCamp CamSur brings together" data-reveal="stagger">{EDGE.chips.map((chip) => <li key={chip}>{chip}</li>)}</ul>
          <div className="ab-contrast" aria-label={EDGE.contrastLabel} role="group" data-reveal="stagger">{EDGE.contrast.map((col) => <article key={col.place} data-highlight={col.highlight ? "" : undefined}><p className="ab-contrast-place">{col.place} =</p><h4>{col.promise}</h4><p>{col.body}</p></article>)}</div>
          <p className="ab-closing" data-reveal>{EDGE.closing}</p>
        </div>
      </div></section>

      {showFounders && <section id="founders" className="section section-dark ab-founders"><div className="shell ab-founders-grid">
        {founders.image && <div className="image-frame ab-founders-image"><Image src={founders.image} alt="The BaseCamp CamSur landscape" fill sizes="(max-width: 1040px) 100vw, 40vw" className="cover-image" /></div>}
        <div data-reveal>
          {(c.home.founders.eyebrow || founders.eyebrow) && <p className="eyebrow eyebrow-light">{c.home.founders.eyebrow || founders.eyebrow}</p>}
          <h2>{founders.title}</h2>
          {founders.paragraphs.filter((p) => p.trim()).map((p, i) => <p key={i} className={i === 0 ? "lead" : "ab-body"}>{p}</p>)}
          {founders.signature && <p className="ab-signature">{founders.signature}</p>}
        </div>
      </div></section>}

      {partnerGroups.length > 0 && <section id="partners" className="section ab-partners"><div className="shell">
        <div data-reveal><p className="eyebrow">{PARTNERS.eyebrow}</p><h2 className="ab-title">{PARTNERS.title}</h2></div>
        {partnerGroups.map((g) => <div key={g.type} className="ab-partner-group" data-reveal><h3>{PARTNERS.typeLabel[g.type]}</h3><ul className="ab-cards ab-cards-3">{g.items.map((p) => <li key={p.id} className="ab-card"><h4>{p.url ? <a href={p.url} target="_blank" rel="noreferrer">{p.name} <span aria-hidden="true">↗</span></a> : p.name}</h4>{p.description && <p>{p.description}</p>}</li>)}</ul></div>)}
      </div></section>}
    </OverviewTemplate>
  );
}
