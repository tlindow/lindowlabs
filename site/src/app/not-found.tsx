import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 sm:px-6 py-16 text-center font-mono">
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
        Page not found
      </h1>
      <p className="mt-3 text-sm sm:text-base text-muted max-w-md">
        That URL is not on this site.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-mono font-bold transition-all hover:scale-[1.02] active:scale-[0.98] bg-foreground text-background hover:bg-foreground/90 shadow-xs"
      >
        Home
      </Link>
    </main>
  );
}
