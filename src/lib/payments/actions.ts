"use server";

// Starts a PayMongo checkout. Docs: 01-app/02-guides/server-actions.md, 03-api-reference/04-functions/redirect.md
// (redirect is called outside try/catch). The amount always comes from the pricing content, never the form.
import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSiteContent } from "@/content/get";
import { currentMember } from "@/lib/members/session";
import { loginHref } from "@/lib/members/types";
import { clientIp, createLimiter } from "@/lib/rateLimit";
import { findPayable } from "./catalog";
import { createCheckoutSession, paymongoConfigured, paymongoTestMode } from "./paymongo";
import { createPaypalOrder, paypalConfigured, paypalTestMode } from "./paypal";
import { foundingFor } from "./founding";
import { applyPromo, type PromoResult } from "./promo";
import { addPayment, updatePayment } from "./store";
import { payHref, type Payment } from "./types";

export type CheckoutResult = { status: "idle" | "error"; message: string };

const limiter = createLimiter({ windowMs: 10 * 60_000, perKey: 10, global: 300 });
/** Promo checks, limited so codes can't be guessed by trying many. */
const promoLimiter = createLimiter({ windowMs: 10 * 60_000, perKey: 15, global: 600 });

async function siteOrigin(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
  if (configured) return configured;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/** Checks a promo code for an item and returns the discount and new total (nothing is saved). */
export async function previewPromo(itemId: string, code: string): Promise<PromoResult> {
  const member = await currentMember();
  if (!member) return { ok: false, message: "Log in to use a promo code." };
  const key = `${member.id}:${clientIp(await headers())}`;
  if (promoLimiter.blocked(key, Date.now())) return { ok: false, message: "Too many tries. Please wait a few minutes." };
  promoLimiter.hit(key, Date.now());
  const payable = findPayable(await getSiteContent(), String(itemId).slice(0, 80));
  if (!payable) return { ok: false, message: "This item can't be paid online." };
  return applyPromo(String(code).slice(0, 40), payable.item.id, payable.amount);
}

export async function startCheckout(_prev: CheckoutResult, form: FormData): Promise<CheckoutResult> {
  const itemId = String(form.get("item") ?? "").slice(0, 80);
  const member = await currentMember();
  if (!member) redirect(loginHref(payHref(itemId)));

  const provider = form.get("provider") === "paypal" ? "paypal" : "paymongo";
  if (!(provider === "paypal" ? paypalConfigured() : paymongoConfigured())) return { status: "error", message: `${provider === "paypal" ? "PayPal" : "Online payment"} isn't switched on yet. Please try another way to pay or contact the team.` };
  const ip = clientIp(await headers());
  if (limiter.blocked(`${member.id}:${ip}`, Date.now())) return { status: "error", message: "Too many payment attempts. Please wait a few minutes and try again." };
  limiter.hit(`${member.id}:${ip}`, Date.now());

  const content = await getSiteContent();
  const payable = findPayable(content, itemId);
  if (!payable) return { status: "error", message: "This item can't be paid online. Please contact the team." };

  // Founding-member rate (checked on the server: offer on, spots left, or a returning founding member). It replaces
  // promo codes; the two don't stack.
  let founding: { amount: number } | null = null;
  if (form.get("offer") === "founding") {
    const check = await foundingFor(content, member.id, payable.item.id);
    if (!check.ok) return { status: "error", message: check.message };
    founding = { amount: check.rate.amount };
  }
  const promoCode = founding ? "" : String(form.get("promo") ?? "").slice(0, 40).trim();
  const promo = promoCode ? applyPromo(promoCode, payable.item.id, payable.amount) : null;
  if (promo && !promo.ok) return { status: "error", message: promo.message };
  const total = founding ? founding.amount : promo?.ok ? promo.total : payable.amount;

  const id = randomUUID();
  const name = [member.firstName, member.lastName].filter(Boolean).join(" ") || member.email;
  const label = `${payable.item.name}${payable.deposit ? " (deposit)" : ""}${payable.item.unit ? ` ${payable.item.unit}` : ""}`;
  const payment: Payment = {
    id, memberId: member.id, email: member.email, name,
    itemId: payable.item.id, itemName: payable.item.name, groupTitle: payable.group.title, kind: payable.kind,
    amount: total, listAmount: payable.amount,
    ...(founding ? { discount: payable.amount - founding.amount, promoCode: "Founding rate", offer: "founding" as const } : promo?.ok ? { discount: promo.discount, promoCode: promo.code } : {}),
    currency: "PHP", deposit: payable.deposit, status: "pending", provider, test: provider === "paypal" ? paypalTestMode() : paymongoTestMode(),
    createdAt: new Date().toISOString(),
  };

  let checkoutUrl = "";
  try {
    await addPayment(payment);
    const origin = await siteOrigin();
    if (provider === "paypal") {
      const order = await createPaypalOrder({
        name: `BaseCamp CamSur: ${label}${founding ? " (founding member rate)" : promo?.ok ? ` (promo ${promo.code})` : ""}`,
        amount: total,
        reference: id.slice(0, 8).toUpperCase(),
        returnUrl: `${origin}/pay/success?payment=${id}`,
        cancelUrl: `${origin}/pay/cancelled?payment=${id}`,
        requestId: id,
      });
      await updatePayment(id, (p) => ({ ...p, checkoutId: order.id, checkoutUrl: order.approveUrl }));
      checkoutUrl = order.approveUrl;
    } else {
    const session = await createCheckoutSession({
      name: label,
      description: `BaseCamp CamSur: ${label}${founding ? " · founding member rate" : promo?.ok ? ` · promo ${promo.code}` : ""}`,
      amount: total,
      reference: id.slice(0, 8).toUpperCase(),
      successUrl: `${origin}/pay/success?payment=${id}`,
      cancelUrl: `${origin}/pay/cancelled?payment=${id}`,
      billing: { name, email: member.email, phone: member.phone || undefined },
      metadata: { paymentId: id, memberId: member.id, itemId: payable.item.id, ...(promo?.ok ? { promoCode: promo.code } : {}) },
    });
    await updatePayment(id, (p) => ({ ...p, checkoutId: session.id, checkoutUrl: session.checkoutUrl }));
    checkoutUrl = session.checkoutUrl;
    }
  } catch (error) {
    await updatePayment(id, (p) => ({ ...p, status: "failed" })).catch(() => null);
    console.error("[payments] checkout failed:", error instanceof Error ? error.message : error);
    return { status: "error", message: "We couldn't open the payment page. Please try again in a moment." };
  }
  redirect(checkoutUrl);
}
