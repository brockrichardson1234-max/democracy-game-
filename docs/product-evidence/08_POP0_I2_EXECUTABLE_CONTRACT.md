# POP0-I2 — Office Knowledge and Presentation Executable Contract

Status: **IMPLEMENTATION-DESIGN CANDIDATE — DOCUMENTATION ONLY.** This document does not authorize coding. POP0-I2 implementation waits for detached design review and a separate instruction.

Accepted parent authority:

- I1 authority: `07_POP0_I1_AUTHORITY.md` at `3ba55c40df3fba1d541ae46e2efeb5044955ce9d`;
- accepted I1 implementation/evidence: `460a3acb9bcfd628895ad6908c04da3c79de076f`;
- accepted production merge base: `44c1724962830225e6fc34f41d0df0cfdb7dfec0`;
- controlling POP-0 contract: `00_PRESIDENTIAL_OPERATING_PROOF_EXECUTABLE_CONTRACT.md`, as repaired and accepted by documents 02 and 04.

This contract narrows the authorized I2 increment. Accepted parent contracts control any conflict.

---

# 1. Question and pass gate

POP0-I2 asks:

> **Can different administration offices possess, retrieve, assess, disagree about, and present information without becoming one mind?**

I2 passes only if one canonical operating world proves:

1. selected offices persist independently from their current holders;
2. source possession, metadata notice, access, retrieval, substantive receipt, assessment, synthesis, and presidential presentation remain separate canonical facts;
3. assignments and queue order belong to individual offices;
4. two offices make materially different assessments from the same immutable evidence through valid receipt paths;
5. synthesis preserves the original assessments and disagreement;
6. the President receives only an explicitly bounded presentation;
7. all new owner states restore exactly and idempotently;
8. I1 boundaries, I10 regression, and canonical CI remain green;
9. no I3+ behavior enters the composition.

Any shared administration inbox, global knowledge set, office-agnostic workload pool, UI-only knowledge flag, or player-facing full-state API fails I2.

---

# 2. Exact proof package

## 2.1 Offices and holders

I2 contains exactly six operating offices:

| Office ID | Office | I2 responsibility | Current fictional holder |
|---|---|---|---|
| `pop0.office.chief-of-staff` | Chief of Staff / Presidential Operations | assignments, cross-office receipts, synthesis, presentation | Dana Okafor (`pop0.actor.dana-okafor`) |
| `pop0.office.nec` | National Economic Council | economic assessment | Maya Chen (`pop0.actor.maya-chen`) |
| `pop0.office.omb` | Office of Management and Budget | supportability boundary and blocked queue | Rafael Ortiz (`pop0.actor.rafael-ortiz`) |
| `pop0.office.legislative-affairs` | Legislative Affairs | independent office identity and queue state only | Tessa Monroe (`pop0.actor.tessa-monroe`) |
| `pop0.office.labor` | Department of Labor | source possession and measurement-bounded assessment | Naomi Mercer (`pop0.actor.naomi-mercer`) |
| `pop0.office.hud` | Housing and Urban Development | independent agency-office identity only | Luis Ortega (`pop0.actor.luis-ortega`) |

The presentation recipient is President Elena Ward (`pop0.actor.president-elena-ward`). This binding validates presentation history; it does not create a seventh office queue, decision state, or playable presidential API.

Staff Secretary is not a canonical office in I2. Direct typed transfers record the source and recipient. I2 also excludes the Vice President, DPC, IGA, HHS, Counsel, NSC, Press, and the complete Cabinet/White House hierarchy.

## 2.2 Configuration identity

I2 retains:

```text
configurationId: presidential-operating-proof
scenarioId: us-presidential-operating-proof-v0
classification: APPROXIMATED_NON_HISTORICAL_PRODUCT_PROOF
epoch: 2029-02-05T08:00:00-05:00
```

Configuration and scenario versions advance from `0.1.0-pop0-i1` to `0.2.0-pop0-i2`.

Office, actor, artifact, fixture-time, access-policy, and worked-trace identities belong in the POP0 configuration or test fixture, never in general transitions.

---

# 3. Office versus officeholder

An office is the persistent institutional owner. Its records and work survive a change in holder. The administration directory separately records:

```text
OfficeholderAssignment
- assignment ID
- office ID
- actor ID
- effective from / effective until
- acting status
- provenance reference
```

Exactly one current assignment exists for each selected office at the epoch. I2 does not implement turnover gameplay, but validation must permit a later successor without moving or recreating the office's records.

An assessment identifies both its producing office and its authoring officeholder assignment. Interpretations, assumptions, confidence, limitations, and recommendations live in immutable assessment artifacts—not in a universal personality engine or free-floating `administrationOpinion` field.

