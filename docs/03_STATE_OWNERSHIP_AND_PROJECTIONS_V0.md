# 03 — State Ownership and Projections V0

Status: **Commit-2 architecture candidate for review. Not implementation authority.**

## 1. Purpose

`02_CAUSAL_ARCHITECTURE_V0.md` defines the kinds of state that exist and the rules for cross-domain causality. This document makes the ownership rule concrete.

The question here is:

> For each important truth needed by Governing Loop 0, who owns the authoritative current fact, who may only reference or project it, and what common shadow-owner mistakes are forbidden?

The point is not to force every fact into one giant registry. The point is to make duplicate authority hard to create accidentally.

## 2. Ownership vocabulary

### Canonical owner

The subsystem/entity/domain with the sole semantic authority to mutate a particular canonical fact.

An owner may expose read models, references, queries, measurements, or events. Other systems may react to those outputs. They do not gain mutation authority over the fact merely because they consume it.

### Reference holder

A subsystem that stores the identity/reference of a canonical entity or fact owned elsewhere.

A reference holder does not own the referenced object's state.

### Derived projection

A recomputable view generated from one or more canonical sources.

A projection may be cached for performance. Caching does not create ownership.

### In-world artifact

A persistent report/claim/poll/memo/record that exists in the simulation as information. The artifact owns its own content, provenance, timestamp, access, and publication state. It does not own the referent it describes.

### Historical record

A persistent record of a past event or state transition. It owns the fact that the recorded event occurred. It does not become the owner of the current fact that event once changed.

## 3. Ownership rule

### Candidate hard invariant O-01

**Every mutable canonical fact has one semantic owner. Multiple representations are allowed only when all non-owning representations are explicitly references, projections, artifacts, indexes, or historical records.**

This rule applies at the fact level, not merely the object level.

One concept can legitimately be split across owners when the facts are different.

Example:

A housing grant can involve:

- legal authority to spend — fiscal/legal owner;
- actual available public funds — treasury/public-finance owner;
- grant application/award state — program/administrative owner;
- obligation record — fiscal/program execution owner;
- disbursement/payment — treasury execution owner;
- physical construction progress — housing material owner;
- published completion report — information artifact owner.

Those are related facts, not one fact duplicated seven times.

## 4. GL0 source-of-truth table

The internal PoliticalOrder subdivisions below are semantic placeholders that Commit 3 must formalize. Commit 2 freezes the ownership distinction, not the final class names.

| Canonical fact | Owner | Explicitly not the owner |
|---|---|---|
| Current simulation time | `TimeState` | UI clock, report timestamp, scheduler index |
| Geographic unit identity/boundary/topology | `GeographyState` | Jurisdiction summary, district population cache, UI map |
| Population weight/demographics/residence linkage | `PopulationState` | Geography, district, electorate summary, material domain |
| Housing stock | Housing material domain | Law, program, grant record, dashboard |
| Construction pipeline/material completion | Housing material domain | Appropriation, agency, political proposal |
| Rent/affordability/material housing pressure | Housing material domain | Housing policy label, poll, voter belief |
| Jurisdiction identity and governmental existence | PoliticalOrder jurisdiction state | Geography, UI map |
| Institution/office existence | PoliticalOrder institutional state | Player session, actor biography, UI |
| Current office assignment | PoliticalOrder office-assignment state | Election result record, player binding |
| Political actor identity/current actor state | PoliticalOrder actor state | Office, party summary, player session |
| Pending proposal/provisions/status | PoliticalOrder legislative/procedural state | Player agenda label, enacted law |
| Enacted constitutional/statutory/regulatory source | Constitutional/legal state | Proposal, UI policy card, news report |
| Scoped legal obligation/order/constraint | Constitutional/legal/judicial state | Material domain, global boolean `currentLegalEffect` |
| Applicable legal position for actor/action/place/time | **Derived** from legal sources, orders, scope, time and relevant facts | One universal law-status field |
| Legal authorization/appropriation limit | Fiscal/legal authority state | Treasury cash, program delivery, material outcome |
| Actual government cash/debt/budget balances | Treasury/public-finance state | Statute, appropriation object, policy projection |
| Obligation/commitment of public funds | Fiscal/program execution state | Appropriation alone, completed payment |
| Actual disbursement/payment | Treasury/public-finance execution state | Obligation, program intent |
| Agency staffing/capacity/operational state | Institutional/administrative state | Law, appropriation, program forecast |
| Program eligibility/rules/administrative status | Program/administrative state | Housing material state, UI policy label |
| Application/award/grant administrative record | Program/administrative state | State jurisdiction itself, housing stock |
| State participation/refusal in program | Relevant state political/administrative state | Federal program summary, national dashboard |
| Population-level beliefs/partisan identity/salience/expectations | Population political state (Commit 4 detail) | Poll, claim, report, election result |
| Individual politician beliefs/strategy/commitments | Actor political state (Commit 3 detail) | Population political state, party summary |
| Organization positions/resources/strategy | Organization state (Commit 3 detail) | Individual actor state, electorate summary |
| Electoral boundary/map assignment | Electoral/political process state referencing geography | Geography population, district-owned people |
| Current electorate composition for a contest | **Derived** from electoral map + eligibility rules + population | Election result, district population copy |
| Election result/certification record | Electoral process/historical record | Current office assignment, current voter preference |
| Poll result | Information/measurement artifact | Population belief state |
| Official statistical release | Information/measurement artifact | Material domain it measured |
| Staff forecast | Information artifact/projection with provenance | Future canonical world |
| Political/public claim | Information artifact | Underlying fact being claimed |
| Exposure/distribution record where simulated | Information environment | Belief itself |
| Player-facing dashboard metric | Derived projection | Any canonical owner |
| Regime classification | Derived projection | Institutional behavior |
| Player `ControlBinding` | Session/control state | Office, actor, administration, world truth |
| Historical vote/action/event | Historical record | Current actor preference/current state |

