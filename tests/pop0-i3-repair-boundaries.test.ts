import { describe, expect, it } from "vitest";

import { createPresidentialOperatingProofSession } from
  "../src/app/presidential-operating-proof-session";
import {
  POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS,
  POP0_I2_OFFICE_IDS,
  POP0_I2_SOURCE_ARTIFACT_ID,
  POP0_I2_SOURCE_SECTION_IDS,
  POP0_I3_RECIPIENT_CAPABILITY_IDS,
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
  computePresidentialInstrumentPayloadHash,
  type PresidentialEscalationOption,
  type RecipientConstraint,
} from "../src/sim/presidential-operating-intervention";
import { POP0_I2_TRACE_IDS, runFullPop0I2Trace } from "./pop0-i2-proof-fixture";
import {
  POP0_I3_TRACE_IDS,
  POP0_I3_TRACE_TIMES,
  admitI3InstrumentReceipts,
  createI3Escalation,
  createI3Workstream,
  createPop0I3Options,
  createPop0I3TraceSession,
  decideI3RequestOption,
  dispatchI3Instruments,
  presentI3Escalation,
  runFullPop0I3Trace,
  runI3ThroughReceipt,
} from "./pop0-i3-proof-fixture";

type Mutable<T> = {
  -readonly [Key in keyof T]: T[Key] extends readonly (infer Item)[]
    ? Mutable<Item>[]
    : T[Key] extends object
      ? Mutable<T[Key]>
      : T[Key];
};

const chiefSources = [
  POP0_I2_TRACE_IDS.synthesis,
  POP0_I2_TRACE_IDS.laborAssessmentReceiptAtChiefOfStaff,
  POP0_I2_TRACE_IDS.necAssessmentReceiptAtChiefOfStaff,
  POP0_I2_TRACE_IDS.presentation,
] as const;

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
    housing: base.housing,
    concurrentWorld: base.concurrentWorld,
  };
  return {
    ...withoutHash,
    identity: {
      ...identityWithoutHash,
      configurationHash: computePresidentialOperatingConfigurationHash(withoutHash),
    },
  };
};

const configuredTrace = (
  administration: PresidentialAdministrationConfiguration,
) => {
  const session = createPresidentialOperatingProofSession(undefined, withAdministration(administration));
  runFullPop0I2Trace(session);
  return session;
};

const ombRefusal = (constraint: RecipientConstraint, capabilityAuthorityId: string | null) => ({
  id: `pop0.disposition.omb.hostile-${constraint.toLowerCase()}`,
  deduplicationIdentity: `pop0.dedupe.disposition.omb.hostile-${constraint.toLowerCase()}`,
  recipientOfficeId: POP0_I2_OFFICE_IDS.omb,
  instrumentReceiptId: POP0_I3_TRACE_IDS.ombInstrumentReceipt,
  authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.ombDirector,
  capabilityAuthorityId,
  kind: "REFUSED" as const,
  acceptedProductKind: null,
  acceptedSectionIds: [],
  acceptedCoordinationActions: [],
  constraintIds: [constraint],
  constraintSourceReferenceIds: [],
  reason: "Hostile causal-support probe",
  limitations: [],
  nextReviewAt: constraint === "EFFECTIVE_AUTHORITY_NOT_YET_AVAILABLE"
    ? "2029-02-05T10:30:00-05:00"
    : null,
  provenanceReference: POP0_V0_PROVENANCE_ROOT,
});

