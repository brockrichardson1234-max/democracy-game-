# POP0-I2 — Detached Implementation Audit

Status: **DETACHED PRODUCT-EVIDENCE IMPLEMENTATION AUDIT — NOT POP0-I2 ACCEPTANCE AUTHORITY, NOT POP0-I3 AUTHORIZATION, AND NOT PRODUCT, UI, ROADMAP, EARLY-ACCESS, OR MAIN-BRANCH AUTHORITY.**

Audited authority:

- POP0-I2 implementation authority: `11_POP0_I2_IMPLEMENTATION_AUTHORITY.md`;
- authority commit: `bdd7f6043dcbe6ec05e0f6757d474adfba2111fc`;
- controlling repaired contract: `08_POP0_I2_EXECUTABLE_CONTRACT.md` at `d4e5d5f0f1d5a715adfd1115b0b422df1d75e244`.

Audited implementation chain:

1. `22e093feaf0a755a01bfc147b5253870976695ad` — POP0-I2 office-information substrate;
2. `a932af4a64f8736321eb42dd7afa5eb21faffa8c` — timeout-only I9 CI repair;
3. `d20f7eb4eea04de0fd22eede7143a03349cc15ee` — timeout-only I4 CI repair.

Final audited implementation SHA:

```text
d20f7eb4eea04de0fd22eede7143a03349cc15ee
```

Accepted production merge base and unchanged `main`:

```text
44c1724962830225e6fc34f41d0df0cfdb7dfec0
```

Audit question:

> **Does the implementation prove independent office possession, retrieval, assessment, disagreement, synthesis, and bounded presidential presentation in one canonical world—without a shared White House mind, duplicate state, UI-only knowledge, player-facing full state, causal-history corruption, or POP0-I3+ behavior?**

---

# 1. Verdict

## **REVISE — 2 BLOCKING SEMANTIC FINDINGS, 2 REQUIRED BOUNDED CONFORMANCE REPAIRS, 3 NONBLOCKING WATCHPOINTS**

The implementation has the correct overall I2 architecture and fulfills most of the accepted contract.

It genuinely creates:

- six independent offices and six officeholder assignments;
- two distinct department institutions;
- seven restrictive zero-weight Population-linkage declarations;
- office-owned assignment queues;
- a noncognitive information-route ledger;
- separate possession, metadata notice, access, retrieval, substantive receipt, assessment, synthesis, and presidential-presentation records;
- evidence-derived Labor and NEC disagreement;
- OMB metadata-only/denied-access behavior;
- direct version-2 persistence;
- recipient-scoped office views;
- deterministic counterfactuals and a clean POP import graph.

The exact final implementation SHA also has a successful canonical GitHub Actions run.

However, two semantic gaps allow the central knowledge boundary to be violated despite the green tests:

1. a receipt for only part of an assessment can authorize synthesis over assessment content the receiving office never received;
2. restored saves can contain derived knowledge dated before its source evidence, receipt, assessment, or synthesis because the semantic validator does not enforce the full causal chronology.

These are blockers because I2 exists specifically to prove bounded office knowledge and historically truthful presentation.

Two smaller implementation/contract mismatches should be repaired in the same bounded cycle so every accepted operation produces a restorable state and every declared retrieval result has an honest meaning.

POP0-I3 remains unauthorized.

---

# 2. R2I-01 — BLOCKING: partial receipt scope can become full assessment knowledge during synthesis

## 2.1 Accepted rule

The I2 contract requires substantive receipt to be scoped to exact artifact sections.

The route ledger is noncognitive infrastructure. A receiving office may consume only the content actually received by that office.

Chief-of-Staff synthesis must preserve source assessments without citing or implying unseen content.

## 2.2 Implementation gap

`transferOfficeArtifact` correctly allows an office to transfer a bounded subset of an assessment's `sectionIds` and records that subset in `receivedSectionIds`.

But `authorOfficeSynthesis` then:

1. confirms only that a receipt exists for the assessment artifact;
2. resolves the complete `AssessmentArtifact` from the global ledger;
3. copies the assessment's entire `judgments` and `limitations` arrays into `preservedAssessments`.

It never establishes that the Chief of Staff received the sections containing those judgments and limitations.

