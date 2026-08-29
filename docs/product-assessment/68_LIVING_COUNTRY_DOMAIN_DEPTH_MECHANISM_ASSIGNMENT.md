# Living Country Step 13 — Domain-Depth Assignment by Mechanism

Status: **LIVING-COUNTRY STEP-13 DESIGN CANDIDATE — PRESERVED FOR DETACHED REVIEW. NOT ACCEPTED PRODUCT, ARCHITECTURE, DOMAIN-ALGORITHM, EARLY-ACCESS, UI, ROADMAP, SCHEMA, RUNTIME, DATASET, OR IMPLEMENTATION AUTHORITY.**

Authority and evidence boundary:

- Accepted production baseline: `44c1724962830225e6fc34f41d0df0cfdb7dfec0`
- Accepted Step 5 presidential-game authority: `2c5fc2d798c5fcc232b519052390b56d60f06267`
- Accepted Living Country Steps 1–12 authority, culminating in:
  - `67_LIVING_COUNTRY_STEP12_GENERATED_PREHISTORY_REQUIREMENTS_AUTHORITY.md`
  - accepted Step 12 tip before this candidate: `b201f82157e56a0dbfcf07236a534e00b5e94082`

This is Living Country **Step 13**. It answers:

> **Which United States mechanisms and owned state require core-causal, structured-condition, contextual, or bounded-external/shock depth to support the accepted presidential game, cross-domain causality, generated prehistory, and player-start explanation—without assigning one fidelity tier to an entire policy label, hiding load-bearing causality inside a contextual system, or building every American policy area as a bespoke deep simulation?**

This candidate does **not**:

- choose Early Access domain count;
- choose implementation order or roadmap;
- design formulas, data structures, update algorithms, actor AI, or UI;
- choose January 2029 or January 2033 as the player start;
- prove a generated-prehistory implementation;
- build source/calibration packages;
- modify runtime, schema, source, data, configuration, tests, or production files.

---

# Evidence labels

- **[RF — Repository fact]**: established by accepted repository authority or frozen production evidence.
- **[ER — External research]**: supported by an official or primary source listed in Section 31.
- **[DI — Design inference]**: proposed Step 13 contract requiring detached review.
- **[UQ — Unresolved question]**: deliberately deferred.

A proposed depth assignment is not repository fact merely because it is written here.

---

# 1. Executive verdict

## 1.1 Central answer

**[DI]** The Living Country should assign depth at the level of **mechanisms and owned state**, then summarize each policy domain as a mixed profile.

The accepted conceptual tiers should mean:

1. **Core causal** — the mechanism must own and endogenously resolve load-bearing state transitions, path dependence, and repeated cross-domain effects required by supported presidential gameplay and generated history.
2. **Structured condition** — the mechanism must own evolving canonical state and receive/emit typed inputs, but may use substantially coarser internal structure than a core mechanism.
3. **Contextual** — the mechanism needs bounded canonical or modeled condition state sufficient to constrain institutions, produce evidence, and support political interpretation, but its internal causal detail is not required to resolve load-bearing downstream outcomes in the current product contract.
4. **Bounded external/shock** — the source may originate outside the domestically simulated causal interior, but eligibility, timing, scope, uncertainty, and typed domestic handoffs are explicit; downstream domestic consequences return to normal Living Country owners.

A single policy label may contain mechanisms at several tiers simultaneously.

Example:

```text
EDUCATION
  K–12 enrollment and public finance          → STRUCTURED
  educator workforce/capacity                 → STRUCTURED
  long-run attainment/outcomes                → CONTEXTUAL
  federal student-aid/loan obligations        → CORE where supported
  one active federal grant program            → exact administrative process over structured material state
```

Therefore this is rejected:

```text
Education = CONTEXTUAL
```

when the game later depends on exact federal student-loan balances, payments, state fiscal flows, or active federal implementation.

## 1.2 Tiers describe causal burden, not amount of code

**[DI — HARD INVARIANT LC-DEPTH01] A higher tier means stronger semantic obligations, not automatically more variables, more entities, higher update frequency, or more implementation complexity.**

A core mechanism may be compact if a small model can preserve the required causality.

A contextual mechanism may contain a large data artifact without becoming causal gameplay infrastructure.

## 1.3 Minimum floor, not maximum ceiling

Each assignment in this candidate is a **minimum conceptual floor** for the first modern U.S. product direction under the accepted gameplay contract.

A later proof may justify deeper treatment.

A later implementation may not silently treat a load-bearing mechanism more shallowly than its accepted floor.

## 1.4 The country is not one economic god object

The candidate rejects one `EconomyState` owning employment, income, prices, firms, production, trade, credit, Housing, and fiscal consequences.

The preferred economic structure is a coordinated set of owners with typed handoffs, including at minimum:

- production/industry state;
- labor/employment state;
- household income/resource state;
- prices/cost state;
- monetary/credit conditions;
- public finance;
- Housing;
- trade/external flows;
- energy.

Aggregate measures such as GDP, unemployment rates, inflation rates, debt-to-GDP, and real-income growth are measurements or derived projections over those owners where applicable, not substitutes for their causal state.

---

# 2. Tier definitions

# 2.1 Core causal

A mechanism belongs at **core causal** depth when at least one supported product requirement needs most of the following:

- persistent canonical stock/flow/event state;
- endogenous evolution rather than a scripted trend;
- repeated policy or institutional inputs;
- repeated typed outputs to other owners;
- feedback from those receiving systems;
- path dependence across generated prehistory or the player term;
- geographic/population distribution that changes outcomes;
- accounting/conservation or contribution lineage;
- owner-resolved uncertainty and timing;
- counterfactual differences that return as different presidential decisions.

Core does not mean individual-level simulation.

Core means the mechanism cannot honestly be represented as one exogenous indicator while the product claims to govern through it.

# 2.2 Structured condition

A mechanism belongs at **structured-condition** depth when it must:

- own canonical evolving state;
- respond to legitimate typed inputs;
- emit typed outputs;
- preserve geography/population/entity scope where needed;
- preserve lags, capacity, queues, thresholds, or distributional differences relevant to supported gameplay;
- evolve through generated prehistory;
- create evidence and political consequences;

but current product needs do **not** require a highly detailed endogenous internal network or micro-foundation.

A structured mechanism may use:

- bounded transition models;
- state-space models;
- sector/region aggregates;
- queues;
- tables and response surfaces;
- coarse stocks and flows;
- named exact overlays for consequential entities.

# 2.3 Contextual

A mechanism belongs at **contextual** depth when the current product needs it primarily to:

- constrain decisions;
- establish opening-world conditions;
- evolve slowly or through accepted coarse transitions;
- produce official/private evidence;
- create actor or public interpretations;
- receive limited upstream effects;
- provide bounded background for an active issue or shock;

without making it a load-bearing repeated causal transformer for several downstream systems.

Contextual does not mean static.

Contextual does not mean politically irrelevant.

A contextual condition may become the most politically salient issue in the country.

# 2.4 Bounded external/shock

A mechanism belongs to a **bounded external/shock family** when the first product does not need to simulate the complete upstream system that created it.

The initiating family must still declare:

- source or actor;
- eligibility;
- timing process;
- persistence/duration;
- geography/entity/population scope;
- magnitude/severity distribution;
- dependence with other shock families;
- observability;
- uncertainty;
- typed handoffs into domestic owners;
- recurrence limits;
- termination/continuation semantics.

It may not contain pre-resolved domestic politics, approval, election outcomes, or policy responses.

# 2.5 Mixed depth is normal

A nominal domain may include:

```text
core mechanism
+ structured mechanism
+ contextual mechanism
+ exact institutional/program process
+ bounded shock family
```

That is expected rather than exceptional.

---

# 3. Depth assignment tests

## 3.1 Consumer test

For every mechanism ask:

> Which accepted process consumes this distinction, and what breaks if the mechanism is shallower?

A mechanism should not be deep merely because it is real-world important.

It should not be shallow merely because the player does not directly control it.

## 3.2 Receiver-closure test

**[DI — HARD INVARIANT LC-DEPTH02] Every accepted cross-domain coupling must terminate in a receiving mechanism deep enough to interpret and transform the input honestly.**

A core sender may not dump a typed output into a contextual receiver that lacks the state required to determine the consequence.

If such a handoff is load-bearing, the receiver mechanism must be raised to at least structured depth or the product must narrow the coupling claim.

## 3.3 Policy-route test

If the President, Congress, states, courts, agencies, or organizations can repeatedly alter a mechanism through supported governing routes, ask whether the mechanism can distinguish those interventions without direct modifier shortcuts.

If not, it is too shallow.

## 3.4 Prehistory persistence test

If current player-start state depends on the cumulative path of 2025–2029 or 2025–2033, the mechanism must evolve through prehistory rather than being regenerated from an endpoint distribution.

## 3.5 Shock-receiver test

A shock family may remain bounded externally only if every consequential domestic consequence is resolved by accepted domestic mechanisms.

## 3.6 Measurement test

The existence of official measurement does not by itself require core depth.

But if the game claims materially different hidden state beneath the same measurement, the underlying mechanism needs enough depth to produce that distinction.

## 3.7 Deletion/compression test

If removing a mechanism or collapsing two states does not change any supported:

- material outcome;
- actor action;
- institutional route;
- evidence artifact;
- political interpretation;
- historical inheritance;
- presidential decision;

prefer compression.

## 3.8 Bespoke-minigame test

A mechanism may have domain-specific internal rules because reality differs.

It should not receive a completely separate simulation architecture merely because the designers failed to use the accepted common grammar, cross-domain handoff, population, actor, information, and history contracts.

---

# 4. Cross-cutting foundations are not re-tiered as policy domains

The following accepted systems already have their own authority and are not reduced to domain-depth labels here:

- time and deterministic transition semantics;
- population and household continuity;
- geography;
- political actors and institutions;
- White House and administration;
- law, procedure, courts, and authority;
- public finance ownership semantics;
- information/measurement;
- media/distribution/public belief;
- political pressure/issues;
- historical provenance;
- generated-prehistory rules.

Step 13 classifies the material/social/external mechanisms those systems act upon or consume.

---

# 5. Economic-production spine

## 5.1 Aggregate GDP is a projection, not the core economy

**Provisional depth: DERIVED/MEASURED PROJECTION over core/structured owners.**

The game may expose:

- nominal and real GDP;
- GDP growth;
- GDP by industry;
- productivity;
- corporate profits;
- aggregate consumption and investment;

but those measures must not become a god object that directly rewrites employment, prices, income, or fiscal receipts.

BEA's national and industry accounts are useful external calibration/measurement structures, not a mandate to implement the full NIPA framework.

## 5.2 Sector/industry production and output

**Minimum depth: CORE CAUSAL at bounded sector/commodity resolution.**

Required because:

- trade and energy shocks need a domestic receiver;
- industry-specific employment and wages need production demand;
- major federal industrial policy should have a material target;
- supply constraints may affect prices and output differently by sector;
- regional industry concentration changes state and congressional politics;
- generated prehistory needs plausible divergence in industrial composition and output.

Candidate canonical state may eventually include bounded:

- gross output/production by sector;
- capacity/utilization proxies;
- major intermediate-input needs;
- inventories where consequential;
- investment/capital expansion at structured depth;
- regional production exposure.

The product does not need hundreds of BEA industries or every firm.

## 5.3 Intermediate-input and supply-use relationships

**Minimum depth: CORE CAUSAL at compressed commodity/sector relationships.**

Required to support:

```text
energy or import disruption
→ affected industry inputs
→ output/capacity change
→ jobs/prices/transport/fiscal consequences
```

without one `SupplyChainShock` modifier.

The implementation may use a heavily compressed input-output graph rather than full national accounts.

## 5.4 Business investment and productive capacity

**Minimum depth: STRUCTURED CONDITION.**

Needs enough state for:

- interest/credit conditions;
- tax and subsidy incentives;
- demand expectations;
- infrastructure/energy constraints;
- capacity expansion/contraction;
- major project delays;
- regional employment consequences.

Does not require detailed corporate-finance simulation for every firm.

## 5.5 Firm formation, closure, relocation, and consequential firms

**Minimum depth: STRUCTURED CONDITION plus exact actor/entity overlays when identity matters.**

Aggregate formation/exit rates can remain structured.

A particular steel plant, automaker, hospital system, port operator, or large employer may receive exact identity when its one action changes regional material or political state.

The exact entity overlay does not duplicate aggregate production or employment state.

