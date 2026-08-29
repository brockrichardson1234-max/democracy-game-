# Living Country Step 10 — Historical Provenance and Causal Completeness Authority

Status: **ACCEPTED LIVING-COUNTRY STEP-10 DESIGN AUTHORITY, LIMITED TO THE COMMON HISTORICAL-PROVENANCE, CAUSAL-COMPLETENESS, BASELINE-INHERITANCE, GENERATED-BACKSTORY, HISTORY-COMPRESSION, AND CURRENT-STATE-RECONCILIATION CONTRACT.**

This receipt accepts the repaired Living Country Step 10 composite:

1. `53_LIVING_COUNTRY_HISTORICAL_PROVENANCE_CAUSAL_COMPLETENESS_CONTRACT.md`
   - original candidate;
   - candidate commit: `5a6f66e9cf93890f629363fe3a6e15d5be0497e2`;
2. `55_LIVING_COUNTRY_STEP10_FINAL_CONTRACT_REPAIR.md`
   - controlling repairs;
   - repair commit: `31a7f498b372364d277dc3da432b1050bc92fa87`.

Audit evidence:

- `54_LIVING_COUNTRY_STEP10_DETACHED_AUDIT.md`
  - audit commit: `c5adc7be11869d845cebd8db554eb0c8f7f2c642`;
  - verdict: **REVISE — 1 blocking finding, 4 bounded clarifications**;
- `56_LIVING_COUNTRY_STEP10_FINAL_BINARY_REAUDIT.md`
  - final audit commit: `686a9c3be7a3126ba058dbbaa0480bafc86be61c`;
  - verdict: **PASS** under the unchanged Step 10 gate.

Accepted authority beneath this receipt:

- Step 5 presidential-game authority;
- Living Country Step 1 ownership authority;
- Living Country Step 2 common material/social-domain grammar;
- Living Country Step 3 population/geography authority;
- Living Country Step 4 autonomous-actor participation authority;
- Living Country Step 5 internal-administration authority;
- Living Country Step 6 cross-domain coupling authority;
- Living Country Step 7 observation/measurement authority;
- Living Country Step 8 media/information/public-belief authority;
- Living Country Step 9 political-pressure/emergent-issue authority.

This is design authority only. It does not authorize implementation, schemas, event sourcing, final calibration dates or sources, generated-prehistory implementation, UI, Early Access scope, roadmap work, or a next code increment.

---

# 1. Precedence

Where the accepted Living Country Step 10 documents conflict:

```text
55_LIVING_COUNTRY_STEP10_FINAL_CONTRACT_REPAIR
→ controls
53_LIVING_COUNTRY_HISTORICAL_PROVENANCE_CAUSAL_COMPLETENESS_CONTRACT
```

`54` and `56` are audit evidence explaining why the candidate changed and why the repaired composite passed. They do not independently define product behavior.

---

# 2. Accepted central answer

Historical provenance is accepted conceptually as:

> **Causal completeness rather than chronological completeness: every load-bearing current fact, inherited obligation, historical claim, actor memory, and player-facing opening statement must either trace through owner-resolved occurrences and transformations to a declared provenance root, or remain explicitly modeled, bounded, disputed, unsupported, or unknown. A historically closed baseline may terminate causal recursion honestly; it may not fabricate a complete past, shadow-own the live world, excuse missing post-divergence causes, or grant actors knowledge they did not possess.**

The accepted broad relationship is:

```text
source material, configured primitive, or generated occurrence
→ versioned acquisition / generation / transformation activity
→ declared provenance root or canonical occurrence
→ current fact owned by the proper semantic owner
→ later owner-resolved transitions and cross-domain consequences
→ observations, records, beliefs, agendas, and decisions
→ current reconciled Living Country state
→ access-bounded historical and opening projections
```

The game does not need to simulate every event since 1789.

It does need every supported current fact and inherited political consequence to possess an honest causal stopping point and a reconciled relationship to the current world.

---

# 3. History is not automatically event sourcing

The accepted semantics require:

- one owner for every mutable current fact;
- one canonical identity for every retained historical occurrence family;
- immutable occurrence history;
- versioned source/generation provenance;
- deterministic continuation;
- current state and historical record remaining distinct.

They do not require the implementation to reconstruct the current world by replaying all history.

