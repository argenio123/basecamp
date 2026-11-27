import type { CSSProperties } from "react";
import { t } from "@/i18n/server";

/**
 * "The camp experience" as a journey: heading left, a note right, then the four stages on one timeline. A Signal
 * line draws across the track when it scrolls into view and each stage's marker pops in after it; hovering a stage
 * fills its marker and lights its title. Phones: the timeline turns vertical with the line down the left.
 */
export default function CampJourney({ eyebrow, title, note, stages }: {
  eyebrow: string;
  title: string;
  note?: string;
  stages: { value: string; label: string }[];
}) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <section className="section vc-journey" aria-labelledby="vc-journey-title">
      <div className="shell">
        <header className="vc-journey-head" data-reveal>
          <div>
            <p className="vc-journey-eyebrow">{eyebrow}</p>
            <h2 id="vc-journey-title">{title}</h2>
          </div>
          {note && <p className="vc-journey-note">{note}</p>}
        </header>

        <div className="vc-journey-track" data-reveal style={{ "--vc-stages": stages.length } as CSSProperties}>
          <span className="vc-journey-line" aria-hidden="true"><span /></span>
          <ol>
            {stages.map((stage, i) => (
              <li key={stage.value} style={{ "--vc-i": i } as CSSProperties}>
                <span className="vc-journey-dot" aria-hidden="true">{pad(i + 1)}</span>
                <p className="vc-journey-step">{t("Stage {n}", { n: pad(i + 1) })}</p>
                <h3>{stage.value}</h3>
                <p className="vc-journey-label">{stage.label}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
