# 10 — Housing Material Domain V0

Status: **Commit-5 architecture candidate for review. Not implementation authority.**

## 1. Purpose

Governing Loop 0 needs one material domain deep enough to prove that political/legal/fiscal/administrative success can still produce delayed, uneven, weak, mixed, or otherwise surprising societal outcomes.

This document closes only the minimum housing-domain architecture required for that proof.

It does **not** design a complete housing market, household life simulator, local zoning system, construction industry simulator, land market, mortgage system, macroeconomy, or full United States housing model.

The governing rule is:

> Housing owns housing-material truth. Political/legal/program systems may create inputs into housing, but they do not own or directly set housing outcomes.

## 2. Normative dependencies

This document preserves accepted Commits 1–4:

- one mutable canonical fact has one semantic owner;
- GeographyState owns spatial identity/topology, not people or housing outcomes merely because those are located in geography;
- PopulationState owns population/residence/demographic/political state subject to the domain-specific ownership clarification in `07`;
- legal order owns legally operative requirements;
- administration owns program workflow/determinations/capacity;
- fiscal owners own authority, obligation, and payment state;
- Housing owns construction, stock, and affordability/material pressure;
- immutable committed occurrence facts remain owned by `HistoricalRecord` under D-037;
- measurement/reporting are observations/artifacts, not housing truth;
- time advancement must preserve material latency and intermediate causal boundaries;
- stochastic material outcomes, where supported, obey Commit-4 deterministic causal-randomness semantics.

## 3. Housing material ownership

For GL0, the housing domain may own canonical current facts such as:

- regional housing stock relevant to the model;
- occupied/vacant or equivalent utilization state where required;
- housing demand/household pressure inputs represented materially;
- construction/project pipeline state after a real material project exists;
- construction capacity/bottleneck state required by GL0;
- completed new units or equivalent stock additions;
- rent/affordability or a bounded affordability-pressure representation;
- materially relevant regional differences;
- current material project failure/delay/completion state.

Housing processes may generate immutable occurrence records such as:

```text
ProjectStarted(...)
ProjectDelayed(...)
ProjectCompleted(...)
HousingStockChanged(...)
```

The immutable fact that those occurrences happened belongs to the accepted historical-record owner. Housing does not maintain a second authoritative material-history store.

Exact runtime classes and formulas remain deferred.

### Candidate hard invariant H-01

**HousingState owns current material housing facts used by GL0. Housing processes may generate immutable occurrence records under the accepted HistoricalRecord doctrine, but Housing does not own a parallel immutable history. Legal sources, appropriations, grants, administrative records, projections, reports, and political claims may reference or causally influence housing facts but may not shadow-own or directly overwrite them.**

## 4. Administrative project versus material project

A federal/state program can approve, fund, reject, monitor, or administratively close a project without owning the physical construction.

Conceptually:

```text
Program award / agreement
+ valid fiscal execution
+ participating recipient/state
        ↓
material project initiation input
        ↓
Housing-owned project/pipeline state
```

An administrative project record may reference the corresponding material project identity.

The administrative record may own facts such as approval status, grant compliance, reporting status, or award amount.

Housing owns facts such as physical start, progress, bottlenecks, completion, units delivered, and later material effects.

### Candidate hard invariant H-02

**Administrative project/grant state and physical housing-project state are distinct owners. Administrative approval or payment may create legitimate material inputs; neither means construction has started, progressed, completed, or produced affordability effects.**

## 5. Minimum regional structure

GL0 requires geographically uneven housing conditions.

A synthetic state/jurisdiction may therefore contain or reference one or more housing regions whose boundaries are grounded in GeographyState.

Housing regions may be derived groupings or housing-domain references over geography. They do not own geographic boundaries independently.

A region may carry only the material variables required by the skeleton.

The architecture must permit different regions to have different:

- initial stock/pressure;
- construction capacity;
- project pipeline;
- response to the same federal/state program inputs.

### Candidate hard invariant H-03

**Regional housing state references canonical geography and may vary materially by place. Housing regions do not become alternate geographic owners, and national housing summaries remain derived projections over regional canonical state.**

## 6. Demand/household pressure without duplicate population

Housing may require population-derived demand inputs, but it does not own a second population.

Conceptually:

```text
PopulationState + residence/geography
        ↓ derived material demand inputs
Housing material process
```

The GL0 housing domain may use a compact demand/household-pressure projection sufficient for affordability dynamics.

If a population change affects housing demand, the change originates in PopulationState and is consumed through an explicit projection/input.

### Candidate hard invariant H-04

**Housing may consume population-derived demand inputs but may not own copied households/people as a second authoritative population. Population changes propagate into housing through explicit owner-respecting inputs/projections.**

## 7. Construction pipeline

A material project may move through a deliberately small pipeline such as:

```text
not materialized
→ initiated
→ active construction
→ delayed/blocked or progressing
→ completed / failed / abandoned
```

The exact stage names are not normative.

What matters is that:

- completion requires time;
- construction consumes bounded capacity/resources represented by Housing where materially relevant;
- funded projects can queue or progress slowly;
- projects can remain incomplete at the election;
- a later legal/administrative stop affects future material activity through a legitimate causal boundary rather than deleting completed work.

### Candidate hard invariant H-05

**Housing construction is a time-bearing material process. Funding/approval cannot skip the physical pipeline, and later legal/administrative changes affect current/future project behavior without erasing material occurrences already realized.**

## 8. Capacity and bottlenecks

GL0 needs at least one reason competent implementation can fail to translate one-for-one into completed housing.

