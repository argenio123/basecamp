// Shared layout for the legal pages (/privacy and /terms). `_legal` is a private folder: not a route.
// Solid-header page (no image hero): draft notice → title block → "On this page" index → numbered sections.
import type { ReactNode } from "react";
import { LEGAL_LAST_UPDATED, LEGAL_LAST_UPDATED_LABEL, LEGAL_REVIEW_DONE } from "@/data/legal";
import "@/styles/legal.css";

export type LegalSection = { id: string; label: string };

type LegalShellProps = {
  /** "privacy policy" / "terms of use", used in the draft notice. */
  docName: string;
  eyebrow: string;
  title: string;
  intro: ReactNode;
  sections: readonly LegalSection[];
  children: ReactNode;
};

export default function LegalShell({ docName, eyebrow, title, intro, sections, children }: LegalShellProps) {
  return (
    <article className="lg-page">
      <div className="shell lg-shell">
        {!LEGAL_REVIEW_DONE && (
          <aside className="lg-draft" role="note" aria-label="Draft notice">
            <p className="lg-draft-title">Draft, under legal review</p>
            <p>
              This {docName} is a working draft. It was written from how this website works today and is now with
              BaseCamp CamSur&apos;s privacy officer and legal adviser for review, so the wording may change before it
              is final. Text in <Tbc>square brackets</Tbc> is still to be confirmed.
            </p>
          </aside>
        )}

        <header className="lg-head">
          <p className="lg-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <div className="lg-intro">{intro}</div>
          <p className="lg-meta">Last updated <time dateTime={LEGAL_LAST_UPDATED}>{LEGAL_LAST_UPDATED_LABEL}</time></p>
        </header>

        <div className="lg-layout">
          <nav className="lg-toc" aria-label="On this page">
            <p className="lg-toc-title">On this page</p>
            <ol>
              {sections.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.label}</a></li>)}
            </ol>
          </nav>
          <div className="lg-body">{children}</div>
        </div>
      </div>
    </article>
  );
}

/** One numbered section; the heading text comes from the same list that builds the index. */
export function LegalSectionBlock({ section, n, children }: { section: LegalSection; n: number; children: ReactNode }) {
  return (
    <section id={section.id} className="lg-section" aria-labelledby={`${section.id}-title`}>
      <h2 id={`${section.id}-title`}><span className="lg-num">{String(n).padStart(2, "0")}</span>{section.label}</h2>
      {children}
    </section>
  );
}

/** An obvious placeholder for a detail the business or its lawyer must supply: renders as "[…]". */
export function Tbc({ children = "to be confirmed" }: { children?: ReactNode }) {
  return <mark className="lg-tbc">[{children}]</mark>;
}
