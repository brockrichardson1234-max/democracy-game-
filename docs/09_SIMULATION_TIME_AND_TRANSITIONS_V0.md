# 09 — Simulation Time and Transitions V0

Status: **Commit-4 architecture candidate for review. Not implementation authority.**

## 1. Purpose

Commits 1–3 established that laws, fiscal authority, procedures, administration, material systems, information, elections, and succession remain separately owned. Commit 2 also froze the rule that scheduling infrastructure may index time-sensitive facts without becoming their semantic owner.

This document closes the minimum simulation-time and transition semantics required for Governing Loop 0.

It answers:

> How does the world advance through legal, fiscal, administrative, material, informational, electoral, and succession boundaries without UI cadence or processing order changing the causal result?

The goal is deterministic causal time, not a universal discrete-event framework.

This document does **not** implement a scheduler, event bus, save format, multiplayer clock, real-time mode, or Commit-5 runtime architecture.

## 2. Normative dependencies

This document must preserve:

- `TimeState` owns authoritative current simulation time;
- domain owners own the dates/deadlines/effective conditions that give their state temporal meaning;
- a scheduler/event queue, if later implemented, is a derived index rather than semantic authority;
- current state and immutable occurrence history are distinct;
- procedure rules remain legal-order truth while procedure instances own current proceeding facts;
- material domains own material outcomes;
- information artifacts distinguish as-of, creation, release, and exposure times where relevant;
- election result, office entitlement/assignment, institutional behavior, and `ControlBinding` remain distinct;
- world state persists across succession;
- cross-domain mutation must occur through the target owner's accepted process boundary;
- decided, enacted, effective, funded, implemented, materially realized, measured, reported, and politically processed are not interchangeable timestamps.

## 3. TimeState owns the authoritative clock

`TimeState` owns the world's current simulation time/calendar position.

Conceptually:

```text
TimeState.currentTime
```

is the authoritative answer to “where is the simulation now?”

Other domains may own time-valued facts such as:

- proposal deadline;
- statute effective time;
- appropriation availability/expiration;
- obligation/payment due time;
- project milestone target;
- measurement as-of interval;
- report release time;
- election date;
- office term boundary;
- judicial order expiration/review condition.

Those facts do not become `TimeState` facts merely because they contain dates.

### Candidate hard invariant ST-01

**TimeState owns current simulation time. Domain-owned temporal meaning remains with the domain that owns the underlying fact; a date field is not transferred to TimeState or a scheduler merely because it must be processed later.**

## 4. Simulation time is independent of wall clock and UI cadence

The canonical world must not depend on:

- frame rate;
- machine speed;
- how quickly the player clicks;
- how long a menu is open;
- rendering frequency;
- whether the player advances one day repeatedly or advances a larger supported interval.

Player-facing advancement may use day/week/month or “advance until next meaningful choice” controls later. Those are interaction semantics over canonical simulation time.

### Candidate hard invariant ST-02

**For the same initial canonical state and same canonical decisions/inputs, equivalent supported time advancement must produce the same canonical result regardless of wall-clock performance or UI stepping cadence.**

## 5. Time advancement is bounded by causal transitions

A request to advance time is not permission to jump directly to an end-of-period summary.

Conceptually:

```text
advance requested to T_target
→ identify next relevant transition boundary <= T_target
→ resolve all causally due work at that boundary under deterministic ordering semantics
→ stabilize boundary consequences
→ continue toward T_target or return for a required decision
```

The exact implementation may be event-driven, fixed-step, hybrid, or another deterministic design.

The architecture requires only that semantically meaningful boundaries cannot be skipped.

Examples:

- a law becomes effective before an agency acts under it;
- an appropriation becomes available before a valid obligation uses it;
- a court order becomes effective before later agency conduct is evaluated;
- a project completes before a later measurement can observe the completed stock;
- a report is released before recipients can be exposed to that release;
- an election resolves before ordinary succession procedures can produce a new office assignment.

