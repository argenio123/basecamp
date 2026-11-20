"use client";

import { useState, useTransition } from "react";
import { previewPromo } from "@/lib/payments/actions";
import { formatCentavos } from "@/lib/payments/types";
import PayButton from "./PayButton";

type Line = { label: string; value: string };

/**
 * Order summary with a promo-code box: the listed price, any discount (checked on the server), and the total due
 * today, then the Pay button (which sends the code; the server checks it again before charging).
 */
export default function CheckoutPanel({ itemId, details, subtotal, subtotalLabel, canPay, canPaypal = false, founding }: {
  itemId: string; details: Line[]; subtotal: number; subtotalLabel: string; canPay: boolean; canPaypal?: boolean;
  /** Founding-member rate: a fixed discount that replaces the promo box (checked again on the server). */
  founding?: { discount: number; note: string };
}) {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<{ code: string; label: string; discount: number; total: number } | null>(null);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const total = founding ? subtotal - founding.discount : applied ? applied.total : subtotal;

  const apply = () => startTransition(async () => {
    setMessage("");
    const result = await previewPromo(itemId, code);
    if (result.ok) { setApplied(result); setCode(""); } else setMessage(result.message);
  });

  return (
    <div className="py-panel">
      <dl className="py-lines">
        {details.map((l) => <div key={l.label}><dt>{l.label}</dt><dd>{l.value}</dd></div>)}
        <div className="py-lines-sub"><dt>{subtotalLabel}</dt><dd>{formatCentavos(subtotal)}</dd></div>
        <div className="py-lines-discount">
          <dt>Discount</dt>
          <dd>{founding ? <>−{formatCentavos(founding.discount)} <small>Founding member rate</small></> : applied ? <>−{formatCentavos(applied.discount)} <small>{applied.label}</small> <button type="button" className="py-promo-remove" onClick={() => setApplied(null)}>Remove</button></> : <span className="py-muted">None</span>}</dd>
        </div>
        <div className="py-lines-total"><dt>Total due today</dt><dd>{formatCentavos(total)}</dd></div>
      </dl>

      {founding && <p className="py-founding-note">{founding.note}</p>}

      {!applied && !founding && (
        <form className="py-promo" onSubmit={(e) => { e.preventDefault(); if (code.trim()) apply(); }}>
          <label htmlFor="py-promo-code">Promo code</label>
          <div>
            <input id="py-promo-code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Enter code" autoComplete="off" maxLength={40} disabled={!canPay && !canPaypal} />
            <button type="submit" disabled={(!canPay && !canPaypal) || pending || !code.trim()}>{pending ? "Checking…" : "Apply"}</button>
          </div>
          {message && <p className="py-promo-msg" role="alert">{message}</p>}
        </form>
      )}

      {canPay && <PayButton itemId={itemId} promo={founding ? undefined : applied?.code} offer={founding ? "founding" : undefined} label={`Pay ${formatCentavos(total)}`} />}
      {canPaypal && <PayButton itemId={itemId} promo={founding ? undefined : applied?.code} offer={founding ? "founding" : undefined} provider="paypal" label="Pay with PayPal" />}
    </div>
  );
}
