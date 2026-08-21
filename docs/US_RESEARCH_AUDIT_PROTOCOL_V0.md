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
- audit-pass identifier;
- auditor identity/session identity;
- protocol version/SHA used;
- start/end timestamps if available;
- files/artifacts inspected;
- findings produced.

### 1.1 Independence rule

Initial audit passes must be genuinely independent.

Before completing its own pass, an auditor must not receive:

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

## 2. Required independent audit passes

The initial audit set contains **six distinct attack surfaces**. They may be executed by six reviewers or by fewer reviewers only if each pass is completed independently and results are not inherited across passes before completion. At least three separate reviewer sessions/agents must participate overall.

Each pass must inspect the entire evidence baseline sufficiently to test its attack surface, not merely sample one convenient claim.

### PASS A — legal / procedural authority audit

Attack implementation-critical STRUCTURAL / CONSTITUTIONAL and LEGAL / PROCEDURAL claims.

Questions:

- Is the cited source actually authoritative for the proposition?
- Is primary authority available but omitted without justification?
- Is a statute, rule, regulation, case, or chamber procedure current for the baseline date?
- Is a source being used outside its jurisdiction or legal scope?
- Does the claim omit a legally material exception?
- Does the research confuse legal authority, claimed authority, operational behavior, and compliance?
- Does it confuse proposal, procedure, enactment, appropriation, obligation, payment, or outcome?
- Are judicial claims, orders, remedies, appeal posture, and compliance kept distinct?

This pass does not judge gameplay simplifications except where a simplification has been mislabeled as legal fact.

### PASS B — ordinary-practice / operational-reality audit

Attack ADMINISTRATIVE / OPERATIONAL and ORDINARY PRACTICE claims.

Questions:

- Is formal legal permission being presented as ordinary behavior?
- Is a manual/guidance document being mistaken for binding law?
- Is a single anecdote generalized into a stable practice?
- Is agency process described from official documentation that may not reflect actual ordinary operation?
- Where practice varies, is the variation acknowledged?
- Does a practice claim have enough independent support for its breadth?
- Does the claim distinguish what institutions are permitted to do, required to do, normally do, and happened to do in one case?

### PASS C — empirical / data / temporal-validity audit

Attack EMPIRICAL / DATA claims and quantitative ordinary-practice claims.

Questions:

- Is the dataset/source real and retrievable?
- Is the observation period appropriate?
- Is the vintage/revision captured?
- Are geography, universe, sample, denominator, and variable definitions correct?
- Are transformed values reproducible?
- Is uncertainty represented when material?
- Is old evidence presented as current?
- Are nominal/current/transient values being mistaken for structural facts?
- Is false precision used where evidence supports only a range or qualitative relation?
- Does the research confuse measurement with the underlying material state?

### PASS D — claim/source traceability and quotation-fidelity audit

Attack the provenance chain.

Questions:

- Does every P0 claim have stable IDs?
- Does every source ID resolve to the cited source?
- Do pinpoint references exist and support the wording used?
- Does the quoted or paraphrased text actually entail the claim?
- Has context been omitted in a way that changes meaning?
- Are synthesis claims traceable to supported atomic claims?
- Is contrary evidence retained and linked?
- Can an auditor reconstruct the claim without guessing what page, section, table, or version was meant?
- Are mutable sources identified strongly enough to reconstruct the relied-on version later?

### PASS E — scope / coverage / architecture-boundary audit

Attack both under-research and overreach.

Questions:

- Are all P0 seams needed by accepted synthetic GL0 covered?
- Is any implementation-critical seam silently relying on synthetic assumptions rather than U.S. evidence?
- Has research expanded into areas irrelevant to the first U.S. vertical?
- Are current politician identities being researched without necessity?
- Has a P1 calibration question been incorrectly promoted into structural necessity?
- Has a necessary P0 question been incorrectly deferred as calibration?
- Is any research prose inventing engine ontology, changing ownership, adding a new subsystem, or treating U.S.-specific content as permanent architecture?
- Are architecture-fit mismatches recorded instead of silently “solved” in the evidence layer?

### PASS F — simplification / synthesis / contradiction audit

Attack the boundary among evidence, synthesis, and game-design proposal.

Questions:

- Is every gameplay simplification labeled as non-evidence?
- Does each simplification cite the evidence being compressed?
- Is the omitted/compressed reality stated explicitly?
- Are multiple facts synthesized without creating unsupported new propositions?
- Are conflicting authorities/evidence surfaced?
- Has the research cherry-picked one side of a known dispute?
- Are unresolved contradictions properly blocking where implementation-critical?
- Are negative findings supported rather than inferred from failed searches?

