import { describe, expect, it } from "vitest";

import { createDeterministicWorldFixture } from "../src/content/gl0-synthetic/configuration";

import { createGameSession } from "../src/app/session";
import { STATE_A_ID, STATE_B_ID, STATE_C_ID } from "../src/sim/federalism";
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
  acceptHousingImplementationSupport,
  advanceHousing,
  HOUSING_SUPPORT_SUPPLEMENTAL_WORK_UNITS_PER_DAY_PER_UNIT,
  INITIAL_HOUSING_STOCK_UNITS,
  resolveHousingProjectEffectiveWorkUnitsPerDay,
  STATE_C_CONSTRUCTION_CAPACITY_WORK_UNITS_PER_DAY,
  type HousingImplementationSupportInput,
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

const createAttemptableWorld = (): WorldState => {
  let world = establishProgram();
  world = materializeStateProject(world, STATE_A_ID);
  world = materializeStateProject(world, STATE_C_ID);
  return advanceWorldTo(world, 5);
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

const supportBoundaryHistory = (world: WorldState) =>
  world.history.filter((occurrence) =>
    [
      "HousingImplementationResponseResolved",
      "HousingImplementationSupportDeployed",
      "HousingImplementationSupportAccepted",
    ].includes(occurrence.type),
  );

const materialBoundaryHistory = (world: WorldState) =>
  world.history.filter((occurrence) =>
    [
      "HousingProjectStarted",
      "HousingImplementationSupportAccepted",
      "HousingProjectCompleted",
      "HousingStockChanged",
    ].includes(occurrence.type),
  );

describe("Commit 15 administrative support to Housing input", () => {
  it("1. keeps both accepted Commit-14 response routes valid", () => {
    const deployed = resolveHousingImplementationResponse(
      createAttemptableWorld(),
      "DEPLOY_SUPPORT_TO_C",
    );
    const preserved = resolveHousingImplementationResponse(
      createAttemptableWorld(),
      "PRESERVE_SUPPORT_RESERVE",
    );

    expect(deployed.governance.housingImplementationResponseDecision?.action).toBe(
      "DEPLOY_SUPPORT_TO_C",
    );
    expect(deployed.governance.housingImplementationSupport.committedSupportUnits).toBe(1);
    expect(preserved.governance.housingImplementationResponseDecision?.action).toBe(
      "PRESERVE_SUPPORT_RESERVE",
    );
    expect(preserved.governance.housingImplementationSupport.committedSupportUnits).toBe(0);
  });

  it("2. PRESERVE creates no Housing support input, effect, or acceptance occurrence", () => {
    const preserved = resolveHousingImplementationResponse(
      createAttemptableWorld(),
      "PRESERVE_SUPPORT_RESERVE",
    );

    expect(preserved.governance.housingImplementationSupport.deployments).toHaveLength(0);
    expect(preserved.housing.projectDeliverySupports).toHaveLength(0);
    expect(
      preserved.history.some(
        (occurrence) => occurrence.type === "HousingImplementationSupportAccepted",
      ),
    ).toBe(false);
  });

  it("3. DEPLOY records the administrative deployment before Housing acceptance", () => {
    const deployed = resolveHousingImplementationResponse(
      createAttemptableWorld(),
      "DEPLOY_SUPPORT_TO_C",
    );

    expect(supportBoundaryHistory(deployed).map((occurrence) => occurrence.type)).toEqual([
      "HousingImplementationResponseResolved",
      "HousingImplementationSupportDeployed",
      "HousingImplementationSupportAccepted",
    ]);
    expect(deployed.governance.housingImplementationSupport.deployments).toHaveLength(1);
  });

  it("4. stores the accepted material effect only in Housing-owned state", () => {
    const deployed = resolveHousingImplementationResponse(
      createAttemptableWorld(),
      "DEPLOY_SUPPORT_TO_C",
    );

    expect(deployed.housing.projectDeliverySupports).toHaveLength(1);
    expect(deployed.governance).not.toHaveProperty("projectDeliverySupports");
    expect(deployed.governance.housingImplementationSupport).not.toHaveProperty(
      "supplementalWorkUnitsPerDay",
    );
  });

  it("5. references sourceDeploymentId without copying administrative facts", () => {
    const deployed = resolveHousingImplementationResponse(
      createAttemptableWorld(),
      "DEPLOY_SUPPORT_TO_C",
    );
    const deployment = deployed.governance.housingImplementationSupport.deployments[0];
    const effect = deployed.housing.projectDeliverySupports[0];

    expect(effect.sourceDeploymentId).toBe(deployment.id);
    expect(effect).not.toHaveProperty("federalProgramId");
    expect(effect).not.toHaveProperty("relationshipId");
    expect(effect).not.toHaveProperty("relationshipStatus");
    expect(effect).not.toHaveProperty("administrativeCapacity");
  });

  it("6. keeps the input free of a final physical effect and translates one unit to +3/day in Housing", () => {
    const base = createAttemptableWorld();
    const input: HousingImplementationSupportInput = {
      sourceDeploymentId: "fixture-deployment",
      stateJurisdictionId: STATE_C_ID,
      supportUnits: 1,
    };
    expect(input).not.toHaveProperty("supplementalWorkUnitsPerDay");

    const accepted = acceptHousingImplementationSupport(base.housing, input, 5);
    expect(HOUSING_SUPPORT_SUPPLEMENTAL_WORK_UNITS_PER_DAY_PER_UNIT).toBe(3);
    expect(accepted.projectDeliverySupports[0].supplementalWorkUnitsPerDay).toBe(3);
    expect(
      resolveHousingProjectEffectiveWorkUnitsPerDay(
        accepted,
        projectFor(base, STATE_C_ID).id,
        5,
      ),
    ).toBe(5);
  });

  it("7. leaves State C intrinsic construction capacity exactly 2/day", () => {
    const before = createAttemptableWorld();
    const deployed = resolveHousingImplementationResponse(before, "DEPLOY_SUPPORT_TO_C");

    expect(regionFor(before, STATE_C_ID).constructionCapacityWorkUnitsPerDay).toBe(2);
    expect(regionFor(deployed, STATE_C_ID).constructionCapacityWorkUnitsPerDay).toBe(
      STATE_C_CONSTRUCTION_CAPACITY_WORK_UNITS_PER_DAY,
    );
    expect(regionFor(deployed, STATE_C_ID).constructionCapacityWorkUnitsPerDay).toBe(2);
  });

  it("8. leaves State C administrative capacity WEAK and retains the federal deployment", () => {
    const deployed = resolveHousingImplementationResponse(
      createAttemptableWorld(),
      "DEPLOY_SUPPORT_TO_C",
    );
    const stateCAdministration = deployed.governance.stateProgramAdministrativeStates.find(
      (state) => state.stateJurisdictionId === STATE_C_ID,
    );

    expect(stateCAdministration?.administrativeCapacity).toBe("WEAK");
    expect(deployed.governance.housingImplementationSupport.deployments).toHaveLength(1);
  });

  it("9. accepts support at day 5 without retroactively changing State C's first 10 work units", () => {
    const before = createAttemptableWorld();
    const deployed = resolveHousingImplementationResponse(before, "DEPLOY_SUPPORT_TO_C");

    expect(projectFor(before, STATE_C_ID).completedWorkUnits).toBe(10);
    expect(projectFor(deployed, STATE_C_ID).completedWorkUnits).toBe(10);
    expect(deployed.housing.projectDeliverySupports[0].effectiveAtSimulationTime).toBe(5);
  });

  it("10. diverges at day 10: DEPLOY is 35/100 and PRESERVE is 20/100", () => {
    const deployed = advanceWorldTo(
      resolveHousingImplementationResponse(createAttemptableWorld(), "DEPLOY_SUPPORT_TO_C"),
      10,
    );
    const preserved = advanceWorldTo(
      resolveHousingImplementationResponse(createAttemptableWorld(), "PRESERVE_SUPPORT_RESERVE"),
      10,
    );

    expect(projectFor(deployed, STATE_C_ID).completedWorkUnits).toBe(35);
    expect(projectFor(preserved, STATE_C_ID).completedWorkUnits).toBe(20);
  });

  it("11. records State C's exact supported completion timestamp at day 23", () => {
    const deployed = advanceWorldTo(
      resolveHousingImplementationResponse(createAttemptableWorld(), "DEPLOY_SUPPORT_TO_C"),
      50,
    );

    expect(projectFor(deployed, STATE_C_ID)).toMatchObject({
      status: "COMPLETED",
      completedWorkUnits: 100,
      completedAtSimulationTime: 23,
    });
  });

  it("12. retains State C's original PRESERVE completion timestamp at day 50", () => {
    const preserved = advanceWorldTo(
      resolveHousingImplementationResponse(createAttemptableWorld(), "PRESERVE_SUPPORT_RESERVE"),
      50,
    );

    expect(projectFor(preserved, STATE_C_ID)).toMatchObject({
      status: "COMPLETED",
      completedWorkUnits: 100,
      completedAtSimulationTime: 50,
    });
  });

  it("13. changes State C stock exactly once at the supported completion boundary", () => {
    const deployed = resolveHousingImplementationResponse(
      createAttemptableWorld(),
      "DEPLOY_SUPPORT_TO_C",
    );
    const day22 = advanceWorldTo(deployed, 22);
    const day23 = advanceWorldTo(day22, 23);
    const day50 = advanceWorldTo(day23, 50);

    expect(regionFor(day22, STATE_C_ID).housingStockUnits).toBe(INITIAL_HOUSING_STOCK_UNITS);
    expect(regionFor(day23, STATE_C_ID).housingStockUnits).toBe(1_100);
    expect(regionFor(day50, STATE_C_ID).housingStockUnits).toBe(1_100);
    expect(
      day50.history.filter(
        (occurrence) =>
          occurrence.type === "HousingStockChanged" &&
          occurrence.housingRegionId === regionFor(day50, STATE_C_ID).id,
      ),
    ).toHaveLength(1);
  });

  it("14. leaves State A unchanged and completed at day 10", () => {
    const deployed = advanceWorldTo(
      resolveHousingImplementationResponse(createAttemptableWorld(), "DEPLOY_SUPPORT_TO_C"),
      23,
    );

    expect(projectFor(deployed, STATE_A_ID).completedAtSimulationTime).toBe(10);
    expect(regionFor(deployed, STATE_A_ID).housingStockUnits).toBe(1_100);
    expect(
      deployed.housing.projectDeliverySupports.some(
        (support) => support.housingProjectId === projectFor(deployed, STATE_A_ID).id,
      ),
    ).toBe(false);
  });

  it("15. leaves State B without a program-funded project or support effect", () => {
    const withRefusal = resolveStateHousingGrantDecision(createAttemptableWorld(), STATE_B_ID);
    const deployed = resolveHousingImplementationResponse(withRefusal, "DEPLOY_SUPPORT_TO_C");

    expect(
      deployed.housing.projects.some(
        (project) => project.stateJurisdictionId === STATE_B_ID,
      ),
    ).toBe(false);
    expect(
      deployed.housing.projectDeliverySupports.some(
        (support) => support.housingRegionId === regionFor(deployed, STATE_B_ID).id,
      ),
    ).toBe(false);
  });

  it("16. rejects duplicate Housing consumption of the same deployment atomically", () => {
    const deployed = resolveHousingImplementationResponse(
      createAttemptableWorld(),
      "DEPLOY_SUPPORT_TO_C",
    );
    const deployment = deployed.governance.housingImplementationSupport.deployments[0];
    const before = deployed.housing;

    expect(() =>
      acceptHousingImplementationSupport(
        before,
        {
          sourceDeploymentId: deployment.id,
          stateJurisdictionId: deployment.stateJurisdictionId,
          supportUnits: deployment.supportUnits,
        },
        5,
      ),
    ).toThrow(/already consumed/i);
    expect(before.projectDeliverySupports).toHaveLength(1);
  });

  it("17. makes Housing reject nonpositive units and states without exactly one material project", () => {
    const world = createAttemptableWorld();
    const { housing } = world;

    expect(() =>
      acceptHousingImplementationSupport(
        housing,
        { sourceDeploymentId: "zero", stateJurisdictionId: STATE_C_ID, supportUnits: 0 },
        5,
      ),
    ).toThrow(/positive whole/i);
    expect(() =>
      acceptHousingImplementationSupport(
        housing,
        { sourceDeploymentId: "state-b", stateJurisdictionId: STATE_B_ID, supportUnits: 1 },
        5,
      ),
    ).toThrow(/exactly one supported material project/i);
    expect(() =>
      acceptHousingImplementationSupport(
        housing,
        { sourceDeploymentId: "too-early", stateJurisdictionId: STATE_C_ID, supportUnits: 1 },
        -1,
      ),
    ).toThrow(/cannot predate/i);
    const completed = advanceHousing(housing, 5, 50).housing;
    expect(() =>
      acceptHousingImplementationSupport(
        completed,
        { sourceDeploymentId: "too-late", stateJurisdictionId: STATE_C_ID, supportUnits: 1 },
        50,
      ),
    ).toThrow(/already completed/i);
  });

  it("18. reproduces supported progression from HousingState plus time alone", () => {
    const deployed = resolveHousingImplementationResponse(
      createAttemptableWorld(),
      "DEPLOY_SUPPORT_TO_C",
    );
    const housingOnly = advanceHousing(deployed.housing, 5, 23);
    const worldAdvance = advanceWorldTo(deployed, 23);

    expect(housingOnly.housing).toEqual(worldAdvance.housing);
    expect(projectFor(worldAdvance, STATE_C_ID).completedAtSimulationTime).toBe(23);
  });

  it("19. produces identical supported Housing state and material occurrence order when chunked", () => {
    const deployed = resolveHousingImplementationResponse(
      createAttemptableWorld(),
      "DEPLOY_SUPPORT_TO_C",
    );
    const direct = advanceWorldTo(deployed, 23);
    const chunked = advanceWorldTo(
      advanceWorldTo(advanceWorldTo(advanceWorldTo(deployed, 7), 10), 18),
      23,
    );

    expect(chunked.housing).toEqual(direct.housing);
    expect(materialBoundaryHistory(chunked)).toEqual(materialBoundaryHistory(direct));
    expect(
      materialBoundaryHistory(direct)
        .filter((occurrence) => occurrence.type === "HousingProjectCompleted")
        .map((occurrence) => occurrence.at),
    ).toEqual([10, 23]);
  });

  it("20. exposes intrinsic, accepted, effective, progress, completion, and stock facts in the dev projection", () => {
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
    session.advanceTo(5);
    session.deployHousingImplementationSupportToStateC();
    const day10 = session.advanceTo(10);
    const stateC = day10.statePrograms.find((state) => state.id === STATE_C_ID)!;

    expect(stateC.housingRegion.constructionCapacityWorkUnitsPerDay).toBe(2);
    expect(stateC.acceptedImplementationSupport).toMatchObject({
      supportUnits: 1,
      supplementalWorkUnitsPerDay: 3,
      effectiveAtSimulationTime: 5,
    });
    expect(stateC.effectiveProjectWorkUnitsPerDay).toBe(5);
    expect(stateC.housingProject?.completedWorkUnits).toBe(35);
    expect(stateC.housingProject?.completedAtSimulationTime).toBeNull();
    expect(stateC.housingRegion.housingStockUnits).toBe(1_000);
  });
});
