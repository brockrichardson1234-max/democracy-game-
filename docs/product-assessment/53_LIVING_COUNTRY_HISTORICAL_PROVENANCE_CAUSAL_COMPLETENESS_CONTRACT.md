# Living Country Step 10 — Historical Provenance and Causal Completeness Contract

Status: **LIVING-COUNTRY STEP-10 DESIGN CANDIDATE — PRESERVED FOR DETACHED REVIEW. NOT ACCEPTED PRODUCT, ARCHITECTURE, HISTORICAL-CALIBRATION, PREHISTORY-GENERATOR, UI, ROADMAP, EARLY-ACCESS, SCHEMA, RUNTIME, DATASET, OR IMPLEMENTATION AUTHORITY.**

Authority and evidence boundary:

- Accepted production baseline: `44c1724962830225e6fc34f41d0df0cfdb7dfec0`
- Entirely unaccepted Stage 1 candidate: `a7e04ca78ba1ccb06d8dc3a4dfb0d43389804144`
- Accepted Step 5 presidential-game authority: `2c5fc2d798c5fcc232b519052390b56d60f06267`
- Accepted Living Country Step 1 ownership authority: `12_LIVING_COUNTRY_STEP1_CLARIFICATIONS_AND_AUTHORITY.md`
- Accepted Living Country Step 2 material/social-domain grammar: `16_LIVING_COUNTRY_STEP2_COMMON_GRAMMAR_AUTHORITY.md`
- Accepted Living Country Step 3 population/geography authority: `23_LIVING_COUNTRY_STEP3_POPULATION_GEOGRAPHY_AUTHORITY.md`
- Accepted Living Country Step 4 actor-participation authority: `27_LIVING_COUNTRY_STEP4_AUTONOMOUS_ACTOR_AUTHORITY.md`
- Accepted Living Country Step 5 internal-administration authority: `32_LIVING_COUNTRY_STEP5_INTERNAL_ADMINISTRATION_AUTHORITY.md`
- Accepted Living Country Step 6 cross-domain coupling authority: `37_LIVING_COUNTRY_STEP6_CROSS_DOMAIN_COUPLING_AUTHORITY.md`
- Accepted Living Country Step 7 observation/measurement authority: `42_LIVING_COUNTRY_STEP7_OBSERVATION_MEASUREMENT_AUTHORITY.md`
- Accepted Living Country Step 8 media/information/public-belief authority: `47_LIVING_COUNTRY_STEP8_MEDIA_INFORMATION_PUBLIC_BELIEF_AUTHORITY.md`
- Accepted Living Country Step 9 political-pressure/emergent-issue authority: `52_LIVING_COUNTRY_STEP9_POLITICAL_PRESSURE_EMERGENT_ISSUE_AUTHORITY.md`
- Assessment branch tip before this candidate: `dc43552170c262f32b6d9d08316c2b424b2d8a0f`

This is Living Country **Step 10**. It answers:

> **What historical-provenance and causal-completeness contract allows the Living Country to inherit real pre-divergence institutions, laws, programs, population, geography, fiscal state, and material conditions; attach generated actors and backstory without false attribution; generate later political and material history at lower resolution; preserve what actors knew and did; and reconcile current state without simulating every prior day or inventing missing causes?**

This candidate does **not**:

- choose a historical calibration date;
- choose January 2025 or January 2033;
- prove that a generated prehistory system works;
- choose final source datasets, source cutoffs, transformation pipelines, actor rosters, historical depth, compression algorithms, or player-facing history UI;
- authorize implementation, schemas, runtime architecture, content generation, Early Access scope, roadmap work, or a next code increment.

---

# Evidence labels

- **[RF — Repository fact]**: established by accepted repository evidence, accepted assessment authority, or the frozen production baseline.
- **[ER — External research]**: supported by a primary, official, standards-body, or peer-reviewed source listed in Section 29.
- **[DI — Design inference]**: proposed Step 10 contract requiring detached review.
- **[UQ — Unresolved question]**: deliberately deferred.

A design inference does not become repository fact merely because it is recorded in this candidate.

---

# 1. Executive design verdict

## 1.1 Central answer

**[DI]** The Living Country should use:

> **Causal completeness rather than chronological completeness: every load-bearing current fact, inherited obligation, historical claim, actor memory, and player-facing opening statement must either trace through owner-resolved occurrences and transformations to a declared provenance root, or remain explicitly modeled, bounded, unsupported, disputed, or unknown. A configured baseline may terminate causal recursion honestly; it may not fabricate a complete past, shadow-own the live world, or excuse missing post-divergence causes.**

The broad relationship is:

```text
source material, configured primitive, or generated occurrence
→ versioned acquisition / generation / transformation activity
→ declared provenance root or canonical occurrence
→ current fact owned by the proper semantic owner
→ later owner-resolved transitions and cross-domain consequences
→ observations, records, beliefs, agendas, and decisions
→ current reconciled Living Country state
→ access-bounded historical and opening projections
```

The game does not need to simulate every event since 1789.

It does need to explain why the current world is valid at the level required by supported gameplay.

## 1.2 The history contract is not an event-sourcing requirement

**[RF]** The production baseline already stores the live `WorldState` directly in saves and separately appends committed historical occurrences.

**[DI]** Step 10 preserves that semantic separation.

The design does not require:

```text
empty world
→ replay every historical event
→ reconstruct current world every time
```

A future implementation may use event sourcing, snapshots, ledgers, state plus occurrence history, or another architecture.

Whatever implementation is selected must preserve:

- one owner for current facts;
- one canonical identity for each retained occurrence family;
- immutable historical occurrence semantics;
- provenance from initialized and generated state;
- deterministic continuation;
- no history store that shadow-owns current state.

## 1.3 Product role

The contract exists so a generated presidency can inherit a country that feels older than the player without requiring authored narrative or impossible simulation scope.

It should support opening statements such as:

- a program enacted before divergence still creates current obligations;
- an earlier generated administration passed a healthcare law whose implementation is uneven;
- a senator has a generated career and relationships but is not falsely credited with a real pre-divergence roll-call vote;
- a current court dispute descends from a generated claim and prior ruling;
- a fiscal position reflects inherited baseline state plus later generated laws, receipts, outlays, and debt changes;
- a party reputation reflects retained generated actions and public interpretation rather than an unexplained trait;
- a condition existed for years without national attention because evidence and political organization remained weak;
- a statistical series was revised after an earlier administration acted on the preliminary vintage.

## 1.4 Deletion rule

