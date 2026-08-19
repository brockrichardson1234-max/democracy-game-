# Open Questions

Status: **Commit-1 open-question register for review.**

Questions are categorized so this file does not become a graveyard. Every item states whether it blocks the next architecture commit.

## OQ-001 — Exact post-defeat continuation

**Question:** After the player's administration loses office in GL0, how far does the simulation continue before the proof ends?

**Why it matters:** Must prove inherited state without prematurely designing opposition/successor gameplay.

**Blocks Commit 2?** No.

**Decision deadline:** Before walking-skeleton acceptance criteria are frozen.

**Evidence needed:** Player-agency/legibility review and skeleton pacing.

**Reserved seam:** Player control binding terminates independently from world simulation.

## OQ-002 — Final playable role after GL0

**Question:** In the eventual product, can the user continue as opposition, another officeholder, a successor administration, a party, or spectator/history after leaving office?

**Why it matters:** Major product identity choice, but not required to prove one executive term.

**Blocks Commit 2?** No.

**Decision deadline:** Before post-GL0 campaign/progression design.

**Evidence needed:** Human play after a functioning first term.

**Reserved seam:** Player control binding is not canonical political state.

## OQ-003 — Exact U.S. versus fictionalized first playable content

**Question:** Should the first commercial playable configuration use current real-world U.S. names/data, a historically anchored U.S. start, or a deliberately fictionalized U.S. political scenario?

**Why it matters:** Research burden, legal/political content expectations, balance, replayability, and freshness.

**Blocks Commit 2?** No. Architecture treats U.S. as configuration.

**Decision deadline:** Before production content population.

**Evidence needed:** Product positioning and research plan.

## OQ-004 — Exact term/time granularity

**Question:** What simulation time unit and player-facing advancement cadence best supports legislation, administration, material latency, reporting, and elections?

**Why it matters:** Wrong temporal semantics can create order exploits or passive waiting.

**Blocks Commit 2?** No.

**Decision deadline:** Commit 4 / transition-contract review.

**Evidence needed:** Causal cases and walking-skeleton performance/legibility.

**Reserved seam:** Scheduled effective boundaries and deterministic processes must not depend on wall-clock/UI cadence.

## OQ-005 — Legislative fixture detail

**Question:** How many individual legislators/blocs and which procedural stages should the walking skeleton contain?

**Why it matters:** Must prove discrete political actors and bargaining without building Congress breadth too early.

**Blocks Commit 2?** No.

**Decision deadline:** Commit 3 / walking-skeleton specification.

**Evidence needed:** Political-actors contract and player-agency audit.

## OQ-006 — Negotiation interaction grammar

**Question:** How does the player actually bargain with legislators/coalitions: provision edits, commitments, agenda trades, conversations, strategic offers, or some combination?

**Why it matters:** This could determine whether politics feels like governing or like filling support bars.

**Blocks Commit 2?** No.

**Decision deadline:** Before real GL0 UI implementation; skeleton may use developer controls.

**Evidence needed:** Playable prototype comparison.

**Reserved seam:** Political actors retain independent decision authority; proposal provisions and commitments can change without direct vote control.

## OQ-007 — Housing material-model depth

**Question:** What minimum housing state is required to causally connect grants and projects to affordability without simulating the entire U.S. housing market?

**Why it matters:** Housing can swallow the project if overmodeled, or become a fake modifier if undermodeled.

**Blocks Commit 2?** No.

**Decision deadline:** Before walking-skeleton material-domain implementation.

**Evidence needed:** Causality audit and second-domain comparison.

**Current candidate:** regional housing stock, demand/households, vacancy/utilization pressure, construction pipeline/capacity, income-relative affordability pressure.

## OQ-008 — State fixture count and variance

**Question:** How many synthetic state fixtures are enough for the walking skeleton, and which structural differences matter?

**Why it matters:** Must prove cooperation/refusal/capacity and reusable jurisdiction primitives without content bloat.

**Blocks Commit 2?** No.

**Decision deadline:** Commit 3 / skeleton spec.

**Evidence needed:** Federalism and extensibility audit.

**Current candidate:** three states — one willing/capable, one refusing, one participating but capacity-constrained; at least one structurally different legislature in architecture tests.

## OQ-009 — Exact knowledge/polling uncertainty model

**Question:** How are uncertainty, polling error, staff estimates, and measurement revisions represented to the player?

**Why it matters:** The player must reason under uncertainty without being blind or receiving debug truth.

**Blocks Commit 2?** No.

**Decision deadline:** Commit 4 and player-legibility audit.

**Evidence needed:** Information contract + skeleton UI proof.

## OQ-010 — Electorate implementation representation

**Question:** Weighted synthetic particles, sparse joint distributions, or hybrid?

**Why it matters:** Correlation, memory, performance, explainability, and geographic aggregation.

**Blocks Commit 2?** No. The semantic requirement is intentionally implementation-open.

**Decision deadline:** Walking-skeleton population implementation benchmark.

**Evidence needed:** Determinism, performance, explainability, and correlation tests.

## OQ-011 — Authoritarian/anti-democratic playable breadth

**Question:** Which democratic-erosion and authoritarian strategies become actual player capabilities, and at what development stage?

**Why it matters:** Potentially core to the long-term political simulation but large enough to distort GL0 if implemented now.

**Blocks Commit 2?** No.

**Decision deadline:** After normal democratic governing loop and contested-authority skeleton route work.

**Evidence needed:** Architecture stress tests plus product design.

**Reserved seam:** contested authority, actor-specific compliance, persistent constitutional/legal history, elections/office assignment, information, and institutional response.

## OQ-012 — Court/judiciary resolution depth

**Question:** What minimum legal-contest model should the walking skeleton use?

**Why it matters:** Needs to prove attempted action versus legal validity and scoped orders without building full litigation.

**Blocks Commit 2?** No.

**Decision deadline:** Commit 3.

**Evidence needed:** Judiciary contract and contested-authority route.

## OQ-013 — Exact public-facing Democracy-like shell

**Question:** Which national dashboard/navigation conventions survive once canonical architecture is known?

**Why it matters:** Accessibility and familiarity matter, but UI must adapt to the real ontology rather than own it.

**Blocks Commit 2?** No.

**Decision deadline:** Before polished GL0 UI work.

**Evidence needed:** Player-agency/legibility testing.

## OQ-014 — Second-domain probe

**Question:** Is unemployment insurance the best early generality probe, or should another non-housing domain be used?

**Why it matters:** Architecture must prove it is not a disguised housing engine.

**Blocks Commit 2?** No.

**Decision deadline:** Before walking-skeleton architecture acceptance.

**Current candidate:** unemployment insurance because it stresses eligibility, labor-market state, household income, administration, and automatic/rule-driven fiscal flows rather than construction stock.

## OQ-015 — Current game/repo name

**Question:** What is the actual product/project name?

**Why it matters:** `democracy-game-` is a repository placeholder, not a product identity.

**Blocks Commit 2?** No.

**Decision deadline:** Before external presentation/branding work.