A future implementation may use:

- current state plus occurrence history;
- event sourcing and snapshots;
- domain ledgers;
- versioned historical bundles;
- another architecture satisfying the same authority.

A history store may not become a second owner of the present merely because it can describe earlier transitions.

---

# 4. Historical fact families remain distinct

The following may be connected but do not collapse:

## 4.1 Source material

An external or configured statute, code edition, regulation, opinion, official record, statistical source, map, archival source, configured primitive, or generation rule.

A source does not own the in-world fact initialized from it.

## 4.2 Acquisition/transformation activity

The versioned process that extracts, selects, normalizes, aggregates, maps, imputes, synthesizes, or models source material into a scenario artifact.

## 4.3 Baseline assertion or seed fact

A configured claim establishing opening state at a declared seam, with current owner, time, support, source/transformation, mutability class, and reconciliation obligations.

## 4.4 Canonical historical occurrence

One retained act, decision, transition, or event with one occurrence identity and time under its declared occurrence-family owner.

## 4.5 Current fact

The present law, office assignment, fiscal stock, program state, population, geography, material condition, actor state, evidence state, organization state, or other fact owned by its proper live owner.

## 4.6 Historical evidence/information artifact

What a report, poll, memo, filing, release, communication, or archived product said and when it existed.

## 4.7 Actor memory and institutional record

Purpose-bounded current state owned by the actor, office, or institution. An occurrence does not automatically become remembered or officially known.

## 4.8 Historical projection or narrative

A biography, timeline, inauguration briefing, State-of-the-Nation history, causal explanation, issue history, or administration record derived from accessible facts.

The projection may summarize.

It may not invent missing history or become the owner of the facts it describes.

---

# 5. Four provenance-root classes

Every load-bearing current fact or historical claim must trace to at least one declared root or remain explicitly unsupported/unknown.

The accepted root classes are:

1. **Baseline-inherited**
2. **Generated backstory**
3. **Forward-generated prehistory**
4. **Player-era**

Root class describes where causal recursion ends **inside one run**.

It does not by itself determine:

- external evidentiary quality;
- canonical truth status;
- actor knowledge;
- player access;
- confidence;
- exactness.

## 5.1 Baseline-inherited

Historically closed state inherited at the configured seam, potentially including:

- constitutional and institutional order;
- states and offices;
- laws and programs;
- opening population and geography;
- fiscal balances and obligations;
- material/social conditions;
- ongoing cases, contracts, measurements, programs, terms, and projects;
- international obligations.

A baseline root may be direct, aggregated, modeled, approximated, or otherwise support-classified.

It does not require simulation of every historical cause before the seam.

## 5.2 Generated backstory

Synthetic background established before forward prehistory to reconcile generated actors, organizations, relationships, careers, and contextual priors with the inherited world.

It is true inside the generated world when accepted by generation.

It is not real-world history.

Its admissibility is restricted by Section 9.

## 5.3 Forward-generated prehistory

Owner-resolved history produced after the divergence boundary and before player control, potentially at lower/adaptive resolution.

It may include elections, administrations, laws, appointments, implementation, fiscal change, conditions, courts, organizations, media/public history, and the player's campaign history.

## 5.4 Player-era

Owner-resolved facts and occurrences after active player control begins.

The player's action is one cause among many and does not pre-resolve downstream outcomes.

---

# 6. Provenance-chain and termination contract

A load-bearing historical chain should identify, where applicable:

```text
provenance root
→ source/configuration/generation activity
→ initialized fact or canonical occurrence
→ owner-resolved transition
→ cross-domain handoff
→ receiver-owned consequence
→ observation/evidence
→ actor receipt and interpretation
→ later action, memory, or current state
```

Not every fact requires every stage.

## 6.1 Root declaration

A root must be able to establish, where relevant:

- root class;
- resulting semantic owner;
- fact/occurrence family;
- effective/as-of interval;
- source, generation rule, or configured primitive;
- transformation/version;
- support and uncertainty;
- geography/population/entity scope;
- divergence relation;
- retention consumers;
- access and actor/player-knowledge implications.

These are semantic obligations, not one mandatory schema.

## 6.2 Legitimate termination

Causal recursion may end at a baseline-inherited or admissible generated-backstory root when the root supports the current fact at the resolution later systems consume and does not conceal a required post-divergence occurrence or process.

