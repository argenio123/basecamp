"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useId, useRef, useState, type FormEvent } from "react";
import FormStatus, { FieldError, fieldA11y } from "@/components/forms/FormStatus";
import PrivacyNote from "@/components/ui/PrivacyNote";
import { INTEREST_OPTIONS, TIER_OPTIONS } from "@/content/constants";
import type { InterestValue } from "@/content/types";
import { trackLead } from "@/lib/analytics";
import { submitLead } from "@/lib/leads/actions";
import { INITIAL_LEAD_RESULT, type LeadKind, type LeadResult } from "@/lib/leads/types";
import { useLocale, useUi } from "@/i18n/client";
import { localizedHref } from "@/i18n/paths";
import { fmt, UI, type InquiryIntent } from "@/i18n/ui";

export type ProgrammeOption = { slug: string; title: string; interest: InterestValue };
type Props = { programmes: ProgrammeOption[]; program?: string; interests?: string[]; enquiry?: string };
type IntentConfig = { kind: LeadKind; nextHref: string };

// Text per intent (label, description, success copy…) is in src/i18n/ui.ts inquiry.intents. The message sent to
// staff is composed in English (EN_UI) whatever the page language.
const INTENTS: Record<InquiryIntent, IntentConfig> = {
  membership: { kind: "early-access", nextHref: "/membership" },
  "camp-group": { kind: "enquiry", nextHref: "/visit/camps" },
  corporate: { kind: "enquiry", nextHref: "/membership/price-guide#corporate" },
  partnership: { kind: "enquiry", nextHref: "/about" },
  media: { kind: "enquiry", nextHref: "/about/the-build" },
};
const EN_UI = UI.en.inquiry;

const INTENT_ORDER = Object.keys(INTENTS) as InquiryIntent[];
const INTEREST_VALUES = INTEREST_OPTIONS.map((option) => option.value as string);

function inferredIntent(programme: ProgrammeOption | undefined, interests: string[], enquiry?: string): InquiryIntent | null {
  if (enquiry && enquiry in INTENTS) return enquiry as InquiryIntent;
  if (programme) return "membership";
  if (interests.some((value) => ["training-camp", "coach-group", "extended-stay"].includes(value))) return "camp-group";
  if (interests.includes("corporate")) return "corporate";
  if (interests.length > 0) return "membership";
  return null;
}

export default function InterestForm({ programmes, program, interests = [], enquiry }: Props) {
  const selectedProgramme = programmes.find((item) => item.slug === program);
  const preselected = [...new Set([...(selectedProgramme ? [selectedProgramme.interest] : []), ...interests.filter((value) => INTEREST_VALUES.includes(value))])];
  const [intent, setIntent] = useState<InquiryIntent | null>(() => inferredIntent(selectedProgramme, preselected, enquiry));

  const query = new URLSearchParams();
  if (selectedProgramme) query.set("program", selectedProgramme.slug);
  if (preselected.length && !selectedProgramme) query.set("interest", preselected.join(","));
  if (intent) query.set("enquiry", intent);
  const source = `/contact${query.size ? `?${query.toString()}` : ""}`;

  if (!intent) return <PurposeStep onSelect={setIntent} />;

  return (
    <InquiryDetails
      key={intent}
      intent={intent}
      source={source}
      preselected={preselected}
      programmeTitle={selectedProgramme?.title}
      onBack={() => setIntent(null)}
    />
  );
}

function Progress({ step }: { step: 1 | 2 | 3 }) {
  const ui = useUi().inquiry;
  return (
    <ol className="ct-progress" aria-label={fmt(ui.progress, { step })}>
      {ui.steps.map((label, index) => {
        const number = (index + 1) as 1 | 2 | 3;
        return <li key={label} data-state={number < step ? "complete" : number === step ? "current" : "upcoming"} aria-current={number === step ? "step" : undefined}><span>{number < step ? "✓" : `0${number}`}</span>{label}</li>;
      })}
    </ol>
  );
}

