# Living Country Step 3 — One-Population and Multi-Geography Substrate

Status: **LIVING-COUNTRY DESIGN CANDIDATE — PRESERVED FOR REVIEW. NOT ACCEPTED PRODUCT, ARCHITECTURE, DOMAIN, CALIBRATION, UI, ROADMAP, EARLY-ACCESS, SCHEMA, RUNTIME, OR IMPLEMENTATION AUTHORITY.**

Authority and evidence boundary:

- Accepted production baseline used by the assessment: `44c1724962830225e6fc34f41d0df0cfdb7dfec0`
- Entirely unaccepted Stage 1 candidate: `a7e04ca78ba1ccb06d8dc3a4dfb0d43389804144`
- Accepted Step 5 presidential-game authority: `2c5fc2d798c5fcc232b519052390b56d60f06267`
- Accepted Living Country Step 1 composite:
  - `11_LIVING_COUNTRY_LAYER_OWNERSHIP_CONTRACT.md`
  - controlled by `12_LIVING_COUNTRY_STEP1_CLARIFICATIONS_AND_AUTHORITY.md`
- Accepted Living Country Step 2 composite:
  - `13_LIVING_COUNTRY_COMMON_COUNTRY_STATE_GRAMMAR.md`
  - controlled by `16_LIVING_COUNTRY_STEP2_COMMON_GRAMMAR_AUTHORITY.md`

This document answers the next authorized question:

> **What one-population and multi-geography substrate can support materially different domains without cohort explosion, fake disaggregation, incompatible geographic frames, or duplicated people?**

It does **not** prescribe one runtime class, database shape, in-memory representation, carrier count, synthetic-population algorithm, random process, geographic library, data-loading pipeline, or implementation package.

It does **not** choose:

- the final durable-domain inventory;
- exact domain-depth tiers;
- exact demographic categories;
- exact household, tax-unit, benefit-unit, or family variables;
- exact carrier count or performance target;
- exact geographic base resolution;
- exact calibration sources or estimation method;
- January 2025 or January 2033;
- generated-prehistory implementation;
- final electoral model;
- media/public-belief depth;
- UI surfaces;
- Early Access scope;
- roadmap or next code proof.

---

# Evidence labels

- **[RF — Repository fact]**: established by accepted repository architecture, implementation evidence, or accepted assessment authority.
- **[ER — External research]**: supported by an official source or primary research source listed in Section 24.
- **[DI — Design inference]**: proposed Step 3 contract; not yet authority.
- **[UQ — Unresolved question]**: deliberately deferred.

---

# 1. Executive design verdict

## 1.1 The recommended semantic model

**[DI]** Living Country should use a **hybrid weighted relational population fabric**:

1. one canonical ordinary-population identity and represented-weight system;
2. household-aware and group-quarters-aware population relationships where cross-domain causality requires them;
3. domain-owned facts associated with that population rather than copied into it;
4. sparse population scopes and domain partitions rather than one global cross-product cohort table;
5. selectively persistent joint distinctions only when supported processes must follow the same affected people across time or domains;
6. several typed, overlapping geographic frames connected by provenance-bearing relationships and crosswalks;
7. explicit uncertainty when a joint distribution or fine geography is modeled rather than observed;
8. refinement and coarsening with weight, lineage, accounting, and history preservation.

The substrate should not be understood as either:

```text
340 million individually simulated citizens
```

or:

```text
one global table containing every combination of
age × race × household × job × income × tenure × health ×
insurance × party × media exposure × issue belief × geography
```

It should support detailed correlation **where causally required**, while refusing to make every possible distinction jointly persistent.

## 1.2 Core Step 3 principle

> **Preserve shared identity and required correlations; keep domain-specific state with its owner; materialize joint distinctions only when a supported causal process must remember the same people.**

## 1.3 Why the current proof is not the final substrate

**[RF]** The accepted U.S. production baseline already demonstrates valuable foundations:

- 51 resident-population controls;
- 341,784,857 represented people;
- 106 weighted cohorts;
- exact conservation against state/DC controls;
- deterministic split and merge lineage;
- one residence geography per cohort;
- no district-owned population;
- a state-level CVAP-like eligibility proxy;
- differentiated renter/non-renter exposure;
- two selected project catchments;
- differentiated information receipt;
- persistence through save/load.

**[RF]** The same proof is intentionally narrow:

- initial cohorts are authored aggregate scaffolds, not Census microdata;
- most states contain only renter/non-renter distinctions;
- Colorado and Texas add a modeled 0.001 project-catchment split;
- CVAP share is uniform within a state across current cohort distinctions;
- household structure is absent;
- age, citizenship, migration, labor, income, health, education, and other living-country facts are absent;
- residence is state-level in the weighted population;
- material-exposure references and information-receipt references become part of a cohort’s complete merge signature.

The current split/merge implementation is safe for a bounded proof. If generalized literally, each new project, media exposure, domain status, and political memory could split global cohorts and prevent later merging.

Step 3 therefore preserves conservation, identity, lineage, and owner separation while rejecting the current cohort payload as a universal full-country ontology.

---

# 2. Current repository reality map

| Capability | Current accepted reality | Step 3 disposition |
|---|---|---|
| One canonical ordinary population | Strong architecture and U.S. proof | Preserve |
| State/DC population controls | Authenticated and conserved | Preserve as calibration/control capability, not permanent geographic limit |
| Weighted joint cohorts | Working for renter/catchment/information proof | Preserve as one valid representation technique; do not universalize current shape |
| Deterministic refinement lineage | Strong bounded mechanism | Preserve semantic requirement |
| Merge only equal joint state | Safe but potentially too strict at full scale | Extend with future-consumer equivalence and retained history |
| Population residence | State geography only in current U.S. state | Extend to selectively finer and changing residence support |
| Household structure | Absent | Add as required cross-domain relation |
| Group quarters | Absent | Add conceptual support |
| Domain associations | Housing exposure references embedded in cohort | Replace as universal pattern with domain-owned sparse associations/scopes |
| Information exposure | Receipt references embedded in cohort | Do not split global population for every artifact by default |
| Political state | Housing-specific strings in current proof | Preserve recipient ownership; later support sparse issue/candidate state |
| Eligibility | State-level CVAP proxy allocated over cohorts | Preserve contextual eligibility doctrine; replace uniform proxy when deeper facts exist |
| Multi-geography | States, congressional districts, two project locators | Extend substantially |
| Geographic relationships | Mainly parent links and polygon identity | Extend to overlap, crosswalk, flow, network, catchment, and effective-time relations |
| Demographic change | Absent | Add flows and lineage semantics |
| Migration | Absent | Add residence-change semantics |
| False-detail controls | Artifact limitations are documented | Make support/uncertainty status first-class design requirement |

