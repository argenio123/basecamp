// Filipino draft of the one user-facing string in src/data/legal.ts. The flags, ISO date, DPO name and paths are not
// text (use the English module). The /privacy and /terms page bodies live in their page files, not in src/data.
import type * as EN from "@/data/legal";
import type { Localized } from "../localized";

export const LEGAL_LAST_UPDATED_LABEL: Localized<typeof EN.LEGAL_LAST_UPDATED_LABEL> = "27 Nobyembre 2026";
