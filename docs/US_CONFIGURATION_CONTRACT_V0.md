# U.S. Configuration Contract V0

Status: **STEP 4 CANDIDATE — NOT AUDITED, ACCEPTED, OR IMPLEMENTED.**

## 1. Authority and status

This contract is the configuration authority candidate for the first recognizable United States vertical. Its exact inputs are:

- accepted Architecture V0: `54afd51c6ae894df5c3680cf15df472cdcb125b2`;
- accepted synthetic GL0 runtime: `ffc34c0cce1089ff1eeca671243cab7a2e968c43`;
- frozen U.S. evidence authority: `c0f02ae817001262204ea1272ea93d78ce48a877`;
- accepted U.S. Research Program / Audit Protocol: `6267f805f37f646f4e8c651ea8ac54c65b715e99`.

The user's Step-3 acceptance makes the exact `c0f02ae…` tree the frozen evidence authority for this task. Historical candidate-status labels inside that tree describe the earlier workflow and do not authorize changes to it. This document consumes the freeze; it does not amend Architecture V0, the research program, any claim, any source, or runtime code.

Normative words (`MUST`, `MUST NOT`, `SHALL`) bind later implementation of this candidate only after external acceptance. Claim IDs are `USR-CLM-####`; source IDs are `USR-SRC-####`. A compact range such as `0001–0004` means every identifier in that inclusive range.

### Mapping and state-class vocabulary

| Term | Contract meaning |
|---|---|
| `DIRECT` | The configured identity, rule, amount, date, or field has direct frozen support at the stated scope. |
| `AGGREGATED` | Accepted records are combined or represented at a coarser level without changing their owner or causal meaning. |
| `APPROXIMATED` | The configuration deliberately projects, compresses, or supplies non-factual gameplay scaffolding; the approximation and consumer are named. |
| `DEFERRED` | The finer fact or behavior is absent from V0 and no placeholder may masquerade as it. |
| `STATIC CONFIGURATION` | Changes only by loading another versioned configuration or an enacted structural change supported by future content. |
| `INITIALIZED FROM REAL DATA THEN DYNAMIC` | The accepted real-data value seeds canonical state once; simulation transitions own all later values. |
| `DERIVED` | Rebuildable from named canonical inputs and a versioned transformation. |
| `SIMULATION-GENERATED` | Created by deterministic scenario rules after initialization, not asserted as a real-world fact. |

Every implementation artifact MUST carry the applicable mapping and state class. `APPROXIMATED` never means “observed fact,” and `DEFERRED` never receives a synthetic zero.

## 2. Game/vertical definition

The first vertical starts at **2026-08-22 00:00:00 America/New_York** (`scenarioId: us-v0-2026-08-22`). It is a persistent national political strategy scenario in which an anonymous incumbent administration can support and negotiate one Housing-centered legislative proposal, execute a bounded HUD/HOME route, face geographic delivery differences and one court route, communicate through bounded artifacts, reach the 2028 presidential process, and transfer office while the world continues.

The opening world is real in its governmental scale, state/DC identity, congressional geography, resident-population magnitude/distribution, electoral allocation, selected Housing conditions, and the two named HOME evidence routes. It is intentionally not a replay of the real 2026 political roster or public mood.

The player controls a `ControlBinding` to the current administration's supported strategic decision surface. The player may express executive intentions and choose supported acts. Legislators, judges, participating jurisdictions, material Housing, measurements, voters, election officers, and successors resolve their own state.

The playable causal route is:

```text
agenda and proposal terms
→ Member sponsorship, chamber consideration, individual votes, identical text
→ presentment and signature/veto/possible override
→ legal and fiscal authority
→ HUD/HOME operational decisions and recipient relationships
→ recipient commitment/draw/expenditure stages
→ Housing-owned projects, latency, stock, vacancy, and pressure
→ captured records and delayed releases
→ claims, exposure, belief, attribution, salience, preference, turnout disposition
→ state/DC popular results, electors, count, entitlement, January 20 transfer
→ same canonical world continues
```

## 3. Configuration versus engine boundary

The United States is a named configuration package, not a simulation type. Generic runtime modules may know only accepted concepts such as `Jurisdiction`, `Institution`, `Office`, `Legislature`, `Procedure`, `LegalSource`, `PublicFinance`, `FiscalExecution`, `AdministrativeProgram`, `IntergovernmentalRelationship`, `Geography`, `Population`, `Election`, `Judiciary`, `InformationArtifact`, `Housing`, `Time`, and `ControlBinding`.

The U.S. package owns all identifiers, names, counts, topology, legal thresholds, calendars, source metadata, seed data, and content routes in this contract. Generic modules MUST NOT contain branches or defaults keyed to United States, House, Senate, Presidency, HUD, HOME, Electoral College, 435, 100, 50, 51, 538, or 270. A configuration may register procedures and transition data; it may not inject arbitrary code callbacks that conceal a U.S.-only engine path.

Required boundary shape:

```text
generic engine
  consumes → validated GovernmentConfiguration + ScenarioArtifact

content/us-v0/
  manifest, topology, procedures, legal sources, data artifacts,
  actor scaffold, HOME route, court route, calendar, provenance

content/gl0-synthetic/
  retained one-chamber/eleven-seat/three-jurisdiction fixture
```

The configuration loader MUST validate references and invariants generically: unique IDs, office assignments, chamber membership, thresholds, geography nesting, population conservation, fiscal owner separation, transition ordering, and content hashes. It MUST be able to boot either configuration through the same entry point.

## 4. Configuration layers

| Layer | Contents | Mutability |
|---|---|---|
| L0 manifest | Configuration ID/version, scenario ID/date, authority SHAs, artifact inventory and hashes | Static |
| L1 structural | Jurisdictions, institutions, offices, chambers, procedures, legal-source references, geography/electoral topology | Static unless a later lawful simulation transition explicitly changes it |
| L2 Day-0 seed | Real-data population/Housing values, bounded HOME/fiscal records, initial assignments and active projects | Loaded once |
| L3 authored gameplay | Anonymous actor decision profiles, proposal options, lawful HUD decision family, court fixture, information routes | Static configuration plus dynamic instances |
| L4 canonical world | Laws, assignments, finance, programs, relationships, projects, population political state, elections, artifacts, history | Dynamic and saveable |
| L5 projections | Player-legible summaries, forecasts, maps, explanations, audit/debug projections | Derived; never canonical truth |

No L5 projection may write L4. A source artifact may initialize L2 but cannot overwrite L4 after the scenario starts.

### 4.1 First-vertical state ownership/mutation contract

This table makes the required existence, mutation, reader, player, and omission decisions explicit. Evidence traceability is in Sections 5–7.

| System state | Day-0 owner/class | Authorized mutators during play | Authorized readers | Player observation/action | Finer detail absent |
|---|---|---|---|---|---|
| Jurisdiction/institution identity | Jurisdiction/Institution; static | Only a later configured lawful structural transition; none in V0 | All processes by reference | Observe topology/authority; no direct edit | Full governments/agencies |
| Geography/boundaries | Geography; static real-data artifact | None in V0 | Offices, Population, Housing, Elections, projections | Observe map/nesting; no boundary action | Redistricting and sub-state statistical geography |
| Offices/assignments | Office static; Assignment dynamic | Election/succession/vacancy/term transitions | Chambers, institutions, ControlBinding, access | Act only through valid binding; observe assignments | Real roster and detailed congressional elections |
| Legal sources/rules | LegalSource/LegalOrder; static plus generated law | Enactment, effective/expiry rules, judicial status where applicable | Procedures, finance, programs, elections, courts | Propose/sign/veto; cannot edit operative text after enactment | Full legal corpus/special procedures |
| Legislative proposal/procedure/votes | Legislature/Procedure/PoliticalActor; dynamic | Sponsor, chamber procedure, actor decisions, presentment | LegalSource creation, history, information | Negotiate/support/sign/veto; no direct votes | Committees and parliamentary breadth |
| Public finance/fiscal execution | PublicFinance/FiscalExecution; real seed plus dynamic | Lawful authority, control, obligation, payment, remedy transitions | HUD/HOME, courts, information; Housing receives only validated inputs | Choose supported fiscal/legal intentions; inspect legitimate records | Full budget/accounting/transaction reconstruction |
| HUD/HOME program records | HUD/AdministrativeProgram; real seed plus dynamic | HUD/PJ procedures and lawful player-bound intentions | Fiscal, relationships, Housing inputs, information, courts | Waiver/implementation/litigation intentions | All HUD programs/PJs/IDIS transactions |
| Intergovernmental relationships | Relationship owner; real bounded seed plus dynamic | Qualified federal/PJ/consortium events and orders through compliance | HOME, fiscal, Housing, court, projections | Respond/support; cannot set subnational choice | Full state/local governments/all consortia |
| Resident/population political state | Population; resident real seed, politics synthetic/dynamic | Public-response and election-related Population transitions; no demographic transitions | Elections and bounded projections; Housing owns its own exposure link | Observe only through legitimate aggregates/artifacts; no belief edit | Persons, demographic evolution, detailed demographics |
| Housing material state/projects | Housing; approximate real seed plus dynamic | Housing transition resolver from valid inputs/constraints/time | Measurement, Population exposure projection, forecasts | Choose upstream inputs; observe through artifacts | Parcel, zoning, mortgage, industry, macroeconomy |
| Measurements/artifacts/claims/exposure | Measurement/Information and claim originators; real seed plus dynamic | Capture, release, revision, communication, channel/exposure transitions | Knowledge projections, Population response, audit | Choose bounded claim; cannot alter measure or force exposure | Complete media ecosystem/live web |
| Election/results/entitlement | Election/Electoral process; static rules plus dynamic instances | Population-derived vote resolver, state/elector/count/succession transitions | OfficeAssignment, ControlBinding, history, information | Influence only through prior governing/claims; no vote/result edit | Detailed state administration, individual electors, disputes |
| Court contest/order/compliance | Judiciary/LegalContest/LegalOrder/HUD; dynamic | Parties, court resolver, notice, agency response, appellate/stay transitions | Administration, relationships, fiscal constraints, information | Litigation/compliance intentions; no ruling/order control | Full judiciary/docket/remedies |
| ControlBinding/knowledge | ControlBinding and access projection; dynamic/derived | Assignment/administration/access events | Command validation and player projections | This is the allowed decision surface | Post-defeat alternate role |
| Time/history/save | Time/History; dynamic append-only history | Scheduler and canonical transitions | Every timed system and audit | Advance time/save/load; no history rewrite | Literal daily chores and live-source refresh |

## 5. Day-0 U.S. World Snapshot

### 5.1 Snapshot manifest and counts

The opening snapshot MUST contain:

- one national United States jurisdiction, 50 state jurisdictions, and one District of Columbia jurisdiction: **52 primary jurisdiction records**;
- official FIPS, USPS, name, and GNIS identifiers for each state and DC;
- one 2025 1:500,000 state cartographic layer and one 2025 1:500,000 119th-congressional-district layer;
- **435** district geography records nested in states and **435** House offices, one per district;
- **100** Senate offices, two per state, with class/stagger metadata; DC has no Senate office;
- Congress, separate House and Senate chambers, Presidency, Vice Presidency, the incumbent administration, HUD, bounded fiscal/information institutions, the District of Colorado, and the Tenth Circuit;
- one anonymous occupant assignment for each of the 535 legislative offices and anonymous assignments for President and Vice President; no real politician name, party, biography, or real coalition claim;
- **51 canonical ordinary-Population units**, one per state/DC, holding exact integer resident weights from the selected Census extract; no resident object per person;
- **51 state/DC presidential result units**, NARA's **538** allocated electors, and a configured **270** ordinary majority threshold for the 2028 election;
- selected 2024 ACS five-year Housing measures and 2025 final annual BPS permit measures at state/DC resolution;
- the FY2024 HOME authority/apportionment cohort as historical fiscal/legal context, two detailed real recipient routes (Arapahoe County HOME Consortium and City of Corpus Christi), and the bounded Stables and Palms project records;
- actual-world, administrative-record, measurement-artifact, public-claim, exposure, and belief containers as separate state.

Large configured sets have consumers. House offices are used by chamber membership, individual votes, assignments, district representation, and future vacancy/term transitions. Senate offices are used by membership, votes, state representation, classes, and term transitions. The 51 Population units drive electoral weighting, geographically differentiated material exposure, public response, and map summaries. District geometry drives House constituency identity and map nesting; it does **not** pretend to provide district population in V0.

### 5.2 State/DC identity

Source `USR-SRC-0085` is extracted to exactly the 50 states plus DC using fields `STATE`, `STUSAB`, `STATE_NAME`, and `STATENS`. Puerto Rico and insular-area rows remain in raw source provenance but are excluded from the scenario artifact. Runtime jurisdiction IDs are content-owned (`us.jurisdiction.state.<FIPS>` and `us.jurisdiction.dc.11`); external identifiers remain fields, not primary keys.

DC is never globally flagged “state.” It has role-qualified relations: state-equivalent for Census data and specified presidential-election procedures; federal district for general jurisdiction identity; no voting House or Senate office. These are `DIRECT`, `STATIC CONFIGURATION` decisions supported by claims `0051`, `0073–0075`, `0202–0203` and sources `0001`, `0021`, `0028`, `0085–0086`.

### 5.3 Congressional geography

The selected runtime product is **Census 2025 Cartographic Boundary Files, 119th Congressional Districts, 1:500,000**, with the companion 2025 state/equivalent layer at the same scale (`USR-SRC-0088`). District identifiers and nesting use `STATEFP`, `CD119FP`, and concatenated `GEOID` semantics validated against `USR-SRC-0087` and `0089`. Extraction selects only the 435 apportioned voting districts in the 50 states; DC and territory delegate/resident-commissioner geographies, if present in the source product, are retained in raw provenance but excluded from this V0 House-office artifact. The state-seat totals must match the 2020 apportionment table in `USR-SRC-0090` and total 435.

Raw shapefiles are transformed into a versioned offline topology artifact. Coordinate-system normalization, ring repair, deterministic feature ordering, and topology encoding are recorded. No redistricting engine, precinct, county, tract, block, address, or parcel geography is present. The 119th geometry remains the scenario's House map after January 2027 as an explicit `APPROXIMATED` static-boundary compression; later congressional boundary vintages are deferred. Claims `0076–0077` prevent this approximation from being mislabeled current real boundary truth after its effective period.

### 5.4 House and Senate occupants

Office identity is `DIRECT`; occupant content and behavior are separate.

- Each House office key is `us.office.house.<GEOID>`.
- Each Senate key is `us.office.senate.<STATEFP>.class-<II-or-III-or-I>` using the accepted official class relation, with exactly two differently classed offices per state.
- Each office receives one anonymous `PoliticalActor` and `OfficeAssignment` at Day 0. Actor labels are “Representative for <district>” or “Senator seat <class> for <state>,” never a real person's name.
- Each actor receives an authored, explicitly non-factual decision profile containing proposal-dimension priorities, reservation terms, commitment state, relationship memory, and vote choice state. The exact profile artifact is deterministic, versioned, and `APPROXIMATED / STATIC CONFIGURATION`.
- Chamber-specific profiles are assigned by a fixed content seed and stable office ID. The generator may create diversity but may not create a party label, current partisan composition, ideology claim, or biography. Changing the configuration seed creates another scenario version, not a silent change to this snapshot.

The profiles exist because claims `0018`, `0021`, `0024–0025`, `0027–0038`, and `0209` require consequential individual actors/votes; the frozen evidence does not support their numeric behavior. P1 calibration may replace the scaffold without changing office identity.

### 5.5 Presidency, administration, and control

The snapshot contains separate records for:

1. `us.institution.executive-office`;
2. `us.office.president` and `us.office.vice-president`;
3. anonymous incumbent and vice-presidential `PoliticalActor` records;
4. current `OfficeAssignment` records with constitutional term metadata;
5. `us.administration.incumbent-2026`, which owns the supported administrative strategic surface;
6. one `ControlBinding` from the human session to that surface.

The anonymous officeholders and administration are `APPROXIMATED`, not claims about the real 2026 occupants. The offices, assignments-as-a-concept, term boundary, and institutional separation are `DIRECT`. The player is neither the President object nor the administration owner.

### 5.6 Population and represented-weight conservation

The canonical initial resident population source is **Census Vintage 2025, `NST-EST2025-POP`, field `POPESTIMATE2025`, reference date 2025-07-01** (`USR-SRC-0092`). Extract the 50 states and DC; retain the published U.S. total as a validation value, not a 52nd population unit. State/DC values are integer weights and are displayed as dated estimates.

Invariant:

```text
sum(canonical Population unit residentWeight for 50 states + DC)
= configured in-scope national resident total
```

If the source's published national universe differs from the exact in-scope sum because of source scope or revision semantics, ingestion MUST fail until the manifest explicitly records the supported reconciliation; it may not spread a residual. No equal-state weights, rounding redistribution, or district fabrication is allowed.

The only Day-0 canonical demographic dimensions are resident weight and state/DC residence linkage. Housing tenure exposure and CVAP are owner-qualified projections, not extra Population owners. Race, ethnicity, sex, exact age, income, household composition, citizenship person records, registration, party, ideology, births, deaths, aging, migration, immigration/emigration, and household formation are absent.

District resident-population projection is **not required** in V0 because no first-route House election or district material simulation consumes it. House districts remain real constituency/topology records. This omission prevents unsupported equal district weights.

### 5.7 Electoral structure

The 2028 presidential configuration loads NARA's 2020-Census allocation (`USR-SRC-0091`): 50 states plus DC, 538 electors, ordinary unreduced-majority threshold 270. The electorate proxy uses the **2020–2024 ACS CVAP special tab** at state/DC resolution (`USR-SRC-0111`). For each unit:

```text
cvapShare = accepted CVAP estimate / corresponding special-tab population denominator
eligibleProxyWeight = canonical Vintage-2025 residentWeight × cvapShare
```

The ratio, unrounded internal value, displayed rounded value, estimate/MOE metadata, and transformation version are retained. This is `APPROXIMATED / DERIVED`: it is a citizenship-and-age proxy, not exact eligibility, registration, turnout, actual voting, or votes cast. Legal eligibility, state residence/registration restrictions, turnout disposition, ballot participation, result, certification, elector entitlement, congressional count, successor entitlement, and office transfer remain distinct owners/stages.

Forty-eight states and DC use a statewide winner-take-all allocation rule. Maine and Nebraska instantiate two at-large allocation units plus one unit per House district, preserving their real structural method and total allocation. Because V0 has no district electorate projection, their district result units read the state's aggregate popular-result distribution. Consequently a split slate cannot emerge in V0; this is an explicit `APPROXIMATED` compression supported as a bound by claims `0055–0056`. Individual elector biographies and discretionary behavior are deferred; an appointed-slate record carries a count and produces countable vote records.

No actual 2024 presidential result, current polling, party registration, or real candidate roster initializes the world.

### 5.8 Housing state and selected variables

Canonical Day-0 Housing is seeded from official estimates and then becomes simulation-owned. The state/DC geography is the material resolution; congressional districts do not own Housing truth.

| Runtime field | Day-0 source/field | Universe and transformation | Owner / class | Player purpose and later behavior |
|---|---|---|---|---|
| `housingStockUnits` | 2024 ACS five-year `B25001_001E` + MOE | Housing units, state/DC; integer estimate | Housing; `APPROXIMATED`, real-data then dynamic | Starting stock magnitude; completions, rehabilitation return, preservation loss, and exogenous scenario events may change it. |
| `vacantUnits` and `vacancyShare` | 2024 ACS five-year `B25002_003E` / `B25002_001E`, with MOEs | Vacant housing units / total units; missing is not zero | Housing; `APPROXIMATED`, real-data then dynamic | Geographic availability and project consequence; Housing transitions change canonical vacancy, later artifacts only measure it. |
| `cashRentBurden30PlusShare` | 2024 ACS five-year B25070: sum 30–34.9, 35–39.9, 40–49.9, and 50%+ estimates divided by cash-rent denominator; retain MOEs and “not computed” separately | Renter-occupied units paying cash rent; state/DC | Housing measurement seed; `AGGREGATED`, then dynamic pressure proxy | Recognizable affordability pressure and exposure; never labeled universal affordability. |
| `ownerRenterExposureShare` | 2024 ACS five-year B25008 owner/renter occupied-unit population fields | Persons in occupied housing; shares projected onto state resident unit only for exposure | Housing-owned association to Population; `APPROXIMATED / DERIVED` | Distinguishes tenure exposure without duplicating residents. It does not create households or person records. |
| `tenureCostExposure` | 2024 ACS five-year B25106 selected owner/renter cost-percentage groups, estimates/MOEs | Household universe retained; no conversion to persons | Housing; `AGGREGATED / DERIVED` | Context for distributional material exposure; household shares do not alter resident weights. |
| `annualPermittedUnits` and `permitsPer1kResidents` | BPS final annual 2025 state-level residential units authorized | State/DC when published; `NOT_AVAILABLE` where absent; rate uses canonical population | Information seed and Housing capacity prior; `DIRECT` measure plus `APPROXIMATED / DERIVED` prior | Shows recent production pipeline and initializes an ordinal delivery-capacity prior; it is not starts or completions. |

ACS is a sample-based period estimate, not latent point truth. Initializing canonical Housing from it is therefore explicitly approximated. At Day 0 the source artifact also exists as a dated measurement; after Day 0 the artifact remains unchanged while canonical Housing diverges. SOC starts/completions are deferred because their national/region resolution adds no necessary state/DC causal input in this vertical.

Housing's minimum dynamic fields are stock, vacancy, affordability-pressure index, active assisted projects, project stage/progress, expected-unit contribution, activity type (construction/rehabilitation/preservation), recipient delivery capacity, financing readiness, input availability, compliance hold, and material latency. Section 17 fixes their ownership and transitions.

