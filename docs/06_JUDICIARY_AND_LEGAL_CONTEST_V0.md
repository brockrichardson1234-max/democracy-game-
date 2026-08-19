# 06 — Judiciary and Legal Contest V0

Status: **Commit-3 architecture candidate for review. Not implementation authority.**

## 1. Purpose

Commit 1 requires the world to distinguish actor attempts, legal validity, institutional compliance, and material consequence. Commit 2 requires scoped legal effects rather than one global `currentLegalEffect`. `04` establishes the legal/institutional primitives.

This document provides the minimum judiciary/legal-contest architecture necessary to make those distinctions real.

The goal is not to simulate every court doctrine.

The goal is to make this sentence causally representable:

> **The executive tried it, a legal challenge occurred, a court issued a scoped order, and the world still had to determine who complied and what materially happened.**

## 2. Normative dependencies

This document must preserve:

- legal sources/orders own scoped legal state, not material outcomes;
- applicable legal position is derived for actor/action/place/time;
- an attempted unlawful political act is valid simulation input when actor-attemptable;
- institutions/actors may comply, delay, partially comply, resist, or refuse;
- current/procedural case state is domain-owned;
- immutable historical occurrences do not own current case/order state;
- player control does not own judges/courts;
- court rulings may alter legal obligations but cannot rewind prior material history;
- election/office assignment/compliance remain separate from legal claims.

## 3. Judiciary is built from the same governmental primitives

The architecture does not define `SupremeCourt` as a universal engine concept.

A judicial system uses the same generic governmental categories:

```text
Jurisdiction
  ↓
JudicialInstitution
  ↓
JudicialOffice(s)
  ↓
OfficeAssignment
  ↓
Political/Institutional Actor
```

A future U.S. configuration may instantiate:

- Supreme Court;
- appellate courts;
- district courts;
- state courts.

GL0 does not require that breadth.

The walking skeleton requires only one deliberately small generic judicial institution capable of receiving one supported legal contest and issuing one temporary/scoped order.

### Candidate hard invariant J-01

**Courts are institutions, judges are actors occupying judicial offices, and judicial structure is jurisdiction/legal-order configuration rather than a hard-coded Supreme Court object.**

## 4. Legal contest/case

A `LegalContest` is current procedural state representing a legally recognized dispute before a judicial/legal decision process.

Possible semantic state includes:

- stable contest identity;
- forum/judicial institution;
- parties;
- challenged act/source/action;
- legal questions/claims;
- current procedural stage;
- current pending motions/requests where supported;
- current orders;
- appeal/review relationship where supported;
- status such as pending/resolved/dismissed.

The exact schema is deferred.

### 4.1 Contest admission

Not every political disagreement automatically becomes a court case.

A legal contest may require supported conditions such as:

- a party with a legally cognizable claim;
- an eligible forum;
- timing/procedural prerequisites;
- a challengeable act/source/order.

GL0 may use deliberately simplified admission rules.

Commit 3 does not freeze real-world standing doctrine or federal jurisdiction doctrine.

### Candidate hard invariant J-02

**Legal contest admission is itself a legal/procedural question. A political actor's objection does not automatically create a judicial order, and the game need not model every real litigation doctrine in GL0.**

## 5. Legal claim is not legal truth

A party to a contest may make claims such as:

- executive exceeded statutory authority;
- state is violating federal law;
- agency action is unlawful;
- a statute is unconstitutional;
- a legally operative requirement does/does not apply.

A claim owns:

- who asserted it;
- what action/source it concerns;
- claimed legal basis;
- requested remedy;
- filing/time/procedural state.

It does not automatically alter the legal order.

Example:

```text
State A claims ExecutiveDirective X exceeds Statute S
```

is not equivalent to:

```text
ExecutiveDirective X is globally invalid
```

### Candidate hard invariant J-03

**Legal claims are canonical assertions/procedural state with provenance. They do not become legally operative truth merely because a party filed or asserted them.**

## 6. Legal question

A `LegalQuestion` identifies the legal issue the judicial process must resolve.

