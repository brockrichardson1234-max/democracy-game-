import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";

import { canonicalConfigurationContent } from "../src/configuration/canonical";
import type { GovernmentConfiguration, LegislativeRuntimeSeed } from "../src/configuration/types";
import {
  createLegislativeSession,
  createLegislativeSessionFromSave,
  projectAdministrationLegislativeView,
  type LegislativeControlBinding,
  type LegislativeSession,
} from "../src/app/legislative-session";
import { parseLegislativeRuntime, serializeLegislativeRuntime } from "../src/app/legislative-persistence";
import {
  US_DELIVERY_COALITION_ID,
  US_V0_LEGISLATIVE_SEED,
  US_V0_STRUCTURAL_CONFIGURATION,
} from "../src/content/us-v0/configuration";
import {
  US_CONGRESS_LEGISLATURE_ID,
  US_HOUSE_CHAMBER_ID,
  US_INCUMBENT_PRESIDENT_ACTOR_ID,
  US_INCUMBENT_VICE_PRESIDENT_ACTOR_ID,
  US_PRESIDENT_OFFICE_ID,
  US_SENATE_CHAMBER_ID,
  US_VICE_PRESIDENT_OFFICE_ID,
} from "../src/content/us-v0/topology";
import {
  beginSponsorSearch,
  replaceActiveOfficeAssignment,
  resolveConfiguredTieBreakerDecision,
  resolveExecutivePresentmentAction,
  resolveExtendedDebateDecisionOpportunity,
  resolveFinalRollCall,
  resolveLegislatureTermBoundary,
  resolveNoSignatureBoundary,
  seekMemberSponsorship,
  type LegislativeRuntimeContext,
  type LegislativeRuntimeState,
} from "../src/sim/legislative-runtime";
import { negotiateWithActor } from "../src/sim/political";

const configuration = US_V0_STRUCTURAL_CONFIGURATION;
const context: LegislativeRuntimeContext = { structure: configuration.structure, seed: US_V0_LEGISLATIVE_SEED };
const compromise = {
  compliance_burden: 4,
  geographic_distribution: 8,
  administrative_capacity_support: 7,
};
const sha256 = (value: string): string => createHash("sha256").update(value).digest("hex");

const reconfigured = (
  seed: LegislativeRuntimeSeed,
  suffix: string,
): GovernmentConfiguration<LegislativeRuntimeSeed> => {
  const unhashed: GovernmentConfiguration<LegislativeRuntimeSeed> = {
    ...configuration,
    identity: {
      ...configuration.identity,
      configurationVersion: `${configuration.identity.configurationVersion}-${suffix}`,
      scenarioVersion: `${configuration.identity.scenarioVersion}-${suffix}`,
      configurationHash: "0".repeat(64),
    },
    runtimeSeed: seed,
  };
  return {
    ...unhashed,
    identity: { ...unhashed.identity, configurationHash: sha256(canonicalConfigurationContent(unhashed)) },
  };
};

const activeAssignmentForActor = (state: LegislativeRuntimeState, actorId: string) => {
  const assignment = state.activeAssignments.find((candidate) => candidate.actorId === actorId);
  if (assignment === undefined) throw new Error(`Missing active assignment for ${actorId}.`);
  return assignment;
};

const findSponsor = (session: LegislativeSession): string => {
  const state = session.getAuditState();
  const houseActorIds = new Set(
    state.political.organizations.flatMap((organization) =>
      organization.memberships
        .filter((membership) => membership.chamberId === US_HOUSE_CHAMBER_ID)
        .map((membership) => membership.actorId),
    ),
  );
  const actor = state.political.actors.find(
    (candidate) => houseActorIds.has(candidate.actorId) && candidate.supportPosture === "LEAN_YEA",
  );
  if (actor === undefined) throw new Error("No deterministic House sponsor.");
  return actor.actorId;
};

const supportGate = (session: LegislativeSession, chamberId: string): void => {
  const state = session.getAuditState();
  const version = state.agenda.currentVersion;
  const available = state.political.organizations.find((organization) =>
    !organization.coordinationActions.some(
      (action) => action.chamberId === chamberId && action.proposalVersion === version,
    ),
  );
  if (available === undefined) throw new Error("No organization available for gate support.");
  session.coordinateOrganization(available.id, chamberId, "SUPPORT");
};

