# U.S. Research Audit Protocol V0

Status: **Authority-candidate audit design only. Not research acceptance and not implementation authority.**

Upstream authority:

- Accepted Architecture V0: `54afd51c6ae894df5c3680cf15df472cdcb125b2`
- Accepted synthetic GL0 runtime: `ffc34c0cce1089ff1eeca671243cab7a2e968c43`
- Companion research-program candidate: `docs/US_RESEARCH_PROGRAM_V0.md`

This protocol defines how future U.S. research evidence is independently attacked, repaired once, rechecked, and frozen for later U.S. Configuration Contract V0 authoring.

---

## 1. Audit purpose and independence

The audit system exists to answer:

> **Is the candidate U.S. evidence baseline sufficiently correct, traceable, scoped, temporally valid, and architecture-disciplined to support U.S. Configuration Contract V0 authoring?**

Auditors do not decide whether the eventual gameplay is fun, whether calibration is perfect, or whether Architecture V0 should be redesigned.

Each audit targets an **exact evidence-baseline repository SHA/snapshot**. Branch names are convenience pointers only.

An auditor must record:

- evidence-baseline SHA;
- audit-lane identifier;
- auditor identity/session identity;
- protocol version/SHA used;
- start/end timestamps if available;
- files/artifacts inspected;
- findings produced.

### 1.1 Independence rule

The three initial audits must be genuinely independent.

Before completing its own lane, an auditor must not receive:

- another auditor's verdict;
- another auditor's finding list;
- another auditor's severity assignments;
- the research author's proposed responses to another audit.

Shared source material and the exact evidence baseline are allowed. Shared conclusions are not.

The goal is to prevent anchoring, copied blind spots, and one reviewer merely confirming another.

### 1.2 No silent repair

Auditors may identify a better source, narrower wording, missing qualification, or potential repair, but they must not edit the research baseline during the audit.

Audit output is findings only.

The research author/repair author performs the one bounded repair phase later.

### 1.3 No self-acceptance

The design author, research author, or repair author may not independently accept their own candidate as the frozen U.S. evidence baseline.

Acceptance requires a separate reviewer/authority after the required audit and recheck gates.

---

## 2. Exactly three required independent first-pass audits

The initial audit set contains exactly three mandatory lanes. Each lane is performed by its own independent reviewer/session against the same exact evidence-baseline SHA and produces a separate report. Each auditor inspects the entire baseline sufficiently to test its lane; it may not inherit another auditor's initial conclusions before submitting its own report.

### AUDIT A — Source / Fact Integrity

Primary question:

> Are the research claims actually supported by authoritative, current, correctly interpreted evidence?

Audit A owns source and factual-integrity attacks across evidence classes. It evaluates each claim according to the source type appropriate for that claim rather than demanding one source type for everything.

It attacks at least:

- source existence, identity, authority, and status;
- primary versus secondary appropriateness;
- legal and procedural correctness;
- source version, effective date, currentness, and temporal scope;
- jurisdiction and institutional scope;
- formal law versus ordinary practice;
- guidance versus binding law;
- empirical and dataset validity, including universe, geography, vintage, revision, method, transformation, and uncertainty;
- quotation, paraphrase, pinpoint, and entailment fidelity;
- claim-level provenance and synthesis dependencies;
- contrary evidence and cherry-picking;
- unsupported negative claims;
- gameplay simplification mislabeled as fact.

### AUDIT B — Coverage / Adversarial Completeness

Primary question:

> Did the research omit anything necessary to safely configure the first recognizable U.S. vertical?

Audit B asks whether the baseline is complete enough, not encyclopedic. It attacks at least:

- missing P0 Architecture V0/GL0 seams;
- research overreach and underreach;
- synthetic fixture assumptions promoted into U.S. facts;
- a House route without the Senate or bicameral completion;
- an election without certification, entitlement, transfer, or persistent succession;
- appropriation without obligation, payment, or material consequence;
- an agency/program route without a real legal and operational basis;
- federalism or state participation assumed rather than evidenced;
- a Housing analog that does not support the selected causal route;
- a contested-authority route missing a plausible required procedural step;
- official measurement without release, lag, revision, universe, or geography semantics;
- implementation-data source gaps;
- incompatible assumptions across Packets A–D;
- P1/P2 work improperly made prerequisite, or necessary P0 work improperly deferred.

