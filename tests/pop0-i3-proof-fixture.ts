import {
  createPresidentialOperatingProofSession,
  type PresidentialOperatingProofSession,
} from "../src/app/presidential-operating-proof-session";
import {
  POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS,
  POP0_I2_OFFICE_IDS,
  POP0_I2_SOURCE_ARTIFACT_ID,
  POP0_I2_SOURCE_SECTION_IDS,
  POP0_I3_RECIPIENT_CAPABILITY_IDS,
  POP0_I3_STANDING_COORDINATION_AUTHORITY_ID,
  POP0_I3_WORKSTREAM_ID,
  POP0_V0_PROVENANCE_ROOT,
} from "../src/content/pop0-v0/configuration";
import {
  computePresidentialInstrumentPayloadHash,
  type PresidentialEscalationOption,
  type RequestOfficeAnalysisPayload,
  type RequestWorkstreamCoordinationPayload,
} from "../src/sim/presidential-operating-intervention";
import {
  POP0_I2_ASSESSMENT_SECTION_IDS,
  POP0_I2_SYNTHESIS_SECTION_IDS,
  POP0_I2_TRACE_IDS,
  runFullPop0I2Trace,
} from "./pop0-i2-proof-fixture";

export const POP0_I3_TRACE_TIMES = {
  workstream: "2029-02-05T09:35:00-05:00",
  escalation: "2029-02-05T09:40:00-05:00",
  escalationPresentation: "2029-02-05T09:41:00-05:00",
  decision: "2029-02-05T09:45:00-05:00",
  dispatch: "2029-02-05T09:50:00-05:00",
  receipt: "2029-02-05T09:55:00-05:00",
  disposition: "2029-02-05T10:00:00-05:00",
  assignment: "2029-02-05T10:05:00-05:00",
  workstreamTransition: "2029-02-05T10:10:00-05:00",
  escalationDeadline: "2029-02-05T10:30:00-05:00",
  responseDeadline: "2029-02-05T12:00:00-05:00",
  workstreamReview: "2029-02-05T13:00:00-05:00",
  assignmentDeadline: "2029-02-05T14:00:00-05:00",
  reservedReview: "2029-02-06T09:00:00-05:00",
} as const;

export const POP0_I3_TRACE_IDS = {
  workstreamInitialTransition: "pop0.workstream-transition.preliminary-labor.monitored",
  escalation: "pop0.escalation.preliminary-labor-disagreement",
  escalationPresentation: "pop0.escalation-presentation.preliminary-labor-disagreement",
  requestOption: "pop0.option.request-scoped-analysis-and-coordination",
  reserveOption: "pop0.option.reserve-presidential-review",
  monitoringOption: "pop0.option.allow-monitoring-default",
  analysisPreview: "pop0.preview.omb.bounded-analysis",
  coordinationPreview: "pop0.preview.chief-of-staff.workstream-coordination",
  decision: "pop0.decision.request-scoped-analysis-and-coordination",
  ombInstrument: "pop0.decision.request-scoped-analysis-and-coordination.instrument.1",
  chiefOfStaffInstrument: "pop0.decision.request-scoped-analysis-and-coordination.instrument.2",
  ombDispatch: "pop0.dispatch.omb.bounded-analysis",
  chiefOfStaffDispatch: "pop0.dispatch.chief-of-staff.workstream-coordination",
  ombInstrumentReceipt: "pop0.instrument-receipt.omb.bounded-analysis",
  chiefOfStaffInstrumentReceipt: "pop0.instrument-receipt.chief-of-staff.coordination",
  ombDisposition: "pop0.disposition.omb.narrowed-metadata-gap",
  chiefOfStaffDisposition: "pop0.disposition.chief-of-staff.accepted-coordination",
  ombAssignment: "pop0.assignment.omb.metadata-access-gap-scoping",
  workstreamActiveTransition: "pop0.workstream-transition.preliminary-labor.active",
} as const;

