# POP0-I3 — Final Detached Design Re-Audit

Status: **DETACHED DESIGN RE-AUDIT — PASS. NOT POP0-I3 IMPLEMENTATION ACCEPTANCE, NOT POP0-I4 AUTHORITY, NOT MAIN-BRANCH AUTHORITY.**

Audited repaired design:

```text
46402f7b856cb6c38fa993713fa2a48408d65ef9
```

Direct parent / prior detached audit:

```text
a12cda250fadace8e201a2ec2fe3d027447f3424
```

Original design candidate:

```text
ab229cd4df4e60f33ab2799af7b67fb73d6a17b9
```

Accepted POP0-I2 authority parent:

```text
a3766f6136a83b40409f6fadb2d54102a6357576
```

Accepted production merge base and unchanged `main`:

```text
44c1724962830225e6fc34f41d0df0cfdb7dfec0
```

Controlling repaired contract:

- `docs/product-evidence/15_POP0_I3_EXECUTABLE_CONTRACT.md` at `46402f7b856cb6c38fa993713fa2a48408d65ef9`.

Prior audit:

- `docs/product-evidence/16_POP0_I3_DETACHED_DESIGN_AUDIT.md` at `a12cda250fadace8e201a2ec2fe3d027447f3424` — **REVISE**.

---

# 1. Unchanged-gate verdict

## **PASS**

The bounded documentation-only repair closes all six findings from the detached design audit without widening POP0-I3 into POP0-I4+ behavior.

The repaired contract now gives a sufficiently executable and causally unambiguous design for implementing:

- bounded Presidential Attention;
- immutable escalations and reserved reviews with append-only lifecycle history;
- coordination-only administration workstreams;
- session-owned presidential `ControlBinding`;
- local presidential options with exact typed instrument previews;
- immutable decisions and authorized instruments;
- explicit one-recipient dispatch and technical delivery;
- recipient-office receipt and recipient-owned disposition;
- optional recipient-owned I2 assignment creation under accepted/narrowed scope;
- reference-only cross-owner historical indexing;
- deterministic deadline processing and format-3 persistence.

No remaining design ambiguity requires another contract repair before POP0-I3 coding.

---

# 2. Prior findings closed

## 2.1 Lifecycle ownership — CLOSED

The repaired contract chooses exactly one escalation lifecycle model:

```text
immutable EscalationRecord
+ append-only EscalationLifecycleOccurrence[]
→ derived current status
```

The base escalation no longer owns a mutable status or resolution/default/supersession fields.

Terminal escalation lifecycle kinds are explicit, at most one controlling terminal occurrence is allowed, decision/default/supersession causes are typed, supersession is forward and acyclic, and Attention derives status rather than serializing it.

Reserved reviews now use the same pattern: immutable reservation plus append-only terminal lifecycle occurrences, with `DUE` derived only from calendar time and absence of a terminal occurrence.

This removes the prior dual-owner ambiguity between mutable records and append-only history.

## 2.2 Exact deadline and same-instant ordering — CLOSED

The repaired contract defines start-inclusive/end-exclusive action windows and makes deadline processing mandatory inside `advanceTo(target)`.

At exact boundaries:

- escalation expiration/default controls before an ordinary presidential decision;
- `NO_ACTION_BY_DEADLINE` controls before an ordinary recipient-authored disposition;
- reserved-review due eligibility occurs before ordinary same-instant cancellation/supersession, while the final projection reflects a valid terminal lifecycle occurrence.

Crossed boundaries are processed exactly once in fixed phase order, with deterministic stable ordering inside a phase.

Direct coarse advancement, boundary-by-boundary advancement, and save-before-boundary/load/continue are required to converge to identical canonical state, projections, history entries, control availability, and serialized bytes.

A post-boundary save missing its required deterministic closure is invalid rather than repaired during load.

## 2.3 Recipient jurisdiction/capability — CLOSED

The repaired design adds authenticated typed `RecipientCapabilityAuthority` records.

Executable jurisdiction is now derived from:

- exact recipient office;
- instrument kind;
- typed product/scope or workstream bounds;
- effective interval;
- narrowing permission;
- authority/provenance.

Human-readable office mandate text remains non-executable.

The general runtime is forbidden from branching on OMB/Chief-of-Staff IDs or inferring authority merely from being named as recipient.

`ACCEPTED_AS_REQUESTED`, `NARROWED`, `DELAYED`, and `REFUSED` now have machine-checkable capability/constraint requirements. Evidence/access remains distinct from jurisdiction.

## 2.4 Preview-to-instrument equivalence — CLOSED

