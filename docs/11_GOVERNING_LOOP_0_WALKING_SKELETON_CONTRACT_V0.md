# 11 — Governing Loop 0 Walking Skeleton Contract V0

Status: **Commit-5 architecture candidate for review. Not implementation authority.**

## 1. Purpose

Commits 1–4 established player/control semantics, causal ownership, government/legal/political actors, population/electorate, information/belief, and simulation-time semantics. `10_HOUSING_MATERIAL_DOMAIN_V0.md` closes the first material domain.

This document freezes the smallest executable proof that can demonstrate the architecture works as a game loop rather than as disconnected contracts.

It is a **walking-skeleton contract**, not a runtime design and not a content roadmap.

## 2. Authority

The skeleton must obey all accepted Commit-1–4 invariants and the Commit-5 housing invariants. It may choose deliberately simple fixture values and deterministic rules where architecture does not require realism.

No skeleton simplification may collapse semantic owners merely to make implementation easier.

### Candidate hard invariant WS-01

**The walking skeleton may simplify content, scale, formulas, and actor reasoning, but it may not simplify away an ownership boundary or causal stage whose separation is part of accepted Architecture V0.**

## 3. Required world fixture

The executable fixture must contain, at minimum:

- one synthetic federal jurisdiction;
- one executive administration and current executive officeholder;
- one GL0 `ControlBinding` over the administration strategic decision surface;
- one legislature with individually resolved causally discrete votes;
- one federal administrative institution capable of operating the housing-grant program;
- treasury/public-finance and fiscal-execution state sufficient for appropriation, obligation, and disbursement distinctions;
- three synthetic state jurisdictions with meaningfully different participation/capacity behavior;
- one minimal judicial institution and legal-contest route;
- canonical geography sufficient to locate population, states, housing regions, and the election constituency;
- one aggregate/correlation-preserving ordinary population;
- one election process with ordinary uncontested succession;
- the bounded Housing material domain from `10`;
- one minimal measurement/report/claim/belief path;
- deterministic simulation time and transition processing consistent with `09`.

The fixture is synthetic test content, not a claim about real U.S. politics.

## 4. Legislature fixture

The legislature must be large enough to prove individual actor decisions and bargaining but small enough to inspect manually.

A suitable V0 shape is a small chamber or small bicameral configuration using approximately 9–15 causally discrete legislators in total, with readable behavioral affiliations/templates.

At least one legislative outcome must depend on more than one individual actor changing or conditionally committing support.

A bloc may share deterministic decision logic, but no bloc object may cast multiple votes unless the legal procedure actually grants that entity multiple votes.

The fixture must support:

- proposal introduction;
- at least one amendment/provision change;
- actor-specific support/oppose/conditional behavior;
- a resolved legislative vote;
- failure as well as passage paths.

### Candidate hard invariant WS-02

**The skeleton proves actor-level political causality with individually admitted votes and at least one material bargaining/amendment path; it does not simulate Congress breadth or replace actors with bloc vote totals.**

## 5. Housing proposal fixture

The administration's first proposal is the accepted conditional housing-construction grant program.

The player must be able to shape a small number of consequential dimensions, including enough of the following to create nontrivial tradeoffs:

- federal matching generosity;
- state/program eligibility or participation conditions;
- geographic/need distribution rule;
- administrative funding/capacity support;
- reporting/compliance requirement;
- project eligibility constraint.

The exact UI and number of controls remain implementation work.

The passed proposal may differ from the administration's initial design.

### Candidate hard invariant WS-03

**Proposal choices and bargaining must change legally/administratively meaningful program terms, not merely a hidden effectiveness multiplier. Any resulting material effect still occurs through administration, fiscal execution, state participation, and Housing.**

## 6. Three state-response fixtures

The skeleton uses three states because that is sufficient to prove federalism variance without content explosion.

### State A — willing/capable

- politically accepts/participates under a viable program design;
- has sufficient administrative/material capacity for at least some project progress;
- can produce the clearest successful implementation route.

### State B — refusal/nonparticipation

- has political/institutional incentives that can produce refusal or failure to enter the program relationship;
- federal program state cannot simply set `participates=true` on its behalf.

### State C — nominal participation, weak delivery

