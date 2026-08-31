# Verification Maintenance — Single-Pass Report

Status: **IMPLEMENTATION CANDIDATE EVIDENCE. NOT MAINTENANCE ACCEPTANCE, NOT POP0-I4 IMPLEMENTATION AUTHORITY, NOT MAIN-BRANCH AUTHORITY.**

Authority:

- accepted POP0-I3 authority: `09121c2ca420655c12366f27305196068d4bdb9f`;
- lean maintenance design: `bc8f64f5bc758128c6c762ff8c33b3296429b8d1`;
- detached design PASS: `971fb70146d32d9a9ccfa1b32af7262e0d484a8c`;
- implementation authority: `1a1e98da40a5a60d99c9f69d75e643d1d0fc8a47`;
- maintenance implementation commit: `b0cdff5bdf27770a4c402fb52a3e3dc585d2941d`;
- accepted production merge base / unchanged `main`: `44c1724962830225e6fc34f41d0df0cfdb7dfec0`.

The Git commit containing this report is the reviewable evidence tip. Its exact identity and the canonical CI run attached to it are reported in the implementation handoff and must be independently resolved by detached review; a document cannot contain its own Git object identity without changing that identity.

---

# 1. Baseline timing

Accepted source run:

```text
GitHub Actions run: 33350760877
SHA:                bc8f64f5bc758128c6c762ff8c33b3296429b8d1
runner:             ubuntu-latest, Node 22
Vitest workers:     1
result:             PASS
```

## 1.1 Top-level gate

| Phase | Accepted baseline |
|---|---:|
| Complete `npm run verify` step | 989.65 s |
| Typecheck | 22.03 s |
| Runtime/POP/production boundary checks | 0.77 s |
| Topology artifact rebuild | 0.24 s |
| I4 artifact reconstruction | 20.98 s |
| I6 artifact reconstruction | 2.41 s |
| I7 artifact reconstruction | 4.51 s |
| Lint | 4.98 s |
| Vitest reported duration | 927.69 s |
| Vitest test execution | 897.06 s |
| Vitest transform/import | 26.64 s |
| Production build | 4.67 s |
| Built-runtime check | 0.11 s |

The four standalone authenticated artifact commands total approximately 28 seconds. They are not the main cost center.

## 1.2 Expensive test set

The smallest set exceeding 80% of test execution time contains twelve files:

```text
730.04 / 897.06 seconds = 81.4%
```

| Rank | Test file | Baseline | Accepted invariant/regression | Action |
|---:|---|---:|---|---|
| 1 | `i8-bounded-repair.test.ts` | 94.43 s | I8 claimant authority, exposure conservation/tamper rejection, zero-lag ordering, observation semantics, bounded approximation | KEEP — distinct hostile repair coverage |
| 2 | `i5-persistence-time.test.ts` | 83.85 s | Save/restore across every fixed temporal boundary, coarse/fine equivalence, exact-once state, binding/config identity | MERGE repeated setup; retain all seven boundary assertions |
| 3 | `i6-integrated-persistence.test.ts` | 83.38 s | Generated/real-seed ownership, persistence tamper rejection, succession, dynamic boundary ordering | KEEP — distinct owner and hostile persistence coverage |
| 4 | `i10-bounded-convergence-repair.test.ts` | 69.64 s | Production authentication, autonomous sponsorship/organizations/finance, stay window, full black-box route | KEEP and strengthen as replacement proof |
| 5 | `i9-persistence.test.ts` | 65.36 s | Format-11 continuation, coarse/fine legal route, independent judicial and cross-owner tampering | KEEP — each tamper attacks a behavior-driving field |
| 6 | `i9-bounded-repair.test.ts` | 64.08 s | Respondent route, fixed stay cutoff, declaration ordering, legal chronology validation | KEEP — distinct repaired routes |
| 7 | `us-i4-provenance.test.mjs` | 63.93 s | Raw-source hashes, exact geography/population/CVAP/election reconstruction, hostile source mutations | MERGE fixture work by removing irrelevant ZIP compression |
| 8 | `i9-bounded-court-route.test.ts` | 48.88 s | Court causal ladder, public/hidden truth boundary, owner scope, stays/appeals, no rewind, succession | KEEP — distinct legal-owner behavior |
| 9 | `i5-election-succession.test.ts` | 40.82 s | Population-backed selection, electoral records, transfer, assignments/control | KEEP — distinct election/succession proof |
| 10 | `i10-runtime-convergence.test.ts` | 39.75 s | Production factory/graph, controlled choices, vertical route, persistence, succession, owner identities | RETIRE two dominated route proofs; keep remaining distinct proofs |
| 11 | `i5-bounded-repair.test.ts` | 38.25 s | Candidate actor closure, rollover snapshot causality, interval authority persistence | KEEP — distinct hostile identity coverage |
| 12 | `i8-information-public-response.test.ts` | 37.66 s | Information causal chain, observation, exposure, lag/framing, ordering, coarse/fine response | KEEP — distinct public-response behavior |

