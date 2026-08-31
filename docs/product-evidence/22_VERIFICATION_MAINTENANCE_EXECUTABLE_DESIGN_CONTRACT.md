# Verification Maintenance — Executable Design Contract

Status: **DESIGN CANDIDATE ONLY. NO VERIFICATION IMPLEMENTATION, TEST CLASSIFICATION, TEST RETIREMENT, TEST MOVEMENT, CACHE, RECEIPT, LANE, WORKFLOW, OR POP0-I4 IMPLEMENTATION IS AUTHORIZED BY THIS DOCUMENT.**

Frozen design baseline:

- accepted POP0-I3 implementation/evidence: `e6dba2027c5aae8684ae4f8eb5464186429833ee`;
- final detached POP0-I3 implementation re-audit: `7412e144287d14245fd4f9bd7e9f6a50f8ffc6be` — **PASS**;
- POP0-I3 acceptance authority and direct parent of this design candidate: `09121c2ca420655c12366f27305196068d4bdb9f`;
- accepted production merge base and unchanged `main`: `44c1724962830225e6fc34f41d0df0cfdb7dfec0`.

The current accepted verification baseline remains authoritative unless and until a later, separately reviewed maintenance increment replaces a bounded part of it:

```text
58 / 58 test files
737 / 737 tests
15-module POP structural graph
70-module production graph
typecheck
lint
four authenticated artifact reconstruction commands
production build
built-runtime verification
Vitest maxWorkers = 1
```

The current canonical command remains:

```text
npm run verify
```

No statement in this design changes what that command runs today.

---

# 1. Question and pass gate

This maintenance program asks:

> **Can verification cost be reduced for bounded repository changes while preserving every accepted invariant, distinct failure class, historical evidence record, authenticated-provenance guarantee, and dependency-trigger obligation?**

The program passes only if later reviewed implementation evidence proves all of the following:

```text
faster verification
AND no accepted invariant loses effective coverage
AND no distinct failure class is silently erased
AND retired proof evidence remains discoverable
AND moved proofs still run in an explicit required lane
AND dependency-to-lane selection is fail-closed and hostile-tested
AND authenticated reuse is invalidated by every behavior-driving input
AND clean reconstruction and accepted warm reuse converge exactly
AND acceptance authority cannot be issued from incomplete or stale lane evidence
```

Runtime reduction alone is not a pass.

Test-count reduction alone is not a pass.

Green fast-lane execution alone is not a pass.

The unit of analysis is an **accepted invariant and its distinct failure classes**, not a test file, assertion count, test count, or historical age.

---

# 2. Current problem statement

POP0-I3 closed with a valid full repository gate, but local stabilization required serialized Vitest execution after unrelated high-contention legacy suites intermittently exceeded existing timeout ceilings with two workers.

The accepted one-worker run preserved assertions and behavior, but exposed an unsustainable cost shape:

```text
bounded POP change
-> all structural checks
-> all authenticated artifact reconstruction
-> all legacy regression suites
-> build and built-runtime checks
-> approximately 1000 seconds in canonical CI
-> substantially longer on a constrained local machine
```

This design does not assume the correct remedy is more workers, longer timeouts, fewer tests, caching, sharding, or lane movement. Those are hypotheses to be evaluated only after trustworthy measurements and an accepted coverage manifest exist.

The first required result is evidence about cost and coverage, not an optimization.

---

# 3. Non-negotiable evidence principles

## 3.1 A proof earns its ongoing runtime cost

A live proof remains in a blocking lane because it protects at least one current accepted invariant or distinct failure class that is not otherwise protected with equal or stronger authority.

Historical presence is not sufficient justification.

Likewise, apparent duplication is not sufficient justification for retirement. Duplication must be demonstrated through an accepted coverage comparison.

## 3.2 Fewer tests is not the optimization target

These can all be valid outcomes:

- many tests remain because they attack distinct failure classes;
- several tests share one expensive fixture while retaining separate failure identities;
- one stronger proof dominates several older proofs;
- an expensive proof moves to a slower lane but remains mandatory for certification;
- no proof changes because measurement shows the cost lies elsewhere.

## 3.3 Retirement does not delete historical evidence

