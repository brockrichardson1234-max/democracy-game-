# Verification Maintenance — Detached Implementation Audit

Status: **DETACHED IMPLEMENTATION AUDIT — PASS. NOT MAINTENANCE ACCEPTANCE AUTHORITY, NOT POP0-I4 IMPLEMENTATION AUTHORITY, NOT MAIN-BRANCH AUTHORITY.**

Audited candidate tip:

`7e209431d617abba1604b1dd5353df0fb0e820ec`

Maintenance implementation commit:

`b0cdff5bdf27770a4c402fb52a3e3dc585d2941d`

Implementation authority:

`1a1e98da40a5a60d99c9f69d75e643d1d0fc8a47`

Accepted POP0-I3 authority baseline:

`09121c2ca420655c12366f27305196068d4bdb9f`

Accepted production merge base / unchanged main:

`44c1724962830225e6fc34f41d0df0cfdb7dfec0`

## Verdict

**PASS.**

The one-pass maintenance implementation satisfies the lean design and implementation authority without changing product/runtime behavior, accepted POP0-I1/I2/I3 semantics, POP state/save/configuration versions, workflow YAML, main, or POP0-I4 behavior.

The candidate reduces repeated verification work while preserving the accepted I3 full semantic coverage set for final certification.

## Repository and scope integrity

The authority-to-candidate delta is exactly two commits and six files:

- `package.json`;
- `tests/i5-persistence-time.test.ts`;
- `tests/us-i4-provenance.test.mjs`;
- `tests/i10-runtime-convergence.test.ts`;
- `tests/i10-bounded-convergence-repair.test.ts`;
- `docs/product-evidence/25_VERIFICATION_MAINTENANCE_REPORT.md`.

No production/runtime source changed.

The canonical `npm run verify` command remains semantically unchanged and still runs the accepted I3 full coverage set. The new `verify:pop0-bounded` command is a development convenience only and is not acceptance certification.

`origin/main` remains `44c1724962830225e6fc34f41d0df0cfdb7dfec0`.

## I5 persistence merge — PASS

The former seven parameterized save/restore boundary cases are consolidated into one sequential proof.

The repair preserves:

- the same seven exact target instants;
- the same seven exact immediately-before instants;
- a save/restore immediately before every target;
- comparison against a direct canonical path after every target;
- target-specific assertion labels;
- the separate coarse/fine, exact-once, tamper, transfer-binding, and configuration-identity tests.

The merged proof does not merely test the final endpoint. It compares resumed and direct state after every boundary, so an earlier restoration defect cannot silently survive to a later check.

The aggregate 75-second ceiling is not a weakened semantic gate relative to seven former 20-second test ceilings; it reduces repeated setup while keeping the assertions.

## I10 proof retirement — PASS

Two I10 proof identities were retired from `i10-runtime-convergence.test.ts` only after their unique claims were transferred into the stronger opposition-capability black-box route in `i10-bounded-convergence-repair.test.ts`.

The surviving black-box route uses the same forced-opposition configuration and now proves, in one production-only route with repeated restoration:

- enacted-law continuity;
- generated budget authority and payment continuity;
- filed legal appeal before transfer;
- public ruling and stay state;
- released measurement and claim visibility;
- completed information delivery;
- Housing acceptance of a government-input reference;
- opposition succession causing loss of player control;
- rejection of post-transfer player commands;
- world advancement after control loss;
- later Housing usability;
- post-transfer appellate resolution.

The retired vertical-route proof therefore has no surviving unique terminal assertion, and the retired opposition-succession proof is directly dominated by the same configured opposition black-box route with broader restoration and continuation coverage.

The remaining `i10-runtime-convergence` tests still protect distinct factory, controlled-action, deterministic restoration/coarse-fine, owner-identity, and import/production concerns.

## I4 hostile provenance fixture change — PASS

The three changed hostile ZIP fixtures switch generated mutated ZIP members to compression level 0.

This changes fixture CPU work only. The same mutated DBF/SHP/CVAP content is supplied to the same parser/reconstruction logic and the same semantic assertions remain.

ZIP compression ratio is not part of the accepted hostile invariants being tested, so removing compression does not weaken authentication or provenance coverage.

## Bounded POP development gate — PASS WITH SCOPE NOTE

`verify:pop0-bounded` runs:

- full typecheck;
- runtime, POP, and production structural checks;
- lint;
- current `pop0-*` test files;
- production build;
- built-runtime verification.

Measured local wall time is 45.62 seconds.

This is useful bounded development feedback and does not alter acceptance obligations. Its filename-based `pop0-` selection must not be generalized into proof that every future POP dependency is covered; final acceptance continues to require the full gate unless later authority explicitly changes that rule.

## Verification evidence

Canonical GitHub Actions run:

`33353033067`

Exact head SHA:

`7e209431d617abba1604b1dd5353df0fb0e820ec`

Conclusion:

**SUCCESS**

The run executed the unchanged full `npm run verify` chain and reported:

- 58 / 58 test files PASS;
- 729 / 729 tests PASS;
- 15-module POP graph PASS;
- 70-module production graph PASS;
- all four authenticated artifact reconstruction commands PASS;
- typecheck PASS;
- lint PASS;
- production build PASS;
- built-runtime verification PASS.

Comparable timing:

- accepted baseline full verify: approximately 989.65 s;
- candidate full verify: approximately 688.46 s;
- baseline Vitest duration: 927.69 s;
- candidate Vitest duration: 646.64 s.

The maintenance report correctly avoids attributing the full wall-clock delta to code changes. Its controlled changed-slice comparison records approximately 47.80 seconds of attributable test-execution reduction, with the remaining improvement treated as runner variance.

## Maintenance-report quality — PASS

The report identifies the measured 80% cost set, records Keep/Merge/Retire decisions, names replacement coverage for retired proofs, records the last passing SHA, preserves remaining expensive hostile proofs, and explicitly stops rather than inventing generalized caching or a dependency/lane framework.

This satisfies the lean-design goal: reduce obvious waste without creating a second governance program.

## Carried watchpoints

1. `verify:pop0-bounded` remains development feedback only; filename selection is not a dependency-closure guarantee.
2. Do not consolidate expensive tamper loops merely because they are slow when they independently prove rejection of distinct behavior-driving fields.
3. If future test growth again makes the full gate materially expensive, measure first and prefer repeated-setup removal before generalized verification infrastructure.
4. Verification runtime improvement must continue to be reported separately from runner variance.

## Final statement

**LEAN VERIFICATION-MAINTENANCE IMPLEMENTATION — PASS.**

This audit is detached review evidence only. Maintenance acceptance requires a separate explicit authority action. POP0-I4 implementation remains unauthorized by this document.
