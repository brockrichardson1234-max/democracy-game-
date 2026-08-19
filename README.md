# democracy-game-

Status: **Architecture design only — Commits 1–2 accepted for Commit 3 derivation; Commit 3 candidate under review. Not implementation authority.**

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
5. `docs/04_GOVERNMENT_AUTHORITY_AND_PROCEDURE_V0.md`
6. `docs/05_POLITICAL_ACTORS_AND_COALITIONS_V0.md`
7. `docs/06_JUDICIARY_AND_LEGAL_CONTEST_V0.md`
8. `docs/DECISIONS.md`
9. `docs/OPEN_QUESTIONS.md`

Commit 1 is accepted as the player/product boundary. Commit 2 is accepted at the BLOCKER/HIGH threshold as the causal ownership/projection boundary, including its normative Section 19 repair. Commit 3 now derives the internal governmental, political-actor, federalism, and legal-contest architecture required by GL0.

Commit-3 candidate invariants are normative within their owning `04`–`06` documents during review. `DECISIONS.md` remains the accepted Commit-1/2 decision log until the Commit-3 candidate survives review; this avoids duplicating unaccepted decisions into a second authority surface.

## Governing Loop 0 in one sentence

The player inherits a geographically uneven housing-affordability problem, attempts a federal housing-construction grant program, fights to obtain political and legal authority, watches implementation vary across institutions and states, sees delayed material results become imperfect measurements and competing political claims, then faces an election whose result does not erase the world.

## Current causal doctrine

> Canonical state changes through explicit causal processes owned by the subsystem responsible for that fact. Other systems may reference, measure, summarize, forecast, or react to that state, but they do not silently become alternate owners of it.

Commit 3 applies that doctrine to government:

- jurisdiction is not geography;
- institution is not actor;
- office is not officeholder;
- office assignment is not election result;
- legal authority is contextual and source-grounded;
- claimed authority is not legal validity;
- procedure state is not actor decision state;
- pending proposal is not enacted law;
- party/coalition is not a hive mind;
- political support is not one authoritative scalar;
- legally operative requirements are not program-owned copies;
- state intent is not the full intergovernmental relationship;
- judicial claim is not legal truth;
- judicial order is not automatic compliance;
- court action does not directly rewrite material history.

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

Commit 3 is architecture only. It does **not** authorize runtime implementation, population/electorate representation, information/belief formulas, or transition/tick ordering. After Commit 3 review/repair, the next bounded architecture step is population/geography/electorate + information/measurement/belief + simulation time/transitions.
