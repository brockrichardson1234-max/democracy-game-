# 02 — Causal Architecture V0

Status: **Commit-2 architecture candidate for review. Not implementation authority.**

## 1. Purpose

Commit 1 established the player contract and Governing Loop 0. This document derives the smallest causal world architecture that can support that loop without smuggling player-facing abstractions into canonical simulation state.

This document answers:

> What kinds of state exist, which kinds are authoritative, how do causal changes cross subsystem boundaries, and what must never become a second owner of truth?

It does **not** yet define detailed government primitives, legislative procedures, judicial procedure, population implementation, belief-update formulas, or transition/tick ordering. Those belong to later bounded commits.

## 2. Architectural doctrine

The core rule is:

> **Canonical state changes through explicit causal processes owned by the subsystem responsible for that fact. Other systems may reference, measure, summarize, forecast, or react to that state, but they do not silently become alternate owners of it.**

This produces several immediate consequences:

- a law can establish legal authority but cannot directly lower rent;
- an appropriation can establish fiscal authority but cannot directly create a completed project;
- a program can own grant administration but cannot own the physical housing stock it is trying to affect;
- a poll can record an imperfect measurement of political state but cannot become the electorate's belief state;
- an electoral map can define constituency boundaries without owning the people inside them;
- an election result can exist without being identical to current office assignment;
- a court order can create a scoped legal obligation without rewinding material history;
- a player-facing dashboard can explain the world without owning any world truth; and
- a player `ControlBinding` can select intents without becoming canonical political state.

## 3. State classes

Commit 2 distinguishes six architectural classes of information. These classes are semantic; they do not require six runtime base classes.

### 3.1 Canonical current state

Current facts that the simulation treats as authoritative at a given time.

Examples:

- current simulation time;
- population residence and demographic state;
- current housing stock and construction pipelines;
- current office assignments;
- enacted legal instruments and appropriations;
- current agency capacity;
- current program applications/awards;
- current beliefs or political dispositions held by population groups or actors;
- current information artifacts and their access/provenance state.

A canonical fact has one semantic owner.

### 3.2 Canonical historical records

Persistent records that some event, decision, transition, measurement, claim, election, payment, appointment, or other consequential occurrence happened at a particular time.

Historical records do not own the corresponding current state.

Example:

- an election record owns the fact that Candidate A received a particular certified result in Election E;
- it does **not** own who currently occupies the office years later.

### 3.3 In-world information artifacts

Objects that exist *inside the world as information* rather than as the underlying fact they describe.

Examples:

- a statistical release;
- agency report;
- poll result;
- staff forecast;
- public claim;
- campaign statement;
- confidential memo;
- published news report.

These artifacts may be canonical because the report or claim really exists in-world. Their contents are not automatically canonical truth about their referent.

### 3.4 Derived projections

Computed views of canonical state that do not independently exist as world truth.

Examples:

- national dashboard totals;
- district electorate composition derived from population + electoral map;
- projected program cost;
- estimated future housing effect;
- approval summary;
- causal explanation view;
- regime classification;
- UI trend line.

A derived projection is read-only with respect to its source state.

If a projection is later published or stored as an in-world report, the resulting **artifact** becomes canonical as a historical/information object with provenance and an `as-of` time. It still does not become the owner of the state it measured or forecast.

### 3.5 Session/control state

Runtime state about how a human user is interacting with the canonical world.

Examples:

- `PlayerSession`;
- `ControlBinding`;
- selected screen/tab;
- temporary UI filters;
- developer inspection state.

This is not canonical political truth unless an explicit in-world action is submitted and accepted into world history.

### 3.6 Rules/content configuration

Definitions used to interpret or evolve state but which are not themselves ordinary mutable world state.

Examples may eventually include:

- entity type definitions;
- constitutional procedure templates;
- content definitions;
- simulation formulas;
- versioned scenario configuration.

A future system may deliberately make some rule mutable through constitutional/legal change. In that case the **in-world legal source or rule state** becomes canonical; the engine implementation itself does not mutate merely because a law changed.

## 4. Canonical world roots

The exact code layout is deferred, but Architecture V0 recognizes the following semantic ownership roots because GL0 requires them.