### AUDIT C — Architecture / Configuration Fit

Primary question:

> Can the accepted U.S. evidence be translated into Architecture V0 without silently corrupting ownership or hard-coding the United States into generic engine ontology?

Audit C is a genuinely independent reviewer and report. It attacks at least:

- U.S. configuration facts proposed as generic ontology;
- actor, candidate, office, and office-assignment collapse;
- House/Senate ownership mistakes;
- jurisdiction versus geography confusion;
- electoral geography shadow-owning Population;
- legal rules placed in administrative state;
- administrative program state owning material Housing outcomes;
- election result or certification confused with office assignment;
- judicial order confused with receipt, compliance, refusal, appeal, or stay;
- public information or measurement confused with material truth;
- U.S.-specific engine special cases;
- configuration inconvenience mislabeled as an architecture contradiction;
- readiness-matrix rows unsupported by the cited evidence.

Audit C records qualifying architecture-fit questions but does not redesign or reopen Architecture V0.

### 2.1 First-pass independence

All three auditors receive the same exact evidence-baseline SHA and governing program/protocol authorities. They work independently, do not receive the other first-pass reports before submitting their own, and produce separate reports. No majority vote decides truth or disposition. A supported serious finding survives even if the other two auditors missed it. The three reports become inputs to the later mechanical synthesis.

### 2.2 Optional specialist

At most one additional specialist review may be authorized. It is not automatic and is allowed only after completed research reveals one specific high-risk question materially exceeding the normal competence or scope of Audits A–C.

The authorization must state:

- the exact bounded question;
- affected claim IDs;
- why Audits A–C are insufficient;
- exact bounded output expected.

The specialist receives the same evidence SHA, produces only the named bounded output, and does not conduct a fourth general audit or restart the audit process.

---

## 3. Findings taxonomy and severity

The formal audit workflow recognizes exactly two severities.

### BLOCKER

The evidence baseline cannot safely support configuration because a central factual premise, source basis, required P0 seam, provenance chain, audit-independence rule, or architecture mapping is invalid or unusable.

### HIGH

A material but bounded evidence, coverage, provenance, temporal, methodological, or architecture-fit defect could cause a substantially wrong U.S. configuration.

Only `BLOCKER` and `HIGH` may enter the formal finding schema, mechanical synthesis, required disposition, repair queue, findings-only recheck, or freeze gate.

Auditors may optionally provide a clearly separated **NONBLOCKING NOTES** section. Such observations are not findings: they have no finding ID or required repair, do not enter synthesis or disposition, are not rechecked, and cannot block freeze. No formal lower severity exists.

---

## 4. Required finding schema

Every formal finding must contain:

```yaml
findingId: USR-AUD-A-001
auditLane: A | B | C | SPECIALIST
severity: BLOCKER | HIGH
evidenceBaselineSha: "..."
claimIds: []
sourceIds: []
artifactPaths: []
summary: "one-sentence defect statement"
exactDefect: "precise bounded defect"
auditorEvidence: "what the auditor inspected and found"
whyConfigurationIsThreatened: "material consequence for configuration/freeze"
requiredRepair: "narrow condition that must become true"
objectiveClosureTest: "reproducible findings-only test"
architectureContradiction: YES | NO
status: OPEN | REPAIRED_PENDING_RECHECK | RECHECK_PASS | RECHECK_FAIL
```

A finding must be precise enough to repair and recheck without a broader rewrite or new general audit.

---

## 5. Adversarial test procedures

Each audit uses the tests relevant to its attack surface. The procedures below are mandatory across the audit set.

### 5.1 Source-existence test

For each sampled or implementation-critical source:

- open/retrieve the source;
- verify issuing body/title/document identity;
- verify cited version/date;
- verify the source is not merely a search snippet or secondary quotation pretending to be the original.

Failure on an implementation-critical source is at least HIGH and may be BLOCKER if the claim has no other valid support.

### 5.2 Source-authority test

Ask whether the source can establish the proposition asserted.

Examples of failure patterns:

- news article used to establish controlling law;
- agency FAQ used as if it were a statute;
- academic description used instead of an available chamber rule for a procedural requirement;
- national source used to assert a state-specific election procedure.

### 5.3 Locator-fidelity test

Verify every relied-on pinpoint:

- page/section/table/paragraph/case pin cite;
- dataset table/variable;
- rule/statutory subsection;
- official record locator.

The exact cited location must be reconstructible.

### 5.4 Claim-entailment test

Read enough surrounding context to determine whether the source actually supports the claim wording.

Attack:

- overbroad paraphrase;
- missing qualification;
- conditional statement rewritten as unconditional;
- permission rewritten as requirement;
- requirement rewritten as ordinary practice;
- correlation rewritten as causation.

### 5.5 Cherry-picking test

Search for contrary authority or materially different evidence, especially when the claim is contested, variable, or ordinary-practice based.

An auditor should attempt at least one hostile search formulation for important P0 claims rather than repeating the researcher's search terms.

### 5.6 Contradictory-authority test

Where sources conflict, classify the conflict:

- temporal;
- jurisdictional;
- hierarchical/authority;
- definitional;
- methodological;
- genuine unresolved disagreement.

Check that the baseline retained the conflict and justified any resolution.

### 5.7 Temporal-mismatch test

Verify `asOfDate`, effective dates, vintages, and current status.

Attack:

- superseded statutes/rules;
- obsolete agency guidance;
- changed chamber rules;
- pre-change election procedure;
- old data passed off as current;
- transient officeholder/composition facts treated as permanent structure.

### 5.8 Jurisdiction-mismatch test

Verify the authority and claim apply to the same jurisdiction/institution/geographic unit.

Attack federal/state conflation and one-state-to-national generalization.

### 5.9 False-precision test

Challenge exact numbers, probabilities, timings, and thresholds.

If evidence supports only a range, distribution, qualitative relation, or uncertain estimate, the claim must not invent precision.

### 5.10 Missing-exception test

For implementation-critical legal/procedural claims, search for exceptions that could invalidate the modeled route.

The program need not model every exotic exception, but it must know whether a supposedly universal rule has a common/material exception relevant to the first vertical.

### 5.11 Formal-rule / practice conflation test

For every important “normally,” “typically,” “routinely,” “usually,” or “in practice” claim, verify the evidence actually establishes practice.

For every legal-rule claim, verify the wording does not smuggle in a practice generalization.

### 5.12 Evidence / proposal conflation test

Search for claims that describe a simplification as if it were reality.

Any phrase equivalent to “for gameplay we assume…” belongs to GAMEPLAY SIMPLIFICATION PROPOSAL and cannot appear as factual support.

### 5.13 Architecture-leakage test

Compare research claims against accepted Architecture V0 concepts.

Flag research prose that:

- creates a new canonical state owner;
- adds a new subsystem;
- changes a causal boundary;
- hardcodes U.S. content into permanent ontology;
- collapses accepted distinctions merely because a real-world process is inconvenient.

A real-world mismatch is evidence for an `ARCHITECTURE_FIT_QUESTION`, not research-author permission to redesign.

Audit C must apply the program's ordered threshold: represent through existing configuration, then consider an evidence-backed NON-EVIDENCE simplification, then defer if outside the first vertical. Architecture-reopen consideration is permitted only if all three fail and the record demonstrates a direct Architecture V0 contradiction, an unowned required canonical fact, unavoidable duplicate ownership, an impossible accepted causal path/invariant, or an unrepresentable deterministic/persistence requirement. Awkward configuration, cleaner abstraction, extra realism, or a U.S. special case does not qualify. Auditors record the question; they do not reopen architecture.

### 5.14 Current-officeholder overfit test

Search for unnecessary dependence on current names, partisan composition, temporary personalities, or one administration's transient practice where institutional structure would suffice.

### 5.15 Unsupported-negative test

Challenge claims such as “X never happens,” “there is no authority,” or “states cannot do Y.”

A failed search is not proof of absence. Negative claims need appropriate affirmative support or careful bounded wording.

### 5.16 Cross-claim consistency test

Compare claims across packets for contradictory definitions, dates, jurisdictions, actor roles, or process sequence.

