"use client";

import Link from "next/link";
import { useActionState } from "react";
import { bookSession, type BookResult } from "@/lib/bookings/actions";

const INITIAL: BookResult = { status: "idle", message: "" };

/** Posts the session (slot + date) to bookSession: confirms a free booking, or holds the spot and opens checkout. */
export default function BookButton({ slotId, date, label, provider = "paymongo" }: { slotId: string; date: string; label: string; provider?: "paymongo" | "paypal" }) {
  const [state, action, pending] = useActionState(bookSession, INITIAL);
  return (
    <form action={action} className="py-form">
      <input type="hidden" name="slot" value={slotId} />
      <input type="hidden" name="date" value={date} />
      <input type="hidden" name="provider" value={provider} />
      {state.status === "error" && (
        <p className="py-error" role="alert">
          {state.message}
          {state.href && <> <Link className="py-link" href={state.href}>{state.hrefLabel ?? "Continue"}</Link></>}
        </p>
      )}
      <button type="submit" className={`py-button${provider === "paypal" ? " py-button--paypal" : ""}`} disabled={pending} aria-disabled={pending}>
        {pending ? "Booking…" : label}
        {!pending && <span aria-hidden="true">→</span>}
      </button>
    </form>
  );
}
