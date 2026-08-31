# POP0-I3 — Detached Implementation Audit

Status: **DETACHED PRODUCT-EVIDENCE IMPLEMENTATION AUDIT — NOT POP0-I3 ACCEPTANCE AUTHORITY, NOT POP0-I4 AUTHORIZATION, AND NOT PRODUCT, UI, ROADMAP, EARLY-ACCESS, OR MAIN-BRANCH AUTHORITY.**

Audited authority:

- POP0-I3 implementation authority: `18_POP0_I3_IMPLEMENTATION_AUTHORITY.md` at `a4dbf3f4509b0f5f4968243a6dfbe9d47025cb34`;
- controlling repaired I3 contract: `15_POP0_I3_EXECUTABLE_CONTRACT.md` at `46402f7b856cb6c38fa993713fa2a48408d65ef9`;
- accepted POP0-I2 authority: `a3766f6136a83b40409f6fadb2d54102a6357576`;
- accepted production merge base: `44c1724962830225e6fc34f41d0df0cfdb7dfec0`.

Audited implementation chain:

1. `93b3381a1f25e7b875dfac9fc58f1339a34fe9bd` — POP0-I3 implementation;
2. `370c7dd9c9fe39b3549a70968c0e1f4adb4464cc` — two legacy verification-ceiling changes only;
3. `573c39ea55046b92fb3289690fbf780a88ff7c98` — deterministic bounded Vitest worker/timeout configuration.

Final audited implementation SHA:

```text
573c39ea55046b92fb3289690fbf780a88ff7c98
```

Audit question:

> **Does the implementation prove that valid I2 office information can become bounded Presidential Attention, workstream coordination, an authenticated presidential decision, visible typed instruments, explicit dispatch, and recipient-owned response—without a shared White House mind, global action IDs, hidden fan-out, direct presidential outcome control, duplicate truth, omniscient history, scope laundering, player-facing full state, or POP0-I4+ behavior?**

---

# 1. Verdict

## **REVISE — 3 BLOCKING SEMANTIC FINDINGS, 1 REQUIRED BOUNDED CONFORMANCE REPAIR, 3 NONBLOCKING WATCHPOINTS**

The implementation has the correct I3 architectural shape and satisfies most of the repaired contract.

It genuinely separates:

```text
I2 office knowledge
!= escalation
!= escalation presentation
!= Presidential Attention

PresidentialRecipientBinding
!= session-owned ControlBinding

presidential decision
!= authorized instrument
!= dispatch
!= technical delivery
!= recipient-office receipt
!= recipient disposition
!= office assignment
!= workstream transition
!= presidential return knowledge
```

It also correctly implements append-only escalation/review lifecycle, exact deadline processing, deterministic coarse/fine advancement, preview-to-instrument equality, narrow player-safe projections, typed recipient capabilities, a reference-only historical index, format-3 persistence, and structural POP boundaries.

However, three accepted causal boundaries are not actually closed by validation:

1. escalation and visible-instrument source references may cite globally existing records the escalating/presenting office did not possess or receive;
2. recipient refusal/delay constraints are typed but mostly not reconciled to the recipient's real capability/evidence/queue state;
3. a narrowed recipient disposition can be broadened again when creating the subsequent office assignment because assignment objective/evidence scope is not structurally bound to the accepted/narrowed scope.

A fourth persistence identity gap allows an `ENDED` ControlBinding to restore with an arbitrary substituted bound actor in the exact fixed I3 fixture.

These are bounded repair findings. They do not require redesigning Attention, workstreams, dispatch, persistence, or the I3 owner graph.

POP0-I4 remains unauthorized.

---

# 2. R3I-01 — BLOCKING: global occurrence existence can masquerade as office knowledge/support

## 2.1 Accepted rule

The I3 contract requires an escalation to contain:

> exact source record references available to the escalating office

and requires President-known material, staff-only material, and unpresented material to remain distinct.

Visible instrument previews are part of the bounded escalation presentation. Their behavior-driving source/presentation references therefore cannot become a side channel by which globally existing but unreceived office records enter presidential or recipient-visible context.

