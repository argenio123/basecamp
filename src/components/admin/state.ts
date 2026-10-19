// Result shapes shared by admin Server Actions (src/app/admin/actions.ts) and their client forms.
// Kept out of the 'use server' file, which may only export async functions.
import type { ValidationError } from "@/content/validate";

export type LoginState = { error: string };
export const INITIAL_LOGIN_STATE: LoginState = { error: "" };

export type SaveState = {
  ok: boolean;
  savedAt?: string;
  reset?: boolean;
  conflict?: boolean;
  error?: string;
  errors?: ValidationError[];
};
export const INITIAL_SAVE_STATE: SaveState = { ok: false };
