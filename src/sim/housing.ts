import type { SimulationInstant } from "./world";

/**
 * Housing owns physical/material project truth (see
 * `10_HOUSING_MATERIAL_DOMAIN_V0.md`). GL0's first material fact is only
 * that a real project has been admitted into existence from an actual
 * disbursement -- it has not yet progressed. Later commits add the
 * construction pipeline (`initiated -> active -> ...`); Commit 12 stops at
 * the single fact that funded material work exists and has not started.
 */
export type HousingProjectStatus = "FUNDED_NOT_STARTED";

/**
 * A real physical housing project, distinct from the administrative award
 * and fiscal disbursement that funded it. It references its funding source
 * by id rather than owning or copying administrative/fiscal facts, and it
 * does not carry program law terms (match rate, participation condition,
 * reporting requirement) -- those remain legal-order/program truth.
 */
export interface HousingProject {
  readonly id: string;
  readonly stateJurisdictionId: string;
  readonly sourceDisbursementId: string;
  readonly status: HousingProjectStatus;
  readonly createdAtSimulationTime: SimulationInstant;
}

/** Housing's canonical material root. Empty until a funded project materializes. */
export interface HousingState {
  readonly projects: readonly HousingProject[];
}

export const createInitialHousingState = (): HousingState => ({ projects: [] });

/** Pure constructor: builds the project object admitted by `materializeHousingProject` below. */
const createHousingProjectFromDisbursement = (
  stateJurisdictionId: string,
  sourceDisbursementId: string,
  at: SimulationInstant,
): HousingProject => ({
  id: `gl0-housing-project-for-${sourceDisbursementId}`,
  stateJurisdictionId,
  sourceDisbursementId,
  status: "FUNDED_NOT_STARTED",
  createdAtSimulationTime: at,
});

/**
 * A legitimate cross-domain material-initiation input: a caller may
 * establish that an actual disbursement exists for a state, but that fact
 * alone is not a Housing mutation. Only `materializeHousingProject` below
 * decides whether/how it is admitted into HousingState.
 */
export interface HousingProjectInitiationInput {
  readonly stateJurisdictionId: string;
  readonly sourceDisbursementId: string;
}

/**
 * Housing owns this mutation boundary: cross-domain callers may construct
 * and pass a `HousingProjectInitiationInput`, but Housing itself decides
 * admissibility (including rejecting a duplicate project for the same
 * disbursement) and performs the actual `HousingState` update. Per
 * Architecture V0's cross-domain causality rule, no other subsystem may
 * splice `projects` directly.
 */
export const materializeHousingProject = (
  housing: HousingState,
  input: HousingProjectInitiationInput,
  at: SimulationInstant,
): HousingState => {
  if (housing.projects.some((project) => project.sourceDisbursementId === input.sourceDisbursementId)) {
    throw new Error(`A Housing project already exists for disbursement ${input.sourceDisbursementId}.`);
  }

  const project = createHousingProjectFromDisbursement(
    input.stateJurisdictionId,
    input.sourceDisbursementId,
    at,
  );

  return { ...housing, projects: [...housing.projects, project] };
};
