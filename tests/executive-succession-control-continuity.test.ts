import {
  GL0_ADMINISTRATION_CANDIDATE_ID,
  GL0_EXECUTIVE_ELECTION_RESULT_ID,
  GL0_EXECUTIVE_ELECTION_PROCESS_ID,
  GL0_EXECUTIVE_CONTEST_ID,
  GL0_OPPOSITION_CANDIDATE_ID,
  GL0_EXECUTIVE_INSTITUTION_ID,
  GL0_EXECUTIVE_OFFICE_ID,
  GL0_EXECUTIVE_TRANSFER_AT,
  GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
  GL0_OPPOSITION_EXECUTIVE_ACTOR_ID,
  GL0_SUCCESSOR_ENTITLEMENT_AT,
  GL0_SUCCESSOR_ENTITLEMENT_ID,
  GL0_ORDINARY_EXECUTIVE_SUCCESSION_RULE_ID,
  STATE_A_ID,
  STATE_B_ID,
  STATE_C_ID,
} from "../src/content/gl0-synthetic/configuration";
import { describe, expect, it } from "vitest";

import { createDeterministicWorldFixture } from "../src/content/gl0-synthetic/configuration";

import {
  createGameSession,
  GL0_EXECUTIVE_ADMINISTRATION_STRATEGIC_SURFACE,
  GL0_EXECUTIVE_CONTROL_BINDING_ID,
  type GameSession,
} from "../src/app/session";
import {
  type ElectionProcess,
} from "../src/sim/electoral";
import {
  establishExecutiveSuccessorEntitlement,
  resolveCurrentExecutiveOfficeholder,
} from "../src/sim/executive";


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
  world = establishHousingGrantProgram(world);
  return resolveStateHousingGrantDecision(world, STATE_B_ID);
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

const resolveWorldRoute = (
  action: "DEPLOY_SUPPORT" | "PRESERVE_SUPPORT_RESERVE",
): WorldState => {
  let world = establishProgram();
  world = materializeStateProject(world, STATE_A_ID);
  world = materializeStateProject(world, STATE_C_ID);
  world = advanceWorldTo(world, 5);
  return resolveHousingImplementationResponse(world, action);
};

const resolveSessionRoute = (
  action: "DEPLOY_SUPPORT" | "PRESERVE_SUPPORT_RESERVE",
): GameSession => {
  const session = createGameSession();
  session.submitHousingGrantProposal(INITIAL_TERMS);
  session.amendHousingGrantProposal(COMPROMISE_TERMS);
  session.resolveHousingGrantProposalVote();
  session.recognizeHousingGrantFiscalAuthority();
  session.establishHousingGrantProgram();
  session.resolveStateHousingGrantDecision(STATE_B_ID);
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
  if (action === "DEPLOY_SUPPORT") {
    session.deployHousingImplementationSupportToStateC();
  } else {
    session.preserveHousingImplementationSupportReserve();
  }
  return session;
};

const electionProcessFor = (world: WorldState): ElectionProcess => {
  const process = world.electoral.electionProcesses.find(
    (candidate) => candidate.id === GL0_EXECUTIVE_ELECTION_PROCESS_ID,
  );
  if (process === undefined) throw new Error("Missing GL0 election process.");
  return process;
};

