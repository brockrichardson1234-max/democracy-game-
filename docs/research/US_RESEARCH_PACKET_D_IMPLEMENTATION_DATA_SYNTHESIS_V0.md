# U.S. Research Packet D — Implementation Data + Cross-Packet Synthesis V0

Status: **STEP 2 FREEZE-TIME REVALIDATION COMPLETE OVER EXACT EVIDENCE BASE `fc2c8ab4a2df9e2c90175aa45060d8772265a82f`. All original findings are closed; this remains an unfrozen evidence candidate and is not configuration authority.**

Research baseline date: **2026-08-21**

Exact research-program authority: `6267f805f37f646f4e8c651ea8ac54c65b715e99`

Exact Packet D base: `98099597d544f67e3294ada098ef99fcf83388bd`

Architecture traceability is non-normative. Gameplay simplification candidates are explicitly **NON-EVIDENCE**. Freeze-time mutable-P0 revalidation is recorded separately in `US_RESEARCH_FREEZE_REVALIDATION_V0.md`; no evidence-freeze decision is made here.

## 1. Scope

Packet D closes the four-packet research-execution stage. It identifies reproducible implementation-data sources, actively compares Packet A–C claims, reconciles the already-flagged HOME and ACS temporal transitions, supplies a cross-seam calendar, consolidates architecture-fit questions and simplification proposals, inventories mutable P0 dependencies, assigns every P0 workstream an evidence status, and creates the separate U.S. Configuration Readiness Matrix.

Packet D does not ingest datasets, select final configuration values or schema, require runtime network access, perform an independent audit, freeze evidence, alter earlier packet prose, calibrate P1 behavior, implement code/UI, or reopen Architecture V0.

## 2. Questions answered

- Which authoritative products can reproducibly supply state/DC identities, state and district geography, apportionment, electoral allocation, bounded Population weights, and Housing inputs? (`USR-CLM-0202`–`0216`)
- What are the products' identifier, format, vintage, revision, access, and reuse boundaries? (`USR-CLM-0202`–`0216`)
- Did the active 2026 HOME transition or current ACS-release status change Packet B/C conclusions before audit? (`USR-CLM-0217`–`0218`)
- Are Packet A–C institution, jurisdiction, fiscal, election, court, information, and timing claims mutually coherent? (`USR-CLM-0219`–`0220`)
- Which claims require later freeze-time revalidation, which P0 questions are bounded, and which architecture seams are evidence-ready?
- Where does real U.S. topology strongly match, partly match, or materially differ from synthetic GL0?

## 3. Executive summary

The implementation-data strategy is reproducible without creating a live-web runtime dependency. Census ANSI/FIPS/GNIS state records provide stable names and identifiers for the 50 states and DC. Census GEOIDs provide join keys. A specified TIGER/Line or cartographic-boundary vintage can provide state and congressional-district geometry, while the Census 119th Congressional District products provide `STATEFP`, `CD119FP`, and combined GEOID semantics for districts in effect January 2025–2027. The 2020 apportionment product supplies the current 435-seat state allocation; NARA supplies the 2020-Census-based electoral allocations effective for the 2024 and 2028 elections. (`USR-CLM-0202`–`0208`)

Senate seat identity can be grounded independently of current Senator identity through the constitutional two-seats-per-state relation plus the official class/stagger record. The bounded first-vertical institution roster is already supported by Packet A/C sources. Current officeholder rosters are not a missing P0 implementation dataset. (`USR-CLM-0209`–`0210`)

Census Vintage 2025 state estimates provide a reproducible resident-population baseline for the United States, states, and DC, with an explicit July 1, 2025 reference date and whole-series revision semantics. A separate official 18-and-older table exists, but neither resident population nor age 18+ is identical to legal voter eligibility or citizen voting-age population. The minimal structural Population seam is therefore source-ready without importing ideology, preference, turnout, or detailed demographics. (`USR-CLM-0211`–`0213`)

Housing implementation inputs remain a bounded composite. IDIS/HUD records ground program delivery; Census ACS grounds sample-based stock, vacancy, rent, and rent-burden candidates; BPS/SOC ground permits, starts, and completions at their documented resolutions. A future build can record exact source URLs, product/vintage identifiers, selected variables, transformation code, and hashes, then embed a derived versioned configuration artifact for deterministic offline runtime. Packet D does not choose the variables or ingest the data. (`USR-CLM-0213`–`0216`)

Targeted current-source reconciliation did not remove the HOME transition bound. The current eCFR still carries provisions rooted in pre-July-2026 statutory deadlines and now also marks selected 2025 rule amendments as delayed indefinitely by 91 FR 23014. Public Law 119-101 remains controlling for its statutory amendments; current Part 92 remains operative except where displaced or delayed, and guidance must be provision-by-provision rather than treated as timeless. Claims `0109`, `0112`, and `0140` remain `SUPPORTED_WITH_BOUNDS`; no Packet B claim is silently broadened. (`USR-CLM-0217`)

Packet C's ACS status also remains bounded: the official update still says the 2025 one-year release date is undetermined, so claim `0187` remains `SUPPORTED_WITH_BOUNDS`. Freeze-time revalidation on 2026-08-22 confirmed that this bound remains current. (`USR-CLM-0218`; `USR-MP0-018`)

The systematic A/B/C comparison found no genuine factual or authority conflict. Seven apparent or temporal tensions are recorded rather than hidden: state versus local recipient, two obligation vocabularies, certification terminology, HOME statute/regulation timing, claimant granularity, administrative completion versus material Housing, and internal versus public knowledge. Each is compatible after owner, stage, scope, or date is preserved. No earlier claim status changes. (`USR-CLM-0219`)

The combined evidence supports a recognizable U.S. causal chain through bicameral enactment, distinct fiscal stages, HUD/HOME administration, real state/local recipient relationships, downstream project delivery, delayed official artifacts and public claims, separate Population state, election/count/transfer, and one bounded legal-contest/order/compliance route. The strongest differences from synthetic GL0 are configuration questions—not research failures: real Congress is bicameral and large; HOME is formula/plan/agreement-based rather than state application/award competition; recipient and project layers are plural; official information is composite; and legal relief is claimant-, order-, and procedure-specific. (`USR-CLM-0220`)

All 12 P0 workstreams are supported or supported with explicit bounds under the B-002 product-resolution directive. Fiscal-execution workstream 6.3 is supported by an owner-qualified composite proof: program-general law and operations establish the causal stages, while funding-cohort, recipient, project, and material examples corroborate distinct stages without asserting a continuous same-dollar provenance chain. All 26 readiness rows are `READY` or `READY_WITH_BOUNDS`. Twelve architecture-fit questions remain non-normative configuration/simplification decisions. **NO QUALIFYING ARCHITECTURE V0 CONTRADICTION IDENTIFIED.** The original Audit B reviewer returned `RECHECK_PASS` for B-002, B-007, and B-008 against `fc2c8ab4a2df9e2c90175aa45060d8772265a82f`; all original findings are closed. Freeze-time revalidation is complete, but independent evidence freeze has not occurred.

## 4. Claim/evidence ledger additions

Packet D originally appended `USR-CLM-0202`–`USR-CLM-0220` and `USR-SRC-0085`–`USR-SRC-0097`; those records later entered audited baseline `8d3a5c4f`. First-repair claims `0221`–`0240` and exception-repair claims `0241`–`0247` remain outside any findings-only recheck of this candidate.

### A. Implementation-data source inventory

