import type {
  GovernmentStructureDescriptor,
  LegislativeRuntimeSeed,
} from "../configuration/types";
import type { LegislativeRuntimeState } from "./legislative-runtime";
import type {
  OMBReviewWorkPeriod,
  PresidentialInstrumentPreview,
} from "./presidential-operating-intervention-types";

export const PRESIDENTIAL_CONCURRENT_WORLD_SCHEMA_VERSION = 1 as const;

export type I5PopulationLinkageStatus = "OUTSIDE_MODELED_ORDINARY_POPULATION_SCOPE";

export interface I5HumanIdentityLinkage {
  readonly actorId: string;
  readonly displayName: string;
  readonly effectiveFrom: string;
  readonly effectiveUntil: string | null;
  readonly status: I5PopulationLinkageStatus;
  readonly populationWeight: 0;
  readonly permittedJoins: readonly (
    | "ACTOR_IDENTITY"
    | "PUBLIC_ROLE_OR_OFFICE"
    | "CONSTITUENCY_JURISDICTION"
    | "COMMUNICATION"
    | "INFORMATION_RECEIPT"
    | "ACTION_RECORD"
  )[];
  readonly prohibitedJoins: readonly (
    | "RESIDENCE"
    | "HOUSEHOLD"
    | "DEMOGRAPHIC"
    | "MATERIAL_EXPOSURE"
    | "PUBLIC_BELIEF"
    | "VOTER"
    | "ELIGIBILITY"
    | "PERSONAL_LIFECYCLE"
  )[];
  readonly roleOrOfficeIds: readonly string[];
  readonly constituencyJurisdictionIds: readonly string[];
  readonly provenanceReference: string;
}

export interface I5HumanIdentityLinkageRegistry {
  readonly id: "pop0.registry.i5-external-humans";
  readonly entries: readonly I5HumanIdentityLinkage[];
  readonly provenanceReference: string;
}

export interface DomainObservationAuthority {
  readonly id: string;
  readonly observingInstitutionId: string;
  readonly sourceOwnerId: string;
  readonly permittedRecordKinds: readonly string[];
  readonly permittedClaimFamilies: readonly string[];
  readonly permittedFieldPaths: readonly string[];
  readonly geographyOrEntityIds: readonly string[];
  readonly artifactKinds: readonly string[];
  readonly effectiveFrom: string;
  readonly effectiveUntil: string | null;
  readonly authorityReference: string;
  readonly provenanceReference: string;
}

export type RegionalEmploymentCellId =
  | "OHIO_MANUFACTURING"
  | "MICHIGAN_MANUFACTURING"
  | "PENNSYLVANIA_SUPPLIER_LOGISTICS"
  | "REST_OF_NATION";

export interface EmploymentCellConfiguration {
  readonly id: RegionalEmploymentCellId;
  readonly openingEmployed: number;
  readonly ordinaryHiresByBoundary: Readonly<Record<string, number>>;
  readonly ordinarySeparationsByBoundary: Readonly<Record<string, number>>;
  readonly provenanceReference: string;
}

export interface PlantSeparationTranche {
  readonly id: string;
  readonly occursAt: string;
  readonly headcount: number;
}

export interface EmployerClosurePlan {
  readonly id: string;
  readonly employerInstitutionId: string;
  readonly facilityId: string;
  readonly affectedCellId: "OHIO_MANUFACTURING";
  readonly decisionEffectiveAt: string;
  readonly totalHeadcount: number;
  readonly tranches: readonly PlantSeparationTranche[];
  readonly provenanceReference: string;
}

export interface EmploymentEvidenceReleaseOpportunity {
  readonly id: string;
  readonly artifactId: string;
  readonly domainEvidenceKind:
    | "EMPLOYER_CLOSURE_NOTICE"
    | "PRELIMINARY_REGIONAL_EMPLOYMENT_ESTIMATE"
    | "REVISED_REGIONAL_EMPLOYMENT_ESTIMATE"
    | "MODELED_HOUSEHOLD_INCOME_IMPACT"
    | "MODELED_HEALTHCARE_COVERAGE_RISK";
  readonly opensAt: string;
  readonly observationAuthorityId: string;
  readonly sectionIds: readonly string[];
  readonly accessClass: string;
  readonly analysisOnly: boolean;
  readonly revisionOfArtifactId: string | null;
  readonly supersedesArtifactId: string | null;
}

