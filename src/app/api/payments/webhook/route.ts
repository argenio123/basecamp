// PayMongo webhook. Docs: 01-app/03-api-reference/03-file-conventions/route.md
// Register https://<your-site>/api/payments/webhook in the PayMongo dashboard for the event
// "checkout_session.payment.paid", and put its signing secret in PAYMONGO_WEBHOOK_SECRET.
// (A local dev server can't receive webhooks; the success page checks PayMongo directly instead.)
import { markPaid } from "@/lib/payments/service";
import { verifyWebhookSignature } from "@/lib/payments/paymongo";
import { findPaymentByCheckoutId, getPayment } from "@/lib/payments/store";

type WebhookEvent = {
  data?: { attributes?: { type?: string; data?: { id?: string; attributes?: {
    metadata?: { paymentId?: string } | null;
    payment_method_used?: string | null;
    payments?: { id: string; attributes?: { status?: string } }[];
  } } } };
};

export async function POST(request: Request) {
  const raw = await request.text();
  if (!verifyWebhookSignature(raw, request.headers.get("paymongo-signature"))) return new Response("Invalid signature", { status: 401 });

  let event: WebhookEvent;
  try { event = JSON.parse(raw) as WebhookEvent; } catch { return new Response("Bad request", { status: 400 }); }

  if (event.data?.attributes?.type === "checkout_session.payment.paid") {
    const session = event.data.attributes.data;
    const byMeta = session?.attributes?.metadata?.paymentId ? await getPayment(session.attributes.metadata.paymentId) : null;
    const payment = byMeta ?? (session?.id ? await findPaymentByCheckoutId(session.id) : null);
    if (payment) {
      const paid = session?.attributes?.payments?.find((p) => p.attributes?.status === "paid");
      await markPaid(payment, { method: session?.attributes?.payment_method_used ?? undefined, reference: paid?.id });
    }
  }
  // Always 200 for a verified event, so PayMongo doesn't retry events we don't handle.
  return Response.json({ received: true });
}
