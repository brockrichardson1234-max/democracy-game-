import { sha256Hex } from "../configuration/sha256";
import { addElapsedCalendarDays } from "../configuration/instant";
import type { IntegratedImplementationConfiguration, OperativeLegalTermValue } from "../configuration/types";
import type { EnactedLegislativeSource } from "./legislative-runtime";

export interface ExactMoney {
  readonly minorUnits: number;
  readonly currency: string;
  readonly scale: number;
  readonly purpose: string;
  readonly ownerId: string;
  readonly fiscalCohort: string;
}

export type RecordClassification = "DIRECT_REAL_HISTORICAL_SEED" | "SIMULATION_GENERATED";
export type BudgetAuthorityStatus = "AUTHORITY_RECOGNIZED" | "APPORTIONMENT_PENDING" | "APPORTIONED";

export interface ImplementationRuleProfile {
  readonly recipientFlexibilityClass: string;
  readonly maximumRecipientOptions: number;
  readonly complianceBurdenClass: string;
  readonly requiredRecordTypes: readonly string[];
  readonly reviewSteps: number;
  readonly geographicPriorityRule: string;
  readonly administrativeCapacityClass: string;
  readonly administrativeCapacityUnits: number;
  readonly processingLatencyDays: number;
}

export interface BudgetAuthorityRecord {
  readonly id: string;
  readonly sourceLegalId: string;
  readonly amount: ExactMoney;
  readonly enactedAt: string;
  readonly effectiveFrom: string;
  readonly availableUntil: string | null;
  readonly status: BudgetAuthorityStatus;
  readonly detailCoverage: string;
  readonly classification: RecordClassification;
  readonly sourceId?: string;
  readonly operativeRuleProfile?: ImplementationRuleProfile;
}

export interface FiscalControlRecord {
  readonly id: string;
  readonly sourceBudgetAuthorityId: string;
  readonly controllerInstitutionId: string;
  readonly programId: string;
  readonly approvalAt: string;
  readonly amount: ExactMoney;
  readonly scope: string;
  readonly ruleProfile: ImplementationRuleProfile | null;
  readonly classification: RecordClassification;
  readonly sourceIntentionId?: string;
  readonly tas?: string;
  readonly authorityLegalId?: string;
  readonly line1100?: { readonly description: string; readonly amount: ExactMoney };
  readonly line6011?: { readonly description: string; readonly amount: ExactMoney };
  readonly sourceId?: string;
}

export interface ProgramAllocationRecord {
  readonly id: string;
  readonly programId: string;
  readonly recipientId: string;
  readonly sourceAwardEventId: string;
  readonly amount: ExactMoney;
  readonly classification: RecordClassification;
  readonly sourceFiscalControlId?: string;
  readonly sourceIntentionId?: string;
}

export interface AwardRecord {
  readonly id: string;
  readonly fain: string;
  readonly sourceAwardEventId: string;
  readonly programId: string;
  readonly recipientId: string;
  readonly recipientName: string;
  readonly assistanceListing: string;
  readonly signedAt: string;
  readonly amount: ExactMoney;
  readonly classification: RecordClassification;
  readonly sourceFiscalControlId?: string;
  readonly sourceIntentionId?: string;
  readonly relationshipId?: string;
  readonly formulaScopeMemberId?: string | null;
  readonly agreementRef?: string;
}

export interface ObligationRecord {
  readonly id: string;
  readonly awardId: string;
  readonly amount: ExactMoney;
  readonly obligatedAt: string;
  readonly classification: RecordClassification;
  readonly sourceIntentionId?: string;
}

export interface PaymentRecord {
  readonly id: string;
  readonly awardId: string;
  readonly obligationId: string;
  readonly amount: ExactMoney;
  readonly observedAsOf: string;
  readonly projectRef: string | null;
  readonly reconciliation: string;
  readonly classification: RecordClassification;
  readonly drawRequestId?: string;
  readonly sourceIntentionId?: string;
}

export interface ProgramIdentityRecord {
  readonly id: string;
  readonly administeringInstitutionId: string;
  readonly legalAuthorityRefs: readonly string[];
  readonly assistanceListing: string;
}

export interface HistoricalLegalSourceRecord {
  readonly id: string;
  readonly kind: string;
  readonly effectiveAt: string;
  readonly status: string;
  readonly provisionRefs: readonly string[];
  readonly classification: "DIRECT_REAL_HISTORICAL_SEED";
  readonly sourceId: string;
}

export interface ProgramLegalBaseline {
  readonly id: string;
  readonly controllingStatuteId: string;
  readonly enactedAt: string;
  readonly unaffectedRegulationId: string;
  readonly operativeStatusNoticeId: string;
  readonly delayedAmendments: readonly { readonly provision: string; readonly status: string }[];
  readonly olderGuidanceStatus: string;
  readonly unresolvedImplementationStatus: string;
}

export type RelationshipStatus =
  | "PENDING"
  | "ACTIVE"
  | "EXCLUDED_FOR_NEW_FORMULA_RELATION"
  | "SUSPENDED"
  | "ENDED_WITH_SURVIVING_DUTIES";

export interface RelationshipMemberRecord {
  readonly id: string;
  readonly name: string;
  readonly participation: string;
}

export interface IntergovernmentalRelationshipRecord {
  readonly id: string;
  readonly programId: string;
  readonly federalInstitutionId: string;
  readonly recipientId: string;
  readonly relationshipKind: string;
  readonly qualificationFrom: string;
  readonly qualificationUntil: string | null;
  readonly planRefs: readonly string[];
  readonly grantAgreementRefs: readonly string[];
  readonly members: readonly RelationshipMemberRecord[];
  readonly conditions: readonly string[];
  readonly status: RelationshipStatus;
  readonly survivingDuties: readonly string[];
  readonly classification: RecordClassification;
}

export interface RelationshipTransitionRecord {
  readonly id: string;
  readonly relationshipId: string;
  readonly transitionKind: "MEMBER_PARTICIPATION" | "RELATIONSHIP_STATUS";
  readonly memberId: string | null;
  readonly election: "INCLUDE" | "EXCLUDE" | null;
  readonly newParticipation: "INCLUDED" | "EXCLUDED_FOR_NEW_FORMULA_RELATION" | null;
  readonly newStatus: RelationshipStatus | null;
  readonly formulaScopeChanged: true;
  readonly statewideRefusal: false;
  readonly survivingDuties: readonly string[];
  readonly occurredAt: string;
  readonly classification: "SIMULATION_GENERATED";
  readonly sourceIntentionId: string;
}

export interface RelationshipQualificationDeterminationRecord {
  readonly id: string;
  readonly relationshipId: string;
  readonly claimantId: string;
  readonly institutionId: string;
  readonly outcome: "REQUALIFICATION_REJECTED";
  readonly formulaDisposition: "DIRECTED_OUT_OF_RELATIONSHIP_PENDING_EXECUTION";
  readonly finalAgencyAction: true;
  readonly prospectiveOnly: true;
  readonly moneyDamagesGranted: false;
  readonly writtenReasons: readonly string[];
  readonly procedureRecordIds: readonly string[];
  readonly issuedAt: string;
  readonly classification: "SIMULATION_GENERATED";
  readonly sourceIntentionId: string;
}

export interface AdministrativeLegalConstraintRecord {
  readonly id: string;
  readonly sourceOrderId: string;
  readonly targetInstitutionId: string;
  readonly programId: string;
  readonly relationshipId: string;
  readonly determinationId: string;
  readonly requiredAct: string;
  readonly prohibitedAct: string;
  readonly effectiveAt: string;
  readonly enforceability: "OPERATIVE" | "STAYED" | "SUPERSEDED";
  readonly enforceabilityCauseId: string;
  readonly classification: "SIMULATION_GENERATED";
}

export interface RelationshipFormulaDispositionResolutionRecord {
  readonly id: string;
  readonly determinationId: string;
  readonly legalConstraintId: string | null;
  readonly complianceStateId: string | null;
  readonly outcome: "WITHHELD_BY_COMPLIANCE" | "EXECUTED_WHILE_CONTESTED" | "EXECUTED_WITHOUT_CONSTRAINT";
  readonly resolvedAt: string;
  readonly classification: "SIMULATION_GENERATED";
}

export interface EffectiveIntergovernmentalRelationship {
  readonly id: string;
  readonly recipientId: string;
  readonly status: RelationshipStatus;
  readonly members: readonly RelationshipMemberRecord[];
  readonly newFundingEligible: boolean;
  readonly survivingDuties: readonly string[];
  readonly asOf: string;
}

export interface RecipientExpenditureRecord {
  readonly id: string;
  readonly recipientId: string;
  readonly relationshipId: string;
  readonly date: string;
  readonly projectRef: string;
  readonly payee: string;
  readonly fund: string;
  readonly department: string;
  readonly organizationActivity: string;
  readonly account: string;
  readonly description: string;
  readonly amount: ExactMoney;
  readonly federalPaymentId: string | null;
  readonly reconciliation: string;
  readonly physicalHousingEffect: null;
  readonly classification: RecordClassification;
}

export interface HistoricalWaiverRecord {
  readonly id: string;
  readonly projectRef: string;
  readonly relationshipId: string;
  readonly effectiveFrom: string;
  readonly status: "FINAL_GRANTED";
  readonly unitReference: number;
  readonly componentScope: string;
  readonly assertedBasis: string;
  readonly commentFrom: string;
  readonly commentUntil: string;
  readonly operativeScope: string;
  readonly supportedFindings: readonly string[];
  readonly mutableByPlayer: false;
  readonly physicalHousingEffect: null;
  readonly classification: "DIRECT_REAL_HISTORICAL_SEED";
  readonly sourceId: string;
}

export interface CoverageRecord {
  readonly geographyId: string;
  readonly stateFips: string;
  readonly detail: "DETAIL_AVAILABLE" | "NOT_INSTANTIATED_V0";
}

export interface ProgramInitializationSeed {
  readonly schemaVersion: number;
  readonly classification: "DIRECT_REAL_HISTORICAL_SEED";
  readonly detailCoverage: string;
  readonly nationalBalance: string;
  readonly legalSources: readonly HistoricalLegalSourceRecord[];
  readonly program: ProgramIdentityRecord;
  readonly legalBaseline: ProgramLegalBaseline;
  readonly budgetAuthorities: readonly BudgetAuthorityRecord[];
  readonly fiscalControls: readonly (Omit<FiscalControlRecord, "amount" | "scope" | "ruleProfile"> & {
    readonly line1100: { readonly description: string; readonly amount: ExactMoney };
    readonly line6011: { readonly description: string; readonly amount: ExactMoney };
  })[];
  readonly programAllocations: readonly ProgramAllocationRecord[];
  readonly awards: readonly AwardRecord[];
  readonly obligations: readonly ObligationRecord[];
  readonly payments: readonly PaymentRecord[];
  readonly relationships: readonly IntergovernmentalRelationshipRecord[];
  readonly recipientExpenditures: readonly RecipientExpenditureRecord[];
  readonly waivers: readonly HistoricalWaiverRecord[];
  readonly coverage: readonly CoverageRecord[];
}

export interface WaiverRequestRecord {
  readonly id: string;
  readonly programId: string;
  readonly relationshipId: string;
  readonly projectRef: string;
  readonly inputComponent: string;
  readonly domesticPreferenceRequirement: string;
  readonly assertedBasis: string;
  readonly supportingRecords: readonly string[];
  readonly commentFrom: string | null;
  readonly commentUntil: string | null;
  readonly responsibleInstitutionId: string;
  readonly receivedAt: string;
  readonly reviewState: "PENDING" | "RETURNED_FOR_SUPPLEMENTAL_RECORD" | "REVIEW_READY" | "DETERMINED";
  readonly supplementalRecordRequirements: readonly string[];
  readonly reviewNotBefore: string | null;
  readonly classification: "SIMULATION_GENERATED";
}

export type WaiverIntention = "GRANT_SCOPED_WAIVER" | "DENY" | "RETURN_FOR_SUPPLEMENTAL_RECORD";

export interface AdministrativeDeterminationRecord {
  readonly id: string;
  readonly ownerSequence: number;
  readonly requestId: string;
  readonly institutionId: string;
  readonly intention: WaiverIntention;
  readonly outcome: "SCOPED_WAIVER_GRANTED" | "DENIED" | "RETURNED_FOR_RECORD";
  readonly scope: string;
  readonly scopeKey: string;
  readonly releaseOfInputId: string | null;
  readonly causalPredecessorInputIds: readonly string[];
  readonly decidedAt: string;
  readonly classification: "SIMULATION_GENERATED";
  readonly physicalHousingEffect: null;
}

const administrativeDeterminationIdentity = (
  determination: Omit<AdministrativeDeterminationRecord, "id">,
): string => JSON.stringify({
  ownerSequence: determination.ownerSequence,
  requestId: determination.requestId,
  institutionId: determination.institutionId,
  intention: determination.intention,
  outcome: determination.outcome,
  scope: determination.scope,
  scopeKey: determination.scopeKey,
  releaseOfInputId: determination.releaseOfInputId,
  causalPredecessorInputIds: determination.causalPredecessorInputIds,
  decidedAt: determination.decidedAt,
  classification: determination.classification,
  physicalHousingEffect: determination.physicalHousingEffect,
});

export interface DynamicAdministrativeBoundary {
  readonly id: string;
  readonly ownerId: string;
  readonly at: string;
  readonly phase: number;
  readonly order: number;
  readonly stableKey: string;
  readonly kind: "SUPPLEMENTAL_RECORD_REVIEW_READY";
  readonly processed: boolean;
}

export type MaterialInputKind =
  | "VALID_FISCAL_RESOURCE_INPUT"
  | "INPUT_AVAILABILITY"
  | "COMPLIANCE_HOLD"
  | "WAIVER_TERMS"
  | "RECIPIENT_READINESS"
  | "ENVIRONMENTAL_CLEARANCE_REFERENCE"
  | "COMMITMENT_REFERENCE";

export interface MaterialInputRecord {
  readonly id: string;
  readonly kind: MaterialInputKind;
  readonly sourceOwnerId: string;
  readonly sourceRecordId: string;
  readonly projectRef: string;
  readonly scopeKey: string | null;
  readonly releaseOfInputId: string | null;
  readonly causalPredecessorInputIds: readonly string[];
  readonly validatedAt: string;
  readonly classification: "SIMULATION_GENERATED";
  readonly physicalHousingMutation: false;
}

export interface RecipientCommitmentRecord {
  readonly id: string;
  readonly recipientId: string;
  readonly relationshipId: string;
  readonly projectRef: string;
  readonly sourceFiscalControlId: string;
  readonly sourceObligationId: string;
  readonly amount: ExactMoney;
  readonly planRef: string;
  readonly projectSelectionRef: string;
  readonly writtenAgreementRef: string;
  readonly environmentalClearanceRef: string;
  readonly selectedRecipientOption: number;
  readonly complianceRecordRefs: readonly string[];
  readonly geographicPriorityAcknowledgement: string;
  readonly committedAt: string;
  readonly classification: "SIMULATION_GENERATED";
  readonly sourceIntentionId: string;
}