const analysisPayload = (): RequestOfficeAnalysisPayload => ({
  kind: "REQUEST_OFFICE_ANALYSIS",
  payloadVersion: "1",
  recipientOfficeId: POP0_I2_OFFICE_IDS.omb,
  subjectScopeFamily: "PRELIMINARY_LABOR_EVIDENCE_REVIEW",
  requestedAct: "Prepare bounded supportability analysis from legitimately available evidence",
  sourceReferenceIds: [POP0_I2_TRACE_IDS.synthesis, POP0_I2_TRACE_IDS.presentation],
  attachmentMetadata: [{
    artifactId: POP0_I2_SOURCE_ARTIFACT_ID,
    sectionIds: [
      POP0_I2_SOURCE_SECTION_IDS.summary,
      POP0_I2_SOURCE_SECTION_IDS.regionalTable,
      POP0_I2_SOURCE_SECTION_IDS.methods,
    ],
    shownToPresident: false,
  }],
  authorityBasis: POP0_V0_PROVENANCE_ROOT,
  requestedResponseDeadline: POP0_I3_TRACE_TIMES.responseDeadline,
  requestedQuestion: "What supportability can OMB establish within its actual evidence access?",
  requestedProductKind: "FISCAL_SUPPORTABILITY_SCOPING",
  evidenceArtifactId: POP0_I2_SOURCE_ARTIFACT_ID,
  evidenceSectionIds: [
    POP0_I2_SOURCE_SECTION_IDS.summary,
    POP0_I2_SOURCE_SECTION_IDS.regionalTable,
    POP0_I2_SOURCE_SECTION_IDS.methods,
  ],
  knownAccessLimitation: "OMB currently has metadata and an access-denied retrieval only",
  narrowingPermitted: true,
});

const coordinationPayload = (): RequestWorkstreamCoordinationPayload => ({
  kind: "REQUEST_WORKSTREAM_COORDINATION",
  payloadVersion: "1",
  recipientOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
  subjectScopeFamily: "PRELIMINARY_LABOR_EVIDENCE_REVIEW",
  requestedAct: "Coordinate bounded follow-up through the existing workstream",
  sourceReferenceIds: [POP0_I2_TRACE_IDS.synthesis, POP0_I2_TRACE_IDS.presentation],
  attachmentMetadata: [],
  authorityBasis: POP0_V0_PROVENANCE_ROOT,
  requestedResponseDeadline: POP0_I3_TRACE_TIMES.responseDeadline,
  workstreamId: POP0_I3_WORKSTREAM_ID,
  coordinationObjective: "Track recipient dispositions and coordinate bounded follow-up",
  participatingOfficeIds: [POP0_I2_OFFICE_IDS.chiefOfStaff, POP0_I2_OFFICE_IDS.omb],
  requestedReviewAt: POP0_I3_TRACE_TIMES.workstreamReview,
  permittedCoordinationActions: ["TRACK_RECIPIENT_DISPOSITIONS", "COORDINATE_FOLLOW_UP"],
});

export const createPop0I3Options = (): readonly PresidentialEscalationOption[] => {
  const analysis = analysisPayload();
  const coordination = coordinationPayload();
  return [
    {
      id: POP0_I3_TRACE_IDS.requestOption,
      kind: "REQUEST_SCOPED_ANALYSIS_AND_COORDINATION",
      previews: [
        {
          id: POP0_I3_TRACE_IDS.analysisPreview,
          payload: analysis,
          payloadHash: computePresidentialInstrumentPayloadHash(analysis),
          bundlePosition: 0,
          provenanceReference: POP0_V0_PROVENANCE_ROOT,
        },
        {
          id: POP0_I3_TRACE_IDS.coordinationPreview,
          payload: coordination,
          payloadHash: computePresidentialInstrumentPayloadHash(coordination),
          bundlePosition: 1,
          provenanceReference: POP0_V0_PROVENANCE_ROOT,
        },
      ],
    },
    {
      id: POP0_I3_TRACE_IDS.reserveOption,
      kind: "RESERVE_PRESIDENTIAL_REVIEW",
      previews: [],
      reservedAt: POP0_I3_TRACE_TIMES.reservedReview,
      reviewQuestion: "Has a bounded follow-up product been legitimately presented?",
      expectedSourceReferenceIds: ["pop0.expected-product.preliminary-labor-follow-up"],
    },
    {
      id: POP0_I3_TRACE_IDS.monitoringOption,
      kind: "ALLOW_MONITORING_DEFAULT",
      previews: [],
    },
  ];
};

export const createPop0I3TraceSession = (): PresidentialOperatingProofSession => {
  const session = createPresidentialOperatingProofSession();
  runFullPop0I2Trace(session);
  return session;
};

export const createI3Workstream = (session: PresidentialOperatingProofSession): void => {
  session.advanceTo(POP0_I3_TRACE_TIMES.workstream);
  session.createAdministrationWorkstream({
    id: POP0_I3_WORKSTREAM_ID,
    initialTransitionId: POP0_I3_TRACE_IDS.workstreamInitialTransition,
    initialTransitionDeduplicationIdentity: "pop0.dedupe.workstream.preliminary-labor.monitored",
    creatingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
    creatingOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.chiefOfStaff,
    standingAuthorityId: POP0_I3_STANDING_COORDINATION_AUTHORITY_ID,
    initialSourceReferenceIds: [POP0_I2_TRACE_IDS.synthesis, POP0_I2_TRACE_IDS.presentation],
    initialReviewAt: POP0_I3_TRACE_TIMES.workstreamReview,
    reason: "Monitor bounded follow-up on the preserved disagreement and access gap",
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  });
};