The profile showed why these files are expensive: one canonical integrated-session construction or restoration rebuilds approximately 1.3 seconds of baseline owner/artifact state. Tamper suites that intentionally restore many independently modified saves therefore remain costly but nonredundant.

---

# 2. Cleanup performed

## 2.1 I5 persistence fixture/assertion merge

Before:

```text
seven parameterized tests
-> two new opening sessions per boundary
-> one save/restore immediately before each boundary
```

After:

```text
one sequential proof
-> two opening sessions total
-> the same seven target/before pairs
-> save/restore still occurs immediately before every target
-> target-specific assertion message preserves failure diagnosis
```

The separate large-jump/fine-grained test continues to protect coarse advancement from opening.

The new 75-second aggregate ceiling covers seven cases in one test. It does not widen a per-case timeout to hide contention: the former seven 20-second ceilings allowed up to 140 aggregate seconds, and each retained boundary operation completed well below 20 seconds in the targeted run.

## 2.2 Provenance hostile-fixture merge

Three hostile ZIP mutations now use valid uncompressed ZIP members (`level: 0`) instead of spending CPU recompressing large source members whose compression ratio is irrelevant to the invariant.

Unchanged proof meaning:

- the same DBF/SHP identity swap is parsed and rejected;
- the same materially outside polygon is parsed and rejected;
- the same substantive CVAP mutation is parsed and changes the authenticated content hash.

No raw source, expected artifact, parser, reconstruction rule, or assertion changed.

## 2.3 I10 proof merge

Two proof identities in `i10-runtime-convergence.test.ts` were dominated by the stronger opposition-capability black-box route in `i10-bounded-convergence-repair.test.ts`.

The black-box route now also asserts the unique claims formerly carried by those proofs:

- released measurement and claim visibility;
- filed appeal status at the pre-transfer checkpoint;
- Housing acceptance of a government-input reference;
- loss of player command authority after opposition succession;
- post-transfer appellate resolution;
- persistent enacted law, fiscal authority/payment, legal record, information delivery, and Housing continuation.

The remaining runtime-convergence tests still separately protect exact production factory boot, React/import isolation, controlled action exposure, coarse/fine restoration, and owner identities.

## 2.4 Bounded POP development command

Added:

```text
npm run verify:pop0-bounded
```

It executes:

- full typecheck;
- runtime, POP0-I3, and production import boundaries;
- full lint;
- all ten `pop0-*` files (84 tests at this candidate);
- production build;
- built-runtime verification.

It is a development command, not acceptance certification. The canonical `npm run verify` script is unchanged and still executes the complete accepted I3 coverage set, including every kept/moved legacy proof and all authenticated artifact reconstruction.

No workflow selector, cache, scheduler, or generalized lane system was added.

---

# 3. Retirement record

Last passing source for both retired proof identities:

```text
bc8f64f5bc758128c6c762ff8c33b3296429b8d1
GitHub Actions run 33350760877
```

