import {
  createInitialGovernanceState,
  resolvePoliticalHousingClaimDecision,
  type GovernanceState,
} from "./governance";
import {
  GEOGRAPHY_REGION_A_ID,
  GEOGRAPHY_REGION_B_ID,
  GEOGRAPHY_REGION_C_ID,
  createInitialGeographyState,
  type GeographyState,
} from "./geography";
import {
  advanceHousing,
  createInitialHousingState,
  type HousingState,
} from "./housing";
import type { HistoricalOccurrence } from "./history";
import { STATE_A_ID, STATE_B_ID, STATE_C_ID } from "./federalism";
import {
  HOUSING_MEASUREMENT_OBSERVATION_END,
  ADMINISTRATION_HOUSING_CLAIM_RELEASE_AT,
  OFFICIAL_HOUSING_REPORT_RELEASE_AT,
  OPPOSITION_HOUSING_CLAIM_RELEASE_AT,
  createInitialInformationState,
  resolveInformationBoundary,
  type InformationState,
} from "./information";

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
    history: [],
  };
};

const assertValidTarget = (world: WorldState, target: SimulationInstant): void => {
  if (!Number.isFinite(target)) throw new Error("Simulation target must be finite.");
  if (target < world.time.current) {
    throw new Error("Simulation time cannot advance backwards.");
  }
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
    target,
  ]
    .filter((boundary) => boundary >= world.time.current && boundary <= target)
    .filter((boundary, index, all) => all.indexOf(boundary) === index)
    .sort((left, right) => left - right);

  let cursor = world.time.current;
  let housing = world.housing;
  let information = world.information;
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
      resolvePoliticalHousingClaimDecision(world.governance, boundary),
    );
    information = informationAdvancement.information;
    occurrences.push(...informationAdvancement.occurrences);
    cursor = boundary;
  }

  return {
    ...world,
    time: { current: target },
    housing,
    information,
    history: [...world.history, ...occurrences],
    bootstrapTransition: resolvesBootstrapBoundary
      ? { ...world.bootstrapTransition, resolved: true }
      : world.bootstrapTransition,
  };
};
