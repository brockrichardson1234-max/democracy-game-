# Post-Constitution Implementation Preflight and Reuse Map

Status: **POST-CONSTITUTION PRODUCT-EVIDENCE PREFLIGHT — NOT IMPLEMENTATION, ARCHITECTURE, ROADMAP, EARLY-ACCESS, PLAYER-START, UI, SCHEMA, OR NEXT-INCREMENT AUTHORITY.**

Evidence boundary:

- accepted production/runtime baseline: `44c1724962830225e6fc34f41d0df0cfdb7dfec0`;
- entirely unaccepted Stage 1 functional-UI candidate: `a7e04ca78ba1ccb06d8dc3a4dfb0d43389804144`;
- accepted presidential-game and Living Country constitutional-design closure: `46f0a035ac529ed96a9dee5c9daa060d25e6886f`;
- repository: `brockrichardson1234-max/democracy-game-`.

This report performs the first post-constitution task authorized by the closure receipt:

> Inspect the existing runtime and determine what can be reused now, reused with adaptation, retained only as a fixture, avoided as a growth path, or supplied before the Presidential Operating Proof.

It changes no runtime, source, schema, test, UI, configuration, data, or roadmap file.

---

# 1. Executive verdict

## 1.1 The project does not need a rewrite

The accepted baseline already contains unusually strong permanent foundations:

- exact dated time and deterministic boundary ordering;
- configuration identity, hashing, artifact authentication, and import-boundary enforcement;
- office/actor `ControlBinding`;
- individual lawmakers and actor-owned votes;
- autonomous organization, congressional, fiscal, recipient, court, election, and succession resolution;
- exact legal, fiscal, administrative, material, information, and election records;
- a real Housing material mechanism;
- save/load and coarse/fine deterministic continuation;
- a production React/Electron path separated from audit APIs;
- a large regression suite directed at ownership and causal invariants.

Those are not throwaway prototype assets.

## 1.2 The project does need a new product-level operating composition

The existing **domain engines are substantially more reusable than the existing integrated session and player projection**.

`IntegratedPartialRuntimeSession` currently performs all of the following in one large application authority:

- composes every I3–I9 owner;
- reconstructs/validates saves;
- schedules static and dynamic boundaries;
- resolves owner intentions;
- derives the globally available action list;
- dispatches player commands;
- contains fixture-specific identifiers, recipients, projects, amounts, and action sequences;
- produces the flat `ProductionGameView`.

That was an effective convergence vehicle. It should remain an accepted regression fixture.

It should **not** become the commercial game by repeatedly adding:

```text
another domain field
+ another action-ID prefix
+ another if/else stage
+ another fixture-specific command branch
```

The next proof should introduce a product-level operating layer whose permanent semantics are:

```text
country owners
→ office-specific information and work
→ administration coordination
→ presidential attention or proactive review
→ typed presidential act
→ recipient-owned response
→ later evidence and historical record
```

while reusing the existing lower-level owners.

## 1.3 Stage 1 must not be the implementation base

Stage 1 contains useful interaction evidence, especially:

- readable briefing language;
- `Advance until attention`;
- an explicit empty/no-decision state;
- separation of routine progression from a sponsor choice;
- human-readable sponsor labels;
- a visible decision receipt concept.

But its implementation classifies attention through hardcoded action IDs and a few route stages, auto-dispatches two actions that are formally player commands, uses static Housing briefing prose, and only completes the first sponsor decision experience.

It is evidence to mine, not a branch to continue.

## 1.4 Preflight disposition

> **PRESERVE the existing causal/domain engines and regression suite. BUILD a new production-shaped presidential operating layer beside the accepted I10 session. ADAPT owners only as demanded by the proof. DO NOT fork the product from Stage 1 or grow the current monolithic dispatcher into the new game.**

---

# 2. Repository facts inspected

The preflight inspected the accepted baseline and Stage 1 through:

