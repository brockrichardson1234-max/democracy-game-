import { describe, expect, it } from "vitest";

import { createProductionGameSession, type ProductionGameSession } from "../src/app/production-session";
import { canonicalConfigurationContent } from "../src/configuration/canonical";
import { sha256Hex } from "../src/configuration/sha256";
import type {
  GovernmentConfiguration,
  IntegratedTemporalConfiguration,
  LegislativeRuntimeSeed,
} from "../src/configuration/types";
import { US_V0_STRUCTURAL_CONFIGURATION } from "../src/content/us-v0/configuration";
import { US_V0_OPPOSITION_TICKET_ID } from "../src/content/us-v0/i5";
import { US_V0_I9_APPELLATE_RULING, US_V0_I9_STAY_DECISION } from "../src/content/us-v0/i9";
import { US_V0_I10_RUNTIME_ARTIFACTS } from "../src/content/us-v0/i10";

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const actionWithPrefix = (session: ProductionGameSession, prefix: string): string => {
  const action = session.getProductionGameView().availablePlayerActions.find((entry) => entry.id.startsWith(prefix));
  if (action === undefined) throw new Error(`Expected visible production action ${prefix}.`);
  return action.id;
};

const dispatchPrefix = (session: ProductionGameSession, prefix: string): void => {
  session.dispatchPlayerCommand(actionWithPrefix(session, prefix));
};

const driveUntil = (
  session: ProductionGameSession,
  predicate: (view: ReturnType<ProductionGameSession["getProductionGameView"]>) => boolean,
  maximumSteps = 300,
): void => {
  for (let step = 0; step < maximumSteps; step += 1) {
    const view = session.getProductionGameView();
    if (predicate(view)) return;
    const action = view.availablePlayerActions.find((entry) => entry.id === "executive:sign") ??
      view.availablePlayerActions.find((entry) =>
        entry.id !== "executive:veto" && !entry.id.startsWith("legal:respond:"));
    if (action === undefined) session.advanceProductionWorld();
    else session.dispatchPlayerCommand(action.id);
  }
  throw new Error("Production route did not reach the requested visible state.");
};

const reachAcceptedSponsorship = (session: ProductionGameSession): void => {
  dispatchPrefix(session, "agenda:balanced-delivery");
  dispatchPrefix(session, "legislature:begin-sponsor-search");
  dispatchPrefix(session, "legislature:seek-sponsor:");
};

const reachOriginGate = (session: ProductionGameSession): void => {
  reachAcceptedSponsorship(session);
  session.advanceProductionWorld();
  session.advanceProductionWorld();
  expect(session.getProductionGameView().agenda.stage).toBe("ORIGIN_CONSIDERATION_GATE");
};

interface PoliticalSnapshot {
  readonly legislativeRuntime: {
    readonly procedure: {
      readonly sponsorship: {
        readonly actorId: string | null;
        readonly assignmentId: string | null;
        readonly status: string;
      };
    };
    readonly political: {
      readonly organizations: readonly {
        readonly id: string;
        readonly negotiationPosture: string;
        readonly coordinationActions: readonly {
          readonly chamberId: string;
          readonly recommendation: "SUPPORT" | "OPPOSE";
        }[];
      }[];
      readonly actors: readonly {
        readonly pressureByOrganizationId: Readonly<Record<string, number>>;
      }[];
    };
  };
  readonly implementation: {
    readonly publicFinance: {
      readonly generatedBudgetAuthorities: readonly { readonly id: string; readonly sourceLegalId: string }[];
    };
  };
  readonly housing: {
    readonly projects: readonly {
      readonly stage: string;
      readonly acceptedGovernmentInputRefs: readonly string[];
    }[];
  };
}

const snapshot = (session: ProductionGameSession): PoliticalSnapshot =>
  JSON.parse(session.save()) as PoliticalSnapshot;

const rehashConfiguration = (
  configuration: GovernmentConfiguration<LegislativeRuntimeSeed>,
): GovernmentConfiguration<LegislativeRuntimeSeed> => ({
  ...configuration,
  identity: {
    ...configuration.identity,
    configurationHash: sha256Hex(canonicalConfigurationContent(configuration)),
  },
});

