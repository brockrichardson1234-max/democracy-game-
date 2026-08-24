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
}

export interface ObligationRecord {
  readonly id: string;
  readonly awardId: string;
  readonly amount: ExactMoney;
  readonly obligatedAt: string;
  readonly classification: RecordClassification;
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
  readonly memberId: string;
  readonly election: "INCLUDE" | "EXCLUDE";
  readonly newParticipation: "INCLUDED" | "EXCLUDED_FOR_NEW_FORMULA_RELATION";
  readonly formulaScopeChanged: true;
  readonly statewideRefusal: false;
  readonly survivingDuties: readonly string[];
  readonly occurredAt: string;
  readonly classification: "SIMULATION_GENERATED";
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
  readonly requestId: string;
  readonly institutionId: string;
  readonly intention: WaiverIntention;
  readonly outcome: "SCOPED_WAIVER_GRANTED" | "DENIED" | "RETURNED_FOR_RECORD";
  readonly scope: string;
  readonly decidedAt: string;
  readonly classification: "SIMULATION_GENERATED";
  readonly physicalHousingEffect: null;
}

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
}

export interface RecipientActivityRecord {
  readonly id: string;
  readonly commitmentId: string;
  readonly setupAt: string;
  readonly status: "SET_UP";
  readonly classification: "SIMULATION_GENERATED";
}

