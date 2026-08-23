import { describe, expect, it } from "vitest";

import {
  createIntegratedPartialRuntimeAuditSession,
  createIntegratedPartialRuntimeSession,
} from "../src/app/integrated-session";
import { US_V0_STRUCTURAL_CONFIGURATION } from "../src/content/us-v0/configuration";
import { US_V0_I4_RUNTIME_ARTIFACTS } from "../src/content/us-v0/i4";
import {
  US_V0_2027_TERM_BOUNDARY,
  US_V0_2029_TERM_BOUNDARY,
  US_V0_OPPOSITION_TICKET_ID,
  US_V0_PLAYER_TICKET_ID,
} from "../src/content/us-v0/i5";

const createSession = () => createIntegratedPartialRuntimeSession(
  US_V0_STRUCTURAL_CONFIGURATION,
  US_V0_I4_RUNTIME_ARTIFACTS,
);

const assignmentByOffice = (session: ReturnType<typeof createSession>) => new Map(
  session.getAuditState().legislative.activeAssignments.map((assignment) => [assignment.officeId, assignment]),
);

const resolutions = (ticketId: string) => US_V0_I4_RUNTIME_ARTIFACTS.populationCohorts.cohorts.map((cohort) => ({
  cohortId: cohort.id,
  candidatePreference: ticketId,
  turnoutDisposition: "HIGH",
  classification: "APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD",
  causeKey: `i5-counterfactual:${ticketId}`,
}));

