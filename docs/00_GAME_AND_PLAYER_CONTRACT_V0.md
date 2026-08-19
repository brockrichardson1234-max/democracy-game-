# 00 — Game and Player Contract V0

Status: **Final Commit-1 repair candidate for findings-only review. Not implementation authority.**

## 1. Game identity

The game is a systemic political strategy simulation in which the player occupies a constitutionally bounded governing role and attempts to convert agenda control, political support, legal authority, fiscal resources, administrative capacity, and public persuasion into societal change.

The world is not a passive policy table. Political actions create attempted processes. Legal enactment changes legal state. Fiscal decisions create or constrain spending authority. Institutions interpret and execute authority. Material systems respond over time. Measurements and political claims imperfectly describe what happened. Population groups form beliefs, assign credit and blame, change salience, and participate electorally. Elections can remove the player without resetting the world.

The intended player feeling is:

> I fought to pass something imperfect, discovered that legal victory was only the beginning, watched institutions and other governments transform it, saw society respond unevenly, and then had to survive an election fought over an imperfect interpretation of what actually happened.

## 2. What the player is

At engine level, player control is a transferable binding over a **supported player decision surface** associated with canonical actors, offices, administrations, or institutions. The binding determines which strategically player-facing in-world intentions the player may select. It does not create a new political actor and does not own simulation truth.

Conceptually:

```text
PlayerSession
  -> ControlBinding
      -> SupportedDecisionSurface
          -> canonical actor / office / administration / institution
```

A supported decision surface is a control permission, not a declaration of constitutional or legal authority. Inclusion of an action category on the surface means the player may meaningfully attempt that kind of in-world action through the bound role. It does **not** mean a particular attempted action is lawful, effective, obeyed, or successful.

### Governing Loop 0 binding

Governing Loop 0 supports one player mode:

```text
PlayerSession
  -> ControlBinding
      -> ExecutiveAdministrationStrategicSurface
          -> Administration
              -> headed by Officeholder
                  -> OfficeAssignment
                      -> ExecutiveOffice
```

The GL0 office assignment begins through an election. Election is not a universal requirement for every possible officeholder or future supported player binding.

The office, officeholder, administration, country, parties, legislature, agencies, states, electorate, and material world all exist independently of the player session.

A `ControlBinding` does **not** convert constituent officeholders, appointees, agencies, civil servants, staff, or other personnel into player-owned actors. Routine staff work may be abstracted where it creates no meaningful independent decision, but another actor's compliance, resistance, judgment, or legally independent choice is never silently replaced by player ownership.

Changing the source of a canonical decision from autonomous selection to player selection must not change that decision's downstream causal resolution. Player control changes **who selects an available intent**, not what that intent means after submission to the world.

### Candidate hard invariant P-01

**Player control is a non-canonical `ControlBinding` over a supported decision surface grounded in canonical actors/institutions. Executive-administration control is the first supported GL0 binding, not the universal definition of the player. Control source affects decision selection, not downstream causal semantics.**

This preserves later spectator/history modes, another playable office, opposition play, or different role-specific decision surfaces without requiring Commit 1 to design those game modes.

## 3. What the player can do in GL0

Through the GL0 executive-administration decision surface, the player may, when the controlled administration can meaningfully originate, issue, communicate, propose, request, direct, withhold, sign, veto, appoint, spend, negotiate, or otherwise attempt the relevant kind of institutional action toward a real target:

- set strategic priorities and agenda;
- originate or support political proposals;
- negotiate and make commitments on behalf of the administration within its authority;
- communicate public positions and claims;
- direct subordinate institutions within claimed executive authority;
- allocate or propose allocation of resources that are legally available to the administration;
- make appointments or personnel choices where the office has authority;
- accept, reject, amend, withdraw, delay, appeal, or contest an available political or administrative course; and
- deliberately attempt an aggressive, disputed, norm-breaking, or potentially unlawful political action when the office/administration can meaningfully perform the attempted act in-world.

The player does **not** directly control:

- legislators or their votes;
- courts or rulings;
- state governments;
- parties as hive minds;
- voters or turnout;
- agencies outside applicable authority;
- market prices, employment, rents, construction, or other material outcomes;
- public beliefs or approval; or
- whether another actor obeys an instruction.

### Candidate hard invariant P-02

**A player command is an institutional intent or attempted action submitted through the bound decision surface. It is never a direct mutation of societal outcome state.**

Selecting a housing objective therefore cannot directly decrease rent, increase approval, create buildings, or assign legislative votes.

