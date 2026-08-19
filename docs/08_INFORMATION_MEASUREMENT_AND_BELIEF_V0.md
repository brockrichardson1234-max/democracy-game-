# 08 — Information, Measurement, and Belief V0

Status: **Commit-4 architecture candidate for review. Not implementation authority.**

## 1. Purpose

Governing Loop 0 requires a country that does not observe canonical world truth perfectly and does not convert one report or slogan directly into votes.

This document closes the minimum information/measurement/belief architecture required to make the following chain causal and owner-safe:

```text
actual world state
→ measurement
→ information artifact
→ distribution/exposure/access
→ recipient belief/interpretation
→ attribution/salience
→ preference/turnout-relevant state
→ later measurement or political action
```

The chain is illustrative, not a mandatory universal pipeline. Direct institutional records, direct lived experience, private communications, and public claims may enter at different points while preserving the same ownership distinctions.

This document does **not** design a media-market simulator, social network, full persuasion psychology, campaign system, or universal epistemology.

## 2. Normative dependencies

This document must preserve:

- canonical material/legal/political state remains owned by its originating domain;
- information artifacts own what was measured, reported, forecast, claimed, or communicated, not the referent;
- population political state is owned with PopulationState;
- individual political actors own their actor-private beliefs/intentions and receive only plausibly available information;
- organization state remains distinct from actor/population state;
- derived projections are read-only;
- persisted projections become provenance-bearing artifacts, not truth owners;
- historical records own occurrences, not current belief or current world state;
- the player may know exact authoritative facts legitimately available to the controlled administration without becoming omniscient;
- succession preserves information according to ownership/access/transfer rather than copying outgoing private knowledge;
- actual world state, measurement, information artifact, belief, attribution, salience, preference, and turnout are distinct facts.

## 3. InformationEnvironment owns artifacts and supported distribution state

`InformationEnvironment` owns canonical in-world information objects and supported access/distribution facts.

An information artifact may include:

- stable identity;
- artifact type;
- producer/author/source;
- content/claim/estimate;
- referent references;
- measurement or forecast `as_of` time where applicable;
- creation time;
- publication/release time;
- provenance/method references;
- uncertainty/error/revision metadata where represented;
- confidentiality/access class;
- intended audience/channel where represented;
- supersession/revision relationships;
- distribution/exposure records where GL0 models them.

Examples include:

- official housing statistical release;
- agency implementation report;
- staff forecast;
- legislative whip estimate;
- poll;
- confidential memo;
- public speech/claim;
- campaign statement;
- court/public institutional notice.

### Candidate hard invariant IM-01

**InformationEnvironment owns the existence, content, provenance, access, release, revision, and supported distribution state of in-world information artifacts. It does not own the underlying fact being described or the recipient's resulting belief.**

## 4. Actual state and measurement are distinct

A measurement process observes or samples a canonical referent under a method at some time.

Conceptually:

```text
Canonical referent state at T_observed
+ measurement method/sample/coverage
→ MeasurementResult
→ optional/persisted InformationArtifact
```

The measurement may be:

- exact for a directly recorded institutional fact;
- sampled;
- lagged;
- incomplete;
- noisy;
- revised later;
- differently aggregated from the underlying state.

The referent owner does not become inaccurate merely because a measurement is wrong.

The measurement does not update the referent to match the report.

### Candidate hard invariant IM-02

**Measurement is an observation process over canonical state, not a mutation of that state. Measurement error, lag, coverage limits, aggregation, and later revision affect the observation/artifact, not the authoritative referent.**

### 4.1 Lagged measurement work-in-progress has its own canonical process state

A measurement that spans time may accumulate canonical observation/process state before any published artifact exists.

Conceptually:

```text
MeasurementProcess
  referent reference
  method/sample/coverage definition
  observation/as_of interval
  captured observations/sample state
  processing/completion state
  committed measurement result when resolved
```

The exact runtime class is deferred. The semantic requirement is that once an observation/sample needed by the measurement has been canonically captured, that captured information belongs to the measurement process until it produces or contributes to a committed result. It is not owned by the referent domain, by a future report artifact that does not yet exist, or by `HistoricalRecord` as a substitute reconstruction store.

Later changes to the referent may affect later observations when the method says they should, but they may not silently replace already captured observations. A persisted report may then copy/reference the committed measurement result according to provenance while remaining non-authoritative about the referent itself.

