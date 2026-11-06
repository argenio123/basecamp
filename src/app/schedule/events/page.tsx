import type { Metadata } from "next";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import { EventRow, RecurringRow } from "@/components/schedule/EventCards";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import StatusBadge from "@/components/ui/StatusBadge";
import { getSiteContent } from "@/content/get";
import { CADENCE_ORDER, PHASE_COPY } from "@/content/labels";
import { EVENT_KIND_GROUPS, NIGHT_ELEMENTS } from "@/data/programs-static";

export const metadata: Metadata = {
  title: "Events & night training",
  description: "Night training under lights, weekly competitions and leaderboards, and the BaseCamp CamSur calendar of festivals, workshops, and community events.",
};

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
      hero={<PageHero title="Own the night. Compete every week." intro="Training under lights, weekly competition, and a calendar of festivals, workshops, and community events." image="/images/programs/generated/endurance.png" imageAlt="Endurance training session" />}
      glance={{ summary: "Train under lights.\nCompete every week.\nJoin the calendar.", statement: true }}
      cta={<CtaBand eyebrow="Early members" label={PHASE_COPY[phase].ctaLabel} />}
    >
      <section className="section sd-ev sd-ev-dark" id="night">
        <div className="shell">
          <div className="sd-tt-head" data-reveal>
            <div><p className="sd-tt-eyebrow">Night training</p><h2>Own a time slot others ignore.</h2></div>
            <p>Train hard without the afternoon sun: lights, music, and a crowd at the lakefront.</p>
          </div>
          <div className="sd-ev-board">
            <ol className="sd-ev-tiles" data-reveal="stagger">
              {NIGHT_ELEMENTS.map((n, i) => (
                <li key={n.id}>
                  <span className="sd-ev-num">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{n.title}</h3>
                  <p>{n.description}</p>
                  <StatusBadge availability={n.availability} />
                </li>
              ))}
            </ol>
            {night.length > 0 && <>
              <h3 className="sd-ev-subhead" data-reveal>Weekly after dark</h3>
              <ul className="sd-ev-rows" data-reveal="stagger">{night.map((e, i) => <RecurringRow event={e} index={i} key={e.id} />)}</ul>
            </>}
          </div>
        </div>
      </section>

      <section className="section sd-ev" id="competition">
        <div className="shell">
          <div className="sd-tt-head sd-tt-head-light" data-reveal>
            <div><p className="sd-tt-eyebrow">Competition</p><h2>Something to chase every week.</h2></div>
            <p>There&apos;s always something to train for, a leaderboard to climb, and a challenge to attempt.</p>
          </div>
          <div className="sd-ev-compete">
            <ul className="sd-ev-rows" data-reveal="stagger">{daily.map((e, i) => <RecurringRow event={e} index={i} key={e.id} />)}</ul>
            <aside className="sd-ev-board sd-ev-leader" aria-label="Leaderboards" data-reveal data-reveal-delay="short">
              <p className="sd-tt-eyebrow">Leaderboards</p>
              <ol>{s.leaderboardCategories.map((cat, i) => <li key={i}><span>{String(i + 1).padStart(2, "0")}</span>{cat}</li>)}</ol>
              <p className="sd-ev-note"><i aria-hidden="true" />Live leaderboards coming soon</p>
            </aside>
          </div>
        </div>
      </section>

      {eventGroups.length > 0 && (
        <section className="section sd-ev sd-ev-band" id="events">
          <div className="shell">
            <div className="sd-tt-head sd-tt-head-light" data-reveal>
              <div><p className="sd-tt-eyebrow">Calendar</p><h2>Camps, workshops, and events.</h2></div>
              <p>Early members get priority booking for camps, workshops, and events.</p>
            </div>
            {eventGroups.map((g) => (
              <div className="sd-ev-group" key={g.kind}>
                <h3 className="sd-ev-subhead" data-reveal>{g.label}</h3>
                <ul className="sd-ev-rows" data-reveal="stagger">{g.events.map((e, i) => <EventRow event={e} index={i} key={e.id} />)}</ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </DetailTemplate>
  );
}