A bounded construction-capacity/bottleneck representation is therefore architectural.

It may summarize factors such as:

- available construction throughput;
- labor/material/contractor constraints;
- project queue congestion;
- region-specific delivery limits.

Commit 5 does not model those industries independently.

Capacity is not a political support meter and is not agency administrative capacity.

### Candidate hard invariant H-06

**Material construction capacity is Housing-owned state distinct from administrative capacity, legal authority, funding, and political support. Adequate administration and funding may still encounter material bottlenecks.**

## 9. Affordability response

The domain must support a material relation among relevant represented facts such as:

```text
housing stock / supply
+ demand/household pressure
+ utilization/vacancy pressure where represented
+ construction pipeline effects
+ bounded exogenous/material conditions in the fixture
        ↓
affordability/rent pressure
```

Commit 5 does not freeze an economic equilibrium model or exact price equation.

The skeleton may use a deliberately simple deterministic model plus controlled stochastic/material uncertainty if needed.

The model must support:

- delayed improvement;
- different regional response;
- weaker-than-forecast improvement;
- mixed/offsetting response;
- no improvement before election despite valid projects in progress.

### Candidate hard invariant H-07

**Affordability is resolved by Housing from its material state and legitimate inputs. It is not a direct function of law passage, grant generosity, administrative competence, or political intention, and competent implementation does not guarantee the desired affordability result.**

## 10. Forecast versus authoritative material model

Staff may forecast project completions or affordability changes using an approximate model.

That forecast is a projection/artifact under Commit 4.

Housing remains authoritative when the world actually advances.

The skeleton should intentionally permit forecast error without requiring arbitrary deception.

### Candidate hard invariant H-08

**Forecasted housing outcomes and authoritative housing outcomes are distinct. Forecast error is represented through provenance/assumptions/uncertainty; it never creates a second authoritative housing model.**

## 11. Direct lived experience

Population groups may experience material housing pressure directly according to residence/geography and supported population semantics.

Housing supplies the material input.

PopulationState owns resulting experience-linked political processing, belief/evaluation, attribution, salience, preference, and turnout-relevant state.

Rejected:

```text
HousingRegion.approval += 5
```

### Candidate hard invariant H-09

**Housing may expose population groups to material conditions through their canonical residence/geographic relationship, but PopulationState owns political interpretation/response. Housing never owns approval, attribution, salience, preference, or turnout.**

## 12. Measurement boundary

Official housing statistics measure Housing-owned state through the Commit-4 measurement process.

A measurement may observe:

- stock/completion;
- construction activity;
- rent/affordability pressure;
- another supported material indicator.

Captured observations belong to the measurement process once taken.

Published artifacts remain non-authoritative about Housing.

### Candidate hard invariant H-10

**Housing exposes measurable canonical facts; measurement captures observations without mutating Housing, and reports/polls/claims never become Housing's current-state owner.**

## 13. Minimum GL0 housing fixture

The walking skeleton should use a deliberately small synthetic material world with at least three meaningfully different regional/state implementation contexts:

1. willing/capable participation where material delivery can progress;
2. refusal/nonparticipation where no eligible program material pipeline is created through that route;
3. participation with weak administrative and/or material delivery capacity that produces delay.

Across the fixture there must be enough variation to demonstrate:

- initial geographically uneven affordability pressure;
- finite construction capacity;
- at least one funded project that remains incomplete for a meaningful interval;
- at least one completed project capable of changing stock;
- material response that can differ from forecast;
- measurement lag after actual material change.

Exact numeric tuning remains implementation/playtest work.

## 14. Hostile proof cases

Commit 5 housing architecture must survive:

### H-A — generous funding, weak capacity

More funding does not instantly create more completed units when material capacity binds.

### H-B — legal/program success, election arrives first

Law, award, obligation, and active construction exist, but the election occurs before completion.

### H-C — competent administration, weak material response

All participating institutions administer competently, yet affordability improvement is smaller than forecast.

### H-D — regional divergence

The same program design produces materially different outcomes across regions because canonical conditions differ.

### H-E — later court stop

A court order constrains future project/fiscal/administrative conduct but does not erase construction already physically completed.

### H-F — data lag

Housing improves before the official release captures/reports the improvement.

## 15. Rejected shortcuts

Rejected:

```text
Grant.awarded -> Housing.units += grant.unitsExpected
```

Rejected:

```text
LawPassed -> rent -= X
```

Rejected:

```text
AgencyCapacity == ConstructionCapacity
```

Rejected:

```text
HousingRegion.population = copiedPopulation
```

Rejected:

```text
forecastedRent = canonicalRent
```

when the forecast is intended to be uncertain/approximate.

Rejected:

```text
ProjectAdminRecord.status = COMPLETE
```

as proof that physical construction completed.

Rejected:

```text
Housing.materialHistory = authoritativeOccurrenceStore
```

when immutable committed occurrences are owned by the accepted historical-record owner.

## 16. Commit-5 review questions for this document

Review should ask only whether the first material domain is closed enough for the GL0 skeleton contract:

1. Does Housing own all current material housing truth without absorbing population/geography/program/fiscal/political state or immutable occurrence history?
2. Are administrative projects and physical projects separated?
3. Can funding and competent administration still encounter material latency/capacity and weak outcomes?
4. Can geographic/material heterogeneity create different outcomes under the same program?
5. Can population experience housing without Housing owning political response?
6. Can measurement lag without becoming a live alias or reconstruction hack?
7. Is the model deliberately bounded rather than a universal housing/economic simulator?

No housing implementation and no post-GL0 material-domain breadth is authorized by this document.
