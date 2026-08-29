# Living Country Step 13 — Final Contract Repair

Status: **LIVING-COUNTRY STEP-13 REPAIR CANDIDATE — PRESERVED FOR DETACHED RE-AUDIT. NOT ACCEPTED PRODUCT, ARCHITECTURE, DOMAIN-DEPTH, EARLY-ACCESS, UI, ROADMAP, SCHEMA, RUNTIME, DATASET, OR IMPLEMENTATION AUTHORITY.**

This document repairs only the findings returned against:

- `68_LIVING_COUNTRY_DOMAIN_DEPTH_MECHANISM_ASSIGNMENT.md`
- candidate commit: `6fbe1f0b1ec5a0bd4f4a93118b08b2991a13da88`
- detached audit: `69_LIVING_COUNTRY_STEP13_DETACHED_AUDIT.md`
- audit commit: `24713529ce70495faec4d12325c9716abc8a660d`
- audit verdict: **REVISE — 1 blocking ownership/depth finding, 4 bounded clarifications**

Accepted authority beneath this repair:

- Step 5 presidential-game authority;
- Living Country Steps 1–12 authority.

Where this document conflicts with `68`, this document controls.

No Step 13 authority exists until the unchanged gate passes and a separate authority receipt explicitly accepts the repaired composite.

---

# 1. Repair disposition

The central Step 13 thesis is retained:

> **Depth is assigned to causal mechanisms and owned state, not whole policy labels. A policy area may contain core, structured, contextual, exact institutional, and bounded-shock mechanisms simultaneously.**

The repair adds five controlling rules:

1. one semantic mechanism identity, one owner, and one minimum depth floor across every policy lens;
2. exact institutional/program overlays do not duplicate or redefine the material mechanism floor;
3. core admission must name accepted consumer families rather than optional future ambition;
4. generated content may not activate unsupported depth post hoc;
5. official/source measurement granularity remains independent of canonical simulation depth.

---

# 2. One mechanism identity, one owner, one depth floor

## 2.1 Core invariant

**[HARD INVARIANT LC-DEPTHR01] Every load-bearing mechanism or mutable fact family has one declared semantic identity, one semantic owner, and one minimum depth floor. Policy-domain labels, issue projections, UI groups, program portfolios, stress-test narratives, and summary matrices may reference that mechanism under several lenses but do not create additional owners or independent depth assignments.**

A later implementation may organize files/classes/packages differently.

Semantic singularity is mandatory regardless of technical organization.

## 2.2 Conceptual mechanism registry

Before a mechanism participates in accepted coupling or generated-history design, the design must be able to declare conceptually:

- mechanism/fact-family identity;
- semantic owner;
- minimum depth floor;
- canonical state form(s);
- accepted policy/domain aliases or lenses;
- population/geography/entity scope;
- sender and receiver relationships;
- accepted consumer families supporting the floor;
- evidence/measurement relationship;
- prehistory participation;
- exact overlays where allowed;
- unsupported/deferred detail.

This is a semantic registry requirement.

It does not mandate one runtime registry table or class hierarchy.

## 2.3 Policy lenses are many-to-many views

A policy label may reference several mechanisms.

A mechanism may appear under several policy labels.

Example:

```text
COST OF LIVING lens
  references → household resources
               Housing costs
               energy prices
               food prices
               healthcare costs
               taxes/transfers

ENERGY lens
  references → fuel balance
               electricity balance
               grid state
               energy prices
               industry use
               household energy exposure
```

The energy-price fact does not acquire a second owner because both lenses show it.

## 2.4 Alias conflict rule

If two sections appear to assign different owners/floors to what may be the same fact, the design must either:

1. declare one mechanism identity and one controlling floor;
2. demonstrate that the facts are semantically different and identify each owner;
3. leave the relationship unresolved and prohibit coupling that assumes equivalence.

Convenient naming cannot decide ownership.

---

# 3. Closed examples of cross-lens ownership

## 3.1 Federal student loans

The semantic mechanism is not duplicated under `Education` and `Public Finance`.

Conceptually:

```text
Federal credit/program/legal/fiscal owners
  own → loan obligations/balances
        statutory/program terms
        collections/payments
        cancellations/write-offs where lawful
        subsidy/fiscal state

Household Resources
  owns → borrower household cash-flow/resource consequences

Population
  owns → borrower person/household identity relationships where retained

Education policy lens
  references → federal student-loan mechanism
               borrowers
               higher-education context
```

Minimum depth floor:

- federal credit/program/fiscal mechanism: **CORE when supported as consequential presidential gameplay**;
- household receiving consequences: per Household Resources accepted floor;
- broad educational attainment remains contextual unless separately raised.

