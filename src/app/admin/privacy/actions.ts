"use server";
// Admin → Privacy: run the retention clean-up on demand. requireAdmin() first, audited (counts only).
import { revalidatePath } from "next/cache";
import { audit } from "@/lib/auth/audit";
import { requireAdmin } from "@/lib/auth/session";
import { runRetention, type RetentionReport } from "@/lib/privacy/retention";
import { StorageUnavailableError } from "@/lib/storage/driver";

export type RetentionState = { status: "idle" | "done" | "error"; message: string; report?: RetentionReport };

export async function runRetentionAction(_prev: RetentionState, formData: FormData): Promise<RetentionState> {
  const session = await requireAdmin();
  if (formData.get("confirm") !== "on") return { status: "error", message: "Tick the box to confirm before running the clean-up." };
  try {
    const report = await runRetention({ dryRun: false });
    audit(session, "privacy.retention", { leadsAnonymised: report.leadsAnonymised, paymentsStripped: report.paymentsStripped });
    revalidatePath("/admin/privacy");
    return { status: "done", message: `Done: ${report.leadsAnonymised} lead(s) anonymised, ${report.paymentsStripped} unpaid payment record(s) stripped.`, report };
  } catch (error) {
    return { status: "error", message: error instanceof StorageUnavailableError ? error.message : "The clean-up didn't finish. It is safe to run it again." };
  }
}
