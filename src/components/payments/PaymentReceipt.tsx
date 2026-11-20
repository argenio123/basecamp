import { formatCentavos, PAYMENT_METHOD_LABEL, PAYMENT_STATUS_LABEL, type Payment } from "@/lib/payments/types";
import "./payments.css";

const dateLabel = (iso?: string) => (iso ? new Date(iso).toLocaleDateString("en-PH", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Manila" }) : "");

/** Receipt-style summary of one payment (success page). */
export default function PaymentReceipt({ payment }: { payment: Payment }) {
  const rows: [string, string][] = [
    ["Item", `${payment.itemName}${payment.deposit ? " (deposit)" : ""}`],
    ["Category", payment.groupTitle],
    ...(payment.discount && payment.listAmount ? [["Subtotal", formatCentavos(payment.listAmount)], ["Discount", `−${formatCentavos(payment.discount)}${payment.promoCode ? ` (${payment.promoCode})` : ""}`]] as [string, string][] : []),
    ["Amount paid", formatCentavos(payment.amount)],
    ["Status", PAYMENT_STATUS_LABEL[payment.status]],
  ];
  if (payment.method) rows.push(["Paid with", PAYMENT_METHOD_LABEL[payment.method] ?? payment.method]);
  if (payment.paidAt) rows.push(["Paid on", dateLabel(payment.paidAt)]);
  if (payment.periodStart && payment.periodEnd) rows.push(["Covers", `${dateLabel(payment.periodStart)} to ${dateLabel(payment.periodEnd)}`]);
  rows.push(["Reference", payment.reference ?? payment.id.slice(0, 8).toUpperCase()]);
  return (
    <dl className="py-receipt">
      {rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
    </dl>
  );
}

export { dateLabel };
