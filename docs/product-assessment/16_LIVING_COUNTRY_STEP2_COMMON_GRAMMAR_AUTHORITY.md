# Living Country Step 2 — Common Grammar Authority

Status: **ACCEPTED LIVING-COUNTRY STEP-2 DESIGN AUTHORITY, LIMITED TO THE SEMANTIC PARTICIPATION GRAMMAR FOR MATERIAL/SOCIAL DOMAINS.**

This receipt accepts the common country-state grammar defined by:

- `13_LIVING_COUNTRY_COMMON_COUNTRY_STATE_GRAMMAR.md`

subject to the controlling clarifications in this receipt.

Audit evidence:

- `14_LIVING_COUNTRY_STEP2_SELF_AUDIT.md`
- `15_LIVING_COUNTRY_STEP2_DETACHED_AUDIT.md`

Accepted authority beneath this receipt:

- Step 5 presidential-game authority: `2c5fc2d798c5fcc232b519052390b56d60f06267`
- Living Country Step 1: `11_LIVING_COUNTRY_LAYER_OWNERSHIP_CONTRACT.md` as clarified and accepted by `12_LIVING_COUNTRY_STEP1_CLARIFICATIONS_AND_AUTHORITY.md`

This receipt does not accept the final country domains, population representation, geographic primitives, cross-domain formulas, media depth, historical calibration date, UI, Early Access scope, implementation structure, roadmap, or next code increment.

Where this receipt conflicts with `13`, this receipt controls.

---

# 1. Accepted central principle

The common country-state grammar is accepted as:

> **A shared causal handshake, not a shared internal body.**

A durable material/social domain must expose enough semantic information for other owners, measurements, history, and player-facing projections to understand:

- what facts it owns;
- what those facts mean;
- their units and accounting form;
- when and where they apply;
- who or what experiences them;
- what inputs may legitimately enter;
- what outputs may legitimately leave;
- what can be observed;
- what remains uncertain;
- how current state arose;
- how greater resolution can be introduced safely.

Housing, employment, healthcare, energy, public safety, public finance, and later domains may satisfy this interface while retaining radically different internal entities and processes.

---

# 2. Controlling clarification C-01 — conceptual domains cannot defer fact ownership

A conceptual, player-facing, or navigation domain may group several semantic owners.

For example, an “Economy” presentation may coordinate Labor, Income, Prices, Industry, Trade, and Public Finance facts.

However:

**[HARD INVARIANT LC-GA01] Every load-bearing mutable fact must identify exactly one semantic owner before its domain design may be accepted for cross-domain coupling, measurement, calibration, or depth assignment.**

The following are insufficient ownership declarations:

- “the economy owns it”;
- “the healthcare system owns it”;
- “the country model owns it”;
- “the workstream owns it”;
- “the dashboard owns it.”

A declaration may remain unresolved while the domain is still a candidate. It may not enter an accepted coupling or simulation proof while the owner remains ambiguous.

Domain grouping is permitted for comprehension.

Fact ownership remains exact.

---

# 3. Controlling clarification C-02 — price conditions, estimates, and published indices remain distinct

**[HARD INVARIANT LC-GA02] Underlying transaction or market price conditions, modeled canonical aggregate price state, official published price indices, private estimates, and staff forecasts are distinct facts even when they refer to the same economic phenomenon.**

Possible ownership pattern:

- actual transaction/market price conditions at the selected abstraction — relevant material/market owner;
- a canonical modeled aggregate used by the simulation, if accepted — declared material-domain owner with explicit construction;
- official CPI/PCE or another published price measure — measurement process and information artifact;
- private nowcast or staff forecast — information artifact/projection with provenance;
- population belief about prices or inflation — recipient-owned political/belief state.

A published index may measure canonical price conditions.

It does not become those conditions or overwrite them.

A canonical modeled aggregate may summarize transactions within the simulation.

It may not be presented as an official measured release unless a measurement process creates such an artifact.

The same distinction applies to employment estimates, health statistics, crime reports, Housing indices, energy-price reports, and other measured aggregates.

---

# 4. Controlling clarification C-03 — source semantics do not prescribe receiver behavior

A source-domain output may declare:

- what fact or occurrence it represents;
- its unit;
- time/interval;
- geography;
- population/entity scope;
- provenance;
- uncertainty;
- semantic prerequisites for meaningful consumption.

It may also document likely or intended consumers for design/audit purposes.

But:

**[HARD INVARIANT LC-GA03] The source may not prescribe the receiving domain’s state change merely by defining an output type.**

