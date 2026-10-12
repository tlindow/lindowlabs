/**
 * Public finished-books list for /books-ive-read ("Other books").
 * Titles, authors, and self-hosted cover paths only. Nothing from the
 * private /learning curriculum.
 */

export type BookIveRead = {
  title: string;
  author: string;
  /** Path under site/public (Open Library-by-ISBN, self-hosted). */
  coverSrc: string;
};

export const BOOKS_IVE_READ: BookIveRead[] = [
  {
    title: "Mindstorms",
    author: "Seymour Papert",
    coverSrc: "/book-mindstorms.jpg",
  },
  {
    title: "How Learning Works",
    author: "Ambrose et al.",
    coverSrc: "/book-how-learning-works.jpg",
  },
  {
    title: "The Design of Everyday Things",
    author: "Don Norman",
    coverSrc: "/book-don-norman.jpg",
  },
  {
    title: "The Life-Changing Magic of Tidying Up",
    author: "Marie Kondo",
    coverSrc: "/book-marie-kondo.jpg",
  },
];

/** Public page + philosophy link label (URL stays /books-ive-read). */
export const OTHER_BOOKS_LABEL = "Other books";
