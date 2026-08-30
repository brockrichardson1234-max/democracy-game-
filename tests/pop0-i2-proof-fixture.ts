import {
  createPresidentialOperatingProofSession,
  type PresidentialOperatingProofSession,
} from "../src/app/presidential-operating-proof-session";
import {
  POP0_I2_ASSESSMENT_RULE_IDS,
  POP0_I2_INSTITUTION_IDS,
  POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS,
  POP0_I2_OFFICE_IDS,
  POP0_I2_SOURCE_ARTIFACT_ID,
  POP0_I2_SOURCE_SECTION_IDS,
  POP0_I2_SUPPLIER_ASSUMPTION_ID,
  POP0_V0_OPERATING_CONFIGURATION,
  POP0_V0_PROVENANCE_ROOT,
} from "../src/content/pop0-v0/configuration";
import type { PresidentialOperatingRuntimeConfiguration } from "../src/sim/presidential-operating-runtime";

export const POP0_I2_TRACE_TIMES = {
  epoch: "2029-02-05T08:00:00-05:00",
  index: "2029-02-05T08:05:00-05:00",
  notice: "2029-02-05T08:10:00-05:00",
  assignment: "2029-02-05T08:15:00-05:00",
  retrieval: "2029-02-05T08:20:00-05:00",
  receipt: "2029-02-05T08:30:00-05:00",
  laborAssessment: "2029-02-05T08:40:00-05:00",
  officeAssessments: "2029-02-05T09:00:00-05:00",
  transfer: "2029-02-05T09:05:00-05:00",
  synthesis: "2029-02-05T09:15:00-05:00",
  presentation: "2029-02-05T09:30:00-05:00",
} as const;

export const POP0_I2_TRACE_IDS = {
  possession: "pop0.possession.dol.preliminary-labor-evidence",
  index: "pop0.index.preliminary-labor-evidence",
  laborNotice: "pop0.notice.secretary-labor.preliminary-labor-evidence",
  necNotice: "pop0.notice.nec.preliminary-labor-evidence",
  ombNotice: "pop0.notice.omb.preliminary-labor-evidence",
  necAssignment: "pop0.assignment.nec.assess-preliminary-evidence",
  ombAssignment: "pop0.assignment.omb.bound-estimate",
  laborRetrieval: "pop0.retrieval.secretary-labor.preliminary-labor-evidence",
  necRetrieval: "pop0.retrieval.nec.preliminary-labor-evidence",
  ombRetrieval: "pop0.retrieval.omb.preliminary-labor-evidence",
  laborReceipt: "pop0.receipt.secretary-labor.preliminary-labor-evidence",
  necReceipt: "pop0.receipt.nec.preliminary-labor-evidence",
  laborAssessment: "pop0.artifact.assessment.labor-measurement-bounds.v1",
  necAssessment: "pop0.artifact.assessment.nec-supplier-risk.v1",
  ombAssessment: "pop0.artifact.assessment.omb-not-estimable.v1",
  laborAssessmentReceiptAtChiefOfStaff: "pop0.receipt.chief-of-staff.labor-assessment",
  necAssessmentReceiptAtChiefOfStaff: "pop0.receipt.chief-of-staff.nec-assessment",
  synthesis: "pop0.artifact.synthesis.chief-of-staff.v1",
  presentation: "pop0.presentation.chief-of-staff-to-president.v1",
} as const;

export const POP0_I2_ASSESSMENT_SECTION_IDS = [
  "assessment-summary",
  "proposition-judgments",
  "limitations",
] as const;

export const POP0_I2_SYNTHESIS_SECTION_IDS = [
  "executive-summary-a",
  "executive-summary-b",
  "source-assessment-index",
] as const;

export const createPop0I2TraceSession = (
  configuration: PresidentialOperatingRuntimeConfiguration = POP0_V0_OPERATING_CONFIGURATION,
): PresidentialOperatingProofSession => createPresidentialOperatingProofSession(undefined, configuration);

