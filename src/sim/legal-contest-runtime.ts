import type {
  IntegratedLegalContestConfiguration,
  InstitutionalBoundaryConfiguration,
} from "../configuration/types";
import type { RelationshipQualificationDeterminationRecord } from "./program-implementation";

export interface IntegratedLegalClaimRecord {
  readonly id: string;
  readonly claimantId: string;
  readonly challengedDeterminationId: string;
  readonly targetInstitutionId: string;
  readonly legalGround: string;
  readonly requestedRelief: string;
  readonly finalAgencyAction: true;
  readonly concreteClaimantInjury: true;
  readonly prospectiveNonmoneyRelief: true;
  readonly filedAt: string;
}

export interface IntegratedLegalContestRecord {
  readonly id: string;
  readonly claimId: string;
  readonly forumInstitutionId: string;
  readonly adjudicatorId: string;
  readonly stage: "ADMITTED" | "INTERIM_RELIEF_REQUESTED" | "RULED" | "ORDERED" | "NOTICED";
  readonly admittedAt: string;
}

export interface InterimReliefRequestRecord {
  readonly id: string;
  readonly contestId: string;
  readonly plaintiffSpecific: true;
  readonly requestedAt: string;
}

export interface JudicialRulingRecord {
  readonly id: string;
  readonly contestId: string;
  readonly adjudicatorId: string;
  readonly outcome: "GRANTED_SCOPED" | "DENIED";
  readonly reasons: readonly string[];
  readonly ruledAt: string;
}

export interface OperativeJudicialOrderRecord {
  readonly id: string;
  readonly contestId: string;
  readonly sourceRulingId: string;
  readonly subjectInstitutionId: string;
  readonly challengedDeterminationId: string;
  readonly directives: readonly string[];
  readonly plaintiffSpecific: true;
  readonly status: "ACTIVE";
  readonly issuedAt: string;
}

export interface JudicialNoticeRecord {
  readonly id: string;
  readonly orderId: string;
  readonly recipientInstitutionId: string;
  readonly receivedAt: string;
}

export interface AdministrativeOrderResponseRecord {
  readonly id: string;
  readonly orderId: string;
  readonly administrationId: string;
  readonly action: "COMPLY_PROSPECTIVELY" | "SEEK_APPELLATE_REVIEW";
  readonly complianceCompleted: false;
  readonly respondedAt: string;
}

export interface AppellateReviewRequestRecord {
  readonly id: string;
  readonly sourceOrderId: string;
  readonly forumInstitutionId: string;
  readonly requestingInstitutionId: string;
  readonly filedAt: string;
}

export interface StayRequestRecord {
  readonly id: string;
  readonly appellateRequestId: string;
  readonly requestedFromInstitutionId: string;
  readonly filedAt: string;
}

export interface StayDecisionRecord {
  readonly id: string;
  readonly requestId: string;
  readonly adjudicatorId: string;
  readonly outcome: "GRANTED" | "DENIED";
  readonly decidedAt: string;
}

export interface AppellateRulingRecord {
  readonly id: string;
  readonly requestId: string;
  readonly adjudicatorId: string;
  readonly outcome: "AFFIRMED" | "VACATED" | "DISMISSED";
  readonly ruledAt: string;
}

export interface IntegratedLegalContestRuntimeState {
  readonly schemaVersion: 1;
  readonly ownerId: string;
  readonly parameterHash: string;
  readonly judicialOffices: IntegratedLegalContestConfiguration["judicialOffices"];
  readonly judicialActors: IntegratedLegalContestConfiguration["judicialActors"];
  readonly judicialAssignments: IntegratedLegalContestConfiguration["judicialAssignments"];
  readonly claims: readonly IntegratedLegalClaimRecord[];
  readonly contests: readonly IntegratedLegalContestRecord[];
  readonly interimReliefRequests: readonly InterimReliefRequestRecord[];
  readonly rulings: readonly JudicialRulingRecord[];
  readonly operativeOrders: readonly OperativeJudicialOrderRecord[];
  readonly notices: readonly JudicialNoticeRecord[];
  readonly administrativeResponses: readonly AdministrativeOrderResponseRecord[];
  readonly appellateRequests: readonly AppellateReviewRequestRecord[];
  readonly stayRequests: readonly StayRequestRecord[];
  readonly stayDecisions: readonly StayDecisionRecord[];
  readonly appellateRulings: readonly AppellateRulingRecord[];
}