### Candidate hard invariant IM-02A

**Lagged/in-progress measurements own their captured observations, sample/progress state, method/as-of context, and committed measurement result as canonical information-process state. Once an observation is canonically captured, later referent changes may not silently substitute for it; publication creates an artifact from the measurement result rather than reconstructing the observation from current world state or a general-purpose history store.**

## 5. Measurement time, as-of time, and release time are different

GL0 specifically requires data lag.

An official release may have at least:

```text
observation/as_of interval
measurement/processing occurrence
release/publish time
recipient exposure time
```

These times may differ.

Example:

- housing conditions improve materially in March;
- a survey measures February–April conditions;
- the agency finishes processing in May;
- the release becomes public in June;
- some population groups receive or notice it later.

A June report therefore does not imply the underlying housing change occurred in June.

### Candidate hard invariant IM-03

**Information artifacts must distinguish the time their content refers to from the time the artifact was created/released/exposed whenever that difference matters. A report timestamp may not silently become the timestamp of the underlying world change.**

## 6. Direct records and direct experience are information inputs, not omniscience

Not all knowledge requires a noisy public report.

A recipient may legitimately observe exact or near-exact information through:

- its own canonical action;
- an authoritative institutional record it can access;
- a legal instrument or order delivered to it;
- an agency record owned by its institution;
- direct material experience represented for a population group;
- a private communication actually received.

This does not create global visibility.

Example:

The administration may know exactly that it issued Directive X and that an enacted appropriation contains amount Y. It may still be uncertain about future construction effects or hidden voter beliefs.

A population group may directly experience higher rent pressure without knowing why it happened.

### Candidate hard invariant IM-04

**Knowledge can arise from direct access, records, experience, or communicated artifacts. Exact access to one fact does not imply access to unrelated canonical truth, and direct experience of an outcome does not automatically supply correct causal attribution.**

## 7. Access, availability, and exposure are distinct

For an actor or population group to update from an artifact, the architecture may need to distinguish:

- artifact exists;
- recipient is legally/institutionally allowed to access it;
- artifact is available through a channel the recipient can receive;
- recipient is exposed to/notices it under the supported model;
- recipient incorporates or rejects/interprets it.

GL0 does not need a detailed attention economy.

A simple deterministic or probabilistic exposure rule is sufficient if it preserves the distinction.

Public publication may make an artifact broadly available without requiring every person to have received/processed it instantly.

Private/confidential artifacts must not enter population/actor knowledge without an actual access/distribution path.

### Candidate hard invariant IM-05

**Artifact existence, access permission, channel availability, exposure/receipt, and belief incorporation are distinct where the supported causal claim depends on them. Publication does not automatically write the artifact into every recipient's knowledge.**

## 8. Recipient belief is recipient-owned state

A recipient may form current beliefs about supported referents such as:

- housing conditions;
- whether conditions improved or worsened;
- government competence;
- whether a program is operating;
- whether an actor caused an outcome;
- future expectations;
- candidate/administration performance.

For ordinary population, this belief state belongs to PopulationState.

For individualized political actors, actor-private belief state remains owned by the actor under Commit 3.

Organizations may own organization-level adopted positions/assessments only when those are genuinely organization facts; they do not own member beliefs.

A report cannot set belief directly merely by existing.

### Candidate hard invariant IM-06

**Belief is canonical state of the recipient owner. Information artifacts provide inputs to belief-update processes but do not own, duplicate, or deterministically pre-resolve recipient belief.**

## 9. Belief need not equal a second copy of the world

Commit 4 does not require every recipient to hold a complete shadow world model.

The representation should contain only belief state needed by supported decisions and electoral response.

A population group may, for example, need beliefs/evaluations about:

- direction/severity of housing pressure;
- perceived program performance;
- perceived responsibility/credit/blame;
- expected future conditions;
- incumbent/candidate evaluation.

An actor may need a different set of beliefs because their decisions concern procedure, coalition, law, administration, or constituency.

Unknown or unrepresented belief must not be silently replaced with canonical truth.

### Candidate hard invariant IM-07

**Recipient belief representation is purpose-bounded. Missing belief state does not grant omniscience, and belief need not mirror the full canonical world as a second mutable model.**

