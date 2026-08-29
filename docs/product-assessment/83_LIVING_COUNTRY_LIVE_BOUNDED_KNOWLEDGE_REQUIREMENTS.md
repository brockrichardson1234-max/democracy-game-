# Living Country Step 16 — Live Bounded-Knowledge Requirements

Status: **LIVING-COUNTRY STEP-16 DESIGN CANDIDATE — PRESERVED FOR DETACHED REVIEW. NOT ACCEPTED PRODUCT, ARCHITECTURE, UI, RUNTIME, SCHEMA, EARLY-ACCESS, PLAYER-START, ROADMAP, OR IMPLEMENTATION AUTHORITY.**

Authority boundary:

- Accepted production baseline: `44c1724962830225e6fc34f41d0df0cfdb7dfec0`
- Accepted presidential-game product authority: `2c5fc2d798c5fcc232b519052390b56d60f06267`
- Accepted Living Country Steps 1–15 authority, culminating in:
  - `82_LIVING_COUNTRY_STEP15_STATE_OF_NATION_LEGIBILITY_AUTHORITY.md`
  - accepted Step 15 tip before this candidate: `33a9c0b240eef394baade9d37a8c5d0ea758b416`

This is Living Country **Step 16**. It answers:

> **What live bounded-knowledge rules must every player-facing surface, navigation action, update, time advance, save/load, office transition, declassification/restriction change, retrieval, briefing, dossier, search, and historical view obey so that the implemented Presidency can never learn more—or less—than the accepted administration/actor information routes actually support?**

This candidate does not:

- implement a knowledge system;
- choose final UI layout, visual styling, or interaction widgets;
- choose exact memory/forgetting formulas;
- choose exact retrieval latency;
- choose exact classification law or records policy;
- choose Early Access scope;
- choose January 2029 or January 2033;
- create a roadmap or next code proof;
- modify runtime, schemas, source, data, configuration, tests, or production files.

---

# 1. Central answer

The live Presidency requires a persistent, historical **knowledge-and-access ledger** whose controlling principle is:

> **What exists, what an institution possesses, what an office can retrieve, what an office actually received, what was presented to the President, what the President/person can remember, and what may currently be accessed or disclosed are different states.**

The game must preserve them across time, save/load, turnover, transition, revision, classification changes, navigation, and UI refresh.

The broad relationship is:

```text
canonical world state / occurrence
→ source artifact or direct experience
→ source/institution possession
→ index/notice or availability
→ authorized retrieval/delivery
→ office receipt
→ briefing/synthesis or direct presidential presentation
→ personal/presidential knowledge at the conveyed semantic scope
→ later memory / recorded institutional knowledge
```

with separately changing:

```text
current access right
current disclosure right
current classification/restriction
current artifact validity/vintage
current office assignment
current ControlBinding
```

No later state silently rewrites an earlier one.

---

# 2. Five semantic dimensions that may not collapse

Every load-bearing live-information state must preserve, where applicable, five independent dimensions.

## 2.1 Existence

Does the underlying fact, occurrence, artifact, analysis, communication, or record exist?

Existence belongs to its semantic owner.

The player does not gain knowledge from existence alone.

## 2.2 Possession / storage

Which source, institution, office, organization, or person currently holds the artifact or record?

Possession does not imply review, understanding, or White House access.

## 2.3 Access / retrievability

Who is presently permitted and practically able to retrieve or inspect the content?

Access may depend on:

- office;
- role;
- legal authority;
- classification;
- confidentiality;
- privilege;
- need-to-know;
- contractual/institutional rule;
- system/records availability;
- time;
- jurisdiction.

Access is current state.

It can change without changing historical knowledge.

## 2.4 Receipt / presentation

Which office, person, or President actually received or was presented which semantic content, when, through what artifact/communication, and at what level of detail?

Receipt is historical occurrence.

## 2.5 Knowledge / memory

