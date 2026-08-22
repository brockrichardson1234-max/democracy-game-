import {
  GL0_EXECUTIVE_CONTEST_ID,
  GL0_EXECUTIVE_ELECTION_AT,
  GL0_ALL_REPRESENTED_RESIDENT_POPULATION_ELIGIBILITY_RULE_ID,
  STATE_A_ID,
  STATE_C_ID,
  GEOGRAPHY_REGION_A_ID,
  GEOGRAPHY_REGION_B_ID,
  GEOGRAPHY_REGION_C_ID,
  HOUSING_REGION_C_ID,
  POPULATION_ELECTORAL_RESPONSE_AT,
  POPULATION_UNIT_A_ID,
  POPULATION_UNIT_B_ID,
  POPULATION_UNIT_C_ID,
} from "../src/content/gl0-synthetic/configuration";
import { describe, expect, it } from "vitest";

import { createDeterministicWorldFixture } from "../src/content/gl0-synthetic/configuration";

import { createGameSession } from "../src/app/session";
import {
  deriveElectorate,
  type ElectoralState,
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
  resolvePopulationElectoralDisposition,
  type PopulationUnit,
} from "../src/sim/population";
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

const populationUnitFor = (world: WorldState, unitId: string): PopulationUnit => {
  const unit = world.population.units.find((candidate) => candidate.id === unitId);
  if (unit === undefined) throw new Error(`Missing Population unit ${unitId}.`);
  return unit;
};

const deriveFixtureElectorate = (world: WorldState) =>
  deriveElectorate(
    world.electoral,
    world.population,
    world.governance.electoralEligibilityLegalOrder,
    GL0_EXECUTIVE_CONTEST_ID,
    world.time.current,
  );

const meaningfulDownstreamHistory = (world: WorldState) =>
  world.history.filter((occurrence) =>
    [
      "HousingProjectCompleted",
      "HousingStockChanged",
      "HousingAffordabilityPressureChanged",
      "HousingMeasurementCaptured",
      "OfficialHousingReportReleased",
      "PoliticalClaimReleased",
      "InformationArtifactExposed",
      "PopulationInformationIncorporated",
      "PopulationElectoralDispositionResolved",
    ].includes(occurrence.type),
  );

