# Living Country Step 2 — Common Country-State Grammar

Status: **LIVING-COUNTRY DESIGN CANDIDATE — PRESERVED FOR REVIEW. NOT ACCEPTED PRODUCT, ARCHITECTURE, DOMAIN, CALIBRATION, UI, ROADMAP, EARLY-ACCESS, SCHEMA, RUNTIME, OR IMPLEMENTATION AUTHORITY.**

Authority and evidence boundary:

- Accepted production baseline used by the assessment: `44c1724962830225e6fc34f41d0df0cfdb7dfec0`
- Entirely unaccepted Stage 1 candidate: `a7e04ca78ba1ccb06d8dc3a4dfb0d43389804144`
- Accepted Step 5 presidential-game authority: `2c5fc2d798c5fcc232b519052390b56d60f06267`
- Accepted Living Country Step 1 composite:
  - `11_LIVING_COUNTRY_LAYER_OWNERSHIP_CONTRACT.md`
  - as clarified and accepted by `12_LIVING_COUNTRY_STEP1_CLARIFICATIONS_AND_AUTHORITY.md`

This document defines the semantic interface that lets materially different domains participate in one coherent country.

It does **not** define a universal runtime class, data schema, base interface, event bus, generic domain object, formula library, or implementation package.

It does **not** choose:

- the final durable-domain inventory;
- the final split among economy, labor, income, prices, industry, trade, health, healthcare, energy, environment, infrastructure, crime, immigration, education, or other domains;
- domain-depth tiers;
- population/cohort implementation;
- final geographic resolution;
- cross-domain formulas;
- measurement formulas;
- exact numerical units for every future condition;
- January 2025 or January 2033;
- UI surfaces;
- Early Access scope;
- a roadmap or code increment.

---

# Evidence labels

- **[RF — Repository fact]**: already established by accepted repository architecture or assessment authority.
- **[ER — External research]**: supported by the official sources listed in Section 21.
- **[DI — Design inference]**: a proposed Living Country contract; not yet authority.
- **[UQ — Unresolved question]**: deliberately deferred.

---

# 1. Central question

Step 2 asks:

> **What must every durable material/social domain expose to participate in one coherent America without forcing materially different systems to share the same internal model?**

The answer is a **semantic participation grammar**.

It standardizes what another owner must be able to understand about a domain’s boundaries, facts, time, units, geography, population association, admitted inputs, emitted outputs, observation, uncertainty, and provenance.

It does not standardize the domain’s internal ontology merely for architectural neatness.

---

# 2. Interface, not universal schema

## 2.1 Core invariant

**[DI — HARD INVARIANT LC-G01] The common country-state grammar is an interoperability contract, not a universal material-domain schema.**

A domain must expose enough semantic information to participate in cross-domain causality, measurement, history, and player-facing projections.

A domain is not required to possess identical fields, update rules, entity types, formulas, state machines, or internal resolution.

Forbidden design shortcut:

```text
MaterialDomain {
  level: 72
  pressure: 41
  capacity: 63
  trend: -2
}
```

with Housing, employment, health, education, crime, and energy differing only by labels.

Required principle:

```text
shared semantic handshake
+ domain-specific internal truth and processes
```

## 2.2 Different domains must remain materially different

Housing may need:

- housing-unit stock;
- construction pipelines;
- vacancies;
- tenure and affordability exposure;
- land/permitting/construction constraints;
- local or metro geography.

Employment may need:

- employed, unemployed, and nonparticipating population associations;
- jobs and vacancies;
- hires, separations, entries, and exits;
- wages/hours;
- industry and occupation exposure;
- workplace and residence geography.

Energy may need:

- generation/storage/network assets;
- capacity and reliability constraints;
- production, consumption, import, export, and inventory flows;
- regional grids and transport bottlenecks;
- prices and outages.

Healthcare may need:

- coverage and program enrollment;
- provider/facility capacity;
- utilization/service flows;
- costs and payment flows;
- health or access outcomes;
- state/program variation.

The grammar must connect those systems without pretending their facts are interchangeable.

## 2.3 A semantic interface need not be one technical interface

**[DI — HARD INVARIANT LC-G02] No later implementation is required to create one `MaterialDomain<T>` class, one inherited base type, one giant table, or one universal update method merely because this contract uses common headings.**

The same semantic obligation may be satisfied through different implementation structures so long as ownership and interoperability remain auditable.

The common grammar exists for design, causal integrity, content review, testing, and player-legibility requirements.

## 2.4 Domain grouping is not fact ownership

A named domain may contain several fact owners or subdomains when semantic differences require it.

For example, a future “Economy” player-facing area may coordinate:

- labor-market facts;
- production/output facts;
- prices;
- income;
- firms/industries;
- trade;
- public finance interactions.

That does not require one `EconomyState` owner.

Conversely, splitting one coherent fact among several owners merely to match organizational charts is also invalid.

Fact meaning controls ownership.

---

# 3. Required domain declaration

Before a material/social domain can be accepted into Living Country, it must publish a design-level declaration answering the following.

## 3.1 Semantic purpose

- What real category of condition does the domain represent?
- Which presidential situations could require this distinction?
- Which conditions belong here rather than elsewhere?

## 3.2 Canonical fact boundary

- Which mutable facts does the domain own?
- Which closely related facts does it explicitly not own?
- Which facts are references to PopulationState, GeographyState, PoliticalOrder, organizations, or other material domains?
- Are there subowners inside the domain?

## 3.3 Native entity or accounting grain

- What kinds of things does the domain count or relate?
- Person/cohort?
- Household?
- Job?
- Establishment?
- Firm?
- Housing unit?
- Project?
- Facility?
- School?
- Hospital?
- Energy asset?
- Network segment?
- Geographic condition cell?
- Program enrollment?

A domain may use more than one grain.

## 3.4 Fact forms

Which of the following does the domain require?

- stocks;
- flows;
- events/transitions;
- rates/ratios;
- prices/indices;
- distributions/compositions;
- queues/pipelines;
- capacity/constraints;
- network/topology state;
- classifications/statuses;
- latent or not-directly-observable conditions.

No form is mandatory merely because it appears in this list.

## 3.5 Units and dimensions

- What are the native units?
- What denominators apply?
- What currency, price basis, index base, or physical unit applies?
- Are quantities additive across people, geography, or time?

## 3.6 Time semantics