Example:

```text
current Social-Security-like obligation
→ inherited legal/program/fiscal state
→ baseline-inherited root
→ historical enactment provenance
```

No original-roll-call replay is required.

By contrast:

```text
current dispute
→ generated post-divergence healthcare law
```

must retain the generated legislative, fiscal, implementation, legal, evidence, and political history that current play consumes.

## 6.3 Consumer-bounded depth

Historical depth is required where current systems need it.

Examples:

- a current tax rate may need operative legal provenance but not every negotiation;
- a remembered betrayal needs the promise/action/receipt/memory chain;
- an active case needs parties, standing, filing, forum, order, and current scope;
- a public reputation attributed to performance needs the relevant conduct, evidence, distribution, and recipient response at retained resolution.

## 6.4 No infinite regress

The game does not have to explain why the Constitution, a state, a preexisting program, or the opening population existed before the accepted historical boundary.

The terminal root still declares what was inherited, when, from which authority/source family, and with what support.

## 6.5 Multiple causes

A current fact may have several causes.

Known contribution, overlap, alternative explanation, uncertainty, and residual must remain explicit where consequential.

History cannot choose one convenient cause solely because it produces cleaner prose.

---

# 7. Historically closed baseline

A scenario baseline is closed against a declared source/configuration policy.

After initialization:

- later real-world officeholders do not enter the run;
- later real laws or regulations do not overwrite the run;
- later statistics do not update the world automatically;
- later geographic revisions do not replace maps automatically;
- later political events do not become the run's history.

A later source package may create a new scenario/configuration version.

It does not mutate an existing run.

## 7.1 Baseline manifest

A later baseline package should declare, where applicable:

- scenario/configuration identity and version;
- world seam/divergence boundary;
- source-compilation cutoff;
- source/artifact inventory;
- checksums and transformations;
- support/mapping classes;
- temporal and geographic vintages;
- legal/institutional authority references;
- initialization/reconciliation rules;
- approximations, gaps, and deferred facts;
- generated-content boundary;
- generation identity/seed where applicable.

## 7.2 Initialization handoff

A source or seed initializes the proper semantic owner once.

After the seam, only that owner and accepted transitions may change the fact.

A source artifact never remains an invisible live feed.

## 7.3 Snapshot is not history

An opening snapshot may establish that a program, balance, office, obligation, population, or condition exists without fabricating every prior vote, payment, meeting, receipt, or actor memory.

Unrepresented prior events remain unavailable as exact history.

## 7.4 In-world exactness versus external support

A modeled or synthetic opening allocation may become the one canonical allocation inside the simulated world.

Its provenance still records that it was modeled rather than directly observed from real history.

Actor and player knowledge remain separately governed.

---

# 8. Three historical clocks

The accepted contract distinguishes:

1. **world-state/divergence seam**;
2. **external source-compilation cutoff**;
3. **in-world evidence/actor-knowledge availability**.

These dates may differ.

A later-published source may be used retrospectively to improve an estimate of hidden state at the seam only when:

- its reference period and publication time are preserved;
- post-seam occurrences are not imported as already completed;
- it is not granted to earlier actors;
- decisions before release do not consume it;
- uncertainty and transformation are declared;
- no actual future outcome leaks into actor decisions or generated behavior.

Thus:

```text
retrospective source improves hidden opening estimate
≠ actors possessed that source at the opening
≠ source may determine their intervening decisions
```

Legal source/effectiveness dates, statistical reference/release dates, geographic vintages, and archival/source-compilation dates remain separately meaningful.

---

# 9. Generated-backstory admissibility and freeze

Generated backstory is a bounded initialization root, not a historical repair layer.

The required conceptual order is:

```text
source/configuration package fixed
→ inherited baseline constructed
→ generated actors/backstory constructed and reconciled
→ backstory package versioned and frozen
→ forward prehistory generated
→ one valid opening selected
→ player era begins
```

An implementation may optimize this order without crossing its causal information barrier.

## 9.1 Temporal boundary

A backstory root may cover only facts whose effective origin lies at or before its declared boundary.

Facts created or materially changed afterward belong to forward prehistory or player-era history.

Backdating does not change root class.

## 9.2 Bare-root admissibility

