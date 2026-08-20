# Decisions

Status: **Current Architecture V0 decision index through accepted Commit 6 plus the Commit-7 consolidated repair candidate.**

This file is a navigation/index surface, **not a competing normative authority**. The exact commit SHA supplied for review and the numbered architecture documents in their owning scope control when wording here is shorter or less specific. Historical decision IDs are retained so prior reviews/audits can continue to reference them.

## Authority note

- `00`–`12` contain the accepted derived Architecture V0 candidate through Commit 5.
- `13`–`15` are accepted Commit-6 audit evidence/findings, not replacement architecture.
- `16_COMMIT_7_CONSOLIDATED_ARCHITECTURE_REPAIR_V0.md` is the current narrow repair candidate and supersedes only the three Commit-6 HIGH findings if accepted.
- No runtime implementation is authorized until Commit 7 passes final findings-only review and the exact accepted SHA is marked `READY FOR WALKING SKELETON`.

## D-001 — Generic player control binding

**Decision:** `PlayerSession -> ControlBinding -> SupportedDecisionSurface` is session/control state grounded in canonical actors/offices/administrations/institutions. Changing decision source does not change downstream action semantics.

**Source:** `00`.

## D-002 — Player command semantics

**Decision:** Player commands are actor/institution intents or attempted actions; they never directly mutate material outcomes, votes, beliefs, or other actors' choices.

**Source:** `00`.

## D-003 — Contested political actions use a four-stage boundary

**Decision:** Structural validity, actor attemptability, legal/authority validity, and compliance/consequence are distinct. Actor-attemptable unlawful/disputed acts may enter canonical history.

**Source:** `00`, `04`, `06`.

## D-004 — Institutional control is relational

**Decision:** Compliance/control is actor/institution/action/context specific. No universal power/control/legitimacy scalar directly causes behavior.

**Source:** `00`, `04`, `05`, `06`.

## D-005 — Regime type is derived

**Decision:** Democracy/authoritarian-style classifications may summarize underlying institutional state later but cannot directly cause transitions.

**Source:** `00`.

## D-006 — Player knowledge follows ownership, provenance, and access

**Decision:** Legitimately accessible authoritative records may be exact; hidden voter truth, inaccessible private state, future outcomes, and imperfectly measured facts are not exposed merely because the simulation stores them.

**Source:** `00`, `08`.

## D-007 — Election result, office state, and control binding are distinct

**Decision:** Election result/certification, entitlement, office assignment, institutional behavior, and `ControlBinding` transition are separate causal facts.

**Source:** `00`, `03`, `07`, `09`.

## D-008 — GL0 uses an ordinary uncontested defeat/transfer proof

**Decision:** The required defeat route proves normal succession and persistent world state without defining contested-transfer gameplay or final post-defeat product mode.

**Source:** `00`, `01`, `11`.

## D-009 — First governing domain is conditional housing construction grants

**Decision:** GL0 uses geographically uneven housing affordability and a conditional federal housing-construction grant program as the first causal policy domain.

**Source:** `01`, `10`, `11`.

## D-010 — Housing proposal has a few consequential dimensions

**Decision:** Proposal design uses a bounded set of real tradeoff dimensions such as matching generosity, eligibility/participation conditions, distribution, administration, reporting/compliance, and project constraints.

**Source:** `01`, `11`.

## D-011 — Federalism appears inside GL0

**Decision:** State application/acceptance/refusal/capacity and federal response are part of the first governing loop rather than decorative later breadth.

**Source:** `01`, `03`, `04`, `11`.

## D-012 — Walking skeleton uses a synthetic miniature federation

**Decision:** The first executable proof uses a deliberately small synthetic federation rather than full U.S. content.

**Source:** `01`, `11`.

## D-013 — U.S. is first configuration, not the engine

**Decision:** Generic political/legal primitives cannot be defined solely as President/House/Senate/Governor special cases.

**Source:** `00`, `04`, `06`.

## D-014 — Democracy-like shell is presentation only

**Decision:** Dashboards, policy cards, indicators, elections, causal explanations, and time controls are presentation grammar and own no canonical simulation truth.

**Source:** `00`, `02`, `03`.

## D-015 — Architecture is derived from Governing Loop 0

**Decision:** New Architecture V0 concepts must serve the accepted GL0 proof or prevent a demonstrated foreseeable rewrite.

**Source:** `01`, `02`, `12`.

## D-016 — Architecture gates do not authorize runtime code

**Decision:** Commits 1–7 are architecture/review gates. First runtime code begins only in Commit 8 after final Commit-7 acceptance marks Architecture V0 `READY FOR WALKING SKELETON`.

**Source:** `12`, `16`.

## D-017 — Decision-surface control is not actor ownership or legal authority

**Decision:** A supported decision surface permits intent selection; it does not make subordinate actors player-owned or make selected actions legally valid.

**Source:** `00`, `04`, `05`.

## D-018 — Housing is not the whole electorate

**Decision:** Baseline partisan dispositions, candidate/incumbent evaluations, memory, background salience, and turnout tendencies coexist with dynamically simulated housing politics.

**Source:** `01`, `07`, `08`.

