// Blank starter.
// State machine for one card payment:
//   authorization -> capture -> clearing -> settlement
//
// Export:
//   type PaymentState = ...
//   type PaymentEvent = ...
//   function transition(state, event) -> next state or error

export type PaymentState = never;
export type PaymentEvent = never;

export function transition(
  _state: PaymentState,
  _event: PaymentEvent
): PaymentState {
  throw new Error("not implemented");
}