What semantic propositions, frames, estimates, facts, uncertainties, or claims can a person legitimately be treated as knowing or remembering because of:

- direct experience;
- received communication;
- presented document/briefing;
- prior personal knowledge;
- a recorded synthesis genuinely conveyed to them.

Knowledge does not imply truth.

Memory does not imply current authority to retrieve, disclose, or act.

---

# 3. Receipt is not identical to reading or comprehension

## 3.1 Delivery to office

A packet entering the Executive Office, agency, or specific office is an office receipt.

It does not prove the President personally saw any content.

## 3.2 Presidential availability

A packet may be available to the President or scheduled for briefing without yet being presented.

Availability does not imply knowledge.

## 3.3 Semantic presentation

For live player knowledge, the implementation must define a presentation occurrence at a semantic granularity sufficient to distinguish at least:

- title/metadata only;
- notification/preview snippet;
- executive summary;
- specific briefing proposition/claim;
- full memo body;
- attachment/table/appendix;
- underlying evidence artifact.

The player does not need eye-tracking or paragraph-by-paragraph cognition.

The rule is semantic:

> **If substantive content was visibly presented to the human player as presidential information, the simulation must treat that content as having been presented to the President at that time.**

It may not later claim the President never knew the displayed content merely because the user did not click a separate `Read` button.

## 3.4 Opening an attachment

If the President received only a summary and an attachment is available but unopened:

```text
President knows summary
President knows attachment exists where conveyed
President does not automatically know attachment contents
```

Opening the attachment creates a presentation occurrence for its displayed semantic content.

## 3.5 Unread badges

`Unread`, `new`, `reviewed`, and similar UI state are presentation/navigation metadata.

They must not become the sole canonical representation of knowledge.

A badge can be cleared for convenience without erasing what was presented.

Conversely, a packet marked `read` through administrative processing cannot prove the President personally read it unless presentation occurred.

---

# 4. Player knowledge and actor knowledge

## 4.1 ControlBinding rule

While the player controls the President, any substantive live information intentionally presented as presidential information is part of the player-President information set.

The simulation cannot expose substantive information to the user and then expect them to role-play ignorance.

## 4.2 Debug/developer information

Developer, audit, test, replay-inspection, or post-run omniscient views must be clearly outside the live ControlBinding information surface.

Opening a developer/debug panel in development tooling must not create canonical presidential knowledge.

## 4.3 Player inference

The human player may infer something from several already-known facts.

That inference need not become a canonical staff or presidential belief object unless the player creates a communication/decision that records it.

Example:

```text
known: rents rising
known: permits falling
known: governor asking for help
player infers: construction bottleneck may be worsening
```

The interface may let the player act on that inference.

It must not label it `staff conclusion` unless a staff analytical product exists.

## 4.4 UI-derived summaries

A purely presentational aggregation over already accessible facts may exist without becoming a canonical staff artifact.

It must be labeled as a view/projection rather than a staff conclusion when that distinction matters.

If the system produces a new load-bearing estimate, risk score, causal claim, or forecast not already contained in accessible evidence, that requires a legitimate analytical owner/process and artifact.

---

# 5. Office knowledge versus officeholder knowledge

## 5.1 Office-owned records

An office may persist:

- official received documents;
- sent communications;
- staff memoranda;
- recorded assessments;
- assignments;
- decisions;
- commitments;
- logs;
- institutional correspondence;
- authorized data products.

Those records may survive officeholder turnover according to accepted records/access rules.

## 5.2 Officeholder personal knowledge

A person may know things through:

- private conversations;
- personal observation;
- oral briefings;
- memory;
- relationships;
- personal messages;
- unrecorded contextual understanding.

That personal knowledge does not automatically become office institutional knowledge.

## 5.3 Incoming officeholder

When a new officeholder takes over:

```text
existing office records remain
access rights may attach to new role
but personal read/presentation history does not transfer automatically
```