export interface RecipientActivityRecord {
  readonly id: string;
  readonly commitmentId: string;
  readonly setupAt: string;
  readonly status: "SET_UP";
  readonly classification: "SIMULATION_GENERATED";
  readonly sourceIntentionId: string;
}

export interface RecipientDrawRequestRecord {
  readonly id: string;
  readonly activityId: string;
  readonly amount: ExactMoney;
  readonly requestedAt: string;
  readonly status: "ELIGIBLE_PENDING_PAYMENT" | "PAID";
  readonly classification: "SIMULATION_GENERATED";
  readonly sourceIntentionId: string;
}

export type ImplementationOwnerIntention =
  | {
      readonly kind: "REQUEST_FISCAL_CONTROL";
      readonly payload: { readonly budgetAuthorityId: string };
    }
  | {
      readonly kind: "REQUEST_BOUNDED_AWARD";
      readonly payload: { readonly request: BoundedRecipientAwardRequest };
    }
  | {
      readonly kind: "REQUEST_RECIPIENT_COMMITMENT";
      readonly payload: { readonly request: RecipientCommitmentRequest };
    }
  | {
      readonly kind: "REQUEST_RECIPIENT_ACTIVITY_SETUP";
      readonly payload: { readonly commitmentId: string };
    }
  | {
      readonly kind: "REQUEST_RECIPIENT_DRAW";
      readonly payload: { readonly activityId: string; readonly amountMinorUnits: number };
    }
  | {
      readonly kind: "REQUEST_FEDERAL_PAYMENT";
      readonly payload: { readonly drawRequestId: string };
    }
  | {
      readonly kind: "LOCAL_MEMBER_PARTICIPATION_DECISION";
      readonly payload: {
        readonly relationshipId: string;
        readonly memberId: string;
        readonly election: "INCLUDE" | "EXCLUDE";
        readonly causeKey: string;
      };
    }
  | {
      readonly kind: "LOCAL_RELATIONSHIP_STATUS_DECISION";
      readonly payload: {
        readonly relationshipId: string;
        readonly status: RelationshipStatus;
        readonly causeKey: string;
      };
    }
  | {
      readonly kind: "ISSUE_RELATIONSHIP_QUALIFICATION_DETERMINATION";
      readonly payload: {
        readonly id: string;
        readonly relationshipId: string;
        readonly claimantId: string;
        readonly writtenReasons: readonly string[];
        readonly procedureRecordIds: readonly string[];
      };
    };

export type ImplementationOwnerIntentionRecord = ImplementationOwnerIntention & {
  readonly id: string;
  readonly originatingAdministrationId: string;
  readonly originatingActorId: string;
  readonly targetOwnerId: string;
  readonly matterId: string;
  readonly submittedAt: string;
  readonly status: "PENDING" | "RESOLVED" | "REFUSED";
  readonly resolvedAt: string | null;
  readonly resultRecordIds: readonly string[];
  readonly resolutionReason: string | null;
  readonly semanticVersion: string;
  readonly classification: "SIMULATION_GENERATED";
};

export interface ProgramImplementationState {
  readonly schemaVersion: number;
  readonly sourceArtifactId: string;
  readonly detailCoverage: string;
  readonly nationalBalance: string;
  readonly legalOrder: {
    readonly historicalLegalSources: readonly HistoricalLegalSourceRecord[];
    readonly generatedLegalSourceOwner: "LEGISLATIVE_RUNTIME_ENACTED_LEGAL_SOURCES";
  };
  readonly publicFinance: {
    readonly historicalBudgetAuthorities: readonly BudgetAuthorityRecord[];
    readonly generatedBudgetAuthorities: readonly BudgetAuthorityRecord[];
  };
  readonly ownerResolution: {
    readonly intentions: readonly ImplementationOwnerIntentionRecord[];
  };
  readonly fiscalExecution: {
    readonly historicalControls: readonly FiscalControlRecord[];
    readonly generatedControls: readonly FiscalControlRecord[];
    readonly historicalProgramAllocations: readonly ProgramAllocationRecord[];
    readonly generatedProgramAllocations: readonly ProgramAllocationRecord[];
    readonly historicalAwards: readonly AwardRecord[];
    readonly generatedAwards: readonly AwardRecord[];
    readonly historicalObligations: readonly ObligationRecord[];
    readonly generatedObligations: readonly ObligationRecord[];
    readonly historicalPayments: readonly PaymentRecord[];
    readonly generatedPayments: readonly PaymentRecord[];
  };
  readonly administrativeProgram: {
    readonly program: ProgramIdentityRecord;
    readonly legalBaseline: ProgramLegalBaseline;
    readonly historicalWaivers: readonly HistoricalWaiverRecord[];
    readonly waiverRequests: readonly WaiverRequestRecord[];
    readonly determinations: readonly AdministrativeDeterminationRecord[];
    readonly relationshipQualificationDeterminations: readonly RelationshipQualificationDeterminationRecord[];
    readonly legalConstraints: readonly AdministrativeLegalConstraintRecord[];
    readonly formulaDispositionResolutions: readonly RelationshipFormulaDispositionResolutionRecord[];
    readonly dynamicBoundaries: readonly DynamicAdministrativeBoundary[];
    readonly administrativeCapacityCommitted: number;
  };
  readonly intergovernmental: {
    readonly historicalRelationships: readonly IntergovernmentalRelationshipRecord[];
    readonly transitions: readonly RelationshipTransitionRecord[];
  };
  readonly recipientAdministration: {
    readonly historicalExpenditures: readonly RecipientExpenditureRecord[];
    readonly commitments: readonly RecipientCommitmentRecord[];
    readonly activities: readonly RecipientActivityRecord[];
    readonly drawRequests: readonly RecipientDrawRequestRecord[];
  };
  readonly materialInputs: readonly MaterialInputRecord[];
  readonly coverage: readonly CoverageRecord[];
}

const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const assertExactMoney = (value: ExactMoney): void => {
  if (
    !Number.isSafeInteger(value.minorUnits) || value.minorUnits < 0 ||
    !Number.isSafeInteger(value.scale) || value.scale < 0 ||
    value.currency.trim().length === 0 || value.purpose.trim().length === 0 ||
    value.ownerId.trim().length === 0 || value.fiscalCohort.trim().length === 0
  ) throw new Error("Canonical money record is not exact and owner-qualified.");
};

const historicalControl = (value: ProgramInitializationSeed["fiscalControls"][number]): FiscalControlRecord => ({
  ...copy(value),
  amount: copy(value.line6011.amount),
  scope: "APPROVED_FISCAL_CONTROL_NOT_RECIPIENT_ENTITLEMENT",
  ruleProfile: null,
});

export const createProgramImplementationState = (
  sourceArtifactId: string,
  seed: ProgramInitializationSeed,
): ProgramImplementationState => ({
  schemaVersion: seed.schemaVersion,
  sourceArtifactId,
  detailCoverage: seed.detailCoverage,
  nationalBalance: seed.nationalBalance,
  legalOrder: {
    historicalLegalSources: copy(seed.legalSources),
    generatedLegalSourceOwner: "LEGISLATIVE_RUNTIME_ENACTED_LEGAL_SOURCES",
  },
  publicFinance: {
    historicalBudgetAuthorities: copy(seed.budgetAuthorities),
    generatedBudgetAuthorities: [],
  },
  ownerResolution: {
    intentions: [],
  },
  fiscalExecution: {
    historicalControls: seed.fiscalControls.map(historicalControl),
    generatedControls: [],
    historicalProgramAllocations: copy(seed.programAllocations),
    generatedProgramAllocations: [],
    historicalAwards: copy(seed.awards),
    generatedAwards: [],
    historicalObligations: copy(seed.obligations),
    generatedObligations: [],
    historicalPayments: copy(seed.payments),
    generatedPayments: [],
  },
  administrativeProgram: {
    program: copy(seed.program),
    legalBaseline: copy(seed.legalBaseline),
    historicalWaivers: copy(seed.waivers),
    waiverRequests: [],
    determinations: [],
    relationshipQualificationDeterminations: [],
    legalConstraints: [],
    formulaDispositionResolutions: [],
    dynamicBoundaries: [],
    administrativeCapacityCommitted: 0,
  },
  intergovernmental: {
    historicalRelationships: copy(seed.relationships),
    transitions: [],
  },
  recipientAdministration: {
    historicalExpenditures: copy(seed.recipientExpenditures),
    commitments: [],
    activities: [],
    drawRequests: [],
  },
  materialInputs: [],
  coverage: copy(seed.coverage),
});

const unique = (values: readonly string[], label: string): void => {
  if (new Set(values).size !== values.length || values.some((value) => value.trim().length === 0)) {
    throw new Error(`${label} requires unique nonempty identities.`);
  }
};

const orderedRelationshipTransitions = (
  transitions: readonly RelationshipTransitionRecord[],
): readonly RelationshipTransitionRecord[] => [...transitions].sort((left, right) =>
  Date.parse(left.occurredAt) - Date.parse(right.occurredAt) || left.id.localeCompare(right.id));

export const deriveEffectiveIntergovernmentalRelationship = (
  state: ProgramImplementationState,
  relationshipId: string,
  asOf: string,
): EffectiveIntergovernmentalRelationship | null => {
  const historical = state.intergovernmental.historicalRelationships.find((entry) => entry.id === relationshipId);
  const asOfTime = Date.parse(asOf);
  if (historical === undefined || !Number.isFinite(asOfTime)) return null;
  let status = historical.status;
  let members = historical.members.map((member) => ({ ...member }));
  for (const transition of orderedRelationshipTransitions(state.intergovernmental.transitions)) {
    if (transition.relationshipId !== relationshipId || Date.parse(transition.occurredAt) > asOfTime) continue;
    if (transition.transitionKind === "RELATIONSHIP_STATUS" && transition.newStatus !== null) {
      status = transition.newStatus;
    } else if (
      transition.transitionKind === "MEMBER_PARTICIPATION" &&
      transition.memberId !== null && transition.newParticipation !== null
    ) {
      const participation = transition.newParticipation;
      members = members.map((member) => member.id === transition.memberId
        ? { ...member, participation }
        : member);
    }
  }
  return {
    id: historical.id,
    recipientId: historical.recipientId,
    status,
    members,
    newFundingEligible: status === "ACTIVE",
    survivingDuties: [...historical.survivingDuties],
    asOf,
  };
};

const isMemberEligibleForNewFormula = (
  relationship: EffectiveIntergovernmentalRelationship,
  memberId: string | null,
): boolean => {
  if (!relationship.newFundingEligible) return false;
  if (memberId === null) return relationship.members.length === 0;
  const member = relationship.members.find((entry) => entry.id === memberId);
  return member !== undefined && (member.participation === "INCLUDED" || member.participation === "LEAD_ENTITY_ACTIVE");
};

const intentionIdentity = (
  intention: ImplementationOwnerIntention,
  originatingAdministrationId: string,
  originatingActorId: string,
  targetOwnerId: string,
  submittedAt: string,
  configuration: IntegratedImplementationConfiguration,
): string => `${configuration.ownerResolution.intentionIdPrefix}${sha256Hex(JSON.stringify({
  semanticVersion: configuration.ownerResolution.semanticVersion,
  originatingAdministrationId,
  originatingActorId,
  targetOwnerId,
  submittedAt,
  intention,
})).slice(0, 24)}`;

export const submitImplementationOwnerIntention = (
  state: ProgramImplementationState,
  intention: ImplementationOwnerIntention,
  origin: { readonly administrationId: string; readonly actorId: string },
  targetOwnerId: string,
  matterId: string,
  configuration: IntegratedImplementationConfiguration,
  at: string,
): ProgramImplementationState => {
  if (
    origin.administrationId.trim().length === 0 || origin.actorId.trim().length === 0 ||
    targetOwnerId.trim().length === 0 || matterId.trim().length === 0 || !Number.isFinite(Date.parse(at))
  ) throw new Error("Implementation owner intention requires exact origin, owner, matter, and time.");
  const id = intentionIdentity(intention, origin.administrationId, origin.actorId, targetOwnerId, at, configuration);
  if (state.ownerResolution.intentions.some((entry) => entry.id === id)) return state;
  const record: ImplementationOwnerIntentionRecord = {
    ...copy(intention),
    id,
    originatingAdministrationId: origin.administrationId,
    originatingActorId: origin.actorId,
    targetOwnerId,
    matterId,
    submittedAt: at,
    status: "PENDING",
    resolvedAt: null,
    resultRecordIds: [],
    resolutionReason: null,
    semanticVersion: configuration.ownerResolution.semanticVersion,
    classification: "SIMULATION_GENERATED",
  };
  return { ...state, ownerResolution: { intentions: [...state.ownerResolution.intentions, record] } };
};

const requirePendingIntention = <Kind extends ImplementationOwnerIntention["kind"]>(
  state: ProgramImplementationState,
  intentionId: string,
  kind: Kind,
): Extract<ImplementationOwnerIntentionRecord, { readonly kind: Kind }> => {
  const intention = state.ownerResolution.intentions.find((entry) => entry.id === intentionId);
  if (intention === undefined || intention.kind !== kind || intention.status !== "PENDING") {
    throw new Error(`Owner resolution requires pending ${kind} intention ${intentionId}.`);
  }
  return intention as Extract<ImplementationOwnerIntentionRecord, { readonly kind: Kind }>;
};

const exactHistoricalProjection = (state: ProgramImplementationState) => ({
  detailCoverage: state.detailCoverage,
  nationalBalance: state.nationalBalance,
  sourceArtifactId: state.sourceArtifactId,
  legalOrder: state.legalOrder,
  budgetAuthorities: state.publicFinance.historicalBudgetAuthorities,
  controls: state.fiscalExecution.historicalControls,
  programAllocations: state.fiscalExecution.historicalProgramAllocations,
  awards: state.fiscalExecution.historicalAwards,
  obligations: state.fiscalExecution.historicalObligations,
  payments: state.fiscalExecution.historicalPayments,
  program: state.administrativeProgram.program,
  legalBaseline: state.administrativeProgram.legalBaseline,
  waivers: state.administrativeProgram.historicalWaivers,
  relationships: state.intergovernmental.historicalRelationships,
  expenditures: state.recipientAdministration.historicalExpenditures,
  coverage: state.coverage,
});

