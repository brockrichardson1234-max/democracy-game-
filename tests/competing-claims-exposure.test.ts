import { describe, expect, it } from "vitest";

import { createDeterministicWorldFixture } from "../src/content/gl0-synthetic/configuration";

import { createGameSession } from "../src/app/session";
import { STATE_A_ID, STATE_C_ID } from "../src/sim/federalism";
import {
  activateIntergovernmentalHousingGrantParticipation,
  amendHousingGrantProposal,
  createHousingGrantAward,
  disburseHousingGrantObligation,
  establishHousingGrantProgram,
  HOUSING_GRANT_ADMINISTRATION_ID,
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
  ADMINISTRATION_HOUSING_CLAIM_ID,
  ADMINISTRATION_HOUSING_CLAIM_RELEASE_AT,
  exposeInformationArtifact,
  OFFICIAL_HOUSING_REPORT_ID,
  OFFICIAL_HOUSING_REPORT_RELEASE_AT,
  OPPOSITION_HOUSING_CLAIM_ID,
  OPPOSITION_HOUSING_CLAIM_RELEASE_AT,
  PUBLIC_AUDIENCE_ALPHA_ID,
  PUBLIC_AUDIENCE_BETA_ID,
  PUBLIC_AUDIENCE_GAMMA_ID,
  releasePoliticalClaim,
  resolveInformationBoundary,
} from "../src/sim/information";
import { GL0_OPPOSITION_CLAIM_ACTOR_ID, type ProposalTerms } from "../src/sim/legislature";
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
  action: "DEPLOY_SUPPORT_TO_C" | "PRESERVE_SUPPORT_RESERVE",
): WorldState => {
  let world = establishProgram();
  world = materializeStateProject(world, STATE_A_ID);
  world = materializeStateProject(world, STATE_C_ID);
  world = advanceWorldTo(world, 5);
  return resolveHousingImplementationResponse(world, action);
};

const claimFor = (world: WorldState, id: string) => {
  const claim = world.information.politicalClaims.find((candidate) => candidate.id === id);
  if (claim === undefined) throw new Error(`Missing political claim ${id}.`);
  return claim;
};

const exposuresFor = (world: WorldState, audienceId: string) =>
  world.information.exposures
    .filter((exposure) => exposure.audienceId === audienceId)
    .map((exposure) => exposure.artifactId);

const meaningfulInformationHistory = (world: WorldState) =>
  world.history.filter((occurrence) =>
    [
      "HousingMeasurementCaptured",
      "OfficialHousingReportReleased",
      "PoliticalClaimReleased",
      "InformationArtifactExposed",
    ].includes(occurrence.type),
  );

