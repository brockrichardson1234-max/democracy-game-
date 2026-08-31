import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION, type IntegratedPartialRuntimeSession } from "../src/app/integrated-session";
import { createProductionGameSession } from "../src/app/production-session";
import { US_V0_STRUCTURAL_CONFIGURATION } from "../src/content/us-v0/configuration";
import { US_V0_I8_INFORMATION_CONFIGURATION, US_V0_I8_POPULATION_RESPONSE } from "../src/content/us-v0/i8";
import {
  US_V0_I9_APPELLATE_RULING,
  US_V0_I9_LEGAL_CONTEST_CONFIGURATION,
  US_V0_I9_NOTICE,
  US_V0_I9_STAY_DECISION,
} from "../src/content/us-v0/i9";
import {
  US_V0_I10_COMPOSITION_CONFIGURATION,
} from "../src/content/us-v0/i10";

const dispatchFirst = (session: IntegratedPartialRuntimeSession, prefix: string): void => {
  const action = session.getProductionGameView().availablePlayerActions.find((entry) => entry.id.startsWith(prefix));
  if (action === undefined) throw new Error(`Expected production action ${prefix}.`);
  session.dispatchPlayerCommand(action.id);
};

const playThroughPayment = (session: IntegratedPartialRuntimeSession): void => {
  for (let step = 0; step < 100 && session.getProductionGameView().implementation.paymentCount === 0; step += 1) {
    const view = session.getProductionGameView();
    const action = view.availablePlayerActions.find((entry) => !entry.id.startsWith("legal:respond:"));
    if (action === undefined) session.advanceProductionWorld();
    else session.dispatchPlayerCommand(action.id);
  }
  const view = session.getProductionGameView();
  expect(view.agenda.enactedLegalSources).toHaveLength(1);
  expect(view.implementation.fiscalControlCount).toBe(1);
  expect(view.implementation.awardCount).toBe(1);
  expect(view.implementation.obligationCount).toBe(1);
  expect(view.implementation.recipientCommitmentCount).toBe(1);
  expect(view.implementation.paymentCount).toBe(1);
  expect(view.implementation.materialInputKinds.length).toBeGreaterThan(0);
};

const playLegalAndInformationRoute = (session: IntegratedPartialRuntimeSession): void => {
  session.advanceTo(US_V0_I9_NOTICE);
  dispatchFirst(session, "legal:respond:CONTEST");
  dispatchFirst(session, "legal:request-stay");
  session.advanceTo(US_V0_I9_STAY_DECISION);
  session.advanceTo(US_V0_I8_POPULATION_RESPONSE);
  const view = session.getProductionGameView();
  expect(view.legal.filedClaimCount).toBe(1);
  expect(view.legal.publicRulings).toHaveLength(1);
  expect(view.legal.operativeOrders).toHaveLength(1);
  expect(view.legal.appealStatuses).toEqual(["FILED"]);
  expect(view.legal.stayStatuses).toHaveLength(1);
  expect(view.officialInformation.releasedMeasurements.length).toBeGreaterThan(0);
  expect(view.officialInformation.releasedClaims.length).toBeGreaterThan(0);
  expect(view.officialInformation.completedDeliveryCount).toBeGreaterThan(0);
};

