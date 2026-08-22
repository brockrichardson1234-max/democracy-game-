import {
  createFederalHousingImplementationSupportState,
  createInitialContestedHousingAdministrationState,
  type AdministrativeInstitution,
} from "../../sim/administration";
import { createElectoralEligibilityLegalOrderState, createElectoralProcedureLegalOrderState } from "../../sim/electoral-law";
import type { ElectoralState } from "../../sim/electoral";
import { createInitialExecutiveAuthorityState } from "../../sim/executive-authority";
import { createExecutiveSuccessionLegalOrderState } from "../../sim/executive-law";
import type { ExecutivePoliticalState } from "../../sim/executive";
import { createStateJurisdictions, createStateProgramAdministrativeStates } from "../../sim/federalism";
import { createInitialPublicFinanceState } from "../../sim/fiscal";
import { createGeographyState } from "../../sim/geography";
import type { GovernanceState } from "../../sim/governance";
import { createHousingState, resolveHousingAffordabilityPressure } from "../../sim/housing";
import { createInformationState } from "../../sim/information";
import { createJudicialLegalOrderState } from "../../sim/judicial-law";
import type { JudiciaryState } from "../../sim/judiciary";
import type { Legislature, LegislatorDecisionCriteria, PoliticalActor } from "../../sim/legislature";
import { createPopulationState, type HousingAttribution } from "../../sim/population";
import type { CausalVerticalRuntimeConfiguration } from "../../sim/runtime-configuration";
import type { WorldSeed } from "../../sim/world";

export interface SyntheticFixtureIdentities {
  readonly namespace: string;
  readonly stateAId: string;
  readonly stateBId: string;
  readonly stateCId: string;
  readonly geographyRegionAId: string;
  readonly geographyRegionBId: string;
  readonly geographyRegionCId: string;
  readonly housingRegionAId: string;
  readonly housingRegionBId: string;
  readonly housingRegionCId: string;
  readonly audienceAlphaId: string;
  readonly audienceBetaId: string;
  readonly audienceGammaId: string;
  readonly populationUnitAId: string;
  readonly populationUnitBId: string;
  readonly populationUnitCId: string;
  readonly administrationInstitutionId: string;
  readonly oppositionClaimActorId: string;
  readonly incumbentExecutiveActorId: string;
  readonly oppositionExecutiveActorId: string;
  readonly executiveInstitutionId: string;
  readonly executiveOfficeId: string;
  readonly successorEntitlementId: string;
  readonly successionRuleId: string;
  readonly eligibilityRuleId: string;
  readonly electionProcedureRuleId: string;
  readonly electoralBoundaryId: string;
  readonly administrationCandidateId: string;
  readonly oppositionCandidateId: string;
  readonly executiveContestId: string;
  readonly electionProcessId: string;
  readonly electionResultId: string;
  readonly electionCertificationId: string;
  readonly measurementId: string;
  readonly reportId: string;
  readonly administrationClaimId: string;
  readonly oppositionClaimId: string;
  readonly judicialInstitutionId: string;
  readonly judicialOfficeId: string;
  readonly judgeActorId: string;
  readonly interimReliefRuleId: string;
  readonly temporaryOrderId: string;
  readonly legalClaimId: string;
  readonly legalContestId: string;
  readonly interimReliefDecisionId: string;
  readonly disputedAttemptId: string;
}