export const establishPossessionAndIndex = (session: PresidentialOperatingProofSession): void => {
  session.recordInstitutionPossession({
    id: POP0_I2_TRACE_IDS.possession,
    artifactId: POP0_I2_SOURCE_ARTIFACT_ID,
    possessingInstitutionId: POP0_I2_INSTITUTION_IDS.labor,
    acquisitionProvenanceReference: POP0_V0_PROVENANCE_ROOT,
  });
  session.advanceTo(POP0_I2_TRACE_TIMES.index);
  session.createInformationIndex({
    id: POP0_I2_TRACE_IDS.index,
    artifactId: POP0_I2_SOURCE_ARTIFACT_ID,
    sourcePossessionId: POP0_I2_TRACE_IDS.possession,
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  });
};

export const deliverProofNotices = (
  session: PresidentialOperatingProofSession,
  order: readonly ("LABOR" | "NEC" | "OMB")[] = ["LABOR", "NEC", "OMB"],
): void => {
  session.advanceTo(POP0_I2_TRACE_TIMES.notice);
  const inputs = {
    LABOR: {
      id: POP0_I2_TRACE_IDS.laborNotice,
      indexEntryId: POP0_I2_TRACE_IDS.index,
      recipientOfficeId: POP0_I2_OFFICE_IDS.secretaryOfLabor,
      deliveryPath: "CONFIGURED_WHITE_HOUSE_INDEX_NOTICE",
      deduplicationIdentity: "pop0.dedupe.notice.secretary-labor.preliminary",
    },
    NEC: {
      id: POP0_I2_TRACE_IDS.necNotice,
      indexEntryId: POP0_I2_TRACE_IDS.index,
      recipientOfficeId: POP0_I2_OFFICE_IDS.nec,
      deliveryPath: "CONFIGURED_WHITE_HOUSE_INDEX_NOTICE",
      deduplicationIdentity: "pop0.dedupe.notice.nec.preliminary",
    },
    OMB: {
      id: POP0_I2_TRACE_IDS.ombNotice,
      indexEntryId: POP0_I2_TRACE_IDS.index,
      recipientOfficeId: POP0_I2_OFFICE_IDS.omb,
      deliveryPath: "CONFIGURED_WHITE_HOUSE_INDEX_NOTICE",
      deduplicationIdentity: "pop0.dedupe.notice.omb.preliminary",
    },
  } as const;
  order.forEach((key) => session.deliverMetadataNotice(inputs[key]));
};

export const createProofAssignments = (
  session: PresidentialOperatingProofSession,
  order: readonly ("NEC" | "OMB")[] = ["NEC", "OMB"],
): void => {
  session.advanceTo(POP0_I2_TRACE_TIMES.assignment);
  const inputs = {
    NEC: {
      id: POP0_I2_TRACE_IDS.necAssignment,
      requesterId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      leadOfficeId: POP0_I2_OFFICE_IDS.nec,
      objective: "Assess the bounded supplier-spillover proposition",
      sourceReferenceIds: [POP0_I2_TRACE_IDS.necNotice],
      requiredConsultationOfficeIds: [POP0_I2_OFFICE_IDS.secretaryOfLabor],
      authorityReference: POP0_V0_PROVENANCE_ROOT,
      deadline: "2029-02-05T09:00:00-05:00",
      expectedProductKind: "ECONOMIC_ASSESSMENT",
    },
    OMB: {
      id: POP0_I2_TRACE_IDS.ombAssignment,
      requesterId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      leadOfficeId: POP0_I2_OFFICE_IDS.omb,
      objective: "Determine whether a bounded estimate is supportable",
      sourceReferenceIds: [POP0_I2_TRACE_IDS.ombNotice],
      requiredConsultationOfficeIds: [],
      authorityReference: POP0_V0_PROVENANCE_ROOT,
      deadline: "2029-02-05T09:00:00-05:00",
      expectedProductKind: "SUPPORTABILITY_ASSESSMENT",
    },
  } as const;
  order.forEach((key) => session.createOfficeAssignment(inputs[key]));
};

