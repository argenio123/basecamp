import type { ReactNode } from "react";
import AuthShell from "@/components/members/AuthShell";

// Shared frame for /account/login and /account/signup: it stays mounted when the visitor switches between them, so
// only the card (the page) changes.
export default function MemberAuthLayout({ children }: { children: ReactNode }) {
  return <AuthShell>{children}</AuthShell>;
}