## D-019 — GL0 binds specifically to an executive administration

**Decision:** The first player mode binds to an executive-administration strategic surface; this is not the universal definition of the player.

**Source:** `00`, `05`.

## D-020 — Informational succession follows canonical ownership/access

**Decision:** Public/institutional/private information persists and transfers according to its owner/provenance/access rules; outgoing private knowledge is not copied wholesale to a successor.

**Source:** `00`, `03`, `08`, `11`.

## D-021 — Competent implementation does not guarantee desired material success

**Decision:** Valid law, adequate funding, compliance, and competent administration may still produce delayed, weak, mixed, offsetting, or otherwise disappointing material outcomes.

**Source:** `01`, `10`.

## D-022 — GL0 requires post-enactment governing agency

**Decision:** At least one strategically meaningful post-enactment decision must occur before the election. Commit 7 further requires a genuine modeled tradeoff rather than a costless dominant implementation option.

**Source:** `01`, `11`, `16`.

## D-023 — Every mutable canonical fact has one semantic owner

**Decision:** Other representations of the same fact must be explicit references, projections, artifacts, indexes, caches, or historical occurrence records.

**Source:** `02`, `03`.

## D-024 — State is classified by semantic role

**Decision:** Canonical current state, immutable occurrence history, in-world information artifacts, derived projections, session/control state, and rules/configuration remain distinct semantic roles.

**Source:** `02`, `03`.

## D-025 — Geography and ordinary population are independently owned

**Decision:** Geography owns spatial identity/topology; PopulationState owns canonical ordinary-population identity/weight/residence/core represented demographic/political state. Domain-specific material facts associated with that population remain with their material owners.

**Source:** `02`, `03`, `07`, `12`.

## D-026 — Material domains own material outcomes

**Decision:** Law/program/fiscal/administrative systems create legitimate inputs; the corresponding material domain owns material response.

**Source:** `02`, `03`, `10`.

## D-027 — Cross-domain references preserve identity rather than clone state

**Decision:** Cross-domain consumers reference canonical identity/facts instead of maintaining mutable shadow copies. Commit 7 additionally gives mutable subject associations one canonical owner.

**Source:** `02`, `03`, `16`.

## D-028 — Derived projections are read-only

**Decision:** UI summaries, electorates, forecasts, regime labels, explanations, and other projections cannot mutate canonical source state; persisted projections become provenance-bearing artifacts.

**Source:** `02`, `03`, `08`.

## D-029 — Information artifacts own information, not their referents

**Decision:** Reports, polls, claims, forecasts, memos, and releases own their own content/provenance/access/history, not underlying material/legal/political truth or recipient belief.

**Source:** `02`, `03`, `08`.

## D-030 — Historical records and current state are separate owners

**Decision:** Immutable occurrence records own that something happened; current-state owners own what is true now.

**Source:** `02`, `03`, `06`, `09`, `10`.

## D-031 — Scheduling infrastructure is an index, not semantic authority

**Decision:** Domain owners retain deadlines/effective dates/expirations/conditions; scheduler/event-queue data is rebuildable indexing machinery.

**Source:** `02`, `03`, `09`.

## D-032 — Resolution deepens by refining owners

**Decision:** Higher resolution refines existing semantic owners and preserves one-owner/joint-state semantics rather than creating a second authoritative representation.

**Source:** `02`, `03`, `07`, `16`.

## D-033 — Fiscal authority, execution, and outcome are distinct

**Decision:** Authorization/appropriation, public financial state, obligation, disbursement, administrative state, and material use/outcome are separate facts with separate owners.

**Source:** `03`, `04`, `10`.

## D-034 — Applicable legal position is scoped/derived

**Decision:** Legal sources/orders own their text/scope/effective state; applicable legal position is derived for actor/action/place/time/context, not held in one global `currentLegalEffect` field.

**Source:** `03`, `04`, `06`, `09`.

## D-035 — Hypothetical evaluation cannot mutate live truth

**Decision:** Forecasts/proposal scoring operate on isolated inputs/snapshots and produce projections/artifacts, never mutate-and-undo live canonical state.

**Source:** `02`, `03`, `08`.

## D-036 — Policy is player-facing aggregation, not canonical ownership

**Decision:** A player-facing policy can navigate related intent/proposal/legal/fiscal/program/material/information objects but cannot become an all-purpose mutation owner or mandatory universal pipeline.

**Source:** `02`, `03`, `12`.

## D-037 — Historical occurrence history does not own mutable domain state

**Decision:** `HistoricalRecord` owns immutable committed occurrence facts; originating domains retain mutable current/procedural state. A global chronology/index may reference occurrences but does not become a mutable event-log god object.

**Source:** `03`, `10`.

## D-038 — Legally operative program requirements remain legal-state truth

**Decision:** Binding program requirements remain LegalOrder truth. Administration owns lawful operational configuration, workflow, determinations, staffing/capacity, and execution—not a shadow copy of law.

**Source:** `03`, `04`.

## D-039 — Intergovernmental participation is relational

**Decision:** State intent, federal determinations, and active participation/agreement are separately owned facts; neither side's unilateral flag owns the full relationship.

