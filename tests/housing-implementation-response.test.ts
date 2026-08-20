import { describe, expect, it } from "vitest";

import { createGameSession } from "../src/app/session";
import {
  GL0_HOUSING_IMPLEMENTATION_SUPPORT_UNITS,
  availableHousingImplementationSupportUnits,
} from "../src/sim/administration";
import { STATE_A_ID, STATE_B_ID, STATE_C_ID } from "../src/sim/federalism";
import {
  activateIntergovernmentalHousingGrantParticipation,
  amendHousingGrantProposal,
  createHousingGrantAward,
  disburseHousingGrantObligation,
  establishHousingGrantProgram,
  isHousingImplementationResponseAttemptable,
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
  INITIAL_HOUSING_STOCK_UNITS,
  STATE_A_CONSTRUCTION_CAPACITY_WORK_UNITS_PER_DAY,
  STATE_C_CONSTRUCTION_CAPACITY_WORK_UNITS_PER_DAY,
} from "../src/sim/housing";
import type { ProposalTerms } from "../src/sim/legislature";
import {
  advanceWorldTo,
  createDeterministicWorldFixture,
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

const createAttemptableWorld = (): WorldState =>
  advanceWorldTo(materializeParticipatingProjects(), 5);

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

const responseHistory = (world: WorldState) =>
  world.history.filter((occurrence) =>
    [
      "HousingImplementationResponseResolved",
      "HousingImplementationSupportDeployed",
    ].includes(occurrence.type),
  );

describe("Commit 14 post-enactment implementation response", () => {
  it("1. preserves the Commit-13 uneven material route before the new response", () => {
    let world = createAttemptableWorld();
    world = resolveStateHousingGrantDecision(world, STATE_B_ID);

    expect(projectFor(world, STATE_A_ID)).toMatchObject({
      status: "ACTIVE",
      completedWorkUnits: 50,
    });
    expect(projectFor(world, STATE_C_ID)).toMatchObject({
      status: "ACTIVE",
      completedWorkUnits: 10,
    });
    expect(regionFor(world, STATE_A_ID).constructionCapacityWorkUnitsPerDay).toBe(
      STATE_A_CONSTRUCTION_CAPACITY_WORK_UNITS_PER_DAY,
    );
    expect(regionFor(world, STATE_C_ID).constructionCapacityWorkUnitsPerDay).toBe(
      STATE_C_CONSTRUCTION_CAPACITY_WORK_UNITS_PER_DAY,
    );
    expect(world.housing.projects.some((project) => project.stateJurisdictionId === STATE_B_ID)).toBe(
      false,
    );
  });

  it("2. owns implementation support in federal administrative state, not Housing", () => {
    const world = createDeterministicWorldFixture();
    expect(world.governance.housingImplementationSupport.operatorInstitutionId).toBe(
      world.governance.administrativeInstitution?.id,
    );
    expect(world.housing).not.toHaveProperty("implementationSupport");
    expect(world.housing.regions.every((region) => !("implementationSupport" in region))).toBe(true);
  });

  it("3. begins with exactly one bounded support unit, all available", () => {
    const support = createDeterministicWorldFixture().governance.housingImplementationSupport;
    expect(support.totalSupportUnits).toBe(GL0_HOUSING_IMPLEMENTATION_SUPPORT_UNITS);
    expect(support.totalSupportUnits).toBe(1);
    expect(support.committedSupportUnits).toBe(0);
    expect(availableHousingImplementationSupportUnits(support)).toBe(1);
  });

  it("4. requires the administrative/process prerequisites but not exact Housing progress", () => {
    expect(() =>
      resolveHousingImplementationResponse(
        createDeterministicWorldFixture(),
        "PRESERVE_SUPPORT_RESERVE",
      ),
    ).toThrow(/program/i);
    expect(() =>
      resolveHousingImplementationResponse(establishProgram(), "PRESERVE_SUPPORT_RESERVE"),
    ).toThrow(/not yet available/i);
    expect(() =>
      resolveHousingImplementationResponse(
        advanceWorldTo(establishProgram(), 5),
        "PRESERVE_SUPPORT_RESERVE",
      ),
    ).toThrow(/ACTIVE participation relationship/i);
    expect(() =>
      resolveHousingImplementationResponse(
        advanceWorldTo(materializeParticipatingProjects(), 4),
        "PRESERVE_SUPPORT_RESERVE",
      ),
    ).toThrow(/not yet available/i);
    let noProgress = advanceWorldTo(establishProgram(), 5);
    noProgress = materializeStateProject(noProgress, STATE_A_ID);
    noProgress = materializeStateProject(noProgress, STATE_C_ID);
    expect(projectFor(noProgress, STATE_A_ID).completedWorkUnits).toBe(0);
    expect(projectFor(noProgress, STATE_C_ID).completedWorkUnits).toBe(0);
    expect(isHousingImplementationResponseAttemptable(noProgress)).toBe(true);
    expect(
      resolveHousingImplementationResponse(noProgress, "PRESERVE_SUPPORT_RESERVE")
        .governance.housingImplementationResponseDecision?.action,
    ).toBe("PRESERVE_SUPPORT_RESERVE");
    expect(isHousingImplementationResponseAttemptable(createAttemptableWorld())).toBe(true);
  });

  it("5. requires State C's existing ACTIVE intergovernmental relationship", () => {
    const eligible = createAttemptableWorld();
    const withoutStateCRelationship: WorldState = {
      ...eligible,
      governance: {
        ...eligible.governance,
        intergovernmentalProgramRelationships:
          eligible.governance.intergovernmentalProgramRelationships.filter(
            (relationship) => relationship.stateJurisdictionId !== STATE_C_ID,
          ),
      },
    };

    expect(() =>
      resolveHousingImplementationResponse(withoutStateCRelationship, "DEPLOY_SUPPORT_TO_C"),
    ).toThrow(/ACTIVE participation relationship/i);
  });

  it("6. DEPLOY creates exactly one canonical support deployment", () => {
    const resolved = resolveHousingImplementationResponse(
      createAttemptableWorld(),
      "DEPLOY_SUPPORT_TO_C",
    );
    expect(resolved.governance.housingImplementationSupport.deployments).toHaveLength(1);
    expect(resolved.governance.housingImplementationSupport.deployments[0].supportUnits).toBe(1);
  });

  it("7. deployment references the existing program, relationship, and jurisdiction", () => {
    const before = createAttemptableWorld();
    const after = resolveHousingImplementationResponse(before, "DEPLOY_SUPPORT_TO_C");
    const deployment = after.governance.housingImplementationSupport.deployments[0];
    const relationship = before.governance.intergovernmentalProgramRelationships.find(
      (candidate) => candidate.stateJurisdictionId === STATE_C_ID,
    )!;

    expect(deployment.federalProgramId).toBe(before.governance.housingGrantProgram?.id);
    expect(deployment.relationshipId).toBe(relationship.id);
    expect(deployment.stateJurisdictionId).toBe(STATE_C_ID);
    expect(deployment).not.toHaveProperty("relationshipStatus");
    expect(deployment).not.toHaveProperty("administrativeCapacity");
  });

  it("8. DEPLOY commits exactly one unit and leaves none reusable", () => {
    const support = resolveHousingImplementationResponse(
      createAttemptableWorld(),
      "DEPLOY_SUPPORT_TO_C",
    ).governance.housingImplementationSupport;
    expect(support.committedSupportUnits).toBe(1);
    expect(availableHousingImplementationSupportUnits(support)).toBe(0);
  });

  it("9. rejects deployment when no support remains and never drives availability below zero", () => {
    const eligible = createAttemptableWorld();
    const exhausted: WorldState = {
      ...eligible,
      governance: {
        ...eligible.governance,
        housingImplementationSupport: {
          ...eligible.governance.housingImplementationSupport,
          committedSupportUnits: 1,
        },
      },
    };

    expect(() =>
      resolveHousingImplementationResponse(exhausted, "DEPLOY_SUPPORT_TO_C"),
    ).toThrow(/no federal housing implementation support/i);
    expect(availableHousingImplementationSupportUnits(exhausted.governance.housingImplementationSupport)).toBe(0);
  });

  it("10. rejects every repeated resolution sequence for the single opportunity", () => {
    const deployed = resolveHousingImplementationResponse(
      createAttemptableWorld(),
      "DEPLOY_SUPPORT_TO_C",
    );
    const preserved = resolveHousingImplementationResponse(
      createAttemptableWorld(),
      "PRESERVE_SUPPORT_RESERVE",
    );

    expect(() => resolveHousingImplementationResponse(deployed, "DEPLOY_SUPPORT_TO_C")).toThrow(
      /already been resolved/i,
    );
    expect(() => resolveHousingImplementationResponse(deployed, "PRESERVE_SUPPORT_RESERVE")).toThrow(
      /already been resolved/i,
    );
    expect(() => resolveHousingImplementationResponse(preserved, "DEPLOY_SUPPORT_TO_C")).toThrow(
      /already been resolved/i,
    );
  });

  it("11. PRESERVE creates no deployment and consumes no support", () => {
    const support = resolveHousingImplementationResponse(
      createAttemptableWorld(),
      "PRESERVE_SUPPORT_RESERVE",
    ).governance.housingImplementationSupport;
    expect(support.deployments).toEqual([]);
    expect(support.committedSupportUnits).toBe(0);
    expect(availableHousingImplementationSupportUnits(support)).toBe(1);
  });

  it("12. PRESERVE is still a resolved canonical administrative decision", () => {
    const resolved = resolveHousingImplementationResponse(
      createAttemptableWorld(),
      "PRESERVE_SUPPORT_RESERVE",
    );
    expect(resolved.governance.housingImplementationResponseDecision).toMatchObject({
      federalProgramId: resolved.governance.housingGrantProgram?.id,
      action: "PRESERVE_SUPPORT_RESERVE",
      targetStateJurisdictionId: null,
      decidedAtSimulationTime: 5,
    });
  });

  it("13. neither response directly changes Housing progress, capacity, or stock", () => {
    const before = createAttemptableWorld();
    const deployed = resolveHousingImplementationResponse(before, "DEPLOY_SUPPORT_TO_C");
    const preserved = resolveHousingImplementationResponse(before, "PRESERVE_SUPPORT_RESERVE");

    expect(deployed.housing).toEqual(before.housing);
    expect(preserved.housing).toEqual(before.housing);
    expect(regionFor(deployed, STATE_C_ID).housingStockUnits).toBe(INITIAL_HOUSING_STOCK_UNITS);
  });

  it("14. does not copy State C's state-owned administrative-capacity fixture", () => {
    const eligible = createAttemptableWorld();
    const altered: WorldState = {
      ...eligible,
      governance: {
        ...eligible.governance,
        stateProgramAdministrativeStates: eligible.governance.stateProgramAdministrativeStates.map(
          (state) =>
            state.stateJurisdictionId === STATE_C_ID
              ? { ...state, administrativeCapacity: "ADEQUATE" }
              : state,
        ),
      },
    };
    const deployment = resolveHousingImplementationResponse(
      altered,
      "DEPLOY_SUPPORT_TO_C",
    ).governance.housingImplementationSupport.deployments[0];

    expect(deployment.stateJurisdictionId).toBe(STATE_C_ID);
    expect(deployment).not.toHaveProperty("administrativeCapacity");
  });

  it("15. leaves Housing independently advanceable from HousingState plus time", () => {
    const before = createAttemptableWorld();
    const deployed = resolveHousingImplementationResponse(before, "DEPLOY_SUPPORT_TO_C");
    const preserved = resolveHousingImplementationResponse(before, "PRESERVE_SUPPORT_RESERVE");

    const ordinaryAdvance = advanceHousing(before.housing, 5, 6);
    expect(advanceHousing(deployed.housing, 5, 6)).toEqual(ordinaryAdvance);
    expect(advanceHousing(preserved.housing, 5, 6)).toEqual(ordinaryAdvance);
  });

  it("16. produces the same attemptable canonical starting state under equivalent advancement chunking", () => {
    const base = materializeParticipatingProjects();
    const direct = advanceWorldTo(base, 5);
    const chunked = advanceWorldTo(advanceWorldTo(advanceWorldTo(base, 1), 3), 5);

    expect(chunked).toEqual(direct);
    expect(isHousingImplementationResponseAttemptable(chunked)).toBe(true);
    expect(isHousingImplementationResponseAttemptable(direct)).toBe(true);
  });

  it("17. emits response and deployment occurrences exactly once with stable identities", () => {
    const deployed = resolveHousingImplementationResponse(
      createAttemptableWorld(),
      "DEPLOY_SUPPORT_TO_C",
    );
    expect(responseHistory(deployed).map((occurrence) => occurrence.type)).toEqual([
      "HousingImplementationResponseResolved",
      "HousingImplementationSupportDeployed",
    ]);
    expect(new Set(responseHistory(deployed).map((occurrence) => occurrence.type)).size).toBe(2);
    const decisionOccurrence = responseHistory(deployed).find(
      (occurrence) => occurrence.type === "HousingImplementationResponseResolved",
    );
    const deploymentOccurrence = responseHistory(deployed).find(
      (occurrence) => occurrence.type === "HousingImplementationSupportDeployed",
    );
    expect(decisionOccurrence).toMatchObject({
      decisionId: deployed.governance.housingImplementationResponseDecision?.id,
    });
    expect(deploymentOccurrence).toMatchObject({
      deploymentId: deployed.governance.housingImplementationSupport.deployments[0].id,
    });

    const preserved = resolveHousingImplementationResponse(
      createAttemptableWorld(),
      "PRESERVE_SUPPORT_RESERVE",
    );
    expect(responseHistory(preserved).map((occurrence) => occurrence.type)).toEqual([
      "HousingImplementationResponseResolved",
    ]);
  });

  it("18. exposes the bounded choice and its result through the inspection projection", () => {
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

    const attemptable = session.advanceTo(5);
    expect(attemptable.implementationResponse).toMatchObject({
      responseOpportunityReady: true,
      totalSupportUnits: 1,
      availableSupportUnits: 1,
      committedSupportUnits: 0,
      resolvedAction: null,
    });
    const resolved = session.deployHousingImplementationSupportToStateC();
    expect(resolved.implementationResponse).toMatchObject({
      responseOpportunityReady: false,
      availableSupportUnits: 0,
      committedSupportUnits: 1,
      resolvedAction: "DEPLOY_SUPPORT_TO_C",
      targetStateJurisdictionId: STATE_C_ID,
    });
  });
});
