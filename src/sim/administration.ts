import type { PublicFinanceState } from "./fiscal";
import type { DisputedHousingFundsRedirectionAttempt } from "./executive-authority";
import type { JudicialOrder } from "./judicial-law";
import type { EnactedLaw } from "./proposal";
import type { SimulationInstant } from "./world";

export interface AdministrativeInstitution {
  readonly id: string;
}

export type DisputedRedirectionAdministrativeStatus =
  | "PREPARING_REDIRECTION"
  | "HALTED_BY_JUDICIAL_ORDER";

/** Agency-owned fact that an executive directive entered administrative handling. */
export interface DisputedRedirectionAdministrativeState {
  readonly sourceAttemptId: string;
  readonly targetInstitutionId: string;
  readonly status: DisputedRedirectionAdministrativeStatus;
  readonly receivedAtSimulationTime: SimulationInstant;
}

/** Agency-owned receipt; the legal-order owner cannot declare its own delivery. */
export interface JudicialOrderReceipt {
  readonly orderId: string;
  readonly recipientInstitutionId: string;
  readonly receivedAtSimulationTime: SimulationInstant;
}

export type JudicialOrderComplianceChoice = "COMPLY" | "REFUSE";

/** Agency-owned response fact, deliberately distinct from operative order status. */
export interface JudicialOrderComplianceResponse {
  readonly orderId: string;
  readonly institutionId: string;
  readonly response: JudicialOrderComplianceChoice;
  readonly resolvedAtSimulationTime: SimulationInstant;
}

export interface ContestedHousingAdministrationState {
  readonly disputedRedirections: readonly DisputedRedirectionAdministrativeState[];
  readonly judicialOrderReceipts: readonly JudicialOrderReceipt[];
  readonly judicialOrderComplianceResponses: readonly JudicialOrderComplianceResponse[];
}

export const createInitialContestedHousingAdministrationState =
  (): ContestedHousingAdministrationState => ({
    disputedRedirections: [],
    judicialOrderReceipts: [],
    judicialOrderComplianceResponses: [],
  });

export const receiveDisputedHousingRedirectionDirective = (
  state: ContestedHousingAdministrationState,
  attempt: DisputedHousingFundsRedirectionAttempt,
  institution: AdministrativeInstitution,
  at: SimulationInstant,
): {
  readonly state: ContestedHousingAdministrationState;
  readonly administrativeState: DisputedRedirectionAdministrativeState;
} => {
  if (attempt.targetInstitutionId !== institution.id) {
    throw new Error(`Disputed directive does not target institution ${institution.id}.`);
  }
  if (state.disputedRedirections.some((entry) => entry.sourceAttemptId === attempt.id)) {
    throw new Error(`Institution already received disputed attempt ${attempt.id}.`);
  }
  const administrativeState: DisputedRedirectionAdministrativeState = {
    sourceAttemptId: attempt.id,
    targetInstitutionId: institution.id,
    status: "PREPARING_REDIRECTION",
    receivedAtSimulationTime: at,
  };
  return {
    state: {
      ...state,
      disputedRedirections: [...state.disputedRedirections, administrativeState],
    },
    administrativeState,
  };
};

export const receiveJudicialOrder = (
  state: ContestedHousingAdministrationState,
  order: JudicialOrder,
  recipientInstitutionId: string,
  at: SimulationInstant,
): { readonly state: ContestedHousingAdministrationState; readonly receipt: JudicialOrderReceipt } => {
  if (order.subjectInstitutionId !== recipientInstitutionId) {
    throw new Error(`Judicial order ${order.id} does not address institution ${recipientInstitutionId}.`);
  }
  if (
    !state.disputedRedirections.some(
      (entry) => entry.sourceAttemptId === order.challengedAttemptId,
    )
  ) {
    throw new Error(`Order ${order.id} references an unreceived executive attempt.`);
  }
  if (state.judicialOrderReceipts.some((receipt) => receipt.orderId === order.id)) {
    throw new Error(`Judicial order ${order.id} has already been received.`);
  }
  const receipt: JudicialOrderReceipt = {
    orderId: order.id,
    recipientInstitutionId: order.subjectInstitutionId,
    receivedAtSimulationTime: at,
  };
  return {
    state: {
      ...state,
      judicialOrderReceipts: [...state.judicialOrderReceipts, receipt],
    },
    receipt,
  };
};

