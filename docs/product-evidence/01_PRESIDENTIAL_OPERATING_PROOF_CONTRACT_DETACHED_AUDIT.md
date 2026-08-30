# Presidential Operating Proof 0 — Detached Contract Audit

Status: **DETACHED PRODUCT-EVIDENCE AUDIT. NOT IMPLEMENTATION, RUNTIME, UI, SCHEMA, ROADMAP, EARLY-ACCESS, OR PRODUCT AUTHORITY.**

Audited candidate:

- `docs/product-evidence/00_PRESIDENTIAL_OPERATING_PROOF_EXECUTABLE_CONTRACT.md`
- candidate commit: `55717b37475d747cf2ca1b18630b8bddff2aee96`
- accepted production parent: `44c1724962830225e6fc34f41d0df0cfdb7dfec0`

Controlling external authority:

- presidential-game and Living Country closure: `46f0a035ac529ed96a9dee5c9daa060d25e6886f`
- implementation preflight: `7d144c2930ef5b6ef62d8ec8e3ec09f0c4aaf613`

Audit question:

> Does this contract define a production-shaped, discardable-if-wrong but gradable-if-right presidential operating proof that can begin at POP0-I1 without importing Stage 1, duplicating canonical state, wrapping the I10 orchestration monolith, scripting autonomous politics, or weakening the accepted ownership and bounded-knowledge rules?

---

# Verdict

## **REVISE — 2 blocking findings, 3 bounded clarifications**

The contract has the correct product target, scope protection, clean branch ancestry, concurrent thread set, graduation rule, operating components, playtest gate, and failure conditions.

It is close to implementation-ready.

Two architecture/proof loopholes remain large enough that coding POP0-I1 now could create exactly the temporary second architecture the contract is intended to prevent.

---

# RPOP0-01 — BLOCKING: the proof can still wrap the entire I10 session as a child engine

## Gap

The candidate says:

- preserve `createProductionGameSession()` and I10 as regression;
- build a separate presidential operating factory;
- reference existing owner states;
- avoid expanding `integrated-session.ts`;
- keep one canonical fact state.

But it does not explicitly prohibit this implementation:

```text
PresidentialOperatingProofSession
  ├─ embedded IntegratedPartialRuntimeSession / I10 save
  ├─ new administration state
  ├─ new attention/workstream state
  └─ new UI projections
```

The wrapper could operate Housing, Congress, implementation, courts, and time by calling:

```text
getProductionGameView()
availablePlayerActions
dispatchPlayerCommand(actionId)
advanceProductionWorld()
```

while adding the new offices and UI beside it.

That technically preserves one copy of each existing fact and leaves I10 tests green, but it makes the commercial candidate depend on:

- the old global action list;
- fixture-specific command IDs;
- the existing monolithic save parser;
- the I10 route-stage composition;
- `ProductionGameView` as an upstream source of truth.

The result would be a new sidecar wrapped around the exact orchestration layer the preflight says must not graduate.

## Why blocking

POP0-I1 is the composition and regression-shell increment. If this boundary is not closed before coding, the easiest implementation can pass the shell milestone while creating permanent architectural debt.

Later removing the nested I10 session would require replacing the proof’s state, save, advancement, and owner-adapter foundation.

## Required repair

The contract must require:

1. The proof composition may not embed, serialize, or treat `IntegratedPartialRuntimeSession`, `ProductionGameView`, `availablePlayerActions`, `dispatchPlayerCommand`, or the format-11 I10 save as a canonical child engine or domain-owner API.
2. Existing functionality is reused through lower-level owner states/transitions or narrow typed adapters over those owners.
3. A narrow adapter may translate between accepted owner semantics and the new coordinator, but may not own duplicate state, call route action IDs, infer state from player projections, or contain proof chronology.
4. The POP-0 save serializes the proof’s canonical owner states and operating state directly; it may not store an opaque synchronized I10 save as the world underneath the proof.
5. I10 remains a separately instantiated regression fixture. It does not advance in lockstep with the proof.
6. POP0-I1 must include tests or import rules proving that the new composition does not depend on the legacy session/player-command surface.

---

# RPOP0-02 — BLOCKING: “autonomous” proof beats are not yet falsified against scripted sequencing

## Gap

The candidate correctly states that:

- Congress initiates the employment proposal;
- governors, organizations, and media act independently;
- no dramatic director may create attention;
- cards over scripted outcomes fail.

But the executable gate does not distinguish clearly enough between legitimate configured facts and pre-authored actor outcomes.

A developer could configure this ordered beat list:

```text
Feb 8: plant closure
Feb 12: senators introduce bill
Feb 15: governor requests aid
Feb 19: local outlet publishes
Mar 1: national outlet covers
Mar 6: White House escalation
```

Each event could be stored under the nominally correct actor owner. The proof would show concurrency and non-presidential origins while still being a screenplay.

The current representative traces vary player choices, but they do not require perturbing the evidence, actor state, or institutional opportunity that produces the autonomous initiatives.

## Why blocking

A central proof claim is that autonomous institutions and media create situations from reusable rules. If Congress’s proposal, governor reaction, outlet publication, or escalation is merely scheduled content, the proof does not demonstrate the product’s core operating fantasy.

