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
 * Private Lindow Labs Learning dashboard (Vercel SSR + Stytch).
 * lindowlabs.dev still points at GitHub Pages (static stub); Login must
 * hit the Vercel host until the custom domain is moved to the SSR project.
 */
export const LEARNING_DASHBOARD_URL =
  "https://lindowlabs.vercel.app/learning";


/** Current public resume PDF in site/public (synced from Drive). */
export const RESUME_PDF_PATH = "/Tyler_Lindow_Resume.pdf";

/** Suggested download filename for the public resume PDF. */
export const RESUME_PDF_DOWNLOAD_NAME = "Tyler_Lindow_Resume.pdf";
