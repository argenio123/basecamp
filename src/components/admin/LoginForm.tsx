"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";
import { INITIAL_LOGIN_STATE } from "./state";

// Staff sign-in (spec §D.7). On success the action sets the session cookies and redirects to /admin.
// personal: each staff member signs in with their own email + password (ADMIN_USERS); otherwise only the legacy
// shared ADMIN_PASSWORD is asked for, as before.
export default function LoginForm({ configured, personal = false }: { configured: boolean; personal?: boolean }) {
  const [state, formAction, pending] = useActionState(loginAction, INITIAL_LOGIN_STATE);
  const errorProps = { "aria-invalid": state.error ? true : undefined, "aria-describedby": state.error ? "adm-login-error" : undefined };

  return (
    <div className="adm-login">
      <div className="adm-login-card">
        <Image src="/images/brand/basecamp-camsur-logo-black.png" alt="BaseCamp CamSur" width={1118} height={982} className="adm-login-logo" preload />
        <h1>Sign in</h1>
        {configured ? (
          <form action={formAction} className="adm-login-form">
            {personal && (
              <>
                <label htmlFor="adm-email">Email</label>
                <input id="adm-email" name="email" type="email" autoComplete="username" required maxLength={254} defaultValue={state.email} {...errorProps} />
              </>
            )}
            <label htmlFor="adm-password">Password</label>
            <input id="adm-password" name="password" type="password" autoComplete="current-password" required maxLength={512} {...errorProps} />
            {state.error && <p id="adm-login-error" className="adm-alert" role="alert">{state.error}</p>}
            <button type="submit" className="button button-dark" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
          </form>
        ) : (
          // Setup steps (ADMIN_USERS or ADMIN_PASSWORD, ADMIN_SESSION_SECRET) are documented in README.md and .env.example, not shown here.
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
