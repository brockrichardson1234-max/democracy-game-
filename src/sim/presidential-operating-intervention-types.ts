export type PresidentialInstrumentKind =
  | "REQUEST_OFFICE_ANALYSIS"
  | "REQUEST_WORKSTREAM_COORDINATION";

export interface AnalysisRecipientCapabilityAuthority {
  readonly kind: "ANALYSIS_CAPABILITY";
  readonly id: string;
  readonly recipientOfficeId: string;
  readonly instrumentKind: "REQUEST_OFFICE_ANALYSIS";
  readonly effectiveFrom: string;
  readonly effectiveUntil: string | null;
  readonly authorityReference: string;
  readonly provenanceReference: string;
  readonly mayNarrow: boolean;
  readonly permittedProductKinds: readonly string[];
  readonly permittedSubjectScopeFamilies: readonly string[];
  readonly maximumSectionCount: number;
  readonly permittedLessClaimingProductKinds: readonly string[];
}

export interface CoordinationRecipientCapabilityAuthority {
  readonly kind: "COORDINATION_CAPABILITY";
  readonly id: string;
  readonly recipientOfficeId: string;
  readonly instrumentKind: "REQUEST_WORKSTREAM_COORDINATION";
  readonly effectiveFrom: string;
  readonly effectiveUntil: string | null;
  readonly authorityReference: string;
  readonly provenanceReference: string;
  readonly mayNarrow: boolean;
  readonly permittedWorkstreamIds: readonly string[];
  readonly permittedCoordinationActionKinds: readonly string[];
  readonly maximumParticipatingOfficeCount: number;
  readonly maximumReviewHorizonHours: number;
}

export type RecipientCapabilityAuthority =
  | AnalysisRecipientCapabilityAuthority
  | CoordinationRecipientCapabilityAuthority;

export interface InstrumentAttachmentMetadata {
  readonly artifactId: string;
  readonly sectionIds: readonly string[];
  readonly shownToPresident: boolean;
}

interface CommonInstrumentPayload {
  readonly payloadVersion: "1";
  readonly recipientOfficeId: string;
  readonly subjectScopeFamily: string;
  readonly requestedAct: string;
  readonly sourceReferenceIds: readonly string[];
  readonly attachmentMetadata: readonly InstrumentAttachmentMetadata[];
  readonly authorityBasis: string;
  readonly requestedResponseDeadline: string;
}

export interface RequestOfficeAnalysisPayload extends CommonInstrumentPayload {
  readonly kind: "REQUEST_OFFICE_ANALYSIS";
  readonly requestedQuestion: string;
  readonly requestedProductKind: string;
  readonly evidenceArtifactId: string;
  readonly evidenceSectionIds: readonly string[];
  readonly knownAccessLimitation: string | null;
  readonly narrowingPermitted: boolean;
}

export interface RequestWorkstreamCoordinationPayload extends CommonInstrumentPayload {
  readonly kind: "REQUEST_WORKSTREAM_COORDINATION";
  readonly workstreamId: string;
  readonly coordinationObjective: string;
  readonly participatingOfficeIds: readonly string[];
  readonly requestedReviewAt: string;
  readonly permittedCoordinationActions: readonly string[];
}

export type PresidentialInstrumentPayload =
  | RequestOfficeAnalysisPayload
  | RequestWorkstreamCoordinationPayload;

export interface PresidentialInstrumentPreview {
  readonly id: string;
  readonly payload: PresidentialInstrumentPayload;
  readonly payloadHash: string;
  readonly bundlePosition: number;
  readonly provenanceReference: string;
}

export interface RequestAnalysisAndCoordinationOption {
  readonly id: string;
  readonly kind: "REQUEST_SCOPED_ANALYSIS_AND_COORDINATION";
  readonly previews: readonly PresidentialInstrumentPreview[];
}

export interface ReservePresidentialReviewOption {
  readonly id: string;
  readonly kind: "RESERVE_PRESIDENTIAL_REVIEW";
  readonly previews: readonly [];
  readonly reservedAt: string;
  readonly reviewQuestion: string;
  readonly expectedSourceReferenceIds: readonly string[];
}

export interface AllowMonitoringDefaultOption {
  readonly id: string;
  readonly kind: "ALLOW_MONITORING_DEFAULT";
  readonly previews: readonly [];
}

export type PresidentialEscalationOption =
  | RequestAnalysisAndCoordinationOption
  | ReservePresidentialReviewOption
  | AllowMonitoringDefaultOption;

