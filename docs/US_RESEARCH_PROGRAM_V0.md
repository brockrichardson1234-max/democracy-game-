# U.S. Research Program V0

Status: **Authority-candidate research-program design only. Not implementation authority.**

Upstream authority:

- Accepted Architecture V0: `54afd51c6ae894df5c3680cf15df472cdcb125b2`
- Accepted synthetic GL0 runtime: `ffc34c0cce1089ff1eeca671243cab7a2e968c43`

This document defines how the project will establish the evidence baseline needed for the first recognizable contemporary United States playable vertical. It does not itself perform the substantive U.S. research.

---

## 1. Purpose and boundary

The research phase exists to answer one bounded question:

> **What is the relevant United States institutional reality required by the first recognizable U.S. playable vertical?**

It does **not** answer the later configuration question:

> **How does that reality instantiate accepted Architecture V0?**

That second question belongs to the later U.S. Configuration Contract V0.

Research is evidence. Research is not engine ontology.

This phase is therefore **not**:

- an attempt to research the entire United States government;
- a complete political-science calibration program;
- a complete constitutional-law model;
- a history project;
- a current-politician database;
- an invitation to redesign Architecture V0;
- authorization to implement U.S. configuration;
- authorization to add U.S. gameplay or UI.

The research scope is bounded by the causal seams already accepted in Architecture V0 and actually exercised by accepted synthetic GL0. The synthetic proof demonstrates seams that include, among others: executive office/control, proposal and legislative procedure, enacted law, appropriation/public finance, obligation/disbursement, administrative program operation, state participation, federal determination, intergovernmental relationships, awards, bounded implementation-support tradeoffs, Housing material consequences, measurement/reporting, public claims, contested authority and judicial restraint/compliance, election result/certification, office transfer, and persistent world continuity.

The research program must make those seams recognizable as a contemporary U.S. configuration without treating synthetic fixtures as evidence that the United States works that way.

The project must preserve the following separations throughout research:

- formal legal rule **!=** ordinary institutional practice;
- ordinary institutional practice **!=** gameplay simplification;
- administrative guidance **!=** binding law unless independently established;
- structural configuration **!=** realism calibration;
- current political content **!=** permanent engine architecture;
- an observed historical episode **!=** a universal institutional rule;
- an implementation convenience **!=** an institutional fact.

---

## 2. Target baseline and temporal discipline

The target is a **contemporary United States institutional baseline**. No claim may silently be treated as timeless.

Every evidence-backed atomic claim must be taggable with at least:

- `asOfDate`
- `jurisdiction`
- `institution`
- `scope`
- `temporalClass`

Allowed `temporalClass` values:

1. `STRUCTURALLY_PERSISTENT`
   - constitutional or institutional facts expected to persist absent formal change;
   - still receives an `asOfDate`.

2. `CURRENT_LAW_OR_RULE`
   - statutes, regulations, chamber rules, election rules, court-controlled rules, or comparable formal authority that may change.

3. `CURRENT_OPERATIONAL`
   - administrative guidance, manuals, program procedure, operating practice, or other mutable implementation detail.

4. `DATA_VINTAGE`
   - empirical claims tied to observation period, release/vintage, revisions, methodology, population/universe, and geography.

5. `TEMPORARY_CURRENT_STATE`
   - transient facts such as officeholder identity, chamber composition, current program status, temporary agency guidance, or current balance/appropriation state.

### 2.1 Required temporal handling

For constitutionally persistent facts, record the current authoritative source and baseline date rather than assuming permanence.

For statutes, rules, regulations, and procedures, record the version/effective date relevant to the baseline.

For chamber membership and seat counts, distinguish:

- structural seat/allocation rules;
- current chamber composition;
- temporary vacancies or officeholder identities.

For election procedures, record the jurisdiction and election type because federal elections combine federal constitutional/statutory constraints with state-administered processes.

For agency/program rules and administrative guidance, identify the responsible authority, version/effective period, and whether the material is binding, interpretive, operational, or explanatory.

For datasets, separately record:

- observation period;
- release date;
- vintage/revision;
- retrieval date.

Current politician/person identities are **not P0 research by default**. They become P0 only when the first vertical genuinely requires the identity itself rather than the office, actor role, coalition role, or institution.

---

## 3. Research classification

Every ledger claim must have exactly one primary evidence class.

### 3.1 STRUCTURAL / CONSTITUTIONAL

Facts about durable governmental structure, constitutional allocation, jurisdiction, institutional existence, offices, term structure, succession structure, federal/state relationship, or comparable foundations.

### 3.2 LEGAL / PROCEDURAL

Facts about operative statutes, rules, thresholds, formal procedures, duties, legal timing, authorities, constraints, remedies, and legally significant exceptions.

### 3.3 ADMINISTRATIVE / OPERATIONAL

Facts about how a responsible institution or program actually executes supported responsibilities: workflow, applications, determinations, grant administration, implementation sequence, reporting, capacity, internal process, and similar matters.

Administrative evidence is not automatically legal authority.

### 3.4 EMPIRICAL / DATA

