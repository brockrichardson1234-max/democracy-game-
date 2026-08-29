# Living Country Step 3 — Final Population/Geography Contract Repair

Status: **LIVING-COUNTRY DESIGN REPAIR CANDIDATE — PRESERVED FOR REVIEW. NOT ACCEPTED PRODUCT, ARCHITECTURE, DOMAIN, CALIBRATION, UI, ROADMAP, EARLY-ACCESS, SCHEMA, RUNTIME, OR IMPLEMENTATION AUTHORITY.**

This document repairs only the findings in:

- `19_LIVING_COUNTRY_STEP3_SELF_AUDIT.md`
- `20_LIVING_COUNTRY_STEP3_DETACHED_AUDIT.md`

Candidate under repair:

- `18_LIVING_COUNTRY_POPULATION_GEOGRAPHY_SUBSTRATE.md`
- Commit: `43def7fe60c4e83980f1631cc31cee3ec2dc26ec`

Where this repair conflicts with `18`, this repair controls for final re-audit.

This document does not select an implementation schema, carrier count, synthesis algorithm, exact geographic base, demographic formula, historical calibration date, UI, EA scope, roadmap, or next code proof.

---

# 1. Exact repair boundary

This repair closes only:

1. population-scope taxonomy, semantic ownership, identity, overlap, and aggregation;
2. ownership of spatial relations, operational assignments, and weight-specific crosswalks;
3. non-omniscient current-state coarsening;
4. household/person dual accounting;
5. conserved residence allocation;
6. lifecycle and domain-association closure;
7. named-consumer requirements for persistent correlation.

The central candidate remains:

> **One household-aware weighted population fabric with stable lineage; domain-owned sparse associations; selectively persistent correlations; and typed, versioned, uncertainty-bearing geographic relationships.**

---

# 2. Population-scope taxonomy and one-owner rule

## 2.1 “Scope” is not one kind of state

**[HARD INVARIANT LC-PGR01]** Any population scope used in a load-bearing causal, accounting, measurement, electoral, or cross-domain claim must declare exactly one semantic category and owner.

The accepted categories are conceptual; they do not require one runtime union type.

## 2.2 Category A — Population-owned exact scope or partition relation

A Population-owned exact scope exists when PopulationState can identify a conserved weighted subset through its own canonical identity, lineage, residence, household, or accepted population-owned facts.

Examples:

- children belonging to a declared household bundle;
- the exact affected child of a conserved population refinement;
- population weight currently resident in an exact modeled residence allocation that PopulationState owns;
- a conserved subset created because one population-owned transition affected only part of a carrier.

It must declare:

- scope identity;
- source carrier/scope lineage;
- represented person and/or household weight;
- member-role/multiplicity semantics where relevant;
- effective/as-of time;
- exact partition, complement, or overlap relationship;
- cause/occurrence identity when created by transition;
- active/retired status.

A Population-owned scope does not own employment, Housing, health, income, media delivery, or other domain facts attached to it.

## 2.3 Category B — Domain-owned association allocation

A domain-owned association allocation states that some domain fact applies to a declared amount or distribution of the canonical population.

Examples:

- Labor allocates a carrier across employed, unemployed, and nonparticipating state;
- Housing associates a population scope with renter or owner occupancy;
- Healthcare associates a population scope with coverage relationships;
- Education associates population with enrollment.

The domain owns:

- the domain state;
- its allocation/association relation;
- domain reconciliation;
- domain-specific uncertainty.

It does not own the people.

**[HARD INVARIANT LC-PGR02]** A domain-owned allocation may not be reused by another domain as exact population membership merely because its weight matches another allocation.

Cross-owner reuse requires either:

- a shared Population-owned exact scope;
- an occurrence-linked affected scope derived from one;
- or an explicit modeled/bounded mapping with provenance.

## 2.4 Category C — Modeled or bounded scope artifact

A modeled/bounded scope is an estimate or constrained distribution created from controls, models, measurements, or crosswalks.

