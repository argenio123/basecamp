import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
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

const QUICK_ACTIONS = [
  { label: "Book a session", href: "/schedule/book", icon: "calendar" },
  { label: "View timetable", href: "/schedule/timetable", icon: "clock" },
  { label: "Join membership", href: "/membership/join", icon: "bolt" },
] as const;

const GOALS: Record<string, string> = {
  strength: "Build strength",
  conditioning: "Improve conditioning",
  mobility: "Move better",
  recovery: "Prioritize recovery",
  competition: "Prepare to compete",
};

function ActionIcon({ name }: { name: "calendar" | "clock" | "bolt" }) {
  if (name === "calendar") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" /></svg>;
  if (name === "clock") return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13 2-7 12h6l-1 8 7-12h-6l1-8Z" /></svg>;
}

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

            <section className="ma-member-shortcuts" aria-labelledby="member-shortcuts-title">
              <header><p>Member shortcuts</p><h2 id="member-shortcuts-title">What would you like to do?</h2></header>
              <div className="ma-actions" aria-label="Member quick actions">
                {QUICK_ACTIONS.map((action, index) => (
                  <Link href={action.href} className="ma-action" key={action.href} style={{ "--i": index } as CSSProperties}>
                    <span className="ma-action-icon"><ActionIcon name={action.icon} /></span>
                    <span><strong>{action.label}</strong></span>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
