import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AccountSettingsNav from "@/components/members/AccountSettingsNav";
import AccountForms from "@/components/members/AccountForms";
import { getMemberProfile } from "@/lib/members/profile";
import { currentMember } from "@/lib/members/session";
import { loginHref } from "@/lib/members/types";

export const metadata: Metadata = {
  title: "My BaseCamp",
  description: "Manage your BaseCamp CamSur member profile and training preferences.",
  robots: { index: false, follow: false },
};

export const instant = false;

const GOALS: Record<string, string> = {
  strength: "Build strength",
  conditioning: "Improve conditioning",
  mobility: "Move better",
  recovery: "Prioritize recovery",
  competition: "Prepare to compete",
};

export default async function MemberAccountPage() {
  const member = await currentMember();
  if (!member) redirect(loginHref("/account"));
  const profile = await getMemberProfile(member);
  const completeFields = [profile.firstName, profile.phone, profile.goal, profile.experience, profile.preferredTime, profile.contactPreference].filter(Boolean).length;
  const completion = Math.round((completeFields / 6) * 100);
  const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ");
  const initials = `${profile.firstName.slice(0, 1)}${profile.lastName.slice(0, 1)}` || "BC";

  return (
    <section className="ma-account ma-settings-page">
      <div className="shell ma-shell">
        <div className="ma-settings-layout">
          <AccountSettingsNav active="profile" name={name} email={member.email} initials={initials} completion={completion} />

          <div className="ma-settings-content">
            <header className="ma-settings-page-head">
              <p>Account settings</p>
              <h1>Your account.</h1>
            </header>

            <div className="ma-summary">
              <div><span>Your focus</span><strong>{GOALS[profile.goal] ?? "Choose a training goal"}</strong></div>
              <div><span>Preferred window</span><strong>{profile.preferredTime ? `${profile.preferredTime[0].toUpperCase()}${profile.preferredTime.slice(1)}` : "Set your training time"}</strong></div>
              <div><span>Profile status</span><strong>{completion === 100 ? "Ready for coaching" : "A few details left"}</strong></div>
            </div>

            <AccountForms email={member.email} profile={profile} />
          </div>
        </div>
      </div>
    </section>
  );
}
