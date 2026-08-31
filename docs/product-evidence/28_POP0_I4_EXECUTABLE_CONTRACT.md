# POP0-I4 — Inherited Housing Adapter Executable Contract

Status: **REPAIRED IMPLEMENTATION-DESIGN CANDIDATE — DOCUMENTATION ONLY.** This document does not authorize POP0-I4 coding. Implementation requires unchanged-gate detached design re-audit, a PASS, and a separate implementation-authority action.

Accepted baseline:

- controlling POP-0 contract: `00_PRESIDENTIAL_OPERATING_PROOF_EXECUTABLE_CONTRACT.md`, as repaired and accepted by documents 02 and 04;
- accepted POP0-I1 authority: `07_POP0_I1_AUTHORITY.md`;
- accepted POP0-I2 authority: `14_POP0_I2_AUTHORITY.md`;
- accepted POP0-I3 authority: `21_POP0_I3_AUTHORITY.md` at `09121c2ca420655c12366f27305196068d4bdb9f`;
- accepted POP0-I3 implementation/evidence: `e6dba2027c5aae8684ae4f8eb5464186429833ee`;
- accepted verification maintenance: `27_VERIFICATION_MAINTENANCE_AUTHORITY.md` at `d82b55a9441c4787230b2480ce6df633a0d48d31`;
- accepted production merge base / unchanged `main`: `44c1724962830225e6fc34f41d0df0cfdb7dfec0`.

Detached design audit repaired here:

- `29_POP0_I4_DETACHED_DESIGN_AUDIT.md` at `b0b532e83012f5791112bc6c76d68ac691ffe209` — **REVISE**;
- audited I4 design candidate: `b99a33e88fbaa3ea58ff302737cd268dc3f4bb04`.

Accepted parent contracts control any conflict. I4 adds only the minimum inherited Housing composition described here.

---

# 1. Question and pass gate

POP0-I4 asks:

> **Can the existing deep implementation/Housing machinery operate as one background workstream inside the new presidency rather than the whole game?**

I4 passes only if one canonical POP operating world proves all of the following:

1. the accepted lower-level `ProgramImplementationState` and `IntegratedMaterialHousingState` are direct canonical owner states, not reconstructed views, nested I10 state, or synchronized copies;
2. a stateless typed adapter has no ambient read authority, observes lower owners only through one configured claim-scoped authority, admits only validated cross-owner references, and invokes only legitimate lower-level owner operations;
3. a meaningful inherited administrative/material Housing problem exists before discovery in lower-level owner records, not in a card, flag, briefing sentence, workstream, or test-only projection;
4. Department possession, leadership-office notice/access/receipt, Chief-of-Staff knowledge, presidential presentation, and Presidential Attention remain different facts;
5. at least one Housing project progresses in background time while the hidden project may remain blocked, regardless of whether the President intervenes;
6. a presidential decision may authorize only the already accepted I3 analysis/coordination instrument kinds and cannot choose an agency disposition, waiver outcome, material input, project stage, or physical result;
7. recipient-office receipt, disposition, assignment, assignment result, qualifying supplemental evidence product, canonical separately authorized Department handling submission, implementation-owner consequence, Housing input admission, and later material consequence remain distinct;
8. workstreams, Attention, instruments, office assignments, monitoring artifacts, and history entries never own Housing truth;
9. save/load is exact, lossless, idempotent, and rejects cross-owner fabrication;
10. accepted I1-I3 behavior, lower-level Housing behavior, I10 regression behavior, and the full accepted coverage gate remain green;
11. no employment, Congress, governor, organization, media, public-belief, healthcare, ordinary Population, UI, or I5+ behavior enters the composition.

Any implementation that makes `presidential decision -> Housing stage`, treats record existence as knowledge, embeds the old integrated session, or stores a second Housing snapshot fails I4.

---

# 2. Planned identities and exact scope

## 2.1 Planned version identities

An accepted I4 implementation would advance atomically to:

```text
configuration/scenario version: 0.4.0-pop0-i4
POP runtime schema:             4
POP save format:                4
```

The scenario identity and classification remain:

```text
us-presidential-operating-proof-v0
APPROXIMATED_NON_HISTORICAL_PRODUCT_PROOF
```

No implementation may advance these versions before separate coding authority.

The bounded I4 configuration identities are:

```text
adapter:                   pop0.adapter.inherited-housing.v1
institution binding:       pop0.institution-binding.hud.lower-owner
monitoring artifact:       pop0.artifact.hud-inherited-housing-monitoring.v1
Housing assessment:        pop0.artifact.hud-inherited-housing-assessment.v1
observation authority:      pop0.observation-authority.hud.inherited-housing
raw supplier evidence:      pop0.artifact.hud-stables-supplier-search.v1
supplemental record product:
                           pop0.artifact.hud-stables-nonavailability-record.v1
Housing workstream:        pop0.workstream.inherited-housing-implementation
HUD analysis capability:   pop0.recipient-capability.hud.inherited-housing-analysis
CoS coordination capability:
                           pop0.recipient-capability.chief-of-staff.housing-coordination
Department handling authority:
                           pop0.authority.hud-leadership.stables-waiver-review
```

The adapter identity authenticates behavior/version selection only. It has no owner state.

## 2.2 Reused lower-level owner identities

I4 directly composes exactly two lower-level canonical state fields:

| POP state field | Direct lower-level state | Canonical ownership preserved | Does not own |
|---|---|---|---|
| `programImplementation` | `ProgramImplementationState` | its accepted internal public-finance, fiscal-execution, HUD program-administration, intergovernmental, recipient, and material-input owners | physical Housing stage, office knowledge, presidential authority |
| `materialHousing` | `IntegratedMaterialHousingState` | the accepted I7 material owner | program decisions, office knowledge, presidential authority |

`programImplementation` is an accepted lower-level aggregate containing distinct owner partitions; the POP field does not become a new aggregate owner. Its authenticated internal identities remain those supplied by the accepted I6 configuration, including `us.public-finance`, `us.fiscal-execution.omb`, `us.fiscal-execution.hud`, `us.intergovernmental-relationship.home`, `us.institution.hud`, and exact recipient IDs.

The material owner identity remains the accepted I7 material semantics identity `us-v0-housing-material-route-2`. A POP field name or save-envelope path does not create a new Housing owner identity.

The runtime must use the lower-level constructors, validators, and transitions from `program-implementation.ts` and `housing.ts`. It may not copy their interfaces into POP-specific owner models.

The following remain non-owning:

- the I4 adapter;
- the Housing workstream;
- monitoring artifacts and assessments;
- Presidential Attention;
- presidential decisions and instruments;
- office assignments and results;
- the historical record index;
- audit/test projections.

## 2.3 Exact adapter boundary

The adapter is a stateless, typed boundary over the two direct owner states. It may:

1. resolve a configured lower-level record by exact owner, kind, identity, and effective time;
2. under the one effective `LowerOwnerObservationAuthority`, create an immutable claim-lineaged monitoring artifact containing only exact permitted fields, values, source references, observation time, and authority scope;
3. validate that a Department handling act has the required office/institution authority, source receipt, assignment/result, effective time, and lower-level target;
4. invoke an accepted lower-level implementation transition;
5. derive the set of implementation `MaterialInputRecord`s not yet admitted by the Housing owner;
6. convert those records exactly into the accepted lower-level `AcceptedMaterialInputReference` shape;
7. call `admitValidatedMaterialInputs` and the accepted Housing advancement operations;
8. return updated direct owner states and exact owner-record references.

It may not:

- store state or serialize an adapter cache;
- own a project status, problem status, waiver status, or current Housing summary;
- create a second implementation or Housing record;
- edit a lower-level owner state by object spread outside its accepted constructor/transition boundary;
- infer truth from `ProductionGameView`, action IDs, labels, prose, or an I10 save;
- call `IntegratedPartialRuntimeSession`, `createIntegratedPartialRuntimeState`, or any production-session wrapper;
- decide an office response, Department determination, or Housing consequence;
- expose the complete implementation/Housing state as office or presidential knowledge.

The adapter has no ambient read authority. Every substantive lower-owner read used to create information must carry and satisfy the observation authority in section 5.1.

The only accepted apparent duplication is the already established lower-level cross-owner handoff:

```text
ProgramImplementationState.materialInputs[n]
→ exact validated AcceptedMaterialInputReference
→ IntegratedMaterialHousingState.acceptedInputs[n]
```

The implementation record remains the source event; the Housing record is the Housing owner's immutable acceptance reference. IDs, source owner/record, project, scope, release lineage, causal predecessor IDs, and validation time must match exactly.

## 2.4 Department identity reconciliation

The accepted I2 directory identity:

```text
pop0.institution.department-of-housing-and-urban-development
```

and the lower-level implementation identity:

```text
us.institution.hud
```

identify the same Department in different accepted schema namespaces. I4 must configure one authenticated, one-to-one `InheritedInstitutionIdentityBinding` with:

- both exact IDs;
- relation `SAME_INSTITUTION_DIFFERENT_SCHEMA_NAMESPACE`;
- effective start-inclusive/end-exclusive interval;
- accepted lower-level configuration reference;
- `CONFIGURED_SYNTHETIC_PROOF_ROOT` provenance.

No second Department actor is created. The binding cannot be inferred from matching labels and cannot map either ID to multiple institutions.

The Department and the Office of the Secretary of HUD remain different cognitive/operational boundaries:

```text
Department owner possession or administrative authority
does not imply
Secretary-office receipt, assessment, queue ownership, or knowledge.
```

The binding permits exact institutional routing and authority checks only. It grants no office access by itself.

## 2.5 Minimum additive I3 substrate evolution

Accepted I3 currently authenticates one `workstreamDefinition` and one synthesis-conflict-only escalation rule. I4 may evolve that substrate only to the following exact bounded collections.

### Workstream definitions

The configuration field becomes:

```text
workstreamDefinitions: readonly [
  pop0.workstream.preliminary-labor-evidence-review,
  pop0.workstream.inherited-housing-implementation
]
```

The first entry is structurally and behaviorally identical to the accepted I3 definition. The second is the I4 definition in section 5.5. No other workstream definition is permitted in I4.

The Housing definition is exact:

```text
id: pop0.workstream.inherited-housing-implementation
label: Inherited Housing Implementation
adoptedObjective:
  Monitor and coordinate the bounded inherited Housing implementation route
coordinatorOfficeId: pop0.office.chief-of-staff
participatingOfficeIds:
  pop0.office.chief-of-staff
  pop0.office.secretary-of-hud
```

The standing-coordination-authority collection likewise preserves the accepted I3 authority unchanged and adds exactly:

```text
id: pop0.authority.chief-of-staff.inherited-housing-coordination
officeId: pop0.office.chief-of-staff
permittedWorkstreamIds:
  [pop0.workstream.inherited-housing-implementation]
permittedStatuses:
  MONITORED, ACTIVE, DELEGATED, PAUSED, BLOCKED, COMPLETED, ABANDONED
effectiveFrom: 2029-02-05T08:00:00-05:00
effectiveUntil: null
authority/provenance: CONFIGURED_SYNTHETIC_PROOF_ROOT
```

Neither standing authority may name the other workstream. No authority wildcard is permitted.

Creation, validation, copy, parse, restore, projection, standing-authority resolution, and assignment/coordination validation resolve by exact workstream ID. They must reject:

- an unknown ID;
- duplicate configured IDs;
- duplicate canonical workstream records;
- more or fewer than these two definitions in configuration version `0.4.0-pop0-i4`;
- no definition or multiple definitions matching one canonical record;
- ambiguous coordinator, standing-authority, or recipient-capability mappings.

No behavior may be selected from an ID prefix, label, office ID, array position, or a generic open-ended catalogue. The accepted Labor workstream route and all I3 tests must remain unchanged.

### Escalation eligibility rules

`EscalationEligibilityRule` becomes a closed discriminated union with exactly two configured records:

```text
SYNTHESIS_CONFLICT_ELIGIBILITY
  id: pop0.escalation-rule.preserved-labor-disagreement
  semantics: accepted I3 rule unchanged

RECEIVED_ASSESSMENT_ELIGIBILITY
  id: pop0.escalation-rule.inherited-housing-receipt
  requiredBasisKind: RECEIPT
  initiatingOfficeId: pop0.office.chief-of-staff
  standingAuthorityId:
    pop0.authority.chief-of-staff.inherited-housing-coordination
  requiredWorkstreamId:
    pop0.workstream.inherited-housing-implementation
  requiredSourceArtifactId:
    pop0.artifact.hud-inherited-housing-assessment.v1
  requiredSourceArtifactKind: ASSESSMENT
  requiredAssessmentRuleId:
    pop0.assessment-rule.hud.inherited-housing-problem
  requiredProducingOfficeId: pop0.office.secretary-of-hud
  requiredReceivingOfficeId: pop0.office.chief-of-staff
  requiredSemanticSectionIds:
    assessment-summary
    record-gap-finding
    material-hold-finding
    limitations
  requiredOptionKinds:
    REQUEST_SCOPED_ANALYSIS_AND_COORDINATION
    RESERVE_PRESIDENTIAL_REVIEW
    ALLOW_MONITORING_DEFAULT
  provenance: CONFIGURED_SYNTHETIC_PROOF_ROOT
```

The Housing rule is satisfied only when:

1. the effective Secretary-of-HUD officeholder authored the exact immutable assessment after a valid substantive receipt of the monitoring sections supporting it;
2. an explicit transfer made every required semantic assessment section available to Chief of Staff;
3. the Chief-of-Staff office has one valid substantive receipt covering every required section before escalation creation;
4. each assessment claim retains valid monitoring-claim lineage under section 5;
5. the inherited Housing workstream exists under the exact standing authority and its current state does not itself supply substantive evidence;
6. the effective Chief-of-Staff officeholder performs the typed escalation act with `basisKind: RECEIPT` and cites the exact receipt and assessment;
7. every local option, preview, deadline, default, source, uncertainty, and limitation passes accepted I3 validation.

A metadata notice, entitlement, technical retrieval without substantive receipt, another office's receipt, incomplete transfer, workstream reference, history entry, or global artifact existence cannot satisfy the Housing rule.

Configuration version `0.4.0-pop0-i4` must contain exactly the accepted synthesis-conflict rule plus this Housing rule. Unknown kinds/IDs, duplicate rules, ambiguous matches, or a rule whose source/office/workstream/authority mapping is incomplete reject. General transition logic resolves the discriminant and configured fields; it may not contain a Housing office-ID or artifact-ID special case.

---

# 3. Lower-level content and dependency boundary

## 3.1 Permitted lower-level content

I4 may reuse only the accepted I6/I7 owner content required to construct and validate the two direct states:

- authenticated I6 program-initialization seed and `IntegratedImplementationConfiguration`;
- authenticated I7 Housing-initialization seed and `IntegratedHousingConfiguration`;
- exact artifact IDs, parameter hashes, semantic versions, and reconstruction receipts;
- pure lower-level owner constructors, validators, transitions, time utilities, and hash utilities.

The current I6/I7 content entry modules also compose broader integrated-runtime artifact bundles. I4 must not import that broader bundle graph merely to obtain owner content.

A future I4 implementation may make one behavior-preserving content-only extraction so the accepted I6/I7 owner configuration and seed are exported from narrow modules consumed by both the existing production composition and POP. Such extraction must:

- move, not copy, the authoritative configuration values;
- preserve exact parameter hashes, artifact bytes, exports, I6/I7 behavior, and I10 behavior;
- contain no session, Population, legislature, information, legal-contest, UI, Stage 1, or audit dependency;
- remain directly covered by the existing artifact reconstruction checks.

Maintaining separate POP and production copies of I6/I7 configuration or seed truth is forbidden.

## 3.2 Exact lower-level facts permitted into POP

The direct owner states may contain their complete accepted authenticated records. Only the following bounded facts may cross the adapter into POP information artifacts, office sources, workstream/history references, or presidential presentations:

- program, relationship, recipient, project, waiver-request, determination, dynamic-boundary, and material-input identities;
- record kind, effective/received/decided/validated time, review state, and exact source/provenance reference;
- required and present supporting-record types;
- project identity, Housing region identity, stage, compliance-hold state, input-availability classification, physical-progress amount, and dated project-history occurrence;
- exact administrative-to-material input/release lineage;
- a bounded comparison between a monitoring artifact's `asOf` vintage and later owner state.

The adapter may not project:

- the complete implementation or Housing state;
- unrelated recipients, projects, controls, or regional statistics;
- ordinary Population, household, voter, eligibility, public-belief, or material-exposure facts about the seven I2 named humans;
- a conclusion not authored in a valid monitoring/assessment artifact;
- a current value newer than the source artifact's declared `asOf` time.

Monitoring claims are evidence artifacts with exact source references and vintages. They are not a second current-state truth and may become stale.

---

# 4. Configured inherited opening fixture

## 4.1 Opening provenance authority

The I4 configuration may contain one immutable, behavior-driving `InheritedHousingFixtureAuthority`. It binds:

- the accepted I6/I7 artifact and parameter hashes;
- the two lower-level owner identities;
- the institution identity binding;
- the lower-owner observation authority and exact expected opening monitoring-artifact hash;
- the raw supplier-search evidence artifact identity/hash, source-document lineage, target request/project/scope, and Department possession;
- exact pre-opening operation inputs and authoritative instants;
- exact project, relationship, request, determination, input, and artifact identities expected after replay;
- `CONFIGURED_SYNTHETIC_PROOF_ROOT` provenance.

This authority describes opening causes and accepted inherited records. It is not a current Housing owner, actor decision schedule, knowledge grant, or future outcome script.

Factory construction must deterministically replay the declared pre-opening operations through lower-level transitions and validate the expected identities. It may not deserialize a hidden I10 session, patch a desired final object, or set `hiddenProblem = true`.

## 4.2 Exact inherited material setup

The bounded fixture uses the two accepted I7 projects:

```text
us.project.stables
us.project.palms-at-morris
```

and their accepted relationships, regions, and starting records.

The configured pre-opening replay uses these authoritative instants:

| Instant | Configured opening operation |
|---|---|
| `2026-08-22T00:00:00-04:00` | accepted I6/I7 source state is constructed |
| `2026-08-23T00:00:00-04:00` | separate scoped hold-producing determinations are replayed for Stables and Palms, in configured stable-key order |
| `2029-01-20T08:00:00-05:00` | Stables successor scoped request is received with `NONAVAILABILITY_RECORD` absent |
| `2029-01-21T08:00:00-05:00` | the Stables request is returned for its supplemental record |
| `2029-02-03T08:00:00-05:00` | a separate sufficiently supported Palms determination releases only the exact Palms hold; its material inputs are then admitted |
| `2029-02-04T08:00:00-05:00` | the accepted Stables 14-day boundary makes the request review-ready; it does not supply or decide anything |
| `2029-02-05T07:40:00-05:00` | the Department possesses the configured raw Stables supplier-search evidence; it is not yet a `NONAVAILABILITY_RECORD` and is not known by the Secretary office |
| `2029-02-05T07:50:00-05:00` | the bounded HUD monitoring artifact observes the reconciled lower-owner state |
| `2029-02-05T07:55:00-05:00` | Department possession of the monitoring artifact and monitoring-only recipient-scoped metadata notices are recorded; no raw supplier-evidence notice is created |
| `2029-02-05T08:00:00-05:00` | POP opening; the inherited monitored workstream is replayed from the Chief-of-Staff notice |

Operations sharing an instant use explicit configured stable keys and the owner/dependency phases in section 7.2. The fixture authority authenticates their complete inputs, not merely these labels.

The 2026 hold-producing intentions are `DENY` against fully specified proof-only component requests, so the accepted implementation transition creates exact `COMPLIANCE_HOLD` inputs while every determination retains `physicalHousingEffect: null`. The 2029 Palms intention is `GRANT_SCOPED_WAIVER` against a separate fully supported request with the same Palms proof scope, allowing the implementation owner to identify and release only its causal predecessor hold. The Stables successor intention at opening remains `RETURN_FOR_SUPPLEMENTAL_RECORD`; no later grant/denial is configured.

Before the POP epoch, the configured replay creates one scoped implementation compliance hold for each project through the accepted waiver/determination/material-input route. Both holds use a proof-only component scope distinct from the immutable historical `W-0000102` waiver and preserve that historical record unchanged.

For `us.project.palms-at-morris`, a later pre-opening, sufficiently supported Department determination releases its exact hold through accepted `WAIVER_TERMS` and `INPUT_AVAILABILITY` material inputs. Those inputs are admitted by the Housing owner before the POP epoch. At opening, Palms is active with a small, dated amount of physical progress and can continue progressing in background time.

For `us.project.stables`, the hold remains effective. A successor scoped waiver request was returned for a supplemental record and its accepted 14-day administrative boundary has made the request `REVIEW_READY` before the POP epoch. The exact missing record is:

```text
NONAVAILABILITY_RECORD
```

At opening, canonical lower-level truth therefore includes:

```text
Program implementation owner:
  one REVIEW_READY Stables request
  one missing supplemental-record requirement
  one effective Stables compliance-hold input

Material Housing owner:
  Stables BLOCKED by that accepted hold
  Palms ACTIVE and independently progressing
```

The Stables request, determination lineage, effective hold, project stage, and Housing history are the hidden-but-discoverable problem. No POP flag, card, workstream status, assessment, or presentation owns that truth.

The replay must advance and reconcile both lower owners from their accepted source instants to the POP epoch. A 2026 seed may not be silently treated as a 2029 current snapshot.

## 4.3 No scheduled later answer

The fixture may configure the inherited request, missing record, administrative review opportunity, monitoring authority, access rules, office capabilities, and deadlines.

It may not configure that, after the POP epoch:

- the Secretary office will retrieve or assess the artifact;
- Chief of Staff will create or present an escalation;
- the President will intervene;
- HUD will accept, narrow, delay, refuse, or ignore an instrument;
- an office assignment will be completed;
- the Secretary will retrieve the raw supplier evidence or author the qualifying supplemental-record artifact;
- a Department handling submission will be made;
- the Department will supply the missing record or grant/deny/return the request;
- Stables will become active or progress;
- a substitute dramatic event will appear if any step is omitted.

Those later acts must be explicit owner operations from then-current state.

---

# 5. Agency possession and bounded discovery

## 5.1 Typed lower-owner observation authority

Global lower-record existence, adapter reachability, the institution identity binding, a workstream/history reference, or possession of some other artifact grants no authority to observe lower-owner content.

I4 configures exactly one `LowerOwnerObservationAuthority`:

```text
id:
  pop0.observation-authority.hud.inherited-housing
observingInstitutionId:
  pop0.institution.department-of-housing-and-urban-development
institutionIdentityBindingId:
  pop0.institution-binding.hud.lower-owner
effectiveFrom:
  2029-02-05T07:45:00-05:00
effectiveUntil:
  null
sourceConfigurationReferences:
  accepted I6 implementation parameter/artifact hashes
  accepted I7 material-Housing parameter/artifact hashes
source scopes:
  - sourceStateField: programImplementation
    sourceOwnerIds: [us.institution.hud]
    projectIds: [us.project.stables, us.project.palms-at-morris]
    recordKinds:
      WaiverRequestRecord
      AdministrativeDeterminationRecord
      DynamicAdministrativeBoundary
      MaterialInputRecord
    observable claim families/fields:
      ADMINISTRATIVE_REVIEW_STATE:
        reviewState, supplementalRecordRequirements, reviewNotBefore
      ADMINISTRATIVE_DETERMINATION:
        intention, outcome, scopeKey, decidedAt, physicalHousingEffect
      IMPLEMENTATION_MATERIAL_HOLD:
        kind, projectRef, scopeKey, releaseOfInputId,
        causalPredecessorInputIds, validatedAt
  - sourceStateField: materialHousing
    sourceOwnerIds: [us-v0-housing-material-route-2]
    projectIds: [us.project.stables, us.project.palms-at-morris]
    recordKinds:
      MaterialHousingProject
      MaterialHousingProjectHistoryRecord
    observable claim families/fields:
      PROJECT_MATERIAL_STATUS:
        stage, complianceHold, inputAvailability, physicalProgressUnits
      PROJECT_MATERIAL_HISTORY:
        fromStage, toStage, occurredAt, causeInputIds
authorityReference:
  authenticated I4 inherited-Housing monitoring authority
provenance:
  CONFIGURED_SYNTHETIC_PROOF_ROOT
```

The authority is start-inclusive/end-exclusive. It is exact and closed: another institution, owner, record kind, project, recipient, claim family, or field cannot be observed under it. The adapter must resolve the authority by ID, validate its one-to-one institution binding and source configuration hashes, and authorize each claim separately before reading that field.

The authority permits observation only. It does not grant Department possession of the resulting artifact, Secretary/Chief-of-Staff access, or presidential knowledge.

## 5.2 Claim-lineaged monitoring artifact

The accepted I2 `PresidentialInformationArtifact` model evolves additively into this closed union:

```text
SourceEvidenceArtifact                       // accepted I2 shape unchanged
AssessmentArtifact                           // accepted I2 shape unchanged
SynthesisArtifact                            // accepted I2 shape unchanged
HousingMonitoringEvidenceArtifact            // one bounded I4 shape
DepartmentSupplierSearchEvidenceArtifact     // raw evidence; not a waiver record
DepartmentSupplementalRecordArtifact         // section 6.4 only
```

No arbitrary artifact-kind registry is introduced. Unknown kinds and unknown fields reject.

Each new I4 artifact variant retains the routeable I2 metadata required by its producer boundary: exact ID/version, producer institution or producing office/officeholder, `asOf`, `createdAt`, `releasedAt`, ordered section IDs, access class, provenance, and revision/supersession references. Variant-specific fields below are additive and exact. I2 notice, entitlement, retrieval, receipt, transfer, assessment, and presentation operations must exhaustively accept only the appropriate variants without treating variant existence as access.

At opening, one immutable `HousingMonitoringEvidenceArtifact` exists with the accepted I2 routing metadata plus:

```text
kind: HOUSING_MONITORING_EVIDENCE
observationAuthorityId
institutionIdentityBindingId
claims: HousingMonitoringClaim[]
sections: { sectionId, claimIds[] }[]
canonicalArtifactHash
```

Every `HousingMonitoringClaim` contains:

- claim ID and containing section ID;
- exact `sourceStateField`, source owner ID, source record kind, and source record ID;
- exact project ID;
- one permitted claim family and one permitted observed field path;
- exact typed observed value (`string`, number, boolean, null, or ordered string array);
- source record effective/occurrence time where the record supplies one;
- observation/`asOf` time;
- observation-authority ID and exact authority-scope key;
- canonical hash of the source record as observed;
- immutable supporting lower-owner occurrence IDs where the claim derives from an append-only determination, boundary, input, or project-history record;
- claim provenance.

The artifact has four section identities:

```text
portfolio-summary
stables-administrative-record-gap
stables-material-hold
methods-and-vintage
```

The `portfolio-summary` section may summarize only claim IDs contained in the other sections and cannot add an unlineaged current-state assertion. Its producer/semantic possessor is the Department of Housing and Urban Development through the institution identity binding.

Creation is one explicit information-owner observation operation. For every claim it must, at the declared observation instant:

1. resolve the one effective observation authority;
2. resolve the exact permitted source owner and record;
3. prove the record existed and was effective/occurred no later than observation;
4. read only the configured field path;
5. bind the exact observed value, record hash, source occurrence lineage, and authority scope;
6. compute the immutable claim and artifact hashes;
7. append the artifact-creation occurrence to the noncognitive information-route ledger;
8. separately record Department possession.

Creation rejects an absent/expired authority, future source, missing record, unrelated project/recipient, unconfigured owner/kind/field/claim family, stale-current-value substitution, mismatched source hash, or section claim not authorized by the artifact's authority.

The opening fixture authority authenticates the expected opening monitoring artifact hash after deterministic replay. A later monitoring vintage would require a new immutable artifact and observation occurrence under separately valid authority; it may not revise the opening artifact in place.

Live and restore validation use the same exact artifact/authority validator. Restore never reruns the observation operation and never replaces a historical observed value with the lower owner's current value. It validates:

- immutable artifact/claim hashes and the configured opening hash;
- authority identity, interval, scope, source configuration hashes, and institution binding;
- claim-to-section containment and exact field/value types;
- source record identity and nonfuture chronology;
- full observed-record hash where that immutable record version remains canonical;
- persisted observed-record hash plus immutable supporting occurrence lineage where the lower owner has since advanced a mutable record.

Thus later owner changes may make the artifact stale but cannot rewrite its historical claims. Tampering with an observed value, source, field, time, authority, lineage, section membership, or hash rejects before session construction.

The artifact cannot write either lower owner, decide the waiver, or update itself when source state changes. A later observation requires a new revision-preserving artifact.

Removing, expiring, or narrowing the observation authority while holding lower-owner state constant prevents creation and restoration of the same monitoring artifact. The identity binding, adapter, workstream, historical index, or global record existence cannot substitute for that authority.

## 5.3 Opening knowledge state

At the POP epoch:

| Boundary | Opening state |
|---|---|
| lower implementation owner | possesses all canonical administrative records |
| lower Housing owner | possesses all canonical material state |
| HUD Department institution | possesses the full monitoring artifact and the separate raw supplier-search evidence artifact |
| Secretary-of-HUD office | has monitoring metadata notice/entitlement but no retrieval/receipt; for raw supplier evidence it has one dormant configured section-scoped entitlement but no notice, retrieval, or receipt |
| Chief-of-Staff office | has metadata notice that a monitoring product exists, but no entitlement or substantive receipt |
| OMB, NEC, Labor, Legislative Affairs | no Housing artifact notice, access, or receipt |
| President | no Housing artifact section or hidden-problem knowledge |

Department possession does not fan out through the institution identity binding. A notice does not become entitlement, retrieval, receipt, assessment, escalation authority, presidential presentation, or Attention.

## 5.4 Valid discovery route

A full discoverable route requires separate accepted I2/I3 operations:

```text
lower owner records
→ claim-by-claim LowerOwnerObservationAuthority validation
→ versioned Department monitoring artifact
→ Department possession
→ Secretary-office notice + scoped entitlement
→ technical retrieval
→ substantive Secretary-office receipt
→ immutable Secretary-office assessment
→ explicit scoped transfer
→ substantive Chief-of-Staff receipt
→ optional Chief-of-Staff escalation act
→ bounded escalation presentation
→ Presidential Attention
```

