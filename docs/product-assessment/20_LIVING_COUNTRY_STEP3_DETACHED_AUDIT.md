# Living Country Step 3 — Detached Audit

Status: **ASSESSMENT AUDIT EVIDENCE — PRESERVED FOR REVIEW. NOT ACCEPTED LIVING-COUNTRY, PRODUCT, ARCHITECTURE, POPULATION, GEOGRAPHY, UI, CALIBRATION, ROADMAP, OR IMPLEMENTATION AUTHORITY.**

Audited candidate:

- `19_LIVING_COUNTRY_POPULATION_AND_MULTI_GEOGRAPHY_CONTRACT.md`
- Candidate commit: `0569120315b6280c508b528a9d95016a2886ade1`
- Scratch branch: `assessment/living-country-step3-scratch`

Accepted authority beneath the candidate:

- Step 5 presidential-game authority: `2c5fc2d798c5fcc232b519052390b56d60f06267`
- Living Country Step 1: `11` as controlled by `12`
- Living Country Step 2: `13` as controlled by `16`

Audit gate:

> **Can one canonical weighted population and a versioned multi-geography system support heterogeneous domain incidence, household/dependency relationships, mobility, elections, measurement, information exposure, historical continuity, and bounded national-to-local drill-down—without cloned people, giant Cartesian cohorts, fake disaggregation, incompatible geographic frames, repeated event consumption, lost history, or geography becoming political/material ontology?**

This audit does not choose the final domain inventory, synthesis algorithm, database schema, UI, historical seam, Early Access scope, or implementation order.

---

# Verdict

## **REVISE — 3 blocking findings, 5 bounded clarifications**

The candidate has the right center:

> **One canonical weighted population, sparse domain-owned relations, adaptive refinement, and multiple versioned geographic frames.**

It correctly rejects separate workers/patients/voters/audiences populations, a universal citizen row, a giant Cartesian cohort, state averages copied into counties, PUMS rows treated as real people, residence used as every other location, and redistricting treated as migration.

It also improves substantially on the current I4 fixture by adding household composition, mobility, functional geographies, source universes, calibration uncertainty, and truthful national-to-local drill-down.

However, three load-bearing gaps still permit the exact failures Step 3 is meant to prevent:

1. separate sparse domain relations can carry individually valid marginals while inventing an unsupported joint population when domains interact;
2. weighted geographic crosswalk ownership is ambiguous enough that GeographyState could become a shadow owner of people, jobs, Housing units, or audiences;
3. refinement is deterministic by cause, but the candidate does not require equivalent worlds to remain invariant to refinement order or representation choice.

These are not requests for implementation algorithms. They are semantic invariants needed before the population/geography substrate can be accepted.

---

# What passes cleanly

## P-01 — One ordinary population remains authoritative

The candidate clearly distinguishes canonical population identity and represented weight, population-owned residence/core social facts, and domain-owned employment, income, Housing, healthcare, education, information, legal/program, and electoral facts.

It rejects domain copies of ordinary people.

## P-02 — The population is factorized rather than flattened

The four-part model is coherent:

- base population partitions;
- sparse owner-specific relations;
- conditional distributions;
- adaptive refinement.

It preserves needed correlations without materializing every possible demographic/domain combination.

## P-03 — Household structure is recognized as load-bearing

The candidate correctly identifies pooled income, dependents, employer coverage, Housing occupancy, taxes/transfers, poverty, migration, childcare, and education as paths that cannot always be represented through isolated person averages.

It keeps household composition separate from household finance, dwelling/tenure, coverage, and program determinations.

## P-04 — Population change is treated as stock and gross flows

Birth, death, aging, migration, group-quarters transitions, household formation/dissolution, and reclassification are distinguished from net population change.

Residence change is separated from boundary change.

## P-05 — Geography is plural and versioned

The candidate supports legal, electoral, statistical, functional, network, service/catchment, and event/hazard frames without forcing them into one nesting tree.

It preserves effective dates, vintages, overlap, adjacency, and historical boundaries.

