# POP0-I3 — Detached Design Audit

Status: **DETACHED IMPLEMENTATION-DESIGN AUDIT — NOT POP0-I3 CODING AUTHORITY, NOT POP0-I3 ACCEPTANCE AUTHORITY, NOT POP0-I4 AUTHORITY, AND NOT PRODUCT/UI/ROADMAP/MAIN-BRANCH AUTHORITY.**

Audited candidate:

```text
ab229cd4df4e60f33ab2799af7b67fb73d6a17b9
```

Exact accepted parent / POP0-I2 authority:

```text
a3766f6136a83b40409f6fadb2d54102a6357576
```

Controlling candidate document:

```text
docs/product-evidence/15_POP0_I3_EXECUTABLE_CONTRACT.md
```

Accepted production merge base and frozen `main`:

```text
44c1724962830225e6fc34f41d0df0cfdb7dfec0
```

Audit question:

> **Does this contract prove that valid I2 office information can become bounded Presidential Attention, workstream coordination, an authenticated presidential decision, visible typed instruments, explicit dispatch, and recipient-owned response—without global action IDs, hidden fan-out, direct presidential outcome control, duplicate truth, omniscient history, player-facing full state, or POP0-I4+ behavior?**

---

# 1. Verdict

## **REVISE — 3 BLOCKING DESIGN AMBIGUITIES, 3 REQUIRED BOUNDED CLARIFICATIONS**

The candidate has the correct overall I3 architecture and preserves the accepted I1/I2 direction.

It successfully distinguishes:

- presidential presentation from player control authority;
- escalation creation from escalation presentation;
- canonical escalation/review records from the derived Attention projection;
- workstream coordination from domain truth;
- presidential decision from instrument;
- authorization from dispatch;
- technical delivery from recipient-office receipt;
- receipt from recipient disposition;
- disposition from office assignment;
- recipient outcomes from presidential choice;
- historical indexing from substantive owner truth and player knowledge.

It also keeps I3 narrow: no Housing adapter, employment owner, Congress, media, Population owner, public belief, playable UI, or global player-action surface enters this increment.

However, three load-bearing semantics remain ambiguous enough that different reasonable implementations would create different canonical architectures:

1. escalation and reserved-review lifecycle ownership mixes mutable status/reference fields with append-only lifecycle occurrences;
2. exact-deadline ordering is undefined for presidential decision versus escalation default, recipient disposition versus `NO_ACTION_BY_DEADLINE`, and reserved-review activation;
3. recipient `jurisdiction and authority` is required but no typed machine-readable source of that authority is defined, inviting office-ID hardcoding or free-form mandate interpretation.

These must be closed before coding because they affect semantic ownership, deterministic time, recipient autonomy, save validation, and historical indexing.

Three smaller clarification gaps should be closed in the same documentation-only repair: exact preview-to-instrument equivalence, due reserved-review knowledge safety, and ControlBinding reconciliation/load behavior.

POP0-I3 coding remains unauthorized.

---

# 2. R3D-01 — BLOCKING: escalation/review lifecycle has two possible canonical owners

## 2.1 Candidate language

The escalation record is defined as minimally binding:

```text
status and resolution/default/supersession references
```

but the contract also requires:

```text
Status changes are append-only occurrences or immutable superseding records.
They cannot rewrite the original basis, options, knowledge, or deadline.
```

The historical index separately indexes escalation creation, withdrawal, resolution, supersession, and default occurrences.

Reserved review similarly stores completion/cancellation/supersession references while also having lifecycle operations.

## 2.2 Why this is ambiguous

There are two materially different implementations consistent with the current wording:

### Model A — mutable base record

```text
Escalation {
  status: ACTIVE -> RESOLVED_BY_DECISION
  resolutionReference: ...
}
```

### Model B — immutable base plus lifecycle occurrences

```text
EscalationCreated
EscalationResolved
current status = derived from lifecycle chain
```

Those models have different:

- canonical owners of current status;
- save shapes;
- historical index semantics;
- tamper checks;
- idempotency behavior;
- supersession behavior;
- Attention derivation.

