# I10 Runtime Convergence Acceptance

I10 cannot be accepted unless all of the following are true:

1. The production/default application boots the accepted U.S. runtime.
2. `IntegratedPartialRuntimeState`, or its accepted successor, is the canonical production simulation state.
3. `IntegratedPartialRuntimeSession`, or its accepted successor, is the production application/session authority.
4. One complete I3→I9 route is executable using only legitimate non-audit player commands plus autonomous/owner resolution.
5. No audit injection method is required for the canonical acceptance journey.
6. Player-safe projections expose every decision required by that journey.
7. The player is never required to inspect canonical/debug truth to proceed.
8. Election/succession may remove the player's `ControlBinding` while the same persistent world continues.
9. Save/load works through the complete player route.
10. Coarse/fine advancement remains deterministic through the complete route.
11. The default React/Electron production entrypoint does not boot GL0 synthetic state.
12. GL0 is removed from production or explicitly quarantined as a test/development fixture.
13. `npm run verify` is green in CI.
14. I10 acceptance means **the accepted U.S. simulation is now the game runtime**, not merely **another headless composition test passed**.
