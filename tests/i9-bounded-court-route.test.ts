import { describe, expect, it } from "vitest";

import {
  createIntegratedPartialRuntimeAuditSession,
  createIntegratedPartialRuntimeSession,
} from "../src/app/integrated-session";
import { canonicalConfigurationContent } from "../src/configuration/canonical";
import { loadGovernmentConfiguration } from "../src/configuration/loader";
import { sha256Hex } from "../src/configuration/sha256";
import type { GovernmentConfiguration, LegislativeRuntimeSeed } from "../src/configuration/types";
import { US_V0_STRUCTURAL_CONFIGURATION } from "../src/content/us-v0/configuration";
import { US_V0_2029_TRANSFER, US_V0_OPPOSITION_TICKET_ID } from "../src/content/us-v0/i5";
import {
  createUsV0I9RouteConfiguration,
  type UsV0I9RouteOptions,
  US_V0_I9_ADMINISTRATIVE_ACTION,
  US_V0_I9_APPELLATE_RULING,
  US_V0_I9_DOCKET,
  US_V0_I9_FILING,
  US_V0_I9_INTERIM_REQUEST,
  US_V0_I9_LEGAL_CONTEST_CONFIGURATION,
  US_V0_I9_NOTICE,
  US_V0_I9_RULING,
  US_V0_I9_RUNTIME_ARTIFACTS,
  US_V0_I9_STAY_DECISION,
} from "../src/content/us-v0/i9";

const identified = (
  value: GovernmentConfiguration<LegislativeRuntimeSeed>,
): GovernmentConfiguration<LegislativeRuntimeSeed> => ({
  ...value,
  identity: { ...value.identity, configurationHash: sha256Hex(canonicalConfigurationContent(value)) },
});

const configurationVariant = (options: UsV0I9RouteOptions) => {
  const route = createUsV0I9RouteConfiguration(options);
  return identified({
    ...structuredClone(US_V0_STRUCTURAL_CONFIGURATION),
    integratedRuntime: {
      ...structuredClone(US_V0_STRUCTURAL_CONFIGURATION.integratedRuntime!),
      temporal: route.temporal,
      legalContest: route.legalContest,
    },
  });
};

const createSession = (configuration = US_V0_STRUCTURAL_CONFIGURATION) =>
  createIntegratedPartialRuntimeSession(configuration, US_V0_I9_RUNTIME_ARTIFACTS);

const runToNotice = (configuration = US_V0_STRUCTURAL_CONFIGURATION) => {
  const session = createSession(configuration);
  session.issueBoundedRelationshipRejection();
  const noticeAt = configuration.integratedRuntime!.temporal!.boundaries
    .find((entry) => entry.kind === "JUDICIAL_NOTICE_RECEIVED")!.at;
  session.advanceTo(noticeAt);
  return session;
};

