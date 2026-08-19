# 05 — Political Actors and Coalitions V0

Status: **Commit-3 architecture candidate for review. Not implementation authority.**

## 1. Purpose

`04_GOVERNMENT_AUTHORITY_AND_PROCEDURE_V0.md` defines the governmental structures and procedures through which political power is exercised. This document defines the people and organizations that make political decisions inside those structures.

The core distinction is:

> **Institutions define roles/procedures. Actors occupy roles and make choices. Organizations coordinate actors. Coalitions relate actors around a particular objective. None of those things are interchangeable.**

This document answers:

- when political identity must be individualized;
- what state belongs to an individual political actor;
- what parties/caucuses/organizations own;
- how bargaining and commitments can exist without one universal support bar;
- how votes remain actor decisions rather than institutional modifiers;
- how player and autonomous decision sources remain causally equivalent.

It does **not** define a full politician psychology model, fundraising, primaries, lobbying breadth, campaign strategy, detailed relationships, or career mode.

## 2. Normative dependencies

This document must preserve:

- `ControlBinding` affects decision selection, not downstream causal semantics;
- ordinary citizens remain aggregate/correlation-preserving, while actors whose identity affects discrete outcomes may be individual;
- population political state, actor political state, organization state, institutional state, and election state are distinct owners;
- a party/group projection cannot own a politician's decision;
- historical action records do not own current actor state;
- information availability/provenance constrains what an actor can know;
- support summaries/forecasts are projections or artifacts, not decision authority;
- procedures own current procedural state, while actors own their choices.

## 3. Individual political actor

A `PoliticalActor` is an individual whose identity can causally affect discrete political outcomes.

For GL0, this includes at least individual officeholders/legislators necessary to make legislative and executive decisions.

Future examples may include:

- candidates;
- governors;
- judges;
- agency leaders;
- party leaders;
- organization leaders.

Not every bureaucrat or citizen becomes an individual actor merely because such people exist in reality.

### 3.1 Individualization rule

Use an individual actor when at least one of the following is true:

- that person's single choice can alter a discrete procedure outcome;
- the person occupies an office whose acts have independent legal/institutional effect;
- durable identity/history meaningfully changes future political interaction;
- the player may eventually bind to that person's decision surface;
- an individual commitment/relationship must persist and matter.

Use aggregate/institutional resolution when individual identity would not change the supported causal claim.

### Candidate hard invariant A-01

**Ordinary population remains aggregate/correlation-preserving; political/institutional actors are individualized when their identity or single decisions can change discrete political outcomes. Individualization follows causal need, not a desire to simulate every person.**

## 4. Actor identity versus office

An actor may:

- hold no office;
- hold one office;
- later hold a different office;
- leave office while remaining politically relevant;
- lose an election while remaining the same canonical person.

Office assignments reference actors.

Actor identity does not reset when office assignment changes.

This enables future career/history continuity without a separate career-state universe.

Conceptually:

```text
PoliticalActor A
  history: persistent identity

OfficeAssignment T1
  Office X -> Actor A

OfficeAssignment T2
  Office Y -> Actor A
```

The actor's past votes and public actions remain immutable historical occurrences.

Their current office authority derives from current assignment + legal order, not from their biography.

### Candidate hard invariant A-02

**Political actor identity persists independently of office assignments. Offices confer role-specific authority through current assignment; actors do not carry former office authority after leaving that office.**

## 5. ActorPoliticalState

An individual actor may own current political state required to make decisions.

Potential semantic categories include:

- issue/policy evaluations;
- goals/priorities;
- party/organizational affiliations;
- public positions;
- private intentions where represented;
- current commitments;
- strategic relationships;
- perceived constituency incentives;
- electoral vulnerability/ambition where supported;
- trust/relationship state;
- knowledge/beliefs available to the actor;
- procedural strategy.

Commit 3 does **not** freeze a universal politician personality vector.

No field is required merely because it sounds realistic.

The walking skeleton may use a deliberately simple actor decision model so long as actors remain independent canonical decision-makers.

### Candidate hard invariant A-03

**Actor political state belongs to the actor/actor-specific relationship owners. It is not a copied subset of population opinion, party state, or a universal legislative-support meter.**

## 6. Actor knowledge is bounded

Political actors do not read canonical world truth automatically.

Their decision logic may consume:

- authoritative records available through office/institution;
- public information artifacts;
- private briefings/memos;
- party/caucus information;
- polling/constituency estimates;
- direct commitments/communications;
- known procedural facts.

They do not receive:

- exact hidden voter state merely because the engine stores it;
- exact private motives of other actors;
- guaranteed future outcomes;
- debug-only material state.

A legislator may therefore vote based on an imperfect constituency forecast rather than an omniscient electorate query.

### Candidate hard invariant A-04

**Actor decisions consume actor-accessible information and authoritative records, not privileged canonical truth unless the actor's role genuinely has access to that truth.**

## 7. Decision opportunity and decision source

When a procedure or world condition requires an actor choice, the architecture distinguishes:

```text
DecisionOpportunity
        ↓
DecisionSource selects supported intent
        ↓
Canonical actor action
        ↓
Normal world/procedure resolver
```

Possible decision sources include:

- autonomous actor logic;
- player `ControlBinding` where a supported role exists;
- deterministic fixture/test source;
- automatic institutional rule where no actor choice exists.

The resulting canonical action must have the same downstream meaning regardless of decision source.

Example:

```text
AI-controlled Senator A
    -> Vote(YEA)

Player-controlled Senator A (future mode)
    -> Vote(YEA)
```

After `Vote(YEA)` enters the world, the legislature resolves it identically.

### Candidate hard invariant A-05

**Decision source chooses among supported actor intents. It cannot change the causal semantics, authority, procedural weight, or downstream resolution of the canonical action.**

## 8. Party

A `Party` is a persistent political organization, not a hive mind.

Party/organization state may own:

- identity;
- membership/affiliation relationships;
- official positions/platform where represented;
- party resources;
- leadership offices;
- strategic priorities;
- whip/coordination activity;
- organization-specific information.

A party may influence members.

It does not own:

- individual actor votes;
- individual actor beliefs;
- electorate beliefs;
- office authority;
- election results.

### 8.1 Party affiliation

Party membership/affiliation is a relationship between actor and organization.

An actor can deviate from the party.

The party may react to defection through future systems, but party membership does not automatically override actor decision authority.

### Candidate hard invariant A-06

**Parties and caucuses own organizational state and coordination efforts; individual actors retain ownership of their decisions. Party membership may influence but never directly substitute for a member's canonical action.**

## 9. Caucus and political organization

A caucus is an organization or structured grouping of political actors.

Other future organizations may include:

- advocacy organizations;
- unions;
- business associations;
- activist groups;
- media organizations where relevant;
- donor networks later.

Commit 3 does not implement these systems broadly.

The architecture only requires that an organization can own its own:

- membership;
- resources;
- positions;
- strategy;
- leadership;
- actions/communications.

An organization's state is not merged into Party or Actor state simply because the same people participate in multiple organizations.

## 10. Coalition

A coalition is a scoped political alignment around a particular purpose, proposal, procedure, government formation, or strategic objective.

It is not one global number called `coalitionStrength`.

There are two legitimate forms:

### 10.1 Derived coalition/projection

A staff estimate that actors are likely to vote together.

Example:

```text
ExpectedHousingVotes = 47
```

This is a projection or information artifact.

It does not own actual support.

### 10.2 Canonical coalition/commitment relationship

A real negotiated alignment may exist in-world.

It can own facts such as:

- participants;
- objective/scope;
- explicit negotiated commitments;
- conditions;
- time/status;
- known breaches/withdrawals.

It still does not force future actor decisions.

A member can defect.

### Candidate hard invariant A-07

**Coalitions are scoped relationships or derived estimates, not universal political-power meters. A coalition/commitment may influence an actor but cannot own or pre-resolve the actor's future vote/action.**

## 11. Commitment and bargaining

Political bargaining must be able to create persistent causal state without becoming a scripted dialogue system.

A `PoliticalCommitment` or equivalent relationship can represent an explicit promise/condition such as:

- support proposal if provision X changes;
- withhold support unless state condition Y is removed;
- support amendment A in exchange for amendment B;
- publicly endorse a proposal under stated conditions.

Exact interaction UI is deferred.

A commitment may own:

- parties;
- proposal/objective reference;
- terms/conditions;
- time;
- status;
- public/private access;
- fulfilled/breached state.

The actor still decides whether to honor it.

Breach may produce later relationship/information/electoral consequences.

### Candidate hard invariant A-08

