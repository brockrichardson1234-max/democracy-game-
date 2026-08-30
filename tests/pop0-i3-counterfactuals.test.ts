import { describe, expect, it } from "vitest";

import {
  createPresidentialOperatingProofSession,
  type PresidentialOperatingProofSession,
} from "../src/app/presidential-operating-proof-session";
import {
  POP0_I2_ASSESSMENT_RULE_IDS,
  POP0_I2_ACCESS_CLASS,
  POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS,
  POP0_I2_OFFICE_IDS,
  POP0_I2_SOURCE_ARTIFACT_ID,
  POP0_I2_SOURCE_SECTION_IDS,
  POP0_I3_RECIPIENT_CAPABILITY_IDS,
  POP0_I3_WORKSTREAM_ID,
  POP0_V0_OPERATING_CONFIGURATION,
  POP0_V0_PROVENANCE_ROOT,
} from "../src/content/pop0-v0/configuration";
import type { PresidentialAdministrationConfiguration } from
  "../src/sim/presidential-office-information";
import {
  computePresidentialOperatingConfigurationHash,
  type PresidentialOperatingRuntimeConfiguration,
} from "../src/sim/presidential-operating-runtime";
import {
  POP0_I2_ASSESSMENT_SECTION_IDS,
  POP0_I2_SYNTHESIS_SECTION_IDS,
  POP0_I2_TRACE_IDS,
  POP0_I2_TRACE_TIMES,
  runFullPop0I2Trace,
  runPop0I2ThroughDisagreement,
} from "./pop0-i2-proof-fixture";
import {
  POP0_I3_TRACE_IDS,
  POP0_I3_TRACE_TIMES,
  createI3Escalation,
  createI3Workstream,
  createPop0I3TraceSession,
  dispatchI3Instruments,
  runI3ThroughDecision,
  runI3ThroughReceipt,
} from "./pop0-i3-proof-fixture";

const withAdministration = (
  administration: PresidentialAdministrationConfiguration,
): PresidentialOperatingRuntimeConfiguration => {
  const base = POP0_V0_OPERATING_CONFIGURATION;
  const identityWithoutHash = {
    configurationId: base.identity.configurationId,
    configurationVersion: base.identity.configurationVersion,
    scenarioId: base.identity.scenarioId,
    scenarioVersion: base.identity.scenarioVersion,
  };
  const withoutHash = {
    schemaVersion: base.schemaVersion,
    identity: identityWithoutHash,
    classification: base.classification,
    operatingStateId: base.operatingStateId,
    calendar: base.calendar,
    administration,
    intervention: base.intervention,
  };
  return {
    ...withoutHash,
    identity: {
      ...identityWithoutHash,
      configurationHash: computePresidentialOperatingConfigurationHash(withoutHash),
    },
  };
};

const createConfiguredTraceSession = (
  configuration: PresidentialOperatingRuntimeConfiguration,
): PresidentialOperatingProofSession => {
  const session = createPresidentialOperatingProofSession(undefined, configuration);
  runFullPop0I2Trace(session);
  return session;
};

const recordFullOmbAcceptance = (session: PresidentialOperatingProofSession): void => {
  session.recordRecipientDisposition({
    id: "pop0.disposition.omb.accepted-full-scope",
    deduplicationIdentity: "pop0.dedupe.disposition.omb.accepted-full-scope",
    recipientOfficeId: POP0_I2_OFFICE_IDS.omb,
    instrumentReceiptId: POP0_I3_TRACE_IDS.ombInstrumentReceipt,
    authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.ombDirector,
    capabilityAuthorityId: POP0_I3_RECIPIENT_CAPABILITY_IDS.ombAnalysis,
    kind: "ACCEPTED_AS_REQUESTED",
    acceptedProductKind: "FISCAL_SUPPORTABILITY_SCOPING",
    acceptedSectionIds: [
      POP0_I2_SOURCE_SECTION_IDS.summary,
      POP0_I2_SOURCE_SECTION_IDS.regionalTable,
      POP0_I2_SOURCE_SECTION_IDS.methods,
    ],
    acceptedCoordinationActions: [],
    constraintIds: [],
    reason: null,
    limitations: [],
    nextReviewAt: null,
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  });
};