The evidence baseline must not be locally correct but globally inconsistent.

---

## 6. Sampling and full-coverage rules

Audits may use sampling for noncritical P1/P2 material, but **P0 implementation-critical claims are not optional samples**.

At minimum:

- Audit A verifies every implementation-critical P0 claim has reconstructible provenance and directly checks source identity, authority, locator, entailment, temporal/jurisdiction fit, and evidence-class interpretation;
- Audit B checks every P0 question, all four packet outputs, cross-packet synthesis, implementation-data sources, and every required GL0 seam for omissions or incompatible assumptions;
- Audit C checks every required readiness-matrix row, every architecture-fit record, and every proposed evidence-to-seam mapping for accepted ownership and boundary integrity;
- an authorized specialist checks only its named question and affected claim IDs.

Where a lane's baseline becomes too large for one reviewer context, it may divide its work internally by the four established packets while still producing one independent lane report. Do not create additional mandatory audits or silently reduce coverage.

---

## 7. Initial audit outputs

Each independent Audit A, B, and C produces:

- exact evidence-baseline SHA audited;
- lane verdict: `CLEAR`, `FINDINGS`, or `UNREVIEWABLE`;
- finding list using the required schema;
- claim/source coverage statement;
- explicit statement that the lane was completed without seeing the other initial auditors' conclusions;
- optional NONBLOCKING NOTES in a separate section outside the formal finding list.

`CLEAR` means no BLOCKER/HIGH findings in that lane.

`FINDINGS` means one or more BLOCKER/HIGH findings exist.

`UNREVIEWABLE` means a defect prevents meaningful completion of the lane and must itself be recorded as BLOCKER.

Initial lane verdicts do not freeze the baseline. Only the later freeze gate can do so.

---

## 8. Mechanical Research Findings Synthesis

After Audits A–C finish, exactly one **Research Findings Synthesis** creates the repair queue. It is not a fourth audit.

The synthesizer receives only:

- the exact evidence-baseline SHA;
- Audit A report;
- Audit B report;
- Audit C report;
- the optional specialist report, only if one was authorized.

The synthesizer must not conduct research, create findings, change an original severity, dismiss a unique supported finding, vote findings away, redesign packets, author configuration, or redesign architecture.

Its mechanical tasks are:

1. validate that every report and finding references the same evidence SHA;
2. preserve every original BLOCKER/HIGH finding and original ID;
3. identify overlaps and create duplicate groups without erasing originals;
4. identify genuine factual, legal, methodological, temporal, jurisdictional, scope, or severity disagreements;
5. create one repair queue;
6. preserve provenance from every queue item to all contributing original findings.

Repair queue schema:

```yaml
repairQueueId: USR-RQ-001
sourceFindingIds: []
highestSeverity: BLOCKER | HIGH
affectedClaimIds: []
sharedDefect: "..."
requiredClosureConditions: []
auditorDisagreement: NONE | EVIDENCE_ADJUDICATION_REQUIRED
status: OPEN | REPAIRED_PENDING_RECHECK | CLOSED
```

When duplicate findings have different severities, original severities remain unchanged and the highest severity controls queue ordering. A material disagreement becomes `EVIDENCE_ADJUDICATION_REQUIRED` with the exact finding IDs and conflicting evidence. It is not decided by majority vote; the bounded repair must resolve it through evidence or leave the affected path unable to freeze.

---

## 9. Bounded research-repair protocol

After the three independent audits and the mechanical synthesis finish, the synthesized queue enters repair.

There is exactly **one bounded research-repair phase** before findings-only rechecks.

### 9.1 Repair scope

The repair author may change only what is necessary to resolve synthesized open BLOCKER/HIGH findings and directly dependent inconsistencies.

Allowed repair work includes:

- replacing or strengthening a cited source;
- correcting a claim;
- narrowing scope;
- adding a missing qualification/exception;
- correcting temporal/jurisdiction metadata;
- adding missing provenance;
- separating formal law from practice;
- separating evidence from gameplay proposal;
- resolving or explicitly recording a contradiction;
- adding a missing P0 claim/question that an audit identified as a coverage gap;
- recording an architecture-fit mismatch instead of leaking design into research.

### 9.2 Prohibited opportunistic expansion

