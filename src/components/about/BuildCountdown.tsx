"use client";

import { useSyncExternalStore } from "react";
import { formatDateLabel } from "@/content/format";
import { useLocale } from "@/i18n/client";
import { fmt } from "@/i18n/ui";
import { UI_VISIT_ABOUT } from "@/i18n/ui-sections/visit-about";

// The clock is external browser state, read with useSyncExternalStore (spec §0.16): the snapshot is a stable
// primitive (whole minutes) and the server snapshot is null, so the prerendered HTML and hydration both show
// the "to be announced" state and /about/the-build stays static.
const subscribe = (onChange: () => void) => {
  const timer = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(timer);
};
const getSnapshot = () => Math.floor(Date.now() / 60_000);
const getServerSnapshot = () => null;

const MINUTE = 60_000;

/** Countdown to settings.openingDate ("YYYY-MM-DD", Asia/Manila). Unknown date → "to be announced". */
export default function BuildCountdown({ openingDate }: { openingDate: string }) {
  const ui = UI_VISIT_ABOUT[useLocale()].countdown;
  const minute = useSyncExternalStore<number | null>(subscribe, getSnapshot, getServerSnapshot);
  const target = /^\d{4}-\d{2}-\d{2}$/.test(openingDate) ? Date.parse(`${openingDate}T00:00:00+08:00`) : Number.NaN;

  if (Number.isNaN(target) || minute === null) {
    return <p className="ab-countdown ab-countdown-tba">{ui.tba}</p>;
  }

  const remaining = Math.max(0, Math.ceil((target - minute * MINUTE) / MINUTE));
  const units = [
    { label: ui.days, value: Math.floor(remaining / 1440) },
    { label: ui.hours, value: Math.floor((remaining % 1440) / 60) },
    { label: ui.minutes, value: remaining % 60 },
  ];

  return (
    <div className="ab-countdown" role="timer" aria-label={fmt(ui.opening, { date: formatDateLabel(openingDate) })}>
      <dl className="ab-countdown-units">
        {units.map((unit) => (
          <div key={unit.label}><dt>{unit.label}</dt><dd>{String(unit.value).padStart(2, "0")}</dd></div>
        ))}
      </dl>
      <p className="ab-countdown-date">{fmt(ui.opening, { date: formatDateLabel(openingDate) })}</p>
    </div>
  );
}
