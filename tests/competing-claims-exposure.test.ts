import { describe, expect, it } from "vitest";

import { createGameSession } from "../src/app/session";
import { FEDERAL_HOUSING_ADMINISTRATION_INSTITUTION_ID } from "../src/sim/administration";
import { STATE_A_ID, STATE_C_ID } from "../src/sim/federalism";
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
  resolvePoliticalHousingClaimDecision,
  resolveStateHousingGrantDecision,
  submitHousingGrantProposal,
  submitStateHousingGrantApplication,
} from "../src/sim/governance";
import {
  ADMINISTRATION_HOUSING_CLAIM_ID,
  ADMINISTRATION_HOUSING_CLAIM_RELEASE_AT,
  OFFICIAL_HOUSING_REPORT_ID,
  OFFICIAL_HOUSING_REPORT_RELEASE_AT,
  OPPOSITION_HOUSING_CLAIM_ID,
  OPPOSITION_HOUSING_CLAIM_RELEASE_AT,
  PUBLIC_AUDIENCE_ALPHA_ID,
  PUBLIC_AUDIENCE_BETA_ID,
  PUBLIC_AUDIENCE_GAMMA_ID,
  exposeInformationArtifact,
  releasePoliticalClaim,
} from "../src/sim/information";
import { OPPOSITION_CLAIM_SPEAKER_ACTOR_ID, type ProposalTerms } from "../src/sim/legislature";
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

const createRoute = (
  action: "DEPLOY_SUPPORT_TO_C" | "PRESERVE_SUPPORT_RESERVE" = "DEPLOY_SUPPORT_TO_C",
): WorldState => {
  let world = establishProgram();
  world = materializeStateProject(world, STATE_A_ID);
  world = materializeStateProject(world, STATE_C_ID);
  world = advanceWorldTo(world, 5);
  return resolveHousingImplementationResponse(world, action);
};

const exposuresFor = (world: WorldState, audienceId: string) =>
  world.information.exposures
    .filter((exposure) => exposure.audienceId === audienceId)
    .map((exposure) => exposure.artifactId);

const informationHistory = (world: WorldState) =>
  world.history.filter((occurrence) =>
    [
      "HousingMeasurementCaptured",
      "OfficialHousingReportReleased",
      "PoliticalClaimReleased",
      "InformationArtifactExposed",
    ].includes(occurrence.type),
  );

