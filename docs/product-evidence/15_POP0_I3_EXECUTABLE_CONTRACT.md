# POP0-I3 — Presidential Attention, Workstreams, Typed Acts, and Dispatch Executable Contract

Status: **IMPLEMENTATION-DESIGN CANDIDATE — DOCUMENTATION ONLY.** This document does not authorize POP0-I3 coding. Implementation requires detached design review, any required bounded repair, an unchanged-gate PASS, and a separate implementation-authority action.

Accepted parent authority:

- POP0-I2 acceptance authority: `14_POP0_I2_AUTHORITY.md` at `a3766f6136a83b40409f6fadb2d54102a6357576`;
- accepted POP0-I2 implementation/evidence: `f4d1e8d765e707a2ab79d4fc4dc29414f0d2d7e8`;
- accepted production merge base: `44c1724962830225e6fc34f41d0df0cfdb7dfec0`;
- controlling POP-0 contract: `00_PRESIDENTIAL_OPERATING_PROOF_EXECUTABLE_CONTRACT.md`, as repaired and accepted by documents 02 and 04.

This document narrows only the authorized I3 design increment. Accepted parent contracts control any conflict.

---

# 1. Question and pass gate

POP0-I3 asks:

> **Can the player intervene through real presidential authority without global action IDs, hidden instrument fan-out, or direct control of recipient outcomes?**

I3 passes only if one canonical operating world proves:

1. a valid office-owned escalation can arise from the accepted I2 information route and preserved disagreement without automatically becoming presidential knowledge;
2. Presidential Attention is derived only from active, boundedly presented escalation or due reserved-review records and may be empty;
3. the I2 presidential presentation binding remains knowledge history while a separate authenticated `ControlBinding` governs player authority;
4. an administration workstream owns only adopted objective and coordination history while referencing, not duplicating, evidence, assignments, decisions, instruments, dispatch, or results;
5. the player's choice creates an immutable typed decision and only the instruments shown before confirmation;
6. each outgoing instrument has exactly one explicit recipient and no wildcard or administration-wide fan-out;
7. authorization, dispatch attempt, technical delivery, recipient-office receipt, recipient disposition, office assignment, and assignment result remain separate facts;
8. recipient disposition is owned by the recipient office and cannot be selected by the presidential command;
9. a cross-owner historical index references canonical occurrences without copying their substantive truth or leaking unseen office state;
10. all new state, including the session-owned control binding, restores exactly and idempotently;
11. the I1/I2 boundaries, I10 regression runtime, and canonical CI remain green;
12. no Housing adapter, employment owner, Congress, media, public belief, playable UI, or POP0-I4+ behavior enters the composition.

Any global action list, action-prefix dispatcher, severity-derived Attention, decision-created recipient result, shared administration response state, or workstream-owned domain truth fails I3.

---

# 2. Exact proof package

## 2.1 Accepted I2 composition remains canonical

I3 reuses exactly the accepted I2 proof identities:

- six operating offices and six officeholder assignments;
- two department institution identities;
- President Elena Ward's presidential recipient binding;
- the seven authenticated population-linkage declarations;
- partitioned office assignments and queues;
- the noncognitive recipient-scoped information-route ledger;
- immutable Labor, NEC, OMB, and Chief-of-Staff artifacts;
- bounded presidential presentation history;
- the authoritative POP calendar owner.

I3 adds no human actor, institution, ordinary Population owner, population weight, household, residence, electorate, material exposure, public belief, or eligibility relationship.

All seven named humans remain, for I3 only:

```text
OUTSIDE_MODELED_ORDINARY_POPULATION_SCOPE
```

under the exact I2 restrictions. `ControlBinding`, escalation, workstream participation, instrument receipt, and recipient disposition are permitted office/constitutional relationships only; none is a Population linkage.

## 2.2 Planned version identities

An accepted I3 implementation would advance:

```text
configuration/scenario version: 0.3.0-pop0-i3
POP runtime schema:             3
POP save format:                3
```

The scenario remains:

```text
us-presidential-operating-proof-v0
APPROXIMATED_NON_HISTORICAL_PRODUCT_PROOF
```

No implementation may advance these versions before separate coding authority.

## 2.3 New owner and session identities

I3 may add exactly these canonical owner families:

| Owner identity | Owns | Explicitly does not own |
|---|---|---|
| `pop0.owner.presidential-escalations` | escalation, default, and reserved-review records | Attention cards, evidence, workstreams, recipient results |
| `pop0.owner.administration-workstreams` | workstream identity and append-only coordination transitions | country conditions, evidence, office queues, material outcomes |
| `pop0.owner.presidential-decisions` | immutable presidential decision records | instrument delivery or recipient response |
| `pop0.owner.presidential-instruments` | immutable authorized instrument payloads | dispatch, receipt, compliance, assignment results |
| `pop0.owner.instrument-dispatches` | noncognitive dispatch attempts and delivery outcomes | recipient knowledge, interpretation, or action |
| `pop0.owner.historical-record-index` | stable references to indexed occurrences | copied occurrence content or player knowledge |

The existing partitioned office-operations owner expands atomically with office-owned instrument receipts and recipient dispositions. Those records remain inside the specific recipient office state; they do not form a shared White House inbox.

The accepted presidential-presentation owner expands atomically with a typed escalation-presentation record. Escalation creation and escalation presentation remain separate facts.

The session may add one non-world permission binding:

```text
pop0.control-binding.presidential-operating
decision surface: PRESIDENTIAL_OPERATING_DECISION_SURFACE
```

The configured unbranched I3 history identity is:

```text
pop0.history.primary
```

Every historical index entry and the format-3 save bind to that identity. I3 does not implement rollback or branching.

`Presidential Attention` and player-safe workstream/history views are derived projections. They are not owner states and are never serialized as canonical truth.

## 2.4 Exact I3 fixture content

I3 extends the accepted I2 worked trace only after the bounded presentation at:

```text
2029-02-05T09:30:00-05:00
```

The proof fixture may configure, with `CONFIGURED_SYNTHETIC_PROOF_ROOT` provenance:

- one Chief-of-Staff standing coordination authority;
- one semantic escalation-eligibility rule for a fully received synthesis that preserves conflicting judgments over the same proposition;
- three locally bound presidential options;
- one no-instrument expiration/default rule;
- one workstream review deadline;
- technical dispatch availability inputs for deterministic proof tests.

The fixture may configure causes, authority, options, deadlines, and technical opportunities. It may not configure:

- that the Chief of Staff will create the escalation;
- which option the President will select;
- that either instrument will be dispatched or delivered;
- how Chief of Staff or OMB will disposition a received instrument;
- that an office assignment will be created or completed;
- a replacement event if any step does not occur.

---

# 3. Presidential role and player authority

## 3.1 Presentation recipient is not control authority

The accepted I2 `PresidentialRecipientBinding` continues to answer only:

```text
Which actor validly occupied the configured presidential office
when a bounded presentation occurred?
```

It does not become player identity, executive entitlement, office-information access, or authorization to issue a presidential act.

## 3.2 Session-owned ControlBinding

I3 must reuse the accepted lower-level `AdministrationControlBinding` primitive directly or through a narrow non-owning adapter. It may not import a legislative session or the integrated I10 session to obtain authority.

The I3 binding records:

- binding identity;
- exact presidential operating decision surface;
- configured constitutional presidential office identity;
- bound presidential actor identity;
- `ACTIVE` or `ENDED` status;
- ended time and reason where applicable.

It is session-owned permission, not canonical country state. It serializes in an explicit `session` portion of the POP save envelope, outside `operatingState`, following the accepted separation used by lower-level authority primitives.

At every presidential decision:

1. the control binding must be active;
2. its constitutional office and actor must match the effective I2 presidential recipient binding at the authoritative instant;
3. the selected escalation must be active and directed to that presidential office;
4. the actor's I3 population-linkage declaration must remain valid without supplying any ordinary-population fact.

A missing, ended, mismatched, or stale binding leaves canonical escalations and time intact but blocks the presidential decision surface.

I3 does not implement elections, succession, incapacity, Vice-Presidential control, or officeholder turnover. It must nevertheless reconcile an existing binding safely if the configured presidential actor no longer matches.

## 3.3 No global player command surface

The session may expose narrow typed methods for I3 proof operations. It may not expose or import:

- `availablePlayerActions`;
- `dispatchPlayerCommand`;
- `ProductionPlayerAction`;
- action-ID prefixes or regular-expression route parsing;
- a mutable full operating state to any player-facing dependency graph.

Local option and instrument IDs are stable record identities only. Their strings carry no executable semantics. Runtime behavior follows exhaustive typed discriminants and validated payloads, never an ID prefix.

---

# 4. Canonical ownership and non-ownership

## 4.1 Escalation/review owner

The escalation owner stores only canonical escalation, explicit default, and reserved-review records.

It does not:

- decide that an office assessment is true;
- create or modify a source artifact;
- issue a presidential instrument;
- interpret a recipient response;
- own Attention ordering preferences or UI state.

## 4.2 Workstream owner

The workstream owner stores adopted administrative objective identity and coordination history.

It references existing owner records by stable ID. It never copies their substantive content and never becomes a generic issue, importance, policy, crisis, or material-domain owner.

## 4.3 Decision and instrument owners

A presidential decision is the President's selected intent under valid authority.

An instrument is one visible authorized act emitted by that decision.

They remain distinct immutable records. A decision may authorize zero, one, or a fully enumerated bundle of instruments. It cannot authorize a hidden future act, wildcard recipient, undisclosed promise, fiscal commitment, public statement, agency order, or downstream result.

## 4.4 Dispatch owner

The dispatch owner is routing infrastructure. It may record an attempt and a technical delivery result for one instrument and one exact recipient.

It is noncognitive and cannot:

- create office receipt;
- decide acceptance, narrowing, delay, refusal, or no action;
- create an office assignment;
- update a workstream;
- expose all dispatch records to every office or the President.

## 4.5 Recipient office owner

The exact recipient office owns:

- its instrument receipt;
- its officeholder-authored disposition;
- any later assignment it separately adopts under that disposition.

Another office, the central dispatcher, the workstream owner, and the presidential decision owner cannot write those records.

## 4.6 Historical index owner

The historical index owns only membership and stable lookup references for canonical occurrences. The referenced owner record remains the substantive source of truth.

The index is noncognitive, noncausal, and not itself a player knowledge grant.

---

# 5. Escalation, default, and Presidential Attention

## 5.1 Escalation record

A valid escalation minimally binds:

- escalation identity and immutable deduplication identity;
- escalating office and effective officeholder assignment;
- creation time and provenance;
- typed basis: receipt, synthesis conflict, duty, deadline, or reserved review;
- exact source record references available to the escalating office;
- exact earlier presidential presentation portions already shown, if cited as presidential knowledge at escalation creation;
- staff-only source references distinguished from President-known portions;
- the presidential judgment or authority requested;
- known facts as authored claims with source references;
- unresolved uncertainty and limitations;
- locally bound option definitions and full instrument previews;
- expiration/deadline;
- explicit no-instrument default for this I3 fixture;
- downstream resolver office identities;
- status and resolution/default/supersession references.

An escalation's authored summary does not become economic truth. Its factual support remains in the referenced I2 artifacts and presentations.

## 5.2 Valid I3 escalation path

The exact I3 eligibility rule requires:

1. the Chief-of-Staff office validly received every semantic section of both source assessments;
2. a valid Chief-of-Staff synthesis preserves conflicting judgments over the same configured proposition;
3. the President received the two configured synthesis summary portions but not the underlying Labor table or methods;
4. the escalating Chief-of-Staff holder is effective at escalation time;
5. the requested judgment concerns whether to use presidential authority for further bounded office analysis, reserve review, or allow the declared monitoring default;
6. all option, default, expiration, and downstream-resolver fields are complete.

General transition logic may validate those semantics. It may not contain logic equivalent to:

```text
if officeId == CHIEF_OF_STAFF and artifactId == PROOF_SYNTHESIS
  create dramatic Attention
```

The effective Chief-of-Staff officeholder must perform a typed escalation act. A presentation, disagreement, workstream, deadline, or configured rule does not automatically create the act.

Escalation creation does not prove the President received the escalation, its options, or its new authored uncertainty. A separate typed escalation-presentation operation must record exactly which escalation sections were shown under the accepted presidential presentation owner.

That escalation presentation binds:

- presentation identity and deduplication identity;
- source escalation;
- presenting office and effective officeholder assignment;
- exact shown escalation sections;
- referenced-but-not-shown source portions;
- presidential recipient binding;
- presentation time, purpose, and provenance.

It cannot expose an I2 artifact section that the presenting office did not validly receive or imply that a referenced attachment was shown.

## 5.3 Status and lifecycle

I3 escalation status is limited to:

```text
ACTIVE
RESOLVED_BY_DECISION
WITHDRAWN
EXPIRED_TO_DEFAULT
SUPERSEDED
```

Status changes are append-only occurrences or immutable superseding records. They cannot rewrite the original basis, options, knowledge, or deadline.

One active escalation may have at most one controlling presidential decision. A later presidential choice requires a separately valid new or superseding escalation.

## 5.4 Default behavior

The exact I3 expiration default is:

```text
NO_NEW_PRESIDENTIAL_INSTRUMENT
CONTINUE_EXISTING_OFFICE_MONITORING
```

Crossing the deadline with no decision may create one idempotent default occurrence and close the escalation. It does not dispatch, create a workstream, change a queue, invent an assessment, or manufacture replacement drama.

An explicit presidential `ALLOW_MONITORING_DEFAULT` choice records deliberate inaction and closes the escalation without waiting for expiration. It authorizes no outgoing instrument.

## 5.5 Reserved review

A locally bound `RESERVE_PRESIDENTIAL_REVIEW` option may create one review reservation with:

- reservation identity;
- source escalation and decision;
- reserved instant;
- bounded review question;
- presentation/source references expected at review;
- provenance and deduplication identity;
- completion, cancellation, or supersession reference.

Before its reserved instant it does not appear in Attention. When due and still active it may appear even if no new domain event occurred. It creates no evidence, assignment, workstream transition, or recipient response.

## 5.6 Attention projection

`Presidential Attention` is a pure projection over:

- `ACTIVE` escalations with a valid bounded escalation presentation to the effective President; and
- due, active reserved reviews.

For an escalation, the projection contains only fields in the valid escalation presentation plus identities/deadlines needed to answer:

- what record or duty caused the review;
- who escalated it;
- what exact portions the President has been shown;
- what remains staff-only, unknown, or uncertain;
- why presidential judgment is requested;
- the local options and complete visible instrument previews;
- expiration/default;
- downstream resolver identities.

Ordering is deterministic by expiration/reserved time, creation time, and stable identity. There is no severity score, route-stage classifier, action-prefix classifier, universal issue importance, or hidden priority meter.

An initial I3 world and a world after all active escalation/review records are closed must derive:

```text
[]
```

Empty Attention does not pause calendar, office, or workstream state.

A workstream deadline, assignment status, evidence change, ordinary I2 presentation, or unpresented escalation alone never creates Attention. A valid presented escalation or due reserved review remains required.

---

# 6. Administration workstreams

## 6.1 Canonical workstream shape

An I3 workstream consists of:

1. one immutable identity/objective record; and
2. append-only coordination transition records.

The identity/objective record binds:

- workstream ID, label, and adopted objective;
- creating office and effective officeholder assignment;
- standing or presidential authority reference;
- coordinator office;
- participating office IDs;
- creation time and provenance;
- initial source artifact/assessment/synthesis/presentation references;
- initial review/deadline references.

Each transition binds:

- transition identity and deduplication identity;
- workstream ID;
- prior transition reference;
- typed coordination status;
- acting office and effective officeholder assignment;
- exact source occurrence references supporting the coordination update;
- authoritative time, reason, and provenance.

Current status is derived from the latest valid transition. It is not stored as a separately mutable truth.

## 6.2 I3 statuses

I3 supports only:

```text
MONITORED
ACTIVE
DELEGATED
PAUSED
BLOCKED
COMPLETED
ABANDONED
```

