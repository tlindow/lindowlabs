/**
 * Default Already read shelf for the owner when storage has never been
 * initialized. Whole books only (partial reads do not count).
 * Public titles/authors also appear on /books-ive-read (Other books); this seed adds
 * private shelf fields (id, howMuch, note) only.
 */

import { BOOKS_IVE_READ } from "@/data/booksIveRead";

export type AlreadyReadEntry = {
  id: string;
  title: string;
  author: string;
  /** e.g. "whole book" or "chapters 1-4". */
  howMuch: string;
  note: string;
};

const SEED_IDS = [
  "mindstorms-papert",
  "how-learning-works-ambrose",
  "design-of-everyday-things-norman",
  "life-changing-magic-tidying-up-kondo",
] as const;

export const OWNER_ALREADY_READ_SEED: AlreadyReadEntry[] = BOOKS_IVE_READ.map(
  (book, index) => ({
    id: SEED_IDS[index] ?? `book-${index}`,
    title: book.title,
    author: book.author,
    howMuch: "whole book",
    note: "",
  })
);