export const assertProgramImplementationState = (
  state: ProgramImplementationState,
  configuration: IntegratedImplementationConfiguration,
  seed: ProgramInitializationSeed,
): void => {
  const baseline = createProgramImplementationState(configuration.initializationArtifactId, seed);
  if (
    state.schemaVersion !== configuration.schemaVersion ||
    state.sourceArtifactId !== configuration.initializationArtifactId ||
    JSON.stringify(exactHistoricalProjection(state)) !== JSON.stringify(exactHistoricalProjection(baseline))
  ) throw new Error("Program implementation historical seed differs from pinned artifact authority.");
  const authorities = [...state.publicFinance.historicalBudgetAuthorities, ...state.publicFinance.generatedBudgetAuthorities];
  const historicalLegalIds = new Set(state.legalOrder.historicalLegalSources.map((entry) => entry.id));
  unique([...historicalLegalIds], "Historical legal sources");
  if (
    state.legalOrder.generatedLegalSourceOwner !== "LEGISLATIVE_RUNTIME_ENACTED_LEGAL_SOURCES" ||
    state.administrativeProgram.program.legalAuthorityRefs.some((id) => !historicalLegalIds.has(id)) ||
    state.publicFinance.historicalBudgetAuthorities.some((entry) => !historicalLegalIds.has(entry.sourceLegalId)) ||
    !historicalLegalIds.has(state.administrativeProgram.legalBaseline.controllingStatuteId) ||
    !historicalLegalIds.has(state.administrativeProgram.legalBaseline.unaffectedRegulationId) ||
    !historicalLegalIds.has(state.administrativeProgram.legalBaseline.operativeStatusNoticeId)
  ) throw new Error("Program or finance state has an unresolved canonical legal-order reference.");
  const controls = [...state.fiscalExecution.historicalControls, ...state.fiscalExecution.generatedControls];
  const payments = [...state.fiscalExecution.historicalPayments, ...state.fiscalExecution.generatedPayments];
  const allocations = [...state.fiscalExecution.historicalProgramAllocations, ...state.fiscalExecution.generatedProgramAllocations];
  const awards = [...state.fiscalExecution.historicalAwards, ...state.fiscalExecution.generatedAwards];
  const obligations = [...state.fiscalExecution.historicalObligations, ...state.fiscalExecution.generatedObligations];
  unique(authorities.map((entry) => entry.id), "Budget authorities");
  unique(state.ownerResolution.intentions.map((entry) => entry.id), "Implementation owner intentions");
  unique(controls.map((entry) => entry.id), "Fiscal controls");
  unique(payments.map((entry) => entry.id), "Payments");
  unique(allocations.map((entry) => entry.id), "Program allocations");
  unique(awards.map((entry) => entry.id), "Awards");
  unique(obligations.map((entry) => entry.id), "Obligations");
  unique(state.administrativeProgram.waiverRequests.map((entry) => entry.id), "Waiver requests");
  unique(state.administrativeProgram.determinations.map((entry) => entry.id), "Administrative determinations");
  unique(
    state.administrativeProgram.relationshipQualificationDeterminations.map((entry) => entry.id),
    "Relationship qualification determinations",
  );
  unique(state.administrativeProgram.legalConstraints.map((entry) => entry.id), "Administrative legal constraints");
  unique(
    state.administrativeProgram.formulaDispositionResolutions.map((entry) => entry.id),
    "Relationship formula disposition resolutions",
  );
  unique(state.intergovernmental.transitions.map((entry) => entry.id), "Relationship transitions");
  unique(state.recipientAdministration.commitments.map((entry) => entry.id), "Recipient commitments");
  unique(state.recipientAdministration.activities.map((entry) => entry.id), "Recipient activities");
  unique(state.recipientAdministration.drawRequests.map((entry) => entry.id), "Recipient draw requests");
  unique(state.materialInputs.map((entry) => entry.id), "Material inputs");
  unique(state.administrativeProgram.dynamicBoundaries.map((entry) => entry.id), "Administrative boundaries");
  const generatedIds = new Set(generatedResultIds(state));
  for (const intention of state.ownerResolution.intentions) {
    const expectedId = intentionIdentity(
      { kind: intention.kind, payload: copy(intention.payload) } as ImplementationOwnerIntention,
      intention.originatingAdministrationId,
      intention.originatingActorId,
      intention.targetOwnerId,
      intention.submittedAt,
      configuration,
    );
    const linkedResultIds = [
      ...state.fiscalExecution.generatedControls,
      ...state.fiscalExecution.generatedProgramAllocations,
      ...state.fiscalExecution.generatedAwards,
      ...state.fiscalExecution.generatedObligations,
      ...state.fiscalExecution.generatedPayments,
      ...state.recipientAdministration.commitments,
      ...state.recipientAdministration.activities,
      ...state.recipientAdministration.drawRequests,
      ...state.intergovernmental.transitions,
      ...state.administrativeProgram.relationshipQualificationDeterminations,
    ].filter((entry) => entry.sourceIntentionId === intention.id).map((entry) => entry.id).sort();
    if (
      intention.id !== expectedId || intention.semanticVersion !== configuration.ownerResolution.semanticVersion ||
      intention.classification !== "SIMULATION_GENERATED" || !Number.isFinite(Date.parse(intention.submittedAt)) ||
      intention.originatingAdministrationId.trim().length === 0 || intention.originatingActorId.trim().length === 0 ||
      intention.targetOwnerId.trim().length === 0 || intention.matterId.trim().length === 0 ||
      (intention.status === "PENDING" && (
        intention.resolvedAt !== null || intention.resultRecordIds.length !== 0 || intention.resolutionReason !== null
      )) ||
      (intention.status === "RESOLVED" && (
        intention.resolvedAt === null || intention.resolutionReason !== null ||
        intention.resultRecordIds.some((id) => !generatedIds.has(id)) ||
        JSON.stringify([...intention.resultRecordIds].sort()) !== JSON.stringify(linkedResultIds) ||
        Date.parse(intention.resolvedAt) < Date.parse(intention.submittedAt)
      )) ||
      (intention.status === "REFUSED" && (
        intention.resolvedAt === null || intention.resultRecordIds.length !== 0 || intention.resolutionReason === null
      ))
    ) throw new Error(`Implementation owner intention ${intention.id} contradicts configured semantics.`);
  }
  for (const monetary of [
    ...authorities.map((entry) => entry.amount),
    ...controls.map((entry) => entry.amount),
    ...allocations.map((entry) => entry.amount),
    ...awards.map((entry) => entry.amount),
    ...obligations.map((entry) => entry.amount),
    ...payments.map((entry) => entry.amount),
    ...state.recipientAdministration.historicalExpenditures.map((entry) => entry.amount),
    ...state.recipientAdministration.commitments.map((entry) => entry.amount),
    ...state.recipientAdministration.drawRequests.map((entry) => entry.amount),
  ]) assertExactMoney(monetary);
  for (const authority of state.publicFinance.generatedBudgetAuthorities) {
    const expectedUntil = addElapsedCalendarDays(
      authority.effectiveFrom,
      configuration.generatedFiscalWindow.availabilityDurationDays,
    );
    if (
      authority.id !== `${configuration.recordIds.budgetAuthorityPrefix}${sha256Hex(authority.sourceLegalId).slice(0, 20)}` ||
      authority.amount.ownerId !== configuration.publicFinanceOwnerId ||
      authority.amount.currency !== configuration.currency || authority.amount.scale !== configuration.currencyScale ||
      authority.amount.fiscalCohort !== configuration.fiscalCohortId || authority.availableUntil !== expectedUntil ||
      authority.classification !== "SIMULATION_GENERATED" || authority.operativeRuleProfile === undefined ||
      authority.enactedAt !== authority.effectiveFrom
    ) throw new Error(`Generated budget authority ${authority.id} contradicts configured fiscal availability semantics.`);
  }
  for (const control of state.fiscalExecution.generatedControls) {
    const authority = state.publicFinance.generatedBudgetAuthorities.find((entry) => entry.id === control.sourceBudgetAuthorityId);
    const intention = state.ownerResolution.intentions.find((entry) => entry.id === control.sourceIntentionId);
    const detailedAwardTotal = state.fiscalExecution.generatedAwards
      .filter((entry) => entry.sourceFiscalControlId === control.id)
      .reduce((total, entry) => total + entry.amount.minorUnits, 0);
    if (
      authority === undefined || authority.status !== "APPORTIONED" ||
      control.amount.minorUnits !== authority.amount.minorUnits || control.ruleProfile === null ||
      detailedAwardTotal >= control.amount.minorUnits ||
      control.id !== `${configuration.recordIds.fiscalControlPrefix}${sha256Hex(authority.id).slice(0, 20)}` ||
      control.controllerInstitutionId !== configuration.fiscalControllerInstitutionId ||
      control.programId !== configuration.programId || control.amount.ownerId !== configuration.fiscalControlOwnerId ||
      control.classification !== "SIMULATION_GENERATED" || intention?.kind !== "REQUEST_FISCAL_CONTROL" ||
      intention.status !== "RESOLVED" || intention.payload.budgetAuthorityId !== authority.id
    ) throw new Error(`Generated fiscal control ${control.id} contradicts budget authority progression.`);
  }
  const expectedCapacity = state.fiscalExecution.generatedControls.reduce(
    (total, control) => total + (control.ruleProfile?.administrativeCapacityUnits ?? 0),
    0,
  );
  if (state.administrativeProgram.administrativeCapacityCommitted !== expectedCapacity) {
    throw new Error("Administrative capacity state contradicts admitted fiscal controls.");
  }
  for (const obligation of state.fiscalExecution.generatedObligations) {
    const award = state.fiscalExecution.generatedAwards.find((entry) => entry.id === obligation.awardId);
    const allocation = state.fiscalExecution.generatedProgramAllocations.find(
      (entry) => entry.sourceAwardEventId === award?.sourceAwardEventId,
    );
    const control = state.fiscalExecution.generatedControls.find((entry) => entry.id === award?.sourceFiscalControlId);
    const intention = state.ownerResolution.intentions.find((entry) => entry.id === obligation.sourceIntentionId);
    const relationship = award === undefined || award.relationshipId === undefined
      ? null
      : deriveEffectiveIntergovernmentalRelationship(state, award.relationshipId, award.signedAt);
    if (
      award === undefined || allocation === undefined || control === undefined ||
      award.recipientId !== allocation.recipientId ||
      obligation.amount.minorUnits !== award.amount.minorUnits ||
      award.amount.minorUnits !== allocation.amount.minorUnits ||
      award.amount.minorUnits > control.amount.minorUnits ||
      award.classification !== "SIMULATION_GENERATED" || allocation.classification !== "SIMULATION_GENERATED" ||
      obligation.classification !== "SIMULATION_GENERATED" ||
      award.sourceIntentionId !== obligation.sourceIntentionId || allocation.sourceIntentionId !== obligation.sourceIntentionId ||
      obligation.amount.ownerId !== configuration.federalFiscalExecutionOwnerId ||
      award.amount.ownerId !== configuration.administeringInstitutionId || allocation.amount.ownerId !== configuration.programId ||
      intention?.kind !== "REQUEST_BOUNDED_AWARD" || intention.status !== "RESOLVED" ||
      JSON.stringify(intention.payload.request) !== JSON.stringify({
        sourceFiscalControlId: control.id,
        relationshipId: award.relationshipId,
        formulaScopeMemberId: award.formulaScopeMemberId,
        recipientId: award.recipientId,
        amountMinorUnits: award.amount.minorUnits,
        agreementRef: award.agreementRef,
        causeKey: intention.payload.request.causeKey,
      }) ||
      relationship === null || !isMemberEligibleForNewFormula(relationship, award.formulaScopeMemberId ?? null) ||
      award.id !== `${configuration.recordIds.awardPrefix}${sha256Hex(award.sourceAwardEventId).slice(0, 20)}` ||
      allocation.id !== `${configuration.recordIds.programAllocationPrefix}${sha256Hex(award.sourceAwardEventId).slice(0, 20)}` ||
      obligation.id !== `${configuration.recordIds.obligationPrefix}${sha256Hex(award.sourceAwardEventId).slice(0, 20)}`
    ) throw new Error(`Generated obligation ${obligation.id} lacks its allocation, award, or fiscal control chain.`);
  }
  for (const result of state.intergovernmental.transitions) {
    const relationship = state.intergovernmental.historicalRelationships.find((entry) => entry.id === result.relationshipId);
    const intention = state.ownerResolution.intentions.find((entry) => entry.id === result.sourceIntentionId);
    const expectedMemberId = result.transitionKind === "MEMBER_PARTICIPATION"
      ? `${configuration.recordIds.relationshipTransitionPrefix}${sha256Hex(`${result.relationshipId}|${result.memberId}|${result.election}|${intention?.kind === "LOCAL_MEMBER_PARTICIPATION_DECISION" ? intention.payload.causeKey : ""}`).slice(0, 20)}`
      : `${configuration.recordIds.relationshipTransitionPrefix}${sha256Hex(`${result.relationshipId}|STATUS|${result.newStatus}|${intention?.kind === "LOCAL_RELATIONSHIP_STATUS_DECISION" ? intention.payload.causeKey : ""}`).slice(0, 20)}`;
    if (
      relationship === undefined || result.id !== expectedMemberId || !Number.isFinite(Date.parse(result.occurredAt)) ||
      result.classification !== "SIMULATION_GENERATED" || result.formulaScopeChanged !== true ||
      result.statewideRefusal !== false || JSON.stringify(result.survivingDuties) !== JSON.stringify(relationship.survivingDuties) ||
      intention?.targetOwnerId !== configuration.intergovernmentalRelationshipOwnerId ||
      intention.resolvedAt !== result.occurredAt ||
      (result.transitionKind === "MEMBER_PARTICIPATION" && (
        intention?.kind !== "LOCAL_MEMBER_PARTICIPATION_DECISION" || intention.status !== "RESOLVED" ||
        result.memberId === null || !relationship.members.some((member) => member.id === result.memberId) ||
        result.election === null || result.newStatus !== null ||
        result.newParticipation !== (result.election === "INCLUDE" ? "INCLUDED" : "EXCLUDED_FOR_NEW_FORMULA_RELATION")
      )) ||
      (result.transitionKind === "RELATIONSHIP_STATUS" && (
        intention?.kind !== "LOCAL_RELATIONSHIP_STATUS_DECISION" || intention.status !== "RESOLVED" ||
        result.memberId !== null || result.election !== null || result.newParticipation !== null || result.newStatus === null
      ))
    ) throw new Error(`Relationship transition ${result.id} exceeds its bounded owner.`);
  }
  for (const request of state.administrativeProgram.waiverRequests) {
    if (request.classification !== "SIMULATION_GENERATED" || request.responsibleInstitutionId !== configuration.futureWaiver.responsibleInstitutionId) {
      throw new Error(`Future waiver request ${request.id} has invalid provenance or owner.`);
    }
  }
  for (const [ownerSequence, determination] of state.administrativeProgram.determinations.entries()) {
    const request = state.administrativeProgram.waiverRequests.find((entry) => entry.id === determination.requestId);
    const expectedOutcome = determination.intention === "GRANT_SCOPED_WAIVER"
      ? "SCOPED_WAIVER_GRANTED"
      : determination.intention === "DENY" ? "DENIED" : "RETURNED_FOR_RECORD";
    if (
      request === undefined || determination.physicalHousingEffect !== null ||
      determination.ownerSequence !== ownerSequence ||
      determination.institutionId !== configuration.futureWaiver.responsibleInstitutionId ||
      determination.outcome !== expectedOutcome || determination.scope !== request.inputComponent ||
      determination.scopeKey !== `BABA_COMPONENT:${request.inputComponent}` ||
      (determination.outcome === "RETURNED_FOR_RECORD" && (
        determination.releaseOfInputId !== null || determination.causalPredecessorInputIds.length > 0
      )) ||
      determination.classification !== "SIMULATION_GENERATED" ||
      determination.id !== `${configuration.futureWaiver.determinationIdPrefix}${sha256Hex(
        administrativeDeterminationIdentity(determination),
      ).slice(0, 20)}`
    ) {
      throw new Error(`Administrative determination ${determination.id} lacks its request or mutates Housing.`);
    }
  }
  for (const commitment of state.recipientAdministration.commitments) {
    const obligation = state.fiscalExecution.generatedObligations.find((entry) => entry.id === commitment.sourceObligationId);
    const award = state.fiscalExecution.generatedAwards.find((entry) => entry.id === obligation?.awardId);
    const relationship = deriveEffectiveIntergovernmentalRelationship(state, commitment.relationshipId, commitment.committedAt);
    const control = state.fiscalExecution.generatedControls.find((entry) => entry.id === commitment.sourceFiscalControlId);
    const intention = state.ownerResolution.intentions.find((entry) => entry.id === commitment.sourceIntentionId);
    if (
      relationship?.recipientId !== commitment.recipientId || obligation === undefined || award === undefined || control === undefined ||
      award.relationshipId !== commitment.relationshipId || !isMemberEligibleForNewFormula(relationship, award.formulaScopeMemberId ?? null) ||
      award.sourceFiscalControlId !== control.id || intention?.kind !== "REQUEST_RECIPIENT_COMMITMENT" ||
      intention.status !== "RESOLVED" || JSON.stringify(intention.payload.request) !== JSON.stringify({
        recipientId: commitment.recipientId,
        relationshipId: commitment.relationshipId,
        projectRef: commitment.projectRef,
        sourceObligationId: commitment.sourceObligationId,
        amountMinorUnits: commitment.amount.minorUnits,
        planRef: commitment.planRef,
        projectSelectionRef: commitment.projectSelectionRef,
        writtenAgreementRef: commitment.writtenAgreementRef,
        environmentalClearanceRef: commitment.environmentalClearanceRef,
        selectedRecipientOption: commitment.selectedRecipientOption,
        complianceRecordRefs: commitment.complianceRecordRefs,
        geographicPriorityAcknowledgement: commitment.geographicPriorityAcknowledgement,
        causeKey: intention.payload.request.causeKey,
      }) ||
      commitment.id !== `${configuration.recordIds.recipientCommitmentPrefix}${sha256Hex(`${intention.payload.request.causeKey}|${commitment.projectRef}`).slice(0, 20)}` ||
      commitment.amount.minorUnits <= 0 || commitment.amount.minorUnits > obligation.amount.minorUnits ||
      commitment.amount.ownerId !== commitment.recipientId || commitment.classification !== "SIMULATION_GENERATED" ||
      commitment.writtenAgreementRef.trim().length === 0 || commitment.environmentalClearanceRef.trim().length === 0 ||
      !Number.isSafeInteger(commitment.selectedRecipientOption) || commitment.selectedRecipientOption < 1 ||
      commitment.selectedRecipientOption > (control.ruleProfile?.maximumRecipientOptions ?? 0) ||
      control.ruleProfile === null || control.ruleProfile.requiredRecordTypes.some(
        (required) => !commitment.complianceRecordRefs.includes(required),
      ) || commitment.geographicPriorityAcknowledgement !== control.ruleProfile.geographicPriorityRule
    ) throw new Error(`Recipient commitment ${commitment.id} lacks its lawful relationship and fiscal chain.`);
  }
  for (const activity of state.recipientAdministration.activities) {
    const commitment = state.recipientAdministration.commitments.find((entry) => entry.id === activity.commitmentId);
    const intention = state.ownerResolution.intentions.find((entry) => entry.id === activity.sourceIntentionId);
    if (
      commitment === undefined || intention?.kind !== "REQUEST_RECIPIENT_ACTIVITY_SETUP" || intention.status !== "RESOLVED" ||
      intention.payload.commitmentId !== activity.commitmentId || intention.targetOwnerId !== commitment.recipientId ||
      activity.id !== `${configuration.recordIds.recipientActivityPrefix}${sha256Hex(activity.commitmentId).slice(0, 20)}` ||
      activity.status !== "SET_UP" || activity.classification !== "SIMULATION_GENERATED"
    ) {
      throw new Error(`Recipient activity ${activity.id} lacks its commitment.`);
    }
  }
  for (const [drawIndex, draw] of state.recipientAdministration.drawRequests.entries()) {
    const activity = state.recipientAdministration.activities.find((entry) => entry.id === draw.activityId);
    const commitment = state.recipientAdministration.commitments.find((entry) => entry.id === activity?.commitmentId);
    const intention = state.ownerResolution.intentions.find((entry) => entry.id === draw.sourceIntentionId);
    const prior = state.recipientAdministration.drawRequests.slice(0, drawIndex)
      .filter((entry) => entry.activityId === draw.activityId)
      .reduce((total, entry) => total + entry.amount.minorUnits, 0);
    if (
      commitment === undefined || intention?.kind !== "REQUEST_RECIPIENT_DRAW" || intention.status !== "RESOLVED" ||
      intention.payload.activityId !== draw.activityId || intention.payload.amountMinorUnits !== draw.amount.minorUnits ||
      intention.targetOwnerId !== commitment.recipientId ||
      draw.id !== `${configuration.recordIds.drawRequestPrefix}${sha256Hex(`${draw.activityId}|${prior}|${draw.amount.minorUnits}`).slice(0, 20)}` ||
      draw.amount.minorUnits <= 0 || draw.amount.minorUnits > commitment.amount.minorUnits ||
      draw.classification !== "SIMULATION_GENERATED"
    ) {
      throw new Error(`Recipient draw ${draw.id} lacks activity or exceeds commitment.`);
    }
    const payment = state.fiscalExecution.generatedPayments.find((entry) => entry.drawRequestId === draw.id);
    const paymentIntention = state.ownerResolution.intentions.find((entry) => entry.id === payment?.sourceIntentionId);
    if (
      (draw.status === "PAID") !== (payment !== undefined) ||
      (payment !== undefined && (
        payment.amount.minorUnits !== draw.amount.minorUnits || payment.amount.ownerId !== configuration.federalFiscalExecutionOwnerId ||
        payment.classification !== "SIMULATION_GENERATED" || payment.obligationId !== commitment.sourceObligationId ||
        payment.id !== `${configuration.recordIds.paymentPrefix}${sha256Hex(draw.id).slice(0, 20)}` ||
        paymentIntention?.kind !== "REQUEST_FEDERAL_PAYMENT" || paymentIntention.status !== "RESOLVED" ||
        paymentIntention.payload.drawRequestId !== draw.id || paymentIntention.targetOwnerId !== configuration.federalFiscalExecutionOwnerId
      ))
    ) {
      throw new Error(`Recipient draw ${draw.id} contradicts its federal payment state.`);
    }
  }
  for (const commitment of state.recipientAdministration.commitments) {
    const activityIds = new Set(state.recipientAdministration.activities
      .filter((activity) => activity.commitmentId === commitment.id)
      .map((activity) => activity.id));
    const totalDraws = state.recipientAdministration.drawRequests
      .filter((draw) => activityIds.has(draw.activityId))
      .reduce((total, draw) => total + draw.amount.minorUnits, 0);
    if (totalDraws > commitment.amount.minorUnits) {
      throw new Error(`Recipient draws exceed commitment ${commitment.id}.`);
    }
  }
  for (const boundary of state.administrativeProgram.dynamicBoundaries) {
    const request = state.administrativeProgram.waiverRequests.find((entry) => entry.id === boundary.ownerId);
    const returned = state.administrativeProgram.determinations.find(
      (entry) => entry.requestId === boundary.ownerId && entry.intention === "RETURN_FOR_SUPPLEMENTAL_RECORD",
    );
    const expectedAt = returned === undefined
      ? null
      : addElapsedCalendarDays(returned.decidedAt, configuration.futureWaiver.returnReviewDelayDays);
    if (
      request === undefined || returned === undefined || expectedAt === null ||
      boundary.at !== expectedAt || boundary.kind !== "SUPPLEMENTAL_RECORD_REVIEW_READY" ||
      boundary.phase !== 0 || boundary.order !== 0 ||
      boundary.stableKey !== `${configuration.futureWaiver.semanticVersion}|${request.id}|${expectedAt}` ||
      boundary.id !== `${request.id}.supplemental-review.${sha256Hex(expectedAt).slice(0, 12)}` ||
      (boundary.processed && request.reviewState === "RETURNED_FOR_SUPPLEMENTAL_RECORD") ||
      (!boundary.processed && request.reviewState !== "RETURNED_FOR_SUPPLEMENTAL_RECORD")
    ) {
      throw new Error(`Administrative boundary ${boundary.id} lacks its owning request.`);
    }
  }
  const materialInputIds = new Set(state.materialInputs.map((entry) => entry.id));
  if (materialInputIds.size !== state.materialInputs.length) {
    throw new Error("I7-facing material inputs require unique deterministic identities.");
  }
  const expectedWaiverInputs = new Map<string, {
    readonly determinationId: string;
    readonly kind: MaterialInputKind;
    readonly projectRef: string;
    readonly scopeKey: string;
    readonly validatedAt: string;
    readonly releaseOfInputId: string | null;
    readonly causalPredecessorInputIds: readonly string[];
  }>();
  const operativeHoldIdsByProjectAndScope = new Map<string, Map<string, string[]>>();
  for (const determination of state.administrativeProgram.determinations) {
    const waiverRequest = state.administrativeProgram.waiverRequests.find(
      (entry) => entry.id === determination.requestId,
    );
    if (waiverRequest === undefined || determination.outcome === "RETURNED_FOR_RECORD") continue;
    const scopeKey = `BABA_COMPONENT:${waiverRequest.inputComponent}`;
    const holdsByScope = operativeHoldIdsByProjectAndScope.get(waiverRequest.projectRef) ?? new Map<string, string[]>();
    operativeHoldIdsByProjectAndScope.set(waiverRequest.projectRef, holdsByScope);
    if (determination.outcome === "DENIED") {
      const id = `${configuration.futureWaiver.materialInputIdPrefix}${sha256Hex(
        `${determination.id}|COMPLIANCE_HOLD|0`,
      ).slice(0, 20)}`;
      expectedWaiverInputs.set(id, {
        determinationId: determination.id,
        kind: "COMPLIANCE_HOLD",
        projectRef: waiverRequest.projectRef,
        scopeKey,
        validatedAt: determination.decidedAt,
        releaseOfInputId: null,
        causalPredecessorInputIds: [],
      });
      if (determination.releaseOfInputId !== null || determination.causalPredecessorInputIds.length > 0) {
        throw new Error(`Administrative determination ${determination.id} contradicts its canonical hold relation.`);
      }
      holdsByScope.set(scopeKey, [...(holdsByScope.get(scopeKey) ?? []), id]);
      continue;
    }
    const operativeHoldIds = [...(holdsByScope.get(scopeKey) ?? [])];
    const releasedHoldId = operativeHoldIds.pop() ?? null;
    holdsByScope.set(scopeKey, operativeHoldIds);
    const expectedCausalPredecessorInputIds = releasedHoldId === null ? [] : [releasedHoldId];
    if (
      determination.releaseOfInputId !== releasedHoldId ||
      JSON.stringify(determination.causalPredecessorInputIds) !== JSON.stringify(expectedCausalPredecessorInputIds)
    ) throw new Error(`Administrative determination ${determination.id} contradicts its canonical release relation.`);
    for (const [kind, index] of [["WAIVER_TERMS", 0], ["INPUT_AVAILABILITY", 1]] as const) {
      const id = `${configuration.futureWaiver.materialInputIdPrefix}${sha256Hex(
        `${determination.id}|${kind}|${index}`,
      ).slice(0, 20)}`;
      expectedWaiverInputs.set(id, {
        determinationId: determination.id,
        kind,
        projectRef: waiverRequest.projectRef,
        scopeKey,
        validatedAt: determination.decidedAt,
        releaseOfInputId: releasedHoldId,
        causalPredecessorInputIds: expectedCausalPredecessorInputIds,
      });
    }
  }
  for (const determination of state.administrativeProgram.relationshipQualificationDeterminations) {
    const relationship = state.intergovernmental.historicalRelationships.find(
      (entry) => entry.id === determination.relationshipId,
    );
    const sourceIntention = state.ownerResolution.intentions.find(
      (entry) => entry.id === determination.sourceIntentionId,
    );
    const expectedPayload = {
      id: determination.id,
      relationshipId: determination.relationshipId,
      claimantId: determination.claimantId,
      writtenReasons: determination.writtenReasons,
      procedureRecordIds: determination.procedureRecordIds,
    };
    if (
      relationship === undefined || relationship.recipientId !== determination.claimantId ||
      determination.institutionId !== relationship.federalInstitutionId ||
      determination.outcome !== "REQUALIFICATION_REJECTED" ||
      determination.formulaDisposition !== "DIRECTED_OUT_OF_RELATIONSHIP_PENDING_EXECUTION" ||
      determination.finalAgencyAction !== true || determination.prospectiveOnly !== true ||
      determination.moneyDamagesGranted !== false || determination.writtenReasons.length === 0 ||
      determination.writtenReasons.some((reason) => reason.trim().length === 0) ||
      new Set(determination.procedureRecordIds).size !== determination.procedureRecordIds.length ||
      determination.procedureRecordIds.some((id) => typeof id !== "string" || id.trim().length === 0) ||
      !Number.isFinite(Date.parse(determination.issuedAt)) || determination.classification !== "SIMULATION_GENERATED" ||
      sourceIntention?.kind !== "ISSUE_RELATIONSHIP_QUALIFICATION_DETERMINATION" ||
      sourceIntention.status !== "RESOLVED" || sourceIntention.targetOwnerId !== determination.institutionId ||
      sourceIntention.matterId !== determination.id || sourceIntention.resolvedAt !== determination.issuedAt ||
      !sourceIntention.resultRecordIds.includes(determination.id) ||
      JSON.stringify(sourceIntention.payload) !== JSON.stringify(expectedPayload)
    ) throw new Error(`Relationship qualification determination ${determination.id} exceeds its administrative owner.`);
  }
  for (const constraint of state.administrativeProgram.legalConstraints) {
    const determination = state.administrativeProgram.relationshipQualificationDeterminations.find(
      (entry) => entry.id === constraint.determinationId,
    );
    if (
      determination === undefined || constraint.targetInstitutionId !== determination.institutionId ||
      constraint.relationshipId !== determination.relationshipId || constraint.programId !== configuration.programId ||
      constraint.sourceOrderId.trim().length === 0 || constraint.requiredAct.trim().length === 0 ||
      constraint.prohibitedAct.trim().length === 0 || !Number.isFinite(Date.parse(constraint.effectiveAt)) ||
      constraint.enforceabilityCauseId.trim().length === 0 || constraint.classification !== "SIMULATION_GENERATED"
    ) throw new Error(`Administrative legal constraint ${constraint.id} exceeds its exact owner scope.`);
  }
  for (const resolution of state.administrativeProgram.formulaDispositionResolutions) {
    const determination = state.administrativeProgram.relationshipQualificationDeterminations.find(
      (entry) => entry.id === resolution.determinationId,
    );
    const constraint = resolution.legalConstraintId === null ? null : state.administrativeProgram.legalConstraints.find(
      (entry) => entry.id === resolution.legalConstraintId,
    );
    if (
      determination === undefined || (resolution.legalConstraintId !== null && constraint === undefined) ||
      (resolution.outcome === "WITHHELD_BY_COMPLIANCE" && constraint?.enforceability !== "OPERATIVE") ||
      !Number.isFinite(Date.parse(resolution.resolvedAt)) || resolution.classification !== "SIMULATION_GENERATED"
    ) throw new Error(`Relationship formula disposition ${resolution.id} lacks its canonical owner chain.`);
  }
  for (const expectedId of expectedWaiverInputs.keys()) {
    if (!materialInputIds.has(expectedId)) {
      throw new Error(`Waiver owner result lacks deterministic material input ${expectedId}.`);
    }
  }
  for (const input of state.materialInputs) {
    const determination = state.administrativeProgram.determinations.find((entry) => entry.id === input.sourceRecordId);
    const waiverRequest = determination === undefined
      ? undefined
      : state.administrativeProgram.waiverRequests.find((entry) => entry.id === determination.requestId);
    const expectedWaiverInput = expectedWaiverInputs.get(input.id);
    const released = input.releaseOfInputId === null
      ? null
      : state.materialInputs.find((entry) => entry.id === input.releaseOfInputId) ?? null;
    if (
      input.physicalHousingMutation !== false || input.classification !== "SIMULATION_GENERATED" ||
      !Number.isFinite(Date.parse(input.validatedAt)) ||
      (input.scopeKey !== null && input.scopeKey.trim().length === 0) ||
      input.causalPredecessorInputIds.some((id) => !materialInputIds.has(id)) ||
      (input.kind === "COMPLIANCE_HOLD" && (input.scopeKey === null || input.releaseOfInputId !== null)) ||
      (input.releaseOfInputId !== null && (
        !["WAIVER_TERMS", "INPUT_AVAILABILITY"].includes(input.kind) || released?.kind !== "COMPLIANCE_HOLD" ||
        released.projectRef !== input.projectRef || released.scopeKey !== input.scopeKey ||
        Date.parse(released.validatedAt) > Date.parse(input.validatedAt) ||
        input.causalPredecessorInputIds.length !== 1 || input.causalPredecessorInputIds[0] !== released.id
      )) ||
      (input.releaseOfInputId === null && input.causalPredecessorInputIds.length > 0)
    ) throw new Error(`I7-facing material input ${input.id} contradicts its scoped causal authority.`);
    if (determination === undefined) {
      if (input.scopeKey !== null || input.releaseOfInputId !== null || input.causalPredecessorInputIds.length > 0) {
        throw new Error(`Non-waiver material input ${input.id} acquired waiver-release authority.`);
      }
    } else if (
      waiverRequest === undefined || expectedWaiverInput === undefined ||
      expectedWaiverInput.determinationId !== determination.id || input.kind !== expectedWaiverInput.kind ||
      input.sourceOwnerId !== configuration.futureWaiver.responsibleInstitutionId ||
      input.projectRef !== expectedWaiverInput.projectRef || input.validatedAt !== expectedWaiverInput.validatedAt ||
      input.scopeKey !== expectedWaiverInput.scopeKey ||
      input.releaseOfInputId !== expectedWaiverInput.releaseOfInputId ||
      JSON.stringify(input.causalPredecessorInputIds) !== JSON.stringify(expectedWaiverInput.causalPredecessorInputIds)
    ) {
      throw new Error(`Waiver material input ${input.id} contradicts its owner determination.`);
    }
    if (determination?.outcome === "SCOPED_WAIVER_GRANTED") {
      const siblingReleaseRelations = state.materialInputs
        .filter((entry) => entry.sourceRecordId === determination.id)
        .map((entry) => JSON.stringify({
          scopeKey: entry.scopeKey,
          releaseOfInputId: entry.releaseOfInputId,
          causalPredecessorInputIds: [...entry.causalPredecessorInputIds],
        }));
      if (new Set(siblingReleaseRelations).size !== 1) {
        throw new Error(`Waiver material inputs for ${determination.id} disagree about scoped release authority.`);
      }
    }
  }
};

