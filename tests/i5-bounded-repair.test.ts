import { describe, expect, it } from "vitest";

import {
  createIntegratedPartialRuntimeAuditSession,
  createIntegratedPartialRuntimeSession,
  createIntegratedPartialRuntimeSessionFromSave,
  INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION,
} from "../src/app/integrated-session";
import { canonicalConfigurationContent } from "../src/configuration/canonical";
import { loadGovernmentConfiguration } from "../src/configuration/loader";
import { sha256Hex } from "../src/configuration/sha256";
import type { GovernmentConfiguration, LegislativeRuntimeSeed } from "../src/configuration/types";
import { US_V0_STRUCTURAL_CONFIGURATION } from "../src/content/us-v0/configuration";
import { US_V0_I7_RUNTIME_ARTIFACTS } from "../src/content/us-v0/i7";
import {
  US_V0_2027_TERM_BOUNDARY,
  US_V0_2029_TRANSFER,
  US_V0_2033_EXECUTIVE_TERM_END,
  US_V0_OPPOSITION_PRESIDENT_ACTOR_ID,
  US_V0_OPPOSITION_TICKET_ID,
  US_V0_OPPOSITION_VICE_PRESIDENT_ACTOR_ID,
  US_V0_PLAYER_TICKET_ID,
} from "../src/content/us-v0/i5";

const createSession = () => createIntegratedPartialRuntimeSession(
  US_V0_STRUCTURAL_CONFIGURATION,
  US_V0_I7_RUNTIME_ARTIFACTS,
);

const resolutions = (ticketId: string) => US_V0_I7_RUNTIME_ARTIFACTS.populationCohorts.cohorts.map((cohort) => ({
  cohortId: cohort.id,
  candidatePreference: ticketId,
  turnoutDisposition: "HIGH",
  classification: "APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD",
  causeKey: `i5-repair:${ticketId}`,
}));

const auditSession = (ticketId: string, vacantOfficeIds: readonly string[] = []) =>
  createIntegratedPartialRuntimeAuditSession(
    US_V0_STRUCTURAL_CONFIGURATION,
    US_V0_I7_RUNTIME_ARTIFACTS,
    resolutions(ticketId),
    vacantOfficeIds,
  );

const restore = (serialized: string) => createIntegratedPartialRuntimeSessionFromSave(
  serialized,
  US_V0_STRUCTURAL_CONFIGURATION,
  US_V0_I7_RUNTIME_ARTIFACTS,
);

interface MutableRepairSave {
  formatVersion: number;
  legislativeRuntime: {
    activeAssignments: Array<{ officeId: string; actorId: string; effectiveUntil: string | null }>;
  };
  institutional: {
    termCycles: Array<{
      populationSignals: Array<{
        signal: number;
        entries: Array<{ participatingWeight: number }>;
      }>;
    }>;
    selection: {
      certificates: Array<{ officeRole: string; candidateActorId: string }>;
      entitlements: Array<{ officeId: string; entitledActorId: string }>;
    };
    currentAdministration: {
      headActorId: string;
      deputyActorId: string;
      effectiveUntil: string | null;
    };
  };
}

const mutableSave = (serialized: string): MutableRepairSave => JSON.parse(serialized) as MutableRepairSave;

