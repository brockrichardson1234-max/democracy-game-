# Presidential Operating Proof 0 — Contract Repair

Status: **CONTROLLING CONTRACT REPAIR CANDIDATE. DOCUMENTATION ONLY. NO RUNTIME OR UI IMPLEMENTATION AUTHORIZED UNTIL FINAL RE-AUDIT PASS AND SEPARATE AUTHORITY RECEIPT.**

Repairs:

- candidate: `00_PRESIDENTIAL_OPERATING_PROOF_EXECUTABLE_CONTRACT.md`
- candidate commit: `55717b37475d747cf2ca1b18630b8bddff2aee96`
- detached audit: `01_PRESIDENTIAL_OPERATING_PROOF_CONTRACT_DETACHED_AUDIT.md`
- audit commit: `037a5bebd2925354650c24deb12a5f3ac6023b00`
- audit verdict: **REVISE — 2 blocking findings, 3 bounded clarifications**

Where this document conflicts with `00`, this repair controls.

The proof question, 90-day fixture, four-thread scope, product doctrine, playtest gate, and graduation/discard model remain unchanged.

---

# 1. Closed composition boundary

## 1.1 Legacy I10 is regression, not a child engine

The Presidential Operating Proof composition may not embed, synchronize, serialize, or treat any of the following as its canonical country engine or domain-owner API:

- `IntegratedPartialRuntimeSession`;
- `ProductionGameSession` as currently aliased to the integrated session;
- `ProductionGameView`;
- `availablePlayerActions`;
- `dispatchPlayerCommand(actionId)`;
- Stage 1 attention helpers;
- an opaque format-11 I10 save string.

Forbidden shape:

```text
PresidentialOperatingProofSession
  ├─ legacy IntegratedPartialRuntimeSession
  ├─ administration sidecar state
  ├─ attention sidecar state
  └─ new UI
```

Even if that wrapper contains only one copy of each fact, it would preserve the legacy route dispatcher as the operating core and could not graduate cleanly.

## 1.2 Permitted reuse

The proof may reuse or adapt lower-level accepted owners and pure transitions, including where appropriate:

- calendar and boundary utilities;
- configuration and artifact validation;
- institutional/office/assignment state;
- legislative runtime state and transitions;
- political actors, organizations, commitments, and votes;
- public-finance and implementation records/transitions;
- Housing state and transitions;
- information artifact and delivery primitives;
- legal-contest state and transitions;
- election/succession and ControlBinding primitives;
- persistence-validation patterns.

Reuse occurs through:

```text
canonical owner state
→ typed owner operation or narrow adapter
→ owner-returned state/record
```

not through legacy global player actions.

## 1.3 Narrow adapter contract

A proof adapter may:

- translate one accepted owner’s existing state into a typed operating interface;
- invoke that owner’s legitimate transition function;
- validate identities, authority, time, and results;
- expose owner-neutral records to the coordinator.

It may not:

- own a second copy of the fact;
- infer canonical state from `ProductionGameView`;
- invoke action-ID prefixes or fixture route commands;
- contain proof actor names, fixed dates, or story chronology in a general handler;
- pre-resolve another owner’s response;
- turn a legacy whole-session save into the proof’s canonical world.

Proof-specific actor IDs, dates, opening records, and thread parameters belong in the proof content/configuration package.

## 1.4 Proof save boundary

The POP-0 save envelope serializes:

- proof configuration/artifact identity;
- canonical owner states used by the proof;
- presidential operating state;
- office/assignment/receipt/presentation state;
- workstreams, instruments, dispatch, and record-index state;
- active history identity;
- permitted navigation state separately.

It may not serialize a synchronized or nested I10 save as its underlying world.

I10 format 11 remains separately loadable only through the I10 regression factory.

## 1.5 No lockstep worlds

Running the Presidential Operating Proof does not instantiate or advance a second I10 world in parallel.

I10 tests may create their own independent regression sessions.

Those sessions do not share mutable state, clocks, receipts, actions, or saves with POP-0.

## 1.6 POP0-I1 enforcement

POP0-I1 must include machine-verifiable checks that the new proof composition and save path do not import or invoke:

- `integrated-session.ts` as a whole-session dependency;
- the current `production-contract.ts` player action/view as owner input;
- `dispatchPlayerCommand`;
- `availablePlayerActions`;
- `opening-usability.ts`;
- Stage 1 source or artifacts.

A lower-level module that is also imported by I10 remains permitted.

The import check should target semantic dependency, not ban shared owner modules.

---