### Candidate hard invariant ST-03

**Advancing across an interval must process every causally relevant transition boundary in that interval. A coarse advance command may compress presentation, but it may not skip intermediate canonical transitions whose results affect later state.**

## 6. Temporal stages are semantically distinct

For a policy/program route, the architecture must preserve potentially different times for:

```text
decision/attempted action
enactment
legal effectiveness
fiscal authority availability
obligation
payment/disbursement
administrative implementation
material input/activity
material realization
measurement/as-of period
report/release
recipient exposure
belief/political processing
election
certification/selection consequence
office entitlement/assignment transfer
control-binding end/change
```

Not every route uses every stage.

The important rule is that one stage does not inherit another's timestamp by convenience.

### Candidate hard invariant ST-04

**Decided, enacted, effective, funded, obligated, paid, implemented, materially realized, measured, reported, exposed, politically processed, electorally resolved, and transferred are distinct temporal semantics. They may coincide in a fixture only when the owning processes explicitly make them coincide.**

## 7. Enactment is not effectiveness

A legal source may be enacted at one time and become operative at another.

Conceptually:

```text
LawEnacted at T1
LegalSource.effectiveFrom = T2
T2 >= T1 where applicable
```

The legal source owns its effective boundary.

Before T2, the source may exist historically/currently as enacted legal state while not yet applying to actions whose legal position depends on effectiveness.

A scheduler may index T2 but does not own it.

### Candidate hard invariant ST-05

**Legal enactment and legal effectiveness are distinct facts/times unless the applicable legal source explicitly makes them simultaneous. Legal applicability queries use the source's actual temporal scope.**

## 8. Fiscal authority, obligation, and payment have separate boundaries

Likewise:

```text
appropriation enacted/effective
→ resources legally available under scope/period
→ obligation committed
→ payment/disbursement executed
→ recipient/material use later
```

A payment cannot be backdated into existence merely because authority existed earlier.

An obligation may persist across later political changes according to its own state/rules.

Expiration of unused authority does not erase prior valid disbursements or material consequences.

### Candidate hard invariant ST-06

**Fiscal authorization/availability, obligation, disbursement, and material use are temporally and semantically distinct. Later expiration or political change affects current/future fiscal state through its owner and does not rewrite completed financial/material history.**

## 9. Administrative and material latency are owner-resolved

An administrative program may take time to:

- accept applications;
- review eligibility;
- award grants;
- create obligations;
- coordinate with state participants;
- begin operations.

A material housing project may separately take time to:

- enter a physical pipeline;
- consume capacity/resources;
- reach milestones;
- complete;
- influence stock/pressure/affordability.

Administrative completion does not imply material completion.

The administrative owner resolves administrative timing. Housing resolves material timing.

### Candidate hard invariant ST-07

**Administrative latency and material latency are separately owner-resolved. A completed administrative act may create a material input, but it cannot borrow the material domain's future completion timestamp or directly realize the outcome.**

## 10. Measurement and reporting observe prior/as-of state

A measurement performed or released at time T may describe an earlier interval/state.

The measurement process must use the referent state and any canonically captured measurement-process observations appropriate to its declared as-of semantics rather than simply reading “whatever is current when the UI asks.”

Where a lagged measurement has already captured observations under `08`, those captured observations remain measurement-process-owned inputs even if the referent changes before processing or publication completes.

A persisted report must not behave like a live alias to current canonical state.

Example:

```text
Material improvement: March 12
Measurement as_of: February 1–March 31
Report release: May 15
Exposure: May 15 onward
```

The report's content is fixed according to its measurement result/method, even if housing changes again in June.

### Candidate hard invariant ST-08

**Measurement/as-of time, measurement-process capture/processing state, report creation/release time, and later exposure are distinct. Persisted artifacts retain the information produced from the appropriate recorded observations/as-of/method rather than following live current state.**

## 11. Same-time transitions require deterministic semantics

