import { sha256Hex } from "../configuration/sha256";
import { formatConfiguredEpochMilliseconds } from "../configuration/instant";
import type {
  InformationMeasurementConfiguration,
  IntegratedInformationConfiguration,
  IntegratedTemporalConfiguration,
  InstitutionalBoundaryConfiguration,
} from "../configuration/types";
import { compareConfiguredBoundaries } from "./calendar-time";
import type { IntegratedMaterialHousingState } from "./housing";
import type { InstitutionalRuntimeState } from "./institutional-runtime";

export type InformationScalar = number | string | boolean | null;

export interface IntegratedObservationVariable {
  readonly name: string;
  readonly value: InformationScalar;
}

export interface IntegratedHousingObservation {
  readonly id: string;
  readonly measurementId: string;
  readonly subjectRef: string;
  readonly subjectKind: "HOUSING_REGION" | "HOUSING_PROJECT";
  readonly geographyId: string;
  readonly observationStart: string;
  readonly observationEnd: string;
  readonly capturedAt: string;
  readonly captureOwnerInstitutionId: string;
  readonly observationMode: InformationMeasurementConfiguration["observationMode"];
  readonly observationSemanticVersion: string;
  readonly methodVersion: string;
  readonly variables: readonly IntegratedObservationVariable[];
  readonly sourceMaterialReferences: readonly string[];
  readonly classification: string;
}

export interface IntegratedMeasuredValue extends IntegratedObservationVariable {
  readonly sourceObservationId: string;
  readonly approximation: "EXACT_CAPTURE" | "DETERMINISTIC_BOUNDED_APPROXIMATION";
}

export interface IntegratedMeasurementArtifact {
  readonly id: string;
  readonly sourceMeasurementId: string;
  readonly sourceObservationIds: readonly string[];
  readonly sourceInstitutionId: string;
  readonly subjectRefs: readonly string[];
  readonly geographyIds: readonly string[];
  readonly observationStart: string;
  readonly observationEnd: string;
  readonly createdAt: string;
  readonly observationMode: InformationMeasurementConfiguration["observationMode"];
  readonly observationSemanticVersion: string;
  readonly methodologyVersion: string;
  readonly approximationSemanticVersion: string;
  readonly measuredValues: readonly IntegratedMeasuredValue[];
  readonly classification: string;
}

export interface IntegratedInformationRelease {
  readonly id: string;
  readonly artifactId: string;
  readonly releasedAt: string;
  readonly accessClass: "PUBLIC";
  readonly audienceEligibility: "GENERAL_PUBLIC";
  readonly sourceInstitutionId: string;
  readonly classification: string;
}

export interface IntegratedClaim {
  readonly id: string;
  readonly claimantId: string;
  readonly evidenceArtifactIds: readonly string[];
  readonly subject: string;
  readonly position: string;
  readonly contentVersion: string;
  readonly createdAt: string;
  readonly releasedAt: string;
  readonly classification: string;
}

export interface IntegratedInformationDelivery {
  readonly id: string;
  readonly informationItemId: string;
  readonly channelId: string;
  readonly audienceCatchmentId: string;
  readonly attemptedAt: string;
  readonly deliveredAt: string;
  readonly classification: string;
}

export interface IntegratedPopulationExposure {
  readonly id: string;
  readonly deliveryId: string;
  readonly informationItemId: string;
  readonly cohortIds: readonly string[];
  readonly representedWeight: number;
  readonly exposedAt: string;
  readonly causeDeliveryId: string;
  readonly classification: string;
}

export interface PopulationResponseTransition {
  readonly id: string;
  readonly value: string;
  readonly causeIds: readonly string[];
  readonly classification: string;
}

export interface IntegratedPopulationResponseRecord {
  readonly id: string;
  readonly exposureId: string;
  readonly cohortId: string;
  readonly directMaterialExperienceReferenceIds: readonly string[];
  readonly belief: PopulationResponseTransition;
  readonly attribution: PopulationResponseTransition;
  readonly salience: PopulationResponseTransition;
  readonly preference: PopulationResponseTransition;
  readonly turnout: PopulationResponseTransition;
  readonly appliedAt: string;
  readonly ruleVersion: string;
  readonly classification: string;
}

