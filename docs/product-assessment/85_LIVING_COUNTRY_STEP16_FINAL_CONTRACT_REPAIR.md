# Living Country Step 16 — Final Contract Repair

Status: **LIVING-COUNTRY STEP-16 REPAIR CANDIDATE — PRESERVED FOR DETACHED RE-AUDIT. NOT ACCEPTED PRODUCT, ARCHITECTURE, UI, RUNTIME, SCHEMA, EARLY-ACCESS, PLAYER-START, ROADMAP, OR IMPLEMENTATION AUTHORITY.**

This document repairs only the findings returned against:

- `83_LIVING_COUNTRY_LIVE_BOUNDED_KNOWLEDGE_REQUIREMENTS.md`
- candidate commit: `5a332fe7625249c4c48551f278ac5723e6f4bb33`
- detached audit: `84_LIVING_COUNTRY_STEP16_DETACHED_AUDIT.md`
- audit commit: `1dce71b9fcdba49e97a95595f1077581b44fcd0b`
- audit verdict: **REVISE — 1 blocking finding, 4 bounded clarifications**

Accepted authority beneath this repair:

- Step 5 presidential-game authority;
- Living Country Steps 1–15 authority.

Where this document conflicts with `83`, this document controls.

No Step 16 authority exists until the unchanged gate passes and a separate authority receipt accepts the repaired composite.

---

# 1. Repair disposition

The Step-16 center remains:

> **Live knowledge must preserve what existed, who possessed it, who could access it, who actually received it, what was presented to each person/office, what they may legitimately know or remember, and what may currently be retrieved/disclosed.**

The repair adds a necessary boundary:

> **Canonical presidential knowledge is branch-specific. Human player memory across abandoned or rewound futures is external meta-knowledge that the simulation cannot erase and must not misclassify as legitimate in-world knowledge.**

The repair also locks:

- immutable semantic presentation history;
- redisplay/idempotency;
- separate memory/retrieval/disclosure/verification state;
- current UI projections versus historical cognition.

---

# 2. Canonical history identity and save semantics

## 2.1 Core invariant

**[HARD INVARIANT LC-KNOWR01] Every load-bearing receipt, presentation, knowledge, decision, search/retrieval action, assignment, and evidence-at-time relation belongs to one canonical world/history branch identity and one effective time.**

A save file or checkpoint is not merely a bag of current values.

It belongs to a particular canonical historical prefix.

## 2.2 Same-history serialization reload

The following is ordinary serialization:

```text
canonical branch B
at time T
→ save
→ application closes/restarts
→ load branch B at time T
```

This does not create a new history.

The load must restore, without new occurrences:

- canonical world state;
- possession;
- access/restriction;
- retrieval history;
- office receipts;
- presidential presentations;
- personal/office knowledge state where represented;
- evidence vintages;
- assignments;
- notifications;
- decision deadlines;
- branch identity.

No search, retrieval, briefing, presentation, investigation, or notification is rerun simply because the state was deserialized.

## 2.3 Historical rollback / branch restart

The following is fundamentally different:

```text
branch B observed through T2
→ player loads checkpoint from T1 < T2
→ continuation resumes from T1
```

The continuation after T1 is a new or resumed canonical branch/history identity, conceptually `B'`, unless the product explicitly defines the prior continuation as discarded and restores the original T1 branch identity with the same semantics.

Either way, the active canonical history after rollback contains only the historical prefix legitimately present through T1.

Information that existed only in the abandoned T1→T2 continuation is not part of the active President's canonical knowledge ledger.

## 2.4 Rollback does not create time-travel knowledge

Forbidden:

```text
July court ruling observed by player
→ load May save
→ May President canonically knows July ruling
```

Also forbidden:

```text
July surprise attack observed
→ load May
→ staff forecast gains hidden knowledge of attack
```

Abandoned-future facts cannot enter:

- current branch actor beliefs;
- staff analyses;
- forecasts;
- search results;
- Country Watch;
- dossiers;
- decision packages;
- random/stochastic actor decisions;
- historical record;
- causal inputs.

They may enter the new branch only if independently caused/observed again.

---

# 3. Human player meta-knowledge boundary

## 3.1 Core invariant

**[HARD INVARIANT LC-KNOWR02] The game may guarantee canonical in-world bounded knowledge. It cannot guarantee that a human who voluntarily rewinds after seeing a future has forgotten that abandoned future.**

That human memory is external player meta-knowledge.

## 3.2 Current-branch player/President identity

Within one unreverted canonical branch:

> Substantive presidential information visibly presented to the human player is treated as presented to the President.

This remains controlling.

After rollback, content observed only in an abandoned future does not remain canonical presidential knowledge merely because the human remembers it.

## 3.3 Product honesty

If arbitrary rollback remains available, the product must not claim strict human epistemic purity under rewind.

Later product authority may choose among options such as:

- ordinary rollback with accepted meta-knowledge;
- ironman/no-rollback mode;
- limited checkpoint rules;
- explicit `alternate timeline` labeling.

Step 16 does not choose the UX policy.

It requires semantic honesty about the limitation.

## 3.4 Player action influenced by meta-knowledge

The simulation cannot reliably determine why the human selected an action.

Therefore, after rollback the player may choose differently because they remember the abandoned future.

That choice is still a legitimate player command in the new branch if institutionally available.

But the simulation may not fabricate a supporting in-world fact such as:

```text
President knew Senator X would defect
```

unless that knowledge was independently supported in the active branch.

## 3.5 No meta-knowledge laundering

A player action chosen because of rewind knowledge does not authorize staff, UI, or history to invent a source explaining it.

The historical record may simply show the President chose the action on the information actually available.

---

# 4. Rollback metamorphic requirement

Given one T1 checkpoint with identical package, branch prefix, and deterministic state:

### Clean path

```text
load T1 without ever observing later continuation
```

### Rollback path

```text
observe through T2
→ load same T1 checkpoint
```

The two active simulations at T1 must expose identical **canonical**:

- world state;
- actor state;
- administration state;
- access state;
- receipt/presentation history;
- evidence vintages;
- current Presidential knowledge ledger;
- search/index/retrieval space;
- assignments/deadlines;
- RNG/causal continuation state as defined by the save system.

Only the external human player's memory may differ.

A later divergence caused by the human choosing a different action is legitimate player intervention, not canonical information leakage.

---

# 5. Branch-sensitive Historical Record

## 5.1 Active record

The live Historical Record shows the active canonical branch.

It does not present abandoned branch events as things that happened in the active world.

## 5.2 Optional alternate/replay history

A future product may preserve abandoned branches for replay/debug/player history.

If exposed during live play, they must be clearly labeled noncanonical/alternate and must not become current President information merely through availability.

Developer/audit branch inspection remains outside ControlBinding.

## 5.3 Cross-branch identifiers

A fact or actor identity may exist in several branches.

Occurrences, receipts, decisions, evidence vintages, and knowledge state remain branch-specific after divergence.

`same actor ID` does not mean `same future memory` across branches.

---

# 6. Immutable semantic presentation history

## 6.1 Core invariant

**[HARD INVARIANT LC-KNOWR03] A load-bearing semantic presentation is an immutable historical occurrence. Mutable `read/unread/new/seen` UI metadata may reference it but cannot replace or rewrite it.**

A presentation occurrence preserves, where relevant:

- branch/history identity;
- recipient person/office;
- artifact/communication/source;
- semantic content scope conveyed;
- time;
- presentation route;
- version/vintage;
- access/classification state at presentation;
- source/briefing lineage.

## 6.2 Mark unread

Marking an item unread again is permitted as navigation state.

It does not erase the presentation occurrence or knowledge.

## 6.3 Workflow read status

An office system may mark a packet reviewed/processed.

That does not prove presidential presentation unless the presentation event exists.

## 6.4 Notification previews

If a notification visibly contains substantive information, the preview itself is semantic presentation of that information.

A notification containing only metadata such as:

> New report available

conveys only that metadata.

---

# 7. Redisplay and idempotency

## 7.1 Core invariant

**[HARD INVARIANT LC-KNOWR04] Reopening identical already-presented content ordinarily does not create a second independent information acquisition, receipt, evidentiary confirmation, or cognition event.**

The interface may retain navigation/view telemetry separately if later needed.

## 7.2 New information within familiar artifact

A new knowledge event may occur when reopening exposes something genuinely new, such as:

- attachment not previously opened;
- newly unredacted section;
- revised vintage;
- new annotation;
- new staff synthesis;
- corrected table;
- newly delivered contextual explanation.

The semantic delta must be identifiable.

## 7.3 Repetition through genuinely different routes

The same proposition may legitimately be encountered through several independent presentation routes:

- briefing;
- senator call;
- news report;
- governor memo.

Those are separate presentation/communication occurrences even when the proposition overlaps.

Evidence dependence and derivative lineage remain Step-7/8 concerns.

---

# 8. Memory, source access, disclosure, and verification remain separate

## 8.1 Core distinction

A person who once received content may later be in a state such as:

```text
remembers substantive claim
cannot reopen source
cannot lawfully disclose source/content
cannot currently verify exact wording
may or may not be permitted to rely operationally on it
```

These dimensions may not collapse into one `knows=true/false` flag.

## 8.2 Source access

Current source retrievability may be revoked without erasing memory.

## 8.3 Disclosure authority

A person may remember content that remains classified, privileged, confidential, sealed, embargoed, or otherwise restricted from disclosure.

Disclosure is an action governed by current authority/rules.

## 8.4 Verification

A person may remember the gist of a source but lack current source access sufficient to verify exact wording, table values, or provenance.

