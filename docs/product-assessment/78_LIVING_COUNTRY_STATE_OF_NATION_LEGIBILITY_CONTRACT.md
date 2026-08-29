# Living Country Step 15 — State-of-the-Nation Legibility Contract

Status: **LIVING-COUNTRY STEP-15 DESIGN CANDIDATE — PRESERVED FOR DETACHED REVIEW. NOT ACCEPTED FINAL UI, VISUAL STYLE, IMPLEMENTATION, SCHEMA, EARLY-ACCESS, ROADMAP, PLAYER-START, OR RUNTIME AUTHORITY.**

Authority boundary:

- Accepted production baseline: `44c1724962830225e6fc34f41d0df0cfdb7dfec0`
- Accepted presidential-game core: `10_STEP5_PRODUCT_DESIGN_AUTHORITY.md`
- Accepted Living Country Steps 1–14, culminating in `77_LIVING_COUNTRY_STEP14_CROSS_LAYER_STRESS_AUTHORITY.md`
- Accepted Step 14 tip before this candidate: `32186147a8f970c802b22a181ee45041209051dc`

This is Living Country **Step 15**. It answers:

> **How should the President understand the moving country at a glance and drill into it without seeing developer truth, receiving one objective national issue ranking, flattening uncertainty, confusing politics with material state, or manually reading the whole simulation ledger?**

This candidate defines an **information and navigation contract**, not final screen geometry or visual styling.

It does not:

- choose exact panel layout, colors, typography, animation, iconography, or map rendering;
- choose Early Access scope or player-start year;
- implement search, dashboards, charts, notifications, dossiers, maps, timelines, or briefings;
- choose exact data-retention or query architecture;
- expose developer/debug state;
- modify runtime, source, schema, configuration, tests, data, or production files.

---

# 1. Central design answer

The presidential interface should be organized around a bounded information hierarchy:

```text
WHAT CHANGED?
→ WHAT DO WE ACTUALLY KNOW?
→ WHY MIGHT IT MATTER?
→ WHO IS ACTING?
→ DOES ANYTHING REQUIRE THE PRESIDENT?
→ SHOW EVIDENCE / HISTORY / SOURCE CONTEXT
```

The interface is a set of **read-only and administration-owned projections over accepted state**, plus explicit presidential/admin actions. It never becomes a second owner of the country.

The President should be able to move from broad orientation to detail using the principle:

> **Overview → Detail → Record**

without crossing an epistemic boundary merely because the player clicked deeper.

A drill-down exposes more of what the administration can legitimately know, not more of hidden canonical truth.

---

# 2. Five distinctions every meaningful summary must preserve

A load-bearing player-visible item must preserve the distinction among:

1. **subject / material or institutional referent** — what part of the world the item concerns;
2. **available evidence / operational record** — what has actually been measured, recorded, received, observed, or directly known;
3. **staff or institutional interpretation** — what an office or analyst believes the evidence means;
4. **political activity / attention** — which actors, organizations, media, populations, or institutions are acting or treating the matter as salient;
5. **administration priority / presidential requirement** — whether the White House has adopted a workstream and whether anything actually needs the President.

These are not display-only labels. They protect the prior ownership contracts.

Example:

```text
SUBJECT
Regional manufacturing employment appears to be weakening.

EVIDENCE
Preliminary payroll estimate, state unemployment claims,
two exact plant closure announcements.

STAFF INTERPRETATION
Economic team: downturn likely concentrated, national recession uncertain.

POLITICAL ACTIVITY
Two governors requesting help; Senate committee considering hearing;
national media attention moderate.

ADMINISTRATION
Monitoring only. No adopted legislative response yet.

PRESIDENT
No decision currently required.
```

The UI may summarize these layers. It may not collapse them into:

```text
JOBS CRISIS — 82
```

---

# 3. Six semantic information surfaces

The following are **semantic surfaces**, not six mandatory screen tabs. A later UI may combine or split them visually while preserving their meanings.

## 3.1 Presidential Attention

Purpose:

> Show what legitimately requires presidential review, decision, or acknowledgement now or before a known expiration.

An item enters Presidential Attention only through the accepted Step-5 route:

```text
valid artifact / communication / duty / occurrence
→ administration receipt
→ office interpretation
→ valid escalation basis
→ presidential review
```

Every item identifies:

- receiving/escalating office;
- received artifact or direct-duty basis;
- why presidential involvement is needed;
- current known facts;
- uncertainty;
- available routes and authority;
- deadline/expiration;
- default/inaction;
- downstream independent resolvers.

A material condition, viral story, poll, or issue projection cannot enter Attention directly from canonical truth.

A healthy Attention surface may contain **nothing**.

`Nothing currently requires you` is a legitimate game state.

## 3.2 Administration Workstreams

Purpose:

> Show objectives and matters the administration has deliberately adopted, delegated, monitored, or held.

A workstream remains an administration-owned coordination projection.

It may show:

- objective;
- administration lead;
- current intensity: presidential push / administration-led / monitor / hold;
- underlying conditions and evidence;
- institutional route;
- actors;
- assignments and queues;
- commitments;
- deadlines/opportunities;
- implementation;
- known political context;
- recent history;
- what can proceed without the President;
- what would cause re-escalation.

A workstream does not become more objectively important because it is in this surface.

Removing/hiding a workstream view does not delete the objective, assignments, records, law, material state, or political issue.

## 3.3 Country Watch / State-of-the-Nation

Purpose:

> Provide a navigable administration-bounded picture of observable country, institutional, fiscal, legal, social, material, and political state regardless of whether the White House has adopted it as a priority.

Country Watch is conceptually the **continuous discovery/indexing layer**.

State-of-the-Nation is a **dated synthesis/reporting projection** over available Watch material, current administration information, and declared political lenses.

The two may later share UI.

Their distinction is semantic:

```text
Country Watch
= what the administration's supported monitoring/discovery processes can currently surface

State of the Nation
= a bounded synthesis of selected available material for orientation at a declared date/lens
```

Country Watch may contain:

- condition measurements/trends;
- fiscal state;
- ongoing institutional processes;
- state/regional divergence;
- scheduled releases;
- public/media/political activity projections;
- program implementation state;
- courts and legal deadlines;
- known external/security conditions;
- explicit gaps, stale series, unavailable data, or unresolved questions.

Country Watch is **not** the list of administration priorities.

An observable condition cannot disappear merely because the President ignored it.

State-of-the-Nation cannot become one objective Top Issues list.

It may present several declared lenses, for example:

- major observed condition changes;
- staff risk assessment;
- public-priority measurement;
- media coverage;
- congressional activity;
- state/governor activity;
- administration workstreams;
- known deadlines.

Those lists may disagree.

## 3.4 Actor and Institution Dossiers

Purpose:

> Explain why a person, office, organization, state, committee, court, agency, firm, outlet, or other exact entity matters using bounded records and assessments.

A dossier may show, where legitimately available:

- identity and role;
- office/institution relationships;
- public statements;
- official acts;
- known commitments;
- prior interactions with the administration;
- constituency/member/geographic relationships;
- election/term state;
- known organizational resources/authority;
- received communications;
- staff relationship or risk assessments;
- relevant history.

A dossier may not expose:

- exact hidden motives;
- private beliefs not received or validly inferred;
- hidden future choices;
- exact constituency state unsupported by Step 3;
- personal knowledge from an office record unless a valid cross-context transfer occurred.

Staff assessments must be labeled as assessments, with uncertainty and basis.

## 3.5 Evidence and Measurement

Purpose:

> Let the player answer `Where did this number/claim come from, how current is it, and how much should we trust it?`

Evidence detail may expose, according to access:

- producer;
- subject;
- reference period;
- publication/release time;
- administration receipt time;
- current/superseded/corrected/withdrawn status;
- methodology family;
- sample/source coverage;
- geography/population universe;
- uncertainty/support;
- dependency with other evidence;
- revisions;
- staff interpretation;
- known conflicts with other products.

This surface is not a developer provenance graph.

Confidential raw records, protected sources, classified origins, and inaccessible microdata remain protected.

## 3.6 Historical Record

Purpose:

> Show what happened, what the administration knew then, what it decided, what followed, and what is known now without rewriting history after revisions.

The Record can organize:

- presidential acts/inaction;
- commitments;
- laws and institutional outcomes;
- administrative implementation;
- material consequences;
- evidence vintages;
- political reaction;
- election history;
- unresolved inheritance.

It must support two distinct perspectives:

### As known then

What records/evidence were legitimately available to the relevant actor/administration at the historical decision time.

### As understood now

Later revisions, investigations, court rulings, evidence, or outcomes currently available.

