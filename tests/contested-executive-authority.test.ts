import {
  FEDERAL_HOUSING_ADMINISTRATION_INSTITUTION_ID,
  GL0_DISPUTED_HOUSING_CLAIMED_LEGAL_BASIS,
  GL0_DISPUTED_HOUSING_REDIRECTION_AMOUNT,
  GL0_EXECUTIVE_OFFICE_ID,
  GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
  STATE_A_ID,
  STATE_B_ID,
  STATE_C_ID,
  GL0_HOUSING_REDIRECTION_CONTEST_ID,
  GL0_JUDGE_ACTOR_ID,
  GL0_JUDICIAL_INSTITUTION_ID,
  GL0_JUDICIAL_OFFICE_ID,
  GL0_TEMPORARY_HOUSING_REDIRECTION_ORDER_ID,
} from "../src/content/gl0-synthetic/configuration";
import { describe, expect, it } from "vitest";

import { createDeterministicWorldFixture } from "../src/content/gl0-synthetic/configuration";

import { createGameSession, type GameSession } from "../src/app/session";




import {
  activateIntergovernmentalHousingGrantParticipation,
  amendHousingGrantProposal,
  attemptDisputedHousingFundsRedirection,
  createHousingGrantAward,
  disburseHousingGrantObligation,
  establishHousingGrantProgram,
  materializeHousingProjectFromDisbursement,
  obligateHousingGrantAward,
  recognizeHousingGrantFiscalAuthority,
  resolveContestedAuthorityComplianceBoundary,
  resolveContestedAuthorityInterimReliefBoundary,
  resolveFederalHousingGrantApplication,
  resolveHousingGrantProposalVote,
  resolveHousingImplementationResponse,
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

const createDay5World = (): WorldState => {
  let world = establishProgram();
  world = materializeStateProject(world, STATE_A_ID);
  world = materializeStateProject(world, STATE_C_ID);
  world = advanceWorldTo(world, 5);
  return resolveHousingImplementationResponse(world, "PRESERVE_SUPPORT_RESERVE");
};

const createDay6AttemptWorld = (): WorldState =>
  attemptDisputedHousingFundsRedirection(advanceWorldTo(createDay5World(), 6));

const createDay8World = (): WorldState => advanceWorldTo(createDay6AttemptWorld(), 8);

const createDay9World = (): WorldState => advanceWorldTo(createDay6AttemptWorld(), 9);

const createDay5Session = (): GameSession => {
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
  session.preserveHousingImplementationSupportReserve();
  return session;
};

const hostileHistory = (world: WorldState) =>
  world.history.filter((occurrence) =>
    [
      "ExecutiveFundsRedirectionAttempted",
      "AdministrativeRedirectionInstructionReceived",
      "LegalClaimFiled",
      "LegalContestAdmitted",
      "InterimReliefDecided",
      "JudicialOrderIssued",
      "JudicialOrderDelivered",
      "JudicialOrderComplianceResolved",
      "ExecutiveJudicialResponseRecorded",
      "JudicialReviewRequested",
    ].includes(occurrence.type),
  );

describe("Commit 23 contested executive authority and independent compliance", () => {
  it("1. leaves the accepted ordinary succession route green", () => {
    const session = createDay5Session();
    const day70 = session.advanceTo(70);

    expect(day70.electoralAudit.electionProcess.result?.outcome).toBe("OPPOSITION_WIN");
    expect(day70.executiveSuccessionAudit.currentOfficeAssignment.actorId).not.toBe(
      GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
    );
    expect(day70.controlBindingAudit.status).toBe("ENDED");
  });

  it("2. creates no hostile claim, contest, order, receipt, or compliance without an attempt", () => {
    const day12 = advanceWorldTo(createDay5World(), 12);

    expect(day12.governance.executiveAuthority.disputedHousingFundsRedirectionAttempts).toEqual([]);
    expect(day12.governance.judiciary.legalClaims).toEqual([]);
    expect(day12.governance.judiciary.legalContests).toEqual([]);
    expect(day12.governance.judicialLegalOrder.operativeOrders).toEqual([]);
    expect(day12.governance.contestedHousingAdministration).toMatchObject({
      disputedRedirections: [],
      judicialOrderReceipts: [],
      judicialOrderComplianceResponses: [],
    });
  });

  it("3. exposes the disputed attempt only as an active-control strategic session intent", () => {
    const active = createDay5Session();
    active.advanceTo(6);
    expect(active.attemptDisputedHousingFundsRedirection().contestedAuthorityAudit.executiveAttempt)
      .toMatchObject({ status: "ATTEMPTED" });

    const ended = createDay5Session();
    ended.advanceTo(63);
    expect(() => ended.attemptDisputedHousingFundsRedirection()).toThrow(
      /No active ControlBinding.*decision surface unavailable/i,
    );
  });

  it("4. admits the actor-attemptable directive with a claimed basis but no legality boolean", () => {
    const attempt = createDay6AttemptWorld().governance.executiveAuthority
      .disputedHousingFundsRedirectionAttempts[0];

    expect(attempt).toMatchObject({
      initiatingActorId: GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
      executiveOfficeId: GL0_EXECUTIVE_OFFICE_ID,
      disputedAmount: GL0_DISPUTED_HOUSING_REDIRECTION_AMOUNT,
      claimedLegalBasis: GL0_DISPUTED_HOUSING_CLAIMED_LEGAL_BASIS,
      attemptedAtSimulationTime: 6,
      status: "ATTEMPTED",
    });
    expect(attempt).not.toHaveProperty("isActuallyLegal");
    expect(attempt).not.toHaveProperty("legalStatus");
  });

  it("5. does not mutate PublicFinance, FiscalExecution, awards, or Housing on attempt", () => {
    const before = advanceWorldTo(createDay5World(), 6);
    const after = attemptDisputedHousingFundsRedirection(before);

    expect(after.governance.publicFinance).toEqual(before.governance.publicFinance);
    expect(after.governance.fiscalExecution).toEqual(before.governance.fiscalExecution);
    expect(after.governance.housingGrantAwards).toEqual(before.governance.housingGrantAwards);
    expect(after.housing).toEqual(before.housing);
  });

  it("6. makes the target administration separately receive and prepare the directive", () => {
    const world = createDay6AttemptWorld();
    const attempt = world.governance.executiveAuthority.disputedHousingFundsRedirectionAttempts[0];
    const administrative = world.governance.contestedHousingAdministration.disputedRedirections[0];

    expect(administrative).toEqual({
      sourceAttemptId: attempt.id,
      targetInstitutionId: FEDERAL_HOUSING_ADMINISTRATION_INSTITUTION_ID,
      status: "PREPARING_REDIRECTION",
      receivedAtSimulationTime: 6,
    });
  });

  it("7. keeps executive attempt distinct from agency receipt and compliance", () => {
    const world = createDay6AttemptWorld();

    expect(world.governance.executiveAuthority.disputedHousingFundsRedirectionAttempts).toHaveLength(1);
    expect(world.governance.contestedHousingAdministration.disputedRedirections).toHaveLength(1);
    expect(
      world.governance.contestedHousingAdministration.judicialOrderComplianceResponses,
    ).toEqual([]);
  });

  it("8. files State A's bounded legal claim as a separate canonical assertion", () => {
    const day7 = advanceWorldTo(createDay6AttemptWorld(), 7);
    const claim = day7.governance.judiciary.legalClaims[0];

    expect(claim).toMatchObject({
      claimantJurisdictionId: STATE_A_ID,
      targetInstitutionId: FEDERAL_HOUSING_ADMINISTRATION_INSTITUTION_ID,
      claimedGround: "EXECUTIVE_REDIRECTION_EXCEEDS_EXISTING_HOUSING_AUTHORITY",
      requestedRemedy: "TEMPORARY_NONEXECUTION_ORDER",
      filedAtSimulationTime: 7,
    });
  });

  it("9. lets the legal claim exist without creating legal truth or an order", () => {
    const day7 = advanceWorldTo(createDay6AttemptWorld(), 7);

    expect(day7.governance.judiciary.legalClaims[0]).not.toHaveProperty("isLegalTruth");
    expect(day7.governance.judicialLegalOrder.operativeOrders).toEqual([]);
    expect(day7.governance.contestedHousingAdministration.disputedRedirections[0].status).toBe(
      "PREPARING_REDIRECTION",
    );
  });

  it("10. admits the legal contest after filing and before any order exists", () => {
    const day7 = advanceWorldTo(createDay6AttemptWorld(), 7);
    const contest = day7.governance.judiciary.legalContests[0];
    const historyTypes = hostileHistory(day7).map((occurrence) => occurrence.type);

    expect(contest).toMatchObject({
      id: GL0_HOUSING_REDIRECTION_CONTEST_ID,
      proceduralStage: "INTERIM_RELIEF_PENDING",
      admittedAtSimulationTime: 7,
      interimReliefDecision: null,
      judicialOrderIds: [],
    });
    expect(historyTypes.indexOf("LegalClaimFiled")).toBeLessThan(
      historyTypes.indexOf("LegalContestAdmitted"),
    );
  });

  it("11. keeps judicial institution, office, judge actor, and assignment distinct", () => {
    const judiciary = createDeterministicWorldFixture().governance.judiciary;

    expect(judiciary.institution.id).toBe(GL0_JUDICIAL_INSTITUTION_ID);
    expect(judiciary.office).toEqual({
      id: GL0_JUDICIAL_OFFICE_ID,
      institutionId: GL0_JUDICIAL_INSTITUTION_ID,
    });
    expect(judiciary.judgeActor).toEqual({ id: GL0_JUDGE_ACTOR_ID });
    expect(judiciary.officeAssignment).toEqual({
      officeId: GL0_JUDICIAL_OFFICE_ID,
      actorId: GL0_JUDGE_ACTOR_ID,
      effectiveAtSimulationTime: 0,
    });
    expect(GL0_JUDGE_ACTOR_ID).not.toBe(GL0_JUDICIAL_OFFICE_ID);
  });

  it("12. gives the executive ControlBinding no judicial outcome command", () => {
    const session = createGameSession();

    expect(session).not.toHaveProperty("grantInterimRelief");
    expect(session).not.toHaveProperty("issueJudicialOrder");
    expect(session).not.toHaveProperty("alterLegalContestStage");
  });

  it("13. produces an autonomous deterministic GRANT decision on day 8", () => {
    const decision = createDay8World().governance.judiciary.legalContests[0]
      .interimReliefDecision;

    expect(decision).toMatchObject({
      judgeActorId: GL0_JUDGE_ACTOR_ID,
      outcome: "GRANT",
      decisionSource: "AUTONOMOUS_DETERMINISTIC_FIXTURE",
      decidedAtSimulationTime: 8,
    });
  });

  it("14. represents the judicial decision and operative order as distinct records", () => {
    const day8 = createDay8World();
    const decision = day8.governance.judiciary.legalContests[0].interimReliefDecision!;
    const order = day8.governance.judicialLegalOrder.operativeOrders[0];

    expect(order.id).not.toBe(decision.id);
    expect(order.sourceDecisionId).toBe(decision.id);
    expect(decision).not.toHaveProperty("directive");
  });

  it("15. owns the operative order only in judicial legal-order state", () => {
    const day8 = createDay8World();
    const contest = day8.governance.judiciary.legalContests[0];

    expect(day8.governance.judicialLegalOrder.operativeOrders).toHaveLength(1);
    expect(contest.judicialOrderIds).toEqual([GL0_TEMPORARY_HOUSING_REDIRECTION_ORDER_ID]);
    expect(contest).not.toHaveProperty("order");
  });

  it("16. lets the contest reference the order without shadow-owning its status", () => {
    const contest = createDay8World().governance.judiciary.legalContests[0];

    expect(contest.judicialOrderIds).toEqual([GL0_TEMPORARY_HOUSING_REDIRECTION_ORDER_ID]);
    expect(contest).not.toHaveProperty("orderStatus");
    expect(contest).not.toHaveProperty("orderActive");
  });

  it("17. scopes the temporary order to the agency, attempt, conduct, and time", () => {
    const day8 = createDay8World();
    const attempt = day8.governance.executiveAuthority.disputedHousingFundsRedirectionAttempts[0];
    const order = day8.governance.judicialLegalOrder.operativeOrders[0];

    expect(order).toMatchObject({
      subjectInstitutionId: FEDERAL_HOUSING_ADMINISTRATION_INSTITUTION_ID,
      challengedAttemptId: attempt.id,
      directive: "DO_NOT_EXECUTE_DISPUTED_HOUSING_FUNDS_REDIRECTION",
      issuedAtSimulationTime: 8,
      effectiveAtSimulationTime: 8,
      temporalScope: "UNTIL_FURTHER_JUDICIAL_ORDER_OR_MERITS_RESOLUTION",
      orderType: "INTERIM",
      status: "ACTIVE",
    });
  });

  it("18. leaves fiscal state untouched and Housing on its ordinary time progression at issuance", () => {
    const day7 = advanceWorldTo(createDay6AttemptWorld(), 7);
    const boundary = resolveContestedAuthorityInterimReliefBoundary(
      day7.governance,
      day7.runtimeConfiguration,
      8,
      8,
    );
    const day8 = advanceWorldTo(day7, 8);
    const expectedHousing = advanceHousing(day7.housing, 7, 8).housing;

    expect(boundary.governance.publicFinance).toEqual(day7.governance.publicFinance);
    expect(boundary.governance.fiscalExecution).toEqual(day7.governance.fiscalExecution);
    expect(day8.housing).toEqual(expectedHousing);
    expect(day8.population).toEqual(day7.population);
  });

  it("19. records decision before issuance before delivery at the day-8 timestamp", () => {
    const history = hostileHistory(createDay8World());
    const types = history.map((occurrence) => occurrence.type);

    expect(types.indexOf("InterimReliefDecided")).toBeLessThan(
      types.indexOf("JudicialOrderIssued"),
    );
    expect(types.indexOf("JudicialOrderIssued")).toBeLessThan(
      types.indexOf("JudicialOrderDelivered"),
    );
    expect(history.filter((occurrence) => occurrence.at === 8)).toHaveLength(3);
  });

  it("20. records delivery without automatically resolving compliance", () => {
    const day8 = createDay8World();

    expect(day8.governance.contestedHousingAdministration.judicialOrderReceipts).toEqual([
      {
        orderId: GL0_TEMPORARY_HOUSING_REDIRECTION_ORDER_ID,
        recipientInstitutionId: FEDERAL_HOUSING_ADMINISTRATION_INSTITUTION_ID,
        receivedAtSimulationTime: 8,
      },
    ]);
    expect(
      day8.governance.contestedHousingAdministration.judicialOrderComplianceResponses,
    ).toEqual([]);
  });

  it("21. independently resolves the normal agency fixture to COMPLY on day 9", () => {
    const response = createDay9World().governance.contestedHousingAdministration
      .judicialOrderComplianceResponses[0];

    expect(response).toEqual({
      orderId: GL0_TEMPORARY_HOUSING_REDIRECTION_ORDER_ID,
      institutionId: FEDERAL_HOUSING_ADMINISTRATION_INSTITUTION_ID,
      response: "COMPLY",
      resolvedAtSimulationTime: 9,
    });
  });

  it("22. halts agency preparation on COMPLY while the legal order stays ACTIVE", () => {
    const day9 = createDay9World();

    expect(day9.governance.contestedHousingAdministration.disputedRedirections[0].status).toBe(
      "HALTED_BY_JUDICIAL_ORDER",
    );
    expect(day9.governance.judicialLegalOrder.operativeOrders[0].status).toBe("ACTIVE");
  });

  it("23. records focused REFUSE as noncompliance while leaving the order ACTIVE", () => {
    const day8 = createDay8World();
    const refused = resolveContestedAuthorityComplianceBoundary(day8.governance, "REFUSE", 9, 9);

    expect(
      refused.governance.contestedHousingAdministration.judicialOrderComplianceResponses[0]
        .response,
    ).toBe("REFUSE");
    expect(refused.governance.contestedHousingAdministration.disputedRedirections[0].status).toBe(
      "PREPARING_REDIRECTION",
    );
    expect(refused.governance.judicialLegalOrder.operativeOrders[0].status).toBe("ACTIVE");
  });

  it("24. makes REFUSE incapable of moving funds or creating fiscal execution", () => {
    const day8 = createDay8World();
    const refused = resolveContestedAuthorityComplianceBoundary(day8.governance, "REFUSE", 9, 9);

    expect(refused.governance.publicFinance).toEqual(day8.governance.publicFinance);
    expect(refused.governance.fiscalExecution).toEqual(day8.governance.fiscalExecution);
    expect(refused.governance.housingGrantAwards).toEqual(day8.governance.housingGrantAwards);
  });

  it("25. preserves all pre-attempt award, obligation, disbursement, project, and stock history", () => {
    const day6 = advanceWorldTo(createDay5World(), 6);
    const priorFiscalHistory = day6.history.filter((occurrence) =>
      [
        "HousingGrantAwardCreated",
        "HousingGrantObligationRecorded",
        "HousingGrantDisbursementMade",
        "HousingProjectCreated",
      ].includes(occurrence.type),
    );
    const day9 = advanceWorldTo(attemptDisputedHousingFundsRedirection(day6), 9);

    expect(
      day9.history.filter((occurrence) =>
        [
          "HousingGrantAwardCreated",
          "HousingGrantObligationRecorded",
          "HousingGrantDisbursementMade",
          "HousingProjectCreated",
        ].includes(occurrence.type),
      ),
    ).toEqual(priorFiscalHistory);
    expect(day9.governance.housingGrantAwards).toEqual(day6.governance.housingGrantAwards);
  });

  it("26. makes BACK_DOWN control-gated and preserves the historical attempt and order", () => {
    const session = createDay5Session();
    session.advanceTo(6);
    session.attemptDisputedHousingFundsRedirection();
    session.advanceTo(9);
    const backedDown = session.backDownFromDisputedHousingFundsRedirection();

    expect(backedDown.contestedAuthorityAudit.executiveAttempt?.status).toBe("WITHDRAWN");
    expect(backedDown.contestedAuthorityAudit.executiveResponse?.action).toBe("BACK_DOWN");
    expect(backedDown.contestedAuthorityAudit.judicialOrder?.status).toBe("ACTIVE");
    expect(backedDown.contestedAuthorityAudit.executiveAttempt).not.toBeNull();

    const ended = createDay5Session();
    ended.advanceTo(63);
    expect(() => ended.backDownFromDisputedHousingFundsRedirection()).toThrow(
      /No active ControlBinding/i,
    );
  });

  it("27. makes APPEAL_WHILE_COMPLYING create only a review request without a stay", () => {
    const session = createDay5Session();
    session.advanceTo(6);
    session.attemptDisputedHousingFundsRedirection();
    session.advanceTo(9);
    const appealed = session.appealHousingRedirectionOrderWhileComplying();

    expect(appealed.contestedAuthorityAudit.executiveResponse?.action).toBe(
      "APPEAL_WHILE_COMPLYING",
    );
    expect(appealed.contestedAuthorityAudit.legalContest?.reviewRequest).toMatchObject({
      sourceOrderId: GL0_TEMPORARY_HOUSING_REDIRECTION_ORDER_ID,
    });
    expect(appealed.contestedAuthorityAudit.judicialOrder?.status).toBe("ACTIVE");
    expect(appealed.contestedAuthorityAudit.judicialOrder).not.toHaveProperty("stayed");
  });

  it("28. creates no direct Population or election modifier from the court route", () => {
    const normalDay61 = advanceWorldTo(createDay5World(), 61);
    const hostileDay61 = advanceWorldTo(createDay6AttemptWorld(), 61);

    expect(hostileDay61.population).toEqual(normalDay61.population);
    expect(hostileDay61.electoral).toEqual(normalDay61.electoral);
    expect(hostileDay61.housing).toEqual(normalDay61.housing);
    expect(hostileDay61.governance.publicFinance).toEqual(
      normalDay61.governance.publicFinance,
    );
    expect(hostileDay61.governance.fiscalExecution).toEqual(
      normalDay61.governance.fiscalExecution,
    );
  });

  it("29. makes direct 6→12 equal chunked 6→7→8→9→12 including meaningful history", () => {
    const day6 = createDay6AttemptWorld();
    const direct = advanceWorldTo(day6, 12);
    const chunked = advanceWorldTo(
      advanceWorldTo(advanceWorldTo(advanceWorldTo(day6, 7), 8), 9),
      12,
    );

    expect(chunked).toEqual(direct);
    expect(hostileHistory(chunked)).toEqual(hostileHistory(direct));
  });

  it("30. exposes complete hostile developer/audit truth without changing the normal player view", () => {
    const session = createDay5Session();
    session.advanceTo(6);
    session.attemptDisputedHousingFundsRedirection();
    const audit = session.advanceTo(9).contestedAuthorityAudit;

    expect(audit.executiveAttempt).toMatchObject({
      disputedAmount: 500_000_000,
      status: "ATTEMPTED",
    });
    expect(audit.legalContest).toMatchObject({ proceduralStage: "MERITS_PENDING" });
    expect(audit.judicialOrder).toMatchObject({ status: "ACTIVE" });
    expect(audit.agency).toMatchObject({
      redirectionStatus: "HALTED_BY_JUDICIAL_ORDER",
      complianceResponse: { response: "COMPLY" },
    });
    expect(audit.executiveResponse).toBeNull();
  });
});
