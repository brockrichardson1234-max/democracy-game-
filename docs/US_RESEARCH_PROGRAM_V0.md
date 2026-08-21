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

Establish the formal and ordinary procedural route required by GL0 from policy proposal through chamber procedure, actor decisions, passage, enactment, and any signature/veto/override stages actually exercised by the first vertical.

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

### 6.8 P0 — public claims / interpretation seam

Research only enough ordinary practice to establish how institutions or political actors can publicly interpret or characterize official information in ways needed by the first vertical.

The research need not build a complete media ecosystem. The minimum question is whether the supported distinction among underlying measurement, public claim, belief/attribution, and political reaction can be grounded without making public claims themselves canonical material truth.

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

---

## 7. Research execution method

Future substantive research must proceed as bounded research packages, not open-ended essays.

### Step 1 — select a required question

Start from one P0 question and identify the accepted Architecture V0/GL0 seam that makes it necessary.

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

Stop when the P0 question is answered to the level necessary for the first vertical. Do not continue collecting interesting but unnecessary government facts.

---

## 8. Evidence-to-configuration handoff

Accepted research evidence becomes an input to the later U.S. Configuration Contract V0.

Research documents may annotate claims with `architectureSeamRefs` pointing to already accepted concepts. Those references are **traceability aids only**. They do not create engine schemas, fields, owners, systems, processes, actor types, or mechanics.

The later configuration contract must explicitly decide how accepted evidence instantiates accepted architecture.

### 8.1 Required handoff record

For every implementation-critical configuration decision, the later configuration contract should be able to state:

- accepted claim IDs relied upon;
- accepted source IDs behind those claims;
- relevant architecture seam(s);
- any explicit gameplay simplification proposal;
- whether the mapping is direct, aggregated, approximated, or deferred.

### 8.2 Architecture mismatch rule

If a well-supported institutional fact appears not to map cleanly into Architecture V0, research must create an `ARCHITECTURE_FIT_QUESTION` containing:

- the supported evidence;
- the exact accepted seam thought insufficient;
- the minimum mismatch statement;
- why the mismatch matters to the first vertical.

Researchers must **not** repair that mismatch by:

- inventing new ontology;
- changing state ownership;
- adding a new system;
- redefining an accepted seam;
- embedding a U.S.-specific special case into research prose and treating it as architecture.

The mismatch is escalated for later authority resolution: represent directly, deliberately simplify, defer, or separately reconsider architecture.

---

## 9. Freeze criteria

The U.S. evidence baseline is frozen enough to authorize **U.S. Configuration Contract V0 authoring** only when all conditions below are met.

1. The candidate evidence baseline is identified by an exact repository SHA/snapshot.
2. Every P0 research question is `SUPPORTED`, `SUPPORTED_WITH_BOUNDS`, or explicitly `NOT_REQUIRED` with a recorded rationale.
3. Every implementation-critical atomic claim has complete source provenance and pinpoint support.
4. Every P0 claim has temporal, jurisdictional, institutional, and scope metadata.
5. No unresolved implementation-critical contradiction remains.
6. No unresolved `BLOCKER` or `MAJOR` audit finding remains.
7. All required independent initial audit passes completed against the same evidence-baseline SHA.
8. The one bounded research-repair phase, if findings required it, is complete.
9. Findings-only rechecks closed every repair-required initial finding.
10. Gameplay simplification proposals are visibly separated from evidence and trace to accepted evidence.
11. All architecture-fit mismatches are either resolved by explicit authority or recorded as blocking the affected configuration path.
12. P1/P2 deferred questions are recorded so the freeze is not mistaken for “research complete forever.”
13. The temporal baseline is explicit, including a list of mutable P0 authorities/data vintages that may require staleness review before implementation if time has passed.

Freeze means **sufficient evidence for configuration authoring**, not permanent truth and not implementation authorization.

---

## 10. Change control and staleness

The accepted evidence baseline is versioned by exact repository SHA.

### 10.1 Staleness-sensitive claim classes

At minimum, the following receive explicit staleness attention:

- statutes/rules amended after baseline;
- chamber rules and composition;
- election administration rules;
- agency regulations/guidance;
- program eligibility/administrative rules;
- fiscal/program authorities;
- empirical datasets and revisions;
- temporary current-state facts.

### 10.2 Reopen triggers

The evidence baseline is reopened only when one of these occurs:

- an implementation-critical source changes materially;
- a later configuration audit finds an unsupported or mis-scoped dependency;
- a court/statute/rule/regulation changes an implementation-critical claim;
- new authoritative evidence resolves or creates a material contradiction;
- the first vertical scope changes enough to require a previously deferred research question.

Reopening must produce a bounded delta: changed claims, changed sources, affected configuration decisions, and required re-audit surface.

A new officeholder, election result, news event, or policy debate does not automatically reopen structural research unless the first vertical depends on that transient fact.

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

## Appendix A — research package template

```text
Research package ID:
Architecture/GL0 seam requiring it:
Priority: P0 / P1 / P2
Question:
Out-of-scope boundaries:
Expected evidence classes:
Preferred authority tiers:
Atomic claim IDs:
Contrary/ambiguous evidence:
Negative findings:
Architecture-fit questions:
Stopping rule:
Researcher SHA/snapshot:
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