The contract is explicit for workstreams: immutable identity/objective plus append-only transition records, with current status derived. It needs equivalent precision for escalations and reserved reviews.

## 2.3 Required repair

Choose one canonical lifecycle model.

Recommended I3 model:

1. base escalation record is immutable and contains no mutable current-status truth;
2. lifecycle is represented by append-only typed occurrences such as:
   - `ESCALATION_CREATED` or immutable base creation;
   - `ESCALATION_WITHDRAWN`;
   - `ESCALATION_RESOLVED_BY_DECISION`;
   - `ESCALATION_EXPIRED_TO_DEFAULT`;
   - `ESCALATION_SUPERSEDED`;
3. current escalation status is derived from one validated acyclic lifecycle chain;
4. one active escalation admits at most one terminal controlling lifecycle occurrence;
5. resolution/default/supersession references live on lifecycle occurrences rather than being mutable fields on the creation record;
6. Attention derives current lifecycle state, not a duplicated mutable status;
7. the Historical Record indexes the actual lifecycle occurrence identity once.

Use the same rule for reserved reviews: immutable reservation plus append-only completion/cancellation/supersession lifecycle, with current state derived.

If a different model is selected, it must still identify exactly one semantic owner for lifecycle state and preserve immutable historical facts.

---

# 3. R3D-02 — BLOCKING: exact-deadline causal precedence is undefined

## 3.1 Candidate deadline behavior

The contract defines all of these dated mechanisms:

- escalation expiration/default;
- explicit `ALLOW_MONITORING_DEFAULT`;
- reserved review becoming due;
- recipient `NO_ACTION_BY_DEADLINE`;
- instrument requested-response deadline;
- office assignment deadlines;
- same-instant deterministic phase ordering.

But the fixed same-instant phase order only defines the atomic presidential decision transaction:

```text
source owner record
→ decision
→ instrument
→ escalation resolution
→ historical-index registration
```

It does not define the competing deadline edges.

## 3.2 Undefined cases

The contract does not currently answer:

### Escalation boundary

At exactly the escalation deadline, may the President still decide, or has `EXPIRED_TO_DEFAULT` already become controlling?

```text
09:45 decision
vs.
09:45 expiration/default
```

### Recipient boundary

At exactly the response deadline, may the recipient office author `ACCEPTED`, `NARROWED`, `DELAYED`, or `REFUSED`, or has `NO_ACTION_BY_DEADLINE` already become controlling?

### Reserved review boundary

At exactly the reserved instant, does the due-review projection become visible before or after another same-time cancellation/supersession operation?

### Large time advancement

If `advanceTo()` crosses one or more deadlines, which owner processes due defaults/reviews, and is that processing mandatory or dependent on a later explicit helper call?

## 3.3 Why this blocks coding

Without an exact rule, two implementations can both pass ordinary traces yet disagree under:

- coarse versus fine advancement;
- save immediately before a deadline;
- operation submitted exactly at deadline;
- declaration order;
- restore and continue;
- same-instant retry.

The project already treats same-instant ownership/order as architecture, so I3 cannot defer this.

## 3.4 Required repair

Define start-inclusive/end-exclusive or other exact semantics for every I3 deadline.

Recommended shape:

1. state explicitly whether an action remains valid at `current == deadline`;
2. define deterministic deadline-processing owner/phase for:
   - escalation expiration/default;
   - recipient no-action resolution;
   - reserved-review due activation;
3. define whether `advanceTo(target)` must process every crossed I3 deadline exactly once;
4. add fixed same-instant phase ordering between ordinary acts and deadline/default acts;
5. require coarse/fine and save-before-boundary equivalence;
6. require duplicate/replay protection after restoration.

No wall-clock or array/declaration order may resolve the boundary.

---

# 4. R3D-03 — BLOCKING: recipient jurisdiction/authority has no executable source

## 4.1 Candidate rule

The contract correctly requires:

> `ACCEPTED_AS_REQUESTED` requires recipient jurisdiction and authority.

It also requires `NARROWED`, `DELAYED`, and `REFUSED` to be rooted in actual recipient state and expressly prohibits logic that branches on `OMB` merely because it is OMB.