export interface RegionalEmploymentConfiguration {
  readonly ownerId: "pop0.owner.regional-employment";
  readonly cells: readonly EmploymentCellConfiguration[];
  readonly closurePlan: EmployerClosurePlan;
  readonly supplierExposure: {
    readonly sourceCellId: "OHIO_MANUFACTURING";
    readonly targetCellId: "PENNSYLVANIA_SUPPLIER_LOGISTICS";
    readonly triggerCumulativePlantSeparations: number;
    readonly numerator: number;
    readonly denominator: number;
    readonly occurrenceId: string;
  };
  readonly releaseOpportunities: readonly EmploymentEvidenceReleaseOpportunity[];
  readonly producerInstitutionId: string;
  readonly provenanceReference: string;
}

export interface EmploymentAccountingInterval {
  readonly id: string;
  readonly cellId: RegionalEmploymentCellId;
  readonly opensAt: string;
  readonly closesAt: string;
  readonly openingEmployed: number;
  readonly hires: number;
  readonly separations: number;
  readonly closingEmployed: number;
  readonly namedPlantOverlaySeparations: number;
  readonly sourceOccurrenceIds: readonly string[];
  readonly revisionIdentity: string;
  readonly provenanceReference: string;
}

export interface EmploymentMaterialOccurrence {
  readonly id: string;
  readonly kind:
    | "EMPLOYER_CLOSURE_DECISION"
    | "PLANT_SEPARATION"
    | "ORDINARY_GROSS_FLOW"
    | "SUPPLIER_CONTRACTION";
  readonly cellId: RegionalEmploymentCellId;
  readonly hires: number;
  readonly separations: number;
  readonly plantOverlaySeparations: number;
  readonly occurredAt: string;
  readonly causeReferenceIds: readonly string[];
  readonly provenanceReference: string;
}

export interface EmploymentEvidenceReleaseRecord {
  readonly id: string;
  readonly artifactId: string;
  readonly opportunityId: string;
  readonly sourceOccurrenceIds: readonly string[];
  readonly observationAuthorityId: string;
  readonly releasedAt: string;
  readonly provenanceReference: string;
}

export interface RegionalEmploymentState {
  readonly cells: readonly {
    readonly id: RegionalEmploymentCellId;
    readonly openingEmployed: number;
    readonly currentEmployed: number;
    readonly intervals: readonly EmploymentAccountingInterval[];
  }[];
  readonly materialOccurrences: readonly EmploymentMaterialOccurrence[];
  readonly evidenceReleases: readonly EmploymentEvidenceReleaseRecord[];
}

export type CongressionalTransitionKind =
  | "BEGIN_SPONSOR_SEARCH"
  | "SEEK_MEMBER_SPONSORSHIP"
  | "INTRODUCE_SPONSORED_PROPOSAL"
  | "ADVANCE_INTRODUCED_PROPOSAL_TO_CONSIDERATION_GATE";

export interface CongressionalFormationOpportunity {
  readonly id: string;
  readonly opensAt: string;
  readonly closesAt: string;
  readonly issueTemplateId: string;
  readonly draftTextTemplateHash: string;
  readonly requiredArtifactId: string;
  readonly requiredSectionIds: readonly string[];
  readonly provenanceReference: string;
}

export interface CongressionalProcedureOpportunity {
  readonly id: string;
  readonly opensAt: string;
  readonly closesAt: string;
  readonly permittedTransitionKinds: readonly CongressionalTransitionKind[];
  readonly provenanceReference: string;
}

export interface CongressionalExternalReceipt {
  readonly id: string;
  readonly recipientActorId: string;
  readonly artifactId: string;
  readonly sectionIds: readonly string[];
  readonly deliveredAt: string;
  readonly receivedAt: string;
  readonly authorityReference: string;
  readonly provenanceReference: string;
}

