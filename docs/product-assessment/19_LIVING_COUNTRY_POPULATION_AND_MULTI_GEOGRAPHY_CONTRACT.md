# Living Country Step 3 — One-Population and Multi-Geography Substrate

Status: **LIVING-COUNTRY DESIGN CANDIDATE — PRESERVED FOR REVIEW. NOT ACCEPTED PRODUCT, ARCHITECTURE, DOMAIN, CALIBRATION, UI, ROADMAP, EARLY-ACCESS, SCHEMA, RUNTIME, OR IMPLEMENTATION AUTHORITY.**

Authority and evidence boundary:

- Accepted production baseline used by the assessment: `44c1724962830225e6fc34f41d0df0cfdb7dfec0`
- Entirely unaccepted Stage 1 candidate: `a7e04ca78ba1ccb06d8dc3a4dfb0d43389804144`
- Accepted Step 5 presidential-game authority: `2c5fc2d798c5fcc232b519052390b56d60f06267`
- Accepted Living Country Step 1 layer/fact ownership: `11` as controlled by `12`
- Accepted Living Country Step 2 common grammar: `13` as controlled by `16`
- Assessment branch tip before this candidate: `8a86a3f4a165bc6063c9f4131228ba4729beec56`

This is Living Country Step 3. It answers:

> **What one-population and multi-geography substrate can support materially different domain interfaces without cohort explosion, fake disaggregation, incompatible geographic frames, duplicated people, or lost historical identity?**

It does not:

- select the final durable-domain inventory or depth tiers;
- define exact population synthesis, cohort, household, simulation, or database schemas;
- choose exact demographic variables;
- define actor AI, media algorithms, election formulas, or domain coupling formulas;
- accept a January 2025 calibration boundary or January 2033 player start;
- prove generated prehistory;
- accept a final State-of-the-Nation or six-surface UI;
- set Early Access scope, implementation order, or a next code increment.

---

# Evidence labels

- **[RF — Repository fact]**: established by accepted repository architecture, implementation evidence, or accepted assessment authority.
- **[ER — External research]**: supported by an official external source listed in Section 16.
- **[DI — Design inference]**: proposed Living Country contract; not yet authority.
- **[UQ — Unresolved question]**: deliberately deferred.

---

# 1. Executive design verdict

## 1.1 Recommended substrate

**[DI]** The Living Country should use one canonical ordinary population represented through a **weighted, adaptively refined population fabric**, not:

- 340 million individually simulated people;
- one national average person;
- a separate population for every domain;
- one permanently expanded Cartesian cohort key containing every demographic, economic, material, political, and information dimension.

The population fabric should conceptually contain:

1. **population controls** defining reconciled totals for a time and geography;
2. **weighted population units** representing sets of ordinary people currently equivalent for the distinctions the simulation actually consumes;
3. **population-owned social relations**, including household/composition relations where supported;
4. **domain-owned sparse associations and relations** connecting the same population units to employment, income, Housing, healthcare, education, program, service, information, or other facts;
5. **adaptive refinement and coarsening** that introduce or remove explicit distinctions only when a supported causal process requires them;
6. **stable lineage and provenance** so refinement changes resolution without fabricating or deleting people.

“One population” means one authoritative ordinary-population identity, weight, residence, core demographic/life-course, household-membership, and recipient-political fabric.

It does **not** mean every fact about a person belongs in one population object.

## 1.2 Recommended geography model

**[DI]** Geography should be a **versioned graph of spatial identities and relationships**, not one universal nesting tree and not one state/district lookup field.

The country must support overlapping geographic frames such as:

- legal/administrative geography;
- electoral geography;
- statistical geography;
- functional labor/Housing/media-market geography;
- network and infrastructure geography;
- service/program/project catchments;
- event and hazard footprints.

GeographyState owns spatial identity, geometry/topology, containment, adjacency, overlap, and declared crosswalk relationships.

The legal, electoral, market, service, network, media, or hazard meaning of a footprint remains with the institution/domain that defines that meaning.

## 1.3 Product reason

This substrate is necessary because the accepted presidential game depends on situations such as:

- a worker living in one congressional district but working in another labor market;
- a household losing employer-sponsored coverage after one member loses a job;
- a hurricane footprint crossing states, media markets, energy networks, and program jurisdictions;
- Housing pressure being metropolitan while political accountability is state/district based;
- a local investigation reaching only some audiences;
- redistricting changing constituency membership without moving anybody;
- national statistics hiding regionally concentrated harm.

The game cannot generate those situations coherently if every domain owns a different copy of the public or if every condition is forced into state-level averages.

---

# 2. Existing foundation and its limits

## 2.1 What the accepted foundation already proves

**[RF]** The accepted architecture already requires:

- one canonical ordinary population rather than separate economic, electoral, media, or beneficiary populations;
- GeographyState ownership of spatial identity/topology rather than population or jurisdiction;
- aggregate but correlation-preserving representation;
- population-weight conservation;
- deterministic refinement with lineage;
- domain-owned material facts;
- Population-owned belief, attribution, salience, preference, and turnout-relevant state;
- electorates derived from population plus geography and legal eligibility;
- information exposure preceding recipient-owned political response.

**[RF]** The accepted I4 implementation demonstrates:

- 51 state/DC population controls;
- a national represented total of 341,784,857;
- 106 weighted cohorts;
- deterministic split/merge mechanics;
- conservation of population and eligibility-proxy weight;
- state residence references;
- narrow renter/nonrenter and project-catchment distinctions;
- stable lineage and cause keys.

## 2.2 What the current implementation does not prove

**[RF]** The current cohort scaffold is intentionally narrow. It does not yet provide a Living Country representation for:

- household composition and pooled resources;
- age/life-course dynamics;
- labor force, industry, occupation, workplace, or commuting relations;
- earnings/income and benefit incidence;
- healthcare coverage/service relations;
- education/enrollment;
- internal and international migration;
- multiple simultaneous service/market/network geographies;
- issue-specific belief and information state at commercial breadth;
- realistic local disaggregation;
- generated demographic history.

Its `materialExposureClass`, `catchmentClass`, project locator, and scalar political strings prove the seam. They are not a sufficient universal population ontology.

## 2.3 Preservation rule

**[DI]** Step 3 should preserve the current foundation’s semantic strengths:

- controls;
- conservation;
- stable identity;
- lineage;
- selective refinement;
- deterministic continuation;
- one population;
- domain references;
- exposure-before-belief.

It should generalize the representation conceptually without treating current fixture fields as permanent universal columns.

---

# 3. Population ownership contract

## 3.1 Canonical population facts

**[DI — HARD INVARIANT LC-PG01]** PopulationState owns the ordinary population’s authoritative:

- represented person weight;
- persistent population-unit identity and lineage;
- residence relationship at the accepted resolution;
- core demographic/life-course facts retained as population facts;
- household identity, membership/composition, and kin/dependency relationships where modeled;
- births, deaths, aging, and residence-change occurrences after valid inputs;
- recipient notice, memory, trust, belief, attribution, salience, preference, and turnout-relevant state;
- population control and reconciliation relationships.

Exact field choices remain later design.

## 3.2 Facts not owned by PopulationState merely because people experience them

PopulationState does not automatically own:

- job, employer, occupation, workplace, or labor-market status;
- earnings, taxes, transfers, disposable income, debt, or wealth;
- dwelling stock, rent, mortgage, vacancy, construction, or tenure terms;
- insurance contract/program enrollment, healthcare service capacity, diagnosis, or provider operations;
- school/institution capacity or educational service operation;
- prices, firm production, energy supply, infrastructure capacity, crime occurrence, or environmental conditions;
- information-artifact content or realized delivery;
- legal/program eligibility rules or administrative determinations;
- electoral procedures/results.

Those facts belong to their accepted semantic owners and associate with Population through typed relations or distributions.

## 3.3 Population unit

**[DI]** A population unit is a weighted canonical representation of ordinary people who are currently equivalent with respect to the explicit population distinctions maintained at that resolution.

A unit:

- has a stable identity and represented weight;
- is not one actual named citizen;
- may stand for one person or many people;
- may carry population-owned attributes;
- may be associated with several domain-owned distributions/relations;
- may later split when a consumed distinction becomes causally relevant;
- may merge when distinctions cease to matter and all active owner relationships remain reconcilable.

## 3.4 Population unit is not a universal person row

**[DI — HARD INVARIANT LC-PG02]** A population unit may not become a universal mutable row containing every domain fact.

Forbidden:

```text
PopulationUnit {
  job
  wage
  rent
  health
  insurance
  crimeRisk
  energyBill
  mediaFeed
  vote
}
```

when those facts have different semantic owners.

Preferred:

```text
Population unit identity/weight/residence
↔ Labor-owned employment relation
↔ Income-owned earnings/household-finance relation
↔ Housing-owned occupancy/tenure/exposure relation
↔ Healthcare-owned coverage/service relation
↔ InformationEnvironment-owned delivery occurrence
↔ Population-owned recipient incorporation
```

The common identity permits cross-domain incidence without shadow ownership.

## 3.5 Ordinary population versus individualized actors

The accepted individualization rule remains:

- ordinary people remain weighted/aggregate unless identity is causally necessary;
- a senator, governor, judge, agency head, journalist, executive, or organization leader may be individualized when their one decision or history matters;
- an individualized political/institutional actor is not removed from the ordinary population merely because they also have an actor identity;
- any connection between an individualized actor and ordinary population representation must avoid double-counting.

**[UQ]** The exact accounting method for named actors within population totals remains later implementation design.

---

# 4. Factorized population fabric

## 4.1 Why a Cartesian cohort is rejected

A complete joint key such as:

```text
state × district × metro × age × race × sex × education
× household type × income × job × industry × tenure × insurance
× ideology × party × media use × every issue belief
```

would explode in size, create tiny synthetic cells, make calibration brittle, and force explicit distinctions that no active process consumes.

**[DI — HARD INVARIANT LC-PG03]** The canonical population may preserve required correlations without materializing the full Cartesian product of every possible attribute and domain relation.

## 4.2 Four-part factorization

The recommended conceptual factorization is:

### A. Base population partition

Stable weighted units containing only population-owned distinctions needed broadly enough to justify persistence.

Potential examples:

- residence geography;
- age/life-course band;
- legally relevant citizenship/residency class where accepted;
- demographic dimensions required for supported exposure, eligibility, or political behavior;
- household relation references;
- persistent political-recipient state at the appropriate sparse resolution.

This list is not accepted as final.

### B. Sparse owner-specific relations

A domain records only the population associations it needs.

Examples:

- Labor maps a portion of a population unit to workplace/industry/employment states.
- Housing maps households/population to dwelling/tenure/cost exposure.
- Healthcare maps people/households to coverage and service-access states.
- Education maps relevant ages/households to enrollment/service states.
- InformationEnvironment maps delivery/exposure occurrences to population scope.
- Election processes derive contest eligibility and participation from Population plus legal/electoral state.

### C. Conditional distributions

When an exact explicit split is not yet necessary, an owner may retain a bounded conditional distribution or allocation over a population unit.

A distribution must specify:

- owner;
- referent population unit(s);
- categories/values;
- represented weights or probabilities;
- time and geography;
- calibration/provenance;
- uncertainty and independence assumptions;
- reconciliation totals.

