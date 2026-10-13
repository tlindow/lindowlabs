import type { ClickTagGroup } from "@/lib/clicks/types";
import { learningSignOut } from "@/lib/auth/learningSignOut";

function formatWhen(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });
  } catch {
    return iso;
  }
}

function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}

export default function ClicksDashboard({
  groups,
  store,
  showSignOut,
}: {
  groups: ClickTagGroup[];
  store: "upstash" | "memory" | "sample";
  showSignOut?: boolean;
}) {
  const total = groups.reduce((n, g) => n + g.visits.length, 0);
  const storeLabel =
    store === "upstash"
      ? "Upstash Redis (KV_REST_API_*)"
      : store === "sample"
        ? "sample rows (local bypass, empty store)"
        : "in-memory (KV not configured)";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 md:px-8 pt-10 sm:pt-14 pb-20 sm:pb-28 space-y-10">
        <header className="space-y-3 border-b border-border/70 pb-8">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-muted">
            Lindow Labs
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-foreground">
            Clicks
          </h1>
          <p className="text-sm sm:text-base font-mono text-muted leading-relaxed max-w-2xl">
            Recent page views with outreach query tags. Newest first, grouped by
            tag. Store: {storeLabel}.
          </p>
          <p className="text-xs font-mono text-muted">
            {total} visit{total === 1 ? "" : "s"} · {groups.length} tag
            {groups.length === 1 ? "" : "s"}
          </p>
        </header>

        {groups.length === 0 ? (
          <p className="text-sm font-mono text-muted leading-relaxed">
            No visits recorded yet. Open a public page with{" "}
            <code className="text-foreground">utm_content=...</code> (or{" "}
            <code className="text-foreground">tag=...</code>) after{" "}
            <code className="text-foreground">KV_REST_API_URL</code> and{" "}
            <code className="text-foreground">KV_REST_API_TOKEN</code> are set on
            the Vercel project.
          </p>
        ) : (
          <div className="space-y-10">
            {groups.map((group) => (
              <section key={group.tag} className="space-y-4">
                <h2 className="text-base sm:text-lg font-bold font-mono tracking-tight text-foreground">
                  {group.tag}
                  <span className="ml-2 text-xs font-normal text-muted">
                    {group.visits.length}
                  </span>
                </h2>
                <ul className="space-y-4">
                  {group.visits.map((visit) => (
                    <li
                      key={visit.id}
                      className="space-y-1 border-t border-border/50 pt-3 font-mono text-sm"
                    >
                      <p className="text-foreground font-bold">
                        {formatWhen(visit.ts)}
                      </p>
                      <p className="text-foreground break-all">
                        {visit.path}
                        {visit.query ? `?${visit.query}` : ""}
                      </p>
                      <p className="text-muted text-xs break-all">
                        referrer: {visit.referrer || "(none)"}
                      </p>
                      <p className="text-muted text-xs break-all">
                        ua: {truncate(visit.userAgent || "(none)", 160)}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        {showSignOut ? (
          <form action={learningSignOut} className="pt-4">
            <button
              type="submit"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-mono font-bold text-foreground border border-border hover:border-indigo-dark hover:text-indigo-dark transition-colors"
            >
              Sign out
            </button>
          </form>
        ) : null}
      </div>
    </main>
  );
}
