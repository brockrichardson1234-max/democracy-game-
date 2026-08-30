import { describe, expect, it } from "vitest";

import {
  POP0_I2_OFFICE_IDS,
  POP0_I3_CONTROL_BINDING_ID,
  POP0_I3_WORKSTREAM_ID,
} from "../src/content/pop0-v0/configuration";
import { computePresidentialInstrumentPayloadHash } from
  "../src/sim/presidential-operating-intervention";
import {
  POP0_I3_TRACE_IDS,
  createI3Escalation,
  createI3Workstream,
  createPop0I3Options,
  createPop0I3TraceSession,
  decideI3RequestOption,
  presentI3Escalation,
  runFullPop0I3Trace,
  runI3ThroughDecision,
} from "./pop0-i3-proof-fixture";

describe("POP0-I3 presidential intervention ownership", () => {
  it("keeps Attention empty until a separately presented valid escalation", () => {
    const session = createPop0I3TraceSession();
    expect(session.getPresidentialAttention()).toEqual([]);

    createI3Workstream(session);
    expect(session.getAdministrationWorkstream(POP0_I3_WORKSTREAM_ID).currentStatus).toBe("MONITORED");
    expect(session.getPresidentialAttention()).toEqual([]);

    createI3Escalation(session);
    expect(session.getPresidentialAttention()).toEqual([]);

    presentI3Escalation(session);
    const attention = session.getPresidentialAttention();
    expect(attention).toHaveLength(1);
    expect(attention[0]).toMatchObject({
      kind: "PRESENTED_ESCALATION",
      escalationId: POP0_I3_TRACE_IDS.escalation,
      optionIds: [
        POP0_I3_TRACE_IDS.requestOption,
        POP0_I3_TRACE_IDS.reserveOption,
        POP0_I3_TRACE_IDS.monitoringOption,
      ],
    });
    if (attention[0]?.kind !== "PRESENTED_ESCALATION") {
      throw new Error("Expected the bounded escalation Attention item.");
    }
    expect(attention[0].previews.map((preview) => preview.id)).toEqual([
      POP0_I3_TRACE_IDS.analysisPreview,
      POP0_I3_TRACE_IDS.coordinationPreview,
    ]);
  });

  it("uses session permission separately from presidential presentation identity", () => {
    const session = createPop0I3TraceSession();
    const binding = session.getControlBinding();
    expect(binding).toMatchObject({
      id: POP0_I3_CONTROL_BINDING_ID,
      decisionSurface: "PRESIDENTIAL_OPERATING_DECISION_SURFACE",
      status: "ACTIVE",
    });
    expect(session.getOperatingState().ownerStates).not.toHaveProperty("controlBinding");

    session.reconcilePresidentialControl();
    expect(session.getControlBinding()).toEqual(binding);
  });

  it("authorizes exactly the two visible payloads without dispatch or recipient result", () => {
    const session = createPop0I3TraceSession();
    runI3ThroughDecision(session);
    const state = session.getOperatingState();
    expect(state.ownerStates.presidentialDecisions.state).toHaveLength(1);
    expect(state.ownerStates.presidentialInstruments.state).toHaveLength(2);
    expect(state.ownerStates.instrumentDispatches.state).toEqual([]);
    expect(state.ownerStates.officeOperations.state.flatMap((office) => office.instrumentReceipts))
      .toEqual([]);
    expect(state.ownerStates.officeOperations.state.flatMap((office) => office.instrumentDispositions))
      .toEqual([]);
    expect(session.getPresidentialAttention()).toEqual([]);

    const visible = createPop0I3Options()[0];
    if (visible.kind !== "REQUEST_SCOPED_ANALYSIS_AND_COORDINATION") {
      throw new Error("Expected the exact request option.");
    }
    const instruments = state.ownerStates.presidentialInstruments.state;
    expect(instruments.map((instrument) => instrument.payload)).toEqual(
      visible.previews.map((preview) => preview.payload),
    );
    expect(instruments.map((instrument) => computePresidentialInstrumentPayloadHash(instrument.payload)))
      .toEqual(visible.previews.map((preview) => preview.payloadHash));
  });

  it("keeps dispatch, receipt, disposition, assignment, and workstream transition distinct", () => {
    const session = createPop0I3TraceSession();
    runFullPop0I3Trace(session);
    const state = session.getOperatingState();
    const omb = state.ownerStates.officeOperations.state.find(
      (office) => office.officeId === POP0_I2_OFFICE_IDS.omb,
    );
    const chief = state.ownerStates.officeOperations.state.find(
      (office) => office.officeId === POP0_I2_OFFICE_IDS.chiefOfStaff,
    );

    expect(state.ownerStates.instrumentDispatches.state).toHaveLength(2);
    expect(omb?.instrumentReceipts.map((entry) => entry.id)).toEqual([
      POP0_I3_TRACE_IDS.ombInstrumentReceipt,
    ]);
    expect(chief?.instrumentReceipts.map((entry) => entry.id)).toEqual([
      POP0_I3_TRACE_IDS.chiefOfStaffInstrumentReceipt,
    ]);
    expect(omb?.instrumentDispositions[0]).toMatchObject({
      kind: "NARROWED",
      acceptedProductKind: "METADATA_ACCESS_GAP_SCOPING",
    });
    expect(chief?.instrumentDispositions[0]).toMatchObject({
      kind: "ACCEPTED_AS_REQUESTED",
    });
    expect(omb?.assignments.some((entry) => entry.id === POP0_I3_TRACE_IDS.ombAssignment)).toBe(true);
    expect(chief?.assignments.some((entry) => entry.id === POP0_I3_TRACE_IDS.ombAssignment)).toBe(false);
    expect(session.getAdministrationWorkstream(POP0_I3_WORKSTREAM_ID).currentStatus).toBe("ACTIVE");
  });

  it("keeps recipient-owned outcomes out of the narrow presidential history projection", () => {
    const session = createPop0I3TraceSession();
    runFullPop0I3Trace(session);
    const history = session.getPresidentialHistory();
    expect(history.map((entry) => entry.recordKind)).toEqual([
      "PRESIDENTIAL_DECISION",
      "PRESIDENTIAL_INSTRUMENT",
      "PRESIDENTIAL_INSTRUMENT",
    ]);
    expect(JSON.stringify(history)).not.toMatch(/NARROWED|ACCEPTED|assignment|limitation/i);
    expect(session.getOperatingState().ownerStates.historicalRecordIndex.state.entries.length)
      .toBeGreaterThan(history.length);
  });

  it("does not use identifiers as behavioral dispatch keys", () => {
    const session = createPop0I3TraceSession();
    createI3Workstream(session);
    createI3Escalation(session);
    presentI3Escalation(session);
    decideI3RequestOption(session);
    const decision = session.getOperatingState().ownerStates.presidentialDecisions.state[0];
    expect(decision.selectedOptionKind).toBe("REQUEST_SCOPED_ANALYSIS_AND_COORDINATION");
    expect(decision.authorizedInstrumentIds).toEqual([
      POP0_I3_TRACE_IDS.ombInstrument,
      POP0_I3_TRACE_IDS.chiefOfStaffInstrument,
    ]);
  });
});