const oppositionCapabilityConfiguration = (): GovernmentConfiguration<LegislativeRuntimeSeed> => {
  const temporal = US_V0_STRUCTURAL_CONFIGURATION.integratedRuntime!.temporal!;
  const selection = {
    ...temporal.selection,
    populationScaffold: {
      ...temporal.selection.populationScaffold,
      stableKey: "us-v0-i10-repair-opposition-succession-capability-1",
      preferenceAliases: {
        PLAYER_ALIGNED: US_V0_OPPOSITION_TICKET_ID,
        OPPOSITION: US_V0_OPPOSITION_TICKET_ID,
        UNDECIDED: US_V0_OPPOSITION_TICKET_ID,
        BLANK: null,
      },
      fallbackPreferenceThresholds: [
        { ticketId: US_V0_OPPOSITION_TICKET_ID, cumulativeUpperBound: { numerator: 1, denominator: 1 } },
      ],
    },
  };
  const temporalWithoutHash = { ...temporal };
  delete (temporalWithoutHash as { parameterHash?: string }).parameterHash;
  const temporalPayload = {
    ...temporalWithoutHash,
    selection,
    selectionContentHash: sha256Hex(JSON.stringify(selection)),
  };
  const configuredTemporal: IntegratedTemporalConfiguration = {
    ...temporalPayload,
    parameterHash: sha256Hex(JSON.stringify(temporalPayload)),
  };
  return rehashConfiguration({
    ...US_V0_STRUCTURAL_CONFIGURATION,
    identity: {
      ...US_V0_STRUCTURAL_CONFIGURATION.identity,
      configurationVersion: "0.10.1-i10-repair-opposition-capability",
      scenarioVersion: "0.10.1-i10-repair-opposition-capability",
      configurationHash: "0".repeat(64),
    },
    integratedRuntime: {
      ...US_V0_STRUCTURAL_CONFIGURATION.integratedRuntime!,
      temporal: configuredTemporal,
    },
  });
};

describe("I10-REV-001 — production content authentication", () => {
  it("authenticates exact production creation and restoration plus a correctly rehashed capability fixture", () => {
    const exact = createProductionGameSession();
    expect(createProductionGameSession(exact.save()).getProductionGameView()).toEqual(exact.getProductionGameView());

    const changed = clone(US_V0_STRUCTURAL_CONFIGURATION);
    const changedSeed = changed.runtimeSeed as LegislativeRuntimeSeed;
    (changedSeed.proposal as { title: string }).title = "Legitimate bounded capability title";
    (changed.identity as { configurationVersion: string; scenarioVersion: string }).configurationVersion =
      "0.10.1-i10-repair-authenticated-capability";
    (changed.identity as { configurationVersion: string; scenarioVersion: string }).scenarioVersion =
      "0.10.1-i10-repair-authenticated-capability";
    const authenticated = rehashConfiguration(changed);
    expect(createProductionGameSession(undefined, authenticated, US_V0_I10_RUNTIME_ARTIFACTS)
      .getProductionGameView().agenda.title).toBe("Legitimate bounded capability title");
    expect(() => createProductionGameSession(
      undefined,
      oppositionCapabilityConfiguration(),
      US_V0_I10_RUNTIME_ARTIFACTS,
    )).not.toThrow();
  });

  it("rejects stale hashes for title and another behavior-driving configuration field", () => {
    const changedTitle = clone(US_V0_STRUCTURAL_CONFIGURATION);
    ((changedTitle.runtimeSeed as LegislativeRuntimeSeed).proposal as { title: string }).title = "Counterfeit title";
    expect(() => createProductionGameSession(undefined, changedTitle, US_V0_I10_RUNTIME_ARTIFACTS))
      .toThrow(/declared configuration hash.*computed/i);

    const changedDecision = clone(US_V0_STRUCTURAL_CONFIGURATION);
    ((changedDecision.runtimeSeed as LegislativeRuntimeSeed).decision as { coordinationPressure: number })
      .coordinationPressure += 1;
    expect(() => createProductionGameSession(undefined, changedDecision, US_V0_I10_RUNTIME_ARTIFACTS))
      .toThrow(/declared configuration hash.*computed/i);
  });

  it("rejects geography, Population, and other behavior-driving payload tampering", () => {
    const geography = clone(US_V0_I10_RUNTIME_ARTIFACTS);
    (geography.geography[0].features[0] as { effectiveLabel?: string }).effectiveLabel = "Counterfeit geography";
    expect(() => createProductionGameSession(undefined, US_V0_STRUCTURAL_CONFIGURATION, geography))
      .toThrow(/artifact payload hash mismatch/i);

    const population = clone(US_V0_I10_RUNTIME_ARTIFACTS);
    (population.populationControls.controls[0] as { residentWeight: number }).residentWeight += 1;
    expect(() => createProductionGameSession(undefined, US_V0_STRUCTURAL_CONFIGURATION, population))
      .toThrow(/artifact payload hash mismatch/i);

    const implementation = clone(US_V0_I10_RUNTIME_ARTIFACTS);
    (implementation.programInitialization as unknown as { nationalBalance: string }).nationalBalance = "COUNTERFEIT";
    expect(() => createProductionGameSession(undefined, US_V0_STRUCTURAL_CONFIGURATION, implementation))
      .toThrow(/artifact payload hash mismatch/i);
  });

  it("still rejects a correctly hashed artifact payload that is incompatible with configuration bindings", () => {
    const artifacts = clone(US_V0_I10_RUNTIME_ARTIFACTS);
    (artifacts.geography[0].features[0] as { effectiveLabel?: string }).effectiveLabel = "Different authenticated geography";
    (artifacts.geography[0].metadata as { contentSha256: string }).contentSha256 =
      sha256Hex(JSON.stringify(artifacts.geography[0].features));
    expect(() => createProductionGameSession(undefined, US_V0_STRUCTURAL_CONFIGURATION, artifacts))
      .toThrow(/artifact mismatch/i);
  });
});

