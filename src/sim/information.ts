import type { HousingState } from "./housing";
import type { SimulationInstant } from "./world";
import type { IntegratedInformationConfiguration } from "../configuration/types";

export type HousingMeasurementStatus = "SCHEDULED" | "CAPTURED" | "COMPLETED";

/** A fixed observation captured by Information from one canonical Housing region. */
export interface HousingRegionalObservation {
  readonly housingRegionId: string;
  readonly housingStockUnits: number;
  readonly affordabilityPressure: number;
}

/** Canonical committed result of the bounded measurement. */
export interface HousingMeasurementResult {
  readonly committedAtSimulationTime: SimulationInstant;
  readonly regionalObservations: readonly HousingRegionalObservation[];
}

export interface HousingMeasurementProcess {
  readonly id: string;
  readonly reportArtifactId: string;
  readonly housingRegionIds: readonly string[];
  readonly observationStart: SimulationInstant;
  readonly observationEnd: SimulationInstant;
  readonly scheduledReleaseAtSimulationTime: SimulationInstant;
  readonly producerInstitutionId: string;
  readonly status: HousingMeasurementStatus;
  readonly capturedAtSimulationTime: SimulationInstant | null;
  readonly result: HousingMeasurementResult | null;
}

export interface OfficialHousingReport {
  readonly id: string;
  readonly artifactType: "OFFICIAL_HOUSING_REPORT";
  readonly sourceMeasurementId: string;
  readonly producerInstitutionId: string;
  readonly asOfStart: SimulationInstant;
  readonly asOfEnd: SimulationInstant;
  readonly createdAtSimulationTime: SimulationInstant;
  readonly releasedAtSimulationTime: SimulationInstant;
  readonly accessClass: "PUBLIC";
  readonly regionalResults: readonly HousingRegionalObservation[];
}

export type PoliticalClaimPosition = "PROGRAM_WORKING" | "PROGRAM_INADEQUATE";

export type PoliticalClaimOrigin =
  | {
      readonly originType: "ADMINISTRATION";
      readonly administrationId: string;
    }
  | {
      readonly originType: "ACTOR";
      readonly actorId: string;
    };

/** Information-owned public interpretation, never Housing or report truth. */
export interface PoliticalClaimArtifact {
  readonly id: string;
  readonly artifactType: "POLITICAL_CLAIM";
  readonly sourceDecisionId: string;
  readonly origin: PoliticalClaimOrigin;
  readonly sourceArtifactIds: readonly string[];
  readonly federalProgramId: string;
  readonly claimSubject: "HOUSING_GRANT_PROGRAM_PERFORMANCE";
  readonly claimPosition: PoliticalClaimPosition;
  readonly createdAtSimulationTime: SimulationInstant;
  readonly releasedAtSimulationTime: SimulationInstant;
  readonly accessClass: "PUBLIC";
}

/** Configured distribution target; explicitly not a Population subject. */
export interface InformationAudience {
  readonly id: string;
  readonly audienceType: string;
}

/** Receipt only: this record owns no belief, attribution, or preference. */
export interface InformationExposure {
  readonly id: string;
  readonly artifactId: string;
  readonly audienceId: string;
  readonly exposedAtSimulationTime: SimulationInstant;
}

export interface PoliticalClaimReleaseInput {
  readonly claimArtifactId: string;
  readonly sourceDecisionId: string;
  readonly origin: PoliticalClaimOrigin;
  readonly sourceArtifactIds: readonly string[];
  readonly federalProgramId: string;
  readonly claimPosition: PoliticalClaimPosition;
}

export interface InformationState {
  readonly housingMeasurement: HousingMeasurementProcess;
  readonly artifacts: readonly OfficialHousingReport[];
  readonly politicalClaims: readonly PoliticalClaimArtifact[];
  readonly audiences: readonly InformationAudience[];
  readonly exposures: readonly InformationExposure[];
}

export type InformationOccurrence =
  | {
      readonly type: "HousingMeasurementCaptured";
      readonly measurementId: string;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "OfficialHousingReportReleased";
      readonly artifactId: string;
      readonly sourceMeasurementId: string;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "PoliticalClaimReleased";
      readonly artifactId: string;
      readonly sourceDecisionId: string;
      readonly claimPosition: PoliticalClaimPosition;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "InformationArtifactExposed";
      readonly artifactId: string;
      readonly audienceId: string;
      readonly at: SimulationInstant;
    };

