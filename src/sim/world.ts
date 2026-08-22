import type {
  ConfigurationIdentity,
  LoadedGovernmentConfiguration,
  ScheduledTransitionDescriptor,
} from "../configuration/types";
import {
  originateHousingPoliticalClaimDecision,
  resolveContestedAuthorityChallengeBoundary,
  resolveContestedAuthorityComplianceBoundary,
  resolveContestedAuthorityInterimReliefBoundary,
  type GovernanceState,
} from "./governance";
import type { GeographyState } from "./geography";
import { certifyElection, resolveElection, type ElectoralState } from "./electoral";
import {
  establishExecutiveSuccessorEntitlement,
  transferExecutiveOffice,
} from "./executive";
import { advanceHousing, type HousingState } from "./housing";
import type { HistoricalOccurrence } from "./history";
import type { CausalVerticalRuntimeConfiguration } from "./runtime-configuration";
import {
  exposeInformationArtifact,
  releasePoliticalClaim,
  resolveInformationBoundary,
  type InformationExposure,
  type InformationState,
} from "./information";
import {
  incorporateInformationExposure,
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

/** Plain canonical state supplied by configuration content, never executable behavior. */
export interface WorldSeed {
  readonly runtimeConfiguration: CausalVerticalRuntimeConfiguration;
  readonly governance: GovernanceState;
  readonly geography: GeographyState;
  readonly housing: HousingState;
  readonly information: InformationState;
  readonly population: PopulationState;
  readonly electoral: ElectoralState;
}

export interface WorldState {
  readonly configuration: ConfigurationIdentity;
  readonly runtimeConfiguration: CausalVerticalRuntimeConfiguration;
  readonly transitionSchedule: readonly ScheduledTransitionDescriptor[];
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

export const createWorldFromConfiguration = (
  configuration: LoadedGovernmentConfiguration<WorldSeed>,
): WorldState => {
  if (configuration.capability !== "PLAYABLE_CAUSAL_WORLD" || configuration.runtimeSeed === null) {
    throw new Error(
      `Configuration ${configuration.identity.configurationId} is structural-proof-only and cannot materialize a playable world.`,
    );
  }
  const bootstrap = configuration.transitions.find(
    (transition) => transition.kind === "BOOTSTRAP_BOUNDARY",
  );
  if (bootstrap === undefined) throw new Error("Playable configuration has no bootstrap boundary.");
  return {
    configuration: { ...configuration.identity },
    runtimeConfiguration: configuration.runtimeSeed.runtimeConfiguration,
    transitionSchedule: configuration.transitions.map((transition) => ({ ...transition })),
    time: { current: 0 },
    bootstrapTransition: { boundaryAt: bootstrap.at, resolved: false },
    governance: configuration.runtimeSeed.governance,
    geography: configuration.runtimeSeed.geography,
    housing: configuration.runtimeSeed.housing,
    information: configuration.runtimeSeed.information,
    population: configuration.runtimeSeed.population,
    electoral: configuration.runtimeSeed.electoral,
    history: [],
  };
};

const assertValidTarget = (world: WorldState, target: SimulationInstant): void => {
  if (!Number.isFinite(target)) throw new Error("Simulation target must be finite.");
  if (target < world.time.current) throw new Error("Simulation time cannot advance backwards.");
};

const exposeArtifactToConfiguredAudiences = (
  information: InformationState,
  exposureIdPrefix: string,
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
    const exposure = exposeInformationArtifact(
      nextInformation,
      `${exposureIdPrefix}${artifactId}-to-${audienceId}`,
      artifactId,
      audienceId,
      at,
    );
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

const incorporateConfiguredExposures = (
  population: PopulationState,
  information: InformationState,
  exposures: readonly InformationExposure[],
  at: SimulationInstant,
  incorporationIdPrefix: string,
): { readonly population: PopulationState; readonly occurrences: HistoricalOccurrence[] } => {
  let nextPopulation = population;
  const occurrences: HistoricalOccurrence[] = [];
  for (const exposure of exposures) {
    const incorporation = incorporateInformationExposure(
      nextPopulation,
      information,
      exposure,
      at,
      incorporationIdPrefix,
    );
    nextPopulation = incorporation.population;
    occurrences.push(...incorporation.occurrences);
  }
  return { population: nextPopulation, occurrences };
};

const releaseConfiguredPoliticalClaim = (
  governance: GovernanceState,
  information: InformationState,
  transition: Extract<ScheduledTransitionDescriptor, { kind: "POLITICAL_CLAIM_RELEASE" }>,
  runtimeConfiguration: CausalVerticalRuntimeConfiguration,
): {
  readonly governance: GovernanceState;
  readonly information: InformationState;
  readonly exposures: readonly InformationExposure[];
  readonly occurrences: readonly HistoricalOccurrence[];
} => {
  const sourceReport = information.artifacts.find(
    (artifact) => artifact.id === transition.sourceArtifactId,
  );
  if (sourceReport === undefined) {
    throw new Error(`${transition.claimKind} claim requires source artifact ${transition.sourceArtifactId}.`);
  }
  const decisionResult = originateHousingPoliticalClaimDecision(
    governance,
    transition.claimKind,
    runtimeConfiguration.politicalClaims[transition.claimKind],
    sourceReport.id,
    transition.at,
    transition.at,
  );
  const decision = decisionResult.decision;
  const claimRelease = releasePoliticalClaim(
    information,
    {
      claimArtifactId: transition.claimArtifactId,
      sourceDecisionId: decision.id,
      origin: decision.origin,
      sourceArtifactIds: decision.sourceArtifactIds,
      federalProgramId: decision.federalProgramId,
      claimPosition: decision.claimPosition,
    },
    transition.at,
  );
  const exposure = exposeArtifactToConfiguredAudiences(
    claimRelease.information,
    runtimeConfiguration.recordIds.informationExposurePrefix,
    transition.claimArtifactId,
    transition.audienceIds,
    transition.at,
  );
  return {
    governance: decisionResult.governance,
    information: exposure.information,
    exposures: exposure.exposures,
    occurrences: [...claimRelease.occurrences, ...exposure.occurrences],
  };
};

const transitionRank = (transition: ScheduledTransitionDescriptor): string =>
  `${transition.order.toString().padStart(8, "0")}:${transition.id}`;

export const advanceWorldTo = (world: WorldState, target: SimulationInstant): WorldState => {
  assertValidTarget(world, target);
  if (target === world.time.current) return world;
  const boundaries = [
    ...world.transitionSchedule
      .filter((transition) => transition.at > world.time.current && transition.at <= target)
      .map((transition) => transition.at),
    target,
  ]
    .filter((boundary, index, all) => all.indexOf(boundary) === index)
    .sort((left, right) => left - right);

  let cursor = world.time.current;
  let governance = world.governance;
  let housing = world.housing;
  let information = world.information;
  let population = world.population;
  let electoral = world.electoral;
  let bootstrapResolved = world.bootstrapTransition.resolved;
  const occurrences: HistoricalOccurrence[] = [];

  for (const boundary of boundaries) {
    const housingAdvancement = advanceHousing(housing, cursor, boundary);
    housing = housingAdvancement.housing;
    occurrences.push(...housingAdvancement.occurrences);

    // Material state stabilizes before same-boundary measurement/release semantics.
    const informationAdvancement = resolveInformationBoundary(information, housing, boundary);
    information = informationAdvancement.information;
    occurrences.push(...informationAdvancement.occurrences);

    const transitions = world.transitionSchedule
      .filter((transition) => transition.at === boundary)
      .sort((left, right) => transitionRank(left).localeCompare(transitionRank(right)));
    for (const transition of transitions) {
      switch (transition.kind) {
        case "BOOTSTRAP_BOUNDARY":
          bootstrapResolved = true;
          break;
        case "INFORMATION_BOUNDARY":
          break;
        case "CONTESTED_AUTHORITY_CHALLENGE":
          if (governance.executiveAuthority.disputedHousingFundsRedirectionAttempts.length > 0) {
            const result = resolveContestedAuthorityChallengeBoundary(
              governance,
              world.runtimeConfiguration,
              boundary,
              transition.at,
            );
            governance = result.governance;
            occurrences.push(...result.occurrences);
          }
          break;
        case "CONTESTED_AUTHORITY_INTERIM_RELIEF":
          if (governance.executiveAuthority.disputedHousingFundsRedirectionAttempts.length > 0) {
            const result = resolveContestedAuthorityInterimReliefBoundary(
              governance,
              world.runtimeConfiguration,
              boundary,
              transition.at,
            );
            governance = result.governance;
            occurrences.push(...result.occurrences);
          }
          break;
        case "CONTESTED_AUTHORITY_COMPLIANCE":
          if (governance.executiveAuthority.disputedHousingFundsRedirectionAttempts.length > 0) {
            const result = resolveContestedAuthorityComplianceBoundary(
              governance,
              world.runtimeConfiguration.judiciary.complianceResponse,
              boundary,
              transition.at,
            );
            governance = result.governance;
            occurrences.push(...result.occurrences);
          }
          break;
        case "INFORMATION_ARTIFACT_EXPOSURE": {
          const result = exposeArtifactToConfiguredAudiences(
            information,
            world.runtimeConfiguration.recordIds.informationExposurePrefix,
            transition.artifactId,
            transition.audienceIds,
            boundary,
          );
          information = result.information;
          occurrences.push(...result.occurrences);
          const incorporation = incorporateConfiguredExposures(
            population,
            information,
            result.exposures,
            boundary,
            world.runtimeConfiguration.recordIds.populationIncorporationPrefix,
          );
          population = incorporation.population;
          occurrences.push(...incorporation.occurrences);
          break;
        }
        case "POLITICAL_CLAIM_RELEASE":
          if (governance.housingGrantProgram !== null) {
            const result = releaseConfiguredPoliticalClaim(
              governance,
              information,
              transition,
              world.runtimeConfiguration,
            );
            governance = result.governance;
            information = result.information;
            occurrences.push(...result.occurrences);
            const incorporation = incorporateConfiguredExposures(
              population,
              information,
              result.exposures,
              boundary,
              world.runtimeConfiguration.recordIds.populationIncorporationPrefix,
            );
            population = incorporation.population;
            occurrences.push(...incorporation.occurrences);
          }
          break;
        case "POPULATION_ELECTORAL_RESPONSE": {
          const result = resolvePopulationElectoralDisposition(
            population,
            boundary,
            transition.at,
          );
          population = result.population;
          occurrences.push(...result.occurrences);
          break;
        }
        case "ELECTION_RESOLUTION": {
          const result = resolveElection(
            electoral,
            population,
            governance.electoralEligibilityLegalOrder,
            governance.electoralProcedureLegalOrder,
            transition.contestId,
            boundary,
          );
          electoral = result.electoral;
          occurrences.push(...result.occurrences);
          break;
        }
        case "ELECTION_CERTIFICATION": {
          const result = certifyElection(
            electoral,
            governance.electoralProcedureLegalOrder,
            transition.contestId,
            boundary,
          );
          electoral = result.electoral;
          occurrences.push(...result.occurrences);
          break;
        }
        case "SUCCESSOR_ENTITLEMENT": {
          const result = establishExecutiveSuccessorEntitlement(
            governance.executivePolitical,
            electoral,
            governance.executiveSuccessionLegalOrder,
            boundary,
            {
              contestId: transition.contestId,
              entitlementId: transition.entitlementId,
              entitlementAt: transition.at,
              transferAt: transition.transferAt,
            },
          );
          governance = { ...governance, executivePolitical: result.executivePolitical };
          occurrences.push(...result.occurrences);
          break;
        }
        case "EXECUTIVE_OFFICE_TRANSFER": {
          const result = transferExecutiveOffice(
            governance.executivePolitical,
            governance.executiveSuccessionLegalOrder,
            boundary,
            transition.at,
          );
          governance = { ...governance, executivePolitical: result.executivePolitical };
          occurrences.push(...result.occurrences);
          break;
        }
      }
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
    electoral,
    history: [...world.history, ...occurrences],
    bootstrapTransition: bootstrapResolved
      ? { ...world.bootstrapTransition, resolved: true }
      : world.bootstrapTransition,
  };
};
