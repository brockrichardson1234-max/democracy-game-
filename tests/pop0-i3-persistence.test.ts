import { describe, expect, it } from "vitest";

import { createPresidentialOperatingProofSession } from
  "../src/app/presidential-operating-proof-session";
import { PRESIDENTIAL_OPERATING_SAVE_FORMAT_VERSION } from
  "../src/app/presidential-operating-persistence";
import {
  POP0_I2_ASSESSMENT_RULE_IDS,
  POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS,
  POP0_I2_OFFICE_IDS,
  POP0_V0_PROVENANCE_ROOT,
} from "../src/content/pop0-v0/configuration";
import {
  POP0_I2_ASSESSMENT_SECTION_IDS,
  POP0_I2_TRACE_IDS,
} from "./pop0-i2-proof-fixture";
import {
  POP0_I3_TRACE_IDS,
  POP0_I3_TRACE_TIMES,
  admitI3InstrumentReceipts,
  createI3Escalation,
  createI3OmbAssignment,
  createI3Workstream,
  createPop0I3Options,
  createPop0I3TraceSession,
  decideI3Option,
  decideI3RequestOption,
  dispatchI3Instruments,
  dispositionI3Instruments,
  presentI3Escalation,
  runFullPop0I3Trace,
  runI3ThroughDecision,
  runI3ThroughReceipt,
  transitionI3Workstream,
} from "./pop0-i3-proof-fixture";

const roundTrip = (saved: string): string =>
  createPresidentialOperatingProofSession(saved).save();