export interface InformationBoundaryResult {
  readonly information: InformationState;
  readonly occurrences: readonly InformationOccurrence[];
}

export const createInformationState = (
  housingMeasurement: HousingMeasurementProcess,
  audiences: readonly InformationAudience[],
): InformationState => {
  if (
    housingMeasurement.housingRegionIds.length === 0 ||
    new Set(housingMeasurement.housingRegionIds).size !==
      housingMeasurement.housingRegionIds.length
  ) {
    throw new Error("Official Housing measurement requires distinct Housing region IDs.");
  }
  if (new Set(audiences.map((audience) => audience.id)).size !== audiences.length) {
    throw new Error("Information audience identities must be unique.");
  }
  return {
    housingMeasurement: {
      ...housingMeasurement,
      housingRegionIds: [...housingMeasurement.housingRegionIds],
    },
    artifacts: [],
    politicalClaims: [],
    audiences: audiences.map((audience) => ({ ...audience })),
    exposures: [],
  };
};

const captureHousingMeasurement = (
  information: InformationState,
  housing: HousingState,
  at: SimulationInstant,
): InformationBoundaryResult => {
  const process = information.housingMeasurement;
  if (process.status !== "SCHEDULED") {
    return { information, occurrences: [] };
  }

  const regionalObservations = process.housingRegionIds.map((housingRegionId) => {
    const matches = housing.regions.filter((region) => region.id === housingRegionId);
    if (matches.length !== 1) {
      throw new Error(
        `Official Housing measurement requires exactly one region ${housingRegionId}; found ${matches.length}.`,
      );
    }
    const region = matches[0];
    return {
      housingRegionId: region.id,
      housingStockUnits: region.housingStockUnits,
      affordabilityPressure: region.affordabilityPressure,
    };
  });

  return {
    information: {
      ...information,
      housingMeasurement: {
        ...process,
        status: "CAPTURED",
        capturedAtSimulationTime: at,
        result: {
          committedAtSimulationTime: at,
          regionalObservations,
        },
      },
    },
    occurrences: [
      {
        type: "HousingMeasurementCaptured",
        measurementId: process.id,
        at,
      },
    ],
  };
};

const releaseOfficialHousingReport = (
  information: InformationState,
  at: SimulationInstant,
): InformationBoundaryResult => {
  const process = information.housingMeasurement;
  if (process.status === "COMPLETED") {
    return { information, occurrences: [] };
  }
  if (process.status !== "CAPTURED" || process.result === null) {
    throw new Error("Official Housing report cannot be released before measurement capture.");
  }
  if (information.artifacts.some((artifact) => artifact.id === process.reportArtifactId)) {
    throw new Error(`Information artifact ${process.reportArtifactId} already exists.`);
  }

  const report: OfficialHousingReport = {
    id: process.reportArtifactId,
    artifactType: "OFFICIAL_HOUSING_REPORT",
    sourceMeasurementId: process.id,
    producerInstitutionId: process.producerInstitutionId,
    asOfStart: process.observationStart,
    asOfEnd: process.observationEnd,
    createdAtSimulationTime: at,
    releasedAtSimulationTime: at,
    accessClass: "PUBLIC",
    regionalResults: process.result.regionalObservations.map((observation) => ({
      ...observation,
    })),
  };

  return {
    information: {
      ...information,
      housingMeasurement: { ...process, status: "COMPLETED" },
      artifacts: [...information.artifacts, report],
    },
    occurrences: [
      {
        type: "OfficialHousingReportReleased",
        artifactId: report.id,
        sourceMeasurementId: process.id,
        at,
      },
    ],
  };
};

/**
 * Resolves only the two bounded information boundaries after Housing has
 * stabilized at the same timestamp. No live Housing reference is retained.
 */
export const resolveInformationBoundary = (
  information: InformationState,
  housing: HousingState,
  at: SimulationInstant,
): InformationBoundaryResult => {
  if (at === information.housingMeasurement.observationEnd) {
    return captureHousingMeasurement(information, housing, at);
  }
  if (at === information.housingMeasurement.scheduledReleaseAtSimulationTime) {
    return releaseOfficialHousingReport(information, at);
  }
  return { information, occurrences: [] };
};