The Education lens creates no second loan balance.

## 3.2 Energy prices

Conceptually:

```text
Energy owner
  owns → canonical fuel/electricity price and availability facts
          at accepted market/region resolution

Prices owner
  owns → broader consumer/producer price category state or aggregation
          consuming valid energy-price inputs

Household Resources
  owns → household expenditure/resource exposure

Production owner
  owns → sector input-cost consequences
```

No `EnergyPrice`, `InflationEnergy`, and `HouseholdEnergyCost` fields may become competing copies of one fact.

They are either:

- one source fact;
- receiver-owned transformed consequences;
- measurements/projections.

## 3.3 Immigration

Conceptually:

```text
Immigration legal/administrative owner
  owns → legal/status/admission/asylum/enforcement case facts

Population
  owns → canonical immigration/emigration person-flow transitions,
          residence, household continuity

Labor
  owns → labor-force/employment consequences

Housing
  owns → demand/occupancy/affordability consequences

State/local finance and services
  own → their receiving fiscal/operational consequences
```

There is no independently mutable `Immigration.NetMigration` if that field duplicates canonical Population flows.

A published net-migration estimate is a measurement/projection.

## 3.4 Healthcare coverage

Conceptually:

```text
Program/legal/admin owners
  own → eligibility rules, enrollments, program decisions

Healthcare coverage owner
  owns → canonical coverage/payer relationship state

Labor
  owns → employment facts creating employer-coverage eligibility inputs

Household Resources
  owns → household cost/resource consequences

Public Finance
  owns → fiscal obligations/payments
```

An employment separation may generate a Healthcare input.

Labor does not own the coverage transition.

## 3.5 Tariffs and trade

Conceptually:

```text
Legal/constitutional/executive/congressional owners
  own → tariff authority, instrument, effective scope, rate/legal terms

Trade owner
  owns → import/export flow and price consequences at accepted resolution

Production owner
  owns → intermediate-input/output consequences

Prices owner
  owns → relevant price-category consequences

Public Finance
  owns → customs receipts
```

`Trade Policy` is a lens across these mechanisms, not a new owner.

## 3.6 Farm policy

Agriculture/food may remain an industry/commodity mechanism inside the production spine while exact farm-program state belongs to federal program/fiscal owners.

One farm bill may therefore span:

- legal authority;
- federal finance;
- program administration;
- agricultural production;
- household/food prices;
- trade;
- environmental state.

The policy label does not own the aggregate outcome.

## 3.7 Public-safety grants

Exact federal grant/obligation/payment state belongs to program/fiscal owners.

Crime/public-safety state receives actual institutional/material inputs.

The grant does not own a crime-rate change.

## 3.8 Disaster and recovery

A `Disaster Recovery` lens may reference:

- hazard occurrence;
- Housing damage;
- infrastructure damage;
- energy outages;
- health burden;
- displacement/population movement;
- federal/state fiscal acts;
- administrative programs;
- insurance/firm activity where supported;
- evidence and political response.

Each fact retains its owner and floor.

There is no duplicate disaster-recovery material state.

---

# 4. Exact institutional/program overlays versus material depth

## 4.1 Core invariant

**[HARD INVARIANT LC-DEPTHR02] Exact legal, fiscal, program, administrative, judicial, contract, project, permit, benefit-case, or actor records may coexist with a structured/contextual material receiver without changing that receiver's minimum depth by fiat. Conversely, a coarse material receiver does not make the exact institutional record approximate.**

## 4.2 Interface honesty

An exact upstream act can create only consequences the receiver can resolve at its accepted support level.

Example:

```text
exact infrastructure grant
→ exact obligation/payment
→ structured bridge/network project state
→ structured capacity/condition consequence
```

The game may not claim exact traffic, output, employment, or electoral effects that the structured receiver does not support.

## 4.3 Exact overlays remain separately owned

A named hospital, factory, bridge, port, university, or grid facility may receive exact identity when its action matters.

Its exact identity does not create duplicate aggregate stock.

The aggregate mechanism accounts for or references the exact overlay through a single-owner relationship.

## 4.4 Material depth can force program narrowing

If a program's claimed effects require material distinctions the receiving mechanism does not support, the content must:

- narrow the claimed effect;
- deepen prospectively under a predeclared package;
- remain modeled/bounded;
- or be out of scope.

Exact paperwork cannot compensate for missing material causality.

---

# 5. Core admission requires accepted consumer families

## 5.1 Core invariant

**[HARD INVARIANT LC-DEPTHR03] A mechanism receives a core-causal floor only when current accepted product/Living-Country contracts require repeated endogenous state, path dependence, or cross-owner transformation. Step 13 may not make a mechanism core solely by imagining optional future content.**