## P-06 — Coarse-to-fine truth is protected

The candidate requires a source/model, denominator, vintage, uncertainty, and reconciliation before disaggregation.

Unknown local state is allowed. A map cannot manufacture detail.

## P-07 — Calibration sources are used appropriately

PUMS is treated as disclosure-protected sample evidence for synthetic distributions rather than canonical citizens.

LODES is used as evidence that residence, workplace, and origin-destination relations differ.

Source universes and vintages remain explicit.

## P-08 — Elections, polling, and media audiences consume one population

Electorates derive from population, legal eligibility, electoral geography, and contest date.

Polling measures recipient-owned political state.

Media audiences are relations/projections over one population, not cloned people.

## P-09 — Quiet serious conditions remain valid

The hidden regional healthcare-access proof preserves a materially serious condition without automatically creating a national issue, media story, or presidential interruption.

## P-10 — Player-facing drill-down remains bounded

Overview, Detail, Record, and maps are constrained to observed, estimated, modeled, or available information rather than debug truth.

---

# Blocking findings

## R3-01 — HIGH — Independent sparse marginals do not establish cross-domain joint incidence

### Finding

The candidate says domains may retain sparse owner-specific relations or conditional distributions over the same population unit.

That is necessary for performance, but insufficient when a causal path requires the intersection of two or more relations.

Example:

- Labor records that 60% of a population unit is employed by an affected industry.
- Healthcare records that 55% has employer-sponsored coverage.
- Income records a distribution of household earnings.
- Housing records 40% renter occupancy.

Those marginals do not reveal:

- how much of the employer-covered population is in the affected industry;
- which covered workers have dependents;
- which job-loss households are renters;
- whether the same people occupy all or none of those categories.

If each receiving domain independently samples or allocates from the parent unit, the game can create contradictory synthetic people, dependents duplicated across household and coverage relations, effects that vary according to which domain refines first, or unsupported correlation presented as canonical joint truth.

The candidate says refinement can introduce explicit distinctions and unknown correlation remains unknown, but it does not establish the mandatory rule for a cross-domain query that needs a joint intersection.

### Required repair

Add a **Joint Incidence and Correlation Contract**:

1. A domain may own its marginal relation.
2. No owner or projection may infer a cross-domain joint intersection from independent marginals alone.
3. A load-bearing joint query must use one of:
   - an already preserved joint allocation with declared owner/provenance;
   - a shared upstream relationship that causally links the facts;
   - a calibrated conditional/joint model with uncertainty and reconciliation;
   - conservative bounds/range;
   - explicit `unknown/not modeled`;
   - canonical refinement using a stable joint-allocation rule.
4. The owner of a joint relationship must be declared by semantics; the intersection may be derived only through compatible relation identities, not a new god `PopulationCorrelation` owner.
5. Once a joint allocation is resolved canonically for a causal path, every downstream consumer must reference that same allocation/identity rather than redraw independently.
6. Aggregate outputs must reconcile to every participating marginal within declared residuals/uncertainty.

### Falsification test

Given fixed Labor and Healthcare marginals, changing the order in which Income and Healthcare consume a job-loss occurrence must not produce different covered-person totals merely because each sampled separately.

Until this rule exists, the substrate can still produce fake cross-domain people despite nominally having one population.

---

## R3-02 — HIGH — Denominator-weighted geographic crosswalk ownership is ambiguous

### Finding

The candidate says GeographyState owns spatial identity, geometry/topology, containment, adjacency, overlap, and declared crosswalk relationships.

It later correctly states that population-, job-, Housing-, and other denominator-weighted crosswalks differ.

But a population-weighted crosswalk is not purely geographic truth. It depends on Population state at a time. A job-weighted crosswalk depends on Labor/workplace facts. A Housing-unit-weighted crosswalk depends on Housing.

If GeographyState owns all of those as canonical crosswalk facts, it becomes a shadow owner of other domains.

Example:

- geometry can establish that old District A overlaps new District B by 42% of land area;
- it cannot establish that 42% of residents, workers, renter households, or votes moved into B.