- `src/app/production-session.ts`;
- `src/app/integrated-session.ts`;
- `src/app/production-contract.ts`;
- `src/app/control-binding.ts`;
- `src/app/legislative-session.ts`;
- `src/sim/calendar-time.ts`;
- `src/sim/integrated-runtime.ts`;
- `src/sim/institutional-runtime.ts`;
- `src/sim/legislative-runtime.ts`;
- `src/sim/political.ts`;
- `src/sim/population-core.ts`;
- `src/sim/program-implementation.ts`;
- `src/sim/housing.ts`;
- `src/sim/integrated-information.ts`;
- `src/sim/legal-contest-runtime.ts`;
- `src/sim/history.ts`;
- `src/content/us-v0/configuration.ts`;
- `src/content/us-v0/i10.ts`;
- `src/ui/App.tsx`;
- `scripts/check-production-runtime-imports.mjs`;
- the I3–I10, persistence, Housing, information, legal, election, federalism, population, configuration, and topology tests;
- the Stage 1 diff, helper, UI, and test;
- `docs/I10_RUNTIME_CONVERGENCE_ACCEPTANCE.md`;
- the accepted product and Living Country authority stack.

The prior Game Reality Map remains valid as the product diagnosis. This preflight narrows the question to **implementation reuse and the next proof boundary**.

---

# 3. Existing runtime map

## 3.1 Normal production entry

The default application calls:

```text
createProductionGameSession()
→ IntegratedPartialRuntimeSession
→ US_V0_STRUCTURAL_CONFIGURATION
→ US_V0_I10_RUNTIME_ARTIFACTS
```

The production import check prevents the React entry from reaching quarantined GL0 state or audit-only constructors.

**Classification:** strong reusable seam.

**Disposition:** preserve the factory boundary and production/audit separation. Do not assume the current session type must remain the final implementation behind the factory.

## 3.2 Canonical production state

`IntegratedPartialRuntimeState` currently owns references to:

- legislative runtime;
- geography;
- weighted population;
- electoral topology;
- institutional/election/administration state;
- program implementation/public finance;
- Housing;
- information;
- legal contest;
- configuration and artifact bindings.

**Classification:** strong bounded composition, closed to the I10 set.

**Disposition:** preserve its owner separation and artifact binding. Do not treat its fixed field list as the final Living Country composition model.

## 3.3 Calendar and scheduler

The calendar supports:

- exact configured instants;
- stable boundary identity;
- semantic phase/order/stable-key ordering;
- processed-boundary state;
- no backward advancement;
- deterministic next-boundary selection;
- coarse/fine advancement equivalence when used correctly.

`integrated-session.ts` also derives Housing and administrative boundaries and composes them with configured institutional, information, and legal boundaries.

**Classification:** strong reusable foundation.

**Adaptation needed:** attention must become a projection over office receipts, deadlines, defaults, and player authority—not a side effect of whichever globally available action appears next.

## 3.4 Control binding

`AdministrationControlBinding` ties the player to:

- one executive office;
- one bound officeholder actor;
- one decision surface;
- an active/ended state;
- a dated ending reason.

It ends when the officeholder changes or the term ends.

**Classification:** strong reusable foundation.

**Adaptation needed:** broaden from the legislative-administration surface to the full presidential operating surface while retaining explicit authority and succession semantics.

## 3.5 Congress and political actors

The legislative runtime already provides:

- active office assignments;
- sponsorship;
- introduction;
- consideration gates;
- amendments;
- individual recorded votes;
- cloture/extended-debate behavior;
- text exchange;
- presentment;
- signature, veto, no-signature, and override paths;
- enacted legal sources;
- procedure history.

Political state already distinguishes:

- actor state;
- organization identity and membership;
- organization coordination;
- commitments;
- negotiation memory;
- actor-owned decisions;
- office assignment from actor identity.

**Classification:** strong reusable foundation, working but narrow.

**Adaptation needed:**

- more than one simultaneous proposal/procedure;
- Congress-owned initiative and agenda formation;
- persistent parties/factions and potentially multiple affiliations;
- committees, leadership, schedules, nominations, budgets, and oversight where the proof consumes them;
- actor state not defined solely by one proposal-dimension vector;
- constituency and evidence inputs that preserve uncertainty;
- relationships and commitments across workstreams.

Do not replace the procedural engine merely because its current content is narrow.

## 3.6 Elections, terms, and succession

The institutional runtime already distinguishes:

- electorate snapshots;
- weighted ballots;
- state popular results;
- attestations;
- elector/delegate appointments;
- certificates;
- collegiate declaration;
- successor entitlement;
- office transfer;
- administration history;
- congressional term cycles;
- control loss while the same world continues.

