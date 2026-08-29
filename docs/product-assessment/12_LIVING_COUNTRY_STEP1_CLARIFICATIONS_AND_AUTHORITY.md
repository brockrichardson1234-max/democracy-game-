# Living Country Step 1 — Clarifications and Authority

Status: **ACCEPTED LIVING-COUNTRY STEP-1 DESIGN AUTHORITY, LIMITED TO LAYER AND FACT OWNERSHIP.**

This receipt accepts `11_LIVING_COUNTRY_LAYER_OWNERSHIP_CONTRACT.md` subject to the two controlling clarifications below.

Authority chain:

- Accepted Step 5 presidential-game authority: `2c5fc2d798c5fcc232b519052390b56d60f06267`
- Living Country Step 1 candidate: `4fc5c340831ffe5b934e6b7f31956924bf8d54f0`
- Step 1 review verdict supplied for this authority action: **PASS WITH 2 BOUNDED CLARIFICATIONS**

This document does not accept a country-state grammar, population implementation, domain inventory, depth tiers, media model detail, historical calibration date, generated-prehistory output, UI, Early Access scope, roadmap, runtime, schema, or implementation order.

Where this document conflicts with `11`, this document controls.

---

# 1. Clarification: one canonical occurrence identity

## 1.1 Core invariant

**[HARD INVARIANT LC-H01] Every historical occurrence has exactly one canonical occurrence record and identity.**

Current domain or procedure state may reference that occurrence. Projections, biographies, actor memories, workstreams, indexes, and audit views may reference or summarize it. None may independently own a second mutable assertion that the same occurrence happened.

Forbidden:

```text
HistoricalRecord.vote-123 = occurred
LegislativeProcedure.history.vote-123 = occurred-but-different
```

Required:

```text
one canonical occurrence identity
→ zero or more references, indexes, projections, or memories
```

## 1.2 Permitted ownership patterns

A historical occurrence family must select one of two semantic ownership patterns.

### Pattern A — HistoricalRecord-owned occurrence

`HistoricalRecord` owns the canonical occurrence identity and immutable occurrence facts.

A domain or procedure may retain:

- current procedural state;
- references to the occurrence;
- indexes for efficient lookup;
- derived summaries;
- domain-specific current consequences.

It may not maintain a separately authoritative duplicate occurrence.

### Pattern B — Domain/procedure-owned occurrence

A domain or procedure record owns the canonical occurrence identity because the occurrence is inseparable from that domain’s persistent process record.

`HistoricalRecord` then provides only:

- an index/reference;
- cross-domain navigation;
- a projection or catalog;
- no duplicate authority over whether or how the occurrence happened.

## 1.3 Selection rule

**[HARD INVARIANT LC-H02] Occurrence ownership is declared by occurrence family according to semantic meaning, not selected ad hoc per instance or storage convenience.**

Examples of occurrence families may include:

- legislative votes;
- proposal introduction;
- enactment;
- payments;
- material milestones;
- measurement releases;
- public claims;
- election certification;
- office transfer;
- judicial orders.

A later architecture or implementation decision may choose Pattern A or Pattern B for a family. It must document the choice and preserve it consistently.

Changing the owner later requires an explicit migration preserving:

- canonical occurrence identity;
- timestamp and provenance;
- references;
- ordering relationships;
- current-state consequences;
- absence of duplicate authority before and after migration.

## 1.4 Current-state separation

The occurrence record owns that the event happened.

The current fact remains owned separately.

Examples:

- a vote occurrence does not own the actor’s current preference;
- an election result does not own the current office assignment;
- a payment occurrence does not own the current treasury balance;
- a project completion occurrence does not own current Housing stock by itself;
- a report release does not own current measured or material truth.

---

# 2. Clarification: artifact access, publication, distribution, delivery, and exposure

## 2.1 Artifact-owned facts

**[HARD INVARIANT LC-I01] An information artifact owns only its own informational identity and intrinsic properties.**

These may include:

- identity/type;
- content;
- author/producer/source references;
- referent references;
- creation time;
- observation/as-of time;
- release time when a release occurrence has happened;
- provenance and method;
- uncertainty/error metadata;
- revision or supersession lineage;
- intrinsic access classification, such as public, classified, privileged, embargoed, subscription-limited, or source-restricted where represented.

The artifact does not own:

- the underlying fact;
- an actor’s decision to publish or distribute it;
- realized audience availability;
- delivery or exposure occurrence;
- recipient notice, memory, trust, belief, attribution, salience, preference, or turnout;
- political or electoral outcomes.

## 2.2 Actor/institution-owned publication and distribution attempts

Media organizations, journalists, agencies, courts, campaigns, platforms, political actors, or other eligible owners decide whether and how to:

- publish;
- release;
- brief;
- leak;
- transmit;
- recommend;
- amplify;
- suppress within their lawful/operational authority;
- correct;
- retract or qualify through a new occurrence/artifact relationship.

Those are actor or institutional attempts with their own provenance.

