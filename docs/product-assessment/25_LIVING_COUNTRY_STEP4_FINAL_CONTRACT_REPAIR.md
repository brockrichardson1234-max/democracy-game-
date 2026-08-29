# Living Country Step 4 — Final Contract Repair

Status: **LIVING-COUNTRY STEP-4 REPAIR CANDIDATE — PRESERVED FOR DETACHED RE-AUDIT. NOT ACCEPTED PRODUCT, ARCHITECTURE, ACTOR-AI, INSTITUTION, POPULATION, MEDIA, CALIBRATION, UI, ROADMAP, EARLY-ACCESS, SCHEMA, RUNTIME, OR IMPLEMENTATION AUTHORITY.**

This document repairs only the findings returned against:

- `24_LIVING_COUNTRY_AUTONOMOUS_ACTOR_PARTICIPATION_GRAMMAR.md`
- candidate commit `f7e7dbbf54954f0fd0fbd74e698efd69c0da9d37`

Accepted authority beneath this repair:

- Step 5 presidential-game authority: `2c5fc2d798c5fcc232b519052390b56d60f06267`
- Living Country Step 1 authority: `12_LIVING_COUNTRY_STEP1_CLARIFICATIONS_AND_AUTHORITY.md`
- Living Country Step 2 authority: `16_LIVING_COUNTRY_STEP2_COMMON_GRAMMAR_AUTHORITY.md`
- Living Country Step 3 authority: `23_LIVING_COUNTRY_STEP3_POPULATION_GEOGRAPHY_AUTHORITY.md`

Audit disposition being repaired:

- **REVISE**
- one blocking finding: individualized-human population linkage was not closed;
- three bounded clarifications: entity identity across participant-family labels, material-to-objective information provenance, and aggregate collective-action semantics.

Where this document conflicts with `24`, this document controls.

This repair does not broaden Step 4. It does not choose exact actor AI, actor inventory, population storage, institutional depth, White House/Cabinet design, media depth, historical calibration, generated prehistory, UI, Early Access scope, roadmap, or implementation order.

---

# 1. Repair disposition

The central Step 4 thesis is retained:

> **A shared decision-and-action handshake, not a shared mind, body, authority model, objective function, or power meter.**

The candidate is repaired through four controlling additions:

1. every individualized human actor must declare one closed population-linkage status;
2. participant-family labels may not duplicate one canonical real entity;
3. hidden material truth may not directly rewrite actor beliefs, objectives, or decision state;
4. aggregate participants may emit a collective act only when a real coordination or resolution mechanism produces it.

No other Step 4 claim is accepted by this document. Acceptance requires the unchanged detached gate to pass and a separate authority action.

---

# 2. Individualized-human population-linkage contract

## 2.1 Core invariant

**[HARD INVARIANT LC-ACTR01] Every individualized human actor must possess exactly one declared population-linkage status for every effective interval in which the actor exists in the modeled world.**

The permitted statuses are:

1. **EXACT_CANONICAL_POPULATION_IDENTITY**
2. **STATISTICALLY_REPRESENTED_WITHOUT_EXACT_IDENTITY**
3. **OUTSIDE_MODELED_ORDINARY_POPULATION_SCOPE**

No individualized human actor may remain implicitly linked, ambiguously linked, or silently treated as both inside and outside the canonical ordinary population.

The actor object itself never contributes a second person of represented population weight.

## 2.2 Linkage declaration obligations

Every individualized-human linkage must declare, at design level and later in whatever implementation form is accepted:

- actor identity;
- linkage status;
- effective-from time;
- effective-until time or current-open status;
- population universe or scope to which the declaration refers;
- support status: exact, modeled, bounded, or unsupported as applicable;
- provenance and reconciliation method;
- population-weight treatment;
- permitted exact joins;
- permitted modeled or bounded joins;
- prohibited joins;
- residence and household implications;
- demographic and lifecycle implications;
- material-exposure implications;
- information-recipient and belief implications;
- eligibility/electorate implications;
- transition rules if the linkage status later changes.

These are semantic obligations, not a required universal runtime record.

