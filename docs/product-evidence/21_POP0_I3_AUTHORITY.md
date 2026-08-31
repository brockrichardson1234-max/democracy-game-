# POP0-I3 — Acceptance Authority

Status: **POP0-I3 ACCEPTED RUNTIME/EVIDENCE AUTHORITY. POP0-I4 DESIGN MAY BEGIN. POP0-I4 IMPLEMENTATION REMAINS UNAUTHORIZED. NOT MAIN-BRANCH, PRODUCT/ROADMAP/RELEASE, OR PRODUCTION-MIGRATION AUTHORITY.**

Authority chain:

- POP0-I2 accepted authority: `a3766f6136a83b40409f6fadb2d54102a6357576`;
- POP0-I3 repaired design: `46402f7b856cb6c38fa993713fa2a48408d65ef9`;
- POP0-I3 final design re-audit: `5e7214694d7aa53b48ae3cb2795ac3c9cdcb4cc2` — **PASS**;
- POP0-I3 implementation authority: `a4dbf3f4509b0f5f4968243a6dfbe9d47025cb34`;
- original POP0-I3 implementation chain ending at `573c39ea55046b92fb3289690fbf780a88ff7c98`;
- detached implementation audit: `4044965f04efa6dceed080d172f12ac3ab4dfa06` — **REVISE**;
- semantic repair: `b037b6af1e3a8bfcce4fda20009869519d3f49e3`;
- verification-worker stabilization: `e6dba2027c5aae8684ae4f8eb5464186429833ee`;
- final detached implementation re-audit: `7412e144287d14245fd4f9bd7e9f6a50f8ffc6be` — **PASS**;
- accepted production merge base: `44c1724962830225e6fc34f41d0df0cfdb7dfec0`.

Controlling I3 contract:

- `docs/product-evidence/15_POP0_I3_EXECUTABLE_CONTRACT.md` at `46402f7b856cb6c38fa993713fa2a48408d65ef9`.

Final accepted POP0-I3 implementation/evidence SHA:

```text
e6dba2027c5aae8684ae4f8eb5464186429833ee
```

---

# 1. Accepted I3 question

POP0-I3 is accepted as evidence for:

> **Can the player intervene through real presidential authority without global action IDs, hidden instrument fan-out, or direct control of recipient outcomes?**

Within the bounded POP0 fixture, the answer is **yes**.

This acceptance is not a claim that the full commercial game, final White House organization, final instrument catalogue, staff AI, user interface, or full Living Country world is complete.

---

# 2. Accepted runtime responsibilities

The accepted I3 baseline now includes:

- session-owned authenticated presidential `ControlBinding` distinct from presidential presentation/knowledge identity;
- immutable escalation creation and append-only terminal escalation lifecycle;
- immutable reserved reviews and append-only terminal review lifecycle;
- deterministic end-exclusive expiration/default and recipient-response deadline processing;
- derived Presidential Attention that may be empty;
- bounded escalation presentation distinct from escalation creation;
- one coordination-only administration workstream with append-only transitions;
- locally bound presidential options rather than a global action catalogue;
- exact typed visible instrument previews;
- immutable presidential decisions;
- exact preview-to-instrument structural/hash equivalence;
- two bounded I3 instrument families:
  - `REQUEST_OFFICE_ANALYSIS`;
  - `REQUEST_WORKSTREAM_COORDINATION`;
- one-recipient dispatch attempts and technical delivery outcomes;
- office-owned instrument receipt distinct from technical delivery;
- typed recipient capability authority;
- recipient-owned accept/narrow/delay/refuse/no-action behavior;
- causally supported recipient constraint evidence;
- separately created recipient-owned office assignments under persisted typed authorization scope;
- recipient response/assignment distinct from workstream transition;
- reference-only historical indexing that does not grant knowledge;
- exact format-3 persistence and deterministic restore/continuation;
- structural import-boundary protection against Stage 1, I10 whole sessions, global player actions, player-facing full state, and later domain owners.

---

# 3. Accepted invariants

Future work must preserve these accepted distinctions unless an upstream authority is explicitly amended and reviewed:

```text
record exists globally
!= office possesses/knows it
!= office may cite it
!= President was shown it

escalation exists
!= escalation was presented
!= Attention item exists

PresidentialRecipientBinding
!= ControlBinding

presidential decision
!= instrument
!= dispatch attempt
!= technical delivery
!= office receipt
!= recipient disposition
!= office assignment
!= assignment result
!= presidential return knowledge

workstream linkage
!= domain truth
!= office knowledge
!= recipient outcome

historical index membership
!= knowledge
```

The President does not directly write recipient-owned outcomes.

No instrument may contain hidden or post-confirmation behavior beyond its visible preview.

No accepted/narrowed recipient disposition may be widened through a later office assignment.

---

# 4. Accepted persistence/version boundary

POP0-I3 acceptance freezes the current proof format at:

```text
runtime schema:          3
save format:             3
configuration version:   0.3.0-pop0-i3
scenario version:        0.3.0-pop0-i3
history identity:        pop0.history.primary
```

Format-2 saves remain unsupported by I3 unless a later separately reviewed migration explicitly authorizes deterministic conversion.

Load does not rerun deadlines, dispatch, receipt, disposition, assignment, presentation, or ControlBinding reconciliation.

---

# 5. Verification authority

Canonical acceptance evidence includes GitHub Actions run:

```text
33348434587
head SHA: e6dba2027c5aae8684ae4f8eb5464186429833ee
conclusion: SUCCESS
```

Verified gate:

```text
58 / 58 test files PASS
737 / 737 tests PASS
POP structural graph: 15 modules PASS
production graph: 70 modules PASS
typecheck PASS
lint PASS
authenticated artifact reconstruction PASS
production build PASS
built-runtime verification PASS
```

The final verification-only commit changes worker concurrency from two to one and changes no assertions, timeout ceilings, fixtures, or runtime/product semantics.

---

# 6. Scope that remains explicitly unaccepted

POP0-I3 acceptance does **not** accept or authorize:

- inherited Housing integration into the POP operating layer;
- employment stocks/flows or regional material consequences;
- autonomous congressional initiative behavior;
- governors, organizations, media, public belief, or quiet healthcare condition;
- player-facing Briefing/Attention/Country Watch/Workstream/Evidence/Dossier/History UI;
- generalized staff AI, personality, competence, or administration-wide capacity;
- final Cabinet/EOP structure;
- final instrument catalogue;
- public statements, fiscal commitments, legislative offers, agency directives, or external-recipient act families;
- elections, succession, incapacity, Vice-Presidential control, or successor ControlBinding creation in POP;
- rollback/alternate-history branching;
- production migration or changes to `main`;
- POP0-I4 implementation or later stages.

---

# 7. Carried watchpoints

The final re-audit watchpoints remain binding review concerns for later work:

1. `officeCanCiteOccurrence(...)` must not be generalized into knowledge from workstream membership, technical delivery, or other structural relationships without an explicit receipt/authorship/possession rule;
2. the typed assignment authorization binding, not free-text assignment objective prose, controls executable scope;
3. the fixed Elena Ward ended-ControlBinding identity rule must be replaced by explicitly reviewed binding lineage before any POP succession/control feature;
4. full verification runtime cost is a maintenance problem and may be optimized only without weakening evidence or assertions.

---

# 8. Next-stage authority

POP0-I3 is closed as accepted runtime evidence.

The next bounded activity may be **POP0-I4 design only**, under the controlling POP0 master contract and accepted upstream authority.

POP0-I4 design must be reviewed as a candidate before any I4 runtime code is authorized.

No POP0-I4 implementation may begin from this document alone.

---

# 9. Final authority statement

## **POP0-I3 — ACCEPTED**

Accepted implementation/evidence:

```text
e6dba2027c5aae8684ae4f8eb5464186429833ee
```

Accepted review closure:

```text
7412e144287d14245fd4f9bd7e9f6a50f8ffc6be
```

`main` remains frozen at:

```text
44c1724962830225e6fc34f41d0df0cfdb7dfec0
```

POP0-I4 design may begin. POP0-I4 coding remains unauthorized.