import type {
  ActorIdentityDescriptor,
  GovernmentStructureDescriptor,
  InstitutionDescriptor,
  OfficeAssignmentDescriptor,
  OfficeDescriptor,
  ScaffoldClassification,
  TopologyProvenanceArtifactDescriptor,
  TopologyRelationDescriptor,
} from "../../configuration/types";
import districtArtifact from "./artifacts/house-district-identities-119.json";
import senateArtifact from "./artifacts/senate-seat-classes.json";
import stateArtifact from "./artifacts/state-identifiers.json";

interface StateIdentityRecord {
  readonly stateFips: string;
  readonly stateUsps: string;
  readonly officialName: string;
  readonly gnisId: string;
}

interface DistrictIdentityRecord {
  readonly stateFips: string;
  readonly districtCode: string;
  readonly geoid: string;
  readonly stateJurisdictionId: string;
}

interface SenateSeatClassRecord {
  readonly stateFips: string;
  readonly stateUsps: string;
  readonly classLabel: "I" | "II" | "III";
  readonly ordinaryBoundaryAt: string;
}

const STATE_ARTIFACT_ID = "us.topology.state-identifiers-v1";
const DISTRICT_ARTIFACT_ID = "us.topology.house-district-identities-119-v1";
const SENATE_ARTIFACT_ID = "us.topology.senate-seat-classes-v1";

export const US_NATIONAL_JURISDICTION_ID = "us.jurisdiction.national";
export const US_CONGRESS_INSTITUTION_ID = "us.institution.congress";
export const US_HOUSE_INSTITUTION_ID = "us.institution.house";
export const US_SENATE_INSTITUTION_ID = "us.institution.senate";
export const US_CONGRESS_LEGISLATURE_ID = "us.legislature.congress";
export const US_HOUSE_CHAMBER_ID = "us.chamber.house";
export const US_SENATE_CHAMBER_ID = "us.chamber.senate";
export const US_EXECUTIVE_INSTITUTION_ID = "us.institution.executive-office";
export const US_PRESIDENT_OFFICE_ID = "us.office.president";
export const US_VICE_PRESIDENT_OFFICE_ID = "us.office.vice-president";
export const US_INCUMBENT_PRESIDENT_ACTOR_ID = "us.actor.executive.incumbent-president-scaffold";
export const US_INCUMBENT_VICE_PRESIDENT_ACTOR_ID =
  "us.actor.executive.incumbent-vice-president-scaffold";
export const US_INCUMBENT_ADMINISTRATION_ID = "us.administration.incumbent-2026";
export const US_HUD_INSTITUTION_ID = "us.institution.hud";
export const US_DISTRICT_COLORADO_COURT_ID = "us.institution.court.d-colorado";
export const US_TENTH_CIRCUIT_COURT_ID = "us.institution.court.tenth-circuit";

const SCAFFOLD_CLASSIFICATION: ScaffoldClassification =
  "APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD";
const SCENARIO_START = "2026-08-22T00:00:00-04:00";
const HOUSE_BOUNDARY = "2027-01-03T12:00:00-05:00";
const EXECUTIVE_BOUNDARY = "2029-01-20T12:00:00-05:00";

const states = stateArtifact.records as readonly StateIdentityRecord[];
const districts = districtArtifact.districts as readonly DistrictIdentityRecord[];
const senateSeats = senateArtifact.records as readonly SenateSeatClassRecord[];
const stateByFips = new Map(states.map((state) => [state.stateFips, state]));

const provenanceArtifacts: readonly TopologyProvenanceArtifactDescriptor[] = [
  stateArtifact.metadata,
  districtArtifact.metadata,
  senateArtifact.metadata,
].map((metadata) => ({
  id: metadata.artifactId,
  vintage: metadata.vintage,
  transformationVersion: metadata.transformationVersion,
  contentSha256: metadata.contentSha256,
  sources: metadata.sources,
}));

const jurisdictions: GovernmentStructureDescriptor["jurisdictions"] = [
  {
    id: US_NATIONAL_JURISDICTION_ID,
    label: "United States",
    kind: "NATIONAL",
    externalIdentifiers: [{ scheme: "ISO_3166_1_ALPHA_2", value: "US" }],
    provenanceArtifactId: null,
  },
  ...states.map((state) => ({
    id:
      state.stateUsps === "DC"
        ? `us.jurisdiction.dc.${state.stateFips}`
        : `us.jurisdiction.state.${state.stateFips}`,
    label: state.officialName,
    kind: state.stateUsps === "DC" ? ("FEDERAL_DISTRICT" as const) : ("CONSTITUENT_POLITY" as const),
    externalIdentifiers: [
      { scheme: "CENSUS_STATEFP", value: state.stateFips },
      { scheme: "USPS", value: state.stateUsps },
      { scheme: "GNIS", value: state.gnisId },
    ],
    provenanceArtifactId: STATE_ARTIFACT_ID,
  })),
];

