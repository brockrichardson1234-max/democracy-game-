# democracy-game-

Status: **architecture design only — not implementation authority**.

Active design branch: `design/governing-loop-0-architecture`

This repository is for a systemic political strategy game in which the player occupies a constitutionally bounded governing role and attempts to change society through political support, lawful or contested authority, fiscal resources, institutions, administration, and persuasion. Laws do not directly create outcomes; institutions and material systems do. Voters react to what they experience, observe, believe, and attribute. Elections can remove the player without resetting the world.

## Current design rule

> Design deeply where a wrong choice would force an architectural rewrite. Defer aggressively where a wrong choice would change only content, tuning, or presentation.

The architecture is derived from one concrete player-facing proof, **Governing Loop 0**, rather than from a universal theory of government.

## Current read order

1. `docs/00_GAME_AND_PLAYER_CONTRACT_V0.md`
2. `docs/01_FIRST_GOVERNING_LOOP_V0.md`
3. `docs/DECISIONS.md`
4. `docs/OPEN_QUESTIONS.md`

Later architecture documents are intentionally absent until Commit 1 is reviewed.

## Governing Loop 0 in one sentence

The player inherits a geographically uneven housing-affordability problem, attempts a federal housing-construction grant program, fights to obtain political and legal authority, watches implementation vary across institutions and states, sees delayed material results become imperfect measurements and competing political claims, then faces an election whose result does not erase the world.

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

This branch is being built in bounded commits. Commit 1 freezes only the game/player premise and Governing Loop 0 for review. No runtime code is authorized by this commit.
