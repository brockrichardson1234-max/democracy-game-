# Living Country Step 1 — Layer Ownership Contract

Status: **LIVING-COUNTRY DESIGN CANDIDATE — PRESERVED FOR REVIEW. NOT ACCEPTED PRODUCT, ARCHITECTURE, CALIBRATION, UI, ROADMAP, EARLY-ACCESS, SCHEMA, RUNTIME, OR IMPLEMENTATION AUTHORITY.**

Authority and evidence boundary:

- Accepted production baseline used by the assessment: `44c1724962830225e6fc34f41d0df0cfdb7dfec0`
- Entirely unaccepted Stage 1 candidate: `a7e04ca78ba1ccb06d8dc3a4dfb0d43389804144`
- Accepted Step 5 presidential-game authority: `2c5fc2d798c5fcc232b519052390b56d60f06267`
- Controlling Step 5 product center: **The country keeps moving. You decide what deserves the President.**

This is Step 1 of the Living Country assessment. It freezes the conceptual ownership boundaries needed before designing a common country-state grammar, population/geography requirements, specific domains, coupling, generated prehistory, media depth, or player-facing information requirements.

It does **not**:

- choose the final durable-domain set;
- choose domain-depth tiers;
- accept January 2025 as the calibration boundary;
- accept January 2033 as the commercial start;
- prove generated prehistory;
- accept a six-surface interface;
- define implementation schemas or source-code modules;
- recommend a roadmap or code increment;
- reopen the accepted Step 5 presidential-game core.

---

# Evidence labels

- **[RF — Repository fact]**: already established by accepted repository architecture or assessment authority.
- **[DI — Design inference]**: a proposed Living Country contract derived from the accepted evidence.
- **[UQ — Unresolved question]**: deliberately deferred to a later Living Country step.

A design inference does not become accepted merely because it is committed on the assessment branch.

---

# 1. Purpose

The Living Country phase asks:

> **What United States must exist beneath the accepted presidential gameplay core, and who owns every kind of fact that can produce a presidential situation?**

The first task is not to list economic, social, or policy domains. It is to prevent the country from becoming a set of overlapping god systems.

The accepted architecture already establishes the central doctrine:

> **Every mutable canonical fact has one semantic owner. Other systems may reference, measure, report, forecast, summarize, distribute, interpret, or react to that fact without becoming its owner.**

The Living Country design must retain that doctrine while adding materially broader America.

---

# 2. The four country layers are conceptual, not new canonical roots

## 2.1 Core rule

**[DI — HARD INVARIANT LC-L01]** The four Living Country layers organize design questions and causal relationships. They do not replace the accepted fact-level ownership roots, and they must not become four new god objects.

The four conceptual layers are:

1. **Material and social country** — what America materially is and what people experience.
2. **Institutional and political country** — who can act, under what authority, with what objectives and procedures.
3. **Information and public-political country** — how parts of reality become observable, reported, distributed, believed, attributed, and politically salient.
4. **Historical and calibration country** — why current state exists and where causal provenance may legitimately terminate.

The accepted semantic roots remain controlling:

```text
CanonicalWorldState
├── TimeState
├── GeographyState
├── PopulationState
├── MaterialDomains
├── PoliticalOrder
├── InformationEnvironment
└── HistoricalRecord
```

Rules/content configuration remains a separate architectural class rather than ordinary mutable world state.

## 2.2 Layers classify facts, not whole entities

**[DI — HARD INVARIANT LC-L02]** One entity may participate in several layers because it owns or references different facts. The facts do not migrate merely to keep the entity inside one conceptual layer.

Examples:

- A media company is an organization/institutional actor; its published story is an information artifact; its audience exposure is not owned by the company; resulting beliefs remain recipient-owned.
- A firm may own organizational decisions and operational resources; an economic/material domain owns aggregate production, employment, wage, price, or market outcomes produced through the relevant processes.
- A governor is an individualized political actor; the state is a jurisdiction; the state’s population remains PopulationState; the state’s economic conditions remain their material-domain facts.
- An ordinary population cohort owns population identity, residence linkage, and recipient political state; its employment, income, health, housing, or education facts may remain with their semantic material domains.
- A court is an institution containing offices and actors; a ruling/order is legal/judicial state; a news story about the ruling is an information artifact; public belief about it remains population state.

## 2.3 No layer-level mutation authority

**[DI — HARD INVARIANT LC-L03]** No layer label grants mutation authority. Only the fact’s canonical owner may mutate it through an accepted process.

Forbidden examples:

```text
InstitutionalPoliticalCountry.passLaw()
    → MaterialSocialCountry.unemployment -= 1.0
```

```text
InformationPublicCountry.publishNegativeStory()
    → Population.approval -= 5
```

```text
HistoricalCalibrationCountry.issueWasImportantIn2030
    → CurrentCongress.support = true
```

A layer may organize references or analysis. It never substitutes for the owner-respecting transition chain.

---

# 3. Cross-cutting substrate

The four conceptual layers all depend on three cross-cutting structures.

## 3.1 Time

**Owner:** `TimeState`, plus domain-owned dates, deadlines, effective periods, and schedules.

TimeState owns current dated time. It does not own why a law becomes effective, a filing expires, an election occurs, a measurement is released, or a project milestone is due.

A scheduler may index those facts without becoming their semantic owner.

## 3.2 Geography