const mappedRuleProfile = (
  law: EnactedLegislativeSource,
  configuration: IntegratedImplementationConfiguration,
): ImplementationRuleProfile => {
  const term = (id: string): OperativeLegalTermValue => {
    const value = law.policyTerms[id];
    if (value === undefined) throw new Error(`Enacted legal source lacks required operative term ${id}.`);
    return value;
  };
  const flexibilityKey = String(term(configuration.legalTermIds.recipientFlexibility));
  const complianceKey = String(term(configuration.legalTermIds.complianceBurden));
  const distributionKey = String(term(configuration.legalTermIds.geographicDistribution));
  const capacityKey = String(term(configuration.legalTermIds.administrativeCapacitySupport));
  const flexibility = configuration.recipientFlexibility[flexibilityKey];
  const compliance = configuration.complianceBurden[complianceKey];
  const distribution = configuration.geographicDistribution[distributionKey];
  const capacity = configuration.administrativeCapacitySupport[capacityKey];
  if (flexibility === undefined || compliance === undefined || distribution === undefined || capacity === undefined) {
    throw new Error("Enacted legal terms do not map to configured I6 behavior.");
  }
  return {
    recipientFlexibilityClass: flexibility.discretionClass,
    maximumRecipientOptions: flexibility.maximumRecipientOptions,
    complianceBurdenClass: compliance.burdenClass,
    requiredRecordTypes: [...compliance.requiredRecordTypes],
    reviewSteps: compliance.reviewSteps,
    geographicPriorityRule: distribution.priorityRule,
    administrativeCapacityClass: capacity.capacityClass,
    administrativeCapacityUnits: capacity.capacityUnits,
    processingLatencyDays: capacity.processingLatencyDays,
  };
};

