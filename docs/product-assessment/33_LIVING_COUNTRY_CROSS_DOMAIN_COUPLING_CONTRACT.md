# Living Country Step 6 — Cross-Domain Coupling Contract

Status: **LIVING-COUNTRY STEP-6 DESIGN CANDIDATE — PRESERVED FOR DETACHED REVIEW. NOT ACCEPTED PRODUCT, ARCHITECTURE, DOMAIN, COUPLING, CALIBRATION, UI, ROADMAP, EARLY-ACCESS, SCHEMA, RUNTIME, OR IMPLEMENTATION AUTHORITY.**

Authority and evidence boundary:

- Accepted production baseline: `44c1724962830225e6fc34f41d0df0cfdb7dfec0`
- Entirely unaccepted Stage 1 candidate: `a7e04ca78ba1ccb06d8dc3a4dfb0d43389804144`
- Accepted Step 5 presidential-game authority: `2c5fc2d798c5fcc232b519052390b56d60f06267`
- Accepted Living Country Step 1 ownership authority: `12_LIVING_COUNTRY_STEP1_CLARIFICATIONS_AND_AUTHORITY.md`
- Accepted Living Country Step 2 common domain grammar: `16_LIVING_COUNTRY_STEP2_COMMON_GRAMMAR_AUTHORITY.md`
- Accepted Living Country Step 3 population/geography authority: `23_LIVING_COUNTRY_STEP3_POPULATION_GEOGRAPHY_AUTHORITY.md`
- Accepted Living Country Step 4 actor-participation authority: `27_LIVING_COUNTRY_STEP4_AUTONOMOUS_ACTOR_AUTHORITY.md`
- Accepted Living Country Step 5 internal-administration authority: `32_LIVING_COUNTRY_STEP5_INTERNAL_ADMINISTRATION_AUTHORITY.md`
- Assessment branch tip before this candidate: `ccc0dff295b6b85a7a27b0529f57618d577a4b8d`

This is Living Country **Step 6**. It answers:

> **What cross-domain coupling contract allows material, social, fiscal, legal, institutional, population, geographic, and external state to affect one another through typed quantities and occurrences, explicit units and delays, receiver-owned transformations, honest uncertainty, and reconciliation—without direct modifier chains, double counting, feedback explosions, or bespoke pipelines that cannot interact?**

It does not:

- select final country domains or depth tiers;
- define exact economic, health, Housing, energy, crime, immigration, education, industry, trade, fiscal, or external formulas;
- accept one universal event bus, effect type, coupling class, graph solver, integration timestep, database schema, or programming interface;
- define final population synthesis, actor AI, administration implementation, media/public-belief depth, historical calibration, generated prehistory, UI, Early Access scope, roadmap, implementation order, or a next code proof;
- authorize code or any production-baseline change.

---

# Evidence labels

- **[RF — Repository fact]**: established by accepted repository evidence or accepted authority.
- **[ER — External research]**: supported by an official source listed in Section 27.
- **[DI — Design inference]**: proposed Step 6 contract requiring detached review.
- **[UQ — Unresolved question]**: deliberately deferred.

---

# 1. Executive design verdict

## 1.1 Central answer

**[DI]** Cross-domain causality should use:

> **Typed causal handoffs between sovereign semantic owners. A coupling may transmit a fact, quantity, relationship change, constraint, entitlement, occurrence, or bounded signal; it may never bypass the owner that must admit, interpret, and transform that input.**

The canonical pattern is:

```text
source owner changes source-owned state
→ source records a canonical fact or occurrence
→ coupling exposes a typed handoff with identity, units,
  time, geography, entity/population scope, provenance,
  support status, and uncertainty
→ receiving owner determines whether the handoff is admissible
→ receiver maps scope and timing
→ receiver applies its own accepted process
→ receiver-owned state changes or remains unchanged
→ receiver records its own resulting occurrence/output
→ later owners may consume those results through new handoffs
```

A handoff is therefore neither:

- a universal `Effect(type, magnitude)`;
- a direct setter for receiver state;
- a hidden multiplier;
- a narrative trigger;
- a measurement alias;
- a guarantee that downstream change occurs.

## 1.2 Core anti-shortcut rule

The game may support:

```text
Labor: 12,000 represented workers separate from jobs
→ affected-scope and earnings-related labor facts
→ Income admits the affected workers and lost earned-income inputs
→ Income resolves household-resource consequences
→ Healthcare separately consumes coverage-relevant job/household facts
→ Public Finance separately consumes tax-base and program-enrollment consequences
```

It may not support:

```text
Unemployment worsens by 2
→ Income -2
→ Health -2
→ Fiscal -1
→ Approval -3
```

The first path preserves separate owners, populations, units, timing, and uncertainty. The second is a disguised modifier chain.

## 1.3 Product reason

The accepted presidential game requires several realities to collide without becoming one giant national meter.

A single job separation can matter simultaneously to:

- Labor;
- household income;
- employer-sponsored insurance;
- tax receipts;
- unemployment-insurance or other program caseloads;
- Housing affordability;
- migration incentives;
- state finances;
- official measurements;
- organizations and institutions that later observe those effects.

Those are not one outcome. They are several owner-specific consequences of shared causes.