The receiver independently owns:

- admissibility;
- conversion/adaptation;
- timing and delay;
- geographic/population mapping;
- internal response;
- uncertainty introduced by transformation;
- resulting receiver-owned state and occurrences.

Forbidden:

```text
Labor emits HouseholdIncomeLoss(amount)
→ Income must subtract amount exactly
```

unless the emitted fact is itself a canonical payment/earnings quantity whose accounting semantics make that exact transfer valid and the Income owner admits it under an accepted rule.

Preferred general form:

```text
Labor emits employment/wage/job-separation facts
→ Income owner maps affected population/entities
→ Income owner applies its accepted earnings/household-finance process
→ Income-owned state changes
```

A typed output prevents ambiguity.

It does not become a sophisticated direct modifier.

---

# 5. Accepted domain participation obligations

A candidate material/social domain must declare, where causally applicable:

1. semantic purpose;
2. canonical fact ownership and explicit exclusions;
3. native entity/accounting grain;
4. fact forms: stocks, flows, events, rates, prices, distributions, queues, capacities, networks, statuses, or latent conditions;
5. units, denominators, valuation/index bases, and additivity;
6. time/as-of/interval/effective/deadline semantics;
7. native geography and valid transformations;
8. population/entity associations without duplication;
9. admitted inputs with provenance;
10. emitted outputs with provenance;
11. observation and measurement possibilities;
12. uncertainty and abstraction limits;
13. history and occurrence identity;
14. calibration and initialization;
15. refinement/deepening rules;
16. presidential relevance and deletion/compression justification.

These are semantic obligations, not mandated fields in one runtime object.

---

# 6. Accepted fact-form distinctions

The following forms remain distinct where applicable:

- stocks;
- gross and net flows;
- discrete occurrences/transitions;
- rates and ratios;
- prices, costs, and indices;
- distributions and compositions;
- queues and pipelines;
- capacities and constraints;
- network/topology state;
- classifications/statuses;
- latent/not-directly-observable conditions.

A domain need not use all forms.

It may not substitute one for another without a declared transformation.

In particular:

- stock snapshots are not interval flows;
- net change may conceal load-bearing gross movement;
- capacity is not realized output;
- a price index is not a money balance;
- an event occurrence is not automatically the current condition;
- a rate is not additive without its denominator.

---

# 7. Accepted dimensional and accounting integrity

Every cross-owner quantity must carry sufficient semantics to distinguish, where applicable:

- counts;
- shares;
- rates;
- percentages;
- percentage points;
- physical units;
- currency;
- nominal versus real basis;
- index base;
- denominator;
- interval;
- geographic/entity scope.

Unknown, unmeasured, unavailable, not modeled, not applicable, and zero remain distinct.

Where stock-flow or accounting reconciliation applies, changes must be explainable through declared flows, reclassification, revaluation, or other admitted adjustments.

The same occurrence/output may not be counted twice because several domains, stories, workstreams, or projections reference it.

---

# 8. Accepted time contract

Daily dated world continuity does not require daily domain mutation.

Domains may use:

- exact-event;
- daily;
- weekly;
- monthly;
- quarterly;
- annual;
- irregular;
- mixed;
- continuously/analytically accumulated

semantics when justified.

A domain must distinguish relevant times such as:

- effective/as-of time;
- flow/reference interval;
- decision time;
- execution/completion;
- observation;
- release;
- receipt/exposure;
- deadline/expiration;
- reconsideration.

Equivalent advancement over the same dated inputs must not create divergent canonical outcomes merely because the caller used different time chunks.

No universal monthly or daily domain turn is accepted.

---

# 9. Accepted geography and population participation

Domains may operate at different native geographic supports, including political, market, service, network, project, or exposure geographies.

Residence, workplace, service location, political jurisdiction, market region, media market, and network region may differ.

Aggregation must declare whether it is exact, denominator-weighted, distributional, network-derived, modeled, or invalid.

Disaggregation requires a source/model, uncertainty, and reconciliation; coarse totals cannot masquerade as observed local truth.

All domain facts associate with one canonical ordinary population through references, distributions, geography, household/entity relationships, or other declared links.

No domain may create a separately mutable copy of economic people, patients, renters, audiences, beneficiaries, or voters.

The exact cohort, household, and geographic representation remains unresolved for Step 3.

---

# 10. Accepted input/output handshake

The semantic handshake is:

```text
source owner produces canonical fact/output/occurrence
→ source provides unit, time, geography,
  population/entity scope, identity, and provenance
→ receiving owner validates and adapts
→ receiving process changes only receiver-owned state
→ resulting occurrence/output is recorded
```

Inputs may be rejected, delayed, queued, transformed, or partially admitted.

Repeated references to the same canonical input may not apply the effect twice.

Direct causal transfer, mediated transfer, shared cause, statistical correlation, and political interpretation must remain distinguishable.

No universal unitless `Effect(type, magnitude)` payload is accepted as semantic authority.

---

# 11. Accepted observation and uncertainty contract

A material/social domain owns its condition.

Measurement processes and information artifacts own observations, estimates, releases, forecasts, claims, and revisions.

A domain must identify what can be:

- directly recorded;
- operationally observed;
- sampled;
- administratively reported;
- privately estimated;
- investigated;
- forecast;
- publicly claimed.

World/process uncertainty, actor epistemic uncertainty, measurement uncertainty, forecast uncertainty, and abstraction/model limitation remain distinct.

The player sees bounded information, not raw canonical truth.

---

# 12. Accepted history, calibration, and refinement contract

Each load-bearing current fact must be able to identify:

- current owner;
- applicable time/scope;
- admitted inputs and internal transitions;
- persistent occurrence identities;
- causal provenance root.

Calibration provides validated initialization and then ceases to own live current state.

Starting stocks, flows, geography, population mappings, fiscal relationships, and other accounting constraints must reconcile or declare residuals/uncertainty.

Resolution may deepen inside an owner when the coarser representation cannot support a required outcome, action, observation, exposure, or presidential decision.

Refinement must preserve identity, totals where applicable, history, references, and uncertainty.

It may not create a second authoritative fine-resolution copy.

---

# 13. Accepted quiet-state contract

Material severity does not automatically create:

- an official measurement;
- organization strength;
- national media coverage;
- public salience;
- a political issue;
- presidential attention.

A serious condition may evolve while:

- measurement is delayed or ambiguous;
- effects remain concentrated/local;
- organizations remain weak;
- reporting remains limited;
- no valid White House receipt occurs.

The country remains active and coherent without a drama quota.

Later observation, organization, litigation, state action, journalism, or direct experience may expose the condition.

---

# 14. Accepted anti-ontology tests

Future domain candidates must survive tests against:

- generic level/pressure/capacity meters;
- interface headings becoming a universal technical schema;
- unitless causal effects;
- stock-flow confusion;
- discarding load-bearing gross flows;
- false geographic disaggregation;
- collapsing incompatible geographic frames;
- duplicated population;
- direct policy-to-material outcomes;
- measurement aliases;
- calibration shadow ownership;
- missing values becoming zero;
- double counting;
- universal cadence;
- event records becoming current state;
- severe conditions automatically becoming political drama;
- dashboard-only variables;
- abstractions created mainly for hypothetical future countries;
- bespoke isolated pipelines;
- false unification of materially different domains;
- source outputs prescribing downstream state.

The deletion rule remains:

> Model differences that can return as different material outcomes, observations, autonomous actions, political interpretations, constraints, or presidential decisions. Compress differences that cannot.

---

# 15. Explicitly not accepted

This authority does not decide:

1. the final domain inventory;
2. exact fact owners inside future Economy, Labor, Income, Prices, Health, Healthcare, Energy, Environment, Infrastructure, Crime, Immigration, Education, Industry, Trade, or external domains;
3. population/cohort/household representation;
4. geographic primitives and resolution;
5. cross-domain coupling formulas;
6. measurement methods;
7. stochastic or deterministic transition algorithms;
8. owner-scoped capacity formulas;
9. media/public-belief depth;
10. historical calibration date;
11. generated-prehistory implementation or output quality;
12. domain-depth tiers;
13. State-of-the-Nation UI;
14. six-surface UI authority;
15. Early Access scope;
16. roadmap or implementation order;
17. next code proof.

---

# 16. Step 2 verdict

## **ACCEPTED WITH CONTROLLING CLARIFICATIONS**

The accepted answer to Step 2 is:

> Materially different domains can participate in one Living Country through a common semantic handshake covering ownership, fact form, units, time, geography, population/entity associations, typed inputs and outputs, observation, uncertainty, calibration, history, and refinement—without sharing one internal model.

The next authorized Living Country question is:

> **What one-population and multi-geography substrate can support these domain interfaces without cohort explosion, fake disaggregation, incompatible geographic frames, or duplicated people?**

That is design-assessment authority only. It does not authorize implementation.
