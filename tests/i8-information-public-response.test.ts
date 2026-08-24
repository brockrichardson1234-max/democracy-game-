import { describe, expect, it } from "vitest";

import { createIntegratedPartialRuntimeSession } from "../src/app/integrated-session";
import { loadGovernmentConfiguration } from "../src/configuration/loader";
import { canonicalConfigurationContent } from "../src/configuration/canonical";
import { sha256Hex } from "../src/configuration/sha256";
import { US_V0_STRUCTURAL_CONFIGURATION } from "../src/content/us-v0/configuration";
import {
  US_V0_I8_ADMIN_CAPTURE,
  US_V0_I8_ADMIN_RELEASE,
  US_V0_I8_CLAIM_RELEASE,
  US_V0_I8_DELIVERY,
  US_V0_I8_EXPOSURE,
  US_V0_I8_INFORMATION_CONFIGURATION,
  US_V0_I8_MATERIAL_CAPTURE,
  US_V0_I8_MATERIAL_RELEASE,
  US_V0_I8_RESPONSE,
  US_V0_I8_RUNTIME_ARTIFACTS,
} from "../src/content/us-v0/i8";
import { US_V0_2028_POPULAR_SELECTION } from "../src/content/us-v0/i5";

const createSession = () => createIntegratedPartialRuntimeSession(
  US_V0_STRUCTURAL_CONFIGURATION,
  US_V0_I8_RUNTIME_ARTIFACTS,
);

