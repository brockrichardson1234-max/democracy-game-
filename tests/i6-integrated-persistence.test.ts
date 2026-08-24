import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";

import {
  createIntegratedPartialRuntimeAuditSession,
  createIntegratedPartialRuntimeSession,
  createIntegratedPartialRuntimeSessionFromSave,
  INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION,
  type IntegratedPartialRuntimeSession,
} from "../src/app/integrated-session";
import { US_V0_STRUCTURAL_CONFIGURATION } from "../src/content/us-v0/configuration";
import { US_V0_LEGISLATIVE_SEED } from "../src/content/us-v0/configuration";
import { canonicalConfigurationContent } from "../src/configuration/canonical";
import type { GovernmentConfiguration, LegislativeRuntimeSeed } from "../src/configuration/types";
import { US_V0_I6_RUNTIME_ARTIFACTS } from "../src/content/us-v0/i6";
import {
  US_V0_OPPOSITION_TICKET_ID,
  US_V0_PLAYER_TICKET_ID,
} from "../src/content/us-v0/i5";
import {
  US_HOUSE_CHAMBER_ID,
  US_INCUMBENT_PRESIDENT_ACTOR_ID,
  US_PRESIDENT_OFFICE_ID,
  US_SENATE_CHAMBER_ID,
} from "../src/content/us-v0/topology";

const supportiveUnhashed: GovernmentConfiguration<LegislativeRuntimeSeed> = {
  ...US_V0_STRUCTURAL_CONFIGURATION,
  identity: {
    ...US_V0_STRUCTURAL_CONFIGURATION.identity,
    configurationVersion: "0.6.0-i6-supportive-test",
    scenarioVersion: "0.6.0-i6-supportive-test",
    configurationHash: "0".repeat(64),
  },
  runtimeSeed: {
    ...US_V0_LEGISLATIVE_SEED,
    decision: { ...US_V0_LEGISLATIVE_SEED.decision, reservationDistance: 10 },
  },
};
const supportiveConfiguration: GovernmentConfiguration<LegislativeRuntimeSeed> = {
  ...supportiveUnhashed,
  identity: {
    ...supportiveUnhashed.identity,
    configurationHash: createHash("sha256").update(canonicalConfigurationContent(supportiveUnhashed)).digest("hex"),
  },
};

const createSession = (configuration = US_V0_STRUCTURAL_CONFIGURATION) => createIntegratedPartialRuntimeSession(
  configuration,
  US_V0_I6_RUNTIME_ARTIFACTS,
);

const allResolutions = (ticketId: string) => US_V0_I6_RUNTIME_ARTIFACTS.populationCohorts.cohorts.map((cohort) => ({
  cohortId: cohort.id,
  candidatePreference: ticketId,
  turnoutDisposition: "HIGH" as const,
  classification: "APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD" as const,
  causeKey: `i6-continuity:${ticketId}`,
}));

const waiverInput = {
  relationshipId: "us.relationship.home.arapahoe-consortium.fy2025-2027",
  projectRef: "us.project.future-i7-input",
  inputComponent: "FUTURE_COMPONENT",
  domesticPreferenceRequirement: "DOMESTIC_PREFERENCE_APPLIES",
  assertedBasis: "NONAVAILABILITY_ASSERTED",
  supportingRecords: ["NONAVAILABILITY_RECORD", "TECHNICAL_SPECIFICATION", "SCOPE_JUSTIFICATION"],
  commentFrom: null,
  commentUntil: null,
  causeKey: "i6-pending-through-succession",
};

interface MutableSaveEnvelope {
  implementation: {
    publicFinance: { historicalBudgetAuthorities: { amount: { minorUnits: number } }[] };
    fiscalExecution: {
      historicalControls: { tas: string }[];
      historicalAwards: { fain: string }[];
    };
    recipientAdministration: { historicalExpenditures: { amount: { minorUnits: number } }[] };
    administrativeProgram: { historicalWaivers: { mutableByPlayer: boolean }[] };
    intergovernmental: { historicalRelationships: { status: string }[] };
  };
}

const coordinateGate = (session: IntegratedPartialRuntimeSession, chamberId: string): void => {
  const legislative = session.getAuditState().legislative;
  const organization = legislative.political.organizations.find((entry) =>
    !entry.coordinationActions.some((action) =>
      action.chamberId === chamberId && action.proposalVersion === legislative.agenda.currentVersion));
  if (organization === undefined) throw new Error("No organization is available for deterministic gate support.");
  session.coordinateOrganization(organization.id, chamberId, "SUPPORT");
};

