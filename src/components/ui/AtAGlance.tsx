export type GlanceFact = { label?: string; value: string };

type AtAGlanceProps = {
  /** One sentence, ≤25 words. */
  summary: string;
  /** 3–4 key facts taken from content. Empty values are dropped (never "TBA" chips). Max 4 shown. */
  facts?: readonly (GlanceFact | string | null | undefined | false)[];
  eyebrow?: string;
  id?: string;
};

/** "At a glance" band under the hero on section pages: a one-line summary plus optional fact chips. */
export default function AtAGlance({ summary, facts = [], eyebrow = "At a glance", id }: AtAGlanceProps) {
  const chips = facts
    .flatMap((f): GlanceFact[] => (!f ? [] : typeof f === "string" ? [{ value: f }] : [f]))
    .filter((f) => f.value.trim() !== "")
    .slice(0, 4);

  return (
    <section id={id} className="nv-glance" aria-labelledby={id ? `${id}-title` : undefined}>
      <div className="shell nv-glance-inner">
        <div className="nv-glance-main" data-reveal>
          <p className="eyebrow" id={id ? `${id}-title` : undefined}>{eyebrow}</p>
          <p className="nv-glance-summary">{summary}</p>
          {chips.length > 0 && (
            <ul className="nv-glance-facts" aria-label="Key facts">
              {chips.map((f) => (
                <li key={`${f.label ?? ""}${f.value}`} className="nv-chip">
                  {f.label && <span className="nv-chip-label">{f.label}</span>}
                  <span className="nv-chip-value">{f.value}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