describe("I9 reconciled bounded legal-contest route", () => {
  it("pins generic deterministic legal machinery without contemporary judicial or political preference content", () => {
    expect(() => loadGovernmentConfiguration(US_V0_STRUCTURAL_CONFIGURATION)).not.toThrow();
    expect(US_V0_I9_LEGAL_CONTEST_CONFIGURATION).toMatchObject({
      semanticsVersion: "0.9.1-i9-repair",
      standingRuleVersion: "configured-recipient-final-act-eligibility-1",
      outcomeRuleVersion: "required-procedure-deterministic-merits-1",
      legalValidityRuleVersion: "procedure-record-authority-validity-1",
      classification: "APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD",
    });
    expect(JSON.stringify(US_V0_I9_LEGAL_CONTEST_CONFIGURATION)).not.toMatch(
      /ideology|partisan|democrat|republican|approval|polling/i,
    );
    expect(US_V0_I9_LEGAL_CONTEST_CONFIGURATION.judicialActors).toHaveLength(2);
  });

  it("keeps filing, eligibility, docketing, proceeding, ruling, interpretation, and order distinct", () => {
    const session = createSession();
    session.issueBoundedRelationshipRejection();
    const act = structuredClone(session.getAuditState().implementation!.administrativeProgram.relationshipQualificationDeterminations[0]);
    session.advanceTo(US_V0_I9_FILING);
    expect(session.getLegalContestAuditState()).toMatchObject({
      claims: [{ challengedActRef: act.id, status: "FILED", eligibility: { eligible: true } }],
      proceedings: [], rulings: [], interpretations: [], orders: [],
    });
    expect(session.getAuditState().implementation!.administrativeProgram.relationshipQualificationDeterminations[0]).toEqual(act);
    session.advanceTo(US_V0_I9_DOCKET);
    expect(session.getLegalContestAuditState().proceedings[0]).toMatchObject({ status: "DOCKETED" });
    session.advanceTo(US_V0_I9_INTERIM_REQUEST);
    expect(session.getLegalContestAuditState()).toMatchObject({
      proceedings: [{ status: "PENDING" }], interimReliefRequests: [{ proceedingId: expect.any(String) }],
    });
    session.advanceTo(US_V0_I9_RULING);
    const legal = session.getLegalContestAuditState();
    expect(legal.rulings[0]).toMatchObject({ disposition: "CLAIMANT_PREVAILS" });
    expect(legal.interpretations[0]).toMatchObject({
      proposition: "CHALLENGED_REQUALIFICATION_AUTHORITY_INVALID_WITHOUT_CONFIGURED_REQUIRED_PROCEDURE",
    });
    expect(legal.rulings[0].interpretationId).toBe(legal.interpretations[0].id);
    expect(legal.orders[0]).toMatchObject({ sourceRulingId: legal.rulings[0].id, status: "OPERATIVE" });
    expect(legal.orders[0].scope).toEqual(US_V0_I9_LEGAL_CONTEST_CONFIGURATION.order.scope);
  });

  it("does not treat court occurrence as Population knowledge or expose hidden legal truth", () => {
    const session = runToNotice();
    const population = structuredClone(session.getAuditState().population);
    const information = structuredClone(session.getInformationAuditState());
    const publicLegal = session.getPublicLegalStatus();
    expect(publicLegal.publicRulings).toHaveLength(1);
    expect(publicLegal.operativeOrders).toHaveLength(1);
    expect(publicLegal).not.toHaveProperty("interpretations");
    expect(JSON.stringify(publicLegal)).not.toMatch(/requiredProcedureRecord|decisionRuleVersion/i);
    expect(session.getAuditState().population).toEqual(population);
    expect(session.getInformationAuditState()).toEqual(information);
  });

  it("enters the implementation owner at exact scope and changes future owner behavior without direct Housing mutation", () => {
    const complied = runToNotice();
    const contested = runToNotice();
    complied.respondToJudicialOrder("COMPLY");
    contested.respondToJudicialOrder("CONTEST");
    complied.advanceTo(US_V0_I9_ADMINISTRATIVE_ACTION);
    contested.advanceTo(US_V0_I9_ADMINISTRATIVE_ACTION);
    expect(complied.getAuditState().implementation!.administrativeProgram.legalConstraints[0]).toMatchObject({
      relationshipId: US_V0_I9_LEGAL_CONTEST_CONFIGURATION.relationshipId,
      determinationId: US_V0_I9_LEGAL_CONTEST_CONFIGURATION.trigger.determinationId,
      enforceability: "OPERATIVE",
    });
    expect(complied.getAuditState().implementation!.administrativeProgram.formulaDispositionResolutions[0].outcome)
      .toBe("WITHHELD_BY_COMPLIANCE");
    expect(contested.getAuditState().implementation!.administrativeProgram.formulaDispositionResolutions[0].outcome)
      .toBe("EXECUTED_WHILE_CONTESTED");
    expect(complied.getAuditState().housing).toEqual(contested.getAuditState().housing);
    expect(complied.getLegalContestAuditState().orders).toEqual(contested.getLegalContestAuditState().orders);
  }, 30_000);

  it("makes stay enforceability distinct without deleting the ruling or order", () => {
    const denied = runToNotice(configurationVariant({ stayOutcome: "DENIED" }));
    const granted = runToNotice(configurationVariant({ stayOutcome: "GRANTED" }));
    for (const session of [denied, granted]) {
      session.respondToJudicialOrder("CONTEST");
      session.requestJudicialStay();
      session.advanceTo(US_V0_I9_STAY_DECISION);
    }
    expect(denied.getPublicLegalStatus().operativeOrders[0].enforceability).toBe("OPERATIVE");
    expect(granted.getPublicLegalStatus().operativeOrders[0].enforceability).toBe("STAYED");
    expect(granted.getLegalContestAuditState().rulings).toEqual(denied.getLegalContestAuditState().rulings);
    expect(granted.getLegalContestAuditState().orders).toEqual(denied.getLegalContestAuditState().orders);
  }, 30_000);

  it("preserves the lower ruling while configured appellate dispositions alter only operative legal state", () => {
    const affirmed = runToNotice(configurationVariant({ appellateDisposition: "AFFIRMED" }));
    const reversed = runToNotice(configurationVariant({ appellateDisposition: "REVERSED" }));
    for (const session of [affirmed, reversed]) {
      session.respondToJudicialOrder("CONTEST");
      session.advanceTo(US_V0_I9_APPELLATE_RULING);
    }
    expect(reversed.getLegalContestAuditState().rulings).toEqual(affirmed.getLegalContestAuditState().rulings);
    expect(affirmed.getLegalContestAuditState().appeals[0].disposition).toBe("AFFIRMED");
    expect(reversed.getLegalContestAuditState().appeals[0].disposition).toBe("REVERSED");
    expect(reversed.getPublicLegalStatus().operativeOrders[0].enforceability).toBe("SUPERSEDED");
  }, 30_000);

  it("is declaration-order independent and explicitly orders court before the same-instant owner action", () => {
    const forward = configurationVariant({
      administrativeActionAt: US_V0_I9_RULING,
      administrativeActionPhase: -1_000,
    });
    const reverse = configurationVariant({
      administrativeActionAt: US_V0_I9_RULING,
      administrativeActionPhase: -1_000,
      reverseDeclarationOrder: true,
    });
    const a = createSession(forward);
    const b = createSession(reverse);
    a.issueBoundedRelationshipRejection();
    b.issueBoundedRelationshipRejection();
    a.advanceTo(US_V0_I9_RULING);
    b.advanceTo(US_V0_I9_RULING);
    expect(a.getAuditState()).toEqual(b.getAuditState());
    expect(a.getAuditState().implementation!.administrativeProgram.formulaDispositionResolutions[0])
      .toMatchObject({ legalConstraintId: expect.any(String) });
  }, 30_000);

  it("distinguishes an owner action completed before an order from the same action attempted after it", () => {
    const beforeOrder = createSession(configurationVariant({
      administrativeActionAt: US_V0_I9_RULING,
      administrativeActionPhase: -3_000,
    }));
    const afterOrder = createSession(configurationVariant({
      administrativeActionAt: US_V0_I9_RULING,
      administrativeActionPhase: -1_000,
    }));
    beforeOrder.issueBoundedRelationshipRejection();
    afterOrder.issueBoundedRelationshipRejection();
    beforeOrder.advanceTo(US_V0_I9_RULING);
    afterOrder.advanceTo(US_V0_I9_RULING);
    expect(beforeOrder.getAuditState().implementation!.administrativeProgram.formulaDispositionResolutions[0].outcome)
      .toBe("EXECUTED_WITHOUT_CONSTRAINT");
    expect(afterOrder.getAuditState().implementation!.administrativeProgram.formulaDispositionResolutions[0].outcome)
      .toBe("EXECUTED_WHILE_CONTESTED");
    expect(beforeOrder.getLegalContestAuditState().orders).toEqual(afterOrder.getLegalContestAuditState().orders);
  }, 30_000);

  it("does not rewind a completed Housing occurrence when a later order becomes effective", () => {
    const configuration = configurationVariant({
      filingAt: "2028-01-01T12:00:00-05:00",
      docketAt: "2028-01-02T12:00:00-05:00",
      interimRequestAt: "2028-01-03T12:00:00-05:00",
      rulingAt: "2028-01-10T12:00:00-05:00",
      noticeAt: "2028-01-11T12:00:00-05:00",
      stayAt: "2028-02-01T12:00:00-05:00",
      complianceAt: "2028-02-05T12:00:00-05:00",
      appealAt: "2029-02-01T12:00:00-05:00",
    });
    const session = createSession(configuration);
    session.issueBoundedRelationshipRejection();
    session.advanceTo("2027-12-31T12:00:00-05:00");
    const before = structuredClone(session.getAuditState().housing);
    expect(before!.projects.some((entry) => entry.physicalCompletionAt !== null)).toBe(true);
    session.advanceTo("2028-01-10T12:00:00-05:00");
    expect(session.getAuditState().housing!.projects.map((entry) => ({
      id: entry.id,
      physicalCompletionAt: entry.physicalCompletionAt,
      completionHistory: entry.history.filter((record) => record.toStage === "PHYSICALLY_COMPLETE"),
    }))).toEqual(before!.projects.map((entry) => ({
      id: entry.id,
      physicalCompletionAt: entry.physicalCompletionAt,
      completionHistory: entry.history.filter((record) => record.toStage === "PHYSICALLY_COMPLETE"),
    })));
  }, 30_000);

  it("continues an appeal across opposition succession while ControlBinding loss blocks only player commands", () => {
    const resolutions = US_V0_I9_RUNTIME_ARTIFACTS.populationCohorts.cohorts.map((cohort) => ({
      cohortId: cohort.id,
      candidatePreference: US_V0_OPPOSITION_TICKET_ID,
      turnoutDisposition: "HIGH",
      classification: "APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD" as const,
      causeKey: "i9-succession-opposition",
    }));
    const session = createIntegratedPartialRuntimeAuditSession(
      US_V0_STRUCTURAL_CONFIGURATION, US_V0_I9_RUNTIME_ARTIFACTS, resolutions,
    );
    session.issueBoundedRelationshipRejection();
    session.advanceTo(US_V0_I9_NOTICE);
    session.respondToJudicialOrder("CONTEST");
    const lower = structuredClone(session.getLegalContestAuditState().rulings);
    session.advanceTo(US_V0_2029_TRANSFER);
    expect(session.getControlBindingAudit().status).toBe("ENDED");
    expect(() => session.respondToJudicialOrder("COMPLY")).toThrow(/No active ControlBinding/i);
    session.advanceTo(US_V0_I9_APPELLATE_RULING);
    expect(session.getLegalContestAuditState().rulings).toEqual(lower);
    expect(session.getLegalContestAuditState().appeals[0]).toMatchObject({ status: "RESOLVED", disposition: "AFFIRMED" });
  }, 30_000);
});