## 5.2 Core consumer ledger

The following candidate core assignments have accepted consumer families:

### Sector production/intermediate use

Accepted consumers include:

- Labor employment/wages;
- Prices;
- Energy;
- Trade/external-supply pathways;
- industry/geographic condition divergence;
- federal industrial-policy and external-shock presidential pathways already contemplated by accepted product authority.

### Labor employment/gross flows/wages

Accepted consumers include:

- Household Resources;
- Healthcare employer-coverage transitions;
- Public Finance receipts/automatic stabilizers;
- Housing affordability;
- population/political material experience.

### Household Resources

Accepted consumers include:

- Housing affordability;
- consumption exposure;
- healthcare cost exposure;
- public benefits/taxes;
- political material experience and measurement.

### Major category prices

Accepted consumers include:

- Household Resources;
- Production costs;
- Housing/energy/health cost-of-living pathways;
- measurements and political interpretation.

### Federal public finance

Accepted consumers include nearly every presidential governing route involving taxes, spending, debt, programs, appropriations, obligations, emergency response, and inherited fiscal constraint.

### Housing

Accepted consumers include:

- household material exposure;
- population/geography;
- federal/state program implementation;
- construction/infrastructure/finance inputs;
- measurement and political response;
- the already accepted Housing causal proof.

### Healthcare coverage/public-program transitions

Accepted consumers include:

- employment transitions;
- household costs;
- federal/state finance;
- state/program implementation;
- presidential healthcare-policy pathways accepted conceptually by Step 5/Step 12.

### Immigration legal/status and population-flow mechanisms

Accepted consumers include:

- executive/federal authority;
- Population;
- Labor;
- Housing;
- state/local services and finance;
- elections/census over longer horizons.

### Energy major balance/availability/prices

Accepted consumers include:

- industry/production;
- household costs;
- infrastructure;
- external-shock/national-security pathways;
- presidential energy and emergency routes.

### Trade major flows/input channels

Accepted consumers include:

- accepted tariff/sanctions/industrial-policy routes;
- Production;
- Prices;
- Labor;
- Public Finance customs receipts;
- external supply-shock pathways.

These assignments remain conceptual minimum floors.

If a later authority removes the accepted consumer families, the floor may be reconsidered through explicit design authority rather than implementation convenience.

## 5.3 Structured mechanisms remain eligible for promotion later

A mechanism not currently core may be raised by later accepted product scope when new repeated causal consumers require it.

Step 13 does not preempt every future domain.

---

# 6. Supported-package activation and deepening

## 6.1 Core invariant

**[HARD INVARIANT LC-DEPTHR04] Generated policies, shocks, actor initiatives, institutional routes, and scenario controls may not create a load-bearing requirement for mechanism detail deeper than the active product/generator package supports unless a prospective deepening path was declared before the triggering outcome.**

## 6.2 Permitted routes when a generated development hits a shallow mechanism

The run must use one predeclared route:

1. **Prospective deepening**
   - active package already contains a valid future-blind transition to a deeper representation;
2. **Modeled/bounded response**
   - current floor supports a bounded answer and explicitly preserves uncertainty;
3. **Narrowed consequence**
   - only effects honestly supported at the current floor are resolved;
4. **Unsupported/out-of-scope classification**
   - candidate world or proposed content is classified outside supported scope under a predeclared rule.

Forbidden:

```text
unexpected national school closure crisis
→ Education suddenly gains exact local staffing/history
→ generator invents the prior two years needed for the crisis
```

or:

```text
new water-system scandal becomes politically important
→ contextual infrastructure state turns into exact pipe/inspection history by hindsight
```

## 6.3 Salience never changes depth by itself

Media coverage, public pressure, congressional attention, or presidential interest does not automatically deepen a mechanism.

Current state plus accepted consumers may justify a prospective deepening transition.

Political importance alone does not.

## 6.4 Generated content closure

Before a policy/shock family is admitted, the generator package must verify that every load-bearing downstream receiver exists at sufficient depth or that the intended effect is explicitly bounded.

This turns candidate `LC-DEPTH03` into an enforceable package-eligibility rule rather than a prose warning.

---

# 7. Measurement/source granularity is not depth authority

## 7.1 Core invariant

**[HARD INVARIANT LC-DEPTHR05] External source granularity and canonical simulation depth are independent design decisions connected through explicit calibration/measurement transformations. Rich source data do not force equally rich simulation; coarse source data do not justify shallow canonical state when accepted causality requires more detail.**