The incoming official may receive transition briefings, read records, or rely on staff synthesis.

Those are new information occurrences.

## 5.4 Unrecorded knowledge may be lost institutionally

If an outgoing official alone knew a fact and never recorded or communicated it:

- the historical record may preserve that the person knew it where supported;
- the office may lose practical access when the person departs;
- the incoming official does not inherit the knowledge magically.

This is permitted institutional amnesia caused by actual information loss, not arbitrary deletion.

---

# 6. President, administration, and succession

## 6.1 Same President, second term

If the same person remains President through reelection:

- personal presidential knowledge and memory do not reset at inauguration;
- office records continue according to institutional rules;
- Cabinet/staff turnover can change which subordinate offices know or remember what;
- new formal briefings are not required to preserve the President's own prior knowledge.

## 6.2 New President

A newly inaugurated President does not inherit the predecessor's private memory.

They may inherit:

- institutional records;
- transition products;
- outgoing administration communications;
- agency records retrievable under current authority;
- continuity/security briefings;
- public information already known independently;
- statutory/legal obligations and operative state.

Specific substantive knowledge transfers only through valid receipt/presentation or independently retained personal history.

## 6.3 Outgoing President

At transfer:

- outgoing President retains personal memory as an actor where the world continues to model them;
- outgoing President loses current presidential access/authority unless another rule grants access;
- losing ControlBinding does not erase what the person historically knew;
- the incoming President does not gain that knowledge merely because the predecessor remains in the historical record.

## 6.4 Vice President and succession

If the Vice President succeeds to the Presidency:

- personal knowledge accumulated as Vice President persists;
- Vice-Presidential office records do not automatically include all Presidential records;
- new presidential access rights may attach at succession;
- newly accessible records are not treated as previously known until retrieved/presented where required.

---

# 7. Staff turnover and organizational continuity

## 7.1 Staff departure

When a staff member leaves:

- their personal memory remains with the departing person;
- office-owned records remain;
- official assignments/queues must be reassigned, suspended, defaulted, or retained;
- recorded analysis remains available subject to access;
- unrecorded private context may disappear from institutional use.

## 7.2 New staff member

A replacement receives:

- role-based access;
- transition material actually provided;
- assignments and records exposed through valid office process.

They do not automatically know every office file merely because they can access it.

## 7.3 Institutional knowledge

A later staff assessment can rely on earlier office records without requiring the incoming official personally to have witnessed the original event.

The assessment must preserve its evidence lineage.

## 7.4 Relationship knowledge

A departing official's private relationship judgment such as:

> Senator Ellis is bluffing.

is not transferred unless:

- recorded as an assessment;
- communicated in transition;
- independently learned by the successor.

The underlying senator remains the same actor.

---

# 8. Classification, confidentiality, privilege, and access changes

## 8.1 Classification is not knowledge

Classification/restriction controls access/disclosure, not truth or memory.

## 8.2 Declassification

Declassification may change:

- who can retrieve the artifact now;
- who may lawfully receive it;
- public-disclosure routes;
- media/public availability after an actual publication/disclosure action.

It does not:

- backdate public access;
- make earlier actors know it;
- alter earlier classified receipts;
- rewrite why an earlier decision was made.

## 8.3 Reclassification or access revocation

If a person previously received content and later loses retrieval authority:

- their historical/personal knowledge is not erased by access revocation;
- the interface may prevent reopening the source artifact;
- disclosure/use may be constrained separately;
- the Historical Record can show the earlier lawful receipt.

## 8.4 Compartmented/restricted access

A White House office may know a record exists while lacking permission to inspect it.

The UI may show:

> Restricted product exists; contents unavailable to this office.

only if the office legitimately knows the metadata/existence.

## 8.5 Privilege and confidentiality

Privilege/confidentiality may limit:

- cross-office sharing;
- public disclosure;
- successor access;
- archive access;
- litigation production.

