"use client";

import { useActionState } from "react";
import { updateAccountSettings, type ProfileFormResult } from "@/lib/members/profile-actions";
import type { MemberProfile } from "@/lib/members/profile";

const INITIAL: ProfileFormResult = { status: "idle", message: "" };

function ErrorText({ id, message }: { id: string; message?: string }) {
  return message ? <small id={id} className="ma-field-error">{message}</small> : null;
}

export default function AccountForms({ email, profile }: { email: string; profile: MemberProfile }) {
  const [state, action, pending] = useActionState(updateAccountSettings, INITIAL);

  return (
    <section className="ma-settings" id="account-profile" aria-labelledby="account-settings-title">
      <header className="ma-settings-head">
        <div>
          <p>Account profile</p>
          <h2 id="account-settings-title">Profile details</h2>
        </div>
      </header>

      <form className="ma-settings-form" action={action}>
        {state.status !== "idle" && <p className="ma-form-message" data-status={state.status} role={state.status === "error" ? "alert" : "status"}>{state.message}</p>}

        <div className="ma-setting-row">
          <div className="ma-setting-label"><strong>Your name</strong></div>
          <div className="ma-setting-controls ma-setting-controls--two">
            <label className="ma-field"><span>First name</span><input name="firstName" defaultValue={profile.firstName} autoComplete="given-name" maxLength={80} required aria-invalid={state.fieldErrors?.firstName ? true : undefined} /><ErrorText id="ma-first-error" message={state.fieldErrors?.firstName} /></label>
            <label className="ma-field"><span>Last name</span><input name="lastName" defaultValue={profile.lastName} autoComplete="family-name" maxLength={80} aria-invalid={state.fieldErrors?.lastName ? true : undefined} /><ErrorText id="ma-last-error" message={state.fieldErrors?.lastName} /></label>
          </div>
        </div>

        <div className="ma-setting-row">
          <div className="ma-setting-label"><strong>Contact</strong></div>
          <div className="ma-setting-controls ma-setting-controls--two">
            <label className="ma-field"><span>Email</span><input value={email} readOnly aria-readonly="true" /></label>
            <label className="ma-field"><span>Mobile</span><input name="phone" type="tel" defaultValue={profile.phone} autoComplete="tel" maxLength={40} placeholder="0918 905 1234" aria-invalid={state.fieldErrors?.phone ? true : undefined} /><ErrorText id="ma-phone-error" message={state.fieldErrors?.phone} /></label>
          </div>
        </div>

        <div className="ma-setting-row">
          <div className="ma-setting-label"><strong>Main goal</strong></div>
          <div className="ma-setting-controls">
            <label className="ma-field"><span>Training focus</span><select name="goal" defaultValue={profile.goal} required aria-invalid={state.fieldErrors?.goal ? true : undefined}><option value="" disabled>Select a goal</option><option value="strength">Build strength</option><option value="conditioning">Improve conditioning</option><option value="mobility">Move better</option><option value="recovery">Prioritize recovery</option><option value="competition">Prepare to compete</option></select><ErrorText id="ma-goal-error" message={state.fieldErrors?.goal} /></label>
          </div>
        </div>

        <div className="ma-setting-row">
          <div className="ma-setting-label"><strong>Experience</strong></div>
          <div className="ma-setting-controls">
            <label className="ma-field"><span>Current level</span><select name="experience" defaultValue={profile.experience} required aria-invalid={state.fieldErrors?.experience ? true : undefined}><option value="" disabled>Select experience</option><option value="new">New to structured training</option><option value="returning">Returning after a break</option><option value="consistent">Training consistently</option><option value="competitive">Competitive athlete</option></select><ErrorText id="ma-experience-error" message={state.fieldErrors?.experience} /></label>
          </div>
        </div>

        <div className="ma-setting-row">
          <div className="ma-setting-label"><strong>Schedule & updates</strong></div>
          <div className="ma-setting-controls ma-setting-controls--two">
            <label className="ma-field"><span>Training time</span><select name="preferredTime" defaultValue={profile.preferredTime} required aria-invalid={state.fieldErrors?.preferredTime ? true : undefined}><option value="" disabled>Select a time</option><option value="morning">Morning</option><option value="midday">Midday</option><option value="evening">Evening</option><option value="flexible">Flexible</option></select><ErrorText id="ma-time-error" message={state.fieldErrors?.preferredTime} /></label>
            <label className="ma-field"><span>Contact by</span><select name="contactPreference" defaultValue={profile.contactPreference} required aria-invalid={state.fieldErrors?.contactPreference ? true : undefined}><option value="email">Email</option><option value="phone">Phone call</option><option value="whatsapp">WhatsApp</option></select><ErrorText id="ma-contact-error" message={state.fieldErrors?.contactPreference} /></label>
          </div>
        </div>

        <footer className="ma-settings-save"><button className="ma-save" type="submit" disabled={pending}>{pending ? "Saving…" : "Save settings"}</button></footer>
      </form>
    </section>
  );
}
