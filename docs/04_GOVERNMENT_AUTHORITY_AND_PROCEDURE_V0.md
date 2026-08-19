# 04 — Government Authority and Procedure V0

Status: **Commit-3 architecture candidate for review. Not implementation authority.**

## 1. Purpose

Commits 1–2 established the player boundary, Governing Loop 0, canonical ownership, and projection rules. This document now resolves the internal governmental side of `PoliticalOrder` far enough for the GL0 housing route to exist without hard-coding the United States into the engine.

This document answers:

> What governmental things exist, how is authority represented, how do procedures transform attempts into legal/institutional state, and how do federal/state relationships remain causal rather than decorative?

It does **not** attempt to encode every U.S. constitutional doctrine, fifty state constitutions, detailed court procedure, campaign systems, or a universal government-description language.

The governing constraint remains:

> Build the minimum reusable political-state primitives required by GL0 and by foreseeable deepening. Do not generalize beyond demonstrated structural variance.

## 2. Normative dependencies

This document must obey the accepted Commit-1/2 invariants, especially:

- player control is a non-canonical `ControlBinding`;
- control permission is not legal authority;
- actor attemptability is distinct from legal validity and compliance;
- every mutable canonical fact has one semantic owner;
- history owns immutable occurrences, not current procedural state;
- legally operative rules remain legal-order truth;
- fiscal authority, financial execution, and material outcome are distinct;
- state intent and federal program decisions are separately owned;
- active intergovernmental participation is relational;
- applicable legal position is contextual rather than one global `currentLegalEffect`;
- law/program state cannot directly mutate material outcomes.

Where earlier Commit-2 shorthand conflicts with the normative Section 19 repair in `03_STATE_OWNERSHIP_AND_PROJECTIONS_V0.md`, Section 19 controls.

## 3. PoliticalOrder internal ownership map

Commit 3 divides the broad `PoliticalOrder` root into semantic ownership areas.

These are **not required to become one runtime class each**.

```text
PoliticalOrder
├── JurisdictionState
├── InstitutionalState
├── OfficeAndAssignmentState
├── LegalOrderState
├── ProcedureState
├── FiscalAuthorityAndExecutionState
├── AdministrativeState
├── IntergovernmentalState
├── ElectoralState              # detailed in later commit
├── PoliticalActorState         # detailed in 05
└── JudicialContestState        # detailed in 06
```

The purpose of this split is not folder purity. It is to prevent one `GovernmentState` object from becoming the place where every system can mutate every political fact.

### Candidate hard invariant G-01

**Jurisdiction, institution, office assignment, legal order, procedure, fiscal execution, administration, intergovernmental relationship, political actor, election, and judicial-contest facts remain separately owned even when one gameplay action crosses several of them.**

## 4. Jurisdiction

A `Jurisdiction` is a political/legal authority domain.

It may represent:

- a federation;
- a constituent state/province;
- a unitary national government;
- a municipality later;
- another legally constituted governing domain.

A jurisdiction may reference geography, population, institutions, offices, legal sources, procedures, finances, programs, and intergovernmental relationships.

It does not own those referenced domains merely because it groups them.

### 4.1 Geography is not jurisdiction

Geographic containment and political/legal subordination are not the same relationship.

Examples:

- Virginia is geographically inside United States territory and is a constituent jurisdiction in a federation.
- A congressional district is geographically inside a state but is primarily an electoral constituency, not a general governing jurisdiction.
- A city may be geographically nested inside a state while its legal relationship to that state is defined by the constitutional/legal order.
- Federal and state jurisdictions may exercise overlapping authority over the same people and places.

Therefore:

```text
Geography.contains(A, B)
```

must never silently imply:

```text
PoliticalOrder.subordinateTo(B, A)
```

### Candidate hard invariant G-02

**Jurisdictional authority and geographic containment are independent relationships. A jurisdiction may reference territory without owning geography or deriving constitutional subordination from containment alone.**

## 5. Constitutional/legal order is persistent source history, not one mutable rule bag

The architecture does not define:

```text
Constitution.rules = currentRules
```

as the sole constitutional truth.

Instead, the legal order contains persistent legally relevant sources and procedural state, such as:

```text
LegalOrderState
├── ConstitutionalInstrument(s)
├── Amendment(s)
├── Statute(s)
├── Appropriation(s)
├── Regulation(s)
├── Executive/legal Order(s)
├── Judicial Order(s)
├── Legal Interpretation(s)
└── source relationships / supersession / effective dates / scope
```

The exact code hierarchy is deferred.

The important semantics are:

- sources retain identity and provenance;
- effective dates and scope belong to the source/legal state;
- amendments or later instruments do not erase the existence of prior sources;
- a new source may modify, supersede, constrain, repeal, or interpret another source according to applicable procedure;
- attempted unlawful change does not automatically become valid constitutional state.

### 5.1 Constitutional change

A constitutional amendment is therefore represented as a legally meaningful proposal/procedure that may create a new constitutional source when the required process succeeds.

Conceptually:

```text
amendment proposal
→ constitutional amendment procedure
→ ratification/approval state
→ amendment becomes legally effective
→ applicable legal position changes
```

The original constitutional history remains queryable.

### Candidate hard invariant G-03

**Constitutional/legal change creates, modifies, supersedes, constrains, or repeals persistent legal sources through applicable procedures. It does not overwrite one ahistorical `Constitution.rules` object.**

## 6. Institution

An `Institution` is a persistent governmental/organizational structure that contains roles, procedures, capabilities, and state.

Examples in the first target configuration may include:

- a legislature;
- a legislative chamber;
- an executive administration;
- an administrative agency;
- a court;
- a treasury/public-finance institution;
- an election administration institution later.

An institution is **not** the people who currently occupy its offices.

An institution can persist while every officeholder changes.

It may own:

- structural identity;
- institutional capacity;
- internal operational state;
- legally defined procedures assigned to it;
- references to offices;
- administrative resources/capability where appropriate.

It does not own:

- the private state of individual actors;
- the law merely because it administers it;
- the material outcomes of its programs;
- population/electorate truth.

### Candidate hard invariant G-04

**Institutions define persistent structures, procedures, and capabilities. Actors occupy or interact with institutional roles; they are not interchangeable with the institution itself.**

## 7. Office and OfficeAssignment

An `Office` is a legally/politically constituted role.

Examples:

- President-like executive office;
- legislator seat;
- committee chair;
- governor-like state executive office;
- judge;
- agency head.

The generic engine should not treat `President` or `Governor` as universal top-level concepts.

Conceptually:

```text
Office
  identity
  institution/jurisdiction relationship
  selection/assignment procedure reference
  term/tenure rules where applicable
  authority basis references
  procedural roles
```

The exact data shape is deferred.

An `OfficeAssignment` is the current relationship between an office and an actor.

```text
Office
    ↓ current assignment
Actor
```

The office exists without its current holder.

The actor exists without the office.

An election result, appointment result, succession rule, removal procedure, resignation, death, incapacity, or other lawful process may affect an office assignment.

### Candidate hard invariant G-05

**Office existence, actor identity, and current office assignment are distinct canonical facts. Authority attached to an office does not become the personal property of its current holder.**

## 8. Authority and competency

Commit 3 does not define political power as a scalar.

Legal authority is contextual.

The relevant question is:

> Under the applicable legal order, may this actor/institution/office attempt or validly perform this kind of act toward this target, in this jurisdiction/place, at this time, through this procedure?

### 8.1 Authority originates in legal sources

The legal order owns the legally operative sources of authority.

An office or institution may maintain indexes/references describing the powers ordinarily associated with it, but those indexes are derived/navigation aids unless a legal source itself grants the authority.

Do not create:

```text
President.power["spend"] = true
```

as an independent normative source if the actual legal order says otherwise.

Conceptually:

```text
LegalSource(s)
+ Office/Institution identity
+ jurisdiction
+ target/action
+ scope/time
+ scoped orders/constraints
        ↓
ApplicableAuthorityPosition
```

`ApplicableAuthorityPosition` is contextual/derived.

### 8.2 Claimed authority is separate

An attempted action may reference a claimed authority basis.

```text
AttemptedAction.claimedAuthorityBasis = [source/ref/assertion]
```

The claim itself does not make the action lawful.

### 8.3 Authority is not capability or compliance

Even clearly valid authority does not guarantee:

- enough political support;
- available appropriated funds;
- agency capacity;
- target cooperation;
- physical feasibility;
- successful material outcome.

