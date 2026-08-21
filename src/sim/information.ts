import { FEDERAL_HOUSING_ADMINISTRATION_INSTITUTION_ID } from "./administration";
import type { HousingState } from "./housing";
import type { SimulationInstant } from "./world";

export const OFFICIAL_HOUSING_MEASUREMENT_ID = "gl0-official-housing-measurement";
export const OFFICIAL_HOUSING_REPORT_ID = "gl0-official-housing-report";
export const HOUSING_MEASUREMENT_OBSERVATION_START = 0;
export const HOUSING_MEASUREMENT_OBSERVATION_END = 30;
export const OFFICIAL_HOUSING_REPORT_RELEASE_AT = 40;
export const ADMINISTRATION_HOUSING_CLAIM_ID = "gl0-administration-housing-claim";
export const OPPOSITION_HOUSING_CLAIM_ID = "gl0-opposition-housing-claim";
export const ADMINISTRATION_HOUSING_CLAIM_RELEASE_AT = 41;
export const OPPOSITION_HOUSING_CLAIM_RELEASE_AT = 42;

export const PUBLIC_AUDIENCE_ALPHA_ID = "PUBLIC_AUDIENCE_ALPHA";
export const PUBLIC_AUDIENCE_BETA_ID = "PUBLIC_AUDIENCE_BETA";
export const PUBLIC_AUDIENCE_GAMMA_ID = "PUBLIC_AUDIENCE_GAMMA";

export type PublicAudienceId =
  | typeof PUBLIC_AUDIENCE_ALPHA_ID
  | typeof PUBLIC_AUDIENCE_BETA_ID
  | typeof PUBLIC_AUDIENCE_GAMMA_ID;

export type PoliticalClaimPosition = "PROGRAM_WORKING" | "PROGRAM_INADEQUATE";

export type PoliticalClaimOrigin =
  | {
      readonly originType: "POLITICAL_ACTOR";
      readonly speakerActorId: string;
      readonly speakerInstitutionId: null;
    }
  | {
      readonly originType: "INSTITUTION";
      readonly speakerActorId: null;
      readonly speakerInstitutionId: string;
    };

/** A political owner has selected a bounded claim intent; Information has not emitted it yet. */
export type PoliticalClaimDecision = PoliticalClaimOrigin & {
  readonly claimArtifactId: string;
  readonly sourceArtifactIds: readonly string[];
  readonly claimSubject: "HOUSING_GRANT_PROGRAM_PERFORMANCE";
  readonly claimPosition: PoliticalClaimPosition;
  readonly decidedAtSimulationTime: SimulationInstant;
};

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

/** Canonical communicative artifact. Its position is an interpretation, not Housing truth. */
export type PoliticalClaimArtifact = PoliticalClaimOrigin & {
  readonly id: string;
  readonly artifactType: "POLITICAL_CLAIM";
  readonly sourceArtifactIds: readonly string[];
  readonly claimSubject: "HOUSING_GRANT_PROGRAM_PERFORMANCE";
  readonly claimPosition: PoliticalClaimPosition;
  readonly createdAtSimulationTime: SimulationInstant;
  readonly releasedAtSimulationTime: SimulationInstant;
  readonly accessClass: "PUBLIC";
};

/** Temporary GL0 distribution fixture only; this audience is not PopulationState. */
export interface InformationExposure {
  readonly id: string;
  readonly artifactId: string;
  readonly audienceId: PublicAudienceId;
  readonly exposedAtSimulationTime: SimulationInstant;
}

