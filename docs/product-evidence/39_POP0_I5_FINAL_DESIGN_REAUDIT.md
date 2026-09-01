# POP0-I5 — Final Detached Design Re-Audit

Status: **DETACHED DESIGN RE-AUDIT — PASS. NOT POP0-I5 ACCEPTANCE AUTHORITY, NOT POP0-I5 IMPLEMENTATION AUTHORITY, NOT POP0-I6+ AUTHORITY, NOT MAIN-BRANCH AUTHORITY.**

Reviewed final repaired design:

`20e584b57bd0ec559c7c27babb79874e1c1825a4`

Direct parent / controlling design re-audit correction:

`17179c64d224ed5f626e569ace501d35e79e11c2`

Earlier repaired design:

`9b133f527eb0ba88f29417ae4ce80c303ea40023`

The intervening PASS review at `e8fd9247fc65501cb48294c48948c74cbedd6a38` remains superseded by the correction at `17179c64d224ed5f626e569ace501d35e79e11c2`; this final re-audit evaluates the correction repair directly.

Accepted POP0-I4 authority:

`9def41f987a81de2cdc25b610eb169df9a666b5d`

Accepted production merge base / unchanged `main`:

`44c1724962830225e6fc34f41d0df0cfdb7dfec0`

---

# 1. Verdict

## **PASS**

R5D-04A is closed. The final POP0-I5 design is sufficiently executable to support a separately authorized implementation candidate.

The repair is bounded to the congressional transition/window seam and does not reopen the already-closed D5-01, D5-02, D5-03, or central D5-04 ownership findings.

---

# 2. R5D-04A — closed

The contract now defines the complete lower legislative sequence exactly:

```text
BEGIN_SPONSOR_SEARCH
→ beginSponsorSearch()

SEEK_MEMBER_SPONSORSHIP
→ seekMemberSponsorship(...)

INTRODUCE_SPONSORED_PROPOSAL
→ introduceSponsoredProposal(...)

ADVANCE_INTRODUCED_PROPOSAL_TO_CONSIDERATION_GATE
→ advanceIntroducedProposalToGate()
```

This matches the accepted direct `LegislativeRuntimeState` API:

- `beginSponsorSearch()` moves the direct lower state into `SPONSOR_SOUGHT` / `SOUGHT`;
- `seekMemberSponsorship(...)` alone resolves the sponsorship attempt from direct lower `PoliticalState`, may return the same lower state on nonacceptance, and records accepted sponsor actor/office/assignment/version only in lower state;
- `introduceSponsoredProposal(...)` requires direct lower stage `SPONSOR_SOUGHT`, sponsorship `ACCEPTED`, the exact accepted sponsor actor and assignment, and the accepted proposal version still equal to the current agenda version before changing lower state to `INTRODUCED_IN_ORIGIN` / `INTRODUCED`;
- `advanceIntroducedProposalToGate()` requires canonical lower introduction before changing the direct lower stage to the origin consideration gate.

The I5 adapter may impose the reviewed recipient evidence, assessment, role/capability, effective-assignment, and open-window requirements before calling those accepted transitions, but it may not replace or copy their substantive lower results.

---

# 3. One-window semantics are executable

The outer `CongressionalProcedureOpportunity` is now one end-exclusive window with:

- append-only `OPENED | EXPIRED` lifecycle;
- derived `OPEN | EXPIRED` status;
- one append-only `CongressionalProcedureTransitionAttemptOccurrence` per exact transition kind;
- at-most-once use for each of the four transition kinds;
- exact transition eligibility derived from current direct lower state rather than an outer copied procedure stage.

A sponsorship attempt consumes only `SEEK_MEMBER_SPONSORSHIP`. It does not close the whole window or consume later transition kinds. If sponsorship is not accepted, introduction and gate advancement remain unused but ineligible because their direct lower-state preconditions are absent.

At `current == closesAt`, expiration is processed before any new attempt and blocks every remaining unused transition kind without rewriting lower native procedure/deadline state.

---

# 4. Outer reference semantics remain non-owning

For every lawful lower call, the outer owner may record only:

- a real `LegislativeTransitionAttemptAuthorization`;
- exact transition kind;
- exact eligibility/receipt/role authority;
- call time;
- lower pre-state hash;
- lower post-state hash;
- authority/provenance;
- an optional lower occurrence ID only when the accepted lower owner actually emitted one.

