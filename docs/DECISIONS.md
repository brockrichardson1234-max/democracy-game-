# Decisions

Status: **Commit-2 architecture candidate decision log for review.**

This file records decisions already chosen for the current architecture candidate. A later review may revise them in a new commit; this file does not pretend they are eternally immutable.

## D-001 — Generic player control binding

**Decision:** A `PlayerSession` may hold a `ControlBinding` over a supported player decision surface grounded in canonical actors, offices, administrations, or institutions. The binding and decision surface are not canonical political world state. Changing a decision source from autonomous selection to player selection does not change the downstream causal semantics of the resulting canonical intent/action.

**Why:** Preserves independent world identity, future alternate playable roles, and causal separation between who selects a decision and how the world resolves it.

**Current class:** Candidate hard invariant.

## D-002 — Player command semantics

**Decision:** Player commands are institutional intents/attempts submitted through the current supported decision surface. They do not directly mutate material outcomes, votes, beliefs, or other actors' choices.

**Why:** Prevents a policy-slider ontology from entering the engine through the command layer.

**Current class:** Candidate hard invariant.

## D-003 — Contested political actions use a four-stage admission boundary

**Decision:** Every player command is conceptually evaluated as: (1) structural validity, (2) actor capability/attemptability, (3) authority/legal validity, and (4) compliance/consequence. Only commands that pass structural validity and actor-attemptability enter canonical political history as player-issued attempts. A meaningful political action may therefore be attempted even when its authority is disputed or potentially unlawful. Legal validity and compliance are world questions. Malformed input or a direct-world mutation that the bound role cannot meaningfully attempt is rejected without creating a political event.

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

## D-006 — Player knowledge follows ownership, provenance, and access

**Decision:** The player receives strategically useful information that the bound role can legitimately know or access. Authoritative records and directly controlled institutional acts available to that role may be presented exactly. Hidden voter beliefs, private motivations, future effects, imperfectly measured material state, and inaccessible actor-specific information are not exposed merely because the simulation stores them.

**Why:** Preserves uncertainty without creating artificial fog around exact facts the administration truly knows.

**Current class:** Candidate hard invariant.

## D-007 — Election result, office state, and control binding are distinct

**Decision:** Elections produce constitutionally/politically consequential selection results. Legal entitlement to office, office assignment, institutional recognition/compliance, and player-control binding change through applicable world processes rather than through an automatic universal `electionLost -> bindingRemoved` transition. None of these transitions resets the world.

**Why:** Preserves normal democratic succession while leaving legitimate architecture space for certification disputes, judicial orders, refusal, institutional splits, altered rules, or other future contested-authority states.

**Current class:** Candidate hard invariant.

## D-008 — GL0 uses an ordinary uncontested defeat/transfer proof

**Decision:** Governing Loop 0 may end active player control after an ordinary uncontested electoral defeat once applicable constitutional/political processes have transferred the executive office, the outgoing administration actually ceases to hold the GL0 decision surface, and successor inheritance has been demonstrated. The final product's continuation model and contested election-transfer gameplay are deferred.

**Why:** Lets the first proof demonstrate persistence and correct separation of election result from actual transfer without prematurely designing opposition, successor, or constitutional-crisis gameplay.

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

## D-017 — Decision surface control is not actor ownership or legal authority

**Decision:** A `ControlBinding` grants access to a **supported** player decision surface. It does not make constituent officeholders, appointees, agencies, civil servants, staff, or other personnel player-owned actors, and it does not establish that a selected action is lawful. Routine staff activity may be abstracted where no meaningful independent decision exists, but compliance, resistance, judgment, legally independent choices, and legal validity remain world behavior.

**Why:** Prevents both a hidden player hive mind and the accidental collapse of control permission into constitutional/legal authority.

**Current class:** Candidate hard invariant.

## D-018 — Housing is not the whole electorate

**Decision:** GL0 may begin with persistent partisan dispositions, candidate/incumbent evaluations, political memories, turnout tendencies, and background issue salience supplied by the fixture. Housing is the first dynamically simulated policy domain, not the sole determinant of electoral preference or turnout.

**Why:** Prevents the first election model from degenerating into a housing-referendum happiness function while avoiding premature implementation of many additional material policy domains.

**Current class:** Candidate architecture requirement for the GL0 electorate seam.

## D-019 — GL0 binds specifically to an executive administration

**Decision:** Governing Loop 0's first supported `ControlBinding` targets an executive-administration strategic decision surface grounded in an administration headed by an officeholder occupying an executive office through an office assignment. This is the GL0 player mode, not the universal player ontology.