describe("POP0-I3 atomic persistence and deterministic boundaries", () => {
  it("round-trips all canonical I3 checkpoints byte-stably", () => {
    const checkpoints: string[] = [];
    const session = createPop0I3TraceSession();
    checkpoints.push(session.save());
    createI3Workstream(session);
    checkpoints.push(session.save());
    createI3Escalation(session);
    checkpoints.push(session.save());
    presentI3Escalation(session);
    checkpoints.push(session.save());
    decideI3RequestOption(session);
    checkpoints.push(session.save());
    dispatchI3Instruments(session);
    checkpoints.push(session.save());
    admitI3InstrumentReceipts(session);
    checkpoints.push(session.save());
    dispositionI3Instruments(session);
    checkpoints.push(session.save());
    createI3OmbAssignment(session);
    checkpoints.push(session.save());
    transitionI3Workstream(session);
    checkpoints.push(session.save());

    for (const saved of checkpoints) {
      expect(roundTrip(saved)).toBe(saved);
      expect(roundTrip(roundTrip(saved))).toBe(saved);
    }
  });

  it("serializes session permission outside canonical operating state at format 5", () => {
    const session = createPop0I3TraceSession();
    runI3ThroughDecision(session);
    const envelope = JSON.parse(session.save()) as {
      formatVersion: number;
      session: { controlBinding: { id: string; status: string } };
      operatingState: { ownerStates: Record<string, unknown> };
    };
    expect(envelope.formatVersion).toBe(PRESIDENTIAL_OPERATING_SAVE_FORMAT_VERSION);
    expect(envelope.formatVersion).toBe(5);
    expect(envelope.session.controlBinding).toMatchObject({
      id: "pop0.control-binding.presidential-operating",
      status: "ACTIVE",
    });
    expect(envelope.operatingState.ownerStates).not.toHaveProperty("controlBinding");
  });

  it("restores a valid ended binding byte-stably without silently reconciling it", () => {
    const session = createPop0I3TraceSession();
    const envelope = JSON.parse(session.save()) as {
      operatingState: { ownerStates: { calendar: { state: { current: string } } } };
      session: {
        controlBinding: {
          status: string;
          endedAt: string | null;
          endReason: string | null;
        };
      };
    };
    envelope.session.controlBinding.status = "ENDED";
    envelope.session.controlBinding.endedAt =
      envelope.operatingState.ownerStates.calendar.state.current;
    envelope.session.controlBinding.endReason = "TERM_ENDED";
    const ended = JSON.stringify(envelope);
    const restored = createPresidentialOperatingProofSession(ended);
    expect(restored.save()).toBe(ended);
    expect(restored.getControlBinding().status).toBe("ENDED");
    expect(() => {
      createI3Workstream(restored);
      createI3Escalation(restored);
      presentI3Escalation(restored);
      decideI3RequestOption(restored);
    }).toThrow(/active presidential ControlBinding/i);
  });

  it("rejects stale active authority rather than mutating it during load", () => {
    const session = createPop0I3TraceSession();
    const envelope = JSON.parse(session.save()) as {
      session: { controlBinding: { boundOfficeholderActorId: string } };
    };
    envelope.session.controlBinding.boundOfficeholderActorId = "pop0.actor.someone-else";
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(envelope)))
      .toThrow(/stale|tampered/i);
    expect(session.getControlBinding().status).toBe("ACTIVE");
  });

  it("derives reserved-review due Attention without leaking unpresented staff identity/content", () => {
    const session = createPop0I3TraceSession();
    createI3Workstream(session);
    const unpresentedFollowUpId = "pop0.artifact.assessment.omb-unpresented-follow-up.v1";
    const options = createPop0I3Options().map((option) => option.kind === "RESERVE_PRESIDENTIAL_REVIEW"
      ? { ...option, expectedSourceReferenceIds: [unpresentedFollowUpId] }
      : option);
    createI3Escalation(session, options);
    presentI3Escalation(session);
    decideI3Option(
      session,
      POP0_I3_TRACE_IDS.reserveOption,
      "pop0.decision.reserve-preliminary-labor-review",
      "pop0.dedupe.decision.reserve-preliminary-labor-review",
    );
    session.advanceTo("2029-02-05T10:15:00-05:00");
    session.authorAssessment({
      id: unpresentedFollowUpId,
      version: "1",
      sectionIds: POP0_I2_ASSESSMENT_SECTION_IDS,
      producingOfficeId: POP0_I2_OFFICE_IDS.omb,
      authoringOfficeholderAssignmentId: POP0_I2_OFFICEHOLDER_ASSIGNMENT_IDS.ombDirector,
      assignmentId: POP0_I2_TRACE_IDS.ombAssignment,
      sourceReceiptIds: [],
      sourceRetrievalIds: [POP0_I2_TRACE_IDS.ombRetrieval],
      sourceMetadataNoticeIds: [POP0_I2_TRACE_IDS.ombNotice],
      judgmentRuleIds: [POP0_I2_ASSESSMENT_RULE_IDS.metadataCannotSupportEstimate],
      claimedConfidence: "HIGH_ON_NON_ESTIMABILITY",
      evidentiarySupport: "METADATA_AND_ACCESS_DENIAL_ONLY",
      assumptionIds: [],
      limitations: ["This new follow-up has not been presented to the President"],
      recommendation: "Retain staff-only handling",
      provenanceReference: POP0_V0_PROVENANCE_ROOT,
      revisionOfArtifactId: null,
      supersedesArtifactId: null,
    });
    const before = session.save();
    expect(session.getPresidentialAttention()).toEqual([]);
    expect(roundTrip(before)).toBe(before);

    session.advanceTo(POP0_I3_TRACE_TIMES.reservedReview);
    const attention = session.getPresidentialAttention();
    expect(attention).toHaveLength(1);
    expect(attention[0]).toMatchObject({
      kind: "DUE_RESERVED_REVIEW",
      expectedProductPresented: false,
    });
    expect(JSON.stringify(attention)).not.toContain(unpresentedFollowUpId);
    expect(JSON.stringify(attention)).not.toMatch(/not estimable|metadata|access denial/i);
    expect(roundTrip(session.save())).toBe(session.save());
  });

  it("makes coarse, fine, and save-before-deadline advancement identical", () => {
    const source = createPop0I3TraceSession();
    createI3Workstream(source);
    createI3Escalation(source);
    const checkpoint = source.save();

    const coarse = createPresidentialOperatingProofSession(checkpoint);
    coarse.advanceTo("2029-02-05T11:00:00-05:00");

    const fine = createPresidentialOperatingProofSession(checkpoint);
    fine.advanceTo("2029-02-05T10:29:00-05:00");
    fine.advanceTo(POP0_I3_TRACE_TIMES.escalationDeadline);
    fine.advanceTo("2029-02-05T11:00:00-05:00");

    const restored = createPresidentialOperatingProofSession(roundTrip(checkpoint));
    restored.advanceTo("2029-02-05T11:00:00-05:00");

    expect(fine.save()).toBe(coarse.save());
    expect(restored.save()).toBe(coarse.save());
    expect(coarse.getPresidentialAttention()).toEqual([]);
    expect(coarse.getOperatingState().ownerStates.presidentialEscalations.state)
      .toMatchObject({
        defaultOccurrences: [{
          occurredAt: POP0_I3_TRACE_TIMES.escalationDeadline,
        }],
        lifecycleOccurrences: [{
          kind: "ESCALATION_EXPIRED_TO_DEFAULT",
          occurredAt: POP0_I3_TRACE_TIMES.escalationDeadline,
        }],
      });
  });

  it("creates recipient no-action at the exact deadline and no replacement behavior", () => {
    const source = createPop0I3TraceSession();
    runI3ThroughReceipt(source);
    const checkpoint = source.save();
    const direct = createPresidentialOperatingProofSession(checkpoint);
    direct.advanceTo(POP0_I3_TRACE_TIMES.responseDeadline);
    const dispositions = direct.getOperatingState().ownerStates.officeOperations.state
      .flatMap((office) => office.instrumentDispositions);
    expect(dispositions).toHaveLength(2);
    expect(dispositions.every((entry) => entry.kind === "NO_ACTION_BY_DEADLINE")).toBe(true);
    expect(dispositions.every((entry) => entry.dispositionAt === POP0_I3_TRACE_TIMES.responseDeadline))
      .toBe(true);
    expect(direct.getOperatingState().ownerStates.officeOperations.state
      .flatMap((office) => office.assignments)
      .some((assignment) => assignment.id === POP0_I3_TRACE_IDS.ombAssignment)).toBe(false);
  });

  it("rejects post-boundary saves missing deterministic closure instead of repairing on load", () => {
    const session = createPop0I3TraceSession();
    createI3Workstream(session);
    createI3Escalation(session);
    const envelope = JSON.parse(session.save()) as {
      operatingState: {
        ownerStates: { calendar: { state: { current: string } } };
      };
    };
    envelope.operatingState.ownerStates.calendar.state.current =
      POP0_I3_TRACE_TIMES.escalationDeadline;
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(envelope)))
      .toThrow(/deterministic closure/i);
  });

  it("rejects format 2 rather than fabricating I3 history", () => {
    const session = createPop0I3TraceSession();
    const envelope = JSON.parse(session.save()) as { formatVersion: number };
    envelope.formatVersion = 2;
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(envelope)))
      .toThrow(/Unsupported presidential operating save format: 2/);
  });

  it("persists the complete worked trace without replaying any operation", () => {
    const session = createPop0I3TraceSession();
    runFullPop0I3Trace(session);
    const saved = session.save();
    const restored = createPresidentialOperatingProofSession(saved);
    expect(restored.save()).toBe(saved);
    expect(restored.getOfficeInformation(POP0_I2_OFFICE_IDS.omb).instrumentDispositions)
      .toHaveLength(1);
    expect(restored.getOperatingState().ownerStates.instrumentDispatches.state).toHaveLength(2);
    expect(restored.getOperatingState().ownerStates.historicalRecordIndex.state.entries)
      .toEqual(session.getOperatingState().ownerStates.historicalRecordIndex.state.entries);
  });
});