## 10. Attribution is distinct from belief about outcome

A recipient can believe that housing improved while attributing the improvement to:

- the federal administration;
- a state government;
- private construction;
- prior policy;
- broader economic forces;
- another actor;
- no known cause.

Likewise a recipient can believe conditions worsened but assign blame differently.

Attribution is therefore not implicit in observed outcome direction.

For ordinary population, attribution is population political state.

A political claim may influence attribution but does not own it.

### Candidate hard invariant IM-08

**Belief about what happened and attribution of responsibility are distinct recipient-owned facts. Material success does not automatically create incumbent credit, and political messaging does not rewrite material truth.**

## 11. Salience is distinct from belief and preference

A population group may correctly believe a condition exists while assigning it little political importance.

Salience may be influenced by:

- magnitude/direct experience;
- repeated exposure;
- competing issues in fixture baseline state;
- political claims;
- recency;
- persistent memory;
- election proximity where the supported model uses it.

Commit 4 does not freeze a universal salience formula.

Salience belongs to population political state for ordinary population and actor state where relevant to individualized actors.

### Candidate hard invariant IM-09

**Salience is recipient-owned political state distinct from factual belief and electoral preference. High salience may amplify the decision relevance of a belief; it is not itself proof of belief direction or support.**

## 12. Preference is distinct from belief, attribution, and salience

Electoral/political preference may respond to multiple persistent inputs, including:

- baseline partisan disposition;
- incumbent/candidate evaluation;
- relevant beliefs;
- attribution/credit/blame;
- issue salience;
- political memory;
- expectations;
- other fixture-supplied background politics.

GL0 does not require a universal utility function.

A simple deterministic fixture rule is acceptable if it preserves the semantic separation.

The following is rejected as architecture:

```text
if housingImproved:
    incumbentSupport += 10
```

because it collapses material truth, knowledge, attribution, salience, and preference.

### Candidate hard invariant IM-10

**Political/electoral preference is population-owned state or a derived decision input from population-owned state, not a direct material/report outcome. It may depend on belief, attribution, salience, baseline politics, and other supported state without collapsing those facts.**

## 13. Turnout disposition is separate again

A voter/population group may prefer a candidate but not participate.

Turnout-relevant state may depend on supported factors such as:

- baseline turnout tendency;
- salience;
- enthusiasm/intensity where represented;
- candidate evaluation;
- election context;
- eligibility.

The actual election participation/ballot event remains election-process state at election resolution, as defined in `07`.

### Candidate hard invariant IM-11

**Preference and turnout-relevant state are distinct. Neither a preference projection nor turnout propensity is an actual cast ballot or election result.**

## 14. Political claims are artifacts, not belief mutation commands

A political actor may issue a claim such as:

```text
"Our housing program cut rents."
```

The claim artifact owns:

- who said it;
- what was said;
- when;
- audience/channel/access where represented;
- references to cited evidence where represented.

It does not own:

- whether rents actually fell;
- whether the program caused the change;
- whether the audience believed the claim;
- whether the audience credited the speaker;
- whether the claim changed votes.

Competing claims may coexist without one being promoted to canonical truth merely because it is politically successful.

### Candidate hard invariant IM-12

**Claims are canonical communicative artifacts with provenance. Their persuasive or political consequences occur through exposure and recipient-state processes; their success never makes the claim itself authoritative world truth.**

## 15. Forecasts and staff assessments

A forecast may be produced from:

```text
snapshot/as-of canonical inputs
+ assumptions/model
→ projection
```

If persisted for later actor use, it becomes an information artifact recording what was forecast at that time.

Forecast error is legitimate.

A forecast must not update itself into correctness after the future occurs. Later evaluation may compare forecast and outcome through a new projection/report/history relation.

Staff estimates of legislative support or electorate response follow the same rule.

### Candidate hard invariant IM-13

**A persisted forecast owns the historical fact that this estimate existed with these assumptions/as-of inputs. It does not own future state and must not be retroactively rewritten to match realized outcomes.**

## 16. Polls measure population political state

A poll is a measurement/artifact about population political state.

Conceptually:

```text
Population political state at T
+ sampling/measurement method
→ PollResult artifact
```

A poll may contain sampling error, coverage limitations, likely-voter assumptions, timing lag, or model error.

The poll does not become the underlying preference/belief/turnout state.