### 5.9 HUD/HOME bounded-real hybrid

The federal institution is HUD; the program is HOME. V0 uses a **hybrid** recipient resolution:

- complete detailed records for the accepted Arapahoe County HOME Consortium route and City of Corpus Christi PJ route;
- named consortium-member inclusion/exclusion relations only where supported in `USR-SRC-0105`/`0120`;
- the Stables and Palms project routes at the exact supported scope;
- no fabricated recipient standing in for every municipality, and no inference that two recipients represent national performance;
- a state/DC coverage marker `DETAIL_AVAILABLE` or `NOT_INSTANTIATED_V0`, which is metadata, not a government or a zero-activity record.

The Day-0 fiscal/program records include the FY2024 $1.25 billion appropriation and apportionment artifacts; Arapahoe FAIN `M24-DC080221`, $617,268.07 obligation and freeze-checked $61,726.81 aggregate outlay; Corpus Christi FAIN `M24-MC480502`, $1,119,386.26 obligation and freeze-checked $268,520.21 aggregate outlay; and the City-owned September 17, 2025 $117,000 Palms expenditure. These records remain separately owned and are not joined into an asserted same-dollar chain.

The Stables route initializes an active 85-unit affordable project with final HVAC nonavailability waiver `W-0000102` effective 2026-08-10 and anticipated 2027 completion. The Palms route initializes 72 planned senior units with permits `C226687`/`C226685`, a planned 2026-10-01 completion, and material status **development entered / completion unproven**. Administrative “Inspection Complete,” award, permit, expenditure, or planned date may not set physical completion or occupancy.

This resolution is sufficient because it proves real formula/recipient/consortium/project plurality, exact owner boundaries, delivery latency, a lawful HUD tradeoff, and two geographic causal examples without pretending to simulate every PJ. All other HOME recipients and transactions are deferred, not aggregated into invented actors.

## 6. Initial U.S. Data Contract

This table is the short answer to “what real America is loaded?”

| Data family | Day-0 source | Vintage/as-of date | Raw geographic resolution | Runtime resolution | Canonical owner | Mapping type | Dynamic after start? | Player-facing? | Why required | Deferred finer detail |
|---|---|---|---|---|---|---|---|---|---|---|
| State/DC identity | Census ANSI/FIPS/GNIS (`0085`) | retrieved 2026-08-21 | state/equivalent | 50 states + DC | Jurisdiction; Geography refs | DIRECT | No | Yes | Recognizable national topology and joins | territories; full state governments |
| State geometry | 2025 Census cartographic boundary, 1:500,000 (`0088`) | 2025 | state/equivalent polygons | 50 states + DC offline topology | Geography | DIRECT | No | Yes | Real national spatial variation | counties, tracts, blocks, legal-land precision |
| Congressional geography | 2025 119th CD cartographic boundary 1:500,000 (`0087–0089`) | boundaries as of 2025-01-01; 119th | congressional district polygons | 435 districts nested in states | Geography | DIRECT | No | Yes | Real House topology | later boundary vintages/redistricting; district demographics |
| House apportionment/offices | 2020 Census apportionment (`0090`) | current decade | state seat table | 435 House offices | Legislature/Office | DIRECT | Offices no; assignments yes | Yes | Bicameral scale and individual votes | delegates; current real roster; detailed committees |
| Senate offices/classes | Constitution + official Senate class record (`0001`, `0010`) | structural/current class record | state/seat class | 100 offices, two/state | Office/Legislative chamber | DIRECT | Assignments may change | Yes | State representation and stagger | real roster/biographies |
| Presidency/administration | constitutional/legal sources (`0001`, `0019–0022`) | law current at freeze | federal | separate offices, assignments, administration, binding | Governance/ControlBinding | DIRECT + APPROXIMATED occupants | Yes | Yes | Player authority and succession | real officeholder/party content |
| Resident Population | Census Vintage 2025 `NST-EST2025-POP` (`0092`) | 2025-07-01 | nation/state/DC | 51 state/DC aggregate units | Population | DIRECT | Political state yes; resident magnitude no in V0 | Yes | Real magnitude/distribution | district population; demographic evolution/detail |
| CVAP proxy | 2020–2024 ACS CVAP special tab (`0111`) | released 2026-01-30 | state/DC | 51 derived eligibility proxies | Population projection/Electoral | APPROXIMATED | Proxy base no; turnout/votes yes | Bounded label | Prevent resident=eligible shortcut | registration, exact eligibility, district CVAP |
| Electoral allocation | NARA 2020-apportionment allocation (`0091`) | applies to 2024/2028 | state/DC | 538 entitlement units; 270 threshold | Electoral process | DIRECT; ME/NE result compression APPROXIMATED | Results/entitlement yes | Yes | Recognizable presidential route | individual electors; split outcomes; contingent election |
| Housing stock/vacancy | ACS 2024 five-year B25001/B25002 (`0077`, `0094`) | 2020–2024 rolling 60-month period | state/DC | state/DC canonical seed | Housing | APPROXIMATED | Yes | Yes | Materially different map and base stock | district/local/parcel stock; unit microdata |
| Housing affordability/exposure | ACS 2024 five-year B25070/B25008/B25106 (`0078`, `0111`) | 2020–2024 rolling 60-month period | state/DC | state/DC measures/projections | Housing/Measurement | AGGREGATED + APPROXIMATED | Canonical pressure yes; source artifact no | Yes, with universe/MOE | Geographic pressure and exposure | full rents, owner-cost model, households, causal coefficients |
| Permitting pipeline | BPS final annual 2025 (`0075`, `0098`) | final posted 2026-05-14 | state/permit place source | state/DC annual measure and capacity prior | Information/Housing prior | DIRECT + APPROXIMATED prior | Canonical pipeline yes | Yes | Initial production variation and latency input | permit-place actors; monthly history; project matching |
| SOC/NRC | Census/HUD SOC (`0076`) | current at freeze | nation/Census region | absent | — | DEFERRED | No | No | No state/DC consumer in V0 | starts/completions regional series |
| HOME authority/fiscal cohort | P.L. 118-42, OMB apportionment, CPD 24-01 (`0099–0101`) | FY2024; through 2027 | federal account/program | historical authority/apportionment artifacts | LegalSource/PublicFinance/FiscalExecution | DIRECT | Existing artifacts no; future execution yes | Yes | Grounds authority→control route | complete national account reconstruction |
| Detailed HOME recipients | Arapahoe and Corpus sources (`0102–0105`, `0114–0117`, `0120`) | FY2024–FY2027 / freeze as-of | PJ/consortium/award/expenditure | two detailed PJ routes | Program/relationship/fiscal owners | DIRECT | Relationships/records can change by simulation | Yes | Real federalism and owner-qualified delivery | all PJs/consortia/transactions |
| Detailed Housing projects | Stables and Palms (`0106`, `0118–0119`) | fixed events/plans through 2026-08-22 | project | two active bounded projects | Housing | DIRECT facts + APPROXIMATED latent state | Yes | Yes | Real latency/input counterfactuals | every transaction, unit, occupancy, parcel economics |
| Program measurement | IDIS guide, PR20, HUD FY2024 report (`0072–0074`) | through 2024-12-31/FY2024 | national/program/PJ/activity as available | source artifacts plus two-route records | Administration/Information | AGGREGATED | New records/releases yes | Yes | Separates delivery record from material truth | complete live IDIS extract |
| Initial political behavior | no real-roster/opinion dataset accepted | scenario seed 2026-08-22 | none | anonymous actors + 51 population political units | PoliticalActor/Population | APPROXIMATED / SIMULATION-GENERATED | Yes | Yes, never labeled real | Makes votes/response/election causal | real parties, polling, ideology, persuasion calibration |

## 7. 26-seam U.S. configuration mapping

