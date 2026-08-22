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
| USR-AUD-B-002 | BLOCKER | USR-RQ-002 | The evidence must preserve the owner-qualified path from budget authority through fiscal control, HUD allocation/obligation, recipient commitment/draw/expenditure process, legitimate Housing input, and separately modeled material result | `0079`–`0102`, `0136`–`0141`, `0175`–`0178`, `0221`–`0224`, `0241`–`0244` | `0031`–`0044`, `0072`–`0074`, `0099`–`0103`, `0106`, `0114`–`0119` | Packet B §13.A, §14 | 010–013, 023, 025–026 | Owner-qualified composite proof: enacted FY2024 authority → OMB fiscal control → HUD formula/allocation and federal-obligation examples → program-general PJ commitment/activity/draw/expenditure mechanics → recipient/project examples → separately owned physical Housing process; no continuous same-dollar provenance chain asserted |
| USR-AUD-B-003 | BLOCKER | USR-RQ-003 | No canonical Population→electorate plus Housing-exposure projection | `0231`–`0233` | `0111`–`0112` plus `0092`–`0094` | Packet D §13.A | 015–016, 023, 025–026 | Vintage 2025 sole Population owner, CVAP aggregate proxy with legal bounds, ACS tenure/cost projection with distinct universes/MOEs |
| USR-AUD-B-004 | BLOCKER | USR-RQ-004 | No Housing-owned material response with latency and independent weak/mixed constraint | `0224`, `0229`–`0230` | `0103`, `0106`, `0109`–`0110` | Packet B §13.D | 012, 023, 025–026 | Physical construction/rehab/preservation → delayed usable units plus documented input/supply/finance/scale/demand constraints; no fiscal artifact→truth shortcut |
| USR-AUD-B-005 | BLOCKER | USR-RQ-005 | No ordinary post-enactment executive/HUD decision family with tradeoff | `0227`–`0228` | `0106`–`0108` | Packet B §13.C | 012, 025–026 | HUD/MIAO grant-versus-deny Stables nonavailability waiver, with domestic-preference versus delay/habitability/occupancy tradeoff |
| USR-AUD-A-001 | HIGH | USR-RQ-006 | Incorrect BPS current methodology | changed `0180`; added `0240` | changed pinpoint `0075`; added `0098` | Packet C §13.A; claim/source ledgers | 023, 025–026 | About 8,400 monthly contacts versus about 19,900 universe; post-2022 non-probability entire-universe estimation, reported/imputed/annual/SOC/third-party inputs, unquantifiable sampling error and response/nonsampling/vintage bounds |
| USR-AUD-B-006 | HIGH | USR-RQ-007 | No exact coherent hostile HOME route | `0234`–`0236` | `0104`–`0105` plus retained `0057`–`0068` | Packet C §13.B | 019–022, 025 | One final pre-award Arapahoe requalification rejection → APA/D. Colo. prospective nonmoney route → Rule 65 order → Tenth Circuit appeal → separate stay; Tucker boundary retained |
| USR-AUD-B-007 | HIGH | USR-RQ-008 | First repair proved channel capability but no named HOME artifact or claim-specific bounded audience event | `0237`–`0238`, `0245`–`0246` | `0113`, `0115` | Packet C §13.C, §14 | 023–025 | Named FY2025/PY2024 plan and $587,531 Palms claim → official Legistar agenda packet/public hearing → nine named Council participants recorded acting on item; no attachment-reading or belief inference |
| USR-AUD-B-008 | HIGH | USR-RQ-009 | First chronology placed the 2026 Stables waiver before its September 2024 award and forced variable delivery/information stages before election/transfer | corrected `0239`; added `0247` | `0099`–`0119` plus retained election/legal sources | Packet D §13.B–D | 025 and direct route dependencies | Corrected 2021–2027 chronology orders authority, awards, election/count/transfer, Palms events, 2026 Stables construction/waiver, anticipated 2027 completion, later information stages, and hypothetical pre-award branch by fixed/deadline/cycle/event-driven/variable class |

No finding was merged, erased, or downgraded. All nine remain separately recheckable.

## One-time exception provenance and candidate result

The accepted Audit Protocol normally permitted exactly one bounded repair. That first repaired candidate is `9c2b8be012038e5581526923e5c564ac9e65c39c`. Its first findings-only rechecks closed exactly `USR-AUD-A-001`, `USR-AUD-B-001`, `USR-AUD-B-003`, `USR-AUD-B-004`, `USR-AUD-B-005`, and `USR-AUD-B-006`, and left exactly `USR-AUD-B-002`, `USR-AUD-B-007`, and `USR-AUD-B-008` open.

