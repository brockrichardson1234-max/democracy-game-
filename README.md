# democracy-game-

Status: **Architecture V0 — Commit 6 accepted; Commit 7 consolidated repair candidate under final findings-only review. No runtime implementation authority yet.**

Review authority for any architecture candidate is the **exact commit SHA supplied with the review request**. Branch refs are convenience pointers only.

This repository is for a systemic political strategy game in which the player occupies a constitutionally bounded governing role and attempts to change society through political support, lawful or contested authority, fiscal resources, institutions, administration, material systems, information, and persuasion. Laws do not directly create outcomes; institutions and material domains do. Voters react to what they experience, observe, believe, attribute, prioritize, and choose to act on. Elections can remove the player without resetting the world.

## Current design rule

> Design deeply where a wrong choice would force an architectural rewrite. Defer aggressively where a wrong choice would change only content, tuning, implementation technique, or presentation.

Architecture V0 is derived from one concrete player-facing proof, **Governing Loop 0**, plus one shallow second-domain probe. It is not a universal theory of government or society.

## Architecture authority/read order

Read the current Architecture V0 candidate in this order:

1. `docs/00_GAME_AND_PLAYER_CONTRACT_V0.md`
2. `docs/01_FIRST_GOVERNING_LOOP_V0.md`
3. `docs/02_CAUSAL_ARCHITECTURE_V0.md`
4. `docs/03_STATE_OWNERSHIP_AND_PROJECTIONS_V0.md`
5. `docs/04_GOVERNMENT_AUTHORITY_AND_PROCEDURE_V0.md`
6. `docs/05_POLITICAL_ACTORS_AND_COALITIONS_V0.md`
7. `docs/06_JUDICIARY_AND_LEGAL_CONTEST_V0.md`
8. `docs/07_POPULATION_GEOGRAPHY_AND_ELECTORATE_V0.md`
9. `docs/08_INFORMATION_MEASUREMENT_AND_BELIEF_V0.md`
10. `docs/09_SIMULATION_TIME_AND_TRANSITIONS_V0.md`
11. `docs/10_HOUSING_MATERIAL_DOMAIN_V0.md`
12. `docs/11_GOVERNING_LOOP_0_WALKING_SKELETON_CONTRACT_V0.md`
13. `docs/12_ARCHITECTURE_ACCEPTANCE_AND_SECOND_DOMAIN_PROBE_V0.md`
14. `docs/13_CAUSALITY_AND_OWNERSHIP_AUDIT_V0.md` — Commit-6 audit evidence
15. `docs/14_PLAYER_AGENCY_AND_LEGIBILITY_AUDIT_V0.md` — Commit-6 audit evidence
16. `docs/15_SCOPE_AND_EXTENSIBILITY_AUDIT_V0.md` — Commit-6 audit evidence
17. `docs/16_COMMIT_7_CONSOLIDATED_ARCHITECTURE_REPAIR_V0.md` — latest narrow normative repairs
18. `docs/DECISIONS.md` — current decision index/navigation surface
19. `docs/OPEN_QUESTIONS.md` — current deferred-question register

The numbered architecture documents own the normative semantics in their scope. The Commit-6 audits are evidence/findings, not replacement architecture. `16` supersedes only the specific wording necessary to close the three accepted Commit-6 HIGH findings. `DECISIONS.md` and `OPEN_QUESTIONS.md` summarize/navigate authority; they are not independent owners of normative truth.

## Accepted gate history

- **Commit 1:** player/product boundary and Governing Loop 0 — accepted.
- **Commit 2:** causal state classes, ownership, projections, history/program/intergovernmental repairs — accepted.
- **Commit 3:** government authority/procedure, political actors/coalitions, judiciary/legal contest — accepted.
- **Commit 4:** population/geography/electorate, information/measurement/belief, simulation time/transitions/randomness — accepted.
- **Commit 5:** Housing material domain, exact walking-skeleton contract, second-domain probe, population eligibility clarification — accepted.
- **Commit 6:** three bounded whole-architecture audits — accepted, reporting 0 BLOCKER / 3 HIGH.
- **Commit 7:** one consolidated repair of those three HIGHs — current candidate under final findings-only review.

No accepted earlier gate is reopened without a direct downstream contradiction. Commit 7 does not authorize code until its final findings-only acceptance check passes.

## Governing Loop 0 in one sentence

The player inherits a geographically uneven housing-affordability problem, attempts a conditional federal housing-construction grant program, fights for political/legal/fiscal authority, watches implementation vary across institutions and states, makes at least one real post-enactment governing tradeoff, sees delayed material results become imperfect measurements and competing political claims, then faces an election whose result can end the control binding without erasing the world.

## Current causal doctrine

> Canonical state changes through explicit causal processes owned by the subsystem responsible for that fact. Other systems may reference, measure, summarize, forecast, index, expose, or react to that state, but they do not silently become alternate owners of it.

Architecture V0 preserves, among other distinctions:

- jurisdiction != geography;
- institution != actor;
- office != officeholder;
- office assignment != election result;
- control permission != legal authority;
- claimed authority != legal validity;
- legal obligation != compliance;
- procedure rules != procedure-instance facts != actor decisions;
- pending proposal != enacted law;
- authorization != appropriation != obligation != payment != material outcome;
- administrative project != physical project;
- state intent != federal determination != active intergovernmental relationship;
- material truth != measurement != information artifact;
- information artifact != belief != attribution != salience != preference != turnout != ballot/result;
- population identity/state != every domain-specific material fact associated with that population;
- cross-domain subject association has one canonical owner;
- Housing current state != immutable occurrence history;
- election result != office transfer != `ControlBinding` transition;
- scheduler/index != domain temporal authority;
- stochastic outcome semantics != global RNG consumption order;
- retrospective legal effect != automatic rewrite of non-legal occurrence history.

## Current Commit-7 repairs

The consolidated repair candidate closes only the three Commit-6 HIGH findings:

1. **Cross-domain population/material association ownership:** the material fact owner also owns its intrinsic subject association; independent relationship facts may have one dedicated relationship owner; reverse lookups remain non-authoritative.
2. **Post-enactment agency:** at least one required post-enactment decision must involve a genuine modeled tradeoff/opportunity cost/risk using already accepted state, not a free dominant “spend more” button.
3. **Authority surfaces:** this README, `DECISIONS.md`, and `OPEN_QUESTIONS.md` are synchronized to the complete Architecture V0 candidate and current process gate.

## Non-goals

Architecture V0 is not:

- an omnipotent policy-slider simulator;
- a personal citizen life simulator;
- a comprehensive legal-procedure simulator;
- a map-painting conquest game;
- a direct happiness-management game;
- a complete media/campaign/lobbying simulator;
- a universal macroeconomy;
- a universal social-policy framework;
- a system that simulates every institution, jurisdiction, voter, material domain, or legal doctrine at equal resolution; or
- permission to build speculative infrastructure disconnected from the GL0 proof.

The first content target is the United States, but the engine is not synonymous with the United States. U.S.-like institutions are a configuration of reusable political/constitutional primitives rather than the foundational ontology.

## Process gate

The agreed sequence is:

```text
Commit 6
bounded whole-architecture audits
        ↓ accepted
Commit 7
one consolidated architecture repair
        ↓ final findings-only acceptance
ARCHITECTURE V0 — READY FOR WALKING SKELETON
        ↓
Commit 8
first runtime code
```

The Commit-7 candidate is **not** implementation authority before that findings-only acceptance check.
