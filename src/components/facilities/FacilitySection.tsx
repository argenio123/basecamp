import type { ReactNode } from "react";

/**
 * The one section shell used by every /facilities content section, so all pages share the same heading,
 * spacing and background rhythm. The four facilities layouts are:
 *   1. Statement band   (AtAGlance `statement`, from the page template)
 *   2. Card grid        (<FacilitySection tone="light" | "stone"> + ItemList / card grids)
 *   3. Dark feature band (<FacilitySection tone="dark">)
 *   4. Photo grid       (gallery / image-led explore lists)
 * Page rhythm: content sections alternate light → stone, and the last one is the dark band.
 */
export type FacilityTone = "light" | "stone" | "dark";

type FacilitySectionProps = {
  id: string;
  tone: FacilityTone;
  eyebrow: string;
  title: string;
  /** Short line under the title, on the right on wide screens. */
  intro?: string;
  /** Extra items beside the intro (e.g. a status badge). */
  aside?: ReactNode;
  children: ReactNode;
};

export default function FacilitySection({ id, tone, eyebrow, title, intro, aside, children }: FacilitySectionProps) {
  const titleId = `${id}-title`;
  return (
    <section id={id} className={`section fc-sec fc-sec--${tone}${tone === "dark" ? " section-dark" : ""}`} aria-labelledby={titleId}>
      <div className="shell">
        <header className="fc-sec-head" data-reveal>
          <div>
            <p className="fc-sec-eyebrow">{eyebrow}</p>
            <h2 id={titleId}>{title}</h2>
          </div>
          {(intro || aside) && <div className="fc-sec-intro">{intro && <p>{intro}</p>}{aside}</div>}
        </header>
        {children}
      </div>
    </section>
  );
}