export interface InformationState {
  readonly housingMeasurement: HousingMeasurementProcess;
  readonly artifacts: readonly OfficialHousingReport[];
  readonly politicalClaims: readonly PoliticalClaimArtifact[];
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
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "InformationArtifactExposed";
      readonly exposureId: string;
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

const findReleasedArtifact = (
  information: InformationState,
  artifactId: string,
): OfficialHousingReport | PoliticalClaimArtifact | null =>
  information.artifacts.find((artifact) => artifact.id === artifactId) ??
  information.politicalClaims.find((artifact) => artifact.id === artifactId) ??
  null;

export const releasePoliticalClaim = (
  information: InformationState,
  decision: PoliticalClaimDecision,
  at: SimulationInstant,
): InformationBoundaryResult => {
  if (decision.decidedAtSimulationTime !== at) {
    throw new Error("A political claim must be released at its canonical decision boundary.");
  }
  if (
    decision.sourceArtifactIds.length === 0 ||
    new Set(decision.sourceArtifactIds).size !== decision.sourceArtifactIds.length
  ) {
    throw new Error("A political claim requires distinct source artifact references.");
  }
  if (
    decision.sourceArtifactIds.length !== 1 ||
    decision.sourceArtifactIds[0] !== OFFICIAL_HOUSING_REPORT_ID
  ) {
    throw new Error("The bounded Housing claim must reference the official Housing report.");
  }
  if (
    information.politicalClaims.some((claim) => claim.id === decision.claimArtifactId) ||
    information.artifacts.some((artifact) => artifact.id === decision.claimArtifactId)
  ) {
    throw new Error(`Information artifact ${decision.claimArtifactId} already exists.`);
  }

  for (const sourceArtifactId of decision.sourceArtifactIds) {
    const source = findReleasedArtifact(information, sourceArtifactId);
    if (source === null || source.releasedAtSimulationTime > at) {
      throw new Error(
        `Political claim ${decision.claimArtifactId} cannot reference unreleased artifact ${sourceArtifactId}.`,
      );
    }
  }

  const origin: PoliticalClaimOrigin =
    decision.originType === "POLITICAL_ACTOR"
      ? {
          originType: decision.originType,
          speakerActorId: decision.speakerActorId,
          speakerInstitutionId: null,
        }
      : {
          originType: decision.originType,
          speakerActorId: null,
          speakerInstitutionId: decision.speakerInstitutionId,
        };
  const claim: PoliticalClaimArtifact = {
    ...origin,
    id: decision.claimArtifactId,
    artifactType: "POLITICAL_CLAIM",
    sourceArtifactIds: [...decision.sourceArtifactIds],
    claimSubject: decision.claimSubject,
    claimPosition: decision.claimPosition,
    createdAtSimulationTime: at,
    releasedAtSimulationTime: at,
    accessClass: "PUBLIC",
  };

  return {
    information: {
      ...information,
      politicalClaims: [...information.politicalClaims, claim],
    },
    occurrences: [{ type: "PoliticalClaimReleased", artifactId: claim.id, at }],
  };
};

export const exposeInformationArtifact = (
  information: InformationState,
  artifactId: string,
  audienceId: PublicAudienceId,
  at: SimulationInstant,
): InformationBoundaryResult => {
  if (
    information.exposures.some(
      (exposure) => exposure.artifactId === artifactId && exposure.audienceId === audienceId,
    )
  ) {
    throw new Error(`Artifact ${artifactId} was already exposed to ${audienceId}.`);
  }

  const artifact = findReleasedArtifact(information, artifactId);
  if (artifact === null) {
    throw new Error(`Cannot expose nonexistent information artifact ${artifactId}.`);
  }
  if (artifact.releasedAtSimulationTime > at) {
    throw new Error(`Cannot expose information artifact ${artifactId} before its release.`);
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
    occurrences: [{ type: "InformationArtifactExposed", exposureId: exposure.id, at }],
  };
};

const exposeIfMissing = (
  result: InformationBoundaryResult,
  artifactId: string,
  audienceId: PublicAudienceId,
  at: SimulationInstant,
): InformationBoundaryResult => {
  if (
    result.information.exposures.some(
      (exposure) => exposure.artifactId === artifactId && exposure.audienceId === audienceId,
    )
  ) {
    return result;
  }
  const exposure = exposeInformationArtifact(result.information, artifactId, audienceId, at);
  return {
    information: exposure.information,
    occurrences: [...result.occurrences, ...exposure.occurrences],
  };
};

const releaseClaimIfMissing = (
  result: InformationBoundaryResult,
  decision: PoliticalClaimDecision,
  at: SimulationInstant,
): InformationBoundaryResult => {
  if (result.information.politicalClaims.some((claim) => claim.id === decision.claimArtifactId)) {
    return result;
  }
  const release = releasePoliticalClaim(result.information, decision, at);
  return {
    information: release.information,
    occurrences: [...result.occurrences, ...release.occurrences],
  };
};

/**
 * Resolves the bounded measurement, release, claim, and exposure boundaries
 * after Housing has stabilized at the same timestamp. No live Housing
 * reference is retained, and same-time release causally precedes exposure.
 */
export const resolveInformationBoundary = (
  information: InformationState,
  housing: HousingState,
  at: SimulationInstant,
  politicalClaimDecision: PoliticalClaimDecision | null = null,
): InformationBoundaryResult => {
  if (at === information.housingMeasurement.observationEnd) {
    return captureHousingMeasurement(information, housing, at);
  }
  if (at === information.housingMeasurement.scheduledReleaseAtSimulationTime) {
    const release = releaseOfficialHousingReport(information, at);
    const alphaExposure = exposeIfMissing(
      release,
      OFFICIAL_HOUSING_REPORT_ID,
      PUBLIC_AUDIENCE_ALPHA_ID,
      at,
    );
    return exposeIfMissing(
      alphaExposure,
      OFFICIAL_HOUSING_REPORT_ID,
      PUBLIC_AUDIENCE_BETA_ID,
      at,
    );
  }
  if (politicalClaimDecision !== null) {
    const release = releaseClaimIfMissing(
      { information, occurrences: [] },
      politicalClaimDecision,
      at,
    );
    const firstAudience =
      politicalClaimDecision.claimArtifactId === ADMINISTRATION_HOUSING_CLAIM_ID
        ? PUBLIC_AUDIENCE_ALPHA_ID
        : politicalClaimDecision.claimArtifactId === OPPOSITION_HOUSING_CLAIM_ID
          ? PUBLIC_AUDIENCE_BETA_ID
          : null;
    if (firstAudience === null) {
      throw new Error(`Unsupported GL0 political claim ${politicalClaimDecision.claimArtifactId}.`);
    }
    const firstExposure = exposeIfMissing(
      release,
      politicalClaimDecision.claimArtifactId,
      firstAudience,
      at,
    );
    return exposeIfMissing(
      firstExposure,
      politicalClaimDecision.claimArtifactId,
      PUBLIC_AUDIENCE_GAMMA_ID,
      at,
    );
  }
  return { information, occurrences: [] };
};