export interface RecipientDrawRequestRecord {
  readonly id: string;
  readonly activityId: string;
  readonly amount: ExactMoney;
  readonly requestedAt: string;
  readonly status: "ELIGIBLE_PENDING_PAYMENT" | "PAID";
  readonly classification: "SIMULATION_GENERATED";
}

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
  unique(controls.map((entry) => entry.id), "Fiscal controls");
  unique(payments.map((entry) => entry.id), "Payments");
  unique(allocations.map((entry) => entry.id), "Program allocations");
  unique(awards.map((entry) => entry.id), "Awards");
  unique(obligations.map((entry) => entry.id), "Obligations");
  unique(state.administrativeProgram.waiverRequests.map((entry) => entry.id), "Waiver requests");
  unique(state.administrativeProgram.determinations.map((entry) => entry.id), "Administrative determinations");
  unique(state.intergovernmental.transitions.map((entry) => entry.id), "Relationship transitions");
  unique(state.recipientAdministration.commitments.map((entry) => entry.id), "Recipient commitments");
  unique(state.recipientAdministration.activities.map((entry) => entry.id), "Recipient activities");
  unique(state.recipientAdministration.drawRequests.map((entry) => entry.id), "Recipient draw requests");
  unique(state.materialInputs.map((entry) => entry.id), "Material inputs");
  unique(state.administrativeProgram.dynamicBoundaries.map((entry) => entry.id), "Administrative boundaries");
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
  for (const control of state.fiscalExecution.generatedControls) {
    const authority = state.publicFinance.generatedBudgetAuthorities.find((entry) => entry.id === control.sourceBudgetAuthorityId);
    const detailedAwardTotal = state.fiscalExecution.generatedAwards
      .filter((entry) => entry.sourceFiscalControlId === control.id)
      .reduce((total, entry) => total + entry.amount.minorUnits, 0);
    if (
      authority === undefined || authority.status !== "APPORTIONED" ||
      control.amount.minorUnits !== authority.amount.minorUnits || control.ruleProfile === null ||
      detailedAwardTotal >= control.amount.minorUnits
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
    if (
      award === undefined || allocation === undefined || control === undefined ||
      award.recipientId !== allocation.recipientId ||
      obligation.amount.minorUnits !== award.amount.minorUnits ||
      award.amount.minorUnits !== allocation.amount.minorUnits ||
      award.amount.minorUnits > control.amount.minorUnits
    ) throw new Error(`Generated obligation ${obligation.id} lacks its allocation, award, or fiscal control chain.`);
  }
  for (const result of state.intergovernmental.transitions) {
    const relationship = state.intergovernmental.historicalRelationships.find((entry) => entry.id === result.relationshipId);
    if (
      relationship === undefined || !relationship.members.some((member) => member.id === result.memberId) ||
      result.statewideRefusal !== false || JSON.stringify(result.survivingDuties) !== JSON.stringify(relationship.survivingDuties)
    ) throw new Error(`Relationship transition ${result.id} exceeds its bounded owner.`);
  }
  for (const request of state.administrativeProgram.waiverRequests) {
    if (request.classification !== "SIMULATION_GENERATED" || request.responsibleInstitutionId !== configuration.futureWaiver.responsibleInstitutionId) {
      throw new Error(`Future waiver request ${request.id} has invalid provenance or owner.`);
    }
  }
  for (const determination of state.administrativeProgram.determinations) {
    const request = state.administrativeProgram.waiverRequests.find((entry) => entry.id === determination.requestId);
    const expectedOutcome = determination.intention === "GRANT_SCOPED_WAIVER"
      ? "SCOPED_WAIVER_GRANTED"
      : determination.intention === "DENY" ? "DENIED" : "RETURNED_FOR_RECORD";
    if (
      request === undefined || determination.physicalHousingEffect !== null ||
      determination.institutionId !== configuration.futureWaiver.responsibleInstitutionId ||
      determination.outcome !== expectedOutcome || determination.scope !== request.inputComponent ||
      determination.classification !== "SIMULATION_GENERATED" ||
      determination.id !== `${configuration.futureWaiver.determinationIdPrefix}${sha256Hex(`${request.id}|${determination.intention}|${determination.decidedAt}`).slice(0, 20)}`
    ) {
      throw new Error(`Administrative determination ${determination.id} lacks its request or mutates Housing.`);
    }
  }
  for (const commitment of state.recipientAdministration.commitments) {
    const relationship = state.intergovernmental.historicalRelationships.find((entry) => entry.id === commitment.relationshipId);
    const obligation = state.fiscalExecution.generatedObligations.find((entry) => entry.id === commitment.sourceObligationId);
    const control = state.fiscalExecution.generatedControls.find((entry) => entry.id === commitment.sourceFiscalControlId);
    if (
      relationship?.recipientId !== commitment.recipientId || obligation === undefined || control === undefined ||
      commitment.amount.minorUnits <= 0 || commitment.amount.minorUnits > obligation.amount.minorUnits ||
      commitment.writtenAgreementRef.trim().length === 0 || commitment.environmentalClearanceRef.trim().length === 0
    ) throw new Error(`Recipient commitment ${commitment.id} lacks its lawful relationship and fiscal chain.`);
  }
  for (const activity of state.recipientAdministration.activities) {
    if (!state.recipientAdministration.commitments.some((entry) => entry.id === activity.commitmentId)) {
      throw new Error(`Recipient activity ${activity.id} lacks its commitment.`);
    }
  }
  for (const draw of state.recipientAdministration.drawRequests) {
    const activity = state.recipientAdministration.activities.find((entry) => entry.id === draw.activityId);
    const commitment = state.recipientAdministration.commitments.find((entry) => entry.id === activity?.commitmentId);
    if (commitment === undefined || draw.amount.minorUnits <= 0 || draw.amount.minorUnits > commitment.amount.minorUnits) {
      throw new Error(`Recipient draw ${draw.id} lacks activity or exceeds commitment.`);
    }
    const payment = state.fiscalExecution.generatedPayments.find((entry) => entry.drawRequestId === draw.id);
    if ((draw.status === "PAID") !== (payment !== undefined) || (payment !== undefined && payment.amount.minorUnits !== draw.amount.minorUnits)) {
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
  if (state.materialInputs.some((entry) => entry.physicalHousingMutation !== false)) {
    throw new Error("I7-facing input records cannot mutate Housing.");
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
    availableUntil: null,
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
): ProgramImplementationState => {
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
  configuration: IntegratedImplementationConfiguration,
  at: string,
): ProgramImplementationState => {
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
    amount: { ...authority.amount, ownerId: configuration.fiscalControllerInstitutionId },
    scope: "BOUNDED_DETAIL_SCAFFOLD_UNINSTANTIATED_NATIONAL_EXECUTION_REMAINS_OUTSIDE_DETAIL",
    ruleProfile: copy(authority.operativeRuleProfile),
    classification: "SIMULATION_GENERATED",
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
  readonly recipientId: string;
  readonly amountMinorUnits: number;
  readonly agreementRef: string;
  readonly causeKey: string;
}

/** One admitted award event yields separate program-allocation, award, and obligation facts. */
export const establishBoundedRecipientAward = (
  state: ProgramImplementationState,
  request: BoundedRecipientAwardRequest,
  configuration: IntegratedImplementationConfiguration,
  at: string,
): ProgramImplementationState => {
  const control = state.fiscalExecution.generatedControls.find((entry) => entry.id === request.sourceFiscalControlId);
  const relationship = state.intergovernmental.historicalRelationships.find((entry) => entry.id === request.relationshipId);
  const priorDetailedAmount = state.fiscalExecution.generatedAwards
    .filter((entry) => entry.sourceFiscalControlId === request.sourceFiscalControlId)
    .reduce((total, entry) => total + entry.amount.minorUnits, 0);
  if (
    control === undefined || relationship?.recipientId !== request.recipientId ||
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
    amount: { ...amount, purpose: "Bounded program allocation; national detail remains uninstantiated", ownerId: configuration.programId },
    classification: "SIMULATION_GENERATED",
  };
  const award: AwardRecord = {
    id: `${configuration.recordIds.awardPrefix}${sha256Hex(eventId).slice(0, 20)}`,
    fain: `SIMULATION-GENERATED-${sha256Hex(eventId).slice(0, 12)}`,
    sourceAwardEventId: eventId,
    sourceFiscalControlId: control.id,
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
    amount: { ...amount, purpose: "Federal obligation under generated award", ownerId: configuration.fiscalControllerInstitutionId },
    obligatedAt: at,
    classification: "SIMULATION_GENERATED",
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
): MaterialInputRecord => ({
  id,
  kind,
  sourceOwnerId,
  sourceRecordId,
  projectRef,
  validatedAt: at,
  classification: "SIMULATION_GENERATED",
  physicalHousingMutation: false,
});

export const establishRecipientCommitment = (
  state: ProgramImplementationState,
  request: RecipientCommitmentRequest,
  configuration: IntegratedImplementationConfiguration,
  at: string,
): ProgramImplementationState => {
  const relationship = state.intergovernmental.historicalRelationships.find((entry) => entry.id === request.relationshipId);
  const obligation = state.fiscalExecution.generatedObligations.find((entry) => entry.id === request.sourceObligationId);
  const award = state.fiscalExecution.generatedAwards.find((entry) => entry.id === obligation?.awardId);
  const control = state.fiscalExecution.generatedControls.find((entry) => entry.id === award?.sourceFiscalControlId);
  if (
    relationship === undefined || relationship.recipientId !== request.recipientId ||
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
  configuration: IntegratedImplementationConfiguration,
  at: string,
): ProgramImplementationState => {
  const commitment = state.recipientAdministration.commitments.find((entry) => entry.id === commitmentId);
  if (commitment === undefined) throw new Error(`Recipient activity requires commitment ${commitmentId}.`);
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
  configuration: IntegratedImplementationConfiguration,
  at: string,
): ProgramImplementationState => {
  const activity = state.recipientAdministration.activities.find((entry) => entry.id === activityId);
  const commitment = activity === undefined ? undefined : state.recipientAdministration.commitments.find((entry) => entry.id === activity.commitmentId);
  if (activity === undefined || commitment === undefined) throw new Error("Draw request requires a set-up recipient activity.");
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
      }],
    },
  };
};

export const executeEligiblePayment = (
  state: ProgramImplementationState,
  drawRequestId: string,
  configuration: IntegratedImplementationConfiguration,
  at: string,
): ProgramImplementationState => {
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
    amount: { ...draw.amount, purpose: "Federal payment/outlay against eligible recipient draw", ownerId: configuration.fiscalControllerInstitutionId },
    observedAsOf: at,
    projectRef: commitment.projectRef,
    reconciliation: "GENERATED_TRACEABLE_TO_DRAW_REQUEST",
    classification: "SIMULATION_GENERATED",
    drawRequestId: draw.id,
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
  const determinationId = `${configuration.futureWaiver.determinationIdPrefix}${sha256Hex(`${request.id}|${intention}|${at}`).slice(0, 20)}`;
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
    const determination: AdministrativeDeterminationRecord = {
      id: determinationId,
      requestId: request.id,
      institutionId: configuration.futureWaiver.responsibleInstitutionId,
      intention,
      outcome: "RETURNED_FOR_RECORD",
      scope: request.inputComponent,
      decidedAt: at,
      classification: "SIMULATION_GENERATED",
      physicalHousingEffect: null,
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
  const determination: AdministrativeDeterminationRecord = {
    id: determinationId,
    requestId: request.id,
    institutionId: configuration.futureWaiver.responsibleInstitutionId,
    intention,
    outcome: granted ? "SCOPED_WAIVER_GRANTED" : "DENIED",
    scope: request.inputComponent,
    decidedAt: at,
    classification: "SIMULATION_GENERATED",
    physicalHousingEffect: null,
  };
  const kind: MaterialInputKind = granted ? "WAIVER_TERMS" : "COMPLIANCE_HOLD";
  const availabilityKind: MaterialInputKind = granted ? "INPUT_AVAILABILITY" : "COMPLIANCE_HOLD";
  const inputs = [kind, ...(granted ? [availabilityKind] : [])].map((inputKind, index) => materialInput(
    `${configuration.futureWaiver.materialInputIdPrefix}${sha256Hex(`${determination.id}|${inputKind}|${index}`).slice(0, 20)}`,
    inputKind,
    configuration.futureWaiver.responsibleInstitutionId,
    determination.id,
    request.projectRef,
    at,
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
    current = {
      ...current,
      administrativeProgram: {
        ...current.administrativeProgram,
        waiverRequests: current.administrativeProgram.waiverRequests.map((request) =>
          request.id === boundary.ownerId && request.reviewState === "RETURNED_FOR_SUPPLEMENTAL_RECORD"
            ? { ...request, reviewState: "REVIEW_READY" }
            : request),
        dynamicBoundaries: current.administrativeProgram.dynamicBoundaries.map((entry) =>
          entry.id === boundary.id ? { ...entry, processed: true } : entry),
      },
    };
  }
  return current;
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
  configuration: IntegratedImplementationConfiguration,
  at: string,
): ProgramImplementationState => {
  const relationship = state.intergovernmental.historicalRelationships.find((entry) => entry.id === relationshipId);
  if (relationship === undefined || !relationship.members.some((member) => member.id === memberId)) {
    throw new Error("Relationship member election is outside the instantiated relationship.");
  }
  const id = `${configuration.recordIds.relationshipTransitionPrefix}${sha256Hex(`${relationshipId}|${memberId}|${election}|${causeKey}`).slice(0, 20)}`;
  if (state.intergovernmental.transitions.some((entry) => entry.id === id)) return state;
  const transition: RelationshipTransitionRecord = {
    id,
    relationshipId,
    memberId,
    election,
    newParticipation: election === "INCLUDE" ? "INCLUDED" : "EXCLUDED_FOR_NEW_FORMULA_RELATION",
    formulaScopeChanged: true,
    statewideRefusal: false,
    survivingDuties: [...relationship.survivingDuties],
    occurredAt: at,
    classification: "SIMULATION_GENERATED",
  };
  return {
    ...state,
    intergovernmental: {
      ...state.intergovernmental,
      transitions: [...state.intergovernmental.transitions, transition],
    },
  };
};