```text
CanonicalWorldState
├── TimeState
├── GeographyState
├── PopulationState
├── MaterialDomains
├── PoliticalOrder
├── InformationEnvironment
└── HistoricalRecord
```

These are ownership domains, not necessarily seven classes or packages.

### 4.1 TimeState

Owns the simulation's authoritative current time and calendar position.

It does **not** automatically own the meaning of scheduled legal, fiscal, political, or material events.

Example:

A statute's effective date belongs to the statute/legal state. A scheduler may index that date for efficient execution, but the scheduling index must not become the semantic owner of why the statute becomes effective.

### 4.2 GeographyState

Owns spatial identity and relationships such as:

- territory;
- boundaries;
- containment;
- adjacency/topology;
- spatial references used by population, material domains, jurisdictions, and electoral maps.

Geography does **not** own population simply because population is located in geography.

### 4.3 PopulationState

Owns the canonical ordinary-population state required by the simulation, including population weight, residence linkage, and demographic attributes at whatever resolution is currently supported.

Later Commit 4 will define the aggregate/correlation-preserving representation and the location of population-level political state.

Population is not duplicated into separate economic people, electoral people, media audiences, or policy-beneficiary people. Those systems obtain projections or references into the same canonical population state.

### 4.4 MaterialDomains

Own physical/social/economic conditions whose change is a material consequence rather than a legal or political declaration.

The first material domain is housing.

Housing therefore owns facts such as:

- physical housing stock;
- construction pipeline state;
- local/regional housing pressure;
- rent/affordability conditions represented by the accepted housing model;
- material bottlenecks that affect construction and delivery.

A later labor, health, energy, education, or other domain owns its own material truth rather than writing into a generic `policyOutcome` store.

Material domains may causally interact, but the interaction must preserve explicit ownership of each affected fact.

### 4.5 PoliticalOrder

Owns canonical governmental/political state such as jurisdictions, institutions, offices, office assignments, actors, legal sources, fiscal authority, procedures, elections, programs, organizations, and related state.

Commit 3 will split this broad root into the internal ownership boundaries needed for government authority, political actors, fiscal authority, administration, federalism, and judiciary/legal contest.

Commit 2 intentionally does **not** define one `PoliticalState` god object.

### 4.6 InformationEnvironment

Owns in-world information artifacts and distribution/exposure state where supported.

Examples:

- measurement releases;
- reports;
- claims;
- forecasts as artifacts;
- polls as artifacts;
- messages/public statements;
- provenance, authorship, audience/distribution, confidentiality, access, and revision relationships.

It does not own the material condition being reported, the voter belief being measured, or the legal source being described.

### 4.7 HistoricalRecord

Owns persistent records of consequential past events and transitions.

Examples may include:

- attempted political action submitted;
- proposal introduced;
- vote resolved;
- law enacted;
- appropriation enacted;
- grant awarded;
- funds obligated/disbursed;
- project milestone reached;
- report published;
- election resolved;
- office assignment changed.

Historical records may reference canonical entities and before/after consequences. They do not become an alternate mutable copy of current state.

The exact event schema, granularity, and replay representation are deferred.

## 5. Causal change rule

Every material or institutional consequence in GL0 must be explainable as a chain of owner-respecting changes.

A cross-domain causal edge has the conceptual form:

```text
source fact / accepted intent / scheduled condition
        ↓
causal process with a declared authority/owner
        ↓
owner-authorized mutation of canonical target fact
        ↓
historical evidence / observable consequences
```

This is a semantic rule, not a requirement for an event-bus implementation.

### Candidate invariant C-01

**A subsystem may not directly mutate another subsystem's authoritative fact merely because it needs the result. Cross-domain causality must pass through the target owner's accepted mutation/process boundary.**

For example:

```text
ProgramState
  cannot directly set HousingState.rent -= 5%
```

Instead the program can create financed projects, administrative approvals, funding flows, or other legitimate inputs. The housing material process owns how those inputs change construction and affordability.

## 6. GL0 causal trace by ownership

The following is the current architecture burden for the ordinary housing route. Internal political-order owners are intentionally coarse until Commit 3.

