import { FEDERAL_HOUSING_ADMINISTRATION_INSTITUTION_ID } from "./administration";
import type { HousingState } from "./housing";
import type { SimulationInstant } from "./world";

export const OFFICIAL_HOUSING_MEASUREMENT_ID = "gl0-official-housing-measurement";
export const OFFICIAL_HOUSING_REPORT_ID = "gl0-official-housing-report";
export const HOUSING_MEASUREMENT_OBSERVATION_START = 0;
export const HOUSING_MEASUREMENT_OBSERVATION_END = 30;
export const OFFICIAL_HOUSING_REPORT_RELEASE_AT = 40;

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

export interface InformationState {
  readonly housingMeasurement: HousingMeasurementProcess;
  readonly artifacts: readonly OfficialHousingReport[];
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