Retain historical detail only when deleting it would make at least one supported current fact, institutional right, legal/fiscal obligation, actor relationship, memory, evidence-at-time claim, political interpretation, accountability question, election, or presidential decision impossible or materially incoherent.

Do not retain a detailed past merely because history is interesting.

Do not delete a detail merely because the current aggregate can be reproduced if the detail still changes who knows, owes, controls, trusts, blames, may act, or can be held accountable.

---

# 2. Repository reality and inherited contracts

## 2.1 HistoricalRecord already has the correct narrow ownership

**[RF]** The frozen production baseline defines `HistoricalRecord` as immutable committed occurrences. It owns only the fact that an occurrence happened at a time and explicitly does not become a shortcut store for current proposal, legal, material, fiscal, electoral, or institutional state.

**[RF]** The existing occurrence families already include:

- proposal introduction and amendment;
- votes and procedure resolution;
- enactment;
- fiscal recognition, obligation, and disbursement;
- program and state decisions;
- projects and material milestones;
- measurement, release, and information occurrences;
- population and election occurrences;
- executive acts;
- legal claims, judicial decisions, orders, delivery, compliance, and review.

This is a strong reusable foundation.

It is not yet a complete historical-calibration or generated-prehistory model.

## 2.2 Save state already pins configuration identity

**[RF]** The production save contains:

- a configuration identity and hash;
- the complete current `WorldState`;
- the session `ControlBinding`.

The loader validates configuration compatibility.

**[DI]** Step 10 extends the same principle conceptually: a saved run is tied to a historically closed configuration/generation package. Later real-world updates or a new calibration package cannot silently mutate the run's inherited past.

## 2.3 Accepted ownership and temporal authority

**[RF]** Prior accepted authority already establishes:

- one semantic owner for every mutable current fact;
- one canonical occurrence identity for each retained historical occurrence;
- current state and occurrence history as distinct;
- evidence vintages and what-was-known-at-the-time as distinct from later revised knowledge;
- one population with lineage and honest support levels;
- actor identity, office, assignment, institution, organization, records, and memory as distinct;
- cross-domain state changes through receiver-owned transformations;
- issue and workstream history as projections over underlying facts;
- deterministic dated transitions and no retroactive event insertion by presentation.

## 2.4 Existing configuration mapping classes are useful but incomplete

**[RF]** The U.S. configuration contract already distinguishes:

- `DIRECT`;
- `AGGREGATED`;
- `APPROXIMATED`;
- `DEFERRED`;
- `STATIC CONFIGURATION`;
- `INITIALIZED FROM REAL DATA THEN DYNAMIC`;
- `DERIVED`;
- `SIMULATION-GENERATED`.

It also separates:

- manifest and authority hashes;
- structural configuration;
- Day-0 seed;
- gameplay configuration;
- dynamic canonical world;
- derived projections.

**[DI]** Step 10 treats these as strong evidence for a historical contract but does not freeze these exact labels as the final universal implementation vocabulary.

---

# 3. Historical fact families that may not collapse

## 3.1 Source material

A source material is an external or configured input such as:

- statute, code edition, regulation, court opinion, or official record;
- census, survey, administrative data, financial statement, map, or statistical release;
- archival record;
- configured authored primitive;
- generation rule or seed;
- prior scenario artifact.

A source does not by itself own the in-world fact initialized from it.

## 3.2 Acquisition and transformation record

An acquisition/transformation record identifies how a source became a usable scenario input, including where relevant:

- source identity and producer;
- retrieval/extraction time;
- source publication, effective, reference, and vintage times;
- checksum/version;
- selected fields and exclusions;
- normalization, aggregation, mapping, imputation, synthesis, or modeling;
- transformation code/method/version;
- uncertainty and known limitations;
- resulting scenario artifact.

## 3.3 Baseline assertion or seed fact

A baseline assertion is a configured initialization claim about world state at a declared seam.

It identifies:

- semantic owner of the resulting live fact;
- as-of/effective interval;
- provenance root class;
- support and mapping class;
- source/transformation references;
- whether the fact is static, initialized-then-dynamic, derived, or deferred;
- reconciliation constraints.

The baseline assertion does not remain the live owner after initialization.

## 3.4 Canonical historical occurrence

A historical occurrence records that an owner-resolved act, decision, transition, or event happened.

It has one canonical occurrence identity under Step 1.

The occurrence does not own later current state.

## 3.5 Current fact

The current fact remains with the appropriate current-state owner.

Examples:

- current office assignment;
- current legal source and operative scope;
- current debt and budget balances;
- current program and queue state;
- current population and geography;
- current material conditions;
- current actor belief, relationship, or agenda;
- current evidence/release status.

## 3.6 Historical source/evidence artifact

A released report, memo, poll, statement, filing, briefing, record, or archived communication owns what it said and when it existed.

It does not own the underlying event or current truth.

## 3.7 Actor memory and institutional record

An actor's retained memory is actor-owned state.

An office or institution's official record is institution-owned state.

A historical occurrence may be referenced by either.

The occurrence does not automatically become remembered or institutionally known by every relevant actor.

## 3.8 Historical projection or narrative

A timeline, biography, inauguration briefing, State-of-the-Nation history, administration record, issue history, or causal explanation is a projection over accessible facts and artifacts.

It owns only its own version, producer, sources, method, as-of time, and presentation.

It may not fill missing history with confident prose.

---

# 4. Four provenance-root classes

## 4.1 Core invariant

**[DI — HARD INVARIANT LC-HIST01] Every load-bearing current fact or historical claim must either trace to at least one declared provenance root through supported activities/occurrences, or be explicitly classified as modeled, bounded, disputed, unsupported, or unknown.**

The four accepted candidate root classes are:

1. **Baseline-inherited**
2. **Generated backstory**
3. **Forward-generated prehistory**
4. **Player-era**

These classes describe where causal recursion legitimately terminates inside one run.

They do not determine player access or truth by themselves.

## 4.2 Baseline-inherited root

A baseline-inherited root is a historically closed configured fact that predates the run's divergence boundary or is otherwise explicitly declared part of the starting inheritance.

Examples may include:

- constitutional order;
- state and federal institutional topology;
- statutes and programs already in force;
- opening population and geography vintages;
- opening fiscal balances and obligations;
- opening material/social conditions;
- existing offices, terms, and institutional records;
- ongoing cases, contracts, programs, and measurements;
- historically established international obligations.

A baseline root may terminate in:

- directly supported inherited fact;
- accepted aggregation or transformation;
- explicit modeled/approximated initialization;
- configured primitive whose synthetic status is declared.

