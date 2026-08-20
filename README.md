# democracy-game-

Status: **Architecture V0 accepted at `54afd51c6ae894df5c3680cf15df472cdcb125b2` — READY FOR WALKING SKELETON. Commit 8 is the first runtime-code candidate.**

Exact commit SHAs remain the review/acceptance authority. Branch refs are convenience pointers.

This repository is for a systemic political strategy simulation derived from **Governing Loop 0**. The accepted architecture lives in `docs/00` through `docs/16`; the Commit-6 audits are review evidence, while `docs/16_COMMIT_7_CONSOLIDATED_ARCHITECTURE_REPAIR_V0.md` contains the final narrow Architecture V0 repairs.

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

## Runtime rule

Commit 8 bootstraps only enough software structure to grow the accepted GL0 causal spine safely.

```text
headless TypeScript simulation
        ↑
application / session
        ↑
React UI

Electron = outer desktop host only
```

Current bootstrap folders are implementation scaffolding, **not** a one-module-per-architecture-concept freeze:

```text
src/sim/
src/app/
src/ui/
electron/
tests/
scripts/
```

Detailed runtime organization should emerge from executable GL0 evidence. Do not pre-create packages for every architecture noun.

### Boundary rules

- `src/sim` is headless and cannot depend on React, Electron, DOM/browser APIs, Node APIs, UI state, or wall-clock/random globals.
- `src/app` may depend on simulation but not on React/Electron/UI.
- `src/ui` consumes the application/session layer rather than canonical simulation state directly.
- Electron hosts the built web application and contains no political/game-domain logic.
- Architecture V0 semantic ownership does not imply a matching source-code module layout.

## Commit-8 bootstrap target

The first executable proof is intentionally tiny:

- create one deterministic canonical world fixture;
- expose authoritative simulation time;
- advance one canonical transition headlessly;
- prove equivalent chunked/direct advancement for that transition;
- provide a thin application/session projection;
- render that projection through a minimal React shell;
- enforce simulation dependency boundaries;
- typecheck, lint, test, and build.

Persistence, canonical history, and deterministic stochastic machinery are added when the immediate GL0 route first requires them. Uncontrolled `Math.random()` and wall-clock/browser dependencies are already forbidden in canonical sim code.

## Non-goals for bootstrap

No Housing breadth, Congress breadth, production UI, generic ECS, plugin architecture, universal event bus, government DSL, persistence framework, RNG framework, or speculative engine framework is part of the bootstrap.

After the baseline is green, runtime work should extend vertically toward the accepted causal spine:

```text
administration intent
→ proposal
→ actor decisions
→ enactment
→ fiscal / administration / state response
→ material housing
→ information / belief
→ election
→ succession
```

rather than completing isolated subsystems first.
