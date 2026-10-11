// Blank starter.
// Majority vote on a perfect network: every message arrives once, in order.
//
// propose(nodes, value) -> decided value when a majority picks the same one

export type NodeId = string;

export type Vote = {
  from: NodeId;
  value: string;
};

/** Run a single round of majority voting. Return the decided value, or null. */
export function majorityVote(_votes: Vote[]): string | null {
  // TODO
  return null;
}
