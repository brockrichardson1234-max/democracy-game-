# Living Country Step 15 — Final Contract Repair

Status: **LIVING-COUNTRY STEP-15 REPAIR CANDIDATE — PRESERVED FOR UNCHANGED DETACHED RE-AUDIT. NOT FINAL UI OR IMPLEMENTATION AUTHORITY.**

This document repairs only the findings returned against:

- `78_LIVING_COUNTRY_STATE_OF_NATION_LEGIBILITY_CONTRACT.md`
- candidate commit: `1e6bc5d1ca25580a6c61bbece7f6d12ef7f423a8`
- detached audit: `79_LIVING_COUNTRY_STEP15_DETACHED_AUDIT.md`
- audit commit: `dd6f6ea6c49edd2209fa2dcca2fd9d265fa1b93b`
- verdict: **REVISE — 1 blocking epistemic finding, 4 bounded clarifications**

Accepted authority beneath this repair:

- Step 5 presidential-game authority;
- Living Country Steps 1–14 authority.

Where this repair conflicts with `78`, this repair controls.

---

# 1. Repair disposition

The candidate's information hierarchy remains intact.

This repair closes five seams:

1. institution/source possession versus White House index, retrievability, administration receipt, and presidential receipt;
2. monitoring coverage and silence provenance;
3. one underlying occurrence versus several legitimate information receipts;
4. view hiding versus mandatory institutional escalation;
5. integrated staff synthesis versus office-specific assessments and dissent.

The central principle is:

> **The interface may help the player navigate knowledge, but navigation may not collapse the institutional process by which knowledge becomes available to the Presidency.**

---

# 2. Closed information-access ladder

## 2.1 Core invariant

**[HARD INVARIANT LC-LEG15R01] A fact, record, evidence artifact, report, communication, or operational state being possessed somewhere in government does not make its content known to the White House or President. Player-visible content must have a legitimate receipt/retrieval route at the level shown.**

The following states remain distinct.

## 2.2 Source/institution possession

An agency, court, statistical office, inspector general, department, state, organization, or other source owns/holds a record or information artifact.

Examples:

- HUD has a grant monitoring record;
- EPA has a regional inspection dataset;
- DOJ has a protected investigative file;
- BLS possesses an unpublished estimate during processing;
- a governor's office has a state implementation report.

Possession at source does not create White House knowledge.

## 2.3 White House index/notice

A designated administration process may know **that a product, record family, report, filing, or source exists** without possessing its full content.

The player may therefore see bounded metadata such as:

```text
HUD quarterly grant-monitoring report available
Coverage: 45 states
Status: not yet reviewed by Domestic Policy
```

if the administration has a legitimate index/notice route.

Index/notice does not permit display of hidden report contents.

## 2.4 Retrievable-on-request

A designated office may have authority and practical ability to request/retrieve content that has not yet been received.

The interface may show:

```text
Available on request from HUD
Estimated staff retrieval/review: routine
Access: unclassified / within executive access
```

It may not show the unretrieved substance as though already known.

## 2.5 Administration receipt/possession

A specific White House/EOP office, designated administration team, or valid administration process has actually received the artifact or content.

Receipt records:

- recipient office/process;
- time;
- artifact/version;
- access/classification;
- scope;
- any summary/attachment relationship.

One office's receipt does not automatically imply every office has the content.

## 2.6 Presidential receipt

The President has legitimately received:

- a briefing;
- decision packet;
- direct communication;
- accessible source attachment opened/retrieved;
- or another valid presidential information route.

Presidential receipt may concern a summary without conveying every source detail.

Example:

```text
staff brief says:
"HUD reports elevated failure risk in 8 awards"
```

The President may know that assessment/statement without having read all underlying award records.

Drilling into those records requires the records to be attached/received or separately retrieved under valid access.

## 2.7 Restricted/inaccessible/unknown

The administration may know a source exists while lacking access.

Or it may have no notice that the source exists.

Possible reasons include:

- statutory confidentiality;
- privilege;
- classification/need-to-know;
- law-enforcement restrictions;
- independent institutional control;
- source protection;
- unavailable record;
- unresolved ownership/access;
- lack of indexing/notice.

The UI may explain the access limitation when the administration legitimately knows it.

It may not reveal the protected content in order to explain why it is protected.

---

# 3. Country Watch content rule

Country Watch is not a federated debug query over every government database.

