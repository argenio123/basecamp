import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AccountSettingsNav from "@/components/members/AccountSettingsNav";
import SystemSettingsForm from "@/components/members/SystemSettingsForm";
import { getMemberProfile } from "@/lib/members/profile";
import { currentMember } from "@/lib/members/session";
import { loginHref } from "@/lib/members/types";

export const metadata: Metadata = { title: "System settings", description: "Manage BaseCamp CamSur member-system preferences.", robots: { index: false, follow: false } };
export const instant = false;

export default async function SystemSettingsPage() {
  const member = await currentMember();
  if (!member) redirect(loginHref("/account/settings"));
  const profile = await getMemberProfile(member);
  const completeFields = [profile.firstName, profile.phone, profile.goal, profile.experience, profile.preferredTime, profile.contactPreference].filter(Boolean).length;
  const completion = Math.round((completeFields / 6) * 100);
  const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ");
  const initials = `${profile.firstName.slice(0, 1)}${profile.lastName.slice(0, 1)}` || "BC";

  return (
    <section className="ma-account ma-settings-page ma-system-page">
      <div className="shell ma-shell">
        <div className="ma-settings-layout">
          <AccountSettingsNav active="system" name={name} email={member.email} initials={initials} completion={completion} />
          <div className="ma-settings-content">
            <header className="ma-settings-page-head">
              <p>System settings</p>
              <h1>Preferences.</h1>
            </header>
            <SystemSettingsForm profile={profile} />
          </div>
        </div>
      </div>
    </section>
  );
}
