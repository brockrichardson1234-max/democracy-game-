import {
  createPresidentialOperatingProofSession,
  type PresidentialOperatingProofSession,
} from "../src/app/presidential-operating-proof-session";
import {
  POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS,
  POP0_I2_OFFICE_IDS,
  POP0_I4_ASSESSMENT_SECTION_IDS,
  POP0_I4_IDS,
  POP0_I4_MONITORING_SECTION_IDS,
  POP0_I4_RAW_SUPPLIER_SECTION_IDS,
  POP0_V0_OPERATING_CONFIGURATION,
  POP0_V0_PROVENANCE_ROOT,
} from "../src/content/pop0-v0/configuration";
import {
  computePresidentialInstrumentPayloadHash,
  type PresidentialEscalationOption,
  type RequestOfficeAnalysisPayload,
  type RequestWorkstreamCoordinationPayload,
} from "../src/sim/presidential-operating-intervention";

export const POP0_I4_TRACE_TIMES = {
  monitoringRetrieval: "2029-02-05T08:05:00-05:00",
  monitoringReceipt: "2029-02-05T08:06:00-05:00",
  assessment: "2029-02-05T08:10:00-05:00",
  transfer: "2029-02-05T08:15:00-05:00",
  escalation: "2029-02-05T08:20:00-05:00",
  presentation: "2029-02-05T08:21:00-05:00",
  decision: "2029-02-05T08:25:00-05:00",
  dispatch: "2029-02-05T08:30:00-05:00",
  instrumentReceipt: "2029-02-05T08:31:00-05:00",
  disposition: "2029-02-05T08:32:00-05:00",
  assignment: "2029-02-05T08:33:00-05:00",
  assignmentStart: "2029-02-05T08:34:00-05:00",
  optionsResult: "2029-02-05T08:35:00-05:00",
  assignmentComplete: "2029-02-05T08:36:00-05:00",
  rawNotice: "2029-02-05T08:37:00-05:00",
  rawRetrieval: "2029-02-05T08:38:00-05:00",
  rawReceipt: "2029-02-05T08:39:00-05:00",
  supplementalArtifact: "2029-02-05T08:40:00-05:00",
  supplementalSubmission: "2029-02-05T08:41:00-05:00",
  reviewSubmission: "2029-02-05T08:42:00-05:00",
  materialAdmission: "2029-02-05T08:42:00-05:00",
  escalationDeadline: "2029-02-05T10:00:00-05:00",
  responseDeadline: "2029-02-05T13:00:00-05:00",
  assignmentDeadline: "2029-02-05T12:00:00-05:00",
  reviewAt: "2029-02-05T14:00:00-05:00",
  reservedReview: "2029-02-06T09:00:00-05:00",
  laterHousing: "2029-02-06T12:00:00-05:00",
} as const;

export const POP0_I4_TRACE_IDS = {
  monitoringRetrieval: "pop0.retrieval.secretary-of-hud.housing-monitoring",
  monitoringReceipt: "pop0.receipt.secretary-of-hud.housing-monitoring",
  assessment: POP0_I4_IDS.housingAssessment,
  assessmentReceiptAtChiefOfStaff: "pop0.receipt.chief-of-staff.housing-assessment",
  escalation: "pop0.escalation.inherited-housing",
  requestOption: "pop0.option.housing.request-analysis-and-coordination",
  reserveOption: "pop0.option.housing.reserve-review",
  monitoringOption: "pop0.option.housing.continue-monitoring",
  analysisPreview: "pop0.preview.secretary-of-hud.housing-analysis",
  coordinationPreview: "pop0.preview.chief-of-staff.housing-coordination",
  presentation: "pop0.escalation-presentation.inherited-housing",
  decision: "pop0.decision.housing.request-analysis-and-coordination",
  analysisInstrument: "pop0.decision.housing.request-analysis-and-coordination.instrument.1",
  coordinationInstrument: "pop0.decision.housing.request-analysis-and-coordination.instrument.2",
  dispatch: "pop0.dispatch.secretary-of-hud.housing-analysis",
  instrumentReceipt: "pop0.instrument-receipt.secretary-of-hud.housing-analysis",
  disposition: "pop0.disposition.secretary-of-hud.housing-analysis.accepted",
  assignment: "pop0.assignment.secretary-of-hud.housing-options",
  optionsResult: "pop0.artifact.hud-stables-options-result.v1",
  rawNotice: "pop0.notice.secretary-of-hud.stables-supplier-evidence",
  rawRetrieval: "pop0.retrieval.secretary-of-hud.stables-supplier-evidence",
  rawReceipt: "pop0.receipt.secretary-of-hud.stables-supplier-evidence",
  supplementalProduction: "pop0.production.secretary-of-hud.stables-nonavailability-record",
  supplementalSubmission: "pop0.handling.secretary-of-hud.submit-stables-supplement",
  reviewSubmission: "pop0.handling.secretary-of-hud.submit-stables-grant-intention",
} as const;

