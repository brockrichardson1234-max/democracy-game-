# Living Country Step 3 — Population/Geography Candidate Self-Audit

Status: **ASSESSMENT AUDIT EVIDENCE — PRESERVED FOR REVIEW. NOT PRODUCT, ARCHITECTURE, DOMAIN, CALIBRATION, UI, ROADMAP, SCHEMA, RUNTIME, OR IMPLEMENTATION AUTHORITY.**

Audited candidate:

- `docs/product-assessment/18_LIVING_COUNTRY_POPULATION_GEOGRAPHY_SUBSTRATE.md`
- Commit: `43def7fe60c4e83980f1631cc31cee3ec2dc26ec`

Accepted authority beneath the candidate:

- Step 5 presidential-game authority: `2c5fc2d798c5fcc232b519052390b56d60f06267`
- Living Country Step 1 authority: `12_LIVING_COUNTRY_STEP1_CLARIFICATIONS_AND_AUTHORITY.md`
- Living Country Step 2 authority: `16_LIVING_COUNTRY_STEP2_COMMON_GRAMMAR_AUTHORITY.md`

This self-audit asks whether the candidate actually prevents population duplication, cross-product explosion, geographic false precision, and ownership leakage.

---

# Verdict

## **DIRECTIONALLY STRONG; DETACHED AUDIT REQUIRED WITH SIX LOAD-BEARING QUESTIONS**

The candidate’s central answer is promising:

> one household-aware weighted population fabric, domain-owned sparse associations, selectively persistent joint correlations, and typed overlapping geography.

It correctly rejects both 340 million individual citizen objects and one global Cartesian cohort table.

It also correctly identifies why the accepted I4 population proof cannot simply be expanded by appending employment, income, health, household, media, and geography fields to `WeightedPopulationCohort`.

However, the self-audit finds six seams that need independent review. Three are potentially blocking because they concern ownership and causal identity, not implementation detail.

---

# What passes the self-audit

## P-01 — One population remains the governing rule

The candidate preserves one canonical ordinary-population identity, weight, residence, household, and recipient-political continuity system.

Workers, patients, renters, taxpayers, audiences, beneficiaries, and voters remain roles or associations concerning that population rather than separately mutable populations.

## P-02 — Domain facts remain domain-owned

Employment, income, Housing, health, education, information delivery, and ballots are not moved into PopulationState merely because they describe people.

The candidate uses domain-owned associations and population references instead of a universal person record that owns all social reality.

## P-03 — Household context is introduced for causal reasons

Household/co-residential relationships are justified by Housing occupancy, shared finances, employer coverage, dependents, program eligibility, migration, and direct experience.

The document also prevents household, family, tax unit, benefit unit, insurance unit, consumption unit, and voter unit from becoming synonyms.

## P-04 — Group quarters are not forced into household semantics

College housing, nursing facilities, correctional institutions, military quarters, and shelters can receive distinct treatment while remaining inside the one population.

## P-05 — Silent marginal multiplication is rejected

Cross-domain queries must report whether a needed joint distribution is exact, modeled with provenance, bounded, or unsupported.

The candidate does not permit separate renter, manufacturing, and coverage marginals to become an exact joint count by multiplication.

## P-06 — Project and story exposure no longer imply global cohort splits

A project catchment can remain domain-local. Publication or platform delivery can remain a sparse information occurrence.

Shared population refinement occurs only when later processes genuinely need to track the same affected subset.

## P-07 — Demographic movement and electoral boundaries remain distinct

Births, deaths, immigration, emigration, internal migration, household transitions, redistricting, and boundary changes retain separate accounting consequences.

## P-08 — Geography is recognized as overlapping and typed

Residence, workplace, service, market, network, media, operational, jurisdictional, and electoral geography are not collapsed into one hierarchy.

## P-09 — Current implementation is preserved selectively

The candidate retains conservation, deterministic lineage, save/load persistence, no district-owned people, and current artifact limitations while refusing to universalize Housing-specific cohort fields and uniform state eligibility proxies.

---

# Potentially blocking questions

## S3-01 — HIGH — Population scope ownership and identity are not yet closed

### Finding

The candidate defines a population scope as a semantic reference to a weighted portion of the population. It may be directly represented, derived, refined, modeled, bounded, or unsupported.