| Architecture concept | U.S. instantiation | Frozen claim IDs | Frozen source IDs | Mapping type | Configuration decision | Explicit simplification/bound | Runtime owner | Implementation consequence | Player-facing consequence |
|---|---|---|---|---|---|---|---|---|---|
| 1. Jurisdiction | U.S.; 50 states; DC; two detailed PJs/consortium; D. Colo.; Tenth Circuit | `0005–0008`, `0051`, `0073–0075`, `0093–0097`, `0145–0148`, `0202–0203` | `0001`, `0021`, `0028`, `0040–0041`, `0057–0058`, `0085–0086`, `0104–0105`, `0120` | DIRECT | Instantiate only role-needed jurisdictions and qualified relations | DC is state-equivalent only per role; local PJs are not states; no full local governments | Jurisdiction | Loader must support typed relationships, not a country enum | Player sees who has authority and why a recipient can differ |
| 2. Institution | Congress, House, Senate, Executive Office, HUD, OMB fiscal interface, Census/NARA publishers, DOJ, two courts | `0001–0004`, `0015`, `0044–0048`, `0092`, `0165–0167`, `0175`, `0210` | `0001`, `0005–0010`, `0019–0020`, `0039–0042`, `0057–0075`, `0080–0082`, `0108` | DIRECT | Bounded roster only | No universal agency catalog or full bureaucracy | Institution | Institutions loaded from content with capabilities/references | Institutional origin and limits are legible |
| 3. PoliticalActor | 535 anonymous legislators; anonymous executive actors/candidates; bounded judges/claim authors | `0018`, `0021`, `0024`, `0037–0038`, `0049–0059`, `0164`, `0199`, `0209` | `0001`, `0005`, `0008–0010`, `0024`, `0063`, `0083–0084` | APPROXIMATED | One actor per occupied office; deterministic non-factual behavior profiles | No current names, parties, biographies, or evidence-claimed coefficients; elector slates aggregated | PoliticalActor | Votes and choices resolve per actor; profiles tagged synthetic | Player negotiates with autonomous individuals, not party vote totals |
| 4. Office | 435 House, 100 Senate, President, Vice President, HUD Secretary role, bounded judicial offices | `0002`, `0013–0015`, `0019–0024`, `0044–0048`, `0071–0072`, `0209` | `0001–0010`, `0019–0022`, `0108` | DIRECT | Stable offices exist apart from people | Leadership/cabinet/court breadth only where route needs it | Office | References target offices; actor deletion cannot delete office | Player sees authority tied to office, not personality |
| 5. OfficeAssignment | Anonymous Day-0 assignments; terms; presidential entitlement/transfer; generated later assignment changes | `0009`, `0014`, `0022–0026`, `0046–0048`, `0060–0072` | `0001`, `0010`, `0021–0027` | DIRECT + APPROXIMATED occupants | Separate assignment records with start/end and source process | Congressional election detail is compressed; exceptional vacancies/contingent route deferred | OfficeAssignment | Term/succession transitions replace refs without resetting actors/world | Officeholder can change while institution/history persists |
| 6. Legislature | Congress containing House and Senate | `0001`, `0027–0043` | `0001`, `0005`, `0008–0018` | DIRECT | Bicameral container; enactment needs both chambers' identical text | No Parliament-as-one-threshold shortcut | Legislature | Procedure composes two chamber results | Player must build two different coalitions |
| 7. Legislative chamber | House 435/district; Senate 100/two-state/class; separate memberships | `0009–0026`, `0207`, `0209` | `0001–0010`, `0090` | DIRECT | Full office scale; quorum and vote thresholds derived from current membership | Delegates, Resident Commissioner, detailed vacancies deferred | LegislativeChamber | No constant seat count in engine; chamber config drives iteration | Separate vote outlook/results for each chamber |
| 8. Legislative procedure | Introduction, bounded consideration/amendment, roll calls, identical text, presentment, sign/veto, override | `0027–0043` | `0001`, `0005`, `0008–0018` | AGGREGATED | One consideration gate and one ordinary amendment opportunity per chamber; conditional Senate cloture; max two text exchanges | Committees/conference membership, unlimited debate, reconciliation details omitted | Procedure/LegalOrder | Data-driven state machine and thresholds; failed stage creates no law | Player can bargain/change terms; bill can fail at several real seams |
| 9. Legal source | Constitution, statutes, appropriations, chamber rules, HOME regulation/agreement, generated enactments/orders | `0001–0008`, `0041–0043`, `0076–0081`, `0092–0112`, `0149–0174`, `0217` | `0001`, `0017`, `0031–0044`, `0057–0068`, `0097`, `0099` | DIRECT | Store authority type, issuer, status, effective interval, provenance; no full legal corpus | Only propositions used by route are encoded | LegalSource/LegalOrder | Rules reference source IDs; generated law never edits source history | Player sees authority and contested/operative status |
| 10. PublicFinance | FY2024 HOME budget authority, purpose/time/amount, apportioned control, generated future authority | `0079–0086`, `0090–0091`, `0129–0131`, `0138`, `0221–0223` | `0031–0037`, `0056`, `0099–0101` | DIRECT | Load cohort authority/apportionment artifacts; do not invent national remaining balance | No single `availableFunds`; full federal budget absent | PublicFinance | Separate authority ledger from obligations/payments | Passing a bill is visibly insufficient to spend |
| 11. FiscalExecution | HUD allocation/obligation, PJ commitment, draw/outlay, recipient expenditure as separate records | `0079–0102`, `0136–0141`, `0175–0178`, `0221–0224`, `0241–0244` | `0031–0044`, `0072–0074`, `0099–0103`, `0114–0119` | DIRECT | Preserve owner-qualified stages and cited amounts; future records simulation-generated | No continuous same-dollar provenance assertion; complete national transactions deferred | FiscalExecution plus stage owners | Typed transitions; no payment-to-Housing write | Player can diagnose where money is legally/administratively located |
| 12. Administrative program/institution | HUD-administered HOME; BABA nonavailability waiver family | `0092–0128`, `0142`, `0175–0178`, `0216–0217`, `0227–0230` | `0039–0055`, `0072–0074`, `0097`, `0106–0110` | DIRECT | HOME is first deep program; waiver grant/deny/return-for-record is first post-enactment decision family | Other HUD programs and full rulemaking omitted | AdministrativeProgram/HUD | Program configuration cannot mutate law, finance, or Housing directly | Meaningful play remains after enactment; compliance and delay compete |
| 13. Intergovernmental relationship | HUD↔state/local PJ/consortium; Arapahoe inclusion/exclusion; Corpus PJ | `0093–0108`, `0114–0119`, `0132–0133`, `0145`, `0225–0226` | `0040–0055`, `0104–0105`, `0120` | DIRECT | Two detailed real recipient routes; relationship status has plan/agreement/conditions | No universal APPLY/REFUSE state rule; other recipients absent | IntergovernmentalRelationship | Relationship is its own canonical record with endpoint refs | Local participation/capacity can redirect geographic effects |
| 14. Geography | 2025 state and 119th CD 1:500k topology, official GEOIDs/nesting | `0011–0013`, `0073–0077`, `0202–0206` | `0002–0003`, `0028–0029`, `0085–0089` | DIRECT | Freeze one offline geometry vintage | 119th map remains static after 2027; no redistricting or finer geography | Geography | Generic geometry loader and versioned joins | Recognizable map; boundaries are not jurisdiction authority |
| 15. Population | 51 state/DC units weighted by Vintage-2025 residents; CVAP/Housing projections reference them | `0073–0075`, `0184–0186`, `0202`, `0211–0213`, `0231–0233` | `0028`, `0077–0078`, `0085`, `0092–0094`, `0111–0112` | DIRECT + APPROXIMATED projections | One canonical resident owner; exact conservation | No individuals, demographic evolution, ideology, district population | Population | Aggregate/correlation-preserving operations; projections rebuildable | Real population magnitude; political state can change without changing headcount |
| 16. Electoral boundary/process | 51 state/DC results; 538 electors; ME/NE structural subunits; state popular→elector→count | `0007`, `0049–0069`, `0075–0078`, `0205`, `0207–0209`, `0231–0232` | `0001`, `0021–0027`, `0089–0091`, `0111–0112` | DIRECT + APPROXIMATED | 2028 allocation; state CVAP proxy; ME/NE district results read state distribution | Exact state certification workflows, district electorate, elector discretion deferred | Electoral | Configured allocation rules and dated transitions; no universal direct election | State outcomes and electoral votes can diverge from national totals |
| 17. Election result/certification | popular result, state result artifact, ascertainment, elector votes, congressional declaration | `0057–0070`, `0198` | `0021`, `0023`, `0025`, `0027`, `0080–0082` | AGGREGATED | One bounded state certification transition per unit, then distinct federal artifacts | State canvass/audit officer detail compressed | ElectionProcess/InformationArtifact | Separate immutable artifacts and status transitions | Election night is not office transfer; disputes/delays remain possible |
| 18. Executive succession/transfer | President-elect entitlement; Jan. 20 2029 noon assignment and binding change | `0044–0048`, `0070–0072`, `0076–0078` | `0001`, `0019–0022` | DIRECT | Binding expires at term boundary; recreated only if supported player-aligned entitlement exists | Transition logistics and exceptional succession deferred | OfficeAssignment/ControlBinding | World graph persists; access recalculated | Win/loss changes control, not accumulated world state |
| 19. Judiciary | District of Colorado and Tenth Circuit only for selected route | `0003`, `0149–0174`, `0235–0236` | `0001`, `0030`, `0057–0068` | DIRECT | Instantiate bounded district/appellate forums and generic judicial offices | Supreme Court, other districts/circuits, full docket absent | Judiciary | Forums and appellate edge are configuration data | Player faces a concrete court, not an all-purpose legality switch |
| 20. LegalContest | Hypothetical final HUD rejection of Arapahoe requalification, APA review | `0143–0174`, `0234–0236` | `0057–0068`, `0098`, `0104–0105` | DIRECT route + APPROXIMATED case facts | Pre-award, prospective nonmoney claim; D. Colo.→Tenth Circuit | Merits/finality/standing/order factors resolved in simulation; grant-payment route excluded | LegalContest | Filing, admission, ruling, appeal, stay are distinct transitions | Player chooses litigation response under uncertainty |
| 21. JudicialOrder | Plaintiff-specific preservation/reconsideration order with receipt, status, stay/appeal | `0153`, `0157–0174`, `0236` | `0059–0062`, `0068`, `0070–0071` | DIRECT + APPROXIMATED operative terms | Order may preserve amount, bar reallocation, require lawful reconsideration | No nationwide automatic rule; exact terms case-resolved | LegalOrder/JudicialOrder | Court cannot mutate program/fiscal/Housing state directly | Player sees what is commanded and whether it is stayed |
| 22. Administrative compliance | HUD receipt/notice; comply, seek stay/appeal, or bounded noncompliance response | `0162`, `0165–0173`, `0197` | `0059–0062`, `0070–0071` | AGGREGATED | Separate receipt, response decision, action, and consequence | Real response variety compressed; unlawful options remain possible/consequential | HUD administration | Explicit transition consumes operative order; no magic court write | Court intervention creates a governing decision and delay/risk |
| 23. Information artifact/measurement | IDIS/PR20, ACS, BPS, judicial filings/orders, state election artifacts, public claims | `0175–0199`, `0213`, `0216`, `0218`, `0245–0246` | `0072–0084`, `0094`, `0113`, `0115` | DIRECT + AGGREGATED | Separate capture, record, release, revision, claim, channel, exposure | No full media ecosystem; dated official channels only | Information/Measurement | Artifact provenance/as-of/revision mandatory; no truth mutation | Player sees delayed/qualified evidence and competing claims |
| 24. Player knowledge / ControlBinding | Administration knows received internal records/orders; public data only on release; binding to strategy surface | `0165–0167`, `0193–0201`, `0245–0246` | `0070–0071`, `0080–0084`, `0113`, `0115` | AGGREGATED | Access graph derives legitimate knowledge; debug truth separate | No government-wide omniscience; availability ≠ reading/belief | ControlBinding/Knowledge projection | Queries require actor/access/as-of context | Uncertainty and provenance are gameplay, not hidden debug leakage |
| 25. Time/transitions | 2026-08-22 start; fiscal/program cycles; 2028 election; Dec. 19 electors; Jan. 6 count; Jan. 20 transfer | `0009`, `0021–0022`, `0045–0048`, `0060–0078`, `0084–0112`, `0157–0198`, `0221–0247` | `0001–0027`, `0031–0044`, `0057–0082`, `0099–0119` | DIRECT + APPROXIMATED pacing | Legal dates/deadlines exact; player wait compressed through event advance; project latency variable | Congressional election detail and literal every-day waiting omitted | Time/Scheduler/History | Deterministic ordered transitions and save/load equivalence | Player can advance to meaningful decisions; projects may cross administrations |
| 26. Housing material owner | State/DC stock, vacancy, pressure; Stables/Palms; future assisted projects and constraints | `0101–0108`, `0120–0122`, `0134–0142`, `0175–0192`, `0216`, `0224`, `0228–0230`, `0233`, `0244` | `0041–0055`, `0072–0078`, `0103`, `0106`, `0109–0111`, `0118–0119` | APPROXIMATED seed + DIRECT routes | Housing alone resolves physical stage, usable units, stock/vacancy/pressure after valid inputs | No mortgage/zoning/parcel/industry/macroeconomy; magnitudes provisional | Housing | Program/payment transitions submit inputs only | Success, delay, mixed outcome, and stale measurement are visible possibilities |

## 8. Government/jurisdiction topology

The implementation target is this bounded graph:

```text
United States jurisdiction
├── Congress institution / Legislature
│   ├── House chamber → 435 offices → 435 district constituencies
│   └── Senate chamber → 100 offices → 50 state constituencies/classes
├── Executive Office institution
│   ├── President office + assignment
│   ├── Vice President office + assignment
│   └── incumbent administration ← ControlBinding
├── HUD institution
│   └── HOME program
│       ├── Arapahoe County HOME Consortium relationship
│       │   └── Stables project input route
│       └── City of Corpus Christi PJ relationship
│           └── Palms project input route
├── bounded fiscal interfaces (Congressional authority / OMB control / HUD execution)
├── bounded information publishers (HUD, Census, NARA)
└── bounded court route
    └── District of Colorado → Tenth Circuit

Subnational jurisdictions
├── 50 states
│   ├── state geography and resident Population unit
│   ├── House district geography/offices
│   ├── two Senate offices
│   ├── presidential result/elector allocation
│   └── state/DC Housing state
└── District of Columbia
    ├── federal-district identity
    ├── Census state-equivalent relations
    ├── presidential result + 3 electors
    └── Housing/Population state-equivalent data
```

