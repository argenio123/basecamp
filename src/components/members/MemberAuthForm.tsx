"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useId, useState } from "react";
import { logIn, signUp } from "@/lib/members/actions";
import { INITIAL_AUTH_RESULT, loginHref, signupHref, type AuthResult } from "@/lib/members/types";

const RESET_EMAIL = "basecampcamsur@gmail.com";

/**
 * Outlined field with a floating label (Gmail-style): the label sits inside the box and moves up when the field
 * is focused or filled. Password fields get a Show / Hide toggle.
 */
function Field({ id, label, error, type = "text", ...input }: { id: string; label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div className={`mb-auth-field${error ? " has-error" : ""}`}>
      <input id={id} type={isPassword && show ? "text" : type} placeholder=" " aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} {...input} />
      <label htmlFor={id}>{label}</label>
      {isPassword && (
        <button type="button" className="mb-auth-eye" onClick={() => setShow((s) => !s)} aria-pressed={show} aria-controls={id}>
          {show ? "Hide" : "Show"}
        </button>
      )}
      {error && <small id={`${id}-err`} className="mb-auth-error">{error}</small>}
    </div>
  );
}

/** Member log-in or sign-up form (Facebook / Gmail pattern); returns to ?next= (same-site paths only, checked on the server). */
export default function MemberAuthForm({ mode }: { mode: "login" | "signup" }) {
  const params = useSearchParams();
  const next = params.get("next") ?? "/";
  // React resets the form after each submit; keep what was typed (never passwords) so a failed attempt only
  // asks for the password again, like Facebook / Gmail.
  const [kept, setKept] = useState<Record<string, string>>({});
  const [state, action, pending] = useActionState<AuthResult & { n?: number }, FormData>(async (prev, fd) => {
    const keep: Record<string, string> = {};
    for (const k of ["email", "firstName", "lastName", "phone"]) keep[k] = String(fd.get(k) ?? "");
    setKept(keep);
    const result = await (mode === "login" ? logIn : signUp)(prev, fd);
    return { ...result, n: (prev.n ?? 0) + 1 };
  }, INITIAL_AUTH_RESULT);
  const id = useId();
  const err = (k: string) => state.fieldErrors?.[k];
  const login = mode === "login";

  return (
    <form key={state.n ?? 0} className="mb-auth-form" action={action} noValidate>
      <input type="hidden" name="next" value={next} />
      {state.status === "error" && state.message && <p className="mb-auth-status" role="alert">{state.message}</p>}
      {!login && (
        <div className="mb-auth-row">
          <Field id={`${id}-first`} label="First name" name="firstName" defaultValue={kept.firstName} autoComplete="given-name" required maxLength={80} error={err("firstName")} />
          <Field id={`${id}-last`} label="Last name" name="lastName" defaultValue={kept.lastName} autoComplete="family-name" maxLength={80} error={err("lastName")} />
        </div>
      )}
      <Field id={`${id}-email`} label="Email address" name="email" type="email" defaultValue={kept.email} autoComplete="email" required maxLength={254} error={err("email")} />
      {!login && <Field id={`${id}-phone`} label="Mobile number (optional)" name="phone" type="tel" defaultValue={kept.phone} autoComplete="tel" maxLength={40} error={err("phone")} />}
      <Field id={`${id}-password`} label={login ? "Password" : "New password (8+ characters)"} name="password" type="password" autoComplete={login ? "current-password" : "new-password"} required minLength={login ? undefined : 8} maxLength={200} error={err("password")} />
      {!login && <Field id={`${id}-confirm`} label="Confirm password" name="confirm" type="password" autoComplete="new-password" required maxLength={200} error={err("confirm")} />}
      {!login && (
        <label className="mb-auth-check" htmlFor={`${id}-terms`}>
          <input id={`${id}-terms`} name="terms" type="checkbox" aria-invalid={err("terms") ? true : undefined} />
          <span>I agree that BaseCamp CamSur stores my account details to handle my requests, bookings, and purchases.</span>
          {err("terms") && <small className="mb-auth-error">{err("terms")}</small>}
        </label>
      )}
      <button type="submit" className="mb-auth-submit" disabled={pending} aria-disabled={pending}>
        {pending ? "Please wait…" : login ? "Log in" : "Sign up"}
      </button>
      {login && (
        <a className="mb-auth-forgot" href={`mailto:${RESET_EMAIL}?subject=${encodeURIComponent("Reset my BaseCamp password")}`}>Forgot password?</a>
      )}
      <div className="mb-auth-divider" role="separator"><span>or</span></div>
      <Link className="mb-auth-alt" href={login ? signupHref(next) : loginHref(next)}>
        {login ? "Create new account" : "Log in to an existing account"}
      </Link>
    </form>
  );
}
