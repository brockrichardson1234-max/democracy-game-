import type {
  IntegratedLegalContestConfiguration,
  InstitutionalBoundaryConfiguration,
  ScaffoldClassification,
} from "../configuration/types";
import type { RelationshipQualificationDeterminationRecord } from "./program-implementation";

export interface IntegratedLegalClaimRecord {
  readonly id: string;
  readonly claimantId: string;
  readonly respondentInstitutionId: string;
  readonly challengedActRef: string;
  readonly claimType: string;
  readonly theoryIdentifier: string;
  readonly requestedRelief: string;
  readonly filedAt: string;
  readonly forumInstitutionId: string;
  readonly status: "FILED";
  readonly eligibility: {
    readonly ruleVersion: string;
    readonly eligible: true;
    readonly basis: "CONFIGURED_RECIPIENT_CHALLENGES_OWN_FINAL_PROSPECTIVE_DETERMINATION";
  };
  readonly classification: ScaffoldClassification;
}

export interface CourtProceedingRecord {
  readonly id: string;
  readonly claimId: string;
  readonly courtInstitutionId: string;
  readonly adjudicatorId: string;
  readonly status: "DOCKETED" | "PENDING" | "RESOLVED";
  readonly docketedAt: string;
  readonly resolvedAt: string | null;
  readonly classification: ScaffoldClassification;
}

export interface InterimReliefRequestRecord {
  readonly id: string;
  readonly proceedingId: string;
  readonly requestedAt: string;
  readonly classification: ScaffoldClassification;
}

export interface LegalInterpretationRecord {
  readonly id: string;
  readonly challengedActRef: string;
  readonly proposition: string;
  readonly ruleVersion: string;
  readonly establishedAt: string;
  readonly classification: ScaffoldClassification;
}

export interface JudicialRulingRecord {
  readonly id: string;
  readonly proceedingId: string;
  readonly courtInstitutionId: string;
  readonly adjudicatorId: string;
  readonly disposition: "CLAIMANT_PREVAILS" | "RESPONDENT_PREVAILS";
  readonly interpretationId: string;
  readonly decisionRuleVersion: string;
  readonly decidedAt: string;
  readonly classification: ScaffoldClassification;
}

export interface JudicialOrderRecord {
  readonly id: string;
  readonly sourceRulingId: string;
  readonly targetInstitutionId: string;
  readonly requiredAct: string;
  readonly prohibitedAct: string;
  readonly scope: IntegratedLegalContestConfiguration["order"]["scope"];
  readonly issuedAt: string;
  readonly effectiveAt: string | null;
  readonly status: "ISSUED" | "OPERATIVE";
  readonly classification: ScaffoldClassification;
}

export interface JudicialNoticeRecord {
  readonly id: string;
  readonly orderId: string;
  readonly recipientInstitutionId: string;
  readonly receivedAt: string;
  readonly classification: ScaffoldClassification;
}

export interface ComplianceStateRecord {
  readonly id: string;
  readonly orderId: string;
  readonly targetInstitutionId: string;
  readonly administrationId: string;
  readonly status: "PENDING" | "COMPLIED" | "DELAYED" | "CONTESTED" | "NONCOMPLIANT";
  readonly cause: string;
  readonly recordedAt: string;
  readonly classification: "SIMULATION_GENERATED";
}

export interface AppealRecord {
  readonly id: string;
  readonly lowerRulingId: string;
  readonly sourceOrderId: string;
  readonly appellantInstitutionId: string;
  readonly courtInstitutionId: string;
  readonly status: "FILED" | "RESOLVED";
  readonly filedAt: string;
  readonly resolvedAt: string | null;
  readonly disposition: "AFFIRMED" | "REVERSED" | "VACATED" | "REMANDED" | null;
  readonly classification: "SIMULATION_GENERATED";
}

export interface StayRecord {
  readonly id: string;
  readonly targetOrderId: string;
  readonly appealId: string;
  readonly sourceCourtInstitutionId: string;
  readonly issuedAt: string;
  readonly status: "OPERATIVE" | "DENIED";
  readonly classification: ScaffoldClassification;
}

export interface LegalActionCommandRecord {
  readonly id: string;
  readonly administrationId: string;
  readonly action: "COMPLY" | "DELAY" | "CONTEST" | "NONCOMPLY" | "REQUEST_STAY";
  readonly targetOrderId: string;
  readonly issuedAt: string;
}

