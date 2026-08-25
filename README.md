# democracy-game-

Current accepted implementation authority: **I7 — U.S. Integrated Partial Runtime**

Accepted SHA: `9cdf1881ddb30d5c70901d5be3bd77148ae4b07a`

Exact commit SHAs remain the review/acceptance authority. Branch refs are convenience pointers.

## Current runtime state

- The accepted U.S. runtime is integrated headlessly through Housing.
- The default React/Electron application remains the legacy GL0 development harness.
- GL0 is frozen for new simulation features and retained only as a regression/development fixture.
- I8 and I9 extend only the accepted U.S. integrated runtime.
- Runtime convergence is mandatory at I10.

The project is not yet presented as an end-to-end playable U.S. simulation. The production/default application does not boot the accepted U.S. runtime yet.

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
headless TypeScript simulation
        ↑
application / session
        ↑
React UI

Electron = outer desktop host only
```

- `src/sim` is headless and cannot depend on React, Electron, DOM/browser APIs, Node APIs, UI state, or wall-clock/random globals.
- `src/app` may depend on simulation but not on React/Electron/UI.
- `src/ui` consumes the application/session layer rather than canonical simulation state directly.
- Electron hosts the built web application and contains no political/game-domain logic.
- Architecture V0 semantic ownership does not imply a matching source-code module layout.

The binding pre-I8 runtime rules are in `docs/PRE_I8_RUNTIME_GUARDRAILS.md`. I10 convergence acceptance is defined in `docs/I10_RUNTIME_CONVERGENCE_ACCEPTANCE.md`.