The Secretary assessment may claim only what its received sections and configured rule support. Chief of Staff may cite only portions the office received. The President knows only sections in valid presentation history.

The exact assessment has accepted artifact kind `ASSESSMENT`, identity `pop0.artifact.hud-inherited-housing-assessment.v1`, configured rule `pop0.assessment-rule.hud.inherited-housing-problem`, and semantic sections `assessment-summary`, `record-gap-finding`, `material-hold-finding`, and `limitations`. The rule requires a substantive Secretary receipt of the relevant monitoring sections and exact `sourceLineage` back to those sections; validation resolves the claim IDs contained in those sections and requires the configured administrative-gap and material-hold claim families. The assessment does not copy lower-owner truth or monitoring claims. It is not the missing `NONAVAILABILITY_RECORD` and cannot be submitted as that record.

The I2 information-route ledger remains noncognitive, recipient-scoped infrastructure. The I3 historical index remains reference-only. Neither may answer “who knows this?” from global record existence.

## 5.5 Housing workstream

I4 adds one configured workstream identity:

```text
pop0.workstream.inherited-housing-implementation
```

The opening fixture contains this already-adopted workstream in `MONITORED` state as an authenticated inherited office record. Factory replay creates it through the accepted I3 typed workstream operation under an effective Chief-of-Staff standing coordination authority, citing only the metadata notice available to that office. Its objective is bounded monitoring/coordination of inherited Housing implementation. The configured opening record does not schedule any later transition; every later status change requires an explicit coordinator-owned act.

It owns only:

- adopted objective;
- coordinator and participant identities;
- append-only coordination transitions;
- next review time;
- references the coordinator office is authorized to cite.

It does not own or mirror:

- waiver/request/review state;
- missing records;
- compliance holds or material inputs;
- project stage/progress/completion/usability;
- artifact content or office knowledge;
- recipient disposition, assignment result, or Department determination;
- presidential knowledge or Attention.

Completing, blocking, pausing, or abandoning the workstream cannot mutate either lower owner and cannot assert that a Housing outcome occurred.

---

# 6. Presidential intervention and recipient ownership

## 6.1 Reused instrument kinds only

I4 introduces no new presidential instrument kind. A Housing escalation may preview only:

```text
REQUEST_OFFICE_ANALYSIS
REQUEST_WORKSTREAM_COORDINATION
```

using the complete I3 preview/hash/deep-equality, decision, dispatch, delivery, office-receipt, disposition, and assignment boundaries.

The configuration may add exact typed recipient-capability authorities for:

- Secretary-of-HUD analysis of `INHERITED_HOUSING_IMPLEMENTATION`, limited to the sections actually available to that office and bounded products such as a supplemental-record/options memorandum;
- Chief-of-Staff coordination of `pop0.workstream.inherited-housing-implementation`.

Capability derives from exact recipient, instrument kind, subject/workstream scope, product/action bounds, effective interval, and authority record. It cannot derive from parsing office mandate text or `if officeId === HUD` logic.

The presidential payload may request analysis or coordination. It may not encode or select:

- `GRANT_SCOPED_WAIVER`, `DENY`, or `RETURN_FOR_SUPPLEMENTAL_RECORD`;
- a supplied record type;
- an implementation material input;
- a workstream/assignment/recipient disposition;
- a project stage, progress amount, completion, usability, or exposure;
- a payment, award, obligation, recipient decision, or state/local act.

## 6.2 Recipient-owned route

After a presidential instrument is authorized, every later step remains optional and separately owned:

```text
presidential decision
≠ instrument
≠ dispatch
≠ technical delivery
≠ Secretary-office receipt
≠ recipient disposition
≠ office assignment
≠ assignment result/options artifact
≠ Department handling act
≠ implementation-owner determination/material input
≠ Housing-owner input admission
≠ later Housing material consequence
≠ return presentation to President
```

The Secretary office may accept, narrow, delay, refuse, or take no action only under the accepted I3 causal constraint and deadline rules. An accepted/narrowed disposition may authorize an office analysis assignment within exact product, section, and deadline scope. It does not authorize a waiver outcome.

An assignment result is an office artifact. It can analyze options and record limitations; it cannot mutate the Department or Housing owner.

## 6.3 Department handling authority

I4 may configure one bounded `DepartmentLeadershipHandlingAuthority` linking the effective Secretary-of-HUD officeholder assignment to the lower-level HUD institution for the exact inherited Stables request and effective interval.

This authority:

- is separate from the presidential instrument and recipient capability;
- grants no automatic Department knowledge to the Secretary office;
- allows only the typed post-assignment supplemental-product authoring act in section 6.4 and the two handling submissions against the exact request;
- preserves the Department owner as resolver;
- cannot target another project, relationship, request, institution, or scope;
- does not guarantee acceptance or outcome.

The minimum typed handling submissions are:

```text
SUBMIT_SUPPLEMENTAL_RECORDS
SUBMIT_WAIVER_REVIEW_INTENTION
```

### Canonical occurrence owner

The accepted `pop0.owner.office-operations` state expands atomically with one append-only `departmentHandlingSubmissions` collection partitioned by submitting office. Only the Secretary-of-HUD office partition may contain I4 handling submissions.

Every immutable `DepartmentHandlingSubmissionRecord` contains:

- submission ID and immutable deduplication identity;
- kind: `SUBMIT_SUPPLEMENTAL_RECORDS` or `SUBMIT_WAIVER_REVIEW_INTENTION`;
- submitting office ID and effective submitting officeholder-assignment ID;
- exact `DepartmentLeadershipHandlingAuthority` ID;
- source recipient-disposition ID;
- source instrument-authorized assignment ID;
- source assignment-result artifact ID;
- target lower institution ID, waiver-request ID, project ID, relationship ID, and exact scope key;
- authoritative `submittedAt`;
- one exact discriminated payload;
- provenance reference.

`SUBMIT_SUPPLEMENTAL_RECORDS` payload contains:

```text
recordTypeIds: readonly [NONAVAILABILITY_RECORD]
qualifyingEvidenceReferences: readonly [{
  artifactId
  artifactKind: HUD_SUPPLEMENTAL_RECORD
  recordTypeId: NONAVAILABILITY_RECORD
  certificationSectionId: nonavailability-certification
  sourceArtifactProductionId
  sourceRawEvidenceReceiptId
  sourceLineageSectionId: source-evidence-lineage
}]
```

`SUBMIT_WAIVER_REVIEW_INTENTION` payload contains:

```text
intention: GRANT_SCOPED_WAIVER | DENY | RETURN_FOR_SUPPLEMENTAL_RECORD
supportingHandlingSubmissionIds
```

The base handling record is the canonical office/officeholder act. It has no mutable result/status field and cannot copy the lower determination or material inputs. The lower implementation request/determination/input remains result truth. The reference-only historical index records the submission and, when a lower transition succeeds, records the lower result with the submission occurrence as its causal parent.

Live creation validates every authority, officeholder, disposition, assignment/result, target, source, payload, and time field before mutation. Identical retry is idempotent; conflicting dedupe rejects. After the immutable act validates, the stateless adapter may invoke the one corresponding lower operation in the same canonical transaction. If source/authority/lineage validation or the lower operation rejects, no submission, lower mutation, material-input admission, or history entry is committed.

The supplemental submission may invoke `supplySupplementalWaiverRecords(state, requestId, ["NONAVAILABILITY_RECORD"])` only after its qualifying evidence validates under section 6.4. The review-intention submission carries one lower-level `WaiverIntention`, but the implementation owner remains authoritative: its current request sufficiency, review timing, scope, and state determine whether the accepted `directWaiverIntention` transition succeeds or rejects.

Neither handling submission is a player command. I4 proof methods for these acts are agency/owner test machinery and do not create general staff AI.

