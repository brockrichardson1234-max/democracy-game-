import {
  FEDERAL_HOUSING_ADMINISTRATION_INSTITUTION_ID,
  GL0_ADMINISTRATION_CANDIDATE_ID,
  GL0_EXECUTIVE_CONTEST_ID,
  GL0_OPPOSITION_CANDIDATE_ID,
  GL0_EXECUTIVE_OFFICE_ID,
  GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
  GL0_OPPOSITION_EXECUTIVE_ACTOR_ID,
  STATE_A_ID,
  STATE_B_ID,
  STATE_C_ID,
  HOUSING_REGION_C_ID,
  INITIAL_HOUSING_STOCK_UNITS,
  ADMINISTRATION_HOUSING_CLAIM_ID,
  OFFICIAL_HOUSING_REPORT_ID,
  POPULATION_UNIT_A_ID,
  POPULATION_UNIT_B_ID,
  POPULATION_UNIT_C_ID,
} from "../src/content/gl0-synthetic/configuration";
import { describe, expect, it } from "vitest";

import { createDeterministicWorldFixture } from "../src/content/gl0-synthetic/configuration";

import type { GameSaveV2 } from "../src/app/persistence";
import {
  createGameSession,
  createGameSessionFromSave,
  type GameSession,
} from "../src/app/session";
import {
  availableHousingImplementationSupportUnits,
  commitHousingImplementationSupport,
} from "../src/sim/administration";



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

type RouteAction = "DEPLOY_SUPPORT" | "PRESERVE_SUPPORT_RESERVE";

const establishProgramWorld = (): WorldState => {
  let world = createDeterministicWorldFixture();
  world = submitHousingGrantProposal(world, INITIAL_TERMS);
  world = amendHousingGrantProposal(world, COMPROMISE_TERMS);
  world = resolveHousingGrantProposalVote(world);
  world = recognizeHousingGrantFiscalAuthority(world);
  return establishHousingGrantProgram(world);
};

const fundStateProject = (world: WorldState, stateId: string): WorldState => {
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
  let world = establishProgramWorld();
  world = fundStateProject(world, STATE_A_ID);
  world = resolveStateHousingGrantDecision(world, STATE_B_ID);
  world = fundStateProject(world, STATE_C_ID);
  return advanceWorldTo(world, 5);
};

const resolveWorldRoute = (action: RouteAction): WorldState =>
  resolveHousingImplementationResponse(createDay5World(), action);

const establishSessionThroughProjects = (): GameSession => {
  const session = createGameSession();
  session.submitHousingGrantProposal(INITIAL_TERMS);
  session.amendHousingGrantProposal(COMPROMISE_TERMS);
  session.resolveHousingGrantProposalVote();
  session.recognizeHousingGrantFiscalAuthority();
  session.establishHousingGrantProgram();
  for (const stateId of [STATE_A_ID, STATE_B_ID, STATE_C_ID]) {
    session.resolveStateHousingGrantDecision(stateId);
    if (stateId === STATE_B_ID) continue;
    session.submitStateHousingGrantApplication(stateId);
    session.resolveFederalHousingGrantApplication(stateId);
    session.activateIntergovernmentalHousingGrantParticipation(stateId);
    session.createHousingGrantAward(stateId);
    session.obligateHousingGrantAward(stateId);
    session.disburseHousingGrantObligation(stateId);
    session.materializeHousingProjectFromDisbursement(stateId);
  }
  session.advanceTo(5);
  return session;
};

const createRouteSession = (action: RouteAction): GameSession => {
  const session = establishSessionThroughProjects();
  if (action === "DEPLOY_SUPPORT") {
    session.deployHousingImplementationSupportToStateC();
  } else {
    session.preserveHousingImplementationSupportReserve();
  }
  return session;
};

const createHostileDay6Session = (): GameSession => {
  const session = createRouteSession("PRESERVE_SUPPORT_RESERVE");
  session.advanceTo(6);
  session.attemptDisputedHousingFundsRedirection();
  return session;
};

const parseEnvelope = (serialized: string): GameSaveV2 =>
  JSON.parse(serialized) as GameSaveV2;

const envelopeFor = (session: GameSession): GameSaveV2 => parseEnvelope(session.save());

const worldFor = (session: GameSession): WorldState => envelopeFor(session).world;

const regionFor = (world: WorldState, stateId: string) => {
  const region = world.housing.regions.find(
    (candidate) => candidate.stateJurisdictionId === stateId,
  );
  if (region === undefined) throw new Error(`Missing Housing region for ${stateId}.`);
  return region;
};

const projectFor = (world: WorldState, stateId: string) => {
  const project = world.housing.projects.find(
    (candidate) => candidate.stateJurisdictionId === stateId,
  );
  if (project === undefined) throw new Error(`Missing Housing project for ${stateId}.`);
  return project;
};

