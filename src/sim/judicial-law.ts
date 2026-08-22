import type { InterimReliefDecision } from "./judiciary";
import type { SimulationInstant } from "./world";

export interface JudicialInterimReliefRule {
  readonly id: string;
  readonly requirement: string;
  readonly authorizedDecisionOutcome: string;
}

/** Single-owner operative legal state; receipt and compliance live elsewhere. */
export interface JudicialOrder {
  readonly id: string;
  readonly sourceContestId: string;
  readonly sourceDecisionId: string;
  readonly subjectInstitutionId: string;
  readonly challengedAttemptId: string;
  readonly directive: string;
  readonly issuedAtSimulationTime: SimulationInstant;
  readonly effectiveAtSimulationTime: SimulationInstant;
  readonly temporalScope: string;
  readonly orderType: string;
  readonly status: "ACTIVE";
}

export interface JudicialLegalOrderState {
  readonly interimReliefRules: readonly JudicialInterimReliefRule[];
  readonly operativeOrders: readonly JudicialOrder[];
}

export const createJudicialLegalOrderState = (
  interimReliefRules: readonly JudicialInterimReliefRule[],
): JudicialLegalOrderState => ({
  interimReliefRules: interimReliefRules.map((rule) => ({ ...rule })),
  operativeOrders: [],
});

export const issueScopedTemporaryHousingRedirectionOrder = (
  legalOrder: JudicialLegalOrderState,
  orderId: string,
  interimReliefRuleId: string,
  decision: InterimReliefDecision,
  subjectInstitutionId: string,
  challengedAttemptId: string,
  directive: string,
  temporalScope: string,
  orderType: string,
  at: SimulationInstant,
): { readonly legalOrder: JudicialLegalOrderState; readonly order: JudicialOrder } => {
  const rules = legalOrder.interimReliefRules.filter(
    (rule) => rule.id === interimReliefRuleId,
  );
  if (rules.length !== 1) {
    throw new Error(`Legal order requires exactly one interim-relief rule ${interimReliefRuleId}.`);
  }
  if (decision.outcome !== rules[0].authorizedDecisionOutcome) {
    throw new Error(
      `Interim-relief rule ${rules[0].id} does not authorize decision outcome ${decision.outcome}.`,
    );
  }
  if (decision.decidedAtSimulationTime !== at) {
    throw new Error("A temporary order must follow its decision at the same boundary.");
  }
  if (legalOrder.operativeOrders.length > 0) {
    throw new Error("The temporary Housing redirection order already exists.");
  }

  const order: JudicialOrder = {
    id: orderId,
    sourceContestId: decision.contestId,
    sourceDecisionId: decision.id,
    subjectInstitutionId,
    challengedAttemptId,
    directive,
    issuedAtSimulationTime: at,
    effectiveAtSimulationTime: at,
    temporalScope,
    orderType,
    status: "ACTIVE",
  };
  return {
    legalOrder: {
      ...legalOrder,
      operativeOrders: [...legalOrder.operativeOrders, order],
    },
    order,
  };
};
