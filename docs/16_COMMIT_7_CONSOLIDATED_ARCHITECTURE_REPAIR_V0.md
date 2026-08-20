# 16 — Commit-7 Consolidated Architecture Repair V0

Status: **Commit-7 consolidated repair candidate for final findings-only review. Not implementation authority until accepted.**

Repairs audited Commit-6 authority: `6db8ff5829f689136525bf9c930bc9c55c0a355a`

## 1. Purpose

Commit 6 attacked the assembled Architecture V0 from three directions and returned exactly three HIGH findings:

1. cross-domain population/material subject-association ownership was not singular;
2. the required post-enactment decision could still be causally real but strategically dominant/trivial;
3. repository authority/navigation surfaces were stale relative to accepted Architecture V0.

This document is the one consolidated Commit-7 architecture repair. It does not add a fourth system, broaden the walking skeleton, choose runtime storage/algorithms, or authorize code.

Where this document narrows or clarifies wording in `07`, `11`, or `12`, this document controls for Architecture V0. All other accepted semantics remain unchanged.

## 2. Repair C7-01 — one canonical owner for cross-domain subject association

Commit 5 correctly established that one canonical ordinary population does not make `PopulationState` the owner of every domain-specific material fact associated with those people.

Commit 6 then exposed a remaining ownership question: which owner canonically states that a domain-specific fact applies to a particular population subject/aggregate/weight?

Architecture V0 now freezes the following semantic rule.

### 2.1 Intrinsic subject association follows the domain fact owner

When a domain-specific material fact intrinsically describes some canonical population subject, the owner of that material fact also owns the canonical subject association necessary to identify **which** population identity/weight the fact describes.

Conceptually:

```text
LaborIncomeDomain
  EmploymentFact
    subjectRef -> canonical population identity/aggregate
    current employment state
```

not:

```text
LaborIncomeDomain.EmploymentFact.subjectRef
+
PopulationState.employmentFactRef
```

as two independently mutable authoritative mappings.

`PopulationState` may maintain a reverse lookup, cache, index, or projection such as “which labor facts refer to this population aggregate?” for performance or queries. That reverse representation is non-authoritative and must be rebuildable/reconcilable from the canonical association owner.

### 2.2 Independent cross-domain relationships may own themselves

Some future relationship may be semantically independent rather than merely an intrinsic subject field of one domain fact.

If so, a dedicated relationship owner may canonically own that relationship.

Conceptually:

```text
CrossDomainRelationship
  populationSubjectRef
  domainFactRef
  relationship-specific state
```

Neither endpoint may then maintain a second mutable authoritative copy of the relationship.

Commit 7 does **not** require a dedicated relationship object for ordinary domain facts. It only permits one where the relationship itself is genuinely an independently meaningful canonical fact.

### 2.3 Correlation/refinement must preserve the single owner

Population aggregation, splitting, merging, or material-domain refinement may require the subject association to be transformed or re-expressed.

That process must:

- conserve the represented population weight/identity semantics required by the supported model;
- preserve causally relevant joint relationships;
- update the canonical association through its owner;
- rebuild/update non-authoritative reverse indexes/projections as consequences;
- never create a second mutable association owner merely because two domains need efficient lookup.

The exact weighted-particle, sparse-distribution, database, ECS, join-table, or serialization representation remains implementation work.

### Candidate hard invariant C7-01

**Every mutable cross-domain subject association has one semantic owner. When a domain-specific fact intrinsically describes a population subject, that fact's owning domain also owns the canonical subject association; reverse population/material lookups are references, indexes, caches, or projections. If the association is itself an independent cross-domain relationship fact, that relationship has one dedicated owner. Population/material refinement may transform the association only through that owner and may not create competing mutable mappings.**

## 3. Repair C7-02 — the required post-enactment choice must contain a real tradeoff

Commit 1 and `11` require at least one meaningful post-enactment governing decision before the election.

Commit 6 found that “causal” alone was not a sufficient acceptance condition: a free `spend more -> implementation improves` button could satisfy the causal requirement while failing the intended governing experience.

Architecture V0 now freezes a narrow player-agency requirement for the walking skeleton.

### 3.1 Required tradeoff condition

At least one post-enactment decision on an ordinary viable GL0 route must present at least two supported options that compete over **already accepted** scarce or risky considerations.

The tradeoff may use one or more existing Architecture V0 facts such as:

- finite fiscal room / an alternative lawful use of resources;
- finite administrative capacity / attention;
- geographic distribution among participating states or regions;
- implementation speed versus breadth/coverage;
- compliance/reporting burden versus delivery speed;
- legal risk or contested authority;
- political coalition cost or state participation risk;
- timing relative to known deadlines/election;
- uncertainty in forecasts/material response;
- another owner-respecting opportunity cost already present in the accepted architecture.

No new resource system is required merely to manufacture the tradeoff.

### 3.2 Non-dominance acceptance burden

The walking-skeleton fixture must provide a plausible modeled reason **not** to choose the superficially strongest implementation response.

This does not require mathematical equilibrium or perfectly balanced options. It requires that the choice cannot be reduced, under the information and constraints represented by the fixture, to:

```text
A: get more benefit at no meaningful cost/risk
B: get less benefit
```

