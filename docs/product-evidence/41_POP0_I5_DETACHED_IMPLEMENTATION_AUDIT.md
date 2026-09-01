# POP0-I5 — Detached Implementation Audit

Status: **REVISE I5 ONLY. POP0-I6 REMAINS UNAUTHORIZED.**

Audited implementation candidate:

`f5acf860dd7ec6dab38be2a243b72de6832f731a`

Direct implementation-authority parent:

`ef52e7b35191abf8abf2cb385aaef2f7c16d43fe`

Controlling design contract:

`docs/product-evidence/35_POP0_I5_EXECUTABLE_CONTRACT.md`

## Verdict

The I5 concurrent-world implementation substantially satisfies the product and ownership design: Employment, Congress, external actors, media, maternity-service access, Housing, presidential inquiry, administration routing, OMB contention, persistence, and deterministic advancement coexist without a global story owner or I6/UI leakage.

One blocking persistence/evidence-integrity defect remains.

## R5I-01 — BLOCKING: rehashed I5 evidence claims are not fully reconciled to canonical source records

The accepted I5 contract requires every created domain-evidence claim to retain exact source record/version, observation time, authority ID, and source hash. It also explicitly requires restoration to reject rehashed persisted tampering with source time/scope and publication/evidence claims.

The implementation creates claim-level lineage correctly, including `sourceOwnerId`, `sourceRecordId`, `sourceRecordHash`, `observedAt`, and `observationAuthorityId`.

However, the restore validators do not consistently re-derive those claims from the canonical owner record.

For Employment evidence, `validateEmployment()` currently checks that:

- the release opportunity exists;
- the artifact is I5 domain evidence;
- the artifact references the configured observation authority;
- the artifact's own `canonicalArtifactHash` matches its current contents; and
- the release's `sourceOccurrenceIds` refer to material occurrence IDs.

It does not require each persisted claim's `sourceRecordId`, `sourceRecordHash`, `observedAt`, claim family, or value to equal the canonical source record and configured observation/release semantics.

Therefore a persisted artifact can potentially be modified, have its claim value/source hash or other claim semantics rewritten, have `canonicalArtifactHash` recomputed over the modified artifact, and still satisfy the current validator because the artifact authenticates its own edited contents.

The same class of risk must be checked and closed for every I5 `I5DomainEvidenceArtifact` family, including:

- Employment releases;
- Congress-to-administration initiative/window evidence;
- HHS maternity-service evidence;
- OMB review-product evidence;
- any analysis-only income/coverage evidence implemented through the same artifact type.

A canonical artifact hash is integrity against accidental mutation only when its trusted expected contents are independently derived. It cannot itself establish that a claim is true of its claimed canonical source.

### Required repair

Add one bounded I5 evidence-lineage validator (shared or family-specific) that, for every persisted I5 domain-evidence claim:

1. resolves the exact canonical/configured source owner and source record identified by the claim;
2. proves the source record exists under that owner or authenticated configuration source;
3. recomputes and matches `sourceRecordHash` from that independently resolved source;
4. proves `observedAt` is not earlier than the source occurrence/effective time and is within the observation authority interval;
5. proves the claim's `observationAuthorityId`, claim family, source owner, permitted record kind, and scope are allowed by the configured authority/delivery route;
6. re-derives or otherwise independently validates the claim value/semantic payload from the source record/configured transformation rather than accepting the persisted value because the artifact hash matches;
7. validates artifact-level `sourceOccurrenceIds`, revision/supersession lineage, as-of/release time, producer, and provenance against the same source family;
8. rejects consistently rehashed tampering during restore.

Do not build a generalized Living Country evidence framework in I5. Close only the concrete I5 artifact families already implemented.

### Required hostile proofs

At minimum, persisted save tampering must reject after recomputing the artifact's `canonicalArtifactHash` when an attacker changes:

- an Employment claim value;
- an Employment claim `sourceRecordHash` or source record identity;
- a Congress initiative/window claim value or source identity;
- an HHS maternity claim value/source lineage;
- an OMB review-product claim source/value;
- an analysis-only income/coverage claim if present in the candidate;
- observation time or authority scope in any above artifact.

Include at least one positive counterfactual proving a legitimately revised/superseding Employment vintage still restores and remains distinct from its preliminary vintage.

## What passes and must not be reopened

The unchanged-gate review found no present blocker in:

- exact I5 one-commit ancestry above implementation authority;
- closed administration/capability/external-human composition;
- RegionalEmployment stock/flow and plant-overlay ownership;
- independent material progression;
- the complete Congress `beginSponsorSearch → seekMemberSponsorship → introduceSponsoredProposal → advanceIntroducedProposalToGate` lower-owner route;
- sponsorship-refusal path and outer window expiration;
- Congress lower-runtime sole ownership of sponsorship/introduction/procedure results;
- external governor/organization autonomy model;
- two-outlet media editorial separation;
- quiet maternity-service material progression;
- proactive HHS inquiry boundary;
- office/external-recipient communication separation;
- OMB-specific capacity/bookings/reprioritization/supersession semantics;
- concurrent advancement ordering;
- format-5 owner composition and no-replay restoration structure;
- I4 Housing ownership/regressions;
- structural POP/I10/Stage-1/I6 exclusions.

## Repository / certification evidence

The implementation candidate is exactly one commit above implementation authority. The reported canonical CI run `33467726516` is green at the exact candidate SHA with 63/63 test files and 774/774 tests, plus authenticated artifact reconstruction, typecheck, lint, structural checks, production build, and built-runtime verification.

Green certification does not waive R5I-01 because the current hostile suite does not exercise consistently rehashed false I5 claim semantics.

## Disposition

**REVISE POP0-I5 ONLY.**

Repair R5I-01, add bounded hostile restoration tests, rerun the targeted I1-I5/POP gate and one canonical full exact-SHA certification, then stop for unchanged-gate detached POP0-I5 implementation re-audit.

Do not begin POP0-I6 or UI work. Do not modify `main`.