const resolveReleasedArtifact = (
  information: InformationState,
  artifactId: string,
): OfficialHousingReport | PoliticalClaimArtifact | null =>
  information.artifacts.find((artifact) => artifact.id === artifactId) ??
  information.politicalClaims.find((artifact) => artifact.id === artifactId) ??
  null;

/** Information's admission boundary for a political source's claim decision. */
export const releasePoliticalClaim = (
  information: InformationState,
  input: PoliticalClaimReleaseInput,
  at: SimulationInstant,
): InformationBoundaryResult => {
  if (!Number.isFinite(at)) {
    throw new Error("Political claim release time must be finite.");
  }
  if (
    information.politicalClaims.some(
      (claim) => claim.id === input.claimArtifactId || claim.sourceDecisionId === input.sourceDecisionId,
    )
  ) {
    throw new Error(`Political claim ${input.claimArtifactId} already exists.`);
  }
  if (input.sourceArtifactIds.length !== 1) {
    throw new Error("A supported political claim requires exactly one source artifact.");
  }

  const source = information.artifacts.find(
    (artifact) => artifact.id === input.sourceArtifactIds[0],
  );
  if (source === undefined) {
    throw new Error(
      `Political claim ${input.claimArtifactId} references a nonexistent official report.`,
    );
  }
  if (source.releasedAtSimulationTime > at) {
    throw new Error(
      `Political claim ${input.claimArtifactId} cannot precede source report release.`,
    );
  }

  const claim: PoliticalClaimArtifact = {
    id: input.claimArtifactId,
    artifactType: "POLITICAL_CLAIM",
    sourceDecisionId: input.sourceDecisionId,
    origin: input.origin,
    sourceArtifactIds: [...input.sourceArtifactIds],
    federalProgramId: input.federalProgramId,
    claimSubject: "HOUSING_GRANT_PROGRAM_PERFORMANCE",
    claimPosition: input.claimPosition,
    createdAtSimulationTime: at,
    releasedAtSimulationTime: at,
    accessClass: "PUBLIC",
  };

  return {
    information: {
      ...information,
      politicalClaims: [...information.politicalClaims, claim],
    },
    occurrences: [
      {
        type: "PoliticalClaimReleased",
        artifactId: claim.id,
        sourceDecisionId: claim.sourceDecisionId,
        claimPosition: claim.claimPosition,
        at,
      },
    ],
  };
};

/** Information-owned exposure mutation; PUBLIC availability is not receipt. */
export const exposeInformationArtifact = (
  information: InformationState,
  exposureId: string,
  artifactId: string,
  audienceId: string,
  at: SimulationInstant,
): InformationBoundaryResult => {
  if (!Number.isFinite(at)) {
    throw new Error("Information exposure time must be finite.");
  }
  const artifact = resolveReleasedArtifact(information, artifactId);
  if (artifact === null) {
    throw new Error(`Cannot expose unknown information artifact ${artifactId}.`);
  }
  if (!information.audiences.some((audience) => audience.id === audienceId)) {
    throw new Error(`Cannot expose information to unknown audience ${audienceId}.`);
  }
  if (artifact.releasedAtSimulationTime > at) {
    throw new Error(`Information artifact ${artifactId} cannot be exposed before release.`);
  }
  if (
    information.exposures.some(
      (exposure) => exposure.artifactId === artifactId && exposure.audienceId === audienceId,
    )
  ) {
    throw new Error(`Information artifact ${artifactId} was already exposed to ${audienceId}.`);
  }

  const exposure: InformationExposure = {
    id: exposureId,
    artifactId,
    audienceId,
    exposedAtSimulationTime: at,
  };

  return {
    information: {
      ...information,
      exposures: [...information.exposures, exposure],
    },
    occurrences: [
      {
        type: "InformationArtifactExposed",
        artifactId,
        audienceId,
        at,
      },
    ],
  };
};

export interface IntegratedInformationObservation {
  readonly referentId: string;
  readonly measure: string;
  readonly value: number | string;
  readonly actualValue: number | string | null;
  readonly method: string;
  readonly classification: string;
}

export interface IntegratedMeasurementState {
  readonly id: string;
  readonly measurementKind: "ADMINISTRATIVE_RECORD" | "MATERIAL_STATISTICAL";
  readonly artifactId: string;
  readonly producerId: string;
  readonly referentIds: readonly string[];
  readonly status: "SCHEDULED" | "CAPTURED" | "RELEASED";
  readonly capturedAt: string | null;
  readonly releasedAt: string | null;
  readonly observations: readonly IntegratedInformationObservation[];
  readonly classification: string;
}

