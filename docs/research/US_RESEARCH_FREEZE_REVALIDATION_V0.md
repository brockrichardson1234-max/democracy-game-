# U.S. Research Freeze-Time Mutable-P0 Revalidation V0

Status: **STEP 2 REVALIDATION COMPLETE — CANDIDATE FOR INDEPENDENT FREEZE REVIEW; NOT FROZEN.**

- Exact evidence base SHA: `fc2c8ab4a2df9e2c90175aa45060d8772265a82f`
- Governing Research Program / Audit Protocol SHA: `6267f805f37f646f4e8c651ea8ac54c65b715e99`
- Revalidation timestamp: `2026-08-22T05:23:56-04:00`
- Revalidation scope: every record in the exact-base `USR-MP0-001`–`USR-MP0-027` register
- Result totals: `UNCHANGED` **26**; `CHANGED` **1**; `UNAVAILABLE` **0**; total **27**

This artifact records freeze-time source revalidation only. It is not an audit or evidence-freeze decision. `CHANGED` for `USR-MP0-022` records a moved official guide locator, not a changed institutional proposition; the dependency is restored by `USR-SRC-0120`.

## Audit state entering revalidation

- Audit A: all original findings **CLOSED**.
- Audit B: all original findings **CLOSED**. The original Audit B findings-only reviewer returned `RECHECK_PASS` for `USR-AUD-B-002`, `USR-AUD-B-007`, and `USR-AUD-B-008` against exact SHA `fc2c8ab4a2df9e2c90175aa45060d8772265a82f`.
- Audit C: **CLEAR**.
- Open original `BLOCKER` / `HIGH` findings: **0**.

No finding was re-audited here. The B-002 product-resolution correction remains binding: the accepted proof is an owner-qualified system/process chain, not a same-dollar municipal transaction reconstruction.

## Revalidation records

Each record uses the required Research Program fields. Claim and source fields may contain lists or compact inclusive ranges because each `USR-MP0` record groups a dependency family.

### USR-MP0-001

```yaml
claimId: [USR-CLM-0010..0012, USR-CLM-0075, USR-CLM-0207]
sourceId: [USR-SRC-0002..0004, USR-SRC-0090]
mutableClass: current Code and decennial apportionment
originalValidatedAt: 2026-08-21
freezeRevalidatedAt: 2026-08-22T05:23:56-04:00
result: UNCHANGED
replacementSourceId: null
claimImpact: none; the two-senators rule, House-size/apportionment basis, and 2020 allocation remain supported
readinessImpact: none; rows 007, 014, and 016 retain their statuses
checkedAuthority: preliminary U.S. Code current to August 2026; official 2020 Census apportionment table
evidenceNote: No intervening law or apportionment replaced the relied-on current-decade topology.
```

### USR-MP0-002

```yaml
claimId: [USR-CLM-0017..0018, USR-CLM-0027..0038]
sourceId: [USR-SRC-0005, USR-SRC-0011..0013, USR-SRC-0016]
mutableClass: Congress-specific House rules, manual, and procedure
originalValidatedAt: 2026-08-21
freezeRevalidatedAt: 2026-08-22T05:23:56-04:00
result: UNCHANGED
replacementSourceId: null
claimImpact: none; ordinary voting, recorded votes, floor consideration, identical text, presentment, veto, and override propositions remain supported
readinessImpact: none; rows 003 and 006–008 retain their statuses
checkedAuthority: HMAN-119, published 2025-01-20, containing rules adopted 2025-01-03 for the 119th Congress
evidenceNote: The relied clauses remain the operative 119th-Congress rules; a stale sentence on a separate explanatory page remains excluded.
```

### USR-MP0-003

