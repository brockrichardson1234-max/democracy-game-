# 07 — Population, Geography, and Electorate V0

Status: **Commit-4 architecture candidate for review. Not implementation authority.**

## 1. Purpose

Commits 1–3 established the player boundary, Governing Loop 0, canonical ownership, government/actor/legal structure, and the rule that geography and population are independently owned. This document closes the minimum population/geography/electorate architecture needed for GL0.

It answers:

> How can one persistent ordinary population be located, grouped, politically responsive, and electorally counted without duplicating people into geography, districts, programs, polls, or election objects?

The governing constraint remains narrow:

> Represent enough aggregate population structure to preserve the correlations that matter to GL0, support geographically uneven housing effects and political response, and derive electorates correctly. Do not design a universal society simulator.

This document does **not** freeze weighted particles versus sparse joint distributions versus a hybrid. That remains an implementation benchmark decision.

## 2. Normative dependencies

This document must preserve the accepted architecture, especially:

- every mutable canonical fact has one semantic owner;
- geography owns spatial identity/boundaries/topology, not people;
- population owns population weight, residence linkage, demographic state, and ordinary-population political state;
- jurisdictions may reference territory but do not own geography or population;
- electoral boundaries reference geography;
- electorates are derived from population + electoral boundaries + applicable eligibility rules;
- ordinary population remains aggregate/correlation-preserving rather than one simulated object per citizen;
- individual political actors from Commit 3 remain distinct from ordinary population aggregates;
- material housing truth remains owned by the housing domain;
- information artifacts do not become population belief truth;
- elections do not own current office assignment;
- resolution may deepen by refining an existing owner rather than creating a second authoritative population.

Where any shorthand in this document conflicts with accepted Commit-1–3 ownership, the earlier accepted ownership rule controls.

## 3. PopulationState owns one ordinary population

`PopulationState` is the canonical owner of ordinary-population state used by GL0.

At the supported resolution it must be able to represent, directly or by an equivalent correlation-preserving structure:

- population weight;
- residence/location linkage to canonical geography;
- demographic attributes required by supported causal processes;
- eligibility-relevant attributes required by supported programs/elections;
- baseline political dispositions needed by the GL0 fixture;
- current population-level beliefs, attribution, salience, preferences, and turnout-relevant state detailed further in `08`;
- persistent state needed for the same population to be queried by housing, information, political, and electoral processes without cloning it.

`PopulationState` does not need to model every characteristic of a person.

A variable exists only when GL0 or a demonstrated future-deepening seam needs it.

### Candidate hard invariant PG-01

**There is one canonical ordinary population. Housing, electoral, information, program, geographic, and UI systems may reference, query, measure, or project that population, but they may not maintain separately mutable copies of the same people or population facts.**

## 4. Aggregate representation must preserve relevant correlations

GL0 explicitly rejects both extremes:

```text
one national average voter
```

and

```text
one fully simulated object per ordinary citizen
```

The representation may use weighted synthetic population units, sparse joint distributions, a hybrid, or another benchmarked structure.

Whatever representation is chosen must preserve correlations that materially affect supported causal questions.

For GL0, that includes enough joint structure that the simulation can distinguish combinations such as:

- where people live;
- whether they are exposed to housing pressure or housing improvement;
- baseline partisan/political disposition;
- relevant demographic/eligibility attributes;
- information exposure where differentiated;
- belief/attribution/salience state;
- turnout tendency/eligibility.

The architecture must not silently reconstruct joint behavior by multiplying unrelated marginal percentages when those correlations matter.

Example of a forbidden shortcut:

```text
30% young
40% renters
50% Party A
therefore 6% are young renter Party-A voters
```

unless independence is an explicit supported modeling assumption for that fixture.

### Candidate hard invariant PG-02

**Ordinary population is aggregate but correlation-preserving for the variables that affect supported causal outcomes. Aggregation may compress identity; it may not erase joint structure that GL0 relies on and later recreate it from incompatible marginals.**

## 5. Population units are not individual political actors

A weighted population unit may represent many ordinary people sharing a supported state combination.

It is not thereby a `PoliticalActor` from Commit 3.

Ordinary population units do not individually:

- hold governmental office;
- cast individually persisted legislative votes;
- own negotiated political commitments;
- participate in judicial procedure as individualized actors merely because real citizens could;
- receive player `ControlBinding` through the GL0 architecture.

If a particular person's identity later becomes causally necessary for a discrete political outcome, that person may be represented as an individualized actor under the Commit-3 individualization rule. That does not require converting the surrounding ordinary population to individual simulation.

### Candidate hard invariant PG-03

**Aggregate population units and individualized political actors are different semantic representations chosen for different causal needs. Individualizing a politically consequential person does not imply individualizing the ordinary population.**

