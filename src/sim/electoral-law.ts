import type {
  ElectoralPreference,
  PopulationState,
  PopulationUnit,
  TurnoutDisposition,
} from "./population";

export const GL0_ALL_REPRESENTED_RESIDENT_POPULATION_ELIGIBILITY_RULE_ID =
  "gl0-all-represented-resident-population-eligibility-rule";
export const GL0_ORDINARY_EXECUTIVE_ELECTION_PROCEDURE_RULE_ID =
  "gl0-ordinary-executive-election-procedure-rule";

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

/** The bounded normative procedure owned by the legal order, never by a contest. */
export type ElectoralProcedureRequirement =
  "DETERMINISTIC_AGGREGATE_PARTICIPATION_BALLOT_COUNT_AND_CERTIFICATION";

export interface ElectoralProcedureRule {
  readonly id: string;
  readonly requirement: ElectoralProcedureRequirement;
}

export interface ElectoralProcedureLegalOrderState {
  readonly rules: readonly ElectoralProcedureRule[];
}

export type ProcedureBallotDirection = "ADMINISTRATION" | "OPPOSITION" | "BLANK";
export type ProcedureElectionOutcome = "ADMINISTRATION_WIN" | "OPPOSITION_WIN" | "TIE";

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

export const createInitialElectoralProcedureLegalOrderState =
  (): ElectoralProcedureLegalOrderState => ({
    rules: [
      {
        id: GL0_ORDINARY_EXECUTIVE_ELECTION_PROCEDURE_RULE_ID,
        requirement:
          "DETERMINISTIC_AGGREGATE_PARTICIPATION_BALLOT_COUNT_AND_CERTIFICATION",
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

export const resolveElectoralProcedureRule = (
  legalOrder: ElectoralProcedureLegalOrderState,
  ruleId: string,
): ElectoralProcedureRule => {
  const matchingRules = legalOrder.rules.filter((rule) => rule.id === ruleId);
  if (matchingRules.length !== 1) {
    throw new Error(`Legal order requires exactly one electoral procedure rule ${ruleId}.`);
  }
  return matchingRules[0];
};

const assertSupportedProcedureRule = (rule: ElectoralProcedureRule): void => {
  if (
    rule.requirement !==
    "DETERMINISTIC_AGGREGATE_PARTICIPATION_BALLOT_COUNT_AND_CERTIFICATION"
  ) {
    throw new Error(`Unsupported electoral procedure requirement ${rule.requirement}.`);
  }
};

/** Legal-order interpretation of turnout disposition into actual election participation. */
export const resolveParticipatingWeight = (
  rule: ElectoralProcedureRule,
  eligibleWeight: number,
  turnoutDisposition: TurnoutDisposition,
): number => {
  assertSupportedProcedureRule(rule);
  if (turnoutDisposition === "UNRESOLVED") {
    throw new Error("Election resolution requires resolved turnout disposition.");
  }
  if (turnoutDisposition === "HIGH") return eligibleWeight;
  if (turnoutDisposition === "MEDIUM") return eligibleWeight / 2;
  return 0;
};

/** Legal-order interpretation of Population preference into a ballot direction. */
export const resolveProcedureBallotDirection = (
  rule: ElectoralProcedureRule,
  preference: ElectoralPreference,
): ProcedureBallotDirection => {
  assertSupportedProcedureRule(rule);
  if (preference === "UNRESOLVED") {
    throw new Error("Election resolution requires resolved electoral preference.");
  }
  return preference === "UNDECIDED" ? "BLANK" : preference;
};

/** Strictly greater candidate weight wins; equal candidate weight remains a tie. */
export const resolveProcedureElectionOutcome = (
  rule: ElectoralProcedureRule,
  administrationWeight: number,
  oppositionWeight: number,
): ProcedureElectionOutcome => {
  assertSupportedProcedureRule(rule);
  if (administrationWeight === oppositionWeight) return "TIE";
  return administrationWeight > oppositionWeight
    ? "ADMINISTRATION_WIN"
    : "OPPOSITION_WIN";
};

/** The bounded ordinary procedure permits certification of either a win or a tie. */
export const assertProcedureResultCertifiable = (
  rule: ElectoralProcedureRule,
  outcome: ProcedureElectionOutcome,
): void => {
  assertSupportedProcedureRule(rule);
  if (
    outcome !== "ADMINISTRATION_WIN" &&
    outcome !== "OPPOSITION_WIN" &&
    outcome !== "TIE"
  ) {
    throw new Error(`Election outcome ${outcome as string} is not certifiable.`);
  }
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