const housingAnalysisPayload = (): RequestOfficeAnalysisPayload => ({
  kind: "REQUEST_OFFICE_ANALYSIS",
  payloadVersion: "1",
  recipientOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
  subjectScopeFamily: "INHERITED_HOUSING_IMPLEMENTATION",
  requestedAct: "Prepare bounded supplemental-record options from legitimately received monitoring evidence",
  sourceReferenceIds: [
    POP0_I4_TRACE_IDS.assessment,
    POP0_I4_TRACE_IDS.assessmentReceiptAtChiefOfStaff,
  ],
  attachmentMetadata: [{
    artifactId: POP0_I4_IDS.monitoringArtifact,
    sectionIds: [...POP0_I4_MONITORING_SECTION_IDS],
    shownToPresident: false,
  }],
  authorityBasis: POP0_V0_PROVENANCE_ROOT,
  requestedResponseDeadline: POP0_I4_TRACE_TIMES.responseDeadline,
  requestedQuestion: "What bounded options can the Department leadership office support from the received record?",
  requestedProductKind: "HUD_SUPPLEMENTAL_RECORD_OPTIONS",
  evidenceArtifactId: POP0_I4_IDS.monitoringArtifact,
  evidenceSectionIds: [...POP0_I4_MONITORING_SECTION_IDS],
  knownAccessLimitation: "The raw supplier evidence has not yet crossed the Secretary-office receipt boundary",
  narrowingPermitted: true,
});

const housingCoordinationPayload = (): RequestWorkstreamCoordinationPayload => ({
  kind: "REQUEST_WORKSTREAM_COORDINATION",
  payloadVersion: "1",
  recipientOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
  subjectScopeFamily: "INHERITED_HOUSING_IMPLEMENTATION",
  requestedAct: "Coordinate bounded follow-up through the inherited Housing workstream",
  sourceReferenceIds: [
    POP0_I4_TRACE_IDS.assessment,
    POP0_I4_TRACE_IDS.assessmentReceiptAtChiefOfStaff,
  ],
  attachmentMetadata: [],
  authorityBasis: POP0_V0_PROVENANCE_ROOT,
  requestedResponseDeadline: POP0_I4_TRACE_TIMES.responseDeadline,
  workstreamId: POP0_I4_IDS.housingWorkstream,
  coordinationObjective: "Track recipient disposition without owning the Department or material result",
  participatingOfficeIds: [POP0_I2_OFFICE_IDS.chiefOfStaff, POP0_I2_OFFICE_IDS.secretaryOfHud],
  requestedReviewAt: POP0_I4_TRACE_TIMES.reviewAt,
  permittedCoordinationActions: ["TRACK_RECIPIENT_DISPOSITIONS", "COORDINATE_FOLLOW_UP"],
});

