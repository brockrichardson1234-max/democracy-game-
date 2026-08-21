export const GL0_ORDINARY_EXECUTIVE_SUCCESSION_RULE_ID =
  "gl0-ordinary-executive-succession-rule";

export type ExecutiveSuccessionRequirement =
  "CERTIFIED_NON_TIE_WINNER_ESTABLISHES_ENTITLEMENT_AND_TRANSFERS_AT_CONFIGURED_BOUNDARY";

export interface ExecutiveSuccessionRule {
  readonly id: string;
  readonly requirement: ExecutiveSuccessionRequirement;
}

/** Canonical legal-order owner of the one bounded GL0 succession requirement. */
export interface ExecutiveSuccessionLegalOrderState {
  readonly rules: readonly ExecutiveSuccessionRule[];
}

export const createInitialExecutiveSuccessionLegalOrderState =
  (): ExecutiveSuccessionLegalOrderState => ({
    rules: [
      {
        id: GL0_ORDINARY_EXECUTIVE_SUCCESSION_RULE_ID,
        requirement:
          "CERTIFIED_NON_TIE_WINNER_ESTABLISHES_ENTITLEMENT_AND_TRANSFERS_AT_CONFIGURED_BOUNDARY",
      },
    ],
  });

export const resolveExecutiveSuccessionRule = (
  legalOrder: ExecutiveSuccessionLegalOrderState,
  ruleId: string,
): ExecutiveSuccessionRule => {
  const matchingRules = legalOrder.rules.filter((rule) => rule.id === ruleId);
  if (matchingRules.length !== 1) {
    throw new Error(`Legal order requires exactly one executive succession rule ${ruleId}.`);
  }
  return matchingRules[0];
};

export const assertOrdinaryExecutiveSuccessionRule = (
  rule: ExecutiveSuccessionRule,
): void => {
  if (
    rule.requirement !==
    "CERTIFIED_NON_TIE_WINNER_ESTABLISHES_ENTITLEMENT_AND_TRANSFERS_AT_CONFIGURED_BOUNDARY"
  ) {
    throw new Error(`Unsupported executive succession requirement ${rule.requirement}.`);
  }
};

/** Legal-order interpretation of a certified result into an entitled candidate reference. */
export const resolveSuccessorCandidateId = (
  rule: ExecutiveSuccessionRule,
  outcome: "ADMINISTRATION_WIN" | "OPPOSITION_WIN" | "TIE",
  winningCandidateId: string | null,
): string | null => {
  assertOrdinaryExecutiveSuccessionRule(rule);
  if (outcome === "TIE") {
    if (winningCandidateId !== null) {
      throw new Error("A tied election cannot identify a winning candidate.");
    }
    return null;
  }
  if (winningCandidateId === null) {
    throw new Error("A certified non-tie election requires a winning candidate.");
  }
  return winningCandidateId;
};

/** Legal-order interpretation of the entitlement's configured transfer boundary. */
export const assertSuccessorTransferDue = (
  rule: ExecutiveSuccessionRule,
  scheduledTransferAt: number,
  at: number,
): void => {
  assertOrdinaryExecutiveSuccessionRule(rule);
  if (scheduledTransferAt !== at) {
    throw new Error(`Successor entitlement is not transferable at ${at}.`);
  }
};
