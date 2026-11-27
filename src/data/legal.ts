// Legal pages (/privacy, /terms): review status and the details the business or its lawyer still has to supply.
// Both pages read from here, so the draft banner and the placeholders change in one place.

/**
 * Set to true once the privacy officer and legal adviser have approved BOTH texts. While false, /privacy and /terms
 * open with a visible "Draft, under legal review" notice.
 */
export const LEGAL_REVIEW_DONE = false;

/** Date both texts were last changed (ISO), and how it is shown on the pages. */
export const LEGAL_LAST_UPDATED = "2026-11-27";
export const LEGAL_LAST_UPDATED_LABEL = "27 November 2026";

/** Data Protection Officer's name. Empty until the Governor's office appoints one: the page then says "To be appointed". */
export const DPO_NAME = "";

export const PRIVACY_PATH = "/privacy";
export const TERMS_PATH = "/terms";