const enactCurrentAgenda = (session: IntegratedPartialRuntimeSession): string => {
  const initial = session.getAuditState().legislative;
  const houseActors = new Set(initial.political.organizations.flatMap((organization) =>
    organization.memberships.filter((member) => member.chamberId === US_HOUSE_CHAMBER_ID).map((member) => member.actorId)));
  const sponsor = initial.political.actors.find((actor) => houseActors.has(actor.actorId) && actor.supportPosture === "LEAN_YEA");
  if (sponsor === undefined) throw new Error("No deterministic sponsor.");
  const assignment = initial.activeAssignments.find((entry) => entry.actorId === sponsor.actorId)!;
  session.beginSponsorSearch();
  session.seekSponsorship(sponsor.actorId);
  session.introduceBySponsor(sponsor.actorId, assignment.id);
  session.advanceIntroducedProposal();
  coordinateGate(session, US_HOUSE_CHAMBER_ID);
  session.resolveConsiderationGate();
  session.closeAmendmentRound();
  session.resolveFinalRollCall();
  coordinateGate(session, US_SENATE_CHAMBER_ID);
  session.resolveConsiderationGate();
  session.closeAmendmentRound();
  session.resolveFinalRollCall();
  session.present();
  const presidentAssignment = session.getAuditState().legislative.activeAssignments.find(
    (entry) => entry.officeId === US_PRESIDENT_OFFICE_ID,
  )!;
  session.executiveAction(US_INCUMBENT_PRESIDENT_ACTOR_ID, presidentAssignment.id, "SIGN");
  return session.getAuditState().legislative.enactedLegalSources[0].id;
};

