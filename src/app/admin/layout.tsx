import type { Metadata } from "next";
import type { ReactNode } from "react";

// Admin shell (spec §D.3). Reads no cookies: the session is checked inside the page's Suspense boundary.
// The site header and footer hide themselves on /admin routes.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="adm-shell">{children}</div>;
}