## Required repair

The contract must distinguish:

### Legitimately configurable

- opening stocks and relationships;
- plant closure decision/occurrence already made by its owner;
- statutory or procedural deadlines;
- scheduled measurement collection and release dates;
- office assignments and standing instructions;
- preexisting Housing records;
- available actor objectives, evidence, resources, and opportunities.

### Must be owner-derived during the proof

- congressional proposal adoption/introduction;
- governor and organization response;
- outlet investigation/publication choice;
- White House office interpretation and escalation;
- recipient response to presidential acts.

At least one reproducible no-screenplay counterfactual must:

- remove, delay, weaken, or alter a load-bearing evidence/actor/opportunity input;
- show the relevant non-player initiative changes, delays, narrows, or does not occur;
- preserve unrelated state;
- create no substitute event to maintain drama.

The final test matrix should explicitly reject actor-choice calendars masquerading as autonomy.

---

# CPOP0-03 — modeled downstream stubs need an information route before affecting beliefs

The candidate says modeled/bounded household-income, coverage, and fiscal estimates may affect staff recommendations and political actors’ beliefs.

Clarify:

> An analysis-only stub is an evidence or assessment artifact with producer, sources, time, support, uncertainty, and scope. It may influence a person or office only after valid receipt and interpretation. It may not directly mutate actor belief, public cognition, option availability, or political pressure merely because the estimate exists.

This follows Steps 7–9 and is nonblocking once stated.

---

# CPOP0-04 — the configured opening fixture needs explicit synthetic-root provenance

The proof is openly nonhistorical and does not need generated 2024–2029 prehistory.

However, load-bearing opening facts must still be coherent. Clarify that:

- every opening office assignment, relationship, commitment, Housing authority/payment/project state, hidden agency problem, monitoring product, and congressional procedural condition has one configured synthetic-fixture root or inherited accepted owner record;
- the opening briefing is derived from those facts;
- fixture roots may terminate causal recursion for POP-0 but must be labeled as configured proof roots;
- a UI sentence, card field, or desired opening choice cannot itself serve as provenance;
- configured opening state must reconcile across law, finance, administration, Housing, actors, dates, and information possession.

This prevents a handcrafted narrative prologue while avoiding premature prehistory work.

---

# CPOP0-05 — acceptance must authorize POP0-I1 only, with an increment gate

The candidate ends with “implementation may begin with POP0-I1 only,” but the implementation sequence could still be read as one continuous authorization through I7.

The authority receipt should lock:

- acceptance of the executable contract authorizes **POP0-I1 only**;
- POP0-I1 produces a candidate implementation commit or bounded commit chain;
- POP0-I1 receives its own detached review against its stated question and required results before I2 begins;
- later increments remain planned proof stages, not pre-authorized code scope;
- any change to the accepted contract requires an explicit amendment rather than silent goalpost movement during implementation.

---

# What passes cleanly

The following portions are strong and should remain unchanged:

1. clean branch rooted directly at `44c172...`;
2. explicit exclusion of Stage 1 ancestry and implementation;
3. I10 preserved as regression rather than discarded;
4. one-world/no-duplicate-state invariant;
5. 90-day configured product proof clearly separated from generated prehistory and EA scope;
6. identifiable administration offices and distinct institutional voices;
7. four concurrent threads stressing different presidential functions;
8. inherited Housing treated as background work rather than the whole game;
9. serious quiet condition allowed to remain outside Attention;
10. concrete OMB/economic queue collision rather than a universal resource;
11. escalation-owned Attention and explicit empty Attention state;
12. visible typed presidential instruments and no hidden fan-out;
13. recipient-owned delivery and response;
14. evidence vintage/revision and bounded knowledge requirements;
15. cross-owner Historical Record as index rather than duplicate truth;
16. versioned operating save intended to graduate;
17. prohibition on UI-only fake state;
18. explicit analysis-only stubs instead of fake material effects;
19. representative counterfactual player traces;
20. automated plus subjective playtest acceptance;
21. explicit REVISE/REJECT outcomes;
22. proof-scope protection: narrow experiment, broad product.

---

# Repository integrity

Verified at audit time:

- branch: `implementation/presidential-operating-proof-0`;
- candidate tip: `55717b37475d747cf2ca1b18630b8bddff2aee96`;
- exact parent/merge base: `44c1724962830225e6fc34f41d0df0cfdb7dfec0`;
- candidate change: one documentation file only;
- Stage 1 source/artifacts absent;
- `main` unchanged at `44c1724962830225e6fc34f41d0df0cfdb7dfec0`.

No runtime, source, schema, UI, test, configuration, or data change is recommended before the repair passes.

---

# Required disposition

Preserve one bounded repair covering RPOP0-01, RPOP0-02, and CPOP0-03 through CPOP0-05.

Then rerun this unchanged binary question:

> Does the repaired contract define a production-shaped, discardable-if-wrong but gradable-if-right presidential operating proof that can begin at POP0-I1 without importing Stage 1, duplicating canonical state, wrapping the I10 orchestration monolith, scripting autonomous politics, or weakening the accepted ownership and bounded-knowledge rules?

Do not begin POP0-I1 before PASS and a separate authority receipt.