The tree describes relations, not ownership nesting. A district is Geography and constituency; the House owns its office. HUD does not own a PJ. A PJ does not own its residents. A project does not own the jurisdiction. DC's branch contains no Senate office and no apportioned voting House office.

Only two local/PJ content routes are deep enough to make decisions. Municipalities named incidentally in program files are references unless explicitly instantiated. Census, NARA, OMB, and DOJ receive only the capabilities/state needed for source release, fiscal control, election artifacts, or litigation; they are not encyclopedic agency simulations.

## 9. Political actors/offices/assignments

### 9.1 Minimum actor state

Each legislative actor record contains:

- persistent anonymous actor ID;
- current `OfficeAssignment` reference and chamber membership derived through that assignment;
- proposal-dimension evaluation vector (appropriation magnitude, recipient flexibility, compliance burden, geographic distribution, administrative capacity support);
- current support state: `UNASSESSED`, `LEAN_YEA`, `CONDITIONAL`, `LEAN_NAY`, or `COMMITTED` with the exact proposal version and expiry/event condition;
- bounded relationship memory for negotiations with the administration and other actors;
- last decision and stated reason artifact, if released;
- autonomy seed for deterministic causal resolution.

Coalition summaries are derived from actors. No coalition or party object casts a vote. Commitments constrain later decisions only according to their recorded terms; they are neither certain mind control nor cosmetic text.

### 9.2 Separation rules

`Office` determines legal position and constituency. `PoliticalActor` determines identity and behavioral state. `OfficeAssignment` determines who may exercise the office over an interval. A candidate is a contest role and owns no office. The administration is an institution/organizational state and is not identical to the President. `ControlBinding` grants the human an allowed decision surface and owns no governmental fact.

House and Senate Day-0 occupants are synthetic scenario content because the freeze does not contain a current roster. Their display MUST carry a non-historical label. Real names, parties, caucus memberships, committee assignments, biographies, campaign finance, and current partisan composition may be added only by a later narrowly accepted content acquisition; none blocks V0.

### 9.3 Assignment transitions

Presidential assignment follows Section 19. House two-year and Senate six-year/class terms are stored as direct legal metadata. V0 does not simulate detailed congressional campaigns. At a term boundary, a deterministic `SIMULATION-GENERATED` assignment rollover may retain or replace anonymous occupants using the relevant state-level political state and stable causal randomness; it is an `APPROXIMATED` continuity mechanism, not a certified district election. It may change chamber behavior but may not emit a fake real election artifact. A later district-electorate/congressional-election configuration supersedes this compression.

Vacancies may be represented as unoccupied assignments and reduce current membership for procedure calculations. The distinct House-election and Senate state-law temporary-appointment routes are structurally reserved but deferred as playable content.

## 10. Congress and legislative procedure

The administration originates an agenda/proposal, but a configured Member must sponsor and introduce a bill. The player can seek sponsorship and negotiate text; the player cannot click a bill directly into a chamber.

### 10.1 Chamber configuration

| Feature | House | Senate |
|---|---|---|
| Seats/offices | 435 district-qualified offices | 100 state/class-qualified offices |
| Ordinary quorum | Majority of current chamber membership, computed | Majority of current chamber membership, computed |
| Ordinary passage | Majority of votes cast with quorum; tie fails | Majority of votes cast with quorum; tie may be resolved by configured Vice-President tie vote |
| Individual record | One vote per entitled occupied office | One vote per entitled occupied office; VP only on equal division |
| Agenda compression | Sponsor + bounded consideration gate reflecting leadership/rules access | Sponsor + bounded consideration gate reflecting agenda/consent/debate conditions |
| Debate closure | No separate V0 cloture | A threatened-extended-debate flag creates a distinct three-fifths cloture gate; cloture is never universal passage threshold |
| Amendment | At most one consequential configured amendment round before final passage | At most one consequential configured amendment round before final passage |

Thresholds are procedure expressions over current membership/votes, not hard-coded outputs. The initial full-membership ordinary numeric implications (House quorum 218; Senate quorum 51) are derived and used only as validation examples.

### 10.2 Bounded state machine

```text
DRAFT_AGENDA
→ SPONSOR_SOUGHT
→ INTRODUCED_IN_ORIGIN
→ ORIGIN_CONSIDERATION_GATE
→ optional ORIGIN_AMENDMENT
→ ORIGIN_FINAL_ROLL_CALL
→ OTHER_CHAMBER_CONSIDERATION_GATE
→ optional OTHER_CHAMBER_AMENDMENT
→ OTHER_CHAMBER_FINAL_ROLL_CALL
→ if texts differ: bounded text exchange (maximum two exchanges)
→ IDENTICAL_TEXT
→ PRESENTED
→ SIGNED | VETOED | no-signature constitutional resolution
→ if vetoed: optional two-thirds override roll call in each chamber
→ ENACTED | FAILED
```

Failure or expiry at any pre-enactment state produces no enacted `LegalSource`, no bill-derived budget authority, and no bill-derived program authority. Historical proposal/vote records persist.

### 10.3 Process compressions

| Real process | Configuration compression | Causal relation preserved |
|---|---|---|
| Committee referral, hearing, markup, report, bypass routes | One evidence-qualified consideration gate per chamber | A proposal may be delayed, changed, blocked, or reach the floor; committee approval is not falsely universal |
| House special rules and floor scheduling | Agenda viability plus consideration terms | Leadership influences access but does not own Member votes |
| Senate consent, agenda setting, extended debate, cloture | Agenda gate; separate cloture only when delay is threatened | Passage is not universally a 60-vote event |
| Many amendments | One player-relevant amendment opportunity in each chamber | Accepted amendment changes exact text and actor support |
| Amendments between houses / conference | Maximum two text exchanges; no separate conference institution | Both chambers must still pass identical text |
| Presentment timing and veto | Exact constitutional decision states and ten-day rule class | President cannot enact by mere agenda intent; override remains bicameral |
| Reconciliation/appropriations breadth | Ordinary bill route with explicit authorization and budget-authority provisions | Authorization remains distinct from appropriation; special processes are not silently invoked |

Committees, subcommittees, holds, unanimous-consent agreements, detailed filibuster tactics, reconciliation constraints, conference membership, nonvoting members, and every parliamentary motion are deferred.

## 11. Presidency/administration/ControlBinding

The `ControlBinding` permits the player to:

- set and revise administration proposal terms before legal lock points;
- authorize negotiation positions and accept/reject offered amendments;
- choose signature, veto, or supported no-signature posture at presentment;
- choose a HUD implementation intention within the configured delegated surface;
- choose whether and how the administration issues a public claim from available artifacts;
- choose litigation/compliance intentions available to the administration.

The binding does not permit the player to cast legislative votes, issue a judicial order, set a PJ decision, fabricate a measurement, edit an obligation as paid, set project completion, set belief, cast ballots, certify a result, appoint electors outside the process, or remain in control after entitlement/assignment ends.

The administration knows its own recorded decisions and properly received agency records. The President acts through office and lawful supervision; HUD retains its institutional/program acts. A player instruction that lacks authority or a required record becomes an attempted act that may be refused, delayed, contested, or ineffective; it is not silently normalized into success.

At noon on January 20, 2029 the old assignment and binding end. If the player-aligned ticket has successor entitlement, a new administration, assignment, and binding are created at the boundary. Otherwise the world continues without the outgoing binding; later product design may offer observation or another role, but this contract does not invent one.

## 12. Public finance/fiscal execution

The canonical chain is typed and owner-qualified:

```text
LegalSource: program authorization / eligible purpose
→ PublicFinance: appropriation and purpose-time-amount budget authority
→ FiscalExecution: OMB apportionment/control
→ HUD Program: formula allocation / federal grant agreement / obligation record
→ IntergovernmentalRelationship: HUD↔PJ/consortium conditions
→ PJ Administration: project selection and legally sufficient commitment
→ FiscalExecution: IDIS activity setup and draw/payment records
→ PJ/project owner: expenditure/eligible cost record
→ Housing input: validated resources/readiness/compliance
→ Housing: physical progress/completion/usable stock consequence
```

V0 loads the accepted FY2024 cohort only at its supported scopes. It does not calculate a national “cash remaining,” infer a project draw from aggregate outlay, or reconcile the Arapahoe and Corpus examples into one chain. A new in-game bill may create simulation-generated authority and later fiscal records; those records retain their originating law, fiscal year, purpose, availability interval, amount, owner, and history.

Required invariants:

- authorization is not budget authority;
- apportionment is not recipient entitlement or payment;
- allocation/award is not obligation unless the record says it is;
- obligation is not outlay;
- aggregate outlay is not an exact project draw;
- PJ commitment requires its configured written-agreement/readiness transition;
- payment/expenditure is a legitimate Housing input, not physical output;
- deobligation, recapture, repayment, reallocation, hold, and expiry are distinct transitions;
- every amount has currency, scale, cohort, purpose, owner, effective/as-of time, and source/generated provenance.

## 13. HUD/HOME administrative configuration

HOME is `us.program.hud.home`, administered by HUD under its accepted statutory/regulatory sources. The program configuration contains formula/PJ eligibility, consolidated-plan, grant-agreement, written-agreement/commitment, eligible-use, match, IDIS setup/draw, compliance, completion, repayment/recapture, and active 2026 transition metadata only where frozen claims support them.

The July 2026 statute/regulation transition is a Day-0 legal state, not an invitation to choose whichever rule is convenient. Public Law 119-101 controls its amendments; unaffected current Part 92 provisions remain configured; indefinitely delayed amendments are marked non-operative; pre-amendment guidance is source-scoped. Ambiguous provisions may block an act or create legal risk but may not be invented into certainty.

### First post-enactment decision family

The first deep administrative family is a BABA nonavailability waiver request for a HOME-assisted project, grounded by the Stables example (`0228`, sources `0106–0107`). A complete decision instance has application/input identity, domestic-preference requirement, asserted waiver basis, supporting record, public-comment interval where required, responsible HUD office, decision date, scope, and operative terms.

The player may direct one of three supported intentions:

1. **grant a scoped waiver** — preserves access to the identified inputs and may reduce delay, but accepts the supported compliance exception and political/legal exposure;
2. **deny** — preserves domestic-preference enforcement, but may leave the project input-blocked and risk delay/halt/habitability/occupancy consequences;
3. **return for a bounded supplemental record** — avoids immediate grant/denial but consumes administrative time and can deepen material delay.

HUD resolves the act only if authority, record, and procedure permit it. The decision changes `inputAvailability` or `complianceHold` supplied to Housing; it never sets completion. The options have no universal best answer and meet the Architecture V0 post-enactment tradeoff requirement.