**Owner:** `GeographyState` for spatial identity, boundaries, containment, adjacency, and stable spatial references.

Geography does not own:

- people;
- jurisdictions;
- electorate preferences;
- economic conditions;
- media audiences;
- state-government decisions.

Population and material domains reference geography. Jurisdictions and electoral maps reference geography. A map projection owns none of those facts.

## 3.3 Configuration and scenario identity

**Owner:** rules/content configuration for immutable definitions, calibration package identity, source versions, and scenario rules.

Configuration may initialize canonical world state. After initialization, it does not remain a shadow owner of changing current state.

**[DI — HARD INVARIANT LC-L04]** A calibration value is not live truth after the corresponding canonical owner has been initialized and begun evolving.

Forbidden:

```text
CurrentEmployment = calibration.employment2025
```

forever after divergence.

Required:

```text
calibration input
→ validated initialization
→ Labor/Economy owner holds current employment state
→ later changes occur only through that owner
```

---

# 4. Layer A — Material and social country

## 4.1 Definition

The material and social layer contains the country’s actual physical, economic, demographic, service, environmental, and lived conditions.

It answers:

- What materially exists?
- Where does it exist?
- Who is exposed?
- How does it change?
- What inputs can government or private actors legitimately provide?
- What consequences can later be measured or directly experienced?

## 4.2 Ownership structure

There is no universal `CountryConditions` owner.

Potential semantic owners may eventually include:

- PopulationState for one canonical ordinary population identity/weight/residence/core demographic representation;
- Housing for housing stock, construction, vacancy, affordability, and related material conditions;
- Labor/Employment for employment status, participation, job flows, occupation/industry exposure, and related conditions;
- Income/Household Finance for earnings, income, disposable resources, poverty-related state, and household financial exposure where that is the accepted semantic split;
- Prices/Markets for relevant price levels and changes where not owned by a more specific domain;
- Health/Healthcare for health/service/coverage/cost/capacity facts according to later domain design;
- Education for attainment, enrollment, capacity, or outcomes at the selected resolution;
- Energy for supply, generation, reliability, prices/exposure, and infrastructure as later defined;
- Environment/Climate for environmental conditions and risks where modeled;
- Infrastructure for physical-network condition/capacity where not owned by a more specific domain;
- Industry/Trade for production, supply relationships, firms/sectors, and trade exposures where modeled;
- Public Safety for crime/public-safety conditions at the selected resolution;
- Immigration/Population Movement for migration, processing, status, flows, and related state according to later ownership decisions;
- bounded external domains for foreign/security/material conditions when eventually represented.

This list is illustrative. Step 1 does not accept the final domain inventory or split.

## 4.3 One population, many associated facts

**[RF]** The accepted architecture requires one canonical ordinary population identity/weight/residence/political representation and rejects cloned economic people, electoral people, media audiences, or program beneficiaries.

**[DI — HARD INVARIANT LC-L05]** A material domain may associate its facts with the canonical population without absorbing population identity or duplicating the people.

Conceptually:

```text
PopulationUnit P
  identity/weight/residence/core demographic state

LaborDomainFacts(P)
  employment/occupation/wage-related facts

HousingDomainFacts(P or P's geography/exposure class)
  tenure/affordability/material exposure

HealthDomainFacts(P)
  coverage/service/health-related facts where represented
```

The exact representation may be cohort-linked, weighted, sparse, regional, household-based, or hybrid. Ownership follows the fact’s meaning.

## 4.4 Material experience does not own political response

**[DI — HARD INVARIANT LC-L06]** A material condition may provide a causal input to population or actor response, but it cannot directly write belief, attribution, salience, preference, turnout, approval, organizational strategy, or an election result.

Forbidden:

```text
unemployment rises
→ incumbentSupport -= 8
```

Required conceptual path:

```text
employment condition changes
→ affected population/material experience and/or measurement
→ recipient observation/information exposure
→ recipient-owned belief, attribution, and salience processes
→ political action or electoral state through its correct owner
```

Direct experience may provide strong information about what happened. It does not automatically provide correct causal attribution.

## 4.5 Government inputs do not own material results

**[DI — HARD INVARIANT LC-L07]** Law, spending authority, programs, directives, grants, waivers, state participation, enforcement, or administrative competence may create inputs to material domains. They do not directly set the outcome.

Examples:

- A housing appropriation can fund eligible activity; Housing owns whether stock, completion, vacancy, or affordability changes.
- A labor law can change legal/administrative incentives and constraints; the Labor/Economy owner resolves employment and wage responses.
- A healthcare subsidy can change eligibility and payment inputs; Health/Healthcare owners resolve enrollment, provider capacity, coverage, cost, and health consequences at supported resolution.
- An energy rule can alter permitted behavior; Energy/Industry owners resolve supply, investment, reliability, prices, and regional effects.

Material response may be delayed, weak, heterogeneous, offsetting, or negative.

## 4.6 Material domains do not own their measurement

A domain owns the condition. A measurement process owns captured observations/results. An official release owns what was reported. Neither becomes a second material owner.

## 4.7 Material-layer prohibitions

The material/social layer may not:

- own laws or legal validity;
- own an agency’s program decision;
- own a governor’s or firm’s choice;
- own journalism or claims;
- own public belief;
- own election outcomes;
- own political-issue importance;
- use one national metric as a complete substitute for heterogeneous underlying state when that heterogeneity affects supported gameplay.