It does not require the game to simulate every event that historically produced it.

## 4.3 Generated-backstory root

A generated-backstory root is synthetic pre-seam or seam-time state created to reconcile fictional/generated actors, relationships, organizations, reputations, careers, and contextual history with the inherited world.

Examples may include:

- a fictional senator's earlier generated offices;
- generated party/faction identity;
- generated relationships and rivalries;
- generated organization leadership;
- generated public reputation;
- generated personal history needed to explain present actor state.

Generated backstory is true **inside the generated world** when accepted by the scenario-generation process.

It is not represented as real-world history.

## 4.4 Forward-generated-prehistory root

A forward-generated-prehistory fact or occurrence is produced after the divergence boundary and before active player control through lower-resolution but owner-respecting simulation/generation.

Examples may include:

- generated elections and administrations;
- legislation, appointments, and court activity;
- program implementation and fiscal trajectories;
- condition changes;
- party/faction evolution;
- state conflicts;
- media and political memories;
- the player's qualifying campaign and victory history.

The causal chain may terminate at a configured post-divergence shock or primitive only when its source family, eligibility, timing, scope, and downstream ownership are declared.

## 4.5 Player-era root

A player-era fact or occurrence is produced after full-resolution player control begins.

It follows the accepted presidential, Living Country, time, evidence, and actor contracts.

The player's decision is one cause among many and does not pre-resolve downstream outcomes.

## 4.6 Root class is not evidence quality

A baseline-inherited fact may be directly supported, estimated, modeled, or contested.

A generated fact may be exact within the generated world while still being synthetic relative to real history.

A player-era belief may be false.

Root class, semantic truth status, external support, player knowledge, and confidence remain separate.

---

# 5. Provenance-chain obligations and stopping rules

## 5.1 General provenance chain

A load-bearing historical chain should be able to identify, where applicable:

```text
provenance root
→ source/configuration/generation activity
→ initialized fact or canonical occurrence
→ owner-resolved transformation
→ cross-domain handoff
→ receiver-owned consequence
→ observation/evidence
→ actor receipt and interpretation
→ later action, memory, or current state
```

Not every fact uses every stage.

## 5.2 Root declaration

A declared root must identify, where relevant:

- root class;
- semantic owner of the resulting fact;
- fact/occurrence identity or family;
- effective/as-of interval;
- source, generation rule, or configured primitive;
- transformation and version;
- support/mapping status;
- geography/population/entity scope;
- uncertainty and known omissions;
- divergence-boundary relation;
- consumers that justify retention;
- access and player-knowledge implications.

These are semantic obligations, not one required schema.

## 5.3 Legitimate termination

**[DI — HARD INVARIANT LC-HIST02] Causal recursion may terminate at a baseline-inherited or generated-backstory root only when the root itself is sufficient to support the current fact at the required resolution and does not conceal a post-divergence occurrence, actor decision, legal transition, fiscal movement, material process, or information event that supported gameplay requires.**

Example:

```text
current Social Security statutory obligation
→ inherited operative program/legal/fiscal state
→ baseline-inherited root
→ historical enactment provenance
```

The game does not need every 1935 vote.

But:

```text
current healthcare dispute
→ generated 2029 law
```

cannot terminate at `healthcare reform happened` if active play consumes:

- who passed it;
- operative terms;
- funding;
- state participation;
- implementation;
- litigation;
- political memory.

Those post-divergence causes must exist through generated history.

## 5.4 Explanatory sufficiency is consumer-bounded

The required causal depth depends on what later systems consume.

A current tax rate may require operative legal provenance but not every committee negotiation.

A senator's remembered betrayal may require the relevant promise, actor receipt, action, and memory transition.

A court challenge may require standing, filing, forum, order, and operative legal consequence.

A public reputation may require evidence, communications, recipient exposure, and retained assessment where those facts influence current behavior.

## 5.5 No infinite regress

A provenance explanation need not recurse beyond the declared historical boundary merely to explain why the Constitution, a state, an agency, a preexisting program, or an inherited population existed.

The root must still say what is inherited, from which configured authority/source family, as of when, and with what support.

## 5.6 Multiple causes and alternative explanations

A current fact may have several contributing causes.

Provenance must preserve known:

- direct/indirect contribution;
- shared source;
- overlap;
- uncertainty;
- competing causal interpretation;
- unknown residual.

A historical explanation cannot falsely select one cause merely because it makes the narrative cleaner.

---

# 6. Historically closed baseline contract

## 6.1 Closure

**[DI — HARD INVARIANT LC-HIST03] A scenario baseline is historically closed against a declared source/configuration cutoff. Later real-world events, revisions, officeholders, data releases, laws, maps, or political developments may not overwrite the run after initialization.**

A later real-world correction may support a new configuration version.

It does not mutate an existing run's past.

## 6.2 Baseline manifest

A baseline package should declare, where applicable:

- configuration/scenario identity and version;
- historical/divergence boundary;
- source cutoff policy;
- source and artifact inventory;
- checksums and transformation versions;
- mapping/support classes;
- geographic and temporal vintages;
- legal and institutional authority references;
- initialization order and reconciliation rules;
- known gaps, approximations, and deferred facts;
- generated-content boundary;
- deterministic generation identity/seed where relevant.

## 6.3 Source material is not self-interpreting

Two official sources may differ because they represent:

- different legal status;
- different reference times;
- different geographies;
- different universes;
- preliminary versus revised estimates;
- current codification versus enacted source law;
- administrative versus statistical state;
- different accounting bases.

The baseline must identify the transformation and selection rule rather than declaring `official source wins` generically.

## 6.4 Initialized fact becomes live owner state

**[DI — HARD INVARIANT LC-HIST04] A baseline source or seed initializes the semantic owner's current state once. After the divergence boundary, only the proper live owner and accepted transition processes may change that state.**

Forbidden:

```text
2027 simulation employment state
← silently overwritten by newly downloaded real 2027 data
```

Valid:

```text
new source package
→ new scenario/configuration version
→ separate new run or explicit migration policy
```

## 6.5 Baseline snapshot is not a fabricated occurrence log

A baseline may state:

```text
Program P exists at seam T
current authority A
current obligations O
current administrator I
```

without inventing:

- every prior application;
- every prior payment;
- every congressional vote;
- every internal memo;
- every historical actor receipt.

The absence of those events means they are not available as exact individual history unless separately supported.

## 6.6 Baseline current state may be exact in-world while provenance remains modeled