export interface IntegratedInformationBoundaryState {
  readonly id: string;
  readonly at: string;
  readonly kind: InstitutionalBoundaryConfiguration["kind"];
  readonly processed: boolean;
}

export interface IntegratedMeasurementProcess {
  readonly id: string;
  readonly observationId: string;
  readonly artifactId: string;
  readonly status: "SCHEDULED" | "OBSERVED" | "CREATED" | "RELEASED";
}

export interface IntegratedInformationRuntimeState {
  readonly schemaVersion: number;
  readonly ownerId: string;
  readonly parameterHash: string;
  readonly semanticsVersion: string;
  readonly responseRuleVersion: string;
  readonly classification: string;
  readonly boundaries: readonly IntegratedInformationBoundaryState[];
  readonly measurementProcesses: readonly IntegratedMeasurementProcess[];
  readonly observations: readonly IntegratedHousingObservation[];
  readonly measurementArtifacts: readonly IntegratedMeasurementArtifact[];
  readonly releases: readonly IntegratedInformationRelease[];
  readonly claims: readonly IntegratedClaim[];
  readonly deliveries: readonly IntegratedInformationDelivery[];
  readonly exposures: readonly IntegratedPopulationExposure[];
  readonly responses: readonly IntegratedPopulationResponseRecord[];
}

const exactCopy = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const instant = (value: string, label: string): number => {
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) throw new Error(`${label} must be a valid configured instant.`);
  return parsed;
};

const addDays = (value: string, days: number): string =>
  formatConfiguredEpochMilliseconds(instant(value, "Information instant") + days * 86_400_000);

const boundaryFor = (
  state: IntegratedInformationRuntimeState,
  id: string,
): IntegratedInformationBoundaryState => {
  const boundary = state.boundaries.find((candidate) => candidate.id === id);
  if (boundary === undefined) throw new Error(`Unknown Information boundary ${id}.`);
  return boundary;
};

const markBoundaryProcessed = (
  state: IntegratedInformationRuntimeState,
  boundaryId: string,
  at: string,
): IntegratedInformationRuntimeState => {
  const boundary = boundaryFor(state, boundaryId);
  if (boundary.processed || boundary.at !== at) {
    throw new Error(`Information boundary ${boundaryId} is duplicated or has contradictory time.`);
  }
  return {
    ...state,
    boundaries: state.boundaries.map((candidate) => candidate.id === boundaryId
      ? { ...candidate, processed: true }
      : candidate),
  };
};

export const createIntegratedInformationRuntimeState = (
  configuration: IntegratedInformationConfiguration,
  boundaries: readonly InstitutionalBoundaryConfiguration[],
): IntegratedInformationRuntimeState => ({
  schemaVersion: configuration.schemaVersion,
  ownerId: configuration.ownerId,
  parameterHash: configuration.parameterHash,
  semanticsVersion: configuration.semanticsVersion,
  responseRuleVersion: configuration.responseRuleVersion,
  classification: configuration.classification,
  boundaries: boundaries
    .filter((boundary) => boundary.ownerId === configuration.ownerId)
    .map((boundary) => ({ id: boundary.id, at: boundary.at, kind: boundary.kind, processed: false })),
  measurementProcesses: configuration.measurements.map((measurement) => ({
    id: measurement.id,
    observationId: measurement.observationId,
    artifactId: measurement.artifactId,
    status: "SCHEDULED",
  })),
  observations: [],
  measurementArtifacts: [],
  releases: [],
  claims: [],
  deliveries: [],
  exposures: [],
  responses: [],
});

const observationVariablesForRegion = (
  region: IntegratedMaterialHousingState["regions"][number],
): readonly IntegratedObservationVariable[] => [
  { name: "HOUSING_STOCK_UNITS", value: region.housingStockUnits },
  { name: "VACANT_UNITS", value: region.vacantUnits },
  { name: "AFFORDABILITY_PRESSURE_BASIS_POINTS", value: region.affordabilityPressureBasisPoints },
];

const observationVariablesForProject = (
  project: IntegratedMaterialHousingState["projects"][number],
): readonly IntegratedObservationVariable[] => [
  { name: "MATERIAL_STAGE", value: project.stage },
  { name: "PHYSICAL_PROGRESS_UNITS", value: project.physicalProgressUnits },
  { name: "REQUIRED_PROGRESS_UNITS", value: project.requiredProgressUnits },
  { name: "PHYSICAL_COMPLETION_AT", value: project.physicalCompletionAt },
  { name: "USABLE_AT", value: project.usableAt },
  { name: "USABLE_UNIT_CONTRIBUTION", value: project.usableUnitContribution },
];