The country becomes coherent only if shared causes may fan out while downstream owners remain independent and the model can distinguish legitimate multi-path consequences from accidental double counting.

---

# 2. Relationship to accepted Living Country authority

## 2.1 Step 1 ownership

**[RF]** Step 1 establishes that each load-bearing fact has one semantic owner and that country layers are conceptual views rather than shadow owners.

Step 6 therefore cannot solve coupling by creating a new `CountryEffects` owner whose state supersedes Labor, Housing, Health, Public Finance, Population, or institutions.

## 2.2 Step 2 common grammar

**[RF]** Step 2 already accepts:

- typed input/output handshakes;
- stock/flow/event distinctions;
- units and denominators;
- heterogeneous time cadence;
- geographic transformation honesty;
- source semantics not prescribing receiver behavior;
- measurements distinct from material truth;
- quiet serious conditions;
- no universal unitless effect payload.

Step 6 turns those participation obligations into a specific inter-owner coupling contract.

## 2.3 Step 3 population/geography

**[RF]** Step 3 requires:

- one canonical ordinary population;
- domain-owned sparse associations;
- exact/modeled/bounded/unsupported joint support;
- occurrence-linked affected scopes;
- honest geographic crosswalks;
- non-omniscient coarsening;
- lifecycle reconciliation.

Step 6 therefore cannot infer exact cross-domain incidence from independent marginals or silently downscale coarse geography.

## 2.4 Step 4 actors

**[RF]** Step 4 requires actors and institutions to consume only legitimately supported information and to resolve their own actions through institution-specific processes.

A cross-domain material handoff is not automatically actor knowledge.

## 2.5 Step 5 administration

**[RF]** Step 5 separates presidential intent, instruments, dispatch, recipient receipt, recipient-owned work, and downstream resolution.

Cross-domain coupling obeys the same principle: transmission does not collapse receipt and consequence.

---

# 3. What is a coupling?

## 3.1 Definition

**[DI]** A coupling is an accepted causal relationship under which one owner’s canonical fact, occurrence, relationship, or state can become an admissible input to another owner.

A coupling is not necessarily a stored object.

It may be implemented later through:

- direct typed calls;
- scheduled processes;
- shared canonical occurrence references;
- queues;
- ledgers;
- event subscriptions;
- dataflow graphs;
- analytical transforms;
- another architecture that preserves the semantics.

Step 6 accepts semantics, not implementation shape.

## 3.2 Coupling declaration obligations

Every load-bearing coupling must be able to declare:

1. source owner;
2. source fact/occurrence identity or identity family;
3. source fact form: stock, gross flow, net flow, event, rate, price, distribution, queue, capacity, network condition, legal state, relationship, or other declared form;
4. source units and denominator where applicable;
5. source effective/as-of/interval time;
6. source geography and entity/population scope;
7. support status and uncertainty;
8. provenance root or source occurrence lineage;
9. receiving owner;
10. admission prerequisites;
11. scope mapping or crosswalk;
12. timing/lag semantics;
13. transformation responsibility;
14. idempotency or repeat-consumption semantics;
15. accounting/reconciliation obligations;
16. resulting receiver occurrence or state family;
17. whether the relationship participates in a feedback cycle;
18. what happens when the input is missing, stale, unsupported, outside scope, rejected, or delayed.

These are audit obligations, not one mandatory runtime record.

---

# 4. Coupling families

Step 6 rejects one universal coupling mechanism. Different causal relationships have different semantics.

## 4.1 Identity-preserving occurrence coupling

A specific occurrence concerning a specific entity or affected population may be consumed elsewhere while preserving its source identity.

Examples:

- job separation occurrence;
- plant closure;
- birth or death;
- Housing project completion;
- natural-disaster damage occurrence;
- court order receipt;
- program enrollment transition.

The receiver references the same source occurrence. It does not mint a duplicate source event.

## 4.2 Quantity/flow coupling

A source produces an amount, rate, quantity, price, balance, or physical flow that another domain may legitimately consume.

Examples:

- wage payment flow;
- taxable-income component;
- energy delivered;
- units of housing completed;
- federal transfer payment;
- import quantity;
- medical-service utilization.

Quantity couplings require dimensional and accounting discipline.

## 4.3 Constraint/capability coupling

A source-owned constraint changes what a receiver can do without directly dictating receiver state.

Examples:

- electric-grid outage constrains hospital operations;
- transportation disruption constrains industrial inputs;
- legal injunction constrains agency action;
- infrastructure damage constrains logistics;
- workforce availability constrains construction throughput.

The receiver owns how that constraint affects its operations.

## 4.4 Eligibility/entitlement coupling

Legal, demographic, employment, household, or income facts may make a person/entity eligible for a program, duty, tax treatment, or regulated status.

The source supplies facts or legal rules.

The administrative/program owner resolves the determination unless the rule itself makes the result ministerial.

Eligibility is not enrollment, payment, service receipt, or material outcome.

## 4.5 Price/cost exposure coupling

One domain’s actual prices, tariffs, fees, input costs, wages, interest costs, or rents may be relevant to another domain’s behavior or cost structure.

The source owns the price/cost fact.

The receiver owns demand, substitution, production, household response, service use, or another downstream effect.

## 4.6 Network/supply coupling

A network owner may expose:

- available capacity;
- outage state;
- path availability;
- throughput;
- delivered quantity;
- congestion;
- loss;
- restoration.

Receiving industries, households, hospitals, agencies, or infrastructure systems own their responses.

## 4.7 Legal/institutional coupling

A law, order, regulation, budget authority, office assignment, or institutional decision may alter another owner’s available action space.

The legal/institutional fact does not directly create the material effect.

Example:

```text
law creates subsidy eligibility and appropriation
→ program establishes administrative capability
→ applications and determinations occur
→ payments occur
→ household/material owners consume payment facts
```

## 4.8 Behavioral coupling

A material or institutional change may alter behavior only through the agent/domain that owns that behavior.

Examples:

- higher electricity prices may induce firm substitution;
- higher rents may induce household migration or reduced consumption;
- benefit changes may alter labor-supply decisions;
- interest costs may alter investment.

The source cannot encode the receiver’s behavioral answer inside the input payload.

## 4.9 Observation coupling

A measurement process may observe state across one or more domains.

Observation produces measurement state and information artifacts.

It does not feed back as material causality unless later actors or institutions receive and act on the information.

## 4.10 Shared-cause relationship

Two changing domains may share an upstream cause without directly causing one another.

Example:

```text
hurricane
→ damages electric infrastructure
→ damages Housing stock
```

Housing damage is not necessarily caused by the electricity outage merely because both worsen at the same time.

The provenance graph should preserve the common cause rather than invent a false direct coupling.

---

# 5. Source sovereignty

## 5.1 Source owns source meaning

**[DI — HARD INVARIANT LC-CP01]** A source owner alone defines the canonical meaning of its emitted fact or occurrence.

A receiver may not reinterpret:

- a stock as a flow;
- a net change as gross transitions;
- an estimate as canonical truth;
- a modeled allocation as exact identity;
- a nominal amount as real purchasing power;
- an occurrence as a persistent condition;
- a legal authorization as completed execution.

## 5.2 Source output remains stable under fan-out

One source occurrence may be consumed by several receivers.

Fan-out does not duplicate or mutate the source occurrence.

Example:

```text
job separation occurrence JS-442
→ Income consumes JS-442
→ Healthcare consumes JS-442
→ UI-program eligibility consumes JS-442
→ measurement processes may later observe consequences
```

Each receiver records its own consumption and downstream results.

None creates `JS-442-copy-for-health` as a second canonical separation.

## 5.3 Source may not prescribe receiver state

Reaffirms Step 2:

**[DI — HARD INVARIANT LC-CP02]** A handoff may state what happened upstream. It may not define the receiver’s resulting state merely by choosing a suggestive type or field name.

Forbidden:

```text
Labor emits:
  healthcareCoverageLoss = 4,000
```

when Labor does not own healthcare coverage.

Preferred:

```text
Labor emits:
  job-separation occurrence
  affected worker scope
  employer/employment relation terminated
  wage/employer-benefit relation metadata the Labor owner legitimately owns

Healthcare:
  identifies which affected people had coverage tied to that employment
  applies continuation, dependent, spouse, public-program,
  Marketplace, uninsured, or other supported transitions
```

---

# 6. Receiver sovereignty

## 6.1 Admission

**[DI — HARD INVARIANT LC-CP03]** The receiving owner determines whether an upstream fact is admissible to the receiver’s process.

A receiver may:

- accept;
- reject as inapplicable;
- wait for prerequisites;
- queue;
- transform;
- partially apply;
- classify as modeled/bounded;
- request additional information where an institution is involved;
- preserve the input without immediate state change.

## 6.2 Transformation

The receiver owns:

- unit conversion it performs;
- scope mapping it performs;
- geography transformation it performs or consumes;
- lag/delay;
- thresholds;
- nonlinear response;
- substitution;
- allocation;
- internal uncertainty;
- resulting state;
- resulting occurrence.

## 6.3 No forced responsiveness

A valid coupling does not imply that a receiver must change materially.

Examples:

- an energy-price increase may be absorbed temporarily by inventories or margins;
- a household income decline may not cause Housing displacement;
- a legal option may exist but remain unused;
- a job loss may not end health coverage if another source continues it;
- federal assistance may be sufficient to offset one local fiscal shock.

Zero downstream change after valid admission can be a legitimate receiver result.

---

# 7. Units, dimensions, valuation, and denominators

## 7.1 Dimensional integrity

**[DI — HARD INVARIANT LC-CP04]** A cross-owner numerical handoff must carry enough semantics to prevent dimensional ambiguity.

As applicable:

- unit;
- quantity kind;
- denominator;
- currency;
- nominal or real basis;
- price/index base;
- valuation convention;
- reference interval;
- geography;
- entity/population scope.

## 7.2 Rates do not move without denominators

A rate or share may not be transmitted as an additive amount without its denominator or a declared conversion.

Example:

```text
unemployment rate = 6%
```

is not equivalent to:

```text
number of job separations = X
```

A receiver needing affected people must consume suitable flow/scope information rather than derive exact individuals from the rate alone.

## 7.3 Nominal and real values

Nominal dollars, real purchasing power, price indices, and physical quantities remain distinct.

A nominal income increase can coexist with a real-income decline if prices change.

No receiver may treat a nominal monetary flow as a real material improvement without an accepted price/quantity transformation.