Program administration also exposes non-player autonomous transitions: receive plan/agreement, validate relationship, record commitment, set up activity, process eligible draw, receive reports, identify noncompliance, and apply the configured remedy route. Full rulemaking, staffing hierarchy, procurement, inspection regimes, and all grant programs are absent.

## 14. Intergovernmental/recipient configuration

The relationship owner stores federal institution/program, PJ/consortium identity, represented member relations where detailed, qualification interval, plan/agreement references, conditions, status, effective interval, existing-project duties, and owner-qualified records. It may transition through `PENDING`, `ACTIVE`, `EXCLUDED_FOR_NEW_FORMULA_RELATION`, `SUSPENDED`, or `ENDED_WITH_SURVIVING_DUTIES` only through configured events.

Arapahoe's consortium member inclusion/exclusion is the first federalism counterfactual. Changing a supported member election at requalification changes the new formula geography/relationship while preserving existing project and affordability duties and possible alternate lawful HOME routes. It does not mean a whole state “refused federal money.”

Corpus Christi is a local PJ route with plan, award, recipient expenditure, and project artifacts. Its downstream project selection is owned by the PJ/project route, not HUD's formula allocation. Recipient capacity, financing readiness, environmental release, written agreement, and input availability can each block progress.

The two detailed PJs are not a sample estimator and are not used to manufacture national rates. Other geographies can experience national policy and baseline Housing/public-response changes, but V0 HOME delivery effects occur only where a valid instantiated relationship/project route exists. Expansion to all PJs is a later content increment.

## 15. Geography

Geography owns shapes, identifiers, containment, vintage, and effective interval. Jurisdiction owns legal/political identity. Electoral boundaries reference Geography. Population and Housing reference Geography. None copies it.

The offline geography artifact MUST include:

- source product title/year/scale and retrieval locator;
- raw content hash and derived artifact hash;
- feature count and expected identifier set;
- state/DC FIPS and district GEOID;
- district→state containment by identifier, with geometry containment used only as validation;
- source and runtime coordinate systems;
- deterministic transform version and feature order;
- effective-period label `119th Congress / January 2025–January 2027`;
- explicit “not a legal land description” limitation.

The runtime may simplify geometry for performance only through a separately hashed deterministic derivative whose identifier/topology validation still yields 51 state/DC features and 435 district features. This contract does not design the map UI.

## 16. Population/electorate

`PopulationState` owns one unit for each state/DC, its resident weight, residence geography reference, and evolving political state. It does not own Housing stock, HOME records, ballot records, or published measurements.

Each unit's minimum political state is:

- accumulated material-exposure references and intensity by source/time;
- received information-exposure references and channel/time;
- belief distribution over bounded claims, including uncertainty;
- attribution distribution among configured political actors/institutions;
- issue salience;
- candidate preference state;
- turnout disposition.

Initial political values are deterministic neutral/uncertain scenario scaffolding (`APPROXIMATED / STATIC CONFIGURATION`): no incumbent approval, real party preference, turnout, or ideology is asserted. Material and information transitions can change them after Day 0. Final persuasion/turnout coefficients are P1 calibration; V0 implementation must nevertheless use a deterministic provisional parameter artifact so counterfactual direction is runnable and versioned.

The derived electorate reads only the election boundary, the legal eligibility proxy rule, canonical Population political state, and the election time. Actual participation and ballots are created once at the election boundary and owned by the election process. It may not read Housing success, approval, national popular totals, or a public claim directly as a winner switch.

Resident population is static in V0. Births, deaths, aging, domestic/international migration, and household formation do not run. This is an explicit bound, not an implication that future population never changes.

## 17. Housing material domain

Housing owns physical/material truth and its intrinsic association to the state/DC Population subject that experiences it. Reverse Population lookups are projections.

### 17.1 State/DC material state

Each state/DC record contains canonical `housingStockUnits`, `vacantUnits`, `affordabilityPressureIndex`, `productionPipeline`, and references to active projects. The pressure index is an `APPROXIMATED` normalized composite of vacancy scarcity and selected cost-burden measures; the exact V0 formula and provisional coefficients belong in a versioned calibration artifact, must be monotone in the documented directions, and must be replaceable without changing source data. It is never displayed as an official statistic.

### 17.2 Project state

Each assisted project contains geography, activity type, planned/expected units, current stage, physical progress, usable-unit contribution, recipient/developer capacity, financing readiness, relevant government-input references, input availability, compliance constraints, earliest transition time, and history.

Minimum stages are:

```text
PROPOSED
→ READY_FOR_COMMITMENT
→ FUNDED_NOT_STARTED
→ ACTIVE
→ PHYSICALLY_COMPLETE
→ USABLE

side paths: BLOCKED, DELAYED, FAILED, PRESERVATION_LOSS_AVOIDED
```

Administrative completion may reference `PHYSICALLY_COMPLETE` only after Housing emits it and all program requirements/final draw/report conditions separately resolve. The reverse is forbidden.

### 17.3 Accepted government inputs and Housing resolution

Housing accepts, but does not automatically obey, validated inputs: legal eligible-use reference, program relationship, PJ commitment, available fiscal payment/expenditure, environmental/compliance clearance, waiver terms, capacity support, and enforcement hold. Housing itself resolves whether work starts, progress rate, delay, failure, physical completion, usability, stock contribution or preservation, vacancy consequence, and pressure trajectory.

Changing capacity or input availability MUST be able to change timing/completion. Completion may have small, delayed, or offset regional affordability effects because project scale, preservation versus net addition, financing, inputs, capacity, and demand differ. Projects may remain active beyond January 20, 2029.

V0 does not contain a complete mortgage market, zoning system, parcel/land market, construction industry, developer market, household market, or macroeconomy. Their absence must appear as limits on claims and calibration, not hidden zero constraints.

## 18. Information/player knowledge/public claims

The following objects are never aliases:

```text
canonical Housing/Population/fiscal state
≠ measurement observation/capture
≠ IDIS/program record
≠ released official artifact
≠ political public claim
≠ channel distribution
≠ recipient exposure
≠ belief/attribution
```

### 18.1 Bounded information routes

1. **HOME administrative route:** PJ activity/commitment/draw/completion-related records → IDIS capture → dated HUD report/artifact. It measures program state, not regional material truth.
2. **Housing statistical route:** canonical Housing evolves → a configured observation window samples/captures selected measures → processing/release lag → ACS-like or BPS-like dated artifact → possible revision. Day-0 artifacts use real vintages; future artifacts are simulation-generated measurements carrying the same universe/method semantics.
3. **Court route:** filing/ruling/order → CM/ECF-style receipt notice to registered participants → administration knowledge → separate compliance decision.
4. **Public-claim route:** an authorized institution/actor selects available artifacts and frames a claim → HUD newsroom/opt-in list or bounded official channel → recorded availability/delivery/exposure → possible Population belief processing.

### 18.2 Exact and imperfect administration knowledge

The controlled administration knows exactly only its decisions, validly shared internal HUD program records, received legal notices/orders, enacted/published legal sources, and artifacts whose access rules include it. It sees physical Housing only through inspections, recipient reports, program records, and released statistical artifacts, each with as-of and confidence limits. It does not know latent project completion, population belief, unopened communications, future election votes, or debug truth.

Public availability creates no universal exposure. Opt-in delivery creates no open/read fact. Exposure creates no belief. Belief creates no persuasion guarantee. The nine-participant Corpus plan event is retained as a bounded historical exposure example only; it does not initialize national belief.

Competing official claims may cite the same artifact differently. A claim stores author, text/position token, cited artifacts, release time, channel, and scope. It cannot alter the cited record or material state.

## 19. Presidential election/succession

The configured ordinary 2028 sequence is:

1. **2028-11-07:** state/DC popular voting resolves from election-time electorate snapshots; election-night projections are optional noncanonical artifacts.
2. State-specific canvass detail is compressed into a bounded state result/certification transition. Popular result, certificate of ascertainment, and elector appointment remain separate.
3. **No later than 2028-12-13:** state executive ascertainment deadline relative to the configured elector meeting; the exact earlier state deadlines are deferred.
4. **2028-12-19:** appointed elector slates meet in their jurisdictions and produce separate presidential/vice-presidential vote certificates.
5. **2029-01-06 13:00 America/New_York:** Congress opens, verifies, counts, and declares under the bounded ordinary route. Objections and contingent election are reserved but deferred unless an acceptance test injects a supported objection fixture.
6. The declaration creates successor entitlement; it does not yet change the office assignment.
7. **2029-01-20 12:00 America/New_York:** outgoing assignments end, successor assignments begin, and `ControlBinding` terminates/transfers as specified in Section 11.

The electoral allocation denominator and majority must be computed from appointed/countable elector records even though the ordinary snapshot validates to 538/270. A national popular-vote plurality is not an office assignment.

Succession MUST preserve laws, appropriations and fiscal records, HOME relationships, program records, projects and physical progress, Housing state, Population state, measurements, public claims, court contests/orders, history, causal-random streams, scheduled transitions, and provenance. Access may change with institutional/office assignment; history never rewrites.

## 20. Judiciary/legal-contest route

The single route begins only if simulation produces a **final written HUD determination rejecting Arapahoe County's consortium requalification before award and directing the associated formula amount out of that relationship**. This is a bounded hypothetical, not a claim that the real event occurred.

The route preserves:

```text
HUD final action + claimant-specific injury
→ County filing in U.S. District Court for the District of Colorado
→ contest admission/reviewability/standing determination
→ request for plaintiff-specific §705/Rule 65 relief
→ ruling and reasons
→ separately authored operative order, if granted
→ electronic receipt/notice
→ HUD/DOJ response and administrative compliance/noncompliance
→ optional appeal to Tenth Circuit
→ separately resolved stay request (ordinarily district court first)
→ later merits/relationship/fiscal/material consequences through their owners
```

The sought V0 relief is prospective nonmoney relief: preserve the amount, prevent rejection/reallocation, and require lawful reconsideration. An executed-grant payment-enforcement demand and its Court of Federal Claims boundary are outside this route. Standing, finality, merits, Rule 65 factors, exact order scope, appeal, and stay are resolved facts, not automatic consequences of filing.

A ruling's reasoning does not itself command HUD. An operative order targets specified subjects/conduct, has issue/effective/status times, and may be stayed, modified, or vacated. Receipt does not equal compliance. Court state submits constraints/notices; it never edits fiscal balances, HOME relationship state, or Housing progress directly.

## 21. Time/persistence

Time uses a real calendar and typed transition classes:

- **fixed constitutional/statutory dates:** terms, election/count/transfer dates;
- **legal deadlines:** presentment, ascertainment, grant/project requirements;
- **administrative cycles:** fiscal-year, apportionment, plan/agreement, reporting, waiver comment/review;
- **data-release cycles:** observation period, processing, release, revision;
- **event-driven transitions:** filing, order receipt, commitment, draw, project block;
- **variable material latency:** project progress/completion/affordability response.