const moneyFromDollars = (
  dollars: number,
  purpose: string,
  ownerId: string,
  fiscalCohort: string,
  currency: string,
  scale: number,
): ExactMoney => {
  const multiplier = 10 ** scale;
  if (
    !Number.isSafeInteger(dollars) || dollars < 0 ||
    !Number.isSafeInteger(scale) || scale < 0 ||
    !Number.isSafeInteger(multiplier) || !Number.isSafeInteger(dollars * multiplier)
  ) {
    throw new Error("Enacted appropriation must convert into exact configured monetary units.");
  }
  return { minorUnits: dollars * multiplier, currency, scale, purpose, ownerId, fiscalCohort };
};

export const admitEnactedFiscalAuthority = (
  state: ProgramImplementationState,
  law: EnactedLegislativeSource,
  configuration: IntegratedImplementationConfiguration,
  at: string,
): ProgramImplementationState => {
  const existing = state.publicFinance.generatedBudgetAuthorities.find((entry) => entry.sourceLegalId === law.id);
  if (existing !== undefined) return state;
  const ruleProfile = mappedRuleProfile(law, configuration);
  const authority: BudgetAuthorityRecord = {
    id: `${configuration.recordIds.budgetAuthorityPrefix}${sha256Hex(law.id).slice(0, 20)}`,
    sourceLegalId: law.id,
    amount: moneyFromDollars(
      law.appropriation.amount,
      law.appropriation.purpose,
      configuration.publicFinanceOwnerId,
      configuration.fiscalCohortId,
      configuration.currency,
      configuration.currencyScale,
    ),
    enactedAt: at,
    effectiveFrom: at,
    availableUntil: addElapsedCalendarDays(at, configuration.generatedFiscalWindow.availabilityDurationDays),
    status: "AUTHORITY_RECOGNIZED",
    detailCoverage: "BOUNDED_DETAIL_SCAFFOLD_NATIONAL_DETAIL_UNINSTANTIATED",
    classification: "SIMULATION_GENERATED",
    operativeRuleProfile: ruleProfile,
  };
  return {
    ...state,
    publicFinance: {
      ...state.publicFinance,
      generatedBudgetAuthorities: [...state.publicFinance.generatedBudgetAuthorities, authority],
    },
  };
};

export const requestFiscalControl = (
  state: ProgramImplementationState,
  authorityId: string,
  intentionId: string,
): ProgramImplementationState => {
  const intention = requirePendingIntention(state, intentionId, "REQUEST_FISCAL_CONTROL");
  if (intention.payload.budgetAuthorityId !== authorityId) throw new Error("Fiscal-control intention targets another authority.");
  const authority = state.publicFinance.generatedBudgetAuthorities.find((entry) => entry.id === authorityId);
  if (authority === undefined) throw new Error(`Unknown generated budget authority ${authorityId}.`);
  if (authority.status === "APPORTIONED" || authority.status === "APPORTIONMENT_PENDING") return state;
  return {
    ...state,
    publicFinance: {
      ...state.publicFinance,
      generatedBudgetAuthorities: state.publicFinance.generatedBudgetAuthorities.map((entry) =>
        entry.id === authorityId ? { ...entry, status: "APPORTIONMENT_PENDING" } : entry),
    },
  };
};

export const approveFiscalControl = (
  state: ProgramImplementationState,
  authorityId: string,
  intentionId: string,
  configuration: IntegratedImplementationConfiguration,
  at: string,
): ProgramImplementationState => {
  const intention = requirePendingIntention(state, intentionId, "REQUEST_FISCAL_CONTROL");
  if (intention.payload.budgetAuthorityId !== authorityId || intention.targetOwnerId !== configuration.fiscalControlOwnerId) {
    throw new Error("Fiscal-control owner cannot resolve another intention or target.");
  }
  if (
    state.fiscalExecution.generatedProgramAllocations.length !== state.fiscalExecution.generatedAwards.length ||
    state.fiscalExecution.generatedAwards.length !== state.fiscalExecution.generatedObligations.length ||
    state.fiscalExecution.generatedAwards.some((award) =>
      !state.fiscalExecution.generatedObligations.some((obligation) => obligation.awardId === award.id)) ||
    state.fiscalExecution.generatedPayments.some((payment) =>
      !state.recipientAdministration.drawRequests.some((draw) => draw.id === payment.drawRequestId))
  ) throw new Error("Generated fiscal execution records lack their one-event causal counterparts.");
  const authority = state.publicFinance.generatedBudgetAuthorities.find((entry) => entry.id === authorityId);
  if (authority === undefined || authority.operativeRuleProfile === undefined) {
    throw new Error(`Unknown generated budget authority ${authorityId}.`);
  }
  const existing = state.fiscalExecution.generatedControls.find((entry) => entry.sourceBudgetAuthorityId === authorityId);
  if (existing !== undefined) return state;
  if (authority.status !== "APPORTIONMENT_PENDING") throw new Error("Fiscal control requires pending apportionment.");
  const control: FiscalControlRecord = {
    id: `${configuration.recordIds.fiscalControlPrefix}${sha256Hex(authorityId).slice(0, 20)}`,
    sourceBudgetAuthorityId: authority.id,
    controllerInstitutionId: configuration.fiscalControllerInstitutionId,
    programId: configuration.programId,
    approvalAt: at,
    amount: { ...authority.amount, ownerId: configuration.fiscalControlOwnerId },
    scope: "BOUNDED_DETAIL_SCAFFOLD_UNINSTANTIATED_NATIONAL_EXECUTION_REMAINS_OUTSIDE_DETAIL",
    ruleProfile: copy(authority.operativeRuleProfile),
    classification: "SIMULATION_GENERATED",
    sourceIntentionId: intention.id,
  };
  return {
    ...state,
    publicFinance: {
      ...state.publicFinance,
      generatedBudgetAuthorities: state.publicFinance.generatedBudgetAuthorities.map((entry) =>
        entry.id === authorityId ? { ...entry, status: "APPORTIONED" } : entry),
    },
    fiscalExecution: {
      ...state.fiscalExecution,
      generatedControls: [...state.fiscalExecution.generatedControls, control],
    },
    administrativeProgram: {
      ...state.administrativeProgram,
      administrativeCapacityCommitted:
        state.administrativeProgram.administrativeCapacityCommitted +
        authority.operativeRuleProfile.administrativeCapacityUnits,
    },
  };
};

export interface BoundedRecipientAwardRequest {
  readonly sourceFiscalControlId: string;
  readonly relationshipId: string;
  readonly formulaScopeMemberId: string | null;
  readonly recipientId: string;
  readonly amountMinorUnits: number;
  readonly agreementRef: string;
  readonly causeKey: string;
}