| Data family | Authoritative source strategy | Identifiers / format / access | Geography / vintage / cadence | Revision and use status | Candidate acquisition strategy | Claim IDs |
|---|---|---|---|---|---|---|
| States and DC | Census ANSI/FIPS/GNIS state code file | Pipe-delimited file and HTML table; FIPS, USPS, name, GNISID | 50 states, DC, Puerto Rico/insular areas in source; select bounded jurisdiction set | Identifier list can change if legal geography changes | Extract 50 states + DC with retained source/vintage/hash; do not hand-author identity authority | `0202`–`0203` |
| State geometry | 2025 TIGER/Line state layer; 2025 cartographic boundary alternatives | TIGER/Line shapefile for full detail; simplified cartographic shapefile/KML or national geodatabase/GeoPackage alternatives | Legal boundaries/names as of 2025 product dates; annual products | Geometry and boundary vintages change; TIGER is not a legal land description | Select one explicit product/vintage/scale later; transform and retain provenance offline | `0203`–`0206` |
| House apportionment | 2020 Census apportionment results | XLS/PDF/table; state and seats | 50 states; 2020 Census allocation used in current decade | Decennial/apportionment-law dependent | Extract state-seat table and retain 2020 provenance | `0207` |
| House districts | Census 119th Congressional District TIGER/Line/relationship products | Shapefile; `STATEFP`, `CD119FP`, `GEOID`; relationship files | Districts in effect for 119th Congress, January 2025–2027 | Annual geography products can incorporate submitted boundary updates | Extract IDs/nesting and chosen geometry vintage; do not attach identity to current Member | `0203`–`0205`, `0207` |
| Senate seats/classes | Constitution + official Senate class record already in Packet A | State code + seat/class can produce a reproducible seat key; no new roster feed required | Persistent two-per-state; six-year class staggering | State count/constitutional rules are structural; class roster is official operational reference | Derive bounded seat identity from state/class after configuration decision; exclude current Senator identity | `0019`–`0026`, `0209` |
| Electoral College | NARA Distribution of Electoral Votes + Packet A law | Official web table; state/DC vote allocation | 2020-Census allocations effective for 2024 and 2028; 538 total, 270 majority | Changes after next apportionment or law/state allocation changes | Extract allocation table with effective-election metadata and retained source | `0049`–`0059`, `0207`–`0208` |
| Federal institutions | Constitution, U.S. Code, official House/Senate, HUD, U.S. Courts, DOJ, Census sources already ledgered | Stable institutional/legal identifiers and official pages | Persistent or current-law/operational as source-specific | Reorganizations and rules are mutable where relied upon | Hand-authored bounded institution configuration may cite accepted structural claims; no universal live agency catalog | `0001`–`0004`, `0092`, `0165`–`0175`, `0210` |
| Population baseline | Census Vintage 2025 state totals; 18+ table only if later required | XLS/data files + layouts; state identifiers; reference-date columns | States/DC; July 1, 2025 estimate within revised 2020–2025 series | New vintage revises entire post-2020 series | Extract selected resident-population reference date with file/hash; do not infer voter eligibility | `0211`–`0213` |
| Housing program delivery | HUD IDIS guide, PR20, annual performance artifact | Report/download/database-derived outputs; PJ/activity fields | Program/PJ/activity and dated report scope | Operational database and reports update/correct | Later bounded extract of defined IDIS fields/report vintage; not a live runtime dependency | `0175`–`0178`, `0216` |
| Housing stock/affordability | ACS 1-/5-year detailed/profile tables and Census API/download | API/CSV/table; Census geography identifiers; estimate/MOE | Product-specific geography and 12-/60-month observation intervals | Annual vintages; estimates/MOEs; release currently delayed for 2025 one-year | Select product/vintage/variables later; persist estimates, MOEs, universe, method, and hash | `0184`–`0192`, `0213`, `0216`, `0218` |
| Housing production pipeline | BPS and SOC/NRC | Official downloads/reports; BPS detailed geography, SOC national/region | Monthly/annual; permit, start, completion referents differ | Preliminary/revised/benchmark cycles | Extract only selected variables and vintages after configuration contract | `0179`–`0183`, `0216` |

For every row, the shared source ledger supplies the issuing body, claim-relative authority status, stable locator, and product/version date. The access/format, geography/vintage/cadence, revision, and acquisition columns above are the reproducibility record. Reuse is deliberately source-specific: Census-authored materials are bounded by the government-work rule and the product's own disclaimer/citation/trademark terms; nothing here treats third-party material on a government site as unrestricted. Any later embedded extract must retain the exact source/product vintage, selected fields, transformation, citation, and content hash, and must recheck then-current product terms. If a chosen artifact carries a different license or restriction, the later build must preserve that restriction or use an external acquisition step rather than infer permission. (`USR-CLM-0214`–`0215`)

### B. Data status, licensing, and deterministic-delivery findings

- Census GEOIDs are official join keys between geographic/statistical products; versioned joins are preferable to name matching. (`USR-CLM-0202`–`0205`)
- TIGER/Line documentation states that U.S. government works are not protected by U.S. copyright and permits reproduction with requested Census attribution, while retaining disclaimer and `TIGER/Line®` trademark conditions. This supports bounded redistribution of derived data, not an unsupported conclusion that every federal-site asset is unrestricted. (`USR-CLM-0214`)
- Full TIGER/Line products are larger and more detailed; cartographic boundary products are simplified and offer smaller display-oriented alternatives. Source suitability does not choose the future geometry scale. (`USR-CLM-0204`–`0206`)
- The Census API is a public acquisition interface whose data are explicitly associated with geography and vintage. An API can generate a versioned artifact without becoming a runtime dependency. (`USR-CLM-0213`–`0215`)
- The defensible later workflow is official source → bounded extraction/transformation → recorded source/version/hash → versioned configuration artifact → offline deterministic runtime. This is a research-supported strategy, not implementation authorization. (`USR-CLM-0215`)

## 5. Primary-source findings

### 5.1 Identifiers, geography, representation, and electoral allocation

The Census state-code file explicitly records FIPS numeric code, USPS code, name, and GNISID and includes DC as `11` / `DC`. Census explains that GEOIDs uniquely identify legal/administrative and statistical areas and that district GEOIDs concatenate state and district codes. (`USR-CLM-0202`–`0203`)

The 2025 TIGER/Line product states that legal boundaries and names are as of January 1, 2025. Its 119th-district record layout supplies state/district fields and a combined GEOID. The dedicated 119th Congress page identifies the boundaries as state-submitted Redistricting Data Program representations and the district maps as in effect January 2025–2027. (`USR-CLM-0204`–`0205`)

The 2020 Census apportionment table allocates 435 voting House seats among the 50 states. NARA's current table uses that apportionment for 2024 and 2028, includes DC's three electors, totals 538, and identifies 270 as the majority. (`USR-CLM-0207`–`0208`)

### 5.2 Population and Housing acquisition

Vintage 2025 is Census's most recent completed consistent state-estimates vintage as of the research date. The state totals product covers the United States, states, DC, and Puerto Rico through July 1, 2025 and explicitly says each new vintage revises the complete series since the prior decennial census. The separate state-characteristics product provides total and age-18+ estimates. (`USR-CLM-0211`–`0212`)

These products can weight a bounded state/DC Population fixture. They do not establish legal eligibility, citizenship, ideology, turnout, or district-level current population by themselves. ACS or another selected product would be needed for a different universe/geography. (`USR-CLM-0212`–`0213`)

Packet C's official Housing products already expose APIs/downloads and defined geography/vintage semantics. Packet D establishes an acquisition strategy, not a formula: use an exact official product/vintage and selected variables, retain universe/MOE/revision metadata, and persist a derived artifact. (`USR-CLM-0213`–`0216`)

### 5.3 Targeted HOME 2026 transition reconciliation

Packet D re-opened Public Law 119-101, current Part 92, the eCFR cross-references, and HUD materials already used by Packet B. The statute remains controlling for the July 11, 2026 amendments, including removal of former §12748(g). Current Part 92 still contains provisions referring to a 24-month commitment deadline and related reallocation/recordkeeping, while separate current provisions retain project-completion, repayment, recapture, and agreement rules. The eCFR also identifies selected 2025 amendments to §§92.250 and 92.253 as delayed indefinitely at 91 FR 23014. (`USR-CLM-0217`)

Result: the transition is genuine but bounded, not an across-the-board invalidation of Part 92. Claims using unaffected current stages remain supported; claims `0109`, `0112`, and `0140` retain their existing bounds. Guidance cannot override amended statute, and the later freeze must revalidate every relied-on provision.

### 5.4 Packet C current-source reconciliation

