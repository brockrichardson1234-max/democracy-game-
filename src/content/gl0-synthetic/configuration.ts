import { bootstrapGovernmentConfiguration } from "../../configuration/bootstrap";
import type {
  ConfigurationIdentity,
  GovernmentConfiguration,
  ScheduledTransitionDescriptor,
} from "../../configuration/types";
import type { WorldSeed, WorldState } from "../../sim/world";
import {
  ADMINISTRATION_HOUSING_CLAIM_RELEASE_AT,
  GL0_EXECUTIVE_CERTIFICATION_AT,
  GL0_EXECUTIVE_ELECTION_AT,
  GL0_EXECUTIVE_TRANSFER_AT,
  GL0_FIXTURE_IDENTITIES,
  GL0_HOUSING_REDIRECTION_CHALLENGE_AT,
  GL0_HOUSING_REDIRECTION_COMPLIANCE_AT,
  GL0_HOUSING_REDIRECTION_INTERIM_RELIEF_AT,
  GL0_SUCCESSOR_ENTITLEMENT_AT,
  HOUSING_MEASUREMENT_OBSERVATION_END,
  OFFICIAL_HOUSING_REPORT_RELEASE_AT,
  OPPOSITION_HOUSING_CLAIM_RELEASE_AT,
  POPULATION_ELECTORAL_RESPONSE_AT,
  createSyntheticWorldSeed,
  type SyntheticFixtureIdentities,
} from "./fixture";

export * from "./fixture";

const transitionId = (identities: SyntheticFixtureIdentities, name: string): string =>
  identities === GL0_FIXTURE_IDENTITIES ? `gl0-${name}` : `${identities.namespace}${name}`;

export const createSyntheticTransitionSchedule = (
  identities: SyntheticFixtureIdentities,
): readonly ScheduledTransitionDescriptor[] => [
  { id: transitionId(identities, "bootstrap"), kind: "BOOTSTRAP_BOUNDARY", at: 1, order: 0 },
  { id: transitionId(identities, "court-challenge"), kind: "CONTESTED_AUTHORITY_CHALLENGE", at: GL0_HOUSING_REDIRECTION_CHALLENGE_AT, order: 0 },
  { id: transitionId(identities, "court-interim-relief"), kind: "CONTESTED_AUTHORITY_INTERIM_RELIEF", at: GL0_HOUSING_REDIRECTION_INTERIM_RELIEF_AT, order: 0 },
  { id: transitionId(identities, "court-compliance"), kind: "CONTESTED_AUTHORITY_COMPLIANCE", at: GL0_HOUSING_REDIRECTION_COMPLIANCE_AT, order: 0 },
  { id: transitionId(identities, "measurement-capture"), kind: "INFORMATION_BOUNDARY", at: HOUSING_MEASUREMENT_OBSERVATION_END, order: 0 },
  {
    id: transitionId(identities, "report-exposure"), kind: "INFORMATION_ARTIFACT_EXPOSURE",
    at: OFFICIAL_HOUSING_REPORT_RELEASE_AT, order: 0, artifactId: identities.reportId,
    audienceIds: [identities.audienceAlphaId, identities.audienceBetaId],
  },
  {
    id: transitionId(identities, "administration-claim"), kind: "POLITICAL_CLAIM_RELEASE",
    at: ADMINISTRATION_HOUSING_CLAIM_RELEASE_AT, order: 0, claimKind: "ADMINISTRATION",
    claimArtifactId: identities.administrationClaimId, sourceArtifactId: identities.reportId,
    audienceIds: [identities.audienceAlphaId, identities.audienceGammaId],
  },
  {
    id: transitionId(identities, "opposition-claim"), kind: "POLITICAL_CLAIM_RELEASE",
    at: OPPOSITION_HOUSING_CLAIM_RELEASE_AT, order: 0, claimKind: "OPPOSITION",
    claimArtifactId: identities.oppositionClaimId, sourceArtifactId: identities.reportId,
    audienceIds: [identities.audienceBetaId, identities.audienceGammaId],
  },
  { id: transitionId(identities, "population-electoral-response"), kind: "POPULATION_ELECTORAL_RESPONSE", at: POPULATION_ELECTORAL_RESPONSE_AT, order: 0 },
  { id: transitionId(identities, "election"), kind: "ELECTION_RESOLUTION", at: GL0_EXECUTIVE_ELECTION_AT, order: 0, contestId: identities.executiveContestId },
  { id: transitionId(identities, "certification"), kind: "ELECTION_CERTIFICATION", at: GL0_EXECUTIVE_CERTIFICATION_AT, order: 0, contestId: identities.executiveContestId },
  {
    id: transitionId(identities, "entitlement"), kind: "SUCCESSOR_ENTITLEMENT",
    at: GL0_SUCCESSOR_ENTITLEMENT_AT, order: 0, contestId: identities.executiveContestId,
    entitlementId: identities.successorEntitlementId, transferAt: GL0_EXECUTIVE_TRANSFER_AT,
  },
  { id: transitionId(identities, "transfer"), kind: "EXECUTIVE_OFFICE_TRANSFER", at: GL0_EXECUTIVE_TRANSFER_AT, order: 0 },
];

export const createSyntheticGovernmentConfiguration = (
  identity: ConfigurationIdentity,
  identities: SyntheticFixtureIdentities = GL0_FIXTURE_IDENTITIES,
): GovernmentConfiguration<WorldSeed> => ({
  identity,
  capability: "PLAYABLE_CAUSAL_WORLD",
  calendar: { kind: "SYNTHETIC_DAY_NUMBER", epoch: "day-0" },
  structure: {
    legislatureId: identities === GL0_FIXTURE_IDENTITIES ? "gl0-legislature" : `${identities.namespace}legislature`,
    chambers: [{ id: identities === GL0_FIXTURE_IDENTITIES ? "gl0-single-chamber" : `${identities.namespace}single-chamber`, seatCount: 11 }],
    jurisdictionIds: [identities.stateAId, identities.stateBId, identities.stateCId],
  },
  transitions: createSyntheticTransitionSchedule(identities),
  runtimeSeed: createSyntheticWorldSeed(identities),
});

export const GL0_SYNTHETIC_CONFIGURATION = createSyntheticGovernmentConfiguration({
  configurationId: "gl0-synthetic",
  configurationVersion: "1.0.0",
  scenarioId: "gl0-accepted-causal-vertical",
  scenarioVersion: "1.0.0",
  configurationHash: "f9e48171af6e2f833a4c0623e6f32bb7094485c8843e600252c580ff1c118180",
});

/** Backward-compatible accepted-fixture entry point over production composition. */
export const createDeterministicWorldFixture = (): WorldState => {
  const bootstrap = bootstrapGovernmentConfiguration(GL0_SYNTHETIC_CONFIGURATION);
  if (bootstrap.world === null) throw new Error("Synthetic configuration did not materialize.");
  return bootstrap.world;
};
