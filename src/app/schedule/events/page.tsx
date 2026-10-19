import type { Metadata } from "next";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import { EventCard, RecurringCard } from "@/components/schedule/EventCards";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import StatusBadge from "@/components/ui/StatusBadge";
import { getSiteContent } from "@/content/get";
import { CADENCE_ORDER, PHASE_COPY } from "@/content/labels";
import { EVENT_KIND_GROUPS, NIGHT_ELEMENTS } from "@/data/programs-static";

export const metadata: Metadata = {
  title: "Events & night training",
  description: "Night training under lights, weekly competitions and leaderboards, and the BaseCamp CamSur calendar of festivals, workshops and community events.",
};

const count = (n: number) => (n > 0 ? String(n) : "");

// Detail page (stage-3 §1): [night] [competition] [events], moved from the stage-2 /schedule page.
// Static under cacheComponents: reads only the cached getSiteContent().
export default async function ScheduleEventsPage() {
  const c = await getSiteContent();
  const s = c.schedule;
  const phase = c.settings.launchPhase;
  const night = s.recurring.filter((e) => e.night);
  const daily = s.recurring.filter((e) => !e.night).sort((a, b) => CADENCE_ORDER.indexOf(a.cadence) - CADENCE_ORDER.indexOf(b.cadence));
  const eventGroups = EVENT_KIND_GROUPS.map((g) => ({ ...g, events: s.events.filter((e) => e.kind === g.kind) })).filter((g) => g.events.length > 0);


  return (
    <DetailTemplate
      path="/schedule/events"
      hero={<PageHero eyebrow="Events" title="Own the night. Compete every week." intro="Training under lights, competition with leaderboards and a calendar of festivals, workshops and community events." image="/images/programs/generated/endurance.png" imageAlt="Endurance training session" />}
      glance={{
        summary: "Weekly training under lights, competition with leaderboards, and festivals, workshops and community events through the year.",
        facts: [
          { label: "Night events", value: count(night.length) },
          { label: "Recurring challenges", value: count(daily.length) },
          { label: "Calendar events", value: count(s.events.length) },
          { label: "Leaderboards", value: s.leaderboardCategories.length > 0 ? `${s.leaderboardCategories.length} categories` : "" },
        ],
      }}
      related={["/schedule/book", "/programs/endurance", "/visit/camps"]}
      cta={<CtaBand eyebrow="Founding members" label={PHASE_COPY[phase].ctaLabel} />}
    >
      <section className="section section-dark" id="night">
        <div className="shell">
          <div className="section-heading split-heading" data-reveal><div><p className="eyebrow eyebrow-light">Night training culture</p><h2>Own a time slot others ignore.</h2></div><p>Train hard without the afternoon sun: lights, music and a crowd at the lakefront.</p></div>
          <ul className="sd-grid sd-grid-5" data-reveal="stagger">
            {NIGHT_ELEMENTS.map((n) => <li className="sd-card" key={n.id}><StatusBadge availability={n.availability} /><h3>{n.title}</h3><p>{n.description}</p></li>)}
          </ul>
          {night.length > 0 && <>
            <h3 className="sd-subhead" data-reveal>Weekly after dark</h3>
            <ul className="sd-grid sd-grid-3" data-reveal="stagger">{night.map((e) => <RecurringCard event={e} key={e.id} />)}</ul>
          </>}
        </div>
      </section>

      <section className="section" id="competition">
        <div className="shell">
          <div className="section-heading split-heading light-split" data-reveal><div><p className="eyebrow">Competition</p><h2>Competition isn&apos;t occasional, it&apos;s daily.</h2></div><p>There&apos;s always something to train for, always a leaderboard to climb, always a challenge to attempt.</p></div>
          <div className="sd-competition">
            <ul className="sd-grid sd-grid-2" data-reveal="stagger">{daily.map((e) => <RecurringCard event={e} key={e.id} />)}</ul>
            <aside className="sd-leaderboard" aria-label="Leaderboards" data-reveal data-reveal-delay="short">
              <p className="eyebrow">Leaderboards</p>
              <ul>{s.leaderboardCategories.map((cat, i) => <li key={i}>{cat}</li>)}</ul>
              <p className="sd-meta">Live leaderboards: coming soon</p>
            </aside>
          </div>
          <p className="lead sd-line" data-reveal>Shared challenges create bonds faster than shared space.</p>
        </div>
      </section>

      {eventGroups.length > 0 && (
        <section className="section sd-band" id="events">
          <div className="shell">
            <div className="section-heading split-heading light-split" data-reveal><div><p className="eyebrow">Events</p><h2>Camps, workshops & events.</h2></div><p>Founding members get priority booking for camps, workshops and events.</p></div>
            {eventGroups.map((g) => (
              <div className="sd-event-group" key={g.kind}>
                <h3 className="sd-subhead" data-reveal>{g.label}</h3>
                <ul className="sd-grid sd-grid-3" data-reveal="stagger">{g.events.map((e) => <EventCard event={e} key={e.id} />)}</ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </DetailTemplate>
  );
}