export const createPop0I4Options = (): readonly PresidentialEscalationOption[] => {
  const analysis = housingAnalysisPayload();
  const coordination = housingCoordinationPayload();
  return [
    {
      id: POP0_I4_TRACE_IDS.requestOption,
      kind: "REQUEST_SCOPED_ANALYSIS_AND_COORDINATION",
      previews: [
        {
          id: POP0_I4_TRACE_IDS.analysisPreview,
          payload: analysis,
          payloadHash: computePresidentialInstrumentPayloadHash(analysis),
          bundlePosition: 0,
          provenanceReference: POP0_V0_PROVENANCE_ROOT,
        },
        {
          id: POP0_I4_TRACE_IDS.coordinationPreview,
          payload: coordination,
          payloadHash: computePresidentialInstrumentPayloadHash(coordination),
          bundlePosition: 1,
          provenanceReference: POP0_V0_PROVENANCE_ROOT,
        },
      ],
    },
    {
      id: POP0_I4_TRACE_IDS.reserveOption,
      kind: "RESERVE_PRESIDENTIAL_REVIEW",
      previews: [],
      reservedAt: POP0_I4_TRACE_TIMES.reservedReview,
      reviewQuestion: "Has any later Department result been separately presented?",
      expectedSourceReferenceIds: ["pop0.expected.housing-follow-up-presentation"],
    },
    {
      id: POP0_I4_TRACE_IDS.monitoringOption,
      kind: "ALLOW_MONITORING_DEFAULT",
      previews: [],
    },
  ];
};

export const runI4ThroughSecretaryAssessment = (
  session: PresidentialOperatingProofSession,
  checkpoint?: () => void,
): void => {
  session.advanceTo(POP0_I4_TRACE_TIMES.monitoringRetrieval);
  session.attemptRetrieval({
    id: POP0_I4_TRACE_IDS.monitoringRetrieval,
    requestingOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
    artifactId: POP0_I4_IDS.monitoringArtifact,
    requestedSectionIds: [...POP0_I4_MONITORING_SECTION_IDS],
    metadataNoticeId: POP0_I4_IDS.monitoringSecretaryNotice,
  });
  checkpoint?.();
  session.advanceTo(POP0_I4_TRACE_TIMES.monitoringReceipt);
  session.admitSubstantiveReceipt({
    id: POP0_I4_TRACE_IDS.monitoringReceipt,
    recipientOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
    artifactId: POP0_I4_IDS.monitoringArtifact,
    receivedSectionIds: [...POP0_I4_MONITORING_SECTION_IDS],
    retrievalId: POP0_I4_TRACE_IDS.monitoringRetrieval,
    receivingAuthorityReference: POP0_I4_IDS.observationAuthority,
    deduplicationIdentity: "pop0.dedupe.receipt.secretary-of-hud.housing-monitoring",
  });
  checkpoint?.();
  session.advanceTo(POP0_I4_TRACE_TIMES.assessment);
  session.authorAssessment({
    id: POP0_I4_TRACE_IDS.assessment,
    version: "1",
    sectionIds: [...POP0_I4_ASSESSMENT_SECTION_IDS],
    producingOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
    authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.secretaryOfHud,
    assignmentId: null,
    sourceReceiptIds: [POP0_I4_TRACE_IDS.monitoringReceipt],
    sourceRetrievalIds: [POP0_I4_TRACE_IDS.monitoringRetrieval],
    sourceMetadataNoticeIds: [POP0_I4_IDS.monitoringSecretaryNotice],
    judgmentRuleIds: [POP0_I4_IDS.housingAssessmentRule],
    claimedConfidence: "BOUNDED_CLAIM_LINEAGED_CONFIDENCE",
    evidentiarySupport: "Received monitoring sections with immutable lower-owner claim lineage",
    assumptionIds: [],
    limitations: ["The monitoring artifact is a dated observation and is not the missing supplemental record"],
    recommendation: "Escalate the bounded administrative gap without selecting a waiver result",
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
    revisionOfArtifactId: null,
    supersedesArtifactId: null,
  });
  checkpoint?.();
};