export interface PresidentialKnownPortion {
  readonly presentationId: string;
  readonly artifactId: string;
  readonly sectionId: string;
}

export interface StaffOnlySourcePortion {
  readonly artifactId: string;
  readonly sectionId: string;
}

export interface EscalationKnownClaim {
  readonly claim: string;
  readonly sourceReferenceIds: readonly string[];
}

export type EscalationBasisKind =
  | "RECEIPT"
  | "SYNTHESIS_CONFLICT"
  | "DUTY"
  | "DEADLINE"
  | "RESERVED_REVIEW";

export interface PresidentialEscalationRecord {
  readonly id: string;
  readonly deduplicationIdentity: string;
  readonly escalatingOfficeId: string;
  readonly escalatingOfficeholderAssignmentId: string;
  readonly createdAt: string;
  readonly basisKind: EscalationBasisKind;
  readonly basisSynthesisArtifactId: string;
  readonly sourceRecordIds: readonly string[];
  readonly presidentKnownPortions: readonly PresidentialKnownPortion[];
  readonly staffOnlySourcePortions: readonly StaffOnlySourcePortion[];
  readonly requestedJudgment: string;
  readonly knownClaims: readonly EscalationKnownClaim[];
  readonly uncertainties: readonly string[];
  readonly limitations: readonly string[];
  readonly options: readonly PresidentialEscalationOption[];
  readonly expiresAt: string;
  readonly defaultRule: {
    readonly presidentialInstrumentOutcome: "NO_NEW_PRESIDENTIAL_INSTRUMENT";
    readonly officeMonitoringOutcome: "CONTINUE_EXISTING_OFFICE_MONITORING";
  };
  readonly downstreamResolverOfficeIds: readonly string[];
  readonly provenanceReference: string;
}

export type EscalationLifecycleKind =
  | "ESCALATION_WITHDRAWN"
  | "ESCALATION_RESOLVED_BY_DECISION"
  | "ESCALATION_EXPIRED_TO_DEFAULT"
  | "ESCALATION_SUPERSEDED";

export interface EscalationLifecycleOccurrence {
  readonly id: string;
  readonly deduplicationIdentity: string;
  readonly escalationId: string;
  readonly kind: EscalationLifecycleKind;
  readonly occurredAt: string;
  readonly actingOfficeId: string | null;
  readonly actingOfficeholderAssignmentId: string | null;
  readonly causeRecordId: string;
  readonly provenanceReference: string;
}

export interface PresidentialDefaultOccurrence {
  readonly id: string;
  readonly deduplicationIdentity: string;
  readonly escalationId: string;
  readonly occurredAt: string;
  readonly outcome: "NO_NEW_PRESIDENTIAL_INSTRUMENT_CONTINUE_MONITORING";
  readonly provenanceReference: string;
}

export interface ReservedPresidentialReviewRecord {
  readonly id: string;
  readonly deduplicationIdentity: string;
  readonly sourceEscalationId: string;
  readonly sourceDecisionId: string;
  readonly reservedAt: string;
  readonly reviewQuestion: string;
  readonly priorPresentationIds: readonly string[];
  readonly expectedSourceReferenceIds: readonly string[];
  readonly provenanceReference: string;
}

export type ReservedReviewLifecycleKind =
  | "RESERVED_REVIEW_COMPLETED"
  | "RESERVED_REVIEW_CANCELLED"
  | "RESERVED_REVIEW_SUPERSEDED";

export interface ReservedReviewLifecycleOccurrence {
  readonly id: string;
  readonly deduplicationIdentity: string;
  readonly reservationId: string;
  readonly kind: ReservedReviewLifecycleKind;
  readonly occurredAt: string;
  readonly actingOfficeId: string;
  readonly actingOfficeholderAssignmentId: string;
  readonly causeRecordId: string;
  readonly provenanceReference: string;
}

export interface PresidentialEscalationOwnerState {
  readonly escalations: readonly PresidentialEscalationRecord[];
  readonly lifecycleOccurrences: readonly EscalationLifecycleOccurrence[];
  readonly defaultOccurrences: readonly PresidentialDefaultOccurrence[];
  readonly reservedReviews: readonly ReservedPresidentialReviewRecord[];
  readonly reservedReviewLifecycleOccurrences: readonly ReservedReviewLifecycleOccurrence[];
}

export type AdministrationWorkstreamStatus =
  | "MONITORED"
  | "ACTIVE"
  | "DELEGATED"
  | "PAUSED"
  | "BLOCKED"
  | "COMPLETED"
  | "ABANDONED";