A scenario may require a single canonical opening allocation even when source evidence is aggregate or incomplete.

The generated allocation can be exact **inside the simulated world** while retaining:

- modeled/approximated initialization provenance;
- uncertainty about correspondence to real history;
- no claim that the fine-grained allocation was directly observed.

This preserves Step 3's exact/modelled/bounded distinction.

---

# 7. Divergence-seam and straddling-process contract

## 7.1 The seam is not a reset

The divergence boundary separates inherited real/configured history from generated continuation.

It does not erase ongoing processes.

## 7.2 Straddling facts

At the seam, the baseline may contain ongoing state such as:

- a statute enacted but not yet effective;
- an appropriation available into a later period;
- an outstanding obligation or contract;
- an agency queue or rulemaking;
- an active court case or order;
- a sitting officeholder with remaining term;
- an election cycle already underway;
- a construction project in progress;
- an unresolved investigation;
- a measurement period partly observed;
- an embargoed or classified record;
- an organization commitment or labor agreement;
- a foreign treaty or alliance obligation.

## 7.3 Seam handoff

**[DI — HARD INVARIANT LC-HIST05] Every load-bearing process crossing the divergence boundary must identify which pre-boundary state is inherited and which post-boundary transition remains to be resolved by the live owner.**

Examples:

```text
pre-boundary law enacted
+ effective date after boundary
→ legal source inherited
→ post-boundary effectiveness transition resolved by legal owner
```

```text
pre-boundary obligation exists
+ payment due after boundary
→ obligation inherited
→ post-boundary payment/execution resolved by fiscal owner
```

```text
measurement interval began before boundary
+ collection continues after boundary
→ valid captured pre-boundary observations inherited
→ later capture/processing/release resolved by measurement owner
```

## 7.4 No seam teleportation

An inherited future obligation does not mean the future outcome already happened.

An inherited project in progress does not contain its future completion.

An inherited legal challenge does not contain the ruling.

An inherited campaign does not contain the election result.

## 7.5 Seam chronology and time zones

The configured seam must use explicit temporal semantics sufficient for processes whose legal, fiscal, electoral, or institutional boundaries differ by date, time, jurisdiction, or time zone.

The exact commercial seam remains unresolved.

---

# 8. Generated actors and synthetic backstory

## 8.1 Purpose

Generated backstory allows political actors and organizations to have careers, relationships, reputations, and context before active forward generation begins.

It must not impersonate real individuals or fabricate their participation in real historical acts.

## 8.2 Institutional history versus individual attribution

**[DI — HARD INVARIANT LC-HIST06] Pre-divergence real institutional acts may remain institutionally attributed without assigning those acts to generated fictional individuals.**

Valid:

```text
Congress enacted Program P before divergence.
```

Not valid without generated/supported individual history:

```text
Fictional Senator Ellis cast the real 2024 decisive vote for Program P.
```

## 8.3 Generated actor current state

A generated actor may receive synthetic:

- identity and career;
- earlier offices or occupations;
- party/faction affiliation;
- public positions;
- relationships;
- organization membership;
- reputation;
- electoral history;
- memories;
- commitments;
- issue association.

Those are generated-world facts, not real historical claims.

## 8.4 Backstory provenance

A load-bearing generated-backstory fact should identify:

- generation process/version;
- actor/entity identity;
- effective interval;
- institutional and geographic constraints;
- compatibility with inherited offices and law;
- relation to other generated actors;
- whether it is a background trait, compressed occurrence, relationship, memory, or public record;
- support and uncertainty inside actor/player knowledge;
- consumers justifying retention.

## 8.5 Career and office reconciliation

A generated actor cannot hold incompatible simultaneous offices or occupy an office whose inherited term, eligibility, jurisdiction, or assignment state contradicts the baseline.

A generated prior office requiring an election, appointment, or succession should have enough synthetic provenance to establish the route when the fact affects current legitimacy, relationships, seniority, or political behavior.

## 8.6 Relationships and memories

A load-bearing generated relationship or memory should identify the interaction, common history, or bounded synthetic background that supports it.

A relationship may begin as a generated baseline condition when the product does not consume its detailed origin.

When the product consumes a specific betrayal, favor, promise, vote, appointment, scandal, or alliance, that supporting occurrence and relevant knowledge/memory path must be retained.

## 8.7 Public reputation

A generated public reputation cannot be a free-floating truth about competence, ideology, honesty, or issue ownership.

It must be represented through applicable combinations of:

- actual generated record;
- evidence and communications;
- audience/actor assessments;
- polling or public-information artifacts;
- organization/party relationships;
- bounded baseline reputation state with synthetic provenance.

## 8.8 Population linkage

Every generated human actor remains subject to Step 4's exact/statistical/outside-scope population-linkage contract.

Backstory may not create extra people, voter weight, exact household history, exact media exposure, or exact material experience unsupported by that linkage.

## 8.9 Real-person insulation

The first generated modern scenario may use real institutional structures while replacing or abstracting contemporary personal identities.

Step 10 does not choose the final policy for real versus fictional people.

Whatever policy is selected must preserve:

- no false real-world attribution;
- no duplicate officeholders;
- no fabricated personal acts presented as historical fact;
- clear divergence and synthetic-history status.

---

# 9. Forward-generated prehistory

## 9.1 Lower resolution is allowed

**[DI — HARD INVARIANT LC-HIST07] Generated prehistory may operate at lower, adaptive, or selectively detailed resolution than player-era simulation, but it must preserve the same fact ownership, authority, information, causal, accounting, temporal, and actor-agency principles for every retained load-bearing result.**

It need not simulate every White House memo or daily calendar event.

It may not replace six years of political history with direct assignment of the desired 2033 state.

## 9.2 Generated process families

Later prehistory design may need to generate, where retained:

- presidential and congressional elections;
- office assignments and succession;
- administrations, appointments, vacancies, and turnover;
- party and faction development;
- major legislation and failed reforms;
- appropriations, fiscal trajectory, obligations, and program execution;
- state participation, conflict, and policy variation;
- material/social condition trajectories;
- court cases and legal consequences;
- organization formation, decline, and relationships;
- official measurements and key evidence vintages;
- media/public memory and political issue history;
- shocks and external developments;
- the player's campaign and mandate formation.

This list is not final scope.

## 9.3 Compressed ownership

A compressed law still requires:

```text
eligible initiating actor/institution
→ proposal or legislative attempt
→ procedure and autonomous support/opposition
→ resolution
→ presentment/enactment or failure
→ operative terms and dates
```