Packet D re-opened current Census pages, the current federal procedural-rule compilations, IDIS/HUD sources, and Packet C's mutable-source records. No evidence candidate conclusion became stale. Census's August 6, 2026 update still leaves the 2025 ACS one-year release date undetermined; claim `0187` remains bounded. Rules, HUD operational materials, BPS/SOC, ACS, and release schedules enter the mutable-P0 register. (`USR-CLM-0218`)

## 6. Formal-rule versus ordinary-practice distinctions

| Subject | Formal/data authority | Operational or synthesis boundary |
|---|---|---|
| Geographic identity | ANSI/FIPS/GNIS and GEOID definitions identify entities | A later transformation may create internal keys but cannot discard source/vintage provenance |
| Geographic boundary | TIGER/Line records official statistical boundary representations for a vintage | Geometry is not jurisdiction ownership or a legal land description |
| House apportionment | 2020 Census/statute supply state seat allocation | Current officeholder roster is transient content, not seat identity |
| Senate seat | Constitution supplies two per state and class staggering | A state+class/seat key is a later reproducible mapping choice |
| Population | Census resident-population estimate has a defined universe/date | It is not voter eligibility, citizen population, or latent political behavior |
| HOME transition | Amended statute controls; operative regulation controls within its lawful scope | Older guidance requires provision-specific currentness review |
| Housing information | IDIS/ACS/BPS/SOC define distinct records/estimates | Selecting and compressing variables is later configuration/calibration |
| Offline delivery | Official web/API products provide authoritative input | Runtime need not call those services; a build-generated versioned artifact can preserve reproducibility |

## 7. Contradictions, ambiguity, and supported bounds

### A. Cross-packet contradiction register

| Contradiction ID | Affected claims | Packets | Type | Description and evidence | Resolution | Resulting claim impact | Readiness impact |
|---|---|---|---|---|---|---|---|
| USR-XPC-001 | `0005`–`0008`, `0073`–`0075`, `0093`–`0097`, `0145` | A/B/C | APPARENT_ONLY / JURISDICTION | Packet A establishes states as jurisdictions; Packet B/C include local PJs/consortia as program recipients/claimants | Preserve jurisdiction identity separately from recipient role | None | `READY_WITH_BOUNDS` for intergovernmental mapping |
| USR-XPC-002 | `0085`–`0089`, `0100`–`0101`, `0136` | B | APPARENT_ONLY / TERMINOLOGY | “Obligation” appears at federal award and recipient project-commitment layers | Retain owner-qualified federal obligation and recipient financial obligation/commitment | None | Fiscal execution remains ready with bounds |
| USR-XPC-003 | `0060`–`0070`, `0198` | A/C | APPARENT_ONLY / TERMINOLOGY | State certification, certificates of ascertainment/vote, electoral vote, count, and declaration can be colloquially collapsed | Retain the stage-specific artifacts established by Packet A and accessed in Packet C | None | Election result/certification `READY` |
| USR-XPC-004 | `0109`, `0111`–`0112`, `0140`, `0143`, `0217` | B/C/D | TEMPORAL / AUTHORITY | July 2026 HOME statute postdates existing rule/guidance; eCFR retains older deadlines and delayed amendments | Statute controls amendments; use current regulations provision-by-provision; retain mutable bounds | No status change; three existing bounded claims remain bounded | HOME-related rows `READY_WITH_BOUNDS`; freeze revalidation mandatory |
| USR-XPC-005 | `0132`, `0145`–`0148`, `0174` | B/C | APPARENT_ONLY / SCOPE | Synthetic state claimant differs from real state/local PJ possibilities | Claimant depends on concrete affected recipient and injury | None | LegalContest/recipient rows remain bounded |
| USR-XPC-006 | `0102`, `0141`, `0175`–`0192` | B/C | APPARENT_ONLY / METHODOLOGICAL | IDIS completion is real administrative evidence but not regional material Housing truth | Retain separate administrative record, material owner, and broader measure | None | Information and Housing rows remain coherent |
| USR-XPC-007 | `0175`, `0193`–`0201` | C | APPARENT_ONLY / SCOPE | Internal agency access and public release are different without being contradictory | Access follows institution, authorization, record, and time | None | Player-knowledge row `READY_WITH_BOUNDS` |

Genuine unresolved contradictions: **0**. Existing claim-status changes: **0**. No Packet A/B/C prose or atomic claim was silently rewritten.

### B. Supported bounds carried into audit

1. One explicit geometry, district, apportionment, population, and Housing-data vintage still must be selected later; evidence establishes viable sources, not values.
2. HOME's post-July-2026 statute/regulation/guidance alignment remains mutable.
3. The 2025 ACS one-year release status can change before freeze.
4. State/local/consortium recipient aggregation, elector granularity, layered project finance, court route details, and internal/pre-release access remain configuration questions.
5. Quantitative capacity, delay, persuasion, electoral behavior, and Housing-response magnitudes remain P1.

### C. Cross-seam calendar

| Category | Real institutional/data relation | Evidence claims | Configuration-bound limit |
|---|---|---|---|
| LEGAL FIXED DATE | House terms begin Jan. 3; presidential term begins Jan. 20; regular election and Electoral College/count dates follow constitutional/statutory rules | `0009`, `0021`–`0022`, `0045`, `0063`–`0078` | Dates remain law/vintage dependent; no game-day conversion here |
| LEGAL DEADLINE | Presentment response, electoral certificates/count, HOME plan/project deadlines, and court-rule durations are source-specific | `0041`–`0043`, `0060`–`0069`, `0101`, `0104`, `0109`–`0112`, `0157`–`0158` | HOME transition and current rules require freeze revalidation |
| ADMINISTRATIVE CYCLE | Appropriation/apportionment, HOME allocation, plan/agreement, commitment, draw, reporting | `0080`–`0102`, `0175`–`0178` | Multiple owners/cycles; not one synchronized annual timer |
| DATA RELEASE CYCLE | BPS monthly preliminary/revised releases, SOC revisions, ACS observation period and annual release, IDIS dated reports | `0175`–`0192`, `0218` | Capture, processing, release, and revision are distinct |
| EVENT-DRIVEN PROCEDURE | Bill consideration, veto/override, contested agency action, filing, injunction, notice, response, appeal/stay | `0027`–`0043`, `0143`–`0174` | Sequence is evidenced; elapsed time varies by event/record |
| OBSERVED/PRACTICE LATENCY | Committee/floor access, underwriting/finance assembly, project development/construction, administrative data entry | `0028`, `0034`–`0040`, `0103`–`0108`, `0120`–`0122`, `0134`–`0135` | Magnitudes/distributions remain P1 |

### D. Consolidated architecture-fit-question register