describe("Commit 18 competing claims and public exposure", () => {
  it("1. preserves the accepted Commit-17 capture and frozen public report path", () => {
    const day40 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 40);
    const report = day40.information.artifacts[0];

    expect(day40.information.housingMeasurement).toMatchObject({
      status: "COMPLETED",
      capturedAtSimulationTime: 30,
    });
    expect(report).toMatchObject({
      id: OFFICIAL_HOUSING_REPORT_ID,
      artifactType: "OFFICIAL_HOUSING_REPORT",
      asOfStart: 0,
      asOfEnd: 30,
      releasedAtSimulationTime: OFFICIAL_HOUSING_REPORT_RELEASE_AT,
      accessClass: "PUBLIC",
    });
  });

  it("2. owns claim artifacts in Information while political sources own their decisions", () => {
    const day42 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 42);

    expect(day42.information.politicalClaims).toHaveLength(2);
    expect(day42.governance.housingPoliticalClaimDecisions).toHaveLength(2);
    expect(day42.housing).not.toHaveProperty("politicalClaims");
    expect(day42.governance).not.toHaveProperty("politicalClaims");
  });

  it("3. makes the administration claim reference the existing official report", () => {
    const day41 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 41);
    const claim = claimFor(day41, ADMINISTRATION_HOUSING_CLAIM_ID);

    expect(claim.sourceArtifactIds).toEqual([OFFICIAL_HOUSING_REPORT_ID]);
    expect(day41.information.artifacts.some((artifact) => artifact.id === claim.sourceArtifactIds[0])).toBe(true);
  });

  it("4. makes the opposition claim reference each route's existing official report", () => {
    const deployed = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 42);
    const preserved = advanceWorldTo(resolveRoute("PRESERVE_SUPPORT_RESERVE"), 42);

    expect(claimFor(deployed, OPPOSITION_HOUSING_CLAIM_ID).sourceArtifactIds).toEqual([
      OFFICIAL_HOUSING_REPORT_ID,
    ]);
    expect(claimFor(preserved, OPPOSITION_HOUSING_CLAIM_ID).sourceArtifactIds).toEqual([
      OFFICIAL_HOUSING_REPORT_ID,
    ]);
    expect(deployed.information.artifacts[0].regionalResults[2].affordabilityPressure).toBe(150);
    expect(preserved.information.artifacts[0].regionalResults[2].affordabilityPressure).toBe(250);
  });

  it("5. rejects nonexistent, premature, and duplicate claim artifacts", () => {
    const day39 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 39);
    const programId = day39.governance.housingGrantProgram!.id;
    const fixtureInput = {
      claimArtifactId: "fixture-claim",
      sourceDecisionId: "fixture-decision",
      origin: {
        originType: "ADMINISTRATION" as const,
        administrationId: HOUSING_GRANT_ADMINISTRATION_ID,
      },
      sourceArtifactIds: ["missing-report"],
      federalProgramId: programId,
      claimPosition: "PROGRAM_WORKING" as const,
    };
    expect(() => releasePoliticalClaim(day39.information, fixtureInput, 41)).toThrow(
      /nonexistent official report/i,
    );

    const day40 = advanceWorldTo(day39, 40);
    expect(() =>
      releasePoliticalClaim(
        day40.information,
        { ...fixtureInput, sourceArtifactIds: [OFFICIAL_HOUSING_REPORT_ID] },
        39,
      ),
    ).toThrow(/cannot precede/i);

    const day41 = advanceWorldTo(day40, 41);
    const decision = day41.governance.housingPoliticalClaimDecisions[0];
    expect(() =>
      releasePoliticalClaim(
        day41.information,
        {
          claimArtifactId: ADMINISTRATION_HOUSING_CLAIM_ID,
          sourceDecisionId: decision.id,
          origin: decision.origin,
          sourceArtifactIds: decision.sourceArtifactIds,
          federalProgramId: decision.federalProgramId,
          claimPosition: decision.claimPosition,
        },
        41,
      ),
    ).toThrow(/already exists/i);
  });

  it("6. releases the administration claim at exactly day 41", () => {
    const day40 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 40);
    const day41 = advanceWorldTo(day40, 41);

    expect(day40.information.politicalClaims).toHaveLength(0);
    expect(claimFor(day41, ADMINISTRATION_HOUSING_CLAIM_ID).releasedAtSimulationTime).toBe(
      ADMINISTRATION_HOUSING_CLAIM_RELEASE_AT,
    );
  });

  it("7. releases the opposition claim at exactly day 42", () => {
    const day41 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 41);
    const day42 = advanceWorldTo(day41, 42);

    expect(day41.information.politicalClaims).toHaveLength(1);
    expect(claimFor(day42, OPPOSITION_HOUSING_CLAIM_ID).releasedAtSimulationTime).toBe(
      OPPOSITION_HOUSING_CLAIM_RELEASE_AT,
    );
  });

  it("8. claims mutate neither Housing nor material/fiscal governance state", () => {
    const day40 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 40);
    const day42 = advanceWorldTo(day40, 42);

    expect(day42.housing).toEqual(day40.housing);
    expect(day42.governance.publicFinance).toEqual(day40.governance.publicFinance);
    expect(day42.governance.fiscalExecution).toEqual(day40.governance.fiscalExecution);
    expect(day42.governance.housingGrantProgram).toBe(day40.governance.housingGrantProgram);
    expect(day42.governance.housingGrantAwards).toBe(day40.governance.housingGrantAwards);
  });

  it("9. leaves the official report object and regional content frozen", () => {
    const day40 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 40);
    const report = day40.information.artifacts[0];
    const reportSnapshot = structuredClone(report);
    const day42 = advanceWorldTo(day40, 42);

    expect(day42.information.artifacts[0]).toBe(report);
    expect(day42.information.artifacts[0]).toEqual(reportSnapshot);
  });

  it("10. gives the two claims distinct legitimate origins and positions", () => {
    const day42 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 42);
    const administration = claimFor(day42, ADMINISTRATION_HOUSING_CLAIM_ID);
    const opposition = claimFor(day42, OPPOSITION_HOUSING_CLAIM_ID);

    expect(administration.origin).toEqual({
      originType: "ADMINISTRATION",
      administrationId: HOUSING_GRANT_ADMINISTRATION_ID,
    });
    expect(administration.claimPosition).toBe("PROGRAM_WORKING");
    expect(opposition.origin).toEqual({
      originType: "ACTOR",
      actorId: GL0_OPPOSITION_CLAIM_ACTOR_ID,
    });
    expect(opposition.claimPosition).toBe("PROGRAM_INADEQUATE");
    expect(
      day42.governance.legislature.actors.some(
        (actor) => actor.id === GL0_OPPOSITION_CLAIM_ACTOR_ID,
      ),
    ).toBe(true);
  });

  it("11. proves PUBLIC report release alone creates no universal exposure", () => {
    const day30 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 30);
    const directRelease = resolveInformationBoundary(day30.information, day30.housing, 40);

    expect(directRelease.information.artifacts[0].accessClass).toBe("PUBLIC");
    expect(directRelease.information.exposures).toHaveLength(0);
    expect(directRelease.information.audiences).toHaveLength(3);
  });

  it("12. keeps exposure records distinct from report and claim artifacts", () => {
    const day42 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 42);
    const artifactIds = [
      ...day42.information.artifacts.map((artifact) => artifact.id),
      ...day42.information.politicalClaims.map((artifact) => artifact.id),
    ];

    expect(day42.information.exposures).toHaveLength(6);
    for (const exposure of day42.information.exposures) {
      expect(artifactIds).toContain(exposure.artifactId);
      expect(exposure.id).not.toBe(exposure.artifactId);
    }
  });

  it("13. gives Alpha the report and administration claim only", () => {
    expect(
      exposuresFor(advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 42), PUBLIC_AUDIENCE_ALPHA_ID),
    ).toEqual([OFFICIAL_HOUSING_REPORT_ID, ADMINISTRATION_HOUSING_CLAIM_ID]);
  });

  it("14. gives Beta the report and opposition claim only", () => {
    expect(
      exposuresFor(advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 42), PUBLIC_AUDIENCE_BETA_ID),
    ).toEqual([OFFICIAL_HOUSING_REPORT_ID, OPPOSITION_HOUSING_CLAIM_ID]);
  });

  it("15. gives Gamma both competing claims without direct report exposure", () => {
    expect(
      exposuresFor(advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 42), PUBLIC_AUDIENCE_GAMMA_ID),
    ).toEqual([ADMINISTRATION_HOUSING_CLAIM_ID, OPPOSITION_HOUSING_CLAIM_ID]);
  });

  it("16. rejects duplicate exposure while repeated advancement remains idempotent", () => {
    const day42 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 42);
    expect(() =>
      exposeInformationArtifact(
        day42.information,
        ADMINISTRATION_HOUSING_CLAIM_ID,
        PUBLIC_AUDIENCE_ALPHA_ID,
        42,
      ),
    ).toThrow(/already exposed/i);

    const repeated = advanceWorldTo(day42, 42);
    const day50 = advanceWorldTo(repeated, 50);
    expect(repeated.information).toEqual(day42.information);
    expect(day50.information.exposures).toHaveLength(6);
    expect(day50.information.politicalClaims).toHaveLength(2);
  });

  it("17. rejects exposure before release and permits same-time receipt after release", () => {
    const day40 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 40);
    expect(() =>
      exposeInformationArtifact(
        day40.information,
        OFFICIAL_HOUSING_REPORT_ID,
        PUBLIC_AUDIENCE_GAMMA_ID,
        39,
      ),
    ).toThrow(/before release/i);
    expect(
      day40.information.exposures.every(
        (exposure) => exposure.exposedAtSimulationTime >= OFFICIAL_HOUSING_REPORT_RELEASE_AT,
      ),
    ).toBe(true);
  });

  it("18. orders each same-time release before exposure and later incorporation", () => {
    const day42 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 42);

    expect(day42.history.filter((entry) => entry.at === 40).map((entry) => entry.type)).toEqual([
      "OfficialHousingReportReleased",
      "InformationArtifactExposed",
      "InformationArtifactExposed",
      "PopulationInformationIncorporated",
      "PopulationInformationIncorporated",
    ]);
    expect(day42.history.filter((entry) => entry.at === 41).map((entry) => entry.type)).toEqual([
      "PoliticalClaimReleased",
      "InformationArtifactExposed",
      "InformationArtifactExposed",
      "PopulationInformationIncorporated",
      "PopulationInformationIncorporated",
    ]);
    expect(day42.history.filter((entry) => entry.at === 42).map((entry) => entry.type)).toEqual([
      "PoliticalClaimReleased",
      "InformationArtifactExposed",
      "InformationArtifactExposed",
      "PopulationInformationIncorporated",
      "PopulationInformationIncorporated",
    ]);
  });

  it("19. makes direct 30→50 equal chunked 30→40→41→42→50", () => {
    const day30 = advanceWorldTo(resolveRoute("DEPLOY_SUPPORT_TO_C"), 30);
    const direct = advanceWorldTo(day30, 50);
    const chunked = advanceWorldTo(
      advanceWorldTo(advanceWorldTo(advanceWorldTo(day30, 40), 41), 42),
      50,
    );

    expect(chunked.information).toEqual(direct.information);
    expect(chunked.governance.housingPoliticalClaimDecisions).toEqual(
      direct.governance.housingPoliticalClaimDecisions,
    );
    expect(meaningfulInformationHistory(chunked)).toEqual(meaningfulInformationHistory(direct));
  });

  it("20. exposes audit projections without putting belief, approval, or elections in Information", () => {
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

    expect(view.publicInformationAudit.claims).toHaveLength(2);
    expect(view.publicInformationAudit.exposures).toHaveLength(6);
    expect(world.population.units).toHaveLength(3);
    expect(world.information).not.toHaveProperty("beliefs");
    expect(world.information).not.toHaveProperty("approval");
    expect(world.governance).not.toHaveProperty("elections");
    expect(world.information.exposures.every((exposure) => !("belief" in exposure))).toBe(true);
  });
});