`assertSynthesisArtifact` repeats the same gap during save restoration: it verifies that an assessment receipt exists, but does not verify that the receipt's section scope supports every preserved field.

## 2.3 Concrete exploit

A valid operation sequence can transfer only:

```text
assessment-summary
```

from Labor and NEC to the Chief of Staff.

The Chief of Staff can then author a synthesis that canonically preserves and exposes:

```text
all proposition judgments
all source limitations
```

because the implementation reads the complete ledger artifact after finding any receipt for it.

The receiving office has therefore gained substantive knowledge outside its receipt scope.

The ledger becomes a hidden shared mind at the precise point where the implementation claims to preserve disagreement through bounded transfers.

## 2.4 Why the current tests miss it

The positive proof fixture transfers all configured assessment sections.

The negative counterfactual withholds an entire assessment rather than transferring only a subset.

That proves whole-artifact isolation, but not section-scope isolation.

## 2.5 Required repair

Repair the smallest valid boundary.

At minimum:

1. declare which assessment semantic content belongs to which section IDs, or adopt an I2-specific rule that synthesis preserving all judgments and limitations requires receipt of every assessment section that carries those fields;
2. make `authorOfficeSynthesis` consume only receipt-supported content;
3. make `assertSynthesisArtifact` independently verify the same scope during restoration;
4. prevent source-lineage metadata stored globally from granting content the recipient did not receive;
5. add hostile tests proving:
   - summary-only receipt cannot preserve unseen judgments or limitations;
   - receiving the required sections allows the configured synthesis;
   - save tampering that narrows a source receipt invalidates a synthesis that still preserves the removed content;
   - one office's full receipt does not supplement another office's partial receipt.

Do not solve this by forbidding all partial receipts globally. Partial transmission is part of the accepted knowledge model.

---

# 3. R2I-02 — BLOCKING: restoration accepts causally impossible knowledge timestamps

## 3.1 Accepted rule

The repaired I2 contract requires the causal sequence:

```text
possession
→ index / notice
→ retrieval
→ substantive receipt
→ assessment
→ synthesis
→ presidential presentation
```

It also explicitly requires restoration to reject causal timestamp inversions.

Knowledge and presentation history must reflect what could have been received and known at that time.

## 3.2 What is enforced correctly

The implementation correctly enforces several early route relationships:

- index time cannot precede institution possession;
- notice time cannot precede index creation;
- retrieval request cannot precede notice;
- retrieval completion cannot precede request;
- technical-retrieval receipt cannot precede retrieval completion.

## 3.3 Missing chronology checks

The semantic restoration validator does not require:

- an assessment's source notices, retrievals, and receipts to exist at or before `assessment.createdAt`;
- `assessment.asOf` to be at or before its creation time;
- a transferred office artifact to have been created before the transfer receipt;
- a synthesis's source assessments and source receipts to exist at or before `synthesis.createdAt`;
- a shown artifact to exist and be available to the presenting office at or before `presentedAt`;
- revision and supersession relationships to form a fully acyclic forward historical graph.

Live operations normally avoid part of this problem because session time is nondecreasing and a referenced record must already exist in memory.

Persistence validation must nevertheless reject edited, corrupted, migrated, or malformed saves independently. It currently does not.

## 3.4 Concrete exploit

Starting from the valid completed I2 save, a save can be edited so that:

```text
Labor assessment createdAt = 08:20
Labor substantive receipt receivedAt = 08:30
```

or:

```text
Chief-of-Staff synthesis createdAt = 08:50
source assessment receipts receivedAt = 09:05
```

or:

```text
presidential presentation presentedAt = 09:00
shown synthesis createdAt = 09:15
```

while leaving the final current time after all records.

The exact-shape parser accepts the fields, and the semantic validator checks that the records exist and are not later than current time, but does not enforce these source-before-derivative relationships.

The restored history can therefore say the President or staff knew derived information before the source route occurred.

## 3.5 Required repair

Add semantic chronology closure to both live validation and restoration.

At minimum:

1. `asOf <= createdAt <= current` for derived artifacts;
2. every assessment source notice/retrieval/receipt used by the assessment must be dated no later than the assessment's creation;
3. every office-transfer receipt must be dated no earlier than the transferred artifact's creation and any required source-office authorship;
4. every synthesis source assessment and receipt must be dated no later than synthesis creation;
5. every shown presentation portion must belong to an artifact and office-access path that existed no later than presentation;
6. revision/supersession relationships must be forward-consistent and acyclic, including same-timestamp cases;
7. add save-tamper tests for each boundary above.

