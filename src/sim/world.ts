import { createInitialGovernanceState, type GovernanceState } from "./governance";
import { createInitialHousingState, type HousingState } from "./housing";
import type { HistoricalOccurrence } from "./history";

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
  /** MaterialDomains root: Housing's own physical/material truth, a sibling of governance/PoliticalOrder. */
  readonly housing: HousingState;
  /** Immutable committed occurrences. Owns only that something happened, never current state. */
  readonly history: readonly HistoricalOccurrence[];
}

const BOOTSTRAP_BOUNDARY: SimulationInstant = 1;

export const createDeterministicWorldFixture = (): WorldState => ({
  time: { current: 0 },
  bootstrapTransition: {
    boundaryAt: BOOTSTRAP_BOUNDARY,
    resolved: false,
  },
  governance: createInitialGovernanceState(),
  housing: createInitialHousingState(),
  history: [],
});

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

  return {
    ...world,
    time: { current: target },
    bootstrapTransition: resolvesBootstrapBoundary
      ? { ...world.bootstrapTransition, resolved: true }
      : world.bootstrapTransition,
  };
};