export interface IntegratedLegalContestRuntimeState {
  readonly schemaVersion: 1;
  readonly ownerId: string;
  readonly parameterHash: string;
  readonly judicialOffices: IntegratedLegalContestConfiguration["judicialOffices"];
  readonly judicialActors: IntegratedLegalContestConfiguration["judicialActors"];
  readonly judicialAssignments: IntegratedLegalContestConfiguration["judicialAssignments"];
  readonly claims: readonly IntegratedLegalClaimRecord[];
  readonly proceedings: readonly CourtProceedingRecord[];
  readonly interimReliefRequests: readonly InterimReliefRequestRecord[];
  readonly interpretations: readonly LegalInterpretationRecord[];
  readonly rulings: readonly JudicialRulingRecord[];
  readonly orders: readonly JudicialOrderRecord[];
  readonly notices: readonly JudicialNoticeRecord[];
  readonly complianceStates: readonly ComplianceStateRecord[];
  readonly appeals: readonly AppealRecord[];
  readonly stays: readonly StayRecord[];
  readonly actionCommands: readonly LegalActionCommandRecord[];
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
  claims: [], proceedings: [], interimReliefRequests: [], interpretations: [], rulings: [], orders: [], notices: [],
  complianceStates: [], appeals: [], stays: [], actionCommands: [],
});

const exactlyOne = <T>(values: readonly T[], label: string): T => {
  if (values.length !== 1) throw new Error(`${label} requires exactly one canonical record.`);
  return values[0];
};

const adjudicatorForInstitution = (
  configuration: IntegratedLegalContestConfiguration,
  institutionId: string,
): string | undefined => {
  const office = configuration.judicialOffices.find((entry) => entry.institutionId === institutionId);
  const assignment = configuration.judicialAssignments.find((entry) => entry.officeId === office?.id);
  return configuration.judicialActors.some((entry) => entry.id === assignment?.actorId) ? assignment?.actorId : undefined;
};

export const deriveOrderEnforceability = (
  state: IntegratedLegalContestRuntimeState,
  orderId: string,
): "OPERATIVE" | "STAYED" | "SUPERSEDED" => {
  const appeal = state.appeals.find((entry) => entry.sourceOrderId === orderId);
  if (appeal?.status === "RESOLVED" && ["REVERSED", "VACATED"].includes(appeal.disposition ?? "")) return "SUPERSEDED";
  const stayed = state.stays.some((entry) => entry.targetOrderId === orderId && entry.status === "OPERATIVE");
  return stayed && appeal?.status !== "RESOLVED" ? "STAYED" : "OPERATIVE";
};

