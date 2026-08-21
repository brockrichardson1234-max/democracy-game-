import {
  createInitialGovernanceState,
  originateHousingPoliticalClaimDecision,
  type GovernanceState,
  type HousingPoliticalClaimDecisionKind,
} from "./governance";
import {
  GEOGRAPHY_REGION_A_ID,
  GEOGRAPHY_REGION_B_ID,
  GEOGRAPHY_REGION_C_ID,
  createInitialGeographyState,
  type GeographyState,
} from "./geography";
import {
  createInitialElectoralState,
  type ElectoralState,
} from "./electoral";
import {
  advanceHousing,
  createInitialHousingState,
  HOUSING_REGION_A_ID,
  HOUSING_REGION_B_ID,
  HOUSING_REGION_C_ID,
  type HousingState,
} from "./housing";
import type { HistoricalOccurrence } from "./history";
import { STATE_A_ID, STATE_B_ID, STATE_C_ID } from "./federalism";
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
  exposeInformationArtifact,
  releasePoliticalClaim,
  resolveInformationBoundary,
  type InformationExposure,
  type InformationState,
} from "./information";
import {
  createInitialPopulationState,
  incorporateInformationExposure,
  POPULATION_ELECTORAL_RESPONSE_AT,
  resolvePopulationElectoralDisposition,
  type PopulationState,
} from "./population";

export type SimulationInstant = number;

export interface TimeState {
  readonly current: SimulationInstant;
}

export interface BootstrapTransitionState {
  readonly boundaryAt: SimulationInstant;
  readonly resolved: boolean;
}

export interface WorldState {
  readonly time: TimeState;
  readonly bootstrapTransition: BootstrapTransitionState;
  readonly governance: GovernanceState;
  /** Canonical spatial identity root; no jurisdiction, population, or material truth. */
  readonly geography: GeographyState;
  /** MaterialDomains root: Housing's own physical/material truth, a sibling of governance/PoliticalOrder. */
  readonly housing: HousingState;
  /** Canonical measurement process and information artifacts; never Housing truth. */
  readonly information: InformationState;
  /** Canonical aggregate ordinary population and recipient-owned political state. */
  readonly population: PopulationState;
  /** Electoral-process state: contest/rule-ID/boundary references, never copied Population or law. */
  readonly electoral: ElectoralState;
  /** Immutable committed occurrences. Owns only that something happened, never current state. */
  readonly history: readonly HistoricalOccurrence[];
}

const BOOTSTRAP_BOUNDARY: SimulationInstant = 1;

export const createDeterministicWorldFixture = (): WorldState => {
  const geography = createInitialGeographyState();
  const housing = createInitialHousingState({
    stateAId: STATE_A_ID,
    stateBId: STATE_B_ID,
    stateCId: STATE_C_ID,
    geographyRegionAId: GEOGRAPHY_REGION_A_ID,
    geographyRegionBId: GEOGRAPHY_REGION_B_ID,
    geographyRegionCId: GEOGRAPHY_REGION_C_ID,
  });

  return {
    time: { current: 0 },
    bootstrapTransition: {
      boundaryAt: BOOTSTRAP_BOUNDARY,
      resolved: false,
    },
    governance: createInitialGovernanceState(),
    geography,
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
    }),
    history: [],
  };
};

const assertValidTarget = (world: WorldState, target: SimulationInstant): void => {
  if (!Number.isFinite(target)) throw new Error("Simulation target must be finite.");
  if (target < world.time.current) {
    throw new Error("Simulation time cannot advance backwards.");
  }
};

const exposeArtifactToFixtureAudiences = (
  information: InformationState,
  artifactId: string,
  audienceIds: readonly string[],
  at: SimulationInstant,
): {
  readonly information: InformationState;
  readonly exposures: readonly InformationExposure[];
  readonly occurrences: HistoricalOccurrence[];
} => {
  let nextInformation = information;
  const exposures: InformationExposure[] = [];
  const occurrences: HistoricalOccurrence[] = [];
  for (const audienceId of audienceIds) {
    const exposure = exposeInformationArtifact(nextInformation, artifactId, audienceId, at);
    nextInformation = exposure.information;
    const createdExposure = nextInformation.exposures.find(
      (candidate) => candidate.artifactId === artifactId && candidate.audienceId === audienceId,
    );
    if (createdExposure === undefined) {
      throw new Error(`Information failed to create exposure for ${artifactId} and ${audienceId}.`);
    }
    exposures.push(createdExposure);
    occurrences.push(...exposure.occurrences);
  }
  return { information: nextInformation, exposures, occurrences };
};

const incorporateFixtureExposures = (
  population: PopulationState,
  information: InformationState,
  exposures: readonly InformationExposure[],
  at: SimulationInstant,
): { readonly population: PopulationState; readonly occurrences: HistoricalOccurrence[] } => {
  let nextPopulation = population;
  const occurrences: HistoricalOccurrence[] = [];
  for (const exposure of exposures) {
    const incorporation = incorporateInformationExposure(
      nextPopulation,
      information,
      exposure,
      at,
    );
    nextPopulation = incorporation.population;
    occurrences.push(...incorporation.occurrences);
  }
  return { population: nextPopulation, occurrences };
};