A retired proof may cease executing and may later leave the active test tree, but its identity, former claim, final accepted source location, last passing SHA, retirement decision, replacements, and reasoning remain discoverable in versioned repository evidence.

Git history alone is not the retirement registry. A reviewer must not need to know the deleted filename or search arbitrary history to discover why coverage was considered safe.

## 3.4 Lane selection is verified product behavior of the evidence system

The lane selector determines what evidence may be omitted from a particular run. It is therefore part of the trusted acceptance boundary.

For every dependency family, later tests must prove both:

```text
affected change
-> every required lane selected

unaffected change
-> omitted lane has an exact, reviewable skip reason
```

Hostile mutations must also prove that an affected dependency cannot fall through all expensive lanes.

## 3.5 Acceptance fails closed

An unknown change, stale manifest, missing dependency edge, selector error, malformed receipt, unverifiable receipt, or incomplete lane result may increase verification work or reject the candidate. It may not authorize a skip.

```text
uncertain dependency impact
-> full applicable verification or rejection
!= optimistic omission
```

---

# 4. Authority and scope boundary

## 4.1 What this design may specify

This document may specify:

- the maintenance threat model;
- stable evidence identities and required manifest fields;
- invariant and failure-class coverage records;
- measurement requirements;
- Keep/Merge/Retire/Move decision semantics;
- historical retirement records;
- candidate verification lanes;
- fail-closed lane selection;
- authenticated reconstruction receipts;
- acceptance-certificate rules;
- staged implementation and review order.

## 4.2 What this design does not authorize

This document does not authorize:

- modifying `.github/workflows/ci.yml`;
- modifying `package.json`, Vitest configuration, timeouts, worker counts, or test order;
- adding, removing, merging, skipping, moving, or rewriting any test;
- adding timing instrumentation;
- creating a live evidence manifest;
- implementing a lane selector;
- implementing cache or authenticated-receipt reuse;
- changing artifact reconstruction;
- changing product/runtime behavior;
- changing POP0 state, saves, owners, APIs, imports, or accepted semantics;
- beginning POP0-I4 implementation;
- modifying `main`.

Even a PASS of this design requires a separate implementation-authority artifact before the first instrumentation change.

## 4.3 Existing gate remains authoritative

Until a later maintenance increment passes its own detached review and acceptance authority, the repository's existing `npm run verify` behavior remains the canonical blocking gate.

No future design or implementation candidate may cite this contract itself as permission to skip current checks.

---

# 5. Threat model

The maintenance program must defend against at least these failure modes.

## 5.1 Coverage erosion disguised as cleanup

```text
several tests look similar
-> one is deleted
-> its unique hostile branch disappears
-> total test count decreases
-> ordinary happy-path coverage remains green
```

## 5.2 Diagnostic collapse disguised as merge

```text
many independent proofs
-> one very large test with shared setup
-> assertions remain somewhere
-> failure identity and causal diagnosis become ambiguous
```

## 5.3 Path-only lane selection

```text
changed file is outside an artifact folder
-> provenance lane skipped
-> changed shared parser/tool/config actually affects reconstruction
```

## 5.4 Missing transitive dependencies

```text
direct dependency unchanged
-> shared imported dependency changes
-> selector misses transitive edge
-> affected lane skipped
```

## 5.5 Cache poisoning or stale reuse

```text
raw data unchanged
-> reconstruction code/config/toolchain changes
-> old output reused because only raw-data hash was checked
```

## 5.6 Receipt laundering

```text
an output exists
-> a receipt is generated without a successful authenticated run
-> later commits treat the output as certified
```

## 5.7 Scheduled-lane abandonment

```text
expensive proof moved out of every-commit gate
-> schedule breaks or stops
-> no maximum evidence age is enforced
-> acceptance continues indefinitely
```

## 5.8 Unknown-file fallthrough

```text
new or renamed dependency is absent from the manifest
-> selector returns no affected family
-> candidate runs only a fast lane
```

## 5.9 Timing optimization that weakens semantics

```text
slow proof
-> timeout increased, assertion removed, fixture narrowed, or order changed
-> runtime looks better or flake disappears
-> accepted failure class is no longer attacked
```

## 5.10 Measurement distortion

```text
single warm run on one machine
-> treated as representative baseline
-> classification and lane decisions encode noise rather than cost
```