---

# 5. Layer B — Institutional and political country

## 5.1 Definition

The institutional and political layer contains entities capable of authority, action, organization, coordination, bargaining, interpretation, administration, and conflict.

It answers:

- Who can act?
- What role or authority permits the attempt?
- What objectives, beliefs, constituencies, commitments, resources, and procedures shape the choice?
- Who independently admits, transforms, rejects, obeys, resists, or ignores the attempt?

## 5.2 Governmental ownership

The accepted `PoliticalOrder` split remains controlling. Distinct facts include:

- jurisdictions;
- institutions;
- offices and assignments;
- constitutional/legal sources;
- procedures;
- fiscal authority and execution;
- administrative state;
- intergovernmental relationships;
- elections;
- individualized political actors;
- judicial contest.

No single Government or Presidency object may own all of them.

## 5.3 Institutions are not actors

An institution persists beyond officeholders and owns institutional structure, capability, operations, and participation in procedures.

An actor owns individual identity and actor-private decision-relevant state.

An office supplies role-specific authority through assignment.

A procedure owns current procedural state.

The legal order owns the rules that make actions valid or invalid.

**[DI — HARD INVARIANT LC-L08]** Institution, actor, office, assignment, organization, coalition, procedure, legal source, and decision record remain distinct even when a player-facing workstream refers to all of them together.

## 5.4 Organizations and political collectives

Parties, factions, caucuses, unions, firms, business associations, nonprofits, advocacy organizations, media organizations, donor networks where modeled, and external organizations may own:

- identity;
- membership/affiliation relationships;
- resources;
- leadership;
- adopted positions;
- objectives;
- operating strategy;
- internal institutional state;
- actions and communications.

They do not own:

- every member’s beliefs or decisions;
- ordinary-population belief;
- office authority;
- material country outcomes merely because their actions influence them;
- election results;
- the truth of claims they issue.

## 5.5 Private America

The institutional/political country is not limited to government.

Potential autonomous actors include:

- firms and industry organizations;
- labor unions;
- professional associations;
- hospitals, universities, nonprofits, and service institutions where identity matters;
- advocacy and activist groups;
- media organizations and journalists;
- platforms and distribution institutions;
- external governments and organizations at bounded resolution.

Their inclusion and resolution depend on causal need. Step 1 does not require individual simulation of every firm, union, outlet, hospital, school, or nonprofit.

**[DI — INDIVIDUALIZATION RULE LC-L09]** Represent an organization or person individually when its identity, one decision, persistent history, authority, resources, relationships, or public role can materially change a supported outcome. Aggregate otherwise.

## 5.6 Actor decisions require bounded information

Institutional and political actors do not read canonical world truth automatically.

Their decisions may use:

- direct records available through their role;
- public information;
- private communications;
- direct material or operational experience;
- organization information;
- constituency estimates;
- forecasts;
- commitments and relationships;
- known procedures and deadlines.

They may be wrong, delayed, biased, or uncertain.

## 5.7 Actor action does not equal result

An actor’s attempt becomes a canonical action/communication/proposal/request. The relevant target or procedure resolves the next step independently.

Examples:

- a senator introduces a bill; introduction is not committee admission, scheduling, passage, enactment, implementation, or outcome;
- a governor requests a waiver; request is not federal approval;
- a union announces opposition; statement is not member belief or election result;
- a firm announces a closure; announcement is information, while actual operations/employment changes remain material-domain facts;
- a media outlet decides to investigate; investigation is not proof that misconduct occurred;
- the President issues a direction; legality, compliance, implementation, and material effects remain separately resolved.

## 5.8 Institutional-layer prohibitions

The institutional/political layer may not:

- directly write material/social outcomes;
- own what media stories say merely because a media company is an organization;
- own audience belief;
- treat parties or organizations as hive minds;
- treat a coalition projection as a canonical bloc decision;
- use one global Support, Legitimacy, Influence, Institutional Control, or Issue Priority value to determine unrelated actors;
- initiate action because a hidden story director needs pressure.

---

# 6. Layer C — Information and public-political country

## 6.1 Definition

This layer describes how portions of the world become observable, represented, distributed, interpreted, remembered, measured, and politically consequential.

It does not own one unified public reality.

The layer contains relationships among:

- observable canonical occurrences and records;
- measurement processes;
- official and private information artifacts;
- sources and access;
- journalism and investigation;
- claims and corrections;
- publication and distribution;
- recipient exposure, notice, and memory;
- belief, attribution, trust, and salience;
- polling and other measurements of political state;
- political actions and elections that later consume recipient state.

## 6.2 Ownership is distributed across this layer

**[DI — HARD INVARIANT LC-L10]** The “information/public-political layer” is a causal network, not a single Information or Media owner.

The decisive split is:

```text
underlying condition / institutional fact
    owned by its material, legal, political, or administrative owner

measurement process and committed observation
    owned by measurement/information-process state

report, story, claim, correction, memo, poll
    owned as an information artifact

publication/distribution choice
    owned by the relevant actor or institution

artifact availability/delivery record
    owned by the InformationEnvironment

recipient notice, retained knowledge, trust, belief,
attribution, salience, preference, turnout disposition
    owned by the recipient: PopulationState, PoliticalActor,
    or Organization where genuinely organization-level

election contest, ballots, certification, result
    owned by the electoral process

current office assignment
    owned separately by office/assignment state
```