It is not permission to invent an individual-level joint relationship later without refinement or a valid transformation.

### D. Adaptive refinement

When a causal path requires an explicit joint distinction, the affected population unit or relation allocation may split conservatively.

The split introduces only the necessary distinction.

## 4.3 Active distinction rule

**[DI — HARD INVARIANT LC-PG04]** Every persistent explicit population distinction must name at least one active or accepted consumer.

A consumer may need the distinction for:

- a material outcome;
- a lawful eligibility/determination input;
- an autonomous actor decision;
- a measurement;
- information delivery/incorporation;
- an election;
- a player-legible governing decision.

“Could be interesting someday” is not sufficient.

## 4.4 Complexity measure

Population complexity should be evaluated primarily by:

- number of active weighted units;
- number and density of domain relations;
- number of explicit joint distinctions;
- number of versioned geography mappings;
- number of persistent recipient-belief/experience distinctions;

not by the represented national population total.

No numerical cap is accepted here.

---

# 5. Household and dependency contract

## 5.1 Why households are load-bearing

**[DI]** Some presidentially relevant effects cannot be represented coherently through isolated person averages:

- pooled earnings and disposable resources;
- dependents and caregiving;
- employer-sponsored coverage affecting spouses/dependents;
- housing occupancy and household formation;
- taxes and transfers;
- poverty and benefit eligibility;
- relocation;
- childcare/education exposure.

Therefore Living Country requires a household/composition seam even if households are not all simulated as literal individual homes.

## 5.2 Household ownership

**[DI — HARD INVARIANT LC-PG05]** PopulationState owns household identity, weighted household count, membership/composition, kin/dependency relationship, and household formation/dissolution facts where supported.

Other owners may own:

- household income/resources — Income/Household Finance;
- tax/benefit determinations — legal/program/fiscal owners;
- dwelling/occupancy/tenure — Housing;
- insurance/coverage — Healthcare/insurance/program owner;
- childcare/school service — relevant service domain.

A household is not a duplicate population.

## 5.3 Weighted household representation

A household unit may represent multiple statistically equivalent households.

It must reconcile:

- weighted household count;
- weighted person membership by supported composition;
- residence;
- group-quarters separation where relevant;
- changes caused by formation, dissolution, births, deaths, or migration.

The sum of represented person memberships must reconcile to the applicable ordinary-population controls, allowing explicitly modeled group-quarters or other nonhousehold populations.

## 5.4 Household relation without false one-to-one claims

Where source data support only distributions, the model may preserve:

- household-type shares;
- person-to-household allocation weights;
- conditional composition distributions;

rather than claiming an observed exact household for each weighted person unit.

Any generated exact synthetic assignment is a modeled reconstruction with provenance, not observed microdata truth.

## 5.5 Household stress test

If one earner loses a job:

```text
Labor-owned separation
→ Income owner changes earnings contribution
→ household resource pooling changes
→ Healthcare owner evaluates employer-coverage relationship
→ program owner evaluates any eligibility under applicable law
→ Housing owner may later receive payment/demand/mobility inputs
```

No step may directly modify another owner because “the household is one object.”

---

# 6. Life course, population flow, and mobility

## 6.1 Population stock and flows

Population totals are stocks at an as-of time.

Changes arise through declared flows/events such as:

- birth;
- death;
- aging/life-course transition;
- immigration/emigration;
- internal migration;
- institutional/group-quarters entry/exit;
- household formation/dissolution;
- residence correction/reclassification.

Net population change may not hide load-bearing gross flows when origins, destinations, age, household formation, electoral eligibility, Housing demand, labor supply, or program load depend on them.

## 6.2 Owner-respecting inputs

Other domains may create inputs relevant to population change:

- Health may supply mortality-relevant conditions/occurrences.
- Immigration/legal processes may create entry/status/removal records.
- Labor, Housing, disaster, and family conditions may influence mobility decisions.
- Institutions may record births/deaths or administrative estimates.

PopulationState owns resulting population identity/weight/residence/life-course transitions through its accepted process.

## 6.3 Residence versus presence

A person may have distinct relations for:

- usual residence;
- temporary presence;
- workplace;
- school;
- provider/service location;
- project or disaster exposure;
- institutional/group-quarters placement.

One field called `location` is insufficient when these distinctions change supported outcomes.

## 6.4 Migration

A residence migration must preserve:

- origin and destination geography;
- person/household weight;
- effective date;
- household relationship consequences;
- domain references requiring remapping;
- electoral eligibility timing under applicable law;
- historical origin/destination occurrence;
- national and subnational control reconciliation.

Moving across a district line because a person relocates is distinct from becoming part of a new district because a boundary changes.

---

# 7. Multi-geography contract

## 7.1 Geography is not one hierarchy

**[ER]** Census geography guidance distinguishes legal, administrative, and statistical areas and explicitly notes that different geographic entities may or may not relate through one hierarchy.

**[DI — HARD INVARIANT LC-PG06]** The Living Country may not assume every geography nests cleanly inside nation → state → county → district → locality.

## 7.2 Geographic families

The substrate must support, where required:

### Legal and administrative geographies

Examples: states/DC, counties, municipalities, tribal or other legally relevant areas, agency/service jurisdictions.

Political/legal meaning belongs to the relevant jurisdiction/institution; spatial footprint references GeographyState.

### Electoral geographies

Examples: congressional districts, state legislative districts, election precincts if ever needed.

Election/PoliticalOrder owns constituency rules and effective assignment. GeographyState owns/reference-supports the spatial footprint.

### Statistical geographies