## 5.11 Acceptance from incomplete evidence

```text
bounded lane passes at candidate SHA
-> full required lane passed only at an ancestor
-> dependency inputs changed since that run
-> acceptance authority is issued anyway
```

---

# 6. Stable evidence identity model

Later manifest implementation must give every live or retired proof a stable `proofId` independent of its filename or test title.

Minimum proof kinds:

```text
TEST
STRUCTURAL_CHECKER
ARTIFACT_RECONSTRUCTION
ARTIFACT_VERIFIER
TYPECHECK
LINT
BUILD
BUILT_RUNTIME_VERIFIER
LANE_SELECTOR_CHECK
```

Each proof record must include at least:

| Field | Required meaning |
|---|---|
| `proofId` | Stable, unique identity that survives file moves and merges. |
| `proofKind` | One enumerated proof kind. |
| `entryPoint` | Exact current executable file, command, or check identity. |
| `currentLaneIds` | Every lane in which the proof currently runs. |
| `acceptedInvariantIds` | Accepted invariants directly protected. |
| `distinctFailureClassIds` | Distinct hostile or regression classes attacked. |
| `authorityRefs` | Commits/documents that make those invariants authoritative. |
| `dependencyFamilyIds` | Families whose changes can affect the proof or its inputs. |
| `directDependencies` | Exact known direct source/config/data/tool inputs. |
| `setupOrFixtureIds` | Expensive setup or authenticated fixture identities used. |
| `evidenceOutputs` | Reports, artifacts, exit status, or other produced evidence. |
| `latestAcceptedPassingSha` | Latest exact SHA with accepted passing evidence. |
| `measurementRefs` | Versioned timing observations, never an untraceable estimate. |
| `classificationState` | Current Keep/Merge/Retire/Move decision state. |
| `supersessionRefs` | Append-only replacement/decision records, if any. |
| `provenance` | Who/what created the record, schema version, and effective time. |

Filename inference is not an acceptable substitute for these fields.

## 6.1 Invariant records

Each accepted invariant record must include at least:

| Field | Required meaning |
|---|---|
| `invariantId` | Stable identity. |
| `statement` | Exact behavioral or structural claim. |
| `authorityRefs` | Accepted contract/audit/authority commits. |
| `effectiveFrom` | First accepted authority for the invariant. |
| `supersededBy` | Later accepted invariant, if explicitly superseded. |
| `canonicalOwnerOrBoundary` | Runtime owner, dependency boundary, or evidence owner. |
| `minimumFailureClassIds` | Distinct attacks that must remain covered. |
| `liveProofIds` | Current proofs that protect it. |
| `retirementHistoryRefs` | Prior proofs and accepted replacement decisions. |

An invariant is not obsolete merely because the implementation that first proved it has been refactored. Supersession requires explicit reviewed authority.

## 6.2 Failure-class records

A failure class is the smallest review-significant way an invariant can fail. It must not be reduced to an assertion count.

Examples include:

- forged ancestry/reference availability;
- malformed persistence accepted by parser but rejected live, or vice versa;
- unauthorized import reachable through a transitive entry graph;
- artifact reconstruction from altered raw input;
- stale authenticated output accepted after checker changes;
- recipient scope widened after a narrowed disposition.

Each failure class must identify its parent invariant, attack precondition, forbidden outcome, and live detecting proofs.

## 6.3 Append-only decision history

Classification and retirement decisions are immutable evidence records.

A later review may supersede a decision with a new record. It may not silently edit the historical reason or replacement set that justified an earlier accepted state.

---

# 7. Measurement contract

No proof classification, lane movement, retirement, caching claim, or runtime budget may be accepted before the instrumentation increment produces a reviewed baseline.

## 7.1 Required measurements

At minimum, the measurement system must capture:

- wall-clock duration;
- CPU time;
- setup/artifact-reconstruction time;
- test/check execution time;
- cache hit, miss, rejection, and fallback status where caching later exists;
- peak worker count;
- effective configured worker count;
- per-proof timing where technically addressable;
- per-file timing for test files;
- per-lane timing once lanes exist;
- process exit status;
- exact repository SHA;
- command identity;
- operating system and runner class;
- Node/package-manager/toolchain identity;
- cold/warm classification;
- measurement schema version and provenance.

