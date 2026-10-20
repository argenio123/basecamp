import type { Metadata } from "next";
import Image from "next/image";
import FacilityCardFacts from "@/components/facilities/FacilityCardFacts";
import ItemList from "@/components/facilities/ItemList";
import { statFact } from "@/components/facilities/facts";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import StatusBadge from "@/components/ui/StatusBadge";
import { FACILITY_ANCHORS } from "@/content/constants";
import { getSiteContent } from "@/content/get";
import { ALL_WEATHER, FACILITIES_CTA, RUNNING, TRAINING, TRAINING_HERO } from "@/data/facilities";

export const metadata: Metadata = {
  title: "Training zones & running loop",
  description: "BaseCamp CamSur training zones: a CrossFit-style area, a complete gym, 673 square meters of outdoor space, a planned running loop and all-weather design.",
};

// Stage-3 §1: /facilities/training holds [training-zones] [running-loop] [all-weather] (ids kept for menu and legacy links).
export default async function FacilitiesTrainingPage() {
  const c = await getSiteContent();
  const stats = c.home.stats.items;
  const statRow = stats.filter((s) => s.id === "sqm" || s.id === "zones");
  const lanes = TRAINING.planned[0];

  return (
    <DetailTemplate
      path="/facilities/training"
      hero={<PageHero {...TRAINING_HERO} />}
      glance={{
        summary: "Three training zones with 673 square meters outdoors, a planned running loop through nature and design that works in every kind of weather.",
        facts: [statFact(stats, "sqm"), statFact(stats, "zones"), lanes && { label: lanes.title, value: "Planned" }],
      }}
      related={["/classes/endurance", "/facilities/recovery", "/membership/passes"]}
      cta={<CtaBand {...FACILITIES_CTA} />}
    >
      <section id={FACILITY_ANCHORS.training} className="section">
        <div className="shell">
          <div className="split-heading light-split" data-reveal><div><p className="eyebrow">Zone 02</p><h2>{TRAINING.title}</h2></div></div>
          <ul className="fc-zone-cards" data-reveal="stagger">
            {TRAINING.zones.map((z) => <li className="fc-facility-card" key={z.title}><div className="image-frame fc-zone-card-image"><Image src={z.image} alt={z.imageAlt} fill sizes="(max-width: 760px) 100vw, (max-width: 1040px) 50vw, 33vw" className="cover-image" /></div><div className="fc-zone-card-copy"><StatusBadge availability={z.availability} /><h3>{z.title}</h3><p>{z.body}</p><FacilityCardFacts details={z.details} /></div></li>)}
          </ul>
          <ItemList items={TRAINING.planned} cols={2} />
          {statRow.length > 0 && (
            <div className="fc-stats">
              <ul className="fc-stat-list" data-reveal="stagger">{statRow.map((s) => <li key={s.id}><strong>{s.value}</strong><span className="fc-stat-label">{s.label}</span>{s.detail && <span>{s.detail}</span>}</li>)}</ul>
              <blockquote className="fc-pull" data-reveal data-reveal-delay="medium">{TRAINING.statsQuote}</blockquote>
            </div>
          )}
        </div>
      </section>

      <section id="equipment" className="section fc-zone-deep" aria-labelledby="fc-equip-title">
        <div className="shell">
          <div className="fc-equip">
            <div className="fc-equip-head" data-reveal><h2 id="fc-equip-title">{TRAINING.equipmentTitle}</h2><StatusBadge availability="planned" /></div>
            <div className="fc-equip-grid" data-reveal="stagger">
              {TRAINING.equipment.map((g) => <div key={g.title}><h3>{g.title}</h3><ul>{g.items.map((item) => <li key={item}>{item}</li>)}</ul></div>)}
            </div>
            <div className="fc-equip-accordion" data-reveal="stagger">
              {TRAINING.equipment.map((g, i) => <details key={g.title} open={i === 0}><summary>{g.title}</summary><ul>{g.items.map((item) => <li key={item}>{item}</li>)}</ul></details>)}
            </div>
          </div>
        </div>
      </section>

      <section id={FACILITY_ANCHORS.running} className="section">
        <div className="shell">
          <div className="split-heading light-split" data-reveal><div><p className="eyebrow">Zone 03</p><h2>{RUNNING.title}</h2></div><p>{RUNNING.intro}</p></div>
          <ItemList items={RUNNING.items} cols={4} />
        </div>
      </section>

      <section id="all-weather" className="section fc-zone-deep">
        <div className="shell">
          <div className="split-heading light-split" data-reveal><div><p className="eyebrow">{ALL_WEATHER.eyebrow}</p><h2>{ALL_WEATHER.title}</h2></div></div>
          <ItemList items={ALL_WEATHER.items} cols={5} />
        </div>
      </section>
    </DetailTemplate>
  );
}