const populationUnitFor = (world: WorldState, unitId: string) => {
  const unit = world.population.units.find((candidate) => candidate.id === unitId);
  if (unit === undefined) throw new Error(`Missing Population unit ${unitId}.`);
  return unit;
};

const electionProcessFor = (world: WorldState) => {
  const process = world.electoral.electionProcesses.find(
    (candidate) => candidate.contestId === GL0_EXECUTIVE_CONTEST_ID,
  );
  if (process === undefined) throw new Error("Missing GL0 election process.");
  return process;
};

const candidateWeight = (world: WorldState, candidateId: string): number =>
  electionProcessFor(world).result?.candidateVoteWeights.find(
    (candidate) => candidate.candidateId === candidateId,
  )?.voteWeight ?? 0;

const historyCount = (world: WorldState, type: string): number =>
  world.history.filter((occurrence) => occurrence.type === type).length;

const stableWorldIdentities = (world: WorldState) => ({
  lawIds: world.governance.enactedLaws.map((law) => law.id),
  programId: world.governance.housingGrantProgram?.id,
  administrativeInstitutionId: world.governance.administrativeInstitution?.id,
  publicFinanceId: world.governance.publicFinance.housingGrant?.id,
  stateIds: world.governance.stateJurisdictions.map((state) => state.id),
  relationshipIds: world.governance.intergovernmentalProgramRelationships.map(
    (relationship) => relationship.id,
  ),
  awardIds: world.governance.housingGrantAwards.map((award) => award.id),
  obligationIds: world.governance.fiscalExecution?.obligations.map(
    (obligation) => obligation.id,
  ),
  disbursementIds: world.governance.publicFinance.housingGrant?.disbursements.map(
    (disbursement) => disbursement.id,
  ),
  projectIds: world.housing.projects.map((project) => project.id),
  housingRegionIds: world.housing.regions.map((region) => region.id),
  informationArtifactIds: [
    ...world.information.artifacts.map((artifact) => artifact.id),
    ...world.information.politicalClaims.map((claim) => claim.id),
  ],
  populationUnitIds: world.population.units.map((unit) => unit.id),
  electoralContestIds: world.electoral.contests.map((contest) => contest.id),
  electionProcessIds: world.electoral.electionProcesses.map((process) => process.id),
  electionResultId: electionProcessFor(world).result?.id,
  certificationId: electionProcessFor(world).certification?.id,
  executiveOfficeId: world.governance.executivePolitical.office.id,
});