Several transitions may become due at the same simulation timestamp.

The engine must not rely on container iteration order, file order, hash-map order, render order, or accidental subsystem registration order to decide which effect wins.

Commit 4 does not mandate one universal hard-coded subsystem sequence such as:

```text
law -> money -> agency -> housing -> media -> voters
```

because not every future transition follows that path.

Instead same-time work must be resolved by declared causal dependencies and stable tie-breaking where no dependency exists.

Conceptually:

1. collect transition candidates whose owner-defined conditions become due at the boundary;
2. evaluate which candidates are enabled from the authoritative pre-transition/boundary state under declared semantics;
3. order dependency-related transitions so prerequisites resolve before consequences that require them;
4. apply owner-authorized mutations;
5. surface newly enabled same-boundary consequences;
6. repeat until the boundary reaches a stable state or a required decision halts advancement;
7. use a stable deterministic tie-break for independent transitions where their order is semantically irrelevant.

### Candidate hard invariant ST-09

**Same-time transition results may depend only on declared causal dependencies and explicit stable tie-breaking, never accidental execution order. If ordering can change a causal outcome, that ordering dependency must be represented explicitly.**

### 11.1 Stochastic canonical outcomes require deterministic causal randomness

Commit 4 permits supported processes such as exposure, polling/measurement error, turnout realization, or later material uncertainty to use probabilistic resolution. Probability does not exempt those processes from deterministic continuation and ordering guarantees.

A stochastic canonical draw must therefore be bound to explicit causal identity/context sufficient to reproduce the same outcome from the same canonical inputs. The architecture does not choose the RNG family, hash/counter scheme, stream structure, or sampling implementation.

Rejected semantic dependencies include:

- one mutable global RNG cursor whose consumption depends on iteration order;
- drawing extra values merely because population aggregates were traversed in a different container order;
- UI stepping cadence changing which random values are consumed;
- scheduler reconstruction after save/load advancing or rewinding a hidden random stream;
- unrelated stochastic events changing each other's outcomes solely by consuming the same incidental sequence first.

Population refinement may legitimately change future stochastic outcomes when the modeled causal entities/weights or declared stochastic process itself has changed. It may not change already resolved canonical stochastic outcomes or alter unrelated outcomes merely through incidental enumeration.

### Candidate hard invariant ST-09A

**Any randomness that contributes to canonical state must have explicit deterministic causal semantics. For identical canonical inputs and causal identities, stochastic outcomes may not depend on global RNG position, incidental iteration/registration order, player-facing advance chunking, UI cadence, scheduler reconstruction, or save/load boundaries. The exact deterministic random-generation implementation is deferred.**

## 12. Boundary stabilization and zero-time chains

One transition can legitimately enable another at the same timestamp.

Example:

```text
T = Jan 1
law becomes effective
→ agency action previously scheduled/conditioned on legal effectiveness becomes enabled
→ fiscal execution may become enabled
```

The engine may resolve such a finite chain without advancing the clock again.

But zero-time loops are forbidden.

Architecture/runtime implementation must later guarantee that same-boundary processing either:

- makes monotonic progress toward a stable state;
- reaches an explicit decision boundary; or
- detects an invalid cyclic transition configuration rather than spinning forever.

### Candidate hard invariant ST-10

**A single timestamp may contain a finite causal closure of newly enabled transitions. Same-time processing must terminate deterministically; no subsystem may exploit repeated zero-time self-triggering to create infinite work or repeated benefits.**

## 13. Decisions interrupt automatic advancement

GL0's intended cadence is meaningful player decisions separated by automatic institutional/material advancement.

When a canonical process creates a supported player `DecisionOpportunity`, automatic advancement may stop before crossing the decision's meaningful deadline/choice boundary.

The player does not receive a decision opportunity for every routine transition.

Autonomous actors may likewise make their own decisions through normal actor decision semantics without becoming player prompts.

A player prompt is therefore a presentation/control consequence of world state, not the owner of time.