**Classification:** strong ownership/persistence foundation; election gameplay remains fixture-level.

**Adaptation needed:** campaigns, parties, candidate histories, district/seat elections, broader preference formation, and generated prehistory. Preserve the current election/certification/entitlement/assignment separation.

## 3.7 Public finance and implementation

The implementation module already distinguishes:

- exact money and owner;
- legal budget authority;
- fiscal control/apportionment;
- allocation;
- award;
- obligation;
- payment;
- recipient expenditure;
- program/legal baseline;
- intergovernmental relationship;
- state/local participation and relationship transitions;
- waiver requests and determinations;
- administrative constraints;
- recipient commitment, activity, draw, and payment;
- owner intentions and later owner resolution.

**Classification:** very strong reusable record/ownership foundation, heavily HOME/Housing/BABA-specific.

**Adaptation needed:** do not generalize every Housing record into a universal government schema immediately. Preserve this system as a real implementation workstream and extract reusable fiscal/instrument patterns only when another proof mechanism needs them.

## 3.8 Housing

Housing already maintains independent material state and accepts validated government inputs rather than allowing law or payment to set the material result directly. It has project and regional state, dated progression, conditions, completion, usable units, affordability effects, exposure references, and reconciliation tests.

**Classification:** strongest current material domain and a reusable background workstream.

**Disposition:** use it in the Presidential Operating Proof as inherited implementation already underway. Do not make the proof another Housing end-to-end route.

## 3.9 Information and public response

The information runtime already distinguishes:

- canonical Housing observation;
- measurement artifact;
- public release;
- claim;
- delivery;
- population exposure;
- population response;
- dated boundaries and lineage.

It also preserves exact versus deterministic bounded approximation for selected values.

**Classification:** valuable information/evidence primitives; current cognition model is fixture-specific.

**Adaptation needed:**

- evidence vintages and revisions;
- agency possession versus White House notice/access/receipt;
- office-specific receipt;
- staff analysis and synthesis;
- presidential presentation history;
- broader propositions/frames;
- media actors and differentiated distribution;
- sparse recipient state rather than global-cohort mutation for every item.

The current configured exposure-response route may remain regression evidence. It should not be promoted into the general public-belief algorithm.

## 3.10 Population and geography

The current population proves:

- one weighted population;
- state/DC control conservation;
- deterministic refinement and merge lineage;
- eligibility allocations;
- residence ownership;
- selected information and material associations;
- population-owned political state.

The current geography proves authenticated states, districts, project locators, geometry, and source/artifact identity.

**Classification:** strong conservation/provenance proof; representation needs substantial adaptation.

**Adaptation needed:**

- household/co-residential structure;
- sparse domain-owned associations;
- multiple geographic frames;
- exact/modeled/bounded/unsupported joint support;
- lifecycle transitions;
- selective refinement/coarsening;
- avoid carrying every material exposure, information receipt, and political state inside one global cohort identity.

Do not discard the current model; retain it as an I10-compatible fixture and migrate only when a new proof requires the expanded substrate.

## 3.11 Courts and contested authority

The legal route already distinguishes:

- executive attempt;
- claim;
- proceeding;
- interim relief;
- orders;
- receipts;
- compliance;
- appeal;
- stay;
- public rulings;
- independent court resolution.

**Classification:** strong reusable legal ownership pattern; one configured case only.

**Disposition:** preserve. The first Presidential Operating Proof does not need a second elaborate court domain unless a legal deadline is necessary to stress attention or knowledge.

## 3.12 Persistence

The format-11 save envelope persists the complete bounded runtime, configuration identity, artifact bindings, ControlBinding history, population, institutions, implementation, Housing, information, and legal state. Restoration performs extensive validation and reconstruction. Tests prove deterministic continuation and coarse/fine equivalence.

**Classification:** strong current-save foundation, not yet the full product save.

**Adaptation needed:**

- administration offices, assignments, queues, workstreams;
- receipt/access/presentation/knowledge state;
- evidence vintages;
- canonical occurrence/index references;
- active branch identity and rollback semantics;
- versioned migration strategy as the composition expands.

Do not replace the current save path before the new state actually exists. Preserve its tests as regression requirements.

---

# 4. Reuse classification

