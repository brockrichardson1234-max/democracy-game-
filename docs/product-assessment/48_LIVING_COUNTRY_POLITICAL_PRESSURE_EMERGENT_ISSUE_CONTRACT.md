# Living Country Step 9 — Political Pressure and Emergent Issue Formation

Status: **LIVING-COUNTRY STEP-9 DESIGN CANDIDATE — PRESERVED FOR DETACHED REVIEW. NOT ACCEPTED PRODUCT, ARCHITECTURE, ISSUE-ALGORITHM, PARTY, CAMPAIGN, ELECTION, UI, CALIBRATION, ROADMAP, EARLY-ACCESS, SCHEMA, RUNTIME, OR IMPLEMENTATION AUTHORITY.**

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
- Assessment branch tip before this candidate: `9ecb41c69d3095bbd5eee46d1da1952b172decfa`

This is Living Country **Step 9**. It answers:

> **How do material and social conditions, institutional conflicts, autonomous actor initiatives, organizations, evidence, media selection, fragmented recipient exposure, belief, attribution, salience, electoral incentives, and governing opportunity combine to create, intensify, regionalize, nationalize, split, merge, fade, displace, or revive political issues—without a canonical `IssueImportance` score, one national agenda, a hidden drama director, or every severe condition automatically reaching the President?**

It does not:

- choose a final issue-classification ontology or one universal issue runtime object;
- choose final party, faction, campaign, lobbying, protest, donation, primary, turnout, or election algorithms;
- choose final domain inventory, media inventory, institutional agenda procedures, historical calibration, generated-prehistory implementation, UI, Early Access scope, roadmap, implementation order, or next code proof;
- authorize runtime, schema, source, configuration, test, data, or production changes.

---

# Evidence labels

- **[RF — Repository fact]**: established by accepted repository evidence, accepted assessment authority, or the frozen production baseline.
- **[ER — External research]**: supported by a primary, official, or peer-reviewed source listed in Section 31.
- **[DI — Design inference]**: proposed Step 9 contract requiring detached review.
- **[UQ — Unresolved question]**: deliberately deferred.

A design inference does not become repository fact merely because it is recorded here.

---

# 1. Executive design verdict

## 1.1 Central answer

**[DI]** Living Country should represent political issues as:

> **Context-specific, provenance-bearing projections over separately owned conditions, evidence, problem frames, affected populations and places, actor and organization priorities, directed political demands, institutional agendas and venues, policy alternatives, electoral incentives, and governing opportunities—not as canonical world objects that own importance, politics, or outcomes.**

The broad relationship is:

```text
material/social/legal/institutional/external state
→ lived exposure, operational consequence, record, measurement, or evidence
→ bounded actor, organization, outlet, institution, or population receipt
→ interpretation through role, values, beliefs, objectives,
  expectations, relationships, constituency, and uncertainty
→ problem frame, responsibility claim, demand, priority,
  agenda adoption, organization activity, or deliberate non-action
→ media, party, legislative, state, judicial, administrative,
  electoral, or public-political activity
→ fragmented recipient belief, attribution, salience,
  willingness, and political conduct
→ changing institutional opportunities, constraints, and agendas
→ administration receipt and bounded assessment
→ possible presidential workstream, response, monitoring, or inaction
```

No arrow is automatic.

The same condition may sustain several incompatible political issues.

The same issue label may hide different conditions, frames, demands, affected populations, and venues.

A materially severe condition may remain politically quiet.

A materially small occurrence may become politically consequential.

A President may try and fail to elevate an issue.

An issue may dominate media coverage while remaining absent from Congress.

Congress may act on an issue that most voters barely notice.

A governor may treat a regional problem as urgent while the White House sees weak national evidence.

## 1.2 Product role

The Step 9 layer exists to make political conflict and opportunity emerge from the accepted Living Country rather than from a scenario writer selecting a topic.

It should permit presidential situations such as:

- a worsening labor-market condition being framed by different actors as automation displacement, trade failure, regional neglect, energy-cost pressure, or normal adjustment;
- a state-level Housing implementation dispute becoming nationally salient only after governors, organizations, journalists, and congressional committees create bridges;
- Congress placing an issue on its agenda before the public treats it as important;
- a party emphasizing an issue because it is electorally advantageous even though the underlying condition is modest;
- a serious condition remaining politically weak because it is poorly measured, diffusely experienced, weakly organized, or difficult to attribute;
- a President emphasizing an issue without persuading media, lawmakers, organizations, or voters to treat it as urgent;
- an enacted program creating visible beneficiaries and organized defenders in one run while remaining obscure and politically unrewarding in another;
- one broad controversy splitting into several disputes with different actors, venues, evidence, and solutions;
- separate issues being deliberately bundled into one legislative or campaign frame without their underlying state being merged;
- a faded issue returning because new evidence, a court ruling, a crisis, an implementation failure, or a changed coalition reactivates it.

## 1.3 Deletion rule

Retain an issue, agenda, pressure, framing, or venue distinction only when deleting it would make at least one supported difference impossible or materially incoherent, including:

- different actors treating the same condition differently;
- different populations caring about different aspects of one domain;
- different institutional venues becoming available;
- a demand, commitment, threat, endorsement, lawsuit, hearing, protest, or campaign appeal affecting later action;
- an issue splitting, merging, regionalizing, nationalizing, fading, or returning;
- a President facing a different decision because political opportunity or opposition changed;
- historical actors later remembering what was promised, ignored, framed, or contested.

Do not persist an issue object merely because a dashboard needs a row.

---

# 2. Repository reality and inherited contracts

## 2.1 What the accepted design already establishes

**[RF]** The accepted presidential-game authority already establishes:

- durable domains and canonical conditions remain distinct from political issues;
- political issues are emergent and perspectival;
- there is no canonical Top Five Issues object;
- workstreams are player-facing projections rather than world owners;
- presidential attention requires a valid information and administration route;
- autonomous actors and institutions initiate activity independently;
- the player cannot directly set public belief, other actors' priorities, congressional schedules, or election outcomes.

**[RF]** Living Country Steps 1–8 establish:

- exact semantic ownership of underlying state;
- one population with recipient-owned belief, attribution, salience, preference, memory, and turnout disposition;
- autonomous actors and organizations with bounded knowledge and institution-specific action routes;
- an internal administration that routes evidence and decisions without becoming a god system;
- typed cross-domain causal handoffs;
- versioned, uncertain evidence production;
- autonomous media selection, proposition-aware claims, fragmented distribution, recipient cognition, and independent political action.

## 2.2 What remains absent

**[RF]** The accepted baseline and authority do not yet define a commercial model for:

- issue-frame identity and lineage;
- context-specific issue projections;
- agenda adoption and removal across actor families;
- directed political pressure and demand aggregation;
- venue selection and venue shopping;
- political opportunity/window formation;
- issue competition, bundling, splitting, and displacement;
- party/candidate issue association and competence reputation;
- policy feedback into constituencies, organization, and issue persistence;
- how an issue becomes a White House workstream without directly interrupting the President;
- how the player understands whose issue it is and why it matters.

