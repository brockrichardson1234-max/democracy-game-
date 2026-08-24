import { sha256Hex } from "../configuration/sha256";

export interface ResidentPopulationControl {
  readonly id: string;
  readonly residenceGeographyId: string;
  readonly representedWeight: number;
  readonly sourceArtifactId: string;
  readonly sourceField: string;
  readonly referenceDate: string;
  readonly classification: string;
}

export interface CohortPoliticalState {
  readonly belief: string;
  readonly attribution: string;
  readonly salience: string;
  readonly candidatePreference: string;
  readonly turnoutDisposition: string;
  readonly classification: string;
}

export interface CohortEligibilityProjection {
  readonly projectionId: string;
  readonly allocatedWeight: number;
  readonly shareNumerator: number;
  readonly shareDenominator: number;
  readonly allocationPolicy: string;
  readonly classification: string;
}

export interface PopulationRefinementLineage {
  readonly version: string;
  readonly generation: number;
  readonly parentCohortId: string | null;
  readonly mergedParentCohortIds?: readonly string[];
  readonly causeKey: string;
}

/** One weighted joint state; dimensions are content-defined rather than engine enums. */
export interface WeightedPopulationCohort {
  readonly id: string;
  readonly representedWeight: number;
  readonly residenceGeographyId: string;
  readonly stateControlId: string;
  readonly materialExposureClass: string;
  readonly catchmentClass: string;
  readonly projectLocatorGeographyId: string | null;
  readonly materialExposureReferences: readonly string[];
  readonly receivedInformationReferences: readonly string[];
  readonly politicalState: CohortPoliticalState;
  readonly eligibilityProjection: CohortEligibilityProjection;
  readonly lineage: PopulationRefinementLineage;
}

export interface EligibilityProxyControl {
  readonly id: string;
  readonly residenceGeographyId: string;
  readonly sourceEstimate: number;
  readonly sourceDenominator: number;
  readonly sourceEstimateMoe: number;
  readonly sourceDenominatorMoe: number;
  readonly representedWeight: number;
  readonly shareNumerator: number;
  readonly shareDenominator: number;
  readonly unroundedRational: string;
  readonly integerizationPolicy: string;
  readonly transformationVersion: string;
  readonly classification: string;
}

export interface WeightedPopulationState {
  readonly controls: readonly ResidentPopulationControl[];
  readonly cohorts: readonly WeightedPopulationCohort[];
  readonly eligibilityProxies: readonly EligibilityProxyControl[];
  readonly scaffoldVersion: string;
  readonly refinementSemanticVersion: string;
  readonly sourceArtifactIds: readonly string[];
}

const requireSafeNonnegative = (value: number, label: string): void => {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`${label} must be a nonnegative safe integer.`);
};

export const assertWeightedPopulationConservation = (state: WeightedPopulationState): void => {
  const controls = new Map(state.controls.map((control) => [control.id, control]));
  if (controls.size !== state.controls.length) throw new Error("Population controls require unique identities.");
  if (new Set(state.cohorts.map((cohort) => cohort.id)).size !== state.cohorts.length) {
    throw new Error("Population cohorts require unique identities.");
  }
  if (new Set(state.eligibilityProxies.map((proxy) => proxy.id)).size !== state.eligibilityProxies.length) {
    throw new Error("Eligibility proxy controls require unique identities.");
  }
  for (const control of state.controls) {
    requireSafeNonnegative(control.representedWeight, `${control.id} represented weight`);
    if (control.representedWeight === 0) throw new Error("Population controls must be positive.");
    const cohorts = state.cohorts.filter((cohort) => cohort.stateControlId === control.id);
    if (cohorts.length === 0) throw new Error(`Population control ${control.id} has no active cohorts.`);
    const represented = cohorts.reduce((total, cohort) => total + cohort.representedWeight, 0);
    if (represented !== control.representedWeight) {
      throw new Error(`Population cohorts do not conserve control ${control.id}.`);
    }
    if (cohorts.some((cohort) => cohort.residenceGeographyId !== control.residenceGeographyId)) {
      throw new Error(`Population cohorts contradict control residence ${control.id}.`);
    }
  }
  for (const cohort of state.cohorts) {
    requireSafeNonnegative(cohort.representedWeight, `${cohort.id} represented weight`);
    requireSafeNonnegative(cohort.eligibilityProjection.allocatedWeight, `${cohort.id} eligibility weight`);
    if (cohort.representedWeight === 0 || !controls.has(cohort.stateControlId)) {
      throw new Error(`Population cohort ${cohort.id} has invalid weight or control ownership.`);
    }
  }
  for (const proxy of state.eligibilityProxies) {
    requireSafeNonnegative(proxy.representedWeight, `${proxy.id} represented weight`);
    const allocations = state.cohorts
      .filter((cohort) => cohort.eligibilityProjection.projectionId === proxy.id)
      .reduce((total, cohort) => total + cohort.eligibilityProjection.allocatedWeight, 0);
    if (allocations !== proxy.representedWeight) {
      throw new Error(`Cohort eligibility allocations do not conserve proxy ${proxy.id}.`);
    }
  }
};