describe("I8 measurement, information, and public response", () => {
  it("pins a versioned non-historical response scaffold without contemporary political content", () => {
    expect(() => loadGovernmentConfiguration(US_V0_STRUCTURAL_CONFIGURATION)).not.toThrow();
    expect(US_V0_I8_INFORMATION_CONFIGURATION).toMatchObject({
      semanticsVersion: "us-v0-information-public-response-1",
      parameterHash: "38140197b50961ffb05c4131885dbbbd66ca5cf90e4805fe354fa8760d615839",
      classification: "APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD",
    });
    expect(sha256Hex(canonicalConfigurationContent(US_V0_STRUCTURAL_CONFIGURATION))).toBe(
      "ad9bfe4b670f66b86c28049aa2a23976e23efcd136c3a226068051887d36b2fe",
    );
    expect(JSON.stringify(US_V0_I8_INFORMATION_CONFIGURATION)).not.toMatch(/poll|approval|democrat|republican|ideology/i);
  });

  it("keeps capture, release, claim, delivery, exposure, and response as separate boundaries", () => {
    const session = createSession();
    session.advanceTo(US_V0_I8_ADMIN_CAPTURE);
    expect(session.getInformationAuditState().measurements[0].status).toBe("CAPTURED");
    expect(session.getInformationAuditState().artifacts).toHaveLength(0);
    expect(session.getPublicInformationStatus()).toEqual({
      releasedArtifacts: [], completedDeliveryIds: [], publicExposureCount: 0,
    });

    session.advanceTo(US_V0_I8_ADMIN_RELEASE);
    expect(session.getInformationAuditState().artifacts.map((artifact) => artifact.kind)).toEqual(["ADMINISTRATIVE_RECORD"]);
    session.advanceTo(US_V0_I8_MATERIAL_CAPTURE);
    expect(session.getInformationAuditState().measurements[1]).toMatchObject({ status: "CAPTURED", releasedAt: null });
    session.advanceTo(US_V0_I8_MATERIAL_RELEASE);
    expect(session.getInformationAuditState().artifacts.map((artifact) => artifact.kind)).toEqual([
      "ADMINISTRATIVE_RECORD", "STATISTICAL_REPORT",
    ]);
    session.advanceTo(US_V0_I8_CLAIM_RELEASE);
    expect(session.getInformationAuditState().artifacts.at(-1)).toMatchObject({ kind: "PUBLIC_CLAIM" });
    expect(session.getInformationAuditState().deliveries).toHaveLength(0);
    session.advanceTo(US_V0_I8_DELIVERY);
    expect(session.getInformationAuditState().deliveries).toHaveLength(1);
    expect(session.getInformationAuditState().exposures).toHaveLength(0);
    session.advanceTo(US_V0_I8_EXPOSURE);
    expect(session.getInformationAuditState().exposures).toHaveLength(1);
    expect(session.getInformationAuditState().responses).toHaveLength(0);
  });

  it("freezes imperfect material observations without rewriting Housing truth", () => {
    const session = createSession();
    session.advanceTo(US_V0_I8_MATERIAL_RELEASE);
    const report = session.getInformationAuditState().artifacts.find((artifact) => artifact.kind === "STATISTICAL_REPORT")!;
    const housing = session.getHousingAuditState();
    expect(report.observations.some((observation) => observation.value !== observation.actualValue)).toBe(true);
    for (const observation of report.observations.filter((entry) => entry.measure === "HOUSING_STOCK_UNITS")) {
      expect(observation.actualValue).toBe(housing.regions.find((region) => region.id === observation.referentId)?.housingStockUnits);
    }
    const frozen = structuredClone(report);
    session.advanceTo(US_V0_I8_RESPONSE);
    expect(session.getInformationAuditState().artifacts.find((artifact) => artifact.id === report.id)).toEqual(frozen);
  });

  it("targets one conservative cohort child and leaves its comparable sibling unchanged", () => {
    const session = createSession();
    const parent = session.getAuditState().population.cohorts.find((cohort) =>
      cohort.id === US_V0_I8_INFORMATION_CONFIGURATION.exposure.parentCohortId)!;
    session.advanceTo(US_V0_I8_RESPONSE);
    const state = session.getAuditState();
    const children = state.population.cohorts.filter((cohort) => cohort.lineage.parentCohortId === parent.id);
    const targeted = children.find((cohort) => cohort.receivedInformationReferences.includes(
      US_V0_I8_INFORMATION_CONFIGURATION.exposure.id,
    ))!;
    const untargeted = children.find((cohort) => cohort.id !== targeted.id)!;
    expect(children.reduce((sum, cohort) => sum + cohort.representedWeight, 0)).toBe(parent.representedWeight);
    expect(targeted.politicalState).toMatchObject({
      belief: "REPORTED_LOCAL_MATERIAL_IMPROVEMENT",
      attribution: "us.administration.incumbent-2026",
      salience: "MEDIUM",
      candidatePreference: "PLAYER_ALIGNED",
      turnoutDisposition: "MEDIUM",
    });
    expect(untargeted.politicalState).toEqual(parent.politicalState);
    expect(untargeted.receivedInformationReferences).not.toContain(US_V0_I8_INFORMATION_CONFIGURATION.exposure.id);
  });

  it("feeds Population-owned response into the existing election resolver without setting a winner", () => {
    const session = createSession();
    session.advanceTo(US_V0_I8_RESPONSE);
    const response = session.getInformationAuditState().responses[0];
    expect(response).toBeDefined();
    expect(session.getAuditState().institutional?.selection.popularResults).toHaveLength(0);
    session.advanceTo(US_V0_2028_POPULAR_SELECTION);
    const snapshotEntries = session.getAuditState().institutional!.selection.snapshots.flatMap((snapshot) => snapshot.entries);
    const consumed = snapshotEntries.filter((entry) => response.cohortIds.includes(entry.cohortId));
    expect(consumed).toHaveLength(response.cohortIds.length);
    expect(consumed.every((entry) => entry.candidatePreference === "PLAYER_ALIGNED")).toBe(true);
    expect(consumed.every((entry) => entry.turnoutDisposition === "MEDIUM")).toBe(true);
  });

  it("targets the same semantic cohort scope after a lawful preexisting refinement", () => {
    const session = createSession();
    session.refinePopulation({
      parentCohortId: US_V0_I8_INFORMATION_CONFIGURATION.exposure.parentCohortId,
      targetedWeight: 500,
      causeKey: "pre-i8-lawful-refinement",
    });
    expect(() => session.advanceTo(US_V0_I8_RESPONSE)).not.toThrow();
    const exposure = session.getInformationAuditState().exposures[0];
    expect(exposure.subjectCohortIds.length).toBeGreaterThan(1);
    expect(session.getAuditState().population.cohorts
      .filter((cohort) => exposure.subjectCohortIds.includes(cohort.id))
      .every((cohort) => cohort.politicalState.belief === "REPORTED_LOCAL_MATERIAL_IMPROVEMENT")).toBe(true);
  });
});