describe("I10-REV-002 — sponsor owns formal introduction", () => {
  it("removes player introduction and resolves the accepted Member introduction autonomously", () => {
    const session = createProductionGameSession();
    reachAcceptedSponsorship(session);
    expect(session.getProductionGameView().availablePlayerActions.some(
      (entry) => entry.id.startsWith("legislature:introduce:"),
    )).toBe(false);

    const accepted = snapshot(session).legislativeRuntime.procedure.sponsorship;
    const fabricated = `legislature:introduce:${accepted.actorId}:${accepted.assignmentId}`;
    const beforeRejection = session.save();
    expect(() => session.dispatchPlayerCommand(fabricated)).toThrow(/unavailable/);
    expect(session.save()).toBe(beforeRejection);

    session.advanceProductionWorld();
    expect(session.getProductionGameView().agenda.stage).toBe("INTRODUCED_IN_ORIGIN");
    expect(snapshot(session).legislativeRuntime.procedure.sponsorship.status).toBe("INTRODUCED");
    const afterIntroduction = session.save();
    expect(() => session.dispatchPlayerCommand(fabricated)).toThrow(/unavailable/);
    expect(session.save()).toBe(afterIntroduction);
  });
});

describe("I10-REV-003 — PoliticalOrganization owns coordination and pressure", () => {
  it("separates administration outreach from autonomous SUPPORT and OPPOSE results at both chamber gates", () => {
    const session = createProductionGameSession();
    reachOriginGate(session);

    for (const expectedStage of ["ORIGIN_CONSIDERATION_GATE", "OTHER_CHAMBER_CONSIDERATION_GATE"]) {
      driveUntil(session, (view) => view.agenda.stage === expectedStage);
      const requestId = actionWithPrefix(session, "legislature:request-coordination:");
      const before = snapshot(session).legislativeRuntime.political;
      session.dispatchPlayerCommand(requestId);
      const immediatelyAfter = snapshot(session).legislativeRuntime.political;
      expect(immediatelyAfter.organizations.map((entry) => entry.coordinationActions))
        .toEqual(before.organizations.map((entry) => entry.coordinationActions));
      expect(immediatelyAfter.actors.map((entry) => entry.pressureByOrganizationId))
        .toEqual(before.actors.map((entry) => entry.pressureByOrganizationId));

      session.advanceProductionWorld();
      expect(snapshot(session).legislativeRuntime.political.organizations
        .flatMap((entry) => entry.coordinationActions).length).toBeGreaterThan(
          before.organizations.flatMap((entry) => entry.coordinationActions).length,
        );
      while (session.getProductionGameView().availablePlayerActions.some(
        (entry) => entry.id.startsWith("legislature:request-coordination:"),
      )) dispatchPrefix(session, "legislature:request-coordination:");
      session.advanceProductionWorld();

      const chamberActions = snapshot(session).legislativeRuntime.political.organizations
        .flatMap((entry) => entry.coordinationActions)
        .filter((entry) => entry.chamberId === session.getProductionGameView().agenda.currentChamberId);
      expect(chamberActions.map((entry) => entry.recommendation)).toContain("SUPPORT");
      expect(chamberActions.map((entry) => entry.recommendation)).toContain("OPPOSE");
      expect(session.getProductionGameView().availablePlayerActions.some(
        (entry) => entry.id.startsWith("legislature:coordinate:"),
      )).toBe(false);

      const oldResultCommand = requestId.replace("request-coordination", "coordinate");
      const beforeOldCommand = session.save();
      expect(() => session.dispatchPlayerCommand(oldResultCommand)).toThrow(/unavailable/);
      expect(session.save()).toBe(beforeOldCommand);

      if (expectedStage === "ORIGIN_CONSIDERATION_GATE") {
        driveUntil(session, (view) => view.agenda.stage === "OTHER_CHAMBER_CONSIDERATION_GATE");
      }
    }
  }, 60_000);
});