```yaml
claimId: [USR-CLM-0025, USR-CLM-0029, USR-CLM-0035, USR-CLM-0039..0040]
sourceId: [USR-SRC-0008..0009, USR-SRC-0014..0015]
mutableClass: Senate rules, precedents, and ordinary procedure
originalValidatedAt: 2026-08-21
freezeRevalidatedAt: 2026-08-22T05:23:56-04:00
result: UNCHANGED
replacementSourceId: null
claimImpact: none; classes, continuing rules, ordinary majority action, unanimous consent, and cloture bounds remain supported
readinessImpact: none; rows 003 and 006–008 retain their statuses
checkedAuthority: current official Senate Standing Rules and official Senate procedural/precedent materials
evidenceNote: The Senate continues its rules from Congress to Congress unless changed; no relied rule was superseded.
```

### USR-MP0-004

```yaml
claimId: [USR-CLM-0060..0070, USR-CLM-0076..0078]
sourceId: [USR-SRC-0021..0027]
mutableClass: presidential-election statutes and official procedures
originalValidatedAt: 2026-08-21
freezeRevalidatedAt: 2026-08-22T05:23:56-04:00
result: UNCHANGED
replacementSourceId: null
claimImpact: none; state ascertainment, elector appointment/meeting, certificates, congressional count/declaration, and January 20 transfer remain supported as distinct stages
readinessImpact: none; rows 005, 016–018, and 025 retain their statuses
checkedAuthority: current preliminary Title 3; NARA Electoral College roles/process and retained 2024 key-date materials
evidenceNote: Dated 2024 materials remain valid historical cycle evidence; current federal-stage propositions were checked against current law and NARA procedure.
```

### USR-MP0-005

```yaml
claimId: [USR-CLM-0202..0206]
sourceId: [USR-SRC-0085..0089]
mutableClass: geographic identifiers, boundaries, and product vintages
originalValidatedAt: 2026-08-21
freezeRevalidatedAt: 2026-08-22T05:23:56-04:00
result: UNCHANGED
replacementSourceId: null
claimImpact: none; state/DC identifiers, GEOIDs, and the selected 2025/119th-Congress product semantics remain supported
readinessImpact: none; rows 014 and 016 retain their statuses
checkedAuthority: 2025 TIGER/Line release 2025-09-23; 119th Congressional District products; TIGERweb revision through 2026-01-01
evidenceNote: The selected vintage remains identifiable and reproducible. Later boundary submissions do not invalidate the explicitly versioned 119th-Congress input.
```

### USR-MP0-006

```yaml
claimId: [USR-CLM-0207..0208]
sourceId: [USR-SRC-0090..0091]
mutableClass: apportionment and Electoral College allocation
originalValidatedAt: 2026-08-21
freezeRevalidatedAt: 2026-08-22T05:23:56-04:00
result: UNCHANGED
replacementSourceId: null
claimImpact: none; the 2020-Census allocations remain the relied basis for 2024 and 2028
readinessImpact: none; rows 007 and 016–017 retain their statuses
checkedAuthority: official Census 2020 apportionment results; NARA 2020-Census electoral allocation table
evidenceNote: The effective-election range and 538/270 totals remain unchanged.
```

### USR-MP0-007

```yaml
claimId: [USR-CLM-0211..0213]
sourceId: [USR-SRC-0092..0094]
mutableClass: population-estimate vintage, universe, layout, and revision status
originalValidatedAt: 2026-08-21
freezeRevalidatedAt: 2026-08-22T05:23:56-04:00
result: UNCHANGED
replacementSourceId: null
claimImpact: none; Vintage 2025 July 1, 2025 state/DC resident population remains a valid versioned canonical basis
readinessImpact: none; rows 015 and 023 retain their statuses
checkedAuthority: Census Vintage 2025 state totals/components and API/file documentation, released 2026-01-27
evidenceNote: The selected vintage is still the completed current vintage and remains reproducible; resident population is not relabeled as electorate.
```

### USR-MP0-008

