import { describe, expect, it } from "vitest";

import { createIntegratedPartialRuntimeSession } from "../src/app/integrated-session";
import { loadGovernmentConfiguration } from "../src/configuration/loader";
import { canonicalConfigurationContent } from "../src/configuration/canonical";
import { sha256Hex } from "../src/configuration/sha256";
import type { GovernmentConfiguration, LegislativeRuntimeSeed } from "../src/configuration/types";
import { US_V0_STRUCTURAL_CONFIGURATION } from "../src/content/us-v0/configuration";
import {
  US_V0_I9_ADMISSION,
  US_V0_I9_APPELLATE_RULING,
  US_V0_I9_FILING,
  US_V0_I9_INTERIM_REQUEST,
  US_V0_I9_LEGAL_CONTEST_CONFIGURATION,
  US_V0_I9_NOTICE,
  US_V0_I9_RULING,
  US_V0_I9_RUNTIME_ARTIFACTS,
  US_V0_I9_STAY_DECISION,
} from "../src/content/us-v0/i9";

const createSession = () => createIntegratedPartialRuntimeSession(
  US_V0_STRUCTURAL_CONFIGURATION,
  US_V0_I9_RUNTIME_ARTIFACTS,
);

describe("I9 bounded legal-contest route", () => {
  it("pins one configured trial/appellate route with distinct adjudicator identities", () => {
    expect(() => loadGovernmentConfiguration(US_V0_STRUCTURAL_CONFIGURATION)).not.toThrow();
    expect(US_V0_I9_LEGAL_CONTEST_CONFIGURATION).toMatchObject({
      semanticsVersion: "us-v0-bounded-legal-contest-1",
      classification: "APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD",
      trigger: { prospectiveOnly: true, moneyDamagesRequested: false },
    });
    expect(US_V0_I9_LEGAL_CONTEST_CONFIGURATION.judicialOffices).toHaveLength(2);
    expect(US_V0_I9_LEGAL_CONTEST_CONFIGURATION.judicialActors).toHaveLength(2);
    expect(US_V0_I9_LEGAL_CONTEST_CONFIGURATION.judicialAssignments).toHaveLength(2);
    expect(new Set(US_V0_I9_LEGAL_CONTEST_CONFIGURATION.judicialActors.map((entry) => entry.id)).size).toBe(2);
  });

  it("rejects invalid forum ownership and unpinned behavior changes", () => {
    const altered = structuredClone(US_V0_STRUCTURAL_CONFIGURATION) as GovernmentConfiguration<LegislativeRuntimeSeed>;
    const route = altered.integratedRuntime!.legalContest!;
    const changed = {
      ...altered,
      integratedRuntime: {
        ...altered.integratedRuntime!,
        legalContest: { ...route, targetInstitutionId: route.forumInstitutionId },
      },
    };
    const reidentified = {
      ...changed,
      identity: { ...changed.identity, configurationHash: sha256Hex(canonicalConfigurationContent(changed)) },
    };
    expect(() => loadGovernmentConfiguration(reidentified)).toThrow(/legal-contest configuration/);

    const routeWithoutHash = Object.fromEntries(
      Object.entries(route).filter(([key]) => key !== "parameterHash"),
    ) as Omit<typeof route, "parameterHash">;
    const invalidRouteWithoutHash = {
      ...routeWithoutHash,
      forumInstitutionId: route.targetInstitutionId,
    };
    const invalidForumUnhashed = {
      ...altered,
      integratedRuntime: {
        ...altered.integratedRuntime!,
        legalContest: {
          ...invalidRouteWithoutHash,
          parameterHash: sha256Hex(JSON.stringify(invalidRouteWithoutHash)),
        },
      },
    };
    const invalidForum = {
      ...invalidForumUnhashed,
      identity: {
        ...invalidForumUnhashed.identity,
        configurationHash: sha256Hex(canonicalConfigurationContent(invalidForumUnhashed)),
      },
    };
    expect(() => loadGovernmentConfiguration(invalidForum)).toThrow(/legal-contest configuration/);
  });

  it("requires the final written administrative determination before filing", () => {
    const absent = createSession();
    absent.advanceTo(US_V0_I9_FILING);
    expect(absent.getLegalContestAuditState().claims).toEqual([]);

    const triggered = createSession();
    triggered.issueBoundedRelationshipRejection();
    const determination = triggered.getAuditState().implementation!.administrativeProgram
      .relationshipQualificationDeterminations[0];
    expect(determination).toMatchObject({
      finalAgencyAction: true,
      prospectiveOnly: true,
      moneyDamagesGranted: false,
      outcome: "REQUALIFICATION_REJECTED",
      formulaDisposition: "DIRECTED_OUT_OF_RELATIONSHIP_PENDING_EXECUTION",
    });
    triggered.advanceTo(US_V0_I9_FILING);
    expect(triggered.getLegalContestAuditState().claims[0]).toMatchObject({
      challengedDeterminationId: determination.id,
      prospectiveNonmoneyRelief: true,
    });
  });

  it("keeps filing, admission, relief request, reasons, order, and notice distinct", () => {
    const session = createSession();
    session.issueBoundedRelationshipRejection();
    session.advanceTo(US_V0_I9_FILING);
    expect(session.getLegalContestAuditState()).toMatchObject({ contests: [], rulings: [], operativeOrders: [] });
    session.advanceTo(US_V0_I9_ADMISSION);
    expect(session.getLegalContestAuditState().contests[0]).toMatchObject({ stage: "ADMITTED" });
    session.advanceTo(US_V0_I9_INTERIM_REQUEST);
    expect(session.getLegalContestAuditState()).toMatchObject({
      contests: [{ stage: "INTERIM_RELIEF_REQUESTED" }],
      interimReliefRequests: [{ plaintiffSpecific: true }],
      rulings: [],
    });
    session.advanceTo(US_V0_I9_RULING);
    const state = session.getLegalContestAuditState();
    expect(state.rulings[0]).toMatchObject({ outcome: "GRANTED_SCOPED" });
    expect(state.rulings[0].reasons.length).toBeGreaterThan(0);
    expect(state.operativeOrders[0]).toMatchObject({
      sourceRulingId: state.rulings[0].id,
      plaintiffSpecific: true,
      status: "ACTIVE",
    });
    expect(state.notices).toHaveLength(0);
    session.advanceTo(US_V0_I9_NOTICE);
    expect(session.getLegalContestAuditState().notices[0].orderId).toBe(state.operativeOrders[0].id);
    expect(session.getLegalContestAuditState().administrativeResponses).toHaveLength(0);
  });

  it("does not let the court rewrite program, fiscal, relationship, or material state", () => {
    const session = createSession();
    const control = createSession();
    session.issueBoundedRelationshipRejection();
    session.advanceTo(US_V0_I9_NOTICE);
    control.advanceTo(US_V0_I9_NOTICE);
    expect(session.getAuditState().implementation!.publicFinance).toEqual(control.getAuditState().implementation!.publicFinance);
    expect(session.getAuditState().implementation!.fiscalExecution).toEqual(control.getAuditState().implementation!.fiscalExecution);
    expect(session.getAuditState().implementation!.intergovernmental).toEqual(control.getAuditState().implementation!.intergovernmental);
    expect(session.getAuditState().housing).toEqual(control.getAuditState().housing);
    expect(session.getLegalContestAuditState().operativeOrders[0].directives).toContain(
      "DO_NOT_EXECUTE_CHALLENGED_REDIRECTION_PENDING_LAWFUL_RECONSIDERATION",
    );
  }, 20_000);

  it("keeps receipt, response, appeal, and stay separate", () => {
    const session = createSession();
    session.issueBoundedRelationshipRejection();
    session.advanceTo(US_V0_I9_NOTICE);
    session.respondToJudicialOrder("SEEK_APPELLATE_REVIEW");
    let state = session.getLegalContestAuditState();
    expect(state.administrativeResponses[0]).toMatchObject({ complianceCompleted: false });
    expect(state.appellateRequests).toHaveLength(1);
    expect(state.stayRequests).toHaveLength(0);
    expect(state.operativeOrders[0].status).toBe("ACTIVE");
    session.requestJudicialStay();
    state = session.getLegalContestAuditState();
    expect(state.stayRequests).toHaveLength(1);
    expect(state.stayDecisions).toHaveLength(0);
    session.advanceTo(US_V0_I9_STAY_DECISION);
    expect(session.getLegalContestAuditState().stayDecisions[0]).toMatchObject({ outcome: "DENIED" });
    expect(session.getLegalContestAuditState().operativeOrders[0].status).toBe("ACTIVE");
    session.advanceTo(US_V0_I9_APPELLATE_RULING);
    expect(session.getLegalContestAuditState().appellateRulings[0]).toMatchObject({ outcome: "AFFIRMED" });
  });

  it("allows prospective compliance without fabricating an appeal or material rewind", () => {
    const session = createSession();
    session.issueBoundedRelationshipRejection();
    session.advanceTo(US_V0_I9_NOTICE);
    const housing = structuredClone(session.getAuditState().housing);
    session.respondToJudicialOrder("COMPLY_PROSPECTIVELY");
    expect(session.getLegalContestAuditState()).toMatchObject({
      administrativeResponses: [{ action: "COMPLY_PROSPECTIVELY", complianceCompleted: false }],
      appellateRequests: [],
    });
    expect(session.getAuditState().housing).toEqual(housing);
  });
});