---

# 3. One population does not mean one giant population object

## 3.1 Canonical population identity

**[DI — HARD INVARIANT LC-PG01]** There is one canonical ordinary-population identity, represented-weight, residence, and recipient-political continuity system.

Every domain, institution, election, measurement, media process, and player-facing projection refers to that population or to declared scopes over it.

No system may create a separately mutable population of:

- workers;
- patients;
- students;
- renters;
- homeowners;
- taxpayers;
- benefit recipients;
- audiences;
- voters;
- disaster victims;
- immigrants;
- energy customers.

Those are roles, statuses, associations, or projections concerning the one population.

## 3.2 Population identity is not ownership of every personal fact

**[DI — HARD INVARIANT LC-PG02]** PopulationState must not become a society-state god object merely because many domain facts describe people.

PopulationState may own cross-cutting population facts and relationships admitted under Section 6. A domain retains facts whose semantic meaning belongs to that domain.

Examples:

- employment status and job relation — Labor/Employment owner;
- earnings and disposable income — Income/Household-Finance owner;
- housing unit, tenure contract, rent burden, vacancy exposure — Housing owner or declared relationship owner;
- insurance enrollment, provider use, health condition — Health/Healthcare owner;
- school enrollment or educational attainment — Education owner if accepted there;
- media delivery occurrence — InformationEnvironment;
- belief, attribution, salience, preference, turnout disposition — Population recipient-political state;
- election participation and result — election process.

## 3.3 Population carriers are semantic, not real people

**[DI]** A runtime may use weighted synthetic carriers to preserve joint structure.

A carrier:

- is a model identity, not a claim that a real person or household exists;
- represents a positive amount of population or households;
- has stable lineage while active;
- can be split when a supported causal distinction affects only part of its represented weight;
- can be coarsened when distinctions are no longer needed and safe equivalence is established;
- may contain household member roles or refer to household/group-quarters relations;
- may be associated with domain-owned facts without absorbing them.

No exact carrier count or technical structure is accepted here.

---

# 4. Household-aware population structure

## 4.1 Why household context is required

**[DI]** A living U.S. simulation cannot preserve important cross-domain causality using disconnected persons alone.

Household or co-residential context can change:

- housing occupancy and cost exposure;
- pooled or shared financial pressure;
- poverty and benefit eligibility;
- employer-sponsored insurance consequences for dependents;
- taxation and filing relationships;
- child care and education exposure;
- migration and household formation;
- direct material experience;
- political interpretation.

A worker losing a job has materially different consequences depending on whether they live alone, support children, have another earner, receive employer family coverage, rent in a high-cost market, or live in group quarters.

## 4.2 Required household semantics

**[DI — HARD INVARIANT LC-PG03]** PopulationState must support a canonical co-residential household relationship sufficient to keep weighted persons and shared residence context coherent where accepted processes require it.

The substrate must be able to represent conceptually:

- a household identity;
- represented household weight;
- member/person-role identities within the weighted household representation;
- membership and relationship roles at the selected abstraction;
- shared or coordinated residence;
- household formation, dissolution, entry, exit, birth, death, and move occurrences;
- lineage when only part of a weighted household class changes.

This is a semantic requirement, not a required `Household` class.

## 4.3 Household is not every other social or legal unit

**[DI — HARD INVARIANT LC-PG04]** Co-residential household, family/kinship, tax unit, benefit unit, insurance unit, consumption unit, and voter unit are not automatically identical.

A later domain or legal/program process may derive or own a different unit from population relationships and applicable rules.

Forbidden:

```text
householdId = taxUnitId = benefitUnitId = insuranceUnitId
```

as a universal assumption.

Step 3 requires enough household structure to preserve supported cross-domain relationships. It does not require a full genealogy or every legal filing unit.

## 4.4 Group quarters and non-household populations

**[DI — HARD INVARIANT LC-PG05]** The substrate may not assume every person belongs to a private household.

It must support population in group or institutional settings where relevant, including potential categories such as:

- college housing;
- nursing or care facilities;
- correctional institutions;
- military quarters;
- shelters or other collective living arrangements.

Group-quarters residence may affect health, education, employment, service, political eligibility, direct experience, and geographic exposure differently.

Exact categories and depth remain unresolved.

## 4.5 Household-aware carrier candidate

**[DI]** A strong candidate representation is a weighted synthetic household/person bundle:

```text
weighted household bundle
├── household/co-residence identity and weight
├── residence support
├── member role A
├── member role B
└── optional additional member roles
```

Each member role represents the same number of corresponding persons as the bundle represents households, subject to declared multiplicity.

If only a fraction of such households experiences a change, the bundle may be refined with lineage rather than pretending every represented household changed.

Group-quarters populations may use a different weighted carrier form while remaining part of the same PopulationState.

This candidate is accepted only as a semantic direction to evaluate. A later implementation may use weighted household records, a sparse relational distribution, a sample-plus-controls hybrid, or another benchmarked representation if it satisfies all Step 3 invariants.

---

# 5. Population-owned core versus domain-owned associations

## 5.1 Admission test for a PopulationState fact

**[DI — HARD INVARIANT LC-PG06]** A fact belongs directly in PopulationState only when all applicable conditions are satisfied:

1. the fact concerns canonical population identity, represented weight, residence, demographic continuity, household/co-residential relation, or recipient-owned political state;
2. multiple supported processes need it as the same persistent population fact, or it is intrinsically part of population identity/continuity;
3. no other material, legal, institutional, information, or electoral owner more accurately owns what the fact is;
4. preserving it directly avoids ambiguity or duplicate ownership rather than merely simplifying a query;
5. its resolution is justified by a later material, institutional, observational, political, or presidential consequence.

A fact does not enter PopulationState merely because it appears on a Census person record or because several domains read it.

## 5.2 Candidate cross-cutting population facts

Potential PopulationState facts may include, where later accepted:

- represented person and household weight;
- residence linkage and movement history;
- age/date-of-birth structure;
- household membership and member roles;
- selected core demographic classifications;
- citizenship/nativity facts where assigned to PopulationState rather than another accepted owner;
- group-quarters status/relationship;
- recipient-owned beliefs, attribution, salience, preferences, memory, and turnout disposition at supported resolution;
- lineage/refinement state.