export interface IntegratedInformationArtifact {
  readonly id: string;
  readonly kind: "ADMINISTRATIVE_RECORD" | "STATISTICAL_REPORT" | "PUBLIC_CLAIM";
  readonly sourceMeasurementId: string | null;
  readonly sourceArtifactIds: readonly string[];
  readonly producerId: string;
  readonly subject: string;
  readonly assertion: string | null;
  readonly observations: readonly IntegratedInformationObservation[];
  readonly createdAt: string;
  readonly releasedAt: string;
  readonly accessClass: "PUBLIC";
  readonly classification: string;
}

export interface IntegratedInformationDelivery {
  readonly id: string;
  readonly artifactId: string;
  readonly channel: string;
  readonly deliveredAt: string;
}

export interface IntegratedPopulationExposure {
  readonly id: string;
  readonly deliveryId: string;
  readonly artifactId: string;
  readonly subjectCohortIds: readonly string[];
  readonly exposedAt: string;
}

export interface IntegratedPopulationResponseRecord {
  readonly id: string;
  readonly exposureId: string;
  readonly cohortIds: readonly string[];
  readonly belief: string;
  readonly attribution: string;
  readonly salience: string;
  readonly candidatePreference: string;
  readonly turnoutDisposition: string;
  readonly appliedAt: string;
  readonly classification: string;
}

export interface IntegratedInformationRuntimeState {
  readonly schemaVersion: number;
  readonly parameterHash: string;
  readonly semanticsVersion: string;
  readonly measurements: readonly IntegratedMeasurementState[];
  readonly artifacts: readonly IntegratedInformationArtifact[];
  readonly deliveries: readonly IntegratedInformationDelivery[];
  readonly exposures: readonly IntegratedPopulationExposure[];
  readonly responses: readonly IntegratedPopulationResponseRecord[];
}

const validInstant = (value: string, label: string): void => {
  if (!Number.isFinite(Date.parse(value))) throw new Error(`${label} must be a valid configured instant.`);
};

export const createIntegratedInformationRuntimeState = (
  configuration: IntegratedInformationConfiguration,
): IntegratedInformationRuntimeState => ({
  schemaVersion: configuration.schemaVersion,
  parameterHash: configuration.parameterHash,
  semanticsVersion: configuration.semanticsVersion,
  measurements: configuration.measurements.map((measurement) => ({
    id: measurement.id,
    measurementKind: measurement.measurementKind,
    artifactId: measurement.artifactId,
    producerId: measurement.producerId,
    referentIds: [...measurement.referentIds],
    status: "SCHEDULED",
    capturedAt: null,
    releasedAt: null,
    observations: [],
    classification: measurement.classification,
  })),
  artifacts: [],
  deliveries: [],
  exposures: [],
  responses: [],
});

export const captureIntegratedMeasurement = (
  state: IntegratedInformationRuntimeState,
  measurementId: string,
  observations: readonly IntegratedInformationObservation[],
  at: string,
): IntegratedInformationRuntimeState => {
  validInstant(at, "Measurement capture");
  const measurement = state.measurements.find((candidate) => candidate.id === measurementId);
  if (measurement === undefined || measurement.status !== "SCHEDULED") {
    throw new Error(`Measurement ${measurementId} is unavailable for capture.`);
  }
  if (
    observations.length === 0 ||
    observations.some((observation) => !measurement.referentIds.includes(observation.referentId)) ||
    new Set(observations.map((observation) => `${observation.referentId}|${observation.measure}`)).size !== observations.length
  ) throw new Error(`Measurement ${measurementId} has invalid captured observations.`);
  return {
    ...state,
    measurements: state.measurements.map((candidate) => candidate.id === measurementId ? {
      ...candidate,
      status: "CAPTURED" as const,
      capturedAt: at,
      observations: observations.map((observation) => ({ ...observation })),
    } : candidate),
  };
};