## 4. Command admission versus contested political action

The simulation must distinguish malformed or impossible input from an attempted political action whose authority or outcome is disputed.

Every player command passes through four conceptually distinct questions:

1. **Structural validity.** Is the command well-formed, are required values valid, and do referenced entities exist?
2. **Actor capability / attemptability.** Can the bound role meaningfully perform, issue, communicate, propose, direct, request, withhold, sign, veto, appoint, spend, negotiate, or otherwise attempt this kind of action toward this target?
3. **Authority / legal validity.** Does the relevant actor/institution actually possess the claimed authority under the applicable constitutional/legal order? The answer may be valid, invalid, uncertain, disputed, scoped, or later adjudicated.
4. **Compliance / consequence.** What do target actors and institutions actually do in response, and what political, administrative, operational, legal, informational, or material consequences follow?

Only commands that pass **structural validity** and **actor capability/attemptability** enter canonical political history as attempted actions. Legal validity and compliance are world questions, not command-admission questions.

### Invalid player command

Examples:

- negative monetary amount where the action requires a nonnegative amount;
- nonexistent target entity;
- impossible date/identifier shape;
- command whose required semantic target is absent; or
- a direct-world mutation that is not an act the bound role can meaningfully perform, such as `SET_VIRGINIA_RENT = $900`.

These fail without creating a political event.

### Valid player-issued attempted political action

Examples:

- executive directs an agency under a disputed interpretation of authority;
- administration attempts to redirect funds beyond an accepted interpretation of statute;
- President tells a governor that the state must enact a particular rule, even if the federal executive lacks authority to compel it; or
- President publicly claims or orders that rents are capped under asserted federal authority, even if that assertion has no valid legal effect.

The attempt exists in canonical history. The world then resolves claimed authority, actor/institution response, legal contest where supported, operational behavior, material effects, and political consequences.

### Autonomous political actions

Canonical world actors also originate actions without passing through the player-command source. Examples include an official refusing an instruction or a state undertaking conduct claimed to conflict with superior law. Such actions require corresponding world-side capability/authority/consequence rules; they are not derived from or owned by the player command pipeline.

### Candidate hard invariant P-03

**Only structurally valid and actor-attemptable player commands become canonical player-issued attempts. Unlawful or contestable political intent is not equivalent to malformed input, and legal invalidity alone does not erase a meaningful political attempt. Autonomous actors may originate their own canonical political actions through the same world semantics without becoming player commands.**

## 5. Governing power is contextual, not a stack of meters

V0 recognizes distinct concepts such as:

- constitutional/legal authority;
- political support and bargaining leverage;
- fiscal authorization and available resources;
- administrative capacity;
- institutional compliance/resistance; and
- public legitimacy or political sustainability.

These are not seven universal scalar resources.

The useful question is relational and action-specific:

> Will this actor or institution carry out, block, reshape, delay, challenge, or refuse this particular action under these circumstances?

A later summary may classify a regime or an administration's effective control, but a derived classification must describe underlying state rather than cause it.

### Candidate hard invariant P-04

**Institutional compliance/control is relational and action-specific. Derived regime labels or control summaries never cause compliance.**

## 6. Democracy, erosion, and authoritarian behavior

The game is not restricted architecturally to norm-compliant democratic play.

A future player may be able to pursue democratic reform, institutional weakening, unlawful executive expansion, electoral manipulation, or other anti-democratic objectives if later gameplay increments support the required actors, procedures, institutions, and consequences.

V0 does **not** implement coups, military loyalty, election theft, repression, emergency rule, court purges, or dictatorship mechanics.

The architectural requirement is narrower:

- the legal/constitutional order can disagree with an actor's claim;
- institutions and actors can comply, partially comply, delay, resist, or refuse;
- legal contest can alter obligations without rewriting prior material history;
- election results, office entitlement, office assignment, and actual institutional behavior are distinguishable; and
- any later regime classification is derived from the resulting institutional/political world.

There is no causal `democracyScore` or `dictatorship = true` switch in the game identity.

## 7. Player knowledge

The player is nationally capable but not omniscient.

The administration may receive institutionally plausible information such as:

- official measurements and statistical releases;
- agency reports and implementation dashboards;
- staff forecasts and uncertainty ranges;
- polling and focus-group summaries;
- legislative/coalition assessments;
- public reporting and political claims;
- information received from allied officials or institutions; and
- later revisions to earlier estimates.