A compressed appointment still requires vacancy/office, candidate, nomination or appointment route, procedure, and effective assignment.

A compressed program still requires legal/fiscal basis, administering institution, participation, implementation, and surviving obligations.

A compressed court outcome still requires a case/claim, parties, forum, decision, order, and scope where those facts affect current law or actors.

## 9.4 Resolution adaptation

The generator may aggregate routine actors or periods when individual identity and exact sequence do not change supported outcomes.

It must deepen resolution when required by:

- consequential actor identity;
- a contested close outcome;
- persistent relationship or memory;
- legal/fiscal provenance;
- geographic/population distribution;
- evidence-at-time;
- later active dispute;
- accountability;
- opening player explanation.

Deepening cannot invent exact prior detail that the coarser process did not support.

## 9.5 Forward causality

**[DI — HARD INVARIANT LC-HIST08] Forward-generated history must arise from earlier state and eligible owner processes. It may not begin from a desired opening story and backfill convenient causes whose timing, actors, information, or outcomes were never resolved.**

A generation process may use validity constraints, conditioning, or rejection before the run begins.

It must still preserve the selected world's complete retained causal record.

## 9.6 Configured shocks and primitives

A shock family may provide an external initiating occurrence when:

- source family and eligibility are configured;
- timing and scope are generated without future leakage;
- the occurrence does not carry pre-resolved domestic effects;
- downstream domains, actors, institutions, evidence, and politics resolve independently;
- rejected or nonselected draws do not become canonical history.

## 9.7 One selected canonical branch

Once a generated opening world is selected and play begins, one history is canonical for that run.

Discarded generator attempts, counterfactual branches, forecasts, and alternate scenarios are not part of world history.

They may remain developer evidence outside the run.

## 9.8 No hidden drama selection

A generator may reject worlds that violate consistency, feasibility, variation, or configured product requirements.

It may not secretly generate thousands of histories and choose the one with the most dramatic scandals, crises, close votes, or player dilemmas unless such curation is explicitly declared as non-systemic scenario authoring.

A later generation proof must disclose acceptance/rejection criteria and seed/version semantics.

---

# 10. Player-era history

## 10.1 Full-resolution ownership

Player-era history follows the accepted presidential-game and Living Country contracts at the product's active-play resolution.

Player choices produce typed attempts.

Other actors and owners resolve downstream state.

## 10.2 No privileged historical interpretation

The game records what the President attempted and what later happened.

It does not automatically record that the President caused every observed outcome or deserves the public's eventual interpretation.

## 10.3 Persistent second term and succession

The world continues across reelection, defeat, resignation, death, vacancy, or ordinary term transfer according to accepted office, election, records, and ControlBinding semantics.

A new administration inherits the world and accessible institutional records.

It does not inherit the outgoing President's private mind, campaign data, or all staff knowledge automatically.

---

# 11. Current-state reconciliation gate

## 11.1 Core invariant

**[DI — HARD INVARIANT LC-HIST09] Before a generated opening world can be presented as valid, every load-bearing current fact must reconcile with the occurrence records, roots, outstanding processes, identities, units, times, geographies, and owner state that support it.**

The reconciliation gate checks semantic consistency, not narrative elegance.

## 11.2 Offices and elections

Reconcile:

- office existence;
- term boundaries;
- vacancies and acting service;
- election result and certification;
- entitlement and assignment;
- succession;
- separately resolved House, Senate, Presidential, state, and other elections;
- one holder per exclusive assignment interval.

An election result is not the current assignment by itself.

## 11.3 Law and legal state

Reconcile:

- constitutional and statutory sources;
- enactment and effective dates;
- amendments and supersession;
- regulations/orders;
- current operative scope;
- pending cases and orders;
- legal obligations and contested interpretations.

A codified current text may need enactment/amendment provenance without replaying every historical legislative detail before the seam.

## 11.4 Fiscal state

Reconcile where supported:

- opening stocks/balances;
- authority and availability;
- receipts and outlays;
- obligations and payments;
- debt and debt service;
- program commitments;
- transfers and reversals;
- accounting basis;
- residual/uncertainty.

The same transfer or contribution cannot be counted twice through multiple historical representations.

## 11.5 Population and geography

Reconcile:

- represented person and household totals;
- births, deaths, immigration, emigration, and internal migration after the seam;
- household/group-quarters relations where retained;
- residence and population lineage;
- geographic identity and vintage;
- electoral and service crosswalks;
- reapportionment/redistricting where the chosen dates require them;
- no duplicate generated actor weight.

## 11.6 Programs, administration, and material state

Reconcile:

- program authority and operative terms;
- responsible institutions and leadership;
- queues, applications, awards, contracts, obligations, and active projects;
- recipient/state participation;
- material stocks and pipelines;
- implementation histories;
- unresolved duties and deadlines.

Enactment cannot directly explain material outcome without implementation and material processes.

## 11.7 Evidence and public-political state

Reconcile:

- source and measurement vintages;
- what was released;
- what actors and institutions received;
- what remained confidential;
- revisions/corrections;
- recipient cognition and issue history where retained;
- party/organization agendas and reputations;
- public claims and pressure attempts;
- no retroactive knowledge.

## 11.8 Actors, organizations, and relationships

Reconcile:

- identity and population linkage;
- offices and memberships;
- careers and eligibility;
- relationships and commitments;
- current beliefs and memory;
- institutional records;
- public reputation and evidence;
- no impossible simultaneity or duplicated entity.

## 11.9 Reconciliation failure

A world that fails a load-bearing reconciliation invariant is rejected or explicitly repaired before canonical selection.

The system may not:

- hide the contradiction in presentation;
- downgrade an exact conflict to vague prose;
- invent an unrecorded event after play begins;
- make two owners silently agree through a summary field.

---

# 12. Current state does not imply unique history

## 12.1 Underdetermination

The same current aggregate may be reachable through different histories.

Examples:

- equal unemployment after either gradual adjustment or a recent sharp shock;
- equal debt after different tax/spending paths;
- equal party seat totals with different close races and coalitions;
- equal Housing stock with different geographic distribution and program history;
- equal approval with different issue beliefs and attributions.

## 12.2 History matters when later consumers differ

Two worlds with the same current aggregate may remain meaningfully different because of:

- actor memories and commitments;
- institutional precedents;
- legal rights;
- outstanding obligations;
- organization resources;
- public attribution;
- evidence and revision history;
- geographic distribution;
- policy beneficiaries and administrative burden;
- party/faction reputation.