export interface CongressionalAttemptEligibilityAssessment {
  readonly id: string;
  readonly actorId: string;
  readonly transitionKind: "FORMATION" | CongressionalTransitionKind;
  readonly receiptId: string;
  readonly result: "ELIGIBLE_TO_ATTEMPT" | "NOT_ELIGIBLE_TO_ATTEMPT";
  readonly objectiveScore: number;
  readonly requiredThreshold: number;
  readonly assessedAt: string;
  readonly provenanceReference: string;
}

export interface CongressionalFormationDecision {
  readonly id: string;
  readonly actorId: string;
  readonly opportunityId: string;
  readonly assessmentId: string;
  readonly decision: "INITIATE_DRAFT" | "DEFER" | "DECLINE";
  readonly decidedAt: string;
  readonly legislativeRuntimeReference: string | null;
  readonly provenanceReference: string;
}

export interface LegislativeTransitionAttemptAuthorization {
  readonly id: string;
  readonly opportunityId: string;
  readonly eligibilityAssessmentId: string;
  readonly receiptId: string;
  readonly actorId: string;
  readonly assignmentId: string;
  readonly transitionKind: CongressionalTransitionKind;
  readonly authorizedLowerPreStateHash: string;
  readonly authorizedAt: string;
  readonly authorityReference: string;
  readonly provenanceReference: string;
}

export interface CongressionalProcedureTransitionAttemptOccurrence {
  readonly id: string;
  readonly authorizationId: string;
  readonly transitionKind: CongressionalTransitionKind;
  readonly calledAt: string;
  readonly lowerPreStateHash: string;
  readonly lowerPostStateHash: string;
  readonly lowerOccurrenceId: null;
  readonly authorityReference: string;
  readonly provenanceReference: string;
}

export interface CongressionalInitiativeConfiguration {
  readonly ownerId: "pop0.owner.congressional-initiative";
  readonly initiativeId: "pop0.proposal.regional-employment-stabilization";
  readonly legislativeRuntimeReference: "pop0.legislative-runtime.regional-employment-stabilization";
  readonly structure: GovernmentStructureDescriptor;
  readonly seed: LegislativeRuntimeSeed;
  readonly formationOpportunity: CongressionalFormationOpportunity;
  readonly procedureOpportunity: CongressionalProcedureOpportunity;
  readonly formationActorId: string;
  readonly sponsorActorId: string;
  readonly refusingSponsorActorId: string;
  readonly formationObjectiveScore: number;
  readonly formationThreshold: number;
  readonly transitionAuthorityKinds: readonly CongressionalTransitionKind[];
  readonly evidenceDeliveryAt: string;
  readonly administrationEvidenceDelivery: {
    readonly id: string;
    readonly artifactId: string;
    readonly recipientOfficeId: string;
    readonly deliveredAt: string;
    readonly sectionIds: readonly ["initiative", "window", "limitations"];
    readonly provenanceReference: string;
  };
  readonly provenanceReference: string;
}

export interface CongressionalInitiativeState {
  readonly formationOpportunity: CongressionalFormationOpportunity;
  readonly procedureOpportunity: CongressionalProcedureOpportunity;
  readonly externalReceipts: readonly CongressionalExternalReceipt[];
  readonly eligibilityAssessments: readonly CongressionalAttemptEligibilityAssessment[];
  readonly formationDecisions: readonly CongressionalFormationDecision[];
  readonly legislativeRuntime: LegislativeRuntimeState | null;
  readonly windowLifecycleOccurrences: readonly {
    readonly id: string;
    readonly kind: "OPENED" | "EXPIRED";
    readonly occurredAt: string;
    readonly provenanceReference: string;
  }[];
  readonly attemptAuthorizations: readonly LegislativeTransitionAttemptAuthorization[];
  readonly transitionAttempts: readonly CongressionalProcedureTransitionAttemptOccurrence[];
}

