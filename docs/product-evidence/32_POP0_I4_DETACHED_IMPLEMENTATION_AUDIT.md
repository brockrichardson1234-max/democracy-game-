# POP0-I4 — Detached Implementation Audit

Status: **DETACHED IMPLEMENTATION AUDIT — REVISE. NOT POP0-I4 ACCEPTANCE AUTHORITY, NOT POP0-I5 AUTHORITY, NOT MAIN-BRANCH AUTHORITY.**

Audited implementation candidate:

`377a9e0c004bca8fce8159acf35bbd40f969c298`

Implementation authority:

`220467cc5d7ba6983491175b2b4799850538506a`

Accepted repaired design:

`c5185a069aea954379a46f6741748dcc2a8b7ebf`

Final detached design PASS:

`adadf3c6549e969d28bcfa140c5c8385c5f51bf0`

Accepted production merge base / unchanged main:

`44c1724962830225e6fc34f41d0df0cfdb7dfec0`

Canonical exact-SHA CI:

`33423167754` — **SUCCESS**

---

# 1. Verdict

## **REVISE — 3 BLOCKING BOUNDED SEMANTIC FINDINGS**

The implementation is structurally strong and substantially conforms to the accepted I4 design, but three evidence/causality defects prevent acceptance:

1. the opening Housing monitoring artifact observes material-owner state from **after** its declared observation instant;
2. generated I4 supplemental/handling provenance is caller-writable instead of being authenticated to the configured I4 provenance root;
3. the reference-only historical index fabricates a lower-owner occurrence identity for supplemental-record supply that does not exist in canonical lower-owner state.

These are bounded I4 repairs. They do not justify redesigning the direct lower-owner composition, the presidential intervention chain, or the I3 substrate evolution.

---

# 2. Repository and scope integrity — PASS

The implementation candidate is exactly one commit above implementation authority `220467cc5d7ba6983491175b2b4799850538506a`.

The active branch pointed exactly to `377a9e0c004bca8fce8159acf35bbd40f969c298` at review start.

`origin/main` and the merge base remain exactly:

`44c1724962830225e6fc34f41d0df0cfdb7dfec0`

No POP0-I5 implementation, playable UI, employment world, autonomous Congress, media/public-belief system, healthcare condition, Population owner, new presidential instrument family, production migration, or main modification entered the candidate.

The move-not-copy I6/I7 content extraction is narrow: the owner configuration/seeds moved into `i6-owner-content.ts` / `i7-owner-content.ts`, while the existing broad production bundle modules re-export and compose those same authoritative values rather than maintaining a POP copy.

---

# 3. R4I-01 — BLOCKING — Opening monitoring artifact reads future material-owner state

## Finding

The configured opening chronology is:

```text
monitoring observation: 2029-02-05T07:50:00-05:00
information routing:    2029-02-05T07:55:00-05:00
POP epoch:              2029-02-05T08:00:00-05:00
```

But `createOpeningLowerOwners()` advances `IntegratedMaterialHousingState` from the Palms-release instant all the way to the **08:00 POP epoch** before returning the owner state.

`createOpeningHousingComposition()` then creates the 07:50 monitoring artifact from that already-08:00 owner state.

The two material-Housing project claims make the mismatch explicit:

```text
observedAt:       07:50
sourceOccurredAt: 08:00
sourceRecordHash: hash(project state already advanced to 08:00)
```

The artifact therefore claims to be a 07:50 observation while authenticating a future project snapshot.

## Why current validation misses it

The generic information validator checks artifact and observation chronology relative to current time, but it does not require each monitoring claim's `sourceOccurredAt <= observedAt`.

The Housing validator compares the persisted monitoring artifact against an expected artifact generated from the same flawed 08:00 opening state, so the invalid future snapshot self-authenticates.

This violates the accepted I4 contract's observation boundary: an artifact may observe only lower-owner records/state completed no later than its declared observation/as-of instant.

## Required bounded repair

- Construct/reconcile the lower owner states through the exact monitoring observation instant first.
- Create and authenticate the monitoring artifact from that 07:50 state.
- Then advance the direct lower owner states from 07:50 to the 08:00 POP epoch without rewriting the historical monitoring artifact.
- Add live/restore validation that every monitoring claim source occurrence/effective time is no later than the claim observation instant.
- Add a hostile proof that a claim or source hash derived from post-observation material state is rejected even if the outer artifact hash is recomputed consistently.
- Preserve Palms autonomous progression and all existing opening facts at the 08:00 epoch.

---

# 4. R4I-02 — BLOCKING — Generated I4 provenance is caller-writable

## Finding

The accepted I4 design binds the generated supplemental record to the configured proof provenance, including `CONFIGURED_SYNTHETIC_PROOF_ROOT`.

However `authorDepartmentSupplementalRecord()` accepts `provenanceReference` from its caller and writes that value into both:

- the immutable `DepartmentSupplementalRecordArtifact`; and
- its `OfficeArtifactProductionRecord`.

`submitDepartmentHandling()` likewise copies caller-supplied `provenanceReference` into the canonical handling occurrence.

The semantic validators verify identities, target scope, source lineage, hashes, officeholder authority, chronology, and lower-owner correspondence, but they do not bind these generated I4 provenance fields back to `configuration.provenanceReference` or another exact configured authority value.

For the supplemental artifact, recomputing `canonicalArtifactHash` over a substituted provenance value can therefore make the rewritten provenance self-consistent rather than unauthorized.

