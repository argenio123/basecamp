// Cache tag for the public founding counter (server-only). Docs: 01-app/03-api-reference/04-functions/revalidateTag.md
// and after.md. Kept apart from founding.ts so the payment store can import it without an import cycle.
import { revalidateTag } from "next/cache";
import { after } from "next/server";

/** Tags getFoundingCount() (src/lib/payments/founding.ts). */
export const FOUNDING_COUNT_TAG = "founding-count";
const NOW = { expire: 0 };

/**
 * Marks the cached founding count stale after a founding payment becomes paid or stops being paid (e.g. refunded).
 * revalidateTag works in Route Handlers (the webhook) and Server Actions, but not while a page renders (the success,
 * cancelled and account pages sync payments during render), so there it runs in after(), once the response is sent.
 * Outside any request (scripts) there is no cache to refresh.
 * { expire: 0 }, not "max": with stale-while-revalidate the page would be rebuilt from the still-stale cached count
 * and then look fresh, keeping the old number. Expiring both means the next visit rebuilds the page with the new count.
 */
export function refreshFoundingCount(): void {
  try {
    revalidateTag(FOUNDING_COUNT_TAG, NOW);
    return;
  } catch { /* during render: defer below */ }
  try {
    after(() => revalidateTag(FOUNDING_COUNT_TAG, NOW));
  } catch { /* no request context */ }
}