## 6. Geography owns space, not residents

`GeographyState` owns supported spatial facts such as:

- geographic unit identity;
- boundaries;
- containment;
- adjacency/topology where needed;
- stable spatial references;
- finer/coarser spatial relationships where supported.

Population owns residence linkage:

```text
PopulationUnit.residenceRef -> GeographyEntity
```

This means a query such as “population living in Region A” reads PopulationState using GeographyState boundaries/relationships. Region A does not contain a mutable resident list that becomes an alternate owner.

A geographic cache/index may accelerate membership queries. It remains derived/non-authoritative.

### Candidate hard invariant PG-04

**Geography owns the spatial frame; PopulationState owns who/what population weight resides where. Geographic units may index or query residents but may not become authoritative owners of resident population.**

## 7. Residence change and boundary change are different events

The architecture must distinguish:

- population movement; and
- political/geographic boundary change.

If population moves:

```text
PopulationState changes residence linkage
GeographyState boundary remains unchanged
```

If an electoral boundary changes:

```text
Electoral boundary assignment changes
PopulationState residence remains unchanged
Derived electorate is recomputed
```

If a geographic boundary itself changes, GeographyState owns the spatial change. Population membership in spatial queries may consequently change by derivation even if no resident moved.

Historical records may preserve that a move or boundary change occurred, but they do not own current residence/boundary state.

### Candidate hard invariant PG-05

**Residence mutation, geographic-boundary mutation, and electoral-boundary mutation are distinct owner-specific changes. None may be implemented by moving copied population among district/geography containers.**

## 8. Electoral boundaries reference geography

An electoral constituency/district is political/electoral state that defines which geography is included for a particular electoral purpose.

Conceptually:

```text
ElectoralBoundary
  contest/office scope
  geography references / boundary rule
  effective interval
```

It does not own:

- geographic geometry as a duplicate;
- population inside the boundary;
- current voter preference;
- election result.

The geographic representation may support a whole-unit assignment or a finer boundary/cell relationship. Commit 4 does not require a production redistricting engine.

GL0 may use simple synthetic constituencies.

### Candidate hard invariant PG-06

**Electoral boundaries are electoral/political state referencing canonical geography. They do not own geography or resident population, and changing a boundary changes constituency membership by derivation rather than relocating people.**

## 9. Eligibility is contextual legal/electoral input

Whether population weight belongs to the electorate for a contest is not a permanent `isVoter` property divorced from context.

An electorate query may depend on supported inputs such as:

- contest/office;
- election date/time;
- electoral boundary;
- residence;
- age or other eligibility-relevant attributes represented by PopulationState;
- applicable legal eligibility rules from the legal/electoral order;
- registration or other election-process state only if the supported fixture models it.

The legal order owns normative eligibility requirements. PopulationState owns the population attributes those rules inspect. Electoral process state owns election-specific procedural facts.

### Candidate hard invariant PG-07

**Electoral eligibility is derived for a contest/time from applicable legal/electoral rules plus canonical population attributes and residence. PopulationState does not own normative election law, and election objects do not shadow-own population attributes.**

## 10. Electorate is a derived projection

The current electorate for a contest is conceptually:

```text
DerivedElectorate(contest, time)
  = PopulationState
    filtered/weighted by
      ElectoralBoundary(contest)
      + applicable eligibility rules
      + election-specific qualifying state where supported
```

The derived electorate may expose:

- eligible population weight;
- composition summaries;
- geographic composition;
- baseline political composition;
- current preference/turnout projections when requested.

Those outputs are projections.

An election process may snapshot/reference the applicable electorate/as-of inputs needed for deterministic resolution and audit. Such a snapshot does not become a second continuously mutable population owner.

### Candidate hard invariant PG-08

**An electorate is derived from canonical population, electoral geography, and applicable eligibility/election state. A district, contest, or election may store references or an auditable as-of snapshot, but may not maintain a second authoritative population that evolves independently.**

## 11. Election participation is not identical to electorate membership

The architecture distinguishes at least:

```text
eligible electorate
→ turnout disposition / participation process
→ ballots/votes cast
→ election procedural result
```

Being eligible does not mean voting.

Population political state may own turnout propensity/tendency. The election process owns supported election-specific participation/ballot/result state after the relevant transition occurs.

A projected turnout rate before the election is not the same thing as ballots actually cast.

### Candidate hard invariant PG-09

**Eligibility, turnout disposition, actual participation/ballots, and certified result are distinct facts. Derived turnout expectations may not pre-own election results.**

## 12. Baseline politics and dynamically simulated housing politics coexist

GL0 is not a pure housing referendum.

The fixture may initialize persistent ordinary-population state for factors such as:

- baseline partisan disposition;
- incumbent/candidate evaluation;
- political memory;
- background issue salience;
- turnout tendency.

Housing-related material experience and information may then alter belief, attribution, salience, preference, and turnout-relevant state through the processes in `08`.

The fixture baseline is canonical initial state, not a permanently fixed coefficient and not an alternate “background voter” owner.

### Candidate hard invariant PG-10

**Housing is one dynamically simulated political input into a persistent electorate that may already contain non-housing political state. Baseline fixture state and later housing-driven changes live in the same canonical population political owner rather than competing voter models.**

## 13. Material exposure does not directly equal political response

Population may be geographically or materially affected by housing conditions.

Examples:

- renters in a pressured region experience different material conditions from homeowners elsewhere;
- completed units may change local housing pressure;
- construction may occur outside a population unit's residence area.

Those material conditions remain housing-domain truth.

PopulationState may reference/receive legitimate causal inputs representing lived/material exposure when a population process updates its own state. A housing material change must not directly set:

```text
population.approval += 5
```

Political response still passes through perception/information/belief/attribution/salience/preference semantics in `08` where applicable.

Direct lived experience may itself be an information input; it is not permission for HousingState to own belief.

### Candidate hard invariant PG-11

**Material conditions may causally affect population state, including through direct lived experience, but the material domain does not directly own or set belief, attribution, preference, approval, salience, or turnout.**

## 14. Population projections used by institutions remain bounded information

Political actors and institutions may need constituency or demographic estimates.

Examples:

- district population estimate;
- expected eligible electorate;
- staff estimate of renter share;
- projected turnout by region.

A direct internal query may be exact only when the institution legitimately has access to an authoritative administrative fact represented as exact in-world.

Otherwise the actor receives an information artifact/measurement/projection with provenance and uncertainty under `08`.

A politician does not gain omniscient access to PopulationState because their office represents a constituency.

### Candidate hard invariant PG-12

**Representation or jurisdiction over a population does not grant omniscient access to population truth. Actor/institution knowledge remains governed by information provenance/access even when electorate composition is derivable by the simulation.**

## 15. Resolution deepening

The walking skeleton may begin with a small number of aggregate population units and coarse geography.

Later deepening may increase:

- geographic resolution;
- demographic dimensions;
- political-state dimensions;
- exposure differentiation;
- migration/mobility detail;
- election-detail representation.

Deepening must refine PopulationState/GeographyState/electoral projections rather than introduce a second “real people” owner.

If a coarse aggregate must be split, the split must conserve represented population weight and preserve/reconstruct supported joint state according to explicit rules rather than silently duplicating people.

### Candidate hard invariant PG-13

**Population/geography resolution may deepen, but refinement must conserve canonical identity/weight semantics and preserve the one-owner doctrine. Coarse and fine representations may not simultaneously compete as authoritative populations.**

## 16. Minimum GL0 population/electorate fixture

Commit 4 does not design production demographic content.

The walking skeleton needs only enough structure to prove:

- several geographic areas with different housing conditions;
- one persistent aggregate population distributed across them;
- correlation between at least some material exposure, baseline political state, and electoral geography;
- at least one electoral boundary/contest referencing geography;
- eligibility rules sufficient to derive the electorate;
- turnout/preference state sufficient for the election path;
- population state persists across ordinary succession.

A tiny fixture can satisfy this if ownership and derivation are correct.

## 17. Rejected shortcuts

Rejected:

```text
District.people = copiedPopulation
```

Rejected:

```text
Geography.residents = authoritativePopulation
```

Rejected:

```text
Election.voters = independently evolving voter objects
```

when ordinary population already owns those people.

Rejected:

```text
HousingRegion.approval
```

as a material-domain-owned political response.

Rejected:

```text
nationalApproval -> districtVote
```

as a replacement for the supported electorate/population process.

Rejected:

```text
PartyShare * RenterShare * AgeShare
```

as a generic reconstruction of joint population state without an explicit independence assumption.

## 18. Commit-4 review questions for this document

Review should ask only whether the population/geography/electorate side is closed enough for GL0:

1. Is one canonical ordinary population preserved across material, information, and electoral uses?
2. Is the aggregate representation required to preserve causally relevant correlations without prematurely freezing an implementation?
3. Are geography, residence, electoral boundaries, and electorates separated by ownership?
4. Is eligibility derived from legal/electoral rules plus population facts rather than stored as universal voter identity?
5. Are electorate membership, turnout disposition, actual participation, and election result distinct?
6. Can baseline politics coexist with dynamically simulated housing politics in one population political owner?
7. Does material experience influence population without allowing HousingState to own political response?
8. Can later resolution deepen without population ownership migration?

No population implementation and no Commit-5 design is authorized by this document.