Showing the poll to the player does not mutate the electorate.

If publication of a poll affects people, that influence requires a separate exposure/belief/political-response process.

### Candidate hard invariant IM-14

**Polls measure population political state; they do not own it. Poll publication and poll-induced response, if represented, are separate causal events from the measurement itself.**

## 17. Revisions and conflicting artifacts

Information artifacts are persistent historical information objects.

If an official release is revised, the architecture should preserve:

- original release;
- revised release or revision relationship;
- relevant as-of/method metadata;
- release times;
- which recipients had access to which version where that distinction matters.

The old artifact remains historical truth about what was reported then.

The revised artifact does not erase the earlier political consequences that already occurred.

Different institutions/actors may possess conflicting reports or claims simultaneously.

### Candidate hard invariant IM-15

**Revision changes the information record through a new/revised artifact relationship; it does not erase prior publication/exposure history or retroactively update beliefs that were formed from the old information.**

## 18. Actor and player knowledge views are access projections

A political actor's decision process should receive an access-bounded information view, conceptually:

```text
KnowledgeView(actor, time)
  = authoritative records legitimately accessible
  + information artifacts accessible/received
  + actor-private memory/belief
  + supported direct observations
```

This is not a new canonical truth owner.

The GL0 player sees the information available through the controlled administration's supported decision surface and legitimate institutional access.

Debug state, hidden voter truth, inaccessible private actor state, and guaranteed future outcomes remain excluded.

### Candidate hard invariant IM-16

**Actor/player knowledge views are derived from canonical access, artifacts, records, direct observations, and recipient-owned belief/memory. They do not expose arbitrary canonical truth or become a second owner of what the actor knows.**

## 19. Information across succession

At ordinary succession:

- public artifacts remain public according to their state;
- institutional records remain with their institutional owner/access rules;
- transferable administration records may become accessible to the successor through ordinary ownership/access semantics;
- actor-private beliefs remain with the actor;
- outgoing campaign/private polling does not automatically transfer;
- population beliefs persist independently of officeholder change.

Control binding change itself creates no knowledge copy.

### Candidate hard invariant IM-17

**Succession changes information access only through ordinary ownership, transfer, institutional, and publication rules. It does not merge outgoing actor knowledge into successor knowledge.**

## 20. Minimum GL0 information fixture

The walking skeleton needs only enough information architecture to prove:

- actual housing conditions can change before an official report catches up;
- one official measurement/release has explicit as-of and release timing;
- one staff forecast can be wrong or uncertain;
- at least two competing political claims can reference the same underlying condition/artifact;
- population groups receive differentiated or delayed inputs where needed;
- belief and attribution can diverge from actual material truth;
- salience/preference/turnout-relevant state can respond without becoming direct policy modifiers;
- one poll measures political state rather than owning it;
- the player is strategically informed but not omniscient.

No media-company simulation is required.

## 21. Rejected shortcuts

Rejected:

```text
Report.value = HousingState.currentValue
```

as a live alias that silently changes after publication.

Rejected:

```text
publishedClaim -> populationBelief = claim
```

Rejected:

```text
materialSuccess -> incumbentCredit
```

Rejected:

```text
Poll.support = canonicalPopulationSupport
```

when the poll is intended to be an in-world measurement with method/error/as-of semantics.

Rejected:

```text
ActorKnowledge = CanonicalWorldState
```

Rejected:

```text
newAdministration.knowledge = oldAdministration.knowledge
```

as an automatic consequence of succession.

## 22. Commit-4 review questions for this document

Review should ask only whether the information/measurement/belief side is closed enough for GL0:

1. Are actual state, measurement, artifact, exposure/access, belief, attribution, salience, preference, turnout, and election behavior kept semantically distinct?
2. Can official data lag or be revised without changing material truth?
3. Can direct records/experience provide legitimate exact information without granting omniscience?
4. Do claims and forecasts remain provenance-bearing artifacts rather than causal truth owners?
5. Are population belief and actor belief owned by their recipients rather than the information environment?
6. Can material success receive little credit, and can messaging run ahead of delivery, without ownership shortcuts?
7. Can polling measure political state without writing back into it?
8. Does actor/player knowledge remain plausibly access-bounded, including across succession?

No information-system implementation and no Commit-5 design is authorized by this document.