```yaml
claimId: [USR-CLM-0079..0086, USR-CLM-0090..0091, USR-CLM-0138]
sourceId: [USR-SRC-0031..0037, USR-SRC-0056]
mutableClass: fiscal law, GAO fiscal authorities, and OMB apportionment procedure
originalValidatedAt: 2026-08-21
freezeRevalidatedAt: 2026-08-22T05:23:56-04:00
result: UNCHANGED
replacementSourceId: null
claimImpact: none; authorization, appropriation/budget authority, purpose/time/amount, apportionment, obligation, and outlay distinctions remain supported
readinessImpact: none; rows 009–011 and 025 retain their statuses
checkedAuthority: current preliminary Code; GAO Red Book current-edition page and Glossary; OMB Circular A-11 dated 2025-08-29 including section 120
evidenceNote: GAO's stated chapter-edition mix and OMB's current A-11 do not alter the relied fiscal-stage propositions.
```

### USR-MP0-009

```yaml
claimId: [USR-CLM-0087..0089]
sourceId: [USR-SRC-0038]
mutableClass: Uniform Guidance regulation
originalValidatedAt: 2026-08-21
freezeRevalidatedAt: 2026-08-22T05:23:56-04:00
result: UNCHANGED
replacementSourceId: null
claimImpact: none; federal-award, recipient, subrecipient, financial-obligation, and expenditure distinctions remain supported
readinessImpact: none; rows 011–013 retain their statuses
checkedAuthority: current eCFR Title 2 through 2026-08-20; 2026-08-17 title amendments checked
evidenceNote: The intervening Title 2 amendment affected Part 910, not Part 200.
```

### USR-MP0-010

```yaml
claimId: [USR-CLM-0092..0094, USR-CLM-0098..0099, USR-CLM-0106..0112, USR-CLM-0140]
sourceId: [USR-SRC-0039..0040]
mutableClass: HOME statute and current Code incorporation
originalValidatedAt: 2026-08-21
freezeRevalidatedAt: 2026-08-22T05:23:56-04:00
result: UNCHANGED
replacementSourceId: null
claimImpact: none; Public Law 119-101 remains controlling for the July 2026 amendments and authorization remains distinct from spendable budget authority
readinessImpact: none; rows 009 and 011–013 and 025 retain their statuses and transition bounds
checkedAuthority: Public Law 119-101 enacted 2026-07-11; current preliminary Title 42 status
evidenceNote: No later enactment displaced the relied provisions. The statute/regulation transition remains provision-specific.
```

### USR-MP0-011

```yaml
claimId: [USR-CLM-0093..0106, USR-CLM-0109..0111, USR-CLM-0140, USR-CLM-0217]
sourceId: [USR-SRC-0041, USR-SRC-0097]
mutableClass: HOME regulation, amendments, delay notes, and effective dates
originalValidatedAt: 2026-08-21
freezeRevalidatedAt: 2026-08-22T05:23:56-04:00
result: UNCHANGED
replacementSourceId: null
claimImpact: none; relied operational sections remain usable subject to the already-recorded 2026 statutory and indefinite-delay bounds
readinessImpact: none; rows 009 and 011–013 and 025 retain `READY`/`READY_WITH_BOUNDS`
checkedAuthority: full current 24 C.F.R. Part 92 through 2026-08-20; 91 FR 23014; eCFR change history through 2026-08-22
evidenceNote: No Part 92 amendment occurred after the original validation. Sections 92.250 and 92.253 remain among the indefinitely delayed provisions.
```

### USR-MP0-012

```yaml
claimId: [USR-CLM-0095..0104, USR-CLM-0108, USR-CLM-0140, USR-CLM-0175..0178, USR-CLM-0216]
sourceId: [USR-SRC-0042..0044, USR-SRC-0072..0074]
mutableClass: HUD HOME guidance, IDIS operations, reports, and program materials
originalValidatedAt: 2026-08-21
freezeRevalidatedAt: 2026-08-22T05:23:56-04:00
result: UNCHANGED
replacementSourceId: null
claimImpact: none; formula allocation, written-agreement/commitment, activity setup, funding, draw, expenditure, completion-report, and owner boundaries remain supported
readinessImpact: none; rows 012–013 and 023–026 retain their statuses
checkedAuthority: current HUD HOME FAQs; IDIS Online for HOME manual; IDIS reports guide and official archived/current report documentation
evidenceNote: Current HUD materials still describe setup/fund/draw/complete mechanics. Administrative completion remains explicitly separate from physical Housing truth.
```