export interface AdministrationWorkstreamRecord {
  readonly id: string;
  readonly label: string;
  readonly adoptedObjective: string;
  readonly creatingOfficeId: string;
  readonly creatingOfficeholderAssignmentId: string;
  readonly authorityReference: string;
  readonly coordinatorOfficeId: string;
  readonly participatingOfficeIds: readonly string[];
  readonly createdAt: string;
  readonly provenanceReference: string;
  readonly initialSourceReferenceIds: readonly string[];
  readonly initialReviewAt: string;
}

export interface AdministrationWorkstreamTransition {
  readonly id: string;
  readonly deduplicationIdentity: string;
  readonly workstreamId: string;
  readonly priorTransitionId: string | null;
  readonly status: AdministrationWorkstreamStatus;
  readonly actingOfficeId: string;
  readonly actingOfficeholderAssignmentId: string;
  readonly sourceOccurrenceIds: readonly string[];
  readonly occurredAt: string;
  readonly reason: string;
  readonly provenanceReference: string;
}

export interface AdministrationWorkstreamOwnerState {
  readonly workstreams: readonly AdministrationWorkstreamRecord[];
  readonly transitions: readonly AdministrationWorkstreamTransition[];
}

export interface PresidentialDecisionRecord {
  readonly id: string;
  readonly deduplicationIdentity: string;
  readonly controlBindingId: string;
  readonly presidentActorId: string;
  readonly constitutionalOfficeId: string;
  readonly sourceEscalationId: string;
  readonly selectedOptionId: string;
  readonly selectedOptionKind: PresidentialEscalationOption["kind"];
  readonly previewIds: readonly string[];
  readonly previewHashes: readonly string[];
  readonly decidedAt: string;
  readonly basisEscalationPresentationId: string;
  readonly acknowledgedUncertainties: readonly string[];
  readonly authorizedInstrumentIds: readonly string[];
  readonly reservedReviewId: string | null;
  readonly deliberateDefaultRuleReference: string | null;
  readonly provenanceReference: string;
  readonly supersedesDecisionId: string | null;
}

export interface PresidentialInstrumentRecord {
  readonly id: string;
  readonly deduplicationIdentity: string;
  readonly authorizingDecisionId: string;
  readonly selectedOptionId: string;
  readonly sourcePreviewId: string;
  readonly sourcePreviewHash: string;
  readonly issuingPresidentActorId: string;
  readonly issuingConstitutionalOfficeId: string;
  readonly issuedAt: string;
  readonly provenanceReference: string;
  readonly revisionOfInstrumentId: string | null;
  readonly supersedesInstrumentId: string | null;
  readonly payload: PresidentialInstrumentPayload;
}

export type InstrumentDispatchOutcome =
  | "DELIVERED_TO_OFFICE_BOUNDARY"
  | "NOT_DELIVERED"
  | "FAILED";

export interface InstrumentDispatchRecord {
  readonly id: string;
  readonly deduplicationIdentity: string;
  readonly instrumentId: string;
  readonly recipientOfficeId: string;
  readonly dispatchingOfficeId: string;
  readonly dispatchPath: string;
  readonly attemptedAt: string;
  readonly outcome: InstrumentDispatchOutcome;
  readonly deliveredAt: string | null;
  readonly failureReason: string | null;
  readonly outcomeProvenanceReference: string;
  readonly retryOfDispatchId: string | null;
}

export interface OfficeInstrumentReceipt {
  readonly id: string;
  readonly deduplicationIdentity: string;
  readonly recipientOfficeId: string;
  readonly instrumentId: string;
  readonly successfulDispatchId: string;
  readonly receivedPayloadVersion: "1";
  readonly receivedAt: string;
  readonly receiptPath: string;
  readonly receivingAuthorityReference: string;
  readonly provenanceReference: string;
}

export type RecipientDispositionKind =
  | "ACCEPTED_AS_REQUESTED"
  | "NARROWED"
  | "DELAYED"
  | "REFUSED"
  | "NO_ACTION_BY_DEADLINE";

export type RecipientConstraint =
  | "NO_EFFECTIVE_RECIPIENT_CAPABILITY"
  | "REQUEST_OUTSIDE_CAPABILITY"
  | "MISSING_REQUIRED_EVIDENCE"
  | "OFFICE_QUEUE_OR_DEADLINE_CONSTRAINT"
  | "EFFECTIVE_AUTHORITY_NOT_YET_AVAILABLE";

