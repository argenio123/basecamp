import { Suspense } from "react";
import AuthTabs from "./AuthTabs";
import MemberAuthForm from "./MemberAuthForm";

/** The white card for one page: Log in / Sign up tabs, heading, and the form. The form reads ?next= on the client. */
export default function AuthCard({ mode }: { mode: "login" | "signup" }) {
  const login = mode === "login";
  return (
    <div className="mb-auth-card" key={mode}>
      <Suspense fallback={null}><AuthTabs mode={mode} /></Suspense>
      <h2>{login ? "Welcome back." : "Join BaseCamp."}</h2>
      <p className="mb-auth-sub">{login ? "Log in to manage your requests, bookings, and membership." : "It's free and takes a minute."}</p>
      <Suspense fallback={<p className="mb-auth-loading">Loading…</p>}>
        <MemberAuthForm mode={mode} />
      </Suspense>
    </div>
  );
}