---

## 3. Findings taxonomy and severity

Every finding has one severity.

### BLOCKER

A defect that makes the candidate evidence baseline unsafe to freeze or impossible to audit reliably.

Examples:

- implementation-critical claim materially contradicted by controlling authority;
- fabricated/nonexistent source or locator;
- key P0 seam absent;
- evidence and gameplay proposal systematically conflated;
- unresolved architecture leakage that silently redesigns accepted architecture;
- exact baseline cannot be reconstructed;
- implementation-critical contradiction cannot currently be resolved.

A BLOCKER must be repaired or explicitly force the affected P0 path out of the candidate baseline.

### MAJOR

A material defect that can produce a wrong U.S. configuration but is bounded enough to repair.

Examples:

- wrong/outdated source for a P0 claim;
- claim overstates source scope;
- formal rule conflated with ordinary practice;
- material legal/operational exception omitted;
- empirical methodology/date mismatch;
- unsupported implementation-critical synthesis;
- gameplay simplification mislabeled as evidence;
- source provenance insufficient for reliable verification.

MAJOR findings must be closed before freeze.

### MINOR

A real defect that does not materially alter the first implementation path if left temporarily unresolved, but should be repaired when within bounded findings scope.

Examples:

- incomplete noncritical metadata;
- imprecise wording where source and conclusion are otherwise sound;
- weak but noncritical corroboration;
- locator improvement that does not threaten entailment.

MINOR findings do not independently block freeze unless the acceptance authority determines their accumulation creates a provenance/quality problem.

### NOTE

Nonblocking observation, deferred calibration suggestion, possible future research improvement, or explicitly out-of-scope issue.

A NOTE is not repair authorization unless promoted by acceptance authority.

---

## 4. Required finding schema

Every finding must contain:

```yaml
findingId: USR-AUD-A-001
passId: A | B | C | D | E | F
severity: BLOCKER | MAJOR | MINOR | NOTE
evidenceBaselineSha: "..."
claimIds: []
sourceIds: []
artifactPaths: []
summary: "one-sentence defect statement"
attackType: "SOURCE_AUTHORITY | LOCATOR_FIDELITY | CLAIM_ENTAILMENT | CHERRY_PICKING | CONTRADICTORY_AUTHORITY | TEMPORAL_MISMATCH | JURISDICTION_MISMATCH | OUTDATED_RULE | OUTDATED_DATA | FALSE_PRECISION | MISSING_EXCEPTION | RULE_PRACTICE_CONFLATION | EVIDENCE_PROPOSAL_CONFLATION | ARCHITECTURE_LEAKAGE | OFFICEHOLDER_OVERFIT | UNSUPPORTED_NEGATIVE | COVERAGE_GAP | SCOPE_OVERREACH | OTHER"
evidence: "what the auditor inspected and found"
whyItMatters: "effect on first U.S. configuration/freeze"
requiredRepair: "bounded condition that must become true; do not prescribe unrelated expansion"
independentSourcesChecked: []
status: OPEN | REPAIR_PROPOSED | RECHECK_PASS | RECHECK_FAIL | DEFERRED_NOTE
```

A finding should state the defect precisely enough that the repair author can fix only the finding without guessing at a broader rewrite.

---

## 5. Adversarial test procedures

Every pass uses the tests relevant to its attack surface. The procedures below are mandatory across the audit set.

### 5.1 Source-existence test

For each sampled or implementation-critical source:

- open/retrieve the source;
- verify issuing body/title/document identity;
- verify cited version/date;
- verify the source is not merely a search snippet or secondary quotation pretending to be the original.

Failure on an implementation-critical source is at least MAJOR and may be BLOCKER if the claim has no other valid support.

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

An auditor should attempt at least one hostile search formulation for major P0 claims rather than repeating the researcher's search terms.

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

### 5.14 Current-officeholder overfit test

Search for unnecessary dependence on current names, partisan composition, temporary personalities, or one administration's transient practice where institutional structure would suffice.

### 5.15 Unsupported-negative test

Challenge claims such as “X never happens,” “there is no authority,” or “states cannot do Y.”

A failed search is not proof of absence. Negative claims need appropriate affirmative support or careful bounded wording.

### 5.16 Cross-claim consistency test

Compare claims across packages for contradictory definitions, dates, jurisdictions, actor roles, or process sequence.

The evidence baseline must not be locally correct but globally inconsistent.

---

## 6. Sampling and full-coverage rules