const createFullOmbAssignment = (session: PresidentialOperatingProofSession): void => {
  session.createInstrumentAuthorizedAssignment({
    id: "pop0.assignment.omb.full-scope-analysis",
    dispositionId: "pop0.disposition.omb.accepted-full-scope",
    requesterId: POP0_I2_OFFICE_IDS.omb,
    leadOfficeId: POP0_I2_OFFICE_IDS.omb,
    objective: "Prepare only the accepted bounded full-scope analysis",
    sourceReferenceIds: ["pop0.disposition.omb.accepted-full-scope"],
    requiredConsultationOfficeIds: [],
    authorityReference: "pop0.disposition.omb.accepted-full-scope",
    deadline: POP0_I3_TRACE_TIMES.assignmentDeadline,
    expectedProductKind: "FISCAL_SUPPORTABILITY_SCOPING",
  });
};

const officeAssignments = (
  session: PresidentialOperatingProofSession,
  officeId: string,
) => session.getOperatingState().ownerStates.officeOperations.state.find(
  (office) => office.officeId === officeId,
)?.assignments ?? [];

const dispatchInputs = {
  omb: {
    id: POP0_I3_TRACE_IDS.ombDispatch,
    deduplicationIdentity: "pop0.dedupe.dispatch.omb.bounded-analysis",
    instrumentId: POP0_I3_TRACE_IDS.ombInstrument,
    dispatchingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
    dispatchPath: "PRESIDENTIAL_OPERATIONS_TO_OMB",
    outcome: "DELIVERED_TO_OFFICE_BOUNDARY" as const,
    failureReason: null,
    outcomeProvenanceReference: POP0_V0_PROVENANCE_ROOT,
    retryOfDispatchId: null,
  },
  chief: {
    id: POP0_I3_TRACE_IDS.chiefOfStaffDispatch,
    deduplicationIdentity: "pop0.dedupe.dispatch.chief-of-staff.workstream-coordination",
    instrumentId: POP0_I3_TRACE_IDS.chiefOfStaffInstrument,
    dispatchingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
    dispatchPath: "PRESIDENTIAL_OPERATIONS_INTERNAL_DELIVERY",
    outcome: "DELIVERED_TO_OFFICE_BOUNDARY" as const,
    failureReason: null,
    outcomeProvenanceReference: POP0_V0_PROVENANCE_ROOT,
    retryOfDispatchId: null,
  },
};

const receiptInputs = {
  omb: {
    id: POP0_I3_TRACE_IDS.ombInstrumentReceipt,
    deduplicationIdentity: "pop0.dedupe.instrument-receipt.omb.bounded-analysis",
    instrumentId: POP0_I3_TRACE_IDS.ombInstrument,
    successfulDispatchId: POP0_I3_TRACE_IDS.ombDispatch,
    recipientOfficeId: POP0_I2_OFFICE_IDS.omb,
    receiptPath: "OMB_OFFICE_BOUNDARY_ADMISSION",
    receivingAuthorityReference: POP0_I3_RECIPIENT_CAPABILITY_IDS.ombAnalysis,
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  },
  chief: {
    id: POP0_I3_TRACE_IDS.chiefOfStaffInstrumentReceipt,
    deduplicationIdentity: "pop0.dedupe.instrument-receipt.chief-of-staff.coordination",
    instrumentId: POP0_I3_TRACE_IDS.chiefOfStaffInstrument,
    successfulDispatchId: POP0_I3_TRACE_IDS.chiefOfStaffDispatch,
    recipientOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
    receiptPath: "CHIEF_OF_STAFF_OFFICE_BOUNDARY_ADMISSION",
    receivingAuthorityReference: POP0_I3_RECIPIENT_CAPABILITY_IDS.chiefOfStaffCoordination,
    provenanceReference: POP0_V0_PROVENANCE_ROOT,
  },
};

