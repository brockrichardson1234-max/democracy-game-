import { describe, expect, it } from "vitest";

import {
  createIntegratedPartialRuntimeAuditSession,
  createIntegratedPartialRuntimeSession,
} from "../src/app/integrated-session";
import { US_V0_STRUCTURAL_CONFIGURATION } from "../src/content/us-v0/configuration";
import { US_V0_I7_RUNTIME_ARTIFACTS } from "../src/content/us-v0/i7";
import {
  US_V0_2028_ATTESTATION,
  US_V0_2028_DELEGATE_MEETING,
  US_V0_2028_POPULAR_SELECTION,
  US_V0_2029_DECLARATION,
  US_V0_2029_TRANSFER,
  US_V0_I5_ELECTION_SCAFFOLD_VERSION,
  US_V0_OPPOSITION_TICKET_ID,
  US_V0_PLAYER_TICKET_ID,
} from "../src/content/us-v0/i5";
import {
  declareCountableCertificates,
  type CountableCertificateRecord,
} from "../src/sim/institutional-runtime";

const createSession = () => createIntegratedPartialRuntimeSession(
  US_V0_STRUCTURAL_CONFIGURATION,
  US_V0_I7_RUNTIME_ARTIFACTS,
);

const allResolutions = (ticketId: string) => US_V0_I7_RUNTIME_ARTIFACTS.populationCohorts.cohorts.map((cohort) => ({
  cohortId: cohort.id,
  candidatePreference: ticketId,
  turnoutDisposition: "HIGH",
  classification: "APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD",
  causeKey: `i5-election:${ticketId}`,
}));

const auditSession = (ticketId: string) => createIntegratedPartialRuntimeAuditSession(
  US_V0_STRUCTURAL_CONFIGURATION,
  US_V0_I7_RUNTIME_ARTIFACTS,
  allResolutions(ticketId),
);

