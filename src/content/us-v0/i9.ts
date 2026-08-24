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

export const US_V0_I9_LEGAL_CONTEST_SEMANTICS_VERSION = "us-v0-bounded-legal-contest-1";
export const US_V0_I9_OWNER_ID = "us.legal-contest.arapahoe-requalification-1";
export const US_V0_I9_DETERMINATION_ID = "us.administrative-determination.arapahoe-requalification-rejected-2027";
export const US_V0_I9_FILING = "2027-02-01T12:00:00-05:00";
export const US_V0_I9_ADMISSION = "2027-02-02T12:00:00-05:00";
export const US_V0_I9_INTERIM_REQUEST = "2027-02-03T12:00:00-05:00";
export const US_V0_I9_RULING = "2027-02-10T12:00:00-05:00";
export const US_V0_I9_NOTICE = "2027-02-11T12:00:00-05:00";
export const US_V0_I9_STAY_DECISION = "2027-03-01T12:00:00-05:00";
export const US_V0_I9_APPELLATE_RULING = "2027-03-15T12:00:00-04:00";

const CLASSIFICATION = "APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD" as const;
const legalContestWithoutHash = {
  schemaVersion: 1,
  ownerId: US_V0_I9_OWNER_ID,
  semanticsVersion: US_V0_I9_LEGAL_CONTEST_SEMANTICS_VERSION,
  classification: CLASSIFICATION,
  forumInstitutionId: US_DISTRICT_COLORADO_COURT_ID,
  appellateInstitutionId: US_TENTH_CIRCUIT_COURT_ID,
  targetInstitutionId: US_HUD_INSTITUTION_ID,
  legalServiceInstitutionId: "us.institution.doj",
  claimantId: "us.recipient.arapahoe-county",
  relationshipId: "us.relationship.home.arapahoe-consortium.fy2025-2027",
  judicialOffices: [
    {
      id: "us.office.judicial.d-colorado-bounded-route",
      institutionId: US_DISTRICT_COLORADO_COURT_ID,
    },
    {
      id: "us.office.judicial.tenth-circuit-bounded-route",
      institutionId: US_TENTH_CIRCUIT_COURT_ID,
    },
  ],
  judicialActors: [
    { id: "us.actor.judicial.d-colorado-bounded-scaffold", classification: CLASSIFICATION },
    { id: "us.actor.judicial.tenth-circuit-bounded-scaffold", classification: CLASSIFICATION },
  ],
  judicialAssignments: [
    {
      id: "us.assignment.judicial.d-colorado-bounded-route",
      officeId: "us.office.judicial.d-colorado-bounded-route",
      actorId: "us.actor.judicial.d-colorado-bounded-scaffold",
      effectiveFrom: "2026-08-22T00:00:00-04:00",
      effectiveUntil: null,
    },
    {
      id: "us.assignment.judicial.tenth-circuit-bounded-route",
      officeId: "us.office.judicial.tenth-circuit-bounded-route",
      actorId: "us.actor.judicial.tenth-circuit-bounded-scaffold",
      effectiveFrom: "2026-08-22T00:00:00-04:00",
      effectiveUntil: null,
    },
  ],
  trigger: {
    determinationId: US_V0_I9_DETERMINATION_ID,
    outcome: "REQUALIFICATION_REJECTED" as const,
    formulaDisposition: "DIRECTED_OUT_OF_RELATIONSHIP_PENDING_EXECUTION" as const,
    prospectiveOnly: true as const,
    moneyDamagesRequested: false as const,
  },
  claim: {
    id: "us.legal-claim.arapahoe-requalification-2027",
    contestId: "us.legal-contest.arapahoe-requalification-2027",
    filingBoundaryId: `${US_V0_I9_OWNER_ID}.filing`,
    admissionBoundaryId: `${US_V0_I9_OWNER_ID}.admission`,
    requestedRelief: "PLAINTIFF_SPECIFIC_PROSPECTIVE_NONMONEY_PRESERVATION_AND_RECONSIDERATION",
    legalGround: "BOUNDED_ADMINISTRATIVE_REVIEW_ROUTE",
  },
  interimRelief: {
    requestId: "us.interim-relief-request.arapahoe-requalification-2027",
    requestBoundaryId: `${US_V0_I9_OWNER_ID}.interim-request`,
    rulingId: "us.judicial-ruling.arapahoe-requalification-2027",
    rulingBoundaryId: `${US_V0_I9_OWNER_ID}.ruling`,
    outcome: "GRANTED_SCOPED" as const,
    reasons: [
      "FINAL_WRITTEN_DETERMINATION_PRESENT",
      "PLAINTIFF_SPECIFIC_PROSPECTIVE_INJURY_PRESENT",
      "NONMONEY_RELIEF_CAN_PRESERVE_LAWFUL_RECONSIDERATION",
    ],
  },
  order: {
    id: "us.judicial-order.arapahoe-requalification-2027",
    boundaryId: `${US_V0_I9_OWNER_ID}.order`,
    noticeId: "us.judicial-notice.arapahoe-requalification-2027",
    noticeBoundaryId: `${US_V0_I9_OWNER_ID}.notice`,
    directives: [
      "PRESERVE_PLAINTIFF_SPECIFIC_ASSOCIATED_FORMULA_AMOUNT_PENDING_RECONSIDERATION",
      "DO_NOT_EXECUTE_CHALLENGED_REDIRECTION_PENDING_LAWFUL_RECONSIDERATION",
      "RECONSIDER_PLAINTIFF_SPECIFIC_REQUALIFICATION_UNDER_OPERATIVE_REQUIREMENTS",
    ],
    plaintiffSpecific: true as const,
  },
  appeal: {
    requestId: "us.appellate-request.arapahoe-requalification-2027",
    stayRequestId: "us.stay-request.arapahoe-requalification-2027",
    stayDecisionId: "us.stay-decision.arapahoe-requalification-2027",
    stayBoundaryId: `${US_V0_I9_OWNER_ID}.stay-decision`,
    stayOutcome: "DENIED" as const,
    rulingId: "us.appellate-ruling.arapahoe-requalification-2027",
    rulingBoundaryId: `${US_V0_I9_OWNER_ID}.appellate-ruling`,
    rulingOutcome: "AFFIRMED" as const,
  },
  admissionRequirements: {
    finalAgencyAction: true as const,
    concreteClaimantInjury: true as const,
    prospectiveNonmoneyRelief: true as const,
    reviewableClaim: true as const,
  },
};

