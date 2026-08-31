# POP0-I4 — Detached Design Audit

Status: **DETACHED DESIGN AUDIT — REVISE. NOT POP0-I4 IMPLEMENTATION AUTHORITY, NOT POP0-I5+ AUTHORITY, NOT MAIN-BRANCH AUTHORITY.**

Audited design candidate:

```text
b99a33e88fbaa3ea58ff302737cd268dc3f4bb04
```

Direct parent / accepted verification-maintenance authority:

```text
d82b55a9441c4787230b2480ce6df633a0d48d31
```

Accepted POP0-I3 authority baseline:

```text
09121c2ca420655c12366f27305196068d4bdb9f
```

Accepted production merge base / unchanged `main`:

```text
44c1724962830225e6fc34f41d0df0cfdb7dfec0
```

Controlling candidate:

- `docs/product-evidence/28_POP0_I4_EXECUTABLE_CONTRACT.md`

Audit question:

> **Does this contract compose the accepted implementation and material Housing owners directly, surface one inherited problem only through legitimate agency/office/presidential information boundaries, and permit presidential requests to lead only through recipient- and owner-controlled handling—without duplicate truth, I10 wrapping, omniscience, direct Housing outcome control, or I5+ behavior?**

---

# 1. Verdict

## **REVISE — 3 BLOCKING EXECUTABLE-DESIGN GAPS, 3 NONBLOCKING WATCHPOINTS**

The product/owner direction is strong and should be retained.

The contract correctly chooses direct lower-level `ProgramImplementationState` and `IntegratedMaterialHousingState` composition, a stateless adapter, one-to-one HUD identity reconciliation, hidden lower-owner truth before discovery, I2/I3 information boundaries, existing presidential instrument families only, recipient-owned handling, delayed Housing-owned physical consequences, format-4 atomic persistence, and explicit I5+/UI exclusions.

However, the worked route cannot yet be implemented against the accepted I3/I2 substrate without making unreviewed choices in three places:

1. accepted I3 currently supports one configured workstream and only `SYNTHESIS_CONFLICT` escalation eligibility, while I4 requires a second Housing workstream and a receipt/assessment-driven Housing escalation;
2. the monitoring artifact is specified as claim-bearing cross-owner evidence, but the accepted I2 source-artifact shape cannot encode the required claim/source lineage and the contract does not define a typed authority that lets HUD observe exact Housing-owner facts;
3. the new Department handling submissions are declared actor-owned causal acts but have no canonical owner/persistence record, and the worked route does not define the provenance/creation route for the missing `NONAVAILABILITY_RECORD` that is later supplied to the lower owner.

These are design repairs, not a rejection of I4 architecture. No POP0-I4 coding is authorized.

---

# 2. R4D-01 — BLOCKING: accepted I3 substrate cannot represent the second Housing workstream/escalation as designed

## 2.1 Current accepted implementation boundary

The accepted I3 runtime configuration contains:

```text
workstreamDefinition: ConfiguredWorkstreamDefinition
```

singular, not a set of configured workstreams.

Runtime validation and workstream creation resolve every canonical workstream against that one definition. `createAdministrationWorkstream(...)` rejects an ID other than the configured singleton.

The accepted escalation eligibility configuration is also narrower than the I4 design assumes. `EscalationEligibilityRule.requiredBasisKind` is currently hard-typed and validated as:

```text
SYNTHESIS_CONFLICT
```

with required common-proposition and shown-synthesis-section fields.

I4 instead requires:

- the already accepted I3 workstream to remain valid;
- a second configured workstream `pop0.workstream.inherited-housing-implementation`;
- Chief-of-Staff escalation from a separately transferred/received Secretary assessment rather than the original I3 synthesis-conflict fixture.

The record type can express a `RECEIPT` basis, but the accepted configured eligibility rule cannot authorize it.

## 2.2 Why this blocks coding

Without a repaired contract the implementer must choose among unreviewed options:

- replace the accepted I3 singleton workstream with Housing;
- special-case Housing outside the configured workstream validator;
- silently generalize the singleton to an arbitrary catalogue;
- mislabel the Housing escalation as `SYNTHESIS_CONFLICT`;
- bypass escalation eligibility validation.

