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

export type ProgrammeOption = { slug: string; title: string; interest: InterestValue };
type Props = { programmes: ProgrammeOption[]; program?: string; interests?: string[]; enquiry?: string };
type InquiryIntent = "membership" | "camp-group" | "corporate" | "partnership" | "media";

type IntentConfig = {
  label: string;
  short: string;
  description: string;
  kind: LeadKind;
  submitLabel: string;
  successTitle: string;
  successBody: string;
  nextHref: string;
  nextLabel: string;
};

const INTENTS: Record<InquiryIntent, IntentConfig> = {
  membership: {
    label: "Membership",
    short: "Train with us",
    description: "Memberships, passes, classes and recovery access.",
    kind: "early-access",
    submitLabel: "Request membership guidance",
    successTitle: "Your membership request is in.",
    successBody: "We’ll recommend the best starting option and send early-access details by email.",
    nextHref: "/membership",
    nextLabel: "Compare membership options",
  },
  "camp-group": {
    label: "Camps & groups",
    short: "Bring your crew",
    description: "Training camps, retreats, coach-led groups and longer stays.",
    kind: "enquiry",
    submitLabel: "Send camp inquiry",
    successTitle: "Your camp brief is with us.",
    successBody: "We’ll review your dates and group needs before replying with the most relevant format.",
    nextHref: "/visit/camps",
    nextLabel: "Explore camps and retreats",
  },
  corporate: {
    label: "Corporate",
    short: "Move as a team",
    description: "Off-sites, team sessions and company wellness programs.",
    kind: "enquiry",
    submitLabel: "Send corporate inquiry",
    successTitle: "Your team brief is in.",
    successBody: "We’ll review your group size, goals and timing before suggesting a format.",
    nextHref: "/membership/corporate",
    nextLabel: "See corporate options",
  },
  partnership: {
    label: "Partnerships",
    short: "Build with us",
    description: "Brand, wellness, ambassador and community collaborations.",
    kind: "enquiry",
    submitLabel: "Send partnership inquiry",
    successTitle: "The partnership team has your note.",
    successBody: "We’ll review the fit and contact you if there is a strong next step to explore together.",
    nextHref: "/about",
    nextLabel: "Learn more about BaseCamp",
  },
  media: {
    label: "Media",
    short: "Tell the story",
    description: "Interviews, press information, filming and editorial requests.",
    kind: "enquiry",
    submitLabel: "Send media request",
    successTitle: "Your media request is queued.",
    successBody: "We’ll check the deadline and connect you with the right person or materials.",
    nextHref: "/about/the-build",
    nextLabel: "View the build story",
  },
};

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
  return (
    <ol className="ct-progress" aria-label={`Contact form: step ${step} of 3`}>
      {["Purpose", "Details", "Sent"].map((label, index) => {
        const number = (index + 1) as 1 | 2 | 3;
        return <li key={label} data-state={number < step ? "complete" : number === step ? "current" : "upcoming"} aria-current={number === step ? "step" : undefined}><span>{number < step ? "✓" : `0${number}`}</span>{label}</li>;
      })}
    </ol>
  );
}

