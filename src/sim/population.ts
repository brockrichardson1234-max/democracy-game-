import type {
  InformationExposure,
  InformationState,
  PoliticalClaimPosition,
} from "./information";
import type { SimulationInstant } from "./world";

export const POPULATION_UNIT_A_ID = "gl0-population-unit-a";
export const POPULATION_UNIT_B_ID = "gl0-population-unit-b";
export const POPULATION_UNIT_C_ID = "gl0-population-unit-c";
export const GL0_POPULATION_UNIT_WEIGHT = 100;

export type BaselinePoliticalDisposition =
  | "ADMINISTRATION_LEAN"
  | "OPPOSITION_LEAN"
  | "SWING";

export type HousingPressureBelief = "UNKNOWN" | "LOW" | "MODERATE" | "HIGH";

export type ProgramPerformanceBelief =
  | "UNKNOWN"
  | "WORKING"
  | "INADEQUATE"
  | "MIXED"
  | "CONTESTED";

export interface HousingAttribution {
  readonly target: "UNKNOWN" | "FEDERAL_HOUSING_PROGRAM";
  readonly evaluation: "NONE" | "CREDIT" | "BLAME";
}

export type HousingSalience = "LOW" | "MEDIUM" | "HIGH";

/** One correlation-preserving ordinary-population aggregate, not an actor or audience. */
export interface PopulationUnit {
  readonly id: string;
  readonly weight: number;
  readonly residenceGeographyId: string;
  readonly housingRegionId: string;
  readonly informationAudienceId: string;
  readonly baselinePoliticalDisposition: BaselinePoliticalDisposition;
  readonly housingPressureBelief: HousingPressureBelief;
  readonly programPerformanceBelief: ProgramPerformanceBelief;
  readonly housingAttribution: HousingAttribution;
  readonly housingSalience: HousingSalience;
}

/** Population-owned proof that one recipient processed one Information exposure. */
export interface PopulationInformationIncorporation {
  readonly id: string;
  readonly populationUnitId: string;
  readonly exposureId: string;
  readonly artifactId: string;
  readonly incorporatedAtSimulationTime: SimulationInstant;
}

export interface PopulationState {
  readonly units: readonly PopulationUnit[];
  readonly informationIncorporations: readonly PopulationInformationIncorporation[];
}

export type PopulationOccurrence = {
  readonly type: "PopulationInformationIncorporated";
  readonly populationUnitId: string;
  readonly exposureId: string;
  readonly artifactId: string;
  readonly at: SimulationInstant;
};

export interface PopulationTransitionResult {
  readonly population: PopulationState;
  readonly occurrences: readonly PopulationOccurrence[];
}

export interface PopulationFixtureReferences {
  readonly geographyRegionAId: string;
  readonly geographyRegionBId: string;
  readonly geographyRegionCId: string;
  readonly housingRegionAId: string;
  readonly housingRegionBId: string;
  readonly housingRegionCId: string;
  readonly informationAudienceAlphaId: string;
  readonly informationAudienceBetaId: string;
  readonly informationAudienceGammaId: string;
}

const UNKNOWN_ATTRIBUTION: HousingAttribution = {
  target: "UNKNOWN",
  evaluation: "NONE",
};

/** Validates the few invariants needed by the bounded aggregate fixture. */
export const createPopulationState = (
  units: readonly PopulationUnit[],
): PopulationState => {
  if (units.some((unit) => !Number.isFinite(unit.weight) || unit.weight <= 0)) {
    throw new Error("Population unit weight must be positive and finite.");
  }
  if (new Set(units.map((unit) => unit.id)).size !== units.length) {
    throw new Error("Population unit IDs must be unique.");
  }
  if (new Set(units.map((unit) => unit.informationAudienceId)).size !== units.length) {
    throw new Error("Each GL0 Information audience must bind to exactly one Population unit.");
  }

  return {
    units: units.map((unit) => ({
      ...unit,
      housingAttribution: { ...unit.housingAttribution },
    })),
    informationIncorporations: [],
  };
};