Measured facts, distributions, outcomes, quantities, geographic differences, timing, material conditions, behavioral frequencies, or other empirically observed realities.

Dataset claims require methodology and vintage metadata.

### 3.5 ORDINARY PRACTICE

Recurrent institutional behavior not fully determined by written law or formal procedure. Ordinary practice must not be inferred merely from the existence of a legal power.

### 3.6 GAMEPLAY SIMPLIFICATION PROPOSAL

A proposed compression, abstraction, omission, aggregation, approximation, or bounded distortion for later configuration/gameplay.

This is **not evidence**.

Every simplification proposal must:

- identify the accepted evidence it simplifies;
- state exactly what is being compressed or omitted;
- explain why the simplification is proposed;
- identify known realism consequences;
- identify whether the simplification affects structure, timing, actor behavior, geography, or data;
- remain outside the evidence-supported claim set.

A simplification proposal may never satisfy a P0 evidence requirement by itself.

---

## 4. Source-authority hierarchy

Source authority is claim-relative: a source must be authoritative for the proposition for which it is cited.

### Tier 1 — primary authoritative sources

Preferred for implementation-critical structural, legal, procedural, official administrative, and official-data claims:

- U.S. Constitution and amendments;
- enacted statutes and U.S. Code, with version/legal-status awareness;
- official House and Senate rules and records;
- official regulations;
- Federal Register material where relevant;
- OMB;
- responsible federal agencies;
- GAO official material where it is the responsible or auditing authority;
- Census and other official statistical agencies;
- official election/government records;
- HUD or another responsible federal agency for the researched program/domain;
- responsible state authorities for state-law/procedure claims;
- federal court rules, opinions, orders, and dockets where the claim actually requires them.

### Tier 2 — high-authority institutional synthesis

- Congressional Research Service;
- GAO analytic reports;
- CBO where fiscal/economic structure is relevant;
- official manuals and handbooks;
- federal/state institutional reports.

### Tier 3 — strong academic / technical evidence

- peer-reviewed literature;
- university scholarship;
- legal scholarship;
- established research organizations with transparent methodology and identifiable underlying evidence.

### Tier 4 — high-quality secondary explanation

Useful for orientation, source discovery, terminology, and cross-checking. Normally insufficient as sole authority for an implementation-critical legal/institutional claim when suitable higher-tier authority exists.

### Unacceptable as authority standing alone

- unsourced blogs;
- random social-media posts;
- AI summaries;
- search-result snippets;
- partisan assertions standing alone;
- Wikipedia standing alone;
- unsourced game-design assumptions.

A secondary source may help locate a primary source. The ledger must cite the source that actually supports the claim.

---

## 5. Claim / evidence ledger schema

Future substantive research must produce an auditable claim ledger. A bibliography or prose memo alone is insufficient.

### 5.1 Atomic claim record

```yaml
claimId: USR-CLM-0001
researchQuestionId: USR-Q-0001
claimText: "One falsifiable or auditable proposition."
claimKind: ATOMIC_FACT | SYNTHESIS | NEGATIVE_FINDING | ARCHITECTURE_FIT_QUESTION | SIMPLIFICATION_PROPOSAL
evidenceClass: STRUCTURAL_CONSTITUTIONAL | LEGAL_PROCEDURAL | ADMINISTRATIVE_OPERATIONAL | EMPIRICAL_DATA | ORDINARY_PRACTICE | GAMEPLAY_SIMPLIFICATION_PROPOSAL
priority: P0_IMPLEMENTATION | P1_CALIBRATION | P2_ENRICHMENT
status: UNRESEARCHED | SUPPORTED | SUPPORTED_WITH_BOUNDS | CONFLICTED | NOT_ESTABLISHED | NOT_REQUIRED | DEFERRED
asOfDate: YYYY-MM-DD
jurisdiction: "..."
institution: "..."
scope: "..."
temporalClass: STRUCTURALLY_PERSISTENT | CURRENT_LAW_OR_RULE | CURRENT_OPERATIONAL | DATA_VINTAGE | TEMPORARY_CURRENT_STATE
sourceIds: [USR-SRC-0001]
pinpointRefs: ["..."]
supportRelations: [DIRECT | CORROBORATION | CONTEXT | CONTRARY | METHODOLOGY | DEFINITION]
confidence: HIGH | MEDIUM | LOW
ambiguity: "..."
implementationCriticality: "why this matters, or null"
dependsOnClaimIds: []
conflictsWithClaimIds: []
simplifiesClaimIds: []
architectureSeamRefs: []
auditStatus: UNAUDITED | FINDING_OPEN | REPAIRED_PENDING_RECHECK | RECHECKED
notes: "..."
```

### 5.2 Source record

```yaml
sourceId: USR-SRC-0001
title: "..."
issuingBody: "..."
sourceTier: 1 | 2 | 3 | 4
sourceType: "constitution/statute/rule/regulation/report/dataset/opinion/etc"
authorityStatus: "official/current/archived/positive-law/etc as relevant"
publicationDate: YYYY-MM-DD | null
effectiveDate: YYYY-MM-DD | null
versionOrVintage: "..."
retrievedAt: "timestamp"
stableIdentifier: "URL/citation/report number/docket/etc"
retainedContentHash: "optional hash where a retained snapshot is appropriate"
```

