import { sha256Hex } from "../../configuration/sha256";
import type { IntegratedImplementationConfiguration } from "../../configuration/types";
import type { ProgramInitializationSeed } from "../../sim/program-implementation";

import i6Artifact from "./i6-artifacts/finance-home-initialization.json";
import i6Manifest from "./i6-artifacts/i6-initialization-manifest.json";

export const US_V0_I6_SEMANTICS_VERSION = "us-v0-public-finance-home-federalism-2";
export const US_V0_I6_FUTURE_WAIVER_VERSION = "us-v0-future-baba-decision-1";
export const US_V0_I6_OWNER_RESOLUTION_VERSION = "us-v0-i6-owner-resolution-1";
export const US_V0_I6_EFFECTIVE_RELATIONSHIP_VERSION = "us-v0-effective-intergovernmental-relationship-1";
export const US_V0_I6_COMPOSITE_SCHEDULE_VERSION = "us-v0-static-dynamic-composite-schedule-1";
export const US_V0_I6_GENERATED_FISCAL_WINDOW_VERSION = "us-v0-generated-fiscal-window-1";

const implementationWithoutHash = {
  schemaVersion: 1,
  initializationArtifactId: i6Manifest.implementation.initializationArtifactId,
  semanticsVersion: US_V0_I6_SEMANTICS_VERSION,
  classification: "APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD" as const,
  fiscalCohortId: "SIMULATION-GENERATED-I3-AUTHORITY",
  currency: "USD",
  currencyScale: 2,
  publicFinanceOwnerId: "us.public-finance",
  fiscalControllerInstitutionId: "us.institution.omb",
  fiscalControlOwnerId: "us.fiscal-execution.omb",
  federalFiscalExecutionOwnerId: "us.fiscal-execution.hud",
  intergovernmentalRelationshipOwnerId: "us.intergovernmental-relationship.home",
  programId: "us.program.hud.home",
  administeringInstitutionId: "us.institution.hud",
  generatedFiscalWindow: {
    semanticVersion: US_V0_I6_GENERATED_FISCAL_WINDOW_VERSION,
    availabilityDurationDays: 1_095,
    classification: "APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD" as const,
  },
  ownerResolution: {
    semanticVersion: US_V0_I6_OWNER_RESOLUTION_VERSION,
    effectiveRelationshipSemanticVersion: US_V0_I6_EFFECTIVE_RELATIONSHIP_VERSION,
    compositeScheduleSemanticVersion: US_V0_I6_COMPOSITE_SCHEDULE_VERSION,
    intentionIdPrefix: "us.implementation-intention.generated.",
  },
  legalTermIds: {
    recipientFlexibility: "recipient-flexibility-class",
    complianceBurden: "compliance-burden-class",
    geographicDistribution: "geographic-distribution-rule",
    administrativeCapacitySupport: "administrative-capacity-support-rule",
  },
  recipientFlexibility: {
    TIGHT_FEDERAL_SPECIFICATION: { discretionClass: "ONE_CONFIGURED_IMPLEMENTATION_OPTION", maximumRecipientOptions: 1 },
    BOUNDED_RECIPIENT_DISCRETION: { discretionClass: "TWO_BOUNDED_IMPLEMENTATION_OPTIONS", maximumRecipientOptions: 2 },
    EXPANDED_RECIPIENT_DISCRETION: { discretionClass: "THREE_BOUNDED_IMPLEMENTATION_OPTIONS", maximumRecipientOptions: 3 },
  },
  complianceBurden: {
    STREAMLINED_CORE_ASSURANCE: {
      burdenClass: "CORE_ASSURANCE",
      requiredRecordTypes: ["WRITTEN_AGREEMENT", "ELIGIBILITY_ASSURANCE"],
      reviewSteps: 1,
    },
    STANDARD_DOCUMENTED_ASSURANCE: {
      burdenClass: "STANDARD_DOCUMENTED_REVIEW",
      requiredRecordTypes: ["WRITTEN_AGREEMENT", "ELIGIBILITY_ASSURANCE", "COST_REVIEW"],
      reviewSteps: 2,
    },
    ENHANCED_AUDIT_AND_REPORTING: {
      burdenClass: "ENHANCED_AUDIT_REVIEW",
      requiredRecordTypes: ["WRITTEN_AGREEMENT", "ELIGIBILITY_ASSURANCE", "COST_REVIEW", "AUDIT_PLAN", "REPORTING_PLAN"],
      reviewSteps: 4,
    },
  },
  geographicDistribution: {
    FORMULA_NEUTRAL: { priorityRule: "FORMULA_NEUTRAL_BOUNDED_DETAIL" },
    BALANCED_REGIONAL_ALLOCATION: { priorityRule: "BALANCED_REGIONAL_PRIORITY_BOUNDED_DETAIL" },
    HIGH_NEED_GEOGRAPHIC_PRIORITY: { priorityRule: "HIGH_NEED_GEOGRAPHIC_PRIORITY_BOUNDED_DETAIL" },
  },
  administrativeCapacitySupport: {
    NO_SEPARATE_CAPACITY_SET_ASIDE: { capacityClass: "BASE_CAPACITY_ONLY", capacityUnits: 1, processingLatencyDays: 30 },
    LIMITED_TECHNICAL_ASSISTANCE: { capacityClass: "LIMITED_CAPACITY_SUPPORT", capacityUnits: 2, processingLatencyDays: 20 },
    DEDICATED_CAPACITY_SUPPORT: { capacityClass: "DEDICATED_CAPACITY_SUPPORT", capacityUnits: 4, processingLatencyDays: 10 },
  },
  futureWaiver: {
    semanticVersion: US_V0_I6_FUTURE_WAIVER_VERSION,
    responsibleInstitutionId: "us.institution.hud",
    requiredSupportingRecordTypes: ["NONAVAILABILITY_RECORD", "TECHNICAL_SPECIFICATION", "SCOPE_JUSTIFICATION"],
    returnReviewDelayDays: 14,
    recordIdPrefix: "us.home.waiver-request.generated.",
    determinationIdPrefix: "us.home.waiver-determination.generated.",
    materialInputIdPrefix: "us.i7-input.waiver.",
  },
  recordIds: {
    budgetAuthorityPrefix: "us.finance.authority.generated.",
    fiscalControlPrefix: "us.fiscal-control.generated.",
    programAllocationPrefix: "us.program-allocation.generated.",
    awardPrefix: "us.award.generated.",
    obligationPrefix: "us.obligation.generated.",
    relationshipTransitionPrefix: "us.relationship-transition.generated.",
    recipientCommitmentPrefix: "us.recipient-commitment.generated.",
    recipientActivityPrefix: "us.recipient-activity.generated.",
    drawRequestPrefix: "us.draw-request.generated.",
    paymentPrefix: "us.payment.generated.",
    materialInputPrefix: "us.i7-input.generated.",
  },
};

export const US_V0_I6_IMPLEMENTATION_CONFIGURATION: IntegratedImplementationConfiguration = {
  ...implementationWithoutHash,
  parameterHash: sha256Hex(JSON.stringify(implementationWithoutHash)),
};

export const US_V0_I6_INITIALIZATION_SEED = i6Artifact as unknown as ProgramInitializationSeed;
export const US_V0_I6_ARTIFACT_BINDING = i6Manifest.artifactBindings[0];