export const GL0_FIXTURE_IDENTITIES: SyntheticFixtureIdentities = {
  namespace: "gl0-",
  stateAId: "state-a",
  stateBId: "state-b",
  stateCId: "state-c",
  geographyRegionAId: "geo-region-a",
  geographyRegionBId: "geo-region-b",
  geographyRegionCId: "geo-region-c",
  housingRegionAId: "housing-region-a",
  housingRegionBId: "housing-region-b",
  housingRegionCId: "housing-region-c",
  audienceAlphaId: "gl0-public-audience-alpha",
  audienceBetaId: "gl0-public-audience-beta",
  audienceGammaId: "gl0-public-audience-gamma",
  populationUnitAId: "gl0-population-unit-a",
  populationUnitBId: "gl0-population-unit-b",
  populationUnitCId: "gl0-population-unit-c",
  administrationInstitutionId: "gl0-federal-housing-administration",
  oppositionClaimActorId: "actor-opposition-1",
  incumbentExecutiveActorId: "gl0-incumbent-executive-actor",
  oppositionExecutiveActorId: "gl0-opposition-executive-actor",
  executiveInstitutionId: "gl0-federal-executive-administration",
  executiveOfficeId: "gl0-executive-office",
  successorEntitlementId: "gl0-successor-entitlement",
  successionRuleId: "gl0-ordinary-executive-succession-rule",
  eligibilityRuleId: "gl0-all-represented-resident-population-eligibility-rule",
  electionProcedureRuleId: "gl0-ordinary-executive-election-procedure-rule",
  electoralBoundaryId: "gl0-executive-electoral-boundary",
  administrationCandidateId: "gl0-administration-candidate",
  oppositionCandidateId: "gl0-opposition-candidate",
  executiveContestId: "gl0-executive-contest",
  electionProcessId: "gl0-executive-election-process",
  electionResultId: "gl0-executive-election-result",
  electionCertificationId: "gl0-executive-election-certification",
  measurementId: "gl0-official-housing-measurement",
  reportId: "gl0-official-housing-report",
  administrationClaimId: "gl0-administration-housing-claim",
  oppositionClaimId: "gl0-opposition-housing-claim",
  judicialInstitutionId: "gl0-generic-judicial-institution",
  judicialOfficeId: "gl0-judicial-office",
  judgeActorId: "gl0-judge-actor",
  interimReliefRuleId: "gl0-interim-housing-redirection-relief-rule",
  temporaryOrderId: "gl0-temporary-housing-redirection-order",
  legalClaimId: "gl0-housing-redirection-legal-claim",
  legalContestId: "gl0-housing-redirection-legal-contest",
  interimReliefDecisionId: "gl0-interim-relief-decision",
  disputedAttemptId: "gl0-disputed-housing-funds-redirection-attempt",
};

export const STATE_A_ID = GL0_FIXTURE_IDENTITIES.stateAId;
export const STATE_B_ID = GL0_FIXTURE_IDENTITIES.stateBId;
export const STATE_C_ID = GL0_FIXTURE_IDENTITIES.stateCId;
export const GEOGRAPHY_REGION_A_ID = GL0_FIXTURE_IDENTITIES.geographyRegionAId;
export const GEOGRAPHY_REGION_B_ID = GL0_FIXTURE_IDENTITIES.geographyRegionBId;
export const GEOGRAPHY_REGION_C_ID = GL0_FIXTURE_IDENTITIES.geographyRegionCId;
export const HOUSING_REGION_A_ID = GL0_FIXTURE_IDENTITIES.housingRegionAId;
export const HOUSING_REGION_B_ID = GL0_FIXTURE_IDENTITIES.housingRegionBId;
export const HOUSING_REGION_C_ID = GL0_FIXTURE_IDENTITIES.housingRegionCId;
export const PUBLIC_AUDIENCE_ALPHA_ID = GL0_FIXTURE_IDENTITIES.audienceAlphaId;
export const PUBLIC_AUDIENCE_BETA_ID = GL0_FIXTURE_IDENTITIES.audienceBetaId;
export const PUBLIC_AUDIENCE_GAMMA_ID = GL0_FIXTURE_IDENTITIES.audienceGammaId;
export const POPULATION_UNIT_A_ID = GL0_FIXTURE_IDENTITIES.populationUnitAId;
export const POPULATION_UNIT_B_ID = GL0_FIXTURE_IDENTITIES.populationUnitBId;
export const POPULATION_UNIT_C_ID = GL0_FIXTURE_IDENTITIES.populationUnitCId;
export const FEDERAL_HOUSING_ADMINISTRATION_INSTITUTION_ID =
  GL0_FIXTURE_IDENTITIES.administrationInstitutionId;
export const HOUSING_GRANT_ADMINISTRATION_ID =
  GL0_FIXTURE_IDENTITIES.executiveInstitutionId;
export const GL0_OPPOSITION_CLAIM_ACTOR_ID = GL0_FIXTURE_IDENTITIES.oppositionClaimActorId;
export const GL0_INCUMBENT_EXECUTIVE_ACTOR_ID =
  GL0_FIXTURE_IDENTITIES.incumbentExecutiveActorId;
