import type { PublicFinanceState } from "./fiscal";
import type { EnactedLaw } from "./proposal";
import type { SimulationInstant } from "./world";

export interface AdministrativeInstitution {
  readonly id: string;
}

export const FEDERAL_HOUSING_ADMINISTRATION_INSTITUTION_ID =
  "gl0-federal-housing-administration";

export const createFederalHousingAdministrationInstitution = (): AdministrativeInstitution => ({
  id: FEDERAL_HOUSING_ADMINISTRATION_INSTITUTION_ID,
});

/**
 * The program is administrative/operational state, not the law: `NOT_
 * ESTABLISHED` is represented by `GovernanceState.housingGrantProgram` being
 * `null` (the same pattern already used for "no proposal yet"), so this
 * status only needs to describe the state a program object actually has
 * once established. GL0 does not require a modeled setup delay, so
 * establishment produces `READY_FOR_APPLICATIONS` directly -- see
 * `establishHousingGrantProgram` in governance.ts for why that single step
 * is still causally distinct from enactment and from fiscal recognition.
 */
export type HousingGrantProgramStatus = "READY_FOR_APPLICATIONS";

/**
 * Federal administrative/program state operating the enacted housing-grant
 * law. Binding terms remain in the enacted law and are resolved by reference
 * when consumed. `publicFinanceRef` references the recognized public-finance
 * state rather than owning or duplicating its amount.
 */
export interface HousingGrantProgram {
  readonly id: string;
  readonly sourceLawId: string;
  readonly operatorInstitutionId: string;
  readonly publicFinanceRef: string;
  readonly status: HousingGrantProgramStatus;
}

/**
 * Pure resolver: enacted law + recognized fiscal authority -> operational
 * program state. Does not decide whether establishment is currently
 * permitted -- that precondition belongs to the governance transition that
 * calls this.
 */
export const establishHousingGrantProgramFromLaw = (
  law: EnactedLaw,
  publicFinance: PublicFinanceState,
  operatorInstitution: AdministrativeInstitution,
): HousingGrantProgram => {
  const recognizedFinance = publicFinance.housingGrant;
  if (recognizedFinance === null || recognizedFinance.sourceLawId !== law.id) {
    throw new Error("The housing grant program requires recognized public-finance state for its law.");
  }

  return {
    id: `gl0-program-for-${law.id}`,
    sourceLawId: law.id,
    operatorInstitutionId: operatorInstitution.id,
    publicFinanceRef: recognizedFinance.id,
    status: "READY_FOR_APPLICATIONS",
  };
};

/**
 * A federal administrative award: owned by program/administrative state, not
 * by fiscal execution (see `FiscalObligation` in fiscal.ts) and not by
 * Housing (see `HousingProject` in housing.ts). It references the ACTIVE
 * intergovernmental relationship that authorized it rather than duplicating
 * that relationship's facts, and it does not itself commit or move money.
 */
export interface HousingGrantAward {
  readonly id: string;
  readonly federalProgramId: string;
  readonly relationshipId: string;
  readonly stateJurisdictionId: string;
  readonly awardedAmount: number;
  readonly awardedAtSimulationTime: SimulationInstant;
}

/**
 * Pure resolver: the active relationship plus a fixture-determined amount
 * become an administrative award record. Does not decide whether awarding is
 * currently permitted (active relationship, no duplicate, within available
 * fiscal authority) -- those preconditions belong to the governance
 * transition that calls this.
 */
export const createHousingGrantAwardForRelationship = (
  federalProgramId: string,
  relationshipId: string,
  stateJurisdictionId: string,
  awardedAmount: number,
  at: SimulationInstant,
): HousingGrantAward => ({
  id: `gl0-award-${stateJurisdictionId}-for-${federalProgramId}`,
  federalProgramId,
  relationshipId,
  stateJurisdictionId,
  awardedAmount,
  awardedAtSimulationTime: at,
});