Step 9 supplies those semantic contracts without choosing final algorithms.

---

# 3. Ownership distinctions that may not collapse

## 3.1 Canonical condition or occurrence

A material, social, fiscal, legal, administrative, institutional, population, actor, or external owner owns what is actually true or what actually happened.

Examples:

- layoffs occurred;
- rent burden rose;
- an agency missed a deadline;
- a court issued an order;
- a governor refused participation;
- a platform presented a claim;
- a protest occurred;
- Congress scheduled a hearing.

A political issue projection does not own any of these facts.

## 3.2 Evidence or measurement

Evidence and measurement processes own what was recorded, estimated, observed, alleged, forecast, or assessed under Steps 7 and 8.

Evidence does not own political importance.

## 3.3 Proposition or claim

A proposition identifies what is asserted, denied, predicted, blamed, credited, demanded, or evaluated.

A claim may be true, false, misleading, uncertain, normative, causal, attributive, or mixed.

A claim does not become a political issue merely by existing.

## 3.4 Problem frame

A **problem frame** is an actor-, organization-, media-, institution-, or population-context interpretation that links some combination of:

- observed or believed condition;
- expectation, baseline, value, duty, right, promise, or standard;
- affected population, place, institution, or interest;
- asserted cause or responsibility;
- urgency or future risk;
- desired response, venue, or solution family;
- uncertainty and evidence.

A frame is not canonical truth.

Different actors may frame the same condition differently.

## 3.5 Political issue projection

A **political issue projection** is a versioned, context-specific coordination view that groups relevant:

- referent conditions/occurrences;
- evidence and claims;
- problem frames;
- affected populations and geographies;
- active actors and organizations;
- directed demands and pressure attempts;
- institutional venues and agenda state;
- policy alternatives or governing routes;
- public belief, attribution, and salience estimates;
- electoral and temporal context;
- uncertainty and history.

It owns only its identity, producer/context, grouping rationale, version, lineage, and projection metadata.

It may not mutate or become the owner of any referenced fact.

## 3.6 Agenda entry

An agenda entry is context-owned current state or a projection over such state.

Examples:

- an organization adopts a priority through its governance;
- a party adopts a platform or campaign emphasis;
- a committee schedules a hearing;
- a chamber leader allocates floor time;
- an outlet allocates coverage;
- a governor creates a task force;
- the White House creates or elevates a workstream;
- a population segment treats a proposition as salient;
- a poll estimates public priority.

These are different fact families.

There is no universal agenda-entry owner.

## 3.7 Political demand or pressure attempt

A political demand, request, threat, endorsement, mobilization, contribution, lobbying contact, strike, protest, lawsuit, hearing, investigation, communication, or electoral signal is an actor-, organization-, population-, market-, or institution-owned occurrence.

The later effect belongs to the receiver or relevant procedure.

## 3.8 Policy alternative or solution

A proposed law, administrative route, budget plan, court theory, state action, organizational demand, or other solution remains owned by its proposer, proposal process, law, institution, or procedure.

A political issue does not own the solution.

A solution may exist before the issue becomes salient.

An issue may have no viable solution.

## 3.9 Institutional proceeding or venue

A hearing, bill, rulemaking, lawsuit, election, budget vehicle, agency review, state program, local ordinance, party process, or media investigation remains with its proper institutional owner.

The issue projection may reference it.

It does not control it.

## 3.10 Administration workstream

A White House workstream is an administration-owned/player-facing coordination projection over accepted facts, actors, assignments, and objectives.

It is not the political issue itself and does not make other actors care.

---

# 4. No canonical issue object or identity

## 4.1 Core invariant

**[DI — HARD INVARIANT LC-ISS01] There is no single canonical political-issue object whose identity, importance, scope, salience, ownership, lifecycle, and ranking are authoritative for every actor, population, institution, and interface.**

The world may retain:

- durable domain and condition identities;
- proposition and frame identities;
- actor/organization agenda records;
- institutional schedule and proceeding identities;
- versioned issue projections;
- historical links among them.

It may not create one `Issue: Housing` record that directly owns what Housing means politically for everyone.

## 4.2 Same label does not prove same issue

The label `Housing crisis` may refer to:

- rents;
- purchase affordability;
- homelessness;
- zoning and construction supply;
- mortgage credit;
- disaster recovery;
- federal grant implementation;
- neighborhood displacement;
- institutional investors;
- regional population growth.

Two actors using the same label may assert different causes, affected groups, time horizons, and solutions.

## 4.3 Different labels may overlap

`Industrial decline`, `automation displacement`, `trade shock`, `regional unemployment`, and `cost-of-living crisis` may share some underlying occurrences while remaining semantically and politically distinct.

A projection may record relationships such as:

- likely same frame;
- overlapping referents;
- subset/superset;
- competing causal attribution;
- bundled for one venue;
- historically derived/reframed;
- unclear or unsupported relationship.

The relationship requires provenance.

## 4.4 Projection context

Every load-bearing issue projection must identify:

- producer or projection owner;
- intended consumer/context;
- effective/as-of time;
- referenced conditions, evidence, propositions, frames, actors, demands, and venues;
- affected population/geography support;
- uncertainty and known omissions;
- grouping and comparison method;
- lineage to prior projections where retained;
- whether the label is actor language, staff shorthand, media shorthand, or generated navigation text.

## 4.5 Cross-context reconciliation

**[DI — HARD INVARIANT LC-ISS02] Issue projections from different contexts may not be treated as identical, additive, or contradictory merely because labels or referents overlap.**

A public-priority estimate, party campaign theme, committee agenda, media-coverage cluster, and White House workstream may concern related facts while remaining separate state.

A later cross-context comparison must preserve:

- source context;
- frame/proposition meaning;
- population/geography;
- time;
- support status;
- agenda/pressure/coverage basis;
- overlap and uncertainty.

---

# 5. Political relevance dimensions remain separate

## 5.1 Core invariant

**[DI — HARD INVARIANT LC-ISS03] Material severity, prevalence, trend, direct experience, evidence strength, public salience, attitude importance, cognitive accessibility, emotional intensity, actor priority, organization mobilization, media attention, political pressure, urgency, feasibility, institutional agenda status, decision readiness, electoral consequence, and presidential attention are distinct facts or projections.**

No one dimension may silently stand in for the others.

## 5.2 Material severity

Severity concerns the condition or harm under the relevant domain and scale.

It is not political importance.

## 5.3 Prevalence and concentration

A condition may affect many people modestly or a smaller group intensely.

National averages may conceal concentrated regional or social exposure.

Concentration can increase organization or electoral leverage but does not guarantee it.

## 5.4 Evidence strength and observability

A severe condition may be weakly measured.

A modest occurrence may be highly visible and well documented.

Evidence strength does not dictate political response.

## 5.5 Salience

Salience is recipient-owned and proposition/frame-specific where needed.