export const GL0_OPPOSITION_EXECUTIVE_ACTOR_ID =
  GL0_FIXTURE_IDENTITIES.oppositionExecutiveActorId;
export const GL0_EXECUTIVE_INSTITUTION_ID = GL0_FIXTURE_IDENTITIES.executiveInstitutionId;
export const GL0_EXECUTIVE_OFFICE_ID = GL0_FIXTURE_IDENTITIES.executiveOfficeId;
export const GL0_SUCCESSOR_ENTITLEMENT_ID = GL0_FIXTURE_IDENTITIES.successorEntitlementId;
export const GL0_ORDINARY_EXECUTIVE_SUCCESSION_RULE_ID = GL0_FIXTURE_IDENTITIES.successionRuleId;
export const GL0_ALL_REPRESENTED_RESIDENT_POPULATION_ELIGIBILITY_RULE_ID =
  GL0_FIXTURE_IDENTITIES.eligibilityRuleId;
export const GL0_ORDINARY_EXECUTIVE_ELECTION_PROCEDURE_RULE_ID =
  GL0_FIXTURE_IDENTITIES.electionProcedureRuleId;
export const GL0_EXECUTIVE_ELECTORAL_BOUNDARY_ID = GL0_FIXTURE_IDENTITIES.electoralBoundaryId;
export const GL0_ADMINISTRATION_CANDIDATE_ID = GL0_FIXTURE_IDENTITIES.administrationCandidateId;
export const GL0_OPPOSITION_CANDIDATE_ID = GL0_FIXTURE_IDENTITIES.oppositionCandidateId;
export const GL0_EXECUTIVE_CONTEST_ID = GL0_FIXTURE_IDENTITIES.executiveContestId;
export const GL0_EXECUTIVE_ELECTION_PROCESS_ID = GL0_FIXTURE_IDENTITIES.electionProcessId;
export const GL0_EXECUTIVE_ELECTION_RESULT_ID = GL0_FIXTURE_IDENTITIES.electionResultId;
export const GL0_EXECUTIVE_ELECTION_CERTIFICATION_ID =
  GL0_FIXTURE_IDENTITIES.electionCertificationId;
export const OFFICIAL_HOUSING_MEASUREMENT_ID = GL0_FIXTURE_IDENTITIES.measurementId;
export const OFFICIAL_HOUSING_REPORT_ID = GL0_FIXTURE_IDENTITIES.reportId;
export const ADMINISTRATION_HOUSING_CLAIM_ID = GL0_FIXTURE_IDENTITIES.administrationClaimId;
export const OPPOSITION_HOUSING_CLAIM_ID = GL0_FIXTURE_IDENTITIES.oppositionClaimId;
export const GL0_JUDICIAL_INSTITUTION_ID = GL0_FIXTURE_IDENTITIES.judicialInstitutionId;
export const GL0_JUDICIAL_OFFICE_ID = GL0_FIXTURE_IDENTITIES.judicialOfficeId;
export const GL0_JUDGE_ACTOR_ID = GL0_FIXTURE_IDENTITIES.judgeActorId;
export const GL0_INTERIM_HOUSING_REDIRECTION_RULE_ID =
  GL0_FIXTURE_IDENTITIES.interimReliefRuleId;
export const GL0_TEMPORARY_HOUSING_REDIRECTION_ORDER_ID =
  GL0_FIXTURE_IDENTITIES.temporaryOrderId;
export const GL0_HOUSING_REDIRECTION_LEGAL_CLAIM_ID = GL0_FIXTURE_IDENTITIES.legalClaimId;
export const GL0_HOUSING_REDIRECTION_CONTEST_ID = GL0_FIXTURE_IDENTITIES.legalContestId;
export const GL0_INTERIM_RELIEF_DECISION_ID = GL0_FIXTURE_IDENTITIES.interimReliefDecisionId;
export const GL0_DISPUTED_HOUSING_REDIRECTION_ATTEMPT_ID =
  GL0_FIXTURE_IDENTITIES.disputedAttemptId;

