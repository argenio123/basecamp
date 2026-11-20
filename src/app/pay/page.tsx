import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import CheckoutPanel from "@/components/payments/CheckoutPanel";
import { dateLabel } from "@/components/payments/PaymentReceipt";
import "@/components/payments/payments.css";
import { formatPhp } from "@/content/format";
import { getSiteContent } from "@/content/get";
import { currentMember } from "@/lib/members/session";
import { loginHref } from "@/lib/members/types";
import { findPayable } from "@/lib/payments/catalog";
import { foundingFor, foundingSpots } from "@/lib/payments/founding";
import { checkoutMethods, paymongoConfigured, paymongoTestMode } from "@/lib/payments/paymongo";
import { paypalConfigured, paypalTestMode } from "@/lib/payments/paypal";
import { membershipStatus } from "@/lib/payments/service";
import { payHref } from "@/lib/payments/types";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Pay for your BaseCamp CamSur membership, pass, camp, or recovery session online.",
  robots: { index: false, follow: false },
};

export const instant = false;

/**
 * How each PayMongo method works, in one line, and its mark: brand logo files (public/images/payments, from Simple
 * Icons) where one exists, otherwise the brand name as a wordmark in the brand colour.
 */
type MethodMark = { logos?: string[]; word?: string; color?: string };
const METHOD_MARK: Record<string, MethodMark> = {
  gcash: { word: "GCash", color: "#007DFE" },
  paymaya: { word: "maya", color: "#00A651" },
  grab_pay: { logos: ["/images/payments/grab.svg"] },
  card: { logos: ["/images/payments/visa.svg", "/images/payments/mastercard.svg"] },
  paypal: { logos: ["/images/payments/paypal.svg"] },
  qrph: { word: "QR Ph", color: "#0B2D71" },
  dob: { word: "Bank", color: "#151713" },
  billease: { word: "BillEase", color: "#1B4FD8" },
};
const METHOD_INFO: Record<string, { name: string; body: string }> = {
  gcash: { name: "GCash", body: "Approve it in the GCash app." },
  paymaya: { name: "Maya", body: "Uses your Maya balance." },
  grab_pay: { name: "GrabPay", body: "Charged to your GrabPay credits." },
  card: { name: "Credit / debit card", body: "Visa or Mastercard, verified by your bank." },
  qrph: { name: "QR Ph", body: "Scan with any bank or e-wallet app." },
  dob: { name: "Online banking", body: "Straight from your bank." },
  billease: { name: "BillEase", body: "Buy now, pay later in instalments." },
  paypal: { name: "PayPal", body: "Your PayPal balance or linked cards." },
};

const addMonth = (d: Date) => { const n = new Date(d); n.setMonth(n.getMonth() + 1); return n; };

