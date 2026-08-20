# 12 — Architecture Acceptance and Second-Domain Probe V0

Status: **Commit-5 architecture candidate for review. Not implementation authority.**

## 1. Purpose

The architecture has been derived from a housing governing loop. Before the planned whole-architecture audit stage, Commit 5 needs one narrow check that the accepted ownership model is not secretly a housing-only ontology.

This document defines:

1. the Commit-5 derived Architecture V0 candidate boundary; and
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

**The second-domain probe exists only to detect hidden housing-specific ownership assumptions. It may require a narrow repair to an earlier accepted wording when a direct downstream contradiction is demonstrated, but it may not expand Commit 5 into a general social-policy or macroeconomic simulator.**

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

The probe demonstrates a necessary clarification to the broad Commit-4 phrase “eligibility-relevant attributes.” Ordinary-population identity does not make `PopulationState` the owner of every material fact that an eligibility rule may inspect.

`PopulationState` owns ordinary population identity/weight, residence linkage, core represented demographic facts assigned to that owner, and ordinary-population political state.

A future labor/income material domain may separately own supported material facts linked to that same population, such as:

- employment/unemployment status or aggregate labor-state facts;
- earnings/income/resources relevant to eligibility and household consequence;
- duration/other labor-income material facts.

The future labor/income domain must not duplicate people. It owns only its domain-specific material facts and references/associates them with the canonical ordinary population at the supported aggregate resolution.

LegalOrder owns legally operative benefit/eligibility rules.

Administration owns claims/workflow/determinations and lawful operational configuration.

Fiscal owners own obligation/payment.

The relevant material/social owner resolves the actual household/resource consequence of payment.

Information/measurement/belief remain under Commit 4.

Eligibility therefore consumes facts from their actual owners rather than relocating those facts into PopulationState:

```text
applicable legal eligibility rules
+ PopulationState-owned facts
+ Labor/Income-domain facts
+ other relevant canonical facts
+ lawful administrative configuration
        ↓
administrative eligibility determination
```

### Candidate hard invariant AP-02

**One canonical ordinary population does not imply PopulationState owns every domain-specific material attribute associated with that population. Domain-specific material facts remain with their material owner; eligibility and other cross-domain decisions read relevant facts from their actual canonical owners without duplicating them into PopulationState.**

## 5. Probe path

The architecture must be capable, conceptually, of representing:

```text
population identity/residence + labor-domain facts exist under distinct owners
→ government proposes benefit-rule change
→ applicable political/legal procedure resolves
→ legal eligibility/benefit source becomes effective
→ claimant facts remain owned by their actual canonical owners
→ administrative process receives claim/eligibility case
→ determination derives from legal rules + lawful admin config + canonical facts from relevant owners
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

Eligibility facts exist under their canonical owners, but payment is delayed because administration has not completed the determination.

### AP-C — determination, no payment yet

An approved claim does not mean money has moved.

### AP-D — payment, later legal reversal

Payment occurred; later legal determination may create repayment/other obligation without deleting the historical payment.

### AP-E — measurement lag

Household/resource effects occur before official statistics/reporting capture them.

### AP-F — political misattribution

Population may perceive or attribute the benefit differently from the actual legal/fiscal/material chain.

If any of these requires a global `PolicyOutcome`, copied population, PopulationState-owned copies of labor/income facts, program-owned law, payment-equals-outcome shortcut, or history rewrite, Architecture V0 has failed the probe.

### Candidate hard invariant AP-03

**The probe is passed only if its hostile cases can be represented by the same accepted ownership and transition doctrine without a housing-shaped project pipeline, a PopulationState society-god-object, or a new cross-domain shortcut owner.**

## 8. Commit-5 architecture closure boundary

After Commit 5 is accepted, the derived Architecture V0 candidate is considered **component-complete for whole-architecture auditing**, not implementation-authorized.

Commit 5 closes the remaining derived pieces needed before those audits:

- first housing material domain;
- exact GL0 walking-skeleton proof contract;
- second-domain generality probe;
- any narrow contradiction directly exposed by that probe.

The already planned next gates remain:

```text
Commit 6
bounded whole-architecture audits

Commit 7
one consolidated architecture repair / final acceptance
→ READY FOR WALKING SKELETON

Commit 8
first runtime code
```

This document does not design Commit 6 or Commit 7. It only preserves the agreed gate sequence and prevents Commit-5 acceptance from being mistaken for code authorization.

### Candidate hard invariant AP-04

**Commit-5 acceptance closes the derived Architecture V0 candidate for bounded whole-architecture audit. It does not authorize runtime implementation. Runtime begins only after the planned audit stage and consolidated repair/final-acceptance gate mark the architecture `READY FOR WALKING SKELETON`.**

## 9. Reopen rule

Once a commit is accepted at the requested review threshold, later commits do not reopen it merely because a different design might be preferable.

An accepted invariant should be reopened only when downstream work reveals:

- a direct contradiction;
- an unowned canonical fact required by the accepted proof;
- duplicate semantic ownership;
- a causal path impossible without violating an accepted invariant;
- deterministic/persistence failure that the existing contract cannot represent.

The PopulationState/domain-specific eligibility clarification in this Commit-5 repair is an example of a legitimate downstream contradiction exposed by the second-domain probe.

Content preference, nicer naming, or speculative future flexibility is not enough.

### Candidate hard invariant AP-05

**Accepted architecture is revised downstream only for demonstrated contradiction or missing causal ownership required by an accepted proof, not for unconstrained redesign preference.**

## 10. Implementation authorization boundary

Commit 5 does not authorize implementation.

Its role is to hand a component-complete Architecture V0 candidate and explicit GL0 proof contract into the planned bounded whole-architecture audits.

Only after those audits and the planned consolidated repair/final-acceptance step close may the first implementation phase begin.

When implementation is eventually authorized, it should prioritize vertical causal continuity over subsystem breadth, and each implementation slice should move toward the accepted runnable GL0 chain rather than completing one giant subsystem in isolation.

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
- designing the contents of Commit 6/7 audits beyond preserving their agreed process role;
- beginning runtime implementation before those gates close.

## 13. Commit-5 adversarial review questions

Review should report only BLOCKER/HIGH issues that make the next whole-architecture audit stage unsafe:

1. Does the housing domain preserve accepted ownership and permit competent-but-disappointing material outcomes?
2. Does the walking-skeleton contract traverse every GL0 ownership seam without expanding into subsystem breadth?
3. Is the post-enactment player decision genuinely causal?
4. Does the legal-contest skeleton force an actual operative-order/compliance proof?
5. Can deterministic time/randomness/save-load claims be tested in the eventual skeleton?
6. Does the second-domain probe preserve one ordinary population while keeping domain-specific material facts with their own owners?
7. Is Commit 5 clearly component-complete for whole-architecture audit but not code-authorizing?
8. Has Commit 5 reopened an accepted Commit 1–4 issue only where a direct downstream contradiction was demonstrated?

If all answers are satisfactory at BLOCKER/HIGH threshold, Commit 5 is ready to enter the planned bounded whole-architecture audit stage. It is **not** yet `READY FOR WALKING SKELETON` and does not authorize code.