| AFQ ID | Packet / claim IDs | Evidence-backed question | Architecture seams | Importance | Possible resolution class | Current status |
|---|---|---|---|---|---|---|
| USR-AFQ-A001 | A / `0049`–`0059` | Elector appointment/vote stage exists; individual-versus-aggregate elector representation remains open | PoliticalActor; Electoral process | P0 mapping | NON_EVIDENCE_SIMPLIFICATION | Open for configuration; no reopen condition |
| USR-AFQ-A002 | A / `0051` | DC is state-equivalent only for specified presidential-election law | Jurisdiction; Electoral process | P0 mapping | EXISTING_CONFIGURATION | Role-specific configuration appears available |
| USR-AFQ-A003 | A / `0011`–`0013`, `0204`–`0205` | District identity/geometry is time-vintaged | Geography; Time; OfficeAssignment | P0 mapping | EXISTING_CONFIGURATION | Versioned geography/configuration appears available |
| USR-AFQ-B001 | B / `0093`–`0097`, `0114`–`0116`, `0132` | HOME/HTF recipients include states, locals, consortia, designated entities | Jurisdiction; Intergovernmental relationship | P0 mapping | EXISTING_CONFIGURATION | Configure supported recipient jurisdictions/roles; no state-only owner needed |
| USR-AFQ-B002 | B / `0094`–`0101`, `0114`–`0118`, `0133` | Formula/plan/agreement differs from APPLY/determination/award | Procedure; Administrative program | P0 mapping | NON_EVIDENCE_SIMPLIFICATION | Later route compression required |
| USR-AFQ-B003 | B / `0086`–`0089`, `0100`–`0101` | Federal obligation and recipient commitment are distinct | FiscalExecution; Intergovernmental relationship | P0 invariant | EXISTING_CONFIGURATION | Owner-qualified facts preserve distinction |
| USR-AFQ-B004 | B / `0107`, `0120`, `0128`–`0131` | Projects use layered finance without requiring a full finance-stack model | Housing; FiscalExecution | Bounded first-vertical | NON_EVIDENCE_SIMPLIFICATION / DEFERRABLE | Retain complement/dependency; detailed stack can defer |
| USR-AFQ-C001 | C / `0145`–`0148` | Clean claimant can be a local PJ, not necessarily a state | Jurisdiction; LegalContest | P0 mapping | EXISTING_CONFIGURATION | Supported jurisdiction/actor roles appear sufficient |
| USR-AFQ-C002 | C / `0161`–`0164` | Order scope is party/conduct/time specific | JudicialOrder; LegalContest | P0 invariant | EXISTING_CONFIGURATION | Existing scoped order facts appear sufficient |
| USR-AFQ-C003 | C / `0175`–`0192` | Multiple official artifacts reference one Housing owner | Information; Measurement; Housing | P0 invariant | EXISTING_CONFIGURATION | Artifacts remain separate from referent |
| USR-AFQ-C004 | C / `0193`–`0201` | HUD internal knowledge is not executive omniscience | Institution; ControlBinding; Information | P0 invariant | EXISTING_CONFIGURATION | Institution/artifact access can remain bounded |
| USR-AFQ-C005 | C / `0193`–`0196` | Specified holders may have pre-release access without public/general access | Information; ControlBinding; Time | Bounded first-vertical | NON_EVIDENCE_SIMPLIFICATION | Configure only evidenced holders or defer pre-release exposure |

Architecture-reopen assessment: **NO QUALIFYING ARCHITECTURE V0 CONTRADICTION IDENTIFIED.** None shows a direct contradiction, ownerless canonical fact, unavoidable duplicate ownership, impossible accepted causal path, or deterministic/persistence defect. Researchers have not reopened Architecture V0.

### E. Mutable-P0 dependency register — freeze-time revalidated

`lastValidatedAt` below is Packet D research time. Every record was rechecked on 2026-08-22 against exact evidence base `fc2c8ab4a2df9e2c90175aa45060d8772265a82f`; the required per-record fields, checked authorities, results, and impacts are in `US_RESEARCH_FREEZE_REVALIDATION_V0.md`.

| Record | Claim IDs | Source IDs | Mutable class / reason | Current version or vintage | Last validated | Required revalidation method | Readiness rows affected |
|---|---|---|---|---|---|---|---|
| USR-MP0-001 | `0010`–`0012`, `0075`, `0207` | `0002`–`0004`, `0090` | Current Code/apportionment; law and decennial allocation can change | Preliminary Code + 2020 apportionment | 2026-08-21 | Reopen Code status and official apportionment table | 007, 014, 016 |
| USR-MP0-002 | `0017`–`0018`, `0027`–`0038` | `0005`, `0011`–`0013`, `0016` | House rules/manuals; Congress-specific | 119th Congress | 2026-08-21 | Confirm rules/manual edition and changed clauses | 003, 006–008 |
| USR-MP0-003 | `0025`, `0029`, `0035`, `0039`–`0040` | `0008`–`0009`, `0014`–`0015` | Senate rules/precedents and ordinary procedure | Current through research baseline | 2026-08-21 | Confirm official rule/precedent and synthesis currency | 003, 006–008 |
| USR-MP0-004 | `0060`–`0070`, `0076`–`0078` | `0021`–`0027` | Election-administration statutes/procedures | Current Title 3 and official 2024 cycle materials | 2026-08-21 | Reopen Code and official procedural pages | 005, 016–018, 025 |
| USR-MP0-005 | `0202`–`0206` | `0085`–`0089` | Geographic identifiers/boundaries | 2025 state and 119th-district products | 2026-08-21 | Confirm chosen vintage, fields, errata, files/hashes | 014, 016 |
| USR-MP0-006 | `0207`–`0208` | `0090`–`0091` | Apportionment/electoral allocation | 2020 Census; effective 2024/2028 allocation | 2026-08-21 | Confirm effective-election range and unchanged allocation | 007, 016–017 |
| USR-MP0-007 | `0211`–`0213` | `0092`–`0094` | Current population estimates/API | Vintage 2025, July 1, 2025 | 2026-08-21 | Confirm selected vintage, universe, file layout, revision notice, hash | 015, 023 |
| USR-MP0-008 | `0079`–`0086`, `0090`–`0091`, `0138` | `0031`–`0037`, `0056` | Fiscal law/manuals/apportionment procedure | Current Code/A-11/GAO editions | 2026-08-21 | Reopen Code, A-11, and cited current guidance | 009–011, 025 |
| USR-MP0-009 | `0087`–`0089` | `0038` | Uniform grants regulation | Current 2 CFR part 200 | 2026-08-21 | Reopen eCFR sections and effective amendments | 011–013 |
| USR-MP0-010 | `0092`–`0094`, `0098`–`0099`, `0106`–`0112`, `0140` | `0039`–`0040` | HOME statute/current Code | Public Law 119-101; preliminary Code | 2026-08-21 | Confirm Code incorporation and provision-level statutory status | 009, 011–013, 025 |
| USR-MP0-011 | `0093`–`0106`, `0109`–`0111`, `0140`, `0217` | `0041`, `0097` | HOME regulation and delayed amendments | eCFR retrieved 2026-08-21; 91 FR 23014 cross-references | 2026-08-21 | Reopen every relied-on section, amendment/delay note, and effective date | 009, 011–013, 025 |
| USR-MP0-012 | `0095`–`0104`, `0108`, `0140`, `0175`–`0178`, `0216` | `0042`–`0044`, `0072`–`0074` | HUD guidance/IDIS/program materials | Source-specific 2020–2025 artifacts/current pages | 2026-08-21 | Check supersession, current system fields, report endpoint/vintage | 012–013, 023–026 |
| USR-MP0-013 | `0113`–`0119`, `0123`–`0128` | `0045`–`0055` | HTF/CDBG/LIHTC regulation/data/program materials | Source-specific current/vintage | 2026-08-21 | Reopen only if later configuration depends on complement | 012–013, 026 |
| USR-MP0-014 | `0149`–`0156`, `0163`, `0169` | `0057`–`0058`, `0063`–`0068`, `0070` | Current statutes and precedent | Current through 2026-08-21 | 2026-08-21 | Check Code and material superseding precedent | 009, 019–021 |
| USR-MP0-015 | `0157`–`0172` | `0059`–`0062` | Federal procedural rules | Rules effective Dec. 1, 2025 | 2026-08-21 | Confirm official rule editions and later amendments | 019–022, 025 |
| USR-MP0-016 | `0165`–`0167`, `0197` | `0070`–`0071` | DOJ/CM-ECF operational materials | Current web/Code baseline | 2026-08-21 | Confirm system notice behavior and legal text | 022, 024–025 |
| USR-MP0-017 | `0179`–`0183`, `0216` | `0075`–`0076` | BPS/SOC current methodology/releases | 2025/2026 current product pages | 2026-08-21 | Confirm selected release, vintage, revision status, variables | 023, 025–026 |
| USR-MP0-018 | `0184`–`0192`, `0213`, `0216`, `0218` | `0077`–`0079`, `0082`, `0094` | ACS data/method/release schedule | 2024 latest one-year; 2025 date undetermined | 2026-08-21 | Confirm latest release, observation period, geography, MOE, API/file hash | 014–015, 023–026 |
| USR-MP0-019 | `0193`–`0196`, `0201` | `0080`–`0082` | Statistical confidentiality/release/access policy | Current law/policy and 2024 procedure | 2026-08-21 | Confirm Code, DAO, and product-specific access rules | 023–025 |
| USR-MP0-020 | `0199` | `0083`–`0084` | Temporary public-claim artifacts | 2025/2026 examples | 2026-08-21 | Confirm retained artifacts remain available or archive/hash them | 003, 023–024 |
| USR-MP0-021 | `0221`–`0224` | `0099`–`0103` | FY2024 appropriation/apportionment/award and mutable spending record | P.L. 118-42; 2024-04-05 apportionment; 2024-09-25 award | 2026-08-21 | Reopen enacted text and OMB record; archive/hash allocation, award, obligation, outlay, and plan artifacts | 010–013, 025–026 |
| USR-MP0-022 | `0225`–`0226` | `0104`–`0105`, `0120` | Current HOME consortium rule/guidance and named renewal records | Current §92.101; FY2025–FY2027 renewal; HUD-2006-08 official archive replacement | 2026-08-21 | Confirm rule/guidance status and archive/hash named agreements/plan | 012–013, 020, 025 |
| USR-MP0-023 | `0228`–`0230` | `0106`–`0110` | Project scope, final waiver, BABA process, and material-supply synthesis | Stables tied to FY2024 FAIN; 2026 final waiver; current BABA pages | 2026-08-21 | Confirm final status/scope and archive waiver; recheck current process and synthesis editions | 012, 025–026 |
| USR-MP0-024 | `0231`–`0233` | `0092`–`0094`, `0111`–`0112` | Population/CVAP/ACS vintages and mutable eligibility rules | Vintage 2025 Population; 2020–2024 CVAP; 2024 ACS five-year | 2026-08-21 | Freeze files/APIs/hashes, universes/MOEs, state/DC joins, and current eligibility bounds | 014–016, 023, 025–026 |
| USR-MP0-025 | `0237`–`0238` | `0113` | Current HUD newsroom and mailing-list channel | Current web/signup pages | 2026-08-21 | Confirm channel mechanics; archive/hash relied-on pages; select only evidenced exposure measure | 023–025 |
| USR-MP0-026 | `0234`–`0236`, `0239`–`0240` | `0057`–`0068`, `0098`–`0101` | Current legal/procedural rules, calendar instruments, and BPS method | 2024 cohort; current law/rules/methodology | 2026-08-21 | Reopen statutes/rules/precedent and BPS method; verify term/cycle dates and no superseding route fact | 020–026 |
| USR-MP0-027 | `0241`–`0247` | `0114`–`0119` | Funding-cohort, recipient, project, official-publication, and chronology examples | FY2024 award; 2024 plan; 2025 expenditure/permits; planned 2026 completion | 2026-08-21 | Archive/hash award, agenda/minutes, register/audit, environmental and permit records; recheck mutable aggregate outlay and planned status while preserving each example's scope and never treating it as an exact draw, completion, or continuous same-dollar chain | 011, 023–026 |

