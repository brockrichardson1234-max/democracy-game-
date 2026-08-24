import { sha256Hex } from "../../configuration/sha256";
import type { IntegratedImplementationConfiguration } from "../../configuration/types";
import type { IntegratedRuntimeArtifactBundle } from "../../sim/integrated-runtime";

import i6Artifact from "./i6-artifacts/finance-home-initialization.json";
import i6Manifest from "./i6-artifacts/i6-initialization-manifest.json";
import { US_V0_I4_RUNTIME_ARTIFACTS } from "./i4";
import { US_HUD_INSTITUTION_ID } from "./topology";

export const US_V0_I6_SEMANTICS_VERSION = "us-v0-public-finance-home-federalism-1";
export const US_V0_I6_FUTURE_WAIVER_VERSION = "us-v0-future-baba-decision-1";

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
  programId: "us.program.hud.home",
  administeringInstitutionId: US_HUD_INSTITUTION_ID,
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
    responsibleInstitutionId: US_HUD_INSTITUTION_ID,
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

/** One offline bundle composes accepted I4 initialization with authenticated I6 seeds. */
export const US_V0_I6_RUNTIME_ARTIFACTS = {
  ...US_V0_I4_RUNTIME_ARTIFACTS,
  programInitialization: i6Artifact,
} as unknown as IntegratedRuntimeArtifactBundle;

export const US_V0_I6_ARTIFACT_BINDING = i6Manifest.artifactBindings[0];