export const createIntegratedLegalContestRuntimeState = (
  configuration: IntegratedLegalContestConfiguration,
): IntegratedLegalContestRuntimeState => ({
  schemaVersion: 1,
  ownerId: configuration.ownerId,
  parameterHash: configuration.parameterHash,
  judicialOffices: configuration.judicialOffices.map((entry) => ({ ...entry })),
  judicialActors: configuration.judicialActors.map((entry) => ({ ...entry })),
  judicialAssignments: configuration.judicialAssignments.map((entry) => ({ ...entry })),
  claims: [],
  contests: [],
  interimReliefRequests: [],
  rulings: [],
  operativeOrders: [],
  notices: [],
  administrativeResponses: [],
  appellateRequests: [],
  stayRequests: [],
  stayDecisions: [],
  appellateRulings: [],
});

const exactlyOne = <T>(values: readonly T[], label: string): T => {
  if (values.length !== 1) throw new Error(`${label} requires exactly one canonical record.`);
  return values[0];
};

const nextStage = (
  state: IntegratedLegalContestRuntimeState,
  stage: IntegratedLegalContestRecord["stage"],
): IntegratedLegalContestRuntimeState => ({
  ...state,
  contests: state.contests.map((contest) => ({ ...contest, stage })),
});

const adjudicatorForInstitution = (
  configuration: IntegratedLegalContestConfiguration,
  institutionId: string,
): string | undefined => {
  const office = configuration.judicialOffices.find((entry) => entry.institutionId === institutionId);
  const assignment = configuration.judicialAssignments.find((entry) => entry.officeId === office?.id);
  return configuration.judicialActors.some((entry) => entry.id === assignment?.actorId)
    ? assignment?.actorId
    : undefined;
};