Audits may use sampling for noncritical P1/P2 material, but **P0 implementation-critical claims are not optional samples**.

At minimum:

- PASS A reviews every P0 legal/procedural claim or a formally defined complete subset by research package;
- PASS D verifies every P0 claim has reconstructible provenance, with direct locator/entailment checks on all implementation-critical claims;
- PASS E checks every P0 research question against the accepted GL0 seams;
- PASS F checks every simplification proposal and every unresolved contradiction.

Where the baseline becomes too large for one pass, divide it into explicit packages. Do not silently reduce coverage.

---

## 7. Initial audit outputs

Each independent pass produces:

- exact evidence-baseline SHA audited;
- pass verdict: `PASS`, `PASS_WITH_FINDINGS`, or `FAIL`;
- finding list using the required schema;
- claim/source coverage statement;
- explicit statement that the pass was completed without seeing other initial auditors' conclusions.

`PASS` means no findings in that pass.

`PASS_WITH_FINDINGS` means one or more MINOR/NOTE findings, or repairable MAJOR findings if the overall baseline is not being accepted yet.

`FAIL` means one or more BLOCKER findings or a defect that prevents meaningful completion of the pass.

Initial pass verdicts do **not** freeze the baseline.

---

## 8. Bounded research-repair protocol

After all required independent initial audit passes finish, findings are collated once.

There is exactly **one bounded research-repair phase** before findings-only rechecks.

### 8.1 Repair scope

The repair author may change only what is necessary to resolve initial findings and directly dependent inconsistencies.

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

### 8.2 Prohibited opportunistic expansion

The repair phase may not use audit findings as an excuse to:

- research unrelated institutions;
- add broad new policy domains;
- perform deferred P1 calibration;
- add current-politician content;
- redesign architecture;
- author the U.S. Configuration Contract;
- implement runtime changes.

Interesting new work becomes a deferred item unless it is necessary to close an initial finding.

### 8.3 Preserve the audit trail

The repair candidate must preserve:

- initial baseline SHA;
- each initial finding;
- repair commit SHA;
- exact claim/source changes made for each finding;
- any finding determined to be invalid, with a bounded evidence-backed explanation.

Do not erase old findings because prose changed.

---

## 9. Findings-only rechecks

After the single repair commit, independent reviewers recheck **only the initial findings and directly affected dependencies**.

Preferably the original pass auditor performs the recheck. If unavailable, a new independent reviewer may do so using the original finding and both SHAs.

Each finding receives one result:

- `RECHECK_PASS` — required repair condition is satisfied;
- `RECHECK_FAIL` — original defect remains or repair creates a directly related defect;
- `DEFERRED_NOTE` — only if acceptance authority determines the issue was nonblocking/out of scope.

### 9.1 New blocker discovered during recheck

A recheck is not a second general audit, but a reviewer must not ignore a newly discovered severe defect that is directly visible while testing a repair.

If a new `BLOCKER` or `MAJOR` is **caused by or directly coupled to the repair**, it is recorded as a recheck failure and the evidence baseline does not freeze.

Because the protocol permits only one bounded repair phase, such a failure returns the project to authority for an explicit decision on a new research-repair cycle. It may not be silently patched inside the recheck.

### 9.2 Out-of-scope improvement discovered during recheck

A genuinely unrelated improvement is recorded as a NOTE/deferred item and does not reopen the bounded repair.

---

## 10. Acceptance and freeze decision

The evidence baseline may be declared frozen enough for U.S. Configuration Contract V0 authoring only by a reviewer/authority independent of the design/research/repair author.

The acceptance reviewer must verify:

1. exact repaired evidence-baseline SHA;
2. exact audit protocol version/SHA;
3. all required independent initial passes completed;
4. independence attestations are present;
5. every initial BLOCKER/MAJOR has `RECHECK_PASS` or an explicitly authorized scope disposition;
6. no unresolved implementation-critical contradiction remains;
7. P0 coverage satisfies `US_RESEARCH_PROGRAM_V0.md`;
8. claim/source provenance is reconstructible;
9. simplification proposals remain non-evidence;
10. architecture-fit mismatches are not silently embedded as new architecture;
11. temporal baseline/staleness metadata is complete;
12. deferred P1/P2 work is recorded but does not masquerade as completed research.

The acceptance record must name the exact accepted evidence SHA.

A branch name, latest commit, prose summary, or researcher's statement that “everything is fixed” is insufficient.

Freeze authorizes **U.S. Configuration Contract V0 authoring only**. It does not itself authorize runtime implementation.

---