Those limits are separate from whether the original recipient remembers the substance.

---

# 9. Corrections, revisions, withdrawals, and supersession

## 9.1 Artifact history remains immutable

If the President saw Release V1 and later V2 corrects it:

```text
V1 receipt/presentation remains historical fact
V2 is new artifact/version
```

## 9.2 Current view versus historical view

A current evidence surface may prefer the latest valid vintage.

The Historical Record must still show which vintage informed each past decision.

## 9.3 Withdrawal

If an artifact is withdrawn:

- it may cease to be current accepted evidence;
- historical receipt remains;
- prior belief/decision consequences remain;
- recipient memory need not disappear.

## 9.4 Notification of revision

A revision existing does not mean the President knows it exists.

The revision must follow its own availability/receipt/presentation route.

## 9.5 Silent replacement prohibited

An open chart, memo, or decision record may not silently replace an earlier vintage with a revision while preserving the appearance that the player has been looking at one continuous object.

At minimum, the view must preserve:

- viewed vintage/time;
- new-version availability;
- whether refresh/retrieval occurred.

---

# 10. Live UI refresh and time advancement

## 10.1 Snapshot principle

A dated briefing, memo, evidence artifact, decision packet, and historical record view is a snapshot/versioned product.

Time advancement does not mutate its past contents.

## 10.2 Live surfaces

A live surface such as Country Watch may update during time advancement only from valid new receipts, indexed availability changes, scheduled monitoring outputs, or other accepted information occurrences.

Any substantive new information that becomes visible to the player counts as presentation at that time.

## 10.3 No silent epistemic refresh

If a source updates while the player has a detail view open, the interface may:

- preserve the current viewed vintage and show `new version available`;
- explicitly refresh to the new version and record presentation;
- present a clearly dated live update.

It may not silently replace evidence and later claim the President had the new evidence earlier.

## 10.4 Advance-time notifications

Time advancement may summarize newly received information.

If the summary itself contains substantive claims/numbers, those claims are presented to the President and enter the live information set.

A mere badge count such as `3 new reports` does not convey report content.

## 10.5 Empty attention

Advancing time through an empty Attention state is valid.

No information item may be promoted merely because the UI would otherwise be quiet.

---

# 11. Save/load persistence

## 11.1 Save/load invariance

Saving and loading must preserve exactly enough state that the following do not change merely because a save occurred:

- artifacts that exist;
- possession;
- current access/restriction;
- retrieval history;
- office receipt history;
- presidential presentation history;
- historical evidence vintage;
- unread/new navigation status where product-relevant;
- open assignments/investigations;
- officeholder/personal knowledge state where represented;
- classification/declassification state;
- pending notifications and deadlines.

## 11.2 Reload cannot rerun retrieval

Loading a save may reconstruct projections.

It may not automatically create new canonical:

- searches;
- retrievals;
- receipts;
- staff analyses;
- notifications;
- briefings;
- reads/presentations.

## 11.3 Reload cannot forget presented content

If the President had been shown substantive content before save, reload may not revert it to `unknown` merely because a UI cache was not persisted.

## 11.4 Reload cannot grant content

If an attachment was available but unopened before save, loading may not mark its contents as presidentially known.

## 11.5 Projection recomputation

Noncanonical view projections may be recomputed after load from the same underlying live-information state.

Recomputation must not widen access or fabricate new receipts.

---

# 12. Search, navigation, and retrieval

## 12.1 Search spaces

Live search may query only spaces available through current player/admin semantics, such as:

- already received artifacts;
- office-accessible indices;
- public sources legitimately indexed/queried;
- retrievable agency/institution products under valid authority;
- historical records to which current access exists.

## 12.2 Search result metadata

A search result may expose metadata without content only when the current search/index route legitimately knows the metadata.

## 12.3 Opening search result

Opening a result may be:

- navigation to already received content;
- a new retrieval request;
- denied/restricted;
- unavailable;
- delayed.

The UI must distinguish them.

## 12.4 Search does not become discovery of truth

A query like:

> Which governors are secretly planning to defect?

cannot search actor private beliefs or future choices.

It may return:

- known statements;
- staff assessments;
- communications;
- public reporting;
- relevant evidence;
- `insufficient information`.

## 12.5 Search history

Whether search queries themselves become canonical administration history depends on whether the query represents a meaningful player-requested investigation/assignment.

Pure navigation search need not be canonical action.

A query that causes external retrieval, staff work, or institutional request is a canonical information action.

---

# 13. Briefings and synthesis

## 13.1 Briefing identity

A briefing is a dated administration communication artifact.

It identifies:

- producer/synthesis office;
- source artifacts;
- as-of time;
- content conveyed;
- uncertainty;
- omitted/available attachments where relevant.

## 13.2 Summary does not convey every source

A President receiving a briefing summary knows what the summary conveyed.

They do not automatically know every underlying source detail.

## 13.3 Staff synthesis can be wrong

If a Chief of Staff or economic team synthesizes several reports incorrectly, the President may legitimately know the incorrect synthesis while underlying source artifacts contain different information.

## 13.4 Later source inspection

Opening an underlying report later can change the President's information set and expose disagreement with the briefing.

That does not rewrite what the briefing originally conveyed.

## 13.5 Automatically generated interface synthesis

A UI-only synthesis over already presented facts may help navigation but is not a canonical staff artifact unless a real synthesis process created it.

The system cannot have an omniscient UI calculate a conclusion that no administration analytical process could support and then present it as merely `interface organization`.

---

# 14. Dossiers

## 14.1 Known facts versus assessment

A dossier distinguishes:

- public/official identity and office;
- known communications/actions;
- recorded commitments;
- known relationships;
- evidence;
- office-specific staff assessments;
- uncertainty;
- unknowns.

## 14.2 Dossier updates

New dossier content appears only through valid new information or analysis.

Reload/opening the dossier does not update hidden actor truth.

## 14.3 Staff transition

A dossier may retain prior staff assessments as historical office records.

A new team may produce a different assessment.

The latest assessment does not erase earlier ones.

## 14.4 Personal relationship memory

If the President personally remembers a private conversation with an actor, that can remain in presidential personal knowledge even if no office record contains it.

The incoming President does not inherit that private memory.

---

# 15. Historical Record and knowledge-at-time

The live Historical Record must distinguish:

```text
what happened
what artifacts existed
who possessed them
who could access them
who actually received them
what the President was shown
what the President/actor knew or believed
what later revisions changed
what current access permits
```

## 15.1 Historical Record cannot be omniscient by default

The live player record shows only what the current President/administration is entitled to know or what has become lawfully/publicly available.

Developer provenance may contain more.

## 15.2 Past decision reconstruction

When reviewing a prior presidential decision, the player may inspect the evidence and briefing actually available at that time, subject to current access.

If the current administration now knows more, the record may show a separate `known now` layer.

It must not substitute current knowledge into the past decision pane.

## 15.3 Incoming administration reviewing predecessor

A new President may review official predecessor records that are transferred/accessible.

They do not gain predecessor private memory.

They may discover earlier facts now that the predecessor never saw.

The record must be able to say:

> Agency possessed this in 2027; predecessor White House never retrieved it; current administration obtained it in 2029.

---

# 16. Public information and personal prior knowledge

## 16.1 Public does not equal known

A public article, speech, filing, or report can exist without the President noticing it.

## 16.2 Prior personal knowledge

A person who becomes President may already know public or private facts from their pre-presidential life.

Those facts may carry into the presidency if they belong to the same person and are part of retained actor memory.

## 16.3 Campaign-to-presidency continuity

A victorious candidate retains personal knowledge acquired during the campaign.