Examples: Census blocks/tracts, PUMAs, counties, metropolitan statistical areas, other reporting geographies.

A statistical geography is not automatically a market, jurisdiction, constituency, or service area.

### Functional geographies

Examples: labor markets, commuting zones, Housing markets, media markets, supply-chain regions.

Their functional definition belongs to the relevant domain/organization and references spatial identities/relationships.

### Network geographies

Examples: electric-grid regions, transportation corridors, ports, watersheds, supply networks, healthcare referral networks.

Topology may be more important than containment.

### Service, program, and project catchments

Examples: school district/service area, hospital catchment, federal program consortium, project impact area.

The administering institution/domain owns the operational meaning.

### Event and hazard footprints

Examples: hurricane wind/flood zone, wildfire area, cyber-affected network, contamination plume, industrial closure impact region.

The event/material owner defines the footprint at the relevant time; GeographyState provides spatial identity/overlap support.

## 7.3 Geography identity and vintage

Every load-bearing geographic identity or relationship must declare where applicable:

- identifier/type;
- effective interval or vintage;
- geometry/topology source;
- containment/adjacency/overlap relationships;
- change/supersession lineage;
- precision/limitations.

**[ER]** Census GEOIDs provide stable identification within defined geographic products, while Census relationship/reference files document relationships among geography types and geography vintages.

A GEOID is an identifier, not eternal proof that boundaries or relationships never change.

## 7.4 Geography does not own meaning merely because it owns shape

**[DI — HARD INVARIANT LC-PG07]** GeographyState may own the spatial footprint and overlap facts without owning the legal, market, electoral, service, network, media, or hazard semantics attached to that footprint.

Examples:

- congressional district footprint — Geography reference; constituency/election semantics — Electoral/PoliticalOrder;
- labor-market footprint — Geography reference; labor-market definition — Labor domain;
- media-market footprint — Geography reference; distribution relationship — outlet/platform/InformationEnvironment;
- disaster footprint — Geography reference; severity/material effect — disaster/environment/infrastructure owners.

## 7.5 Crosswalks are denominator- and time-specific

A crosswalk may represent:

- exact containment;
- geometric area overlap;
- population-weighted overlap;
- housing-unit-weighted overlap;
- workplace/job-weighted overlap;
- network/service allocation;
- modeled distribution.

**[DI — HARD INVARIANT LC-PG08]** A crosswalk valid for one denominator or vintage may not be reused as universal geographic truth.

Land-area overlap cannot automatically allocate people, jobs, votes, Housing units, media audiences, or disaster losses.

## 7.6 Disaggregation

A coarse total cannot become observed fine-grained state merely because a player opens a map.

Disaggregation requires:

- a source or accepted model;
- target geography;
- denominator/basis;
- vintage;
- reconciliation to source controls;
- uncertainty/assumptions;
- classification as modeled rather than observed.

If no valid disaggregation exists, the correct local value is unknown/not modeled—not the national or state average copied downward.

## 7.7 Aggregation

Aggregation must preserve the semantics of the fact:

- counts may sum if scopes do not overlap;
- rates require denominator-weighting;
- distributions require composition;
- prices/indices require an accepted aggregation method;
- network conditions may not be spatially additive;
- flows need origin/destination handling;
- overlapping footprints require de-duplication.

## 7.8 Boundary change and redistricting

A boundary change creates a new effective geography or relationship version.

It does not:

- move residents;
- rewrite prior election geography;
- change past measurements;
- change past district representation;
- destroy the old boundary identity.

Current electorate/district membership is derived using the geography version effective for the relevant contest/date.

---

# 8. Population–geography relationship contract

## 8.1 Multiple simultaneous relations

A population unit or household may simultaneously participate in:

- residence geography;
- workplace geography;
- school/service geography;
- healthcare-service geography;
- Housing market;
- labor market;
- media market;
- electoral constituency;
- program catchment;
- infrastructure/network exposure;
- hazard footprint.

No one relation automatically substitutes for another.

## 8.2 Relation ownership matrix

| Relationship/fact | Semantic owner | Geography role |
|---|---|---|
| Usual residence | PopulationState | references effective geographic identity |
| Household composition | PopulationState | household residence references geography |
| Workplace/job assignment or OD flow | Labor/Employment owner | references residence/work geographies |
| Earnings contribution | Income owner | references person/household and employment facts |
| Dwelling occupancy/tenure | Housing owner | references household and dwelling/site geography |
| Healthcare provider/service relation | Healthcare owner | references residence and provider/service geography |
| School/enrollment relation | Education owner | references residence and institution/service geography |
| Program eligibility | legal/program owner | consumes person/household/geographic facts |
| Electoral constituency membership | derived from population residence + electoral geography + law | geography supplies effective footprint |
| Media delivery/exposure occurrence | InformationEnvironment | references outlet/channel/audience geography |
| Notice/belief/attribution | recipient owner | may consume geographically scoped exposure |
| Disaster material exposure | relevant hazard/material domain | references event footprint + person/entity geography |
| Commuting OD relation | Labor/Mobility owner | references origin and destination geography |
| Jurisdiction authority | PoliticalOrder/legal state | references but is not inferred from containment alone |

## 8.3 Residence–workplace divergence

**[ER]** Census LEHD/LODES products explicitly distinguish where workers live, where they work, and origin-destination flows.

**[DI]** The game should preserve residence/workplace divergence whenever it can change:

- local employment shock exposure;
- commuting/infrastructure use;
- state/local tax or program incidence where supported;
- district constituency effects;
- disaster exposure;
- media/local reporting;
- relocation pressure.

It should not require a workplace relation for every person when no supported domain consumes it.

## 8.4 Functional area membership

