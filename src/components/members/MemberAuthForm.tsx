"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useId } from "react";
import { logIn, signUp } from "@/lib/members/actions";
import { INITIAL_AUTH_RESULT, loginHref, signupHref, type AuthResult } from "@/lib/members/types";

function Field({ id, label, error, ...input }: { id: string; label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="mb-auth-field" htmlFor={id}>
      <span>{label}</span>
      <input id={id} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} {...input} />
      {error && <small id={`${id}-err`} className="mb-auth-error">{error}</small>}
    </label>
  );
}

/** Member log-in or sign-up form; returns to ?next= (same-site paths only, checked on the server). */
export default function MemberAuthForm({ mode }: { mode: "login" | "signup" }) {
  const params = useSearchParams();
  const next = params.get("next") ?? "/";
  const [state, action, pending] = useActionState<AuthResult, FormData>(mode === "login" ? logIn : signUp, INITIAL_AUTH_RESULT);
  const id = useId();
  const err = (k: string) => state.fieldErrors?.[k];

  return (
    <form className="mb-auth-form" action={action} noValidate>
      <input type="hidden" name="next" value={next} />
      {state.status === "error" && state.message && <p className="mb-auth-status" role="alert">{state.message}</p>}
      {mode === "signup" && (
        <div className="mb-auth-row">
          <Field id={`${id}-first`} label="First name*" name="firstName" autoComplete="given-name" required maxLength={80} error={err("firstName")} />
          <Field id={`${id}-last`} label="Surname" name="lastName" autoComplete="family-name" maxLength={80} error={err("lastName")} />
        </div>
      )}
      <Field id={`${id}-email`} label="Email*" name="email" type="email" autoComplete="email" required maxLength={254} error={err("email")} />
      {mode === "signup" && <Field id={`${id}-phone`} label="Phone" name="phone" type="tel" autoComplete="tel" maxLength={40} error={err("phone")} />}
      <Field id={`${id}-password`} label={mode === "signup" ? "Password* (8+ characters)" : "Password*"} name="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} required minLength={mode === "signup" ? 8 : undefined} maxLength={200} error={err("password")} />
      {mode === "signup" && <Field id={`${id}-confirm`} label="Confirm password*" name="confirm" type="password" autoComplete="new-password" required maxLength={200} error={err("confirm")} />}
      {mode === "signup" && (
        <label className="mb-auth-check" htmlFor={`${id}-terms`}>
          <input id={`${id}-terms`} name="terms" type="checkbox" aria-invalid={err("terms") ? true : undefined} />
          <span>I agree that BaseCamp CamSur stores my account details to handle my requests, bookings and purchases.</span>
          {err("terms") && <small className="mb-auth-error">{err("terms")}</small>}
        </label>
      )}
      <button type="submit" className="mb-auth-submit" disabled={pending} aria-disabled={pending}>
        {pending ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
      </button>
      <p className="mb-auth-switch">
        {mode === "login"
          ? <>New to BaseCamp? <Link href={signupHref(next)}>Create an account</Link></>
          : <>Already a member? <Link href={loginHref(next)}>Log in</Link></>}
      </p>
    </form>
  );
}
