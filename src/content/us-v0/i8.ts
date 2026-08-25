import { sha256Hex } from "../../configuration/sha256";
import type {
  InstitutionalBoundaryConfiguration,
  IntegratedInformationConfiguration,
  IntegratedTemporalConfiguration,
} from "../../configuration/types";
import { US_V0_I5_TEMPORAL_CONFIGURATION } from "./i5";
import { US_V0_I7_RUNTIME_ARTIFACTS } from "./i7";

export const US_V0_I8_INFORMATION_SEMANTICS_VERSION = "us-v0-information-public-response-2";
export const US_V0_I8_RESPONSE_RULE_VERSION = "us-v0-bounded-population-information-response-1";
export const US_V0_I8_MATERIAL_USABILITY_INSTANT = "2027-10-03T00:00:00-04:00";

const CLASSIFICATION = "APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD" as const;
const OWNER = "us.information.housing-public-response-route-1";
const INFORMATION_PHASE = 2_000;

const addDays = (instant: string, days: number): string =>
  new Date(Date.parse(instant) + days * 86_400_000).toISOString();

export interface UsV0I8RouteOptions {
  readonly observationAt?: string;
  readonly observationLagDays?: number;
  readonly captureLagDays?: number;
  readonly releaseLagDays?: number;
  readonly claimPosition?: "PROGRAM_WORKING" | "PROGRAM_INADEQUATE";
  readonly reverseDeclarationOrder?: boolean;
}

