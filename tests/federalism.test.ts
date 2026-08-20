import { describe, expect, it } from "vitest";

import { createGameSession } from "../src/app/session";
import {
  activateIntergovernmentalHousingGrantParticipation,
  amendHousingGrantProposal,
  establishHousingGrantProgram,
  HOUSING_GRANT_SYNTHETIC_APPROPRIATION_AMOUNT,
  recognizeHousingGrantFiscalAuthority,
  resolveFederalHousingGrantApplication,
  resolveHousingGrantProposalVote,
  resolveStateHousingGrantDecision,
  submitHousingGrantProposal,
  submitStateHousingGrantApplication,
} from "../src/sim/governance";
import {
  createDeterministicStateProgramAdministrativeStates,
  STATE_A_ID,
  STATE_B_ID,
  STATE_C_ID,
} from "../src/sim/federalism";
import type { ProposalTerms } from "../src/sim/legislature";
import { createDeterministicWorldFixture } from "../src/sim/world";

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

const establishProgram = () => {
  const submitted = submitHousingGrantProposal(createDeterministicWorldFixture(), INITIAL_TERMS);
  const amended = amendHousingGrantProposal(submitted, COMPROMISE_TERMS);
  const enacted = resolveHousingGrantProposalVote(amended);
  const recognized = recognizeHousingGrantFiscalAuthority(enacted);
  return establishHousingGrantProgram(recognized);
};

const completeStateRoute = (world: ReturnType<typeof establishProgram>, stateId: string) => {
  const decided = resolveStateHousingGrantDecision(world, stateId);
  const applied = submitStateHousingGrantApplication(decided, stateId);
  const determined = resolveFederalHousingGrantApplication(applied, stateId);
  return activateIntergovernmentalHousingGrantParticipation(determined, stateId);
};

