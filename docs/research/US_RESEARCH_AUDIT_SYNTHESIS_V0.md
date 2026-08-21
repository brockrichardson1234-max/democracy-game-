# U.S. Research Audit Synthesis V0

Synthesis ID: `USR-SYN-8D3A5C4F-001`

Exact audited baseline: `8d3a5c4ff1d906d4bbc5f965fc737d7175b802c2`

Governing authorities:

- Architecture V0: `54afd51c6ae894df5c3680cf15df472cdcb125b2`
- Synthetic GL0: `ffc34c0cce1089ff1eeca671243cab7a2e968c43`
- Research Program/Audit Protocol: `6267f805f37f646f4e8c651ea8ac54c65b715e99`

## Mechanical synthesis

Inputs: independent Audit A Source/Fact, Audit B Coverage, and Audit C Architecture/Fit, all first-pass audits of the exact same SHA. Specialist input: **NONE**. All independence attestations were valid.

- Audit A: **0 BLOCKER, 1 HIGH**
- Audit B: **5 BLOCKER, 3 HIGH**
- Audit C: **0 BLOCKER, 0 HIGH; CLEAR**
- Mechanical total: **5 BLOCKER, 4 HIGH, 9 findings**
- Duplicate groups: **NONE**
- Evidence adjudication: **NONE**
- Architecture contradictions: **NONE**

Audit B readiness gaps and Audit C mapping fit ask different questions and do not conflict. Architecture V0 is not reopened.

| Finding | Severity | Repair queue | Defect retained for recheck | Repair claims | Repair sources | Packet sections | Readiness rows | Objective closure evidence |
|---|---|---|---|---|---|---|---|---|
| USR-AUD-B-001 | BLOCKER | USR-RQ-001 | No same-program recipient participation/nonparticipation path | `0225`–`0226` | `0104`–`0105` | Packet B §13.B | 013, 025 | Named Arapahoe HOME consortium inclusion/exclusion, agreement/formula consequences, continuing/other-route bounds; no CDBG splice |
| USR-AUD-B-002 | BLOCKER | USR-RQ-002 | No real HOME appropriation/budget-authority cohort and owner-qualified fiscal chain | `0221`–`0224` | `0099`–`0103`, `0106` | Packet B §13.A | 010–013, 025–026 | P.L. 118-42 → OMB apportionment → HUD formula process → Arapahoe award/obligation → local project stages → separate material boundary; `0042` dependency closed by synthesis |
| USR-AUD-B-003 | BLOCKER | USR-RQ-003 | No canonical Population→electorate plus Housing-exposure projection | `0231`–`0233` | `0111`–`0112` plus `0092`–`0094` | Packet D §13.A | 015–016, 023, 025–026 | Vintage 2025 sole Population owner, CVAP aggregate proxy with legal bounds, ACS tenure/cost projection with distinct universes/MOEs |
| USR-AUD-B-004 | BLOCKER | USR-RQ-004 | No Housing-owned material response with latency and independent weak/mixed constraint | `0224`, `0229`–`0230` | `0103`, `0106`, `0109`–`0110` | Packet B §13.D | 012, 023, 025–026 | Physical construction/rehab/preservation → delayed usable units plus documented input/supply/finance/scale/demand constraints; no fiscal artifact→truth shortcut |
| USR-AUD-B-005 | BLOCKER | USR-RQ-005 | No ordinary post-enactment executive/HUD decision family with tradeoff | `0227`–`0228` | `0106`–`0108` | Packet B §13.C | 012, 025–026 | HUD/MIAO grant-versus-deny Stables nonavailability waiver, with domestic-preference versus delay/habitability/occupancy tradeoff |
| USR-AUD-A-001 | HIGH | USR-RQ-006 | Incorrect BPS current methodology | changed `0180`; added `0240` | changed pinpoint `0075`; added `0098` | Packet C §13.A; claim/source ledgers | 023, 025–026 | About 8,400 monthly contacts versus about 19,900 universe; post-2022 non-probability entire-universe estimation, reported/imputed/annual/SOC/third-party inputs, unquantifiable sampling error and response/nonsampling/vintage bounds |
| USR-AUD-B-006 | HIGH | USR-RQ-007 | No exact coherent hostile HOME route | `0234`–`0236` | `0104`–`0105` plus retained `0057`–`0068` | Packet C §13.B | 019–022, 025 | One final pre-award Arapahoe requalification rejection → APA/D. Colo. prospective nonmoney route → Rule 65 order → Tenth Circuit appeal → separate stay; Tucker boundary retained |
| USR-AUD-B-007 | HIGH | USR-RQ-008 | No evidence-backed public channel/audience/exposure route | `0237`–`0238` | `0113` | Packet C §13.C | 023–025 | Official HUD claim → newsroom/confirmed opt-in list → bounded visitors/subscribers; availability, delivery, receipt, exposure, and belief remain distinct |
| USR-AUD-B-008 | HIGH | USR-RQ-009 | No feasible cross-seam chronology | `0239` plus route claims `0221`–`0238` | `0099`–`0113` plus retained election/legal sources | Packet D §13.B | 025 and all route-dependent challenged rows | Classified 2021–2025 chronology with exact legal dates only where supported, variable project/release/litigation latency, and post-transfer persistence |

No finding was merged, erased, or downgraded. All nine remain separately recheckable.

## Change audit trail

- Old atomic claim changed: `USR-CLM-0180` only. Its previous “8,400-office monthly sample” description is expressly corrected, not hidden.
- Old source record changed: `USR-SRC-0075` pinpoint/use description only; `USR-SRC-0098` is the fresh current-method record.
- Historical dependency `USR-CLM-0042` was not rewritten; `USR-CLM-0221`–`0224` close it through a new cohort synthesis.
- Packet A: unchanged.
- New claim range: `USR-CLM-0221`–`USR-CLM-0240`.
- New source range: `USR-SRC-0098`–`USR-SRC-0113`.
- New mutable-P0 range: `USR-MP0-021`–`USR-MP0-026`; total **26**.
- Readiness rows reevaluated: `010`, `011`, `012`, `013`, `015`, `016`, `020`, `025`, `026`; all P0 workstreams also reevaluated.
- **FREEZE-TIME REVALIDATION IS NOT COMPLETE.**

## Boundary attestation

This is the single bounded repair. It performs no findings-only recheck, evidence freeze, configuration, amount calibration, gameplay design, architecture modification, runtime/UI/test implementation, or general second audit. Audit C's clear result and 26/26 seam fit are preserved; no Architecture V0 document or primitive is modified.