**Negotiated commitments are canonical political relationship state when they genuinely exist, but they do not deterministically force actor behavior. Actor choice remains separate from the promise to choose.**

## 12. Proposal support is not one authoritative scalar

The architecture rejects:

```text
Senator.support = 63
if support > 50:
    vote YES
```

as the universal decision model.

A UI/AI forecast may expose a derived probability/category such as:

- likely yes;
- lean yes;
- undecided;
- lean no;
- likely no.

But the underlying actor decision may depend on supported factors such as:

- substantive evaluation;
- proposal provisions;
- constituency incentives as the actor perceives them;
- party pressure;
- leadership pressure;
- electoral risk;
- commitments;
- relationships/trust;
- procedural leverage;
- other agenda trades;
- public salience;
- timing/information.

V0 does not have to implement every factor.

The architecture merely prevents one scalar support meter from becoming the canonical cause.

### Candidate hard invariant A-09

**Expected support may be projected, but actual political decisions arise from actor-specific state and context at the decision boundary. No universal support scalar owns legislative behavior.**

## 13. Legislative seat and vote

For a legislature, each causally discrete seat is an `Office`.

An actor occupying that office can receive a `VoteDecisionOpportunity` when the procedure requires it.

Conceptually:

```text
LegislativeSeat Office
    ↓ OfficeAssignment
PoliticalActor
    ↓ procedure asks for decision
Vote(YEA / NAY / ABSTAIN / other supported choice)
    ↓
LegislativeProcedureState records current decision
```

The active procedure owns:

- whether a vote is open;
- which offices may vote;
- the currently recorded decision for that procedure;
- tally/procedural result.

The actor owns the choice it submitted.

An immutable historical occurrence records the vote after commitment.

The historical record does not own current actor preference.

### Candidate hard invariant A-10

**Legislative votes are actor actions admitted into procedure-owned vote state. Blocs, parties, forecasts, or player UI may not directly set the procedural tally without the corresponding actor actions.**

## 14. Blocs in the walking skeleton

The walking skeleton may use a small legislature and shared behavioral templates.

It may describe actors as belonging to three blocs for readability/test setup.

But "bloc" must not become a single actor that casts six votes unless the constitutional procedure truly gives that entity six votes.

Preferred fixture shape:

```text
Legislators:
  A1 A2 A3    # bloc A affiliation/template
  B1 B2 B3    # bloc B
  C1 C2 C3    # bloc C
```

Each seat/actor produces its own canonical vote.

Shared deterministic rules can keep implementation tiny.

### Candidate hard invariant A-11

**Behavioral templates and bloc affiliation may compress actor logic; they may not erase individual decision identity where individual votes determine discrete procedure outcomes.**

## 15. Amendment bargaining

An actor or administration may propose/request an amendment.

The request itself does not mutate proposal text.

The legislative/procedural owner decides whether an amendment is formally introduced/accepted under procedure.

Conceptually:

```text
Actor bargaining action
    ↓
commitment/request/offer state
    ↓
formal AmendmentProposal enters procedure
    ↓
procedure resolves amendment
    ↓
pending Proposal provisions change if adopted
```

This protects proposal ownership from being modified by conversation/UI convenience.

## 16. Public positions and claims

An actor's public statement is an information artifact with provenance.

Example:

```text
Senator A says "I will oppose this bill."
```

That statement may also update an actor-owned public-position/commitment state where the game tracks it.

But the statement does not directly become:

```text
Vote = NAY
```

The actor can reverse course.

The public record remains part of history/information and may carry political cost.

## 17. Constituency relationship

A legislator represents an electorate/constituency defined by electoral geography and population eligibility.

The actor does **not** own the constituency population.

The actor may receive derived/in-world information such as:

- district poll;
- staff estimate;
- public contacts;
- election history;
- local economic/housing report.

These may influence decisions.

They remain projections/artifacts about population state.

### Candidate hard invariant A-12

**Political representation creates a relationship between office and constituency; it does not move or copy population into the actor/office state. Constituency opinion available to an actor is measured/projected information, not omniscient electorate truth.**

## 18. Executive administration and actor autonomy

GL0 gives the player a strategic surface over an administration.

That does not mean every executive actor is a puppet.

The administration may submit high-level canonical intents such as:

- legislative proposal;
- public position;
- executive directive;
- appointment/nomination;
- program-priority decision.