function PurposeStep({ onSelect }: { onSelect: (intent: InquiryIntent) => void }) {
  return (
    <div className="ct-journey">
      <Progress step={1} />
      <div className="ct-purpose-head">
        <p className="eyebrow">Choose your inquiry</p>
        <h2>What can we help with?</h2>
        <p>Select one so we only ask for relevant details.</p>
      </div>
      <div className="ct-purpose-grid">
        {INTENT_ORDER.map((intent, index) => {
          const item = INTENTS[intent];
          return (
            <button key={intent} type="button" onClick={() => onSelect(intent)}>
              <span>0{index + 1}</span>
              <small>{item.short}</small>
              <strong>{item.label}</strong>
              <p>{item.description}</p>
              <i aria-hidden="true">↗</i>
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

function Hidden({ kind, source, id }: { kind: LeadKind; source: string; id: string }) {
  return <>
    <input type="hidden" name="kind" value={kind} />
    <input type="hidden" name="source" value={source} />
    <div className="ui-hp" aria-hidden="true">
      <label htmlFor={`${id}-hp-website`}>Website</label>
      <input id={`${id}-hp-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
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
      <label htmlFor={`${id}-phone`}>Phone / WhatsApp
        <input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" maxLength={30} {...fieldA11y(state, `${id}-phone`, "phone")} />
        <FieldError id={`${id}-phone`} state={state} name="phone" />
      </label>
    </div>
  </>;
}

function Consent({ id, state }: { id: string; state: LeadResult }) {
  return <>
    <label className="check-field ct-check" htmlFor={`${id}-consent`}>
      <input id={`${id}-consent`} name="consent" type="checkbox" required {...fieldA11y(state, `${id}-consent`, "consent")} />
      <span>I&apos;m 18+ and agree to be contacted by BaseCamp CamSur about this request.</span>
    </label>
    <FieldError id={`${id}-consent`} state={state} name="consent" />
    <PrivacyNote />
  </>;
}

function IntentFields({ intent, id }: { intent: InquiryIntent; id: string }) {
  if (intent === "membership") return <>
    <div className="field-row">
      <label htmlFor={`${id}-tier`}>Membership option
        <select id={`${id}-tier`} name="tier" defaultValue=""><option value="">Not sure yet</option>{TIER_OPTIONS.filter((option) => option.value !== "unsure").map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
      </label>
      <label htmlFor={`${id}-frequency`}>Training frequency
        <select id={`${id}-frequency`} name="detailFrequency" defaultValue=""><option value="">Choose one</option><option>1–2 times a week</option><option>3–4 times a week</option><option>5+ times a week</option><option>Visiting / occasional</option></select>
      </label>
    </div>
    <label htmlFor={`${id}-goal`}>Main training goal
      <input id={`${id}-goal`} name="detailGoal" maxLength={160} placeholder="Strength, conditioning, race preparation…" />
    </label>
  </>;

  if (intent === "camp-group") return <>
    <div className="field-row">
      <label htmlFor={`${id}-dates`}>Preferred dates
        <input id={`${id}-dates`} name="detailDates" maxLength={120} placeholder="Month, date range or flexible" />
      </label>
      <label htmlFor={`${id}-group`}>Estimated group size
        <input id={`${id}-group`} name="detailGroupSize" type="number" min={1} max={100} inputMode="numeric" />
      </label>
    </div>
    <div className="field-row">
      <label htmlFor={`${id}-origin`}>Travelling from
        <input id={`${id}-origin`} name="detailOrigin" maxLength={100} placeholder="City / country" />
      </label>
      <label htmlFor={`${id}-focus`}>Camp focus
        <select id={`${id}-focus`} name="detailFocus" defaultValue=""><option value="">Choose one</option><option>Performance training</option><option>Competition preparation</option><option>Recovery and wellness</option><option>Mixed group experience</option></select>
      </label>
    </div>
  </>;

  if (intent === "corporate") return <>
    <div className="field-row">
      <label htmlFor={`${id}-org`}>Company / organization
        <input id={`${id}-org`} name="detailOrganisation" autoComplete="organization" maxLength={120} />
      </label>
      <label htmlFor={`${id}-group`}>Estimated team size
        <input id={`${id}-group`} name="detailGroupSize" type="number" min={2} max={200} inputMode="numeric" />
      </label>
    </div>
    <div className="field-row">
      <label htmlFor={`${id}-date`}>Target date
        <input id={`${id}-date`} name="detailDate" type="date" />
      </label>
      <label htmlFor={`${id}-objective`}>Main objective
        <select id={`${id}-objective`} name="detailObjective" defaultValue=""><option value="">Choose one</option><option>Team building</option><option>Wellness program</option><option>Leadership off-site</option><option>Private event</option></select>
      </label>
    </div>
  </>;

  if (intent === "partnership") return <>
    <label htmlFor={`${id}-org`}>Brand / organization
      <input id={`${id}-org`} name="detailOrganisation" autoComplete="organization" maxLength={120} />
    </label>
    <div className="field-row">
      <label htmlFor={`${id}-type`}>Partnership type
        <select id={`${id}-type`} name="detailPartnership" defaultValue=""><option value="">Choose one</option><option>Brand collaboration</option><option>Wellness provider</option><option>Coach / ambassador</option><option>Community event</option></select>
      </label>
      <label htmlFor={`${id}-website`}>Website or profile
        <input id={`${id}-website`} name="detailWebsite" type="url" maxLength={240} placeholder="https://" />
      </label>
    </div>
  </>;

  return <>
    <label htmlFor={`${id}-publication`}>Publication / channel
      <input id={`${id}-publication`} name="detailPublication" autoComplete="organization" maxLength={120} />
    </label>
    <div className="field-row">
      <label htmlFor={`${id}-request`}>Request type
        <select id={`${id}-request`} name="detailRequest" defaultValue=""><option value="">Choose one</option><option>Interview</option><option>Press information</option><option>Photography / filming</option><option>Fact check</option></select>
      </label>
      <label htmlFor={`${id}-deadline`}>Deadline
        <input id={`${id}-deadline`} name="detailDeadline" type="date" />
      </label>
    </div>
  </>;
}

const DETAIL_LABELS: Record<string, string> = {
  detailFrequency: "Training frequency", detailGoal: "Training goal", detailDates: "Preferred dates", detailGroupSize: "Group size",
  detailOrigin: "Travelling from", detailFocus: "Camp focus", detailOrganisation: "Organization", detailDate: "Target date",
  detailObjective: "Objective", detailPartnership: "Partnership type", detailWebsite: "Website / profile",
  detailPublication: "Publication / channel", detailRequest: "Media request", detailDeadline: "Deadline",
};

function InquiryDetails({ intent, source, preselected, programmeTitle, onBack }: { intent: InquiryIntent; source: string; preselected: string[]; programmeTitle?: string; onBack: () => void }) {
  const config = INTENTS[intent];
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
      <p className="eyebrow">Request received</p>
      <h2 ref={heading} tabIndex={-1}>{config.successTitle}</h2>
      <p>{config.successBody}</p>
      <p className="ct-success-time">Expected response: within one business day.</p>
      <div className="button-row">
        <Link href={config.nextHref} className="button button-dark">{config.nextLabel} <span aria-hidden="true">↗</span></Link>
        <button type="button" className="text-link" onClick={onBack}>Start another inquiry</button>
      </div>
    </div>
  );

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const lines = [`Inquiry: ${config.label}`];
    if (programmeTitle) lines.push(`Programme: ${programmeTitle}`);
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
      <button type="button" className="ct-change-purpose" onClick={onBack}>← Change inquiry type</button>
      <div className="ct-details-head">
        <p className="eyebrow">{config.short}</p>
        <h2>{config.label}</h2>
        <p>{config.description} We aim to reply within one business day.</p>
      </div>
      <form className="interest-form ct-fields" action={formAction} onSubmit={onSubmit} noValidate>
        <Hidden kind={config.kind} source={source} id={id} />
        <FormStatus state={state} />
        <ContactFields id={id} state={state} />
        <IntentFields intent={intent} id={id} />
        <label htmlFor={`${id}-message`}>Anything else?
          <textarea id={`${id}-message`} name="message" rows={4} maxLength={1200} placeholder="Share any priorities, questions or useful context." {...fieldA11y(state, `${id}-message`, "message")} />
          <FieldError id={`${id}-message`} state={state} name="message" />
        </label>
        <Consent id={id} state={state} />
        <button className="button button-dark ct-submit" type="submit" disabled={pending} aria-disabled={pending}>{pending ? "Sending…" : <>{config.submitLabel} <span aria-hidden="true">↗</span></>}</button>
      </form>
    </div>
  );
}