It concerns what is mentally prominent or currently important to the recipient.

It is not the recipient's policy position, causal attribution, or voting decision.

## 5.6 Attitude importance and accessibility

A person may consider a view deeply important even when it is not currently prominent in the news.

Repeated recent presentation may make an issue cognitively accessible without making it personally important.

The final psychological representation remains deferred.

## 5.7 Actor and organization priority

An actor or organization may prioritize a matter because of duty, constituency, ideology, membership, strategy, relationships, resources, or opportunity.

Priority is owned by that actor or organization through a valid decision process.

## 5.8 Media attention

Media attention is a projection over coverage and presentation choices by outlets, journalists, and platforms.

It does not own public salience or political importance.

## 5.9 Directed political pressure

Pressure is a summary over actual directed attempts, constraints, commitments, threats, mobilization, deadlines, and receiver state.

It is not a free-floating national force.

## 5.10 Urgency

Urgency concerns time-sensitive consequence, deadline, deterioration, or opportunity as understood by a bounded actor or institution.

A long-term severe issue may be important but not immediately urgent.

A narrow procedural deadline may be urgent but not nationally salient.

## 5.11 Feasibility and decision readiness

An issue can be salient but lack an available route.

A technically ready policy can exist without political support.

A decision can be ready because evidence, authority, and options are sufficient even while public attention remains low.

## 5.12 Electoral consequence

Electoral consequence depends on affected electorates, turnout, belief, attribution, candidate/party evaluation, and contest context.

It is not equal to public salience.

## 5.13 Presidential attention

Presidential attention remains governed by Step 5 administration receipt and escalation.

An issue projection cannot directly stop time.

---

# 6. Plural agenda contract

## 6.1 No national agenda owner

**[DI — HARD INVARIANT LC-ISS04] There is no single canonical national agenda.**

The game may produce bounded projections of several agendas.

None automatically commands another.

## 6.2 Public agenda

The public agenda is a measurement or projection over heterogeneous population-owned salience, importance, concern, willingness, or response.

It must preserve:

- target population;
- question/measure;
- time;
- geography;
- proposition/frame;
- distribution rather than one hive-mind position;
- measurement uncertainty;
- subgroup differences.

A poll asking `most important problem` does not create the public agenda and may not measure every meaning of salience.

## 6.3 Media agenda

A media agenda is a projection over outlet-specific and channel-specific coverage, prominence, repetition, investigation, and presentation.

It does not mean every outlet coordinated or every audience noticed.

## 6.4 Congressional and legislative agendas

Congressional agenda state may include:

- introduced proposals;
- committee priorities;
- hearings and investigations;
- leadership commitments;
- floor schedules;
- appropriations vehicles;
- nominations;
- caucus/faction priorities.

The aggregate `Congressional agenda` is a projection over those separately owned facts.

Congress may have several simultaneous and conflicting agendas.

## 6.5 Executive and agency agendas

An agency may have statutory duties, rulemaking plans, enforcement priorities, program queues, litigation obligations, and leadership initiatives.

The White House may have workstreams, public priorities, appointments, legislative objectives, and monitoring instructions.

Those remain separate.

## 6.6 State and local agendas

Governors, legislatures, attorneys general, mayors, agencies, and associations may adopt or pursue different issue priorities.

A multistate coalition requires real coordination or shared action.

## 6.7 Party, faction, campaign, and organization agendas

A party or organization agenda requires an adopted position, leadership decision, member process, campaign strategy, resource allocation, or other valid owner state.

A faction's priority does not automatically become the party's priority.

A campaign's emphasis does not automatically become the governing party's institutional agenda.

## 6.8 White House monitoring is not adoption

Press monitoring, a staff memo, or Country Watch visibility does not automatically create an administration priority or workstream.

The administration may know about an issue and choose not to adopt it.

---

# 7. Agenda adoption, revision, and removal

## 7.1 Adoption chain

**[DI — HARD INVARIANT LC-ISS05] A consequential actor, organization, party, campaign, outlet, or institution agenda entry requires a valid owner-specific adoption, scheduling, allocation, governance, or decision process.**

General form:

```text
bounded information, experience, duty, relationship, or opportunity
→ actor/organization/institution interpretation
→ available agenda action
→ priority, schedule, resource-allocation, position,
  workstream, investigation, or monitoring decision
→ owner-held agenda state or occurrence
```

The issue projection itself may not write the agenda entry.

## 7.2 Revision and removal

An agenda entry may be:

- elevated;
- narrowed;
- broadened;
- reframed;
- delegated;
- scheduled;
- delayed;
- displaced;
- withdrawn;
- fulfilled;
- defeated;
- superseded;
- allowed to expire;
- retained as monitoring only.

The change requires a valid owner process or rule.

## 7.3 Quiet non-adoption

An actor may know and care but decline to act because:

- no viable venue exists;
- resources are committed elsewhere;
- evidence is weak;
- the issue is electorally risky;
- another actor owns the duty;
- the organization is divided;
- the deadline has not arrived;
- delay is strategic;
- the condition is important but not actionable.

Non-adoption is valid political state.

---

# 8. Problem recognition and framing

## 8.1 Condition is not automatically a problem

A condition becomes a political problem for a particular actor or population only through some combination of:

- direct experience;
- bounded observation or evidence;
- comparison to expectation, baseline, right, duty, promise, value, or risk threshold;
- attribution;
- identity or group relevance;
- organization interpretation;
- institutional responsibility;
- forecasted consequence;
- available response.

## 8.2 Frame declaration

A load-bearing problem frame should be able to identify, where relevant:

- framing owner/context;
- referenced condition/occurrence/evidence;
- proposition family;
- affected population/place/institution;
- comparison standard or violated expectation;
- asserted cause/responsibility;
- moral, legal, economic, security, distributional, or procedural meaning;
- time horizon and urgency;
- proposed venue or response family;
- uncertainty and omitted alternatives;
- public/private/adopted status;
- lineage to earlier frames.

These are semantic obligations, not one technical schema.

## 8.3 False or misleading frames

A frame may be politically consequential even when:

- its factual premise is false;
- its causal attribution is unsupported;
- its evidence is weak;
- its magnitude is exaggerated;
- its proposed solution would not address the actual condition.

The political consequence remains real through belief and action.

The frame does not make the underlying claim true.

## 8.4 Responsibility and blame

Belief that a condition exists does not establish agreement about:

- cause;
- responsible institution;
- responsible officeholder;
- whether government can solve it;
- whether action is desirable;
- which level of government should act.

Attribution remains recipient-owned.

---

# 9. Directed political pressure contract

## 9.1 No pressure scalar

**[DI — HARD INVARIANT LC-ISS06] Political pressure is not one universal quantity attached to an issue, actor, or President.**

A player-facing summary may say pressure is broad, concentrated, escalating, or weak only when derived from actual sources, targets, instruments, resources, timing, and receiver state.

## 9.2 Pressure families

Potential pressure attempts include:

- constituent contacts;
- member or governor requests;
- legislative bargaining and vote conditions;
- organization lobbying;
- public endorsement or opposition;
- campaign advertising and messaging;
- fundraising and contribution decisions;
- donor or activist threats;
- primary recruitment or challenge;
- protest, petition, boycott, strike, or collective action;
- lawsuit, filing, injunction request, or legal demand;
- oversight request, subpoena, hearing, or investigation;
- regulatory petition or comment;
- media inquiry and investigative publication;
- platform campaign or coordinated sharing;
- market exit, investment, closure, relocation, or refusal;
- state coalition and intergovernmental demand;
- international or allied request;
- internal administration dissent or resignation threat.

These are not interchangeable.

## 9.3 Pressure occurrence obligations

A load-bearing pressure attempt must identify, where relevant:

- source actor, organization, population process, institution, or coalition;
- target;
- proposition, demand, condition, commitment, or requested act;
- action family and route;
- resources or authority committed;
- represented participants or constituency support;
- geography and population/entity scope;
- timing, deadline, duration, or repetition;
- public/private/access status;
- evidence and claimed justification;
- relationship or commitment context;
- independent receiver and procedure;
- historical identity and lineage.

## 9.4 Receiver sovereignty

The target owns whether the pressure attempt is:

- received;
- believed;
- trusted;
- ignored;
- costly;
- persuasive;
- threatening;
- useful;
- answered;
- escalated;
- complied with;
- resisted;
- exploited strategically.

A powerful source does not guarantee compliance.

## 9.5 Pressure accumulation and memory

Repeated attempts may matter through:

- actual volume;
- participant breadth;
- persistence;
- resource commitment;
- relationship history;
- deadline;
- coordination;
- public visibility;
- electoral concentration;
- target belief and memory;
- institutional procedure.

There is no free-floating pressure total.

## 9.6 Duplicate-pressure protection

**[DI — HARD INVARIANT LC-ISS07] The same underlying action, participants, demand, evidence, or organization resource may not be counted as several independent pressure sources merely because several issue projections, media stories, dashboards, organizations, or workstreams reference it.**

Examples:

- one petition syndicated across outlets remains one petition occurrence;
- one organization email represented in three issue views remains one contact;
- one coalition statement signed by ten groups is not automatically ten independent actions, though the ten signatories may matter;
- one actor contacting the White House and Congress may create two distinct target-specific communications when both occurred;
- repeated constituent contacts may be aggregated without becoming one hive mind.

Overlap and contribution lineage from Steps 6–8 remain controlling.

---

# 10. Organization, constituency, and mobilization

## 10.1 Organization is causal, not implied

A population experiencing harm does not automatically become organized.

Organization requires some combination of:

- preexisting institution or network;
- leadership;
- membership or constituency relationships;
- communication and recruitment;
- resources;
- governance;
- coordination;
- legal and practical opportunity;
- perceived benefit and risk;
- actual action.

## 10.2 Diffuse and concentrated interests

Concentrated exposure may support organization because affected actors share geography, workplace, industry, service provider, identity, or institution.

Diffuse exposure may still organize through parties, media, advocacy groups, campaigns, or existing networks.

Neither pattern is automatic.

## 10.3 Represented constituency knowledge

Actors may estimate constituent or member pressure only through supported:

- contacts;
- surveys;
- elections;
- membership records;
- meetings;
- local reports;
- organization communication;
- public behavior;
- modeled/bounded analysis.

They cannot read exact hidden population salience or preference.

## 10.4 Mobilization and participation

Willingness to act remains distinct from:

- recruitment;
- mobilization attempt;
- attendance;
- donation;
- membership;
- strike participation;
- protest;
- turnout;
- ballot.

Each later action requires its proper process.

---

# 11. Institutional venues and venue choice

## 11.1 Venue definition

A political venue is an institution, procedure, forum, or decision route capable of receiving some kind of demand or action.

Potential venues include:

- congressional committees and chambers;
- appropriations and budget vehicles;
- executive offices and agencies;
- rulemaking and enforcement processes;
- courts;
- state legislatures, governors, attorneys general, and agencies;
- local governments;
- party and campaign processes;
- elections;
- media and public communication;
- organization governance;
- bargaining, market, or labor processes;
- international/diplomatic institutions where supported.

## 11.2 Venue ownership

The venue owns its procedure, authority, admission, calendar, queue, and result.

The issue projection does not.

## 11.3 Venue choice

An actor's attempt to select, switch, add, or avoid a venue must derive from:

- standing and authority;
- issue frame;
- desired remedy;
- available evidence;
- procedural access;
- geography;
- relationships;
- expected coalition;
- costs and resources;
- timing;
- risk;
- prior success or failure.

## 11.4 Venue shopping

Actors may reframe or redirect an issue toward a more favorable venue.

Examples:

- recast a Housing dispute as civil rights litigation;
- move a congressional failure toward executive administration;
- nationalize a state conflict through federal funding or court action;
- localize a national program through state implementation;
- turn a technical agency issue into an electoral controversy;
- move a public controversy into oversight or investigation.

Venue shopping is an actor action.

It does not guarantee admission or success.

## 11.5 Venue multiplication

The same broad issue may proceed in several venues simultaneously.

Those proceedings remain independently owned and may produce conflicting timelines, remedies, records, and political interpretations.

---

# 12. Political opportunity and policy-window contract

## 12.1 No hidden window event

**[DI — HARD INVARIANT LC-ISS08] A political or governing opportunity is a projection over actual problem recognition, actor/coalition state, available policy or action route, institutional procedure, resources, authority, timing, and uncertainty—not a hidden event chosen to make the game dramatic.**

## 12.2 Separate components

The following remain distinct:

- recognized problem or political frame;
- available policy/response alternative;
- institutionally available venue;
- coalition/support state;
- fiscal/legal/administrative feasibility;
- deadline or procedural window;
- public/media attention;
- electoral timing;
- actor willingness to couple them.

## 12.3 Solution before problem

A law, proposal, administrative concept, organization demand, or staff plan may exist before a condition becomes salient.

An actor may try to attach that solution to a newly recognized problem.

The coupling attempt is political action, not automatic fit.

## 12.4 Problem without solution

An issue may become salient while no viable presidential, congressional, state, legal, or administrative response exists.

That can create frustration, blame, symbolic politics, investigation, or demand for further analysis.

## 12.5 Window opening and closing

A governing opportunity may change because of:

- committee or floor schedule;
- must-pass vehicle;
- court deadline or ruling;
- budget cycle;
- vacancy or appointment;
- new measurement/evidence;
- organization mobilization;
- coalition agreement;
- leadership change;
- state action;
- crisis or external development;
- approaching election;
- expiring statutory authority;
- resource availability;
- policy feedback.

The relevant owners create those facts.

## 12.6 Window is not success

An available opportunity may still fail because:

- support was misestimated;
- evidence was disputed;
- an actor defected;
- the proposal changed;
- another agenda item displaced it;
- a deadline passed;
- the President chose something else;
- implementation or legal authority proved inadequate.

---

# 13. Issue competition, coexistence, and displacement

## 13.1 No global issue slots

There is no universal maximum number of political issues.

There may be owner-specific limits in:

- recipient attention and memory;
- outlet space and investigative teams;
- party or campaign messaging;
- committee and floor schedules;
- organization staff and money;
- White House assignments and presidential calendar;
- public meeting and election opportunities.

These can create displacement in one agenda without erasing the issue elsewhere.

## 13.2 Competition

Issues may compete for:

- coverage;
- organization resources;
- public attention;
- legislative calendar;
- presidential attention;
- agency review;
- budget authority;
- candidate messaging;
- donor or activist focus;
- legal venue capacity.

The competition remains owner-specific.

## 13.3 Coexistence

Several issues may remain active simultaneously because they occupy different actors, populations, geographies, venues, or resource pools.

One issue's rise does not require every other issue to fall equally.

## 13.4 Reinforcement

Issues may reinforce one another when actors or recipients connect them through:

- shared cause;
- shared affected population;
- common blame attribution;
- coalition or identity;
- bundled legislation;
- repeated media framing;
- one policy feedback path.

The connection must be represented; it is not assumed from category labels.

## 13.5 Displacement

Displacement occurs when one owner actually reallocates scarce attention, schedule, resources, or opportunity.

Examples:

- an outlet drops a planned investigation;
- leadership removes a bill from the floor schedule;
- an organization shifts field staff;
- a campaign changes its message plan;
- the White House reassigns personnel;
- a recipient forgets or deprioritizes one concern.

Displacement in one context does not delete history or material state.

---

# 14. Issue lifecycle and transformation

## 14.1 No universal state machine

Different issue projections can evolve differently.

The following terms describe possible projection relationships and contextual changes, not one compulsory enum.

## 14.2 Emergence

An issue emerges for a context when enough separately owned facts support a meaningful political projection or adopted priority.

Emergence does not require national attention.

## 14.3 Intensification

An issue may intensify through:

- worsening condition;
- broader or more concentrated exposure;
- stronger evidence;
- organization growth;
- more consequential actor action;
- institutional agenda entry;
- greater coverage or recipient salience;
- harder deadline;
- electoral concentration;
- failure of prior response.

These dimensions may move in different directions.

## 14.4 Regionalization

An issue may remain or become regionally bounded because condition, evidence, affected population, organizations, media, institutions, or venue access are concentrated.

Regional does not mean unimportant.

## 14.5 Nationalization

Nationalization is a projection over actual bridges such as:

- national measurement or evidence;
- national outlet coverage;
- party or campaign adoption;
- congressional or federal agency action;
- multistate coordination;
- national organization mobilization;
- presidential communication;
- cross-regional material effects;
- national security, legal, or fiscal consequence.

One national headline alone does not necessarily nationalize an issue for every audience or institution.

## 14.6 Splitting

A broad issue may split when actors, evidence, affected populations, causes, solutions, or venues diverge.

Example:

`Housing affordability` may split into:

- renter cost burden;
- mortgage affordability;
- homelessness;
- construction supply;
- disaster rebuilding;
- federal implementation integrity.

The split preserves shared ancestry and overlapping referents without duplicating facts or pressure.

## 14.7 Merging and bundling

Actors may bundle separate issues for legislation, communication, coalition building, or electoral strategy.

A merged issue projection references the original components and the actor/process that grouped them.

Bundling does not merge the underlying domains, beliefs, demands, or proceedings.

## 14.8 Reframing

An issue may change language, causal attribution, affected-group emphasis, moral meaning, or venue while retaining lineage to earlier frames.

Reframing does not rewrite what earlier actors believed or said.

## 14.9 Fading and dormancy

An issue may fade in one context because:

- conditions improve;
- evidence weakens;
- attention shifts;
- organization declines;
- a venue closes;
- the issue is partially resolved;
- the audience habituates;
- attribution becomes unclear;
- a competing issue displaces it.

The underlying condition, law, organization, memory, or unresolved obligation may remain.

## 14.10 Resurgence

A dormant issue may return through:

- new condition change;
- new measurement;
- implementation failure;
- investigation;
- court action;
- actor or organization revival;
- election;
- crisis;
- new affected group;
- reinterpretation of historical events.

The resurgence should be traceable to new and retained state, not a random story trigger.

---

# 15. Partisanship, factions, and issue ownership

## 15.1 Strong priors, plural agendas

Modern party identity may strongly shape:

- trust;
- attribution;
- frame adoption;
- candidate evaluation;
- organization response;
- willingness to mobilize.

It does not make every party member or voter share one issue map.

## 15.2 Party and faction distinction

A faction may prioritize an issue the formal party leadership avoids.

A party platform, campaign emphasis, legislative caucus position, activist demand, governor agenda, and voter concern remain distinct.

## 15.3 Issue ownership is perceived and relational

**[DI — HARD INVARIANT LC-ISS09] Issue ownership is not objective ownership of a policy domain or issue.**

It may refer to recipient perceptions that a party, candidate, or actor:

- cares most about the issue;
- is most associated with it;
- is most competent to address it;
- has the preferred position;
- bears responsibility for the current condition.

These dimensions may disagree.

A party can be strongly associated with an issue but not trusted to solve it.

A voter can view a party as competent but oppose its preferred solution.

## 15.4 Reputation change

Issue association or competence reputation may change through:

- repeated emphasis;
- governing performance;
- implementation outcomes;
- visible responsibility;
- opposition failure;
- candidate record;
- scandal;
- evidence and media interpretation;
- long-term partisan memory.

No communication act guarantees ownership transfer.

---

# 16. Electoral translation

## 16.1 No salience-to-vote shortcut

**[DI — HARD INVARIANT LC-ISS10] Public salience, issue importance, concern, agreement, blame, candidate competence perception, turnout willingness, and ballot choice remain separate.**

A high-salience issue may help or hurt different candidates among different populations.

## 16.2 Electoral chain

A legitimate broad path is:

```text
condition or political occurrence
→ evidence and communication
→ recipient notice, belief, attribution, and salience
→ evaluation of parties/candidates/institutions
→ campaign and organization action
→ turnout and vote willingness
→ election process
→ ballot, count, result, certification, office assignment
```

Every arrow remains separately owned.

## 16.3 Position and competence

A voter may care about an issue while:

- perceiving little difference between candidates;
- agreeing with one candidate but trusting another's competence;
- blaming a governor rather than the President;
- believing no party can solve it;
- preferring inaction;
- voting on another issue;
- not turning out.

## 16.4 Electoral concentration

A smaller nationally affected population may matter greatly when concentrated in:

- a pivotal state;
- a congressional district;
- a primary electorate;
- a party faction;
- an organized donor or activist network.

The electoral effect requires valid geography, population support, belief, attribution, and contest state.

---

# 17. Policy feedback and issue persistence

