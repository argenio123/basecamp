import type { Metadata } from "next";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import { RecurringRow } from "@/components/schedule/EventCards";
import CtaBand from "@/components/sections/CtaBand";
import { Split, Tiles } from "@/components/sections/Layouts";
import PageHero from "@/components/sections/PageHero";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatDateLabel } from "@/content/format";
import { getSiteContent } from "@/content/get";
import { CADENCE_ORDER, PHASE_COPY } from "@/content/labels";

export const metadata: Metadata = {
  title: "Events & night training",
  description: "Night training under lights, weekly competitions and leaderboards, and the BaseCamp CamSur events calendar.",
};

/** Short names for the night-training features (planned), shown as chips. */
const NIGHT_CHIPS = ["Stadium lighting", "Night Games", "Friday Night Lights", "Night runs", "Music + lights"];

// Three sections, three looks: night training (photo + chips, dark) → every week (compact rows + leaderboards) →
// the calendar (dark tiles). Anchors kept: #night, #competition, #events. Static: only the cached getSiteContent().
export default async function ScheduleEventsPage() {
  const c = await getSiteContent();
  const s = c.schedule;
  const phase = c.settings.launchPhase;
  const weekly = [...s.recurring].sort((a, b) => CADENCE_ORDER.indexOf(a.cadence) - CADENCE_ORDER.indexOf(b.cadence));
  const calendar = s.events.map((e) => ({ title: e.title, body: e.date ? formatDateLabel(e.date) : e.dateLabel || "Date to be announced" }));

  return (
    <DetailTemplate
      path="/schedule/events"
      hero={<PageHero title="Own the night. Compete every week." intro="Night training, weekly competition, and the events calendar." image="/images/programs/generated/endurance.png" imageAlt="Endurance training session" />}
      glance={{ summary: "Train under lights.\nCompete every week.\nJoin the calendar.", statement: true }}
      cta={<CtaBand eyebrow="Early members" label={PHASE_COPY[phase].ctaLabel} />}
    >
      <Split id="night" look="dark" eyebrow="Night training" title="Own the night." body="Train hard without the afternoon sun."
        chips={NIGHT_CHIPS} badge={<StatusBadge availability="planned" />}
        image="/images/programs/stations/sled-push-man.jpg" imageAlt="Athlete driving a loaded sled across the gym floor" />

      <section className="section sd-ev" id="competition">
        <div className="shell">
          <div className="sd-tt-head sd-tt-head-light" data-reveal>
            <div><p className="sd-tt-eyebrow">Every week</p><h2>Something to chase.</h2></div>
          </div>
          <div className="sd-ev-compete sd-ev-compete--short">
            <ul className="sd-ev-rows" data-reveal="stagger">{weekly.map((e, i) => <RecurringRow event={e} index={i} key={e.id} />)}</ul>
            <aside className="sd-ev-board sd-ev-leader" aria-label="Leaderboards" data-reveal data-reveal-delay="short">
              <p className="sd-tt-eyebrow">Leaderboards</p>
              <ol>{s.leaderboardCategories.map((cat, i) => <li key={i}><span>{String(i + 1).padStart(2, "0")}</span>{cat}</li>)}</ol>
              <p className="sd-ev-note"><i aria-hidden="true" />Live leaderboards coming soon</p>
            </aside>
          </div>
        </div>
      </section>

      {calendar.length > 0 && <Tiles id="events" eyebrow="Calendar" title="What's coming." items={calendar} />}
    </DetailTemplate>
  );
}
