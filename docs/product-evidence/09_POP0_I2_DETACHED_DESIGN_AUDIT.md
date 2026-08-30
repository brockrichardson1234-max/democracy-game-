# POP0-I2 — Detached Executable-Contract Audit

Status: **DETACHED PRODUCT-EVIDENCE DESIGN AUDIT — NOT POP0-I2 IMPLEMENTATION AUTHORITY, NOT POP0-I3 AUTHORIZATION, AND NOT RUNTIME, UI, ROADMAP, OR EARLY-ACCESS AUTHORITY.**

Audited candidate:

- `08_POP0_I2_EXECUTABLE_CONTRACT.md`
- candidate commit: `2a0500b0620f36696a5225fd81b05329cf1c82e6`
- exact accepted parent: `3ba55c40df3fba1d541ae46e2efeb5044955ce9d`

Accepted implementation evidence beneath the candidate:

- POP0-I1 implementation/evidence SHA: `460a3acb9bcfd628895ad6908c04da3c79de076f`
- POP0-I1 authority: `07_POP0_I1_AUTHORITY.md`
- accepted production merge base: `44c1724962830225e6fc34f41d0df0cfdb7dfec0`
- rejected Stage 1 remains outside the implementation ancestry.

Audit question:

> **Does this contract prove independent office possession, retrieval, assessment, disagreement, synthesis, and bounded presidential presentation in one canonical world—without a shared White House mind, duplicate state, UI-only knowledge, player-facing full state, or I3+ behavior?**

---

# 1. Verdict

## **REVISE — 1 BLOCKING AUTHORITY-CONFORMANCE FINDING, 4 BOUNDED CLARIFICATIONS**

The contract has the correct I2 shape.

It is compact, implementation-facing, and correctly narrows the accepted POP0 program to office identity, office-owned work, information routes, assessment artifacts, disagreement, synthesis, bounded presidential presentation, and atomic persistence.

It does not introduce Attention, workstreams, presidential decisions, Housing adaptation, Labor simulation, Congress behavior, media, or playable UI.

However, it introduces seven individualized fictional human actors without satisfying the already accepted Living Country population-linkage contract.

That is a blocking omission because it would permit the first POP administration actors to become free-floating special people whose relationship to the one canonical population is undefined.

The remaining findings are bounded clarifications that should be closed in the same repair so the implementation cannot exploit ambiguity around departments versus offices, the central route ledger, officeholder role contexts, or fixture-scripted assessment outcomes.

---

# 2. R2-01 — BLOCKING: seven named human actors lack required population-linkage declarations

## 2.1 Candidate state

The contract creates six named officeholders:

- Dana Okafor;
- Maya Chen;
- Rafael Ortiz;
- Tessa Monroe;
- Naomi Mercer;
- Luis Ortega;

and one named President:

- Elena Ward.

It gives those actors canonical IDs, effective office assignments, authorship and presentation roles, and persistent historical significance.

It does not declare any actor's relationship to the canonical Population substrate.

## 2.2 Accepted controlling rule

Living Country Step 4 already requires every individualized human actor to declare exactly one population-linkage status for every effective interval:

1. `EXACT_CANONICAL_POPULATION_IDENTITY`;
2. `STATISTICALLY_REPRESENTED_WITHOUT_EXACT_IDENTITY`;
3. `OUTSIDE_MODELED_ORDINARY_POPULATION_SCOPE`.

The declaration must preserve effective time, support/provenance, population-weight treatment, permitted/prohibited joins, lifecycle implications, material-exposure implications, information/public-belief implications, electorate/eligibility implications, and later linkage-transition rules.

## 2.3 Exploit

Without that declaration, implementation could create:

```text
named President / Cabinet official / adviser
+ office and relationship history
+ no population weight
+ no exact Population identity
+ no declared statistical inclusion
+ no outside-scope status
```

The actor would be neither properly inside nor properly outside the modeled United States.

Later systems could then silently:

- add the actor to Population and double-count one person;
- treat the actor as statistically included without identifying the supporting population universe;
- infer exact residence, household, demographic, material experience, media exposure, public belief, eligibility, or electorate state from an aggregate;
- ignore death, movement, household, or lifecycle reconciliation;
- treat the President as a voter or affected household only when convenient;
- invent a population linkage retroactively when I3+ needs one.

That would violate the one-world invariant and the accepted actor-participation authority before I2 coding begins.

