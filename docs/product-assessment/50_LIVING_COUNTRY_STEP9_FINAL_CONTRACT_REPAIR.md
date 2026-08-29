# Living Country Step 9 — Final Contract Repair

Status: **LIVING-COUNTRY STEP-9 REPAIR CANDIDATE — PRESERVED FOR DETACHED RE-AUDIT. NOT ACCEPTED PRODUCT, ARCHITECTURE, ISSUE-ALGORITHM, PARTY, CAMPAIGN, ELECTION, UI, CALIBRATION, ROADMAP, EARLY-ACCESS, SCHEMA, RUNTIME, OR IMPLEMENTATION AUTHORITY.**

This document repairs only the findings returned against:

- `48_LIVING_COUNTRY_POLITICAL_PRESSURE_EMERGENT_ISSUE_CONTRACT.md`
- candidate commit: `274bab7b1a09b91cd6d04e3ddc4e49ab9e131c48`
- detached audit: `49_LIVING_COUNTRY_STEP9_DETACHED_AUDIT.md`
- audit commit: `2099ca707443a96ef3d48ba03378ac1785cc5487`
- audit verdict: **REVISE — 1 blocking finding, 4 bounded clarifications**

Accepted authority beneath this repair:

- Step 5 presidential-game authority;
- Living Country Steps 1–8 authority.

Where this document conflicts with `48`, this document controls.

This repair does not broaden Step 9. It does not choose final issue, belief, party, campaign, election, organization, venue, UI, calibration, performance, or implementation algorithms.

---

# 1. Repair disposition

The central Step 9 thesis is retained:

> **Political issues are contextual projections over separately owned conditions, evidence, frames, affected populations, autonomous priorities and demands, institutional venues, fragmented belief and salience, electoral incentives, and governing opportunities. Their force comes from actual actors, recipients, institutions, resources, and history—not from one issue object, importance score, national agenda, or narrative director.**

The repair adds five controlling contracts:

1. recipient political cognition must use projection-independent semantic targets;
2. issue-projection creation and surfacing must have bounded provenance and cannot become an issue selector;
3. intended, attempted, delivered, received, interpreted, and consequential pressure remain separate;
4. canonical agenda state and analytical agenda projections receive closed labels;
5. political recognition cannot manufacture legal authority, fiscal authority, standing, or institutional option availability.

No Step 9 authority exists until the unchanged binary gate passes and a separate authority receipt is preserved.

---

# 2. Projection-independent recipient-cognition contract

## 2.1 Core invariant

**[HARD INVARIANT LC-ISSR01] Recipient-owned belief, uncertainty, attribution, attitude importance, cognitive accessibility, salience, preference, willingness, memory, trust, and evaluation may not require a political-issue projection identity as their canonical semantic key.**

A political-issue projection is a read-only grouping for one producer, consumer, and time.

It cannot be the thing that makes recipient cognition exist.

Forbidden:

```text
PopulationSalience[whiteHouseIssueProjectionId] = 0.82
PopulationBelief[mediaIssueClusterId] = SUPPORT
PopulationAttribution[nationalIssueId] = PRESIDENT
```

when those identifiers are projection-created labels rather than independently meaningful cognitive targets.

## 2.2 Permitted semantic target families

Recipient-owned cognition may attach, at the resolution later justified, to a declared semantic target such as:

1. **proposition target**
   - a bounded assertion, prediction, causal claim, responsibility claim, or normative statement;
2. **problem-frame target**
   - a retained frame linking evidence or believed conditions to an expectation, value, affected group, responsibility, urgency, or response family;
3. **referent evaluation target**
   - a condition, occurrence, institution, program, policy, actor, party, candidate, organization, place, or other accepted referent;
4. **policy-alternative or response target**
   - support, opposition, uncertainty, or evaluation concerning a proposed action or solution;
5. **responsibility/credit/competence target**
   - recipient evaluation of who caused, handled, can handle, deserves credit for, or bears responsibility for a bounded matter;
6. **historical occurrence or memory target**
   - retained memory or evaluation concerning a past event, promise, failure, decision, or controversy;
7. **declared broad semantic family**
   - a deliberately broad concern such as `housing affordability` only when its meaning, covered referents, exclusions, time, and lineage are explicit.

These families are conceptual. They are not one required runtime enum.

## 2.3 Target obligations

A load-bearing recipient-cognition target must preserve, where relevant:

- semantic identity and version;
- target family;
- propositions, frame, referents, actors, policies, or occurrences included;
- exclusions and unresolved ambiguity;
- time/as-of interval;
- geography and population/entity scope;
- recipient context;
- support level;
- source/evidence/memory lineage;
- relation to broader or narrower targets;
- whether the state is exact, modeled, bounded, estimated, or unsupported.

The target itself does not own truth.

## 2.4 Broad targets are legitimate but bounded

A recipient may genuinely possess a broad concern such as:

- the economy;
- healthcare;
- crime;
- Housing affordability;
- immigration;
- government competence.

A broad target may therefore be canonical recipient state when the recipient actually thinks at that level.

But broad concern does not establish exact narrower beliefs.

Example:

```text
recipient reports Housing affordability is highly important
```

may not be decomposed automatically into exact salience for:

- renter cost burden;
- mortgage rates;
- zoning;
- homelessness;
- construction supply;
- federal grant integrity.

Narrower states remain independently evidenced, modeled, bounded, unsupported, or unknown.

## 2.5 Issue projections consume targets; they do not create them

An issue projection may reference and summarize:

- proposition-specific belief;
- frame adoption;
- broad concern;
- attribution;
- actor/party competence evaluation;
- policy support;
- memory;
- salience estimates.

Its aggregation method must identify:

- which semantic targets are included;
- why they are grouped;
- population and geography;
- time;
- overlap;
- weighting or comparison basis;
- support and uncertainty;
- omitted targets.

The issue projection cannot write the underlying recipient state.

## 2.6 Split rule

**[HARD INVARIANT LC-ISSR02] Splitting an issue projection creates two or more new contextual views over retained semantic targets. It does not divide, copy, or assign recipient cognition by fiat.**

Suppose one projection groups:

- renter burden;
- mortgage affordability;
- construction supply.

If the projection splits:

- any existing proposition-, frame-, referent-, policy-, or broad-target cognition remains where it was;
- new child projections reference the applicable retained targets;
- a broad `Housing affordability` concern may be shown as broad or allocated only through a declared modeled/bounded method;
- the same broad concern may not be counted in every child as three independent concerns;
- unsupported child-level belief remains unsupported.

## 2.7 Merge and bundle rule

**[HARD INVARIANT LC-ISSR03] Merging or bundling issue projections creates a contextual grouping. It does not merge recipient beliefs, erase disagreement, or replace several semantic targets with one canonical issue state.**

A recipient may:

- care strongly about energy prices;
- oppose a climate provision;
- support grid investment;
- reject an industrial subsidy;

while a party or legislative actor bundles all four under `energy security`.

The bundle is politically real as an actor or venue frame.

The recipient states remain separate.

## 2.8 Reframing rule

A new frame may reinterpret earlier evidence or conditions.

It creates a new frame identity or version with lineage.

It does not rewrite what recipients previously believed, what earlier actors said, or what a prior projection meant.

Recipient transition from one frame to another requires a valid cognition process using information, experience, memory, trust, and interpretation.

## 2.9 Absence of projection is not absence of cognition

A person, organization, lawmaker, governor, or administration office may possess belief, concern, memory, attribution, or policy preference even when no shared issue projection exists.

Likewise, a projection may exist for navigation while no recipient treats it as important.

## 2.10 Polling and survey questions

A poll or survey may ask respondents to choose or rate broad issue labels.

The resulting artifact measures responses to that instrument and wording.

It does not establish that all respondents shared one semantic interpretation of the label.

Question wording, offered categories, open-ended coding, order, target population, and response process remain Step-7 measurement facts.

A `most important problem` response may be coded into a topic family for analysis while preserving:

- original or bounded response meaning where retained;
- codebook/method;
- ambiguity;
- population and time;
- the distinction between forced-choice response and underlying cognition.

## 2.11 Electoral consumption

Election and campaign processes may consume recipient-owned semantic targets only at their actual support level.

An issue projection cannot become an electoral utility variable by default.

A broad public-agenda estimate does not prove:

- candidate difference;
- candidate competence belief;
- responsibility attribution;
- policy agreement;
- turnout;
- ballot choice.

---

# 3. Issue-projection creation and surfacing provenance

## 3.1 Core invariant

**[HARD INVARIANT LC-ISSR04] Every persisted or causally load-bearing issue projection must declare why it exists, who produced it, who may consume it, which accessible facts it used, and which selection/grouping method generated it.**

A hidden system may not inspect canonical truth and choose the most dramatic clusters for the player.

## 3.2 Projection purposes

A projection may legitimately be created for a declared purpose such as:

- White House staff assessment;
- party or campaign analysis;
- congressional research or agenda analysis;
- organization strategy;
- media analysis;
- public-agenda measurement;
- State-of-the-Nation navigation;
- historical analysis;
- player-requested query;
- developer/audit view kept separate from live play.

The purpose constrains access and meaning.

## 3.3 Projection declaration

A load-bearing projection declares, where applicable:

- producer or analytical owner;
- consumer and access class;
- creation/as-of time;
- source artifacts, records, recipient state, agenda state, pressure attempts, and proceedings actually accessible;
- grouping and selection rule;
- issue label source;
- included and excluded semantic targets;
- population/geography/time support;
- uncertainty and known blind spots;
- relation to earlier projections;
- retention/expiration/recompute rule;
- whether it is persisted evidence, an ephemeral query, or presentation-only navigation.

## 3.4 No projection-caused politics

Creating, renaming, displaying, splitting, merging, or deleting a projection does not directly create or remove:

- actor priority;
- organization agenda;
- public salience;
- media coverage;
- political pressure;
- institutional schedule;
- policy authority;
- election effects;
- presidential attention.

An actor may receive an issue projection as an information artifact and later respond through the accepted actor grammar.

That later response is separately owned.

## 3.5 Underlying action without a common projection

Actors and institutions can act on:

- direct experience;
- evidence;
- one proposition;
- one request;
- one legal duty;
- one organization agenda;
- one proceeding;

without first sharing a common issue object.

The absence of a common projection cannot block valid action.

## 3.6 Player-facing selection

A later interface may choose a bounded set of items for a particular screen.

That selection must identify its lens, such as:

- presidential decision required;
- known deadline;
- administration workstream;
- major observable condition change;
- high activity among specified actors;
- public-priority estimate;
- media-coverage estimate;
- player-selected watch list.

A top-N display is presentation, not national truth.

Observable conditions and records remain navigable through legitimate access even when not selected for the summary.

A condition without a valid observation route remains hidden.

## 3.7 No dramatic-clustering director

The following is invalid:

```text
scan hidden world state
→ rank dramatic potential
→ create Issue X
→ route it to media, Congress, public, and President
```

Valid paths require the separately owned actions and receipts already accepted.

---

# 4. Closed political-pressure stages

## 4.1 Core distinction

**[HARD INVARIANT LC-ISSR05] Pressure intention, pressure attempt, publication/delivery, target receipt, target interpretation, actual constraint or consequence, and target response are distinct facts.**

## 4.2 Pressure intention

An actor or organization may privately intend to influence another actor or institution.

Private intention does not affect the target by itself.

## 4.3 Pressure attempt

A pressure attempt is a canonical act such as:

- request;
- threat;
- offer;
- endorsement;
- lobbying contact;
- petition;
- protest;
- strike authorization;
- contribution or withholding decision;
- lawsuit;
- public campaign;
- investigation;
- hearing;
- resignation threat;
- market action.

It identifies source, target or intended audience, demand/proposition, route, resources, time, and visibility.

## 4.4 Delivery or public availability

A private letter may be delivered.

A public statement may become available and presented through media or organizational channels.

An attempt that fails to leave the source does not pressure the target merely because the source intended it.

## 4.5 Target receipt

The target may receive:

- the direct attempt;
- a staff summary;
- public reporting;
- constituent reaction;
- market consequence;
- institutional notice;
- an intermediary's communication.

Receipt remains bounded and time-specific.

## 4.6 Target interpretation

The target determines whether it interprets the attempt as:

- credible;
- costly;
- useful;
- representative;
- electorally threatening;
- legally consequential;
- bluff;
- irrelevant;
- ambiguous;
- advantageous to publicize.

## 4.7 Actual constraint or consequence

Some source actions create consequences even before a direct communication is read, for example:

- funds are withheld;
- workers strike;
- a lawsuit triggers procedure;
- a firm closes;
- a protest disrupts operations;
- a vote is cast;
- an organization redirects staff.

The relevant material, fiscal, legal, operational, or procedural owner resolves that consequence.

The target still learns only through a valid observation or receipt.

## 4.8 Indirect pressure

A public pressure attempt may operate indirectly:

```text
organization publishes demand
→ outlets/platforms distribute
→ recipients react
→ lawmakers, donors, governors, or staff communicate or act
→ target receives those later acts or consequences
```

The intermediate acts are not collapsed into the original attempt.

## 4.9 Pressure summaries

A player-facing pressure summary must distinguish, where known:

- source intentions inferred with uncertainty;
- actual attempts;
- delivered/available/public attempts;
- known target receipts;
- observed constraints or consequences;
- staff estimates of credibility and likely response;
- duplicate/overlapping participants or evidence;
- unknown or hidden pressure.

`Pressure is high` cannot be the only causal record.

---

# 5. Closed agenda-state taxonomy

## 5.1 Core invariant

**[HARD INVARIANT LC-ISSR06] Canonical adopted priorities, scheduled/procedural agenda items, allocated attention/resources, recipient salience, and analytical agenda projections remain distinct and must be labeled accordingly.**

## 5.2 Adopted priority

An adopted priority is actor-, office-, organization-, party-, campaign-, or institution-owned state created by a valid decision or governance process.

It may influence later resource allocation and action according to that owner's rules.

## 5.3 Scheduled or procedural agenda item

A scheduled item is institution/procedure-owned state such as:

- committee hearing;
- floor consideration;
- court argument;
- agency review;
- rulemaking stage;
- budget deadline;
- board vote;
- organization convention item.

A priority does not automatically create a schedule.

A schedule does not prove substantive support.

## 5.4 Allocated attention or resources

An outlet assigning a reporter, a party purchasing advertising, an organization deploying field staff, or the White House assigning Legislative Affairs is owner-specific operational state.

It is not merely an analytical agenda ranking.

## 5.5 Recipient salience or importance

Population and individualized-recipient cognition remains recipient-owned under Section 2.

It is not an adopted organization agenda.

## 5.6 Analytical agenda projection

A public, media, party, congressional, state, judicial, agency, or White House `agenda` summary may be a projection over:

- adopted priorities;
- schedules;
- resource allocations;
- statements;
- coverage;
- polling;
- observed actions.

The projection must declare its basis and cannot satisfy a procedure requiring an actual priority, schedule, vote, or allocation.

## 5.7 Association is not adoption

A party may be publicly associated with crime or healthcare while not currently adopting a specific proposal or campaign emphasis.

A poll result about perceived issue ownership does not create party agenda state.

## 5.8 Historical agenda state

A later projection may summarize what an actor or institution prioritized historically.

It must derive from actual adopted priorities, schedules, allocations, statements, or actions.

It may not infer historical adoption solely from later association or current issue importance.

---

# 6. Political recognition does not create authority

## 6.1 Core invariant

**[HARD INVARIANT LC-ISSR07] Political salience, pressure, urgency, nationalization, public support, media attention, or agenda adoption cannot by itself create legal authority, fiscal authority, standing, jurisdiction, eligibility, procedural admission, operational capability, or an otherwise unavailable action route.**

## 6.2 Available attempts remain institution-specific

Political recognition may cause actors to attempt:

- new legislation;
- appropriation;
- rulemaking;
- enforcement change;
- executive action under claimed authority;
- emergency declaration;
- litigation;
- state action;
- organization action;
- public communication;
- investigation;
- negotiation.

Each attempt still requires:

- actor standing;
- claimed/applicable authority;
- procedure;
- target;
- prerequisites;
- resources;
- timing;
- independent admission and resolution.

## 6.3 Urgency is not emergency authority

A matter being politically urgent does not establish a legal emergency.

An emergency declaration or extraordinary-power attempt requires the applicable legal and factual basis, decision, instrument, receipt, review, and potential contest.

## 6.4 Public support is not budget authority

Broad support cannot spend money.

Fiscal consequences require law, appropriations, recognized authority, obligations, payments, and execution through their owners.

## 6.5 Nationalization is not federal jurisdiction

An issue becoming nationally discussed does not automatically create federal constitutional, statutory, regulatory, or administrative authority.

Federal actors may seek new authority, use valid existing authority, negotiate, fund, litigate, communicate, or decline.

## 6.6 Venue visibility is not venue admission

A court, committee, agency, chamber, state, or organization retains control of its admission and procedure.

A powerful issue projection cannot place itself on the docket or calendar.

---

# 7. Controlling application to split, merge, and cross-context comparison

## 7.1 Example: broad Housing concern

Canonical recipient state may contain:

```text
broad target: Housing affordability
importance: high
attribution: mixed/uncertain
```

and separately supported narrower state concerning:

```text
renter burden proposition
mortgage affordability proposition
federal implementation frame
```

A White House projection may group all four.

A tenant organization projection may group only renter burden and enforcement.

A builders' association projection may group supply, finance, and permitting.

None owns the other's semantic target.

## 7.2 Split

When the White House splits its broad projection:

- the broad recipient concern remains broad;
- supported narrow cognition is referenced where applicable;
- unsupported narrow cognition is not invented;
- active pressure attempts retain their original target, demand, and source;
- one pressure occurrence may be referenced by several children without being duplicated;
- schedules and proceedings remain with their institutions.

## 7.3 Merge

When congressional leadership bundles renter assistance and construction permitting into one bill:

- the bill owns the bundled terms;
- leadership owns scheduling;
- each organization and lawmaker may support or oppose components separately;
- public cognition remains attached to its semantic targets;
- the legislative issue projection may summarize the bundle without becoming one public belief.

## 7.4 Reframe

When opposition actors reframe implementation delay as corruption:

- the new corruption frame has its own proposition/evidence lineage;
- existing belief that implementation was slow remains separate;
- recipients may accept the delay claim but reject corruption;
- a later investigation may strengthen, weaken, or leave the frame unresolved;
- the issue projection does not make misconduct true.

---

# 8. Corrected hostile cases

## 8.1 Projection-created cognition

Rejected.

Recipient state uses projection-independent semantic targets.

## 8.2 Split copies broad concern into every child

Rejected.

Broad state remains broad unless a declared modeled/bounded allocation is performed.

## 8.3 Merge erases disagreement

Rejected.

The merge groups targets and does not merge recipient state.

## 8.4 Hidden issue generator selects dramatic topics

Rejected.

A persisted/player-facing projection declares producer, consumer, accessible source set, selection rule, context, and omissions. Projection creation does not cause politics.

## 8.5 Private donor threat affects President before receipt

Rejected.

Private intention and attempt do not influence the target before receipt or an independently observable consequence.

## 8.6 Party appears associated with issue and therefore formally adopts it

Rejected.

Association/ownership perception, adopted priority, campaign emphasis, and legislative action remain separate.

## 8.7 National outrage creates emergency authority

Rejected.

Political recognition changes actor incentives and attempts, not legal authority.

## 8.8 One issue projection disappears and public concern vanishes

Rejected.

Projection lifecycle and recipient cognition are separate.

## 8.9 Same issue appears in five screens and creates five pressures

Rejected.

Projection aliases do not create new attempts, receipts, constraints, or cognition.

## 8.10 Observable condition omitted from top-N summary

Permitted as presentation selection only if its legitimate navigation/discovery route remains available and the top-N lens is explicit.

A hidden condition remains hidden until a valid observation route exists.

---

# 9. Revised Step 9 gate obligations

The unchanged binary gate remains controlling.

For PASS, the repaired composite must now additionally demonstrate:

1. recipient cognition remains semantically meaningful without an issue projection;
2. split/merge/reframe does not copy, divide, merge, or erase cognition by projection fiat;
3. broad and narrow cognition retain honest support and overlap;
4. public-agenda measures preserve question/category semantics;
5. issue projection creation has bounded producer, consumer, access, selection, method, and omission provenance;
6. projection creation/surfacing does not cause actor priority, public salience, agenda state, pressure, or presidential attention;
7. intended pressure, attempts, delivery, receipt, interpretation, structural consequence, and response remain distinct;
8. adopted priority, procedural schedule, resource allocation, recipient salience, and agenda projection remain distinct;
9. political urgency or nationalization cannot manufacture authority, standing, money, jurisdiction, or procedure.

---

# 10. Explicitly unchanged from the candidate

The repair leaves intact:

- no canonical issue object or national agenda;
- conditions, evidence, frames, projections, agendas, demands, solutions, venues, workstreams, and elections as separate facts;
- plural actor/institution/public/media/party/White House agendas;
- owner-specific agenda adoption and displacement;
- directed, typed pressure protected from duplication;
- autonomous organization and venue behavior;
- derived policy opportunities rather than hidden windows;
- issue emergence, intensification, regionalization, nationalization, split, merge, reframing, fading, dormancy, and resurgence;
- issue ownership as audience perception;
- no salience-to-vote shortcut;
- nonautomatic policy feedback;
- presidential agenda-setting success or failure;
- quiet severe conditions and politically loud modest occurrences;
- historical and deterministic integrity;
- all candidate deferrals.

---

# 11. Re-audit disposition

## **READY FOR UNCHANGED FINAL STEP-9 BINARY RE-AUDIT**

The blocking circularity is closed conceptually:

> **Recipient cognition attaches to independently meaningful propositions, frames, referents, policies, actors, events, and declared broad semantic families. Issue projections may group and explain that state for particular contexts, but may never create, own, divide, merge, or erase it.**

No authority is claimed by this repair.