---

# 8. Time, effective dates, and delay

## 8.1 Distinct timestamps

A coupling may need to distinguish:

- source occurrence time;
- source effective/as-of time;
- interval start/end;
- receiver receipt/admission time;
- receiver processing start;
- transformation completion;
- receiver effect time;
- measurement time;
- publication time.

## 8.2 No universal instant propagation

**[DI — HARD INVARIANT LC-CP05]** Cross-domain effects occur at the cadence and delay of the receiving process, not automatically at the source timestamp.

Examples:

- a job separation can affect wage income quickly while an official labor report arrives later;
- insurance coverage may continue through an interval or transition rule;
- Housing supply changes after construction completion, not appropriation;
- tax receipts reflect timing and collection processes;
- migration reacts over weeks/months rather than synchronously with one price tick;
- budget baselines may update on review cycles rather than every transaction.

## 8.3 Time-chunk invariance

Equivalent source occurrences and same dated rules must yield the same canonical result whether the world advances in one large chunk or many small chunks, except where legitimately modeled actor decisions receive new information between those boundaries.

Coupling evaluation order may not silently become a gameplay mechanic.

---

# 9. Geography and scope transformation

## 9.1 Native frames differ

Source and receiver may use different geographic frames:

- residence;
- workplace;
- state jurisdiction;
- labor market;
- Housing market;
- utility/grid region;
- service catchment;
- media market;
- disaster footprint;
- congressional district.

## 9.2 Crosswalk honesty

A coupling requiring geographic transformation must identify whether the mapping is:

- exact containment;
- exact geometry overlap;
- population-weighted;
- job-weighted;
- Housing-unit-weighted;
- service-use-weighted;
- network-routed;
- modeled;
- bounded;
- unsupported.

Geography does not invent denominator facts.

## 9.3 No precision upgrade

A state-level quantity cannot become exact county- or district-level state merely because the receiver operates locally.

The receiver may:

- retain state-level scope;
- apply a supported modeled allocation;
- use bounds;
- wait for local data;
- deepen resolution prospectively.

---

# 10. Population and entity identity across couplings

## 10.1 Exact affected identity where available

When an occurrence-linked affected scope exists, downstream owners that need the same people should reference that identity rather than redraw independently.

Example:

```text
plant closure PC-8
→ affected worker scope AW-8
→ Income consumes AW-8
→ Healthcare consumes AW-8
```

If Healthcare needs the subset with employer-sponsored coverage, it refines or maps `AW-8` through its own supported coverage relationships.

## 10.2 Marginal support is not joint support

Labor’s worker distribution and Healthcare’s coverage distribution do not establish their joint intersection automatically.

Cross-domain transformation must preserve Step 3 support status:

- exact;
- modeled;
- bounded;
- unsupported.

## 10.3 Entity graph integrity

A firm, plant, hospital, school, program, government, household, or actor may appear in several domains by reference.

The coupling cannot create a duplicate canonical entity merely because another domain consumes its facts.

---

# 11. Support and uncertainty propagation

## 11.1 No epistemic laundering

**[DI — HARD INVARIANT LC-CP06]** A transformation may preserve or degrade support quality; it may not silently upgrade support.

Examples:

- exact source + modeled population crosswalk → modeled receiver input;
- measured estimate + uncertain behavioral model → modeled/forecast receiver state;
- bounded source → receiver output cannot become exact solely through arithmetic;
- unsupported joint incidence → receiver must remain unsupported or introduce an explicit model.

## 11.2 Distinct uncertainty types

A coupling may carry or introduce:

- source-state uncertainty;
- source-model uncertainty;
- population-allocation uncertainty;
- geographic crosswalk uncertainty;
- behavioral-response uncertainty;
- timing uncertainty;
- measurement uncertainty;
- forecast uncertainty.

These need not be reduced to one standard error.

## 11.3 Canonical model state versus actor knowledge

The world may resolve a modeled canonical allocation for simulation continuity while official actors remain unable to observe that exact allocation.

Model provenance and player/actor epistemic access remain separate.

---

# 12. Idempotency and occurrence consumption

## 12.1 One consumer, one semantic consumption

**[DI — HARD INVARIANT LC-CP07]** The same canonical input may not apply the same semantic consequence twice to the same receiving state unless the coupling explicitly represents repeated/continuous consumption.

Example invalid bug:

```text
job separation JS-442 consumed by Income on June 1
save/load
JS-442 consumed again on June 1
→ household income falls twice
```

## 12.2 Repeated signals versus repeated effects

Repeated observation of the same upstream occurrence is not a new material cause.

A story published twice may create new information exposures, but does not create a second plant closure.

A revised statistical release may change knowledge without repeating the underlying job separations.

## 12.3 Consumer provenance

Receiver outputs should be able to identify which source identities were consumed or otherwise provide equivalent provenance sufficient to test duplicate application.

This does not mandate one global consumed-event ledger.

---

# 13. Fan-out, shared causes, and double counting

## 13.1 Fan-out is legitimate

One source can cause several separate downstream effects.

A job separation can simultaneously affect:

- wage income;
- employer benefits;
- program eligibility;
- tax bases;
- household financial stress.

Those are distinct consequences, not double counting merely because they share a source.