### 5.3 Dataset extension

Empirical claims additionally record:

- observation start/end dates;
- release date and vintage;
- revision status;
- population/universe;
- geography;
- variable definition;
- methodology;
- uncertainty/margin of error where applicable;
- transformation performed by the researcher.

### 5.4 Atomic facts, synthesis, and proposals

An atomic fact is one proposition that an auditor can test against one or more sources.

A synthesis claim may combine supported atomic claims, but it must list those dependencies and must not hide a new unsupported proposition.

A negative finding must state the search boundary and cannot convert failure to find evidence into evidence that something never occurs.

A gameplay simplification proposal must remain explicitly non-evidentiary.

Contrary evidence is retained. It is not deleted because another authority appears stronger.

---

## 6. Research scope and question inventory

Research priority has three levels:

- `P0_IMPLEMENTATION` — required before authoring a defensible first U.S. Configuration Contract;
- `P1_CALIBRATION` — realism/tuning evidence that can wait until structurally correct U.S. configuration exists;
- `P2_ENRICHMENT` — broader content not required by the first vertical.

The list below is a research **question inventory**, not a claim that any described U.S. mechanism is already established.

### 6.1 P0 — federal institutional frame

Research only the constitutional/institutional facts required to instantiate GL0's supported federal governing roles and relationships:

- relevant federal institutions;
- relevant offices;
- office/institution relationships;
- assignment/term/succession structure;
- federal versus state jurisdiction relevant to the vertical;
- which institutions possess which formal responsibilities relevant to the supported loop.

### 6.2 P0 — legislative route

Establish the formal and ordinary procedural route required by GL0 from policy proposal through the bicameral Congress, including the distinct House and Senate chambers, chamber procedure, actor decisions, passage, inter-chamber reconciliation where required, enactment, and any signature/veto/override stages actually exercised by the first vertical.

Research only exceptions that can materially affect the supported route.

This package must preserve the architecture distinction between:

- procedure rules;
- procedure-instance facts;
- actor decisions;
- pending proposal;
- enacted law.

### 6.3 P0 — fiscal authority and execution

Establish the bounded real-world fiscal chain needed by the vertical, while preserving the architecture's distinct seams among:

- legal authority;
- appropriation or other budget authority where relevant;
- allocation/apportionment where relevant;
- award;
- obligation;
- payment/disbursement;
- material outcome.

Do not research the entire federal budget process unless the first vertical cannot be made recognizable without a broader piece.

### 6.4 P0 — executive / administrative implementation

Identify the responsible institution(s), formal authority, administrative workflow, grant/program lifecycle, application process, determinations, conditions, reporting, and operational sequence required by the vertical.

This package must separately identify:

- binding law/rule;
- administrative procedure;
- ordinary operational practice.

### 6.5 P0 — federalism and state participation

Establish the legal and operational basis for the state-level participation seam actually supported by GL0:

- relevant state decision authority;
- participation/nonparticipation mechanics;
- federal application or eligibility determination where relevant;
- intergovernmental relationship creation;
- implementation variation needed by the vertical.

Do not model all fifty state governments merely because states exist.

### 6.6 P0 — Housing material seam

Research only the evidence necessary to make accepted Housing GL0 causality recognizable, including as required by the selected first vertical:

- the relevant federal housing/material intervention mechanism;
- appropriate geographic unit(s);
- baseline material measures;
- project/construction latency concepts;
- capacity/constraint concepts;
- official or high-quality measurement sources;
- which material variables can plausibly respond to supported governmental actions.

This is not authorization for a complete housing-market, zoning, mortgage, construction-industry, land-use, or macroeconomic model.

### 6.7 P0 — measurement, reporting, and information artifacts

Establish:

- what relevant material facts are measured;
- by whom;
- at what cadence;
- with what reporting lag;
- with what revision behavior;
- at what geographic level;
- which official or high-quality data products can support the first vertical's information seam.

Research must preserve the architecture distinction:

> material truth != measurement != information artifact.

### 6.8 P0 — public claims / interpretation and player-knowledge seam

Research only enough ordinary practice to establish how institutions or political actors can publicly interpret or characterize official information in ways needed by the first vertical.

The research need not build a complete media ecosystem. The minimum question is whether the supported distinction among underlying measurement, public claim, belief/attribution, and political reaction can be grounded without making public claims themselves canonical material truth.

Also establish, without authoring configuration, what information the executive administration legitimately possesses through its institutional role and official artifacts. Preserve the `ControlBinding` boundary: evidence about institutional access and knowledge does not itself decide player permissions, hidden information, or interface presentation.

### 6.9 P0 — electorate, election, certification, succession

Research the institutional structure actually required for the first vertical:

- electorate eligibility/aggregation at the level represented;
- presidential election/result handling as needed by the vertical;
- certification or other authoritative result stages relevant to the handoff;
- successor entitlement;
- term timing;
- office transfer/control transition.

Avoid named current candidates or officeholders unless separately justified.

