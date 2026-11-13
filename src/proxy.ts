// Optimistic admin gate (spec §D.2). Docs: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
// Proxy runs on the Node.js runtime by default, so the node:crypto HMAC check in @/lib/auth/token works here.
// This is not the security boundary: every admin Server Action re-checks with requireAdmin(),
// and the CSV route handler re-checks with isAdminRequest().
import { NextResponse, type NextRequest } from "next/server";
import { verifySession } from "@/lib/auth/token";
import { MEMBER_COOKIE, verifyMemberSession } from "@/lib/members/token";

// The sign-in page lives at /login (outside the matcher); next.config.ts permanently redirects /admin/login → /login,
// and config redirects run before Proxy.
export function proxy(request: NextRequest) {
  // Member-only pages (request / inquire / purchase / book): send visitors to the member log-in, then back.
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    // The plain Contact page is public; a Contact link that carries a request (?interest=, ?enquiry=, ?program=…,
    // used by Purchase / Inquire / Register interest buttons) needs a member log-in first, like booking.
    if (request.nextUrl.pathname === "/contact" && request.nextUrl.search === "") return NextResponse.next();
    if (verifyMemberSession(request.cookies.get(MEMBER_COOKIE)?.value ?? "", Date.now())) return NextResponse.next();
    const login = new URL("/account/login", request.url);
    login.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(login);
  }
  const ok = verifySession(request.cookies.get("bc_admin_session")?.value ?? "", Date.now());
  if (ok) return NextResponse.next();
  // The CSV download is fetched directly, not navigated to: answer 401 rather than redirecting to the login page.
  if (request.nextUrl.pathname.startsWith("/admin/leads/export")) {
    return new NextResponse("Unauthorized", { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = { matcher: ["/admin", "/admin/:path*", "/account", "/account/settings", "/contact", "/schedule/book", "/membership/join"] };
