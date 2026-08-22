import { STATE_A_ID } from "./federalism";
import { GL0_INTERIM_HOUSING_REDIRECTION_RULE_ID } from "./judicial-law";
import type { SimulationInstant } from "./world";

export const GL0_JUDICIAL_INSTITUTION_ID = "gl0-generic-judicial-institution";
export const GL0_JUDICIAL_OFFICE_ID = "gl0-judicial-office";
export const GL0_JUDGE_ACTOR_ID = "gl0-judge-actor";
export const GL0_HOUSING_REDIRECTION_LEGAL_CLAIM_ID =
  "gl0-housing-redirection-legal-claim";
export const GL0_HOUSING_REDIRECTION_CONTEST_ID =
  "gl0-housing-redirection-legal-contest";
export const GL0_INTERIM_RELIEF_DECISION_ID = "gl0-interim-relief-decision";
export const GL0_HOUSING_REDIRECTION_CHALLENGE_AT = 7;
export const GL0_HOUSING_REDIRECTION_INTERIM_RELIEF_AT = 8;
export const GL0_HOUSING_REDIRECTION_COMPLIANCE_AT = 9;

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
  readonly decisionSource: "AUTONOMOUS_DETERMINISTIC_FIXTURE";
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

export const createInitialJudiciaryState = (): JudiciaryState => ({
  institution: { id: GL0_JUDICIAL_INSTITUTION_ID },
  office: {
    id: GL0_JUDICIAL_OFFICE_ID,
    institutionId: GL0_JUDICIAL_INSTITUTION_ID,
  },
  judgeActor: { id: GL0_JUDGE_ACTOR_ID },
  officeAssignment: {
    officeId: GL0_JUDICIAL_OFFICE_ID,
    actorId: GL0_JUDGE_ACTOR_ID,
    effectiveAtSimulationTime: 0,
  },
  legalClaims: [],
  legalContests: [],
});

export const fileStateAHousingRedirectionClaim = (
  judiciary: JudiciaryState,
  challengedAttemptId: string,
  targetInstitutionId: string,
  at: SimulationInstant,
  scheduledAt: SimulationInstant = GL0_HOUSING_REDIRECTION_CHALLENGE_AT,
): { readonly judiciary: JudiciaryState; readonly claim: LegalClaim } => {
  if (at !== scheduledAt) {
    throw new Error(`State A's Housing redirection challenge is not due at ${at}.`);
  }
  if (judiciary.legalClaims.length > 0) {
    throw new Error("State A's Housing redirection legal claim already exists.");
  }
  const claim: LegalClaim = {
    id: GL0_HOUSING_REDIRECTION_LEGAL_CLAIM_ID,
    claimantJurisdictionId: STATE_A_ID,
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
  at: SimulationInstant,
): { readonly judiciary: JudiciaryState; readonly contest: LegalContest } => {
  if (claim.filedAtSimulationTime !== at) {
    throw new Error("The bounded GL0 contest must be admitted after filing at the same boundary.");
  }
  if (!judiciary.legalClaims.some((candidate) => candidate.id === claim.id)) {
    throw new Error(`Cannot admit an unfiled legal claim ${claim.id}.`);
  }
  if (judiciary.legalContests.length > 0) {
    throw new Error("The Housing redirection legal contest already exists.");
  }
  const contest: LegalContest = {
    id: GL0_HOUSING_REDIRECTION_CONTEST_ID,
    forumInstitutionId: judiciary.institution.id,
    claimantJurisdictionId: claim.claimantJurisdictionId,
    challengedAttemptId: claim.challengedAttemptId,
    targetInstitutionId: claim.targetInstitutionId,
    legalClaimId: claim.id,
    interimReliefRuleId: GL0_INTERIM_HOUSING_REDIRECTION_RULE_ID,
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

export const autonomouslyGrantInterimRelief = (
  judiciary: JudiciaryState,
  contestId: string,
  at: SimulationInstant,
  scheduledAt: SimulationInstant = GL0_HOUSING_REDIRECTION_INTERIM_RELIEF_AT,
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
    throw new Error("The judicial office is not assigned to the fixture judge.");
  }

  const decision: InterimReliefDecision = {
    id: GL0_INTERIM_RELIEF_DECISION_ID,
    contestId,
    judgeActorId: judiciary.judgeActor.id,
    outcome: "GRANT",
    decisionSource: "AUTONOMOUS_DETERMINISTIC_FIXTURE",
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
    id: `gl0-review-request-for-${sourceOrderId}`,
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