**Source:** `03`, `04`, `11`.

## D-040 — Government structure and authority remain fact-split

**Decision:** Jurisdiction, institution, office, office assignment, legal sources, procedure instances, fiscal state, administration, intergovernmental relationships, actors, elections, and judicial contests remain separate semantic owners.

**Source:** `04`.

## D-041 — Normative procedure requirements are legal-order truth

**Decision:** LegalOrder owns normative procedure rules; institutions host/reference procedures and own operational capability; active instances own current proceeding facts; legally available transitions are derived.

**Source:** `04`.

## D-042 — Actor-private state and political relationship state are separately owned

**Decision:** Actors own their own beliefs/evaluations/intentions/choices; canonical affiliations and negotiated commitments/coalitions are owned once by organization/relationship state and may be referenced by actors.

**Source:** `05`.

## D-043 — Operative judicial orders have one legal-order owner

**Decision:** LegalContest owns case/procedure state and references orders. Each operative order has one canonical legal-order owner for text/subjects/scope/effective/status/stay/reversal/supersession/expiration; compliance is separately resolved.

**Source:** `06`, `11`.

## D-044 — Ordinary population is aggregate and correlation-preserving

**Decision:** Ordinary population remains aggregate rather than individual-per-citizen, while preserving the joint structure needed by supported causal/electoral questions. Eligibility consumes canonical facts from their actual owners rather than determining ownership.

**Source:** `07`, `12`.

## D-045 — Lagged measurement has canonical process state

**Decision:** In-progress measurements own captured observations/sample/progress/method/as-of context and committed result; later referent changes cannot silently replace already captured observations.

**Source:** `08`, `09`.

## D-046 — Belief, attribution, salience, preference, turnout, and ballots are distinct

**Decision:** Information/exposure can influence recipient-owned political state, but no report/material outcome directly owns belief/credit/salience/preference/turnout, and no propensity/projection is an actual ballot/result.

**Source:** `07`, `08`.

## D-047 — Time advancement and canonical randomness are deterministic in causal semantics

**Decision:** Same canonical inputs/decisions produce equivalent canonical outcomes independent of UI chunking, wall-clock cadence, incidental same-time iteration order, scheduler reconstruction, save/load boundaries, or global RNG consumption position.

**Source:** `09`, `11`.

## D-048 — Legal temporal scope does not rewrite non-legal occurrence history

**Decision:** Legal effects may be prospective, retrospective, or otherwise bounded according to applicable authority, but retrospective legal effect does not delete prior material/fiscal/administrative/political occurrences; remedies proceed causally through their owners.

**Source:** `09`.

## D-049 — Housing owns current material housing state

**Decision:** Housing owns current stock, pipeline/progress, material capacity/bottlenecks, and affordability/pressure. Administrative approval/funding does not equal physical completion; immutable housing occurrences remain historical-record truth.

**Source:** `10`.

## D-050 — The walking skeleton is a bounded vertical causal proof

**Decision:** The first executable target must traverse politics -> law -> fiscal state -> administration -> federalism -> Housing -> post-enactment agency -> measurement/information -> electorate/election -> succession, plus deterministic hostile routes and an actually issued judicial order with independently resolved target response.

**Source:** `11`.

## D-051 — Cross-domain subject association has one owner

**Decision:** When a domain-specific fact intrinsically describes a population subject, that fact's domain owns the canonical subject association. Reverse lookups are non-authoritative. If the association is itself an independent relationship fact, that relationship has one dedicated owner.

**Why:** Prevents population/material mappings from diverging during aggregate refinement or cross-domain joins.

**Current class:** Commit-7 candidate hard invariant.

**Source:** `16`.

## D-052 — Required post-enactment decision contains a real tradeoff

**Decision:** At least one required post-enactment GL0 choice must involve genuine modeled scarcity, opportunity cost, risk, distributional conflict, timing conflict, or uncertainty using already accepted state; a costless dominant “spend more” option is insufficient.

**Why:** Ensures the skeleton proves governing agency rather than merely a causal maintenance button without expanding into recurring micromanagement.

**Current class:** Commit-7 candidate player-experience invariant.

**Source:** `16`.

## D-053 — Second-domain probe tests ontology without becoming a second game

**Decision:** The unemployment-insurance-like probe exists only to expose hidden housing-specific ownership assumptions and does not authorize a playable labor/social-policy system or macroeconomy.

**Source:** `12`.

## D-054 — Architecture gate sequence is explicit

**Decision:** Commit 6 = bounded whole-architecture audits; Commit 7 = one consolidated repair/final findings-only acceptance gate; only an accepted Commit-7 SHA marked `READY FOR WALKING SKELETON` authorizes Commit 8 first runtime code.

**Source:** `12`, `16`.

## D-055 — Exact SHA and owning documents control authority

**Decision:** Exact SHA supplied for review is candidate authority; branch refs are convenience pointers. Numbered architecture documents own normative semantics; audits are evidence; `DECISIONS.md` and `OPEN_QUESTIONS.md` are navigation/index surfaces.

**Current class:** Commit-7 candidate process invariant.

**Source:** `16`, repository README.
