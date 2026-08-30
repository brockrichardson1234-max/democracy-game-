import { describe, expect, it } from "vitest";

import { createPresidentialOperatingProofSession } from "../src/app/presidential-operating-proof-session";
import { PRESIDENTIAL_OPERATING_SAVE_FORMAT_VERSION } from "../src/app/presidential-operating-persistence";
import { POP0_I2_OFFICE_IDS } from "../src/content/pop0-v0/configuration";
import {
  POP0_I2_TRACE_IDS,
  admitProofReceiptsAndResolveQueues,
  attemptProofRetrievals,
  authorChiefOfStaffSynthesis,
  createPop0I2TraceSession,
  createProofAssignments,
  deliverProofNotices,
  establishPossessionAndIndex,
  presentBoundedSynthesis,
  runFullPop0I2Trace,
  runPop0I2ThroughDisagreement,
  runPop0I2ThroughNotice,
  runPop0I2ThroughRetrieval,
  transferAssessmentsToChiefOfStaff,
} from "./pop0-i2-proof-fixture";

const checkpointSaves = (): readonly string[] => {
  const afterNotice = createPop0I2TraceSession();
  runPop0I2ThroughNotice(afterNotice);

  const afterRetrieval = createPop0I2TraceSession();
  runPop0I2ThroughRetrieval(afterRetrieval);

  const differentQueues = createPop0I2TraceSession();
  establishPossessionAndIndex(differentQueues);
  deliverProofNotices(differentQueues);
  createProofAssignments(differentQueues);
  attemptProofRetrievals(differentQueues);
  admitProofReceiptsAndResolveQueues(differentQueues);

  const afterDisagreement = createPop0I2TraceSession();
  runPop0I2ThroughDisagreement(afterDisagreement);

  const afterPresentation = createPop0I2TraceSession();
  runFullPop0I2Trace(afterPresentation);

  return [
    afterNotice.save(),
    afterRetrieval.save(),
    differentQueues.save(),
    afterDisagreement.save(),
    afterPresentation.save(),
  ];
};