export const applyLegalContestBoundary = (
  state: IntegratedLegalContestRuntimeState,
  configuration: IntegratedLegalContestConfiguration,
  boundary: InstitutionalBoundaryConfiguration,
  determinations: readonly RelationshipQualificationDeterminationRecord[],
): IntegratedLegalContestRuntimeState => {
  const determination = determinations.find((entry) => entry.id === configuration.trigger.determinationId);
  if (determination === undefined) return state;
  if (boundary.id === configuration.claim.filingBoundaryId) {
    if (state.claims.length > 0) return state;
    if (
      determination.outcome !== configuration.trigger.outcome ||
      determination.formulaDisposition !== configuration.trigger.formulaDisposition ||
      determination.finalAgencyAction !== true || determination.prospectiveOnly !== true ||
      determination.moneyDamagesGranted !== false || determination.claimantId !== configuration.claimantId
    ) throw new Error("Legal claim trigger contradicts the final administrative determination.");
    return {
      ...state,
      claims: [{
        id: configuration.claim.id,
        claimantId: determination.claimantId,
        challengedDeterminationId: determination.id,
        targetInstitutionId: determination.institutionId,
        legalGround: configuration.claim.legalGround,
        requestedRelief: configuration.claim.requestedRelief,
        finalAgencyAction: true,
        concreteClaimantInjury: true,
        prospectiveNonmoneyRelief: true,
        filedAt: boundary.at,
      }],
    };
  }
  if (boundary.id === configuration.claim.admissionBoundaryId) {
    if (state.contests.length > 0) return state;
    const claim = exactlyOne(state.claims, "Contest admission");
    const adjudicatorId = adjudicatorForInstitution(configuration, configuration.forumInstitutionId);
    if (
      adjudicatorId === undefined || claim.finalAgencyAction !== configuration.admissionRequirements.finalAgencyAction ||
      claim.concreteClaimantInjury !== configuration.admissionRequirements.concreteClaimantInjury ||
      claim.prospectiveNonmoneyRelief !== configuration.admissionRequirements.prospectiveNonmoneyRelief ||
      configuration.admissionRequirements.reviewableClaim !== true
    ) throw new Error("Legal contest does not satisfy configured admission requirements.");
    return {
      ...state,
      contests: [{
        id: configuration.claim.contestId,
        claimId: claim.id,
        forumInstitutionId: configuration.forumInstitutionId,
        adjudicatorId,
        stage: "ADMITTED",
        admittedAt: boundary.at,
      }],
    };
  }
  if (boundary.id === configuration.interimRelief.requestBoundaryId) {
    if (state.interimReliefRequests.length > 0) return state;
    const contest = exactlyOne(state.contests, "Interim-relief request");
    return {
      ...nextStage(state, "INTERIM_RELIEF_REQUESTED"),
      interimReliefRequests: [{
        id: configuration.interimRelief.requestId,
        contestId: contest.id,
        plaintiffSpecific: true,
        requestedAt: boundary.at,
      }],
    };
  }
  if (boundary.id === configuration.interimRelief.rulingBoundaryId) {
    if (state.rulings.length > 0) return state;
    const contest = exactlyOne(state.contests, "Judicial ruling");
    exactlyOne(state.interimReliefRequests, "Judicial ruling source request");
    return {
      ...nextStage(state, "RULED"),
      rulings: [{
        id: configuration.interimRelief.rulingId,
        contestId: contest.id,
        adjudicatorId: contest.adjudicatorId,
        outcome: configuration.interimRelief.outcome,
        reasons: [...configuration.interimRelief.reasons],
        ruledAt: boundary.at,
      }],
    };
  }
  if (boundary.id === configuration.order.boundaryId) {
    if (state.operativeOrders.length > 0) return state;
    const ruling = exactlyOne(state.rulings, "Operative order source ruling");
    if (ruling.outcome !== "GRANTED_SCOPED") return state;
    return {
      ...nextStage(state, "ORDERED"),
      operativeOrders: [{
        id: configuration.order.id,
        contestId: ruling.contestId,
        sourceRulingId: ruling.id,
        subjectInstitutionId: configuration.targetInstitutionId,
        challengedDeterminationId: determination.id,
        directives: [...configuration.order.directives],
        plaintiffSpecific: true,
        status: "ACTIVE",
        issuedAt: boundary.at,
      }],
    };
  }
  if (boundary.id === configuration.order.noticeBoundaryId) {
    if (state.notices.length > 0 || state.operativeOrders.length === 0) return state;
    const order = exactlyOne(state.operativeOrders, "Judicial notice source order");
    return {
      ...nextStage(state, "NOTICED"),
      notices: [{
        id: configuration.order.noticeId,
        orderId: order.id,
        recipientInstitutionId: order.subjectInstitutionId,
        receivedAt: boundary.at,
      }],
    };
  }
  if (boundary.id === configuration.appeal.stayBoundaryId) {
    if (state.stayRequests.length === 0 || state.stayDecisions.length > 0) return state;
    const request = exactlyOne(state.stayRequests, "Stay decision request");
    const adjudicatorId = adjudicatorForInstitution(configuration, request.requestedFromInstitutionId);
    if (adjudicatorId === undefined) throw new Error("Stay request lacks a configured adjudicator.");
    return { ...state, stayDecisions: [{
      id: configuration.appeal.stayDecisionId,
      requestId: request.id,
      adjudicatorId,
      outcome: configuration.appeal.stayOutcome,
      decidedAt: boundary.at,
    }] };
  }
  if (boundary.id === configuration.appeal.rulingBoundaryId) {
    if (state.appellateRequests.length === 0 || state.appellateRulings.length > 0) return state;
    const request = exactlyOne(state.appellateRequests, "Appellate ruling request");
    const adjudicatorId = adjudicatorForInstitution(configuration, request.forumInstitutionId);
    if (adjudicatorId === undefined) throw new Error("Appellate request lacks a configured adjudicator.");
    return { ...state, appellateRulings: [{
      id: configuration.appeal.rulingId,
      requestId: request.id,
      adjudicatorId,
      outcome: configuration.appeal.rulingOutcome,
      ruledAt: boundary.at,
    }] };
  }
  return state;
};

export const recordAdministrativeOrderResponse = (
  state: IntegratedLegalContestRuntimeState,
  configuration: IntegratedLegalContestConfiguration,
  administrationId: string,
  action: AdministrativeOrderResponseRecord["action"],
  at: string,
): IntegratedLegalContestRuntimeState => {
  const notice = exactlyOne(state.notices, "Administrative order response notice");
  const order = exactlyOne(state.operativeOrders, "Administrative order response");
  if (notice.orderId !== order.id || state.administrativeResponses.length > 0) {
    throw new Error("Administrative order response is duplicate or lacks receipt.");
  }
  const response: AdministrativeOrderResponseRecord = {
    id: `${configuration.ownerId}.response.${action.toLowerCase()}`,
    orderId: order.id,
    administrationId,
    action,
    complianceCompleted: false,
    respondedAt: at,
  };
  if (action === "SEEK_APPELLATE_REVIEW") {
    return {
      ...state,
      administrativeResponses: [response],
      appellateRequests: [{
        id: configuration.appeal.requestId,
        sourceOrderId: order.id,
        forumInstitutionId: configuration.appellateInstitutionId,
        requestingInstitutionId: configuration.legalServiceInstitutionId,
        filedAt: at,
      }],
    };
  }
  return { ...state, administrativeResponses: [response] };
};