A person’s residence may lie in one political jurisdiction while their employment, Housing market, media environment, energy network, or healthcare network spans several jurisdictions.

Functional-area membership is therefore a relation/projection, not a replacement residence geography.

---

# 9. Eligibility, incidence, and exposure

## 9.1 Eligibility

Population may own attributes used by an eligibility rule.

The legal/program owner owns:

- the eligibility rule;
- its effective scope;
- administrative determination;
- enrollment/award where applicable.

**[DI — HARD INVARIANT LC-PG09]** PopulationState may not own “eligible for Program X” as permanent universal truth when eligibility depends on law, time, household facts, geography, program interpretation, or administrative determination.

Eligibility estimates used for planning are projections/artifacts.

## 9.2 Policy incidence

A policy may affect different people through:

- legal classification;
- household resources;
- employer relation;
- geography;
- service access;
- market exposure;
- program participation;
- direct material experience.

The policy/workstream does not own the affected population.

Incidence is derived from accepted owner relationships and may remain uncertain before implementation.

## 9.3 Information exposure

InformationEnvironment owns realized delivery/exposure occurrences.

The recipient owns whether they notice, retain, trust, interpret, or act.

An audience definition may use geography, outlet/channel use, organization membership, issue interest, or other accepted relations, but it may not create a duplicate media population.

## 9.4 Direct experience

Direct material experience may be associated with a person/household even when no news artifact exists.

It may affect recipient belief or salience through a Population-owned incorporation process.

Direct experience does not automatically reveal the correct cause, national context, or responsible actor.

---

# 10. Refinement and coarsening contract

## 10.1 Valid refinement triggers

A canonical population refinement is justified only when an accepted process needs an explicit distinction for:

- materially different incidence or outcome;
- household composition/resource pooling;
- legal/program eligibility;
- geography or mobility;
- measurement sampling/coverage;
- information delivery/incorporation;
- election eligibility, preference, or turnout;
- an autonomous actor’s constituency assessment;
- player-facing explanation that cannot be produced honestly from a coarser distribution.

A UI click alone is not a valid reason to mutate canonical population state.

## 10.2 Refinement invariants

**[DI — HARD INVARIANT LC-PG10]** Refinement must preserve:

- total represented person weight;
- applicable household/person reconciliation;
- source population control;
- geographic totals where applicable;
- domain relation totals;
- eligibility/control totals;
- resolved historical occurrences;
- lineage and causal identity;
- uncertainty and modeled assumptions;
- already realized exposure/experience relationships.

Refinement may alter future stochastic outcomes only where the modeled causal entities or distributions genuinely changed. It may not rewrite already resolved outcomes or unrelated random processes.

## 10.3 Distribution-to-explicit-state transition

When a conditional distribution becomes explicit through refinement:

- child weights reconcile to the parent;
- domain relations allocate according to a declared rule/source;
- unknown correlation remains unknown unless a model introduces it;
- any introduced independence assumption is labeled;
- the fine state does not claim to be observed simply because it is explicit.

## 10.4 Merge/coarsening rule

Units may merge only when:

- all persistent population-owned distinctions are equivalent or safely representable as a distribution;
- every active domain consumer can preserve its required relations;
- current deadlines/eligibility/exposures/experiences do not distinguish the units;
- household and geography reconciliation remain valid;
- historical identities remain navigable through lineage;
- no unresolved actor or election decision depends on the distinction.

Merging does not delete historical occurrences. It redirects current references through an accepted lineage/aggregation relationship.

## 10.5 Identity churn prohibition

Repeated split/merge cycles may not create free new people, repeated benefits, repeated exposure, rerolled elections, or new stochastic chances.

Occurrence identity, consumption identity, and lineage must prevent double application.

## 10.6 Query resolution versus canonical resolution

A player-facing drill-down may compute a finer **projection** from sources/models without refining canonical state.

Canonical refinement is required only when future world processes must preserve and act on that distinction.

This protects performance and prevents dashboard curiosity from changing the country.

---

# 11. Calibration and source-use contract

## 11.1 Calibration sources are evidence, not citizens

**[ER]** ACS PUMS consists of disclosure-protected sample records about people and housing units and is intended for custom statistical estimates.

**[DI — HARD INVARIANT LC-PG11]** A PUMS row or other survey microrecord may inform a synthetic joint distribution. It may not be imported as the canonical identity of an actual game citizen.

The same rule applies to administrative and tabulated source rows: they constrain initialization; they are not necessarily one-to-one world entities.

## 11.2 Calibration may combine controls and samples

A future calibration process may conceptually use:

- population totals and marginal controls;
- household/person microdata samples;
- employment residence/workplace data;
- geographic crosswalks;
- program or administrative counts;
- domain-specific estimates.

Step 3 does not select a synthesis algorithm.

Any method must disclose:

- source vintage;
- source universe;
- sample/estimate status;
- weights;
- geography;
- margins of error or uncertainty;
- transformations;
- independence assumptions;
- reconciliation residuals.

## 11.3 Source universes may differ

Resident population, civilian noninstitutionalized population, labor force, workers, households, housing units, citizen voting-age population, program participants, and voters are different universes.

They may not be joined or compared as though their denominators were identical.

A transformation must identify the universe relationship and uncertainty.

## 11.4 PUMA is not universal local truth

**[ER]** ACS PUMS provides geography at nation, state, and Public Use Microdata Area levels.

A PUMA is useful for calibration but is not automatically:

- a congressional district;
- municipality;
- Housing market;
- labor market;
- media market;
- service area;
- disaster footprint.

## 11.5 Workplace/residence data and vintages

**[ER]** LODES provides residence-area, workplace-area, and origin-destination data at fine Census geography, and official guidance binds releases to geography/version context.