const introduceToHouseGate = (session: LegislativeSession): void => {
  const sponsorId = findSponsor(session);
  const assignment = activeAssignmentForActor(session.getAuditState(), sponsorId);
  session.beginSponsorSearch();
  session.seekSponsorship(sponsorId);
  session.introduceBySponsor(sponsorId, assignment.id);
  session.advanceIntroducedProposal();
};

const reachOriginFinal = (session: LegislativeSession, amendment = true): void => {
  introduceToHouseGate(session);
  supportGate(session, US_HOUSE_CHAMBER_ID);
  session.resolveConsiderationGate();
  if (amendment) {
    session.requestAmendment(compromise);
    session.resolveAmendment();
  } else {
    session.closeAmendmentRound();
  }
};

const reachOtherGate = (session: LegislativeSession, amendment = true): void => {
  reachOriginFinal(session, amendment);
  session.resolveFinalRollCall();
  expect(session.getAuditState().procedure.stage).toBe("OTHER_CHAMBER_CONSIDERATION_GATE");
};

const reachIdenticalText = (session: LegislativeSession, amendment = true): void => {
  reachOtherGate(session, amendment);
  supportGate(session, US_SENATE_CHAMBER_ID);
  session.resolveConsiderationGate();
  session.closeAmendmentRound();
  session.resolveFinalRollCall();
  expect(session.getAuditState().procedure.stage).toBe("IDENTICAL_TEXT");
};

const supportiveConfiguration = reconfigured({
  ...US_V0_LEGISLATIVE_SEED,
  decision: { ...US_V0_LEGISLATIVE_SEED.decision, reservationDistance: 10 },
}, "operative-law-proof");

const enactDimensions = (dimensions: Readonly<Record<string, number>>) => {
  const session = createLegislativeSession(supportiveConfiguration);
  session.reviseAgenda(dimensions);
  reachIdenticalText(session, false);
  session.present();
  const state = session.getAuditState();
  const president = activeAssignmentForActor(state, US_INCUMBENT_PRESIDENT_ACTOR_ID);
  session.executiveAction(US_INCUMBENT_PRESIDENT_ACTOR_ID, president.id, "SIGN");
  return session.getAuditState().enactedLegalSources[0];
};

