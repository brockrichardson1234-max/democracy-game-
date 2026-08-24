import { sha256Hex } from "../../configuration/sha256";
import type {
  InstitutionalBoundaryConfiguration,
  IntegratedInformationConfiguration,
  IntegratedTemporalConfiguration,
} from "../../configuration/types";
import { US_V0_I7_RUNTIME_ARTIFACTS } from "./i7";
import { US_V0_I5_TEMPORAL_CONFIGURATION } from "./i5";

export const US_V0_I8_INFORMATION_SEMANTICS_VERSION = "us-v0-information-public-response-1";
export const US_V0_I8_ADMIN_CAPTURE = "2027-04-01T12:00:00-04:00";
export const US_V0_I8_ADMIN_RELEASE = "2027-04-15T12:00:00-04:00";
export const US_V0_I8_MATERIAL_CAPTURE = "2027-10-15T12:00:00-04:00";
export const US_V0_I8_MATERIAL_RELEASE = "2027-11-01T12:00:00-04:00";
export const US_V0_I8_CLAIM_RELEASE = "2027-11-02T12:00:00-04:00";
export const US_V0_I8_DELIVERY = "2027-11-03T12:00:00-04:00";
export const US_V0_I8_EXPOSURE = "2027-11-04T12:00:00-04:00";
export const US_V0_I8_RESPONSE = "2027-11-05T12:00:00-04:00";

const CLASSIFICATION = "APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD" as const;
const OWNER = "us.information.public-response-route-1";

const informationWithoutHash = {
  schemaVersion: 1,
  ownerId: OWNER,
  semanticsVersion: US_V0_I8_INFORMATION_SEMANTICS_VERSION,
  classification: CLASSIFICATION,
  measurements: [
    {
      id: "us.measurement.home-administrative-record-2027",
      measurementKind: "ADMINISTRATIVE_RECORD" as const,
      captureBoundaryId: `${OWNER}.admin-capture`,
      releaseBoundaryId: `${OWNER}.admin-release`,
      artifactId: "us.information-artifact.home-administrative-record-2027",
      producerId: "us.institution.hud",
      referentIds: ["us.program.hud.home"],
      deterministicErrorBound: 0,
      classification: CLASSIFICATION,
    },
    {
      id: "us.measurement.housing-material-2027",
      measurementKind: "MATERIAL_STATISTICAL" as const,
      captureBoundaryId: `${OWNER}.material-capture`,
      releaseBoundaryId: `${OWNER}.material-release`,
      artifactId: "us.information-artifact.housing-material-report-2027",
      producerId: "us.institution.hud",
      referentIds: ["us.housing.region.08.stables-catchment", "us.housing.region.48.palms-catchment"],
      deterministicErrorBound: 25,
      classification: CLASSIFICATION,
    },
  ],
  claim: {
    id: "us.information-artifact.administration-housing-claim-2027",
    sourceArtifactIds: ["us.information-artifact.housing-material-report-2027"],
    releaseBoundaryId: `${OWNER}.claim-release`,
    subject: "BOUNDED_HOUSING_PROGRAM_PERFORMANCE",
    assertion: "REPORTED_LOCAL_MATERIAL_IMPROVEMENT_SUPPORTS_ADMINISTRATION_ACTION",
    originPolicy: "CURRENT_ADMINISTRATION" as const,
  },
  delivery: {
    id: "us.information-delivery.housing-claim.catchment-2027",
    artifactId: "us.information-artifact.administration-housing-claim-2027",
    boundaryId: `${OWNER}.delivery`,
    channel: "CONFIGURED_BOUNDED_PUBLIC_CHANNEL",
  },
  exposure: {
    id: "us.information-exposure.housing-claim.co-catchment-2027",
    deliveryId: "us.information-delivery.housing-claim.catchment-2027",
    boundaryId: `${OWNER}.exposure`,
    stateGeographyId: "us.geography.state.08",
    parentCohortId: "us.population.cohort.08.renter-exposed.project-catchment",
    materialExposureClass: "RENTER_EXPOSED",
    catchmentClass: "PROJECT_CATCHMENT",
    targetNumerator: 1,
    targetDenominator: 2,
  },
  response: {
    id: "us.population-response.housing-claim.co-catchment-2027",
    exposureId: "us.information-exposure.housing-claim.co-catchment-2027",
    boundaryId: `${OWNER}.response`,
    belief: "REPORTED_LOCAL_MATERIAL_IMPROVEMENT",
    attributionPolicy: "CURRENT_ADMINISTRATION" as const,
    salience: "MEDIUM",
    candidatePreference: "PLAYER_ALIGNED",
    turnoutDisposition: "MEDIUM",
  },
};