## 13.2 Shared-cause lineage must remain visible

**[DI — HARD INVARIANT LC-CP08]** When multiple downstream paths descend from the same source and later reconverge, the receiving owner must be able to distinguish distinct economic/material effects from duplicated representations of the same effect.

Example:

```text
job separation
→ Labor wage-loss fact
→ Income lower earned income
→ Public Finance lower taxable income
```

and separately:

```text
job separation
→ UI enrollment
→ Public Finance higher benefit outlay
```

Those are distinct fiscal channels.

But if Public Finance separately consumes both:

- Labor’s wage-loss estimate;
- Income’s already-resolved lower taxable earnings;

as two independent reductions to the same tax base, the model double counts.

## 13.3 Coupling basis

A receiver with reconverging inputs must identify the accounting or causal basis for each input:

- same underlying quantity represented differently;
- distinct component of a broader total;
- gross versus net representation;
- intermediate versus final quantity;
- direct versus indirect effect;
- transfer between accounts;
- separate physical/material consequences.

## 13.4 Aggregation rule

Totals must specify whether components are:

- additive;
- mutually exclusive;
- overlapping;
- netted;
- chained;
- transformed;
- non-additive indices.

No dashboard or policy analysis may sum arbitrary downstream consequences merely because they use the same unit.

---

# 14. Accounting and conservation couplings

## 14.1 Accounting relationships are special

Some couplings carry identities stronger than ordinary behavioral relationships.

Examples:

- payment from one owner and receipt by another;
- obligation and corresponding payable/claim where represented;
- population movement from one residence geography to another;
- physical inventory transfer;
- energy delivered and consumed where losses are represented;
- budget authority consumed by obligation/expenditure.

## 14.2 Mirror records do not mean duplicate value

A transfer may legitimately have records on both sides.

The receiving amount and sending amount are not two independent economic events.

They share one transfer identity or another reconciled relation.

## 14.3 Reconciliation

Where conservation/accounting applies, the design must state:

- accounting universe;
- opening stock where relevant;
- inflows;
- outflows;
- reclassification/revaluation/residuals;
- closing stock;
- tolerance/uncertainty.

The 2025 System of National Accounts principle that changes between stocks should be explainable through flows and other changes is a useful discipline for domains where economic accounting applies; it is not a command to force all social or political state into national accounts.

---

# 15. Feedback loops and cyclic coupling

## 15.1 Cycles are real

Living Country will contain genuine feedback structures such as:

```text
Housing costs ↔ migration ↔ Housing demand
wages ↔ labor supply ↔ firm hiring
energy costs ↔ industrial output ↔ energy demand
income ↔ consumption ↔ firm production/employment
fiscal policy ↔ household income/activity ↔ receipts/outlays
```

The design may not ban cycles merely to keep the architecture a DAG.

## 15.2 No same-timestamp ping-pong

**[DI — HARD INVARIANT LC-CP09]** A cyclic relationship requires declared temporal or solver semantics. Owners may not recursively trigger one another until numerical or logical exhaustion inside an unspecified same-timestamp loop.

A cycle may be handled later through:

- explicit lag;
- periodic joint reconciliation;
- bounded iterative solver;
- equilibrium/clearing process owned by a declared market/process;
- scheduled reconsideration;
- another deterministic method.

The contract requires the method to preserve owner semantics and time-chunk invariance.

## 15.3 Market clearing does not create a god owner

A market-clearing or reconciliation process may jointly resolve prices/quantities when later accepted.

It must identify which facts the process owns and which participant/domain facts feed it.

It may not become a generic `Economy` owner that rewrites every firm, household, wage, price, and job directly.

## 15.4 Oscillation and instability are allowed when real

A system may genuinely oscillate or become unstable.

The prohibition concerns artifacts of evaluation order, repeated consumption, or unbounded recursive triggering—not genuine dynamic instability produced by the accepted model.

---

# 16. Legal, fiscal, and administrative coupling

## 16.1 Legal state changes action space

Law may create, remove, condition, or dispute authority, duties, eligibility, procedures, and constraints.

It does not directly create material outcomes.

## 16.2 Fiscal chain preserves stages

The accepted architecture already demonstrates:

```text
legal authority
→ public-finance recognition
→ administrative award/determination
→ obligation
→ payment/disbursement
→ recipient state
→ material-domain input
```

Step 6 retains that separation as a model coupling pattern.

## 16.3 Presidential acts do not collapse coupling

A presidential direction or budget proposal may create inputs to agencies, OMB, Congress, or other institutions.

Those are actor/institution couplings before any later material coupling occurs.

Step 6 does not permit `PresidentDecision → DomainOutcome`.

---

# 17. External-world coupling

## 17.1 External developments enter through bounded interfaces

A future external/national-security layer may emit facts such as:

- import availability;
- foreign commodity price;
- shipping interruption;
- sanctions status;
- conflict risk or occurrence;
- cyber incident;
- allied request;
- intelligence assessment as information rather than material truth.

## 17.2 External shock is not domestic consequence

Example:

```text
foreign shipping disruption
→ Trade/Transport receives reduced route capacity
→ Energy/Industry receive specific constrained inputs
→ firms/markets resolve substitution and production
→ Prices may later change
→ households and public finance experience separate effects
```