Campaign organization records do not automatically become White House institutional records unless transferred through valid transition processes.

## 16.4 Party/organization knowledge

The President being a member/leader of a party does not automatically make every party-held record White House knowledge.

---

# 17. Investigation and new knowledge

## 17.1 Investigation is causal

A player request such as:

> Find out why these Housing grants are failing.

creates a bounded administration assignment.

It may trigger:

- retrieval;
- analysis;
- agency request;
- interviews;
- legal review;
- inspection;
- public-record review.

## 17.2 Investigation result

The result may add new evidence or analysis to office and presidential knowledge only when produced/received/presented.

## 17.3 Investigation failure

The result may remain:

- unknown;
- disputed;
- delayed;
- access-limited;
- insufficient;
- contradictory.

No debug truth is required.

## 17.4 Investigation and hidden wrongdoing

An investigation may uncover evidence of preexisting misconduct.

It does not create the misconduct.

---

# 18. Artificial amnesia is prohibited

The implementation may not make legitimately acquired knowledge disappear merely because:

- the screen was closed;
- the item was hidden;
- the source was later withdrawn;
- access was later revoked;
- a staff member left;
- the evidence was revised;
- the President entered a second term;
- a save was loaded;
- the UI cache was rebuilt;
- a Country Watch item was re-ranked.

However, the game may distinguish:

- personal memory;
- institutional record availability;
- current access;
- current evidentiary validity;
- staff awareness.

A future optional memory-decay model would require separate explicit authority and cannot be inferred from UI disappearance.

---

# 19. Accidental omniscience is prohibited

The implementation may not grant knowledge merely because:

- an agency possesses the record;
- the record is public somewhere;
- a database contains the canonical fact;
- a developer projection can compute the answer;
- a later revision exists;
- an incoming officeholder has technical access;
- a dossier can be recomputed;
- a screen auto-refreshes;
- a save is reloaded;
- a classification label changed;
- a search box can technically find the data;
- the player hovered/clicked deeper without a valid retrieval route.

---

# 20. Player-facing unknown states

The interface must be permitted to say:

- unknown;
- not received;
- report exists but not retrieved;
- source restricted;
- staff has not assessed;
- evidence conflicting;
- current estimate unavailable;
- prior estimate superseded;
- current office has records but President has not been briefed;
- predecessor knew personally, current administration does not;
- public reporting exists but administration has not reviewed it.

These are legitimate game states, not UX failures.

---

# 21. Cross-surface consistency

Attention, Workstreams, Country Watch, Dossiers, Evidence, and Record may present different projections of one subject.

They must not disagree about information history merely because they have different layouts.

Example:

```text
Country Watch:
  BLS revision available; not yet reviewed by Economic Council

Evidence:
  latest presidentially reviewed vintage = V1
  V2 metadata available

Workstream:
  employment response still based on V1 staff assessment

Attention:
  no new presidential decision yet

Record:
  prior decision used V1
```

After legitimate retrieval/briefing:

```text
Evidence:
  V2 received/presented
Workstream:
  staff reanalysis pending or updated
Record:
  V1 remains historical evidence-at-decision
```

No surface may silently jump ahead.

---

# 22. Adversarial live-knowledge proofs

## Proof A — summary received, attachment unopened

```text
Economic Council sends briefing
→ President sees 2-page summary
→ attachment contains county model
→ President does not open attachment
→ save
→ load
```

Required:

- summary remains known;
- attachment existence may be known if conveyed;
- attachment content remains unknown;
- reload creates no new receipt/read.

## Proof B — revision during an open screen

```text
President views preliminary employment release V1
→ time advances
→ agency publishes V2 revision
→ screen remains open
```

Required:

- V1 remains the viewed vintage until explicit/current live update semantics present V2;
- V2 existence/content follows valid receipt route;
- V2 cannot backdate knowledge;
- prior decisions remain linked to V1.

