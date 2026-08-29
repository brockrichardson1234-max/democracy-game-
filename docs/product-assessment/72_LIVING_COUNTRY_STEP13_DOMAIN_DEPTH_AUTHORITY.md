# Living Country Step 13 — Domain-Depth Authority

Status: **ACCEPTED LIVING-COUNTRY STEP-13 DESIGN AUTHORITY, LIMITED TO THE MECHANISM-LEVEL MINIMUM DEPTH MATRIX AND ITS OWNERSHIP, RECEIVER-CLOSURE, ACTIVATION, AND SOURCE-GRANULARITY RULES.**

This receipt accepts the repaired Living Country Step 13 composite:

1. `68_LIVING_COUNTRY_DOMAIN_DEPTH_MECHANISM_ASSIGNMENT.md`
   - original candidate;
   - candidate commit: `6fbe1f0b1ec5a0bd4f4a93118b08b2991a13da88`;
2. `70_LIVING_COUNTRY_STEP13_FINAL_CONTRACT_REPAIR.md`
   - controlling repairs;
   - repair commit: `a9896247c89affb1cae8c7debb4da9d73f31172a`.

Audit evidence:

- `69_LIVING_COUNTRY_STEP13_DETACHED_AUDIT.md`
  - audit commit: `24713529ce70495faec4d12325c9716abc8a660d`;
  - verdict: **REVISE — 1 blocking ownership/depth finding, 4 bounded clarifications**;
- `71_LIVING_COUNTRY_STEP13_FINAL_BINARY_REAUDIT.md`
  - final audit commit: `949fb05446601de5d728b469454d5e76d4163c7f`;
  - verdict: **PASS** under the unchanged Step 13 gate.

Accepted authority beneath this receipt:

- Step 5 presidential-game authority;
- Living Country Steps 1–12 authority.

This is design authority only.

It does not authorize Early Access scope, final domain count, formulas, schemas, source packages, data transformations, runtime architecture, implementation order, UI, January 2029 or January 2033, roadmap work, or a next code increment.

---

# 1. Precedence

Where accepted Step 13 documents conflict:

```text
70_LIVING_COUNTRY_STEP13_FINAL_CONTRACT_REPAIR
→ controls
68_LIVING_COUNTRY_DOMAIN_DEPTH_MECHANISM_ASSIGNMENT
```

`69` and `71` are audit evidence explaining why the candidate changed and why the repaired composite passed.

They do not independently define product behavior.

---

# 2. Accepted central answer

The accepted Step 13 answer is:

> **The Living Country assigns minimum causal depth to mechanisms and owned state—not to whole policy labels. A policy area may combine core-causal, structured-condition, contextual, exact institutional/program, and bounded-external/shock mechanisms. Each load-bearing mechanism has one semantic identity, one owner, and one minimum depth floor regardless of how many policy, issue, UI, or analytical lenses reference it.**

The tier meanings are:

1. **Core causal** — load-bearing endogenous canonical state, path dependence, and repeated cross-domain transformations required by accepted gameplay/history.
2. **Structured condition** — canonical evolving state with typed inputs/outputs and bounded internal response, without requiring full micro/network detail.
3. **Contextual** — bounded canonical or modeled state sufficient for constraints, evidence, political interpretation, and limited coupling, but not a repeated deep transformer for current supported gameplay.
4. **Bounded external/shock** — an externally initiated source family with explicit eligibility, timing, scope, uncertainty, and domestic typed handoffs; domestic consequences resolve through normal owners.

Depth tier is a semantic obligation.

It is not a proxy for:

- number of variables;
- number of entities;
- update frequency;
- amount of code;
- importance in politics;
- UI prominence;
- Early Access priority.

---

# 3. One semantic mechanism registry

Every load-bearing mechanism/fact family must be able to declare conceptually:

- mechanism/fact-family identity;
- semantic owner;
- minimum depth floor;
- canonical state form(s);
- accepted aliases/policy lenses;
- population/geography/entity scope;
- sender/receiver relationships;
- accepted consumer families supporting the floor;
- measurement relationship;
- generated-prehistory participation;
- exact overlays where allowed;
- unsupported/deferred detail.

This is a semantic obligation.

It does not mandate one runtime registry data structure.

Policy labels may be many-to-many views over the registry.

They do not create owners.

---

# 4. Controlling ownership examples

## 4.1 Student loans

Federal credit/program/fiscal owners own:

- balances;
- obligations;
- collections/payments;
- cancellations/write-offs where lawful;
- fiscal/subsidy state.

Household Resources owns borrower-resource consequences.

