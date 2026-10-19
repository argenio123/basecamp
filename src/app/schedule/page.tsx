import type { Metadata } from "next";
import Link from "next/link";
import { OverviewTemplate } from "@/components/nav/PageTemplates";
import Timetable from "@/components/schedule/Timetable";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import StatusBadge from "@/components/ui/StatusBadge";
import { getSiteContent } from "@/content/get";
import { PHASE_COPY } from "@/content/labels";
import type { LaunchPhase } from "@/content/types";

export const metadata: Metadata = {
  title: "Schedule & timetable",
  description: "The weekly rhythm at BaseCamp CamSur: morning classes, open gym, private sessions and evening programming. Preview the timetable, then see events or request a session.",
};

const pad = (n: number) => String(n).padStart(2, "0");
const TIMETABLE_STATUS: Record<LaunchPhase, string> = { "pre-launch": "Preview", "soft-opening": "Invitation only", live: "Open for requests" };

// Overview (stage-3 §1): At a glance · [rhythm] · [timetable] (coming soon) · cards → Events, Book.
// Static under cacheComponents: reads only the cached getSiteContent(). Legacy #night/#competition/#events/#book/
// #platform links are forwarded to the sub-pages by the root-layout HashForwarder (LEGACY_HASH_REDIRECTS).
export default async function SchedulePage() {
  const c = await getSiteContent();
  const s = c.schedule;
  const phase = c.settings.launchPhase;
  const notice = s.notice || PHASE_COPY[phase].scheduleNotice;
  const dayCount = new Set(s.timetable.map((slot) => slot.day)).size;

  return (
    <OverviewTemplate
      path="/schedule"
      hero={<PageHero eyebrow="Schedule" title="Continuous activation, morning to night." intro={s.intro} image="/images/programs/generated/personal-coaching.png" imageAlt="Coach supporting an athlete during a training session" />}
      glance={{
        summary: "Compare the weekly program, check what is available and choose the part of the day that fits how you train.",
        facts: [
          s.timetable.length > 0 && { label: "Weekly sessions", value: String(s.timetable.length) },
          dayCount > 0 && { label: "Days", value: dayCount === 7 ? "Monday to Sunday" : `${dayCount} days a week` },
          { label: "Timetable", value: TIMETABLE_STATUS[phase] },
        ],
      }}
      cta={<CtaBand eyebrow="Founding members" label={PHASE_COPY[phase].ctaLabel} />}
    >
      <section className="section" id="rhythm">
        <div className="shell">
          <div className="notice-bar" data-reveal><strong>Timetable status</strong><span>{notice}</span><Link href="/schedule/book">{PHASE_COPY[phase].bookingSubmit} ↗</Link></div>
          <div className="section-heading split-heading light-split" data-reveal><div><p className="eyebrow">Daily rhythm</p><h2>Choose your training window.</h2></div><p>The day balances coached sessions, independent training and one-to-one appointments.</p></div>
          <ol className="sd-rhythm" data-reveal="stagger">
            {s.rhythm.map((r, i) => <li key={r.id}><span className="sd-index">{pad(i + 1)}</span><h3>{r.title}</h3><p>{r.description}</p></li>)}
          </ol>
        </div>
      </section>

      <section className="section sd-band" id="timetable">
        <div className="shell">
          <div className="section-heading split-heading light-split" data-reveal>
            <div>
              <p className="eyebrow">Timetable preview</p>
              <h2>A week at BaseCamp.</h2>
              {phase !== "live" && <StatusBadge className="sd-heading-badge" availability="planned" label="Coming soon" />}
            </div>
            <p>{phase === "live" ? "Choose a session to request a place." : "Choose a session to request a place. Exact times are confirmed before opening."}</p>
          </div>
          <Timetable slots={s.timetable} />
        </div>
      </section>
    </OverviewTemplate>
  );
}
