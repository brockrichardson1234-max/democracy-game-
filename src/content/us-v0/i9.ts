import { sha256Hex } from "../../configuration/sha256";
import type {
  InstitutionalBoundaryConfiguration,
  IntegratedLegalContestConfiguration,
  IntegratedTemporalConfiguration,
} from "../../configuration/types";
import {
  US_DISTRICT_COLORADO_COURT_ID,
  US_HUD_INSTITUTION_ID,
  US_TENTH_CIRCUIT_COURT_ID,
} from "./topology";
import { US_V0_I8_RUNTIME_ARTIFACTS, US_V0_I8_TEMPORAL_CONFIGURATION } from "./i8";

export const US_V0_I9_LEGAL_CONTEST_SEMANTICS_VERSION = "0.9.1-i9-repair";
export const US_V0_I9_STANDING_RULE_VERSION = "configured-recipient-final-act-eligibility-1";
export const US_V0_I9_OUTCOME_RULE_VERSION = "required-procedure-deterministic-merits-1";
export const US_V0_I9_LEGAL_VALIDITY_RULE_VERSION = "procedure-record-authority-validity-1";
export const US_V0_I9_OWNER_ID = "us.legal-contest.arapahoe-requalification-1";
export const US_V0_I9_DETERMINATION_ID = "us.administrative-determination.arapahoe-requalification-rejected-2027";
export const US_V0_I9_FILING = "2027-02-01T12:00:00-05:00";
export const US_V0_I9_DOCKET = "2027-02-02T12:00:00-05:00";
export const US_V0_I9_INTERIM_REQUEST = "2027-02-03T12:00:00-05:00";
export const US_V0_I9_RULING = "2027-02-10T12:00:00-05:00";
export const US_V0_I9_NOTICE = "2027-02-11T12:00:00-05:00";
export const US_V0_I9_STAY_DECISION = "2027-03-01T12:00:00-05:00";
export const US_V0_I9_COMPLIANCE_DEADLINE = "2027-03-05T12:00:00-05:00";
export const US_V0_I9_ADMINISTRATIVE_ACTION = US_V0_I9_COMPLIANCE_DEADLINE;
export const US_V0_I9_APPELLATE_RULING = "2029-02-01T12:00:00-05:00";

const CLASSIFICATION = "APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD" as const;
const COURT_PHASE = -2_000;
const IMPLEMENTATION_PHASE = -1_000;

export interface UsV0I9RouteOptions {
  readonly stayOutcome?: "GRANTED" | "DENIED";
  readonly appellateDisposition?: "AFFIRMED" | "REVERSED" | "VACATED" | "REMANDED";
  readonly administrativeActionAt?: string;
  readonly administrativeActionPhase?: number;
  readonly reverseDeclarationOrder?: boolean;
  readonly filingAt?: string;
  readonly docketAt?: string;
  readonly interimRequestAt?: string;
  readonly rulingAt?: string;
  readonly noticeAt?: string;
  readonly stayAt?: string;
  readonly complianceAt?: string;
  readonly appealAt?: string;
}