## 6.3 Measurement

Measurement observes canonical state under a method, sample, coverage, and as-of period.

It may be:

- exact for an authoritative institutional record;
- sampled;
- incomplete;
- lagged;
- noisy;
- revised;
- differently aggregated from the referent.

Measurement cannot mutate the referent to match its result.

## 6.4 Information artifacts

Artifacts may include:

- official releases;
- agency reports;
- forecasts;
- intelligence assessments;
- staff memos;
- legislative whip assessments;
- court notices;
- speeches;
- claims;
- interviews;
- tips;
- leaked records;
- journalistic notes/dossiers;
- published stories;
- corrections;
- polls.

An artifact owns its existence, content, provenance, as-of time, creation/release time, access, revision relationships, and supported distribution state.

It does not own the fact it describes or the beliefs it may influence.

## 6.5 Recipient-side exposure distinction

The word “exposure” can hide several different facts. This contract separates them.

1. **Publication/distribution attempt** — actor/institution action.
2. **Availability/channel delivery** — InformationEnvironment fact.
3. **Recipient exposure occurrence** — a provenance-bearing relational record that an artifact reached a population/actor recipient or audience class.
4. **Notice/attention/retention** — current recipient-owned state where modeled.
5. **Belief incorporation/rejection** — recipient-owned process and state.

**[DI — HARD INVARIANT LC-L11]** Media organizations and platforms do not own audience exposure, notice, belief, or attribution merely because they selected and distributed an artifact.

To preserve the accepted architecture, InformationEnvironment may own the immutable delivery/exposure occurrence record. The recipient owner holds any current notice, memory, trust, belief, attribution, salience, preference, or turnout state used in later decisions.

## 6.6 Public belief and attribution

Ordinary-population belief, attribution, salience, preference, and turnout disposition remain PopulationState facts.

Individual political actors own their actor-private versions.

An organization may own an adopted organizational assessment or position when that is truly an organization fact. It does not thereby own member beliefs.

Belief about what happened and attribution of responsibility are distinct.

## 6.7 Polling

A poll is a measurement process/artifact over population political state.

It may contain:

- sample and coverage error;
- likely-voter assumptions;
- timing lag;
- aggregation choices;
- house effects or methodology where modeled;
- later revision or comparison.

A poll does not become the electorate, and publication does not automatically change population state.

## 6.8 Elections are not an information-layer outcome

**[DI — HARD INVARIANT LC-L12]** Elections remain institutional/electoral processes that consume eligible population and political state under law. They are not a poll, public-opinion projection, media consequence, or final stage owned by the InformationEnvironment.

Conceptually:

```text
recipient-owned belief/attribution/salience/preference/turnout state
+ eligibility and electoral geography
+ candidates and contest rules
→ election-process participation and ballots
→ result/certification
→ office/succession process
```

Media and information can affect inputs through valid exposure and recipient processes. They cannot choose the winner.

---

# 7. Media and journalism ownership contract

Media needs first-class Living Country treatment, but not a magical Media system.

## 7.1 Media organizations and journalists

Media organizations are autonomous institutional/organizational actors.

They may own:

- identity;
- editorial mission or orientation;
- audience strategy;
- geographic/subject focus;
- resources;
- staff and assignments at the selected resolution;
- source relationships;
- access relationships;
- operational priorities;
- investigation/publication/distribution decisions;
- reputation or credibility state where later justified.

Journalists or investigative teams become individualized actors when their identity, access, history, source relationships, judgment, or one investigative decision materially changes supported outcomes.

They do not own:

- underlying material or institutional truth;
- public belief;
- election results;
- a universal media agenda;
- guaranteed audience reach.

## 7.2 Sources, tips, leaks, and public records

A source may communicate an artifact or provide access to an existing record.

A leak does not create the underlying record. It creates an unauthorized or otherwise bounded access/distribution event involving that record or a copy/artifact derived from it.

A tip may be:

- accurate;
- mistaken;
- incomplete;
- self-interested;
- fabricated;
- unsupported until corroborated.

The tip artifact owns what the source said, not whether the allegation is true.

## 7.3 Investigation

Journalism may discover previously unpublicized evidence. It may not create the underlying misconduct, failure, condition, decision, or document because a term needs a scandal.

Required conceptual chain:

```text
observable anomaly, tip, filing, public record, source communication,
or prior reporting
→ journalist/outlet receives access
→ actor evaluates through role, editorial objective,
  source credibility, resources, legal/reputational risk,
  audience relevance, and current opportunities
→ actor chooses investigate, publish provisionally,
  seek corroboration, delay, refer, or ignore
→ investigative actions obtain interviews, records,
  observations, or corroboration where available
→ private investigative artifacts accumulate
→ outlet chooses publish, revise, correct, or abandon
→ story/correction enters distribution
```

**[DI — HARD INVARIANT LC-L13]** An investigation can make existing evidence newly observable. It cannot create the underlying event it purports to discover.

## 7.4 Editorial selection and framing

An outlet’s decision to cover or ignore something may depend on:

- its received information;
- evidence quality;
- geographic relevance;
- subject jurisdiction;
- audience interests;
- editorial orientation;
- access;
- resources;
- novelty;
- competition;
- perceived public consequence;
- source relationships;
- legal and reputational risk.

No global `MediaAttention` or story director may select whichever fact produces the best drama.

