"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActionState, useEffect } from "react";
import { submitWithoutReset } from "@/components/forms/FormStatus";
import PrivacyNote from "@/components/ui/PrivacyNote";
import { trackLead } from "@/lib/analytics";
import { submitLead } from "@/lib/leads/actions";
import { INITIAL_LEAD_RESULT } from "@/lib/leads/types";

/** Footer newsletter sign-up (kind=newsletter). Keeps the existing .footer-newsletter classes. */
export default function FooterSignup() {
  const pathname = usePathname();
  const [state, formAction, pending] = useActionState(submitLead, INITIAL_LEAD_RESULT);
  const emailError = state.fieldErrors?.email;
  const consentError = state.fieldErrors?.consent;

  useEffect(() => {
    if (state.status === "success") trackLead("newsletter");
  }, [state]);

  if (pathname === "/") {
    return (
      <div className="footer-newsletter footer-newsletter-link">
        <p className="footer-label">Get early access</p>
        <p>Membership benefits and opening updates are available in the signup section above.</p>
        <Link href="#early-access" className="text-link light">Go to signup <span aria-hidden="true">↑</span></Link>
      </div>
    );
  }

  return (
    <form className="footer-newsletter" action={formAction} onSubmit={submitWithoutReset(formAction)} noValidate>
      <label className="footer-label" htmlFor="footer-email">Get early access</label>
      {state.status === "success" ? (
        <p className="ui-footer-signup-status" role="status">You&apos;re on the list.</p>
      ) : (
        <>
          <input type="hidden" name="kind" value="newsletter" />
          <input type="hidden" name="source" value={pathname} />
          <div className="ui-hp" aria-hidden="true">
            <label htmlFor="footer-website">Website</label>
            <input id="footer-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <div className="footer-newsletter-row">
            <input
              id="footer-email" name="email" type="email" placeholder="Email address" autoComplete="email" required maxLength={254}
              aria-invalid={emailError ? true : undefined} aria-describedby={emailError ? "footer-email-error" : undefined}
            />
            <button type="submit" disabled={pending}>{pending ? "Sending…" : "Join"}</button>
          </div>
          {emailError && <span className="ui-field-error" id="footer-email-error">{emailError}</span>}
          <label className="footer-consent">
            <input type="checkbox" name="consent" required aria-invalid={consentError ? true : undefined} aria-describedby={consentError ? "footer-consent-error" : undefined} />
            <span>I agree to receive BaseCamp CamSur founding-member news and opening updates.</span>
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