A Living Country calibration must bind:

- data release/version;
- geography vintage;
- coverage gaps;
- reference year;
- transformation into accepted functional relationships.

## 11.6 Calibration reconciliation

At initialization:

- person weights reconcile to population controls;
- household composition reconciles to person totals within declared residuals;
- domain relations reconcile to their own source controls;
- geographic mappings use compatible vintages or explicit crosswalks;
- unknown/unavailable cells remain distinct from zero;
- synthetic allocations are labeled as modeled.

After initialization, live owners evolve state. Calibration does not overwrite the world.

---

# 12. Election, measurement, media, and public-belief integration

## 12.1 Electorates

An electorate is derived from:

```text
Population-owned residence/core eligibility facts
+ legally effective eligibility rules
+ effective electoral geography
+ contest date
```

The district or election does not own copied voters.

Voting-age or citizen-voting-age controls may inform a projection; they do not automatically equal actual registration, turnout, or ballots.

## 12.2 Redistricting

When districts change:

- Population residence remains unchanged unless people move;
- current constituency membership derives from the new effective footprint;
- prior elections remain tied to the historical footprint;
- lawmaker office assignments follow the applicable electoral/institutional process;
- actor constituency assessments use the correct current geography and bounded data.

## 12.3 Polling

A poll:

- samples or models recipient-owned political state;
- uses a declared population universe and geography;
- has field dates, weighting, sampling/model uncertainty, and release time;
- becomes an information artifact;
- does not overwrite belief or election outcome.

## 12.4 Media audiences

A media audience is:

- a projection or relation over one population;
- shaped by delivery channels, geography, trust/use patterns, and realized exposure;
- not a separate set of “media people.”

## 12.5 Measurement geography

An official statistic may be observed/released at a different geography from the underlying domain’s native state.

Any translation must preserve:

- source geography/vintage;
- target geography;
- denominator/method;
- uncertainty;
- whether the result is measured, estimated, modeled, or unavailable.

---

# 13. Versioning and historical continuity

## 13.1 Geography vintage

Geographic identities and relationships have effective times.

A change may create:

- successor identity;
- split/merge;
- boundary revision;
- renamed/recoded geography;
- new relationship file/crosswalk.

Old facts remain attached to the geography version effective when they occurred.

## 13.2 Population lineage

Population units have lineage through:

- calibration initialization;
- refinement;
- merge/coarsening;
- migration/reclassification;
- life-course transitions.

Historical records refer to the unit identity valid at the time and remain interpretable after later changes.

## 13.3 Relationship vintage

Residence/workplace, service, market, district, program, and media relationships can change independently.

A 2029 workplace relation cannot be silently evaluated using a 2033 commuting geography without an explicit transformation.

## 13.4 Baseline and generated history

Step 3 supports four later provenance roots:

- baseline-inherited;
- generated backstory;
- forward-generated prehistory;
- player-era.

It does not select the historical seam.

A generated 2033 population must reconcile all births, deaths, migration, household changes, geographic boundary changes, and domain relationships from the accepted baseline or declared residual/uncertainty.

---

# 14. State-of-the-Nation and player-legibility requirements

This section defines information requirements, not screens.

## 14.1 Bounded discoverability

**[DI — HARD INVARIANT LC-PG12]** Any observable population/geographic problem must have a navigable discovery route appropriate to the President’s lawful access, staff, measurements, reports, and information sources.

Problems lacking a valid observational route may remain hidden until evidence emerges.

“Discoverable” does not mean omniscient.

## 14.2 Overview

A population/geographic overview may expose, where supported by available information:

- national direction and scale;
- affected regions/populations;
- major divergence hidden by the national average;
- source/as-of time;
- uncertainty and coverage;
- why staff believes it may matter;
- related workstreams or institutions.

## 14.3 Detail

Detail may expose:

- population universe and denominator;
- geographic frame;
- residence versus workplace/service/exposure distinctions;
- household incidence;
- measured versus modeled local estimates;
- relevant domain relations;
- institutions and actors;
- competing interpretations;
- known data gaps.

## 14.4 Record

Record may expose:

- source vintages and methodologies;
- prior measurements;
- boundary/geography changes;
- population refinements and modeled assumptions where player-accessible;
- migration or household trends;
- relevant laws/programs and historical occurrences;
- revisions and uncertainty;
- supported/disputed attribution.

The player Record must not expose hidden canonical distributions, unobserved actor state, or debug-only synthetic assignments.

## 14.5 Map truthfulness

A map must distinguish:

- observed;
- officially estimated;
- privately estimated;
- modeled/disaggregated;
- unavailable;
- not applicable.

A smooth colored national map is not justification for fabricating fine local values.

---

# 15. Adversarial population/geography proofs

These are paper contract tests, not implementation evidence.

## Proof A — job loss across residence and workplace

### Shared state

- weighted workers live in two states and three congressional districts;
- they work in one cross-border industrial labor market;
- a plant closure is Labor/Industry-owned;
- household earnings and employer coverage are separate relations.

### Required trace

```text
firm/industry operational change
→ Labor-owned job separations at workplace
→ worker-population associations identify affected weights
→ Income owner changes earnings contributions
→ Healthcare owner evaluates employer-coverage loss
→ residence geography maps household effects to states/districts
→ workplace geography maps local production/tax/infrastructure effects
→ measurements observe different parts at different times
```

### Pass conditions

- no worker is cloned into residence and workplace populations;
- job loss is not assigned only to the plant’s district;
- household dependents may be affected without becoming employees;
- election constituency effects derive from residence;
- cross-border labor-market effects remain visible.

### Failure conditions