Different outlets may:

- ignore the same fact;
- emphasize different evidence;
- choose different frames;
- publish at different times;
- correct differently;
- reach different audiences.

## 7.5 Story, claim, evidence, and correction

A published story is an information artifact.

It may contain:

- reported facts;
- quoted claims;
- outlet or journalist analysis;
- uncertainty;
- source descriptions;
- links/references to public evidence;
- errors;
- omissions;
- framing.

A correction or update is a new/revised artifact relationship. It does not erase:

- the original publication;
- prior distribution;
- prior exposure;
- beliefs already formed;
- political action already taken.

## 7.6 Platforms and distribution institutions

A platform or distribution institution is an actor/institution, not the InformationEnvironment itself.

It may choose or operationally produce:

- ranking;
- recommendation;
- amplification;
- suppression/moderation where modeled;
- targeting;
- geographic or audience routing;
- distribution timing.

Its algorithm/rules may be configuration and institutional operational state. A ranking/distribution decision becomes an actor/institution action. The resulting availability/delivery records live in InformationEnvironment.

The platform does not own recipient notice or belief.

## 7.7 Local, national, partisan, trade, and niche information

The later media-depth design must determine which outlet identities require persistence and which can be represented as aggregate source classes.

This contract only requires that the model can distinguish where supported:

- national versus local/regional reach;
- general-interest versus trade/subject expertise;
- partisan/ideological orientation;
- differing source access;
- differing audience trust;
- differing investigative resources;
- fragmented distribution.

No assumption is made that every player must track hundreds of outlets.

## 7.8 Presidential relationship to media

The President/administration may create attempts such as:

- release evidence;
- hold a briefing;
- issue a statement;
- grant an interview;
- use a surrogate;
- refuse comment;
- challenge reporting;
- alter lawful access policy;
- refer a leak or legal issue through an appropriate route;
- communicate through agencies or public records.

The administration does not choose:

- whether an outlet investigates;
- whether it publishes;
- the headline or frame;
- who notices;
- what audiences believe;
- whether a correction repairs the effect;
- the election result.

## 7.9 Media-specific rejected shortcuts

Rejected:

```text
NewsSystem.generateScandal()
```

Rejected:

```text
negativeHeadline
→ approval -= 5
```

Rejected:

```text
outlet.publishes(story)
→ everyCitizen.received = true
```

Rejected:

```text
correction
→ priorBeliefEffect = deleted
```

Rejected:

```text
mediaNarrativeScore
→ CongressActs()
```

Rejected:

```text
journalistDiscoversFraud
```

without preexisting misconduct/evidence, source access, investigation, and publication provenance.

---

# 8. Layer D — Historical and calibration country

## 8.1 Definition

The historical/calibration layer explains why current state exists and preserves consequential past occurrences without becoming a second owner of current truth.

It includes relationships among:

- rules/content configuration;
- calibration artifacts and source provenance;
- baseline-inherited current state;
- historical records;
- generated actor backstory;
- forward-generated prehistory;
- player-era history;
- surviving legal, fiscal, institutional, material, informational, and political consequences.

## 8.2 History owns occurrence, not current state

**[RF]** Historical records own the fact that an event occurred. Current owners determine what remains true now.

Examples:

- a past election result does not own the current officeholder;
- a past vote does not own a current legislator’s preference;
- an enacted law’s history does not by itself resolve current legal applicability;
- a published story remains historical even after correction;
- a grant award does not imply a project is still active;
- a prior poll does not own current public opinion.

## 8.3 Four provenance-root classes

The following are leading Living Country categories, not yet a final calibration-date decision.

### Baseline-inherited root

A fact is initialized from historically established pre-divergence institutional, legal, material, demographic, geographic, fiscal, or international inheritance.

Its causal chain may legitimately terminate at an authenticated baseline root rather than simulating every earlier event.

### Generated-backstory root

A pre-start synthetic record used to reconcile generated actors, organizations, relationships, or political institutions with the baseline state.

It must be compatible with offices, elections, geography, party context, and other historical facts.

### Forward-generated root

A fact produced by lower/selective-resolution causal simulation after divergence and before full player-era play.

### Player-era root

A fact produced during the full presidential simulation after the player assumes office.

## 8.4 Calibration is historically closed once the run diverges

**[DI — HARD INVARIANT LC-L14]** Once a scenario’s divergence begins, later real-world developments may not overwrite that run’s canonical state.

A future calibration package may produce a different scenario version. It does not rewrite an existing alternate-history world.

## 8.5 Generated actors and real inherited history

Generated political actors must not be falsely credited with real pre-divergence individual acts merely because they occupy corresponding offices in the synthetic baseline.

A clean seam is:

- real institutional, legal, material, fiscal, geographic, and demographic history may remain baseline inheritance;
- generated actors receive synthetic careers/backstory reconciled to the starting offices and relationships;
- pre-divergence laws may be institutionally attributed without fabricating complete individual roll-call histories for generated people;
- individual historical actions are attributed to generated actors only when those actions belong to generated history.

This principle is accepted here as an ownership safeguard. The final calibration seam/date remains unresolved.

## 8.6 Lower-resolution prehistory does not receive special ownership privileges

Compression may omit intermediate detail. It cannot reverse ownership.

A compressed generated law still requires:

- an initiating actor/institution;
- a legislative/procedural route;
- an outcome;
- operative legal terms;
- enactment or failure provenance.