export const runI4ThroughEscalation = (
  session: PresidentialOperatingProofSession,
  checkpoint?: () => void,
): void => {
  runI4ThroughSecretaryAssessment(session, checkpoint);
  session.advanceTo(POP0_I4_TRACE_TIMES.transfer);
  session.transferOfficeArtifact({
    id: POP0_I4_TRACE_IDS.assessmentReceiptAtChiefOfStaff,
    sourceOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
    sourceOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.secretaryOfHud,
    recipientOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
    artifactId: POP0_I4_TRACE_IDS.assessment,
    receivedSectionIds: [...POP0_I4_ASSESSMENT_SECTION_IDS],
    receivingAuthorityReference: POP0_I4_IDS.housingStandingAuthority,
    deduplicationIdentity: "pop0.dedupe.receipt.chief-of-staff.housing-assessment",
  });
  checkpoint?.();
  session.advanceTo(POP0_I4_TRACE_TIMES.escalation);
  session.createPresidentialEscalation({
    id: POP0_I4_TRACE_IDS.escalation,
    deduplicationIdentity: "pop0.dedupe.escalation.inherited-housing",
    escalatingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
    escalatingOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.chiefOfStaff,
    basisKind: "RECEIPT",
    basisArtifactId: POP0_I4_TRACE_IDS.assessment,
    basisReceiptId: POP0_I4_TRACE_IDS.assessmentReceiptAtChiefOfStaff,
    sourceRecordIds: [POP0_I4_TRACE_IDS.assessment, POP0_I4_TRACE_IDS.assessmentReceiptAtChiefOfStaff],
    presidentKnownPortions: [],
    staffOnlySourcePortions: POP0_I4_ASSESSMENT_SECTION_IDS.map((sectionId) => ({
      artifactId: POP0_I4_TRACE_IDS.assessment,
      sectionId,
    })),
    requestedJudgment: "Whether to request bounded analysis/coordination, reserve review, or continue monitoring",
    knownClaims: [{
      claim: "The Secretary assessment identifies a received, bounded administrative record gap",
      sourceReferenceIds: [POP0_I4_TRACE_IDS.assessment, POP0_I4_TRACE_IDS.assessmentReceiptAtChiefOfStaff],
    }],
    uncertainties: ["No recipient disposition or later Department determination yet exists"],
    limitations: ["The assessment is not the missing supplemental record and does not own Housing truth"],
    options: createPop0I4Options(),
    expiresAt: POP0_I4_TRACE_TIMES.escalationDeadline,
    defaultRule: {
      presidentialInstrumentOutcome: "NO_NEW_PRESIDENTIAL_INSTRUMENT",
      officeMonitoringOutcome: "CONTINUE_EXISTING_OFFICE_MONITORING",
    },
    downstreamResolverOfficeIds: [POP0_I2_OFFICE_IDS.secretaryOfHud, POP0_I2_OFFICE_IDS.chiefOfStaff],
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  });
  checkpoint?.();
};

export const presentAndDecideI4 = (
  session: PresidentialOperatingProofSession,
  checkpoint?: () => void,
): void => {
  session.advanceTo(POP0_I4_TRACE_TIMES.presentation);
  session.recordEscalationPresentation({
    id: POP0_I4_TRACE_IDS.presentation,
    deduplicationIdentity: "pop0.dedupe.escalation-presentation.inherited-housing",
    sourceEscalationId: POP0_I4_TRACE_IDS.escalation,
    presentingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
    presenterOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.chiefOfStaff,
    shownSectionIds: [
      "BASIS", "KNOWN_FACTS", "UNCERTAINTIES_AND_LIMITATIONS", "DECISION_REQUEST",
      "OPTIONS_AND_PREVIEWS", "DEFAULT", "DEADLINE", "DOWNSTREAM_RESOLVERS",
    ],
    referencedButNotShownSourcePortions: POP0_I4_ASSESSMENT_SECTION_IDS.map((sectionId) => ({
      artifactId: POP0_I4_TRACE_IDS.assessment,
      sectionId,
    })),
    purpose: "Present the bounded Housing judgment and complete local option previews",
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  });
  checkpoint?.();
  session.advanceTo(POP0_I4_TRACE_TIMES.decision);
  session.recordPresidentialDecision({
    id: POP0_I4_TRACE_IDS.decision,
    deduplicationIdentity: "pop0.dedupe.decision.housing.request-analysis-and-coordination",
    sourceEscalationId: POP0_I4_TRACE_IDS.escalation,
    selectedOptionId: POP0_I4_TRACE_IDS.requestOption,
    basisEscalationPresentationId: POP0_I4_TRACE_IDS.presentation,
    acknowledgedUncertainties: ["No recipient disposition or later Department determination yet exists"],
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
    supersedesDecisionId: null,
  });
  checkpoint?.();
};

