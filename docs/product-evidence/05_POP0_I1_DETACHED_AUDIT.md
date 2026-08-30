# POP0-I1 — Detached Implementation Audit

Status: **DETACHED PRODUCT-EVIDENCE AUDIT — NOT POP0-I1 ACCEPTANCE AUTHORITY, NOT POP0-I2 AUTHORIZATION, AND NOT RUNTIME, UI, ROADMAP, OR EARLY-ACCESS AUTHORITY.**

Audited candidate chain:

- accepted POP-0 contract authority: `00ca4cb181f06b2ad3748f0a305abee775f0e578`;
- implementation candidate: `8920f260b89a77866d6e2aaad844ed420bfa5243`;
- candidate repair: `b031f47a6f5c901d7c76d26f011401f35a039620`;
- accepted production merge base: `44c1724962830225e6fc34f41d0df0cfdb7dfec0`;
- rejected Stage 1 commit: `a7e04ca78ba1ccb06d8dc3a4dfb0d43389804144`.

Audit question:

> **Can a separate production-shaped operating world be created without importing Stage 1, wrapping the I10 session, creating duplicate canonical state, or breaking the accepted I10 regression runtime?**

---

# 1. Verdict

## **REVISE — 1 BLOCKING VERIFICATION FINDING, 3 NONBLOCKING WATCHPOINTS**

The implementation shell is directionally correct and passes the substantive composition boundary:

- it is rooted on the accepted production baseline;
- Stage 1 is absent from current ancestry and changed files;
- it creates an independent POP configuration, state, factory, and save envelope;
- it does not embed `IntegratedPartialRuntimeSession`, `ProductionGameSession`, `ProductionGameView`, global available actions, action-ID dispatch, Stage 1 helpers, or an opaque I10 save;
- the only current lower-level owner is the accepted calendar owner/state;
- proof IDs and dates remain in the proof content package;
- no UI, Attention, workstreams, offices, proof threads, Housing adaptation, Labor, media, or POP0-I2 behavior entered the increment.

However, the candidate does not satisfy the required full verification gate because its actual GitHub Actions run is red. The failure is caused by the new POP boundary verifier itself, not by an unrelated flaky job.

POP0-I1 therefore cannot be accepted yet.

---

# 2. R1-01 — BLOCKING: the required boundary verifier is incompatible with the repository's CI checkout

## 2.1 Candidate behavior

`scripts/check-pop0-i1-boundaries.mjs` now executes:

```text
git merge-base HEAD origin/main
git rev-parse origin/main
```

and requires both to resolve to:

```text
44c1724962830225e6fc34f41d0df0cfdb7dfec0
```

That succeeds in a full local clone whose remote-tracking `origin/main` exists and is current.

## 2.2 Actual CI environment

The repository workflow uses:

```yaml
- uses: actions/checkout@v4
```

without a `fetch-depth` override or explicit fetch of `main`.

The actual branch run checked out only the candidate branch SHA at depth 1. It did not create `refs/remotes/origin/main`.

Actual workflow run:

```text
CI run: 33311353462
head: b031f47a6f5c901d7c76d26f011401f35a039620
conclusion: failure
```

The failed command was `npm run verify`, specifically `check:pop0-i1-boundaries`:

```text
Error: POP0-I1 ancestry check could not run
 git merge-base HEAD origin/main:
 fatal: Not a valid object name origin/main
```

Typecheck and the preexisting general boundary check passed before this failure. The rest of the verification chain did not execute.

## 2.3 Why this blocks acceptance

The accepted I1 authority requires:

- production/audit/import boundary enforcement;
- branch and Stage-1 exclusion checks;
- the normal I10 factory and full baseline verification remaining green;
- a reviewable candidate before POP0-I2.

A local full-clone pass does not satisfy that gate while the repository's canonical CI invocation of the same `npm run verify` command fails deterministically.

The verifier is part of the product-evidence claim. It must work in the environment that enforces the repository gate.

## 2.4 Required bounded repair

Repair only the verification environment/logic. Do not begin POP0-I2.

Acceptable approaches include either:

### Approach A — provide the refs/history the verifier requires

Update the CI checkout or add an explicit fetch step so that:

- the accepted base commit is available;
- the candidate's complete ancestry is available;
- `origin/main` is available and current;
- the rejected Stage 1 commit can be evaluated when needed.

A full-history checkout is one straightforward solution. A bounded targeted fetch is also acceptable when it proves the same facts.

### Approach B — make the verifier independent of an assumed local tracking ref

Use the immutable accepted-base identity and a CI-supplied/fetched current-main identity in a way that works in both shallow CI and full local clones.

The repair must not weaken the required claims. It still needs to prove:

1. the candidate descends from the accepted base;
2. the accepted base remains the branch merge base rather than merely an ancestor;
3. current `main` remains at the accepted baseline during POP-0 work;
4. Stage 1 is not in ancestry;
5. the current proof import closure excludes forbidden legacy and audit surfaces.

## 2.5 Required repair evidence

The repaired candidate must show:

- local `npm run verify` PASS;
- GitHub Actions `npm run verify` PASS at the exact repaired SHA;
- all preexisting I10 tests and build checks completing rather than being skipped after the POP boundary failure;
- the targeted four POP0-I1 tests PASS;
- a negative test or direct verifier demonstration for at least one invalid ancestry/boundary case where practical;
- no runtime, UI, proof-thread, or POP0-I2 expansion.

---

# 3. What passes substantively

## 3.1 Clean ancestry and change boundary

GitHub comparison establishes:

```text
merge base: 44c1724962830225e6fc34f41d0df0cfdb7dfec0
candidate:  b031f47a6f5c901d7c76d26f011401f35a039620
status:     7 commits ahead, 0 behind
```