Project authority explicitly authorized, for this evidence lineage only, one additional bounded protocol-exception repair of those three still-open findings and direct consistency dependencies. This exception does not amend the Program or Audit Protocol, reopen any closed finding, reopen Audit C or Architecture V0, or authorize a third repair. If this candidate fails the authorized findings-only recheck, no third repair is automatically authorized.

Before authorizing this exception repair, project authority issued a product-resolution directive for `USR-AUD-B-002`. The directive preserved the original finding's substantive concern but corrected the P0 closure resolution: the first U.S. vertical must prove the institutional/fiscal causal stages and owners, not forensically reconcile one named municipal activity from an exact IDIS/LOCCS voucher through one city check into one building. Different authoritative sources may establish different stages if each is labeled by scope and no continuous same-dollar chain is implied. This directive changed the acceptance test; it did not declare the finding closed.

Candidate-author assessment before recheck, which was not a recheck or self-acceptance:

- `USR-AUD-B-002`: **OBJECTIVE CLOSURE EVIDENCE SUPPLIED FOR RECHECK UNDER THE CORRECTED P0 CRITERION.** Program-general authority establishes recipient commitment/activity/draw/expenditure mechanics; funding-cohort, recipient, project, and material examples corroborate distinct stages without pretending to trace the same dollars continuously. At that point the finding remained open until Audit B rechecked it.
- `USR-AUD-B-007`: **OBJECTIVE CLOSURE EVIDENCE SUPPLIED FOR RECHECK.** One named official plan/Palms claim is traced through official agenda publication/distribution to a nine-participant recorded Council event, with reading and belief bounds.
- `USR-AUD-B-008`: **OBJECTIVE CLOSURE EVIDENCE SUPPLIED FOR RECHECK.** The chronology is mechanically ordered across the term and post-transfer years and honestly positions the two unobserved B-002 stages as event-driven gaps.

The original Audit B findings-only rechecker subsequently reviewed exact exception-repair SHA `fc2c8ab4a2df9e2c90175aa45060d8772265a82f` and returned:

- `USR-AUD-B-002`: **RECHECK_PASS**
- `USR-AUD-B-007`: **RECHECK_PASS**
- `USR-AUD-B-008`: **RECHECK_PASS**

All original Audit A/B findings are therefore **CLOSED**. Audit C remains **CLEAR**. This Step 1 disposition is recorded for freeze provenance; it is not re-audited by the Step 2 author.

## Change audit trail

- Old atomic claim changed: `USR-CLM-0180` only. Its previous “8,400-office monthly sample” description is expressly corrected, not hidden.
- Old source record changed: `USR-SRC-0075` pinpoint/use description only; `USR-SRC-0098` is the fresh current-method record.
- Historical dependency `USR-CLM-0042` was not rewritten; `USR-CLM-0221`–`0224` close it through a new cohort synthesis.
- Packet A: unchanged.
- First-repair claim/source ranges remain `USR-CLM-0221`–`0240` and `USR-SRC-0098`–`0113`. Exception-repair additions are `USR-CLM-0241`–`0247` and `USR-SRC-0114`–`0119`.
- Exception consistency corrections: temporal metadata in `USR-CLM-0228` and `USR-SRC-0106`, and infeasible ordering in `USR-CLM-0239`; no other old claim/source is changed.
- New mutable-P0 record: `USR-MP0-027`; total **27**.
- Exception-affected readiness rows reevaluated: `011`, `023`–`026`; row `011` is `READY_WITH_BOUNDS` under the corrected product-resolution criterion, while no closed finding's readiness basis is reopened.
- Step 2 added only `USR-SRC-0120` as the official replacement locator for the inaccessible direct-PDF component of `USR-SRC-0104`; claim propositions `0225`–`0226` were not changed.
- Freeze-time mutable-P0 revalidation is complete in `US_RESEARCH_FREEZE_REVALIDATION_V0.md`: 27 records, 26 `UNCHANGED`, one narrowly restored locator dependency `CHANGED`, and zero `UNAVAILABLE`. Independent evidence freeze remains pending.

## Boundary attestation

This is the one-time authorized exception repair following the normal protocol's single repair. It performs no findings-only recheck, evidence freeze, configuration, amount calibration, gameplay design, architecture modification, runtime/UI/test implementation, or general audit. No third repair is authorized automatically. Audit C remains CLEAR and is not rerun; no Architecture V0 document or primitive is modified. Packet A, the accepted Research Program, and the accepted Audit Protocol remain unchanged.
