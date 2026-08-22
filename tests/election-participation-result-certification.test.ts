import {
  GL0_ADMINISTRATION_CANDIDATE_ID,
  GL0_EXECUTIVE_CERTIFICATION_AT,
  GL0_EXECUTIVE_CONTEST_ID,
  GL0_EXECUTIVE_ELECTION_AT,
  GL0_EXECUTIVE_ELECTION_PROCESS_ID,
  GL0_EXECUTIVE_ELECTION_RESULT_ID,
  GL0_OPPOSITION_CANDIDATE_ID,
  GL0_ORDINARY_EXECUTIVE_ELECTION_PROCEDURE_RULE_ID,
  GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
  GL0_OPPOSITION_EXECUTIVE_ACTOR_ID,
  STATE_A_ID,
  STATE_C_ID,
  POPULATION_UNIT_A_ID,
  POPULATION_UNIT_B_ID,
  POPULATION_UNIT_C_ID,
} from "../src/content/gl0-synthetic/configuration";
import { describe, expect, it } from "vitest";

import { createDeterministicWorldFixture } from "../src/content/gl0-synthetic/configuration";

import {
  certifyElection,
  resolveElection,
  type ElectionProcess,
  type ElectionResult,
} from "../src/sim/electoral";



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

const resolveRoute = (
  action: "DEPLOY_SUPPORT" | "PRESERVE_SUPPORT_RESERVE",
): WorldState => {
  let world = establishProgram();
  world = materializeStateProject(world, STATE_A_ID);
  world = materializeStateProject(world, STATE_C_ID);
  world = advanceWorldTo(world, 5);
  return resolveHousingImplementationResponse(world, action);
};

const processFor = (world: WorldState): ElectionProcess => {
  const process = world.electoral.electionProcesses.find(
    (candidate) => candidate.id === GL0_EXECUTIVE_ELECTION_PROCESS_ID,
  );
  if (process === undefined) throw new Error("Missing GL0 election process.");
  return process;
};

const resultFor = (world: WorldState): ElectionResult => {
  const result = processFor(world).result;
  if (result === null) throw new Error("Missing GL0 election result.");
  return result;
};

const candidateWeight = (result: ElectionResult, candidateId: string): number => {
  const candidateResult = result.candidateVoteWeights.find(
    (entry) => entry.candidateId === candidateId,
  );
  if (candidateResult === undefined) throw new Error(`Missing candidate ${candidateId}.`);
  return candidateResult.voteWeight;
};

