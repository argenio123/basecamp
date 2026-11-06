// Client-safe member types.
export type AuthResult = { status: "idle" | "error"; message: string; fieldErrors?: Record<string, string> };
export const INITIAL_AUTH_RESULT: AuthResult = { status: "idle", message: "" };

/** Member login / sign-up pages. */
export const MEMBER_LOGIN_PATH = "/account/login";
export const MEMBER_SIGNUP_PATH = "/account/signup";
/** Client-readable hint cookie name (mirrors MEMBER_HINT_COOKIE in token.ts, which is server-only). */
export const MEMBER_HINT = "bc_member";

/** "/account/login?next=/contact%3Finterest%3Dyoga" */
export const loginHref = (next: string) => `${MEMBER_LOGIN_PATH}?next=${encodeURIComponent(next)}`;
export const signupHref = (next: string) => `${MEMBER_SIGNUP_PATH}?next=${encodeURIComponent(next)}`;
