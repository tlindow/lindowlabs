import type { Metadata } from "next";
import { BOOKS_IVE_READ, OTHER_BOOKS_LABEL } from "@/data/booksIveRead";

export const metadata: Metadata = {
  title: "Other books | Tyler Lindow",
  description: "Finished books Tyler has read cover to cover.",
  openGraph: {
    title: "Other books | Tyler Lindow",
    description: "Finished books Tyler has read cover to cover.",
    url: "https://lindowlabs.dev/books-ive-read",
    siteName: "Tyler Lindow",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Other books | Tyler Lindow",
    description: "Finished books Tyler has read cover to cover.",
  },
};

/** Same cover chrome as Footer philosophy book (radius, shadow, spine). */
const COVER_FRAME_CLASS =
  "relative h-[80%] aspect-[351/500] rounded-r-md rounded-l-xs shadow-xl border border-border/70 overflow-hidden bg-sand";

export default function BooksIveReadPage() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <main className="min-h-[70vh] px-4 sm:px-6 md:px-8 py-14 sm:py-20 bg-background">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs sm:text-sm font-mono font-bold text-indigo-dark tracking-widest uppercase">
          Reading
        </p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold font-mono tracking-tight text-foreground">
          {OTHER_BOOKS_LABEL}
        </h1>

        <ul className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 border-t border-border/70 pt-8 list-none">
          {BOOKS_IVE_READ.map((book) => {
            const coverSrc = `${basePath}${book.coverSrc}`;
            const alt = `${book.title} by ${book.author}`;
            return (
              <li
                key={book.title}
                className="flex flex-col items-center text-center gap-4"
                data-book={book.title}
              >
                <div className="relative flex items-center justify-center w-full max-w-md aspect-[16/10] rounded-2xl border border-border bg-surface overflow-hidden shadow-2xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverSrc}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20 scale-125 pointer-events-none"
                  />
                  <div className={COVER_FRAME_CLASS}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={coverSrc}
                      alt={alt}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                    <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-r from-black/25 via-black/10 to-transparent pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-lg sm:text-xl font-mono font-bold text-foreground tracking-tight">
                    {book.title}
                  </p>
                  <p className="text-sm sm:text-base font-mono text-muted">
                    {book.author}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