## 4.1 Reuse now

| Existing capability | Reuse disposition |
|---|---|
| configuration identity and hashing | retain directly |
| artifact authentication/bindings | retain directly |
| production versus audit import boundary | retain directly |
| exact calendar/boundary ordering | retain directly |
| deterministic causal keys | retain directly |
| ControlBinding officeholder continuity | retain and broaden |
| office/actor/assignment separation | retain directly |
| legislative procedural primitives | retain directly |
| actor-owned votes and commitments | retain directly |
| election/certification/entitlement/transfer separation | retain directly |
| fiscal authority/award/obligation/payment separation | retain directly |
| recipient and state independent resolution | retain directly |
| Housing material owner | retain directly |
| legal contest owner | retain directly |
| evidence/release/delivery identities | retain as primitives |
| save/load validation and deterministic tests | retain as regression floor |
| Electron/Vite/React platform path | retain directly |

## 4.2 Reuse with adaptation

| Existing capability | Required adaptation |
|---|---|
| `IntegratedPartialRuntimeState` | compose a broader operating world without one ever-growing closed field/dispatcher model |
| `IntegratedPartialRuntimeSession` | keep as I10 regression; do not use as the final presidential coordinator |
| `ProductionGameView` | replace flat route/count projection with Attention, Briefing, Country Watch, Workstreams, dossiers, evidence, and Record projections |
| global available-action list | derive presidential actions from attention/workstream/institutional provenance rather than route stage |
| population cohorts | preserve conservation but move toward household-aware sparse associations |
| political actor scaffold | broaden from proposal-centric evaluations and one synthetic organization membership |
| information runtime | add possession/access/receipt/presentation/vintage and differentiated recipients |
| distributed domain histories | add a player-safe cross-owner record/index rather than forcing one history owner |
| save envelope | add new operating/knowledge/branch state with explicit version migration |
| automatic advancement | stop on valid presidential attention, not generic action availability or a short list of stages |
| configured U.S. artifacts | retain as authenticated fixture packages; create separate proof configuration |

## 4.3 Fixture/proof only

The following should remain available for regression but should not define the product:

- August 22, 2026 scenario origin;
- the one `Housing Delivery and Capacity Agenda`;
- its fixed five-dimensional proposal space;
- `Delivery Coalition`, `Fiscal Compliance Coalition`, and `Regional Bargaining Caucus` as the entire political system;
- deterministic one-membership quota assignment for every legislator;
- Corpus Christi/Palms and the exact HOME/BABA route;
- fixed waiver and relationship-rejection cases;
- one configured legal dispute and appellate schedule;
- one two-ticket static election route;
- fixed claim and population-response tables;
- global exposure through configured cohort splitting;
- flat production counts/status panels;
- localStorage as the complete save UX.

## 4.4 Do not extend as the new product architecture

Do not build the Presidential Operating Proof by adding more of the following:

1. `availableProductionActions()` branches that encode the whole game sequence.
2. `dispatchPlayerCommand()` branches containing fixture IDs and completed downstream meaning.
3. Action-ID-prefix classification as the source of presidential attention.
4. Automatic dispatch of actions merely because they are considered “routine.”
5. One active proposal/procedure standing in for the administration agenda.
6. One generic `Advance world` operation that has no explanation for why it stopped.
7. UI-local decision receipts with no canonical historical occurrence.
8. Static briefing prose that asserts the situation rather than projecting canonical state and staff products.
9. Direct configured claim-to-belief/attribution/salience/preference/turnout replacement.
10. A global cohort accumulating every story, project, exposure, and political distinction.
11. More domain-specific orchestration inside the already-large `integrated-session.ts`.
12. A save parser whose only growth mechanism is manually validating every new field inside the same application file.

These are not condemnations of I10. They are the boundary between a successful walking-skeleton composition and the commercial operating architecture.

---

# 5. Missing permanent operating backbone

The next proof needs a small set of production-shaped capabilities that are genuinely absent.

## 5.1 Administration operating state

Minimum persistent state for selected proof offices:

- office identity and holder;
- office-owned records and access;
- assignments and owner-specific queues;
- delegations and standing instructions;
- office-specific analysis/synthesis;
- turnover-safe records;
- deadlines and defaults.

Do not implement a complete Cabinet.