The historical index is explicitly noncognitive and must not function as knowledge authorization.

## 2.2 Implementation gap

The implementation has strong section-level checks for `staffOnlySourcePortions` through `officeHasArtifactPortion(...)`.

But two broader reference paths use global existence instead of recipient/office knowledge:

### Escalation source records and known claims

`assertEscalationRecord(...)` requires:

```text
sourceRecordIds include the basis synthesis
and every ID exists somewhere in allOccurrenceIds(state)
```

A `knownClaim` is then accepted when its source IDs are merely members of `escalation.sourceRecordIds`.

There is no proof that those other occurrence IDs were possessed, received, authored, or otherwise available to the escalating office.

### Visible instrument-preview source references

`assertPreview(...)` accepts `payload.sourceReferenceIds` when every ID exists in global `allOccurrenceIds(state)`.

It does not prove that the presenting office may disclose the reference, or that the President had been legitimately shown the referenced occurrence before it entered a visible preview.

The implementation therefore has two strong section-content gates sitting beside a weaker global-occurrence-reference gate.

## 2.3 Concrete exploit class

The accepted I2 state already contains office-specific records that exist globally but are not Chief-of-Staff knowledge, such as an OMB-owned retrieval/access-denial occurrence.

A hostile escalation can add such an occurrence ID to `sourceRecordIds`, then cite it as support for a new authored `knownClaim`.

Because the occurrence exists globally, the current validator accepts the source reference even though the Chief of Staff never received that OMB route record.

Likewise, a visible instrument preview can include a globally existing source occurrence ID even when that reference was not legitimately available for disclosure by the presenting office.

This recreates a shared-mind seam through reference metadata rather than artifact-section content.

## 2.4 Required repair

Introduce one recipient/office-aware reference-authorization layer used by both live operations and restoration.

At minimum:

1. classify which canonical record families an office may legitimately cite as substantive/source support;
2. require every escalation `sourceRecordId` and every known-claim source to be available to the escalating office through a typed owner/receipt/presentation/authority path, not merely global existence;
3. require every visible preview `sourceReferenceId` to be legitimately disclosable in the bounded escalation presentation;
4. preserve the distinction between:
   - office-known substantive content;
   - President-known presented content;
   - staff-only referenced content;
   - opaque/reference-only history membership;
5. do not make the historical index or `allOccurrenceIds(...)` a knowledge grant;
6. add hostile tests proving that:
   - an OMB-only retrieval/disposition cannot support a Chief-of-Staff escalation claim without a legitimate route;
   - a preview cannot reveal an unreceived/unpresented source reference merely because it exists globally;
   - legitimate office-owned/received and presidentially presented references still work;
   - save tampering with a globally valid but unauthorized source ID is rejected.

Do not solve this by hardcoding the proof IDs or by forbidding all cross-office references. The repair must preserve legitimate typed transfer/presentation routes.

---

# 3. R3I-02 — BLOCKING: typed recipient constraints do not prove the condition they claim

## 3.1 Accepted rule

The repaired contract defines these recipient constraints:

```text
NO_EFFECTIVE_RECIPIENT_CAPABILITY
REQUEST_OUTSIDE_CAPABILITY
MISSING_REQUIRED_EVIDENCE
OFFICE_QUEUE_OR_DEADLINE_CONSTRAINT
EFFECTIVE_AUTHORITY_NOT_YET_AVAILABLE
```

and explicitly requires:

> The constraint must reconcile to typed capability, I2 receipt/access, office queue/deadline, or effective-interval state. Free-form reason text may explain but cannot establish validity.

## 3.2 Implementation gap

`recordRecipientDisposition(...)` validates the enum and performs strong matching for `ACCEPTED_AS_REQUESTED` / `NARROWED` capability jurisdiction.

For `DELAYED` and `REFUSED`, however, most constraints are labels rather than causally validated conditions.

Examples:

- `MISSING_REQUIRED_EVIDENCE` is not recomputed against the recipient's actual I2 receipt/access scope;
- `OFFICE_QUEUE_OR_DEADLINE_CONSTRAINT` is not tied to any actual queue entry, deadline, assignment, or dated office constraint;
- `REQUEST_OUTSIDE_CAPABILITY` is not recomputed against the configured capability bounds;
- `NO_EFFECTIVE_RECIPIENT_CAPABILITY` can be asserted with `capabilityAuthorityId: null` without first proving that no matching effective capability exists;
- only the special `EFFECTIVE_AUTHORITY_NOT_YET_AVAILABLE` path performs a meaningful future-capability check.

The restored-state semantic validator repeats essentially the same gap.

The current counterfactual suite even demonstrates the weakness: it records a Chief-of-Staff refusal with `OFFICE_QUEUE_OR_DEADLINE_CONSTRAINT` and explanatory prose without constructing or citing an actual queue/deadline condition.

## 3.3 Narrowing conformance gap inside the same boundary

The analysis `NARROWED` validator checks `capability.mayNarrow`, general permitted product kinds, and a strict section/product change.

It does not fully enforce the repaired contract's narrower authority:

- the instrument payload's own `narrowingPermitted` flag must be true;
- a less-claiming product substitution must be in `permittedLessClaimingProductKinds`, not merely in the broader `permittedProductKinds` list.

A recipient capability cannot silently override a presidential instrument that did not permit narrowing.

## 3.4 Required repair

Create one shared recipient-constraint support validator used by operation-time and restoration validation.

Each claimed constraint must have typed support. At minimum:

- `NO_EFFECTIVE_RECIPIENT_CAPABILITY` => recompute that no effective matching capability exists;
- `REQUEST_OUTSIDE_CAPABILITY` => prove the instrument kind/product/scope exceeds all relevant effective capability bounds;
- `MISSING_REQUIRED_EVIDENCE` => prove the exact required artifact/section scope is absent from the recipient office's legitimate I2 receipt/access state;
- `OFFICE_QUEUE_OR_DEADLINE_CONSTRAINT` => cite and validate concrete office-owned queue/deadline/assignment evidence rather than free-form prose;
- `EFFECTIVE_AUTHORITY_NOT_YET_AVAILABLE` => preserve the existing future-effective-capability check and require it to become effective within the response window.

If the current disposition record cannot carry enough evidence for these validations, add the minimum typed constraint-source references rather than parsing `reason` text.

Also require:

- `NARROWED` only when both the recipient capability and the instrument payload permit narrowing;
- substituted less-claiming product kinds to come from the capability's `permittedLessClaimingProductKinds` where that mechanism is used;
- hostile live and save-tamper tests for every constraint kind and contradictory combination.

---

# 4. R3I-03 — BLOCKING: narrowed disposition scope can be broadened at the office-assignment handoff

## 4.1 Accepted rule

The contract requires the separately created recipient-owned assignment to satisfy all of:

```text
cites recipient disposition as typed authority
objective/product/evidence scope <= accepted or narrowed scope
belongs to recipient office queue
deadline compatible with disposition
existing I2 assignment validation succeeds
```

This is the point that proves the President's request did not directly create work and that a recipient's narrowing actually governs what work may subsequently be adopted.

## 4.2 Implementation gap

`createInstrumentAuthorizedAssignment(...)` currently validates:

- disposition exists and is accepted/narrowed;
- `authorityReference` equals disposition ID;
- `sourceReferenceIds` includes disposition ID;
- `expectedProductKind` equals the disposition's accepted product;
- lead office equals recipient office;
- deadline does not exceed `nextReviewAt` where supplied;
- a full accepted analysis assignment without substantive evidence is immediately blocked.

But it does not structurally bind the assignment's objective or source/evidence scope to the accepted/narrowed scope.

`OfficeWorkAssignment.objective` is free text, and the remaining source references may include broader globally valid records. No assignment field records the disposition's accepted section/action scope for later validation.

## 4.3 Concrete exploit class

