import { describe, expect, it } from "vitest";

import { createGameSession } from "../src/app/session";
import { advanceWorldTo, createDeterministicWorldFixture } from "../src/sim/world";

describe("Commit 8 headless bootstrap", () => {
  it("initializes deterministic canonical time and a pending transition", () => {
    const world = createDeterministicWorldFixture();
    expect(world.time.current).toBe(0);
    expect(world.bootstrapTransition.resolved).toBe(false);
  });

  it("resolves the first canonical boundary headlessly", () => {
    const world = createDeterministicWorldFixture();
    const advanced = advanceWorldTo(world, 1);

    expect(advanced.time.current).toBe(1);
    expect(advanced.bootstrapTransition.resolved).toBe(true);
    expect(world.bootstrapTransition.resolved).toBe(false);
  });

  it("produces the same result when equivalent advancement is chunked", () => {
    const initial = createDeterministicWorldFixture();
    const direct = advanceWorldTo(initial, 2);
    const chunked = advanceWorldTo(advanceWorldTo(initial, 0.5), 2);

    expect(chunked).toEqual(direct);
  });

  it("rejects backwards simulation time", () => {
    const advanced = advanceWorldTo(createDeterministicWorldFixture(), 1);
    expect(() => advanceWorldTo(advanced, 0)).toThrow(/backwards/);
  });

  it("exposes only an application projection to consumers", () => {
    const session = createGameSession();
    expect(session.getView()).toEqual({
      currentTime: 0,
      bootstrapBoundaryResolved: false,
      nextKnownBootstrapBoundary: 1,
    });

    expect(session.advanceTo(1).bootstrapBoundaryResolved).toBe(true);
  });
});
