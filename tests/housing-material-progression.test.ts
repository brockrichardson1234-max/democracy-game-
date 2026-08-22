import {
  STATE_A_ID,
  STATE_B_ID,
  STATE_C_ID,
  HOUSING_GRANT_SYNTHETIC_AWARD_AMOUNT,
  HOUSING_PROJECT_PLANNED_UNITS,
  HOUSING_PROJECT_REQUIRED_WORK_UNITS,
  INITIAL_HOUSING_STOCK_UNITS,
  STATE_A_CONSTRUCTION_CAPACITY_WORK_UNITS_PER_DAY,
  STATE_C_CONSTRUCTION_CAPACITY_WORK_UNITS_PER_DAY,
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
  resolveStateHousingGrantDecision,
  submitHousingGrantProposal,
  submitStateHousingGrantApplication,
} from "../src/sim/governance";
import {
  advanceHousing,
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

const materializeParticipatingProjects = (): WorldState => {
  let world = establishProgram();
  world = materializeStateProject(world, STATE_A_ID);
  return materializeStateProject(world, STATE_C_ID);
};

const projectFor = (world: WorldState, stateId: string) => {
  const project = world.housing.projects.find(
    (candidate) => candidate.stateJurisdictionId === stateId,
  );
  if (project === undefined) throw new Error(`Missing Housing project for ${stateId}.`);
  return project;
};

const regionFor = (world: WorldState, stateId: string) => {
  const region = world.housing.regions.find(
    (candidate) => candidate.stateJurisdictionId === stateId,
  );
  if (region === undefined) throw new Error(`Missing Housing region for ${stateId}.`);
  return region;
};

const materialHistory = (world: WorldState) =>
  world.history.filter((occurrence) =>
    ["HousingProjectStarted", "HousingProjectCompleted", "HousingStockChanged"].includes(
      occurrence.type,
    ),
  );

describe("Commit 13 Housing material progression", () => {
  it("1. preserves the accepted Commit-12 route through equivalent awards, disbursements, and funded projects", () => {
    let world = materializeParticipatingProjects();
    world = resolveStateHousingGrantDecision(world, STATE_B_ID);

    expect(world.governance.housingGrantAwards.map((award) => award.awardedAmount)).toEqual([
      HOUSING_GRANT_SYNTHETIC_AWARD_AMOUNT,
      HOUSING_GRANT_SYNTHETIC_AWARD_AMOUNT,
    ]);
    expect(
      world.governance.publicFinance.housingGrant?.disbursements.map(
        (disbursement) => disbursement.amount,
      ),
    ).toEqual([HOUSING_GRANT_SYNTHETIC_AWARD_AMOUNT, HOUSING_GRANT_SYNTHETIC_AWARD_AMOUNT]);
    expect(world.housing.projects.map((project) => project.status)).toEqual([
      "FUNDED_NOT_STARTED",
      "FUNDED_NOT_STARTED",
    ]);
    expect(world.housing.projects.some((project) => project.stateJurisdictionId === STATE_B_ID)).toBe(
      false,
    );
  });

  it("2. introduces exactly the three minimal canonical geographic identities", () => {
    const world = createDeterministicWorldFixture();
    expect(world.geography.regions).toHaveLength(3);
    expect(world.geography.regions.map((region) => region.id)).toEqual([
      "geo-region-a",
      "geo-region-b",
      "geo-region-c",
    ]);
    for (const region of world.geography.regions) {
      expect(region).not.toHaveProperty("stateJurisdictionId");
      expect(region).not.toHaveProperty("population");
    }
  });

  it("3. keeps Housing regions as material owners that reference, rather than duplicate, geography", () => {
    const world = createDeterministicWorldFixture();
    const geographyIds = new Set(world.geography.regions.map((region) => region.id));

    for (const region of world.housing.regions) {
      expect(geographyIds.has(region.geographyRegionId)).toBe(true);
      expect(region.id).not.toBe(region.geographyRegionId);
      expect(region).not.toHaveProperty("boundaries");
      expect(region).not.toHaveProperty("coordinates");
    }
  });

  it("4. gives State A and State C distinct Housing-owned capacities without copying administrative capacity", () => {
    const world = createDeterministicWorldFixture();
    expect(regionFor(world, STATE_A_ID).constructionCapacityWorkUnitsPerDay).toBe(
      STATE_A_CONSTRUCTION_CAPACITY_WORK_UNITS_PER_DAY,
    );
    expect(regionFor(world, STATE_C_ID).constructionCapacityWorkUnitsPerDay).toBe(
      STATE_C_CONSTRUCTION_CAPACITY_WORK_UNITS_PER_DAY,
    );
    expect(regionFor(world, STATE_A_ID)).not.toHaveProperty("administrativeCapacity");
    expect(regionFor(world, STATE_C_ID)).not.toHaveProperty("administrativeCapacity");
    expect(
      world.governance.stateProgramAdministrativeStates.find(
        (state) => state.stateJurisdictionId === STATE_A_ID,
      )?.administrativeCapacity,
    ).toBe("ADEQUATE");
    expect(
      world.governance.stateProgramAdministrativeStates.find(
        (state) => state.stateJurisdictionId === STATE_C_ID,
      )?.administrativeCapacity,
    ).toBe("WEAK");
  });

  it("5. resolves each materialized project to its state's supported Housing region", () => {
    const world = materializeParticipatingProjects();
    expect(projectFor(world, STATE_A_ID).housingRegionId).toBe(regionFor(world, STATE_A_ID).id);
    expect(projectFor(world, STATE_C_ID).housingRegionId).toBe(regionFor(world, STATE_C_ID).id);
  });

  it("6. materializes zero work, no material timestamps, and no stock change", () => {
    const world = materializeParticipatingProjects();
    for (const stateId of [STATE_A_ID, STATE_C_ID]) {
      expect(projectFor(world, stateId)).toMatchObject({
        requiredWorkUnits: HOUSING_PROJECT_REQUIRED_WORK_UNITS,
        completedWorkUnits: 0,
        plannedHousingUnits: HOUSING_PROJECT_PLANNED_UNITS,
        status: "FUNDED_NOT_STARTED",
        startedAtSimulationTime: null,
        completedAtSimulationTime: null,
      });
      expect(regionFor(world, stateId).housingStockUnits).toBe(INITIAL_HOUSING_STOCK_UNITS);
    }
  });

  it("7. moves eligible projects into ACTIVE progress after positive simulation time", () => {
    const advanced = advanceWorldTo(materializeParticipatingProjects(), 1);
    expect(projectFor(advanced, STATE_A_ID)).toMatchObject({
      status: "ACTIVE",
      completedWorkUnits: 10,
      startedAtSimulationTime: 0,
    });
    expect(projectFor(advanced, STATE_C_ID)).toMatchObject({
      status: "ACTIVE",
      completedWorkUnits: 2,
      startedAtSimulationTime: 0,
    });
  });

  it("8. physically diverges at day 5 despite equivalent federal award and payment inputs", () => {
    const advanced = advanceWorldTo(materializeParticipatingProjects(), 5);
    expect(projectFor(advanced, STATE_A_ID).completedWorkUnits).toBe(50);
    expect(projectFor(advanced, STATE_C_ID).completedWorkUnits).toBe(10);
    expect(projectFor(advanced, STATE_A_ID).status).toBe("ACTIVE");
    expect(projectFor(advanced, STATE_C_ID).status).toBe("ACTIVE");
    expect(regionFor(advanced, STATE_A_ID).housingStockUnits).toBe(INITIAL_HOUSING_STOCK_UNITS);
    expect(regionFor(advanced, STATE_C_ID).housingStockUnits).toBe(INITIAL_HOUSING_STOCK_UNITS);
  });

  it("9. completes State A at day 10 while State C remains active", () => {
    const advanced = advanceWorldTo(materializeParticipatingProjects(), 10);
    expect(projectFor(advanced, STATE_A_ID)).toMatchObject({
      status: "COMPLETED",
      completedWorkUnits: 100,
      completedAtSimulationTime: 10,
    });
    expect(projectFor(advanced, STATE_C_ID)).toMatchObject({
      status: "ACTIVE",
      completedWorkUnits: 20,
      completedAtSimulationTime: null,
    });
    expect(regionFor(advanced, STATE_A_ID).housingStockUnits).toBe(1_100);
    expect(regionFor(advanced, STATE_C_ID).housingStockUnits).toBe(1_000);
  });

  it("10. preserves exact day-10 and day-50 completion instants during one coarse advance", () => {
    const advanced = advanceWorldTo(materializeParticipatingProjects(), 50);
    expect(projectFor(advanced, STATE_A_ID).completedAtSimulationTime).toBe(10);
    expect(projectFor(advanced, STATE_C_ID).completedAtSimulationTime).toBe(50);
    expect(projectFor(advanced, STATE_A_ID).completedWorkUnits).toBe(100);
    expect(projectFor(advanced, STATE_C_ID).completedWorkUnits).toBe(100);
  });

  it("11. does not change stock before each project's exact completion boundary", () => {
    const day9 = advanceWorldTo(materializeParticipatingProjects(), 9);
    expect(regionFor(day9, STATE_A_ID).housingStockUnits).toBe(1_000);
    expect(regionFor(day9, STATE_C_ID).housingStockUnits).toBe(1_000);

    const day49 = advanceWorldTo(materializeParticipatingProjects(), 49);
    expect(regionFor(day49, STATE_C_ID).housingStockUnits).toBe(1_000);
  });

  it("12. adds completed stock exactly once and emits no duplicate completion after further advancement", () => {
    const day50 = advanceWorldTo(materializeParticipatingProjects(), 50);
    const day100 = advanceWorldTo(day50, 100);

    expect(regionFor(day100, STATE_A_ID).housingStockUnits).toBe(1_100);
    expect(regionFor(day100, STATE_C_ID).housingStockUnits).toBe(1_100);
    expect(materialHistory(day100).filter((event) => event.type === "HousingProjectCompleted")).toHaveLength(2);
    expect(materialHistory(day100).filter((event) => event.type === "HousingStockChanged")).toHaveLength(2);
    expect(materialHistory(day100)).toEqual(materialHistory(day50));
  });

  it("13. produces identical Housing state and material occurrence order for chunked and one-shot advancement", () => {
    const base = materializeParticipatingProjects();
    const direct = advanceWorldTo(base, 50);
    const chunked = advanceWorldTo(
      advanceWorldTo(advanceWorldTo(advanceWorldTo(base, 4), 7), 10),
      50,
    );

    expect(chunked.housing).toEqual(direct.housing);
    expect(materialHistory(chunked)).toEqual(materialHistory(direct));
    expect(materialHistory(direct).map((event) => event.type)).toEqual([
      "HousingProjectStarted",
      "HousingProjectStarted",
      "HousingProjectCompleted",
      "HousingStockChanged",
      "HousingProjectCompleted",
      "HousingStockChanged",
    ]);
  });

  it("14. preserves State B's physical region while creating no program-funded progress or stock addition", () => {
    let world = materializeParticipatingProjects();
    world = resolveStateHousingGrantDecision(world, STATE_B_ID);
    world = advanceWorldTo(world, 50);

    expect(regionFor(world, STATE_B_ID).housingStockUnits).toBe(INITIAL_HOUSING_STOCK_UNITS);
    expect(world.housing.projects.some((project) => project.stateJurisdictionId === STATE_B_ID)).toBe(
      false,
    );
    expect(
      materialHistory(world).some(
        (occurrence) =>
          "stateJurisdictionId" in occurrence &&
          occurrence.stateJurisdictionId === STATE_B_ID,
      ),
    ).toBe(false);
  });

  it("15. computes Housing progression independently when governance administrative capacities are changed", () => {
    const base = materializeParticipatingProjects();
    const administrativelyAltered: WorldState = {
      ...base,
      governance: {
        ...base.governance,
        stateProgramAdministrativeStates: base.governance.stateProgramAdministrativeStates.map(
          (state) => ({
            ...state,
            administrativeCapacity:
              state.administrativeCapacity === "ADEQUATE" ? "WEAK" : "ADEQUATE",
          }),
        ),
      },
    };

    const ordinary = advanceWorldTo(base, 5);
    const altered = advanceWorldTo(administrativelyAltered, 5);
    expect(altered.housing).toEqual(ordinary.housing);
    expect(materialHistory(altered)).toEqual(materialHistory(ordinary));
  });

  it("16. records only meaningful start/completion/stock boundaries, not per-day progress events", () => {
    const day5 = advanceWorldTo(materializeParticipatingProjects(), 5);
    expect(materialHistory(day5).map((event) => event.type)).toEqual([
      "HousingProjectStarted",
      "HousingProjectStarted",
    ]);

    const day10 = advanceWorldTo(day5, 10);
    expect(materialHistory(day10).map((event) => event.type)).toEqual([
      "HousingProjectStarted",
      "HousingProjectStarted",
      "HousingProjectCompleted",
      "HousingStockChanged",
    ]);
  });

  it("17. exposes geography, material capacity, progress, and stock through the application projection", () => {
    const session = createGameSession();
    session.submitHousingGrantProposal(INITIAL_TERMS);
    session.amendHousingGrantProposal(COMPROMISE_TERMS);
    session.resolveHousingGrantProposalVote();
    session.recognizeHousingGrantFiscalAuthority();
    session.establishHousingGrantProgram();
    for (const stateId of [STATE_A_ID, STATE_C_ID]) {
      session.resolveStateHousingGrantDecision(stateId);
      session.submitStateHousingGrantApplication(stateId);
      session.resolveFederalHousingGrantApplication(stateId);
      session.activateIntergovernmentalHousingGrantParticipation(stateId);
      session.createHousingGrantAward(stateId);
      session.obligateHousingGrantAward(stateId);
      session.disburseHousingGrantObligation(stateId);
      session.materializeHousingProjectFromDisbursement(stateId);
    }
    const view = session.advanceTo(5);
    const stateA = view.statePrograms.find((state) => state.id === STATE_A_ID)!;
    const stateC = view.statePrograms.find((state) => state.id === STATE_C_ID)!;

    expect(stateA.housingRegion).toMatchObject({
      geographyRegionId: "geo-region-a",
      constructionCapacityWorkUnitsPerDay: 10,
      housingStockUnits: 1_000,
    });
    expect(stateA.housingProject).toMatchObject({ status: "ACTIVE", completedWorkUnits: 50 });
    expect(stateC.housingRegion).toMatchObject({
      geographyRegionId: "geo-region-c",
      constructionCapacityWorkUnitsPerDay: 2,
      housingStockUnits: 1_000,
    });
    expect(stateC.housingProject).toMatchObject({ status: "ACTIVE", completedWorkUnits: 10 });
  });

  it("18. leaves the input HousingState untouched and performs no work across a zero-duration interval", () => {
    const base = materializeParticipatingProjects();
    const housingBefore = base.housing;
    const zero = advanceHousing(housingBefore, 0, 0);
    expect(zero.housing).toEqual(housingBefore);
    expect(zero.occurrences).toEqual([]);

    advanceHousing(housingBefore, 0, 5);
    expect(projectFor(base, STATE_A_ID).completedWorkUnits).toBe(0);
    expect(regionFor(base, STATE_A_ID).housingStockUnits).toBe(1_000);
  });
});
