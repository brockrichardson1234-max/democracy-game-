import type { SimulationInstant } from "./world";

export interface JudicialInstitution {
  readonly id: string;
}

export interface JudicialOffice {
  readonly id: string;
  readonly institutionId: string;
}

export interface JudicialActor {
  readonly id: string;
}

export interface JudicialOfficeAssignment {
  readonly officeId: string;
  readonly actorId: string;
  readonly effectiveAtSimulationTime: SimulationInstant;
}

export interface LegalClaim {
  readonly id: string;
  readonly claimantJurisdictionId: string;
  readonly challengedAttemptId: string;
  readonly targetInstitutionId: string;
  readonly claimedGround: "EXECUTIVE_REDIRECTION_EXCEEDS_EXISTING_HOUSING_AUTHORITY";
  readonly requestedRemedy: "TEMPORARY_NONEXECUTION_ORDER";
  readonly filedAtSimulationTime: SimulationInstant;
}

export interface InterimReliefDecision {
  readonly id: string;
  readonly contestId: string;
  readonly judgeActorId: string;
  readonly outcome: "GRANT";
  readonly decisionSource: string;
  readonly decidedAtSimulationTime: SimulationInstant;
}

export interface JudicialReviewRequest {
  readonly id: string;
  readonly contestId: string;
  readonly requestingActorId: string;
  readonly sourceOrderId: string;
  readonly filedAtSimulationTime: SimulationInstant;
}

export interface LegalContest {
  readonly id: string;
  readonly forumInstitutionId: string;
  readonly claimantJurisdictionId: string;
  readonly challengedAttemptId: string;
  readonly targetInstitutionId: string;
  readonly legalClaimId: string;
  readonly interimReliefRuleId: string;
  readonly proceduralStage: "INTERIM_RELIEF_PENDING" | "MERITS_PENDING";
  readonly admittedAtSimulationTime: SimulationInstant;
  readonly interimReliefDecision: InterimReliefDecision | null;
  /** References only. The legal-order owner retains all operative order status. */
  readonly judicialOrderIds: readonly string[];
  readonly reviewRequest: JudicialReviewRequest | null;
}

export interface JudiciaryState {
  readonly institution: JudicialInstitution;
  readonly office: JudicialOffice;
  readonly judgeActor: JudicialActor;
  readonly officeAssignment: JudicialOfficeAssignment;
  readonly legalClaims: readonly LegalClaim[];
  readonly legalContests: readonly LegalContest[];
}

export const fileHousingRedirectionClaim = (
  judiciary: JudiciaryState,
  claimId: string,
  claimantJurisdictionId: string,
  challengedAttemptId: string,
  targetInstitutionId: string,
  at: SimulationInstant,
  scheduledAt: SimulationInstant,
): { readonly judiciary: JudiciaryState; readonly claim: LegalClaim } => {
  if (at !== scheduledAt) {
    throw new Error(`Housing redirection challenge is not due at ${at}.`);
  }
  if (judiciary.legalClaims.length > 0) {
    throw new Error("A Housing redirection legal claim already exists.");
  }
  const claim: LegalClaim = {
    id: claimId,
    claimantJurisdictionId,
    challengedAttemptId,
    targetInstitutionId,
    claimedGround: "EXECUTIVE_REDIRECTION_EXCEEDS_EXISTING_HOUSING_AUTHORITY",
    requestedRemedy: "TEMPORARY_NONEXECUTION_ORDER",
    filedAtSimulationTime: at,
  };
  return {
    judiciary: { ...judiciary, legalClaims: [...judiciary.legalClaims, claim] },
    claim,
  };
};

