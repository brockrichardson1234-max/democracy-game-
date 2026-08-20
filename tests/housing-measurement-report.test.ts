import { describe, expect, it } from "vitest";

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
import { materializeHousingProject } from "../src/sim/housing";
import {
  HOUSING_MEASUREMENT_OBSERVATION_END,
  HOUSING_MEASUREMENT_OBSERVATION_START,
  OFFICIAL_HOUSING_REPORT_RELEASE_AT,
  type HousingRegionalObservation,
} from "../src/sim/information";
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

const createResponseWorld = (): WorldState => {
  let world = establishProgram();
  world = materializeStateProject(world, STATE_A_ID);
  world = materializeStateProject(world, STATE_C_ID);
  return advanceWorldTo(world, 5);
};

const resolveRoute = (
  action: "DEPLOY_SUPPORT_TO_C" | "PRESERVE_SUPPORT_RESERVE",
): WorldState => resolveHousingImplementationResponse(createResponseWorld(), action);

const regionFor = (world: WorldState, stateId: string) => {
  const region = world.housing.regions.find(
    (candidate) => candidate.stateJurisdictionId === stateId,
  );
  if (region === undefined) throw new Error(`Missing Housing region for ${stateId}.`);
  return region;
};

const capturedObservationFor = (world: WorldState, stateId: string) => {
  const observation = world.information.housingMeasurement.result?.regionalObservations.find(
    (candidate) => candidate.housingRegionId === regionFor(world, stateId).id,
  );
  if (observation === undefined) throw new Error(`Missing captured observation for ${stateId}.`);
  return observation;
};

const reportObservationFor = (world: WorldState, stateId: string) => {
  const observation = world.information.artifacts[0]?.regionalResults.find(
    (candidate) => candidate.housingRegionId === regionFor(world, stateId).id,
  );
  if (observation === undefined) throw new Error(`Missing report observation for ${stateId}.`);
  return observation;
};

const summarizedObservations = (observations: readonly HousingRegionalObservation[]) =>
  observations.map((observation) => ({
    housingRegionId: observation.housingRegionId,
    stock: observation.housingStockUnits,
    pressure: observation.affordabilityPressure,
  }));

const meaningfulMaterialAndInformationHistory = (world: WorldState) =>
  world.history.filter((occurrence) =>
    [
      "HousingProjectStarted",
      "HousingProjectCompleted",
      "HousingStockChanged",
      "HousingAffordabilityPressureChanged",
      "HousingMeasurementCaptured",
      "OfficialHousingReportReleased",
    ].includes(occurrence.type),
  );