---

# 6. Labor and employment

## 6.1 Employment, unemployment, participation, and gross labor transitions

**Minimum depth: CORE CAUSAL.**

Required state includes enough representation for:

- employment stock;
- unemployment;
- labor-force participation;
- hires;
- separations;
- entry/exit from labor force;
- industry/occupation/geographic association at bounded resolution;
- affected population scope.

Gross flows matter because similar net employment changes can hide materially different worker transitions.

## 6.2 Wages, earnings, and hours

**Minimum depth: CORE CAUSAL.**

Required to connect:

- employer/sector demand;
- household income;
- payroll/income tax receipts;
- Housing affordability;
- employer coverage;
- consumer prices and labor costs;
- organization/union bargaining where supported.

## 6.3 Labor bargaining and unions

Material labor-market facts remain with Labor.

Unions and worker organizations remain autonomous actors under Step 4.

Collective bargaining agreements, strikes, or organizing campaigns are institution/organization occurrences with typed Labor consequences.

**Minimum material depth: STRUCTURED/CORE at active bargaining relationships; political actor depth governed separately.**

## 6.4 Occupational and skill composition

**Minimum depth: STRUCTURED CONDITION.**

Needed for:

- sectoral transition;
- retraining/workforce policy;
- regional mismatch;
- immigration/labor coupling;
- automation/technology context.

A universal detailed occupation matrix is not required unless later content consumes it.

---

# 7. Household income, resources, consumption, and balance sheets

## 7.1 Earned income and disposable resources

**Minimum depth: CORE CAUSAL.**

Required to transform:

- wages/hours/employment;
- taxes;
- transfers and benefits;
- healthcare costs;
- Housing costs;
- inflation;

into household-level or population-scope resource exposure without one generic `economic wellbeing` variable.

## 7.2 Transfers, taxes, and benefit incidence

The legal/program/fiscal process owns eligibility, taxation, payments, and obligations.

Household-resource state receives actual valid flows.

**Minimum receiving material depth: CORE CAUSAL.**

## 7.3 Consumption composition

**Minimum depth: STRUCTURED CONDITION.**

Needs enough category/household variation to distinguish:

- food;
- energy;
- Housing;
- healthcare;
- transport;
- discretionary consumption;

where price shocks or policies create different exposure.

No household shopping simulation is required.

## 7.4 Savings, debt, and household balance sheet

**Minimum depth: STRUCTURED CONDITION.**

Needs enough state for:

- mortgage/consumer debt burden;
- interest-rate exposure;
- emergency financial buffer;
- wealth/asset-value effects at bounded resolution;
- distributional effects of financial conditions.

The game does not need every financial instrument.

---

# 8. Prices and cost of living

## 8.1 Canonical major-category prices

**Minimum depth: CORE CAUSAL.**

Underlying prices must be capable of changing through receiver-owned processes rather than being set by `Inflation`.

At minimum later design should distinguish categories whose cross-domain causes and household exposures differ materially, including some subset of:

- Housing/rents;
- energy;
- food;
- healthcare;
- transport;
- goods;
- services.

## 8.2 Producer/input prices

**Minimum depth: STRUCTURED CONDITION with core handoffs where production uses them.**

Needed to transmit:

- energy;
- imports/tariffs;
- wages;
- supply constraints;

into sector costs.

## 8.3 CPI/PCE/inflation rates

**Depth: MEASUREMENT/PROJECTION, not canonical price owner.**

Published indices may be consumed by legal formulas or political actors through their proper routes.

They do not overwrite actual underlying prices.

---

# 9. Monetary, credit, and financial conditions

## 9.1 Federal Reserve policy

The Federal Reserve, where included, is an autonomous institutional actor/process rather than a presidential control.

**Minimum institutional depth: STRUCTURED.**

Needs enough state for:

- policy-rate decisions;
- institutional mandate/context;
- meetings/decisions at bounded resolution;
- published statements/projections where supported.

The product does not need a full central-bank simulator unless later gameplay requires it.

## 9.2 Interest-rate term structure and credit conditions

**Minimum depth: STRUCTURED CONDITION.**

Required because rates affect:

- federal debt service;
- mortgages;
- business investment;
- household borrowing;
- possibly exchange rates and external flows.

## 9.3 Household and business financial assets/liabilities

**Minimum depth: STRUCTURED CONDITION.**

Exact instrument-level simulation is not required.

## 9.4 Banking/financial crisis

Ordinary financial-sector detail may remain structured/contextual.

A systemic financial-crisis family may be a **bounded shock/external family** only if domestic credit, fiscal, employment, and institutional consequences are resolved through normal owners.

---

# 10. Federal public finance

## 10.1 Revenues, outlays, deficit, debt, and net interest

**Minimum depth: CORE CAUSAL.**

This is a foundational presidency mechanism because virtually every major governing route may alter:

- receipts;
- mandatory spending;
- discretionary authority/outlays;
- debt issuance;
- debt service;
- future fiscal room;
- intergovernmental transfers.

A single `BudgetBalance` value is insufficient.

## 10.2 Authorization, appropriation, obligation, payment

Already governed by accepted fiscal/legal ownership.

**Minimum depth for supported federal programs: CORE CAUSAL.**

## 10.3 Automatic stabilizers and fiscal feedback

**Minimum depth: CORE CAUSAL where supported.**

Labor/income changes should be able to alter:

- tax receipts;
- unemployment/transfer caseloads;
- means-tested spending;

through explicit receiver processes rather than direct macro modifiers.

## 10.4 Trust funds and dedicated financing

**Minimum depth: STRUCTURED or CORE for programs whose dedicated financing materially changes presidential choices.**

The classification is mechanism-specific rather than universal.

## 10.5 Federal credit programs

**Minimum depth: STRUCTURED; CORE for a program that is itself load-bearing gameplay, such as federal student-loan obligations if supported deeply.**

---

# 11. State and local public finance

## 11.1 State/local revenues, spending, balances, and fiscal stress

**Minimum depth: STRUCTURED CONDITION.**

Needed for:

- federalism;
- grant matching/participation;
- recessions;
- disasters;
- education/health/infrastructure implementation;
- governor decisions.

The first product does not require a complete budget simulator for every locality.

## 11.2 Federal grants/transfers

Legal/federal finance/program state owns federal action.

