import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";
import { authMode } from "@/lib/auth/staff";
import { adminConfigured } from "@/lib/auth/token";
// Admin-only styles (adm- prefix); /login sits outside app/admin, so it imports them itself.
import "@/styles/admin.css";

// Staff sign-in (stage-3 §8), moved from /admin/login; next.config.ts permanently redirects the old URL here.
// Static sign-in page; the form action checks configuration and credentials again on every request.
// /login is outside the proxy matcher, so it needs no session. The site header, footer and
// "Edit this page" pill hide themselves on this path; .adm-shell keeps the admin look it had under /admin.
export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="adm-shell">
      <LoginForm configured={adminConfigured()} personal={authMode() === "personal"} />
    </div>
  );
}