describe("I3 bounded repair", () => {
  it("I3-REV-001 maps every negotiated dimension into downstream-consumable enacted legal terms", () => {
    const base = US_V0_LEGISLATIVE_SEED.proposal.initialDimensions;
    const lowAppropriation = enactDimensions({ ...base, appropriation_magnitude: 2 });
    const highAppropriation = enactDimensions({ ...base, appropriation_magnitude: 9 });
    expect(lowAppropriation.appropriation.amount).not.toBe(highAppropriation.appropriation.amount);
    expect(lowAppropriation.appropriation.amount).toBe(12_500_000_000);
    expect(highAppropriation.appropriation.amount).toBe(30_000_000_000);
    expect(lowAppropriation.textHash).not.toBe(highAppropriation.textHash);

    const cases = [
      ["recipient_flexibility", "recipient-flexibility-class"],
      ["compliance_burden", "compliance-burden-class"],
      ["geographic_distribution", "geographic-distribution-rule"],
      ["administrative_capacity_support", "administrative-capacity-support-rule"],
    ] as const;
    for (const [dimensionId, termId] of cases) {
      const low = enactDimensions({ ...base, [dimensionId]: 2 });
      const high = enactDimensions({ ...base, [dimensionId]: 9 });
      expect(low.policyTerms[termId]).not.toBe(high.policyTerms[termId]);
      expect(low.textHash).not.toBe(high.textHash);
      expect(low.legalTermsClassification).toBe("APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD");
    }
  }, 20_000);

  it("I3-REV-002 makes active assignments replaceable, authoritative, organization-linked, and persistent", () => {
    const session = createLegislativeSession(supportiveConfiguration);
    reachOriginFinal(session, false);
    const ready = session.getAuditState();
    const outgoing = ready.activeAssignments.find((assignment) =>
      configuration.structure.offices.some(
        (office) => office.id === assignment.officeId && office.chamberId === US_HOUSE_CHAMBER_ID,
      ),
    );
    if (outgoing === undefined) throw new Error("Missing replaceable House assignment.");
    const replacement = {
      ...outgoing,
      id: "test.assignment.house.successor",
      actorId: "test.actor.house.successor",
      effectiveFrom: "2026-09-01T12:00:00-04:00",
    };
    const replaced = replaceActiveOfficeAssignment(ready, {
      structure: supportiveConfiguration.structure,
      seed: supportiveConfiguration.runtimeSeed as LegislativeRuntimeSeed,
    }, replacement);
    expect(replaced.activeAssignments.find((assignment) => assignment.officeId === outgoing.officeId)).toEqual(replacement);
    expect(replaced.political.organizations.flatMap((organization) => organization.memberships)
      .find((membership) => membership.officeId === outgoing.officeId)).toMatchObject({
        actorId: replacement.actorId,
        assignmentId: replacement.id,
      });
    expect(replaced.political.actors.some((actor) => actor.actorId === outgoing.actorId)).toBe(false);
    expect(replaced.political.actors.some((actor) => actor.actorId === replacement.actorId)).toBe(true);
    expect(replaced.agenda).toEqual(ready.agenda);
    expect(replaced.procedure).toEqual(ready.procedure);
    expect(replaced.political.commitments).toEqual(ready.political.commitments);

    const afterVote = resolveFinalRollCall(replaced, {
      structure: supportiveConfiguration.structure,
      seed: supportiveConfiguration.runtimeSeed as LegislativeRuntimeSeed,
    });
    const votes = afterVote.procedure.voteOpportunities.at(-1)?.votes ?? [];
    expect(votes.some((vote) => vote.actorId === outgoing.actorId)).toBe(false);
    expect(votes.some((vote) => vote.actorId === replacement.actorId && vote.assignmentId === replacement.id)).toBe(true);

    const binding = session.getControlBindingAudit();
    const saved = serializeLegislativeRuntime(replaced, binding);
    const restored = parseLegislativeRuntime(saved, supportiveConfiguration.identity);
    expect(restored.state).toEqual(replaced);
    expect(resolveFinalRollCall(restored.state, {
      structure: supportiveConfiguration.structure,
      seed: supportiveConfiguration.runtimeSeed as LegislativeRuntimeSeed,
    })).toEqual(afterVote);

    const sponsorState = beginSponsorSearch(replaceActiveOfficeAssignment(
      createLegislativeSession(supportiveConfiguration).getAuditState(),
      { structure: supportiveConfiguration.structure, seed: supportiveConfiguration.runtimeSeed as LegislativeRuntimeSeed },
      replacement,
    ));
    expect(() => seekMemberSponsorship(sponsorState, {
      structure: supportiveConfiguration.structure,
      seed: supportiveConfiguration.runtimeSeed as LegislativeRuntimeSeed,
    }, outgoing.actorId)).toThrow(/current eligible/);
    expect(() => seekMemberSponsorship(sponsorState, {
      structure: supportiveConfiguration.structure,
      seed: supportiveConfiguration.runtimeSeed as LegislativeRuntimeSeed,
    }, replacement.actorId)).not.toThrow();
  });

  it("I3-REV-002 routes debate, President, and VP authority through replaced active assignments", () => {
    const senateSession = createLegislativeSession(configuration);
    reachOtherGate(senateSession);
    supportGate(senateSession, US_SENATE_CHAMBER_ID);
    senateSession.resolveConsiderationGate();
    senateSession.closeAmendmentRound();
    const senateReady = senateSession.getAuditState();
    const outgoingSenator = senateReady.activeAssignments.find((assignment) =>
      configuration.structure.offices.some(
        (office) => office.id === assignment.officeId && office.chamberId === US_SENATE_CHAMBER_ID,
      ),
    );
    if (outgoingSenator === undefined) throw new Error("Missing replaceable Senator.");
    const incomingSenator = {
      ...outgoingSenator,
      id: "test.assignment.senate.successor",
      actorId: "test.actor.senate.successor",
      effectiveFrom: "2026-09-01T12:00:00-04:00",
    };
    const senateReplaced = replaceActiveOfficeAssignment(senateReady, context, incomingSenator);
    const debate = resolveExtendedDebateDecisionOpportunity(senateReplaced, context);
    const decisions = debate.procedure.extendedDebateDecisionOpportunities.at(-1)?.decisions ?? [];
    expect(decisions.some((decision) => decision.actorId === outgoingSenator.actorId)).toBe(false);
    expect(decisions.some((decision) =>
      decision.actorId === incomingSenator.actorId && decision.assignmentId === incomingSenator.id,
    )).toBe(true);

    const executiveSession = createLegislativeSession(supportiveConfiguration);
    reachIdenticalText(executiveSession, false);
    executiveSession.present();
    const presented = executiveSession.getAuditState();
    const outgoingPresident = presented.activeAssignments.find(
      (assignment) => assignment.officeId === US_PRESIDENT_OFFICE_ID,
    );
    if (outgoingPresident === undefined) throw new Error("Missing active President.");
    const incomingPresident = {
      ...outgoingPresident,
      id: "test.assignment.president.successor",
      actorId: "test.actor.president.successor",
      effectiveFrom: "2026-09-01T12:00:00-04:00",
    };
    const presidentReplaced = replaceActiveOfficeAssignment(presented, {
      structure: supportiveConfiguration.structure,
      seed: supportiveConfiguration.runtimeSeed as LegislativeRuntimeSeed,
    }, incomingPresident);
    expect(() => resolveExecutivePresentmentAction(
      presidentReplaced,
      { structure: supportiveConfiguration.structure, seed: supportiveConfiguration.runtimeSeed as LegislativeRuntimeSeed },
      outgoingPresident.actorId,
      outgoingPresident.id,
      "SIGN",
    )).toThrow(/current configured executive-head/);
    expect(resolveExecutivePresentmentAction(
      presidentReplaced,
      { structure: supportiveConfiguration.structure, seed: supportiveConfiguration.runtimeSeed as LegislativeRuntimeSeed },
      incomingPresident.actorId,
      incomingPresident.id,
      "SIGN",
    ).procedure.stage).toBe("ENACTED");

    const tieSession = createLegislativeSession(supportiveConfiguration);
    reachOtherGate(tieSession, false);
    supportGate(tieSession, US_SENATE_CHAMBER_ID);
    tieSession.resolveConsiderationGate();
    tieSession.closeAmendmentRound();
    const tieReady = tieSession.getAuditState();
    const senateActorIds = new Set(
      tieReady.political.organizations.flatMap((organization) =>
        organization.memberships
          .filter((membership) => membership.chamberId === US_SENATE_CHAMBER_ID)
          .map((membership) => membership.actorId),
      ),
    );
    let senateIndex = 0;
    const forcedTie: LegislativeRuntimeState = {
      ...tieReady,
      political: {
        ...tieReady.political,
        actors: tieReady.political.actors.map((actor) => {
          if (!senateActorIds.has(actor.actorId)) return actor;
          const supportive = senateIndex++ < 50;
          return {
            ...actor,
            evaluations: actor.evaluations.map((evaluation) => ({
              ...evaluation,
              reservationMinimum: 0,
              reservationMaximum: supportive ? 10 : 0,
            })),
          };
        }),
      },
    };
    const tied = resolveFinalRollCall(forcedTie, {
      structure: supportiveConfiguration.structure,
      seed: supportiveConfiguration.runtimeSeed as LegislativeRuntimeSeed,
    });
    expect(tied.procedure.voteOpportunities.at(-1)?.result).toBe("TIE_BREAK_PENDING");
    const outgoingVicePresident = tied.activeAssignments.find(
      (assignment) => assignment.officeId === US_VICE_PRESIDENT_OFFICE_ID,
    );
    if (outgoingVicePresident === undefined) throw new Error("Missing active Vice President.");
    expect(outgoingVicePresident.actorId).toBe(US_INCUMBENT_VICE_PRESIDENT_ACTOR_ID);
    const incomingVicePresident = {
      ...outgoingVicePresident,
      id: "test.assignment.vice-president.successor",
      actorId: "test.actor.vice-president.successor",
      effectiveFrom: "2026-09-01T12:00:00-04:00",
    };
    const vicePresidentReplaced = replaceActiveOfficeAssignment(tied, {
      structure: supportiveConfiguration.structure,
      seed: supportiveConfiguration.runtimeSeed as LegislativeRuntimeSeed,
    }, incomingVicePresident);
    const tieResolved = resolveConfiguredTieBreakerDecision(vicePresidentReplaced, {
      structure: supportiveConfiguration.structure,
      seed: supportiveConfiguration.runtimeSeed as LegislativeRuntimeSeed,
    });
    expect(tieResolved.procedure.voteOpportunities.at(-1)?.votes.at(-1)).toMatchObject({
      actorId: incomingVicePresident.actorId,
      assignmentId: incomingVicePresident.id,
      officeId: US_VICE_PRESIDENT_OFFICE_ID,
      tieBreaker: true,
    });
  });

  it("I3-REV-003 requires administration binding and keeps Senator/VP choices actor-owned", () => {
    const inactive: LegislativeControlBinding = {
      ...createLegislativeSession(configuration).getControlBindingAudit(),
      status: "ENDED",
      endedAt: configuration.calendar.epoch,
      endReason: "BOUND_OFFICEHOLDER_CHANGED",
    };
    const unauthorized = createLegislativeSession(configuration, { controlBinding: inactive });
    expect(() => unauthorized.reviseAgenda(US_V0_LEGISLATIVE_SEED.proposal.initialDimensions)).toThrow(/ControlBinding/);
    const authorized = createLegislativeSession(configuration);
    expect(() => authorized.beginSponsorSearch()).not.toThrow();
    expect(authorized).not.toHaveProperty("threatenExtendedDebate");
    expect(authorized).not.toHaveProperty("castTieBreaker");

    const senate = createLegislativeSession(configuration);
    reachOtherGate(senate);
    supportGate(senate, US_SENATE_CHAMBER_ID);
    senate.resolveConsiderationGate();
    senate.closeAmendmentRound();
    const debate = resolveExtendedDebateDecisionOpportunity(senate.getAuditState(), context);
    const opportunity = debate.procedure.extendedDebateDecisionOpportunities.at(-1);
    expect(opportunity?.decisions).toHaveLength(100);
    expect(opportunity?.decisions.some((decision) => decision.choice === "THREATEN")).toBe(true);
    for (const decision of opportunity?.decisions ?? []) {
      expect(debate.activeAssignments).toContainEqual(expect.objectContaining({
        id: decision.assignmentId,
        officeId: decision.officeId,
        actorId: decision.actorId,
      }));
    }
  });

  it("I3-REV-004 gives the shipped House and Senate real blocked/open consideration routes", () => {
    const houseBlocked = createLegislativeSession(configuration);
    introduceToHouseGate(houseBlocked);
    houseBlocked.coordinateOrganization(US_DELIVERY_COALITION_ID, US_HOUSE_CHAMBER_ID, "OPPOSE");
    houseBlocked.resolveConsiderationGate();
    expect(houseBlocked.getAuditState().procedure.stage).toBe("FAILED");

    const houseOpen = createLegislativeSession(configuration);
    introduceToHouseGate(houseOpen);
    supportGate(houseOpen, US_HOUSE_CHAMBER_ID);
    houseOpen.resolveConsiderationGate();
    expect(houseOpen.getAuditState().procedure.stage).toBe("ORIGIN_AMENDMENT");

    const senateBase = createLegislativeSession(configuration);
    reachOtherGate(senateBase);
    const senateSave = senateBase.save();
    senateBase.coordinateOrganization(US_DELIVERY_COALITION_ID, US_SENATE_CHAMBER_ID, "OPPOSE");
    senateBase.resolveConsiderationGate();
    expect(senateBase.getAuditState().procedure.stage).toBe("FAILED");

    const senateOpen = createLegislativeSessionFromSave(senateSave, configuration);
    supportGate(senateOpen, US_SENATE_CHAMBER_ID);
    senateOpen.resolveConsiderationGate();
    expect(senateOpen.getAuditState().procedure.stage).toBe("OTHER_CHAMBER_AMENDMENT");
  });

  it("I3-REV-005 requires the configured no-signature deadline and authoritative return status", () => {
    const session = createLegislativeSession(configuration, { authoritativeInstant: "2026-08-22T12:00:00-04:00" });
    reachIdenticalText(session);
    session.present();
    const president = activeAssignmentForActor(session.getAuditState(), US_INCUMBENT_PRESIDENT_ACTOR_ID);
    session.executiveAction(president.actorId, president.id, "WITHHOLD");
    expect(session).not.toHaveProperty("resolveNoSignature");
    const pending = session.getAuditState();
    expect(pending.procedure.presentment).toMatchObject({
      presentedAt: "2026-08-22T12:00:00-04:00",
      noSignatureRuleClass: "ELAPSED_CALENDAR_DAYS_EXCLUDING_WEEKDAYS",
      noSignatureTimeZone: "America/New_York",
      authoritativeReturnStatus: null,
    });
    const deadline = pending.procedure.presentment?.resolutionNotBefore;
    if (deadline === undefined) throw new Error("Missing deadline.");
    expect(deadline).toBe("2026-09-03T12:00:00.000-04:00");
    expect(() => resolveNoSignatureBoundary(pending, context, {
      kind: "NO_SIGNATURE_RESOLUTION_BOUNDARY",
      occurredAt: new Date(Date.parse(deadline) - 1).toISOString(),
      proposalVersion: pending.agenda.currentVersion,
      returnStatus: "RETURN_AVAILABLE",
    })).toThrow(/before.*deadline/i);
    const available = resolveNoSignatureBoundary(pending, context, {
      kind: "NO_SIGNATURE_RESOLUTION_BOUNDARY",
      occurredAt: deadline,
      proposalVersion: pending.agenda.currentVersion,
      returnStatus: "RETURN_AVAILABLE",
    });
    expect(available.procedure.stage).toBe("ENACTED");
    const prevented = resolveNoSignatureBoundary(pending, context, {
      kind: "NO_SIGNATURE_RESOLUTION_BOUNDARY",
      occurredAt: deadline,
      proposalVersion: pending.agenda.currentVersion,
      returnStatus: "RETURN_PREVENTED",
    });
    expect(prevented.procedure.stage).toBe("FAILED");
    const restored = parseLegislativeRuntime(session.save(), configuration.identity);
    expect(resolveNoSignatureBoundary(restored.state, context, {
      kind: "NO_SIGNATURE_RESOLUTION_BOUNDARY",
      occurredAt: deadline,
      proposalVersion: pending.agenda.currentVersion,
      returnStatus: "RETURN_AVAILABLE",
    })).toEqual(available);
  });

  it("I3-REV-006 permits expiry only through the exact configured legislature boundary", () => {
    const session = createLegislativeSession(configuration);
    session.beginSponsorSearch();
    expect(session).not.toHaveProperty("expire");
    const pending = session.getAuditState();
    expect(() => resolveLegislatureTermBoundary(pending, context, {
      kind: "LEGISLATURE_TERM_BOUNDARY",
      legislatureId: US_CONGRESS_LEGISLATURE_ID,
      occurredAt: "2027-01-03T11:59:59-05:00",
    })).toThrow(/exact configured/);
    const occurrence = {
      kind: "LEGISLATURE_TERM_BOUNDARY" as const,
      legislatureId: US_CONGRESS_LEGISLATURE_ID,
      occurredAt: US_V0_LEGISLATIVE_SEED.procedure.legislatureTermBoundary.occursAt,
    };
    const expired = resolveLegislatureTermBoundary(pending, context, occurrence);
    expect(expired.procedure.stage).toBe("EXPIRED_AT_END_OF_CONGRESS");
    expect(expired.agenda).toEqual(pending.agenda);
    expect(expired.political.commitments).toEqual(pending.political.commitments);
    const restored = parseLegislativeRuntime(session.save(), configuration.identity);
    expect(resolveLegislatureTermBoundary(restored.state, context, occurrence)).toEqual(expired);

    const enactedSession = createLegislativeSession(supportiveConfiguration);
    reachIdenticalText(enactedSession, false);
    enactedSession.present();
    const president = activeAssignmentForActor(enactedSession.getAuditState(), US_INCUMBENT_PRESIDENT_ACTOR_ID);
    enactedSession.executiveAction(president.actorId, president.id, "SIGN");
    const enacted = enactedSession.getAuditState();
    expect(resolveLegislatureTermBoundary(enacted, {
      structure: supportiveConfiguration.structure,
      seed: supportiveConfiguration.runtimeSeed as LegislativeRuntimeSeed,
    }, {
      ...occurrence,
      occurredAt: (supportiveConfiguration.runtimeSeed as LegislativeRuntimeSeed).procedure.legislatureTermBoundary.occursAt,
    })).toEqual(enacted);
  });

  it("I3-REV-007 keeps hidden actor truth out of staff outlook until accessible communication occurs", () => {
    const session = createLegislativeSession(configuration);
    const base = session.getAuditState();
    const hiddenMutation: LegislativeRuntimeState = {
      ...base,
      political: {
        ...base.political,
        actors: base.political.actors.map((actor, index) => index === 0
          ? {
              ...actor,
              evaluations: actor.evaluations.map((evaluation) => ({
                ...evaluation,
                reservationMinimum: 0,
                reservationMaximum: 0,
              })),
              commitmentBreachWillingness: 1 - actor.commitmentBreachWillingness,
              supportPosture: actor.supportPosture === "LEAN_NAY" ? "LEAN_YEA" : "LEAN_NAY",
            }
          : actor),
      },
    };
    expect(projectAdministrationLegislativeView(hiddenMutation, US_V0_LEGISLATIVE_SEED.executive.administrationId)).toEqual(
      projectAdministrationLegislativeView(base, US_V0_LEGISLATIVE_SEED.executive.administrationId),
    );
    expect(hiddenMutation.political.actors[0]).not.toEqual(base.political.actors[0]);

    const actor = base.political.actors.find((candidate) => candidate.supportPosture === "LEAN_YEA");
    if (actor === undefined) throw new Error("Missing negotiable actor.");
    const negotiated = negotiateWithActor(
      base.political,
      US_V0_LEGISLATIVE_SEED,
      actor.actorId,
      US_V0_LEGISLATIVE_SEED.executive.administrationId,
      {
        proposalId: base.agenda.proposalId,
        version: base.agenda.currentVersion,
        dimensions: base.agenda.versions[0].dimensions,
      },
      { objective: "SUPPORT", terms: {}, conditions: ["communicated exact-version support"] },
    );
    const communicated = { ...base, political: negotiated.political };
    expect(projectAdministrationLegislativeView(
      communicated,
      US_V0_LEGISLATIVE_SEED.executive.administrationId,
    ).staffOutlook).not.toEqual(
      projectAdministrationLegislativeView(base, US_V0_LEGISLATIVE_SEED.executive.administrationId).staffOutlook,
    );
  });

  it("pins every new repair rule in canonical configuration identity", () => {
    expect(sha256(canonicalConfigurationContent(configuration))).toBe(configuration.identity.configurationHash);
    const mutations: readonly LegislativeRuntimeSeed[] = [
      {
        ...US_V0_LEGISLATIVE_SEED,
        proposal: {
          ...US_V0_LEGISLATIVE_SEED.proposal,
          legalTerms: {
            ...US_V0_LEGISLATIVE_SEED.proposal.legalTerms,
            appropriation: {
              ...US_V0_LEGISLATIVE_SEED.proposal.legalTerms.appropriation,
              amountPerDimensionPoint:
                US_V0_LEGISLATIVE_SEED.proposal.legalTerms.appropriation.amountPerDimensionPoint + 1,
            },
          },
        },
      },
      {
        ...US_V0_LEGISLATIVE_SEED,
        procedure: {
          ...US_V0_LEGISLATIVE_SEED.procedure,
          considerationGateMinimumSignals: {
            ...US_V0_LEGISLATIVE_SEED.procedure.considerationGateMinimumSignals,
            [US_HOUSE_CHAMBER_ID]: 3,
          },
        },
      },
      {
        ...US_V0_LEGISLATIVE_SEED,
        decision: {
          ...US_V0_LEGISLATIVE_SEED.decision,
          extendedDebateThreatCutoff: US_V0_LEGISLATIVE_SEED.decision.extendedDebateThreatCutoff + 0.01,
        },
      },
      {
        ...US_V0_LEGISLATIVE_SEED,
        decision: {
          ...US_V0_LEGISLATIVE_SEED.decision,
          tieBreakerYeaCutoff: US_V0_LEGISLATIVE_SEED.decision.tieBreakerYeaCutoff + 0.01,
        },
      },
      {
        ...US_V0_LEGISLATIVE_SEED,
        procedure: {
          ...US_V0_LEGISLATIVE_SEED.procedure,
          noSignatureRule: {
            ...US_V0_LEGISLATIVE_SEED.procedure.noSignatureRule,
            decisionDays: US_V0_LEGISLATIVE_SEED.procedure.noSignatureRule.decisionDays + 1,
          },
        },
      },
      {
        ...US_V0_LEGISLATIVE_SEED,
        procedure: {
          ...US_V0_LEGISLATIVE_SEED.procedure,
          legislatureTermBoundary: {
            ...US_V0_LEGISLATIVE_SEED.procedure.legislatureTermBoundary,
            occursAt: "2027-01-03T12:00:01-05:00",
          },
        },
      },
    ];
    for (const mutation of mutations) {
      const changed = { ...configuration, runtimeSeed: mutation };
      expect(sha256(canonicalConfigurationContent(changed))).not.toBe(configuration.identity.configurationHash);
    }
  });
});
