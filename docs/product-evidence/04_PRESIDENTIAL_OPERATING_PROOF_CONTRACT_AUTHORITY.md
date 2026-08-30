# Presidential Operating Proof 0 — Executable Contract Authority

Status: **ACCEPTED PRODUCT-EVIDENCE IMPLEMENTATION AUTHORITY FOR POP0-I1 ONLY.**

This receipt accepts the repaired Presidential Operating Proof 0 executable contract:

1. `00_PRESIDENTIAL_OPERATING_PROOF_EXECUTABLE_CONTRACT.md`
   - candidate commit: `55717b37475d747cf2ca1b18630b8bddff2aee96`;
2. `02_PRESIDENTIAL_OPERATING_PROOF_CONTRACT_REPAIR.md`
   - controlling repair commit: `b00bc44d26339a92166b4dce1822da727025f7a3`.

Audit evidence:

- `01_PRESIDENTIAL_OPERATING_PROOF_CONTRACT_DETACHED_AUDIT.md`
  - commit: `037a5bebd2925354650c24deb12a5f3ac6023b00`;
  - verdict: **REVISE — 2 blocking findings, 3 bounded clarifications**;
- `03_PRESIDENTIAL_OPERATING_PROOF_CONTRACT_FINAL_REAUDIT.md`
  - commit: `1a448c78484769641a6cd7f5884a90e62bd34ea3`;
  - verdict: **PASS** under the unchanged gate.

Clean implementation ancestry:

- branch: `implementation/presidential-operating-proof-0`;
- accepted production parent/merge base: `44c1724962830225e6fc34f41d0df0cfdb7dfec0`;
- Stage 1 commit `a7e04ca78ba1ccb06d8dc3a4dfb0d43389804144` is not in branch ancestry.

Controlling external design authority:

- presidential-game and Living Country closure: `46f0a035ac529ed96a9dee5c9daa060d25e6886f`;
- post-constitution implementation preflight: `7d144c2930ef5b6ef62d8ec8e3ec09f0c4aaf613`.

Where accepted POP-0 documents conflict:

```text
02_PRESIDENTIAL_OPERATING_PROOF_CONTRACT_REPAIR
→ controls
00_PRESIDENTIAL_OPERATING_PROOF_EXECUTABLE_CONTRACT
```

The audit documents explain the review and do not independently define implementation behavior.

---

# 1. Accepted proof objective

POP-0 is accepted as one bounded product-evidence program asking:

> **Can a player direct a bounded United States presidential administration through several concurrent, causally honest situations—using imperfect information, identifiable advisers, proactive investigation, delegation, autonomous institutions, dated time, delayed consequences, and a legible historical record—and want to advance the calendar again?**

The proof retains:

> **Narrow experiment. Broad product.**

The 90-day fixture, four selected threads, fictional actors, 2029 date, and disclosed chamber balance do not define the final game, Early Access scope, or commercial start.

---

# 2. Accepted graduation/discard boundary

I10 remains an independent regression fixture.

POP-0 is built beside it for safety but uses production-intended interfaces capable of becoming the basis of a future production composition if the proof passes.

The proof must maintain one canonical state for every fact.

It may not create:

- duplicate domain state for briefings;
- UI-only knowledge truth;
- card-owned initiative or consequence state;
- a second historical truth;
- a synchronized proof/I10 pair.

If POP-0 passes, its operating composition becomes a candidate future production basis.

If it fails, the proof coordinator, projections, UI, and content package may be discarded without discarding accepted lower-level engines.

---

# 3. Legacy-session prohibition

The proof may not embed, synchronize, serialize, or use as its canonical child engine/domain API:

- `IntegratedPartialRuntimeSession`;
- the current `ProductionGameSession` alias;
- `ProductionGameView`;
- `availablePlayerActions`;
- `dispatchPlayerCommand`;
- Stage 1 attention helpers;
- an opaque I10 format-11 save.

Existing systems are reused through direct lower-level owner state/transitions or narrow non-owning typed adapters.

A general adapter cannot contain proof actor IDs, fixture dates, route chronology, action-prefix dispatch, duplicate state, or pre-resolved recipient outcomes.