**[HARD INVARIANT LC-LEG15R02] Country Watch may display substantive content only from information actually received by a designated administration monitoring/retrieval process, or from a direct player retrieval whose execution itself creates a valid receipt.**

Country Watch may separately display metadata/availability when an authorized index tells the administration that a product exists.

Therefore:

```text
agency possesses exact record
→ Country Watch exact content
```

is forbidden unless a receipt/retrieval route occurred.

Valid:

```text
agency report produced
→ standing Domestic Policy feed receives report
→ Country Watch indexes received contents
```

or:

```text
White House index knows report exists
→ player requests retrieval
→ responsible office retrieves/receives report
→ Country Watch/Evidence surface may display received content
```

or, for an unrestricted public source where the product later supports direct presidential research:

```text
player initiates retrieval
→ public artifact is retrieved at current time
→ receipt/notice becomes part of presidential/admin information history
→ artifact can now be read
```

The exact UX latency remains unaccepted. A routine digital retrieval may resolve quickly. It is still an information occurrence rather than retroactive possession.

---

# 4. Search contract

Search is over **known/indexed/retrieved information spaces**, not hidden truth.

A query may return:

- received artifacts;
- indexed metadata;
- public artifacts available through a declared retrieval route;
- known filings;
- known allegations;
- known measurements;
- known actors/institutions;
- items that can be requested from another office/source;
- `no responsive records currently indexed`;
- `access restricted`;
- `additional retrieval/analysis required`.

Search may not answer:

```text
Which governors are secretly planning to defect?
Which programs are actually fraudulent?
What is the true unemployment rate today?
Who privately hates the President?
```

by inspecting canonical state.

A staff-analysis request may attempt to infer or investigate those questions from legitimate evidence.

The result remains an assessment, evidence product, or unresolved answer.

---

# 5. Monitoring-coverage provenance

## 5.1 Core distinction

**[HARD INVARIANT LC-LEG15R03] `No warning` is not equivalent to `no adverse condition`, and `no recent item` is not equivalent to `a current monitoring process found nothing`.**

A load-bearing Country Watch family should be able to expose, where known:

- monitored subject/fact/evidence family;
- producer/source;
- receiving administration office/process;
- standing feed, periodic request, public monitor, or player watch basis;
- cadence/trigger;
- last expected product;
- last successful receipt;
- next expected product where known;
- coverage/support;
- access status;
- current monitoring status.

Potential status semantics include:

- current;
- stale;
- delayed;
- partial;
- feed failed;
- not currently monitored;
- source not producing data;
- known product available but not retrieved;
- restricted;
- unknown.

Exact labels/UI are deferred.

## 5.2 Coverage is not universal

Step 15 does not require standing White House monitoring for every mechanism in America.

A domain may be observable through an agency but absent from the White House's routine Country Watch until:

- a feed/report is established;
- a staff request occurs;
- an actor communicates;
- a public/press monitor surfaces it;
- another institution escalates it.

That absence is part of bounded administration knowledge.

---

# 6. Occurrence singularity versus receipt plurality

**[HARD INVARIANT LC-LEG15R04] One underlying occurrence remains one occurrence, while several independently produced evidence, communication, presentation, or receipt occurrences about it may legitimately exist and must not be collapsed.**

Example:

```text
Plant P closes                   ← one canonical closure

company filing                   ← evidence/public record A
governor request                 ← communication B
Labor report                     ← evidence C
local news investigation         ← media artifact D
Senator call to Legislative Affairs ← communication E
```

The UI may group these under the same underlying closure.

It must preserve that:

- different offices may learn at different times;
- one source may contain new facts another lacks;
- several derivatives may share evidence lineage;
- a governor request is political pressure while a Labor report is not;
- media exposure is not an agency receipt;
- five information routes do not become five plant closures.

Cross-view deduplication prevents duplicate world facts.

It does not erase legitimate information history.

---

# 7. Mandatory escalation survives presentation preferences

A player may hide, collapse, pin, reorder, or mute optional summary presentation.

**[HARD INVARIANT LC-LEG15R05] Presentation preference cannot suppress a later mandatory or valid Presidential Attention item when accepted escalation conditions are satisfied.**

Thus hiding a Housing condition card cannot prevent later surfacing of:

- a presentment deadline;
- court order requiring presidential/legal review;
- nomination decision;
- valid emergency authority question;
- expiring congressional offer;
- staff escalation under the accepted administration contract.

Likewise, `mute topic` cannot mean `President refuses all future official receipt`.

