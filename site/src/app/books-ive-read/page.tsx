import type { Metadata } from "next";
import { BOOKS_IVE_READ } from "@/data/booksIveRead";

export const metadata: Metadata = {
  title: "Books I've Read | Tyler Lindow",
  description: "Finished books Tyler has read cover to cover.",
  openGraph: {
    title: "Books I've Read | Tyler Lindow",
    description: "Finished books Tyler has read cover to cover.",
    url: "https://lindowlabs.dev/books-ive-read",
    siteName: "Tyler Lindow",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Books I've Read | Tyler Lindow",
    description: "Finished books Tyler has read cover to cover.",
  },
};

export default function BooksIveReadPage() {
  return (
    <main className="min-h-[70vh] px-4 sm:px-6 md:px-8 py-14 sm:py-20 bg-background">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs sm:text-sm font-mono font-bold text-indigo-dark tracking-widest uppercase">
          Reading
        </p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold font-mono tracking-tight text-foreground">
          Books I&apos;ve read
        </h1>
        <p className="mt-3 text-base sm:text-lg font-mono text-muted leading-relaxed">
          Whole books only. Titles and authors.
        </p>

        <ol className="mt-10 sm:mt-12 space-y-6 border-t border-border/70 pt-8">
          {BOOKS_IVE_READ.map((book) => (
            <li key={book.title} className="space-y-1">
              <p className="text-lg sm:text-xl font-mono font-bold text-foreground tracking-tight">
                {book.title}
              </p>
              <p className="text-sm sm:text-base font-mono text-muted">
                {book.author}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