describe("I10-REV-004 — PublicFinance owns law-derived authority", () => {
  it("removes player admission and autonomously recognizes exactly one authority before apportionment request", () => {
    const session = createProductionGameSession();
    driveUntil(session, (view) => view.agenda.enactedLegalSources.length === 1);
    const lawId = session.getProductionGameView().agenda.enactedLegalSources[0].id;
    expect(session.getProductionGameView().availablePlayerActions.some(
      (entry) => entry.id.startsWith("implementation:admit-law:"),
    )).toBe(false);
    expect(snapshot(session).implementation.publicFinance.generatedBudgetAuthorities).toHaveLength(0);

    const beforeOldCommand = session.save();
    expect(() => session.dispatchPlayerCommand(`implementation:admit-law:${lawId}`)).toThrow(/unavailable/);
    expect(session.save()).toBe(beforeOldCommand);

    session.advanceProductionWorld();
    expect(snapshot(session).implementation.publicFinance.generatedBudgetAuthorities).toHaveLength(1);
    expect(actionWithPrefix(session, "implementation:request-apportionment:")).toBeTruthy();
    for (let index = 0; index < 3; index += 1) session.advanceProductionWorld();
    expect(snapshot(session).implementation.publicFinance.generatedBudgetAuthorities).toHaveLength(1);
    expect(createProductionGameSession(session.save()).getProductionGameView()).toEqual(session.getProductionGameView());
  }, 60_000);
});

describe("I10-REV-005 — preserve the fixed stay decision window", () => {
  it("keeps CONTEST and a visible stay request executable through production-only advancement and restoration", () => {
    let session = createProductionGameSession();
    driveUntil(session, (view) => view.implementation.paymentCount === 1);
    driveUntil(session, (view) => view.availablePlayerActions.some((entry) => entry.id === "legal:respond:CONTEST"));
    session = createProductionGameSession(session.save());

    session.advanceProductionWorld();
    expect(session.getProductionGameView().availablePlayerActions.some(
      (entry) => entry.id === "legal:respond:CONTEST",
    )).toBe(true);
    session.dispatchPlayerCommand("legal:respond:CONTEST");
    expect(session.getProductionGameView().availablePlayerActions.some(
      (entry) => entry.id === "legal:request-stay",
    )).toBe(true);

    session = createProductionGameSession(session.save());
    session.dispatchPlayerCommand("legal:request-stay");
    session = createProductionGameSession(session.save());
    session.advanceProductionWorld();
    expect(session.getProductionGameView().legal.stayStatuses).toHaveLength(1);
    const afterResolution = session.save();
    session.advanceProductionWorld();
    expect(session.getProductionGameView().legal.stayStatuses).toHaveLength(1);
    expect(() => createProductionGameSession(afterResolution)).not.toThrow();
  }, 60_000);

  it("hides a late impossible stay and rejects a stale captured command without mutation", () => {
    const session = createProductionGameSession();
    driveUntil(session, (view) => view.implementation.paymentCount === 1);
    driveUntil(session, (view) => view.availablePlayerActions.some((entry) => entry.id === "legal:respond:CONTEST"));
    session.dispatchPlayerCommand("legal:respond:CONTEST");
    const staleAction = actionWithPrefix(session, "legal:request-stay");
    session.advanceTo(US_V0_I9_STAY_DECISION);
    expect(session.getProductionGameView().availablePlayerActions.some((entry) => entry.id === staleAction)).toBe(false);
    const late = session.save();
    expect(() => session.dispatchPlayerCommand(staleAction)).toThrow(/unavailable/);
    expect(session.save()).toBe(late);
  }, 60_000);
});