It is owned as a model/measurement/information artifact or by the declared transformation process, not as direct population identity.

It must carry:

- source facts and owners;
- method;
- constraints/controls;
- as-of time;
- geography/vintage;
- represented unit;
- uncertainty/residuals;
- `MODELED_WITH_PROVENANCE` or `BOUNDED_BUT_UNRESOLVED` status.

It may inform a domain’s admitted allocation or a forecast. It cannot silently become exact shared identity.

## 2.5 Category D — Ephemeral derived query

An ephemeral query is a read-only result produced from current canonical facts and declared mappings.

It owns no current state and is not reusable later as persistent membership unless separately persisted under Category C or admitted through a canonical Population/domain transition.

## 2.6 Category E — Occurrence-linked affected scope

A causal occurrence may need a stable record of who or what weighted population was affected.

The occurrence-linked scope:

- references the Category A/B/C basis from which it was derived;
- records the affected weight, time, method, geography, and support status as of the occurrence;
- remains historical evidence after current population representation changes;
- does not become a new mutable population.

Example:

```text
plant closure occurrence
→ affected Labor-owned worker association
→ occurrence-linked affected population scope
→ Income and Healthcare receive the same scope identity/mapping
```

The later owners still independently resolve their own consequences.

## 2.7 Scope identity and weight immutability

**[HARD INVARIANT LC-PGR03]** A persisted scope’s represented weight and membership semantics do not mutate in place to follow later population change.

If membership, source population, geography, or support changes, create a new effective-time scope/version or update current Population/domain state through its owner while retaining the earlier occurrence scope as history.

This prevents a historical “10,000 affected workers” scope from silently becoming 9,700 after later migration or death.

## 2.8 Partition, complement, and overlap semantics

A load-bearing scope must state whether it is:

- a complete partition child;
- a partial allocation;
- a complement/remainder;
- a subset;
- an overlapping selection;
- a modeled distribution;
- an unsupported intersection.

For a complete exact partition:

```text
sum(disjoint child weights) = parent weight
```

For overlapping scopes:

**[HARD INVARIANT LC-PGR04]** Overlapping weights may not be summed as unique people unless their intersections are represented, modeled, bounded, or excluded by construction.

Equal weight is never evidence of equal membership.

## 2.9 Cross-domain identity rule

Two domains are following the same affected people only when they share one of:

- the same Population-owned exact scope identity;
- the same occurrence-linked affected scope identity;
- an explicit mapping between their association allocations with declared support and uncertainty.

Labels, geography, and equal totals are insufficient.

## 2.10 Scope retirement

A current exact scope may be retired or coarsened under Section 5. Its historical occurrence identity and source relationships remain queryable.

A domain-owned allocation may end when the domain relation ends. Its history remains with the occurrence/association record.

---

# 3. Geographic ownership and crosswalk repair

## 3.1 Geography-owned spatial facts

**[HARD INVARIANT LC-GR01]** GeographyState owns only spatial identity and spatial relationships at the supported abstraction, including where applicable:

- geographic identity and type;
- geometry or spatial support;
- effective interval/vintage;
- exact spatial containment;
- exact geometric overlap;
- adjacency/topology;
- stable spatial references;
- geometry-derived area measures.

Geography does not own changing population, household, job, Housing, service-use, media-audience, or material-flow weights.

## 3.2 Domain/institution-owned operational relations

A service, market, network, administrative, or organizational geography may combine spatial support with nonspatial operating rules.

The relevant domain or institution owns operational relationships such as:

- utility or grid service membership;
- provider network or hospital referral relation;
- school or program service assignment;
- Housing-market classification;
- workplace or commuting relation;
- media-market/outlet service relation;
- grant/program catchment;
- emergency operational zone;
- supply/network routing.

Those owners reference GeographyState for places and geometry.

A map may project the relationship without becoming its owner.

## 3.3 Weight-specific crosswalk products

