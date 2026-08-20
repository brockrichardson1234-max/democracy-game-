import type { SimulationInstant } from "./world";

export type HousingProjectStatus = "FUNDED_NOT_STARTED" | "ACTIVE" | "COMPLETED";

/** Housing-owned material conditions for one region grounded in canonical geography. */
export interface HousingRegion {
  readonly id: string;
  readonly geographyRegionId: string;
  readonly stateJurisdictionId: string;
  readonly constructionCapacityWorkUnitsPerDay: number;
  readonly housingStockUnits: number;
}

/**
 * A physical housing project. Administrative/fiscal facts stay upstream;
 * Housing owns its work, status, material timestamps, and delivered units.
 */
export interface HousingProject {
  readonly id: string;
  readonly housingRegionId: string;
  readonly stateJurisdictionId: string;
  readonly sourceDisbursementId: string;
  readonly requiredWorkUnits: number;
  readonly completedWorkUnits: number;
  readonly plannedHousingUnits: number;
  readonly status: HousingProjectStatus;
  readonly createdAtSimulationTime: SimulationInstant;
  readonly startedAtSimulationTime: SimulationInstant | null;
  readonly completedAtSimulationTime: SimulationInstant | null;
}

export interface HousingState {
  readonly regions: readonly HousingRegion[];
  readonly projects: readonly HousingProject[];
}

/** References supplied by the world fixture; Housing supplies all material values. */
export interface HousingFixtureReferences {
  readonly stateAId: string;
  readonly stateBId: string;
  readonly stateCId: string;
  readonly geographyRegionAId: string;
  readonly geographyRegionBId: string;
  readonly geographyRegionCId: string;
}

export const HOUSING_REGION_A_ID = "housing-region-a";
export const HOUSING_REGION_B_ID = "housing-region-b";
export const HOUSING_REGION_C_ID = "housing-region-c";
export const INITIAL_HOUSING_STOCK_UNITS = 1_000;
export const HOUSING_PROJECT_REQUIRED_WORK_UNITS = 100;
export const HOUSING_PROJECT_PLANNED_UNITS = 100;
export const STATE_A_CONSTRUCTION_CAPACITY_WORK_UNITS_PER_DAY = 10;
export const STATE_B_CONSTRUCTION_CAPACITY_WORK_UNITS_PER_DAY = 5;
export const STATE_C_CONSTRUCTION_CAPACITY_WORK_UNITS_PER_DAY = 2;

export const createInitialHousingState = (
  references: HousingFixtureReferences,
): HousingState => ({
  regions: [
    {
      id: HOUSING_REGION_A_ID,
      geographyRegionId: references.geographyRegionAId,
      stateJurisdictionId: references.stateAId,
      constructionCapacityWorkUnitsPerDay:
        STATE_A_CONSTRUCTION_CAPACITY_WORK_UNITS_PER_DAY,
      housingStockUnits: INITIAL_HOUSING_STOCK_UNITS,
    },
    {
      id: HOUSING_REGION_B_ID,
      geographyRegionId: references.geographyRegionBId,
      stateJurisdictionId: references.stateBId,
      constructionCapacityWorkUnitsPerDay:
        STATE_B_CONSTRUCTION_CAPACITY_WORK_UNITS_PER_DAY,
      housingStockUnits: INITIAL_HOUSING_STOCK_UNITS,
    },
    {
      id: HOUSING_REGION_C_ID,
      geographyRegionId: references.geographyRegionCId,
      stateJurisdictionId: references.stateCId,
      constructionCapacityWorkUnitsPerDay:
        STATE_C_CONSTRUCTION_CAPACITY_WORK_UNITS_PER_DAY,
      housingStockUnits: INITIAL_HOUSING_STOCK_UNITS,
    },
  ],
  projects: [],
});

export interface HousingProjectInitiationInput {
  readonly stateJurisdictionId: string;
  readonly sourceDisbursementId: string;
}

const resolveHousingRegionForState = (
  housing: HousingState,
  stateJurisdictionId: string,
): HousingRegion => {
  const matches = housing.regions.filter(
    (region) => region.stateJurisdictionId === stateJurisdictionId,
  );
  if (matches.length !== 1) {
    throw new Error(
      `Housing requires exactly one supported region for state ${stateJurisdictionId}; found ${matches.length}.`,
    );
  }
  return matches[0];
};

/** Housing's admission boundary for a legitimate disbursement-backed input. */
export const materializeHousingProject = (
  housing: HousingState,
  input: HousingProjectInitiationInput,
  at: SimulationInstant,
): HousingState => {
  if (housing.projects.some((project) => project.sourceDisbursementId === input.sourceDisbursementId)) {
    throw new Error(`A Housing project already exists for disbursement ${input.sourceDisbursementId}.`);
  }

  const region = resolveHousingRegionForState(housing, input.stateJurisdictionId);
  const project: HousingProject = {
    id: `gl0-housing-project-for-${input.sourceDisbursementId}`,
    housingRegionId: region.id,
    stateJurisdictionId: input.stateJurisdictionId,
    sourceDisbursementId: input.sourceDisbursementId,
    requiredWorkUnits: HOUSING_PROJECT_REQUIRED_WORK_UNITS,
    completedWorkUnits: 0,
    plannedHousingUnits: HOUSING_PROJECT_PLANNED_UNITS,
    status: "FUNDED_NOT_STARTED",
    createdAtSimulationTime: at,
    startedAtSimulationTime: null,
    completedAtSimulationTime: null,
  };

  return { ...housing, projects: [...housing.projects, project] };
};