### Candidate hard invariant ST-11

**Automatic time advancement stops for supported player decisions when crossing the decision boundary would remove or pre-resolve a meaningful choice. Routine world transitions continue automatically and are not converted into click-to-confirm steps.**

## 14. No pause exploit around deadlines

Opening a UI, inspecting a projection, or receiving a decision prompt does not change canonical deadlines unless the game explicitly models a pause mode as session behavior.

When simulation time is paused for player choice, the canonical timestamp remains fixed. Other transitions do not secretly advance and deadlines do not drift with wall clock.

If a decision has a canonical deadline, that deadline is domain/procedure-owned.

### Candidate hard invariant ST-12

**Player deliberation/UI time cannot create or avoid canonical temporal consequences. Deadlines are evaluated against simulation time, not wall-clock delay.**

## 15. Events/history record committed occurrences after resolution semantics

Historical occurrence records should be timestamped according to when the canonical occurrence actually happens.

Examples:

- `ProposalIntroduced(T)`;
- `LawEnacted(T)`;
- `LawBecameEffective(T)` where such an occurrence is recorded;
- `PaymentExecuted(T)`;
- `ProjectCompleted(T)`;
- `ReportReleased(T)`;
- `ElectionResolved(T)`;
- `OfficeAssignmentChanged(T)`.

History records the occurrence. It does not drive current state by being replayed as a second semantic owner in ordinary runtime.

Commit 4 does not freeze event-sourcing/replay implementation.

### Candidate hard invariant ST-13

**Historical timestamps record committed occurrences under owner-resolved transition semantics. Historical records do not become the authority for current state merely because transitions are chronologically indexed.**

## 16. Scheduler/index semantics

A future scheduler may contain entries such as:

```text
wake LegalSource X at T
reconsider Procedure Y at deadline D
process Project Z milestone at M
release Report R at P
run Election E at date Q
```

These entries are derived/indexing machinery.

If the scheduler is rebuilt from canonical state, no legal/fiscal/material/political meaning should be lost.

If a domain-owned date changes through a valid causal process, the scheduler index must be updated/rebuilt; the scheduler may not veto the domain change because its old entry says otherwise.

### Candidate hard invariant ST-14

**Scheduling data is rebuildable from domain-owned temporal facts and process state. Scheduler entries are non-authoritative indexes/caches and may not shadow-own effective dates, deadlines, expiration, election dates, or material milestone meaning.**

## 17. Conditional transitions versus scheduled timestamps

Not every future transition is known by an exact timestamp.

Some transitions occur when conditions become true, for example:

- enough procedural decisions have been received;
- a project has accumulated sufficient progress;
- an appeal/stay changes the legal context;
- a capacity/resource condition allows work to proceed;
- a reporting period closes and required source data is available.

The transition owner may expose a next reconsideration time, dependency, or condition to scheduling infrastructure.

A scheduler does not need to predict the semantic result in advance.

### Candidate hard invariant ST-15

**Future transitions may be time-triggered, condition-triggered, or both. Scheduling infrastructure determines when to reconsider owner state; the owner/process determines whether and how the canonical transition occurs.**

## 18. Continuous/rate-like processes and coarse advancement

Some material or administrative processes may later evolve continuously or by rates rather than isolated events.

GL0 may approximate them with deterministic interval integration/steps.

The required semantic property is that crossing meaningful boundaries produces equivalent results independent of player-facing chunk size within declared numerical tolerances/rules.

For example, advancing thirty days once must not allow a housing project to skip a legal stop issued on day ten.

Likewise repeatedly advancing one day must not generate extra monthly benefits due to re-entering a period boundary.

### Candidate hard invariant ST-16

**Rate/interval processes must be integrated with boundary-aware deterministic semantics. Player-selected advance chunk size may not create extra applications of periodic effects or bypass intervening causal boundaries.**

## 19. Period boundaries execute once