A story object does not publish itself.

## 2.3 InformationEnvironment-owned realized availability and delivery

**[HARD INVARIANT LC-I02] `InformationEnvironment` owns realized availability, channel delivery, and exposure-occurrence records where the simulation represents them.**

Examples:

- an artifact became publicly available through an outlet at time T;
- an agency delivered a confidential memo to an authorized office;
- a platform presented a story to a defined audience segment;
- a local broadcast reached a geographic audience;
- a subscriber feed delivered an artifact to an eligible recipient class.

These records do not determine that the recipient noticed, understood, trusted, remembered, or believed the artifact.

## 2.4 Recipient-owned incorporation

PopulationState, PoliticalActor state, or a genuine organization-recipient owner determines:

- notice/attention;
- retention/memory;
- trust;
- interpretation;
- belief;
- attribution;
- salience;
- preference;
- turnout disposition;
- later action.

Publication, distribution, availability, delivery, notice, belief, and action remain distinct.

## 2.5 Corrected ownership chain

```text
artifact content/provenance/classification
    owned by artifact

publication/distribution attempt
    owned by acting journalist/outlet/platform/institution

realized availability/delivery/exposure occurrence
    owned by InformationEnvironment

notice/trust/belief/attribution/salience
    owned by recipient

poll
    measurement artifact about recipient-owned political state

election
    electoral process resolving authority
```

## 2.6 Revisions and corrections

A correction, qualification, or retraction creates a new occurrence and/or artifact relationship.

It does not:

- erase the original artifact;
- erase prior availability or delivery;
- rewind recipient belief;
- delete political actions already taken;
- rewrite the underlying fact.

---

# 3. Corrected Step 1 ownership-matrix entries

The ambiguous entries in `11` are replaced for authority purposes by:

| Fact | Canonical owner | Permitted non-owners | Explicitly not the owner |
|---|---|---|---|
| Historical occurrence identity/facts | Declared once by occurrence family: `HistoricalRecord` **or** the relevant persistent domain/procedure record | the other location may index/reference; biographies, workstreams, projections, memories | any separately mutable duplicate occurrence record |
| Artifact content/provenance/timestamps/revision/intrinsic access classification | Information artifact | actors, UI, archives, measurements, projections may reference | underlying referent, publication attempt, recipient belief |
| Publication/distribution attempt | acting journalist/outlet/platform/institution | artifact and InformationEnvironment reference the attempt | artifact by itself, population belief |
| Realized availability/delivery/exposure occurrence | InformationEnvironment | recipient processes and projections consume | outlet’s belief, recipient belief, election |
| Notice/retention/trust/belief/attribution/salience | recipient owner | polls and decisions measure/consume | artifact, outlet, platform, poll |

---

# 4. Step 1 accepted scope

The accepted Step 1 composite is:

```text
12_LIVING_COUNTRY_STEP1_CLARIFICATIONS_AND_AUTHORITY
→ controls
11_LIVING_COUNTRY_LAYER_OWNERSHIP_CONTRACT
```

Within this scope, the following are accepted:

- the four Living Country layers are conceptual views, not new god objects;
- fact-level semantic ownership remains controlling;
- material/social reality, institutional action, information/public politics, and historical/calibration provenance remain distinct but interacting;
- media organizations and journalists are autonomous actors;
- stories, claims, evidence, reports, corrections, and polls are information artifacts;
- publication/distribution attempts, realized delivery/exposure, recipient belief, polling, elections, and office assignment remain separately owned;
- there is one canonical ordinary population identity/weight/residence/political representation;
- domains may associate facts with that population without duplicating it;
- calibration initializes canonical state and does not remain a shadow live owner;
- generated actors may not falsely inherit real pre-divergence personal acts;
- workstreams, political issues, State of the Nation, dossiers, and dashboards remain projections;
- player-visible records remain access-bounded and distinct from developer/audit truth;
- every historical occurrence has one canonical occurrence identity.

---

# 5. Explicitly not accepted

This receipt does not accept:

- a universal material-domain schema;
- the final semantic owner for every future occurrence family;
- the final durable-domain inventory;
- population/cohort implementation;
- geographic resolution;
- cross-domain coupling formulas;
- media-market depth;
- exact exposure algorithms;
- exact historical calibration date;
- January 2033 as final start;
- generated-prehistory proof;
- State-of-the-Nation UI;
- six-surface UI authority;
- Early Access scope;
- implementation sequence or next code proof.

---

# 6. Step 1 verdict

## **ACCEPTED WITH CONTROLLING CLARIFICATIONS**

The Step 1 question is answered:

> Every major class of Living Country fact can retain a non-overlapping semantic owner while material conditions, institutions, journalism, distribution, recipient belief, elections, history, calibration, and player-facing projections interact without a layer becoming a shadow owner or omniscient god system.

The next Living Country step is authorized to ask:

> **What semantic interface must every durable material/social domain expose to participate in one coherent America without forcing materially different systems to share one internal model?**
