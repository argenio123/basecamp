"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { logOut } from "@/lib/members/actions";
import { getMemberMenuSummary } from "@/lib/members/profile-actions";
import { LOGGED_OUT_KEY, loginHref, MEMBER_LOGIN_PATH, MEMBER_SIGNUP_PATH } from "@/lib/members/types";
import { useMemberHint } from "./useMemberHint";

type MemberNavLinkProps = {
  className?: string;
  signedInHref?: string;
  signedInLabel?: string;
};

/** Header / mobile-menu account control: "Login" for visitors, "My account" for signed-in members. */
export default function MemberNavLink({ className, signedInHref = "/account", signedInLabel = "My account" }: MemberNavLinkProps) {
  const member = useMemberHint();
  const pathname = usePathname() || "/";
  const [accountOpen, setAccountOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [accountSummary, setAccountSummary] = useState<{ name: string; email: string } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isHeaderAccount = className?.split(/\s+/).includes("header-login") ?? false;

  useEffect(() => {
    if (!accountOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setAccountOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [accountOpen]);

  const accountMark = (
    <>
      <span className="mb-account-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5.5 20c.5-4 2.7-6 6.5-6s6 2 6.5 6" />
        </svg>
      </span>
      <span className="mb-account-label">{signedInLabel}</span>
    </>
  );

  /*
   * Log out, then hard-reload so every server component, cached route and client state drops the member session.
   * Member-only pages (account, booking, contact requests) would bounce to the log-in screen, so those go home instead.
   * The form's `action={logOut}` still works as a redirecting fallback before hydration / without JS.
   */
  const handleLogOut = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      // Route handler, not a Server Action: an action would re-render the page in place before the reload.
      await fetch("/account/logout", { method: "POST", credentials: "same-origin", cache: "no-store" });
    } finally {
      try { window.sessionStorage.setItem(LOGGED_OUT_KEY, "true"); } catch { /* storage blocked: the full modal shows instead */ }
      const { pathname: path, search } = window.location;
      const memberOnly = path.startsWith("/account") || path.startsWith("/schedule/book") || (path === "/contact" && search !== "");
      if (memberOnly) window.location.replace("/");
      else window.location.reload();
    }
  };

  const toggleAccountMenu = () => {
    const opening = !accountOpen;
    setAccountOpen(opening);
    if (opening && !accountSummary) {
      void getMemberMenuSummary().then((summary) => {
        if (summary) setAccountSummary(summary);
      });
    }
  };

  if (member) {
    if (isHeaderAccount) {
      return (
        <div
          className="mb-account-menu"
          ref={menuRef}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setAccountOpen(false);
              triggerRef.current?.focus();
            }
          }}
        >
          <button
            ref={triggerRef}
            type="button"
            className={className}
            data-member-state="signed-in"
            aria-label="Open member menu"
            aria-expanded={accountOpen}
            aria-controls="member-account-menu"
            aria-haspopup="true"
            onClick={toggleAccountMenu}
          >
            {accountMark}
          </button>
          <div id="member-account-menu" className="mb-account-popover" data-open={accountOpen ? "true" : undefined} aria-hidden={!accountOpen}>
            <header className="mb-account-popover-head">
              <p className="mb-account-popover-title" aria-live="polite">{accountSummary?.name ?? "Loading account…"}</p>
              <p className="mb-account-popover-email">{accountSummary?.email ?? ""}</p>
            </header>
            <nav aria-label="Member shortcuts">
              <ul className="mb-account-popover-links">
                <li><Link className="mb-account-popover-link" href="/account" onClick={() => setAccountOpen(false)}><span>Account settings</span></Link></li>
                <li><Link className="mb-account-popover-link" href="/account/settings" onClick={() => setAccountOpen(false)}><span>System settings</span></Link></li>
              </ul>
            </nav>
            <form action={logOut} onSubmit={handleLogOut}>
              <input type="hidden" name="next" value="/" />
              <button className="mb-account-popover-logout" type="submit" disabled={loggingOut}>{loggingOut ? "Logging out…" : "Log out"}</button>
            </form>
          </div>
        </div>
      );
    }
    return (
      <Link href={signedInHref} className={className} data-member-state="signed-in" aria-label={signedInLabel}>
        {accountMark}
      </Link>
    );
  }
  // On the log-in page offer sign-up (and vice versa) instead of a link to the page itself.
  if (pathname === MEMBER_LOGIN_PATH) return <Link href={MEMBER_SIGNUP_PATH} className={className} data-member-state="signed-out" aria-label="Create a member account">Sign up</Link>;
  if (pathname === MEMBER_SIGNUP_PATH) return <Link href={MEMBER_LOGIN_PATH} className={className} data-member-state="signed-out" aria-label="Member login">Login</Link>;
  return (
    <Link href={loginHref(pathname)} className={className} data-member-state="signed-out" aria-label="Member login">
      Login
    </Link>
  );
}
