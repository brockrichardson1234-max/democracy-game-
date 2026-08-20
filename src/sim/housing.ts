import type { SimulationInstant } from "./world";

export type HousingProjectStatus = "FUNDED_NOT_STARTED" | "ACTIVE" | "COMPLETED";

/** Housing-owned material conditions for one region grounded in canonical geography. */
export interface HousingRegion {
  readonly id: string;
  readonly geographyRegionId: string;
  readonly stateJurisdictionId: string;
  readonly constructionCapacityWorkUnitsPerDay: number;
  readonly housingStockUnits: number;
  /** Synthetic GL0 material demand owned by Housing until Population integration exists. */
  readonly housingDemandUnits: number;
  /** Canonical material pressure derived by Housing from usable stock and demand. */
  readonly affordabilityPressure: number;
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

/**
 * The smallest cross-domain input accepted by Housing. Administration says
 * only that support was legitimately deployed to a state; Housing resolves
 * the material target and effect.
 */
export interface HousingImplementationSupportInput {
  readonly sourceDeploymentId: string;
  readonly stateJurisdictionId: string;
  readonly supportUnits: number;
}

/** Housing-owned material interpretation of one accepted deployment. */
export interface HousingProjectDeliverySupport {
  readonly id: string;
  readonly sourceDeploymentId: string;
  readonly housingProjectId: string;
  readonly housingRegionId: string;
  readonly supportUnits: number;
  readonly supplementalWorkUnitsPerDay: number;
  readonly effectiveAtSimulationTime: SimulationInstant;
}

export interface HousingState {
  readonly regions: readonly HousingRegion[];
  readonly projects: readonly HousingProject[];
  readonly projectDeliverySupports: readonly HousingProjectDeliverySupport[];
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
export const STATE_A_SYNTHETIC_HOUSING_DEMAND_UNITS = 1_200;
export const STATE_B_SYNTHETIC_HOUSING_DEMAND_UNITS = 1_150;
export const STATE_C_SYNTHETIC_HOUSING_DEMAND_UNITS = 1_250;
export const HOUSING_PROJECT_REQUIRED_WORK_UNITS = 100;
export const HOUSING_PROJECT_PLANNED_UNITS = 100;
export const STATE_A_CONSTRUCTION_CAPACITY_WORK_UNITS_PER_DAY = 10;
export const STATE_B_CONSTRUCTION_CAPACITY_WORK_UNITS_PER_DAY = 5;
export const STATE_C_CONSTRUCTION_CAPACITY_WORK_UNITS_PER_DAY = 2;
/** Synthetic GL0 material rule, not a claim about real administrative effects. */
export const HOUSING_SUPPORT_SUPPLEMENTAL_WORK_UNITS_PER_DAY_PER_UNIT = 3;

/** Housing's deliberately bounded deterministic GL0 material-pressure rule. */
export const resolveHousingAffordabilityPressure = (
  housingStockUnits: number,
  housingDemandUnits: number,
): number => Math.max(0, housingDemandUnits - housingStockUnits);

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
      housingDemandUnits: STATE_A_SYNTHETIC_HOUSING_DEMAND_UNITS,
      affordabilityPressure: resolveHousingAffordabilityPressure(
        INITIAL_HOUSING_STOCK_UNITS,
        STATE_A_SYNTHETIC_HOUSING_DEMAND_UNITS,
      ),
    },
    {
      id: HOUSING_REGION_B_ID,
      geographyRegionId: references.geographyRegionBId,
      stateJurisdictionId: references.stateBId,
      constructionCapacityWorkUnitsPerDay:
        STATE_B_CONSTRUCTION_CAPACITY_WORK_UNITS_PER_DAY,
      housingStockUnits: INITIAL_HOUSING_STOCK_UNITS,
      housingDemandUnits: STATE_B_SYNTHETIC_HOUSING_DEMAND_UNITS,
      affordabilityPressure: resolveHousingAffordabilityPressure(
        INITIAL_HOUSING_STOCK_UNITS,
        STATE_B_SYNTHETIC_HOUSING_DEMAND_UNITS,
      ),
    },
    {
      id: HOUSING_REGION_C_ID,
      geographyRegionId: references.geographyRegionCId,
      stateJurisdictionId: references.stateCId,
      constructionCapacityWorkUnitsPerDay:
        STATE_C_CONSTRUCTION_CAPACITY_WORK_UNITS_PER_DAY,
      housingStockUnits: INITIAL_HOUSING_STOCK_UNITS,
      housingDemandUnits: STATE_C_SYNTHETIC_HOUSING_DEMAND_UNITS,
      affordabilityPressure: resolveHousingAffordabilityPressure(
        INITIAL_HOUSING_STOCK_UNITS,
        STATE_C_SYNTHETIC_HOUSING_DEMAND_UNITS,
      ),
    },
  ],
  projects: [],
  projectDeliverySupports: [],
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

