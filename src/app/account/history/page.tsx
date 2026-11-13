import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AccountSettingsNav from "@/components/members/AccountSettingsNav";
import MemberHistory from "@/components/members/MemberHistory";
import { getMemberActivity } from "@/lib/members/activity";
import { getMemberProfile } from "@/lib/members/profile";
import { currentMember } from "@/lib/members/session";
import { loginHref } from "@/lib/members/types";

export const metadata: Metadata = {
  title: "Activity history",
  description: "Review your BaseCamp CamSur requests, enquiries, and access activity.",
  robots: { index: false, follow: false },
};

export const instant = false;

export default async function MemberHistoryPage() {
  const member = await currentMember();
  if (!member) redirect(loginHref("/account/history"));

  const [profile, activity] = await Promise.all([getMemberProfile(member), getMemberActivity(member.email)]);
  const completeFields = [profile.firstName, profile.phone, profile.goal, profile.experience, profile.preferredTime, profile.contactPreference].filter(Boolean).length;
  const completion = Math.round((completeFields / 6) * 100);
  const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ");
  const initials = `${profile.firstName.slice(0, 1)}${profile.lastName.slice(0, 1)}` || "BC";
  const completed = activity.filter((item) => item.status === "completed").length;
  const inProgress = activity.length - completed;

  return (
    <section className="ma-account ma-settings-page ma-history-page">
      <div className="shell ma-shell">
        <div className="ma-settings-layout">
          <AccountSettingsNav active="history" name={name} email={member.email} initials={initials} completion={completion} />

          <div className="ma-settings-content">
            <header className="ma-settings-page-head ma-history-page-head">
              <p>Activity history</p>
              <h1>Your activity.</h1>
            </header>

            <div className="ma-summary ma-history-overview">
              <div><span>Recent records</span><strong>{activity.length}</strong></div>
              <div><span>Open or in review</span><strong>{inProgress}</strong></div>
              <div><span>Completed</span><strong>{completed}</strong></div>
            </div>

            <MemberHistory items={activity} />
          </div>
        </div>
      </div>
    </section>
  );
}