describe("Commit 25 final synthetic GL0 composition candidate", () => {
  it("1. composes COMPROMISE + PRESERVE from governing through defeat and day-70 continuation", () => {
    const session = createRouteSession("PRESERVE_SUPPORT_RESERVE");
    const day5 = session.getView();
    expect(day5.legislative.proposal).toMatchObject({
      status: "PROCEDURE_PASSED",
      terms: COMPROMISE_TERMS,
      amendmentsAdopted: 1,
    });
    expect(day5.statePrograms.map((state) => state.decision)).toEqual([
      "APPLY",
      "REFUSE",
      "APPLY",
    ]);
    expect(day5.implementationResponse.resolvedAction).toBe("PRESERVE_SUPPORT_RESERVE");

    expect(session.advanceTo(30).officialHousingMeasurement.status).toBe("CAPTURED");
    expect(session.advanceTo(40).officialHousingMeasurement.releasedReport).not.toBeNull();
    const day43 = session.advanceTo(43);
    expect(day43.populationAudit.electoralDispositionResolvedAt).toBe(43);
    expect(day43.populationAudit.units.map((unit) => unit.electoralPreference)).toEqual([
      "UNDECIDED",
      "OPPOSITION",
      "UNDECIDED",
    ]);
    const day60 = session.advanceTo(60);
    expect(day60.electoralAudit.electionProcess.result).toMatchObject({
      outcome: "OPPOSITION_WIN",
      totalParticipatingWeight: 200,
      blankBallotWeight: 100,
    });
    expect(session.advanceTo(61).electoralAudit.electionProcess.certification?.status).toBe(
      "CERTIFIED",
    );
    expect(session.advanceTo(62).executiveSuccessionAudit.successorEntitlement).toMatchObject({
      entitledActorId: GL0_OPPOSITION_EXECUTIVE_ACTOR_ID,
    });
    const day63 = session.advanceTo(63);
    expect(day63.executiveSuccessionAudit.currentOfficeAssignment.actorId).toBe(
      GL0_OPPOSITION_EXECUTIVE_ACTOR_ID,
    );
    expect(day63.controlBindingAudit.status).toBe("ENDED");
    expect(session.advanceTo(70)).toMatchObject({
      currentTime: 70,
      controlBindingAudit: { status: "ENDED" },
    });
  });

  it("2. changes only the officeholder while every stable country identity survives succession", () => {
    const session = createRouteSession("PRESERVE_SUPPORT_RESERVE");
    session.advanceTo(61);
    const beforeTransfer = worldFor(session);
    const identities = stableWorldIdentities(beforeTransfer);
    session.advanceTo(70);
    const afterTransfer = worldFor(session);

    expect(stableWorldIdentities(afterTransfer)).toEqual(identities);
    expect(beforeTransfer.governance.executivePolitical.currentOfficeAssignment.actorId).toBe(
      GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
    );
    expect(afterTransfer.governance.executivePolitical.currentOfficeAssignment).toMatchObject({
      officeId: GL0_EXECUTIVE_OFFICE_ID,
      actorId: GL0_OPPOSITION_EXECUTIVE_ACTOR_ID,
    });
  });

  it("3. composes DEPLOY through Housing-owned support, differentiated Population, and the exact tie", () => {
    const session = establishSessionThroughProjects();
    const before = session.getView();
    expect(before.statePrograms.find((state) => state.id === STATE_C_ID)?.housingProject).toMatchObject({
      completedWorkUnits: 10,
      status: "ACTIVE",
    });
    const deployed = session.deployHousingImplementationSupportToStateC();
    expect(deployed.implementationResponse).toMatchObject({
      resolvedAction: "DEPLOY_SUPPORT_TO_C",
      committedSupportUnits: 1,
      availableSupportUnits: 0,
    });
    expect(
      deployed.statePrograms.find((state) => state.id === STATE_C_ID)
        ?.acceptedImplementationSupport,
    ).toMatchObject({ supportUnits: 1, supplementalWorkUnitsPerDay: 3 });
    expect(
      session.advanceTo(10).statePrograms.find((state) => state.id === STATE_C_ID)
        ?.housingProject?.completedWorkUnits,
    ).toBe(35);
    expect(
      session.advanceTo(23).statePrograms.find((state) => state.id === STATE_C_ID)
        ?.housingRegion.affordabilityPressure,
    ).toBe(150);
    expect(
      session.advanceTo(30).officialHousingMeasurement.capturedRegionalResults.find(
        (result) => result.housingRegionId === HOUSING_REGION_C_ID,
      )?.affordabilityPressure,
    ).toBe(150);
    expect(session.advanceTo(43).populationAudit.units).toMatchObject([
      { id: POPULATION_UNIT_A_ID, electoralPreference: "UNDECIDED", turnoutDisposition: "MEDIUM" },
      { id: POPULATION_UNIT_B_ID, electoralPreference: "OPPOSITION", turnoutDisposition: "HIGH" },
      { id: POPULATION_UNIT_C_ID, electoralPreference: "ADMINISTRATION", turnoutDisposition: "HIGH" },
    ]);
    const day43World = worldFor(session);
    session.advanceTo(60);
    const electionWorld = worldFor(session);
    expect(electionWorld.time.current).toBe(60);
    expect(candidateWeight(electionWorld, GL0_ADMINISTRATION_CANDIDATE_ID)).toBe(100);
    expect(candidateWeight(electionWorld, GL0_OPPOSITION_CANDIDATE_ID)).toBe(100);
    expect(electionProcessFor(electionWorld).result).toMatchObject({
      blankBallotWeight: 50,
      outcome: "TIE",
      winningCandidateId: null,
    });
    expect(day43World.time.current).toBe(43);
  });

  it("4. certifies the DEPLOY tie without entitlement, transfer, or control loss", () => {
    const session = createRouteSession("DEPLOY_SUPPORT");
    session.advanceTo(61);
    expect(session.getView().electoralAudit.electionProcess).toMatchObject({
      status: "CERTIFIED",
      result: { outcome: "TIE", winningCandidateId: null },
    });
    const day70 = session.advanceTo(70);
    expect(day70.executiveSuccessionAudit.successorEntitlement).toBeNull();
    expect(day70.executiveSuccessionAudit.currentOfficeAssignment.actorId).toBe(
      GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
    );
    expect(day70.executiveSuccessionAudit.transferResolvedAtSimulationTime).toBeNull();
    expect(day70.controlBindingAudit.status).toBe("ACTIVE");
  });

  it("5. composes the contested executive route through appeal while complying", () => {
    const session = createHostileDay6Session();
    expect(session.getView().contestedAuthorityAudit.executiveAttempt).toMatchObject({
      status: "ATTEMPTED",
      attemptedAtSimulationTime: 6,
    });
    expect(session.advanceTo(7).contestedAuthorityAudit.legalContest).toMatchObject({
      proceduralStage: "INTERIM_RELIEF_PENDING",
      interimReliefDecision: null,
    });
    const day8 = session.advanceTo(8);
    expect(day8.contestedAuthorityAudit).toMatchObject({
      legalContest: { interimReliefDecision: { outcome: "GRANT" } },
      judicialOrder: { status: "ACTIVE" },
      agency: { orderReceipt: { receivedAtSimulationTime: 8 }, complianceResponse: null },
    });
    const day9 = session.advanceTo(9);
    expect(day9.contestedAuthorityAudit.agency).toMatchObject({
      redirectionStatus: "HALTED_BY_JUDICIAL_ORDER",
      complianceResponse: { response: "COMPLY" },
    });
    const appealed = session.appealHousingRedirectionOrderWhileComplying();
    expect(appealed.contestedAuthorityAudit).toMatchObject({
      legalContest: { reviewRequest: { filedAtSimulationTime: 9 } },
      judicialOrder: { status: "ACTIVE" },
      executiveResponse: { action: "APPEAL_WHILE_COMPLYING" },
    });
  });

  it("6. leaves fiscal, Housing, and Population on their ordinary path despite the hostile contest", () => {
    const ordinary = createRouteSession("PRESERVE_SUPPORT_RESERVE");
    ordinary.advanceTo(9);
    const hostile = createHostileDay6Session();
    hostile.advanceTo(9);
    hostile.appealHousingRedirectionOrderWhileComplying();
    const ordinaryDay9 = worldFor(ordinary);
    const hostileDay9 = worldFor(hostile);

    expect(hostileDay9.governance.publicFinance).toEqual(ordinaryDay9.governance.publicFinance);
    expect(hostileDay9.governance.fiscalExecution).toEqual(ordinaryDay9.governance.fiscalExecution);
    expect(hostileDay9.housing).toEqual(ordinaryDay9.housing);
    expect(hostileDay9.population).toEqual(ordinaryDay9.population);
    hostile.advanceTo(70);
    ordinary.advanceTo(70);
    expect(worldFor(hostile).housing).toEqual(worldFor(ordinary).housing);
    expect(worldFor(hostile).population).toEqual(worldFor(ordinary).population);
    expect(worldFor(hostile).electoral).toEqual(worldFor(ordinary).electoral);
  });

  it("7. preserves the focused agency REFUSE seam without moving money or rewriting Housing", () => {
    let day8 = resolveWorldRoute("PRESERVE_SUPPORT_RESERVE");
    day8 = advanceWorldTo(day8, 6);
    day8 = attemptDisputedHousingFundsRedirection(day8);
    day8 = advanceWorldTo(day8, 8);
    const housingBeforeRefusal = structuredClone(day8.housing);
    const populationBeforeRefusal = structuredClone(day8.population);
    const refused = resolveContestedAuthorityComplianceBoundary(day8.governance, "REFUSE", 9, 9);

    expect(
      refused.governance.contestedHousingAdministration.judicialOrderComplianceResponses[0],
    ).toMatchObject({ response: "REFUSE" });
    expect(refused.governance.judicialLegalOrder.operativeOrders[0].status).toBe("ACTIVE");
    expect(refused.governance.contestedHousingAdministration.disputedRedirections[0].status).toBe(
      "PREPARING_REDIRECTION",
    );
    expect(refused.governance.publicFinance).toEqual(day8.governance.publicFinance);
    expect(refused.governance.fiscalExecution).toEqual(day8.governance.fiscalExecution);
    expect(day8.housing).toEqual(housingBeforeRefusal);
    expect(day8.population).toEqual(populationBeforeRefusal);
    expect(refused.governance.contestedHousingAdministration).not.toHaveProperty("orderStatus");
  });

  it("8. legitimately fails the unamended bill and creates no downstream program chain", () => {
    const submitted = submitHousingGrantProposal(
      createDeterministicWorldFixture(),
      INITIAL_TERMS,
    );
    const failed = resolveHousingGrantProposalVote(submitted);

    expect(failed.governance.proposal?.status).toBe("PROCEDURE_FAILED");
    expect(failed.governance.procedure?.votes?.filter((vote) => vote.choice === "YEA")).toHaveLength(4);
    expect(failed.governance.enactedLaws).toEqual([]);
    expect(failed.governance.publicFinance.housingGrant).toBeNull();
    expect(failed.governance.fiscalExecution).toBeNull();
    expect(failed.governance.housingGrantProgram).toBeNull();
    expect(failed.governance.housingGrantAwards).toEqual([]);
    expect(failed.housing.projects).toEqual([]);
  });

  it("9. proves compromise through changed provisions and individual votes, not a label", () => {
    const submitted = submitHousingGrantProposal(
      createDeterministicWorldFixture(),
      INITIAL_TERMS,
    );
    const amended = amendHousingGrantProposal(submitted, COMPROMISE_TERMS);
    const passed = resolveHousingGrantProposalVote(amended);

    expect(submitted.governance.proposal?.terms).toEqual(INITIAL_TERMS);
    expect(amended.governance.proposal?.terms).toEqual(COMPROMISE_TERMS);
    expect(amended.governance.procedure?.amendmentsAdopted).toBe(1);
    expect(passed.governance.procedure?.votes).toHaveLength(11);
    expect(passed.governance.proposal?.status).toBe("PROCEDURE_PASSED");
    expect(passed.governance.enactedLaws[0].enactedTerms).toEqual(COMPROMISE_TERMS);
  });

  it("10. proves finite institution-owned support is exhausted by DEPLOY", () => {
    const deployed = resolveWorldRoute("DEPLOY_SUPPORT");
    const support = deployed.governance.housingImplementationSupport;
    const stateARelationship = deployed.governance.intergovernmentalProgramRelationships.find(
      (relationship) => relationship.stateJurisdictionId === STATE_A_ID,
    );
    if (stateARelationship === undefined) throw new Error("Missing State A relationship.");

    expect(deployed.governance.housingGrantProgram?.status).toBe("READY_FOR_APPLICATIONS");
    expect(deployed.governance.publicFinance.housingGrant).not.toBeNull();
    expect(availableHousingImplementationSupportUnits(support)).toBe(0);
    expect(() =>
      commitHousingImplementationSupport(
        support,
        "test-additional-deployment",
        deployed.governance.housingGrantProgram!.id,
        stateARelationship.id,
        STATE_A_ID,
        1,
        5,
      ),
    ).toThrow(/insufficient federal housing implementation support/i);
    expect(support.committedSupportUnits).toBe(1);
  });

  it("11. keeps State B refusal State-owned and blocks every downstream participation fact", () => {
    const world = resolveWorldRoute("PRESERVE_SUPPORT_RESERVE");
    const decision = world.governance.stateProgramDecisions.find(
      (record) => record.stateJurisdictionId === STATE_B_ID,
    );

    expect(decision?.decision).toBe("REFUSE");
    expect(world.governance.programApplications.some((record) => record.stateJurisdictionId === STATE_B_ID)).toBe(false);
    expect(world.governance.federalApplicationDeterminations.some((record) => record.stateJurisdictionId === STATE_B_ID)).toBe(false);
    expect(world.governance.intergovernmentalProgramRelationships.some((record) => record.stateJurisdictionId === STATE_B_ID)).toBe(false);
    expect(world.governance.housingGrantAwards.some((record) => record.stateJurisdictionId === STATE_B_ID)).toBe(false);
    expect(world.governance.fiscalExecution?.obligations.some((record) => record.stateJurisdictionId === STATE_B_ID)).toBe(false);
    expect(world.governance.publicFinance.housingGrant?.disbursements.some((record) => record.stateJurisdictionId === STATE_B_ID)).toBe(false);
    expect(world.housing.projects.some((record) => record.stateJurisdictionId === STATE_B_ID)).toBe(false);
  });

  it("12. keeps State C fully funded and participating while materially slower than State A", () => {
    const day10 = advanceWorldTo(resolveWorldRoute("PRESERVE_SUPPORT_RESERVE"), 10);

    expect(day10.governance.intergovernmentalProgramRelationships.map((record) => record.stateJurisdictionId)).toEqual([STATE_A_ID, STATE_C_ID]);
    expect(day10.governance.housingGrantAwards).toHaveLength(2);
    expect(day10.governance.fiscalExecution?.obligations).toHaveLength(2);
    expect(day10.governance.publicFinance.housingGrant?.disbursements).toHaveLength(2);
    expect(projectFor(day10, STATE_A_ID)).toMatchObject({ status: "COMPLETED", completedWorkUnits: 100 });
    expect(projectFor(day10, STATE_C_ID)).toMatchObject({ status: "ACTIVE", completedWorkUnits: 20 });
  });

  it("13. reaches election day with a legitimate late-materialized project still incomplete", () => {
    let world = establishProgramWorld();
    world = fundStateProject(world, STATE_A_ID);
    world = resolveStateHousingGrantDecision(world, STATE_B_ID);
    world = resolveStateHousingGrantDecision(world, STATE_C_ID);
    world = submitStateHousingGrantApplication(world, STATE_C_ID);
    world = resolveFederalHousingGrantApplication(world, STATE_C_ID);
    world = activateIntergovernmentalHousingGrantParticipation(world, STATE_C_ID);
    world = createHousingGrantAward(world, STATE_C_ID);
    world = obligateHousingGrantAward(world, STATE_C_ID);
    world = disburseHousingGrantObligation(world, STATE_C_ID);
    world = advanceWorldTo(world, 59);
    world = materializeHousingProjectFromDisbursement(world, STATE_C_ID);
    const day60 = advanceWorldTo(world, 60);

    expect(projectFor(day60, STATE_C_ID)).toMatchObject({
      status: "ACTIVE",
      completedWorkUnits: 2,
      completedAtSimulationTime: null,
    });
    expect(electionProcessFor(day60).result).not.toBeNull();
  });

  it("14. composes valid law, funding, administration, and payment with mixed delayed material results", () => {
    const day30 = advanceWorldTo(resolveWorldRoute("PRESERVE_SUPPORT_RESERVE"), 30);

    expect(day30.governance.enactedLaws).toHaveLength(1);
    expect(day30.governance.housingGrantProgram?.status).toBe("READY_FOR_APPLICATIONS");
    expect(day30.governance.housingGrantAwards).toHaveLength(2);
    expect(day30.governance.fiscalExecution?.obligations).toHaveLength(2);
    expect(day30.governance.publicFinance.housingGrant?.disbursements).toHaveLength(2);
    expect(regionFor(day30, STATE_A_ID).affordabilityPressure).toBe(100);
    expect(regionFor(day30, STATE_C_ID).affordabilityPressure).toBe(250);
    expect(projectFor(day30, STATE_C_ID).status).toBe("ACTIVE");
  });

  it("15. proves material success can precede release and later outrun the frozen report", () => {
    const route = resolveWorldRoute("PRESERVE_SUPPORT_RESERVE");
    const day10 = advanceWorldTo(route, 10);
    const day30 = advanceWorldTo(day10, 30);
    const day39 = advanceWorldTo(day30, 39);
    const day40 = advanceWorldTo(day39, 40);
    const day50 = advanceWorldTo(day40, 50);

    expect(regionFor(day10, STATE_A_ID).affordabilityPressure).toBe(100);
    expect(day39.information.artifacts).toEqual([]);
    expect(day40.information.artifacts[0].regionalResults.find((result) => result.housingRegionId === HOUSING_REGION_C_ID)?.affordabilityPressure).toBe(250);
    expect(regionFor(day50, STATE_C_ID).affordabilityPressure).toBe(150);
    expect(day50.information.artifacts).toEqual(day40.information.artifacts);
  });

  it("16. proves material improvement does not automatically become Administration credit", () => {
    const day42 = advanceWorldTo(resolveWorldRoute("DEPLOY_SUPPORT"), 42);

    expect(regionFor(day42, STATE_A_ID).housingStockUnits).toBe(1_100);
    expect(populationUnitFor(day42, POPULATION_UNIT_A_ID)).toMatchObject({
      programPerformanceBelief: "CONTESTED",
      housingAttribution: { target: "UNKNOWN", evaluation: "NONE" },
    });
  });

  it("17. permits the Administration claim while PRESERVE delivery remains incomplete", () => {
    const day41 = advanceWorldTo(resolveWorldRoute("PRESERVE_SUPPORT_RESERVE"), 41);
    const claim = day41.information.politicalClaims.find(
      (candidate) => candidate.id === ADMINISTRATION_HOUSING_CLAIM_ID,
    );

    expect(claim).toMatchObject({
      sourceArtifactIds: [OFFICIAL_HOUSING_REPORT_ID],
      claimPosition: "PROGRAM_WORKING",
    });
    expect(projectFor(day41, STATE_C_ID).status).toBe("ACTIVE");
    expect(regionFor(day41, STATE_C_ID).housingStockUnits).toBe(INITIAL_HOUSING_STOCK_UNITS);
  });

  it("18. makes a multiply interrupted whole hostile PRESERVE route equal uninterrupted continuation", () => {
    const uninterrupted = createHostileDay6Session();
    uninterrupted.advanceTo(9);
    uninterrupted.appealHousingRedirectionOrderWhileComplying();
    uninterrupted.advanceTo(70);

    let interrupted = createHostileDay6Session();
    interrupted.advanceTo(7);
    interrupted = createGameSessionFromSave(interrupted.save());
    interrupted.advanceTo(9);
    interrupted.appealHousingRedirectionOrderWhileComplying();
    for (const boundary of [30, 59, 61, 62]) {
      interrupted.advanceTo(boundary);
      interrupted = createGameSessionFromSave(interrupted.save());
    }
    interrupted.advanceTo(70);

    expect(envelopeFor(interrupted)).toEqual(envelopeFor(uninterrupted));
  });

  it("19. makes whole-route coarse advancement equal causal-boundary chunking", () => {
    const coarse = createHostileDay6Session();
    coarse.advanceTo(9);
    coarse.appealHousingRedirectionOrderWhileComplying();
    coarse.advanceTo(70);

    const chunked = createHostileDay6Session();
    for (const boundary of [7, 8, 9]) chunked.advanceTo(boundary);
    chunked.appealHousingRedirectionOrderWhileComplying();
    for (const boundary of [10, 30, 40, 41, 42, 43, 50, 59, 60, 61, 62, 63, 70]) {
      chunked.advanceTo(boundary);
    }

    expect(envelopeFor(chunked)).toEqual(envelopeFor(coarse));
  });

  it("20. orders both day-8 court work and day-40 report processing by causal dependency", () => {
    const hostile = createHostileDay6Session();
    hostile.advanceTo(8);
    const day8Types = worldFor(hostile).history
      .filter((occurrence) => occurrence.at === 8)
      .map((occurrence) => occurrence.type);
    expect(day8Types).toEqual([
      "InterimReliefDecided",
      "JudicialOrderIssued",
      "JudicialOrderDelivered",
    ]);

    const reportRoute = createRouteSession("PRESERVE_SUPPORT_RESERVE");
    reportRoute.advanceTo(40);
    const day40Types = worldFor(reportRoute).history
      .filter((occurrence) => occurrence.at === 40)
      .map((occurrence) => occurrence.type);
    expect(day40Types[0]).toBe("OfficialHousingReportReleased");
    expect(day40Types.slice(1, 3)).toEqual([
      "InformationArtifactExposed",
      "InformationArtifactExposed",
    ]);
    expect(day40Types.slice(3)).toEqual([
      "PopulationInformationIncorporated",
      "PopulationInformationIncorporated",
    ]);
  });

  it("21. duplicates no owner boundary under repeated time, save/load, and later continuation", () => {
    let session = createHostileDay6Session();
    session.advanceTo(8);
    session.advanceTo(8);
    session = createGameSessionFromSave(session.save());
    session.advanceTo(9);
    session.appealHousingRedirectionOrderWhileComplying();
    for (const boundary of [9, 30, 30, 40, 40, 43, 43, 60, 60, 61, 61, 62, 62, 63, 63, 70]) {
      session.advanceTo(boundary);
    }
    const world = worldFor(session);

    expect(historyCount(world, "HousingProjectCompleted")).toBe(2);
    expect(historyCount(world, "HousingMeasurementCaptured")).toBe(1);
    expect(historyCount(world, "OfficialHousingReportReleased")).toBe(1);
    expect(historyCount(world, "InformationArtifactExposed")).toBe(6);
    expect(historyCount(world, "PopulationInformationIncorporated")).toBe(6);
    expect(historyCount(world, "ElectionResolved")).toBe(1);
    expect(historyCount(world, "ElectionCertified")).toBe(1);
    expect(historyCount(world, "SuccessorEntitlementEstablished")).toBe(1);
    expect(historyCount(world, "ExecutiveOfficeTransferred")).toBe(1);
    expect(historyCount(world, "JudicialOrderIssued")).toBe(1);
    expect(historyCount(world, "JudicialOrderComplianceResolved")).toBe(1);
    expect(historyCount(world, "JudicialReviewRequested")).toBe(1);
  });

  it("22. exposes only existing government records and released artifacts in the player view", () => {
    const session = createRouteSession("PRESERVE_SUPPORT_RESERVE");
    session.advanceTo(63);
    const player = session.getPlayerView();

    expect(player.legislative.proposal?.terms).toEqual(COMPROMISE_TERMS);
    expect(player.legislative.enactedLaws).toHaveLength(1);
    expect(player.publicFinance?.disbursements).toHaveLength(2);
    expect(player.fiscalExecution?.obligations).toHaveLength(2);
    expect(player.programAdministration.operatorInstitution?.id).toBe(
      FEDERAL_HOUSING_ADMINISTRATION_INSTITUTION_ID,
    );
    expect(player.programAdministration.stateRecords.map((record) => record.decision)).toEqual([
      "APPLY",
      "REFUSE",
      "APPLY",
    ]);
    expect(player.officialHousingReports).toHaveLength(1);
    expect(player.publicClaims).toHaveLength(2);
    expect(player.officialElection).toMatchObject({
      status: "CERTIFIED",
      result: { outcome: "OPPOSITION_WIN" },
      certification: { status: "CERTIFIED" },
    });
  });

  it("23. excludes captured-unreleased measurement, live Housing, hidden Population, and debug electorate truth", () => {
    const session = createRouteSession("DEPLOY_SUPPORT");
    session.advanceTo(30);
    const player = session.getPlayerView();
    const serialized = JSON.stringify(player);

    expect(player.officialHousingReports).toEqual([]);
    expect(player).not.toHaveProperty("housing");
    expect(player).not.toHaveProperty("population");
    expect(player).not.toHaveProperty("derivedElectorate");
    expect(serialized).not.toContain("capturedRegionalResults");
    expect(serialized).not.toContain("housingPressureBelief");
    expect(serialized).not.toContain("housingAttribution");
    expect(serialized).not.toContain("housingSalience");
    expect(serialized).not.toContain("electoralPreference");
    expect(serialized).not.toContain("turnoutDisposition");
    expect(serialized).not.toContain("completedWorkUnits");
    expect(serialized).not.toContain("affordabilityPressure");
    expect(serialized).not.toContain("responseOpportunityReady");
  });

  it("24. returns an isolated read-only projection that cannot mutate canonical state", () => {
    const session = createRouteSession("PRESERVE_SUPPORT_RESERVE");
    session.advanceTo(63);
    const before = session.save();
    const player = session.getPlayerView();
    const mutable = player as unknown as {
      currentTime: number;
      legislative: { enactedLaws: Array<{ id: string }> };
      programAdministration: { stateRecords: Array<{ decision: string | null }> };
    };
    mutable.currentTime = -100;
    mutable.legislative.enactedLaws[0].id = "tampered-law";
    mutable.programAdministration.stateRecords[0].decision = "REFUSE";

    expect(session.save()).toBe(before);
    expect(session.getPlayerView().currentTime).toBe(63);
    expect(session.getPlayerView().legislative.enactedLaws[0].id).not.toBe("tampered-law");
    expect(session.getPlayerView().programAdministration.stateRecords[0].decision).toBe("APPLY");
  });

  it("25. keeps the developer audit projection explicitly separate from player knowledge", () => {
    const session = createRouteSession("DEPLOY_SUPPORT");
    session.advanceTo(43);
    const audit = session.getView();
    const player = session.getPlayerView();

    expect(audit.populationAudit.units).toHaveLength(3);
    expect(audit.electoralAudit.derivedElectorate.eligiblePopulationWeight).toBe(300);
    expect(audit.statePrograms[0].housingRegion.affordabilityPressure).toBeDefined();
    expect(player).not.toHaveProperty("populationAudit");
    expect(player).not.toHaveProperty("electoralAudit");
    expect(player).not.toHaveProperty("statePrograms");
  });

  it("26. ends outgoing player control without rebinding or creating spectator omniscience", () => {
    const session = createRouteSession("PRESERVE_SUPPORT_RESERVE");
    session.advanceTo(63);
    const player = session.getPlayerView();

    expect(player.controlBinding).toMatchObject({
      status: "ENDED",
      boundOfficeholderActorId: GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
    });
    expect(player.controlBinding.boundOfficeholderActorId).not.toBe(
      GL0_OPPOSITION_EXECUTIVE_ACTOR_ID,
    );
    expect(player.executiveOffice.currentAssignment.actorId).toBe(
      GL0_OPPOSITION_EXECUTIVE_ACTOR_ID,
    );
    expect(player).not.toHaveProperty("population");
    expect(() => session.attemptDisputedHousingFundsRedirection()).toThrow(
      /No active ControlBinding.*decision surface unavailable/i,
    );
  });

  it("27. preserves every major owner boundary instead of collapsing the route into shortcuts", () => {
    let world = createDeterministicWorldFixture();
    const initialHousing = structuredClone(world.housing);
    world = submitHousingGrantProposal(world, INITIAL_TERMS);
    world = amendHousingGrantProposal(world, COMPROMISE_TERMS);
    world = resolveHousingGrantProposalVote(world);
    expect(world.governance.publicFinance.housingGrant).toBeNull();
    expect(world.governance.housingGrantProgram).toBeNull();
    expect(world.housing).toEqual(initialHousing);

    world = recognizeHousingGrantFiscalAuthority(world);
    expect(world.governance.fiscalExecution?.obligations).toEqual([]);
    expect(world.governance.publicFinance.housingGrant?.disbursements).toEqual([]);
    world = establishHousingGrantProgram(world);
    world = resolveStateHousingGrantDecision(world, STATE_A_ID);
    world = submitStateHousingGrantApplication(world, STATE_A_ID);
    world = resolveFederalHousingGrantApplication(world, STATE_A_ID);
    world = activateIntergovernmentalHousingGrantParticipation(world, STATE_A_ID);
    world = createHousingGrantAward(world, STATE_A_ID);
    expect(world.governance.fiscalExecution?.obligations).toEqual([]);
    world = obligateHousingGrantAward(world, STATE_A_ID);
    expect(world.governance.publicFinance.housingGrant?.disbursements).toEqual([]);
    world = disburseHousingGrantObligation(world, STATE_A_ID);
    expect(world.housing.projects).toEqual([]);
    world = materializeHousingProjectFromDisbursement(world, STATE_A_ID);
    expect(projectFor(world, STATE_A_ID).status).toBe("FUNDED_NOT_STARTED");
    expect(regionFor(world, STATE_A_ID).housingStockUnits).toBe(INITIAL_HOUSING_STOCK_UNITS);

    const session = createRouteSession("PRESERVE_SUPPORT_RESERVE");
    expect(session.advanceTo(8).electoralAudit.electionProcess.result).toBeNull();
    expect(session.advanceTo(60).executiveSuccessionAudit.currentOfficeAssignment.actorId).toBe(
      GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
    );
    expect(session.advanceTo(61).executiveSuccessionAudit.currentOfficeAssignment.actorId).toBe(
      GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
    );
    expect(session.advanceTo(62)).toMatchObject({
      executiveSuccessionAudit: {
        currentOfficeAssignment: { actorId: GL0_INCUMBENT_EXECUTIVE_ACTOR_ID },
        successorEntitlement: { entitledActorId: GL0_OPPOSITION_EXECUTIVE_ACTOR_ID },
      },
      controlBindingAudit: { status: "ACTIVE" },
    });
  });
});
