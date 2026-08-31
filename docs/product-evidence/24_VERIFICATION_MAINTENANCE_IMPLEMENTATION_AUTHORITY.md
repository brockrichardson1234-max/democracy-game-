# Verification Maintenance — Implementation Authority

Status: **ONE BOUNDED MAINTENANCE IMPLEMENTATION PASS AUTHORIZED. NOT MAINTENANCE ACCEPTANCE, NOT POP0-I4 IMPLEMENTATION AUTHORITY, NOT MAIN-BRANCH AUTHORITY.**

Authority chain:

- accepted POP0-I3 authority: `09121c2ca420655c12366f27305196068d4bdb9f`;
- lean maintenance design: `bc8f64f5bc758128c6c762ff8c33b3296429b8d1`;
- detached design PASS: `971fb70146d32d9a9ccfa1b32af7262e0d484a8c`;
- unchanged production main: `44c1724962830225e6fc34f41d0df0cfdb7dfec0`.

Controlling design:

`docs/product-evidence/22_VERIFICATION_MAINTENANCE_EXECUTABLE_DESIGN_CONTRACT.md`

## Authorized objective

Reduce verification runtime through one measured cleanup pass while preserving accepted invariant and distinct-failure coverage.

## Authorized sequence

1. Measure the current expensive verification set using accepted I3 evidence plus focused measurements where needed.
2. Map only the expensive set to the accepted invariants/regressions it protects.
3. Apply only obvious Keep/Merge/Retire/Move decisions supported by that mapping.
4. Produce the single maintenance report required by the design.
5. Run targeted local checks during development.
6. Run the accepted I3 full semantic coverage set once in canonical GitHub Actions at the exact final candidate SHA.
7. Stop for detached maintenance implementation review.

## Authorized changes

Only:

- measured expensive tests;
- their directly shared test fixtures/setup;
- directly necessary verification command or workflow behavior;
- the single maintenance report.

A moved proof must still run in the final full acceptance gate and must have bounded positive/negative trigger checks plus fail-safe behavior on uncertain classification.

A retired proof requires a report row naming its former accepted invariant/failure, surviving replacement coverage, last passing SHA, and retirement reason.

Merging may share setup or consolidate genuinely duplicate assertions, but may not remove a distinct hostile failure class or destroy useful failure isolation.

## Final full-gate rule

The final gate is defined by the accepted I3 **coverage set**, not by whatever `npm run verify` happens to contain after maintenance edits.

Changing scripts/workflow definitions cannot by itself shrink acceptance obligations.

Any proof moved out of ordinary development verification remains part of final maintenance acceptance certification unless explicitly retired with reviewed replacement coverage.

## Prohibited

Do not:

- change production/runtime behavior;
- change accepted POP0-I1/I2/I3 semantics;
- change POP runtime/save/configuration versions or owner boundaries;
- alter product fixtures merely to make tests cheaper;
- implement generalized caching, cache receipts, a generic dependency/lane system, or a scheduler;
- weaken assertions, hostile cases, authentication, timeout semantics, or pass/fail meaning merely to improve runtime;
- modify `main`;
- begin POP0-I4 implementation.

If simple measured cleanup is insufficient and the next useful change requires generalized verification infrastructure, stop and return for a new design decision.

## Acceptance evidence required

The candidate must provide:

- baseline and final timings;
- exact changed files and SHA;
- coverage/action table for the expensive set;
- retirement rows, if any;
- targeted check results;
- exact-SHA canonical final full-gate PASS;
- final test/check counts;
- confirmation of unchanged product behavior, POP authority, and main;
- remaining expensive items and why they stayed.

## Final authority statement

**ONE LEAN VERIFICATION-MAINTENANCE IMPLEMENTATION PASS — AUTHORIZED.**

The implementer must stop after the final candidate and full gate for detached review. This authority does not accept the maintenance changes and does not authorize POP0-I4 implementation.
