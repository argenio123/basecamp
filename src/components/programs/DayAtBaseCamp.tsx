import type { HomeContent } from "@/content/types";

/**
 * "A day at BaseCamp" (stage-3 §1/§2): moved from the homepage to the Programmes overview.
 * Renders home.dayFlow (same content key, still edited in the admin Homepage tab); hidden when disabled.
 */
export default function DayAtBaseCamp({ dayFlow }: { dayFlow: HomeContent["dayFlow"] }) {
  if (!dayFlow.enabled || dayFlow.steps.length === 0) return null;

  return (
    <section className="section pr-band" id="day-at-basecamp">
      <div className="shell">
        <div className="nv-block-head" data-reveal>
          <p className="eyebrow">Your day</p>
          <h2>{dayFlow.title}</h2>
        </div>
        <ol className="pr-day" data-reveal="stagger">
          {dayFlow.steps.map((step, i) => (
            <li key={step.id}>
              <span className="pr-index">{String(i + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
        {dayFlow.quote && <blockquote className="pr-quote" data-reveal data-reveal-delay="short"><p>{dayFlow.quote}</p></blockquote>}
      </div>
    </section>
  );
}
