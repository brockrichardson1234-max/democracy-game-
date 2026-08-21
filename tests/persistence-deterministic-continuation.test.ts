import { describe, expect, it } from "vitest";

import { type GameSaveV1 } from "../src/app/persistence";
import {
  createGameSession,
  createGameSessionFromSave,
  type GameSession,
} from "../src/app/session";
import {
  GL0_EXECUTIVE_OFFICE_ID,
  GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
  GL0_OPPOSITION_EXECUTIVE_ACTOR_ID,
} from "../src/sim/executive";
import { STATE_A_ID, STATE_B_ID, STATE_C_ID } from "../src/sim/federalism";
import type { ProposalTerms } from "../src/sim/legislature";
import type { WorldState } from "../src/sim/world";

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

type RouteAction = "DEPLOY" | "PRESERVE";

const createRouteSession = (action: RouteAction = "PRESERVE"): GameSession => {
  const session = createGameSession();
  session.submitHousingGrantProposal(INITIAL_TERMS);
  session.amendHousingGrantProposal(COMPROMISE_TERMS);
  session.resolveHousingGrantProposalVote();
  session.recognizeHousingGrantFiscalAuthority();
  session.establishHousingGrantProgram();
  session.resolveStateHousingGrantDecision(STATE_B_ID);
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
  if (action === "DEPLOY") session.deployHousingImplementationSupportToStateC();
  else session.preserveHousingImplementationSupportReserve();
  return session;
};

const createHostileDay6Session = (): GameSession => {
  const session = createRouteSession("PRESERVE");
  session.advanceTo(6);
  session.attemptDisputedHousingFundsRedirection();
  return session;
};

const parseEnvelope = (serialized: string): GameSaveV1 =>
  JSON.parse(serialized) as GameSaveV1;

const envelopeFor = (session: GameSession): GameSaveV1 => parseEnvelope(session.save());

const worldFor = (session: GameSession): WorldState => envelopeFor(session).world;

const occurrenceCount = (world: WorldState, type: string): number =>
  world.history.filter((occurrence) => occurrence.type === type).length;

const malformedFromValid = (
  mutate: (envelope: Record<string, unknown>) => void,
): string => {
  const envelope = JSON.parse(createGameSession().save()) as Record<string, unknown>;
  mutate(envelope);
  return JSON.stringify(envelope);
};