This means both live operations and restore can accept a provenance identity chosen by the caller/attacker instead of the accepted I4 provenance authority.

## Required bounded repair

- Do not accept free provenance selection for these I4 operations, or reject any input that differs from the exact configured provenance.
- Require the supplemental artifact, its production occurrence, and Department handling submissions to carry their exact configured provenance/authority binding.
- Live and restore validation must enforce the same rule.
- Add hostile tests for:
  - live supplemental authoring with substituted provenance;
  - live Department handling with substituted provenance;
  - persisted artifact + production provenance rewritten together with a recomputed artifact hash;
  - persisted handling provenance substitution.

No generalized provenance framework is required.

---

# 5. R4I-03 — BLOCKING — Reference-only history invents a supplemental lower-owner occurrence

## Finding

For each canonical `SUBMIT_SUPPLEMENTAL_RECORDS` handling occurrence, `expectedI4HistoryEntries()` creates an additional history entry:

```text
occurrenceId: <handling-id>.lower-owner-result
ownerId:      implementation owner
recordKind:   LOWER_OWNER_RESULT
ownerRecordId: <waiver request id>
parent:        <handling-id>
```

But the accepted lower-level `supplySupplementalWaiverRecords()` transition does not create an immutable lower-owner occurrence/result record. It mutates the existing `WaiverRequestRecord.supportingRecords` and returns the new `ProgramImplementationState`.

The `<handling-id>.lower-owner-result` occurrence identity therefore exists only in the historical index. The index is not referencing canonical lower-owner occurrence truth; it is creating the occurrence it claims to index.

That contradicts the accepted reference-only history boundary and the one-owner-per-occurrence rule.

The later waiver determination/material inputs do not have this defect: they are real canonical lower-owner records and the history index references their real identities.

## Required bounded repair

Choose the smallest authority-correct representation:

- either stop emitting the synthetic supplemental `LOWER_OWNER_RESULT` history occurrence and retain only references to canonical occurrences/records that actually exist;
- or, only if genuinely necessary, introduce a canonical lower-owner supplemental-supply occurrence under the actual implementation owner and have history reference that real occurrence.

The historical index itself may not be the sole owner/source of an occurrence identity.

Add a hostile/assertion proof that every I4 `LOWER_OWNER_RESULT` history entry corresponds to a real canonical lower-owner result/occurrence rather than a history-authored synthetic identity.

Do not broaden the historical index into an owner.

---

# 6. Major implementation areas that pass

Subject to the three bounded repairs above, the audit found the central I4 architecture credible:

- direct canonical `ProgramImplementationState` — PASS;
- direct canonical `IntegratedMaterialHousingState` — PASS;
- stateless/non-owning Housing adapter boundary — PASS;
- narrow move-not-copy I6/I7 owner-content extraction — PASS;
- exact two-workstream/two-escalation-rule I3 substrate — PASS;
- receipt-based Housing escalation eligibility — PASS;
- Department possession / Secretary receipt / Chief-of-Staff receipt / presidential presentation / Attention separation — PASS;
- presidential decision does not directly mutate either lower owner — PASS;
- existing I3 instrument kinds only — PASS;
- recipient disposition and assignment remain recipient-owned — PASS;
- raw supplier evidence is not treated as the missing record — PASS;
- options memorandum is not treated as the missing record — PASS;
- supplemental artifact requires complete Secretary raw-evidence receipt — PASS;
- canonical Department handling occurrence is distinct from lower implementation result — PASS apart from provenance binding;
- implementation determination and material-input generation remain lower-owner outcomes — PASS;
- exact material-input admission precedes later Housing-owned physical progress — PASS;
- Palms autonomous background progression / independently blocked Stables — PASS;
- format-4 direct persistence, format-3 rejection, and no nested I10 save — PASS;
- load validates/copies rather than replaying I4 operations — PASS;
- structural POP boundary excludes I10 sessions, broad content bundles, Stage 1, Population, integrated information, global action APIs, and player-facing full state — PASS.

---

# 7. Verification evidence

Canonical GitHub Actions run:

`33423167754`

Exact SHA:

`377a9e0c004bca8fce8159acf35bbd40f969c298`

Conclusion:

**SUCCESS**

The canonical run executed the full `npm run verify` chain and reported:

- 61 / 61 test files PASS;
- 752 / 752 tests PASS;
- 24-module POP0-I4 structural graph PASS;
- 72-module production graph PASS;
- all four authenticated artifact reconstruction commands PASS;
- typecheck PASS;
- lint PASS;
- production build PASS;
- built-runtime verification PASS.

The green gate is valid evidence for the behavior it tests. It does not close R4I-01 through R4I-03 because those semantic cases are not currently represented by hostile assertions.

---

# 8. Repair boundary and stop gate

A repair should be restricted to R4I-01, R4I-02, and R4I-03 plus directly necessary tests/checks.

Do not redesign the accepted I4 architecture.

Do not begin POP0-I5.

Do not modify `main`.

Do not create new presidential instrument kinds, generalized staff AI, generalized provenance infrastructure, a new historical owner, or a replacement Housing owner.

After repair, run targeted I4 hostile/persistence tests, `verify:pop0-bounded` as development feedback, I6/I7 and I10 regressions, the expanded structural boundary checker, and canonical full CI at the exact repaired SHA.

Then stop for unchanged-gate detached implementation re-audit.

## **POP0-I4 IMPLEMENTATION — REVISE**