describe("I5 bounded repair", () => {
  it("canonically owns both anonymous opposition candidate actors before election", () => {
    const structure = US_V0_STRUCTURAL_CONFIGURATION.structure;
    const oppositionIds = [
      US_V0_OPPOSITION_PRESIDENT_ACTOR_ID,
      US_V0_OPPOSITION_VICE_PRESIDENT_ACTOR_ID,
    ];
    const session = createSession();
    for (const actorId of oppositionIds) {
      expect(structure.actors.filter((actor) => actor.id === actorId)).toEqual([
        expect.objectContaining({
          id: actorId,
          role: "EXECUTIVE",
          classification: "APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD",
        }),
      ]);
      expect(structure.assignments.some((assignment) => assignment.actorId === actorId)).toBe(false);
      expect(session.getAuditState().legislative.political.actors.some((actor) => actor.actorId === actorId)).toBe(false);
      expect(session.getAuditState().legislative.political.organizations.some((organization) =>
        organization.memberships.some((membership) => membership.actorId === actorId),
      )).toBe(false);
    }
  });

  it("closes opposition certificate, entitlement, assignment, and administration actor references", () => {
    const session = auditSession(US_V0_OPPOSITION_TICKET_ID);
    session.advanceTo(US_V0_2029_TRANSFER);
    const state = session.getAuditState();
    const selection = state.institutional!.selection;
    expect(selection.certificates.filter((record) => record.officeRole === "HEAD")
      .every((record) => record.candidateActorId === US_V0_OPPOSITION_PRESIDENT_ACTOR_ID)).toBe(true);
    expect(selection.certificates.filter((record) => record.officeRole === "DEPUTY")
      .every((record) => record.candidateActorId === US_V0_OPPOSITION_VICE_PRESIDENT_ACTOR_ID)).toBe(true);
    expect(selection.entitlements).toEqual(expect.arrayContaining([
      expect.objectContaining({ officeId: "us.office.president", entitledActorId: US_V0_OPPOSITION_PRESIDENT_ACTOR_ID }),
      expect.objectContaining({ officeId: "us.office.vice-president", entitledActorId: US_V0_OPPOSITION_VICE_PRESIDENT_ACTOR_ID }),
    ]));
    expect(state.legislative.activeAssignments).toEqual(expect.arrayContaining([
      expect.objectContaining({ officeId: "us.office.president", actorId: US_V0_OPPOSITION_PRESIDENT_ACTOR_ID }),
      expect.objectContaining({ officeId: "us.office.vice-president", actorId: US_V0_OPPOSITION_VICE_PRESIDENT_ACTOR_ID }),
    ]));
    expect(state.institutional!.currentAdministration).toMatchObject({
      headActorId: US_V0_OPPOSITION_PRESIDENT_ACTOR_ID,
      deputyActorId: US_V0_OPPOSITION_VICE_PRESIDENT_ACTOR_ID,
    });
  });

  it("rejects an unknown configured candidate actor", () => {
    const temporal = US_V0_STRUCTURAL_CONFIGURATION.integratedRuntime!.temporal!;
    const altered = {
      ...US_V0_STRUCTURAL_CONFIGURATION,
      integratedRuntime: {
        ...US_V0_STRUCTURAL_CONFIGURATION.integratedRuntime!,
        temporal: {
          ...temporal,
          selection: {
            ...temporal.selection,
            tickets: temporal.selection.tickets.map((ticket) => ticket.id === US_V0_OPPOSITION_TICKET_ID
              ? { ...ticket, headCandidate: { ...ticket.headCandidate, actorId: "unknown.actor" } }
              : ticket),
          },
        },
      },
    };
    const reidentified = {
      ...altered,
      identity: {
        ...altered.identity,
        configurationHash: sha256Hex(canonicalConfigurationContent(altered)),
      },
    } as GovernmentConfiguration<LegislativeRuntimeSeed>;
    expect(() => loadGovernmentConfiguration(reidentified)).toThrow(/invalid authority references/i);
  });

  it("rejects tampered certificate, entitlement, assignment, and administration actor chains", () => {
    const session = auditSession(US_V0_OPPOSITION_TICKET_ID);
    session.advanceTo(US_V0_2029_TRANSFER);

    const certificate = mutableSave(session.save());
    certificate.institutional.selection.certificates.find((record) => record.officeRole === "HEAD")!
      .candidateActorId = US_V0_OPPOSITION_VICE_PRESIDENT_ACTOR_ID;
    expect(() => restore(JSON.stringify(certificate))).toThrow(/certificates contradict appointment/i);

    const entitlement = mutableSave(session.save());
    entitlement.institutional.selection.entitlements.find((record) => record.officeId === "us.office.president")!
      .entitledActorId = US_V0_OPPOSITION_VICE_PRESIDENT_ACTOR_ID;
    expect(() => restore(JSON.stringify(entitlement))).toThrow(/entitlements contradict/i);

    const assignment = mutableSave(session.save());
    assignment.legislativeRuntime.activeAssignments.find((record) => record.officeId === "us.office.president")!
      .actorId = US_V0_OPPOSITION_VICE_PRESIDENT_ACTOR_ID;
    expect(() => restore(JSON.stringify(assignment))).toThrow(/active-assignment ownership|active assignments contradict/i);

    const administration = mutableSave(session.save());
    administration.institutional.currentAdministration.headActorId = US_V0_OPPOSITION_VICE_PRESIDENT_ACTOR_ID;
    expect(() => restore(JSON.stringify(administration))).toThrow(/current administration contradicts/i);
  });

  it("freezes one coherent rollover Population signal per state and cycle", () => {
    const session = createIntegratedPartialRuntimeAuditSession(
      US_V0_STRUCTURAL_CONFIGURATION,
      US_V0_I7_RUNTIME_ARTIFACTS,
      [],
      ["us.office.house.0602"],
    );
    session.advanceTo(US_V0_2027_TERM_BOUNDARY);
    const cycle = session.getAuditState().institutional!.termCycles[0];
    const california = cycle.populationSignals.filter((signal) => signal.stateGeographyId === "us.geography.state.06");
    expect(california).toHaveLength(1);
    const cohort = california[0].entries.find(
      (entry) => entry.cohortId === "us.population.cohort.06.nonrenter-exposed",
    )!;
    expect(cohort.canonicalPreference).toBe("UNRESOLVED");
    expect(cohort.readinessClassification).toBe("FALLBACK_SCAFFOLD");
    const californiaResults = cycle.results.filter((result) => result.stateGeographyId === "us.geography.state.06");
    expect(new Set(californiaResults.map((result) => result.populationSignalSnapshotId))).toEqual(
      new Set([california[0].id]),
    );
    expect(new Set(californiaResults.map((result) => result.populationSignal))).toEqual(
      new Set([california[0].signal]),
    );
    expect(californiaResults.find((result) => result.officeId === "us.office.house.0601")?.outcome).toBe("RETAIN");
    expect(californiaResults.find((result) => result.officeId === "us.office.house.0602")?.outcome).toBe("REPLACE");
    expect(californiaResults[0].deterministicIncumbencySignal)
      .not.toBe(californiaResults[1].deterministicIncumbencySignal);
    expect(session.getAuditState().population.cohorts.some(
      (populationCohort) => populationCohort.residenceGeographyId.includes("cd119"),
    )).toBe(false);
  });

  it("keeps resolved Population causal while rejecting a tampered rollover snapshot", () => {
    const aligned = auditSession(US_V0_PLAYER_TICKET_ID);
    const opposition = auditSession(US_V0_OPPOSITION_TICKET_ID);
    aligned.advanceTo(US_V0_2027_TERM_BOUNDARY);
    opposition.advanceTo(US_V0_2027_TERM_BOUNDARY);
    const left = aligned.getAuditState().institutional!.termCycles[0];
    const right = opposition.getAuditState().institutional!.termCycles[0];
    expect(left.populationSignals.every((signal) =>
      signal.entries.every((entry) => entry.readinessClassification === "POPULATION_STATE"),
    )).toBe(true);
    expect(left.results.some((result, index) => result.outcome !== right.results[index].outcome)).toBe(true);

    const tampered = mutableSave(aligned.save());
    tampered.institutional.termCycles[0].populationSignals[0].signal += 0.01;
    expect(() => restore(JSON.stringify(tampered))).toThrow(/rollover Population signal/i);
  });

  it.each([US_V0_PLAYER_TICKET_ID, US_V0_OPPOSITION_TICKET_ID])(
    "gives %s successors the configured 2029–2033 executive interval",
    (ticketId) => {
      const session = auditSession(ticketId);
      session.advanceTo(US_V0_2029_TRANSFER);
      const state = session.getAuditState();
      const executiveAssignments = state.legislative.activeAssignments.filter((assignment) =>
        ["us.office.president", "us.office.vice-president"].includes(assignment.officeId));
      expect(executiveAssignments).toHaveLength(2);
      expect(executiveAssignments.every((assignment) =>
        assignment.effectiveFrom === US_V0_2029_TRANSFER &&
        assignment.effectiveUntil === US_V0_2033_EXECUTIVE_TERM_END)).toBe(true);
      expect(state.institutional!.currentAdministration).toMatchObject({
        effectiveFrom: US_V0_2029_TRANSFER,
        effectiveUntil: US_V0_2033_EXECUTIVE_TERM_END,
      });
      expect(session.getPublicInstitutionalStatus().currentExecutiveAssignments.every(
        (assignment) => assignment.effectiveUntil === US_V0_2033_EXECUTIVE_TERM_END,
      )).toBe(true);
      expect(US_V0_STRUCTURAL_CONFIGURATION.integratedRuntime!.temporal!.boundaries.some(
        (boundary) => boundary.at === US_V0_2033_EXECUTIVE_TERM_END,
      )).toBe(false);
      expect(session.getControlBindingAudit().status).toBe(
        ticketId === US_V0_PLAYER_TICKET_ID ? "ACTIVE" : "ENDED",
      );
    },
    15_000,
  );

  it("persists the repair state and rejects null or wrong executive interval authority", () => {
    const session = auditSession(US_V0_PLAYER_TICKET_ID);
    session.advanceTo(US_V0_2029_TRANSFER);
    expect(JSON.parse(session.save())).toMatchObject({ formatVersion: INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION });
    expect(restore(session.save()).getAuditState()).toEqual(session.getAuditState());

    for (const officeId of ["us.office.president", "us.office.vice-president"]) {
      const nullAssignment = mutableSave(session.save());
      nullAssignment.legislativeRuntime.activeAssignments.find(
        (assignment) => assignment.officeId === officeId,
      )!.effectiveUntil = null;
      expect(() => restore(JSON.stringify(nullAssignment))).toThrow(/active assignments contradict/i);

      const wrongAssignment = mutableSave(session.save());
      wrongAssignment.legislativeRuntime.activeAssignments.find(
        (assignment) => assignment.officeId === officeId,
      )!.effectiveUntil = "2033-01-21T12:00:00-05:00";
      expect(() => restore(JSON.stringify(wrongAssignment))).toThrow(/active assignments contradict/i);
    }

    for (const effectiveUntil of [null, "2033-01-21T12:00:00-05:00"]) {
      const alteredAdministration = mutableSave(session.save());
      alteredAdministration.institutional.currentAdministration.effectiveUntil = effectiveUntil;
      expect(() => restore(JSON.stringify(alteredAdministration))).toThrow(/administration history contradicts/i);
    }
  });
});
