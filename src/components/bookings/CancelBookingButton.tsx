"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { cancelMyBooking, type CancelResult } from "@/lib/bookings/actions";

const INITIAL: CancelResult = { status: "idle", message: "" };

/** Cancels the member's booking (frees the spot) after a confirm() prompt, then refreshes the page. */
export default function CancelBookingButton({ bookingId, label = "Cancel booking", className = "bk-cancel" }: { bookingId: string; label?: string; className?: string }) {
  const [state, action, pending] = useActionState(cancelMyBooking, INITIAL);
  const router = useRouter();
  useEffect(() => { if (state.status === "done") router.refresh(); }, [state, router]);
  return (
    <form action={action} className="bk-cancel-form" onSubmit={(e) => { if (!window.confirm("Cancel this booking? Your spot goes to someone else.")) e.preventDefault(); }}>
      <input type="hidden" name="booking" value={bookingId} />
      <button type="submit" className={className} disabled={pending}>{pending ? "Cancelling…" : label}</button>
      {state.message && <p className={state.status === "error" ? "bk-msg bk-msg--error" : "bk-msg"} role="status">{state.message}</p>}
    </form>
  );
}
