import {
  STATE_A_ID,
  STATE_B_ID,
  STATE_C_ID,
  STATE_A_SYNTHETIC_HOUSING_DEMAND_UNITS,
  STATE_B_SYNTHETIC_HOUSING_DEMAND_UNITS,
  STATE_C_SYNTHETIC_HOUSING_DEMAND_UNITS,
  HOUSING_PROJECT_PLANNED_UNITS,
  HOUSING_PROJECT_REQUIRED_WORK_UNITS,
} from "../src/content/gl0-synthetic/configuration";
import { describe, expect, it } from "vitest";

import { createDeterministicWorldFixture } from "../src/content/gl0-synthetic/configuration";

import { createGameSession } from "../src/app/session";

import {
  activateIntergovernmentalHousingGrantParticipation,
  amendHousingGrantProposal,
  createHousingGrantAward,
  disburseHousingGrantObligation,
  establishHousingGrantProgram,
  materializeHousingProjectFromDisbursement,
  obligateHousingGrantAward,
  recognizeHousingGrantFiscalAuthority,
  resolveFederalHousingGrantApplication,
  resolveHousingGrantProposalVote,
  resolveHousingImplementationResponse,
  resolveStateHousingGrantDecision,
  submitHousingGrantProposal,
  submitStateHousingGrantApplication,
} from "../src/sim/governance";
import {
  advanceHousing,
  materializeHousingProject,
  resolveHousingAffordabilityPressure,
} from "../src/sim/housing";
import type { ProposalTerms } from "../src/sim/legislature";
import {
  advanceWorldTo,
  type WorldState,
} from "../src/sim/world";

const INITIAL_TERMS: ProposalTerms = {
  federalMatchRatePercent: 35,
  participationCondition: "strict",
  reportingRequirement: "standard",
};

const COMPROMISE_TERMS: ProposalTerms = {
  federalMatchRatePercent: 55,
  participationCondition: "lenient",
  reportingRequirement: "strengthened",
};

const establishProgram = (): WorldState => {
  let world = createDeterministicWorldFixture();
  world = submitHousingGrantProposal(world, INITIAL_TERMS);
  world = amendHousingGrantProposal(world, COMPROMISE_TERMS);
  world = resolveHousingGrantProposalVote(world);
  world = recognizeHousingGrantFiscalAuthority(world);
  return establishHousingGrantProgram(world);
};

const materializeStateProject = (world: WorldState, stateId: string): WorldState => {
  world = resolveStateHousingGrantDecision(world, stateId);
  world = submitStateHousingGrantApplication(world, stateId);
  world = resolveFederalHousingGrantApplication(world, stateId);
  world = activateIntergovernmentalHousingGrantParticipation(world, stateId);
  world = createHousingGrantAward(world, stateId);
  world = obligateHousingGrantAward(world, stateId);
  world = disburseHousingGrantObligation(world, stateId);
  return materializeHousingProjectFromDisbursement(world, stateId);
};

const createResponseWorld = (): WorldState => {
  let world = establishProgram();
  world = materializeStateProject(world, STATE_A_ID);
  world = materializeStateProject(world, STATE_C_ID);
  return advanceWorldTo(world, 5);
};

const resolveRoute = (
  action: "DEPLOY_SUPPORT" | "PRESERVE_SUPPORT_RESERVE",
): WorldState => resolveHousingImplementationResponse(createResponseWorld(), action);

const regionFor = (world: WorldState, stateId: string) => {
  const region = world.housing.regions.find(
    (candidate) => candidate.stateJurisdictionId === stateId,
  );
  if (region === undefined) throw new Error(`Missing Housing region for ${stateId}.`);
  return region;
};

const affordabilityOccurrences = (world: WorldState) =>
  world.history.filter(
    (occurrence) => occurrence.type === "HousingAffordabilityPressureChanged",
  );

const materialOutcomeHistory = (world: WorldState) =>
  world.history.filter((occurrence) =>
    [
      "HousingProjectStarted",
      "HousingProjectCompleted",
      "HousingStockChanged",
      "HousingAffordabilityPressureChanged",
    ].includes(occurrence.type),
  );