Examples:

- whether an executive direction is authorized;
- whether an agency may obligate funds for a stated purpose;
- whether a state is bound by a program condition;
- whether a legal source conflicts with a higher-order source.

The legal question references:

- relevant actors/institutions;
- action/source under review;
- applicable legal sources;
- jurisdiction/scope;
- time/context.

The court/judicial process resolves the question under the configured legal order.

The question itself owns no outcome.

## 7. Judicial decision, interpretation, and order are distinct

The architecture distinguishes at least three semantics.

### 7.1 Judicial decision/ruling

The court resolves some procedural/legal question.

The ruling may include reasoning/findings and may generate legally meaningful consequences.

An immutable occurrence records that the ruling happened.

### 7.2 Legal interpretation

A ruling may create an interpretation with whatever binding/precedential scope the legal order gives that court/decision.

The interpretation is a legal-order source/input.

It does not become one global truth regardless of context.

### 7.3 Judicial order

A judicial order is a legally operative directive/remedy addressed to some subject(s) or conduct.

An order may specify:

- subject/party;
- prohibited/required conduct;
- legal basis;
- territorial/jurisdictional scope;
- effective time;
- expiration/duration;
- interim/final status;
- remedy;
- relationship to appeal/review.

These may be one implementation object if the semantics remain distinct.

### Candidate hard invariant J-04

**A judicial ruling, legal interpretation, and operative order may be related but are not assumed to be one global legal-effect flag. Their authority, scope, subjects, and temporal effect remain explicit.**

## 8. No universal currentLegalEffect

The legal position relevant to an actor remains contextual.

Conceptually:

```text
resolveLegalPosition(
    actor,
    attemptedAction,
    target,
    place,
    time,
    legalSources,
    judicialOrders,
    interpretations,
    proceduralState
)
```

The resolver may conclude, depending on context:

- clearly permitted;
- clearly prohibited;
- required;
- disputed/uncertain;
- constrained by a specific order;
- unresolved pending contest.

Exact legal categories are deferred.

Two actors may occupy different legal positions at the same time because:

- an order applies to one party;
- jurisdiction differs;
- effective dates differ;
- a contest is pending;
- different legal sources apply.

### Candidate hard invariant J-05

**Judicial activity contributes scoped legal sources/orders to contextual legal resolution; it does not rewrite one universal `law.status` or `currentLegalEffect` for all actors.**

## 9. Temporary/interim order

GL0 requires the ability to represent one temporary judicial intervention.

Conceptually:

```text
State challenges executive funding redirection
        ↓
LegalContest admitted
        ↓
Court considers interim relief
        ↓
TemporaryOrder issued
        ↓
specific agency/executive conduct is constrained
        ↓
target actors decide/respond
```

The order has:

- explicit subject/scope;
- effective boundary;
- current status;
- expiration/review condition.

The temporary order is current legal-order/judicial state.

`TemporaryOrderIssued(...)` is immutable occurrence history.

### Candidate hard invariant J-06

**Interim orders are scoped current legal state with independent historical issuance records. Their existence does not automatically resolve the underlying contest or erase prior actions.**

## 10. Court orders do not mutate material reality

Suppose:

1. executive orders housing payments halted;
2. agency operational disruption delays payments for five days;
3. court orders payments resumed;
4. agency complies.

The court order may create a legal obligation.

It does **not** retroactively make those five days of delay disappear.

Conceptually:

```text
JudicialOrder
    ↓ legal obligation/constraint
Agency receives order
    ↓ actor/institution response
Fiscal/administrative execution changes
    ↓
Material world continues from actual current state
```

### Candidate hard invariant J-07

**Judicial orders mutate legal obligations/constraints through the legal owner. Material, fiscal, and administrative consequences occur only through the actors/institutions/processes that respond to those obligations. Courts do not directly rewrite non-legal domain history.**

## 11. Compliance with a court order is a separate world fact

An actor/institution can:

- comply;
- partially comply;
- delay;
- seek clarification;
- appeal while complying;
- seek stay/review;
- resist/refuse where actor-attemptable.

