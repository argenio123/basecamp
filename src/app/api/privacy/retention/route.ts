// Scheduled retention clean-up (see src/lib/privacy/retention.ts for what it changes and how to schedule it).
// Docs: 03-api-reference/03-file-conventions/route.md. Vercel Cron calls GET with "Authorization: Bearer
// $CRON_SECRET". Disabled (404) unless CRON_SECRET is set; ?dryRun=1 only reports. Responds with counts only.
import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import { runRetention } from "@/lib/privacy/retention";

const NO_STORE = { "Cache-Control": "no-store" };

function authorised(auth: string, secret: string): boolean {
  const given = Buffer.from(auth);
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function GET(request: NextRequest) {
  // Reading the request first keeps this handler request-time: otherwise, with Cache Components, a build without
  // CRON_SECRET would prerender the 404 for good.
  const auth = request.headers.get("authorization") ?? "";
  const secret = process.env.CRON_SECRET ?? "";
  if (secret.length < 16) return new Response("Not found", { status: 404, headers: NO_STORE });
  if (!authorised(auth, secret)) return new Response("Unauthorized", { status: 401, headers: NO_STORE });
  try {
    const report = await runRetention({ dryRun: request.nextUrl.searchParams.get("dryRun") === "1" });
    console.info(`[privacy] ${JSON.stringify({ action: "retention.cron", ...report })}`);
    return Response.json(report, { headers: NO_STORE });
  } catch {
    return new Response("Clean-up failed; it is safe to retry.", { status: 503, headers: NO_STORE });
  }
}