export const resolveJudicialOrderCompliance = (
  state: ContestedHousingAdministrationState,
  order: JudicialOrder,
  response: JudicialOrderComplianceChoice,
  at: SimulationInstant,
): {
  readonly state: ContestedHousingAdministrationState;
  readonly complianceResponse: JudicialOrderComplianceResponse;
} => {
  if (!state.judicialOrderReceipts.some((receipt) => receipt.orderId === order.id)) {
    throw new Error(`Institution cannot resolve compliance before receiving order ${order.id}.`);
  }
  if (
    state.judicialOrderComplianceResponses.some(
      (candidate) => candidate.orderId === order.id,
    )
  ) {
    throw new Error(`Compliance already resolved for judicial order ${order.id}.`);
  }
  if (response !== "COMPLY" && response !== "REFUSE") {
    throw new Error(`Unsupported judicial-order response ${String(response)}.`);
  }
  const complianceResponse: JudicialOrderComplianceResponse = {
    orderId: order.id,
    institutionId: order.subjectInstitutionId,
    response,
    resolvedAtSimulationTime: at,
  };
  return {
    state: {
      disputedRedirections:
        response === "COMPLY"
          ? state.disputedRedirections.map((entry) =>
              entry.sourceAttemptId === order.challengedAttemptId
                ? { ...entry, status: "HALTED_BY_JUDICIAL_ORDER" }
                : entry,
            )
          : state.disputedRedirections,
      judicialOrderReceipts: state.judicialOrderReceipts,
      judicialOrderComplianceResponses: [
        ...state.judicialOrderComplianceResponses,
        complianceResponse,
      ],
    },
    complianceResponse,
  };
};

export type HousingImplementationResponseAction =
  | "DEPLOY_SUPPORT"
  | "PRESERVE_SUPPORT_RESERVE";

/**
 * Canonical federal administrative decision. This records that the bounded
 * configured response opportunity was resolved; it is not a Housing instruction or
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

export const createFederalHousingImplementationSupportState = (
  operatorInstitution: AdministrativeInstitution,
  totalSupportUnits: number,
): FederalHousingImplementationSupportState => ({
  operatorInstitutionId: operatorInstitution.id,
  totalSupportUnits,
  committedSupportUnits: 0,
  deployments: [],
});

export const availableHousingImplementationSupportUnits = (
  support: FederalHousingImplementationSupportState,
): number => support.totalSupportUnits - support.committedSupportUnits;

export const createHousingImplementationResponseDecision = (
  decisionId: string,
  federalProgramId: string,
  action: HousingImplementationResponseAction,
  targetStateJurisdictionId: string | null,
  at: SimulationInstant,
): HousingImplementationResponseDecision => ({
  id: decisionId,
  federalProgramId,
  action,
  targetStateJurisdictionId,
  decidedAtSimulationTime: at,
});

export const commitHousingImplementationSupport = (
  support: FederalHousingImplementationSupportState,
  deploymentId: string,
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
    id: deploymentId,
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
 * once established. This bounded route does not require a modeled setup delay, so
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
  programId: string,
  law: EnactedLaw,
  publicFinance: PublicFinanceState,
  operatorInstitution: AdministrativeInstitution,
): HousingGrantProgram => {
  const recognizedFinance = publicFinance.housingGrant;
  if (recognizedFinance === null || recognizedFinance.sourceLawId !== law.id) {
    throw new Error("The housing grant program requires recognized public-finance state for its law.");
  }

  return {
    id: programId,
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
 * Pure resolver: the active relationship plus a configured amount
 * become an administrative award record. Does not decide whether awarding is
 * currently permitted (active relationship, no duplicate, within available
 * fiscal authority) -- those preconditions belong to the governance
 * transition that calls this.
 */
export const createHousingGrantAwardForRelationship = (
  awardId: string,
  federalProgramId: string,
  relationshipId: string,
  stateJurisdictionId: string,
  awardedAmount: number,
  at: SimulationInstant,
): HousingGrantAward => ({
  id: awardId,
  federalProgramId,
  relationshipId,
  stateJurisdictionId,
  awardedAmount,
  awardedAtSimulationTime: at,
});