## 11. Anti-collusion and anti-anchoring safeguards

### 11.1 Blind initial findings

Until all initial passes are complete, findings remain isolated from other initial auditors where practical.

### 11.2 Separate prompts by attack surface

Each pass receives only the shared baseline, program/protocol authority, and its own attack instructions. Do not seed it with another pass's suspected defects.

### 11.3 No inherited severity

A later auditor who independently discovers the same defect assigns severity from this protocol rather than copying another reviewer's label.

### 11.4 Collation only after completion

The finding set is merged only after all required initial passes finish.

Duplicate findings may then be linked, but original independent wording and provenance remain preserved.

### 11.5 Repair author separation

Where possible, the person/session that performed a given independent pass should not perform the substantive repair for that same finding. If unavoidable, findings-only recheck must be performed by an independent reviewer.

### 11.6 No consensus laundering

“Multiple reviewers agree” is not a substitute for source verification. A repeated unsupported conclusion remains unsupported.

---

## 12. Disagreement handling

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

## 13. Audit attack map against the research program

The six passes collectively answer the program's required control questions:

- **What facts need research?** PASS E attacks scope/coverage.
- **Which are required before implementation?** PASS E attacks P0/P1 classification.
- **What can wait?** PASS E/F attack improper promotion or deferral.
- **What counts as evidence?** PASS A/B/C attack authority by evidence class.
- **How are claims traced?** PASS D attacks ledger/source fidelity.
- **How are law, practice, data, and simplification separated?** PASS A/B/C/F attack conflation.
- **How do adversarial reviewers attack the research?** PASS A–F and Section 5 define distinct hostile tests.
- **How are disagreements/findings repaired?** Sections 8, 9, and 12 define one repair plus recheck.
- **When is the evidence frozen?** Section 10 defines the acceptance gate.
- **How is architecture protected?** PASS E/F plus architecture-leakage testing prevent research from silently redesigning the engine.

---

## Appendix A — reusable independent audit prompt

```text
You are an INDEPENDENT U.S. RESEARCH AUDITOR.

Authority:
- accepted Architecture V0 SHA: <sha>
- accepted synthetic GL0 runtime SHA: <sha>
- U.S. Research Program V0 SHA: <sha>
- U.S. Research Audit Protocol V0 SHA: <sha>
- evidence baseline under review: <exact sha>

Complete ONLY audit pass <A/B/C/D/E/F>.

Do not repair the evidence.
Do not redesign architecture.
Do not perform gameplay calibration.
Do not accept the candidate on behalf of the project.

Do not read or inherit findings from other initial audit passes before completing your pass.

Attack the candidate adversarially according to the selected pass and mandatory tests in the protocol.

For every finding, output the required finding schema with exact claim IDs, source IDs, artifact paths, severity, evidence, why it matters, and a bounded required-repair condition.

At the end report:
- exact evidence SHA reviewed;
- coverage completed;
- PASS / PASS_WITH_FINDINGS / FAIL;
- independence attestation.
```

## Appendix B — reusable findings-only recheck prompt

```text
You are an INDEPENDENT FINDINGS-ONLY RECHECKER.

Original evidence baseline SHA: <sha>
Repair candidate SHA: <sha>
Original finding IDs: <ids>

Recheck ONLY the listed findings and directly affected dependencies.
Do not perform a new general audit.
Do not silently repair anything.

For each finding return RECHECK_PASS or RECHECK_FAIL and explain whether the exact required-repair condition is now satisfied.

If the repair directly creates a new BLOCKER/MAJOR, record it as a recheck failure and stop acceptance. Unrelated improvements become deferred NOTES.

Do not accept the full evidence baseline yourself unless separately assigned as the independent acceptance authority.
```

## Appendix C — acceptance checklist

The independent acceptance reviewer must confirm:

- [ ] Exact evidence-baseline SHA is named.
- [ ] All required initial audit passes targeted that baseline.
- [ ] At least three independent reviewer sessions/agents participated overall.
- [ ] Initial auditors did not inherit each other's conclusions before completion.
- [ ] The one bounded repair SHA is named.
- [ ] Every initial BLOCKER/MAJOR was rechecked.
- [ ] No implementation-critical contradiction remains open.
- [ ] P0 claim/source/temporal/jurisdiction provenance is complete.
- [ ] No gameplay simplification is being counted as evidence.
- [ ] No architecture mismatch was silently repaired in research.
- [ ] Deferred calibration/enrichment remains explicitly deferred.
- [ ] Freeze is stated as authorization for configuration-contract authoring, not runtime implementation.