Monthly/quarterly/annual processes may be useful for budgets, measurements, elections, administrative reporting, or material updates.

A period-boundary transition must have an owner-visible state that prevents duplicate execution when the simulation is saved/loaded, paused, or advanced in multiple chunks.

Conceptually, the semantic owner knows which period obligation/update has been satisfied; the scheduler merely knows when it should be considered.

### Candidate hard invariant ST-17

**A periodic canonical transition occurs at most once for the same owner-defined period/obligation unless the domain explicitly defines repeatability. Re-entering or reconstructing a scheduling boundary may not duplicate canonical effects.**

## 20. Save/load and deterministic continuation seam

Commit 4 does not design persistence format, but transition semantics require a seam:

At any save boundary the persisted canonical state must contain enough owner state that reloading and continuing with the same future canonical inputs produces the same subsequent transitions.

A save cannot depend on hidden transient scheduler iteration position as semantic truth.

Rebuildable caches/indexes may be omitted/reconstructed.

### Candidate hard invariant ST-18

**Deterministic continuation must derive from persisted canonical owner state plus declared rules/configuration, including any canonical state required by stochastic causal semantics, not from unowned transient execution order or an incidental global random-stream cursor. Rebuildable scheduler/projection caches are not canonical save truth.**

## 21. Election and succession timing

GL0's ordinary transfer route must preserve these distinct boundaries:

```text
election participation/balloting
→ election resolution/result
→ certification/selection procedure as configured
→ successor entitlement where applicable
→ office assignment changes at effective transfer boundary
→ outgoing administration loses supported decision surface
→ ControlBinding ends/changes
```

The fixture may make some steps immediate or simple, but the architecture may not define them as one universal timestamp/object.

World processes scheduled after the election but before transfer still occur under whichever actors/institutions legally/currently own them unless the fixture's rules say otherwise.

At transfer, the world persists and later state continues to evolve normally.

### Candidate hard invariant ST-19

**Election resolution, certification/entitlement, office assignment, and control-binding transition are separately timed causal transitions. The ordinary GL0 fixture may place them close together, but no universal `electionTime = transferTime = controlEndTime` identity is created.**

## 22. Judicial timing and legal contests

Judicial orders may have:

- issuance time;
- effective time;
- expiration/duration;
- stay/reversal/supersession time;
- review/appeal deadlines.

The canonical order owner from Commit 3 owns those operative temporal facts.

A legal contest owns its procedural deadlines/current stage.

A later judicial/procedural act may change the legal position for future conduct, may declare an earlier act unlawful or legally ineffective for an earlier temporal scope, or may create another bounded temporal consequence when the applicable legal order provides for it. Commit 4 does not force all legal effects to be prospective.

That legal temporal scope remains separate from occurrence history and from non-legal domain truth. A retrospective legal determination does not make an action, payment, compliance choice, construction event, or political reaction cease to have occurred. Any remedy or corrective consequence must proceed causally through the appropriate legal, fiscal, administrative, or material owner.

Example:

```text
T1: payment executed
T2: court determines the payment lacked legal authority at T1
→ legal state may treat the act as unlawful/invalid for the applicable temporal scope
→ remedy may create a repayment obligation
→ treasury/recipient process may later execute repayment
```

not:

```text
T2 ruling
→ delete PaymentExecuted(T1)
→ erase downstream material/political history
```

### Candidate hard invariant ST-20

**Legal temporal effects are governed by the canonical legal source/order/procedure and may be prospective, retrospective, or otherwise bounded according to that authority. Changing legal applicability for an earlier period does not automatically rewrite immutable occurrence history or non-legal current/past facts; remedies and corrective consequences must occur through ordinary owner-respecting causal processes.**

## 23. GL0 timing proof cases

Commit 4 requires architecture capable of representing at least these hostile timing cases:

### Case A — enactment/effectiveness separation

Bill enacted December 20, effective January 1. No December agency action may rely on January authority unless another valid source permits it.

### Case B — appropriation versus payment

