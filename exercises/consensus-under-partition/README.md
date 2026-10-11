# Consensus under partition

**/learning curriculum #5** (*Designing Data-Intensive Applications* 2nd ed.,
Ch 9 and 10): a few simulated nodes must agree on one value while the network
drops and delays messages. Steps build from naive voting to a leader/quorum
approach, then you observe where each design breaks.

Start in plain English, then encode the simulation one milestone at a time.
Practice files start blank on purpose.

1. Step **00**: write [`00-in-plain-english/agreement.md`](./00-in-plain-english/agreement.md).
2. Step **01**: naive majority vote with a perfect network.
3. Step **02**: the same vote while messages drop and delay.
4. Step **03**: leader + quorum; watch where it still breaks.

Machine-readable step list: [`steps.json`](./steps.json).

## Steps

| Step | Folder | What you add |
| :--- | :--- | :--- |
| 00 | `00-in-plain-english/` | What "agree" means when nodes can't all hear each other |
| 01 | `01-naive-vote/` | Majority vote on a perfect network |
| 02 | `02-drop-delay/` | Same vote with drops and delays |
| 03 | `03-leader-quorum/` | Leader + quorum; note remaining failure modes |

## Done when

- `agreement.md` states what a correct outcome is (and is not) under partition.
- Each code step exports a small simulation you can run locally and breaks in the
  way the step README asks you to observe.