The player may advance to the next decision or use larger calendar increments. Skipped intervals still process every canonical transition in stable causal order. Fixed legal time is not shortened to make outcomes convenient; presentation may compress waiting. Projects are not forced to complete within the current administration.

Same timestamp processing uses explicit dependency phase and stable tie-break keys, not container iteration order. Save files include configuration/artifact versions and hashes, world state, history, pending transitions, causal-random state/keys, and access/binding state. Loading a save never reacquires Day-0 web data.

## 22. Player-facing capability table

| Player situation | Available decision | Canonical actor/institution | What the player is NOT controlling | Downstream systems affected | Likely information available | Possible failure/delay/opposition | Why this is gameplay |
|---|---|---|---|---|---|---|---|
| Advance Housing legislation | Choose agenda terms and seek a Member sponsor | Administration; sponsoring PoliticalActor | Introduction, chamber agenda, or votes | Legislature, prospective legal/fiscal route | Actor conditions, uncertain support, source-backed procedure | No sponsor, gate failure, adverse amendment, failed vote | Converts priorities into a coalition problem |
| Negotiate/changing terms | Offer changes to amount, flexibility, compliance, distribution, capacity support | Administration and autonomous legislators | Actor acceptance or final vote | Proposal text, commitments, both chamber coalitions | Current proposal version, stated/estimated reservations | Support shifts differently by chamber; identical text breaks | Tradeoffs change legal content and coalition, not a hidden score |
| Presentment | Sign, veto, or supported no-signature posture | President officeholder through binding | Congressional override votes or legal clock | LegalSource, PublicFinance eligibility, history | Identical enrolled text, vote records, fiscal/legal analysis | Veto override, pocket-veto condition, political cost | Executive authority is consequential but bounded |
| Post-enactment HUD implementation | Direct grant, deny, or return a scoped BABA waiver request | HUD through controlled administration surface | Legal sufficiency, inputs, or project completion | Program compliance, Housing input availability, time, claims | Waiver record, supply findings, project reports; not latent outcome | Judicial challenge, compliance criticism, delay/halt, record insufficiency | Compliance and delivery speed are genuinely competing risks |
| State/local variation | Support/contest a relationship posture or prioritize lawful capacity attention | Administration/HUD; PJ/consortium relationship owner | PJ inclusion/exclusion, project selection, local capacity | Relationship, fiscal route, project geography, latency | Plans, agreements, known capacity/report artifacts | Member exclusion, weak delivery, alternate route, surviving duties | Federalism changes where and how policy lands |
| Public claim/communication | Issue, qualify, delay, or decline a claim citing available artifacts | Administration/HUD communication source | Channel receipt, belief, attribution, material truth | Information artifacts, exposures, public response | Released/internal-authorized artifacts with dates and limits | Low reach, counterclaim, later revision, credibility loss | Player manages truthful uncertainty and political interpretation |
| Adverse measurement | Acknowledge, contest method/scope, adjust implementation, or wait for revision | Administration; HUD/Census artifacts remain independent | Measurement result or revision | Claims, administration choice, belief; not past Housing | Measure universe, MOE, vintage, known program records | Stale data, real underperformance, counterclaim, overreaction | Governing under imperfect evidence creates strategic ambiguity |
| Court intervention | Comply/reconsider, seek stay/appeal, or risk bounded noncompliance | Administration/HUD/DOJ | Judge, ruling, order terms, appellate result | Legal contest, administration, relationship, time, later material route | Filing, reasons, operative order, receipt, counsel assessment | No stay, narrower authority, delay, sanctions/political cost | Law constrains action without becoming a scripted loss screen |
| Presidential election | Campaign communication choices only through bounded claims; then await autonomous resolution | Candidates/election institutions/Population | Belief, turnout, ballots, certification, electors | Election artifacts, entitlement, assignment | Released reports/claims and uncertain projections; no debug electorate | Popular/electoral divergence, state losses, delayed artifacts | Prior governing choices return through geography and information |
| Succession consequence | If entitled, form successor administration; otherwise relinquish binding | OfficeAssignment/ControlBinding | Erasing inherited laws/projects or retaining authority after term | All access/control; world state persists | Transition and inherited institutional records | Loss of control; inherited constraints; projects continue | Elections change who governs the same world |

## 23. Data acquisition/versioning/hashing contract

Runtime MUST have no dependency on live Census, HUD, NARA, OMB, USAspending, local-government, or court websites. Every real-data family follows:

```text
official frozen source/product
→ bounded acquisition outside runtime
→ raw immutable artifact
→ deterministic extraction/transformation
→ validation and methodology record
→ version/vintage + SHA-256 manifest
→ versioned offline configuration artifact
→ deterministic scenario initialization
→ simulation-owned future
```

### 23.1 Required manifest per artifact

Each artifact manifest entry MUST record:

- logical artifact ID and schema version;
- frozen claim IDs and source IDs;
- stable source locator and issuing body;
- product/table/file name, vintage, observation/as-of/effective dates, retrieval timestamp, and source authority/status limits;
- raw byte SHA-256, byte length, media type, and retained filename;
- exact selected geography and fields/variables;
- universe, estimate/MOE/status semantics, missing-value treatment, units/currency/scale;
- transformation tool/version, ordered steps, parameters, and code revision;
- derived byte SHA-256, row/feature counts, identifier domain, and validation results;
- mapping type and state class from Section 1;
- citation, reuse, disclaimer, and trademark requirements;
- known omissions and the runtime owner/consumer.

The freeze-retrieval hashes already recorded in `US_RESEARCH_FREEZE_REVALIDATION_V0.md` MUST be retained when exact frozen bytes are used. A later acquisition of an accepted dynamic endpoint receives a new raw hash and must match the contract's exact product/vintage/as-of scope; it does not silently choose a newer vintage.

### 23.2 Deterministic transformation rules

- Parse by documented identifiers, never display-name joins.
- Sort outputs by stable canonical ID before serialization.
- Preserve source integers and published precision; derived ratios use a documented decimal policy and retain numerator/denominator.
- Preserve missing/suppressed/not-applicable separately from zero.
- Retain ACS estimate and MOE fields together and label their universe/period.
- Validate 50 states + DC, 435 district identifiers, 435 apportioned House seats, 100 Senate offices, 538 electors, and 51 population units.
- Validate Population conservation and every foreign-key/reference closure.
- Reject duplicate GEOIDs, unknown geography, amount without owner/cohort, or project status inferred from an administrative label.
- Produce canonical serialized bytes so the same raw inputs and transform version yield the same derived hash.

### 23.3 Simulation ownership after start

At scenario start the seed loader creates canonical world state and records the seed artifact hashes. Thereafter:

- a new official download cannot overwrite alternate-history Population, Housing, program, fiscal, election, or information state;
- future simulated releases observe/capture the simulated world through configured methods;
- a source correction requires a new scenario/configuration version or an explicit migration, never a background refresh;
- save/load uses the exact original artifact versions or fails with a clear compatibility error;
- developer fixtures may be smaller but must be labeled synthetic and cannot ship as the U.S. Day-0 artifact.

## 24. Synthetic second-configuration proof

The accepted GL0 synthetic government at `ffc34c0…` remains the adversarial second configuration. I1 will move its fixture content behind the production configuration boundary without redesigning its causal content.

| Structural dimension | U.S. V0 configuration | Retained synthetic configuration | Hard-coding exposed |
|---|---|---|---|
| Legislature | two chambers; 435 + 100 offices; chamber-specific procedures | one chamber; 11 causally discrete seats | assumptions of two chambers or U.S. counts |
| Subnational topology | 50 states + role-specific DC; two detailed local/PJ routes | three synthetic state jurisdictions | assumptions of 50/51, DC, or U.S. recipient types |
| Executive selection | state/DC popular results → allocated electors → count → Jan. 20 transfer | direct weighted synthetic executive contest across three regions, day-60 result/day-61 certification | Electoral College or constitutional-calendar assumptions |
| Legislative thresholds | configured quorum/ordinary votes; conditional 3/5 cloture; 2/3 override | configured simple majority of 11 (six in full fixture) | 218, 51, 60, or 2/3-U.S.-route constants |
| Program topology | HUD/HOME formula, plan, agreement, recipient commitment/draw | synthetic application/accept-or-refuse/award grant route | HUD/HOME-specific program state in engine |
| Geography/population | official GEOIDs, 51 weighted aggregates, 435 districts | three synthetic regions/population aggregates | assumptions of FIPS/GEOID or real population fields |
| Time | Gregorian/legal dates through 2029 with variable project latency | synthetic day-number schedule | assumptions that every configuration uses U.S. dates |

Both configurations MUST be loaded through the same generic configuration interface, scheduler, ownership boundaries, save/load mechanism, and causal transition dispatcher. Configuration selection occurs at composition/bootstrap only. Generic code searches for `USA`, `US_`, `HUD`, `HOME`, `HOUSE`, `SENATE`, `ELECTORAL_COLLEGE`, `435`, fixture IDs, or content-path imports must return no U.S.-specific execution dependency. Names appearing in generic comments/tests solely to assert absence are allowed; runtime conditionals are not.

## 25. Anti-fake implementation acceptance criteria

These criteria bind later implementation; they do not claim implementation now.

1. **Same engine / two governments.** One test matrix boots `us-v0-2026-08-22` and the retained synthetic configuration through the same loader/runner. It proves the structural differences in Section 24 and saves/loads each.
2. **Counterfactual legislation.** With identical initial world/action history except at least one actor support/commitment input, a bill passes in one run and fails in another. The failed run has no enacted-law record and no bill-derived authority, program, or Housing input.
3. **Counterfactual administration.** From the same valid waiver request, grant versus deny/return produces different compliance/input-availability and project-time paths without directly setting completion.
4. **Counterfactual federalism.** A supported Arapahoe member inclusion versus exclusion transition changes the new consortium formula geography/relationship and downstream eligible path while preserving existing duties.
5. **Counterfactual Housing.** Holding government records constant while changing project capacity or input availability changes progress/completion/stock/pressure trajectory. `moneySpent = housesBuilt` is impossible by type/transition.
6. **Counterfactual information.** Holding canonical Housing constant while changing capture/release/exposure changes administration/public knowledge or response but not material truth; changing material truth without a release need not immediately change belief.
7. **Counterfactual election.** Holding allocation rules constant while changing election-time Population preference/turnout state in one or more geographies can change state results, electoral count, and winner; national popular plurality is not a direct winner input.
8. **Succession persistence.** At January 20, assignments/binding change and at least one project, fiscal record, law, report, and pending transition retain identity/history and continue afterward.
9. **Save/load.** Same configuration hashes + same canonical state + same causal actions/keys yields the same future under direct advance and advance/save/load/advance, including same-time events.
10. **No U.S. special cases.** Static analysis and import-boundary tests find U.S.-specific identifiers/content only in U.S. configuration/content, acquisition, or configuration tests—not generic simulation modules.
11. **Data authenticity.** Shipped U.S. artifact manifests validate the counts/hashes/vintages in Sections 5–6; no 51 equal weights, three-region substitution, fictional district nesting, or fabricated missing zero is accepted.
12. **Knowledge boundary.** A player projection cannot query latent Housing, Population belief, future ballots, or developer/audit views without a legitimate artifact/access path.
13. **Content-use audit.** Every ingested field has a named canonical initializer, simulation consumer, derived validation, or player-visible purpose in Sections 5–7. Unused fields fail the build.