const releaseFixturePoliticalClaim = (
  governance: GovernanceState,
  information: InformationState,
  kind: HousingPoliticalClaimDecisionKind,
  at: SimulationInstant,
): {
  readonly governance: GovernanceState;
  readonly information: InformationState;
  readonly exposures: readonly InformationExposure[];
  readonly occurrences: HistoricalOccurrence[];
} => {
  const sourceReport = information.artifacts.find(
    (artifact) => artifact.id === OFFICIAL_HOUSING_REPORT_ID,
  );
  if (sourceReport === undefined) {
    throw new Error(`${kind} Housing claim requires the released official Housing report.`);
  }

  const decisionResult = originateHousingPoliticalClaimDecision(
    governance,
    kind,
    sourceReport.id,
    at,
  );
  const decision = decisionResult.decision;
  const claimArtifactId =
    kind === "ADMINISTRATION"
      ? ADMINISTRATION_HOUSING_CLAIM_ID
      : OPPOSITION_HOUSING_CLAIM_ID;
  const claimRelease = releasePoliticalClaim(
    information,
    {
      claimArtifactId,
      sourceDecisionId: decision.id,
      origin: decision.origin,
      sourceArtifactIds: decision.sourceArtifactIds,
      federalProgramId: decision.federalProgramId,
      claimPosition: decision.claimPosition,
    },
    at,
  );
  const audienceIds =
    kind === "ADMINISTRATION"
      ? [PUBLIC_AUDIENCE_ALPHA_ID, PUBLIC_AUDIENCE_GAMMA_ID]
      : [PUBLIC_AUDIENCE_BETA_ID, PUBLIC_AUDIENCE_GAMMA_ID];
  const exposure = exposeArtifactToFixtureAudiences(
    claimRelease.information,
    claimArtifactId,
    audienceIds,
    at,
  );

  return {
    governance: decisionResult.governance,
    information: exposure.information,
    exposures: exposure.exposures,
    occurrences: [...claimRelease.occurrences, ...exposure.occurrences],
  };
};

export const advanceWorldTo = (
  world: WorldState,
  target: SimulationInstant,
): WorldState => {
  assertValidTarget(world, target);

  const resolvesBootstrapBoundary =
    !world.bootstrapTransition.resolved &&
    target >= world.bootstrapTransition.boundaryAt;
  const boundaries = [
    HOUSING_MEASUREMENT_OBSERVATION_END,
    OFFICIAL_HOUSING_REPORT_RELEASE_AT,
    ADMINISTRATION_HOUSING_CLAIM_RELEASE_AT,
    OPPOSITION_HOUSING_CLAIM_RELEASE_AT,
    POPULATION_ELECTORAL_RESPONSE_AT,
    target,
  ]
    .filter((boundary) => boundary > world.time.current && boundary <= target)
    .filter((boundary, index, all) => all.indexOf(boundary) === index)
    .sort((left, right) => left - right);

  let cursor = world.time.current;
  let governance = world.governance;
  let housing = world.housing;
  let information = world.information;
  let population = world.population;
  const occurrences: HistoricalOccurrence[] = [];

  for (const boundary of boundaries) {
    const housingAdvancement = advanceHousing(housing, cursor, boundary);
    housing = housingAdvancement.housing;
    occurrences.push(...housingAdvancement.occurrences);

    // Explicit dependency: material state stabilizes before same-boundary capture.
    const informationAdvancement = resolveInformationBoundary(
      information,
      housing,
      boundary,
    );
    information = informationAdvancement.information;
    occurrences.push(...informationAdvancement.occurrences);

    if (boundary === OFFICIAL_HOUSING_REPORT_RELEASE_AT) {
      // Explicit dependency: report release above precedes same-time receipt.
      const reportExposure = exposeArtifactToFixtureAudiences(
        information,
        OFFICIAL_HOUSING_REPORT_ID,
        [PUBLIC_AUDIENCE_ALPHA_ID, PUBLIC_AUDIENCE_BETA_ID],
        boundary,
      );
      information = reportExposure.information;
      occurrences.push(...reportExposure.occurrences);
      const reportIncorporation = incorporateFixtureExposures(
        population,
        information,
        reportExposure.exposures,
        boundary,
      );
      population = reportIncorporation.population;
      occurrences.push(...reportIncorporation.occurrences);
    }

    if (
      governance.housingGrantProgram !== null &&
      (boundary === ADMINISTRATION_HOUSING_CLAIM_RELEASE_AT ||
        boundary === OPPOSITION_HOUSING_CLAIM_RELEASE_AT)
    ) {
      // Political decision -> Information artifact -> same-time exposures.
      const claim = releaseFixturePoliticalClaim(
        governance,
        information,
        boundary === ADMINISTRATION_HOUSING_CLAIM_RELEASE_AT
          ? "ADMINISTRATION"
          : "OPPOSITION",
        boundary,
      );
      governance = claim.governance;
      information = claim.information;
      occurrences.push(...claim.occurrences);
      const claimIncorporation = incorporateFixtureExposures(
        population,
        information,
        claim.exposures,
        boundary,
      );
      population = claimIncorporation.population;
      occurrences.push(...claimIncorporation.occurrences);
    }

    if (boundary === POPULATION_ELECTORAL_RESPONSE_AT) {
      // All supported Information incorporation is already Population-owned by day 43.
      const electoralResponse = resolvePopulationElectoralDisposition(
        population,
        boundary,
      );
      population = electoralResponse.population;
      occurrences.push(...electoralResponse.occurrences);
    }
    cursor = boundary;
  }

  return {
    ...world,
    time: { current: target },
    governance,
    housing,
    information,
    population,
    history: [...world.history, ...occurrences],
    bootstrapTransition: resolvesBootstrapBoundary
      ? { ...world.bootstrapTransition, resolved: true }
      : world.bootstrapTransition,
  };
};