export type ExternalActorKind = "GOVERNOR" | "LABOR_ORGANIZATION" | "INDUSTRY_ORGANIZATION";
export type ExternalActorActionKind =
  | "ISSUE_PUBLIC_COMMUNICATION"
  | "CONTACT_ADMINISTRATION"
  | "CONTACT_CONGRESS"
  | "CONVENE_BOUNDED_REVIEW"
  | "COORDINATE_MEMBERS"
  | "DEFER"
  | "NO_ACTION";

export interface ExternalActorConfiguration {
  readonly id: string;
  readonly kind: ExternalActorKind;
  readonly humanActorId: string | null;
  readonly label: string;
  readonly capabilityActionKinds: readonly ExternalActorActionKind[];
  readonly preferredActionKind: ExternalActorActionKind;
  readonly objectiveScore: number;
  readonly resourceScore: number;
  readonly relationshipScore: number;
  readonly actionThreshold: number;
  readonly opportunityAt: string;
  readonly closesAt: string;
  readonly evidenceAccess: "SUBSTANTIVE" | "METADATA_ONLY" | "NONE";
  readonly provenanceReference: string;
}

export interface ExternalActorReceipt {
  readonly id: string;
  readonly recipientActorOrInstitutionId: string;
  readonly artifactId: string;
  readonly sectionIds: readonly string[];
  readonly deliveredAt: string;
  readonly receivedAt: string;
  readonly provenanceReference: string;
}

export interface ExternalActorAssessment {
  readonly id: string;
  readonly actorOrInstitutionId: string;
  readonly receiptId: string;
  readonly support: "SUBSTANTIVE" | "METADATA_ONLY";
  readonly objectiveScore: number;
  readonly resourceScore: number;
  readonly relationshipScore: number;
  readonly assessedAt: string;
  readonly provenanceReference: string;
}

export interface ExternalActorActionOccurrence {
  readonly id: string;
  readonly actorOrInstitutionId: string;
  readonly opportunityAt: string;
  readonly kind: ExternalActorActionKind;
  readonly receiptId: string | null;
  readonly assessmentId: string | null;
  readonly sourceReferenceIds: readonly string[];
  readonly occurredAt: string;
  readonly provenanceReference: string;
}

export interface ExternalActorOwnerState {
  readonly actorIds: readonly string[];
  readonly receipts: readonly ExternalActorReceipt[];
  readonly assessments: readonly ExternalActorAssessment[];
  readonly actions: readonly ExternalActorActionOccurrence[];
}

export interface MediaOutletConfiguration {
  readonly id: string;
  readonly label: string;
  readonly access: "SUBSTANTIVE" | "METADATA_ONLY" | "NONE";
  readonly editorialPriority: number;
  readonly investigativeResources: number;
  readonly publicationThreshold: number;
  readonly opportunityAt: string;
  readonly closesAt: string;
  readonly distributionRecipientIds: readonly string[];
  readonly provenanceReference: string;
}

export interface MediaReceipt {
  readonly id: string;
  readonly outletId: string;
  readonly artifactId: string;
  readonly sectionIds: readonly string[];
  readonly deliveredAt: string;
  readonly receivedAt: string;
  readonly provenanceReference: string;
}

export interface MediaEditorialDecision {
  readonly id: string;
  readonly outletId: string;
  readonly receiptId: string | null;
  readonly decision: "INVESTIGATE" | "PUBLISH" | "PUBLISH_NARROWER_CLAIMS" | "FOLLOW_UP" | "DEFER" | "DECLINE";
  readonly editorialPriority: number;
  readonly investigativeResources: number;
  readonly decidedAt: string;
  readonly provenanceReference: string;
}

export interface MediaStoryArtifact {
  readonly id: string;
  readonly outletId: string;
  readonly sourceReceiptId: string;
  readonly claimSectionIds: readonly string[];
  readonly limitations: readonly string[];
  readonly publishedAt: string;
  readonly revisionOfStoryId: string | null;
  readonly supersedesStoryId: string | null;
  readonly provenanceReference: string;
}