export const applyLegalContestBoundary = (
  state: IntegratedLegalContestRuntimeState,
  configuration: IntegratedLegalContestConfiguration,
  boundary: InstitutionalBoundaryConfiguration,
  determinations: readonly RelationshipQualificationDeterminationRecord[],
  currentAdministrationId: string,
): IntegratedLegalContestRuntimeState => {
  const determination = determinations.find((entry) => entry.id === configuration.trigger.determinationId);
  if (determination === undefined || Date.parse(determination.issuedAt) > Date.parse(boundary.at)) return state;
  if (boundary.id === configuration.claim.filingBoundaryId) {
    if (state.claims.length > 0) return state;
    const eligible = determination.claimantId === configuration.claimantId &&
      determination.relationshipId === configuration.relationshipId &&
      determination.institutionId === configuration.targetInstitutionId && determination.finalAgencyAction === true &&
      determination.prospectiveOnly === true && determination.moneyDamagesGranted === false &&
      determination.outcome === configuration.trigger.outcome &&
      determination.formulaDisposition === configuration.trigger.formulaDisposition;
    if (!eligible) return state;
    return { ...state, claims: [{
      id: configuration.claim.id,
      claimantId: determination.claimantId,
      respondentInstitutionId: determination.institutionId,
      challengedActRef: determination.id,
      claimType: configuration.claim.claimType,
      theoryIdentifier: configuration.claim.theoryIdentifier,
      requestedRelief: configuration.claim.requestedRelief,
      filedAt: boundary.at,
      forumInstitutionId: configuration.forumInstitutionId,
      status: "FILED",
      eligibility: {
        ruleVersion: configuration.standingRuleVersion,
        eligible: true,
        basis: "CONFIGURED_RECIPIENT_CHALLENGES_OWN_FINAL_PROSPECTIVE_DETERMINATION",
      },
      classification: configuration.classification,
    }] };
  }
  if (boundary.id === configuration.claim.docketBoundaryId) {
    if (state.proceedings.length > 0 || state.claims.length === 0) return state;
    const claim = exactlyOne(state.claims, "Proceeding docket");
    const adjudicatorId = adjudicatorForInstitution(configuration, configuration.forumInstitutionId);
    if (adjudicatorId === undefined || configuration.admissionRequirements.reviewableClaim !== true) return state;
    return { ...state, proceedings: [{
      id: configuration.claim.proceedingId, claimId: claim.id,
      courtInstitutionId: configuration.forumInstitutionId, adjudicatorId,
      status: "DOCKETED", docketedAt: boundary.at, resolvedAt: null,
      classification: configuration.classification,
    }] };
  }
  if (boundary.id === configuration.interimRelief.requestBoundaryId) {
    if (state.interimReliefRequests.length > 0 || state.proceedings.length === 0) return state;
    const proceeding = exactlyOne(state.proceedings, "Interim-relief request");
    return { ...state, proceedings: [{ ...proceeding, status: "PENDING" }], interimReliefRequests: [{
      id: configuration.interimRelief.requestId, proceedingId: proceeding.id,
      requestedAt: boundary.at, classification: configuration.classification,
    }] };
  }
  if (boundary.id === configuration.ruling.boundaryId) {
    if (state.rulings.length > 0 || state.interimReliefRequests.length === 0) return state;
    const proceeding = exactlyOne(state.proceedings, "Judicial ruling proceeding");
    const procedureMissing = !determination.procedureRecordIds.includes(configuration.trigger.requiredProcedureRecord);
    const disposition = procedureMissing ? configuration.ruling.claimantDisposition : configuration.ruling.respondentDisposition;
    const interpretation: LegalInterpretationRecord = {
      id: configuration.interpretation.id,
      challengedActRef: determination.id,
      proposition: procedureMissing
        ? configuration.interpretation.missingProcedureProposition
        : configuration.interpretation.authorityValidProposition,
      ruleVersion: configuration.legalValidityRuleVersion,
      establishedAt: boundary.at,
      classification: configuration.classification,
    };
    return {
      ...state,
      proceedings: [{ ...proceeding, status: "RESOLVED", resolvedAt: boundary.at }],
      interpretations: [interpretation],
      rulings: [{
        id: configuration.ruling.id, proceedingId: proceeding.id,
        courtInstitutionId: proceeding.courtInstitutionId, adjudicatorId: proceeding.adjudicatorId,
        disposition, interpretationId: interpretation.id, decisionRuleVersion: configuration.outcomeRuleVersion,
        decidedAt: boundary.at, classification: configuration.classification,
      }],
    };
  }
  if (boundary.id === configuration.order.issueBoundaryId) {
    if (state.orders.length > 0 || state.rulings[0]?.disposition !== "CLAIMANT_PREVAILS") return state;
    return { ...state, orders: [{
      id: configuration.order.id, sourceRulingId: state.rulings[0].id,
      targetInstitutionId: configuration.targetInstitutionId,
      requiredAct: configuration.order.requiredAct, prohibitedAct: configuration.order.prohibitedAct,
      scope: { ...configuration.order.scope }, issuedAt: boundary.at, effectiveAt: null,
      status: "ISSUED", classification: configuration.classification,
    }] };
  }
  if (boundary.id === configuration.order.effectiveBoundaryId) {
    if (state.orders.length === 0 || state.orders[0].status === "OPERATIVE") return state;
    return { ...state, orders: [{ ...state.orders[0], status: "OPERATIVE", effectiveAt: boundary.at }] };
  }
  if (boundary.id === configuration.order.noticeBoundaryId) {
    if (state.notices.length > 0 || state.orders[0]?.status !== "OPERATIVE") return state;
    const order = state.orders[0];
    return { ...state,
      notices: [{ id: configuration.order.noticeId, orderId: order.id,
        recipientInstitutionId: order.targetInstitutionId, receivedAt: boundary.at,
        classification: configuration.classification }],
      complianceStates: [{ id: `${configuration.ownerId}.compliance.pending`, orderId: order.id,
        targetInstitutionId: order.targetInstitutionId, administrationId: currentAdministrationId,
        status: "PENDING", cause: configuration.order.noticeId, recordedAt: boundary.at,
        classification: "SIMULATION_GENERATED" }],
    };
  }
  if (boundary.id === configuration.appeal.stayBoundaryId) {
    if (state.stays.length > 0 || state.appeals.length === 0 ||
      !state.actionCommands.some((entry) => entry.action === "REQUEST_STAY")) return state;
    const appeal = state.appeals[0];
    return { ...state, stays: [{
      id: configuration.appeal.stayId, targetOrderId: appeal.sourceOrderId, appealId: appeal.id,
      sourceCourtInstitutionId: configuration.forumInstitutionId, issuedAt: boundary.at,
      status: configuration.appeal.stayOutcome === "GRANTED" ? "OPERATIVE" : "DENIED",
      classification: configuration.classification,
    }] };
  }
  if (boundary.id === configuration.appeal.rulingBoundaryId) {
    if (state.appeals.length === 0 || state.appeals[0].status === "RESOLVED") return state;
    return { ...state, appeals: [{ ...state.appeals[0], status: "RESOLVED", resolvedAt: boundary.at,
      disposition: configuration.appeal.rulingOutcome }] };
  }
  if (boundary.id === configuration.compliance.deadlineBoundaryId && state.notices.length > 0 &&
    state.complianceStates.at(-1)?.status === "PENDING") {
    return { ...state, complianceStates: [...state.complianceStates, {
      id: `${configuration.ownerId}.compliance.deadline-delayed`, orderId: state.orders[0].id,
      targetInstitutionId: state.orders[0].targetInstitutionId, administrationId: currentAdministrationId,
      status: "DELAYED", cause: "COMPLIANCE_DEADLINE_ELAPSED_WITHOUT_OWNER_RESPONSE", recordedAt: boundary.at,
      classification: "SIMULATION_GENERATED",
    }] };
  }
  return state;
};

