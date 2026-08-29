# Living Country Step 3 — Detached Population/Geography Audit

Status: **ASSESSMENT AUDIT EVIDENCE — PRESERVED FOR REVIEW. NOT PRODUCT, ARCHITECTURE, DOMAIN, CALIBRATION, UI, ROADMAP, SCHEMA, RUNTIME, OR IMPLEMENTATION AUTHORITY.**

Audited candidate:

- `docs/product-assessment/18_LIVING_COUNTRY_POPULATION_GEOGRAPHY_SUBSTRATE.md`
- Candidate commit: `43def7fe60c4e83980f1631cc31cee3ec2dc26ec`

Reviewed supporting evidence:

- `19_LIVING_COUNTRY_STEP3_SELF_AUDIT.md`
- accepted Step 5, Living Country Step 1, and Living Country Step 2 authority;
- frozen production population/geography implementation at `44c1724962830225e6fc34f41d0df0cfdb7dfec0`;
- current I4 population artifacts and acceptance tests.

Audit gate:

> **Can one canonical weighted population support household/person continuity, domain-owned associations, materially necessary cross-domain correlations, demographic change, and several overlapping geographic frames without global cross-product cohorts, duplicated people, fake local precision, silent independence assumptions, or permanent fragmentation from every project and information artifact?**

This audit does not select implementation classes, carrier counts, synthesis algorithms, geography libraries, calibration dates, domain depth, UI, EA scope, or roadmap order.

---

# Binary verdict

## **REVISE — THREE HIGH CONTRACT GAPS, THREE BOUNDED CLARIFICATIONS**

The central substrate direction is credible and should be retained:

> one weighted household-aware population fabric, domain-owned sparse associations, selectively persistent joint structure, and typed overlapping geography.

The candidate correctly rejects the two destructive extremes:

- separately simulated populations for each domain;
- one global Cartesian cohort table carrying every domain status, information receipt, and geography.

However, the candidate does not yet pass its own gate because three objects that carry load-bearing identity remain under-specified:

1. population scopes;
2. weighted crosswalks;
3. coarsening equivalence.

Each can still become a hidden second population, shadow domain owner, or future-aware representation controller.

Three further clarifications are required for household/person accounting, residence allocation, and lifecycle association closure.

The result is a bounded **REVISE**, not rejection of the model.

---

# What passes cleanly

## P-01 — The candidate preserves one ordinary population

The design maintains one canonical population identity/weight/residence/political-continuity system. Domain roles such as worker, patient, renter, audience, beneficiary, and voter remain associated facts or derived scopes.

## P-02 — PopulationState is not made owner of all social facts

Labor, Income, Housing, Health, Education, Information, and elections retain their own facts. PopulationState is limited to population identity/weight/continuity, residence, household/co-residential relation where accepted, and recipient political state.

## P-03 — Household context is causally justified and bounded

The candidate identifies household context as necessary for shared Housing costs, pooled resources, dependent coverage, eligibility, migration, and political experience. It does not equate household with family, tax unit, benefit unit, insurance unit, consumption unit, or voter unit.

## P-04 — Group quarters survive outside private-household assumptions

The candidate provides a legitimate semantic path for college, nursing, correctional, military, shelter, and other collective populations without creating a second population owner.

## P-05 — Domain-local partitions avoid automatic global cross-products

Labor, Housing, and Health may partition the same population differently. A global joint partition is created only when another supported process requires the same subset.

## P-06 — Query honesty is strong

The exact / modeled / bounded / unsupported distinction prevents unsupported correlations from becoming exact cross-tabs. Separate marginal estimates are not silently multiplied into joint truth.

## P-07 — Information and project exposure are not universal split triggers

Publication, delivery, and most domain-local exposure can remain sparse records/scopes. The current I8 pattern of storing every exposure reference inside the global cohort is correctly retained only as bounded proof behavior.

## P-08 — Geography is plural, typed, and time-aware

The candidate recognizes containment, overlap, network, origin-destination, catchment, event, service, market, and electoral relationships. Boundaries and definitions retain effective-time/vintage semantics.

## P-09 — No universal finest geographic atom is assumed

Selective refinement may occur where gameplay needs it. The candidate does not require block-level national population assignment merely because such geography exists.

## P-10 — Demographic and migration accounting is separated from representation refinement

Births, deaths, immigration, emigration, internal migration, household changes, and cohort splits have different semantic effects. Refinement itself does not change population totals.

## P-11 — Current implementation is evaluated honestly

The document preserves conservation, deterministic lineage, persistence, no district-owned population, artifact provenance, and bounded split/merge capability.

It correctly refuses to treat state-level renter cohorts, two modeled project catchments, and one uniform CVAP allocation as the final country population.

---

# Failed contracts

## R3-01 — HIGH — Persistent population scopes lack one closed semantic identity/ownership rule