export const attemptProofRetrievals = (session: PresidentialOperatingProofSession): void => {
  session.advanceTo(POP0_I2_TRACE_TIMES.retrieval);
  session.attemptRetrieval({
    id: POP0_I2_TRACE_IDS.laborRetrieval,
    requestingOfficeId: POP0_I2_OFFICE_IDS.secretaryOfLabor,
    artifactId: POP0_I2_SOURCE_ARTIFACT_ID,
    requestedSectionIds: Object.values(POP0_I2_SOURCE_SECTION_IDS),
    metadataNoticeId: POP0_I2_TRACE_IDS.laborNotice,
  });
  session.attemptRetrieval({
    id: POP0_I2_TRACE_IDS.necRetrieval,
    requestingOfficeId: POP0_I2_OFFICE_IDS.nec,
    artifactId: POP0_I2_SOURCE_ARTIFACT_ID,
    requestedSectionIds: [POP0_I2_SOURCE_SECTION_IDS.summary, POP0_I2_SOURCE_SECTION_IDS.regionalTable],
    metadataNoticeId: POP0_I2_TRACE_IDS.necNotice,
  });
  session.attemptRetrieval({
    id: POP0_I2_TRACE_IDS.ombRetrieval,
    requestingOfficeId: POP0_I2_OFFICE_IDS.omb,
    artifactId: POP0_I2_SOURCE_ARTIFACT_ID,
    requestedSectionIds: [POP0_I2_SOURCE_SECTION_IDS.summary],
    metadataNoticeId: POP0_I2_TRACE_IDS.ombNotice,
  });
};

export const admitProofReceiptsAndResolveQueues = (
  session: PresidentialOperatingProofSession,
): void => {
  session.advanceTo(POP0_I2_TRACE_TIMES.receipt);
  session.admitSubstantiveReceipt({
    id: POP0_I2_TRACE_IDS.laborReceipt,
    recipientOfficeId: POP0_I2_OFFICE_IDS.secretaryOfLabor,
    artifactId: POP0_I2_SOURCE_ARTIFACT_ID,
    receivedSectionIds: Object.values(POP0_I2_SOURCE_SECTION_IDS),
    retrievalId: POP0_I2_TRACE_IDS.laborRetrieval,
    receivingAuthorityReference: POP0_V0_PROVENANCE_ROOT,
    deduplicationIdentity: "pop0.dedupe.receipt.secretary-labor.preliminary",
  });
  session.admitSubstantiveReceipt({
    id: POP0_I2_TRACE_IDS.necReceipt,
    recipientOfficeId: POP0_I2_OFFICE_IDS.nec,
    artifactId: POP0_I2_SOURCE_ARTIFACT_ID,
    receivedSectionIds: [POP0_I2_SOURCE_SECTION_IDS.summary, POP0_I2_SOURCE_SECTION_IDS.regionalTable],
    retrievalId: POP0_I2_TRACE_IDS.necRetrieval,
    receivingAuthorityReference: POP0_V0_PROVENANCE_ROOT,
    deduplicationIdentity: "pop0.dedupe.receipt.nec.preliminary",
  });
  session.transitionOfficeAssignment({
    officeId: POP0_I2_OFFICE_IDS.nec,
    assignmentId: POP0_I2_TRACE_IDS.necAssignment,
    status: "IN_PROGRESS",
    reason: null,
    statusProvenanceReferenceId: POP0_I2_TRACE_IDS.necReceipt,
    resultArtifactIds: [],
    supersededByAssignmentId: null,
  });
  session.transitionOfficeAssignment({
    officeId: POP0_I2_OFFICE_IDS.omb,
    assignmentId: POP0_I2_TRACE_IDS.ombAssignment,
    status: "BLOCKED",
    reason: "NO_ACTIVE_ENTITLEMENT_FOR_REQUESTED_SCOPE",
    statusProvenanceReferenceId: POP0_I2_TRACE_IDS.ombRetrieval,
    resultArtifactIds: [],
    supersededByAssignmentId: null,
  });
};

export const authorLaborAssessment = (session: PresidentialOperatingProofSession): void => {
  session.advanceTo(POP0_I2_TRACE_TIMES.laborAssessment);
  session.authorAssessment({
    id: POP0_I2_TRACE_IDS.laborAssessment,
    version: "1",
    sectionIds: POP0_I2_ASSESSMENT_SECTION_IDS,
    producingOfficeId: POP0_I2_OFFICE_IDS.secretaryOfLabor,
    authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.secretaryOfLabor,
    assignmentId: null,
    sourceReceiptIds: [POP0_I2_TRACE_IDS.laborReceipt],
    sourceRetrievalIds: [POP0_I2_TRACE_IDS.laborRetrieval],
    sourceMetadataNoticeIds: [POP0_I2_TRACE_IDS.laborNotice],
    judgmentRuleIds: [POP0_I2_ASSESSMENT_RULE_IDS.currentEvidenceDoesNotSupportSpillover],
    claimedConfidence: "HIGH_ON_OBSERVED_REGIONAL_WEAKNESS",
    evidentiarySupport: "MEASURED_PRELIMINARY_REGIONAL_EVIDENCE",
    assumptionIds: [],
    limitations: ["The source does not measure broader supplier effects"],
    recommendation: null,
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
    revisionOfArtifactId: null,
    supersedesArtifactId: null,
  });
};

