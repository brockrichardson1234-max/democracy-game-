import { bootstrapGovernmentConfiguration } from "../../configuration/bootstrap";
import type {
  ConfigurationIdentity,
  GovernmentConfiguration,
  GovernmentStructureDescriptor,
  ScheduledTransitionDescriptor,
} from "../../configuration/types";
import type { WorldSeed, WorldState } from "../../sim/world";
import {
  ADMINISTRATION_HOUSING_CLAIM_RELEASE_AT,
  GL0_EXECUTIVE_CERTIFICATION_AT,
  GL0_EXECUTIVE_ELECTION_AT,
  GL0_EXECUTIVE_TRANSFER_AT,
  GL0_COURT_ROUTE_CONTENT,
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
  type SyntheticCourtRouteContent,
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

const createSyntheticStructure = (
  identities: SyntheticFixtureIdentities,
): GovernmentStructureDescriptor => {
  const contentPrefix = identities === GL0_FIXTURE_IDENTITIES ? "gl0-" : identities.namespace;
  const actorPrefix = identities === GL0_FIXTURE_IDENTITIES ? "" : identities.namespace;
  const actorIds = [
    `${actorPrefix}actor-support-1`,
    `${actorPrefix}actor-support-2`,
    `${actorPrefix}actor-support-3`,
    `${actorPrefix}actor-support-4`,
    identities.oppositionClaimActorId,
    `${actorPrefix}actor-opposition-2`,
    `${actorPrefix}actor-opposition-3`,
    `${actorPrefix}actor-opposition-4`,
    `${actorPrefix}actor-swing-1`,
    `${actorPrefix}actor-swing-2`,
    `${actorPrefix}actor-swing-3`,
  ];
  const seatPrefix = identities === GL0_FIXTURE_IDENTITIES ? "" : identities.namespace;
  const officeIds = actorIds.map((_, index) => `${seatPrefix}seat-${index + 1}`);
  const legislatureId = `${contentPrefix}legislature`;
  const chamberId = `${contentPrefix}single-chamber`;
  const legislatureInstitutionId = `${contentPrefix}legislature-institution`;
  const chamberInstitutionId = `${contentPrefix}single-chamber-institution`;
  const jurisdictionIds = [identities.stateAId, identities.stateBId, identities.stateCId];
  return {
    provenanceArtifacts: [],
    jurisdictions: jurisdictionIds.map((id, index) => ({
      id,
      label: `Synthetic jurisdiction ${index + 1}`,
      kind: "SYNTHETIC_SUBNATIONAL",
      externalIdentifiers: [],
      provenanceArtifactId: null,
    })),
    institutions: [
      {
        id: legislatureInstitutionId,
        label: "Synthetic legislature",
        kind: "LEGISLATURE",
        jurisdictionId: jurisdictionIds[0],
      },
      {
        id: chamberInstitutionId,
        label: "Synthetic chamber",
        kind: "LEGISLATIVE_CHAMBER",
        jurisdictionId: jurisdictionIds[0],
      },
    ],
    legislatures: [
      {
        id: legislatureId,
        label: "Synthetic legislature",
        institutionId: legislatureInstitutionId,
        chamberIds: [chamberId],
      },
    ],
    chambers: [
      {
        id: chamberId,
        label: "Synthetic chamber",
        institutionId: chamberInstitutionId,
        legislatureId,
        seatCount: 11,
      },
    ],
    geographies: [],
    staggerGroups: [],
    offices: officeIds.map((id, index) => ({
      id,
      label: `Synthetic legislative office ${index + 1}`,
      kind: "LEGISLATIVE_MEMBER",
      institutionId: chamberInstitutionId,
      chamberId,
      constituency: { kind: "JURISDICTION", id: jurisdictionIds[index % jurisdictionIds.length] },
      term: {
        duration: { value: GL0_EXECUTIVE_TRANSFER_AT, unit: "SYNTHETIC_DAYS" },
        ordinaryBoundaryAt: `day-${GL0_EXECUTIVE_TRANSFER_AT}`,
        staggerGroupId: null,
      },
    })),
    actors: actorIds.map((id, index) => ({
      id,
      label: `Synthetic legislative actor ${index + 1}`,
      role: "LEGISLATIVE",
      classification: "SYNTHETIC_FIXTURE",
    })),
    assignments: officeIds.map((officeId, index) => ({
      id: `${contentPrefix}topology-assignment-${index + 1}`,
      officeId,
      actorId: actorIds[index],
      effectiveFrom: "day-0",
      effectiveUntil: null,
      currentAtScenarioStart: true,
      classification: "SYNTHETIC_FIXTURE",
    })),
    administrations: [],
    relations: [],
  };
};

export const createSyntheticGovernmentConfiguration = (
  identity: ConfigurationIdentity,
  identities: SyntheticFixtureIdentities = GL0_FIXTURE_IDENTITIES,
  courtRoute: SyntheticCourtRouteContent = GL0_COURT_ROUTE_CONTENT,
): GovernmentConfiguration<WorldSeed> => ({
  identity,
  capability: "PLAYABLE_CAUSAL_WORLD",
  calendar: { kind: "SYNTHETIC_DAY_NUMBER", epoch: "day-0" },
  structure: createSyntheticStructure(identities),
  transitions: createSyntheticTransitionSchedule(identities),
  runtimeSeed: createSyntheticWorldSeed(identities, courtRoute),
});

export const GL0_SYNTHETIC_CONFIGURATION = createSyntheticGovernmentConfiguration({
  configurationId: "gl0-synthetic",
  configurationVersion: "1.0.0",
  scenarioId: "gl0-accepted-causal-vertical",
  scenarioVersion: "1.0.0",
  configurationHash: "55317cc00f4dfa8842a41fbcb3729dddea8689f888a21a4abb6b304b40b4dc1c",
});

/** Backward-compatible accepted-fixture entry point over production composition. */
export const createDeterministicWorldFixture = (): WorldState => {
  const bootstrap = bootstrapGovernmentConfiguration(GL0_SYNTHETIC_CONFIGURATION);
  if (bootstrap.world === null) throw new Error("Synthetic configuration did not materialize.");
  return bootstrap.world;
};