describe("I5 Population-backed selection, declaration, and succession", () => {
  it("configures only anonymous tickets with distinct candidate, actor, office, and assignment identities", () => {
    const selection = US_V0_STRUCTURAL_CONFIGURATION.integratedRuntime!.temporal!.selection;
    expect(selection.tickets).toHaveLength(2);
    expect(selection.tickets.every((ticket) => /anonymous/i.test(ticket.label))).toBe(true);
    expect(JSON.stringify(selection.tickets)).not.toMatch(/party|poll|2024 vote/i);
    for (const ticket of selection.tickets) {
      expect(ticket.headCandidate.id).not.toBe(ticket.headCandidate.actorId);
      expect(ticket.deputyCandidate.id).not.toBe(ticket.deputyCandidate.actorId);
      expect(ticket.headCandidate.actorId).not.toBe(selection.transfer.headOfficeId);
      expect(ticket.deputyCandidate.actorId).not.toBe(selection.transfer.deputyOfficeId);
    }
  });

  it("freezes exactly 51 state/DC snapshots and weighted popular results without mutating Population", () => {
    const session = createSession();
    session.advanceTo("2028-11-07T19:59:59-05:00");
    const populationBefore = session.getAuditState().population;
    expect(session.getPublicInstitutionalStatus().popularResults).toEqual([]);
    session.advanceTo(US_V0_2028_POPULAR_SELECTION);
    const state = session.getAuditState();
    const selection = state.institutional!.selection;
    expect(selection.stage).toBe("POPULAR_RESOLVED");
    expect(selection.snapshots).toHaveLength(51);
    expect(selection.popularResults).toHaveLength(51);
    expect(selection.snapshots.flatMap((snapshot) => snapshot.entries)).toHaveLength(populationBefore.cohorts.length);
    expect(state.population).toEqual(populationBefore);
    expect(selection.snapshots.every((snapshot) => snapshot.entries.every(
      (entry) => entry.residenceGeographyId === snapshot.geographyId,
    ))).toBe(true);
    expect(selection.snapshots.every((snapshot) => snapshot.geographyId.startsWith("us.geography.state."))).toBe(true);
    expect(selection.snapshots.some((snapshot) => snapshot.geographyId.includes("cd119"))).toBe(false);
    expect(selection.snapshots.flatMap((snapshot) => snapshot.entries).every(
      (entry) => ["FALLBACK_SCAFFOLD", "POPULATION_STATE"].includes(entry.readinessClassification),
    )).toBe(true);
    expect(selection.snapshots.flatMap((snapshot) => snapshot.entries)
      .some((entry) => entry.readinessClassification === "POPULATION_STATE")).toBe(true);
    expect(US_V0_STRUCTURAL_CONFIGURATION.integratedRuntime!.temporal!.selection.populationScaffold.version)
      .toBe(US_V0_I5_ELECTION_SCAFFOLD_VERSION);
    for (const result of selection.popularResults) {
      const ballots = selection.ballots.filter((ballot) => result.ballotIds.includes(ballot.id));
      expect(ballots.reduce((total, ballot) => total + ballot.eligibleProxyWeight, 0)).toBe(result.totalEligibleProxyWeight);
      expect(ballots.reduce((total, ballot) => total + ballot.participatingWeight, 0)).toBe(result.totalParticipatingWeight);
      expect(result.totalParticipatingWeight).toBeLessThan(result.totalEligibleProxyWeight);
    }
  });

  it("uses pre-resolved Population state and can flip the same state result without changing allocation", () => {
    const geographyId = "us.geography.state.06";
    const aligned = auditSession(US_V0_PLAYER_TICKET_ID);
    const opposition = auditSession(US_V0_OPPOSITION_TICKET_ID);
    aligned.advanceTo(US_V0_2028_POPULAR_SELECTION);
    opposition.advanceTo(US_V0_2028_POPULAR_SELECTION);
    const left = aligned.getAuditState().institutional!.selection.popularResults.find(
      (result) => result.geographyId === geographyId,
    )!;
    const right = opposition.getAuditState().institutional!.selection.popularResults.find(
      (result) => result.geographyId === geographyId,
    )!;
    expect(left.winnerTicketId).toBe(US_V0_PLAYER_TICKET_ID);
    expect(right.winnerTicketId).toBe(US_V0_OPPOSITION_TICKET_ID);
    expect(aligned.getAuditState().electoralTopology).toEqual(opposition.getAuditState().electoralTopology);
    expect(aligned.getAuditState().institutional!.selection.snapshots.find(
      (snapshot) => snapshot.geographyId === geographyId,
    )!.entries.every((entry) => entry.readinessClassification === "POPULATION_STATE")).toBe(true);
  });

  it("freezes election-time inputs so later lawful Population refinement cannot rewrite the result", () => {
    const session = createSession();
    session.advanceTo(US_V0_2028_POPULAR_SELECTION);
    const frozen = session.getAuditState().institutional!.selection;
    const parent = session.getAuditState().population.cohorts[0];
    session.refinePopulation({
      parentCohortId: parent.id,
      targetedWeight: 23,
      causeKey: "post-election-snapshot-refinement",
      association: { kind: "INFORMATION", referenceId: "post-election-information" },
    });
    expect(session.getAuditState().institutional!.selection).toEqual(frozen);
  });

  it("keeps popular result, attestation, appointment, and delegate action distinct", () => {
    const session = createSession();
    session.advanceTo(US_V0_2028_POPULAR_SELECTION);
    expect(session.getAuditState().institutional!.selection.attestations).toEqual([]);
    expect(session.getAuditState().institutional!.selection.appointments).toEqual([]);
    session.advanceTo(US_V0_2028_ATTESTATION);
    let selection = session.getAuditState().institutional!.selection;
    expect(selection.stage).toBe("ATTESTED_AND_APPOINTED");
    expect(selection.attestations).toHaveLength(51);
    expect(selection.appointments.reduce((total, appointment) => total + appointment.electorCount, 0)).toBe(538);
    expect(selection.certificates).toEqual([]);
    for (const attestation of selection.attestations) {
      const result = selection.popularResults.find((candidate) => candidate.id === attestation.resultId);
      expect(result).toMatchObject({ geographyId: attestation.geographyId, winnerTicketId: attestation.winnerTicketId });
    }
    session.advanceTo(US_V0_2028_DELEGATE_MEETING);
    selection = session.getAuditState().institutional!.selection;
    expect(selection.stage).toBe("DELEGATES_ACTED");
    expect(selection.certificates.filter((certificate) => certificate.officeRole === "HEAD")
      .reduce((total, certificate) => total + certificate.voteCount, 0)).toBe(538);
    expect(selection.certificates.filter((certificate) => certificate.officeRole === "DEPUTY")
      .reduce((total, certificate) => total + certificate.voteCount, 0)).toBe(538);
    expect(selection.certificates.every((certificate) => selection.appointments.some(
      (appointment) => appointment.id === certificate.appointmentId,
    ))).toBe(true);
  });

  it("preserves the accepted compressed split-unit topology without district Population", () => {
    const session = createSession();
    session.advanceTo(US_V0_2028_ATTESTATION);
    const { appointments } = session.getAuditState().institutional!.selection;
    const topology = session.getAuditState().electoralTopology;
    const split = topology.allocations.filter((allocation) => allocation.method === "DISTRICT_AND_AT_LARGE");
    expect(split.map((allocation) => allocation.units.map((unit) => unit.electorCount))).toEqual([
      [2, 1, 1],
      [2, 1, 1, 1],
    ]);
    for (const allocation of split) {
      const stateResultIds = new Set(appointments.filter((appointment) => appointment.allocationId === allocation.id)
        .map((appointment) => appointment.sourceResultId));
      expect(stateResultIds.size).toBe(1);
    }
    expect(session.getAuditState().population.cohorts.some(
      (cohort) => cohort.residenceGeographyId.includes("cd119"),
    )).toBe(false);
  });

  it("counts actual certificates under the newly active term and creates entitlement without early authority", () => {
    const session = createSession();
    const outgoing = session.getPublicInstitutionalStatus().currentExecutiveAssignments;
    session.advanceTo(US_V0_2029_DECLARATION);
    const state = session.getAuditState();
    const selection = state.institutional!.selection;
    expect(selection.stage).toBe("DECLARED");
    expect(selection.declaration).toMatchObject({
      declaredAt: US_V0_2029_DECLARATION,
      countingTermLabel: "121st",
      headDenominator: 538,
      deputyDenominator: 538,
      requiredMajority: 270,
    });
    const activeLegislativeIds = state.legislative.activeAssignments.filter((assignment) =>
      US_V0_STRUCTURAL_CONFIGURATION.structure.offices.some(
        (office) => office.id === assignment.officeId && office.kind === "LEGISLATIVE_MEMBER",
      )).map((assignment) => assignment.id).sort();
    expect(selection.declaration!.countingAssignmentIds).toEqual(activeLegislativeIds);
    expect(selection.entitlements).toHaveLength(2);
    expect(selection.entitlements.every(
      (entitlement) => entitlement.sourceDeclarationId === selection.declaration!.id &&
        entitlement.scheduledTransferAt === US_V0_2029_TRANSFER,
    )).toBe(true);
    expect(session.getPublicInstitutionalStatus().currentExecutiveAssignments).toEqual(outgoing);
    expect(session.getControlBindingAudit().status).toBe("ACTIVE");
  });

  it("derives strict-majority arithmetic from a nonstandard countable denominator", () => {
    const certificates: CountableCertificateRecord[] = ([
      ["HEAD", "a", 4], ["HEAD", "b", 3], ["DEPUTY", "c", 4], ["DEPUTY", "d", 3],
    ] as const).map(([officeRole, candidateActorId, voteCount], index) => ({
      id: `certificate-${index}`,
      appointmentId: `appointment-${index}`,
      allocationUnitId: `unit-${index}`,
      officeRole,
      candidateActorId,
      ticketId: index % 2 === 0 ? "ticket-a" : "ticket-b",
      voteCount,
      generatedAt: "2000-01-01T00:00:00Z",
    }));
    expect(declareCountableCertificates(certificates)).toMatchObject({
      headDenominator: 7,
      deputyDenominator: 7,
      requiredMajority: 4,
      winningHeadActorId: "a",
      winningDeputyActorId: "c",
    });
  });

  it("transfers an opposition victory into new assignments and administration with no player binding", () => {
    const session = auditSession(US_V0_OPPOSITION_TICKET_ID);
    const before = session.getAuditState();
    const oldBinding = session.getControlBindingAudit();
    session.advanceTo(US_V0_2029_TRANSFER);
    const after = session.getAuditState();
    expect(after.institutional!.selection.declaration!.winningTicketId).toBe(US_V0_OPPOSITION_TICKET_ID);
    expect(after.institutional!.currentAdministration.id).not.toBe(before.institutional!.currentAdministration.id);
    expect(after.institutional!.currentAdministration.headActorId).not.toBe(before.institutional!.currentAdministration.headActorId);
    expect(session.getControlBindingAudit()).toMatchObject({ status: "ENDED", endReason: "TERM_ENDED" });
    expect(session.getControlBindingHistoryAudit()).toEqual([{
      ...oldBinding,
      status: "ENDED",
      endedAt: US_V0_2029_TRANSFER,
      endReason: "TERM_ENDED",
    }]);
    expect(() => session.startNewCongressAgenda()).toThrow(/No active ControlBinding/i);
    expect(() => session.beginSponsorSearch()).toThrow(/No active ControlBinding/i);
  });

  it("gives a reelected player-aligned administration new assignments, administration, and binding", () => {
    const session = auditSession(US_V0_PLAYER_TICKET_ID);
    const before = session.getAuditState();
    const oldBinding = session.getControlBindingAudit();
    session.advanceTo(US_V0_2029_TRANSFER);
    const after = session.getAuditState();
    expect(after.institutional!.selection.declaration!.winningTicketId).toBe(US_V0_PLAYER_TICKET_ID);
    expect(after.institutional!.currentAdministration.id).not.toBe(before.institutional!.currentAdministration.id);
    expect(after.institutional!.currentAdministration.headActorId).toBe(before.institutional!.currentAdministration.headActorId);
    const beforeExecutive = before.legislative.activeAssignments.filter((assignment) =>
      ["us.office.president", "us.office.vice-president"].includes(assignment.officeId));
    const afterExecutive = after.legislative.activeAssignments.filter((assignment) =>
      ["us.office.president", "us.office.vice-president"].includes(assignment.officeId));
    expect(afterExecutive.map((assignment) => assignment.id)).not.toEqual(beforeExecutive.map((assignment) => assignment.id));
    expect(afterExecutive.map((assignment) => assignment.actorId)).toEqual(beforeExecutive.map((assignment) => assignment.actorId));
    expect(session.getControlBindingAudit()).toMatchObject({
      status: "ACTIVE",
      boundOfficeholderActorId: after.institutional!.currentAdministration.headActorId,
    });
    expect(session.getControlBindingAudit().id).not.toBe(oldBinding.id);
    expect(session.getControlBindingHistoryAudit()).toHaveLength(1);

    session.startNewCongressAgenda();
    session.beginSponsorSearch();
    const actor = session.getAuditState().legislative.political.actors[0];
    session.negotiateWithActor(actor.actorId, {
      objective: "SUPPORT",
      terms: { proof: "new-administration" },
      conditions: ["bounded proof"],
    });
    const memory = session.getAuditState().legislative.political.actors.find(
      (candidate) => candidate.actorId === actor.actorId,
    )!.negotiationMemory.at(-1)!;
    expect(memory.counterpartyId).toBe(after.institutional!.currentAdministration.id);
  });

  it("preserves canonical I1-I4 state across executive transfer", () => {
    const session = auditSession(US_V0_PLAYER_TICKET_ID);
    session.advanceTo(US_V0_2029_DECLARATION);
    const before = session.getAuditState();
    session.advanceTo(US_V0_2029_TRANSFER);
    const after = session.getAuditState();
    expect(after.geography).toEqual(before.geography);
    expect(after.population).toEqual(before.population);
    expect(after.electoralTopology).toEqual(before.electoralTopology);
    expect(after.artifactBindings).toEqual(before.artifactBindings);
    expect(after.legislative.enactedLegalSources).toEqual(before.legislative.enactedLegalSources);
    expect(after.legislative.procedureHistory).toEqual(before.legislative.procedureHistory);
  });

  it("lets Population state flip the electoral winner without a winner override", () => {
    const aligned = auditSession(US_V0_PLAYER_TICKET_ID);
    const opposition = auditSession(US_V0_OPPOSITION_TICKET_ID);
    aligned.advanceTo(US_V0_2029_DECLARATION);
    opposition.advanceTo(US_V0_2029_DECLARATION);
    expect(aligned.getAuditState().institutional!.selection.declaration!.winningTicketId).toBe(US_V0_PLAYER_TICKET_ID);
    expect(opposition.getAuditState().institutional!.selection.declaration!.winningTicketId).toBe(US_V0_OPPOSITION_TICKET_ID);
    expect(aligned.getAuditState().electoralTopology).toEqual(opposition.getAuditState().electoralTopology);
  });

  it("uses elector records when national popular plurality and electoral winner diverge", () => {
    const oppositionGeographies = new Set([
      "us.geography.state.04", "us.geography.state.12", "us.geography.state.13", "us.geography.state.26",
      "us.geography.state.29", "us.geography.state.36", "us.geography.state.37", "us.geography.state.39",
      "us.geography.state.42", "us.geography.state.47", "us.geography.state.48", "us.geography.state.51",
      "us.geography.state.53",
    ]);
    const resolutions = US_V0_I7_RUNTIME_ARTIFACTS.populationCohorts.cohorts.map((cohort) => ({
      cohortId: cohort.id,
      candidatePreference: oppositionGeographies.has(cohort.residenceGeographyId)
        ? US_V0_OPPOSITION_TICKET_ID
        : US_V0_PLAYER_TICKET_ID,
      turnoutDisposition: "HIGH",
      classification: "APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD",
      causeKey: "i5-national-electoral-divergence",
    }));
    const session = createIntegratedPartialRuntimeAuditSession(
      US_V0_STRUCTURAL_CONFIGURATION,
      US_V0_I7_RUNTIME_ARTIFACTS,
      resolutions,
    );
    session.advanceTo(US_V0_2029_DECLARATION);
    const selection = session.getAuditState().institutional!.selection;
    const national = selection.popularResults.reduce((totals, result) => ({
      player: totals.player + result.ticketVoteWeights[US_V0_PLAYER_TICKET_ID],
      opposition: totals.opposition + result.ticketVoteWeights[US_V0_OPPOSITION_TICKET_ID],
    }), { player: 0, opposition: 0 });
    expect(national.opposition).toBeGreaterThan(national.player);
    expect(selection.declaration!.winningTicketId).toBe(US_V0_PLAYER_TICKET_ID);
    expect(selection.declaration!.headTallies[
      US_V0_STRUCTURAL_CONFIGURATION.integratedRuntime!.temporal!.selection.tickets[0].headCandidate.actorId
    ]).toBeGreaterThanOrEqual(selection.declaration!.requiredMajority);
  });
});
