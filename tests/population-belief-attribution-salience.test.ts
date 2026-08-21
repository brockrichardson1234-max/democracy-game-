import { describe, expect, it } from "vitest";

import { createGameSession } from "../src/app/session";
import { STATE_A_ID, STATE_C_ID } from "../src/sim/federalism";
import {
  GEOGRAPHY_REGION_A_ID,
  GEOGRAPHY_REGION_B_ID,
  GEOGRAPHY_REGION_C_ID,
} from "../src/sim/geography";
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
  HOUSING_REGION_A_ID,
  HOUSING_REGION_B_ID,
  HOUSING_REGION_C_ID,
} from "../src/sim/housing";
import {
  ADMINISTRATION_HOUSING_CLAIM_ID,
  exposeInformationArtifact,
  OFFICIAL_HOUSING_REPORT_ID,
  OPPOSITION_HOUSING_CLAIM_ID,
  PUBLIC_AUDIENCE_ALPHA_ID,
  PUBLIC_AUDIENCE_BETA_ID,
  PUBLIC_AUDIENCE_GAMMA_ID,
  resolveInformationBoundary,
  type InformationExposure,
} from "../src/sim/information";
import type { ProposalTerms } from "../src/sim/legislature";
import {
  createPopulationState,
  incorporateInformationExposure,
  POPULATION_UNIT_A_ID,
  POPULATION_UNIT_B_ID,
  POPULATION_UNIT_C_ID,
  type PopulationUnit,
} from "../src/sim/population";
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

const resolveRoute = (
  action: "DEPLOY_SUPPORT_TO_C" | "PRESERVE_SUPPORT_RESERVE",
): WorldState => {
  let world = establishProgram();
  world = materializeStateProject(world, STATE_A_ID);
  world = materializeStateProject(world, STATE_C_ID);
  world = advanceWorldTo(world, 5);
  return resolveHousingImplementationResponse(world, action);
};

const populationUnitFor = (world: WorldState, populationUnitId: string): PopulationUnit => {
  const unit = world.population.units.find((candidate) => candidate.id === populationUnitId);
  if (unit === undefined) throw new Error(`Missing Population unit ${populationUnitId}.`);
  return unit;
};

const exposureFor = (
  world: WorldState,
  artifactId: string,
  audienceId: string,
): InformationExposure => {
  const exposure = world.information.exposures.find(
    (candidate) =>
      candidate.artifactId === artifactId && candidate.audienceId === audienceId,
  );
  if (exposure === undefined) throw new Error(`Missing exposure for ${artifactId}.`);
  return exposure;
};

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
    ].includes(occurrence.type),
  );