A later revision may change `understood now`.

It cannot rewrite `known then`.

The Record shown to the player remains access-bounded. Developer audit truth is separate.

---

# 4. Summary item contract

Every load-bearing summary/card/row/marker should be able to answer the following at the accepted abstraction.

## 4.1 Identity

- What semantic referent, occurrence, evidence product, political projection, workstream, or deadline is this?
- Is the displayed label staff shorthand, source wording, issue framing, or generated navigation text?

## 4.2 Time

- effective/as-of date;
- reference period;
- release/publication date where relevant;
- administration receipt date where relevant;
- last update;
- next expected update if known.

## 4.3 Scope

- geography;
- population/entity universe;
- exact versus modeled/bounded/unsupported scope;
- denominator where applicable.

## 4.4 Epistemic class

The interface should distinguish forms such as:

- direct administrative/operational fact;
- official measurement;
- private estimate;
- forecast;
- intelligence assessment;
- staff estimate;
- actor claim;
- media report;
- public-opinion measurement;
- unknown/unresolved.

The exact labels may vary by UI.

The distinction may not disappear.

## 4.5 Support/uncertainty

Display the relevant uncertainty honestly rather than one decorative confidence percentage.

Possible presentation semantics include:

- preliminary;
- revised;
- stale;
- modeled;
- partial coverage;
- disputed;
- low/medium/high analytic confidence where appropriate;
- bounded range;
- no reliable estimate;
- methodology break;
- dependence/duplication warning.

## 4.6 Visibility basis

The item should be able to explain why it is visible, such as:

- scheduled official release received by an office;
- agency operational report;
- public record;
- governor/lawmaker/organization communication;
- press monitoring;
- staff-requested analysis;
- intelligence briefing;
- court notice;
- program report;
- player-established monitoring instruction.

## 4.7 Political context

Where relevant:

- who is acting;
- what frames/demands exist;
- which institution/venue is active;
- public/media/party activity under declared lenses;
- whether those facts are measurement versus adopted agenda state.

## 4.8 Administration state

Where relevant:

- no administration priority;
- monitoring;
- workstream adopted;
- delegated action;
- presidential push;
- waiting/default.

## 4.9 Presidential state

Where relevant:

- no presidential action needed;
- review optional;
- decision requested;
- deadline/expiration;
- default if ignored.

---

# 5. Overview selection cannot become a hidden issue director

A home/overview surface necessarily selects a subset of information.

That selection must use declared player-facing lenses rather than a hidden `importance` score.

Valid selection reasons include:

- presidential decision or deadline;
- recent material/institutional change above a declared monitoring threshold;
- scheduled milestone;
- current administration workstream;
- actor/institution activity relevant to an adopted objective;
- significant newly received evidence;
- player watch/monitor instruction;
- declared public/media/congressional/state activity lens.

A summary may sort or group for usability.

Sorting does not become canonical political importance.

The following is invalid:

```text
hidden simulation scans truth
→ computes ImportanceScore
→ top 8 become visible country
→ everything else effectively disappears
```

The interface should be able to explain the selection lens.

An item omitted from one summary remains available through its legitimate discovery path if the administration has such access.

---

# 6. Country Watch discovery and proactive investigation

## 6.1 Standing monitoring

Country Watch can be populated by standing processes such as:

- scheduled statistical releases;
- designated agency reports;
- fiscal/accounting reports;
- legal notices;
- program status reports;
- press/public monitoring;
- intelligence products;
- state/intergovernmental reporting;
- player-created watch instructions;
- recurring staff analysis.

The exact monitoring inventory remains unaccepted.

## 6.2 Proactive investigation is an action

The player may request deeper review of an observable or suspected matter.

That does not open debug truth.

A request should create an administration-owned assignment with:

- requesting authority/office;
- question/scope;
- lead;
- available records/access;
- resources/queue;
- deadline/priority;
- expected output;
- uncertainty;
- legal/classification/confidentiality constraints.

Possible results include:

- new evidence;
- confirmation;
- narrower estimate;
- contradiction;
- `insufficient evidence`;
- `outside our access`;
- delayed result;
- referral to another institution;
- no meaningful change.

A query may itself create political consequences only through actual communications, leaks, resource use, legal procedure, or later actor knowledge.

## 6.3 Search is not omniscience

Search may operate over information the administration has indexed or can legitimately access through the later accepted discovery model.