describe("POP0-I2 atomic persistence", () => {
  it("restores all five nontrivial checkpoints byte-stably and idempotently", () => {
    for (const saved of checkpointSaves()) {
      const restored = createPresidentialOperatingProofSession(saved);
      const secondRestore = createPresidentialOperatingProofSession(restored.save());
      expect(restored.save()).toBe(saved);
      expect(secondRestore.save()).toBe(saved);
      expect(secondRestore.getOperatingState()).toEqual(restored.getOperatingState());
    }
  });

  it("keeps retrieval-before-receipt and independent queue state exact after load", () => {
    const retrievalSession = createPop0I2TraceSession();
    runPop0I2ThroughRetrieval(retrievalSession);
    const retrievalRestore = createPresidentialOperatingProofSession(retrievalSession.save());
    expect(retrievalRestore.getOfficeInformation(POP0_I2_OFFICE_IDS.nec).retrievals).toHaveLength(1);
    expect(retrievalRestore.getOfficeInformation(POP0_I2_OFFICE_IDS.nec).receipts).toHaveLength(0);

    admitProofReceiptsAndResolveQueues(retrievalRestore);
    const officeStates = retrievalRestore.getOperatingState().ownerStates.officeOperations.state;
    expect(officeStates.find((entry) => entry.officeId === POP0_I2_OFFICE_IDS.nec)?.assignments[0].status)
      .toBe("IN_PROGRESS");
    expect(officeStates.find((entry) => entry.officeId === POP0_I2_OFFICE_IDS.omb)?.assignments[0].status)
      .toBe("BLOCKED");
  });

  it("does not append or replay route, assessment, synthesis, or presentation occurrences on load", () => {
    const session = createPop0I2TraceSession();
    runFullPop0I2Trace(session);
    const before = session.getOperatingState();
    const restored = createPresidentialOperatingProofSession(session.save()).getOperatingState();
    expect(restored.ownerStates.informationRoutes.state.institutionPossessions)
      .toHaveLength(before.ownerStates.informationRoutes.state.institutionPossessions.length);
    expect(restored.ownerStates.informationRoutes.state.retrievals)
      .toHaveLength(before.ownerStates.informationRoutes.state.retrievals.length);
    expect(restored.ownerStates.informationRoutes.state.receipts)
      .toHaveLength(before.ownerStates.informationRoutes.state.receipts.length);
    expect(restored.ownerStates.informationRoutes.state.artifacts)
      .toHaveLength(before.ownerStates.informationRoutes.state.artifacts.length);
    expect(restored.ownerStates.presidentialPresentations.state.presentations).toHaveLength(1);
  });

  it("returns deep defensive copies for every new owner family", () => {
    const session = createPop0I2TraceSession();
    runFullPop0I2Trace(session);
    const left = session.getOperatingState();
    const right = session.getOperatingState();
    expect(right).not.toBe(left);
    expect(right.ownerStates.administrationDirectory.state.officeholderAssignments)
      .not.toBe(left.ownerStates.administrationDirectory.state.officeholderAssignments);
    expect(right.ownerStates.officeOperations.state)
      .not.toBe(left.ownerStates.officeOperations.state);
    expect(right.ownerStates.informationRoutes.state.artifacts)
      .not.toBe(left.ownerStates.informationRoutes.state.artifacts);
    expect(right.ownerStates.informationRoutes.state.receipts)
      .not.toBe(left.ownerStates.informationRoutes.state.receipts);
    expect(right.ownerStates.presidentialPresentations.state.presentations)
      .not.toBe(left.ownerStates.presidentialPresentations.state.presentations);
  });

  it("continues deterministically from the same restored disagreement checkpoint", () => {
    const session = createPop0I2TraceSession();
    runPop0I2ThroughDisagreement(session);
    const left = createPresidentialOperatingProofSession(session.save());
    const right = createPresidentialOperatingProofSession(session.save());
    for (const continuation of [left, right]) {
      transferAssessmentsToChiefOfStaff(continuation);
      authorChiefOfStaffSynthesis(continuation);
      presentBoundedSynthesis(continuation);
    }
    expect(right.save()).toBe(left.save());
  });

  it("rejects I1 format saves and unsupported owner shapes", () => {
    const session = createPop0I2TraceSession();
    const oldFormat = JSON.parse(session.save()) as { formatVersion: number };
    oldFormat.formatVersion = 1;
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(oldFormat)))
      .toThrow(/Unsupported presidential operating save format: 1/);

    const missingOwner = JSON.parse(session.save()) as {
      operatingState: { ownerStates: Record<string, unknown> };
    };
    delete missingOwner.operatingState.ownerStates.informationRoutes;
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(missingOwner)))
      .toThrow(/unsupported shape/i);

    const extraArtifactField = JSON.parse(session.save()) as {
      operatingState: {
        ownerStates: {
          informationRoutes: { state: { artifacts: Record<string, unknown>[] } };
        };
      };
    };
    extraArtifactField.operatingState.ownerStates.informationRoutes.state.artifacts[0].uiRead = true;
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(extraArtifactField)))
      .toThrow(/unsupported shape/i);
  });

  it("rejects cross-office queue, receipt, and presentation tampering", () => {
    const assignments = createPop0I2TraceSession();
    establishPossessionAndIndex(assignments);
    deliverProofNotices(assignments);
    createProofAssignments(assignments);
    const crossedQueue = JSON.parse(assignments.save()) as {
      operatingState: {
        ownerStates: {
          officeOperations: {
            state: { officeId: string; activeQueueAssignmentIds: string[] }[];
          };
        };
      };
    };
    const omb = crossedQueue.operatingState.ownerStates.officeOperations.state.find(
      (entry) => entry.officeId === POP0_I2_OFFICE_IDS.omb,
    );
    if (omb === undefined) throw new Error("Expected OMB state.");
    omb.activeQueueAssignmentIds.push(POP0_I2_TRACE_IDS.necAssignment);
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(crossedQueue)))
      .toThrow(/queue crosses an ownership boundary/i);

    const disagreement = createPop0I2TraceSession();
    runPop0I2ThroughDisagreement(disagreement);
    const crossedReceipt = JSON.parse(disagreement.save()) as {
      operatingState: {
        ownerStates: {
          informationRoutes: {
            state: { receipts: { id: string; recipientOfficeId: string }[] };
          };
        };
      };
    };
    const necReceipt = crossedReceipt.operatingState.ownerStates.informationRoutes.state.receipts.find(
      (entry) => entry.id === POP0_I2_TRACE_IDS.necReceipt,
    );
    if (necReceipt === undefined) throw new Error("Expected NEC receipt.");
    necReceipt.recipientOfficeId = POP0_I2_OFFICE_IDS.omb;
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(crossedReceipt)))
      .toThrow(/invalid|lacks office-owned receipt/i);

    const presented = createPop0I2TraceSession();
    runFullPop0I2Trace(presented);
    const overexposed = JSON.parse(presented.save()) as {
      operatingState: {
        ownerStates: {
          presidentialPresentations: {
            state: {
              presentations: {
                shownPortions: { artifactId: string; sectionId: string }[];
              }[];
            };
          };
        };
      };
    };
    overexposed.operatingState.ownerStates.presidentialPresentations.state.presentations[0]
      .shownPortions.push({
        artifactId: "pop0.artifact.preliminary-labor-evidence.v1",
        sectionId: "preliminary-summary",
      });
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(overexposed)))
      .toThrow(/shows an unavailable artifact portion/i);
  });

  it("serializes the version-3 envelope without any opaque legacy save", () => {
    const session = createPop0I2TraceSession();
    runFullPop0I2Trace(session);
    const envelope = JSON.parse(session.save()) as Record<string, unknown>;
    expect(envelope.formatVersion).toBe(PRESIDENTIAL_OPERATING_SAVE_FORMAT_VERSION);
    expect(Object.keys(envelope).sort()).toEqual([
      "configuration",
      "formatVersion",
      "operatingState",
      "session",
    ]);
    expect(JSON.stringify(envelope)).not.toMatch(/i10Save|integratedPartialSave|formatVersion":11/);
  });
});
