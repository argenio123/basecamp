"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { FieldError, fieldA11y, submitWithoutReset } from "@/components/forms/FormStatus";
import { FlowNav, useStartOrLogin } from "@/components/forms/StepFlow";
import PrivacyNote from "@/components/ui/PrivacyNote";
import { TIER_OPTIONS } from "@/content/constants";
import { trackLead } from "@/lib/analytics";
import { submitLead } from "@/lib/leads/actions";
import { INITIAL_LEAD_RESULT } from "@/lib/leads/types";
import "@/styles/join-flow.css";

/** A monthly plan as shown on step 1 (name + price come from the pricing content). */
export type JoinPlan = { value: string; label: string; price: string; hint: string };
export type JoinContact = { phoneDisplay: string; phoneHref: string; email: string };

type Choice = { value: string; label: string; hint?: string };

const PERSONAS: Choice[] = [
  { value: "local", label: "I live in CamSur or Bicol", hint: "For training here week in, week out." },
  { value: "domestic", label: "I'm visiting from elsewhere in the Philippines", hint: "Manila and other domestic travelers." },
  { value: "international", label: "I'm visiting from abroad", hint: "International visitors and training trips." },
];
const GOALS: Choice[] = [
  { value: "Build strength", label: "Build strength" },
  { value: "Improve conditioning", label: "Improve conditioning" },
  { value: "Train for HYROX or a race", label: "Train for HYROX or a race" },
  { value: "Move better", label: "Move better" },
  { value: "Prioritize recovery", label: "Prioritize recovery" },
  { value: "Not sure yet", label: "Not sure yet — advise me" },
];
const FREQUENCY: Choice[] = [
  { value: "1–2 times a week", label: "1–2 times a week" },
  { value: "3–4 times a week", label: "3–4 times a week" },
  { value: "5 or more times a week", label: "5 or more times a week" },
  { value: "Not sure yet", label: "Not sure yet" },
];
const START: Choice[] = [
  { value: "As soon as we open", label: "As soon as we open", hint: "Founding-member rates go to the first members." },
  { value: "Within a month of opening", label: "Within a month of opening" },
  { value: "Later this year", label: "Later this year" },
  { value: "Just exploring", label: "Just exploring for now" },
];

type Answers = { tier: string; persona: string; goal: string; frequency: string; start: string };
type ChoiceKey = keyof Answers;

/** Screens in order. "intro" is the cover; "contact" is the last screen (nothing is sent before it). */
const STEPS = ["intro", "plan", "about", "goal", "frequency", "start", "contact"] as const;
type Step = (typeof STEPS)[number];
const QUESTION_COUNT = STEPS.length - 1;

/**
 * Membership application (/membership/join): a one-question-per-screen flow. A cover screen, five single-pick
 * questions (pick, then Continue), then contact details. Saved as an early-access lead (tier + persona, the other
 * answers in the message) so it lands in the admin leads inbox.
 */
export default function MembershipJoinForm(props: { plans: JoinPlan[]; contact: JoinContact; image: string; initialTier?: string | null; autoStart?: boolean }) {
  const [formKey, setFormKey] = useState(0);
  // "Start over" after sending returns to the cover screen, even when the form opened on the first question.
  return <JoinFlow key={formKey} {...props} autoStart={formKey === 0 && props.autoStart} onReset={() => setFormKey((k) => k + 1)} />;
}

