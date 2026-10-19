"use client";

import { useActionState, useEffect, useId, useState } from "react";
import FormStatus, { FieldError, fieldA11y, submitWithoutReset } from "@/components/forms/FormStatus";
import PrivacyNote from "@/components/ui/PrivacyNote";
import { PERSONA_OPTIONS } from "@/content/constants";
import { trackLead } from "@/lib/analytics";
import { submitLead } from "@/lib/leads/actions";
import { INITIAL_LEAD_RESULT } from "@/lib/leads/types";

type Props = { source: string; submitLabel?: string };

/** Founding-list sign-up (kind=early-access). Docs: 02-guides/forms.md (useActionState). */
export default function EarlyAccessForm(props: Props) {
  const [formKey, setFormKey] = useState(0);
  return <EarlyAccessFormInner key={formKey} {...props} onReset={() => setFormKey((k) => k + 1)} />;
}

function EarlyAccessFormInner({ source, submitLabel = "Join the founding list", onReset }: Props & { onReset: () => void }) {
  const [state, formAction, pending] = useActionState(submitLead, INITIAL_LEAD_RESULT);
  const id = useId();

  useEffect(() => {
    if (state.status === "success") trackLead("early-access");
  }, [state]);

  if (state.status === "success") {
    return (
      <div className="form-success ui-early-form-success" role="status">
        <span aria-hidden="true">✓</span>
        <h2>You&apos;re on the list.</h2>
        <p>{state.message}</p>
        <button type="button" className="text-link" onClick={onReset}>Submit another response</button>
      </div>
    );
  }

  return (
    <form className="interest-form ui-early-form" action={formAction} onSubmit={submitWithoutReset(formAction)} noValidate>
      <input type="hidden" name="kind" value="early-access" />
      <input type="hidden" name="source" value={source} />
      <div className="ui-hp" aria-hidden="true">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <FormStatus state={state} />
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
      <fieldset className="ui-early-form-personas">
        <legend>I am a…</legend>
        {PERSONA_OPTIONS.map((option) => (
          <label className="check-field" key={option.value}>
            <input type="radio" name="persona" value={option.value} />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>
      <label className="check-field" htmlFor={`${id}-consent`}>
        <input id={`${id}-consent`} name="consent" type="checkbox" required {...fieldA11y(state, `${id}-consent`, "consent")} />
        <span>I&apos;m 18+ and agree to receive BaseCamp CamSur founding-member news and opening updates.</span>
      </label>
      <FieldError id={`${id}-consent`} state={state} name="consent" />
      <PrivacyNote />
      <button className="button button-dark" type="submit" disabled={pending}>
        {pending ? "Sending…" : <>{submitLabel} <span aria-hidden="true">↗</span></>}
      </button>
    </form>
  );
}
