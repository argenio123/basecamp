// "Download my data": the signed-in member's account, profile, requests and payments as JSON
// (RA 10173 Sec. 16(c) access, Sec. 18 portability). Docs: 03-api-reference/03-file-conventions/route.md
// (reading request.cookies makes this GET handler request-time). Not covered by proxy.ts, so it checks the
// session itself. A cross-site link can only make a member download their own file to their own device.
import type { NextRequest } from "next/server";
import { findMemberById } from "@/lib/members/store";
import { MEMBER_COOKIE, verifyMemberSession } from "@/lib/members/token";
import { collectMemberData } from "@/lib/privacy/export";
import { createSharedLimiter } from "@/lib/sharedLimiter";

const limiter = createSharedLimiter({ name: "member-export", windowMs: 10 * 60 * 1000, perKey: 10, global: 300 });
const NO_STORE = { "Cache-Control": "no-store" };

export async function GET(request: NextRequest) {
  const memberId = verifyMemberSession(request.cookies.get(MEMBER_COOKIE)?.value ?? "", Date.now());
  if (!memberId) return new Response("Log in to download your data.", { status: 401, headers: NO_STORE });
  if (await limiter.take(memberId)) return new Response("Too many downloads. Please try again in a few minutes.", { status: 429, headers: NO_STORE });

  let body: string;
  try {
    const member = await findMemberById(memberId);
    if (!member) return new Response("Account not found.", { status: 404, headers: NO_STORE });
    body = JSON.stringify(await collectMemberData(member), null, 2);
  } catch {
    return new Response("Couldn't reach storage. Please try again.", { status: 503, headers: NO_STORE });
  }
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  return new Response(body, {
    headers: {
      ...NO_STORE,
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="basecamp-my-data-${today}.json"`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