## 2.3 Status A — exact canonical population identity

An actor with `EXACT_CANONICAL_POPULATION_IDENTITY` is linked to one exact person identity or exact one-person carrier inside the canonical ordinary population substrate.

Required semantics:

- the Population-side person identity or carrier is the only source of represented person weight;
- the actor is a non-weight-bearing individualized political/institutional overlay or another declared nonduplicating representation;
- residence, household/co-residential membership, group-quarters relation, and retained Population-owned demographic continuity come from the linked Population identity;
- domain-owned employment, income, Housing, health, education, material exposure, or other facts may be joined only through the exact linked identity and the relevant domain’s admitted relations;
- actor-private beliefs, objectives, intentions, and memories remain actor-owned and do not become aliases for Population-owned public belief state;
- exact linkage does not itself grant the actor, administration, player, or public epistemic access to every linked fact;
- information access still follows role, receipt, confidentiality, observation, and bounded-knowledge rules;
- lifecycle and residence transitions affecting the linked person are resolved once through the Population substrate and referenced by actor/institutional processes where relevant;
- office vacancy, succession, incapacity, eligibility, or other institutional consequences are separately resolved by the proper procedure or institution.

Forbidden:

```text
actor object adds person weight 1
+ linked Population carrier already includes person weight 1
```

Forbidden:

```text
exact population link
→ actor automatically knows household income, private health state,
  every received story, or every Population-owned belief
```

## 2.4 Status B — statistically represented without retained exact individual identity

An actor with `STATISTICALLY_REPRESENTED_WITHOUT_EXACT_IDENTITY` is a distinct named human whom the model declares to be included once within the ordinary-population universe, but whose exact canonical person carrier or household identity is not retained.

This status is legitimate when the actor’s institutional identity and decisions matter but exact ordinary-population joins do not yet justify additional population resolution.

Required semantics:

- the actor contributes no additional represented population weight;
- the declared population universe already includes the person statistically;
- the linkage identifies the Population-owned exact scope, modeled scope, bounded scope, or supported universe within which the actor is represented;
- the count-neutral inclusion claim must reconcile against that scope and may not exceed its represented person weight when considered with other reserved or resolved individualized-person claims;
- the actor may possess independently supported biographical, office-qualification, public-record, or generated-history facts with their own owners and provenance;
- those actor-specific facts do not establish an exact Population join unless a later linkage transition does so;
- no aggregate cohort, scope, district, demographic cell, household class, media audience, or domain allocation may be copied into the actor as exact personal truth;
- queries requiring exact residence, household, demographic, material exposure, recipient history, ordinary-population belief, eligibility, or historical membership must return only what their support permits: independently known exact actor fact, modeled, bounded, or unsupported;
- equal compatibility with a scope is not proof of exact membership in any one carrier, household, exposure group, or recipient history;
- actor-private political beliefs remain actor-owned and may not be initialized by silently treating an aggregate population average as the actor’s exact belief;
- ordinary-population political behavior, electorate membership, or material experience may not be inferred exactly from the actor’s office, party, biography, or broad population scope.

Example:

A generated senator may be statistically represented within the national ordinary population while retaining exact institutional facts such as current Senate office, represented state, party membership, and publicly generated age. The design may not infer that senator’s exact household income, Housing tenure, insurance coverage, media exposure, personal vote history, or ordinary-population belief from a statewide or demographic average.

## 2.5 Population-affecting transitions under statistical representation

A statistically represented actor may later experience a load-bearing population transition such as:

- death;
- immigration or emigration;
- internal migration;
- entry to or exit from group quarters;
- household formation or dissolution;
- another transition requiring one-person population accounting.

**[HARD INVARIANT LC-ACTR02] Such a transition may not be recorded only on the actor while leaving Population unchanged, or only on Population while leaving the actor’s history unrelated.**

The design must use one of:

1. promote or resolve the actor to an exact canonical Population identity from the necessary effective time without adding person weight;
2. create one occurrence-linked affected scope representing exactly one already-included person, with provenance and population reconciliation;
3. retain a modeled or bounded transition only when exact reconciliation is not required, clearly marking unsupported joins and uncertainty.