This is not a final variable list.

## 5.3 Examples that normally remain domain-owned

| Fact | Likely owner | Why not PopulationState by default |
|---|---|---|
| job, employment status, occupation, hours | Labor/Employment | labor-market relationship/state |
| wage and earnings | Labor/Income depending accepted split | economic flow/state |
| pooled household resources/assets/debt | Income/Household Finance | financial state, not identity |
| housing unit and occupancy contract | Housing/declared residential relation | dwelling/material relationship |
| rent, mortgage, cost burden | Housing/Household Finance by semantic split | material/financial outcome |
| health condition | Health | health-domain state |
| insurance coverage/enrollment | Healthcare/program/legal relation | program/service relation |
| school enrollment/attainment | Education | education-domain state unless later fact split says otherwise |
| program eligibility | derived from legal rules plus source facts | eligibility is a consumer, not owner |
| electoral eligibility | derived from election law plus source facts | context-specific legal/electoral result |
| media delivery | InformationEnvironment | information occurrence |
| ballot cast | election process | election-specific action |

## 5.4 Residential consistency without ownership collapse

PopulationState owns current residence linkage under accepted architecture.

Housing may own housing-unit stock and an occupancy/tenure relationship involving a household reference.

A residential transition must therefore have a reconciled cross-owner process:

```text
housing placement/occupancy attempt
→ Housing resolves unit availability and occupancy relation
→ Population receives admitted residence-change result
→ Population changes residence linkage
→ one occurrence identity links both owner-specific consequences
```

No Housing unit may silently move population, and Population may not occupy unavailable Housing stock when that relationship is modeled.

The exact owner of a future residential-placement relationship remains a later Housing/household-domain question. Contradictory current residence and occupancy states are not permitted.

---

# 6. Sparse domain associations

## 6.1 Domain associations do not duplicate people

**[DI — HARD INVARIANT LC-PG07]** A material/social domain may maintain its own facts and partition those facts over references to the canonical population. It may not create a second authoritative population identity or independent total population weight.

A domain association must identify:

- population carrier/scope reference;
- represented person or household quantity and unit;
- as-of or interval time;
- domain-specific state;
- geography or entity relation where applicable;
- provenance and uncertainty;
- reconciliation rule within that domain.

## 6.2 Domain-local partitions

A domain may partition one population carrier differently from another domain.

Example:

- Labor distinguishes employed manufacturing, employed services, unemployed, and nonparticipating portions.
- Housing distinguishes renter, owner, unhoused, and group-quarter exposure where modeled.
- Health distinguishes coverage/service/condition states.

Those partitions do not force a global cross-product unless a supported process requires their joint relationship.

## 6.3 Association weights are allocations, not new population

**[DI — HARD INVARIANT LC-PG08]** A domain-specific allocation of carrier weight is an association/accounting statement within that domain. It is not a new population weight that other domains may reuse without a declared mapping.

Within a complete domain partition, association quantities should reconcile to the relevant population scope, allowing explicit unknown/residual categories where data or model limits require them.

If Labor allocates 60% of a carrier to employment and 40% outside employment, Health may not infer the same split for insurance without a supported joint mapping.

## 6.4 No unlimited shadow partitions

A domain association must pass the Step 2 deletion/compression test.

It should not exist merely because a dashboard might filter on it.

If a domain can calculate a one-time projection without retaining a new canonical partition, prefer the projection.

---

# 7. Population scopes and joint-support status

## 7.1 Population scope

**[DI]** A `population scope` is a semantic reference to some weighted portion of the canonical population at a time and geographic/entity context.

It may be:

- directly represented by active carriers;
- derived exactly from canonical relationships;
- created by a conserved refinement occurrence;
- estimated through a declared allocation model;
- bounded by known margins or controls;
- unsupported.

A scope is not a new owner of people.

## 7.2 Required scope metadata

Any load-bearing scope used across owners must provide:

- source population/carrier identities;
- represented weight and unit;
- as-of/interval time;
- residence or other relevant geography;
- defining predicates/relationships;
- exact, modeled, bounded, or unsupported status;
- source/provenance;
- uncertainty;
- whether membership must persist through time;
- occurrence/lineage reference if created by a causal transition.

## 7.3 Four joint-support statuses

**[DI — HARD INVARIANT LC-PG09]** A query or coupling that depends on correlations across population/domain facts must declare one of four statuses:

1. **EXACTLY REPRESENTED** — the current carrier/relationship state preserves the required joint distribution.
2. **MODELED WITH PROVENANCE** — a declared model allocates or estimates the joint distribution with uncertainty and reconciliation.
3. **BOUNDED BUT UNRESOLVED** — controls support a range or partial answer but not one point estimate.
4. **UNSUPPORTED** — the substrate cannot answer without inventing correlation.

Forbidden default:

```text
joint = marginalA × marginalB × marginalC
```

unless independence is explicitly accepted, evidenced, and classified as modeled rather than observed.

## 7.4 Query honesty

The simulation, staff forecast, measurement, and UI must preserve the scope status.

A modeled district estimate cannot be presented as exact administrative truth.

An unsupported cross-tab cannot silently become zero or national-average allocation.

---

# 8. Correlation-persistence contract

## 8.1 Why not all correlations remain joint

If every new fact permanently subdivides the global population, the number of active cells can approach the cross-product of:

- geography;
- age;
- household type;
- employment status;
- industry;
- occupation;
- income;
- housing tenure;
- insurance;
- health;
- education;
- party;
- media exposure;
- issue belief;
- material experience;
- turnout.

Most of those joint combinations are not necessary for most supported decisions.

## 8.2 Persistent-correlation admission rule

**[DI — HARD INVARIANT LC-PG10]** A distinction becomes a shared, persistent population correlation only when at least one of the following is true:

1. two or more accepted owner processes must follow the same affected people over time;
2. one irreversible or long-lived transition requires identifying the same subset later;
3. population political response must retain which people directly experienced or received something for later attribution, preference, turnout, or institutional action;
4. a legal/program rule repeatedly depends on the same joint state and cannot be derived reliably from separate owners at decision time;
5. an accepted calibration source directly preserves the joint structure and later processes genuinely consume it;
6. a later presidential situation would materially differ if the correlation were lost.

## 8.3 Non-admission examples

The following alone do not justify a permanent shared split:

- UI filtering;
- one report table;
- a transient forecast;
- one story being technically available to an audience;
- a designer wanting more demographic detail;
- a correlation that no supported process consumes;
- a future-country hypothetical not needed by the U.S. game;
- a one-time calculation that can remain a projection.

## 8.4 Correlation obligation record

A shared persistent distinction should conceptually identify:

- cause and time;
- population scope;
- source evidence or causal occurrence;
- facts whose joint identity must survive;
- current and expected consumers;
- uncertainty/allocation method;
- retirement/coarsening condition;
- lineage.

This is a design obligation, not a required runtime registry.

## 8.5 Correlation retirement

**[DI — HARD INVARIANT LC-PG11]** A refinement must have a plausible coarsening path unless the distinction is intrinsically permanent or its continuing history remains causally required.

When no future accepted process requires separate current state, carriers/scopes may be coarsened if:

- all future-consumed current facts are equivalent or can be represented by a sufficient mixture/distribution;
- domain associations reconcile after coarsening;
- population and household weights remain conserved;
- historical occurrence identities and memories are retained outside the merged current state;
- uncertainty is not understated;
- the merge does not erase a politically/materially relevant correlation.

Literal identity of every historical reference is not required if those references remain preserved in history and no current process uses them as distinct state.

---

# 9. Refinement, splitting, and coarsening

## 9.1 Valid refinement triggers

A weighted carrier or shared scope may be refined because of:

- a causal event affecting only part of the represented weight;
- a newly admitted domain association that must remain joint;
- movement to a different residence geography;
- household formation/dissolution or member transition;
- legal/program eligibility distinction with recurring consequences;
- differentiated direct material experience;
- information incorporation that creates persistent recipient-state divergence;
- calibration improvement required to support an accepted process.

## 9.2 Invalid refinement triggers

Do not refine global population merely because:

- an information artifact was published;
- a platform made content available;
- a map was opened;
- a staff memo requests a cross-tab;
- a possible future interaction might care;
- one domain can maintain the distinction locally;
- a scenario writer wants a more dramatic subgroup.

## 9.3 Refinement provenance

**[DI — HARD INVARIANT LC-PG12]** Every canonical population refinement must preserve:

- parent identity/identities;
- child identities;
- represented weights and units;
- cause key and occurrence identity;
- effective time;
- allocation method and evidence;
- inherited population-owned state;
- changed population-owned state;
- domain associations that remain valid;
- uncertainty;
- conservation/reconciliation checks.

## 9.4 Weight conservation

Population refinement cannot create or destroy people.

```text
sum(child represented person weight)
= parent represented person weight
```

and, where a weighted household carrier is split:

```text
sum(child represented household weight)
= parent represented household weight
```

Population totals change only through admitted demographic/migration flows, calibration/rebase action, or another explicitly population-changing process.

## 9.5 Coarsening equivalence

Current code merges only cohorts with identical complete joint state. That is a safe proof rule.

For full Living Country, semantic coarsening may use a stronger but less literal rule:

> Two current population fragments may coarsen when every accepted future consumer receives an equivalent current answer, historical distinctions remain preserved elsewhere, and uncertainty/accounting are not falsified.

A mixture/distribution may sometimes preserve more truth than forcing fragments to remain separate forever.

## 9.6 No split-history erasure

A merge or coarsening operation does not delete:

- prior material exposure occurrences;
- prior information receipts/incorporations;
- past residence/household transitions;
- ballots/election participation already resolved;
- domain occurrences;
- actor/public claims;
- legally relevant eligibility history.

It changes current representation, not past truth.

---

# 10. Information exposure without global population explosion

## 10.1 Publication is not a split trigger

A published story or platform distribution attempt does not itself require new population carriers.

InformationEnvironment may record realized availability/delivery to an audience scope. Recipient processes then determine notice, retention, trust, belief, attribution, and salience.

## 10.2 Sparse receipt and recipient-state approach

**[DI]** The substrate should support sparse exposure/incorporation records targeted to population scopes rather than appending every artifact ID to every globally joint cohort.

An exposure may be represented as:

```text
artifact
→ delivery occurrence to bounded population scope
→ recipient process updates a purpose-bounded political/belief partition
```

A permanent shared refinement is justified only if the resulting divergence must be followed by later processes.

## 10.3 Issue-specific recipient state may remain sparse

Population does not need a dense belief vector for every possible issue on every carrier.

The later information/public-belief design may maintain sparse issue, actor, candidate, or claim memory where politically relevant.

Step 3 requires only that such state can refer back to the same population without creating a new audience population.

## 10.4 Current proof disposition

The current `receivedInformationReferences` array and merge signature are valid for the I8 proof.

They should not be presumed to be the full media-era storage strategy, because thousands of artifacts would make each receipt combination a unique global cohort state.

---

# 11. Material experience without project-by-project global fragmentation

A material domain may record that a population scope experienced:

- job separation;
- Housing cost change;
- service disruption;
- disaster damage;
- loss of insurance;
- pollution or outage exposure;
- program benefit;
- infrastructure improvement.

The material domain owns the underlying condition/occurrence.

Population may own direct-experience incorporation when that changes recipient state.

**[DI — HARD INVARIANT LC-PG13]** A project or material occurrence may not force every unrelated domain and population carrier into a permanent global partition unless later supported processes require the same affected subset.

A project catchment may remain a Housing-domain geographic/population association. It becomes shared population structure only when another process must preserve that exact population subset across time.

---

# 12. Demographic and household-flow contract

## 12.1 Population is not static across a term

A 2025–2032 prehistory and one or two presidential terms require the population substrate to support change.

Potential population-changing flows include:

- aging;
- births;
- deaths;
- domestic immigration/in-migration;
- emigration/out-migration;
- internal migration;
- household formation;
- household dissolution;
- member entry/exit;
- movement into or out of group quarters.

Exact models are deferred.

## 12.2 Owner-specific transition semantics

**[DI — HARD INVARIANT LC-PG14]** Population totals and relationships change only through declared population/demographic transition processes with occurrence identity and reconciliation.

Examples:

- aging changes age state; it does not create people;
- birth creates represented population weight and household/member relationship;
- death removes represented population weight and ends applicable relationships;
- internal migration changes residence, not national population total;
- immigration/emigration changes relevant population totals through declared flows;
- a household split changes membership/residence relationships without duplicating members.

## 12.3 Weighted-flow semantics

When only part of a weighted carrier experiences a transition, the affected weight is refined or transferred with lineage.

The process must preserve:

- origin and destination weights;
- time interval or occurrence time;
- residence/household relationships;
- domain associations that continue or terminate;
- uncertainty;
- source controls where applicable.

## 12.4 Reconciliation identity

At any supported time:

```text
opening population
+ births
- deaths
+ immigration
- emigration
= closing population
```

subject to declared statistical/model residuals or calibration rebases.

Internal movement redistributes residence but does not change the national total.

## 12.5 Household transitions are not automatically economic outcomes

Household formation/dissolution may change later Housing, income, health, tax, or program conditions through their owners.

Population does not directly calculate all those consequences merely because it owns membership.

---

# 13. Multi-geography model

## 13.1 No single geography hierarchy

**[DI — HARD INVARIANT LC-GEO01]** Living Country geography is a typed relationship system, not one universal parent-child tree.

Some geographies nest cleanly. Others overlap, cross, connect, or represent flows.

Potential frames include:

### Legal and administrative

- nation;
- states/DC;
- counties/equivalents;
- municipalities or other local jurisdictions where needed.

### Electoral

- congressional districts;
- state legislative districts;
- election administration areas where later supported.

### Statistical and analytical

- Census tracts/block groups;
- PUMAs;
- metropolitan or micropolitan areas;
- labor-market or commuting areas;
- rural/urban classifications.

### Material markets and services

- Housing markets;
- job/workplace markets;
- hospital/service catchments;
- school/service areas;
- energy/grid regions;
- transport corridors;
- watersheds/environmental regions;
- media markets.

### Operational and event geography

- project sites;
- grant/service catchments;
- disaster footprints;
- outage zones;
- security incident areas.

Step 3 does not accept all of these as required runtime geographies.

## 13.2 Geography owns spatial identity and relationships

GeographyState may own, where supported:

- geographic identity and type;
- geometry or spatial support;
- effective interval/vintage;
- containment;
- overlap;
- adjacency;
- network connectivity;
- canonical crosswalk relationship definitions;
- stable source/provenance references.

It does not own people, jobs, patients, voters, audiences, conditions, jurisdictions, or actor decisions.

## 13.3 Effective time and versioning

**[DI — HARD INVARIANT LC-GEO02]** Geographic identities, boundaries, classifications, and relationships must carry effective-time/vintage semantics where they can change.

Examples:

- congressional districts change after redistricting;
- metro definitions change;
- service areas change;
- media markets or grid membership may change;
- disaster footprints are time-bounded.

A boundary change does not retroactively move population or rewrite past elections.

---

# 14. Distinct population-location relationships

## 14.1 Residence is not every location

PopulationState owns residence linkage at the accepted resolution.

Other owners may associate the same population with:

- workplace location — Labor/Industry;
- school/service location — Education;
- healthcare provider/catchment — Health/Healthcare;
- housing unit/project — Housing;
- program delivery location — program/administration;
- media market/delivery channel — InformationEnvironment/Geography references;
- energy service region — Energy;
- disaster exposure footprint — relevant material/emergency domain;
- political constituency — derived from residence + electoral geography + law.

**[DI — HARD INVARIANT LC-GEO03]** Residence, workplace, service, market, network, media, project, exposure, jurisdiction, and electoral geographies may not be collapsed merely because one person participates in all of them.

## 14.2 Origin-destination and network relations

Some relationships are not polygon overlap.

Examples:

- home-to-work connection;
- commute or migration flow;
- supplier-to-plant flow;
- grid transmission connection;
- hospital referral/service pattern;
- media delivery network.

These require typed relation or flow state, not `parentGeographyId`.

## 14.3 Household and member location

Private-household members normally share a residence relationship at the selected abstraction, but temporary absence, split residence, institutional residence, custody, military assignment, or other exceptions may be represented only when causally required.

The substrate does not assume all members work, study, receive care, or consume media in the residence geography.

---

# 15. Geographic relationship and crosswalk contract

## 15.1 Relationship types

A geographic relationship may be:

- exact containment;
- exact geometric overlap;
- population-weighted crosswalk;
- household-weighted crosswalk;
- housing-unit-weighted crosswalk;
- employment/job-weighted crosswalk;
- area-weighted crosswalk;
- network-derived membership;
- origin-destination flow;
- service/catchment assignment;
- model-estimated allocation;
- unsupported.

## 15.2 Crosswalk metadata

**[DI — HARD INVARIANT LC-GEO04]** Every load-bearing crosswalk must declare:

- source geography/vintage;
- target geography/vintage;
- relationship basis;
- unit/denominator;
- effective time;
- whether weights conserve a source total;
- source data or model;
- uncertainty and residual handling;
- whether the relationship is exact, modeled, bounded, or unsupported.

## 15.3 No universal weighting basis

Area overlap does not automatically approximate people, households, jobs, housing units, voters, service use, or media exposure.

Forbidden:

```text
30% of tract area lies in district
→ 30% of every tract population and job belongs to district
```

unless area weighting is a declared model and its limitations are acceptable for the supported use.

## 15.4 Crosswalk conservation

Where weights represent allocation of a source quantity:

```text
sum(target allocations for source)
= source quantity
```

within declared tolerance/residual policy.

A crosswalk may preserve one unit and not another. A population-weighted crosswalk does not automatically preserve employment.

## 15.5 Boundary and vintage changes

Crosswalks across time must not imply that a person moved merely because the boundary changed.

Historical queries use the geography effective at the relevant time or an explicitly transformed projection.

---

# 16. No universal finest geographic atom is accepted

## 16.1 Selective spatial support

**[DI]** Step 3 does not require one national atomic cell layer at Census-block resolution or any other universal finest grain.

Different domains may operate on different supports and connect through typed relationships.

A finer common support may later be benchmarked if it materially simplifies valid crosswalks without unacceptable data, performance, or false-precision cost.

## 16.2 Modeled local allocation may become canonical model state

A synthetic household or population carrier may be assigned to a finer modeled residence zone using microdata, small-area controls, and an allocation model.

That assignment can become canonical state **inside the simulated America**, while remaining classified as modeled rather than observed real-world truth.

The player-facing system must preserve that epistemic distinction.

## 16.3 Selective geographic refinement

A coarse population or domain state may refine only where a supported process needs it, such as:

- a major metro employment shock;
- a project catchment;
- a disaster footprint;
- state implementation differences;
- congressional-district electoral analysis;
- local investigative reporting;
- a grid or service bottleneck.

Selective refinement must still reconcile to coarser controls.

---

