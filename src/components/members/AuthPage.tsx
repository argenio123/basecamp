import Link from "next/link";
import { Suspense, type CSSProperties } from "react";
import MemberAuthForm from "./MemberAuthForm";
import AuthReplay from "./AuthReplay";
import ScrollToTop from "./ScrollToTop";

const PERKS = ["Request classes, appointments, and camp places", "Send inquiries and purchase passes", "Join the early access list"];

/** Member log-in / sign-up page: Ink brand panel + form card (form reads ?next= on the client, inside Suspense). */
export default function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const title = mode === "login" ? "Welcome back." : "Join BaseCamp.";
  return (
    <section className="section mb-auth" data-anim="">
      <ScrollToTop />
      <Suspense fallback={null}><AuthReplay /></Suspense>
      <div className="shell mb-auth-grid">
        <div className="mb-auth-brand">
          <p className="mb-auth-eyebrow">Member account</p>
          <h1><span className="mb-auth-title">{title}</span></h1>
          <span className="mb-auth-rule" aria-hidden="true" />
          <p className="mb-auth-lead">{mode === "login" ? "Log in to request, inquire, book and purchase." : "Create a free account to request, inquire, book and purchase."}</p>
          <ul className="mb-auth-perks">{PERKS.map((p, i) => <li key={p} style={{ "--i": i } as CSSProperties}>{p}</li>)}</ul>
          <p className="mb-auth-staff">Staff? <Link href="/login">Staff sign-in</Link></p>
        </div>
        <div className="mb-auth-card">
          <h2>{mode === "login" ? "Log in" : "Create account"}</h2>
          <Suspense fallback={<p className="mb-auth-loading">Loading…</p>}>
            <MemberAuthForm mode={mode} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