export interface PopulationAssociation {
  readonly kind: "MATERIAL" | "INFORMATION";
  readonly referenceId: string;
}

export interface PopulationPoliticalResolution {
  readonly cohortId: string;
  readonly candidatePreference: string;
  readonly turnoutDisposition: string;
  readonly classification: string;
  readonly causeKey: string;
}

export interface PopulationInformationResponse {
  readonly cohortIds: readonly string[];
  readonly exposureId: string;
  readonly belief: string;
  readonly attribution: string;
  readonly salience: string;
  readonly candidatePreference: string;
  readonly turnoutDisposition: string;
  readonly classification: string;
}

/** Population owns the bounded political incorporation of a received exposure. */
export const applyPopulationInformationResponse = (
  state: WeightedPopulationState,
  response: PopulationInformationResponse,
): WeightedPopulationState => {
  if (
    response.cohortIds.length === 0 ||
    new Set(response.cohortIds).size !== response.cohortIds.length ||
    [response.exposureId, response.belief, response.attribution, response.salience,
      response.candidatePreference, response.turnoutDisposition, response.classification]
      .some((value) => value.trim().length === 0)
  ) throw new Error("Population information response is incomplete or duplicates a cohort.");
  const targetIds = new Set(response.cohortIds);
  for (const id of targetIds) {
    const cohort = state.cohorts.find((candidate) => candidate.id === id);
    if (cohort === undefined || !cohort.receivedInformationReferences.includes(response.exposureId)) {
      throw new Error(`Population cohort ${id} did not receive exposure ${response.exposureId}.`);
    }
  }
  const next = {
    ...state,
    cohorts: state.cohorts.map((cohort) => targetIds.has(cohort.id) ? {
      ...cohort,
      politicalState: {
        belief: response.belief,
        attribution: response.attribution,
        salience: response.salience,
        candidatePreference: response.candidatePreference,
        turnoutDisposition: response.turnoutDisposition,
        classification: response.classification,
      },
    } : cohort),
  };
  assertWeightedPopulationConservation(next);
  return next;
};

/** Generic upstream composition seam; changes only Population-owned political state. */
export const resolvePopulationPoliticalState = (
  state: WeightedPopulationState,
  resolutions: readonly PopulationPoliticalResolution[],
): WeightedPopulationState => {
  if (new Set(resolutions.map((resolution) => resolution.cohortId)).size !== resolutions.length) {
    throw new Error("Population political resolutions require unique cohort identities.");
  }
  const byId = new Map(resolutions.map((resolution) => [resolution.cohortId, resolution]));
  for (const resolution of resolutions) {
    if (
      !state.cohorts.some((cohort) => cohort.id === resolution.cohortId) ||
      resolution.candidatePreference.trim().length === 0 ||
      resolution.turnoutDisposition.trim().length === 0 ||
      resolution.classification.trim().length === 0 ||
      resolution.causeKey.trim().length === 0
    ) throw new Error(`Population political resolution ${resolution.cohortId} is invalid.`);
  }
  const next = {
    ...state,
    cohorts: state.cohorts.map((cohort) => {
      const resolution = byId.get(cohort.id);
      return resolution === undefined
        ? cohort
        : {
            ...cohort,
            politicalState: {
              ...cohort.politicalState,
              candidatePreference: resolution.candidatePreference,
              turnoutDisposition: resolution.turnoutDisposition,
              classification: resolution.classification,
            },
          };
    }),
  };
  assertWeightedPopulationConservation(next);
  return next;
};

export interface PopulationRefinementRequest {
  readonly parentCohortId: string;
  readonly targetedWeight: number;
  readonly causeKey: string;
  readonly association?: PopulationAssociation;
}

const uniqueAppend = (values: readonly string[], value: string): readonly string[] =>
  values.includes(value) ? [...values] : [...values, value];

