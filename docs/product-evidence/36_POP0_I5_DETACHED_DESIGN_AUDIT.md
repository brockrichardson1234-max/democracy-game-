# POP0-I5 — Detached Design Audit

Status: **DETACHED DESIGN AUDIT — REVISE. NOT POP0-I5 IMPLEMENTATION AUTHORITY, NOT POP0-I6+ AUTHORITY, NOT MAIN-BRANCH AUTHORITY.**

Reviewed design candidate:

`587e1b14d05869694e20ded8a41198eadff6bd2b`

Direct parent / POP0-I4 acceptance authority:

`9def41f987a81de2cdc25b610eb169df9a666b5d`

Accepted POP0-I4 implementation/evidence:

`fea5c0a4a0fa7bf63188f8db92aa889ac6edcab6`

Accepted production merge base / unchanged main:

`44c1724962830225e6fc34f41d0df0cfdb7dfec0`

---

# 1. Verdict

## **REVISE — FOUR BOUNDED EXECUTABILITY FINDINGS**

The I5 product direction is sound. The contract correctly targets concurrent autonomous pressure rather than a scripted quest chain and preserves the accepted owner/knowledge doctrine.

The repair does **not** need to redesign Employment, media, governors/organizations, the quiet condition, the Housing composition, or the overall concurrency proof.

Four seams remain insufficiently executable against the accepted I4 runtime. In each case, implementation would currently have to invent new authority or ownership semantics rather than implement a reviewed contract.

---

# 2. D5-01 — presidential act origination and local option model are not closed

## Finding

The accepted I4 intervention substrate has exactly two presidential instrument kinds:

- `REQUEST_OFFICE_ANALYSIS`;
- `REQUEST_WORKSTREAM_COORDINATION`.

Its only instrument-bearing escalation option is `REQUEST_SCOPED_ANALYSIS_AND_COORDINATION`, and accepted validation requires that option to contain exactly two previews in exact order: analysis, then coordination. Every canonical presidential decision is also bound to a source escalation and escalation presentation.

I5 adds exactly three new instrument kinds:

- `AUTHORIZE_LEGISLATIVE_POSITION`;
- `REQUEST_INTERGOVERNMENTAL_CONTACT`;
- `AUTHORIZE_PUBLIC_STATEMENT`.

The contract defines payload content but not the exact local-option/decision structure through which those new visible previews may be selected without weakening the accepted I3/I4 exact bundle.

The same gap affects the quiet-condition proof more directly. The contract requires a proactive presidential HHS investigation before the hidden maternity condition is known, using the existing `REQUEST_OFFICE_ANALYSIS` kind and only a general/presented coverage-gap question. But the accepted decision model currently requires an escalation and escalation presentation; no I5 canonical source record is defined for a proactive, non-Attention inquiry.

Without a repaired design, implementation would have to choose between:

- widening the existing I3 option into a generic action bundle;
- fabricating an escalation merely to make proactive inquiry possible;
- bypassing the accepted decision/preview/ControlBinding path;
- or inventing a new presidential act source with no reviewed authority semantics.

## Required repair

Define the minimum additive I5 presidential-act model while preserving existing I3/I4 rules byte-for-byte in meaning.

The repair must specify:

1. exact new option kind(s), if any, permitted only for I5 escalation rules;
2. exact visible-preview cardinality/order rules for each new I5 escalation option;
3. exact mapping from each I5 escalation rule to its allowed local option kinds and allowed instrument payload kinds;
4. no generic/global action catalogue and no "any payload list" option;
5. exact ControlBinding, preview/hash equality, presentation, decision, instrument, dispatch, receipt, disposition, and assignment requirements for the three new instrument kinds;
6. one explicit canonical source for proactive presidential inquiry when no escalation exists yet.

For proactive inquiry, define a narrow `PresidentialInquiryOpportunity` / `PresidentialInitiatedRequest` equivalent or another exact source record. It must:

- be available only from configured/presented general monitoring coverage or gap metadata, or a general service-access question;
- contain no hidden facility/catchment/service facts;
- preserve the same visible preview and exact payload/hash confirmation before authorization;
- require active ControlBinding;
- create only the existing typed `REQUEST_OFFICE_ANALYSIS` instrument;
- create no Attention item merely by existing;
- create no HHS result directly;
- be persisted/restored and historically indexed by its real canonical identity.

A proactive request must not require fabricating a quiet-condition escalation whose factual basis the President does not yet know.

---

# 3. D5-02 — OMB queue collision lacks a canonical capacity/authority mechanism

## Finding

The accepted office model owns assignments and `activeQueueAssignmentIds`, and provides direct queue reorder plumbing. It does **not** currently own:

- named review teams;
- scheduled work periods;
- assignment-to-period reservation/consumption;
- full versus narrow product work requirements;
- a queue-reprioritization occurrence with authority/provenance;
- or deterministic capacity completion rules.

