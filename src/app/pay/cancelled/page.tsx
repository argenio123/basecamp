import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import "@/components/payments/payments.css";
import { currentMember } from "@/lib/members/session";
import { loginHref } from "@/lib/members/types";
import { syncPayment } from "@/lib/payments/service";
import { getPayment, updatePayment } from "@/lib/payments/store";
import { payHref, PAYMENTS_ACCOUNT_PATH } from "@/lib/payments/types";

export const metadata: Metadata = { title: "Payment cancelled", robots: { index: false, follow: false } };
export const instant = false;

// The member left PayMongo's checkout without paying. Checked with PayMongo first, so a payment that did go
// through is never marked cancelled.
export default async function PayCancelledPage({ searchParams }: { searchParams: Promise<{ payment?: string }> }) {
  const { payment: id = "" } = await searchParams;
  const member = await currentMember();
  if (!member) redirect(loginHref(`/pay/cancelled?payment=${encodeURIComponent(id)}`));
  const stored = id ? await getPayment(id) : null;
  if (!stored || stored.memberId !== member.id) redirect(PAYMENTS_ACCOUNT_PATH);
  const synced = await syncPayment(stored);
  if (synced.status === "paid") redirect(`/pay/success?payment=${encodeURIComponent(id)}`);
  if (synced.status === "pending") await updatePayment(id, (p) => (p.status === "pending" ? { ...p, status: "cancelled" } : p));

  return (
    <section className="py-page">
      <div className="shell py-card">
        <span className="py-mark py-mark--wait" aria-hidden="true">×</span>
        <p className="py-eyebrow">Payment cancelled</p>
        <h1>No payment was made.</h1>
        <p className="py-lead">You left the checkout before paying for {synced.itemName}. Nothing was charged.</p>
        <div className="py-actions">
          <Link className="py-button py-button--link" href={payHref(synced.itemId)}>Try again <span aria-hidden="true">→</span></Link>
          <Link className="py-link" href={PAYMENTS_ACCOUNT_PATH}>View my payments</Link>
        </div>
      </div>
    </section>
  );
}
