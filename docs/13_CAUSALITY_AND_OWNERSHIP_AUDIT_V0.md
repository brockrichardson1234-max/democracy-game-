# 13 — Causality and Ownership Audit V0

Status: **Commit-6 bounded whole-architecture audit. Findings only; not repair authority.**

Audited authority: `d9b7b12b7d2b02fabc54714322923f23f745ff42`

## 1. Audit purpose

This is the first assembled Architecture V0 audit rather than a review of one newly authored slice.

The audit traces Governing Loop 0 and the second-domain probe across accepted documents `00`–`12` to ask:

> Does every required canonical fact, causal transition, cross-domain relationship, temporal boundary, information transformation, and persistence path still have one unambiguous semantic owner when the architecture is read as a whole?

This audit does **not** repair findings, redesign accepted systems, choose implementation algorithms, or authorize runtime code. Commit 7 is the one consolidated repair gate.

Severity reported here is limited to BLOCKER/HIGH because Commit 6 exists to identify architecture-level defects that make the walking-skeleton implementation unsafe.

## 2. Whole-loop trace result

The assembled normal route remains structurally coherent:

```text
Population/Geography + Housing truth
→ measurement/information available to administration
→ player-bound administration intent
→ political actors / proposal / bargaining / procedure
→ enacted legal source + fiscal authority
→ administrative program
→ state intent + federal determination + intergovernmental relationship
→ obligation/disbursement
→ Housing-owned material project/process
→ material realization
→ measurement-process capture
→ artifact/release/exposure
→ population-owned belief/attribution/salience/preference/turnout state
→ derived electorate + election process
→ certification/entitlement/office assignment
→ ControlBinding end
→ persistent world
```

The accepted architecture still preserves the major non-equivalences:

- player decision source != canonical actor/world ownership;
- attemptability != legality != compliance != material success;
- proposal != enacted law;
- authorization != appropriation != obligation != payment != material outcome;
- administrative project != physical project;
- state intent != federal acceptance != active intergovernmental relationship;
- material truth != measurement != report != belief;
- belief != attribution != salience != preference != turnout != ballot/result;
- election result != office assignment != ControlBinding;
- current state != immutable occurrence history;
- scheduler/index != domain temporal authority;
- legal temporal scope != automatic rewrite of non-legal occurrence history.

The housing route and unemployment-insurance-like probe both fit the same ownership doctrine without requiring a generic `PolicyOutcome` owner.

## 3. HIGH C/O-01 — Cross-domain population-to-material association ownership is not yet singular

The Commit-5 second-domain repair correctly narrowed `PopulationState` so it does not own every material fact associated with ordinary people.

However, the assembled wording now leaves one relationship fact with two plausible owners.

`07` says PopulationState may contain:

> references/joint linkage sufficient to correlate the ordinary population with domain-specific material facts owned elsewhere

and requires correlation-preserving joining across PopulationState and other owners.

`12` says a future labor/income material domain:

> references/associates [domain-specific facts] with the canonical ordinary population at the supported aggregate resolution.

Those statements correctly keep employment/income out of PopulationState, but they do not freeze who canonically owns the **association itself** when the association is mutable or resolution-sensitive.

An implementer could legitimately build either:

```text
PopulationUnit.materialFactRefs[employment] -> LaborFact
```

or:

```text
LaborFact.populationRef -> PopulationUnit
```

or both as mutable stores.

If population aggregates split/merge/refine, or the labor representation uses a different partition, those two mappings can diverge even though the underlying employment/income fact itself still has one owner.

This is not merely an indexing question. Eligibility, housing/material demand, measurements, and political exposure can require correct joint correspondence between population weight and domain-specific state. A wrong association changes causal results.

### Required Commit-7 repair

Freeze one semantic rule for cross-domain subject association without choosing a storage algorithm:

- a domain-specific material fact/relationship must have one canonical subject-association owner;
- other directions are references/indexes/projections;
- correlation-preserving joins/refinement must not create a second mutable owner of the association;
- PopulationState must not shadow-own a material-domain relationship merely because it needs reverse lookup;
- a dedicated relationship owner is allowed if the relationship itself is genuinely cross-domain and neither endpoint semantically owns it, but there must still be exactly one owner.

Do not choose a database join table, ECS representation, weighted-particle algorithm, or material-domain API in Commit 7.

**Severity: HIGH.** The accepted one-owner doctrine is incomplete for a new relationship type introduced by the second-domain repair, and implementation could otherwise produce divergent cross-domain population state.

## 4. Checked and clean — canonical current state versus immutable history

The Commit-5 repair closes the earlier Housing history regression.

Housing owns current material state and produces occurrence records. `HistoricalRecord` owns the immutable fact that those committed occurrences happened.

The same pattern remains coherent for:

- votes;
- legal enactment/effectiveness;
- court-order issuance/stay/reversal;
- office assignment changes;
- awards/obligations/payments;
- project starts/delays/completions;
- measurements/releases;
- election/certification events.

No additional BLOCKER/HIGH was found here.

## 5. Checked and clean — legal/procedure authority

The Commit-3 repair remains coherent in the assembled architecture:

- LegalOrder owns normative procedure requirements;
- institutions host/reference procedures and own relevant operational capability;
- active ProcedureInstance owns current proceeding facts;
- legally available transitions are derived from rules + current facts + context;
- judicial orders have one canonical legal-order owner;
- LegalContest owns case/procedural state and references orders;
- compliance remains independently resolved.

The forced issued-order hostile route in `11` now genuinely exercises this separation.

No additional BLOCKER/HIGH was found here.

## 6. Checked and clean — information and measurement

The information chain survives assembled review:

```text
referent owner
→ MeasurementProcess captured observations/state
→ committed measurement result
→ InformationArtifact
→ access/availability/exposure
→ recipient-owned belief
```

The measurement process has a canonical home for lagged work-in-progress, reports do not become live aliases, and `HistoricalRecord` is not used as a generic reconstruction engine.

No additional BLOCKER/HIGH was found here.

## 7. Checked and clean — deterministic time and randomness

Commit 4's repaired time contract remains compatible with Commit 5:

- domain temporal meaning remains owner-held;
- scheduler entries are rebuildable indexes;
- same-time ordering requires declared dependencies/stable tie-breaks;
- periodic effects execute once;
- save/load continuation derives from canonical owner state;
- canonical stochastic outcomes use deterministic causal randomness rather than global RNG consumption order;
- legal temporal effects may be prospective/retrospective/bounded without deleting non-legal occurrence history.

The walking-skeleton proof requirements are sufficient to test these properties later.

No additional BLOCKER/HIGH was found here.

## 8. Checked and clean — fiscal/material separation

The assembled architecture does not collapse:

```text
legal permission
appropriation
available public finance
obligation
payment
administrative status
physical project
material outcome
```

The housing domain can remain delayed or disappoint despite adequate law/funding/competence. The second-domain probe also demonstrates a path with payment/material consequence but no construction project.

No additional BLOCKER/HIGH was found here.

## 9. Audit verdict

**REVISE**

- **0 BLOCKER**
- **1 HIGH**

Commit 7 should repair only the cross-domain population/material subject-association ownership finding from this audit, alongside findings from the other two Commit-6 audits.

This audit does not authorize code or independent piecemeal repairs before the consolidated Commit-7 step.