Other actors/institutions then decide/respond through their own authority and state.

Examples:

- an agency head may comply, delay, resist, or request clarification;
- a legislator may refuse an administration request;
- a state executive may reject program terms;
- a judge may rule against the administration.

Routine staff work can be automated where no meaningful independent actor choice exists.

### Candidate hard invariant A-13

**A strategic administration decision surface may aggregate player-facing choices without converting every actor touched by the administration into the same decision-maker.**

## 19. Political leverage without political capital

The architecture does not create a universal spendable `PoliticalCapital` currency as the cause of action availability.

Political leverage may emerge from:

- office authority;
- agenda/procedural control;
- party leadership;
- coalition commitments;
- relationships;
- public popularity/salience;
- timing;
- bargaining alternatives;
- resource/control over appointments or priorities where legally available;
- credible promises/threats.

The UI may later summarize political leverage.

That summary is derived.

It does not become mana required to perform actions that are otherwise actor-attemptable.

### Candidate hard invariant A-14

**Political leverage is contextual and relational. A derived summary may aid the player, but no universal political-capital balance may substitute for actor decisions, procedure, authority, commitments, or institutional constraints.**

## 20. GL0 bargaining proof

A minimal ordinary legislative route should support:

```text
Administration proposes housing provisions
        ↓
Legislator A supports
Legislator B opposes
Legislator C conditions support on changed matching rate
        ↓
Administration offers/accepts compromise
        ↓
formal amendment changes proposal through procedure
        ↓
C now evaluates amended proposal
        ↓
individual votes occur
        ↓
procedure resolves
```

This proves:

- actors are independent;
- proposal state is procedure-owned;
- bargaining creates real state;
- commitments do not pre-resolve votes;
- the administration cannot directly set the tally.

## 21. GL0 minimum actor fixture

Commit 3 does not freeze the final walking-skeleton count.

A safe target is:

- one executive officeholder/admin surface;
- a small legislature with individual seats/actors;
- three political organizations/bloc affiliations for behavioral variety;
- at least one swing/conditional actor whose decision can change when provisions change;
- state-side actors or coarse state decision authorities sufficient to originate state application/refusal;
- one agency leadership/institutional response seam;
- judicial actors defined in `06`.

The exact count remains an implementation assumption.

## 22. Future career-mode seam

Commit 3 does not implement career mode.

The architecture merely preserves the cheap future path:

```text
Autonomous LegislatorSurface
    -> actor AI selects Vote(YEA)

Future Player ControlBinding
    -> same LegislatorSurface
    -> player selects Vote(YEA)

same canonical vote
same procedure
same world
```

Career gameplay such as campaigns, fundraising, primaries, personal reputation, and advancement remains deferred.

### Candidate hard invariant A-15

**Future direct control of an individual politician should require a new role-specific decision surface and product gameplay, not a different simulation resolver for that politician's canonical acts.**

## 23. Explicit anti-patterns

Rejected:

```text
Congress.support = 61
if support > 50:
    passBill()
```

Rejected:

```text
Party.membersVote = Party.position
```

Rejected:

```text
BlocA.voteCount = 6
```

when six individual constitutional seats actually decide.

Rejected:

```text
commitment.supportGuaranteed = true
```

as a replacement for future actor choice.

Rejected:

```text
playerNegotiation.changedBillTextDirectly()
```

without formal amendment/procedure.

Rejected:

```text
actor.constituencyOpinion = exactPopulationTruth
```

when the actor only has measurements/estimates.

Rejected:

```text
if actor.isPlayer:
    specialVoteResolution()
```

## 24. Commit-3 review questions for this document

1. Are actor, office, institution, party, caucus, coalition, and constituency distinct?
2. Does individualization follow discrete causal need without forcing ordinary citizens into individual simulation?
3. Can parties/blocs influence legislators without owning votes?
4. Can bargaining create persistent commitments without turning commitments into guaranteed actions?
5. Does the procedure own current vote state while actors own choices and history owns immutable occurrences?
6. Can shared actor templates keep the skeleton tiny without turning blocs into vote-count shortcuts?
7. Are staff support estimates/projections kept separate from actual actor state?
8. Is constituency information actor-bounded rather than omniscient?
9. Does player control remain a decision-source substitution rather than a special causal path?
10. Did this document accidentally design career mode, lobbying, or politician psychology beyond what GL0 requires?
