// Optimistic admin gate (spec §D.2). Docs: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
// Proxy runs on the Node.js runtime by default, so the node:crypto HMAC check in @/lib/auth/token works here.
// This is not the security boundary: every admin Server Action re-checks with requireAdmin(),
// and the CSV route handler re-checks with isAdminRequest().
import { NextResponse, type NextRequest } from "next/server";
import { verifySession } from "@/lib/auth/token";

// The sign-in page lives at /login (outside the matcher); next.config.ts permanently redirects /admin/login → /login,
// and config redirects run before Proxy.
export function proxy(request: NextRequest) {
  const ok = verifySession(request.cookies.get("bc_admin_session")?.value ?? "", Date.now());
  if (ok) return NextResponse.next();
  // The CSV download is fetched directly, not navigated to: answer 401 rather than redirecting to the login page.
  if (request.nextUrl.pathname.startsWith("/admin/leads/export")) {
    return new NextResponse("Unauthorized", { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