### USR-MP0-013

```yaml
claimId: [USR-CLM-0113..0119, USR-CLM-0123..0128]
sourceId: [USR-SRC-0045..0055]
mutableClass: complementary HTF, CDBG, and LIHTC law, regulation, data, and program material
originalValidatedAt: 2026-08-21
freezeRevalidatedAt: 2026-08-22T05:23:56-04:00
result: UNCHANGED
replacementSourceId: null
claimImpact: none; the relied comparative financing/program layers and their bounded distinctions remain supported
readinessImpact: none; rows 012–013 and 026 retain their statuses
checkedAuthority: current eCFR Parts 93 and 570; current GAO affordable-housing/HTF pages; HUD LIHTC database through 2023 with 2024 collection pending
evidenceNote: Later recommendation status or pending data collection does not alter the historical/comparative propositions relied upon.
```

### USR-MP0-014

```yaml
claimId: [USR-CLM-0149..0156, USR-CLM-0163, USR-CLM-0169]
sourceId: [USR-SRC-0057..0058, USR-SRC-0063..0068, USR-SRC-0070]
mutableClass: federal jurisdiction/remedy statutes and controlling precedent
originalValidatedAt: 2026-08-21
freezeRevalidatedAt: 2026-08-22T05:23:56-04:00
result: UNCHANGED
replacementSourceId: null
claimImpact: none; the bounded APA/District of Colorado prospective nonmoney route, venue, scope, and appeal propositions remain supported
readinessImpact: none; rows 009 and 019–021 retain their statuses
checkedAuthority: current preliminary U.S. Code and cited official judicial opinions, including current Trump v. CASA opinion materials
evidenceNote: No material superseding statute or precedent displaced the relied route; merits and remedy elements remain adjudicative bounds.
```

### USR-MP0-015

```yaml
claimId: [USR-CLM-0157..0172]
sourceId: [USR-SRC-0059..0062]
mutableClass: Federal Rules of Civil and Appellate Procedure
originalValidatedAt: 2026-08-21
freezeRevalidatedAt: 2026-08-22T05:23:56-04:00
result: UNCHANGED
replacementSourceId: null
claimImpact: none; Rule 65/62 and FRAP 4/8 procedure remains supported
readinessImpact: none; rows 019–022 and 025 retain their statuses
checkedAuthority: official U.S. Courts rules editions including amendments effective 2025-12-01
evidenceNote: No later effective amendment changed the relied notice, injunction, stay, or appeal propositions.
```

### USR-MP0-016

```yaml
claimId: [USR-CLM-0165..0167, USR-CLM-0197]
sourceId: [USR-SRC-0070..0071]
mutableClass: DOJ and CM/ECF operational material
originalValidatedAt: 2026-08-21
freezeRevalidatedAt: 2026-08-22T05:23:56-04:00
result: UNCHANGED
replacementSourceId: null
claimImpact: none; electronic notice to registered participants and separate government response/compliance remain supported
readinessImpact: none; rows 022 and 024–025 retain their statuses
checkedAuthority: current U.S. Courts CM/ECF FAQ and current DOJ/Code materials
evidenceNote: The current FAQ still states that notices of electronic filing are emailed immediately to registered participants; notice is not compliance.
```

### USR-MP0-017

```yaml
claimId: [USR-CLM-0179..0183, USR-CLM-0216]
sourceId: [USR-SRC-0075..0076]
mutableClass: Building Permits Survey and Survey of Construction methodology/releases
originalValidatedAt: 2026-08-21
freezeRevalidatedAt: 2026-08-22T05:23:56-04:00
result: UNCHANGED
replacementSourceId: null
claimImpact: none; permits, starts, completions, revisions, inputs, and current non-probability-method bounds remain supported
readinessImpact: none; rows 023 and 025–026 retain their statuses
checkedAuthority: current Census BPS methodology/release pages; 2025 final annual BPS released 2026-05-14; current SOC methodology
evidenceNote: The about-19,900 universe/about-8,400 monthly-contact and non-probability estimation correction remains current.
```