describe("Commit 20 preference, turnout disposition, and derived electorate", () => {
  it("1. preserves the accepted Commit-19 belief, attribution, and salience path", () => {
    const day42 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 42);

    expect(populationUnitFor(day42, POPULATION_UNIT_A_ID)).toMatchObject({
      housingPressureBelief: "UNKNOWN",
      programPerformanceBelief: "CONTESTED",
      housingSalience: "HIGH",
    });
    expect(populationUnitFor(day42, POPULATION_UNIT_B_ID)).toMatchObject({
      housingPressureBelief: "MODERATE",
      programPerformanceBelief: "INADEQUATE",
      housingSalience: "HIGH",
    });
    expect(populationUnitFor(day42, POPULATION_UNIT_C_ID)).toMatchObject({
      housingPressureBelief: "MODERATE",
      programPerformanceBelief: "WORKING",
      housingSalience: "HIGH",
    });
  });

  it("2. owns electoral preference and turnout disposition only in Population", () => {
    const world = createDeterministicWorldFixture();

    expect(world.population.units[0]).toHaveProperty("electoralPreference");
    expect(world.population.units[0]).toHaveProperty("turnoutDisposition");
    expect(world.information).not.toHaveProperty("electoralPreference");
    expect(world.electoral).not.toHaveProperty("electoralPreference");
    expect(world.geography).not.toHaveProperty("turnoutDisposition");
    expect(world.governance).not.toHaveProperty("turnoutDisposition");
  });

  it("3. initializes every unit with preference and turnout UNRESOLVED", () => {
    const world = createDeterministicWorldFixture();

    expect(world.population.units.map((unit) => unit.electoralPreference)).toEqual([
      "UNRESOLVED",
      "UNRESOLVED",
      "UNRESOLVED",
    ]);
    expect(world.population.units.map((unit) => unit.turnoutDisposition)).toEqual([
      "UNRESOLVED",
      "UNRESOLVED",
      "UNRESOLVED",
    ]);
    expect(world.population.electoralDispositionResolvedAt).toBeNull();
  });

  it("4. leaves preference and turnout unresolved through day-42 incorporation", () => {
    const day42 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 42);

    expect(day42.population.informationIncorporations).toHaveLength(6);
    expect(day42.population.units.every((unit) => unit.electoralPreference === "UNRESOLVED")).toBe(
      true,
    );
    expect(day42.population.units.every((unit) => unit.turnoutDisposition === "UNRESOLVED")).toBe(
      true,
    );
    expect(deriveFixtureElectorate(day42).preferenceWeight.UNRESOLVED).toBe(300);
  });

  it("5. resolves once at the exact Population-owned day-43 boundary", () => {
    const day42 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 42);
    expect(() =>
      resolvePopulationElectoralDisposition(
        day42.population,
        42,
        POPULATION_ELECTORAL_RESPONSE_AT,
      ),
    ).toThrow(/not due/i);

    const resolved = resolvePopulationElectoralDisposition(
      day42.population,
      POPULATION_ELECTORAL_RESPONSE_AT,
      POPULATION_ELECTORAL_RESPONSE_AT,
    );
    expect(resolved.population.electoralDispositionResolvedAt).toBe(43);
    expect(resolved.occurrences).toEqual([
      { type: "PopulationElectoralDispositionResolved", at: 43 },
    ]);
    const repeated = resolvePopulationElectoralDisposition(
      resolved.population,
      43,
      POPULATION_ELECTORAL_RESPONSE_AT,
    );
    expect(repeated.population).toBe(resolved.population);
    expect(repeated.occurrences).toHaveLength(0);

    const day43 = advanceWorldTo(day42, 43);
    const historyTypes = day43.history.map((occurrence) => occurrence.type);
    const lastIncorporationIndex = historyTypes.lastIndexOf(
      "PopulationInformationIncorporated",
    );
    const responseIndex = historyTypes.indexOf("PopulationElectoralDispositionResolved");
    expect(lastIncorporationIndex).toBeGreaterThanOrEqual(0);
    expect(responseIndex).toBeGreaterThan(lastIncorporationIndex);
    const day55 = advanceWorldTo(advanceWorldTo(advanceWorldTo(day43, 43), 50), 55);
    expect(
      day55.history.filter(
        (occurrence) => occurrence.type === "PopulationElectoralDispositionResolved",
      ),
    ).toHaveLength(1);
  });

  it("6. resolves DEPLOY Unit A to UNDECIDED / MEDIUM", () => {
    expect(
      populationUnitFor(
        advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 43),
        POPULATION_UNIT_A_ID,
      ),
    ).toMatchObject({ electoralPreference: "UNDECIDED", turnoutDisposition: "MEDIUM" });
  });

  it("7. resolves DEPLOY Unit B to OPPOSITION / HIGH", () => {
    expect(
      populationUnitFor(
        advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 43),
        POPULATION_UNIT_B_ID,
      ),
    ).toMatchObject({ electoralPreference: "OPPOSITION", turnoutDisposition: "HIGH" });
  });

  it("8. resolves DEPLOY Unit C to ADMINISTRATION / HIGH", () => {
    expect(
      populationUnitFor(
        advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 43),
        POPULATION_UNIT_C_ID,
      ),
    ).toMatchObject({ electoralPreference: "ADMINISTRATION", turnoutDisposition: "HIGH" });
  });

  it("9. resolves PRESERVE A/B/C to the bounded fixture results", () => {
    const day43 = advanceWorldTo(resolveRoute("PRESERVE_SUPPORT_RESERVE"), 43);

    expect(populationUnitFor(day43, POPULATION_UNIT_A_ID)).toMatchObject({
      electoralPreference: "UNDECIDED",
      turnoutDisposition: "MEDIUM",
    });
    expect(populationUnitFor(day43, POPULATION_UNIT_B_ID)).toMatchObject({
      electoralPreference: "OPPOSITION",
      turnoutDisposition: "HIGH",
    });
    expect(populationUnitFor(day43, POPULATION_UNIT_C_ID)).toMatchObject({
      programPerformanceBelief: "MIXED",
      electoralPreference: "UNDECIDED",
      turnoutDisposition: "MEDIUM",
    });
  });

  it("10. resolves from Population political state without other world roots", () => {
    const day42 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 42);
    const housingSnapshot = structuredClone(day42.housing);
    const informationSnapshot = structuredClone(day42.information);
    const governanceSnapshot = structuredClone(day42.governance);
    const direct = resolvePopulationElectoralDisposition(
      day42.population,
      43,
      POPULATION_ELECTORAL_RESPONSE_AT,
    );
    const orchestrated = advanceWorldTo(day42, 43);

    expect(direct.population).toEqual(orchestrated.population);
    expect(day42.housing).toEqual(housingSnapshot);
    expect(day42.information).toEqual(informationSnapshot);
    expect(day42.governance).toEqual(governanceSnapshot);
  });

  it("11. does not rewrite PRESERVE political disposition after day-50 Housing improvement", () => {
    const day50 = advanceWorldTo(resolveRoute("PRESERVE_SUPPORT_RESERVE"), 50);
    const unitC = populationUnitFor(day50, POPULATION_UNIT_C_ID);
    const regionC = day50.housing.regions.find((region) => region.id === HOUSING_REGION_C_ID);

    expect(regionC?.affordabilityPressure).toBe(150);
    expect(unitC).toMatchObject({
      housingPressureBelief: "HIGH",
      programPerformanceBelief: "MIXED",
      electoralPreference: "UNDECIDED",
      turnoutDisposition: "MEDIUM",
    });
  });

  it("12. keeps normative eligibility in the legal order while ElectoralState owns only contest and boundary definitions", () => {
    const world = createDeterministicWorldFixture();
    const electoral = world.electoral;

    expect(electoral.contests).toHaveLength(1);
    expect(electoral.boundaries).toHaveLength(1);
    expect(world.governance.electoralEligibilityLegalOrder.rules).toEqual([
      {
        id: GL0_ALL_REPRESENTED_RESIDENT_POPULATION_ELIGIBILITY_RULE_ID,
        requirement:
          "ALL_REPRESENTED_RESIDENT_POPULATION_WITHIN_BOUNDARY_IS_ELIGIBLE",
      },
    ]);
    expect(electoral).not.toHaveProperty("population");
    expect(electoral).not.toHaveProperty("populationUnits");
    expect(electoral).not.toHaveProperty("eligibilityRules");
    expect(electoral).not.toHaveProperty("results");
    expect(electoral.boundaries[0]).not.toHaveProperty("residents");
    expect(electoral.contests[0]).not.toHaveProperty("eligibilityRule");
    expect(electoral.contests[0]).not.toHaveProperty("requirement");
  });

  it("13. makes the electoral boundary reference all three canonical Geography IDs", () => {
    const world = createDeterministicWorldFixture();
    const boundary = world.electoral.boundaries[0];

    expect(boundary.geographyRegionIds).toEqual([
      GEOGRAPHY_REGION_A_ID,
      GEOGRAPHY_REGION_B_ID,
      GEOGRAPHY_REGION_C_ID,
    ]);
    for (const geographyRegionId of boundary.geographyRegionIds) {
      expect(world.geography.regions.some((region) => region.id === geographyRegionId)).toBe(true);
    }
  });

  it("14. uses contextual eligibility rather than a permanent Population voter flag", () => {
    const world = createDeterministicWorldFixture();
    const contest = world.electoral.contests[0];

    expect(contest.eligibilityRuleId).toBe(
      GL0_ALL_REPRESENTED_RESIDENT_POPULATION_ELIGIBILITY_RULE_ID,
    );
    expect(world.population.units.every((unit) => !("isVoter" in unit))).toBe(true);
    expect(world.population.units.every((unit) => !("eligible" in unit))).toBe(true);
  });

  it("14a. requires the canonical legal-order rule when deriving eligibility", () => {
    const day43 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 43);

    expect(() =>
      deriveElectorate(
        day43.electoral,
        day43.population,
        { rules: [] },
        GL0_EXECUTIVE_CONTEST_ID,
        43,
      ),
    ).toThrow(/legal order requires exactly one electoral eligibility rule/i);
  });

  it("15. defines one day-60 contest and derives full eligible weight 300", () => {
    const day43 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 43);
    const contest = day43.electoral.contests[0];
    const electorate = deriveFixtureElectorate(day43);

    expect(contest).toMatchObject({
      id: GL0_EXECUTIVE_CONTEST_ID,
      scheduledElectionAt: GL0_EXECUTIVE_ELECTION_AT,
      eligibilityRuleId:
        GL0_ALL_REPRESENTED_RESIDENT_POPULATION_ELIGIBILITY_RULE_ID,
    });
    expect(electorate.eligiblePopulationWeight).toBe(300);
    expect(electorate.eligiblePopulationUnitIds).toEqual([
      POPULATION_UNIT_A_ID,
      POPULATION_UNIT_B_ID,
      POPULATION_UNIT_C_ID,
    ]);
  });

  it("16. derives DEPLOY preference weights 100 / 100 / 100", () => {
    const electorate = deriveFixtureElectorate(
      advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 43),
    );

    expect(electorate.preferenceWeight).toEqual({
      UNRESOLVED: 0,
      ADMINISTRATION: 100,
      OPPOSITION: 100,
      UNDECIDED: 100,
    });
  });

  it("17. derives PRESERVE preference weights 0 / 100 / 200", () => {
    const electorate = deriveFixtureElectorate(
      advanceWorldTo(resolveRoute("PRESERVE_SUPPORT_RESERVE"), 43),
    );

    expect(electorate.preferenceWeight).toEqual({
      UNRESOLVED: 0,
      ADMINISTRATION: 0,
      OPPOSITION: 100,
      UNDECIDED: 200,
    });
  });

  it("18. derives distinct turnout-disposition weights without actual participation", () => {
    const deployed = deriveFixtureElectorate(
      advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 43),
    );
    const preserved = deriveFixtureElectorate(
      advanceWorldTo(resolveRoute("PRESERVE_SUPPORT_RESERVE"), 43),
    );

    expect(deployed.turnoutDispositionWeight).toEqual({
      UNRESOLVED: 0,
      LOW: 0,
      MEDIUM: 100,
      HIGH: 200,
    });
    expect(preserved.turnoutDispositionWeight).toEqual({
      UNRESOLVED: 0,
      LOW: 0,
      MEDIUM: 200,
      HIGH: 100,
    });
    expect(deployed).not.toHaveProperty("actualParticipation");
    expect(deployed).not.toHaveProperty("ballots");
  });

  it("19. derives narrowed A+C boundary weight 200 without mutating Population", () => {
    const day43 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 43);
    const populationSnapshot = structuredClone(day43.population);
    const narrowed: ElectoralState = {
      ...day43.electoral,
      boundaries: day43.electoral.boundaries.map((boundary) => ({
        ...boundary,
        geographyRegionIds: [GEOGRAPHY_REGION_A_ID, GEOGRAPHY_REGION_C_ID],
      })),
    };
    const electorate = deriveElectorate(
      narrowed,
      day43.population,
      day43.governance.electoralEligibilityLegalOrder,
      GL0_EXECUTIVE_CONTEST_ID,
      43,
    );

    expect(electorate.eligiblePopulationWeight).toBe(200);
    expect(electorate.eligiblePopulationUnitIds).toEqual([
      POPULATION_UNIT_A_ID,
      POPULATION_UNIT_C_ID,
    ]);
    expect(day43.population).toEqual(populationSnapshot);
  });

  it("20. keeps electorate derivation pure and history-free", () => {
    const day43 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 43);
    const populationSnapshot = structuredClone(day43.population);
    const electoralSnapshot = structuredClone(day43.electoral);
    const historySnapshot = structuredClone(day43.history);

    deriveFixtureElectorate(day43);
    expect(day43.population).toEqual(populationSnapshot);
    expect(day43.electoral).toEqual(electoralSnapshot);
    expect(day43.history).toEqual(historySnapshot);
  });

  it("21. makes direct 30→50 equal chunked 30→40→41→42→43→50", () => {
    const day30 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 30);
    const direct = advanceWorldTo(day30, 50);
    const chunked = advanceWorldTo(
      advanceWorldTo(
        advanceWorldTo(advanceWorldTo(advanceWorldTo(day30, 40), 41), 42),
        43,
      ),
      50,
    );

    expect(chunked.population).toEqual(direct.population);
    expect(chunked.information).toEqual(direct.information);
    expect(chunked.housing).toEqual(direct.housing);
    expect(chunked.electoral).toEqual(direct.electoral);
    expect(meaningfulDownstreamHistory(chunked)).toEqual(meaningfulDownstreamHistory(direct));
  });

  it("22. remains scheduled immediately before election without ballots, result, winner, or transfer", () => {
    const day59 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT"), 59);
    const contest = day59.electoral.contests[0];
    const process = day59.electoral.electionProcesses[0];

    expect(day59.time.current).toBe(GL0_EXECUTIVE_ELECTION_AT - 1);
    expect(contest.scheduledElectionAt).toBe(GL0_EXECUTIVE_ELECTION_AT);
    expect(contest).not.toHaveProperty("ballots");
    expect(contest).not.toHaveProperty("result");
    expect(contest).not.toHaveProperty("winner");
    expect(process).toMatchObject({ status: "SCHEDULED", result: null, certification: null });
    expect(day59.history.some((occurrence) => occurrence.type.includes("Election"))).toBe(false);
    expect(day59.governance).not.toHaveProperty("successor");
  });

  it("23. exposes exact Population and derived-electorate developer projections", () => {
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
    const view = session.advanceTo(43);

    expect(view.populationAudit.electoralDispositionResolvedAt).toBe(43);
    expect(view.populationAudit.units.find((unit) => unit.id === POPULATION_UNIT_C_ID)).toMatchObject({
      electoralPreference: "ADMINISTRATION",
      turnoutDisposition: "HIGH",
    });
    expect(view.electoralAudit.contest.scheduledElectionAt).toBe(60);
    expect(view.electoralAudit.derivedElectorate.eligiblePopulationWeight).toBe(300);
    expect(view.electoralAudit.contest).toMatchObject({
      eligibilityRuleId:
        GL0_ALL_REPRESENTED_RESIDENT_POPULATION_ELIGIBILITY_RULE_ID,
      eligibilityRequirement:
        "ALL_REPRESENTED_RESIDENT_POPULATION_WITHIN_BOUNDARY_IS_ELIGIBLE",
    });
    expect(view.electoralAudit.derivedElectorate.preferenceWeight).toMatchObject({
      ADMINISTRATION: 100,
      OPPOSITION: 100,
      UNDECIDED: 100,
    });
  });
});