**Why:** Keeps the first game concrete while preserving future role-specific control surfaces without designing career mode now.

**Current class:** V0 player-mode decision.

## D-020 — Informational succession follows canonical ownership/access

**Decision:** Information artifacts persist across succession according to their canonical owners, provenance, confidentiality, access, and transfer rules. A successor administration does not automatically inherit outgoing private polling, coalition intelligence, staff-only assessments, or other actor-specific knowledge merely because the player-control binding changed.

**Why:** Prevents control transfer from functioning like a mind-transfer or global knowledge copy.

**Current class:** Candidate hard invariant.

## D-021 — Competent implementation does not guarantee desired material success

**Decision:** GL0 architecture must support a route where law is valid, funding is adequate, participating institutions comply and administer competently, yet the material response is weak, mixed, offsetting, or otherwise different from forecast.

**Why:** Separates policy-mechanism uncertainty and material causality from political obstruction or administrative incompetence.

**Current class:** Candidate architecture requirement.

## D-022 — GL0 requires post-enactment governing agency

**Decision:** An ordinary viable GL0 route must contain at least one strategically meaningful post-enactment governing decision before the election. Proposal design + enactment + passive waiting + election is insufficient.

**Why:** Prevents a causally correct architecture from producing a passive strategy game once legislation passes.

**Current class:** Candidate player-experience requirement.

## D-023 — Every canonical fact has one semantic owner

**Decision:** Every mutable canonical fact has one semantic owner. Other representations of the same underlying fact must be explicit references, projections, in-world artifacts, indexes, caches, or historical records.

**Why:** Prevents hidden duplicate authority and makes causal mutation ownership auditable.

**Current class:** Candidate hard invariant.

## D-024 — State is classified by semantic role

**Decision:** Architecture distinguishes canonical current state, canonical historical records, in-world information artifacts, derived projections, session/control state, and rules/content configuration. These categories are semantic and need not map one-to-one to runtime base classes.

**Why:** Prevents reports, caches, UI models, player session state, or historical records from becoming accidental world truth.

**Current class:** Candidate architecture invariant.

## D-025 — Geography and population are independently owned

**Decision:** Geography owns spatial identity/boundaries/topology. Population owns population weight, demographics, and residence linkage. Electoral maps reference geography; electorates are derived from population + geography + eligibility rules. Districts do not own copied people.

**Why:** Allows redistricting and resolution changes without duplicating/moving population into political boundary objects.

**Current class:** Candidate hard invariant.

## D-026 — Material domains own material outcomes

**Decision:** Laws, appropriations, programs, and administrative actions may create legitimate inputs into material systems, but the corresponding material domain owns the material response. For GL0, Housing owns construction/stock/affordability outcomes.

**Why:** Prevents policy/program objects from becoming direct material-effect modifiers and preserves competent implementation with uncertain material results.

**Current class:** Candidate hard invariant.

## D-027 — Cross-domain references preserve identity rather than clone state

**Decision:** A subsystem referring to an entity/fact owned elsewhere stores a reference/relationship to canonical identity rather than a mutable shadow copy of the other subsystem's state.

**Why:** Prevents later divergence such as district population versus canonical population or program project state versus physical project state.

**Current class:** Candidate hard invariant.

## D-028 — Derived projections are read-only

**Decision:** UI metrics, summaries, electorates, forecasts, causal explanations, regime classifications, and other derived projections may be computed/cached but may not mutate canonical source state. Persisting a projection as something actors can later observe creates a provenance-bearing in-world artifact rather than a second owner.

**Why:** Preserves one-way derivation and prevents convenience write-back into summaries/caches.

**Current class:** Candidate hard invariant.

## D-029 — Information artifacts own information, not their referents

**Decision:** Polls, reports, claims, forecasts, memos, and releases can be canonical in-world artifacts owning their own content/provenance/access/history while remaining non-authoritative about the underlying material/legal/political state they describe.

**Why:** Allows information to be delayed, uncertain, wrong, revised, private, or politically contested without rewriting world truth.

**Current class:** Candidate hard invariant.

## D-030 — Historical records and current state are separate owners

**Decision:** Historical records own the fact that an event/decision/transition occurred. Current-state domains own what is true now. Election records, vote records, old polls, grant records, and other history cannot substitute for current authoritative state.

**Why:** Preserves path-dependent history and future career continuity without making history a mutable current-state store.

**Current class:** Candidate hard invariant.

## D-031 — Scheduling infrastructure is an index, not semantic authority