- can legally/politically enter the relationship;
- has weaker administrative and/or housing delivery capacity;
- can generate awards/obligations while material delivery remains delayed or disappointing.

The exact constitutional structures need only be as deep as Commit 3 requires for these decisions.

### Candidate hard invariant WS-04

**State participation, federal acceptance/award, active intergovernmental relationship, administrative capacity, and material delivery remain distinct in all three fixtures.**

## 7. Required normal viable route

A normal successful-enough route must be able to traverse:

```text
inherit problem + available reports
→ choose administration housing agenda/design
→ proposal enters legislative process
→ bargain/amend
→ individual legislators decide
→ enactment
→ legal effectiveness / appropriation availability
→ agency/program operationalization
→ state application/acceptance/refusal
→ federal determinations/awards
→ obligation/disbursement where applicable
→ Housing material projects begin/progress
→ at least one meaningful post-enactment player decision
→ material outcomes emerge unevenly/with latency
→ measurement process captures as-of observations
→ report released
→ competing claims/exposure
→ population belief/attribution/salience/preferences/turnout-relevant state evolve
→ election resolves
→ ordinary certification/entitlement/office transfer
→ outgoing ControlBinding ends
→ same world continues briefly under successor ownership
```

The implementation may omit stages that are legitimately simultaneous in the fixture, but it may not collapse semantically distinct stages into one owner.

## 8. Required post-enactment decision

Commit 1 requires at least one strategically meaningful post-enactment decision.

The skeleton must therefore create a decision after passage and before election that has real causal consequences.

A bounded default fixture is:

> implementation allocation/response decision triggered by early state participation and delivery information.

For example, the administration may choose among supported actions such as:

- devote additional lawful administrative resources to accelerate weak delivery;
- prioritize outreach/support to a struggling participating state;
- preserve resources for other participants;
- alter a lawful discretionary implementation parameter;
- respond to changed legal/political risk.

The exact interaction grammar is not frozen.

The decision must affect legitimate administrative/fiscal/political inputs, not directly alter housing outcomes or voter state.

### Candidate hard invariant WS-05

**At least one meaningful post-enactment player decision must alter future causal inputs through an owned government process. It may not be a cosmetic prompt or a direct material/public-opinion modifier.**

## 9. Required contested-authority route

The skeleton must include one deliberately narrow aggressive executive attempt:

```text
executive attempts disputed housing-funds redirection or equivalent supported act
→ attempt is actor-attemptable
→ claimed legal basis recorded
→ state/other party challenges
→ legal contest admitted under fixture rule
→ temporary scoped order issued or denied
→ target agency/institution responds
→ executive may comply/back down/appeal through supported choice
```

This route exists to prove:

- attemptability != legality;
- claim != legal truth;
- order != compliance;
- legal state != material history;
- player executive != judiciary.

It must remain small. No full appellate court system is required.

### Candidate hard invariant WS-06

**The contested-authority route must traverse the accepted legal/actor/compliance boundaries without special-case debug commands or a second court engine.**

## 10. Required election route

The election must consume a derived electorate from canonical population + geography + eligibility.

Its outcome must depend on more than housing alone.

The fixture begins with baseline political state sufficient to represent:

- partisan disposition;
- incumbent/candidate evaluation;
- background salience/memory;
- turnout tendency.

Housing-related material experience and information can alter belief, attribution, salience, preference, and turnout-relevant state before election resolution.

A poll may measure this state but cannot own it.

At least one ordinary viable route must produce electoral defeat despite some governing/material success, or electoral survival despite incomplete material delivery, demonstrating that outcomes are not a one-variable referendum.

### Candidate hard invariant WS-07

**Election resolution consumes the canonical electorate/population political state at its proper decision boundary; it does not read policy success, polling, national approval, or housing state as a direct winner field.**

## 11. Succession proof

After an ordinary defeat route:

- election result exists;
- applicable certification/selection resolves;
- successor entitlement/office assignment changes at the configured boundary;
- outgoing administration loses the supported GL0 decision surface;
- outgoing `ControlBinding` ends;
- law/program/fiscal/project/housing/population/information/legal-contest state persists according to its owners;
- successor information access follows ownership/access/transfer semantics rather than inheriting outgoing private knowledge wholesale.