## 5.2 Information and knowledge ledger

Minimum semantic states:

```text
artifact exists
→ institution possesses
→ office knows it exists
→ retrievable
→ office retrieved/received
→ staff analyzed
→ President received bounded presentation
```

plus:

- presentation scope;
- evidence vintage;
- revision/supersession;
- access/classification;
- same-history reload;
- no duplicate retrieval or presentation.

The initial proof need not implement rewind UI, but its save/state design must not make later branch-bounded knowledge impossible.

## 5.3 Presidential attention

A canonical or rigorously derived attention item needs:

- source artifact/duty/communication;
- receiving/escalating office;
- why presidential authority is required;
- known facts and uncertainty;
- options with authority/provenance;
- deadline/expiration;
- default or delegated outcome;
- independent downstream resolvers.

Attention can be empty.

## 5.4 Administration workstreams

A workstream should connect:

- objective;
- responsible offices;
- related conditions/evidence;
- actions/instruments;
- commitments;
- Congress/states/agencies/organizations;
- implementation;
- deadlines;
- history.

It remains a projection/coordination object, not the owner of those facts.

## 5.5 Typed presidential acts and dispatch

A player decision must become one or more knowingly authorized, visible acts:

- request analysis;
- internal instruction;
- delegation;
- agency directive/request;
- legislative proposal/offer;
- governor/organization contact;
- public communication;
- appointment/personnel act;
- deliberate inaction/default.

The proof must prevent hidden fan-out. One UI choice may authorize a bundle only when every included instrument is shown before confirmation.

## 5.6 Cross-owner Historical Record

The proof needs a player-safe index/projection capable of showing:

- what happened;
- what the administration knew;
- what the President was shown;
- what was decided;
- what other owners did;
- what evidence was later revised;
- what consequences followed.

This does not require replacing domain-owned occurrence records with event sourcing.

## 5.7 Operating projections

The proof needs coherent projections for:

- Presidential Attention;
- dated Briefing;
- Country Watch;
- Administration Workstreams;
- selected actor/institution dossier;
- evidence/detail;
- Historical Record.

The UI is not required to implement every eventual top-level surface.

---

# 6. Stage 1 disposition

## 6.1 Salvage as design evidence

Preserve these ideas:

- `Advance until attention` as the normal temporal interaction;
- empty Attention as valid;
- readable role/situation/boundary language;
- routine/autonomous work summarized between decisions;
- a clear first consequential choice;
- human-readable actor labels rather than IDs;
- visible decision aftermath;
- tests using production APIs rather than audit injection.

## 6.2 Do not merge the implementation wholesale

Reasons:

- `ROUTINE_OPENING_ACTIONS` hardcodes two command IDs;
- attention classification is action-prefix and route-stage based;
- `meaningfulDevelopment` watches only agenda, sponsorship, legal counts, rulings, and election stage;
- the helper treats every other global action as a presidential decision;
- the briefing is static Housing copy attached to the flat production view;
- the decision receipt is component-local UI state;
- the completed Stage 1 proof stops at sponsor choice and does not provide a complete functional route;
- it does not represent office receipts, uncertainty, concurrent threads, Country Watch, workstreams, or a living administration.

## 6.3 Stage 1 branch status

`implementation/stage1-opening-usability-proof` remains valuable preserved evidence at:

```text
a7e04ca78ba1ccb06d8dc3a4dfb0d43389804144
```

Its parent is the accepted production baseline.

It remains entirely unaccepted as product direction.

---

# 7. Branch-topology finding

The current assessment branch descends from the unaccepted Stage 1 commit:

```text
44c172... accepted production baseline
→ a7e04c... unaccepted Stage 1 code
→ product assessment and Living Country documents
→ 46f0a0... constitutional closure
```

Therefore:

> **Do not create the first implementation branch directly from `assessment/product-gameplay-master-plan`.**

Doing so would silently import the Stage 1 code and screenshots into the implementation baseline.

## Recommended clean handoff

The next implementation branch should begin at:

```text
44c1724962830225e6fc34f41d0df0cfdb7dfec0
```

and reference the accepted constitutional authority by immutable assessment commit:

```text
46f0a035ac529ed96a9dee5c9daa060d25e6886f
```

Before implementation begins, choose one explicit authority-access method:

1. keep the detailed authority on the assessment branch and record the controlling SHA in the proof contract; or
2. create a clean docs-only authority snapshot/branch rooted at `44c172...`, excluding Stage 1 source and artifacts.

Do not merge or cherry-pick the Stage 1 commit merely to obtain the assessment documents.

---

# 8. Recommended implementation shape

This is a preflight disposition, not final architecture authority.

## 8.1 Preserve I10 as a regression product fixture

Keep:

```text
createProductionGameSession()
→ current I10 session
```

working while the new proof is built.

Do not begin by rewriting every existing module or replacing the default application.

## 8.2 Create a separate Presidential Operating Proof factory

The next implementation contract should likely authorize a separate bounded entry such as:

```text
createPresidentialOperatingProofSession()
```

The exact name is unimportant.

Its purpose is to compose:

- selected existing owner modules;
- the new administration/attention/knowledge/workstream backbone;
- several coarse but causally honest threads.

It should not duplicate the lower-level engines.

## 8.3 Reuse owners below a new coordinator

The new product coordinator should:

- advance dated owner processes;
- collect only legitimately produced receipts and deadlines;
- allow administration offices to create assignments and synthesis;
- derive valid presidential attention;
- dispatch typed presidential acts;
- call recipient/domain owners;
- project player-safe views;
- persist the new state.

It should not directly decide:

- Congress’s vote;
- a governor’s response;
- an agency’s implementation result;
- public belief;
- media coverage;
- a material outcome.

## 8.4 Avoid a big-bang refactor

Do not first spend weeks “generalizing the engine.”

Extract or adapt a seam only when the proof needs it.

The preferred migration pattern is:

```text
existing owner remains tested
→ proof introduces a small adapter or expanded owner API
→ adapter is tested against accepted semantics
→ old I10 route remains green
→ later consumers reuse the same seam
```

This permits permanent structure without pretending every final abstraction is knowable before playtesting.

---

# 9. Suggested proof content after this preflight

The next document should be a compact executable proof contract, not another constitutional program.

It should contain three or four concurrent threads:

## Thread A — regional employment deterioration

A coarse but real Labor mechanism with:

- selected regions/industries;
- represented separations;
- preliminary evidence;
- later revision;
- governor and congressional interpretation;
- possible household/coverage/fiscal placeholders that preserve causal handoff semantics.

## Thread B — inherited Housing implementation

Use the current Housing/public-finance/recipient machinery as work already underway:

- agency and state activity continues in the background;
- one implementation problem is not initially known to the White House;
- the player may investigate or remain unaware;
- Housing does not become the entire game.

## Thread C — autonomous congressional initiative

Congress initiates a proposal or hearing without a White House workstream:

- Legislative Affairs receives it;
- a real deadline or floor/committee opportunity exists;
- the President may support, negotiate, oppose, ignore, or prioritize another matter.

## Thread D — serious quiet condition

A materially meaningful condition:

- remains weakly measured;
- receives limited organization/coverage;
- does not reach Presidential Attention automatically;
- remains discoverable only through a legitimate proactive route.

The proof does not need final healthcare, media, economy, or Cabinet simulation. It needs honest temporary owners and explicit stubs where final depth is absent.

---

# 10. Proof-level acceptance targets

The executable proof should eventually demonstrate:

1. at least three concurrent threads remain active;
2. at least one major development originates outside the Presidency;
3. Attention can be empty;
4. the player can investigate proactively;
5. one investigation returns uncertainty, delay, or no useful finding;
6. one preliminary estimate is later revised without rewriting the earlier information set;
7. one existing implementation process continues while the player focuses elsewhere;
8. one presidential choice weakens or closes another real opportunity through owner-specific resources or deadlines;
9. a presidential action becomes a visible typed instrument rather than hidden fan-out;
10. recipient institutions may delay, refuse, modify, or fail;
11. save/load does not duplicate actions, receipts, searches, presentations, or consequences;
12. the Historical Record can explain what was known and decided at the time;
13. the player can distinguish material state, evidence, staff interpretation, political activity, administration priority, and presidential requirement;
14. no route requires audit/debug truth;
15. the subjective player wants to advance again to see what happens.

The represented threads do not define final product or Early Access breadth.

---