Queue wait and dependency-install time must be recorded separately from verification execution rather than silently included or excluded.

## 7.2 Phase attribution

The measurement model must distinguish at least:

```text
environment setup
dependency installation
artifact setup/reconstruction
proof execution
build
built-runtime verification
reporting overhead
```

If CPU time cannot be precisely attributed across a child-process tree on a supported runner, the record must state the measurement boundary and limitation. It may not present partial process CPU as whole-lane CPU without qualification.

## 7.3 Repeatability

Classification decisions may not rest on one run.

The instrumentation design must support repeated observations and report at least median and tail behavior over a reviewed sample. The implementation authority must set the sample size and cold/warm protocol after the instrumentation mechanism itself is reviewed.

No numeric performance budget is fixed in this design because no accepted comparable baseline dataset exists yet.

## 7.4 Instrumentation noninterference

The timing-only increment must prove:

```text
same proof selection
same proof order unless the current runner already permits nondeterminism
same worker configuration
same timeout ceilings
same assertions
same fixtures
same exit semantics
same artifact outputs
same accepted pass/fail result
```

Instrumentation failure may fail the run or mark measurement unavailable according to the later reviewed design. It may never turn a proof failure into a passing gate.

Instrumentation overhead must itself be measured.

---

# 8. Classification model

Every proof considered by the maintenance program must receive one of four top-level dispositions through reviewed evidence.

## 8.1 KEEP

Use `KEEP` when the proof uniquely protects an accepted invariant or distinct failure class, or when no proposed replacement has demonstrated equal or stronger coverage.

Keep does not mean the proof can never share a fixture or move lanes. It means its proof identity remains live.

## 8.2 MERGE

`MERGE` must always declare exactly one subtype.

### Assertion merge

The same assertions use fewer setup/execution paths.

Requirements:

- every original assertion claim remains identifiable;
- distinct failure messages remain diagnosable;
- no original failure class disappears;
- shared setup cannot cause one failed prerequisite to conceal unrelated proof results without an explicit tradeoff review.

### Fixture merge

Several proofs reuse one expensive authenticated or constructed setup while retaining separate assertions and failure identities.

Requirements:

- proof IDs remain separate;
- fixture provenance and immutability are explicit;
- mutation/leakage between proofs is prevented or reset deterministically;
- fixture failure is distinguishable from proof failure.

### Proof merge

One stronger proof dominates multiple older proof identities.

This is the only merge subtype that may materially retire proof identities.

Requirements:

- the new proof covers every accepted invariant and failure class of each predecessor;
- the dominance argument is recorded field by field;
- hostile tests demonstrate the replacement fails for every predecessor failure class;
- predecessor retirement records are created;
- diagnostic loss is explicitly assessed.

Combining many tests into one large file is not by itself a proof merge.

## 8.3 RETIRE

Use `RETIRE` only when a proof is obsolete under explicit accepted supersession or dominated by stronger accepted coverage.

Retirement requires:

```text
old proof X protected invariant Y and failure classes F
replacement proofs/checkers A, B, C protect Y and every member of F
hostile replacement evidence demonstrates the coverage
archival retirement record is complete
detached review accepts the domination or supersession claim
```

Cost alone cannot justify retirement.

Flakiness alone cannot justify retirement.

Implementation-detail coverage may be retired only after proving it is not the sole detector for a still-authoritative behavior or boundary.

## 8.4 MOVE_OUT_OF_EVERY_COMMIT_GATE

Use this disposition when a proof remains valuable and live but does not need to execute on every bounded change.

Movement requires:

- an explicit destination lane;
- a dependency-family trigger policy;
- a maximum accepted evidence age where scheduled evidence is allowed;
- a rule for candidate acceptance when the destination lane has not run at the exact SHA;
- proof that all behavior-driving inputs are unchanged if prior evidence is reused;
- fail-closed selector tests;
- an explicit full-certification path;
- discoverable lane results and skip reasons.

Moving is not retiring. The proof remains in the manifest and continues to produce required evidence.

---

# 9. Retirement archive contract

Every retired proof must have a durable archival record containing at least:

| Field | Required meaning |
|---|---|
| `retirementId` | Stable immutable decision identity. |
| `proofId` | Retired proof identity. |
| `formerEntryPoint` | Last live location/command. |
| `formerInvariantIds` | Every invariant formerly protected. |
| `formerFailureClassIds` | Every distinct failure class formerly attacked. |
| `decisionAuthorityRef` | Exact accepted review/authority commit. |
| `decisionTime` | Effective retirement time. |
| `replacementProofIds` | Exact live replacements, or explicit superseding authority. |
| `coverageArgument` | Field-by-field domination/supersession reasoning. |
| `hostileEvidenceRefs` | Tests/checks showing replacements detect the old failures. |
| `lastPassingSha` | Last exact SHA at which the old proof passed. |
| `lastLiveLaneIds` | Lanes from which it retired. |
| `lastMeasuredCostRefs` | Last accepted timing evidence. |
| `reason` | Why retirement is safe and useful. |
| `sourceEvidenceRef` | Commit/blob/path preserving the final proof source. |
| `supersededBy` | Later retirement correction, if any. |
| `provenance` | Schema/version/authoring evidence. |

The active source file may be removed only in the same bounded chain that adds its accepted retirement record and replacement coverage.

Historical evidence remains discoverable even when it no longer executes.

---

# 10. Candidate verification lanes

The exact implementation names may change during reviewed lane design, but the semantic responsibilities must remain distinct.

## 10.1 BOUNDED_CHANGE

Purpose: fast evidence for the changed dependency closure.

Candidate contents may include:

- typecheck/lint/build checks affected by the change;
- structural boundary checks;
- targeted tests and directly/transitively affected regression families;
- lightweight validation of reused authenticated receipts;
- the lane selector's own fail-closed validation.

Target aspiration: minutes, not an acceptance promise fixed before measurement.

## 10.2 REPOSITORY_REGRESSION

Purpose: manageable cross-domain regression evidence across the active repository.

This lane retains proofs whose dependency breadth or regression value exceeds a bounded-change closure but does not require raw-source authenticated reconstruction on every execution.

## 10.3 AUTHENTICATED_PROVENANCE_CERTIFICATION

Purpose: expensive clean or receipt-validating reconstruction of authenticated artifacts and provenance chains.

This lane may run on relevant dependency changes, explicit certification requests, schedules with enforced maximum age, and release/authority gates defined by later reviewed policy.

## 10.4 FULL_ACCEPTANCE_CERTIFICATION

Purpose: produce the complete evidence set required before a candidate can receive acceptance authority.

This is a logical certificate, not necessarily one monolithic command. It may combine exact-SHA lane results with authenticated unchanged-input receipts only under the rules in this contract.

An implementation candidate cannot be accepted merely because `BOUNDED_CHANGE` passed.

## 10.5 No lane is a knowledge shortcut

A lane result states that specific proofs ran or that specific prior outputs were validly reused. It does not imply unrun proofs passed.

Every skip must be explicit and attributable to a reviewed dependency/receipt rule.

---

# 11. Dependency-family and lane-selection contract

## 11.1 Selector inputs

The selector must consider behavior-driving identity, not only changed paths.

Inputs must cover at least:

- changed, added, deleted, and renamed files;
- direct and transitive source dependencies;
- test/checker dependencies;
- raw input identities;
- reconstruction scripts;
- artifact schemas and configuration;
- shared parsers/generators/validators;
- package lock and relevant dependency identities;
- Node/toolchain/runner identity where behavior-driving;
- workflow/command definitions;
- manifest and selector schema/version;
- requested certification class.

## 11.2 Selector output

For an exact candidate SHA, the selector output must include:

- selected lane IDs;
- selected proof IDs or proof families;
- skipped lane/proof IDs;
- machine-readable skip reasons;
- dependency paths or unchanged-input receipts supporting every skip;
- selector version and manifest hash;
- exact candidate and baseline SHAs;
- fail-closed fallback status.

## 11.3 Required selector proofs

For every dependency family, later tests must include:

1. a positive mutation that selects every affected lane;
2. a legitimate unrelated mutation that demonstrates a supported skip;
3. a transitive-dependency mutation;
4. a configuration/schema mutation;
5. a deleted or renamed dependency;
6. a shared-dependency mutation affecting multiple families;
7. an unknown/unmapped mutation that fails closed;
8. a manifest/selector mismatch;
9. a hostile mutation designed to fall through all expensive lanes.