The player does not receive exact hidden voter beliefs, guaranteed future effects, exact private motivations, or debug-level state merely because the simulation stores them.

Non-omniscience does **not** require artificial uncertainty about facts the administration legitimately knows exactly. Authoritative records and directly controlled institutional acts available to the administration may be presented exactly, including the text of a bill it signed, the amount of an enacted appropriation, its own issued directive, a known office assignment, or a judicial order actually delivered to the administration.

The design goal is **bounded strategic legibility**, not blindness. Uncertainty belongs where the administration genuinely lacks direct knowledge, where measurement is imperfect, or where the future/other actors remain uncertain.

### Candidate hard invariant P-05

**The player receives information according to canonical ownership, provenance, access, and institutional availability. Legitimately known authoritative facts may be exact; hidden or imperfectly measured state is not exposed merely because the simulation stores it.**

## 8. Election, office transfer, control binding, and persistence

An election result, legal entitlement to office, actual office assignment, institutional recognition/compliance, and player control binding are related but not metaphysically identical events.

For Governing Loop 0, the required defeat route is an **ordinary uncontested transfer**:

- the controlled administration loses the relevant election under the scenario's accepted process;
- applicable constitutional/political procedures establish the successor's entitlement and office assignment at the effective transfer boundary;
- the outgoing administration actually ceases to hold the GL0 executive decision surface at that boundary;
- the outgoing player's control binding ends because its supported decision surface is no longer held by that administration; and
- the world persists.

Future contested certification, refusal to transfer, conflicting claims to office, judicial intervention, institutional splits, or altered constitutional rules are not implemented by GL0, but the hard invariant must not make them impossible by defining `electionLost -> bindingRemoved` as an automatic universal transition.

At an ordinary succession boundary, canonical state persists according to its owners. Legal, fiscal, institutional, administrative, material, and political state is not reset. Informational artifacts also persist according to their **actual owners, provenance, access rules, confidentiality, and transfer rules**. A successor administration does not automatically inherit the outgoing administration's private polling, confidential coalition intelligence, staff-only assessments, or other actor-specific knowledge merely because player control changed. It receives records and information the successor administration legitimately owns, inherits, is transferred, or can otherwise access.

Persisted state may subsequently change only through ordinary causal processes that have authority or capability to change it; succession itself is not a reset or a permanent freeze.

The exact duration of post-transfer simulation and whether a future product allows immediate continuation as opposition, another office, a successor administration, or spectator/history are deferred.

### Candidate hard invariant P-06

**Elections produce constitutionally/politically consequential selection results. Office entitlement, office assignment, institutional behavior, and player control change through the applicable world processes rather than by an automatic election-result reset. A `ControlBinding` ends when its supported decision surface is no longer available to that binding under resolved world state. None of these transitions resets the world.**

## 9. Player-facing presentation target

The presentation may inherit proven high-level grammar from accessible national political strategy games:

- national conditions and trends;
- problems/pressures;
- political support;
- government agenda;
- laws/programs;
- budgets/resources;
- causal explanations;
- electorate and elections;
- advancing time.

This is a **presentation contract, not simulation ontology**. The UI owns no underlying truth, and the simulation may require player-facing concepts to decompose into several canonical objects.

## 10. Explicit non-goals for V0

V0 is not trying to specify or implement:

- every U.S. constitutional doctrine;
- all 50 state governments at full resolution;
- complete courts or litigation procedure;
- local governments;
- primaries or full campaign finance;
- media-company markets or social networks;
- foreign affairs or war;
- a full macroeconomic model;
- individual ordinary citizens;
- detailed politician biographies; or
- the complete authoritarian/extreme-power game.

Those later capabilities must fit or deliberately extend the accepted architecture, but they are not excuses to expand Governing Loop 0.

## 11. Commit-1 findings-only recheck

The next review should answer only whether the following repaired claims are coherent enough for Commit 2 to derive state ownership:

1. Is generic `ControlBinding -> supported decision surface` clearly separated from GL0's executive-administration binding?
2. Is player-control permission clearly distinct from legal authority?
3. Is control source prevented from changing downstream causal resolution?
4. Are election result, office entitlement/assignment, institutional behavior, and control-binding termination sufficiently distinct?
5. Does informational persistence respect canonical ownership/access rather than transferring an outgoing administration's private knowledge?
6. Does P-05 permit exact presentation of legitimately known authoritative records while preserving non-omniscience elsewhere?
7. Are player-issued attempts separated from autonomous world-actor actions?

No broader Commit-1 redesign is requested by this recheck.