The I5 contract requires one named OMB team, two exact work slots, two incompatible full-depth assignments, narrower product duration, and a player-visible opportunity cost where reprioritization/narrowing/default changes later product scope or timing.

Those facts are behavior-driving canonical state. They cannot live only in fixture prose, derived projections, or implicit test timing.

The current direct `reorderOfficeQueue(...)` mutation also carries no canonical causal occurrence identifying who/what authorized that reorder. The I5 proof specifically needs the queue choice to have a typed cause and persistent consequence.

The contract additionally says a full assignment may become a narrower product after the collision, but the accepted assignment's `expectedProductKind` is immutable and its instrument-assignment authorization is scope-bound. The design does not state whether narrowing is decided before assignment creation, by a new recipient disposition, by superseding the assignment, or by another exact authority transition.

## Required repair

Define one minimum OMB-specific office-capacity extension, owned under `officeOperations` or another explicitly named canonical owner.

It must define at least:

- exact OMB team identity;
- exact configured available work periods;
- exact permitted product kinds and their required period/effort consumption;
- assignment booking/reservation/consumption state;
- conflict prevention so one team/period cannot satisfy incompatible work twice;
- one immutable queue/reprioritization occurrence with acting office/person, authority/source refs, prior/new order, occurredAt, and provenance;
- exact deadline/default interaction;
- exact restore validation.

Define exactly how the player/Chief of Staff causes a legal reprioritization through an accepted typed presidential/coordination route. Direct session-level queue mutation cannot itself be the product authority.

Define exactly how a narrower product becomes authorized without mutating the old assignment's scope in place. Prefer existing recipient narrowing or explicit assignment supersession if sufficient; otherwise define one narrow typed transition. Do not create a generic capacity system or administration-wide capacity score.

The repair must prove that changing queue order or selecting a permitted narrow route changes exact completion/scope while unrelated owners remain unchanged.

---

# 4. D5-03 — administration, human-linkage, and recipient-capability expansion is not exact enough

## Finding

The accepted I4 administration validator is still structurally closed to:

- 2 institutions;
- 6 offices;
- 7 administration actors;
- 6 officeholder assignments;
- 7 administration Population-linkage declarations;
- 4 recipient-capability authorities.

I5 adds HHS, HHS Secretary, Intergovernmental Affairs, Communications, three administration officeholders, congressional humans, three governors, and new instrument/capability families.

The contract says the administration expands atomically, but it does not state the exact new closed administration counts/sets that replace the accepted I4 ceilings. More importantly, the current `RecipientCapabilityAuthority` union contains only analysis and coordination capability shapes. The contract requires typed authority for three new instrument kinds and HHS analysis, but does not define their exact capability records or the complete I5 capability set.

The contract also requires every new congressional/governor human and every exact lower-legislative human to carry the `OUTSIDE_MODELED_ORDINARY_POPULATION_SCOPE` declaration, but it does not assign those non-administration declarations to one exact canonical configuration location. They cannot be smuggled into the presidential administration actor table merely to reuse I2 validation, and they cannot be duplicated independently by Congress/external-actor owners.

## Required repair

Define the exact bounded I5 administration substrate:

- exactly 3 presidential-administration institutions if HHS is the only new department;
- exactly 9 presidential-administration offices/holders if the only additions are HHS Secretary, Intergovernmental Affairs, and Communications;
- exactly 10 presidential-administration actor identities/population-linkage declarations if the existing President + six holders are retained and those three holders are added;
- preserve the accepted existing IDs and semantics unchanged.

If any count differs, state the exact replacement set and why.

Define the exact I5 recipient-capability authority union and configured set, including:

- HHS bounded analysis capability;
- legislative-position capability for Legislative Affairs;
- intergovernmental-contact capability for Intergovernmental Affairs;
- public-statement capability for Communications;
- any OMB product/capacity-related analysis capability change required by D5-02;
- all accepted I4 capabilities unchanged unless explicitly extended by exact permitted product/scope additions.

Each new capability kind must specify scope, narrowing rules if applicable, effective interval, authority, and provenance. Unknown/extra capability records reject.

Define one shared authenticated **configuration-level** I5 human identity/linkage registry (or an equally explicit single source) for congressional, gubernatorial, and any supporting legislative humans that are outside the administration directory. It must provide globally unique actor IDs and exact Population-boundary declarations, be referenced by Congress/external owners, and reject duplicate actor identities or incompatible linkage declarations. Do not create a Population owner.

---

# 5. D5-04 — Congress adapter seam risks dual sponsorship/procedure truth

## Finding

The intended ownership boundary is correct in principle: before adoption the POP `congressionalInitiative` owner owns formation opportunity/decision; after `INITIATE_DRAFT`, the direct `LegislativeRuntimeState` is supposed to be the only agenda, sponsorship, actor-position, and procedure truth.

However, the accepted lower legislative API does not consume an externally resolved sponsorship decision. `seekMemberSponsorship(...)` itself calls the lower political decision machinery and resolves sponsorship from the direct `PoliticalState`. Likewise, the accepted consideration gate derives from lower sponsorship/organization signals.