# 2. Configured causes versus owner-derived political behavior

## 2.1 Configurable proof facts

The configured fixture may supply, with explicit ownership and provenance:

- opening stocks, relationships, office assignments, and party/chamber shape;
- a firm’s already-made plant-closure decision and dated separation plan;
- statutory, contractual, procedural, or evidentiary deadlines;
- measurement observation and scheduled-release dates;
- standing agency and White House instructions;
- inherited Housing legal, fiscal, recipient, administrative, and material records;
- actor objectives, public records, relationships, information access, resources, and procedural opportunities;
- configured external/environmental facts that are inputs rather than actor choices.

These configured facts may initiate causal processes.

They must not directly specify the later actor decisions listed below.

## 2.2 Owner-derived behavior required during play

The following load-bearing outcomes must be selected/resolved during the proof by the relevant owner from bounded state:

- whether affected lawmakers adopt, sponsor, introduce, amend, delay, abandon, or oppose the employment initiative;
- whether leadership/committee owners grant or deny the relevant procedural opportunity;
- whether governors communicate, coordinate, act independently, delay, or remain inactive;
- whether labor/industry organizations mobilize, contact, support, oppose, or remain inactive;
- whether a local or national media actor investigates, publishes, follows, ignores, or reframes available evidence;
- whether White House offices retrieve, interpret, disagree, synthesize, escalate, delegate, or leave a matter below presidential attention;
- whether recipients of presidential instruments comply, narrow, delay, reject, modify, or take no action.

These may be deterministic under one seed and configuration.

They may not be pre-authored as an ordered calendar of final choices.

## 2.3 Scheduled opportunity is not scheduled decision

A hearing window, report release, offer expiration, or meeting slot may be scheduled.

The actor’s use of that opportunity remains owner-derived.

Example:

```text
committee hearing window exists March 3
≠ committee is scripted to adopt the bill March 3
```

## 2.4 No-screenplay counterfactual gate

The proof must preserve at least one reproducible non-player counterfactual for each of these families:

1. congressional initiative;
2. media publication/coverage;
3. White House escalation.

A valid counterfactual changes one load-bearing causal input, such as:

- evidence availability or timing;
- actor objective/relationship;
- committee opportunity;
- organization resource;
- outlet access/editorial priority;
- office receipt or delegated threshold.

The relevant actor result must then:

- change;
- narrow;
- occur later;
- move to another legitimate route;
- or not occur.

Unrelated owner state remains unchanged except through legitimate downstream effects.

No substitute event may be inserted merely to preserve decision density or drama.

## 2.5 Explicit rejection test

The final automated/adversarial matrix must reject proof content shaped as:

```text
Feb 12 senators introduce
Feb 15 governor calls
Feb 19 local story publishes
Mar 1 national story publishes
Mar 6 White House escalates
```

when those are configured final actor choices rather than outputs of owner state and procedure.

Configured initiating material events and scheduled evidence releases remain legitimate.

---

# 3. Analysis-only stub information route

An analysis-only downstream estimate is an evidence or staff-assessment artifact, not invisible helper state.

It must identify, at the accepted proof resolution:

- producer/analytical owner;
- source records and dependency lineage;
- as-of/reference time;
- population/geography/entity scope;
- method or bounded transformation;
- support and uncertainty;
- claim/proposition;
- revision/supersession status;
- access/receipt path.

It may influence an officeholder, lawmaker, governor, organization, or other actor only through:

```text
artifact exists
→ actor/office can access or receives it
→ recipient interprets it
→ recipient-owned belief/assessment/action may change
```

It may not directly mutate:

- actor belief;
- public cognition;
- political pressure;
- issue salience;
- option availability;
- canonical household income;
- healthcare coverage;
- fiscal receipts/outlays;
- material outcomes.

An option may reference an estimate after a legitimate decision-package or actor-assessment process. The estimate’s existence alone does not place the option before the President.

---

# 4. Synthetic opening-root provenance and reconciliation

## 4.1 Proof roots

POP-0 is not a generated-prehistory proof. Therefore a load-bearing opening fact may terminate at a declared:

```text
CONFIGURED_SYNTHETIC_PROOF_ROOT
```

This is a proof-only provenance class, not a claim of real or generated history.

## 4.2 Required opening provenance

The following opening facts must have an owner, effective time, configured root/accepted inherited record, and necessary cross-owner references:

- President, Vice President, administration, officeholders, acting status, and ControlBinding;
- House/Senate assignments, leadership, committee opportunity, and party/chamber totals;
- governors and relevant actor/organization relationships;
- inherited Housing law, fiscal authority, controls, awards, obligations, payments, recipient/state status, project state, waiver/administrative records, and monitoring products used by the proof;
- plant, regional Labor stocks/flows, closure occurrence, and separation schedule;
- maternity-service facilities/catchments/closure or withdrawal occurrences;
- monitoring/index/access state;
- open assignments, delegated instructions, deadlines, commitments, and known communications.

## 4.3 Reconciliation

Before the playable proof boots, the configured opening must reconcile at least:

- offices and assignments;
- Congress and procedural state;
- law/fiscal/implementation/Housing records;
- aggregate Labor state and exact plant overlay;
- population/geography scopes used by the threads;
- source possession, White House index/access, office receipt, and presidential presentation;
- dates, deadlines, and already-completed versus pending occurrences.

A contradiction fails fixture loading.

## 4.4 Presentation cannot be provenance

The following are not acceptable proof roots:

- a briefing sentence;
- a card status;
- a desired player option;
- a UI badge;
- a scripted “story state.”

The opening briefing and views derive from configured owner state and analytical artifacts.

## 4.5 Hidden-but-discoverable Housing problem

The Housing problem must exist in the relevant agency, implementation, recipient, legal, evidence, or material owner state.

A `hiddenProblem = true` UI/config flag without the underlying record is forbidden.

---

# 5. Incremental authorization and immutable goalpost

## 5.1 Initial authority scope

Final acceptance of the POP-0 executable contract authorizes code for:

```text
POP0-I1 — clean operating composition and regression shell
```

only.

POP0-I2 through POP0-I7 remain planned proof stages, not pre-authorized implementation scope.

## 5.2 POP0-I1 candidate boundary

POP0-I1 may produce a bounded commit or clearly identified short commit chain containing only what its required result needs:

- proof factory/configuration identity;
- operating state identity;
- direct lower-level owner references/adapters;
- versioned proof save-envelope skeleton;
- production/audit/import boundary enforcement;
- branch/Stage-1 exclusion checks;
- regression verification.

No playable UI, four-thread implementation, office simulation, Attention system, or broad domain work is authorized in I1.

## 5.3 I1 gate

Before POP0-I2 begins, a detached review must verify:

- exact clean ancestry and branch scope;
- I10 remains green;
- the new factory boots one canonical proof state;
- the proof does not nest or synchronize the legacy I10 session;
- the proof save serializes direct proof/owner state rather than an opaque I10 save;
- Stage 1 and global player-action semantics are absent;
- no premature thread or UI implementation entered I1;
- no new general abstraction lacks an I1 consumer.

That review returns PASS, REVISE, or REJECT.

Only an explicit I1 acceptance action authorizes POP0-I2.

## 5.4 Contract amendments

The accepted contract is pinned by immutable commit references.

Implementation may not silently edit acceptance criteria, non-goals, thread semantics, or graduation rules.

A required change must be preserved as an explicit contract amendment with rationale, scope, and review before relying on it.

Discovered dependencies may reorder later increments only through the contract’s recorded dependency-change rule; they do not expand current authorization automatically.

---

# 6. Updated POP0-I1 required result

POP0-I1 must now produce all and only the following evidence:

1. clean branch merge-base remains `44c1724962830225e6fc34f41d0df0cfdb7dfec0`;
2. Stage 1 source/artifacts remain absent;
3. one proof configuration identity and one proof factory exist;
4. the factory creates one production-shaped proof operating state;
5. the state contains no nested legacy session, I10 save string, ProductionGameView, or global available-action list;
6. lower-level owner state is included directly or through non-owning typed adapters;
7. proof-specific IDs/dates remain in content/configuration rather than the coordinator;
8. one versioned POP save envelope skeleton serializes/restores direct canonical state;
9. load is idempotent at the shell level;
10. import rules exclude audit APIs, Stage 1, legacy global action dispatch, and whole-session nesting;
11. normal I10 factory and full baseline verification remain green;
12. no playable UI or proof-thread behavior is included.

---

# 7. Re-audit question

The audit question remains unchanged:

> Does the repaired contract define a production-shaped, discardable-if-wrong but gradable-if-right presidential operating proof that can begin at POP0-I1 without importing Stage 1, duplicating canonical state, wrapping the I10 orchestration monolith, scripting autonomous politics, or weakening the accepted ownership and bounded-knowledge rules?

## Disposition

**READY FOR FINAL DETACHED RE-AUDIT.**

No implementation authority is claimed by this repair alone.