Same-timestamp causal work may remain legal if the model has a declared deterministic phase/order relationship. It may not rely on array or handler order.

---

# 4. C2I-03 — REQUIRED BOUNDED REPAIR: declared retrieval failures are unreachable and unrestorable

The public type declares four retrieval results:

```text
AVAILABLE_AT_OFFICE_BOUNDARY
ACCESS_DENIED
NOT_FOUND
FAILED
```

The accepted contract also describes technical retrieval and explicit failure.

But `attemptOfficeRetrieval` currently resolves solely from entitlement:

- entitlement exists → `AVAILABLE_AT_OFFICE_BOUNDARY`;
- entitlement absent → `ACCESS_DENIED`.

The state validator independently recomputes the same binary result and rejects `NOT_FOUND` or `FAILED` even though the type declares them.

Therefore the implementation cannot represent:

- valid access to a source that is no longer found;
- transport/storage/technical retrieval failure;
- a later retry after such failure.

Resolve this mismatch explicitly:

- either implement bounded, provenance-bearing `NOT_FOUND` and `FAILED` outcomes with deterministic fixture control and validation;
- or amend the I2 type/contract through review so those results are not falsely advertised as supported in this increment.

Do not model technical failure as `ACCESS_DENIED`; access and operational retrieval outcome are distinct.

---

# 5. C2I-04 — REQUIRED BOUNDED REPAIR: live-operation validation and save-parser validation are not closed under round trip

The exact-shape parser correctly rejects empty required strings.

Several public I2 operations and the runtime semantic validator do not enforce the same requirements before accepting state.

Examples include inputs where an empty string may be admitted for a new record identity, provenance field, or deduplication identity by the live operation, while the serialized result is later rejected by the parser.

Representative seams include:

- institution-possession identity;
- information-index identity/provenance;
- receipt deduplication identity;
- office-transfer receiving authority/deduplication;
- presidential-presentation deduplication identity.

The required invariant is:

> **Every state accepted by a public I2 operation and serialized by `save()` must be accepted by the I2 parser under the same authenticated configuration.**

Align operation-level and semantic-state validation with parser requirements and add round-trip hostile tests for malformed operation inputs.

This is not a request for duplicate validation architecture. One shared invariant layer is preferable.

---

# 6. What passes

Subject to the findings above, the implementation genuinely satisfies the major I2 structure.

## 6.1 Repository and boundary integrity

Verified:

- exact implementation authority parent: `bdd7f6043dcbe6ec05e0f6757d474adfba2111fc`;
- three-commit implementation chain ending at `d20f7eb4eea04de0fd22eede7143a03349cc15ee`;
- exactly fifteen changed files across the implementation chain;
- the two follow-up commits change only legacy test timeout ceilings from 10 to 30 seconds;
- merge base remains `44c1724962830225e6fc34f41d0df0cfdb7dfec0`;
- rejected Stage 1 remains absent;
- `origin/main` remains unchanged;
- no I10 whole-session wrapper, opaque I10 save, Population owner, existing integrated-information owner, global player-action dispatch, playable UI, Attention, workstreams, Housing adaptation, Labor domain, media, or autonomous Congress entered the POP graph.

## 6.2 Canonical owner composition

The implementation directly composes:

- calendar owner;
- administration-directory owner;
- partitioned office-operations owner;
- information-route owner;
- presidential-presentation owner.

Save format and operating schema are both version 2.

No parallel I10 world or sidecar knowledge state exists.

## 6.3 Offices, institutions, and actors

The implementation preserves:

- six office identities and independent office states;
- six officeholder assignments;
- a separate President recipient binding;
- Department of Labor and HUD institution identities distinct from leadership offices;
- seven exact I2-only `OUTSIDE_MODELED_ORDINARY_POPULATION_SCOPE` declarations;
- zero Population weight and prohibited ordinary-population joins;
- effective-role validation;
- multi-role office isolation.

## 6.4 Knowledge ladder

The implementation separates:

```text
artifact existence
≠ institution possession
≠ information index
≠ office metadata notice
≠ access entitlement
≠ technical retrieval
≠ substantive receipt
≠ assessment
≠ synthesis
≠ presidential presentation
```

Department possession alone cannot authorize the Secretary's assessment.

OMB cannot claim substantive evidence analysis after metadata notice and access denial only.

Recipient-scoped office views do not enumerate the complete ledger.

## 6.5 Disagreement and synthesis

The configured Labor and NEC conclusions arise through:

- the same source evidence version;
- different received scope/declared assumption support;
- configuration-authenticated assessment rules;
- typed office-owned authoring acts.

Removing the NEC assumption prevents the same configured judgment.

Withholding an entire source assessment prevents the configured synthesis.

The synthesis preserves the original source judgments rather than overwriting them.

## 6.6 Persistence and deterministic evidence

The suite proves:

- five nontrivial save checkpoints;
- byte-stable save/load/save;
- no replay or duplicate append on load;
- defensive full-state and office-view copies;
- deterministic continuation from the same saved disagreement state;
- I1 save-format rejection;
- exact-shape and selected ownership tamper rejection;
- same-time order invariance for the tested independent notice/queue operations.

## 6.7 Canonical CI

GitHub Actions run `33326889297` completed successfully at exact head SHA:

```text
d20f7eb4eea04de0fd22eede7143a03349cc15ee
```

The single `verify` job and its `npm run verify` step both concluded successfully.

Reported completed verification is consistent with:

- 52 test files;
- 683 tests;
- targeted POP0-I2 files and 30 tests;
- typecheck;
- lint;
- authenticated-artifact verification;
- production build;
- built-runtime verification;
- POP and production import boundaries.

The green run is valid evidence. It does not cover the hostile cases identified in Sections 2–5.

---

# 7. Nonblocking watchpoints

## W2I-01 — Boundary checker naming and growth

The I2 package script still invokes `check-pop0-i1-boundaries.mjs`, whose internal behavior has been advanced to I2.

This is functionally acceptable now, but the filename should not become misleading indefinitely as later increments add distinct graph obligations.

The fixed direct scan of current player-facing consumers is sufficient to show the current unchanged UI does not import POP full state. Later player-facing graphs require transitive reverse-boundary evidence rather than a permanent four-file list.

## W2I-02 — Typed fixture assessments are not staff AI

The configured assessment rules and authored acts correctly prove information ownership and support.

They remain proof machinery, not accepted autonomous staff reasoning. Later increments may not mistake configuration-authored conclusions for a completed adviser-behavior model.

## W2I-03 — Repeated legacy timeout increases need separate performance visibility

The two final candidate commits are genuinely timeout-only and leave all assertions intact.

They do not invalidate I2.

However, repeated widening of historical CI timeout budgets should eventually be tracked as hosted-runner/performance evidence rather than normalized indefinitely. A future performance regression should not be hidden by continuing to raise ceilings without measurement.

---

# 8. Required disposition

## **REVISE POP0-I2 ONLY**

Repair only:

1. section-scoped synthesis consumption and validation;
2. source-before-derivative timestamp and revision/supersession integrity;
3. honest support or explicit removal of unreachable retrieval outcomes;
4. operation/state/parser round-trip validation closure;
5. targeted hostile tests for those seams.

Retain:

- the current owner composition;
- office and institution identities;
- population-linkage boundary;
- route-ledger design;
- configured evidence and assessment rules;
- existing positive and counterfactual traces;
- save format/schema version unless the repair genuinely requires changing them;
- current I1/I10 regression boundary.

Do not:

- redesign I2;
- add general staff AI;
- add UI;
- add Presidential Attention;
- add workstreams or decisions;
- add Housing, employment, Congress, media, or other POP0-I3+ behavior;
- modify `main`;
- authorize POP0-I3.

After a bounded implementation repair, rerun the unchanged audit question and require canonical CI PASS at the exact repaired SHA.

---

# 9. Final audit verdict

## **REVISE**

The candidate establishes the correct administration-information substrate, but it does not yet fully enforce the two promises at I2's center:

```text
an office can use only the semantic content it actually received
```

and:

```text
derived knowledge cannot exist before its source route in restored history
```

Close those bounded seams and rerun the unchanged I2 implementation gate.