# 17. Population query and projection contract

## 17.1 Queries assemble facts without moving ownership

A query may join:

```text
PopulationState identity/weight/residence/household state
+ domain-owned facts and associations
+ GeographyState and crosswalks
+ legal/program/electoral rules
+ time/as-of context
→ derived population scope or estimate
```

The query does not create new current population truth.

## 17.2 Query requirements

A load-bearing query must identify:

- requested population/entity scope;
- time/as-of interval;
- geography and vintage;
- source facts and owners;
- join/mapping method;
- joint-support status;
- uncertainty;
- whether the result is exact, modeled, bounded, or unsupported;
- whether it is current state, measurement, forecast, or hypothetical projection.

## 17.3 No silent independence

If the game knows separately that:

- 30% of a population carrier rents;
- 20% works in manufacturing;
- 60% has employer coverage;

it may not claim that 3.6% are manufacturing-worker renters with employer coverage unless that joint relationship is exactly represented or modeled with provenance.

## 17.4 Administrative knowledge remains bounded

The simulation may calculate an audit-truth cross-tab from canonical model state. The White House does not automatically know it.

Player access still requires an official record, measurement, staff model, administrative data, or other legitimate information path.

---

# 18. Elections and representation

## 18.1 Electoral geography remains separate

Electoral boundaries reference GeographyState and applicable law.

Population residence remains Population-owned.

Electorates are derived for a contest and time.

## 18.2 Eligibility

Eligibility may read:

- age and citizenship/nativity facts from their declared owner;
- residence;
- legal rules;
- registration/process state where modeled;
- other accepted facts.

Eligibility remains a contextual derivation, not a permanent `isVoter` property.

## 18.3 Current CVAP proof disposition

The current state-level CVAP proxy is legitimate bounded evidence for I4/I5.

It is not sufficient as the final population/electorate model because it distributes one state share uniformly across renter/catchment cohorts and cannot support individual age/citizenship, local, household, or changing eligibility relationships.

A future deeper model may use more direct population facts or finer controls while preserving measurement/proxy uncertainty.

## 18.4 Redistricting test

A district-boundary change must:

- change electoral geography and effective time;
- leave population residence unchanged;
- recompute derived electorates using valid crosswalk/geometry;
- preserve historical district/election records under old boundaries;
- avoid moving copied voters between district-owned lists.

---

# 19. Calibration-source lessons without source lock

## 19.1 ACS PUMS

**[ER]** ACS PUMS provides disclosure-protected person and housing-unit records. Person records are organized within households, include group-quarters persons, and are available at nation, state, and PUMA levels rather than tract or district detail.

**[DI lesson]** PUMS can inform household/person joint structure and synthetic carrier generation. It cannot by itself justify exact tract-, district-, or local-level assignment.

## 19.2 ACS aggregate estimates

**[ER]** ACS 5-year products provide estimates for small geographies, including tracts and block groups, with margins of error and multiyear reference periods.

**[DI lesson]** Small-area controls can constrain synthetic allocation, but their uncertainty and time basis must remain visible. Point estimates are not exact local truth.

## 19.3 LEHD/LODES

**[ER]** LODES provides residence-area, workplace-area, and origin-destination employment data at Census-block detail, with worker/job characteristics. Census describes it as tabulated and modeled administrative data subject to nonsampling error.

**[DI lesson]** LODES can support residence-workplace and labor-geography relationships. It is not a complete population, household, income, or unemployment owner and must not overwrite PopulationState.

## 19.4 SIPP and CPS

**[ER]** SIPP is longitudinal and measures changes in income, employment, household composition, program participation, health insurance, and related characteristics. CPS is the primary source of U.S. labor-force statistics.

**[DI lesson]** These sources may inform transition patterns, household dynamics, and calibration. Survey records do not become real simulated citizens, and different surveys’ universes/methods require reconciliation.

## 19.5 Census geography and relationship files

**[ER]** Census documents both hierarchical and nonhierarchical geographic relationships and publishes relationship files across geographic types and vintages.

**[DI lesson]** The simulation needs typed, versioned geographic relations rather than assuming every geography fits one tree.

## 19.6 Population-synthesis research

**[ER]** Household/person population-synthesis research demonstrates methods that jointly fit household- and person-level controls, while other research explicitly identifies dimensionality and scalability problems as attributes increase.

**[DI lesson]** Household-aware weighted synthesis is plausible, but Step 3 should not lock IPF, IPU, Monte Carlo sampling, mixture models, or another algorithm before benchmark evidence.

---

# 20. Required initialization and validation contract

## 20.1 Calibration does not clone source people

Survey or administrative microdata may seed distributions and relationships.

The simulated population consists of synthetic weighted carriers/scopes reconciled to selected controls.

No source record should be represented as an identifiable real person.

## 20.2 Initialization controls

A population initialization may need to reconcile selected controls across:

- person totals;
- household totals;
- household size/composition;
- residence geography;
- age/core demographics;
- group quarters;
- selected domain associations;
- electoral/eligibility facts;
- uncertainty.

Not every available control is automatically included.

## 20.3 Incompatible controls

**[DI — HARD INVARIANT LC-PG15]** When source controls differ by universe, time, geography, method, or uncertainty, the initializer may not force them all to match exactly as though they described the same truth.

It must:

- choose authoritative initialization controls by fact;
- classify secondary constraints;
- record residuals/conflicts;
- preserve uncertainty;
- reject impossible reconciliation where necessary.

## 20.4 Validation is multidimensional

Validation must test more than marginal totals.

Where supported, it should examine:

- household/person consistency;
- geographic totals;
- joint distributions used by accepted processes;
- domain partition reconciliation;
- residence-workplace flows;
- election eligibility;
- population-flow accounting;
- false small-area precision;
- carrier/refinement growth.

No one fit score can prove the substrate valid for all uses.

---

# 21. Adversarial cross-domain proofs

These are paper contract tests, not implementation evidence.

## Proof A — manufacturing job loss, household income, insurance, Housing, and politics

### Starting state

- Labor owns manufacturing jobs and worker-job associations in three metros.
- Population owns weighted household/person carriers, residence, household membership, and recipient-political state.
- Income owns household earnings/resources.
- Healthcare owns employer-sponsored coverage relationships.
- Housing owns renter/owner costs and exposure.

### Transition

A firm closes a plant through its actor/industry process. Labor resolves separations for an exactly represented or modeled population scope.

### Required propagation