export const admitHousingRedirectionContest = (
  judiciary: JudiciaryState,
  claim: LegalClaim,
  contestId: string,
  interimReliefRuleId: string,
  at: SimulationInstant,
): { readonly judiciary: JudiciaryState; readonly contest: LegalContest } => {
  if (claim.filedAtSimulationTime !== at) {
    throw new Error("A bounded contest must be admitted after filing at the same boundary.");
  }
  if (!judiciary.legalClaims.some((candidate) => candidate.id === claim.id)) {
    throw new Error(`Cannot admit an unfiled legal claim ${claim.id}.`);
  }
  if (judiciary.legalContests.length > 0) {
    throw new Error("The Housing redirection legal contest already exists.");
  }
  const contest: LegalContest = {
    id: contestId,
    forumInstitutionId: judiciary.institution.id,
    claimantJurisdictionId: claim.claimantJurisdictionId,
    challengedAttemptId: claim.challengedAttemptId,
    targetInstitutionId: claim.targetInstitutionId,
    legalClaimId: claim.id,
    interimReliefRuleId,
    proceduralStage: "INTERIM_RELIEF_PENDING",
    admittedAtSimulationTime: at,
    interimReliefDecision: null,
    judicialOrderIds: [],
    reviewRequest: null,
  };
  return {
    judiciary: { ...judiciary, legalContests: [...judiciary.legalContests, contest] },
    contest,
  };
};

export const resolveInterimRelief = (
  judiciary: JudiciaryState,
  contestId: string,
  decisionId: string,
  decisionSource: string,
  at: SimulationInstant,
  scheduledAt: SimulationInstant,
): { readonly judiciary: JudiciaryState; readonly decision: InterimReliefDecision } => {
  if (at !== scheduledAt) {
    throw new Error(`Interim relief is not due at simulation time ${at}.`);
  }
  const contest = judiciary.legalContests.find((candidate) => candidate.id === contestId);
  if (contest === undefined) throw new Error(`Unknown legal contest ${contestId}.`);
  if (contest.interimReliefDecision !== null) {
    throw new Error(`Interim relief has already been decided for contest ${contestId}.`);
  }
  if (judiciary.officeAssignment.actorId !== judiciary.judgeActor.id) {
    throw new Error("The judicial office is not assigned to the configured judge.");
  }

  const decision: InterimReliefDecision = {
    id: decisionId,
    contestId,
    judgeActorId: judiciary.judgeActor.id,
    outcome: "GRANT",
    decisionSource,
    decidedAtSimulationTime: at,
  };
  return {
    judiciary: {
      ...judiciary,
      legalContests: judiciary.legalContests.map((candidate) =>
        candidate.id === contestId
          ? {
              ...candidate,
              proceduralStage: "MERITS_PENDING",
              interimReliefDecision: decision,
            }
          : candidate,
      ),
    },
    decision,
  };
};

export const referenceJudicialOrder = (
  judiciary: JudiciaryState,
  contestId: string,
  orderId: string,
): JudiciaryState => ({
  ...judiciary,
  legalContests: judiciary.legalContests.map((contest) => {
    if (contest.id !== contestId) return contest;
    if (contest.interimReliefDecision === null) {
      throw new Error(`Contest ${contestId} cannot reference an order before a decision.`);
    }
    if (contest.judicialOrderIds.includes(orderId)) {
      throw new Error(`Contest ${contestId} already references order ${orderId}.`);
    }
    return { ...contest, judicialOrderIds: [...contest.judicialOrderIds, orderId] };
  }),
});

export const fileJudicialReviewRequest = (
  judiciary: JudiciaryState,
  requestId: string,
  contestId: string,
  requestingActorId: string,
  sourceOrderId: string,
  at: SimulationInstant,
): { readonly judiciary: JudiciaryState; readonly request: JudicialReviewRequest } => {
  const contest = judiciary.legalContests.find((candidate) => candidate.id === contestId);
  if (contest === undefined) throw new Error(`Unknown legal contest ${contestId}.`);
  if (!contest.judicialOrderIds.includes(sourceOrderId)) {
    throw new Error(`Contest ${contestId} does not reference order ${sourceOrderId}.`);
  }
  if (contest.reviewRequest !== null) {
    throw new Error(`A review request already exists for contest ${contestId}.`);
  }
  const request: JudicialReviewRequest = {
    id: requestId,
    contestId,
    requestingActorId,
    sourceOrderId,
    filedAtSimulationTime: at,
  };
  return {
    judiciary: {
      ...judiciary,
      legalContests: judiciary.legalContests.map((candidate) =>
        candidate.id === contestId ? { ...candidate, reviewRequest: request } : candidate,
      ),
    },
    request,
  };
};
