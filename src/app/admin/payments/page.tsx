import Link from "next/link";
import { Suspense } from "react";
import AdminSkeleton from "@/components/admin/AdminSkeleton";
import "@/components/payments/payments.css";
import { requireAdmin } from "@/lib/auth/session";
import { listPayments } from "@/lib/payments/store";
import { formatCentavos, PAYMENT_METHOD_LABEL, PAYMENT_STATUS_LABEL } from "@/lib/payments/types";

const when = (iso: string) => new Date(iso).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" });

// Staff view of every online payment. Not async: the admin session (cookies) is read inside <Suspense>,
// like app/admin/page.tsx.
export default function AdminPaymentsPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <PaymentsTable />
    </Suspense>
  );
}

async function PaymentsTable() {
  await requireAdmin();
  const payments = await listPayments();
  const paid = payments.filter((p) => p.status === "paid" && !p.test);
  return (
    <div className="adm-app py-admin">
      <div className="py-admin-head">
        <div><p className="py-eyebrow">Admin</p><h1>Payments</h1></div>
        <Link className="py-link" href="/admin">Back to admin</Link>
      </div>
      <div className="py-admin-stats">
        <div><span>All payments</span><strong>{payments.length}</strong></div>
        <div><span>Paid (live)</span><strong>{paid.length}</strong></div>
        <div><span>Collected (live)</span><strong>{formatCentavos(paid.reduce((s, p) => s + p.amount, 0))}</strong></div>
        <div><span>Awaiting payment</span><strong>{payments.filter((p) => p.status === "pending").length}</strong></div>
      </div>
      {payments.length === 0 ? <p className="py-empty">No payments yet.</p> : (
        <div className="py-table-wrap">
          <table className="py-table">
            <thead><tr><th>Date</th><th>Member</th><th>Item</th><th>Amount</th><th>Method</th><th>Status</th><th>Reference</th></tr></thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} data-status={p.status}>
                  <td>{when(p.paidAt ?? p.createdAt)}</td>
                  <td><strong>{p.name}</strong><small>{p.email}</small></td>
                  <td>{p.itemName}{p.deposit ? " (deposit)" : ""}<small>{p.groupTitle}{p.periodEnd ? ` · to ${new Date(p.periodEnd).toLocaleDateString("en-PH", { timeZone: "Asia/Manila" })}` : ""}</small></td>
                  <td>{formatCentavos(p.amount)}{p.discount ? <small>−{formatCentavos(p.discount)} {p.promoCode}</small> : null}</td>
                  <td>{p.method ? PAYMENT_METHOD_LABEL[p.method] ?? p.method : ""}</td>
                  <td><span className="py-status">{PAYMENT_STATUS_LABEL[p.status]}{p.test ? " · test" : ""}</span></td>
                  <td><code>{p.reference ?? p.id.slice(0, 8).toUpperCase()}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