State/local finance owns receipt and later state fiscal use where modeled.

**Minimum receiving depth: STRUCTURED.**

---

# 12. Housing

## 12.1 Housing stock, occupancy, vacancy, and household association

**Minimum depth: CORE CAUSAL.**

The accepted Housing proof already establishes strong ownership.

The broader product needs enough ongoing state for:

- stock;
- occupancy/vacancy;
- tenure;
- household exposure;
- geography/market association;
- projects and completions.

## 12.2 Rents, owner costs, and purchase affordability

**Minimum depth: CORE CAUSAL.**

Housing affordability must respond to Housing supply/demand, household resources, rates/credit, geography, and other accepted mechanisms rather than one policy score.

## 12.3 Construction pipeline and capacity

**Minimum depth: CORE CAUSAL at bounded project/market resolution.**

Needed for policy latency and regional supply response.

## 12.4 Mortgage credit and financing

**Minimum depth: STRUCTURED CONDITION.**

Receives rates and household/financial conditions.

## 12.5 Land-use, zoning, permitting, and local development constraints

**Minimum depth: STRUCTURED CONDITION at the geography actually consumed.**

Not every municipality needs a full zoning code.

The product needs enough to distinguish meaningful local/state constraint and policy routes when Housing gameplay consumes them.

## 12.6 Homelessness and severe Housing instability

**Minimum depth: STRUCTURED CONDITION.**

Needs affected population/geography and service/administrative coupling when politically or materially relevant.

---

# 13. Healthcare

## 13.1 Insurance/coverage state and transitions

**Minimum depth: CORE CAUSAL.**

Required because employment, age, eligibility, state choices, employer coverage, and federal programs can alter coverage differently.

The game cannot resolve healthcare politics honestly from one national insured-rate indicator.

## 13.2 Federal/state eligibility, enrollment, and payer relationships

Program/legal/admin owners resolve rules and enrollment.

Healthcare receives coverage and payer consequences.

**Minimum depth: CORE CAUSAL for supported major public programs and employer-coverage transitions.**

## 13.3 Healthcare spending and payer flows

**Minimum depth: STRUCTURED with core fiscal handoffs.**

Needs enough differentiation among major payer/source categories to interact with federal/state finance and household costs.

## 13.4 Provider capacity, utilization, and access

**Minimum depth: STRUCTURED CONDITION.**

Needs regional capacity/access and utilization pressure sufficient for:

- state variation;
- program expansion;
- workforce shortages;
- rural/urban differences;
- crisis response.

No patient-by-patient claims simulation is required.

## 13.5 Medical prices and household cost exposure

**Minimum depth: STRUCTURED CONDITION.**

## 13.6 Population health and disease burden

**Minimum depth: STRUCTURED CONDITION for broad health burden; CONTEXTUAL for slow detailed morbidity not otherwise consumed.**

## 13.7 Epidemic/pandemic/public-health emergency families

**External/biological initiation: BOUNDED SHOCK FAMILY.**

Domestic:

- health burden;
- provider capacity;
- labor;
- administration;
- fiscal response;
- public information;
- political consequences

must resolve through ordinary owners.

---

# 14. Immigration and population movement

## 14.1 Immigration status, lawful admission, asylum/refugee, enforcement, and case state

**Minimum depth: CORE CAUSAL for federally supported routes.**

The Presidency and federal institutions possess meaningful authority here, so a generic net-migration rate is insufficient for legal/political gameplay.

The product needs enough state to preserve:

- status/process categories at bounded resolution;
- case/queue implications where supported;
- agency capacity and legal constraints;
- geography and affected population.

## 14.2 Border/port encounter and operational pressure

**Minimum depth: STRUCTURED CONDITION.**

## 14.3 Immigration/emigration and settlement

**Minimum depth: CORE CAUSAL as part of Population.**

Population movement changes:

- state population;
- labor supply;
- Housing demand;
- services;
- electoral and census state over time.

## 14.4 Naturalization

**Minimum depth: STRUCTURED CONDITION/administrative process.**

## 14.5 Economic effects

Immigration does not own one `economic impact` value.

Labor, Housing, public finance, education, healthcare, and other receivers determine consequences from actual population/status/skill/geographic inputs.

---

# 15. Energy

## 15.1 Fuel supply, production, imports, inventories, and major demand

**Minimum depth: CORE CAUSAL at bounded commodity/regional resolution.**

Needed to support:

- external supply shocks;
- domestic production policy;
- industry costs;
- household energy exposure;
- transport;
- electricity generation.

## 15.2 Electricity generation/load balance and regional availability

**Minimum depth: CORE CAUSAL at bounded regional/grid resolution.**

The product does not need unit-level dispatch of every generator.

It does need canonical regional availability, demand, major capacity, and shortage/outage relationships sufficient to transmit shocks and policy.

## 15.3 Grid/transmission/distribution condition and outages

**Minimum depth: STRUCTURED CONDITION with exact major outage occurrences.**

## 15.4 Energy prices

**Minimum depth: CORE canonical price/availability outputs with STRUCTURED market internals.**

These prices feed production, household resources, transport, and political state through typed couplings.

## 15.5 Facility-level plants, pipelines, terminals, and utilities

**Minimum depth: CONTEXTUAL/STRUCTURED, individualized when identity is causally consequential.**

---

# 16. Industry, trade, and supply chains

## 16.1 Domestic industry composition

Primarily owned through the production spine.

**Minimum depth: CORE at bounded sector level.**

## 16.2 Imports and exports by major commodity/industry/country grouping

**Minimum depth: CORE CAUSAL at compressed resolution.**

Required for:

- tariffs;
- sanctions;
- external supply disruptions;
- industrial policy;
- exchange-rate/price exposure;
- region/industry effects.

## 16.3 Tariffs, quotas, sanctions, trade-law instruments

Legal/institutional owners resolve the policy instrument.

Trade/production owners resolve material consequences.

## 16.4 Supply-chain relationships

**Minimum depth: CORE through compressed intermediate-input/use relationships plus STRUCTURED logistics constraints.**

## 16.5 Exchange-rate conditions

**Minimum depth: STRUCTURED/CONTEXTUAL financial-external condition.**

The first product need not endogenously solve global FX markets.

## 16.6 Named firms and industries

Firm identity is retained where specific actions affect regions, supply, employment, politics, or national security.