Population owns person/household continuity.

`Education` is a policy lens referencing those mechanisms.

There is no second Education-owned student-loan balance.

## 4.2 Energy prices

Energy owns canonical fuel/electricity price and availability facts at the accepted resolution.

Prices owns broader consumer/producer category state consuming valid energy inputs.

Household Resources owns expenditure/resource consequences.

Production owns sector input-cost consequences.

Those are different facts, not copies.

## 4.3 Immigration

Immigration legal/admin processes own legal status/admission/asylum/enforcement case facts.

Population owns canonical immigration/emigration person-flow and residence transitions.

Labor, Housing, state/local finance, and service mechanisms consume those state changes.

A net-migration statistic is a measurement/projection, not another population owner.

## 4.4 Healthcare coverage

Program/legal/admin owners own eligibility/program decisions.

Healthcare owns canonical coverage/payer relationships.

Labor owns employment state.

Household Resources owns household costs.

Public Finance owns government fiscal flows.

## 4.5 Tariffs/trade

Legal/institutional owners own tariff authority/instruments.

Trade owns import/export consequences.

Production owns input/output consequences.

Prices owns relevant price changes.

Public Finance owns customs receipts.

## 4.6 Disasters

One Disaster Recovery lens may reference hazard, Housing damage, infrastructure, health, displacement, programs, finance, evidence, and politics.

Each fact remains with its own owner.

There is no universal Disaster Recovery material owner.

---

# 5. Minimum-depth definitions

## 5.1 Core causal

A mechanism requires core depth when accepted consumers require repeated combinations of:

- persistent stock/flow/event state;
- endogenous evolution;
- repeated policy/institutional input;
- typed cross-domain output;
- feedback/path dependence;
- population/geography distribution;
- accounting/contribution lineage;
- generated-prehistory continuity;
- materially different later presidential decisions.

Core does not mean person-level or firm-level simulation.

## 5.2 Structured condition

A structured mechanism must own evolving state, receive/emit typed inputs, preserve required scope/lag/capacity/thresholds, evolve through prehistory, and generate legitimate evidence and consequences.

It may use compressed stocks/flows, response models, regional aggregates, queues, or exact overlays.

## 5.3 Contextual

A contextual mechanism may constrain government and politics, produce evidence, and evolve coarsely without providing deep repeated transformation for supported downstream state.

Contextual mechanisms can still become highly politically salient.

## 5.4 Bounded external/shock

A bounded shock/external family must declare source, eligibility, timing, persistence, scope, severity, dependence, observability, uncertainty, and typed domestic inputs.

It cannot carry pre-resolved domestic policy, approval, blame, or electoral effects.

---

# 6. Receiver-depth closure

Every accepted coupling must land in a mechanism deep enough to interpret and transform the input honestly.

A source cannot use the receiving domain as a label and directly assign its final consequence.

Examples rejected:

```text
Unemployment worsens
→ Healthcare -4
```

```text
Tariff imposed
→ Economy -3
```

```text
Hurricane occurs
→ Approval -6
```

```text
Immigration increases
→ Housing pressure +5
```

Instead the relevant source fact enters the appropriate receiving mechanism, which owns the resulting transition at its accepted depth.

If the receiver is too shallow, the content or claimed effect is out of scope, narrowed, or modeled/bounded.

---

# 7. Exact institutional/program overlays

An exact law, grant, credit account, benefit case, project, permit, order, appointment, or contract does not automatically make the surrounding material domain core or exact.

A structured/contextual material domain does not make exact institutional records approximate.

Example:

```text
exact federal infrastructure grant
→ exact fiscal obligation/payment
→ structured bridge/project/network state
→ structured material consequence
```

The game cannot infer exact traffic, employment, production, or political effects beyond receiver support.

Named hospitals, firms, bridges, ports, utilities, universities, or projects may receive exact identity where causally consequential while remaining reconciled with aggregate state.

---

# 8. Accepted core-consumer basis

The following mechanisms receive provisional **core-causal minimum floors** because accepted product/Living-Country consumer families require them.

## 8.1 Production and intermediate use

Core at bounded sector/commodity resolution.

Consumers include:

- Labor;
- Prices;
- Energy;
- Trade/external supply;
- regional industry conditions;
- accepted industrial/security pathways.

GDP remains derived/measured rather than the owner.

## 8.2 Labor employment/gross flows/wages

Core.

Consumers include:

- Household Resources;
- Healthcare coverage;
- Public Finance;
- Housing affordability;
- population material experience.

## 8.3 Household earned/disposable resources

Core.

Consumers include:

- Housing;
- healthcare cost exposure;
- taxes/transfers;
- consumption exposure;
- material/political measurement.

## 8.4 Major category prices

Core.

Consumers include households, Production, Housing/energy/health cost pathways, and measurement/political interpretation.

CPI/PCE-style headline inflation remains measurement/projection.

## 8.5 Federal public finance

Core.

Includes receipts, outlays, deficits, debt, net interest, and supported authorization/appropriation/obligation/payment execution.

## 8.6 Housing

Core for stock, occupancy/vacancy, affordability, and construction pipeline at bounded geographic resolution.

Mortgage/credit/local land-use submechanisms may remain structured.

## 8.7 Healthcare coverage and supported major public-program transitions

Core.

Provider capacity, health burden, medical prices/spending, and finer disease state may remain structured/contextual as assigned below.

## 8.8 Immigration legal/status routes and Population migration

Core for supported federal legal/admin status routes and canonical Population movement.

Operational submechanisms may remain structured.

## 8.9 Energy major balance, availability, and prices

Core at compressed commodity/regional resolution.

Grid/facility detail may remain structured/contextual.

## 8.10 Major trade flows and production/input channels

Core at compressed commodity/industry/country-group resolution where required by accepted tariff, sanctions, industrial-policy, and external-supply pathways.

Fine firm/logistics detail may remain structured.

These floors may be revisited only through later explicit design authority when accepted consumers change.

---

# 9. Accepted structured/contextual mixed floors

## 9.1 Monetary/financial conditions

- Federal Reserve institutional behavior: structured;
- rates/credit conditions: structured;
- household/business balance-sheet state: structured;
- systemic crisis initiation may be bounded shock/external family;
- debt-service consequences return to Public Finance.

## 9.2 State/local finance

Structured.

Enough for grant participation, recessions, disasters, education/health/infrastructure implementation, and governor decisions without one full local-budget simulator.

## 9.3 Healthcare

- coverage/public-program transitions: core;
- payer/spending: structured with core fiscal handoffs;
- provider capacity/access/utilization: structured;
- medical prices/cost exposure: structured;
- broad population health burden: structured;
- fine slow morbidity detail: contextual;
- epidemic/pandemic initiation: bounded shock family.

## 9.4 Infrastructure

- major asset/network condition and logistics: structured;
- exact major disruption occurrences allowed;
- exact federal programs/projects allowed;
- water/wastewater/broadband generally contextual until supported content requires structured depth.

## 9.5 Education

- K–12 enrollment/finance/workforce: structured;
- higher-ed enrollment/capacity: contextual/structured;
- student-aid/loan mechanism: core where supported, owned through federal credit/program/fiscal systems;
- attainment/learning outcomes: contextual slow state.

## 9.6 Crime/public safety

- incident/victimization: structured;
- operational capacity: structured;
- prosecution/corrections flow: contextual/structured;
- exact active legal cases may be retained through legal owners;
- public perception remains information/population state.

## 9.7 Environment/climate/disasters

- pollution/emissions/exposure: structured where supported;
- environmental legal/compliance acts: exact institutional state where active;
- slow climate background: contextual;
- disaster hazards: bounded shock families;
- recovery: structured domestic state with exact fiscal/admin actions where supported.

## 9.8 Agriculture/food

Agriculture need not be a standalone deep domain by default.

- production: structured within Production/commodity mechanisms;
- food prices: Prices;
- farm programs: exact/structured federal program and Public Finance mechanisms;
- drought/weather: shock/background mechanisms.

## 9.9 Social insurance/safety net

No universal Welfare domain.

Program-specific legal/admin/fiscal mechanisms feed Household Resources, Healthcare, Labor, Housing, and state finance through their owners.

## 9.10 Foreign affairs/national security

- external-country/relationship state: contextual;
- diplomacy, sanctions, commitments, security routes: structured institutional/legal/fiscal;
- military posture/readiness/deployment: structured;
- conflict/cyber/coercion/supply disruptions: bounded external/shock families;
- domestic consequences route through Trade, Energy, Infrastructure, Public Finance, institutions, Population, and evidence.

---

# 10. Policy/domain labels are convenience lenses only

The following summary labels may be used for planning/player communication:

- Economy;
- Jobs;
- Cost of Living;
- Public Finance;
- Housing;
- Healthcare;
- Immigration;
- Energy;
- Trade/Industry;
- Infrastructure;
- Education;
- Crime/Public Safety;
- Environment/Climate;
- Agriculture/Food;
- Social Insurance;
- Foreign/National Security.

None owns all state shown under it.