**[HARD INVARIANT LC-GR02]** A population-, household-, housing-unit-, job-, service-, audience-, or exposure-weighted crosswalk is not intrinsic GeographyState merely because it relates two geographies.

It is produced by a declared transformation/measurement/model process from:

```text
source and target geographic state
+ weighting owner’s as-of canonical facts or measurement
+ method and controls
→ crosswalk product/artifact
```

Examples:

- population-weighted district/metro crosswalk reads PopulationState;
- job-weighted county/labor-market crosswalk reads Labor;
- housing-unit-weighted crosswalk reads Housing;
- service-use-weighted crosswalk reads the relevant service domain;
- audience-weighted crosswalk reads Information/Population facts as permitted.

The product must carry:

- source and target geography/vintage;
- weighting owner/fact and as-of time;
- unit/denominator;
- method;
- conservation rule;
- uncertainty/residuals;
- exact/modeled/bounded status;
- producer/transformation provenance.

Geography may index or reference the product. It may not own the changing weighting fact.

## 3.4 Receiver-owned resulting allocation

A crosswalk product does not directly mutate a receiver.

The receiving owner:

- validates applicability and vintage;
- decides whether to admit it;
- performs its own conversion;
- owns resulting receiver state;
- records the admitted transformation.

A stale population-weighted crosswalk remains a historical/model artifact. It does not keep updating or overwrite current population automatically.

## 3.5 Exact geometric overlap is not population overlap

An exact polygon intersection can be Geography-owned.

The number of people, jobs, households, Housing units, or voters in that intersection remains separately derived or modeled.

Area weighting may be used only as an explicitly classified model with supported limitations.

## 3.6 Crosswalk refresh and versioning

When source population, jobs, Housing, operational membership, or geography changes materially, a new crosswalk version may be produced.

Prior versions remain historical artifacts with their as-of inputs.

No crosswalk rewrites past residence, employment, election, or service records.

---

# 4. Household and person dual-accounting repair

## 4.1 Separate represented units

**[HARD INVARIANT LC-HP01]** A household-aware carrier must distinguish represented household weight from represented person weight.

A valid bundle must declare either:

1. member roles with multiplicities/distributions relative to household weight; or
2. another explicit person-household reconciliation relationship.

Simple deterministic example:

```text
household weight = 100
adult multiplicity = 1
child multiplicity = 2

represented adults = 100
represented children = 200
represented persons = 300
```

A heterogeneous member distribution may be retained instead of fixed multiplicity if required.

## 4.2 Conservation dimensions

Refinement, coarsening, movement, and transitions must reconcile separately:

- represented private-household count/weight;
- represented persons by member role/class;
- group-quarters person weight;
- total represented population.

A change in one is not automatically a change in all.

## 4.3 Transition effects

- Birth increases represented person/member weight; it does not automatically increase household count.
- Death decreases represented person/member weight; it decreases household count only when a household dissolves or is reclassified.
- Household formation/dissolution changes household relationships/counts without creating or destroying persons.
- Member entry/exit changes composition and may require refinement without changing national person total.
- Movement changes residence allocation; it does not inherently change household/person totals.
- Movement into group quarters may end or change private-household membership while preserving person identity/weight.

## 4.4 Split and merge requirements

When only part of a household class changes, split the affected household weight with lineage or use an equivalent conserved relational update.

Two household bundles may not merge as identical if their member distributions remain relevant to a supported consumer.

A sufficient mixture/distribution may permit coarsening when Section 5 is satisfied.

## 4.5 No cross-unit substitution

A household-weighted estimate cannot be substituted for a person-weighted estimate without member/multiplicity conversion.

A person-weighted crosswalk does not automatically preserve households, and vice versa.

---

# 5. Non-omniscient coarsening and correlation retirement

## 5.1 Supported-consumer closure set

**[HARD INVARIANT LC-CO01]** Coarsening is evaluated against a declared **supported-consumer closure set**, not against the realized future history of the current seed.

The closure set may include:

- all process contracts supported by the active product/configuration version;
- active and scheduled transitions;
- unresolved legal, fiscal, program, household, and domain obligations;
- current domain associations;
- recipient-owned beliefs/memories that supported political/electoral processes may consume;
- declared measurement, election, eligibility, and query requirements;
- save/load and historical-reference requirements.

It does not include knowledge of which future actor choice, player action, shock, election result, story, or random branch will actually occur.

## 5.2 Coarsening proof

A current refinement may be coarsened only when the design/runtime can demonstrate, for the supported-consumer closure set, that:

- owner-specific current state is equivalent or preserved in a sufficient mixture/distribution;
- all required joint correlations remain available at the support/uncertainty level each consumer requires;
- domain partitions reconcile;
- household and person totals reconcile;
- residence and other active relations remain coherent;
- historical occurrence and scope identities remain preserved;
- uncertainty is not understated;
- no active obligation references a retired current identity without successor mapping.

## 5.3 No seed look-ahead

**[HARD INVARIANT LC-CO02]** Coarsening logic may not inspect future event queues beyond currently scheduled/known owner obligations, future random draws, latent future actor choices, player choices, or eventual election outcomes to decide whether a distinction matters.

Equivalent worlds with the same current canonical state and supported-consumer set should make the same coarsening decision regardless of hidden future randomness.

## 5.4 Later product-version deepening

If a later accepted feature requires a correlation that was not preserved:

- refine prospectively from current retained distributions/controls;
- use a model/bounded estimate with provenance and uncertainty;
- or report the historical/current query unsupported.

The system may not claim to recover exact historical individual membership after that identity was not retained.

## 5.5 History versus current fragmentation

Historical differences do not require eternal current carrier separation when:

- the occurrence records remain preserved;
- recipient/domain current state no longer differs in a supported way;
- the supported-consumer closure set is satisfied.

But a historical exposure or experience whose memory still affects supported political behavior remains current recipient state and can prevent coarsening.

---

# 6. Persistent-correlation admission and retirement

## 6.1 Named-consumer requirement

**[HARD INVARIANT LC-PC01]** No correlation becomes shared persistent population structure merely because it could matter politically someday.

The admission record must name:

- the supported process, coupling, measurement, election, eligibility rule, or player-information query;
- the owners that consume the correlation;
- why separate marginals or domain-local partitions are insufficient;
- required exact/model/bounded support;
- effective time and expected duration;
- retirement/coarsening condition;
- source evidence or causal occurrence;
- uncertainty.

## 6.2 Presidential relevance must be demonstrated

The candidate’s criterion “a later presidential situation would materially differ” is valid only when a concrete causal path is identified.

Invalid:

> renter × occupation × age might matter in a future policy.

Valid:

> the accepted unemployment-to-employer-coverage coupling must preserve which separated workers carry dependent coverage because the later program-load and fiscal consequences differ.

## 6.3 Domain-local first

When only one domain consumes the distinction, prefer a domain-local association or distribution.

Promote it to shared population structure only when cross-owner identity must survive.

## 6.4 Retirement

A correlation obligation may retire when:

- its named consumers no longer require separate current state;
- applicable obligations/processes have ended;
- relevant current belief/memory has converged or is preserved in a sufficient distribution;
- Section 5 coarsening proof passes.

The historical cause remains recorded.

---

# 7. Conserved residence-allocation contract

## 7.1 Residence is a population-owned relation

PopulationState owns current residence linkage/allocation at the supported resolution.

**[HARD INVARIANT LC-RA01]** At any one residence resolution and as-of time, the person/household weight allocated across mutually exclusive residence supports must reconcile to the source carrier/scope weight.

For a carrier distributed across finer residence zones:

```text
sum(fine residence allocation weights)
= carrier weight
```

The carrier is not fully resident in every zone.

## 7.2 Exact coarse, modeled fine

A population carrier may be exactly known at state level and modeled across PUMAs, tracts, counties, districts, or other fine supports.

The coarse and fine representations do not compete when:

- the fine allocations reconcile to the coarse control;
- support status and method are explicit;
- uncertainty is preserved;
- current residence ownership remains PopulationState.

A fine modeled allocation is canonical model state for the simulated world only after admission. It remains classified as modeled relative to real-world observation.

## 7.3 Overlapping non-residence memberships

The same resident may also be associated with:

- electoral district;
- media market;
- labor market;
- service area;
- grid region;
- disaster footprint;
- project catchment.

Those relations do not add residence weight.

They are derived or owned by their relevant domains/institutions under Section 3.

## 7.4 Split and secondary residence

Private-household members normally share residence at the supported abstraction.

Split residence, temporary absence, custody, military assignment, institutional placement, or unhoused location may be represented when a supported process needs it.

Such state requires explicit allocation/status semantics; it cannot be implied by duplicating full person weight across locations.

## 7.5 Residence transitions

A move occurrence must identify:

- source residence allocation;
- destination allocation;
- affected person and household weight;
- effective time;
- household/member relationship effects;
- lineage;
- uncertainty/model status;
- links to Housing occupancy or other owner-specific transitions where represented.

Internal movement conserves national population.

---

# 8. Population lifecycle and domain-association closure

## 8.1 Identity transition record

**[HARD INVARIANT LC-LF01]** Any population transition that retires, splits, merges, creates, removes, or changes the applicability of current population identity must produce one canonical occurrence and a lineage/replacement map.

The map may indicate:

- parent to children;
- several parents to coarsened successor;
- person/member weight created by birth;
- person/member weight removed by death;
- household relation created/ended;
- residence changed;
- group-quarters transition;
- no successor for terminated person weight.

## 8.2 Domain-owner response

Domain owners independently determine what the population transition means for:

- jobs;
- earnings;
- Housing occupancy;
- insurance/program enrollment;
- education/service relation;
- benefits;
- information audience/recipient state;
- other domain associations.

Population does not directly rewrite those domain facts.

## 8.3 No dangling settled current relationships

**[HARD INVARIANT LC-LF02]** No settled current domain association may point to retired, nonexistent, or incompatible population identity without a valid active successor mapping.

A multi-owner transition need not be one atomic implementation transaction. During resolution it may have explicit pending state.

But the world may not present the transition as settled while current owners contradict each other.

Examples:

- a dead person scope cannot remain currently employed;
- a moved household cannot remain currently assigned to an ended occupancy relation without an explicit pending/exception state;
- a coarsened carrier cannot leave a job association attached only to retired child identity without successor mapping;
- a new child does not inherit a parent’s ballot or employment relation.

## 8.4 Historical continuity

Prior associations remain historical records linked to the old identity/scope and transition occurrence.

Lifecycle closure changes current state; it does not rewrite the past.

## 8.5 Failure and partial resolution

If a domain cannot immediately resolve the transition:

- record a pending/reconciliation-required state;
- preserve the population occurrence;
- prevent the unresolved relationship from being treated as final compatible state;
- expose uncertainty or administrative lag where it is part of the world.

This permits realistic administrative delay without accepting silent contradiction.

---

# 9. Repaired use of population scopes in the Step 3 proofs

## 9.1 Manufacturing job loss

- Labor owns worker-job associations and the separation occurrence.
- The affected workers are referenced through either an exact Population-owned scope or a Labor allocation plus an occurrence-linked affected scope with support status.
- Income and Healthcare receive that same occurrence-linked identity or an explicit mapping; they do not create equal-weight replacement scopes.
- Household effects require the household/person relation and dual accounting.
- Unknown renter/coverage intersections remain modeled, bounded, or unsupported.

## 9.2 Hurricane footprint

- Geography owns storm geometry only if the relevant material/emergency owner admits or references it; the storm domain owns occurrence/intensity/damage facts.
- Population exposure uses a population-weighted transformation product with as-of state.
- Energy, Housing, Labor, and media owners use their own spatial/operational relations.
- No one crosswalk is reused for people, jobs, Housing units, and service outages.