## 2.4 Required bounded repair

The I2 contract must declare one status for all seven actors for the I2 effective interval.

Because POP0-I2 does not yet compose a canonical Population owner, the simplest honest proof status is likely:

```text
OUTSIDE_MODELED_ORDINARY_POPULATION_SCOPE
```

with:

- zero added Population weight;
- explicit proof-fixture provenance;
- no residence, household, demographic, material-exposure, public-belief, electorate, or eligibility joins;
- office/actor/information relationships only;
- no lifecycle inference beyond the office-assignment interval represented in I2;
- a rule that later admission into a POP Population requires a separately reviewed canonical linkage transition that preserves actor identity and adds no duplicate person.

A statistical status is acceptable only if I2 can identify the actual modeled Population universe in which each actor is already included once. It may not point vaguely to the separate I10 Population or assume future inclusion.

An exact status is acceptable only if I2 actually composes a valid one-person Population identity/carrier under the accepted one-population rules. I2 should not import broad Population state merely to satisfy this proof.

The repair must add validation/tamper tests proving that missing, overlapping, temporally invalid, or unsupported linkage declarations are rejected.

---

# 3. C2-02 — distinguish federal institutions from political-leadership offices

The office table currently uses:

```text
pop0.office.labor → Department of Labor
pop0.office.hud   → Housing and Urban Development
```

while the worked path also treats Labor as the source possessor and allows assessment through `same-owner source possession`.

Accepted Living Country authority keeps a person, office, office assignment, institution, and operating component distinct.

The current wording could therefore be implemented as:

```text
Department possesses report
→ Secretary/leadership office automatically possesses every section
→ officeholder may assess it without an internal receipt
```

That would reproduce a department-sized shared mind.

The repair should choose one explicit model:

### Preferred bounded model

```text
pop0.institution.department-of-labor
    owns source/institution possession

pop0.office.secretary-of-labor
    owns leadership-office records and assessment acts
```

with a real institution-to-office route before the leadership office assesses the report.

HUD may likewise be represented as an institution plus one leadership office even though it remains inactive in I2.

### Alternatively

If I2 deliberately uses one coarse component to stand for a department's producing/leadership function, the contract must declare that resolution explicitly, retain one entity graph, identify which facts belong to the institution versus office component, and prohibit institution-wide possession from becoming automatic officeholder knowledge.

This is a clarification rather than an independent blocker because the contract already distinguishes source institution, office receipt, and officeholder assessment in the abstract.

---

# 4. C2-03 — the Information Route Ledger must be infrastructure, not the hidden White House mind

The candidate assigns immutable artifacts and possession/notice/access/retrieval/receipt occurrences to one `Information-route ledger` owner family.

That storage/event shape can be valid, but the final contract should state explicitly:

- the ledger records route and occurrence facts; it is not an actor or analytical owner;
- semantic possession remains scoped to the named institution/person;
- semantic receipt remains scoped to exactly one named office/person and content scope;
- every transition and query requires an explicit possessor/recipient/access context;
- no actor, office, UI, or assessment process may enumerate `all known artifacts` merely because the ledger stores them;
- global serialization does not create global accessibility;
- office-local record views are derived from recipient-scoped route records and cannot fan out to other offices;
- the ledger may not independently author assessments, syntheses, priorities, or presentations.

The candidate already implies most of this through office IDs, no fan-out, and prohibited global knowledge sets. The repair should make the semantic/storage distinction binding before code chooses one convenient global collection.

---

# 5. C2-04 — officeholder and presidential role contexts need closed temporal/access validation

The contract correctly separates office from holder, but it should add the following implementation rules:

1. An assessment or presentation may be authored only while the identified officeholder assignment is effective at the canonical event time.
2. An actor holding or later acquiring two roles does not automatically move one role's receipts, entitlements, office records, or queues into the other role.
3. Shared personal knowledge across simultaneous roles may not be inferred until a person-memory owner/process is actually supported; office records remain role-scoped.
4. The I2 fixture should either require seven distinct actors or explicitly test the multi-role rules above. It may not gain duplicate time/capability or unrestricted cross-office access from one actor appearing in multiple assignments.
5. The presidential recipient binding must identify a constitutional office, actor, effective interval, and provenance sufficient to prove Elena Ward is the valid President at presentation time.
6. That recipient binding is not `ControlBinding`, executive entitlement, player authority, or a substitute for the future presidential-office/control composition.

