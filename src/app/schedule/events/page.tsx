import type { Metadata } from "next";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import { RecurringRow } from "@/components/schedule/EventCards";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { getSiteContent } from "@/content/get";
import { CADENCE_ORDER } from "@/content/labels";
import { alternatesFor } from "@/i18n/paths";
import { getUi, t } from "@/i18n/server";

export const metadata: Metadata = {
  title: "Competitions & events",
  description: "Weekly gym competitions and BaseCamp CamSur leaderboards.",
  alternates: alternatesFor("/schedule/events"),
};

// Weekly competition and leaderboards.
// Static under cacheComponents: only the cached getSiteContent() is read. /fil/schedule/events reuses this page.
export default async function ScheduleEventsPage() {
  const c = await getSiteContent();
  const s = c.schedule;
  const phase = c.settings.launchPhase;
  const weekly = [...s.recurring].sort((a, b) => CADENCE_ORDER.indexOf(a.cadence) - CADENCE_ORDER.indexOf(b.cadence));

  return (
    <DetailTemplate
      path="/schedule/events"
      hero={<PageHero variant="compact" title={t("Race the floor. Compete every week.")} intro={t("Weekly competition and leaderboards.")} image="/images/schedule/generated/gym-competition-night.webp" imageAlt={t("Athletes racing weighted sleds during a gym competition")} />}
      glance={{ summary: t("Race the floor.\nChase your best.\nCompete every week."), statement: true }}
      cta={<CtaBand eyebrow={t("Early members")} label={getUi().labels.phase[phase].ctaLabel} />}
    >
      <section className="section sd-ev" id="competition">
        <div className="shell">
          <div className="sd-tt-head sd-tt-head-light" data-reveal>
            <div><p className="sd-tt-eyebrow">{t("Every week")}</p><h2>{t("Something to chase.")}</h2></div>
          </div>
          <div className="sd-ev-compete sd-ev-compete--short">
            <ul className="sd-ev-rows" data-reveal="stagger">{weekly.map((e, i) => <RecurringRow event={e} index={i} key={e.id} />)}</ul>
            <aside className="sd-ev-board sd-ev-leader" aria-label={t("Leaderboards")} data-reveal data-reveal-delay="short">
              <p className="sd-tt-eyebrow">{t("Leaderboards")}</p>
              <ol>{s.leaderboardCategories.map((cat, i) => <li key={i}><span>{String(i + 1).padStart(2, "0")}</span>{cat}</li>)}</ol>
              <p className="sd-ev-note"><i aria-hidden="true" />{t("Live leaderboards coming soon")}</p>
            </aside>
          </div>
        </div>
      </section>

    </DetailTemplate>
  );
}