### USR-MP0-018

```yaml
claimId: [USR-CLM-0184..0192, USR-CLM-0213, USR-CLM-0216, USR-CLM-0218]
sourceId: [USR-SRC-0077..0079, USR-SRC-0082, USR-SRC-0094]
mutableClass: ACS data, method, API, vintage, and release schedule
originalValidatedAt: 2026-08-21
freezeRevalidatedAt: 2026-08-22T05:23:56-04:00
result: UNCHANGED
replacementSourceId: null
claimImpact: none; 2024 ACS remains a valid reproducible selected vintage and the 2025 one-year release remains explicitly undetermined
readinessImpact: none; rows 014–015 and 023–026 retain their bounded statuses
checkedAuthority: 2024 ACS one-year/five-year products and APIs; Census 2026-08-04/06 release-status notices; 2024 release schedule updated 2026-02-03
evidenceNote: A newer 2025 one-year product is not yet available. The selected 2024 vintage remains methodologically valid and is not invalid merely because a later release is anticipated.
```

### USR-MP0-019

```yaml
claimId: [USR-CLM-0193..0196, USR-CLM-0201]
sourceId: [USR-SRC-0080..0082]
mutableClass: statistical confidentiality, release integrity, and product-access policy
originalValidatedAt: 2026-08-21
freezeRevalidatedAt: 2026-08-22T05:23:56-04:00
result: UNCHANGED
replacementSourceId: null
claimImpact: none; Title 13 confidentiality, statistical-release integrity, historical embargo bounds, and IDIS/public-access distinctions remain supported
readinessImpact: none; rows 023–025 retain their statuses
checkedAuthority: current Title 13; active Commerce DAO 216-19 index/text; current Census 2024 ACS and HUD IDIS access materials
evidenceNote: A newer Commerce disclosure-avoidance directive affects the future 2025 ACS schedule but does not supersede the relied release-integrity proposition; that future-release bound is already recorded in USR-MP0-018.
```

### USR-MP0-020

```yaml
claimId: [USR-CLM-0199]
sourceId: [USR-SRC-0083..0084]
mutableClass: temporary official public-claim examples
originalValidatedAt: 2026-08-21
freezeRevalidatedAt: 2026-08-22T05:23:56-04:00
result: UNCHANGED
replacementSourceId: null
claimImpact: none; the dated HUD and House artifacts remain reproducible examples of competing institutional claims
readinessImpact: none; rows 003 and 023–024 retain their statuses
checkedAuthority: HUD Accomplishments 2026 page and House Financial Services 2025 HOME statement, both reopened 2026-08-22
evidenceNote: These remain dated corroborating artifacts, not universal or currently ongoing facts and not evidence of persuasion.
```

### USR-MP0-021

```yaml
claimId: [USR-CLM-0221..0224]
sourceId: [USR-SRC-0099..0103]
mutableClass: FY2024 appropriation, apportionment, allocation, award, outlay, and plan artifacts
originalValidatedAt: 2026-08-21
freezeRevalidatedAt: 2026-08-22T05:23:56-04:00
result: UNCHANGED
replacementSourceId: null
claimImpact: none; the FY2024 authority/apportionment/award stages and their owner boundaries remain supported
readinessImpact: none; rows 010–013 and 025–026 retain their statuses
checkedAuthority: P.L. 118-42; OMB apportionment approved 2024-04-05; HUD FY2024 allocation; USAspending Arapahoe FAIN M24-DC080221; Arapahoe plan
evidenceNote: USAspending recheck returned $617,268.07 obligation and $61,726.81 aggregate outlay. The mutable outlay remains a liquidation measure, not obligation or material Housing truth.
```

### USR-MP0-022