describe("I6 integrated ownership, persistence, and succession", () => {
  it("admits only an actual enacted legal source, then advances authority and control separately", () => {
    const session = createSession(supportiveConfiguration);
    expect(() => session.admitEnactedLawFiscalAuthority("not-enacted")).toThrow(/actually enacted/);
    const lawId = enactCurrentAgenda(session);
    let state = session.admitEnactedLawFiscalAuthority(lawId);
    expect(state.implementation!.publicFinance.generatedBudgetAuthorities).toHaveLength(1);
    expect(state.implementation!.fiscalExecution.generatedControls).toEqual([]);
    const authorityId = state.implementation!.publicFinance.generatedBudgetAuthorities[0].id;
    state = session.requestApportionment(authorityId);
    expect(state.implementation!.publicFinance.generatedBudgetAuthorities[0].status).toBe("APPORTIONMENT_PENDING");
    state = session.approveApportionment(authorityId);
    expect(state.implementation!.publicFinance.generatedBudgetAuthorities[0].status).toBe("APPORTIONED");
    expect(state.implementation!.fiscalExecution.generatedControls).toHaveLength(1);
    expect(() => createIntegratedPartialRuntimeSessionFromSave(
      session.save(), supportiveConfiguration, US_V0_I6_RUNTIME_ARTIFACTS,
    )).not.toThrow();
    const tampered = JSON.parse(session.save()) as {
      implementation: {
        publicFinance: { generatedBudgetAuthorities: { amount: { minorUnits: number } }[] };
        fiscalExecution: { generatedControls: { amount: { minorUnits: number } }[] };
      };
    };
    tampered.implementation.publicFinance.generatedBudgetAuthorities[0].amount.minorUnits += 1;
    tampered.implementation.fiscalExecution.generatedControls[0].amount.minorUnits += 1;
    expect(() => createIntegratedPartialRuntimeSessionFromSave(
      JSON.stringify(tampered), supportiveConfiguration, US_V0_I6_RUNTIME_ARTIFACTS,
    )).toThrow(/enacted legal terms/);
  });

  it("round-trips generated state while rejecting edits to every immutable real-seed family", () => {
    const session = createSession();
    session.openFutureWaiver(waiverInput);
    session.electConsortiumMemberParticipation(
      waiverInput.relationshipId,
      "us.local.englewood",
      "EXCLUDE",
      "persistence-member-election",
    );
    const saved = session.save();
    expect(JSON.parse(saved).formatVersion).toBe(INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION);
    const restored = createIntegratedPartialRuntimeSessionFromSave(
      saved,
      US_V0_STRUCTURAL_CONFIGURATION,
      US_V0_I6_RUNTIME_ARTIFACTS,
    );
    expect(restored.getAuditState().implementation).toEqual(session.getAuditState().implementation);

    const attacks: readonly ((envelope: MutableSaveEnvelope) => void)[] = [
      (envelope) => { envelope.implementation.publicFinance.historicalBudgetAuthorities[0].amount.minorUnits += 1; },
      (envelope) => { envelope.implementation.fiscalExecution.historicalControls[0].tas = "tampered"; },
      (envelope) => { envelope.implementation.fiscalExecution.historicalAwards[0].fain = "tampered"; },
      (envelope) => { envelope.implementation.recipientAdministration.historicalExpenditures[0].amount.minorUnits += 1; },
      (envelope) => { envelope.implementation.administrativeProgram.historicalWaivers[0].mutableByPlayer = true; },
      (envelope) => { envelope.implementation.intergovernmental.historicalRelationships[0].status = "SUSPENDED"; },
    ];
    for (const attack of attacks) {
      const envelope = JSON.parse(saved) as MutableSaveEnvelope;
      attack(envelope);
      expect(() => createIntegratedPartialRuntimeSessionFromSave(
        JSON.stringify(envelope),
        US_V0_STRUCTURAL_CONFIGURATION,
        US_V0_I6_RUNTIME_ARTIFACTS,
      )).toThrow(/pinned artifact authority/);
    }
  });

  it("preserves pending program state through succession and enforces the new binding owner", () => {
    const sessionFor = (ticketId: string) => createIntegratedPartialRuntimeAuditSession(
      US_V0_STRUCTURAL_CONFIGURATION,
      US_V0_I6_RUNTIME_ARTIFACTS,
      allResolutions(ticketId),
    );
    const aligned = sessionFor(US_V0_PLAYER_TICKET_ID);
    aligned.openFutureWaiver(waiverInput);
    const before = aligned.getAuditState().implementation;
    aligned.advanceTo("2029-01-20T12:00:00-05:00");
    expect(aligned.getAuditState().implementation).toEqual(before);
    expect(() => aligned.directFutureWaiver(
      aligned.getAuditState().implementation!.administrativeProgram.waiverRequests[0].id,
      "GRANT_SCOPED_WAIVER",
    )).not.toThrow();

    const opposition = sessionFor(US_V0_OPPOSITION_TICKET_ID);
    opposition.openFutureWaiver(waiverInput);
    const oppositionBefore = opposition.getAuditState().implementation;
    opposition.advanceTo("2029-01-20T12:00:00-05:00");
    expect(opposition.getAuditState().implementation).toEqual(oppositionBefore);
    expect(() => opposition.directFutureWaiver(
      opposition.getAuditState().implementation!.administrativeProgram.waiverRequests[0].id,
      "GRANT_SCOPED_WAIVER",
    )).toThrow(/No active ControlBinding/);
  }, 15_000);

  it("processes supplemental-review time identically across save/load and exactly once", () => {
    const incomplete = { ...waiverInput, supportingRecords: [], causeKey: "dynamic-review-persistence" };
    const direct = createSession();
    direct.openFutureWaiver(incomplete);
    const requestId = direct.getAuditState().implementation!.administrativeProgram.waiverRequests[0].id;
    direct.directFutureWaiver(requestId, "RETURN_FOR_SUPPLEMENTAL_RECORD");

    const restored = createIntegratedPartialRuntimeSessionFromSave(
      direct.save(),
      US_V0_STRUCTURAL_CONFIGURATION,
      US_V0_I6_RUNTIME_ARTIFACTS,
    );
    const target = "2026-09-10T00:00:00-04:00";
    const directState = direct.advanceTo(target).implementation;
    const restoredState = restored.advanceTo(target).implementation;
    expect(restoredState).toEqual(directState);
    expect(restoredState!.administrativeProgram.waiverRequests[0].reviewState).toBe("REVIEW_READY");
    expect(restoredState!.administrativeProgram.dynamicBoundaries[0].processed).toBe(true);
    const once = restored.getAuditState().implementation;
    restored.advanceTo(target);
    expect(restored.getAuditState().implementation).toEqual(once);
  });
});