A synthetic background fact may terminate at a bare backstory root only when:

- its synthetic status is explicit;
- no supported consumer requires a specific causal occurrence;
- it creates no occurrence-dependent legal, fiscal, material, procedural, evidentiary, or institutional consequence;
- it does not falsely attribute a real individual's act;
- support, owner, knowledge, explanation limits, and deepening policy are declared.

Potentially admissible bounded roots include:

- identity, age, birthplace, education, profession, and career family;
- broad ideology or temperament;
- non-event-specific familiarity, affinity, distrust, or kinship;
- broad prior reputation whose synthetic status is explicit;
- organization mission, constituency, or culture;
- a preexisting interest whose detailed origin is outside supported history.

## 9.3 Occurrence-required facts

A compressed or full generated occurrence/activity chain is required for a load-bearing:

- election, appointment, assignment, vote, law, ruling, order, payment, or program act;
- promise, bargain, commitment, threat, endorsement, betrayal, favor, or concession;
- relationship change caused by specific conduct;
- memory of a specific event;
- reputation, blame, credit, or competence judgment attributed to historical performance/evidence/communication;
- organization right, resource, obligation, liability, or expectation created by action;
- legal, fiscal, material, procedural, evidentiary, or political consequence.

The chain may be compressed.

It may not be replaced by a trait.

## 9.4 Root admission

Every load-bearing backstory fact must be able to state:

- current owner;
- admission category;
- effective interval;
- generation package/version;
- generation order;
- institutional/geographic/population constraints;
- support and uncertainty;
- actor/player knowledge;
- consumers;
- historical statements permitted and prohibited;
- deepening policy.

## 9.5 No root laundering

A forward-generated or player-era fact may not become backstory through compression, migration, relabeling, or reconciliation.

If a new backstory package is required, it creates a new candidate world that must be regenerated or explicitly migrated before selection.

---

# 10. Generated fictional actors and real institutional history

Pre-divergence real institutional history may remain institutionally attributed.

It may not be assigned to fictional generated individuals without valid generated history.

Valid:

```text
Congress enacted Program P before divergence.
```

Invalid without generated support:

```text
Fictional Senator Ellis cast the real decisive 2024 vote.
```

A generated actor may possess synthetic:

- identity and career;
- offices and electoral history;
- faction/party relationships;
- organization membership;
- public positions;
- relationships and memories;
- reputation and issue association.

When those facts depend on a particular act or procedure, the required generated occurrence route applies.

Every generated human also remains subject to the accepted one-population and actor-population-linkage contracts.

No biography may create extra population weight, exact household history, exact material experience, or exact information receipt unsupported by the linkage.

---

# 11. Divergence seam and ongoing processes

The seam is not a reset.

An opening world may inherit:

- law enacted but not yet effective;
- fiscal authority and outstanding obligations;
- contracts and awards;
- active rulemaking or agency queues;
- ongoing litigation and orders;
- current offices and remaining terms;
- election processes underway;
- projects in progress;
- unfinished investigations;
- measurement periods partly captured;
- embargoed, privileged, or classified records;
- organization commitments;
- external obligations.

Every load-bearing process crossing the seam identifies:

- inherited pre-boundary state;
- future transition or condition;
- proper live owner;
- current obligations and access;
- post-boundary outcomes still unresolved.

Examples:

```text
law enacted before seam
+ effective date after seam
→ inherited legal source
→ future effectiveness resolved by legal owner
```

```text
obligation exists before seam
+ payment due later
→ inherited obligation
→ payment/execution resolved later by fiscal owner
```

```text
measurement interval straddles seam
→ valid pre-seam captured evidence inherited
→ later capture/processing/release remains measurement-owned
```

An inherited future state is not a completed future outcome.

---

# 12. Forward-generated prehistory

Generated prehistory may use lower, adaptive, or selectively detailed resolution.

It must preserve the same accepted:

- ownership;
- authority;
- actor autonomy;
- information access;
- evidence chronology;
- cross-domain causality;
- accounting;
- population/geography support;
- temporal ordering;
- historical identity.

It need not simulate every daily memo or minor contact.

It may not directly assign the desired opening world.

## 12.1 Load-bearing process examples

Where later play consumes the result, compressed prehistory may need:

- separately resolved elections and office assignments;
- appointments, vacancies, and turnover;
- party/faction evolution;
- major laws and remembered failures;
- fiscal trajectories and obligations;
- administration/program implementation;
- state participation and conflict;
- material/social conditions;
- court proceedings and consequences;
- organization development;
- evidence vintages and public memory;
- shocks/external developments;
- campaign and mandate formation.

## 12.2 Compressed ownership

A compressed law still needs an eligible proposal/initiation, procedure, autonomous support/opposition, resolution, presentment/enactment or failure, terms, and dates.

A compressed appointment still needs office/vacancy, candidate, procedure, and assignment.

A compressed program still needs authority, funding, administrator, participation, implementation, and surviving obligations.

A compressed court outcome still needs parties/claim, forum, decision/order, and operative scope where current play consumes them.

## 12.3 Resolution deepening

Prehistory deepens where needed by:

- consequential actor identity;
- close/contested result;
- persistent relationship or memory;
- legal/fiscal provenance;
- geographic/population distribution;
- evidence at decision time;
- active current dispute;
- accountability;
- opening explanation.

Deepening cannot manufacture exact detail unsupported by the earlier resolution.

## 12.4 Forward causality

History must arise from earlier state and eligible owner processes.

A desired opening cannot be reverse-engineered into convenient past actors, scandals, laws, appointments, and crises unless those causes were genuinely resolved in the selected candidate world.

## 12.5 Shocks

Configured shocks may initiate history when their source family, eligibility, time, scope, and downstream resolution are declared.

They do not carry pre-resolved domestic effects.

## 12.6 Selection

One generated history becomes canonical for one run.

Rejected worlds, forecasts, counterfactuals, and reload branches do not enter that history.

A generator may reject invalid or out-of-scope worlds through declared criteria.

It may not secretly select the most dramatic world through a story score.

---

# 13. Complete contribution and root coverage

A composite current fact must reconcile across the complete semantic basis required by its owner at the accepted resolution.

One convenient root is insufficient.

Where accounting applies:

```text
opening stock/root
+ inflows
- outflows
± transfers
± revaluations/reclassifications
± modeled residual/uncertainty
= current stock
```

Population may require opening stock, births, deaths, immigration, emigration, and internal redistribution.

A current program may require authority, amendments, funding, administrator, rules, obligations, participation, and constraints.

The root need not explain every microscopic physical cause.

It must cover the semantic contribution basis, including unresolved residuals.

Step 6 contribution-lineage, overlap, transfer, gross/net, reversal, and accounting authority remains controlling.

---

# 14. Occurrences, bundles, aggregates, and summaries

The accepted taxonomy distinguishes:

## 14.1 Canonical occurrence

One retained act, event, decision, or transition capable of supporting exact identity-based references.

## 14.2 Compressed process bundle

A bounded interval/set of activity with declared owners, period, counts/flows, selected occurrences, outputs, obligations, uncertainty, and omissions.

One bundle ID does not make the bundle one occurrence.

## 14.3 Aggregate quantity

A count, flow, stock, rate, or distribution under declared units, universe, geography, and period.

It does not establish every constituent identity or sequence.

## 14.4 Historical summary projection

A read-only interpretation over history and current state.

It cannot become an exact event source.

A specific memory, promise, receipt, notice, relationship change, deadline, or accountability claim requires a retained occurrence or another target supporting that exact relationship.

A bundle cannot later be unpacked into invented events.

---

# 15. Opening-world reconciliation

Before a generated world can be presented as valid, every load-bearing current fact must reconcile with its roots, occurrences, owner state, identities, units, time, geography, outstanding process, and evidence history.

The gate includes, where supported:

## 15.1 Offices and elections

- office existence and terms;
- vacancies and acting service;
- election/certification;
- entitlement and assignment;
- succession;
- separate House, Senate, Presidential, state, and other results;
- exclusive officeholder intervals.

## 15.2 Law and legal state

- source law and current codification;
- enactment/effective dates;
- amendments/supersession;
- regulations/orders;
- current scope;
- cases, stays, and contested interpretations.

## 15.3 Fiscal state

- opening balances;
- authority and availability;
- receipts/outlays;
- obligations/payments;
- debt and service;
- transfers/reversals;
- accounting basis;
- residual/uncertainty.

## 15.4 Population and geography