export const createInitialPopulationState = (
  references: PopulationFixtureReferences,
): PopulationState =>
  createPopulationState([
    {
      id: POPULATION_UNIT_A_ID,
      weight: GL0_POPULATION_UNIT_WEIGHT,
      residenceGeographyId: references.geographyRegionAId,
      housingRegionId: references.housingRegionAId,
      informationAudienceId: references.informationAudienceGammaId,
      baselinePoliticalDisposition: "SWING",
      housingPressureBelief: "UNKNOWN",
      programPerformanceBelief: "UNKNOWN",
      housingAttribution: UNKNOWN_ATTRIBUTION,
      housingSalience: "LOW",
    },
    {
      id: POPULATION_UNIT_B_ID,
      weight: GL0_POPULATION_UNIT_WEIGHT,
      residenceGeographyId: references.geographyRegionBId,
      housingRegionId: references.housingRegionBId,
      informationAudienceId: references.informationAudienceBetaId,
      baselinePoliticalDisposition: "OPPOSITION_LEAN",
      housingPressureBelief: "UNKNOWN",
      programPerformanceBelief: "UNKNOWN",
      housingAttribution: UNKNOWN_ATTRIBUTION,
      housingSalience: "LOW",
    },
    {
      id: POPULATION_UNIT_C_ID,
      weight: GL0_POPULATION_UNIT_WEIGHT,
      residenceGeographyId: references.geographyRegionCId,
      housingRegionId: references.housingRegionCId,
      informationAudienceId: references.informationAudienceAlphaId,
      baselinePoliticalDisposition: "ADMINISTRATION_LEAN",
      housingPressureBelief: "UNKNOWN",
      programPerformanceBelief: "UNKNOWN",
      housingAttribution: UNKNOWN_ATTRIBUTION,
      housingSalience: "LOW",
    },
  ]);

/** Population's deliberately synthetic interpretation of reported pressure. */
export const categorizeReportedHousingPressure = (
  reportedPressure: number,
): Exclude<HousingPressureBelief, "UNKNOWN"> => {
  if (!Number.isFinite(reportedPressure) || reportedPressure < 0) {
    throw new Error("Reported Housing pressure must be finite and nonnegative.");
  }
  if (reportedPressure <= 100) return "LOW";
  if (reportedPressure <= 150) return "MODERATE";
  return "HIGH";
};

const resolveProgramPerformanceBelief = (
  unit: PopulationUnit,
  claimPosition: PoliticalClaimPosition,
): ProgramPerformanceBelief => {
  if (claimPosition === "PROGRAM_WORKING") {
    if (
      unit.housingPressureBelief === "LOW" ||
      unit.housingPressureBelief === "MODERATE"
    ) {
      return "WORKING";
    }
    if (unit.housingPressureBelief === "HIGH") return "MIXED";
    return unit.programPerformanceBelief === "INADEQUATE" ||
      unit.programPerformanceBelief === "CONTESTED"
      ? "CONTESTED"
      : "WORKING";
  }

  if (
    unit.housingPressureBelief === "MODERATE" ||
    unit.housingPressureBelief === "HIGH"
  ) {
    return "INADEQUATE";
  }
  if (unit.housingPressureBelief === "LOW") return "MIXED";
  return unit.programPerformanceBelief === "WORKING" ||
    unit.programPerformanceBelief === "CONTESTED"
    ? "CONTESTED"
    : "INADEQUATE";
};

const resolveHousingAttribution = (
  unit: PopulationUnit,
  claimPosition: PoliticalClaimPosition,
  performanceBelief: ProgramPerformanceBelief,
): HousingAttribution => {
  if (
    claimPosition === "PROGRAM_WORKING" &&
    performanceBelief === "WORKING" &&
    (unit.housingPressureBelief === "LOW" ||
      unit.housingPressureBelief === "MODERATE")
  ) {
    return { target: "FEDERAL_HOUSING_PROGRAM", evaluation: "CREDIT" };
  }
  if (
    claimPosition === "PROGRAM_INADEQUATE" &&
    performanceBelief === "INADEQUATE" &&
    (unit.housingPressureBelief === "MODERATE" ||
      unit.housingPressureBelief === "HIGH")
  ) {
    return { target: "FEDERAL_HOUSING_PROGRAM", evaluation: "BLAME" };
  }
  return UNKNOWN_ATTRIBUTION;
};

/**
 * Population's sole Information-incorporation boundary. It reads only the
 * canonical exposure and frozen artifact plus Population's own current state.
 */
