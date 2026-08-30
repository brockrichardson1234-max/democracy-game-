# POP0-I2 — Office Information Substrate Authority

Status: **POP0-I2 ACCEPTED IMPLEMENTATION AUTHORITY. POP0-I3 DESIGN MAY BEGIN. POP0-I3 RUNTIME IMPLEMENTATION REMAINS UNAUTHORIZED UNTIL A SEPARATE I3 EXECUTABLE CONTRACT RECEIVES DETACHED REVIEW AND EXPLICIT IMPLEMENTATION AUTHORITY.**

Accepted production merge base:

```text
44c1724962830225e6fc34f41d0df0cfdb7dfec0
```

Accepted POP0-I1 authority:

```text
3ba55c40df3fba1d541ae46e2efeb5044955ce9d
```

POP0-I2 design authority:

- controlling repaired contract: `08_POP0_I2_EXECUTABLE_CONTRACT.md` at `d4e5d5f0f1d5a715adfd1115b0b422df1d75e244`;
- final design re-audit: `10_POP0_I2_FINAL_DESIGN_REAUDIT.md` at `9682400d686390cbb36f9618d85f6b39542d9c7f` — **PASS**;
- implementation authority: `11_POP0_I2_IMPLEMENTATION_AUTHORITY.md` at `bdd7f6043dcbe6ec05e0f6757d474adfba2111fc`.

POP0-I2 implementation evidence chain:

1. `22e093feaf0a755a01bfc147b5253870976695ad` — office-information substrate candidate;
2. `a932af4a64f8736321eb42dd7afa5eb21faffa8c` — timeout-only I9 CI repair;
3. `d20f7eb4eea04de0fd22eede7143a03349cc15ee` — timeout-only I4 CI repair;
4. `12_POP0_I2_DETACHED_IMPLEMENTATION_AUDIT.md` at `0a4b2c73389a22fc4f743bce35838648969f71f8` — **REVISE**;
5. `f4d1e8d765e707a2ab79d4fc4dc29414f0d2d7e8` — bounded information-invariant repair;
6. `13_POP0_I2_FINAL_IMPLEMENTATION_REAUDIT.md` — unchanged-gate **PASS**.

Accepted implementation/evidence SHA:

```text
f4d1e8d765e707a2ab79d4fc4dc29414f0d2d7e8
```

Canonical green GitHub Actions run:

```text
33329735191
```

---

# 1. Accepted I2 claim

The project now has executable evidence for this bounded claim:

> **Different administration offices can possess, retrieve, assess, disagree about, synthesize, and present information without becoming one shared White House mind.**

The accepted implementation demonstrates this in one canonical POP operating state with direct persistence and without using the legacy I10 session as an engine.

---

# 2. Accepted canonical owner state

POP0-I2 accepts the following direct owner-state composition beside the calendar owner:

1. administration directory;
2. partitioned office operations;
3. information routes;
4. presidential presentation history.

These owners remain semantically distinct.

There is no accepted global White House knowledge object, administration-wide workload truth, UI-owned substantive state, parallel I10 world, or opaque legacy save.

---

# 3. Accepted offices, institutions, and actor boundary

I2 accepts the bounded proof identities for:

- Chief of Staff / Presidential Operations;
- National Economic Council;
- Office of Management and Budget;
- Legislative Affairs;
- Office of the Secretary of Labor;
- Office of the Secretary of HUD;
- Department of Labor institution;
- Department of Housing and Urban Development institution;
- six officeholder actors;
- one distinct configured President recipient actor.

For I2 only, all seven named humans remain:

```text
OUTSIDE_MODELED_ORDINARY_POPULATION_SCOPE
```

with zero Population weight and no ordinary-population joins.

This is a bounded proof representation, not a claim that final officials are outside the eventual canonical Population.

---

# 4. Accepted knowledge ladder

The following distinctions are now executable and persistent:

```text
artifact exists
≠ institution possesses it
≠ information index exists
≠ office receives metadata notice
≠ office has access entitlement
≠ technical retrieval succeeds or fails
≠ office receives substantive content
≠ office authors assessment
≠ another office receives assessment
≠ synthesis is authored
≠ President receives a bounded presentation
```

No step automatically grants the next.

Department possession does not imply leadership-office knowledge.

One office's receipt does not grant another office the same content.

Technical retrieval does not itself constitute substantive receipt.

---

# 5. Accepted section and chronology protections

Substantive knowledge remains section-scoped.

Partial office-to-office transfers are legal, but a synthesis may preserve judgments and limitations only when the synthesizing office received all assessment sections required by the I2 semantic rule.

