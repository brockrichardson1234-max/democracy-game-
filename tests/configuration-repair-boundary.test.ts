import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";

import { bootstrapGovernmentConfiguration } from "../src/configuration/bootstrap";
import { canonicalConfigurationContent } from "../src/configuration/canonical";
import { loadGovernmentConfiguration } from "../src/configuration/loader";
import { parseGameSaveV2, serializeGameSaveV2 } from "../src/app/persistence";
import type {
  GovernmentConfiguration,
  ScheduledTransitionDescriptor,
} from "../src/configuration/types";
import {
  GL0_FIXTURE_IDENTITIES,
  GL0_SYNTHETIC_CONFIGURATION,
  createSyntheticGovernmentConfiguration,
  type SyntheticCourtRouteContent,
  type SyntheticFixtureIdentities,
} from "../src/content/gl0-synthetic/configuration";
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
  resolveFederalHousingGrantApplication,
  resolveHousingGrantProposalVote,
  resolveHousingImplementationResponse,
  resolveStateHousingGrantDecision,
  submitHousingGrantProposal,
  submitStateHousingGrantApplication,
} from "../src/sim/governance";
import { advanceWorldTo, type WorldState } from "../src/sim/world";

const sha256For = (configuration: GovernmentConfiguration): string =>
  createHash("sha256").update(canonicalConfigurationContent(configuration)).digest("hex");

const withComputedHash = <TSeed>(
  configuration: GovernmentConfiguration<TSeed>,
): GovernmentConfiguration<TSeed> => ({
  ...configuration,
  identity: {
    ...configuration.identity,
    configurationHash: sha256For(configuration),
  },
});

const alteredSchedule = (
  alter: (transition: ScheduledTransitionDescriptor) => ScheduledTransitionDescriptor,
): GovernmentConfiguration => ({
  ...GL0_SYNTHETIC_CONFIGURATION,
  transitions: GL0_SYNTHETIC_CONFIGURATION.transitions.map(alter),
});

const changeKind = (
  targetKind: ScheduledTransitionDescriptor["kind"],
  changes: Partial<ScheduledTransitionDescriptor>,
) =>
  alteredSchedule((transition) =>
    transition.kind === targetKind
      ? ({ ...transition, ...changes } as ScheduledTransitionDescriptor)
      : transition,
  );

const prepareHousingRoute = (world: WorldState, identities: SyntheticFixtureIdentities): WorldState => {
  world = submitHousingGrantProposal(world, {
    federalMatchRatePercent: 35,
    participationCondition: "strict",
    reportingRequirement: "standard",
  });
  world = amendHousingGrantProposal(world, {
    federalMatchRatePercent: 55,
    participationCondition: "lenient",
    reportingRequirement: "strengthened",
  });
  world = resolveHousingGrantProposalVote(world);
  world = recognizeHousingGrantFiscalAuthority(world);
  world = establishHousingGrantProgram(world);
  for (const jurisdictionId of [identities.stateAId, identities.stateCId]) {
    world = resolveStateHousingGrantDecision(world, jurisdictionId);
    world = submitStateHousingGrantApplication(world, jurisdictionId);
    world = resolveFederalHousingGrantApplication(world, jurisdictionId);
    world = activateIntergovernmentalHousingGrantParticipation(world, jurisdictionId);
    world = createHousingGrantAward(world, jurisdictionId);
    world = obligateHousingGrantAward(world, jurisdictionId);
    world = disburseHousingGrantObligation(world, jurisdictionId);
    world = materializeHousingProjectFromDisbursement(world, jurisdictionId);
  }
  return world;
};