The POP save contains direct proof/owner state and is not an I10 save plus sidecar.

---

# 4. Autonomous versus configured proof content

Configured opening facts and scheduled institutional/evidentiary opportunities are permitted when they possess explicit owner/provenance state.

Load-bearing actor choices during the proof remain owner-derived, including:

- congressional initiative and procedure use;
- governor/organization response;
- media investigation/publication;
- White House retrieval, interpretation, disagreement, synthesis, and escalation;
- recipient response to presidential instruments.

The proof must include reproducible no-screenplay counterfactuals for congressional initiative, media behavior, and White House escalation.

Changing a load-bearing input must be capable of changing, delaying, narrowing, or preventing the result without inserting replacement drama.

---

# 5. Configured synthetic fixture roots

POP-0 may terminate opening provenance at declared:

```text
CONFIGURED_SYNTHETIC_PROOF_ROOT
```

because it is not a generated-prehistory proof.

Every load-bearing opening fact still needs one owner, effective time, root/reference, and cross-owner reconciliation.

Briefing text, UI cards, desired options, and hidden-story flags cannot serve as provenance.

The hidden Housing problem must exist in an underlying owner record before discovery.

---

# 6. Analysis-only stub boundary

Modeled/bounded downstream estimates may exist only as evidence or staff-assessment artifacts with producer, source lineage, time, scope, support, uncertainty, proposition, access/receipt, and revision state.

They may affect an actor or office only through valid receipt and interpretation.

They do not directly write:

- actor or public belief;
- political pressure or salience;
- option availability;
- household income;
- healthcare coverage;
- public finance;
- material outcomes.

---

# 7. Current implementation authorization

## **POP0-I1 ONLY**

This authority permits implementation of:

> **POP0-I1 — clean operating composition and regression shell**

Required I1 result:

1. branch merge base remains exactly `44c1724962830225e6fc34f41d0df0cfdb7dfec0`;
2. Stage 1 remains absent;
3. one proof configuration identity and one proof factory exist;
4. the factory creates one production-shaped proof operating state;
5. no nested legacy session, I10 save string, ProductionGameView, or global action list exists in that state;
6. lower-level owner state is included directly or through non-owning typed adapters;
7. proof IDs/dates remain in content/configuration rather than the coordinator;
8. one versioned POP save-envelope skeleton serializes/restores direct canonical state;
9. same-history shell load is idempotent;
10. import rules exclude audit APIs, Stage 1, global action dispatch, and whole-session nesting;
11. the normal I10 factory and full baseline verification remain green;
12. no playable UI, proof-thread behavior, office simulation, Attention, workstreams, or broad domain implementation enters I1.

---

# 8. I1 gate and later increments

POP0-I1 must end at a reviewable candidate commit or bounded candidate chain.

Before POP0-I2 begins, a detached review must return PASS, REVISE, or REJECT against the I1 question:

> **Can a separate production-shaped operating world be created without importing Stage 1, wrapping the I10 session, creating duplicate canonical state, or breaking the accepted I10 regression runtime?**

A PASS requires explicit I1 acceptance authority.

POP0-I2 through POP0-I7 remain planned proof stages and are not currently authorized code scope.

The accepted contract is pinned by the immutable commits listed above. Any change to acceptance criteria, non-goals, proof scope, or graduation rules requires an explicit reviewed amendment.

---

# 9. Current non-goals

POP0-I1 does not authorize:

- playable UI;
- offices, staff assignments, knowledge ledger, or presidential presentation;
- Attention or workstreams;
- typed presidential acts and dispatch;
- inherited Housing adapter;
- Labor, media, quiet-condition, governor, organization, or new congressional thread behavior;
- generated prehistory;
- 2029-versus-2033 choice;
- Early Access scope;
- production migration;
- main-branch changes.

---

# 10. Authority verdict

## **ACCEPTED — POP0-I1 CODING MAY BEGIN**

The executable proof contract is now sufficiently closed to begin the first bounded implementation increment.

This is not authorization to build the full 90-day proof in one pass.
