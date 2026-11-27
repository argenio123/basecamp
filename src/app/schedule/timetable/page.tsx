import type { Metadata } from "next";
import { DetailTemplate } from "@/components/nav/PageTemplates";
import Timetable, { type TimetableEntry } from "@/components/schedule/Timetable";
import CtaBand from "@/components/sections/CtaBand";
import PageHero from "@/components/sections/PageHero";
import { getSiteContent } from "@/content/get";
import { PHASE_COPY } from "@/content/labels";
import { getData } from "@/i18n/data";
import { alternatesFor } from "@/i18n/paths";
import { localHref, t } from "@/i18n/server";

const PATH = "/schedule/timetable";

export const metadata: Metadata = {
  title: "Weekly timetable",
  description: "The BaseCamp CamSur weekly timetable: sunrise and evening coached classes and Friday Night Lights. Filter by session and request a place.",
  alternates: alternatesFor(PATH),
};

// Static under cacheComponents: reads only the cached getSiteContent(). Moved from the /schedule overview (#timetable).
// /fil/schedule/timetable reuses this page (src/i18n/README.md): content, t() and getData() follow the request locale.
export default async function TimetablePage() {
  const c = await getSiteContent();
  const s = c.schedule;
  const phase = c.settings.launchPhase;
  const notice = s.notice || t(PHASE_COPY[phase].scheduleNotice);
  // Weekday names, session categories and the caption for the client timetable, in the page's language.
  const { SLOT_CATEGORY_LABEL, TIMETABLE_CAPTION, WEEKDAY_LABEL } = getData("programs-static");

  // Each session carries its programme's zone and level (no coach is published yet: cards show "Coach TBA").
  const entries: TimetableEntry[] = s.timetable.map((slot) => {
    const programme = c.programmes.programmes.find((p) => p.slug === slot.programmeSlug);
    return { ...slot, zone: programme?.spaces[0]?.label, level: programme?.level.split(":")[0] };
  });

  return (
    <DetailTemplate
      path={PATH}
      hero={<PageHero variant="compact" title={t("Find your rhythm.")} intro={t("Browse the week, filter your session, and request a place in two taps.")} image="/images/schedule/generated/timetable-class-briefing.webp" imageAlt={t("Coach briefing gym members beside a weekly session board and wall clock")} imagePosition="72% center" />}
      glance={{ summary: t("Pick your day.\nFilter your session.\nRequest your place."), statement: true }}
      cta={<CtaBand eyebrow={t("Early members")} label={t(PHASE_COPY[phase].ctaLabel)} />}
    >
      <section className="section sd-band sd-tt" id="timetable">
        <div className="shell">
          <div className="sd-tt-head" data-reveal>
            <div>
              <p className="sd-tt-eyebrow">{t("Weekly timetable")}</p>
              <h2>{t("This week at BaseCamp.")}</h2>
            </div>
            <p>{phase === "live" ? t("Pick a day, filter your session, and reserve in two taps.") : t("Pick a day, filter your session, and request a place in two taps. Exact times are confirmed before opening.")}</p>
          </div>
          <Timetable
            slots={entries}
            status={notice}
            statusHref={localHref("/schedule/book")}
            statusLabel={t(PHASE_COPY[phase].bookingSubmit)}
            labels={{ weekday: WEEKDAY_LABEL, category: SLOT_CATEGORY_LABEL, caption: TIMETABLE_CAPTION }}
          />
        </div>
      </section>
    </DetailTemplate>
  );
}