## 11.4 Fail-closed behavior

At minimum:

```text
unmapped change
OR stale manifest
OR selector exception
OR invalid dependency graph
OR missing receipt needed for a skip
OR receipt validation failure
-> select full applicable verification or reject candidate
```

Returning an empty lane set is never a valid fallback.

## 11.5 Selector bootstrapping

The selector and manifest cannot solely certify their own correctness.

Changes to selector code, manifest schemas, dependency extraction, or lane policy must trigger an independently defined full selector test family and the full applicable acceptance lane.

---

# 12. Authenticated artifact receipt contract

This section defines prerequisites for possible future authenticated reuse. It does not authorize a cache.

## 12.1 Receipt identity

An authenticated reconstruction receipt must bind at least:

- receipt schema/version;
- artifact family and output identities;
- every raw input content hash;
- reconstruction code content/closure hash;
- configuration/schema hash;
- validator/checker content/closure hash and version;
- relevant dependency lock identity;
- Node/toolchain/runtime identity where behavior-driving;
- command identity;
- output content hashes;
- provenance/authentication inputs and results;
- clean/warm execution classification;
- exact producing SHA;
- successful exit/result evidence;
- creation time and enforced validity/age policy;
- immutable receipt content hash or signature mechanism;
- producing lane/run identity.

File timestamps and paths are not content identity.

## 12.2 Reuse rule

Reuse is permitted only when every behavior-driving receipt input exactly matches the candidate's effective inputs and the receipt passes its independent validator.

```text
same raw inputs
BUT changed reconstruction code/config/checker/dependency/toolchain
-> receipt invalid
-> reconstruction required
```

## 12.3 Clean/warm convergence

For each receipt-enabled family, later evidence must prove:

```text
clean checkout + empty cache + full reconstruction
-> output set O + authenticated receipt R

matching checkout + validated warm reuse
-> output set O exactly
-> same verification result
```

Output equality must use canonical content hashes, not approximate semantic comparison.

## 12.4 Tamper and failure behavior

Required hostile cases include:

- raw input tamper;
- reconstruction-code tamper;
- config/schema tamper;
- checker tamper;
- dependency/toolchain mismatch;
- output tamper;
- receipt-field tamper;
- missing receipt;
- malformed receipt;
- receipt from a failed or interrupted run;
- cache entry with no authenticated receipt;
- clean reconstruction disagreeing with warm reuse.

Every case must reject reuse and either run clean reconstruction or fail the lane. It may not accept stale output.

If clean and warm results disagree, the receipt family is quarantined from reuse until separately reviewed repair.

## 12.5 Evidence age and scheduling

Any scheduled provenance evidence used for acceptance must have a reviewed maximum age and unchanged-input rule.

A missed or failed schedule cannot silently extend validity.

---

# 13. Acceptance-certificate contract

Every later implementation candidate must produce a machine-readable or exactly reconstructable acceptance certificate that states:

- exact candidate SHA;
- baseline/merge-base SHA;
- manifest and selector versions/hashes;
- required lanes;
- completed lane run identities and conclusions;
- proof IDs executed in each lane;
- proof IDs validly reused and their receipt identities;
- proof/lane skips and exact reasons;
- evidence ages;
- unresolved or fail-closed conditions;
- final completeness result.

The certificate is complete only when every live proof required by the candidate's dependency closure and certification class is either:

1. executed successfully at the exact candidate SHA; or
2. covered by an accepted unchanged-input receipt whose full behavior-driving identity still matches.

An ancestor's generic green CI result is not enough.

A scheduled run's existence is not enough.

The final detached reviewer must be able to reconstruct why every omitted proof was legitimately omitted.

---

# 14. New-proof admission rule

No new test or checker may enter a live gate without answering:

1. Which accepted invariant does it protect?
2. Which distinct failure class does it add?
3. Which existing proofs overlap?
4. Why can an existing proof not be strengthened, fixture-merged, or assertion-merged instead?
5. Which lane belongs to it, and what measured runtime/setup tax does it add?

A proof may still be admitted when overlap exists, but the distinct hostile branch or diagnostic value must be explicit.