# 11. Regression requirements

The next code proof should preserve at least:

- production import-graph quarantine;
- configuration and artifact authentication;
- I10 normal production route;
- sponsor-owned introduction;
- organization-owned coordination;
- public-finance-owned authority recognition;
- legal stay timing;
- save/load deterministic continuation;
- coarse/fine advancement invariance;
- election/certification/succession and ControlBinding end;
- population conservation;
- Housing material and fiscal reconciliation;
- information and court ownership boundaries.

New proof tests should add:

- office receipt versus presidential presentation;
- empty Attention;
- autonomous non-player initiative;
- typed presidential instrument and recipient receipt;
- evidence revision;
- proactive investigation;
- no hidden severe-condition escalation;
- save/load idempotency for receipts and presentation;
- same instant independent-order invariance;
- no Stage 1 action-prefix classifier in the new attention path.

---

# 12. Principal implementation risks

## Risk 1 — orchestration monolith

Adding the Living Country directly to `integrated-session.ts` would turn a successful composition proof into a god coordinator.

**Control:** new operating layer; existing session retained as regression.

## Risk 2 — fixture leakage

Housing IDs, proposal dimensions, synthetic organizations, and fixed dates can silently become generic APIs.

**Control:** separate proof configuration and owner-neutral operating contracts.

## Risk 3 — UI-first fake state

A polished Briefing may tempt implementation to invent cards, urgency, or adviser views that no canonical office/evidence state owns.

**Control:** every substantive card traces to owner state, receipt, synthesis, or declared presentation projection.

## Risk 4 — over-generalization before play

Building a universal actor/domain/event framework before the operating proof risks months of abstractions without product evidence.

**Control:** extract only demanded seams; preserve explicit stubs and proof non-goals.

## Risk 5 — first slice becoming the product

A successful employment/Housing/Congress proof could become “EA” by inertia.

**Control:** every proof contract declares temporary breadth and which full-product identity requirements remain untested.

## Risk 6 — insufficient breadth in the operating test

A one-card UI demo could pass usability checks while still not feeling presidential.

**Control:** concurrent threads, autonomous actors, proactive play, background implementation, empty attention, and opportunity cost are mandatory.

---

# 13. Final preflight classification

## Preserve directly

- scheduler semantics;
- causal ownership;
- configuration/artifact integrity;
- production/audit boundaries;
- ControlBinding;
- legislative procedure;
- institutional election/succession;
- fiscal/implementation records;
- Housing;
- legal contest;
- information artifact primitives;
- persistence/invariant tests.

## Adapt incrementally

- integrated state composition;
- application session/coordinator;
- population;
- actors/organizations;
- information/public response;
- save envelope;
- player projections;
- advancement/attention;
- historical indexing.

## Keep as fixtures

- August 2026 U.S. scenario;
- single Housing proposal;
- fixed coalitions and recipients;
- fixed legal/information/election route;
- Stage 1.

## Build next

- administration operating state;
- knowledge/receipt/presentation ledger;
- assignments and queues;
- presidential attention;
- workstreams;
- typed presidential acts and dispatch;
- cross-owner Record projection;
- semantic operating views.

## Do not build yet

- 2024–2029 generator;
- final 2029/2033 commercial start;
- full Cabinet;
- complete national economy;
- full media ecosystem;
- all policy domains;
- full electoral campaign;
- final UI;
- Early Access roadmap.

Those remain later evidence phases.

---

# 14. Preflight verdict

## **PASS — READY TO DEFINE THE EXECUTABLE PRESIDENTIAL OPERATING PROOF**

The repository contains enough trustworthy reusable machinery to begin product evidence without rebuilding the simulation.

The next proof should not be a fake UI demonstration and should not attempt the whole Living Country.

It should:

> **Build the permanent presidential operating backbone over a bounded configured country, route three or four concurrent causally honest threads through it, preserve I10 as regression evidence, and test whether directing the administration and advancing the calendar finally feels like being President.**

No implementation is authorized by this report alone.

The next artifact should be a concise executable proof package defining:

- branch and baseline;
- exact starting fixture;
- represented offices;
- three or four threads;
- permanent versus temporary state;
- accepted stubs;
- player-visible loop;
- required tests;
- failure conditions;
- explicit non-authority over Early Access scope.