describe("I5 canonical calendar and congressional term transitions", () => {
  it("starts at the configured instant, orders same-time phases, and processes fixed boundaries exactly once", () => {
    const session = createSession();
    expect(session.getPublicInstitutionalStatus().currentInstant).toBe("2026-08-22T00:00:00-04:00");
    expect(() => session.advanceTo("2026-08-21T23:59:59-04:00")).toThrow(/cannot move backwards/i);
    session.beginSponsorSearch();
    session.advanceTo(US_V0_2027_TERM_BOUNDARY);
    const first = session.getAuditState();
    const atBoundary = first.institutional!.occurrences.filter(
      (occurrence) => occurrence.occurredAt === US_V0_2027_TERM_BOUNDARY,
    );
    expect(atBoundary.map((occurrence) => occurrence.kind)).toEqual([
      "TERM_RESULT_SNAPSHOT",
      "PROCEDURE_EXPIRY",
      "OUTGOING_ASSIGNMENT_END",
      "SUCCESSOR_ASSIGNMENT_BEGIN",
      "AFFILIATION_REBUILD",
      "MEMBERSHIP_RECOMPUTE",
    ]);
    expect(first.legislative.procedure.stage).toBe("EXPIRED_AT_END_OF_CONGRESS");
    session.advanceTo(US_V0_2027_TERM_BOUNDARY);
    expect(session.getAuditState()).toEqual(first);
  }, 15_000);

  it("turns every House office and only the configured second Senate class in 2027", () => {
    const session = createSession();
    const before = assignmentByOffice(session);
    const beforeActors = new Map(session.getAuditState().legislative.political.actors.map(
      (actor) => [actor.actorId, actor],
    ));
    session.advanceTo(US_V0_2027_TERM_BOUNDARY);
    const after = assignmentByOffice(session);
    const state = session.getAuditState();
    const cycle = state.institutional!.termCycles[0];
    expect(cycle.status).toBe("COMPLETE");
    expect(cycle.results).toHaveLength(468);

    const house = US_V0_STRUCTURAL_CONFIGURATION.structure.offices.filter(
      (office) => office.id.startsWith("us.office.house."),
    );
    expect(house).toHaveLength(435);
    for (const office of house) expect(after.get(office.id)?.id).not.toBe(before.get(office.id)?.id);

    const senate = US_V0_STRUCTURAL_CONFIGURATION.structure.offices.filter(
      (office) => office.id.startsWith("us.office.senate."),
    );
    const secondClass = senate.filter((office) => office.term.ordinaryBoundaryAt === US_V0_2027_TERM_BOUNDARY);
    const firstClass = senate.filter((office) => office.term.ordinaryBoundaryAt.includes("2031-01-03"));
    const thirdClass = senate.filter((office) => office.term.ordinaryBoundaryAt === US_V0_2029_TERM_BOUNDARY);
    expect(secondClass).toHaveLength(33);
    for (const office of secondClass) expect(after.get(office.id)?.id).not.toBe(before.get(office.id)?.id);
    for (const office of [...firstClass, ...thirdClass]) expect(after.get(office.id)).toEqual(before.get(office.id));

    for (const result of cycle.results) {
      const incoming = after.get(result.officeId)!;
      expect(incoming.id).toBe(result.successorAssignmentId);
      expect(incoming.id).not.toBe(result.outgoingAssignmentId);
      if (result.outcome === "RETAIN") {
        expect(incoming.actorId).toBe(result.outgoingActorId);
        expect(state.legislative.political.actors.find((actor) => actor.actorId === incoming.actorId))
          .toEqual(beforeActors.get(incoming.actorId));
      }
      else {
        expect(incoming.actorId).not.toBe(result.outgoingActorId);
        const actor = state.legislative.political.actors.find((candidate) => candidate.actorId === incoming.actorId)!;
        expect(actor.negotiationMemory).toEqual([]);
        expect(actor.commitmentIds).toEqual([]);
        expect(actor.lastDecision).toBeNull();
        expect(state.legislative.activeAssignments.some(
          (assignment) => assignment.actorId === result.outgoingActorId,
        )).toBe(false);
        expect(state.legislative.political.actors.some(
          (actorState) => actorState.actorId === result.outgoingActorId,
        )).toBe(false);
      }
    }
    expect(cycle.results.some((result) => result.outcome === "RETAIN")).toBe(true);
    expect(cycle.results.some((result) => result.outcome === "REPLACE")).toBe(true);
  });

  it("rebuilds organization memberships, quotas, leaders, and whips from new active assignments", () => {
    const session = createSession();
    session.advanceTo(US_V0_2027_TERM_BOUNDARY);
    const legislative = session.getAuditState().legislative;
    const political = legislative.political;
    for (const organization of political.organizations) {
      const configured = US_V0_STRUCTURAL_CONFIGURATION.runtimeSeed!.organizations.find(
        (candidate) => candidate.id === organization.id,
      )!;
      for (const division of organization.divisions) {
        const members = organization.memberships.filter((membership) => membership.chamberId === division.chamberId)
          .sort((left, right) => left.stableRank.localeCompare(right.stableRank));
        expect(members).toHaveLength(configured.chamberQuotas[division.chamberId]);
        expect(division.leaderMembershipId).toBe(members[0].id);
        expect(division.whipMembershipId).toBe(members[1].id);
        for (const membership of members) {
          const assignment = legislative.activeAssignments.find(
            (candidate) => candidate.id === membership.assignmentId,
          );
          expect(assignment).toMatchObject({ officeId: membership.officeId, actorId: membership.actorId });
        }
      }
    }
  }, 15_000);

  it("fills an expiring vacancy and preserves a non-expiring vacancy", () => {
    const senate = US_V0_STRUCTURAL_CONFIGURATION.structure.offices.filter(
      (office) => office.id.startsWith("us.office.senate."),
    );
    const expiring = senate.find((office) => office.term.ordinaryBoundaryAt === US_V0_2027_TERM_BOUNDARY)!;
    const nonExpiring = senate.find((office) => office.term.ordinaryBoundaryAt.includes("2031-01-03"))!;
    const session = createIntegratedPartialRuntimeAuditSession(
      US_V0_STRUCTURAL_CONFIGURATION,
      US_V0_I4_RUNTIME_ARTIFACTS,
      [],
      [expiring.id, nonExpiring.id],
    );
    session.advanceTo(US_V0_2027_TERM_BOUNDARY);
    const assignments = assignmentByOffice(session);
    expect(assignments.has(expiring.id)).toBe(true);
    expect(assignments.has(nonExpiring.id)).toBe(false);
    expect(session.getAuditState().institutional!.termCycles[0].results.find(
      (result) => result.officeId === expiring.id,
    )?.outcome).toBe("REPLACE");
  }, 15_000);

  it("turns every House office again and only the third Senate class in 2029", () => {
    const session = createSession();
    session.advanceTo(US_V0_2027_TERM_BOUNDARY);
    session.startNewCongressAgenda();
    session.beginSponsorSearch();
    const before = assignmentByOffice(session);
    session.advanceTo(US_V0_2029_TERM_BOUNDARY);
    const after = assignmentByOffice(session);
    const state = session.getAuditState();
    expect(state.institutional!.currentTermLabel).toBe("121st");
    expect(state.legislative.procedure.stage).toBe("EXPIRED_AT_END_OF_CONGRESS");
    const house = US_V0_STRUCTURAL_CONFIGURATION.structure.offices.filter(
      (office) => office.id.startsWith("us.office.house."),
    );
    const senate = US_V0_STRUCTURAL_CONFIGURATION.structure.offices.filter(
      (office) => office.id.startsWith("us.office.senate."),
    );
    for (const office of house) expect(after.get(office.id)?.id).not.toBe(before.get(office.id)?.id);
    for (const office of senate.filter((candidate) => candidate.term.ordinaryBoundaryAt === US_V0_2029_TERM_BOUNDARY)) {
      expect(after.get(office.id)?.id).not.toBe(before.get(office.id)?.id);
    }
    for (const office of senate.filter((candidate) => candidate.term.ordinaryBoundaryAt !== US_V0_2029_TERM_BOUNDARY)) {
      expect(after.get(office.id)).toEqual(before.get(office.id));
    }
    expect(senate.filter((office) => office.term.ordinaryBoundaryAt.includes("2031-01-03"))).not.toHaveLength(0);
  }, 15_000);

  it("keeps expired procedure history and requires a fresh proposal identity in the new term", () => {
    const session = createSession();
    session.beginSponsorSearch();
    const priorId = session.getAuditState().legislative.agenda.proposalId;
    session.advanceTo(US_V0_2027_TERM_BOUNDARY);
    expect(() => session.beginSponsorSearch()).toThrow(/sponsor search/i);
    session.startNewCongressAgenda();
    const next = session.getAuditState().legislative;
    expect(next.agenda.proposalId).not.toBe(priorId);
    expect(next.procedure.stage).toBe("DRAFT_AGENDA");
    expect(next.procedureHistory).toHaveLength(1);
    expect(next.procedureHistory[0]).toMatchObject({
      agenda: { proposalId: priorId },
      procedure: { stage: "EXPIRED_AT_END_OF_CONGRESS" },
    });
  });

  it("makes weighted Population political state causally capable of changing rollover results", () => {
    const aligned = createIntegratedPartialRuntimeAuditSession(
      US_V0_STRUCTURAL_CONFIGURATION,
      US_V0_I4_RUNTIME_ARTIFACTS,
      resolutions(US_V0_PLAYER_TICKET_ID),
    );
    const opposition = createIntegratedPartialRuntimeAuditSession(
      US_V0_STRUCTURAL_CONFIGURATION,
      US_V0_I4_RUNTIME_ARTIFACTS,
      resolutions(US_V0_OPPOSITION_TICKET_ID),
    );
    aligned.advanceTo(US_V0_2027_TERM_BOUNDARY);
    opposition.advanceTo(US_V0_2027_TERM_BOUNDARY);
    const left = aligned.getAuditState().institutional!.termCycles[0].results;
    const right = opposition.getAuditState().institutional!.termCycles[0].results;
    expect(left.some((result, index) => result.outcome !== right[index].outcome)).toBe(true);
    expect(left.some((result, index) => result.causalInputHash !== right[index].causalInputHash)).toBe(true);
  }, 15_000);
});