const institutions: readonly InstitutionDescriptor[] = [
  { id: US_CONGRESS_INSTITUTION_ID, label: "Congress", kind: "LEGISLATURE", jurisdictionId: US_NATIONAL_JURISDICTION_ID },
  { id: US_HOUSE_INSTITUTION_ID, label: "House", kind: "LEGISLATIVE_CHAMBER", jurisdictionId: US_NATIONAL_JURISDICTION_ID },
  { id: US_SENATE_INSTITUTION_ID, label: "Senate", kind: "LEGISLATIVE_CHAMBER", jurisdictionId: US_NATIONAL_JURISDICTION_ID },
  { id: US_EXECUTIVE_INSTITUTION_ID, label: "Executive Office", kind: "EXECUTIVE", jurisdictionId: US_NATIONAL_JURISDICTION_ID },
  { id: US_HUD_INSTITUTION_ID, label: "Department of Housing and Urban Development", kind: "ADMINISTRATIVE_AGENCY", jurisdictionId: US_NATIONAL_JURISDICTION_ID },
  { id: "us.institution.omb", label: "Office of Management and Budget", kind: "FISCAL_CONTROL", jurisdictionId: US_NATIONAL_JURISDICTION_ID },
  { id: "us.institution.census", label: "Census Bureau", kind: "STATISTICAL_AGENCY", jurisdictionId: US_NATIONAL_JURISDICTION_ID },
  { id: "us.institution.nara", label: "National Archives and Records Administration", kind: "ARCHIVAL_AGENCY", jurisdictionId: US_NATIONAL_JURISDICTION_ID },
  { id: "us.institution.doj", label: "Department of Justice", kind: "LEGAL_SERVICE", jurisdictionId: US_NATIONAL_JURISDICTION_ID },
  { id: US_DISTRICT_COLORADO_COURT_ID, label: "U.S. District Court for the District of Colorado", kind: "COURT", jurisdictionId: US_NATIONAL_JURISDICTION_ID },
  { id: US_TENTH_CIRCUIT_COURT_ID, label: "U.S. Court of Appeals for the Tenth Circuit", kind: "COURT", jurisdictionId: US_NATIONAL_JURISDICTION_ID },
];

const geographies: GovernmentStructureDescriptor["geographies"] = districts.map((district) => {
  const state = stateByFips.get(district.stateFips);
  if (state === undefined) throw new Error(`Missing state identity for district ${district.geoid}.`);
  const districtLabel = district.districtCode === "00" ? "At Large" : district.districtCode;
  return {
    id: `us.geography.cd119.${district.geoid}`,
    label: `${state.officialName} Congressional District ${districtLabel} (119th identity)`,
    kind: "LEGISLATIVE_CONSTITUENCY",
    parentJurisdictionId: district.stateJurisdictionId,
    externalIdentifiers: [
      { scheme: "CENSUS_STATEFP", value: district.stateFips },
      { scheme: "CENSUS_CD119FP", value: district.districtCode },
      { scheme: "CENSUS_GEOID", value: district.geoid },
      { scheme: "CONGRESSIONAL_SESSION", value: "119" },
    ],
    geometryStatus: "IDENTITY_ONLY",
    provenanceArtifactId: DISTRICT_ARTIFACT_ID,
  };
});

const houseOffices: readonly OfficeDescriptor[] = districts.map((district) => {
  const state = stateByFips.get(district.stateFips);
  if (state === undefined) throw new Error(`Missing state identity for House office ${district.geoid}.`);
  const districtLabel = district.districtCode === "00" ? "At Large" : district.districtCode;
  return {
    id: `us.office.house.${district.geoid}`,
    label: `Representative office for ${state.officialName} District ${districtLabel}`,
    kind: "LEGISLATIVE_MEMBER",
    institutionId: US_HOUSE_INSTITUTION_ID,
    chamberId: US_HOUSE_CHAMBER_ID,
    constituency: { kind: "GEOGRAPHY", id: `us.geography.cd119.${district.geoid}` },
    term: { duration: { value: 2, unit: "YEARS" }, ordinaryBoundaryAt: HOUSE_BOUNDARY, staggerGroupId: null },
  };
});