describe("I10 bounded black-box production route", () => {
  it("uses only production vocabulary, persists every repaired boundary, and continues after control loss", () => {
    const configuration = oppositionCapabilityConfiguration();
    const restore = (session: ProductionGameSession): ProductionGameSession =>
      createProductionGameSession(session.save(), configuration, US_V0_I10_RUNTIME_ARTIFACTS);
    let session = createProductionGameSession(undefined, configuration, US_V0_I10_RUNTIME_ARTIFACTS);

    dispatchPrefix(session, "agenda:balanced-delivery");
    session = restore(session);
    driveUntil(session, (view) => view.agenda.stage === "ORIGIN_CONSIDERATION_GATE");
    dispatchPrefix(session, "legislature:request-coordination:");
    session = restore(session);
    driveUntil(session, (view) => view.availablePlayerActions.some(
      (entry) => entry.id.startsWith("implementation:request-apportionment:"),
    ));
    dispatchPrefix(session, "implementation:request-apportionment:");
    session = restore(session);
    driveUntil(session, (view) => view.implementation.paymentCount === 1);

    driveUntil(session, (view) => view.availablePlayerActions.some((entry) => entry.id === "legal:respond:CONTEST"));
    session = restore(session);
    session.advanceProductionWorld();
    session.dispatchPlayerCommand("legal:respond:CONTEST");
    session = restore(session);
    session.dispatchPlayerCommand("legal:request-stay");
    session = restore(session);
    driveUntil(session, (view) => view.legal.stayStatuses.length === 1);
    driveUntil(session, (view) => view.officialInformation.completedDeliveryCount > 0);
    session = restore(session);
    driveUntil(session, (view) => !view.administration.controlActive, 600);
    session = restore(session);

    const completed = session.getProductionGameView();
    expect(completed.availablePlayerActions).toEqual([]);
    expect(completed.agenda.enactedLegalSources).toHaveLength(1);
    expect(completed.implementation.generatedBudgetAuthorities).toHaveLength(1);
    expect(completed.implementation.paymentCount).toBe(1);
    expect(completed.legal.publicRulings).toHaveLength(1);
    expect(completed.legal.stayStatuses).toHaveLength(1);
    expect(completed.legal.appealStatuses).toEqual(["FILED"]);
    expect(completed.officialInformation.releasedMeasurements.length).toBeGreaterThan(0);
    expect(completed.officialInformation.releasedClaims.length).toBeGreaterThan(0);
    expect(completed.officialInformation.completedDeliveryCount).toBeGreaterThan(0);
    expect(snapshot(session).housing.projects.some(
      (project) => project.acceptedGovernmentInputRefs.length > 0,
    )).toBe(true);
    expect(() => session.dispatchPlayerCommand("agenda:balanced-delivery")).toThrow(/unavailable/);

    const beforeContinuation = session.getProductionGameView().currentInstant;
    session.advanceProductionWorld();
    expect(session.getProductionGameView().currentInstant).not.toBe(beforeContinuation);
    expect(session.getProductionGameView().availablePlayerActions).toEqual([]);
    for (let step = 0; step < 300 && !snapshot(session).housing.projects.some(
      (project) => project.stage === "USABLE",
    ); step += 1) session.advanceProductionWorld();
    expect(snapshot(session).housing.projects.some((project) => project.stage === "USABLE")).toBe(true);
    session.advanceTo(US_V0_I9_APPELLATE_RULING);
    expect(session.getProductionGameView().legal.appealStatuses).toEqual(["RESOLVED"]);
  }, 120_000);
});
