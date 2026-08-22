import type { PoliticalClaimOrigin, PoliticalClaimPosition } from "./information";
import type { SimulationInstant } from "./world";

export interface DeterministicRecordIdConfiguration {
  readonly lawPrefix: string;
  readonly programPrefix: string;
  readonly applicationPrefix: string;
  readonly determinationPrefix: string;
  readonly relationshipPrefix: string;
  readonly awardPrefix: string;
  readonly publicFinancePrefix: string;
  readonly obligationPrefix: string;
  readonly disbursementPrefix: string;
  readonly housingProjectPrefix: string;
  readonly housingDeliverySupportPrefix: string;
  readonly implementationDecisionPrefix: string;
  readonly implementationDeploymentPrefix: string;
  readonly informationExposurePrefix: string;
  readonly populationIncorporationPrefix: string;
  readonly executiveJudicialResponsePrefix: string;
  readonly judicialReviewRequestPrefix: string;
}

export interface PoliticalClaimDecisionConfiguration {
  readonly decisionId: string;
  readonly origin: PoliticalClaimOrigin;
  readonly claimPosition: PoliticalClaimPosition;
}

/**
 * Data-only parameters for the currently implemented causal vertical. Values
 * belong to scenario content; generic simulation code only interprets them.
 */
export interface CausalVerticalRuntimeConfiguration {
  readonly recordIds: DeterministicRecordIdConfiguration;
  readonly housingGrant: {
    readonly administrationInstitutionId: string;
    readonly proposalId: string;
    readonly appropriationAmount: number;
    readonly appropriationPurpose: string;
    readonly awardAmount: number;
  };
  readonly housingMaterial: {
    readonly projectRequiredWorkUnits: number;
    readonly projectPlannedHousingUnits: number;
    readonly supportSupplementalWorkUnitsPerDayPerUnit: number;
  };
  readonly implementationResponse: {
    readonly availableAt: SimulationInstant;
    readonly targetStateJurisdictionId: string;
    readonly totalSupportUnits: number;
  };
  readonly politicalClaims: Readonly<{
    ADMINISTRATION: PoliticalClaimDecisionConfiguration;
    OPPOSITION: PoliticalClaimDecisionConfiguration;
  }>;
  readonly disputedAuthority: {
    readonly attemptId: string;
    readonly amount: number;
    readonly availableAt: SimulationInstant;
    readonly claimedLegalBasis: string;
  };
  readonly judiciary: {
    readonly claimantJurisdictionId: string;
    readonly legalClaimId: string;
    readonly legalContestId: string;
    readonly interimReliefRuleId: string;
    readonly interimReliefDecisionId: string;
    readonly interimReliefDecisionSource: string;
    readonly temporaryOrderId: string;
  };
}
