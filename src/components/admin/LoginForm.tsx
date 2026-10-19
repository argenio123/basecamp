"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";
import { INITIAL_LOGIN_STATE } from "./state";

// Staff sign-in (spec §D.7). On success the action sets the session cookies and redirects to /admin.
export default function LoginForm({ configured }: { configured: boolean }) {
  const [state, formAction, pending] = useActionState(loginAction, INITIAL_LOGIN_STATE);

  return (
    <div className="adm-login">
      <div className="adm-login-card">
        <Image src="/images/brand/basecamp-logo.png" alt="BaseCamp CamSur" width={814} height={866} className="adm-login-logo" preload />
        <h1>Sign in</h1>
        {configured ? (
          <form action={formAction} className="adm-login-form">
            <label htmlFor="adm-password">Password</label>
            <input
              id="adm-password" name="password" type="password" autoComplete="current-password" required maxLength={512}
              aria-invalid={state.error ? true : undefined} aria-describedby={state.error ? "adm-login-error" : undefined}
            />
            {state.error && <p id="adm-login-error" className="adm-alert" role="alert">{state.error}</p>}
            <button type="submit" className="button button-dark" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
          </form>
        ) : (
          // Setup steps (ADMIN_PASSWORD, ADMIN_SESSION_SECRET) are documented in .env.example, not shown here.
          <div className="adm-alert" role="alert">
            <p><strong>Sign-in isn&apos;t set up yet.</strong></p>
            <p>A staff password hasn&apos;t been created for this website, so no one can sign in. Please ask the person who manages the website to finish the setup.</p>
          </div>
        )}
        <Link href="/" className="adm-back-link">← Back to site</Link>
      </div>
    </div>
  );
}