### Candidate hard invariant G-06

**Legal authority is derived from applicable legal sources and context. Claimed authority, political ability, administrative capability, institutional compliance, and material success are separate facts.**

## 9. Governance actions are typed attempts, not a mandatory policy pipeline

A player or autonomous actor can originate different categories of political/institutional action.

Examples may eventually include:

- propose legislation;
- introduce/amend/vote;
- sign/veto;
- issue executive direction;
- issue a legally operative order where authority exists;
- appoint/nominate;
- request/withhold administrative action;
- promulgate regulation;
- apply for/accept/refuse an intergovernmental program;
- initiate legal challenge;
- communicate a political claim.

Commit 3 does not require one universal `GovernanceAction` class with every possible field.

The architecture only requires that each supported action can answer:

- who/what originated it;
- what kind of act was attempted;
- what target/referent it concerns;
- which office/institutional role provides attemptability;
- what authority is claimed;
- which procedure or resolver receives it;
- what current/procedural owner changes if accepted;
- what immutable occurrence is recorded.

### Candidate hard invariant G-07

**Political actions enter the world as actor/institution attempts routed to the appropriate procedure/owner. No generic policy command may directly mutate legal, fiscal, administrative, material, or electoral outcomes.**

## 10. Procedure

A `Procedure` governs how some political/institutional state can change.

Examples:

- legislative enactment;
- appointment/confirmation;
- veto/override;
- constitutional amendment;
- budget/appropriation enactment;
- state program application/acceptance;
- judicial contest later;
- election certification later.

Commit 3 distinguishes:

### Procedure definition/rules

The legally operative requirements for a procedure remain legal-order truth.

A reusable implementation template may exist in rules/content configuration, but it does not become the source of legal validity once instantiated in-world.

### Procedure instance/current state

The active process owns:

- current stage;
- pending proposal/matter;
- participants/offices required at the stage;
- decisions already received;
- deadlines where procedural;
- amendments/revisions under consideration;
- next legally available transitions;
- current completion/failure status.

### Historical occurrences

Immutable occurrences record that:

- a proposal was introduced;
- an amendment was accepted;
- a chamber vote occurred;
- a bill was enacted;
- a veto occurred.

History does not own the current procedure state.

### Candidate hard invariant G-08

**Procedure rules derive from the legal order; an active procedure instance owns mutable current process state; actors own their decisions; historical records own immutable occurrences. These may not collapse into one object.**

## 11. Legislature and chamber composition

The constitutional engine must not assume every legislature has exactly two chambers.

Conceptually:

```text
LegislatureInstitution
  chambers[]
```

Each chamber may be represented as an institution or explicit procedural body, depending on implementation.

A jurisdiction's legally operative structure determines:

- number of chambers;
- office/seat structure;
- which matters require which chambers;
- thresholds;
- sequencing;
- executive action where applicable;
- reconciliation/concurrence requirements.

For V0 architecture tests:

- Federal Test Federation must support a bicameral federal legislature.
- State A must be representable as bicameral.
- State B must be representable as unicameral.
- No runtime branch may be required merely because `jurisdiction == NebraskaLikeState`.

### 11.1 No universal lower/upper fields

Rejected:

```text
Legislature {
  lowerChamber
  upperChamber
}
```

Preferred semantic shape:

```text
Legislature {
  chambers[]
}
```

The procedure determines which chamber sequence is required.

### Candidate hard invariant G-09

**Legislative chamber count and sequence are configuration/legal-order facts, not hard-coded assumptions. Legislative procedures operate over the chambers legally required for that jurisdiction/matter.**

## 12. Proposal, provision, amendment, enactment

A pending legislative proposal is not an enacted law.

A proposal owns/current procedure references may include:

- stable identity;
- text/provisions under consideration;
- sponsors;
- amendment state;
- procedural status.

Political actors may support, oppose, bargain over, or amend proposal provisions.

A successful legislative procedure may produce a legal instrument.

The enacted legal instrument is a new legal-order fact with its own identity/provenance/effective state.

Do not reuse the mutable proposal object as the enacted law merely by setting:

```text
proposal.status = LAW
```

if doing so causes pending-procedure state and persistent legal-source state to become the same owner.