export const runI4ThroughCompletedOptionsAssignment = (
  session: PresidentialOperatingProofSession,
  checkpoint?: () => void,
): void => {
  runI4ThroughEscalation(session, checkpoint);
  presentAndDecideI4(session, checkpoint);
  session.advanceTo(POP0_I4_TRACE_TIMES.dispatch);
  session.attemptInstrumentDispatch({
    id: POP0_I4_TRACE_IDS.dispatch,
    deduplicationIdentity: "pop0.dedupe.dispatch.secretary-of-hud.housing-analysis",
    instrumentId: POP0_I4_TRACE_IDS.analysisInstrument,
    dispatchingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
    dispatchPath: "PRESIDENTIAL_OPERATIONS_TO_DEPARTMENT_LEADERSHIP_OFFICE",
    outcome: "DELIVERED_TO_OFFICE_BOUNDARY",
    failureReason: null,
    outcomeProvenanceReference: POP0_V0_PROVENANCE_ROOT,
    retryOfDispatchId: null,
  });
  checkpoint?.();
  session.advanceTo(POP0_I4_TRACE_TIMES.instrumentReceipt);
  session.admitOfficeInstrumentReceipt({
    id: POP0_I4_TRACE_IDS.instrumentReceipt,
    deduplicationIdentity: "pop0.dedupe.instrument-receipt.secretary-of-hud.housing-analysis",
    instrumentId: POP0_I4_TRACE_IDS.analysisInstrument,
    successfulDispatchId: POP0_I4_TRACE_IDS.dispatch,
    recipientOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
    receiptPath: "SECRETARY_OFFICE_BOUNDARY_ADMISSION",
    receivingAuthorityReference: POP0_I4_IDS.hudCapability,
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  });
  checkpoint?.();
  session.advanceTo(POP0_I4_TRACE_TIMES.disposition);
  session.recordRecipientDisposition({
    id: POP0_I4_TRACE_IDS.disposition,
    deduplicationIdentity: "pop0.dedupe.disposition.secretary-of-hud.housing-analysis.accepted",
    recipientOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
    instrumentReceiptId: POP0_I4_TRACE_IDS.instrumentReceipt,
    authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.secretaryOfHud,
    capabilityAuthorityId: POP0_I4_IDS.hudCapability,
    kind: "ACCEPTED_AS_REQUESTED",
    acceptedProductKind: "HUD_SUPPLEMENTAL_RECORD_OPTIONS",
    acceptedSectionIds: [...POP0_I4_MONITORING_SECTION_IDS],
    acceptedCoordinationActions: [],
    constraintIds: [],
    constraintSourceReferenceIds: [],
    reason: null,
    limitations: ["The requested options product cannot itself become a waiver record or material result"],
    nextReviewAt: null,
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  });
  checkpoint?.();
  session.advanceTo(POP0_I4_TRACE_TIMES.assignment);
  session.createInstrumentAuthorizedAssignment({
    id: POP0_I4_TRACE_IDS.assignment,
    dispositionId: POP0_I4_TRACE_IDS.disposition,
    requesterId: POP0_I2_OFFICE_IDS.secretaryOfHud,
    leadOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
    objective: "Prepare bounded supplemental-record options without selecting the lower-owner result",
    sourceReferenceIds: [POP0_I4_TRACE_IDS.disposition],
    requiredConsultationOfficeIds: [],
    authorityReference: POP0_I4_TRACE_IDS.disposition,
    deadline: POP0_I4_TRACE_TIMES.assignmentDeadline,
    expectedProductKind: "HUD_SUPPLEMENTAL_RECORD_OPTIONS",
    authorizationScope: {
      kind: "ANALYSIS_ASSIGNMENT_SCOPE",
      evidenceArtifactId: POP0_I4_IDS.monitoringArtifact,
      evidenceSectionIds: [...POP0_I4_MONITORING_SECTION_IDS],
      productKind: "HUD_SUPPLEMENTAL_RECORD_OPTIONS",
    },
  });
  checkpoint?.();
  session.advanceTo(POP0_I4_TRACE_TIMES.assignmentStart);
  session.transitionOfficeAssignment({
    officeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
    assignmentId: POP0_I4_TRACE_IDS.assignment,
    status: "IN_PROGRESS",
    reason: null,
    statusProvenanceReferenceId: POP0_I4_TRACE_IDS.disposition,
    resultArtifactIds: [],
    supersededByAssignmentId: null,
  });
  checkpoint?.();
  session.advanceTo(POP0_I4_TRACE_TIMES.optionsResult);
  session.authorAssessment({
    id: POP0_I4_TRACE_IDS.optionsResult,
    version: "1",
    sectionIds: ["bounded-options", "limitations"],
    producingOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
    authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.secretaryOfHud,
    assignmentId: POP0_I4_TRACE_IDS.assignment,
    sourceReceiptIds: [POP0_I4_TRACE_IDS.monitoringReceipt],
    sourceRetrievalIds: [POP0_I4_TRACE_IDS.monitoringRetrieval],
    sourceMetadataNoticeIds: [POP0_I4_IDS.monitoringSecretaryNotice],
    judgmentRuleIds: [POP0_I4_IDS.housingAssessmentRule],
    claimedConfidence: "BOUNDED_OPTIONS_ONLY",
    evidentiarySupport: "Previously received monitoring scope",
    assumptionIds: [],
    limitations: ["This options result is not a NONAVAILABILITY_RECORD"],
    recommendation: "Open the separate raw-evidence route before any certified product",
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
    revisionOfArtifactId: null,
    supersedesArtifactId: null,
  });
  checkpoint?.();
  session.advanceTo(POP0_I4_TRACE_TIMES.assignmentComplete);
  session.transitionOfficeAssignment({
    officeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
    assignmentId: POP0_I4_TRACE_IDS.assignment,
    status: "COMPLETED",
    reason: null,
    statusProvenanceReferenceId: POP0_I4_TRACE_IDS.optionsResult,
    resultArtifactIds: [POP0_I4_TRACE_IDS.optionsResult],
    supersededByAssignmentId: null,
  });
  checkpoint?.();
};

