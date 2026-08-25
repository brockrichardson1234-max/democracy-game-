import type { SimulationInstant } from "./world";
import { addElapsedCalendarDays, formatConfiguredEpochMilliseconds } from "../configuration/instant";
import { sha256Hex } from "../configuration/sha256";
import type { IntegratedHousingConfiguration } from "../configuration/types";

export type HousingProjectStatus = "FUNDED_NOT_STARTED" | "ACTIVE" | "COMPLETED";

/** Housing-owned material conditions for one region grounded in canonical geography. */
export interface HousingRegion {
  readonly id: string;
  readonly geographyRegionId: string;
  readonly stateJurisdictionId: string;
  readonly constructionCapacityWorkUnitsPerDay: number;
  readonly housingStockUnits: number;
  /** Material demand owned by Housing until Population integration exists. */
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
  readonly deliverySupportId: string;
  readonly sourceDeploymentId: string;
  readonly stateJurisdictionId: string;
  readonly supportUnits: number;
  readonly supplementalWorkUnitsPerDayPerUnit: number;
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

/** Housing's deliberately bounded deterministic material-pressure rule. */
export const resolveHousingAffordabilityPressure = (
  housingStockUnits: number,
  housingDemandUnits: number,
): number => Math.max(0, housingDemandUnits - housingStockUnits);

export const createHousingState = (regions: readonly HousingRegion[]): HousingState => {
  if (regions.length === 0 || new Set(regions.map((region) => region.id)).size !== regions.length) {
    throw new Error("Housing requires nonempty, unique region identities.");
  }
  return {
    regions: regions.map((region) => ({ ...region })),
    projects: [],
    projectDeliverySupports: [],
  };
};

export interface HousingProjectInitiationInput {
  readonly projectId: string;
  readonly stateJurisdictionId: string;
  readonly sourceDisbursementId: string;
  readonly requiredWorkUnits: number;
  readonly plannedHousingUnits: number;
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
    id: input.projectId,
    housingRegionId: region.id,
    stateJurisdictionId: input.stateJurisdictionId,
    sourceDisbursementId: input.sourceDisbursementId,
    requiredWorkUnits: input.requiredWorkUnits,
    completedWorkUnits: 0,
    plannedHousingUnits: input.plannedHousingUnits,
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
    id: input.deliverySupportId,
    sourceDeploymentId: input.sourceDeploymentId,
    housingProjectId: project.id,
    housingRegionId: region.id,
    supportUnits: input.supportUnits,
    supplementalWorkUnitsPerDay:
      input.supportUnits * input.supplementalWorkUnitsPerDayPerUnit,
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

/** Opaque content-owned regional classification. */
export type MaterialHousingRegionKind = string;
export type MaterialHousingProjectStage =
  | "PROPOSED"
  | "READY_FOR_COMMITMENT"
  | "FUNDED_NOT_STARTED"
  | "ACTIVE"
  | "PHYSICALLY_COMPLETE"
  | "USABLE"
  | "BLOCKED"
  | "DELAYED"
  | "FAILED"
  | "PRESERVATION_LOSS_AVOIDED";

export interface MaterialHousingControl {
  readonly id: string;
  readonly geographyId: string;
  readonly sourceGeographyCode: string;
  readonly housingStockUnits: number;
  readonly housingStockMarginOfError: number;
  readonly vacantUnits: number;
  readonly vacantUnitsMarginOfError: number;
  readonly cashRentBurden30PlusNumerator: number;
  readonly cashRentBurden30PlusDenominator: number;
  readonly sourceArtifactId: string;
  readonly observationPeriod: string;
  readonly classification: string;
}

export interface MaterialHousingRegion {
  readonly id: string;
  readonly kind: MaterialHousingRegionKind;
  readonly stateGeographyId: string;
  readonly sourceGeographyCode: string;
  readonly sourceControlId: string;
  readonly housingStockUnits: number;
  readonly vacantUnits: number;
  readonly representedExposureWeight: number;
  readonly affordabilityPressureBasisPoints: number;
  readonly annualPermittedUnits: number;
  readonly permitsPerThousandResidentsExact: string;
  readonly projectLocatorGeographyId: string | null;
  readonly activeProjectIds: readonly string[];
  readonly classification: string;
}

export interface AcceptedMaterialInputReference {
  readonly id: string;
  readonly kind: string;
  readonly sourceOwnerId: string;
  readonly sourceRecordId: string;
  readonly projectRef: string;
  readonly scopeKey: string | null;
  readonly releaseOfInputId: string | null;
  readonly causalPredecessorInputIds: readonly string[];
  readonly validatedAt: string;
  readonly classification: string;
}

export interface MaterialHousingProjectHistoryRecord {
  readonly id: string;
  readonly projectId: string;
  readonly fromStage: MaterialHousingProjectStage;
  readonly toStage: MaterialHousingProjectStage;
  readonly occurredAt: string;
  readonly causeInputIds: readonly string[];
  readonly classification: "SIMULATION_GENERATED";
}

export interface MaterialHousingProject {
  readonly id: string;
  readonly housingRegionId: string;
  readonly stateGeographyId: string;
  readonly projectLocatorGeographyId: string;
  readonly relationshipId: string;
  readonly admissionCauseRef: string | null;
  readonly activityType: "NEW_CONSTRUCTION" | "REHABILITATION" | "PRESERVATION";
  readonly expectedUnits: number;
  readonly stage: MaterialHousingProjectStage;
  readonly physicalProgressUnits: number;
  readonly activeElapsedMilliseconds: number;
  readonly pendingPhysicalCompletionAt: string | null;
  readonly requiredProgressUnits: number;
  readonly baseProgressUnitsPerDay: number;
  readonly earliestTransitionAt: string;
  readonly plannedOrAnticipatedCompletionAt: string | null;
  readonly completionEvidence: string;
  readonly financingReadiness: string;
  readonly inputAvailability: string;
  readonly complianceHold: boolean;
  readonly acceptedGovernmentInputRefs: readonly string[];
  readonly physicalCompletionAt: string | null;
  readonly usableAt: string | null;
  readonly usableUnitContribution: number;
  readonly history: readonly MaterialHousingProjectHistoryRecord[];
  readonly classification: string;
}

export interface MaterialHousingConditionRecord {
  readonly id: string;
  readonly projectId: string;
  readonly kind: "MATERIAL_DELAY_STARTED" | "MATERIAL_DELAY_CLEARED" | "MATERIAL_PROJECT_FAILED";
  readonly occurredAt: string;
  readonly causeRef: string;
  readonly semanticVersion: string;
  readonly classification: "APPROXIMATED_SIMULATION_SCAFFOLD";
}

export interface MaterialExposureReference {
  readonly id: string;
  readonly projectId: string;
  readonly housingRegionId: string;
  readonly stateGeographyId: string;
  readonly materialChangeKind: "USABLE_STOCK_ADDITION" | "PRESERVATION_LOSS_AVOIDED";
  readonly unitMagnitude: number;
  readonly occurredAt: string;
  readonly classification: "SIMULATION_GENERATED";
}

export interface MaterialHousingCalibration {
  readonly semanticVersion: string;
  readonly pressureFormula: string;
  readonly usableVacancyContributionNumerator: number;
  readonly usableVacancyContributionDenominator: number;
  readonly delayedRateNumerator: number;
  readonly delayedRateDenominator: number;
  readonly physicalToUsableLagDays: number;
  readonly classification: string;
}

export interface MaterialHousingInitializationSeed {
  readonly schemaVersion: number;
  readonly metadata: { readonly artifactId: string };
  readonly catchmentScaffoldVersion: string;
  readonly materialCalibrationVersion: string;
  readonly controls: readonly {
    readonly id: string;
    readonly sourceGeographyCode: string;
    readonly geographyId: string;
    readonly housingStock: { readonly estimate: number; readonly marginOfError: number };
    readonly vacancy: { readonly vacantEstimate: number; readonly vacantMarginOfError: number };
    readonly cashRentBurden30Plus: { readonly numerator: number; readonly denominator: number };
    readonly observationPeriod: string;
    readonly classification: string;
  }[];
  readonly regions: readonly {
    readonly id: string;
    readonly kind: MaterialHousingRegionKind;
    readonly stateGeographyId: string;
    readonly sourceGeographyCode: string;
    readonly sourceControlId: string;
    readonly housingStockUnits: number;
    readonly vacantUnits: number;
    readonly representedExposureWeight: number;
    readonly pressureBasisPoints: number;
    readonly annualPermittedUnits: number;
    readonly permitsPerThousandResidentsExact: string;
    readonly projectLocatorGeographyId: string | null;
    readonly classification: string;
  }[];
  readonly projects: readonly Omit<MaterialHousingProject,
    "admissionCauseRef" | "activeElapsedMilliseconds" | "pendingPhysicalCompletionAt" | "physicalCompletionAt" | "usableAt" | "usableUnitContribution" | "history">[];
  readonly calibration: {
    readonly pressureFormula: string;
    readonly usableVacancyContributionNumerator: number;
    readonly usableVacancyContributionDenominator: number;
    readonly delayedRateNumerator: number;
    readonly delayedRateDenominator: number;
    readonly classification: string;
  };
}

export interface IntegratedMaterialHousingState {
  readonly schemaVersion: number;
  readonly sourceArtifactId: string;
  readonly catchmentScaffoldVersion: string;
  readonly materialCalibrationVersion: string;
  readonly controls: readonly MaterialHousingControl[];
  readonly regions: readonly MaterialHousingRegion[];
  readonly projects: readonly MaterialHousingProject[];
  readonly acceptedInputs: readonly AcceptedMaterialInputReference[];
  readonly materialConditions: readonly MaterialHousingConditionRecord[];
  readonly materialExposureReferences: readonly MaterialExposureReference[];
  readonly calibration: MaterialHousingCalibration;
  readonly behavior: Pick<IntegratedHousingConfiguration,
    | "scopedReleaseSemanticVersion"
    | "materialInputBatchSemanticVersion"
    | "dependencyPhaseSemanticVersion"
    | "effectiveMaterialRateSemanticVersion"
    | "stageReadinessSemanticVersion"
    | "delaySemanticVersion"
    | "failureSemanticVersion"
    | "housingBoundaryPhase"
    | "requiredGeneratedProjectInputKinds"
    | "activationInputKind"
    | "capacityPrior">;
}

const exactCopy = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const instantValue = (value: string, label: string): number => {
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) throw new Error(`${label} must be a valid configured instant.`);
  return parsed;
};

const materialPressure = (
  stock: number,
  vacant: number,
  rentNumerator: number,
  rentDenominator: number,
): number => {
  if (stock <= 0 || vacant < 0 || vacant > stock || rentDenominator <= 0 || rentNumerator < 0 || rentNumerator > rentDenominator) {
    throw new Error("Material Housing pressure inputs are invalid.");
  }
  const scarcity = Math.round((stock - vacant) * 10_000 / stock);
  const burden = Math.round(rentNumerator * 10_000 / rentDenominator);
  return Math.round((scarcity + burden) / 2);
};

export const createIntegratedMaterialHousingState = (
  seed: MaterialHousingInitializationSeed,
  configuration: Pick<IntegratedHousingConfiguration,
    | "physicalToUsableLagDays"
    | "expectedControlCount"
    | "expectedRegionCount"
    | "expectedProjectCount"
    | "scopedReleaseSemanticVersion"
    | "materialInputBatchSemanticVersion"
    | "dependencyPhaseSemanticVersion"
    | "effectiveMaterialRateSemanticVersion"
    | "stageReadinessSemanticVersion"
    | "delaySemanticVersion"
    | "failureSemanticVersion"
    | "housingBoundaryPhase"
    | "requiredGeneratedProjectInputKinds"
    | "activationInputKind"
    | "capacityPrior">,
): IntegratedMaterialHousingState => {
  if (
    seed.controls.length !== configuration.expectedControlCount ||
    seed.regions.length !== configuration.expectedRegionCount ||
    seed.projects.length !== configuration.expectedProjectCount
  ) {
    throw new Error("Material Housing initialization requires its configured control, region, and project cardinalities.");
  }
  if (!Number.isSafeInteger(configuration.physicalToUsableLagDays) || configuration.physicalToUsableLagDays <= 0) {
    throw new Error("Material Housing physical-to-usable lag must be a positive whole day count.");
  }
  const projects = seed.projects.map((project): MaterialHousingProject => ({
    ...exactCopy(project),
    admissionCauseRef: null,
    activeElapsedMilliseconds: 0,
    pendingPhysicalCompletionAt: null,
    physicalCompletionAt: null,
    usableAt: null,
    usableUnitContribution: 0,
    history: [],
  }));
  const regions = seed.regions.map((region): MaterialHousingRegion => ({
    ...exactCopy(region),
    affordabilityPressureBasisPoints: region.pressureBasisPoints,
    activeProjectIds: projects.filter((project) => project.housingRegionId === region.id).map((project) => project.id),
  }));
  const state: IntegratedMaterialHousingState = {
    schemaVersion: 1,
    sourceArtifactId: seed.metadata.artifactId,
    catchmentScaffoldVersion: seed.catchmentScaffoldVersion,
    materialCalibrationVersion: seed.materialCalibrationVersion,
    controls: seed.controls.map((control): MaterialHousingControl => ({
      id: control.id,
      geographyId: control.geographyId,
      sourceGeographyCode: control.sourceGeographyCode,
      housingStockUnits: control.housingStock.estimate,
      housingStockMarginOfError: control.housingStock.marginOfError,
      vacantUnits: control.vacancy.vacantEstimate,
      vacantUnitsMarginOfError: control.vacancy.vacantMarginOfError,
      cashRentBurden30PlusNumerator: control.cashRentBurden30Plus.numerator,
      cashRentBurden30PlusDenominator: control.cashRentBurden30Plus.denominator,
      sourceArtifactId: seed.metadata.artifactId,
      observationPeriod: control.observationPeriod,
      classification: control.classification,
    })),
    regions,
    projects,
    acceptedInputs: [],
    materialConditions: [],
    materialExposureReferences: [],
    calibration: {
      semanticVersion: seed.materialCalibrationVersion,
      pressureFormula: seed.calibration.pressureFormula,
      usableVacancyContributionNumerator: seed.calibration.usableVacancyContributionNumerator,
      usableVacancyContributionDenominator: seed.calibration.usableVacancyContributionDenominator,
      delayedRateNumerator: seed.calibration.delayedRateNumerator,
      delayedRateDenominator: seed.calibration.delayedRateDenominator,
      physicalToUsableLagDays: configuration.physicalToUsableLagDays,
      classification: seed.calibration.classification,
    },
    behavior: {
      scopedReleaseSemanticVersion: configuration.scopedReleaseSemanticVersion,
      materialInputBatchSemanticVersion: configuration.materialInputBatchSemanticVersion,
      dependencyPhaseSemanticVersion: configuration.dependencyPhaseSemanticVersion,
      effectiveMaterialRateSemanticVersion: configuration.effectiveMaterialRateSemanticVersion,
      stageReadinessSemanticVersion: configuration.stageReadinessSemanticVersion,
      delaySemanticVersion: configuration.delaySemanticVersion,
      failureSemanticVersion: configuration.failureSemanticVersion,
      housingBoundaryPhase: configuration.housingBoundaryPhase,
      requiredGeneratedProjectInputKinds: [...configuration.requiredGeneratedProjectInputKinds],
      activationInputKind: configuration.activationInputKind,
      capacityPrior: exactCopy(configuration.capacityPrior),
    },
  };
  assertIntegratedMaterialHousingState(state);
  return state;
};

export const assertIntegratedMaterialHousingState = (state: IntegratedMaterialHousingState): void => {
  if (
    state.controls.length === 0 || state.regions.length === 0 || state.projects.length === 0 ||
    new Set(state.controls.map((entry) => entry.id)).size !== state.controls.length ||
    new Set(state.regions.map((entry) => entry.id)).size !== state.regions.length
  ) {
    throw new Error("Material Housing state has invalid canonical cardinality or identity.");
  }
  const regionIds = new Set(state.regions.map((entry) => entry.id));
  const projectIds = new Set(state.projects.map((entry) => entry.id));
  if (projectIds.size !== state.projects.length || state.projects.some((project) => !regionIds.has(project.housingRegionId))) {
    throw new Error("Material Housing projects require unique identities and canonical regions.");
  }
  for (const control of state.controls) {
    const regions = state.regions.filter((region) => region.sourceControlId === control.id);
    const usableAdditions = state.projects
      .filter((project) => regions.some((region) => region.id === project.housingRegionId))
      .reduce((sum, project) => sum + project.usableUnitContribution, 0);
    if (regions.reduce((sum, region) => sum + region.housingStockUnits, 0) !== control.housingStockUnits + usableAdditions) {
      throw new Error(`Material Housing stock aggregation contradicts control ${control.id}.`);
    }
    if (regions.some((region) => region.vacantUnits < 0 || region.vacantUnits > region.housingStockUnits)) {
      throw new Error(`Material Housing vacancy state is invalid for control ${control.id}.`);
    }
  }
  for (const region of state.regions) {
    if (region.activeProjectIds.some((id) => !projectIds.has(id))) throw new Error(`Material Housing region ${region.id} has an unknown project.`);
  }
  if (new Set(state.acceptedInputs.map((entry) => entry.id)).size !== state.acceptedInputs.length) {
    throw new Error("Material Housing accepted inputs require unique identities.");
  }
  for (const input of state.acceptedInputs) validateMaterialInputRelation(input, state.acceptedInputs);
  if (
    new Set(state.materialConditions.map((entry) => entry.id)).size !== state.materialConditions.length ||
    state.behavior.scopedReleaseSemanticVersion.trim().length === 0 ||
    state.behavior.materialInputBatchSemanticVersion.trim().length === 0 ||
    state.behavior.dependencyPhaseSemanticVersion.trim().length === 0 ||
    state.behavior.effectiveMaterialRateSemanticVersion.trim().length === 0 ||
    state.behavior.stageReadinessSemanticVersion.trim().length === 0 ||
    state.behavior.delaySemanticVersion.trim().length === 0 ||
    state.behavior.failureSemanticVersion.trim().length === 0 ||
    !Number.isSafeInteger(state.behavior.housingBoundaryPhase) || state.behavior.housingBoundaryPhase <= 0
  ) throw new Error("Material Housing state lacks configured repaired behavior semantics.");
  for (const condition of state.materialConditions) {
    const semanticVersion = condition.kind === "MATERIAL_PROJECT_FAILED"
      ? state.behavior.failureSemanticVersion
      : state.behavior.delaySemanticVersion;
    const expectedId = `housing-condition:${sha256Hex(JSON.stringify({
      semanticVersion,
      projectId: condition.projectId,
      kind: condition.kind,
      occurredAt: condition.occurredAt,
      causeRef: condition.causeRef,
    })).slice(0, 24)}`;
    if (
      condition.id !== expectedId || condition.semanticVersion !== semanticVersion ||
      condition.classification !== "APPROXIMATED_SIMULATION_SCAFFOLD" ||
      !projectIds.has(condition.projectId) || !Number.isFinite(Date.parse(condition.occurredAt)) ||
      condition.causeRef.trim().length === 0
    ) throw new Error(`Material Housing condition ${condition.id} contradicts configured semantics.`);
  }
  for (const project of state.projects) {
    if (
      new Set(project.history.map((entry) => entry.id)).size !== project.history.length ||
      project.physicalProgressUnits < 0 || project.physicalProgressUnits > project.requiredProgressUnits ||
      project.activeElapsedMilliseconds < 0 ||
      (project.stage === "FAILED" && (
        project.physicalCompletionAt !== null || project.usableAt !== null || project.usableUnitContribution !== 0 ||
        !conditionState(state, project.id).failed
      )) ||
      (project.pendingPhysicalCompletionAt !== null && (
        project.physicalCompletionAt !== null || project.complianceHold || !["ACTIVE", "DELAYED"].includes(project.stage)
      ))
    ) throw new Error(`Material Housing project ${project.id} has contradictory dynamic state.`);
    if (project.classification === "SIMULATION_GENERATED") {
      if (project.admissionCauseRef === null) throw new Error(`Generated Material Housing project ${project.id} lacks admission causality.`);
      const identityPayload = {
        semanticVersion: state.behavior.stageReadinessSemanticVersion,
        housingRegionId: project.housingRegionId,
        projectLocatorGeographyId: project.projectLocatorGeographyId,
        relationshipId: project.relationshipId,
        activityType: project.activityType,
        expectedUnits: project.expectedUnits,
        requiredProgressUnits: project.requiredProgressUnits,
        baseProgressUnitsPerDay: project.baseProgressUnitsPerDay,
        earliestTransitionAt: project.earliestTransitionAt,
        causeRef: project.admissionCauseRef,
      };
      if (project.id !== `housing-project:generated:${sha256Hex(JSON.stringify(identityPayload)).slice(0, 24)}`) {
        throw new Error(`Generated Material Housing project ${project.id} lacks deterministic identity.`);
      }
    } else if (project.admissionCauseRef !== null) {
      throw new Error(`Historical Material Housing project ${project.id} cannot acquire generated admission causality.`);
    }
  }
};

const materialConditionOrder: Readonly<Record<MaterialHousingConditionRecord["kind"], number>> = {
  MATERIAL_DELAY_STARTED: 0,
  MATERIAL_DELAY_CLEARED: 1,
  MATERIAL_PROJECT_FAILED: 2,
};

export const compareMaterialHousingConditions = (
  left: MaterialHousingConditionRecord,
  right: MaterialHousingConditionRecord,
): number => instantValue(left.occurredAt, left.id) - instantValue(right.occurredAt, right.id) ||
  materialConditionOrder[left.kind] - materialConditionOrder[right.kind] || left.id.localeCompare(right.id);

const orderedConditions = (
  state: IntegratedMaterialHousingState,
  projectId: string,
): readonly MaterialHousingConditionRecord[] => state.materialConditions
  .filter((condition) => condition.projectId === projectId)
  .sort(compareMaterialHousingConditions);

const conditionState = (state: IntegratedMaterialHousingState, projectId: string): { delayed: boolean; failed: boolean } => {
  let delayed = false;
  let failed = false;
  for (const condition of orderedConditions(state, projectId)) {
    if (condition.kind === "MATERIAL_DELAY_STARTED") delayed = true;
    if (condition.kind === "MATERIAL_DELAY_CLEARED") delayed = false;
    if (condition.kind === "MATERIAL_PROJECT_FAILED") failed = true;
  }
  return { delayed, failed };
};

const exactRatio = (value: string): number => {
  const match = /^(\d+)\/(\d+)$/.exec(value);
  if (match === null || Number(match[2]) <= 0) throw new Error(`Housing capacity prior ${value} is not an exact positive ratio.`);
  return Number(match[1]) / Number(match[2]);
};

export const resolveEffectiveMaterialProgressRate = (
  state: IntegratedMaterialHousingState,
  project: MaterialHousingProject,
): number => {
  const region = state.regions.find((entry) => entry.id === project.housingRegionId);
  if (region === undefined) throw new Error(`Material Housing project ${project.id} lacks its region.`);
  if (region.annualPermittedUnits === 0 || project.stage === "FAILED" || project.complianceHold) return 0;
  const milliUnits = Math.round(exactRatio(region.permitsPerThousandResidentsExact) * 1_000);
  if (milliUnits === 0) return 0;
  const prior = state.behavior.capacityPrior;
  const factor = milliUnits <= prior.lowUpperPermitsPerThousandMilliUnits
    ? [prior.lowRateNumerator, prior.lowRateDenominator]
    : milliUnits >= prior.highLowerPermitsPerThousandMilliUnits
      ? [prior.highRateNumerator, prior.highRateDenominator]
      : [prior.normalRateNumerator, prior.normalRateDenominator];
  const conditions = conditionState(state, project.id);
  const delayedNumerator = conditions.delayed ? state.calibration.delayedRateNumerator : 1;
  const delayedDenominator = conditions.delayed ? state.calibration.delayedRateDenominator : 1;
  return project.baseProgressUnitsPerDay * factor[0] * delayedNumerator / factor[1] / delayedDenominator;
};

const effectiveHoldIds = (
  inputs: readonly AcceptedMaterialInputReference[],
): readonly string[] => {
  const released = new Set(inputs.flatMap((input) => input.releaseOfInputId === null ? [] : [input.releaseOfInputId]));
  return inputs.filter((input) => input.kind === "COMPLIANCE_HOLD" && !released.has(input.id)).map((input) => input.id).sort();
};

const resolveInputDrivenStage = (
  state: IntegratedMaterialHousingState,
  project: MaterialHousingProject,
  relevant: readonly AcceptedMaterialInputReference[],
): { stage: MaterialHousingProjectStage; held: boolean; availability: string } => {
  if (["USABLE", "PRESERVATION_LOSS_AVOIDED"].includes(project.stage)) {
    return { stage: project.stage, held: project.complianceHold, availability: project.inputAvailability };
  }
  const conditions = conditionState(state, project.id);
  if (conditions.failed || project.stage === "FAILED") return { stage: "FAILED", held: false, availability: "MATERIAL_PROJECT_FAILED" };
  const held = effectiveHoldIds(relevant).length > 0;
  if (held) return { stage: "BLOCKED", held: true, availability: "COMPLIANCE_HOLD" };
  if (project.physicalCompletionAt !== null) {
    return { stage: "PHYSICALLY_COMPLETE", held: false, availability: "VALIDATED_INPUT_AVAILABLE" };
  }
  if (conditions.delayed) return { stage: "DELAYED", held: false, availability: "TEMPORARY_MATERIAL_DELAY" };
  const generated = project.classification === "SIMULATION_GENERATED";
  if (!generated) return { stage: "ACTIVE", held: false, availability: "VALIDATED_INPUT_AVAILABLE" };
  const kinds = new Set(relevant.map((input) => input.kind));
  if (!kinds.has("RECIPIENT_READINESS")) return { stage: "PROPOSED", held: false, availability: "PREREQUISITES_PENDING" };
  if (state.behavior.requiredGeneratedProjectInputKinds.some((kind) => !kinds.has(kind))) {
    return { stage: "READY_FOR_COMMITMENT", held: false, availability: "FISCAL_OR_COMMITMENT_INPUTS_PENDING" };
  }
  if (!kinds.has(state.behavior.activationInputKind)) {
    return { stage: "FUNDED_NOT_STARTED", held: false, availability: "ACTIVATION_INPUT_PENDING" };
  }
  const candidate = { ...project, stage: "ACTIVE" as const, complianceHold: false };
  if (resolveEffectiveMaterialProgressRate(state, candidate) <= 0) {
    return { stage: "FUNDED_NOT_STARTED", held: false, availability: "MATERIAL_CAPACITY_UNAVAILABLE" };
  }
  return { stage: "ACTIVE", held: false, availability: "VALIDATED_INPUT_AVAILABLE" };
};

const validateMaterialInputRelation = (
  input: AcceptedMaterialInputReference,
  all: readonly AcceptedMaterialInputReference[],
): void => {
  const released = input.releaseOfInputId === null ? null : all.find((entry) => entry.id === input.releaseOfInputId) ?? null;
  if (
    !Number.isFinite(Date.parse(input.validatedAt)) || input.id.trim().length === 0 ||
    (input.scopeKey !== null && input.scopeKey.trim().length === 0) ||
    (input.kind === "COMPLIANCE_HOLD" && (input.scopeKey === null || input.releaseOfInputId !== null)) ||
    (input.releaseOfInputId !== null && (
      !["WAIVER_TERMS", "INPUT_AVAILABILITY"].includes(input.kind) ||
      (released !== null && (
        released.kind !== "COMPLIANCE_HOLD" || released.projectRef !== input.projectRef ||
        released.scopeKey !== input.scopeKey || Date.parse(released.validatedAt) > Date.parse(input.validatedAt) ||
        input.causalPredecessorInputIds.length !== 1 || input.causalPredecessorInputIds[0] !== released.id
      ))
    )) ||
    input.causalPredecessorInputIds.some((id) => id !== input.releaseOfInputId && !all.some((entry) => entry.id === id))
  ) throw new Error(`Material Housing input ${input.id} lacks scoped release authority.`);
};

export const resolveMaterialInputBatch = (
  state: IntegratedMaterialHousingState,
  inputsAtInstant: readonly AcceptedMaterialInputReference[],
): IntegratedMaterialHousingState => {
  if (inputsAtInstant.length === 0) return state;
  const at = inputsAtInstant[0].validatedAt;
  if (inputsAtInstant.some((input) => input.validatedAt !== at)) {
    throw new Error("Material Housing batch requires one canonical validation instant.");
  }
  const byId = new Map(state.acceptedInputs.map((entry) => [entry.id, entry]));
  for (const input of inputsAtInstant) {
    const prior = byId.get(input.id);
    if (prior !== undefined && JSON.stringify(prior) !== JSON.stringify(input)) {
      throw new Error(`Material Housing input ${input.id} was redefined.`);
    }
    byId.set(input.id, exactCopy(input));
  }
  const acceptedInputs = [...byId.values()].sort((left, right) =>
    instantValue(left.validatedAt, `${left.id} validation`) - instantValue(right.validatedAt, `${right.id} validation`) ||
    left.id.localeCompare(right.id));
  if (new Set(acceptedInputs.map((input) => input.id)).size !== acceptedInputs.length) {
    throw new Error("Material Housing batch requires unique canonical input identities.");
  }
  for (const input of acceptedInputs) {
    if (!state.projects.some((project) => project.id === input.projectRef)) {
      throw new Error("Material Housing input references an unknown project.");
    }
    validateMaterialInputRelation(input, acceptedInputs);
  }
  const projects = state.projects.map((project): MaterialHousingProject => {
    const relevant = acceptedInputs.filter((input) => input.projectRef === project.id);
    const sameInstant = relevant.filter((input) => input.validatedAt === at);
    if (sameInstant.length === 0) return project;
    const priorBatchHistory = project.history.find((entry) =>
      entry.occurredAt === at && entry.id.startsWith(`housing-history:${project.id}:input-batch:`));
    const fromStage = priorBatchHistory?.fromStage ?? project.stage;
    const withoutPriorBatch = project.history.filter((entry) =>
      !(entry.occurredAt === at && entry.id.startsWith(`housing-history:${project.id}:input-batch:`)));
    const resolved = resolveInputDrivenStage(state, { ...project, stage: fromStage }, relevant);
    const causeInputIds = sameInstant.map((input) => input.id).sort();
    const batchIdentity = sha256Hex(JSON.stringify({
      semanticVersion: state.behavior.materialInputBatchSemanticVersion,
      projectId: project.id,
      at,
      causeInputIds,
    })).slice(0, 20);
    const deferPending = resolved.held && project.pendingPhysicalCompletionAt === at;
    const batchHistory: MaterialHousingProjectHistoryRecord = {
      id: `housing-history:${project.id}:input-batch:${batchIdentity}`,
      projectId: project.id,
      fromStage,
      toStage: resolved.stage,
      occurredAt: at,
      causeInputIds,
      classification: "SIMULATION_GENERATED",
    };
    return {
      ...project,
      stage: resolved.stage,
      complianceHold: resolved.held,
      inputAvailability: resolved.availability,
      acceptedGovernmentInputRefs: relevant.map((input) => input.id).sort(),
      activeElapsedMilliseconds: deferPending
        ? Math.max(0, project.activeElapsedMilliseconds - 1)
        : project.activeElapsedMilliseconds,
      physicalProgressUnits: deferPending
        ? Math.min(project.physicalProgressUnits, Math.max(0, project.requiredProgressUnits - 1))
        : project.physicalProgressUnits,
      pendingPhysicalCompletionAt: deferPending ? null : project.pendingPhysicalCompletionAt,
      history: [...withoutPriorBatch, batchHistory].sort((left, right) =>
        instantValue(left.occurredAt, left.id) - instantValue(right.occurredAt, right.id) || left.id.localeCompare(right.id)),
    };
  });
  const next = { ...state, acceptedInputs, projects };
  assertIntegratedMaterialHousingState(next);
  return next;
};

export const admitValidatedMaterialInputs = (
  state: IntegratedMaterialHousingState,
  inputs: readonly AcceptedMaterialInputReference[],
): IntegratedMaterialHousingState => {
  const existing = new Map(state.acceptedInputs.map((entry) => [entry.id, entry]));
  const admitted = inputs.filter((input) => !existing.has(input.id));
  for (const input of inputs) {
    const prior = existing.get(input.id);
    if (prior !== undefined && JSON.stringify(prior) !== JSON.stringify(input)) {
      throw new Error(`Material Housing input ${input.id} was redefined.`);
    }
  }
  let current = state;
  const instants = [...new Set(admitted.map((input) => input.validatedAt))].sort((left, right) =>
    instantValue(left, "material batch") - instantValue(right, "material batch") || left.localeCompare(right));
  for (const at of instants) {
    const completeBatch = [
      ...current.acceptedInputs.filter((input) => input.validatedAt === at),
      ...admitted.filter((input) => input.validatedAt === at),
    ];
    current = resolveMaterialInputBatch(current, completeBatch);
  }
  return current;
};

export interface GeneratedMaterialHousingProjectInput {
  readonly housingRegionId: string;
  readonly projectLocatorGeographyId: string;
  readonly relationshipId: string;
  readonly activityType: MaterialHousingProject["activityType"];
  readonly expectedUnits: number;
  readonly requiredProgressUnits: number;
  readonly baseProgressUnitsPerDay: number;
  readonly earliestTransitionAt: string;
  readonly causeRef: string;
}

export const admitGeneratedMaterialHousingProject = (
  state: IntegratedMaterialHousingState,
  input: GeneratedMaterialHousingProjectInput,
): IntegratedMaterialHousingState => {
  const region = state.regions.find((entry) => entry.id === input.housingRegionId);
  if (
    region === undefined || input.projectLocatorGeographyId.trim().length === 0 || input.relationshipId.trim().length === 0 ||
    input.causeRef.trim().length === 0 || !Number.isSafeInteger(input.expectedUnits) || input.expectedUnits <= 0 ||
    !Number.isSafeInteger(input.requiredProgressUnits) || input.requiredProgressUnits <= 0 ||
    !Number.isFinite(input.baseProgressUnitsPerDay) || input.baseProgressUnitsPerDay <= 0 ||
    !Number.isFinite(Date.parse(input.earliestTransitionAt))
  ) throw new Error("Generated Material Housing project lacks a bounded region, scale, rate, time, or cause.");
  const identityPayload = { semanticVersion: state.behavior.stageReadinessSemanticVersion, ...input };
  const id = `housing-project:generated:${sha256Hex(JSON.stringify(identityPayload)).slice(0, 24)}`;
  if (state.projects.some((project) => project.id === id)) return state;
  const project: MaterialHousingProject = {
    id,
    housingRegionId: region.id,
    stateGeographyId: region.stateGeographyId,
    projectLocatorGeographyId: input.projectLocatorGeographyId,
    relationshipId: input.relationshipId,
    admissionCauseRef: input.causeRef,
    activityType: input.activityType,
    expectedUnits: input.expectedUnits,
    stage: "PROPOSED",
    physicalProgressUnits: 0,
    activeElapsedMilliseconds: 0,
    pendingPhysicalCompletionAt: null,
    requiredProgressUnits: input.requiredProgressUnits,
    baseProgressUnitsPerDay: input.baseProgressUnitsPerDay,
    earliestTransitionAt: input.earliestTransitionAt,
    plannedOrAnticipatedCompletionAt: null,
    completionEvidence: "SIMULATION_GENERATED_MATERIAL_ROUTE",
    financingReadiness: "PREREQUISITES_PENDING",
    inputAvailability: "PREREQUISITES_PENDING",
    complianceHold: false,
    acceptedGovernmentInputRefs: [],
    physicalCompletionAt: null,
    usableAt: null,
    usableUnitContribution: 0,
    history: [],
    classification: "SIMULATION_GENERATED",
  };
  const next = {
    ...state,
    projects: [...state.projects, project],
    regions: state.regions.map((entry) => entry.id === region.id
      ? { ...entry, activeProjectIds: [...entry.activeProjectIds, id].sort() }
      : entry),
  };
  assertIntegratedMaterialHousingState(next);
  return next;
};

export const applyMaterialHousingCondition = (
  state: IntegratedMaterialHousingState,
  projectId: string,
  kind: MaterialHousingConditionRecord["kind"],
  occurredAt: string,
  causeRef: string,
): IntegratedMaterialHousingState => {
  const project = state.projects.find((entry) => entry.id === projectId);
  if (project === undefined || !Number.isFinite(Date.parse(occurredAt)) || causeRef.trim().length === 0) {
    throw new Error("Material Housing condition requires a project, configured instant, and cause.");
  }
  const before = conditionState(state, projectId);
  if (kind === "MATERIAL_DELAY_CLEARED" && !before.delayed) throw new Error("Material delay clear requires an active delay.");
  if (kind === "MATERIAL_DELAY_STARTED" && (before.delayed || project.stage !== "ACTIVE")) {
    throw new Error("Material delay requires a currently active project without an existing delay.");
  }
  if (before.failed) throw new Error("Failed Material Housing projects cannot receive new conditions.");
  if (["PHYSICALLY_COMPLETE", "USABLE", "PRESERVATION_LOSS_AVOIDED"].includes(project.stage)) {
    throw new Error("Completed Material Housing projects cannot enter delay or failure routes.");
  }
  const semanticVersion = kind === "MATERIAL_PROJECT_FAILED"
    ? state.behavior.failureSemanticVersion
    : state.behavior.delaySemanticVersion;
  const id = `housing-condition:${sha256Hex(JSON.stringify({ semanticVersion, projectId, kind, occurredAt, causeRef })).slice(0, 24)}`;
  if (state.materialConditions.some((entry) => entry.id === id)) return state;
  const condition: MaterialHousingConditionRecord = {
    id, projectId, kind, occurredAt, causeRef, semanticVersion,
    classification: "APPROXIMATED_SIMULATION_SCAFFOLD",
  };
  const withCondition = {
    ...state,
    materialConditions: [...state.materialConditions, condition].sort(compareMaterialHousingConditions),
  };
  const projects = withCondition.projects.map((entry): MaterialHousingProject => {
    if (entry.id !== projectId) return entry;
    const relevant = withCondition.acceptedInputs.filter((input) => input.projectRef === entry.id);
    const resolved = resolveInputDrivenStage(withCondition, entry, relevant);
    const history: MaterialHousingProjectHistoryRecord = {
      id: `housing-history:${entry.id}:condition:${sha256Hex(id).slice(0, 20)}`,
      projectId: entry.id,
      fromStage: entry.stage,
      toStage: resolved.stage,
      occurredAt,
      causeInputIds: [id],
      classification: "SIMULATION_GENERATED",
    };
    return {
      ...entry,
      stage: resolved.stage,
      complianceHold: resolved.held,
      inputAvailability: resolved.availability,
      pendingPhysicalCompletionAt: kind === "MATERIAL_PROJECT_FAILED" ? null : entry.pendingPhysicalCompletionAt,
      history: [...entry.history, history].sort((left, right) =>
        instantValue(left.occurredAt, left.id) - instantValue(right.occurredAt, right.id) || left.id.localeCompare(right.id)),
    };
  });
  const next = { ...withCondition, projects };
  assertIntegratedMaterialHousingState(next);
  return next;
};

const addDays = (instant: string, days: number): string => addElapsedCalendarDays(instant, days);

export interface MaterialHousingBoundary {
  readonly id: string;
  readonly ownerId: string;
  readonly at: string;
  readonly phase: number;
  readonly order: number;
  readonly stableKey: string;
  readonly kind: "HOUSING_PHYSICAL_COMPLETION" | "HOUSING_USABILITY";
}

/**
 * Projects expose their next material transition to the integrated canonical
 * scheduler. The engine owns no clock and does not read wall time.
 */
export const deriveMaterialHousingBoundaries = (
  state: IntegratedMaterialHousingState,
  current: string,
): readonly MaterialHousingBoundary[] => {
  const currentValue = instantValue(current, "Material Housing scheduler instant");
  return state.projects.flatMap((project): readonly MaterialHousingBoundary[] => {
    if (["USABLE", "FAILED", "PRESERVATION_LOSS_AVOIDED", "PROPOSED", "READY_FOR_COMMITMENT", "FUNDED_NOT_STARTED", "BLOCKED"].includes(project.stage) || project.complianceHold) {
      return [];
    }
    let at: string;
    let kind: MaterialHousingBoundary["kind"];
    let order: number;
    if (project.physicalCompletionAt === null) {
      if (project.pendingPhysicalCompletionAt !== null) {
        at = project.pendingPhysicalCompletionAt;
        kind = "HOUSING_PHYSICAL_COMPLETION";
        order = 0;
      } else {
        const rate = resolveEffectiveMaterialProgressRate(state, project);
        if (rate <= 0) return [];
        const requiredActiveMilliseconds = project.requiredProgressUnits * 86_400_000 / project.baseProgressUnitsPerDay;
        const remainingBaseEquivalentMilliseconds = requiredActiveMilliseconds - project.activeElapsedMilliseconds;
        if (remainingBaseEquivalentMilliseconds <= 0) {
          throw new Error(`Material Housing project ${project.id} has unprocessed completion progress.`);
        }
        const remainingWallMilliseconds = Math.ceil(
          remainingBaseEquivalentMilliseconds * project.baseProgressUnitsPerDay / rate,
        );
        const effectiveFrom = Math.max(
          currentValue,
          instantValue(project.earliestTransitionAt, `${project.id} earliest transition`),
        );
        at = formatConfiguredEpochMilliseconds(effectiveFrom + remainingWallMilliseconds);
        kind = "HOUSING_PHYSICAL_COMPLETION";
        order = 0;
      }
    } else {
      if (project.usableAt === null) {
        throw new Error(`Material Housing project ${project.id} lacks its usability boundary.`);
      }
      at = project.usableAt;
      kind = "HOUSING_USABILITY";
      order = 1;
    }
    if (instantValue(at, `${project.id} next material boundary`) <= currentValue) {
      throw new Error(`Material Housing project ${project.id} has a stale material boundary.`);
    }
    return [{
      id: `housing-boundary:${project.id}:${kind}`,
      ownerId: project.id,
      at,
      phase: state.behavior.housingBoundaryPhase,
      order,
      stableKey: `${state.materialCalibrationVersion}|${project.id}|${kind}`,
      kind,
    }];
  }).sort((left, right) =>
    instantValue(left.at, `${left.id} boundary`) - instantValue(right.at, `${right.id} boundary`) ||
    left.phase - right.phase || left.order - right.order ||
    left.stableKey.localeCompare(right.stableKey) || left.id.localeCompare(right.id));
};

export const advanceIntegratedMaterialHousing = (
  state: IntegratedMaterialHousingState,
  from: string,
  to: string,
  options: { readonly deferCompletionsAtTarget?: boolean } = {},
): IntegratedMaterialHousingState => {
  const fromValue = instantValue(from, "Material advancement start");
  const toValue = instantValue(to, "Material advancement target");
  if (toValue < fromValue) throw new Error("Material Housing time cannot move backwards.");
  if (toValue === fromValue) return state;
  const additions = new Map<string, { units: number; at: string; projectId: string; preservation: boolean }[]>();
  const projects = state.projects.map((project): MaterialHousingProject => {
    if (
      ["USABLE", "FAILED", "PRESERVATION_LOSS_AVOIDED", "PROPOSED", "READY_FOR_COMMITMENT", "FUNDED_NOT_STARTED", "BLOCKED"].includes(project.stage) ||
      project.complianceHold
    ) return project;
    const effectiveFrom = Math.max(fromValue, instantValue(project.earliestTransitionAt, `${project.id} earliest transition`));
    if (toValue <= effectiveFrom) return project;
    let progress = project.physicalProgressUnits;
    let activeElapsedMilliseconds = project.activeElapsedMilliseconds;
    let physicalCompletionAt = project.physicalCompletionAt;
    let usableAt = project.usableAt;
    const history = [...project.history];
    if (physicalCompletionAt === null) {
      const rate = resolveEffectiveMaterialProgressRate(state, project);
      if (rate <= 0) return project;
      const elapsedMilliseconds = toValue - effectiveFrom;
      const rateRatio = rate / project.baseProgressUnitsPerDay;
      const requiredActiveMilliseconds = project.requiredProgressUnits * 86_400_000 / project.baseProgressUnitsPerDay;
      const possibleActiveMilliseconds = activeElapsedMilliseconds + elapsedMilliseconds * rateRatio;
      if (possibleActiveMilliseconds < requiredActiveMilliseconds) {
        activeElapsedMilliseconds = possibleActiveMilliseconds;
        const possible = Math.floor(activeElapsedMilliseconds * project.baseProgressUnitsPerDay / 86_400_000);
        return {
          ...project,
          physicalProgressUnits: possible,
          activeElapsedMilliseconds,
          stage: project.stage === "DELAYED" ? "DELAYED" : possible > 0 ? "ACTIVE" : project.stage,
        };
      }
      const completionValue = effectiveFrom + Math.ceil(
        (requiredActiveMilliseconds - activeElapsedMilliseconds) / rateRatio,
      );
      if (options.deferCompletionsAtTarget === true && completionValue === toValue) {
        return {
          ...project,
          physicalProgressUnits: project.requiredProgressUnits,
          activeElapsedMilliseconds: requiredActiveMilliseconds,
          pendingPhysicalCompletionAt: to,
        };
      }
      physicalCompletionAt = formatConfiguredEpochMilliseconds(completionValue);
      usableAt = addDays(physicalCompletionAt, state.calibration.physicalToUsableLagDays);
      progress = project.requiredProgressUnits;
      activeElapsedMilliseconds = requiredActiveMilliseconds;
      history.push({
        id: `housing-history:${project.id}:physical-completion`, projectId: project.id,
        fromStage: project.stage, toStage: "PHYSICALLY_COMPLETE", occurredAt: physicalCompletionAt,
        causeInputIds: [...project.acceptedGovernmentInputRefs], classification: "SIMULATION_GENERATED",
      });
    }
    if (usableAt !== null && instantValue(usableAt, `${project.id} usability`) <= toValue) {
      const preservation = project.activityType === "PRESERVATION";
      const contribution = preservation ? 0 : project.expectedUnits;
      const current = additions.get(project.housingRegionId) ?? [];
      current.push({ units: contribution, at: usableAt, projectId: project.id, preservation });
      additions.set(project.housingRegionId, current);
      const finalStage: MaterialHousingProjectStage = preservation ? "PRESERVATION_LOSS_AVOIDED" : "USABLE";
      history.push({
        id: `housing-history:${project.id}:usable`, projectId: project.id,
        fromStage: "PHYSICALLY_COMPLETE", toStage: finalStage, occurredAt: usableAt,
        causeInputIds: [...project.acceptedGovernmentInputRefs], classification: "SIMULATION_GENERATED",
      });
      return { ...project, physicalProgressUnits: progress, activeElapsedMilliseconds, pendingPhysicalCompletionAt: null, physicalCompletionAt, usableAt, stage: finalStage, usableUnitContribution: contribution, history };
    }
    return { ...project, physicalProgressUnits: progress, activeElapsedMilliseconds, pendingPhysicalCompletionAt: null, physicalCompletionAt, usableAt, stage: "PHYSICALLY_COMPLETE", history };
  });
  const controlsById = new Map(state.controls.map((control) => [control.id, control]));
  const materialExposureReferences = [...state.materialExposureReferences];
  const regions = state.regions.map((region): MaterialHousingRegion => {
    const entries = additions.get(region.id) ?? [];
    if (entries.length === 0) return region;
    const added = entries.reduce((sum, entry) => sum + entry.units, 0);
    const vacancyAdded = Math.floor(added * state.calibration.usableVacancyContributionNumerator / state.calibration.usableVacancyContributionDenominator);
    const stock = region.housingStockUnits + added;
    const vacant = region.vacantUnits + vacancyAdded;
    const control = controlsById.get(region.sourceControlId);
    if (control === undefined) throw new Error(`Material Housing region ${region.id} lacks its control.`);
    for (const entry of entries) {
      materialExposureReferences.push({
        id: `material-exposure:${entry.projectId}:${entry.at}`,
        projectId: entry.projectId,
        housingRegionId: region.id,
        stateGeographyId: region.stateGeographyId,
        materialChangeKind: entry.preservation ? "PRESERVATION_LOSS_AVOIDED" : "USABLE_STOCK_ADDITION",
        unitMagnitude: entry.units,
        occurredAt: entry.at,
        classification: "SIMULATION_GENERATED",
      });
    }
    return {
      ...region,
      housingStockUnits: stock,
      vacantUnits: vacant,
      affordabilityPressureBasisPoints: materialPressure(
        stock, vacant, control.cashRentBurden30PlusNumerator, control.cashRentBurden30PlusDenominator,
      ),
    };
  });
  materialExposureReferences.sort((left, right) =>
    instantValue(left.occurredAt, `${left.id} occurrence`) - instantValue(right.occurredAt, `${right.id} occurrence`) ||
    left.id.localeCompare(right.id));
  const next = { ...state, projects, regions, materialExposureReferences };
  assertIntegratedMaterialHousingState(next);
  return next;
};

export const finalizePendingMaterialHousingCompletions = (
  state: IntegratedMaterialHousingState,
  at: string,
): IntegratedMaterialHousingState => {
  const projects = state.projects.map((project): MaterialHousingProject => {
    if (project.pendingPhysicalCompletionAt !== at) return project;
    if (project.complianceHold || !["ACTIVE", "DELAYED"].includes(project.stage) || resolveEffectiveMaterialProgressRate(state, project) <= 0) {
      return {
        ...project,
        activeElapsedMilliseconds: Math.max(0, project.activeElapsedMilliseconds - 1),
        physicalProgressUnits: Math.min(project.physicalProgressUnits, Math.max(0, project.requiredProgressUnits - 1)),
        pendingPhysicalCompletionAt: null,
      };
    }
    const usableAt = addDays(at, state.calibration.physicalToUsableLagDays);
    return {
      ...project,
      pendingPhysicalCompletionAt: null,
      physicalProgressUnits: project.requiredProgressUnits,
      physicalCompletionAt: at,
      usableAt,
      stage: "PHYSICALLY_COMPLETE",
      history: [...project.history, {
        id: `housing-history:${project.id}:physical-completion`,
        projectId: project.id,
        fromStage: project.stage,
        toStage: "PHYSICALLY_COMPLETE",
        occurredAt: at,
        causeInputIds: [...project.acceptedGovernmentInputRefs],
        classification: "SIMULATION_GENERATED",
      }],
    };
  });
  const next = { ...state, projects };
  assertIntegratedMaterialHousingState(next);
  return next;
};

export const deriveMaterialHousingStateSummary = (
  state: IntegratedMaterialHousingState,
  stateGeographyId: string,
): { readonly housingStockUnits: number; readonly vacantUnits: number; readonly affordabilityPressureBasisPoints: number } => {
  const regions = state.regions.filter((region) => region.stateGeographyId === stateGeographyId);
  if (regions.length === 0) throw new Error(`No Material Housing regions exist for ${stateGeographyId}.`);
  const represented = regions.reduce((sum, region) => sum + region.representedExposureWeight, 0);
  return {
    housingStockUnits: regions.reduce((sum, region) => sum + region.housingStockUnits, 0),
    vacantUnits: regions.reduce((sum, region) => sum + region.vacantUnits, 0),
    affordabilityPressureBasisPoints: Math.round(regions.reduce(
      (sum, region) => sum + region.affordabilityPressureBasisPoints * region.representedExposureWeight,
      0,
    ) / represented),
  };
};

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