### 6.10 P0 — bounded contested-authority / judicial seam

Research only the legal/procedural route needed for the selected first-vertical contested-authority scenario:

- what act is contested;
- who may contest it;
- appropriate jurisdiction/venue only as needed;
- interim relief/remedy only as needed;
- order issuance/receipt;
- compliance/refusal/appeal posture only to the extent supported by GL0.

Do not turn this into a general constitutional-law or federal-courts simulator.

### 6.11 P0 — cross-seam calendars

Establish enough real-world timing to avoid impossible composition across:

- terms;
- legislative procedure;
- enactment;
- fiscal execution;
- applications/determinations;
- awards/obligations/disbursements;
- implementation/material latency;
- measurement/release lag;
- election/certification/transfer.

The research goal is structural temporal plausibility, not fine-grained balance tuning.

### 6.12 P0 — architecture-fit questions

For each P0 package, identify whether the accepted evidence appears to fit the existing architecture seam without modification.

If not, record an `ARCHITECTURE_FIT_QUESTION`; do not redesign the engine in research.

### 6.13 P1 — deferred calibration research

The following normally waits until after structurally correct U.S. configuration exists:

- legislative bargaining probabilities;
- amendment/pass/fail frequency models;
- state-participation probabilities;
- administrative-efficiency coefficients;
- grant take-up distributions;
- construction-delay distributions;
- capacity coefficients;
- affordability-response magnitudes;
- measurement/report error distributions;
- persuasion and attribution effect sizes;
- salience/preference dynamics;
- turnout and polling calibration;
- actor strategy probabilities;
- exact fiscal, political, or material balance;
- player-facing pacing.

A P1 question can be promoted to P0 only if a later configuration author demonstrates that no bounded recognizable implementation can be specified without it.

### 6.14 P2 — enrichment

Examples:

- named current politicians;
- transient campaign content;
- broad historical case libraries;
- additional agencies and programs;
- full fifty-state variation;
- additional courts/disputes;
- extra policy domains;
- content not exercised by the first vertical.

### 6.15 Exactly four substantive research packets

The workstreams above are executed through exactly four substantive packets. A workstream is not a separate packet or audit gate. Every P0 workstream has exactly one primary packet, although cross-cutting timing and architecture-fit questions may be referenced wherever needed.

Primary mapping:

| P0 workstream | Primary packet |
|---|---|
| 6.1 federal institutional frame | Packet A |
| 6.2 legislative route | Packet A |
| 6.3 fiscal authority and execution | Packet B |
| 6.4 executive / administrative implementation | Packet B |
| 6.5 federalism and state participation | Packet B |
| 6.6 Housing material seam | Packet B |
| 6.7 measurement, reporting, and information artifacts | Packet C |
| 6.8 public claims / interpretation and player knowledge | Packet C |
| 6.9 electorate, election, certification, succession | Packet A |
| 6.10 contested-authority / judicial seam | Packet C |
| 6.11 cross-seam calendars | Packet D |
| 6.12 architecture-fit questions | Packet D |

#### Packet A — U.S. Federal Political Structure

**Purpose:** Establish the constitutional and institutional skeleton of the recognizable U.S. configuration.

**Included questions:** Federal institutional topology; Congress, House, and Senate; the legislative route; executive office and administration; presidential term and succession; election, certification, and transfer; federalism and state identities/geography needed by these structures; and the timing relevant to these subjects.

**Required inputs:** Accepted Architecture V0, accepted synthetic GL0, this research-program authority, and the packet's assigned P0 questions.

**Dependencies:** None beyond the governing authorities.

**Required source classes:** STRUCTURAL / CONSTITUTIONAL and LEGAL / PROCEDURAL evidence, supplemented by ADMINISTRATIVE / OPERATIONAL and ORDINARY PRACTICE evidence where the supported route requires them.

**Expected outputs:** Standard packet output below, with atomic claims sufficient to establish the relevant institutional topology and routes.

**Stopping rule:** Stop when the first vertical's federal political, legislative, electoral, succession, federalism-topology, and related timing seams are evidence-ready. Do not research unrelated institutions or political history.

**Prohibited scope:** Selecting the detailed Housing-program analog; researching fiscal grant mechanics beyond institutional relationships; gameplay calibration; configuration authoring; runtime work.

#### Packet B — Federal Finance + Housing Implementation

**Purpose:** Establish the bounded fiscal, administrative, intergovernmental, and Housing implementation chain required by GL0.

**Included questions:** Authorization, appropriation or budget authority as relevant; obligation, disbursement, and outlay concepts; unobligated balances and bounded executive discretion relevant to the hostile path; responsible federal institutions; candidate Housing program/grant analog comparison; state/subnational participation; application, determination, award, and implementation relationships; administrative capacity and uneven delivery; the bounded Housing material seam; and relevant fiscal/program timing.

**Required inputs:** Packet A's institutional baseline plus the governing authorities and assigned P0 questions.

**Dependencies:** Packet A.