All would change accepted I3 semantics or create hidden special cases.

## 2.3 Required repair

Specify one bounded additive I3 substrate evolution.

At minimum:

1. replace the singleton configuration with an exact configured collection, e.g. `workstreamDefinitions`, containing **exactly the accepted I3 definition plus the one I4 Housing definition**;
2. make creation/restoration resolve a workstream by exact configured ID and reject unknown IDs, duplicate definitions, duplicate canonical workstreams, or ambiguous coordinator/authority mappings;
3. preserve all existing I3 workstream semantics and tests unchanged for the original workstream;
4. define a discriminated escalation-eligibility rule model that preserves the accepted `SYNTHESIS_CONFLICT` rule and adds exactly one bounded Housing receipt/assessment rule;
5. for the Housing rule, identify the exact required basis kind, source artifact kind/identity family, Chief-of-Staff substantive receipt requirement, minimum authorized sections, standing authority/workstream relation, local option kinds, and provenance;
6. prohibit office-ID/prefix special cases and prohibit an open-ended global workstream/escalation catalogue;
7. add counterfactuals proving the original I3 route still passes, unknown workstreams/rules reject, a mere metadata notice cannot satisfy the Housing escalation rule, and a valid transferred/received Housing assessment can.

The repair should evolve the accepted I3 substrate only as far as necessary to compose one second bounded workstream and one second bounded eligibility rule.

---

# 3. R4D-02 — BLOCKING: cross-owner Housing monitoring lacks an executable artifact/observation authority model

## 3.1 Intended rule

The candidate correctly says that lower-owner truth is not automatically office or presidential knowledge and that the stateless adapter must expose only a bounded, versioned HUD monitoring artifact with exact source references and `asOf` vintage.

That boundary is essential.

## 3.2 Current substrate mismatch

The accepted I2 `SourceEvidenceArtifact` contains artifact metadata such as:

- producer institution;
- `asOf` / created / released time;
- section IDs;
- access class;
- provenance/revision lineage.

It does **not** carry claim-by-claim lower-owner record/field lineage.

The I4 contract nevertheless requires a monitoring artifact that can substantively claim facts such as:

- exact Stables request/review state;
- missing record requirement;
- effective compliance hold;
- project stage and physical progress;
- Palms/Stables lower-owner history;

with “exact source owner/record IDs for every claim.”

The contract also mentions a configured “monitoring authority” but never defines its executable shape. As written, the adapter is allowed to read lower-owner state and manufacture the monitoring projection merely because the lower records exist.

That would leave the most sensitive cross-owner read boundary implicit.

## 3.3 Required repair

Define the minimum typed observation/evidence model.

At minimum:

1. add one explicit configured `LowerOwnerObservationAuthority` (name may differ) binding:
   - observing institution;
   - exact source owner identities;
   - exact permitted record kinds/project IDs;
   - permitted observable fields or claim families;
   - effective interval;
   - source configuration/authority reference;
   - provenance;
2. define one exact immutable I4 monitoring-artifact shape, either as a bounded new `PresidentialInformationArtifact` family or another equally explicit I2-compatible source-evidence shape;
3. each substantive claim must bind its value/claim family to exact lower-owner record IDs, owner identity, observation/as-of time, and permitted authority scope;
4. creation must reject future records, unrelated projects/recipients, fields outside authority, stale-current-value substitution, missing source records, or an absent/expired observation authority;
5. Department artifact creation/possession must remain separate from Secretary-office notice, entitlement, retrieval, receipt, assessment, Chief-of-Staff transfer/receipt, presidential presentation, and Attention;
6. restoration must rerun the same source/authority validation without rereading current lower-owner truth into the historical artifact;
7. hostile proof: identical lower-owner records with the observation authority removed/expired cannot produce or restore the same HUD monitoring artifact.

Do not solve this by treating the historical index, institution identity binding, adapter access, or global record existence as observation authority.

---

# 4. R4D-03 — BLOCKING: Department handling acts and the missing supplemental record lack canonical occurrence/provenance closure

## 4.1 Intended causal chain

The candidate correctly separates:

```text
office assignment/result
!= Department handling act
!= implementation-owner determination/material input
!= Housing input admission
!= physical Housing consequence
```

It also introduces two bounded post-assignment acts:

```text
SUBMIT_SUPPLEMENTAL_RECORDS
SUBMIT_WAIVER_REVIEW_INTENTION
```

This is the right conceptual seam.

## 4.2 Missing canonical owner/persistence location

The contract calls the handling submission an **actor-owned proposal/act**, but it does not state which canonical owner stores the immutable submission occurrence.

The format-4 contents enumerate I1-I3 owner state, lower-owner state, information/assignment/presentation state, workstream state, and history entries, but do not identify a state collection that owns Department handling submissions.

A stateless adapter cannot own them, and the lower implementation determination cannot substitute for the actor submission because the contract explicitly distinguishes the two.

Without a canonical occurrence, save/load/history cannot prove that the agency act existed separately from the lower-owner result.

## 4.3 Missing `NONAVAILABILITY_RECORD` provenance route

The lower-level `supplySupplementalWaiverRecords(...)` operation is intentionally abstract: it accepts `recordTypes[]` and adds those types to the request's supporting records. It does not itself preserve the source artifact/receipt that justified the supplied record type.

The I4 contract strengthens this by requiring `SUBMIT_SUPPLEMENTAL_RECORDS` to cite an “actually received/produced source record.” That is good, but the worked proof never defines where that source record comes from.

At opening the `NONAVAILABILITY_RECORD` is explicitly missing. The Secretary later retrieves the monitoring artifact and completes an analysis assignment, but neither the accepted `AssessmentArtifact` shape nor the candidate worked trace creates an exact supplemental-record artifact with record type and source lineage.

The route currently jumps from “assignment result/options artifact” to “submits the supported supplemental record.”

## 4.4 Required repair

Close both occurrence ownership and source provenance.

At minimum:

1. assign Department handling submissions to one existing or narrowly added canonical owner; the simplest acceptable model is an append-only Secretary/HUD office-operation occurrence collection if it remains clear that the **act** is office/officeholder-owned and the **result** remains lower-implementation-owner truth;
2. define the exact immutable submission record fields:
   - submission ID/dedupe identity;
   - kind;
   - submitting office and officeholder assignment;
   - Department handling authority ID;
   - source recipient disposition/assignment/result refs;
   - target institution/request/project/scope;
   - submittedAt;
   - exact payload;
   - provenance;
3. include submissions in format-4 validation/copy/save/restore/history indexing while keeping lower-owner determinations/material inputs separate;
4. define the exact source for `NONAVAILABILITY_RECORD` after opening:
   - which artifact/office may author or receive it;
   - what typed record/section identifies it as the required record type;
   - what source evidence/lineage supports it;
   - how it reaches the submitting Secretary office;
5. require `SUBMIT_SUPPLEMENTAL_RECORDS` to persist the exact source artifact/receipt/section reference that authorizes converting that evidence into the lower-level `recordTypes[]` call;
6. a monitoring artifact that merely says “the record is missing” or an options memorandum that merely recommends obtaining it must not count as the missing record itself;
7. live and restore counterfactuals must reject:
   - fabricated record type with no qualifying source artifact/receipt;
   - source artifact owned/received by another office only;
   - wrong request/project/scope;
   - handling submission without a valid assignment result/authority;
   - lower-owner determination with no corresponding handling submission on the worked route;
8. keep the lower owner free to reject an unsupported intention under its own sufficiency/review rules.

The repair need not add a general document-production or staff-AI system; one bounded supplemental-record source/product path is sufficient for I4.

---

# 5. What passes and should be retained

Subject to R4D-01 through R4D-03, the following design choices are strong and should not be reopened unnecessarily.

## 5.1 Direct lower-owner composition — PASS

The contract directly composes `ProgramImplementationState` and `IntegratedMaterialHousingState` and explicitly forbids nested I10 state, `ProductionGameView`, synchronized snapshots, POP-specific copies of lower owner interfaces, and adapter-owned current Housing truth.

The accepted implementation `MaterialInputRecord -> AcceptedMaterialInputReference` handoff is preserved as a cross-owner acceptance relation rather than duplicate ownership.

## 5.2 Institution identity reconciliation — PASS

The POP HUD institution and lower-level `us.institution.hud` are reconciled with one configured one-to-one namespace binding rather than label inference or duplicate actors.

