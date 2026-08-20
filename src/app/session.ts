import {
  advanceWorldTo,
  createDeterministicWorldFixture,
  type SimulationInstant,
  type WorldState,
} from "../sim/world";

export interface GameView {
  readonly currentTime: SimulationInstant;
  readonly bootstrapBoundaryResolved: boolean;
  readonly nextKnownBootstrapBoundary: SimulationInstant | null;
}

export interface GameSession {
  getView(): GameView;
  advanceTo(target: SimulationInstant): GameView;
}

const projectWorld = (world: WorldState): GameView => ({
  currentTime: world.time.current,
  bootstrapBoundaryResolved: world.bootstrapTransition.resolved,
  nextKnownBootstrapBoundary: world.bootstrapTransition.resolved
    ? null
    : world.bootstrapTransition.boundaryAt,
});

export const createGameSession = (): GameSession => {
  let world = createDeterministicWorldFixture();

  return {
    getView: () => projectWorld(world),
    advanceTo: (target) => {
      world = advanceWorldTo(world, target);
      return projectWorld(world);
    },
  };
};