## 5. Geography and population

Commit 2 deliberately avoids the phrase “population belongs to geography.”

The stronger rule is:

- geography owns spatial identity and relationships;
- population owns population state;
- population records reference geographic identity for residence/location;
- systems that need a geographically bounded population derive or query the appropriate population projection.

Conceptually:

```text
GeographyState
  GeoCell A
  GeoCell B

PopulationState
  population/cohort/particle X -> residence: GeoCell A
  population/cohort/particle Y -> residence: GeoCell B

ElectoralMap
  District 1 -> references GeoCell A + part/all of other geography

DerivedElectorate(District 1)
  = eligible PopulationState entries whose residence falls inside referenced geography
```

The exact representation may later be weighted particles, sparse distributions, a hybrid, or another benchmarked implementation.

### Candidate hard invariant O-02

**Geographic boundaries and population are independently owned. Electoral maps reference geography; electorates are derived from canonical population plus applicable geography/eligibility rules. Districts do not own or duplicate people.**

This permits redistricting to change boundary membership without relocating the population itself.

## 6. Legal state is scoped, not one global switch

Commit 2 freezes the ownership consequence of the earlier judiciary discussion without designing courts yet.

The legal world may contain multiple simultaneous sources and scoped effects:

- constitutional sources;
- amendments;
- statutes;
- regulations/orders;
- appropriations;
- judicial orders;
- interpretations/rulings;
- pending contests;
- effective dates;
- territorial/party/actor scope.

Therefore the architecture must not create one global field such as:

```text
law.currentLegalEffect = ALLOWED
```

and treat it as universal truth for all actors and contexts.

Instead, the relevant legal position is conceptually a projection/query:

```text
resolveLegalPosition(
  actor,
  attemptedAction,
  target,
  place,
  time,
  applicableLegalSources,
  scopedOrders,
  relevantProceduralState
)
```

The exact resolver belongs to Commit 3.

### Candidate hard invariant O-03

**Legal sources/orders own their own text, authority claims, effective dates, scope, and procedural state. The applicable legal position is derived for a context; no single global `currentLegalEffect` owns all legal reality.**

This leaves room for contested interpretation, limited orders, appeals, institutional disagreement, and later constitutional crisis without implementing that gameplay now.

## 7. Fiscal truth is layered

The phrase “the government has $20B for this program” can refer to several different facts. Commit 2 forbids collapsing them.

At minimum the architecture must preserve the distinction among:

1. **Authorization** — legal permission to create/operate/spend for a purpose.
2. **Appropriation** — legal fiscal authority/limit for public resources.
3. **Available public financial state** — actual treasury/budget/cash/debt state relevant to execution.
4. **Obligation** — a legally/administratively committed amount.
5. **Disbursement/expenditure** — actual funds paid/moved.
6. **Material use/outcome** — what the recipient/project/material system actually did with the resources.

These may eventually be grouped into fewer runtime structures, but they are not semantically interchangeable.

### Candidate hard invariant O-04

**Legal fiscal authority, available public funds, obligations, disbursements, and material outcomes remain distinct facts with distinct owners. “Law passed” or “appropriated” must never mean “money was spent” or “outcome occurred.”**

## 8. Program state versus material state

A program is an administrative mechanism, not the society it is trying to change.

For the GL0 housing program, program/agency state may own:

- eligibility rules;
- applications;
- administrative reviews;
- awards;
- reporting requirements;
- compliance/enforcement status;
- administrative milestones;
- references to obligations/disbursements;
- references to projects/recipients.

The housing domain owns physical/material facts such as:

- project construction progress insofar as it represents actual physical construction;
- units completed;
- housing stock;
- vacancy/pressure variables;
- rent/affordability state.

An administrative project record may refer to a physical project without becoming the owner of the physical world.

### Candidate hard invariant O-05

**Administrative/program state may create legitimate inputs and obligations for a material domain, but it does not own the material outcome. Material domains determine material response, including weak, delayed, offsetting, or unexpectedly negative response under competent administration.**

## 9. Political state is not one shared soup

Commit 2 identifies different owners for politically relevant state rather than creating one `PoliticalDisposition` god object.

At minimum:

- ordinary-population political state is keyed to/owned with population state;
- individual political actors own their actor-specific political state;
- organizations own organization-specific positions/resources/strategy;
- election processes own election-specific procedural/result state;
- institutions own institutional capability/procedure state;
- information artifacts own claims/reports, not beliefs.

Commit 3/4 will define the internal structures.

### Candidate hard invariant O-06

**Population political state, individual actor political state, organization state, institutional state, and election/process state remain distinct semantic owners even when they share concepts such as preference, support, strategy, or salience.**

## 10. Information artifacts versus belief

The information chain is intentionally multi-owner.

```text
Housing/material truth
        ↓ measurement process
Official report artifact
        ↓ distribution/exposure
Population receives signal
        ↓ belief-update process
Population political belief
```

The report owns:

- what it said;
- who produced it;
- when it was measured/released;
- uncertainty/revision metadata;
- who could access it;
- publication/distribution state.

The housing domain still owns actual housing conditions.

PopulationState still owns the population's resulting belief state.

A later poll runs in the opposite observational direction:

```text
Population political state
        ↓ sampling/measurement
Poll artifact
```

The poll result therefore cannot write back into voter belief simply because it is displayed in the UI.

### Candidate hard invariant O-07

**Information artifacts own what was measured, reported, claimed, forecast, or communicated. They do not own the underlying fact or the recipient's resulting belief.**

## 11. Projection contract

Any derived projection used by UI, AI, analysis, forecasting, or auditing must obey the following semantic rules.

### 11.1 Declared sources

A projection must be traceable to its canonical inputs or to a declared artifact/snapshot.

### 11.2 Read-only source relationship

Producing or viewing a projection does not mutate its source state.

### 11.3 As-of semantics

Where time matters, the projection/report must distinguish the state/time it refers to from the current live world.

### 11.4 Staleness is not authority

A cached projection may be stale. Staleness makes it an old projection, not an alternate current truth.

### 11.5 Persisted projection becomes an artifact

If a forecast/report/poll is persisted because actors can later remember, quote, revise, or react to it, the persisted object becomes a canonical in-world information/historical artifact.

Its content remains an observation/prediction about another owner.

### 11.6 No write-back by convenience

A projection cannot become authoritative because a developer finds it easier to edit the summary than the underlying owner.

### Candidate hard invariant O-08

**Derived projections are read-only with respect to canonical sources. Persisting a projection creates a provenance-bearing artifact, not a second owner of the projected state.**

## 12. Hypothetical worlds and proposal forecasts

Player-facing proposal evaluation will need to ask “what if?” without changing the real world.

Commit 2 requires the semantics:

```text
canonical state / explicit snapshot
+ hypothetical change
+ assumptions/model
→ forecast/projection
```

not:

```text
edit canonical state
calculate result
undo edit
```

and not:

```text
maintain a second authoritative proposed-policy world
```

A hypothetical evaluator may use the same authoritative domain logic where practical or a deliberately approximate forecast model where gameplay calls for imperfect government forecasting.

If approximate, its limitations become part of the forecast artifact's provenance/uncertainty.

### Candidate hard invariant O-09

**Hypothetical evaluation operates on isolated inputs/snapshots and produces projections. It cannot mutate or become a parallel authoritative copy of the live world.**

The exact snapshot/copy mechanism is deferred.

## 13. Election and office assignment

Commit 1 already separated election result from office/control transfer. Commit 2 establishes ownership consequences.

An election process may own:

- contest identity;
- candidates/eligible participants;
- ballots/votes/results;
- certification/procedural state;
- historical election record.

The current office assignment is owned separately by political/institutional state.

The player `ControlBinding` is separate again.

Thus:

```text
ElectionResult
    ≠ OfficeAssignment
    ≠ InstitutionalRecognition/Compliance
    ≠ ControlBinding
```

The ordinary GL0 route connects them causally through the applicable process, but no object is allowed to collapse them into one field.

## 14. Succession and information ownership

At an ordinary GL0 transfer:

- current world state remains with its existing canonical owners;
- historical records remain historical records;
- office assignment changes through the applicable political process;
- the outgoing `ControlBinding` ends only because its supported decision surface ceases to be available under resolved world state;
- the successor receives access to information according to canonical information ownership and transfer rules.

This means:

- a public statistical release remains public;
- an agency institutional record may remain available to the agency/new administration;
- a classified or confidential record follows its access/transfer semantics;
- a campaign's private poll does not become successor knowledge unless transferred or otherwise acquired;
- population beliefs continue existing independently of who controls the executive.

No “new administration” constructor may reset the country or deep-copy outgoing private knowledge into the new player's session.

## 15. History and career continuity

HistoricalRecord exists specifically so past political actions can remain real without contaminating current owners.

A future politician-career layer should be able to query actual world history such as:

- office assignments held;
- proposals sponsored;
- votes cast;
- laws enacted;
- claims made;
- appointments made;
- programs created;
- grants/projects generated;
- material consequences that later emerged;
- election outcomes.

The engine should not need a parallel achievement-style “career history” owner to remember facts already present in world history.

A product-facing biography may be a derived projection over those records.

## 16. Resolution and future deepening

A coarse V0 representation is acceptable when it owns the right truth.

Examples:

### State government

GL0 may begin with a thin state object that can evaluate participation, hold coarse capacity, and reference its constitutional/political structure.

Later Virginia can deepen by adding offices, legislature, judiciary, budget, agencies, elections, and local relationships under existing jurisdiction/political owners.

### Population

GL0 may use a tiny aggregate fixture.

Later richer correlation-preserving representation can refine `PopulationState` without moving people into district-owned or issue-owned stores.

### Geography

GL0 may use coarse spatial regions.

Later GeoCells can become finer while residence remains population-owned and boundaries remain geography-owned.

### Information

GL0 may contain a few reports/claims.

Later media organizations/channels can create and distribute artifacts without taking ownership of material truth or belief state.

### Candidate hard invariant O-10

**Increasing simulation resolution should refine the canonical owner and its internal representation. It should not require promoting a former projection/summary into a competing owner of the same truth.**

## 17. Explicit ownership traps

Commit 2 rejects these patterns:

```text
District.population = copiedPopulationState
```

Use a derived electorate/population query from map + geography + population.

```text
Poll.currentSupport = authoritativeSupport
```

Poll is an information artifact measuring underlying political state.

```text
Law.housingUnitsCreated = 50000
```

Law owns legal state; housing owns physical stock.

```text
Program.rent = newRent
```

Program supplies administrative/material inputs; housing owns rent response.

```text
Election.winner = currentPresident
```

Election result and office assignment remain distinct.

```text
CourtRuling.globalAllowed = false
```

Legal effect is scoped/contextual, not one universal boolean.

```text
Dashboard.approval = canonicalApproval
```

Dashboard displays a projection/measurement; it is not the state owner.

```text
newAdministration.knowledge = oldAdministration.knowledge
```

Information access follows provenance/ownership/transfer rules.

```text
Scheduler.pending = sourceOfTruthForAllFutureObligations
```

Domain-owned dates/obligations remain authoritative; scheduler may index them.

## 18. Commit-2 acceptance burden

Before Commit 3 derives detailed governmental primitives, reviewers should be able to answer yes to all of the following:

1. Every GL0 canonical fact has one obvious semantic owner or a clearly named Commit-3 internal split.
2. No projection, poll, dashboard, election record, history record, or `ControlBinding` silently owns world truth it merely represents.
3. Geography and population can deepen independently without duplicating people.
4. Electoral maps can change without moving/duplicating population.
5. Legal sources/orders can remain scoped/contested without one global `currentLegalEffect`.
6. Authorization, appropriation, financial execution, and material outcome cannot collapse into one “funded policy” state.
7. Program administration and material housing response remain causally linked but separately owned.
8. Information artifacts can be exact, wrong, stale, revised, public, private, or inaccessible without rewriting the underlying fact.
9. Hypothetical/proposal evaluation cannot mutate live canonical state.
10. Current state and historical truth are both persistent without becoming duplicate owners.
11. Low-resolution GL0 state can deepen later by refining existing owners rather than replacing them.

If a reviewer needs Commit-3 detail to name a final class but the semantic owner boundary is already unambiguous, that is **not** by itself a Commit-2 failure.
