# Decisions

Status: **Commit-1 repair decision log for review.**

This file records decisions already chosen for the current architecture candidate. A later review may revise them in a new commit; this file does not pretend they are eternally immutable.

## D-001 — Player control binding

**Decision:** The player controls the strategic decision surface of an executive administration anchored to an individual officeholder occupying an executive office through a valid office assignment in the constitutional/political order. Governing Loop 0 begins with an office assignment produced by election, but election is not a universal requirement for every possible officeholder. The player is not the officeholder, administration, party, country, or political world as canonical state.

**Why:** Preserves independent world identity, succession after election/death/resignation/incapacity, future alternate control modes, and causal separation between player intent and world response.

**Current class:** Candidate hard invariant.

## D-002 — Player command semantics

**Decision:** Player commands are institutional intents/attempts issued through the controlled administration. They do not directly mutate material outcomes, votes, beliefs, or other actors' choices.

**Why:** Prevents a policy-slider ontology from entering the engine through the command layer.

**Current class:** Candidate hard invariant.

## D-003 — Contested political actions use a four-stage admission boundary

**Decision:** Every player command is conceptually evaluated as: (1) structural validity, (2) actor capability/attemptability, (3) authority/legal validity, and (4) compliance/consequence. Only commands that pass structural validity and actor-attemptability enter canonical political history as attempts. A meaningful political action may therefore be attempted even when its authority is disputed or potentially unlawful. Legal validity and compliance are world questions. Malformed input or a direct-world mutation that the controlled office cannot meaningfully attempt is rejected without creating a political event.

**Why:** Preserves executive overreach, bureaucratic resistance, federal-state conflict, judicial review, constitutional crises, and later democratic erosion without allowing arbitrary debug-style world mutations to masquerade as political acts.

**Current class:** Candidate hard invariant.

## D-004 — Institutional control is relational

**Decision:** Effective control/compliance is evaluated for a particular actor or institution responding to a particular action under current conditions. No universal `institutionalControl`, `legalAuthority`, `politicalPower`, or `legitimacy` meter is allowed to cause behavior.

**Why:** A government may be strong in one institutional relationship and weak in another. Authoritarian drift and normal democratic resistance should emerge from relational state.

**Current class:** Candidate hard invariant.

## D-005 — Regime type is derived

**Decision:** Labels such as competitive democracy, illiberal democracy, or authoritarian regime may later summarize underlying state, but cannot cause institutional behavior or transition the world through a regime switch.

**Why:** Avoids replacing political causality with a more sophisticated-looking score.

**Current class:** Candidate hard invariant.

## D-006 — Player knowledge is institutionally bounded

**Decision:** The player receives strategically useful reports, measurements, forecasts, polls, coalition assessments, and other institutionally plausible information rather than exact hidden simulation truth.

**Why:** Preserves uncertainty without importing ApocalypseEngine-style personal perception into a national strategy game.

**Current class:** Candidate hard invariant.

## D-007 — Election loss does not reset or freeze the world

**Decision:** When the controlled administration loses office, the player-control binding ends at the effective transfer boundary while legal, fiscal, institutional, administrative, material, informational, and political state persists as of that boundary. Persisted state may then change only through ordinary causal processes that have authority or capability to change it.

**Why:** Makes elections consequential, establishes institutional/path-dependent history, and prevents succession from becoming either a reset or a permanent freeze of inherited state.

**Current class:** Candidate hard invariant.

## D-008 — GL0 may end active control after succession proof

**Decision:** For Governing Loop 0, active player control may end after defeat once the simulation has advanced enough to prove successor inheritance. The final product's continuation model is deferred.

**Why:** Lets the first proof demonstrate persistence without prematurely designing opposition, successor, or spectator gameplay.

**Current class:** V0 implementation assumption.

## D-009 — First governing domain is a conditional housing-construction grant program

**Decision:** Governing Loop 0 uses a geographically uneven housing-affordability problem and a conditional federal housing-construction grant program as the first causal domain.

**Why:** Housing exercises politics, fiscal authority, administration, federalism, implementation latency, physical/material outcomes, measurement lag, attribution, and elections in one bounded mechanism.

**Current class:** V0 scenario decision.

## D-010 — Housing design has a few consequential dimensions

**Decision:** The first proposal is shaped by a small number of real tradeoff dimensions such as matching rate, state eligibility/participation conditions, project eligibility requirements, distribution formula, administrative funding, and reporting/enforcement requirements. Exact counts and tuning remain open. GL0 does not require first-class local-government simulation merely because a project may later depend on local eligibility facts.

**Why:** Produces strategic choice while preventing a 100-policy content explosion or a premature municipality/zoning simulation before the loop exists.

**Current class:** V0 scenario decision.

## D-011 — Federalism appears inside GL0

**Decision:** State participation/refusal/capacity is part of the first complete governing loop rather than a late decorative feature.

**Why:** A federal housing grant that bypasses state response would prove the wrong U.S. governing architecture and encourage federalism to be bolted on later.

**Current class:** Candidate architecture requirement.

## D-012 — Walking skeleton uses a synthetic miniature federation

**Decision:** The first runtime proof may use a synthetic federation with a small number of deliberately different state fixtures rather than claiming to simulate all 50 states.

**Why:** Allows hostile structural cases with minimal content while testing the same jurisdiction/government semantics intended for the United States configuration.

**Current class:** V0 implementation assumption.

## D-013 — U.S. is first configuration, not the engine

**Decision:** The eventual first game target is the United States, but generic constitutional/political concepts must not be defined solely as President + House + Senate + Governor special cases.

**Why:** Prevents U.S. content from becoming foundational ontology and makes structural variance testable.

**Current class:** Candidate architecture requirement.

## D-014 — Democracy-like shell is presentation only

**Decision:** National dashboards, problems, policies, indicators, causal explanation, elections, and time advancement are player-facing design grammar. They own no simulation state and do not dictate canonical objects.

**Why:** Preserves accessibility without recreating the ontology of the reference game.

**Current class:** Candidate hard invariant.

## D-015 — Architecture is derived from Governing Loop 0

**Decision:** The first governing loop is the consumer and authority context for Architecture V0. A new concept must serve the loop or prevent a demonstrated foreseeable rewrite.

**Why:** Prevents architecture from becoming the product.

**Current class:** Process invariant for Architecture V0.

## D-016 — No runtime implementation in Commit 1

**Decision:** Commit 1 contains game/player/GL0 design only. Architecture ownership, government primitives, population, belief, transition semantics, and runtime code are later bounded commits.

**Why:** Preserves a clean review boundary before derived architecture is written.

**Current class:** Process decision.

## D-017 — Administration control is not actor ownership

**Decision:** A `ControlBinding` grants the player access to the administration's authorized strategic decision surface. It does not make constituent officeholders, appointees, agencies, civil servants, staff, or other personnel player-owned actors. Routine staff activity may be abstracted where no meaningful independent decision exists, but compliance, resistance, judgment, and legally independent choices remain world behavior.

**Why:** Prevents the executive administration from becoming a hidden player hive mind while still allowing appropriate abstraction of routine staff work.

**Current class:** Candidate hard invariant.

## D-018 — Housing is not the whole electorate

**Decision:** GL0 may begin with persistent partisan dispositions, candidate/incumbent evaluations, political memories, turnout tendencies, and background issue salience supplied by the fixture. Housing is the first dynamically simulated policy domain, not the sole determinant of electoral preference or turnout.

**Why:** Prevents the first election model from degenerating into a housing-referendum happiness function while avoiding premature implementation of many additional material policy domains.

**Current class:** Candidate architecture requirement for the GL0 electorate seam.