This is the correct semantic requirement.

## 4.2 Missing executable contract

Accepted I2 office configuration currently supplies human-readable office identity and `mandate` text, but I3 does not define a typed machine-readable capability/authority record that answers questions such as:

```text
Can this office receive REQUEST_OFFICE_ANALYSIS?
Can it accept this product kind?
Can it narrow this requested scope?
What scope is inside its jurisdiction?
What standing authority permits this disposition?
```

The presidential instrument's authority basis establishes why the President may request the act. It does not by itself establish the recipient office's jurisdiction to accept and perform it.

Without a typed recipient authority source, an implementation is likely to do one of three forbidden/weak things:

- hardcode `if officeId == OMB`;
- parse free-form mandate strings;
- treat being named as recipient as sufficient jurisdiction.

All three weaken the recipient-owned causal boundary.

## 4.3 Required repair

Add the minimum typed configured recipient-capability authority needed for I3.

A bounded fixture record may define, for example:

```text
recipient office
instrument kind
permitted requested product kinds
maximum scope family
whether narrowing is permitted
standing/office authority reference
effective interval
provenance
```

The general validator must consume that record without office-ID special cases.

Then require:

- `ACCEPTED_AS_REQUESTED` fits the recipient capability exactly;
- `NARROWED` is a strict supported subset/less-claiming product within capability;
- `DELAYED` and `REFUSED` cite typed recipient constraints/authority where material;
- a counterfactual recipient lacking the capability cannot emit the same accepted disposition merely because it received the instrument;
- changing access/evidence may change assignment feasibility without rewriting jurisdiction.

This remains bounded proof authority, not general staff AI.

---

# 5. C3D-04 — REQUIRED CLARIFICATION: preview and authorized instrument must not become shadow owners

The contract correctly requires every instrument to be visible before confirmation and says the selected option materializes exactly the previewed bundle.

Because the escalation stores full instrument previews and the instrument owner later stores full authorized payloads, define the equality rule explicitly.

At minimum:

- preview is an immutable proposed/visible payload, not an executed instrument occurrence;
- the authorized instrument must be structurally identical to the selected preview for every behavior-driving field;
- only occurrence/authentication fields explicitly designated by contract may be added at authorization time;
- preview identity/hash or another deterministic equivalence mechanism must make divergence tamper-detectable;
- staff/runtime cannot silently alter recipient, scope, requested act, authority, deadlines, attachments/references, or bundle membership after confirmation.

This preserves the useful distinction between "what the President knowingly authorized" and the later canonical instrument occurrence without permitting two competing payload truths.

---

# 6. C3D-05 — REQUIRED CLARIFICATION: due reserved review cannot leak new source content

A reserved review stores `presentation/source references expected at review`, and when due it may appear in Attention without a new domain event.

The contract should state explicitly that becoming due does **not** resolve those source references into newly visible substantive content.

A due reserved-review Attention item may expose:

- the reservation identity;
- question;
- due time;
- the President's own prior decision/reservation basis;
- source identities already legitimately known to the President;
- the fact that an expected product/reference exists or is missing where that fact is itself legitimately known.

It may not expose:

- a new assessment;
- updated source sections;
- recipient disposition;
- assignment result;
- staff-only content;

unless a separately valid presidential presentation/knowledge path exists.

Add a counterfactual where new staff-only evidence exists by the reserved instant but was never presented: the due Attention item must not reveal its content.

---

# 7. C3D-06 — REQUIRED CLARIFICATION: ControlBinding reconciliation cannot make load mutate history

Reusing the existing pure `AdministrationControlBinding` primitive is appropriate. It already distinguishes session permission from world truth and can detect a bound-officeholder change.

But the candidate says I3 must reconcile an existing binding safely if the configured presidential actor no longer matches, while persistence also requires `save → load → save` byte stability and says load must not create new canonical work.

Clarify:

1. parsing/loading validates and restores the serialized binding without silently rebinding it;
2. an active binding inconsistent with authenticated current presidential identity is either rejected as invalid/tampered or restored in a state that cannot authorize a decision under an explicitly defined rule;
3. any transition from `ACTIVE` to `ENDED` caused by a real later identity change is an explicit deterministic session operation at authoritative POP time, not a hidden load side effect;
4. I3 cannot create a new binding for a successor because succession/turnover is explicitly excluded;
5. stale/ended binding leaves world state and escalations intact while decision authority is unavailable.

This keeps session authority restoration idempotent and compatible with future succession work.

---

# 8. What passes

Subject to Sections 2–7, the candidate strongly satisfies the intended I3 direction.

## 8.1 Authority separation

- I2 presidential presentation does not become ControlBinding.
- ControlBinding is session permission, not country truth.
- missing/stale/ended authority blocks presidential decision without deleting world state.
- no global action catalogue or prefix dispatcher is authorized.

## 8.2 Knowledge and Attention

- escalation creation is an officeholder act rather than automatic drama generation;
- escalation presentation is separate from escalation creation;
- unpresented escalation creates no Attention;
- Attention is derived and may be empty;
- no severity score or universal importance field controls it;
- ordinary workstream/evidence/deadline state alone does not become Attention.

## 8.3 Workstream non-ownership

- workstream owns only objective/coordination records;
- current workstream status derives from append-only transitions;
- workstream does not own evidence, assignments, decisions, instruments, dispatch, recipient response, or material success;
- recipient or assignment events cannot automatically update workstream state.

## 8.4 Presidential choice and visible instruments

- locally bound options replace global action IDs;
- the exact worked option visibly enumerates two instruments before confirmation;
- zero-instrument reserve/default choices are legitimate;
- decision, instrument, dispatch, and downstream outcomes remain semantically distinct;
- generic free-form command instruments are forbidden.

## 8.5 Recipient ownership

- exact one-recipient instruments prevent hidden fan-out;
- dispatch is noncognitive;
- technical delivery is distinct from office receipt;
- recipient disposition is authored by the recipient officeholder;
- recipient disposition does not automatically create assignment;
- assignment does not automatically update workstream;
- downstream response does not automatically become presidential knowledge.

## 8.6 Historical index

- one canonical underlying occurrence remains owner truth;
- index entry is reference-only;
- substantive recipient content is not automatically exposed by index membership;
- decision authorship/presentation history gates the presidential projection.

## 8.7 Scope discipline

The candidate does not authorize:

- Housing integration;
- employment simulation;
- autonomous Congress;
- media/public belief;
- Population;
- general staff AI;
- playable UI;
- production migration;
- POP0-I4 behavior.

---

# 9. Repository and verification integrity

Verified candidate topology:

```text
a3766f6136a83b40409f6fadb2d54102a6357576
  → ab229cd4df4e60f33ab2799af7b67fb73d6a17b9
```

The candidate is exactly one commit above accepted I2 authority and adds exactly one documentation file.

Canonical GitHub Actions run:

```text
33332220707
```

completed successfully at exact candidate SHA `ab229cd4df4e60f33ab2799af7b67fb73d6a17b9`.

No implementation authority follows from a documentation-only green CI run.

`main` and the POP production merge-base invariant remain controlled by the accepted baseline:

```text
44c1724962830225e6fc34f41d0df0cfdb7dfec0
```

---

# 10. Required disposition

## **REVISE POP0-I3 DESIGN ONLY**

Produce one bounded documentation-only repair to `15_POP0_I3_EXECUTABLE_CONTRACT.md` that closes:

1. one canonical append-only escalation/reserved-review lifecycle model;
2. exact deadline/default/due-review same-instant processing and coarse/fine rules;
3. typed configured recipient jurisdiction/capability authority with no office-ID hardcoding;
4. exact preview-to-authorized-instrument equivalence;
5. reserved-review Attention knowledge safety;
6. idempotent ControlBinding reconciliation/load semantics.

Retain the rest of the I3 contract unless a direct consequence requires narrow wording adjustment.

Do not implement I3.
Do not begin I4.
Do not modify `main`.

After repair, stop for detached unchanged-gate I3 design re-audit.