A later exact link must partition or identify an already represented person. It must never add a new person merely because the actor became important.

The transition preserves prior uncertainty. It does not retroactively fabricate an exact household, residence, material-exposure, or information history that was never retained.

## 2.6 Status C — outside modeled ordinary-population scope

An actor with `OUTSIDE_MODELED_ORDINARY_POPULATION_SCOPE` is not included in the modeled ordinary-population universe for the effective interval.

Examples may include, depending on later scenario scope:

- a foreign officeholder outside the modeled U.S. resident population;
- a nonresident external actor;
- another human intentionally excluded by the configured population universe.

Required semantics:

- the actor contributes no ordinary-population weight;
- Population-owned residence, household, demographic continuity, public belief, electorate, and domestic material-exposure joins are unavailable unless a later valid transition changes status;
- actor, organization, office, external-domain, or historical owners may retain applicable identity and biographical facts;
- entry into the modeled ordinary population requires an explicit population transition and linkage-status change with effective time and reconciliation;
- simply appearing in a domestic workstream does not create domestic population membership.

## 2.7 Linkage transitions

**[HARD INVARIANT LC-ACTR03] Population-linkage status changes are canonical relationship transitions with effective time, provenance, reconciliation, and no duplicate weight.**

Permitted examples include:

- statistical representation resolving prospectively to an exact Population identity because a supported process now requires personal lifecycle or household continuity;
- an outside-scope actor entering the modeled resident population through a valid population-movement process;
- an exact current person becoming historical after death while the actor identity and prior record remain available.

A transition may not:

- add or remove weight except through a genuine population transition;
- rewrite prior unsupported joins as exact;
- transfer actor-private knowledge into Population belief state;
- copy aggregate material experience into personal history;
- erase historical linkage intervals.

## 2.8 Permitted joins by status

| Requested relationship | Exact identity | Statistical representation | Outside scope |
|---|---|---|---|
| Population weight | referenced once; actor adds zero | already included; actor adds zero | not included |
| Exact person carrier | yes | no until resolved | no |
| Exact residence/household | through linked Population facts | only if independently supported as actor fact; no Population join | unavailable unless external actor fact applies |
| Exact domain incidence | only through linked domain relation | not from aggregate; modeled/bounded/unsupported | unavailable for domestic population domains |
| Ordinary-population belief/recipient history | only if separately modeled at exact linked identity | may not inherit cohort average as personal truth | unavailable |
| Actor-private beliefs and objectives | actor-owned | actor-owned | actor-owned |
| Electorate/voter relationship | derived through exact legal/population facts | modeled/bounded/unsupported unless independently established | unavailable in domestic electorate |
| Lifecycle population accounting | Population transition linked to actor history | resolve exact identity or occurrence-linked one-person adjustment | explicit entry/exit transition required |

## 2.9 Actor decision-model epistemic rule

**[HARD INVARIANT LC-ACTR04] An actor’s decision process may consume population, domain, and geographic facts only at the support and information level legitimately available to that actor.**

A decision process must preserve distinctions among:

- exact authoritative record;
- direct personal or operational experience;
- measured estimate;
- modeled estimate;
- bounded range;
- uncertain staff or organization assessment;
- unsupported query;
- unknown.

A senator may not treat an unsupported unionized-manufacturing-renter-with-employer-coverage district intersection as exact constituency truth.

A governor may not read exact hidden household migration intentions.

A union may not know exact member public-belief state without a valid internal measurement or communication route.

A firm may know its own payroll exactly while only estimating regional labor supply.

An outlet may know its own subscriber records while only estimating broader audience belief.

Unsupported precision must not be manufactured to complete a utility calculation or make an autonomous choice easier to resolve.

## 2.10 Actor linkage does not collapse actor and population belief

An individualized political actor can simultaneously be:

- a human linked to the ordinary population;
- an officeholder with institutional records;
- an autonomous actor with actor-private beliefs and objectives;
- a recipient of particular information artifacts;
- a subject of public belief held by other people.