The candidate already requires valid holder intervals and presentation scope, so this is a bounded closure of the role-context semantics.

---

# 6. C2-05 — required disagreement must not be hardcoded into general transitions

The worked path appropriately labels itself a test trace and keeps its exact IDs/content in configuration or fixture data.

The implementation contract should nevertheless state explicitly that general runtime behavior may not contain logic equivalent to:

```text
if officeId == Labor → NOT_SUPPORTED
if officeId == NEC   → PLAUSIBLE
if officeId == OMB   → BLOCKED
```

The canonical assessments may be created by typed office-owned test operations or a bounded owner decision function. Their content must remain attributable to the producing officeholder, received evidence, declared assumptions, and support.

Add at least the following counterfactual requirements:

- remove or expire NEC access/receipt → NEC cannot author the same evidence-grounded assessment;
- remove the declared supplier assumption → the configured NEC conclusion cannot remain supported through a hidden office-ID rule;
- omit one Chief-of-Staff receipt → synthesis cannot cite or imply that unseen assessment;
- grant OMB only metadata → OMB remains unable to claim substantive evidence analysis;
- reorder independent notice/queue operations → final state remains deterministic without generating replacement assessments.

These counterfactuals need not implement general staff AI. They prove that the I2 path arises from owner state and typed acts rather than a fixed screenplay.

---

# 7. What passes cleanly

Subject to R2-01, the candidate successfully defines:

- exactly six bounded operating offices and separate named holders;
- persistent office identity distinct from officeholder assignment;
- separate administration-directory, office-operations, information-route, presentation, and calendar state;
- office-specific assignments and queues rather than an administration-wide workload pool;
- a closed ladder from artifact existence through possession, notice, access, retrieval, receipt, assessment, synthesis, and bounded presentation;
- technical retrieval distinct from substantive receipt;
- one office's receipt not fanning out to another office or the President;
- source scope and artifact-section validation;
- Labor/NEC disagreement over the same evidence with explicit NEC assumptions;
- OMB blocked from substantive analysis when only metadata and failed retrieval exist;
- synthesis as a new artifact that preserves its source assessments and disagreement;
- exact shown portions and referenced-but-unseen attachments in presidential presentation history;
- no read/unread UI flags as knowledge truth;
- append-only presentation and revision lineage;
- atomic state/save/parser/copy/restoration expansion;
- I1-format rejection unless a separately reviewed migration exists;
- five nontrivial save/load checkpoints;
- tamper rejection for route, queue, assessment, synthesis, presentation, and timestamp relationships;
- import-graph expansion without legacy I10 session, Stage 1, full-state UI, or I3+ systems;
- no Attention, workstream, player decision, presidential instrument, Housing adaptation, Labor domain, Congress behavior, media, or UI.

The contract is correctly implementation-facing and does not attempt to reopen Living Country design.

---

# 8. Repository integrity

Verified:

- candidate SHA: `2a0500b0620f36696a5225fd81b05329cf1c82e6`;
- exact parent: `3ba55c40df3fba1d541ae46e2efeb5044955ce9d`;
- comparison: one commit ahead, zero behind;
- changed content before this audit: one added 433-line documentation file;
- branch: `implementation/presidential-operating-proof-0`;
- `main`: unchanged at `44c1724962830225e6fc34f41d0df0cfdb7dfec0`;
- no runtime, tests, workflows, UI, schema, or configuration changed in the candidate;
- no POP0-I2 implementation exists yet.

Documentation-only status makes the absence of a test run acceptable for this candidate review.

---

# 9. Required disposition

## **REVISE THE I2 CONTRACT ONLY**

Do not implement POP0-I2 yet.

Preserve one bounded repair that:

1. declares and validates the population-linkage status of all seven individualized human actors;
2. closes the Department/leadership-office identity and possession route;
3. makes the central route ledger explicitly noncognitive, recipient-scoped infrastructure;
4. closes officeholder/presidential assignment-time and cross-role access semantics;
5. adds no-hardcoded-disagreement counterfactual requirements.

Then rerun the unchanged design gate:

> **Does this contract prove independent office possession, retrieval, assessment, disagreement, synthesis, and bounded presidential presentation in one canonical world—without a shared White House mind, duplicate state, UI-only knowledge, player-facing full state, or I3+ behavior?**

If the repaired composite passes, a separate authority action may authorize POP0-I2 coding only.

This audit does not authorize implementation.