export const incorporateInformationExposure = (
  population: PopulationState,
  information: InformationState,
  exposure: InformationExposure,
  at: SimulationInstant,
): PopulationTransitionResult => {
  if (!Number.isFinite(at)) {
    throw new Error("Population information-incorporation time must be finite.");
  }

  const canonicalExposures = information.exposures.filter(
    (candidate) => candidate.id === exposure.id,
  );
  if (canonicalExposures.length !== 1) {
    throw new Error(`Population cannot incorporate unknown exposure ${exposure.id}.`);
  }
  const canonicalExposure = canonicalExposures[0];
  if (
    canonicalExposure.artifactId !== exposure.artifactId ||
    canonicalExposure.audienceId !== exposure.audienceId ||
    canonicalExposure.exposedAtSimulationTime !== exposure.exposedAtSimulationTime
  ) {
    throw new Error(`Population exposure input ${exposure.id} does not match Information.`);
  }
  if (at < canonicalExposure.exposedAtSimulationTime) {
    throw new Error(`Population cannot incorporate exposure ${exposure.id} before receipt.`);
  }

  const recipients = population.units.filter(
    (unit) => unit.informationAudienceId === canonicalExposure.audienceId,
  );
  if (recipients.length !== 1) {
    throw new Error(
      `Information audience ${canonicalExposure.audienceId} must bind to exactly one Population unit.`,
    );
  }
  const recipient = recipients[0];
  if (
    population.informationIncorporations.some(
      (record) =>
        record.populationUnitId === recipient.id && record.exposureId === canonicalExposure.id,
    )
  ) {
    throw new Error(
      `Population unit ${recipient.id} already incorporated exposure ${canonicalExposure.id}.`,
    );
  }

  const report = information.artifacts.find(
    (artifact) => artifact.id === canonicalExposure.artifactId,
  );
  const claim = information.politicalClaims.find(
    (artifact) => artifact.id === canonicalExposure.artifactId,
  );
  if ((report === undefined) === (claim === undefined)) {
    throw new Error(
      `Exposure ${canonicalExposure.id} must reference exactly one released Information artifact.`,
    );
  }
  const artifact = report ?? claim!;
  if (artifact.releasedAtSimulationTime > canonicalExposure.exposedAtSimulationTime) {
    throw new Error(`Population cannot incorporate artifact ${artifact.id} before its release.`);
  }

  let updatedRecipient: PopulationUnit;
  if (report !== undefined) {
    const regionalResults = report.regionalResults.filter(
      (result) => result.housingRegionId === recipient.housingRegionId,
    );
    if (regionalResults.length !== 1) {
      throw new Error(
        `Official report must contain exactly one result for Population unit ${recipient.id}'s Housing region.`,
      );
    }
    updatedRecipient = {
      ...recipient,
      housingPressureBelief: categorizeReportedHousingPressure(
        regionalResults[0].affordabilityPressure,
      ),
      housingSalience: recipient.housingSalience === "HIGH" ? "HIGH" : "MEDIUM",
    };
  } else {
    const performanceBelief = resolveProgramPerformanceBelief(
      recipient,
      claim!.claimPosition,
    );
    updatedRecipient = {
      ...recipient,
      programPerformanceBelief: performanceBelief,
      housingAttribution: resolveHousingAttribution(
        recipient,
        claim!.claimPosition,
        performanceBelief,
      ),
      housingSalience: "HIGH",
    };
  }

  const incorporation: PopulationInformationIncorporation = {
    id: `gl0-incorporation-${recipient.id}-${canonicalExposure.id}`,
    populationUnitId: recipient.id,
    exposureId: canonicalExposure.id,
    artifactId: canonicalExposure.artifactId,
    incorporatedAtSimulationTime: at,
  };

  return {
    population: {
      units: population.units.map((unit) =>
        unit.id === recipient.id ? updatedRecipient : unit,
      ),
      informationIncorporations: [
        ...population.informationIncorporations,
        incorporation,
      ],
    },
    occurrences: [
      {
        type: "PopulationInformationIncorporated",
        populationUnitId: recipient.id,
        exposureId: canonicalExposure.id,
        artifactId: canonicalExposure.artifactId,
        at,
      },
    ],
  };
};