A later issue/workstream/UI view must preserve the actual underlying mechanism ownership.

---

# 11. Mechanism activation and generated-history rules

Core mechanisms evolve through generated prehistory even when politically quiet.

Structured mechanisms preserve enough path-dependent state for later legitimate use.

Contextual mechanisms may evolve coarsely but cannot later invent exact past detail.

A generated policy, shock, institution, or actor action may not demand unsupported deeper state after the fact.

The active package must use one predeclared route:

1. prospective future-blind deepening;
2. modeled/bounded response;
3. narrowed supported consequence;
4. out-of-scope classification.

Salience, media attention, or presidential interest does not itself deepen a mechanism.

---

# 12. Supported-policy and shock closure

Before a policy or shock family is admitted into generated prehistory or player-era content, its load-bearing downstream mechanisms must exist at sufficient depth.

Examples:

- healthcare reform requires coverage, program/fiscal, household, provider/access, and state receivers at the depth implied by its claims;
- major tariff/sanction policy requires Trade, Production, Prices, Labor, and Public Finance pathways at the depth implied by its claims;
- immigration reform requires legal/status, Population, Labor, Housing, and relevant state/service receivers;
- student-loan action requires credit/program/fiscal and household-resource mechanisms;
- energy policy requires Energy, Production, Prices, Trade, finance, and environmental mechanisms for the effects actually claimed;
- pandemic response requires health, Labor, Population, Public Finance, administration, and evidence receivers;
- disaster recovery requires Housing/Infrastructure/Energy/Health/Population/Finance receivers appropriate to the event.

If receiver depth is insufficient, the content is narrowed or unsupported rather than resolved by a direct modifier.

---

# 13. Source/measurement granularity remains independent

Rich official source data do not force equivalent simulation detail.

Examples:

- detailed BEA industry accounts may calibrate a compressed production graph;
- NIBRS incident data may calibrate structured crime state;
- FHWA bridge inventory may calibrate structured infrastructure plus exact selected assets;
- CMS expenditure accounts may calibrate mixed healthcare mechanisms;
- NCES school data may calibrate structured/contextual education;
- detailed trade schedules/data may calibrate compressed commodity/industry channels.

Conversely, a coarse public measurement does not erase deeper hidden canonical state needed by downstream mechanisms.

Calibration transformations and discarded detail remain provenance-bearing.

---

# 14. 2029 and 2033

The accepted mechanism floors are horizon-neutral.

The same package/seed before branch differences may not deepen earlier history because 2033 is requested.

The eight-year horizon creates greater **validation burden**, not a higher automatic tier:

- core stocks/flows must remain stable and reconciled longer;
- slow Housing/infrastructure/health/fiscal processes mature;
- Population/geographic changes compound;
- obligations and debt accumulate;
- structured mechanisms must avoid frozen-state artifacts;
- contextual mechanisms must evolve enough to preserve claimed history;
- no endpoint reinitialization is permitted.

If 2033 cannot remain coherent at these floors, either:

- a floor is inadequate;
- the product scope must narrow;
- or the 2033 horizon fails.

2033 does not receive permission for hindsight depth.

---

# 15. Accepted adversarial proof families

At contract level the matrix supports:

1. sector downturn → Labor → households → coverage → Public Finance → Housing without a recession switch;
2. external energy disruption → Energy → Production/Prices → households/Labor;
3. immigration status/population change → Labor/Housing/services/finance without one impact score;
4. healthcare law → enrollment/coverage → payer/household/provider/fiscal consequences;
5. infrastructure failure → structured asset/network state → exact disruption → logistics/industry consequences;
6. broad contextual education state coexisting with core federal student-loan obligations;
7. structured crime conditions creating political pressure without a national crime god score;
8. bounded hazard → normal Housing/Infrastructure/Energy/Health/Finance recovery pathways;
9. tariff instrument → Trade → Production/Prices/Labor/Public Finance;
10. bounded foreign-security event → domestic institutional/trade/energy/infrastructure/fiscal effects without a grand-strategy simulator.

These are paper contract tests, not implemented simulation proof.

---

# 16. Accepted anti-cheat requirements

Step 13 rejects:

- one tier per whole policy label;
- duplicate mechanism owners across policy lenses;
- conflicting depth floors for aliases;
- core meaning micro-simulation;
- contextual meaning politically irrelevant;
- one `EconomyState` owning all national economic facts;
- GDP directly driving underlying state;
- inflation indices owning prices;
- unemployment rates owning worker transitions;
- one immigration/health/education/crime/infrastructure/environment/foreign-threat score;
- exact administrative records manufacturing exact material outcomes;
- named exact entities duplicating aggregate state;
- source granularity dictating runtime depth;
- coarse measurements dictating shallow hidden state;
- shallow receivers accepting unsupported deep handoffs;
- generated policies/shocks exceeding receiver closure;
- political salience activating missing material history;
- future-aware deepening;
- 2033 target changing prior depth;
- domain depth deciding Early Access inclusion;
- dashboard needs creating unnecessary canonical variables;
- bespoke domain engines where shared Living-Country contracts suffice;
- direct modifiers replacing typed owner-resolved couplings.

---

# 17. Research grounding

The mechanism distinctions are consistent with bounded lessons from official sources including:

- BEA industry and input-output accounts — production, intermediate inputs, value added, industries, commodities;
- BLS labor-force flows — gross transitions beneath net headline measures;
- CBO budget outlook — receipts, outlays, deficits, debt, interest and feedback;
- CMS National Health Expenditure Accounts — payer/service/source distinctions;
- EIA electricity/energy material — fuels, generation, grid, demand, prices, outages;
- Census Building Permits — geographic construction variation;
- DHS/OHSS immigration statistics — status/admission/refugee/naturalization/enforcement distinctions;
- NCES education statistics — enrollment, workforce, finance, federal funds, outcomes;
- FHWA infrastructure/bridge data — asset condition, capacity, investment and network state;
- FBI UCR/NIBRS — incident-based versus aggregate crime evidence;
- Federal Reserve Financial Accounts — transaction/stock/balance-sheet distinctions;
- NOAA/NCEI disaster categories and regional effects;
- U.S. trade and tariff data — product/industry/country/trade-flow/legal-tariff distinctions.

These sources guide state distinctions and measurement/calibration.

They do not prove the depth floors are sufficient for implementation, political realism, or fun.

---

# 18. Explicitly not accepted

This authority does not decide or prove:

1. final Early Access domain count;
2. implementation order;
3. implementation architecture;
4. exact mechanism algorithms or equations;
5. exact industry/commodity/category resolution;
6. exact household, firm, provider, asset, case, or facility counts;
7. exact monetary/financial model;
8. exact health, education, crime, infrastructure, environment, or foreign-affairs breadth;
9. exact shock inventory or rates;
10. exact source datasets or transformations;
11. exact calibration quality;
12. exact prehistory implementation;
13. exact 2029/2033 player-start decision;
14. exact UI or State-of-the-Nation presentation;
15. performance targets;
16. save-size/persistence strategy;
17. content density;
18. roadmap or next code proof;
19. balance, comprehensibility, fun, or commercial viability.

---

# 19. Step 13 verdict

## **ACCEPTED**

The Step 13 question is answered at design-contract level:

> **The first modern U.S. game requires a core causal economic/fiscal/Housing spine and selected core mechanisms inside Healthcare, Immigration, Energy, Trade, and federal programs, while many supporting mechanisms may remain structured or contextual and external crises may enter through bounded shock families. Depth attaches to one owned mechanism identity, not the policy label that happens to display it. Every claimed policy, shock, historical transition, and cross-domain effect must terminate in receivers deep enough to resolve it honestly.**

This establishes conceptual minimum depth floors.

It does not choose which of those mechanisms must ship in Early Access or how they are implemented.

---

# 20. Next authorized Living Country question

The next phase may ask:

> **Can the accepted Living Country contracts and mechanism-depth floors jointly produce coherent cross-layer presidential situations when several domains, actors, evidence paths, media/public interpretations, institutions, historical records, and policy routes interact—and do those situations remain coherent when key observations, actors, shocks, coverage, policy options, or attributions are removed or changed?**

This authorizes Living Country **Step 14 — Cross-Layer Adversarial Stress Proofs** as design assessment only.

Step 14 may:

- build a bounded set of cross-layer paper proofs spanning several accepted mechanisms;
- trace ownership, cross-domain coupling, observation, actor action, media/public state, issue formation, administration receipt, presidential options, and persistent consequences;
- perturb/remove links and require coherence;
- test quiet/non-escalating paths;
- test autonomous non-presidential initiative;
- test mixed-depth mechanisms and bounded shocks;
- test historical inheritance and generated-prehistory requirements;
- identify contradictions that require bounded repair to prior Living Country contracts.

Step 14 may not:

- implement simulation;
- use authored screenplay as proof;
- choose Early Access scope;
- lock final UI;
- choose 2029 or 2033;
- create a roadmap or next code proof;
- modify runtime, schema, source, configuration, test, data, or production files.