## 9.3 Local investigation

- Information delivery references an audience scope.
- Publication does not create an exact population scope by itself.
- Recipient divergence becomes shared persistent state only when notice/incorporation creates a supported political-memory difference.
- Hundreds of stories do not imply hundreds of global carrier dimensions.

## 9.4 Household move

- Population owns conserved source/destination residence allocation.
- Housing owns occupancy departure/entry.
- Labor workplace relation continues unless Labor receives a separate transition.
- Electoral, media, service, and grid membership are derived or separately owned.
- Domain associations reconcile through the lifecycle/replacement map.

---

# 10. Repaired falsification tests

## Test A — equal-weight shadow scopes

Create Labor, Income, and Healthcare scopes of 10,000 with different lineage.

**Required result:** they cannot be treated as the same people without a shared scope identity or explicit mapping.

## Test B — overlap double counting

Add two audience scopes whose members overlap.

**Required result:** the UI/query cannot sum them as unique reach unless overlap is represented or modeled.

## Test C — Geography shadow ownership

Create a 2025 population-weighted crosswalk, then move population in 2026.

**Required result:** the 2025 product remains an as-of artifact; Geography does not own or auto-update population weights; a new product is required.

## Test D — operational catchment

Change a hospital network’s service assignment without changing polygon geometry.

**Required result:** Healthcare/institutional relation changes; Geography remains spatial support.

## Test E — seed-aware merge

Two worlds share identical current state but have different future random shocks.

**Required result:** coarsening decision is identical because future realized randomness is not an input.

## Test F — later feature needs discarded correlation

A later product version needs renter × occupation history that was never preserved.

**Required result:** prospective modeled refinement or unsupported historical answer; no fabricated exact history.

## Test G — member death

One adult dies in part of a weighted two-adult household bundle.

**Required result:** affected household bundles refine; person count changes; household count changes only if household transition rules say so; domain relations close or remain pending explicitly.

## Test H — multi-district residence

A state-level carrier is modeled across three districts.

**Required result:** district allocations sum to source weight; the carrier is not counted fully in each district.

## Test I — dangling employment

Population identity is retired after death or merge while Labor retains an old current association.

**Required result:** the world records unresolved reconciliation and may not treat the old association as settled current employment.

## Test J — hypothetical correlation

A designer says a detailed cross-tab might matter someday.

**Required result:** no shared persistent correlation without a named supported consumer and causal path.

---

# 11. Controlling corrections to the candidate

For final audit and any later authority action:

1. `Population scope` is governed by the taxonomy in Section 2; it is not one generic persistent object.
2. GeographyState does not own population/job/Housing/service-weighted values merely because they form a crosswalk.
3. “Future consumer equivalence” means equivalence for the supported-consumer closure set, never hidden future outcomes.
4. Household-aware carriers require separate person and household accounting.
5. Residence distributed over fine supports is a conserved allocation, not repeated full membership.
6. Lifecycle transitions require active association closure or explicit pending state.
7. Persistent correlations require named accepted consumers and retirement conditions.

---

# 12. Explicitly not resolved

This repair still does not decide:

- exact carrier classes;
- exact scope data structure;
- exact intersection/partition algorithm;
- exact household synthesis;
- exact member-role categories;
- exact transition rates;
- exact national geography inventory;
- exact crosswalk-production engine;
- exact carrier/coarsening benchmark;
- exact domain-association storage;
- exact media audience model;
- exact political-memory model;
- final calibration date;
- UI, EA, roadmap, or implementation order.

---

# 13. Final repair disposition

Rerun the Step 3 gate unchanged:

> **Can one canonical weighted population support household/person continuity, domain-owned associations, materially necessary cross-domain correlations, demographic change, and several overlapping geographic frames without global cross-product cohorts, duplicated people, fake local precision, silent independence assumptions, or permanent fragmentation from every project and information artifact?**

This repair claims no authority until that detached gate returns PASS.