// Blank starter.
// Leader + quorum: a value is decided only when a quorum accepts it.
//
// Observe remaining breaks: leader loss, split brain, stale leaders.

export type NodeId = string;

export type Proposal = {
  leader: NodeId;
  value: string;
  term: number;
};

export type Accept = {
  from: NodeId;
  term: number;
  value: string;
};

/** Decide a value only when a quorum of accepts matches the proposal. */
export function decideWithQuorum(
  _proposal: Proposal,
  _accepts: Accept[],
  _quorumSize: number
): string | null {
  // TODO
  return null;
}