The repair phase may not use audit findings as an excuse to:

- research unrelated institutions;
- add broad new policy domains;
- perform deferred P1 calibration;
- add current-politician content;
- redesign architecture;
- author the U.S. Configuration Contract;
- implement runtime changes.

Interesting new work becomes a deferred item unless it is necessary to close a synthesized BLOCKER/HIGH.

### 9.3 Preserve the audit trail

The repair candidate must preserve:

- initial baseline SHA;
- each original finding and its synthesis/repair-queue links;
- the synthesis artifact SHA;
- repair commit SHA;
- exact claim/source changes made for each finding;
- any finding determined to be invalid, with a bounded evidence-backed explanation.

Do not erase old findings because prose changed.

---

## 10. Findings-only rechecks

After the single repair commit, each original auditor rechecks **only that auditor's own original findings and directly affected dependencies**. The optional specialist, if used, rechecks only its own findings.

Each rechecker receives the original evidence SHA, repaired exact SHA, their own finding IDs, the relevant repair diff, and repaired evidence. If an original auditor is unavailable, the project must explicitly authorize a replacement independent rechecker for only those findings; a replacement does not perform a general audit.

Each finding receives one result:

- `RECHECK_PASS` — required repair condition is satisfied;
- `RECHECK_FAIL` — original defect remains or repair creates a directly related defect;

### 10.1 New serious defect discovered during recheck

A recheck is not a second general audit, but a reviewer must not ignore a newly discovered severe defect that is directly visible while testing a repair.

If a new `BLOCKER` or `HIGH` is **introduced by the repair inside the touched boundary**, it is recorded as a recheck failure and the evidence baseline does not freeze.

Because the normal protocol permits only one bounded repair phase, such a failure stops this candidate from freezing. It may not be silently patched inside the recheck or converted into another automatic repair cycle.

### 10.2 Out-of-scope improvement discovered during recheck

A genuinely unrelated improvement may be recorded as a nonblocking observation outside the finding workflow and does not reopen the bounded repair.

---

## 11. Acceptance and freeze decision

The evidence baseline may be declared frozen enough for U.S. Configuration Contract V0 authoring only by a reviewer/authority independent of the design/research/repair author.

The acceptance reviewer must verify all of these conditions:

1. the evidence candidate is identified by an exact repository SHA;
2. all four research packets are complete;
3. Packet D cross-packet synthesis is complete;
4. every P0 question is `SUPPORTED`, `SUPPORTED_WITH_BOUNDS`, or justified `NOT_REQUIRED`;
5. implementation-critical claim/source provenance and pinpoints are complete;
6. temporal, jurisdictional, institutional, and scope metadata are complete;
7. formal law and ordinary-practice distinctions are explicit;
8. contradictions and genuine uncertainty are explicitly represented;
9. exactly three independent first-pass audits—A, B, and C—completed against the same evidence SHA with independence attestations;
10. zero `BLOCKER` findings remain open;
11. zero `HIGH` findings remain open;
12. the one bounded research repair, if required, is complete;
13. findings-only rechecks by the original auditors closed every repaired BLOCKER/HIGH;
14. every mutable P0 dependency has a completed freeze-time revalidation record;
15. the U.S. Configuration Readiness Matrix has no unexplained required `NOT_READY` row;
16. gameplay simplifications remain separate **NON-EVIDENCE** proposals traceable to accepted evidence;
17. no hidden Architecture V0 contradiction or unresolved qualifying architecture-fit question blocks a required path;
18. P1/P2 work remains explicitly deferred and need not be completed;
19. the frozen evidence authority is identified by exact repository SHA.

The acceptance record must name the exact accepted evidence SHA.

A branch name, latest commit, prose summary, or researcher's statement that “everything is fixed” is insufficient.

Freeze authorizes **U.S. Configuration Contract V0 authoring only**. It does not itself authorize runtime implementation.

The accepted handoff is the exact bundle defined by `US_RESEARCH_PROGRAM_V0.md`: governing Architecture/runtime/evidence SHAs, complete ledger, Packet A–D outputs, Packet D synthesis, readiness matrix, mutable-P0 revalidation record, accepted NON-EVIDENCE simplification candidates, bounded uncertainties, deferred P1/P2 register, resolved architecture-fit records, and NOT_REQUIRED rationales. A direct new evidence gap may be routed back narrowly; it does not authorize another broad research phase.

