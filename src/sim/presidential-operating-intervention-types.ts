export type PresidentialInstrumentKind =
  | "REQUEST_OFFICE_ANALYSIS"
  | "REQUEST_WORKSTREAM_COORDINATION"
  | "AUTHORIZE_LEGISLATIVE_POSITION"
  | "REQUEST_INTERGOVERNMENTAL_CONTACT"
  | "AUTHORIZE_PUBLIC_STATEMENT";

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

export interface LegislativePositionRecipientCapabilityAuthority {
  readonly kind: "LEGISLATIVE_POSITION_CAPABILITY";
  readonly id: string;
  readonly recipientOfficeId: string;
  readonly instrumentKind: "AUTHORIZE_LEGISLATIVE_POSITION";
  readonly effectiveFrom: string;
  readonly effectiveUntil: string | null;
  readonly authorityReference: string;
  readonly provenanceReference: string;
  readonly mayNarrow: boolean;
  readonly permittedInitiativeIds: readonly string[];
  readonly proposalVersionRule: "CURRENT_CANONICAL_VERSION_AT_PREVIEW";
  readonly permittedPositionKinds: readonly (
    | "SUPPORT_AS_INTRODUCED"
    | "OPPOSE"
    | "NEGOTIATE_EXACT_TERMS"
  )[];
  readonly permittedNegotiableTermIds: readonly string[];
  readonly maximumNegotiableTermCount: number;
  readonly lessCommittingPositionAllowed: boolean;
}

export interface IntergovernmentalContactRecipientCapabilityAuthority {
  readonly kind: "INTERGOVERNMENTAL_CONTACT_CAPABILITY";
  readonly id: string;
  readonly recipientOfficeId: string;
  readonly instrumentKind: "REQUEST_INTERGOVERNMENTAL_CONTACT";
  readonly effectiveFrom: string;
  readonly effectiveUntil: string | null;
  readonly authorityReference: string;
  readonly provenanceReference: string;
  readonly mayNarrow: boolean;
  readonly permittedGovernorIds: readonly string[];
  readonly permittedPurposeFamilies: readonly string[];
  readonly maximumRecipientCount: number;
  readonly maximumTalkingPointCount: number;
  readonly prohibitedCommitmentKinds: readonly string[];
  readonly permittedNarrowing: "REMOVE_RECIPIENTS_OR_TALKING_POINTS_ONLY";
}

export interface PublicStatementRecipientCapabilityAuthority {
  readonly kind: "PUBLIC_STATEMENT_CAPABILITY";
  readonly id: string;
  readonly recipientOfficeId: string;
  readonly instrumentKind: "AUTHORIZE_PUBLIC_STATEMENT";
  readonly effectiveFrom: string;
  readonly effectiveUntil: string | null;
  readonly authorityReference: string;
  readonly provenanceReference: string;
  readonly mayNarrow: boolean;
  readonly permittedSubjectFamilies: readonly string[];
  readonly maximumClaimCount: number;
  readonly requiresPresentedSourceLineage: true;
  readonly prohibitedUnsupportedClaimFamilies: readonly string[];
  readonly maximumReleaseWindowHours: number;
  readonly permittedNarrowing: "REMOVE_CLAIMS_ONLY";
}

export type RecipientCapabilityAuthority =
  | AnalysisRecipientCapabilityAuthority
  | CoordinationRecipientCapabilityAuthority
  | LegislativePositionRecipientCapabilityAuthority
  | IntergovernmentalContactRecipientCapabilityAuthority
  | PublicStatementRecipientCapabilityAuthority;

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

export interface AuthorizeLegislativePositionPayload extends CommonInstrumentPayload {
  readonly kind: "AUTHORIZE_LEGISLATIVE_POSITION";
  readonly initiativeId: string;
  readonly proposalVersion: number;
  readonly positionKind: "SUPPORT_AS_INTRODUCED" | "OPPOSE" | "NEGOTIATE_EXACT_TERMS";
  readonly negotiableTermIds: readonly string[];
  readonly evidenceReferenceIds: readonly string[];
  readonly narrowingPermitted: boolean;
}

export interface RequestIntergovernmentalContactPayload extends CommonInstrumentPayload {
  readonly kind: "REQUEST_INTERGOVERNMENTAL_CONTACT";
  readonly governorActorIds: readonly string[];
  readonly purposeFamily: string;
  readonly talkingPoints: readonly string[];
  readonly prohibitedCommitmentKinds: readonly string[];
  readonly narrowingPermitted: boolean;
}