- At what time does a stock apply?
- Over what interval does a flow apply?
- What cadence or event changes the state?
- What delays exist?
- What deadlines or effective periods matter?

## 3.7 Geography

- What is the native geographic resolution?
- Can state be aggregated upward exactly?
- Can it be disaggregated, and if so through what explicit assumptions?
- Do residence, workplace, service area, market area, network region, jurisdiction, and exposure area differ?

## 3.8 Population or entity association

- Who or what experiences the condition?
- How does the domain reference the one canonical ordinary population?
- When is an association direct, sampled, probabilistic, geographic, household-based, or institution-mediated?

## 3.9 Admitted inputs

- What can law, public finance, administration, states, firms, households, organizations, other domains, or external developments legitimately provide?
- What validation is required before the input can affect domain state?

## 3.10 Emitted outputs

- What quantities, events, classifications, or records may another owner legitimately consume?
- What does the output not mean?

## 3.11 Observation and measurement surface

- What parts of the domain can be observed directly?
- What requires measurement, sampling, reporting, investigation, or inference?
- Which owners can observe which portions?

## 3.12 Uncertainty and incompleteness

- What is stochastic in the world?
- What is merely unknown to an observer?
- What measurement error or coverage limits exist?
- What is intentionally omitted by the domain’s abstraction?

## 3.13 History and provenance

- Which occurrences must persist?
- What current state can be reconstructed or explained from them?
- Where may causal provenance terminate at a baseline-inherited root?

## 3.14 Calibration and initialization

- What source vintage and transformation initialize the domain?
- How are starting stocks, flows, rates, and constraints reconciled?
- When does calibration stop being live authority?

## 3.15 Resolution and deepening

- What is the coarsest valid representation?
- What conditions justify refinement?
- How does refinement preserve identity, totals, and history?

## 3.16 Presidential relevance and deletion test

- What later presidential decision would become impossible or materially less coherent if this distinction were deleted?
- If no supported answer exists, why is the fact being modeled?

---

# 4. Fact-form grammar

The grammar distinguishes common semantic forms because unit, time, aggregation, and coupling errors often come from treating them as interchangeable.

## 4.1 Stocks

A stock is state applying at a point or as-of boundary.

Examples may include:

- usable housing units at time T;
- employed population weight as of a reference time;
- enrolled population;
- generating capacity;
- inventory;
- debt balance;
- open cases;
- hospital beds or staffed service capacity;
- damaged infrastructure awaiting repair.

A stock must declare:

- unit;
- owner;
- as-of time;
- geographic/entity scope;
- whether it is additive;
- what flows or events can change it;
- whether reclassification or revaluation can change it without a physical inflow/outflow.

## 4.2 Flows

A flow occurs over an interval.

Examples may include:

- housing completions during a month;
- hires and separations during a month;
- wages paid over a period;
- tax receipts during a fiscal interval;
- electricity generated during an hour/day/month;
- patient visits during a period;
- migration during a period;
- incidents reported during a period.

A flow must declare:

- quantity unit;
- interval start/end or reference period;
- direction/source/destination where relevant;
- whether it accumulates into a stock;
- whether gross flows can offset each other in a net change.

**[ER]** BLS JOLTS separately measures job openings, hires, and separations because small net employment changes can coexist with substantial gross labor-market movement. The design lesson is that a domain should retain gross flows when they create materially different later situations rather than representing only a net trend.

## 4.3 Events and transitions

An event is a discrete occurrence.

Examples:

- plant closure decision;
- layoff announcement;
- project completion;
- outage;
- disaster damage;
- enrollment determination;
- facility opening;
- death, birth, arrival, departure, status change;
- threshold or network failure.

An event owns or references one canonical occurrence identity under the accepted Step 1 clarification.

An event is not automatically the current condition.

## 4.4 Rates and ratios

A rate/ratio relates quantities and must preserve its denominator and interval.

Examples:

- unemployment rate;
- vacancy rate;
- incidents per 100,000 population;
- service utilization per enrollee;
- annualized growth rate;
- debt service as a share of receipts.

A rate is not additive merely because its numerator is.

Weighted aggregation requires the appropriate denominator.

## 4.5 Prices, costs, and indices

A price or index must declare:

- what is priced;
- currency/unit;
- nominal or real basis;
- geographic/market scope;
- time/reference period;
- base period for an index;
- adjustment/measurement status where relevant.

A price index is not a stock of money.

A percentage price change is not a percentage-point change.

## 4.6 Distributions and compositions

Some conditions are defined by distribution rather than one mean.

Examples:

- wage distribution;
- rent burden by income/tenure;
- provider access by geography;
- energy exposure by industry;
- incident exposure by neighborhood/region;
- coverage by employment status.

A national average may be a projection over a distribution. It may not replace the distribution when heterogeneity creates different policies, actors, or presidential decisions.

## 4.7 Queues and pipelines

A queue/pipeline represents unresolved work or transition state.

Examples:

- housing projects under construction;
- benefit applications pending;
- rulemaking/review queue;
- grid interconnection queue;
- court or case backlog;
- infrastructure repair pipeline;
- immigration processing queue.

It must distinguish:

- entries;
- current stage;
- owner;
- throughput/capacity constraints;
- exits/completions/failures;
- aging/deadlines;
- whether ordering is legal, administrative, physical, or modeled.

A queue size is not itself a universal “pressure” score.

## 4.8 Capacity and constraints

Capacity describes potential or bounded ability under specified conditions.

Examples:

- construction throughput;
- staffed medical-service capacity;
- agency review throughput;
- grid transfer limit;
- shelter capacity;
- production capacity.

Capacity is distinct from:

- realized output;
- demand;
- utilization;
- backlog;
- quality;
- legal authority;
- funding.

A capacity quantity may be owner-scoped and numerical. It may not become a generic cross-domain action resource.

## 4.9 Network and topology state

Domains involving transport, energy, infrastructure, supply, migration, or information distribution may require networks.

Network state may include:

- nodes/assets;
- links;
- capacity;
- direction;
- condition;
- connectivity;
- geographic reference;
- flow state;
- failure/isolation.

No network representation is required merely because the real system has one. It is justified when topology changes supported outcomes or decisions.

## 4.10 Classifications and statuses

Status may matter independently of quantity.

Examples:

- insured/uninsured/underinsured according to defined rules;
- employed/unemployed/not in labor force;
- habitable/unusable housing;
- operational/degraded/failed infrastructure;
- compliant/noncompliant/pending program state.