describe("Commit 16 Housing stock to affordability pressure", () => {
  it("1. initializes bounded synthetic Housing demand for all three regions", () => {
    const world = createDeterministicWorldFixture();

    expect(
      [STATE_A_ID, STATE_B_ID, STATE_C_ID].map((stateId) =>
        regionFor(world, stateId).housingDemandUnits,
      ),
    ).toEqual([
      STATE_A_SYNTHETIC_HOUSING_DEMAND_UNITS,
      STATE_B_SYNTHETIC_HOUSING_DEMAND_UNITS,
      STATE_C_SYNTHETIC_HOUSING_DEMAND_UNITS,
    ]);
  });

  it("2. derives each initial pressure from Housing-owned stock and demand", () => {
    const world = createDeterministicWorldFixture();

    expect(
      [STATE_A_ID, STATE_B_ID, STATE_C_ID].map((stateId) => {
        const region = regionFor(world, stateId);
        return {
          stock: region.housingStockUnits,
          demand: region.housingDemandUnits,
          pressure: region.affordabilityPressure,
          resolved: resolveHousingAffordabilityPressure(
            region.housingStockUnits,
            region.housingDemandUnits,
          ),
        };
      }),
    ).toEqual([
      { stock: 1_000, demand: 1_200, pressure: 200, resolved: 200 },
      { stock: 1_000, demand: 1_150, pressure: 150, resolved: 150 },
      { stock: 1_000, demand: 1_250, pressure: 250, resolved: 250 },
    ]);
  });

  it("3. keeps demand and affordability pressure inside Housing, not governance", () => {
    const world = createDeterministicWorldFixture();

    expect(regionFor(world, STATE_A_ID)).toHaveProperty("affordabilityPressure", 200);
    expect(world.governance).not.toHaveProperty("affordabilityPressure");
    expect(world.governance).not.toHaveProperty("housingDemandUnits");
    expect(resolveHousingAffordabilityPressure(1_000, 1_200)).toBe(200);
  });

  it("4. project creation, start, and progress do not improve pressure", () => {
    const created = materializeStateProject(establishProgram(), STATE_A_ID);
    const day9 = advanceWorldTo(created, 9);

    expect(regionFor(created, STATE_A_ID).affordabilityPressure).toBe(200);
    expect(regionFor(day9, STATE_A_ID).affordabilityPressure).toBe(200);
    expect(affordabilityOccurrences(day9)).toHaveLength(0);
  });

  it("5. State A completion changes stock and pressure exactly at day 10", () => {
    const route = resolveRoute("PRESERVE_SUPPORT_RESERVE");
    const day9 = advanceWorldTo(route, 9);
    const day10 = advanceWorldTo(day9, 10);

    expect(regionFor(day9, STATE_A_ID)).toMatchObject({
      housingStockUnits: 1_000,
      affordabilityPressure: 200,
    });
    expect(regionFor(day10, STATE_A_ID)).toMatchObject({
      housingStockUnits: 1_100,
      affordabilityPressure: 100,
    });
    expect(affordabilityOccurrences(day10)).toContainEqual({
      type: "HousingAffordabilityPressureChanged",
      projectId: expect.any(String),
      housingRegionId: regionFor(day10, STATE_A_ID).id,
      previousPressure: 200,
      newPressure: 100,
      at: 10,
    });
  });

  it("6. State C DEPLOY stays at baseline through day 22 and improves at day 23", () => {
    const day22 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 22);
    const day23 = advanceWorldTo(day22, 23);

    expect(regionFor(day22, STATE_C_ID)).toMatchObject({
      housingStockUnits: 1_000,
      affordabilityPressure: 250,
    });
    expect(regionFor(day23, STATE_C_ID)).toMatchObject({
      housingStockUnits: 1_100,
      affordabilityPressure: 150,
    });
    expect(
      affordabilityOccurrences(day23).filter(
        (occurrence) => occurrence.housingRegionId === regionFor(day23, STATE_C_ID).id,
      ),
    ).toHaveLength(1);
  });

  it("7. State C PRESERVE stays at baseline at day 30 and improves at day 50", () => {
    const day30 = advanceWorldTo(resolveRoute("PRESERVE_SUPPORT_RESERVE"), 30);
    const day50 = advanceWorldTo(day30, 50);

    expect(regionFor(day30, STATE_C_ID)).toMatchObject({
      housingStockUnits: 1_000,
      affordabilityPressure: 250,
    });
    expect(regionFor(day50, STATE_C_ID)).toMatchObject({
      housingStockUnits: 1_100,
      affordabilityPressure: 150,
    });
    expect(
      affordabilityOccurrences(day50).find(
        (occurrence) => occurrence.housingRegionId === regionFor(day50, STATE_C_ID).id,
      ),
    ).toMatchObject({ previousPressure: 250, newPressure: 150, at: 50 });
  });

  it("8. DEPLOY and PRESERVE produce different State C material truth at day 30", () => {
    const deployed = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 30);
    const preserved = advanceWorldTo(resolveRoute("PRESERVE_SUPPORT_RESERVE"), 30);

    expect(regionFor(deployed, STATE_C_ID).affordabilityPressure).toBe(150);
    expect(regionFor(preserved, STATE_C_ID).affordabilityPressure).toBe(250);
  });

  it("9. successful delivery leaves positive residual pressure in States A and C", () => {
    const completed = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 30);

    expect(regionFor(completed, STATE_A_ID).affordabilityPressure).toBe(100);
    expect(regionFor(completed, STATE_C_ID).affordabilityPressure).toBe(150);
  });

  it("10. State B refusal leaves its material problem at the Housing baseline", () => {
    let world = resolveStateHousingGrantDecision(createResponseWorld(), STATE_B_ID);
    world = resolveHousingImplementationResponse(world, "DEPLOY_SUPPORT");
    world = advanceWorldTo(world, 60);

    expect(regionFor(world, STATE_B_ID)).toMatchObject({
      housingStockUnits: 1_000,
      housingDemandUnits: 1_150,
      affordabilityPressure: 150,
    });
    expect(
      affordabilityOccurrences(world).some(
        (occurrence) => occurrence.housingRegionId === regionFor(world, STATE_B_ID).id,
      ),
    ).toBe(false);
  });

  it("11. Housing-only advancement reproduces the world result without governance input", () => {
    const route = resolveRoute("DEPLOY_SUPPORT");
    const housingOnly = advanceHousing(route.housing, 5, 30);
    const worldResult = advanceWorldTo(route, 30);

    expect(housingOnly.housing).toEqual(worldResult.housing);
    expect(worldResult.governance).toEqual(route.governance);
  });

  it("12. repeated advancement after completion cannot improve pressure twice", () => {
    const day30 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 30);
    const day100 = advanceWorldTo(advanceWorldTo(day30, 60), 100);

    expect(day100.housing).toEqual(day30.housing);
    expect(affordabilityOccurrences(day100)).toEqual(
      affordabilityOccurrences(day30),
    );
  });

  it("13. coarse and chunked advancement preserve Housing state and material order", () => {
    const route = resolveRoute("DEPLOY_SUPPORT");
    const direct = advanceWorldTo(route, 30);
    const chunked = advanceWorldTo(
      advanceWorldTo(
        advanceWorldTo(advanceWorldTo(route, 10), 22),
        23,
      ),
      30,
    );

    expect(chunked.housing).toEqual(direct.housing);
    expect(materialOutcomeHistory(chunked)).toEqual(materialOutcomeHistory(direct));
  });

  it("14. completion, stock, and pressure occurrences have explicit causal order", () => {
    const world = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 30);

    for (const [stateId, completionAt] of [
      [STATE_A_ID, 10],
      [STATE_C_ID, 23],
    ] as const) {
      expect(
        world.history
          .filter(
            (occurrence) =>
              occurrence.at === completionAt &&
              "housingRegionId" in occurrence &&
              occurrence.housingRegionId === regionFor(world, stateId).id,
          )
          .map((occurrence) => occurrence.type),
      ).toEqual([
        "HousingProjectCompleted",
        "HousingStockChanged",
        "HousingAffordabilityPressureChanged",
      ]);
    }
  });

  it("15. emits no pressure occurrence when added stock cannot reduce zero pressure", () => {
    const fixture = createDeterministicWorldFixture();
    const zeroPressureHousing = {
      ...fixture.housing,
      regions: fixture.housing.regions.map((region) =>
        region.stateJurisdictionId === STATE_A_ID
          ? { ...region, housingDemandUnits: 900, affordabilityPressure: 0 }
          : region,
      ),
    };
    const withProject = materializeHousingProject(
      zeroPressureHousing,
      {
        projectId: "test-affordability-project",
        stateJurisdictionId: STATE_A_ID,
        sourceDisbursementId: "fixture-disbursement",
        requiredWorkUnits: HOUSING_PROJECT_REQUIRED_WORK_UNITS,
        plannedHousingUnits: HOUSING_PROJECT_PLANNED_UNITS,
      },
      0,
    );
    const completed = advanceHousing(withProject, 0, 10);
    const stateA = completed.housing.regions.find(
      (region) => region.stateJurisdictionId === STATE_A_ID,
    )!;

    expect(stateA).toMatchObject({ housingStockUnits: 1_100, affordabilityPressure: 0 });
    expect(
      completed.occurrences.some(
        (occurrence) => occurrence.type === "HousingAffordabilityPressureChanged",
      ),
    ).toBe(false);
  });

  it("16. exposes stock, synthetic demand, and pressure only in the dev projection", () => {
    const view = createGameSession().getView();

    expect(
      view.statePrograms.map((state) => ({
        id: state.id,
        stock: state.housingRegion.housingStockUnits,
        demand: state.housingRegion.housingDemandUnits,
        pressure: state.housingRegion.affordabilityPressure,
      })),
    ).toEqual([
      { id: STATE_A_ID, stock: 1_000, demand: 1_200, pressure: 200 },
      { id: STATE_B_ID, stock: 1_000, demand: 1_150, pressure: 150 },
      { id: STATE_C_ID, stock: 1_000, demand: 1_250, pressure: 250 },
    ]);
  });
});