It cannot search hidden canonical truth by semantic intent.

`Show me every corrupt official` is not a valid truth query.

The system may instead search known records, investigations, allegations, filings, audits, or staff assessments.

---

# 7. Material-condition views

A material view should not show an `actual truth` column unless the administration legitimately possesses the exact underlying operational fact.

Instead, it may present:

- subject/mechanism;
- best currently available evidence/estimate;
- trend and uncertainty;
- known geographic/population distribution;
- recent causal occurrences known to the administration;
- relevant next measurement/release;
- affected programs/institutions;
- political activity separately.

Examples:

```text
Labor
Current estimate: unemployment rising modestly nationally,
severe deterioration in four industrial regions.
Status: preliminary.
Next release: Sep 4.
Known exact events: Plant P closure, Plant Q layoff announcement.
```

not:

```text
TRUE UNEMPLOYMENT = 6.2381%
```

when the administration only has an estimate.

---

# 8. Geographic legibility

Maps and geographic lists must preserve support.

## 8.1 No fake spatial precision

If evidence is supported only at state level, a county/tract heatmap may not imply exact county values.

A modeled allocation may be shown only when labeled modeled and its support/uncertainty is preserved.

Unsupported regions remain unknown rather than zero.

## 8.2 Geography type must be explicit

A displayed map/list should identify whether it represents:

- residence;
- workplace;
- electoral district;
- service area;
- market;
- network/grid;
- project/event footprint;
- media market;
- jurisdiction;
- another accepted geography.

One map cannot silently substitute one geography for another.

## 8.3 Vintage

Historical or current geography must retain the applicable vintage.

The 2032 House district map cannot be used to describe an earlier election without declared transformation.

## 8.4 Counts, rates, and denominators

Maps must distinguish:

- raw counts;
- rates/shares;
- per-capita measures;
- weighted modeled allocations;
- absolute material quantities.

Color intensity cannot erase denominator meaning.

---

# 9. Trend and revision legibility

A time series must preserve enough metadata to avoid presenting incomparable values as one clean line.

Potential breaks include:

- methodology change;
- seasonal-adjustment change;
- rebasing;
- geography change;
- source change;
- revision/benchmark;
- incomplete latest period.

The interface may visually simplify.

It must preserve a drill-down showing the break or revision.

A preliminary point should remain visibly preliminary.

A superseded vintage remains available in historical context.

---

# 10. Actor and institution legibility

The player should not need to memorize 535 lawmakers, 50 governors, hundreds of organizations, and every agency.

A relevant actor should surface because the current bounded context can explain **why they matter now**.

Possible relevance bases:

- office/jurisdiction;
- committee/procedural gate;
- constituency exposure;
- coalition role;
- current demand or communication;
- existing commitment;
- deadline;
- election;
- organization relationship;
- program/state participation;
- legal standing;
- player workstream.

A dossier can show a staff assessment such as:

> Senator Ellis is assessed as persuadable on the industrial package because of state employment exposure and her prior statements; confidence moderate.

It cannot show:

> Hidden support probability: 63.4%

unless that number is explicitly a staff model estimate and presented as such rather than actor truth.

---

# 11. Political lenses remain plural

The State-of-the-Nation experience may present several political lenses simultaneously:

- public-priority estimates;
- media coverage;
- congressional agendas;
- party/campaign emphasis;
- organization activity;
- governor/state activity;
- White House workstreams;
- known electoral pressure.

Every lens identifies:

- producer/measurement basis;
- target population/institution;
- time;
- frame/proposition where needed;
- support/uncertainty.

There is no synthesized `Political Importance` value that controls all of them.

A screen may say:

```text
Housing
Material trend: worsening in several metros
Public-priority polling: moderate nationally, high among renters
Media coverage: low nationally, high locally
Congress: one committee hearing scheduled
Governors: three active requests
White House: monitor
President: no decision required
```

This is useful precisely because the lenses disagree.

---

# 12. Workstream versus Country Watch

This separation is mandatory.

## Country Watch answers

> What observable state and activity can the administration currently discover or monitor?

## Workstreams answer

> What has this administration chosen to pursue, coordinate, monitor formally, or hold?

Therefore:

```text
observable regional housing deterioration
+ no White House workstream
```

is valid.

Likewise:

```text
major administration workstream
+ currently stable material condition
```

is valid when the objective is preventive, legal, inherited, or commitment-driven.