describe("Commit 17 Housing measurement and official report lag", () => {
  it("1. preserves accepted Commit-16 material results", () => {
    const day30 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 30);

    expect(regionFor(day30, STATE_A_ID)).toMatchObject({
      housingStockUnits: 1_100,
      affordabilityPressure: 100,
    });
    expect(regionFor(day30, STATE_B_ID)).toMatchObject({
      housingStockUnits: 1_000,
      affordabilityPressure: 150,
    });
    expect(regionFor(day30, STATE_C_ID)).toMatchObject({
      housingStockUnits: 1_100,
      affordabilityPressure: 150,
    });
  });

  it("2. owns measurement state separately from canonical Housing", () => {
    const world = createDeterministicWorldFixture();

    expect(world.information.housingMeasurement.status).toBe("SCHEDULED");
    expect(world.housing).not.toHaveProperty("housingMeasurement");
    expect(world.information).not.toHaveProperty("regions");
    expect(world.information).not.toBe(world.housing);
  });

  it("3. references Housing region IDs without copying geography", () => {
    const world = createDeterministicWorldFixture();

    expect(world.information.housingMeasurement.housingRegionIds).toEqual(
      world.housing.regions.map((region) => region.id),
    );
    expect(world.information.housingMeasurement).not.toHaveProperty("geographyRegions");
    expect(world.information.housingMeasurement).not.toHaveProperty("geographyRegionIds");
  });

  it("4. captures no observations before day 30", () => {
    const day29 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 29);

    expect(day29.information.housingMeasurement).toMatchObject({
      status: "SCHEDULED",
      capturedAtSimulationTime: null,
      result: null,
    });
    expect(day29.history.some((occurrence) => occurrence.type === "HousingMeasurementCaptured")).toBe(
      false,
    );
  });

  it("5. captures one committed regional measurement at day 30", () => {
    const day30 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 30);
    const process = day30.information.housingMeasurement;

    expect(process.status).toBe("CAPTURED");
    expect(process.capturedAtSimulationTime).toBe(30);
    expect(process.result?.committedAtSimulationTime).toBe(30);
    expect(process.result?.regionalObservations).toHaveLength(3);
    expect(
      day30.history.filter((occurrence) => occurrence.type === "HousingMeasurementCaptured"),
    ).toHaveLength(1);
  });

  it("6. captures the stabilized day-30 Housing stock and pressure", () => {
    const day30 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 30);

    for (const stateId of [STATE_A_ID, STATE_B_ID, STATE_C_ID]) {
      const region = regionFor(day30, stateId);
      expect(capturedObservationFor(day30, stateId)).toEqual({
        housingRegionId: region.id,
        housingStockUnits: region.housingStockUnits,
        affordabilityPressure: region.affordabilityPressure,
      });
    }
  });

  it("7. preserves the same committed result after capture", () => {
    const day30 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 30);
    const capturedResult = day30.information.housingMeasurement.result;
    const snapshot = structuredClone(capturedResult);
    const day39 = advanceWorldTo(day30, 39);

    expect(day39.information.housingMeasurement.result).toBe(capturedResult);
    expect(day39.information.housingMeasurement.result).toEqual(snapshot);
  });

  it("8. releases no report artifact before day 40", () => {
    const day39 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 39);

    expect(day39.information.artifacts).toHaveLength(0);
    expect(
      day39.history.some((occurrence) => occurrence.type === "OfficialHousingReportReleased"),
    ).toBe(false);
  });

  it("9. releases exactly one official Housing report at day 40", () => {
    const day40 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 40);
    const day80 = advanceWorldTo(day40, 80);

    expect(day40.information.housingMeasurement.status).toBe("COMPLETED");
    expect(day40.information.artifacts).toHaveLength(1);
    expect(day40.information.artifacts[0].artifactType).toBe("OFFICIAL_HOUSING_REPORT");
    expect(day80.information.artifacts).toEqual(day40.information.artifacts);
    expect(
      day80.history.filter((occurrence) => occurrence.type === "OfficialHousingReportReleased"),
    ).toHaveLength(1);
  });

  it("10. links the report to its source measurement and existing producer", () => {
    const day40 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 40);
    const process = day40.information.housingMeasurement;
    const report = day40.information.artifacts[0];

    expect(report.sourceMeasurementId).toBe(process.id);
    expect(report.producerInstitutionId).toBe(process.producerInstitutionId);
    expect(day40.governance.administrativeInstitution?.id).toBe(report.producerInstitutionId);
  });

  it("11. distinguishes the day 0-30 as-of window from day-40 release", () => {
    const report = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 40)
      .information.artifacts[0];

    expect(report).toMatchObject({
      asOfStart: HOUSING_MEASUREMENT_OBSERVATION_START,
      asOfEnd: HOUSING_MEASUREMENT_OBSERVATION_END,
      createdAtSimulationTime: OFFICIAL_HOUSING_REPORT_RELEASE_AT,
      releasedAtSimulationTime: OFFICIAL_HOUSING_REPORT_RELEASE_AT,
      accessClass: "PUBLIC",
    });
  });

  it("12. records DEPLOY day-30 A/B/C results", () => {
    const day30 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 30);

    expect(
      summarizedObservations(
        day30.information.housingMeasurement.result!.regionalObservations,
      ),
    ).toEqual([
      { housingRegionId: regionFor(day30, STATE_A_ID).id, stock: 1_100, pressure: 100 },
      { housingRegionId: regionFor(day30, STATE_B_ID).id, stock: 1_000, pressure: 150 },
      { housingRegionId: regionFor(day30, STATE_C_ID).id, stock: 1_100, pressure: 150 },
    ]);
  });

  it("13. records PRESERVE day-30 C pressure at its unchanged baseline", () => {
    const day30 = advanceWorldTo(resolveRoute("PRESERVE_SUPPORT_RESERVE"), 30);

    expect(capturedObservationFor(day30, STATE_A_ID)).toMatchObject({
      housingStockUnits: 1_100,
      affordabilityPressure: 100,
    });
    expect(capturedObservationFor(day30, STATE_B_ID)).toMatchObject({
      housingStockUnits: 1_000,
      affordabilityPressure: 150,
    });
    expect(capturedObservationFor(day30, STATE_C_ID)).toMatchObject({
      housingStockUnits: 1_000,
      affordabilityPressure: 250,
    });
  });

  it("14. proves reality changes 17 days before the DEPLOY report release", () => {
    const route = resolveRoute("DEPLOY_SUPPORT_TO_C");
    const day23 = advanceWorldTo(route, 23);
    const day30 = advanceWorldTo(day23, 30);
    const day39 = advanceWorldTo(day30, 39);
    const day40 = advanceWorldTo(day39, 40);

    expect(regionFor(day23, STATE_C_ID).affordabilityPressure).toBe(150);
    expect(day23.information.housingMeasurement.result).toBeNull();
    expect(capturedObservationFor(day30, STATE_C_ID).affordabilityPressure).toBe(150);
    expect(day39.information.artifacts).toHaveLength(0);
    expect(reportObservationFor(day40, STATE_C_ID).affordabilityPressure).toBe(150);
  });

  it("15. a Housing-owned post-capture change cannot rewrite captured observations", () => {
    const captured = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 30);
    const capturedResult = captured.information.housingMeasurement.result;
    const withLateHousingProject: WorldState = {
      ...captured,
      housing: materializeHousingProject(
        captured.housing,
        { stateJurisdictionId: STATE_A_ID, sourceDisbursementId: "post-capture-fixture" },
        30,
      ),
    };
    const day40 = advanceWorldTo(withLateHousingProject, 40);

    expect(regionFor(day40, STATE_A_ID)).toMatchObject({
      housingStockUnits: 1_200,
      affordabilityPressure: 0,
    });
    expect(day40.information.housingMeasurement.result).toBe(capturedResult);
    expect(capturedObservationFor(day40, STATE_A_ID)).toMatchObject({
      housingStockUnits: 1_100,
      affordabilityPressure: 100,
    });
  });

  it("16. released report content remains the frozen day-30 result", () => {
    const captured = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 30);
    const withLateHousingProject: WorldState = {
      ...captured,
      housing: materializeHousingProject(
        captured.housing,
        { stateJurisdictionId: STATE_A_ID, sourceDisbursementId: "stale-report-fixture" },
        30,
      ),
    };
    const day50 = advanceWorldTo(withLateHousingProject, 50);

    expect(regionFor(day50, STATE_A_ID).housingStockUnits).toBe(1_200);
    expect(reportObservationFor(day50, STATE_A_ID)).toMatchObject({
      housingStockUnits: 1_100,
      affordabilityPressure: 100,
    });
    expect(day50.information.artifacts[0].regionalResults).not.toBe(
      day50.information.housingMeasurement.result!.regionalObservations,
    );
  });

  it("17. one-shot and chunked advancement preserve Housing, Information, and history order", () => {
    const route = resolveRoute("DEPLOY_SUPPORT_TO_C");
    const direct = advanceWorldTo(route, 50);
    const chunked = advanceWorldTo(
      advanceWorldTo(
        advanceWorldTo(advanceWorldTo(route, 23), 30),
        40,
      ),
      50,
    );

    expect(chunked.housing).toEqual(direct.housing);
    expect(chunked.information).toEqual(direct.information);
    expect(meaningfulMaterialAndInformationHistory(chunked)).toEqual(
      meaningfulMaterialAndInformationHistory(direct),
    );
  });

  it("18. stabilizes same-time day-30 Housing before measurement capture", () => {
    const day20 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 20);
    const withDay30Completion: WorldState = {
      ...day20,
      housing: materializeHousingProject(
        day20.housing,
        { stateJurisdictionId: STATE_A_ID, sourceDisbursementId: "day-30-fixture" },
        20,
      ),
    };
    const day30 = advanceWorldTo(withDay30Completion, 30);

    expect(regionFor(day30, STATE_A_ID)).toMatchObject({
      housingStockUnits: 1_200,
      affordabilityPressure: 0,
    });
    expect(capturedObservationFor(day30, STATE_A_ID)).toMatchObject({
      housingStockUnits: 1_200,
      affordabilityPressure: 0,
    });
    expect(
      day30.history
        .filter((occurrence) => occurrence.at === 30)
        .map((occurrence) => occurrence.type),
    ).toEqual([
      "HousingProjectCompleted",
      "HousingStockChanged",
      "HousingAffordabilityPressureChanged",
      "HousingMeasurementCaptured",
    ]);
  });

  it("19. report release mutates neither Housing nor political state and creates no exposure", () => {
    const day39 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 39);
    const day40 = advanceWorldTo(day39, 40);

    expect(day40.housing).toEqual(day39.housing);
    expect(day40.governance).toEqual(day39.governance);
    expect(day40.information).not.toHaveProperty("exposures");
    expect(day40).not.toHaveProperty("population");
  });

  it("20. exposes scheduled, captured, and released states in the dev projection", () => {
    const session = createGameSession();
    expect(session.getView().officialHousingMeasurement.status).toBe("SCHEDULED");

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

    const captured = session.advanceTo(30).officialHousingMeasurement;
    const released = session.advanceTo(40).officialHousingMeasurement;
    expect(captured).toMatchObject({
      status: "CAPTURED",
      observationStart: 0,
      observationEnd: 30,
      capturedAtSimulationTime: 30,
      scheduledReleaseAtSimulationTime: 40,
    });
    expect(captured.capturedRegionalResults).toHaveLength(3);
    expect(released.status).toBe("RELEASED");
    expect(released.releasedReport).toMatchObject({
      sourceMeasurementId: captured.id,
      releasedAtSimulationTime: 40,
      accessClass: "PUBLIC",
    });
  });
});