The later inherited-Housing adapter and any additional lifecycle semantics remain I4+ work.

`COMPLETED` means the adopted administrative coordination objective completed. It does not mean an economic, fiscal, legal, Housing, employment, political, or public condition succeeded.

## 6.3 Non-ownership rules

A workstream may reference but never own or mutate:

- I2 source evidence or assessments;
- office receipts or knowledge;
- office assignment queue order;
- escalation or presentation history;
- presidential decision or instrument payloads;
- technical delivery or recipient disposition;
- material, legal, fiscal, congressional, media, public-belief, or population state.

Linking an occurrence to a workstream creates no new knowledge and no downstream fact.

An assignment result, recipient disposition, or presidential decision does not automatically change workstream status. An effective coordinating officeholder must author a separate validated workstream transition citing the occurrence.

No workstream status automatically creates Attention.

## 6.4 Exact I3 workstream

The proof uses one bounded coordination workstream:

```text
pop0.workstream.preliminary-labor-evidence-review
```

Its objective is limited to coordinating follow-up on the already accepted I2 disagreement and access gap. It is not:

- a plant-closure or employment-response thread;
- an employment simulation;
- a fiscal estimate;
- a national economic condition;
- a Housing workstream;
- proof of a material outcome.

The Chief-of-Staff office may create it under configured standing coordination authority after the valid I2 synthesis. Initial status is `MONITORED`. Creation alone produces no escalation or Attention.

---

# 7. Presidential decisions, options, and instruments

## 7.1 Locally bound options

The exact escalation exposes three options:

| Option kind | Visible effect before confirmation | Outgoing instruments |
|---|---|---|
| `REQUEST_SCOPED_ANALYSIS_AND_COORDINATION` | request bounded OMB analysis and request Chief-of-Staff coordination of the existing workstream | exactly two |
| `RESERVE_PRESIDENTIAL_REVIEW` | create one dated reserved-review record | zero |
| `ALLOW_MONITORING_DEFAULT` | record deliberate inaction under the declared no-instrument default | zero |

The first option's complete bundle is visible before confirmation:

1. one `REQUEST_OFFICE_ANALYSIS` instrument addressed only to OMB;
2. one `REQUEST_WORKSTREAM_COORDINATION` instrument addressed only to Chief of Staff / Presidential Operations.

The player cannot add a hidden third act, wildcard recipient, agency instruction, public communication, legislative position, expenditure, promise, or material result.

These are local escalation options, not a global action catalogue. Another escalation must carry its own valid typed options and previews.

## 7.2 Decision record

An immutable presidential decision records:

- decision ID and deduplication identity;
- active control-binding ID;
- President actor and constitutional office IDs;
- source escalation and selected local option;
- decision time;
- exact presidential presentation portions forming the decision basis;
- explicit acknowledged uncertainties;
- every authorized instrument ID, in visible order;
- reserved-review or deliberate-default reference where applicable;
- provenance;
- optional `supersedesDecisionId` referencing a strictly earlier decision.

The decision may not cite an I2 attachment or assessment portion the President was never shown as presidential knowledge.

Decision creation closes the active escalation through a separate resolution occurrence in the same validated transaction. It does not dispatch an instrument or mutate a recipient office.

## 7.3 Common instrument fields

Every instrument records:

- instrument ID, kind, version, and deduplication identity;
- authorizing decision and selected option IDs;
- issuing President actor and constitutional office IDs;
- exactly one recipient office ID;
- subject scope and explicit requested act;
- source/presentation references permitted to accompany the request;
- authority basis;
- issued time, requested response deadline, and provenance;
- revision/supersession lineage where applicable.

An instrument payload cannot include recipient disposition, future assignment result, compliance status, or workstream result.

## 7.4 `REQUEST_OFFICE_ANALYSIS`

This instrument additionally binds:

- requested question and product kind;
- exact evidence/artifact and section scope requested for use;
- known access limitation disclosed to the recipient where applicable;
- requested deadline;
- whether narrowing is permitted.

It requests analysis. It does not grant information access, create substantive receipt, author assessment, place work in the queue, or compel a result.

## 7.5 `REQUEST_WORKSTREAM_COORDINATION`

This instrument additionally binds:

- existing workstream ID;
- requested coordination objective;
- participating offices in scope;
- requested review time;
- explicitly permitted coordination actions.

It cannot create the workstream, change its status, reprioritize another office's queue, or create further instruments automatically.

Adding another presidential instrument family requires later reviewed design authority. I3 may not create a generic free-form command instrument.

---

# 8. Dispatch, office receipt, and recipient-owned response

## 8.1 Required causal ladder

I3 preserves this exact distinction:

```text
presidential decision exists
≠ typed instrument is authorized
≠ dispatch is attempted
≠ instrument reaches the recipient office boundary
≠ recipient office admits receipt
≠ effective officeholder dispositions the request
≠ recipient office creates an assignment
≠ assignment produces a result
≠ President is informed of any later response
```

No operation may collapse adjacent steps.

## 8.2 Dispatch record

A dispatch attempt records:

- dispatch ID and deduplication identity;
- one authorized instrument ID;
- exact recipient office copied from that instrument;
- dispatching office/path;
- attempt time;
- technical outcome;
- delivery time when technically delivered;
- nonempty failure reason and provenance for failure;
- retry-of dispatch reference where applicable.

I3 technical outcomes are limited to:

```text
DELIVERED_TO_OFFICE_BOUNDARY
NOT_DELIVERED
FAILED
```

`NOT_DELIVERED` and `FAILED` are deterministic proof-fixture controls with explicit provenance, not a final communications simulator. They do not mean the recipient refused the request.

A later retry is a new dispatch record. It cannot rewrite the failed attempt.

## 8.3 Office instrument receipt

After technical delivery, the exact recipient office may admit one immutable instrument receipt containing:

- receipt ID and deduplication identity;
- recipient office;
- instrument and successful dispatch IDs;
- received payload version;
- receipt time, path, authority, and provenance.

Delivery does not create this receipt automatically. Receipt by one office does not fan out to another office, the Chief of Staff, or the President.

## 8.4 Recipient disposition

An effective holder of the recipient office may author exactly one controlling disposition for a received instrument:

```text
ACCEPTED_AS_REQUESTED
NARROWED
DELAYED
REFUSED
NO_ACTION_BY_DEADLINE
```

The record binds:

- disposition ID and deduplication identity;
- recipient office and effective officeholder assignment;
- instrument receipt;
- disposition time;
- accepted scope or narrowed subset;
- reason, limitations, next-review/deadline where applicable;
- provenance;

The presidential decision and instrument payload cannot supply this disposition.

`ACCEPTED_AS_REQUESTED` requires recipient jurisdiction and authority. It does not imply that required evidence is already available, that work began, or that the requested product can be completed. A recipient may accept a request whose later office assignment remains `BLOCKED` pending access.

`NARROWED` must carry a strict, explicit subset or less-claiming product scope and a reason rooted in recipient state.

`DELAYED` requires a future review/deadline and a live recipient-owned constraint.

`REFUSED` requires a recipient-owned jurisdiction, authority, evidentiary, or queue reason.

`NO_ACTION_BY_DEADLINE` is created only by deterministic deadline resolution after valid office receipt and no earlier disposition. It is not selected by the President or prewritten into dispatch.

## 8.5 Exact OMB causal boundary

In the accepted I2 state, OMB has metadata and an access-denied retrieval but no substantive source receipt.

OMB may independently:

- accept the request while any resulting full-scope assignment remains blocked pending access;
- narrow the request to a metadata/access-gap scoping product;
- delay pending valid access;
- refuse the unsupported scope;
- take no action through its response deadline.

The exact worked path uses `NARROWED`, but general logic may not branch on the OMB office ID. Whether a requested product can proceed, remain blocked, or support a later result derives from the instrument's evidence scope and the recipient office's actual I2 receipt/access state.

A counterfactual that gives the same recipient valid substantive receipt may permit a full-scope accepted assignment to proceed rather than remain blocked; it does not force acceptance or any result.

## 8.6 Assignment and workstream follow-through

Acceptance or narrowing creates no office assignment automatically.

A separate recipient-owned operation may create an I2 `OfficeWorkAssignment` only when:

- it cites the recipient disposition as typed authority;
- its objective/product/evidence scope does not exceed the accepted or narrowed scope;
- it belongs to the recipient office's own queue;
- its deadline is compatible with the disposition;
- all existing I2 assignment validation succeeds.

The workstream remains unchanged until its coordinating officeholder authors a separate transition citing the receipt, disposition, or assignment.

Recipient dispositions are bounded typed proof acts. They prove ownership and causal separation; they are not accepted general staff AI, final office personality, or autonomous executive-branch behavior.

## 8.7 No automatic return knowledge

Dispatch delivery, recipient receipt, disposition, assignment, and workstream transition do not automatically become presidential knowledge.

The President may learn a later result only through a separately valid presentation/receipt path. I3's exact worked trace is permitted to end before such a return presentation.

The historical index may reference an unseen occurrence internally. A player-safe projection must not reveal its substantive content merely because it is indexed.

---

# 9. Cross-owner historical record index

## 9.1 Reference-only entry

Every indexed I3 occurrence has one entry containing only:

- active history identity;
- canonical occurrence ID, equal to the referenced owner record ID;
- owning owner-state ID;
- record kind;
- occurred-at instant;
- stable owner-record reference;
- optional causal parent occurrence IDs.

The index cannot copy summary text, option text, status, disposition, evidence content, or result content from the owner record.

The pair `(ownerId, ownerRecordId)` and the occurrence ID are unique. Missing, duplicate, dangling, wrong-kind, wrong-time, or causally impossible references fail validation.

## 9.2 I3 indexed families

I3 indexes:

- workstream creation and transitions;
- escalation creation, withdrawal, resolution, supersession, and default;
- reserved-review creation and disposition;
- presidential decisions;
- presidential instruments;
- dispatch attempts;
- office instrument receipts and recipient dispositions;
- instrument-authorized office assignments created during I3.

Accepted I2 records retain their existing identities. I3 may index references to them when they become a source for an I3 occurrence, but it may not copy or rewrite their history.

## 9.3 Registration and projection

Creation of an indexed owner record and its reference-only index entry occurs in one validated transaction. A failed index validation leaves both states unchanged.

The index does not grant access. A later player-safe Historical Record projection must resolve each entry against:

- the canonical owner record;
- the viewer's presidential decision authorship;
- valid presentation/receipt history;
- any future explicit public record rule.

For I3, the narrow presidential projection may always expose the President's own decisions and authorized instruments. It may not expose recipient-owned disposition or assignment content absent a legitimate return presentation.

No playable history UI is authorized in I3.

---

# 10. Permitted transitions and ordering

