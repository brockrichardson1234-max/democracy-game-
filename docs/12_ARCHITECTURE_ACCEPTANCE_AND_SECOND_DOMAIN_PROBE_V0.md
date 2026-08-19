# 12 — Architecture Acceptance and Second-Domain Probe V0

Status: **Commit-5 architecture candidate for review. Not implementation authority.**

## 1. Purpose

The architecture has been derived from a housing governing loop. Before runtime implementation begins, Commit 5 needs one narrow check that the accepted ownership model is not secretly a housing-only ontology.

This document defines:

1. the Architecture V0 acceptance boundary after Commit 5; and
2. one deliberately shallow second-domain probe using unemployment insurance-like benefits.

The probe is not a second playable system and is not authorization to implement labor-market breadth.

## 2. Why a second-domain probe exists

A housing-only architecture could accidentally bake in assumptions such as:

- every policy produces a physical construction project;
- every program depends on state grant participation;
- every material outcome is stock/capacity based;
- every payment is discretionary project finance;
- every policy effect has long construction latency.

The accepted architecture claims to be broader than that while still being bounded by demonstrated need.

A second-domain probe should therefore test structurally different causal edges without demanding a second game.

### Candidate hard invariant AP-01

**The second-domain probe exists only to detect hidden housing-specific ownership assumptions. It may require an architecture repair if a current invariant cannot represent the probe, but it may not expand Commit 5 into a general social-policy or macroeconomic simulator.**

## 3. Selected probe: unemployment insurance-like benefit

The probe uses a synthetic unemployment-insurance-like program because it stresses different seams from housing:

```text
labor/income eligibility facts
+ legally operative eligibility/benefit rules
+ administrative claim/determination
+ fiscal obligation/payment
→ household/population income/resource consequence
→ measurement/information/political response
```

Unlike the housing grant route, it need not create a physical project or construction pipeline.

This is enough to ask whether the architecture incorrectly assumes every government intervention must pass through Housing-shaped objects.

No real federal/state UI law, tax system, employer system, or labor-market model is specified here.

## 4. Probe-only semantic owners

The probe assumes a future material/social domain could own supported labor/income facts such as:

- employment/unemployment status or aggregate labor-state facts;
- earnings/income/resources relevant to eligibility and household consequence;
- duration/other eligibility-relevant material facts.

PopulationState still owns ordinary population identity/weight/demographics/residence and population political state.

The future labor/income domain must not duplicate people.

LegalOrder owns legally operative benefit/eligibility rules.

Administration owns claims/workflow/determinations and lawful operational configuration.

Fiscal owners own obligation/payment.

The relevant material/social owner resolves the actual household/resource consequence of payment.

Information/measurement/belief remain under Commit 4.

### Candidate hard invariant AP-02

**A non-housing material/social domain may introduce new facts under its own owner, but it must reuse the accepted cross-domain ownership seams for population, law, administration, fiscal execution, information, politics, and time rather than creating a domain-specific policy shortcut.**

## 5. Probe path

The architecture must be capable, conceptually, of representing:

```text
population/labor facts exist
→ government proposes benefit-rule change
→ applicable political/legal procedure resolves
→ legal eligibility/benefit source becomes effective
→ claimant/population facts remain owned by their canonical owners
→ administrative process receives claim/eligibility case
→ determination derives from legal rules + lawful admin config + canonical case facts
→ fiscal obligation created when appropriate
→ payment executed
→ material household/resource consequence occurs
→ official measurement/report may lag
→ political actors/population process information under accepted rules
```

The probe is satisfied if every step has an accepted owner or an obvious future material-domain refinement that does not contradict Architecture V0.

## 6. What this probe deliberately does not decide

It does not decide:

- whether unemployment insurance is federal, state, or joint in final content;
- payroll taxes;
- employer accounts;
- labor-search behavior;
- macroeconomic multipliers;
- fraud systems;
- appeals breadth;
- benefit duration formulas;
- individual household simulation;
- automatic stabilizer tuning;
- actual U.S. legal content.

Those are content/domain-design questions after the first runtime proof, if the product needs them.

## 7. Probe hostile cases

The current architecture should conceptually tolerate:

### AP-A — law effective, no eligible claimant

A legal benefit exists but no material/fiscal effect occurs merely because the law exists.

### AP-B — eligible claimant, administrative delay

Eligibility facts exist, but payment is delayed because administration has not completed the determination.

### AP-C — determination, no payment yet

An approved claim does not mean money has moved.

### AP-D — payment, later legal reversal

Payment occurred; later legal determination may create repayment/other obligation without deleting the historical payment.

### AP-E — measurement lag