## 12.3 No inverse-history fabrication

**[DI — HARD INVARIANT LC-HIST10] Current state may constrain possible history, but it does not license the generator or UI to infer one exact past when several histories remain compatible.**

When the exact past was not retained, the answer remains:

- one supported reconstruction among alternatives;
- modeled;
- bounded;
- unresolved;
- unknown.

---

# 13. Evidence-at-time and knowledge history

## 13.1 World history versus knowledge history

The historical occurrence record says what happened.

Evidence history says what was measured, reported, or discovered.

Actor and institutional history says what each recipient received, knew, believed, remembered, or decided.

Those may diverge.

## 13.2 Revision

A later statistical revision, court ruling, investigation, declassification, confession, or correction can change current evidence or interpretation.

It does not rewrite:

- the original occurrence;
- the earlier artifact;
- the earlier actor's receipt;
- the earlier decision's evidence set;
- the earlier public belief;
- actions already taken.

## 13.3 Access

A provenance graph or developer audit record does not grant player access.

Player-facing history is constrained by:

- public records;
- administration records;
- classified/privileged access;
- source protection;
- successor access;
- archival timing;
- discovered evidence;
- current office and ControlBinding.

## 13.4 Missing documentation

An action may have occurred while its rationale, private deliberation, or exact recipient knowledge remains partly undocumented.

The game may retain the action as exact and the motive or knowledge as unknown.

It may not infer motive from outcome by default.

---

# 14. Unknown, disputed, missing, and contradictory history

## 14.1 Missing is not zero

No record of a payment, meeting, belief, protest, vote, source, or organization does not automatically prove none existed unless the relevant system guarantees completeness.

## 14.2 Source conflict

When historical sources disagree, the baseline/generator must preserve where relevant:

- source identities;
- legal/evidentiary status;
- time/vintage;
- scope;
- methodological difference;
- selected canonical treatment;
- unresolved residual or dispute;
- player-accessible versus developer-known information.

## 14.3 Canonical world selection under uncertainty

The simulation may need one exact in-world fact even where external evidence is uncertain.

A configured or generated selection can establish the simulated-world fact when:

- the selection method is declared;
- the source uncertainty remains in provenance;
- the game does not present the selected fine-grained value as directly observed real history;
- actor knowledge remains separately modeled.

## 14.4 Disputed historical claim

A dispute over what happened may persist as political/legal/informational state.

The world may possess a canonical truth unknown to actors, or the supported abstraction may leave some facts unresolved.

Neither state permits an issue projection or player-facing narrative to invent certainty.

---

# 15. Historical compression and retention

## 15.1 Retention is consumer-driven

**[DI — HARD INVARIANT LC-HIST11] Historical retention and compression must be justified by the current and future supported consumer closure, not by one universal rule to preserve everything or discard everything older than a fixed age.**

Consumers may include:

- current legal/fiscal/material state;
- actor and organization relationships;
- evidence-at-time and accountability;
- active cases, programs, contracts, obligations, and queues;
- election and office legitimacy;
- issue/party/faction memory;
- generated opening briefings;
- player record and causal explanation;
- save/load deterministic continuation.

## 15.2 Retention classes

A later implementation may distinguish conceptually:

- current operative state;
- active-process history;
- permanent load-bearing occurrence;
- retained evidentiary artifact;
- summarized historical interval;
- sampled/aggregated routine activity;
- discardable non-load-bearing detail;
- developer-generation trace outside live player history.

Step 10 does not choose exact storage classes or periods.

## 15.3 Summary is a projection

A compressed summary owns its own content, method, time, support, and source references.

It does not replace retained occurrence identities or current owner state where later systems require them.

## 15.4 Safe compression

Routine history may be compressed when doing so preserves all later-required:

- quantities and accounting;
- identities and relationships;
- legal/fiscal obligations;
- effective dates and deadlines;
- affected population/geography support;
- evidence/knowledge history;
- actor memories and commitments;
- issue/policy lineage;
- deterministic continuation;
- uncertainty and omissions.

## 15.5 Unsafe compression

Compression is invalid when it:

- merges distinct actors whose identities later matter;
- removes the source of a current right or obligation;
- loses which evidence an actor possessed;
- turns several contributions into one untraceable total;
- removes geographic/population distribution required later;
- fabricates exact detail upon later expansion;
- erases an earlier failed policy or promise that still shapes politics;
- makes a current condition appear causeless.

## 15.6 No future-aware retention

The generator/runtime may use declared supported consumer families and active obligations.

It may not inspect hidden future player decisions or random events to decide which past facts can be discarded.

This carries forward Step 3's no-future-peeking coarsening rule.

---

# 16. Versioning, correction, and scenario migration

## 16.1 Baseline corrections

Before scenario release, a baseline source or transformation error may be corrected through a new artifact/configuration version.

After a run begins, the run remains historically closed to its pinned configuration.

## 16.2 New configuration is not historical revision inside the run

A later real-world data revision, newly discovered source, corrected map, or legal correction may produce:

- a new scenario version;
- a new calibration package;
- an explicit save migration;
- a documented compatibility break.

It does not silently rewrite the original run.

## 16.3 Save migration

A migration affecting historical or current facts must preserve or explicitly transform:

- canonical identities;
- current owners;
- occurrence references;
- provenance roots;
- times and ordering;
- legal/fiscal/material consequences;
- actor knowledge and access;
- uncertainty and support.

A migration may not insert convenient past political events merely to make new content work.

## 16.4 Correction inside the simulated world

An in-world correction, audit finding, court reversal, revised statistic, or declassification creates a new occurrence/artifact/state transition.

It does not rewrite the earlier world to pretend the earlier record never existed.

---

# 17. Counterfactuals, forecasts, and alternate histories

## 17.1 Canonical branch

One run has one selected canonical history.

## 17.2 Counterfactuals

Forecasts, staff scenarios, campaign simulations, alternate generator outputs, and player reload branches are not canonical history in the current run.

They may be preserved as:

- information artifacts;
- developer/test evidence;
- separate saves;
- explicit alternate scenarios.

## 17.3 No cross-branch leakage

A current run cannot use facts from an unselected generator branch or future reload branch.

A forecast cannot read actual future outcomes.

A generator cannot retain rejected-world scandals as memories in the accepted world.

---

# 18. Historical opening and player-facing explanation

## 18.1 Inauguration/assumption-of-office briefing

A generated opening briefing may project accessible facts such as:

- current President/officeholder identity and term;
- prior election result and mandate interpretations;
- predecessor and administration history;
- House/Senate composition and leadership;
- inherited laws, programs, appointments, cases, fiscal state, and implementation;
- current national conditions and trends;
- salient but perspectival political issues;
- current crises, opportunities, and deadlines;
- campaign commitments and coalition relationships.

Each load-bearing statement must have a provenance route.

## 18.2 Canonical state versus generated configuration versus derived presentation

### Canonical state

Facts currently owned in the world, such as office assignments, laws, balances, conditions, active proceedings, relationships, and evidence.

### Generated/configured inheritance

Roots and occurrences that established the current state.

### Derived presentation

The briefing's selection, wording, organization, and explanation.

The presentation may summarize.

It may not create the history.

## 18.3 Opening claim ledger

A load-bearing opening claim should be able to answer:

- what current fact or historical occurrence supports it;
- root class;
- current semantic owner;
- evidence/source/generation lineage;
- time and geography;
- whether it is exact, modeled, bounded, disputed, or unknown;
- what the administration can actually access;
- whether the statement is fact, staff assessment, public interpretation, or political claim.

## 18.4 No canned causal paragraph

The game should not hardcode:

> You won because Housing was bad.

It may derive a statement such as:

> Your campaign won narrowly in three fast-growing states after emphasizing Housing costs; polling, campaign records, turnout, and opponent strategy provide incomplete evidence about how decisive that emphasis was.

The exact wording and UI remain unresolved.

---

# 19. Adversarial paper proofs

These are design-contract proofs, not generator output.

## Proof A — inherited century-old program without complete replay

Path:

```text
pre-divergence statute/program
→ baseline-inherited legal and administrative identity
→ opening fiscal obligations and beneficiaries
→ current owners continue program after seam
```

Required conclusions:

- no simulation of every original vote or payment;
- legal/program/fiscal current state remains reconciled;
- source and enactment provenance remains available;
- fictional current actors are not credited with original enactment.

## Proof B — pre-boundary law becomes effective after the seam

Path:

```text
law enacted before seam
→ inherited legal source and future effective date
→ live legal transition after seam
→ agency action may become available
→ implementation and material effects resolve later
```

Required conclusions:

- baseline inheritance does not pre-resolve future effect;
- seam crossing is explicit;
- later actors know only through valid records.

## Proof C — fictional senator in inherited real institution

Path:

```text
real Senate office and term structure inherited
→ generated Senator Ellis assigned through synthetic compatible history
→ real pre-divergence law remains institutionally attributed
→ Ellis has no fabricated real roll-call vote
→ generated post-divergence votes belong to Ellis
```

Required conclusions:

- office continuity and fictional person remain distinct;
- no duplicate population weight;
- biography states what is generated versus inherited.

## Proof D — generated 2029 healthcare law inherited in later play

Path:

```text
post-divergence condition and political state
→ generated proposal and autonomous Congress
→ votes/presentment/enactment
→ fiscal authority and state implementation
→ material and evidence consequences
→ litigation and political memory
→ later opening dispute
```

Required conclusions:

- cannot terminate at `reform happened`;
- load-bearing terms, owners, obligations, and memories survive compression;
- current state reconciles.

## Proof E — later evidence revises understanding of earlier administration

Path:

```text
earlier material state
→ preliminary official estimate
→ administration receives and acts
→ later benchmark revision
→ current statistical series changes
→ earlier decision retains original evidence vintage
```

Required conclusions:

- current knowledge and historical knowledge differ;
- revision does not rewrite the earlier decision.

## Proof F — equal current aggregate, different inherited politics

Two worlds have the same current unemployment and debt.

World 1 arrived through gradual adjustment and bipartisan legislation.

World 2 arrived through a sharp recession, emergency borrowing, broken promises, and recent recovery.

Required conclusions:

- current aggregates can match;
- actor relationships, obligations, public attribution, issue salience, and institutional precedent differ;
- the generator cannot infer history from aggregates alone.

## Proof G — quiet historical condition

Path:

```text
condition worsens over several generated years
→ local experience and incomplete records
→ weak organization and limited media
→ no national political adoption
→ later improved measurement or investigation
```

Required conclusions:

- the condition has material provenance despite weak issue history;
- current significance does not retroactively fabricate prior national concern.

## Proof H — geography vintage transition

Path:

```text
inherited population and district vintage
→ post-seam census/reapportionment/redistricting processes where required
→ new geographic/electoral relationships
→ later elections use the applicable vintage
```

Required conclusions:

- old and new maps remain versioned;
- people do not move merely because district boundaries change;
- historical elections retain their map vintage.

## Proof I — compressed administration and program continuity

Path:

```text
generated administration creates program
→ routine years compressed
→ key obligations, queue state, material effects,
  major evidence, leadership, and political memories retained
→ new President inherits unfinished implementation
```

Required conclusions:

- compression does not erase live work;
- a summary does not become the owner of the program;
- successor access differs from outgoing private knowledge.

## Proof J — invalid backsolved world

Attempted path:

```text
desired opening: healthcare dispute + hostile Court + divided Congress
→ generator invents convenient 2029 law, appointments,
  cases, election results, and scandals backward
```

Required conclusion:

- invalid unless the selected history was actually resolved forward through eligible actors, procedures, evidence, and transitions;
- consistency alone is insufficient.

---

# 20. Anti-cheat and anti-fabrication tests

The candidate rejects:

1. requiring full simulated chronology back to national founding;
2. baseline source remaining live owner after initialization;
3. later real-world data overwriting a running scenario;
4. source artifact aliasing canonical current state;
5. current snapshot presented as complete occurrence history;
6. generated actor receiving real person's pre-divergence personal acts;
7. generated actor appearing in an office without compatible term/assignment provenance;
8. relationship, memory, or reputation influencing play with no declared generated/inherited basis;
9. post-divergence law/program/court/fiscal state inserted as unexplained baseline;
10. straddling process teleporting to future completion;
11. current aggregate used to infer one exact past;
12. missing record treated as proof of zero activity;
13. later revision becoming earlier actor knowledge;
14. developer provenance granting player omniscience;
15. summary artifact becoming current-state owner;
16. compression erasing obligations, rights, deadlines, or active queues;
17. compression merging distinct actors or contributions needed later;
18. later expansion fabricating exact discarded history;
19. retention peeking at future player choices or random events;
20. rejected generator branches contaminating selected history;
21. generator selecting most dramatic valid world through hidden scoring;
22. issue importance retroactively creating prior concern;
23. office transfer copying private mind or campaign records;
24. calibration correction silently mutating existing saves;
25. a fictional opening briefing asserting certainty unsupported by sources or generated records;
26. two canonical occurrence records disagreeing about the same event;
27. history replay becoming a second owner of current state;
28. identical current state assumed to imply identical political inheritance;
29. legal codification, regulation, case law, and administrative implementation collapsed into one historical fact;
30. an unresolved contradiction hidden through vague presentation.

