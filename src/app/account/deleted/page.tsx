import type { Metadata } from "next";
import Link from "next/link";
import SessionEnded from "@/components/members/SessionEnded";
import { PRIVACY_EMAIL } from "@/data/brand";
import { PRIVACY_PATH } from "@/data/legal";
import "@/styles/privacy-controls.css";

export const metadata: Metadata = { title: "Account deleted", description: "Your BaseCamp CamSur member account has been deleted.", robots: { index: false, follow: false } };

// Static confirmation shown after self-service account deletion (src/lib/members/privacy-actions.ts).
export default function AccountDeletedPage() {
  return (
    <section className="pc-deleted">
      <SessionEnded />
      <div className="shell">
        <div className="pc-deleted-card" role="status">
          <p className="pc-eyebrow">Account deleted</p>
          <h1>Your account is gone.</h1>
          <p>
            We deleted your member account, profile and preferences, and anonymised the requests you sent us. Payment
            records are kept only as tax and accounting rules require, with your name and email removed. You have
            been logged out.
          </p>
          <p>
            Questions, or anything else you want removed? Email <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>.
            See our <Link href={`${PRIVACY_PATH}#retention`}>privacy policy</Link> for details.
          </p>
          <p><Link className="button button-dark" href="/">Back to the home page</Link></p>
        </div>
      </div>
    </section>
  );
}
