import {
  learningAppTiles,
  learningExercises,
  learningReadings,
} from "@/data/learningDashboard";
import { outreachList } from "@/data/outreach";
import { learningSignOut } from "@/lib/auth/learningSignOut";

function SectionHeading({
  title,
  support,
}: {
  title: string;
  support?: string;
}) {
  return (
    <header className="space-y-2">
      <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground font-mono">
        {title}
      </h2>
      {support ? (
        <p className="text-sm font-mono text-muted leading-relaxed max-w-2xl">
          {support}
        </p>
      ) : null}
    </header>
  );
}

export function LearningNotConfigured() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 py-16">
      <div className="max-w-lg w-full space-y-4 text-center">
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-muted">
          Lindow Labs Learning
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold font-mono text-foreground tracking-tight">
          Sign-in not configured yet
        </h1>
        <p className="text-sm sm:text-base font-mono text-muted leading-relaxed">
          Stytch sign-in needs{" "}
          <code className="text-foreground">STYTCH_PROJECT_ID</code> and{" "}
          <code className="text-foreground">STYTCH_SECRET</code> in the Vercel
          project env (same Stytch project as Tinker). Until those are set,
          this dashboard stays closed.
        </p>
      </div>
    </main>
  );
}

export function LearningUnauthorized({ phone }: { phone: string | null }) {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 py-16">
      <div className="max-w-lg w-full space-y-5 text-center">
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-muted">
          Lindow Labs Learning
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold font-mono text-foreground tracking-tight">
          Not authorized
        </h1>
        <p className="text-sm sm:text-base font-mono text-muted leading-relaxed">
          {phone
            ? "This number is signed in, but it is not allowed to open the learning dashboard."
            : "This Stytch session is signed in, but no allowlisted phone is attached to the user."}
        </p>
        <form action={learningSignOut} className="pt-2">
          <button
            type="submit"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-mono font-bold text-foreground border border-border hover:border-indigo-dark hover:text-indigo-dark transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  );
}

export default function LearningDashboard({
  phone,
  bypass,
}: {
  phone: string | null;
  bypass: boolean;
}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 md:px-8 pt-10 sm:pt-14 pb-20 sm:pb-28 space-y-14 sm:space-y-16">
        <header className="space-y-3 border-b border-border/70 pb-8 sm:pb-10">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-muted">
            Lindow Labs
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-foreground">
            Learning
          </h1>
          <p className="text-sm sm:text-base font-mono text-muted leading-relaxed max-w-2xl">
            Private desk for outreach, exercises, readings, and the tools that
            keep the week moving.
          </p>
          {phone ? (
            <p className="text-xs font-mono text-muted pt-1">
              Signed in
              {bypass ? " (auth bypass)" : ""}
            </p>
          ) : null}
          {!bypass ? (
            <form action={learningSignOut} className="pt-2">
              <button
                type="submit"
                className="text-xs font-mono text-muted hover:text-foreground transition-colors underline underline-offset-2"
              >
                Sign out
              </button>
            </form>
          ) : null}
        </header>

        <section className="space-y-5" aria-labelledby="outreach-heading">
          <SectionHeading
            title="Outreach"
            support="Apollo-managed list. Beacon will sync rows here later."
          />
          {outreachList.length === 0 ? (
            <p
              id="outreach-heading"
              className="text-sm font-mono text-muted border-t border-border/70 pt-5"
            >
              No outreach rows yet. The list is empty until Beacon syncs Apollo.
            </p>
          ) : (
            <ul
              id="outreach-heading"
              className="divide-y divide-border/70 border-t border-border/70"
            >
              {outreachList.map((item) => (
                <li
                  key={`${item.name}-${item.company ?? ""}`}
                  className="py-3.5 sm:py-4 flex flex-col gap-1"
                >
                  <span className="text-sm sm:text-base font-mono font-bold text-foreground">
                    {item.name}
                  </span>
                  {item.company ? (
                    <span className="text-xs sm:text-sm font-mono text-muted">
                      {item.company}
                    </span>
                  ) : null}
                  {item.note ? (
                    <span className="text-xs sm:text-sm font-mono text-muted">
                      {item.note}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-5" aria-labelledby="exercises-heading">
          <SectionHeading
            title="Exercises and readings"
            support="Repo katas plus the books currently on the desk."
          />
          <div
            id="exercises-heading"
            className="space-y-8 border-t border-border/70 pt-5"
          >
            <div className="space-y-3">
              <h3 className="text-sm font-mono font-bold text-foreground">
                Exercises
              </h3>
              <ul className="divide-y divide-border/70 border-t border-border/70">
                {learningExercises.map((exercise) => (
                  <li key={exercise.slug} className="py-3.5 sm:py-4">
                    <a
                      href={exercise.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm sm:text-base font-mono text-foreground hover:text-indigo-dark transition-colors leading-snug"
                    >
                      {exercise.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-mono font-bold text-foreground">
                Readings
              </h3>
              <ul className="divide-y divide-border/70 border-t border-border/70">
                {learningReadings.map((reading) => (
                  <li
                    key={reading.title}
                    className="py-3.5 sm:py-4 flex flex-col gap-1"
                  >
                    <span className="text-sm sm:text-base font-mono font-bold text-foreground">
                      {reading.title}
                    </span>
                    <span className="text-xs sm:text-sm font-mono text-muted">
                      {[reading.author, reading.note]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-5" aria-labelledby="apps-heading">
          <SectionHeading
            title="Apps"
            support="Open in a new tab. Grok Bot uses the Switchboard deep link from Tinker."
          />
          <ul
            id="apps-heading"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 border-t border-border/70 pt-5"
          >
            {learningAppTiles.map((tile) => (
              <li key={tile.id}>
                <a
                  href={tile.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-4 sm:px-5 sm:py-5 border border-border hover:border-indigo-dark transition-colors"
                >
                  <span className="block text-sm sm:text-base font-mono font-bold text-foreground">
                    {tile.label}
                  </span>
                  <span className="block mt-1 text-xs font-mono text-muted">
                    {tile.description}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
