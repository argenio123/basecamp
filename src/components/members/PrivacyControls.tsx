"use client";

// "Your data" panel in /account/settings: download a copy (access / portability) and delete the account
// (erasure). Server side: src/app/account/data/route.ts and src/lib/members/privacy-actions.ts.
import Link from "next/link";
import { useActionState, useId, useState } from "react";
import { PRIVACY_PATH } from "@/data/legal";
import { deleteAccount, type DeleteAccountResult } from "@/lib/members/privacy-actions";
import "@/styles/privacy-controls.css";

const INITIAL: DeleteAccountResult = { status: "idle", message: "" };

export default function PrivacyControls({ email }: { email: string }) {
  const [state, action, pending] = useActionState(deleteAccount, INITIAL);
  const [confirm, setConfirm] = useState("");
  const id = useId();
  const confirmed = confirm.trim() === "DELETE" || confirm.trim().toLowerCase() === email.toLowerCase();
  const err = (k: string) => state.fieldErrors?.[k];

  return (
    <section className="ma-settings pc-panel" id="your-data" aria-labelledby="your-data-title">
      <header className="ma-settings-head">
        <div><p>Privacy</p><h2 id="your-data-title">Your data</h2></div>
        <p>Your rights under the Data Privacy Act (RA 10173). <Link href={`${PRIVACY_PATH}#your-rights`}>Read the privacy policy</Link>.</p>
      </header>

      <div className="ma-setting-row">
        <div className="ma-setting-label"><strong>Download my data</strong><span>JSON file</span></div>
        <div className="ma-setting-controls">
          <p className="pc-text">
            A copy of your account details, profile and preferences, the requests you&apos;ve sent us (bookings,
            enquiries, sign-ups), your class bookings and your payment records, in a file you can keep or reuse.
          </p>
          {/* A plain link: the route handler checks the session and sends the file as a download. */}
          <a className="ma-save pc-download" href="/account/data" download>Download my data</a>
        </div>
      </div>

      <div className="ma-setting-row pc-danger" role="group" aria-labelledby={`${id}-danger`}>
        <div className="ma-setting-label"><strong id={`${id}-danger`}>Delete my account</strong><span>Danger zone: can&apos;t be undone</span></div>
        <div className="ma-setting-controls">
          <div className="pc-text">
            <p>Deleting your account:</p>
            <ul>
              <li><strong>deletes</strong> your member account, profile and preferences;</li>
              <li><strong>anonymises</strong> the requests you sent us: your name, email, phone and messages are replaced with &quot;[deleted]&quot;, and only the date and type stay for our visitor statistics;</li>
              <li><strong>cancels</strong> your upcoming class bookings, freeing the spots, and <strong>anonymises</strong> your past ones (the session, date and status stay for attendance statistics). Paid online for an upcoming class? Email us about the refund first;</li>
              <li><strong>keeps your payment records</strong> only because tax and accounting rules require it, with your name and email removed: the item, amount, payment reference and date stay;</li>
              <li>logs you out on this device. Download your data first if you want a copy.</li>
            </ul>
          </div>

          <form className="pc-delete-form" action={action}>
            {state.status === "error" && <p className="ma-form-message" data-status="error" role="alert">{state.message}</p>}
            <label className="ma-field" htmlFor={`${id}-confirm`}>
              <span>Type your email address or DELETE to confirm</span>
              <input
                id={`${id}-confirm`} name="confirm" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="off" spellCheck={false} maxLength={254} required
                aria-invalid={err("confirm") ? true : undefined} aria-describedby={err("confirm") ? `${id}-confirm-err` : `${id}-confirm-hint`}
              />
              {err("confirm") ? <small id={`${id}-confirm-err`} className="ma-field-error">{err("confirm")}</small> : <small id={`${id}-confirm-hint`}>{email}</small>}
            </label>
            <label className="ma-field" htmlFor={`${id}-password`}>
              <span>Current password</span>
              <input
                id={`${id}-password`} name="password" type="password" autoComplete="current-password" maxLength={200} required
                aria-invalid={err("password") ? true : undefined} aria-describedby={err("password") ? `${id}-password-err` : undefined}
              />
              {err("password") && <small id={`${id}-password-err`} className="ma-field-error">{err("password")}</small>}
            </label>
            <button className="pc-delete" type="submit" disabled={pending || !confirmed} aria-disabled={pending || !confirmed}>
              {pending ? "Deleting…" : "Permanently delete my account"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
