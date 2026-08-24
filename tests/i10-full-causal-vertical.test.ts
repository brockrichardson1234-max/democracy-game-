import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";

import {
  createIntegratedPartialRuntimeAuditSession,
  createIntegratedPartialRuntimeSession,
  createIntegratedPartialRuntimeSessionFromSave,
  type IntegratedPartialRuntimeSession,
} from "../src/app/integrated-session";
import { canonicalConfigurationContent } from "../src/configuration/canonical";
import type { GovernmentConfiguration, LegislativeRuntimeSeed } from "../src/configuration/types";
import { US_V0_STRUCTURAL_CONFIGURATION, US_V0_LEGISLATIVE_SEED } from "../src/content/us-v0/configuration";
import { US_V0_I10_COMPOSITION_CONFIGURATION, US_V0_I10_RUNTIME_ARTIFACTS } from "../src/content/us-v0/i10";
import { US_V0_I8_RESPONSE } from "../src/content/us-v0/i8";
import { US_V0_OPPOSITION_TICKET_ID, US_V0_2029_TRANSFER } from "../src/content/us-v0/i5";
import { US_V0_I9_NOTICE } from "../src/content/us-v0/i9";
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
    configurationVersion: "0.10.0-i10-supportive-test",
    scenarioVersion: "0.10.0-i10-supportive-test",
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

const createSession = (configuration = supportiveConfiguration) => createIntegratedPartialRuntimeSession(
  configuration,
  US_V0_I10_RUNTIME_ARTIFACTS,
);

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

const advanceFinance = (session: IntegratedPartialRuntimeSession): string => {
  const lawId = enactCurrentAgenda(session);
  session.admitEnactedLawFiscalAuthority(lawId);
  const authorityId = session.getAuditState().implementation!.publicFinance.generatedBudgetAuthorities[0].id;
  session.requestApportionment(authorityId);
  session.approveApportionment(authorityId);
  return session.getAuditState().implementation!.fiscalExecution.generatedControls[0].id;
};