/** Conservative refinement: a content-selected distinction targets only one child. */
export const refineWeightedPopulationCohort = (
  state: WeightedPopulationState,
  request: PopulationRefinementRequest,
): WeightedPopulationState => {
  const parent = state.cohorts.find((cohort) => cohort.id === request.parentCohortId);
  if (parent === undefined) throw new Error(`Unknown Population cohort ${request.parentCohortId}.`);
  if (!Number.isSafeInteger(request.targetedWeight) || request.targetedWeight <= 0 || request.targetedWeight >= parent.representedWeight) {
    throw new Error("Population refinement target must be a positive integer smaller than its parent.");
  }
  if (request.causeKey.trim().length === 0) throw new Error("Population refinement requires a stable cause key.");
  const key = sha256Hex(
    `${state.refinementSemanticVersion}|${parent.id}|${request.causeKey}`,
  ).slice(0, 20);
  const targetedId = `${parent.id}.refinement.${key}.targeted`;
  const untargetedId = `${parent.id}.refinement.${key}.untargeted`;
  if (state.cohorts.some((cohort) => cohort.id === targetedId || cohort.id === untargetedId)) {
    throw new Error("Population refinement cause has already been applied to this active state.");
  }
  const targetedEligibility = Math.floor(
    parent.eligibilityProjection.allocatedWeight * request.targetedWeight / parent.representedWeight,
  );
  const lineage = {
    version: state.refinementSemanticVersion,
    generation: parent.lineage.generation + 1,
    parentCohortId: parent.id,
    causeKey: request.causeKey,
  };
  const targeted: WeightedPopulationCohort = {
    ...parent,
    id: targetedId,
    representedWeight: request.targetedWeight,
    materialExposureReferences: request.association?.kind === "MATERIAL"
      ? uniqueAppend(parent.materialExposureReferences, request.association.referenceId)
      : [...parent.materialExposureReferences],
    receivedInformationReferences: request.association?.kind === "INFORMATION"
      ? uniqueAppend(parent.receivedInformationReferences, request.association.referenceId)
      : [...parent.receivedInformationReferences],
    politicalState: { ...parent.politicalState },
    eligibilityProjection: {
      ...parent.eligibilityProjection,
      allocatedWeight: targetedEligibility,
    },
    lineage,
  };
  const untargeted: WeightedPopulationCohort = {
    ...parent,
    id: untargetedId,
    representedWeight: parent.representedWeight - request.targetedWeight,
    materialExposureReferences: [...parent.materialExposureReferences],
    receivedInformationReferences: [...parent.receivedInformationReferences],
    politicalState: { ...parent.politicalState },
    eligibilityProjection: {
      ...parent.eligibilityProjection,
      allocatedWeight: parent.eligibilityProjection.allocatedWeight - targetedEligibility,
    },
    lineage,
  };
  const next = {
    ...state,
    cohorts: state.cohorts.flatMap((cohort) => cohort.id === parent.id ? [targeted, untargeted] : [cohort]),
  };
  assertWeightedPopulationConservation(next);
  return next;
};

const jointMergeSignature = (cohort: WeightedPopulationCohort): string => JSON.stringify({
  residenceGeographyId: cohort.residenceGeographyId,
  stateControlId: cohort.stateControlId,
  materialExposureClass: cohort.materialExposureClass,
  catchmentClass: cohort.catchmentClass,
  projectLocatorGeographyId: cohort.projectLocatorGeographyId,
  materialExposureReferences: cohort.materialExposureReferences,
  receivedInformationReferences: cohort.receivedInformationReferences,
  politicalState: cohort.politicalState,
  eligibilityProjection: {
    projectionId: cohort.eligibilityProjection.projectionId,
    shareNumerator: cohort.eligibilityProjection.shareNumerator,
    shareDenominator: cohort.eligibilityProjection.shareDenominator,
    allocationPolicy: cohort.eligibilityProjection.allocationPolicy,
    classification: cohort.eligibilityProjection.classification,
  },
});

export const mergeWeightedPopulationCohorts = (
  state: WeightedPopulationState,
  cohortIds: readonly string[],
  causeKey: string,
): WeightedPopulationState => {
  const uniqueIds = [...new Set(cohortIds)].sort();
  if (uniqueIds.length < 2 || causeKey.trim().length === 0) throw new Error("Population merge requires two cohorts and a cause key.");
  const cohorts = uniqueIds.map((id) => {
    const cohort = state.cohorts.find((candidate) => candidate.id === id);
    if (cohort === undefined) throw new Error(`Unknown Population cohort ${id}.`);
    return cohort;
  });
  const signature = jointMergeSignature(cohorts[0]);
  if (cohorts.some((cohort) => jointMergeSignature(cohort) !== signature)) {
    throw new Error("Population cohorts with different causal joint state cannot merge.");
  }
  const digest = sha256Hex(`${state.refinementSemanticVersion}|${uniqueIds.join("|")}|${causeKey}`).slice(0, 20);
  const merged: WeightedPopulationCohort = {
    ...cohorts[0],
    id: `${cohorts[0].stateControlId}.merge.${digest}`,
    representedWeight: cohorts.reduce((total, cohort) => total + cohort.representedWeight, 0),
    eligibilityProjection: {
      ...cohorts[0].eligibilityProjection,
      allocatedWeight: cohorts.reduce((total, cohort) => total + cohort.eligibilityProjection.allocatedWeight, 0),
    },
    lineage: {
      version: state.refinementSemanticVersion,
      generation: Math.max(...cohorts.map((cohort) => cohort.lineage.generation)) + 1,
      parentCohortId: null,
      mergedParentCohortIds: uniqueIds,
      causeKey,
    },
  };
  const selected = new Set(uniqueIds);
  const next = { ...state, cohorts: [...state.cohorts.filter((cohort) => !selected.has(cohort.id)), merged] };
  assertWeightedPopulationConservation(next);
  return next;
};