**Required source classes:** LEGAL / PROCEDURAL, ADMINISTRATIVE / OPERATIONAL, EMPIRICAL / DATA, ORDINARY PRACTICE, and supporting STRUCTURAL / CONSTITUTIONAL evidence.

**Expected outputs:** Standard packet output below, including evidence-backed comparison of plausible analogs without selecting the configuration result.

**Stopping rule:** Stop when the first vertical's fiscal-to-administrative-to-material causal chain is evidence-ready with bounded alternatives and uncertainties.

**Prohibited scope:** Assuming the synthetic grant/state structure is real; selecting the final analog as configuration; completing the federal budget system, housing market, or fifty-state administrative model; gameplay calibration; runtime work. If the strongest real analog routes differently, record that evidence rather than forcing the synthetic route.

#### Packet C — Judiciary + Information + Player Knowledge

**Purpose:** Establish the bounded contested-authority, official-information, interpretation, and institutional-knowledge seams required by the first vertical.

**Included questions:** A bounded contested executive-authority route; plausible forum; interim relief; operative judicial order; order receipt and compliance; appeal/stay seam; official Housing measurement and reporting; release lag and revisions; public claims and interpretation; what the executive administration legitimately knows; and related timing.

**Required inputs:** Packet A and, where a concrete contested or measurement route requires it, the leading institutional mechanism emerging from Packet B.

**Dependencies:** Packet A and the relevant bounded Packet B mechanism.

**Required source classes:** LEGAL / PROCEDURAL, ADMINISTRATIVE / OPERATIONAL, EMPIRICAL / DATA, ORDINARY PRACTICE, and official information artifacts.

**Expected outputs:** Standard packet output below, preserving the distinctions among order, receipt, compliance, material truth, measurement, public claim, institutional knowledge, and later player-control decisions.

**Stopping rule:** Stop when one plausible contested-authority route and the required information/knowledge routes are evidence-ready for the first vertical.

**Prohibited scope:** A complete federal-court hierarchy; a media ecosystem; public-opinion or persuasion calibration; player-interface design; configuration authoring; runtime work.

#### Packet D — Implementation Data + Cross-Packet Synthesis

**Purpose:** Establish reproducible implementation-data inputs and synthesize the four-packet evidence baseline into configuration readiness.

**Included questions:** Authoritative implementation data-source inventory; state identifiers and geography acquisition strategy; chamber/seat/configuration sources; electoral data/configuration sources; bounded demographic/population-weight sources if needed; licensing/public-domain considerations; cross-packet contradiction and temporal-baseline reconciliation; claim/evidence ledger consolidation; cross-seam calendars; architecture-fit questions; and the completed U.S. Configuration Readiness Matrix.

**Required inputs:** Completed outputs from Packets A–C and the governing authorities.

**Dependencies:** Packets A–C.

**Required source classes:** The source classes required by each consolidated claim, with particular attention to official datasets, source status, version, vintage, licensing, and retained provenance.

**Expected outputs:** Standard packet output below plus the cross-packet synthesis, consolidated ledger, mutable-P0 register, unresolved-gap register, and completed readiness matrix.

**Stopping rule:** Stop when cross-packet conflicts are bounded, required implementation sources are identified, all P0 questions have an auditable status, and every required readiness row can be evaluated.

**Prohibited scope:** Replacing evidence from Packets A–C; silently resolving unsupported conflicts; authoring configuration values; performing P1/P2 calibration; runtime or UI work.

#### Standard packet output

Every packet produces the same numbered structure:

1. Scope
2. Questions answered
3. Executive summary
4. Claim/evidence ledger additions
5. Primary-source findings
6. Formal-rule versus ordinary-practice distinctions
7. Contradictions, ambiguity, and supported bounds
8. Facts relevant to accepted architecture seams
9. Gameplay simplification candidates — explicitly **NON-EVIDENCE**
10. Deferred questions
11. Source inventory
12. Evidence gaps

Packet D additionally produces the cross-packet synthesis and U.S. Configuration Readiness Matrix. Packet completion does not create a separate audit gate; the exact combined evidence candidate is audited only after all four packets are complete.

---

## 7. Research execution method

Future substantive research must proceed through the four bounded research packets, not open-ended essays.

### Step 1 — execute the assigned packet

Start from one of Packets A–D, its mapped P0 questions, and the accepted Architecture V0/GL0 seams that make them necessary. A packet executor may decompose work internally, but must deliver one bounded packet output rather than create a gate per workstream.

### Step 2 — decompose before concluding

Break the question into atomic propositions separated by evidence class. Do not combine law, administration, ordinary practice, and calibration in one claim.

### Step 3 — search top-down through authority

Use the strongest suitable source tier available. Secondary explanation may orient or locate primaries but must not replace stronger authority for critical claims without justification.

### Step 4 — capture provenance immediately

For every relied-on source capture:

- exact title/body;
- issuing authority;
- source tier/type;
- version/effective date/vintage;
- stable locator;
- pinpoint support;
- date/jurisdiction/scope;
- relation to the claim.

### Step 5 — corroborate where proposition type requires it