If deliberate refusal/inaction is legally and procedurally available, it must occur through a canonical decision/default.

UI filtering is not governing.

---

# 8. Plural staff assessment and synthesis

The interface may present an integrated administration synthesis only when a real synthesis product/process exists.

A load-bearing assessment retains, where relevant:

- producing office/team;
- as-of time;
- evidence basis;
- assumptions;
- confidence/uncertainty;
- materially different office views;
- dissent;
- whether the synthesis is coordinated/integrated or merely one office's position.

Example:

```text
Economic Advisers:
regional slowdown likely; national recession uncertain.

OMB:
revenue downside material if weakness persists.

Legislative Affairs:
industrial-state senators already reprioritizing.

Integrated Chief-of-Staff brief:
monitor one more release but prepare bounded employment options.
```

The integrated brief is a new administration artifact with its own producer/time.

It does not erase the underlying office assessments.

The UI may summarize disagreement as:

> Staff views differ materially.

with drill-down.

It may not silently choose one office and call it `White House truth`.

---

# 9. Knowledge-preserving drill-down

The controlling rule for overview → detail → record is:

> **A deeper view may reveal more detail already contained in a received/accessible artifact or legitimately retrieve additional information. It may not reveal additional canonical facts merely because the player navigated deeper.**

Three cases therefore differ:

## Case A — detail already received

The President received a packet containing a summary plus attached table.

Opening the table is navigation within already received content.

## Case B — source known but not retrieved

The packet says the underlying agency report is available.

Opening it initiates legitimate retrieval/receipt before content is exposed.

## Case C — source unknown/inaccessible

The UI cannot expose it.

The player may initiate an investigation/request if a valid route exists, or remain unable to know.

---

# 10. Application to State-of-the-Nation hierarchy

The candidate hierarchy remains accepted for re-audit:

```text
WHAT CHANGED?
→ WHAT DO WE ACTUALLY KNOW?
→ WHY MIGHT IT MATTER?
→ WHO IS ACTING?
→ DOES ANYTHING REQUIRE THE PRESIDENT?
→ SHOW THE EVIDENCE / RECEIPT / HISTORY
```

The phrase `what do we know` now means:

> **What the relevant administration/President legitimately possesses or can identify as an assessment—not what the simulation knows.**

The phrase `show evidence` means:

> **Show received evidence, or initiate a valid retrieval where the source is known and retrievable.**

---

# 11. Corrected adversarial cases

## 11.1 EPA owns an exact regional record; White House never received it

Country Watch may show nothing from that record.

If an authorized index says the report exists, it may show metadata only.

A retrieval/investigation can later create receipt.

PASS condition: no exact content leaks before receipt.

## 11.2 Public report exists online but nobody in administration noticed it

Public existence is not historical White House knowledge.

If the player directly searches/retrieves it through a supported public-information action now, a new receipt occurs now.

The Record must not say the administration knew it earlier.

## 11.3 Plant P closes and five offices learn differently

One closure.

Several information artifacts/receipts.

Dedupe the closure; preserve receipt chronology.

## 11.4 Player hides regional Housing card

Card stays hidden from that optional view.

Later valid governor offer with deadline enters Presidential Attention normally.

## 11.5 Staff disagree on unemployment response

State-of-the-Nation may display integrated summary only if an integration product exists.

Otherwise show office-specific views or acknowledge unresolved disagreement.

---

# 12. Unchanged candidate provisions preserved

This repair leaves intact:

- six semantic surfaces;
- material/evidence/staff/politics/admin/presidential separation;
- summary item identity/time/scope/support rules;
- noncausal overview selection;
- Country Watch/workstream separation;
- Briefing/State-of-the-Nation separation;
- proactive investigation as assignment;
- map support/vintage/denominator rules;
- preliminary/stale/revised/methodology-break evidence;
- bounded actor dossiers;
- plural political lenses;
- known-then versus known-now history;
- view singularity;
- explicit causal meaning of UI actions;
- valid empty Attention;
- generated-history opening briefing;
- candidate adversarial proofs.

---

# 13. Re-audit disposition

## **READY FOR UNCHANGED STEP-15 BINARY RE-AUDIT**

The blocking leak is now closed conceptually:

> **The executive branch is not one mind. Source possession, White House notice, retrievability, office receipt, and presidential receipt are different states; State-of-the-Nation navigation can organize or retrieve information only through those legitimate routes.**

This repair claims no Step 15 authority by itself.