Neglect cannot erase observable conditions.

Adoption cannot manufacture material severity.

---

# 13. Briefing versus State of the Nation

A **Briefing** is a time-bounded administration communication product.

It may summarize:

- since-last-attention changes;
- new evidence;
- workstream progress;
- deadlines;
- delegated outcomes;
- actor/institutional activity;
- decisions now requested.

A **State-of-the-Nation view/report** is broader orientation and exploration.

It can exist even when nothing requires immediate attention.

The briefing is not the entire observable country.

The State of the Nation is not an inbox.

---

# 14. Historical Record versus current view

Current views should answer:

> What does the administration know now?

Historical views should answer:

> What happened, what was known at the time, what was decided, and what later became known?

A decision history should retain the original evidence packet/vintage used.

Example:

```text
March 2029
President chose targeted employment relief
using preliminary payroll estimate A.

June 2029
estimate A was revised materially downward.
```

The Record may show both.

It may not rewrite March's packet to the June number.

---

# 15. Cross-view singularity

One underlying occurrence may appear in:

- Country Watch;
- a workstream;
- an actor dossier;
- a briefing;
- a map;
- the Historical Record.

It remains one occurrence.

One evidence product may appear in several views.

It remains one product/vintage.

One person may appear through office, party, geographic, and workstream views.

They remain one person with role-context distinctions.

One presentation may be referenced from several navigation locations without creating repeated exposure or actor knowledge.

View count is not event count.

---

# 16. Player-facing actions and their causal meaning

A later UI may expose commands such as:

## Pin / Watch

Changes player/admin monitoring preference or creates a legitimate monitoring instruction.

It does not change the country.

## Request analysis

Creates a staff assignment/query under Section 6.

It does not reveal truth instantly.

## Create/Elevate workstream

Creates or changes administration-owned objective/priority state through the applicable office/President authority.

It does not cause Congress, media, the public, or material conditions to care.

## Open actor/institution

Navigation only.

It does not contact the actor.

## Contact / negotiate / direct / communicate

These are separate canonical actions using the accepted actor/admin/presidential routes.

## Hide / dismiss from personal view

Presentation preference only.

It cannot delete:

- a deadline;
- an administration receipt;
- a work assignment;
- a legal duty;
- a historical occurrence;
- another actor's action.

---

# 17. Unknown, missing, inaccessible, and quiet state

The interface must distinguish at least conceptually:

- no material problem observed;
- no recent measurement;
- measurement delayed;
- incomplete coverage;
- modeled estimate only;
- contradictory evidence;
- administration lacks access;
- no reliable national estimate;
- issue politically quiet;
- no administration priority;
- no presidential decision required.

These are radically different states.

Blank UI cannot silently mean `everything is fine`.

---

# 18. Opening presidency

The assumption-of-office experience should use the same contract.

It should orient the player around:

1. **How you got here** — election/campaign record and uncertainty;
2. **Government inherited** — Congress, administration, courts, states, vacancies, programs;
3. **Country inherited** — available material/social/fiscal evidence and trends;
4. **Already moving** — laws, implementation, cases, deadlines, projects, releases;
5. **What requires early choice** — concrete presidential decisions and opportunities.

This is not a scripted prologue.

Every statement derives from generated/current history and accessible evidence.

The opening may contain no immediate national crisis.

---

# 19. Adversarial legibility proofs

## Proof A — revised recession estimate

The player sees a preliminary labor deterioration in Country Watch and a staff recession-risk assessment.

Later revision changes the estimate.

Required:

- underlying material history unchanged;
- current evidence view updates;
- old vintage remains in Record;
- staff assessment may update separately;
- any decision made earlier retains old evidence;
- no duplicate event created.

## Proof B — quiet severe condition

A serious regional environmental/health condition has weak national evidence and no White House workstream.

Required:

- condition does not appear in Attention from truth alone;
- Country Watch may show only the evidence actually available;
- player may request legitimate investigation;
- investigation can return uncertain/insufficient answer;
- no hidden-truth reveal.

## Proof C — politically huge, materially coarse education dispute

Required:

- legal/political actions exact where known;
- public/media/congressional lenses intense;
- material education outcome remains structured/contextual;
- no material deepening from screen prominence;
- presidential authority remains bounded.

## Proof D — Housing views disagree

Required simultaneous display:

- worsening material estimate in several metros;
- moderate national polling salience;
- low national media coverage;
- three governor requests;
- one committee hearing;
- White House monitor status;
- no current presidential decision.

No universal issue score.

## Proof E — actor dossier boundedness

A senator is pivotal.

Required:

- office/jurisdiction and public acts exact;
- private motive absent unless validly known;
- staff persuasion assessment labeled and uncertain;
- constituency data respects Step-3 support;
- personal and official knowledge remain distinct.

## Proof F — map support

State-level labor estimate plus modeled county allocation.

Required:

- state estimate not converted to exact county truth;
- modeled counties visibly distinguished;
- unsupported county detail cannot be queried as exact;
- district/electoral overlay does not silently become residence geography.

## Proof G — same occurrence across five surfaces

Plant P closure appears in Country Watch, an employment workstream, governor dossier, briefing, and Record.

Required:

- one occurrence identity;
- one evidence lineage;
- no fivefold political pressure;
- no five notifications representing five events;
- view aliases remain navigational.

## Proof H — empty Attention

For twenty simulated days, no matter requires presidential action.

Required:

- Attention can be empty;
- Country Watch and briefing still show movement;
- delegated work continues;
- no manufactured event/decision;
- player can advance or proactively investigate/alter priorities.

---

# 20. Anti-cheat requirements

Step 15 rejects:

- raw canonical truth as a player dashboard;
- one `National Condition` object deciding what appears;
- one `Top Issues` ranking;
- one confidence percentage replacing evidence semantics;
- one heatmap implying exact unsupported local values;
- blank/missing data rendered as zero or normal;
- latest revised series replacing historical evidence-at-time;
- actor dossier exposing hidden motives or private state;
- public/media salience treated as material severity;
- administration workstream treated as national importance;
- Country Watch showing only administration priorities;
- State of the Nation becoming an inbox;
- Briefing becoming the whole country;
- search over hidden canonical truth;
- proactive investigation returning debug truth instantly;
- screen prominence creating causal importance;
- hiding a card deleting an obligation/deadline;
- same occurrence duplicated across views;
- same evidence vintage counted as several confirmations;
- map geography substituted silently;
- modeled allocation presented as exact;
- provisional data presented as final;
- staff assessment presented as fact;
- player access to developer provenance/audit graph by default;
- forced presidential decision because the UI would otherwise be empty.

---

# 21. Step 15 binary gate

The detached audit must answer:

> **Can a player orient to the country, inspect material/institutional conditions, distinguish evidence from staff and political interpretation, understand administration priorities and presidential deadlines, discover observable but neglected conditions, inspect actors and history, and drill from overview to evidence without gaining omniscient access or turning interface selection into canonical issue importance?**

PASS requires:

1. Attention, Workstreams, Country Watch/State-of-Nation, Dossiers, Evidence, and Record remain semantically distinct;
2. every load-bearing item can explain identity, time, scope, epistemic class, uncertainty, visibility basis, political context, and administration/presidential status where applicable;
3. summary selection cannot become a hidden issue director;
4. Country Watch remains separate from White House priority;
5. proactive investigation uses assignments/access and can fail or remain uncertain;
6. drill-down never grants hidden truth merely through navigation;
7. maps preserve geography, vintage, support and denominator;
8. provisional/revised/stale/disputed evidence remains legible;
9. actor dossiers preserve bounded knowledge and role context;
10. Historical Record separates known-then from known-now;
11. cross-view references do not duplicate occurrences, evidence, people, pressure, or receipt;
12. empty Attention is valid;
13. opening briefing derives from generated/current history rather than authored truth;
14. all eight adversarial proofs remain coherent.

A PASS establishes only the **State-of-the-Nation information/legibility constitution**.

It does not prove a usable UI, visual hierarchy, implementation, performance, or fun.

---

# 22. Candidate disposition

## **READY FOR DETACHED STEP-15 AUDIT**

The candidate answer is:

> **The player should experience the Living Country through bounded, provenance-bearing projections arranged around Presidential Attention, Administration Workstreams, Country Watch/State-of-the-Nation orientation, Actor/Institution Dossiers, Evidence, and Historical Record. Every layer preserves what is being described, what evidence exists, what staff thinks, what politics is occurring, what the administration has prioritized, and whether anything actually requires the President. Drill-down increases explanation—not omniscience.**

No Step 15 authority exists until detached review, any required repair, unchanged-gate PASS, and a separate authority action.