Those seven commits consist of:

- the five accepted POP-0 contract/audit/authority documents;
- the I1 shell commit;
- the I1 repair commit.

The I1 implementation delta after the authority contains only:

- `package.json`;
- `scripts/check-pop0-i1-boundaries.mjs`;
- `src/app/presidential-operating-persistence.ts`;
- `src/app/presidential-operating-proof-session.ts`;
- `src/content/pop0-v0/configuration.ts`;
- `src/sim/presidential-operating-runtime.ts`;
- `tests/pop0-i1-operating-composition.test.ts`.

No Stage 1 UI/helper/test/artifact appears in the current diff.

## 3.2 Independent composition rather than I10 wrapping

The POP factory directly constructs or restores `PresidentialOperatingRuntimeState`.

The state contains:

```text
schemaVersion
operatingStateId
configuration identity
ownerStates.calendar
```

It does not contain:

- a legacy session object;
- an I10 save string;
- `ProductionGameView`;
- available player actions;
- an action dispatcher;
- synchronized I10 state.

The session imports only the proof configuration, POP runtime state, and POP persistence functions.

This is the correct I1-level composition shape.

## 3.3 Direct owner state

The calendar is represented directly as an owner identity plus the accepted `CalendarTimeState`:

```text
ownerStates.calendar.ownerId
ownerStates.calendar.state.current
ownerStates.calendar.state.processedBoundaryIds
```

Creation and validation use the existing calendar owner utilities rather than an imitation calendar stored only for a briefing.

There is one canonical POP calendar in the proof state.

## 3.4 Content/configuration separation

The proof-specific:

- configuration ID;
- scenario ID;
- classification;
- operating-state ID;
- calendar-owner ID;
- February 5, 2029 epoch

are defined in `src/content/pop0-v0/configuration.ts`, not hardcoded inside the general session or runtime coordinator.

## 3.5 Save-envelope skeleton

The dedicated POP save:

- has its own format version;
- stores exact configuration identity;
- stores direct operating owner state;
- rejects unsupported top-level and nested shapes;
- validates configuration compatibility;
- validates owner identity and calendar consistency;
- copies restored state rather than sharing mutable arrays;
- does not nest an opaque I10 save.

The repair strengthened the restoration evidence by round-tripping a non-epoch calendar state rather than proving only that the untouched opening state could serialize itself.

## 3.6 Scope discipline

No POP0-I2 behavior entered I1.

There is no:

- office or officeholder simulation;
- assignment/queue state;
- receipt/presentation ledger;
- Attention;
- workstream;
- presidential instrument;
- Housing adapter;
- Labor owner;
- congressional initiative;
- media owner;
- quiet-condition mechanism;
- UI.

---

# 4. Nonblocking watchpoints

These findings do not require reopening the I1 shell once R1-01 is repaired, but they become hard boundaries for later increments.

## C1-02 — full-state inspection must not become the playable API

`PresidentialOperatingProofSession.getOperatingState()` returns a defensive copy of the full canonical shell state.

That is acceptable as I1 test evidence because no playable UI exists yet.

Before a player-facing import graph exists, later work must ensure that:

- UI code consumes bounded projections rather than full canonical state;
- full-state inspection is kept in a test/audit path or otherwise unavailable to production presentation code;
- the boundary checker does not treat a method as safe merely because its name lacks the word `Audit`.

This is not an I1 blocker because the current increment has no player view.

## C1-03 — persistence growth must remain lossless and atomic

The I1 parser, copier, and exact-key validator correctly cover the calendar-only shell.

As I2 and later owner state is introduced, every new canonical field must be added atomically to:

- runtime state type;
- runtime validator;
- copy logic;
- save interface;
- parser;
- restoration tests.

No new owner state may be silently omitted by the copy/serialization path and regenerated as though it had never existed.

This is a later-increment gate, not an I1 defect.

## C1-04 — lexical boundary scanning is evidence for the current graph, not permanent proof of semantic safety

The current checker follows static relative imports and scans forbidden files, symbols, Stage 1 paths, and common audit-name patterns. That is useful and sufficient for the current small graph once CI is fixed.

It should not later be treated as complete protection against:

- nonliteral dynamic loading;
- alternate aliases or reexports;
- semantically equivalent full-state/audit methods with different names;
- copied Stage 1 behavior introduced under a different commit;
- UI code that never imports the proof factory directly.

Later increments should expand boundary evidence with the actual product entry graph and structural tests as that graph exists.

The current candidate itself contains no identified bypass.

---

# 5. Candidate-chain observation

The implementer reported that `8920f260...` was already present when the branch was fetched despite expecting the contract-authority tip.

Repository history itself is coherent:

```text
00ca4cb... accepted contract authority
→ 8920f260... I1 shell
→ b031f47... I1 repair
```

The shell commit was created after the authority commit and has the correct direct parent. No unauthorized pre-authority code appears in the branch graph.

The operational handoff ambiguity should be noted, but it does not invalidate I1.

---

# 6. Required disposition

## **REVISE I1 ONLY**

Do not begin POP0-I2.

Produce a bounded repair that:

1. makes the POP ancestry/boundary verifier work in the repository's actual CI checkout;
2. retains the current clean composition and save semantics;
3. reruns the complete local and GitHub Actions verification at one exact SHA;
4. changes no product behavior or later-increment scope.

Then rerun the unchanged I1 gate:

> **Can a separate production-shaped operating world be created without importing Stage 1, wrapping the I10 session, creating duplicate canonical state, or breaking the accepted I10 regression runtime?**

No I1 acceptance authority exists while the exact candidate SHA has a failing required CI run.