## 6.4 Exact supplemental-record evidence route

At opening, the HUD Department institution possesses one immutable raw evidence artifact:

```text
id: pop0.artifact.hud-stables-supplier-search.v1
kind: HUD_SUPPLIER_SEARCH_EVIDENCE
producerInstitutionId:
  pop0.institution.department-of-housing-and-urban-development
targetProjectId: us.project.stables
targetRequestId: exact inherited Stables successor request
targetScopeKey: exact proof-only Stables component scope
sections:
  supplier-search-scope
  supplier-response-records
  method-and-date
provenance: CONFIGURED_SYNTHETIC_PROOF_ROOT
```

This `DepartmentSupplierSearchEvidenceArtifact` contains exact configured source-document identities, search scope/method/time, technical component identity, responsive-source observations, and producer provenance. It is raw source evidence only. It does **not** have `recordTypeId: NONAVAILABILITY_RECORD`, is not part of the waiver request's supporting records, and cannot satisfy `supplySupplementalWaiverRecords` by itself.

At opening, the Secretary office has neither notice nor substantive receipt of this raw artifact. The presidential instrument does not attach it and does not reveal it to the President.

One configured entitlement binds only the Secretary-of-HUD office, this exact raw artifact, all three raw section IDs, access class `POP0_I4_HUD_SUPPLIER_EVIDENCE`, the I4 effective interval, and the handling-authority reference. Entitlement is noncognitive and exists at opening, but accepted I2 retrieval still requires a recipient-scoped metadata notice. The valid assignment/result permits an explicit Secretary-office notice operation; it does not create receipt or reveal content automatically.

After a valid HUD recipient disposition and scope-contained assignment, the following separate office operations may occur:

1. the Secretary office explicitly records the assignment-scoped metadata notice and combines it with the already configured exact entitlement;
2. technical retrieval and a substantive office receipt cover all three raw-evidence sections;
3. the office assignment produces its bounded options/limitations result; that memorandum may recommend obtaining or compiling a record but is not the missing record;
4. under the effective Department leadership-handling authority, the effective Secretary-of-HUD officeholder performs one typed supplemental-product authoring act;
5. that act creates the exact immutable `DepartmentSupplementalRecordArtifact`:

```text
id: pop0.artifact.hud-stables-nonavailability-record.v1
kind: HUD_SUPPLEMENTAL_RECORD
recordTypeId: NONAVAILABILITY_RECORD
authoringOfficeId: pop0.office.secretary-of-hud
authoringOfficeholderAssignmentId: effective Luis Ortega assignment
sourceDispositionId
sourceAssignmentId
sourceAssignmentResultArtifactId
targetInstitutionId: us.institution.hud
targetRequestId: exact inherited Stables successor request
targetProjectId: us.project.stables
targetRelationshipId: exact accepted Stables relationship
targetScopeKey: exact proof-only Stables component scope
sections:
  nonavailability-certification
  source-evidence-lineage
  limitations
sourceEvidenceReferences:
  exact raw supplier-search artifact ID
  exact Secretary substantive receipt ID
  all three exact received source section IDs
createdAt
canonicalArtifactHash
provenance: CONFIGURED_SYNTHETIC_PROOF_ROOT
```

The supplemental artifact is owned as an immutable office-produced information artifact in the accepted information-route owner, with an exact Secretary-office production/possession occurrence. It is not a Department handling submission, lower waiver result, or Housing result.

Authoring validates exact raw-artifact identity/hash, the Secretary office's substantive receipt of every required raw section, assignment/disposition/result containment, effective holder/authority, request/project/relationship/scope, source chronology, and record-type rule. Another office's receipt, a partial receipt, metadata notice, global ledger visibility, monitoring claim, or options-memorandum recommendation cannot author the product.

Only the resulting artifact's `nonavailability-certification` section, together with its exact source-lineage section, Secretary artifact-production occurrence, and exact substantive raw-evidence receipt, qualifies a `SUBMIT_SUPPLEMENTAL_RECORDS` payload. The handling submission persists those artifact/section/production/receipt references before the adapter converts the single authorized `recordTypeId` into the lower API's `recordTypes[]` argument.

The opening monitoring artifact merely observes that `NONAVAILABILITY_RECORD` is missing. It cannot serve as the record, source evidence for the certification, or a qualifying handling reference. The options memorandum likewise cannot count merely because it recommends the record.

Live and restore validation reject fabricated/extra record types; changed raw/final artifact hashes; missing or cross-office receipts; wrong author/holder; partial source sections; wrong request/project/relationship/scope; invalid disposition/assignment/result lineage; expired handling authority; future chronology; or a lower worked-route determination that lacks the corresponding canonical handling submission.

## 6.5 Later material consequence

If and only if the implementation owner validly creates new material inputs, the stateless adapter may derive the not-yet-admitted exact input set and pass it to the Housing owner.

At the same authoritative instant, ordering is:

```text
1. implementation owner transition
2. exact material-input reference admission
3. Housing input-driven stage resolution
4. later elapsed-time physical Housing advancement
```

A valid scoped grant may release the exact Stables hold. Housing may then derive a nonblocked stage. Physical progress occurs only under later Housing-owned elapsed-time advancement and accepted material conditions.

The Department determination itself has `physicalHousingEffect: null`. The presidential instrument, office assignment, workstream transition, payment, and adapter all have no direct physical effect.

---

# 7. Time, autonomy, and causal convergence

## 7.1 Background advancement

POP `advanceTo()` must advance the lower owners even when:

- Attention is empty;
- the player is focused on another matter;
- the Housing workstream remains monitored;
- no Housing artifact is retrieved;
- no presidential decision exists;
- an instrument is undispatched, refused, delayed, or unanswered.

The exact proof must show Palms physical progress changing over elapsed proof time without a Housing-related presidential act. Stables remains blocked while its effective hold remains, rather than receiving replacement drama or invisible progress.

## 7.2 Boundary ordering

For every crossed instant, `advanceTo()` processes all due lower-owner boundaries internally and exactly once. The minimum ordering is:

1. administrative deadline/review boundary;
2. implementation-owner result/material-input creation;
3. material-input admission to Housing;
4. Housing material boundary/progress/completion/usability phase;
5. monitoring observations scheduled at that instant, which may observe only completed earlier phases;
6. existing I2/I3 deadline/default phases under their accepted ordering.

Independent office acts remain explicit operations and are not fabricated by time advancement.

Coarse advancement, fine advancement, reordered independent office routes, and save immediately before a boundary/load/continue must converge on identical canonical state, projections, history references, and save bytes.

## 7.3 No causality laundering

The following are never equivalent:

```text
record exists                 != office possesses or knows it
record exists                 != HUD has observation authority
office knows it               != President was presented it
workstream cites a reference  != workstream owns the fact
monitoring says record missing != qualifying supplemental record exists
President requests analysis   != recipient accepts
recipient accepts             != assignment exists or finishes
assignment finishes           != supplemental product is authored
supplemental product exists   != Department handling is submitted
Department submission exists != implementation owner accepts/resolves
implementation owner resolves != Housing accepts an input
Housing accepts an input      != physical completion or usability
```

No history index, adapter projection, full-state shell getter, or save validator may collapse those distinctions.

---

# 8. Atomic persistence and validation

## 8.1 Format-4 contents

The format-4 POP save contains:

- authenticated configuration/scenario identity and version;
- accepted I1-I3 session/control and owner state;
- direct `ProgramImplementationState` and its accepted internal owner partitions under the one POP state field;
- direct `IntegratedMaterialHousingState` under the one POP material-state field;
- I4 claim-lineaged monitoring, raw supplier-search, assessment, options/result, and supplemental-record artifacts plus notices, entitlements, retrievals, receipts, transfers, dispositions, and presentations inside their accepted information/office owners;
- immutable Department handling submissions inside the Secretary-of-HUD partition of `pop0.owner.office-operations`;
- Housing workstream and append-only transitions inside the I3 workstream owner;
- any I4 decisions, instruments, dispatches, and presentations inside accepted I3 owners;
- reference-only historical entries for bounded I4 occurrences.

