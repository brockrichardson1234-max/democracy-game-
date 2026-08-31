import { describe, expect, it } from "vitest";

import { createPresidentialOperatingProofSession } from
  "../src/app/presidential-operating-proof-session";
import {
  POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS,
  POP0_I2_OFFICE_IDS,
  POP0_I2_SOURCE_ARTIFACT_ID,
  POP0_I2_SOURCE_SECTION_IDS,
  POP0_I3_RECIPIENT_CAPABILITY_IDS,
  POP0_V0_PROVENANCE_ROOT,
} from "../src/content/pop0-v0/configuration";
import {
  computePresidentialInstrumentPayloadHash,
  type PresidentialEscalationOption,
  type PresidentialInstrumentPayload,
} from "../src/sim/presidential-operating-intervention";
import {
  POP0_I3_TRACE_IDS,
  POP0_I3_TRACE_TIMES,
  createI3Escalation,
  createI3Workstream,
  createPop0I3Options,
  createPop0I3TraceSession,
  decideI3Option,
  presentI3Escalation,
  runFullPop0I3Trace,
  runI3ThroughDecision,
  runI3ThroughReceipt,
} from "./pop0-i3-proof-fixture";

type DeepMutable<T> = {
  -readonly [Key in keyof T]: T[Key] extends readonly (infer Item)[]
    ? DeepMutable<Item>[]
    : T[Key] extends object
      ? DeepMutable<T[Key]>
      : T[Key];
};

const asEscalationOptions = (
  value: DeepMutable<PresidentialEscalationOption>[],
): readonly PresidentialEscalationOption[] =>
  value as unknown as readonly PresidentialEscalationOption[];

const exactDecisionInput = {
  id: "pop0.decision.exact-deadline-rejected",
  deduplicationIdentity: "pop0.dedupe.decision.exact-deadline-rejected",
  sourceEscalationId: POP0_I3_TRACE_IDS.escalation,
  selectedOptionId: POP0_I3_TRACE_IDS.requestOption,
  basisEscalationPresentationId: POP0_I3_TRACE_IDS.escalationPresentation,
  acknowledgedUncertainties: [
    "The current record does not resolve the broader supplier-effect dispute",
  ],
  provenanceReference: POP0_V0_PROVENANCE_ROOT,
  supersedesDecisionId: null,
} as const;

const exactOmbDispositionInput = {
  id: "pop0.disposition.omb.exact-deadline-rejected",
  deduplicationIdentity: "pop0.dedupe.disposition.omb.exact-deadline-rejected",
  recipientOfficeId: POP0_I2_OFFICE_IDS.omb,
  instrumentReceiptId: POP0_I3_TRACE_IDS.ombInstrumentReceipt,
  authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.ombDirector,
  capabilityAuthorityId: POP0_I3_RECIPIENT_CAPABILITY_IDS.ombAnalysis,
  kind: "NARROWED" as const,
  acceptedProductKind: "METADATA_ACCESS_GAP_SCOPING",
  acceptedSectionIds: [],
  acceptedCoordinationActions: [],
  constraintIds: [],
  constraintSourceReferenceIds: [],
  reason: null,
  limitations: ["No substantive preliminary source receipt is available to OMB"],
  nextReviewAt: null,
  provenanceReference: POP0_V0_PROVENANCE_ROOT,
};

