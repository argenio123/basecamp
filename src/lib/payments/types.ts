// Online payments (PayMongo checkout). Shared types; no server imports, safe for client components.

/** "refunded": paid, then refunded by staff (no longer counts as paid, e.g. towards the founding counter). */
export type PaymentStatus = "pending" | "paid" | "cancelled" | "expired" | "failed" | "refunded";
export type PaymentKind = "membership" | "pass" | "camp" | "recovery";
export type PaymentProvider = "paymongo" | "paypal";

export type Payment = {
  id: string;
  memberId: string;
  email: string;
  name: string;
  itemId: string;
  itemName: string;
  groupTitle: string;
  kind: PaymentKind;
  /** Amount charged, in centavos (PHP x 100), after any promo discount. */
  amount: number;
  /** Price before discount, in centavos (absent on payments made before promo codes existed). */
  listAmount?: number;
  /** Promo discount, in centavos, and the code used. */
  discount?: number;
  promoCode?: string;
  /** "founding" when paid at the founding-member rate (the member keeps that rate on renewals). */
  offer?: "founding";
  currency: "PHP";
  /** True when the item has a price range and only its starting price was charged (balance confirmed by staff). */
  deposit: boolean;
  status: PaymentStatus;
  /** Which checkout took the payment (absent on early records = PayMongo). */
  provider?: PaymentProvider;
  /** True when made with test keys / sandbox (no real money moved). */
  test: boolean;
  checkoutId?: string;
  checkoutUrl?: string;
  /** e.g. "gcash", "paymaya", "card" (from PayMongo once paid). */
  method?: string;
  /** PayMongo payment id, shown on the receipt. */
  reference?: string;
  createdAt: string;
  paidAt?: string;
  /** Monthly memberships only: the month this payment covers (ISO dates). */
  periodStart?: string;
  periodEnd?: string;
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  pending: "Awaiting payment",
  paid: "Paid",
  cancelled: "Cancelled",
  expired: "Expired",
  failed: "Failed",
  refunded: "Refunded",
};

export const PAYMENT_METHOD_LABEL: Record<string, string> = {
  gcash: "GCash",
  paymaya: "Maya",
  grab_pay: "GrabPay",
  card: "Card",
  qrph: "QR Ph",
  dob: "Online banking",
  billease: "BillEase",
  paypal: "PayPal",
};

/** "Php 2,500.00" from centavos. */
export const formatCentavos = (centavos: number) => `Php ${(centavos / 100).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const PAY_PATH = "/pay";
export const payHref = (itemId: string, offer?: "founding") => `${PAY_PATH}?item=${encodeURIComponent(itemId)}${offer ? `&offer=${offer}` : ""}`;
export const PAYMENTS_ACCOUNT_PATH = "/account/payments";