Household/resource effects occur before official statistics/reporting capture them.

### AP-F — political misattribution

Population may perceive or attribute the benefit differently from the actual legal/fiscal/material chain.

If any of these requires a global `PolicyOutcome`, copied population, program-owned law, payment-equals-outcome shortcut, or history rewrite, Architecture V0 has failed the probe.

### Candidate hard invariant AP-03

**The probe is passed only if its hostile cases can be represented by the same accepted ownership and transition doctrine without a housing-shaped project pipeline or new cross-domain shortcut owner.**

## 8. Architecture V0 acceptance boundary

After Commit 5, Architecture V0 is considered closed for the first executable proof when adversarial review finds no BLOCKER/HIGH contradiction in:

- player/control semantics;
- causal ownership/projections;
- government/legal/political actor architecture;
- population/geography/electorate;
- information/measurement/belief;
- simulation time/transitions/randomness;
- first housing material domain;
- GL0 walking-skeleton contract;
- second-domain generality probe.

Acceptance means these are sufficient to begin the walking skeleton.

It does **not** mean:

- the architecture is eternally frozen;
- all future domains are already designed;
- all formulas/content are known;
- lower-severity issues cannot be repaired;
- later evidence cannot justify a deliberate architectural change.

### Candidate hard invariant AP-04

**Architecture V0 acceptance authorizes implementation of the accepted GL0 walking skeleton, not implementation of every foreseeable political, material, electoral, or social system. Future architecture changes require demonstrated causal need or contradiction, not speculative completeness.**

## 9. Reopen rule

Once a commit is accepted at the requested review threshold, later commits do not reopen it merely because a different design might be preferable.

An accepted invariant should be reopened only when downstream work reveals:

- a direct contradiction;
- an unowned canonical fact required by the accepted proof;
- duplicate semantic ownership;
- a causal path impossible without violating an accepted invariant;
- deterministic/persistence failure that the existing contract cannot represent.

Content preference, nicer naming, or speculative future flexibility is not enough.

### Candidate hard invariant AP-05

**Accepted architecture is revised downstream only for demonstrated contradiction or missing causal ownership required by an accepted proof, not for unconstrained redesign preference.**

## 10. First implementation authorization boundary

If Commit 5 is accepted, the next phase may implement the GL0 skeleton described in `11`.

The first implementation should prioritize vertical causal continuity over subsystem breadth.

A legitimate implementation sequence may be sliced internally, but each slice should move toward a runnable chain rather than completing one giant subsystem in isolation.

Implementation is not authorized by this candidate until review accepts it.

Commit 5 does not design source-code packages, class names, database schemas, serialization formats, UI framework, scheduler implementation, or test framework.

## 11. Implementation acceptance evidence to require later

Although this document does not implement code, the eventual walking-skeleton acceptance should require evidence such as:

- deterministic fixture initialization;
- reproducible causal route outputs;
- owner-level state inspection/audit;
- hostile path tests from `11`;
- time-chunk/save-load equivalence;
- stochastic causal reproducibility where randomness is used;
- persistence through ordinary succession;
- evidence that player-facing information excludes hidden canonical truth;
- proof that changing a projection/report does not mutate source state;
- proof that bill/enactment/funding/payment/project/material/election stages do not collapse.

Exact tooling and test counts are implementation decisions.

## 12. Rejected Commit-5 expansion

Rejected as part of this gate:

- building a second playable unemployment system;
- designing a universal `MaterialDomain` inheritance hierarchy;
- freezing every future social-domain API;
- implementing a macroeconomy;
- designing production UI;
- completing real U.S. content;
- adding foreign policy, war, local government, lobbying, campaigns, or authoritarian breadth;
- designing Commit 6 implementation internals before Commit 5 review.

## 13. Commit-5 adversarial review questions

Review should report only BLOCKER/HIGH issues that make the first runtime proof unsafe:

1. Does the housing domain preserve accepted ownership and permit competent-but-disappointing material outcomes?
2. Does the walking skeleton traverse every GL0 ownership seam without expanding into subsystem breadth?
3. Is the post-enactment player decision genuinely causal?
4. Can the legal-contest and succession routes be proven without bespoke story-state shortcuts?
5. Can deterministic time/randomness/save-load claims be tested in the skeleton?
6. Does the second-domain probe expose any housing-specific ontology or unowned fact?
7. Does Architecture V0 acceptance authorize only the bounded walking skeleton rather than speculative engine completion?
8. Has Commit 5 reopened an accepted Commit 1–4 issue without a direct downstream contradiction?

If all answers are satisfactory at BLOCKER/HIGH threshold, Architecture V0 is ready to hand off to the walking-skeleton implementation phase.
