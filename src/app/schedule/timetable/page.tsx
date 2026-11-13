import type { Metadata } from "next";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import Timetable, { type TimetableEntry } from "@/components/schedule/Timetable";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { getSiteContent } from "@/content/get";
import { PHASE_COPY } from "@/content/labels";

const PATH = "/schedule/timetable";

export const metadata: Metadata = {
  title: "Weekly timetable",
  description: "The BaseCamp CamSur weekly timetable: sunrise and evening coached classes and Friday Night Lights. Filter by session and request a place.",
};

// Static under cacheComponents: reads only the cached getSiteContent(). Moved from the /schedule overview (#timetable).
export default async function TimetablePage() {
  const c = await getSiteContent();
  const s = c.schedule;
  const phase = c.settings.launchPhase;
  const notice = s.notice || PHASE_COPY[phase].scheduleNotice;

  // Each session carries its programme's zone and level (no coach is published yet: cards show "Coach TBA").
  const entries: TimetableEntry[] = s.timetable.map((slot) => {
    const programme = c.programmes.programmes.find((p) => p.slug === slot.programmeSlug);
    return { ...slot, zone: programme?.spaces[0]?.label, level: programme?.level.split(":")[0] };
  });

  return (
    <DetailTemplate
      path={PATH}
      hero={<PageHero title="Find your rhythm." intro="Browse the week, filter your session, and request a place in two taps." image="/images/programs/stations/row.jpg" imageAlt="Athlete on a rowing machine at BaseCamp CamSur" imagePosition="72% center" />}
      glance={{ summary: "Pick your day.\nFilter your session.\nRequest your place.", statement: true }}
      cta={<CtaBand eyebrow="Early members" label={PHASE_COPY[phase].ctaLabel} />}
    >
      <section className="section sd-band sd-tt" id="timetable">
        <div className="shell">
          <div className="sd-tt-head" data-reveal>
            <div>
              <p className="sd-tt-eyebrow">Weekly timetable</p>
              <h2>This week at BaseCamp.</h2>
            </div>
            <p>{phase === "live" ? "Pick a day, filter your session, and reserve in two taps." : "Pick a day, filter your session, and request a place in two taps. Exact times are confirmed before opening."}</p>
          </div>
          <Timetable slots={entries} status={notice} statusHref="/schedule/book" statusLabel={PHASE_COPY[phase].bookingSubmit} />
        </div>
      </section>
    </DetailTemplate>
  );
}