The shock family cannot declare `inflation +3` and `approval -5` as built-in outputs.

## 17.3 Non-occurrence remains coherent

If a configured external shock does not occur, domestic systems continue through their existing state.

The game does not owe a replacement shock to maintain a drama quota.

---

# 18. Observation and information remain downstream

## 18.1 Material coupling does not equal public knowledge

A receiver-owned state can change without official measurement, media coverage, public exposure, or presidential awareness.

## 18.2 Measurement consumes condition state

A measurement process may consume:

- canonical domain facts;
- samples;
- administrative records;
- modeled estimates;
- other declared inputs.

It creates measurement state or information artifacts with their own support and lag.

## 18.3 Revisions do not rewrite history

A revised report may alter actor knowledge and public belief.

It does not retroactively change the canonical material occurrence that the original report attempted to measure.

---

# 19. Coupling topology, versioning, and retirement

## 19.1 Couplings may change historically

Law, institutions, technology, market structure, program rules, and domain depth can alter how two systems interact.

A coupling therefore has effective semantics over time.

## 19.2 Version changes do not rewrite prior outcomes

Changing a coupling model in generated history or product evolution may alter future resolution.

It does not reinterpret prior canonical occurrences unless a specific historical correction/migration is declared.

## 19.3 Retirement

A coupling can be retired when:

- the legal/program relationship ends;
- the underlying institution disappears;
- a market/process is replaced;
- later accepted design compresses the relationship;
- the product no longer supports that causal path.

Outstanding obligations and historical references must remain resolvable.

---

# 20. Stress proof A — job separation fan-out

## 20.1 Starting state

Assume a represented manufacturing plant closes and Labor owns a canonical plant-closure/job-separation occurrence affecting a declared worker scope.

The source occurrence includes:

- plant/employer identity;
- affected worker scope;
- employment relationships ended;
- prior wage/earnings-related Labor facts where owned;
- workplace geography;
- effective date;
- provenance.

## 20.2 Income path

```text
Labor job separation
→ Income admits affected people/households
→ maps lost earned-income flows through valid worker-household links
→ resolves household earned-income/resource changes
→ records Income-owned consequences
```

Income may not assume every separated worker had identical household income.

## 20.3 Healthcare path

```text
Labor job separation
→ Healthcare checks affected people against supported
  employment-linked coverage relations
→ resolves continuation/spouse/public/Marketplace/uninsured
  transitions under later accepted rules
→ records Healthcare-owned coverage state
```

The same number of separated workers does not imply the same number losing coverage.

## 20.4 Public-finance paths

Possible distinct channels include:

- lower taxable earnings from Income-owned tax-base facts;
- unemployment-program enrollment/outlays through program administration;
- healthcare-program enrollment/outlays through Healthcare/program state.

Public Finance must not count Labor wage loss and Income’s already-resolved taxable-income reduction as separate tax-base losses if they represent the same underlying earnings flow.

## 20.5 Housing path

Reduced household resources may increase affordability stress through Housing/household processes over time.

It does not instantly evict affected households or lower home prices.

## 20.6 Perturbations

The coupling remains coherent when:

- many workers immediately find new jobs;
- coverage continues for dependents;
- state benefits are generous or weak;
- affected households own homes with low debt;
- measurement is delayed;
- the closure receives little national coverage.

No global employment-shock score is required.

---

# 21. Stress proof B — energy/supply disruption

## 21.1 Starting event

An external or network owner records a shipping/energy-supply constraint with:

- affected commodity/network;
- quantity/capacity;
- geography;
- start time;
- expected or unknown duration;
- support/uncertainty.

## 21.2 Industry response

Industry/firm owners consume input availability and prices.

They independently resolve:

- inventory drawdown;
- substitution;
- reduced production;
- sourcing changes;
- price changes if the relevant market owner supports them;
- delay or no action.

## 21.3 Household and price paths

Households may experience changed consumer prices only after the appropriate price/market processes resolve.

The external event cannot directly set household inflation experience.

## 21.4 Public-finance/state paths

State or federal fiscal effects arise through actual tax, subsidy, emergency, or program channels rather than a generic macro penalty.

## 21.5 Perturbations

- inventories absorb the shock;
- alternate imports arrive;
- only one region is exposed;
- industrial output falls but retail prices barely move;
- prices rise but official measurement lags;
- the disruption ends earlier than forecast.

Each is supported by receiver-owned transformations.

---

# 22. Stress proof C — Housing and migration feedback

## 22.1 Housing pressure

Housing owns rents/prices/availability/stock at its accepted abstraction.

Population/household owners may consume Housing cost and availability exposure where a supported migration decision process later exists.

## 22.2 Migration

A household migration occurrence changes Population residence.

It may then affect:

- Housing demand in origin/destination markets;
- labor availability/commuting relations;
- state/local program caseloads;
- electoral geography membership;
- service demand.

## 22.3 Feedback

New demand can later alter Housing market conditions, which may influence later migration.

This cycle requires explicit lag/reconsideration semantics.

It may not recursively run Housing→Migration→Housing until an arbitrary fixed point in one same-day call.

---

# 23. Stress proof D — federal payment without duplication

## 23.1 Chain