## 7.2 Rich measurement, coarser simulation

Examples:

- FBI NIBRS may contain incident-level data while the game uses structured crime/victimization state;
- FHWA may contain hundreds of thousands of bridge records while the game uses structured regional/asset-class infrastructure state plus exact consequential overlays;
- BEA may provide hundreds of industries/commodities while the game uses compressed production/input categories;
- CMS may provide detailed payer/service expenditure accounts while the game uses mixed coverage/payer/provider mechanisms;
- NCES may expose detailed school statistics while education remains mixed structured/contextual.

The calibration transform and discarded detail remain documented.

## 7.3 Coarse measurement, deeper hidden state

The reverse is also legitimate.

Example:

- player sees a monthly unemployment estimate;
- Labor retains gross transitions and affected scopes because Healthcare, Household Resources, and Public Finance consume them.

The measurement cannot be used to reconstruct exact hidden individual transitions unless the measurement process supports them.

## 7.4 Source availability cannot create owner state directly

A source initializes or calibrates the correct owner under Steps 7, 10, and 11.

It does not become the runtime owner or dictate the mechanism tier.

---

# 8. Controlling policy-lens summary

The summary matrix in `68` is interpreted only as a **view** over one mechanism registry.

The following examples clarify the relationship:

| Policy lens | Referenced controlling mechanisms |
|---|---|
| Economy | production/use; Labor; Household Resources; Prices; monetary/credit; Public Finance; Trade |
| Cost of living | Household Resources; Housing; Energy prices; food/commodity prices; Healthcare costs; taxes/transfers |
| Healthcare | coverage/payer; public programs; provider capacity; medical prices; household cost; Public Finance |
| Education | enrollment/finance/workforce; attainment context; federal student-credit/program mechanisms |
| Immigration | legal/status administration; Population flows; Labor; Housing; state/local services/finance |
| Energy | fuel balance; electricity balance; grid; energy prices; Production; Trade |
| Trade/industry | trade flows; production/use; Prices; Labor; Public Finance; legal instruments |
| Infrastructure | asset/network condition; projects; Public Finance; programs; Production/Trade logistics |
| Crime/public safety | incident/victimization state; law-enforcement institutions; courts; grants; measurement |
| Climate/disasters | background environmental state; hazard families; Housing; Infrastructure; Energy; Health; Population; Finance |
| Foreign/national security | external context/shocks; security institutions; intelligence; diplomacy; Trade; Energy; Infrastructure; Finance |

No row owns all referenced state.

---

# 9. Repaired hostile cases

## 9.1 Student-loan duplicate owner

Rejected.

Federal credit/program/fiscal mechanism owns the loan state; Education references it as a policy lens.

## 9.2 Energy-price duplicate owner

Rejected.

Energy owns source price/availability facts; Prices and Household Resources own receiver transformations/aggregations.

## 9.3 Immigration flow duplicated between Immigration and Population

Rejected.

Legal status/cases and canonical population movement are distinct mechanisms with distinct owners.

## 9.4 Exact grant upgrades whole domain

Rejected.

Exact administrative overlay and material receiver depth remain independent.

## 9.5 Core mechanism admitted because one future policy sounds interesting

Rejected.

Core assignment requires accepted consumer families.

## 9.6 Generated crisis forces unsupported domain deepening

Rejected.

Predeclared package closure and prospective deepening rules apply.

## 9.7 Detailed official dataset forces micro-simulation

Rejected.

Source granularity and runtime depth remain independent.

## 9.8 Coarse public statistic erases deeper hidden state

Rejected.

Measurement and canonical state remain distinct.

---

# 10. Unchanged candidate content

The repair leaves intact the candidate's provisional floors for:

- production/industry/input-use;
- Labor;
- household resources;
- prices;
- monetary/credit conditions;
- federal and state/local finance;
- Housing;
- Healthcare;
- Immigration;
- Energy;
- Trade;
- Infrastructure;
- Education;
- Crime/Public Safety;
- Environment/Climate/Disasters;
- Agriculture/Food;
- Social Insurance;
- Foreign Affairs/National Security.

The mechanism-level assignments in `68` remain controlling except where this repair clarifies owner identity and cross-lens meaning.

The repair does not change Early Access scope or implementation priority.

---

# 11. Re-audit disposition

## **READY FOR UNCHANGED FINAL STEP-13 BINARY RE-AUDIT**

The blocker is closed conceptually:

> **The depth matrix is now explicitly a set of policy and analytical lenses over one semantic mechanism/fact-family registry. Each load-bearing mechanism has one owner and one minimum depth floor regardless of how many policy areas reference it.**

No Step 13 authority is claimed by this repair.