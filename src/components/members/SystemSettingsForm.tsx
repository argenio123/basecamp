"use client";

import { useActionState, useEffect } from "react";
import { updateSystemSettings, type ProfileFormResult } from "@/lib/members/profile-actions";
import type { MemberProfile } from "@/lib/members/profile";

const INITIAL: ProfileFormResult = { status: "idle", message: "" };

function applyMotion(preference: string) {
  if (preference === "system") document.documentElement.removeAttribute("data-member-motion");
  else document.documentElement.dataset.memberMotion = preference;
  window.localStorage.setItem("bc-member-motion", preference);
}

function Toggle({ name, defaultChecked, label }: { name: string; defaultChecked: boolean; label: string }) {
  return (
    <label className="ma-toggle">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} />
      <span aria-hidden="true"><i /></span>
      <strong>{label}</strong>
    </label>
  );
}

export default function SystemSettingsForm({ profile }: { profile: MemberProfile }) {
  useEffect(() => applyMotion(profile.motionPreference), [profile.motionPreference]);
  const [state, action, pending] = useActionState<ProfileFormResult, FormData>(async (previous, form) => {
    const result = await updateSystemSettings(previous, form);
    if (result.status === "success") applyMotion(String(form.get("motionPreference") ?? "system"));
    return result;
  }, INITIAL);

  return (
    <section className="ma-settings ma-system-settings" aria-labelledby="system-settings-title">
      <header className="ma-settings-head">
        <div><p>Member preferences</p><h2 id="system-settings-title">System preferences</h2></div>
      </header>

      <form className="ma-settings-form" action={action}>
        {state.status !== "idle" && <p className="ma-form-message" data-status={state.status} role={state.status === "error" ? "alert" : "status"}>{state.message}</p>}

        <div className="ma-setting-row" id="notifications">
          <div className="ma-setting-label"><strong>Booking reminders</strong></div>
          <div className="ma-setting-controls"><Toggle name="bookingReminders" defaultChecked={profile.bookingReminders} label="Send booking reminders" /></div>
        </div>

        <div className="ma-setting-row">
          <div className="ma-setting-label"><strong>Reminder timing</strong></div>
          <div className="ma-setting-controls"><label className="ma-field"><span>Notify me</span><select name="reminderWindow" defaultValue={profile.reminderWindow} aria-invalid={state.fieldErrors?.reminderWindow ? true : undefined}><option value="2h">2 hours before</option><option value="12h">12 hours before</option><option value="24h">1 day before</option><option value="48h">2 days before</option></select>{state.fieldErrors?.reminderWindow && <small className="ma-field-error">{state.fieldErrors.reminderWindow}</small>}</label></div>
        </div>

        <div className="ma-setting-row">
          <div className="ma-setting-label"><strong>Weekly schedule</strong></div>
          <div className="ma-setting-controls"><Toggle name="scheduleDigest" defaultChecked={profile.scheduleDigest} label="Send the weekly schedule" /></div>
        </div>

        <div className="ma-setting-row">
          <div className="ma-setting-label"><strong>BaseCamp updates</strong></div>
          <div className="ma-setting-controls"><Toggle name="productUpdates" defaultChecked={profile.productUpdates} label="Send product and early-access updates" /></div>
        </div>

        <div className="ma-setting-row" id="accessibility">
          <div className="ma-setting-label"><strong>Interface motion</strong></div>
          <div className="ma-setting-controls"><label className="ma-field"><span>Motion preference</span><select name="motionPreference" defaultValue={profile.motionPreference} aria-invalid={state.fieldErrors?.motionPreference ? true : undefined}><option value="system">Follow device setting</option><option value="full">Use full motion</option><option value="reduced">Reduce motion</option></select>{state.fieldErrors?.motionPreference && <small className="ma-field-error">{state.fieldErrors.motionPreference}</small>}</label></div>
        </div>

        <footer className="ma-settings-save"><button className="ma-save" type="submit" disabled={pending}>{pending ? "Saving…" : "Save system settings"}</button></footer>
      </form>
    </section>
  );
}