const senateOffices: readonly OfficeDescriptor[] = senateSeats.map((seat) => {
  const state = stateByFips.get(seat.stateFips);
  if (state === undefined) throw new Error(`Missing state identity for Senate office ${seat.stateFips}.`);
  const suffix = seat.classLabel.toLowerCase();
  return {
    id: `us.office.senate.${seat.stateFips}.class-${suffix}`,
    label: `Senator office Class ${seat.classLabel} for ${state.officialName}`,
    kind: "LEGISLATIVE_MEMBER",
    institutionId: US_SENATE_INSTITUTION_ID,
    chamberId: US_SENATE_CHAMBER_ID,
    constituency: { kind: "JURISDICTION", id: `us.jurisdiction.state.${seat.stateFips}` },
    term: {
      duration: { value: 6, unit: "YEARS" },
      ordinaryBoundaryAt: seat.ordinaryBoundaryAt,
      staggerGroupId: `us.stagger.senate.class-${suffix}`,
    },
  };
});

const executiveOffices: readonly OfficeDescriptor[] = [
  {
    id: US_PRESIDENT_OFFICE_ID,
    label: "President",
    kind: "EXECUTIVE_HEAD",
    institutionId: US_EXECUTIVE_INSTITUTION_ID,
    chamberId: null,
    constituency: { kind: "JURISDICTION", id: US_NATIONAL_JURISDICTION_ID },
    term: { duration: { value: 4, unit: "YEARS" }, ordinaryBoundaryAt: EXECUTIVE_BOUNDARY, staggerGroupId: null },
  },
  {
    id: US_VICE_PRESIDENT_OFFICE_ID,
    label: "Vice President",
    kind: "EXECUTIVE_DEPUTY",
    institutionId: US_EXECUTIVE_INSTITUTION_ID,
    chamberId: null,
    constituency: { kind: "JURISDICTION", id: US_NATIONAL_JURISDICTION_ID },
    term: { duration: { value: 4, unit: "YEARS" }, ordinaryBoundaryAt: EXECUTIVE_BOUNDARY, staggerGroupId: null },
  },
];

const legislativeActors: readonly ActorIdentityDescriptor[] = [...houseOffices, ...senateOffices].map(
  (office) => ({
    id: `us.actor.legislative.${office.id.slice("us.office.".length)}.scaffold`,
    label: `Anonymous occupant of ${office.label}`,
    role: "LEGISLATIVE",
    classification: SCAFFOLD_CLASSIFICATION,
  }),
);
const executiveActors: readonly ActorIdentityDescriptor[] = [
  {
    id: US_INCUMBENT_PRESIDENT_ACTOR_ID,
    label: "Anonymous incumbent President scaffold",
    role: "EXECUTIVE",
    classification: SCAFFOLD_CLASSIFICATION,
  },
  {
    id: US_INCUMBENT_VICE_PRESIDENT_ACTOR_ID,
    label: "Anonymous incumbent Vice-President scaffold",
    role: "EXECUTIVE",
    classification: SCAFFOLD_CLASSIFICATION,
  },
];

const legislativeAssignments: readonly OfficeAssignmentDescriptor[] = [
  ...houseOffices,
  ...senateOffices,
].map((office, index) => ({
  id: `us.assignment.legislative.${index + 1}`,
  officeId: office.id,
  actorId: legislativeActors[index].id,
  effectiveFrom: SCENARIO_START,
  effectiveUntil: office.term.ordinaryBoundaryAt,
  currentAtScenarioStart: true,
  classification: SCAFFOLD_CLASSIFICATION,
}));
const executiveAssignments: readonly OfficeAssignmentDescriptor[] = [
  {
    id: "us.assignment.president.incumbent-2026",
    officeId: US_PRESIDENT_OFFICE_ID,
    actorId: US_INCUMBENT_PRESIDENT_ACTOR_ID,
    effectiveFrom: SCENARIO_START,
    effectiveUntil: EXECUTIVE_BOUNDARY,
    currentAtScenarioStart: true,
    classification: SCAFFOLD_CLASSIFICATION,
  },
  {
    id: "us.assignment.vice-president.incumbent-2026",
    officeId: US_VICE_PRESIDENT_OFFICE_ID,
    actorId: US_INCUMBENT_VICE_PRESIDENT_ACTOR_ID,
    effectiveFrom: SCENARIO_START,
    effectiveUntil: EXECUTIVE_BOUNDARY,
    currentAtScenarioStart: true,
    classification: SCAFFOLD_CLASSIFICATION,
  },
];