```yaml
claimId: [USR-CLM-0225..0226]
sourceId: [USR-SRC-0104..0105, USR-SRC-0120]
mutableClass: current HOME consortium rule/guidance and named FY2025–FY2027 renewal records
originalValidatedAt: 2026-08-21
freezeRevalidatedAt: 2026-08-22T05:23:56-04:00
result: CHANGED
replacementSourceId: USR-SRC-0120
claimImpact: no substantive claim change; the inaccessible direct-PDF guide locator is replaced by current 24 C.F.R. §92.503, current official HUD program material, and HUD's official archive provenance for HUD-2006-08
readinessImpact: none after narrow replacement; rows 012–013, 020, and 025 retain their statuses
checkedAuthority: current 24 C.F.R. §§92.101 and 92.503; current HUD affordable-housing/consortia page; HUD archive provenance for HUD-2006-08; Arapahoe 2025–2029 plan; Englewood renewal ordinance
evidenceNote: The direct PDF URL in USR-SRC-0104 no longer returned the document. USR-SRC-0120 restores official guidance support, and the current regulation plus named renewal records independently preserve the implementation-critical proposition.
```

### USR-MP0-023

```yaml
claimId: [USR-CLM-0228..0230]
sourceId: [USR-SRC-0106..0110]
mutableClass: Stables project scope/final waiver, HUD BABA process, HUD authority, and housing-supply syntheses
originalValidatedAt: 2026-08-21
freezeRevalidatedAt: 2026-08-22T05:23:56-04:00
result: UNCHANGED
replacementSourceId: null
claimImpact: none; the final waiver, ordinary grant/deny tradeoff, legitimate HOME input, latency, and weak/mixed material mechanisms remain supported
readinessImpact: none; rows 012 and 025–026 retain their statuses
checkedAuthority: HUD approved-waiver list and final Stables waiver W-0000102 effective 2026-08-10; current HUD BABA process; current Code; CRS R40118 updated 2025-04-25 and R47617
evidenceNote: HUD still lists W-0000102 as approved. Later proposed Stables input waivers do not alter the relied final HVAC-waiver facts or turn them into a general market rule.
```

### USR-MP0-024

```yaml
claimId: [USR-CLM-0231..0233]
sourceId: [USR-SRC-0092..0094, USR-SRC-0111..0112]
mutableClass: Population, CVAP, ACS housing vintages, APIs, and voter-eligibility bounds
originalValidatedAt: 2026-08-21
freezeRevalidatedAt: 2026-08-22T05:23:56-04:00
result: UNCHANGED
replacementSourceId: null
claimImpact: none; one canonical resident-Population basis and separately bounded CVAP/Housing projections remain supported
readinessImpact: none; rows 014–016 and 023 and 025–026 retain their statuses
checkedAuthority: Vintage 2025 Population; 2020–2024 ACS CVAP documentation released 2026-01-30; 2024 ACS B25008/B25106 metadata/APIs; USAGov updated 2026-02-23; current EAC/DOJ guidance
evidenceNote: Universes, state/DC geographies, estimates/MOEs, and eligibility limits remain distinct. CVAP is not registered or actual voters.
```

### USR-MP0-025

```yaml
claimId: [USR-CLM-0237..0238]
sourceId: [USR-SRC-0113]
mutableClass: HUD newsroom and opt-in mailing-list channel
originalValidatedAt: 2026-08-21
freezeRevalidatedAt: 2026-08-22T05:23:56-04:00
result: UNCHANGED
replacementSourceId: null
claimImpact: none; official artifact publication plus opt-in subscriber distribution remains an evidenced bounded channel
readinessImpact: none; rows 023–025 retain their statuses
checkedAuthority: current HUD News, HUD mailing-list description, and HUD News signup pages
evidenceNote: The pages establish channel capability only. Publication, availability, delivery, receipt/exposure, belief, and persuasion remain separate.
```

### USR-MP0-026