export const INITIAL_HOUSING_STOCK_UNITS = 1_000;
export const STATE_A_SYNTHETIC_HOUSING_DEMAND_UNITS = 1_200;
export const STATE_B_SYNTHETIC_HOUSING_DEMAND_UNITS = 1_150;
export const STATE_C_SYNTHETIC_HOUSING_DEMAND_UNITS = 1_250;
export const STATE_A_CONSTRUCTION_CAPACITY_WORK_UNITS_PER_DAY = 10;
export const STATE_B_CONSTRUCTION_CAPACITY_WORK_UNITS_PER_DAY = 5;
export const STATE_C_CONSTRUCTION_CAPACITY_WORK_UNITS_PER_DAY = 2;
export const HOUSING_PROJECT_REQUIRED_WORK_UNITS = 100;
export const HOUSING_PROJECT_PLANNED_UNITS = 100;
export const HOUSING_SUPPORT_SUPPLEMENTAL_WORK_UNITS_PER_DAY_PER_UNIT = 3;
export const GL0_POPULATION_UNIT_WEIGHT = 100;
export const HOUSING_GRANT_SYNTHETIC_APPROPRIATION_AMOUNT = 5_000_000_000;
export const HOUSING_GRANT_APPROPRIATION_PURPOSE =
  "gl0-housing-construction-grant-program";
export const HOUSING_GRANT_SYNTHETIC_AWARD_AMOUNT = 1_000_000_000;
export const GL0_HOUSING_IMPLEMENTATION_SUPPORT_UNITS = 1;
export const GL0_DISPUTED_HOUSING_REDIRECTION_AMOUNT = 500_000_000;
export const GL0_DISPUTED_HOUSING_CLAIMED_LEGAL_BASIS =
  "EXECUTIVE_DISCRETION_OVER_UNOBLIGATED_HOUSING_FUNDS";
export const HOUSING_MEASUREMENT_OBSERVATION_START = 0;
export const HOUSING_MEASUREMENT_OBSERVATION_END = 30;
export const OFFICIAL_HOUSING_REPORT_RELEASE_AT = 40;
export const ADMINISTRATION_HOUSING_CLAIM_RELEASE_AT = 41;
export const OPPOSITION_HOUSING_CLAIM_RELEASE_AT = 42;
export const POPULATION_ELECTORAL_RESPONSE_AT = 43;
export const GL0_HOUSING_IMPLEMENTATION_RESPONSE_BOUNDARY = 5;
export const GL0_DISPUTED_HOUSING_REDIRECTION_AT = 6;
export const GL0_HOUSING_REDIRECTION_CHALLENGE_AT = 7;
export const GL0_HOUSING_REDIRECTION_INTERIM_RELIEF_AT = 8;
export const GL0_HOUSING_REDIRECTION_COMPLIANCE_AT = 9;
export const GL0_EXECUTIVE_ELECTION_AT = 60;
export const GL0_EXECUTIVE_CERTIFICATION_AT = 61;
export const GL0_SUCCESSOR_ENTITLEMENT_AT = 62;
export const GL0_EXECUTIVE_TRANSFER_AT = 63;

const noAdditionalCriteria: LegislatorDecisionCriteria = {
  minimumFederalMatchRatePercent: null,
  requiredParticipationCondition: null,
  requiredReportingRequirement: null,
};
const requiresLenientParticipation: LegislatorDecisionCriteria = {
  minimumFederalMatchRatePercent: null,
  requiredParticipationCondition: "lenient",
  requiredReportingRequirement: null,
};
const requiresGenerousMatchAndStrongReporting: LegislatorDecisionCriteria = {
  minimumFederalMatchRatePercent: 50,
  requiredParticipationCondition: null,
  requiredReportingRequirement: "strengthened",
};
const unknownAttribution: HousingAttribution = { target: "UNKNOWN", evaluation: "NONE" };