function JoinFlow({ plans, contact, image, initialTier, autoStart, onReset }: { plans: JoinPlan[]; contact: JoinContact; image: string; initialTier?: string | null; autoStart?: boolean; onReset: () => void }) {
  const [state, formAction, pending] = useActionState(submitLead, INITIAL_LEAD_RESULT);
  const id = useId();
  const presetTier = TIER_OPTIONS.some((t) => t.value === initialTier) ? (initialTier as string) : "";
  const [step, setStep] = useState<Step>(autoStart ? "plan" : "intro");
  const [answers, setAnswers] = useState<Answers>({ tier: presetTier, persona: "", goal: "", frequency: "", start: "" });
  const [notes, setNotes] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const index = STEPS.indexOf(step);

  // Move focus to each new question (keyboard and screen-reader users land on it), and back to the top of the flow.
  useEffect(() => {
    // On load, only an auto-started form (opened on its first question) takes focus and scrolls to the question.
    if (firstRender.current) { firstRender.current = false; if (!autoStart) return; }
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.closest(".jf")?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [step, autoStart]);

  useEffect(() => {
    if (state.status === "success") trackLead("early-access");
  }, [state]);

  const go = (to: Step) => setStep(to);
  const next = () => go(STEPS[Math.min(index + 1, STEPS.length - 1)]);
  const back = () => go(STEPS[Math.max(index - 1, 0)]);
  const startOrLogin = useStartOrLogin(next);
  const pick = (key: ChoiceKey, value: string) => {
    setAnswers((a) => ({ ...a, [key]: value }));
  };

  const message = [
    answers.goal && `Goal: ${answers.goal}`,
    answers.frequency && `Training: ${answers.frequency}`,
    answers.start && `Start: ${answers.start}`,
    notes.trim() && `\n${notes.trim()}`,
  ].filter(Boolean).join("\n");

  if (state.status === "success") {
    return (
      <div className="jf jf-done" role="status">
        <span className="jf-done-mark" aria-hidden="true">✓</span>
        <h2>Application received.</h2>
        <p>{state.message}</p>
        <div className="jf-done-actions">
          <Link href="/membership" className="jf-start">Back to membership</Link>
          <button type="button" className="jf-back" onClick={onReset}>Send another</button>
        </div>
      </div>
    );
  }

  const question = (key: ChoiceKey, title: string, hint: string, choices: Choice[], extra?: ReactNode) => (
    <fieldset className="jf-q">
      <legend className="jf-sr">{title}</legend>
      <h2 ref={headingRef} tabIndex={-1}>{title}</h2>
      {hint && <p className="jf-hint">{hint}</p>}
      <div className="jf-options" role="radiogroup" aria-label={title}>
        {choices.map((c) => (
          <button type="button" role="radio" aria-checked={answers[key] === c.value} className="jf-option" key={c.value} onClick={() => pick(key, c.value)}>
            <i aria-hidden="true" />
            <span><strong>{c.label}</strong>{c.hint && <small>{c.hint}</small>}</span>
          </button>
        ))}
      </div>
      {extra}
      <FlowNav onBack={back} canContinue={Boolean(answers[key])} onContinue={next} />
    </fieldset>
  );

  return (
    <form className="jf" action={formAction} onSubmit={(e) => { if (step !== "contact") { e.preventDefault(); return; } submitWithoutReset(formAction)(e); }} noValidate aria-busy={pending || undefined}>
      {/* Answers collected on earlier screens travel as hidden fields. */}
      <input type="hidden" name="kind" value="early-access" />
      <input type="hidden" name="source" value="/membership/join" />
      <input type="hidden" name="interests" value="membership-local" />
      <input type="hidden" name="tier" value={answers.tier || "unsure"} />
      <input type="hidden" name="persona" value={answers.persona || "local"} />
      <input type="hidden" name="message" value={message} />
      <div className="ui-hp" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {step === "intro" ? (
        <div className="jf-intro">
          <div className="jf-intro-copy">
            <h1 ref={headingRef} tabIndex={-1}>Tell us how you want to train</h1>
            <p className="jf-lead">A few quick questions, one per screen. What you answer is what our membership team reads before replying, so the first conversation starts somewhere useful.</p>
            <div className="jf-start-row">
              <button type="button" className="jf-start" onClick={startOrLogin}>Start <span aria-hidden="true">›</span></button>
              {(contact.phoneDisplay || contact.email) && (
                <p className="jf-alt">Prefer to call or write?{" "}
                  {contact.phoneDisplay && <a href={contact.phoneHref}>{contact.phoneDisplay}</a>}
                  {contact.phoneDisplay && contact.email && " · "}
                  {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
                </p>
              )}
            </div>
            <ul className="jf-facts">
              <li><strong>About a minute</strong><span>One question per screen, and Back works the whole way through. Nothing is sent until the last screen.</span></li>
              <li><strong>A reply within one business day</strong><span>Our team answers with rates, start dates and founding-member availability.</span></li>
              <li><strong>Nothing to prepare</strong><span>This is a conversation, not a contract. No payment and no documents: a name and a way to reach you is enough.</span></li>
            </ul>
          </div>
          <figure className="jf-intro-media">
            <div><Image src={image} alt="Members training together inside the BaseCamp CamSur training hall" fill sizes="(max-width: 900px) 100vw, 60vw" className="cover-image" /></div>
            <figcaption>Our team meets new members on site in Pili, Camarines Sur.</figcaption>
          </figure>
        </div>
      ) : (
        <div className="jf-stage">
          <div className="jf-progress" aria-hidden="true">
            <span><i style={{ width: `${(index / QUESTION_COUNT) * 100}%` }} /></span>
            <em>{index} / {QUESTION_COUNT}</em>
          </div>
          <p className="jf-sr" aria-live="polite">Question {index} of {QUESTION_COUNT}</p>

          {step === "plan" && question("tier", "Which membership are you drawn to?", "Rates are proposed until opening. Not sure? Pick “advise me” and we'll match you to the right one.",
            plans.map((p) => ({ value: p.value, label: p.price ? `${p.label} · ${p.price}` : p.label, hint: p.hint })),
            <div className="jf-aside">
              <p>Not here to join?</p>
              <Link href="/schedule/book" className="jf-option jf-option--link"><i aria-hidden="true" /><span><strong>Book a single session</strong><small>For a class, open gym or recovery appointment.</small></span></Link>
              <Link href="/membership/price-guide" className="jf-option jf-option--link"><i aria-hidden="true" /><span><strong>See day passes and packs</strong><small>For visitors and occasional training.</small></span></Link>
            </div>)}
          {step === "about" && question("persona", "Where are you based?", "So we can send the right rates and options.", PERSONAS)}
          {step === "goal" && question("goal", "What do you want to work on?", "Pick the main one. You can tell us more at the end.", GOALS)}
          {step === "frequency" && question("frequency", "How often do you plan to train?", "", FREQUENCY)}
          {step === "start" && question("start", "When would you like to start?", "", START)}

          {step === "contact" && (
            <fieldset className="jf-q">
              <legend className="jf-sr">How can we reach you?</legend>
              <h2 ref={headingRef} tabIndex={-1}>How can we reach you?</h2>
              <p className="jf-hint">Last screen. We reply by email or phone, whichever you prefer.</p>
              {state.status === "error" && state.message && <p className="jf-error" role="alert">{state.message}</p>}
              <div className="jf-fields">
                <label className="jf-field" htmlFor={`${id}-first`}><span className="jf-label">First name*</span>
                  <input id={`${id}-first`} name="firstName" autoComplete="given-name" required maxLength={80} {...fieldA11y(state, `${id}-first`, "firstName")} />
                  <FieldError id={`${id}-first`} state={state} name="firstName" />
                </label>
                <label className="jf-field" htmlFor={`${id}-last`}><span className="jf-label">Surname</span>
                  <input id={`${id}-last`} name="lastName" autoComplete="family-name" maxLength={80} {...fieldA11y(state, `${id}-last`, "lastName")} />
                  <FieldError id={`${id}-last`} state={state} name="lastName" />
                </label>
                <label className="jf-field" htmlFor={`${id}-email`}><span className="jf-label">Email*</span>
                  <input id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={254} {...fieldA11y(state, `${id}-email`, "email")} />
                  <FieldError id={`${id}-email`} state={state} name="email" />
                </label>
                <label className="jf-field" htmlFor={`${id}-phone`}><span className="jf-label">Phone</span>
                  <input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" maxLength={30} {...fieldA11y(state, `${id}-phone`, "phone")} />
                  <FieldError id={`${id}-phone`} state={state} name="phone" />
                </label>
                <label className="jf-field jf-field--wide" htmlFor={`${id}-notes`}><span className="jf-label">Anything else? <small>Optional</small></span>
                  <textarea id={`${id}-notes`} rows={3} maxLength={1500} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Injuries, schedule, questions about plans…" />
                  <FieldError id={`${id}-notes`} state={state} name="message" />
                </label>
              </div>
              <label className="jf-check" htmlFor={`${id}-consent`}>
                <input id={`${id}-consent`} name="consent" type="checkbox" required {...fieldA11y(state, `${id}-consent`, "consent")} />
                <span>I agree to be contacted by BaseCamp CamSur about membership.</span>
              </label>
              <FieldError id={`${id}-consent`} state={state} name="consent" />
              <PrivacyNote />
              <FlowNav onBack={back} submitLabel="Send application" pending={pending} />
            </fieldset>
          )}
        </div>
      )}
    </form>
  );
}