describe("Commit 11 bounded federal program -> state response slice", () => {
  it("preserves the accepted Commit-10 route before any state response", () => {
    const world = establishProgram();

    expect(world.governance.enactedLaws).toHaveLength(1);
    expect(world.governance.housingGrantProgram?.status).toBe("READY_FOR_APPLICATIONS");
    expect(world.governance.publicFinance.housingGrant?.availableAmount).toBe(
      HOUSING_GRANT_SYNTHETIC_APPROPRIATION_AMOUNT,
    );
    expect(world.governance.fiscalExecution?.obligated).toBe(0);
    expect(world.governance.publicFinance.housingGrant?.disbursedAmount).toBe(0);
  });

  it("initializes exactly three distinct political/legal state jurisdictions without geography, owning only identity", () => {
    const world = createDeterministicWorldFixture();
    const states = world.governance.stateJurisdictions;

    expect(states).toHaveLength(3);
    expect(states).toEqual([{ id: STATE_A_ID }, { id: STATE_B_ID }, { id: STATE_C_ID }]);
    expect(new Set(states.map((state) => state.id)).size).toBe(3);
    expect(world.governance).not.toHaveProperty("geography");
    // C11-01: jurisdiction identity does not carry decision behavior or capacity.
    for (const state of states) {
      expect(state).not.toHaveProperty("housingGrantDecisionRule");
      expect(state).not.toHaveProperty("administrativeCapacity");
    }
  });

  it("owns one separate state political/administrative fixture state per state, referencing jurisdiction by stable id", () => {
    const world = createDeterministicWorldFixture();
    const administrativeStates = world.governance.stateProgramAdministrativeStates;

    expect(administrativeStates).toHaveLength(3);
    expect(new Set(administrativeStates.map((state) => state.stateJurisdictionId)).size).toBe(3);
    expect(
      administrativeStates.map((state) => state.stateJurisdictionId).sort(),
    ).toEqual([STATE_A_ID, STATE_B_ID, STATE_C_ID].sort());

    const byState = Object.fromEntries(
      administrativeStates.map((state) => [state.stateJurisdictionId, state]),
    );
    expect(byState[STATE_A_ID]).toMatchObject({
      housingGrantDecisionRule: "APPLY",
      administrativeCapacity: "ADEQUATE",
    });
    expect(byState[STATE_B_ID]).toMatchObject({ housingGrantDecisionRule: "REFUSE" });
    expect(byState[STATE_C_ID]).toMatchObject({
      housingGrantDecisionRule: "APPLY",
      administrativeCapacity: "WEAK",
    });
  });

  it("matches the deterministic fixture constructor exposed for direct construction", () => {
    expect(createDeterministicStateProgramAdministrativeStates()).toEqual(
      createDeterministicWorldFixture().governance.stateProgramAdministrativeStates,
    );
  });

  it("keeps State A adequate and State C weak as state-owned administrative capacity, not jurisdiction identity", () => {
    const world = createDeterministicWorldFixture();

    expect(world.governance.stateProgramAdministrativeStates).toMatchObject([
      { stateJurisdictionId: STATE_A_ID, administrativeCapacity: "ADEQUATE" },
      { stateJurisdictionId: STATE_B_ID, administrativeCapacity: "ADEQUATE" },
      { stateJurisdictionId: STATE_C_ID, administrativeCapacity: "WEAK" },
    ]);
    // Jurisdiction identity itself carries no capacity field at all.
    for (const state of world.governance.stateJurisdictions) {
      expect(state).not.toHaveProperty("administrativeCapacity");
    }
  });

  it("resolveStateHousingGrantDecision obtains its decision rule through the separate fixture state", () => {
    const decidedA = resolveStateHousingGrantDecision(establishProgram(), STATE_A_ID);
    const administrativeStateA = decidedA.governance.stateProgramAdministrativeStates.find(
      (state) => state.stateJurisdictionId === STATE_A_ID,
    );

    expect(decidedA.governance.stateProgramDecisions[0].decision).toBe(
      administrativeStateA?.housingGrantDecisionRule,
    );
    // The resolved decision is its own distinct current fact, not a live alias.
    expect(decidedA.governance.stateProgramDecisions[0]).not.toBe(administrativeStateA);
  });

  it("resolves state-owned decisions independently and creates no applications", () => {
    const program = establishProgram();
    const decidedA = resolveStateHousingGrantDecision(program, STATE_A_ID);
    const decidedB = resolveStateHousingGrantDecision(decidedA, STATE_B_ID);
    const decidedC = resolveStateHousingGrantDecision(decidedB, STATE_C_ID);

    expect(decidedC.governance.stateProgramDecisions).toMatchObject([
      { stateJurisdictionId: STATE_A_ID, decision: "APPLY" },
      { stateJurisdictionId: STATE_B_ID, decision: "REFUSE" },
      { stateJurisdictionId: STATE_C_ID, decision: "APPLY" },
    ]);
    expect(decidedC.governance.programApplications).toEqual([]);
    expect(decidedC.governance.federalApplicationDeterminations).toEqual([]);
    expect(decidedC.governance.intergovernmentalProgramRelationships).toEqual([]);
  });

  it("requires the program offer before a state can resolve its decision", () => {
    const world = createDeterministicWorldFixture();

    expect(() => resolveStateHousingGrantDecision(world, STATE_A_ID)).toThrow(
      /program must be established/,
    );
    expect(world.governance.stateProgramDecisions).toEqual([]);
  });

  it("creates a distinct State A application only after its APPLY decision", () => {
    const program = establishProgram();
    const decided = resolveStateHousingGrantDecision(program, STATE_A_ID);
    const applied = submitStateHousingGrantApplication(decided, STATE_A_ID);
    const application = applied.governance.programApplications[0];

    expect(application).toMatchObject({
      federalProgramId: program.governance.housingGrantProgram!.id,
      stateJurisdictionId: STATE_A_ID,
      status: "SUBMITTED",
    });
    expect(application.id).not.toBe(program.governance.housingGrantProgram!.id);
    expect(applied.governance.federalApplicationDeterminations).toEqual([]);
  });

  it("keeps State B refusal separate and produces no fabricated application", () => {
    const decided = resolveStateHousingGrantDecision(establishProgram(), STATE_B_ID);

    expect(decided.governance.stateProgramDecisions[0]).toMatchObject({
      stateJurisdictionId: STATE_B_ID,
      decision: "REFUSE",
    });
    expect(decided.history).toContainEqual(
      expect.objectContaining({
        type: "StateProgramDecisionResolved",
        stateJurisdictionId: STATE_B_ID,
        decision: "REFUSE",
      }),
    );
    expect(decided.governance.programApplications).toEqual([]);
    expect(() => submitStateHousingGrantApplication(decided, STATE_B_ID)).toThrow(/refused/);
    expect(() => resolveFederalHousingGrantApplication(decided, STATE_B_ID)).toThrow(
      /without a state application/,
    );
  });

  it("allows an application to exist before federal determination", () => {
    const applied = submitStateHousingGrantApplication(
      resolveStateHousingGrantDecision(establishProgram(), STATE_C_ID),
      STATE_C_ID,
    );

    expect(applied.governance.programApplications).toHaveLength(1);
    expect(applied.governance.federalApplicationDeterminations).toHaveLength(0);
    expect(applied.governance.intergovernmentalProgramRelationships).toHaveLength(0);
  });

  it("does not allow federal determination without an application", () => {
    const decided = resolveStateHousingGrantDecision(establishProgram(), STATE_A_ID);

    expect(() => resolveFederalHousingGrantApplication(decided, STATE_A_ID)).toThrow(
      /without a state application/,
    );
  });

  it("creates a federal acceptance distinct from the State A application", () => {
    const applied = submitStateHousingGrantApplication(
      resolveStateHousingGrantDecision(establishProgram(), STATE_A_ID),
      STATE_A_ID,
    );
    const determined = resolveFederalHousingGrantApplication(applied, STATE_A_ID);
    const application = determined.governance.programApplications[0];
    const determination = determined.governance.federalApplicationDeterminations[0];

    expect(determination).toMatchObject({
      applicationId: application.id,
      stateJurisdictionId: STATE_A_ID,
      outcome: "ACCEPTED",
    });
    expect(determination.id).not.toBe(application.id);
  });

  it("accepts State A and State C but cannot accept State B through federal action", () => {
    const a = completeStateRoute(establishProgram(), STATE_A_ID);
    const c = completeStateRoute(a, STATE_C_ID);
    const b = resolveStateHousingGrantDecision(c, STATE_B_ID);

    expect(b.governance.federalApplicationDeterminations).toHaveLength(2);
    expect(b.governance.federalApplicationDeterminations.map((item) => item.stateJurisdictionId)).toEqual([
      STATE_A_ID,
      STATE_C_ID,
    ]);
    expect(() => resolveFederalHousingGrantApplication(b, STATE_B_ID)).toThrow(
      /without a state application/,
    );
    expect(b.governance.intergovernmentalProgramRelationships).toHaveLength(2);
  });

  it("activates State A and State C only after both sides' facts exist", () => {
    const stateA = completeStateRoute(establishProgram(), STATE_A_ID);
    const stateC = completeStateRoute(stateA, STATE_C_ID);
    const relationships = stateC.governance.intergovernmentalProgramRelationships;

    expect(relationships).toHaveLength(2);
    expect(relationships).toMatchObject([
      { stateJurisdictionId: STATE_A_ID, status: "ACTIVE" },
      { stateJurisdictionId: STATE_C_ID, status: "ACTIVE" },
    ]);
    expect(relationships[0].stateApplicationId).toBe(
      stateC.governance.programApplications[0].id,
    );
    expect(relationships[0].federalDeterminationId).toBe(
      stateC.governance.federalApplicationDeterminations[0].id,
    );
  });

  it("does not activate participation from a state decision or federal result alone", () => {
    const decided = resolveStateHousingGrantDecision(establishProgram(), STATE_A_ID);
    expect(() => activateIntergovernmentalHousingGrantParticipation(decided, STATE_A_ID)).toThrow(
      /submit an application/,
    );

    const determined = resolveFederalHousingGrantApplication(
      submitStateHousingGrantApplication(decided, STATE_A_ID),
      STATE_A_ID,
    );
    expect(activateIntergovernmentalHousingGrantParticipation(determined, STATE_A_ID).governance.intergovernmentalProgramRelationships).toHaveLength(1);
  });

  it("rejects duplicate decisions, applications, determinations, and relationships", () => {
    const program = establishProgram();
    const decided = resolveStateHousingGrantDecision(program, STATE_A_ID);
    expect(() => resolveStateHousingGrantDecision(decided, STATE_A_ID)).toThrow(/already resolved/);

    const applied = submitStateHousingGrantApplication(decided, STATE_A_ID);
    expect(() => submitStateHousingGrantApplication(applied, STATE_A_ID)).toThrow(/already submitted/);

    const determined = resolveFederalHousingGrantApplication(applied, STATE_A_ID);
    expect(() => resolveFederalHousingGrantApplication(determined, STATE_A_ID)).toThrow(
      /already exists/,
    );

    const active = activateIntergovernmentalHousingGrantParticipation(determined, STATE_A_ID);
    expect(() => activateIntergovernmentalHousingGrantParticipation(active, STATE_A_ID)).toThrow(
      /already active/,
    );
  });

  it("keeps the full financial position unchanged through all Commit-11 routes", () => {
    const program = establishProgram();
    const beforePublicFinance = program.governance.publicFinance;
    const beforeFiscalExecution = program.governance.fiscalExecution;
    const completed = completeStateRoute(
      completeStateRoute(program, STATE_A_ID),
      STATE_C_ID,
    );

    expect(completed.governance.publicFinance).toEqual(beforePublicFinance);
    expect(completed.governance.fiscalExecution).toEqual(beforeFiscalExecution);
    expect(completed.governance.publicFinance.housingGrant?.availableAmount).toBe(
      HOUSING_GRANT_SYNTHETIC_APPROPRIATION_AMOUNT,
    );
    expect(completed.governance.fiscalExecution?.obligated).toBe(0);
    expect(completed.governance.publicFinance.housingGrant?.disbursedAmount).toBe(0);
  });

  it("keeps binding law terms out of state, administrative, application, determination, and relationship state", () => {
    const completed = completeStateRoute(establishProgram(), STATE_A_ID);
    const state = completed.governance.stateJurisdictions[0];
    const administrativeState = completed.governance.stateProgramAdministrativeStates[0];
    const decision = completed.governance.stateProgramDecisions[0];
    const application = completed.governance.programApplications[0];
    const determination = completed.governance.federalApplicationDeterminations[0];
    const relationship = completed.governance.intergovernmentalProgramRelationships[0];

    for (const value of [state, administrativeState, decision, application, determination, relationship]) {
      expect(value).not.toHaveProperty("federalMatchRatePercent");
      expect(value).not.toHaveProperty("participationCondition");
      expect(value).not.toHaveProperty("reportingRequirement");
    }
    expect(completed.governance.housingGrantProgram).not.toHaveProperty(
      "federalMatchRatePercent",
    );
  });

  it("preserves State C weak capacity, owned by the separate fixture state, without turning it into a money or material effect", () => {
    const program = establishProgram();
    const completed = completeStateRoute(program, STATE_C_ID);
    const stateC = completed.governance.stateProgramAdministrativeStates.find(
      (state) => state.stateJurisdictionId === STATE_C_ID,
    );

    expect(stateC?.administrativeCapacity).toBe("WEAK");
    // Capacity never mutates law, public finance, fiscal execution, or program terms.
    expect(completed.governance.enactedLaws).toEqual(program.governance.enactedLaws);
    expect(completed.governance.publicFinance).toEqual(program.governance.publicFinance);
    expect(completed.governance.fiscalExecution).toEqual(program.governance.fiscalExecution);
    expect(completed.governance.housingGrantProgram).toEqual(program.governance.housingGrantProgram);
    expect(completed.governance).not.toHaveProperty("housing");
    expect(completed.governance).not.toHaveProperty("awards");
  });

  it("records state, federal, and relationship occurrences without making history the owner", () => {
    const completed = completeStateRoute(establishProgram(), STATE_A_ID);
    const types = completed.history.map((entry) => entry.type);

    expect(types).toContain("StateProgramDecisionResolved");
    expect(types).toContain("StateProgramApplicationSubmitted");
    expect(types).toContain("FederalProgramApplicationAccepted");
    expect(types).toContain("IntergovernmentalProgramRelationshipActivated");
    expect(completed.history.filter((entry) => entry.type === "StateProgramDecisionResolved")).toHaveLength(1);
  });

  it("projects state and federal facts without exposing canonical simulation objects", () => {
    const session = createGameSession();
    session.submitHousingGrantProposal(INITIAL_TERMS);
    session.amendHousingGrantProposal(COMPROMISE_TERMS);
    session.resolveHousingGrantProposalVote();
    session.recognizeHousingGrantFiscalAuthority();
    session.establishHousingGrantProgram();
    session.resolveStateHousingGrantDecision(STATE_A_ID);
    session.submitStateHousingGrantApplication(STATE_A_ID);
    session.resolveFederalHousingGrantApplication(STATE_A_ID);
    const view = session.activateIntergovernmentalHousingGrantParticipation(STATE_A_ID);
    const stateA = view.statePrograms.find((state) => state.id === STATE_A_ID);

    expect(stateA).toEqual({
      id: STATE_A_ID,
      capacity: "ADEQUATE",
      decision: "APPLY",
      applicationId: expect.any(String),
      federalDetermination: "ACCEPTED",
      participation: "ACTIVE",
      award: null,
      obligation: null,
      disbursement: null,
      housingProject: null,
    });
    expect(view.housingGrantProgram).toMatchObject({
      federalMatchRatePercent: COMPROMISE_TERMS.federalMatchRatePercent,
      participationCondition: COMPROMISE_TERMS.participationCondition,
      reportingRequirement: COMPROMISE_TERMS.reportingRequirement,
    });
  });

  it("produces identical canonical results and history for equivalent deterministic executions", () => {
    const run = () => {
      let world = establishProgram();
      world = completeStateRoute(world, STATE_A_ID);
      world = completeStateRoute(world, STATE_C_ID);
      world = resolveStateHousingGrantDecision(world, STATE_B_ID);
      return { governance: world.governance, history: world.history };
    };

    expect(run()).toEqual(run());
  });
});
