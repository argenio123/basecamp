"use client";

import { usePathname } from "next/navigation";
import { useActionState, useEffect, useState, type FormEvent } from "react";
import { submitWithoutReset } from "@/components/forms/FormStatus";
import PrivacyNote from "@/components/ui/PrivacyNote";
import { useLocale, useUi } from "@/i18n/client";
import { trackLead } from "@/lib/analytics";
import { submitLead } from "@/lib/leads/actions";
import { INITIAL_LEAD_RESULT } from "@/lib/leads/types";

/** Footer newsletter sign-up (kind=newsletter). Keeps the existing .footer-newsletter classes. */
export default function FooterSignup() {
  const pathname = usePathname();
  const locale = useLocale();
  const ui = useUi();
  const [state, formAction, pending] = useActionState(submitLead, INITIAL_LEAD_RESULT);
  // The 18+ / consent box is checked in the browser first; submitLead checks it again on the server.
  const [ageError, setAgeError] = useState("");
  const emailError = state.fieldErrors?.email;
  const consentError = ageError || state.fieldErrors?.consent;
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (new FormData(event.currentTarget).get("consent") !== "on") {
      event.preventDefault();
      setAgeError(ui.signup.consentRequired);
      return;
    }
    setAgeError("");
    submitWithoutReset(formAction)(event);
  };

  useEffect(() => {
    if (state.status === "success") trackLead("newsletter");
  }, [state]);

  // Hidden on the member log-in / sign-up pages: the account form is already on the page.
  if (pathname.startsWith("/account/")) return null;

  return (
    <form className="footer-newsletter" action={formAction} onSubmit={onSubmit} noValidate>
      <label className="footer-label" htmlFor="footer-email">{ui.signup.label}</label>
      {state.status === "success" ? (
        <p className="ui-footer-signup-status" role="status">{ui.signup.success}</p>
      ) : (
        <>
          <input type="hidden" name="kind" value="newsletter" />
          {/* Server Action messages in this language (src/lib/leads/validate.ts leadLocale). */}
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="source" value={pathname} />
          <div className="ui-hp" aria-hidden="true">
            <label htmlFor="footer-website">Website</label>
            <input id="footer-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <div className="footer-newsletter-row">
            <input
              id="footer-email" name="email" type="email" placeholder={ui.signup.emailPlaceholder} autoComplete="email" required maxLength={254}
              aria-invalid={emailError ? true : undefined} aria-describedby={emailError ? "footer-email-error" : undefined}
            />
            <button type="submit" disabled={pending}>{pending ? ui.common.sending : ui.signup.submit}</button>
          </div>
          {emailError && <span className="ui-field-error" id="footer-email-error">{emailError}</span>}
          <label className="footer-consent">
            <input type="checkbox" name="consent" required aria-invalid={consentError ? true : undefined} aria-describedby={consentError ? "footer-consent-error" : undefined} />
            <span>{ui.signup.consent}</span>
          </label>
          {consentError && <span className="ui-field-error" id="footer-consent-error">{consentError}</span>}
          {state.status === "error" && !state.fieldErrors?.email && !consentError && (
            <p className="ui-form-status" data-state="error" role="alert">{state.message}</p>
          )}
          <PrivacyNote compact />
        </>
      )}
    </form>
  );
}