describe("Commit 19 Population belief, attribution, and salience", () => {
  it("1. preserves the accepted Commit-18 report, claim, and exposure path", () => {
    const day42 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 42);

    expect(day42.information.artifacts).toHaveLength(1);
    expect(day42.information.politicalClaims.map((claim) => claim.id)).toEqual([
      ADMINISTRATION_HOUSING_CLAIM_ID,
      OPPOSITION_HOUSING_CLAIM_ID,
    ]);
    expect(day42.information.exposures).toHaveLength(6);
  });

  it("2. adds one canonical PopulationState as a WorldState sibling root", () => {
    const world = createDeterministicWorldFixture();

    expect(world.population.units).toHaveLength(3);
    expect(world.geography).not.toHaveProperty("population");
    expect(world.information).not.toHaveProperty("population");
    expect(world.governance).not.toHaveProperty("population");
    expect(world.housing).not.toHaveProperty("population");
  });

  it("3. creates exactly three positive aggregate units with conserved total weight 300", () => {
    const world = createDeterministicWorldFixture();

    expect(world.population.units).toHaveLength(3);
    expect(world.population.units.reduce((total, unit) => total + unit.weight, 0)).toBe(300);
    expect(world.population.units.every((unit) => unit.weight === 100)).toBe(true);

    const sample = world.population.units[0];
    expect(() => createPopulationState([{ ...sample, weight: 0 }])).toThrow(/positive/i);
    expect(() =>
      createPopulationState([
        sample,
        { ...world.population.units[1], id: sample.id },
      ]),
    ).toThrow(/IDs must be unique/i);
    expect(() =>
      createPopulationState([
        sample,
        {
          ...world.population.units[1],
          informationAudienceId: sample.informationAudienceId,
        },
      ]),
    ).toThrow(/audience must bind/i);
  });

  it("4. keeps residence on Population as Geography references without resident lists", () => {
    const world = createDeterministicWorldFixture();

    expect(world.population.units.map((unit) => unit.residenceGeographyId)).toEqual([
      GEOGRAPHY_REGION_A_ID,
      GEOGRAPHY_REGION_B_ID,
      GEOGRAPHY_REGION_C_ID,
    ]);
    for (const unit of world.population.units) {
      expect(world.geography.regions.some((region) => region.id === unit.residenceGeographyId)).toBe(
        true,
      );
    }
    expect(world.geography).not.toHaveProperty("residents");
  });

  it("5. references Housing regions without copying stock or pressure truth", () => {
    const world = createDeterministicWorldFixture();

    expect(world.population.units.map((unit) => unit.housingRegionId)).toEqual([
      HOUSING_REGION_A_ID,
      HOUSING_REGION_B_ID,
      HOUSING_REGION_C_ID,
    ]);
    for (const unit of world.population.units) {
      expect(world.housing.regions.some((region) => region.id === unit.housingRegionId)).toBe(true);
      expect(unit).not.toHaveProperty("housingStockUnits");
      expect(unit).not.toHaveProperty("affordabilityPressure");
    }
  });

  it("6. preserves Alpha/Beta/Gamma as Information audiences distinct from Population IDs", () => {
    const world = createDeterministicWorldFixture();
    const populationIds = world.population.units.map((unit) => unit.id);

    expect(world.information.audiences.map((audience) => audience.id)).toEqual([
      PUBLIC_AUDIENCE_ALPHA_ID,
      PUBLIC_AUDIENCE_BETA_ID,
      PUBLIC_AUDIENCE_GAMMA_ID,
    ]);
    for (const audience of world.information.audiences) {
      expect(populationIds).not.toContain(audience.id);
      expect(audience).not.toHaveProperty("belief");
    }
  });

  it("7. binds Alpha→Unit C, Beta→Unit B, and Gamma→Unit A", () => {
    const world = createDeterministicWorldFixture();
    const binding = Object.fromEntries(
      world.population.units.map((unit) => [unit.informationAudienceId, unit.id]),
    );

    expect(binding).toEqual({
      [PUBLIC_AUDIENCE_ALPHA_ID]: POPULATION_UNIT_C_ID,
      [PUBLIC_AUDIENCE_BETA_ID]: POPULATION_UNIT_B_ID,
      [PUBLIC_AUDIENCE_GAMMA_ID]: POPULATION_UNIT_A_ID,
    });
    expect(populationUnitFor(world, POPULATION_UNIT_A_ID).baselinePoliticalDisposition).toBe(
      "SWING",
    );
    expect(populationUnitFor(world, POPULATION_UNIT_B_ID).baselinePoliticalDisposition).toBe(
      "OPPOSITION_LEAN",
    );
    expect(populationUnitFor(world, POPULATION_UNIT_C_ID).baselinePoliticalDisposition).toBe(
      "ADMINISTRATION_LEAN",
    );
  });

  it("8. initializes recipient belief and attribution unknown with LOW salience", () => {
    const world = createDeterministicWorldFixture();

    for (const unit of world.population.units) {
      expect(unit.housingPressureBelief).toBe("UNKNOWN");
      expect(unit.programPerformanceBelief).toBe("UNKNOWN");
      expect(unit.housingAttribution).toEqual({ target: "UNKNOWN", evaluation: "NONE" });
      expect(unit.housingSalience).toBe("LOW");
    }
    expect(world.population.informationIncorporations).toHaveLength(0);
  });

  it("9. distinguishes report release, exposure, incorporation, and resulting belief", () => {
    const day30 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 30);
    const release = resolveInformationBoundary(day30.information, day30.housing, 40);
    const exposed = exposeInformationArtifact(
      release.information,
      OFFICIAL_HOUSING_REPORT_ID,
      PUBLIC_AUDIENCE_ALPHA_ID,
      40,
    );

    expect(release.information.artifacts).toHaveLength(1);
    expect(release.information.exposures).toHaveLength(0);
    expect(exposed.information.exposures).toHaveLength(1);
    expect(populationUnitFor(day30, POPULATION_UNIT_C_ID).housingPressureBelief).toBe("UNKNOWN");

    const incorporated = incorporateInformationExposure(
      day30.population,
      exposed.information,
      exposed.information.exposures[0],
      40,
    );
    expect(
      incorporated.population.units.find((unit) => unit.id === POPULATION_UNIT_C_ID)
        ?.housingPressureBelief,
    ).toBe("MODERATE");
  });

  it("10. gives DEPLOY Unit C a MODERATE day-40 report belief", () => {
    const day40 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 40);
    const unitC = populationUnitFor(day40, POPULATION_UNIT_C_ID);

    expect(unitC.housingPressureBelief).toBe("MODERATE");
    expect(unitC.programPerformanceBelief).toBe("UNKNOWN");
    expect(unitC.housingSalience).toBe("MEDIUM");
  });

  it("11. gives PRESERVE Unit C a HIGH day-40 report belief", () => {
    const day40 = advanceWorldTo(resolveRoute("PRESERVE_SUPPORT_RESERVE"), 40);
    const unitC = populationUnitFor(day40, POPULATION_UNIT_C_ID);

    expect(unitC.housingPressureBelief).toBe("HIGH");
    expect(unitC.programPerformanceBelief).toBe("UNKNOWN");
    expect(unitC.housingSalience).toBe("MEDIUM");
  });

  it("12. gives DEPLOY Unit C WORKING belief and bounded program credit at day 41", () => {
    const unitC = populationUnitFor(
      advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 41),
      POPULATION_UNIT_C_ID,
    );

    expect(unitC.housingPressureBelief).toBe("MODERATE");
    expect(unitC.programPerformanceBelief).toBe("WORKING");
    expect(unitC.housingAttribution).toEqual({
      target: "FEDERAL_HOUSING_PROGRAM",
      evaluation: "CREDIT",
    });
  });

  it("13. gives PRESERVE Unit C MIXED belief without blindly assigning credit", () => {
    const unitC = populationUnitFor(
      advanceWorldTo(resolveRoute("PRESERVE_SUPPORT_RESERVE"), 41),
      POPULATION_UNIT_C_ID,
    );

    expect(unitC.housingPressureBelief).toBe("HIGH");
    expect(unitC.programPerformanceBelief).toBe("MIXED");
    expect(unitC.housingAttribution).toEqual({ target: "UNKNOWN", evaluation: "NONE" });
  });

  it("14. gives Unit B MODERATE pressure, INADEQUATE performance, and program blame", () => {
    const unitB = populationUnitFor(
      advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 42),
      POPULATION_UNIT_B_ID,
    );

    expect(unitB.housingPressureBelief).toBe("MODERATE");
    expect(unitB.programPerformanceBelief).toBe("INADEQUATE");
    expect(unitB.housingAttribution).toEqual({
      target: "FEDERAL_HOUSING_PROGRAM",
      evaluation: "BLAME",
    });
  });

  it("15. gives Unit A CONTESTED claims without report belief or attribution", () => {
    const unitA = populationUnitFor(
      advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 42),
      POPULATION_UNIT_A_ID,
    );

    expect(unitA.housingPressureBelief).toBe("UNKNOWN");
    expect(unitA.programPerformanceBelief).toBe("CONTESTED");
    expect(unitA.housingAttribution).toEqual({ target: "UNKNOWN", evaluation: "NONE" });
  });

  it("16. makes salience HIGH for all three while belief direction remains differentiated", () => {
    const day42 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 42);

    expect(day42.population.units.map((unit) => unit.housingSalience)).toEqual([
      "HIGH",
      "HIGH",
      "HIGH",
    ]);
    expect(new Set(day42.population.units.map((unit) => unit.programPerformanceBelief)).size).toBe(
      3,
    );
    expect(day42.population.units.reduce((total, unit) => total + unit.weight, 0)).toBe(300);
  });

  it("17. leaves Information exposures unchanged when Population incorporates one", () => {
    const day30 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 30);
    const release = resolveInformationBoundary(day30.information, day30.housing, 40);
    const exposed = exposeInformationArtifact(
      release.information,
      OFFICIAL_HOUSING_REPORT_ID,
      PUBLIC_AUDIENCE_ALPHA_ID,
      40,
    );
    const informationSnapshot = structuredClone(exposed.information);

    incorporateInformationExposure(
      day30.population,
      exposed.information,
      exposed.information.exposures[0],
      40,
    );
    expect(exposed.information).toEqual(informationSnapshot);
  });

  it("18. leaves Housing and Governance unchanged during Population processing", () => {
    const day30 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 30);
    const housingSnapshot = structuredClone(day30.housing);
    const governanceSnapshot = structuredClone(day30.governance);
    const release = resolveInformationBoundary(day30.information, day30.housing, 40);
    const exposed = exposeInformationArtifact(
      release.information,
      OFFICIAL_HOUSING_REPORT_ID,
      PUBLIC_AUDIENCE_ALPHA_ID,
      40,
    );

    incorporateInformationExposure(
      day30.population,
      exposed.information,
      exposed.information.exposures[0],
      40,
    );
    expect(day30.housing).toEqual(housingSnapshot);
    expect(day30.governance).toEqual(governanceSnapshot);
  });

  it("19. keeps PRESERVE Unit C's stale HIGH belief after actual pressure improves at day 50", () => {
    const day50 = advanceWorldTo(resolveRoute("PRESERVE_SUPPORT_RESERVE"), 50);
    const unitC = populationUnitFor(day50, POPULATION_UNIT_C_ID);
    const regionC = day50.housing.regions.find((region) => region.id === HOUSING_REGION_C_ID);

    expect(regionC?.affordabilityPressure).toBe(150);
    expect(unitC.housingPressureBelief).toBe("HIGH");
    expect(
      day50.population.informationIncorporations.filter(
        (record) => record.populationUnitId === POPULATION_UNIT_C_ID,
      ),
    ).toHaveLength(2);
  });

  it("20. rejects duplicate, unknown, tampered, unbound, and unknown-region incorporation", () => {
    const day30 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 30);
    const day40 = advanceWorldTo(day30, 40);
    const alphaExposure = exposureFor(
      day40,
      OFFICIAL_HOUSING_REPORT_ID,
      PUBLIC_AUDIENCE_ALPHA_ID,
    );

    expect(() =>
      incorporateInformationExposure(day40.population, day40.information, alphaExposure, 40),
    ).toThrow(/already incorporated/i);
    expect(advanceWorldTo(day40, 40).population).toEqual(day40.population);

    expect(() =>
      incorporateInformationExposure(
        day30.population,
        day40.information,
        { ...alphaExposure, id: "missing-exposure" },
        40,
      ),
    ).toThrow(/unknown exposure/i);
    expect(() =>
      incorporateInformationExposure(
        day30.population,
        day40.information,
        { ...alphaExposure, artifactId: ADMINISTRATION_HOUSING_CLAIM_ID },
        40,
      ),
    ).toThrow(/does not match/i);

    const unboundExposure: InformationExposure = {
      id: "gl0-unbound-exposure",
      artifactId: OFFICIAL_HOUSING_REPORT_ID,
      audienceId: "gl0-unbound-audience",
      exposedAtSimulationTime: 40,
    };
    const unboundInformation = {
      ...day40.information,
      audiences: [
        ...day40.information.audiences,
        {
          id: unboundExposure.audienceId,
          audienceType: "GL0_SYNTHETIC_PUBLIC_DISTRIBUTION_FIXTURE" as const,
        },
      ],
      exposures: [...day40.information.exposures, unboundExposure],
    };
    expect(() =>
      incorporateInformationExposure(
        day30.population,
        unboundInformation,
        unboundExposure,
        40,
      ),
    ).toThrow(/exactly one Population unit/i);

    const unknownRegionPopulation = createPopulationState(
      day30.population.units.map((unit) =>
        unit.id === POPULATION_UNIT_C_ID
          ? { ...unit, housingRegionId: "missing-housing-region" }
          : unit,
      ),
    );
    expect(() =>
      incorporateInformationExposure(
        unknownRegionPopulation,
        day40.information,
        alphaExposure,
        40,
      ),
    ).toThrow(/exactly one result/i);
  });

  it("21. makes direct 30→50 equal chunked 30→40→41→42→50", () => {
    const day30 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 30);
    const direct = advanceWorldTo(day30, 50);
    const chunked = advanceWorldTo(
      advanceWorldTo(advanceWorldTo(advanceWorldTo(day30, 40), 41), 42),
      50,
    );

    expect(chunked.population).toEqual(direct.population);
    expect(chunked.information).toEqual(direct.information);
    expect(chunked.housing).toEqual(direct.housing);
    expect(meaningfulDownstreamHistory(chunked)).toEqual(meaningfulDownstreamHistory(direct));
  });

  it("22. projects raw Population audit state without preference, approval, turnout, or election", () => {
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
    const view = session.advanceTo(42);
    const world = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 42);

    expect(view.populationAudit.totalWeight).toBe(300);
    expect(view.populationAudit.units).toHaveLength(3);
    expect(view.populationAudit.units.find((unit) => unit.id === POPULATION_UNIT_C_ID)).toMatchObject({
      housingPressureBelief: "MODERATE",
      programPerformanceBelief: "WORKING",
      housingSalience: "HIGH",
      incorporatedArtifactIds: [OFFICIAL_HOUSING_REPORT_ID, ADMINISTRATION_HOUSING_CLAIM_ID],
    });
    expect(world.population.units.every((unit) => unit.electoralPreference === "UNRESOLVED")).toBe(
      true,
    );
    expect(world.population.units.every((unit) => unit.turnoutDisposition === "UNRESOLVED")).toBe(
      true,
    );
    expect(world.population.units.every((unit) => !("approval" in unit))).toBe(true);
    expect(world.governance).not.toHaveProperty("elections");
  });
});