describe("Commit 18 competing claims and public exposure", () => {
  it("1. preserves the accepted day-40 official Housing report path", () => {
    const day40 = advanceWorldTo(createRoute(), 40);

    expect(day40.information.artifacts).toHaveLength(1);
    expect(day40.information.artifacts[0]).toMatchObject({
      id: OFFICIAL_HOUSING_REPORT_ID,
      artifactType: "OFFICIAL_HOUSING_REPORT",
      releasedAtSimulationTime: OFFICIAL_HOUSING_REPORT_RELEASE_AT,
      accessClass: "PUBLIC",
    });
  });

  it("2. keeps claim artifacts with Information rather than Housing", () => {
    const day42 = advanceWorldTo(createRoute(), 42);

    expect(day42.information.politicalClaims).toHaveLength(2);
    expect(day42.housing).not.toHaveProperty("politicalClaims");
    expect(day42.information).not.toHaveProperty("regions");
  });

  it("3. links the administration claim to the existing official report", () => {
    const claim = advanceWorldTo(createRoute(), 41).information.politicalClaims[0];

    expect(claim).toMatchObject({
      id: ADMINISTRATION_HOUSING_CLAIM_ID,
      sourceArtifactIds: [OFFICIAL_HOUSING_REPORT_ID],
      speakerInstitutionId: FEDERAL_HOUSING_ADMINISTRATION_INSTITUTION_ID,
    });
  });

  it("4. links the opposition claim to the same existing official report", () => {
    const claim = advanceWorldTo(createRoute(), 42).information.politicalClaims[1];

    expect(claim).toMatchObject({
      id: OPPOSITION_HOUSING_CLAIM_ID,
      sourceArtifactIds: [OFFICIAL_HOUSING_REPORT_ID],
      speakerActorId: OPPOSITION_CLAIM_SPEAKER_ACTOR_ID,
    });
  });

  it("5. permits no claim before report release and rejects a nonexistent referent", () => {
    const day39 = advanceWorldTo(createRoute(), 39);
    const decision = resolvePoliticalHousingClaimDecision(day39.governance, 41)!;

    expect(day39.information.politicalClaims).toEqual([]);
    expect(() => releasePoliticalClaim(day39.information, decision, 41)).toThrow(
      /cannot reference unreleased artifact/,
    );
  });

  it("6. releases the administration claim only at day 41", () => {
    const day40 = advanceWorldTo(createRoute(), 40);
    const day41 = advanceWorldTo(day40, 41);

    expect(day40.information.politicalClaims).toEqual([]);
    expect(day41.information.politicalClaims[0].releasedAtSimulationTime).toBe(
      ADMINISTRATION_HOUSING_CLAIM_RELEASE_AT,
    );
  });

  it("7. releases the opposition claim only at day 42", () => {
    const day41 = advanceWorldTo(createRoute(), 41);
    const day42 = advanceWorldTo(day41, 42);

    expect(day41.information.politicalClaims).toHaveLength(1);
    expect(day42.information.politicalClaims[1].releasedAtSimulationTime).toBe(
      OPPOSITION_HOUSING_CLAIM_RELEASE_AT,
    );
  });

  it("8. claim releases mutate neither Housing nor governance", () => {
    const day40 = advanceWorldTo(createRoute(), 40);
    const day42 = advanceWorldTo(day40, 42);

    expect(day42.housing).toEqual(day40.housing);
    expect(day42.governance).toEqual(day40.governance);
  });

  it("9. competing claims do not retroactively edit the official report", () => {
    const day40 = advanceWorldTo(createRoute(), 40);
    const reportSnapshot = structuredClone(day40.information.artifacts[0]);
    const day42 = advanceWorldTo(day40, 42);

    expect(day42.information.artifacts[0]).toEqual(reportSnapshot);
  });

  it("10. records distinct canonical origins and defensible structured positions", () => {
    const deploy = advanceWorldTo(createRoute(), 42);
    const preserve = advanceWorldTo(createRoute("PRESERVE_SUPPORT_RESERVE"), 42);
    const claims = deploy.information.politicalClaims;

    expect(claims.map((claim) => claim.originType)).toEqual(["INSTITUTION", "POLITICAL_ACTOR"]);
    expect(claims.map((claim) => claim.claimPosition)).toEqual([
      "PROGRAM_WORKING",
      "PROGRAM_INADEQUATE",
    ]);
    expect(claims.every((claim) => !Object.hasOwn(claim, "claimTruth"))).toBe(true);
    expect(claims.every((claim) => !Object.hasOwn(claim, "decidedAtSimulationTime"))).toBe(true);
    expect(preserve.information.politicalClaims.map((claim) => claim.claimPosition)).toEqual(
      claims.map((claim) => claim.claimPosition),
    );
    expect(preserve.information.politicalClaims[0].sourceArtifactIds).toEqual([
      preserve.information.artifacts[0].id,
    ]);
    expect(preserve.information.artifacts[0].regionalResults).not.toEqual(
      deploy.information.artifacts[0].regionalResults,
    );
  });

  it("11. public release does not create universal report exposure", () => {
    const day40 = advanceWorldTo(createRoute(), 40);

    expect(day40.information.artifacts[0].accessClass).toBe("PUBLIC");
    expect(exposuresFor(day40, PUBLIC_AUDIENCE_ALPHA_ID)).toEqual([OFFICIAL_HOUSING_REPORT_ID]);
    expect(exposuresFor(day40, PUBLIC_AUDIENCE_BETA_ID)).toEqual([OFFICIAL_HOUSING_REPORT_ID]);
    expect(exposuresFor(day40, PUBLIC_AUDIENCE_GAMMA_ID)).toEqual([]);
  });

  it("12. owns exposure records separately from artifact records", () => {
    const day42 = advanceWorldTo(createRoute(), 42);

    expect(day42.information.exposures).toHaveLength(6);
    expect(day42.information.artifacts[0]).not.toHaveProperty("exposedTo");
    expect(day42.information.politicalClaims[0]).not.toHaveProperty("exposedTo");
  });

  it("13. gives Alpha the report and administration claim", () => {
    expect(exposuresFor(advanceWorldTo(createRoute(), 42), PUBLIC_AUDIENCE_ALPHA_ID)).toEqual([
      OFFICIAL_HOUSING_REPORT_ID,
      ADMINISTRATION_HOUSING_CLAIM_ID,
    ]);
  });

  it("14. gives Beta the report and opposition claim", () => {
    expect(exposuresFor(advanceWorldTo(createRoute(), 42), PUBLIC_AUDIENCE_BETA_ID)).toEqual([
      OFFICIAL_HOUSING_REPORT_ID,
      OPPOSITION_HOUSING_CLAIM_ID,
    ]);
  });

  it("15. gives Gamma both claims without direct report exposure", () => {
    expect(exposuresFor(advanceWorldTo(createRoute(), 42), PUBLIC_AUDIENCE_GAMMA_ID)).toEqual([
      ADMINISTRATION_HOUSING_CLAIM_ID,
      OPPOSITION_HOUSING_CLAIM_ID,
    ]);
  });

  it("16. rejects explicit duplicate claims/exposures while repeated advancement stays idempotent", () => {
    const day40 = advanceWorldTo(createRoute(), 40);
    const decision = resolvePoliticalHousingClaimDecision(day40.governance, 41)!;
    const day41 = advanceWorldTo(day40, 41);

    expect(() => releasePoliticalClaim(day41.information, decision, 41)).toThrow(/already exists/);
    expect(() =>
      exposeInformationArtifact(
        day40.information,
        OFFICIAL_HOUSING_REPORT_ID,
        PUBLIC_AUDIENCE_ALPHA_ID,
        40,
      ),
    ).toThrow(/already exposed/);
    expect(advanceWorldTo(day41, 41).information).toEqual(day41.information);
  });

  it("17. rejects exposure before artifact release", () => {
    const day40 = advanceWorldTo(createRoute(), 40);
    const futureReportState = {
      ...day40.information,
      artifacts: [{ ...day40.information.artifacts[0], releasedAtSimulationTime: 45 }],
    };

    expect(() =>
      exposeInformationArtifact(
        futureReportState,
        OFFICIAL_HOUSING_REPORT_ID,
        PUBLIC_AUDIENCE_GAMMA_ID,
        44,
      ),
    ).toThrow(/before its release/);
  });

  it("18. records same-time release before every exposure without handler-order dependence", () => {
    const day42 = advanceWorldTo(createRoute(), 42);

    expect(day42.history.filter((occurrence) => occurrence.at === 40).map(({ type }) => type)).toEqual([
      "OfficialHousingReportReleased",
      "InformationArtifactExposed",
      "InformationArtifactExposed",
    ]);
    expect(day42.history.filter((occurrence) => occurrence.at === 41).map(({ type }) => type)).toEqual([
      "PoliticalClaimReleased",
      "InformationArtifactExposed",
      "InformationArtifactExposed",
    ]);
    expect(day42.history.filter((occurrence) => occurrence.at === 42).map(({ type }) => type)).toEqual([
      "PoliticalClaimReleased",
      "InformationArtifactExposed",
      "InformationArtifactExposed",
    ]);
  });

  it("19. makes direct day 30→50 equal chunked 30→40→41→42→50", () => {
    const day30 = advanceWorldTo(createRoute(), 30);
    const direct = advanceWorldTo(day30, 50);
    const chunked = advanceWorldTo(
      advanceWorldTo(advanceWorldTo(advanceWorldTo(day30, 40), 41), 42),
      50,
    );

    expect(chunked.information).toEqual(direct.information);
    expect(informationHistory(chunked)).toEqual(informationHistory(direct));
  });

  it("20. exposes audit truth without creating belief, approval, population, or election state", () => {
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
    const world = advanceWorldTo(createRoute(), 42);

    expect(view.publicInformation.temporaryAudienceFixture).toBe(true);
    expect(view.publicInformation.claims).toHaveLength(2);
    expect(view.publicInformation.audiences.map((audience) => audience.exposedArtifactIds)).toEqual([
      [OFFICIAL_HOUSING_REPORT_ID, ADMINISTRATION_HOUSING_CLAIM_ID],
      [OFFICIAL_HOUSING_REPORT_ID, OPPOSITION_HOUSING_CLAIM_ID],
      [ADMINISTRATION_HOUSING_CLAIM_ID, OPPOSITION_HOUSING_CLAIM_ID],
    ]);
    expect(world).not.toHaveProperty("population");
    expect(world).not.toHaveProperty("election");
    expect(world.information).not.toHaveProperty("beliefs");
    expect(world.information.exposures.every((exposure) => !Object.hasOwn(exposure, "belief"))).toBe(true);
  });
});