## 17.1 Policy can reshape politics

A law, program, tax, benefit, regulation, enforcement practice, institution, or implementation pattern may create later political consequences through:

- material experience;
- eligibility and participation;
- visible or hidden government role;
- administrative burden;
- organizations and providers;
- funding relationships;
- state variation;
- legal rights and obligations;
- evidence and measurement;
- public claims and attribution;
- constituency formation;
- resource and dependency changes.

## 17.2 Feedback is not guaranteed

**[DI — HARD INVARIANT LC-ISS11] A beneficial policy does not automatically create public support, credit, or an organized constituency; a harmful policy does not automatically create opposition.**

Feedback may be weak because:

- benefits are indirect or hidden;
- attribution is unclear;
- implementation is uneven;
- recipients distrust government;
- organizations are absent;
- burdens are diffuse;
- media coverage is limited;
- partisan interpretation dominates;
- evidence arrives late;
- eligibility excludes expected beneficiaries.

## 17.3 Feedback into opportunity

Policy feedback can alter later:

- affected populations;
- organizations;
- actor resources;
- relationships;
- administrative capacity;
- public belief and attribution;
- party/faction agendas;
- court and state conflicts;
- available policy alternatives;
- political feasibility.

The later issue projection references those new facts.

---

# 18. Presidential agenda and player agency

## 18.1 What the President can do

Within valid authority and information, the player may:

- create or elevate an administration workstream;
- request analysis or monitoring;
- choose which frame or proposition to emphasize publicly;
- propose legislation or budget action;
- direct or delegate administration work;
- negotiate with lawmakers, governors, organizations, or external actors;
- appoint personnel;
- use a legal or administrative route;
- support or reject another actor's initiative;
- reframe or bundle objectives;
- tolerate regional divergence;
- deliberately ignore, delay, or deprioritize a matter.

## 18.2 What the President cannot do

The player cannot directly:

- set public salience;
- set a media agenda;
- make Congress schedule a bill;
- make a party or organization adopt a priority;
- make a frame true;
- make an issue national;
- assign electoral consequences;
- create political pressure from nowhere;
- force a policy window;
- delete a controversy by issuing a statement.

## 18.3 Agenda-setting attempt

A presidential attempt to elevate an issue may use:

- speech or evidence release;
- travel and meetings;
- legislative proposal;
- agency action;
- governor coalition;
- organization engagement;
- budget proposal;
- investigation or review request;
- campaign emphasis where separately owned.

Other actors independently receive, report, support, resist, ignore, reinterpret, or exploit the attempt.

## 18.4 Failed agenda setting is valid

The President may spend calendar, staff, bargaining, and communication opportunities on an issue that fails to gain:

- media attention;
- public salience;
- congressional support;
- organization mobilization;
- viable institutional venue;
- electoral value.

That is not necessarily a bug.

## 18.5 Presidential attention remains downstream

An issue projection, media trend, public-priority poll, organization campaign, or material condition may reach the President only through:

```text
valid artifact/communication/record
→ administration receipt
→ office interpretation and coordination
→ accepted escalation basis
→ presidential review or decision
```

No issue object may directly interrupt time.

---

# 19. Player-facing issue and pressure legibility

Step 9 does not select final UI, but any later issue view must preserve the following information contract.

## 19.1 Whose issue?

The view must identify which lens is being shown:

- affected population;
- public-priority estimate;
- media coverage;
- party/faction/campaign agenda;
- organization campaign;
- Congress or committee agenda;
- governor/state agenda;
- agency/legal agenda;
- White House assessment/workstream;
- another actor's frame.

`National issue` is insufficient without support.

## 19.2 What is the issue about?

A view should expose, where accessible:

- underlying conditions/occurrences;
- proposition/frame;
- affected people and places;
- trend and history;
- evidence and uncertainty;
- claimed cause and responsibility;
- active demands and actors;
- venue/proceeding;
- available policy or governing routes;
- deadlines/opportunities;
- competing frames;
- why the administration knows about it.

## 19.3 Multiple lenses

The player should be able to compare, without assuming one is authoritative:

- material condition;
- official evidence;
- public concern;
- media attention;
- organized pressure;
- congressional activity;
- party/campaign emphasis;
- state variation;
- administration priority.

## 19.4 No canonical Top Five

A home screen may summarize:

- current presidential decisions;
- expiring opportunities;
- major observable condition changes;
- high-activity political disputes;
- administration workstreams;
- public or media agenda estimates.

It may not present one unexplained ranking as the country's objective top issues.

## 19.5 Why did this reach me?

Every presidential issue item must be able to show:

- source artifact/communication;
- receiving office;
- staff assessment;
- pressure/demand sources;
- institutional route or deadline;
- uncertainty;
- why presidential involvement is requested;
- default if ignored.

## 19.6 Hidden issues remain possible

A real condition with no valid observation, communication, or administrative route may remain absent from player views.

An observable condition should have a navigable discovery route appropriate to legitimate administration access, even if it is not politically salient or prioritized.

---

# 20. Historical persistence and generated prehistory

## 20.1 Historical issue record

History may preserve load-bearing:

- conditions and evidence;
- actor/organization problem frames;
- agenda adoptions and removals;
- demands, commitments, threats, protests, lobbying, and proceedings;
- media/public projections;
- venue changes;
- policy proposals and outcomes;
- workstream decisions;
- split/merge/reframing lineage;
- what actors knew at decision time;
- later reinterpretations.

History does not own current salience or agenda state.

## 20.2 Generated prehistory requirement

Lower-resolution prehistory need preserve political-issue detail only when later gameplay consumes it, such as:

- durable party or faction association;
- remembered campaign promise;
- major failed reform;
- active organization or constituency;
- unresolved implementation conflict;
- visible policy feedback;
- major court/state/federal venue history;
- persistent blame or competence reputation;
- current agenda and workstream inheritance.

It need not generate every news cycle, poll, lobbying contact, or minor agenda fluctuation.

## 20.3 No retroactive issue history

A 2033 issue projection may summarize earlier events, but the generator cannot invent that actors cared in 2027 merely because the issue matters in 2033.

Historical priority, salience, pressure, and venue claims require actual generated records or explicit bounded reconstruction.

---

# 21. Time, cadence, cycles, and determinism

## 21.1 Different update cadences

Issue-related state may change on different timescales:

- material conditions: domain-specific;
- evidence releases: scheduled or irregular;
- recipient salience/memory: event- and cadence-specific;
- media coverage: publication-specific;
- organization agendas: governance-specific;
- Congress: procedural calendar;
- campaigns: strategic cadence;
- polls: field/release intervals;
- White House workstreams: decision and assignment cadence.

There is no universal daily `updateIssues()` turn.

## 21.2 Same-time ordering

Causally dependent same-time events must declare semantic order.

Causally independent events must not produce different final state because of list, subscriber, thread, or handler order.

## 21.3 Feedback cycles

Political feedback may form cycles such as:

```text
organization action
→ media coverage
→ recipient salience
→ member recruitment
→ more organization resources
→ further action
```

or:

```text
party emphasis
→ public association
→ media questioning
→ candidate emphasis
→ changed association
```

Cycles require explicit timing, reconsideration, and convergence/saturation or bounded continuation semantics.

No uncontrolled same-timestamp recursion is accepted.

## 21.4 Stochastic stability

Any stochastic agenda adoption, mobilization, coverage, attention, or pressure process must use stable causal inputs and identities, remain save/load stable, and preserve time-chunk invariance.

No global random cursor or iteration order may decide which issue becomes politically important.

---

# 22. Adversarial paper proofs

These proofs test ownership and causal coherence, not final algorithms or balance.

## Proof A — severe regional employment deterioration remains politically quiet

Canonical path:

```text
regional plant closures and separations
→ household income and coverage consequences
→ local administrative caseload and fiscal stress
→ incomplete and delayed measurement
→ affected households experience harm
→ weak organization and fragmented local coverage
→ no major party, congressional, or national-media adoption
→ White House receives only low-confidence regional monitoring
→ no presidential interruption
```

Required conclusions:

- material severity exists without a national issue;
- local actors may act independently;
- Country Watch may later show bounded evidence if accessible;
- no hidden severity threshold manufactures pressure.

Perturbation:

A governor coalition and local investigation create a later national bridge. The issue then nationalizes through real actors and evidence rather than retroactive inevitability.

## Proof B — materially small symbolic controversy becomes politically large

Canonical path:

```text
limited administrative occurrence
→ vivid evidence and contested value frame
→ partisan speakers and outlets emphasize it
→ concentrated audiences notice and attribute responsibility
→ organizations mobilize and candidates adopt it
→ legislative hearing and media questions occur
→ White House receives valid political/institutional pressure
```

Required conclusions:

- political consequence can exceed material scale;
- the underlying occurrence remains correctly bounded;
- no issue score upgrades the occurrence into larger material reality;
- electoral effect remains separately resolved.

## Proof C — one Housing condition, several issue maps

Same underlying conditions:

- rising rents in several metros;
- slow construction;
- uneven federal program implementation.

Frames:

- tenants' groups: renter burden and enforcement;
- builders: supply, permitting, and finance;
- governors: federal rigidity and state capacity;
- opposition party: administration incompetence;
- administration: implementation repair and targeted supply;
- local outlets: displacement and neighborhood effects.

Required conclusions:

- these projections overlap but are not one canonical issue;
- demands and venues differ;
- one actor's solution may worsen another frame;
- pressure cannot be added without overlap checks.

## Proof D — issue splitting and bundling

Path:

```text
energy-price increase and grid outages
→ initially framed as one energy crisis
→ evidence shows different regional causes
→ issue splits into fuel-price exposure,
  grid reliability, permitting, and industrial supply
→ congressional leadership bundles two components
  into a must-pass vehicle
→ environmental and industry organizations
  support different provisions
```

Required conclusions:

- split projections preserve shared history;
- legislative bundling does not merge material domains;
- the bill/vehicle owns its terms;
- actors can support one component and oppose another.

## Proof E — autonomous Congress creates the pressure

Path:

```text
committee members receive state and industry evidence
→ members adopt a fiscal/implementation frame
→ bipartisan group drafts and introduces its own package
→ leadership grants hearing time
→ governors and organizations independently react
→ White House learns through Legislative Affairs
→ President must support, oppose, negotiate,
  propose an alternative, or allow Congress to proceed
```

Required conclusions:

- the President did not initiate the issue or proposal;
- Congress's agenda entry has an owner and procedure;
- political pressure is directed and traceable;
- a White House workstream may be created only after administration adoption.

## Proof F — presidential agenda-setting attempt fails

Path:

```text
President authorizes speech, evidence release,
travel, and legislative request on education access
→ outlets cover unevenly
→ party factions prefer other issues
→ Congress declines a hearing
→ organizations lack mobilization resources
→ public salience changes little
→ White House spent real calendar and staff opportunities
```

Required conclusions:

- presidential communication does not set the national agenda;
- failure arises through independent actors and resources;
- the administration may continue, revise, or drop the workstream;
- no compensating hidden event makes the issue succeed.

## Proof G — policy feedback with and without visibility

Two runs share a materially beneficial program.

Run 1:

- benefits are direct and visibly administered;
- recipients organize;
- local officials claim credit;
- evidence is timely;
- party and media attention grow.

Run 2:

- benefits are indirect and fragmented;
- recipients do not connect them to government;
- implementation varies;
- organizations remain weak;
- another controversy dominates coverage.

Required conclusions:

- policy feedback is not automatic;
- material success can produce different political inheritance;
- issue persistence depends on real visibility, attribution, and organization.

## Proof H — false causal frame becomes politically real

Path:

```text
real unemployment increase
→ speaker falsely attributes it to a new Housing rule
→ derivative stories and platform presentations spread claim
→ some audiences believe and prioritize it
→ organization mobilizes and legislators request hearing
→ administration receives pressure
```

Required conclusions:

- the belief, mobilization, hearing, and pressure are canonical political facts;
- the causal claim remains unsupported/false under evidence;
- a correction may alter some recipients without rewinding prior politics;
- no proposition or issue object rewrites Housing or Labor truth.

## Proof I — displacement is local to the owner

Path:

```text
major security incident
→ White House reassigns calendar and staff
→ network news reallocates coverage
→ Congress preserves a statutory Housing hearing
→ tenant organizations continue local mobilization
→ affected households continue experiencing rent pressure
```

Required conclusions:

- security displaces Housing in some agendas but not all;
- Housing does not disappear nationally by global rank;
- later return depends on retained conditions, actors, and venues.

---

# 23. Anti-cheat and anti-ontology tests

The candidate rejects:

1. canonical `IssueImportance` or `NationalAgenda` state controlling all actors;
2. `condition severity > threshold → issue created`;
3. issue object owning material, legal, fiscal, institutional, evidence, media, belief, or election state;
4. same label treated as same issue across actors;
5. different labels treated as unrelated despite shared referents;
6. issue projections mutating source facts;
7. public agenda treated as one population hive mind;
8. media coverage directly setting public salience;
9. public salience directly setting actor agenda or vote;
10. party emphasis directly setting issue ownership;
11. one pressure scalar aggregating unlike actions;
12. duplicate pressure counted through several views or derivative stories;
13. organization mobilization inferred from affected population without organization process;
14. venue admission or success owned by the issue projection;
15. policy window generated because the game needs a decision;
16. solution automatically matching a problem;
17. global top-N issue slots causing universal displacement;
18. issue fade deleting underlying condition or history;
19. national coverage making every audience care;
20. one national poll becoming exact public agenda;
21. one severe condition automatically reaching the President;
22. viral story directly interrupting the player;
23. presidential speech directly changing approval or issue rank;
24. successful policy automatically creating political support;
25. false issue frame becoming material truth;
26. later issue importance retroactively creating historical concern;
27. issue split/merge duplicating underlying occurrences, pressure, or population;
28. same-time outcomes depending on iteration order;
29. uncontrolled political feedback recursion;
30. dashboard labels becoming causal ontology.