export const captureIntegratedHousingObservation = (
  state: IntegratedInformationRuntimeState,
  measurement: InformationMeasurementConfiguration,
  housing: IntegratedMaterialHousingState,
  at: string,
): IntegratedInformationRuntimeState => {
  const process = state.measurementProcesses.find((candidate) => candidate.id === measurement.id);
  if (process?.status !== "SCHEDULED" || state.observations.some((entry) => entry.measurementId === measurement.id)) {
    throw new Error(`Information measurement ${measurement.id} is unavailable for observation.`);
  }
  const observationStart = addDays(at, -measurement.observationIntervalDays);
  const exposureReferencesByProject = new Map<string, string[]>();
  for (const reference of housing.materialExposureReferences) {
    const values = exposureReferencesByProject.get(reference.projectId) ?? [];
    values.push(reference.id);
    exposureReferencesByProject.set(reference.projectId, values);
  }
  const regionObservations = measurement.housingRegionIds.map((regionId): IntegratedHousingObservation => {
    const region = housing.regions.find((candidate) => candidate.id === regionId);
    if (region === undefined) throw new Error(`Information observation lacks Housing region ${regionId}.`);
    return {
      id: `${measurement.observationId}:region:${region.id}`,
      measurementId: measurement.id,
      subjectRef: region.id,
      subjectKind: "HOUSING_REGION",
      geographyId: region.stateGeographyId,
      observationStart,
      observationEnd: at,
      capturedAt: at,
      captureOwnerInstitutionId: measurement.producerInstitutionId,
      observationMode: measurement.observationMode,
      observationSemanticVersion: measurement.observationSemanticVersion,
      methodVersion: measurement.methodVersion,
      variables: observationVariablesForRegion(region),
      sourceMaterialReferences: [region.sourceControlId],
      classification: measurement.classification,
    };
  });
  const projectObservations = measurement.housingProjectIds.map((projectId): IntegratedHousingObservation => {
    const project = housing.projects.find((candidate) => candidate.id === projectId);
    if (project === undefined) throw new Error(`Information observation lacks Housing project ${projectId}.`);
    return {
      id: `${measurement.observationId}:project:${project.id}`,
      measurementId: measurement.id,
      subjectRef: project.id,
      subjectKind: "HOUSING_PROJECT",
      geographyId: project.stateGeographyId,
      observationStart,
      observationEnd: at,
      capturedAt: at,
      captureOwnerInstitutionId: measurement.producerInstitutionId,
      observationMode: measurement.observationMode,
      observationSemanticVersion: measurement.observationSemanticVersion,
      methodVersion: measurement.methodVersion,
      variables: observationVariablesForProject(project),
      sourceMaterialReferences: [
        project.id,
        project.housingRegionId,
        ...project.acceptedGovernmentInputRefs,
        ...(exposureReferencesByProject.get(project.id) ?? []),
      ],
      classification: measurement.classification,
    };
  });
  const marked = markBoundaryProcessed(state, measurement.observationBoundaryId, at);
  return {
    ...marked,
    measurementProcesses: marked.measurementProcesses.map((candidate) => candidate.id === measurement.id
      ? { ...candidate, status: "OBSERVED" }
      : candidate),
    observations: [...marked.observations, ...regionObservations, ...projectObservations],
  };
};

export const approximateAffordabilityPressureBasisPoints = (
  measurement: Pick<InformationMeasurementConfiguration,
    "id" | "methodVersion" | "approximationSemanticVersion" | "deterministicErrorBound">,
  subjectRef: string,
  canonicalValue: number,
): number => {
  if (
    !Number.isSafeInteger(canonicalValue) || canonicalValue < 0 || canonicalValue > 10_000 ||
    !Number.isSafeInteger(measurement.deterministicErrorBound) || measurement.deterministicErrorBound < 0
  ) throw new Error("Affordability approximation requires canonical basis points and a nonnegative integer bound.");
  const minimumOffset = Math.max(-measurement.deterministicErrorBound, -canonicalValue);
  const maximumOffset = Math.min(measurement.deterministicErrorBound, 10_000 - canonicalValue);
  const width = maximumOffset - minimumOffset + 1;
  const offset = Number.parseInt(sha256Hex(
    `${measurement.id}|${subjectRef}|AFFORDABILITY_PRESSURE_BASIS_POINTS|${measurement.methodVersion}|` +
    measurement.approximationSemanticVersion,
  ).slice(0, 8), 16) % width + minimumOffset;
  return canonicalValue + offset;
};