export const createI3Escalation = (
  session: PresidentialOperatingProofSession,
  options: readonly PresidentialEscalationOption[] = createPop0I3Options(),
  sourceRecordIds: readonly string[] = [
    POP0_I2_TRACE_IDS.synthesis,
    POP0_I2_TRACE_IDS.laborAssessmentReceiptAtChiefOfStaff,
    POP0_I2_TRACE_IDS.necAssessmentReceiptAtChiefOfStaff,
    POP0_I2_TRACE_IDS.presentation,
  ],
): void => {
  session.advanceTo(POP0_I3_TRACE_TIMES.escalation);
  session.createPresidentialEscalation({
    id: POP0_I3_TRACE_IDS.escalation,
    deduplicationIdentity: "pop0.dedupe.escalation.preliminary-labor-disagreement",
    escalatingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
    escalatingOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.chiefOfStaff,
    basisKind: "SYNTHESIS_CONFLICT",
    basisSynthesisArtifactId: POP0_I2_TRACE_IDS.synthesis,
    sourceRecordIds,
    presidentKnownPortions: [
      {
        presentationId: POP0_I2_TRACE_IDS.presentation,
        artifactId: POP0_I2_TRACE_IDS.synthesis,
        sectionId: POP0_I2_SYNTHESIS_SECTION_IDS[0],
      },
      {
        presentationId: POP0_I2_TRACE_IDS.presentation,
        artifactId: POP0_I2_TRACE_IDS.synthesis,
        sectionId: POP0_I2_SYNTHESIS_SECTION_IDS[1],
      },
    ],
    staffOnlySourcePortions: [
      {
        artifactId: POP0_I2_TRACE_IDS.laborAssessment,
        sectionId: POP0_I2_ASSESSMENT_SECTION_IDS[2],
      },
      {
        artifactId: POP0_I2_TRACE_IDS.necAssessment,
        sectionId: POP0_I2_ASSESSMENT_SECTION_IDS[2],
      },
    ],
    requestedJudgment: "Whether to request bounded analysis/coordination, reserve review, or monitor",
    knownClaims: [{
      claim: "The synthesis preserves conflicting judgments over supplier spillover",
      sourceReferenceIds: [POP0_I2_TRACE_IDS.synthesis],
    }],
    uncertainties: ["The current record does not resolve the broader supplier-effect dispute"],
    limitations: ["OMB lacks substantive receipt of the preliminary source evidence"],
    options,
    expiresAt: POP0_I3_TRACE_TIMES.escalationDeadline,
    defaultRule: {
      presidentialInstrumentOutcome: "NO_NEW_PRESIDENTIAL_INSTRUMENT",
      officeMonitoringOutcome: "CONTINUE_EXISTING_OFFICE_MONITORING",
    },
    downstreamResolverOfficeIds: [POP0_I2_OFFICE_IDS.omb, POP0_I2_OFFICE_IDS.chiefOfStaff],
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  });
};

export const presentI3Escalation = (session: PresidentialOperatingProofSession): void => {
  session.advanceTo(POP0_I3_TRACE_TIMES.escalationPresentation);
  session.recordEscalationPresentation({
    id: POP0_I3_TRACE_IDS.escalationPresentation,
    deduplicationIdentity: "pop0.dedupe.escalation-presentation.preliminary-labor",
    sourceEscalationId: POP0_I3_TRACE_IDS.escalation,
    presentingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
    presenterOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.chiefOfStaff,
    shownSectionIds: [
      "BASIS",
      "KNOWN_FACTS",
      "UNCERTAINTIES_AND_LIMITATIONS",
      "DECISION_REQUEST",
      "OPTIONS_AND_PREVIEWS",
      "DEFAULT",
      "DEADLINE",
      "DOWNSTREAM_RESOLVERS",
    ],
    referencedButNotShownSourcePortions: [
      {
        artifactId: POP0_I2_TRACE_IDS.laborAssessment,
        sectionId: POP0_I2_ASSESSMENT_SECTION_IDS[2],
      },
      {
        artifactId: POP0_I2_TRACE_IDS.necAssessment,
        sectionId: POP0_I2_ASSESSMENT_SECTION_IDS[2],
      },
    ],
    purpose: "Present the bounded presidential judgment and complete local option previews",
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  });
};

