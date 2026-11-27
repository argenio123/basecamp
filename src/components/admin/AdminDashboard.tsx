import { readContentFresh } from "@/content/get";
import type { ReviewItem } from "@/content/review";
import type { ContentMeta, SiteContent } from "@/content/types";
import { requireAdmin, staffEmail } from "@/lib/auth/session";
import { listLeads } from "@/lib/leads/store";
import type { Lead } from "@/lib/leads/types";
import { driver } from "@/lib/storage/driver";
import AdminApp from "./AdminApp";

// Request-time admin data (spec §D.3). Rendered inside <Suspense> by app/admin/page.tsx.
// requireAdmin() runs first and redirects (outside any try/catch) when the session is missing or invalid.
export default async function AdminDashboard() {
  const session = await requireAdmin();
  let data: { content: SiteContent; meta: ContentMeta; review: ReviewItem[]; leads: Lead[] } | null = null;
  try {
    const [{ content, meta, review }, leads] = await Promise.all([readContentFresh(), listLeads()]);
    data = { content, meta, review, leads };
  } catch {
    data = null;
  }
  if (!data) {
    return (
      <div className="adm-app">
        <div className="adm-panel">
          <p className="adm-alert" role="alert">Couldn&apos;t reach content storage. Reload the page to try again.</p>
        </div>
      </div>
    );
  }
  return <AdminApp content={data.content} meta={data.meta} review={data.review} leads={data.leads} storage={driver()} signedInAs={staffEmail(session)} />;
}