export const requestSeparateStay = (
  state: IntegratedLegalContestRuntimeState,
  configuration: IntegratedLegalContestConfiguration,
  at: string,
): IntegratedLegalContestRuntimeState => {
  const appeal = exactlyOne(state.appellateRequests, "Stay request appellate filing");
  if (state.stayRequests.length > 0) throw new Error("A stay request already exists.");
  return {
    ...state,
    stayRequests: [{
      id: configuration.appeal.stayRequestId,
      appellateRequestId: appeal.id,
      requestedFromInstitutionId: configuration.forumInstitutionId,
      filedAt: at,
    }],
  };
};

export const assertIntegratedLegalContestRuntimeState = (
  state: IntegratedLegalContestRuntimeState,
  configuration: IntegratedLegalContestConfiguration,
  determinations: readonly RelationshipQualificationDeterminationRecord[],
): void => {
  const unique = (values: readonly string[], label: string): void => {
    if (new Set(values).size !== values.length) throw new Error(`${label} contains duplicate identities.`);
  };
  if (
    state.schemaVersion !== 1 || state.ownerId !== configuration.ownerId ||
    state.parameterHash !== configuration.parameterHash ||
    JSON.stringify(state.judicialOffices) !== JSON.stringify(configuration.judicialOffices) ||
    JSON.stringify(state.judicialActors) !== JSON.stringify(configuration.judicialActors) ||
    JSON.stringify(state.judicialAssignments) !== JSON.stringify(configuration.judicialAssignments)
  ) throw new Error("Legal-contest state contradicts configured owner identity.");
  for (const collection of [
    state.claims, state.contests, state.interimReliefRequests, state.rulings, state.operativeOrders,
    state.notices, state.administrativeResponses, state.appellateRequests, state.stayRequests,
    state.stayDecisions, state.appellateRulings,
  ]) unique(collection.map((entry) => entry.id), "Legal-contest records");
  if (state.claims.length > 0) {
    const claim = exactlyOne(state.claims, "Legal claim");
    const determination = determinations.find((entry) => entry.id === claim.challengedDeterminationId);
    if (
      determination === undefined || determination.claimantId !== claim.claimantId ||
      determination.institutionId !== claim.targetInstitutionId || claim.id !== configuration.claim.id
    ) throw new Error("Legal claim lacks its canonical administrative determination.");
  }
  if (state.contests.some((entry) => !state.claims.some((claim) => claim.id === entry.claimId))) {
    throw new Error("Legal contest lacks its admitted claim.");
  }
  if (state.rulings.some((entry) => !state.contests.some((contest) => contest.id === entry.contestId))) {
    throw new Error("Judicial ruling lacks its contest.");
  }
  if (state.operativeOrders.some((entry) => !state.rulings.some((ruling) => ruling.id === entry.sourceRulingId))) {
    throw new Error("Operative judicial order lacks its separate ruling.");
  }
  if (state.notices.some((entry) => !state.operativeOrders.some((order) => order.id === entry.orderId))) {
    throw new Error("Judicial notice lacks its operative order.");
  }
  if (state.administrativeResponses.some((entry) => !state.notices.some((notice) => notice.orderId === entry.orderId))) {
    throw new Error("Administrative response precedes judicial notice.");
  }
  if (state.appellateRequests.some((entry) => !state.operativeOrders.some((order) => order.id === entry.sourceOrderId))) {
    throw new Error("Appellate request lacks its source order.");
  }
  if (state.stayRequests.some((entry) => !state.appellateRequests.some((appeal) => appeal.id === entry.appellateRequestId))) {
    throw new Error("Stay request is not separate from and dependent on appeal.");
  }
  if (state.stayDecisions.some((entry) => !state.stayRequests.some((request) => request.id === entry.requestId))) {
    throw new Error("Stay decision lacks its separate request.");
  }
  if (state.appellateRulings.some((entry) => !state.appellateRequests.some((request) => request.id === entry.requestId))) {
    throw new Error("Appellate ruling lacks its review request.");
  }
}
