export type ParticipationCondition = "strict" | "lenient";
export type ReportingRequirement = "standard" | "strengthened";

export interface ProposalTerms {
  readonly federalMatchRatePercent: number;
  readonly participationCondition: ParticipationCondition;
  readonly reportingRequirement: ReportingRequirement;
}

/** Smallest shared vote ontology required by configured procedures. */
export type VoteChoice = "YEA" | "NAY" | "PRESENT";

export type LegislativeCoalition =
  | "SUPPORT_COALITION"
  | "OPPOSITION_COALITION"
  | "SWING_COALITION";

/**
 * Actor-owned decision criteria. An actor votes YEA only when every
 * criterion it specifies is satisfied by the proposal terms currently before
 * it; a criterion left null means that actor has no requirement on that
 * dimension. Criteria live on the individual actor, not on the
 * coalition/bloc label, so a shared template never becomes a shortcut owner
 * of multiple votes.
 */
export interface LegislatorDecisionCriteria {
  readonly minimumFederalMatchRatePercent: number | null;
  readonly requiredParticipationCondition: ParticipationCondition | null;
  readonly requiredReportingRequirement: ReportingRequirement | null;
}

/** A persistent individual political actor. Exists independently of any seat/office. */
export interface PoliticalActor {
  readonly id: string;
  readonly coalition: LegislativeCoalition;
  readonly decisionCriteria: LegislatorDecisionCriteria;
}

/** A causally discrete legislative Office. Exists independently of who currently holds it. */
export interface LegislativeSeat {
  readonly id: string;
}

/** The current relationship between a seat (office) and the actor who holds it. */
export interface OfficeAssignment {
  readonly seatId: string;
  readonly actorId: string;
}

export interface Legislature {
  readonly seats: readonly LegislativeSeat[];
  readonly actors: readonly PoliticalActor[];
  readonly assignments: readonly OfficeAssignment[];
}

/** Resolves which actor currently holds a seat through the office-assignment relationship. */
export const resolveSeatHolder = (
  legislature: Legislature,
  seatId: string,
): PoliticalActor => {
  const assignment = legislature.assignments.find((entry) => entry.seatId === seatId);
  if (assignment === undefined) {
    throw new Error(`Seat "${seatId}" has no current office assignment.`);
  }

  const holder = legislature.actors.find((candidate) => candidate.id === assignment.actorId);
  if (holder === undefined) {
    throw new Error(`Seat "${seatId}" is assigned to an unknown actor "${assignment.actorId}".`);
  }

  return holder;
};

/**
 * Pure resolver: proposal facts + this actor's own criteria -> this actor's
 * own decision. No global support scalar, no bloc-cast votes.
 */
export const decideActorVote = (
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