export interface MediaDistributionAttempt {
  readonly id: string;
  readonly storyId: string;
  readonly recipientId: string;
  readonly attemptedAt: string;
  readonly outcome: "DELIVERED_TO_BOUNDARY" | "NOT_DELIVERED";
  readonly deliveredAt: string | null;
  readonly provenanceReference: string;
}

export interface MediaExposureRecord {
  readonly id: string;
  readonly storyId: string;
  readonly recipientId: string;
  readonly distributionAttemptId: string;
  readonly exposedAt: string;
  readonly provenanceReference: string;
}

export interface BoundedMediaState {
  readonly outletIds: readonly string[];
  readonly receipts: readonly MediaReceipt[];
  readonly editorialDecisions: readonly MediaEditorialDecision[];
  readonly stories: readonly MediaStoryArtifact[];
  readonly distributionAttempts: readonly MediaDistributionAttempt[];
  readonly exposures: readonly MediaExposureRecord[];
}

export interface MaternityServiceAccessConfiguration {
  readonly ownerId: "pop0.owner.maternity-service-access";
  readonly facilityId: string;
  readonly serviceAreaId: string;
  readonly openingCapacity: number;
  readonly withdrawnCapacity: number;
  readonly catchmentCount: number;
  readonly openingTravelBurdenMinutes: number;
  readonly withdrawalOccurredAt: string;
  readonly burdenReconciliationAt: string;
  readonly reconciledTravelBurdenMinutes: number;
  readonly provenanceReference: string;
}

export interface MaternityServiceAccessState {
  readonly facilityId: string;
  readonly serviceAreaId: string;
  readonly effectiveCapacity: number;
  readonly catchmentCount: number;
  readonly currentTravelBurdenMinutes: number;
  readonly materialHistory: readonly {
    readonly id: string;
    readonly kind: "SERVICE_WITHDRAWAL" | "ACCESS_BURDEN_RECONCILED";
    readonly occurredAt: string;
    readonly priorCapacity: number;
    readonly resultingCapacity: number;
    readonly priorTravelBurdenMinutes: number;
    readonly resultingTravelBurdenMinutes: number;
    readonly provenanceReference: string;
  }[];
  readonly evidenceArtifactIds: readonly string[];
}

export interface PresidentialInquiryOpportunity {
  readonly id: string;
  readonly subjectFamily: "RURAL_MATERNITY_SERVICE_ACCESS";
  readonly sourceKind: "PRESENTED_MONITORING_GAP" | "GENERAL_SERVICE_ACCESS_QUESTION";
  readonly sourcePresidentialPresentationId: string | null;
  readonly shownMetadataSectionIds: readonly string[];
  readonly generalQuestion: string;
  readonly typedScope: "NATIONWIDE_RURAL_MATERNITY_SERVICE_MONITORING";
  readonly allowedRecipientOfficeId: string;
  readonly allowedInstrumentKind: "REQUEST_OFFICE_ANALYSIS";
  readonly allowedProductKinds: readonly (
    | "RURAL_MATERNITY_ACCESS_SCOPING"
    | "MATERNITY_MONITORING_GAP_MEMO"
  )[];
  readonly effectiveFrom: string;
  readonly deadline: string;
  readonly authorityReference: string;
  readonly provenanceReference: string;
}

export interface PresidentialInquiryPreviewPresentation {
  readonly id: string;
  readonly opportunityId: string;
  readonly recipientBindingId: string;
  readonly recipientActorId: string;
  readonly constitutionalOfficeId: string;
  readonly shownQuestion: string;
  readonly shownScope: "NATIONWIDE_RURAL_MATERNITY_SERVICE_MONITORING";
  readonly preview: PresidentialInstrumentPreview;
  readonly presentedAt: string;
  readonly provenanceReference: string;
}

export interface PresidentialInquiryOwnerState {
  readonly opportunities: readonly PresidentialInquiryOpportunity[];
  readonly previewPresentations: readonly PresidentialInquiryPreviewPresentation[];
  readonly initiatedRequestDecisionIds: readonly string[];
  readonly lifecycleOccurrences: readonly {
    readonly id: string;
    readonly opportunityId: string;
    readonly kind: "CONSUMED" | "EXPIRED";
    readonly causeRecordId: string;
    readonly occurredAt: string;
    readonly provenanceReference: string;
  }[];
}

