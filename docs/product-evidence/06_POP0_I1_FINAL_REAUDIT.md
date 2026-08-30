# POP0-I1 — Final Detached Re-Audit

Status: **DETACHED PRODUCT-EVIDENCE AUDIT — NOT POP0-I1 ACCEPTANCE AUTHORITY AND NOT POP0-I2 IMPLEMENTATION AUTHORITY.**

Audited chain:

- accepted POP-0 executable-contract authority: `00ca4cb181f06b2ad3748f0a305abee775f0e578`;
- original I1 shell: `8920f260b89a77866d6e2aaad844ed420bfa5243`;
- initial boundary/restoration repair: `b031f47a6f5c901d7c76d26f011401f35a039620`;
- detached I1 audit: `c2054aa5c8bb607e9fd9b2f84d02548f0a53e8a6` — **REVISE**;
- CI ancestry-checkout repair: `8330d07ee3e643ce9c67b5e0bda44aeb04da3ce2`;
- legacy-test timeout hardening: `460a3acb9bcfd628895ad6908c04da3c79de076f`.

Accepted production merge base:

- `44c1724962830225e6fc34f41d0df0cfdb7dfec0`

Rejected Stage 1 commit:

- `a7e04ca78ba1ccb06d8dc3a4dfb0d43389804144`

Unchanged I1 audit question:

> **Can a separate production-shaped operating world be created without importing Stage 1, wrapping the I10 session, creating duplicate canonical state, or breaking the accepted I10 regression runtime?**

---

# 1. Verdict

## **PASS**

The repaired POP0-I1 chain satisfies the unchanged I1 gate.

The initial audit's only blocking finding was verification-environment incompatibility: the new ancestry verifier required `origin/main`, while the repository CI checkout used depth 1 and therefore did not create that remote-tracking ref. The first bounded repair changed CI to a full-history checkout so the verifier could prove the intended ancestry facts.

That exposed a separate verification fragility in three preexisting I6 persistence tests: their behavior remained correct but their historical per-test timeout budgets were too close to current GitHub-hosted-runner timing. A second bounded repair increased only those three timeout budgets, without changing assertions or runtime behavior.

The exact final repaired SHA has a successful complete GitHub Actions verification run.

No POP0-I2 behavior entered the repairs.

---

# 2. Exact final verification evidence

Final repaired implementation SHA:

```text
460a3acb9bcfd628895ad6908c04da3c79de076f
```

GitHub Actions run:

```text
33313400875
```

Result:

```text
CI: SUCCESS
npm run verify: PASS
```

The completed run establishes:

- POP0-I1 boundary verifier: PASS across 10 local modules;
- accepted merge-base check: PASS at `44c1724962830225e6fc34f41d0df0cfdb7dfec0`;
- Stage 1 / legacy session / global action / audit dependency exclusions: PASS;
- production import graph: PASS across 70 local modules;
- authenticated topology/I4/I6/I7 artifact reconstruction: PASS;
- lint/typecheck: PASS;
- 49/49 test files: PASS;
- 657/657 tests: PASS;
- targeted `pop0-i1-operating-composition.test.ts`: 4/4 PASS;
- I10 convergence and bounded-repair suites: PASS;
- production build: PASS;
- built production-runtime check: PASS.

The final I6 persistence suite completed all six existing semantic tests successfully after timeout hardening. No assertion was removed, weakened, skipped, or converted into a smoke test.

The earlier implementation report also recorded a full local verification PASS on the same runtime/content code before the CI-only checkout and timeout-budget repairs. This re-audit independently relies on the exact-SHA canonical CI run above for final acceptance evidence.

---

# 3. R1-01 is closed

## 3.1 Ancestry verifier now runs in canonical CI

The workflow checkout now provides the history and remote refs required by `check-pop0-i1-boundaries.mjs`.

The exact successful run logs show:

```text
fetch-depth: 0
```

and then:

```text
POP0-I1 boundary verified across 10 modules at accepted base
44c1724962830225e6fc34f41d0df0cfdb7dfec0:
no Stage 1, legacy session, global action surface, or audit dependency.
```

The repair therefore preserves rather than weakens the intended claims:

1. current branch merge base is the accepted production baseline;
2. current `main` remains at the accepted production baseline during this proof;
3. Stage 1 is absent from ancestry;
4. the proof import closure excludes the forbidden legacy/action/audit surfaces.

## 3.2 Timeout hardening is verification maintenance, not semantic change

After ancestry verification was fixed, three unchanged I6 tests exceeded their historic timeouts on the current hosted runner by small margins.

The same tests had passed on accepted-baseline CI and continued to pass semantically on the repaired branch. The final bounded repair changed only their maximum allowed test durations:

- first I6 persistence test: default 10s → 20s;
- generated-state tamper test: 45s → 75s;
- dynamic-boundary test: 20s → 35s.

Assertions, test bodies, runtime source, owner transitions, save semantics, and expected outcomes were unchanged.

The exact final CI run then completed all 657 tests successfully.

This does not weaken the I1 product boundary or create new runtime authority.

---

# 4. I1 substantive composition remains clean

The implementation still creates an independent proof operating world rather than wrapping I10.

The canonical POP shell contains:

```text
schemaVersion
operatingStateId
configuration identity
ownerStates.calendar
```

The current direct owner is the accepted calendar state under a proof-owned calendar identity.

The proof factory and persistence path do not embed or consume:

- `IntegratedPartialRuntimeSession`;
- current `ProductionGameSession`;
- `ProductionGameView`;
- `availablePlayerActions`;
- `dispatchPlayerCommand`;
- Stage 1 attention helpers;
- an opaque I10 save;
- a synchronized second I10 world.

The proof-specific configuration/scenario/state/calendar identities and February 2029 epoch remain in the content package rather than the general session/runtime shell.

---

# 5. Save/restoration gate remains satisfied

The I1 POP save envelope:

- has a distinct format version;
- stores the proof configuration identity;
- stores direct canonical operating owner state;
- validates exact supported shapes;
- validates configuration identity/hash compatibility;
- validates owner identity and calendar consistency;
- returns defensive copies;
- restores a changed/non-opening calendar state idempotently;
- does not contain an I10 save string or duplicate legacy state.

The final repairs did not change persistence code.

---

# 6. Scope gate remains satisfied

No later-increment product behavior entered I1.

Still absent:

- playable UI;
- White House/Cabinet office simulation;
- assignments or office queues;
- knowledge/receipt/presentation ledger;
- staff assessment/synthesis;
- Presidential Attention;
- administration workstreams;
- typed presidential instruments;
- dispatch/recipient response;
- inherited Housing adapter;
- Labor/employment mechanism;
- Congress-owned POP initiative;
- governors/organizations/media proof behavior;
- quiet maternity-service mechanism.

This is still an operating-composition and persistence shell only.

---

# 7. Carried watchpoints

The initial audit's three nonblocking watchpoints remain active for later increments.

## 7.1 Full canonical state is not a future player API

`getOperatingState()` is acceptable as I1 test/composition evidence. Before player-facing code is introduced, the playable graph must consume bounded projections rather than unrestricted canonical state.

## 7.2 Persistence growth must remain atomic

When I2 adds canonical administration/knowledge state, type definition, validation, copy logic, serialization, parsing, and restoration tests must expand together. No owner state may be omitted and silently regenerated.

## 7.3 Boundary evidence must grow with the product graph

The current lexical/static-import checker is adequate evidence for the tiny I1 graph. Later increments must add structural/product-entry checks appropriate to the actual playable graph and must not equate a harmless method name with semantic safety.

These watchpoints do not block I1 acceptance.

---

# 8. Final unchanged-gate result

The repaired I1 candidate demonstrates that a separate production-shaped operating world can be created while:

- retaining the accepted I10 runtime independently;
- remaining rooted at the accepted production baseline;
- excluding Stage 1;
- excluding legacy global player-action orchestration;
- serializing direct canonical proof owner state;
- preserving configuration identity;
- passing complete regression verification.

## **FINAL I1 VERDICT: PASS**

A separate acceptance action may now accept POP0-I1 and authorize **POP0-I2 only**.

This audit does not itself authorize I2.