A compressed program still requires:

- authority;
- funding where relevant;
- administrator;
- participation;
- implementation state;
- material consequences through material owners.

A compressed court history still requires:

- case/proceeding;
- jurisdiction and actors;
- ruling/order;
- legal consequence.

## 8.7 Historical memory is not automatic omniscience

A fact’s existence in HistoricalRecord does not mean every actor knows or remembers it.

Current actor/population memory and knowledge require:

- direct participation;
- accessible records;
- received artifacts;
- institutional transfer/access;
- public availability and exposure;
- purpose-bounded memory rules.

A player-facing history view is access-bounded during live play.

## 8.8 Historical-layer prohibitions

The historical/calibration layer may not:

- mutate current state because a historical summary says it should;
- fabricate a causal chain backward from a desired 2033 issue;
- treat generated backstory as unconstrained flavor text;
- attribute real personal acts to fictional actors without a valid generated-history basis;
- overwrite a diverged world with later real data;
- expose every historical truth to every actor;
- use a single `historyScore` to determine current political behavior.

---

# 9. Ownership matrix

The following matrix freezes semantic distinctions before later Living Country design deepens them.

| Fact or process | Canonical owner | May reference/measure/react | Explicitly not the owner |
|---|---|---|---|
| Current date/time | TimeState | scheduler, UI, every domain | UI clock, event index |
| Spatial identity/boundary/topology | GeographyState | population, domains, jurisdictions, elections, UI | jurisdiction, population, map projection |
| Ordinary population identity/weight/residence/core demographic state | PopulationState | domains, programs, elections, information, UI | geography, electoral district, media audience list |
| Domain-specific material condition | relevant MaterialDomain | institutions, population processes, measurement, UI | law, program, report, political issue |
| Population material exposure relation | relevant material owner plus population/geography references according to later domain contract | information, institutions, political response | media story, poll |
| Individual political actor identity/private current state | PoliticalActor state | institutions, organizations, staff projections | office, party, biography projection |
| Organization identity/membership/resources/strategy | Organization state | actors, institutions, media, UI | individual member, electorate |
| Jurisdiction/institution/office/assignment | PoliticalOrder subdivisions | actors, procedures, UI | geography or player session |
| Legal source/order/authority | LegalOrder/Judicial state | administration, courts, programs, forecasts | material domain, media artifact |
| Procedure state | relevant procedure owner | participating actors/institutions | proposal card, historical result |
| Fiscal authority | legal/fiscal authority state | OMB, Treasury, programs, forecasts | cash balance, material outcome |
| Cash/debt/obligation/payment | public-finance/fiscal execution owners | programs, forecasts, measurement | law alone, UI budget meter |
| Program eligibility/award/administrative state | program/administrative owner | states, recipients, material domains | material outcome |
| State participation or refusal | state political/administrative owner or intergovernmental relationship as applicable | federal program, projections | federal dashboard |
| Media organization identity/resources/editorial strategy | media organization/institution | journalists, artifacts, projections | underlying truth, public belief |
| Journalist identity/private judgment/source relationships | actor/relationship owners | outlet, information artifacts | story truth, public belief |
| Tip/leak/interview/statement | information artifact and access/distribution state | journalists, actors, population recipients | underlying allegation’s truth |
| Investigation task/assignment | media organization/institutional operational state | journalist actors, information artifacts | underlying misconduct |
| Obtained document/evidence copy | information artifact referencing original owner/provenance | journalists, courts, Congress, public where released | original record’s current owner |
| Published story/headline/claim/correction | InformationEnvironment artifact | outlets/platforms distribute; recipients interpret | condition, belief, election |
| Publication/ranking/distribution decision | relevant outlet/platform actor or institution | InformationEnvironment records delivery | audience belief or notice |
| Availability/delivery/exposure occurrence record | InformationEnvironment | population/actors update recipient state | media actor’s belief, population belief |
| Recipient notice/retention/trust/belief/attribution/salience | PopulationState, PoliticalActor, or genuine Organization state | polls, elections, actor decisions | outlet, story, poll |
| Poll | measurement process + information artifact | campaigns, media, actors, UI | population political state, election |
| Election process/result/certification | Electoral process/history | office-transfer process, reporting | poll, media, current office assignment |
| Current office assignment | OfficeAndAssignment state | ControlBinding, institutions, UI | election result alone |
| Historical occurrence | HistoricalRecord or persistent domain/procedure record | biographies, records, projections, actor memory when accessible | current state owner |
| Calibration artifact/source version | Rules/content configuration and provenance | initialization, audit | live mutable current state |
| Workstream | derived player-facing projection | references all relevant owners | every underlying fact |
| Political issue label/ranking | perspectival derived projection/artifact | staff, media, parties, player | canonical domain condition or universal salience |
| State of the Nation | access-bounded derived projection and persisted artifacts where applicable | player/admin actors | hidden canonical world truth |

---

# 10. Cross-layer causal transaction contract

## 10.1 General form

**[DI — HARD INVARIANT LC-L15]** A cross-layer effect must preserve sender ownership, an explicit transmitted input or action, receiver admission, receiver-owned mutation, and observable history.

```text
source owner changes or acts
→ source-owned output/action/record exists
→ permitted reference, delivery, legal, fiscal,
  administrative, material, or informational route
→ target owner receives/admit input
→ target owner resolves its own state change
→ historical/observable consequences
```