describe("I10 full persistent causal vertical", () => {
  it("pins composition owner references and exposes no private causal keys or Population minds", () => {
    expect(US_V0_I10_COMPOSITION_CONFIGURATION).toMatchObject({
      semanticsVersion: "us-v0-full-causal-vertical-1",
      publicProjectionVersion: "us-v0-headless-administration-projection-1",
    });
    const projection = createSession(US_V0_STRUCTURAL_CONFIGURATION).getAdministrationCausalProjection();
    expect(projection).toMatchObject({ controlBindingActive: true, selection: { stage: "SCHEDULED" } });
    expect(JSON.stringify(projection)).not.toMatch(/causalInputHash|stableKey|cohortId|candidatePreference|turnoutDisposition/);
  });

  it("keeps a failed or unenacted agenda outside PublicFinance", () => {
    const session = createSession();
    expect(session.getAuditState().legislative.enactedLegalSources).toEqual([]);
    expect(session.getAdministrationCausalProjection().finance.budgetAuthorities).toEqual([]);
    expect(() => session.admitEnactedLawFiscalAuthority("not-enacted")).toThrow(/actually enacted/);
  });

  it("runs enactment through finance, recipient execution, material state, information, court, and persistence", () => {
    const session = createSession();
    session.issueBoundedRelationshipRejection();
    const controlId = advanceFinance(session);
    const control = session.getAuditState().implementation!.fiscalExecution.generatedControls[0];
    session.establishBoundedAward({
      sourceFiscalControlId: controlId,
      relationshipId: "us.relationship.home.corpus-christi-pj.fy2024",
      recipientId: "us.recipient.corpus-christi",
      amountMinorUnits: 5_000_000,
      agreementRef: "generated-written-grant-agreement",
      causeKey: "i10-corpus-award",
    });
    const obligation = session.getAuditState().implementation!.fiscalExecution.generatedObligations[0];
    session.recordRecipientCommitment({
      recipientId: "us.recipient.corpus-christi",
      relationshipId: "us.relationship.home.corpus-christi-pj.fy2024",
      projectRef: "us.project.palms-at-morris",
      sourceObligationId: obligation.id,
      amountMinorUnits: 4_000_000,
      planRef: "us.plan.corpus",
      projectSelectionRef: "us.selection.corpus.palms",
      writtenAgreementRef: "us.agreement.corpus.palms",
      environmentalClearanceRef: "us.environment.corpus.palms",
      selectedRecipientOption: 1,
      complianceRecordRefs: [...control.ruleProfile!.requiredRecordTypes],
      geographicPriorityAcknowledgement: control.ruleProfile!.geographicPriorityRule,
      causeKey: "i10-corpus-commitment",
    });
    const commitmentId = session.getAuditState().implementation!.recipientAdministration.commitments[0].id;
    session.setUpRecipientActivity(commitmentId);
    const activityId = session.getAuditState().implementation!.recipientAdministration.activities[0].id;
    session.submitRecipientDraw(activityId, 1_000_000);
    const drawId = session.getAuditState().implementation!.recipientAdministration.drawRequests[0].id;
    session.executeRecipientPayment(drawId);
    session.openFutureWaiver({
      relationshipId: "us.relationship.home.corpus-christi-pj.fy2024",
      projectRef: "us.project.palms-at-morris",
      inputComponent: "FUTURE_COMPONENT",
      domesticPreferenceRequirement: "DOMESTIC_PREFERENCE_APPLIES",
      assertedBasis: "NONAVAILABILITY_ASSERTED",
      supportingRecords: [
        "NONAVAILABILITY_RECORD",
        "TECHNICAL_SPECIFICATION",
        "SCOPE_JUSTIFICATION",
      ],
      commentFrom: null,
      commentUntil: null,
      causeKey: "i10-material-hold",
    });
    const waiverId = session.getAuditState().implementation!.administrativeProgram.waiverRequests[0].id;
    session.directFutureWaiver(waiverId, "DENY");

    session.advanceTo(US_V0_I9_NOTICE);
    expect(session.getAuditState().implementation!.administrativeProgram.externalLegalConstraints).toHaveLength(1);
    expect(() => session.executeBoundedRelationshipDisposition()).toThrow(/constraint bars/);
    session.respondToJudicialOrder("COMPLY_PROSPECTIVELY");
    session.advanceTo(US_V0_I8_RESPONSE);
    const projection = session.getAdministrationCausalProjection();
    expect(projection.legislative.enactedLegalSourceIds).toHaveLength(1);
    expect(projection.finance).toMatchObject({
      budgetAuthorities: [{ status: "APPORTIONED" }],
      fiscalControlIds: [controlId],
      awardIds: [expect.any(String)],
      obligationIds: [obligation.id],
      paymentIds: [expect.any(String)],
    });
    expect(projection.program.recipientCommitmentIds).toEqual([commitmentId]);
    expect(projection.material.projects.find((entry) => entry.id === "us.project.palms-at-morris")?.stage).toBe("BLOCKED");
    expect(projection.information).toMatchObject({ deliveryCount: 1, exposureCount: 1 });
    expect(projection.legalContest).toMatchObject({
      contestStages: ["NOTICED"],
      operativeOrderIds: [expect.any(String)],
      administrativeResponseIds: [expect.any(String)],
    });
    const restored = createIntegratedPartialRuntimeSessionFromSave(
      session.save(), supportiveConfiguration, US_V0_I10_RUNTIME_ARTIFACTS,
    );
    expect(restored.getAuditState()).toEqual(session.getAuditState());
    expect(restored.getAdministrationCausalProjection()).toEqual(projection);
  }, 30_000);

  it("keeps the same material world before response, then changes only lawfully exposed Population", () => {
    const session = createSession(US_V0_STRUCTURAL_CONFIGURATION);
    session.advanceTo("2027-11-03T12:00:00-04:00");
    const material = structuredClone(session.getAuditState().housing);
    const before = structuredClone(session.getAuditState().population);
    session.advanceTo(US_V0_I8_RESPONSE);
    expect(session.getAuditState().housing).toEqual(material);
    const current = session.getAuditState().population.cohorts;
    const exposed = current.filter((cohort) => cohort.receivedInformationReferences.length > 0);
    expect(exposed.length).toBeGreaterThan(0);
    expect(exposed.every((cohort) => cohort.politicalState.candidatePreference === "PLAYER_ALIGNED")).toBe(true);
    const unexposed = current.filter((cohort) => cohort.receivedInformationReferences.length === 0);
    expect(unexposed.every((cohort) => {
      const prior = before.cohorts.find((entry) => entry.id === cohort.id || entry.id === cohort.lineage.parentCohortId);
      return prior === undefined || prior.politicalState.candidatePreference === cohort.politicalState.candidatePreference;
    })).toBe(true);
  }, 20_000);

  it("lets selection remove control while preserving the integrated world", () => {
    const resolutions = US_V0_I10_RUNTIME_ARTIFACTS.populationCohorts.cohorts.map((cohort) => ({
      cohortId: cohort.id,
      candidatePreference: US_V0_OPPOSITION_TICKET_ID,
      turnoutDisposition: "HIGH" as const,
      classification: "APPROXIMATED_NON_HISTORICAL_SIMULATION_SCAFFOLD" as const,
      causeKey: "i10-opposition-world-continuity",
    }));
    const session = createIntegratedPartialRuntimeAuditSession(
      US_V0_STRUCTURAL_CONFIGURATION,
      US_V0_I10_RUNTIME_ARTIFACTS,
      resolutions,
    );
    const geography = structuredClone(session.getAuditState().geography);
    const controls = structuredClone(session.getAuditState().population.controls);
    session.advanceTo(US_V0_2029_TRANSFER);
    expect(session.getAdministrationCausalProjection().controlBindingActive).toBe(false);
    expect(session.getAuditState().geography).toEqual(geography);
    expect(session.getAuditState().population.controls).toEqual(controls);
    expect(() => session.openFutureWaiver({
      relationshipId: "us.relationship.home.corpus-christi-pj.fy2024",
      projectRef: "us.project.palms-at-morris",
      inputComponent: "FUTURE_COMPONENT",
      domesticPreferenceRequirement: "DOMESTIC_PREFERENCE_APPLIES",
      assertedBasis: "NONAVAILABILITY_ASSERTED",
      supportingRecords: [], commentFrom: null, commentUntil: null, causeKey: "after-loss",
    })).toThrow(/No active ControlBinding/);
  }, 30_000);
});
