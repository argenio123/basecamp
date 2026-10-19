"use client";

import { startTransition, useActionState, useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import FormStatus, { FieldError, fieldA11y, submitWithoutReset } from "@/components/forms/FormStatus";
import PrivacyNote from "@/components/ui/PrivacyNote";
import { ENQUIRY_TYPES, INTEREST_OPTIONS, PERSONA_OPTIONS, TIER_OPTIONS } from "@/content/constants";
import type { InterestValue } from "@/content/types";
import { trackLead } from "@/lib/analytics";
import { submitLead } from "@/lib/leads/actions";
import { INITIAL_LEAD_RESULT, type LeadKind, type LeadResult } from "@/lib/leads/types";

export type ProgrammeOption = { slug: string; title: string; interest: InterestValue };
type Props = { programmes: ProgrammeOption[]; program?: string; interests?: string[]; enquiry?: string };
type Tab = "early-access" | "enquiry";

const TABS: { id: Tab; label: string }[] = [{ id: "early-access", label: "Early access" }, { id: "enquiry", label: "Inquiry" }];
const INTEREST_VALUES = INTEREST_OPTIONS.map((o) => o.value as string);
const ENQUIRY_VALUES = ENQUIRY_TYPES.map((o) => o.value as string);

/**
 * /contact form: "Early access" (kind=early-access) and "Enquiry" (kind=enquiry) tabs, each with its own
 * useActionState(submitLead). Docs: 02-guides/forms.md, 03-api-reference/01-directives/use-server.md.
 * Props come from ProgramInterestForm (search params) or are empty in the prerendered Suspense fallback.
 */
export default function InterestForm({ programmes, program, interests = [], enquiry }: Props) {
  const selected = programmes.find((p) => p.slug === program);
  const preselected = [...new Set([...(selected ? [selected.interest] : []), ...interests.filter((v) => INTEREST_VALUES.includes(v))])];
  const enquiryType = enquiry && ENQUIRY_VALUES.includes(enquiry) ? enquiry : "";
  const [tab, setTab] = useState<Tab>(enquiry !== undefined ? "enquiry" : "early-access");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  const query = new URLSearchParams();
  if (selected) query.set("program", selected.slug);
  if (preselected.length && !selected) query.set("interest", preselected.join(","));
  if (enquiryType) query.set("enquiry", enquiryType);
  const qs = query.toString();
  const source = `/contact${qs ? `?${qs}` : ""}`;

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const keys: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: TABS.length - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = (keys[event.key] + TABS.length) % TABS.length;
    setTab(TABS[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="ct-form">
      <div className="ct-tabs" role="tablist" aria-label="Choose a form">
        {TABS.map((t, i) => (
          <button key={t.id} ref={(el) => { tabRefs.current[i] = el; }} type="button" role="tab" id={`${id}-tab-${t.id}`} aria-controls={`${id}-panel-${t.id}`}
            aria-selected={tab === t.id} tabIndex={tab === t.id ? 0 : -1} className="ct-tab" onClick={() => setTab(t.id)} onKeyDown={(e) => onTabKey(e, i)}>{t.label}</button>
        ))}
      </div>
      <div role="tabpanel" id={`${id}-panel-early-access`} aria-labelledby={`${id}-tab-early-access`} hidden={tab !== "early-access"} className="ct-panel">
        <Resettable>{(onReset) => <EarlyAccessPanel source={source} preselected={preselected} programmeTitle={selected?.title} onReset={onReset} />}</Resettable>
      </div>
      <div role="tabpanel" id={`${id}-panel-enquiry`} aria-labelledby={`${id}-tab-enquiry`} hidden={tab !== "enquiry"} className="ct-panel">
        <Resettable>{(onReset) => <EnquiryPanel source={source} enquiryType={enquiryType} onReset={onReset} />}</Resettable>
      </div>
    </div>
  );
}

/** Remounts its child (fresh useActionState) for "Submit another response". */
function Resettable({ children }: { children: (onReset: () => void) => ReactNode }) {
  const [key, setKey] = useState(0);
  return <div key={key}>{children(() => setKey((k) => k + 1))}</div>;
}

function useLeadForm(kind: LeadKind) {
  const [state, formAction, pending] = useActionState(submitLead, INITIAL_LEAD_RESULT);
  useEffect(() => {
    if (state.status === "success") trackLead(kind);
  }, [state, kind]);
  return { state, formAction, pending };
}

function Success({ title, state, onReset }: { title: string; state: LeadResult; onReset: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, []);
  return (
    <div className="form-success ct-success" role="status">
      <span aria-hidden="true">✓</span>
      <h2 ref={heading} tabIndex={-1}>{title}</h2>
      <p>{state.message}</p>
      <button type="button" className="text-link" onClick={onReset}>Submit another response</button>
    </div>
  );
}

function Hidden({ kind, source, id }: { kind: LeadKind; source: string; id: string }) {
  return <>
    <input type="hidden" name="kind" value={kind} />
    <input type="hidden" name="source" value={source} />
    <div className="ui-hp" aria-hidden="true">
      <label htmlFor={`${id}-website`}>Website</label>
      <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  </>;
}

function ContactFields({ id, state }: { id: string; state: LeadResult }) {
  return <>
    <div className="field-row">
      <label htmlFor={`${id}-first`}>First name*
        <input id={`${id}-first`} name="firstName" autoComplete="given-name" required maxLength={80} {...fieldA11y(state, `${id}-first`, "firstName")} />
        <FieldError id={`${id}-first`} state={state} name="firstName" />
      </label>
      <label htmlFor={`${id}-last`}>Surname
        <input id={`${id}-last`} name="lastName" autoComplete="family-name" maxLength={80} {...fieldA11y(state, `${id}-last`, "lastName")} />
        <FieldError id={`${id}-last`} state={state} name="lastName" />
      </label>
    </div>
    <div className="field-row">
      <label htmlFor={`${id}-email`}>Email*
        <input id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={254} {...fieldA11y(state, `${id}-email`, "email")} />
        <FieldError id={`${id}-email`} state={state} name="email" />
      </label>
      <label htmlFor={`${id}-phone`}>Phone
        <input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" maxLength={30} {...fieldA11y(state, `${id}-phone`, "phone")} />
        <FieldError id={`${id}-phone`} state={state} name="phone" />
      </label>
    </div>
  </>;
}

function Consent({ id, state, label }: { id: string; state: LeadResult; label: string }) {
  return <>
    <label className="check-field ct-check" htmlFor={`${id}-consent`}>
      <input id={`${id}-consent`} name="consent" type="checkbox" required {...fieldA11y(state, `${id}-consent`, "consent")} />
      <span>{label}</span>
    </label>
    <FieldError id={`${id}-consent`} state={state} name="consent" />
    <PrivacyNote />
  </>;
}

function Submit({ pending, label }: { pending: boolean; label: string }) {
  return <button className="button button-dark ct-submit" type="submit" disabled={pending} aria-disabled={pending}>{pending ? "Sending…" : <>{label} <span aria-hidden="true">↗</span></>}</button>;
}

function EarlyAccessPanel({ source, preselected, programmeTitle, onReset }: { source: string; preselected: string[]; programmeTitle?: string; onReset: () => void }) {
  const { state, formAction, pending } = useLeadForm("early-access");
  const id = useId();
  if (state.status === "success") return <Success title="You're on the list." state={state} onReset={onReset} />;

  return (
    <form className="interest-form ct-fields" action={formAction} onSubmit={submitWithoutReset(formAction)} noValidate>
      <Hidden kind="early-access" source={source} id={id} />
      <p className="ct-panel-intro">Founding-member rates, exclusive updates and priority access.{programmeTitle && <> You&apos;re asking about <strong>{programmeTitle}</strong>.</>}</p>
      <FormStatus state={state} />
      <ContactFields id={id} state={state} />
      <fieldset className="ct-fieldset">
        <legend>I am a…</legend>
        <div className="ct-options">
          {PERSONA_OPTIONS.map((o) => <label className="check-field ct-check" key={o.value}><input type="radio" name="persona" value={o.value} /><span>{o.label}</span></label>)}
        </div>
      </fieldset>
      <label htmlFor={`${id}-tier`}>Membership tier
        <select id={`${id}-tier`} name="tier" defaultValue=""><option value="">Select a tier (optional)</option>{TIER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
      </label>
      <fieldset className="ct-fieldset">
        <legend>I&apos;m interested in</legend>
        <div className="ct-options ct-options-grid">
          {INTEREST_OPTIONS.map((o) => <label className="check-field ct-check" key={o.value}><input type="checkbox" name="interests" value={o.value} defaultChecked={preselected.includes(o.value)} /><span>{o.label}</span></label>)}
        </div>
      </fieldset>
      <label htmlFor={`${id}-message`}>Message
        <textarea id={`${id}-message`} name="message" rows={4} maxLength={2000} placeholder="Anything we should know? Goals, dates, group size…" {...fieldA11y(state, `${id}-message`, "message")} />
        <FieldError id={`${id}-message`} state={state} name="message" />
      </label>
      <Consent id={id} state={state} label="I'm 18+ and agree to receive BaseCamp CamSur founding-member news and opening updates." />
      <Submit pending={pending} label="Join the founding list" />
    </form>
  );
}

function EnquiryPanel({ source, enquiryType, onReset }: { source: string; enquiryType: string; onReset: () => void }) {
  const { state, formAction, pending } = useLeadForm("enquiry");
  const id = useId();
  if (state.status === "success") return <Success title="Inquiry sent." state={state} onReset={onReset} />;

  // Organisation has no lead field: prefix it into the message ("Organisation: …"), keeping typed values on error.
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const organisation = String(formData.get("organisation") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    formData.delete("organisation");
    if (organisation && message) formData.set("message", `Organization: ${organisation}\n\n${message}`);
    startTransition(() => formAction(formData));
  }

  return (
    <form className="interest-form ct-fields" action={formAction} onSubmit={onSubmit} noValidate>
      <Hidden kind="enquiry" source={source} id={id} />
      <p className="ct-panel-intro">Corporate off-sites, camps and group bookings, partnerships and media. We&apos;ll reply by email.</p>
      <FormStatus state={state} />
      <label htmlFor={`${id}-type`}>Inquiry type*
        <select id={`${id}-type`} name="enquiryType" required defaultValue={enquiryType} {...fieldA11y(state, `${id}-type`, "enquiryType")}>
          <option value="" disabled>Select an inquiry type</option>
          {ENQUIRY_TYPES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <FieldError id={`${id}-type`} state={state} name="enquiryType" />
      </label>
      <ContactFields id={id} state={state} />
      <label htmlFor={`${id}-org`}>Organization
        <input id={`${id}-org`} name="organisation" autoComplete="organization" maxLength={120} />
      </label>
      <label htmlFor={`${id}-message`}>Message*
        <textarea id={`${id}-message`} name="message" rows={5} required maxLength={1800} placeholder="Tell us about your group, dates and what you have in mind." {...fieldA11y(state, `${id}-message`, "message")} />
        <FieldError id={`${id}-message`} state={state} name="message" />
      </label>
      <Consent id={id} state={state} label="I'm 18+ and agree to be contacted by BaseCamp CamSur about this inquiry." />
      <Submit pending={pending} label="Send inquiry" />
    </form>
  );
}