```yaml
claimId: [USR-CLM-0234..0236, USR-CLM-0239..0240]
sourceId: [USR-SRC-0057..0068, USR-SRC-0098..0101]
mutableClass: legal/procedural rules, calendar instruments, fiscal cohort, and BPS method
originalValidatedAt: 2026-08-21
freezeRevalidatedAt: 2026-08-22T05:23:56-04:00
result: UNCHANGED
replacementSourceId: null
claimImpact: none; the hostile legal route, chronological correction, post-succession persistence, and current BPS method remain supported
readinessImpact: none; rows 020–026 retain their statuses
checkedAuthority: current statutes/rules/precedent; P.L. 118-42 and FY2024 OMB/HUD cohort records; current Census BPS methodology
evidenceNote: Fixed dates, deadlines, administrative/data cycles, event-driven stages, and observed variable latency remain distinct; no project-specific commitment/draw date is invented.
```

### USR-MP0-027

```yaml
claimId: [USR-CLM-0241..0247]
sourceId: [USR-SRC-0114..0119]
mutableClass: fixed funding/recipient/project/publication examples plus mutable outlay and planned/current project status
originalValidatedAt: 2026-08-21
freezeRevalidatedAt: 2026-08-22T05:23:56-04:00
result: UNCHANGED
replacementSourceId: null
claimImpact: none; each example remains reproducible within its labeled scope and no same-dollar chain, exact draw, completion, occupancy, reading, belief, or persuasion claim is added
readinessImpact: none; rows 011 and 023–026 retain their statuses
checkedAuthority: USAspending Corpus FAIN M24-MC480502; official Corpus plan/Legistar/minutes, environmental notice, register and FY2025 Single Audit, permit index/report; Texas TABS2025005871
evidenceNote: USAspending still reports $1,119,386.26 obligation and $268,520.21 aggregate outlay. The Texas record now displays `Inspection Complete`, but that administrative status does not prove construction completion or occupancy; its planned 2026-10-01 date remains a plan, not material truth.
```

## Freeze retrieval hashes

The following SHA-256 values identify the bytes retrieved on 2026-08-22 for fixed artifacts and the checked representations of mutable pages/APIs. A dynamic-page hash is a retrieval identity, not a claim that the page can never change.