A source domain may not edit the target directly.

## 10.2 Institutional action into material country

```text
law or executive/administrative attempt
→ valid legal/administrative/fiscal inputs
→ agency/state/recipient actions
→ material domain receives actual inputs
→ material domain resolves outcomes over time
```

## 10.3 Material country into politics

```text
material condition or direct experience
→ measurement, report, source communication,
  visible event, or recipient experience
→ actor/population receives bounded information
→ recipient-owned interpretation and action
```

Material truth does not automatically become political salience.

## 10.4 Journalism into public politics

```text
preexisting evidence or discoverable record
→ journalist/outlet investigation and publication decision
→ story artifact
→ platform/outlet distribution
→ delivery/exposure occurrence
→ recipient notice/belief/attribution/salience process
→ later political or electoral behavior through its owner
```

## 10.5 Population into government

Population affects government through specific processes, including where modeled:

- constituent communications;
- organization participation;
- protest/mobilization;
- labor/market behavior;
- elections;
- service/program participation;
- direct material behavior.

No national public-opinion scalar directly commands Congress or the President.

## 10.6 History into current decisions

Past occurrences influence current behavior only through surviving current facts or accessible memory/information.

Examples:

- a statute remains operative;
- a commitment remains active or remembered;
- an actor recalls betrayal;
- a public story remains accessible;
- a program still has obligations;
- a material project still exists;
- a court order remains effective;
- a population group retains belief or salience.

The mere existence of a historical record does not automatically alter every actor.

---

# 11. Derived integrators must remain projections

## 11.1 Workstreams

The accepted Step 5 workstream may combine references across all four layers:

- objective;
- relevant conditions;
- actors and institutions;
- law and fiscal state;
- implementation;
- states and places;
- information/public interpretation;
- deadlines;
- history.

It owns none of them.

## 11.2 Political issues

A political issue is a perspectival grouping of conditions, exposure, actor attention, organization action, information, attribution, salience, and opportunity.

There is no canonical issue importance score that causes the grouped facts.

Different observers may construct different issue projections from the same world.

## 11.3 State of the Nation

The later State of the Nation may integrate:

- official measurements;
- accessible institutional records;
- staff assessments;
- known condition trends;
- geography and population exposure;
- fiscal/legal state;
- major public and political interpretations.

It may not read hidden canonical truth directly unless the controlled administration has legitimate exact access to that fact.

## 11.4 Actor dossiers

A dossier may show:

- role and office;
- public actions and positions;
- known relationships and commitments;
- constituency and institutional context;
- staff assessments with confidence;
- accessible history.

It may not expose exact hidden motives, private knowledge, or guaranteed future choices.

## 11.5 Player Record versus developer audit

The live player Record remains access-bounded.

A developer/audit state may inspect canonical truth for verification. That state is not the player interface and cannot be used as evidence that the game is legible under bounded knowledge.

---

# 12. Layer interaction examples

These examples establish ownership, not final domain depth.

## 12.1 Employment deterioration

```text
Labor/Economy owner:
  employment and job-flow conditions change

Population/material linkage:
  specific populations and places experience consequences

Measurement owner:
  labor survey/administrative records capture lagged observations

Information artifact:
  official release reports measured deterioration

Institutional actors:
  governors, lawmakers, unions, firms, and agencies interpret
  through bounded information and their own objectives

Media actors:
  local/national outlets choose investigation, coverage, framing,
  delay, or noncoverage

InformationEnvironment:
  artifacts become available/distributed to fragmented audiences

Population/actor owners:
  notice, belief, attribution, salience, and political action change
  where their processes admit the inputs

Administration:
  receives reports, communications, reporting, and staff analysis

President:
  derives authority-grounded options through the accepted Step 5 grammar
```

No layer owns the whole chain.

## 12.2 Investigative reporting about an implementation failure

```text
Program/material owners:
  failure or misconduct already exists

Observable basis:
  inconsistent payment record, source tip, audit anomaly,
  public filing, or visible material result

Media actor:
  receives basis and independently chooses investigation

Investigation:
  obtains records/interviews/corroboration

Information artifact:
  story or finding is published with provenance and uncertainty

Distribution:
  outlets/platforms create delivery records

Recipients:
  different audiences notice, believe, reject, or attribute differently

Congress/IG/opposition:
  may independently initiate oversight or action

White House:
  learns through valid channels and derives response options
```

The story discovers or reports. It does not create the underlying failure.

## 12.3 Poll and election

```text
Population political state
→ poll measurement method/sample
→ poll artifact
→ possible publication/distribution/exposure
→ possible recipient response

separately:

population eligibility/preference/turnout state at election
+ candidates, geography, and law
→ election process
→ ballots/result/certification
→ office transfer where legally resolved
```

The poll is not an election forecast that becomes true by display.

---

# 13. Adversarial ownership tests

A future Living Country design fails Step 1 if any of the following can occur.

## Test 1 — Law directly owns condition

```text
law enacted
→ unemployment automatically falls
```

**Reject.** Law creates authority/rules. Material owners resolve consequences.

## Test 2 — Media owns belief

```text
story published
→ audience believes story
```

**Reject.** Distribution/exposure and recipient-owned belief processes intervene.

## Test 3 — Poll owns electorate

```text
poll = 52%
→ population preference = 52%
```

**Reject.** Poll measures population state; it does not write it.