describe("Commit 21 election participation, result, and certification", () => {
  it("1. preserves the accepted Commit-20 preference and turnout state through day 43", () => {
    const world = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 43);

    expect(
      world.population.units.map((unit) => [
        unit.id,
        unit.electoralPreference,
        unit.turnoutDisposition,
      ]),
    ).toEqual([
      [POPULATION_UNIT_A_ID, "UNDECIDED", "MEDIUM"],
      [POPULATION_UNIT_B_ID, "OPPOSITION", "HIGH"],
      [POPULATION_UNIT_C_ID, "ADMINISTRATION", "HIGH"],
    ]);
  });

  it("2. stores actual participation only in the Electoral-owned election process", () => {
    const world = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 60);

    expect(processFor(world).participationRecords).toHaveLength(3);
    expect(world.population.units.every((unit) => !("participatingWeight" in unit))).toBe(true);
    expect(world.population).not.toHaveProperty("ballots");
  });

  it("3. keeps the two candidate records as election participants without office assignment", () => {
    const world = createDeterministicWorldFixture();

    expect(world.electoral.candidates).toEqual([
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
    expect(world.electoral.candidates.every((candidate) => !("officeId" in candidate))).toBe(true);
    expect(world.governance).not.toHaveProperty("officeAssignment");
  });

  it("4. has no snapshot, participation, ballots, or result on day 59", () => {
    const process = processFor(advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 59));

    expect(process).toMatchObject({
      status: "SCHEDULED",
      electorateSnapshot: null,
      participationRecords: [],
      ballots: [],
      result: null,
      certification: null,
    });
  });

  it("5. resolves the day-60 election exactly once", () => {
    const day60 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 60);
    const repeated = advanceWorldTo(day60, 60);

    expect(processFor(day60).electorateSnapshot).toMatchObject({
      contestId: GL0_EXECUTIVE_CONTEST_ID,
      asOfSimulationTime: 60,
    });
    expect(processFor(day60).electorateSnapshot?.units).toHaveLength(3);
    expect(processFor(day60).electorateSnapshot?.units[0]).not.toHaveProperty(
      "housingPressureBelief",
    );
    expect(repeated.electoral).toEqual(day60.electoral);
    expect(
      repeated.history.filter((occurrence) => occurrence.type === "ElectionResolved"),
    ).toHaveLength(1);
  });

  it("6. requires the canonical eligibility legal-order rule", () => {
    const day43 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 43);

    expect(() =>
      resolveElection(
        day43.electoral,
        day43.population,
        { rules: [] },
        day43.governance.electoralProcedureLegalOrder,
        GL0_EXECUTIVE_CONTEST_ID,
        60,
      ),
    ).toThrow(/legal order requires exactly one electoral eligibility rule/i);
  });

  it("7. references a legal-order-owned procedure rule without shadow-owning semantics", () => {
    const world = createDeterministicWorldFixture();
    const contest = world.electoral.contests[0];

    expect(contest.procedureRuleId).toBe(
      GL0_ORDINARY_EXECUTIVE_ELECTION_PROCEDURE_RULE_ID,
    );
    expect(world.governance.electoralProcedureLegalOrder.rules).toEqual([
      {
        id: GL0_ORDINARY_EXECUTIVE_ELECTION_PROCEDURE_RULE_ID,
        requirement:
          "DETERMINISTIC_AGGREGATE_PARTICIPATION_BALLOT_COUNT_AND_CERTIFICATION",
      },
    ]);
    expect(contest).not.toHaveProperty("winnerRule");
    expect(contest).not.toHaveProperty("certificationRule");
    expect(contest).not.toHaveProperty("turnoutConversion");
  });

  it("8. rejects election resolution when the referenced procedure rule is absent", () => {
    const day43 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 43);

    expect(() =>
      resolveElection(
        day43.electoral,
        day43.population,
        day43.governance.electoralEligibilityLegalOrder,
        { rules: [] },
        GL0_EXECUTIVE_CONTEST_ID,
        60,
      ),
    ).toThrow(/legal order requires exactly one electoral procedure rule/i);
  });

  it("9. converts HIGH turnout disposition into 100 percent participating weight", () => {
    const process = processFor(advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 60));

    for (const unitId of [POPULATION_UNIT_B_ID, POPULATION_UNIT_C_ID]) {
      expect(
        process.participationRecords.find((record) => record.populationUnitId === unitId),
      ).toMatchObject({ eligibleWeight: 100, participatingWeight: 100 });
    }
  });

  it("10. converts MEDIUM turnout disposition into 50 percent participating weight", () => {
    const process = processFor(advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 60));

    expect(
      process.participationRecords.find(
        (record) => record.populationUnitId === POPULATION_UNIT_A_ID,
      ),
    ).toMatchObject({ eligibleWeight: 100, participatingWeight: 50 });
  });

  it("11. converts LOW turnout disposition into zero participation in a focused fixture", () => {
    const day43 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 43);
    const lowPopulation = {
      ...day43.population,
      units: day43.population.units.map((unit) =>
        unit.id === POPULATION_UNIT_A_ID
          ? { ...unit, turnoutDisposition: "LOW" as const }
          : unit,
      ),
    };
    const resolved = resolveElection(
      day43.electoral,
      lowPopulation,
      day43.governance.electoralEligibilityLegalOrder,
      day43.governance.electoralProcedureLegalOrder,
      GL0_EXECUTIVE_CONTEST_ID,
      60,
    );
    const process = resolved.electoral.electionProcesses[0];

    expect(
      process.participationRecords.find(
        (record) => record.populationUnitId === POPULATION_UNIT_A_ID,
      )?.participatingWeight,
    ).toBe(0);
    expect(process.ballots.some((ballot) => ballot.populationUnitId === POPULATION_UNIT_A_ID)).toBe(
      false,
    );
  });

  it("12. rejects UNRESOLVED turnout or preference at election resolution", () => {
    const day43 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 43);
    const withUnitA = (
      replacement: Partial<(typeof day43.population.units)[number]>,
    ) => ({
      ...day43.population,
      units: day43.population.units.map((unit) =>
        unit.id === POPULATION_UNIT_A_ID ? { ...unit, ...replacement } : unit,
      ),
    });

    expect(() =>
      resolveElection(
        day43.electoral,
        withUnitA({ turnoutDisposition: "UNRESOLVED" }),
        day43.governance.electoralEligibilityLegalOrder,
        day43.governance.electoralProcedureLegalOrder,
        GL0_EXECUTIVE_CONTEST_ID,
        60,
      ),
    ).toThrow(/unresolved turnout disposition/i);
    expect(() =>
      resolveElection(
        day43.electoral,
        withUnitA({ electoralPreference: "UNRESOLVED" }),
        day43.governance.electoralEligibilityLegalOrder,
        day43.governance.electoralProcedureLegalOrder,
        GL0_EXECUTIVE_CONTEST_ID,
        60,
      ),
    ).toThrow(/unresolved electoral preference/i);
  });

  it("13. turns ADMINISTRATION preference into Administration candidate ballot weight", () => {
    const process = processFor(advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 60));

    expect(
      process.ballots.find((ballot) => ballot.populationUnitId === POPULATION_UNIT_C_ID),
    ).toEqual({
      populationUnitId: POPULATION_UNIT_C_ID,
      ballotWeight: 100,
      selection: GL0_ADMINISTRATION_CANDIDATE_ID,
    });
  });

  it("14. turns OPPOSITION preference into Opposition candidate ballot weight", () => {
    const process = processFor(advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 60));

    expect(
      process.ballots.find((ballot) => ballot.populationUnitId === POPULATION_UNIT_B_ID),
    ).toEqual({
      populationUnitId: POPULATION_UNIT_B_ID,
      ballotWeight: 100,
      selection: GL0_OPPOSITION_CANDIDATE_ID,
    });
  });

  it("15. turns participating UNDECIDED weight into a blank ballot", () => {
    const process = processFor(advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 60));

    expect(
      process.ballots.find((ballot) => ballot.populationUnitId === POPULATION_UNIT_A_ID),
    ).toEqual({ populationUnitId: POPULATION_UNIT_A_ID, ballotWeight: 50, selection: "BLANK" });
  });

  it("16. produces the exact DEPLOY day-60 tie result", () => {
    const result = resultFor(advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 60));

    expect(result).toMatchObject({
      id: GL0_EXECUTIVE_ELECTION_RESULT_ID,
      resolvedAtSimulationTime: GL0_EXECUTIVE_ELECTION_AT,
      totalEligibleWeight: 300,
      totalParticipatingWeight: 250,
      validCandidateBallotWeight: 200,
      blankBallotWeight: 50,
      outcome: "TIE",
      winningCandidateId: null,
    });
    expect(candidateWeight(result, GL0_ADMINISTRATION_CANDIDATE_ID)).toBe(100);
    expect(candidateWeight(result, GL0_OPPOSITION_CANDIDATE_ID)).toBe(100);
  });

  it("17. produces the exact PRESERVE day-60 Opposition result", () => {
    const result = resultFor(advanceWorldTo(resolveRoute("PRESERVE_SUPPORT_RESERVE"), 60));

    expect(result).toMatchObject({
      totalEligibleWeight: 300,
      totalParticipatingWeight: 200,
      validCandidateBallotWeight: 100,
      blankBallotWeight: 100,
      outcome: "OPPOSITION_WIN",
      winningCandidateId: GL0_OPPOSITION_CANDIDATE_ID,
    });
    expect(candidateWeight(result, GL0_ADMINISTRATION_CANDIDATE_ID)).toBe(0);
    expect(candidateWeight(result, GL0_OPPOSITION_CANDIDATE_ID)).toBe(100);
  });

  it("18. leaves Population preference and turnout unchanged when ballots resolve", () => {
    const day59 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 59);
    const populationSnapshot = structuredClone(day59.population);
    const day60 = advanceWorldTo(day59, 60);

    expect(day60.population).toEqual(populationSnapshot);
  });

  it("19. resolves from electoral Population state without reading Housing or Information", () => {
    const day43 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 43);
    const housingSnapshot = structuredClone(day43.housing);
    const informationSnapshot = structuredClone(day43.information);
    const governanceSnapshot = structuredClone(day43.governance);

    resolveElection(
      day43.electoral,
      day43.population,
      day43.governance.electoralEligibilityLegalOrder,
      day43.governance.electoralProcedureLegalOrder,
      GL0_EXECUTIVE_CONTEST_ID,
      60,
    );

    expect(day43.housing).toEqual(housingSnapshot);
    expect(day43.information).toEqual(informationSnapshot);
    expect(day43.governance).toEqual(governanceSnapshot);
  });

  it("20. creates no certification on election day", () => {
    const process = processFor(advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 60));

    expect(process.status).toBe("RESOLVED");
    expect(process.certification).toBeNull();
  });

  it("21. certifies the frozen result exactly once on day 61", () => {
    const day60 = advanceWorldTo(resolveRoute("PRESERVE_SUPPORT_RESERVE"), 60);
    expect(() =>
      certifyElection(
        day60.electoral,
        { rules: [] },
        GL0_EXECUTIVE_CONTEST_ID,
        GL0_EXECUTIVE_CERTIFICATION_AT,
      ),
    ).toThrow(/legal order requires exactly one electoral procedure rule/i);
    const day61 = advanceWorldTo(day60, 61);
    const process = processFor(day61);
    const repeated = advanceWorldTo(day61, 65);
    const repeatedCertification = certifyElection(
      day61.electoral,
      day61.governance.electoralProcedureLegalOrder,
      GL0_EXECUTIVE_CONTEST_ID,
      GL0_EXECUTIVE_CERTIFICATION_AT,
    );

    expect(process.certification).toMatchObject({
      sourceResultId: GL0_EXECUTIVE_ELECTION_RESULT_ID,
      certifiedAtSimulationTime: GL0_EXECUTIVE_CERTIFICATION_AT,
      status: "CERTIFIED",
    });
    expect(
      repeated.history.filter((occurrence) => occurrence.type === "ElectionCertified"),
    ).toHaveLength(1);
    expect(repeatedCertification.occurrences).toEqual([]);
    expect(repeatedCertification.electoral).toBe(day61.electoral);
  });

  it("22. certifies the DEPLOY tie without inventing a winner", () => {
    const process = processFor(advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 61));

    expect(process.status).toBe("CERTIFIED");
    expect(process.result).toMatchObject({ outcome: "TIE", winningCandidateId: null });
    expect(process.certification?.sourceResultId).toBe(process.result?.id);
  });

  it("23. certifies PRESERVE defeat without successor, office, or control mutation", () => {
    const day60 = advanceWorldTo(resolveRoute("PRESERVE_SUPPORT_RESERVE"), 60);
    const governanceSnapshot = structuredClone(day60.governance);
    const day61 = advanceWorldTo(day60, 61);

    expect(resultFor(day61).winningCandidateId).toBe(GL0_OPPOSITION_CANDIDATE_ID);
    expect(day61.governance).toEqual(governanceSnapshot);
    expect(day61).not.toHaveProperty("successorEntitlement");
    expect(day61).not.toHaveProperty("controlBinding");
    expect(day61.governance).not.toHaveProperty("officeAssignment");
  });

  it("24. keeps snapshot, participation, ballots, and result frozen after Population changes", () => {
    const day60 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 60);
    const processSnapshot = structuredClone(processFor(day60));
    const changedPopulation = {
      ...day60.population,
      units: day60.population.units.map((unit) =>
        unit.id === POPULATION_UNIT_C_ID
          ? {
              ...unit,
              electoralPreference: "OPPOSITION" as const,
              turnoutDisposition: "LOW" as const,
            }
          : unit,
      ),
    };
    const day61 = advanceWorldTo({ ...day60, population: changedPopulation }, 61);
    const certified = processFor(day61);

    expect(certified.electorateSnapshot).toEqual(processSnapshot.electorateSnapshot);
    expect(certified.participationRecords).toEqual(processSnapshot.participationRecords);
    expect(certified.ballots).toEqual(processSnapshot.ballots);
    expect(certified.result).toEqual(processSnapshot.result);
  });

  it("25. makes direct 43→65 equal chunked 43→50→60→61→65 with ordered history", () => {
    const day43 = advanceWorldTo(resolveRoute("PRESERVE_SUPPORT_RESERVE"), 43);
    const direct = advanceWorldTo(day43, 65);
    const chunked = advanceWorldTo(
      advanceWorldTo(advanceWorldTo(advanceWorldTo(day43, 50), 60), 61),
      65,
    );

    expect(chunked.housing).toEqual(direct.housing);
    expect(chunked.information).toEqual(direct.information);
    expect(chunked.population).toEqual(direct.population);
    expect(chunked.electoral).toEqual(direct.electoral);
    expect(chunked.history).toEqual(direct.history);
    const historyTypes = direct.history.map((occurrence) => occurrence.type);
    expect(historyTypes.indexOf("ElectionResolved")).toBeLessThan(
      historyTypes.indexOf("ElectionCertified"),
    );
  });
});
