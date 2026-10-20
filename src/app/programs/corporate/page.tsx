import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import { currentHref } from "@/components/programs/links";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatPhp } from "@/content/format";
import { getSiteContent } from "@/content/get";
import { programmeHref } from "@/content/sitemap";
import { CORPORATE_BAND, FEATURED_PROGRAMME_LINKS } from "@/data/programs-static";

export const metadata: Metadata = {
  title: "Corporate classes",
  description: "Team-building, leadership and wellness off-sites with customized programming and recovery designed for groups, in Camarines Sur.",
};

// Static under cacheComponents: reads only the cached getSiteContent() (spec §0.17).
// Content moved from /programs#corporate (stage-3 §1); corporate pricing itself lives on /membership/corporate.
export default async function CorporatePage() {
  const c = await getSiteContent();
  const { programmes: p, home } = c;
  const persona = home.personas.enabled ? home.personas.items.find((i) => i.id === "corporate") : undefined;
  const format = p.formats.find((f) => f.id === "corporate-groups");
  const groupProgrammes = p.programmes.filter((x) => x.audiences.includes("corporate"));
  const pricingItem = c.pricing.groups.find((g) => g.id === "corporate")?.items.find((i) => i.visible);
  const flagshipFor = (slug: string) => {
    const match = Object.entries(FEATURED_PROGRAMME_LINKS).find(([, links]) => links.offerings?.includes(slug));
    return match ? programmeHref(match[0]) : "/contact?enquiry=corporate";
  };


  return (
    <DetailTemplate
      path="/classes/corporate"
      hero={<PageHero eyebrow="Corporate" title={CORPORATE_BAND.title} intro="Team-building and wellness off-sites with customized programming." image="/images/destination/transform.png" imageAlt="Two athletes training with kettlebells" />}
      glance={{
        summary: "Team-building, leadership and wellness off-sites with customized programming and recovery designed for groups.",
      }}
      related={["/membership/corporate", "/visit/camps", "/classes/coaching"]}
      cta={<CtaBand eyebrow="Corporate" title="Bring your team." body="Tell us about your group and we will shape a program around it." label={CORPORATE_BAND.cta.label} href={CORPORATE_BAND.cta.href} />}
    >
      <section className="section section-dark pr-corporate" id="corporate">
        <div className="shell pr-corporate-inner">
          <div className="nv-block-head" data-reveal>
            <p className="eyebrow eyebrow-light">Corporate</p>
            <h2>{CORPORATE_BAND.title}</h2>
          </div>
          <div className="pr-corporate-body" data-reveal data-reveal-delay="short">
            <p>{CORPORATE_BAND.body}</p>
            <Link className="button button-light" href={CORPORATE_BAND.cta.href}>{CORPORATE_BAND.cta.label} <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      {(format || persona || pricingItem) && (
        <section className="section shell" id="options">
          <div className="nv-block-head" data-reveal>
            <p className="eyebrow">What we offer</p>
            <h2>Built around your group.</h2>
          </div>
          <ul className="pr-card-grid pr-card-grid-3" data-reveal="stagger">
            {persona && (
              <li className="pr-tile">
                <p className="pr-meta">Who it&apos;s for</p>
                <h3>{persona.title}</h3>
                <p>{persona.body}</p>
              </li>
            )}
            {format && (
              <li className="pr-tile">
                <p className="pr-meta">Format</p>
                <h3>{format.title}</h3>
                <p>{format.description}</p>
              </li>
            )}
            {pricingItem && (
              <li className="pr-tile">
                <p className="pr-meta">Pricing</p>
                <h3>{pricingItem.name}</h3>
                <p>{pricingItem.description}</p>
                <div className="pr-tile-foot">
                  <StatusBadge availability={pricingItem.availability} />
                  <Link className="pr-inline-link" href={currentHref("/membership#corporate")}>{formatPhp(pricingItem.price)} <span aria-hidden="true">→</span></Link>
                </div>
              </li>
            )}
          </ul>
        </section>
      )}

      {groupProgrammes.length > 0 && (
        <section className="section pr-band" id="group-programmes">
          <div className="shell">
            <div className="nv-block-head" data-reveal>
              <p className="eyebrow">Classes for groups</p>
              <h2>Train together.</h2>
            </div>
            <ul className="nv-cards" data-reveal="stagger">
              {groupProgrammes.map((x) => (
                <li key={x.slug}>
                  <Link href={flagshipFor(x.slug)} className="nv-card">
                    <span className="nv-card-image"><Image src={x.image} alt="" fill sizes="(max-width: 760px) 100vw, (max-width: 1040px) 50vw, 33vw" className="cover-image" /></span>
                    <span className="nv-card-body">
                      <StatusBadge availability={x.availability} />
                      <span className="nv-card-title">{x.title}</span>
                      <span className="nv-card-summary">{x.summary}</span>
                      <span className="nv-card-more">Read more <span aria-hidden="true">→</span></span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </DetailTemplate>
  );
}
