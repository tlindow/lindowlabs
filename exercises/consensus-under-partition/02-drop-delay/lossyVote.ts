// Blank starter.
// Same vote idea, but the network may drop or delay messages.
//
// deliver(votes, dropRate, delayMs) -> observed votes at each node
// Observe: two minorities can both think they won.

export type NodeId = string;

export type Vote = {
  from: NodeId;
  value: string;
};

export type NetworkFaults = {
  /** 0..1 chance a vote never arrives. */
  dropRate: number;
  /** Extra delay before a vote is seen (simulation units). */
  delay: number;
};

/** Return the votes each node eventually sees under faults. */
export function deliverUnderFaults(
  _votes: Vote[],
  _recipients: NodeId[],
  _faults: NetworkFaults
): Record<NodeId, Vote[]> {
  // TODO
  return {};
}
