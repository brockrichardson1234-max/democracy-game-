# Pre-I8 Runtime Guardrails

These rules are binding until runtime convergence is accepted at I10.

## GL0 freeze

GL0 is frozen for feature development. The synthetic `GameSession` / `WorldState` runtime is a regression and development fixture, not the production target. It may receive only bounded maintenance needed to preserve existing fixture behavior until convergence; it must not receive I8, I9, or other new U.S. simulation features.

## I8 and I9 runtime authority

I8 and I9 must extend only `IntegratedPartialRuntimeState` / `IntegratedPartialRuntimeSession`, or their accepted successors. They may reuse generic GL0 concepts or algorithms where architecturally valid, but must not deepen GL0 as a second production simulation engine.

The default React/Electron application may remain on GL0 only until the mandatory I10 convergence gate. Its current use of GL0 does not make GL0 the accepted U.S. runtime.