/**
 * Housing's admission and interpretation boundary for a legitimate federal
 * deployment input. No governance state is available here: Housing resolves
 * the single bounded material project, its region, and the synthetic effect.
 */
export const acceptHousingImplementationSupport = (
  housing: HousingState,
  input: HousingImplementationSupportInput,
  at: SimulationInstant,
): HousingState => {
  if (!Number.isFinite(at)) {
    throw new Error("Housing implementation-support acceptance time must be finite.");
  }
  if (!Number.isInteger(input.supportUnits) || input.supportUnits <= 0) {
    throw new Error("Housing implementation support must contain positive whole support units.");
  }
  if (
    housing.projectDeliverySupports.some(
      (support) => support.sourceDeploymentId === input.sourceDeploymentId,
    )
  ) {
    throw new Error(
      `Housing has already consumed implementation-support deployment ${input.sourceDeploymentId}.`,
    );
  }

  const projects = housing.projects.filter(
    (project) => project.stateJurisdictionId === input.stateJurisdictionId,
  );
  if (projects.length !== 1) {
    throw new Error(
      `Housing requires exactly one supported material project for state ${input.stateJurisdictionId}; found ${projects.length}.`,
    );
  }
  const project = projects[0];
  if (project.status === "COMPLETED") {
    throw new Error(`Housing project ${project.id} is already completed.`);
  }
  if (at < project.createdAtSimulationTime) {
    throw new Error(
      `Housing implementation support cannot predate project ${project.id}.`,
    );
  }

  const region = resolveHousingRegionForState(housing, input.stateJurisdictionId);
  if (project.housingRegionId !== region.id) {
    throw new Error(
      `Housing project ${project.id} does not belong to the supported region ${region.id}.`,
    );
  }
  if (
    housing.projectDeliverySupports.some(
      (support) => support.housingProjectId === project.id,
    )
  ) {
    throw new Error(`Housing project ${project.id} already has accepted implementation support.`);
  }

  const support: HousingProjectDeliverySupport = {
    id: `gl0-housing-delivery-support-for-${input.sourceDeploymentId}`,
    sourceDeploymentId: input.sourceDeploymentId,
    housingProjectId: project.id,
    housingRegionId: region.id,
    supportUnits: input.supportUnits,
    supplementalWorkUnitsPerDay:
      input.supportUnits * HOUSING_SUPPORT_SUPPLEMENTAL_WORK_UNITS_PER_DAY_PER_UNIT,
    effectiveAtSimulationTime: at,
  };

  return {
    ...housing,
    projectDeliverySupports: [...housing.projectDeliverySupports, support],
  };
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
    }
  | {
      readonly type: "HousingAffordabilityPressureChanged";
      readonly projectId: string;
      readonly housingRegionId: string;
      readonly previousPressure: number;
      readonly newPressure: number;
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
  HousingAffordabilityPressureChanged: 3,
};

const resolveProjectRegion = (
  housing: HousingState,
  project: HousingProject,
): HousingRegion => {
  const region = housing.regions.find((candidate) => candidate.id === project.housingRegionId);
  if (region === undefined) {
    throw new Error(
      `Housing project ${project.id} references unknown region ${project.housingRegionId}.`,
    );
  }
  return region;
};