The ledger's complete stored artifact cannot supplement a recipient's partial receipt.

Derived knowledge also cannot predate its causal sources.

The accepted semantic validator enforces source-before-derivative ordering across:

- notices;
- retrievals;
- substantive receipts;
- assessments;
- office transfers;
- syntheses;
- presidential presentations;
- artifact revision/supersession;
- presentation revision/supersession.

Restoration therefore cannot create canonical staff or presidential knowledge before the supporting route existed.

---

# 6. Accepted retrieval outcomes

I2 accepts these distinct retrieval results:

```text
AVAILABLE_AT_OFFICE_BOUNDARY
ACCESS_DENIED
NOT_FOUND
FAILED
```

`ACCESS_DENIED` is driven by lack of valid entitlement.

`NOT_FOUND` and `FAILED` require valid entitlement plus explicit nonempty failure reason and provenance.

They may be followed by later successful retry.

For I2, selection of `NOT_FOUND` / `FAILED` remains bounded proof-fixture control. This acceptance does not establish a general autonomous retrieval infrastructure or operational-failure model.

---

# 7. Accepted disagreement proof

I2 accepts the configured Labor / NEC / OMB proof as evidence of the information substrate, not as a finished staff-AI model.

The proof demonstrates:

- Labor and NEC can reach materially different judgments over the same evidence version;
- NEC's configured conclusion depends on an explicit assumption;
- removing that assumption prevents the same conclusion;
- OMB can know a record exists, fail access, and conclude only that an estimate is unsupported—not infer the report's substance;
- the Chief of Staff can receive and synthesize multiple office assessments without overwriting their original judgments;
- withholding or narrowing receipt scope constrains what synthesis may preserve.

The configured assessment rules remain proof machinery. They are not general autonomous adviser behavior authority.

---

# 8. Accepted persistence evidence

POP runtime schema:

```text
2
```

POP save format:

```text
2
```

Configured proof version:

```text
0.2.0-pop0-i2
```

I2 accepts evidence for:

- exact-shape parsing;
- authenticated configuration identity;
- five nontrivial save checkpoints;
- byte-stable save/load/save;
- deterministic continuation;
- no replay or duplicate append during load;
- defensive owner-state copies;
- section-scope tamper rejection;
- causal-time tamper rejection;
- malformed-operation rejection before canonical mutation;
- I1-format save rejection rather than invented I2 migration history.

---

# 9. Verification accepted

Canonical CI run `33329735191` at exact accepted implementation SHA `f4d1e8d...` proves:

- 53/53 test files PASS;
- 689/689 tests PASS;
- POP0-I2 boundary graph PASS across 12 modules;
- accepted production graph PASS across 70 modules;
- typecheck PASS;
- lint PASS;
- authenticated artifact reconstructions PASS;
- production build PASS;
- built-runtime verification PASS.

The accepted candidate contains no POP0-I3 implementation.

---

# 10. Explicit non-authority

POP0-I2 acceptance does **not** accept or implement:

- Presidential Attention;
- escalation policy;
- administration workstreams;
- presidential decisions or commands;
- typed presidential acts or recipient dispatch;
- Housing adaptation into POP;
- employment simulation;
- autonomous congressional initiative;
- governor behavior;
- media or public belief;
- quiet-condition gameplay;
- playable POP UI;
- general staff AI;
- final Cabinet composition/personality;
- final information-retrieval failure model;
- Early Access scope;
- roadmap or release sequencing beyond the already bounded POP proof program.

`main` remains required at the frozen accepted I10 baseline until separately reviewed authority changes that invariant.

---

# 11. Carried watchpoints

1. Rename/split the historically named `check-pop0-i1-boundaries.mjs` as the POP graph grows.
2. Strengthen reverse/player-facing boundary verification before POP full-state projections enter an actual UI graph.
3. Do not promote configured assessment acts into implicit general staff AI.
4. Do not promote proof-fixture `NOT_FOUND` / `FAILED` selection into a player or generic production superpower.
5. Keep repeated legacy CI timeout increases visible as performance/runner evidence.

---

# 12. Next authorization

## POP0-I3 design may begin.

The next design increment may specify only the accepted POP0-I3 question around:

- valid escalation from I2 office information into Presidential Attention;
- administration workstreams remaining projections/coordination rather than state owners;
- typed presidential acts and explicit dispatch boundaries;
- recipient-owned response rather than direct presidential outcome control.

Before any POP0-I3 runtime implementation begins, produce a compact I3 executable contract, submit it for detached design review, repair if required, and issue separate I3 implementation authority only after that gate passes.

No POP0-I4 or later work is authorized by this receipt.