### Finding

The candidate depends heavily on `population scope` as the bridge among:

- canonical population carriers;
- domain-local partitions;
- direct material experience;
- cross-domain outputs;
- information delivery;
- household effects;
- electoral and political queries.

But the candidate describes a scope as a “semantic reference” and allows it to be exactly represented, refined, modeled, bounded, or unsupported without deciding what kind of owner or record carries a persistent scope.

The following are not equivalent:

1. an exact subset created by a Population-owned split;
2. a Labor-owned allocation over a population carrier;
3. a model-estimated joint distribution persisted as an information/model artifact;
4. an ephemeral query result;
5. an event-specific affected population reference.

If they all share the informal word `scope`, domains can treat equal weights as equal people or silently maintain competing slices.

### Exploit

```text
Labor: 10,000 separated workers
Income: 10,000 reduced-income people
Healthcare: 10,000 coverage-loss people
```

Without shared lineage or a declared mapping, equal weights do not establish that the three records refer to the same people.

Conversely, if every domain promotes its slice to a persistent canonical scope, the design has recreated multiple population owners.

### Required repair

Define a closed scope taxonomy and one-owner rule.

At minimum distinguish:

- **Population-owned exact scope/partition record** — conserved subset or relationship over population lineage;
- **Domain-owned association allocation** — domain fact assigned over population references, not reusable as universal membership;
- **Modeled/bounded scope artifact** — estimate with method, uncertainty, controls, and as-of time;
- **Ephemeral derived query** — noncanonical result;
- **Occurrence-linked affected scope** — stable reference attached to a causal event and derived from one of the above.

Every persistent load-bearing scope must declare:

- semantic owner/type;
- source carrier or scope identities;
- population and/or household weight unit;
- partition, complement, or overlap relationship;
- effective time;
- allocation derivation;
- exact/modeled/bounded status;
- lineage;
- whether cross-owner reuse is legitimate.

Scope weight may not mutate independently from its source relationship.

Overlapping scopes may not be summed unless their intersections are resolved or the aggregation explicitly handles overlap.

### Why this fails the gate

The gate requires one population without duplicated people. An under-specified persistent scope is the most direct remaining path to duplicated people.

---

## R3-02 — HIGH — Weight-specific crosswalks are assigned too loosely to GeographyState

### Finding

The candidate permits GeographyState to own canonical crosswalk relationship definitions and later lists:

- population-weighted crosswalks;
- household-weighted crosswalks;
- housing-unit-weighted crosswalks;
- employment/job-weighted crosswalks;
- model-estimated allocations.

The geographic source/target identities, geometry, containment, adjacency, and exact geometric overlap are spatial facts.

The weighting values are not purely spatial facts:

- population weights change when population moves;
- job weights change when employment changes;
- Housing weights change when stock changes;
- service use changes when institutions and behavior change.

If Geography owns those changing weights as current truth, it becomes a shadow owner of other domains.

Operational frames create another ambiguity. A hospital catchment, school service area, utility territory, media market, or grid region may have spatial support, but its operative membership/assignment can be owned by a service institution or domain rather than by generic Geography.

### Required repair

Separate three categories:

1. **Geography-owned spatial state**
   - geographic identity/type;
   - geometry/support;
   - vintage/effective time;
   - exact containment/overlap/topology;
   - stable spatial references.

2. **Domain/institution-owned operational relation**
   - service-area assignment;
   - grid membership;
   - program catchment;
   - media-market operation;
   - provider network;
   - workplace relation;
   - another nonspatial or partly institutional membership rule.

3. **Weight-specific transformation/crosswalk product**
   - population-, household-, job-, Housing-, service-, or exposure-weighted allocation;
   - owned by the deriving measurement/model/transformation process or persisted artifact;
   - references the source canonical owners and their as-of time;
   - may initialize or inform receiver-owned allocations but never becomes live source truth.

Geography may index or reference the latter two. It may not own the nonspatial weighting fact.

### Why this fails the gate

The gate requires overlapping geographic frames without duplicated population or contradictory domain state. Current wording leaves a shadow-owner path through crosswalks.

---

## R3-03 — HIGH — Coarsening equivalence is not yet explicitly non-omniscient

### Finding

The candidate’s future-consumer equivalence idea is the right escape from eternal fragmentation. But “every accepted future consumer” is ambiguous.

A representation controller must not inspect future random draws, future actor choices, future player actions, future shocks, or future information exposure and decide that a distinction can be discarded because it happens not to matter on this seed.

That would make coarse/fine representation depend on hidden future history.

### Required repair

Coarsening may evaluate only:

- currently accepted process contracts in the active product/configuration version;
- active and scheduled owner processes;
- unresolved legal/program/household/domain obligations;
- persistent recipient state and memory that supported processes can consume;
- declared measurement, election, and query requirements;
- retained sufficient distributions/mixtures and uncertainty.