Implementation may reuse immutable provision structures where safe, but semantic ownership remains distinct.

### Candidate hard invariant G-10

**Pending proposal/procedural state and enacted legal-source state are distinct. Enactment creates legally operative state; it does not simply promote mutable proposal procedure state into a universal policy object.**

## 13. Fiscal authority and execution

Commit 2 froze the semantic layers. Commit 3 locates them within government architecture.

### 13.1 Legal fiscal authority

Authorization and appropriation are legally operative source/provision state.

They answer questions such as:

- may a purpose/program exist?
- may public resources be committed?
- what amount/period/purpose constraints apply?

They do not own actual treasury balances or payments.

### 13.2 Public-finance state

Public-finance/treasury state owns actual fiscal position such as supported:

- cash/balance state;
- debt/borrowing state;
- receipts/revenue state;
- available financial resources;
- accounting period state.

Exact federal accounting detail is deferred.

### 13.3 Fiscal execution

Fiscal-execution state owns current commitments/transactions such as:

- obligation amount/status;
- disbursement/payment amount/status;
- payee/recipient reference;
- purpose/program reference;
- legal/fiscal authority reference.

Program state may request or trigger these processes but does not own the payment merely because it benefits the program.

### Candidate hard invariant G-11

**Authorization/appropriation, public financial position, obligation, disbursement, administrative award, and material use remain separately owned even when one GL0 program links them.**

## 14. Administrative institution and program

An administrative agency is an institution.

A program is an administrative mechanism operated under some institution/legal authority.

Program/administrative state may own:

- operational configuration within delegated discretion;
- staffing/capacity allocation;
- application-processing workflow;
- application records;
- determinations;
- awards;
- compliance workflow;
- reporting workflow;
- current execution status.

Legally operative requirements remain legal-order truth.

An agency/program may evaluate:

```text
Applicable legal requirements
+ lawful delegated configuration
+ applicant/project/state facts
        ↓
administrative determination
```

It does not copy binding legal requirements into a separately mutable shadow rule set.

### 14.1 Capacity

Administrative capacity is institutional/administrative state.

It may represent aggregate supported capability in GL0 rather than every employee.

Capacity can constrain:

- throughput;
- review quality;
- monitoring;
- award timing;
- enforcement;
- reporting;
- post-enactment decisions.

Capacity is not legal authority and is not a scalar political resource shared with unrelated institutions.

### Candidate hard invariant G-12

**Administration owns operational capability/configuration and determinations; the legal order owns binding law; fiscal execution owns money movement; material domains own societal outcomes.**

## 15. Intergovernmental relations and federalism

A federation is not represented as:

```text
FederalGovernment -> child States -> child People
```

where the federal level automatically controls every nested object.

Federal and state jurisdictions can hold overlapping, exclusive, delegated, conditional, or contested competencies over shared people/geography.

Commit 3 requires an `IntergovernmentalRelationship` semantic home for persistent cross-jurisdiction relationships.

Possible relationship kinds later may include:

- conditional grant/program agreement;
- delegation;
- cooperative administration;
- preemption/conflict relationship;
- shared-cost arrangement;
- mandate/obligation;
- compact.

GL0 requires only the conditional program relationship.

### 15.1 GL0 participation facts

The accepted Commit-2 split is instantiated as:

```text
State side
  application
  acceptance/refusal
  withdrawal intent
  state commitments

Federal program side
  eligibility determination
  acceptance/denial
  award

Intergovernmental relationship
  active agreement/participation status
  parties
  linked program
  legally operative terms by reference
  current relationship obligations/status
```

The relationship does not own the state or the federal program.

It owns only the relationship facts that cannot truthfully belong to one side alone.

### 15.2 Terms remain legally grounded

If agreement terms are legally operative, the relationship references the applicable legal instrument/terms. It does not silently become a second legal owner.

### Candidate hard invariant G-13

**Cross-jurisdiction participation is modeled as actions/decisions by each jurisdiction plus a relationship state joining them under applicable law. Neither federal supremacy nor geographic containment implies automatic implementation by a state.**

## 16. Ordinary GL0 legislative route

A normal housing route should be representable as:

```text
ExecutiveAdministrationStrategicSurface
        ↓
player selects housing legislative intent
        ↓
administration originates proposal request / legislative proposal
        ↓
LegislativeProcedureInstance
        ↓
individual legislators/chambers decide
        ↓
amendments alter pending proposal state
        ↓
required chamber procedures succeed
        ↓
executive enactment/signature stage where configured
        ↓
Statute / legal source created
        ↓
Appropriation / fiscal authority created where enacted
        ↓
Agency/Program operationalizes delegated authority
        ↓
States apply/refuse
        ↓
Federal program determines eligibility/awards
        ↓
Intergovernmental agreement becomes active where both sides and law permit
```

Nothing in this route authorizes a later material jump.

The program still has to create administrative/fiscal/material inputs, and Housing owns physical response.

## 17. Contested executive-action route

The same architecture must permit:

```text
Executive administration
        ↓
issues actor-attemptable directive
        ↓
claims authority basis
        ↓
attempt becomes canonical
        ↓
derived legal position may be adverse/disputed
        ↓
agency receives directive
        ↓
agency leadership/institution responds
        ↓
state/other actor may challenge
        ↓
judiciary/legal contest may create scoped order
        ↓
agency/executive responds to order
```

The world does **not** reject the directive merely because legal validity is doubtful.

The legal order also does **not** automatically become whatever the executive claimed.

## 18. Institutional nonperformance route

GL0 must separately support:

```text
valid law
+ valid appropriation
+ lawful agency mandate
+ actor compliance
        ↓
agency capacity / workflow
        ↓
slow or poor execution
```

No legal dispute is necessary.

This keeps institutional capacity failure separate from obstruction.

## 19. Structural variance tests

Commit 3 should be considered unsafe if these cases require changing foundational ownership.

### 19.1 Federal + two state structures

The same primitives must represent:

- a bicameral federal legislature;
- a bicameral state legislature;
- a unicameral state legislature.

### 19.2 Deepen Virginia-like state

Later adding:

- executive office;
- two chambers;
- judiciary;
- agencies;
- state budget/taxes;
- local-government relationships;

should primarily instantiate/deepen existing primitives rather than replace `Jurisdiction`, `Office`, `Institution`, `LegalOrder`, or `Procedure`.

### 19.3 Delete-America test

A fictional federation or unitary constitutional state should be conceptually expressible with the same high-level primitives:

- jurisdiction;
- legal order;
- institution;
- office;
- office assignment;
- authority;
- procedure;
- actors;
- administration.

This does not require V0 to prove every parliamentary convention or non-U.S. constitutional form.

The test only rejects primitives whose supposedly generic meaning secretly requires U.S.-specific names/branches.

## 20. Explicit anti-patterns

Commit 3 rejects:

```text
if (state == NEBRASKA) useUnicameral()
```

Use configured legal/institutional structure.

```text
President.powers["X"] = true
```

when that value becomes an independent legal source.

```text
proposal.status = LAW
```

if pending procedure and persistent legal-source ownership collapse.

```text
appropriation.spent = true
```

as a shortcut for actual fiscal execution.

```text
program.rules = copiedStatuteRules
```

when both copies can mutate independently.

```text
state.participates = true
```

as sole ownership of a bilateral federal program relationship.

```text
institution.actor = institution
```

as a shortcut erasing actor/office distinction.

```text
illegalAction -> rejectBeforeWorld
```

when the action is structurally valid and actor-attemptable.

## 21. Commit-3 review questions for this document

Reviewers should report only structural findings that would make the next architecture steps unsafe.

1. Do jurisdiction, geography, institutions, offices, actors, and office assignments remain distinct?
2. Does legal authority derive from persistent legal sources rather than office-owned power booleans?
3. Can actor-attemptable unlawful/disputed action enter the world without becoming legally valid automatically?
4. Can bicameral and unicameral legislatures use the same primitives without jurisdiction-name branches?
5. Are active procedure state, actor decisions, enacted legal sources, and historical occurrences separately owned?
6. Are authorization, appropriation, treasury state, obligations, disbursements, program awards, and material outcomes still distinct?
7. Does program configuration operationalize law without shadow-owning binding rules?
8. Is intergovernmental participation genuinely relational rather than a state/federal boolean?
9. Can a thin state deepen later without replacing foundational governmental primitives?
10. Did this document accidentally build a universal constitutional DSL or otherwise over-generalize beyond GL0?