function PurposeStep({ onSelect }: { onSelect: (intent: InquiryIntent) => void }) {
  const ui = useUi().inquiry;
  return (
    <div className="ct-journey">
      <Progress step={1} />
      <div className="ct-purpose-head">
        <p className="eyebrow">{ui.chooseEyebrow}</p>
        <h2>{ui.chooseTitle}</h2>
        <p>{ui.chooseBody}</p>
      </div>
      <div className="ct-purpose-grid">
        {INTENT_ORDER.map((intent, index) => {
          const item = ui.intents[intent];
          return (
            <button key={intent} type="button" onClick={() => onSelect(intent)}>
              <span>0{index + 1}</span>
              <small>{item.short}</small>
              <strong>{item.label}</strong>
              <p>{item.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function useLeadForm(kind: LeadKind) {
  const [state, formAction, pending] = useActionState(submitLead, INITIAL_LEAD_RESULT);
  useEffect(() => {
    if (state.status === "success") trackLead(kind);
  }, [state, kind]);
  return { state, formAction, pending };
}

/** Hidden fields; `locale` picks the language of the Server Action messages (src/lib/leads/validate.ts). */
function Hidden({ kind, source, id }: { kind: LeadKind; source: string; id: string }) {
  const locale = useLocale();
  return <>
    <input type="hidden" name="kind" value={kind} />
    <input type="hidden" name="locale" value={locale} />
    <input type="hidden" name="source" value={source} />
    <div className="ui-hp" aria-hidden="true">
      <label htmlFor={`${id}-hp-website`}>Website</label>
      <input id={`${id}-hp-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  </>;
}

function ContactFields({ id, state }: { id: string; state: LeadResult }) {
  const ui = useUi();
  return <>
    <div className="field-row">
      <label htmlFor={`${id}-first`}>{ui.inquiry.firstName}*
        <input id={`${id}-first`} name="firstName" autoComplete="given-name" required maxLength={80} {...fieldA11y(state, `${id}-first`, "firstName")} />
        <FieldError id={`${id}-first`} state={state} name="firstName" />
      </label>
      <label htmlFor={`${id}-last`}>{ui.inquiry.surname}
        <input id={`${id}-last`} name="lastName" autoComplete="family-name" maxLength={80} {...fieldA11y(state, `${id}-last`, "lastName")} />
        <FieldError id={`${id}-last`} state={state} name="lastName" />
      </label>
    </div>
    <div className="field-row">
      <label htmlFor={`${id}-email`}>{ui.form.email}*
        <input id={`${id}-email`} name="email" type="email" autoComplete="email" required maxLength={254} {...fieldA11y(state, `${id}-email`, "email")} />
        <FieldError id={`${id}-email`} state={state} name="email" />
      </label>
      <label htmlFor={`${id}-phone`}>{ui.inquiry.phoneWhatsapp}
        <input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" maxLength={30} {...fieldA11y(state, `${id}-phone`, "phone")} />
        <FieldError id={`${id}-phone`} state={state} name="phone" />
      </label>
    </div>
  </>;
}

function Consent({ id, state }: { id: string; state: LeadResult }) {
  const ui = useUi();
  return <>
    <label className="check-field ct-check" htmlFor={`${id}-consent`}>
      <input id={`${id}-consent`} name="consent" type="checkbox" required {...fieldA11y(state, `${id}-consent`, "consent")} />
      <span>{ui.inquiry.consent}</span>
    </label>
    <FieldError id={`${id}-consent`} state={state} name="consent" />
    <PrivacyNote />
  </>;
}

function IntentFields({ intent, id }: { intent: InquiryIntent; id: string }) {
  const { inquiry: ui } = useUi();
  const f = ui.fields;
  // English option values are sent to staff; the visible text follows the page language.
  const opts = (values: string[]) => <><option value="">{ui.chooseOne}</option>{values.map((v) => <option key={v} value={v}>{ui.options[v] ?? v}</option>)}</>;
  if (intent === "membership") return <>
    <div className="field-row">
      <label htmlFor={`${id}-tier`}>{f.tier}
        <select id={`${id}-tier`} name="tier" defaultValue=""><option value="">{ui.notSure}</option>{TIER_OPTIONS.filter((option) => option.value !== "unsure").map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
      </label>
      <label htmlFor={`${id}-frequency`}>{f.frequency}
        <select id={`${id}-frequency`} name="detailFrequency" defaultValue="">{opts(["1–2 times a week", "3–4 times a week", "5+ times a week", "Visiting / occasional"])}</select>
      </label>
    </div>
    <label htmlFor={`${id}-goal`}>{f.goal}
      <input id={`${id}-goal`} name="detailGoal" maxLength={160} placeholder={f.goalPlaceholder} />
    </label>
  </>;

  if (intent === "camp-group") return <>
    <div className="field-row">
      <label htmlFor={`${id}-dates`}>{f.dates}
        <input id={`${id}-dates`} name="detailDates" maxLength={120} placeholder={f.datesPlaceholder} />
      </label>
      <label htmlFor={`${id}-group`}>{f.groupSize}
        <input id={`${id}-group`} name="detailGroupSize" type="number" min={1} max={100} inputMode="numeric" />
      </label>
    </div>
    <div className="field-row">
      <label htmlFor={`${id}-origin`}>{f.origin}
        <input id={`${id}-origin`} name="detailOrigin" maxLength={100} placeholder={f.originPlaceholder} />
      </label>
      <label htmlFor={`${id}-focus`}>{f.focus}
        <select id={`${id}-focus`} name="detailFocus" defaultValue="">{opts(["Performance training", "Competition preparation", "Recovery and wellness", "Mixed group experience"])}</select>
      </label>
    </div>
  </>;

  if (intent === "corporate") return <>
    <div className="field-row">
      <label htmlFor={`${id}-org`}>{f.organisation}
        <input id={`${id}-org`} name="detailOrganisation" autoComplete="organization" maxLength={120} />
      </label>
      <label htmlFor={`${id}-group`}>{f.teamSize}
        <input id={`${id}-group`} name="detailGroupSize" type="number" min={2} max={200} inputMode="numeric" />
      </label>
    </div>
    <div className="field-row">
      <label htmlFor={`${id}-date`}>{f.targetDate}
        <input id={`${id}-date`} name="detailDate" type="date" />
      </label>
      <label htmlFor={`${id}-objective`}>{f.objective}
        <select id={`${id}-objective`} name="detailObjective" defaultValue="">{opts(["Team building", "Wellness program", "Leadership off-site", "Private event"])}</select>
      </label>
    </div>
  </>;

  if (intent === "partnership") return <>
    <label htmlFor={`${id}-org`}>{f.brand}
      <input id={`${id}-org`} name="detailOrganisation" autoComplete="organization" maxLength={120} />
    </label>
    <div className="field-row">
      <label htmlFor={`${id}-type`}>{f.partnershipType}
        <select id={`${id}-type`} name="detailPartnership" defaultValue="">{opts(["Brand collaboration", "Wellness provider", "Coach / ambassador", "Community event"])}</select>
      </label>
      <label htmlFor={`${id}-website`}>{f.website}
        <input id={`${id}-website`} name="detailWebsite" type="url" maxLength={240} placeholder="https://" />
      </label>
    </div>
  </>;

  return <>
    <label htmlFor={`${id}-publication`}>{f.publication}
      <input id={`${id}-publication`} name="detailPublication" autoComplete="organization" maxLength={120} />
    </label>
    <div className="field-row">
      <label htmlFor={`${id}-request`}>{f.requestType}
        <select id={`${id}-request`} name="detailRequest" defaultValue="">{opts(["Interview", "Press information", "Photography / filming", "Fact check"])}</select>
      </label>
      <label htmlFor={`${id}-deadline`}>{f.deadline}
        <input id={`${id}-deadline`} name="detailDeadline" type="date" />
      </label>
    </div>
  </>;
}

const DETAIL_LABELS: Record<string, string> = {
  detailFrequency: "Training frequency", detailGoal: "Training goal", detailDates: "Preferred dates", detailGroupSize: "Group size",
  detailOrigin: "Traveling from", detailFocus: "Camp focus", detailOrganisation: "Organization", detailDate: "Target date",
  detailObjective: "Objective", detailPartnership: "Partnership type", detailWebsite: "Website / profile",
  detailPublication: "Publication / channel", detailRequest: "Media request", detailDeadline: "Deadline",
};

function InquiryDetails({ intent, source, preselected, programmeTitle, onBack }: { intent: InquiryIntent; source: string; preselected: string[]; programmeTitle?: string; onBack: () => void }) {
  const config = INTENTS[intent];
  const locale = useLocale();
  const ui = useUi();
  const text = ui.inquiry.intents[intent];
  const { state, formAction, pending } = useLeadForm(config.kind);
  const id = useId();
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (state.status === "success") heading.current?.focus();
  }, [state.status]);

  if (state.status === "success") return (
    <div className="ct-journey ct-success" role="status">
      <Progress step={3} />
      <div className="ct-success-mark" aria-hidden="true">✓</div>
      <p className="eyebrow">{ui.inquiry.received}</p>
      <h2 ref={heading} tabIndex={-1}>{text.successTitle}</h2>
      <p>{text.successBody}</p>
      <p className="ct-success-time">{ui.inquiry.expected}</p>
      <div className="button-row">
        <Link href={localizedHref(config.nextHref, locale)} className="button button-dark">{text.nextLabel}</Link>
        <button type="button" className="text-link" onClick={onBack}>{ui.inquiry.another}</button>
      </div>
    </div>
  );

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const lines = [`Inquiry: ${EN_UI.intents[intent].label}`];
    if (programmeTitle) lines.push(`Program: ${programmeTitle}`);
    for (const [name, label] of Object.entries(DETAIL_LABELS)) {
      const value = String(formData.get(name) ?? "").trim();
      if (value) lines.push(`${label}: ${value}`);
      formData.delete(name);
    }
    const message = String(formData.get("message") ?? "").trim();
    if (message) lines.push("", message);
    formData.set("message", lines.join("\n").slice(0, 2000));
    if (config.kind === "enquiry") formData.set("enquiryType", intent);
    if (config.kind === "early-access") {
      formData.delete("interests");
      for (const interest of [...new Set(["membership-local", ...preselected])]) formData.append("interests", interest);
    }
    startTransition(() => formAction(formData));
  }

  return (
    <div className="ct-journey">
      <Progress step={2} />
      <button type="button" className="ct-change-purpose" onClick={onBack}>{ui.inquiry.change}</button>
      <div className="ct-details-head">
        <p className="eyebrow">{text.short}</p>
        <h2>{text.label}</h2>
        <p>{text.description} {ui.inquiry.replyAim}</p>
      </div>
      <form className="interest-form ct-fields" action={formAction} onSubmit={onSubmit} noValidate>
        <Hidden kind={config.kind} source={source} id={id} />
        <FormStatus state={state} />
        <ContactFields id={id} state={state} />
        <IntentFields intent={intent} id={id} />
        <label htmlFor={`${id}-message`}>{ui.inquiry.anythingElse}
          <textarea id={`${id}-message`} name="message" rows={4} maxLength={1200} placeholder={ui.inquiry.messagePlaceholder} {...fieldA11y(state, `${id}-message`, "message")} />
          <FieldError id={`${id}-message`} state={state} name="message" />
        </label>
        <Consent id={id} state={state} />
        <button className="button button-dark ct-submit" type="submit" disabled={pending} aria-disabled={pending}>{pending ? ui.form.sending : <>{text.submitLabel}</>}</button>
      </form>
    </div>
  );
}
