/**
 * Public Beginner site URL.
 * Swap this one string when the domain moves; import it everywhere else.
 */
export const BEGINNER_URL = "https://www.beginner.work";

/** hāpi product page on the Beginner site. */
export const BEGINNER_HAPI_URL = `${BEGINNER_URL}/hapi`;

/** Hostname without scheme (for UI chrome that shows a domain). */
export const BEGINNER_HOST = BEGINNER_URL.replace(/^https?:\/\//, "");

/**
 * Private Lindow Labs Learning dashboard.
 * Import this constant wherever the /learning URL must be referenced.
 */
export const LEARNING_DASHBOARD_URL = "https://lindowlabs.dev/learning";