Mutable-P0 records: **27**. Freeze-time revalidation is **COMPLETE**: `UNCHANGED` **26**, `CHANGED` **1**, `UNAVAILABLE` **0**. The one changed locator dependency was narrowly restored by `USR-SRC-0120`. Independent evidence freeze remains pending.

### F. P0 question-status matrix

| Workstream | Packet | Claim IDs | Status | Bounds / unresolved dependency | Readiness consequence |
|---|---|---|---|---|---|
| 6.1 Federal institutional frame | A/D | `0001`–`0008`, `0073`–`0075`, `0210` | SUPPORTED | Bounded first-vertical institutions only | Required institution/jurisdiction rows ready |
| 6.2 Legislative route | A | `0009`–`0043` | SUPPORTED_WITH_BOUNDS | Committees, cloture, reconciliation, amendment exchange are compression choices | Procedure row ready with bounds |
| 6.3 Fiscal authority/execution | B/D | `0079`–`0102`, `0129`–`0141`, `0175`–`0178`, `0221`–`0224`, `0241`–`0244` | SUPPORTED | Program-general evidence establishes the owner-qualified stages; cohort/recipient/project examples corroborate them without same-dollar reconstruction | FiscalExecution row 011 ready with documented HOME-transition bounds; B-002 received `RECHECK_PASS` against the exact Step 2 base |
| 6.4 Executive/administrative implementation | B/D | `0092`–`0112`, `0140`–`0142`, `0217`, `0227`–`0228` | SUPPORTED_WITH_BOUNDS | Ordinary HUD waiver family established; current HOME/BABA transition mutable | Program row ready with freeze bounds |
| 6.5 Federalism/state participation | B/C/D | `0093`–`0097`, `0114`–`0119`, `0132`–`0133`, `0145`–`0148`, `0225`–`0226` | SUPPORTED_WITH_BOUNDS | Same-HOME branch established; old duties/other lawful routes persist | Intergovernmental row ready with bounds |
| 6.6 Housing material seam | B/C/D | `0098`–`0108`, `0120`–`0122`, `0134`–`0142`, `0175`–`0192`, `0216`, `0224`, `0228`–`0230`, `0233`, `0244` | SUPPORTED_WITH_BOUNDS | Physical latency/mixed mechanisms and Palms permit transition established; completion/magnitudes remain bounded | Material owner ready; data row bounded |
| 6.7 Measurement/reporting/artifacts | C/D | `0175`–`0195`, `0213`, `0216`, `0218`, corrected `0180`, `0240` | SUPPORTED_WITH_BOUNDS | Composite method/vintage; current BPS correction mutable | Information row ready with bounds |
| 6.8 Public claims/player knowledge | C | `0193`–`0201`, `0237`–`0238`, `0245`–`0246` | SUPPORTED_WITH_BOUNDS | Named Corpus plan/Palms claim and nine-participant official meeting event; reading/belief remain distinct | B-007 objective route supplied; ControlBinding boundary ready |
| 6.9 Election/certification/succession | A/C/D | `0044`–`0078`, `0198`, `0207`–`0209`, `0231`–`0233` | SUPPORTED_WITH_BOUNDS | CVAP proxy is not exact eligibility/turnout; vintage remains later choice | Electoral route ready; process row bounded |
| 6.10 Contested-authority/judiciary | C | `0143`–`0174`, `0197`, `0234`–`0236` | SUPPORTED_WITH_BOUNDS | Exact pre-award act/forum/remedy fixed; merits and interim relief adjudicative | Court route ready with Tucker boundary |
| 6.11 Cross-seam calendars | A/B/C/D | `0076`–`0078`, `0084`, `0101`–`0112`, `0157`–`0198`, `0221`–`0247` | SUPPORTED | Corrected multi-year chronology; heterogeneous cycles, event-driven program stages, and variable material latency remain explicit without invented project-specific dates | B-008 objective ordering supplied; time row ready with bounds |
| 6.12 Architecture-fit questions | A/B/C/D | AFQs `A001`–`A003`, `B001`–`B004`, `C001`–`C005`; supporting claims above | SUPPORTED_WITH_BOUNDS | Twelve later mapping/compression decisions; no qualifying contradiction | No reopen; affected rows ready with bounds |

P0 workstream counts: `SUPPORTED` **3**; `SUPPORTED_WITH_BOUNDS` **9**; `NOT_REQUIRED` **0**; `NOT_ESTABLISHED` **0**; `CONFLICTED` **0**. Blocking P0 evidence gaps: **0**. All original Audit A/B findings are closed and Audit C remains CLEAR.

## 8. Facts relevant to accepted architecture seams

The separate [U.S. Configuration Readiness Matrix](./US_CONFIGURATION_READINESS_MATRIX_V0.md) contains all 26 required rows and full claim-level traceability. Candidate counts are `READY` 12, `READY_WITH_BOUNDS` 14, `NOT_READY` 0, and `NOT_REQUIRED` 0.

### A. Cross-packet evidence synthesis

Evidence supports this non-normative institutional chain:

1. A President and administration operate through constitutionally/statutorily distinct offices and institutions.
2. A domestic proposal requires bicameral House and Senate action, identical text, presentment, and signature/veto/override procedure before enactment.
3. Enacted authority does not itself equal appropriation, budget authority, apportionment, obligation, payment, or material effect.
4. HOME is the strongest bounded Housing-program basis: HUD administers formula allocations to state and qualifying local PJs; plan/designation/agreement precede downstream project commitment and draw.
5. Real recipient topology is not state-only, and recipient project selection/finance layers sit downstream from federal allocation/obligation.
6. Lawful fiscal and administrative action can encounter underwriting, financing, environmental, administrative, developer, and construction latency before material Housing completion.
7. IDIS/HUD records measure program stages; ACS/BPS/SOC measure other Housing referents; captured records, released artifacts, public claims, and canonical Housing/Population state remain separate.
8. The administration knows records through institution-specific possession, authorization, notice, or public release—not developer/audit truth.
9. Presidential election proceeds through state/DC popular-result and elector stages, state certificates, electoral voting, congressional count/declaration, entitlement, and January 20 office transfer.
10. A final contested HUD withholding/diversion directive can support one bounded claimant/APA/injunction/order/notice/compliance/appeal/stay route, subject to the grant-contract forum bound.
11. Offices, institutions, laws, programs, Housing facts, information history, and governmental state persist through presidential transfer unless changed by their own lawful transitions.

### B. Synthetic GL0 → U.S. evidence master difference register

| Synthetic fixture assumption | U.S. evidence | Match | Claim IDs | AFQ / later configuration question | P0 readiness consequence |
|---|---|---|---|---|---|
| One legislature | Congress has separate House and Senate | MATERIAL_MISMATCH | `0001`, `0009`–`0043` | Preserve bicameral route | Legislature/chambers ready |
| Small synthetic legislator count | 435 House seats and 100 Senate seats with individual votes | MATERIAL_MISMATCH | `0010`–`0025`, `0207`, `0209` | Scale/content compression | PoliticalActor ready with bounds |
| One executive office | Constitutional President is one office; departments/agencies are distinct institutions | STRONG_MATCH with institutional detail | `0002`, `0004`, `0044`–`0048` | Keep office/institution distinction | Ready |
| State jurisdiction topology | 50 states plus DC's role-specific treatment | STRONG_MATCH with DC bound | `0051`, `0073`–`0075`, `0202` | AFQ `A002` | Ready |
| State APPLY/REFUSE | HOME uses formula eligibility, plan/designation/agreement and includes local PJs | MATERIAL_MISMATCH | `0093`–`0097`, `0132` | AFQs `B001`–`B002` | Intergovernmental ready with bounds |
| Federal application determination | Leading route is not discretionary federal project selection | MATERIAL_MISMATCH | `0094`–`0101`, `0133` | Compress real stages only if later chosen | Program ready with bounds |
| Active grant relationship | HOME grant agreement creates conditioned federal-recipient relationship | STRONG_MATCH | `0096`, `0105` | Exact later representation | Ready with bounds |
| Award | Formula allocation/agreement and federal obligation are distinguishable | PARTIAL_MATCH | `0087`, `0093`–`0101` | Term/stage mapping | Fiscal execution bounded |
| Obligation | Federal obligation exists but differs from PJ commitment | PARTIAL_MATCH | `0086`–`0089`, `0100`, `0136` | AFQ `B003` | Ready with bounds |
| Disbursement | Draw/payment is real and separate from completion | STRONG_MATCH | `0089`, `0101`–`0102` | Preserve owner/stage | Ready |
| Fixed matching percentage | HOME has a conditional 25%-of-draw match, not synthetic 55% project share | MATERIAL_MISMATCH | `0106`–`0107` | Later match compression/value decision | No evidence gap |
| One implementation-support resource | Multiple real capacity/bottleneck dimensions exist | PARTIAL_MATCH | `0103`–`0104`, `0120`–`0122`, `0134`–`0135` | NON-EVIDENCE capacity compression | Housing ready; P1 deferred |
| Housing project creation | PJ/project agreements and downstream owners precede construction | PARTIAL_MATCH | `0100`–`0105`, `0141` | Preserve downstream owner | Ready |
| Material construction capacity | Financing/project/construction constraints create delay/variation | STRONG_MATCH qualitatively | `0103`–`0108`, `0134`–`0135` | Coefficients remain P1 | Ready with bounds |
| One measurement capture/release | Real basis uses IDIS plus ACS/BPS/SOC with product-specific lags/revisions | MATERIAL_MISMATCH | `0175`–`0192`, `0216` | AFQ `C003` | Information ready with bounds |
| Administration/opposition claims | Official communications are provenance-bearing assertions, not truth | STRONG_MATCH | `0194`, `0199` | Claim exposure/persuasion later | Ready with bounds |
| Hidden Population truth | No direct government record establishes exact latent political state | STRONG_MATCH | `0200`–`0201` | Measurements only | Player knowledge bounded |
| Simplified presidential election | Real route includes electors, certificates, count/declaration | PARTIAL_MATCH | `0049`–`0070` | AFQ `A001` | Electoral process bounded |
| Generic certification | Multiple state/federal artifacts have distinct legal meanings | MATERIAL_MISMATCH | `0060`–`0070`, `0198` | Preserve stage semantics | Result/certification ready |
| Office transfer | Outgoing President remains until Jan. 20; successor assumes office then | STRONG_MATCH | `0045`–`0048`, `0070`–`0072` | No material issue | Ready |
| State A claimant | A state or local affected PJ is plausible depending on injury | PARTIAL_MATCH | `0145`–`0148`, `0174` | AFQ `C001` | LegalContest bounded |
| Generic interim-relief GRANT | TRO, PI, and APA §705 are distinct; PI is leading analog | PARTIAL_MATCH | `0153`, `0157`–`0160` | Court-procedure compression | Ready with bounds |
| Single operative order | One order is plausible but must specify subjects/conduct/scope | PARTIAL_MATCH | `0161`–`0164` | AFQ `C002` | JudicialOrder bounded |
| Automatic compliance mutation | Receipt and executive response are separate from order status | MATERIAL_MISMATCH | `0165`–`0168` | Response transition mapping | Compliance bounded |
| Appeal while order active | Appeal does not automatically stay an injunction | STRONG_MATCH | `0169`–`0172` | Separate stay state | Ready |
| Player institutional knowledge | Government has bounded records/access, not world truth | PARTIAL_MATCH | `0193`–`0201` | AFQs `C004`–`C005` | ControlBinding bounded |

## 9. Gameplay simplification candidates — explicitly NON-EVIDENCE

The following consolidated candidates are proposals only. None is approved, factual evidence, or configuration authority.