### Required repair

Clarify three classes:

### A. Pure spatial relationship

Owned by GeographyState:

- containment;
- adjacency;
- geometric intersection;
- area overlap;
- topology;
- effective boundary lineage.

### B. Denominator-weighted allocation/crosswalk

Owned by the transformation or semantic owner supplying the denominator, with GeographyState as spatial input:

- Population-weighted;
- household-weighted;
- Housing-unit-weighted;
- job/workplace-weighted;
- electorate/ballot-weighted;
- audience/exposure-weighted;
- network-flow-weighted.

It must identify denominator, source facts, time, geography vintages, method, uncertainty, and reconciliation.

### C. Operational membership/meaning

Owned by the relevant institution/domain:

- electoral constituency;
- service area;
- labor market;
- media distribution market;
- program consortium;
- grid region;
- disaster impact class.

Geography supplies footprint and overlap, not operational truth.

### Hard invariant

A denominator-weighted crosswalk may not remain authoritative after the denominator state or relevant geography vintage changes unless it is explicitly a historical snapshot.

---

## R3-03 — HIGH — Refinement must be representation- and order-invariant

### Finding

The candidate requires stable cause keys, conservation, lineage, no query-triggered refinement, and no repeated event application.

It does not require equivalent causal histories to produce equivalent aggregate results when refinement occurs in a different order.

Example:

Path A:

1. split a unit for media exposure;
2. split exposed child for job loss;
3. resolve coverage transition.

Path B:

1. split the unit for job loss;
2. split affected child for media exposure;
3. resolve coverage transition.

Both paths represent the same people, events, weights, and dates. A naive refinement implementation can produce different child identities, joint allocations, belief totals, eligibility counts, or election outcomes.

Similarly, one world may keep a conditional distribution coarse until a job loss, while another equivalent world was refined earlier for a measurement. The representation choice must not change unrelated outcomes.

### Required repair

Add a **Representation Invariance Contract**:

1. Equivalent canonical facts and event ordering must produce equivalent supported aggregates regardless of:
   - order of orthogonal refinements;
   - whether a distinction was explicit before an event or resolved from a compatible distribution at the event;
   - later merge/coarsening.
2. Stable allocation/randomness keys derive from semantic identities and causal occurrences, not transient child-list order.
3. Refinement lineage supports commutative intersection or an equivalent canonical partition reconciliation when distinctions cross.
4. An event consumed at parent scope before later refinement allocates realized consequences to descendants without rerolling.
5. An event consumed after prior refinement reconciles to the same parent-scope totals and supported joint model.
6. If exact invariance is impossible for a stochastic microdistribution, the contract identifies guaranteed aggregate invariants and classifies finer differences as model uncertainty.
7. UI/projection refinement never alters canonical state.

### Falsification tests

- exposure-then-job-loss versus job-loss-then-exposure;
- state-to-county modeled refinement before versus after an official measurement;
- merge and re-split with no new world input;
- redistricting relationship update before versus after a population query.

Without this invariant, adaptive resolution itself can become a hidden causal actor.

---

# Bounded clarifications

## C-01 — Birth/death occurrence ownership is overclaimed

PopulationState should own population stock transition, entry/exit/age/residence consequence, and person/household lineage.

But a cause-specific death occurrence may be owned by Health, violence/public-safety, disaster, military, or another material owner. A vital-registration record is an institutional/information artifact.

Clarify:

> Population owns incorporation of a birth/death into population state. The initiating medical/material occurrence and official registration/measurement retain their own semantic owners. One occurrence identity or explicit linked occurrences must be declared under Step 1.

## C-02 — Household membership needs partition/nonpartition semantics

A person cannot belong to two ordinary households at the same effective time unless the representation explicitly models shared/temporary arrangements.

Household allocations must declare whether they are:

- a mutually exclusive person partition;
- a probabilistic/synthetic assignment;
- a nonexclusive dependency/care relation;
- a temporary-presence relation.

Weighted household count and person membership must not be reconciled by treating every relationship as additive.