const createLegislature = (identities: SyntheticFixtureIdentities): Legislature => {
  const actor = (
    id: string,
    coalition: PoliticalActor["coalition"],
    decisionCriteria: LegislatorDecisionCriteria,
  ): PoliticalActor => ({ id, coalition, decisionCriteria });
  const actorNamespace = identities === GL0_FIXTURE_IDENTITIES ? "" : identities.namespace;
  const actors = [
    actor(`${actorNamespace}actor-support-1`, "SUPPORT_COALITION", noAdditionalCriteria),
    actor(`${actorNamespace}actor-support-2`, "SUPPORT_COALITION", noAdditionalCriteria),
    actor(`${actorNamespace}actor-support-3`, "SUPPORT_COALITION", noAdditionalCriteria),
    actor(`${actorNamespace}actor-support-4`, "SUPPORT_COALITION", noAdditionalCriteria),
    actor(identities.oppositionClaimActorId, "OPPOSITION_COALITION", requiresLenientParticipation),
    actor(`${actorNamespace}actor-opposition-2`, "OPPOSITION_COALITION", requiresLenientParticipation),
    actor(`${actorNamespace}actor-opposition-3`, "OPPOSITION_COALITION", requiresLenientParticipation),
    actor(`${actorNamespace}actor-opposition-4`, "OPPOSITION_COALITION", requiresLenientParticipation),
    actor(`${actorNamespace}actor-swing-1`, "SWING_COALITION", requiresGenerousMatchAndStrongReporting),
    actor(`${actorNamespace}actor-swing-2`, "SWING_COALITION", requiresGenerousMatchAndStrongReporting),
    actor(`${actorNamespace}actor-swing-3`, "SWING_COALITION", requiresGenerousMatchAndStrongReporting),
  ];
  const seatNamespace = identities === GL0_FIXTURE_IDENTITIES ? "" : identities.namespace;
  const seats = actors.map((_, index) => ({ id: `${seatNamespace}seat-${index + 1}` }));
  return {
    actors,
    seats,
    assignments: seats.map((seat, index) => ({ seatId: seat.id, actorId: actors[index].id })),
  };
};