| Candidate ID | Source packets / claims | Reality being compressed | Proposed compression | Known realism cost | Seams | Configuration decision required |
|---|---|---|---|---|---|---|
| USR-SIM-D001 | A / `0027`–`0040` | Committee, agenda, amendment, cloture, and floor routes | One bounded chamber-consideration sequence with conditional obstacles | Omits route diversity and procedural strategy | Legislature; Procedure | YES |
| USR-SIM-D002 | A / `0030`–`0032` | Conference/amendment exchange | One identical-text reconciliation step | Hides multiple interchamber methods | Procedure | YES |
| USR-SIM-D003 | A / `0049`–`0059` | Individual electors and appointment law | Aggregate elector stage by state/DC | Loses elector-level actors/deviation | PoliticalActor; Electoral process | YES |
| USR-SIM-D004 | A / `0059` | Contingent election | Defer exceptional no-majority path or represent bounded branch | Reduces exceptional-path realism | Procedure; Electoral process | YES |
| USR-SIM-D005 | A/D / `0011`–`0013`, `0204`–`0205` | Time-vintaged district boundaries | Fix one cited congressional-district vintage | Omits redistricting change during play | Geography; Time | YES |
| USR-SIM-D006 | B/C / `0093`–`0097`, `0132`, `0145` | State/local/consortium recipients | Aggregate to bounded subnational-recipient choices | Can obscure local-versus-state authority | Jurisdiction; Intergovernmental | YES |
| USR-SIM-D007 | B / `0094`–`0101`, `0133` | Formula/designation/plan/agreement stages | Compress to a provenance-preserving participation/relationship sequence | Omits administrative detail; must not become false competition | Procedure; Program | YES |
| USR-SIM-D008 | B / `0079`–`0101`, `0136`–`0139` | Detailed federal fiscal terminology | Retain only authority, allocation/award, obligation, payment, material stages | Omits apportionment/allotment nuance | PublicFinance; FiscalExecution | YES |
| USR-SIM-D009 | B / `0103`–`0108`, `0120`, `0128`–`0135` | Layered project finance and capacity | One bounded complementary-finance/capacity dependency | Loses financing-stack and bottleneck heterogeneity | Housing; FiscalExecution | YES |
| USR-SIM-D010 | B / `0106`–`0107` | HOME match exclusions/waivers/contribution accounting | One bounded match rule if selected | Can misstate base, waivers, and nonfederal contribution types | FiscalExecution; Program | YES |
| USR-SIM-D011 | C / `0153`, `0157`–`0164` | TRO/PI/§705 and order-scope detail | One representative noticed preliminary-relief route | Omits emergency and remedial variation | LegalContest; JudicialOrder | YES |
| USR-SIM-D012 | C / `0165`–`0172` | DOJ/CM-ECF/agency notice and stay motions | Aggregate to order-received plus separate response/appeal/stay | Omits internal routing/procedure | Compliance; Time; Information | YES |
| USR-SIM-D013 | C/D / `0175`–`0192`, `0216` | Multiple official Housing artifacts | One program-delivery artifact plus one broader Housing artifact | Omits product breadth and some geography | Information; Housing | YES |
| USR-SIM-D014 | C / `0193`–`0201` | Institution-specific internal/pre-release access | Expose selected documented internal records; require release/access for others | Simplifies interagency access | ControlBinding; Information | YES |
| USR-SIM-D015 | A–D / calendar claims | Heterogeneous real calendars | Compress into deterministic scheduled/event transitions while retaining provenance | Elapsed-time realism reduced | Time/transitions | YES |

## 10. Deferred questions

### A. Deferred P1 calibration register

- Legislator ideology, party loyalty, bargaining, agenda, passage, and reelection probabilities.
- Voter eligibility microdata beyond bounded structure, ideology, preference, attribution, salience, persuasion, turnout, and polling error.
- State/PJ participation probabilities and administrative-capacity coefficients.
- Project-finance shares, construction-delay distributions, failure rates, Housing supply/affordability response, and geographic effect magnitudes.
- Lawsuit filing/success, judge behavior, compliance/noncompliance, appeal, and stay probabilities.
- Measurement error/revision distributions, public-claim exposure/persuasion, information diffusion, and player-information pacing.
- Gameplay values and balance.

### B. Deferred P2 enrichment register

- Current politicians, partisan composition, campaign personalities, polls, approval, and news cycles.
- Every congressional committee/subcommittee, agency, HUD program, state Housing agency, local government, or Housing project.
- Fifty detailed state governments, territories beyond required role clarification, lobbying, campaign finance, and media/social systems.
- Full federal-court hierarchy, nationwide case library, transition-team logistics, and exceptional election history.
- Full macroeconomy, mortgage, zoning, land, construction-industry, and Housing-market systems.

No deferred item is being used to conceal a required P0 gap.

## 11. Source inventory

Packet D adds 13 official primary sources (`USR-SRC-0085`–`0097`): Census state identifiers/GEOIDs, TIGER/Line and cartographic boundary products, 119th congressional-district products, 2020 apportionment, NARA electoral allocations, Vintage 2025 population estimates, Census API documentation, government-work/TIGER reuse terms, and a current Part 92/Federal Register transition snapshot.

The combined source ledger records source status, file/API/product format, vintage, cadence/revision behavior, stable locators, and claim-relative use. No Tier 3 or Tier 4 source is required for Packet D because it adds source/acquisition/status evidence and synthesis rather than new behavioral calibration.

## 12. Evidence gaps

### A. Final evidence-gap register

| Gap ID | Affected P0 question / claims | Description | Severity to readiness | Needed evidence if blocking | Rows affected |
|---|---|---|---|---|---|
| USR-GAP-D001 | 6.4–6.6 / `0109`, `0112`, `0140`, `0217` | HOME statute/regulation/guidance remains in active post-July-2026 transition | BOUNDED_FOR_CONFIGURATION | Not blocking now; provision-level freeze revalidation required | 011–013, 025 |
| USR-GAP-D002 | 6.7 / `0187`, `0218` | 2025 ACS one-year release date remains undetermined | BOUNDED_FOR_CONFIGURATION | Not blocking; choose/revalidate a released vintage at freeze | 015, 023, 025 |
| USR-GAP-D003 | 6.9, 6.11 / `0204`–`0213` | Final accepted geography, apportionment, electoral, population, and Housing vintages are not yet configuration-selected | BOUNDED_FOR_CONFIGURATION | Configuration Contract must choose among supported products after freeze | 014–016, 023, 025 |
| USR-GAP-D004 | 6.10 / `0143`–`0174`, `0234`–`0236` | **REPAIRED:** one exact pre-award consortium-requalification rejection, Arapahoe claimant/injury, District of Colorado APA route, plaintiff-specific relief, Tenth Circuit appeal, and separate stay are supplied | CLOSED_BY_BOUNDED_REPAIR | Later configuration may use only this evidenced route or separately authorize a future delta; Tucker boundary remains | 020–022, 025 |
| USR-GAP-D005 | 6.6–6.8 | Quantitative Housing, capacity, information, and political effects are intentionally uncalibrated | DEFERRED_NON_P0 | P1 research when authorized | 003, 015, 023–026 |
| USR-GAP-D006 | 6.1–6.2, 6.9 | Current officeholders, partisan composition, and complete committee roster omitted | DEFERRED_NON_P0 | P2 only if future content scope requires | 003–008, 016–018 |

`BLOCKS_READINESS`: **0**. `BOUNDED_FOR_CONFIGURATION`: **3**. `CLOSED_BY_BOUNDED_REPAIR`: **1**. `DEFERRED_NON_P0`: **2**.

### B. Pre-audit researcher integrity check

- All claim and source IDs are unique and sequential.
- Every new claim has exact source or prior-claim support with pinpoints/status.
- Every P0 claim retains temporal, jurisdiction, scope, and evidence-class semantics.
- Packet A remains unchanged. Packet B/C exception addenda and the chronology corrections to `0228`/`0239` are explicit; no substantive correction is hidden.
- All 12 P0 workstreams appear in the status matrix.
- All 26 required readiness seams appear in the separate matrix.
- All 12 AFQ IDs resolve to their source packet and supporting claims.
- Simplification candidates remain **NON-EVIDENCE** and outside readiness support.
- B-002's corrected composite-evidence criterion and `RECHECK_PASS` disposition are explicit; no `NOT_READY`, `NOT_ESTABLISHED`, `NOT_REQUIRED`, or `CONFLICTED` result is hidden.
- Mutable-P0 freeze-time revalidation is complete in `US_RESEARCH_FREEZE_REVALIDATION_V0.md`; independent evidence freeze is expressly pending.
- No audit, freeze, configuration, runtime, UI, or architecture work occurred.

### C. Packet D stopping-rule result

The implementation-source strategy, contradiction and temporal reconciliation, P0 statuses, AFQ consolidation, mutable-P0 preparation, 26-row readiness assessment, cross-packet synthesis, difference register, deferred register, and evidence-gap register are complete at implementation-relevant resolution. Further collection would move into audit, freeze, configuration choice, P1 calibration, or P2 enrichment and is outside Packet D.

## 13. Single bounded-repair synthesis

This section descends exactly from `8d3a5c4ff1d906d4bbc5f965fc737d7175b802c2`. It is not a second research phase, audit, freeze, configuration, architecture decision, or implementation.

### A. Canonical Population → electorate proxy → Housing exposure (`USR-RQ-003`)

