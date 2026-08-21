import { FEDERAL_HOUSING_ADMINISTRATION_INSTITUTION_ID } from "./administration";
import type { HousingState } from "./housing";
import type { SimulationInstant } from "./world";

export const OFFICIAL_HOUSING_MEASUREMENT_ID = "gl0-official-housing-measurement";
export const OFFICIAL_HOUSING_REPORT_ID = "gl0-official-housing-report";
export const HOUSING_MEASUREMENT_OBSERVATION_START = 0;
export const HOUSING_MEASUREMENT_OBSERVATION_END = 30;
export const OFFICIAL_HOUSING_REPORT_RELEASE_AT = 40;
export const ADMINISTRATION_HOUSING_CLAIM_RELEASE_AT = 41;
export const OPPOSITION_HOUSING_CLAIM_RELEASE_AT = 42;
export const ADMINISTRATION_HOUSING_CLAIM_ID = "gl0-administration-housing-claim";
export const OPPOSITION_HOUSING_CLAIM_ID = "gl0-opposition-housing-claim";
export const PUBLIC_AUDIENCE_ALPHA_ID = "gl0-public-audience-alpha";
export const PUBLIC_AUDIENCE_BETA_ID = "gl0-public-audience-beta";
export const PUBLIC_AUDIENCE_GAMMA_ID = "gl0-public-audience-gamma";

export type HousingMeasurementStatus = "SCHEDULED" | "CAPTURED" | "COMPLETED";

/** A fixed observation captured by Information from one canonical Housing region. */
export interface HousingRegionalObservation {
  readonly housingRegionId: string;
  readonly housingStockUnits: number;
  readonly affordabilityPressure: number;
}

/** Canonical committed result of the bounded day-30 measurement. */
export interface HousingMeasurementResult {
  readonly committedAtSimulationTime: SimulationInstant;
  readonly regionalObservations: readonly HousingRegionalObservation[];
}

export interface HousingMeasurementProcess {
  readonly id: string;
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

/** Temporary GL0 distribution target; explicitly not a Population subject. */
export interface InformationAudience {
  readonly id: string;
  readonly audienceType: "GL0_SYNTHETIC_PUBLIC_DISTRIBUTION_FIXTURE";
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

export const createInitialInformationState = (
  housingRegionIds: readonly string[],
): InformationState => {
  if (housingRegionIds.length === 0 || new Set(housingRegionIds).size !== housingRegionIds.length) {
    throw new Error("Official Housing measurement requires distinct Housing region IDs.");
  }

  return {
    housingMeasurement: {
      id: OFFICIAL_HOUSING_MEASUREMENT_ID,
      housingRegionIds: [...housingRegionIds],
      observationStart: HOUSING_MEASUREMENT_OBSERVATION_START,
      observationEnd: HOUSING_MEASUREMENT_OBSERVATION_END,
      scheduledReleaseAtSimulationTime: OFFICIAL_HOUSING_REPORT_RELEASE_AT,
      producerInstitutionId: FEDERAL_HOUSING_ADMINISTRATION_INSTITUTION_ID,
      status: "SCHEDULED",
      capturedAtSimulationTime: null,
      result: null,
    },
    artifacts: [],
    politicalClaims: [],
    audiences: [
      {
        id: PUBLIC_AUDIENCE_ALPHA_ID,
        audienceType: "GL0_SYNTHETIC_PUBLIC_DISTRIBUTION_FIXTURE",
      },
      {
        id: PUBLIC_AUDIENCE_BETA_ID,
        audienceType: "GL0_SYNTHETIC_PUBLIC_DISTRIBUTION_FIXTURE",
      },
      {
        id: PUBLIC_AUDIENCE_GAMMA_ID,
        audienceType: "GL0_SYNTHETIC_PUBLIC_DISTRIBUTION_FIXTURE",
      },
    ],
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
  if (information.artifacts.some((artifact) => artifact.id === OFFICIAL_HOUSING_REPORT_ID)) {
    throw new Error(`Information artifact ${OFFICIAL_HOUSING_REPORT_ID} already exists.`);
  }

  const report: OfficialHousingReport = {
    id: OFFICIAL_HOUSING_REPORT_ID,
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
    throw new Error("The GL0 political claim requires exactly one source artifact.");
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
    id: `gl0-exposure-${artifactId}-to-${audienceId}`,
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