describe("Commit 24 save/load and deterministic continuation", () => {
  it("1. saves canonical world and session ControlBinding separately without projections or scheduler state", () => {
    const serialized = createGameSession().save();
    const envelope = parseEnvelope(serialized);

    expect(envelope.formatVersion).toBe(1);
    expect(envelope.world).toBeDefined();
    expect(envelope.session.controlBinding.status).toBe("ACTIVE");
    expect(envelope.world).not.toHaveProperty("controlBinding");
    expect(envelope.world.governance).not.toHaveProperty("controlBinding");
    expect(envelope).not.toHaveProperty("view");
    expect(serialized).not.toContain('"controlBindingAudit"');
    expect(serialized).not.toContain('"derivedElectorate"');
    expect(serialized).not.toContain('"nextEventIndex"');
    expect(serialized).not.toContain('"pendingBoundaryQueue"');
  });

  it("2. preserves exact simulation time and does not advance while saving or loading", () => {
    const original = createRouteSession();
    original.advanceTo(30);
    const beforeSave = original.getView();
    const loaded = createGameSessionFromSave(original.save());

    expect(original.getView().currentTime).toBe(30);
    expect(loaded.getView().currentTime).toBe(30);
    expect(loaded.getView()).toEqual(beforeSave);
  });

  it("3. rejects invalid JSON and non-object envelopes", () => {
    expect(() => createGameSessionFromSave("not-json")).toThrow(/not valid JSON/i);
    expect(() => createGameSessionFromSave("null")).toThrow(/save envelope must be an object/i);
    expect(() => createGameSessionFromSave("[]")).toThrow(/save envelope must be an object/i);
  });

  it("4. rejects missing and unsupported save versions", () => {
    for (const version of [undefined, 0, 2]) {
      const serialized = malformedFromValid((envelope) => {
        if (version === undefined) delete envelope.formatVersion;
        else envelope.formatVersion = version;
      });
      expect(() => createGameSessionFromSave(serialized)).toThrow(
        /Unsupported game save format version/i,
      );
    }
  });

  it("5. rejects missing world, session, and ControlBinding fields", () => {
    const cases = [
      malformedFromValid((envelope) => delete envelope.world),
      malformedFromValid((envelope) => delete envelope.session),
      malformedFromValid((envelope) => {
        const session = envelope.session as Record<string, unknown>;
        delete session.controlBinding;
      }),
    ];
    for (const serialized of cases) {
      expect(() => createGameSessionFromSave(serialized)).toThrow(/Invalid game save/i);
    }
  });

  it("6. rejects non-finite-shaped and otherwise invalid canonical current time", () => {
    for (const current of [null, "NaN", -1]) {
      const serialized = malformedFromValid((envelope) => {
        const world = envelope.world as Record<string, unknown>;
        const time = world.time as Record<string, unknown>;
        time.current = current;
      });
      expect(() => createGameSessionFromSave(serialized)).toThrow(
        /world\.time\.current must be a finite nonnegative number/i,
      );
    }
  });

  it("7. rejects unsupported ControlBinding decision surfaces and status shapes", () => {
    const badSurface = malformedFromValid((envelope) => {
      const session = envelope.session as Record<string, unknown>;
      const binding = session.controlBinding as Record<string, unknown>;
      binding.decisionSurface = "UNSUPPORTED_SURFACE";
    });
    const badStatus = malformedFromValid((envelope) => {
      const session = envelope.session as Record<string, unknown>;
      const binding = session.controlBinding as Record<string, unknown>;
      binding.status = "PAUSED";
    });
    const badActiveShape = malformedFromValid((envelope) => {
      const session = envelope.session as Record<string, unknown>;
      const binding = session.controlBinding as Record<string, unknown>;
      binding.endedAtSimulationTime = 4;
    });

    expect(() => createGameSessionFromSave(badSurface)).toThrow(/decision surface or shape/i);
    expect(() => createGameSessionFromSave(badStatus)).toThrow(/unsupported ControlBinding status/i);
    expect(() => createGameSessionFromSave(badActiveShape)).toThrow(/ACTIVE ControlBinding/i);
  });

  it("8. reconstructs an equivalent GameView immediately after load", () => {
    const session = createRouteSession();
    session.advanceTo(43);
    const expected = session.getView();

    expect(createGameSessionFromSave(session.save()).getView()).toEqual(expected);
  });

  it("9. produces a semantically stable save envelope across save-load-save", () => {
    const session = createHostileDay6Session();
    session.advanceTo(9);
    const save1 = session.save();
    const save2 = createGameSessionFromSave(save1).save();

    expect(parseEnvelope(save2)).toEqual(parseEnvelope(save1));
  });

  it("10. adds no canonical save/load history occurrences", () => {
    const session = createRouteSession();
    session.advanceTo(30);
    const before = worldFor(session).history;
    const loadedWorld = worldFor(createGameSessionFromSave(session.save()));

    expect(loadedWorld.history).toEqual(before);
    expect(
      loadedWorld.history.filter((occurrence) =>
        ["GameSaved", "GameLoaded", "SaveCreated", "ControlBindingRestored"].includes(
          occurrence.type,
        ),
      ),
    ).toEqual([]);
  });

  it("11. continues the day-7 admitted legal contest identically through day 12", () => {
    const uninterrupted = createHostileDay6Session();
    const day7 = uninterrupted.advanceTo(7);
    expect(day7.contestedAuthorityAudit.legalContest).toMatchObject({
      proceduralStage: "INTERIM_RELIEF_PENDING",
      interimReliefDecision: null,
      judicialOrderIds: [],
    });
    const loaded = createGameSessionFromSave(uninterrupted.save());
    expect(loaded.getView()).toEqual(day7);

    uninterrupted.advanceTo(12);
    loaded.advanceTo(12);
    expect(envelopeFor(loaded)).toEqual(envelopeFor(uninterrupted));
  });

  it("12. preserves the day-8 decision, single ACTIVE order, and receipt without compliance", () => {
    const session = createHostileDay6Session();
    const day8 = session.advanceTo(8);
    const loaded = createGameSessionFromSave(session.save());

    expect(loaded.getView()).toEqual(day8);
    expect(loaded.getView().contestedAuthorityAudit.judicialOrder?.status).toBe("ACTIVE");
    expect(loaded.getView().contestedAuthorityAudit.agency.orderReceipt).not.toBeNull();
    expect(loaded.getView().contestedAuthorityAudit.agency.complianceResponse).toBeNull();
    expect(occurrenceCount(worldFor(loaded), "InterimReliefDecided")).toBe(1);
    expect(occurrenceCount(worldFor(loaded), "JudicialOrderIssued")).toBe(1);
    expect(occurrenceCount(worldFor(loaded), "JudicialOrderDelivered")).toBe(1);
  });

  it("13. resolves day-8 loaded compliance only on day 9 and exactly once", () => {
    const uninterrupted = createHostileDay6Session();
    uninterrupted.advanceTo(8);
    const loaded = createGameSessionFromSave(uninterrupted.save());

    expect(loaded.getView().contestedAuthorityAudit.agency.complianceResponse).toBeNull();
    uninterrupted.advanceTo(9);
    loaded.advanceTo(9);
    expect(envelopeFor(loaded)).toEqual(envelopeFor(uninterrupted));
    expect(occurrenceCount(worldFor(loaded), "JudicialOrderComplianceResolved")).toBe(1);
    expect(occurrenceCount(worldFor(loaded), "JudicialOrderIssued")).toBe(1);
    expect(occurrenceCount(worldFor(loaded), "JudicialOrderDelivered")).toBe(1);
  });

  it("14. preserves day-9 COMPLY and allows one post-load appeal while the order stays ACTIVE", () => {
    const session = createHostileDay6Session();
    session.advanceTo(9);
    const loaded = createGameSessionFromSave(session.save());

    expect(loaded.getView().contestedAuthorityAudit.agency).toMatchObject({
      redirectionStatus: "HALTED_BY_JUDICIAL_ORDER",
      complianceResponse: { response: "COMPLY" },
    });
    const appealed = loaded.appealHousingRedirectionOrderWhileComplying();
    expect(appealed.contestedAuthorityAudit.executiveResponse?.action).toBe(
      "APPEAL_WHILE_COMPLYING",
    );
    expect(appealed.contestedAuthorityAudit.legalContest?.reviewRequest).not.toBeNull();
    expect(appealed.contestedAuthorityAudit.judicialOrder?.status).toBe("ACTIVE");
    expect(occurrenceCount(worldFor(loaded), "JudicialReviewRequested")).toBe(1);
  });

  it("15. persists an executive appeal response and never duplicates its review request", () => {
    const uninterrupted = createHostileDay6Session();
    uninterrupted.advanceTo(9);
    uninterrupted.appealHousingRedirectionOrderWhileComplying();
    const loaded = createGameSessionFromSave(uninterrupted.save());

    expect(loaded.getView().contestedAuthorityAudit.executiveResponse?.action).toBe(
      "APPEAL_WHILE_COMPLYING",
    );
    expect(loaded.getView().contestedAuthorityAudit.legalContest?.reviewRequest).not.toBeNull();
    expect(loaded.getView().contestedAuthorityAudit.judicialOrder?.status).toBe("ACTIVE");
    expect(loaded.getView().contestedAuthorityAudit.legalContest).not.toHaveProperty(
      "appellateResult",
    );
    uninterrupted.advanceTo(12);
    loaded.advanceTo(12);
    expect(envelopeFor(loaded)).toEqual(envelopeFor(uninterrupted));
    expect(occurrenceCount(worldFor(loaded), "JudicialReviewRequested")).toBe(1);
  });

  it("16. continues day-30 captured measurement to the same frozen report and political state", () => {
    const uninterrupted = createRouteSession();
    const day30 = uninterrupted.advanceTo(30);
    expect(day30.officialHousingMeasurement.status).toBe("CAPTURED");
    expect(day30.officialHousingMeasurement.capturedRegionalResults).not.toEqual([]);
    expect(day30.officialHousingMeasurement.releasedReport).toBeNull();
    expect(day30.publicInformationAudit.exposures).toEqual([]);
    const loaded = createGameSessionFromSave(uninterrupted.save());

    uninterrupted.advanceTo(50);
    loaded.advanceTo(50);
    expect(envelopeFor(loaded)).toEqual(envelopeFor(uninterrupted));
    expect(loaded.getView().officialHousingMeasurement.status).toBe("RELEASED");
    expect(loaded.getView().populationAudit.electoralDispositionResolvedAt).toBe(43);
  });

  it("17. continues the day-59 pre-election state identically through day 65", () => {
    const uninterrupted = createRouteSession("PRESERVE");
    const day59 = uninterrupted.advanceTo(59);
    expect(day59.populationAudit.electoralDispositionResolvedAt).toBe(43);
    expect(day59.electoralAudit.electionProcess.result).toBeNull();
    const loaded = createGameSessionFromSave(uninterrupted.save());

    uninterrupted.advanceTo(65);
    loaded.advanceTo(65);
    expect(envelopeFor(loaded)).toEqual(envelopeFor(uninterrupted));
  });

  it("18. keeps the day-60 election result frozen and creates one certification on day 61", () => {
    const uninterrupted = createRouteSession("PRESERVE");
    uninterrupted.advanceTo(60);
    const savedProcess = uninterrupted.getView().electoralAudit.electionProcess;
    const savedResult = savedProcess.result;
    expect(savedResult?.outcome).toBe("OPPOSITION_WIN");
    expect(uninterrupted.getView().electoralAudit.electionProcess.certification).toBeNull();
    const loaded = createGameSessionFromSave(uninterrupted.save());

    loaded.advanceTo(61);
    const certifiedProcess = loaded.getView().electoralAudit.electionProcess;
    expect(certifiedProcess.electorateSnapshot).toEqual(savedProcess.electorateSnapshot);
    expect(certifiedProcess.participationRecords).toEqual(savedProcess.participationRecords);
    expect(certifiedProcess.ballots).toEqual(savedProcess.ballots);
    expect(certifiedProcess.result).toEqual(savedResult);
    expect(occurrenceCount(worldFor(loaded), "ElectionResolved")).toBe(1);
    expect(occurrenceCount(worldFor(loaded), "ElectionCertified")).toBe(1);
  });

  it("19. keeps PRESERVE day 61 certified but not entitled until crossing day 62", () => {
    const uninterrupted = createRouteSession("PRESERVE");
    const day61 = uninterrupted.advanceTo(61);
    const loaded = createGameSessionFromSave(uninterrupted.save());

    expect(loaded.getView()).toEqual(day61);
    expect(loaded.getView().electoralAudit.electionProcess.certification?.status).toBe(
      "CERTIFIED",
    );
    expect(loaded.getView().executiveSuccessionAudit.successorEntitlement).toBeNull();
    expect(loaded.getView().executiveSuccessionAudit.currentOfficeAssignment.actorId).toBe(
      GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
    );
    expect(loaded.getView().controlBindingAudit.status).toBe("ACTIVE");

    uninterrupted.advanceTo(62);
    loaded.advanceTo(62);
    expect(envelopeFor(loaded)).toEqual(envelopeFor(uninterrupted));
    expect(occurrenceCount(worldFor(loaded), "ElectionCertified")).toBe(1);
    expect(occurrenceCount(worldFor(loaded), "SuccessorEntitlementEstablished")).toBe(1);
  });

  it("20. keeps PRESERVE day 62 entitled but not transferred until crossing day 63", () => {
    const uninterrupted = createRouteSession("PRESERVE");
    const day62 = uninterrupted.advanceTo(62);
    const loaded = createGameSessionFromSave(uninterrupted.save());

    expect(loaded.getView()).toEqual(day62);
    expect(loaded.getView().executiveSuccessionAudit.successorEntitlement?.entitledActorId).toBe(
      GL0_OPPOSITION_EXECUTIVE_ACTOR_ID,
    );
    expect(loaded.getView().executiveSuccessionAudit.currentOfficeAssignment.actorId).toBe(
      GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
    );
    expect(loaded.getView().controlBindingAudit.status).toBe("ACTIVE");

    uninterrupted.advanceTo(63);
    loaded.advanceTo(63);
    expect(envelopeFor(loaded)).toEqual(envelopeFor(uninterrupted));
    expect(occurrenceCount(worldFor(loaded), "SuccessorEntitlementEstablished")).toBe(1);
    expect(occurrenceCount(worldFor(loaded), "ExecutiveOfficeTransferred")).toBe(1);
  });

  it("21. restores the day-63 ENDED binding, advances, and rejects outgoing strategy", () => {
    const session = createRouteSession("PRESERVE");
    session.advanceTo(63);
    const loaded = createGameSessionFromSave(session.save());

    expect(loaded.getView().controlBindingAudit).toMatchObject({
      status: "ENDED",
      boundOfficeholderActorId: GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
      endedAtSimulationTime: 63,
    });
    expect(loaded.getView().executiveSuccessionAudit.currentOfficeAssignment.actorId).toBe(
      GL0_OPPOSITION_EXECUTIVE_ACTOR_ID,
    );
    expect(loaded.advanceTo(70).currentTime).toBe(70);
    expect(() => loaded.attemptDisputedHousingFundsRedirection()).toThrow(
      /No active ControlBinding.*decision surface unavailable/i,
    );
  });

  it("22. preserves the DEPLOY certified tie, incumbent office, and ACTIVE binding through day 70", () => {
    const uninterrupted = createRouteSession("DEPLOY");
    const day61 = uninterrupted.advanceTo(61);
    expect(day61.electoralAudit.electionProcess.result?.outcome).toBe("TIE");
    expect(day61.executiveSuccessionAudit.successorEntitlement).toBeNull();
    expect(day61.controlBindingAudit.status).toBe("ACTIVE");
    const loaded = createGameSessionFromSave(uninterrupted.save());

    uninterrupted.advanceTo(70);
    loaded.advanceTo(70);
    expect(envelopeFor(loaded)).toEqual(envelopeFor(uninterrupted));
    expect(loaded.getView().executiveSuccessionAudit.successorEntitlement).toBeNull();
    expect(loaded.getView().executiveSuccessionAudit.currentOfficeAssignment.actorId).toBe(
      GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
    );
    expect(loaded.getView().controlBindingAudit.status).toBe("ACTIVE");
  });

  it("23. round-trips every canonical owner root without substituting duplicated summaries", () => {
    const session = createRouteSession("PRESERVE");
    session.advanceTo(63);
    const before = worldFor(session);
    const after = worldFor(createGameSessionFromSave(session.save()));

    expect(after.time).toEqual(before.time);
    expect(after.governance).toEqual(before.governance);
    expect(after.geography).toEqual(before.geography);
    expect(after.housing).toEqual(before.housing);
    expect(after.information).toEqual(before.information);
    expect(after.population).toEqual(before.population);
    expect(after.electoral).toEqual(before.electoral);
    expect(after.history).toEqual(before.history);
  });

  it("24. creates independent original and loaded object graphs", () => {
    const original = createRouteSession("PRESERVE");
    original.advanceTo(61);
    const loaded = createGameSessionFromSave(original.save());
    loaded.advanceTo(63);

    expect(original.getView().currentTime).toBe(61);
    expect(original.getView().executiveSuccessionAudit.currentOfficeAssignment.actorId).toBe(
      GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
    );
    expect(original.getView().controlBindingAudit.status).toBe("ACTIVE");
    expect(loaded.getView().currentTime).toBe(63);
    expect(loaded.getView().executiveSuccessionAudit.currentOfficeAssignment.actorId).toBe(
      GL0_OPPOSITION_EXECUTIVE_ACTOR_ID,
    );
    expect(loaded.getView().controlBindingAudit.status).toBe("ENDED");
  });

  it("25. reconciles a stale ACTIVE binding without rebinding the successor", () => {
    const session = createRouteSession("PRESERVE");
    session.advanceTo(63);
    const envelope = JSON.parse(session.save()) as Record<string, unknown>;
    const savedSession = envelope.session as Record<string, unknown>;
    const binding = savedSession.controlBinding as Record<string, unknown>;
    binding.status = "ACTIVE";
    binding.endedAtSimulationTime = null;
    binding.endReason = null;
    const loaded = createGameSessionFromSave(JSON.stringify(envelope));

    expect(loaded.getView().controlBindingAudit).toMatchObject({
      executiveOfficeId: GL0_EXECUTIVE_OFFICE_ID,
      boundOfficeholderActorId: GL0_INCUMBENT_EXECUTIVE_ACTOR_ID,
      status: "ENDED",
    });
    expect(loaded.getView().controlBindingAudit.boundOfficeholderActorId).not.toBe(
      GL0_OPPOSITION_EXECUTIVE_ACTOR_ID,
    );
  });
});