I3 may design typed operations only for:

- creating/reconciling the session-owned presidential `ControlBinding`;
- creating, withdrawing, superseding, resolving, or defaulting a valid escalation;
- recording one bounded escalation presentation separately from escalation creation;
- creating, canceling, superseding, or completing a reserved review;
- deriving the bounded Attention projection;
- creating a workstream and appending a validated coordination transition;
- recording one presidential decision from one active local option;
- materializing only the option's fully previewed typed instruments;
- attempting/retrying one-instrument dispatch;
- admitting one recipient-office instrument receipt;
- recording one recipient-owned disposition;
- creating a separately validated office assignment under accepted/narrowed scope;
- registering and resolving reference-only historical index entries;
- direct copy, validate, save, parse, restore, and deterministic continuation.

All operations use the authoritative POP calendar instant, never wall-clock time.

I3 causal edges are source-before-derivative:

```text
I2 source/presentation
→ workstream/escalation
→ bounded escalation presentation
→ presidential decision
→ authorized instruments
→ dispatch attempt/delivery
→ office receipt
→ recipient disposition
→ optional office assignment
→ explicit workstream transition
```

Dependent operations normally use a strictly later instant. One atomic transaction may create same-instant decision, instrument, escalation-resolution, and historical-index records only under this fixed derived phase order:

```text
source owner record
→ decision
→ instrument
→ escalation resolution
→ reference-only index registration
```

The validator compares canonical instant, fixed record-kind phase, then stable identity. No undocumented array position may decide causality. Any other same-instant causal edge is rejected unless a later reviewed contract explicitly adds it.

Independent same-instant operations must be order-invariant after deterministic sorting by owner kind and stable identity.

Every operation validates a defensive candidate state before commit. Rejected input leaves all owner states, control binding, index entries, and serialized bytes unchanged.

Every externally retryable operation requires a nonempty deduplication identity. Repeating the same operation either returns the existing identical record or rejects a conflicting payload; it never appends a duplicate.

---

# 11. Deterministic worked path and counterfactuals

## 11.1 Worked path

The required path extends a valid full I2 trace:

1. **09:30:** President Elena Ward has received only the two configured Chief-of-Staff synthesis summary portions. The source table/methods remain unseen. Attention is empty.
2. **09:35:** the effective Chief of Staff creates `pop0.workstream.preliminary-labor-evidence-review` under standing coordination authority with status `MONITORED`. No Attention appears.
3. **09:40:** the effective Chief of Staff creates one valid escalation from the fully received synthesis, preserved disagreement, earlier bounded presentation, explicit uncertainty, options, deadline, default, and downstream resolver offices. Attention remains empty because the escalation itself has not been presented.
4. **09:41:** Chief of Staff separately records a bounded escalation presentation containing the decision question, uncertainty, three local options, complete instrument previews, deadline, and default. Attention now contains exactly that escalation.
5. **09:45:** under an active presidential operating `ControlBinding`, the player selects `REQUEST_SCOPED_ANALYSIS_AND_COORDINATION`. One immutable decision and exactly two previewed instruments are created. The escalation resolves; neither instrument is dispatched; Attention returns to empty.
6. **09:50:** the OMB and Chief-of-Staff instruments receive separate dispatch attempts and technical delivery records. Neither office yet owns instrument receipt or disposition.
7. **09:55:** OMB and Chief of Staff separately admit their own instrument receipts. Receipt in one office creates nothing in the other.
8. **10:00:** Chief of Staff independently accepts the coordination request. OMB independently narrows the substantive-analysis request to a metadata/access-gap scoping product because its I2 state lacks substantive receipt.
9. **10:05:** OMB separately creates a narrowed office assignment in its own queue. The presidential decision did not create it.
10. **10:10:** Chief of Staff authors an explicit workstream transition citing the accepted coordination disposition and the narrowed OMB assignment. No material, fiscal, employment, Housing, congressional, media, public-belief, or presidential-knowledge result is created.

The trace may stop there. It need not complete the OMB assignment or return a new presidential presentation in I3.

## 11.2 Required counterfactuals

I3 tests must prove causality rather than a scripted route:

1. withhold either complete source-assessment receipt from Chief of Staff: the synthesis or same valid escalation cannot exist;
2. remove the preserved conflict over the shared proposition: the configured conflict-based escalation fails and no replacement Attention item appears;
3. keep the presentation but omit the typed Chief-of-Staff escalation act: Attention remains empty;
4. create the valid escalation but omit its bounded escalation presentation: Attention remains empty and no presidential decision is valid;
5. authorize the same presidential option but omit dispatch: no delivery, office receipt, disposition, assignment, or workstream transition appears;
6. fail one dispatch: the other instrument route remains independent and no recipient disposition appears for the failed route;
7. keep OMB metadata-only: acceptance creates no substantive knowledge or result, and any full-scope assignment remains blocked unless the office narrows it;
8. grant the recipient legitimate substantive receipt: a full-scope assignment may proceed but acceptance and results are not automatically selected;
9. withhold recipient office receipt: no officeholder disposition is valid;
10. choose `RESERVE_PRESIDENTIAL_REVIEW`: no outgoing instrument exists, Attention remains empty until the reserved instant, then the due review appears;
11. choose `ALLOW_MONITORING_DEFAULT` or let the escalation expire: no instrument, assignment, response, or replacement drama is created;
12. reorder independent OMB/Chief-of-Staff dispatch or receipt operations: sorted final owner state and save bytes remain identical;
13. change a recipient-owned response: the workstream can change only through a later explicit coordinator transition and unrelated owner state remains unchanged.