/** One admitted award event yields separate program-allocation, award, and obligation facts. */
export const establishBoundedRecipientAward = (
  state: ProgramImplementationState,
  request: BoundedRecipientAwardRequest,
  intentionId: string,
  configuration: IntegratedImplementationConfiguration,
  at: string,
): ProgramImplementationState => {
  const intention = requirePendingIntention(state, intentionId, "REQUEST_BOUNDED_AWARD");
  if (JSON.stringify(intention.payload.request) !== JSON.stringify(request) || intention.targetOwnerId !== configuration.administeringInstitutionId) {
    throw new Error("Award owner cannot resolve another intention or target.");
  }
  const control = state.fiscalExecution.generatedControls.find((entry) => entry.id === request.sourceFiscalControlId);
  const relationship = deriveEffectiveIntergovernmentalRelationship(state, request.relationshipId, at);
  const authority = state.publicFinance.generatedBudgetAuthorities.find((entry) => entry.id === control?.sourceBudgetAuthorityId);
  const priorDetailedAmount = state.fiscalExecution.generatedAwards
    .filter((entry) => entry.sourceFiscalControlId === request.sourceFiscalControlId)
    .reduce((total, entry) => total + entry.amount.minorUnits, 0);
  if (
    control === undefined || authority === undefined || relationship?.recipientId !== request.recipientId ||
    !isMemberEligibleForNewFormula(relationship, request.formulaScopeMemberId) ||
    authority.availableUntil === null || Date.parse(at) > Date.parse(authority.availableUntil) ||
    !Number.isSafeInteger(request.amountMinorUnits) || request.amountMinorUnits <= 0 ||
    priorDetailedAmount + request.amountMinorUnits >= control.amount.minorUnits ||
    request.agreementRef.trim().length === 0
  ) throw new Error("Bounded recipient award lacks fiscal control, relationship, agreement, or exact amount authority.");
  const eventId = `generated-award-event:${sha256Hex(request.causeKey).slice(0, 20)}`;
  if (state.fiscalExecution.generatedAwards.some((entry) => entry.sourceAwardEventId === eventId)) return state;
  const amount = { ...control.amount, minorUnits: request.amountMinorUnits };
  const allocation: ProgramAllocationRecord = {
    id: `${configuration.recordIds.programAllocationPrefix}${sha256Hex(eventId).slice(0, 20)}`,
    programId: configuration.programId,
    recipientId: request.recipientId,
    sourceAwardEventId: eventId,
    sourceFiscalControlId: control.id,
    sourceIntentionId: intention.id,
    amount: { ...amount, purpose: "Bounded program allocation; national detail remains uninstantiated", ownerId: configuration.programId },
    classification: "SIMULATION_GENERATED",
  };
  const award: AwardRecord = {
    id: `${configuration.recordIds.awardPrefix}${sha256Hex(eventId).slice(0, 20)}`,
    fain: `SIMULATION-GENERATED-${sha256Hex(eventId).slice(0, 12)}`,
    sourceAwardEventId: eventId,
    sourceFiscalControlId: control.id,
    sourceIntentionId: intention.id,
    relationshipId: relationship.id,
    formulaScopeMemberId: request.formulaScopeMemberId,
    agreementRef: request.agreementRef,
    programId: configuration.programId,
    recipientId: request.recipientId,
    recipientName: request.recipientId,
    assistanceListing: state.administrativeProgram.program.assistanceListing,
    signedAt: at,
    amount: { ...amount, purpose: "Simulation-generated grant agreement/award", ownerId: configuration.administeringInstitutionId },
    classification: "SIMULATION_GENERATED",
  };
  const obligation: ObligationRecord = {
    id: `${configuration.recordIds.obligationPrefix}${sha256Hex(eventId).slice(0, 20)}`,
    awardId: award.id,
    amount: { ...amount, purpose: "Federal obligation under generated award", ownerId: configuration.federalFiscalExecutionOwnerId },
    obligatedAt: at,
    classification: "SIMULATION_GENERATED",
    sourceIntentionId: intention.id,
  };
  return {
    ...state,
    fiscalExecution: {
      ...state.fiscalExecution,
      generatedProgramAllocations: [...state.fiscalExecution.generatedProgramAllocations, allocation],
      generatedAwards: [...state.fiscalExecution.generatedAwards, award],
      generatedObligations: [...state.fiscalExecution.generatedObligations, obligation],
    },
  };
};

export interface RecipientCommitmentRequest {
  readonly recipientId: string;
  readonly relationshipId: string;
  readonly projectRef: string;
  readonly sourceObligationId: string;
  readonly amountMinorUnits: number;
  readonly planRef: string | null;
  readonly projectSelectionRef: string | null;
  readonly writtenAgreementRef: string | null;
  readonly environmentalClearanceRef: string | null;
  readonly selectedRecipientOption: number;
  readonly complianceRecordRefs: readonly string[];
  readonly geographicPriorityAcknowledgement: string;
  readonly causeKey: string;
}

const materialInput = (
  id: string,
  kind: MaterialInputKind,
  sourceOwnerId: string,
  sourceRecordId: string,
  projectRef: string,
  at: string,
  relation: {
    readonly scopeKey: string | null;
    readonly releaseOfInputId: string | null;
    readonly causalPredecessorInputIds: readonly string[];
  } = { scopeKey: null, releaseOfInputId: null, causalPredecessorInputIds: [] },
): MaterialInputRecord => ({
  id,
  kind,
  sourceOwnerId,
  sourceRecordId,
  projectRef,
  scopeKey: relation.scopeKey,
  releaseOfInputId: relation.releaseOfInputId,
  causalPredecessorInputIds: [...relation.causalPredecessorInputIds],
  validatedAt: at,
  classification: "SIMULATION_GENERATED",
  physicalHousingMutation: false,
});

export const establishRecipientCommitment = (
  state: ProgramImplementationState,
  request: RecipientCommitmentRequest,
  intentionId: string,
  configuration: IntegratedImplementationConfiguration,
  at: string,
): ProgramImplementationState => {
  const intention = requirePendingIntention(state, intentionId, "REQUEST_RECIPIENT_COMMITMENT");
  if (JSON.stringify(intention.payload.request) !== JSON.stringify(request) || intention.targetOwnerId !== request.recipientId) {
    throw new Error("Recipient owner cannot resolve another commitment intention or target.");
  }
  const relationship = deriveEffectiveIntergovernmentalRelationship(state, request.relationshipId, at);
  const obligation = state.fiscalExecution.generatedObligations.find((entry) => entry.id === request.sourceObligationId);
  const award = state.fiscalExecution.generatedAwards.find((entry) => entry.id === obligation?.awardId);
  const control = state.fiscalExecution.generatedControls.find((entry) => entry.id === award?.sourceFiscalControlId);
  if (
    relationship === null || relationship.recipientId !== request.recipientId ||
    award?.relationshipId !== request.relationshipId ||
    !isMemberEligibleForNewFormula(relationship, award?.formulaScopeMemberId ?? null) ||
    obligation === undefined || award === undefined || award.recipientId !== request.recipientId ||
    control?.ruleProfile === null || control === undefined
  ) {
    throw new Error("Recipient commitment lacks active relationship or generated obligation chain.");
  }
  if (request.planRef === null || request.projectSelectionRef === null || request.writtenAgreementRef === null || request.environmentalClearanceRef === null) {
    throw new Error("Recipient commitment requires plan, project selection, written agreement, and environmental clearance.");
  }
  if (
    request.selectedRecipientOption < 1 ||
    request.selectedRecipientOption > control.ruleProfile.maximumRecipientOptions
  ) throw new Error("Recipient selection exceeds operative recipient-flexibility authority.");
  if (control.ruleProfile.requiredRecordTypes.some((required) => !request.complianceRecordRefs.includes(required))) {
    throw new Error("Recipient commitment lacks operative compliance records.");
  }
  if (request.geographicPriorityAcknowledgement !== control.ruleProfile.geographicPriorityRule) {
    throw new Error("Recipient commitment contradicts the operative geographic prioritization rule.");
  }
  if (!Number.isSafeInteger(request.amountMinorUnits) || request.amountMinorUnits <= 0 || request.amountMinorUnits > obligation.amount.minorUnits) {
    throw new Error("Recipient commitment amount exceeds its bounded federal obligation.");
  }
  const id = `${configuration.recordIds.recipientCommitmentPrefix}${sha256Hex(`${request.causeKey}|${request.projectRef}`).slice(0, 20)}`;
  if (state.recipientAdministration.commitments.some((entry) => entry.id === id)) return state;
  const commitment: RecipientCommitmentRecord = {
    id,
    recipientId: request.recipientId,
    relationshipId: request.relationshipId,
    projectRef: request.projectRef,
    sourceFiscalControlId: control.id,
    sourceObligationId: obligation.id,
    amount: { ...control.amount, minorUnits: request.amountMinorUnits, purpose: "Legally sufficient recipient project commitment", ownerId: request.recipientId },
    planRef: request.planRef,
    projectSelectionRef: request.projectSelectionRef,
    writtenAgreementRef: request.writtenAgreementRef,
    environmentalClearanceRef: request.environmentalClearanceRef,
    selectedRecipientOption: request.selectedRecipientOption,
    complianceRecordRefs: [...request.complianceRecordRefs],
    geographicPriorityAcknowledgement: request.geographicPriorityAcknowledgement,
    committedAt: at,
    classification: "SIMULATION_GENERATED",
    sourceIntentionId: intention.id,
  };
  const inputs = [
    materialInput(`${configuration.recordIds.materialInputPrefix}${id}.fiscal`, "VALID_FISCAL_RESOURCE_INPUT", configuration.fiscalControllerInstitutionId, control.id, request.projectRef, at),
    materialInput(`${configuration.recordIds.materialInputPrefix}${id}.readiness`, "RECIPIENT_READINESS", request.recipientId, id, request.projectRef, at),
    materialInput(`${configuration.recordIds.materialInputPrefix}${id}.environmental`, "ENVIRONMENTAL_CLEARANCE_REFERENCE", request.recipientId, request.environmentalClearanceRef, request.projectRef, at),
    materialInput(`${configuration.recordIds.materialInputPrefix}${id}.commitment`, "COMMITMENT_REFERENCE", request.recipientId, id, request.projectRef, at),
  ];
  return {
    ...state,
    recipientAdministration: {
      ...state.recipientAdministration,
      commitments: [...state.recipientAdministration.commitments, commitment],
    },
    materialInputs: [...state.materialInputs, ...inputs],
  };
};

export const setupRecipientActivity = (
  state: ProgramImplementationState,
  commitmentId: string,
  intentionId: string,
  configuration: IntegratedImplementationConfiguration,
  at: string,
): ProgramImplementationState => {
  const intention = requirePendingIntention(state, intentionId, "REQUEST_RECIPIENT_ACTIVITY_SETUP");
  if (intention.payload.commitmentId !== commitmentId) throw new Error("Activity owner cannot resolve another intention.");
  const commitment = state.recipientAdministration.commitments.find((entry) => entry.id === commitmentId);
  if (commitment === undefined || intention.targetOwnerId !== commitment.recipientId) {
    throw new Error(`Recipient activity requires owner commitment ${commitmentId}.`);
  }
  const id = `${configuration.recordIds.recipientActivityPrefix}${sha256Hex(commitmentId).slice(0, 20)}`;
  if (state.recipientAdministration.activities.some((entry) => entry.id === id)) return state;
  return {
    ...state,
    recipientAdministration: {
      ...state.recipientAdministration,
      activities: [...state.recipientAdministration.activities, {
        id,
        commitmentId,
        setupAt: at,
        status: "SET_UP",
        classification: "SIMULATION_GENERATED",
        sourceIntentionId: intention.id,
      }],
    },
    materialInputs: [...state.materialInputs, materialInput(
      `${configuration.recordIds.materialInputPrefix}${id}.availability`,
      "INPUT_AVAILABILITY",
      commitment.recipientId,
      id,
      commitment.projectRef,
      at,
    )],
  };
};

export const submitRecipientDrawRequest = (
  state: ProgramImplementationState,
  activityId: string,
  amountMinorUnits: number,
  intentionId: string,
  configuration: IntegratedImplementationConfiguration,
  at: string,
): ProgramImplementationState => {
  const intention = requirePendingIntention(state, intentionId, "REQUEST_RECIPIENT_DRAW");
  if (intention.payload.activityId !== activityId || intention.payload.amountMinorUnits !== amountMinorUnits) {
    throw new Error("Draw owner cannot resolve another intention.");
  }
  const activity = state.recipientAdministration.activities.find((entry) => entry.id === activityId);
  const commitment = activity === undefined ? undefined : state.recipientAdministration.commitments.find((entry) => entry.id === activity.commitmentId);
  if (activity === undefined || commitment === undefined || intention.targetOwnerId !== commitment.recipientId) {
    throw new Error("Draw request requires its recipient-owned set-up activity.");
  }
  const prior = state.recipientAdministration.drawRequests
    .filter((entry) => entry.activityId === activityId)
    .reduce((total, entry) => total + entry.amount.minorUnits, 0);
  if (!Number.isSafeInteger(amountMinorUnits) || amountMinorUnits <= 0 || prior + amountMinorUnits > commitment.amount.minorUnits) {
    throw new Error("Draw request exceeds the recipient commitment.");
  }
  const id = `${configuration.recordIds.drawRequestPrefix}${sha256Hex(`${activityId}|${prior}|${amountMinorUnits}`).slice(0, 20)}`;
  return {
    ...state,
    recipientAdministration: {
      ...state.recipientAdministration,
      drawRequests: [...state.recipientAdministration.drawRequests, {
        id,
        activityId,
        amount: { ...commitment.amount, minorUnits: amountMinorUnits, purpose: "Eligible recipient draw/payment request" },
        requestedAt: at,
        status: "ELIGIBLE_PENDING_PAYMENT",
        classification: "SIMULATION_GENERATED",
        sourceIntentionId: intention.id,
      }],
    },
  };
};

export const executeEligiblePayment = (
  state: ProgramImplementationState,
  drawRequestId: string,
  intentionId: string,
  configuration: IntegratedImplementationConfiguration,
  at: string,
): ProgramImplementationState => {
  const intention = requirePendingIntention(state, intentionId, "REQUEST_FEDERAL_PAYMENT");
  if (intention.payload.drawRequestId !== drawRequestId || intention.targetOwnerId !== configuration.federalFiscalExecutionOwnerId) {
    throw new Error("Federal fiscal owner cannot resolve another payment intention or target.");
  }
  const draw = state.recipientAdministration.drawRequests.find((entry) => entry.id === drawRequestId);
  if (draw === undefined) throw new Error(`Unknown draw request ${drawRequestId}.`);
  if (draw.status === "PAID") return state;
  const activity = state.recipientAdministration.activities.find((entry) => entry.id === draw.activityId);
  const commitment = state.recipientAdministration.commitments.find((entry) => entry.id === activity?.commitmentId);
  if (commitment === undefined) throw new Error("Payment lacks recipient commitment ownership.");
  const payment: PaymentRecord = {
    id: `${configuration.recordIds.paymentPrefix}${sha256Hex(draw.id).slice(0, 20)}`,
    awardId: state.fiscalExecution.generatedObligations.find(
      (entry) => entry.id === commitment.sourceObligationId,
    )?.awardId ?? (() => { throw new Error("Payment lacks its generated award."); })(),
    obligationId: state.fiscalExecution.generatedObligations.find(
      (entry) => entry.id === commitment.sourceObligationId,
    )?.id ?? (() => { throw new Error("Payment lacks its generated obligation."); })(),
    amount: { ...draw.amount, purpose: "Federal payment/outlay against eligible recipient draw", ownerId: configuration.federalFiscalExecutionOwnerId },
    observedAsOf: at,
    projectRef: commitment.projectRef,
    reconciliation: "GENERATED_TRACEABLE_TO_DRAW_REQUEST",
    classification: "SIMULATION_GENERATED",
    drawRequestId: draw.id,
    sourceIntentionId: intention.id,
  };
  return {
    ...state,
    fiscalExecution: {
      ...state.fiscalExecution,
      generatedPayments: [...state.fiscalExecution.generatedPayments, payment],
    },
    recipientAdministration: {
      ...state.recipientAdministration,
      drawRequests: state.recipientAdministration.drawRequests.map((entry) =>
        entry.id === draw.id ? { ...entry, status: "PAID" } : entry),
    },
  };
};

export interface FutureWaiverRequestInput {
  readonly relationshipId: string;
  readonly projectRef: string;
  readonly inputComponent: string;
  readonly domesticPreferenceRequirement: string;
  readonly assertedBasis: string;
  readonly supportingRecords: readonly string[];
  readonly commentFrom: string | null;
  readonly commentUntil: string | null;
  readonly causeKey: string;
}