The order remains legally operative according to its own state unless modified/stayed/reversed/expired through proper process.

A refusal does not mutate:

```text
order.valid = false
```

simply because the actor ignored it.

Likewise an order does not mutate:

```text
agency.compliance = true
```

automatically.

### Candidate hard invariant J-08

**Legal obligation and actual compliance are separately owned facts. A judicial order does not guarantee behavior; noncompliance does not erase the order.**

## 12. Appeal/review

A judicial decision/order may be subject to review according to configured procedure.

Commit 3 only requires a seam for:

- contest/decision can identify review availability;
- a party may attempt review/appeal;
- current order may remain, be stayed, changed, or superseded according to legal procedure.

GL0 contested-authority route may choose:

- executive backs down;
- executive appeals;
- executive continues contest politically;

without implementing a complete appellate hierarchy.

### Candidate hard invariant J-09

**Review/appeal changes legal/procedural state through configured procedure. Filing an appeal does not automatically erase the lower/current order unless applicable legal rules say it does.**

## 13. Conflicting legal sources/orders

The architecture must tolerate multiple legal sources and potentially conflicting claims/orders without data-model collapse.

Examples later could include:

- statute says X;
- executive asserts Y;
- court orders agency not to do Y;
- appeal pending;
- another jurisdiction is not subject to that particular order.

Commit 3 does not define every conflict-resolution doctrine.

The required seam is that the contextual legal resolver can inspect:

- source authority/hierarchy;
- jurisdiction;
- scope;
- subject;
- time;
- procedural status;
- stays/reversals/supersession.

This is why one `currentLegalEffect` field is forbidden.

## 14. Judicial actor decision source

Judges are actors occupying judicial offices.

A judicial procedure can create decision opportunities such as:

- grant/deny interim order;
- issue ruling;
- choose among supported remedies.

For GL0, judicial reasoning may be intentionally simple/deterministic.

The architectural rule remains:

```text
Judge decision source
    ↓
canonical judicial decision
    ↓
same judicial/legal resolver
```

If a future mode ever made a judge playable, player control would select the same supported canonical action rather than invoking a different court engine.

No such gameplay is authorized now.

## 15. Judicial independence from player control

The GL0 executive `ControlBinding` gives the player no direct authority over:

- judges;
- judicial votes/rulings;
- court procedure.

The executive may take politically/legal valid attempts such as:

- argue a position;
- appeal;
- comply;
- request stay;
- criticize publicly;
- make appointments where legally/procedurally available.

Those actions still go through ordinary world procedures.

### Candidate hard invariant J-10

**The executive administration may participate in or react to legal contests but cannot directly choose judicial outcomes merely because the player controls the executive.**

## 16. Court findings and material truth

A court may make findings of fact for legal/procedural purposes.

Those findings are legal/procedural records.

They do not necessarily become the material domain's canonical truth.

Example:

A court's finding that a program met a legal evidentiary threshold is not automatically a mutation of actual housing stock.

The court can create legal consequences based on its finding.

Material reality remains owned by the material domain.

### Candidate hard invariant J-11

**Judicial factual findings may be canonical legal/procedural facts about what the court found, but they do not silently overwrite the underlying material-domain fact being adjudicated.**

## 17. Remedy

A remedy describes the legally operative response granted by the judicial process.

Possible future remedies may include:

- injunction/prohibition;
- command to perform;
- vacatur;
- declaration;
- damages/payment;
- remand;
- other jurisdiction-specific relief.

GL0 only requires a temporary order capable of constraining an executive/agency funding action.

A remedy can create obligations.

Actual fulfillment still occurs through responsible actors/institutions/fiscal processes.

## 18. GL0 contested-authority route

The walking skeleton must be able to express something like:

```text
ExecutiveAdministration
    attempts to redirect housing funds
        ↓
Attempt is structurally valid + actor-attemptable
        ↓
claims legal authority
        ↓
Agency considers/begins action
        ↓
State A claims redirection exceeds authority
        ↓
State A initiates legal contest
        ↓
Generic Court has configured jurisdiction for fixture
        ↓
Court issues temporary scoped order:
    Agency must not redirect disputed funds while contest pending
        ↓
Agency receives order
        ↓
Agency complies
        ↓
Executive chooses:
    appeal / back down / continue political contest
        ↓
underlying material/fiscal history remains what actually happened
```

This route proves:

- attempt != legal validity;
- claim != legal truth;
- court != material owner;
- order != compliance;
- current legal state != history;
- appeal != automatic reversal;
- executive control != court control.

## 19. Noncompliance/constitutional-crisis seam

GL0 does not implement a constitutional crisis.

But the architecture must not break if later:

```text
Court orders transfer/action
        ↓
Actor refuses
        ↓
some institutions recognize order
some do not
        ↓
material/political consequences diverge
```

No `dictatorship=true` switch is required.

The relevant state already exists in:

- legal sources/orders;
- office assignments/claims;
- actor actions;
- institutional compliance;
- information;
- political/public response.

This seam is architectural only.

## 20. Historical ownership in judiciary

Current case/order state and occurrence history remain separate.

Examples:

```text
LegalContest.currentStage
    -> JudicialContestState

CourtOrder.currentStatus
    -> LegalOrder/Judicial state

LegalContestFiled(...)
CourtOrderIssued(...)
AppealFiled(...)
OrderStayed(...)
RulingEntered(...)
    -> immutable occurrence history
```

A chronological history index may reference these occurrences.

It does not own current case/order status.

### Candidate hard invariant J-12

**Judiciary obeys the same domain-current-state versus immutable-occurrence split as every other system.**

## 21. Minimum walking-skeleton judiciary

The skeleton should not implement a full court system.

Minimum supported fixture:

- one generic judicial institution;
- one or a few judicial offices/actors as needed by the procedure;
- one contest type for the aggressive housing-funds action;
- a simplified contest-admission rule;
- one temporary/interim order;
- one target agency response;
- an appeal/back-down decision seam;
- persistence of contest/order state across time/succession where still applicable.

No detailed briefs, hearings, discovery, standing doctrine, certiorari, multi-circuit hierarchy, or judicial-elections system is required.

## 22. Future-deepening tests

The architecture should later allow:

### U.S. federal judiciary

More courts, jurisdiction rules, precedent scope, appeals, appointment procedures.

### State judiciary

State-specific selection/term structures through the same institution/office/assignment primitives.

### Constitutional review

Challenges to statutes/legal sources without having to replace the legal-source model.

### Contested election

Judicial orders/interpretations interacting with election/certification/office-assignment processes without collapsing them.

None of this is implemented by Commit 3.

## 23. Explicit anti-patterns

Rejected:

```text
if courtRulesUnconstitutional:
    law.value = constitutionalValue
```

Rejected:

```text
CourtOrder.materialState = correctedState
```

Rejected:

```text
case.claim = legalTruth
```

Rejected:

```text
appealFiled -> order.active = false
```

unless the applicable legal procedure actually grants that effect.

Rejected:

```text
court.ruling = globalCurrentLegalEffect
```

Rejected:

```text
if playerIsPresident:
    chooseCourtOutcome()
```

Rejected:

```text
actorIgnoredOrder -> order.deleted
```

## 24. Commit-3 review questions for this document

1. Are court, judicial office, judge actor, legal contest, claim, ruling, interpretation, and order distinct enough?
2. Does a legal claim remain an assertion rather than legal truth?
3. Can an interim order be scoped to subjects/actions/place/time without one global legal switch?
4. Can the court create legal obligations without directly mutating agency/fiscal/material state?
5. Is compliance independently resolved?
6. Can an appeal exist without automatically erasing the current order?
7. Can conflicting/scoped legal state coexist long enough for later deeper doctrine?
8. Does current contest/order state remain separate from immutable occurrence history?
9. Is the GL0 court fixture narrow enough to avoid full judiciary scope creep?
10. Does this architecture leave a seam for future constitutional crises without implementing dictatorship/coup mechanics now?