- A narrow formal legal rule may be established by one controlling primary authority.
- Ambiguous legal interpretation may require primary text plus authoritative synthesis or case law.
- Administrative operation may require responsible agency material plus corroboration where formal documents underdescribe practice.
- Ordinary-practice claims normally require multiple appropriate observations or systematic scholarship.
- Empirical claims require methodologically suitable data and definitions.

### Step 6 — retain conflicts

Contrary authority/evidence must remain linked in the ledger.

When sources conflict, determine whether the conflict arises from:

- date;
- jurisdiction;
- source authority;
- definition;
- factual disagreement;
- methodological difference;
- different institutional layers.

Unresolved implementation-critical conflict blocks freeze.

### Step 7 — distinguish negative findings

A failed search is `NOT_ESTABLISHED`, not proof of absence.

A true negative claim requires affirmative evidence appropriate to the claim.

### Step 8 — bound uncertainty

Prefer a narrower supported claim over a broad low-confidence claim. Use `SUPPORTED_WITH_BOUNDS` where support is real but qualified.

### Step 9 — stop at implementation-relevant resolution

Stop when the packet's P0 questions are answered to the level necessary for the first vertical and its stated output and stopping rule are satisfied. Do not continue collecting interesting but unnecessary government facts.

---

## 8. Evidence readiness and configuration handoff

Accepted research evidence becomes an input to the later U.S. Configuration Contract V0. Research documents may annotate claims with `architectureSeamRefs` pointing to already accepted concepts. Those references are traceability aids only; they do not create schemas, fields, owners, systems, actor types, or mechanics.

### 8.1 U.S. Configuration Readiness Matrix

Packet D must produce a non-normative **U.S. Configuration Readiness Matrix**. The matrix asks only:

> Do we possess enough accepted evidence to author configuration for this seam?

It must not answer which code or configuration value will be implemented.

Required schema:

```yaml
seamId: USR-SEAM-001
architectureConcept: "accepted Architecture V0 concept"
firstVerticalRequirement: "why the seam is or is not required"
claimIds: []
evidenceClassCoverage: []
temporalBaseline: "..."
readinessStatus: READY | READY_WITH_BOUNDS | NOT_READY | NOT_REQUIRED
boundedUncertainty: "..."
unresolvedDependencies: []
notes: "non-normative evidence-readiness notes only"
```

The completed matrix must include at least these rows:

- Jurisdiction;
- Institution;
- PoliticalActor;
- Office;
- OfficeAssignment;
- Legislature;
- Legislative chamber;
- Legislative procedure;
- Legal source;
- PublicFinance;
- FiscalExecution;
- Administrative program/institution;
- Intergovernmental relationship;
- Geography;
- Population;
- Electoral boundary/process;
- Election result/certification;
- Executive succession/transfer;
- Judiciary;
- LegalContest;
- JudicialOrder;
- Administrative compliance;
- Information artifact/measurement;
- player institutional knowledge / `ControlBinding` boundary;
- Time/transitions;
- Housing material owner.

No required first-vertical row may remain `NOT_READY` at freeze. `NOT_REQUIRED` requires an explicit first-vertical rationale. `READY_WITH_BOUNDS` must identify the bounded uncertainty and why it remains safe for configuration authoring.

### 8.2 Exact configuration handoff bundle

The frozen evidence handoff to U.S. Configuration Contract V0 consists of:

- accepted Architecture V0 SHA;
- accepted synthetic GL0 runtime SHA;
- accepted U.S. evidence-baseline SHA;
- complete claim/evidence ledger;
- Packet A–D outputs;
- Packet D cross-packet synthesis;
- completed U.S. Configuration Readiness Matrix;
- freeze-time mutable-P0 revalidation record;
- accepted gameplay simplification candidates, clearly marked **NON-EVIDENCE**;
- bounded unresolved uncertainties;
- deferred P1/P2 register;
- resolved architecture-fit records;
- every explicit `NOT_REQUIRED` rationale.

For every later implementation-critical configuration decision, the configuration contract must identify accepted claim/source IDs, the relevant accepted seam, any explicit simplification, and whether the mapping is direct, aggregated, approximated, or deferred. The configuration author must not need another broad research phase. A newly discovered direct evidence gap may be routed back narrowly, but does not reopen the entire research program.

### 8.3 Architecture-fit questions and reopening threshold

An `ARCHITECTURE_FIT_QUESTION` does **not** reopen Architecture V0. It records supported claim IDs, the exact accepted seam or invariant thought insufficient, the minimum mismatch, and why it matters to the first vertical.

Every fit question follows this required resolution order:

1. **Represent through existing configuration.** Test whether the fact can instantiate already accepted concepts and owners.
2. **Deliberately simplify with evidence.** Test a bounded compression that preserves the relevant causal relationship. The proposal remains **NON-EVIDENCE**.
3. **Defer.** If the distinction is outside the first vertical, determine whether it can be deferred without making the supported route incorrect.
4. **Architecture-reopen consideration.** Only after the first three alternatives fail may reopening even be considered.

Reopen consideration additionally requires at least one demonstrated condition:

- a direct contradiction with accepted Architecture V0;
- a required canonical fact has no semantic owner;
- duplicate ownership is unavoidable;
- an accepted causal path is impossible without violating an invariant;
- deterministic or persistence semantics cannot represent the required fact.

Configuration awkwardness, a preference for a cleaner abstraction, greater realism from another design, or the existence of a U.S. special case does not qualify.

Any escalation record must contain:

- evidence claim IDs;
- exact Architecture V0 seam/invariant;
- attempted existing-configuration mapping and why it failed;
- considered bounded simplification and why it failed;
- considered deferral and why it failed;
- exact qualifying reopen condition.

Researchers and auditors do not reopen Architecture V0. They must not invent ontology, change ownership, add systems, redefine seams, or embed a U.S.-specific engine special case.

---

## 9. Freeze criteria

The U.S. evidence baseline is frozen enough to authorize **U.S. Configuration Contract V0 authoring** only when all conditions below are met:

1. The evidence candidate is identified by an exact repository SHA.
2. All four research packets are complete.
3. Packet D cross-packet synthesis is complete.
4. Every P0 question is `SUPPORTED`, `SUPPORTED_WITH_BOUNDS`, or justified `NOT_REQUIRED`.
5. Implementation-critical claim/source provenance and pinpoints are complete.
6. Temporal, jurisdictional, institutional, and scope metadata are complete.
7. Formal law and ordinary-practice distinctions are explicit.
8. Contradictions and genuine uncertainty are explicitly represented.
9. Exactly three independent first-pass audits—A, B, and C—completed against the same evidence SHA.
10. Zero `BLOCKER` findings remain open.
11. Zero `HIGH` findings remain open.
12. The one bounded research repair, if required, is complete.
13. Findings-only rechecks by the original auditors closed every repaired `BLOCKER` and `HIGH`.
14. Every mutable P0 dependency has a completed freeze-time revalidation record.
15. The Configuration Readiness Matrix has no unexplained required `NOT_READY` row.
16. Gameplay simplifications remain separate **NON-EVIDENCE** proposals traceable to evidence.
17. No hidden Architecture V0 contradiction or unresolved qualifying `ARCHITECTURE_FIT_QUESTION` blocks a required path.
18. P1/P2 areas remain explicitly deferred and need not be completed.
19. The frozen evidence authority is identified by exact repository SHA.

Freeze means sufficient evidence for configuration authoring, not permanent truth and not runtime implementation authorization.

---

## 10. Change control, staleness, and freeze-time revalidation

The accepted evidence baseline is versioned by exact repository SHA.

### 10.1 Mutable P0 classes

Every mutable P0 claim/source dependency must be revalidated at freeze time. Mutable classes include:

- current statutes or rules whose version can change;
- chamber rules;
- election-administration rules;
- current administrative regulations or guidance;
- active program materials;
- official procedural manuals;
- fiscal/program authorities;
- current datasets and vintages;
- other mutable P0 authority or temporary current-state facts.

### 10.2 Required revalidation record

```yaml
claimId: USR-CLM-0001
sourceId: USR-SRC-0001
mutableClass: "..."
originalValidatedAt: "timestamp"
freezeRevalidatedAt: "timestamp"
result: UNCHANGED | CHANGED | UNAVAILABLE
replacementSourceId: null
claimImpact: "..."
readinessImpact: "..."
```

`CHANGED` or `UNAVAILABLE` blocks freeze unless the evidence candidate updates or replaces the evidence, narrows the claim, records supported bounds, removes the dependency, or marks the affected required path `NOT_READY`. Revalidation is a freeze prerequisite, not an optional later staleness review.

### 10.3 Evidence-baseline reopen triggers

After freeze, the evidence baseline is reopened only when an implementation-critical source changes materially, a configuration audit finds an unsupported dependency, new authoritative evidence creates or resolves a material contradiction, or first-vertical scope changes enough to require deferred research.

Reopening produces a bounded delta: changed claims and sources, affected readiness rows and configuration decisions, and the required re-audit surface. A new officeholder, election result, news event, or policy debate does not automatically reopen structural research unless the first vertical depends on that transient fact.

---

## 11. Research artifacts and repository discipline

This program intentionally defines only two primary authority-candidate planning documents:

1. `docs/US_RESEARCH_PROGRAM_V0.md`
2. `docs/US_RESEARCH_AUDIT_PROTOCOL_V0.md`

Future substantive research may require claim/evidence datasets or bounded evidence artifacts, but this design phase must not create a forest of tiny authority/planning documents.

This candidate does not authorize:

- substantive U.S. research execution;
- U.S. Configuration Contract authoring;
- U.S. runtime configuration;
- simulation architecture changes;
- U.S. gameplay;
- UI work.

---

## Appendix A — research packet template

```text
Research packet: A | B | C | D
Purpose:
Included mapped questions:
Required inputs:
Dependencies:
Required source classes:
Prohibited scope:
Stopping rule satisfied:
Researcher SHA/snapshot:

1. Scope
2. Questions answered
3. Executive summary
4. Claim/evidence ledger additions
5. Primary-source findings
6. Formal rule vs ordinary-practice distinctions
7. Contradictions / ambiguity / supported bounds
8. Facts relevant to accepted architecture seams
9. Gameplay simplification candidates — NON-EVIDENCE
10. Deferred questions
11. Source inventory
12. Evidence gaps
```