---

## 12. Anti-collusion and anti-anchoring safeguards

### 12.1 Blind initial findings

Until Audits A–C are complete, findings remain isolated from the other initial auditors.

### 12.2 Separate prompts by attack surface

Each auditor receives only the shared baseline, program/protocol authority, and its own lane instructions. Do not seed it with another auditor's suspected defects.

### 12.3 No inherited severity

A later auditor who independently discovers the same defect assigns severity from this protocol rather than copying another reviewer's label.

### 12.4 Synthesis only after completion

The finding set enters mechanical synthesis only after Audits A–C finish.

Duplicate findings may then be linked, but original independent wording and provenance remain preserved.

### 12.5 Repair author separation

The repair author does not recheck or accept their own repair. Each original auditor rechecks their own findings.

### 12.6 No consensus laundering

“Multiple reviewers agree” is not a substitute for source verification. A repeated unsupported conclusion remains unsupported.

---

## 13. Disagreement handling

Auditor disagreement is expected and must be evidence-resolved rather than vote-resolved.

For conflicting findings:

1. preserve both findings;
2. identify whether the disagreement is factual, legal, methodological, temporal, jurisdictional, scope-related, or severity-related;
3. return to the underlying sources/claims;
4. prefer controlling authority and narrower supported wording;
5. if material disagreement cannot be resolved, retain the claim as `CONFLICTED` or `SUPPORTED_WITH_BOUNDS` as appropriate;
6. an unresolved implementation-critical disagreement blocks freeze.

A majority vote cannot convert weak evidence into strong evidence.

---

## 14. Audit attack map against the research program

The three audits collectively answer the program's required control questions:

- **Are claims supported and traceable?** Audit A attacks source/fact integrity across law, practice, administration, data, time, jurisdiction, provenance, contradictions, and simplification labeling.
- **Is the evidence complete enough?** Audit B attacks P0 coverage, four-packet completeness, implementation-data gaps, cross-packet consistency, and scope discipline.
- **Can evidence map safely to accepted architecture?** Audit C independently attacks semantic ownership, readiness mapping, ontology leakage, configuration special cases, and false architecture contradictions.
- **How are findings processed?** Section 8 mechanically synthesizes; Section 9 permits one bounded repair; Section 10 limits rechecks to original findings.
- **When is evidence frozen?** Section 11 applies the same nineteen freeze conditions as the research program.

---

## Appendix A — Prompt 2: Audit A — Source / Fact Integrity

```text
You are AUDIT A — the independent SOURCE / FACT INTEGRITY auditor.

EXACT AUTHORITIES
- Accepted Architecture V0 SHA: <sha>
- Accepted synthetic GL0 runtime SHA: <sha>
- U.S. Research Program V0 SHA: <sha>
- U.S. Research Audit Protocol V0 SHA: <sha>
- Exact evidence-baseline SHA under review: <sha>

INDEPENDENCE
Do not read or receive Audit B, Audit C, specialist, author-response, or proposed-repair conclusions before submitting your first-pass report.

PERMITTED WORK
Inspect the complete baseline for source existence/authority/status, primary-versus-secondary appropriateness, legal and procedural accuracy, versions and temporal scope, jurisdiction, law/practice and guidance/law distinctions, empirical validity and dataset semantics, quotation/paraphrase fidelity, claim-level provenance, contrary evidence, unsupported negatives, and simplification/fact conflation. Perform bounded source checks required to test claims.

PROHIBITED WORK
Do not repair evidence, conduct Audit B or C, author configuration, calibrate gameplay, redesign/reopen Architecture V0, or modify runtime/tests/UI.

OUTPUT
Name the exact evidence SHA, inspected artifacts, coverage, independence attestation, and CLEAR/FINDINGS/UNREVIEWABLE verdict. Report only BLOCKER/HIGH findings using the formal schema. Optional nonblocking observations must be separated and are not findings.

STOPPING CONDITION
Stop after completing Audit A and submitting its independent report. Do not view the other first-pass reports or accept the baseline.
```