That is useful, but it does not yet say what kind of canonical or noncanonical object a persistent scope is, who owns it, or how two scopes can be proven to describe the same or overlapping people.

Without a stronger rule, the design can accidentally create:

```text
LaborScope A = 10,000 separated workers
IncomeScope B = 10,000 affected earners
HealthcareScope C = 10,000 coverage losses
```

and call them the same population merely because the weights match.

Alternatively, each domain could maintain its own mutable slice of the one population and silently become a shadow population owner.

### Questions requiring closure

- Is a scope a Population-owned conserved selection/refinement record, a domain-owned association, a model/information artifact, or an ephemeral projection?
- When may it persist canonically?
- What is its immutable source identity?
- How are parent, child, complement, partition, and overlap relationships represented semantically?
- Can its weight mutate independently of source population and associations?
- How is double counting prevented when overlapping scopes are aggregated?
- What identity crosses a domain boundary when the same affected people must be followed?

### Required direction

Every load-bearing scope must declare its category, semantic owner, source population lineage, weight derivation, overlap/partition semantics, effective time, support status, and whether it is reusable across owners.

A matching number is never sufficient evidence of shared population identity.

---

## S3-02 — HIGH — Crosswalk ownership can leak population or domain truth into GeographyState

### Finding

The candidate says GeographyState may own canonical crosswalk relationship definitions while also allowing population-, household-, housing-unit-, and employment-weighted crosswalks.

Exact geometry and spatial overlap can be Geography-owned.

A population-weighted crosswalk, however, depends on PopulationState at an as-of time. A job-weighted crosswalk depends on Labor/Employment. A housing-unit-weighted crosswalk depends on Housing.

If GeographyState owns those weights as current facts, Geography becomes a shadow owner of people, jobs, or housing stock.

Similar ambiguity exists for service areas, media markets, grid membership, and institutional catchments. Their spatial support may belong to Geography, while the operational assignment or membership rule may belong to an institution or material domain.

### Required direction

The design needs to separate:

1. Geography-owned identities, geometry, topology, containment, and exact spatial overlap;
2. domain/institution-owned operational membership or assignment rules referencing geography;
3. population-, job-, household-, housing-, service-, or exposure-weighted crosswalk realizations, which are derived/model/measurement artifacts or owner-specific transformations with as-of and provenance;
4. receiving-owner canonical allocations created from those inputs.

Geography may index or reference such products. It must not own the changing nonspatial fact used as the weighting basis.

---

## S3-03 — HIGH — Coarsening may depend on forbidden future knowledge

### Finding

The candidate permits coarsening when every accepted future consumer receives an equivalent answer and asks which future consumer would be affected.

That phrase can be read in two incompatible ways.

Valid meaning:

- all currently supported process contracts, active obligations, scheduled decisions, persistent legal rules, and known query requirements can consume the coarsened representation without losing required state.

Invalid meaning:

- the engine looks ahead at future random events, actor decisions, media exposure, elections, or player actions and merges because it knows the distinction will not happen to matter.

The latter would make representation management omniscient and could change world resolution based on hidden future history.

### Required direction

Coarsening must be evaluated against current supported semantics and active/scheduled obligations, never realized future outcomes.

If an added future domain or later situation needs a correlation that was not preserved, the system must refine from retained distributions/provenance with appropriate uncertainty or report the answer as bounded/unsupported. It may not reconstruct exact historical identity after it was discarded.

---

# Significant questions

## S3-04 — MEDIUM — Household and person weights need a dual-accounting invariant

### Finding

The weighted household/person bundle is promising, but the candidate does not fully state how household weight, member-role multiplicity, and person weight reconcile.

A bundle representing 100 households with one adult and two children represents:

- 100 households;
- 100 adult persons;
- 200 child persons.

A birth changes person count and member composition without necessarily changing household count. A death may remove one member without dissolving the household. Household formation may change household count without creating people.

### Required direction

Every household-aware representation needs explicit dual accounting:

```text
represented persons by role
= represented household weight × role multiplicity/distribution
```

or another declared relationship that reconciles person and household totals.

Refinement, merge, birth, death, member entry/exit, and household formation/dissolution must preserve the applicable person and household accounting separately.

## S3-05 — MEDIUM — Residence support needs allocation semantics

### Finding

