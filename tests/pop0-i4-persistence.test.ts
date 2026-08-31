import { describe, expect, it } from "vitest";

import { createPresidentialOperatingProofSession } from
  "../src/app/presidential-operating-proof-session";
import { PRESIDENTIAL_OPERATING_SAVE_FORMAT_VERSION } from
  "../src/app/presidential-operating-persistence";
import {
  POP0_I4_IDS,
  POP0_V0_OPERATING_CONFIGURATION,
} from "../src/content/pop0-v0/configuration";
import {
  POP0_I4_TRACE_IDS,
  POP0_I4_TRACE_TIMES,
  createPop0I4TraceSession,
  runFullPop0I4Trace,
} from "./pop0-i4-proof-fixture";

const roundTrip = (saved: string): string =>
  createPresidentialOperatingProofSession(saved).save();

interface MutableI4Envelope {
  formatVersion: number;
  operatingState: {
    ownerStates: {
      programImplementation: {
        administrativeProgram: {
          waiverRequests: { id: string; supportingRecords: string[] }[];
        };
        materialInputs: { id: string; sourceRecordId: string }[];
      };
      materialHousing: {
        acceptedInputs: { id: string; sourceRecordId: string }[];
        projects: {
          id: string;
          stage: string;
          physicalProgressUnits: number;
          history: { id: string; causeInputIds: string[] }[];
        }[];
      };
      informationRoutes: {
        state: {
          artifacts: { id: string; canonicalArtifactHash?: string }[];
          officeArtifactProductions: { id: string; artifactId: string }[];
        };
      };
      historicalRecordIndex: {
        state: {
          entries: {
            occurrenceId: string;
            ownerId: string;
            recordKind: string;
            occurredAt: string;
            ownerRecordId: string;
            causalParentOccurrenceIds: string[];
          }[];
        };
      };
    };
  };
}

const envelopeOf = (saved: string): MutableI4Envelope =>
  JSON.parse(saved) as MutableI4Envelope;

describe("POP0-I4 atomic Housing persistence", () => {
  it("round-trips bounded I4 checkpoints byte-stably without replay", () => {
    const checkpoints: string[] = [];
    const session = createPop0I4TraceSession();
    checkpoints.push(session.save());
    runFullPop0I4Trace(session, () => checkpoints.push(session.save()));
    session.advanceTo(POP0_I4_TRACE_TIMES.laterHousing);
    checkpoints.push(session.save());

    expect(checkpoints.length).toBeGreaterThanOrEqual(16);

    for (const saved of checkpoints) {
      expect(roundTrip(saved)).toBe(saved);
      expect(roundTrip(roundTrip(saved))).toBe(saved);
    }
  });

  it("stores direct format-4 lower owners and reference-only I4 history", () => {
    const session = createPop0I4TraceSession();
    runFullPop0I4Trace(session);
    const saved = session.save();
    const envelope = envelopeOf(saved);
    const owners = envelope.operatingState.ownerStates;
    const historyKinds = owners.historicalRecordIndex.state.entries.map((entry) => entry.recordKind);

    expect(PRESIDENTIAL_OPERATING_SAVE_FORMAT_VERSION).toBe(4);
    expect(envelope.formatVersion).toBe(4);
    expect(owners.programImplementation.materialInputs.length).toBeGreaterThan(0);
    expect(owners.materialHousing.acceptedInputs.length).toBeGreaterThan(0);
    expect(historyKinds).toEqual(expect.arrayContaining([
      "DOMAIN_ARTIFACT_PRODUCTION",
      "DOMAIN_HANDLING_SUBMISSION",
      "LOWER_OWNER_RESULT",
      "MATERIAL_OWNER_INPUT_ADMISSION",
      "MATERIAL_OWNER_RESULT",
    ]));
    expect(saved).not.toContain("IntegratedPartialRuntimeSession");
    expect(saved).not.toContain('"formatVersion":11');
    expect(saved).not.toContain('"housingAdapterState"');
  });

  it("rejects format 3 instead of inventing Housing owners or I4 history", () => {
    const envelope = envelopeOf(createPop0I4TraceSession().save());
    envelope.formatVersion = 3;
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(envelope)))
      .toThrow(/Unsupported presidential operating save format: 3/);
  });

  it("rejects lower-owner, artifact-lineage, and history tampering", () => {
    const session = createPop0I4TraceSession();
    runFullPop0I4Trace(session);
    const original = session.save();

    const requestTamper = envelopeOf(original);
    const request = requestTamper.operatingState.ownerStates.programImplementation
      .administrativeProgram.waiverRequests.find((entry) =>
        entry.id === POP0_V0_OPERATING_CONFIGURATION.housing.handlingAuthority.targetRequestId);
    if (request === undefined) throw new Error("Missing Stables request in test fixture.");
    request.supportingRecords = request.supportingRecords.filter((entry) => entry !== "NONAVAILABILITY_RECORD");
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(requestTamper)))
      .toThrow(/supplemental|submission|supporting/i);

    const inputTamper = envelopeOf(original);
    const accepted = inputTamper.operatingState.ownerStates.materialHousing.acceptedInputs
      .find((entry) => entry.sourceRecordId !== "");
    if (accepted === undefined) throw new Error("Missing material input in test fixture.");
    accepted.sourceRecordId = "pop0.fabricated.lower-result";
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(inputTamper)))
      .toThrow(/input|source|canonical/i);

    const artifactTamper = envelopeOf(original);
    const artifact = artifactTamper.operatingState.ownerStates.informationRoutes.state.artifacts
      .find((entry) => entry.id === POP0_I4_IDS.supplementalArtifact);
    if (artifact === undefined) throw new Error("Missing supplemental artifact in test fixture.");
    artifact.canonicalArtifactHash = "0".repeat(64);
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(artifactTamper)))
      .toThrow(/hash|provenance|causal/i);

    const historyTamper = envelopeOf(original);
    const history = historyTamper.operatingState.ownerStates.historicalRecordIndex.state.entries
      .find((entry) => entry.occurrenceId === POP0_I4_TRACE_IDS.supplementalSubmission);
    if (history === undefined) throw new Error("Missing Department handling history in test fixture.");
    history.causalParentOccurrenceIds = [];
    expect(() => createPresidentialOperatingProofSession(JSON.stringify(historyTamper)))
      .toThrow(/historical|causal/i);
  });

  it("converges under coarse, fine, and save/load continuation", () => {
    const opening = createPop0I4TraceSession().save();
    const coarse = createPresidentialOperatingProofSession(opening);
    coarse.advanceTo(POP0_I4_TRACE_TIMES.laterHousing);

    const fine = createPresidentialOperatingProofSession(opening);
    fine.advanceTo("2029-02-05T18:00:00-05:00");
    fine.advanceTo("2029-02-06T06:00:00-05:00");
    fine.advanceTo(POP0_I4_TRACE_TIMES.laterHousing);

    const restored = createPresidentialOperatingProofSession(roundTrip(opening));
    restored.advanceTo("2029-02-06T06:00:00-05:00");
    const midway = restored.save();
    const continued = createPresidentialOperatingProofSession(midway);
    continued.advanceTo(POP0_I4_TRACE_TIMES.laterHousing);

    expect(fine.save()).toBe(coarse.save());
    expect(continued.save()).toBe(coarse.save());
  });
});
