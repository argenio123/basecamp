import Link from "next/link";
import { Suspense } from "react";
import AdminSkeleton from "@/components/admin/AdminSkeleton";
import "@/components/payments/payments.css";
import "@/styles/privacy-controls.css";
import { requireAdmin } from "@/lib/auth/session";
import { EXPIRED_HOLD_RETENTION_DAYS, LEAD_RETENTION_MONTHS, runRetention, UNPAID_PAYMENT_RETENTION_DAYS } from "@/lib/privacy/retention";
import RetentionForm from "./RetentionForm";

const day = (iso: string) => new Date(iso).toLocaleDateString("en-PH", { dateStyle: "medium", timeZone: "Asia/Manila" });

// Staff view of the retention clean-up (src/lib/privacy/retention.ts). The session is read inside <Suspense>,
// like app/admin/payments/page.tsx. Opening the page only previews (dry run); nothing changes until "Run".
export default function AdminPrivacyPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Retention />
    </Suspense>
  );
}

async function Retention() {
  await requireAdmin();
  const preview = await runRetention({ dryRun: true });
  const due = preview.leadsAnonymised + preview.paymentsStripped + preview.bookingsAnonymised + preview.expiredHoldsDeleted;
  return (
    <div className="adm-app py-admin">
      <div className="py-admin-head">
        <div><p className="py-eyebrow">Admin</p><h1>Privacy clean-up</h1></div>
        <Link className="py-link" href="/admin">Back to admin</Link>
      </div>
      <p>
        Under the Data Privacy Act we keep personal data only as long as we need it. This clean-up anonymises
        leads older than <strong>{LEAD_RETENTION_MONTHS} months</strong> (sent before {day(preview.leadCutoff)}) and removes
        contact details from <strong>unpaid</strong> payment records older than {UNPAID_PAYMENT_RETENTION_DAYS} days.
        Class bookings for sessions held before {day(preview.leadCutoff)} are anonymised, and unpaid holds that ran out
        more than {EXPIRED_HOLD_RETENTION_DAYS} days ago are deleted; bookings for upcoming sessions are never touched.
        Paid payment records are never touched (tax and accounting). Counts, dates and types are kept for statistics.
        Export the leads CSV first if you need a copy.
      </p>
      <div className="py-admin-stats">
        <div><span>Leads to anonymise</span><strong>{preview.leadsAnonymised}</strong></div>
        <div><span>Unpaid payments to strip</span><strong>{preview.paymentsStripped}</strong></div>
        <div><span>Class bookings to anonymise</span><strong>{preview.bookingsAnonymised}</strong></div>
        <div><span>Expired holds to delete</span><strong>{preview.expiredHoldsDeleted}</strong></div>
      </div>
      <RetentionForm pending={due} />
      <p className="py-empty">
        It never runs on its own. To schedule it, set CRON_SECRET and add a Vercel Cron job for /api/privacy/retention
        (see src/lib/privacy/retention.ts).
      </p>
    </div>
  );
}