- people and households;
- demographic transitions;
- migration and residence;
- geographic identity/vintage;
- electoral/service relationships;
- redistricting/reapportionment when required;
- generated-actor weight reconciliation.

## 15.5 Programs, administration, and material state

- authority, rules, administrator, queues, cases, contracts, obligations, state/recipient relationships, projects, stocks, pipelines, and deadlines;
- implementation between law and material outcome.

## 15.6 Evidence and political state

- measurement/source vintages;
- releases, receipts, access, corrections, and revisions;
- actor/public knowledge and memory;
- issue and agenda history;
- party/organization reputation and relationships;
- no retroactive knowledge.

## 15.7 Failure

A contradictory world is rejected, owner-respectingly regenerated/migrated before selection, or retained as unresolved only where uncertainty is legitimate.

Presentation cannot hide a contradiction.

---

# 16. Owner-respecting generation repair

A failed candidate world may be:

- rejected and regenerated;
- resumed from a valid checkpoint through owner-resolved transitions;
- regenerated from a versioned baseline/backstory package;
- explicitly migrated while preserving owners, identities, occurrences, times, and contribution lineage;
- left unresolved where the abstraction permits uncertainty.

It may not be fixed by directly editing a consequential owner result while retaining incompatible history.

Examples of invalid repair:

```text
election result conflicts with assignment
→ edit assignment only
```

```text
outlays do not reconcile
→ change one total without payment history
```

```text
actor memory lacks event
→ add backdated note
```

A valid repaired candidate receives a new candidate identity/version and is revalidated.

The abandoned candidate remains noncanonical.

---

# 17. Current state does not imply one history

Equal current aggregates can arise through different histories.

Two worlds may have the same unemployment and debt while differing in:

- recent shocks;
- tax/spending path;
- promises and betrayals;
- outstanding obligations;
- actor relationships;
- public attribution;
- legal precedent;
- party/faction reputation;
- program constituency;
- evidence history.

Current state constrains possible history.

It does not license one exact inverse reconstruction.

When exact history was not retained, the answer remains modeled, bounded, unresolved, or unknown.

---

# 18. Evidence-at-time and actor knowledge

World history, evidence history, and knowledge history remain separate.

A later statistical revision, court ruling, investigation, declassification, confession, or correction may improve current knowledge.

It does not rewrite:

- the underlying earlier occurrence;
- the original artifact;
- the earlier recipient's evidence set;
- the earlier belief;
- the earlier decision.

A developer/audit provenance graph does not grant player access.

Player-facing history is limited by public/institutional records, current office access, privilege/classification, source protection, archival access, and actual discovery.

An event may be exact while its motive or private deliberation remains unknown.

Outcome does not prove motive.

---

# 19. Missing, disputed, modeled, and unknown history

Missing record is not automatically zero activity unless the recording system is complete for that fact family.

Historical sources may disagree because of:

- legal status;
- time/vintage;
- universe/geography;
- preliminary versus revised evidence;
- accounting or measurement basis;
- genuine dispute or error.

The baseline/generator preserves the selected treatment, support, source status, and unresolved residual.

A simulated world may need one exact generated current fact despite uncertain real evidence.

Its in-world exactness does not transform the external source into exact real history or grant actors exact knowledge.

---

# 20. Historical retention and compression

Retention is consumer-driven rather than universally exhaustive or age-based.

Consumers may include:

- current rights, law, fiscal/material state, obligations, and processes;
- actor/organization relationships and memory;
- evidence at historical decisions;
- cases, programs, contracts, queues, and deadlines;
- elections and office legitimacy;
- issue/party/faction inheritance;
- opening briefing and causal explanation;
- accountability and presidential record;
- deterministic continuation.

A later implementation may maintain current state, active history, permanent occurrences, evidence artifacts, compressed bundles, aggregates, summaries, and discardable detail.

Compression is valid only if it preserves all later-required:

- quantities/accounting;
- identities/relationships;
- rights/obligations;
- times/deadlines;
- population/geography support;
- evidence/knowledge history;
- memories and commitments;
- political lineage;
- uncertainty and omissions.

Compression cannot:

- merge distinct actors needed later;
- erase a current right or obligation;
- lose what evidence an actor possessed;
- destroy contribution lineage;
- invent exact detail when later expanded;
- convert a failed promise into no history;
- change root class;
- inspect hidden future decisions or random events to decide retention.