Classification rules and effective times require provenance.

## 4.11 Latent conditions

A domain may own a condition that is not directly observable in full.

Examples might include:

- actual but unreported incidents;
- hidden physical deterioration;
- unobserved disease prevalence at the selected abstraction;
- actual firm distress before public disclosure;
- actual household hardship beyond measured surveys.

The simulation’s possession of latent state does not grant actors or the player access.

---

# 5. Units and dimensional integrity

## 5.1 Explicit-unit invariant

**[DI — HARD INVARIANT LC-G03] Every cross-owner quantity must carry enough semantic unit information to prevent invalid arithmetic or coupling.**

The required unit metadata depends on the fact but may include:

- physical/count unit;
- currency;
- nominal/real basis;
- price/index base;
- denominator;
- time interval;
- seasonality/measurement treatment where relevant to an artifact;
- geographic/entity scope.

Forbidden:

```text
EmploymentPressure = 72
HousingPressure = 64
EconomicPressure = average(...)
```

unless those are clearly labeled non-causal projections whose construction and limitations are explicit.

## 5.2 Counts, shares, rates, and percentage points

The grammar must distinguish:

- 100,000 people;
- 5 percent of a population;
- 5 percentage points;
- 5 percent growth;
- 5 cases per 100,000 people per year.

Those quantities cannot be substituted merely because all can be displayed as numbers.

## 5.3 Nominal and real monetary quantities

A monetary quantity must identify whether it is:

- current/nominal dollars;
- inflation-adjusted/real dollars;
- a price index;
- a budget-authority amount;
- an obligation;
- an expenditure/outlay;
- income or wealth;
- a forecast or measured value.

Conversion or deflation requires a declared method and reference period.

## 5.4 Physical units

Energy, infrastructure, emissions, transport, health services, construction, or other physical domains may require units such as:

- megawatt-hours;
- megawatts;
- barrels/volume/mass;
- passenger or freight movement;
- hospital visits;
- housing units;
- acreage;
- emissions mass;
- service hours.

The exact units remain domain-specific.

## 5.5 Unit conversion

A conversion is a causal/accounting transformation with provenance.

It must declare:

- source quantity/unit;
- conversion rule;
- assumptions or coefficients;
- target quantity/unit;
- time/geographic scope;
- uncertainty where relevant;
- owner of the transformation.

A UI conversion is a projection and cannot silently rewrite canonical storage.

## 5.6 Missing values are not zero

**[DI — HARD INVARIANT LC-G04] Unknown, unmeasured, unavailable, not modeled, not applicable, and zero are distinct states.**

A missing regional estimate cannot be treated as zero unemployment, zero illness, zero incidents, zero spending, or zero exposure.

---

# 6. Stock-flow and accounting integrity

## 6.1 Stock-change identity

Where accounting applies, a stock’s change over an interval must be explainable through declared flows and other admissible changes.

Conceptually:

```text
closing stock
= opening stock
+ inflows
- outflows
+ reclassifications
+ revaluations
+ other declared adjustments
```

Not every domain requires a strict conserved identity. When it does, the domain must say so.

## 6.2 Gross and net change

A small net change may conceal large offsetting gross flows.

Examples:

- employment little changed while hires and separations are both high;
- population stable while migration in and out is high;
- housing stock rises slightly while completions and demolitions both occur;
- energy inventory stable while production and consumption are large;
- caseload stable while entries and exits are high.

The domain retains gross flows when they affect:

- institutional workload;
- geographic exposure;
- program eligibility;
- uncertainty;
- political interpretation;
- later decisions.

## 6.3 Conservation and accounting scopes

Potentially conserved or reconciled quantities include:

- population weight;
- money within a defined accounting relationship;
- physical inventories;
- housing units through construction/conversion/demolition;
- energy balance;
- queue entries/exits;
- ballots and certified totals.

Conservation is always scope- and definition-specific.

A domain must not claim physical conservation for things that can be created, destroyed, reclassified, or measured differently without declaring those routes.

## 6.4 Double-counting prohibition

**[DI — HARD INVARIANT LC-G05] A cross-domain output may not be counted twice merely because two recipients or projections observe the same underlying change.**

Example:

A plant closure creates one canonical closure occurrence.

- Labor resolves job separations.
- Income consumes affected employment/earnings inputs.
- Public finance consumes changed taxable/eligibility inputs.
- Media reports the closure.

The closure is not independently re-applied by each story, workstream, or political issue projection.

## 6.5 Accounting estimate versus canonical transaction

An official national-account estimate or survey estimate may aggregate and reconcile observed inputs.

It remains a measurement/artifact unless the game deliberately models it as an exact institutional transaction record.

The measured estimate does not retroactively become the material truth it estimates.

---

# 7. Time grammar

## 7.1 Daily continuity does not require daily mutation

**[RF]** Step 5 accepts daily dated continuity plus event-driven presidential attention.

**[DI — HARD INVARIANT LC-G06] A domain must preserve dated causal order but is not required to execute one visible or internal update every calendar day.**

Valid temporal modes may include:

- exact-event transitions;
- continuous or analytically accumulated change;
- daily resolution;
- weekly resolution;
- monthly resolution;
- quarterly resolution;
- annual boundaries;
- irregular owner-triggered reconsideration;
- mixed modes inside one domain.

## 7.2 Required temporal fields

As applicable, a fact or transition must distinguish:

- effective/as-of time;
- observation interval;
- flow interval;
- decision time;
- execution time;
- completion time;
- release time;
- exposure/receipt time;
- deadline/expiration;
- scheduled reconsideration.

One timestamp cannot silently substitute for all of them.

## 7.3 State between updates

A domain must declare conceptually what current state means between explicit transitions.

Possible semantics include:

- piecewise constant until the next event;
- accumulated from declared flows;
- continuously evolving under a declared process;
- unresolved/pending until a boundary;
- measured only periodically while material state evolves separately.

## 7.4 Latency

Inputs may have delayed effects.

A domain must distinguish:

- immediate admission;
- implementation/start delay;
- material-response delay;
- maturation or persistence;
- measurement delay;
- political observation delay.

A law’s effective date, an agency rule’s completion, a project’s construction period, and a statistical release date are different owners and times.

## 7.5 Temporal aggregation

A monthly or quarterly output must identify the interval it summarizes.

Aggregating daily flows into a month is not the same as sampling a stock on the last day of the month.