export const authorNecAndOmbAssessments = (session: PresidentialOperatingProofSession): void => {
  session.advanceTo(POP0_I2_TRACE_TIMES.officeAssessments);
  session.authorAssessment({
    id: POP0_I2_TRACE_IDS.necAssessment,
    version: "1",
    sectionIds: POP0_I2_ASSESSMENT_SECTION_IDS,
    producingOfficeId: POP0_I2_OFFICE_IDS.nec,
    authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.necDirector,
    assignmentId: POP0_I2_TRACE_IDS.necAssignment,
    sourceReceiptIds: [POP0_I2_TRACE_IDS.necReceipt],
    sourceRetrievalIds: [POP0_I2_TRACE_IDS.necRetrieval],
    sourceMetadataNoticeIds: [POP0_I2_TRACE_IDS.necNotice],
    judgmentRuleIds: [POP0_I2_ASSESSMENT_RULE_IDS.supplierAssumptionSupportsPlausibility],
    claimedConfidence: "BOUNDED",
    evidentiarySupport: "RECEIVED_EVIDENCE_PLUS_DECLARED_ASSUMPTION",
    assumptionIds: [POP0_I2_SUPPLIER_ASSUMPTION_ID],
    limitations: ["Supplier linkage is an explicit analytical assumption"],
    recommendation: "Treat broader effects as plausible, not confirmed",
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
    revisionOfArtifactId: null,
    supersedesArtifactId: null,
  });
  session.authorAssessment({
    id: POP0_I2_TRACE_IDS.ombAssessment,
    version: "1",
    sectionIds: POP0_I2_ASSESSMENT_SECTION_IDS,
    producingOfficeId: POP0_I2_OFFICE_IDS.omb,
    authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.ombDirector,
    assignmentId: POP0_I2_TRACE_IDS.ombAssignment,
    sourceReceiptIds: [],
    sourceRetrievalIds: [POP0_I2_TRACE_IDS.ombRetrieval],
    sourceMetadataNoticeIds: [POP0_I2_TRACE_IDS.ombNotice],
    judgmentRuleIds: [POP0_I2_ASSESSMENT_RULE_IDS.metadataCannotSupportEstimate],
    claimedConfidence: "HIGH_ON_NON_ESTIMABILITY",
    evidentiarySupport: "METADATA_AND_ACCESS_DENIAL_ONLY",
    assumptionIds: [],
    limitations: ["No substantive report sections were received"],
    recommendation: "Do not represent fiscal consequences as estimated",
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
    revisionOfArtifactId: null,
    supersedesArtifactId: null,
  });
  session.transitionOfficeAssignment({
    officeId: POP0_I2_OFFICE_IDS.nec,
    assignmentId: POP0_I2_TRACE_IDS.necAssignment,
    status: "COMPLETED",
    reason: null,
    statusProvenanceReferenceId: POP0_I2_TRACE_IDS.necAssessment,
    resultArtifactIds: [POP0_I2_TRACE_IDS.necAssessment],
    supersededByAssignmentId: null,
  });
};

