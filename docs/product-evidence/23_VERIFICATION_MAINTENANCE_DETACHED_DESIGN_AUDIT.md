# Verification Maintenance — Detached Design Audit

Status: **DETACHED DESIGN AUDIT — PASS. NOT MAINTENANCE IMPLEMENTATION ACCEPTANCE, NOT POP0-I4 IMPLEMENTATION AUTHORITY, NOT MAIN-BRANCH AUTHORITY.**

Audited lean design:

`bc8f64f5bc758128c6c762ff8c33b3296429b8d1`

Accepted POP0-I3 authority baseline:

`09121c2ca420655c12366f27305196068d4bdb9f`

Superseded oversized draft:

`05db99a680c2629dd2d01a779e7e63eb02a1ca1f`

Accepted production merge base / unchanged main:

`44c1724962830225e6fc34f41d0df0cfdb7dfec0`

## Verdict

**PASS.**

The 227-line replacement is sufficiently bounded to authorize one verification-maintenance implementation pass without creating a second governance program.

It passes the five stated review questions:

1. **Measure before changing — PASS.** It reuses accepted I3 timing evidence where sufficient and focuses new measurement only on missing/high-cost data.
2. **Map expensive proofs to accepted invariants — PASS.** It limits classification work to the measured expensive set rather than demanding a permanent whole-repository proof registry.
3. **Merge/retire/move decisions are bounded and recorded — PASS.** Retirement requires surviving replacement coverage; moved proofs require positive/negative trigger checks, fail-safe execution on uncertainty, and continued inclusion in the final full gate.
4. **Exact-SHA full gate remains mandatory — PASS.** Targeted checks may accelerate development, but final maintenance acceptance still requires canonical GitHub Actions at the exact final SHA.
5. **Process remains small — PASS.** One maintenance pass, one report, no permanent manifest, generalized lane selector, cache-receipt protocol, scheduler, or new verification framework.

## Controlling implementation interpretation

“Run the old full semantic gate once afterward” means preserve and execute the **accepted I3 coverage set** at the final maintenance candidate SHA, including any proof moved out of the ordinary development path. It does not mean that changing the spelling or contents of `npm run verify` can redefine what counts as the full gate.

A retired proof may cease executing only after the implementation candidate records why its accepted invariant/failure class is covered by equal-or-stronger surviving proof and the detached implementation review confirms that claim.

The maintenance pass may make targeted/local development cheaper. It may not self-certify by shrinking the final acceptance evidence set without reviewed replacement coverage.

## Scope integrity

The candidate changes only `docs/product-evidence/22_VERIFICATION_MAINTENANCE_EXECUTABLE_DESIGN_CONTRACT.md` relative to accepted I3. The first oversized draft remains in ancestry but is explicitly superseded by the final file and contributes no runtime/test/workflow change.

No tests, workflow YAML, package scripts, Vitest settings, caching, product/runtime behavior, POP state/version, main, or POP0-I4 implementation changed.

Canonical CI run `33350760877` passed at exact SHA `bc8f64f5bc758128c6c762ff8c33b3296429b8d1` with the accepted gate still intact.

## Watchpoints for implementation review

- Do not mistake repeated setup for duplicate proof: assertions/failure classes must survive merging.
- Do not use path-only reasoning to move a proof when shared configuration/runtime dependencies can affect it.
- Do not turn the one-pass report into a permanent registry/framework.
- Verification runtime is the target; product/runtime behavior is out of scope.

## Final statement

**VERIFICATION-MAINTENANCE LEAN DESIGN — PASS.**

A separate authority may authorize exactly one bounded maintenance implementation pass. POP0-I4 implementation remains unauthorized.