export const createUsV0I8RouteConfiguration = (
  options: UsV0I8RouteOptions = {},
): {
  readonly information: IntegratedInformationConfiguration;
  readonly temporal: IntegratedTemporalConfiguration;
} => {
  const observationLagDays = options.observationLagDays ?? 0;
  const captureLagDays = options.captureLagDays ?? 1;
  const releaseLagDays = options.releaseLagDays ?? 14;
  const claimPosition = options.claimPosition ?? "PROGRAM_WORKING";
  const observationAt = options.observationAt ??
    addDays(US_V0_I8_MATERIAL_USABILITY_INSTANT, observationLagDays);
  const artifactAt = addDays(observationAt, captureLagDays);
  const releaseAt = addDays(artifactAt, releaseLagDays);
  const claimAt = addDays(releaseAt, 1);
  const deliveryAt = addDays(claimAt, 1);
  const exposureAt = addDays(deliveryAt, 1);
  const responseAt = addDays(exposureAt, 1);
  const ids = {
    observation: `${OWNER}.observation-capture`,
    artifact: `${OWNER}.measurement-created`,
    release: `${OWNER}.measurement-released`,
    claim: `${OWNER}.claim-released`,
    delivery: `${OWNER}.information-delivered`,
    exposure: `${OWNER}.population-exposed`,
    response: `${OWNER}.population-response`,
  };
  const declaredBoundaries: readonly InstitutionalBoundaryConfiguration[] = [
    { id: ids.observation, at: observationAt, phase: INFORMATION_PHASE, order: 0, stableKey: `${OWNER}:00`, kind: "OBSERVATION_CAPTURE", ownerId: OWNER },
    { id: ids.artifact, at: artifactAt, phase: INFORMATION_PHASE, order: 1, stableKey: `${OWNER}:01`, kind: "MEASUREMENT_CREATED", ownerId: OWNER },
    { id: ids.release, at: releaseAt, phase: INFORMATION_PHASE, order: 2, stableKey: `${OWNER}:02`, kind: "MEASUREMENT_RELEASED", ownerId: OWNER },
    { id: ids.claim, at: claimAt, phase: INFORMATION_PHASE, order: 3, stableKey: `${OWNER}:03`, kind: "CLAIM_RELEASED", ownerId: OWNER },
    { id: ids.delivery, at: deliveryAt, phase: INFORMATION_PHASE, order: 4, stableKey: `${OWNER}:04`, kind: "INFORMATION_DELIVERED", ownerId: OWNER },
    { id: ids.exposure, at: exposureAt, phase: INFORMATION_PHASE, order: 5, stableKey: `${OWNER}:05`, kind: "POPULATION_EXPOSED", ownerId: OWNER },
    { id: ids.response, at: responseAt, phase: INFORMATION_PHASE, order: 6, stableKey: `${OWNER}:06`, kind: "POPULATION_RESPONSE", ownerId: OWNER },
  ];
  const informationBoundaries = options.reverseDeclarationOrder === true
    ? [...declaredBoundaries].reverse()
    : declaredBoundaries;
  const informationWithoutHash = {
    schemaVersion: 1,
    ownerId: OWNER,
    semanticsVersion: US_V0_I8_INFORMATION_SEMANTICS_VERSION,
    responseRuleVersion: US_V0_I8_RESPONSE_RULE_VERSION,
    classification: CLASSIFICATION,
    measurements: [{
      id: "us.measurement.housing-material-2027",
      observationId: "us.observation.housing-material-2027",
      artifactId: "us.information-artifact.housing-material-report-2027",
      producerInstitutionId: "us.institution.hud",
      housingRegionIds: [
        "us.housing.region.08.stables-catchment",
        "us.housing.region.48.palms-catchment",
      ],
      housingProjectIds: ["us.project.stables", "us.project.palms-at-morris"],
      observationBoundaryId: ids.observation,
      artifactBoundaryId: ids.artifact,
      releaseBoundaryId: ids.release,
      observationIntervalDays: 30,
      observationLagDays,
      captureLagDays,
      releaseLagDays,
      methodVersion: "bounded-housing-material-measurement-2",
      deterministicErrorBound: 25,
      classification: CLASSIFICATION,
    }],
    claim: {
      id: "us.information-claim.administration-housing-2027",
      evidenceArtifactIds: ["us.information-artifact.housing-material-report-2027"],
      boundaryId: ids.claim,
      claimantPolicy: "CURRENT_ADMINISTRATION" as const,
      subject: "BOUNDED_HOUSING_PROGRAM_PERFORMANCE",
      position: claimPosition,
      contentVersion: "us-v0-housing-claim-frame-1",
      classification: CLASSIFICATION,
    },
    delivery: {
      id: "us.information-delivery.housing-claim.co-catchment-2027",
      informationItemId: "us.information-claim.administration-housing-2027",
      boundaryId: ids.delivery,
      channelId: "CONFIGURED_BOUNDED_PUBLIC_CHANNEL",
      audienceCatchmentId: "us.audience.08.stables-project-catchment",
      classification: CLASSIFICATION,
    },
    exposure: {
      id: "us.information-exposure.housing-claim.co-catchment-2027",
      deliveryId: "us.information-delivery.housing-claim.co-catchment-2027",
      boundaryId: ids.exposure,
      targets: [
        {
          stateGeographyId: "us.geography.state.08",
          parentCohortId: "us.population.cohort.08.renter-exposed.project-catchment",
          projectLocatorGeographyId: "us.geography.project-locator.stables",
          materialExposureClass: "RENTER_EXPOSED",
          catchmentClass: "PROJECT_CATCHMENT",
          directExperienceEligible: true,
        },
        {
          stateGeographyId: "us.geography.state.08",
          parentCohortId: "us.population.cohort.08.nonrenter-exposed.project-catchment",
          projectLocatorGeographyId: "us.geography.project-locator.stables",
          materialExposureClass: "NONRENTER_EXPOSED",
          catchmentClass: "PROJECT_CATCHMENT",
          directExperienceEligible: false,
        },
      ],
      targetNumerator: 1,
      targetDenominator: 2,
      classification: CLASSIFICATION,
    },
    response: {
      id: "us.population-response.housing-claim.co-catchment-2027",
      exposureId: "us.information-exposure.housing-claim.co-catchment-2027",
      boundaryId: ids.response,
      outcomesByClaimPosition: {
        PROGRAM_WORKING: {
          withDirectExperience: {
            belief: "MEASURED_HOUSING_IMPROVEMENT_CONFIRMED_BY_EXPERIENCE",
            attribution: "ADMINISTRATION_CONTRIBUTION_PLAUSIBLE",
            salience: "HIGH",
            candidatePreference: "PLAYER_ALIGNED",
            turnoutDisposition: "HIGH",
          },
          withoutDirectExperience: {
            belief: "REPORTED_HOUSING_IMPROVEMENT",
            attribution: "ADMINISTRATION_CONTRIBUTION_UNCERTAIN",
            salience: "MEDIUM",
            candidatePreference: "UNRESOLVED",
            turnoutDisposition: "MEDIUM",
          },
        },
        PROGRAM_INADEQUATE: {
          withDirectExperience: {
            belief: "MEASURED_HOUSING_GAINS_INSUFFICIENT",
            attribution: "ADMINISTRATION_RESPONSE_INADEQUATE",
            salience: "HIGH",
            candidatePreference: "OPPOSITION",
            turnoutDisposition: "HIGH",
          },
          withoutDirectExperience: {
            belief: "CLAIMED_HOUSING_RESPONSE_INADEQUATE",
            attribution: "ADMINISTRATION_RESPONSIBILITY_UNCERTAIN",
            salience: "MEDIUM",
            candidatePreference: "UNRESOLVED",
            turnoutDisposition: "MEDIUM",
          },
        },
      },
      classification: CLASSIFICATION,
    },
  };
  const information: IntegratedInformationConfiguration = {
    ...informationWithoutHash,
    parameterHash: sha256Hex(JSON.stringify(informationWithoutHash)),
  };
  const boundaries = [...US_V0_I5_TEMPORAL_CONFIGURATION.boundaries, ...informationBoundaries]
    .sort((left, right) => Date.parse(left.at) - Date.parse(right.at) || left.phase - right.phase ||
      left.order - right.order || left.stableKey.localeCompare(right.stableKey) || left.id.localeCompare(right.id));
  const temporalWithoutParameterHash = {
    schemaVersion: US_V0_I5_TEMPORAL_CONFIGURATION.schemaVersion,
    scheduleVersion: "us-v0-institutional-information-calendar-2",
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
  const temporal: IntegratedTemporalConfiguration = {
    ...temporalWithoutParameterHash,
    parameterHash: sha256Hex(JSON.stringify(temporalWithoutParameterHash)),
  };
  return { information, temporal };
};

const defaultRoute = createUsV0I8RouteConfiguration();

export const US_V0_I8_INFORMATION_CONFIGURATION = defaultRoute.information;
export const US_V0_I8_TEMPORAL_CONFIGURATION = defaultRoute.temporal;
export const US_V0_I8_OBSERVATION_CAPTURE =
  defaultRoute.temporal.boundaries.find((boundary) => boundary.kind === "OBSERVATION_CAPTURE")!.at;
export const US_V0_I8_MEASUREMENT_CREATED =
  defaultRoute.temporal.boundaries.find((boundary) => boundary.kind === "MEASUREMENT_CREATED")!.at;
export const US_V0_I8_MEASUREMENT_RELEASED =
  defaultRoute.temporal.boundaries.find((boundary) => boundary.kind === "MEASUREMENT_RELEASED")!.at;
export const US_V0_I8_CLAIM_RELEASED =
  defaultRoute.temporal.boundaries.find((boundary) => boundary.kind === "CLAIM_RELEASED")!.at;
export const US_V0_I8_INFORMATION_DELIVERED =
  defaultRoute.temporal.boundaries.find((boundary) => boundary.kind === "INFORMATION_DELIVERED")!.at;
export const US_V0_I8_POPULATION_EXPOSED =
  defaultRoute.temporal.boundaries.find((boundary) => boundary.kind === "POPULATION_EXPOSED")!.at;
export const US_V0_I8_POPULATION_RESPONSE =
  defaultRoute.temporal.boundaries.find((boundary) => boundary.kind === "POPULATION_RESPONSE")!.at;

export const US_V0_I8_RUNTIME_ARTIFACTS = US_V0_I7_RUNTIME_ARTIFACTS;
