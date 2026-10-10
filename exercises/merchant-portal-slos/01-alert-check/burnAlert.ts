// Blank starter.
// Decide whether to page when error-budget burn is too fast.
//
// burnAlert(input) -> { page: boolean; reason: string }
//
// Input ideas (pick what you need):
//   budgetRemaining  - fraction of monthly budget left (0..1)
//   burnRate         - how fast budget is being spent vs a 1x steady pace
//   windowMinutes    - short window you are evaluating

export type BurnInput = {
  budgetRemaining: number;
  burnRate: number;
  windowMinutes: number;
};

export type BurnDecision = {
  page: boolean;
  reason: string;
};

export function burnAlert(_input: BurnInput): BurnDecision {
  throw new Error("not implemented");
}
