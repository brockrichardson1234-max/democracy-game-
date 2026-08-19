# 00 — Game and Player Contract V0

Status: **Commit-1 repair candidate for review. Not implementation authority.**

## 1. Game identity

The game is a systemic political strategy simulation in which the player occupies a constitutionally bounded governing role and attempts to convert agenda control, political support, legal authority, fiscal resources, administrative capacity, and public persuasion into societal change.

The world is not a passive policy table. Political actions create attempted processes. Legal enactment changes legal state. Fiscal decisions create or constrain spending authority. Institutions interpret and execute authority. Material systems respond over time. Measurements and political claims imperfectly describe what happened. Population groups form beliefs, assign credit and blame, change salience, and participate electorally. Elections can remove the player without resetting the world.

The intended player feeling is:

> I fought to pass something imperfect, discovered that legal victory was only the beginning, watched institutions and other governments transform it, saw society respond unevenly, and then had to survive an election fought over an imperfect interpretation of what actually happened.

## 2. What the player is

The player controls the **strategic decision surface of an executive administration anchored to an individual officeholder occupying an executive office through the constitutional/political order**.

This is a control relationship, not a canonical political actor.

Conceptually:

```text
PlayerSession
  -> ControlBinding
      -> Administration
          -> headed by Officeholder
              -> OfficeAssignment
                  -> ExecutiveOffice
```

The office, officeholder, administration, country, parties, legislature, agencies, states, electorate, and material world all exist independently of the player session. Governing Loop 0 begins with an officeholder whose office assignment results from an election, but election is not a universal requirement for every possible executive officeholder or future playable role.

A `ControlBinding` grants access to the administration's authorized player decision surface. It does **not** convert constituent officeholders, appointees, agencies, civil servants, staff, or other personnel into player-owned actors. Routine staff work may be abstracted where it creates no meaningful independent decision, but another actor's compliance, resistance, judgment, or legally independent choice is never silently replaced by player ownership.

### Candidate hard invariant P-01

**Player control is a projection/control relationship over canonical actors and institutions. The player is not canonical political society or world state.**

This permits later spectator/history modes, another playable office, opposition play, or a different control binding without rewriting the world model. None of those later modes is authorized by V0.

## 3. What the player can do

The player may, when the controlled administration can meaningfully originate, issue, communicate, propose, request, direct, withhold, sign, veto, appoint, spend, negotiate, or otherwise attempt the relevant kind of institutional action toward a real target:

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

**A player command is an institutional intent or attempted action issued through a controlled office/administration. It is never a direct mutation of societal outcome state.**

Selecting a housing objective therefore cannot directly decrease rent, increase approval, create buildings, or assign legislative votes.

## 4. Command admission versus contested political action

The simulation must distinguish malformed or impossible input from an attempted political action whose authority or outcome is disputed.

Every player command passes through four conceptually distinct questions:

1. **Structural validity.** Is the command well-formed, are required values valid, and do referenced entities exist?
2. **Actor capability / attemptability.** Can the controlled office or administration meaningfully perform, issue, communicate, propose, direct, request, withhold, sign, veto, appoint, spend, negotiate, or otherwise attempt this kind of action toward this target?
3. **Authority / legal validity.** Does the actor actually possess the claimed authority under the applicable constitutional/legal order? The answer may be valid, invalid, uncertain, disputed, scoped, or later adjudicated.
4. **Compliance / consequence.** What do target actors and institutions actually do in response, and what political, administrative, operational, legal, informational, or material consequences follow?

Only commands that pass **structural validity** and **actor capability/attemptability** enter canonical political history as attempted actions. Legal validity and compliance are world questions, not command-admission questions.

### Invalid game command

Examples:

- negative monetary amount where the action requires a nonnegative amount;
- nonexistent target entity;
- impossible date/identifier shape;
- command whose required semantic target is absent; or
- a direct-world mutation that is not an act the controlled office/administration can meaningfully perform, such as `SET_VIRGINIA_RENT = $900`.

These fail without creating a political event.

### Valid attempted political action

Examples:

- executive directs an agency under a disputed interpretation of authority;
- administration attempts to redirect funds beyond an accepted interpretation of statute;
- President tells a governor that the state must enact a particular rule, even if the federal executive lacks authority to compel it;
- President publicly claims or orders that rents are capped under asserted federal authority, even if that assertion has no valid legal effect;
- official refuses a lawful instruction; or
- state attempts conduct claimed to conflict with superior law.

The attempt exists in canonical history. The world then resolves claimed authority, actor/institution response, legal contest where supported, operational behavior, material effects, and political consequences.

### Candidate hard invariant P-03

**Only structurally valid and actor-attemptable commands become canonical attempted political actions. Unlawful or contestable political intent is not equivalent to malformed player input, and legal invalidity alone does not erase a meaningful political attempt.**

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
- elections and office assignments are persistent state rather than reset triggers; and
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

The design goal is **bounded strategic legibility**, not blindness. Uncertainty must support judgment rather than arbitrary punishment.

### Candidate hard invariant P-05

**The player sees bounded institutional observations and projections of world state, never a privileged mutable copy of canonical truth.**

## 8. Election loss and persistence

For Governing Loop 0:

- the controlled administration can lose an election;
- loss ends that administration's active player control binding at the constitutionally effective transfer boundary;
- the world persists;
- the successor inherits the legal, fiscal, institutional, administrative, material, informational, and political state that actually exists at that transfer boundary; and
- the simulation advances far enough to show inherited consequences relevant to the completed loop.

Succession preserves existing state at the transfer boundary. Persisted state may subsequently change only through ordinary causal processes that have authority or capability to change it; succession itself is not a reset or a permanent freeze.

The exact duration and whether a future product allows immediate continuation as opposition, another office, a successor administration, or spectator/history are deferred.

### Candidate hard invariant P-06

**Elections change office/control assignments. They do not reset the world.**

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

## 11. Commit-1 review questions

Reviewers should attack:

1. Is the player role coherent and fun rather than secretly omnipotent or helpless?
2. Does the control-binding model preserve the world across elections without making administration personnel a player hive mind?
3. Does the four-stage command-admission rule preserve contested/unlawful attempts without turning impossible direct-world mutations into political events?
4. Is non-omniscience strategically legible?
5. Does this contract accidentally require a U.S.-specific engine rather than a U.S. first configuration?
6. Is any distinction here implementation detail rather than architecture?