export const recordAdministrativeComplianceResponse = (
  state: IntegratedLegalContestRuntimeState,
  configuration: IntegratedLegalContestConfiguration,
  administrationId: string,
  action: "COMPLY" | "DELAY" | "CONTEST" | "NONCOMPLY",
  at: string,
): IntegratedLegalContestRuntimeState => {
  const notice = exactlyOne(state.notices, "Compliance response notice");
  const order = exactlyOne(state.orders, "Compliance response order");
  if (notice.orderId !== order.id || state.complianceStates.at(-1)?.status !== "PENDING" ||
    !configuration.compliance.allowedResponses.includes(action)) {
    throw new Error("Administrative compliance response is unavailable, duplicate, or unconfigured.");
  }
  const command: LegalActionCommandRecord = {
    id: `${configuration.ownerId}.command.${state.actionCommands.length + 1}`,
    administrationId, action, targetOrderId: order.id, issuedAt: at,
  };
  const status = ({ COMPLY: "COMPLIED", DELAY: "DELAYED", CONTEST: "CONTESTED", NONCOMPLY: "NONCOMPLIANT" } as const)[action];
  const next: IntegratedLegalContestRuntimeState = {
    ...state,
    actionCommands: [...state.actionCommands, command],
    complianceStates: [...state.complianceStates, {
      id: `${configuration.ownerId}.compliance.${action.toLowerCase()}`, orderId: order.id,
      targetInstitutionId: order.targetInstitutionId, administrationId, status, cause: command.id,
      recordedAt: at, classification: "SIMULATION_GENERATED",
    }],
  };
  return action !== "CONTEST" ? next : { ...next, appeals: [{
    id: configuration.appeal.requestId, lowerRulingId: order.sourceRulingId, sourceOrderId: order.id,
    appellantInstitutionId: configuration.targetInstitutionId, courtInstitutionId: configuration.appellateInstitutionId,
    status: "FILED", filedAt: at, resolvedAt: null, disposition: null,
    classification: "SIMULATION_GENERATED",
  }] };
};

export const requestSeparateStay = (
  state: IntegratedLegalContestRuntimeState,
  configuration: IntegratedLegalContestConfiguration,
  administrationId: string,
  at: string,
): IntegratedLegalContestRuntimeState => {
  if (state.appeals[0]?.status !== "FILED" || state.actionCommands.some((entry) => entry.action === "REQUEST_STAY")) {
    throw new Error("A stay request requires one pending appeal and may occur only once.");
  }
  return { ...state, actionCommands: [...state.actionCommands, {
    id: `${configuration.ownerId}.command.${state.actionCommands.length + 1}`,
    administrationId, action: "REQUEST_STAY", targetOrderId: exactlyOne(state.orders, "Stay order").id, issuedAt: at,
  }] };
};