A yearly average is not the same as year-end state.

## 7.6 Time-chunk consistency

Where the same domain processes the same dated inputs, advancing one day at a time or directly to the next relevant boundary should not create materially different canonical outcomes merely because the caller chose different chunk sizes.

This preserves the repository’s accepted deterministic/time-chunk doctrine while allowing stochastic outcomes to remain seeded and reproducible.

## 7.7 No universal update cadence

Employment measurement may update monthly; labor transitions may occur continuously or through event/interval processes.

Construction may progress through milestones over months.

Energy operation may require daily/hourly aggregation in selected stress periods while planning state changes more slowly.

Court processes follow filings and deadlines.

The common grammar does not force all domains into a monthly turn.

---

# 8. Geography grammar

## 8.1 Native geographic support

Every geographically varying fact must declare its native spatial support.

Examples:

- state/DC;
- county/local jurisdiction;
- congressional district;
- metro/commuting region;
- housing market;
- utility/grid region;
- watershed/environmental area;
- disaster footprint;
- service catchment;
- project site;
- facility/network segment;
- national market.

The exact inventory belongs to Step 3 and later domain work.

## 8.2 Political geography and material geography differ

A state boundary, congressional district, labor market, media market, grid region, housing market, and disaster footprint may overlap without being identical.

**[DI — HARD INVARIANT LC-G07] A domain may use the geography appropriate to its causal mechanism while preserving references and transformations to other geographic frames.**

## 8.3 Residence, workplace, service, and exposure locations

A person/cohort may:

- reside in one place;
- work in another;
- receive healthcare or education in another;
- consume media through a different market;
- be represented politically through a residence-based district;
- be affected by a regional network disruption.

One `location` field is insufficient when those distinctions create supported consequences.

## 8.4 Aggregation upward

A domain must state whether aggregation is:

- exact summation;
- denominator-weighted rate aggregation;
- distribution aggregation;
- network-derived;
- modeled/estimated;
- invalid without additional assumptions.

National totals or averages are projections unless the domain genuinely owns a national fact at native resolution.

## 8.5 Disaggregation downward

**[DI — HARD INVARIANT LC-G08] Coarse state may not be divided into local state as though the local distribution were known.**

Disaggregation requires:

- a declared allocation model or source;
- uncertainty;
- preserved aggregate consistency where applicable;
- a label that it is modeled rather than observed truth.

## 8.6 Cross-boundary flows

Domains involving migration, commuting, trade, energy, transport, healthcare service, disaster evacuation, or pollution may require origin/destination relationships.

A cross-boundary flow must preserve:

- origin;
- destination;
- interval;
- unit;
- route/network where relevant;
- whether the flow changes stocks in one or both places.

## 8.7 Boundary changes

Geographic boundary change, electoral reassignment, jurisdictional authority change, and population movement remain distinct.

A redistricting change does not move people.

A resident move does not redraw a boundary.

A material market region changing does not automatically alter legal jurisdiction.

---

# 9. Population and entity association grammar

## 9.1 One-population invariant

**[RF]** Step 1 accepts one canonical ordinary-population identity/weight/residence/political representation.

**[DI — HARD INVARIANT LC-G09] A domain associates facts with that population through references, keyed distributions, geographic exposure, household/entity relationships, or other declared links. It may not create its own independently mutable copy of the people.**

## 9.2 Population linkage does not determine fact ownership

Employment status may remain Labor-domain truth.

Income may remain Income/Household-Finance truth.

Coverage may remain Health/Healthcare truth.

Housing tenure or exposure may remain Housing truth.

Political belief remains recipient-owned population state.

All may refer to the same population identity without migrating into PopulationState.

## 9.3 Domain-native entities

Not every material fact belongs directly to a person/cohort.

A domain may own facts about:

- jobs;
- establishments;
- firms;
- housing units;
- projects;
- facilities;
- schools;
- hospitals;
- energy assets;
- network links;
- vehicles/infrastructure;
- legal/program cases;
- parcels/areas;
- environmental systems.

Population exposure may be derived through relationships to those entities.

## 9.4 Household question remains open

**[UQ]** A future household representation may be necessary for income, Housing, taxes, benefits, healthcare coverage, and consumption.

Step 2 does not decide whether households are:

- explicit canonical entities;
- weighted relationship structures;
- domain-local projections over population;
- a hybrid.

It only requires that no household representation duplicate population identity or create incompatible people.

## 9.5 Exposure versus status

A population unit may be associated with:

- a status it possesses;
- an event it experienced;
- a geographic condition;
- a service or program relationship;
- a probability or share of exposure under aggregation;
- direct material experience;
- indirect economic exposure.

Those associations need distinct semantics.

Being resident in a high-unemployment region is not identical to being unemployed.

Being eligible for a program is not identical to being enrolled or paid.

Living in a media market is not identical to seeing a story.

## 9.6 Cohort refinement trigger

A population/cohort distinction is justified only when an accepted or candidate process consumes it to produce a materially different outcome, observation, actor decision, public response, or presidential situation.

Forbidden:

- splitting every demographic dimension because data exists;
- creating one cohort for every Cartesian combination;
- refining for dashboard detail only.

## 9.7 Conservation through refinement

Where weighted population units split or merge:

- total represented population must reconcile;
- residence and other conserved facts must remain consistent;
- domain associations must map without duplication;
- political/information state must not be reset;
- uncertainty created by the transformation must be declared where relevant.

The exact representation remains Step 3 work.

---

# 10. Admitted-input grammar

## 10.1 Input is not direct mutation authority

**[DI — HARD INVARIANT LC-G10] Another owner may submit or make available a legitimate input. The receiving domain owns whether and how that input changes its canonical state.**

Examples:

- enacted legal rules constrain or enable behavior;
- appropriations and payments supply resources;
- agency decisions create administrative eligibility or program conditions;
- firm decisions change planned production or employment attempts;
- population behavior changes demand or participation;
- another material domain emits a price, quantity, event, or constraint.

No input means “set target outcome to desired value.”

## 10.2 Required input semantics

An admitted input must carry, as applicable:

- source owner;
- source record/identity;
- semantic type;
- value/event/status;
- unit and denominator;
- effective/as-of time or interval;
- geographic scope;
- population/entity scope;
- authority or causal basis;
- duration/expiration;
- uncertainty/confidence where the input itself is uncertain;
- whether it has already been consumed;
- provenance root.