const measuredValue = (
  measurement: InformationMeasurementConfiguration,
  observation: IntegratedHousingObservation,
  variable: IntegratedObservationVariable,
): IntegratedMeasuredValue => {
  const approximate = variable.name === "AFFORDABILITY_PRESSURE_BASIS_POINTS" &&
    typeof variable.value === "number" && measurement.deterministicErrorBound > 0;
  if (!approximate) {
    return { ...variable, sourceObservationId: observation.id, approximation: "EXACT_CAPTURE" };
  }
  return {
    name: variable.name,
    value: approximateAffordabilityPressureBasisPoints(measurement, observation.subjectRef, variable.value),
    sourceObservationId: observation.id,
    approximation: "DETERMINISTIC_BOUNDED_APPROXIMATION",
  };
};

export const createIntegratedMeasurementArtifact = (
  state: IntegratedInformationRuntimeState,
  measurement: InformationMeasurementConfiguration,
  at: string,
): IntegratedInformationRuntimeState => {
  const process = state.measurementProcesses.find((candidate) => candidate.id === measurement.id);
  const observations = state.observations.filter((entry) => entry.measurementId === measurement.id);
  if (process?.status !== "OBSERVED" || observations.length === 0) {
    throw new Error(`Measurement artifact ${measurement.artifactId} requires captured observations.`);
  }
  const artifact: IntegratedMeasurementArtifact = {
    id: measurement.artifactId,
    sourceMeasurementId: measurement.id,
    sourceObservationIds: observations.map((entry) => entry.id),
    sourceInstitutionId: measurement.producerInstitutionId,
    subjectRefs: observations.map((entry) => entry.subjectRef),
    geographyIds: [...new Set(observations.map((entry) => entry.geographyId))],
    observationStart: observations[0].observationStart,
    observationEnd: observations[0].observationEnd,
    createdAt: at,
    observationMode: measurement.observationMode,
    observationSemanticVersion: measurement.observationSemanticVersion,
    methodologyVersion: measurement.methodVersion,
    approximationSemanticVersion: measurement.approximationSemanticVersion,
    measuredValues: observations.flatMap((observation) =>
      observation.variables.map((variable) => measuredValue(measurement, observation, variable))),
    classification: measurement.classification,
  };
  const marked = markBoundaryProcessed(state, measurement.artifactBoundaryId, at);
  return {
    ...marked,
    measurementProcesses: marked.measurementProcesses.map((candidate) => candidate.id === measurement.id
      ? { ...candidate, status: "CREATED" }
      : candidate),
    measurementArtifacts: [...marked.measurementArtifacts, artifact],
  };
};

export const releaseIntegratedMeasurement = (
  state: IntegratedInformationRuntimeState,
  measurement: InformationMeasurementConfiguration,
  at: string,
): IntegratedInformationRuntimeState => {
  const process = state.measurementProcesses.find((candidate) => candidate.id === measurement.id);
  const artifact = state.measurementArtifacts.find((candidate) => candidate.id === measurement.artifactId);
  if (process?.status !== "CREATED" || artifact === undefined || instant(artifact.createdAt, artifact.id) > instant(at, measurement.id)) {
    throw new Error(`Measurement ${measurement.id} cannot release before artifact creation.`);
  }
  const marked = markBoundaryProcessed(state, measurement.releaseBoundaryId, at);
  return {
    ...marked,
    measurementProcesses: marked.measurementProcesses.map((candidate) => candidate.id === measurement.id
      ? { ...candidate, status: "RELEASED" }
      : candidate),
    releases: [...marked.releases, {
      id: `information-release:${measurement.artifactId}`,
      artifactId: measurement.artifactId,
      releasedAt: at,
      accessClass: "PUBLIC",
      audienceEligibility: "GENERAL_PUBLIC",
      sourceInstitutionId: measurement.producerInstitutionId,
      classification: measurement.classification,
    }],
  };
};