The I5 contract also says that relevant lawmakers resolve receipt/assessment-grounded actor decisions and then invoke accepted lower transitions. If implemented literally, that can create two decision layers for sponsorship:

```text
outer Congress actor assessment/decision
+ lower LegislativeRuntime sponsorship decision
```

The contract does not say which is authoritative when they disagree, nor whether the outer decision is merely permission to attempt the lower transition.

There is a second ownership mismatch around the "committee opportunity." The accepted `LegislativeRuntimeState` has chamber consideration gates but no canonical committee-opportunity/deadline object. The I5 contract alternately describes the direct runtime as owning relevant chamber/committee gates and a separately configured committee opportunity that opens/closes outside it. That needs one exact owner boundary.

## Required repair

Choose and document one exact seam.

Preferred minimal seam unless a lower-runtime extension is necessary:

1. `congressionalInitiative` owns only:
   - formation opportunity/decision before runtime creation;
   - recipient-scoped external evidence receipts/assessments used to determine whether a lawmaker has a valid **opportunity to attempt** a lower legislative act;
   - any separately modeled procedural-window availability that is explicitly not bill/procedure truth.
2. After `INITIATE_DRAFT`, `LegislativeRuntimeState` alone owns sponsorship acceptance, proposal stage, political actor positions, consideration-gate state, amendments, votes, deadlines native to that runtime, and terminal disposition.
3. If a receipt/assessment is required before sponsorship may be attempted, the adapter may gate whether `seekMemberSponsorship(...)` is called, but must not store a second sponsorship choice/result outside the lower runtime.
4. If I5 instead requires the receipt/assessment itself to causally determine the sponsorship choice, minimally extend the lower legislative owner with a typed actor-decision admission seam and remove/reconcile the existing internal re-decision. Do not keep both.
5. Define the exact `CongressionalProcedureOpportunity`/committee-window owner. If it is only an outer opportunity window, it may permit/prevent a lower transition but may not copy lower procedure status. If actual committee state is required, it must be added canonically to the legislative owner rather than represented only in the wrapper.
6. Exact-deadline expiration must be validated against whichever owner canonically owns the opportunity.

Counterfactuals must prove that removing a lawmaker's required receipt prevents the same attempt while leaving direct lower state unchanged, and that once a lower sponsorship/procedure occurrence exists there is no duplicate outer sponsorship/procedure truth.

---

# 6. What already passes design review

The following I5 design choices should be retained unless directly affected by the four repairs:

- one canonical `RegionalEmploymentState` with exact stock/flow reconciliation and a non-duplicating plant overlay;
- autonomous Employment progression independent of presidential engagement;
- analysis-only income/coverage estimates with no absent material owner mutation;
- separate external-actor receipts, assessments, actions/no-actions;
- two independent media outlets with publication distinct from truth, delivery, receipt, exposure, and belief;
- no aggregate public audience or public-belief owner;
- materially real maternity-service state that can remain undiscovered indefinitely;
- claim-scoped `DomainObservationAuthority`;
- no severity/global-threshold Attention;
- exact four workstream definitions and four escalation-rule ceiling in I5, subject to D5-01 option-path repair;
- accepted I4 Housing/implementation owners unchanged;
- concurrency rather than one mandatory quest chain;
- same-instant phase ordering principle;
- format-5 reject-rather-than-migrate rule;
- no replay on restore;
- reference-only history;
- no I6+, UI, production migration, Stage 1, I10 whole-session dependency, global action surface, or `main` modification.

The required no-screenplay and load-bearing counterfactual matrix is directionally strong. Implementation should retain the rule that green tests do not pass I5 if autonomous decisions are merely configured calendar beats.

---

# 7. Repository and verification evidence

The design candidate is exactly one commit above the POP0-I4 acceptance authority and changes only:

`docs/product-evidence/35_POP0_I5_EXECUTABLE_CONTRACT.md`

Canonical CI run:

`33436888037`

Exact head SHA:

`587e1b14d05869694e20ded8a41198eadff6bd2b`

Conclusion:

**SUCCESS**

The documentation-only candidate therefore does not fail because of repository health or existing regression behavior. The REVISE verdict is strictly about I5 executable authority/ownership seams that must be closed before code is authorized.

`main` remains:

`44c1724962830225e6fc34f41d0df0cfdb7dfec0`

---

# 8. Stop boundary

Do not implement POP0-I5 from the current design candidate.

Repair only `35_POP0_I5_EXECUTABLE_CONTRACT.md` unless a tiny directly necessary documentation-reference correction is unavoidable.

After the four findings are closed, run the unchanged documentation-design gate and stop for detached re-audit.

No POP0-I5 coding, POP0-I6+, UI, production migration, or `main` modification is authorized by this audit.

## **POP0-I5 DESIGN AUDIT — REVISE.**
