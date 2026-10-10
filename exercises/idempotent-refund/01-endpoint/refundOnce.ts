// Blank starter.
// Same refund twice refunds once.
//
// refundOnce(store, request) -> RefundResult
//
// Request ideas:
//   idempotencyKey  - caller-supplied key for this refund attempt
//   paymentId       - payment being refunded
//   amountCents     - amount to refund
//
// Store ideas (in-memory map is fine for the exercise):
//   get(key) / set(key, result)

export type RefundRequest = {
  idempotencyKey: string;
  paymentId: string;
  amountCents: number;
};

export type RefundResult = {
  refundId: string;
  paymentId: string;
  amountCents: number;
  replayed: boolean;
};

export type RefundStore = {
  get: (key: string) => RefundResult | undefined;
  set: (key: string, value: RefundResult) => void;
};

export function refundOnce(
  _store: RefundStore,
  _request: RefundRequest
): RefundResult {
  throw new Error("not implemented");
}