---

# 21. Step 10 binary gate

The detached audit must answer:

> **Can every load-bearing inherited/current fact and opening-history claim terminate honestly at a declared baseline-inherited or generated-backstory root, or trace through forward-generated/player-era owner-resolved occurrences and transformations, while current state, occurrence history, evidence vintages, actor knowledge, and presentation remain separate—without full chronological simulation, baseline shadow ownership, false actor attribution, post-divergence cause omission, retroactive fabrication, dramatic backsolving, lost obligations through compression, unsupported historical precision, or contradictions at the opening reconciliation gate?**

PASS requires all of the following:

1. source material, transformation, baseline assertion, occurrence, current fact, evidence artifact, actor memory, institutional record, and historical projection remain distinct;
2. every load-bearing fact has a root or explicit unsupported/unknown status;
3. root class remains distinct from support, truth, and player knowledge;
4. baseline causal recursion may terminate without complete replay;
5. baseline initialization cannot continue mutating the world;
6. the divergence seam preserves ongoing processes and future owner resolution;
7. generated fictional actors do not inherit real individual acts;
8. generated backstory has sufficient provenance for every fact it makes load-bearing;
9. lower-resolution prehistory preserves ownership, authority, information, and causality;
10. forward generation cannot backfill a desired story after the fact;
11. current state reconciles with offices, elections, law, finance, population, geography, programs, materials, evidence, actors, and outstanding processes;
12. current state does not imply a unique history;
13. evidence-at-time and later revision remain distinct;
14. missing, disputed, modeled, bounded, and exact history remain distinct;
15. compression preserves current obligations, relevant history, knowledge, and causal explanation without future-peeking;
16. scenario/configuration corrections are versioned rather than retroactive;
17. counterfactuals and rejected generated worlds do not leak into the selected run;
18. player-facing opening history is access-bounded and provenance-bearing;
19. the adversarial proofs remain coherent;
20. the contract does not secretly select a calibration date or claim generated prehistory works.

A PASS establishes only the historical-provenance and causal-completeness constitution.

It does not prove final calibration quality, generator quality, historical plausibility, performance, UI, content quality, or fun.

---

# 22. Explicitly not accepted by this candidate

This candidate does not decide or prove:

1. final divergence/calibration date;
2. January 2025 or January 2033;
3. final source cutoff;
4. final legal, fiscal, statistical, population, geographic, administrative, or archival source inventory;
5. exact baseline manifest/schema;
6. exact transformation, synthesis, imputation, reconciliation, or source-priority algorithms;
7. exact generated actor policy or real-person policy;
8. exact generated biography, relationship, reputation, or memory system;
9. exact prehistory process resolution, seed, conditioning, rejection, or variation algorithm;
10. exact shock inventory;
11. exact history/event/provenance storage architecture;
12. event sourcing or replay;
13. exact retention, archive, summary, compaction, or save-size rules;
14. exact migration policy;
15. exact opening briefing language or UI;
16. final State-of-the-Nation, Record, dossier, timeline, or provenance interface;
17. final historical-scenario support;
18. final domain inventory or depth tiers;
19. Early Access scope;
20. roadmap, implementation order, or next code proof;
21. generated-prehistory proof;
22. historical plausibility, political-content quality, performance, comprehensibility, balance, fun, or commercial viability.

---

# 23. External research grounding

## 23.1 Provenance models

The W3C PROV Data Model distinguishes entities, activities, agents, derivation, responsibility, time, collections, and provenance bundles. Step 10 uses the bounded lesson that provenance should preserve what was produced, by which activity and responsible agent, from which prior entities, and with versioned provenance-of-provenance when needed.

It does not require W3C PROV as the runtime schema.

- https://www.w3.org/TR/prov-dm/

## 23.2 Official legal sources and historical versions

GovInfo and the Office of the Law Revision Counsel distinguish the United States Code, positive-law and non-positive-law titles, and the continuing authority of the Statutes at Large. The eCFR distinguishes the official print CFR from the continuously updated, authoritative-but-unofficial electronic compilation and exposes historical versions.

The design lesson is that `current legal text`, `enacted source`, `codification`, `regulatory version`, and `historical effective state` may require separate provenance and vintage.

- https://www.govinfo.gov/help/uscode
- https://uscode.house.gov/about_code.xhtml
- https://www.govinfo.gov/features/statute-compilations
- https://www.ecfr.gov/

## 23.3 Records, context, and retention

NARA describes federal records through creation/receipt, maintenance and use, and disposition; records schedules distinguish temporary and permanent preservation based on function, informational content, legal/business need, and archival value. NARA also preserves outgoing presidential records while institutional accounts and functions continue under successors.

The design lesson is not to copy federal records law into the game. It is to preserve context, originating owner, access, continuity, and consumer-driven retention rather than keeping every transient record forever or discarding everything old.

- https://www.archives.gov/records-mgmt/sch-appraisal
- https://www.archives.gov/records-mgmt/scheduling/nara-review
- https://www.archives.gov/presidential-records/support-to-the-white-house/presidential-transitions
- https://www.archives.gov/presidential-records/research/archived-white-house-websites

## 23.4 Geographic vintage

The Census Bureau documents that ACS estimates use specific geographic boundary vintages and that legally/statistically defined geographies can change over time.

The design lesson is to retain geography vintage and not project current boundaries backward or old election results onto new maps without an explicit transformation.

- https://www.census.gov/programs-surveys/acs/geography-acs/geography-boundaries-by-year.html

These sources support the design distinctions. They do not prove a final historical generator or select a scenario date.

---

# 24. Candidate disposition

## **READY FOR DETACHED STEP-10 AUDIT**

The candidate answer is:

> **The game does not need all of American history simulated. It needs every supported current fact and inherited political consequence to terminate at an honest, versioned root or trace through retained owner-resolved history, while current state, occurrence records, evidence-at-time, actor memory, and player-facing explanation remain separate and reconciled.**

This file is a candidate only.

No Step 10 authority exists until a detached audit is preserved, any blocking findings are repaired, the unchanged binary gate passes, and a separate authority action explicitly accepts the resulting composite.