Named-firm actions may be exact while aggregate industry state remains compressed.

---

# 17. Infrastructure and logistics

## 17.1 Transportation asset stock and condition

**Minimum depth: STRUCTURED CONDITION.**

Potential families include:

- highways;
- bridges;
- transit;
- rail;
- ports;
- airports.

Not every asset must be instantiated.

## 17.2 Network capacity and logistics performance

**Minimum depth: STRUCTURED CONDITION.**

Needed to transmit:

- disaster damage;
- port disruption;
- infrastructure investment;
- supply-chain congestion;
- regional access.

## 17.3 Major disruption events

**Exact occurrences over structured network state.**

## 17.4 Project pipeline and federal investment

Fiscal/program/administrative state may require exact program records.

Material infrastructure state may remain structured by project/region/class.

## 17.5 Water/wastewater and broadband

**Minimum depth: CONTEXTUAL generally; STRUCTURED where a supported program, failure, or presidential route consumes the mechanism.**

The product should not build every infrastructure sector deeply by default.

---

# 18. Education

## 18.1 K–12 enrollment and public finance

**Minimum depth: STRUCTURED CONDITION.**

Needed for state/local/federal funding, demographic change, and policy exposure.

## 18.2 Educator workforce and capacity

**Minimum depth: STRUCTURED CONDITION.**

Needed for staffing shortages, labor organization, and implementation constraints when supported.

## 18.3 Higher-education enrollment and institutional capacity

**Minimum depth: CONTEXTUAL/STRUCTURED.**

## 18.4 Federal student aid and student-loan obligations

**Minimum depth: CORE CAUSAL for supported federal credit/program gameplay.**

This is the canonical example of why one policy label cannot receive one depth tier.

Education may remain coarse materially while student-aid fiscal/admin state is exact and path-dependent.

## 18.5 Educational attainment and learning outcomes

**Minimum depth: CONTEXTUAL slow-moving condition with measurement.**

Deep causal education production functions are not currently required.

## 18.6 School governance/curriculum disputes

Political/institutional state may become detailed through states, local institutions, courts, organizations, and media even while the underlying education material model remains contextual or structured.

---

# 19. Crime and public safety

## 19.1 Crime incidents/victimization

**Minimum depth: STRUCTURED CONDITION.**

Needs enough geography, offense family, victimization/incident distinction, and reporting uncertainty to support divergent local/national politics.

## 19.2 Law-enforcement operational capacity

**Minimum depth: STRUCTURED CONDITION at the institutional level consumed.**

## 19.3 Clearance, charging, prosecution, and court/corrections flow

**Minimum depth: CONTEXTUAL/STRUCTURED**, with exact legal proceedings where a supported case or federal/state action becomes load-bearing.

The game does not need a national criminal-case simulator.

## 19.4 Federal public-safety programs and grants

Exact fiscal/admin state where active; material crime effects remain receiver-resolved and uncertain.

## 19.5 Measurement

Police-reported crime, victimization, public perception, media coverage, and political concern remain distinct.

---

# 20. Environment, climate, and disasters

## 20.1 Pollution/emissions and exposure

**Minimum depth: STRUCTURED CONDITION at bounded pollutant/region categories where policy or health/industry effects are supported.**

## 20.2 Environmental regulatory/compliance state

Legal/institutional owners may require exact actions, permits, rules, enforcement, and cases.

The underlying material environmental state may remain structured.

## 20.3 Slow climate/background state

**Minimum depth: CONTEXTUAL.**

The first product does not require an endogenous Earth-system climate model.

Climate/background conditions may influence bounded hazard probabilities and long-run regional conditions under declared assumptions.

## 20.4 Weather/climate disasters

**Minimum depth: BOUNDED SHOCK FAMILIES.**

Possible families include:

- hurricanes;
- floods;
- drought;
- wildfire;
- severe storms;
- winter storms;
- extreme heat/cold.

Downstream:

- Housing;
- infrastructure;
- energy;
- health;
- population;
- finance;
- state/federal response;
- media;
- politics

must remain owner-resolved.

## 20.5 Recovery

**Minimum depth: STRUCTURED, with exact federal/state/admin actions where supported.**

---

# 21. Agriculture and food

The first product does not need agriculture as a wholly separate deep simulation if the relevant mechanisms can be represented through:

- industry production;
- trade;
- energy;
- transport;
- commodity/food prices;
- drought/weather shocks;
- federal farm programs.

## 21.1 Agricultural production and food supply

**Minimum depth: STRUCTURED within industry/commodity production.**

## 21.2 Food prices

Handled through core price mechanisms.

## 21.3 Farm policy/insurance/subsidy programs

Exact fiscal/admin state when a supported presidential route uses them.

This is an example where a political policy family need not become a standalone top-level material domain.

---

# 22. Social insurance and safety-net programs

The first product should not create one `Welfare` material domain.

Program-specific legal/admin/fiscal systems may be exact while material consequences flow into:

- household resources;
- healthcare;
- Housing;
- labor incentives;
- state finance;
- population eligibility.

## 22.1 Major cash/transfer benefits

**Minimum material receiving depth: CORE household-resource coupling.**

Program administration/fiscal depth depends on the supported program.

## 22.2 Unemployment benefits

Labor eligibility and public finance/program administration may need core causal treatment because they couple directly to employment transitions and fiscal state.

## 22.3 Nutrition/other means-tested support

May remain structured program/admin where included.

The product should add exact program machinery only when presidential gameplay or prehistory consumes it.

---

# 23. Foreign affairs and national security

## 23.1 External country/relationship state

**Minimum depth: CONTEXTUAL.**

The first product may retain bounded:

- alliance/partnership relationships;
- adversarial relationships;
- sanctions/trade relations;
- major conflicts;
- selected economic/security conditions;
- treaty/commitment context.

It does not require a grand-strategy world simulator.

## 23.2 Diplomacy, sanctions, aid, treaty/commitment, and executive/congressional national-security routes

**Minimum depth: STRUCTURED institutional/legal/fiscal processes.**

Specific presidential acts and external responses may be exact occurrences.

## 23.3 Military posture/readiness/deployment

**Minimum depth: STRUCTURED CONDITION.**

Enough to create:

- force availability;
- fiscal implications;
- deployment consequences;
- alliance/security constraints;
- domestic political and logistical effects.