export const releaseIntegratedMeasurement = (
  state: IntegratedInformationRuntimeState,
  measurementId: string,
  at: string,
): IntegratedInformationRuntimeState => {
  validInstant(at, "Measurement release");
  const measurement = state.measurements.find((candidate) => candidate.id === measurementId);
  if (measurement === undefined || measurement.status !== "CAPTURED" || measurement.capturedAt === null) {
    throw new Error(`Measurement ${measurementId} cannot release before capture.`);
  }
  if (Date.parse(at) < Date.parse(measurement.capturedAt) || state.artifacts.some((artifact) => artifact.id === measurement.artifactId)) {
    throw new Error(`Measurement ${measurementId} has invalid release ordering or duplicate artifact identity.`);
  }
  const kind = measurement.measurementKind === "ADMINISTRATIVE_RECORD" ? "ADMINISTRATIVE_RECORD" : "STATISTICAL_REPORT";
  const artifact: IntegratedInformationArtifact = {
    id: measurement.artifactId,
    kind,
    sourceMeasurementId: measurement.id,
    sourceArtifactIds: [],
    producerId: measurement.producerId,
    subject: measurement.measurementKind,
    assertion: null,
    observations: measurement.observations.map((observation) => ({ ...observation })),
    createdAt: at,
    releasedAt: at,
    accessClass: "PUBLIC",
    classification: measurement.classification,
  };
  return {
    ...state,
    measurements: state.measurements.map((candidate) => candidate.id === measurementId
      ? { ...candidate, status: "RELEASED" as const, releasedAt: at }
      : candidate),
    artifacts: [...state.artifacts, artifact],
  };
};

export const releaseIntegratedClaim = (
  state: IntegratedInformationRuntimeState,
  input: {
    readonly id: string;
    readonly sourceArtifactIds: readonly string[];
    readonly producerId: string;
    readonly subject: string;
    readonly assertion: string;
    readonly classification: string;
  },
  at: string,
): IntegratedInformationRuntimeState => {
  validInstant(at, "Claim release");
  const sources = input.sourceArtifactIds.map((id) => state.artifacts.find((artifact) => artifact.id === id));
  if (
    state.artifacts.some((artifact) => artifact.id === input.id) ||
    sources.some((source) => source === undefined || Date.parse(source.releasedAt) > Date.parse(at))
  ) throw new Error("Public claim requires released source artifacts and a unique identity.");
  return {
    ...state,
    artifacts: [...state.artifacts, {
      id: input.id,
      kind: "PUBLIC_CLAIM",
      sourceMeasurementId: null,
      sourceArtifactIds: [...input.sourceArtifactIds],
      producerId: input.producerId,
      subject: input.subject,
      assertion: input.assertion,
      observations: [],
      createdAt: at,
      releasedAt: at,
      accessClass: "PUBLIC",
      classification: input.classification,
    }],
  };
};

export const deliverIntegratedArtifact = (
  state: IntegratedInformationRuntimeState,
  input: { readonly id: string; readonly artifactId: string; readonly channel: string },
  at: string,
): IntegratedInformationRuntimeState => {
  const artifact = state.artifacts.find((candidate) => candidate.id === input.artifactId);
  if (
    artifact === undefined || Date.parse(artifact.releasedAt) > Date.parse(at) ||
    state.deliveries.some((delivery) => delivery.id === input.id)
  ) throw new Error("Information delivery requires an available artifact and unique identity.");
  return { ...state, deliveries: [...state.deliveries, { ...input, deliveredAt: at }] };
};

export const recordIntegratedExposure = (
  state: IntegratedInformationRuntimeState,
  input: { readonly id: string; readonly deliveryId: string; readonly subjectCohortIds: readonly string[] },
  at: string,
): IntegratedInformationRuntimeState => {
  const delivery = state.deliveries.find((candidate) => candidate.id === input.deliveryId);
  if (
    delivery === undefined || Date.parse(delivery.deliveredAt) > Date.parse(at) ||
    input.subjectCohortIds.length === 0 || new Set(input.subjectCohortIds).size !== input.subjectCohortIds.length ||
    state.exposures.some((exposure) => exposure.id === input.id)
  ) throw new Error("Information exposure requires prior delivery and distinct targeted subjects.");
  return {
    ...state,
    exposures: [...state.exposures, {
      id: input.id,
      deliveryId: input.deliveryId,
      artifactId: delivery.artifactId,
      subjectCohortIds: [...input.subjectCohortIds],
      exposedAt: at,
    }],
  };
};