A summary remains a projection.

---

# 21. Versioning, corrections, migration, and counterfactuals

## 21.1 Scenario versions

Source or transformation corrections before release create new package versions.

Once play begins, the run remains pinned.

## 21.2 Migration

A save migration affecting historical/current state must preserve or explicitly transform identities, owners, occurrences, roots, times, consequences, access, support, and uncertainty.

It may not insert convenient historical politics to support new content.

## 21.3 In-world correction

A revised statistic, court reversal, audit, declassification, correction, or retraction creates new history.

It does not erase the original artifact or action.

## 21.4 Counterfactuals

Forecasts, alternate generated worlds, rejected candidates, reload branches, and staff scenarios are not the current run's history.

They remain separate artifacts, saves, tests, or developer evidence.

No rejected-world fact may leak into the selected run.

---

# 22. Opening presidency and historical explanation

A later assumption-of-office briefing may derive:

- President, predecessor, and term identity;
- prior election and mandate interpretations;
- House/Senate composition and leadership;
- current laws, programs, appointments, cases, obligations, and implementation;
- fiscal/material/social conditions and trends;
- political issues and agendas under declared lenses;
- crises, opportunities, deadlines, and commitments.

Every load-bearing statement must be able to identify:

- current fact or occurrence;
- root class;
- semantic owner;
- source/generation/transformation lineage;
- time and geography;
- support/uncertainty;
- administration access;
- whether the statement is fact, evidence, assessment, claim, or interpretation.

The presentation may summarize and explain.

It may not create the history.

The preferred direction remains generated rather than canned narrative.

A causal statement may appropriately say:

> The campaign emphasized Housing costs and won narrowly in several fast-growing states; polling and campaign records provide incomplete evidence about how decisive that issue was.

It should not say:

> You won because Housing was bad.

unless the causal support genuinely warrants that conclusion.

---

# 23. Accepted adversarial proofs

At design-contract level, the accepted composite supports:

1. an inherited century-old program with current obligations and no full original replay;
2. a pre-seam law becoming effective after the seam through live owner resolution;
3. a fictional senator in a real institution without fabricated real roll calls;
4. a generated post-divergence healthcare law retaining the causes current play consumes;
5. a later evidence revision changing current understanding without rewriting earlier decisions;
6. equal current aggregates with different political inheritance;
7. a serious historical condition remaining politically quiet until later evidence/organization;
8. geographic vintages and historical elections remaining correctly related;
9. compressed administration/program history preserving unfinished work and successor access;
10. rejection of a desired opening backsolved through convenient causes;
11. a general synthetic affinity surviving as bounded background while a specific betrayal requires an occurrence;
12. source compilation after the seam improving hidden baseline estimation without leaking actor knowledge.

These are paper contract proofs, not generated-world output.

---

# 24. Accepted anti-cheat requirements

Step 10 rejects:

- complete chronology as a prerequisite for every baseline fact;
- baseline sources shadow-owning live state;
- later real-world events updating a running scenario;
- snapshots masquerading as complete event logs;
- source publication time aliasing effective or actor-knowledge time;
- fictional actors inheriting real persons' acts;
- generated actors receiving office legitimacy without required route;
- generated backstory patched after forward outcomes are known;
- forward/player-era facts reclassified as backstory;
- specific promises, betrayals, memories, or reputations represented as consequence-free traits;
- post-divergence laws/programs/cases inserted as unexplained baseline;
- straddling processes containing future outcomes;
- one root reference standing in for an unreconciled composite state;
- current aggregates implying one exact history;
- later evidence becoming earlier knowledge;
- missing records proving zero without completeness;
- bundles becoming individual occurrences;
- summaries becoming current owners;
- compression erasing rights, obligations, identities, evidence-at-time, or actor memory;
- compression fabricating exact history later;
- retention peeking at future player actions or randomness;
- candidate worlds patched by editing owner outputs;
- rejected generator branches contaminating selected history;
- hidden dramatic world selection;
- opening narrative filling causal gaps with certainty;
- two authoritative occurrence records for the same event;
- historical replay becoming a second present-state owner;
- calibration corrections silently mutating saves;
- developer provenance becoming player omniscience.

---

# 25. Research grounding