```text
Labor separation occurrence
→ affected population scope with support status
→ Income maps affected worker members into household resources
→ Healthcare resolves coverage loss/continuation for worker/dependents
→ Housing continues to own rent/mortgage pressure
→ measurements and direct experience occur on their own schedules
→ organizations, governors, media, and populations receive bounded information
→ presidential situation may emerge later
```

### Anti-explosion requirement

The entire country is not repartitioned by every combination of worker, renter, insurance, party, and outlet exposure.

The affected scope becomes shared only for correlations consumed by later processes.

### Falsification

Fail if:

- Labor directly subtracts household income;
- Healthcare assumes all separated workers lose family coverage;
- Housing assumes every job loser rents;
- political support changes directly;
- unknown joint distributions are multiplied from marginals;
- one job-loss occurrence is counted twice through several domains.

## Proof B — redistricting without population movement

```text
new legal electoral map
→ Geography/electoral boundary effective interval changes
→ Population residence remains unchanged
→ derived district electorates recompute through valid relation/crosswalk
→ historical elections retain old boundaries
```

Fail if people are moved between district-owned resident arrays or if old district histories are rewritten.

## Proof C — hurricane footprint across incompatible geographies

A storm footprint crosses:

- parts of several counties;
- two congressional districts;
- one media market;
- portions of a grid/service region;
- multiple Housing and labor-market areas.

Material owners resolve damage/outage/service effects using their native geography.

Population exposure is mapped through provenance-bearing relationships.

Governors, agencies, outlets, and lawmakers receive different evidence.

Fail if one county label is treated as the storm’s complete population, grid, media, and electoral geography.

## Proof D — local investigative story without national population split

```text
local anomaly and source tip
→ journalist investigates
→ local outlet publishes
→ InformationEnvironment records delivery to local audience scope
→ some recipients notice/incorporate
→ local political state changes
→ national media may ignore it
```

No permanent national carrier split occurs merely because the story exists.

If later Congress, national media, or the White House acts, the same affected population and evidence can be referenced through preserved scopes/records.

Fail if publication instantly creates a national issue or if every unique artifact combination prevents population coarsening forever.

## Proof E — household move while workplace persists

A high-cost renter household moves from one residence geography to another.

Population changes residence and household location through a reconciled transition.

Labor workplace association remains unchanged initially.

Housing resolves departure/entry occupancy and market consequences.

Electoral district, media market, service access, and commute relations may change by derivation or their owners.

Fail if changing residence automatically moves the job or rewrites prior district membership.

## Proof F — group-quarters population

A college dorm population and a nursing-facility population share a county but differ in:

- household status;
- age composition;
- service/health relationships;
- electoral eligibility/turnout;
- direct experience;
- movement patterns.

Fail if both are forced into private-household assumptions or if facility identity becomes a separate population owner.

## Proof G — demographic accounting

Over one year:

```text
opening population
+ births
- deaths
+ immigration
- emigration
= closing population
```

Internal migration changes state totals but not national total.

Household transitions redistribute membership but do not duplicate people.

Fail if cohort splitting itself changes population totals.

## Proof H — unknown correlation

The game knows state-level renter share and PUMA-level industry employment but lacks their joint distribution in a congressional district.

Valid outputs:

- modeled estimate with provenance/uncertainty;
- bounded range;
- unsupported answer.

Invalid output:

- exact renter-manufacturing-worker count inferred from marginal multiplication and presented as truth.

---

# 22. Cohort-explosion and performance-design tests

## 22.1 Global-cross-product test

Propose ten relevant dimensions and estimate the naïve Cartesian cell count.

The substrate fails design review if its answer is to instantiate every possible cell regardless of support or use.

## 22.2 Story-exposure test

Expose several population segments to hundreds of stories.

The substrate fails if every unique artifact-history combination requires a permanent global cohort.

## 22.3 Project-portfolio test

Run many Housing/infrastructure projects with overlapping catchments.

The substrate fails if every overlap produces irreversible exponential population fragments.

## 22.4 Multi-domain query test

Request an unsupported cross-tab.

The substrate fails if it invents precision rather than returning modeled/bounded/unsupported status.

## 22.5 Coarsening test

After a temporary program and reporting cycle ends, test whether current representation can coarsen while preserving history and future-consumed correlations.

The substrate fails if every historical distinction remains an active carrier split forever.

## 22.6 Deepening test

Refine one metro or disaster area.

The substrate fails if the entire nation must adopt the same geographic/detail resolution.

---

# 23. Application to the existing implementation

## 23.1 Preserve

- one canonical weighted population;
- positive represented weights;
- state/DC controls and conservation checks;
- deterministic identities and lineage;
- exact save/load persistence;
- no district-owned population;
- domain exposure and information receipt entering Population only through accepted boundaries;
- merge rejection when current causally relevant joint state differs;
- source-artifact identity and limitations.

## 23.2 Extend

- household/co-residential and group-quarters relationships;
- demographic and migration flows;
- domain-owned sparse associations;
- population-scope support statuses;
- multi-frame geography and crosswalks;
- time-varying boundaries and relations;
- modeled/bounded/unsupported query results;
- selective refinement and safe coarsening;
- local/state/metro/district population mapping where supported.

## 23.3 Reconsider before generalization

- one global cohort carrying every material exposure, information reference, eligibility projection, and political state;
- global splitting for every received artifact;
- global splitting for every project catchment;
- complete-history equality as the only possible future coarsening rule;
- state-level residence as sufficient for all domains;
- uniform state eligibility share across all subgroups;
- content-defined strings as the eventual complete living-country population ontology.

## 23.4 Generalize later

- exact carrier count;
- exact household bundle implementation;
- exact small-area synthesis algorithm;
- exact crosswalk engine;
- exact migration/demographic transition formulas;
- exact political-memory storage;
- exact benchmarking and performance thresholds.

---

# 24. External research ledger

## 24.1 U.S. Census Bureau — ACS PUMS

- Public Use Microdata Sample overview: https://www.census.gov/programs-surveys/acs/microdata.html
- PUMS data access and person/housing record types: https://www.census.gov/programs-surveys/acs/microdata/access.html
- Census API PUMS description including households, group quarters, and PUMA geography: https://api.census.gov/data/2024/acs/acs5/pums.html
- PUMA overview and tract relationship files: https://www.census.gov/programs-surveys/geography/guidance/geo-areas/pumas.html

## 24.2 ACS small-area estimates