export interface RecipientInstrumentDisposition {
  readonly id: string;
  readonly deduplicationIdentity: string;
  readonly recipientOfficeId: string;
  readonly instrumentReceiptId: string;
  readonly instrumentId: string;
  readonly authoringOfficeholderAssignmentId: string | null;
  readonly capabilityAuthorityId: string | null;
  readonly kind: RecipientDispositionKind;
  readonly dispositionAt: string;
  readonly acceptedProductKind: string | null;
  readonly acceptedSectionIds: readonly string[];
  readonly acceptedCoordinationActions: readonly string[];
  readonly constraintIds: readonly RecipientConstraint[];
  readonly reason: string | null;
  readonly limitations: readonly string[];
  readonly nextReviewAt: string | null;
  readonly provenanceReference: string;
}

export interface EscalationPresentationRecord {
  readonly id: string;
  readonly deduplicationIdentity: string;
  readonly sourceEscalationId: string;
  readonly recipientBindingId: string;
  readonly recipientActorId: string;
  readonly constitutionalOfficeId: string;
  readonly presentingOfficeId: string;
  readonly presenterOfficeholderAssignmentId: string;
  readonly presentedAt: string;
  readonly shownSectionIds: readonly string[];
  readonly shownOptionIds: readonly string[];
  readonly shownPreviewIds: readonly string[];
  readonly shownPreviewHashes: readonly string[];
  readonly referencedButNotShownSourcePortions: readonly StaffOnlySourcePortion[];
  readonly purpose: string;
  readonly provenanceReference: string;
}

export interface HistoricalRecordIndexEntry {
  readonly historyId: string;
  readonly occurrenceId: string;
  readonly ownerId: string;
  readonly recordKind: string;
  readonly occurredAt: string;
  readonly ownerRecordId: string;
  readonly causalParentOccurrenceIds: readonly string[];
}

export interface PresidentialInterventionOwnerStates {
  readonly presidentialEscalations: {
    readonly ownerId: string;
    readonly state: PresidentialEscalationOwnerState;
  };
  readonly administrationWorkstreams: {
    readonly ownerId: string;
    readonly state: AdministrationWorkstreamOwnerState;
  };
  readonly presidentialDecisions: {
    readonly ownerId: string;
    readonly state: readonly PresidentialDecisionRecord[];
  };
  readonly presidentialInstruments: {
    readonly ownerId: string;
    readonly state: readonly PresidentialInstrumentRecord[];
  };
  readonly instrumentDispatches: {
    readonly ownerId: string;
    readonly state: readonly InstrumentDispatchRecord[];
  };
  readonly historicalRecordIndex: {
    readonly ownerId: string;
    readonly state: {
      readonly historyId: string;
      readonly entries: readonly HistoricalRecordIndexEntry[];
    };
  };
}

export interface EscalationAttentionItem {
  readonly kind: "PRESENTED_ESCALATION";
  readonly escalationId: string;
  readonly escalationPresentationId: string;
  readonly presentedAt: string;
  readonly expiresAt: string;
  readonly requestedJudgment: string;
  readonly shownSectionIds: readonly string[];
  readonly optionIds: readonly string[];
  readonly previews: readonly PresidentialInstrumentPreview[];
  readonly uncertainties: readonly string[];
  readonly limitations: readonly string[];
  readonly downstreamResolverOfficeIds: readonly string[];
}

export interface ReservedReviewAttentionItem {
  readonly kind: "DUE_RESERVED_REVIEW";
  readonly reservationId: string;
  readonly reservedAt: string;
  readonly reviewQuestion: string;
  readonly priorDecisionId: string;
  readonly priorPresentedPortions: readonly PresidentialKnownPortion[];
  readonly expectedProductPresented: boolean;
}

export type PresidentialAttentionItem =
  | EscalationAttentionItem
  | ReservedReviewAttentionItem;

export interface AdministrationWorkstreamView {
  readonly id: string;
  readonly label: string;
  readonly adoptedObjective: string;
  readonly coordinatorOfficeId: string;
  readonly participatingOfficeIds: readonly string[];
  readonly currentStatus: AdministrationWorkstreamStatus;
  readonly lastTransitionAt: string;
  readonly nextReviewAt: string;
}

export interface PresidentialHistoryViewEntry {
  readonly occurrenceId: string;
  readonly recordKind: "PRESIDENTIAL_DECISION" | "PRESIDENTIAL_INSTRUMENT";
  readonly occurredAt: string;
}