describe("I1 bounded repair configuration proofs", () => {
  it("runs materially renamed and altered court content without a generic-simulation fallback", () => {
    const renamed = Object.fromEntries(
      Object.keys(GL0_FIXTURE_IDENTITIES).map((key) => [
        key,
        key === "namespace" ? "renamed-" : `renamed-${key}`,
      ]),
    ) as unknown as SyntheticFixtureIdentities;
    const alteredCourtRoute = {
      claimedGround: "AUTHORED_NOTICE_REQUIRED_BEFORE_REDIRECTION",
      requestedRemedy: "PRESERVE_FUNDS_PENDING_REVIEW",
      interimReliefRuleRequirement:
        "AUTHORIZED_DECISION_PERMITS_CONFIGURED_STATUS_QUO_ORDER",
      interimReliefDecisionOutcome: "RELIEF_AUTHORIZED",
      interimReliefDecisionSource: "ALTERED_COURT_FIXTURE",
      temporaryOrderDirective: "PAUSE_REDIRECTION_PENDING_CONFIGURED_REVIEW",
      temporaryOrderTemporalScope: "THROUGH_CONFIGURED_REVIEW_BOUNDARY",
      temporaryOrderType: "STATUS_QUO_ORDER",
      complianceResponse: "REFUSE",
    } satisfies SyntheticCourtRouteContent;
    const configuration = withComputedHash(
      createSyntheticGovernmentConfiguration(
        {
          configurationId: "renamed-test-fixture",
          configurationVersion: "1",
          scenarioId: "renamed-causal-route",
          scenarioVersion: "1",
          configurationHash: "0".repeat(64),
        },
        renamed,
        alteredCourtRoute,
      ),
    );
    const bootstrap = bootstrapGovernmentConfiguration(configuration);
    let world = bootstrap.world;
    if (world === null) throw new Error("Renamed test configuration did not materialize.");

    const routeBase = prepareHousingRoute(world, renamed);
    let deployed = advanceWorldTo(routeBase, 5);
    deployed = resolveHousingImplementationResponse(deployed, "DEPLOY_SUPPORT");
    deployed = advanceWorldTo(deployed, 6);
    deployed = attemptDisputedHousingFundsRedirection(deployed);
    deployed = advanceWorldTo(deployed, 9);

    world = advanceWorldTo(routeBase, 5);
    world = resolveHousingImplementationResponse(world, "PRESERVE_SUPPORT_RESERVE");
    world = advanceWorldTo(world, 6);
    world = attemptDisputedHousingFundsRedirection(world);
    world = advanceWorldTo(world, 62);

    expect(deployed.governance.housingImplementationResponseDecision?.targetStateJurisdictionId).toBe(
      renamed.stateCId,
    );
    expect(deployed.governance.judiciary.legalClaims[0]?.claimantJurisdictionId).toBe(
      renamed.stateAId,
    );
    expect(deployed.governance.judiciary.legalClaims[0]).toMatchObject({
      claimedGround: alteredCourtRoute.claimedGround,
      requestedRemedy: alteredCourtRoute.requestedRemedy,
    });
    expect(
      deployed.governance.judiciary.legalContests[0]?.interimReliefDecision,
    ).toMatchObject({
      outcome: alteredCourtRoute.interimReliefDecisionOutcome,
      decisionSource: alteredCourtRoute.interimReliefDecisionSource,
    });
    expect(deployed.governance.judicialLegalOrder.operativeOrders[0]).toMatchObject({
      directive: alteredCourtRoute.temporaryOrderDirective,
      temporalScope: alteredCourtRoute.temporaryOrderTemporalScope,
      orderType: alteredCourtRoute.temporaryOrderType,
    });
    expect(
      deployed.governance.contestedHousingAdministration.judicialOrderComplianceResponses[0]
        ?.response,
    ).toBe(alteredCourtRoute.complianceResponse);
    expect(
      deployed.governance.contestedHousingAdministration.disputedRedirections[0]?.status,
    ).toBe("PREPARING_REDIRECTION");
    expect(
      deployed.history.find((occurrence) => occurrence.type === "InterimReliefDecided"),
    ).toMatchObject({ outcome: alteredCourtRoute.interimReliefDecisionOutcome });
    expect(
      deployed.history.find(
        (occurrence) => occurrence.type === "JudicialOrderComplianceResolved",
      ),
    ).toMatchObject({ response: alteredCourtRoute.complianceResponse });
    expect(world.information.audiences.map((audience) => audience.id)).toEqual([
      renamed.audienceAlphaId,
      renamed.audienceBetaId,
      renamed.audienceGammaId,
    ]);
    expect(world.electoral.electionProcesses[0]?.result?.id).toBe(renamed.electionResultId);
    expect(world.electoral.electionProcesses[0]?.certification?.id).toBe(
      renamed.electionCertificationId,
    );
    expect(
      world.governance.executivePolitical.succession.successorEntitlement?.id,
    ).toBe(renamed.successorEntitlementId);

    const serialized = JSON.stringify(world);
    for (const knownIdentity of Object.values(GL0_FIXTURE_IDENTITIES).filter(
      (value) => value !== GL0_FIXTURE_IDENTITIES.namespace,
    )) {
      expect(serialized).not.toContain(`"${knownIdentity}"`);
    }
  });

  it.each([
    ["certification before election", "ELECTION_CERTIFICATION", { at: 59 }, /election resolution.*certification/i],
    ["entitlement before certification", "SUCCESSOR_ENTITLEMENT", { at: 60 }, /certification.*successor entitlement/i],
    ["Population response after election", "POPULATION_ELECTORAL_RESPONSE", { at: 60, order: 1 }, /Population response.*election resolution/i],
    ["interim relief before challenge", "CONTESTED_AUTHORITY_INTERIM_RELIEF", { at: 6 }, /challenge.*interim relief/i],
    ["compliance before relief", "CONTESTED_AUTHORITY_COMPLIANCE", { at: 7 }, /interim relief.*compliance/i],
    ["report exposure before release", "INFORMATION_ARTIFACT_EXPOSURE", { at: 39 }, /artifact availability.*exposure/i],
    ["claim before source release", "POLITICAL_CLAIM_RELEASE", { at: 39 }, /source artifact availability.*political claim release/i],
  ] as const)("rejects %s", (_label, kind, changes, expected) => {
    expect(() => loadGovernmentConfiguration(changeKind(kind, changes))).toThrow(expected);
  });

  it("rejects inconsistent transferAt and an unprovable same-time semantic dependency", () => {
    expect(() =>
      loadGovernmentConfiguration(
        changeKind("SUCCESSOR_ENTITLEMENT", { transferAt: 64 }),
      ),
    ).toThrow(/transferAt 64.*exactly one office-transfer/i);
    const transferBeforeEntitlement = alteredSchedule((transition) => {
      if (transition.kind === "EXECUTIVE_OFFICE_TRANSFER") return { ...transition, at: 61 };
      if (transition.kind === "SUCCESSOR_ENTITLEMENT") return { ...transition, transferAt: 61 };
      return transition;
    });
    expect(() => loadGovernmentConfiguration(transferBeforeEntitlement)).toThrow(
      /successor entitlement.*office transfer/i,
    );
    expect(() =>
      loadGovernmentConfiguration(
        changeKind("ELECTION_RESOLUTION", { at: 43, order: 0 }),
      ),
    ).toThrow(/Population response.*election resolution/i);
  });

  it("accepts one successor-entitlement and office-transfer pair", () => {
    expect(() => loadGovernmentConfiguration(GL0_SYNTHETIC_CONFIGURATION)).not.toThrow();
  });

  it.each([
    ["earlier", 10],
    ["later", 64],
  ] as const)("rejects an extra unmatched %s office transfer", (_position, at) => {
    const extraTransfer: GovernmentConfiguration = {
      ...GL0_SYNTHETIC_CONFIGURATION,
      transitions: [
        ...GL0_SYNTHETIC_CONFIGURATION.transitions,
        { id: `extra-transfer-${at}`, kind: "EXECUTIVE_OFFICE_TRANSFER", at, order: 0 },
      ],
    };
    expect(() => loadGovernmentConfiguration(extraTransfer)).toThrow(
      /office transfer .* must match exactly one successor-entitlement boundary/i,
    );
  });

  it("rejects an office transfer when no successor entitlement is configured", () => {
    const noEntitlement: GovernmentConfiguration = {
      ...GL0_SYNTHETIC_CONFIGURATION,
      transitions: GL0_SYNTHETIC_CONFIGURATION.transitions.filter(
        (transition) => transition.kind !== "SUCCESSOR_ENTITLEMENT",
      ),
    };
    expect(() => loadGovernmentConfiguration(noEntitlement)).toThrow(
      /office transfer .* must match exactly one successor-entitlement boundary/i,
    );
  });

  it("rejects two office transfers matching one entitlement time", () => {
    const duplicateTransfer: GovernmentConfiguration = {
      ...GL0_SYNTHETIC_CONFIGURATION,
      transitions: [
        ...GL0_SYNTHETIC_CONFIGURATION.transitions,
        {
          id: "duplicate-matching-transfer",
          kind: "EXECUTIVE_OFFICE_TRANSFER",
          at: 63,
          order: 1,
        },
      ],
    };
    expect(() => loadGovernmentConfiguration(duplicateTransfer)).toThrow(
      /transferAt 63 must match exactly one office-transfer boundary/i,
    );
  });

  it("rejects two successor entitlements sharing one transfer boundary", () => {
    const sharedTransfer: GovernmentConfiguration = {
      ...GL0_SYNTHETIC_CONFIGURATION,
      transitions: [
        ...GL0_SYNTHETIC_CONFIGURATION.transitions,
        {
          id: "second-entitlement",
          kind: "SUCCESSOR_ENTITLEMENT",
          at: 62,
          order: 1,
          contestId: GL0_FIXTURE_IDENTITIES.executiveContestId,
          entitlementId: "second-successor-entitlement",
          transferAt: 63,
        },
      ],
    };
    expect(() => loadGovernmentConfiguration(sharedTransfer)).toThrow(
      /office transfer .* must match exactly one successor-entitlement boundary/i,
    );
  });

  it("accepts valid same-time semantic order and remains chunk invariant", () => {
    const sameTime = withComputedHash(
      alteredSchedule((transition) => {
        if (transition.kind === "CONTESTED_AUTHORITY_CHALLENGE") return { ...transition, at: 7, order: 0 };
        if (transition.kind === "CONTESTED_AUTHORITY_INTERIM_RELIEF") return { ...transition, at: 7, order: 1 };
        if (transition.kind === "CONTESTED_AUTHORITY_COMPLIANCE") return { ...transition, at: 7, order: 2 };
        return transition;
      }),
    );
    const bootstrap = bootstrapGovernmentConfiguration(sameTime);
    let day6 = bootstrap.world;
    if (day6 === null) throw new Error("Same-time test configuration did not materialize.");
    day6 = prepareHousingRoute(day6, GL0_FIXTURE_IDENTITIES);
    day6 = advanceWorldTo(day6, 5);
    day6 = resolveHousingImplementationResponse(day6, "PRESERVE_SUPPORT_RESERVE");
    day6 = advanceWorldTo(day6, 6);
    day6 = attemptDisputedHousingFundsRedirection(day6);

    const direct = advanceWorldTo(day6, 9);
    const chunked = advanceWorldTo(advanceWorldTo(day6, 7), 9);
    const restored = parseGameSaveV2(
      serializeGameSaveV2(day6, {
        id: "same-time-test-control",
        decisionSurface: "EXECUTIVE_ADMINISTRATION_STRATEGIC_SURFACE",
        executiveOfficeId: day6.governance.executivePolitical.office.id,
        boundOfficeholderActorId:
          day6.governance.executivePolitical.currentOfficeAssignment.actorId,
        status: "ACTIVE",
        endedAtSimulationTime: null,
        endReason: null,
      }),
      sameTime.identity,
    );
    const saveLoaded = advanceWorldTo(restored.world, 9);
    expect(chunked).toEqual(direct);
    expect(saveLoaded).toEqual(direct);
    expect(direct.governance.judiciary.legalContests[0]?.proceduralStage).toBe("MERITS_PENDING");
    expect(
      direct.governance.contestedHousingAdministration.judicialOrderComplianceResponses[0]
        ?.response,
    ).toBe("COMPLY");
  });
});