After OMB narrows the request to a metadata/access-gap product with no substantive evidence sections accepted, a subsequent assignment can still use the accepted product-kind string while carrying:

- an objective describing broader substantive analysis; and/or
- source references to broader source/assessment records beyond the narrowed scope.

It passes the current I3 wrapper as long as the disposition ID, office, product kind, and deadline match.

The assignment does not itself grant information access, but it canonically broadens the authorized work objective/scope and defeats the recipient's narrowing boundary.

## 4.4 Required repair

Do not parse free-form objective prose.

Add the minimum typed assignment-authorization closure necessary to prove scope containment. For example, an I3 assignment authority/binding may carry or derive:

- source disposition ID;
- authorized product kind;
- authorized evidence artifact/section scope for analysis; or authorized coordination-action scope for coordination;
- any narrowed scope identity/hash;
- compatible deadline.

Then require both live and restoration validation to prove:

```text
assignment authorized scope <= disposition accepted/narrowed scope
```

and keep I2's ordinary assignment state as the semantic owner of queue/work status.

Add hostile tests proving a broader source/evidence scope is rejected even when product kind and office are unchanged.

---

# 5. C3I-04 — REQUIRED BOUNDED REPAIR: ended ControlBinding actor identity is not authenticated

The implementation correctly keeps ControlBinding session-owned, restores it without hidden reconciliation, rejects stale/tampered `ACTIVE` bindings, and round-trips valid `ENDED` bindings.

But the ended-state validator currently requires only:

- nonnull ended time/reason;
- ended time not after saved current time;
- a nonempty `boundOfficeholderActorId`.

It does not authenticate the ended binding's bound actor to the immutable identity of the configured initial I3 control binding.

In the exact I3 fixture no legitimate presidential identity transition occurs. A save can therefore substitute an arbitrary nonempty actor ID into an otherwise valid `ENDED` binding and still satisfy the semantic rule.

Repair by authenticating the immutable initial control-binding office/actor identity in configuration or another exact authority record and requiring both ACTIVE and ENDED bindings to preserve that identity. A later reviewed succession/control increment may add successor-binding creation; I3 must not anticipate it by allowing arbitrary ended actors.

Add a save-tamper test that changes only the ended binding actor and requires rejection.

---

# 6. What passes

Subject to Sections 2–5, the implementation genuinely satisfies the major I3 architecture.

## 6.1 Repository and boundary integrity

Verified:

- exact authority-to-candidate chain is three commits ending at `573c39ea55046b92fb3289690fbf780a88ff7c98`;
- the two follow-up commits are verification-only: legacy test ceilings, then deterministic bounded Vitest timeout/worker configuration;
- merge base remains `44c1724962830225e6fc34f41d0df0cfdb7dfec0`;
- rejected Stage 1 remains absent from the POP ancestry;
- `origin/main` remains unchanged;
- the structural POP checker traverses the proof graph and rejects Stage 1, whole I10 sessions, global action APIs, later domain owners, player-facing full state, and audit dependencies;
- no POP0-I4 domain behavior was introduced.

## 6.2 Lifecycle and deadline semantics

The implementation correctly provides:

- immutable escalation creation;
- append-only terminal escalation lifecycle;
- immutable reserved reviews plus append-only terminal lifecycle;
- derived active/due state;
- escalation default at the exact end-exclusive boundary;
- recipient `NO_ACTION_BY_DEADLINE` at the exact response boundary;
- mandatory dynamic-boundary processing inside `advanceTo(...)`;
- direct/fine/save-before-boundary equivalence;
- post-boundary save closure validation.

## 6.3 Attention and presidential knowledge

The implementation correctly requires a separate bounded escalation presentation before Attention/decision.

Reserved-review due Attention is derived without owner mutation and does not expose a new staff-only artifact merely because the artifact exists. The due projection asks presidential presentation history only whether an expected product was separately presented and does not copy the unpresented product identity/content into Attention.

## 6.4 Control separation

The I2 presidential recipient binding does not itself authorize decisions.