The exact two workstream definitions, exact two escalation rules, institution identity binding, fixture authority, lower-level observation authority, lower-level parameter hashes, recipient capabilities, handling authority, artifact rules, and information rules are authenticated configuration, not mutable world state.

The save does not contain:

- an I10/format-11 save or any opaque nested save;
- an adapter state/cache;
- an ambient lower-owner read grant or cached current-observation projection;
- a duplicate Housing summary/problem/status;
- derived current workstream/Attention values;
- player-visible “known Housing” flags;
- pending input queues that duplicate the derivable difference between implementation inputs and Housing accepted references;
- projections or UI state.

## 8.2 Atomic expansion

Every I4 field must enter atomically across:

- configuration/runtime type;
- lower-owner content construction;
- operating-state creation;
- exact-shape and semantic validation;
- defensive copy;
- save envelope/parser;
- restore factory;
- session operation closure;
- historical reference derivation;
- deterministic continuation tests.

Format-3 saves are rejected unless a separately reviewed deterministic migration is expressly authorized. Loading may not invent inherited Housing prehistory, office knowledge, problem discovery, or I4 history.

## 8.3 Required cross-owner validation

Before construction and after every operation/load, validation must prove:

- both lower owner states pass their accepted native validators;
- their artifact/configuration/semantic identities match authenticated I4 configuration;
- every Housing accepted input has one exact implementation source input with matching cross-owner fields;
- no implementation input is represented as admitted before its validation time;
- every release points to the exact effective prior hold and preserves causal lineage;
- every bounded monitoring claim points to existing, not-future lower records and declares its `asOf` vintage;
- the exact observation authority permits every monitoring claim's institution, source owner, record kind, project, claim family, field, and time, and claim/artifact hashes and persisted source lineage reconcile;
- the configured workstream/rule collections contain exactly the accepted I3 entry plus the I4 entry, with exact unambiguous ID resolution;
- office access/receipt/presentation follows I2/I3 scope and chronology;
- every workstream/history reference is authorized for its author and remains noncognitive;
- raw supplier evidence, Secretary receipt, supplemental artifact, record-type certification, disposition, assignment/result, and Department handling submission form one exact forward causal lineage;
- Department handling targets the exact institution, request, project, relationship, scope, effective holder, record type, and authority interval;
- every worked-route lower supplemental change/determination has its distinct canonical handling submission while no handling submission copies the lower result;
- project-history consequences never predate source inputs or lower-owner decisions;
- no duplicate institution mapping, project owner, waiver owner, or Housing truth exists.

## 8.4 Required checkpoints

At minimum, tests preserve byte-stable `save -> load -> save` checkpoints for:

1. opening direct lower-owner states with Palms active, Stables blocked, and no presidential Housing knowledge;
2. Department artifact possession plus Secretary/Chief-of-Staff metadata notices only;
3. Secretary retrieval/receipt/assessment while President remains unaware;
4. Chief-of-Staff substantive receipt and unpresented escalation with empty Attention;
5. presented Housing escalation in Attention before decision;
6. decision/instruments authorized but undispatched;
7. delivered/received HUD instrument before disposition;
8. accepted or narrowed disposition/assignment before assignment result;
9. assignment result before raw supplier-evidence access/receipt and before any Department handling act;
10. Secretary receipt of the raw supplier evidence before authoring the qualifying supplemental artifact;
11. immutable `NONAVAILABILITY_RECORD` artifact and production/possession occurrence before its handling submission;
12. canonical `SUBMIT_SUPPLEMENTAL_RECORDS` handling submission plus lower request update while no final determination/material input exists;
13. canonical `SUBMIT_WAIVER_REVIEW_INTENTION` plus implementation determination/material input before Housing admission;
14. Housing hold release before later physical progress;
15. background no-intervention advancement;
16. immediately before and after an administrative, observation, artifact, handling, input-admission, Housing, instrument, and recipient deadline boundary.

Loading performs no observation, artifact authoring, retrieval, assessment, escalation, presentation, decision, dispatch, receipt, disposition, assignment, handling submission, lower-owner call, input admission, project advancement, or deadline processing.

---

# 9. Required hostile and counterfactual proofs

I4 implementation tests must prove all of the following without inserting substitute events:

1. the accepted I3 Labor workstream and synthesis-conflict escalation route still produce byte-identical accepted behavior under the additive collection model;
2. an unknown/duplicate/ambiguous workstream definition, workstream record, standing authority, escalation rule, or rule match rejects during live creation and restore;
3. a Housing metadata notice, entitlement, technical retrieval, workstream reference, or another office's receipt cannot satisfy the Housing receipt/assessment escalation rule;
4. the exact complete Secretary assessment transfer plus Chief-of-Staff substantive receipt can satisfy the bounded Housing rule, while removing any required section prevents it without replacement Attention;
5. remove, expire, or narrow the `LowerOwnerObservationAuthority` while keeping lower-owner state unchanged: the same monitoring artifact cannot be created or restored;
6. remove the canonical Stables request, hold, project-history source, or permitted observation field: the monitoring artifact cannot validly claim the same problem;
7. change a monitoring claim value, source owner/record/kind, field path, project, time, authority scope, source hash, lineage, section membership, or artifact hash: live and restore validation reject;
8. remove or alter the one-to-one institution identity binding: observation, Department possession, and handling cannot be attributed to the POP HUD institution or Secretary office;
9. keep Department possession but omit Secretary retrieval/receipt: no evidence-grounded Secretary assessment exists;
10. give Chief of Staff only the metadata notice: the office cannot cite the missing record, hold, project stage, or hidden sections;
11. create a valid staff assessment but omit transfer/receipt: Chief of Staff cannot escalate from it;
12. create an escalation but omit bounded presentation: Attention remains empty and the President learns no Housing content;
13. allow a reserved review to become due while a new Housing artifact remains unpresented: Attention reveals none of the new artifact's identity or substance;
14. select the Housing analysis/coordination option but omit or fail dispatch: no recipient receipt, disposition, assignment, handling, implementation change, or Housing change appears;
15. deliver the HUD instrument but omit office receipt: no valid HUD disposition or assignment appears;
16. accept/narrow and complete an office assignment but omit raw supplier-evidence receipt, supplemental-product authoring, or Department handling: both lower owner states remain unchanged;
17. use the monitoring artifact or options memorandum as `NONAVAILABILITY_RECORD`: authoring/submission rejects because neither is the qualifying supplemental artifact;
18. fabricate `NONAVAILABILITY_RECORD`, cite another office's or partial raw-evidence receipt, or tamper the raw/final artifact hash, source sections, author, request, project, relationship, or scope: live operation and load both reject;
19. create a handling submission without its exact disposition, assignment/result, effective officeholder, handling authority, qualifying artifact, or production/possession reference: it rejects before mutation and the prior save restores identically;
20. alter a persisted handling submission or add a worked-route lower request update/determination without its causal submission: restore rejects;
21. submit a fully valid supplemental handling act: exactly one immutable office-owned submission and only the one authorized lower `recordTypes[]` update occur; no determination/material/Housing result is implied;
22. change current source sufficiency so a requested grant is unsupported: the implementation owner rejects under its own rules; no handling record, material input, or replacement outcome is committed by that failed transaction;
23. choose `RETURN_FOR_SUPPLEMENTAL_RECORD` or `DENY` instead of a supported grant: the canonical submission differs and Stables does not receive the same release/progress outcome;
24. release the hold validly but do not advance elapsed Housing time: no physical completion/usability is fabricated;
25. mutate, complete, pause, or abandon the workstream: waiver and project state do not change;
26. create an award, obligation, payment, decision, instrument, assignment, artifact, or handling submission: none directly changes material project stage or progress;
27. inject a Housing accepted input with no exact implementation source, altered source ID, wrong project/scope, broken release lineage, or future time: live operation and load both reject;
28. remove every presidential Housing act: Palms still progresses under Housing time, Stables remains governed by its hold, and no replacement escalation appears;
29. reorder independent I2/I3 office operations or advance coarse/fine/save-load around boundaries: canonical states and bytes converge;
30. complete the I4 worked route and verify the President still lacks any later Department/Housing result until a new bounded presentation occurs;
31. attempt to import/use I10 session, `ProductionGameView`, global action APIs, Stage 1, full-state player input, or a second Housing snapshot: the structural boundary fails.

