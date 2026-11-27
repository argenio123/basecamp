// Live spots for the timetable: GET /api/bookings/spots?date=YYYY-MM-DD. Docs: 01-app/03-api-reference/03-file-conventions/route.md
// and 01-getting-started route handlers "With Cache Components": reading request.url (and connection()) makes this run
// at request time, so the timetable page itself stays a static shell and fetches this after it loads.
import { connection } from "next/server";
import { getSiteContent } from "@/content/get";
import { isDate } from "@/lib/bookings/schedule";
import { spotsForDate } from "@/lib/bookings/service";
import { createSharedLimiter } from "@/lib/sharedLimiter";
import { clientIp } from "@/lib/rateLimit";

const limiter = createSharedLimiter({ name: "spots", windowMs: 60_000, perKey: 120, global: 6000 });
const NO_STORE = { "Cache-Control": "no-store" };

export async function GET(request: Request) {
  await connection();
  const date = new URL(request.url).searchParams.get("date") ?? "";
  if (!isDate(date)) return Response.json({ error: "date must be YYYY-MM-DD" }, { status: 400, headers: NO_STORE });
  if (await limiter.take(clientIp(request.headers))) return Response.json({ error: "Too many requests" }, { status: 429, headers: NO_STORE });
  try {
    return Response.json(await spotsForDate(await getSiteContent(), date), { headers: NO_STORE });
  } catch (error) {
    console.error("[bookings] spots failed:", error instanceof Error ? error.message : error);
    // The timetable keeps its request links when this fails.
    return Response.json({ date, price: null, slots: {} }, { status: 503, headers: NO_STORE });
  }
}
