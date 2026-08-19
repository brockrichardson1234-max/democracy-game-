# democracy-game-

Status: **Architecture design only — Commit 1 accepted for Commit 2 derivation; Commit 2 candidate under review. Not implementation authority.**

Review authority for any architecture candidate is the exact commit SHA supplied with the review request. Branch refs are convenience pointers only.

This repository is for a systemic political strategy game in which the player occupies a constitutionally bounded governing role and attempts to change society through political support, lawful or contested authority, fiscal resources, institutions, administration, and persuasion. Laws do not directly create outcomes; institutions and material systems do. Voters react to what they experience, observe, believe, and attribute. Elections can remove the player without resetting the world.

## Current design rule

> Design deeply where a wrong choice would force an architectural rewrite. Defer aggressively where a wrong choice would change only content, tuning, or presentation.

The architecture is derived from one concrete player-facing proof, **Governing Loop 0**, rather than from a universal theory of government.

## Current read order

1. `docs/00_GAME_AND_PLAYER_CONTRACT_V0.md`
2. `docs/01_FIRST_GOVERNING_LOOP_V0.md`
3. `docs/02_CAUSAL_ARCHITECTURE_V0.md`
4. `docs/03_STATE_OWNERSHIP_AND_PROJECTIONS_V0.md`
5. `docs/DECISIONS.md`
6. `docs/OPEN_QUESTIONS.md`

Commit 1 is accepted as the player/product boundary for deriving architecture. Commit 2 adds only the causal state classes, ownership rules, projection rules, and GL0 source-of-truth map. Detailed government/legal/political actor primitives remain intentionally deferred to Commit 3.

## Governing Loop 0 in one sentence

The player inherits a geographically uneven housing-affordability problem, attempts a federal housing-construction grant program, fights to obtain political and legal authority, watches implementation vary across institutions and states, sees delayed material results become imperfect measurements and competing political claims, then faces an election whose result does not erase the world.

## Current causal doctrine

> Canonical state changes through explicit causal processes owned by the subsystem responsible for that fact. Other systems may reference, measure, summarize, forecast, or react to that state, but they do not silently become alternate owners of it.

Important consequences include:

- player control selects intents but owns no political truth;
- geography and population are separately owned;
- districts/electorates do not own copied people;
- law and fiscal authority do not own material outcomes;
- programs do not own the material domains they affect;
- polls/reports/forecasts are artifacts or projections rather than world truth;
- election results do not own current office assignments;
- historical records own what happened, not what is true now; and
- UI owns nothing underneath it.

## Non-goals

This project is not:

- an omnipotent policy-slider simulator;
- a personal citizen life simulator;
- a comprehensive legal-procedure simulator;
- a map-painting conquest game;
- a direct happiness-management game;
- a puzzle where one objectively correct policy guarantees one electoral result; or
- an attempt to simulate every institution, jurisdiction, voter, or legal doctrine at equal resolution.

The first content target is the United States, but the engine must not be synonymous with the United States. America is a configuration of reusable political and constitutional primitives, not a hard-coded universe.

## Process stop

This branch is being built in bounded commits. Commit 2 does **not** authorize runtime implementation and does not design Commit 3. After Commit 2 review/repair, the next bounded step is government authority, political actors/coalitions, and judiciary/legal contest.