## Proof C — staff turnover

```text
Legislative Affairs director privately hears Senator X may defect
→ tells nobody / records nothing
→ director leaves
→ successor appointed
```

Required:

- departing person may remember;
- office does not magically retain exact private knowledge;
- successor does not inherit it;
- later independent evidence may recreate a similar assessment.

Perturbation:

If director wrote a transition memo, the office retains the memo and successor may receive/read it.

## Proof D — same President reelected

```text
President privately learned governor's concern in term 1
→ reelected
→ second inauguration
```

Required:

- President's personal knowledge persists;
- office/cabinet records follow their own continuity;
- no knowledge reset.

## Proof E — incoming President

```text
predecessor knew classified fact personally
→ fact never entered transferable records
→ new President inaugurated
```

Required:

- new President does not inherit predecessor memory;
- if agency still possesses a retrievable record, new administration may later obtain it through valid route.

## Proof F — declassification

```text
President saw classified intelligence in March
→ document declassified in October
```

Required:

- March knowledge remains;
- October declassification changes current access/disclosure possibilities;
- public does not automatically know until publication/distribution;
- March history remains classified-at-the-time.

## Proof G — access revoked

```text
staff official receives restricted report
→ later removed from office
```

Required:

- official's memory persists where modeled;
- source access can disappear;
- replacement does not inherit personal knowledge;
- office records may remain according to rules.

## Proof H — public article found late

```text
article published June 1
→ no White House receipt
→ President searches topic July 10
→ article legitimately retrieved
```

Required:

- article public since June 1;
- presidential knowledge begins July 10;
- Historical Record distinguishes the dates.

## Proof I — automatic UI synthesis

```text
three already-known state unemployment reports visible
→ UI groups them into regional trend card
```

Required:

- grouping may aid player inference;
- card cannot invent a new canonical staff causal assessment;
- if it calculates a new load-bearing estimate, an analytical process is required.

## Proof J — multiple office receipts

```text
Plant P closure
→ Labor receives filing
→ Legislative Affairs receives senator call
→ Economic Council receives payroll estimate
```

Required:

- one plant closure;
- three legitimate information routes;
- offices can know different subsets at different times;
- President knows only what is actually briefed/presented.

## Proof K — save/load after retrieval request but before result

```text
President requests HUD report
→ retrieval assignment pending
→ save/load
```

Required:

- pending request remains pending;
- load cannot immediately resolve it;
- deterministic continuation produces same later receipt under same conditions.

## Proof L — predecessor record discovered later

```text
agency possessed memo during prior administration
→ predecessor White House never retrieved it
→ new administration retrieves memo
```

Required:

- new administration knows it now;
- record may reveal what agency knew then;
- record cannot claim predecessor President knew it.

## Proof M — withdrawal after decision

```text
President sees poll/forecast
→ makes communication choice
→ producer later withdraws artifact
```

Required:

- original receipt and decision remain;
- current evidence surface marks withdrawal;
- knowledge is not erased;
- later political interpretation may change.

## Proof N — classification changes while open

```text
restricted source open in authorized view
→ role/access changes
```

Required:

- future retrieval may be blocked;
- already displayed content cannot be erased from human memory;
- current UI may close/protect source while preserving historical receipt.

---

# 23. Anti-cheat requirements

Step 16 rejects:

1. office delivery automatically meaning President read every attachment;
2. `read=true` being the only knowledge representation;
3. substantive content shown to the player while simulation treats it as unknown;
4. all agency holdings becoming White House knowledge;
5. all office files becoming new officeholder knowledge;
6. staff turnover cloning private memory;
7. staff turnover deleting official records;
8. second-term inauguration resetting presidential memory;
9. new President inheriting predecessor private memory;
10. public availability becoming automatic notice;
11. declassification backdating public or presidential knowledge;
12. reclassification erasing memory;
13. access revocation erasing historical receipt;
14. revision replacing old evidence-at-decision;
15. open screens silently switching vintages;
16. time advancement showing new substantive content without presentation semantics;
17. reload rerunning retrieval/search/analysis;
18. reload forgetting previously presented content;
19. reload granting unopened attachments;
20. search querying hidden canonical truth;
21. dossiers recomputing hidden motives;
22. UI synthesis manufacturing staff assessments;
23. predecessor knowledge becoming successor knowledge without transfer;
24. campaign records automatically becoming White House records;
25. party knowledge automatically becoming administration knowledge;
26. hiding/closing screens causing amnesia;
27. withdrawn evidence deleting historical knowledge;
28. current access rights rewriting historical access;
29. one person in several roles gaining duplicate independent memories from one presentation;
30. one occurrence multiplied because several offices received different reports about it.

---

# 24. Step 16 binary gate

The detached audit must answer:

> **Can the live Presidency preserve exactly who possessed, could access, received, was presented, knew, remembered, and may currently retrieve/disclose every load-bearing information item across navigation, live refresh, save/load, staff turnover, office succession, presidential transition, classification change, revision, investigation, search, dossiers, briefings, and historical review—without accidental omniscience, artificial amnesia, executive-branch hive mind, or requiring the player to role-play ignorance of content the interface already showed them?**

PASS requires all of the following:

1. existence, possession, access, receipt/presentation, and knowledge/memory remain distinct;
2. office delivery does not equal presidential reading;
3. substantive player-visible content becomes part of the presidential information set at presentation time;
4. summaries and attachments can differ in known scope;
5. office records and officeholder personal memory remain distinct;
6. staff turnover preserves records without cloning memory;
7. same-person second-term continuity preserves personal knowledge;
8. incoming presidents receive only transferred/retrieved/presented knowledge, not predecessor memory;
9. classification/access changes do not rewrite historical knowledge;
10. revisions/withdrawals preserve evidence-at-time;
11. live refresh cannot silently replace vintages;
12. save/load creates neither new knowledge nor artificial forgetting;
13. search/retrieval respects current access and creates canonical information actions only when appropriate;
14. UI-only synthesis cannot masquerade as staff analysis;
15. dossiers remain evidence-bounded;
16. Historical Record separates then-known/currently-known/currently-accessible;
17. proactive investigation can produce new evidence without revealing debug truth;
18. cross-surface views preserve one information history;
19. one occurrence can support multiple genuine receipts without duplication;
20. all fourteen adversarial proofs remain coherent.

A PASS establishes only live bounded-knowledge requirements.

It does not prove runtime implementation, persistence performance, final UX, or fun.

---

# 25. Explicitly not accepted

This candidate does not decide or prove:

1. exact knowledge data structures;
2. exact memory model or forgetting;
3. exact read/unread UX;
4. exact attachment granularity;
5. exact retrieval latency;
6. exact classification/privilege law;
7. exact document-sharing rules;
8. exact records-retention implementation;
9. exact search index implementation;
10. exact query cost;
11. exact UI refresh mechanics;
12. exact notification system;
13. exact dossier format;
14. exact briefing layout;
15. exact Historical Record layout;
16. Early Access scope;
17. January 2029 or January 2033;
18. performance/save size;
19. roadmap or implementation order;
20. next code proof;
21. usability, comprehensibility, balance, fun, or commercial viability.

---

# 26. Candidate disposition

## **READY FOR DETACHED STEP-16 AUDIT**

The candidate answer is:

> **The live presidency must persist a historically truthful distinction between what existed, who possessed it, who could access it, who received it, what was actually presented to the President/player, what each person or office may legitimately know or remember, and what may currently be retrieved or disclosed. Save/load, turnover, transition, revisions, classification changes, and UI navigation may change access and presentation, but may never rewrite that history.**

This candidate is not authority until a detached audit passes and a separate authority receipt explicitly accepts it.