The outer owner may not store sponsorship acceptance, sponsor result, introduction status, proposal stage, consideration-gate result, or another lower legislative result.

A state hash is not an occurrence identity. Neither the adapter nor the Historical Record may manufacture a lower sponsorship/introduction/gate occurrence merely because the lower state changed.

A nonaccepting sponsorship attempt may legitimately have equal pre/post hashes; that proves an attempted lower call, not lower success.

---

# 5. Required hostile and persistence closure

The repaired contract now requires hostile/live/restore proof that:

- introduction without canonical accepted lower sponsorship by the exact actor/assignment/version rejects;
- gate advancement without canonical lower introduction rejects;
- removing introduction authorization after accepted sponsorship leaves lower state at accepted `SPONSOR_SOUGHT` and blocks gate advancement;
- sponsorship refusal/nonacceptance cannot be relabeled as introduction, successful procedure use, or another lower result;
- each of the four exact lower transition kinds may be attempted at most once and only under its direct lower-state precondition;
- the exact end-exclusive deadline blocks every still-unused transition;
- outer records cannot copy lower legislative results or fabricate lower occurrence references;
- restoration validates the real outer authorization/attempt chain and lower pre/post hashes without replaying legislative transitions.

These requirements close the residual executable ambiguity identified by `38_POP0_I5_DESIGN_REAUDIT_CORRECTION.md`.

---

# 6. Findings retained as closed

This final repair does not reopen the previously closed I5 design:

- D5-01 — rule-local presidential option model and HHS-only proactive inquiry;
- D5-02 — OMB-owned team/period capacity, immutable reprioritization, and assignment supersession;
- D5-03 — exact `3 / 9 / 10 / 9 / 10` administration closure, exact nine recipient-capability records, and one authenticated external-human identity/linkage registry;
- D5-04 core — outer Congress state gates attempts only while direct `LegislativeRuntimeState` alone owns sponsorship, introduction, procedure, actor-position, and terminal results;
- direct `RegionalEmploymentState` and one-count plant overlay;
- autonomous governors/organizations and bounded media;
- materially real quiet maternity-service condition and claim-scoped observation authority;
- accepted I4 Housing/implementation owners unchanged;
- exact four workstreams and four escalation-rule ceiling;
- deterministic concurrency, format-5 persistence, reference-only history, and no screenplay/replacement-drama rule;
- no Population/public-belief owner, UI, Stage 1, I10 whole-session dependency, global player-action surface, I6+, production migration, or `main` modification.

---

# 7. Repository and verification evidence

The final repaired candidate is exactly one commit above the controlling correction and changes only:

`docs/product-evidence/35_POP0_I5_EXECUTABLE_CONTRACT.md`

Repair size:

- 45 additions;
- 14 deletions;
- 59 changed lines.

Canonical GitHub Actions run:

`33447155375`

Exact head SHA:

`20e584b57bd0ec559c7c27babb79874e1c1825a4`

Conclusion:

**SUCCESS**

Observed unchanged full gate includes:

- typecheck PASS;
- repository/runtime boundary checks PASS;
- accepted POP0-I4 structural boundary PASS across 24 runtime modules;
- production import graph PASS across 72 local modules;
- authenticated U.S. topology/I4/I6/I7 artifact reconstruction PASS;
- lint PASS;
- 62 / 62 test files PASS;
- 757 / 757 tests PASS;
- production build PASS;
- built production runtime PASS.

`verify:pop0-bounded` remains development feedback only and is not acceptance certification.

Repository integrity at re-audit:

- remote POP branch pointed exactly at the repaired candidate before this audit;
- candidate direct parent is exactly `17179c64d224ed5f626e569ace501d35e79e11c2`;
- merge base with `main` remains exactly `44c1724962830225e6fc34f41d0df0cfdb7dfec0`;
- `main` remains exactly `44c1724962830225e6fc34f41d0df0cfdb7dfec0`.

---

# 8. Acceptance boundary

This PASS is detached review evidence only.

It does **not** accept POP0-I5 design as project authority, authorize POP0-I5 implementation, authorize POP0-I6+, migrate production, or modify `main`.

A separate explicit project-authority action is required before POP0-I5 coding begins.

## **POP0-I5 FINAL DESIGN RE-AUDIT — PASS.**
