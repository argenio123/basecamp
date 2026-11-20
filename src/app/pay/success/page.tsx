import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import PaymentReceipt from "@/components/payments/PaymentReceipt";
import "@/components/payments/payments.css";
import { currentMember } from "@/lib/members/session";
import { loginHref } from "@/lib/members/types";
import { syncPayment } from "@/lib/payments/service";
import { getPayment } from "@/lib/payments/store";
import { PAYMENTS_ACCOUNT_PATH } from "@/lib/payments/types";

export const metadata: Metadata = { title: "Payment received", robots: { index: false, follow: false } };
export const instant = false;

// PayMongo sends the member here after paying. The status is confirmed with PayMongo directly (a local dev server
// can't receive the webhook), so a reload shows the latest state.
export default async function PaySuccessPage({ searchParams }: { searchParams: Promise<{ payment?: string }> }) {
  const { payment: id = "" } = await searchParams;
  const member = await currentMember();
  if (!member) redirect(loginHref(`/pay/success?payment=${encodeURIComponent(id)}`));
  const stored = id ? await getPayment(id) : null;
  if (!stored || stored.memberId !== member.id) redirect(PAYMENTS_ACCOUNT_PATH);
  const payment = await syncPayment(stored);
  const paid = payment.status === "paid";

  return (
    <section className="py-page">
      <div className="shell py-card">
        <span className={`py-mark${paid ? "" : " py-mark--wait"}`} aria-hidden="true">{paid ? "✓" : "…"}</span>
        <p className="py-eyebrow">{paid ? "Payment received" : "Payment processing"}</p>
        <h1>{paid ? "You're all set." : "Almost there."}</h1>
        <p className="py-lead">{paid ? "Thanks! Your payment went through and a receipt is on its way to your email." : "We haven't had confirmation from PayMongo yet. This usually takes a few seconds; reload this page to check again."}</p>
        <PaymentReceipt payment={payment} />
        {payment.test && <p className="py-test">Test payment: no real money was charged.</p>}
        <div className="py-actions">
          <Link className="py-button py-button--link" href={PAYMENTS_ACCOUNT_PATH}>View my payments <span aria-hidden="true">→</span></Link>
          {payment.kind !== "membership" && <Link className="py-link" href="/schedule/book">Book a session</Link>}
        </div>
      </div>
    </section>
  );
}
