# POP0-I3 — Implementation Authority

Status: **POP0-I3 IMPLEMENTATION AUTHORIZED. POP0-I4+ UNAUTHORIZED. NOT POP0-I3 IMPLEMENTATION ACCEPTANCE, NOT MAIN-BRANCH AUTHORITY, NOT PRODUCT/ROADMAP/RELEASE AUTHORITY.**

Authority basis:

- accepted POP0-I2 authority: `a3766f6136a83b40409f6fadb2d54102a6357576`;
- original POP0-I3 design candidate: `ab229cd4df4e60f33ab2799af7b67fb73d6a17b9`;
- detached design audit: `a12cda250fadace8e201a2ec2fe3d027447f3424` — **REVISE**;
- repaired I3 design: `46402f7b856cb6c38fa993713fa2a48408d65ef9`;
- final unchanged-gate design re-audit: `5e7214694d7aa53b48ae3cb2795ac3c9cdcb4cc2` — **PASS**;
- controlling contract: `docs/product-evidence/15_POP0_I3_EXECUTABLE_CONTRACT.md` at `46402f7b856cb6c38fa993713fa2a48408d65ef9`;
- accepted production merge base: `44c1724962830225e6fc34f41d0df0cfdb7dfec0`.

---

# 1. Authorized question

POP0-I3 implementation may answer only:

> **Can the player intervene through real presidential authority without global action IDs, hidden instrument fan-out, or direct control of recipient outcomes?**

Implementation must remain a narrow executable proof of the repaired I3 contract.

---

# 2. Authorized implementation scope

POP0-I3 may implement only the following new behavior/state.

## 2.1 Session-owned presidential permission

- one configured presidential `AdministrationControlBinding` on the `PRESIDENTIAL_OPERATING_DECISION_SURFACE`;
- explicit format-3 session serialization outside canonical `operatingState`;
- exact load/restore without implicit reconciliation;
- explicit idempotent reconciliation only after a separately authenticated presidential role change, though no role change occurs in the exact I3 fixture;
- missing, ended, stale, mismatched actor/office/surface control blocks presidential choice without mutating world state.

## 2.2 Presidential escalation/review owner

- immutable escalation records;
- append-only terminal escalation lifecycle occurrences;
- immutable no-instrument default occurrences;
- immutable reserved-review records;
- append-only terminal reserved-review lifecycle occurrences;
- derived escalation status and reserved-review `SCHEDULED`/`DUE` state;
- no mutable cached current status.

## 2.3 Bounded escalation presentation and Attention

- a typed bounded escalation-presentation record added to the accepted presidential presentation owner;
- exact shown versus referenced-but-not-shown scope;
- derived Presidential Attention over valid presented active escalations and due reserved reviews;
- empty Attention as a valid state;
- due reserved review limited to prior presidential knowledge unless new information was separately presented.

Attention is projection only and must not serialize as canonical state.

## 2.4 Coordination-only workstreams

- one bounded I3 workstream identity/objective record;
- append-only workstream coordination transitions;
- derived current coordination status;
- exact source occurrence references;
- no ownership or mutation of evidence, office queues, material state, legal state, domain outcomes, or recipient results.

## 2.5 Typed local presidential options and decisions

- the exact three locally bound fixture options from the contract;
- immutable typed instrument previews with exact-schema canonical payload hashes and stable bundle positions;
- one immutable presidential decision from one valid active escalation/local option;
- decision basis limited to valid presidential presentation history;
- exact preview identity/hash capture;
- no global action catalogue, global action IDs, action-prefix parsing, or free-form command surface.

## 2.6 Typed presidential instruments

I3 may implement only:

- `REQUEST_OFFICE_ANALYSIS`;
- `REQUEST_WORKSTREAM_COORDINATION`.

Authorization must materialize only the fully previewed bundle.

Every behavior-driving payload field must be structurally identical to the preview and match its canonical payload hash. Only occurrence/authentication fields explicitly allowed by the contract may be added at authorization.

Each instrument has exactly one recipient office.

## 2.7 Typed recipient-capability authority

The authenticated configuration may contain only the bounded I3 `RecipientCapabilityAuthority` records defined by the controlling contract.

General validation must derive jurisdiction from typed capability identity, recipient, instrument kind, scope/product/workstream bounds, effective interval, narrowing permission, and authority/provenance.

It may not:

- branch on OMB or Chief-of-Staff IDs;
- parse human-readable mandate text;
- infer jurisdiction merely because an office received an instrument;
- use capability as competence, capacity, preference, or personality.

## 2.8 Dispatch and recipient-owned route

- immutable dispatch attempts for exactly one instrument/recipient;
- technical outcomes `DELIVERED_TO_OFFICE_BOUNDARY`, `NOT_DELIVERED`, or `FAILED` with bounded proof-fixture provenance;
- immutable recipient-office instrument receipt after successful technical delivery;
- recipient-owned controlling disposition with typed capability/constraint validation;
- authored dispositions: `ACCEPTED_AS_REQUESTED`, `NARROWED`, `DELAYED`, `REFUSED`;
- deterministic deadline-derived `NO_ACTION_BY_DEADLINE`;
- no presidential or dispatch-owned recipient result.

## 2.9 Recipient-owned assignment follow-through

A recipient office may separately create an accepted I2 `OfficeWorkAssignment` only when the disposition authorizes its objective/product/evidence scope and existing I2 validation succeeds.

