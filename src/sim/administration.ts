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

export type HousingImplementationResponseAction =
  | "DEPLOY_SUPPORT_TO_C"
  | "PRESERVE_SUPPORT_RESERVE";

/**
 * Canonical federal administrative decision. This records that the bounded
 * GL0 response opportunity was resolved; it is not a Housing instruction or
 * a generic player-action resource.
 */
export interface HousingImplementationResponseDecision {
  readonly id: string;
  readonly federalProgramId: string;
  readonly action: HousingImplementationResponseAction;
  readonly targetStateJurisdictionId: string | null;
  readonly decidedAtSimulationTime: SimulationInstant;
}

/**
 * Canonical administrative/intergovernmental input for a later material
 * consumer. References preserve the existing program, relationship, and
 * jurisdiction identities without copying their current facts.
 */
export interface HousingImplementationSupportDeployment {
  readonly id: string;
  readonly federalProgramId: string;
  readonly relationshipId: string;
  readonly stateJurisdictionId: string;
  readonly supportUnits: number;
  readonly deployedAtSimulationTime: SimulationInstant;
}

/** Institution-owned operational capacity for this housing program route. */
export interface FederalHousingImplementationSupportState {
  readonly operatorInstitutionId: string;
  readonly totalSupportUnits: number;
  readonly committedSupportUnits: number;
  readonly deployments: readonly HousingImplementationSupportDeployment[];
}

export const GL0_HOUSING_IMPLEMENTATION_SUPPORT_UNITS = 1;

export const createInitialFederalHousingImplementationSupportState = (
  operatorInstitution: AdministrativeInstitution,
): FederalHousingImplementationSupportState => ({
  operatorInstitutionId: operatorInstitution.id,
  totalSupportUnits: GL0_HOUSING_IMPLEMENTATION_SUPPORT_UNITS,
  committedSupportUnits: 0,
  deployments: [],
});

export const availableHousingImplementationSupportUnits = (
  support: FederalHousingImplementationSupportState,
): number => support.totalSupportUnits - support.committedSupportUnits;

export const createHousingImplementationResponseDecision = (
  federalProgramId: string,
  action: HousingImplementationResponseAction,
  targetStateJurisdictionId: string | null,
  at: SimulationInstant,
): HousingImplementationResponseDecision => ({
  id: `gl0-implementation-response-for-${federalProgramId}`,
  federalProgramId,
  action,
  targetStateJurisdictionId,
  decidedAtSimulationTime: at,
});

export const commitHousingImplementationSupport = (
  support: FederalHousingImplementationSupportState,
  federalProgramId: string,
  relationshipId: string,
  stateJurisdictionId: string,
  supportUnits: number,
  at: SimulationInstant,
): FederalHousingImplementationSupportState => {
  if (!Number.isInteger(supportUnits) || supportUnits <= 0) {
    throw new Error("Implementation support deployment must commit a positive whole unit.");
  }
  if (support.totalSupportUnits < 0 || support.committedSupportUnits < 0) {
    throw new Error("Implementation support capacity cannot be negative.");
  }
  if (support.deployments.some((deployment) => deployment.relationshipId === relationshipId)) {
    throw new Error(`Implementation support is already deployed to relationship ${relationshipId}.`);
  }
  if (availableHousingImplementationSupportUnits(support) < supportUnits) {
    throw new Error("Insufficient federal housing implementation support remains available.");
  }

  const deployment: HousingImplementationSupportDeployment = {
    id: `gl0-implementation-support-for-${relationshipId}`,
    federalProgramId,
    relationshipId,
    stateJurisdictionId,
    supportUnits,
    deployedAtSimulationTime: at,
  };

  return {
    ...support,
    committedSupportUnits: support.committedSupportUnits + supportUnits,
    deployments: [...support.deployments, deployment],
  };
};

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