export const openFutureWaiverRequest = (
  state: ProgramImplementationState,
  request: FutureWaiverRequestInput,
  configuration: IntegratedImplementationConfiguration,
  at: string,
): ProgramImplementationState => {
  if (!state.intergovernmental.historicalRelationships.some((entry) => entry.id === request.relationshipId)) {
    throw new Error("Future waiver request lacks an instantiated relationship.");
  }
  const id = `${configuration.futureWaiver.recordIdPrefix}${sha256Hex(request.causeKey).slice(0, 20)}`;
  if (state.administrativeProgram.waiverRequests.some((entry) => entry.id === id)) return state;
  const record: WaiverRequestRecord = {
    id,
    programId: configuration.programId,
    relationshipId: request.relationshipId,
    projectRef: request.projectRef,
    inputComponent: request.inputComponent,
    domesticPreferenceRequirement: request.domesticPreferenceRequirement,
    assertedBasis: request.assertedBasis,
    supportingRecords: [...request.supportingRecords],
    commentFrom: request.commentFrom,
    commentUntil: request.commentUntil,
    responsibleInstitutionId: configuration.futureWaiver.responsibleInstitutionId,
    receivedAt: at,
    reviewState: "PENDING",
    supplementalRecordRequirements: [],
    reviewNotBefore: null,
    classification: "SIMULATION_GENERATED",
  };
  return {
    ...state,
    administrativeProgram: {
      ...state.administrativeProgram,
      waiverRequests: [...state.administrativeProgram.waiverRequests, record],
    },
  };
};

export const directWaiverIntention = (
  state: ProgramImplementationState,
  requestId: string,
  intention: WaiverIntention,
  configuration: IntegratedImplementationConfiguration,
  at: string,
): ProgramImplementationState => {
  const request = state.administrativeProgram.waiverRequests.find((entry) => entry.id === requestId);
  if (request === undefined) throw new Error(`Unknown future waiver request ${requestId}.`);
  if (request.reviewState === "DETERMINED") throw new Error("Administrative waiver request is already determined.");
  if (request.reviewNotBefore !== null && Date.parse(at) < Date.parse(request.reviewNotBefore)) {
    throw new Error("Administrative waiver request is not yet eligible for renewed review.");
  }
  const missing = configuration.futureWaiver.requiredSupportingRecordTypes.filter(
    (required) => !request.supportingRecords.includes(required),
  );
  if (intention !== "RETURN_FOR_SUPPLEMENTAL_RECORD" && missing.length > 0) {
    throw new Error("Administrative owner cannot grant or deny before the configured record is sufficient.");
  }
  if (intention === "RETURN_FOR_SUPPLEMENTAL_RECORD") {
    const reviewAt = addElapsedCalendarDays(at, configuration.futureWaiver.returnReviewDelayDays);
    const boundary: DynamicAdministrativeBoundary = {
      id: `${request.id}.supplemental-review.${sha256Hex(reviewAt).slice(0, 12)}`,
      ownerId: request.id,
      at: reviewAt,
      phase: 0,
      order: 0,
      stableKey: `${configuration.futureWaiver.semanticVersion}|${request.id}|${reviewAt}`,
      kind: "SUPPLEMENTAL_RECORD_REVIEW_READY",
      processed: false,
    };
    const determinationWithoutId: Omit<AdministrativeDeterminationRecord, "id"> = {
      ownerSequence: state.administrativeProgram.determinations.length,
      requestId: request.id,
      institutionId: configuration.futureWaiver.responsibleInstitutionId,
      intention,
      outcome: "RETURNED_FOR_RECORD",
      scope: request.inputComponent,
      scopeKey: `BABA_COMPONENT:${request.inputComponent}`,
      releaseOfInputId: null,
      causalPredecessorInputIds: [],
      decidedAt: at,
      classification: "SIMULATION_GENERATED",
      physicalHousingEffect: null,
    };
    const determination: AdministrativeDeterminationRecord = {
      ...determinationWithoutId,
      id: `${configuration.futureWaiver.determinationIdPrefix}${sha256Hex(
        administrativeDeterminationIdentity(determinationWithoutId),
      ).slice(0, 20)}`,
    };
    return {
      ...state,
      administrativeProgram: {
        ...state.administrativeProgram,
        waiverRequests: state.administrativeProgram.waiverRequests.map((entry) => entry.id === request.id ? {
          ...entry,
          reviewState: "RETURNED_FOR_SUPPLEMENTAL_RECORD",
          supplementalRecordRequirements: missing.length > 0 ? missing : ["UPDATED_ADMINISTRATIVE_RECORD"],
          reviewNotBefore: reviewAt,
        } : entry),
        determinations: [...state.administrativeProgram.determinations, determination],
        dynamicBoundaries: [...state.administrativeProgram.dynamicBoundaries, boundary],
      },
    };
  }
  const granted = intention === "GRANT_SCOPED_WAIVER";
  const kind: MaterialInputKind = granted ? "WAIVER_TERMS" : "COMPLIANCE_HOLD";
  const availabilityKind: MaterialInputKind = granted ? "INPUT_AVAILABILITY" : "COMPLIANCE_HOLD";
  const scopeKey = `BABA_COMPONENT:${request.inputComponent}`;
  const releasedHold = granted
    ? [...state.materialInputs].reverse().find((input) =>
        input.kind === "COMPLIANCE_HOLD" && input.projectRef === request.projectRef && input.scopeKey === scopeKey &&
        !state.materialInputs.some((release) => release.releaseOfInputId === input.id)) ?? null
    : null;
  const determinationWithoutId: Omit<AdministrativeDeterminationRecord, "id"> = {
    ownerSequence: state.administrativeProgram.determinations.length,
    requestId: request.id,
    institutionId: configuration.futureWaiver.responsibleInstitutionId,
    intention,
    outcome: granted ? "SCOPED_WAIVER_GRANTED" : "DENIED",
    scope: request.inputComponent,
    scopeKey,
    releaseOfInputId: granted ? releasedHold?.id ?? null : null,
    causalPredecessorInputIds: granted && releasedHold !== null ? [releasedHold.id] : [],
    decidedAt: at,
    classification: "SIMULATION_GENERATED",
    physicalHousingEffect: null,
  };
  const determination: AdministrativeDeterminationRecord = {
    ...determinationWithoutId,
    id: `${configuration.futureWaiver.determinationIdPrefix}${sha256Hex(
      administrativeDeterminationIdentity(determinationWithoutId),
    ).slice(0, 20)}`,
  };
  const inputs = [kind, ...(granted ? [availabilityKind] : [])].map((inputKind, index) => materialInput(
    `${configuration.futureWaiver.materialInputIdPrefix}${sha256Hex(`${determination.id}|${inputKind}|${index}`).slice(0, 20)}`,
    inputKind,
    configuration.futureWaiver.responsibleInstitutionId,
    determination.id,
    request.projectRef,
    at,
    {
      scopeKey,
      releaseOfInputId: granted ? releasedHold?.id ?? null : null,
      causalPredecessorInputIds: granted && releasedHold !== null ? [releasedHold.id] : [],
    },
  ));
  return {
    ...state,
    administrativeProgram: {
      ...state.administrativeProgram,
      waiverRequests: state.administrativeProgram.waiverRequests.map((entry) =>
        entry.id === request.id ? { ...entry, reviewState: "DETERMINED" } : entry),
      determinations: [...state.administrativeProgram.determinations, determination],
    },
    materialInputs: [...state.materialInputs, ...inputs],
  };
};

export const advanceAdministrativeDeadlines = (
  state: ProgramImplementationState,
  target: string,
): ProgramImplementationState => {
  const targetTime = Date.parse(target);
  if (!Number.isFinite(targetTime)) throw new Error("Administrative deadline target must be a valid instant.");
  const due = state.administrativeProgram.dynamicBoundaries
    .filter((boundary) => !boundary.processed && Date.parse(boundary.at) <= targetTime)
    .sort((left, right) => Date.parse(left.at) - Date.parse(right.at) || left.phase - right.phase || left.order - right.order || left.stableKey.localeCompare(right.stableKey));
  let current = state;
  for (const boundary of due) {
    current = applyAdministrativeBoundary(current, boundary.id);
  }
  return current;
};

export const applyAdministrativeBoundary = (
  state: ProgramImplementationState,
  boundaryId: string,
): ProgramImplementationState => {
  const boundary = state.administrativeProgram.dynamicBoundaries.find((entry) => entry.id === boundaryId);
  if (boundary === undefined) throw new Error(`Unknown dynamic administrative boundary ${boundaryId}.`);
  if (boundary.processed) return state;
  return {
    ...state,
    administrativeProgram: {
      ...state.administrativeProgram,
      waiverRequests: state.administrativeProgram.waiverRequests.map((request) =>
        request.id === boundary.ownerId && request.reviewState === "RETURNED_FOR_SUPPLEMENTAL_RECORD"
          ? { ...request, reviewState: "REVIEW_READY" }
          : request),
      dynamicBoundaries: state.administrativeProgram.dynamicBoundaries.map((entry) =>
        entry.id === boundary.id ? { ...entry, processed: true } : entry),
    },
  };
};

export const supplySupplementalWaiverRecords = (
  state: ProgramImplementationState,
  requestId: string,
  recordTypes: readonly string[],
): ProgramImplementationState => {
  const request = state.administrativeProgram.waiverRequests.find((entry) => entry.id === requestId);
  if (
    request === undefined ||
    (request.reviewState !== "RETURNED_FOR_SUPPLEMENTAL_RECORD" && request.reviewState !== "REVIEW_READY") ||
    recordTypes.length === 0 || recordTypes.some((entry) => entry.trim().length === 0)
  ) throw new Error("Supplemental records require a returned pending administrative request.");
  const supportingRecords = [...new Set([...request.supportingRecords, ...recordTypes])].sort();
  return {
    ...state,
    administrativeProgram: {
      ...state.administrativeProgram,
      waiverRequests: state.administrativeProgram.waiverRequests.map((entry) =>
        entry.id === requestId ? { ...entry, supportingRecords } : entry),
    },
  };
};

export const electRelationshipMember = (
  state: ProgramImplementationState,
  relationshipId: string,
  memberId: string,
  election: "INCLUDE" | "EXCLUDE",
  causeKey: string,
  intentionId: string,
  configuration: IntegratedImplementationConfiguration,
  at: string,
): ProgramImplementationState => {
  const intention = requirePendingIntention(state, intentionId, "LOCAL_MEMBER_PARTICIPATION_DECISION");
  if (
    JSON.stringify(intention.payload) !== JSON.stringify({ relationshipId, memberId, election, causeKey }) ||
    intention.targetOwnerId !== configuration.intergovernmentalRelationshipOwnerId
  ) throw new Error("Relationship owner cannot resolve another member decision or target.");
  const relationship = state.intergovernmental.historicalRelationships.find((entry) => entry.id === relationshipId);
  if (relationship === undefined || !relationship.members.some((member) => member.id === memberId)) {
    throw new Error("Relationship member election is outside the instantiated relationship.");
  }
  const id = `${configuration.recordIds.relationshipTransitionPrefix}${sha256Hex(`${relationshipId}|${memberId}|${election}|${causeKey}`).slice(0, 20)}`;
  if (state.intergovernmental.transitions.some((entry) => entry.id === id)) return state;
  const transition: RelationshipTransitionRecord = {
    id,
    relationshipId,
    transitionKind: "MEMBER_PARTICIPATION",
    memberId,
    election,
    newParticipation: election === "INCLUDE" ? "INCLUDED" : "EXCLUDED_FOR_NEW_FORMULA_RELATION",
    newStatus: null,
    formulaScopeChanged: true,
    statewideRefusal: false,
    survivingDuties: [...relationship.survivingDuties],
    occurredAt: at,
    classification: "SIMULATION_GENERATED",
    sourceIntentionId: intention.id,
  };
  return {
    ...state,
    intergovernmental: {
      ...state.intergovernmental,
      transitions: [...state.intergovernmental.transitions, transition],
    },
  };
};

export const transitionRelationshipStatus = (
  state: ProgramImplementationState,
  relationshipId: string,
  status: RelationshipStatus,
  causeKey: string,
  intentionId: string,
  configuration: IntegratedImplementationConfiguration,
  at: string,
): ProgramImplementationState => {
  const intention = requirePendingIntention(state, intentionId, "LOCAL_RELATIONSHIP_STATUS_DECISION");
  if (
    JSON.stringify(intention.payload) !== JSON.stringify({ relationshipId, status, causeKey }) ||
    intention.targetOwnerId !== configuration.intergovernmentalRelationshipOwnerId
  ) throw new Error("Relationship owner cannot resolve another status decision or target.");
  const relationship = state.intergovernmental.historicalRelationships.find((entry) => entry.id === relationshipId);
  if (relationship === undefined) throw new Error("Relationship status decision is outside the bounded owner process.");
  const id = `${configuration.recordIds.relationshipTransitionPrefix}${sha256Hex(`${relationshipId}|STATUS|${status}|${causeKey}`).slice(0, 20)}`;
  if (state.intergovernmental.transitions.some((entry) => entry.id === id)) return state;
  const transition: RelationshipTransitionRecord = {
    id,
    relationshipId,
    transitionKind: "RELATIONSHIP_STATUS",
    memberId: null,
    election: null,
    newParticipation: null,
    newStatus: status,
    formulaScopeChanged: true,
    statewideRefusal: false,
    survivingDuties: [...relationship.survivingDuties],
    occurredAt: at,
    classification: "SIMULATION_GENERATED",
    sourceIntentionId: intention.id,
  };
  return {
    ...state,
    intergovernmental: {
      ...state.intergovernmental,
      transitions: [...state.intergovernmental.transitions, transition],
    },
  };
};

export interface OwnerIntentionOrigin {
  readonly administrationId: string;
  readonly actorId: string;
}

const submittedIntentionId = (
  state: ProgramImplementationState,
  intention: ImplementationOwnerIntention,
  origin: OwnerIntentionOrigin,
  targetOwnerId: string,
  at: string,
  configuration: IntegratedImplementationConfiguration,
): string => intentionIdentity(intention, origin.administrationId, origin.actorId, targetOwnerId, at, configuration);

export const submitFiscalControlIntention = (
  state: ProgramImplementationState,
  budgetAuthorityId: string,
  origin: OwnerIntentionOrigin,
  configuration: IntegratedImplementationConfiguration,
  at: string,
): ProgramImplementationState => {
  const intention = { kind: "REQUEST_FISCAL_CONTROL", payload: { budgetAuthorityId } } as const;
  const submitted = submitImplementationOwnerIntention(
    state, intention, origin, configuration.fiscalControlOwnerId, budgetAuthorityId, configuration, at,
  );
  return requestFiscalControl(
    submitted,
    budgetAuthorityId,
    submittedIntentionId(submitted, intention, origin, configuration.fiscalControlOwnerId, at, configuration),
  );
};