Disposition must not auto-create an assignment.

Assignment must not auto-change a workstream.

## 2.10 Historical record index

- one reference-only historical index owner;
- exact occurrence/owner/kind/time/reference identity;
- optional valid causal-parent IDs;
- one entry per actual indexed occurrence;
- no copied substantive truth;
- no knowledge grant from index membership;
- no indexing of derived Attention/status/due projections.

## 2.11 Deterministic deadline advancement

`advanceTo(target)` must process all crossed I3 boundaries exactly once under the repaired contract's fixed phase order.

At exact deadlines:

- expiration/default controls before presidential decision;
- no-action deadline controls before recipient-authored disposition;
- reserved-review due eligibility precedes ordinary same-time cancellation while final projection respects the resulting lifecycle state.

Coarse advancement, fine advancement, and save-before-boundary/load/continue must converge.

## 2.12 Persistence

If implementation succeeds, advance atomically to:

```text
configuration/scenario: 0.3.0-pop0-i3
runtime schema:          3
save format:             3
```

All new canonical and session state must enter type, validation, defensive copy, serialization, parser, restore, deterministic continuation, and tamper coverage together.

No format-2 migration is authorized unless separately reviewed before inclusion.

---

# 3. Required proof behavior

The implementation candidate must execute the controlling worked path and counterfactuals, including at minimum:

- initial empty Attention;
- monitored workstream without automatic escalation;
- typed Chief-of-Staff escalation without automatic presentation/Attention;
- separate bounded escalation presentation;
- valid active ControlBinding decision;
- exact two-instrument preview/authorization equality;
- undispatched authorized instruments causing no downstream state;
- independent dispatch/delivery and independent office receipts;
- Chief-of-Staff accepted coordination disposition and OMB narrowed analysis disposition;
- separate OMB narrowed assignment creation;
- separate Chief-of-Staff workstream transition;
- metadata-only versus substantive-receipt capability/evidence counterfactuals;
- no-capability recipient rejection of equivalent accept/narrow behavior;
- failed dispatch independence;
- reserved-review due behavior without unpresented knowledge leakage;
- deliberate monitoring default and expiration default with no replacement drama;
- exact-deadline precedence;
- coarse/fine/save-load boundary equivalence;
- byte-stable active/ended ControlBinding restore;
- preview tamper rejection;
- history-index knowledge safety.

---

# 4. Hard prohibitions

POP0-I3 implementation may not add or import:

- Housing owner state, adapter, hidden problem, or implementation progression;
- employment stocks/flows, plant closure, material economic consequences, or Labor simulation;
- autonomous Congress or legislative initiative behavior;
- governors, organizations, media, publication, public belief, approval, or quiet healthcare condition;
- playable UI;
- generalized autonomous White House staff/escalation AI;
- generalized recipient AI/personality/competence model;
- final instrument catalogue beyond the two authorized kinds;
- public statements, fiscal commitments, legislative offers, agency directives, external-recipient commands, or material-result commands;
- elections, succession, incapacity, Vice-Presidential authority, or new presidential officeholder behavior;
- rollback/alternate-history branching;
- `IntegratedPartialRuntimeSession`, I10 whole-session wrapping, `ProductionGameSession`, `ProductionGameView`, `ProductionPlayerAction`, `availablePlayerActions`, or `dispatchPlayerCommand`;
- Stage 1/opening-usability lineage;
- Population/integrated-information/legislative/media later owner state in the POP graph;
- opaque I10 format-11 save synchronization;
- player-facing full canonical state;
- changes to `main`.

POP0-I4+ remains unauthorized.

---

# 5. Verification requirements

The implementation candidate must provide detached-reviewable evidence for:

- exact implementation commit or bounded chain;
- exact parent authority lineage;
- merge base and unchanged `origin/main`;
- Stage 1 ancestry absence;
- expanded structural POP import-boundary proof for actual I3 graph;
- target I1/I2/I3 test suite;
- hostile control, lifecycle, deadline, preview, capability, dispatch, recipient, persistence, history-index, and knowledge-safety tests;
- complete `npm run verify`;
- unchanged I10 production boot/restore regression;
- typecheck and lint;
- authenticated artifact verification;
- production build and built-runtime verification;
- exact-SHA GitHub Actions **PASS**;
- clean worktree;
- confirmation that no I4+ behavior began.

The candidate must stop for detached POP0-I3 implementation review. It must not author its own acceptance authority.

---

# 6. Carried watchpoints

The implementation review must specifically attack:

1. typed proof escalation/disposition acts being mistaken for staff AI;
2. capability records becoming universal capacity or competence state;
3. deadline processing becoming optional/session/UI polling instead of deterministic world advancement;
4. preview hash equality being used without structural equality;
5. historical index or full state becoming an omniscient player projection;
6. due reserved review leaking unpresented owner/index data;
7. session-owned ControlBinding leaking into canonical country state or being silently mutated on load;
8. same-instant phase order depending on array/declaration/handler order;
9. decision transaction materializing hidden or reordered instruments;
10. recipient acceptance/narrowing creating an assignment or workstream update automatically.

---

# 7. Authority disposition

## **POP0-I3 IMPLEMENTATION IS AUTHORIZED WITHIN THIS EXACT BOUNDARY.**

This authority does not accept any implementation not yet reviewed, does not authorize POP0-I4, does not migrate production, and does not modify `main`.
