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

/**
 * Pure resolver: an actual disbursement becomes a real material project
 * admitted into Housing's pipeline. Does not decide whether materialization
 * is currently permitted (an actual disbursement exists, no duplicate
 * project for it) -- those preconditions belong to the governance transition
 * that calls this.
 */
export const createHousingProjectFromDisbursement = (
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