The accepted design inference is consistent with bounded lessons from:

- W3C PROV's distinction among entities, activities, agents, derivations, responsibility, time, and provenance bundles;
- GovInfo and OLRC distinctions among enacted source law, the United States Code, positive-law status, editions, and historical legal authority;
- CFR/eCFR distinctions among official publication, continuously updated codification, effective state, and historical versions;
- NARA records lifecycle, originating context, retention/appraisal, selective permanent preservation, presidential records transfer, and institutional continuity;
- Census geography-vintage documentation.

These sources do not select a calibration date, source package, runtime schema, or generated-history method.

Reference sources include:

- https://www.w3.org/TR/prov-dm/
- https://www.govinfo.gov/help/uscode
- https://uscode.house.gov/about_code.xhtml
- https://www.govinfo.gov/features/statute-compilations
- https://www.ecfr.gov/
- https://www.archives.gov/records-mgmt/sch-appraisal
- https://www.archives.gov/records-mgmt/scheduling/nara-review
- https://www.archives.gov/presidential-records/support-to-the-white-house/presidential-transitions
- https://www.archives.gov/presidential-records/research/archived-white-house-websites
- https://www.census.gov/programs-surveys/acs/geography-acs/geography-boundaries-by-year.html

---

# 26. Explicitly not accepted

This authority does not decide or prove:

1. final calibration/divergence date;
2. January 2025 or January 2033;
3. final source-compilation cutoff;
4. final source inventory or factual dataset;
5. exact baseline manifest or runtime schema;
6. exact extraction, mapping, synthesis, source-priority, or reconciliation algorithms;
7. exact real-person versus fictional-person policy;
8. exact generated biography, relationship, memory, or reputation model;
9. exact prehistory simulation/generation algorithm;
10. exact generation seeds, conditioning, rejection, or variation criteria;
11. exact shock inventory;
12. exact historical storage, event-sourcing, snapshot, ledger, or replay architecture;
13. exact retention, compaction, archive, summary, or save-size strategy;
14. exact migration policy;
15. exact opening narrative or historical UI;
16. final State-of-the-Nation, Record, timeline, or dossier interface;
17. historical-scenario scope;
18. final domain inventory or depth tiers;
19. generated-prehistory proof;
20. Early Access scope;
21. roadmap, implementation order, or next code proof;
22. historical plausibility, content quality, performance, comprehensibility, balance, fun, or commercial viability.

---

# 27. Step 10 verdict

## **ACCEPTED**

The Step 10 question is answered at design-contract level:

> **The Living Country can inherit a historically closed United States without simulating its entire chronology, attach generated actors without false attribution, continue ongoing state across a divergence seam, generate later history at lower resolution, preserve evidence and knowledge as they existed at the time, compress non-load-bearing detail, and reconcile the opening world—provided every consequential fact terminates at an admissible root or traces through owner-resolved history, and no generator, baseline, summary, migration, or presentation invents missing causes.**

This acceptance establishes the historical-provenance and causal-completeness constitution.

It does not prove any particular historical calibration or generated world.

---

# 28. Next authorized Living Country question

The next phase may ask:

> **Which historically closed calibration seam best supports the first modern United States game—balancing institutional and legal cleanliness, source availability, recognizability, generated-actor attribution, amount of prehistory, geography/redistricting burden, fiscal and material reconciliation, scenario longevity, and protection from later real-world developments—without choosing a date merely because it is convenient or pretending that generated prehistory already works?**

This authorizes Living Country **Step 11 — Historical Calibration-Seam Assessment** as design assessment only.

Step 11 may:

- compare a bounded set of candidate divergence/baseline seams;
- distinguish world-state seam, source-compilation cutoff, and actor-knowledge time;
- assess institutional, election, legal, fiscal, population, geography, media, and generated-actor burdens;
- test whether an early-2025 seam is actually superior to nearby alternatives;
- recommend a leading seam or reject all current candidates;
- define what remains conditional on the later generated-prehistory proof.

Step 11 may not:

- implement or claim to prove generated prehistory;
- choose final calibration datasets or build the data package;
- authorize January 2033 merely because one seam is preferred;
- design final UI;
- define Early Access scope;
- create a roadmap or next code proof;
- modify runtime, schema, source, configuration, test, or production files.