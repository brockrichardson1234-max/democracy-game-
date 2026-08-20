import { createInitialGovernanceState, type GovernanceState } from "./governance";
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
  /** Immutable committed occurrences. Owns only that something happened, never current state. */
  readonly history: readonly HistoricalOccurrence[];
}

const BOOTSTRAP_BOUNDARY: SimulationInstant = 1;

export const createDeterministicWorldFixture = (): WorldState => {
  const geography = createInitialGeographyState();

  return {
    time: { current: 0 },
    bootstrapTransition: {
      boundaryAt: BOOTSTRAP_BOUNDARY,
      resolved: false,
    },
    governance: createInitialGovernanceState(),
    geography,
    housing: createInitialHousingState({
      stateAId: STATE_A_ID,
      stateBId: STATE_B_ID,
      stateCId: STATE_C_ID,
      geographyRegionAId: GEOGRAPHY_REGION_A_ID,
      geographyRegionBId: GEOGRAPHY_REGION_B_ID,
      geographyRegionCId: GEOGRAPHY_REGION_C_ID,
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

export const advanceWorldTo = (
  world: WorldState,
  target: SimulationInstant,
): WorldState => {
  assertValidTarget(world, target);

  const resolvesBootstrapBoundary =
    !world.bootstrapTransition.resolved &&
    target >= world.bootstrapTransition.boundaryAt;
  const housingAdvancement = advanceHousing(
    world.housing,
    world.time.current,
    target,
  );

  return {
    ...world,
    time: { current: target },
    housing: housingAdvancement.housing,
    history: [...world.history, ...housingAdvancement.occurrences],
    bootstrapTransition: resolvesBootstrapBoundary
      ? { ...world.bootstrapTransition, resolved: true }
      : world.bootstrapTransition,
  };
};