Those are distinct facts.

The population linkage does not imply that:

- the actor’s private policy view equals the average belief of a linked cohort;
- the actor automatically receives every artifact delivered to that cohort;
- the actor’s public reputation equals the actor’s self-belief;
- the actor’s own vote in a public election is known or controlled;
- population belief state may be overwritten by actor state.

---

# 3. One real entity across participant-family labels

## 3.1 Core invariant

**[HARD INVARIANT LC-ACTR05] Participant-family labels describe semantic roles, facets, or components. They do not authorize duplicate canonical identities for one real entity.**

A real entity that has both institutional and organizational characteristics retains one canonical entity identity unless there are genuinely distinct legal, organizational, or operational entities connected by explicit relationships.

Examples:

- a hospital system may be an organization operating one or more service institutions;
- a university may be one organization with institutional offices and operating units;
- a media company may be an organization while a newsroom, publication, or station is a subordinate institution or operating unit if that distinction matters;
- a nonprofit may possess organization governance and operate a service institution without becoming two unrelated entities;
- a firm may contain plants or establishments without duplicating the firm’s cash, contracts, leadership, or decisions at each level.

## 3.2 Ownership and reconciliation

For one canonical entity, every load-bearing fact is owned once:

- identity;
- resources;
- contracts;
- memberships;
- offices;
- employees or represented relationships;
- facilities;
- actions;
- liabilities;
- records;
- commitments.

Different components may own different facts, but references reconcile to one entity graph.

Forbidden:

```text
HospitalOrganization.cash = $500m
HospitalInstitution.cash = $500m
→ both counted as separate resources
```

Forbidden:

```text
MediaOrganization publishes Story A
NewsInstitution independently publishes duplicate Story A
→ two publication occurrences for one real act
```

Permitted:

```text
one hospital-system entity
→ organization-governance component owns board/membership/strategy
→ service-institution component owns facility operations and queues
→ one declared finance owner holds cash and obligations
```

## 3.3 Parent, subsidiary, and unit distinction

Multiple entities are permitted when they are genuinely distinct.

A parent company, subsidiary, local union, national union, university, hospital affiliate, newsroom, station, or plant may be separately identified when separate identity changes a supported action, resource, contract, legal responsibility, or institutional outcome.

The relationship must be explicit. Labels alone do not decide identity boundaries.

---

# 4. Material conditions and objective change

## 4.1 Controlling clarification

The phrase `material condition` in Section 9.4 of `24` does not authorize hidden material truth to rewrite participant state.

**[HARD INVARIANT LC-ACTR06] Material or social conditions may affect a participant’s beliefs, objectives, priorities, risk posture, or choices only through a legitimate causal route available to that participant or its institution.**

Valid routes may include:

- direct personal material experience;
- direct operational state owned or observed by the participant or institution;
- a valid measurement or administrative record;
- received information or communication;
- constituent, member, employee, client, source, or counterparty reports;
- a lawful duty activated by an observable condition or authoritative record;
- an institutional procedure that consumes an admitted material input;
- a forecast or estimate with declared uncertainty.

Invalid:

```text
hidden unemployment condition worsens
→ senator objective changes automatically
```

Valid:

```text
regional employment losses occur
→ employer notices separations / state system records claims /
  official or private estimate becomes available / constituents contact office
→ senator receives or observes bounded evidence
→ senator updates belief or priority under actor-owned process
```

## 4.2 Direct experience is still bounded

Direct material or operational experience may be exact for what the participant actually experiences.

It does not automatically establish:

- national scale;
- causal attribution;
- another entity’s experience;
- an unobserved distribution;
- future consequence.

A firm may know its own production stoppage exactly while remaining uncertain about national supply.

A household may know its own rent increase while not knowing the national Housing trend.

A governor may know a delivered state-agency record while lacking complete local reporting.

---

# 5. Aggregate participant outputs and collective acts

## 5.1 Core invariant

**[HARD INVARIANT LC-ACTR07] An aggregate participant process ordinarily produces a distribution, count, flow, price, rate, or set of unit-level actions. It may produce one collective position, commitment, communication, or action only when an actual coordination, organizational, legal, procedural, bargaining, or market-resolution mechanism produces that collective result.**