export const recordIntegratedPopulationResponse = (
  state: IntegratedInformationRuntimeState,
  response: IntegratedPopulationResponseRecord,
): IntegratedInformationRuntimeState => {
  const exposure = state.exposures.find((candidate) => candidate.id === response.exposureId);
  if (
    exposure === undefined || Date.parse(exposure.exposedAt) > Date.parse(response.appliedAt) ||
    JSON.stringify([...response.cohortIds].sort()) !== JSON.stringify([...exposure.subjectCohortIds].sort()) ||
    state.responses.some((candidate) => candidate.id === response.id)
  ) throw new Error("Population response requires a prior matching exposure.");
  return { ...state, responses: [...state.responses, { ...response, cohortIds: [...response.cohortIds] }] };
};

export const assertIntegratedInformationRuntimeState = (
  state: IntegratedInformationRuntimeState,
  configuration: IntegratedInformationConfiguration,
): void => {
  if (
    state.schemaVersion !== configuration.schemaVersion ||
    state.parameterHash !== configuration.parameterHash ||
    state.semanticsVersion !== configuration.semanticsVersion ||
    state.measurements.length !== configuration.measurements.length ||
    new Set(state.artifacts.map((artifact) => artifact.id)).size !== state.artifacts.length ||
    new Set(state.deliveries.map((delivery) => delivery.id)).size !== state.deliveries.length ||
    new Set(state.exposures.map((exposure) => exposure.id)).size !== state.exposures.length ||
    new Set(state.responses.map((response) => response.id)).size !== state.responses.length
  ) throw new Error("Information state contradicts configured identity or record ownership.");
  for (const measurement of state.measurements) {
    const configured = configuration.measurements.find((candidate) => candidate.id === measurement.id);
    if (
      configured === undefined || measurement.artifactId !== configured.artifactId ||
      measurement.measurementKind !== configured.measurementKind ||
      JSON.stringify(measurement.referentIds) !== JSON.stringify(configured.referentIds)
    ) throw new Error(`Information measurement ${measurement.id} contradicts configuration.`);
    const artifact = state.artifacts.find((candidate) => candidate.id === measurement.artifactId);
    if (artifact !== undefined && (
      artifact.sourceMeasurementId !== measurement.id || artifact.producerId !== measurement.producerId ||
      JSON.stringify(artifact.observations) !== JSON.stringify(measurement.observations) ||
      artifact.releasedAt !== measurement.releasedAt
    )) throw new Error(`Information artifact ${artifact.id} contradicts its captured measurement.`);
  }
  const claim = state.artifacts.find((artifact) => artifact.id === configuration.claim.id);
  if (claim !== undefined && (
    claim.kind !== "PUBLIC_CLAIM" || JSON.stringify(claim.sourceArtifactIds) !== JSON.stringify(configuration.claim.sourceArtifactIds) ||
    claim.subject !== configuration.claim.subject || claim.assertion !== configuration.claim.assertion
  )) throw new Error("Public claim artifact contradicts configured authored content.");
  for (const delivery of state.deliveries) {
    if (
      !state.artifacts.some((artifact) => artifact.id === delivery.artifactId) ||
      delivery.id !== configuration.delivery.id || delivery.artifactId !== configuration.delivery.artifactId ||
      delivery.channel !== configuration.delivery.channel
    ) throw new Error("Information delivery has no configured artifact/channel owner.");
  }
  for (const exposure of state.exposures) {
    const delivery = state.deliveries.find((candidate) => candidate.id === exposure.deliveryId);
    if (
      delivery?.artifactId !== exposure.artifactId || exposure.id !== configuration.exposure.id ||
      exposure.deliveryId !== configuration.exposure.deliveryId
    ) throw new Error("Information exposure contradicts its configured delivery.");
  }
  for (const response of state.responses) {
    const exposure = state.exposures.find((candidate) => candidate.id === response.exposureId);
    if (
      exposure === undefined || response.id !== configuration.response.id ||
      response.exposureId !== configuration.response.exposureId || response.belief !== configuration.response.belief ||
      response.salience !== configuration.response.salience || response.candidatePreference !== configuration.response.candidatePreference ||
      response.turnoutDisposition !== configuration.response.turnoutDisposition ||
      JSON.stringify([...exposure.subjectCohortIds].sort()) !== JSON.stringify([...response.cohortIds].sort())
    ) {
      throw new Error("Information response contradicts its recipient exposure.");
    }
  }
};