**Decision:** Domain-owned effective dates, deadlines, obligations, expirations, and scheduled conditions remain authoritative in their owning domains. A future scheduler/event queue may index when they need processing but does not become the owner of their meaning.

**Why:** Prevents central scheduling machinery from silently absorbing legal, fiscal, political, or material authority.

**Current class:** Candidate architecture invariant; exact scheduling implementation deferred.

## D-032 — Resolution deepens by refining owners

**Decision:** Higher simulation resolution should refine the internal representation of an existing canonical owner where the semantic fact is the same. A low-resolution summary must not later become a second owner competing with a newly detailed system.

**Why:** Allows thin GL0 states, population, geography, agencies, information, and material domains to deepen without foundational truth migration.

**Current class:** Candidate hard invariant.

## D-033 — Fiscal authority, execution, and outcome are distinct

**Decision:** Legal authorization/appropriation, actual public financial state, obligations, disbursements/expenditures, and material use/outcomes remain semantically distinct facts. Commit 3 will define the internal PoliticalOrder/public-finance primitives that own them.

**Why:** Prevents “law passed,” “money authorized,” “money spent,” and “program worked” from collapsing into one funded-policy state.

**Current class:** Candidate hard invariant.

## D-034 — Applicable legal position is scoped/derived, not one global effect field

**Decision:** Legal sources/orders own their own text, scope, authority/procedural state, and effective dates. The applicable legal position for an actor/action/place/time is derived from relevant sources and scoped state. There is no universal `currentLegalEffect` boolean/value that owns legal reality for every context.

**Why:** Preserves contested interpretation, scoped orders, future appeals, and institutional/legal disagreement without designing detailed judiciary procedure in Commit 2.

**Current class:** Candidate hard invariant.

## D-035 — Hypothetical evaluation cannot mutate live truth

**Decision:** Proposal scoring, forecasts, and other “what if” analysis consume an explicit state/snapshot plus hypothetical change and produce a projection/artifact. They may not mutate-and-undo live state or become a parallel authoritative proposed-policy world.

**Why:** Prevents forecast/actual divergence from becoming duplicate truth and keeps player analysis causally separate from world mutation.

**Current class:** Candidate hard invariant.

## D-036 — Policy is player-facing aggregation, not canonical ownership

**Decision:** “Policy” may be used as player-facing language to aggregate related intent/proposal/legal/fiscal/program/material/information objects. No canonical all-purpose `Policy` owner may directly mutate those domains, and no single mandatory policy pipeline is assumed for every governing action.

**Why:** Prevents the housing example from becoming a universal policy ontology and leaves room for executive actions, tax changes, automatic programs, appointments, judicial effects, and future domains.

**Current class:** Candidate hard invariant.

## D-037 — Historical occurrence history does not own mutable domain state

**Decision:** `HistoricalRecord` owns immutable committed occurrence facts that a consequential event or transition happened. The originating domain retains ownership of mutable current/procedural state such as current certification state, current grant/award status, office assignment, payment state, proposal status, and other live domain facts. A global history index may reference domain occurrence records for chronology/query but may not duplicate or become the mutable owner of those facts.

**Why:** Prevents `HistoricalRecord` from becoming an event-log god object and removes ambiguity between domain-owned records/state and immutable occurrence history.

**Current class:** Candidate hard invariant.

## D-038 — Legally operative program requirements remain legal-state truth

**Decision:** Binding program requirements established by constitutions, statutes, regulations, orders, or other legally operative sources remain owned by the constitutional/legal order. Program/administrative state owns lawful operational configuration, workflow, application processing, discretionary parameters within delegated authority, determinations, staffing, and execution state. A concrete eligibility determination may derive from applicable legal requirements + lawful administrative configuration + applicant/project/state facts, but the program may not maintain a separately authoritative mutable copy of the legal rule that binds it.

**Why:** Prevents statute/regulation requirements from being duplicated into program state and later diverging from the law the program is supposed to administer.

**Current class:** Candidate hard invariant.

## D-039 — Intergovernmental participation is relational, not a unilateral state flag

**Decision:** State application, acceptance of terms, refusal, withdrawal intent, and state-side commitments belong to the relevant state political/administrative owner. Federal eligibility determinations, acceptance, awards, or denials belong to the federal program/administrative owner. The active participation/agreement relationship is derived from or canonically represented by the applicable intergovernmental/program relationship under both sides' authoritative state and governing legal conditions; it is not owned solely by a state `participates=true` flag or a federal summary.

**Why:** Distinguishes a state's political choice from federal acceptance and from the bilateral relationship that actually authorizes/structures participation.

**Current class:** Candidate hard invariant.