This rule must not encourage giant multi-purpose tests. Diagnostic isolation remains an accepted design goal.

---

# 15. Required counterfactuals

Later increments must prove at least these counterfactuals.

## 15.1 Coverage counterfactuals

- Remove a replacement proof after retiring predecessor X: manifest/coverage validation rejects acceptance.
- Preserve the happy path but remove one predecessor failure class from a proof merge: coverage validation rejects the merge.
- Merge fixtures while allowing state leakage: isolation evidence fails.
- Rename a proof file without changing `proofId`: identity and history remain continuous.

## 15.2 Selector counterfactuals

- Change a transitive shared parser: every affected family is selected.
- Add an unmapped file imported by reconstruction: selector fails closed.
- Rename or delete a dependency: it cannot disappear from impact analysis.
- Change only an unrelated documentation file: expensive lanes may be skipped only with an exact supported reason.
- Change selector or manifest code: selector self-change policy forces independent/full validation.

## 15.3 Receipt counterfactuals

- Keep raw inputs constant but change reconstruction code: warm reuse is rejected.
- Keep reconstruction code constant but change config or checker: warm reuse is rejected.
- Tamper with cached output: receipt validation rejects it.
- Generate a receipt from an interrupted/failed run: later reuse is impossible.
- Make cold reconstruction disagree with warm output: reuse is quarantined and acceptance fails closed.

## 15.4 Lane/authority counterfactuals

- Bounded lane passes but required regression lane is missing: no acceptance certificate.
- Scheduled certification exceeds maximum age: no acceptance certificate.
- A moved proof's dependency changes after its last run: prior evidence cannot be reused without a valid unchanged-input receipt.
- All expensive lanes are skipped for an affected hostile change: selector tests fail.

## 15.5 Proof-proliferation counterfactual

- A future POP increment proposes a new test that duplicates an existing invariant/failure class without justification: admission validation rejects or requires consolidation analysis before acceptance.

---

# 16. Staged implementation program

The maintenance program must proceed in separately reviewed increments. Later items are not authorized merely because an earlier item passes.

## VM0-D — this design

Deliverable:

- one documentation-only executable design contract;
- detached design audit;
- bounded documentation repair if required;
- final unchanged-gate design re-audit;
- separate implementation authority.

No implementation occurs in VM0-D.

## VM0-I1 — timing instrumentation only

Permitted only after separate authority.

May implement:

- timing/phase instrumentation;
- measurement schema and reports;
- repeated baseline capture support;
- instrumentation noninterference tests.

Must not implement:

- proof classification;
- test deletion/merge/movement;
- lane selection;
- cache or receipt reuse;
- worker/timeout/assertion changes;
- POP0-I4 behavior.

Stop for detached review.

## VM0-I2 — proof manifest and invariant coverage matrix

Permitted only after VM0-I1 acceptance and separate authority.

May implement:

- stable proof identities;
- invariant/failure-class registry;
- accepted-authority links;
- dependency/setup records;
- cost observations from I1;
- coverage completeness and orphan checks.

Must not retire, move, or stop running any proof.

Stop for detached review.

## VM0-I3 — bounded classification/consolidation pilot

Permitted only after VM0-I2 acceptance and separate authority.

May apply Keep/Merge/Retire/Move analysis to one explicitly named proof family. The implementing authority must state which merge subtypes and dispositions are allowed.

No repository-wide retirement batch is allowed.

Stop for detached review.

## VM0-I4 — verified lane-selector pilot

Permitted only after prior acceptance and separate authority.

May implement fail-closed dependency-family selection for one bounded family with the required positive, negative, transitive, rename/delete, unknown, and hostile tests.

The current full gate remains the ultimate acceptance fallback during the pilot.

Stop for detached review.

## VM0-I5 — authenticated receipt/cache pilot

Permitted only after lane-selector acceptance and separate authority.

May implement one named artifact family's receipt, clean/warm convergence, invalidation, tamper defense, and fallback behavior.

No second artifact family may be added in the same increment.

Stop for detached review.

## VM0-I6+ — separately bounded rollout

Repository-wide consolidation, verified lanes, authenticated receipts, and retirement may proceed only by named dependency/proof families with separate reviewable evidence.

No increment may combine broad retirement, lane-selector redesign, and multi-family cache introduction into one acceptance surface.