/** Housing-owned inspection query over already accepted material state. */
export const resolveHousingProjectEffectiveWorkUnitsPerDay = (
  housing: HousingState,
  housingProjectId: string,
  at: SimulationInstant,
): number => {
  const project = housing.projects.find((candidate) => candidate.id === housingProjectId);
  if (project === undefined) {
    throw new Error(`Unknown Housing project ${housingProjectId}.`);
  }
  const region = resolveProjectRegion(housing, project);
  if (project.status === "COMPLETED") {
    return region.constructionCapacityWorkUnitsPerDay;
  }
  return housing.projectDeliverySupports
    .filter(
      (support) =>
        support.housingProjectId === project.id &&
        support.effectiveAtSimulationTime <= at,
    )
    .reduce(
      (rate, support) => rate + support.supplementalWorkUnitsPerDay,
      region.constructionCapacityWorkUnitsPerDay,
    );
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

  for (const support of housing.projectDeliverySupports) {
    const project = housing.projects.find(
      (candidate) => candidate.id === support.housingProjectId,
    );
    if (project === undefined) {
      throw new Error(
        `Housing delivery support ${support.id} references unknown project ${support.housingProjectId}.`,
      );
    }
    if (project.housingRegionId !== support.housingRegionId) {
      throw new Error(
        `Housing delivery support ${support.id} references the wrong region for project ${project.id}.`,
      );
    }
  }

  const projects = housing.projects.map((project): HousingProject => {
    if (project.status === "COMPLETED") return project;

    const region = resolveProjectRegion(housing, project);

    const effectiveFrom = Math.max(fromTime, project.createdAtSimulationTime);
    if (toTime <= effectiveFrom) return project;

    const supportBoundaries = housing.projectDeliverySupports
      .filter(
        (support) =>
          support.housingProjectId === project.id &&
          support.effectiveAtSimulationTime > effectiveFrom &&
          support.effectiveAtSimulationTime < toTime,
      )
      .map((support) => support.effectiveAtSimulationTime)
      .sort((left, right) => left - right);
    const boundaries = [...new Set(supportBoundaries), toTime];
    let cursor = effectiveFrom;
    let completedWorkUnits = project.completedWorkUnits;
    let startedAt = project.startedAtSimulationTime;
    let completedAt: SimulationInstant | null = null;

    for (const boundary of boundaries) {
      const rate = resolveHousingProjectEffectiveWorkUnitsPerDay(
        housing,
        project.id,
        cursor,
      );
      if (rate > 0) {
        if (startedAt === null) {
          startedAt = cursor;
          occurrences.push({
            type: "HousingProjectStarted",
            projectId: project.id,
            housingRegionId: region.id,
            stateJurisdictionId: project.stateJurisdictionId,
            at: startedAt,
          });
        }
        const possibleWork = completedWorkUnits + rate * (boundary - cursor);
        if (possibleWork >= project.requiredWorkUnits) {
          completedAt = cursor + (project.requiredWorkUnits - completedWorkUnits) / rate;
          completedWorkUnits = project.requiredWorkUnits;
          break;
        }
        completedWorkUnits = possibleWork;
      }
      cursor = boundary;
    }

    if (completedAt === null) {
      return {
        ...project,
        completedWorkUnits,
        status: startedAt === null ? "FUNDED_NOT_STARTED" : "ACTIVE",
        startedAtSimulationTime: startedAt,
      };
    }

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

    const completingProjects = projects
      .filter(
        (project, index) =>
          project.housingRegionId === region.id &&
          project.status === "COMPLETED" &&
          housing.projects[index].status !== "COMPLETED",
      )
      .sort((left, right) => {
        if (left.completedAtSimulationTime !== right.completedAtSimulationTime) {
          return left.completedAtSimulationTime! - right.completedAtSimulationTime!;
        }
        return left.id < right.id ? -1 : left.id === right.id ? 0 : 1;
      });
    let runningStock = region.housingStockUnits;
    let runningPressure = region.affordabilityPressure;
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
      const previousPressure = runningPressure;
      runningPressure = resolveHousingAffordabilityPressure(
        runningStock,
        region.housingDemandUnits,
      );
      if (runningPressure !== previousPressure) {
        occurrences.push({
          type: "HousingAffordabilityPressureChanged",
          projectId: project.id,
          housingRegionId: region.id,
          previousPressure,
          newPressure: runningPressure,
          at: project.completedAtSimulationTime!,
        });
      }
    }

    return {
      ...region,
      housingStockUnits: region.housingStockUnits + addedUnits,
      affordabilityPressure: runningPressure,
    };
  });

  return {
    housing: { ...housing, regions, projects },
    occurrences: sortOccurrences(occurrences),
  };
};
