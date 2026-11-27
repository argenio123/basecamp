// PayPal Checkout client (server-only), Orders API v2. Docs: https://developer.paypal.com/docs/api/orders/v2/
// Keys come from .env: PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_MODE ("sandbox" for testing, "live" for real
// payments; sandbox if unset). The secret never reaches the browser. Amounts are charged in Philippine pesos (PHP).

const mode = () => (process.env.PAYPAL_MODE?.trim().toLowerCase() === "live" ? "live" : "sandbox");
const API = () => (mode() === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com");
const clientId = () => process.env.PAYPAL_CLIENT_ID?.trim() ?? "";
const clientSecret = () => process.env.PAYPAL_CLIENT_SECRET?.trim() ?? "";

export const paypalConfigured = () => !!clientId() && !!clientSecret();
export const paypalTestMode = () => mode() === "sandbox";

export class PaypalError extends Error {}

let cached: { token: string; expires: number } | null = null;

async function accessToken(): Promise<string> {
  if (cached && cached.expires > Date.now() + 60_000) return cached.token;
  const res = await fetch(`${API()}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(`${clientId()}:${clientSecret()}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  const json = (await res.json().catch(() => null)) as { access_token?: string; expires_in?: number } | null;
  if (!res.ok || !json?.access_token) throw new PaypalError(`PayPal sign-in failed (${res.status}).`);
  cached = { token: json.access_token, expires: Date.now() + (json.expires_in ?? 300) * 1000 };
  return cached.token;
}

type Order = {
  id: string;
  status: string;
  links?: { rel: string; href: string }[];
  purchase_units?: { payments?: { captures?: { id: string; status: string }[] } }[];
};

async function call<T>(path: string, init: { method: "GET" | "POST"; body?: unknown; requestId?: string }): Promise<{ ok: boolean; status: number; data: T | null; issue?: string }> {
  const res = await fetch(`${API()}${path}`, {
    method: init.method,
    headers: {
      Authorization: `Bearer ${await accessToken()}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.requestId ? { "PayPal-Request-Id": init.requestId } : {}),
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  const data = (await res.json().catch(() => null)) as (T & { details?: { issue?: string }[] }) | null;
  return { ok: res.ok, status: res.status, data, issue: data?.details?.[0]?.issue };
}

const pesos = (centavos: number) => (centavos / 100).toFixed(2);

/** Creates an order and returns where to send the buyer to approve it. */
export async function createPaypalOrder(input: {
  name: string; amount: number; reference: string; returnUrl: string; cancelUrl: string; requestId: string;
}): Promise<{ id: string; approveUrl: string }> {
  const r = await call<Order>("/v2/checkout/orders", {
    method: "POST",
    requestId: input.requestId,
    body: {
      intent: "CAPTURE",
      purchase_units: [{
        reference_id: input.reference,
        custom_id: input.requestId,
        description: input.name.slice(0, 127),
        amount: { currency_code: "PHP", value: pesos(input.amount) },
      }],
      payment_source: {
        paypal: {
          experience_context: {
            brand_name: "BaseCamp CamSur",
            shipping_preference: "NO_SHIPPING",
            user_action: "PAY_NOW",
            return_url: input.returnUrl,
            cancel_url: input.cancelUrl,
          },
        },
      },
    },
  });
  const approveUrl = r.data?.links?.find((l) => l.rel === "payer-action" || l.rel === "approve")?.href;
  if (!r.ok || !r.data?.id || !approveUrl) throw new PaypalError(`PayPal order failed (${r.status}${r.issue ? ` ${r.issue}` : ""}).`);
  return { id: r.data.id, approveUrl };
}

/** `refused`: the order was approved but not captured because `mayCapture` said no (nothing was charged). */
export type PaypalState = { paid: boolean; expired: boolean; reference?: string; refused?: boolean };

const captureOf = (o: Order | null) => o?.purchase_units?.[0]?.payments?.captures?.find((c) => c.status === "COMPLETED");

/**
 * Current state of an order. An approved order is captured here (the buyer said yes on PayPal, so this is the step
 * that actually takes the money); capturing twice is safe because PayPal reports the order as already captured.
 * `mayCapture` is asked first: when it says no, the order is left uncaptured (PayPal lets it lapse) and reported
 * as refused.
 */
export async function getPaypalState(orderId: string, { mayCapture }: { mayCapture?: () => Promise<boolean> } = {}): Promise<PaypalState> {
  const id = encodeURIComponent(orderId);
  const got = await call<Order>(`/v2/checkout/orders/${id}`, { method: "GET" });
  if (!got.ok || !got.data) throw new PaypalError(`PayPal order lookup failed (${got.status}).`);
  if (got.data.status === "COMPLETED") return { paid: true, expired: false, reference: captureOf(got.data)?.id ?? got.data.id };
  if (got.data.status === "APPROVED") {
    if (mayCapture && !(await mayCapture())) return { paid: false, expired: false, refused: true };
    const cap = await call<Order>(`/v2/checkout/orders/${id}/capture`, { method: "POST", body: {}, requestId: `capture-${orderId}` });
    if (cap.ok && cap.data?.status === "COMPLETED") return { paid: true, expired: false, reference: captureOf(cap.data)?.id ?? orderId };
    if (cap.issue === "ORDER_ALREADY_CAPTURED") return getPaypalState(orderId);
    return { paid: false, expired: false };
  }
  return { paid: false, expired: got.data.status === "VOIDED" };
}
