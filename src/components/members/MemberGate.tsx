"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { loginHref, signupHref } from "@/lib/members/types";
import { useMemberHint } from "./useMemberHint";

/** "Log in to continue" panel with Log in / Create account links that return to this page afterwards. */
export function LoginPrompt({ compact = false, title = "Log in to continue", text = "Requests, inquiries, bookings, and purchases need a BaseCamp member account." }: { compact?: boolean; title?: string; text?: string }) {
  const next = usePathname() || "/";
  return (
    <div className={`mb-gate${compact ? " mb-gate-compact" : ""}`} role="region" aria-label={title}>
      {!compact && <p className="mb-gate-eyebrow">Members only</p>}
      <p className="mb-gate-title">{title}</p>
      <p className="mb-gate-text">{text}</p>
      <div className="mb-gate-actions">
        <Link href={loginHref(next)} className="mb-gate-login">Log in</Link>
        <Link href={signupHref(next)} className="mb-gate-signup">Create account</Link>
      </div>
    </div>
  );
}

/** Shows the form only to signed-in members; everyone else sees the log-in prompt. */
export default function MemberGate({ children, compact = false, title, text }: { children: ReactNode; compact?: boolean; title?: string; text?: string }) {
  const member = useMemberHint();
  return member ? <>{children}</> : <LoginPrompt compact={compact} title={title} text={text} />;
}