| Source / component | Bytes | SHA-256 |
|---|---:|---|
| `USR-SRC-0083` HUD Accomplishments page | 170384 | `ba90c93d8d6a95f3b3b34525c7efb3892653b72f6b97a33401add0e73e6a8cc0` |
| `USR-SRC-0084` House HOME statement | 34246 | `09512f4a2e2046184dc1f39d0a4fad7dce9bfa09f7c31d72387bc53164fcd440` |
| `USR-SRC-0099` P.L. 118-42 PDF | 1293690 | `eddb25e8906bcd98fe5e33b81f1cdf1981139283e2b6fb7182b5841df3a8dc50` |
| `USR-SRC-0100` OMB apportionment JSON | 26409 | `4ce919d6c68c462af2f6cb835551e0b7a94b0225c8f7998faba4e81aa1ea3774` |
| `USR-SRC-0101` CPD Notice 24-01 PDF | 328838 | `9ae0b1310f9742367350a8dd8c6d5a0419b0bbb0468937043c83469f89720ed0` |
| `USR-SRC-0102` Arapahoe USAspending API | 8619 | `6fa9f189ad5cd4b4a4271a433b8dcc0f50fb3d46365a07e82aaa0446c5c7018d` |
| `USR-SRC-0103` Arapahoe 2024 plan PDF | 192088 | `f1e77dd8e76c7fb79b261b695aab553d3317176b21b0b9aceb7cc050272898b9` |
| `USR-SRC-0105` Arapahoe 2025–2029 plan PDF | 5375803 | `fc8fe4fac42f8e9a9af6776c0a571712dcfc74f0e2674b87687733317730787a` |
| `USR-SRC-0105` Englewood ordinance PDF | 496784 | `8e526f15eea7f9c0a2f55f7b874876e12140608eace5e1fc6d76179f8f4040a4` |
| `USR-SRC-0106` final Stables waiver PDF | 162135 | `1714642ebec3ed2ecccaa76693f259cacc4c16a41d18cb82512b3b1b873862c5` |
| `USR-SRC-0111` CVAP documentation PDF | 194761 | `7fc6bfcb87a13634f8a41b311c29f271ea5f2e72d94207477b6e7e9fdf209077` |
| `USR-SRC-0111` B25008 metadata JSON | 202938 | `66226576ef85854d49ff80b6d647ad51bcc2625e01275a4bb36937b6e23fa112` |
| `USR-SRC-0111` B25106 metadata JSON | 269904 | `c042b9dc0682835121e5e6442022b0c86ad1768d0ef8f276e92bd37cb243a570` |
| `USR-SRC-0113` HUD News page | 183522 | `28c37f7ec1102f16ddfef2712016b1099fa2329ce835c0737eb64eb82981223b` |
| `USR-SRC-0113` HUD mailing-list page | 167126 | `f5f730bf3e45a4f27485c6727111bb921c216102199fbdca1f7e148f4c84b27a` |
| `USR-SRC-0113` HUD News signup page | 159991 | `6a48077772a5506069dec5d008cd4e1202de316311471da75ed0e3e7f8da4e2f` |
| `USR-SRC-0114` Corpus USAspending API | 8617 | `24a711da3f8c41234baf80cb9e4b8beec542310ae4ae9f3b7b7fdb53649231ed` |
| `USR-SRC-0115` Corpus action-plan PDF | 3867452 | `56f04eb6c7e07ea55be95801c6d6084d01a079013b385ce351824c25d37679ca` |
| `USR-SRC-0115` Corpus Legistar item | 104618 | `8dfe33d5e53b08c6f7a059f3565e4ce168dc8047d52e57f980ccfa04b86ff637` |
| `USR-SRC-0116` Corpus environmental PDF | 733221 | `989f8b7823283b11ba7dc2a6f62bab2ff7f13c21c819aa36f7d00aa3fa1df274` |
| `USR-SRC-0117` September 2025 register XLSX | 1434689 | `b5d8d29b97577632699a88b4032c9ea78a42ff0ec01bd0cbd6f039c59f93c2d8` |
| `USR-SRC-0117` FY2025 Single Audit PDF | 1113139 | `7f010a35550f659f5912e514c7bb57d0d8b13997a63ecb580a309fddca17037b` |
| `USR-SRC-0118` February 2025 permit PDF | 247122 | `739a2663babc08bbce95c542375d18707afed6e4362d68282cefcba644a600f0` |
| `USR-SRC-0119` Texas project record | 6910 | `bc5ba153d9012b191095a1bd154bb0f2cbfc9363c952b28b6fced2de7638c2c9` |
| `USR-SRC-0120` current §92.503 page | 10596 | `43e029fe2e41d50df2726a7e43cf594320291baf466dcf70c953d89ab302b12c` |
| `USR-SRC-0120` current HUD consortia page | 211197 | `102099dd5a5369bb1b5ddb214d4fbc2eb656a70b8a9e279d3f93fe8564113d57` |
| `USR-SRC-0120` HUD-2006-08 archive landing | 7739 | `2d1de63907e2b8724c3c59cc688d549aa7d6e4f9443968dad8eba9a36670b104` |

## Aggregate result and readiness impact

| Result | Count |
|---|---:|
| UNCHANGED | 26 |
| CHANGED | 1 |
| UNAVAILABLE | 0 |
| Total | 27 |

`USR-MP0-022` was restored through a narrow official-locator replacement. No implementation-critical proposition lost support, no required readiness row became `NOT_READY`, and no claim was broadened. All 26 readiness rows remain `READY` or `READY_WITH_BOUNDS`; their recorded bounds remain operative.

## Step 2 boundary attestation

- All 27 mutable-P0 register records were revalidated; none was spot-checked or omitted.
- No broad research packet, new municipality, new program, new policy domain, calibration, or current-politician enrichment was added.
- No audit or evidence-freeze decision was performed.
- No U.S. Configuration Contract was authored.
- No architecture, runtime, test, Electron, or UI file was changed.
- Architecture V0 remains unchanged and has no unresolved qualifying contradiction in the accepted audit state.
- P1/P2 remain explicitly deferred.
- The next authorized action is Step 3 only: an independent U.S. Evidence Freeze Reviewer reviews the exact Step 2 candidate SHA.