No tactical combat simulation is required.

## 23.4 External armed conflict, coercion, cyberattack, supply disruption

**Minimum depth: BOUNDED EXTERNAL/SHOCK FAMILY** unless later product scope justifies deeper external simulation.

External events produce typed effects into:

- national security institutions;
- trade;
- energy;
- infrastructure;
- firms;
- fiscal state;
- intelligence/evidence;
- population/material conditions.

They do not carry pre-resolved approval or presidential choices.

## 23.5 Intelligence

Evidence/assessment semantics remain governed by Step 7.

External hidden truth is not player truth.

---

# 24. Domain summary matrix

The following is a convenience summary only. It does not replace mechanism-level assignments.

| Policy/domain label | Core mechanisms inside it | Structured mechanisms inside it | Contextual / bounded pieces |
|---|---|---|---|
| Macroeconomy | sector production/use, labor, income, major prices | investment, balance sheets, credit | aggregate GDP is derived/measurement |
| Labor | employment/gross flows, wages/hours | skills/occupation, bargaining material effects | fine occupational detail |
| Household finances | earned/disposable resources | consumption mix, debt/wealth | detailed instruments |
| Public finance | federal receipts/outlays/debt/interest, supported program execution | state/local finance, some trust/credit programs | peripheral program detail |
| Housing | stock/vacancy/affordability/construction | mortgage credit, land-use constraints, homelessness | parcel-level detail |
| Healthcare | coverage and major public-program transitions | providers, payer spending, medical prices, broad health burden | fine disease/provider detail; outbreaks as shocks |
| Immigration | status/admission/enforcement routes, population flows | border capacity, naturalization | fine individual case detail beyond supported routes |
| Energy | major fuel/electric balance and price/availability | grid condition, assets, facilities | detailed facility physics; some shocks external |
| Industry/trade | sector production/use, major trade flows | firm investment, logistics, FX | fine firm network except named consequential entities |
| Infrastructure | — | major asset condition/capacity, logistics, projects | water/broadband unless activated; exact disruptions |
| Education | student-aid/loan mechanisms where supported | K–12 finance/enrollment/workforce | long-run learning outcomes, detailed school systems |
| Crime/public safety | — | incident/victimization and operational capacity | fine case/corrections detail |
| Environment/climate | — | pollution/exposure and recovery | slow climate background; hazards as shocks |
| Agriculture/food | major price links live elsewhere | production within industry framework | no standalone deep domain by default |
| Social insurance | some program/transfer mechanisms | program-specific admin | no universal welfare domain |
| Foreign/national security | domestic fiscal/legal/institutional consequences | diplomacy/posture/security state | external-world context and bounded shock families |

The table must never be used to infer that the entire row shares one runtime tier.

---

# 25. Foundational mechanism graph

The candidate's minimum recurring material spine is:

```text
Population / households
        ↕
Labor / employment
        ↕
Household income/resources
        ↕
Prices / cost exposures
        ↕
Production / industry / trade / energy
        ↕
Federal + state fiscal systems
        ↕
Housing / Healthcare / Immigration /
Infrastructure / selected other domains
```

This is not a universal update order.

It identifies mechanisms whose repeated interactions are expected to shape national conditions and presidential constraints.

Legal, institutional, actor, measurement, media, issue, and history systems cross-cut this graph through their accepted ownership contracts.

---

# 26. No macroeconomic scorecard causality

The game may display:

- GDP growth;
- unemployment rate;
- inflation;
- wage growth;
- real disposable income;
- debt/deficit;
- housing affordability;
- insurance coverage;
- energy prices.

But these are measures or projections.

They cannot be used as shortcuts such as:

```text
GDP growth +1
→ unemployment -0.5
→ approval +3
```

Causality runs through owned mechanisms and recipient interpretation.

---

# 27. Mechanism activation and deepening

## 27.1 Tier floors persist through generated history

A core mechanism must evolve through prehistory even while politically quiet.

It cannot be instantiated only when an issue becomes salient.

A structured mechanism must preserve enough evolving state that later activation does not require inventing its past.

A contextual mechanism may use coarse transitions but must preserve any state later promised as causal history.

## 27.2 Prospective deepening

A mechanism may deepen when current state and predeclared supported consumer families require it.

Deepening must obey Step 12's future-blind rules.

## 27.3 No historical upgrade by fiat

A contextual mechanism cannot suddenly produce exact historical detail because the President begins caring about it.

If later gameplay needs unsupported detail, the model must:

- use retained latent state;
- model/bound the answer;
- leave it unsupported;
- or regenerate under a deeper product package.

## 27.4 Active program overlays

A domain can remain structured while one federal program or project receives exact administrative/fiscal/legal detail.

The exact overlay may not claim material precision the structured receiver does not support.

---

# 28. Supported-policy and shock closure

**[DI — HARD INVARIANT LC-DEPTH03] The generated country may admit only policies, institutional routes, shocks, and claims whose load-bearing downstream mechanisms exist at sufficient accepted depth to resolve their consequences honestly.**

Examples:

- a nationwide insurance reform requires coverage, payer/fiscal, state, provider/access, and household-cost mechanisms deep enough to represent its supported effects;
- a carbon-pricing policy requires energy/industry/price/fiscal/environment mechanisms sufficient for the claimed routes;
- a major tariff requires trade/industry/price/labor/fiscal receivers sufficient for the claimed effects;
- a student-loan forgiveness route requires federal credit/fiscal, borrower/household-resource, and legal/admin state sufficient for the claimed effects;
- a pandemic shock requires health, labor, finance, population, and administration receivers sufficient for the supported consequences.

If the receivers are too shallow, the content is out of scope or its claims must be narrowed.

The generator cannot admit a policy because it is politically interesting and then resolve its effects with direct modifiers.

---

# 29. 2029 versus 2033 burden

The depth floors are horizon-neutral.

The same mechanism should not become deeper merely because the requested endpoint is 2033.

But an eight-year horizon creates additional proof burden because:

- stocks and obligations accumulate longer;
- slow material processes have more time to mature;
- household/population/geographic changes compound;
- fiscal and debt-service feedback grows;
- infrastructure/Housing projects mature;
- healthcare and policy feedback can accumulate;
- industry/trade/energy transitions may produce path dependence;
- contextual mechanisms may need enough slow evolution to avoid frozen-world artifacts.