## Appendix B — Prompt 3: Audit B — Coverage / Adversarial Completeness

```text
You are AUDIT B — the independent COVERAGE / ADVERSARIAL COMPLETENESS auditor.

EXACT AUTHORITIES
- Accepted Architecture V0 SHA: <sha>
- Accepted synthetic GL0 runtime SHA: <sha>
- U.S. Research Program V0 SHA: <sha>
- U.S. Research Audit Protocol V0 SHA: <sha>
- Exact evidence-baseline SHA under review: <sha>

INDEPENDENCE
Do not read or receive Audit A, Audit C, specialist, author-response, or proposed-repair conclusions before submitting your first-pass report.

PERMITTED WORK
Attack P0 completeness, missing GL0 seams, Packet A–D coverage, cross-packet contradictions, scope overreach/underreach, synthetic assumptions promoted to U.S. facts, implementation-data gaps, bicameral completion, election-to-transfer continuity, fiscal-to-material continuity, program/state/federalism grounding, bounded judicial route completeness, and measurement release semantics. Demand completeness sufficient for the first vertical, not encyclopedic research.

PROHIBITED WORK
Do not repair evidence, conduct Audit A or C, demand P1/P2 completion, author configuration, redesign/reopen Architecture V0, or modify runtime/tests/UI.

OUTPUT
Name the exact evidence SHA, inspected artifacts, P0/packet/seam coverage, independence attestation, and CLEAR/FINDINGS/UNREVIEWABLE verdict. Report only BLOCKER/HIGH findings using the formal schema. Optional nonblocking observations stay outside the finding workflow.

STOPPING CONDITION
Stop after completing Audit B and submitting its independent report. Do not view the other first-pass reports or accept the baseline.
```

## Appendix C — Prompt 4: Audit C — Architecture / Configuration Fit

```text
You are AUDIT C — the independent ARCHITECTURE / CONFIGURATION FIT auditor.

EXACT AUTHORITIES
- Accepted Architecture V0 SHA: <sha>
- Accepted synthetic GL0 runtime SHA: <sha>
- U.S. Research Program V0 SHA: <sha>
- U.S. Research Audit Protocol V0 SHA: <sha>
- Exact evidence-baseline SHA under review: <sha>

INDEPENDENCE
Do not read or receive Audit A, Audit B, specialist, author-response, or proposed-repair conclusions before submitting your first-pass report.

PERMITTED WORK
Independently test whether accepted evidence and every required readiness row can map to existing Architecture V0 seams without corrupting generic ontology or semantic ownership. Protect actor/candidate/office/assignment distinctions; House/Senate and legislative ownership; jurisdiction/geography and geography/Population boundaries; law/administration/material boundaries; election-result/certification/office-transfer boundaries; judicial-order/receipt/compliance boundaries; information/measurement/material-truth boundaries; and the player institutional-knowledge/ControlBinding boundary. Test architecture-fit escalation records against the accepted reopening threshold.

PROHIBITED WORK
Do not redesign or reopen Architecture V0, choose configuration values, repair evidence, conduct Audit A or B, perform gameplay calibration, or modify runtime/tests/UI.

OUTPUT
Name the exact evidence SHA, inspected artifacts/readiness rows, coverage, independence attestation, and CLEAR/FINDINGS/UNREVIEWABLE verdict. Report only BLOCKER/HIGH findings using the formal schema, including architectureContradiction YES/NO. Optional nonblocking observations stay outside the finding workflow.

STOPPING CONDITION
Stop after completing Audit C and submitting its independent report. Do not view the other first-pass reports or accept the baseline.
```

## Appendix D — Prompt 5: Research Findings Synthesis