export interface AuthorizePublicStatementPayload extends CommonInstrumentPayload {
  readonly kind: "AUTHORIZE_PUBLIC_STATEMENT";
  readonly subjectFamily: string;
  readonly approvedClaims: readonly string[];
  readonly limitations: readonly string[];
  readonly sourceSectionReferences: readonly {
    readonly artifactId: string;
    readonly sectionId: string;
  }[];
  readonly prohibitedUnsupportedClaimFamilies: readonly string[];
  readonly releaseWindowEndsAt: string;
  readonly narrowingPermitted: boolean;
}

export type PresidentialInstrumentPayload =
  | RequestOfficeAnalysisPayload
  | RequestWorkstreamCoordinationPayload
  | AuthorizeLegislativePositionPayload
  | RequestIntergovernmentalContactPayload
  | AuthorizePublicStatementPayload;

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

export interface AuthorizeLegislativePositionOption {
  readonly id: string;
  readonly kind: "AUTHORIZE_LEGISLATIVE_POSITION_OPTION";
  readonly previews: readonly [PresidentialInstrumentPreview];
}

export interface RequestIntergovernmentalContactOption {
  readonly id: string;
  readonly kind: "REQUEST_INTERGOVERNMENTAL_CONTACT_OPTION";
  readonly previews: readonly [PresidentialInstrumentPreview];
}

export interface AuthorizePublicStatementOption {
  readonly id: string;
  readonly kind: "AUTHORIZE_PUBLIC_STATEMENT_OPTION";
  readonly previews: readonly [PresidentialInstrumentPreview];
}

export type PresidentialEscalationOption =
  | RequestAnalysisAndCoordinationOption
  | ReservePresidentialReviewOption
  | AllowMonitoringDefaultOption
  | AuthorizeLegislativePositionOption
  | RequestIntergovernmentalContactOption
  | AuthorizePublicStatementOption;

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
  readonly basisArtifactId: string;
  readonly basisReceiptId: string | null;
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

export interface EscalationPresidentialDecisionRecord {
  readonly sourceKind: "ESCALATION_PRESENTATION";
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

export interface InquiryPresidentialDecisionRecord {
  readonly sourceKind: "INQUIRY_PREVIEW_PRESENTATION";
  readonly id: string;
  readonly deduplicationIdentity: string;
  readonly controlBindingId: string;
  readonly presidentActorId: string;
  readonly constitutionalOfficeId: string;
  readonly sourceEscalationId: null;
  readonly selectedOptionId: string;
  readonly selectedOptionKind: "PROACTIVE_INQUIRY_REQUEST";
  readonly sourceInquiryOpportunityId: string;
  readonly inquiryPreviewPresentationId: string;
  readonly previewIds: readonly [string];
  readonly previewHashes: readonly [string];
  readonly decidedAt: string;
  readonly acknowledgedUncertainties: readonly string[];
  readonly authorizedInstrumentIds: readonly [string];
  readonly reservedReviewId: null;
  readonly deliberateDefaultRuleReference: null;
  readonly basisEscalationPresentationId: null;
  readonly provenanceReference: string;
  readonly supersedesDecisionId: null;
}

export type PresidentialDecisionRecord =
  | EscalationPresidentialDecisionRecord
  | InquiryPresidentialDecisionRecord;

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
  readonly constraintSourceReferenceIds: readonly string[];
  readonly reason: string | null;
  readonly limitations: readonly string[];
  readonly nextReviewAt: string | null;
  readonly provenanceReference: string;
}

export type InstrumentAssignmentAuthorizationScope =
  | {
      readonly kind: "ANALYSIS_ASSIGNMENT_SCOPE";
      readonly evidenceArtifactId: string;
      readonly evidenceSectionIds: readonly string[];
      readonly productKind: string;
    }
  | {
      readonly kind: "COORDINATION_ASSIGNMENT_SCOPE";
      readonly workstreamId: string;
      readonly coordinationActionKinds: readonly string[];
      readonly productKind: string;
    }
  | {
      readonly kind: "LEGISLATIVE_POSITION_ASSIGNMENT_SCOPE";
      readonly initiativeId: string;
      readonly proposalVersion: number;
      readonly positionKind: "SUPPORT_AS_INTRODUCED" | "OPPOSE" | "NEGOTIATE_EXACT_TERMS";
      readonly negotiableTermIds: readonly string[];
      readonly evidenceReferenceIds: readonly string[];
    }
  | {
      readonly kind: "INTERGOVERNMENTAL_CONTACT_ASSIGNMENT_SCOPE";
      readonly governorActorIds: readonly string[];
      readonly purposeFamily: string;
      readonly talkingPoints: readonly string[];
      readonly prohibitedCommitmentKinds: readonly string[];
    }
  | {
      readonly kind: "PUBLIC_STATEMENT_ASSIGNMENT_SCOPE";
      readonly approvedClaims: readonly string[];
      readonly limitations: readonly string[];
      readonly sourceSectionReferences: readonly {
        readonly artifactId: string;
        readonly sectionId: string;
      }[];
      readonly prohibitedUnsupportedClaimFamilies: readonly string[];
      readonly releaseWindowEndsAt: string;
      readonly productKind: "BOUNDED_PUBLIC_STATEMENT";
    };