This is a semantic checklist, not a mandated serialized envelope.

## 10.3 Validation by receiving owner

The receiver may reject, defer, transform, queue, or partially admit an input because:

- units are incompatible;
- timing is outside applicability;
- geography does not overlap;
- legal/administrative prerequisite is absent;
- source identity is stale or duplicated;
- capacity/constraint prevents immediate effect;
- uncertainty or incompleteness requires another process;
- the input is only a claim or measurement rather than material truth.

## 10.4 Continuing versus one-time inputs

A one-time payment, continuing tax rule, ongoing price condition, dated disaster event, persistent court order, and monthly flow are not interchangeable.

The input must specify whether it is:

- occurrence;
- continuous condition;
- periodic flow;
- standing rule/constraint;
- time-bounded authorization;
- expectation/forecast;
- measurement artifact.

## 10.5 Idempotence and duplicate protection

A repeated delivery of the same canonical input cannot automatically apply the material effect twice.

Example:

- one payment occurrence may be referenced by a program, project, audit, story, and workstream;
- it remains one payment.

The receiving domain must use canonical identity/provenance to distinguish a new input from another reference to the same input.

---

# 11. Emitted-output grammar

## 11.1 Output ownership

A domain emits facts, events, constraints, or observable records that it owns.

The output may be consumed elsewhere without transferring ownership.

Examples:

- Labor emits employment-status changes, separations, vacancies, wage or hours conditions at supported resolution.
- Housing emits completions, demolitions, usable stock, vacancy or affordability conditions.
- Energy emits supply, price, outage, reliability, and network constraints.
- Health emits coverage, utilization, provider capacity, cost, or health outcomes at supported resolution.

## 11.2 Required output semantics

An output must declare, as applicable:

- source owner and identity;
- fact/event type;
- unit/denominator;
- time/as-of/interval;
- geography;
- population/entity association;
- whether it is current state, an occurrence, or a projection;
- uncertainty/model resolution;
- admissible consumers or general meaning;
- explicit non-meaning.

## 11.3 Outputs are not universal effects

Forbidden:

```text
LaborOutput: ECONOMY_WORSE by 4
```

Preferred:

```text
separations increased in specified industries/regions during interval
employment stock changed at reference boundary
average hours or wage conditions changed under declared units
```

The receiving domain then applies its own transformation.

## 11.4 No compulsory political output

A material domain does not have to emit:

- public salience;
- approval;
- media attention;
- incumbent credit;
- election effect.

Those arise through observation, actors, information, and recipient political state.

## 11.5 Quiet-output possibility

A domain may change and emit no immediately observable or politically consequential artifact.

The country is allowed to contain serious but hidden, diffuse, weakly organized, or poorly measured conditions.

---

# 12. Cross-domain handshake

Step 6 will define full coupling. Step 2 establishes the minimum valid handshake.

## 12.1 Typed handoff

```text
source owner produces canonical output or occurrence
→ output carries unit, time, geography, population/entity scope, and provenance
→ receiving owner validates/adapts it
→ receiving process changes only receiver-owned state
→ resulting occurrence and downstream outputs are recorded
```

## 12.2 Sender and receiver responsibilities

The sender owns:

- truth of its output;
- source timestamp/interval;
- units;
- scope;
- provenance.

The receiver owns:

- whether the output is relevant;
- any conversion/adaptation;
- timing of its response;
- resulting receiver-owned mutation;
- uncertainty introduced by transformation.

## 12.3 Shared upstream cause versus direct coupling

Two domains may change because of one upstream cause without one causing the other.

Example:

- an external energy shock may affect both industrial costs and household prices;
- this does not imply household prices caused industrial contraction or vice versa.

A coupling claim must distinguish:

- direct transfer;
- mediated transfer;
- shared cause;
- statistical correlation;
- actor interpretation.

## 12.4 Conversion/adaptation process

When an output’s native geography, time, unit, or entity grain differs from the receiver’s needs, an explicit adaptation process is required.

Examples:

- workplace-region job losses mapped to residence-based household exposure;
- hourly energy prices summarized to monthly household bills;
- state enrollment changes mapped to federal outlays;
- project-level housing completions aggregated to a regional stock.

The adaptation may be exact or estimated. Its status must be declared.

## 12.5 No universal effect bus

A technical event bus may later transport messages.

It must not create semantic shortcuts such as:

```text
Effect(type="INFLATION", magnitude=7)
```

consumed identically by every domain.

The grammar standardizes meaning, not one generic “effect” payload.

---

# 13. Observation surface

Step 7 will design measurement in depth. Every domain must nevertheless expose a bounded observation surface.

## 13.1 Actual state versus possible observations

The domain must distinguish:

- canonical state;
- direct authoritative records;
- direct operational observation;
- sampled measurement;
- administrative reporting;
- private estimate;
- investigation-discovered evidence;
- forecast;
- public claim.

## 13.2 Observation capability declaration

For each load-bearing fact, the domain should identify conceptually:

- whether it can be observed directly;
- which actors/institutions have access;
- whether an observation is exact, sampled, modeled, delayed, or partial;
- what reference period applies;
- whether the observation can be revised;
- whether non-reporting or concealment is possible.

## 13.3 Domain does not own external measurement artifacts

The domain may make records available or participate in measurement.

MeasurementProcess and InformationEnvironment own captured measurement state and resulting artifacts according to accepted architecture.

## 13.4 Observability is not political importance

A highly measurable condition may be politically ignored.

A poorly measured condition may become politically salient through direct experience, local reporting, organization activity, or visible institutional conflict.

No observation field may double as a universal issue score.

---

# 14. Uncertainty grammar

## 14.1 Distinct uncertainty classes

The design must distinguish:

### World/process uncertainty

Unresolved future outcomes or stochastic processes inside the modeled world.

### Actor epistemic uncertainty

What a person, organization, institution, or administration does not know about current/past reality.

### Measurement uncertainty

Sampling error, coverage limits, revisions, methodology, lag, or estimation error.

### Forecast uncertainty

Uncertainty about future outcomes under assumptions.

### Abstraction/model limitation

What the game does not represent at the selected resolution.

These are not interchangeable.

## 14.2 Canonical truth versus player uncertainty

The simulation may possess exact canonical state at its selected abstraction while the President remains uncertain.

A player-facing confidence interval or staff assessment does not imply that canonical state itself is probabilistic.