export const assertIntegratedLegalContestRuntimeState = (
  state: IntegratedLegalContestRuntimeState,
  configuration: IntegratedLegalContestConfiguration,
  determinations: readonly RelationshipQualificationDeterminationRecord[],
): void => {
  const unique = (values: readonly string[], label: string): void => {
    if (new Set(values).size !== values.length) throw new Error(`${label} contains duplicate identities.`);
  };
  if (state.schemaVersion !== 1 || state.ownerId !== configuration.ownerId || state.parameterHash !== configuration.parameterHash ||
    JSON.stringify(state.judicialOffices) !== JSON.stringify(configuration.judicialOffices) ||
    JSON.stringify(state.judicialActors) !== JSON.stringify(configuration.judicialActors) ||
    JSON.stringify(state.judicialAssignments) !== JSON.stringify(configuration.judicialAssignments)) {
    throw new Error("Legal-contest state contradicts configured owner identity.");
  }
  for (const collection of [state.claims, state.proceedings, state.interimReliefRequests, state.interpretations,
    state.rulings, state.orders, state.notices, state.complianceStates, state.appeals, state.stays, state.actionCommands]) {
    unique(collection.map((entry) => entry.id), "Legal-contest records");
  }
  const claim = state.claims[0];
  if (claim !== undefined) {
    const determination = determinations.find((entry) => entry.id === claim.challengedActRef);
    if (state.claims.length !== 1 || determination === undefined || claim.id !== configuration.claim.id ||
      claim.claimantId !== determination.claimantId || claim.respondentInstitutionId !== determination.institutionId ||
      claim.forumInstitutionId !== configuration.forumInstitutionId ||
      claim.eligibility.ruleVersion !== configuration.standingRuleVersion) {
      throw new Error("Legal claim lacks its canonical administrative act, party, forum, or eligibility rule.");
    }
  }
  if (state.proceedings.some((entry) => entry.claimId !== claim?.id || entry.id !== configuration.claim.proceedingId)) {
    throw new Error("Court proceeding lacks its separately filed claim.");
  }
  if (state.interpretations.some((entry) => entry.id !== configuration.interpretation.id ||
    entry.challengedActRef !== claim?.challengedActRef)) throw new Error("Legal interpretation exceeds the bounded challenged act.");
  if (state.rulings.some((entry) => !state.proceedings.some((item) => item.id === entry.proceedingId) ||
    !state.interpretations.some((item) => item.id === entry.interpretationId))) {
    throw new Error("Judicial ruling lacks its distinct proceeding or interpretation.");
  }
  if (state.orders.some((entry) => !state.rulings.some((item) => item.id === entry.sourceRulingId) ||
    JSON.stringify(entry.scope) !== JSON.stringify(configuration.order.scope) ||
    entry.targetInstitutionId !== configuration.targetInstitutionId)) throw new Error("Judicial order lacks its ruling or exact scope.");
  if (state.notices.some((entry) => !state.orders.some((item) => item.id === entry.orderId))) throw new Error("Judicial notice lacks its order.");
  if (state.complianceStates.some((entry) => !state.orders.some((item) => item.id === entry.orderId) ||
    entry.targetInstitutionId !== configuration.targetInstitutionId)) throw new Error("Compliance state lacks its exact target.");
  if (state.appeals.some((entry) => !state.rulings.some((item) => item.id === entry.lowerRulingId) ||
    !state.orders.some((item) => item.id === entry.sourceOrderId))) throw new Error("Appeal lacks its preserved lower disposition.");
  if (state.stays.some((entry) => !state.orders.some((item) => item.id === entry.targetOrderId) ||
    !state.appeals.some((item) => item.id === entry.appealId))) throw new Error("Stay lacks its separate targets.");
  if (state.actionCommands.some((entry) => !state.orders.some((item) => item.id === entry.targetOrderId) ||
    !Number.isFinite(Date.parse(entry.issuedAt)))) throw new Error("Legal action command lacks its exact order or timestamp.");
};