describe("POP0-I3 hostile operation and restoration boundaries", () => {
  it("rejects decision without a bounded escalation presentation and preserves prior bytes", () => {
    const session = createPop0I3TraceSession();
    createI3Workstream(session);
    createI3Escalation(session);
    const before = session.save();
    session.advanceTo(POP0_I3_TRACE_TIMES.decision);
    const atDecision = session.save();
    expect(() => session.recordPresidentialDecision(exactDecisionInput))
      .toThrow(/complete bounded escalation presentation/i);
    expect(session.save()).toBe(atDecision);
    expect(createPresidentialOperatingProofSession(session.save()).save()).toBe(atDecision);
    expect(before).not.toBe(atDecision);
    expect(session.getOperatingState().ownerStates.presidentialDecisions.state).toEqual([]);
  });

  it("rejects altered preview payload/hash and bundle position before committing an escalation", () => {
    const session = createPop0I3TraceSession();
    createI3Workstream(session);
    session.advanceTo(POP0_I3_TRACE_TIMES.escalation);
    const before = session.save();
    const badHashOptions = JSON.parse(JSON.stringify(createPop0I3Options())) as
      DeepMutable<PresidentialEscalationOption>[];
    const request = badHashOptions[0];
    if (request.kind !== "REQUEST_SCOPED_ANALYSIS_AND_COORDINATION") {
      throw new Error("Expected request option.");
    }
    const analysis = request.previews[0];
    if (analysis.payload.kind !== "REQUEST_OFFICE_ANALYSIS") throw new Error("Expected analysis payload.");
    analysis.payload.requestedAct = "A hidden behavior change after preview hashing";
    expect(() => createI3Escalation(session, asEscalationOptions(badHashOptions))).toThrow(/hash/i);
    expect(session.save()).toBe(before);

    const badOrderOptions = JSON.parse(JSON.stringify(createPop0I3Options())) as
      DeepMutable<PresidentialEscalationOption>[];
    const reordered = badOrderOptions[0];
    if (reordered.kind !== "REQUEST_SCOPED_ANALYSIS_AND_COORDINATION") {
      throw new Error("Expected request option.");
    }
    reordered.previews[0].bundlePosition = 1;
    reordered.previews[1].bundlePosition = 0;
    expect(() => createI3Escalation(session, asEscalationOptions(badOrderOptions)))
      .toThrow(/reordered|bundle/i);
    expect(session.save()).toBe(before);
  });

  it("rejects a post-presentation payload rewrite even when the attacker recomputes its hash", () => {
    const session = createPop0I3TraceSession();
    createI3Workstream(session);
    createI3Escalation(session);
    presentI3Escalation(session);
    const envelope = JSON.parse(session.save()) as {
      operatingState: {
        ownerStates: {
          presidentialEscalations: {
            state: {
              escalations: {
                options: {
                  previews: {
                    payload: DeepMutable<PresidentialInstrumentPayload>;
                    payloadHash: string;
                  }[];
                }[];
              }[];
            };
          };
        };
      };
    };
    const preview = envelope.operatingState.ownerStates.presidentialEscalations.state
      .escalations[0].options[0].previews[0];
    if (preview.payload.kind !== "REQUEST_OFFICE_ANALYSIS") throw new Error("Expected analysis payload.");
    preview.payload.requestedQuestion = "A substituted question that was never presented";
    preview.payloadHash = computePresidentialInstrumentPayloadHash(preview.payload);
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(envelope)))
      .toThrow(/stale|tampered preview evidence/i);
  });

  it("rejects a post-authorization instrument field change and a broken workstream chain", () => {
    const session = createPop0I3TraceSession();
    runFullPop0I3Trace(session);
    const instrumentEnvelope = JSON.parse(session.save()) as {
      operatingState: {
        ownerStates: {
          presidentialInstruments: {
            state: { payload: DeepMutable<PresidentialInstrumentPayload> }[];
          };
        };
      };
    };
    const payload = instrumentEnvelope.operatingState.ownerStates.presidentialInstruments.state[0].payload;
    if (payload.kind !== "REQUEST_OFFICE_ANALYSIS") throw new Error("Expected analysis payload.");
    payload.requestedResponseDeadline = "2029-02-05T13:00:00-05:00";
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(instrumentEnvelope)))
      .toThrow(/diverges|preview/i);

    const workstreamEnvelope = JSON.parse(session.save()) as {
      operatingState: {
        ownerStates: {
          administrationWorkstreams: {
            state: { transitions: { id: string; priorTransitionId: string | null }[] };
          };
        };
      };
    };
    const transition = workstreamEnvelope.operatingState.ownerStates.administrationWorkstreams
      .state.transitions[1];
    transition.priorTransitionId = transition.id;
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(workstreamEnvelope)))
      .toThrow(/broken prior chain|historical|immutable monitored creation transition/i);
  });

  it("lets deterministic default/no-action win exactly at both end-exclusive deadlines", () => {
    const decisionSession = createPop0I3TraceSession();
    createI3Workstream(decisionSession);
    createI3Escalation(decisionSession);
    presentI3Escalation(decisionSession);
    decisionSession.advanceTo(POP0_I3_TRACE_TIMES.escalationDeadline);
    const decisionBoundary = decisionSession.save();
    expect(() => decisionSession.recordPresidentialDecision(exactDecisionInput))
      .toThrow(/not active|deadline/i);
    expect(decisionSession.save()).toBe(decisionBoundary);
    expect(decisionSession.getOperatingState().ownerStates.presidentialEscalations.state
      .defaultOccurrences).toHaveLength(1);

    const dispositionSession = createPop0I3TraceSession();
    runI3ThroughReceipt(dispositionSession);
    dispositionSession.advanceTo(POP0_I3_TRACE_TIMES.responseDeadline);
    const dispositionBoundary = dispositionSession.save();
    expect(() => dispositionSession.recordRecipientDisposition(exactOmbDispositionInput))
      .toThrow(/at\/after its deadline/i);
    expect(dispositionSession.save()).toBe(dispositionBoundary);
    expect(dispositionSession.getOfficeInformation(POP0_I2_OFFICE_IDS.omb)
      .instrumentDispositions[0].kind).toBe("NO_ACTION_BY_DEADLINE");
  });

  it("derives due eligibility before same-instant cancellation, then removes final Attention", () => {
    const session = createPop0I3TraceSession();
    createI3Workstream(session);
    createI3Escalation(session);
    presentI3Escalation(session);
    decideI3Option(
      session,
      POP0_I3_TRACE_IDS.reserveOption,
      "pop0.decision.reserve-for-cancellation-test",
      "pop0.dedupe.decision.reserve-for-cancellation-test",
    );
    const reservationId = "pop0.decision.reserve-for-cancellation-test.reserved-review";
    session.advanceTo(POP0_I3_TRACE_TIMES.reservedReview);
    expect(session.getPresidentialAttention()).toEqual([
      expect.objectContaining({ kind: "DUE_RESERVED_REVIEW", reservationId }),
    ]);
    session.recordReservedReviewLifecycle({
      id: "pop0.reserved-review-lifecycle.cancelled-at-due",
      deduplicationIdentity: "pop0.dedupe.reserved-review-lifecycle.cancelled-at-due",
      reservationId,
      kind: "RESERVED_REVIEW_CANCELLED",
      actingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      actingOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.chiefOfStaff,
      causeRecordId: "pop0.decision.reserve-for-cancellation-test",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    expect(session.getPresidentialAttention()).toEqual([]);
    expect(createPresidentialOperatingProofSession(session.save()).save()).toBe(session.save());
  });

  it("materializes zero instruments for deliberate monitoring and creates no replacement behavior", () => {
    const session = createPop0I3TraceSession();
    createI3Workstream(session);
    createI3Escalation(session);
    presentI3Escalation(session);
    decideI3Option(
      session,
      POP0_I3_TRACE_IDS.monitoringOption,
      "pop0.decision.allow-monitoring-default",
      "pop0.dedupe.decision.allow-monitoring-default",
    );
    const state = session.getOperatingState();
    expect(state.ownerStates.presidentialInstruments.state).toEqual([]);
    expect(state.ownerStates.instrumentDispatches.state).toEqual([]);
    expect(state.ownerStates.officeOperations.state.flatMap((office) => office.assignments)
      .filter((assignment) => assignment.authorityReference.startsWith("pop0.decision"))).toEqual([]);
    expect(session.getPresidentialAttention()).toEqual([]);
  });

  it("rejects duplicate/conflicting terminal truth, self-supersession, and index tampering", () => {
    const session = createPop0I3TraceSession();
    runI3ThroughDecision(session);
    const duplicateEnvelope = JSON.parse(session.save()) as {
      operatingState: {
        ownerStates: {
          presidentialEscalations: {
            state: {
              lifecycleOccurrences: {
                id: string;
                deduplicationIdentity: string;
                escalationId: string;
                kind: string;
                occurredAt: string;
                actingOfficeId: string | null;
                actingOfficeholderAssignmentId: string | null;
                causeRecordId: string;
                provenanceReference: string;
              }[];
            };
          };
        };
      };
    };
    duplicateEnvelope.operatingState.ownerStates.presidentialEscalations.state.lifecycleOccurrences.push({
      id: "pop0.escalation-lifecycle.conflicting-withdrawal",
      deduplicationIdentity: "pop0.dedupe.escalation-lifecycle.conflicting-withdrawal",
      escalationId: POP0_I3_TRACE_IDS.escalation,
      kind: "ESCALATION_WITHDRAWN",
      occurredAt: POP0_I3_TRACE_TIMES.decision,
      actingOfficeId: POP0_I2_OFFICE_IDS.chiefOfStaff,
      actingOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.chiefOfStaff,
      causeRecordId: POP0_I3_TRACE_IDS.decision,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(duplicateEnvelope)))
      .toThrow(/conflicting terminal|historical/i);

    const cycleEnvelope = JSON.parse(session.save()) as typeof duplicateEnvelope;
    const lifecycle = cycleEnvelope.operatingState.ownerStates.presidentialEscalations
      .state.lifecycleOccurrences[0];
    lifecycle.kind = "ESCALATION_SUPERSEDED";
    lifecycle.actingOfficeId = POP0_I2_OFFICE_IDS.chiefOfStaff;
    lifecycle.actingOfficeholderAssignmentId = POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.chiefOfStaff;
    lifecycle.causeRecordId = POP0_I3_TRACE_IDS.escalation;
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(cycleEnvelope)))
      .toThrow(/supersession|cyclic|invalid/i);

    const indexEnvelope = JSON.parse(session.save()) as {
      operatingState: {
        ownerStates: {
          historicalRecordIndex: { state: { entries: { historyId: string }[] } };
        };
      };
    };
    indexEnvelope.operatingState.ownerStates.historicalRecordIndex.state.entries[0].historyId =
      "pop0.history.unknown";
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(indexEnvelope)))
      .toThrow(/history|historical/i);
  });

  it("rejects a metadata-only full-scope assignment tampered into proceeding state", () => {
    const session = createPop0I3TraceSession();
    runI3ThroughReceipt(session);
    session.advanceTo(POP0_I3_TRACE_TIMES.disposition);
    session.recordRecipientDisposition({
      id: "pop0.disposition.omb.hostile-full-acceptance",
      deduplicationIdentity: "pop0.dedupe.disposition.omb.hostile-full-acceptance",
      recipientOfficeId: POP0_I2_OFFICE_IDS.omb,
      instrumentReceiptId: POP0_I3_TRACE_IDS.ombInstrumentReceipt,
      authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.ombDirector,
      capabilityAuthorityId: POP0_I3_RECIPIENT_CAPABILITY_IDS.ombAnalysis,
      kind: "ACCEPTED_AS_REQUESTED",
      acceptedProductKind: "FISCAL_SUPPORTABILITY_SCOPING",
      acceptedSectionIds: Object.values(POP0_I2_SOURCE_SECTION_IDS),
      acceptedCoordinationActions: [],
      constraintIds: [],
      constraintSourceReferenceIds: [],
      reason: null,
      limitations: [],
      nextReviewAt: null,
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
    });
    session.advanceTo(POP0_I3_TRACE_TIMES.assignment);
    session.createInstrumentAuthorizedAssignment({
      id: "pop0.assignment.omb.hostile-full-scope",
      dispositionId: "pop0.disposition.omb.hostile-full-acceptance",
      requesterId: POP0_I2_OFFICE_IDS.omb,
      leadOfficeId: POP0_I2_OFFICE_IDS.omb,
      objective: "Bounded full-scope analysis",
      sourceReferenceIds: ["pop0.disposition.omb.hostile-full-acceptance"],
      requiredConsultationOfficeIds: [],
      authorityReference: "pop0.disposition.omb.hostile-full-acceptance",
      deadline: POP0_I3_TRACE_TIMES.assignmentDeadline,
      expectedProductKind: "FISCAL_SUPPORTABILITY_SCOPING",
      authorizationScope: {
        kind: "ANALYSIS_ASSIGNMENT_SCOPE",
        evidenceArtifactId: POP0_I2_SOURCE_ARTIFACT_ID,
        evidenceSectionIds: Object.values(POP0_I2_SOURCE_SECTION_IDS),
        productKind: "FISCAL_SUPPORTABILITY_SCOPING",
      },
    });
    const envelope = JSON.parse(session.save()) as {
      operatingState: {
        ownerStates: {
          officeOperations: {
            state: {
              officeId: string;
              assignments: {
                id: string;
                status: string;
                failureReason: string | null;
              }[];
            }[];
          };
        };
      };
    };
    const omb = envelope.operatingState.ownerStates.officeOperations.state.find(
      (office) => office.officeId === POP0_I2_OFFICE_IDS.omb,
    );
    const assignment = omb?.assignments.find(
      (entry) => entry.id === "pop0.assignment.omb.hostile-full-scope",
    );
    if (assignment === undefined) throw new Error("Missing hostile assignment fixture.");
    assignment.status = "IN_PROGRESS";
    assignment.failureReason = null;
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(envelope)))
      .toThrow(/proceeding without substantive receipt/i);
  });

  it("keeps idempotent retry stable and rejects a conflicting retry without mutation", () => {
    const session = createPop0I3TraceSession();
    createI3Workstream(session);
    createI3Escalation(session);
    const first = session.save();
    createI3Escalation(session);
    expect(session.save()).toBe(first);

    const changed = JSON.parse(JSON.stringify(createPop0I3Options())) as
      DeepMutable<PresidentialEscalationOption>[];
    const request = changed[0];
    if (request.kind !== "REQUEST_SCOPED_ANALYSIS_AND_COORDINATION" ||
      request.previews[0].payload.kind !== "REQUEST_OFFICE_ANALYSIS") {
      throw new Error("Expected analysis request option.");
    }
    request.previews[0].payload.requestedQuestion = "Conflicting retry payload";
    request.previews[0].payloadHash = computePresidentialInstrumentPayloadHash(
      request.previews[0].payload,
    );
    expect(() => createI3Escalation(session, asEscalationOptions(changed))).toThrow(/conflicts/i);
    expect(session.save()).toBe(first);
  });

  it("keeps presidential history free of recipient content after full recipient processing", () => {
    const session = createPop0I3TraceSession();
    runFullPop0I3Trace(session);
    const history = session.getPresidentialHistory();
    expect(JSON.stringify(history)).not.toMatch(/NARROWED|ACCEPTED|BLOCKED|metadata|assignment/i);
    expect(history.map((entry) => entry.occurrenceId)).toEqual([
      POP0_I3_TRACE_IDS.decision,
      POP0_I3_TRACE_IDS.ombInstrument,
      POP0_I3_TRACE_IDS.chiefOfStaffInstrument,
    ]);
    expect(session.getPresidentialAttention()).toEqual([]);
    expect(JSON.stringify(session.getPresidentialAttention())).not.toContain(
      POP0_I2_SOURCE_SECTION_IDS.methods,
    );
  });
});
