# democracy-game-

Current accepted implementation authority: **I9 — U.S. Legal Contest Repair**

Accepted I9 SHA / exact I10 base: `e5a08e7330db73991c59600970906c57f1e275d7`

Current branch status: **I10 runtime-convergence candidate; external acceptance pending**

Exact commit SHAs remain the review/acceptance authority. Branch refs are convenience pointers.

## Current runtime state

- `IntegratedPartialRuntimeState` is the canonical simulation state.
- `IntegratedPartialRuntimeSession` is the production application/session authority.
- `createProductionGameSession()` boots the accepted U.S. configuration and I3–I9 artifact lineage for new games and restores save format 11.
- The default React application consumes the production player-safe projection and controlled command surface. Electron hosts that same built application.
- Autonomous legislature, fiscal/program, Housing, Information, Population, election, and legal owners resolve through canonical runtime rules and scheduler boundaries; React does not choose their outcomes.
- GL0 is quarantined in `src/content/gl0-synthetic` and `src/app/session.ts` for explicit regression/development fixtures. Neither is reachable from the default production entry graph.

I10 intentionally supplies a utilitarian functional interface, not final visual design. The convergence suite demonstrates an audit-free administration journey from agenda formation and enactment through implementation, Housing material causality, public Information, legal contest, election, and succession in one persistent world.

The opposition-succession capability proof uses the normal production factory with an explicit deterministic test configuration. At Day 0 that configuration maps every configured preference alias and unresolved fallback to the opposition ticket, recomputes selection/temporal/configuration hashes, and then makes no runtime mutation. The ordinary election, certification, declaration, and transfer owners end the outgoing ControlBinding while preserving and continuing the world. It is not substituted for the default U.S. configuration.

## Architecture authority/read order

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
14. `docs/13_CAUSALITY_AND_OWNERSHIP_AUDIT_V0.md` — audit evidence
15. `docs/14_PLAYER_AGENCY_AND_LEGIBILITY_AUDIT_V0.md` — audit evidence
16. `docs/15_SCOPE_AND_EXTENSIBILITY_AUDIT_V0.md` — audit evidence
17. `docs/16_COMMIT_7_CONSOLIDATED_ARCHITECTURE_REPAIR_V0.md` — latest normative repair
18. `docs/DECISIONS.md` — navigation/index
19. `docs/OPEN_QUESTIONS.md` — deferred questions

## Runtime boundaries

```text
TypeScript simulation
        ↑
application / session
        ↑
React UI

Electron = outer desktop host only
```

- `src/sim` is headless and cannot depend on React, Electron, DOM/browser APIs, Node APIs, UI state, or wall-clock/random globals.
- `src/app` may depend on simulation but not on React/Electron/UI.
- `src/ui` consumes `ProductionGameView` and production session commands rather than canonical simulation state directly; it uses no audit projection.
- Electron hosts the built web application and contains no political/game-domain logic.
- Architecture V0 semantic ownership does not imply a matching source-code module layout.

The binding pre-I8 runtime rules are in `docs/PRE_I8_RUNTIME_GUARDRAILS.md`. I10 convergence acceptance is defined in `docs/I10_RUNTIME_CONVERGENCE_ACCEPTANCE.md`.
