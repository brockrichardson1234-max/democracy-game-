import type { GovernmentConfiguration } from "../../configuration/types";
import { bootstrapGovernmentConfiguration } from "../../configuration/bootstrap";
import { createInitialGovernanceState } from "../../sim/governance";
import {
  GEOGRAPHY_REGION_A_ID,
  GEOGRAPHY_REGION_B_ID,
  GEOGRAPHY_REGION_C_ID,
  createInitialGeographyState,
} from "../../sim/geography";
import {
  createInitialHousingState,
  HOUSING_REGION_A_ID,
  HOUSING_REGION_B_ID,
  HOUSING_REGION_C_ID,
} from "../../sim/housing";
import { STATE_A_ID, STATE_B_ID, STATE_C_ID } from "../../sim/federalism";
import {
  ADMINISTRATION_HOUSING_CLAIM_ID,
  ADMINISTRATION_HOUSING_CLAIM_RELEASE_AT,
  HOUSING_MEASUREMENT_OBSERVATION_END,
  OFFICIAL_HOUSING_REPORT_ID,
  OFFICIAL_HOUSING_REPORT_RELEASE_AT,
  OPPOSITION_HOUSING_CLAIM_ID,
  OPPOSITION_HOUSING_CLAIM_RELEASE_AT,
  PUBLIC_AUDIENCE_ALPHA_ID,
  PUBLIC_AUDIENCE_BETA_ID,
  PUBLIC_AUDIENCE_GAMMA_ID,
  createInitialInformationState,
} from "../../sim/information";
import {
  createInitialPopulationState,
  POPULATION_ELECTORAL_RESPONSE_AT,
} from "../../sim/population";
import {
  createInitialElectoralState,
  GL0_EXECUTIVE_CERTIFICATION_AT,
  GL0_EXECUTIVE_CONTEST_ID,
  GL0_EXECUTIVE_ELECTION_AT,
} from "../../sim/electoral";
import {
  GL0_EXECUTIVE_TRANSFER_AT,
  GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
  GL0_OPPOSITION_EXECUTIVE_ACTOR_ID,
  GL0_SUCCESSOR_ENTITLEMENT_AT,
  GL0_SUCCESSOR_ENTITLEMENT_ID,
} from "../../sim/executive";
import {
  GL0_HOUSING_REDIRECTION_CHALLENGE_AT,
  GL0_HOUSING_REDIRECTION_COMPLIANCE_AT,
  GL0_HOUSING_REDIRECTION_INTERIM_RELIEF_AT,
} from "../../sim/judiciary";
import type { WorldSeed, WorldState } from "../../sim/world";

const geography = createInitialGeographyState();
const governance = createInitialGovernanceState();
const housing = createInitialHousingState({
  stateAId: STATE_A_ID,
  stateBId: STATE_B_ID,
  stateCId: STATE_C_ID,
  geographyRegionAId: GEOGRAPHY_REGION_A_ID,
  geographyRegionBId: GEOGRAPHY_REGION_B_ID,
  geographyRegionCId: GEOGRAPHY_REGION_C_ID,
});

const GL0_WORLD_SEED: WorldSeed = {
  geography,
  governance,
  housing,
  information: createInitialInformationState(housing.regions.map((region) => region.id)),
  population: createInitialPopulationState({
    geographyRegionAId: GEOGRAPHY_REGION_A_ID,
    geographyRegionBId: GEOGRAPHY_REGION_B_ID,
    geographyRegionCId: GEOGRAPHY_REGION_C_ID,
    housingRegionAId: HOUSING_REGION_A_ID,
    housingRegionBId: HOUSING_REGION_B_ID,
    housingRegionCId: HOUSING_REGION_C_ID,
    informationAudienceAlphaId: PUBLIC_AUDIENCE_ALPHA_ID,
    informationAudienceBetaId: PUBLIC_AUDIENCE_BETA_ID,
    informationAudienceGammaId: PUBLIC_AUDIENCE_GAMMA_ID,
  }),
  electoral: createInitialElectoralState({
    geographyRegionIds: [
      GEOGRAPHY_REGION_A_ID,
      GEOGRAPHY_REGION_B_ID,
      GEOGRAPHY_REGION_C_ID,
    ],
    administrationCandidateActorId: GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
    oppositionCandidateActorId: GL0_OPPOSITION_EXECUTIVE_ACTOR_ID,
  }),
};

