import type { PublicFinanceState } from "./fiscal";
import type { EnactedLaw } from "./proposal";

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