```text
law establishes authority
→ Public Finance recognizes budget authority
→ program/agency creates valid award/obligation
→ fiscal execution records payment/disbursement
→ recipient records receipt
→ recipient spending/operations occur
→ material domains receive only actual relevant inputs
```

## 23.2 Double-count defense

The payment may appear as:

- federal outflow;
- recipient inflow;
- program payment record.

Those are linked views/records of one transfer, not three dollars of economic activity.

If the recipient later spends the money, that is a new transaction with its own identity.

## 23.3 Failure cases

- legal authority exists but no award occurs;
- award exists but obligation is delayed;
- obligation exists but payment is blocked;
- payment occurs but recipient cannot deploy it;
- recipient deploys it but material effect is weak.

Every break remains coherent.

---

# 24. Stress proof E — quiet coupling without presidential issue

A serious regional condition can propagate materially without becoming political drama:

```text
regional employer closures
→ Labor separations
→ household-income decline
→ some program caseload increase
→ local fiscal stress
→ limited/local measurement
→ no strong organization or national story
→ no valid White House receipt
→ no presidential interruption
```

The country continues evolving.

A later governor request, official release, investigation, congressional action, or proactive administration review may make it nationally visible.

Step 6 therefore does not contain a cross-domain severity detector that automatically escalates coupled effects into a presidential issue.

---

# 25. Hostile falsification tests

The candidate should fail detached review if any of the following remains possible under its semantics.

## H-01 — Receiver bypass

```text
Labor emits job loss
→ Healthcare coverage directly decremented by Labor
```

Must fail.

## H-02 — Unitless effect bus

```text
Energy emits Effect(INFLATION, +4)
```

Must fail as causal authority.

## H-03 — Duplicate occurrence fan-out

One plant closure becomes separately minted closure events in Labor, Income, and Public Finance and is later counted three times.

Must fail.

## H-04 — Reconvergence double count

Public Finance consumes both raw wage-loss and already-transformed taxable-income loss as independent tax-base reductions.

Must fail unless semantics prove they are distinct components.

## H-05 — Precision laundering

State-level or modeled exposure becomes exact county/district/household incidence downstream.

Must fail.

## H-06 — Support upgrade

Bounded or modeled upstream state becomes exact receiver state solely through arithmetic.

Must fail.

## H-07 — Same-time feedback explosion

Housing and migration recursively trigger one another until stable without declared cycle semantics.

Must fail.

## H-08 — Time-chunk dependence

Advancing 30 days at once produces a different canonical coupling result from advancing one day thirty times with no intervening new decisions/information.

Must fail.

## H-09 — Save/load repeated consumption

A payment, job separation, or project completion is applied twice after reload.

Must fail.

## H-10 — Measurement becomes cause

A revised unemployment report rewrites prior actual job separations.

Must fail.

## H-11 — Shared cause mistaken for direct cause

Hurricane causes Housing damage and grid damage; model records grid outage as the cause of all Housing damage without a valid route.

Must fail.

## H-12 — Legal authority becomes material result

A law authorizing a grant immediately creates recipient spending and Housing units.

Must fail.

## H-13 — External shock built-in outcomes

A shipping shock directly carries `priceIncrease`, `jobLoss`, and `approvalLoss` values into domestic owners.

Must fail unless those are separately owned source facts legitimately measured upstream; a generic shock cannot prescribe domestic response.

## H-14 — Drama escalation

A highly coupled regional condition automatically becomes a national issue or presidential interruption despite no valid observation/information route.

Must fail.

## H-15 — Source mutation by receiver

One receiver adapts a source occurrence and silently changes the meaning later consumed by another receiver.

Must fail.

---

# 26. Step 6 audit gate

A detached Step 6 audit should answer:

> **Can distinct Living Country owners exchange facts, quantities, occurrences, constraints, eligibility state, prices, network conditions, legal/institutional state, and external developments through typed, time-aware, geography/population-aware handoffs while each receiving owner independently resolves its own state—without unitless modifiers, owner bypass, duplicated occurrences, unsupported precision, double counting, same-timestamp feedback explosions, measurement aliases, or time/save-order dependence?**

PASS requires all of the following:

1. source and receiver owners remain distinct;
2. source semantics cannot prescribe receiver outcomes;
3. receiver admission/transformation is explicit;
4. stock/flow/event/rate/price forms remain coherent;
5. units, denominators, valuation, time, geography, and scope are carried where needed;
6. support/uncertainty cannot silently upgrade;
7. one source may fan out without duplicating source identity;
8. repeated consumption is idempotent where required;
9. reconverging paths can detect shared causes and avoid duplicate accounting;
10. actual transfers/accounting relationships reconcile;
11. cycles have declared lag/solver/clearing semantics;
12. time-chunk and save/load order do not alter equivalent canonical results;
13. legal, administrative, and presidential acts do not jump directly to material outcomes;
14. measurements and reports remain observations, not aliases for material truth;
15. serious coupled conditions may remain quiet until a valid information route exposes them.

A PASS would establish only the common cross-domain coupling contract.

It would not prove final domain formulas, final macroeconomics, balance, performance, calibration, historical generation, UI, or gameplay quality.

---

# 27. External research grounding

External sources are used only to test concepts, not to dictate implementation.

## 27.1 United Nations — System of National Accounts 2025

Source:

- United Nations Statistics Division, System of National Accounts 2025 chapters and Chapter 4, “Flows, stocks and accounting rules”
- https://unstats.un.org/unsd/nationalaccount/SNAUpdate/2025/chapters.asp

Relevant lesson:

- stocks and flows are distinct;
- changes between stock positions require coherent flows/other changes;
- accounting frameworks need consistency in value, timing, and classification.

Design use:

- supports stock/flow distinctions, transfer reconciliation, valuation/time discipline, and explicit residuals where accounting applies.

It does not imply every Living Country political/social process must be represented as national accounts.

## 27.2 BEA — Input-Output Accounts

Sources:

- https://www.bea.gov/data/industries/input-output-accounts-data
- https://www.bea.gov/resources/guide-interactive-industry-input-output-accounts-tables
- https://www.bea.gov/sites/default/files/methodologies/IOmanual_092906.pdf

Relevant lesson:

- industries produce and use distinct commodity flows;
- make/use accounts preserve who supplies and who consumes;
- direct and indirect relationships can be analyzed without collapsing every industry into one aggregate causal meter;
- intermediate production can create double-counting when aggregates are summed without the correct accounting basis.

Design use:

- supports typed supply/use relationships, separate sender/receiver semantics, and explicit defense against double-counting direct/intermediate paths.

## 27.3 BEA — National Income and Product Accounts

Sources:

- https://www.bea.gov/data/gdp/gross-domestic-product
- BEA NIPA Handbook, Chapter 2

Relevant lesson:

- gross output can count intermediate production multiple times while GDP is constructed to avoid that duplication;
- nominal/real, final/intermediate, and accounting-basis distinctions materially change interpretation.

Design use:

- supports the reconvergence/double-counting contract and prevents summing every downstream effect into a false national total.

## 27.4 BLS — Labor Force Status Flows

Source:

- https://www.bls.gov/cps/cps_flows.htm

Relevant lesson:

- small net changes in employment/unemployment can hide large gross flows among employment, unemployment, and nonparticipation;
- gross flows and stock levels require reconciliation;
- individual transitions contain causal information that net aggregates lose.

Design use:

- supports retaining load-bearing gross labor transitions for downstream coupling rather than coupling every system to a single unemployment rate.

## 27.5 CMS — Coverage transitions and loss of job-based coverage

Sources:

- https://www.cms.gov/marketplace/in-person-assisters/technical-resources/special-enrollment-periods
- https://www.cms.gov/files/document/special-enrollment-periods-available-consumerspdf.pdf

Relevant lesson:

- loss of job-based coverage can create eligibility/opportunity for coverage transitions;
- job loss does not uniquely determine the final coverage state.

Design use:

- supports the job-separation→Healthcare proof in which Labor provides the employment event while Healthcare/program processes determine actual coverage transitions.

---

# 28. Repository application

## 28.1 Preserve

The accepted baseline already demonstrates several coupling principles worth preserving:

- law separate from finance;
- finance separate from administration;
- administration separate from Housing material state;
- Housing separate from measurement;
- information separate from population belief;
- election separate from information artifacts;
- agency receipt separate from compliance;
- presidential attempt separate from agency action;
- stable occurrence identities and deterministic dated progression.

## 28.2 Generalize

Step 6 proposes generalizing those seams to:

- Labor ↔ Income/Households;
- Labor/Income ↔ Healthcare;
- Income/activity ↔ Public Finance;
- Prices/Energy/Industry/Trade;
- Population migration ↔ Housing/Labor/services;
- infrastructure/network conditions ↔ firms/services/households;
- external developments ↔ domestic domains;
- domain state ↔ measurements/information.

## 28.3 Reconsider before generalization

Do not generalize:

- one sequential Housing pipeline as the universal country pipeline;
- content-specific `supportUnits` as universal administrative capacity;
- one generic material-pressure number;
- direct state mutation across owners;
- one global effect queue with unitless magnitudes;
- one universal coupling timestep.

---

# 29. Explicitly unresolved

Step 6 does not decide:

1. exact country-domain inventory;
2. exact semantic owner split among Economy/Labor/Income/Prices/Industry/Trade;
3. exact household finance model;
4. exact tax, transfer, healthcare, Housing, energy, industry, infrastructure, immigration, crime, education, environment, or foreign-affairs equations;
5. exact market-clearing mechanism;
6. exact feedback solver;
7. exact coupling storage or event-processing architecture;
8. exact uncertainty representation;
9. exact transaction or ledger representation;
10. exact observation/measurement models;
11. exact calibration;
12. generated-prehistory implementation;
13. domain-depth tiers;
14. UI;
15. Early Access scope;
16. roadmap or implementation order;
17. next code proof.

---

# 30. Candidate disposition

## **READY FOR DETACHED STEP-6 AUDIT**

The proposed Step 6 answer is:

> **Cross-domain causality should consist of typed, identity-preserving, unit/time/geography/support-aware handoffs between semantic owners. Sources state what happened upstream; receivers independently admit and transform those inputs. Shared-cause lineage, idempotent consumption, accounting reconciliation, and explicit feedback semantics prevent fan-out from becoming double counting or unstable recursion.**

No Step 6 authority exists until a detached audit is preserved, any blocking findings are repaired, the unchanged gate passes, and a separate authority action accepts the resulting composite.