// Checkout: on the left what is being bought (description, what's included, payment methods, how it works); on the
// right the order summary (details, subtotal, promo discount, total) and the Pay button, which opens PayMongo's
// hosted checkout. Amounts come from the pricing content on the server. Members only (proxy + the check below).
export default async function PayPage({ searchParams }: { searchParams: Promise<{ item?: string; offer?: string }> }) {
  const { item: itemId = "", offer = "" } = await searchParams;
  const member = await currentMember();
  if (!member) redirect(loginHref(payHref(itemId)));
  const content = await getSiteContent();
  const payable = findPayable(content, itemId);

  if (!payable) {
    return (
      <section className="py-page">
        <div className="shell py-card">
          <p className="py-eyebrow">Checkout</p>
          <h1>Nothing to pay for here.</h1>
          <p className="py-lead">This item can&apos;t be paid online. Pick something from the price guide, or contact the team.</p>
          <div className="py-actions"><Link className="py-link" href="/membership/price-guide">See the price guide</Link></div>
        </div>
      </section>
    );
  }

  const { item, group, kind, amount, deposit } = payable;
  const configured = paymongoConfigured();
  const paypalOn = paypalConfigured();
  const status = kind === "membership" ? await membershipStatus(member.id) : null;
  // Founding-member rate: asked for in the link (?offer=founding), or automatic for a member who already pays it.
  const foundingCheck = kind === "membership" ? await foundingFor(content, member.id, item.id) : null;
  const founding = foundingCheck?.ok && (offer === "founding" || foundingCheck.returning) ? foundingCheck : null;
  const foundingMissed = offer === "founding" && !founding ? (foundingCheck && !foundingCheck.ok ? foundingCheck.message : "The founding rate isn't available for this plan.") : "";
  const spots = founding && !founding.returning && content.settings.founding.showCounter ? await foundingSpots(content) : null;
  const now = new Date();
  const start = status?.active ? new Date(status.paidThrough) : now;

  const details: { label: string; value: string }[] = [
    { label: kind === "membership" ? "Plan" : "Item", value: item.name },
    { label: "Billing", value: kind === "membership" ? "Monthly" : deposit ? "Deposit" : `One-time${item.unit ? ` · ${item.unit}` : ""}` },
  ];
  if (kind === "membership") details.push({ label: "Covers", value: `${dateLabel(start.toISOString())} to ${dateLabel(addMonth(start).toISOString())}` });
  if (item.perUnit) details.push({ label: "Works out at", value: item.perUnit });
  if (item.validity) details.push({ label: "Valid for", value: item.validity.replace(/ validity$/i, "") });
  details.push({ label: "Paying as", value: [member.firstName, member.lastName].filter(Boolean).join(" ") || member.email }, { label: "Receipt sent to", value: member.email });

  const methods = [...checkoutMethods(), "paypal"].map((m) => ({ ...(METHOD_INFO[m] ?? { name: m, body: "" }), mark: METHOD_MARK[m] ?? { word: m } }));
  const how = [
    "You pay on an encrypted page; card and wallet details never reach BaseCamp.",
    "A receipt lands in your inbox and under Payments in your account.",
    kind === "membership"
      ? status?.active ? `You're covered through ${dateLabel(status.paidThrough)}; this adds the following month.` : "No automatic charges: you choose when to renew."
      : deposit ? `Listed at ${formatPhp(item.price)}${item.unit ? ` ${item.unit}` : ""}; the starting price is due now and our team settles any balance with you.` : "Our team confirms the details with you by email or phone.",
  ];

  return (
    <section className="py-page">
      <div className="shell py-checkout">
        <div className="py-checkout-info">
          <p className="py-eyebrow">Checkout · {founding ? "Founding members" : group.title}</p>
          <h1>{item.name}</h1>
          {item.description && <p className="py-lead">{item.description}</p>}

          {item.features.length > 0 && (
            <div className="py-block">
              <h2>What&apos;s included</h2>
              <ul className="py-included">{item.features.map((f) => <li key={f}>{f}</li>)}</ul>
            </div>
          )}

          <div className="py-block">
            <h2>Ways to pay</h2>
            <ul className="py-method-list">
              {methods.map((m) => (
                <li key={m.name}>
                  <span className="py-method-logo" aria-hidden="true">
                    {m.mark.logos
                      ? m.mark.logos.map((src) => <Image key={src} src={src} alt="" width={28} height={28} unoptimized />)
                      : <b style={{ color: m.mark.color }}>{m.mark.word}</b>}
                  </span>
                  <span className="py-method-text"><strong>{m.name}</strong>{m.body && <span>{m.body}</span>}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="py-block">
            <h2>How it works</h2>
            <ol className="py-how">{how.map((h) => <li key={h}>{h}</li>)}</ol>
          </div>
        </div>

        <aside className="py-checkout-side" aria-label="Order summary">
          <h2>Order summary</h2>
          <CheckoutPanel itemId={item.id} details={details} subtotal={amount} subtotalLabel={deposit ? "Deposit" : "Subtotal"} canPay={configured} canPaypal={paypalOn}
            founding={founding ? { discount: amount - founding.rate.amount, note: founding.returning ? "Your founding rate stays locked in." : spots ? `${spots.left} of ${spots.cap} founding spots left.` : "Limited founding spots." } : undefined} />
          {foundingMissed && <p className="py-error" role="status">{foundingMissed} Standard pricing applies.</p>}
          {!configured && !paypalOn && <p className="py-error" role="status">Online payment isn&apos;t switched on yet. Add the PayMongo or PayPal keys to turn it on.</p>}
          {((configured && paymongoTestMode()) || (paypalOn && paypalTestMode())) && <p className="py-test">Test mode: no real money is charged.</p>}
          <p className="py-secure"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>Secure checkout by PayMongo and PayPal</p>
          <Link className="py-link" href="/membership/price-guide">Back to the price guide</Link>
        </aside>
      </div>
    </section>
  );
}