State shaped as `MayaChen.necInbox` is prohibited. The direction is office state → current officeholder assignment → actor identity.

---

# 4. Canonical ownership

I2 adds four owner-state families beside the accepted calendar owner.

## 4.1 Administration directory

Owns current/historical officeholder assignments and the presidential recipient binding. It owns no office records, queues, assessments, or presentation content.

## 4.2 Partitioned office operations

Each selected office has one state keyed by office ID:

```text
OfficeOperationsState
- office ID
- assignments owned by this office
- ordered active-queue assignment references
- office-local deadline/default records
```

The enclosing collection is only a serialization container. Invariants:

- every assignment has exactly one lead office and one canonical record;
- other offices may be requesters or consultants, not duplicate owners;
- the active queue contains references, not copied summaries;
- queue mutation in one office cannot reorder another office;
- no `administrationQueue`, global capacity pool, or aggregate workload truth exists.

## 4.3 Information-route ledger

Owns immutable artifacts and exact movement records:

```text
source and assessment artifacts
institution-possession occurrences
White House index entries
office-specific metadata notices
office-specific access entitlements
retrieval requests/results
substantive office receipts
artifact revision/supersession links
```

Every occurrence identifies the actual institution or office. Artifact presence in the ledger never grants arbitrary read access. An assessment may resolve content only through that office's valid receipt, or its valid same-owner source possession.

## 4.4 Presidential presentation history

Owns append-only records of exactly what the configured President was shown. Presented portions reference immutable artifact/section IDs; mentioned but unseen attachments remain explicit non-presented references.

It owns no Attention, unread/read UI state, decision, action, workstream, or second copy of an artifact.

Derived office views may project records from these owners, but no separately serialized inbox/index may compete with canonical state.

---

# 5. Information-state ladder

I2 preserves this non-equivalence:

```text
artifact exists
≠ source institution possesses it
≠ White House index entry exists
≠ a particular office received metadata notice
≠ that office is entitled to retrieve content
≠ that office retrieved it technically
≠ substantive content entered that office's records
≠ an officeholder assessed it
≠ the President received any part of it
```

Required record boundaries:

| Record | Minimum binding content |
|---|---|
| Evidence artifact | immutable artifact/version ID, source institution, as-of/release times, section IDs, access class, provenance, revision lineage |
| Possession | artifact, possessing institution, time, acquisition provenance |
| Index entry | existence metadata, owner, vintage, access class, available sections; no substantive evidence |
| Metadata notice | index reference, one recipient office, notice time/path |
| Access entitlement | one office, artifact/class, allowed section scope, effective interval, authority |
| Retrieval | requester, artifact/scope, notice, evaluated entitlement, times, result/failure |
| Receipt | recipient office, exact artifact/section scope, successful retrieval or same-owner possession, time, path, deduplication ID |

Retrieval results are limited to `AVAILABLE_AT_OFFICE_BOUNDARY`, `ACCESS_DENIED`, `NOT_FOUND`, and `FAILED`. Technical availability does not equal substantive receipt.

One office's receipt never fans out. Each later transfer creates a distinct receipt. Assignment source references do not grant access.

The proof fixture contains one configured synthetic preliminary Labor evidence artifact rooted at `CONFIGURED_SYNTHETIC_PROOF_ROOT`. It is routing evidence only—not an employment simulation, plant closure, material economic truth, or later POP proof thread.

Prohibited shortcuts include global `officeKnowsArtifactIds`, `whiteHouseKnows`, UI `read/seen` flags as semantic knowledge, background prefetch as receipt, and fixture visibility as access.

---

# 6. Assignments and queues

Every assignment records identity, requester, lead office, objective/output, source/index references known at creation, consultations, authority/provenance, creation time, deadline, status, failure reason, result artifact IDs, and any superseding assignment.

Allowed statuses:

```text
QUEUED | IN_PROGRESS | BLOCKED | COMPLETED
DELAYED | REFUSED | CANCELLED | SUPERSEDED
```

Rules:

- assignment does not grant evidence access;
- each queue reference resolves to an assignment owned by that office;
- each active assignment appears exactly once; terminal assignments appear zero times;
- `COMPLETED` requires a valid result artifact;
- block, delay, refusal, or cancellation requires a reason and occurrence time;
- load never retries or resumes work;
- queue order, deadlines, status, and results round-trip exactly.

The fixture includes separate NEC and OMB assignments. NEC can complete while OMB remains blocked for lack of access. No universal workload/capacity, staffing points, or Housing-versus-employment tradeoff exists in I2.

---

# 7. Assessments, disagreement, and synthesis

An immutable assessment artifact records:

- producing office and authoring officeholder assignment;
- exact source receipt/possession and section lineage;
- assignment reference where applicable;
- as-of/created times;
- proposition IDs and judgments;
- claimed confidence separately from evidentiary support;
- assumptions, limitations, optional recommendation;
- provenance and revision/supersession lineage.

Assessments cannot alter their evidence or become canonical economic truth.

The required disagreement uses the same source artifact/version and common proposition `supplier-spillover-beyond-observed-regions`:

| Office | Required judgment | Basis |
|---|---|---|
| Labor | `NOT_SUPPORTED_BY_CURRENT_EVIDENCE` | observed regional weakness; source does not measure broader supplier effects |
| NEC | `PLAUSIBLE_UNDER_STATED_SUPPLIER_ASSUMPTION` | same observed weakness plus an explicit analytical assumption |

OMB lacks substantive access. It may produce only a bounded “not estimable from currently available evidence” assessment from metadata and the failed retrieval; it cannot claim to assess unseen sections.

Chief of Staff must receive Labor and NEC assessments through separate receipts before synthesis. The synthesis cites both unchanged artifacts, preserves their different proposition judgments, attributes assumptions/limits to their authors, and may state an additional synthesis judgment without overwriting either source.

---

# 8. Presidential presentation history

Each presentation records:

```text
presentation ID and deduplication identity
recipient actor/constitutional-office reference
presenting office and presenter officeholder assignment
presentation time
artifact/version IDs
exact shown section/portion IDs
referenced-but-not-shown attachment/section IDs
presentation purpose/provenance
revision/supersession status
```

The required trace shows the President only two configured summary portions of the Chief of Staff synthesis and notes the Labor artifact as an attachment. It explicitly does not present the Labor regional table/methods, full NEC assessment, or OMB substantive evidence.

Receiving a synthesis does not imply receipt of everything in its lineage. Redisplay is a read-only projection. A genuinely later presentation requires a new identity, time, and scope; duplicate identity/deduplication keys are rejected. Future UI state cannot create or erase presentation history.

---

# 9. Permitted transitions and ordering

I2 may add only typed owner operations to:

- create/validate/copy/restore initial directory assignments;
- create, reorder, start, block, delay, refuse, cancel, supersede, or complete an office assignment;
- register possession, index metadata, deliver notice, evaluate retrieval, and admit a substantive receipt;
- author an assessment from valid office-owned scope;
- receive assessments and author a provenance-preserving synthesis;
- record one bounded presidential presentation;
- append revision/supersession links without rewriting history.

No transition auto-delivers to every office or the President. No transition creates Attention, a presidential choice, a workstream, or an outgoing instrument.

All operations use the authoritative POP calendar instant, never wall-clock time. Causal order is:

```text
possession → index/notice → retrieval → receipt
→ assessment → synthesis → presentation
```

Independent same-instant operations must be order-invariant after deterministic sorting by configured phase/order/stable identity.

---

# 10. Deterministic worked path

This is a test trace, not scheduled autonomous politics or a playable story.

1. **08:00:** the synthetic Labor artifact exists; Labor possesses it; six office states and active holders exist; no other office or President has substantive receipt.
2. **08:05–08:15:** White House indexes Labor metadata; NEC and OMB separately receive notice; NEC has scoped access and OMB does not; Chief of Staff creates separate NEC and OMB assignments in their own queues.
3. **08:20–08:30:** NEC retrieval succeeds technically, then a distinct receipt admits summary/table sections; OMB retrieval is denied and its assignment becomes blocked; Legislative Affairs and HUD remain unchanged.
4. **08:40–09:00:** Labor and NEC author the materially different assessments in section 7; OMB records only that a supported estimate is unavailable.
5. **09:05–09:30:** Chief of Staff separately receives Labor and NEC assessments, creates the preserving synthesis, and presents only its two configured summary portions to the President.

A checkpoint between NEC technical retrieval and substantive receipt proves that distinction survives restoration. The entire path creates no presidential decision, Attention, employment state, congressional action, or replacement drama.

---

# 11. Atomic persistence

I2 advances the presidential operating runtime schema and save-format versions. The save contains the accepted calendar owner plus all four I2 owner families directly—never an opaque I10 save or synchronized legacy session.

An I1 format-1 save cannot silently acquire invented I2 history on load. Unless a separately reviewed deterministic migration is included within I2 scope, the I2 parser rejects format 1 with an unsupported-version error.

Every new canonical field must enter atomically across:

```text
runtime/configuration types
factory
validator and referential checks
deep-copy surface
save envelope
exact-shape parser
restoration
round-trip and tamper tests
```