A choice may still turn out better in hindsight. Uncertainty, opportunity cost, or competing objectives can make the ex-ante decision strategically real without guaranteeing equal outcomes.

### 3.3 No micromanagement expansion

This repair does not authorize repeated allocation clicks, monthly maintenance decisions, or procedural confirmation spam.

The GL0 proof still requires **at least one** strategically meaningful post-enactment decision. Additional post-enactment decisions are justified only if later playtesting demonstrates a player-experience need.

Exact option text, values, UI, formula, and tuning remain walking-skeleton/playtest work.

### Candidate hard invariant C7-02

**The required GL0 post-enactment player decision must alter future causal inputs through an accepted owner and must contain a genuine modeled opportunity cost, scarcity, risk, distributional conflict, timing conflict, or uncertainty such that the superficially strongest implementation response is not costlessly dominant. This requirement proves governing agency once; it does not create a recurring micromanagement loop.**

## 4. Repair C7-03 — authority surfaces must point to the complete accepted candidate

Commit 6 found that `README.md`, `DECISIONS.md`, and `OPEN_QUESTIONS.md` still described much earlier architecture gates.

Commit 7 synchronizes those files as navigation/index surfaces.

The authority rule is:

- exact SHA supplied for review is authoritative for a candidate;
- branch refs remain convenience pointers;
- numbered architecture documents own the normative semantics in their scope;
- this Commit-7 repair document controls only the two repaired architecture findings above plus the final gate/process state;
- `DECISIONS.md` is a current navigation/index of accepted decisions, not a duplicate normative owner;
- `OPEN_QUESTIONS.md` tracks genuinely deferred questions and their current status; a stale former deadline does not become architecture authority;
- Commit-6 audit documents are evidence/findings, not simulation-state or runtime specifications.

### Candidate hard invariant C7-03

**Repository navigation/index files must identify the complete Architecture V0 authority set and current gate state without becoming a competing source of normative truth. Exact-SHA authority and the owning numbered architecture documents control when a summary/index differs.**

## 5. Final Architecture V0 read/authority order

For final findings-only review of this Commit-7 candidate, read:

```text
00  Game and Player Contract
01  First Governing Loop
02  Causal Architecture
03  State Ownership and Projections
04  Government Authority and Procedure
05  Political Actors and Coalitions
06  Judiciary and Legal Contest
07  Population, Geography, and Electorate
08  Information, Measurement, and Belief
09  Simulation Time and Transitions
10  Housing Material Domain
11  Governing Loop 0 Walking Skeleton Contract
12  Architecture Acceptance and Second-Domain Probe
13  Causality and Ownership Audit        [Commit-6 evidence]
14  Player Agency and Legibility Audit   [Commit-6 evidence]
15  Scope and Extensibility Audit        [Commit-6 evidence]
16  Commit-7 Consolidated Repair          [latest narrow normative repairs]
DECISIONS.md                              [current decision index]
OPEN_QUESTIONS.md                         [current deferred-question register]
```

The audits do not supersede accepted architecture merely by identifying a finding. This repair document supersedes only the specific ambiguous/insufficient wording necessary to close the reported HIGHs.

## 6. Architecture V0 acceptance boundary after this repair

Commit 7 is the final architecture-repair gate before runtime work.

The final review should be findings-only against the three Commit-6 HIGHs and should ask whether this repair introduces any new BLOCKER/HIGH contradiction.

If that review returns:

```text
0 BLOCKER
0 HIGH remaining from Commit-6 findings
0 new BLOCKER/HIGH introduced
```

then the exact accepted Commit-7 SHA becomes:

```text
ARCHITECTURE V0 — READY FOR WALKING SKELETON
```

Only then may Commit 8 begin first runtime code.

Acceptance does not mean Architecture V0 can never change. The accepted reopen rule remains: later architecture changes require a demonstrated contradiction, unowned required fact, duplicate owner, impossible accepted causal path, or deterministic/persistence defect—not preference for a more elaborate design.

## 7. Explicit non-expansion

Commit 7 does not add or design:

- runtime packages/classes/storage;
- scheduler implementation;
- random-number algorithm;
- weighted-particle or sparse-distribution implementation;
- production UI;
- full U.S. content;
- local governments/zoning;
- campaign finance/lobbying/media-market breadth;
- macroeconomy;
- a playable unemployment-insurance system;
- post-defeat opposition mode;
- authoritarian gameplay breadth;
- Commit-8 implementation slices.

The architecture remains bounded to what the accepted GL0 walking-skeleton proof requires.

## 8. Commit-7 findings-only review questions

Review only:

1. Does C7-01 give every mutable population↔material subject association one semantic owner without forcing a storage implementation?
2. Does C7-02 guarantee one genuinely strategic post-enactment tradeoff without introducing recurring micromanagement or a new system?
3. Do the synchronized authority surfaces identify the complete Architecture V0 candidate and preserve exact-SHA/document ownership?
4. Did any Commit-7 repair contradict accepted Commit-1–6 semantics outside the reported findings?
5. If these findings are closed, is the architecture safe to mark `READY FOR WALKING SKELETON` and hand to Commit 8?

No broader redesign is requested by the final findings-only review.