## C-03 — Named actors need a minimum no-double-counting invariant now

The exact accounting technique can remain unresolved, but Step 3 should require:

- each individualized ordinary-human actor has a declared relationship to the ordinary-population controls;
- individualization cannot add a person on top of controls;
- removing or replacing an officeholder does not alter population weight unless an actual population event occurs;
- actor geography/demographics and population representation cannot contradict each other at the accepted resolution.

## C-04 — Migration does not automatically remap every domain relation

A residence move should notify or make available a changed residence fact.

Each domain independently determines consequences:

- employment may remain at the old workplace;
- insurance may persist temporarily;
- school/service relation may change;
- Housing occupancy resolves separately;
- media exposure changes through future delivery, not retroactively;
- legal eligibility follows applicable rules/effective dates.

Replace “domain references requiring remapping” with owner-specific admission of the residence-change occurrence.

## C-05 — Population controls and measurements must remain distinct

Canonical population controls are valid simulation state.

Official population estimates or Census products are measurement/calibration artifacts.

A newly published estimate does not automatically overwrite canonical population. Reconciliation/update requires an accepted calibration, correction, or demographic transition process.

---

# Attempted falsification

## Test A — Independently sample every domain relation

Result: **candidate fails without R3-01 repair** because unsupported cross-domain intersections can emerge.

## Test B — Use land-area crosswalk to allocate voters

Result: rejected in spirit, but ownership remains ambiguous until R3-02.

## Test C — Refine for information first, then material exposure

Result: conservation alone is insufficient; R3-03 is needed.

## Test D — Copy state rate to counties

Result: rejected cleanly.

## Test E — Import PUMS as citizens

Result: rejected cleanly.

## Test F — Create separate media audience population

Result: rejected cleanly.

## Test G — Redistrict and move residents

Result: rejected cleanly.

## Test H — Treat household as a second person population

Result: rejected, subject to C-02.

## Test I — Let serious hidden condition alert President

Result: rejected cleanly.

## Test J — Make a journalist actor outside population controls

Result: candidate requires no double counting but leaves technique unresolved; C-03 closes minimum semantics.

---

# Research integrity

The Census sources are used within their appropriate claims:

- Census hierarchy guidance supports non-nesting geography.
- GEOIDs and relationship files support versioned identity and cross-type/vintage relationships.
- ACS PUMS is a disclosure-protected sample suited to custom estimation, not a list of identifiable citizens.
- LODES supports separate residence, workplace, and origin-destination employment geography.

No source dictates the proposed game architecture or synthesis method.

---

# Exact repair boundary

Repair only:

1. joint incidence/correlation across sparse domain relations;
2. pure-spatial versus denominator-weighted versus operational geographic relationship ownership;
3. representation/refinement-order invariance;
4. birth/death ownership wording;
5. household partition semantics;
6. named-actor population accounting minimum;
7. owner-specific migration consequences;
8. canonical controls versus official population estimates.

Do not add:

- final domain variables;
- synthesis algorithms;
- performance numbers;
- full demographic model;
- actor AI;
- media depth;
- calibration date;
- generated-prehistory proof;
- UI mockups;
- Early Access scope;
- roadmap;
- implementation plan.

---

# Re-audit gate

After a bounded repair, rerun the same gate unchanged:

> **Can one canonical weighted population and a versioned multi-geography system support heterogeneous domain incidence, household/dependency relationships, mobility, elections, measurement, information exposure, historical continuity, and bounded national-to-local drill-down—without cloned people, giant Cartesian cohorts, fake disaggregation, incompatible geographic frames, repeated event consumption, lost history, or geography becoming political/material ontology?**

A PASS would permit a separate Step 3 authority receipt.

---

# Final audit verdict

## **REVISE**

The candidate has selected the right population/geography architecture.

It has not yet fully prevented:

- independent marginals from fabricating a joint population;
- weighted crosswalks from turning Geography into a shadow material owner;
- adaptive refinement order from changing history.

Those are bounded integrity gaps. Repairing them should not reopen the one-population/factorized/multi-geography direction.