describe("I10 simulation composition and production runtime convergence", () => {
  it("boots the accepted U.S. integrated runtime through the single production factory", () => {
    const session = createProductionGameSession();
    const view = session.getProductionGameView();
    expect(view.identity).toMatchObject({
      configurationId: "us-v0",
      configurationVersion: "0.10.1-i10-repair",
      scenarioVersion: "0.10.1-i10-repair",
      configurationHash: US_V0_STRUCTURAL_CONFIGURATION.identity.configurationHash,
    });
    expect(view.projectionVersion).toBe(US_V0_I10_COMPOSITION_CONFIGURATION.productionProjectionVersion);
    expect(JSON.parse(session.save())).toMatchObject({
      formatVersion: INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION,
      configuration: US_V0_STRUCTURAL_CONFIGURATION.identity,
    });
  });

  it("keeps the production React graph free of GL0 and audit dependencies", () => {
    const app = fs.readFileSync(path.resolve("src/ui/App.tsx"), "utf8");
    const productionFactory = fs.readFileSync(path.resolve("src/app/production-session.ts"), "utf8");
    expect(app).toContain("createProductionGameSession");
    expect(app).not.toMatch(/getAuditState|getHousingAuditState|getInformationAuditState|getLegalContestAuditState|getControlBindingAudit|inject[A-Z]/);
    expect(productionFactory).not.toMatch(/gl0-synthetic|GL0_SYNTHETIC_CONFIGURATION|createDeterministicWorldFixture|AuditSession/);
    expect(fs.existsSync(path.resolve("src/app/session.ts"))).toBe(true);
    expect(fs.readFileSync(path.resolve("src/app/session.ts"), "utf8")).toContain("legacy GL0 regression/development fixture");
  });

  it("exposes only controlled player choices and advances autonomous owners separately", () => {
    const session = createProductionGameSession();
    expect(session.getProductionGameView().availablePlayerActions.map((entry) => entry.id)).toEqual(["agenda:balanced-delivery"]);
    const forbidden = /vote|court-outcome|election-winner|population-belief|material-outcome/i;
    for (let step = 0; step < 40 && session.getProductionGameView().implementation.paymentCount === 0; step += 1) {
      const view = session.getProductionGameView();
      expect(view.availablePlayerActions.map((entry) => entry.id).join(" ")).not.toMatch(forbidden);
      const action = view.availablePlayerActions.find((entry) => !entry.id.startsWith("legal:respond:"));
      if (action === undefined) session.advanceProductionWorld();
      else session.dispatchPlayerCommand(action.id);
    }
    expect(session.getProductionGameView().implementation.paymentCount).toBe(1);
  });

  it("restores deterministically and preserves coarse/fine canonical advancement", () => {
    const seed = createProductionGameSession();
    playThroughPayment(seed);
    playLegalAndInformationRoute(seed);
    const saved = seed.save();
    const coarse = createProductionGameSession(saved);
    const fine = createProductionGameSession(saved);
    coarse.advanceTo(US_V0_I9_APPELLATE_RULING);
    for (let guard = 0; guard < 1000; guard += 1) {
      const next = fine.getPublicInstitutionalStatus().nextBoundary;
      if (next === null || Date.parse(next.at) > Date.parse(US_V0_I9_APPELLATE_RULING)) break;
      fine.advanceToNextBoundary();
    }
    fine.advanceTo(US_V0_I9_APPELLATE_RULING);
    expect(fine.save()).toBe(coarse.save());
    expect(createProductionGameSession(coarse.save()).getProductionGameView()).toEqual(coarse.getProductionGameView());
  }, 30_000);

  it("preserves accepted Information and legal-contest owner identities", () => {
    expect(US_V0_I10_COMPOSITION_CONFIGURATION.parameterHash)
      .toBe("09521fe6f39b56486ff606428fb86dfce1876e894481b4ef8da1047675f83868");
    expect(US_V0_STRUCTURAL_CONFIGURATION.integratedRuntime!.information!.parameterHash)
      .toBe(US_V0_I8_INFORMATION_CONFIGURATION.parameterHash);
    expect(US_V0_STRUCTURAL_CONFIGURATION.integratedRuntime!.legalContest!.parameterHash)
      .toBe(US_V0_I9_LEGAL_CONTEST_CONFIGURATION.parameterHash);
    expect(US_V0_I10_COMPOSITION_CONFIGURATION.forbiddenShortcuts).toContain(
      "FISCAL_INPUT_DOES_NOT_DIRECTLY_SET_MATERIAL_RESULT",
    );
  });
});