| Retired proof identity | Former invariant | Surviving replacement coverage | Reason |
|---|---|---|---|
| `i10-runtime-convergence` — “plays the canonical I3 through I9 vertical without an audit session or injected truth” | Normal production route, checkpoint restoration, legal/information visibility, Housing input linkage | Strengthened I10 black-box route plus the retained autonomous sponsor, organization, finance, and fixed-stay proofs | The black-box route traverses the same production-only causal path with more persistence checkpoints and now carries every unique terminal assertion. |
| `i10-runtime-convergence` — “proves ordinary opposition succession and persistent-world continuation on the normal production session” | Control loss without world loss; enacted/payment/information/legal continuity; post-transfer legal continuation | Strengthened opposition-capability I10 black-box route | Same configured opposition succession, broader end-state coverage, explicit unavailable command rejection, and post-transfer appellate resolution. |

No test file was deleted. Git history preserves both predecessor implementations.

The six former parameterized I5 boundary proof identities were assertion/setup-merged, not semantically retired: every target and assertion remains in the merged proof.

---

# 4. Targeted evidence

## 4.1 Changed proof slice

Command:

```text
npx vitest run \
  tests/i5-persistence-time.test.ts \
  tests/us-i4-provenance.test.mjs \
  tests/i10-runtime-convergence.test.ts \
  tests/i10-bounded-convergence-repair.test.ts \
  --reporter=verbose
```

Result:

```text
4 / 4 files PASS
32 / 32 tests PASS
209.37 seconds test execution
217.01 seconds total Vitest duration
```

Accepted baseline for the same four files:

```text
40 tests
257.17 seconds test execution
```

Observed reduction for the changed slice:

```text
47.80 seconds
18.6%
```

The test-count change is exactly:

```text
-6 parameterized identities from the retained seven-boundary assertion merge
-2 dominated I10 proof identities
no test file removed
```

## 4.2 Bounded POP command

Local Windows/D-drive measurement, one worker:

```text
npm run verify:pop0-bounded
45.62 seconds wall time
10 / 10 POP test files PASS
84 / 84 POP tests PASS
typecheck PASS
runtime/POP/production boundaries PASS
lint PASS
production build PASS
built-runtime verification PASS
```

## 4.3 Additional checks

```text
typecheck PASS
git diff --check PASS
```

---

# 5. Final accepted-coverage requirement

The final gate remains the accepted I3 semantic coverage set, not merely a script label.

At the report-bearing candidate SHA, canonical GitHub Actions must still execute and pass:

```text
58 test files
729 tests expected after the recorded proof merges
15-module POP structural graph
70-module production graph
typecheck
lint
all four authenticated artifact reconstruction commands
production build
built-runtime verification
```

The canonical `verify` command was not reduced or reordered.

Exact report-bearing SHA, canonical run ID, conclusion, and final comparable timing are supplied in the final handoff and must be checked directly by the detached reviewer against GitHub. If that exact-SHA run is not green, this candidate is not acceptable.

---

# 6. Remaining expensive work kept

The ten expensive files marked KEEP remain because the pass found no obvious domination that preserved all hostile failure classes. In particular:

- I6 and I9 tamper loops are expensive because each field is independently restored and rejected; combining attacks would weaken proof that each field is validated;
- I8 zero-lag, exposure, and public-response cases exercise different configurations and causal paths;
- election/succession tests cover Population and constitutional identities not replaced by later production-route happy paths;
- court-route tests distinguish causal/legal states that the persistence tests do not;
- full authenticated geography reconstruction remains necessary in the final acceptance set.

Further reduction would require either production/runtime changes, generalized cached validation, or a broader lane/dependency system. All are outside this authority and were not attempted.

---

# 7. Scope confirmation

Changed implementation files are limited to:

- `package.json`;
- `tests/i5-persistence-time.test.ts`;
- `tests/us-i4-provenance.test.mjs`;
- `tests/i10-runtime-convergence.test.ts`;
- `tests/i10-bounded-convergence-repair.test.ts`.

This report is the only maintenance evidence document added.

No production/runtime source, POP state/save/configuration, owner boundary, product fixture, workflow YAML, cache, scheduler, generalized lane system, or `main` content changed.

POP0-I4 implementation did not begin.

## **IMPLEMENTATION CANDIDATE — STOP FOR DETACHED REVIEW AFTER EXACT-SHA FULL PASS**
