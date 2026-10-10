/**
 * Default Already read shelf for the owner when storage has never been
 * initialized. Whole books only (partial reads do not count).
 */

export type AlreadyReadEntry = {
  id: string;
  title: string;
  author: string;
  /** e.g. "whole book" or "chapters 1-4". */
  howMuch: string;
  note: string;
};

export const OWNER_ALREADY_READ_SEED: AlreadyReadEntry[] = [
  {
    id: "mindstorms-papert",
    title: "Mindstorms",
    author: "Seymour Papert",
    howMuch: "whole book",
    note: "",
  },
  {
    id: "how-learning-works-ambrose",
    title: "How Learning Works",
    author: "Ambrose et al.",
    howMuch: "whole book",
    note: "",
  },
  {
    id: "design-of-everyday-things-norman",
    title: "The Design of Everyday Things",
    author: "Don Norman",
    howMuch: "whole book",
    note: "",
  },
];
