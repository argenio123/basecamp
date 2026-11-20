import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AccountSettingsNav from "@/components/members/AccountSettingsNav";
import PayButton from "@/components/payments/PayButton";
import { dateLabel } from "@/components/payments/PaymentReceipt";
import "@/components/payments/payments.css";
import { getSiteContent } from "@/content/get";
import { getMemberProfile } from "@/lib/members/profile";
import { currentMember } from "@/lib/members/session";
import { loginHref } from "@/lib/members/types";
import { findPayable } from "@/lib/payments/catalog";
import { foundingFor } from "@/lib/payments/founding";
import { paymongoConfigured } from "@/lib/payments/paymongo";
import { paypalConfigured } from "@/lib/payments/paypal";
import { membershipStatus, syncPayment } from "@/lib/payments/service";
import { listMemberPayments } from "@/lib/payments/store";
import { formatCentavos, PAYMENT_METHOD_LABEL, PAYMENT_STATUS_LABEL, PAYMENTS_ACCOUNT_PATH } from "@/lib/payments/types";

export const metadata: Metadata = {
  title: "Payments",
  description: "Your BaseCamp CamSur membership status and payment history.",
  robots: { index: false, follow: false },
};

export const instant = false;

// Membership status (paid through / due) with "Pay next month", and every payment with its status and receipt info.
export default async function MemberPaymentsPage() {
  const member = await currentMember();
  if (!member) redirect(loginHref(PAYMENTS_ACCOUNT_PATH));

  const [profile, stored, content] = await Promise.all([getMemberProfile(member), listMemberPayments(member.id), getSiteContent()]);
  // Pending payments are re-checked with PayMongo, so a payment finished in another tab shows as paid.
  const payments = await Promise.all(stored.map((p) => (p.status === "pending" ? syncPayment(p) : p)));
  const status = await membershipStatus(member.id);
  const renew = status ? findPayable(content, status.itemId) : null;
  // A founding member renews at the founding rate (it stays locked in).
  const foundingCheck = renew ? await foundingFor(content, member.id, renew.item.id) : null;
  const foundingRenew = foundingCheck?.ok && foundingCheck.returning ? foundingCheck : null;

  const completeFields = [profile.firstName, profile.phone, profile.goal, profile.experience, profile.preferredTime, profile.contactPreference].filter(Boolean).length;
  const completion = Math.round((completeFields / 6) * 100);
  const name = [profile.firstName, profile.lastName].filter(Boolean).join(" ");
  const initials = `${profile.firstName.slice(0, 1)}${profile.lastName.slice(0, 1)}` || "BC";
  const paidTotal = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);

  return (
    <section className="ma-account ma-settings-page">
      <div className="shell ma-shell">
        <div className="ma-settings-layout">
          <AccountSettingsNav active="payments" name={name} email={member.email} initials={initials} completion={completion} />

          <div className="ma-settings-content">
            <header className="ma-settings-page-head">
              <p>Payments</p>
              <h1>Your payments.</h1>
            </header>

            <div className="py-member">
              {status ? (
                <>
                  <div>
                    <span>Membership</span>
                    <strong>{status.itemName}</strong>
                    <small>{status.active ? `Paid through ${dateLabel(status.paidThrough)} (${status.daysLeft} day${status.daysLeft === 1 ? "" : "s"} left)` : `Ended ${dateLabel(status.paidThrough)}`}</small>
                  </div>
                  {renew && (paymongoConfigured() || paypalConfigured()) && <PayButton itemId={renew.item.id} offer={foundingRenew ? "founding" : undefined} provider={paymongoConfigured() ? "paymongo" : "paypal"} label={`${status.active ? "Pay next month" : "Renew"} · ${formatCentavos(foundingRenew ? foundingRenew.rate.amount : renew.amount)}`} />}
                </>
              ) : (
                <>
                  <div>
                    <span>Membership</span>
                    <strong>No membership paid yet</strong>
                    <small>Pick a plan and pay one month at a time.</small>
                  </div>
                  <Link className="py-button py-button--link" href="/membership#tiers">Choose a plan <span aria-hidden="true">→</span></Link>
                </>
              )}
            </div>

            <div className="ma-summary">
              <div><span>Payments</span><strong>{payments.length}</strong></div>
              <div><span>Paid</span><strong>{payments.filter((p) => p.status === "paid").length}</strong></div>
              <div><span>Total paid</span><strong>{formatCentavos(paidTotal)}</strong></div>
            </div>

            {payments.length === 0 ? (
              <p className="py-empty">No payments yet. Memberships, passes, camps, and recovery sessions can be paid from the <Link href="/membership/price-guide">price guide</Link>.</p>
            ) : (
              <ul className="py-history">
                {payments.map((p) => (
                  <li key={p.id} data-status={p.status}>
                    <div>
                      <strong>{p.itemName}{p.deposit ? " (deposit)" : ""}</strong>
                      <small>
                        {dateLabel(p.paidAt ?? p.createdAt)}
                        {p.method ? ` · ${PAYMENT_METHOD_LABEL[p.method] ?? p.method}` : ""}
                        {p.periodStart && p.periodEnd ? ` · covers ${dateLabel(p.periodStart)} to ${dateLabel(p.periodEnd)}` : ""}
                        {p.test ? " · test" : ""}
                      </small>
                    </div>
                    <span className="py-amount">{formatCentavos(p.amount)}</span>
                    <span className="py-status">{PAYMENT_STATUS_LABEL[p.status]}</span>
                    {p.status === "pending" && p.checkoutUrl && <a className="py-link" href={p.checkoutUrl}>Finish paying</a>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