The candidate correctly keeps Department possession distinct from Secretary-office knowledge.

## 5.3 Opening/prehistory construction — PASS

The inherited problem is created by replaying accepted lower-level operations through dated owner transitions rather than loading I10, patching a desired final object, or setting a `hiddenProblem` flag.

Palms and Stables have separate causal routes, and no post-opening presidential/agency outcome is scripted.

## 5.4 Presidential and recipient boundaries — PASS

I4 introduces no new presidential instrument family and does not encode grant/deny/return, record supply, material input, project stage, payment, or physical result into the presidential payload.

Dispatch, office receipt, disposition, assignment, assignment result, Department action, lower-owner result, Housing input acceptance, physical advancement, and return presidential knowledge remain distinct in the contract.

## 5.5 Time/background autonomy — PASS

Palms may advance in background time without presidential Housing action while Stables remains blocked under its effective hold. The candidate does not invent substitute drama when the player does nothing.

The cross-owner implementation-input -> Housing-admission -> Housing-stage -> elapsed physical progress ordering is appropriately explicit.

## 5.6 Persistence principles — PASS

Format 4 is specified as an atomic expansion with direct lower-owner state, no opaque format-11 save, no adapter cache, no duplicate Housing summary/problem flag, no derived Attention/workstream current-state cache, and no load-time action replay.

## 5.7 Scope discipline — PASS

Employment, Congress, governors, organizations, media, public belief, healthcare, ordinary Population, generalized staff AI, new presidential instrument kinds, succession/control changes, UI, rollback, product balancing, and I5+ behavior remain excluded.

The behavior-preserving I6/I7 content extraction is acceptable in principle because it is explicitly move-not-copy, narrow, and regression-preserving.

---

# 6. Nonblocking implementation watchpoints

1. **Content extraction:** if I6/I7 content is extracted, prove old production exports and hashes remain byte/behavior equivalent and the POP graph does not acquire broad integrated-runtime dependencies through type-only or helper imports.
2. **Material-input reconciliation:** deriving “not yet admitted” inputs must be deterministic and exact across all directly composed inputs; do not special-case Stables/Palms IDs in the adapter's generic reconciliation logic.
3. **Verification:** `verify:pop0-bounded` remains development feedback only. Final I4 implementation review still requires the full accepted coverage gate plus direct I6/I7 and I10 regressions.

---

# 7. Repository/verification evidence

Verified candidate lineage:

```text
ca1c918c2e30e93a47be78d29d89a6f26743f58b
→ d82b55a9441c4787230b2480ce6df633a0d48d31
→ b99a33e88fbaa3ea58ff302737cd268dc3f4bb04
```

Relative to the prior detached maintenance audit, the two commits add only:

- `docs/product-evidence/27_VERIFICATION_MAINTENANCE_AUTHORITY.md`;
- `docs/product-evidence/28_POP0_I4_EXECUTABLE_CONTRACT.md`.

Canonical GitHub Actions run:

```text
33377130191
head SHA: b99a33e88fbaa3ea58ff302737cd268dc3f4bb04
conclusion: SUCCESS
```

`origin/main` remains:

```text
44c1724962830225e6fc34f41d0df0cfdb7dfec0
```

The branch pointed exactly at the audited candidate before this detached audit.

---

# 8. Required bounded repair

Repair only `docs/product-evidence/28_POP0_I4_EXECUTABLE_CONTRACT.md` unless a tiny directly necessary documentation reference adjustment is unavoidable.

Close exactly:

1. bounded multi-workstream + Housing escalation-eligibility evolution of the accepted I3 substrate;
2. typed lower-owner observation authority + claim-lineaged Housing monitoring artifact;
3. canonical Department handling-submission ownership/persistence + exact `NONAVAILABILITY_RECORD` source/provenance route.

Retain all other I4 choices unless directly affected.

Do not implement I4.
Do not begin I5.
Do not modify `main`.

Stop for unchanged-gate POP0-I4 design re-audit.

---

# 9. Final statement

## **POP0-I4 DESIGN — REVISE**

The direct Housing-adapter architecture is accepted as the direction of travel, but coding remains unauthorized until R4D-01 through R4D-03 are closed and the repaired design passes detached re-audit.