| Step | Canonical owner / source | What the step may legitimately produce |
|---|---|---|
| Existing housing problem | Housing material domain | Actual housing conditions |
| Player diagnosis | Derived projection + available information artifacts | Player-facing understanding only |
| Player agenda/intent | Accepted political action / political-order history | Canonical attempted intent, not outcome |
| Proposal | Political order | Pending proposal/provisions/status |
| Bargaining/amendment/vote | Political actors/process | Changed proposal, commitments, decision record |
| Enactment | Constitutional/legal portion of political order | New valid legal source/state where applicable |
| Appropriation/fiscal authorization | Fiscal/legal portion of political order | Legal authority/limits to use public resources |
| Agency/program setup | Institutional/administrative portion of political order | Program rules, staffing/capacity, administrative state |
| State participation/refusal | State jurisdictional/political/administrative state | Participation commitments or refusal |
| Award/obligation/payment | Program + fiscal-execution state | Administrative/fiscal execution records |
| Physical construction | Housing material domain | Construction pipeline and completed stock |
| Affordability/rent response | Housing material domain | Material outcome, possibly weak/mixed/unexpected |
| Official measurement | Measurement process → information artifact | Imperfect/as-of report about housing state |
| Political claim | Information environment | Claim/interpretation with provenance |
| Exposure | Information environment | Which audience/cohort received a signal |
| Population belief/attribution | Population political state (Commit 4 detail) | Changed belief/attribution/salience |
| Election | Political/electoral process | Election result/history, not automatic office mutation |
| Office transfer | Constitutional/political process | Office assignment/entitlement changes when resolved |
| Player-control transfer/end | Session/control state | ControlBinding update only |

No row is permitted to skip directly to a later row merely because the intended policy objective is known.

## 7. Policy is not an ownership category

Commit 2 explicitly rejects a canonical all-purpose `Policy` state owner.

Player-facing language may group many things under a policy label, but the underlying world can contain distinct objects and relationships such as:

- intent;
- proposal;
- legal source;
- fiscal authorization;
- administrative program;
- administrative action;
- project/operation;
- material effect;
- measurement;
- political interpretation.

These objects do not have to occur in one mandatory linear pipeline.

An executive action, tax rule, automatic benefit, judicial order, appointment, or future policy domain may traverse different causal edges while preserving the same ownership doctrine.

### Candidate invariant C-02

**A player-facing policy concept may aggregate or navigate related canonical objects, but it may not become a shortcut owner that directly mutates legal, administrative, material, informational, or political-response state.**

## 8. Cross-domain references preserve identity

When one domain needs to refer to another domain's entity, it references canonical identity rather than cloning the entity into its own store.

Examples:

- an electoral map references geographic units; it does not copy their populations;
- a program award references a state jurisdiction and project; it does not own the state itself;
- a report references a housing region/as-of period; it does not copy authoritative current housing state and keep mutating it;
- a political claim refers to a law, actor, or measurement artifact; it does not become that object;
- a historical vote record references the officeholder/proposal/election at the time; it does not become the current actor state.

### Candidate invariant C-03

**Cross-domain relationships preserve canonical identity through references. A dependent subsystem may not create a shadow copy that later competes with the canonical owner.**

## 9. Time, scheduling, and latency

Commit 2 freezes ownership semantics but does not freeze tick order.

The following temporal distinctions must remain representable:

- decision time;
- enactment time;
- effective time;
- appropriation availability;
- obligation/payment time;
- implementation time;
- material-effect time;
- measurement/as-of time;
- report/release time;
- exposure/belief-update time;
- election/office-transfer boundaries.

A central scheduler or event queue may later exist as an implementation tool. It is not allowed to become the semantic owner of these underlying obligations/effective dates merely because it indexes them.

Example:

```text
Statute.effective_at = January 1
```

The legal source owns the effective date. A scheduler may derive `wake statute on January 1` from it.

If the scheduler index is rebuilt, the statute's legal meaning must remain intact.

### Candidate invariant C-04

**Scheduling infrastructure may index when domain-owned facts should be reconsidered; it does not silently become the owner of why those facts are effective, due, expired, or required.**

## 10. History versus current state

The world must preserve political history without using historical records as current-state shortcuts.

Examples:

- `VoteRecord(YEA, 2030)` is historical truth; it does not imply the actor still supports the proposal in 2034.
- `ElectionResult(2032)` is historical truth; it does not itself own the current office assignment.
- `GrantAward(2031)` is historical truth; it does not imply the project remains active forever.
- `Poll(47%, as_of=T)` is historical/information truth; it does not own current support.
- `LawEnacted(X)` is historical truth; current legal applicability still depends on the persistent legal order, later amendments, scope, effective dates, and future legal contest.

### Candidate invariant C-05

**Historical records own what happened. Current-state owners own what is true now. One must not be substituted for the other.**

This is also the foundation for future politician career/history gameplay: past votes, offices, laws, programs, projects, claims, and material consequences remain actual world history rather than achievement flags detached from the simulation.

## 11. Resolution may deepen without ownership migration

Architecture V0 supports low-resolution representations that later become more detailed.

Example:

A state in GL0 may initially contain only enough governmental/administrative state to participate in or refuse a federal grant program. Later, the same jurisdiction may gain a governor, legislature, courts, agencies, budget, taxation, and local-government relationships.

That deepening should add state beneath the same canonical ownership seams rather than replacing a fake national summary with a completely different world model.

Likewise:

- population representation may move from a coarse fixture to a richer correlation-preserving representation;
- geography may deepen from large regions to finer cells;
- agencies may deepen from aggregate capacity to more explicit operations;
- information may deepen from a few reports/claims to organizations/channels;
- material domains may deepen their internal mechanisms.

### Candidate invariant C-06

**Simulation resolution may increase where causal need requires it, but increased resolution should refine an existing owner rather than create a second authoritative representation of the same fact.**

This does not mean every future feature must fit without any architecture extension. It means foreseeable depth should not require relocating already-owned truth merely because V0 was coarse.

## 12. Derived analysis and hypothetical policy evaluation

The game will need forecasts, proposal scoring, budget estimates, and player-facing causal explanations.

These must remain projections.

A hypothetical evaluator may consume:

- a canonical-state snapshot;
- a proposed change;
- declared assumptions;
- the same domain rules or an explicitly approximate forecasting model.

It returns a projection/artifact. It does not mutate the live world.

If an approximate model differs from the authoritative simulation, that difference must be explicit in provenance/uncertainty rather than hidden behind a second apparently authoritative formula.

### Candidate invariant C-07

**Forecasts and hypothetical evaluations may predict canonical state but never become or mutate canonical state merely because the player is viewing a proposal.**

Commit 2 does not mandate a specific snapshot/copying implementation or require every forecast to run the full simulation engine.

## 13. Explicit anti-patterns

Architecture V0 rejects the following patterns unless a later evidence-backed change explicitly overturns the relevant invariant:

- `policy.housingEffect = -5% rent` as an authoritative causal shortcut;
- UI state written back into simulation truth;
- election result object owning current officeholder;
- district object owning copied population;
- poll result overwriting voter belief state;
- published report overwriting the material state it measured;
- historical record serving as the only current-state store;
- duplicate actual/proposed formulas whose divergence is silently accepted as truth;
- central scheduler owning domain obligations/effective dates;
- `ControlBinding` or player session owning political actors/world state;
- global `support`, `legitimacy`, `institutionalControl`, or `regimeType` values that directly cause actor behavior;
- a generic `Policy` object directly mutating law, budget, programs, material conditions, and approval.

## 14. Commit-2 review questions

Review Commit 2 against the accepted Commit-1 GL0 and report only structural problems that would make Commit 3 unsafe.

1. Does every GL0 causal step have an obvious semantic owner without requiring Commit 3 details yet?
2. Is any top-level root secretly a god object or duplicate owner?
3. Is the distinction between canonical state, historical record, in-world artifact, derived projection, session state, and rules/configuration coherent?
4. Can housing remain the material owner of its outcomes while programs/agencies supply causal inputs rather than direct modifiers?
5. Are geography and population separated cleanly without making either unable to represent residence/electoral projections?
6. Can information artifacts persist without becoming the truth they describe?
7. Does election history remain distinct from office assignment/current political state?
8. Can low-resolution states/population/material domains deepen later without ownership migration?
9. Is any rule in this document actually premature implementation detail rather than an architectural boundary?
10. Is any GL0-required canonical fact still missing an ownership home?

Do not use this review to design detailed constitutional procedures, politician psychology, electorate math, tick ordering, or code schemas. Those are later commits.
