import type { PopulationState, PopulationUnit } from "./population";

export const GL0_ALL_REPRESENTED_RESIDENT_POPULATION_ELIGIBILITY_RULE_ID =
  "gl0-all-represented-resident-population-eligibility-rule";

/** The one synthetic normative eligibility requirement owned by the GL0 legal order. */
export type ElectoralEligibilityRequirement =
  "ALL_REPRESENTED_RESIDENT_POPULATION_WITHIN_BOUNDARY_IS_ELIGIBLE";

export interface ElectoralEligibilityRule {
  readonly id: string;
  readonly requirement: ElectoralEligibilityRequirement;
}

/** Legal-order state owns requirements; contests may only reference them by ID. */
export interface ElectoralEligibilityLegalOrderState {
  readonly rules: readonly ElectoralEligibilityRule[];
}

export const createInitialElectoralEligibilityLegalOrderState =
  (): ElectoralEligibilityLegalOrderState => ({
    rules: [
      {
        id: GL0_ALL_REPRESENTED_RESIDENT_POPULATION_ELIGIBILITY_RULE_ID,
        requirement:
          "ALL_REPRESENTED_RESIDENT_POPULATION_WITHIN_BOUNDARY_IS_ELIGIBLE",
      },
    ],
  });

export const resolveElectoralEligibilityRule = (
  legalOrder: ElectoralEligibilityLegalOrderState,
  ruleId: string,
): ElectoralEligibilityRule => {
  const matchingRules = legalOrder.rules.filter((rule) => rule.id === ruleId);
  if (matchingRules.length !== 1) {
    throw new Error(`Legal order requires exactly one electoral eligibility rule ${ruleId}.`);
  }
  return matchingRules[0];
};

/**
 * Legal-order interpretation of its normative rule against Population-owned
 * residence facts and an Electoral-owned boundary reference.
 */
export const applyElectoralEligibilityRule = (
  rule: ElectoralEligibilityRule,
  population: PopulationState,
  boundaryGeographyRegionIds: readonly string[],
): readonly PopulationUnit[] => {
  if (
    rule.requirement !==
    "ALL_REPRESENTED_RESIDENT_POPULATION_WITHIN_BOUNDARY_IS_ELIGIBLE"
  ) {
    throw new Error(`Unsupported electoral eligibility requirement ${rule.requirement}.`);
  }

  const boundaryGeographyIds = new Set(boundaryGeographyRegionIds);
  return population.units.filter((unit) =>
    boundaryGeographyIds.has(unit.residenceGeographyId),
  );
};