export interface OMBReviewWorkPeriod {
  readonly id: string;
  readonly teamId: string;
  readonly startsAt: string;
  readonly endsAt: string;
  readonly provenanceReference: string;
}

export interface OMBReviewBookingRecord {
  readonly id: string;
  readonly teamId: string;
  readonly periodIds: readonly string[];
  readonly assignmentId: string;
  readonly authorizedProductKind: string;
  readonly reservedAt: string;
  readonly consumedAt: string | null;
  readonly releasedAt: string | null;
  readonly status: "RESERVED" | "CONSUMED" | "RELEASED";
  readonly sourceAuthorizationId: string;
  readonly actingOfficeholderAssignmentId: string;
  readonly provenanceReference: string;
}

export interface OMBQueueCoordinationRequest {
  readonly id: string;
  readonly sourceKind: "PRESIDENTIAL_INSTRUMENT" | "STANDING_CHIEF_OF_STAFF_AUTHORITY";
  readonly initiatingOfficeId: string;
  readonly initiatingOfficeholderAssignmentId: string;
  readonly recipientOfficeId: string;
  readonly teamId: string;
  readonly requestedActions: readonly (
    | "REPRIORITIZE_OMB_REVIEW_QUEUE"
    | "SUPERSEDE_WITH_PERMITTED_NARROW_PRODUCT"
  )[];
  readonly referencedAssignmentIds: readonly string[];
  readonly requestedQueueOrder: readonly string[];
  readonly requestedNarrowProductKind: string | null;
  readonly sourceAuthorityId: string;
  readonly payloadHash: string;
  readonly createdAt: string;
  readonly dispatchedAt: string;
  readonly deliveredAt: string;
  readonly receivedAt: string;
  readonly disposition: "ACCEPTED" | "NARROWED" | "REFUSED";
  readonly provenanceReference: string;
}

export interface OMBQueueReprioritizationOccurrence {
  readonly id: string;
  readonly teamId: string;
  readonly actingOfficeId: string;
  readonly actingOfficeholderAssignmentId: string;
  readonly sourceCoordinationRequestId: string;
  readonly authorityReference: string;
  readonly priorQueueAssignmentIds: readonly string[];
  readonly resultingQueueAssignmentIds: readonly string[];
  readonly affectedBookingIds: readonly string[];
  readonly occurredAt: string;
  readonly provenanceReference: string;
}

export interface OMBAssignmentSupersessionOccurrence {
  readonly id: string;
  readonly teamId: string;
  readonly actingOfficeId: string;
  readonly actingOfficeholderAssignmentId: string;
  readonly sourceCoordinationRequestId: string;
  readonly priorAssignmentId: string;
  readonly replacementAssignmentId: string;
  readonly priorProductKind: string;
  readonly replacementProductKind: string;
  readonly sourceScopeReferenceIds: readonly string[];
  readonly occurredAt: string;
  readonly reasonClassification: "PERMITTED_LESS_CLAIMING_PRODUCT";
  readonly authorityReference: string;
  readonly provenanceReference: string;
}

export interface OMBReviewCapacityState {
  readonly teamId: string;
  readonly periods: readonly OMBReviewWorkPeriod[];
  readonly bookings: readonly OMBReviewBookingRecord[];
  readonly coordinationRequests: readonly OMBQueueCoordinationRequest[];
  readonly queueReprioritizations: readonly OMBQueueReprioritizationOccurrence[];
  readonly assignmentSupersessions: readonly OMBAssignmentSupersessionOccurrence[];
}

export interface InstrumentAssignmentAuthorizationBinding {
  readonly assignmentId: string;
  readonly dispositionId: string;
  readonly instrumentId: string;
  readonly recipientOfficeId: string;
  readonly authorizedDeadline: string;
  readonly scope: InstrumentAssignmentAuthorizationScope;
  readonly boundAt: string;
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