export type HousingMaterialOccurrence =
  | {
      readonly type: "HousingProjectStarted";
      readonly projectId: string;
      readonly housingRegionId: string;
      readonly stateJurisdictionId: string;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "HousingProjectCompleted";
      readonly projectId: string;
      readonly housingRegionId: string;
      readonly stateJurisdictionId: string;
      readonly at: SimulationInstant;
    }
  | {
      readonly type: "HousingStockChanged";
      readonly projectId: string;
      readonly housingRegionId: string;
      readonly previousHousingStockUnits: number;
      readonly newHousingStockUnits: number;
      readonly at: SimulationInstant;
    };

export interface HousingAdvancementResult {
  readonly housing: HousingState;
  readonly occurrences: readonly HousingMaterialOccurrence[];
}

const occurrenceRank: Readonly<Record<HousingMaterialOccurrence["type"], number>> = {
  HousingProjectStarted: 0,
  HousingProjectCompleted: 1,
  HousingStockChanged: 2,
};

const sortOccurrences = (
  occurrences: readonly HousingMaterialOccurrence[],
): readonly HousingMaterialOccurrence[] =>
  [...occurrences].sort(
    (left, right) => {
      if (left.at !== right.at) return left.at - right.at;
      if (left.projectId !== right.projectId) return left.projectId < right.projectId ? -1 : 1;
      return occurrenceRank[left.type] - occurrenceRank[right.type];
    },
  );

const assertValidAdvancement = (
  fromTime: SimulationInstant,
  toTime: SimulationInstant,
): void => {
  if (!Number.isFinite(fromTime) || !Number.isFinite(toTime)) {
    throw new Error("Housing advancement times must be finite.");
  }
  if (toTime < fromTime) {
    throw new Error("Housing time cannot advance backwards.");
  }
};

/**
 * Housing-owned deterministic interval integration. No governance or state
 * administrative capacity is available to this function: physical progress
 * is resolved only from HousingState and the supplied simulation interval.
 */
export const advanceHousing = (
  housing: HousingState,
  fromTime: SimulationInstant,
  toTime: SimulationInstant,
): HousingAdvancementResult => {
  assertValidAdvancement(fromTime, toTime);

  const occurrences: HousingMaterialOccurrence[] = [];
  const stockAdditions = new Map<string, number>();

  const projects = housing.projects.map((project): HousingProject => {
    if (project.status === "COMPLETED") return project;

    const region = housing.regions.find((candidate) => candidate.id === project.housingRegionId);
    if (region === undefined) {
      throw new Error(`Housing project ${project.id} references unknown region ${project.housingRegionId}.`);
    }
    if (region.constructionCapacityWorkUnitsPerDay <= 0) return project;

    const effectiveFrom = Math.max(fromTime, project.createdAtSimulationTime);
    if (toTime <= effectiveFrom) return project;

    const startedAt = project.startedAtSimulationTime ?? effectiveFrom;
    if (project.startedAtSimulationTime === null) {
      occurrences.push({
        type: "HousingProjectStarted",
        projectId: project.id,
        housingRegionId: region.id,
        stateJurisdictionId: project.stateJurisdictionId,
        at: startedAt,
      });
    }

    const possibleWork =
      project.completedWorkUnits +
      region.constructionCapacityWorkUnitsPerDay * (toTime - effectiveFrom);
    const completedWorkUnits = Math.min(project.requiredWorkUnits, possibleWork);

    if (completedWorkUnits < project.requiredWorkUnits) {
      return {
        ...project,
        completedWorkUnits,
        status: "ACTIVE",
        startedAtSimulationTime: startedAt,
      };
    }

    const remainingWorkUnits = project.requiredWorkUnits - project.completedWorkUnits;
    const completedAt =
      effectiveFrom + remainingWorkUnits / region.constructionCapacityWorkUnitsPerDay;
    occurrences.push({
      type: "HousingProjectCompleted",
      projectId: project.id,
      housingRegionId: region.id,
      stateJurisdictionId: project.stateJurisdictionId,
      at: completedAt,
    });
    stockAdditions.set(
      region.id,
      (stockAdditions.get(region.id) ?? 0) + project.plannedHousingUnits,
    );

    return {
      ...project,
      completedWorkUnits: project.requiredWorkUnits,
      status: "COMPLETED",
      startedAtSimulationTime: startedAt,
      completedAtSimulationTime: completedAt,
    };
  });

  const regions = housing.regions.map((region): HousingRegion => {
    const addedUnits = stockAdditions.get(region.id) ?? 0;
    if (addedUnits === 0) return region;

    const completingProjects = projects.filter(
      (project, index) =>
        project.housingRegionId === region.id &&
        project.status === "COMPLETED" &&
        housing.projects[index].status !== "COMPLETED",
    );
    let runningStock = region.housingStockUnits;
    for (const project of completingProjects) {
      const previousHousingStockUnits = runningStock;
      runningStock += project.plannedHousingUnits;
      occurrences.push({
        type: "HousingStockChanged",
        projectId: project.id,
        housingRegionId: region.id,
        previousHousingStockUnits,
        newHousingStockUnits: runningStock,
        at: project.completedAtSimulationTime!,
      });
    }

    return { ...region, housingStockUnits: region.housingStockUnits + addedUnits };
  });

  return {
    housing: { regions, projects },
    occurrences: sortOccurrences(occurrences),
  };
};