The candidate allows a carrier to have residence support and allows modeled fine assignment, but it does not fully distinguish:

- one carrier located in one exact geography;
- one weighted carrier distributed across several disjoint finer geographies;
- one household whose members have exceptional split residence;
- one carrier being queried against several overlapping boundary systems.

Without an allocation rule, the same carrier could be treated as fully resident in several places.

### Required direction

At a selected residence resolution, the carrier/person/household weight assigned across disjoint residence supports must conserve its total.

Coarse and fine residence may coexist only through an exact or modeled reconciliation relationship. Membership in overlapping electoral, service, market, media, or event geographies is then derived or associated separately; it is not additional residence weight.

## S3-06 — MEDIUM — Population lifecycle transitions can leave dangling domain associations

### Finding

The candidate says domain associations continue or terminate through births, deaths, moves, and household changes, but does not yet impose a closure rule.

A domain could retain a current job, insurance, school, benefit, or Housing association pointing to a population carrier that has died, moved, merged, or been superseded.

### Required direction

Population lifecycle and lineage occurrences must provide stable replacement/termination provenance. Current domain associations must resolve against active population lineage or become historical/terminated records.

Population does not dictate the domain consequence, but no accepted current-state relationship may point to nonexistent or incompatible population identity.

---

# Attempted exploit tests

## Exploit A — matching weights imply matching people

Create three domain scopes of equal weight with unrelated allocation provenance and treat them as one shared affected population.

**Current result:** not explicitly prohibited enough. S3-01 must close it.

## Exploit B — Geography owns a population-weighted district crosswalk forever

Population moves after the crosswalk is created, but Geography continues to own the old weights as current truth.

**Current result:** ownership wording is ambiguous. S3-02 must close it.

## Exploit C — merge using future event knowledge

The engine sees that no later story will target one fragment and merges it, while another seed would preserve it.

**Current result:** candidate intention rejects this, but wording does not. S3-03 must close it.

## Exploit D — household member death reduces household count

A weighted household bundle loses one member and incorrectly subtracts both person and household weight.

**Current result:** conservation principles exist but dual accounting is under-specified. S3-04 must close it.

## Exploit E — one carrier fully resides in three modeled districts

The same represented weight is counted in each district because residence support lacks allocation semantics.

**Current result:** crosswalk conservation helps, but explicit residence allocation is needed. S3-05 must close it.

## Exploit F — moved population retains current old-state benefit relationship

Population residence changes, but a domain association remains attached to a retired lineage identity without review.

**Current result:** the candidate gestures toward continuation/termination but lacks a closure invariant. S3-06 must close it.

## Exploit G — story exposure creates global Cartesian splits

Every artifact receipt becomes part of global merge identity.

**Current result:** rejected cleanly by the candidate.

## Exploit H — unsupported renter-worker count appears as exact

State renter share and PUMA industry share are multiplied and presented as exact district truth.

**Current result:** rejected cleanly by the four support statuses and query-honesty contract.

---

# Research check

The external-source lessons used by the candidate are directionally sound:

- ACS PUMS supplies disclosure-protected person and housing-unit records, organized for household analysis and including group-quarters persons, but only at nation/state/PUMA public-use geography.
- ACS small-area estimates can provide geographic controls but are estimates with reference periods and uncertainty.
- LODES distinguishes residence-area, workplace-area, and origin-destination employment data and is modeled administrative data rather than a complete population owner.
- Census publishes geography hierarchy and relationship materials rather than implying all geographies share one simple hierarchy.
- SIPP and CPS can inform household, income, employment, insurance, and labor-force dynamics without becoming canonical simulated people.

These facts support the candidate’s refusal to select one source as the whole population ontology.

---

# Self-audit disposition

Do not discard or rewrite the candidate.

Proceed to a detached audit under the unchanged gate, focusing on:

1. scope identity/ownership and overlap accounting;
2. weighted crosswalk ownership;
3. non-omniscient coarsening;
4. household/person dual accounting;
5. residence allocation;
6. lifecycle association closure.

If the detached audit agrees that these are bounded, repair them through a controlling addendum/authority action.

If it finds that scopes cannot be closed without creating either a global cohort cross-product or duplicate populations, return **REVISE** and repair Step 3 before proceeding.

No Living Country Step 4 work is authorized by this self-audit.