No counterfactual may be repaired by inserting a substitute escalation, dispatch, recipient response, or dramatic event.

---

# 12. Atomic persistence

I3 advances the POP runtime schema and save format to version 3 only if implementation is later authorized.

The format-3 save contains:

- authenticated configuration identity;
- active history identity;
- session-owned presidential control binding;
- accepted I2 calendar and administration owner states;
- escalation/default/reserved-review state;
- expanded presidential presentation history containing bounded escalation presentations;
- workstream identity and transition state;
- presidential decision state;
- typed instrument state;
- dispatch state;
- expanded office-owned instrument receipt/disposition state;
- reference-only historical index state.

Attention, current workstream projections, full-state audit views, available option caches, and player navigation are not canonical save fields.

Every new field must enter atomically across:

- runtime/configuration type;
- initial-state construction;
- exact-shape semantic validation;
- defensive copy;
- save envelope and parser;
- factory restore;
- session operation closure;
- deterministic continuation tests.

I2 format-2 saves are rejected as unsupported unless a separately reviewed deterministic migration is explicitly included within later I3 coding authority. No missing I3 history may be fabricated during load.

Required save checkpoints:

1. empty Attention with a monitored workstream but no escalation;
2. active escalation before its bounded escalation presentation, with empty Attention;
3. presented active escalation before presidential decision;
4. decision and instruments authorized but undispatched;
5. one successful dispatch and one failed/undispatched route;
6. technical delivery before recipient-office receipt;
7. office receipt before disposition;
8. independent recipient dispositions before assignment/workstream update;
9. narrowed assignment plus explicit workstream transition;
10. reserved review before and after its due instant;
11. expired/defaulted escalation with empty Attention.

For every checkpoint:

```text
save → load → save
```

must be byte-stable.

Load must not:

- recreate or resolve an escalation;
- reauthorize a decision or instrument;
- retry dispatch;
- admit office receipt;
- select recipient disposition;
- create an assignment;
- append a workstream transition;
- register a duplicate history entry;
- alter Attention except by deterministic projection of restored canonical state.

Tampering must reject before session construction, including:

- mismatched or ended control authority represented as active;
- escalation citing unseen presidential knowledge;
- unpresented escalation exposed through Attention or accepted for decision;
- decision using an inactive escalation or unpreviewed instrument;
- instrument with multiple/wildcard recipients or recipient-disposition fields;
- delivery before issue, receipt before delivery, or disposition before receipt;
- full-scope assignment represented as proceeding or completed without recipient receipt/access support;
- workstream transition before its sources or with a broken prior chain;
- duplicate/dangling/wrong-time historical index reference;
- mismatched or unknown active history identity;
- missing new owner family or unknown exact-shape field.

---

# 13. Dependency and API boundary

Permitted reuse is limited to:

- the accepted I1/I2 POP runtime and direct owner states;
- calendar/order utilities;
- configuration/hash and exact-shape persistence patterns;
- the pure lower-level `AdministrationControlBinding` primitive;
- I2 office assignment, receipt, presentation, and artifact operations;
- narrow owner-neutral immutable-reference and deduplication patterns.

The I3 composition and every player-safe projection entry graph must reject:

- `IntegratedPartialRuntimeSession` or any synchronized I10 session;
- `ProductionGameSession` as the current integrated-session alias;
- `ProductionGameView`, `ProductionPlayerAction`, `availablePlayerActions`, or `dispatchPlayerCommand`;
- action-prefix dispatch or Stage 1/opening-usability source/artifacts;
- opaque I10 format-11 saves;
- Housing, Population, integrated-information, legislative-session, media, public-belief, or later proof-thread owner state;
- audit/full-state getters as player-facing input;
- playable UI imports.

I3 may reuse `AdministrationControlBinding` without importing the legislative session that currently consumes it.

The boundary checker must grow with the actual I3 factory, session, projection, persistence, operations, and configuration graph. Lexical absence alone is insufficient. The historically named boundary script should be renamed or split if necessary so the check truthfully describes the POP graph it verifies.

`getOperatingState()` remains shell/audit evidence only. Attention, workstream, option, and historical projections must accept narrow typed inputs and may not depend on the complete canonical state through a player-facing graph.

---

# 14. Acceptance tests

## Authority and identity

- exact I2 offices, actors, institutions, role intervals, and seven outside-scope Population declarations remain unchanged;
- the I2 presidential recipient binding alone cannot authorize a decision;
- the session-owned ControlBinding matches the effective President actor and constitutional office;
- missing, ended, stale, mismatched-surface, mismatched-actor, or mismatched-office control blocks decision without mutating canonical state;
- no Population owner or ordinary-person join is introduced;
- no actor holding multiple roles merges office receipt, response, queue, workstream authority, or control.

## Escalation and Attention

- initial Attention is empty;
- workstream, presentation, disagreement, deadline, and evidence alone create no Attention;
- escalation requires valid effective initiator, complete source scope, preserved conflict, bounded presidential knowledge, options, default, deadline, and downstream resolvers;
- escalation creation alone creates no presentation, Attention item, or presidential knowledge;
- Attention and decision require a separate valid bounded escalation presentation;
- President-known portions never include unseen attachments;
- invalid/withdrawn/resolved/defaulted/superseded escalations leave Attention;
- due reserved review enters Attention only at its reserved instant;
- Attention ordering is deterministic without severity/action prefixes;
- altered evidence/receipt/conflict state changes or prevents escalation without replacement drama.

