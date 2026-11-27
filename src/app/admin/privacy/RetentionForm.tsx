"use client";

import { useActionState } from "react";
import { runRetentionAction, type RetentionState } from "./actions";

const INITIAL: RetentionState = { status: "idle", message: "" };

export default function RetentionForm({ pending: due }: { pending: number }) {
  const [state, action, pending] = useActionState(runRetentionAction, INITIAL);
  return (
    <form action={action} className="pv-form">
      {state.status !== "idle" && <p role={state.status === "error" ? "alert" : "status"} className="pv-message" data-status={state.status}>{state.message}</p>}
      <label className="pv-check">
        <input type="checkbox" name="confirm" required />
        <span>I understand this permanently anonymises the records counted above (expired holds are deleted).</span>
      </label>
      <button type="submit" className="adm-topbar-link pv-run" disabled={pending || due === 0}>{pending ? "Running…" : "Run clean-up now"}</button>
    </form>
  );
}