---

# 17. VM0-I1 acceptance requirements

If this design later passes and I1 receives separate authority, the timing-only implementation must demonstrate:

1. current canonical proof selection is unchanged;
2. current `maxWorkers = 1` is unchanged;
3. timeout ceilings and assertions are unchanged;
4. current artifact reconstruction still executes normally;
5. exit/failure semantics are unchanged;
6. measurement output binds to exact SHA and command;
7. required timing fields are present or explicitly marked unavailable with reason;
8. phase and per-file/proof attribution are deterministic enough for comparison;
9. instrumentation overhead is measured;
10. local and canonical GitHub Actions verification pass at the exact candidate SHA;
11. no proof is classified, retired, moved, cached, or skipped;
12. no POP0-I4 implementation begins.

The first accepted performance dataset must be evidence, not a target-driven justification for a preselected optimization.

---

# 18. Detached design review attack surface

The detached reviewer should reject this design if it permits any of the following interpretations:

- fewer tests are inherently better;
- a test may retire because it is old, slow, or flaky;
- retirement evidence may live only in Git history;
- assertion merge, fixture merge, and proof merge are interchangeable;
- path matching alone is adequate lane selection;
- an unknown dependency may select no expensive lane;
- a selector may certify its own changes without independent/full coverage;
- a cached output is trusted because it exists or because raw data is unchanged;
- a receipt omits reconstruction code, config, checker, dependency, or relevant toolchain identity;
- a scheduled lane may become arbitrarily stale;
- a bounded lane PASS alone authorizes implementation acceptance;
- exact-SHA evidence may be replaced by an unrelated ancestor's green run;
- measurement instrumentation may alter current proof behavior;
- the design itself authorizes workflow/test/cache/lane changes;
- verification maintenance may introduce POP0-I4 product behavior.

The reviewer should specifically attack:

- invariants with only one hostile proof;
- proofs spanning multiple accepted authorities;
- shared fixture contamination;
- transitive and generated dependencies;
- deleted/renamed paths;
- manifest/schema/selector self-changes;
- cache tampering and partial receipts;
- cold/warm divergence;
- acceptance-certificate completeness;
- archival discoverability after active proof removal.

---

# 19. Explicit non-goals

This maintenance design does not decide:

- which current test is Keep, Merge, Retire, or Move;
- which artifact family should receive the first receipt pilot;
- the final lane implementation names;
- the final CI sharding topology;
- the final cache backend;
- a target percentage of tests to remove;
- a target number of test files;
- a final worker count;
- new timeout ceilings;
- a final minute budget before measurement;
- POP0-I4 product scope or behavior.

It also does not claim that every current proof is necessary or redundant. That conclusion belongs to the later accepted manifest and coverage analysis.

---

# 20. Intended end state

The intended architecture is:

```text
bounded POP change
-> fail-closed dependency analysis
-> minutes-scale bounded evidence where legitimately sufficient

cross-domain or broad change
-> manageable repository regression evidence

provenance-affecting change / scheduled certification / explicit authority gate
-> authenticated full provenance certification

candidate acceptance
-> complete exact-SHA certificate
   composed only from executed proof results
   and independently validated unchanged-input receipts
```

The program succeeds when verification becomes materially faster for genuinely bounded changes without making the selector, manifest, cache, schedule, or retirement process the weakest part of the evidence system.

---

# 21. Stop gate

This document is the reviewable VM0-D design candidate only.

The required next action is a detached design audit against the frozen accepted I3 baseline.

If the audit returns REVISE, only a bounded documentation repair is permitted.

If the unchanged-gate design audit returns PASS, a separate authority artifact is still required before VM0-I1 timing instrumentation begins.

Until then:

```text
POP0-I3 — ACCEPTED
Verification maintenance — DESIGN CANDIDATE ONLY
VM0-I1 instrumentation — UNAUTHORIZED
test/workflow/lane/cache/receipt changes — UNAUTHORIZED
proof classification/retirement/movement — UNAUTHORIZED
POP0-I4 implementation — UNAUTHORIZED
main modification — UNAUTHORIZED
```

## **DESIGN ONLY — DO NOT IMPLEMENT VERIFICATION MAINTENANCE OR POP0-I4**