If a mechanism cannot remain coherent for eight years at its assigned floor, either:

- the mechanism's floor is too shallow;
- the 2033 product horizon is unsupported;
- or the mechanism/domain scope must be narrowed.

No endpoint-only reinitialization is allowed.

---

# 30. Adversarial cross-domain proofs

These are paper proofs of the depth assignment, not final algorithms.

## Proof A — employment downturn without a recession switch

```text
sector production falls
→ firms reduce labor demand
→ separations increase
→ household income falls
→ some employer coverage changes
→ tax receipts and transfer caseloads change
→ Housing/consumption exposure changes
→ measurements lag/revise
→ political actors interpret differently
```

Required floors:

- production CORE;
- labor CORE;
- household resources CORE;
- healthcare coverage CORE;
- federal finance CORE;
- Housing CORE;
- observation/politics governed by prior steps.

No `Recession = true` modifier may replace the chain.

## Proof B — external energy disruption

```text
bounded external supply shock
→ fuel availability/price changes
→ electricity/industry/transport costs
→ consumer price categories
→ household resources
→ production/employment differences by region/industry
→ fiscal/political consequences
```

Required floors:

- shock bounded external;
- energy CORE;
- production/use CORE;
- prices CORE;
- household resources CORE;
- labor CORE.

## Proof C — immigration surge with heterogeneous effects

```text
federal/legal admission or border process
→ population/status change
→ geographic settlement
→ labor supply and participation
→ Housing demand
→ state/local service load
→ federal/state fiscal effects
→ evidence and political frames
```

Required floors:

- federal immigration CORE;
- population CORE substrate;
- labor CORE;
- Housing CORE;
- state/local finance STRUCTURED;
- service domains at sufficient depth for any claimed effect.

The game may not emit one `ImmigrationEffect = ±N`.

## Proof D — healthcare reform

```text
law + fiscal authority
→ eligibility/enrollment
→ payer/coverage transitions
→ household costs and provider utilization
→ federal/state spending
→ evidence and implementation variation
```

Coverage/admin must be CORE even though some health outcomes remain contextual.

## Proof E — infrastructure failure

```text
structured bridge/port/network condition
→ exact disruption occurrence
→ logistics/capacity reduction
→ industry/trade delays
→ regional employment/price consequences
→ emergency/state/federal response
```

The infrastructure domain need not be core everywhere; its structured state plus exact disruption can legitimately feed core receivers.

## Proof F — education/student-loan contrast

```text
broad school attainment changes slowly
→ contextual/structured evidence
```

while:

```text
federal student-loan policy
→ legal/credit balances
→ payment obligations
→ household resources
→ federal finance
```

requires core fiscal/program mechanics.

One `Education` tier would fail this proof.

## Proof G — crime politics without crime god score

```text
structured incident/victimization state
→ incomplete official measurement
→ local institutional response
→ media/public belief
→ federal/state political pressure
```

No exact local criminal-case simulation is required for national politics.

## Proof H — climate/disaster

```text
contextual climate/background
→ bounded hurricane family
→ Housing/infrastructure/energy damage
→ health/population displacement
→ federal/state fiscal and administrative response
→ evidence/media/political consequences
```

The hazard can be bounded externally while recovery is normal domestic causality.

## Proof I — trade/tariff

```text
legal tariff instrument
→ trade prices/flows
→ industry input/use
→ producer/consumer prices
→ labor and household resources
→ customs receipts
→ organization/state politics
```

Trade and production receivers must be deep enough before such policy is supported.

## Proof J — foreign-security crisis without grand strategy simulator

```text
bounded external coercive/cyber/security event
→ security institution/intelligence state
→ energy/trade/infrastructure/fiscal inputs
→ administration and allies respond
→ evidence/media/public politics
```

External-country simulation may remain contextual while domestic consequences remain real.

---

# 31. External research grounding

These sources support bounded structural lessons. They do not dictate the game's exact tiers or algorithms.

## 31.1 Production and industry

BEA's GDP-by-industry and input-output accounts distinguish output, intermediate inputs, value added, industries, commodities, imports, and final use. The design lesson is that aggregate GDP does not substitute for the production relationships that transmit sectoral and supply shocks.

- https://www.bea.gov/data/industries/input-output-accounts-data
- https://www.bea.gov/help/glossary/gross-domestic-product-gdp-industry-accounts

## 31.2 Labor

BLS labor-force-flow work distinguishes gross movements among employment, unemployment, and nonparticipation from net headline changes. The design lesson is to retain gross transitions when downstream systems depend on who changed status.

- https://www.bls.gov/cps/cps_flows.htm

## 31.3 Public finance

CBO's budget outlook separates revenues, mandatory/discretionary outlays, deficits, debt, and net interest and discusses how debt and rates affect future interest costs and policy constraints.

- https://www.cbo.gov/publication/62105

## 31.4 Healthcare

CMS National Health Expenditure Accounts distinguish services, payer/source categories, households, businesses, and government financing. The design lesson is that healthcare costs, coverage/payers, and federal/state finance are separable mechanisms.

- https://www.cms.gov/data-research/statistics-trends-and-reports/national-health-expenditure-data

## 31.5 Energy

EIA describes electricity prices as products of fuels, generation, grid, demand, weather, infrastructure, and regulation, and describes delivery through interconnected generation/transmission/distribution networks. The design lesson is that energy price/availability can be modeled causally without simulating every generating unit.

- https://www.eia.gov/energyexplained/electricity/prices-and-factors-affecting-prices.php
- https://www.eia.gov/energyexplained/electricity/delivery-to-consumers.php

## 31.6 Housing

The Census Building Permits Survey publishes new residential-construction authorization at multiple geographic levels. The design lesson is that Housing construction can retain regional/local variation without requiring parcel simulation.

- https://www.census.gov/construction/bps/index.html

## 31.7 Immigration

DHS/OHSS immigration statistics distinguish lawful permanent residents, temporary admissions, refugees/asylees, naturalization, apprehensions, removals, and returns. The design lesson is that immigration policy cannot be represented honestly as one net-migration number when federal legal/administrative status is gameplay-relevant.

- https://ohss.dhs.gov/topics/immigration/yearbook

## 31.8 Education