export const createSyntheticWorldSeed = (
  identities: SyntheticFixtureIdentities = GL0_FIXTURE_IDENTITIES,
): WorldSeed => {
  const recordPrefix = identities.namespace;
  const runtimeConfiguration: CausalVerticalRuntimeConfiguration = {
    recordIds: {
      lawPrefix: `${recordPrefix}law-for-`,
      programPrefix: `${recordPrefix}program-for-`,
      applicationPrefix: `${recordPrefix}application-`,
      determinationPrefix: `${recordPrefix}determination-for-`,
      relationshipPrefix: `${recordPrefix}participation-`,
      awardPrefix: `${recordPrefix}award-`,
      publicFinancePrefix: `${recordPrefix}public-finance-for-`,
      obligationPrefix: `${recordPrefix}obligation-for-`,
      disbursementPrefix: `${recordPrefix}disbursement-for-`,
      housingProjectPrefix: `${recordPrefix}housing-project-for-`,
      housingDeliverySupportPrefix: `${recordPrefix}housing-delivery-support-for-`,
      implementationDecisionPrefix: `${recordPrefix}implementation-response-for-`,
      implementationDeploymentPrefix: `${recordPrefix}implementation-support-for-`,
      informationExposurePrefix: `${recordPrefix}exposure-`,
      populationIncorporationPrefix: `${recordPrefix}incorporation-`,
      executiveJudicialResponsePrefix: `${recordPrefix}executive-judicial-response-for-`,
      judicialReviewRequestPrefix: `${recordPrefix}review-request-for-`,
    },
    housingGrant: {
      administrationInstitutionId: identities.executiveInstitutionId,
      proposalId: `${recordPrefix}housing-grant-proposal`,
      appropriationAmount: HOUSING_GRANT_SYNTHETIC_APPROPRIATION_AMOUNT,
      appropriationPurpose: HOUSING_GRANT_APPROPRIATION_PURPOSE,
      awardAmount: HOUSING_GRANT_SYNTHETIC_AWARD_AMOUNT,
    },
    housingMaterial: {
      projectRequiredWorkUnits: HOUSING_PROJECT_REQUIRED_WORK_UNITS,
      projectPlannedHousingUnits: HOUSING_PROJECT_PLANNED_UNITS,
      supportSupplementalWorkUnitsPerDayPerUnit:
        HOUSING_SUPPORT_SUPPLEMENTAL_WORK_UNITS_PER_DAY_PER_UNIT,
    },
    implementationResponse: {
      availableAt: GL0_HOUSING_IMPLEMENTATION_RESPONSE_BOUNDARY,
      targetStateJurisdictionId: identities.stateCId,
      totalSupportUnits: GL0_HOUSING_IMPLEMENTATION_SUPPORT_UNITS,
    },
    politicalClaims: {
      ADMINISTRATION: {
        decisionId: `${recordPrefix}administration-housing-claim-decision`,
        origin: { originType: "ADMINISTRATION", administrationId: identities.executiveInstitutionId },
        claimPosition: "PROGRAM_WORKING",
      },
      OPPOSITION: {
        decisionId: `${recordPrefix}opposition-housing-claim-decision`,
        origin: { originType: "ACTOR", actorId: identities.oppositionClaimActorId },
        claimPosition: "PROGRAM_INADEQUATE",
      },
    },
    disputedAuthority: {
      attemptId: identities.disputedAttemptId,
      amount: GL0_DISPUTED_HOUSING_REDIRECTION_AMOUNT,
      availableAt: GL0_DISPUTED_HOUSING_REDIRECTION_AT,
      claimedLegalBasis: GL0_DISPUTED_HOUSING_CLAIMED_LEGAL_BASIS,
    },
    judiciary: {
      claimantJurisdictionId: identities.stateAId,
      legalClaimId: identities.legalClaimId,
      legalContestId: identities.legalContestId,
      interimReliefRuleId: identities.interimReliefRuleId,
      interimReliefDecisionId: identities.interimReliefDecisionId,
      interimReliefDecisionSource: "AUTONOMOUS_DETERMINISTIC_FIXTURE",
      temporaryOrderId: identities.temporaryOrderId,
    },
  };

  const administrativeInstitution: AdministrativeInstitution = {
    id: identities.administrationInstitutionId,
  };
  const legislature = createLegislature(identities);
  const executivePolitical: ExecutivePoliticalState = {
    actors: [
      { id: identities.incumbentExecutiveActorId },
      { id: identities.oppositionExecutiveActorId },
    ],
    institution: { id: identities.executiveInstitutionId },
    office: {
      id: identities.executiveOfficeId,
      institutionId: identities.executiveInstitutionId,
      successionRuleId: identities.successionRuleId,
    },
    currentOfficeAssignment: {
      officeId: identities.executiveOfficeId,
      actorId: identities.incumbentExecutiveActorId,
      effectiveAtSimulationTime: 0,
    },
    succession: { successorEntitlement: null, transferResolvedAtSimulationTime: null },
  };
  const judiciary: JudiciaryState = {
    institution: { id: identities.judicialInstitutionId },
    office: { id: identities.judicialOfficeId, institutionId: identities.judicialInstitutionId },
    judgeActor: { id: identities.judgeActorId },
    officeAssignment: {
      officeId: identities.judicialOfficeId,
      actorId: identities.judgeActorId,
      effectiveAtSimulationTime: 0,
    },
    legalClaims: [],
    legalContests: [],
  };
  const stateJurisdictions = createStateJurisdictions([
    { id: identities.stateAId },
    { id: identities.stateBId },
    { id: identities.stateCId },
  ]);
  const governance: GovernanceState = {
    legislature,
    executivePolitical,
    executiveAuthority: createInitialExecutiveAuthorityState(),
    judiciary,
    judicialLegalOrder: createJudicialLegalOrderState([
      {
        id: identities.interimReliefRuleId,
        requirement: "GRANT_DECISION_AUTHORIZES_SCOPED_TEMPORARY_NONEXECUTION_ORDER",
      },
    ]),
    proposal: null,
    procedure: null,
    enactedLaws: [],
    electoralEligibilityLegalOrder: createElectoralEligibilityLegalOrderState([
      {
        id: identities.eligibilityRuleId,
        requirement: "ALL_REPRESENTED_RESIDENT_POPULATION_WITHIN_BOUNDARY_IS_ELIGIBLE",
      },
    ]),
    electoralProcedureLegalOrder: createElectoralProcedureLegalOrderState([
      {
        id: identities.electionProcedureRuleId,
        requirement: "DETERMINISTIC_AGGREGATE_PARTICIPATION_BALLOT_COUNT_AND_CERTIFICATION",
      },
    ]),
    executiveSuccessionLegalOrder: createExecutiveSuccessionLegalOrderState([
      {
        id: identities.successionRuleId,
        requirement:
          "CERTIFIED_NON_TIE_WINNER_ESTABLISHES_ENTITLEMENT_AND_TRANSFERS_AT_CONFIGURED_BOUNDARY",
      },
    ]),
    publicFinance: createInitialPublicFinanceState(),
    fiscalExecution: null,
    administrativeInstitution,
    contestedHousingAdministration: createInitialContestedHousingAdministrationState(),
    housingImplementationSupport: createFederalHousingImplementationSupportState(
      administrativeInstitution,
      GL0_HOUSING_IMPLEMENTATION_SUPPORT_UNITS,
    ),
    housingImplementationResponseDecision: null,
    housingGrantProgram: null,
    stateJurisdictions,
    stateProgramAdministrativeStates: createStateProgramAdministrativeStates([
      { stateJurisdictionId: identities.stateAId, housingGrantDecisionRule: "APPLY", administrativeCapacity: "ADEQUATE" },
      { stateJurisdictionId: identities.stateBId, housingGrantDecisionRule: "REFUSE", administrativeCapacity: "ADEQUATE" },
      { stateJurisdictionId: identities.stateCId, housingGrantDecisionRule: "APPLY", administrativeCapacity: "WEAK" },
    ]),
    stateProgramDecisions: [],
    programApplications: [],
    federalApplicationDeterminations: [],
    intergovernmentalProgramRelationships: [],
    housingGrantAwards: [],
    housingPoliticalClaimDecisions: [],
  };
  const geography = createGeographyState([
    { id: identities.geographyRegionAId },
    { id: identities.geographyRegionBId },
    { id: identities.geographyRegionCId },
  ]);
  const housing = createHousingState([
    {
      id: identities.housingRegionAId,
      geographyRegionId: identities.geographyRegionAId,
      stateJurisdictionId: identities.stateAId,
      constructionCapacityWorkUnitsPerDay: STATE_A_CONSTRUCTION_CAPACITY_WORK_UNITS_PER_DAY,
      housingStockUnits: INITIAL_HOUSING_STOCK_UNITS,
      housingDemandUnits: STATE_A_SYNTHETIC_HOUSING_DEMAND_UNITS,
      affordabilityPressure: resolveHousingAffordabilityPressure(INITIAL_HOUSING_STOCK_UNITS, STATE_A_SYNTHETIC_HOUSING_DEMAND_UNITS),
    },
    {
      id: identities.housingRegionBId,
      geographyRegionId: identities.geographyRegionBId,
      stateJurisdictionId: identities.stateBId,
      constructionCapacityWorkUnitsPerDay: STATE_B_CONSTRUCTION_CAPACITY_WORK_UNITS_PER_DAY,
      housingStockUnits: INITIAL_HOUSING_STOCK_UNITS,
      housingDemandUnits: STATE_B_SYNTHETIC_HOUSING_DEMAND_UNITS,
      affordabilityPressure: resolveHousingAffordabilityPressure(INITIAL_HOUSING_STOCK_UNITS, STATE_B_SYNTHETIC_HOUSING_DEMAND_UNITS),
    },
    {
      id: identities.housingRegionCId,
      geographyRegionId: identities.geographyRegionCId,
      stateJurisdictionId: identities.stateCId,
      constructionCapacityWorkUnitsPerDay: STATE_C_CONSTRUCTION_CAPACITY_WORK_UNITS_PER_DAY,
      housingStockUnits: INITIAL_HOUSING_STOCK_UNITS,
      housingDemandUnits: STATE_C_SYNTHETIC_HOUSING_DEMAND_UNITS,
      affordabilityPressure: resolveHousingAffordabilityPressure(INITIAL_HOUSING_STOCK_UNITS, STATE_C_SYNTHETIC_HOUSING_DEMAND_UNITS),
    },
  ]);
  const information = createInformationState(
    {
      id: identities.measurementId,
      reportArtifactId: identities.reportId,
      housingRegionIds: housing.regions.map((region) => region.id),
      observationStart: HOUSING_MEASUREMENT_OBSERVATION_START,
      observationEnd: HOUSING_MEASUREMENT_OBSERVATION_END,
      scheduledReleaseAtSimulationTime: OFFICIAL_HOUSING_REPORT_RELEASE_AT,
      producerInstitutionId: identities.administrationInstitutionId,
      status: "SCHEDULED",
      capturedAtSimulationTime: null,
      result: null,
    },
    [
      { id: identities.audienceAlphaId, audienceType: "GL0_SYNTHETIC_PUBLIC_DISTRIBUTION_FIXTURE" },
      { id: identities.audienceBetaId, audienceType: "GL0_SYNTHETIC_PUBLIC_DISTRIBUTION_FIXTURE" },
      { id: identities.audienceGammaId, audienceType: "GL0_SYNTHETIC_PUBLIC_DISTRIBUTION_FIXTURE" },
    ],
  );
  const population = createPopulationState([
    {
      id: identities.populationUnitAId,
      weight: GL0_POPULATION_UNIT_WEIGHT,
      residenceGeographyId: identities.geographyRegionAId,
      housingRegionId: identities.housingRegionAId,
      informationAudienceId: identities.audienceGammaId,
      baselinePoliticalDisposition: "SWING",
      housingPressureBelief: "UNKNOWN",
      programPerformanceBelief: "UNKNOWN",
      housingAttribution: unknownAttribution,
      housingSalience: "LOW",
      electoralPreference: "UNRESOLVED",
      turnoutDisposition: "UNRESOLVED",
    },
    {
      id: identities.populationUnitBId,
      weight: GL0_POPULATION_UNIT_WEIGHT,
      residenceGeographyId: identities.geographyRegionBId,
      housingRegionId: identities.housingRegionBId,
      informationAudienceId: identities.audienceBetaId,
      baselinePoliticalDisposition: "OPPOSITION_LEAN",
      housingPressureBelief: "UNKNOWN",
      programPerformanceBelief: "UNKNOWN",
      housingAttribution: unknownAttribution,
      housingSalience: "LOW",
      electoralPreference: "UNRESOLVED",
      turnoutDisposition: "UNRESOLVED",
    },
    {
      id: identities.populationUnitCId,
      weight: GL0_POPULATION_UNIT_WEIGHT,
      residenceGeographyId: identities.geographyRegionCId,
      housingRegionId: identities.housingRegionCId,
      informationAudienceId: identities.audienceAlphaId,
      baselinePoliticalDisposition: "ADMINISTRATION_LEAN",
      housingPressureBelief: "UNKNOWN",
      programPerformanceBelief: "UNKNOWN",
      housingAttribution: unknownAttribution,
      housingSalience: "LOW",
      electoralPreference: "UNRESOLVED",
      turnoutDisposition: "UNRESOLVED",
    },
  ]);
  const electoral: ElectoralState = {
    boundaries: [{ id: identities.electoralBoundaryId, geographyRegionIds: geography.regions.map((region) => region.id) }],
    candidates: [
      { id: identities.administrationCandidateId, actorId: identities.incumbentExecutiveActorId, alignment: "ADMINISTRATION" },
      { id: identities.oppositionCandidateId, actorId: identities.oppositionExecutiveActorId, alignment: "OPPOSITION" },
    ],
    contests: [
      {
        id: identities.executiveContestId,
        boundaryId: identities.electoralBoundaryId,
        scheduledElectionAt: GL0_EXECUTIVE_ELECTION_AT,
        candidateIds: [identities.administrationCandidateId, identities.oppositionCandidateId],
        administrationCandidateId: identities.administrationCandidateId,
        oppositionCandidateId: identities.oppositionCandidateId,
        eligibilityRuleId: identities.eligibilityRuleId,
        procedureRuleId: identities.electionProcedureRuleId,
      },
    ],
    electionProcesses: [
      {
        id: identities.electionProcessId,
        contestId: identities.executiveContestId,
        resultId: identities.electionResultId,
        certificationId: identities.electionCertificationId,
        scheduledCertificationAt: GL0_EXECUTIVE_CERTIFICATION_AT,
        status: "SCHEDULED",
        electorateSnapshot: null,
        participationRecords: [],
        ballots: [],
        result: null,
        certification: null,
      },
    ],
  };
  return { runtimeConfiguration, governance, geography, housing, information, population, electoral };
};

/** Compatibility test helper; the deterministic fixture values remain content-owned. */
export const createDeterministicStateProgramAdministrativeStates = () =>
  createSyntheticWorldSeed().governance.stateProgramAdministrativeStates;
