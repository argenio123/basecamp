import { Suspense, type CSSProperties } from "react";
import AuthReplay from "./AuthReplay";
import AuthSlides from "./AuthSlides";
import MemberAuthForm from "./MemberAuthForm";
import ScrollToTop from "./ScrollToTop";

const PERKS = ["Request classes, appointments, and camp places", "Send inquiries and purchase passes", "Join the early access list"];

/**
 * Member log-in / sign-up page in the Facebook / Gmail pattern, set in the gym: full-height training photos that
 * change every 5 seconds (AuthSlides),
 * the brand promise on the left, and one compact card on the right (heading, fields, a full-width button,
 * "Forgot password?", an "or" divider, and the switch to the other form). The form reads ?next= on the client.
 */
export default function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const login = mode === "login";
  return (
    <section className="mb-auth" data-anim="">
      <ScrollToTop />
      <Suspense fallback={null}><AuthReplay /></Suspense>
      <AuthSlides />
      <div className="shell mb-auth-grid">
        <div className="mb-auth-brand">
          <p className="mb-auth-eyebrow">BaseCamp CamSur · Members</p>
          <h1><span className="mb-auth-title">{login ? "Welcome back." : "Join the crew."}</span></h1>
          <span className="mb-auth-rule" aria-hidden="true" />
          <p className="mb-auth-lead">{login ? "Log in to request, inquire, book, and purchase." : "A free account lets you request, inquire, book, and purchase."}</p>
          <ul className="mb-auth-perks">{PERKS.map((p, i) => <li key={p} style={{ "--i": i } as CSSProperties}>{p}</li>)}</ul>
        </div>
        <div className="mb-auth-side">
          <div className="mb-auth-card">
            <h2>{login ? "Log in to BaseCamp" : "Create a new account"}</h2>
            {!login && <p className="mb-auth-sub">It&apos;s free and takes a minute.</p>}
            <Suspense fallback={<p className="mb-auth-loading">Loading…</p>}>
              <MemberAuthForm mode={mode} />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