export const GL0_SYNTHETIC_CONFIGURATION: GovernmentConfiguration<WorldSeed> = {
  identity: {
    configurationId: "gl0-synthetic",
    configurationVersion: "1.0.0",
    scenarioId: "gl0-accepted-causal-vertical",
    scenarioVersion: "1.0.0",
    configurationHash: "5c8047e8bc186e438cdabcb56b43a00e8697a7daebcf25c7e25a0bec732de959",
  },
  capability: "PLAYABLE_CAUSAL_WORLD",
  calendar: { kind: "SYNTHETIC_DAY_NUMBER", epoch: "day-0" },
  structure: {
    legislatureId: "gl0-legislature",
    chambers: [{ id: "gl0-single-chamber", seatCount: 11 }],
    jurisdictionIds: [STATE_A_ID, STATE_B_ID, STATE_C_ID],
  },
  transitions: [
    { id: "gl0-bootstrap", kind: "BOOTSTRAP_BOUNDARY", at: 1, order: 0 },
    {
      id: "gl0-court-challenge",
      kind: "CONTESTED_AUTHORITY_CHALLENGE",
      at: GL0_HOUSING_REDIRECTION_CHALLENGE_AT,
      order: 0,
    },
    {
      id: "gl0-court-interim-relief",
      kind: "CONTESTED_AUTHORITY_INTERIM_RELIEF",
      at: GL0_HOUSING_REDIRECTION_INTERIM_RELIEF_AT,
      order: 0,
    },
    {
      id: "gl0-court-compliance",
      kind: "CONTESTED_AUTHORITY_COMPLIANCE",
      at: GL0_HOUSING_REDIRECTION_COMPLIANCE_AT,
      order: 0,
    },
    {
      id: "gl0-measurement-capture",
      kind: "INFORMATION_BOUNDARY",
      at: HOUSING_MEASUREMENT_OBSERVATION_END,
      order: 0,
    },
    {
      id: "gl0-report-exposure",
      kind: "INFORMATION_ARTIFACT_EXPOSURE",
      at: OFFICIAL_HOUSING_REPORT_RELEASE_AT,
      order: 0,
      artifactId: OFFICIAL_HOUSING_REPORT_ID,
      audienceIds: [PUBLIC_AUDIENCE_ALPHA_ID, PUBLIC_AUDIENCE_BETA_ID],
    },
    {
      id: "gl0-administration-claim",
      kind: "POLITICAL_CLAIM_RELEASE",
      at: ADMINISTRATION_HOUSING_CLAIM_RELEASE_AT,
      order: 0,
      claimKind: "ADMINISTRATION",
      claimArtifactId: ADMINISTRATION_HOUSING_CLAIM_ID,
      sourceArtifactId: OFFICIAL_HOUSING_REPORT_ID,
      audienceIds: [PUBLIC_AUDIENCE_ALPHA_ID, PUBLIC_AUDIENCE_GAMMA_ID],
    },
    {
      id: "gl0-opposition-claim",
      kind: "POLITICAL_CLAIM_RELEASE",
      at: OPPOSITION_HOUSING_CLAIM_RELEASE_AT,
      order: 0,
      claimKind: "OPPOSITION",
      claimArtifactId: OPPOSITION_HOUSING_CLAIM_ID,
      sourceArtifactId: OFFICIAL_HOUSING_REPORT_ID,
      audienceIds: [PUBLIC_AUDIENCE_BETA_ID, PUBLIC_AUDIENCE_GAMMA_ID],
    },
    {
      id: "gl0-population-electoral-response",
      kind: "POPULATION_ELECTORAL_RESPONSE",
      at: POPULATION_ELECTORAL_RESPONSE_AT,
      order: 0,
    },
    {
      id: "gl0-election",
      kind: "ELECTION_RESOLUTION",
      at: GL0_EXECUTIVE_ELECTION_AT,
      order: 0,
      contestId: GL0_EXECUTIVE_CONTEST_ID,
    },
    {
      id: "gl0-certification",
      kind: "ELECTION_CERTIFICATION",
      at: GL0_EXECUTIVE_CERTIFICATION_AT,
      order: 0,
      contestId: GL0_EXECUTIVE_CONTEST_ID,
    },
    {
      id: "gl0-entitlement",
      kind: "SUCCESSOR_ENTITLEMENT",
      at: GL0_SUCCESSOR_ENTITLEMENT_AT,
      order: 0,
      contestId: GL0_EXECUTIVE_CONTEST_ID,
      entitlementId: GL0_SUCCESSOR_ENTITLEMENT_ID,
      transferAt: GL0_EXECUTIVE_TRANSFER_AT,
    },
    {
      id: "gl0-transfer",
      kind: "EXECUTIVE_OFFICE_TRANSFER",
      at: GL0_EXECUTIVE_TRANSFER_AT,
      order: 0,
    },
  ],
  runtimeSeed: GL0_WORLD_SEED,
};

/** Backward-compatible accepted-fixture entry point over production composition. */
export const createDeterministicWorldFixture = (): WorldState => {
  const bootstrap = bootstrapGovernmentConfiguration(GL0_SYNTHETIC_CONFIGURATION);
  if (bootstrap.world === null) throw new Error("Synthetic configuration did not materialize.");
  return bootstrap.world;
};
