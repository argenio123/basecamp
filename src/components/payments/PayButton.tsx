"use client";

import { useActionState } from "react";
import { startCheckout, type CheckoutResult } from "@/lib/payments/actions";

const INITIAL: CheckoutResult = { status: "idle", message: "" };

/** Posts the item id (and provider) to startCheckout, which redirects to PayMongo's checkout or PayPal's approval page. */
export default function PayButton({ itemId, label, promo = "", offer, provider = "paymongo", disabled = false }: { itemId: string; label: string; promo?: string; offer?: "founding"; provider?: "paymongo" | "paypal"; disabled?: boolean }) {
  const [state, action, pending] = useActionState(startCheckout, INITIAL);
  return (
    <form action={action} className="py-form">
      <input type="hidden" name="item" value={itemId} />
      {promo && <input type="hidden" name="promo" value={promo} />}
      {offer && <input type="hidden" name="offer" value={offer} />}
      <input type="hidden" name="provider" value={provider} />
      {state.status === "error" && <p className="py-error" role="alert">{state.message}</p>}
      <button type="submit" className={`py-button${provider === "paypal" ? " py-button--paypal" : ""}`} disabled={pending || disabled} aria-disabled={pending || disabled}>
        {pending ? (provider === "paypal" ? "Opening PayPal…" : "Opening secure checkout…") : label}
        {!pending && <span aria-hidden="true">→</span>}
      </button>
    </form>
  );
}