Vintage 2025 Census state/DC resident population remains the sole canonical Population basis. Join by state/DC FIPS/GEOID. The 2020–2024 ACS CVAP special tab may supply a citizenship-and-age share projected onto that resident basis as a defensible aggregate presidential-electorate proxy. It is not exact eligibility: resident population, age 18+, CVAP, eligible people, registered voters, actual voters, and votes cast remain distinct, and state residence, registration, felony/incapacity, and other rules remain bounded variation. (`USR-CLM-0231`–`0232`; `USR-SRC-0092`–`0094`, `0111`–`0112`)

For Housing exposure, ACS 2024 five-year B25008 may project people in owner- versus renter-occupied housing from the same state/DC basis. B25106 may group household housing-cost exposure by tenure, but it has a household denominator and must remain a separate projected exposure measure with its universe, observation period, estimate, and margin of error. No exposure projection becomes a second Population owner, and none supplies ideology, party, persuasion, turnout, or behavioral coefficients. (`USR-CLM-0233`; `USR-SRC-0111`)

### B. Corrected representative-term chronology (`USR-RQ-009`)

The representative presidential term begins January 20, 2021 and ends January 20, 2025, while its FY2024 awards, project duties, construction, measurement, and public artifacts persist afterward. Exact dates appear only where an authoritative record fixes them; deadlines, administrative cycles, event-driven stages, and variable latency remain distinct.

| Order | Event | Time class | Evidence/bound |
|---:|---|---|---|
| 1 | President takes office, 2021-01-20 | `LEGAL_FIXED_DATE` | Twentieth Amendment; `0045`–`0048` |
| 2 | P.L. 118-42 enacted 2024-03-09 supplies FY2024 HOME budget authority available through 2027-09-30 | `EVENT_DRIVEN`; `LEGAL_DEADLINE` | `0221`; `0099` |
| 3 | OMB approves FY2024 HOME apportionment 2024-04-05 | `FIXED_ADMINISTRATIVE_EVENT` | `0222`; `0100` |
| 4 | HUD allocation and plan cycle proceeds; Corpus publishes the named plan/Palms claim and nine Council participants act on item 24-0996 on 2024-07-16; final adoption follows 2024-07-23 | `ADMINISTRATIVE_CYCLE`; `FIXED_PUBLICATION_AND_MEETING_EVENT` | `0242`, `0245`–`0246`; `0115` |
| 5 | Arapahoe HOME award/obligation is recorded 2024-09-25; the closed consortium route remains distinct from separately scoped B-002 examples | `FIXED_ADMINISTRATIVE_EVENT` | `0223`–`0226`; `0102`, `0104`–`0105` |
| 6 | Corpus award/obligation is recorded 2024-10-25 | `FIXED_ADMINISTRATIVE_EVENT` | `0241`; `0114` |
| 7 | Popular election 2024-11-05 and elector vote 2024-12-17 | `LEGAL_FIXED_DATE` | `0057`–`0067` |
| 8 | Congressional count 2025-01-06; Corpus environmental notice 2025-01-08 states an intended release request on/about 2025-01-24 | `LEGAL_FIXED_DATE`; `FIXED_NOTICE` with event-driven intended request | `0068`–`0070`, `0242`; `0116` |
| 9 | Presidential transfer 2025-01-20; awards, project obligations, and information history persist | `LEGAL_FIXED_DATE` | `0070`–`0072`; `0247` |
| 10 | Palms building permits issue 2025-02-18, establishing physical development after transfer | `FIXED_MATERIAL_EVENT` | `0244`; `0118` |
| 11 | Program-general evidence establishes recipient commitment, IDIS activity setup, draw/payment, expenditure, and completion-record stages; the representative chronology keeps them event-driven and assigns no unsupported Palms-specific date, amount, voucher, or activity id | `EVENT_DRIVEN_PROCESS_STAGE` | `0100`–`0102`, `0175`; scoped examples `0241`–`0243` |
| 12 | Corpus pays Palms at Morris Apartments $117,000 on 2025-09-17; the FY2025 Single Audit reports the same passed-through amount under FAIN M-24-MC-48-0502 | `FIXED_RECIPIENT_EXPENDITURE_EVENT` | `0243`; `0117` |
| 13 | Stables groundbreaking occurs in February 2026; HUD waiver public comment runs 2026-06-24–2026-07-09 and the final waiver becomes effective 2026-08-10 | `FIXED_PROJECT_EVENTS`; `ADMINISTRATIVE_PROCEEDING` | `0228`; `0106`–`0107` |
| 14 | Palms planned completion is 2026-10-01; actual completion/occupancy remains variable and unproved | `PLANNED_DATE`; `OBSERVED_VARIABLE_LATENCY` | `0244`; `0119` |
| 15 | Stables anticipated completion 2027-09-30; actual completion, occupancy, Housing consequence, measurement, official release, and later public exposure follow their own variable/data-release/event-driven clocks | `ANTICIPATED_DATE`; `OBSERVED_VARIABLE_LATENCY`; `DATA_RELEASE_CYCLE`; `EVENT_DRIVEN` | `0229`–`0230`, `0175`–`0192`, `0237`–`0238` |
| Branch | Hypothetically and before an Arapahoe renewed award, HUD issues the defined final consortium rejection; suit, notice, interim relief, order, appeal, and separate stay then follow facts and court schedule | `HYPOTHETICAL_EVENT_DRIVEN`; `OBSERVED_VARIABLE_LATENCY` | `0234`–`0236`; no historical rejection date asserted |

This sequence does not force project delivery before the November 2024 election or January 2025 transfer. It also does not use the 2026 Stables waiver as a pre-award event. The actual July 2024 bounded plan-audience event is distinct from later outcome measurement/release/exposure. (`USR-CLM-0239`, `0247`)

### C. Repaired coherent route

The coherent route is an owner-qualified composite, not a transaction reconstruction. FY2024 authority and apportionment feed HUD formula administration. Program-general law and operations establish PJ project commitment, IDIS activity setup, draw/payment/expenditure, completion-record mechanics, and the boundary to Housing. Arapahoe supplies separately scoped award, consortium, hostile-route, Stables waiver, and material-constraint evidence. Corpus Christi/Palms supplies separately labeled funding-cohort, recipient-plan, recipient-expenditure, project-development, and named-artifact/audience examples. Election, count, and transfer occur before most project delivery; construction, anticipated completion, measurement, release, and later exposure persist afterward. No source is used to imply a continuous same-dollar chain, and no award, plan, expenditure, permit, or report directly writes Housing or Population. (`USR-CLM-0079`–`0102`, `0134`–`0141`, `0175`–`0178`, `0221`–`0247`)

### D. P0/readiness reevaluation after bounded repair

Only the three exception findings and direct dependencies were reevaluated. P0 counts are `SUPPORTED` **3**, `SUPPORTED_WITH_BOUNDS` **9**, and zero `NOT_ESTABLISHED`, `NOT_REQUIRED`, or `CONFLICTED`. The 26 readiness rows are `READY` **12**, `READY_WITH_BOUNDS` **14**, and zero `NOT_READY` or `NOT_REQUIRED`.

Row `011` is `READY_WITH_BOUNDS` because composite authoritative evidence establishes every required owner-qualified stage without requiring same-dollar municipal reconciliation. Row `025` remains `READY_WITH_BOUNDS` on the corrected mechanically ordered chronology. Rows `023`–`024` retain their prior statuses and cite the named artifact/audience evidence. B-002, B-007, and B-008 received `RECHECK_PASS`; no closed finding or unrelated row was reopened.

Exception record `USR-MP0-027` brings the mutable-P0 total to **27**. **FREEZE-TIME REVALIDATION IS COMPLETE; INDEPENDENT EVIDENCE FREEZE IS NOT.**

### E. Repair boundary and architecture result

Packet A was not modified. No claim/source ID was renumbered. Old claims `0228` and `0239` are changed only to correct the Stables dates and ordering; the reason is explicit in the claim ledger and audit synthesis. Architecture V0 ownership, primitives, causal paths, and persistence are unchanged. Audit C remains **CLEAR** and was not rerun.
