# POP0-I1 — Operating Composition Authority

Status: **ACCEPTED PRODUCT-EVIDENCE IMPLEMENTATION AUTHORITY FOR POP0-I1. POP0-I2 IMPLEMENTATION IS NOW AUTHORIZED; POP0-I3+ REMAIN UNAUTHORIZED.**

Accepted POP0 executable-contract authority:

- `04_PRESIDENTIAL_OPERATING_PROOF_CONTRACT_AUTHORITY.md`
- commit: `00ca4cb181f06b2ad3748f0a305abee775f0e578`

Accepted I1 implementation chain:

1. `8920f260b89a77866d6e2aaad844ed420bfa5243` — operating composition shell;
2. `b031f47a6f5c901d7c76d26f011401f35a039620` — boundary/restoration evidence repair;
3. `8330d07ee3e643ce9c67b5e0bda44aeb04da3ce2` — CI ancestry-checkout repair;
4. `460a3acb9bcfd628895ad6908c04da3c79de076f` — legacy I6 timeout-budget hardening.

Detached review evidence:

- `05_POP0_I1_DETACHED_AUDIT.md`
  - commit: `c2054aa5c8bb607e9fd9b2f84d02548f0a53e8a6`
  - verdict: **REVISE — 1 blocking verification finding, 3 nonblocking watchpoints**;
- `06_POP0_I1_FINAL_REAUDIT.md`
  - commit: `aa61f497bd8b53fbbfd2eafdc2469fc10a2897bf`
  - verdict: **PASS** under the unchanged I1 gate.

Accepted production merge base:

- `44c1724962830225e6fc34f41d0df0cfdb7dfec0`

Rejected Stage 1 commit remains outside branch ancestry:

- `a7e04ca78ba1ccb06d8dc3a4dfb0d43389804144`

Exact final verification evidence:

- implementation SHA: `460a3acb9bcfd628895ad6908c04da3c79de076f`
- GitHub Actions run: `33313400875`
- result: **SUCCESS**
- tests: **49/49 files, 657/657 tests PASS**
- targeted POP0-I1: **4/4 PASS**
- I10 convergence/regression: PASS
- typecheck/lint/artifact verification/build/built-runtime checks: PASS

---

# 1. Accepted I1 result

POP0-I1 has established a clean production-shaped operating-composition shell independent of the legacy I10 application session.

The accepted shell provides:

- one authenticated proof configuration identity;
- one proof scenario identity;
- one operating-world identity;
- direct lower-level owner state, currently the accepted calendar state;
- one proof factory;
- one dedicated versioned POP save envelope;
- exact shape/configuration/owner validation;
- deterministic/idempotent shell restoration;
- machine-enforced exclusion of Stage 1, legacy whole-session dependencies, global action semantics, and common audit-only APIs;
- canonical CI evidence that the accepted I10 regression product remains green.

The shell is intentionally minimal.

It does not claim playable presidential gameplay yet.

---

# 2. Architectural boundary now accepted

The future Presidential Operating Proof may grow this operating composition by adding direct canonical owner state or narrow non-owning adapters.

It may not regress into:

```text
Presidential Operating Proof
→ nested IntegratedPartialRuntimeSession
→ ProductionGameView
→ global availablePlayerActions
→ dispatchPlayerCommand
→ new UI around the old route
```

The I10 runtime remains an independent regression fixture rather than a synchronized child world.

The POP save remains a direct serialization of POP/owner state rather than an I10 save plus sidecar.

---

# 3. Verification boundary accepted

The branch verification now establishes in canonical CI that:

- complete ancestry is available for verification;
- the branch merge base remains the accepted production baseline;
- current `main` remains at that baseline during POP proof development;
- Stage 1 is absent;
- POP imports do not reach the legacy session/action surfaces;
- the normal production application still resolves the accepted I10 runtime;
- baseline authenticated artifacts and regression suites remain valid.

Three legacy I6 test timeout budgets were widened only to tolerate current hosted-runner variance; no assertion or runtime semantic was weakened.

---

# 4. Carried implementation constraints

The following watchpoints become explicit gates for POP0-I2 and later work.

## 4.1 Player-facing code may not consume full canonical state

`getOperatingState()` remains shell/test evidence only.

Before a playable POP view exists, player-facing imports must use bounded projections and may not gain debug truth through this method or an equivalent renamed full-state API.

## 4.2 Persistence extensions must be atomic

Every new canonical I2 owner/state family must be added consistently to:

- runtime state identity/type;
- validators;
- copy logic;
- save envelope/parser;
- restoration tests.

No state may be omitted from save and regenerated as though it never existed.

## 4.3 Boundary checks must evolve with the actual graph

The I1 import scanner is sufficient for the current small composition.

When I2 creates new entry paths or semantics, tests/checkers must verify those actual paths rather than relying only on forbidden identifier spelling.

---

# 5. POP0-I2 authorization

## **AUTHORIZED: POP0-I2 ONLY**

POP0-I2 question:

> **Can different administration offices possess, retrieve, assess, and present information without becoming one mind?**

POP0-I2 may implement only the bounded capabilities already defined by the accepted POP-0 executable contract:

- selected proof offices and fictional officeholders;
- office-owned records;
- assignments, owner-specific queues, and deadlines;
- institution possession/index/retrieval/office-receipt state;
- staff assessment artifacts and at least one preserved disagreement;
- bounded presidential presentation history;
- save/load idempotency for the new state;
- required boundary and persistence tests.

POP0-I2 must preserve the I1/I10 gates.

---

# 6. Still unauthorized

This receipt does **not** authorize POP0-I3 or later work, including:

- Presidential Attention/escalation gameplay;
- administration workstreams;
- typed presidential acts or recipient dispatch;
- inherited Housing adapter;
- Labor/employment thread;
- autonomous congressional POP initiative;
- governors/organizations/media proof behavior;
- maternity-service quiet-condition mechanism;
- playable POP UI;
- product-scope or Early Access decisions;
- production migration or changes to `main`.

Each later increment requires its own candidate and detached review under the accepted POP contract.

---

# 7. Authority verdict

## **POP0-I1 ACCEPTED**

The first implementation increment has successfully established the clean operating shell the proof needs without importing the rejected Stage 1 experience or preserving I10's narrow route orchestration as the new product architecture.

**POP0-I2 coding may begin under this receipt.**