## Workstreams

- one coordination workstream references but never duplicates I2 artifacts, assignments, presentations, decisions, instruments, dispatch, or responses;
- current status derives from an acyclic strictly forward transition chain;
- source occurrences exist before every transition;
- another office cannot mutate the Chief-of-Staff-coordinated workstream;
- recipient response and assignment do not automatically mutate it;
- workstream completion cannot assert material/domain success;
- workstream status never creates Attention by itself.

## Decisions and visible instruments

- only active presidential control over an active escalation permits decision;
- decision basis is limited to actual presidential presentation history;
- each local option materializes exactly its previewed zero/two instruments;
- option and instrument IDs are not parsed for behavior;
- every outgoing instrument has one exact configured recipient;
- hidden, extra, free-form, wildcard, fiscal, public, legislative, agency-order, or material-result payloads fail validation;
- decision creation alone creates no dispatch, receipt, disposition, assignment, result, or workstream transition;
- duplicate decision/instrument dedupe is idempotent and conflicting retry is rejected.

## Dispatch and recipient ownership

- authorization, dispatch, delivery, office receipt, disposition, assignment, result, and presidential return knowledge are all distinct;
- one instrument's delivery/receipt never fans out to another office or instrument;
- failure and retry preserve both immutable dispatch records;
- disposition requires exact recipient office receipt and an effective holder;
- presidential inputs cannot select or embed disposition;
- metadata-only OMB acceptance creates no knowledge/result and leaves a full-scope assignment blocked unless the office narrows it;
- valid substantive receipt may permit a full-scope assignment to proceed but does not force acceptance or a result;
- narrowed scope is a strict supported subset and later assignment cannot exceed it;
- accepted/narrowed disposition creates no assignment automatically;
- delayed/refused/no-action paths generate no replacement result;
- independent recipient routes are order-invariant.

## Historical index and knowledge safety

- every indexed I3 occurrence has exactly one reference-only entry;
- entry identity, owner, kind, time, and causal parents reconcile to the source record;
- index contains no copied substantive content;
- index cannot author, dispatch, disposition, prioritize, or grant knowledge;
- recipient-owned content remains absent from presidential projection until a valid return presentation exists;
- one canonical occurrence shown in several later views remains one occurrence.

## Persistence, boundaries, and regression

- runtime schema/save/configuration versions advance atomically to I3 values;
- every required checkpoint is byte-stable and continuation-deterministic;
- malformed live operation is rejected before mutation and its prior save still restores identically;
- format-2 save cannot silently acquire I3 history;
- exact-shape, referential, temporal, control, scope, and index tampering is rejected;
- every saved/indexed occurrence binds to the configured active history identity;
- POP import closure excludes Stage 1, I10 whole sessions, global action APIs, later domain owners, full-state player input, and UI;
- merge base remains `44c1724962830225e6fc34f41d0df0cfdb7dfec0` and `main` remains unchanged;
- normal I10 boot/restore and complete baseline verification remain green;
- targeted I1/I2/I3 tests and canonical GitHub Actions pass at the exact implementation candidate SHA.

---

# 15. Explicit I4+ exclusions

I3 does not design or implement:

- inherited Housing owner state, adapter, workstream, agency knowledge, implementation progression, or hidden problem;
- employment stocks/flows, plant closure, Labor simulation, modeled Income, or material regional consequences;
- autonomous Congress, bill, committee, leadership, vote, bargaining, or legislative position;
- governors, organizations, media, publication, audience belief, or public approval;
- the serious quiet healthcare condition or proactive search/investigation route;
- generalized autonomous White House escalation or recipient AI;
- final Cabinet, staff personalities, hiring, turnover gameplay, competence, or universal capacity;
- final instrument catalogue, agency directives, fiscal commitments, public communications, legislative offers, or external-recipient dispatch;
- general operational IT/communications failure simulation;
- election, succession, incapacity, Vice-Presidential authority, or contested control;
- rollback, alternate-history branching, or branch-bounded knowledge behavior;
- playable Briefing/Attention, Country Watch, Workstreams, dossier, evidence, history, or calendar UI;
- production migration, Early Access scope, roadmap, or changes to `main`.

The I2 preliminary Labor evidence remains a routing/administration proof artifact only. The I3 workstream, escalation, and instruments may not disguise the later employment proof thread as configured content.

The exact typed office escalation and recipient disposition acts are proof machinery. They establish ownership and causal boundaries, not accepted general staff autonomy or final character behavior.

---

# 16. Review and stop gate

Detached design review must answer:

> **Does this contract prove that valid I2 office information can become bounded Presidential Attention, workstream coordination, an authenticated presidential decision, visible typed instruments, explicit dispatch, and recipient-owned response—without global action IDs, hidden fan-out, direct presidential outcome control, duplicate truth, omniscient history, player-facing full state, or POP0-I4+ behavior?**

Outcomes:

- **PASS:** a separate authority document may authorize coding within this exact boundary;
- **REVISE:** repair only identified I3 ownership, authority, causality, persistence, or boundary ambiguities;
- **REJECT:** the design would recreate a global dispatcher, direct-outcome command system, shared White House mind, or second temporary architecture.

Until detached review passes and a separate coding instruction is issued:

## **DESIGN ONLY — DO NOT IMPLEMENT POP0-I3**