Each local option now binds immutable typed instrument previews with canonical payload hashes and stable bundle positions.

Authorization requires both:

- structural deep equality of every behavior-driving payload field; and
- matching canonical payload hash.

Only occurrence/authentication fields may be added when the canonical instrument occurrence is created. Recipient, kind, scope, requested act, authority, deadline, attachment/reference set, kind-specific payload, bundle membership, and bundle order cannot change after presentation.

This prevents staff or implementation logic from inserting hidden acts or altering the payload after presidential confirmation.

## 2.5 Reserved-review knowledge safety — CLOSED

A due reserved review is explicitly a reminder/review eligibility projection, not a knowledge-acquisition route.

The Attention projection may show only the prior presidential decision/reservation basis, due time, and material already legitimately presented to the President.

Due processing may not dereference expected source IDs, global owner state, or historical-index membership into new substantive knowledge.

An unpresented staff artifact remains undisclosed even if it exists before the reserved instant.

## 2.6 ControlBinding restoration and reconciliation — CLOSED

Format-3 parsing/loading must restore serialized session permission exactly.

Load cannot reconcile, rebind, end, timestamp, or recreate the `ControlBinding`.

A stale or mismatched serialized active binding is rejected; a valid ended binding restores byte-for-byte.

Any later legitimate role change must occur canonically first and may then trigger a separate explicit deterministic session reconciliation operation at authoritative POP time. The exact I3 fixture contains no such role change.

This is compatible with the accepted lower-level `AdministrationControlBinding` primitive without allowing hidden restoration mutation.

---

# 3. Unchanged architecture findings

The central I3 boundaries remain sound:

```text
presidential receipt/presentation
≠ player ControlBinding

I2 information/disagreement
≠ escalation
≠ escalation presentation
≠ Presidential Attention

presidential decision
≠ instrument
≠ dispatch attempt
≠ technical delivery
≠ recipient-office receipt
≠ recipient disposition
≠ office assignment
≠ assignment result
≠ presidential knowledge of later response
```

The workstream remains a coordination owner rather than a domain-truth owner.

The dispatch owner remains noncognitive.

Recipient disposition remains recipient-office-owned.

Historical indexing remains reference-only and does not grant knowledge.

Attention remains a derived projection and may truthfully be empty.

No global action catalogue, action-prefix dispatcher, universal severity meter, hidden fan-out, or administration-wide response state is authorized.

---

# 4. Scope integrity

The repaired commit changes exactly one documentation file and contains no POP0-I3 implementation.

POP0-I3 still excludes:

- Housing owner/adapter behavior;
- employment/material simulation;
- autonomous Congress;
- governors/organizations/media/public belief;
- playable UI;
- generalized White House staff AI;
- final instrument catalogue;
- election/succession/incapacity behavior;
- rollback/branching;
- production migration or `main` changes.

POP0-I4+ remains unauthorized.

---

# 5. Verification evidence

Repair ancestry is exact:

```text
a12cda250fadace8e201a2ec2fe3d027447f3424
→ 46402f7b856cb6c38fa993713fa2a48408d65ef9
```

The repair is exactly one commit and modifies only:

```text
docs/product-evidence/15_POP0_I3_EXECUTABLE_CONTRACT.md
```

GitHub Actions run:

```text
33333708986
```

completed **SUCCESS** at exact head SHA:

```text
46402f7b856cb6c38fa993713fa2a48408d65ef9
```

The accepted production baseline remains:

```text
44c1724962830225e6fc34f41d0df0cfdb7dfec0
```

---

# 6. Carried implementation watchpoints

These are not design blockers, but detached implementation review must attack them directly.

1. **Proof acts are not staff AI.** Typed escalation and recipient-disposition operations prove ownership and causality only.
2. **Capability records are jurisdiction, not competence/capacity.** Do not turn them into a universal administration ability score.
3. **Deadline processing belongs in deterministic calendar advancement.** Do not implement it as UI polling or optional helper logic.
4. **Preview hashing supplements structural equality.** Never use hash equality alone as authorization proof.
5. **Attention/history projections must remain narrow.** No full canonical state or global index dereference may become a player-facing knowledge backdoor.
6. **`getOperatingState()` remains audit/shell evidence only.** It is not a future gameplay projection contract.
7. **ControlBinding is permission, not country truth.** Do not move it into canonical world owner state.

---

# 7. Disposition

## **POP0-I3 DESIGN PASS**

The repaired design may now receive a separate implementation-authority action.

This re-audit does not itself authorize implementation, accept any future runtime candidate, authorize POP0-I4, or alter `main`.
