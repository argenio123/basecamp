// PayMongo API client (server-only). Docs: https://developers.paymongo.com/reference
// Keys come from .env: PAYMONGO_SECRET_KEY (sk_test_… or sk_live_…), PAYMONGO_WEBHOOK_SECRET (whsk_…), optional
// PAYMONGO_METHODS (comma list, default gcash,paymaya). The secret key never reaches the browser.
import { createHmac, timingSafeEqual } from "node:crypto";

const API = "https://api.paymongo.com/v1";
const DEFAULT_METHODS = ["gcash", "paymaya"];

const secret = () => process.env.PAYMONGO_SECRET_KEY?.trim() ?? "";
export const paymongoConfigured = () => /^sk_(test|live)_/.test(secret());
export const paymongoTestMode = () => secret().startsWith("sk_test_");
const methods = () => (process.env.PAYMONGO_METHODS ?? "").split(",").map((m) => m.trim()).filter(Boolean);
/** Payment methods offered at checkout (PAYMONGO_METHODS, or the defaults). */
export const checkoutMethods = () => (methods().length ? methods() : DEFAULT_METHODS);

export class PaymongoError extends Error {}

async function call<T>(path: string, init: { method: "GET" | "POST"; body?: unknown }): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: init.method,
    headers: {
      Authorization: `Basic ${Buffer.from(`${secret()}:`).toString("base64")}`,
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  const json = (await res.json().catch(() => null)) as { data?: unknown; errors?: { detail?: string }[] } | null;
  if (!res.ok || !json?.data) throw new PaymongoError(json?.errors?.map((e) => e.detail).filter(Boolean).join(" ") || `PayMongo request failed (${res.status}).`);
  return json.data as T;
}

type CheckoutSession = {
  id: string;
  attributes: {
    checkout_url: string;
    status?: string;
    payment_method_used?: string | null;
    payments?: { id: string; attributes: { status: string; source?: { type?: string } } }[];
    payment_intent?: { attributes?: { status?: string } } | null;
  };
};

export async function createCheckoutSession(input: {
  name: string; description: string; amount: number; reference: string; successUrl: string; cancelUrl: string;
  billing: { name: string; email: string; phone?: string }; metadata: Record<string, string>;
}): Promise<{ id: string; checkoutUrl: string }> {
  const session = await call<CheckoutSession>("/checkout_sessions", {
    method: "POST",
    body: {
      data: {
        attributes: {
          billing: { name: input.billing.name, email: input.billing.email, ...(input.billing.phone ? { phone: input.billing.phone } : {}) },
          send_email_receipt: true,
          show_description: true,
          show_line_items: true,
          description: input.description,
          line_items: [{ currency: "PHP", amount: input.amount, name: input.name, quantity: 1 }],
          payment_method_types: checkoutMethods(),
          reference_number: input.reference,
          success_url: input.successUrl,
          cancel_url: input.cancelUrl,
          metadata: input.metadata,
        },
      },
    },
  });
  return { id: session.id, checkoutUrl: session.attributes.checkout_url };
}

export type CheckoutState = { paid: boolean; expired: boolean; method?: string; reference?: string };

/** Current state of a checkout session (used on the success page, where local webhooks can't reach). */
export async function getCheckoutState(checkoutId: string): Promise<CheckoutState> {
  const s = await call<CheckoutSession>(`/checkout_sessions/${encodeURIComponent(checkoutId)}`, { method: "GET" });
  const paidPayment = s.attributes.payments?.find((p) => p.attributes.status === "paid");
  const paid = !!paidPayment || s.attributes.payment_intent?.attributes?.status === "succeeded";
  return {
    paid,
    expired: s.attributes.status === "expired",
    method: s.attributes.payment_method_used ?? paidPayment?.attributes.source?.type ?? undefined,
    reference: paidPayment?.id,
  };
}

/**
 * Checks the Paymongo-Signature header ("t=…,te=…,li=…"): HMAC-SHA256 of "<t>.<raw body>" with the webhook secret,
 * compared against te (test mode) or li (live mode). Rejects events older than 10 minutes.
 */
export function verifyWebhookSignature(rawBody: string, header: string | null, now = Date.now()): boolean {
  const key = process.env.PAYMONGO_WEBHOOK_SECRET?.trim();
  if (!key || !header) return false;
  const parts = Object.fromEntries(header.split(",").map((p) => p.split("=", 2).map((s) => s.trim())));
  const t = Number(parts.t);
  if (!t || Math.abs(now / 1000 - t) > 600) return false;
  const expected = createHmac("sha256", key).update(`${parts.t}.${rawBody}`).digest("hex");
  const given = (paymongoTestMode() ? parts.te : parts.li) ?? "";
  const a = Buffer.from(expected);
  const b = Buffer.from(given);
  return a.length === b.length && timingSafeEqual(a, b);
}