export const US_V0_I8_INFORMATION_CONFIGURATION: IntegratedInformationConfiguration = {
  ...informationWithoutHash,
  parameterHash: sha256Hex(JSON.stringify(informationWithoutHash)),
};

const informationBoundaries: readonly InstitutionalBoundaryConfiguration[] = [
  { id: `${OWNER}.admin-capture`, at: US_V0_I8_ADMIN_CAPTURE, phase: 0, order: 0, stableKey: `${OWNER}:00`, kind: "MEASUREMENT_CAPTURE", ownerId: OWNER },
  { id: `${OWNER}.admin-release`, at: US_V0_I8_ADMIN_RELEASE, phase: 0, order: 0, stableKey: `${OWNER}:01`, kind: "ARTIFACT_RELEASE", ownerId: OWNER },
  { id: `${OWNER}.material-capture`, at: US_V0_I8_MATERIAL_CAPTURE, phase: 0, order: 0, stableKey: `${OWNER}:02`, kind: "MEASUREMENT_CAPTURE", ownerId: OWNER },
  { id: `${OWNER}.material-release`, at: US_V0_I8_MATERIAL_RELEASE, phase: 0, order: 0, stableKey: `${OWNER}:03`, kind: "ARTIFACT_RELEASE", ownerId: OWNER },
  { id: `${OWNER}.claim-release`, at: US_V0_I8_CLAIM_RELEASE, phase: 0, order: 0, stableKey: `${OWNER}:04`, kind: "CLAIM_RELEASE", ownerId: OWNER },
  { id: `${OWNER}.delivery`, at: US_V0_I8_DELIVERY, phase: 0, order: 0, stableKey: `${OWNER}:05`, kind: "ARTIFACT_DELIVERY", ownerId: OWNER },
  { id: `${OWNER}.exposure`, at: US_V0_I8_EXPOSURE, phase: 0, order: 0, stableKey: `${OWNER}:06`, kind: "RECIPIENT_EXPOSURE", ownerId: OWNER },
  { id: `${OWNER}.response`, at: US_V0_I8_RESPONSE, phase: 0, order: 0, stableKey: `${OWNER}:07`, kind: "POLITICAL_RESPONSE", ownerId: OWNER },
];

const boundaries = [...US_V0_I5_TEMPORAL_CONFIGURATION.boundaries, ...informationBoundaries].sort((left, right) =>
  Date.parse(left.at) - Date.parse(right.at) || left.phase - right.phase || left.order - right.order ||
  left.stableKey.localeCompare(right.stableKey) || left.id.localeCompare(right.id));
const temporalWithoutParameterHash = {
  schemaVersion: US_V0_I5_TEMPORAL_CONFIGURATION.schemaVersion,
  scheduleVersion: "us-v0-institutional-information-calendar-1",
  scheduleContentHash: sha256Hex(JSON.stringify(boundaries)),
  assignmentCycleContentHash: US_V0_I5_TEMPORAL_CONFIGURATION.assignmentCycleContentHash,
  selectionContentHash: US_V0_I5_TEMPORAL_CONFIGURATION.selectionContentHash,
  initialTermLabel: US_V0_I5_TEMPORAL_CONFIGURATION.initialTermLabel,
  boundaries,
  assignmentCycles: US_V0_I5_TEMPORAL_CONFIGURATION.assignmentCycles,
  selection: US_V0_I5_TEMPORAL_CONFIGURATION.selection,
  newProcedureIdPrefix: US_V0_I5_TEMPORAL_CONFIGURATION.newProcedureIdPrefix,
  initialAdministration: US_V0_I5_TEMPORAL_CONFIGURATION.initialAdministration,
};

export const US_V0_I8_TEMPORAL_CONFIGURATION: IntegratedTemporalConfiguration = {
  ...temporalWithoutParameterHash,
  parameterHash: sha256Hex(JSON.stringify(temporalWithoutParameterHash)),
};

export const US_V0_I8_RUNTIME_ARTIFACTS = US_V0_I7_RUNTIME_ARTIFACTS;