## Test 4 — Election is an information result

```text
media narrative winner
→ election winner
```

**Reject.** Elections remain institutional processes.

## Test 5 — Historical record owns current state

```text
actor voted YEA in 2029
→ actor supports proposal in 2033
```

**Reject.** Current actor state and accessible memory determine later decisions.

## Test 6 — Calibration remains a live owner

```text
2025 baseline value
→ current 2030 value overwritten every update
```

**Reject.** Calibration initializes; current domain owns evolution.

## Test 7 — Generated actor receives false real history

```text
fictional senator credited with an actual 2024 roll-call
```

**Reject** unless that act is explicitly reconstructed as synthetic generated history rather than asserted as the real historical person’s act.

## Test 8 — Geography owns residents

```text
state.populationCopy mutates separately
```

**Reject.** Population owns residence; geographic/state totals are derived or measured.

## Test 9 — Firm action directly owns aggregate politics

```text
firm announces closure
→ state voters oppose incumbent
```

**Reject.** Actual closure/employment consequences, observation, attribution, and population response remain separate.

## Test 10 — Journalism creates scandal

```text
outlet needs major story
→ misconduct record created
```

**Reject.** Evidence and underlying occurrence must preexist or emerge through proper owners.

## Test 11 — Correction rewinds history

```text
correction published
→ original exposure and belief consequences deleted
```

**Reject.** Revision is additive/provenance-bearing.

## Test 12 — Platform owns recipient attention

```text
platform recommends artifact
→ all targeted recipients notice and remember it
```

**Reject.** Delivery differs from recipient notice/retention.

## Test 13 — Workstream becomes policy owner

```text
workstream.status = SUCCESS
→ law, program, condition, and approval updated
```

**Reject.** Workstream is a projection.

## Test 14 — Political issue object causes salience

```text
IssueImportance = 82
→ media, Congress, voters, and President prioritize issue
```

**Reject.** Their separate state and information create perspectival importance.

## Test 15 — Historical layer grants omniscience

```text
fact exists in HistoricalRecord
→ administration knows it
```

**Reject.** Access, transfer, publication, exposure, direct participation, or investigation is required.

---

# 14. Step 1 conclusions

## 14.1 Four-layer model

The four-layer split is retained as a useful Living Country design frame:

```text
Material and social country
Institutional and political country
Information and public-political country
Historical and calibration country
```

It does not supersede accepted canonical roots or fact-level ownership.

## 14.2 Media ownership

The mandatory ownership split is:

```text
media organizations and journalists
    autonomous institutional/political actors

stories, claims, evidence copies, reports, corrections, polls
    information artifacts

outlet/platform publication and distribution choices
    actor/institution actions

availability, delivery, and exposure-occurrence records
    InformationEnvironment

recipient notice, memory, trust, belief, attribution, salience,
preference, and turnout disposition
    PopulationState or relevant actor/organization recipient

elections and office transfer
    electoral and institutional processes
```

No media layer owns this entire chain.

## 14.3 Material ownership

America’s actual conditions remain distributed among semantic material/social owners. There is no universal national-indicator state whose direct modification constitutes policy effect.

## 14.4 Institutional ownership

Governmental and private actors retain independent identity, authority, objectives, information, initiative, action records, and procedures. Their actions do not automatically produce material or public outcomes.

## 14.5 Historical ownership

Causal chains may terminate at authenticated baseline inheritance. Generated backstory, forward-generated history, and player-era history remain distinguishable. Historical records never become substitute current-state owners.

## 14.6 Projection ownership

Workstreams, political issues, State of the Nation, actor dossiers, dashboards, and historical summaries remain derived/access-bounded views.

---

# 15. Questions deliberately deferred

This Step 1 contract does not decide:

1. which material/social domains exist in the first product;
2. whether economy, labor, income, prices, industry, and trade are one domain or several coordinated owners;
3. exact population/cohort resolution;
4. exact geographic resolution beneath state/district level;
5. which firms, unions, media outlets, journalists, agencies, or local governments require individualization;
6. exact media-market, platform, investigation, source, trust, or belief formulas;
7. exact historical calibration date;
8. exact baseline source cutoff;
9. exact generated-prehistory duration or resolution;
10. final State of the Nation information design;
11. final six-surface UI authority;
12. exact cross-domain couplings;
13. Early Access depth or scope;
14. implementation architecture or roadmap.

Those questions belong to later Living Country steps.

---

# 16. Step 1 review gate

A detached review of this candidate should ask:

> **Does every major kind of Living Country fact have a non-overlapping semantic owner, and can material conditions, institutions, media, recipient belief, elections, history, and player-facing projections interact without any layer becoming a shadow owner or omniscient god system?**

PASS requires:

- the four layers remain conceptual rather than new canonical roots;
- fact-level ownership remains compatible with accepted architecture;
- media actor, artifact, distribution, exposure, belief, polling, election, and office-assignment facts remain distinct;
- one canonical population can participate across domains without becoming a god object;
- calibration/history cannot shadow-own current state;
- cross-layer effects use explicit sender/output/receiver/resolution chains;
- workstreams/issues/State of the Nation remain projections;
- the rejected shortcuts remain impossible under the contract.

A PASS would authorize the next Living Country task:

> **Define the common country-state grammar that every durable material/social domain must satisfy before assigning domain-specific depth.**

It would not accept the whole Living Country design.