## Appendix B — mandatory researcher self-check before audit

Before handing a research baseline to independent audit, confirm:

- no P0 claim relies solely on an unacceptable source class;
- no claim silently mixes formal law and ordinary practice;
- no gameplay simplification is labeled as evidence;
- every quote/paraphrase has a reconstructible pinpoint;
- every current/mutable claim has an effective date or vintage;
- every dataset claim includes universe, geography, methodology, and observation period;
- contrary evidence is retained;
- unsupported negative claims are not presented as facts;
- architecture-fit questions are recorded instead of silently redesigning the engine;
- deferred calibration remains deferred unless formally promoted to P0.

## Appendix C — Prompt 1: Research Packet Executor

```text
You are the U.S. RESEARCH PACKET EXECUTOR for Packet <A/B/C/D>.

EXACT AUTHORITIES
- Accepted Architecture V0 SHA: <sha>
- Accepted synthetic GL0 runtime SHA: <sha>
- U.S. Research Program V0 authority: <exact sha>
- U.S. Research Audit Protocol V0 authority: <exact sha>
- Evidence working-candidate base SHA: <exact sha>

ROLE AND PERMITTED WORK
Execute only Packet <A/B/C/D> as defined by U.S. Research Program V0. Research only its mapped P0 questions and necessary direct dependencies. Follow the claim-relative source hierarchy. Create or update atomic claim records, source records, dataset extensions, contradictions, bounds, architecture seam references, and packet outputs. Preserve contrary evidence. Distinguish STRUCTURAL / CONSTITUTIONAL, LEGAL / PROCEDURAL, ADMINISTRATIVE / OPERATIONAL, EMPIRICAL / DATA, ORDINARY PRACTICE, and GAMEPLAY SIMPLIFICATION PROPOSAL. Label every gameplay simplification NON-EVIDENCE.

PROHIBITED WORK
Do not research another packet except for a named direct dependency. Do not expand into P1/P2 work. Do not treat synthetic fixtures as U.S. facts. Do not select configuration values, author U.S. Configuration Contract V0, redesign or reopen Architecture V0, modify runtime/tests/UI, or perform an audit.

OUTPUT
Return the standard twelve-part packet output exactly as defined by the program, the exact artifact SHA, all ledger/source additions, unresolved evidence gaps, and an explicit packet-boundary attestation. Packet D must additionally return the cross-packet synthesis, consolidated ledger, mutable-P0 register, and U.S. Configuration Readiness Matrix.

STOPPING CONDITION
Stop when the assigned packet's required outputs and stopping rule are satisfied. If an essential dependency is unavailable or a qualifying architecture-fit question remains, record it precisely and stop; do not solve it by unauthorized expansion or configuration design.
```

## Appendix D — Prompt 8: U.S. Configuration Contract Author

```text
You are the U.S. CONFIGURATION CONTRACT V0 AUTHOR.

BEGIN ONLY AFTER EVIDENCE FREEZE.

EXACT AUTHORITIES AND INPUTS
- Accepted Architecture V0 SHA: <sha>
- Accepted synthetic GL0 runtime SHA: <sha>
- Exact accepted U.S. evidence-baseline SHA: <sha>
- Accepted U.S. Research Program V0 SHA: <sha>
- Accepted U.S. Research Audit Protocol V0 SHA: <sha>
- Complete accepted claim/evidence ledger: <artifact/path>
- Packet A–D outputs and cross-packet synthesis: <artifacts/paths>
- Completed U.S. Configuration Readiness Matrix: <artifact/path>
- Freeze-time mutable-P0 revalidation record: <artifact/path>
- Bounded uncertainties, accepted NON-EVIDENCE simplification candidates, deferred P1/P2 register, resolved architecture-fit records, and NOT_REQUIRED rationales: <artifacts/paths>

ROLE AND PERMITTED WORK
Translate accepted evidence into explicit U.S. configuration requirements for existing Architecture V0 seams. For every requirement, identify relied-on claim/source IDs, the accepted seam and semantic owner, the chosen direct/aggregated/approximated/deferred mapping, and any accepted gameplay simplification.

PROHIBITED WORK
Do not conduct another broad research phase. Do not turn a simplification into evidence. Do not silently alter Architecture V0, create a new canonical owner, hard-code the United States into generic ontology, modify runtime/tests/UI, or begin implementation. A newly discovered direct evidence gap must be routed back narrowly and must not reopen the entire research program.

OUTPUT
Produce U.S. Configuration Contract V0 as a separate authority candidate with exact upstream SHAs, evidence-to-requirement traceability, semantic-owner mapping, bounded uncertainties, explicit simplifications, deferred items, architecture-fit disposition, and its own independent-audit readiness statement.

STOPPING CONDITION
Stop at the configuration-contract candidate. Do not self-accept, implement, or reopen architecture. If a required readiness row proves unsupported, identify the exact gap and stop the affected path for narrow evidence routing.
```
