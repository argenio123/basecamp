import type { Metadata } from "next";
import { OverviewTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import MapEmbed from "@/components/ui/MapEmbed";
import VisitItems from "@/components/visit/VisitItems";
import { getSiteContent } from "@/content/get";
import { directionsUrl } from "@/data/brand";
import { GETTING_THERE, VISIT_CTA, VISIT_GLANCE, VISIT_HERO, VISIT_META } from "@/data/visit";

// Static metadata object (01-app/03-api-reference/04-functions/generate-metadata.md#the-metadata-object).
export const metadata: Metadata = VISIT_META;

// Overview (stage-3 §1/§7): hero → section tabs → at a glance → sub-page cards (Camps, Why CamSur) → getting there + map → CTA.
// Legacy /visit#camps, #long-stays, #why-camsur, #lago-del-rey are forwarded by the root layout's <HashForwarder />.
// Static rule (spec §0.17): only awaits the cached getSiteContent(), so the page prerenders.
// Docs: node_modules/next/dist/docs/01-app/03-api-reference/01-directives/use-cache.md
export default async function VisitPage() {
  const c = await getSiteContent();
  const { contact } = c.settings;

  return (
    <OverviewTemplate
      path="/visit"
      hero={<PageHero {...VISIT_HERO} />}
      glance={{
        summary: VISIT_GLANCE.summary,
        facts: [
          { label: "Region", value: "Camarines Sur" },
          { label: "Access", value: GETTING_THERE.line.replace(/\.$/, "") },
          { label: "Airports", value: GETTING_THERE.airports },
        ],
      }}
      cta={<CtaBand eyebrow={VISIT_CTA.eyebrow} />}
    >
      <section id="getting-there" className="section vt-deep">
        <div className="shell">
          <div className="vt-getting">
            <div data-reveal>
              <p className="eyebrow">{GETTING_THERE.eyebrow}</p>
              <h2>{GETTING_THERE.title}</h2>
              <dl className="vt-contact">
                {contact.addressLines.length > 0 && <div><dt>Address</dt><dd><address>{contact.addressLines.map((line) => <span key={line}>{line}</span>)}</address></dd></div>}
                {contact.hours && <div><dt>Hours</dt><dd>{contact.hours}</dd></div>}
                {contact.phoneDisplay && <div><dt>Phone</dt><dd><a href={`tel:${contact.phoneE164 || contact.phoneDisplay}`}>{contact.phoneDisplay}</a></dd></div>}
                {contact.email && <div><dt>Email</dt><dd><a href={`mailto:${contact.email}`}>{contact.email}</a></dd></div>}
              </dl>
              {contact.mapsQuery && <a href={directionsUrl(contact.mapsQuery)} target="_blank" rel="noopener noreferrer" className="button button-dark">{GETTING_THERE.directionsLabel} <span>↗</span></a>}
            </div>
            {contact.mapsQuery && <div data-reveal data-reveal-delay="short"><MapEmbed query={contact.mapsQuery} className="vt-map" /></div>}
          </div>
          <VisitItems items={GETTING_THERE.options} label={GETTING_THERE.eyebrow} />
          <p className="vt-line" data-reveal>{GETTING_THERE.line}</p>
        </div>
      </section>
    </OverviewTemplate>
  );
}