Conversely, a domain may legitimately represent distributions or stochastic transitions where aggregation requires them.

## 14.3 No false precision

A domain should not expose precision beyond its representation, source, or measurement.

Examples:

- a modeled local estimate should not appear as an exact headcount;
- an aggregated cohort should not imply exact individual histories;
- a quarterly estimate should not be shown as exact daily truth;
- a forecast should not become a guaranteed option outcome.

## 14.4 Unknown/hidden state may persist

A condition may remain materially real but politically undiscovered.

The absence of an observation does not mean the condition is absent.

The absence of a presidential attention item does not mean the game failed to update.

---

# 15. History and provenance grammar

## 15.1 Current fact explanation

For every load-bearing current state, the domain should be able to answer:

- what is true now;
- when that fact applies;
- which owner holds it;
- which admitted inputs and internal transitions created it;
- which occurrences persist;
- whether the causal chain terminates at a baseline root.

## 15.2 Occurrence identity

The accepted Step 1 clarification controls:

- each occurrence has one canonical identity;
- either HistoricalRecord or a declared domain/procedure family owns it;
- the other may index/reference;
- no duplicate occurrence authority.

## 15.3 History need not be full replay log

The design may compress routine intermediate transitions when they do not affect supported current state, institutional action, observation, political memory, or presidential decisions.

It must preserve load-bearing history such as:

- major state transitions;
- policy/program inputs;
- significant material events;
- measurements and revisions;
- actor/institution decisions;
- unresolved queues/obligations;
- causal roots needed by current projections.

## 15.4 Provenance roots

Step 1 accepts four candidate root classes for later calibration work:

- baseline-inherited;
- generated backstory;
- forward-generated;
- player-era.

Step 2 requires the domain grammar to support those roots but does not choose a calibration seam.

## 15.5 Historical correction

A later revised measurement, corrected record, or discovered error creates a new occurrence/artifact or an explicit correction relationship.

It does not silently rewrite unrelated material history or past actor knowledge.

---

# 16. Calibration and initialization grammar

## 16.1 Initialization package

A domain’s starting state should identify:

- source/vintage;
- coverage;
- transformation method;
- units;
- geography;
- population/entity mapping;
- reference date/interval;
- uncertainty/known gaps;
- reconciliation checks;
- scenario/configuration identity.

## 16.2 Calibration stops being live owner

**[RF]** Step 1 accepts that calibration initializes and then ceases to own changing current state.

A later real-world data release cannot overwrite a running alternate-history world unless a new scenario migration explicitly does so outside ordinary play.

## 16.3 Starting stock-flow reconciliation

A starting state should avoid contradictions such as:

- stock inconsistent with recent declared flows;
- population associations exceeding represented population;
- geographic totals disagreeing without a declared estimation gap;
- fiscal obligations incompatible with authority;
- housing units existing without location/status;
- energy consumption exceeding supply plus inventory/import relationships under the chosen abstraction.

Not every domain requires full historical reconstruction to initialize. It requires a coherent state with provenance.

## 16.4 Calibration residuals

When source systems do not reconcile perfectly, the design must choose transparently among:

- adjustment/residual item;
- uncertainty interval;
- scoped omission;
- explicit non-comparability;
- model-based reconciliation.

It may not silently force incompatible data into false precision.

---

# 17. Resolution, aggregation, and deepening

## 17.1 Coarse state is legitimate when it owns the right fact

A domain may begin with structured aggregate state rather than micro-simulation.

The question is whether its abstraction supports required:

- material differences;
- actor decisions;
- coupling;
- measurements;
- political pressure;
- presidential options.

## 17.2 Refinement trigger

Refinement is justified when the coarser state cannot preserve a distinction needed for:

- a materially different outcome;
- an autonomous action;
- a legal/program determination;
- geographic/population exposure;
- a measurement;
- uncertainty;
- a later presidential decision.

## 17.3 Refinement within owner

A coarse owner may deepen through:

- additional subentities;
- finer geography;
- richer distributions;
- explicit queues/pipelines;
- more detailed network state;
- more detailed transition processes.

It should not create a second canonical domain containing the same fact at finer resolution.

## 17.4 Coarse/fine consistency

A refinement must define:

- how coarse totals map to fine state;
- what is exact versus estimated;
- which quantities conserve;
- what new uncertainty is introduced;
- how existing references/history remain valid;
- how aggregation back to the previous view behaves.

## 17.5 No false reverse inference

A national total does not uniquely determine local or population detail.

A finer state may be initialized from a model, but that modeled distribution cannot be mislabeled as previously observed truth.

## 17.6 Resolution may vary over time and space

A domain may use more detail:

- in selected project areas;
- during a crisis;
- for politically/materially important firms or facilities;
- where measurement exists;
- where an accepted process requires individualization.

Selective refinement must still preserve totals, identity, and uncertainty.

---

# 18. Domain contrast demonstrations

These are **interface demonstrations**, not accepted domain designs or depth assignments.

They show that the same grammar can support materially different internals.

## 18.1 Housing

Potential native facts:

- stock: usable housing units by type/tenure/region;
- pipeline: permitted, financed, under-construction, completed, usable;
- flows: starts, completions, conversions, demolitions;
- conditions: vacancies, rents/cost burden, affordability exposure;
- constraints: land, permitting, construction labor/material capacity;
- geography: local/metro/state/project catchment;
- population association: household/tenure/income/geographic exposure;
- observations: permits, completions, surveys, rents, local reports;
- outputs: usable units, housing costs, displacement/exposure, construction demand.

Housing does not need a generic `pressure` field to interoperate.

## 18.2 Employment and labor

Potential native facts:

- stocks: employed, unemployed, not in labor force at supported population resolution; jobs/vacancies where distinct;
- flows: hires, separations, layoffs, quits, entries/exits;
- conditions: wages, hours, occupation/industry composition;
- entities: people/cohorts, jobs, establishments, firms/industries;
- geography: residence, workplace, commuting region, state;
- observations: household and establishment surveys, administrative claims, firm announcements;
- outputs: earnings/employment exposure, taxable payroll/income inputs, program eligibility, healthcare-coverage coupling, production constraints.

Employment and jobs are related but not automatically identical stocks.

## 18.3 Health and healthcare

Potential native facts:

- stocks/statuses: coverage/enrollment, provider/facility capacity, selected health/access condition;
- flows: enrollment changes, claims/payments, service utilization, admissions/discharges;
- constraints: provider availability, staffing, eligibility, geographic access;
- entities: population, households, insurers/programs, facilities/providers where needed;
- geography: state, service area, provider market, rural/urban accessibility;
- observations: administrative enrollment, claims, surveys, facility reports;
- outputs: household cost exposure, public/private fiscal demand, workforce effects, capacity constraints, measured health/access outcomes.

Coverage, healthcare utilization, healthcare spending, and health status must not collapse into one score.

## 18.4 Energy

Potential native facts:

- stocks: generation capacity, storage/inventory, infrastructure condition;
- flows: generation, consumption, fuel supply, imports/exports;
- network state: regional transfer constraints, outages, bottlenecks;
- prices: wholesale/retail/fuel prices with unit/time/region;
- entities: assets, operators/firms, regions, industries/households as consumers;
- geography: grid/market/transport region rather than only state;
- observations: operational records, market reports, outage notices, official statistics;
- outputs: prices, reliability, industrial input costs, household exposure, emissions/environmental inputs, national-security/trade exposure.

Megawatts of capacity and megawatt-hours of generation are not interchangeable.

## 18.5 Public safety

Potential native facts:

- flows: incidents, reports, arrests or calls at supported abstraction;
- stocks: open cases, incarcerated/custodial populations where modeled, damaged/public-safety conditions;
- constraints: staffing, court/correction capacity, emergency-response availability;
- geography: local jurisdiction/neighborhood/region;
- observations: reports, surveys, administrative records, local journalism;
- outputs: direct population experience, institutional workload, local/state fiscal pressure, public belief inputs after observation.

Reported incidents and actual incidents may differ.

## 18.6 Public finance

Potential native facts:

- stocks: cash/debt/balances/remaining authority where semantically applicable;
- flows: receipts, outlays, borrowing, transfers;
- legal/accounting statuses: authorization, appropriation, obligation, disbursement;
- intervals: fiscal year, daily transactions, multiyear authority;
- entities: Treasury, funds/accounts/programs/institutions;
- observations: official statements, budget projections, audits;
- outputs: available authority/resources, debt-service burden, program payments, fiscal constraints.

Public finance already has accepted semantic separation in the repository and demonstrates why a common grammar cannot replace domain-specific accounting.

## 18.7 Contrast conclusion

All examples can expose:

- ownership;
- units;
- time;
- geography;
- population/entity relationships;
- inputs/outputs;
- observations;
- provenance.

They do **not** share one internal state model.

---

# 19. Quiet-state and non-drama contract

## 19.1 Serious conditions may remain unpoliticized

**[DI — HARD INVARIANT LC-G11] Material severity does not guarantee measurement, reporting, organization, public salience, or presidential attention.**

A valid quiet path is:

```text
serious condition exists and evolves
→ timely measurement is absent, delayed, or ambiguous
→ affected populations experience it locally
→ organizations remain weak or fragmented
→ local reporting may exist but national media does not adopt it
→ no valid White House receipt/escalation occurs
→ no presidential interruption occurs yet
```

The country continues coherently.

Later evidence, organization, measurement, litigation, state action, or journalism may expose it.

## 19.2 No drama quota

No system may require:

- one major issue per month;
- one scandal per term;
- one crisis to replace every quiet period;
- national coverage of every severe condition;
- presidential attention simply to maintain pacing.

Gameplay cadence comes from actual observable conflicts and opportunities under Step 5, not from a country-state story director.

## 19.3 Quiet does not mean inert

During a quiet political period:

- material conditions may change;
- firms and households may act;
- agencies may operate;
- measurements may accumulate;
- local institutions may respond;
- historical state continues.

The absence of a presidential decision is not the absence of simulation.

---

# 20. Anti-ontology and falsification tests

A proposed domain grammar or domain design fails if any of the following is true.

## 20.1 Generic-meter failure

The domain’s load-bearing state can be reduced to interchangeable 0–100 level/pressure/capacity fields shared with unrelated domains.

## 20.2 Interface-as-schema failure

The project creates one universal technical domain class because the design document used common headings.

## 20.3 Unitless-coupling failure

A cross-domain effect lacks units, denominator, time, geography, or population/entity scope necessary to interpret it.

## 20.4 Stock-flow failure

The design adds a flow to a stock without an interval/accounting process or treats a stock snapshot as a flow.

## 20.5 Net-only failure

A net change is retained while gross flows that create different institutional or political consequences are discarded without justification.

## 20.6 False-disaggregation failure

National/state data is spread across local areas or cohorts as if observed, without a model, uncertainty, or aggregate reconciliation.

## 20.7 Geography-collapse failure

Residence, workplace, political jurisdiction, service catchment, market region, and network geography are treated as one location despite supported consequences.

## 20.8 Duplicate-population failure

A domain creates its own mutable economic people, patients, renters, audiences, beneficiaries, or voters rather than associating facts with the canonical population.

## 20.9 Policy-outcome failure

Law, spending, administrative intent, or program status directly sets a material result.

## 20.10 Measurement-alias failure

A report, poll, or official estimate is a live alias of current canonical state or rewrites the domain to match the estimate.

## 20.11 Calibration-shadow failure

Baseline data continues overwriting a running world after initialization.

## 20.12 Missing-equals-zero failure

Unknown, unavailable, not applicable, and unmodeled values silently become zero.

## 20.13 Double-count failure

The same occurrence/output is applied more than once because several systems, stories, or projections reference it.

## 20.14 Universal-cadence failure

Every domain is forced into the same daily/monthly update cycle for convenience.

## 20.15 Event-as-current-state failure

A historical occurrence record becomes the only owner of what remains true now.

## 20.16 Quiet-path failure

A severe condition automatically creates a national issue or presidential stop without a valid observation and actor route.

## 20.17 Dashboard-only failure

A variable exists only because it would make a useful chart and no world process consumes or produces it.

## 20.18 Generic-engine failure

An abstraction is added primarily for hypothetical future countries rather than the demonstrated U.S. game.

## 20.19 Bespoke-isolation failure

A domain invents an entirely disconnected causal pipeline even though typed inputs/outputs and the common grammar could connect it.

## 20.20 False-unification failure

A domain is forced into generic meters or identical processes even though its real mechanism requires a distinct internal model.

---

# 21. External methodological grounding

These sources do not dictate the game’s ontology. They support specific semantic disciplines.