It may not inspect realized future outcomes.

A distinction may be retired when all currently supported consumers receive equivalent answers from the coarsened current representation and the required history remains separately preserved.

If a later product version introduces a new consumer, the world may:

- refine prospectively from retained distributions and current controls;
- use a modeled or bounded reconstruction with explicit uncertainty;
- report the historical cross-tab as unsupported.

It may not recreate exact lost personal history.

### Why this fails the gate

The gate requires a coherent persistent population without omniscient shortcuts. Future-aware coarsening would be an omniscient shortcut even if no people were numerically duplicated.

---

# Bounded clarifications

## R3-04 — MEDIUM — Dual household/person weight reconciliation must be explicit

The weighted household bundle needs separate household and person accounting.

Required invariant:

```text
represented person weight for each member role/class
= represented household weight × declared member multiplicity/distribution
```

or another declared reconciliation relation.

Birth, death, member entry/exit, household formation/dissolution, split, and merge must identify which totals change:

- a member death may change person count without changing household count;
- household dissolution can change household count without creating or destroying persons;
- birth changes person/member composition without automatically creating a new household;
- a two-child household bundle cannot be merged with a one-child bundle as identical household state unless a sufficient distribution is retained.

Group-quarters person totals reconcile separately from private-household totals.

## R3-05 — MEDIUM — Residence support requires conserved allocation, not repeated full membership

At a selected residence resolution, person and household weight distributed over mutually exclusive residence supports must sum to the carrier/scope total.

A carrier may be exact at a coarse geography and modeled over finer geographies. The finer allocations are not multiple full residences.

Membership in congressional districts, media markets, service areas, grids, project catchments, or disaster footprints is a separate relationship or derivation. It does not add residence weight.

The repair should distinguish:

- exact current residence;
- modeled distribution of weighted carriers over finer residence zones;
- temporary/secondary presence where supported;
- overlap with non-residence geographic frames.

## R3-06 — MEDIUM — Lifecycle changes require current-association closure

A death, migration, household transition, split, merge, or lineage replacement cannot leave current domain relations attached to retired or incompatible population identity.

Required rule:

- the population transition creates one canonical occurrence and source/replacement lineage;
- domain owners independently resolve continuation, transfer, reclassification, or termination of their current associations;
- no current association may point to nonexistent/retired population identity without a valid successor mapping;
- historical associations remain history rather than being rewritten.

Population does not determine the domain consequence. It supplies the authoritative identity transition the domain must consume.

---

# Additional epistemic clarification

## E-01 — Persistent-correlation admission must name a supported consumer

The candidate’s rule that a correlation may persist when a later presidential situation would differ is valid only when the design names the causal path or accepted process that needs it.

“Could matter politically someday” is not sufficient.

A retained correlation should identify:

- the supported process or query;
- which owners consume it;
- why separate marginals are insufficient;
- expected duration;
- retirement condition.

This is a tightening of the candidate’s own correlation-obligation record, not a new design direction.

---

# Research verification

The external-source claims support the candidate’s broad source strategy:

- ACS PUMS contains disclosure-protected person and housing-unit records and supports household context and group-quarters persons, but public-use geography is limited to nation/state/PUMA rather than exact tract or district assignment.
- LEHD/LODES distinguishes residence-area, workplace-area, and origin-destination employment and is based on tabulated/modeled administrative data subject to nonsampling error.
- Census relationship files explicitly represent relationships between geography types and across time.

These source properties support typed geography, synthetic household structure, and explicit modeled/bounded local allocation. They do not prescribe one implementation algorithm.

---

# Exact repair boundary

Repair only:

1. population-scope taxonomy, ownership, lineage, partition/overlap, and aggregation rules;
2. Geography versus domain/institution versus weight-specific crosswalk ownership;
3. non-omniscient coarsening equivalence;
4. dual household/person accounting;
5. conserved residence allocation;
6. lifecycle-to-domain-association closure;
7. named-consumer requirement for persistent correlations.

Do not add:

- exact carrier classes;
- exact databases or schemas;
- exact synthesis algorithm;
- exact carrier counts;
- full demographic transition formulas;
- final geography inventory;
- actor/administration design;
- cross-domain formulas;
- media/public-belief design;
- calibration-date selection;
- UI;
- EA scope;
- roadmap;
- implementation proof.

---

# Re-audit disposition

After a bounded controlling repair, rerun the same gate unchanged.

A PASS should mean only that the semantic substrate no longer requires duplicate populations, a Cartesian global cohort table, shadow geographic ownership, silent independence, fake precision, future-aware coarsening, or eternal fragmentation.

It will not prove performance, calibration quality, implementation feasibility, or fun.

No Living Country Step 4 work should begin before that repair passes.