export const US_V0_I9_LEGAL_CONTEST_CONFIGURATION: IntegratedLegalContestConfiguration = {
  ...legalContestWithoutHash,
  parameterHash: sha256Hex(JSON.stringify(legalContestWithoutHash)),
};

const courtBoundaries: readonly InstitutionalBoundaryConfiguration[] = [
  { id: `${US_V0_I9_OWNER_ID}.filing`, at: US_V0_I9_FILING, phase: 0, order: 0, stableKey: `${US_V0_I9_OWNER_ID}:00`, kind: "LEGAL_CLAIM_FILING", ownerId: US_V0_I9_OWNER_ID },
  { id: `${US_V0_I9_OWNER_ID}.admission`, at: US_V0_I9_ADMISSION, phase: 0, order: 0, stableKey: `${US_V0_I9_OWNER_ID}:01`, kind: "LEGAL_CONTEST_ADMISSION", ownerId: US_V0_I9_OWNER_ID },
  { id: `${US_V0_I9_OWNER_ID}.interim-request`, at: US_V0_I9_INTERIM_REQUEST, phase: 0, order: 0, stableKey: `${US_V0_I9_OWNER_ID}:02`, kind: "INTERIM_RELIEF_REQUEST", ownerId: US_V0_I9_OWNER_ID },
  { id: `${US_V0_I9_OWNER_ID}.ruling`, at: US_V0_I9_RULING, phase: 0, order: 0, stableKey: `${US_V0_I9_OWNER_ID}:03`, kind: "JUDICIAL_RULING", ownerId: US_V0_I9_OWNER_ID },
  { id: `${US_V0_I9_OWNER_ID}.order`, at: US_V0_I9_RULING, phase: 1, order: 0, stableKey: `${US_V0_I9_OWNER_ID}:04`, kind: "JUDICIAL_ORDER", ownerId: US_V0_I9_OWNER_ID },
  { id: `${US_V0_I9_OWNER_ID}.notice`, at: US_V0_I9_NOTICE, phase: 0, order: 0, stableKey: `${US_V0_I9_OWNER_ID}:05`, kind: "JUDICIAL_NOTICE", ownerId: US_V0_I9_OWNER_ID },
  { id: `${US_V0_I9_OWNER_ID}.stay-decision`, at: US_V0_I9_STAY_DECISION, phase: 0, order: 0, stableKey: `${US_V0_I9_OWNER_ID}:06`, kind: "STAY_DECISION", ownerId: US_V0_I9_OWNER_ID },
  { id: `${US_V0_I9_OWNER_ID}.appellate-ruling`, at: US_V0_I9_APPELLATE_RULING, phase: 0, order: 0, stableKey: `${US_V0_I9_OWNER_ID}:07`, kind: "APPELLATE_RULING", ownerId: US_V0_I9_OWNER_ID },
];

const boundaries = [...US_V0_I8_TEMPORAL_CONFIGURATION.boundaries, ...courtBoundaries].sort((left, right) =>
  Date.parse(left.at) - Date.parse(right.at) || left.phase - right.phase || left.order - right.order ||
  left.stableKey.localeCompare(right.stableKey) || left.id.localeCompare(right.id));

const temporalWithoutHash = {
  schemaVersion: US_V0_I8_TEMPORAL_CONFIGURATION.schemaVersion,
  scheduleVersion: "us-v0-institutional-information-legal-calendar-1",
  scheduleContentHash: sha256Hex(JSON.stringify(boundaries)),
  assignmentCycleContentHash: US_V0_I8_TEMPORAL_CONFIGURATION.assignmentCycleContentHash,
  selectionContentHash: US_V0_I8_TEMPORAL_CONFIGURATION.selectionContentHash,
  initialTermLabel: US_V0_I8_TEMPORAL_CONFIGURATION.initialTermLabel,
  boundaries,
  assignmentCycles: US_V0_I8_TEMPORAL_CONFIGURATION.assignmentCycles,
  selection: US_V0_I8_TEMPORAL_CONFIGURATION.selection,
  newProcedureIdPrefix: US_V0_I8_TEMPORAL_CONFIGURATION.newProcedureIdPrefix,
  initialAdministration: US_V0_I8_TEMPORAL_CONFIGURATION.initialAdministration,
};

export const US_V0_I9_TEMPORAL_CONFIGURATION: IntegratedTemporalConfiguration = {
  ...temporalWithoutHash,
  parameterHash: sha256Hex(JSON.stringify(temporalWithoutHash)),
};

export const US_V0_I9_RUNTIME_ARTIFACTS = US_V0_I8_RUNTIME_ARTIFACTS;