export const releaseIntegratedClaim = (
  state: IntegratedInformationRuntimeState,
  configuration: IntegratedInformationConfiguration,
  claimantId: string,
  at: string,
): IntegratedInformationRuntimeState => {
  if (
    configuration.claim.evidenceArtifactIds.length === 0 ||
    configuration.claim.evidenceArtifactIds.some((id) => !state.releases.some((release) => release.artifactId === id))
  ) throw new Error("Information claim requires released measurement evidence.");
  const marked = markBoundaryProcessed(state, configuration.claim.boundaryId, at);
  return {
    ...marked,
    claims: [...marked.claims, {
      id: configuration.claim.id,
      claimantId,
      evidenceArtifactIds: [...configuration.claim.evidenceArtifactIds],
      subject: configuration.claim.subject,
      position: configuration.claim.position,
      contentVersion: configuration.claim.contentVersion,
      createdAt: at,
      releasedAt: at,
      classification: configuration.claim.classification,
    }],
  };
};

export const resolveInformationClaimantAt = (
  institutional: InstitutionalRuntimeState,
  temporal: IntegratedTemporalConfiguration,
  claimBoundary: InstitutionalBoundaryConfiguration,
  claimantPolicy: IntegratedInformationConfiguration["claim"]["claimantPolicy"],
): string => {
  if (claimantPolicy !== "CURRENT_ADMINISTRATION") {
    throw new Error(`Unsupported Information claimant policy ${String(claimantPolicy)}.`);
  }
  const claimTime = instant(claimBoundary.at, "Information claim boundary");
  const transferBoundary = temporal.boundaries.find((boundary) =>
    boundary.kind === "AUTHORITY_TRANSFER" && Date.parse(boundary.at) === claimTime);
  if (transferBoundary !== undefined && compareConfiguredBoundaries(claimBoundary, transferBoundary) < 0) {
    const outgoing = institutional.administrationHistory.find((administration) =>
      Date.parse(administration.effectiveUntil ?? "") === claimTime);
    if (outgoing === undefined) {
      if (Date.parse(institutional.currentAdministration.effectiveFrom) < claimTime) {
        return institutional.currentAdministration.id;
      }
      throw new Error("Information claimant resolution lacks the outgoing administration at transfer.");
    }
    return outgoing.id;
  }
  const administrations = [...institutional.administrationHistory, institutional.currentAdministration];
  const effective = administrations.filter((administration) =>
    Date.parse(administration.effectiveFrom) <= claimTime &&
    (administration.effectiveUntil === null || claimTime < Date.parse(administration.effectiveUntil)));
  if (effective.length !== 1) {
    throw new Error("Information claimant resolution requires one administration effective at the claim boundary.");
  }
  return effective[0].id;
};

export const deliverIntegratedInformation = (
  state: IntegratedInformationRuntimeState,
  configuration: IntegratedInformationConfiguration,
  at: string,
): IntegratedInformationRuntimeState => {
  if (!state.claims.some((claim) => claim.id === configuration.delivery.informationItemId)) {
    throw new Error("Information delivery requires a released information item.");
  }
  const marked = markBoundaryProcessed(state, configuration.delivery.boundaryId, at);
  return {
    ...marked,
    deliveries: [...marked.deliveries, {
      id: configuration.delivery.id,
      informationItemId: configuration.delivery.informationItemId,
      channelId: configuration.delivery.channelId,
      audienceCatchmentId: configuration.delivery.audienceCatchmentId,
      attemptedAt: at,
      deliveredAt: at,
      classification: configuration.delivery.classification,
    }],
  };
};