export const submitBoundedAwardIntention = (
  state: ProgramImplementationState,
  request: BoundedRecipientAwardRequest,
  origin: OwnerIntentionOrigin,
  configuration: IntegratedImplementationConfiguration,
  at: string,
): ProgramImplementationState => submitImplementationOwnerIntention(
  state,
  { kind: "REQUEST_BOUNDED_AWARD", payload: { request: copy(request) } },
  origin,
  configuration.administeringInstitutionId,
  request.relationshipId,
  configuration,
  at,
);

export const submitRecipientCommitmentIntention = (
  state: ProgramImplementationState,
  request: RecipientCommitmentRequest,
  origin: OwnerIntentionOrigin,
  configuration: IntegratedImplementationConfiguration,
  at: string,
): ProgramImplementationState => submitImplementationOwnerIntention(
  state,
  { kind: "REQUEST_RECIPIENT_COMMITMENT", payload: { request: copy(request) } },
  origin,
  request.recipientId,
  request.projectRef,
  configuration,
  at,
);

export const submitRecipientActivityIntention = (
  state: ProgramImplementationState,
  commitmentId: string,
  origin: OwnerIntentionOrigin,
  configuration: IntegratedImplementationConfiguration,
  at: string,
): ProgramImplementationState => {
  const commitment = state.recipientAdministration.commitments.find((entry) => entry.id === commitmentId);
  if (commitment === undefined) throw new Error(`Activity intention requires commitment ${commitmentId}.`);
  return submitImplementationOwnerIntention(
    state,
    { kind: "REQUEST_RECIPIENT_ACTIVITY_SETUP", payload: { commitmentId } },
    origin,
    commitment.recipientId,
    commitmentId,
    configuration,
    at,
  );
};

export const submitRecipientDrawIntention = (
  state: ProgramImplementationState,
  activityId: string,
  amountMinorUnits: number,
  origin: OwnerIntentionOrigin,
  configuration: IntegratedImplementationConfiguration,
  at: string,
): ProgramImplementationState => {
  const activity = state.recipientAdministration.activities.find((entry) => entry.id === activityId);
  const commitment = state.recipientAdministration.commitments.find((entry) => entry.id === activity?.commitmentId);
  if (commitment === undefined) throw new Error("Draw intention requires a recipient-owned activity.");
  return submitImplementationOwnerIntention(
    state,
    { kind: "REQUEST_RECIPIENT_DRAW", payload: { activityId, amountMinorUnits } },
    origin,
    commitment.recipientId,
    activityId,
    configuration,
    at,
  );
};

export const submitFederalPaymentIntention = (
  state: ProgramImplementationState,
  drawRequestId: string,
  origin: OwnerIntentionOrigin,
  configuration: IntegratedImplementationConfiguration,
  at: string,
): ProgramImplementationState => submitImplementationOwnerIntention(
  state,
  { kind: "REQUEST_FEDERAL_PAYMENT", payload: { drawRequestId } },
  origin,
  configuration.federalFiscalExecutionOwnerId,
  drawRequestId,
  configuration,
  at,
);

export const submitLocalMemberDecision = (
  state: ProgramImplementationState,
  relationshipId: string,
  memberId: string,
  election: "INCLUDE" | "EXCLUDE",
  causeKey: string,
  origin: OwnerIntentionOrigin,
  configuration: IntegratedImplementationConfiguration,
  at: string,
): ProgramImplementationState => submitImplementationOwnerIntention(
  state,
  { kind: "LOCAL_MEMBER_PARTICIPATION_DECISION", payload: { relationshipId, memberId, election, causeKey } },
  origin,
  configuration.intergovernmentalRelationshipOwnerId,
  `${relationshipId}|${memberId}`,
  configuration,
  at,
);

export const submitLocalRelationshipStatusDecision = (
  state: ProgramImplementationState,
  relationshipId: string,
  status: RelationshipStatus,
  causeKey: string,
  origin: OwnerIntentionOrigin,
  configuration: IntegratedImplementationConfiguration,
  at: string,
): ProgramImplementationState => submitImplementationOwnerIntention(
  state,
  { kind: "LOCAL_RELATIONSHIP_STATUS_DECISION", payload: { relationshipId, status, causeKey } },
  origin,
  configuration.intergovernmentalRelationshipOwnerId,
  relationshipId,
  configuration,
  at,
);

export const submitRelationshipQualificationDetermination = (
  state: ProgramImplementationState,
  input: {
    readonly id: string;
    readonly relationshipId: string;
    readonly claimantId: string;
    readonly writtenReasons: readonly string[];
    readonly procedureRecordIds: readonly string[];
  },
  origin: OwnerIntentionOrigin,
  configuration: IntegratedImplementationConfiguration,
  at: string,
): ProgramImplementationState => {
  const relationship = state.intergovernmental.historicalRelationships.find(
    (entry) => entry.id === input.relationshipId,
  );
  if (relationship === undefined || relationship.recipientId !== input.claimantId) {
    throw new Error("Relationship qualification determination requires its bounded canonical relationship.");
  }
  return submitImplementationOwnerIntention(
    state,
    { kind: "ISSUE_RELATIONSHIP_QUALIFICATION_DETERMINATION", payload: copy(input) },
    origin,
    relationship.federalInstitutionId,
    input.id,
    configuration,
    at,
  );
};

const generatedResultIds = (state: ProgramImplementationState): readonly string[] => [
  ...state.fiscalExecution.generatedControls.map((entry) => entry.id),
  ...state.fiscalExecution.generatedProgramAllocations.map((entry) => entry.id),
  ...state.fiscalExecution.generatedAwards.map((entry) => entry.id),
  ...state.fiscalExecution.generatedObligations.map((entry) => entry.id),
  ...state.fiscalExecution.generatedPayments.map((entry) => entry.id),
  ...state.recipientAdministration.commitments.map((entry) => entry.id),
  ...state.recipientAdministration.activities.map((entry) => entry.id),
  ...state.recipientAdministration.drawRequests.map((entry) => entry.id),
  ...state.intergovernmental.transitions.map((entry) => entry.id),
  ...state.administrativeProgram.relationshipQualificationDeterminations.map((entry) => entry.id),
];

export const resolveImplementationOwnerIntention = (
  state: ProgramImplementationState,
  intentionId: string,
  configuration: IntegratedImplementationConfiguration,
  at: string,
): ProgramImplementationState => {
  const intention = state.ownerResolution.intentions.find((entry) => entry.id === intentionId);
  if (intention === undefined) throw new Error(`Unknown implementation intention ${intentionId}.`);
  if (intention.status !== "PENDING") return state;
  const before = new Set(generatedResultIds(state));
  let resolved: ProgramImplementationState;
  try {
    switch (intention.kind) {
      case "REQUEST_FISCAL_CONTROL":
        resolved = approveFiscalControl(state, intention.payload.budgetAuthorityId, intention.id, configuration, at);
        break;
      case "REQUEST_BOUNDED_AWARD":
        resolved = establishBoundedRecipientAward(state, intention.payload.request, intention.id, configuration, at);
        break;
      case "REQUEST_RECIPIENT_COMMITMENT":
        resolved = establishRecipientCommitment(state, intention.payload.request, intention.id, configuration, at);
        break;
      case "REQUEST_RECIPIENT_ACTIVITY_SETUP":
        resolved = setupRecipientActivity(state, intention.payload.commitmentId, intention.id, configuration, at);
        break;
      case "REQUEST_RECIPIENT_DRAW":
        resolved = submitRecipientDrawRequest(
          state, intention.payload.activityId, intention.payload.amountMinorUnits, intention.id, configuration, at,
        );
        break;
      case "REQUEST_FEDERAL_PAYMENT":
        resolved = executeEligiblePayment(state, intention.payload.drawRequestId, intention.id, configuration, at);
        break;
      case "LOCAL_MEMBER_PARTICIPATION_DECISION":
        resolved = electRelationshipMember(
          state,
          intention.payload.relationshipId,
          intention.payload.memberId,
          intention.payload.election,
          intention.payload.causeKey,
          intention.id,
          configuration,
          at,
        );
        break;
      case "LOCAL_RELATIONSHIP_STATUS_DECISION":
        resolved = transitionRelationshipStatus(
          state,
          intention.payload.relationshipId,
          intention.payload.status,
          intention.payload.causeKey,
          intention.id,
          configuration,
          at,
        );
        break;
      case "ISSUE_RELATIONSHIP_QUALIFICATION_DETERMINATION":
        resolved = issueFinalRelationshipQualificationDetermination(
          state,
          intention.payload,
          intention.id,
          at,
        );
        break;
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Owner resolver refused the intention.";
    return {
      ...state,
      ownerResolution: {
        intentions: state.ownerResolution.intentions.map((entry) => entry.id === intention.id
          ? { ...entry, status: "REFUSED", resolvedAt: at, resolutionReason: reason }
          : entry),
      },
    };
  }
  const resultRecordIds = generatedResultIds(resolved).filter((id) => !before.has(id));
  return {
    ...resolved,
    ownerResolution: {
      intentions: resolved.ownerResolution.intentions.map((entry) => entry.id === intention.id
        ? { ...entry, status: "RESOLVED", resolvedAt: at, resultRecordIds, resolutionReason: null }
        : entry),
    },
  };
};

/** Administrative owner of the bounded final written qualification determination challenged by I9. */
export const issueFinalRelationshipQualificationDetermination = (
  state: ProgramImplementationState,
  input: {
    readonly id: string;
    readonly relationshipId: string;
    readonly claimantId: string;
    readonly writtenReasons: readonly string[];
    readonly procedureRecordIds: readonly string[];
  },
  sourceIntentionId: string,
  at: string,
): ProgramImplementationState => {
  const relationship = state.intergovernmental.historicalRelationships.find(
    (entry) => entry.id === input.relationshipId,
  );
  const sourceIntention = state.ownerResolution.intentions.find((entry) => entry.id === sourceIntentionId);
  if (
    relationship === undefined || relationship.recipientId !== input.claimantId || input.id.trim().length === 0 ||
    input.writtenReasons.length === 0 || input.writtenReasons.some((reason) => reason.trim().length === 0) ||
    input.procedureRecordIds.some((id) => typeof id !== "string" || id.trim().length === 0) ||
    new Set(input.procedureRecordIds).size !== input.procedureRecordIds.length || !Number.isFinite(Date.parse(at)) ||
    sourceIntention?.kind !== "ISSUE_RELATIONSHIP_QUALIFICATION_DETERMINATION" ||
    sourceIntention.status !== "PENDING" || sourceIntention.targetOwnerId !== relationship.federalInstitutionId ||
    sourceIntention.matterId !== input.id || JSON.stringify(sourceIntention.payload) !== JSON.stringify(input)
  ) throw new Error("Final relationship qualification determination lacks its bounded relationship or written record.");
  if (state.administrativeProgram.relationshipQualificationDeterminations.length > 0) {
    throw new Error("The bounded relationship qualification determination already exists.");
  }
  if (state.fiscalExecution.generatedAwards.some((award) => award.recipientId === relationship.recipientId)) {
    throw new Error("The bounded prospective requalification route must occur before a generated recipient award.");
  }
  const determination: RelationshipQualificationDeterminationRecord = {
    id: input.id,
    relationshipId: input.relationshipId,
    claimantId: input.claimantId,
    institutionId: relationship.federalInstitutionId,
    outcome: "REQUALIFICATION_REJECTED",
    formulaDisposition: "DIRECTED_OUT_OF_RELATIONSHIP_PENDING_EXECUTION",
    finalAgencyAction: true,
    prospectiveOnly: true,
    moneyDamagesGranted: false,
    writtenReasons: [...input.writtenReasons],
    procedureRecordIds: [...input.procedureRecordIds],
    issuedAt: at,
    classification: "SIMULATION_GENERATED",
    sourceIntentionId,
  };
  return {
    ...state,
    administrativeProgram: {
      ...state.administrativeProgram,
      relationshipQualificationDeterminations: [determination],
    },
  };
};

/** Implementation-owner intake of an effective, exactly scoped judicial obligation. */
export const recordAdministrativeLegalConstraint = (
  state: ProgramImplementationState,
  input: Omit<AdministrativeLegalConstraintRecord, "classification">,
): ProgramImplementationState => {
  if (state.administrativeProgram.legalConstraints.some((entry) => entry.id === input.id)) return state;
  const determination = state.administrativeProgram.relationshipQualificationDeterminations.find(
    (entry) => entry.id === input.determinationId,
  );
  if (
    determination === undefined || determination.relationshipId !== input.relationshipId ||
    determination.institutionId !== input.targetInstitutionId || input.programId.trim().length === 0 ||
    input.requiredAct.trim().length === 0 || input.prohibitedAct.trim().length === 0
  ) throw new Error("Judicial constraint intake exceeds the challenged administrative act.");
  return {
    ...state,
    administrativeProgram: {
      ...state.administrativeProgram,
      legalConstraints: [...state.administrativeProgram.legalConstraints, {
        ...input,
        classification: "SIMULATION_GENERATED",
      }],
    },
  };
};

export const setAdministrativeLegalConstraintEnforceability = (
  state: ProgramImplementationState,
  sourceOrderId: string,
  enforceability: AdministrativeLegalConstraintRecord["enforceability"],
  causeId: string,
): ProgramImplementationState => {
  if (!state.administrativeProgram.legalConstraints.some((entry) => entry.sourceOrderId === sourceOrderId)) return state;
  return {
    ...state,
    administrativeProgram: {
      ...state.administrativeProgram,
      legalConstraints: state.administrativeProgram.legalConstraints.map((entry) =>
        entry.sourceOrderId === sourceOrderId
          ? { ...entry, enforceability, enforceabilityCauseId: causeId }
          : entry),
    },
  };
};

/** Resolves the challenged future owner action without altering any past or present Housing occurrence. */
export const resolveRelationshipFormulaDisposition = (
  state: ProgramImplementationState,
  input: {
    readonly id: string;
    readonly determinationId: string;
    readonly complianceStateId: string | null;
    readonly complied: boolean;
  },
  at: string,
): ProgramImplementationState => {
  if (state.administrativeProgram.formulaDispositionResolutions.some((entry) => entry.id === input.id)) return state;
  const determination = state.administrativeProgram.relationshipQualificationDeterminations.find(
    (entry) => entry.id === input.determinationId,
  );
  if (determination === undefined) return state;
  const constraint = state.administrativeProgram.legalConstraints.find(
    (entry) => entry.determinationId === determination.id,
  ) ?? null;
  const outcome: RelationshipFormulaDispositionResolutionRecord["outcome"] = constraint === null ||
    constraint.enforceability !== "OPERATIVE"
    ? "EXECUTED_WITHOUT_CONSTRAINT"
    : input.complied
      ? "WITHHELD_BY_COMPLIANCE"
      : "EXECUTED_WHILE_CONTESTED";
  return {
    ...state,
    administrativeProgram: {
      ...state.administrativeProgram,
      formulaDispositionResolutions: [{
        id: input.id,
        determinationId: determination.id,
        legalConstraintId: constraint?.id ?? null,
        complianceStateId: input.complianceStateId,
        outcome,
        resolvedAt: at,
        classification: "SIMULATION_GENERATED",
      }],
    },
  };
};