The ControlBinding remains session-owned, outside canonical world state. Load does not silently reconcile it. `reconcilePresidentialControl()` is an explicit session operation. The only defect is the ended-actor authentication gap in Section 5.

## 6.5 Preview and instrument equality

The implementation strongly enforces:

- fixed local option bundle;
- visible preview IDs/hashes in escalation presentation;
- decision preview IDs/hashes matching the selected presented option;
- exact number/order of authorized instruments;
- canonical payload hash equality;
- structural payload equality to the source preview;
- no I3 instrument revision behavior.

This successfully prevents hidden post-confirmation act mutation.

## 6.6 Dispatch and recipient separation

The implementation keeps authorization, dispatch, delivery, office receipt, disposition, assignment, and workstream transition as separate records/operations.

A failed dispatch does not create receipt. A later retry is immutable and separate. Receipt is exact-recipient scoped. Accepted/narrowed dispositions require a matching recipient capability. Recipient response does not automatically mutate the workstream.

## 6.7 Historical index and persistence

The historical index is reference-only and rebuilt/validated exactly against owner records. Its entries do not copy substantive record content. Same-instant causal parents are checked against fixed record-kind phases.

Format-3 persistence stores the ControlBinding in the explicit session envelope outside operating state, rejects format 2 rather than inventing I3 history, and demonstrates byte-stable checkpoints and no load replay.

## 6.8 Canonical CI

GitHub Actions run `33341560688` completed successfully at exact SHA:

```text
573c39ea55046b92fb3289690fbf780a88ff7c98
```

The canonical `verify` job passed typecheck, POP structural boundary validation, production import validation, authenticated artifact reconstruction, lint, the complete 57-file / 726-test suite, production build, and built-runtime validation.

This green run is valid evidence. It does not cover the hostile semantic cases in Sections 2–5.

---

# 7. Nonblocking watchpoints

## W3I-01 — Dispatching-office authority is still intentionally thin

A dispatch attempt validates that its dispatching office exists and records a path/provenance, but it does not yet model a general dispatch-authority topology.

That is acceptable for the bounded I3 internal proof. Do not later interpret it as proof that any office may route any presidential instrument in the full product.

## W3I-02 — Workstream source references are coordination links, not knowledge

Workstream source IDs are validated primarily for canonical existence/time rather than office receipt. This is acceptable only because the accepted contract states that linking an occurrence to a workstream creates no knowledge and the player-safe workstream projection does not dereference substantive source content.

If later workstreams expose authored summaries or evidence claims, they will need the same recipient-aware source authorization repaired under R3I-01.

## W3I-03 — verification ceilings/concurrency are evidence hygiene, not product semantics

The two post-implementation commits do not change assertions, fixtures, or runtime behavior. They are acceptable as verification repairs.

Continue tracking repeated timeout increases separately so performance regressions are not normalized indefinitely by wider ceilings.

---

# 8. Required disposition

## **REVISE POP0-I3 ONLY**

Repair only:

1. office/recipient-aware authorization of escalation claims and visible preview source references;
2. recipient constraint support reconciliation, including narrowing-permission/less-claiming-product enforcement;
3. assignment authorization scope containment after accepted/narrowed disposition;
4. ended ControlBinding immutable actor authentication;
5. hostile live/restoration tests for every repaired seam.

Retain the existing I3 owner composition, append-only lifecycle, deadline ordering, Attention model, workstream model, preview/instrument identity model, dispatch ladder, historical index, persistence format/schema versions, structural boundary checker, accepted I1/I2 behavior, and I10 regression gates unless a change is strictly necessary to close these findings.

Do not implement POP0-I4.
Do not add Housing, employment, Congress, media, public belief, Population owner, playable UI, global player actions, general staff AI, or later proof-thread behavior.
Do not modify `main`.

After repair, run targeted I1-I3 verification, the complete repository verify gate, and canonical GitHub Actions at the exact repaired SHA.

Then stop for unchanged-gate POP0-I3 implementation re-audit.