- ACS Information Guide, including 1-year and 5-year geography coverage: https://www.census.gov/programs-surveys/acs/about/information-guide.html
- Census guidance explaining 5-year pooling for smaller areas: https://www.census.gov/topics/population/foreign-born/guidance/acs-guidance.html

## 24.3 LEHD/LODES

- LEHD data products and LODES description: https://lehd.ces.census.gov/data/
- Official LODES code/documentation overview: https://lehd.ces.census.gov/data/lehd-code-samples/sections/lodes.html
- Census release noting 2023 LODES and updated geography: https://www.census.gov/programs-surveys/ces/news-and-updates/updates/12182025.html

## 24.4 Household and longitudinal dynamics

- Survey of Income and Program Participation: https://www.census.gov/programs-surveys/sipp.html
- Current Population Survey: https://www.census.gov/programs-surveys/cps.html

## 24.5 Geography relationships

- Census hierarchy diagrams: https://www.census.gov/programs-surveys/geography/guidance/hierarchy.html
- Census geographic reference and relationship files: https://www.census.gov/geographies/reference-files.html
- Geography API relationship overview: https://www.census.gov/data/developers/geography/about-geography.html

## 24.6 Population-synthesis research examples

- Ye, Konduri, Pendyala, Sana, and Waddell, household/person IPU methodology: https://trid.trb.org/View/881554
- Pritchard and Miller, household/family relationship synthesis: https://trid.trb.org/View/881312
- Integration of population-synthesis methods for household/person microsimulation: https://trid.trb.org/view/1495635
- Scalability/dimensionality comparison: https://trid.trb.org/View/1531997

External sources support design lessons only. They do not select the final implementation method or establish that the game’s population model has been built.

---

# 25. Anti-ontology tests

## 25.1 Core-field test

Does a proposed PopulationState field concern population identity/continuity, or is it merely convenient domain data?

If another owner more accurately owns it, keep it there.

## 25.2 Persistent-correlation test

Which supported future process needs to follow the same people?

If none, do not promote the distinction into shared persistent population state.

## 25.3 Household-unit test

Is the process about co-residence, family, taxation, benefits, insurance, or consumption?

Do not assume those units are identical.

## 25.4 Geography-frame test

Is the requested place residence, workplace, market, service, network, political, media, project, or event geography?

Do not reuse one frame without an accepted relation.

## 25.5 Precision test

Is local detail observed, modeled, bounded, or unsupported?

Do not present synthetic allocation as measured truth.

## 25.6 Exposure test

Does the artifact’s existence truly require persistent recipient divergence?

If no, use availability/delivery/receipt records without globally splitting the population.

## 25.7 Merge test

Which future consumer would receive a materially different answer if fragments coarsened?

If none, preserving active fragmentation may be unjustified.

## 25.8 Data-source test

Does a survey/admin source share the same universe, time, geography, and concept as the fact being initialized?

If no, document transformation and uncertainty rather than forcing exact agreement.

---

# 26. Required Step 3 declaration for later designs

Any later population/geography implementation or deeper design must declare:

1. canonical population identity and weight semantics;
2. private-household and group-quarters treatment;
3. PopulationState-owned core facts;
4. domain-owned association semantics;
5. population-scope and joint-support statuses;
6. persistent-correlation admission/retirement rules;
7. refinement and coarsening lineage;
8. demographic and migration accounting;
9. geographic entity/relation types;
10. crosswalk weighting bases and vintages;
11. residence/workplace/service/network/electoral distinctions;
12. query uncertainty and unsupported-result behavior;
13. calibration controls and residuals;
14. current implementation migration/preservation strategy;
15. performance/fragmentation benchmarks.

No later design may bypass these questions by saying only “use synthetic cohorts.”

---

# 27. Remaining unresolved questions

1. Exact runtime carrier architecture: weighted household records, person carriers, sparse distributions, or hybrid.
2. Exact carrier count and benchmark targets.
3. Exact PopulationState core-demographic fact set.
4. Whether household membership, family/kinship, and residence-group relations share one subsystem or several declared owners.
5. Exact owner of residential-placement/occupancy relationship.
6. Exact household transition model.
7. Exact population aging, fertility, mortality, and migration models.
8. Exact geographic supports instantiated nationally.
9. Whether a common fine geographic support is worth its data/performance burden.
10. Exact small-area synthesis method.
11. Exact method for maintaining sparse cross-domain joint slices.
12. Exact political-belief/memory partitions.
13. Exact coarsening algorithm and future-consumer equivalence check.
14. Exact electoral eligibility resolution.
15. Exact uncertainty propagation through crosswalks and modeled scopes.

These are intentionally deferred unless the detached Step 3 audit finds one necessary to close the semantic contract.

---

# 28. Step 3 binary gate

A detached audit should answer:

> **Can one canonical weighted population support household/person continuity, domain-owned associations, materially necessary cross-domain correlations, demographic change, and several overlapping geographic frames without global cross-product cohorts, duplicated people, fake local precision, silent independence assumptions, or permanent fragmentation from every project and information artifact?**

PASS requires:

- one population identity/weight owner;
- household and group-quarters semantics sufficient for cross-domain needs;
- domain facts remain with their semantic owners;
- population scopes preserve exact/modeled/bounded/unsupported status;
- persistent correlations require explicit causal consumers;
- refinements conserve weight and preserve lineage;
- coarsening can preserve history without requiring eternal fragmentation;
- information and project exposure do not automatically split the global population;
- births, deaths, migration, and household changes reconcile;
- residence and other location relationships remain distinct;
- geography supports overlap, flow, network, catchment, and effective-time relationships;
- crosswalks declare weighting basis, time, units, uncertainty, and reconciliation;
- electoral boundaries do not own or move population;
- no unsupported cross-domain query invents correlation;
- the current I4 population proof is preserved where strong and not universalized where narrow.

If REVISE, repair only the cheating, ambiguous, or non-scalable substrate contracts. Do not begin actor, administration, coupling, media, history, domain-depth, UI, EA, roadmap, or implementation work.

---

# 29. Candidate verdict

## **PROCEED TO DETACHED AUDIT**

The proposed answer is:

> **Use one household-aware weighted population fabric with stable identity and lineage; keep dynamic material facts in domain-owned sparse associations; create shared persistent population distinctions only when later causal processes must follow the same affected people; connect residence, workplace, service, market, network, media, event, jurisdictional, and electoral geographies through typed, versioned, uncertainty-bearing relationships rather than one hierarchy.**

This candidate has not yet been accepted.