describe("POP0-I3 bounded semantic repair boundaries", () => {
  it("rejects an OMB-only occurrence as live Chief-of-Staff escalation support without mutation", () => {
    const session = createPop0I3TraceSession();
    createI3Workstream(session);
    session.advanceTo(POP0_I3_TRACE_TIMES.escalation);
    const before = session.save();
    expect(() => createI3Escalation(session, createPop0I3Options(), [
      ...chiefSources,
      POP0_I2_TRACE_IDS.ombRetrieval,
    ])).toThrow(/office|source records|unavailable/i);
    expect(session.save()).toBe(before);
  });

  it("rejects a staff-known but presidentially unpresented preview reference without mutation", () => {
    const session = createPop0I3TraceSession();
    createI3Workstream(session);
    const options = JSON.parse(JSON.stringify(createPop0I3Options())) as
      Mutable<PresidentialEscalationOption>[];
    const request = options[0];
    if (request.kind !== "REQUEST_SCOPED_ANALYSIS_AND_COORDINATION") {
      throw new Error("Expected request option fixture.");
    }
    const preview = request.previews[0];
    preview.payload.sourceReferenceIds.push(POP0_I2_TRACE_IDS.laborAssessmentReceiptAtChiefOfStaff);
    preview.payloadHash = computePresidentialInstrumentPayloadHash(preview.payload);
    session.advanceTo(POP0_I3_TRACE_TIMES.escalation);
    const before = session.save();
    expect(() => createI3Escalation(
      session,
      options as unknown as readonly PresidentialEscalationOption[],
    )).toThrow(/presidential disclosure/i);
    expect(session.save()).toBe(before);
  });

  it("rejects restored global-but-unauthorized escalation and preview references", () => {
    const source = createPop0I3TraceSession();
    createI3Workstream(source);
    createI3Escalation(source);

    const escalationEnvelope = JSON.parse(source.save()) as Mutable<{
      operatingState: { ownerStates: { presidentialEscalations: { state: {
        escalations: { sourceRecordIds: string[] }[];
      } } } };
    }>;
    escalationEnvelope.operatingState.ownerStates.presidentialEscalations.state
      .escalations[0].sourceRecordIds.push(POP0_I2_TRACE_IDS.ombRetrieval);
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(escalationEnvelope)))
      .toThrow(/source records|office|unavailable/i);

    const previewEnvelope = JSON.parse(source.save()) as Mutable<{
      operatingState: { ownerStates: { presidentialEscalations: { state: {
        escalations: { options: PresidentialEscalationOption[] }[];
      } } } };
    }>;
    const option = previewEnvelope.operatingState.ownerStates.presidentialEscalations.state
      .escalations[0].options[0];
    if (option.kind !== "REQUEST_SCOPED_ANALYSIS_AND_COORDINATION") {
      throw new Error("Expected request option fixture.");
    }
    option.previews[0].payload.sourceReferenceIds.push(
      POP0_I2_TRACE_IDS.laborAssessmentReceiptAtChiefOfStaff,
    );
    option.previews[0].payloadHash = computePresidentialInstrumentPayloadHash(
      option.previews[0].payload,
    );
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(previewEnvelope)))
      .toThrow(/presidential disclosure/i);
  });

  it("rejects every recipient constraint when its claimed canonical cause is false", () => {
    const cases: readonly {
      readonly constraint: RecipientConstraint;
      readonly capability: string | null;
      readonly expected: RegExp;
    }[] = [
      {
        constraint: "NO_EFFECTIVE_RECIPIENT_CAPABILITY",
        capability: null,
        expected: /contradicts canonical capability/i,
      },
      {
        constraint: "REQUEST_OUTSIDE_CAPABILITY",
        capability: POP0_I3_RECIPIENT_CAPABILITY_IDS.ombAnalysis,
        expected: /outside.*lacks|bounded capability/i,
      },
      {
        constraint: "OFFICE_QUEUE_OR_DEADLINE_CONSTRAINT",
        capability: POP0_I3_RECIPIENT_CAPABILITY_IDS.ombAnalysis,
        expected: /concrete office queue/i,
      },
      {
        constraint: "EFFECTIVE_AUTHORITY_NOT_YET_AVAILABLE",
        capability: POP0_I3_RECIPIENT_CAPABILITY_IDS.ombAnalysis,
        expected: /future authority/i,
      },
    ];
    for (const entry of cases) {
      const session = createPop0I3TraceSession();
      runI3ThroughReceipt(session);
      session.advanceTo(POP0_I3_TRACE_TIMES.disposition);
      const before = session.save();
      expect(() => session.recordRecipientDisposition(
        ombRefusal(entry.constraint, entry.capability),
      )).toThrow(entry.expected);
      expect(session.save()).toBe(before);
    }

    const coordination = createPop0I3TraceSession();
    runI3ThroughReceipt(coordination);
    coordination.advanceTo(POP0_I3_TRACE_TIMES.disposition);
    const before = coordination.save();
    expect(() => coordination.recordRecipientDisposition({
      ...ombRefusal("MISSING_REQUIRED_EVIDENCE", POP0_I3_RECIPIENT_CAPABILITY_IDS.chiefOfStaffCoordination),
      id: "pop0.disposition.chief.hostile-missing-evidence",
      deduplicationIdentity: "pop0.dedupe.disposition.chief.hostile-missing-evidence",
      recipientOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      instrumentReceiptId: POP0_I3_TRACE_IDS.chiefOfStaffInstrumentReceipt,
      authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.chiefOfStaff,
    })).toThrow(/unsupported for a coordination request/i);
    expect(coordination.save()).toBe(before);
  }, 35_000);

  it("accepts MISSING_REQUIRED_EVIDENCE only when the exact OMB evidence scope is absent", () => {
    const session = createPop0I3TraceSession();
    runI3ThroughReceipt(session);
    session.advanceTo(POP0_I3_TRACE_TIMES.disposition);
    session.recordRecipientDisposition(ombRefusal(
      "MISSING_REQUIRED_EVIDENCE",
      POP0_I3_RECIPIENT_CAPABILITY_IDS.ombAnalysis,
    ));
    expect(session.getOfficeInformation(POP0_I2_OFFICE_IDS.omb).instrumentDispositions[0])
      .toMatchObject({ constraintIds: ["MISSING_REQUIRED_EVIDENCE"] });
  });

  it("accepts outside-capability and future-authority constraints only under matching configured state", () => {
    const base = POP0_V0_OPERATING_CONFIGURATION.administration;
    const outside = configuredTrace({
      ...base,
      recipientCapabilities: base.recipientCapabilities.map((capability) =>
        capability.id === POP0_I3_RECIPIENT_CAPABILITY_IDS.ombAnalysis &&
          capability.kind === "ANALYSIS_CAPABILITY"
          ? { ...capability, permittedSubjectScopeFamilies: ["OTHER_BOUNDED_SUBJECT"] }
          : capability),
    });
    runI3ThroughReceipt(outside);
    outside.advanceTo(POP0_I3_TRACE_TIMES.disposition);
    outside.recordRecipientDisposition(ombRefusal(
      "REQUEST_OUTSIDE_CAPABILITY",
      POP0_I3_RECIPIENT_CAPABILITY_IDS.ombAnalysis,
    ));
    expect(outside.getOfficeInformation(POP0_I2_OFFICE_IDS.omb).instrumentDispositions[0])
      .toMatchObject({ constraintIds: ["REQUEST_OUTSIDE_CAPABILITY"] });

    const future = configuredTrace({
      ...base,
      recipientCapabilities: base.recipientCapabilities.map((capability) =>
        capability.id === POP0_I3_RECIPIENT_CAPABILITY_IDS.ombAnalysis
          ? { ...capability, effectiveFrom: "2029-02-05T10:30:00-05:00" }
          : capability),
    });
    runI3ThroughReceipt(future);
    future.advanceTo(POP0_I3_TRACE_TIMES.disposition);
    future.recordRecipientDisposition({
      ...ombRefusal(
        "EFFECTIVE_AUTHORITY_NOT_YET_AVAILABLE",
        POP0_I3_RECIPIENT_CAPABILITY_IDS.ombAnalysis,
      ),
      id: "pop0.disposition.omb.delayed-future-authority",
      deduplicationIdentity: "pop0.dedupe.disposition.omb.delayed-future-authority",
      kind: "DELAYED",
    });
    expect(future.getOfficeInformation(POP0_I2_OFFICE_IDS.omb).instrumentDispositions[0])
      .toMatchObject({ kind: "DELAYED", constraintIds: ["EFFECTIVE_AUTHORITY_NOT_YET_AVAILABLE"] });
  });

  it("does not let capability authority override a preview that forbids narrowing", () => {
    const session = createPop0I3TraceSession();
    createI3Workstream(session);
    const options = JSON.parse(JSON.stringify(createPop0I3Options())) as
      Mutable<PresidentialEscalationOption>[];
    const request = options[0];
    if (request.kind !== "REQUEST_SCOPED_ANALYSIS_AND_COORDINATION" ||
      request.previews[0].payload.kind !== "REQUEST_OFFICE_ANALYSIS") {
      throw new Error("Expected analysis preview fixture.");
    }
    request.previews[0].payload.narrowingPermitted = false;
    request.previews[0].payloadHash = computePresidentialInstrumentPayloadHash(
      request.previews[0].payload,
    );
    createI3Escalation(
      session,
      options as unknown as readonly PresidentialEscalationOption[],
    );
    presentI3Escalation(session);
    decideI3RequestOption(session);
    dispatchI3Instruments(session);
    admitI3InstrumentReceipts(session);
    session.advanceTo(POP0_I3_TRACE_TIMES.disposition);
    const before = session.save();
    expect(() => session.recordRecipientDisposition({
      id: POP0_I3_TRACE_IDS.ombDisposition,
      deduplicationIdentity: "pop0.dedupe.disposition.omb.hostile-narrowing",
      recipientOfficeId: POP0_I2_OFFICE_IDS.omb,
      instrumentReceiptId: POP0_I3_TRACE_IDS.ombInstrumentReceipt,
      authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.ombDirector,
      capabilityAuthorityId: POP0_I3_RECIPIENT_CAPABILITY_IDS.ombAnalysis,
      kind: "NARROWED",
      acceptedProductKind: "METADATA_ACCESS_GAP_SCOPING",
      acceptedSectionIds: [],
      acceptedCoordinationActions: [],
      constraintIds: [],
      constraintSourceReferenceIds: [],
      reason: null,
      limitations: [],
      nextReviewAt: null,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    })).toThrow(/narrowing/i);
    expect(session.save()).toBe(before);
  });

  it("rejects a substituted product absent from permittedLessClaimingProductKinds", () => {
    const base = POP0_V0_OPERATING_CONFIGURATION.administration;
    const session = configuredTrace({
      ...base,
      recipientCapabilities: base.recipientCapabilities.map((capability) =>
        capability.id === POP0_I3_RECIPIENT_CAPABILITY_IDS.ombAnalysis &&
          capability.kind === "ANALYSIS_CAPABILITY"
          ? { ...capability, permittedLessClaimingProductKinds: [] }
          : capability),
    });
    runI3ThroughReceipt(session);
    session.advanceTo(POP0_I3_TRACE_TIMES.disposition);
    const before = session.save();
    expect(() => session.recordRecipientDisposition({
      id: POP0_I3_TRACE_IDS.ombDisposition,
      deduplicationIdentity: "pop0.dedupe.disposition.omb.unpermitted-product-substitution",
      recipientOfficeId: POP0_I2_OFFICE_IDS.omb,
      instrumentReceiptId: POP0_I3_TRACE_IDS.ombInstrumentReceipt,
      authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.ombDirector,
      capabilityAuthorityId: POP0_I3_RECIPIENT_CAPABILITY_IDS.ombAnalysis,
      kind: "NARROWED",
      acceptedProductKind: "METADATA_ACCESS_GAP_SCOPING",
      acceptedSectionIds: [],
      acceptedCoordinationActions: [],
      constraintIds: [],
      constraintSourceReferenceIds: [],
      reason: null,
      limitations: [],
      nextReviewAt: null,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    })).toThrow(/narrowing/i);
    expect(session.save()).toBe(before);
  });

  it("rejects broader typed assignment evidence and source scope without mutation", () => {
    const session = createPop0I3TraceSession();
    runI3ThroughReceipt(session);
    session.advanceTo(POP0_I3_TRACE_TIMES.disposition);
    session.recordRecipientDisposition({
      id: POP0_I3_TRACE_IDS.ombDisposition,
      deduplicationIdentity: "pop0.dedupe.disposition.omb.repair-narrowing",
      recipientOfficeId: POP0_I2_OFFICE_IDS.omb,
      instrumentReceiptId: POP0_I3_TRACE_IDS.ombInstrumentReceipt,
      authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.ombDirector,
      capabilityAuthorityId: POP0_I3_RECIPIENT_CAPABILITY_IDS.ombAnalysis,
      kind: "NARROWED",
      acceptedProductKind: "METADATA_ACCESS_GAP_SCOPING",
      acceptedSectionIds: [],
      acceptedCoordinationActions: [],
      constraintIds: [],
      constraintSourceReferenceIds: [],
      reason: null,
      limitations: [],
      nextReviewAt: null,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    session.advanceTo(POP0_I3_TRACE_TIMES.assignment);
    const broadScope = {
      id: "pop0.assignment.omb.hostile-broad-scope",
      dispositionId: POP0_I3_TRACE_IDS.ombDisposition,
      requesterId: POP0_I2_OFFICE_IDS.omb,
      leadOfficeId: POP0_I2_OFFICE_IDS.omb,
      objective: "Free text cannot widen the typed authorization",
      sourceReferenceIds: [POP0_I3_TRACE_IDS.ombDisposition],
      requiredConsultationOfficeIds: [],
      authorityReference: POP0_I3_TRACE_IDS.ombDisposition,
      deadline: POP0_I3_TRACE_TIMES.assignmentDeadline,
      expectedProductKind: "METADATA_ACCESS_GAP_SCOPING",
      authorizationScope: {
        kind: "ANALYSIS_ASSIGNMENT_SCOPE" as const,
        evidenceArtifactId: POP0_I2_SOURCE_ARTIFACT_ID,
        evidenceSectionIds: [POP0_I2_SOURCE_SECTION_IDS.summary],
        productKind: "METADATA_ACCESS_GAP_SCOPING",
      },
    };
    const before = session.save();
    expect(() => session.createInstrumentAuthorizedAssignment(broadScope))
      .toThrow(/accepted analysis scope/i);
    expect(session.save()).toBe(before);
    expect(() => session.createInstrumentAuthorizedAssignment({
      ...broadScope,
      id: "pop0.assignment.omb.hostile-broad-source",
      sourceReferenceIds: [POP0_I3_TRACE_IDS.ombDisposition, POP0_I2_TRACE_IDS.ombAssessment],
      authorizationScope: { ...broadScope.authorizationScope, evidenceSectionIds: [] },
    })).toThrow(/typed source scope/i);
    expect(session.save()).toBe(before);
  });

  it("rejects save tampering of assignment authorization scope or binding presence", () => {
    const session = createPop0I3TraceSession();
    runFullPop0I3Trace(session);
    type Envelope = {
      operatingState: { ownerStates: { officeOperations: { state: {
        officeId: string;
        instrumentAssignmentAuthorizations: {
          assignmentId: string;
          scope: { evidenceSectionIds: string[] };
        }[];
      }[] } } };
    };
    const broad = JSON.parse(session.save()) as Envelope;
    const omb = broad.operatingState.ownerStates.officeOperations.state.find(
      (office) => office.officeId === POP0_I2_OFFICE_IDS.omb,
    );
    const binding = omb?.instrumentAssignmentAuthorizations.find(
      (entry) => entry.assignmentId === POP0_I3_TRACE_IDS.ombAssignment,
    );
    if (binding === undefined) throw new Error("Missing assignment authority fixture.");
    binding.scope.evidenceSectionIds.push(POP0_I2_SOURCE_SECTION_IDS.summary);
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(broad)))
      .toThrow(/accepted analysis scope/i);

    const missing = JSON.parse(session.save()) as Envelope;
    const missingOmb = missing.operatingState.ownerStates.officeOperations.state.find(
      (office) => office.officeId === POP0_I2_OFFICE_IDS.omb,
    );
    if (missingOmb === undefined) throw new Error("Missing OMB state fixture.");
    missingOmb.instrumentAssignmentAuthorizations = [];
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(missing)))
      .toThrow(/authority|disposition/i);
  });

  it("rejects an ENDED ControlBinding whose immutable I3 actor was substituted", () => {
    const session = createPop0I3TraceSession();
    const envelope = JSON.parse(session.save()) as {
      operatingState: { ownerStates: { calendar: { state: { current: string } } } };
      session: { controlBinding: {
        boundOfficeholderActorId: string;
        status: string;
        endedAt: string | null;
        endReason: string | null;
      } };
    };
    envelope.session.controlBinding.status = "ENDED";
    envelope.session.controlBinding.endedAt =
      envelope.operatingState.ownerStates.calendar.state.current;
    envelope.session.controlBinding.endReason = "TERM_ENDED";
    envelope.session.controlBinding.boundOfficeholderActorId = "pop0.actor.substituted";
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(envelope)))
      .toThrow(/substituted actor identity/i);
  });
});
