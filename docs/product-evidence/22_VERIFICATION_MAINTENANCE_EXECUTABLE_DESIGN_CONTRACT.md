# Verification Maintenance — Bounded Design Contract

Status: **LEAN DESIGN CANDIDATE ONLY. NO TEST, WORKFLOW, CACHE, LANE, OR PRODUCT IMPLEMENTATION IS AUTHORIZED.**

This replaces the over-scoped first draft at `05db99a680c2629dd2d01a779e7e63eb02a1ca1f`.

Frozen baseline:

- accepted POP0-I3 evidence: `e6dba2027c5aae8684ae4f8eb5464186429833ee`;
- final detached POP0-I3 PASS: `7412e144287d14245fd4f9bd7e9f6a50f8ffc6be`;
- POP0-I3 authority: `09121c2ca420655c12366f27305196068d4bdb9f`;
- unchanged `main` / production merge base: `44c1724962830225e6fc34f41d0df0cfdb7dfec0`.

Current accepted gate:

```text
58 test files / 737 tests
15-module POP boundary / 70-module production graph
typecheck / lint / build / built-runtime verification
four authenticated artifact reconstruction commands
Vitest maxWorkers = 1
```

That gate remains authoritative until a later maintenance implementation passes review.

---

# 1. Objective

Stop spending one to two hours on redundant verification without weakening accepted coverage.

The rule is:

> **Use the least process necessary to preserve confidence. Add ceremony only when an observed failure mode justifies it.**

The unit of judgment is the accepted invariant or distinct failure protected—not test count, age, or file count.

---

# 2. One bounded maintenance pass

If this design passes and receives separate implementation authority, perform one pass with four outputs.

## 2.1 Measure what takes time

Produce a compact timing table covering:

- total wall time;
- each top-level verification command;
- artifact reconstruction/setup;
- Vitest total and per-file time where already available;
- worker count, runner, source SHA, and source run.

Reuse accepted I3 CI/local evidence where sufficient. Do not force another full baseline run just to improve the report. Use focused measurements for missing data.

Examine:

```text
the smallest set accounting for at least 80% of measured time
plus any command or test file taking 30 seconds or more
```

This is a one-pass report, not a permanent telemetry system.

## 2.2 Map expensive proofs to invariants

For only that expensive set, record:

| Proof/test | Cost | Accepted invariant/regression | Overlap or replacement | Proposed action |
|---|---:|---|---|---|

Each row must answer:

```text
if this stops running here,
what accepted failure could escape,
and what remaining proof detects it?
```

No permanent manifest, proof-ID scheme, invariant registry, or admission dossier is required.

## 2.3 Make only obvious changes

Allowed actions:

- **Keep** a proof that uniquely protects an accepted invariant or hostile failure.
- **Merge** duplicate assertions or repeated expensive setup while preserving assertions, isolation, and useful failure identity.
- **Retire** only an obviously redundant or explicitly superseded proof whose invariant remains covered.
- **Move** an expensive proof out of the every-commit path only when its inputs are plainly isolated from ordinary POP changes and it remains in the final full gate.

Every retirement needs one row, not a separate process:

```text
test X
-> redundant/superseded by A + B
-> invariant Y remains covered
-> last passing SHA
-> retired
```

Git history preserves the former source. No retirement certificate or archive system is required.

For moved work, provide only:

1. a short exact condition for when it runs;
2. one positive check that an affected change triggers it;
3. one negative check that an unrelated POP-only change may skip it;
4. fail-safe behavior that runs the proof when classification is uncertain;
5. inclusion in the final full gate.

Do not build a generalized lane selector, cache-receipt protocol, scheduler, or verification framework.

## 2.4 Run the old full gate once afterward

After the maintenance edits:

1. use targeted checks during development;
2. run the old full semantic gate once at the exact final SHA;
3. require all surviving and moved full-gate proofs to pass;
4. compare final runtime with baseline;
5. record exact changes, test totals, timing, and CI run.

The authoritative full run should be canonical GitHub Actions at the exact candidate SHA. Do not duplicate it with another multi-hour local full run when targeted local checks already passed.

A red full gate means the maintenance pass fails.

---

# 3. Coverage guardrails

- Cost alone does not justify retirement.
- Flakiness alone does not justify retirement.
- Similar happy paths may still protect distinct hostile failures.
- Superseded architecture tests may retire only when current boundary/regression proofs cover the accepted behavior.
- Shared setup must remain immutable or reset so tests cannot contaminate each other.
- Do not delete unique assertions, weaken hostile fixtures, replace authentication with existence checks, hide failures through retries, or change product behavior to make tests cheaper.
- Future tests should answer “which invariant or distinct failure does this add, and can an existing proof cover it?” as engineering discipline, not paperwork.

---

# 4. Artifact reconstruction focus

Measure these current commands rather than assuming they are the problem:

```text
verify:us-topology-artifacts
verify:us-i4-artifacts
verify:us-i6-artifacts
verify:us-i7-artifacts
```

Check whether they repeat raw-source parsing/setup, whether normal POP edits can affect their inputs, and whether any output/check dominates another.

Permitted simple improvements include shared immutable setup, removal of duplicate reconstruction, or keeping reconstruction in the final full gate while omitting it from a clearly bounded development path.

Do not implement authenticated cache receipts, content-addressed caching, scheduled certification, or complex lanes unless measurement later proves simpler changes insufficient and a new design authorizes them.

---

# 5. Single maintenance report

Use one document containing:

## Baseline timing

Top-level and expensive-test timing, SHA/run, worker count, and runner.

## Coverage and action

| Proof/test | Cost | Invariant | Overlap/replacement | Action | Reason |
|---|---:|---|---|---|---|

## Retirement record

| Retired proof | Former invariant | Replacement(s) | Last passing SHA | Reason |
|---|---|---|---|---|

An empty retirement table is valid.

## Final evidence

- exact final SHA and changed files;
- targeted checks and exact-SHA full CI result;
- final test file/test counts;
- baseline versus final timing;
- remaining expensive items and why they stayed;
- confirmation that product behavior and POP0-I4 were untouched.

No additional permanent maintenance documents are required unless review finds a concrete missing proof.

---

# 6. Scope and stop gate

If separately authorized, implementation may change only measured expensive tests, their shared fixtures, directly necessary verification commands/workflow behavior, and the one report.

It must not change:

- production/runtime behavior;
- accepted POP0-I1/I2/I3 semantics;
- POP state/save/configuration versions;
- owner/import boundaries;
- product fixtures merely to reduce test cost;
- `main`;
- POP0-I4 implementation.

If an optimization needs production changes, generalized caching, or a dependency/lane system, stop and request a new decision.

Detached design review should answer only:

1. Does it measure before changing?
2. Does it map expensive proofs to accepted invariants?
3. Are merge/retire/move decisions obvious, bounded, and recorded?
4. Does the exact-SHA full gate remain mandatory?
5. Is the process small enough not to become a second product program?

If this design passes, one separate authority may authorize the single maintenance implementation pass. The implementer stops after the four outputs and final full PASS.

```text
POP0-I3 — ACCEPTED
verification maintenance — LEAN DESIGN CANDIDATE ONLY
maintenance implementation — UNAUTHORIZED
POP0-I4 implementation — UNAUTHORIZED
main modification — UNAUTHORIZED
```

## **DESIGN ONLY — DO NOT IMPLEMENT**