---

# 10. Minimum worked proof trace

The implementation may use one deterministic trace, but every actor-owned operation after opening remains an explicit validated act rather than a configured story beat.

1. **Opening:** lower owners contain Palms active and Stables blocked/review-ready. Under the exact observation authority, HUD Department possesses the claim-lineaged monitoring artifact and separately possesses raw supplier-search evidence that is not yet a `NONAVAILABILITY_RECORD`. Secretary and Chief of Staff have monitoring metadata notices only. The President knows nothing about the Housing problem. The inherited Housing workstream is monitored and reveals no hidden detail.
2. **Background interval:** time advances. Palms gains Housing-owned physical progress. Stables remains blocked. No Attention or replacement drama is created.
3. **Office discovery:** the Secretary office retrieves and substantively receives scoped monitoring sections, authors the exact four-section rule-supported assessment with monitoring-claim lineage, and separately transfers every semantic section to Chief of Staff.
4. **Escalation:** Chief of Staff substantively receives every required assessment section, explicitly creates a `RECEIPT`-basis Housing escalation under the one Housing eligibility rule, then separately presents bounded sections/options. Only then does Housing enter Presidential Attention.
5. **Presidential choice:** under valid ControlBinding, the player selects the previewed analysis/coordination option. Exactly the previewed I3 instrument payloads are authorized. No dispatch or downstream result exists yet.
6. **Recipient route:** the HUD instrument is separately dispatched, delivered, received, and dispositioned. The Secretary office independently creates and completes a scope-contained analysis assignment. Its options/limitations result is not the missing record.
7. **Supplemental product:** assignment-scoped notice/access, technical retrieval, and substantive Secretary receipt cover every raw supplier-evidence section. Under the separate handling authority, the effective Secretary authors the exact immutable `HUD_SUPPLEMENTAL_RECORD`, preserving raw receipt/section and assignment/result lineage. This still does not update the lower waiver request.
8. **Agency handling:** the Secretary creates one canonical `SUBMIT_SUPPLEMENTAL_RECORDS` occurrence citing the qualifying artifact, production/possession occurrence, and exact lineage. Only then may the adapter supply the single lower record type. A later distinct `SUBMIT_WAIVER_REVIEW_INTENTION` occurrence proposes the bounded intention. The implementation owner validates and resolves its own state.
9. **Cross-owner admission:** any resulting implementation material input is separately admitted by exact reference to the Housing owner.
10. **Later consequence:** only later Housing advancement changes Stables material progress. The President knows none of the recipient/Department/Housing results until a new valid presentation is authored.

The trace may also end at any earlier step. Inaction, delay, refusal, continued monitoring, or an unresolved hold is a valid non-dramatic outcome.

---

# 11. Dependency boundary and verification

## 11.1 Permitted graph growth

The structural POP graph may add only:

- pure lower-level `program-implementation.ts` and `housing.ts` owner modules;
- their narrow content/configuration/seed dependencies;
- a stateless I4 adapter and I4 configuration/types/operations;
- atomic POP runtime/persistence/session expansion;
- bounded I4 tests.

The checker must continue rejecting:

- `IntegratedPartialRuntimeSession`, integrated/production session aliases, or synchronized I10 state;
- `createIntegratedPartialRuntimeState` as the POP composition factory;
- `ProductionGameView`, `ProductionPlayerAction`, `availablePlayerActions`, or `dispatchPlayerCommand`;
- action-prefix dispatch;
- opaque I10 saves;
- Stage 1/opening-usability source, tests, artifacts, or ancestry;
- Population, legislative-session, integrated-information, legal-contest, media, public-belief, or I5+ owners in the POP entry graph;
- audit/full-state getters as player-facing projection input;
- playable UI imports.

A lower-level module also used by I10 is permitted. A whole-session or broad composition dependency is not.

## 11.2 Required verification for a future implementation

The future candidate must run:

- targeted I1-I4 tests, including all hostile/counterfactual and persistence proofs here;
- unchanged accepted I3 Labor workstream/escalation tests plus exact two-definition/two-rule rejection tests;
- live/restore observation-authority, monitoring-claim, supplemental-evidence, and Department-handling provenance tests;
- POP structural/import/ancestry checks over the actual expanded entry graph;
- accepted lower-level I6/I7 artifact reconstruction and Housing tests;
- normal I10 boot/restore/regression tests;
- the full accepted coverage gate in canonical GitHub Actions at the exact final SHA.

`verify:pop0-bounded` remains development convenience only and is not acceptance certification.

The merge base and `origin/main` must remain exactly:

```text
44c1724962830225e6fc34f41d0df0cfdb7dfec0
```

---

# 12. Explicit I5+ exclusions

I4 does not design or implement:

- employment stocks/flows, plant closure, Labor simulation, Income estimates, or supplier spillovers;
- autonomous Congress, sponsors, committees, leaders, bills, votes, bargaining, or legislative positions;
- governors, recipients as general autonomous actors, organizations, media, publication, public belief, approval, or public response;
- the quiet healthcare/maternity condition or proactive search/investigation;
- a Population owner or ordinary-person identity/linkage changes;
- generalized White House staff AI, Department AI, recipient AI, or general IT-failure simulation;
- a global workstream/escalation/artifact catalogue, generalized document-production system, or third POP workstream/rule;
- new presidential instrument kinds, direct agency orders, fiscal commitments, public communications, legislative offers, external-recipient dispatch, or final act catalogue;
- final Cabinet/staff personalities, hiring, turnover, competence, or universal capacity;
- elections, succession, incapacity, Vice-Presidential control, or new ControlBinding behavior;
- rollback, branching, production migration, or alternate histories;
- playable Briefing, Attention, Country Watch, Workstream, dossier, evidence, history, calendar, or Housing UI;
- final product balance, Early Access scope, roadmap, or changes to `main`.

The I4 typed office and Department handling acts are bounded proof machinery. They prove ownership and causal separation; they are not accepted general staff autonomy.

---

# 13. Review and stop gate

Detached design review must answer:

> **Does this contract compose the accepted implementation and material Housing owners directly, observe them only through bounded claim-lineaged HUD authority, surface one inherited problem through legitimate agency/office/presidential boundaries, and permit presidential requests to lead only through source-provenanced canonical recipient/Department handling—without duplicate truth, I10 wrapping, omniscience, direct Housing outcome control, or I5+ behavior?**

Outcomes:

- **PASS:** a separate authority document may authorize POP0-I4 coding within this exact boundary;
- **REVISE:** repair only identified I4 owner, identity, information, causality, persistence, fixture, or boundary ambiguities;
- **REJECT:** the design would recreate I10, duplicate Housing truth, collapse agency/White House knowledge, or give the President direct domain control.

Until detached design review passes and separate coding authority is issued:

## **DESIGN ONLY — DO NOT IMPLEMENT POP0-I4**
