// Blank starter.
// Binary search over sorted settlement records.
//
// findSettlement(records, targetId) -> record | null
// records must already be sorted by settlementId ascending.

export type SettlementRecord = {
  settlementId: string;
  merchantId: string;
  amountCents: number;
  settledAt: string;
};

export function findSettlement(
  _records: SettlementRecord[],
  _targetId: string
): SettlementRecord | null {
  throw new Error("not implemented");
}