export const createUsV0I9RouteConfiguration = (
  options: UsV0I9RouteOptions = {},
  baseTemporal: IntegratedTemporalConfiguration = US_V0_I8_TEMPORAL_CONFIGURATION,
): { readonly legalContest: IntegratedLegalContestConfiguration; readonly temporal: IntegratedTemporalConfiguration } => {
  const claim = {
    id: "us.legal-claim.arapahoe-requalification-2027",
    proceedingId: "us.court-proceeding.arapahoe-requalification-2027",
    filingBoundaryId: `${US_V0_I9_OWNER_ID}.claim-filed`,
    docketBoundaryId: `${US_V0_I9_OWNER_ID}.proceeding-docketed`,
    claimType: "ADMINISTRATIVE_REVIEW",
    theoryIdentifier: "REQUIRED_PROCEDURE_MISSING",
    requestedRelief: "PLAINTIFF_SPECIFIC_PROSPECTIVE_PRESERVATION_AND_RECONSIDERATION",
  };
  const interimRelief = {
    requestId: "us.interim-relief-request.arapahoe-requalification-2027",
    requestBoundaryId: `${US_V0_I9_OWNER_ID}.interim-relief-requested`,
  };
  const ruling = {
    id: "us.judicial-ruling.arapahoe-requalification-2027",
    boundaryId: `${US_V0_I9_OWNER_ID}.ruling-issued`,
    claimantDisposition: "CLAIMANT_PREVAILS" as const,
    respondentDisposition: "RESPONDENT_PREVAILS" as const,
  };
  const order = {
    id: "us.judicial-order.arapahoe-requalification-2027",
    issueBoundaryId: `${US_V0_I9_OWNER_ID}.order-issued`,
    effectiveBoundaryId: `${US_V0_I9_OWNER_ID}.order-effective`,
    noticeId: "us.judicial-notice.arapahoe-requalification-2027",
    noticeBoundaryId: `${US_V0_I9_OWNER_ID}.notice-received`,
    requiredAct: "RECONSIDER_PLAINTIFF_SPECIFIC_REQUALIFICATION_USING_REQUIRED_PROCEDURE",
    prohibitedAct: "EXECUTE_CHALLENGED_RELATIONSHIP_FORMULA_REDIRECTION_PENDING_RECONSIDERATION",
    scope: {
      programId: "us.program.hud.home",
      relationshipId: "us.relationship.home.arapahoe-consortium.fy2025-2027",
      determinationId: US_V0_I9_DETERMINATION_ID,
      targetInstitutionId: US_HUD_INSTITUTION_ID,
    },
  };
  const appeal = {
    requestId: "us.appeal.arapahoe-requalification-2027",
    stayRequestId: "us.stay-request.arapahoe-requalification-2027",
    stayId: "us.stay.arapahoe-requalification-2027",
    stayBoundaryId: `${US_V0_I9_OWNER_ID}.stay-resolved`,
    stayOutcome: options.stayOutcome ?? "DENIED" as const,
    rulingId: "us.appellate-ruling.arapahoe-requalification-2029",
    rulingBoundaryId: `${US_V0_I9_OWNER_ID}.appeal-resolved`,
    rulingOutcome: options.appellateDisposition ?? "AFFIRMED" as const,
  };
  const compliance = {
    deadlineBoundaryId: `${US_V0_I9_OWNER_ID}.compliance-deadline`,
    allowedResponses: ["COMPLY", "DELAY", "CONTEST", "NONCOMPLY"] as const,
  };
  const administrativeAction = {
    id: "us.administrative-action.arapahoe-formula-redirection-2027",
    boundaryId: `${US_V0_I9_OWNER_ID}.administrative-redirection-attempt`,
  };
  const withoutHash = {
    schemaVersion: 1 as const,
    ownerId: US_V0_I9_OWNER_ID,
    semanticsVersion: US_V0_I9_LEGAL_CONTEST_SEMANTICS_VERSION,
    standingRuleVersion: US_V0_I9_STANDING_RULE_VERSION,
    outcomeRuleVersion: US_V0_I9_OUTCOME_RULE_VERSION,
    legalValidityRuleVersion: US_V0_I9_LEGAL_VALIDITY_RULE_VERSION,
    classification: CLASSIFICATION,
    forumInstitutionId: US_DISTRICT_COLORADO_COURT_ID,
    appellateInstitutionId: US_TENTH_CIRCUIT_COURT_ID,
    targetInstitutionId: US_HUD_INSTITUTION_ID,
    legalServiceInstitutionId: "us.institution.doj",
    claimantId: "us.recipient.arapahoe-county",
    relationshipId: "us.relationship.home.arapahoe-consortium.fy2025-2027",
    judicialOffices: [
      { id: "us.office.judicial.d-colorado-bounded-route", institutionId: US_DISTRICT_COLORADO_COURT_ID },
      { id: "us.office.judicial.tenth-circuit-bounded-route", institutionId: US_TENTH_CIRCUIT_COURT_ID },
    ],
    judicialActors: [
      { id: "us.actor.judicial.d-colorado-bounded-scaffold", classification: CLASSIFICATION },
      { id: "us.actor.judicial.tenth-circuit-bounded-scaffold", classification: CLASSIFICATION },
    ],
    judicialAssignments: [
      { id: "us.assignment.judicial.d-colorado-bounded-route", officeId: "us.office.judicial.d-colorado-bounded-route", actorId: "us.actor.judicial.d-colorado-bounded-scaffold", effectiveFrom: "2026-08-22T00:00:00-04:00", effectiveUntil: null },
      { id: "us.assignment.judicial.tenth-circuit-bounded-route", officeId: "us.office.judicial.tenth-circuit-bounded-route", actorId: "us.actor.judicial.tenth-circuit-bounded-scaffold", effectiveFrom: "2026-08-22T00:00:00-04:00", effectiveUntil: null },
    ],
    trigger: {
      determinationId: US_V0_I9_DETERMINATION_ID,
      outcome: "REQUALIFICATION_REJECTED" as const,
      formulaDisposition: "DIRECTED_OUT_OF_RELATIONSHIP_PENDING_EXECUTION" as const,
      requiredProcedureRecord: "CONSORTIUM_REQUALIFICATION_NOTICE_AND_OPPORTUNITY_TO_RESPOND",
      prospectiveOnly: true as const,
      moneyDamagesRequested: false as const,
    },
    claim,
    interimRelief,
    ruling,
    interpretation: {
      id: "us.legal-interpretation.arapahoe-required-procedure-2027",
      missingProcedureProposition: "CHALLENGED_REQUALIFICATION_AUTHORITY_INVALID_WITHOUT_CONFIGURED_REQUIRED_PROCEDURE",
      authorityValidProposition: "CHALLENGED_REQUALIFICATION_AUTHORITY_VALID_WHEN_CONFIGURED_REQUIRED_PROCEDURE_PRESENT",
    },
    order,
    appeal,
    compliance,
    administrativeAction,
    admissionRequirements: {
      finalAgencyAction: true as const,
      concreteClaimantInjury: true as const,
      prospectiveNonmoneyRelief: true as const,
      reviewableClaim: true as const,
    },
  };
  const legalContest: IntegratedLegalContestConfiguration = {
    ...withoutHash,
    parameterHash: sha256Hex(JSON.stringify(withoutHash)),
  };
  const declared: readonly InstitutionalBoundaryConfiguration[] = [
    { id: claim.filingBoundaryId, at: options.filingAt ?? US_V0_I9_FILING, phase: COURT_PHASE, order: 0, stableKey: `${US_V0_I9_OWNER_ID}:00`, kind: "LEGAL_CLAIM_FILED", ownerId: US_V0_I9_OWNER_ID },
    { id: claim.docketBoundaryId, at: options.docketAt ?? US_V0_I9_DOCKET, phase: COURT_PHASE, order: 1, stableKey: `${US_V0_I9_OWNER_ID}:01`, kind: "LEGAL_PROCEEDING_DOCKETED", ownerId: US_V0_I9_OWNER_ID },
    { id: interimRelief.requestBoundaryId, at: options.interimRequestAt ?? US_V0_I9_INTERIM_REQUEST, phase: COURT_PHASE, order: 2, stableKey: `${US_V0_I9_OWNER_ID}:02`, kind: "INTERIM_RELIEF_REQUESTED", ownerId: US_V0_I9_OWNER_ID },
    { id: ruling.boundaryId, at: options.rulingAt ?? US_V0_I9_RULING, phase: COURT_PHASE, order: 3, stableKey: `${US_V0_I9_OWNER_ID}:03`, kind: "JUDICIAL_RULING_ISSUED", ownerId: US_V0_I9_OWNER_ID },
    { id: order.issueBoundaryId, at: options.rulingAt ?? US_V0_I9_RULING, phase: COURT_PHASE, order: 4, stableKey: `${US_V0_I9_OWNER_ID}:04`, kind: "JUDICIAL_ORDER_ISSUED", ownerId: US_V0_I9_OWNER_ID },
    { id: order.effectiveBoundaryId, at: options.rulingAt ?? US_V0_I9_RULING, phase: COURT_PHASE, order: 5, stableKey: `${US_V0_I9_OWNER_ID}:05`, kind: "JUDICIAL_ORDER_EFFECTIVE", ownerId: US_V0_I9_OWNER_ID },
    { id: order.noticeBoundaryId, at: options.noticeAt ?? US_V0_I9_NOTICE, phase: COURT_PHASE, order: 6, stableKey: `${US_V0_I9_OWNER_ID}:06`, kind: "JUDICIAL_NOTICE_RECEIVED", ownerId: US_V0_I9_OWNER_ID },
    { id: appeal.stayBoundaryId, at: options.stayAt ?? US_V0_I9_STAY_DECISION, phase: COURT_PHASE, order: 7, stableKey: `${US_V0_I9_OWNER_ID}:07`, kind: "STAY_RESOLVED", ownerId: US_V0_I9_OWNER_ID },
    { id: compliance.deadlineBoundaryId, at: options.complianceAt ?? US_V0_I9_COMPLIANCE_DEADLINE, phase: COURT_PHASE, order: 8, stableKey: `${US_V0_I9_OWNER_ID}:08`, kind: "COMPLIANCE_DEADLINE", ownerId: US_V0_I9_OWNER_ID },
    { id: administrativeAction.boundaryId, at: options.administrativeActionAt ?? options.complianceAt ?? US_V0_I9_ADMINISTRATIVE_ACTION, phase: options.administrativeActionPhase ?? IMPLEMENTATION_PHASE, order: 0, stableKey: `${US_V0_I9_OWNER_ID}:09`, kind: "ADMINISTRATIVE_REDIRECTION_ATTEMPT", ownerId: US_V0_I9_OWNER_ID },
    { id: appeal.rulingBoundaryId, at: options.appealAt ?? US_V0_I9_APPELLATE_RULING, phase: COURT_PHASE, order: 10, stableKey: `${US_V0_I9_OWNER_ID}:10`, kind: "APPEAL_RESOLVED", ownerId: US_V0_I9_OWNER_ID },
  ];
  const added = options.reverseDeclarationOrder === true ? [...declared].reverse() : declared;
  const boundaries = [...baseTemporal.boundaries, ...added]
    .sort((left, right) => Date.parse(left.at) - Date.parse(right.at) || left.phase - right.phase ||
      left.order - right.order || left.stableKey.localeCompare(right.stableKey) || left.id.localeCompare(right.id));
  const temporalWithoutHash = {
    schemaVersion: baseTemporal.schemaVersion,
    scheduleVersion: "us-v0-institutional-information-legal-calendar-2",
    scheduleContentHash: sha256Hex(JSON.stringify(boundaries)),
    assignmentCycleContentHash: baseTemporal.assignmentCycleContentHash,
    selectionContentHash: baseTemporal.selectionContentHash,
    initialTermLabel: baseTemporal.initialTermLabel,
    boundaries,
    assignmentCycles: baseTemporal.assignmentCycles,
    selection: baseTemporal.selection,
    newProcedureIdPrefix: baseTemporal.newProcedureIdPrefix,
    initialAdministration: baseTemporal.initialAdministration,
  };
  return {
    legalContest,
    temporal: { ...temporalWithoutHash, parameterHash: sha256Hex(JSON.stringify(temporalWithoutHash)) },
  };
};

const defaultRoute = createUsV0I9RouteConfiguration();
export const US_V0_I9_LEGAL_CONTEST_CONFIGURATION = defaultRoute.legalContest;
export const US_V0_I9_TEMPORAL_CONFIGURATION = defaultRoute.temporal;
export const US_V0_I9_RUNTIME_ARTIFACTS = US_V0_I8_RUNTIME_ARTIFACTS;