---

# 24. External research grounding

The following sources support bounded design lessons. They do not dictate one implementation or prove the candidate.

## 24.1 Separate agendas and venues

The Comparative Agendas Project maintains distinct datasets for media, congressional bills and hearings, public laws, party platforms, budgets, and Supreme Court cases. The useful design lesson is that political attention can be observed in several institutional arenas rather than treated as one national agenda.

- Comparative Agendas Project, U.S. datasets: https://www.comparativeagendas.net/project/us/datasets

Baumgartner and Jones argue that policy change can remain stable for long periods and then shift rapidly as policy images and institutional venues change. The design implication is not to hardcode punctuations, but to permit friction, venue change, feedback, and concentrated mobilization to create uneven agenda dynamics.

- Baumgartner and Jones, “Agenda Dynamics and Policy Subsystems”: https://www.journals.uchicago.edu/doi/10.2307/2131866
- Jones, Baumgartner, and True, “Policy Punctuations”: https://www.journals.uchicago.edu/doi/10.2307/2647999
- Yildirim, “Stability and change in the public’s policy agenda”: https://link.springer.com/article/10.1007/s11077-022-09458-2

## 24.2 Importance, accessibility, and political behavior

Krosnick's work distinguishes attitude importance from accessibility and finds that important political attitudes can be more accessible and more consequential for candidate evaluation and behavior. The design implication is to avoid using one salience value as concern, memory accessibility, attitude importance, and vote weight simultaneously.

- Krosnick, “Attitude Importance and Attitude Accessibility”: https://journals.sagepub.com/doi/10.1177/0146167289153002
- Krosnick, “The role of attitude importance in social evaluation”: https://pubmed.ncbi.nlm.nih.gov/3171904/

## 24.3 Issue ownership

Issue-ownership research distinguishes associative ownership—who is linked with or perceived to care about an issue—from competence ownership—who is believed capable of handling it. The design implication is to treat ownership as audience perception rather than objective party possession.

- Lachat, “Issue Ownership and the Vote”: https://onlinelibrary.wiley.com/doi/10.1111/spsr.12121
- Seeberg, “How Stable Is Political Parties’ Issue Ownership?”: https://journals.sagepub.com/doi/10.1177/0032321716650224

## 24.4 Policy feedback

Mettler's policy-feedback work emphasizes that programs can reshape opinion and participation but that effects depend on policy design, visibility, distrust, and polarization. The design implication is to route feedback through material experience, visibility, organization, information, and attribution rather than automatically awarding support after successful policy.

- Mettler, “Making What Government Does Apparent to Citizens”: https://journals.sagepub.com/doi/10.1177/0002716219860108

---

# 25. Step 9 binary gate

The detached audit must answer:

> **Can materially and politically different issue agendas emerge, evolve, and compete from separately owned conditions, evidence, actor and organization decisions, fragmented population belief and salience, directed pressure, institutional venues, electoral incentives, and governing opportunities—without a canonical issue identity or importance score, one national agenda, a hidden drama director, duplicate pressure, direct condition-to-agenda, media-to-salience, salience-to-vote, policy-to-support, or issue-to-presidential-attention shortcuts—and can the player understand whose issue it is, what frame and evidence sustain it, who is acting, where it can be resolved, and why it did or did not reach the President?**

PASS requires all of the following:

1. underlying conditions and occurrences retain their owners;
2. evidence, claims, frames, issue projections, agenda entries, pressure attempts, solutions, venues, workstreams, and election outcomes remain distinct;
3. no canonical issue or national-agenda owner exists;
4. same-label and different-label issue relationships preserve context and provenance;
5. severity, salience, importance, accessibility, pressure, urgency, feasibility, agenda status, and presidential attention remain distinct;
6. every consequential agenda adoption or removal has an owner-specific process;
7. pressure is directed, typed, receiver-resolved, and protected against duplication;
8. organization and collective action require real organization or aggregate-process semantics;
9. venue choice and venue admission remain actor/procedure owned;
10. opportunities/windows derive from actual state rather than dramatic selection;
11. competition and displacement remain owner-specific;
12. split, merge, reframe, fade, dormancy, and resurgence preserve lineage without duplicating source facts;
13. issue ownership remains perceived and audience-specific;
14. electoral translation preserves belief, attribution, evaluation, turnout, and election ownership;
15. policy feedback is possible but not guaranteed;
16. presidential agenda-setting may succeed or fail through autonomous actors;
17. issue projections cannot interrupt the President;
18. historical issue state cannot be invented retroactively;
19. feedback cycles preserve time, ordering, and deterministic continuation;
20. the adversarial proofs remain coherent under perturbation;
21. player-facing issue summaries can explain perspective, evidence, pressure, venue, and escalation without exposing omniscient truth.

A PASS establishes only the Step 9 political-pressure and emergent-issue constitution.

It does not prove final issue algorithms, balance, media content, political realism, gameplay density, UI, generated prehistory, performance, or fun.

---

# 26. Explicitly not accepted by this candidate

This candidate does not decide or prove:

1. final issue taxonomy, topic codes, or label-generation method;
2. final proposition/frame granularity;
3. exact severity, salience, importance, accessibility, urgency, pressure, or feasibility formulas;
4. exact organization, lobbying, protest, petition, strike, donation, primary-threat, or mobilization algorithms;
5. exact party, faction, campaign, issue-ownership, or competence-reputation model;
6. exact congressional, agency, state, court, or local agenda processes;
7. exact venue-shopping algorithm;
8. exact policy-window algorithm;
9. exact public-agenda or media-agenda measurement;
10. exact issue competition, memory, displacement, split, merge, or resurgence algorithm;
11. exact electoral translation or turnout/vote formula;
12. exact policy-feedback strength;
13. final workstream or State-of-the-Nation UI;
14. final domain inventory or depth tiers;
15. historical calibration or January 2025/2033;
16. generated-prehistory issue history;
17. exact persistence, compression, or performance strategy;
18. Early Access scope;
19. roadmap, implementation order, or next code proof;
20. fun, comprehensibility, political-content quality, or commercial viability.

---

# 27. Candidate disposition

## **READY FOR DETACHED STEP-9 AUDIT**

The candidate answer is:

> **Political issues should emerge as contextual projections over real conditions, evidence, frames, affected populations, autonomous priorities and demands, institutional venues, fragmented belief and salience, electoral incentives, and time-bounded governing opportunities. Their political force comes from actual actors, organizations, audiences, procedures, resources, and history—not from one canonical issue object, importance score, national agenda, or narrative director.**

This file is a candidate only.

No Step 9 authority exists until a detached audit is preserved, any blocking findings are repaired, the unchanged binary gate passes, and a separate authority action explicitly accepts the resulting composite.