export const recordIntegratedPopulationExposure = (
  state: IntegratedInformationRuntimeState,
  configuration: IntegratedInformationConfiguration,
  cohortWeights: readonly { readonly id: string; readonly representedWeight: number }[],
  at: string,
): IntegratedInformationRuntimeState => {
  if (
    cohortWeights.length === 0 || new Set(cohortWeights.map((entry) => entry.id)).size !== cohortWeights.length ||
    !state.deliveries.some((delivery) => delivery.id === configuration.exposure.deliveryId) ||
    cohortWeights.some((entry) => !Number.isSafeInteger(entry.representedWeight) || entry.representedWeight <= 0)
  ) throw new Error("Population exposure requires prior delivery and positive distinct target cohorts.");
  const delivery = state.deliveries.find((entry) => entry.id === configuration.exposure.deliveryId)!;
  const marked = markBoundaryProcessed(state, configuration.exposure.boundaryId, at);
  return {
    ...marked,
    exposures: [...marked.exposures, {
      id: configuration.exposure.id,
      deliveryId: delivery.id,
      informationItemId: delivery.informationItemId,
      cohortIds: cohortWeights.map((entry) => entry.id),
      representedWeight: cohortWeights.reduce((sum, entry) => sum + entry.representedWeight, 0),
      exposedAt: at,
      causeDeliveryId: delivery.id,
      classification: configuration.exposure.classification,
    }],
  };
};

export const recordIntegratedPopulationResponses = (
  state: IntegratedInformationRuntimeState,
  configuration: IntegratedInformationConfiguration,
  responses: readonly IntegratedPopulationResponseRecord[],
  at: string,
): IntegratedInformationRuntimeState => {
  const exposure = state.exposures.find((entry) => entry.id === configuration.response.exposureId);
  if (
    exposure === undefined || responses.length !== exposure.cohortIds.length ||
    new Set(responses.map((entry) => entry.cohortId)).size !== responses.length ||
    responses.some((entry) => !exposure.cohortIds.includes(entry.cohortId) || entry.exposureId !== exposure.id || entry.appliedAt !== at)
  ) throw new Error("Population responses require the exact prior exposed cohort set.");
  const marked = markBoundaryProcessed(state, configuration.response.boundaryId, at);
  return { ...marked, responses: [...marked.responses, ...exactCopy(responses)] };
};

const requireUnique = (values: readonly string[], label: string): void => {
  if (new Set(values).size !== values.length) throw new Error(`${label} require unique identities.`);
};

