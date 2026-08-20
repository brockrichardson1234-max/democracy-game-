export type ParticipationCondition = "strict" | "lenient";
export type ReportingRequirement = "standard" | "strengthened";

export interface ProposalTerms {
  readonly federalMatchRatePercent: number;
  readonly participationCondition: ParticipationCondition;
  readonly reportingRequirement: ReportingRequirement;
}

export type VoteChoice = "YEA" | "NAY";

export type LegislativeCoalition =
  | "SUPPORT_COALITION"
  | "OPPOSITION_COALITION"
  | "SWING_COALITION";

/**
 * Actor-owned decision criteria. A legislator votes YEA only when every
 * criterion it specifies is satisfied by the proposal terms currently before
 * it; a criterion left null means that legislator has no requirement on that
 * dimension. Criteria live on the individual legislator, not on the
 * coalition/bloc label, so a shared template never becomes a shortcut owner
 * of multiple votes.
 */
export interface LegislatorDecisionCriteria {
  readonly minimumFederalMatchRatePercent: number | null;
  readonly requiredParticipationCondition: ParticipationCondition | null;
  readonly requiredReportingRequirement: ReportingRequirement | null;
}

export interface Legislator {
  readonly id: string;
  readonly coalition: LegislativeCoalition;
  readonly decisionCriteria: LegislatorDecisionCriteria;
}

export interface Legislature {
  readonly legislators: readonly Legislator[];
}

const legislator = (
  id: string,
  coalition: LegislativeCoalition,
  decisionCriteria: LegislatorDecisionCriteria,
): Legislator => ({ id, coalition, decisionCriteria });

const noAdditionalCriteria: LegislatorDecisionCriteria = {
  minimumFederalMatchRatePercent: null,
  requiredParticipationCondition: null,
  requiredReportingRequirement: null,
};

const requiresLenientParticipation: LegislatorDecisionCriteria = {
  minimumFederalMatchRatePercent: null,
  requiredParticipationCondition: "lenient",
  requiredReportingRequirement: null,
};

const requiresGenerousMatchAndStrongReporting: LegislatorDecisionCriteria = {
  minimumFederalMatchRatePercent: 50,
  requiredParticipationCondition: null,
  requiredReportingRequirement: "strengthened",
};

/**
 * Deliberately tiny synthetic legislature: 11 causally discrete seats.
 * Each legislator independently owns its decision criteria. The coalition
 * label only groups legislators who happen to share a deterministic
 * template for fixture readability; it never casts a vote on their behalf.
 */
export const createDeterministicLegislatureFixture = (): Legislature => ({
  legislators: [
    legislator("support-1", "SUPPORT_COALITION", noAdditionalCriteria),
    legislator("support-2", "SUPPORT_COALITION", noAdditionalCriteria),
    legislator("support-3", "SUPPORT_COALITION", noAdditionalCriteria),
    legislator("support-4", "SUPPORT_COALITION", noAdditionalCriteria),
    legislator("opposition-1", "OPPOSITION_COALITION", requiresLenientParticipation),
    legislator("opposition-2", "OPPOSITION_COALITION", requiresLenientParticipation),
    legislator("opposition-3", "OPPOSITION_COALITION", requiresLenientParticipation),
    legislator("opposition-4", "OPPOSITION_COALITION", requiresLenientParticipation),
    legislator("swing-1", "SWING_COALITION", requiresGenerousMatchAndStrongReporting),
    legislator("swing-2", "SWING_COALITION", requiresGenerousMatchAndStrongReporting),
    legislator("swing-3", "SWING_COALITION", requiresGenerousMatchAndStrongReporting),
  ],
});

/**
 * Pure resolver: proposal facts + this legislator's own criteria -> this
 * legislator's own decision. No global support scalar, no bloc-cast votes.
 */
export const decideLegislatorVote = (
  criteria: LegislatorDecisionCriteria,
  terms: ProposalTerms,
): VoteChoice => {
  if (
    criteria.minimumFederalMatchRatePercent !== null &&
    terms.federalMatchRatePercent < criteria.minimumFederalMatchRatePercent
  ) {
    return "NAY";
  }
  if (
    criteria.requiredParticipationCondition !== null &&
    terms.participationCondition !== criteria.requiredParticipationCondition
  ) {
    return "NAY";
  }
  if (
    criteria.requiredReportingRequirement !== null &&
    terms.reportingRequirement !== criteria.requiredReportingRequirement
  ) {
    return "NAY";
  }
  return "YEA";
};

/** Legally configured passage rule for this fixture: a strict majority of seats. */
export const resolvePassageThreshold = (legislature: Legislature): number =>
  Math.floor(legislature.legislators.length / 2) + 1;
