// Member log-out endpoint for the header menu. Docs: 03-api-reference/03-file-conventions/route.md.
// A plain fetch() to this handler clears the cookies WITHOUT the in-place re-render a Server Action triggers, so the
// client can hard-reload straight away and the signed-out layout never flashes on screen first.
import { clearMemberCookies } from "@/lib/members/session";

export async function POST(request: Request): Promise<Response> {
  // Same-origin only (cross-site log-out requests are refused).
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return new Response(null, { status: 403 });
  await clearMemberCookies();
  return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