- `PlantClosure → StateUnemployment += X` with no worker/flow mapping;
- one `location` field erases workplace/residence difference;
- healthcare coverage changes directly because unemployment changed.

## Proof B — household pooled resources and coverage

A weighted household type contains one worker with employer coverage, one nonworking adult, one dependent, and one dwelling/tenure relation.

The worker loses employment.

Pass path:

```text
Labor separation
→ Income earnings/household pooling
→ Healthcare coverage transition
→ lawful program eligibility determination
→ possible Housing payment/mobility input
→ Population recipient response
```

No domain clones the spouse or dependent.

## Proof C — disaster footprint crossing incompatible geographies

A hurricane footprint crosses portions of two states, several counties, one metropolitan Housing market, an electric network region, a port corridor, and two media markets.

Pass requires:

- hazard owner defines event footprint/severity;
- Geography resolves valid overlaps;
- Housing, Energy, Infrastructure, firms, and Population admit their own exposures;
- governors/local institutions act under jurisdiction;
- media distribution follows outlet/channel footprints;
- affected population is counted once despite multiple exposures.

Land-area overlap may not allocate workers, households, grid load, and audiences identically.

## Proof D — redistricting without moving people

A population unit’s residence stays fixed while a congressional boundary changes.

Pass requires a new geography/electoral-map version, new current constituency derivation, unchanged residence, preserved old election geography, and no historical rewrite.

## Proof E — coarse source, local program targeting

Only a state-level healthcare estimate exists; a proposal targets three counties.

Valid outcomes:

- local state remains unknown;
- a modeled estimate uses an additional source/model, uncertainty, and state reconciliation;
- the program uses another legally relevant observable criterion.

Invalid: copying the state rate into every county as observed truth.

## Proof F — information exposure refinement and later merge

One weighted unit is partly exposed to a local investigative story.

InformationEnvironment records bounded delivery; Population refines recipient/nonrecipient weights or keeps a valid distribution; only recipients incorporate the artifact; later merge preserves memory and event identity; exposure is never double-applied.

## Proof G — migration and conservation

Households move from one high-cost metro to another state.

Migration is an origin/destination flow; national totals reconcile; state controls change through declared transitions; Housing demand and Labor relations resolve separately; electorate membership changes on valid dates; history remains intact.

## Proof H — PUMS is evidence, not citizens

Importing PUMS rows as actual persistent people is rejected.

PUMS may inform synthetic joint distributions. Game population units receive game identities, calibrated weights, provenance, and modeled uncertainty.

## Proof I — national-to-local drill-down

A national employment release is modest while one functional industrial region deteriorates severely.

Pass requires compatible universes/geographies/as-of dates, legitimate local observation/modeling, no hidden canonical local truth, and potentially different information for national and regional actors.

## Proof J — serious but hidden local condition

A regional healthcare-access decline is severe but measurement is delayed, organization weak, local reporting limited, and national coverage absent.

The condition continues materially. Direct experience and later data may expose it.

No national issue or presidential interruption appears merely because canonical severity is high.

---

# 16. External research ledger

## 16.1 Census geography hierarchy

**[ER] U.S. Census Bureau — Hierarchy Diagrams.**

Census guidance describes relationships among legal, administrative, and statistical geographic entities and notes that some area types may or may not relate through the standard hierarchy.

Source: https://www.census.gov/programs-surveys/geography/guidance/hierarchy.html

## 16.2 GEOIDs and relationship/reference files

**[ER] U.S. Census Bureau — Understanding Geographic Identifiers; Geography Relationship Files.**

GEOIDs identify geographic entities within defined products. Relationship files describe relationships among geography types or vintages.

Sources:

- https://www.census.gov/programs-surveys/geography/guidance/geo-identifiers.html
- https://www.census.gov/geographies/reference-files/2023/geo/relationship-files.html
- https://www.census.gov/programs-surveys/geography/geographies/reference-files.All.html

## 16.3 ACS PUMS

**[ER] U.S. Census Bureau — ACS Public Use Microdata Sample.**

PUMS provides disclosure-protected sample records for people and housing units and supports custom statistical estimation. It does not identify actual individuals or housing units.

Sources:

- https://www.census.gov/programs-surveys/acs/microdata.html
- https://www.census.gov/programs-surveys/acs/microdata/access.html

## 16.4 PUMS geography

**[ER] U.S. Census Bureau — ACS Data via API.**

ACS 5-year PUMS is available at nation, state, and Public Use Microdata Area levels.

Source: https://www.census.gov/programs-surveys/acs/data/data-via-api.html

## 16.5 LEHD/LODES

**[ER] U.S. Census Bureau — LEHD/LODES and OnTheMap.**

LODES distinguishes origin-destination, residence-area, and workplace-area characteristics at fine geographic detail. Official release guidance binds data to geography/version context.

Sources:

- https://lehd.ces.census.gov/data/
- https://www.census.gov/programs-surveys/ces/news-and-updates/updates/12182025.html

External evidence constrains source use. It does not dictate the eventual synthesis algorithm or runtime data structures.

---

# 17. Anti-explosion and anti-fabrication tests

A later candidate fails if it:

1. clones ordinary people into independent domain populations;
2. uses one giant Cartesian cohort key;
3. treats a survey microrecord as an actual person;
4. creates exact household membership from marginal data without labeling modeled reconstruction;
5. refines population merely because a UI opened a detail panel;
6. allows split/merge to reroll or double-apply past events;
7. uses residence geography as workplace/service/media/hazard geography;
8. assumes all geographies nest;
9. applies one crosswalk to people, jobs, land, Housing, and votes;
10. copies national/state averages into local areas as observed truth;
11. loses geography vintage in redistricting or historical measurement;
12. moves people when boundaries change;
13. lets district or jurisdiction own population;
14. lets Population own domain facts merely because people experience them;
15. lets eligibility projections become legal/administrative determinations;
16. exposes hidden local canonical truth through a map;
17. treats unknown, unavailable, not modeled, and zero as equivalent;
18. keeps gross movement hidden when it changes supported incidence;
19. requires explicit individualization for distinctions no process consumes;
20. compresses a distinction whose removal changes a later presidential decision.

