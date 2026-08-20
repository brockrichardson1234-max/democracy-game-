import type { Legislature, VoteChoice } from "./legislature";

export type ProcedureStage = "AWAITING_VOTE" | "RESOLVED";

/** A seat's vote as admitted into procedure-owned proceeding state. */
export interface RecordedVote {
  readonly seatId: string;
  readonly actorId: string;
  readonly choice: VoteChoice;
}

/**
 * Legally operative passage requirement. This is configuration/legal-order
 * truth referenced by the procedure instance, not a bare tally function
 * call: the instance does not silently redefine what counts as passage.
 */
export type PassageRule = "MAJORITY_OF_SEATS";

export interface LegislativeProcedureRules {
  readonly passageRule: PassageRule;
}

export const HOUSING_GRANT_PROCEDURE_RULES: LegislativeProcedureRules = {
  passageRule: "MAJORITY_OF_SEATS",
};

export const resolveRequiredYeaVotes = (
  rules: LegislativeProcedureRules,
  legislature: Legislature,
): number => {
  switch (rules.passageRule) {
    case "MAJORITY_OF_SEATS":
      return Math.floor(legislature.seats.length / 2) + 1;
  }
};

/**
 * The active proceeding's own mutable facts: current stage, the applicable
 * passage rule, how many amendments this proceeding has adopted, and the
 * votes it has admitted. It does not own actor decision-making state
 * (legislature.ts) and it does not own the pending proposal's provisions
 * (proposal.ts) -- it only owns the facts of this particular proceeding.
 */
export interface LegislativeProcedureInstance {
  readonly proposalId: string;
  readonly stage: ProcedureStage;
  readonly rules: LegislativeProcedureRules;
  readonly amendmentsAdopted: number;
  readonly votes: readonly RecordedVote[] | null;
}

export const createLegislativeProcedureInstance = (
  proposalId: string,
): LegislativeProcedureInstance => ({
  proposalId,
  stage: "AWAITING_VOTE",
  rules: HOUSING_GRANT_PROCEDURE_RULES,
  amendmentsAdopted: 0,
  votes: null,
});
