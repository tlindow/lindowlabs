/**
 * Public finished-books list for /books-ive-read.
 * Titles and authors only — nothing from the private /learning curriculum.
 */

export type BookIveRead = {
  title: string;
  author: string;
};

export const BOOKS_IVE_READ: BookIveRead[] = [
  { title: "Mindstorms", author: "Seymour Papert" },
  { title: "How Learning Works", author: "Ambrose et al." },
  { title: "The Design of Everyday Things", author: "Don Norman" },
  {
    title: "The Life-Changing Magic of Tidying Up",
    author: "Marie Kondo",
  },
];