describe("Commit 22 executive succession, control end, and continuity", () => {
  it("1. preserves the Commit-21 certified opposition result", () => {
    const day61 = advanceWorldTo(resolveWorldRoute("PRESERVE_SUPPORT_RESERVE"), 61);
    const process = electionProcessFor(day61);

    expect(process.result).toMatchObject({
      id: GL0_EXECUTIVE_ELECTION_RESULT_ID,
      outcome: "OPPOSITION_WIN",
      winningCandidateId: GL0_OPPOSITION_CANDIDATE_ID,
    });
    expect(process.certification?.sourceResultId).toBe(process.result?.id);
  });

  it("2. owns two persistent executive actors independently of candidacy and office", () => {
    const executive = createDeterministicWorldFixture().governance.executivePolitical;

    expect(executive.actors).toEqual([
      { id: GL0_INCUMBENT_EXECUTIVE_ACTOR_ID },
      { id: GL0_OPPOSITION_EXECUTIVE_ACTOR_ID },
    ]);
    expect(executive.actors.every((actor) => !("candidateId" in actor))).toBe(true);
    expect(executive.actors.every((actor) => !("officeId" in actor))).toBe(true);
  });

  it("3. makes each election candidate reference its persistent actor", () => {
    const candidates = createDeterministicWorldFixture().electoral.candidates;

    expect(candidates).toEqual([
      {
        id: GL0_ADMINISTRATION_CANDIDATE_ID,
        actorId: GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
        alignment: "ADMINISTRATION",
      },
      {
        id: GL0_OPPOSITION_CANDIDATE_ID,
        actorId: GL0_OPPOSITION_EXECUTIVE_ACTOR_ID,
        alignment: "OPPOSITION",
      },
    ]);
  });

  it("4. keeps candidate IDs distinct from PoliticalActor IDs", () => {
    const candidates = createDeterministicWorldFixture().electoral.candidates;

    expect(candidates.every((candidate) => candidate.id !== candidate.actorId)).toBe(true);
    expect(GL0_ADMINISTRATION_CANDIDATE_ID).not.toBe(GL0_INCUMBENT_EXECUTIVE_ACTOR_ID);
    expect(GL0_OPPOSITION_CANDIDATE_ID).not.toBe(GL0_OPPOSITION_EXECUTIVE_ACTOR_ID);
  });

  it("5. creates a persistent executive institution and office independently of actors", () => {
    const executive = createDeterministicWorldFixture().governance.executivePolitical;

    expect(executive.institution).toEqual({ id: GL0_EXECUTIVE_INSTITUTION_ID });
    expect(executive.office).toMatchObject({
      id: GL0_EXECUTIVE_OFFICE_ID,
      institutionId: GL0_EXECUTIVE_INSTITUTION_ID,
      successionRuleId: GL0_ORDINARY_EXECUTIVE_SUCCESSION_RULE_ID,
    });
    expect(executive.office).not.toHaveProperty("successionRequirement");
    expect(executive.office.id).not.toBe(executive.currentOfficeAssignment.actorId);
  });

  it("6. initially assigns the executive office to the incumbent actor", () => {
    const executive = createDeterministicWorldFixture().governance.executivePolitical;

    expect(executive.currentOfficeAssignment).toEqual({
      officeId: GL0_EXECUTIVE_OFFICE_ID,
      actorId: GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
      effectiveAtSimulationTime: 0,
    });
    expect(resolveCurrentExecutiveOfficeholder(executive).id).toBe(
      GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
    );
  });

  it("7. keeps ControlBinding in GameSession and absent from canonical WorldState", () => {
    const world = createDeterministicWorldFixture();
    const view = createGameSession().getView();

    expect(world).not.toHaveProperty("controlBinding");
    expect(world.governance).not.toHaveProperty("controlBinding");
    expect(view.controlBindingAudit.id).toBe(GL0_EXECUTIVE_CONTROL_BINDING_ID);
  });

  it("8. starts with one active incumbent executive strategic binding", () => {
    expect(createGameSession().getView().controlBindingAudit).toEqual({
      id: GL0_EXECUTIVE_CONTROL_BINDING_ID,
      decisionSurface: GL0_EXECUTIVE_ADMINISTRATION_STRATEGIC_SURFACE,
      executiveOfficeId: GL0_EXECUTIVE_OFFICE_ID,
      boundOfficeholderActorId: GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
      status: "ACTIVE",
      endedAtSimulationTime: null,
      endReason: null,
    });
  });

  it("9. keeps the incumbent, no entitlement, and active binding on PRESERVE day 61", () => {
    const session = resolveSessionRoute("PRESERVE_SUPPORT_RESERVE");
    const view = session.advanceTo(61);

    expect(view.electoralAudit.electionProcess.certification?.status).toBe("CERTIFIED");
    expect(view.electoralAudit.electionProcess.result?.outcome).toBe("OPPOSITION_WIN");
    expect(view.executiveSuccessionAudit.currentOfficeAssignment.actorId).toBe(
      GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
    );
    expect(view.executiveSuccessionAudit.successorEntitlement).toBeNull();
    expect(view.controlBindingAudit.status).toBe("ACTIVE");
  });

  it("10. establishes opposition entitlement on day 62 without changing the officeholder or binding", () => {
    const session = resolveSessionRoute("PRESERVE_SUPPORT_RESERVE");
    const view = session.advanceTo(GL0_SUCCESSOR_ENTITLEMENT_AT);

    expect(view.executiveSuccessionAudit.successorEntitlement).toMatchObject({
      id: GL0_SUCCESSOR_ENTITLEMENT_ID,
      entitledActorId: GL0_OPPOSITION_EXECUTIVE_ACTOR_ID,
      establishedAtSimulationTime: 62,
      scheduledTransferAtSimulationTime: 63,
    });
    expect(view.executiveSuccessionAudit.currentOfficeAssignment.actorId).toBe(
      GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
    );
    expect(view.controlBindingAudit.status).toBe("ACTIVE");
  });

  it("11. derives entitlement through certification → result → candidate → actor and legal rule", () => {
    const day61 = advanceWorldTo(resolveWorldRoute("PRESERVE_SUPPORT_RESERVE"), 61);
    expect(() =>
      establishExecutiveSuccessorEntitlement(
        day61.governance.executivePolitical,
        day61.electoral,
        { rules: [] },
        62,
        {
          contestId: GL0_EXECUTIVE_CONTEST_ID,
          entitlementId: GL0_SUCCESSOR_ENTITLEMENT_ID,
          entitlementAt: GL0_SUCCESSOR_ENTITLEMENT_AT,
          transferAt: GL0_EXECUTIVE_TRANSFER_AT,
        },
      ),
    ).toThrow(/legal order requires exactly one executive succession rule/i);

    const day62 = advanceWorldTo(day61, 62);
    const entitlement = day62.governance.executivePolitical.succession.successorEntitlement;
    const winningCandidate = day62.electoral.candidates.find(
      (candidate) => candidate.id === electionProcessFor(day62).result?.winningCandidateId,
    );
    expect(entitlement).toMatchObject({
      sourceCertificationId: electionProcessFor(day62).certification?.id,
      sourceResultId: electionProcessFor(day62).result?.id,
      sourceWinningCandidateId: winningCandidate?.id,
      entitledActorId: winningCandidate?.actorId,
    });
  });

  it("12. transfers the same executive office to the opposition actor on day 63", () => {
    const day62 = advanceWorldTo(resolveWorldRoute("PRESERVE_SUPPORT_RESERVE"), 62);
    const officeId = day62.governance.executivePolitical.office.id;
    const day63 = advanceWorldTo(day62, GL0_EXECUTIVE_TRANSFER_AT);

    expect(day63.governance.executivePolitical.office.id).toBe(officeId);
    expect(day63.governance.executivePolitical.currentOfficeAssignment).toEqual({
      officeId,
      actorId: GL0_OPPOSITION_EXECUTIVE_ACTOR_ID,
      effectiveAtSimulationTime: 63,
    });
  });

  it("13. changes assignment without mutating the election result or certification", () => {
    const day62 = advanceWorldTo(resolveWorldRoute("PRESERVE_SUPPORT_RESERVE"), 62);
    const electoralSnapshot = structuredClone(day62.electoral);
    const day63 = advanceWorldTo(day62, 63);

    expect(day63.electoral).toEqual(electoralSnapshot);
  });

  it("14. ends the outgoing ControlBinding at the day-63 transfer boundary", () => {
    const session = resolveSessionRoute("PRESERVE_SUPPORT_RESERVE");
    const view = session.advanceTo(63);

    expect(view.controlBindingAudit).toMatchObject({
      status: "ENDED",
      boundOfficeholderActorId: GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
      endedAtSimulationTime: 63,
      endReason: "BOUND_OFFICEHOLDER_CHANGED",
    });
  });

  it("15. never creates a successor player binding", () => {
    const session = resolveSessionRoute("PRESERVE_SUPPORT_RESERVE");
    const binding = session.advanceTo(70).controlBindingAudit;

    expect(binding.id).toBe(GL0_EXECUTIVE_CONTROL_BINDING_ID);
    expect(binding.status).toBe("ENDED");
    expect(binding.boundOfficeholderActorId).toBe(GL0_INCUMBENT_EXECUTIVE_ACTOR_ID);
    expect(binding.boundOfficeholderActorId).not.toBe(GL0_OPPOSITION_EXECUTIVE_ACTOR_ID);
  });

  it("16. rejects a strategic player intent after transfer for lack of active control", () => {
    const session = resolveSessionRoute("PRESERVE_SUPPORT_RESERVE");
    session.advanceTo(63);

    expect(() => session.preserveHousingImplementationSupportReserve()).toThrow(
      /no active ControlBinding.*decision surface unavailable/i,
    );
    expect(() => session.submitHousingGrantProposal(INITIAL_TERMS)).toThrow(
      /no active ControlBinding.*decision surface unavailable/i,
    );
  });

  it("17. continues advancing the same world after control ends", () => {
    const session = resolveSessionRoute("PRESERVE_SUPPORT_RESERVE");
    expect(session.advanceTo(63).controlBindingAudit.status).toBe("ENDED");
    const day70 = session.advanceTo(70);

    expect(day70.currentTime).toBe(70);
    expect(day70.controlBindingAudit.status).toBe("ENDED");
    expect(day70.executiveSuccessionAudit.currentOfficeAssignment.actorId).toBe(
      GL0_OPPOSITION_EXECUTIVE_ACTOR_ID,
    );
  });

  it("18. creates no successor entitlement for the certified DEPLOY tie", () => {
    const day70 = advanceWorldTo(resolveWorldRoute("DEPLOY_SUPPORT"), 70);

    expect(electionProcessFor(day70).result).toMatchObject({
      outcome: "TIE",
      winningCandidateId: null,
    });
    expect(day70.governance.executivePolitical.succession.successorEntitlement).toBeNull();
    expect(
      day70.history.filter((occurrence) => occurrence.type === "SuccessorEntitlementEstablished"),
    ).toHaveLength(0);
  });

  it("19. performs no office transfer for the DEPLOY tie", () => {
    const day70 = advanceWorldTo(resolveWorldRoute("DEPLOY_SUPPORT"), 70);

    expect(day70.governance.executivePolitical.currentOfficeAssignment.actorId).toBe(
      GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
    );
    expect(day70.governance.executivePolitical.succession.transferResolvedAtSimulationTime).toBeNull();
    expect(
      day70.history.filter((occurrence) => occurrence.type === "ExecutiveOfficeTransferred"),
    ).toHaveLength(0);
  });

  it("20. leaves the incumbent ControlBinding active on the DEPLOY tie route", () => {
    const session = resolveSessionRoute("DEPLOY_SUPPORT");
    const day70 = session.advanceTo(70);

    expect(day70.controlBindingAudit).toMatchObject({
      status: "ACTIVE",
      boundOfficeholderActorId: GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
      endedAtSimulationTime: null,
    });
  });

  it("21. preserves law, fiscal, program, state refusal, awards, and Housing across succession", () => {
    const day61 = advanceWorldTo(resolveWorldRoute("PRESERVE_SUPPORT_RESERVE"), 61);
    const day70 = advanceWorldTo(day61, 70);

    expect(day70.governance.enactedLaws).toEqual(day61.governance.enactedLaws);
    expect(day70.governance.publicFinance).toEqual(day61.governance.publicFinance);
    expect(day70.governance.fiscalExecution).toEqual(day61.governance.fiscalExecution);
    expect(day70.governance.housingGrantProgram).toEqual(day61.governance.housingGrantProgram);
    expect(day70.governance.housingGrantAwards).toEqual(day61.governance.housingGrantAwards);
    expect(day70.governance.stateProgramDecisions).toEqual(day61.governance.stateProgramDecisions);
    expect(day70.housing).toEqual(day61.housing);
    expect(
      day70.governance.stateProgramDecisions.find(
        (decision) => decision.stateJurisdictionId === STATE_B_ID,
      )?.decision,
    ).toBe("REFUSE");
    expect(
      day70.history.some(
        (occurrence) =>
          occurrence.type === "StateProgramDecisionResolved" &&
          occurrence.stateJurisdictionId === STATE_B_ID &&
          occurrence.decision === "REFUSE",
      ),
    ).toBe(true);
  });

  it("22. keeps the same operational housing-grant program identity under the successor", () => {
    const day61 = advanceWorldTo(resolveWorldRoute("PRESERVE_SUPPORT_RESERVE"), 61);
    const programId = day61.governance.housingGrantProgram?.id;
    const day70 = advanceWorldTo(day61, 70);

    expect(day70.governance.housingGrantProgram).toMatchObject({
      id: programId,
      status: day61.governance.housingGrantProgram?.status,
    });
    expect(day70.governance.housingGrantProgram?.status).toBe("READY_FOR_APPLICATIONS");
    expect(day70.governance.executivePolitical.actors.every((actor) => !("program" in actor))).toBe(
      true,
    );
    expect(day70.governance.executivePolitical.currentOfficeAssignment).not.toHaveProperty(
      "housingGrantProgram",
    );
  });

  it("23. preserves public Information, Population political state, and election state", () => {
    const day61 = advanceWorldTo(resolveWorldRoute("PRESERVE_SUPPORT_RESERVE"), 61);
    const day70 = advanceWorldTo(day61, 70);

    expect(day70.information).toEqual(day61.information);
    expect(day70.population).toEqual(day61.population);
    expect(day70.electoral).toEqual(day61.electoral);
  });

  it("24. makes direct 61→70 equal chunked 61→62→63→70 for world state and history", () => {
    const day61 = advanceWorldTo(resolveWorldRoute("PRESERVE_SUPPORT_RESERVE"), 61);
    const direct = advanceWorldTo(day61, 70);
    const chunked = advanceWorldTo(
      advanceWorldTo(advanceWorldTo(day61, 62), 63),
      70,
    );

    expect(chunked).toEqual(direct);
    const historyTypes = direct.history.map((occurrence) => occurrence.type);
    expect(historyTypes.indexOf("ElectionCertified")).toBeLessThan(
      historyTypes.indexOf("SuccessorEntitlementEstablished"),
    );
    expect(historyTypes.indexOf("SuccessorEntitlementEstablished")).toBeLessThan(
      historyTypes.indexOf("ExecutiveOfficeTransferred"),
    );
  });

  it("25. ends session control at day 63 under both coarse and chunked advancement", () => {
    const directSession = resolveSessionRoute("PRESERVE_SUPPORT_RESERVE");
    directSession.advanceTo(61);
    const direct = directSession.advanceTo(70);
    const chunkedSession = resolveSessionRoute("PRESERVE_SUPPORT_RESERVE");
    chunkedSession.advanceTo(61);
    chunkedSession.advanceTo(62);
    chunkedSession.advanceTo(63);
    const chunked = chunkedSession.advanceTo(70);

    expect(direct.controlBindingAudit).toEqual(chunked.controlBindingAudit);
    expect(direct.controlBindingAudit.endedAtSimulationTime).toBe(63);
  });

  it("26. cannot duplicate entitlement, transfer, or their history occurrences", () => {
    const day61 = advanceWorldTo(resolveWorldRoute("PRESERVE_SUPPORT_RESERVE"), 61);
    const day62 = advanceWorldTo(day61, 62);
    const repeated62 = advanceWorldTo(day62, 62);
    const day63 = advanceWorldTo(repeated62, 63);
    const repeated70 = advanceWorldTo(advanceWorldTo(day63, 63), 70);

    expect(repeated62).toEqual(day62);
    expect(
      repeated70.history.filter(
        (occurrence) => occurrence.type === "SuccessorEntitlementEstablished",
      ),
    ).toHaveLength(1);
    expect(
      repeated70.history.filter(
        (occurrence) => occurrence.type === "ExecutiveOfficeTransferred",
      ),
    ).toHaveLength(1);
  });

  it("27. introduces no court or contested-authority state", () => {
    const world = advanceWorldTo(resolveWorldRoute("PRESERVE_SUPPORT_RESERVE"), 70);

    expect(world).not.toHaveProperty("courts");
    expect(world.governance).not.toHaveProperty("judicialContest");
    expect(world.governance.executivePolitical.succession).not.toHaveProperty("challenge");
  });
});