## 26. Explicit simplifications

| ID | Simplification | Classification | Why acceptable now | Preserved causal truth |
|---|---|---|---|---|
| `US-SIMP-001` | Anonymous synthetic officeholders and behavior profiles | APPROXIMATED | Current roster/party/behavior calibration is outside frozen P0 | Offices, assignments, individual autonomous votes, chamber differences |
| `US-SIMP-002` | One consideration gate and one amendment round per chamber; max two text exchanges | AGGREGATED | Full parliamentary breadth is not needed for first causal route | sponsorship, blockage, amendment, separate votes, identical text |
| `US-SIMP-003` | No committee institutions or complete leadership hierarchy | DEFERRED | Evidence supports compression and non-universal bypass | agenda access can fail without pretending committee approval universal |
| `US-SIMP-004` | 119th district geometry remains static after its real effective period | APPROXIMATED | No redistricting engine/later frozen product in V0 | 435 real district identities/nesting remain explicit and vintage-labeled |
| `US-SIMP-005` | Congressional assignment rollover is synthetic and state-level | APPROXIMATED | Presidential route is first election; no district electorate exists | terms can change actors without resetting chambers/world |
| `US-SIMP-006` | State/DC Population units only | AGGREGATED | Exact state distribution is enough for national first route | represented weight, residence/material/information correlation, geography |
| `US-SIMP-007` | CVAP share projected onto Vintage-2025 residents | APPROXIMATED | Accepted bounded proxy avoids resident=eligible | eligibility proxy remains distinct from turnout, votes, certification |
| `US-SIMP-008` | Maine/Nebraska district allocation units use statewide result distribution | APPROXIMATED | No supported 119th district electorate projection | district-plus-at-large structure/count remains; inability to split is explicit |
| `US-SIMP-009` | State certification is one bounded transition | AGGREGATED | Fifty procedures are not needed for federal interface | popular result, ascertainment, elector vote, count remain distinct |
| `US-SIMP-010` | Two detailed real HOME recipient/project routes | AGGREGATED bound | Enough for causal and federalism truth without fake municipalities | formula/PJ/consortium/project plurality and stage ownership |
| `US-SIMP-011` | ACS estimates seed latent Housing truth | APPROXIMATED | No direct census of instantaneous material state exists in freeze | source vintage/MOE retained; future truth and artifacts diverge |
| `US-SIMP-012` | Ordinal capacity/constraints and provisional coefficients | APPROXIMATED | P1 has no accepted magnitude calibration | real direction, latency, mixed outcome, and counterfactual causal seams |
| `US-SIMP-013` | Elector slates aggregated by allocation unit | AGGREGATED | Individual elector biographies/behavior not required | appointment, votes, certificates, count, entitlement remain separate |
| `US-SIMP-014` | One court claim/forum/appellate route | AGGREGATED bound | Whole judiciary is unnecessary | filing, ruling, order, notice, compliance, appeal/stay ownership |
| `US-SIMP-015` | Official channels only; no media market | DEFERRED | Bounded artifact/exposure route proves information causality | truth, measurement, claim, exposure, belief stay separate |

No simplification creates a second canonical owner, a direct outcome setter, or an engine concept named for U.S. content.

## 27. P1/P2/deferred register

### 27.1 P1 calibration/content after the first runnable vertical

- empirically defensible legislative behavior, negotiation, commitment, and coalition calibration;
- public belief, attribution, salience, preference, and turnout coefficients;
- Housing project delay/capacity/failure distributions and affordability-response magnitudes;
- information reach, revision, credibility, and persuasion magnitudes;
- broader, current HOME recipient and activity extracts if a separately authorized content acquisition accepts them;
- current real politician/party/roster content only under a narrow transient-data authority;
- district Population/CVAP and a non-compressed Maine/Nebraska result route;
- detailed congressional election/assignment resolution and later district vintages.

P1 values may replace provisional approximations but may not collapse owners or overwrite an ongoing save without an explicit migration.

### 27.2 P2 enrichment

- detailed committees, leadership, cloture/consent/reconciliation and appropriations variants;
- additional HUD programs, recipients, consortia, projects, inspections, enforcement, and transaction depth;
- richer state/local institutions and court forums;
- additional measurements, revisions, communications channels, and political actors;
- individual elector/state-law content and election disputes;
- additional Housing finance and supply mechanisms where a causal consumer exists.

### 27.3 Explicitly deferred from V0

- births, deaths, aging, interstate migration, international migration, immigration/emigration, and complete household formation;
- full state governments, all municipalities, counties, zoning authorities, and parcel governance;
- current politician biographies, real partisan composition, complete lobbying, campaign finance, primaries, and a full media ecosystem;
- complete courts, federal bureaucracy, grant portfolio, and federal budget/accounting system;
- complete mortgages, land/parcel markets, construction industry, developer market, and macroeconomy;
- healthcare, immigration policy, infrastructure, labor, education, energy, climate, defense, and foreign affairs;
- individual ordinary residents or one object per person;
- full congressional/redistricting simulation;
- runtime live-data refresh;
- production UI, presentation design, art, polish, and playtest tuning.

Deferred means absent before the first real U.S. governing vertical is playable, not prohibited forever. A deferred datum must not appear as an invented value.

## 28. Direct configuration gaps, if any

**NONE.**

All 26 seams are `READY` or `READY_WITH_BOUNDS` in the frozen authority, and every required first-vertical decision has a direct, aggregated, approximated, or deferred treatment above. Behavior coefficients and content breadth are bounded P1/P2 work, not facts whose absence blocks the V0 contract. No `CONFIG-GAP-###` is opened.

## 29. Implementation handoff

This ordering is dependency-driven. Each increment must be runnable and must add a player capability or prove reusable engine capability; otherwise it is not an increment.

| Increment | Scope and dependency | New capability/proof | Runnable anti-fake proof |
|---|---|---|---|
| **I1 — production configuration boundary + second-government proof** | Define generic manifest/loader/validation/artifact interfaces; move accepted synthetic fixture content behind them without content redesign | Reusable engine boots named configurations | Same test runner boots one-chamber/11-seat/3-state synthetic and skeletal two-chamber U.S.; no configuration-ID conditional; save headers carry config hash |
| **I2 — U.S. government topology** | Load U.S./state/DC jurisdictions, institutions, offices, assignments, bounded courts/HUD and role-qualified relations | Reusable arbitrary topology; inspect recognizable U.S. government | Counts/references validate 52 primary jurisdictions, 435 House, 100 Senate, distinct office/actor/assignment; synthetic still boots |
| **I3 — U.S. legislature/procedure** | Add two configured chambers, anonymous actor profiles, sponsorship, gates, amendments, votes, identical text, presentment/veto/override | Player can advance/support/negotiate/sign or veto legislation | Support change flips result; failed bill creates no law/authority; House/Senate coalitions differ; synthetic one-chamber path unchanged |
| **I4 — U.S. geography + Day-0 population/electoral data** | Build offline artifacts, loaders, validations, 51 Population units, 435 district map, CVAP projection, 538 allocation | Reusable versioned real-data initialization; real national weighting | Hash/count/conservation tests; unequal state weights; no district population fabrication; offline boot with network disabled |
| **I5 — presidential election/succession** | State/DC result units, elector appointment/votes/certificates/count, entitlement, Jan. 20 assignment/binding | Player can reach a recognizable presidential result and persistent transfer | Political-state change can flip electoral winner; result≠certification≠transfer; laws/history/population persist |
| **I6 — public finance + HUD/HOME + federalism** | Typed authority/apportionment/obligation/outlay/commitment/draw stages; two detailed relationships; BABA decision | Player can implement after passage and face recipient/compliance tradeoffs | Grant/deny waiver diverges; Arapahoe inclusion/exclusion diverges; no same-dollar or payment=project shortcut |
| **I7 — Housing material route** | Load ACS/BPS state seeds and Stables/Palms; implement project constraints, latency, completion, stock/vacancy/pressure | Player can observe delayed and mixed material consequences | Capacity/input counterfactual changes completion/trajectory; administrative completion cannot set Housing; projects cross term boundary |
| **I8 — measurement/information/public response** | IDIS/statistical capture/release/revision, claims/channels/exposure, 51-unit belief/attribution/salience/preference/turnout | Player can communicate and respond to adverse or stale evidence | Release/exposure change political state without changing Housing; material success can precede report; player view cannot read debug truth |
| **I9 — bounded court route** | Arapahoe rejection, D. Colo. filing, order, notice, compliance, Tenth Circuit/stay | Player can respond to concrete judicial intervention | Filing need not yield relief; order receipt does not equal compliance; court never directly edits fiscal/Housing state |
| **I10 — complete persistent U.S. causal vertical** | Compose I1–I9 through 2029; deterministic time, save/load, hostile branches | Full governing loop from agenda through succession in same world | Entire Section-25 matrix, direct-vs-save/load equivalence, same-time ordering, post-succession project continuation |
| **I11 — player-facing UI/polish/playtest** | After causal acceptance only, build player projections and presentation against legitimate knowledge | Playable legibility and pacing; no new canonical owners | UI cannot invoke truth-only queries; causal explanation traces sources/owners; playtest finds no zero-information or dominant required choice |

Acquisition scripts and artifacts belong inside the increment that first consumes them; they are not a disconnected “data platform” increment. I11 is explicitly outside this contract's authorized work.

### Handoff invariants

The implementer MUST begin from this accepted contract's exact future SHA, preserve the authority SHAs in the manifest, and treat every `APPROXIMATED` value as visibly provisional/versioned. No increment may make a larger subsystem complete by skipping the next causal owner. No U.S.-specific identifier may migrate into a generic simulation module for convenience.

## 30. Boundary attestation

This Step-4 candidate:

- uses frozen evidence authority `c0f02ae817001262204ea1272ea93d78ce48a877` unchanged;
- uses accepted Architecture V0 `54afd51c6ae894df5c3680cf15df472cdcb125b2` unchanged;
- references accepted synthetic runtime `ffc34c0cce1089ff1eeca671243cab7a2e968c43` without modifying or redesigning it;
- maps all 26 required seams to exact U.S. configuration decisions and frozen claim/source identifiers;
- selects the Day-0 data products, vintages, variables, geographic resolutions, transformations, owners, dynamic boundaries, hashes, and omissions required for the first recognizable world;
- conducts no broad or narrow new research and opens no direct configuration gap;
- modifies no research, architecture, runtime, test, Electron, or UI file;
- implements no code, data acquisition, calibration, UI, or game content artifact;
- does not merge, accept, audit, or self-approve this candidate.

The next authorized stage is one adversarial review of the exact candidate commit. Implementation is not authorized by authorship of this document.