const stateRelations: readonly TopologyRelationDescriptor[] = states
  .filter((state) => state.stateUsps !== "DC")
  .map((state) => ({
    id: `us.relation.state-${state.stateFips}-constituent-of-national`,
    kind: "CONSTITUENT_OF",
    from: { kind: "JURISDICTION", id: `us.jurisdiction.state.${state.stateFips}` },
    to: { kind: "JURISDICTION", id: US_NATIONAL_JURISDICTION_ID },
  }));
const dcId = "us.jurisdiction.dc.11";
const relations: readonly TopologyRelationDescriptor[] = [
  ...stateRelations,
  {
    id: "us.relation.dc-federal-district-of-national",
    kind: "FEDERAL_DISTRICT_OF",
    from: { kind: "JURISDICTION", id: dcId },
    to: { kind: "JURISDICTION", id: US_NATIONAL_JURISDICTION_ID },
  },
  {
    id: "us.relation.dc-equivalent-for-statistics",
    kind: "EQUIVALENT_FOR_STATISTICS",
    from: { kind: "JURISDICTION", id: dcId },
    to: { kind: "JURISDICTION", id: US_NATIONAL_JURISDICTION_ID },
  },
  {
    id: "us.relation.dc-equivalent-for-executive-selection",
    kind: "EQUIVALENT_FOR_EXECUTIVE_SELECTION",
    from: { kind: "JURISDICTION", id: dcId },
    to: { kind: "JURISDICTION", id: US_NATIONAL_JURISDICTION_ID },
  },
  {
    id: "us.relation.d-colorado-appeals-to-tenth-circuit",
    kind: "APPEALS_TO",
    from: { kind: "INSTITUTION", id: US_DISTRICT_COLORADO_COURT_ID },
    to: { kind: "INSTITUTION", id: US_TENTH_CIRCUIT_COURT_ID },
  },
];

export const US_V0_I2_STRUCTURE: GovernmentStructureDescriptor = {
  provenanceArtifacts,
  jurisdictions,
  institutions,
  legislatures: [
    {
      id: US_CONGRESS_LEGISLATURE_ID,
      label: "Congress",
      institutionId: US_CONGRESS_INSTITUTION_ID,
      chamberIds: [US_HOUSE_CHAMBER_ID, US_SENATE_CHAMBER_ID],
    },
  ],
  chambers: [
    {
      id: US_HOUSE_CHAMBER_ID,
      label: "House",
      institutionId: US_HOUSE_INSTITUTION_ID,
      legislatureId: US_CONGRESS_LEGISLATURE_ID,
      seatCount: 435,
    },
    {
      id: US_SENATE_CHAMBER_ID,
      label: "Senate",
      institutionId: US_SENATE_INSTITUTION_ID,
      legislatureId: US_CONGRESS_LEGISLATURE_ID,
      seatCount: 100,
    },
  ],
  geographies,
  staggerGroups: [
    { id: "us.stagger.senate.class-i", label: "Class I", ordinaryBoundaryAt: "2031-01-03T12:00:00-05:00", provenanceArtifactId: SENATE_ARTIFACT_ID },
    { id: "us.stagger.senate.class-ii", label: "Class II", ordinaryBoundaryAt: "2027-01-03T12:00:00-05:00", provenanceArtifactId: SENATE_ARTIFACT_ID },
    { id: "us.stagger.senate.class-iii", label: "Class III", ordinaryBoundaryAt: "2029-01-03T12:00:00-05:00", provenanceArtifactId: SENATE_ARTIFACT_ID },
  ],
  offices: [...houseOffices, ...senateOffices, ...executiveOffices],
  actors: [...legislativeActors, ...executiveActors],
  assignments: [...legislativeAssignments, ...executiveAssignments],
  administrations: [
    {
      id: US_INCUMBENT_ADMINISTRATION_ID,
      label: "Anonymous incumbent administration scaffold (2026 scenario)",
      institutionId: US_EXECUTIVE_INSTITUTION_ID,
      headOfficeId: US_PRESIDENT_OFFICE_ID,
      headActorId: US_INCUMBENT_PRESIDENT_ACTOR_ID,
      classification: SCAFFOLD_CLASSIFICATION,
    },
  ],
  relations,
};