export const assertIntegratedInformationRuntimeState = (
  state: IntegratedInformationRuntimeState,
  configuration: IntegratedInformationConfiguration,
  configuredBoundaries: readonly InstitutionalBoundaryConfiguration[],
): void => {
  if (
    state.schemaVersion !== configuration.schemaVersion || state.ownerId !== configuration.ownerId ||
    state.parameterHash !== configuration.parameterHash || state.semanticsVersion !== configuration.semanticsVersion ||
    state.responseRuleVersion !== configuration.responseRuleVersion || state.classification !== configuration.classification
  ) throw new Error("Information state contradicts configured authority.");
  const expectedBoundaries = configuredBoundaries
    .filter((boundary) => boundary.ownerId === configuration.ownerId)
    .map((boundary) => ({ id: boundary.id, at: boundary.at, kind: boundary.kind }));
  if (JSON.stringify(state.boundaries.map((boundary) => ({
    id: boundary.id, at: boundary.at, kind: boundary.kind,
  }))) !== JSON.stringify(expectedBoundaries)) {
    throw new Error("Information boundary state contradicts the configured scheduler.");
  }
  requireUnique(state.boundaries.map((entry) => entry.id), "Information boundaries");
  requireUnique(state.observations.map((entry) => entry.id), "Information observations");
  requireUnique(state.measurementArtifacts.map((entry) => entry.id), "Measurement artifacts");
  requireUnique(state.releases.map((entry) => entry.id), "Information releases");
  requireUnique(state.claims.map((entry) => entry.id), "Information claims");
  requireUnique(state.deliveries.map((entry) => entry.id), "Information deliveries");
  requireUnique(state.exposures.map((entry) => entry.id), "Population exposures");
  requireUnique(state.responses.map((entry) => entry.id), "Population responses");
  for (const process of state.measurementProcesses) {
    const measurement = configuration.measurements.find((entry) => entry.id === process.id);
    if (
      measurement === undefined || process.observationId !== measurement.observationId ||
      process.artifactId !== measurement.artifactId
    ) throw new Error(`Information measurement process ${process.id} contradicts configuration.`);
    const observations = state.observations.filter((entry) => entry.measurementId === process.id);
    const artifact = state.measurementArtifacts.find((entry) => entry.id === process.artifactId);
    const release = state.releases.find((entry) => entry.artifactId === process.artifactId);
    const expectedStatus = release !== undefined ? "RELEASED" : artifact !== undefined ? "CREATED" : observations.length > 0 ? "OBSERVED" : "SCHEDULED";
    if (process.status !== expectedStatus) throw new Error(`Information measurement ${process.id} has contradictory stage state.`);
    for (const observation of observations) {
      if (
        observation.captureOwnerInstitutionId !== measurement.producerInstitutionId ||
        observation.methodVersion !== measurement.methodVersion ||
        observation.observationMode !== measurement.observationMode ||
        observation.observationSemanticVersion !== measurement.observationSemanticVersion ||
        observation.capturedAt !== boundaryFor(state, measurement.observationBoundaryId).at ||
        observation.observationEnd !== observation.capturedAt ||
        observation.observationStart !== addDays(observation.capturedAt, -measurement.observationIntervalDays) ||
        ![...measurement.housingRegionIds, ...measurement.housingProjectIds].includes(observation.subjectRef)
      ) throw new Error(`Information observation ${observation.id} contradicts its measurement authority.`);
    }
    if (artifact !== undefined && (
      artifact.sourceMeasurementId !== measurement.id || artifact.sourceInstitutionId !== measurement.producerInstitutionId ||
      artifact.methodologyVersion !== measurement.methodVersion ||
      artifact.observationMode !== measurement.observationMode ||
      artifact.observationSemanticVersion !== measurement.observationSemanticVersion ||
      artifact.approximationSemanticVersion !== measurement.approximationSemanticVersion ||
      artifact.createdAt !== boundaryFor(state, measurement.artifactBoundaryId).at ||
      JSON.stringify(artifact.sourceObservationIds) !== JSON.stringify(observations.map((entry) => entry.id))
    )) throw new Error(`Measurement artifact ${artifact.id} contradicts its observations.`);
    if (artifact !== undefined) {
      const expectedValues = observations.flatMap((observation) =>
        observation.variables.map((variable) => measuredValue(measurement, observation, variable)));
      if (JSON.stringify(artifact.measuredValues) !== JSON.stringify(expectedValues)) {
        throw new Error(`Measurement artifact ${artifact.id} contradicts captured values.`);
      }
    }
    if (release !== undefined && (
      release.releasedAt !== boundaryFor(state, measurement.releaseBoundaryId).at ||
      release.sourceInstitutionId !== measurement.producerInstitutionId || release.accessClass !== "PUBLIC"
    )) throw new Error(`Information release ${release.id} contradicts artifact availability.`);
  }
  for (const claim of state.claims) {
    if (
      claim.id !== configuration.claim.id || claim.position !== configuration.claim.position ||
      claim.subject !== configuration.claim.subject || claim.contentVersion !== configuration.claim.contentVersion ||
      claim.releasedAt !== boundaryFor(state, configuration.claim.boundaryId).at ||
      JSON.stringify(claim.evidenceArtifactIds) !== JSON.stringify(configuration.claim.evidenceArtifactIds) ||
      claim.evidenceArtifactIds.some((id) => !state.releases.some((release) => release.artifactId === id))
    ) throw new Error("Information claim contradicts its configured evidence or claimant content.");
  }
  for (const delivery of state.deliveries) {
    if (
      delivery.id !== configuration.delivery.id || delivery.informationItemId !== configuration.delivery.informationItemId ||
      delivery.channelId !== configuration.delivery.channelId || delivery.audienceCatchmentId !== configuration.delivery.audienceCatchmentId ||
      delivery.deliveredAt !== boundaryFor(state, configuration.delivery.boundaryId).at ||
      !state.claims.some((claim) => claim.id === delivery.informationItemId)
    ) throw new Error("Information delivery contradicts its configured released item or channel.");
  }
  for (const exposure of state.exposures) {
    if (
      exposure.id !== configuration.exposure.id || exposure.deliveryId !== configuration.exposure.deliveryId ||
      exposure.causeDeliveryId !== exposure.deliveryId || exposure.exposedAt !== boundaryFor(state, configuration.exposure.boundaryId).at ||
      !state.deliveries.some((delivery) => delivery.id === exposure.deliveryId && delivery.informationItemId === exposure.informationItemId)
    ) throw new Error("Population exposure contradicts its configured delivery cause.");
  }
};