---

# 18. Deletion and compression results

## Retain

- one canonical population identity/weight;
- residence distinct from workplace/service/exposure;
- household composition seam;
- weighted relations/distributions;
- geography identity and vintage;
- multiple non-nesting geographic frames;
- denominator-specific crosswalks;
- adaptive refinement/lineage;
- explicit unknown/modeled/observed distinction;
- population control and reconciliation;
- election derivation from one population;
- exposure distinct from belief.

## Compress by default

- individual ordinary-person biography;
- exact household membership where only distributions matter;
- detailed workplace relations outside supported labor/commuting paths;
- fine local geography without source or gameplay consumer;
- dimensions retained only for dashboard segmentation;
- correlations that do not affect a material, institutional, informational, electoral, or presidential outcome;
- inactive historical refinements whose current consequences can be preserved through lineage/distributions.

## Reject

- universal `Citizen` object with every domain fact;
- universal state/county/district geography ladder;
- state average as universal local truth;
- separate workers, patients, renters, audiences, and voters populations;
- permanently explicit every-dimension cohorts;
- media audiences as cloned population;
- redistricting as migration;
- PUMS rows as game persons.

---

# 19. Preserve, extend, reconsider

## Preserve

- one ordinary population;
- population controls and conservation;
- deterministic refinement semantics;
- stable lineage/cause identity;
- GeographyState as independent spatial owner;
- electorates derived from population and geography;
- domain-owned material truth;
- exposure-before-recipient response;
- bounded player information.

## Extend

- population units beyond renter/nonrenter fixture distinctions;
- sparse domain associations;
- household/composition relations;
- life-course and migration flows;
- multiple simultaneous geographic relations;
- versioned geography/crosswalks;
- calibrated conditional distributions;
- historical continuity under boundary/population change;
- bounded national-to-local legibility.

## Reconsider as fixture-specific

- one string `materialExposureClass`;
- one string `catchmentClass`;
- a single project locator per cohort;
- one flat list of received information references as sufficient commercial belief history;
- one global belief/attribution/salience value per cohort;
- uniform within-state CVAP and other scaffold assumptions;
- fixed 0.001 project-catchment splits where unsupported by later source/model.

These remain valid proof artifacts, not universal ontology.

---

# 20. Binary audit gate

A detached Step 3 audit should answer:

> **Can one canonical weighted population and a versioned multi-geography system support heterogeneous domain incidence, household/dependency relationships, mobility, elections, measurement, information exposure, historical continuity, and bounded national-to-local drill-down—without cloned people, giant Cartesian cohorts, fake disaggregation, incompatible geographic frames, repeated event consumption, lost history, or geography becoming political/material ontology?**

PASS requires:

- one ordinary-population identity/weight owner;
- domain facts remain with semantic owners;
- household relations exist without a duplicate population;
- weighted units and sparse relations can preserve required correlations;
- refinement/coarsening conserve weight, lineage, relations, and history;
- population flows distinguish stocks, gross flows, and net change;
- residence, workplace, service, market, electoral, network, and hazard frames can differ;
- crosswalks are denominator-, time-, and provenance-specific;
- coarse-to-fine estimates remain modeled/uncertain;
- redistricting changes constituency relationships rather than residence/history;
- samples/microdata calibrate rather than become citizens;
- elections, polls, media audiences, and program eligibility consume the same population without owning copies;
- every stress proof remains coherent;
- serious unobserved conditions may remain politically quiet;
- player views reveal only available measured/modeled information.

If REVISE, repair only failed population/geography contracts. Do not begin actor/administration, coupling, media, history, UI, Early Access, roadmap, or implementation work.

---

# 21. Remaining unresolved questions

1. Exact persistent population-unit grain and expected scale.
2. Exact household synthesis/relationship representation.
3. Exact list of population-owned core demographics.
4. Whether age is continuous, banded, event-transitioned, or hybrid.
5. Exact owner split for immigration status, migration decisions, and residence change.
6. Exact owner split for household finances versus Population household composition.
7. Exact domain relation representation and storage.
8. Exact refinement/coarsening thresholds and performance budgets.
9. Exact deterministic sampling/reconstruction method.
10. Exact handling of named political actors inside ordinary-population totals.
11. Exact canonical geography primitives and geometry storage.
12. Exact crosswalk construction and uncertainty propagation.
13. Exact source vintages and calibration method.
14. Exact electoral registration/eligibility/turnout representation.
15. Exact recipient belief granularity and memory representation.
16. Exact player-facing map/drill-down implementation.
17. Exact prehistory demographic/migration transition models.
18. Exact local-government/service geography depth.

None prevents acceptance of the semantic substrate if the binary gate passes.

---

# Final candidate verdict

**[DI]** One America does not require one giant person table or one universal map.

The proposed substrate is:

> **One canonical weighted population, factorized through population-owned identity and household relations, domain-owned sparse associations, adaptive correlation-preserving refinement, and a versioned graph of overlapping geographies.**

That model can preserve the same people across employment, income, Housing, healthcare, media exposure, elections, programs, migration, and crises without giving any one domain ownership of the whole citizen.

It is the minimum coherent substrate for a Living Country whose national averages can hide real local differences—and whose local differences can later return as materially different presidential decisions.