## 21.1 System of National Accounts 2025

**[ER]** The United Nations describes the SNA as an integrated, consistent framework of concepts, definitions, classifications, and accounting rules. The 2025 SNA includes a foundational chapter specifically addressing flows, stocks, and accounting rules.

Sources:

- https://unstats.un.org/unsd/nationalaccount/sna.asp
- https://unstats.un.org/unsd/nationalaccount/sna2025.asp
- https://unstats.un.org/unsd/nationalaccount/SNAUpdate/2025/chapters.asp

**[DI lesson]** Living Country should borrow the discipline of explicit stocks, flows, units, institutional scope, and accounting reconciliation where applicable. It should not import the entire SNA as game ontology or imply that every social domain is a national-account transaction.

## 21.2 BEA NIPA Handbook

**[ER]** The Bureau of Economic Analysis describes the NIPA Handbook as documenting fundamental concepts, definitions, classifications, accounting framework, source data, and estimating methods used for U.S. national accounts.

Source:

- https://www.bea.gov/resources/methodologies/nipa-handbook

**[DI lesson]** A model can separate economic concepts, source data, transformations, and measured estimates. Official measured aggregates should not become an unexplained direct copy of simulation truth.

## 21.3 BLS labor-flow and measurement examples

**[ER]** BLS JOLTS publishes job-opening, hiring, and separation estimates by time, geography, ownership, and industry, with preliminary and benchmark revisions. BLS also explains that relatively small net changes in employment can coexist with large gross movements among employment, unemployment, and nonparticipation.

Sources:

- https://www.bls.gov/opub/hom/jlt/home.htm
- https://www.bls.gov/cps/cps_flows.htm
- https://www.bls.gov/ces/methods-overview.htm

**[DI lesson]** Employment cannot be assumed to be one trend value. Stocks, gross flows, classifications, measurement methods, cadence, geography, and revisions may all matter differently. This is an example of domain-specific internals satisfying a common semantic grammar.

---

# 22. Domain participation checklist

A later domain candidate should be reviewable through this compact checklist.

| Requirement | Question |
|---|---|
| Purpose | What presidential/material distinction justifies this domain? |
| Owner | Who owns each mutable fact? |
| Exclusions | Which nearby facts remain elsewhere? |
| Native grain | What entities or accounting units exist? |
| Fact forms | Stocks, flows, events, rates, prices, distributions, queues, networks, statuses? |
| Units | What units, denominators, bases, and scopes apply? |
| Time | As-of times, intervals, cadence, delays, effective periods? |
| Geography | Native support and valid aggregation/disaggregation? |
| Population association | How are people/cohorts referenced without duplication? |
| Inputs | What typed owner-produced inputs are admissible? |
| Internal transition | Which owner-specific process changes state? |
| Outputs | What typed facts/events can other owners consume? |
| Observation | What can be measured, recorded, reported, investigated, or directly experienced? |
| Uncertainty | World, measurement, forecast, actor, and abstraction limits? |
| History | Which occurrences and provenance chains persist? |
| Calibration | How is starting state initialized and reconciled? |
| Resolution | How can the representation deepen without ownership migration? |
| Quiet path | Can the domain evolve without automatic issue generation? |
| Deletion test | What later decision becomes worse or impossible if this distinction is removed? |

A domain that cannot answer these questions is not ready for depth-tier assignment.

---

# 23. Step 2 review gate

The Step 2 audit should answer:

> **Does the proposed common country-state grammar make material/social domains interoperable through explicit ownership, units, stock/flow semantics, time, geography, population/entity association, typed inputs/outputs, observation, uncertainty, calibration, and provenance—without forcing different domains into one generic internal schema or allowing bespoke isolated pipelines?**

## PASS requires

- the grammar is explicitly an interface, not a technical base schema;
- every cross-owner quantity can preserve units, time, geography, and entity/population scope;
- stocks, flows, events, rates, prices, distributions, queues, capacity, and network state remain semantically distinct;
- missing/unknown/unmodeled is not zero;
- domains may update at different cadences while preserving dated order;
- one population can be associated with many domain-owned facts without duplication;
- sender and receiver ownership remain separate at cross-domain handoffs;
- measurements and artifacts remain separate from canonical material truth;
- calibration initializes rather than shadow-owning live state;
- refinement deepens an owner rather than creating another owner;
- quiet material change can occur without automatic media, issue, or presidential attention;
- Housing, employment, healthcare, energy, public safety, and public finance can satisfy the interface while retaining different internal mechanics;
- deletion/compression tests remain enforceable.

## REVISE if

- common headings imply one generic domain object;
- unitless effect magnitudes remain sufficient for coupling;
- time and stock/flow semantics are optional when causally load-bearing;
- national averages can substitute for heterogeneous state without justification;
- population duplication is needed to make domains work;
- every domain needs the same update cadence;
- a measurement is treated as material truth;
- quiet conditions automatically become political issues;
- domain-specific difference is either erased or isolated into non-interoperable bespoke pipelines.

---

# 24. Remaining unresolved questions

Step 2 deliberately leaves open:

1. the final population/cohort/household representation;
2. exact geographic primitives and resolution;
3. the final domain inventory and ownership splits;
4. which couplings require conservation/accounting identities;
5. exact measurement institutions and methods;
6. exact state-transition mathematics;
7. stochastic versus deterministic rules by domain;
8. owner-specific capacity representations;
9. exact calibration sources and reconciliation procedures;
10. exact historical retention/compression rules;
11. domain-depth tiers;
12. media/public-belief depth;
13. State-of-the-Nation projections;
14. 2025/2033 dates;
15. implementation structure.

---

# Final Step 2 candidate verdict

The common grammar should be understood as:

> **A shared causal handshake, not a shared internal body.**

Every material/social domain must be able to explain:

```text
what it owns
what its quantities mean
when and where they apply
who or what experiences them
what inputs it can legitimately admit
what outputs it can legitimately emit
what can be observed
what remains uncertain
how current state arose
how greater resolution can be added safely
```

Housing, employment, healthcare, energy, public safety, public finance, and later domains should remain materially different.

They become one country because their identities, units, times, geography, population associations, typed causal handoffs, observations, and histories can be reconciled—not because they share generic 0–100 meters.

The next Living Country step, if this candidate passes review, is:

> **Evaluate the one-population and multi-geography substrate required to support these interfaces without cohort explosion, fake disaggregation, or duplicated people.**
