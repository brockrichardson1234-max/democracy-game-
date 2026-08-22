import type { SimulationInstant } from "./world";

export type DisputedHousingFundsRedirectionAttemptStatus = "ATTEMPTED" | "WITHDRAWN";

/** Executive-owned record of what was attempted; it owns no legal conclusion. */
export interface DisputedHousingFundsRedirectionAttempt {
  readonly id: string;
  readonly initiatingActorId: string;
  readonly executiveOfficeId: string;
  readonly targetInstitutionId: string;
  readonly federalProgramId: string;
  readonly publicFinanceRef: string;
  readonly disputedAmount: number;
  readonly claimedLegalBasis: string;
  readonly attemptedAtSimulationTime: SimulationInstant;
  readonly status: DisputedHousingFundsRedirectionAttemptStatus;
}

export type ExecutiveJudicialResponseAction = "BACK_DOWN" | "APPEAL_WHILE_COMPLYING";

export interface ExecutiveJudicialResponse {
  readonly id: string;
  readonly sourceAttemptId: string;
  readonly orderId: string;
  readonly respondingActorId: string;
  readonly action: ExecutiveJudicialResponseAction;
  readonly respondedAtSimulationTime: SimulationInstant;
}

/** Bounded executive/political owner for the disputed-authority route. */
export interface ExecutiveAuthorityState {
  readonly disputedHousingFundsRedirectionAttempts:
    readonly DisputedHousingFundsRedirectionAttempt[];
  readonly judicialResponses: readonly ExecutiveJudicialResponse[];
}

export const createInitialExecutiveAuthorityState = (): ExecutiveAuthorityState => ({
  disputedHousingFundsRedirectionAttempts: [],
  judicialResponses: [],
});

export const recordDisputedHousingFundsRedirectionAttempt = (
  state: ExecutiveAuthorityState,
  configuration: {
    readonly attemptId: string;
    readonly availableAt: SimulationInstant;
    readonly claimedLegalBasis: string;
  },
  input: Omit<
    DisputedHousingFundsRedirectionAttempt,
    "id" | "claimedLegalBasis" | "attemptedAtSimulationTime" | "status"
  >,
  at: SimulationInstant,
): { readonly state: ExecutiveAuthorityState; readonly attempt: DisputedHousingFundsRedirectionAttempt } => {
  if (at !== configuration.availableAt) {
    throw new Error(`Disputed Housing funds redirection is not attemptable at simulation time ${at}.`);
  }
  if (state.disputedHousingFundsRedirectionAttempts.length > 0) {
    throw new Error("The disputed Housing funds redirection has already been attempted.");
  }
  if (!Number.isFinite(input.disputedAmount) || input.disputedAmount <= 0) {
    throw new Error("The disputed Housing redirection amount must be positive and finite.");
  }

  const attempt: DisputedHousingFundsRedirectionAttempt = {
    id: configuration.attemptId,
    ...input,
    claimedLegalBasis: configuration.claimedLegalBasis,
    attemptedAtSimulationTime: at,
    status: "ATTEMPTED",
  };
  return {
    state: {
      ...state,
      disputedHousingFundsRedirectionAttempts: [
        ...state.disputedHousingFundsRedirectionAttempts,
        attempt,
      ],
    },
    attempt,
  };
};

export const recordExecutiveJudicialResponse = (
  state: ExecutiveAuthorityState,
  responseId: string,
  attemptId: string,
  orderId: string,
  respondingActorId: string,
  action: ExecutiveJudicialResponseAction,
  at: SimulationInstant,
): { readonly state: ExecutiveAuthorityState; readonly response: ExecutiveJudicialResponse } => {
  const attempt = state.disputedHousingFundsRedirectionAttempts.find(
    (candidate) => candidate.id === attemptId,
  );
  if (attempt === undefined) throw new Error(`Unknown disputed executive attempt ${attemptId}.`);
  if (state.judicialResponses.some((response) => response.sourceAttemptId === attemptId)) {
    throw new Error(`Executive response already exists for attempt ${attemptId}.`);
  }
  if (action !== "BACK_DOWN" && action !== "APPEAL_WHILE_COMPLYING") {
    throw new Error(`Unsupported executive judicial response ${String(action)}.`);
  }

  const response: ExecutiveJudicialResponse = {
    id: responseId,
    sourceAttemptId: attemptId,
    orderId,
    respondingActorId,
    action,
    respondedAtSimulationTime: at,
  };
  return {
    state: {
      disputedHousingFundsRedirectionAttempts:
        action === "BACK_DOWN"
          ? state.disputedHousingFundsRedirectionAttempts.map((candidate) =>
              candidate.id === attemptId ? { ...candidate, status: "WITHDRAWN" } : candidate,
            )
          : state.disputedHousingFundsRedirectionAttempts,
      judicialResponses: [...state.judicialResponses, response],
    },
    response,
  };
};