An aggregate label is not a hive mind.

## 5.2 Valid aggregate results

Potential valid outputs include:

- a distribution of hiring or investment choices among small firms;
- an aggregate count of local outlets publishing a story;
- a share of union locals authorizing action;
- a market-clearing price produced by an accepted market process;
- a vote result produced by a declared membership procedure;
- a collectively adopted industry-association position produced by that organization’s governance;
- a legally binding sector agreement produced by a supported bargaining process.

## 5.3 Invalid aggregate results

Forbidden without a real coordination/resolution mechanism:

```text
SmallFirms collectively decide to oppose the President
```

```text
LocalMedia unanimously adopt one frame
```

```text
Workers issue one national demand
```

```text
Hospitals collectively refuse implementation
```

A player-facing summary may say many firms reduced hiring or many local outlets ignored a story. The underlying record must remain a distribution, set of acts, or actual coordinated decision—not a fictional collective mind.

## 5.4 Collective communication requires a speaker

A public statement attributed to a collective must identify the legitimate speaker or procedure:

- organization leader under delegated authority;
- board or membership vote;
- official spokesperson;
- negotiated coalition representative;
- joint signatories;
- another declared coordination mechanism.

An aggregate statistical class cannot issue a press release.

---

# 6. Corrections to the common participant declaration

The declaration obligations in Section 4 of `24` are supplemented as follows.

## 6.1 Individualized-human linkage

For every individualized human participant:

- which of the three population-linkage statuses applies;
- effective interval;
- population universe/scope;
- support status and provenance;
- weight reconciliation;
- permitted and prohibited joins;
- lifecycle handling;
- whether later exact resolution is required by any supported process.

## 6.2 Canonical entity identity

For any participant described through more than one family label:

- whether the labels refer to one entity, one entity with multiple components, or genuinely distinct entities;
- which canonical identity owns each resource, contract, office, membership, action, and record;
- what parent/subsidiary/unit relationships apply;
- how double counting is prevented.

## 6.3 Information basis for objective change

For any claimed change in participant objective, priority, belief, or risk posture:

- what the participant experienced, observed, measured, received, or inferred;
- support and uncertainty;
- why that information was available;
- what internal owner/process made the update;
- what hidden truth remained unavailable.

## 6.4 Aggregate decision locus

For any aggregate output claimed as one collective act:

- which coordination or resolution mechanism exists;
- who participates;
- how the result is admitted;
- what dissent or heterogeneity remains;
- which occurrence records the collective act;
- why a distribution of unit actions is insufficient for the supported claim.

---

# 7. Hostile repair tests

## Test R4-A — orphan named senator

Setup:

```text
create named senator
→ give no weight
→ provide office and actor beliefs
→ omit population link
```

Required result: **REJECTED.** The senator must declare exact linkage, statistical representation, or outside-scope status for each effective interval.

## Test R4-B — cohort average becomes personal truth

Setup:

```text
senator statistically represented in statewide population
→ statewide renter share = 38%
→ system assigns senator exact renter status
```

Required result: **REJECTED.** The actor may receive only independently supported exact personal facts, or modeled/bounded/unsupported answers.

## Test R4-C — later importance creates a new person

Setup:

```text
statistically represented governor becomes central to a crisis
→ system creates exact person carrier weight 1
→ original aggregate total remains unchanged plus new carrier
```

Required result: **REJECTED.** Exact resolution must identify or partition one already represented person and conserve weight.

## Test R4-D — exact linkage grants omniscience

Setup:

```text
actor exactly linked to person carrier
→ actor decision AI reads linked household income,
  medical state, hidden media exposure, and population belief
```

Required result: **REJECTED.** Semantic linkage does not grant epistemic access.

## Test R4-E — statistical actor dies

Setup:

```text
statistically represented officeholder dies
→ actor marked dead
→ Population total and lifecycle history unchanged
```

