import { describe, expect, it } from "vitest";

import { createDeterministicWorldFixture } from "../src/content/gl0-synthetic/configuration";

import { createGameSession } from "../src/app/session";
import { advanceWorldTo } from "../src/sim/world";

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
    expect(session.getView()).toMatchObject({
      currentTime: 0,
      bootstrapBoundaryResolved: false,
      nextKnownBootstrapBoundary: 1,
      legislative: { proposal: null, enactedLaw: null },
      fiscal: null,
      housingGrantProgram: null,
      statePrograms: [
        {
          id: "state-a",
          capacity: "ADEQUATE",
          housingRegion: {
            id: "housing-region-a",
            geographyRegionId: "geo-region-a",
            constructionCapacityWorkUnitsPerDay: 10,
            housingStockUnits: 1000,
          },
          decision: null,
          applicationId: null,
          federalDetermination: null,
          participation: null,
          award: null,
          obligation: null,
          disbursement: null,
          housingProject: null,
        },
        {
          id: "state-b",
          capacity: "ADEQUATE",
          housingRegion: {
            id: "housing-region-b",
            geographyRegionId: "geo-region-b",
            constructionCapacityWorkUnitsPerDay: 5,
            housingStockUnits: 1000,
          },
          decision: null,
          applicationId: null,
          federalDetermination: null,
          participation: null,
          award: null,
          obligation: null,
          disbursement: null,
          housingProject: null,
        },
        {
          id: "state-c",
          capacity: "WEAK",
          housingRegion: {
            id: "housing-region-c",
            geographyRegionId: "geo-region-c",
            constructionCapacityWorkUnitsPerDay: 2,
            housingStockUnits: 1000,
          },
          decision: null,
          applicationId: null,
          federalDetermination: null,
          participation: null,
          award: null,
          obligation: null,
          disbursement: null,
          housingProject: null,
        },
      ],
    });

    expect(session.advanceTo(1).bootstrapBoundaryResolved).toBe(true);
  });
});