export interface StandingOMBQueueCoordinationAuthority {
  readonly id: string;
  readonly initiatingOfficeId: string;
  readonly recipientOfficeId: string;
  readonly teamId: string;
  readonly permittedWorkstreamIds: readonly string[];
  readonly permittedActions: readonly (
    | "REPRIORITIZE_OMB_REVIEW_QUEUE"
    | "SUPERSEDE_WITH_PERMITTED_NARROW_PRODUCT"
  )[];
  readonly maximumReferencedAssignments: 2;
  readonly effectiveFrom: string;
  readonly effectiveUntil: string | null;
  readonly authorityReference: string;
  readonly provenanceReference: string;
}

export interface OMBReviewCapacityConfiguration {
  readonly officeId: string;
  readonly teamId: string;
  readonly periods: readonly OMBReviewWorkPeriod[];
  readonly productPeriodRequirements: readonly {
    readonly productKind: string;
    readonly periodsConsumed: 1 | 4;
    readonly classification: "FULL" | "LESS_CLAIMING";
    readonly subjectFamily: "HOUSING" | "EMPLOYMENT_CONGRESS";
  }[];
  readonly openingAssignments: readonly {
    readonly id: string;
    readonly requesterId: string;
    readonly objective: string;
    readonly sourceReferenceIds: readonly string[];
    readonly authorityReference: string;
    readonly deadline: string;
    readonly expectedProductKind: string;
  }[];
  readonly preferredQueueOrder: readonly string[];
  readonly bookingOpensAt: string;
  readonly standingCoordinationAuthority: StandingOMBQueueCoordinationAuthority;
  readonly provenanceReference: string;
}

export interface ConcurrentWorldConfiguration {
  readonly schemaVersion: typeof PRESIDENTIAL_CONCURRENT_WORLD_SCHEMA_VERSION;
  readonly ownerIds: {
    readonly regionalEmployment: "pop0.owner.regional-employment";
    readonly congressionalInitiative: "pop0.owner.congressional-initiative";
    readonly externalActors: "pop0.owner.external-actors";
    readonly boundedMedia: "pop0.owner.bounded-media";
    readonly maternityServiceAccess: "pop0.owner.maternity-service-access";
    readonly presidentialInquiries: "pop0.owner.presidential-inquiries";
  };
  readonly humanRegistry: I5HumanIdentityLinkageRegistry;
  readonly domainObservationAuthorities: readonly DomainObservationAuthority[];
  readonly employment: RegionalEmploymentConfiguration;
  readonly congress: CongressionalInitiativeConfiguration;
  readonly externalActors: readonly ExternalActorConfiguration[];
  readonly mediaOutlets: readonly MediaOutletConfiguration[];
  readonly maternityServiceAccess: MaternityServiceAccessConfiguration;
  readonly presidentialInquiryOpportunities: readonly PresidentialInquiryOpportunity[];
  readonly ombReviewCapacity: OMBReviewCapacityConfiguration;
  readonly provenanceReference: string;
}

export interface PresidentialConcurrentWorldOwnerStates {
  readonly regionalEmployment: {
    readonly ownerId: string;
    readonly state: RegionalEmploymentState;
  };
  readonly congressionalInitiative: {
    readonly ownerId: string;
    readonly state: CongressionalInitiativeState;
  };
  readonly externalActors: {
    readonly ownerId: string;
    readonly state: ExternalActorOwnerState;
  };
  readonly boundedMedia: {
    readonly ownerId: string;
    readonly state: BoundedMediaState;
  };
  readonly maternityServiceAccess: {
    readonly ownerId: string;
    readonly state: MaternityServiceAccessState;
  };
  readonly presidentialInquiries: {
    readonly ownerId: string;
    readonly state: PresidentialInquiryOwnerState;
  };
}