export const decideI3RequestOption = (session: PresidentialOperatingProofSession): void => {
  decideI3Option(
    session,
    POP0_I3_TRACE_IDS.requestOption,
    POP0_I3_TRACE_IDS.decision,
    "pop0.dedupe.decision.request-scoped-analysis-and-coordination",
  );
};

export const decideI3Option = (
  session: PresidentialOperatingProofSession,
  selectedOptionId: string,
  decisionId: string,
  deduplicationIdentity: string,
): void => {
  session.advanceTo(POP0_I3_TRACE_TIMES.decision);
  session.recordPresidentialDecision({
    id: decisionId,
    deduplicationIdentity,
    sourceEscalationId: POP0_I3_TRACE_IDS.escalation,
    selectedOptionId,
    basisEscalationPresentationId: POP0_I3_TRACE_IDS.escalationPresentation,
    acknowledgedUncertainties: [
      "The current record does not resolve the broader supplier-effect dispute",
    ],
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
    supersedesDecisionId: null,
  });
};

export const dispatchI3Instruments = (session: PresidentialOperatingProofSession): void => {
  session.advanceTo(POP0_I3_TRACE_TIMES.dispatch);
  session.attemptInstrumentDispatch({
    id: POP0_I3_TRACE_IDS.ombDispatch,
    deduplicationIdentity: "pop0.dedupe.dispatch.omb.bounded-analysis",
    instrumentId: POP0_I3_TRACE_IDS.ombInstrument,
    dispatchingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
    dispatchPath: "PRESIDENTIAL_OPERATIONS_TO_OMB",
    outcome: "DELIVERED_TO_OFFICE_BOUNDARY",
    failureReason: null,
    outcomeProvenanceReference: POP0_V0_PROVENANCE_ROOT,
    retryOfDispatchId: null,
  });
  session.attemptInstrumentDispatch({
    id: POP0_I3_TRACE_IDS.chiefOfStaffDispatch,
    deduplicationIdentity: "pop0.dedupe.dispatch.chief-of-staff.coordination",
    instrumentId: POP0_I3_TRACE_IDS.chiefOfStaffInstrument,
    dispatchingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
    dispatchPath: "PRESIDENTIAL_OPERATIONS_INTERNAL_DELIVERY",
    outcome: "DELIVERED_TO_OFFICE_BOUNDARY",
    failureReason: null,
    outcomeProvenanceReference: POP0_V0_PROVENANCE_ROOT,
    retryOfDispatchId: null,
  });
};

export const admitI3InstrumentReceipts = (session: PresidentialOperatingProofSession): void => {
  session.advanceTo(POP0_I3_TRACE_TIMES.receipt);
  session.admitOfficeInstrumentReceipt({
    id: POP0_I3_TRACE_IDS.ombInstrumentReceipt,
    deduplicationIdentity: "pop0.dedupe.instrument-receipt.omb.bounded-analysis",
    instrumentId: POP0_I3_TRACE_IDS.ombInstrument,
    successfulDispatchId: POP0_I3_TRACE_IDS.ombDispatch,
    recipientOfficeId: POP0_I2_OFFICE_IDS.omb,
    receiptPath: "OMB_OFFICE_BOUNDARY_ADMISSION",
    receivingAuthorityReference: POP0_I3_RECIPIENT_CAPABILITY_IDS.ombAnalysis,
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  });
  session.admitOfficeInstrumentReceipt({
    id: POP0_I3_TRACE_IDS.chiefOfStaffInstrumentReceipt,
    deduplicationIdentity: "pop0.dedupe.instrument-receipt.chief-of-staff.coordination",
    instrumentId: POP0_I3_TRACE_IDS.chiefOfStaffInstrument,
    successfulDispatchId: POP0_I3_TRACE_IDS.chiefOfStaffDispatch,
    recipientOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
    receiptPath: "CHIEF_OF_STAFF_OFFICE_BOUNDARY_ADMISSION",
    receivingAuthorityReference: POP0_I3_RECIPIENT_CAPABILITY_IDS.chiefOfStaffCoordination,
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  });
};

