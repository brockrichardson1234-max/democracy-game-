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
import { US_V0_I7_RUNTIME_ARTIFACTS } from "../src/content/us-v0/i7";
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
  US_V0_I7_RUNTIME_ARTIFACTS,
);

const allResolutions = (ticketId: string) => US_V0_I7_RUNTIME_ARTIFACTS.populationCohorts.cohorts.map((cohort) => ({
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

interface GeneratedMutableSaveEnvelope {
  implementation: {
    publicFinance: {
      generatedBudgetAuthorities: { availableUntil: string | null }[];
    };
    ownerResolution: {
      intentions: { id: string; resultRecordIds: string[] }[];
    };
    fiscalExecution: {
      generatedControls: { amount: { ownerId: string }; classification: string }[];
      generatedObligations: { amount: { ownerId: string }; classification: string }[];
      generatedPayments: { amount: { ownerId: string }; classification: string; sourceIntentionId: string }[];
    };
    recipientAdministration: {
      commitments: { complianceRecordRefs: string[]; selectedRecipientOption: number }[];
      drawRequests: { classification: string }[];
    };
    intergovernmental: {
      transitions: {
        newParticipation: string | null;
        classification: string;
        occurredAt: string;
      }[];
    };
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
    const session = createIntegratedPartialRuntimeAuditSession(
      supportiveConfiguration, US_V0_I7_RUNTIME_ARTIFACTS, [],
    );
    expect(() => session.admitEnactedLawFiscalAuthority("not-enacted")).toThrow(/actually enacted/);
    const lawId = enactCurrentAgenda(session);
    let state = session.admitEnactedLawFiscalAuthority(lawId);
    expect(state.implementation!.publicFinance.generatedBudgetAuthorities).toHaveLength(1);
    expect(state.implementation!.fiscalExecution.generatedControls).toEqual([]);
    const authorityId = state.implementation!.publicFinance.generatedBudgetAuthorities[0].id;
    state = session.requestApportionment(authorityId);
    expect(state.implementation!.publicFinance.generatedBudgetAuthorities[0].status).toBe("APPORTIONMENT_PENDING");
    expect(state.implementation!.fiscalExecution.generatedControls).toEqual([]);
    const intentionId = state.implementation!.ownerResolution.intentions[0].id;
    state = session.resolveOwnerIntention(intentionId);
    expect(state.implementation!.publicFinance.generatedBudgetAuthorities[0].status).toBe("APPORTIONED");
    expect(state.implementation!.fiscalExecution.generatedControls).toHaveLength(1);
    expect(() => createIntegratedPartialRuntimeSessionFromSave(
      session.save(), supportiveConfiguration, US_V0_I7_RUNTIME_ARTIFACTS,
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
      JSON.stringify(tampered), supportiveConfiguration, US_V0_I7_RUNTIME_ARTIFACTS,
    )).toThrow(/enacted legal terms/);
  });

  it("round-trips generated state while rejecting edits to every immutable real-seed family", () => {
    const session = createIntegratedPartialRuntimeAuditSession(
      US_V0_STRUCTURAL_CONFIGURATION, US_V0_I7_RUNTIME_ARTIFACTS, [],
    );
    session.openFutureWaiver(waiverInput);
    session.injectLocalMemberDecision(
      waiverInput.relationshipId,
      "us.local.englewood",
      "EXCLUDE",
      "persistence-member-election",
    );
    const relationshipIntentionId = session.getAuditState().implementation!.ownerResolution.intentions.at(-1)!.id;
    session.resolveOwnerIntention(relationshipIntentionId);
    const saved = session.save();
    expect(JSON.parse(saved).formatVersion).toBe(INTEGRATED_PARTIAL_SAVE_FORMAT_VERSION);
    const restored = createIntegratedPartialRuntimeSessionFromSave(
      saved,
      US_V0_STRUCTURAL_CONFIGURATION,
      US_V0_I7_RUNTIME_ARTIFACTS,
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
        US_V0_I7_RUNTIME_ARTIFACTS,
      )).toThrow(/pinned artifact authority/);
    }
  });

  it("preserves pending program state through succession and enforces the new binding owner", () => {
    const sessionFor = (ticketId: string) => createIntegratedPartialRuntimeAuditSession(
      US_V0_STRUCTURAL_CONFIGURATION,
      US_V0_I7_RUNTIME_ARTIFACTS,
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
      US_V0_I7_RUNTIME_ARTIFACTS,
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

  it("rejects behavior-driving generated-state tampering and exposes no direct outcome commands", () => {
    const session = createIntegratedPartialRuntimeAuditSession(
      supportiveConfiguration, US_V0_I7_RUNTIME_ARTIFACTS, [],
    );
    for (const forbidden of [
      "approveApportionment",
      "establishBoundedAward",
      "recordRecipientCommitment",
      "setUpRecipientActivity",
      "submitRecipientDraw",
      "executeRecipientPayment",
      "electConsortiumMemberParticipation",
    ]) expect(forbidden in session).toBe(false);

    const resolveLatest = (): void => {
      const pending = [...session.getAuditState().implementation!.ownerResolution.intentions].reverse().find(
        (entry) => entry.status === "PENDING",
      );
      if (pending === undefined) throw new Error("Expected a pending owner intention.");
      session.resolveOwnerIntention(pending.id);
    };
    const lawId = enactCurrentAgenda(session);
    session.admitEnactedLawFiscalAuthority(lawId);
    const authorityId = session.getAuditState().implementation!.publicFinance.generatedBudgetAuthorities[0].id;
    session.requestApportionment(authorityId);
    expect(session.getAuditState().implementation!.fiscalExecution.generatedControls).toEqual([]);
    resolveLatest();
    const control = session.getAuditState().implementation!.fiscalExecution.generatedControls[0];
    session.requestBoundedAward({
      sourceFiscalControlId: control.id,
      relationshipId: "us.relationship.home.corpus-christi-pj.fy2024",
      formulaScopeMemberId: null,
      recipientId: "us.recipient.corpus-christi",
      amountMinorUnits: 1_000_000,
      agreementRef: "semantic-save-award",
      causeKey: "semantic-save-award",
    });
    expect(session.getAuditState().implementation!.fiscalExecution.generatedAwards).toEqual([]);
    resolveLatest();
    const obligation = session.getAuditState().implementation!.fiscalExecution.generatedObligations[0];
    const profile = control.ruleProfile!;
    session.requestRecipientCommitment({
      recipientId: "us.recipient.corpus-christi",
      relationshipId: "us.relationship.home.corpus-christi-pj.fy2024",
      projectRef: "us.project.semantic-save",
      sourceObligationId: obligation.id,
      amountMinorUnits: 900_000,
      planRef: "semantic-plan",
      projectSelectionRef: "semantic-selection",
      writtenAgreementRef: "semantic-written-agreement",
      environmentalClearanceRef: "semantic-environmental-clearance",
      selectedRecipientOption: 1,
      complianceRecordRefs: [...profile.requiredRecordTypes],
      geographicPriorityAcknowledgement: profile.geographicPriorityRule,
      causeKey: "semantic-save-commitment",
    });
    expect(session.getAuditState().implementation!.recipientAdministration.commitments).toEqual([]);
    resolveLatest();
    const commitmentId = session.getAuditState().implementation!.recipientAdministration.commitments[0].id;
    session.requestRecipientActivitySetup(commitmentId);
    expect(session.getAuditState().implementation!.recipientAdministration.activities).toEqual([]);
    resolveLatest();
    const activityId = session.getAuditState().implementation!.recipientAdministration.activities[0].id;
    session.requestRecipientDraw(activityId, 500_000);
    expect(session.getAuditState().implementation!.recipientAdministration.drawRequests).toEqual([]);
    resolveLatest();
    const drawId = session.getAuditState().implementation!.recipientAdministration.drawRequests[0].id;
    session.requestFederalPayment(drawId);
    expect(session.getAuditState().implementation!.fiscalExecution.generatedPayments).toEqual([]);
    resolveLatest();
    session.advanceTo("2026-08-23T00:00:00-04:00");
    session.injectLocalMemberDecision(
      "us.relationship.home.arapahoe-consortium.fy2025-2027",
      "us.local.englewood",
      "EXCLUDE",
      "semantic-save-exclude",
    );
    resolveLatest();
    session.injectLocalRelationshipStatusDecision(
      "us.relationship.home.corpus-christi-pj.fy2024",
      "SUSPENDED",
      "semantic-save-suspend",
    );
    resolveLatest();

    const saved = session.save();
    expect(() => createIntegratedPartialRuntimeSessionFromSave(
      saved, supportiveConfiguration, US_V0_I7_RUNTIME_ARTIFACTS,
    )).not.toThrow();
    const attacks: readonly [string, (envelope: GeneratedMutableSaveEnvelope) => void][] = [
      ["EXCLUDE to INCLUDED", (value) => { value.implementation.intergovernmental.transitions[0].newParticipation = "INCLUDED"; }],
      ["relationship provenance", (value) => { value.implementation.intergovernmental.transitions[0].classification = "DIRECT_REAL_HISTORICAL_SEED"; }],
      ["fiscal-control owner", (value) => { value.implementation.fiscalExecution.generatedControls[0].amount.ownerId = "tampered-owner"; }],
      ["obligation owner", (value) => { value.implementation.fiscalExecution.generatedObligations[0].amount.ownerId = "tampered-owner"; }],
      ["payment owner", (value) => { value.implementation.fiscalExecution.generatedPayments[0].amount.ownerId = "tampered-owner"; }],
      ["generated classification", (value) => { value.implementation.recipientAdministration.drawRequests[0].classification = "DIRECT_REAL_HISTORICAL_SEED"; }],
      ["authority window", (value) => { value.implementation.publicFinance.generatedBudgetAuthorities[0].availableUntil = null; }],
      ["commitment compliance", (value) => { value.implementation.recipientAdministration.commitments[0].complianceRecordRefs.pop(); }],
      ["recipient option", (value) => { value.implementation.recipientAdministration.commitments[0].selectedRecipientOption = 999; }],
      ["retroactive ineligibility", (value) => { value.implementation.intergovernmental.transitions[1].occurredAt = "2026-08-21T00:00:00-04:00"; }],
      ["intention/result linkage", (value) => {
        value.implementation.fiscalExecution.generatedPayments[0].sourceIntentionId =
          value.implementation.ownerResolution.intentions[0].id;
      }],
    ];
    for (const [name, attack] of attacks) {
      const envelope = JSON.parse(saved) as GeneratedMutableSaveEnvelope;
      attack(envelope);
      expect(() => createIntegratedPartialRuntimeSessionFromSave(
        JSON.stringify(envelope), supportiveConfiguration, US_V0_I7_RUNTIME_ARTIFACTS,
      ), name).toThrow();
    }
  }, 45_000);

  it("composes a dynamic administrative boundary ahead of the next static boundary", () => {
    const session = createSession();
    session.advanceTo("2026-12-10T00:00:00-05:00");
    session.openFutureWaiver({ ...waiverInput, supportingRecords: [], causeKey: "dynamic-before-static" });
    const requestId = session.getAuditState().implementation!.administrativeProgram.waiverRequests[0].id;
    session.directFutureWaiver(requestId, "RETURN_FOR_SUPPLEMENTAL_RECORD");
    const dynamic = session.getAuditState().implementation!.administrativeProgram.dynamicBoundaries[0];
    expect(Date.parse(dynamic.at)).toBeLessThan(Date.parse("2027-01-03T12:00:00-05:00"));
    expect(session.getPublicInstitutionalStatus().nextBoundary).toMatchObject({ id: dynamic.id, at: dynamic.at });

    const savedBeforeA = session.save();
    const fine = createIntegratedPartialRuntimeSessionFromSave(
      savedBeforeA, US_V0_STRUCTURAL_CONFIGURATION, US_V0_I7_RUNTIME_ARTIFACTS,
    );
    fine.advanceToNextBoundary();
    expect(fine.getAuditState().institutional!.calendar.current).toBe(dynamic.at);
    expect(fine.getAuditState().institutional!.calendar.processedBoundaryIds).toEqual([]);
    expect(fine.getAuditState().implementation!.administrativeProgram.dynamicBoundaries[0].processed).toBe(true);
    fine.advanceToNextBoundary();
    const target = "2027-01-04T00:00:00-05:00";
    fine.advanceTo(target);

    const coarse = createIntegratedPartialRuntimeSessionFromSave(
      savedBeforeA, US_V0_STRUCTURAL_CONFIGURATION, US_V0_I7_RUNTIME_ARTIFACTS,
    );
    coarse.advanceTo(target);
    expect(coarse.getAuditState()).toEqual(fine.getAuditState());

    const restored = createIntegratedPartialRuntimeSessionFromSave(
      coarse.save(), US_V0_STRUCTURAL_CONFIGURATION, US_V0_I7_RUNTIME_ARTIFACTS,
    );
    expect(restored.getAuditState()).toEqual(coarse.getAuditState());
  }, 20_000);
});