Restoration rejects unknown/duplicate/cross-owner references, invalid holder intervals, wrong-office or duplicate queue entries, receipts without valid routes, assessments outside receipt scope, synthesis from unreceived artifacts, presentation outside presenter scope, causal timestamp inversions, and broken revision chains.

Required save checkpoints:

1. after notice but before retrieval;
2. after NEC technical retrieval but before receipt;
3. with NEC and OMB in different queue states;
4. after disagreement but before synthesis;
5. after bounded presidential presentation.

At every checkpoint, restored state equals uninterrupted state; save → load → save is byte-stable; load appends no event; returned state is defensively copied; identical subsequent operations yield identical state.

---

# 12. Dependency and API boundary

Permitted reuse is limited to accepted calendar/order utilities, configuration/hash validation, exact-shape persistence patterns, genuinely owner-neutral immutable-reference primitives, and narrow lower-level office distinctions that carry no I10 session state.

The existing `information.ts` and `integrated-information.ts` states are Housing/Population/integrated-runtime specific. I2 may not import either whole state as the presidential knowledge owner or infer office receipt from public/exposure records. Owner-neutral primitives may be reused/extracted only when their meaning fits an actual I2 consumer and their closure stays clean.

The expanded POP factory import graph must reject:

- `IntegratedPartialRuntimeSession`, the I10 integrated state, or a parallel I10 session;
- `production-session.ts`, `ProductionGameSession`, or an opaque format-11 save;
- `ProductionGameView`, `ProductionPlayerAction`, `availablePlayerActions`, or `dispatchPlayerCommand`;
- Stage 1/opening-usability source or artifacts;
- Housing/Population proof-thread state;
- audit-only/full-state session APIs;
- playable UI imports.

The checker must traverse every new I2 entry path; lexical absence alone is insufficient. `getOperatingState()` remains shell/test evidence and may not enter any player-facing graph.

---

# 13. Acceptance tests

## Identity and ownership

- exactly six selected office IDs and six active fictional holders;
- office state keyed by office, not actor;
- alternate-holder fixture changes the holder without moving office records;
- Legislative Affairs and HUD remain independent empty/nonparticipant states.

## Knowledge ladder

- each ladder step creates none of the later steps;
- NEC notice/receipt creates no OMB, Chief of Staff, or presidential receipt;
- technical retrieval without receipt restores distinctly;
- assessment without valid office source scope is rejected;
- background preload and UI flags never become knowledge.

## Queues and disagreement

- NEC and OMB assignments live in different states and mutate independently;
- OMB can remain blocked while NEC completes;
- Labor and NEC assess the same evidence version but disagree materially;
- confidence remains distinct from evidentiary support;
- synthesis requires receipts and preserves both original assessments;
- no assessment mutates evidence or another office's state.

## Presentation and persistence

- President receives only explicit portions; referenced attachments remain unseen;
- redisplay does not duplicate presentation;
- every checkpoint is deterministic/idempotent;
- all I2 owner families participate in type/copy/save/parse/restore;
- exact-shape and referential tampering is rejected.

## Boundaries and regression

- merge base remains `44c1724962830225e6fc34f41d0df0cfdb7dfec0` and main remains unchanged;
- Stage 1 and forbidden import closure remain absent;
- no UI or player-facing full-state consumer exists;
- normal I10 boot/restore and the complete baseline verification remain green;
- targeted I2 tests and canonical GitHub Actions pass at the exact candidate SHA.

---

# 14. Explicit I3+ exclusions

I2 does not design or implement:

- Presidential Attention, escalation, player decisions, or player commands;
- administration workstreams, presidential orders, instruments, or dispatch;
- Housing adaptation, employment simulation, or the Housing/Labor tradeoff;
- congressional initiative/procedure behavior;
- governors, organizations, media, public belief, or healthcare conditions;
- recipient response behavior;
- Staff Secretary simulation or full Cabinet/White House hierarchy;
- staff hiring, turnover gameplay, capacity points, or universal competence;
- final personalities, relationships, search, briefing, dossier, history, or UI;
- production migration or changes to `main`.

Configured evidence and typed test operations may prove information ownership. They may not disguise later proof-thread behavior as I2 fixture content.

---

# 15. Review and stop gate

Detached design review must answer:

> **Does this contract prove independent office possession, retrieval, assessment, disagreement, synthesis, and bounded presidential presentation in one canonical world—without a shared White House mind, duplicate state, UI-only knowledge, player-facing full state, or I3+ behavior?**

Outcomes:

- **PASS:** a separate coding instruction may authorize this exact boundary;
- **REVISE:** repair only identified design ambiguities;
- **REJECT:** the ownership or route would create a shared-mind or temporary architecture.

Until detached review and a separate coding instruction:

## **DESIGN ONLY — DO NOT IMPLEMENT POP0-I2**