NCES statistics separately track enrollment, institutions, educators, attainment, finances, federal funds, and state-level revenue/expenditure. The design lesson is to avoid treating Education as one scalar while allowing coarser material depth than federal credit/program mechanisms.

- https://nces.ed.gov/programs/digest/
- https://nces.ed.gov/use-work/resource-library/report/first-look-ed-tab/revenues-and-expenditures-public-elementary-and-secondary-education-school-year-2023-24-fiscal-year

## 31.9 Infrastructure

FHWA reports asset condition, performance, investment, bridges, highways, and transit at multiple resolutions. The design lesson is that infrastructure can use structured asset/network state and exact consequential disruptions without requiring every asset to be a persistent actor.

- https://www.fhwa.dot.gov/policy/25cpr/
- https://www.fhwa.dot.gov/bridge/nbi/ascii2025.cfm

## 31.10 Crime

FBI UCR/NIBRS distinguishes incident-based data from earlier aggregate reporting and includes offense, victim, offender, location, time, and clearance context. The design lesson is that national crime conditions can be structured rather than one crime score while still remaining much coarser than person-level criminal-case simulation.

- https://www.fbi.gov/how-we-can-help-you/more-fbi-services-and-information/ucr/
- https://www.fbi.gov/how-we-can-help-you/more-fbi-services-and-information/ucr/nibrs

## 31.11 Financial conditions

The Federal Reserve Financial Accounts distinguish transactions and levels of financial assets/liabilities and household/business/government balance sheets. The design lesson is to separate household/business balance-sheet and debt state from income and production.

- https://www.federalreserve.gov/releases/z1/

## 31.12 Disasters

NOAA/NCEI disaster records demonstrate materially different hazard families and regional effects. The design lesson is to support distinct bounded shock families whose domestic effects resolve through existing owners rather than one generic `Disaster` modifier.

- https://www.ncei.noaa.gov/access/billions/

## 31.13 Trade

U.S. trade data distinguish countries, products, industries, imports, exports, and trade balances; tariff schedules separately define legal tariff classifications. The design lesson is to retain commodity/industry/country-group trade channels at bounded resolution rather than one trade-openness value.

- https://www.trade.gov/national-trade-data
- https://www.usitc.gov/harmonized_tariff_information

These sources establish useful state distinctions and measurement structures. They do not prove that the proposed mechanism floors are sufficient for fun, calibration, or implementation feasibility.

---

# 32. Anti-ontology and anti-cheat requirements

Step 13 candidate rejects:

1. one depth tier for an entire policy label when mechanisms differ;
2. `Core` meaning maximum realism or micro-simulation;
3. `Contextual` meaning politically irrelevant or frozen;
4. a universal `EconomyState` owning output, labor, prices, income, trade, and finance;
5. GDP directly driving material state;
6. inflation index directly owning prices;
7. unemployment rate directly owning labor transitions;
8. one immigration-impact score;
9. one healthcare score;
10. one education score;
11. one crime score;
12. one infrastructure-health score;
13. one environment/climate score;
14. one foreign-threat score carrying domestic consequences;
15. policy outputs bypassing receiver mechanisms;
16. shocks carrying pre-resolved domestic politics;
17. a contextual receiver pretending to resolve a core coupling it cannot represent;
18. generated policy or shock content exceeding its receiver-depth closure;
19. activating core state only after politics makes it salient;
20. retrospective deepening inventing past detail;
21. 2033 requesting deeper earlier history than 2029 under the same package;
22. exact program records pretending the material receiver is exact;
23. named firms duplicating aggregate production/employment;
24. measuring a mechanism more precisely than the canonical support warrants;
25. every infrastructure/education/health subfield becoming a bespoke minigame;
26. deleting a slow mechanism whose accumulated state changes later decisions;
27. keeping a detailed mechanism solely because a dashboard could display it;
28. using domain depth as an Early Access inclusion decision;
29. treating a derived national indicator as a causal owner;
30. using direct modifiers where the accepted depth matrix requires typed causal handoffs.

---

# 33. Step 13 binary gate

The detached audit must answer:

> **Does the proposed mechanism-level depth matrix assign every load-bearing United States material/social/external process enough causal depth to support the accepted presidential game, generated prehistory, typed cross-domain handoffs, measurements, and player-start explanation—without using whole-domain labels as fidelity shortcuts, turning core into micro-simulation, hiding causal receivers inside contextual state, admitting unsupported policies/shocks, duplicating economic ownership, or designing unnecessary bespoke simulations?**

PASS requires all of the following:

1. tier definitions are based on semantic obligations rather than size or code complexity;
2. depth is assigned at mechanism/state level rather than policy label alone;
3. aggregate macro indicators remain measurements/projections rather than causal owners;
4. production, labor, household resources, prices, public finance, Housing, selected healthcare, immigration, energy, and trade mechanisms receive sufficient load-bearing depth;
5. education, crime, infrastructure, environment, and foreign affairs may remain mixed/coarser without hiding active exact mechanisms;
6. receiver-depth closure prevents a shallow subsystem from pretending to resolve a deep handoff;
7. supported policies/shocks are limited by the downstream mechanism closure actually present;
8. core mechanisms evolve through quiet generated history rather than activating on salience;
9. prospective deepening remains future-blind and does not fabricate the past;
10. 2029/2033 horizons preserve the same depth floors before branch differences;
11. exact program/institutional overlays do not claim unsupported material precision;
12. the matrix permits different geography and population resolution by mechanism;
13. no duplicate owner arises from named entities plus aggregate mechanisms;
14. all ten adversarial proof paths remain coherent;
15. deletion/compression tests prevent ontology inflation;
16. the matrix remains separate from Early Access inclusion, roadmap, and implementation order.

A PASS establishes only the conceptual minimum-depth matrix.

It does not prove that the mechanisms can be implemented, calibrated, generated, balanced, or presented well.

---

# 34. Candidate disposition

## **READY FOR DETACHED STEP-13 AUDIT**

The candidate answer is:

> **The first modern U.S. game needs a deep causal economic/fiscal/Housing spine plus selected core mechanisms inside healthcare, immigration, energy, trade, and federal programs; many other mechanisms may remain structured or contextual. The correct unit of depth is the causal mechanism and owned state, not the policy label. A lower tier is acceptable only when every promised coupling, policy route, historical transition, and player-visible explanation remains honest at that depth.**

This candidate is not authority until it passes detached review and any required repair.