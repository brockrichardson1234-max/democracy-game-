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
}

const BOOTSTRAP_BOUNDARY: SimulationInstant = 1;

export const createDeterministicWorldFixture = (): WorldState => ({
  time: { current: 0 },
  bootstrapTransition: {
    boundaryAt: BOOTSTRAP_BOUNDARY,
    resolved: false,
  },
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
    time: { current: target },
    bootstrapTransition: resolvesBootstrapBoundary
      ? { ...world.bootstrapTransition, resolved: true }
      : world.bootstrapTransition,
  };
};
