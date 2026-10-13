/**
 * Client-side page-view logger. Posts to /api/clicks so the server can
 * emit a Vercel Runtime Logs line. Failures are silent; no public UI change.
 */

export type ClickLogPayload = {
  path: string;
  query: string;
  referrer: string;
  userAgent: string;
};

function buildPayload(pathname: string): ClickLogPayload {
  let query = "";
  try {
    query = window.location.search.replace(/^\?/, "");
  } catch {
    query = "";
  }
  return {
    path: pathname || "/",
    query,
    referrer: typeof document !== "undefined" ? document.referrer || "" : "",
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent || "" : "",
  };
}

/** Fire once per client page view. */
export function sendClickLog(pathname: string): void {
  if (typeof window === "undefined") return;

  const body = JSON.stringify(buildPayload(pathname));
  const url = "/api/clicks";

  try {
    if (typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "text/plain" });
      if (navigator.sendBeacon(url, blob)) return;
    }
  } catch {
    // fall through
  }

  try {
    void fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body,
      keepalive: true,
      credentials: "omit",
    }).catch(() => {});
  } catch {
    // silent
  }
}