export const dispositionI3Instruments = (session: PresidentialOperatingProofSession): void => {
  session.advanceTo(POP0_I3_TRACE_TIMES.disposition);
  session.recordRecipientDisposition({
    id: POP0_I3_TRACE_IDS.chiefOfStaffDisposition,
    deduplicationIdentity: "pop0.dedupe.disposition.chief-of-staff.accepted-coordination",
    recipientOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
    instrumentReceiptId: POP0_I3_TRACE_IDS.chiefOfStaffInstrumentReceipt,
    authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.chiefOfStaff,
    capabilityAuthorityId: POP0_I3_RECIPIENT_CAPABILITY_IDS.chiefOfStaffCoordination,
    kind: "ACCEPTED_AS_REQUESTED",
    acceptedProductKind: null,
    acceptedSectionIds: [],
    acceptedCoordinationActions: ["TRACK_RECIPIENT_DISPOSITIONS", "COORDINATE_FOLLOW_UP"],
    constraintIds: [],
    constraintSourceReferenceIds: [],
    reason: null,
    limitations: [],
    nextReviewAt: null,
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  });
  session.recordRecipientDisposition({
    id: POP0_I3_TRACE_IDS.ombDisposition,
    deduplicationIdentity: "pop0.dedupe.disposition.omb.narrowed-metadata-gap",
    recipientOfficeId: POP0_I2_OFFICE_IDS.omb,
    instrumentReceiptId: POP0_I3_TRACE_IDS.ombInstrumentReceipt,
    authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.ombDirector,
    capabilityAuthorityId: POP0_I3_RECIPIENT_CAPABILITY_IDS.ombAnalysis,
    kind: "NARROWED",
    acceptedProductKind: "METADATA_ACCESS_GAP_SCOPING",
    acceptedSectionIds: [],
    acceptedCoordinationActions: [],
    constraintIds: [],
    constraintSourceReferenceIds: [],
    reason: null,
    limitations: ["No substantive preliminary source receipt is available to OMB"],
    nextReviewAt: null,
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  });
};

export const createI3OmbAssignment = (session: PresidentialOperatingProofSession): void => {
  session.advanceTo(POP0_I3_TRACE_TIMES.assignment);
  session.createInstrumentAuthorizedAssignment({
    id: POP0_I3_TRACE_IDS.ombAssignment,
    dispositionId: POP0_I3_TRACE_IDS.ombDisposition,
    requesterId: POP0_I2_OFFICE_IDS.omb,
    leadOfficeId: POP0_I2_OFFICE_IDS.omb,
    objective: "Scope the metadata and access gap without claiming a substantive fiscal estimate",
    sourceReferenceIds: [POP0_I3_TRACE_IDS.ombDisposition],
    requiredConsultationOfficeIds: [],
    authorityReference: POP0_I3_TRACE_IDS.ombDisposition,
    deadline: POP0_I3_TRACE_TIMES.assignmentDeadline,
    expectedProductKind: "METADATA_ACCESS_GAP_SCOPING",
    authorizationScope: {
      kind: "ANALYSIS_ASSIGNMENT_SCOPE",
      evidenceArtifactId: POP0_I2_SOURCE_ARTIFACT_ID,
      evidenceSectionIds: [],
      productKind: "METADATA_ACCESS_GAP_SCOPING",
    },
  });
};

export const transitionI3Workstream = (session: PresidentialOperatingProofSession): void => {
  session.advanceTo(POP0_I3_TRACE_TIMES.workstreamTransition);
  session.transitionAdministrationWorkstream({
    id: POP0_I3_TRACE_IDS.workstreamActiveTransition,
    deduplicationIdentity: "pop0.dedupe.workstream.preliminary-labor.active",
    workstreamId: POP0_I3_WORKSTREAM_ID,
    priorTransitionId: POP0_I3_TRACE_IDS.workstreamInitialTransition,
    status: "ACTIVE",
    actingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
    actingOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.chiefOfStaff,
    sourceOccurrenceIds: [
      POP0_I3_TRACE_IDS.chiefOfStaffDisposition,
      POP0_I3_TRACE_IDS.ombDisposition,
      POP0_I3_TRACE_IDS.ombAssignment,
    ],
    reason: "Coordinate the accepted response and bounded OMB follow-up assignment",
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  });
};

export const runI3ThroughEscalation = (session: PresidentialOperatingProofSession): void => {
  createI3Workstream(session);
  createI3Escalation(session);
};

export const runI3ThroughDecision = (session: PresidentialOperatingProofSession): void => {
  runI3ThroughEscalation(session);
  presentI3Escalation(session);
  decideI3RequestOption(session);
};

export const runI3ThroughReceipt = (session: PresidentialOperatingProofSession): void => {
  runI3ThroughDecision(session);
  dispatchI3Instruments(session);
  admitI3InstrumentReceipts(session);
};

export const runFullPop0I3Trace = (session: PresidentialOperatingProofSession): void => {
  runI3ThroughReceipt(session);
  dispositionI3Instruments(session);
  createI3OmbAssignment(session);
  transitionI3Workstream(session);
};
