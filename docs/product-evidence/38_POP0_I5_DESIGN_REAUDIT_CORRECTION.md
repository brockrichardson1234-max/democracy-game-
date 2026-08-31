# POP0-I5 — Detached Design Re-Audit Correction

Status: **DETACHED DESIGN RE-AUDIT CORRECTION — REVISE. NOT POP0-I5 IMPLEMENTATION AUTHORITY, NOT POP0-I6+ AUTHORITY, NOT MAIN-BRANCH AUTHORITY.**

Reviewed repaired design:

`9b133f527eb0ba88f29417ae4ce80c303ea40023`

Prior detached design audit:

`d48d6ab1fb9b4ef8e94711fe3a0ca1e91d5ce424`

Intervening PASS re-audit superseded by this correction as review evidence:

`e8fd9247fc65501cb48294c48948c74cbedd6a38`

Accepted POP0-I4 authority:

`9def41f987a81de2cdc25b610eb169df9a666b5d`

Accepted production merge base / unchanged `main`:

`44c1724962830225e6fc34f41d0df0cfdb7dfec0`

---

# 1. Verdict

## **REVISE — ONE BOUNDED RESIDUAL D5-04 FINDING**

D5-01, D5-02, and D5-03 are closed. The repaired design also closes the central D5-04 dual-ownership problem: the outer owner gates attempts while `LegislativeRuntimeState` alone owns sponsorship and procedure results.

One executable gap remains in the exact lower legislative transition sequence. It should be repaired without reopening the rest of I5.

---

# 2. R5D-04A — the lower sponsorship-to-consideration sequence omits introduction

The repaired contract requires I5 to reach draft, sponsorship, introduction, and a consideration-gate opportunity.

It defines one outer `CongressionalProcedureOpportunity` whose permitted lower transition kinds are only:

- `SEEK_MEMBER_SPONSORSHIP`;
- `ADVANCE_INTRODUCED_PROPOSAL_TO_CONSIDERATION_GATE`.

The accepted lower legislative owner, however, has three distinct required transitions after sponsor search begins:

1. `seekMemberSponsorship(...)` may change sponsorship from `SOUGHT` to `ACCEPTED`, while the procedure stage remains `SPONSOR_SOUGHT`;
2. `introduceSponsoredProposal(...)` changes the sponsorship status to `INTRODUCED` and the stage to `INTRODUCED_IN_ORIGIN`;
3. `advanceIntroducedProposalToGate(...)` requires `INTRODUCED_IN_ORIGIN` before it can create the consideration-gate stage.

The repaired I5 contract authorizes no exact route for `introduceSponsoredProposal(...)`. An implementation would therefore have to invent whether introduction is automatic, separately scheduled, adapter-owned, or covered by an unlisted opportunity.

The same outer opportunity currently has a lifecycle described as `OPENED | USED | EXPIRED`, but it permits more than one sequential lower transition. The contract does not say whether `USED` is terminal after the sponsorship attempt, whether multiple use occurrences are legal, or how transition order and at-most-once use are enforced.

Finally, the contract says a `USED` lifecycle occurrence references a real lower transition occurrence/state-version identity. The accepted lower sponsorship/introduction/gate functions mutate direct lower state but do not necessarily emit a separate immutable occurrence identity. I5 must not invent a synthetic lower occurrence merely to satisfy the outer history/reference model.

---

# 3. Required bounded repair

Repair only the congressional attempt/window subsection of `35_POP0_I5_EXECUTABLE_CONTRACT.md`.

Define the complete exact lower sequence, including:

- sponsor-search eligibility/attempt;
- `seekMemberSponsorship(...)`;
- `introduceSponsoredProposal(...)` after accepted sponsorship by the exact accepted sponsor/assignment;
- `advanceIntroducedProposalToGate(...)` only after canonical lower introduction.

Choose one exact outer-window model:

1. separate bounded attempt opportunities for the sequential lower transitions; or
2. one open window with append-only per-transition attempt/use occurrences, explicit stage order, and an at-most-once rule for each permitted transition kind.

If one window is retained, a first sponsorship attempt must not ambiguously make the entire window terminal before a lawful introduction/gate attempt. Define what happens when sponsorship is not accepted and whether that attempt consumes only its own transition opportunity.

Outer records may own only attempt eligibility, authorization, timing, and window use. They may not copy sponsorship acceptance, introduction status, consideration-gate result, or any other lower procedure result.

For lower-reference semantics, use the minimum honest rule:

- reference a real lower occurrence if the lower owner actually creates one; otherwise
- let the outer attempt/use occurrence reference its own real `LegislativeTransitionAttemptAuthorization`, exact transition kind, and lower pre/post hashes without claiming a nonexistent lower occurrence identity.

The Historical Record must not manufacture a lower sponsorship/introduction/gate occurrence that exists only in the index.

Add design-level hostile requirements proving:

- no gate advancement is possible without canonical lower introduction;
- removing the introduction authorization leaves the lower runtime at accepted sponsorship and prevents gate advancement;
- sponsorship refusal/nonacceptance cannot be mislabeled as introduction or successful window use;
- each lower transition is attempted at most once under its exact stage precondition;
- exact deadline expiration blocks every still-unused permitted transition;
- outer records contain no copied lower result.

---

# 4. Findings retained as closed

Do not reopen:

- D5-01 rule-local presidential options and HHS-only proactive inquiry;
- D5-02 OMB team/period ownership, immutable reprioritization, and narrow-assignment supersession;
- D5-03 exact `3/9/10/9/10` administration closure, nine capabilities, and external-human registry;
- the gate-only Congress ownership seam itself;
- Employment, governors/organizations, media, quiet maternity-service state, Housing composition, persistence, concurrency, or explicit exclusions.

---

# 5. Repository and stop boundary

The repaired candidate is exactly one documentation-only commit above the prior audit. Canonical CI run `33443542290` passed at exact SHA `9b133f527eb0ba88f29417ae4ce80c303ea40023`.

The repository is healthy; this REVISE concerns only the omitted lower legislative transition/window semantics.

Do not implement POP0-I5. Do not begin POP0-I6+. Do not modify `main`.

After the one bounded documentation repair, rerun the unchanged design gate and stop for detached re-audit.

## **POP0-I5 DESIGN RE-AUDIT CORRECTION — REVISE.**