export const runFullPop0I4Trace = (
  session: PresidentialOperatingProofSession,
  checkpoint?: () => void,
): void => {
  runI4ThroughCompletedOptionsAssignment(session, checkpoint);
  session.advanceTo(POP0_I4_TRACE_TIMES.rawNotice);
  session.deliverMetadataNotice({
    id: POP0_I4_TRACE_IDS.rawNotice,
    indexEntryId: POP0_I4_IDS.rawSupplierIndex,
    recipientOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
    deliveryPath: "COMPLETED_ASSIGNMENT_TO_RAW_EVIDENCE_INDEX_NOTICE",
    deduplicationIdentity: "pop0.dedupe.notice.secretary-of-hud.stables-supplier-evidence",
  });
  checkpoint?.();
  session.advanceTo(POP0_I4_TRACE_TIMES.rawRetrieval);
  session.attemptRetrieval({
    id: POP0_I4_TRACE_IDS.rawRetrieval,
    requestingOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
    artifactId: POP0_I4_IDS.rawSupplierArtifact,
    requestedSectionIds: [...POP0_I4_RAW_SUPPLIER_SECTION_IDS],
    metadataNoticeId: POP0_I4_TRACE_IDS.rawNotice,
  });
  checkpoint?.();
  session.advanceTo(POP0_I4_TRACE_TIMES.rawReceipt);
  session.admitSubstantiveReceipt({
    id: POP0_I4_TRACE_IDS.rawReceipt,
    recipientOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
    artifactId: POP0_I4_IDS.rawSupplierArtifact,
    receivedSectionIds: [...POP0_I4_RAW_SUPPLIER_SECTION_IDS],
    retrievalId: POP0_I4_TRACE_IDS.rawRetrieval,
    receivingAuthorityReference: POP0_I4_IDS.handlingAuthority,
    deduplicationIdentity: "pop0.dedupe.receipt.secretary-of-hud.stables-supplier-evidence",
  });
  checkpoint?.();
  session.advanceTo(POP0_I4_TRACE_TIMES.supplementalArtifact);
  session.authorDepartmentSupplementalRecord({
    productionId: POP0_I4_TRACE_IDS.supplementalProduction,
    producingOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
    authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.secretaryOfHud,
    sourceDispositionId: POP0_I4_TRACE_IDS.disposition,
    sourceAssignmentId: POP0_I4_TRACE_IDS.assignment,
    sourceAssignmentResultArtifactId: POP0_I4_TRACE_IDS.optionsResult,
    sourceEvidenceReceiptId: POP0_I4_TRACE_IDS.rawReceipt,
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  });
  checkpoint?.();
  const target = POP0_V0_OPERATING_CONFIGURATION.housing.handlingAuthority;
  session.advanceTo(POP0_I4_TRACE_TIMES.supplementalSubmission);
  session.submitDepartmentHandling({
    id: POP0_I4_TRACE_IDS.supplementalSubmission,
    deduplicationIdentity: "pop0.dedupe.handling.secretary-of-hud.submit-stables-supplement",
    submittingOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
    submittingOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.secretaryOfHud,
    handlingAuthorityId: POP0_I4_IDS.handlingAuthority,
    sourceDispositionId: POP0_I4_TRACE_IDS.disposition,
    sourceAssignmentId: POP0_I4_TRACE_IDS.assignment,
    sourceAssignmentResultArtifactId: POP0_I4_TRACE_IDS.optionsResult,
    targetInstitutionId: target.lowerInstitutionId,
    targetRequestId: target.targetRequestId,
    targetProjectId: target.targetProjectId,
    targetRelationshipId: target.targetRelationshipId,
    targetScopeKey: target.targetScopeKey,
    payload: {
      kind: "SUBMIT_SUPPLEMENTAL_RECORDS",
      recordTypeIds: ["NONAVAILABILITY_RECORD"],
      qualifyingEvidenceReference: {
        artifactId: POP0_I4_IDS.supplementalArtifact,
        artifactKind: "HUD_SUPPLEMENTAL_RECORD",
        recordTypeId: "NONAVAILABILITY_RECORD",
        certificationSectionId: "nonavailability-certification",
        sourceArtifactProductionId: POP0_I4_TRACE_IDS.supplementalProduction,
        sourceRawEvidenceReceiptId: POP0_I4_TRACE_IDS.rawReceipt,
        sourceLineageSectionId: "source-evidence-lineage",
      },
    },
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  });
  checkpoint?.();
  session.advanceTo(POP0_I4_TRACE_TIMES.reviewSubmission);
  session.submitDepartmentHandling({
    id: POP0_I4_TRACE_IDS.reviewSubmission,
    deduplicationIdentity: "pop0.dedupe.handling.secretary-of-hud.submit-stables-grant-intention",
    submittingOfficeId: POP0_I2_OFFICE_IDS.secretaryOfHud,
    submittingOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.secretaryOfHud,
    handlingAuthorityId: POP0_I4_IDS.handlingAuthority,
    sourceDispositionId: POP0_I4_TRACE_IDS.disposition,
    sourceAssignmentId: POP0_I4_TRACE_IDS.assignment,
    sourceAssignmentResultArtifactId: POP0_I4_TRACE_IDS.optionsResult,
    targetInstitutionId: target.lowerInstitutionId,
    targetRequestId: target.targetRequestId,
    targetProjectId: target.targetProjectId,
    targetRelationshipId: target.targetRelationshipId,
    targetScopeKey: target.targetScopeKey,
    payload: {
      kind: "SUBMIT_WAIVER_REVIEW_INTENTION",
      intention: "GRANT_SCOPED_WAIVER",
      supportingHandlingSubmissionIds: [POP0_I4_TRACE_IDS.supplementalSubmission],
    },
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  });
  checkpoint?.();
  const newInputIds = session.getOperatingState().ownerStates.programImplementation.materialInputs
    .filter((entry) => entry.projectRef === target.targetProjectId &&
      entry.validatedAt === POP0_I4_TRACE_TIMES.reviewSubmission)
    .map((entry) => entry.id);
  session.advanceTo(POP0_I4_TRACE_TIMES.materialAdmission);
  session.admitImplementationMaterialInputs({ materialInputIds: newInputIds });
  checkpoint?.();
};

export const createPop0I4TraceSession = (): PresidentialOperatingProofSession =>
  createPresidentialOperatingProofSession();