The proof must then advance far enough to demonstrate at least one inherited process continues or changes under successor-owned decision/state.

Commit 5 does not design the player's post-defeat product mode.

### Candidate hard invariant WS-08

**The skeleton must prove world continuity past an ordinary office transfer. Succession changes office/control and legitimate access; it does not reset or freeze the inherited world.**

## 12. Time and stochastic proof requirements

The skeleton must be testable under equivalent advancement patterns such as:

```text
advance 30 days
```

versus:

```text
advance 10 days
save/load
advance 20 days
```

when no intervening player decision changes the canonical input path.

Equivalent runs must preserve canonical results under `09`, including stochastic outcomes governed by deterministic causal randomness.

The skeleton must also contain at least one same-timestamp or tightly adjacent dependency case where incidental handler order would be dangerous if the transition contract were ignored.

### Candidate hard invariant WS-09

**The GL0 proof is not accepted if UI chunking, save/load, scheduler reconstruction, incidental iteration order, or global RNG consumption changes canonical outcomes for an otherwise identical causal run.**

## 13. Required hostile outcome family

The executable proof need not make every path polished gameplay, but Architecture V0 is not implementation-ready unless the fixture can legitimately produce or force-test:

1. bill failure;
2. compromise passage;
3. underfunded administration;
4. state refusal/nonparticipation;
5. participating state with weak delivery capacity;
6. projects still incomplete at election;
7. competent administration with weak/mixed material response;
8. material success before official data catches up;
9. material success with substantial misattribution/little incumbent credit;
10. messaging advantage before delivery;
11. ordinary electoral defeat + world-persistent succession;
12. contested-authority attempt + scoped legal response;
13. save/load/chunk-equivalent deterministic continuation;
14. same-time dependency/tie-break determinism.

These may be achieved by deterministic fixtures or controlled test inputs. They are architecture proofs, not balance requirements.

## 14. Observability/legibility proof

The player-facing shell may remain crude during the skeleton, but an inspection surface must make causal blockage legible without exposing forbidden omniscience.

For player-relevant processes, the proof should be able to explain from legitimately available information:

- proposal status and known requirements;
- why support is believed likely/uncertain where that information exists;
- legal/fiscal status known to the administration;
- program/state participation status;
- known administrative bottlenecks;
- known project/material progress through reports/records the administration can access;
- forecast versus observed/reported divergence;
- election/poll uncertainty.

Debug/audit views may expose canonical truth for tests but are not player knowledge.

### Candidate hard invariant WS-10

**The walking skeleton must separately support player-bounded legibility and developer/audit observability. Debug truth may verify causality but may not silently become the player information contract.**

## 15. What the skeleton must not build

Commit-5 implementation planning must not require:

- all 50 states;
- real current politicians/data;
- detailed local governments/zoning;
- primaries or campaign finance;
- full lobbying/media markets;
- detailed court hierarchy;
- full macroeconomy;
- individual ordinary citizens;
- career mode;
- opposition gameplay after defeat;
- authoritarian-system breadth;
- polished production UI;
- generic framework abstractions unsupported by the GL0 proof.

## 16. Architecture-to-implementation handoff rule

Commit 5 remains architecture/specification.

Runtime implementation may begin only after adversarial review accepts the Commit-5 candidate at the requested severity threshold.

The first implementation slice must target this skeleton rather than building generic engine infrastructure disconnected from the proof.

### Candidate hard invariant WS-11

**The first runtime implementation is judged by the GL0 causal proof, not by subsystem completeness. Infrastructure that does not serve an accepted skeleton requirement is not justified merely because it may be useful later.**

## 17. Commit-5 review questions for this document

1. Is the skeleton minimal enough to implement while still traversing every accepted GL0 ownership seam?
2. Does the normal route contain a real post-enactment decision?
3. Can the three state fixtures prove federalism without full state-government breadth?
4. Does the legal-contest route remain narrow but causally real?
5. Can the election defeat/succession route prove persistence without designing post-defeat gameplay?
6. Are hostile outcome cases reproducible without story-specific ownership shortcuts?
7. Are deterministic time/randomness/save-load requirements testable?
8. Does the implementation handoff prevent architecture-first infrastructure sprawl?

No runtime code is authorized by this document itself.
