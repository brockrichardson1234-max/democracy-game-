import type { InterimReliefDecision } from "./judiciary";
import type { SimulationInstant } from "./world";

export const GL0_INTERIM_HOUSING_REDIRECTION_RULE_ID =
  "gl0-interim-housing-redirection-relief-rule";
export const GL0_TEMPORARY_HOUSING_REDIRECTION_ORDER_ID =
  "gl0-temporary-housing-redirection-order";

export type JudicialInterimReliefRequirement =
  "GRANT_DECISION_AUTHORIZES_SCOPED_TEMPORARY_NONEXECUTION_ORDER";

export interface JudicialInterimReliefRule {
  readonly id: string;
  readonly requirement: JudicialInterimReliefRequirement;
}

export type JudicialOrderDirective =
  "DO_NOT_EXECUTE_DISPUTED_HOUSING_FUNDS_REDIRECTION";

/** Single-owner operative legal state; receipt and compliance live elsewhere. */
export interface JudicialOrder {
  readonly id: string;
  readonly sourceContestId: string;
  readonly sourceDecisionId: string;
  readonly subjectInstitutionId: string;
  readonly challengedAttemptId: string;
  readonly directive: JudicialOrderDirective;
  readonly issuedAtSimulationTime: SimulationInstant;
  readonly effectiveAtSimulationTime: SimulationInstant;
  readonly temporalScope: "UNTIL_FURTHER_JUDICIAL_ORDER_OR_MERITS_RESOLUTION";
  readonly orderType: "INTERIM";
  readonly status: "ACTIVE";
}

export interface JudicialLegalOrderState {
  readonly interimReliefRules: readonly JudicialInterimReliefRule[];
  readonly operativeOrders: readonly JudicialOrder[];
}

export const createInitialJudicialLegalOrderState = (): JudicialLegalOrderState => ({
  interimReliefRules: [
    {
      id: GL0_INTERIM_HOUSING_REDIRECTION_RULE_ID,
      requirement: "GRANT_DECISION_AUTHORIZES_SCOPED_TEMPORARY_NONEXECUTION_ORDER",
    },
  ],
  operativeOrders: [],
});

export const issueScopedTemporaryHousingRedirectionOrder = (
  legalOrder: JudicialLegalOrderState,
  interimReliefRuleId: string,
  decision: InterimReliefDecision,
  subjectInstitutionId: string,
  challengedAttemptId: string,
  at: SimulationInstant,
): { readonly legalOrder: JudicialLegalOrderState; readonly order: JudicialOrder } => {
  const rules = legalOrder.interimReliefRules.filter(
    (rule) => rule.id === interimReliefRuleId,
  );
  if (rules.length !== 1) {
    throw new Error(`Legal order requires exactly one interim-relief rule ${interimReliefRuleId}.`);
  }
  if (
    rules[0].requirement !==
    "GRANT_DECISION_AUTHORIZES_SCOPED_TEMPORARY_NONEXECUTION_ORDER"
  ) {
    throw new Error(`Unsupported interim-relief requirement ${rules[0].requirement}.`);
  }
  if (decision.outcome !== "GRANT") {
    throw new Error("An operative temporary order requires a GRANT interim-relief decision.");
  }
  if (decision.decidedAtSimulationTime !== at) {
    throw new Error("The GL0 temporary order must follow its decision at the same boundary.");
  }
  if (legalOrder.operativeOrders.length > 0) {
    throw new Error("The GL0 temporary Housing redirection order already exists.");
  }

  const order: JudicialOrder = {
    id: GL0_TEMPORARY_HOUSING_REDIRECTION_ORDER_ID,
    sourceContestId: decision.contestId,
    sourceDecisionId: decision.id,
    subjectInstitutionId,
    challengedAttemptId,
    directive: "DO_NOT_EXECUTE_DISPUTED_HOUSING_FUNDS_REDIRECTION",
    issuedAtSimulationTime: at,
    effectiveAtSimulationTime: at,
    temporalScope: "UNTIL_FURTHER_JUDICIAL_ORDER_OR_MERITS_RESOLUTION",
    orderType: "INTERIM",
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
