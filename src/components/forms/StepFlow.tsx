"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ReactNode, Ref } from "react";
import { MEMBER_HINT, loginHref } from "@/lib/members/types";
import "@/styles/join-flow.css";

// Building blocks for the one-question-per-screen forms (/membership/join, /schedule/book):
// cover screen, progress bar, single-pick option cards and the Back / Continue row. Styles: src/styles/join-flow.css.

/**
 * The cover's Start button: members go straight to the first question; visitors are sent to log in (or create an
 * account) and come back to this form with ?start=1, which opens it on the first question.
 */
export function useStartOrLogin(start: () => void) {
  const router = useRouter();
  return () => {
    if (document.cookie.split("; ").some((c) => c === `${MEMBER_HINT}=1`)) { start(); return; }
    const url = new URL(window.location.href);
    url.searchParams.set("start", "1");
    router.push(loginHref(`${url.pathname}${url.search}`));
  };
}

export type FlowChoice = { value: string; label: string; hint?: string };
export type FlowContact = { phoneDisplay: string; phoneHref: string; email: string };

export function FlowCover({ title, lead, facts, contact, image, imageAlt, caption, onStart, headingRef }: {
  title: string; lead: string; facts: { title: string; body: string }[]; contact: FlowContact;
  image: string; imageAlt: string; caption: string; onStart: () => void; headingRef: Ref<HTMLHeadingElement>;
}) {
  return (
    <div className="jf-intro">
      <div className="jf-intro-copy">
        <h1 ref={headingRef} tabIndex={-1}>{title}</h1>
        <p className="jf-lead">{lead}</p>
        <div className="jf-start-row">
          <button type="button" className="jf-start" onClick={onStart}>Start <span aria-hidden="true">›</span></button>
          {(contact.phoneDisplay || contact.email) && (
            <p className="jf-alt">Prefer to call or write?{" "}
              {contact.phoneDisplay && <a href={contact.phoneHref}>{contact.phoneDisplay}</a>}
              {contact.phoneDisplay && contact.email && " · "}
              {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
            </p>
          )}
        </div>
        <ul className="jf-facts">
          {facts.map((f) => <li key={f.title}><strong>{f.title}</strong><span>{f.body}</span></li>)}
        </ul>
      </div>
      <figure className="jf-intro-media">
        <div><Image src={image} alt={imageAlt} fill sizes="(max-width: 900px) 100vw, 60vw" className="cover-image" /></div>
        <figcaption>{caption}</figcaption>
      </figure>
    </div>
  );
}

export function FlowProgress({ index, total }: { index: number; total: number }) {
  return (
    <>
      <div className="jf-progress" aria-hidden="true">
        <span><i style={{ width: `${(index / total) * 100}%` }} /></span>
        <em>{index} / {total}</em>
      </div>
      <p className="jf-sr" aria-live="polite">Question {index} of {total}</p>
    </>
  );
}

/** Single-pick option cards. `groups` adds a small divider heading above each group after the first. */
export function FlowOptions({ label, value, choices, groups, onPick }: {
  label: string; value: string; choices?: FlowChoice[]; groups?: { label: string; choices: FlowChoice[] }[]; onPick: (value: string) => void;
}) {
  const card = (c: FlowChoice) => (
    <button type="button" role="radio" aria-checked={value === c.value} className="jf-option" key={c.value || c.label} onClick={() => onPick(c.value)}>
      <i aria-hidden="true" />
      <span><strong>{c.label}</strong>{c.hint && <small>{c.hint}</small>}</span>
    </button>
  );
  if (groups) {
    return (
      <div className="jf-groups" role="radiogroup" aria-label={label}>
        {groups.map((g) => (
          <div className="jf-group" key={g.label}>
            <p className="jf-group-label">{g.label}</p>
            <div className={`jf-options${g.choices.length > 6 ? " jf-options--grid" : ""}`}>{g.choices.map(card)}</div>
          </div>
        ))}
      </div>
    );
  }
  return <div className="jf-options" role="radiogroup" aria-label={label}>{(choices ?? []).map(card)}</div>;
}

export function FlowNav({ onBack, onContinue, canContinue = false, submitLabel, pending = false, hint = "Pick one to continue" }: {
  onBack: () => void; onContinue?: () => void; canContinue?: boolean; submitLabel?: string; pending?: boolean; hint?: string;
}) {
  return (
    <div className="jf-nav">
      <button type="button" className="jf-back" onClick={onBack}><span aria-hidden="true">‹</span> Back</button>
      {submitLabel
        ? <button type="submit" className="jf-start" disabled={pending}>{pending ? "Sending…" : <>{submitLabel} <span aria-hidden="true">›</span></>}</button>
        : (
          <div className="jf-next">
            {!canContinue && <span className="jf-pick" aria-live="polite">{hint}</span>}
            <button type="button" className="jf-start" onClick={onContinue} disabled={!canContinue}>Continue <span aria-hidden="true">›</span></button>
          </div>
        )}
    </div>
  );
}

/** A question screen: heading (focus target), optional hint, body, and the nav row. */
export function FlowQuestion({ title, hint, headingRef, children, nav }: { title: string; hint?: string; headingRef: Ref<HTMLHeadingElement>; children: ReactNode; nav: ReactNode }) {
  return (
    <fieldset className="jf-q">
      <legend className="jf-sr">{title}</legend>
      <h2 ref={headingRef} tabIndex={-1}>{title}</h2>
      {hint && <p className="jf-hint">{hint}</p>}
      {children}
      {nav}
    </fieldset>
  );
}