Staff may appropriately label such memory as unverified/currently inaccessible.

## 8.5 Operational reliance

Some legal/institutional processes may require an official record, admissible evidence, current intelligence product, or documented authority rather than private memory alone.

Remembering something does not satisfy every procedural evidentiary requirement.

Exact legal rules remain deferred.

---

# 9. Current projections versus historical cognition

## 9.1 Core invariant

**[HARD INVARIANT LC-KNOWR05] A current recomputed UI projection may summarize currently accessible state but is not evidence that the President or staff historically held that synthesis.**

Thus:

```text
current UI projection
≠ historical staff product
≠ historical presidential belief
```

unless a presentation/analysis occurrence establishes that relationship.

## 9.2 Recompute after reload

A noncanonical interface view may be recomputed after same-history reload.

It may use only state accessible in the restored branch.

It creates no historical receipt merely by recomputing.

If the recomputed view visibly presents a new substantive current synthesis to the player that was never shown before, it is current player presentation but not retroactive historical staff cognition.

## 9.3 Revision/declassification effects

A current view may change after:

- evidence revision;
- new retrieval;
- declassification;
- office transition;
- new staff assessment.

Those changes do not rewrite prior views or knowledge-at-time.

---

# 10. Corrected save/load adversarial proofs

## Proof O — ordinary serialization

```text
President sees summary at T
→ saves at T
→ application restarts
→ loads same save
```

Required:

- presentation remains historical fact;
- no duplicate presentation;
- unopened attachment remains unknown;
- current access unchanged unless the saved state itself says otherwise.

## Proof P — rollback after future observation

```text
May checkpoint
→ advance to July
→ observe July court ruling
→ load May checkpoint
```

Required canonical result:

- May President does not know July ruling;
- staff/actors do not know July ruling;
- searches/forecasts do not contain July ruling;
- abandoned July history is noncanonical to active branch;
- human may remember it externally.

## Proof Q — different player decision after rollback

```text
first branch:
May → President waits → July bad outcome

rollback:
May → player acts differently using human meta-knowledge
```

Required:

- alternate May action is permitted if institutionally available;
- history records only actual May evidence in the new branch;
- system does not invent a May warning that justified the choice;
- later world may diverge normally.

## Proof R — alternate branch retained for replay

If the product later preserves the July branch for a timeline/replay screen:

- it is marked alternate/discarded;
- opening it in developer/replay mode does not inject those facts into active President knowledge;
- live ControlBinding surfaces remain branch-scoped.

---

# 11. Corrected anti-cheat requirements

In addition to `83`, Step 16 rejects:

- treating rollback as ordinary reload;
- carrying abandoned-future knowledge into current branch actor/staff state;
- pretending the human player forgot an observed abandoned future;
- laundering rewind meta-knowledge into fabricated presidential evidence;
- forecasts reading abandoned branches;
- search indexing future/discarded branch facts;
- same actor ID carrying post-divergence memory across branches;
- mutable `read` status replacing immutable presentation history;
- reopening one memo creating repeated independent knowledge/evidence;
- access loss being represented as memory loss;
- remembered gist implying current source verification;
- current UI recomputation becoming retroactive staff cognition.

---

# 12. Re-audit obligations

The unchanged Step-16 gate remains controlling.

PASS now additionally requires:

1. ordinary same-history serialization and historical rollback remain distinct;
2. canonical knowledge is branch-scoped;
3. human meta-knowledge after rollback is explicitly outside canonical semantics;
4. abandoned branches cannot leak into active AI, staff, search, forecasts, history, or UI;
5. presentation history is immutable and branch-specific;
6. redisplay is epistemically idempotent unless new semantic content appears;
7. memory, source access, disclosure, verification, and procedural reliance remain separable;
8. current projections do not backdate cognition.

---

# 13. Explicitly unchanged from `83`

The repair leaves intact:

- existence/possession/access/receipt/presentation/knowledge separation;
- summary versus attachment scope;
- player-visible-content rule within the active branch;
- office records versus officeholder memory;
- staff-turnover semantics;
- second-term continuity;
- incoming-President transition;
- classification/declassification history;
- revision/withdrawal history;
- open-screen vintage protection;
- bounded search/retrieval;
- UI synthesis constraints;
- dossier bounds;
- Historical Record semantics;
- public-information notice rules;
- proactive investigation;
- artificial-amnesia and accidental-omniscience prohibitions;
- cross-surface consistency;
- candidate deferrals.

---

# 14. Re-audit disposition

## **READY FOR UNCHANGED FINAL STEP-16 BINARY RE-AUDIT**

The blocking save/rollback ambiguity is closed conceptually:

> **A save can restore one canonical history exactly; a rollback can create a different canonical continuation; neither operation can erase the human's memory, but only the active branch's legitimately acquired information belongs to the President and simulation.**

No authority is claimed by this repair.