Money is legally available, but no payment occurs until a later obligation/disbursement process.

### Case C — court intervention during implementation

Agency begins an action; court order becomes effective before the next implementation step; later conduct resolves under the new legal context while prior material history remains.

### Case D — project completes before data release

Housing improves materially before official measurement/reporting catches up.

### Case E — report released before election

A release or claim can affect exposed population state only if its release/exposure/political-processing transitions occur before the election decision boundary.

### Case F — election before project completion

Election resolves while grants/projects remain in-progress; succession does not complete projects or cancel them automatically.

### Case G — same-time conflict

Two same-timestamp transitions that compete for a limited canonical resource must use an explicit owner/dependency/tie-break rule rather than runtime iteration order.

### Case H — chunk-size invariance

Advance 30 days versus advance 10 + 20 days with no intervening new decision produces equivalent canonical state; if a meaningful boundary/decision occurs on day 10, both paths stop/resolve it consistently.

## 24. Minimum player-facing time contract

Commit 4 does not choose the final time UI, but GL0 needs these semantics:

- current simulation date/time is legible;
- player can advance without confirming every routine event;
- meaningful decision opportunities interrupt before being silently lost;
- player can inspect pending known deadlines/effective boundaries that the administration legitimately knows;
- uncertainty about future outcomes remains uncertainty, not hidden scheduled certainty exposed through UI;
- time advancement never substitutes for a policy command or direct world mutation.

The exact day/week/month cadence remains a walking-skeleton/playtest choice so long as these invariants hold.

## 25. Rejected shortcuts

Rejected:

```text
advanceMonth(): applyAllMonthlyBonuses()
```

when intermediate legal/material/information boundaries may exist.

Rejected:

```text
Law.enacted = true
Law.effective = true
Program.funded = true
Program.implemented = true
Outcome.realized = true
```

as one transition unless the actual supported fixture explicitly and legitimately makes every semantic stage simultaneous.

Rejected:

```text
sortHandlersByRegistrationOrder()
```

when same-time ordering changes results.

Rejected:

```text
globalRng.next()
```

when canonical stochastic outcomes then depend on unrelated draw order, UI stepping, scheduler reconstruction, or population/container traversal order.

Rejected:

```text
schedulerEvent.status = sourceOfTruth
```

for a domain-owned deadline/effective fact.

Rejected:

```text
advance(30 days)
```

skipping a court order, election, report release, project completion, or decision boundary inside the interval.

Rejected:

```text
onLoad(): runCurrentBoundaryAgain()
```

when it duplicates a period effect already canonically resolved.

Rejected:

```text
retroactiveLegalFinding -> deleteEarlierMaterialOccurrence()
```

when the proper consequence is a scoped legal state change and, where applicable, a later owner-resolved remedy.

## 26. Commit-4 review questions for this document

Review should ask only whether simulation-time/transition semantics are closed enough for GL0:

1. Is authoritative current time separated from domain-owned temporal meaning and scheduler indexes?
2. Can coarse/player-facing advancement cross intervals without skipping causal boundaries?
3. Are enactment, effectiveness, fiscal execution, implementation, material realization, measurement, reporting, political processing, election, and transfer temporally distinct?
4. Are same-time transitions deterministic based on explicit dependencies/tie-breaks rather than incidental execution order?
5. Do stochastic canonical outcomes remain reproducible independent of global RNG consumption order, UI cadence, chunking, scheduler reconstruction, and save/load boundaries?
6. Can finite zero-time causal chains resolve without infinite/repeated effects?
7. Are player decisions interrupted at meaningful boundaries without turning routine simulation into click spam?
8. Can rate/periodic processes avoid chunk-size and save/load exploits?
9. Do election/succession and judicial timing preserve the accepted Commit-1–3 ownership distinctions, including legal effects with retrospective scope that do not rewrite occurrence history?

No scheduler/runtime implementation and no Commit-5 design is authorized by this document.