Required result: **REJECTED** when the actor belongs inside the modeled ordinary population. The death must be reconciled through exact resolution or one-person occurrence-linked population transition without adding or double-counting weight.

## Test R4-F — duplicate hospital entity

Setup:

```text
HospitalSystemOrganization owns cash, contracts, staff
HospitalSystemInstitution separately owns same cash, contracts, staff
```

Required result: **REJECTED.** One entity identity or explicit distinct-entity relationship must own each fact once.

## Test R4-G — hidden material truth rewrites a union objective

Setup:

```text
canonical regional wage decline is not observed
→ union leadership priority changes automatically
```

Required result: **REJECTED.** A valid experience, record, measurement, communication, or estimate must reach the decision locus.

## Test R4-H — aggregate small firms issue a collective demand

Setup:

```text
aggregate class SmallFirms
→ one opposition statement attributed to all firms
```

Required result: **REJECTED** unless an actual association, joint-signatory process, legal mechanism, or other coordination procedure produces the statement.

## Test R4-I — constituency cross-tab precision laundering

Setup:

```text
actor has modeled district estimate for unionized manufacturing renters
→ autonomous decision treats estimate as exact headcount
```

Required result: **REJECTED.** The decision record must preserve the estimate’s support, uncertainty, and permitted use.

## Test R4-J — outside actor silently enters domestic electorate

Setup:

```text
foreign leader participates in U.S. negotiation
→ system treats actor as U.S. voter or resident
```

Required result: **REJECTED.** A valid population-entry and linkage transition is required.

---

# 8. Re-audit gate

The detached Step 4 gate remains unchanged:

> **Can autonomous participants across government, politics, private institutions, civic organizations, media, and the administration originate, delay, delegate, refuse, communicate, and resolve actions from bounded information, institution-specific authority, owner-specific resources, persistent relationships, and valid population/geographic support—without becoming one generic utility actor, hive mind, omniscient reader, hidden drama source, universal power meter, or direct owner of another system’s outcomes?**

The re-audit must additionally verify that the repaired candidate:

1. requires every individualized human actor to declare exactly one population-linkage status per effective interval;
2. prevents actor objects from adding population weight;
3. prevents statistically represented actors from inheriting aggregate facts as exact personal truth;
4. preserves modeled/bounded/unsupported support in actor decisions;
5. reconciles lifecycle transitions without fabricating or duplicating people;
6. prevents family labels from duplicating one real entity;
7. requires information/experience provenance before material conditions alter participant state;
8. prevents aggregate classes from emitting fictional collective decisions.

A PASS would establish only the common Step 4 participation grammar as repaired. It would not prove exact actor AI, actor inventory, population implementation, detailed institutions, internal-administration gameplay, media depth, generated actors, calibration, performance, UI, or fun.

---

# 9. Explicitly unchanged and deferred

This repair does not decide:

- which domestic actors use exact versus statistical population linkage;
- how many named actors exist;
- the runtime representation of person/actor linkage;
- exact population carriers or synthesis;
- exact biography fields;
- exact actor objectives or decision algorithms;
- exact aggregation or individualization thresholds;
- exact organization/institution component architecture;
- detailed Congress, Cabinet, agency, state, firm, union, advocacy, court, media, or journalist models;
- exact lifecycle formulas;
- exact polling, public-belief, election, or campaign models;
- exact historical calibration or generated-prehistory behavior;
- UI, Early Access scope, roadmap, implementation order, or next code proof.

---

# 10. Repair disposition

## **READY FOR UNCHANGED DETACHED STEP-4 RE-AUDIT**

The blocking semantic escape hatch is closed at contract level:

> **Every individualized human actor must be explicitly and honestly related to the one canonical ordinary population—or explicitly outside it—without duplicate weight, unsupported exact joins, or invented lifecycle history.**

The three clarifications are also controlling:

- one real entity is not duplicated by participant-family labels;
- hidden material truth cannot rewrite actor state;
- aggregate classes cannot speak or decide collectively without an actual coordinating or resolving mechanism.

No Step 4 authority exists until the detached gate returns PASS and a separate authority action accepts the repaired composite.