export const transferAssessmentsToChiefOfStaff = (
  session: PresidentialOperatingProofSession,
): void => {
  session.advanceTo(POP0_I2_TRACE_TIMES.transfer);
  session.transferOfficeArtifact({
    id: POP0_I2_TRACE_IDS.laborAssessmentReceiptAtChiefOfStaff,
    sourceOfficeId: POP0_I2_OFFICE_IDS.secretaryOfLabor,
    sourceOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.secretaryOfLabor,
    recipientOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
    artifactId: POP0_I2_TRACE_IDS.laborAssessment,
    receivedSectionIds: POP0_I2_ASSESSMENT_SECTION_IDS,
    receivingAuthorityReference: POP0_V0_PROVENANCE_ROOT,
    deduplicationIdentity: "pop0.dedupe.receipt.chief-of-staff.labor-assessment",
  });
  session.transferOfficeArtifact({
    id: POP0_I2_TRACE_IDS.necAssessmentReceiptAtChiefOfStaff,
    sourceOfficeId: POP0_I2_OFFICE_IDS.nec,
    sourceOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.necDirector,
    recipientOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
    artifactId: POP0_I2_TRACE_IDS.necAssessment,
    receivedSectionIds: POP0_I2_ASSESSMENT_SECTION_IDS,
    receivingAuthorityReference: POP0_V0_PROVENANCE_ROOT,
    deduplicationIdentity: "pop0.dedupe.receipt.chief-of-staff.nec-assessment",
  });
};

export const authorChiefOfStaffSynthesis = (session: PresidentialOperatingProofSession): void => {
  session.advanceTo(POP0_I2_TRACE_TIMES.synthesis);
  session.authorSynthesis({
    id: POP0_I2_TRACE_IDS.synthesis,
    version: "1",
    sectionIds: POP0_I2_SYNTHESIS_SECTION_IDS,
    producingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
    authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.chiefOfStaff,
    sourceAssessmentReceiptIds: [
      POP0_I2_TRACE_IDS.laborAssessmentReceiptAtChiefOfStaff,
      POP0_I2_TRACE_IDS.necAssessmentReceiptAtChiefOfStaff,
    ],
    synthesisJudgment: "Regional weakness is observed; broader supplier effects remain disputed",
    limitations: ["OMB could not produce a substantive estimate under current access"],
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
    revisionOfArtifactId: null,
    supersedesArtifactId: null,
  });
};

export const presentBoundedSynthesis = (session: PresidentialOperatingProofSession): void => {
  session.advanceTo(POP0_I2_TRACE_TIMES.presentation);
  session.recordPresidentialPresentation({
    id: POP0_I2_TRACE_IDS.presentation,
    deduplicationIdentity: "pop0.dedupe.presentation.chief-of-staff-to-president.v1",
    presentingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
    presenterOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.chiefOfStaff,
    shownPortions: [
      { artifactId: POP0_I2_TRACE_IDS.synthesis, sectionId: POP0_I2_SYNTHESIS_SECTION_IDS[0] },
      { artifactId: POP0_I2_TRACE_IDS.synthesis, sectionId: POP0_I2_SYNTHESIS_SECTION_IDS[1] },
    ],
    referencedButNotShownPortions: [
      { artifactId: POP0_I2_SOURCE_ARTIFACT_ID, sectionId: POP0_I2_SOURCE_SECTION_IDS.regionalTable },
      { artifactId: POP0_I2_SOURCE_ARTIFACT_ID, sectionId: POP0_I2_SOURCE_SECTION_IDS.methods },
    ],
    purpose: "Bounded proof presentation of preserved office disagreement",
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
    revisionOfPresentationId: null,
    supersedesPresentationId: null,
  });
};

export const runPop0I2ThroughNotice = (session: PresidentialOperatingProofSession): void => {
  establishPossessionAndIndex(session);
  deliverProofNotices(session);
};

export const runPop0I2ThroughRetrieval = (session: PresidentialOperatingProofSession): void => {
  runPop0I2ThroughNotice(session);
  createProofAssignments(session);
  attemptProofRetrievals(session);
};

export const runPop0I2ThroughDisagreement = (session: PresidentialOperatingProofSession): void => {
  runPop0I2ThroughRetrieval(session);
  admitProofReceiptsAndResolveQueues(session);
  authorLaborAssessment(session);
  authorNecAndOmbAssessments(session);
};

export const runPop0I2ThroughSynthesis = (session: PresidentialOperatingProofSession): void => {
  runPop0I2ThroughDisagreement(session);
  transferAssessmentsToChiefOfStaff(session);
  authorChiefOfStaffSynthesis(session);
};

export const runFullPop0I2Trace = (session: PresidentialOperatingProofSession): void => {
  runPop0I2ThroughSynthesis(session);
  presentBoundedSynthesis(session);
};