describe("POP0-I3 causal counterfactuals", () => {
  it("cannot synthesize, escalate, or create replacement Attention after withholding one source receipt", () => {
    const session = createPresidentialOperatingProofSession();
    runPop0I2ThroughDisagreement(session);
    session.advanceTo(POP0_I2_TRACE_TIMES.transfer);
    session.transferOfficeArtifact({
      id: POP0_I2_TRACE_IDS.laborAssessmentReceiptAtChiefOfStaff,
      sourceOfficeId: POP0_I2_OFFICE_IDS.secretaryOfLabor,
      sourceOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.secretaryOfLabor,
      recipientOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      artifactId: POP0_I2_TRACE_IDS.laborAssessment,
      receivedSectionIds: POP0_I2_ASSESSMENT_SECTION_IDS,
      receivingAuthorityReference: POP0_V0_PROVENANCE_ROOT,
      deduplicationIdentity: "pop0.dedupe.counterfactual.only-labor-received",
    });
    session.advanceTo(POP0_I2_TRACE_TIMES.synthesis);
    expect(() => session.authorSynthesis({
      id: POP0_I2_TRACE_IDS.synthesis,
      version: "1",
      sectionIds: POP0_I2_SYNTHESIS_SECTION_IDS,
      producingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.chiefOfStaff,
      sourceAssessmentReceiptIds: [
        POP0_I2_TRACE_IDS.laborAssessmentReceiptAtChiefOfStaff,
        POP0_I2_TRACE_IDS.necAssessmentReceiptAtChiefOfStaff,
      ],
      synthesisJudgment: "This cannot exist without both office-owned receipts",
      limitations: [],
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
      revisionOfArtifactId: null,
      supersedesArtifactId: null,
    })).toThrow(/lacks received assessment/i);
    expect(session.getPresidentialAttention()).toEqual([]);
    expect(session.getOperatingState().ownerStates.presidentialEscalations.state.escalations).toEqual([]);
  });

  it("rejects the conflict-based escalation when the source judgments no longer conflict", () => {
    const base = POP0_V0_OPERATING_CONFIGURATION.administration;
    const laborJudgment = base.assessmentRules.find(
      (rule) => rule.id === POP0_I2_ASSESSMENT_RULE_IDS.currentEvidenceDoesNotSupportSpillover,
    )?.judgment;
    if (laborJudgment === undefined) throw new Error("Missing configured Labor judgment.");
    const configuration = withAdministration({
      ...base,
      assessmentRules: base.assessmentRules.map((rule) =>
        rule.id === POP0_I2_ASSESSMENT_RULE_IDS.supplierAssumptionSupportsPlausibility
          ? { ...rule, judgment: laborJudgment }
          : rule),
    });
    const session = createConfiguredTraceSession(configuration);
    createI3Workstream(session);
    expect(() => createI3Escalation(session)).toThrow(/preserved conflicting judgments/i);
    expect(session.getPresidentialAttention()).toEqual([]);
  });

  it("does not treat authorization or one failed dispatch as delivery to either recipient", () => {
    const session = createPop0I3TraceSession();
    runI3ThroughDecision(session);
    expect(session.getOperatingState().ownerStates.instrumentDispatches.state).toEqual([]);

    session.advanceTo(POP0_I3_TRACE_TIMES.dispatch);
    session.attemptInstrumentDispatch({
      ...dispatchInputs.omb,
      outcome: "FAILED",
      failureReason: "Bounded proof transport failure",
    });
    session.attemptInstrumentDispatch(dispatchInputs.chief);
    expect(session.getOfficeInformation(POP0_I2_OFFICE_IDS.omb).instrumentReceipts).toEqual([]);
    expect(session.getOfficeInformation(POP0_I2_OFFICE_IDS.chiefOfStaff).instrumentReceipts).toEqual([]);

    session.advanceTo(POP0_I3_TRACE_TIMES.receipt);
    session.admitOfficeInstrumentReceipt(receiptInputs.chief);
    expect(() => session.admitOfficeInstrumentReceipt(receiptInputs.omb)).toThrow(/successful delivery/i);
    expect(session.getOfficeInformation(POP0_I2_OFFICE_IDS.omb).instrumentDispositions).toEqual([]);
    expect(session.getOfficeInformation(POP0_I2_OFFICE_IDS.chiefOfStaff).instrumentReceipts)
      .toHaveLength(1);
  });

  it("preserves a failed dispatch and its later successful retry as distinct occurrences", () => {
    const session = createPop0I3TraceSession();
    runI3ThroughDecision(session);
    session.advanceTo(POP0_I3_TRACE_TIMES.dispatch);
    session.attemptInstrumentDispatch({
      ...dispatchInputs.omb,
      outcome: "NOT_DELIVERED",
      failureReason: "Recipient endpoint temporarily unavailable",
    });
    session.advanceTo("2029-02-05T09:51:00-05:00");
    session.attemptInstrumentDispatch({
      ...dispatchInputs.omb,
      id: "pop0.dispatch.omb.bounded-analysis.retry",
      deduplicationIdentity: "pop0.dedupe.dispatch.omb.bounded-analysis.retry",
      retryOfDispatchId: POP0_I3_TRACE_IDS.ombDispatch,
    });
    const dispatches = session.getOperatingState().ownerStates.instrumentDispatches.state;
    expect(dispatches.map((entry) => entry.outcome)).toEqual([
      "NOT_DELIVERED",
      "DELIVERED_TO_OFFICE_BOUNDARY",
    ]);
    expect(dispatches[1].retryOfDispatchId).toBe(POP0_I3_TRACE_IDS.ombDispatch);
  });

  it("keeps a metadata-only full-scope assignment blocked without creating knowledge or a result", () => {
    const session = createPop0I3TraceSession();
    runI3ThroughReceipt(session);
    session.advanceTo(POP0_I3_TRACE_TIMES.disposition);
    recordFullOmbAcceptance(session);
    expect(officeAssignments(session, POP0_I2_OFFICE_IDS.omb))
      .not.toContainEqual(expect.objectContaining({ id: "pop0.assignment.omb.full-scope-analysis" }));
    session.advanceTo(POP0_I3_TRACE_TIMES.assignment);
    createFullOmbAssignment(session);
    const assignment = officeAssignments(session, POP0_I2_OFFICE_IDS.omb).find(
      (entry) => entry.id === "pop0.assignment.omb.full-scope-analysis",
    );
    expect(assignment?.status).toBe("BLOCKED");
    expect(assignment?.resultArtifactIds).toEqual([]);
    expect(session.getPresidentialHistory()).toHaveLength(3);
  });

  it("permits but does not force a full-scope assignment after legitimate later substantive receipt", () => {
    const base = POP0_V0_OPERATING_CONFIGURATION.administration;
    const configuration = withAdministration({
      ...base,
      accessEntitlements: [...base.accessEntitlements, {
        id: "pop0.access.omb.preliminary-evidence.after-i2",
        officeId: POP0_I2_OFFICE_IDS.omb,
        artifactId: POP0_I2_SOURCE_ARTIFACT_ID,
        accessClass: POP0_I2_ACCESS_CLASS,
        sectionIds: Object.values(POP0_I2_SOURCE_SECTION_IDS),
        effectiveFrom: "2029-02-05T09:56:00-05:00",
        effectiveUntil: null,
        authorityReference: POP0_V0_PROVENANCE_ROOT,
      }],
    });
    const session = createConfiguredTraceSession(configuration);
    runI3ThroughReceipt(session);
    session.advanceTo("2029-02-05T09:56:00-05:00");
    session.attemptRetrieval({
      id: "pop0.retrieval.omb.preliminary-evidence.after-i2",
      requestingOfficeId: POP0_I2_OFFICE_IDS.omb,
      artifactId: POP0_I2_SOURCE_ARTIFACT_ID,
      requestedSectionIds: Object.values(POP0_I2_SOURCE_SECTION_IDS),
      metadataNoticeId: POP0_I2_TRACE_IDS.ombNotice,
    });
    session.admitSubstantiveReceipt({
      id: "pop0.receipt.omb.preliminary-evidence.after-i2",
      recipientOfficeId: POP0_I2_OFFICE_IDS.omb,
      artifactId: POP0_I2_SOURCE_ARTIFACT_ID,
      receivedSectionIds: Object.values(POP0_I2_SOURCE_SECTION_IDS),
      retrievalId: "pop0.retrieval.omb.preliminary-evidence.after-i2",
      receivingAuthorityReference: POP0_V0_PROVENANCE_ROOT,
      deduplicationIdentity: "pop0.dedupe.receipt.omb.preliminary-evidence.after-i2",
    });
    expect(session.getOfficeInformation(POP0_I2_OFFICE_IDS.omb).instrumentDispositions).toEqual([]);
    session.advanceTo(POP0_I3_TRACE_TIMES.disposition);
    recordFullOmbAcceptance(session);
    expect(officeAssignments(session, POP0_I2_OFFICE_IDS.omb))
      .not.toContainEqual(expect.objectContaining({ id: "pop0.assignment.omb.full-scope-analysis" }));
    session.advanceTo(POP0_I3_TRACE_TIMES.assignment);
    createFullOmbAssignment(session);
    const assignment = officeAssignments(session, POP0_I2_OFFICE_IDS.omb).find(
      (entry) => entry.id === "pop0.assignment.omb.full-scope-analysis",
    );
    expect(assignment?.status).toBe("QUEUED");
    expect(assignment?.resultArtifactIds).toEqual([]);
  });

  it("requires exact office receipt before disposition and never fans receipt out", () => {
    const session = createPop0I3TraceSession();
    runI3ThroughDecision(session);
    dispatchI3Instruments(session);
    session.advanceTo(POP0_I3_TRACE_TIMES.receipt);
    session.admitOfficeInstrumentReceipt(receiptInputs.chief);
    expect(session.getOfficeInformation(POP0_I2_OFFICE_IDS.omb).instrumentReceipts).toEqual([]);
    session.advanceTo(POP0_I3_TRACE_TIMES.disposition);
    expect(() => recordFullOmbAcceptance(session)).toThrow(/exact office receipt/i);
    expect(session.getOfficeInformation(POP0_I2_OFFICE_IDS.omb).instrumentDispositions).toEqual([]);
  });

  it("lets a no-capability recipient refuse but not accept or narrow the delivered instrument", () => {
    const base = POP0_V0_OPERATING_CONFIGURATION.administration;
    const configuration = withAdministration({
      ...base,
      recipientCapabilities: base.recipientCapabilities.map((capability) =>
        capability.id === POP0_I3_RECIPIENT_CAPABILITY_IDS.ombAnalysis
          ? { ...capability, recipientOfficeId: POP0_I2_OFFICE_IDS.legislativeAffairs }
          : capability),
    });
    const session = createConfiguredTraceSession(configuration);
    runI3ThroughReceipt(session);
    session.advanceTo(POP0_I3_TRACE_TIMES.disposition);
    const before = session.save();
    expect(() => recordFullOmbAcceptance(session)).toThrow(/matching capability/i);
    expect(session.save()).toBe(before);
    session.recordRecipientDisposition({
      id: "pop0.disposition.omb.refused-no-capability",
      deduplicationIdentity: "pop0.dedupe.disposition.omb.refused-no-capability",
      recipientOfficeId: POP0_I2_OFFICE_IDS.omb,
      instrumentReceiptId: POP0_I3_TRACE_IDS.ombInstrumentReceipt,
      authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.ombDirector,
      capabilityAuthorityId: null,
      kind: "REFUSED",
      acceptedProductKind: null,
      acceptedSectionIds: [],
      acceptedCoordinationActions: [],
      constraintIds: ["NO_EFFECTIVE_RECIPIENT_CAPABILITY"],
      reason: "No effective typed jurisdiction covers this delivered request.",
      limitations: [],
      nextReviewAt: null,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    expect(session.getOfficeInformation(POP0_I2_OFFICE_IDS.omb).instrumentDispositions[0])
      .toMatchObject({ kind: "REFUSED", capabilityAuthorityId: null });
  });

  it("is order-invariant across independent dispatch and receipt routes", () => {
    const source = createPop0I3TraceSession();
    runI3ThroughDecision(source);
    const checkpoint = source.save();

    const run = (dispatchOrder: readonly ("omb" | "chief")[], receiptOrder: readonly ("omb" | "chief")[]) => {
      const session = createPresidentialOperatingProofSession(checkpoint);
      session.advanceTo(POP0_I3_TRACE_TIMES.dispatch);
      dispatchOrder.forEach((key) => session.attemptInstrumentDispatch(dispatchInputs[key]));
      session.advanceTo(POP0_I3_TRACE_TIMES.receipt);
      receiptOrder.forEach((key) => session.admitOfficeInstrumentReceipt(receiptInputs[key]));
      return session.save();
    };

    expect(run(["omb", "chief"], ["omb", "chief"]))
      .toBe(run(["chief", "omb"], ["chief", "omb"]));
  });

  it("does not let a recipient response mutate the workstream without a later coordinator act", () => {
    const session = createPop0I3TraceSession();
    runI3ThroughReceipt(session);
    session.advanceTo(POP0_I3_TRACE_TIMES.disposition);
    session.recordRecipientDisposition({
      id: "pop0.disposition.chief-of-staff.refused",
      deduplicationIdentity: "pop0.dedupe.disposition.chief-of-staff.refused",
      recipientOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      instrumentReceiptId: POP0_I3_TRACE_IDS.chiefOfStaffInstrumentReceipt,
      authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.chiefOfStaff,
      capabilityAuthorityId: POP0_I3_RECIPIENT_CAPABILITY_IDS.chiefOfStaffCoordination,
      kind: "REFUSED",
      acceptedProductKind: null,
      acceptedSectionIds: [],
      acceptedCoordinationActions: [],
      constraintIds: ["OFFICE_QUEUE_OR_DEADLINE_CONSTRAINT"],
      reason: "The office independently declines this bounded request.",
      limitations: [],
      nextReviewAt: null,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    expect(session.getAdministrationWorkstream(POP0_I3_WORKSTREAM_ID).currentStatus).toBe("MONITORED");
    expect(officeAssignments(session, POP0_I2_OFFICE_IDS.chiefOfStaff))
      .not.toContainEqual(expect.objectContaining({ authorityReference: POP0_I3_TRACE_IDS.chiefOfStaffDisposition }));
  });
});