```text
You are the MECHANICAL RESEARCH FINDINGS SYNTHESIZER.

EXACT INPUTS
- Exact evidence-baseline SHA: <sha>
- Audit A report: <artifact>
- Audit B report: <artifact>
- Audit C report: <artifact>
- Optional authorized specialist report, or NONE: <artifact/NONE>
- U.S. Research Audit Protocol V0 SHA: <sha>

PERMITTED WORK
Validate that all reports target the same SHA; preserve every original BLOCKER/HIGH and ID; identify overlaps; create duplicate groups without erasing originals; identify genuine disagreements; create one repair queue; preserve provenance from each queue item to every contributing finding. Preserve differing original severities and use the highest only for queue ordering. Mark material conflicts EVIDENCE_ADJUDICATION_REQUIRED.

PROHIBITED WORK
Do not conduct research, create findings, change original severity, dismiss a unique supported finding, vote findings away, audit the baseline, redesign packets/architecture, author configuration, or repair evidence.

OUTPUT
Return input validation, preserved finding inventory, duplicate groups, disagreement register, and repair queue using the required schema, plus an exact synthesis artifact identifier.

STOPPING CONDITION
Stop when every original BLOCKER/HIGH maps to exactly one or more preserved queue/provenance records. Do not begin repair.
```

## Appendix E — Prompt 6: Research Repair Author

```text
You are the ONE BOUNDED U.S. RESEARCH REPAIR AUTHOR.

EXACT AUTHORITIES AND INPUTS
- Accepted Architecture V0 SHA: <sha>
- Accepted synthetic GL0 runtime SHA: <sha>
- U.S. Research Program V0 SHA: <sha>
- U.S. Research Audit Protocol V0 SHA: <sha>
- Exact evidence candidate SHA: <sha>
- Mechanical synthesis artifact: <artifact/sha>
- Synthesized BLOCKER/HIGH repair queue and contributing original findings: <artifacts>

PERMITTED WORK
Repair only open BLOCKER/HIGH items and direct consistency dependencies. Where a finding requires it, gather missing authoritative evidence, replace weak sources, split/narrow claims, correct scope/time/jurisdiction, expose uncertainty, repair provenance/readiness mappings, or record a qualifying architecture-fit question. Preserve the full audit trail and map every change to source finding IDs.

PROHIBITED WORK
Do not expand unrelated research, perform deferred P1/P2 calibration, add current-politician content, create a second general research phase, redesign/reopen Architecture V0, author U.S. Configuration Contract V0, or modify runtime/tests/UI. Do not perform the recheck or self-accept.

OUTPUT
Produce one exact repair commit, per-finding change map, repaired evidence artifacts, diff boundary statement, and recheck inputs for each original auditor.

STOPPING CONDITION
Stop after the single bounded repair candidate is committed. Do not silently perform a second repair if a recheck later fails.
```

## Appendix F — Prompt 7: Findings-Only Recheck

```text
You are the ORIGINAL AUDITOR performing a FINDINGS-ONLY RECHECK for Audit <A/B/C/SPECIALIST>.

EXACT INPUTS
- Original evidence-baseline SHA: <sha>
- Repaired evidence candidate SHA: <sha>
- Your own original finding IDs: <ids>
- Relevant repair diff and repaired evidence: <artifacts>
- U.S. Research Audit Protocol V0 SHA: <sha>

PERMITTED WORK
Recheck only your listed original findings and directly affected dependencies. Apply each objectiveClosureTest and return RECHECK_PASS or RECHECK_FAIL with evidence. Record a new BLOCKER/HIGH only if the repair directly introduced a serious defect inside the touched boundary; treat it as RECHECK_FAIL.

PROHIBITED WORK
Do not perform a complete re-audit, inspect unrelated areas for improvements, inherit another auditor's findings, silently repair evidence, author configuration, redesign architecture, or accept the full baseline.

OUTPUT
For each original finding return its ID, repaired SHA, closure-test result, evidence, and RECHECK_PASS/RECHECK_FAIL. Include a touched-boundary attestation.

STOPPING CONDITION
Stop after rechecking your own findings. Unrelated observations remain outside the formal finding workflow and do not reopen repair.
```

## Appendix G — acceptance checklist

The independent acceptance reviewer confirms all nineteen freeze conditions in Section 11, including exactly four completed packets, exactly three independent first-pass audits against one SHA, zero open BLOCKER/HIGH, one bounded repair if needed, original-auditor findings-only rechecks, completed mutable-P0 revalidation, a readiness matrix with no unexplained required NOT_READY row, explicit NON-EVIDENCE simplifications, and exact-SHA evidence authority. Freeze authorizes configuration-contract authoring only, not implementation.
